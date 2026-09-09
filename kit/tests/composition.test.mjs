/* LE CRASH-TEST DE LA PAGE COMPOSITION — kit/tests/composition.test.mjs
   Ce qui doit être vrai à l'écran, mesuré sans l'œil (écrit le 7 septembre
   2026, quand la page a pris ses deux étages du bas et fermé sa dette) :
   1 · chaque chiffre affiché est MESURÉ sur le rendu, jamais déclaré — les cotes
       de la preuve 01, la part d'encre de la preuve 03 ;
   2 · chaque pièce du kit est rendue par son token : la scène est une coque, un
       banc s'écarte du deuxième cran de page, la légende parle au petit cran ;
       et la paire du bas tient sa propre loi — dedans plus serré que dehors ;
   3 · chaque casse rend le mensonge qu'elle déclare, et se répare : les cinq
       fautes de l'écran (et le survol qui répare), l'espace blanc retiré, et
       les quatre paires — le côté fautif diffère du juste par UNE chose, mesurée ;
   4 · la densité règle les coques, jamais un corps ; les titres glissent ;
   5 · le tertiaire suit C17 ;
   6 · rien en dur — hors des lignes qui le disent (les objets imités sont des
       réductions déclarées, exclues par leur nom) ; zéro débord ; zéro erreur ;
       et les quinze lois sont toutes là, une seule fois chacune.

   Ce que cette épreuve NE juge PAS, et dit : le chemin de l'œil (preuve 02)
   et le blanc donné avant d'être repris se jugent à la relecture. Elle vérifie
   seulement que la preuve 02 rend ses deux tracés et que rien n'y est cassé. */
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { DENSITIES } from '../derivation.mjs'
import { KIT, WIDTHS, TOL, openSite, openBrowser, expected, near, numbers, calcPx, calc, text, texts, faultsC17, faultsInHard, faultsSizes, selectorsDeclaredAll, selectorsInEm, overflow, rgb, inks , faultsWriting } from './bench.mjs'

const ok = (a, b, msg, tol = TOL) => assert.ok(a !== null && near(a, b, tol), `${msg} : ${a} attendu ${b}`)
const CSS = () => fs.readFileSync(path.join(KIT, 'app/composition/composition.css'), 'utf8')
const GLOBAL = () => fs.readFileSync(path.join(KIT, 'app/globals.css'), 'utf8')
const VIEW = () => fs.readFileSync(path.join(KIT, 'app/composition/view.tsx'), 'utf8')

let site, nav
before(async () => { site = await openSite(); nav = await openBrowser() })
after(async () => { await nav?.close(); site?.close() })
const URL = () => site.url + '/composition'
const wreck = (p, name) => p.locator('#broken .button.broken', { hasText: name }).click()
const band = (i) => `#bands .doc-band:nth-child(${i})`
const side = (i, k) => `${band(i)} .cb-side:nth-child(${k})` /* 1 = le juste, 2 = le fautif */
const boxes = (p, sel) => p.evaluate((sel) => [...document.querySelectorAll(sel)].map((e) => { const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height, b: r.bottom } }), sel)

/* ── 1 · Chaque chiffre affiché est mesuré sur le rendu ── */
test('1 · les cotes de « écarts tous égaux » sont les distances rendues entre les blocs ; « quatre axes » compte les départs distincts ; la rupture compte ses cibles ; la part d’encre est celle du rendu', async () => {
  const { p, close } = await nav.page(URL(), { width: 1440 })
  await wreck(p, 'écarts tous égaux'); await p.waitForTimeout(80)
  const blocks = await boxes(p, '#broken .co-app-body > .co-b'), lines = await boxes(p, '#broken .co-list .co-li')
  const readSet = numbers((await texts(p, '#broken .co-r-label')).join(' '))
  const expectedAll = []
  for (let i = 0; i < blocks.length - 1; i++) expectedAll.push(Math.round(Math.max(blocks[i + 1].y - blocks[i].b, 1)))
  expectedAll.push(Math.round(Math.max(lines[1].y - lines[0].b, 1)))
  assert.deepEqual(readSet, expectedAll, 'les cotes sont les distances rendues')
  assert.ok(new Set(expectedAll).size === 1, `cassé, tous les écarts mesurent pareil : ${expectedAll}`)
  await wreck(p, 'quatre axes'); await p.waitForTimeout(80)
  const begins = [...new Set((await boxes(p, '#broken .co-app-body > .co-b')).map((r) => Math.round(r.x)))]
  assert.equal(await p.locator('#broken .co-r-thread').count(), begins.length, 'un fil par départ distinct')
  assert.ok(begins.length >= 3, `quatre axes : ${begins.length} départs distincts`)
  await wreck(p, 'la rupture partout'); await p.waitForTimeout(80)
  const targets = await p.locator('#broken .co-app .co-label, #broken .co-app .co-b1, #broken .co-app .co-b2, #broken .co-app .co-pct, #broken .co-app .co-app-head b').count()
  assert.match(await text(p, '#broken .co-r-label'), new RegExp(`dépensé ${targets} fois`))
  /* la part d'encre : recomputée ici de la même façon — l'aire des boîtes de texte sur l'aire de la page */
  await p.waitForTimeout(80)
  const part = await p.evaluate(() => {
    const art = document.querySelector('#blanc .co-mag'), base = art.getBoundingClientRect(), range = document.createRange()
    let area = 0
    const walk = (n) => { n.childNodes.forEach((c) => { if (c.nodeType === 3 && c.textContent.trim()) { range.selectNodeContents(c); for (const r of range.getClientRects()) area += r.width * r.height } else if (c.nodeType === 1) walk(c) }) }
    walk(art); return Math.round((area / (base.width * base.height)) * 100)
  })
  assert.ok(part > 5 && part < 60, `une part d'encre plausible : ${part} %`)
  assert.match(await text(p, '#blanc .rank .badge'), new RegExp(`l'encre occupe ${part} %`))
  await close()
})

/* ── 2 · Chaque pièce du kit est rendue par son token ── */
test('2 · la scène est une coque, le banc s’écarte du deuxième cran de page, la légende parle au petit cran ; la paire du bas est deux colonnes — l’écart entre elles dépasse tout écart dedans', async () => {
  for (const W of WIDTHS) {
    const { p, close } = await nav.page(URL(), { width: W })
    ok(await calcPx(p, '#broken .co-scene', 'paddingTop'), expected('pad-1-block', W), `${W} — la scène, marge de coque (haut)`)
    ok(await calcPx(p, '#broken .co-scene', 'paddingLeft'), expected('pad-1-inline', W), `${W} — la scène, marge de coque (côté)`)
    ok(await calcPx(p, '#broken .co-scene', 'borderTopLeftRadius'), expected('r-1', W), `${W} — coin de coque`)
    ok(await calcPx(p, '#broken .co-bench', 'columnGap'), expected('page-2-inline', W), `${W} — le banc, deuxième cran de page`)
    ok(await calcPx(p, '#journey .co-pair', 'columnGap'), expected('page-2-inline', W), `${W} — journal et affiche, deuxième cran de page`)
    ok(await calcPx(p, '#broken .co-lex dt', 'fontSize'), expected('font-size-small', W), `${W} — la légende au petit cran`)
    ok(await calcPx(p, '#broken .co-says', 'fontSize'), expected('font-size-body', W), `${W} — le commentaire au corps`)
    /* la paire : à deux colonnes, l'écart entre elles est la marge de coque, et il domine */
    ok(await calcPx(p, '#bands .cb-pair', 'rowGap'), expected('pad-1-block', W), `${W} — la paire, l'écart de coque (haut)`)
    if (W >= 640) {
      const between = await calcPx(p, '#bands .cb-pair', 'columnGap')
      ok(between, expected('pad-1-inline', W), `${W} — la paire, l'écart de coque entre colonnes`)
      const inside = await p.evaluate(() => Math.max(...[...document.querySelectorAll('#bands .cb-side:first-child *')].flatMap((e) => { const cs = getComputedStyle(e); return [cs.rowGap, cs.columnGap, cs.marginTop, cs.marginBottom].map(parseFloat).filter((v) => !Number.isNaN(v)) })))
      assert.ok(between > inside + TOL, `${W} — dedans plus serré que dehors : ${inside} < ${between}`)
      const [g, d] = await boxes(p, `${band(1)} .cb-side`)
      assert.ok(Math.abs(g.y - d.y) < 1 && d.x > g.x + g.w, `${W} — deux colonnes côte à côte`)
    } else {
      const [g, d] = await boxes(p, `${band(1)} .cb-side`)
      assert.ok(d.y >= g.b - TOL && Math.abs(d.x - g.x) < 1, `${W} — sur téléphone, la paire s'empile`)
    }
    /* le juste ne dépense que le registre : un badge, un bouton, une carte du kit */
    ok(await calcPx(p, `${side(1, 1)} .button`, 'minHeight'), expected('control-height', W), `${W} — le bouton du juste est le bouton du kit`)
    ok(await calcPx(p, `${side(3, 1)} .card`, 'paddingTop'), expected('pad-2-block', W), `${W} — la carte du juste est la carte du kit`)
    ok(await calcPx(p, `${side(3, 1)} .card`, 'borderTopLeftRadius'), expected('r-2', W), `${W} — coin de carte`)
    ok(await calcPx(p, `${side(4, 1)} .cb-block.slab`, 'paddingLeft'), expected('pad-3-inline', W), `${W} — le pavé, marge de ligne`)
    await close()
  }
})
test('2 · la feuille consomme, pour chaque pièce, le token qu’elle nomme, et dit chacune de ses casses', () => {
  const css = CSS(), g = GLOBAL()
  const block = (src, sel) => { const i = src.indexOf(`\n${sel} {`); assert.ok(i >= 0, `sélecteur absent : ${sel}`); return src.slice(i, src.indexOf('}', i)) }
  const waits = (src, sel, decl) => assert.ok(block(src, sel).includes(decl), `${sel} : « ${decl} » attendu`)
  waits(g, '.co-scene', 'padding: var(--pad-1-block) var(--pad-1-inline)'); waits(g, '.co-bench', 'gap: var(--page-2-inline)')
  waits(g, '.co-duo-t', 'gap: var(--page-2-inline)'); waits(g, '.co-pair', 'gap: var(--page-2-inline)')
  waits(css, '.cb-pair', 'gap: var(--pad-1-block) var(--pad-1-inline)'); waits(css, '.cb-photos', 'gap: var(--gap-4-block)')
  waits(css, '.cb-block.slab', 'padding: var(--pad-3-block) var(--pad-3-inline)')
  for (const sel of ['.cb-photos.cut > .cb-caption', '.cb-card.heavy', '.cb-column.defeat .cb-block.heading', '.cb-column.defeat .cb-block.text', '.cb-column.defeat .cb-block.slab']) {
    const i = css.indexOf(sel); assert.ok(i >= 0, `casse absente : ${sel}`)
    assert.match(css.slice(css.lastIndexOf('\n', i), css.indexOf('\n', i)), /casse|broken/, `${sel} : casse dite sur sa ligne`)
  }
  /* la dette du 25 août est fermée : plus un bloc de dette dans le registre de la page, chaque valeur restante dit qu'elle est une réduction */
  const start = g.indexOf('PAGE COMPOSITION'), end = g.indexOf('LES TROIS ÉTAGES', start) > 0 ? g.indexOf('LES TROIS ÉTAGES', start) : g.length
  const blockPage = g.slice(start, end)
  assert.ok(!/HORS CHAÎNE — dette déclarée/.test(blockPage), 'plus de dette déclarée sur la page')
  assert.ok((blockPage.match(/réduction déclarée/g) ?? []).length >= 9, 'les réductions sont dites, une par ligne')
})

/* ── 3 · Chaque casse rend le mensonge qu'elle déclare, et se répare ── */
test('3 · l’écran : deux dominants, tout cloisonné, écarts égaux, quatre axes, la rupture partout — chacune rendue, et le survol la répare', async () => {
  const { p, close } = await nav.page(URL(), { width: 1440 })
  const app = '#broken .co-app'
  const rest = { heading: await calcPx(p, `${app} .co-list .co-label`, 'fontSize'), kpi: await calcPx(p, `${app} .co-kpi b`, 'fontSize'),
    edge: await calcPx(p, `${app} .co-b`, 'borderTopWidth'), begins: new Set((await boxes(p, `${app} .co-app-body > .co-b`)).map((r) => Math.round(r.x))).size }
  assert.ok(rest.heading < rest.kpi / 2, 'au repos, un seul dominant'); assert.equal(rest.edge, 0, 'au repos, aucun cadre'); assert.equal(rest.begins, 1, 'au repos, un seul axe')
  const hover = async () => { await p.hover(`${app}`); await p.waitForTimeout(60) }
  const far = async () => { await p.mouse.move(5, 5); await p.waitForTimeout(60) }
  /* deux dominants */
  await wreck(p, 'deux dominants'); await far()
  ok(await calcPx(p, `${app} .co-list .co-label`, 'fontSize'), rest.kpi, 'cassé : le titre de la liste au corps du chiffre', 0.5)
  assert.match(await text(p, '#broken .co-verdict .badge.ko'), /deux dominants/)
  await hover(); ok(await calcPx(p, `${app} .co-list .co-label`, 'fontSize'), rest.heading, 'survolé : réparé')
  /* tout cloisonné */
  await wreck(p, 'deux dominants'); await wreck(p, 'tout cloisonné'); await far()
  assert.equal(await p.locator(`${app} .co-b`).evaluateAll((es) => es.filter((e) => parseFloat(getComputedStyle(e).borderTopWidth) > 0).length), 4, 'cassé : quatre cadres')
  await hover(); assert.equal(await calcPx(p, `${app} .co-b`, 'borderTopWidth'), 0, 'survolé : les cadres retirés')
  /* écarts égaux */
  await wreck(p, 'tout cloisonné'); await wreck(p, 'écarts tous égaux'); await far()
  const blocks = await boxes(p, `${app} .co-app-body > .co-b`), lines = await boxes(p, `${app} .co-list .co-li`)
  const between = blocks[1].y - blocks[0].b, inside = lines[1].y - lines[0].b
  assert.ok(Math.abs(between - inside) < 1, `cassé : dedans (${inside}) et dehors (${between}) mesurent pareil`)
  await hover(); const r = await boxes(p, `${app} .co-app-body > .co-b`), l = await boxes(p, `${app} .co-list .co-li`)
  assert.ok(r[1].y - r[0].b > 2 * (l[1].y - l[0].b), 'survolé : dehors redevient bien plus large que dedans')
  /* quatre axes */
  await wreck(p, 'écarts tous égaux'); await wreck(p, 'quatre axes'); await far()
  assert.ok(new Set((await boxes(p, `${app} .co-app-body > .co-b`)).map((x) => Math.round(x.x))).size >= 3, 'cassé : plusieurs départs')
  await hover(); assert.equal(new Set((await boxes(p, `${app} .co-app-body > .co-b`)).map((x) => Math.round(x.x))).size, 1, 'survolé : un seul axe')
  /* la rupture partout */
  await wreck(p, 'quatre axes'); await wreck(p, 'la rupture partout'); await far()
  const primary = rgb(inks('light').primary)
  const accent = () => p.evaluate((c) => [...document.querySelectorAll('#broken .co-app *')].filter((e) => getComputedStyle(e).color === c || getComputedStyle(e).backgroundColor === c).length, primary)
  assert.ok(await accent() >= 5, 'cassé : l\'accent partout')
  await hover(); assert.ok(await accent() <= 2, 'survolé : l\'accent rendu à un seul élément')
  await wreck(p, 'la rupture partout'); assert.equal(await p.locator('#broken .co-verdict .badge.ko').count(), 0, 'réparé : plus de verdict rouge')
  await close()
})
test('3 · l’espace blanc retiré : mêmes mots, même corps, même surface — l’air seul a disparu ; l’encre montrée est celle mesurée ; le chemin de l’œil rend ses deux tracés', async () => {
  const { p, close } = await nav.page(URL(), { width: 1440 })
  const read = () => p.evaluate(() => { const a = document.querySelector('#blanc .co-mag'), r = a.getBoundingClientRect(), p = a.querySelector('.co-body-mag p')
    return { h: r.height, words: a.textContent.trim().split(/\s+/).length, fs: parseFloat(getComputedStyle(p).fontSize), door: document.querySelector('#blanc .co-door').getBoundingClientRect().height } })
  const before = await read()
  await p.locator('#blanc .button.broken').click(); await p.waitForTimeout(120)
  const after = await read()
  assert.equal(after.words, before.words, 'pas un mot retiré'); ok(after.fs, before.fs, 'même corps')
  assert.ok(after.h < before.h * 0.8, `l'article a perdu son air : ${after.h} < ${before.h}`)
  ok(after.door, before.door, 'la surface est gardée : la place de la page ne bouge pas', 1)
  assert.match(await text(p, '#blanc .rank .badge.ko'), /l'air a disparu/)
  await p.locator('#blanc .button.broken').click(); await p.waitForTimeout(120)
  await p.locator('#blanc .button', { hasText: 'encre' }).click(); await p.waitForTimeout(120)
  const tasks = await p.locator('#blanc .co-task').count(), lines = await p.evaluate(() => { const range = document.createRange(); let n = 0
    const walk = (e) => e.childNodes.forEach((c) => { if (c.nodeType === 3 && c.textContent.trim()) { range.selectNodeContents(c); n += [...range.getClientRects()].filter((r) => r.width > 0 && r.height > 0).length } else if (c.nodeType === 1) walk(c) })
    walk(document.querySelector('#blanc .co-mag')); return n })
  assert.equal(tasks, lines, 'une tache par ligne de texte rendue')
  assert.equal(await p.locator('#journey .co-pair > div').count(), 2, 'journal et affiche')
  assert.ok(await p.locator('#journey svg path').count() >= 2, 'deux tracés rendus')
  await close()
})
test('3 · les quatre paires : le fautif diffère du juste par une seule chose, mesurée — deux habits identiques, une légende qui change de camp, un cadre, trois départs', async () => {
  const { p, close } = await nav.page(URL(), { width: 1440 })
  for (let i = 1; i <= 4; i++) {
    assert.equal(await p.getAttribute(side(i, 1), 'data-intent'), null, `paire ${i} : le juste n'est pas une casse`)
    assert.equal(await p.getAttribute(side(i, 2), 'data-intent'), 'statement', `paire ${i} : le fautif est déclaré`)
    assert.match(await text(p, `${side(i, 1)} .cb-verdict`), /✓/); assert.match(await text(p, `${side(i, 2)} .cb-verdict`), /✗/)
  }
  /* 1 · un habit, un rôle : à gauche un badge et un bouton ; à droite deux boutons au même fond */
  const background = (sel) => calc(p, sel, 'backgroundColor')
  assert.notEqual(await background(`${side(1, 1)} .badge`), await background(`${side(1, 1)} .button`), 'juste : deux habits')
  assert.equal(await background(`${side(1, 2)} .button:first-child`), await background(`${side(1, 2)} .button:last-child`), 'fautif : le même habit')
  assert.equal(await p.locator(`${side(1, 2)} .button`).count(), 2)
  /* le texte est centré dans le bouton, toujours — quel que soit l'élément qui le porte (verdict d'Auteur, 7 septembre) */
  for (const k of [1, 2]) {
    const center = await p.evaluate((sel) => { const b = document.querySelector(sel), r = b.getBoundingClientRect(), g = document.createRange(); g.selectNodeContents(b); const t = g.getBoundingClientRect(); return Math.abs((t.top + t.bottom) / 2 - (r.top + r.bottom) / 2) }, `${side(1, k)} .button`)
    assert.ok(center < 1, `paire 1, côté ${k} : le texte est centré dans le bouton (${center} px)`)
  }
  /* 2 · le trait : une légende est plus près de sa photo que de la suivante ; cassée, l'inverse */
  const dist = async (k) => { const [p1, l1, p2] = await boxes(p, `${side(2, k)} .cb-photos > *`); return { own: l1.y - p1.b, next: p2.y - l1.b } }
  const j = await dist(1), f = await dist(2)
  assert.ok(j.own < j.next, `juste : la légende tient à sa photo (${j.own} < ${j.next})`)
  assert.ok(f.own > f.next, `fautif : la légende a rejoint la photo d'après (${f.own} > ${f.next})`)
  ok(await calcPx(p, `${side(2, 2)} .cb-caption`, 'borderTopWidth'), 2, 'fautif : le filet')
  ok(await calcPx(p, `${side(2, 1)} .cb-caption`, 'borderTopWidth'), 0, 'juste : pas de filet')
  /* 3 · le simple gagne : même carte, seul le cadre change */
  const cj = await p.evaluate((sel) => { const c = document.querySelector(sel), cs = getComputedStyle(c); return { edge: parseFloat(cs.borderTopWidth), style: cs.borderTopStyle, pad: cs.paddingTop, fs: getComputedStyle(c.querySelector('.cb-card-text')).fontSize, shadow: cs.boxShadow, background: cs.backgroundImage } }, `${side(3, 1)} .card`)
  const cf = await p.evaluate((sel) => { const c = document.querySelector(sel), cs = getComputedStyle(c); return { edge: parseFloat(cs.borderTopWidth), style: cs.borderTopStyle, pad: cs.paddingTop, fs: getComputedStyle(c.querySelector('.cb-card-text')).fontSize, shadow: cs.boxShadow, background: cs.backgroundImage } }, `${side(3, 2)} .card`)
  assert.equal(cj.edge, 1); assert.equal(cf.edge, 4); assert.equal(cf.style, 'double')
  assert.equal(cj.pad, cf.pad, 'même marge'); assert.equal(cj.fs, cf.fs, 'même corps'); assert.equal(cf.shadow, 'none', 'pas d\'ombre : une seule chose change'); assert.equal(cf.background, 'none')
  /* 4 · un bord commun : trois départs égaux ; cassés, trois départs différents */
  const begins = async (k) => (await boxes(p, `${side(4, k)} .cb-block`)).map((r) => Math.round(r.x))
  const dj = await begins(1), df = await begins(2)
  assert.equal(new Set(dj).size, 1, `juste : un bord (${dj})`); assert.equal(new Set(df).size, 3, `fautif : trois bords (${df})`)
  await close()
})

/* ── 4 · La densité règle les coques, jamais un corps ; les titres glissent ── */
test('4 · la scène suit la base de la densité ; le corps de la légende ne bouge pas ; l’affiche et les sections glissent avec l’écran', async () => {
  const W = 1440
  for (const density of ['compact', 'airy']) {
    const { p, close } = await nav.page(URL(), { width: W, density })
    ok(await calcPx(p, '#broken .co-scene', 'paddingTop'), expected('pad-1-block', W, DENSITIES[density]), `${density} — la scène suit la base`)
    ok(await calcPx(p, '#bands .cb-pair', 'columnGap'), expected('pad-1-inline', W, DENSITIES[density]), `${density} — la paire suit la base`)
    ok(await calcPx(p, '#broken .co-lex dt', 'fontSize'), expected('font-size-small', W), `${density} — la légende ne bouge pas`)
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

/* ── 5 · C17 ── */
test('5 · dans les deux thèmes, tout tertiaire rendu porte 600 au moins, au cran étiquette au moins, jamais un paragraphe lu', async () => {
  for (const theme of ['light', 'dark']) {
    const { p, close } = await nav.page(URL(), { width: 1440, theme })
    const f = await faultsC17(p, theme, 1440)
    assert.deepEqual(f, [], `${theme} : ${f.length} faute(s)`)
    const howmany = await p.evaluate((t) => [...document.querySelectorAll('main *')].filter((e) => getComputedStyle(e).color === t).length, rgb(inks(theme)['text-tertiary']))
    assert.ok(howmany >= 6, `${theme} : ${howmany} emplois du tertiaire`)
    await close()
  }
})

/* ── 6 · Rien en dur, hors des lignes qui le disent ; zéro débord ; zéro erreur ; quinze lois ── */
test('6 · marges, espaces, coins, tailles : chaque valeur calculée est une valeur du moteur — sauf les réductions déclarées (les objets imités) et les casses ; zéro débord ; zéro erreur', async () => {
  const css = CSS(), g = GLOBAL()
  const exclusions = ['padding', 'gap', 'border-radius', 'margin'].flatMap((prop) => [...selectorsDeclaredAll(css, prop), ...selectorsDeclaredAll(g, prop), ...selectorsInEm(css, prop), ...selectorsInEm(g, prop)])
  /* les objets imités (l'interface, le journal, l'affiche, le magazine) sont des réductions déclarées : tout ce qu'ils contiennent est à leur échelle */
  const reductions = ['.co-app', '.co-app *', '.co-press', '.co-press *', '.co-display', '.co-display *', '.co-mag', '.co-mag *', '.co-overlay *', '.co-hairlines *', '.co-lex-foot']
  const sizes = ['svg *', ...reductions, ...selectorsDeclaredAll(css, 'font-size'), ...selectorsDeclaredAll(g, 'font-size'), ...selectorsInEm(css), ...selectorsInEm(g)]
  for (const W of WIDTHS) {
    const { p, close, errors } = await nav.page(URL(), { width: W })
    for (const d of await p.locator('main details.prov summary').all()) await d.click()
    const f = await faultsInHard(p, W, DENSITIES.comfortable, { exclusions: [...exclusions, ...reductions] })
    assert.deepEqual(f, [], `${W} px : ${f.length} valeur(s) hors moteur`)
    const t = await faultsSizes(p, W, { exclusions: sizes })
    assert.deepEqual(t, [], `${W} px : ${t.length} taille(s) hors moteur`)
    assert.deepEqual(errors, [], 'la page ne jette aucune erreur')
    assert.equal(await overflow(p), 0, `${W} px : la page déborde de l'écran`)
    await close()
  }
})
test('6 · les quinze lois sont toutes là, une seule fois : cinq sur l’écran, une par preuve 02 et 03, quatre en bandes, quatre en liste', async () => {
  const view = VIEW()
  assert.equal((view.match(/key: "f-/g) ?? []).length, 5, 'cinq fautes sur l\'écran')
  const { p, close } = await nav.page(URL(), { width: 1440 })
  assert.equal(await p.locator('#bands .doc-band').count(), 4, 'quatre bandes')
  assert.equal(await p.locator('#list .doc-list tbody tr').count(), 4, 'quatre lois en liste')
  assert.deepEqual(await texts(p, '#list .doc-list .l-name'), ['Hiérarchie par combinaison', 'Mesure de lecture', 'Dedans plus serré que dehors', 'Rôles d\'espace nommés'])
  assert.equal(await p.locator('#journey').count() + await p.locator('#blanc').count(), 2, 'le chemin de l\'œil et l\'espace blanc')
  assert.equal(await p.locator('#backgrounds').count(), 0, 'la table des quinze lois a disparu')
  await close()
})

/* ── 8 · L'écriture et le répertoire (8 septembre 2026, soir) ──
   La queue commune a disparu ; UN répertoire (#registre) range les quatre
   paires (#bandes, en h4, leurs textes réécrits : la loi en titre, la seule
   chose qui change en cote, ce que l'œil fait de chaque côté), la liste
   (#liste) et l'écran écrit proprement (#adaptation). */
test('8 · l’écriture : aucun mot qui commande ou décrit, pas d’histoire de page, pas de pied, un seul répertoire au titre de la page, aucun saut de niveau ; quatre paires en h4 dont la cote nomme la seule chose qui change ; trois pièces', async () => {
  const { p, close } = await nav.page(URL(), { width: 1440 })
  assert.deepEqual(await faultsWriting(p), [])
  assert.equal(await p.locator('main .gdoc-sec').count(), 4, 'trois preuves et un répertoire')
  assert.equal(await p.locator('#registry #bands h4.doc-band-name').count(), 4, 'quatre paires, en h4 sous leur sous-titre')
  for (const c of await texts(p, '#registry #bands .doc-band-side')) assert.match(c, /^une seule chose change : /, `la cote nomme la seule chose qui change : « ${c} »`)
  assert.equal(await p.locator('#registry .doc-piece-head h3').count(), 3, 'trois pièces')
  const frames = await texts(p, '#registry #adaptation .button'); for (const f of ['HTML', 'React', 'Angular']) assert.ok(frames.includes(f), `l'écran s'écrit en ${f}`)
  await close()
})
