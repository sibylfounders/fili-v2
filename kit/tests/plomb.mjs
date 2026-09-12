/* LE RELEVÉ DU PLOMB — kit/tests/plomb.mjs (11 septembre 2026, journal #138)

   node kit/tests/plomb.mjs [--width 1440] [--url http://localhost:3001]

   Une ligne de texte porte la moitié de son interligne au-dessus et au-dessous de
   ses lettres. Entre deux textes ce plomb s'ajoute deux fois ; contre le bord franc
   d'une scène il ne s'ajoute qu'une. L'espace VU n'est donc pas l'espace RÉGLÉ tant
   que la page n'a pas repris son plomb, et le rapport entre un écart intérieur et
   sa frontière ment.

   Le relevé ne modélise plus l'encre — il vérifie deux choses séparément, chacune
   mesurable sans deviner :

   1 · LA COUPE — au bord d'une pièce, un texte porte-t-il sa coupe (une marge
       égale à son demi-plomb) ? Sans elle, la boîte n'est pas l'encre et tout le
       reste ment.
   2 · L'ÉCART — l'espace posé entre deux voisins (le gap du contenant, plus le
       supplément qu'un bord franc appelle) est-il celui que la loi prescrit, vu
       la nature des deux bords ?

       écart intérieur   texte ↔ texte   gap-2   ·   contre une scène   gap-1
       frontière         texte ↔ texte   pad-1   ·   contre une scène   page-1

   🔴 sur un écart faux, ou sur du plomb oublié. Code 1 si quoi que ce soit rougit. */
import { chromium } from 'playwright'

const args = process.argv.slice(2)
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d }
const W = parseInt(opt('--width', '1440'), 10)
const BASE = opt('--url', 'http://localhost:3001')
/* les sept pages qui ont un gabarit ; /adaptation entre le 12 septembre 2026 (`#146`) —
   elle passait déjà la loi, elle n'était simplement jamais relevée */
const PAGES = ['rythme', 'composition', 'couleur', 'arrondis', 'typo', 'mouvement', 'adaptation']
const COMBIEN = { 5: 'cinq', 6: 'six', 7: 'sept' }

/* ce qu'on attend d'un contenant : le jeton d'un voisinage entre textes, celui d'un
   voisinage qui bute sur une scène (un cran au-dessus) */
const LOI = {
  'gdoc-body': { texte: '--pad-1-block', franc: '--page-1-block', quoi: 'frontière du corps' },
  'gd-figure': { texte: '--gap-2-block', franc: '--gap-1-block', quoi: 'écart intérieur d’une figure' },
  'gdoc-sec-head': { texte: '--gap-2-block', franc: '--gap-1-block', quoi: 'écart intérieur d’une tête de section' },
  'doc-piece-head': { texte: '--gap-2-block', franc: '--gap-1-block', quoi: 'écart intérieur d’une tête de pièce' },
}

const probe = (LOI) => {
  const R = []
  /* Un jeton ne se lit pas : getPropertyValue rend le clamp() tel quel, jamais des pixels.
     On le MESURE — une sonde haute d'un jeton, posée dans le corps, et on lit sa hauteur. */
  const sonde = document.createElement('div')
  sonde.style.cssText = 'position:absolute;visibility:hidden;width:1px'
  document.body.append(sonde)
  const tok = (n) => { sonde.style.height = `var(${n})`; return sonde.getBoundingClientRect().height }
  const vis = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.display !== 'none' }
  const franc = (el) => {
    const s = getComputedStyle(el)
    if (['IMG', 'SVG', 'CANVAS', 'VIDEO'].includes(el.tagName)) return true
    /* une commande peint, mais elle n'est pas une scène : elle est seconde par
       rapport au phénomène, et sa place change avec la largeur */
    if (el.tagName === 'BUTTON' || el.closest('button')) return false
    if (s.backgroundColor && s.backgroundColor !== 'rgba(0, 0, 0, 0)') return true
    if (s.backgroundImage && s.backgroundImage !== 'none') return true
    /* un filet d'un pixel n'est pas une scène : il sépare déjà, et la loi l'exempte */
    if (parseFloat(s.borderTopWidth) > 1 || parseFloat(s.borderBottomWidth) > 1) return true
    return false
  }
  const nm = (el) => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (String(el.className || '').trim() ? '.' + String(el.className).trim().split(/\s+/).slice(0, 2).join('.') : '')
  /* le bord d'un élément : le dernier descendant qui le touche. Franc → plomb nul.
     Texte → le plomb qui reste, une fois retirée la coupe que l'élément s'applique. */
  const edge = (el, side) => {
    let cur = el, g = 0, sur = false
    while (g++ < 12) {
      if (franc(cur)) return { kind: 'franc', who: nm(cur), coupe: null }
      const r = cur.getBoundingClientRect()
      const kids = [...cur.children].filter(vis)
      if (!kids.length) break
      const t = kids.filter((k) => { const kr = k.getBoundingClientRect(); return side === 'top' ? Math.abs(kr.top - r.top) < 2 : Math.abs(kr.bottom - r.bottom) < 2 })
      if (t.length !== 1) { sur = true; break } /* la descente ne tranche pas : on ne juge pas la coupe ici */
      cur = t[0]
    }
    if (franc(cur)) return { kind: 'franc', who: nm(cur), coupe: null }
    if (!(cur.textContent || '').trim()) return { kind: 'vide', who: nm(cur), coupe: null }
    if (sur) return { kind: 'texte', who: nm(cur), coupe: null }
    const s2 = getComputedStyle(cur)
    const fs = parseFloat(s2.fontSize)
    const lh = s2.lineHeight === 'normal' ? fs * 1.2 : parseFloat(s2.lineHeight)
    const du = (lh - fs) / 2
    const faite = -parseFloat(side === 'top' ? s2.marginTop : s2.marginBottom)
    const m = -parseFloat(side === 'top' ? s2.marginTop : s2.marginBottom)
    const sup2 = s2.getPropertyValue('--supplement').trim() === '1'
    return { kind: 'texte', who: nm(cur), du, sup2, faite: m, coupe: Math.round((m - du) * 10) / 10 }
  }

  for (const [cls, loi] of Object.entries(LOI)) {
    document.querySelectorAll('.' + cls).forEach((box) => {
      const kids = [...box.children].filter(vis)
      for (let i = 0; i < kids.length - 1; i++) {
        const a = kids[i], b = kids[i + 1]
        const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect()
        if (rb.top < ra.bottom - 1) continue
        const ea = edge(a, 'bottom'), eb = edge(b, 'top')
        if (ea.kind === 'vide' || eb.kind === 'vide') continue
        /* un filet sépare déjà : la loi l'exempte */
        const filet = [a, b].some((e) => { const t = getComputedStyle(e); return parseFloat(t.borderTopWidth) > 0 && parseFloat(t.borderTopWidth) <= 1 })
        if (filet) continue
        const contreScene = ea.kind === 'franc' || eb.kind === 'franc'
        const jeton = contreScene ? loi.franc : loi.texte
        const attendu = tok(jeton)
        const sb = getComputedStyle(b), sa = getComputedStyle(a)
        /* L'ESPACE POSÉ — le gap du contenant, plus le supplément si le voisin le
           déclare. La marge, elle, mêle le supplément et la coupe : on ne la lit pas
           comme un espace, on la relit comme une coupe (ci-dessous). */
        const sup = sb.getPropertyValue('--supplement').trim() === '1'
        const supPx = tok(loi.franc) - tok(loi.texte)
        const ecart = parseFloat(getComputedStyle(box).rowGap || 0) + (sup ? supPx : 0)
        R.push({ cls, quoi: loi.quoi, a: nm(a), b: nm(b), nature: `${ea.kind}→${eb.kind}`,
          qa: ea.who, qb: eb.who, jeton,
          ecart: Math.round(ecart * 10) / 10, attendu: Math.round(attendu * 10) / 10,
          coupes: [ea, eb].map((e) => {
            if (e.coupe === null) return null
            /* la marge mêle supplément et coupe : on retire le supplément avant de juger */
            const c = Math.round((e.faite + (e.sup2 ? supPx : 0) - e.du) * 10) / 10
            return Math.abs(c) > 0.5 ? `${e.who} ${c > 0 ? 'coupe de trop' : 'plomb non rendu'} ${Math.abs(c)}` : null
          }).filter(Boolean) })
      }
    })
  }
  return R
}

const br = await chromium.launch()

/* RIEN N'EST VERT TANT QUE LA CAPACITÉ À ÉCHOUER N'EST PAS PROUVÉE : on remet
   l'ancien réglage à la volée sur une page (frontière à un cran, plomb non rendu)
   et le relevé doit rougir. Sinon il ne mesure rien — refus de statuer, code 2. */
/* Deux mutations, chacune visant un geste. Cumulées elles se compenseraient —
   c'est tout le sujet de #138 : le plomb non rendu masquait la frontière trop
   courte. Elles sont donc jouées séparément. */
const MUTATIONS = [
  { nom: 'la frontière retombe à deux crans contre une scène',
    css: '.gdoc-body>*+*{margin-top:0!important}.gd-figure>*+*{margin-top:0!important}' },
  { nom: 'le gabarit ne rend plus son plomb',
    css: ':is(.gdoc-sec-head,.doc-piece-head,.gdoc-body,details.prov>div)>:is(h1,h2,h3,h4,p,.kicker,.lede,.muted),.gd-caption,details.prov>summary{margin-block:0!important}' },
]
for (const m of MUTATIONS) {
  const ctx = await br.newContext({ viewport: { width: W, height: 1000 }, reducedMotion: 'reduce' })
  const p = await ctx.newPage()
  await p.goto(`${BASE}/rythme`, { waitUntil: 'networkidle' })
  await p.addStyleTag({ content: m.css })
  await p.waitForTimeout(200)
  const rows = await p.evaluate(probe, LOI)
  const bad = rows.filter((r) => Math.abs(r.ecart - r.attendu) > 1.5 || r.coupes.length)
  await ctx.close()
  if (!bad.length) { console.log(`⛔ refus de statuer — « ${m.nom} » ne fait pas rougir le relevé`); await br.close(); process.exit(2) }
  console.log(`contre-épreuve · ${m.nom} → ${bad.length} voisinages rouges sur /rythme`)
}

let rouge = 0
for (const slug of PAGES) {
  const ctx = await br.newContext({ viewport: { width: W, height: 1000 }, reducedMotion: 'reduce' })
  const p = await ctx.newPage()
  await p.goto(`${BASE}/${slug}`, { waitUntil: 'networkidle' })
  await p.evaluate(() => document.fonts.ready)
  await p.waitForTimeout(200)
  const rows = await p.evaluate(probe, LOI)
  const bad = rows.filter((r) => Math.abs(r.ecart - r.attendu) > 1.5 || r.coupes.length)
  rouge += bad.length
  console.log(`\n${bad.length ? '🔴' : '🟢'} /${slug} — ${W} px — ${rows.length} voisinages, ${bad.length} faux`)
  const seen = new Map()
  for (const r of bad) {
    const k = `${r.quoi} │ ${r.nature} │ ${r.a} → ${r.b}`
    if (seen.has(k)) { seen.set(k, seen.get(k) + 1); continue }
    seen.set(k, 1)
    console.log(`   ${k}\n      écart ${r.ecart} — attendu ${r.attendu} (${r.jeton})${r.coupes.length ? `\n      ${r.coupes.join(' · ')}` : ''}`)
  }
  await ctx.close()
}
await br.close()
console.log(rouge ? `\n🔴 ${rouge} voisinages faux` : `\n🟢 les ${COMBIEN[PAGES.length] ?? PAGES.length} pages tiennent la loi`)
process.exit(rouge ? 1 : 0)
