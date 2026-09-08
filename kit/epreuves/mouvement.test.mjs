/* LE CRASH-TEST DE LA PAGE MOUVEMENT — kit/epreuves/mouvement.test.mjs
   Ce qui doit être vrai à l'écran, mesuré sans l'œil (réécrit le 8 septembre
   2026, quand la page est devenue trois règles en trois comparaisons — le
   mauvais et le bon côte à côte, un seul bouton joue les deux — et un
   répertoire lu au moteur) :
   1 · la trace : un seul bouton déplace les deux cartes ; la bonne glisse
       (une transition, au cran expressif, sur la courbe du kit) ; la mauvaise
       disparaît puis paraît ailleurs (une image-clé, déclarée) ;
   2 · la cause : un seul geste ouvre les deux menus ; le bon grandit depuis
       le coin de son bouton, le mauvais depuis son centre et loin (déclaré) ;
       le bouton de projet lui-même ouvre et ferme, et dit son état ;
   3 · le regard : une mise à jour ; côté faute, les huit cartes s'animent
       (déclaré) ; côté juste, une seule — celle qui a changé, étiquetée ;
   4 · tout ce qui bouge prend un cran du moteur et la courbe du kit, hors des
       ruptures déclarées ; la feuille ne porte aucune durée à la main hors
       d'une ligne qui se dit casse ou chorégraphie ;
   5 · sous mouvement réduit, plus un déplacement en transition ni en
       animation ; les fondus restent ; la carte est quand même à l'arrivée ;
   6 · l'écriture d'Auteur (8 septembre) : aucun « Regardez », « Cliquez »,
       « à gauche » ; pas d'intro sous les titres, pas de légende après
       l'évidence, pas de pied ; par démo un titre et un bouton ;
   7 · les jetons, la densité, les titres, C17, rien en dur, zéro débord, zéro
       erreur ; la page est une fondation dans le menu ; quatre sections, trois
       preuves, neuf lignes de code lues au moteur, six lignes en liste.

   Ce que cette épreuve NE juge PAS, et dit : si la différence « se sent ».
   Elle vérifie seulement que la page joue bien ce qu'elle annonce. */
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
const EXPRESSIF = MOUVEMENT.durees.expressive.ms, LENT = MOUVEMENT.durees.slow.ms
const enMs = (s) => { const v = parseFloat(s); return s.trim().endsWith('ms') ? v : v * 1000 }

let site, nav
before(async () => { site = await ouvrirSite(); nav = await ouvrirNavigateur() })
after(async () => { await nav?.fermer(); site?.fermer() })
const URL = () => site.url + '/mouvement'
/* Le banc ouvre tout sous mouvement réduit. Cette page a besoin des deux réglages. */
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
const boite = (p, sel) => p.$eval(sel, (e) => { const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height } })
const bougent = (p, sel) => p.$$eval(sel, (es) => es.filter((e) => getComputedStyle(e).animationName !== 'none').length)

/* ── 1 · La trace ── */
test('1 · la trace : un seul bouton déplace les deux cartes ; la bonne glisse au cran expressif sur la courbe du kit ; la mauvaise disparaît puis paraît ailleurs, en image-clé déclarée', async () => {
  const { p, fermer } = await pageLibre(URL())
  await p.locator('#trace').scrollIntoViewIfNeeded(); await p.waitForTimeout(150)
  assert.equal(await p.locator('#trace .motion-replay').count(), 1, 'un seul bouton pour les deux côtés')
  assert.equal(await texte(p, '#trace .motion-replay'), 'Déplacer')
  const bon = '#trace .trace-panel.is-good .trace-moving', faux = '#trace .trace-panel.is-bad .trace-moving'
  const avant = await boite(p, bon), avantFaux = await boite(p, faux)
  assert.equal(await calc(p, bon, 'transitionProperty'), 'translate', 'la bonne carte glisse : une transition sur le déplacement')
  assert.equal(enMs(await calc(p, bon, 'transitionDuration')), EXPRESSIF, 'au cran expressif')
  assert.equal(await calc(p, bon, 'transitionTimingFunction'), MOUVEMENT.courbe, 'sur la courbe du kit')
  assert.equal(await p.getAttribute('#trace .trace-panel.is-bad', 'data-intent'), 'statement', 'la rupture est déclarée')
  await p.locator('#trace .motion-replay').click(); await p.waitForTimeout(EXPRESSIF / 8)
  const pendant = await boite(p, bon)
  assert.ok(pendant.x > avant.x + 4 && pendant.x < avant.x + avant.w, `en route, la bonne carte est entre les deux colonnes (${pendant.x.toFixed(0)})`)
  assert.equal(await calc(p, faux, 'animationName'), 'trace-bad-right', 'la mauvaise : une image-clé')
  assert.equal(enMs(await calc(p, faux, 'animationDuration')), EXPRESSIF)
  await p.waitForTimeout(EXPRESSIF + 150)
  const apres = await boite(p, bon), apresFaux = await boite(p, faux)
  ok(apres.x - avant.x, avant.w + (await calcPx(p, '#trace .trace-board', 'columnGap')), 'la bonne carte est dans la colonne « Terminé »', 1.5)
  ok(apresFaux.x - avantFaux.x, apres.x - avant.x, 'la mauvaise aussi — mais elle n\'y est pas allée, elle y est apparue', 1.5)
  assert.equal(await texte(p, '#trace .motion-replay'), 'Rejouer')
  await fermer()
})

/* ── 2 · La cause ── */
test('2 · la cause : un seul geste ouvre les deux menus ; le bon grandit depuis le coin de son bouton, le mauvais depuis son centre et loin, déclaré ; le bouton de projet ouvre et ferme et dit son état', async () => {
  const { p, fermer } = await pageLibre(URL())
  await p.locator('#cause').scrollIntoViewIfNeeded(); await p.waitForTimeout(150)
  const bon = '#cause .origin-panel.is-good .origin-menu', faux = '#cause .origin-panel.is-bad .origin-menu'
  assert.equal(await calc(p, bon, 'opacity'), '0'); assert.equal(await calc(p, faux, 'opacity'), '0')
  assert.equal(await calc(p, bon, 'transformOrigin'), '0px 0px', 'le bon : depuis le coin qui touche son bouton')
  assert.notEqual(await calc(p, faux, 'transformOrigin'), '0px 0px', 'le mauvais : depuis son centre')
  assert.notEqual(await calc(p, faux, 'translate'), 'none', 'et loin de son bouton')
  assert.equal(await p.getAttribute('#cause .origin-panel.is-bad', 'data-intent'), 'statement', 'déclaré')
  for (const sel of [bon, faux]) {
    assert.equal(enMs(await calc(p, sel, 'transitionDuration').then((d) => d.split(',')[0])), LENT, 'au cran du panneau')
    assert.equal(await calc(p, sel, 'transitionTimingFunction').then((t) => t.split(/,(?![^(]*\))/)[0].trim()), MOUVEMENT.courbe)
  }
  assert.deepEqual(await p.$$eval('#cause .origin-trigger', (es) => es.map((e) => e.getAttribute('aria-expanded'))), ['false', 'false'])
  await p.locator('#cause .motion-replay').click(); await p.waitForTimeout(LENT + 150)
  assert.equal(await calc(p, bon, 'opacity'), '1'); assert.equal(await calc(p, faux, 'opacity'), '1')
  assert.equal(await calc(p, bon, 'scale'), '1'); assert.equal(await calc(p, faux, 'translate'), '0px', 'ouvert, le mauvais a rejoint sa place — c\'est le trajet qui ment')
  assert.deepEqual(await p.$$eval('#cause .origin-trigger', (es) => es.map((e) => e.getAttribute('aria-expanded'))), ['true', 'true'], 'les deux boutons disent leur état')
  assert.equal(await texte(p, '#cause .motion-replay'), 'Fermer')
  await p.locator('#cause .origin-panel.is-good .origin-trigger').click(); await p.waitForTimeout(LENT + 150)
  assert.equal(await calc(p, faux, 'opacity'), '0', 'le bouton de projet ferme les deux')
  await fermer()
})

/* ── 3 · Le regard ── */
test('3 · le regard : une mise à jour ; côté faute, les huit cartes s’animent (déclaré) ; côté juste, une seule — celle qui a changé, étiquetée « Mis à jour » ; la suivante change de carte', async () => {
  const { p, fermer } = await pageLibre(URL())
  await p.locator('#regard').scrollIntoViewIfNeeded(); await p.waitForTimeout(150)
  assert.equal(await p.locator('#regard .gaze-card').count(), 16, 'huit cartes de chaque côté')
  assert.equal(await bougent(p, '#regard .gaze-card'), 0, 'rien ne bouge avant la mise à jour')
  assert.equal(await p.getAttribute('#regard .gaze-panel.is-bad', 'data-intent'), 'statement')
  await p.locator('#regard .motion-replay').click(); await p.waitForTimeout(80)
  assert.equal(await bougent(p, '#regard .gaze-panel.is-bad .gaze-card'), 8, 'côté faute : les huit')
  assert.equal(await bougent(p, '#regard .gaze-panel.is-good .gaze-card'), 1, 'côté juste : une seule')
  assert.equal(await p.locator('#regard .gaze-panel.is-good .gaze-card.is-target').count(), 1)
  const cible1 = await texte(p, '#regard .gaze-panel.is-good .gaze-card.is-target > span')
  assert.equal(await texte(p, '#regard .gaze-panel.is-good .gaze-card.is-target em'), 'Mis à jour')
  await p.waitForTimeout(EXPRESSIF + 100)
  assert.equal(await calc(p, '#regard .gaze-panel.is-good .gaze-card.is-target em', 'opacity'), '1', 'l\'étiquette est restée')
  assert.equal(await texte(p, '#regard .motion-replay'), 'Changer encore')
  await p.locator('#regard .motion-replay').click(); await p.waitForTimeout(80)
  assert.notEqual(await texte(p, '#regard .gaze-panel.is-good .gaze-card.is-target > span'), cible1, 'une autre carte change')
  await fermer()
})

/* ── 4 · Tout ce qui bouge prend un cran et la courbe ── */
test('4 · sur le rendu, chaque transition et chaque animation dure un cran du moteur et suit la courbe du kit — hors des ruptures déclarées', async () => {
  const { p, fermer } = await pageLibre(URL())
  const fautes = await p.evaluate(([MS, courbe]) => {
    const f = []
    for (const el of document.querySelectorAll('main .motion-demo *')) {
      if (el.closest('[data-intent="statement"]')) continue
      const cs = getComputedStyle(el)
      const lire = (d) => { const v = parseFloat(d); return d.trim().endsWith('ms') ? v : v * 1000 }
      for (const ms of cs.transitionDuration.split(',').map(lire)) if (ms !== 0 && !MS.some((m) => Math.abs(m - ms) < 0.5)) f.push(`${el.className} : transition ${ms} ms n'est pas un cran`)
      if (cs.animationName !== 'none') for (const ms of cs.animationDuration.split(',').map(lire)) if (!MS.some((m) => Math.abs(m - ms) < 0.5)) f.push(`${el.className} : animation ${ms} ms n'est pas un cran`)
      const fns = [...cs.transitionTimingFunction.split(/,(?![^(]*\))/), ...(cs.animationName !== 'none' ? cs.animationTimingFunction.split(/,(?![^(]*\))/) : [])]
      if (cs.transitionDuration.split(',').some((d) => lire(d) > 0) || cs.animationName !== 'none') for (const c of fns) if (c.trim() !== courbe && c.trim() !== 'linear') f.push(`${el.className} : courbe ${c.trim()}`)
    }
    return [...new Set(f)]
  }, [MS, MOUVEMENT.courbe])
  assert.deepEqual(fautes, [], `${fautes.length} mouvement(s) hors moteur`)
  await fermer()
})
test('4 · la feuille : aucune durée ni courbe à la main hors d’une ligne qui se dit casse ou chorégraphie, et chaque rupture de la page est dite', () => {
  const css = CSS()
  for (const [sel, l] of lignesAvecSelecteur(css)) {
    const nu = l.replace(/\/\*.*?\*\//g, '')
    if (!/transition|animation/.test(nu)) continue
    const main = /(?<![\w-])\d*\.?\d+(ms|s)(?![\w-])/.test(nu) || /cubic-bezier|\bease\b/.test(nu)
    if (main) assert.match(l, /casse \(hors chaîne\)|chorégraphie/, `${sel} : une valeur à la main qui ne se déclare pas`)
  }
  for (const sel of ['.origin-panel.is-bad .origin-menu']) {
    const i = css.indexOf(sel); assert.ok(i >= 0, `casse absente : ${sel}`)
    assert.match(css.slice(i, css.indexOf('\n', i)), /casse/, `${sel} : casse dite sur sa ligne`)
  }
  assert.ok((css.match(/chorégraphie/g) ?? []).length >= 8, 'les décalages du côté faute sont une chorégraphie, dite sur chaque ligne')
})

/* ── 5 · Sous mouvement réduit ── */
test('5 · réduit : plus un déplacement en transition ni en animation ; les fondus restent ; la bonne carte est quand même à l’arrivée, les menus s’ouvrent quand même', async () => {
  const libre = await pageLibre(URL()), reduit = await nav.page(URL(), { largeur: 1440 })
  const deplacements = (p) => p.evaluate(() => [...document.querySelectorAll('main .motion-demo *')].filter((e) => { const cs = getComputedStyle(e); return /translate|scale|transform|rotate/.test(cs.transitionProperty) || cs.animationName !== 'none' }).length)
  assert.ok(await deplacements(libre.p) >= 3, 'libre : les objets se déplacent')
  await reduit.p.locator('#regard .motion-replay').click(); await reduit.p.waitForTimeout(80)
  assert.equal(await deplacements(reduit.p), 0, 'réduit : plus un seul déplacement, même pendant la mise à jour')
  assert.equal(await calc(reduit.p, '#cause .origin-panel.is-good .origin-menu', 'transitionProperty'), 'opacity', 'réduit : le fondu du menu reste')
  assert.equal(await calc(reduit.p, '#regard .gaze-panel.is-good .gaze-card.is-target em', 'opacity'), '1', 'réduit : la carte qui change est quand même étiquetée')
  const avant = await boite(reduit.p, '#trace .trace-panel.is-good .trace-moving')
  await reduit.p.locator('#trace .motion-replay').click(); await reduit.p.waitForTimeout(80)
  const apres = await boite(reduit.p, '#trace .trace-panel.is-good .trace-moving')
  assert.ok(apres.x > avant.x + avant.w / 2, 'réduit : la carte est à l\'arrivée, d\'un coup')
  await reduit.p.locator('#cause .motion-replay').click(); await reduit.p.waitForTimeout(LENT + 150)
  assert.equal(await calc(reduit.p, '#cause .origin-panel.is-good .origin-menu', 'opacity'), '1')
  await libre.fermer(); await reduit.fermer()
})

/* ── 6 · L'écriture ── */
test('6 · l’écriture d’Auteur : aucun mot qui décrit l’écran ou raconte le geste ; pas d’intro sous les titres, pas de légende, pas de pied ; par démo, un titre et un bouton ; chaque côté est nommé une fois', async () => {
  const { p, fermer } = await nav.page(URL(), { largeur: 1440 })
  const corps = await texte(p, 'main')
  assert.doesNotMatch(corps, /Regardez|Observez|Vous pouvez voir|Comme vous pouvez|Cliquez|Appuyez|Faites glisser|Essayez|À gauche|à droite|Cette démonstration/i, 'le texte ne décrit ni l\'écran ni le geste')
  assert.equal(await p.locator('main .sourd, main figcaption, main .gd-pied, main .motion-demo-index').count(), 0, 'rien sous les titres, rien après l\'évidence')
  for (const id of ['trace', 'cause', 'regard']) {
    assert.equal(await p.locator(`#${id} .motion-demo-head > b`).count(), 1, `${id} : un titre`)
    assert.equal(await p.locator(`#${id} .motion-demo-head button`).count(), 1, `${id} : un bouton`)
    assert.deepEqual(await p.$$eval(`#${id} .motion-panel-head`, (es) => es.map((e) => e.children.length)), [1, 1], `${id} : chaque côté est nommé une fois, sans badge`)
  }
  assert.equal((await texte(p, '.gdoc-heros .chapo')).length < 40, true, 'l\'accroche tient en quelques mots')
  await fermer()
})

/* ── 7 · Les jetons, la densité, C17, rien en dur, la place dans le menu, les étages ── */
test('7 · les jetons : la démo est une coque, la carte de tâche et la carte du tableau de bord sont des cards, le menu parle au cran ligne ; la coque suit la base de la densité ; l’affiche et les sections glissent', async () => {
  for (const W of LARGEURS) {
    const { p, fermer } = await nav.page(URL(), { largeur: W })
    ok(await calcPx(p, '#trace .motion-demo', 'borderTopLeftRadius'), attendu('r-1', W), `${W} — la démo, coin de coque`)
    ok(await calcPx(p, '#trace .trace-card', 'borderTopLeftRadius'), attendu('r-2', W), `${W} — la carte de tâche, coin de card`)
    ok(await calcPx(p, '#trace .trace-card', 'paddingTop'), attendu('pad-3-block', W), `${W} — la carte de tâche, marge de ligne`)
    ok(await calcPx(p, '#cause .origin-menu', 'paddingTop'), attendu('pad-3-block', W), `${W} — le menu, marge de ligne`)
    ok(await calcPx(p, '#regard .gaze-card', 'borderTopLeftRadius'), attendu('r-2', W), `${W} — la carte du tableau, coin de card`)
    ok(await calcPx(p, '#regard .gaze-card', 'paddingTop'), attendu('pad-3-block', W), `${W} — la carte du tableau, marge de ligne`)
    await fermer()
  }
  for (const densite of ['compact', 'airy']) {
    const { p, fermer } = await nav.page(URL(), { largeur: 1440, densite })
    ok(await calcPx(p, '#trace .motion-demo-head', 'paddingLeft'), attendu('pad-1-inline', 1440, DENSITES[densite]), `${densite} — la tête de démo suit la base`)
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
test('7 · dans les deux thèmes, tout tertiaire rendu porte 600 au moins, au cran étiquette au moins, jamais un paragraphe lu', async () => {
  for (const theme of ['light', 'dark']) {
    const { p, fermer } = await nav.page(URL(), { largeur: 1440, theme })
    const f = await fautesC17(p, theme, 1440)
    assert.deepEqual(f, [], `${theme} : ${f.length} faute(s)`)
    await fermer()
  }
})
test('7 · marges, espaces, coins, tailles : chaque valeur calculée est une valeur du moteur — hors des valeurs déclarées ; zéro débord ; zéro erreur', async () => {
  const css = CSS(), g = GLOBALES()
  const exclusions = ['padding', 'gap', 'border-radius', 'margin'].flatMap((prop) => [...selecteursDeclares(css, prop), ...selecteursDeclares(g, prop), ...selecteursEnEm(css, prop), ...selecteursEnEm(g, prop)])
  const tailles = ['svg *', ...selecteursDeclares(css, 'font-size'), ...selecteursDeclares(g, 'font-size'), ...selecteursEnEm(css), ...selecteursEnEm(g)]
  for (const W of LARGEURS) {
    const { p, fermer, erreurs } = await nav.page(URL(), { largeur: W })
    const f = await fautesEnDur(p, W, DENSITES.comfortable, { exclusions })
    assert.deepEqual(f, [], `${W} px : ${f.length} valeur(s) hors moteur`)
    const t = await fautesTailles(p, W, { exclusions: tailles })
    assert.deepEqual(t, [], `${W} px : ${t.length} taille(s) hors moteur`)
    assert.deepEqual(erreurs, [], 'la page ne jette aucune erreur')
    assert.equal(await debord(p), 0, `${W} px : la page déborde de l'écran`)
    await fermer()
  }
})
test('7 · le mouvement est une fondation : le rail le range avec ses sœurs ; quatre sections, trois preuves, neuf lignes de code lues au moteur, six lignes en liste', async () => {
  const { p, fermer } = await nav.page(URL(), { largeur: 1440 })
  const soeurs = await textes(p, '.gdoc-rail .rail-bloc:first-of-type .rail-lien')
  assert.ok(soeurs.includes('Mouvement') && soeurs.includes('Rythme'), `le rail : ${soeurs.join(', ')}`)
  assert.equal(await texte(p, '.gdoc-rail .rail-bloc:first-of-type .rail-titre'), 'Fondations')
  assert.equal(await p.locator('main .gdoc-sec').count(), 4, 'quatre sections')
  assert.equal(await p.locator('main .motion-demo').count(), 3, 'trois preuves')
  assert.equal(await p.locator('#moteur .doc-code tbody tr').count(), 9, 'neuf lignes de code')
  assert.equal(await p.locator('#moteur .doc-liste tbody tr').count(), 6, 'six lignes en liste')
  const code = await textes(p, '#moteur .doc-code .cs-val')
  assert.deepEqual(code.slice(0, 4), MS.map((m) => `${m} ms`), 'le registre dit les quatre crans, lus au moteur')
  await fermer()
})
