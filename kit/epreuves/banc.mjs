/* LE BANC DES CRASH-TESTS DE PAGE — kit/epreuves/banc.mjs
   Le moteur (derivation.mjs) prédit ; le navigateur (Chromium, par
   Playwright) calcule la mise en page réelle ; on compare au dixième de
   pixel. Rien ici ne regarde un pixel à l'œil : on lit ce que le moteur
   de rendu a décidé (getComputedStyle), à trois largeurs d'écran et dans
   les trois densités.

   Lancer : npm run test:pages  (construit le site, puis node --test epreuves/*.test.mjs)
   Le site construit (.next) est servi par « next start » sur un port à part. */
import { spawn } from 'node:child_process'
import net from 'node:net'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { chaine, jetons, derive, PRIMAIRE_DEFAUT, REGISTRE, RACINE_NAVIGATEUR, DENSITES, INTENTIONS, HORS_CHAINE } from '../derivation.mjs'

export const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const LARGEURS = [320, 768, 1440]
export const DENSITES_SITE = ['compact', 'comfortable', 'airy']
export const TOL = 0.06 /* au dixième de pixel, avec l'arrondi du navigateur */

/* ── Le serveur du site construit ── */
const portLibre = () => new Promise((res) => { const s = net.createServer(); s.listen(0, '127.0.0.1', () => { const { port } = s.address(); s.close(() => res(port)) }) })
export async function ouvrirSite(port) {
  port ??= await portLibre()
  const proc = spawn(process.execPath, [path.join(KIT, 'node_modules/next/dist/bin/next'), 'start', '-p', String(port)], { cwd: KIT, stdio: ['ignore', 'pipe', 'pipe'] })
  const url = `http://127.0.0.1:${port}`
  process.on('exit', () => proc.kill()) /* jamais un serveur orphelin */
  const debut = Date.now()
  let sortie = ''
  proc.stdout.on('data', (d) => { sortie += d })
  proc.stderr.on('data', (d) => { sortie += d })
  while (Date.now() - debut < 30000) {
    try { const r = await fetch(url + '/rythme', { method: 'HEAD' }); if (r.ok) break } catch {}
    if (proc.exitCode !== null) throw new Error(`refus de statuer — le site ne démarre pas (a-t-on construit ? npm run build)\n${sortie}`)
    await new Promise((r) => setTimeout(r, 250))
  }
  return { url, fermer: () => { proc.kill() } }
}

/* ── Le navigateur ── */
export async function ouvrirNavigateur() {
  const navigateur = await chromium.launch()
  return {
    navigateur,
    /* Une page à une largeur, une densité, un thème — les réglages sont posés
       comme le site les lit (localStorage, relu au chargement par layout.tsx). */
    async page(url, { largeur = 1440, densite = 'comfortable', theme = 'light', hauteur = 900 } = {}) {
      const ctx = await navigateur.newContext({ viewport: { width: largeur, height: hauteur }, reducedMotion: 'reduce' })
      await ctx.addInitScript(({ densite, theme }) => {
        try {
          localStorage.clear()
          if (densite !== 'comfortable') localStorage.setItem('kit-density', densite)
          localStorage.setItem('kit-theme', theme)
        } catch {}
      }, { densite, theme })
      const p = await ctx.newPage()
      const erreurs = []
      p.on('pageerror', (e) => erreurs.push(String(e)))
      p.on('console', (m) => { if (m.type() === 'error') erreurs.push(m.text()) })
      await p.goto(url, { waitUntil: 'networkidle' })
      await p.evaluate(() => document.fonts.ready)
      return { p, erreurs, fermer: () => ctx.close() }
    },
    fermer: () => navigateur.close(),
  }
}

/* ── Ce que le moteur prédit, à une largeur d'écran ──
   Le CSS interpole DROIT entre les deux bornes (clamp), là où la pièce
   d'Auteur affiche une courbe adoucie : on prédit ce que le navigateur
   calcule, c'est-à-dire la valeur de clamp(). Un jeton fixe vaut sa valeur. */
const evalCss = (expr, W) => {
  const src = expr
    .replace(/(-?[\d.]+)rem/g, (_, v) => String(parseFloat(v) * RACINE_NAVIGATEUR))
    .replace(/(-?[\d.]+)vw/g, (_, v) => String((parseFloat(v) * W) / 100))
    .replace(/(-?[\d.]+)px/g, '$1')
  if (!/^[\d\s.,+\-*/()a-z]+$/i.test(src)) throw new Error(`refus de statuer — expression CSS non lue : ${expr}`)
  return Function('clamp', 'min', 'max', `return (${src})`)((a, b, c) => Math.min(Math.max(a, b), c), Math.min, Math.max)
}
/* Le registre à une base (la densité) — mis en cache. */
const registres = new Map()
export const registre = (base = DENSITES.comfortable) => {
  if (!registres.has(base)) registres.set(base, jetons(chaine({ base })))
  return registres.get(base)
}
/* La valeur d'un jeton (nom sans « -- ») à la largeur W, pour une base ; les
   alias var(--x) se résolvent dans le registre, puis dans le gabarit. */
export function attendu(nom, W, base = DENSITES.comfortable) {
  const j = registre(base)
  let css = j[nom]?.css ?? REGISTRE.doc[nom]
  /* les colonnes ne suivent pas la densité ; la marge de page change de cran avec le régime du rail */
  if (css === undefined && REGISTRE.docColonnes[nom]) {
    const source = W >= HORS_CHAINE.seuilRail * RACINE_NAVIGATEUR && REGISTRE.docColonnesBureau[nom] ? REGISTRE.docColonnesBureau[nom] : REGISTRE.docColonnes[nom]
    css = registre(DENSITES.comfortable)[source].css
  }
  if (css === undefined) throw new Error(`refus de statuer — jeton inconnu : ${nom}`)
  css = css.replace(/var\(--([a-z0-9-]+)\)/g, (_, n) => String(attendu(n, W, base)))
  return evalCss(css, W)
}
/* Les valeurs que le moteur peut produire à cette largeur — pour le balayage « rien en dur ». */
export function admissibles(W, base = DENSITES.comfortable) {
  const v = new Set([0])
  /* la chaîne à la base du site, et aux deux autres bases : une démo peut porter sa propre densité (data-density) */
  for (const b of new Set([base, ...Object.values(DENSITES)])) {
    for (const n of Object.keys(registre(b))) if (/^(pad|gap|edge|page)-|^r-|^control-height/.test(n)) v.add(attendu(n, W, b))
    for (const n of Object.keys(REGISTRE.doc)) v.add(attendu(n, W, b))
  }
  for (const n of Object.keys(REGISTRE.docColonnes)) v.add(attendu(n, W))
  /* le laboratoire : les six intentions, en px calculés par le moteur */
  for (const i of INTENTIONS) { const s = chaine(i); for (const x of [...s.pad, ...s.gap, ...s.r, s.rCtl]) v.add(x) }
  return [...v]
}
export const proche = (a, b, tol = TOL) => Math.abs(a - b) <= tol
export const dansLensemble = (x, ens, tol = TOL) => ens.some((v) => proche(x, v, tol))

/* Les encres, par thème — pour l'épreuve C17. */
export const encres = (theme) => derive(PRIMAIRE_DEFAUT)[theme]
export const rgb = (hex) => { const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)); return `rgb(${r}, ${g}, ${b})` }

/* Les nombres écrits « à la française » sur une page (« 17,1 ») → nombres. */
export const nombres = (texte) => [...texte.matchAll(/-?\d+(?:,\d+)?/g)].map((m) => parseFloat(m[0].replace(',', '.')))
/* L'écriture des pages : un chiffre après la virgule. */
export const px = (v) => String(Math.round(v * 10) / 10).replace('.', ',')

/* ── Les mesures dans la page ── */
export const calc = (p, sel, prop, index = 0) => p.evaluate(([sel, prop, i]) => {
  const el = document.querySelectorAll(sel)[i]
  if (!el) return null
  return getComputedStyle(el)[prop]
}, [sel, prop, index])
export const calcPx = async (p, sel, prop, index = 0) => { const v = await calc(p, sel, prop, index); return v === null ? null : parseFloat(v) }
export const texte = (p, sel, index = 0) => p.evaluate(([sel, i]) => document.querySelectorAll(sel)[i]?.textContent ?? null, [sel, index])
export const textes = (p, sel) => p.evaluate((sel) => [...document.querySelectorAll(sel)].map((e) => e.textContent), sel)

/* ── Les crans de texte que le moteur produit à cette largeur (le texte ne suit pas la densité). ── */
export function taillesAdmissibles(W) {
  const v = new Set()
  for (const n of Object.keys(registre())) if (/^font-size-/.test(n)) v.add(attendu(n, W))
  for (const n of ['doc-cover', 'doc-section']) v.add(attendu(n, W))
  return [...v]
}
/* Lire une feuille bloc par bloc : pour chaque ligne, le sélecteur du bloc où elle vit
   (un bloc peut s'ouvrir sur une ligne et se déclarer sur les suivantes). */
export function lignesAvecSelecteur(cssSrc) {
  const out = []
  let courant = null
  for (const l of cssSrc.split('\n')) {
    const ouverture = l.match(/^\s*([^{}/][^{]*?)\s*\{/)
    const sel = ouverture ? ouverture[1].trim() : courant
    if (sel) out.push([sel, l])
    if (ouverture && !/\}/.test(l.slice(l.indexOf('{')))) courant = ouverture[1].trim()
    if (/\}/.test(l) && !ouverture) courant = null
    if (ouverture && /\}/.test(l.slice(l.indexOf('{')))) courant = null
  }
  return out
}
/* Les sélecteurs d'une feuille dont la ligne pose la propriété ET la dit « hors chaîne » ou « casse » :
   ce sont les seules exceptions admises au balayage. */
export function selecteursDeclares(cssSrc, prop) {
  const rx = new RegExp(`(^|[\\s;{])${prop}\\s*:`)
  return [...new Set(lignesAvecSelecteur(cssSrc).filter(([, l]) => rx.test(l) && /hors chaîne|casse/.test(l)).map(([s]) => s))]
}
/* Les sélecteurs dont la propriété est une proportion en em (un point sous un titre, l'unité d'un
   chiffre, l'espace d'une flèche) : une proportion typographique, pas un cran — admise par le vérificateur du site. */
export function selecteursEnEm(cssSrc, prop = 'font-size') {
  const rx = new RegExp(`(^|[\\s;{])${prop}\\s*:\\s*[\\d.]+em\\b`)
  return [...new Set(lignesAvecSelecteur(cssSrc).filter(([, l]) => rx.test(l)).map(([s]) => s))]
}
/* ── « Rien en dur » pour les tailles de texte : dans les corps de sections, chaque
   corps calculé est un cran du moteur à cette largeur, sauf déclaré (sélecteurs dits
   « hors chaîne » / « casse » dans la feuille, casses data-intent, valeurs passées). ── */
export async function fautesTailles(p, W, { exclusions = [], admis = [], racine = 'main .gdoc-corps' } = {}) {
  const ens = [...taillesAdmissibles(W), ...admis]
  return p.evaluate(([racine, ens, exclusions, tol]) => {
    const fautes = []
    for (const el of document.querySelectorAll(`${racine} *`)) {
      const exclu = exclusions.some((s) => { try { return el.matches(s) } catch { return false } })
      if (el.closest('[data-intent="statement"]') || exclu) continue
      if (!el.textContent.trim()) continue
      const v = parseFloat(getComputedStyle(el).fontSize)
      if (!ens.some((x) => Math.abs(x - v) <= tol)) fautes.push(`${el.tagName.toLowerCase()}.${[...el.classList].join('.')} font-size: ${v}px`)
    }
    return [...new Set(fautes)]
  }, [racine, ens, exclusions, TOL])
}

/* ── Zéro débord : la page ne dépasse jamais la largeur de l'écran (invariant d'audit, règle 15). ── */
export const debord = (p) => p.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth))

/* ── C17, mesuré : tout élément dont l'encre calculée est le tertiaire porte
   600 au moins, ne descend pas sous le cran étiquette, et n'est pas un
   paragraphe de texte lu. ── */
export async function fautesC17(p, theme, W) {
  const tertiaire = rgb(encres(theme)['text-tertiary'])
  const label = attendu('font-size-label', W)
  return p.evaluate(([tertiaire, label, tol]) => {
    const fautes = []
    for (const el of document.querySelectorAll('main *')) {
      const cs = getComputedStyle(el)
      if (cs.color !== tertiaire || !el.textContent.trim()) continue
      const decrire = () => `${el.tagName.toLowerCase()}.${[...el.classList].join('.')} « ${el.textContent.trim().slice(0, 40)} »`
      if (parseInt(cs.fontWeight) < 600) fautes.push(`${decrire()} — graisse ${cs.fontWeight} (600 au moins)`)
      if (parseFloat(cs.fontSize) < label - tol) fautes.push(`${decrire()} — corps ${cs.fontSize} sous le cran étiquette`)
      if (el.tagName === 'P' && el.textContent.trim().length > 160) fautes.push(`${decrire()} — un paragraphe lu en tertiaire`)
    }
    return fautes
  }, [tertiaire, label, TOL])
}

/* ── « Rien en dur », mesuré : dans les corps de sections, chaque marge,
   espace ou coin calculé appartient aux valeurs que le moteur produit à
   cette largeur — sauf casse déclarée (data-intent="statement") et sauf les
   blocs d'espace eux-mêmes, qui SONT des jetons rendus visibles. ── */
export async function fautesEnDur(p, W, base, { racine = 'main .gdoc-corps', exclusions = [] } = {}) {
  const ens = admissibles(W, base)
  return p.evaluate(([racine, ens, exclusions, tol]) => {
    const ok = (x) => x === 0 || ens.some((v) => Math.abs(v - x) <= tol)
    const fautes = []
    const props = ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'rowGap', 'columnGap', 'borderTopLeftRadius']
    for (const el of document.querySelectorAll(`${racine} *`)) {
      if (el.closest('[data-intent="statement"]') || el.classList.contains('espace')) continue
      if (exclusions.some((s) => { try { return el.matches(s) } catch { return false } })) continue
      const cs = getComputedStyle(el)
      for (const prop of props) {
        const v = cs[prop]
        if (v === 'normal' || v === '' || v === undefined) continue
        const n = parseFloat(v)
        if (Number.isNaN(n) || v.endsWith('%')) continue
        if (n >= 9999) continue /* la pilule */
        if (!ok(n)) fautes.push(`${el.tagName.toLowerCase()}.${[...el.classList].join('.')} ${prop}: ${v}`)
      }
    }
    return [...new Set(fautes)]
  }, [racine, ens, exclusions, TOL])
}
