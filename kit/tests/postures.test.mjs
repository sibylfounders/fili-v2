/* L'ÉPREUVE DES POSTURES — kit/tests/postures.test.mjs (stratégie postures, 11 septembre 2026)
   Ce qu'on déclare une fois, on le vérifie partout. Les huit pages du kit passent dans la
   matrice N2 — appareils × orientations × ouvertures — par l'émulation du navigateur (la
   surface est imposée, une pliure aussi, avec ses segments de viewport), et l'épreuve mesure
   ce que la page a composé, sans l'œil et sans lire le verdict de la couche (elle remesure).

   1 · la déclaration : une page sans gabarit déclaré au moteur ne se juge pas — refus de
       statuer (bloquant, comme « tu n'écris jamais un nombre ») ; le niveau est dit au produit
       ET à la zone ;
   2 · le passage : dans chaque situation, chaque zone rendue tient sa largeur de travail (ou
       ses libellés entiers), aucune zone n'est à cheval sur une frontière, au moins une zone
       tient (sinon le modèle fuit), la posture lue sur <html> est celle que la situation
       impose, zéro débord, zéro erreur ;
   3 · les seuils : tout seuil écrit dans une feuille est une somme du moteur, ou figure dans
       la liste figée des seuils de scène — jamais un nombre de plus ; tokens.css et
       globals.css disent la même somme pour le rail ;
   4 · de part et d'autre du seuil : mêmes commandes, même ordre (règle de survie 3) — le
       sommaire du rail et celui de la feuille sont les mêmes ancres, les sœurs du rail sont dans
       le menu, dans le même ordre ; le focus entre dans la feuille ;
   5 · le banc : allumé, chaque zone porte son nom et sa mesure, le panneau dit la posture et
       le verdict, et son verdict est celui de l'épreuve.

   Ce que cette épreuve NE juge PAS : si les largeurs de travail déclarées sont les bonnes (⚪ —
   réglages à valider à l'œil, au banc), ni les seuils intérieurs aux scènes (figés, dette dite). */
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { LAYOUTS, POSTURE, ROOT_BROWSER } from '../derivation.mjs'
import { KIT, openSite, openBrowser, overflow } from './bench.mjs'

const PAGES = ['/', '/adaptation', '/rythme', '/composition', '/couleur', '/arrondis', '/typo', '/mouvement']

/* LA MATRICE N2 vit dans tests/situations.mjs depuis le 11 septembre 2026 (soir) : l'épreuve des
   voisins (verify.mjs) passe n'importe quel HTML par les mêmes treize situations. */
import { MATRIX, FOLD, segmentsOf, hingeOf } from './situations.mjs'
const postureOf = (s) => POSTURE.keyOf(POSTURE.derive({ widthRem: s.w / ROOT_BROWSER, segments: s.feature ? 2 : 1, hinge: hingeOf(s), twoZones: LAYOUTS.doc.twoZones }))

let site, nav
before(async () => { site = await openSite(); nav = await openBrowser() })
after(async () => { await nav?.close(); site?.close() })

/* Une page dans une situation : la surface et la pliure sont imposées au navigateur par
   l'émulation (ce que DevTools fait avec un Galaxy Fold en « écran double »), AVANT le
   chargement — la page compose dès son premier rendu, comme sur l'appareil. */
async function open(pathname, s, { bench = false } = {}) {
  const ctx = await nav.browser.newContext({ viewport: { width: s.w, height: s.h }, reducedMotion: 'reduce' })
  await ctx.addInitScript((bench) => { try { localStorage.clear(); localStorage.setItem('kit-theme', 'light'); if (bench) localStorage.setItem('kit-bench', 'oui') } catch {} }, bench)
  const p = await ctx.newPage()
  const errors = []
  p.on('pageerror', (e) => errors.push(String(e)))
  p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
  const cdp = await ctx.newCDPSession(p)
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: s.w, height: s.h, deviceScaleFactor: 1, mobile: false, ...(s.feature ? { displayFeature: s.feature } : {}) })
  await p.goto(site.url + pathname, { waitUntil: 'networkidle' })
  await p.evaluate(() => document.fonts.ready)
  await p.waitForTimeout(120) /* la couche lit après le premier rendu */
  return { p, errors, close: () => ctx.close() }
}

/* Ce que l'épreuve lit sur la page, par elle-même : le gabarit présent, ses zones rendues avec leur
   rectangle, la coupe des libellés — d'après les sélecteurs déclarés au moteur, pas d'après la couche. */
const LAYOUT_DECLS = Object.fromEntries(Object.entries(LAYOUTS).filter(([, v]) => v.zones) /* les gabarits : ce qui déclare des zones */.map(([k, v]) => [k, { root: v.root, level: v.level, zones: Object.fromEntries(Object.entries(v.zones).map(([n, z]) => [n, { rem: z.rem, comfort: z.comfort, token: z.token, selector: z.selector }])) }]))
const read = (p) => p.evaluate((L) => {
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
  const key = Object.keys(L).find((k) => document.querySelector(L[k].root)) ?? null
  const zones = []
  if (key) for (const [name, z] of Object.entries(L[key].zones)) {
    const el = document.querySelector(z.selector)
    if (!el) continue
    const cs = getComputedStyle(el)
    if (cs.display === 'none' || cs.visibility === 'hidden' || !el.getClientRects().length) continue
    const r = el.getBoundingClientRect()
    const cut = [...el.querySelectorAll('.rail-link, .rail-heading')].some((n) => n.scrollWidth > n.clientWidth + 1)
    zones.push({ name, rem: z.rem, comfort: z.comfort, token: z.token, x: r.left, y: r.top, w: r.width, h: r.height, widthRem: r.width / rem, cut })
  }
  const d = document.documentElement.dataset
  return { key, level: key ? L[key].level : null, zones, told: { layout: d.layout ?? null, level: d.level ?? null, zones: d.zones ?? null, segments: d.segments ?? null, posture: d.posture ?? null } }
}, LAYOUT_DECLS)

/* LE JUGE — les règles de survie, appliquées à ce qui a été lu. Il rend une liste de fautes ; vide, c'est vert.
   Sans déclaration, il ne juge pas : il refuse de statuer. */
export function judge(facts, s) {
  if (!facts.key) throw new Error('refus de statuer — aucun gabarit déclaré au moteur sur cette page (LAYOUTS)')
  if (!facts.level) throw new Error(`refus de statuer — le gabarit ${facts.key} ne déclare pas son niveau`)
  const faults = []
  const segs = segmentsOf(s)
  if (facts.zones.length === 0) faults.push('aucune zone ne tient : la page réclamerait un écran dédié — le modèle fuit')
  for (const z of facts.zones) {
    if (z.rem === undefined && !z.token) throw new Error(`refus de statuer — la zone ${z.name} ne déclare ni largeur de travail ni cran`)
    if (z.rem !== undefined && z.widthRem + 0.1 < z.rem) faults.push(`${z.name} : ${z.widthRem.toFixed(1)} rem, sous sa largeur de travail (${z.rem})`)
    if (z.token && z.cut) faults.push(`${z.name} : un libellé se coupe`)
    /* deux zones sur un seul segment : la lecture garde son confort (c'est la somme qui a décidé) */
    if (z.comfort && segs.length === 1 && facts.zones.length >= 2 && z.widthRem + 0.1 < z.comfort) faults.push(`${z.name} : ${z.widthRem.toFixed(1)} rem, sous son confort (${z.comfort}) alors que deux zones tiennent`)
    if (segs.length > 1) {
      const vis = { l: Math.max(z.x, 0), r: Math.min(z.x + z.w, s.w), t: Math.max(z.y, 0), b: Math.min(z.y + z.h, s.h) }
      const inside = segs.some((g) => vis.l >= g.x - 1 && vis.r <= g.x + g.w + 1 && vis.t >= g.y - 1 && vis.b <= g.y + g.h + 1)
      if (vis.r > vis.l && vis.b > vis.t && !inside) faults.push(`${z.name} : à cheval sur la frontière (${Math.round(vis.l)} → ${Math.round(vis.r)} × ${Math.round(vis.t)} → ${Math.round(vis.b)})`)
    }
  }
  /* la couche dit ce que l'épreuve mesure — sinon le banc mentirait */
  const t = facts.told
  if (t.layout !== facts.key) faults.push(`la couche dit le gabarit « ${t.layout} », la page porte « ${facts.key} »`)
  if (t.segments !== String(segs.length)) faults.push(`la couche compte ${t.segments} segment(s), la situation en impose ${segs.length}`)
  if (t.posture !== postureOf(s)) faults.push(`la couche lit la posture « ${t.posture} », la situation impose « ${postureOf(s)} »`)
  if (t.zones !== String(facts.zones.length)) faults.push(`la couche compte ${t.zones} zone(s), l'épreuve en mesure ${facts.zones.length}`)
  return faults
}

test('1 · la déclaration : le kit se déclare N2 ; chaque zone déclare sa largeur de travail ou son cran, et ce qu\'elle protège ; une page sans gabarit déclaré ne se juge pas — refus de statuer', async () => {
  for (const [k, l] of Object.entries(LAYOUTS)) {
    if (!l.zones) continue /* les gabarits seuls : le reste de LAYOUTS est un registre (surfaces, scènes, seuils figés) */
    assert.equal(l.level, 'N2', `${k} : le niveau`)
    for (const [n, z] of Object.entries(l.zones)) {
      assert.ok(z.rem !== undefined || z.token, `${k}.${n} : une largeur de travail ou un cran`)
      assert.ok(z.protects && z.selector, `${k}.${n} : ce qu'elle protège, et où la lire`)
    }
  }
  /* la page qui n'existe pas n'a pas de gabarit : le juge refuse, il ne rend pas un vert par défaut */
  const s = MATRIX[4]
  const { p, close } = await open('/nulle-part', s)
  const facts = await read(p)
  assert.equal(facts.key, null)
  assert.throws(() => judge(facts, s), /refus de statuer — aucun gabarit déclaré/)
  await close()
})

test('2 · le passage : les huit pages dans la matrice N2 — chaque zone tient sa largeur de travail, aucune n\'est à cheval sur une frontière, au moins une tient, la posture lue est celle de la situation, zéro débord, zéro erreur', async () => {
  const faults = []
  for (const s of MATRIX) {
    for (const page of PAGES) {
      const { p, errors, close } = await open(page, s)
      const facts = await read(p)
      for (const f of judge(facts, s)) faults.push(`${s.name} · ${page} — ${f}`)
      const o = await overflow(p)
      if (o > 0) faults.push(`${s.name} · ${page} — la page déborde de ${o} px`)
      for (const e of errors) faults.push(`${s.name} · ${page} — erreur : ${e}`)
      await close()
    }
  }
  assert.deepEqual(faults, [], `${faults.length} faute(s) au passage`)
})

test('2 · les postures divisées, mesurées : en Livre le rail est dans le panneau gauche et la lecture dans le droit ; en Laptop la lecture est en haut et le rail en bas, nav et repères côte à côte', async () => {
  const book = MATRIX.find((s) => s.name.includes('Livre')), laptop = MATRIX.find((s) => s.name.includes('Laptop'))
  {
    const { p, close } = await open('/typo', book)
    const f = await read(p)
    const rail = f.zones.find((z) => z.name === 'nav'), reading = f.zones.find((z) => z.name === 'reading')
    assert.ok(rail && reading, 'rail et lecture sont là')
    assert.ok(rail.x + rail.w <= FOLD.side - FOLD.mask / 2 + 1, `le rail finit avant la charnière (${Math.round(rail.x + rail.w)} px)`)
    assert.ok(reading.x >= FOLD.side + FOLD.mask / 2 - 1, `la lecture commence après (${Math.round(reading.x)} px)`)
    assert.equal(f.told.posture, 'book')
    await close()
  }
  {
    const { p, close } = await open('/typo', laptop)
    const f = await read(p)
    const rail = f.zones.find((z) => z.name === 'nav'), marks = f.zones.find((z) => z.name === 'marks'), reading = f.zones.find((z) => z.name === 'reading')
    assert.ok(rail && marks && reading, 'rail, repères et lecture sont là')
    assert.ok(reading.y + reading.h <= FOLD.side - FOLD.mask / 2 + 1, `la lecture finit avant la charnière (${Math.round(reading.y + reading.h)} px)`)
    assert.ok(rail.y >= FOLD.side + FOLD.mask / 2 - 1 && marks.y >= FOLD.side + FOLD.mask / 2 - 1, 'le rail est en bas')
    assert.ok(Math.abs(rail.y - marks.y) < 2 && marks.x > rail.x, 'nav et repères côte à côte')
    assert.equal(f.told.posture, 'laptop')
    await close()
  }
})

test('3 · les seuils : chaque seuil de fenêtre des feuilles est dans la liste figée du moteur — jamais un de plus ; les requêtes de conteneur de la lecture sont des sommes ; tokens.css et globals.css disent la même somme pour le rail', () => {
  const sheets = ['app/kit.css', 'app/app.css', 'app/demo.css', 'app/accueil.css', ...fs.readdirSync(path.join(KIT, 'app'), { withFileTypes: true }).filter((d) => d.isDirectory()).flatMap((d) => fs.readdirSync(path.join(KIT, 'app', d.name)).filter((f) => f.endsWith('.css')).map((f) => `app/${d.name}/${f}`))]
  const found = {}
  const containers = []
  for (const f of sheets) {
    const src = fs.readFileSync(path.join(KIT, f), 'utf8')
    const w = [...src.matchAll(/@media \((?:max-width|min-width|width\s*[<>]=?)\s*:?\s*([\d.]+)(rem|em|px)\)/g)].map((m) => (m[2] === 'px' ? `${m[1]}px` : parseFloat(m[1])))
    const scene = w.filter((v) => !(f === 'app/app.css' && v === LAYOUTS.doc.sums.rail))
    if (scene.length) found[f] = scene
    for (const m of src.matchAll(/@container [a-z]+ \(width < ([\d.]+)rem\)/g)) containers.push(parseFloat(m[1]))
  }
  assert.deepEqual(found, LAYOUTS.sceneThresholds, 'les seuils de scène : la liste figée, feuille par feuille — un seuil de fenêtre nouveau doit devenir une somme')
  const sums = [...Object.values(LAYOUTS.doc.sums), ...Object.values(LAYOUTS.scenes).map((sc) => sc.sum)]
  for (const c of containers) assert.ok(sums.includes(c), `${c} rem : une requête de conteneur qui n'est pas une somme du moteur`)
  assert.deepEqual([...new Set(containers)].sort(), [LAYOUTS.doc.sums.band, LAYOUTS.doc.sums.table, LAYOUTS.doc.sums.list, ...Object.values(LAYOUTS.scenes).map((sc) => sc.sum)].sort(), 'la bande, la table, la liste, et chaque scène déclarée : des sommes, lues sur leur conteneur — jamais sur la fenêtre')
  for (const sc of Object.values(LAYOUTS.scenes)) for (const c of Object.values(sc.columns)) assert.ok(c.rem > 0 && c.protects, 'chaque colonne de scène dit ce qu\'elle protège')
  const tokens = fs.readFileSync(path.join(KIT, 'app/tokens.css'), 'utf8'), globals = fs.readFileSync(path.join(KIT, 'app/app.css'), 'utf8')
  assert.ok(tokens.includes(`@media (min-width: ${LAYOUTS.doc.sums.rail}rem)`) && tokens.includes('--doc-zones: 2;'), 'tokens.css : la somme du rail, écrite par le moteur')
  assert.ok(globals.includes(`@media (width < ${LAYOUTS.doc.sums.rail}rem)`), 'app.css : la même somme')
  assert.ok(globals.includes('container: reading / inline-size'), 'la zone de lecture est un conteneur nommé')
  assert.ok(globals.includes('container: chrome / inline-size'), 'l\'en-tête est un conteneur nommé : la bande d\'atelier lit sa place')
})

test('4 · de part et d\'autre du seuil : mêmes commandes, même ordre — le sommaire du rail et celui de la feuille sont les mêmes ancres, les sœurs du rail sont dans le menu, dans le même ordre ; le focus entre dans la feuille', async () => {
  const wide = MATRIX[4], narrow = MATRIX[6]
  const { p: a, close: closeA } = await open('/rythme', wide)
  const toc = await a.$$eval('.gdoc-rail .rail-sum .rail-link', (ns) => ns.map((n) => n.textContent.trim()))
  const sisters = await a.$$eval('.gdoc-rail .rail-block:not(.rail-sum) .rail-link', (ns) => ns.map((n) => n.textContent.trim()))
  assert.ok(toc.length >= 3 && sisters.length >= 3)
  await closeA()
  const { p: b, close: closeB } = await open('/rythme', narrow)
  assert.equal(await b.$eval('.gdoc-rail', (n) => getComputedStyle(n).display), 'none', 'sous la somme, le rail cède')
  await b.locator('.nav-bar .dot').nth(1).click(); await b.waitForTimeout(150)
  const tocSheet = await b.$$eval('.sheet.from-below.open .rail-link', (ns) => ns.map((n) => n.textContent.trim()))
  assert.deepEqual(tocSheet, toc, 'les mêmes ancres, dans le même ordre')
  assert.ok(await b.evaluate(() => document.querySelector('.sheet.from-below.open')?.contains(document.activeElement)), 'le focus est dans la feuille')
  await b.keyboard.press('Escape'); await b.waitForTimeout(100)
  await b.locator('.nav-bar .dot').nth(0).click(); await b.waitForTimeout(150)
  const menu = await b.$$eval('.sheet.open:not(.from-below) .index-link', (ns) => ns.map((n) => n.textContent.trim()))
  const inMenu = menu.filter((n) => sisters.includes(n))
  assert.deepEqual(inMenu, sisters, 'les sœurs du rail, dans le menu, dans le même ordre')
  await closeB()
})

test('5 · le banc : allumé depuis le drawer et mémorisé, chaque zone porte son nom et sa mesure, le panneau dit la posture et le verdict — et son verdict est celui de l\'épreuve', async () => {
  const s = MATRIX.find((x) => x.name.includes('Livre'))
  const { p, close } = await open('/couleur', s, { bench: true })
  assert.equal(await p.evaluate(() => document.documentElement.dataset.bench), 'oui', 'mémorisé')
  assert.ok(await p.locator('.bench-hud').count() === 1, 'le panneau')
  const hud = await p.locator('.bench-hud').textContent()
  assert.match(hud, /Posture Livre/); assert.match(hud, /2 segments/); assert.match(hud, /gabarit doc · N2/)
  assert.match(hud, /✓ une seule mise en page/, `le verdict du banc : ${hud}`)
  const said = await p.$$eval('[data-zone]', (ns) => ns.map((n) => [n.dataset.zone, n.dataset.zoneSays, n.dataset.zoneOk]))
  const facts = await read(p)
  assert.deepEqual(said.map((z) => z[0]).sort(), facts.zones.map((z) => z.name).sort(), 'chaque zone rendue est nommée')
  for (const [name, says, ok] of said) { assert.match(says, new RegExp(`^${name} · [\\d,]+`), 'sa mesure'); assert.equal(ok, 'oui') }
  assert.equal(await p.locator('.bench-tag').count(), said.length, 'une étiquette par zone, hors du flux')
  assert.deepEqual(judge(facts, s), [], 'le verdict du banc est celui de l\'épreuve')
  await close()
  /* depuis le drawer, sur une fenêtre : le banc s'allume, se souvient, s'éteint */
  const d = MATRIX[4]
  const { p: q, close: closeQ } = await open('/rythme', d)
  await q.locator('button.drawer-handle').click()
  await q.locator('[data-choice-bench="oui"]').click(); await q.waitForTimeout(150)
  assert.equal(await q.evaluate(() => document.documentElement.dataset.bench), 'oui')
  assert.ok(await q.locator('.bench-hud').count() === 1)
  assert.match(await q.locator('.bench-hud').textContent(), /Posture Tablet .*3 zones|3 zones/s)
  assert.equal(await q.evaluate(() => localStorage.getItem('kit-bench')), 'oui', 'mémorisé')
  await q.locator('[data-choice-bench="non"]').click(); await q.waitForTimeout(150)
  assert.equal(await q.locator('.bench-hud').count(), 0)
  assert.equal(await q.locator('[data-zone]').count(), 0, 'éteint, rien n\'est écrit dans la page')
  await closeQ()
})
