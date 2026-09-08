/* LE CRASH-TEST DE LA PAGE MOUVEMENT — kit/tests/motion.test.mjs
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
       « à gauche » ; une phrase d'observation sous chaque titre, une légende
       lue par preuve, observation / règle / réglage sous chaque preuve, pas
       de badge décrété ni de pied ; par démo un titre et un bouton ;
   7 · les jetons, la densité, les titres, C17, rien en dur, zéro débord, zéro
       erreur ; la page est une fondation dans le menu ; six sections, trois
       preuves, quatre paires, huit lignes en liste, neuf lignes de code.

   Ce que cette épreuve NE juge PAS, et dit : si la différence « se sent ».
   Elle vérifie seulement que la page joue bien ce qu'elle annonce. */
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { DENSITIES, MOTION } from '../derivation.mjs'
import { KIT, WIDTHS, TOL, openSite, openBrowser, expected, near, calcPx, calc, text, texts, faultsC17, faultsInHard, faultsSizes, selectorsDeclaredAll, selectorsInEm, linesAlongSelector, overflow } from './bench.mjs'

const ok = (a, b, msg, tol = TOL) => assert.ok(a !== null && near(a, b, tol), `${msg} : ${a} attendu ${b}`)
const CSS = () => fs.readFileSync(path.join(KIT, 'app/mouvement/motion.css'), 'utf8')
const GLOBAL = () => fs.readFileSync(path.join(KIT, 'app/globals.css'), 'utf8')
const MS = Object.values(MOTION.durations).map((d) => d.ms)
const EXPRESSIVE = MOTION.durations.expressive.ms, SLOW = MOTION.durations.slow.ms
const inMs = (s) => { const v = parseFloat(s); return s.trim().endsWith('ms') ? v : v * 1000 }

let site, nav
before(async () => { site = await openSite(); nav = await openBrowser() })
after(async () => { await nav?.close(); site?.close() })
const URL = () => site.url + '/mouvement'
/* Le banc ouvre tout sous mouvement réduit. Cette page a besoin des deux réglages. */
async function pageFree(url, { width = 1440 } = {}) {
  const ctx = await nav.browser.newContext({ viewport: { width: width, height: 900 }, reducedMotion: 'no-preference' })
  await ctx.addInitScript(() => { try { localStorage.clear(); localStorage.setItem('kit-theme', 'light') } catch {} })
  const p = await ctx.newPage()
  const errors = []
  p.on('pageerror', (e) => errors.push(String(e)))
  await p.goto(url, { waitUntil: 'networkidle' })
  await p.evaluate(() => document.fonts.ready)
  return { p, errors, close: () => ctx.close() }
}
const band = (i) => `#wreck .doc-band:nth-child(${i})`
const box = (p, sel) => p.$eval(sel, (e) => { const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height } })
const move = (p, sel) => p.$$eval(sel, (es) => es.filter((e) => getComputedStyle(e).animationName !== 'none').length)

/* ── 1 · La trace ── */
test('1 · la trace : un seul bouton déplace les deux cartes ; la bonne glisse au cran expressif sur la courbe du kit ; la mauvaise disparaît puis paraît ailleurs, en image-clé déclarée', async () => {
  const { p, close } = await pageFree(URL())
  await p.locator('#trace').scrollIntoViewIfNeeded(); await p.waitForTimeout(150)
  assert.equal(await p.locator('#trace .motion-replay').count(), 1, 'un seul bouton pour les deux côtés')
  assert.equal(await text(p, '#trace .motion-replay'), 'Déplacer')
  const good = '#trace .trace-panel.is-good .trace-moving', wrong = '#trace .trace-panel.is-bad .trace-moving'
  const before = await box(p, good), beforeWrong = await box(p, wrong)
  assert.equal(await calc(p, good, 'transitionProperty'), 'translate', 'la bonne carte glisse : une transition sur le déplacement')
  assert.equal(inMs(await calc(p, good, 'transitionDuration')), EXPRESSIVE, 'au cran expressif')
  assert.equal(await calc(p, good, 'transitionTimingFunction'), MOTION.curve, 'sur la courbe du kit')
  assert.equal(await p.getAttribute('#trace .trace-panel.is-bad', 'data-intent'), 'statement', 'la rupture est déclarée')
  await p.locator('#trace .motion-replay').click(); await p.waitForTimeout(EXPRESSIVE / 8)
  const during = await box(p, good)
  assert.ok(during.x > before.x + 4 && during.x < before.x + before.w, `en route, la bonne carte est entre les deux colonnes (${during.x.toFixed(0)})`)
  assert.equal(await calc(p, wrong, 'animationName'), 'trace-bad-right', 'la mauvaise : une image-clé')
  assert.equal(inMs(await calc(p, wrong, 'animationDuration')), EXPRESSIVE)
  await p.waitForTimeout(EXPRESSIVE + 150)
  const after = await box(p, good), afterWrong = await box(p, wrong)
  ok(after.x - before.x, before.w + (await calcPx(p, '#trace .trace-board', 'columnGap')), 'la bonne carte est dans la colonne « Terminé »', 1.5)
  ok(afterWrong.x - beforeWrong.x, after.x - before.x, 'la mauvaise aussi — mais elle n\'y est pas allée, elle y est apparue', 1.5)
  assert.equal(await text(p, '#trace .motion-replay'), 'Rejouer')
  assert.match(await text(p, '#trace .gd-caption'), new RegExp(`^${EXPRESSIVE} ms sur la courbe du kit, lus sur le rendu`), 'la légende dit ce qui est lu')
  await close()
})

/* ── 2 · La cause ── */
test('2 · la cause : un seul geste ouvre les deux menus ; le bon grandit depuis le coin de son bouton, le mauvais depuis son centre et loin, déclaré ; le bouton de projet ouvre et ferme et dit son état', async () => {
  const { p, close } = await pageFree(URL())
  await p.locator('#cause').scrollIntoViewIfNeeded(); await p.waitForTimeout(150)
  const good = '#cause .origin-panel.is-good .origin-menu', wrong = '#cause .origin-panel.is-bad .origin-menu'
  assert.equal(await calc(p, good, 'opacity'), '0'); assert.equal(await calc(p, wrong, 'opacity'), '0')
  assert.equal(await calc(p, good, 'transformOrigin'), '0px 0px', 'le bon : depuis le coin qui touche son bouton')
  assert.notEqual(await calc(p, wrong, 'transformOrigin'), '0px 0px', 'le mauvais : depuis son centre')
  assert.notEqual(await calc(p, wrong, 'translate'), 'none', 'et loin de son bouton')
  assert.equal(await p.getAttribute('#cause .origin-panel.is-bad', 'data-intent'), 'statement', 'déclaré')
  for (const sel of [good, wrong]) {
    assert.equal(inMs(await calc(p, sel, 'transitionDuration').then((d) => d.split(',')[0])), SLOW, 'au cran du panneau')
    assert.equal(await calc(p, sel, 'transitionTimingFunction').then((t) => t.split(/,(?![^(]*\))/)[0].trim()), MOTION.curve)
  }
  assert.deepEqual(await p.$$eval('#cause .origin-trigger', (es) => es.map((e) => e.getAttribute('aria-expanded'))), ['false', 'false'])
  await p.locator('#cause .motion-replay').click(); await p.waitForTimeout(SLOW + 150)
  assert.equal(await calc(p, good, 'opacity'), '1'); assert.equal(await calc(p, wrong, 'opacity'), '1')
  assert.equal(await calc(p, good, 'scale'), '1'); assert.equal(await calc(p, wrong, 'translate'), '0px', 'ouvert, le mauvais a rejoint sa place — c\'est le trajet qui ment')
  assert.deepEqual(await p.$$eval('#cause .origin-trigger', (es) => es.map((e) => e.getAttribute('aria-expanded'))), ['true', 'true'], 'les deux boutons disent leur état')
  assert.equal(await text(p, '#cause .motion-replay'), 'Fermer')
  await p.locator('#cause .origin-panel.is-good .origin-trigger').click(); await p.waitForTimeout(SLOW + 150)
  assert.equal(await calc(p, wrong, 'opacity'), '0', 'le bouton de projet ferme les deux')
  assert.match(await text(p, '#cause .gd-caption'), new RegExp(`^${SLOW} ms, le cran du panneau · point de départ lu sur le rendu : le coin du bouton / son propre centre$`), 'la légende dit ce qui est lu')
  await close()
})

/* ── 3 · Le regard ── */
test('3 · le regard : une mise à jour ; côté faute, les huit cartes s’animent (déclaré) ; côté juste, une seule — celle qui a changé, étiquetée « Mis à jour » ; la suivante change de carte', async () => {
  const { p, close } = await pageFree(URL())
  await p.locator('#gaze').scrollIntoViewIfNeeded(); await p.waitForTimeout(150)
  assert.equal(await p.locator('#gaze .gaze-card').count(), 16, 'huit cartes de chaque côté')
  assert.equal(await move(p, '#gaze .gaze-card'), 0, 'rien ne bouge avant la mise à jour')
  assert.equal(await p.getAttribute('#gaze .gaze-panel.is-bad', 'data-intent'), 'statement')
  await p.locator('#gaze .motion-replay').click(); await p.waitForTimeout(80)
  assert.equal(await move(p, '#gaze .gaze-panel.is-bad .gaze-card'), 8, 'côté faute : les huit')
  assert.equal(await move(p, '#gaze .gaze-panel.is-good .gaze-card'), 1, 'côté juste : une seule')
  assert.equal(await p.locator('#gaze .gaze-panel.is-good .gaze-card.is-target').count(), 1)
  const target1 = await text(p, '#gaze .gaze-panel.is-good .gaze-card.is-target > span')
  assert.equal(await text(p, '#gaze .gaze-panel.is-good .gaze-card.is-target em'), 'Mis à jour')
  await p.waitForTimeout(EXPRESSIVE + 100)
  assert.equal(await calc(p, '#gaze .gaze-panel.is-good .gaze-card.is-target em', 'opacity'), '1', 'l\'étiquette est restée')
  assert.equal(await text(p, '#gaze .motion-replay'), 'Changer encore')
  await p.locator('#gaze .motion-replay').click(); await p.waitForTimeout(80)
  assert.notEqual(await text(p, '#gaze .gaze-panel.is-good .gaze-card.is-target > span'), target1, 'une autre carte change')
  assert.match(await text(p, '#gaze .gd-caption'), /^8 cartes animées d'un côté, 1 de l'autre — comptées sur le rendu/, 'la légende compte ce qui bouge')
  await close()
})

/* ── 4 · Les quatre paires ── */
test('4 · les quatre paires : le juste et le faux côte à côte, un seul geste joue les deux — le survol lent, le menu qui traîne, la naissance à zéro, l’ancienne règle qui coupait tout ; chaque tête de côté est lue sur le rendu', async () => {
  const { p, close } = await pageFree(URL())
  await p.locator('#wreck').scrollIntoViewIfNeeded(); await p.waitForTimeout(150)
  const head = (i, k) => text(p, `${band(i)} .mv-side:nth-child(${k}) .mv-verdict-head`)
  for (let i = 1; i <= 4; i++) {
    assert.equal(await p.getAttribute(`${band(i)} .mv-side:nth-child(1)`, 'data-intent'), null, `paire ${i} : le juste n'est pas une casse`)
    assert.equal(await p.getAttribute(`${band(i)} .mv-side:nth-child(2)`, 'data-intent'), 'statement', `paire ${i} : le fautif est déclaré`)
    assert.match(await head(i, 1), /✓/); assert.match(await head(i, 2), /✗/)
    assert.equal(await p.locator(`${band(i)} .doc-wreck`).count(), 0, `paire ${i} : pas de bouton casser`)
    assert.equal(await p.locator(`${band(i)} details.prov`).count(), 1, `paire ${i} : ses règles et sources`)
  }
  const R = 3 /* le ralenti des paires, écrit sur chaque scène */
  assert.deepEqual(await texts(p, '#wreck .mv-slowed'), Array(4).fill(`ralenti ×${R}`), 'le ralenti est écrit sur les quatre scènes')
  assert.equal(inMs(await calc(p, `${band(1)} .mv-row:not(.slow) .button`, 'transitionDuration')), MOTION.durations.fast.ms * R)
  assert.equal(inMs(await calc(p, `${band(1)} .mv-row.slow .button`, 'transitionDuration')), MOTION.durations.slow.ms * R)
  await p.locator(`${band(1)} .button`, { hasText: 'Survoler' }).click(); await p.waitForTimeout(120)
  assert.equal(await p.locator(`${band(1)} .mv-row .button.hovered`).count(), 6, 'un geste : le curseur passe sur les deux rangées au même instant')
  assert.match(await head(1, 1), new RegExp(`${MOTION.durations.fast.ms} ms — il suit le curseur`)); assert.match(await head(1, 2), new RegExp(`${MOTION.durations.slow.ms} ms — il poursuit le curseur`))
  assert.equal(inMs(await calc(p, `${band(2)} .mv-menu`, 'transitionDuration', 0)), MOTION.durations.base.ms * R, 'juste : le cran du menu, au ralenti')
  assert.equal(inMs(await calc(p, `${band(2)} .mv-menu`, 'transitionDuration', 1)), EXPRESSIVE * R, 'fautif : le cran d\'une section, au ralenti')
  assert.match(await head(2, 1), new RegExp(`${MOTION.durations.base.ms} ms — il est là quand on le veut`)); assert.match(await head(2, 2), new RegExp(`${EXPRESSIVE} ms — on l'attend`))
  await p.locator(`${band(2)} .button`).first().click(); await p.waitForTimeout(MOTION.durations.base.ms * R + 60)
  assert.equal(await p.locator(`${band(2)} .mv-menu.open`).count(), 2, 'un geste, deux menus ouverts')
  assert.match(await head(3, 1), /part de 0,95 — presque sa taille/); assert.match(await head(3, 2), /part de 0 — elle surgit du néant/)
  await p.locator(`${band(3)} .button`, { hasText: 'Notifier' }).click(); await p.waitForTimeout(MOTION.durations.base.ms * R + 60)
  assert.equal(await p.locator(`${band(3)} .mv-toast.there`).count(), 2, 'un geste, deux notifications')
  assert.equal(await calc(p, `${band(4)} .mv-toast`, 'transitionProperty', 0), 'opacity', 'notre règle : le fondu seul')
  assert.equal(await calc(p, `${band(4)} .mv-toast`, 'transitionDuration', 1), '0s', "l'ancienne règle : rien")
  assert.match(await head(4, 1), new RegExp(`le fondu reste \\(${MOTION.durations.base.ms} ms\\), le déplacement est parti`)); assert.match(await head(4, 2), /tout coupé : elle surgit sans passage/)
  await close()
})

/* ── 4 · Tout ce qui bouge prend un cran et la courbe ── */
test('4 · sur le rendu, chaque transition et chaque animation dure un cran du moteur (au ralenti dit par la scène près) et suit la courbe du kit — hors des ruptures déclarées', async () => {
  const { p, close } = await pageFree(URL())
  const faults = await p.evaluate(([MS, curve]) => {
    const f = []
    for (const el of document.querySelectorAll('main .motion-demo *, main .doc-band *')) {
      if (el.closest('[data-intent="statement"]')) continue
      const cs = getComputedStyle(el)
      const slowed = parseFloat(cs.getPropertyValue('--mv-slowed')) || 1 /* le ralenti est écrit sur la scène, lu ici */
      const read = (d) => { const v = parseFloat(d); return (d.trim().endsWith('ms') ? v : v * 1000) / slowed }
      for (const ms of cs.transitionDuration.split(',').map(read)) if (ms !== 0 && !MS.some((m) => Math.abs(m - ms) < 0.5)) f.push(`${el.className} : transition ${ms} ms n'est pas un cran`)
      if (cs.animationName !== 'none') for (const ms of cs.animationDuration.split(',').map(read)) if (!MS.some((m) => Math.abs(m - ms) < 0.5)) f.push(`${el.className} : animation ${ms} ms n'est pas un cran`)
      const fns = [...cs.transitionTimingFunction.split(/,(?![^(]*\))/), ...(cs.animationName !== 'none' ? cs.animationTimingFunction.split(/,(?![^(]*\))/) : [])]
      if (cs.transitionDuration.split(',').some((d) => read(d) > 0) || cs.animationName !== 'none') for (const c of fns) if (c.trim() !== curve && c.trim() !== 'linear') f.push(`${el.className} : courbe ${c.trim()}`)
    }
    return [...new Set(f)]
  }, [MS, MOTION.curve])
  assert.deepEqual(faults, [], `${faults.length} mouvement(s) hors moteur`)
  await close()
})
test('4 · la feuille : aucune durée ni courbe à la main hors d’une ligne qui se dit casse ou chorégraphie, et chaque rupture de la page est dite', () => {
  const css = CSS()
  for (const [sel, l] of linesAlongSelector(css)) {
    const bare = l.replace(/\/\*.*?\*\//g, '')
    if (!/transition|animation/.test(bare)) continue
    const main = /(?<![\w-])\d*\.?\d+(ms|s)(?![\w-])/.test(bare) || /cubic-bezier|\bease\b/.test(bare)
    if (main) assert.match(l, /casse \(hors chaîne\)|chorégraphie/, `${sel} : une valeur à la main qui ne se déclare pas`)
  }
  for (const sel of ['.origin-panel.is-bad .origin-menu', '.mv-row.slow .button', '.mv-menu.drags', '.mv-toast.nothing', '.mv-cut .mv-toast']) {
    const i = css.indexOf(sel); assert.ok(i >= 0, `casse absente : ${sel}`)
    assert.match(css.slice(i, css.indexOf('\n', i)), /casse|broken/, `${sel} : casse dite sur sa ligne`)
  }
  assert.ok((css.match(/chorégraphie/g) ?? []).length >= 8, 'les décalages du côté faute sont une chorégraphie, dite sur chaque ligne')
})

/* ── 5 · Sous mouvement réduit ── */
test('5 · réduit : plus un déplacement en transition ni en animation ; les fondus restent ; la bonne carte est quand même à l’arrivée, les menus s’ouvrent quand même', async () => {
  const free = await pageFree(URL()), reduced = await nav.page(URL(), { width: 1440 })
  const moves = (p) => p.evaluate(() => [...document.querySelectorAll('main .motion-demo *, main .doc-band *')].filter((e) => { const cs = getComputedStyle(e); return /translate|scale|transform|rotate/.test(cs.transitionProperty) || cs.animationName !== 'none' }).length)
  assert.ok(await moves(free.p) >= 3, 'libre : les objets se déplacent')
  await reduced.p.locator('#gaze .motion-replay').click(); await reduced.p.waitForTimeout(80)
  assert.equal(await moves(reduced.p), 0, 'réduit : plus un seul déplacement, même pendant la mise à jour')
  assert.equal(await calc(reduced.p, '#cause .origin-panel.is-good .origin-menu', 'transitionProperty'), 'opacity', 'réduit : le fondu du menu reste')
  assert.equal(await calc(reduced.p, '#gaze .gaze-panel.is-good .gaze-card.is-target em', 'opacity'), '1', 'réduit : la carte qui change est quand même étiquetée')
  const before = await box(reduced.p, '#trace .trace-panel.is-good .trace-moving')
  await reduced.p.locator('#trace .motion-replay').click(); await reduced.p.waitForTimeout(80)
  const after = await box(reduced.p, '#trace .trace-panel.is-good .trace-moving')
  assert.ok(after.x > before.x + before.w / 2, 'réduit : la carte est à l\'arrivée, d\'un coup')
  await reduced.p.locator('#cause .motion-replay').click(); await reduced.p.waitForTimeout(SLOW + 150)
  assert.equal(await calc(reduced.p, '#cause .origin-panel.is-good .origin-menu', 'opacity'), '1')
  await free.close(); await reduced.close()
})

/* ── 6 · L'écriture ── */
test('6 · l’écriture d’Auteur : aucun mot qui décrit l’écran ou raconte le geste ; une observation sous chaque titre, une légende lue par preuve, observation / règle / réglage distingués ; pas de badge décrété, pas de pied ; par démo, un titre et un bouton ; chaque côté est nommé une fois', async () => {
  const { p, close } = await nav.page(URL(), { width: 1440 })
  const body = await text(p, 'main')
  assert.doesNotMatch(body, /Regardez|Observez|Vous pouvez voir|Comme vous pouvez|Cliquez|Appuyez|Faites glisser|Essayez|À gauche|à droite|Cette démonstration/i, 'le texte ne décrit ni l\'écran ni le geste')
  assert.equal(await p.locator('main .gd-foot, main .motion-demo-index, main .motion-verdict').count(), 0, 'pas de pied, pas de surtitre, pas de badge décrété')
  assert.equal(await p.locator('main .gdoc-sec-head .muted').count(), 6, 'une phrase d\'observation sous chaque titre — une seule')
  assert.equal(await p.locator('main .gd-caption').count(), 3, 'une légende par preuve, et elle porte une valeur lue')
  assert.equal(await p.locator('main details.prov').count(), 8, 'les règles et sources sous chaque preuve, chaque paire, et la liste')
  for (const d of await p.locator('main details.prov summary').all()) await d.click()
  const said = await p.$$eval('#trace details.prov > div > p > b, #cause details.prov > div > p > b, #gaze details.prov > div > p > b', (es) => es.map((e) => e.textContent))
  assert.ok(['Observation.', 'Règle.', 'Réglage FILI.'].every((m) => said.filter((d) => d === m).length === 3), 'sous chaque preuve : observation, règle, réglage — distingués')
  for (const id of ['trace', 'cause', 'gaze']) {
    assert.equal(await p.locator(`#${id} .motion-demo-head > b`).count(), 1, `${id} : un titre`)
    assert.equal(await p.locator(`#${id} .motion-demo-head button`).count(), 1, `${id} : un bouton`)
    assert.deepEqual(await p.$$eval(`#${id} .motion-panel-head`, (es) => es.map((e) => e.children.length)), [1, 1], `${id} : chaque côté est nommé une fois, sans badge`)
  }
  assert.ok((await text(p, '.gdoc-hero .lede')).length < 320, 'l\'accroche tient en trois phrases')
  await close()
})

/* ── 7 · Les jetons, la densité, C17, rien en dur, la place dans le menu, les étages ── */
test('7 · les jetons : la démo est une coque, la carte de tâche et la carte du tableau de bord sont des cards, le menu parle au cran ligne ; la coque suit la base de la densité ; l’affiche et les sections glissent', async () => {
  for (const W of WIDTHS) {
    const { p, close } = await nav.page(URL(), { width: W })
    ok(await calcPx(p, '#trace .motion-demo', 'borderTopLeftRadius'), expected('r-1', W), `${W} — la démo, coin de coque`)
    ok(await calcPx(p, '#trace .trace-card', 'borderTopLeftRadius'), expected('r-2', W), `${W} — la carte de tâche, coin de card`)
    ok(await calcPx(p, '#trace .trace-card', 'paddingTop'), expected('pad-3-block', W), `${W} — la carte de tâche, marge de ligne`)
    ok(await calcPx(p, '#cause .origin-menu', 'paddingTop'), expected('pad-3-block', W), `${W} — le menu, marge de ligne`)
    ok(await calcPx(p, '#gaze .gaze-card', 'borderTopLeftRadius'), expected('r-2', W), `${W} — la carte du tableau, coin de card`)
    ok(await calcPx(p, '#gaze .gaze-card', 'paddingTop'), expected('pad-3-block', W), `${W} — la carte du tableau, marge de ligne`)
    await close()
  }
  for (const W of WIDTHS) {
    const { p, close } = await nav.page(URL(), { width: W })
    ok(await calcPx(p, `${band(1)} .mv-duo`, 'rowGap'), expected('pad-1-block', W), `${W} — la paire, l'écart de coque`)
    if (W >= 640) { ok(await calcPx(p, `${band(1)} .mv-duo`, 'columnGap'), expected('pad-1-inline', W), `${W} — l'écart entre les colonnes`); const [g, d] = await p.$$eval(`${band(1)} .mv-side`, (es) => es.map((e) => { const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width } })); assert.ok(Math.abs(g.y - d.y) < 1 && d.x > g.x + g.w - 1, `${W} — deux colonnes côte à côte`) }
    await close()
  }
  for (const density of ['compact', 'airy']) {
    const { p, close } = await nav.page(URL(), { width: 1440, density })
    ok(await calcPx(p, '#trace .motion-demo-head', 'paddingLeft'), expected('pad-1-inline', 1440, DENSITIES[density]), `${density} — la tête de démo suit la base`)
    await close()
  }
  const display = [], section = []
  for (const L of WIDTHS) {
    const { p, close } = await nav.page(URL(), { width: L })
    const h1 = await calcPx(p, '.gdoc-hero h1', 'fontSize'), h2 = await calcPx(p, '.gdoc-sec h2', 'fontSize')
    ok(h1, expected('doc-cover', L), `${L} — affiche`); ok(h2, expected('doc-section', L), `${L} — section`)
    display.push(h1); section.push(h2); await close()
  }
  assert.ok(display[0] < display[1] && display[1] < display[2] && section[0] < section[1] && section[1] < section[2], `glissent : ${display} / ${section}`)
})
test('7 · dans les deux thèmes, tout tertiaire rendu porte 600 au moins, au cran étiquette au moins, jamais un paragraphe lu', async () => {
  for (const theme of ['light', 'dark']) {
    const { p, close } = await nav.page(URL(), { width: 1440, theme })
    const f = await faultsC17(p, theme, 1440)
    assert.deepEqual(f, [], `${theme} : ${f.length} faute(s)`)
    await close()
  }
})
test('7 · marges, espaces, coins, tailles : chaque valeur calculée est une valeur du moteur — hors des valeurs déclarées ; zéro débord ; zéro erreur', async () => {
  const css = CSS(), g = GLOBAL()
  const exclusions = ['padding', 'gap', 'border-radius', 'margin'].flatMap((prop) => [...selectorsDeclaredAll(css, prop), ...selectorsDeclaredAll(g, prop), ...selectorsInEm(css, prop), ...selectorsInEm(g, prop)])
  const sizes = ['svg *', ...selectorsDeclaredAll(css, 'font-size'), ...selectorsDeclaredAll(g, 'font-size'), ...selectorsInEm(css), ...selectorsInEm(g)]
  for (const W of WIDTHS) {
    const { p, close, errors } = await nav.page(URL(), { width: W })
    for (const d of await p.locator('main details.prov summary').all()) await d.click()
    const f = await faultsInHard(p, W, DENSITIES.comfortable, { exclusions })
    assert.deepEqual(f, [], `${W} px : ${f.length} valeur(s) hors moteur`)
    const t = await faultsSizes(p, W, { exclusions: sizes })
    assert.deepEqual(t, [], `${W} px : ${t.length} taille(s) hors moteur`)
    assert.deepEqual(errors, [], 'la page ne jette aucune erreur')
    assert.equal(await overflow(p), 0, `${W} px : la page déborde de l'écran`)
    await close()
  }
})
test('7 · le mouvement est une fondation : le rail le range avec ses sœurs ; six sections, trois preuves, quatre paires, huit lignes en liste, neuf lignes de code lues au moteur', async () => {
  const { p, close } = await nav.page(URL(), { width: 1440 })
  const sisters = await texts(p, '.gdoc-rail .rail-block:first-of-type .rail-link')
  assert.ok(sisters.includes('Mouvement') && sisters.includes('Rythme'), `le rail : ${sisters.join(', ')}`)
  assert.equal(await text(p, '.gdoc-rail .rail-block:first-of-type .rail-heading'), 'Fondations')
  assert.equal(await p.locator('main .gdoc-sec').count(), 6, 'six sections')
  assert.equal(await p.locator('main .motion-demo').count(), 3, 'trois preuves')
  assert.equal(await p.locator('#wreck .doc-band').count(), 4, 'quatre paires')
  assert.equal(await p.locator('#invisibles .doc-list tbody tr').count(), 8, 'huit lignes en liste')
  assert.equal(await p.locator('#code .doc-code tbody tr').count(), 9, 'neuf lignes de code')
  const code = await texts(p, '#code .doc-code .cs-val')
  assert.deepEqual(code.slice(0, 4), MS.map((m) => `${m} ms`), 'le registre dit les quatre crans, lus au moteur')
  await close()
})
