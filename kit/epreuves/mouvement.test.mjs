/* LE CRASH-TEST DE LA PAGE MOUVEMENT — kit/epreuves/mouvement.test.mjs
   Ce qui doit être vrai à l'écran, mesuré sans l'œil (écrit le 7 septembre
   2026, avec la page) :
   1 · chaque chiffre affiché est LU, jamais déclaré — les quatre situations
       jouent la durée de leur emploi et la légende lit ce qui a été joué ; le
       retard de la main invisible est l'écart réel entre les deux barres, image
       par image, peint en rouge à sa vraie largeur ;
   2 · chaque pièce du kit est rendue par son jeton : la fiche est une carte, le
       cadre une surface, le menu une card, la paire deux colonnes de coque ; la
       main est au bout de la barre, les trois pistes partagent le même bord ;
   3 · tout ce qui bouge sur la page prend un cran du moteur et la courbe du kit —
       sauf ce qui se déclare casse, et chaque casse dit sa faute sur sa ligne ;
   4 · chaque casse rend le mensonge qu'elle déclare, et le verdict est DÉDUIT du
       rendu : les quatre Do / Don't, les quatre bandes ;
   5 · sous mouvement réduit, les boucles se figent et s'avancent à la main, les
       déplacements partent et les fondus restent — mesuré dans les deux
       réglages ; et trois des quatre Don't cessent d'être des fautes, parce que
       leur faute était un déplacement ;
   6 · la densité règle les coques, jamais un corps ; les titres glissent ; le
       tertiaire suit C17 ; rien en dur ; zéro débord ; zéro erreur ; la page est
       une fondation dans le menu, et ses étages sont comptés.

   Ce que cette épreuve NE juge PAS, et dit : si 100 ms « se sent » et si 700
   « s'attend ». Une durée se juge à l'œil ; l'épreuve vérifie seulement que la
   page joue bien celles qu'elle annonce. */
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { DENSITES, MOUVEMENT } from '../derivation.mjs'
import { KIT, LARGEURS, TOL, ouvrirSite, ouvrirNavigateur, attendu, proche, calcPx, calc, texte, textes, fautesC17, fautesEnDur, fautesTailles, selecteursDeclares, selecteursEnEm, lignesAvecSelecteur, debord } from './banc.mjs'

const ok = (a, b, msg, tol = TOL) => assert.ok(a !== null && proche(a, b, tol), `${msg} : ${a} attendu ${b}`)
const CSS = () => fs.readFileSync(path.join(KIT, 'app/mouvement/mouvement.css'), 'utf8')
const GLOBALES = () => fs.readFileSync(path.join(KIT, 'app/globals.css'), 'utf8')
const MS = Object.values(MOUVEMENT.durees).map((d) => d.ms)
const enMs = (s) => { const v = parseFloat(s); return s.trim().endsWith('ms') ? v : v * 1000 }

let site, nav
before(async () => { site = await ouvrirSite(); nav = await ouvrirNavigateur() })
after(async () => { await nav?.fermer(); site?.fermer() })
const URL = () => site.url + '/mouvement'
/* Le banc ouvre tout sous mouvement réduit. Cette page a besoin des deux
   réglages : une page « libre » est la même, sans la demande de réduction. */
async function pageLibre(url, { largeur = 1440 } = {}) {
  const ctx = await nav.navigateur.newContext({ viewport: { width: largeur, height: 900 }, reducedMotion: 'no-preference' })
  await ctx.addInitScript(() => { try { localStorage.clear(); localStorage.setItem('kit-theme', 'light') } catch {} })
  const p = await ctx.newPage()
  const erreurs = []
  p.on('pageerror', (e) => erreurs.push(String(e)))
  await p.goto(url, { waitUntil: 'networkidle' })
  await p.evaluate(() => document.fonts.ready)
  return { p, erreurs, fermer: () => ctx.close() }
}
/* Sous mouvement réduit — le réglage du banc — les boucles ne tournent pas
   seules : on les avance à la main, comme le ferait un lecteur. */
const etape = (p, sec) => p.locator(`${sec} .mv-commande`).click()
const choisir = (p, nom) => p.locator('#mots .mv-choix .bouton', { hasText: nom }).click()
const lus = (p) => p.$$eval('#mots .mv-lu', (es) => es.map((e) => [e.dataset.verdict, e.textContent]))
const bande = (i) => `#casser .doc-bande:nth-child(${i})`
const casser = (p, i) => p.locator(`${bande(i)} .doc-casser`).click()
const badge = (p, i) => texte(p, `${bande(i)} .mv-scene .badge`)

/* ── 1 · Chaque chiffre affiché est lu ── */
test('1 · quatre situations : à chaque étape l’objet qui répond joue la durée de son emploi, lue sur le rendu ; la légende lit les quatre crans ; la cinquième est la faute — un menu au cran expressif', async () => {
  const { p, fermer } = await nav.page(URL(), { largeur: 1440 })
  await p.locator('#durees').scrollIntoViewIfNeeded()
  assert.match(await texte(p, '#durees .mv-commande'), /Étape suivante/, 'réduit : la boucle se fige et s\'avance à la main')
  const emplois = Object.values(MOUVEMENT.durees).map((d) => d.emploi)
  const objets = ['.mv-obj-bouton', '.mv-menu', '.mv-panneau', '.mv-obj-section']
  for (let i = 0; i < MS.length; i++) {
    if (i > 0) { await etape(p, '#durees'); await p.waitForTimeout(150) }
    assert.equal(await p.locator(`#durees .mv-cadre ${objets[i]}[data-joue]`).count(), 1, `étape ${i} : l'objet de la situation est ${objets[i]}`)
    assert.equal(enMs(await calc(p, `#durees .mv-cadre [data-joue]`, 'transitionDuration')), MS[i], `étape ${i} : il joue ${MS[i]} ms`)
    assert.match(await texte(p, '#durees .mv-cas-duree b'), new RegExp(`^${MS[i]} ms`)); assert.equal(await texte(p, '#durees .mv-cas-duree span'), emplois[i])
    assert.equal(await p.getAttribute('#durees .mv-cadre', 'data-intent'), null, `étape ${i} : pas une casse`)
  }
  assert.match(await texte(p, '#durees .gd-legende'), new RegExp(`^${MS.join(' · ')} ms, lus sur le rendu`), 'la légende dit ce qui a été joué')
  await etape(p, '#durees'); await p.waitForTimeout(150)
  assert.equal(enMs(await calc(p, '#durees .mv-cadre .mv-menu[data-joue]', 'transitionDuration')), MOUVEMENT.durees.expressive.ms, 'la faute : un menu au cran expressif')
  assert.equal(await p.getAttribute('#durees .mv-cadre', 'data-intent'), 'statement', 'déclarée')
  assert.equal(await texte(p, '#durees .mv-cas-duree.ko span'), 'il traîne')
  await etape(p, '#durees'); await p.waitForTimeout(150)
  assert.equal(enMs(await calc(p, '#durees .mv-cadre [data-joue]', 'transitionDuration')), MS[0], 'et la boucle recommence')
  await fermer()
})
test('1 · la main invisible : la barre du bas est en retard sur celle du haut, image par image, l’écart est peint en rouge à sa vraie largeur et chiffré ; puis les deux se rejoignent et le sous-titre dit le pic mesuré', async () => {
  const { p, fermer } = await nav.page(URL(), { largeur: 1440 })
  await p.locator('#molette').scrollIntoViewIfNeeded(); await p.waitForTimeout(600)
  /* réduit : à l'étape 0 la main saute au départ puis à l'arrivée — la barre du bas, elle, traîne quand même (c'est sa casse) ; on la refait partir */
  await etape(p, '#molette'); await etape(p, '#molette'); await etape(p, '#molette'); await p.waitForTimeout(80)
  const piste = await p.$eval('#molette .mv-piste', (e) => e.getBoundingClientRect().width)
  const film = await p.evaluate(() => new Promise((res) => {
    const lire = () => { const [g, d] = [...document.querySelectorAll('#molette .mv-jauge-barre')].map((e) => e.getBoundingClientRect().width)
      const r = document.querySelector('#molette .mv-mensonge'), rr = r && !r.hidden ? r.getBoundingClientRect() : null
      return { g, d, rouge: rr ? rr.width : null, cote: document.querySelector('#molette .mv-mensonge-cote')?.textContent ?? '', st: document.querySelector('#molette .mv-sous-titre').textContent } }
    const out = []; let n = 0
    const pas = () => { out.push(lire()); if (++n < 14) requestAnimationFrame(pas); else res(out) }
    requestAnimationFrame(pas)
  }))
  const ecarts = film.map((f) => Math.abs(f.g - f.d))
  assert.ok(ecarts[0] > 5, `à la première image, celle du bas est loin derrière : ${ecarts[0]} px`)
  assert.ok(ecarts.slice(1).every((e, i) => e <= ecarts[i] + TOL), `le retard ne fait que diminuer : ${ecarts.map((e) => e.toFixed(1)).join(' ')}`)
  const pendant = film.map((f, i) => ({ ...f, i })).filter((f) => f.rouge !== null)
  assert.ok(pendant.length >= 2, 'pendant le retard, le rouge est peint')
  for (const f of pendant) {
    /* le rouge est peint à partir de ce qui a été lu : jamais plus large que l'écart entier, jamais plus étroit que l'écart de cette image, et il ne fait que fondre */
    assert.ok(f.rouge >= ecarts[f.i] - 2.5 && f.rouge <= piste * 0.62 + 1, `le rouge couvre l'écart rendu (${f.rouge.toFixed(1)} pour ${ecarts[f.i].toFixed(1)})`)
    assert.match(f.cote, /px$/); assert.match(f.st, /traîne : [\d,]+ px derrière/)
  }
  assert.ok(pendant.slice(1).every((f, k) => f.rouge <= pendant[k].rouge + TOL), 'le rouge ne fait que fondre')
  const lu = Math.max(...pendant.map((f) => parseFloat(f.cote.replace(',', '.'))))
  assert.ok(lu >= Math.min(...ecarts) - TOL && lu <= piste * 0.62 + 1, `le chiffre du rouge (${lu}) est un écart rendu`)
  await p.waitForTimeout(MOUVEMENT.durees.slow.ms + 200)
  const [g, d] = await p.$$eval('#molette .mv-jauge-barre', (es) => es.map((e) => e.getBoundingClientRect().width))
  ok(g, d, 'les deux barres se sont rejointes', 0.5)
  assert.equal(await p.locator('#molette .mv-mensonge:not([hidden])').count(), 0, 'le rouge a fondu')
  await etape(p, '#molette'); await p.waitForTimeout(120)
  const st = await texte(p, '#molette .mv-sous-titre')
  const pic = parseFloat((st.match(/menti de ([\d,]+) px/) ?? [])[1]?.replace(',', '.'))
  assert.ok(pic >= Math.max(...ecarts) - TOL && pic <= piste * 0.62 + 1, `le sous-titre dit le pic mesuré (${pic}), au moins le plus grand écart vu (${Math.max(...ecarts).toFixed(1)})`)
  await etape(p, '#molette'); await p.waitForTimeout(120)
  assert.match(await texte(p, '#molette .mv-sous-titre.regle'), /une valeur qu'on fait glisser ne s'anime pas/, 'la règle, en dernier')
  await fermer()
})

/* ── 2 · Chaque pièce du kit est rendue par son jeton ── */
test('2 · la fiche est une carte, la main est au bout de la barre et les trois pistes partagent le même bord ; le cadre une surface, le menu une card ; la paire d’une bande est deux colonnes de coque ; la légende parle au cran étiquette', async () => {
  for (const W of LARGEURS) {
    const { p, fermer } = await nav.page(URL(), { largeur: W })
    ok(await calcPx(p, '#molette .mv-fiche', 'paddingTop'), attendu('pad-2-block', W), `${W} — la fiche, marge de carte`)
    ok(await calcPx(p, '#molette .mv-fiche', 'borderTopLeftRadius'), attendu('r-2', W), `${W} — la fiche, coin de carte`)
    ok(await calcPx(p, `${bande(1)} .mv-duo`, 'rowGap'), attendu('pad-1-block', W), `${W} — la paire, l'écart de coque`)
    /* la pile : la piste de la main et les deux barres commencent et finissent au même bord, et la main est au bout de la barre juste — l'œil ne bouge pas */
    const pistes = await p.$$eval('#molette .mv-trace, #molette .mv-jauge-piste', (es) => es.map((e) => { const r = e.getBoundingClientRect(); return [r.left, r.right] }))
    assert.equal(pistes.length, 3, `${W} — une piste, deux barres`)
    for (const [g, d] of pistes.slice(1)) assert.ok(Math.abs(g - pistes[0][0]) < 1 && Math.abs(d - pistes[0][1]) < 1, `${W} — même bord (${g}→${d} contre ${pistes[0]})`)
    const [doigt, barre] = await p.$$eval('#molette .mv-doigt, #molette .mv-jauge-barre', (es) => es.map((e) => { const r = e.getBoundingClientRect(); return { c: (r.left + r.right) / 2, d: r.right } }))
    assert.ok(Math.abs(doigt.c - barre.d) < 1, `${W} — la main est au bout de la barre (${doigt.c} / ${barre.d})`)
    ok(await calcPx(p, '#durees .mv-cadre', 'paddingTop'), attendu('pad-2-block', W), `${W} — le cadre, marge de profondeur 2`)
    ok(await calcPx(p, '#durees .mv-cadre', 'borderTopLeftRadius'), attendu('r-2', W), `${W} — le cadre, coin de profondeur 2`)
    ok(await calcPx(p, '#mots .mv-menu', 'borderTopLeftRadius'), attendu('r-2', W), `${W} — le menu, coin de card`)
    ok(await calcPx(p, '#mots .mv-menu', 'paddingTop'), attendu('pad-3-block', W), `${W} — le menu, marge de ligne`)
    ok(await calcPx(p, '#mots .mv-menu-item', 'minHeight'), attendu('control-height-compact', W), `${W} — une entrée de menu, la cible compacte`)
    ok(await calcPx(p, '#molette .gd-legende', 'fontSize'), attendu('font-size-label', W), `${W} — la légende au cran étiquette`)
    const [g, d] = await p.$$eval(`#casser .doc-bande:nth-child(1) .mv-cote`, (es) => es.map((e) => { const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, b: r.bottom } }))
    if (W >= 640) { ok(await calcPx(p, `${bande(1)} .mv-duo`, 'columnGap'), attendu('pad-1-inline', W), `${W} — l'écart entre les colonnes`); assert.ok(Math.abs(g.y - d.y) < 1 && d.x > g.x + g.w, `${W} — deux colonnes côte à côte`) }
    else assert.ok(d.y >= g.b - TOL && Math.abs(d.x - g.x) < 1, `${W} — sur téléphone, la paire s'empile`)
    await fermer()
  }
})

/* ── 3 · Tout ce qui bouge prend un cran et la courbe ── */
test('3 · sur le rendu, chaque transition d’un objet de la page dure un cran du moteur et suit la courbe du kit — hors des casses déclarées', async () => {
  const { p, fermer } = await pageLibre(URL())
  const fautes = await p.evaluate(([MS, courbe]) => {
    const f = []
    for (const el of document.querySelectorAll('main [class*="mv-"]')) {
      if (el.closest('[data-intent="statement"]')) continue
      const cs = getComputedStyle(el)
      if (cs.transitionProperty === 'all' && cs.transitionDuration === '0s') continue
      const durees = cs.transitionDuration.split(',').map((d) => { const v = parseFloat(d); return d.trim().endsWith('ms') ? v : v * 1000 })
      for (const ms of durees) if (ms !== 0 && !MS.includes(ms)) f.push(`${el.className} : ${ms} ms n'est pas un cran`)
      for (const c of cs.transitionTimingFunction.split(/,(?![^(]*\))/)) if (durees.some((m) => m > 0) && c.trim() !== courbe) f.push(`${el.className} : courbe ${c.trim()}`)
    }
    return [...new Set(f)]
  }, [MS, MOUVEMENT.courbe])
  assert.deepEqual(fautes, [], `${fautes.length} mouvement(s) hors moteur`)
  await fermer()
})
test('3 · la feuille : aucune durée ni courbe à la main hors d’une ligne qui se dit casse, et chaque casse de la page est dite', () => {
  const css = CSS()
  for (const [sel, l] of lignesAvecSelecteur(css)) {
    const nu = l.replace(/\/\*.*?\*\//g, '')
    if (!/transition|animation/.test(nu)) continue
    const main = /(?<![\w-])\d*\.?\d+(ms|s)(?![\w-])/.test(nu) || /cubic-bezier|\bease\b/.test(nu)
    if (main) assert.match(l, /casse \(hors chaîne\)/, `${sel} : une valeur à la main qui ne se déclare pas`)
  }
  for (const sel of ['.mv-jauge-barre.ment', '.mv-menu.neant', '.mv-menu.rebond', '.mv-menu.traine', '.mv-menu.milieu', '.mv-toast.neant', '.mv-rangee.lente .bouton', '.mv-coupe .mv-toast']) {
    const i = css.indexOf(sel); assert.ok(i >= 0, `casse absente : ${sel}`)
    assert.match(css.slice(i, css.indexOf('\n', i)), /casse/, `${sel} : casse dite sur sa ligne`)
  }
  assert.ok(!/chorégraphie/.test(css), 'cette page ne déclare aucune chorégraphie')
})

/* ── 4 · Chaque casse rend ce qu'elle déclare, et le verdict est déduit ── */
test('4 · Do / Don’t : quatre choses à comparer, le même menu deux fois — à gauche la règle tenue, à droite la faute qui lui répond, chacune lue dans la feuille (cran expressif, courbe qui dépasse, départ à zéro, origine au milieu)', async () => {
  const { p, fermer } = await pageLibre(URL())
  await p.locator('#mots').scrollIntoViewIfNeeded(); await p.waitForTimeout(150)
  const attendus = [['La durée', new RegExp(`${MOUVEMENT.durees.expressive.ms} ms sur un menu, qui vit à ${MOUVEMENT.durees.base.ms}`), 'il traîne', 'traine'],
    ['La courbe', /dépasse sa cible/, 'il rebondit', 'rebond'], ['Le départ', /part de 0/, 'il naît du néant', 'neant'], ["L'origine", /depuis le milieu/, "il s'ouvre du milieu", 'milieu']]
  for (const [nom, dit, mot, classe] of attendus) {
    await choisir(p, nom); await p.waitForTimeout(80)
    const [bon, mauvais] = await lus(p)
    assert.equal(bon[0], 'bon', `${nom} : la gauche tient la règle`); assert.match(bon[1], /200 ms · la courbe du kit · part de 0,95 · depuis le bouton/)
    assert.equal(mauvais[0], 'ko', `${nom} : la droite est la faute`); assert.match(mauvais[1], dit, `${nom} : le verdict dit ce qui est lu`)
    assert.equal(await texte(p, '#mots .mv-cote:nth-child(2) .mv-verdict-tete'), `✗${mot}`, `${nom} : le mot de la faute`)
    assert.equal(await p.locator(`#mots .mv-cote:nth-child(2) .mv-menu.${classe}`).count(), 1, `${nom} : la faute est la classe déclarée`)
    assert.equal(await p.getAttribute('#mots .mv-cote:nth-child(2)', 'data-intent'), 'statement'); assert.equal(await p.getAttribute('#mots .mv-cote:nth-child(1)', 'data-intent'), null)
    await p.waitForTimeout(MOUVEMENT.durees.base.ms + 80)
    assert.equal(await p.locator('#mots .mv-menu.ouvert').count(), 2, `${nom} : les deux menus sont ouverts en même temps`)
  }
  /* et le rendu rend bien la faute : le départ à zéro est lu sur un jumeau au repos */
  await choisir(p, 'Le départ'); await p.waitForTimeout(MOUVEMENT.durees.base.ms + 100)
  assert.equal(await p.evaluate(() => { const m = document.querySelector('#mots .mv-cote:nth-child(2) .mv-menu'), j = m.cloneNode(false); j.classList.remove('ouvert'); m.parentElement.appendChild(j); const s = getComputedStyle(j).scale; j.remove(); return s }), '0')
  await fermer()
})
test('4 · les quatre paires : le juste et le faux côte à côte, un seul geste joue les deux — le survol lent, l’origine au milieu, la naissance à zéro, l’ancienne règle qui coupait tout ; chaque tête de colonne est lue', async () => {
  const { p, fermer } = await pageLibre(URL())
  await p.locator('#casser').scrollIntoViewIfNeeded(); await p.waitForTimeout(150)
  const tete = (i, k) => texte(p, `${bande(i)} .mv-cote:nth-child(${k}) .mv-verdict-tete`)
  for (let i = 1; i <= 4; i++) {
    assert.equal(await p.getAttribute(`${bande(i)} .mv-cote:nth-child(1)`, 'data-intent'), null, `paire ${i} : le juste n'est pas une casse`)
    assert.equal(await p.getAttribute(`${bande(i)} .mv-cote:nth-child(2)`, 'data-intent'), 'statement', `paire ${i} : le fautif est déclaré`)
    assert.match(await tete(i, 1), /✓/); assert.match(await tete(i, 2), /✗/)
    assert.equal(await p.locator(`${bande(i)} .doc-casser`).count(), 0, `paire ${i} : pas de bouton casser`)
  }
  /* 1 · le survol : la même rangée deux fois, cent contre trois cents */
  assert.equal(enMs(await calc(p, `${bande(1)} .mv-rangee:not(.lente) .bouton`, 'transitionDuration')), MOUVEMENT.durees.fast.ms)
  assert.equal(enMs(await calc(p, `${bande(1)} .mv-rangee.lente .bouton`, 'transitionDuration')), MOUVEMENT.durees.slow.ms)
  assert.match(await tete(1, 1), new RegExp(`${MOUVEMENT.durees.fast.ms} ms — il suit le curseur`))
  assert.match(await tete(1, 2), new RegExp(`${MOUVEMENT.durees.slow.ms} ms — il poursuit le curseur`))
  assert.equal(await p.locator(`${bande(1)} .bouton`).count(), 6, 'trois boutons de chaque côté')
  /* 2 · l'origine : un clic ouvre les deux menus */
  assert.equal(await calc(p, `${bande(2)} .mv-menu`, 'transformOrigin', 0), '0px 0px', 'juste : depuis le coin du bouton')
  const o = (await calc(p, `${bande(2)} .mv-menu`, 'transformOrigin', 1)).split(' ').map(parseFloat)
  assert.ok(o[0] > 0 && o[1] > 0, `fautif : l'origine au milieu (${o})`)
  assert.match(await tete(2, 1), /depuis le coin qui touche son bouton/); assert.match(await tete(2, 2), /depuis son propre milieu/)
  await p.locator(`${bande(2)} .bouton`).first().click(); await p.waitForTimeout(MOUVEMENT.durees.base.ms + 60)
  assert.equal(await p.locator(`${bande(2)} .mv-menu.ouvert`).count(), 2, 'un geste, deux menus ouverts')
  /* 3 · le néant : un geste, deux notifications */
  assert.match(await tete(3, 1), /part de 0,95 — presque sa taille/); assert.match(await tete(3, 2), /part de 0 — elle surgit du néant/)
  await p.locator(`${bande(3)} .bouton`, { hasText: 'Notifier' }).click(); await p.waitForTimeout(MOUVEMENT.durees.base.ms + 60)
  assert.equal(await p.locator(`${bande(3)} .mv-toast.la`).count(), 2, 'un geste, deux notifications')
  /* 4 · moins de mouvement : notre règle contre l'ancienne */
  assert.equal(await calc(p, `${bande(4)} .mv-toast`, 'transitionProperty', 0), 'opacity', 'notre règle : le fondu seul')
  assert.equal(enMs(await calc(p, `${bande(4)} .mv-toast`, 'transitionDuration', 0)), MOUVEMENT.durees.base.ms, 'au cran du menu')
  assert.equal(await calc(p, `${bande(4)} .mv-toast`, 'transitionDuration', 1), '0s', "l'ancienne règle : rien")
  assert.match(await tete(4, 1), new RegExp(`le fondu reste \\(${MOUVEMENT.durees.base.ms} ms\\), le déplacement est parti`))
  assert.match(await tete(4, 2), /tout coupé : elle surgit sans passage/)
  await fermer()
})

/* ── 5 · Sous mouvement réduit, les déplacements partent et les fondus restent ── */
test('5 · dans les deux réglages : libre, les boucles tournent seules et les objets se déplacent en entrant ; réduit, elles se figent, plus un déplacement, mais les fondus gardent leurs durées — et trois Don’t sur quatre cessent d’être des fautes', async () => {
  const libre = await pageLibre(URL()), reduit = await nav.page(URL(), { largeur: 1440 })
  const deplacements = (p) => p.evaluate(() => [...document.querySelectorAll('main [class*="mv-"]')].filter((e) => /translate|scale|transform/.test(getComputedStyle(e).transitionProperty)).length)
  assert.ok(await deplacements(libre.p) >= 5, 'libre : les objets se déplacent en entrant')
  assert.equal(await deplacements(reduit.p), 0, 'réduit : plus un seul déplacement en transition')
  assert.match(await texte(libre.p, '#molette .mv-commande'), /Pause|Lecture/, 'libre : la boucle tourne seule et se met en pause')
  assert.match(await texte(reduit.p, '#molette .mv-commande'), /Étape suivante/, 'réduit : la boucle se fige')
  assert.equal(await calc(reduit.p, '#durees .mv-cadre [data-joue]', 'transitionProperty'), 'background-color, border-color, color', 'réduit : le survol reste une couleur, nue')
  await etape(reduit.p, '#durees'); await etape(reduit.p, '#durees'); await reduit.p.waitForTimeout(150)
  assert.equal(await calc(reduit.p, '#durees .mv-panneau', 'transitionProperty'), 'opacity', 'réduit : le panneau ne fait que paraître')
  assert.equal(enMs(await calc(reduit.p, '#durees .mv-panneau', 'transitionDuration')), MOUVEMENT.durees.slow.ms, 'réduit : et garde son cran')
  /* réduit : la courbe, le départ, l'origine ne sont plus des fautes — leur faute était un déplacement ; la durée, si */
  await reduit.p.locator('#mots').scrollIntoViewIfNeeded()
  const verdicts = {}
  for (const nom of ['La durée', 'La courbe', 'Le départ', "L'origine"]) { await choisir(reduit.p, nom); await reduit.p.waitForTimeout(60); verdicts[nom] = (await lus(reduit.p))[1][0] }
  assert.deepEqual(verdicts, { 'La durée': 'ko', 'La courbe': 'bon', 'Le départ': 'bon', "L'origine": 'bon' }, 'réduit : seule la faute de durée reste')
  await libre.fermer(); await reduit.fermer()
})

/* ── 6 · Densité, titres, C17, rien en dur, débord, erreurs, la place dans le menu, les étages ── */
test('6 · la scène suit la base de la densité ; le corps de la légende ne bouge pas ; l’affiche et les sections glissent avec l’écran', async () => {
  const W = 1440
  for (const densite of ['compact', 'airy']) {
    const { p, fermer } = await nav.page(URL(), { largeur: W, densite })
    ok(await calcPx(p, '#durees .mv-cadre', 'paddingTop'), attendu('pad-2-block', W, DENSITES[densite]), `${densite} — le cadre suit la base`)
    ok(await calcPx(p, `${bande(1)} .mv-duo`, 'columnGap'), attendu('pad-1-inline', W, DENSITES[densite]), `${densite} — la paire suit la base`)
    ok(await calcPx(p, '#molette .gd-legende', 'fontSize'), attendu('font-size-label', W), `${densite} — la légende ne bouge pas`)
    await fermer()
  }
  const affiche = [], section = []
  for (const L of LARGEURS) {
    const { p, fermer } = await nav.page(URL(), { largeur: L })
    const h1 = await calcPx(p, '.gdoc-heros h1', 'fontSize'), h2 = await calcPx(p, '.gdoc-sec h2', 'fontSize')
    ok(h1, attendu('doc-cover', L), `${L} — affiche`); ok(h2, attendu('doc-section', L), `${L} — section`)
    affiche.push(h1); section.push(h2); await fermer()
  }
  assert.ok(affiche[0] < affiche[1] && affiche[1] < affiche[2] && section[0] < section[1] && section[1] < section[2], `glissent : ${affiche} / ${section}`)
})
test('6 · dans les deux thèmes, tout tertiaire rendu porte 600 au moins, au cran étiquette au moins, jamais un paragraphe lu', async () => {
  for (const theme of ['light', 'dark']) {
    const { p, fermer } = await nav.page(URL(), { largeur: 1440, theme })
    const f = await fautesC17(p, theme, 1440)
    assert.deepEqual(f, [], `${theme} : ${f.length} faute(s)`)
    await fermer()
  }
})
test('6 · marges, espaces, coins, tailles : chaque valeur calculée est une valeur du moteur — hors casses ; zéro débord ; zéro erreur', async () => {
  const css = CSS(), g = GLOBALES()
  const exclusions = ['padding', 'gap', 'border-radius', 'margin'].flatMap((prop) => [...selecteursDeclares(css, prop), ...selecteursDeclares(g, prop), ...selecteursEnEm(css, prop), ...selecteursEnEm(g, prop)])
  const tailles = ['svg *', ...selecteursDeclares(css, 'font-size'), ...selecteursDeclares(g, 'font-size'), ...selecteursEnEm(css), ...selecteursEnEm(g)]
  for (const W of LARGEURS) {
    const { p, fermer, erreurs } = await nav.page(URL(), { largeur: W })
    for (const d of await p.locator('main details.prov summary').all()) await d.click()
    const f = await fautesEnDur(p, W, DENSITES.comfortable, { exclusions })
    assert.deepEqual(f, [], `${W} px : ${f.length} valeur(s) hors moteur`)
    const t = await fautesTailles(p, W, { exclusions: tailles })
    assert.deepEqual(t, [], `${W} px : ${t.length} taille(s) hors moteur`)
    assert.deepEqual(erreurs, [], 'la page ne jette aucune erreur')
    assert.equal(await debord(p), 0, `${W} px : la page déborde de l'écran`)
    await fermer()
  }
})
test('6 · le mouvement est une fondation (arbitrage du 7 septembre) : le rail le range avec ses sœurs, la feuille du site sous Geste, plus dans les langages ; trois preuves, quatre bandes, huit lignes en liste, neuf lignes de code', async () => {
  const { p, fermer } = await nav.page(URL(), { largeur: 1440 })
  const soeurs = await textes(p, '.gdoc-rail .rail-bloc:first-of-type .rail-lien')
  assert.ok(soeurs.includes('Mouvement') && soeurs.includes('Rythme'), `le rail : ${soeurs.join(', ')}`)
  assert.equal(await texte(p, '.gdoc-rail .rail-bloc:first-of-type .rail-titre'), 'Fondations')
  await p.locator('.rail-ouvre').click(); await p.waitForTimeout(MOUVEMENT.durees.slow.ms + 100)
  const familles = await p.$$eval('.feuille.ouverte .index-famille', (es) => es.map((e) => [e.querySelector('.index-fam').textContent, [...e.querySelectorAll('.index-lien')].map((l) => l.textContent)]))
  const langages = familles.find(([n]) => n === 'Langages')[1], fondations = familles.find(([n]) => n === 'Fondations')[1]
  assert.ok(!langages.includes('Mouvement') && fondations.includes('Mouvement'), 'Mouvement a quitté les langages pour les fondations')
  assert.ok(fondations.indexOf('Mouvement') < fondations.indexOf('Tactile'), 'sous Geste, avant Tactile')
  await p.keyboard.press('Escape')
  assert.equal(await p.locator('main .gdoc-sec').count(), 6, 'six sections'); assert.equal(await p.locator('#mots .mv-choix .bouton').count(), 4, 'quatre choses à comparer')
  assert.equal(await p.locator('#casser .doc-bande').count(), 4, 'quatre bandes')
  assert.equal(await p.locator('#invisibles .doc-liste tbody tr').count(), 8, 'huit lignes en liste')
  assert.equal(await p.locator('#code .doc-code tbody tr').count(), 9, 'neuf lignes de code')
  const code = await textes(p, '#code .doc-code .cs-val')
  assert.deepEqual(code.slice(0, 4), MS.map((m) => `${m} ms`), 'le registre dit les quatre crans, lus au moteur')
  assert.match(await texte(p, '#code .doc-code'), new RegExp(MOUVEMENT.courbe.replace(/[()]/g, '\\$&')), 'et la courbe')
  await fermer()
})
