/* LE CRASH-TEST DE LA PAGE MOUVEMENT — kit/epreuves/mouvement.test.mjs
   Ce qui doit être vrai à l'écran, mesuré sans l'œil (réécrit le 8 septembre
   2026, quand 02 est devenu une course parallèle et 03 des paires au survol —
   verdicts d'Auteur après le tour des références) :
   1 · chaque chiffre affiché est LU, jamais déclaré — la main invisible : la
       barre court après la main, l'écart est peint en rouge à sa largeur rendue
       et chiffré, puis la barre rejoint la main ; le second passage ne ment pas ;
       la course : quatre objets identiques au même instant, chacun à la durée
       de son emploi lue sur le rendu, le rang d'arrivée dans l'ordre des crans ;
   2 · chaque pièce du kit est rendue par son jeton : la fiche est une carte, la
       main est au bout de la barre, la piste de course et ses menus, les tuiles ;
   3 · tout ce qui bouge sur la page prend un cran du moteur et la courbe du kit —
       sauf ce qui se déclare casse, et chaque casse dit sa faute sur sa ligne ;
   4 · chaque casse rend le mensonge qu'elle déclare, et le verdict est DÉDUIT du
       rendu : les six mots du lexique, les quatre bandes ;
   5 · rien ne se joue seul : chaque scène attend « Lire » ou « Ouvrir », le
       lexique attend le survol ; sous mouvement
       réduit, les lectures s'avancent à la main, les déplacements partent et
       les fondus restent — et trois mots du lexique cessent d'être des fautes ;
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
const RALENTI = 3 /* le ralenti du lexique, dit dans la page */
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
/* Sous mouvement réduit — le réglage du banc — on lit à la main : « Lire », puis « Étape suivante ». */
const commande = (p, sec) => p.locator(`${sec} .mv-commande`).click()
const bande = (i) => `#casser .doc-bande:nth-child(${i})`
const boites = (p, sel) => p.evaluate((sel) => [...document.querySelectorAll(sel)].map((e) => { const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height, b: r.bottom, d: r.right } }), sel)

/* ── 1 · Chaque chiffre affiché est lu ── */
test('1 · la main invisible : avec la faute, la barre court après la main — l’écart est peint en rouge à sa largeur rendue, chiffré, et ne fait que fondre ; le sous-titre dit le pic mesuré ; comme il faut, la barre est sous la main à l’image près', async () => {
  const { p, fermer } = await nav.page(URL(), { largeur: 1440 })
  await p.locator('#molette').scrollIntoViewIfNeeded(); await p.waitForTimeout(150)
  assert.equal(await texte(p, '#molette .mv-commande'), 'Lire', 'rien ne se joue seul')
  await commande(p, '#molette'); await p.waitForTimeout(150) /* étape 0 : la faute, au départ */
  assert.equal(await texte(p, '#molette .mv-commande'), 'Étape suivante', 'réduit : on avance à la main')
  assert.equal(await p.getAttribute('#molette .mv-jauge-piste', 'data-intent'), 'statement', 'la faute est déclarée')
  assert.match(await texte(p, '#molette .mv-sous-titre'), /D'abord la faute/)
  const piste = await p.$eval('#molette .mv-piste', (e) => e.getBoundingClientRect().width)
  await commande(p, '#molette'); await p.waitForTimeout(60) /* étape 1 : réduit, la main saute — la barre, elle, traîne (c'est sa casse) */
  const film = await p.evaluate(() => new Promise((res) => {
    const lire = () => { const b = document.querySelector('#molette .mv-jauge-barre').getBoundingClientRect().width, d = document.querySelector('#molette .mv-doigt').getBoundingClientRect()
      const r = document.querySelector('#molette .mv-mensonge'), rr = r && !r.hidden ? r.getBoundingClientRect().width : null
      return { b, main: (d.left + d.right) / 2 - document.querySelector('#molette .mv-jauge-piste').getBoundingClientRect().left, rouge: rr, cote: document.querySelector('#molette .mv-mensonge-cote')?.textContent ?? '', st: document.querySelector('#molette .mv-sous-titre').textContent } }
    const out = []; let n = 0
    const pas = () => { out.push(lire()); if (++n < 14) requestAnimationFrame(pas); else res(out) }
    requestAnimationFrame(pas)
  }))
  const ecarts = film.map((f) => Math.abs(f.main - f.b))
  assert.ok(ecarts[0] > 5, `à la première image, la barre est loin derrière la main : ${ecarts[0].toFixed(1)} px`)
  assert.ok(ecarts.slice(1).every((e, i) => e <= ecarts[i] + TOL), `le retard ne fait que diminuer : ${ecarts.map((e) => e.toFixed(1)).join(' ')}`)
  const pendant = film.map((f, i) => ({ ...f, i })).filter((f) => f.rouge !== null)
  assert.ok(pendant.length >= 2, 'pendant le retard, le rouge est peint')
  for (const f of pendant) {
    assert.ok(f.rouge >= ecarts[f.i] - 2.5 && f.rouge <= piste * 0.62 + 1, `le rouge couvre l'écart rendu (${f.rouge.toFixed(1)} pour ${ecarts[f.i].toFixed(1)})`)
    assert.match(f.cote, /px$/); assert.match(f.st, /court après — [\d,]+ px derrière/)
  }
  assert.ok(pendant.slice(1).every((f, k) => f.rouge <= pendant[k].rouge + TOL), 'le rouge ne fait que fondre')
  await p.waitForTimeout(MOUVEMENT.durees.slow.ms + 200)
  const [g] = await p.$$eval('#molette .mv-jauge-barre', (es) => es.map((e) => e.getBoundingClientRect().width))
  ok(g, film[0].main, 'la barre a rejoint la main', 1)
  assert.equal(await p.locator('#molette .mv-mensonge:not([hidden])').count(), 0, 'le rouge a fondu')
  await commande(p, '#molette'); await p.waitForTimeout(120) /* étape 2 : le pic */
  const pic = parseFloat((await texte(p, '#molette .mv-sous-titre')).match(/jusqu.à ([\d,]+) px de retard/)?.[1]?.replace(',', '.'))
  assert.ok(pic >= Math.max(...ecarts) - TOL && pic <= piste * 0.62 + 1, `le sous-titre dit le pic mesuré (${pic}), au moins le plus grand écart vu (${Math.max(...ecarts).toFixed(1)})`)
  await commande(p, '#molette'); await p.waitForTimeout(120) /* étape 3 : comme il faut */
  assert.equal(await p.getAttribute('#molette .mv-jauge-piste', 'data-intent'), null, 'plus une casse')
  assert.equal(await calc(p, '#molette .mv-jauge-barre', 'transitionDuration'), '0s', 'aucune transition')
  await commande(p, '#molette'); await p.waitForTimeout(60) /* étape 4 : la main saute, la barre est déjà là */
  const [b2, m2] = await p.evaluate(() => { const b = document.querySelector('#molette .mv-jauge-barre').getBoundingClientRect().width, d = document.querySelector('#molette .mv-doigt').getBoundingClientRect(); return [b, (d.left + d.right) / 2 - document.querySelector('#molette .mv-jauge-piste').getBoundingClientRect().left] })
  ok(b2, m2, 'comme il faut : la barre est sous la main, à l\'image près', 1)
  assert.equal(await p.locator('#molette .mv-mensonge:not([hidden])').count(), 0, 'et aucun rouge')
  await commande(p, '#molette'); await p.waitForTimeout(120)
  assert.match(await texte(p, '#molette .mv-sous-titre.regle'), /une valeur qu'on fait glisser ne s'anime pas/i, 'la règle, en dernier')
  await commande(p, '#molette'); await p.waitForTimeout(120)
  assert.equal(await texte(p, '#molette .mv-commande'), 'Rejouer', 'la lecture est finie')
  await fermer()
})
test('1 · la course : quatre objets identiques s’ouvrent au même instant, chacun à la durée de son emploi lue sur le rendu, au ralenti ×5 dit à l’écran ; le rang d’arrivée s’écrit dans l’ordre des crans ; « vitesse réelle » ramène à 1 ; le même menu à trois vitesses — trop vite et trop lent sont des fautes déclarées, lues', async () => {
  const { p, fermer } = await pageLibre(URL())
  await p.locator('#durees').scrollIntoViewIfNeeded(); await p.waitForTimeout(150)
  const emplois = Object.values(MOUVEMENT.durees).map((d) => d.emploi)
  const c1 = '#durees .mv-course:nth-of-type(1)', c2 = '#durees .mv-course:nth-of-type(2)'
  assert.equal(await texte(p, `${c1} .mv-ouvrir`), 'Ouvrir', 'rien ne se joue seul')
  assert.equal(await p.locator(`${c1} .mv-coureurs.la`).count(), 0)
  assert.equal(await texte(p, `${c1} .mv-vitesse`), 'Ralenti ×5', 'le ralenti est dit')
  assert.equal(await p.getAttribute(`${c1} .mv-vitesse`, 'aria-pressed'), 'true')
  const chiffres = await textes(p, `${c1} .mv-cour-chiffre b`)
  assert.deepEqual(chiffres, MS.map((m) => `${m} ms`), 'chaque colonne dit sa durée, lue et ramenée à la vitesse réelle')
  assert.deepEqual(await textes(p, `${c1} .mv-cour-chiffre span`), emplois, 'et son emploi, déduit du cran lu')
  for (let i = 0; i < MS.length; i++) assert.equal(enMs(await calc(p, `${c1} .mv-coureur:nth-child(${i + 1}) .mv-cour-obj`, 'transitionDuration')), MS[i] * 5, `colonne ${i + 1} : ${MS[i]} × 5 sur le rendu`)
  assert.match(await texte(p, '#durees .gd-legende'), new RegExp(`^${MS.join(' · ')} ms, lus sur le rendu`), 'la légende dit ce qui est lu')
  await p.locator(`${c1} .mv-ouvrir`).click(); await p.waitForTimeout(60)
  assert.equal(await p.locator(`${c1} .mv-coureurs.la`).count(), 1, 'un seul geste ouvre les quatre')
  assert.equal(await p.locator(`${c1} .mv-cour-rang:not([hidden])`).count(), 0, 'personne n\'est encore arrivé')
  await p.waitForTimeout(MOUVEMENT.durees.fast.ms * 5 + 250)
  assert.equal(await texte(p, `${c1} .mv-coureur:nth-child(1) .mv-cour-rang`), '1er', 'le bouton arrive le premier')
  assert.equal(await p.locator(`${c1} .mv-coureur:nth-child(4) .mv-cour-rang:not([hidden])`).count(), 0, 'la section n\'est pas encore là')
  await p.waitForTimeout(MOUVEMENT.durees.expressive.ms * 5)
  assert.deepEqual(await textes(p, `${c1} .mv-cour-rang`), ['1er', '2e', '3e', '4e'], 'l\'ordre d\'arrivée est celui des crans')
  assert.match(await texte(p, `${c1} .mv-course-dit`), /^Arrivés dans l'ordre : 100 ms, 200 ms, 300 ms, 700 ms$/)
  assert.equal(await texte(p, `${c1} .mv-ouvrir`), 'Rejouer')
  await p.locator(`${c1} .mv-vitesse`).click(); await p.waitForTimeout(100)
  assert.equal(await texte(p, `${c1} .mv-vitesse`), 'Vitesse réelle')
  for (let i = 0; i < MS.length; i++) assert.equal(enMs(await calc(p, `${c1} .mv-coureur:nth-child(${i + 1}) .mv-cour-obj`, 'transitionDuration')), MS[i], `vitesse réelle : ${MS[i]} ms`)
  assert.deepEqual(await textes(p, `${c1} .mv-cour-chiffre b`), chiffres, 'les chiffres ne bougent pas : ils sont ramenés à la vitesse réelle dans les deux cas')
  /* le même menu à trois vitesses */
  assert.deepEqual(await textes(p, `${c2} .mv-cour-chiffre b`), ['50 ms', '200 ms', '700 ms'])
  assert.deepEqual(await p.$$eval(`${c2} .mv-coureur`, (es) => es.map((e) => e.dataset.intent ?? null)), ['statement', null, 'statement'], 'trop vite et trop lent sont déclarés')
  const dits = await textes(p, `${c2} .mv-cour-chiffre span`)
  assert.match(dits[0], /^trop vite/); assert.match(dits[1], /^juste/); assert.match(dits[2], /^trop lent/)
  await p.locator(`${c2} .mv-ouvrir`).click(); await p.waitForTimeout(MOUVEMENT.durees.expressive.ms * 5 + 400)
  assert.deepEqual(await textes(p, `${c2} .mv-cour-rang`), ['1er', '2e', '3e'])
  await fermer()
})

/* ── 2 · Chaque pièce du kit est rendue par son jeton ── */
test('2 · la fiche est une carte, la main est au bout de la barre et la piste et la barre partagent le même bord ; la carte du film et son panneau ; les tuiles du lexique ; la paire d’une bande est deux colonnes de coque ; la légende parle au cran étiquette', async () => {
  for (const W of LARGEURS) {
    const { p, fermer } = await nav.page(URL(), { largeur: W })
    ok(await calcPx(p, '#molette .mv-fiche', 'paddingTop'), attendu('pad-2-block', W), `${W} — la fiche, marge de carte`)
    ok(await calcPx(p, '#molette .mv-fiche', 'borderTopLeftRadius'), attendu('r-2', W), `${W} — la fiche, coin de carte`)
    ok(await calcPx(p, '#molette .mv-piste', 'height'), attendu('control-height', W), `${W} — la piste de la main, la hauteur d'une commande`)
    ok(await calcPx(p, '#molette .mv-jauge-piste', 'height'), attendu('gap-3-block', W), `${W} — la barre, le troisième cran d'espace`)
    const [piste, barre] = await boites(p, '#molette .mv-trace, #molette .mv-jauge-piste')
    assert.ok(Math.abs(piste.x - barre.x) < 1 && Math.abs(piste.d - barre.d) < 1, `${W} — la piste et la barre partagent le même bord`)
    const [doigt, plein] = await boites(p, '#molette .mv-doigt, #molette .mv-jauge-barre')
    assert.ok(Math.abs((doigt.x + doigt.d) / 2 - plein.d) < 1, `${W} — la main est au bout de la barre`)
    ok(await calcPx(p, '#durees .mv-coureurs', 'paddingTop'), attendu('pad-1-block', W), `${W} — la piste de course, marge de coque`)
    ok(await calcPx(p, '#durees .mv-coureurs', 'borderTopLeftRadius'), attendu('r-2', W), `${W} — la piste de course, coin de card`)
    ok(await calcPx(p, '#durees .mv-cour-obj', 'borderTopLeftRadius'), attendu('r-1', W), `${W} — le menu de la course, coin de coque`)
    ok(await calcPx(p, '#durees .mv-cour-obj', 'paddingTop'), attendu('pad-3-block', W), `${W} — le menu de la course, marge de ligne`)
    ok(await calcPx(p, '#durees .mv-cour-piste', 'height'), attendu('gap-4-block', W), `${W} — la piste, le quatrième cran d'espace`)
    const [d1, d2, d3, d4] = await boites(p, '#durees .mv-course:nth-of-type(1) .mv-cour-obj')
    assert.ok(Math.abs(d1.w - d4.w) < 1 && Math.abs(d1.h - d4.h) < 1 && Math.abs(d2.w - d3.w) < 1, `${W} — les quatre menus sont identiques`)
    if (W >= 640) assert.ok(Math.abs(d1.y - d4.y) < 1, `${W} — et sur une seule ligne`)
    else assert.ok(Math.abs(d1.y - d2.y) < 1 && d3.y > d1.b - TOL, `${W} — sur téléphone, deux par ligne`)
    ok(await calcPx(p, '#mots .mv-lex-scene', 'borderTopLeftRadius'), attendu('r-2', W), `${W} — une tuile, coin de card`)
    ok(await calcPx(p, '#mots .mv-lex-scene', 'paddingTop'), attendu('pad-2-block', W), `${W} — une tuile, marge de carte`)
    ok(await calcPx(p, '#mots .mv-lex-obj', 'paddingTop'), attendu('pad-3-block', W), `${W} — le menu joué, marge de ligne`)
    if (W >= 640) { const [g, d] = await boites(p, '#mots .mv-lex[data-mot="rebond"] .mv-lex-obj'); assert.ok(Math.abs(g.y - d.y) < 1 && d.x > g.x + g.w - 1, `${W} — le juste et le mot, côte à côte`) }
    ok(await calcPx(p, '#molette .gd-legende', 'fontSize'), attendu('font-size-label', W), `${W} — la légende au cran étiquette`)
    ok(await calcPx(p, `${bande(1)} .mv-duo`, 'rowGap'), attendu('pad-1-block', W), `${W} — la paire, l'écart de coque`)
    if (W >= 640) { ok(await calcPx(p, `${bande(1)} .mv-duo`, 'columnGap'), attendu('pad-1-inline', W), `${W} — l'écart entre les colonnes`); const [g, d] = await boites(p, `${bande(1)} .mv-cote`); assert.ok(Math.abs(g.y - d.y) < 1 && d.x > g.x + g.w, `${W} — deux colonnes côte à côte`) }
    else { const [g, d] = await boites(p, `${bande(1)} .mv-cote`); assert.ok(d.y >= g.b - TOL && Math.abs(d.x - g.x) < 1, `${W} — sur téléphone, la paire s'empile`) }
    await fermer()
  }
})

/* ── 3 · Tout ce qui bouge prend un cran et la courbe ── */
test('3 · sur le rendu, chaque transition d’un objet de la page dure un cran du moteur (au ralenti dit par la scène près) et suit la courbe du kit — hors des casses déclarées', async () => {
  const { p, fermer } = await pageLibre(URL())
  const fautes = await p.evaluate(([MS, courbe, RALENTI]) => {
    const f = []
    for (const el of document.querySelectorAll('main [class*="mv-"]')) {
      if (el.closest('[data-intent="statement"]')) continue
      const cs = getComputedStyle(el)
      if (cs.transitionProperty === 'all' && cs.transitionDuration === '0s') continue
      const ralenti = parseFloat(cs.getPropertyValue('--mv-ralenti')) || 1 /* le ralenti est écrit sur la scène, lu ici */
      const durees = cs.transitionDuration.split(',').map((d) => { const v = parseFloat(d); return (d.trim().endsWith('ms') ? v : v * 1000) / ralenti })
      for (const ms of durees) if (ms !== 0 && !MS.some((m) => Math.abs(m - ms) < 0.5)) f.push(`${el.className} : ${ms} ms n'est pas un cran`)
      for (const c of cs.transitionTimingFunction.split(/,(?![^(]*\))/)) if (durees.some((m) => m > 0) && c.trim() !== courbe && c.trim() !== 'linear') f.push(`${el.className} : courbe ${c.trim()}`)
    }
    return [...new Set(f)]
  }, [MS, MOUVEMENT.courbe, RALENTI])
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
  for (const sel of ['.mv-jauge-barre.ment', '.mv-coureur[data-cran="vite"]', '.mv-menu.milieu', '.mv-lex[data-mot="rebond"] .mv-lex-obj', '.mv-lex[data-mot="neant"] .mv-lex-obj', '.mv-lex[data-mot="milieu"] .mv-lex-obj', '.mv-lex[data-mot="traine"] .mv-lex-obj', '.mv-toast.neant', '.mv-rangee.lente .bouton', '.mv-coupe .mv-toast']) {
    const i = css.indexOf(sel); assert.ok(i >= 0, `casse absente : ${sel}`)
    assert.match(css.slice(i, css.indexOf('\n', i)), /casse/, `${sel} : casse dite sur sa ligne`)
  }
  assert.ok((css.match(/chorégraphie/g) ?? []).length >= 10, 'le ralenti de la course et du lexique est une chorégraphie, dite sur chaque ligne')
})

/* ── 4 · Chaque casse rend ce qu'elle déclare, et le verdict est déduit ── */
test('4 · le lexique : six mots, deux justes et quatre fautes, chacune lue dans la feuille et ramenée à la vitesse réelle (courbe qui dépasse, départ à zéro, origine au milieu, cran expressif) ; le survol joue le mot, une tuile à la fois, et la quitter le remet au repos', async () => {
  const { p, fermer } = await pageLibre(URL())
  await p.locator('#mots').scrollIntoViewIfNeeded(); await p.waitForTimeout(150)
  const attendus = [['pose', 'bon', /^200 ms · courbe du kit · depuis le bouton$/], ['bouton', 'bon', /^200 ms · courbe du kit · depuis le bouton \(part de 0,8\)$/],
    ['rebond', 'ko', /^200 ms · dépasse, puis revient$/], ['neant', 'ko', /^200 ms · part de rien$/], ['milieu', 'ko', /^200 ms · grandit depuis son centre$/], ['traine', 'ko', new RegExp(`^${MOUVEMENT.durees.expressive.ms} ms · trop long pour un menu \\(${MOUVEMENT.durees.base.ms}\\)$`)]]
  for (const [cle, v, dit] of attendus) {
    const t = `#mots .mv-lex[data-mot="${cle}"]`
    assert.match(await texte(p, `${t} .mv-lu`), dit, `« ${cle} » : le verdict dit ce qui est lu`)
    assert.equal(await p.locator(`${t} .mv-lu.ko`).count(), v === 'ko' ? 1 : 0, `« ${cle} » : ${v}`)
    assert.equal(await p.getAttribute(t, 'data-intent'), v === 'ko' ? 'statement' : null, `« ${cle} » : ${v === 'ko' ? 'déclaré' : 'pas une casse'}`)
    assert.match(await texte(p, `${t} h3`), v === 'ko' ? /✗/ : /✓/)
  }
  /* le rendu rend bien la faute, au ralenti : le bloc de « il traîne » dure 700 × 3, celui de « il naît du néant » part de 0 */
  assert.equal(enMs(await calc(p, '#mots .mv-lex[data-mot="traine"] .mv-lex-obj.mot', 'transitionDuration')), MOUVEMENT.durees.expressive.ms * RALENTI)
  assert.equal(await calc(p, '#mots .mv-lex[data-mot="neant"] .mv-lex-obj.mot', 'scale'), '0')
  assert.equal(await calc(p, '#mots .mv-lex[data-mot="rebond"] .mv-lex-obj.mot', 'scale'), '0.4', 'le rebond part de loin, pour que le dépassement se voie')
  assert.equal(await p.locator('#mots .mv-lex .bouton').count(), 0, 'pas de bouton : la tuile se joue au survol')
  assert.equal(await p.locator('#mots .mv-lex-scene.paire').count(), 5, 'cinq tuiles jouent le juste à côté du mot ; « il se pose » est seul, il est le juste')
  assert.equal(await p.locator('#mots .mv-lex-obj.ref').count(), 5)
  assert.deepEqual(await textes(p, '#mots .mv-lex[data-mot="rebond"] .mv-lex-cote-dit'), ['le juste', 'il rebondit'], 'chaque côté est nommé')
  assert.deepEqual(await textes(p, '#mots .mv-lex-ralenti'), Array(6).fill(`ralenti ×${RALENTI}`), 'le ralenti est écrit dans chaque scène')
  await p.locator('#mots .mv-lex[data-mot="pose"]').hover(); await p.waitForTimeout(80)
  assert.equal(await p.locator('#mots .mv-lex[data-mot="pose"] .mv-lex-obj.la').count(), 1, 'le survol joue le mot')
  assert.equal(await p.locator('#mots .mv-lex-obj.la').count(), 1, 'une tuile à la fois')
  await p.locator('#mots .mv-lex[data-mot="rebond"]').hover(); await p.waitForTimeout(80)
  assert.equal(await p.locator('#mots .mv-lex[data-mot="rebond"] .mv-lex-obj.la').count(), 2, 'la suivante joue — le juste et le mot au même instant')
  assert.equal(enMs(await calc(p, '#mots .mv-lex[data-mot="rebond"] .mv-lex-obj.ref', 'transitionDuration')), MOUVEMENT.durees.base.ms * RALENTI, 'le juste, à gauche, joue « il se pose »')
  assert.ok((await calc(p, '#mots .mv-lex[data-mot="rebond"] .mv-lex-obj.ref', 'transitionTimingFunction')).split(/,(?![^(]*\))/).every((c) => c.trim() === MOUVEMENT.courbe), 'sur la courbe du kit')
  assert.equal(await p.locator('#mots .mv-lex[data-mot="pose"] .mv-lex-obj.la').count(), 0, 'et la première est revenue au repos')
  await p.locator('#mots .gd-legende').hover(); await p.waitForTimeout(80)
  assert.equal(await p.locator('#mots .mv-lex-obj.la').count(), 0, 'plus rien ne joue quand on quitte')
  await p.locator('#mots .mv-lex[data-mot="neant"]').scrollIntoViewIfNeeded(); await p.mouse.move(2, 2); await p.waitForTimeout(80) /* la souris hors des tuiles : le clavier seul */
  await p.locator('#mots .mv-lex[data-mot="neant"]').focus(); await p.waitForTimeout(80)
  assert.equal(await p.locator('#mots .mv-lex[data-mot="neant"] .mv-lex-obj.la').count(), 2, 'au clavier, le focus joue aussi')
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
  assert.equal(enMs(await calc(p, `${bande(1)} .mv-rangee:not(.lente) .bouton`, 'transitionDuration')), MOUVEMENT.durees.fast.ms)
  assert.equal(enMs(await calc(p, `${bande(1)} .mv-rangee.lente .bouton`, 'transitionDuration')), MOUVEMENT.durees.slow.ms)
  assert.match(await tete(1, 1), new RegExp(`${MOUVEMENT.durees.fast.ms} ms — il suit le curseur`)); assert.match(await tete(1, 2), new RegExp(`${MOUVEMENT.durees.slow.ms} ms — il poursuit le curseur`))
  assert.equal(await calc(p, `${bande(2)} .mv-menu`, 'transformOrigin', 0), '0px 0px', 'juste : depuis le coin du bouton')
  const o = (await calc(p, `${bande(2)} .mv-menu`, 'transformOrigin', 1)).split(' ').map(parseFloat)
  assert.ok(o[0] > 0 && o[1] > 0, `fautif : l'origine au milieu (${o})`)
  await p.locator(`${bande(2)} .bouton`).first().click(); await p.waitForTimeout(MOUVEMENT.durees.base.ms + 60)
  assert.equal(await p.locator(`${bande(2)} .mv-menu.ouvert`).count(), 2, 'un geste, deux menus ouverts')
  assert.match(await tete(3, 1), /part de 0,95 — presque sa taille/); assert.match(await tete(3, 2), /part de 0 — elle surgit du néant/)
  await p.locator(`${bande(3)} .bouton`, { hasText: 'Notifier' }).click(); await p.waitForTimeout(MOUVEMENT.durees.base.ms + 60)
  assert.equal(await p.locator(`${bande(3)} .mv-toast.la`).count(), 2, 'un geste, deux notifications')
  assert.equal(await calc(p, `${bande(4)} .mv-toast`, 'transitionProperty', 0), 'opacity', 'notre règle : le fondu seul')
  assert.equal(await calc(p, `${bande(4)} .mv-toast`, 'transitionDuration', 1), '0s', "l'ancienne règle : rien")
  assert.match(await tete(4, 1), new RegExp(`le fondu reste \\(${MOUVEMENT.durees.base.ms} ms\\), le déplacement est parti`)); assert.match(await tete(4, 2), /tout coupé : elle surgit sans passage/)
  await fermer()
})

/* ── 5 · Rien ne se joue seul ; sous mouvement réduit, les déplacements partent et les fondus restent ── */
test('5 · rien ne se joue seul : libre ou réduit, les scènes attendent « Lire » ; réduit, plus un déplacement en transition, mais les fondus gardent leurs durées — et trois mots du lexique cessent d’être des fautes, parce que leur faute était un déplacement', async () => {
  const libre = await pageLibre(URL()), reduit = await nav.page(URL(), { largeur: 1440 })
  for (const { p } of [libre, reduit]) {
    await p.waitForTimeout(600)
    assert.equal(await texte(p, '#molette .mv-commande'), 'Lire'); assert.deepEqual(await textes(p, '#durees .mv-ouvrir'), ['Ouvrir', 'Ouvrir'])
    assert.equal(await p.locator('#durees .mv-coureurs.la').count(), 0, 'la course attend « Ouvrir »')
    assert.equal(await p.locator('#mots .mv-lex-obj.la').count(), 0, 'le lexique attend qu\'on le lance')
    assert.equal(await p.locator('#molette .mv-mensonge:not([hidden])').count(), 0, 'la main n\'a pas bougé')
  }
  const deplacements = (p) => p.evaluate(() => [...document.querySelectorAll('main [class*="mv-"]')].filter((e) => /translate|scale|transform/.test(getComputedStyle(e).transitionProperty)).length)
  assert.ok(await deplacements(libre.p) >= 8, 'libre : les objets se déplacent en entrant')
  assert.equal(await deplacements(reduit.p), 0, 'réduit : plus un seul déplacement en transition')
  assert.equal(await calc(reduit.p, '#mots .mv-lex[data-mot="pose"] .mv-lex-obj', 'transitionProperty'), 'opacity', 'réduit : le fondu seul')
  assert.equal(enMs(await calc(reduit.p, '#mots .mv-lex[data-mot="pose"] .mv-lex-obj', 'transitionDuration')), MOUVEMENT.durees.base.ms * RALENTI, 'réduit : et il garde son cran (au ralenti)')
  assert.equal(await calc(reduit.p, '#durees .mv-coureur:nth-child(4) .mv-cour-obj', 'transitionProperty'), 'opacity', 'réduit : la course aussi, le fondu seul')
  assert.equal(enMs(await calc(reduit.p, '#durees .mv-coureur:nth-child(4) .mv-cour-obj', 'transitionDuration')), MOUVEMENT.durees.expressive.ms * 5, 'réduit : au cran, au ralenti')
  /* réduit : la course se joue quand même — le fondu suffit à écrire les rangs */
  await reduit.p.locator('#durees .mv-course:nth-of-type(1) .mv-ouvrir').click(); await reduit.p.waitForTimeout(MOUVEMENT.durees.expressive.ms * 5 + 400)
  assert.deepEqual(await textes(reduit.p, '#durees .mv-course:nth-of-type(1) .mv-cour-rang'), ['1er', '2e', '3e', '4e'], 'réduit : les rangs s\'écrivent, dans l\'ordre')
  /* réduit : le rebond, le néant, le milieu ne sont plus des fautes — leur faute était un déplacement ; le cran expressif, si */
  const verdicts = Object.fromEntries(await reduit.p.$$eval('#mots .mv-lex', (es) => es.map((e) => [e.dataset.mot, e.querySelector('.mv-lu').classList.contains('ko') ? 'ko' : 'bon'])))
  assert.deepEqual(verdicts, { pose: 'bon', bouton: 'bon', rebond: 'bon', neant: 'bon', milieu: 'bon', traine: 'ko' }, 'réduit : seule la faute de durée reste')

  await libre.fermer(); await reduit.fermer()
})

/* ── 6 · Densité, titres, C17, rien en dur, débord, erreurs, la place dans le menu, les étages ── */
test('6 · la scène suit la base de la densité ; le corps de la légende ne bouge pas ; l’affiche et les sections glissent avec l’écran', async () => {
  const W = 1440
  for (const densite of ['compact', 'airy']) {
    const { p, fermer } = await nav.page(URL(), { largeur: W, densite })
    ok(await calcPx(p, '#durees .mv-coureurs', 'paddingTop'), attendu('pad-1-block', W, DENSITES[densite]), `${densite} — la piste de course suit la base`)
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
test('6 · marges, espaces, coins, tailles : chaque valeur calculée est une valeur du moteur — hors casses et cotes déclarées ; zéro débord ; zéro erreur', async () => {
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
test('6 · le mouvement est une fondation (arbitrage du 7 septembre) : le rail le range avec ses sœurs, la feuille du site sous Geste ; six sections, six mots, quatre bandes, huit lignes en liste, neuf lignes de code', async () => {
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
  assert.equal(await p.locator('main .gdoc-sec').count(), 6, 'six sections')
  assert.equal(await p.locator('#mots .mv-lex').count(), 6, 'six mots')
  assert.equal(await p.locator('#casser .doc-bande').count(), 4, 'quatre bandes')
  assert.equal(await p.locator('#invisibles .doc-liste tbody tr').count(), 8, 'huit lignes en liste')
  assert.equal(await p.locator('#code .doc-code tbody tr').count(), 9, 'neuf lignes de code')
  const code = await textes(p, '#code .doc-code .cs-val')
  assert.deepEqual(code.slice(0, 4), MS.map((m) => `${m} ms`), 'le registre dit les quatre crans, lus au moteur')
  await fermer()
})
