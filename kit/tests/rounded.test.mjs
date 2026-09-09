/* LE CRASH-TEST DE LA PAGE ARRONDIS — kit/tests/rounded.test.mjs
   Ce qui doit être vrai à l'écran, mesuré sans l'œil (plan validé par
   l'Auteur le 26 août 2026) :
   1 · chaque chiffre affiché sort du moteur (légendes, table des intentions) ;
   2 · chaque preuve est rendue par son propre cran (la fiche Navette, le labo du coin, la pilule, les vignettes) ;
   3 · la racine sous les yeux : un nombre tourne, toute la chaîne suit, les invariants tiennent ;
   4 · les coins ne suivent ni l'écran ni la densité ; les titres glissent ;
   5 · le tertiaire suit C17 ;
   6 · rien en dur — marges, espaces, coins, tailles, couleurs écrites, hors des lignes qui le disent.

   Remise à niveau du 1er septembre 2026 : la planche de la pilule a changé le
   31 août — le bouton en pilule n'est plus un recalé (dix systèmes lus), il est
   devenu une PAIRE qui met en garde. L'épreuve ne compte plus deux recalés :
   elle mesure que les deux boutons de la paire sont le même objet à un fond
   près, ce qui est plus exigeant que l'ancien comptage.                    */
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { chain, INTENTS, CHARTER, BOUNDS, DENSITIES, OFF_CHAIN } from '../derivation.mjs'
import { KIT, WIDTHS, TOL, openSite, openBrowser, expected, near, numbers, calcPx, calc, text, texts, faultsC17, faultsInHard, faultsSizes, selectorsDeclaredAll, selectorsInEm, linesAlongSelector, overflow, rgb, inks , faultsWriting } from './bench.mjs'

const ok = (a, b, msg, tol = TOL) => assert.ok(a !== null && near(a, b, tol), `${msg} : ${a} attendu ${b}`)
const list = (a, b, msg, tol = 0.051) => { assert.equal(a.length, b.length, `${msg} : ${a.length} nombres, ${b.length} attendus (${a} / ${b})`); a.forEach((v, i) => ok(v, b[i], `${msg} [${i}]`, tol)) }
const rounded = (v) => Math.round(v * 10) / 10
const ROOTS = [CHARTER.root, 0, 24, BOUNDS.root[1]]
/* hors chaîne, dits dans la vue : la valeur écrite à la main du piège 1, et le coin qui sature du piège 5 */
const OFF_CHAIN_HARD = 10, CORNER_SAT = 24
const CSS = () => fs.readFileSync(path.join(KIT, 'app/arrondis/rounded.css'), 'utf8')

let site, nav
before(async () => { site = await openSite(); nav = await openBrowser() })
after(async () => { await nav?.close(); site?.close() })
const URL = () => site.url + '/arrondis'
const adjust = async (p, id, v) => { await p.locator(`#${id}`).fill(String(v)); await p.waitForFunction(([id, v]) => document.querySelector(`output[for="${id}"]`).textContent === String(v), [id, v]) }

/* ── 1 · Chaque chiffre affiché sort du moteur ── */
/* Remise à niveau du 7 septembre 2026 : le répertoire des six intentions a quitté la page
   (verdict d'Auteur, 2 septembre — il réglait la même chose que les densités de /rythme, et
   le sujet appartient au moteur). À sa place, l'étage des bandes montre six pièges, le juste
   et le faux côte à côte, et c'est un CURSEUR qui révèle la faute. L'épreuve mesure donc ce
   mouvement-là : la racine tourne, l'objet juste suit le moteur, le faux reste à sa valeur
   écrite ; la hauteur descend, et le coin sature sous les yeux — verdict lu, pas décrété. */
test('1 · la légende de la fiche Navette suit la racine du curseur, chiffre par chiffre ; la légende du coin dit √2 ; dans les pièges, le juste dit le cran du moteur et le faux sa valeur écrite', async () => {
  const { p, close } = await nav.page(URL())
  for (const root of ROOTS) {
    await adjust(p, 'ar-root', root)
    const s = chain({ root })
    const readSet = numbers(await text(p, '#depth .demo-caption'))
    list(readSet, [s.r[0], s.pad[0], s.r[1], s.pad[1], s.r[2], s.pad[2], s.r[3], s.rCtl, 4, s.gap[0], s.gap[1], s.gap[2]].map(rounded), `racine ${root}`)
  }
  for (const [ri, e] of [[12, 12], [4, 0], [36, 24]]) {
    await adjust(p, 'ar-ri', ri); await adjust(p, 'ar-gap', e)
    const readSet = numbers(await text(p, '#corner .demo-caption'))
    const expectedAll = e > 0 ? [ri, e, ri, rounded(e * Math.SQRT2), Math.round((Math.SQRT2 - 1) * 100), ri + e, e] : [ri, e, ri, 0, ri + e, e]
    list(readSet, expectedAll, `coin ${ri} · écart ${e}`)
  }
  /* le piège de la valeur en dur : la racine tourne, le juste dit le cran de la card, le faux dit toujours son nombre */
  const band = (i) => `#wreck .doc-band:nth-child(${i})`
  for (const root of ROOTS) {
    await adjust(p, 'ar-p-hard', root)
    const said = await texts(p, `${band(1)} .demo-verdict`) /* le faux à gauche, le juste à droite */
    list(numbers(said[1]), [rounded(chain({ root }).r[1])], `piège 1, racine ${root} — le juste dit le cran de la card`)
    list(numbers(said[0]), [OFF_CHAIN_HARD], `piège 1, racine ${root} — le faux dit sa valeur écrite`)
  }
  /* le coin saturé : la hauteur descend, et le verdict bascule exactement à la moitié — lu sur la scène */
  for (const h of [72, 56, 48, 46, 40, 20]) {
    await adjust(p, 'ar-p-sat', h)
    const said = await texts(p, `${band(5)} .demo-verdict`); list(numbers(said[0]), [CORNER_SAT, h], `piège 5, hauteur ${h} — le faux dit son coin et sa hauteur`)
    /* le verdict du côté gauche se lit sur la scène : fautif seulement au-delà de la moitié */
    const left = await p.evaluate((b) => document.querySelector(`${b} .demo-side`).className, band(5))
    assert.equal(left.includes('bad'), CORNER_SAT > h / 2, `piège 5, hauteur ${h} — le verdict suit la moitié de la hauteur`)
  }
  await close()
})

/* ── 2 · Chaque preuve est rendue par son propre cran ── */
test('2 · la fiche Navette : panneau, carte, ligne, marque, boutons — coin ÷ 2 par profondeur, marge et espace de profondeur, aux quatre racines', async () => {
  const { p, close } = await nav.page(URL())
  for (const root of ROOTS) {
    await adjust(p, 'ar-root', root)
    await p.waitForTimeout(250) /* la fiche anime ses coins (0,2 s) ; le banc les lit au repos */
    const s = chain({ root }), n = `racine ${root}`
    ok(await calcPx(p, '#depth .ar-panel', 'borderTopLeftRadius'), s.r[0], `${n} — panneau coin`); ok(await calcPx(p, '#depth .ar-panel', 'paddingTop'), s.pad[0], `${n} — panneau marge`); ok(await calcPx(p, '#depth .ar-panel', 'rowGap'), s.gap[0], `${n} — panneau espace`)
    ok(await calcPx(p, '#depth .ar-card', 'borderTopLeftRadius'), s.r[1], `${n} — carte coin`); ok(await calcPx(p, '#depth .ar-card', 'paddingTop'), s.pad[1], `${n} — carte marge`); ok(await calcPx(p, '#depth .ar-card', 'rowGap'), s.gap[1], `${n} — carte espace`)
    ok(await calcPx(p, '#depth .ar-line', 'borderTopLeftRadius'), s.r[2], `${n} — ligne coin`); ok(await calcPx(p, '#depth .ar-line', 'paddingTop'), s.pad[2], `${n} — ligne marge`); ok(await calcPx(p, '#depth .ar-line', 'columnGap'), s.gap[2], `${n} — ligne espace`)
    ok(await calcPx(p, '#depth .ar-brand', 'borderTopLeftRadius'), s.r[3], `${n} — marque coin`)
    ok(await calcPx(p, '#depth .ar-btn', 'borderTopLeftRadius'), s.rCtl, `${n} — bouton = racine ÷ 4`); ok(await calcPx(p, '#depth .ar-btn', 'paddingTop'), s.pad[2], `${n} — bouton marge de ligne`); ok(await calcPx(p, '#depth .ar-actions', 'columnGap'), s.gap[1], `${n} — entre les boutons`)
    ok(await calcPx(p, '#depth .ar-btn', 'minHeight'), expected('control-height', 1440), `${n} — la cible au doigt`)
    /* les invariants, mesurés : aucun enfant plus rond que son parent ; aucune marge sous son coin */
    const r = await p.evaluate(() => ['.ar-panel', '.ar-card', '.ar-line', '.ar-brand'].map((s) => parseFloat(getComputedStyle(document.querySelector(`#depth ${s}`)).borderTopLeftRadius)))
    const m = await p.evaluate(() => ['.ar-panel', '.ar-card', '.ar-line'].map((s) => parseFloat(getComputedStyle(document.querySelector(`#depth ${s}`)).paddingTop)))
    for (let k = 1; k < 4; k++) assert.ok(r[k] <= r[k - 1] + TOL, `${n} — l'enfant ${k} est plus rond que son parent (${r})`)
    for (let k = 0; k < 3; k++) assert.ok(m[k] >= r[k] - TOL, `${n} — la marge ${k} descend sous le coin (${m} / ${r})`)
    if (root === BOUNDS.root[1]) { ok(m[0], root, `${n} — la marge du panneau relevée au coin`); ok(m[1], root / 2, `${n} — la marge de la carte relevée au coin`) }
  }
  await close()
})
test('2 · le labo du coin dessine ce qu’il dit : à gauche le même rayon, à droite le rayon intérieur plus l’écart ; la pilule est une liste fermée de quatre, ses deux recalés sont dits', async () => {
  const { p, close } = await nav.page(URL())
  for (const [ri, e] of [[12, 12], [8, 20], [36, 0]]) {
    await adjust(p, 'ar-ri', ri); await adjust(p, 'ar-gap', e)
    const k = 3.2 /* hors chaîne, dit dans la vue : une unité du dessin = 3,2 */
    const rx = await p.evaluate(() => [...document.querySelectorAll('#corner .demo-side svg')].map((svg) => [...svg.querySelectorAll('rect')].slice(1).map((r) => parseFloat(r.getAttribute('rx')))))
    assert.deepEqual(rx, [[ri * k, ri * k], [(ri + e) * k, ri * k]], `coin ${ri} · écart ${e} — les rayons dessinés`)
    const verdicts = await texts(p, '#corner .demo-verdict > span:first-child')
    assert.deepEqual(verdicts, ['✗', '✓'])
  }
  /* La planche compte six cas : QUATRE membres de la pilule, UNE mise en garde et UN
     seul recalé. Depuis le 31 août (dix systèmes lus), le bouton en pilule n'est plus
     un recalé : Material 3 en fait la forme par défaut de ses boutons, Apple recommande
     la capsule. Ce que la planche montre à sa place est plus fin, et plus dur à tenir :
     le MÊME mot, deux fois, et une seule chose qui change — le fond. L'épreuve mesure
     donc que les deux boutons sont géométriquement identiques et ne diffèrent que par
     leur remplissage, et que la mise en garde est bien une mise en garde (⚠), pas un
     refus (✗) : sinon la démonstration accuserait la forme au lieu du fond. */
  const members = await p.evaluate(() => [...document.querySelectorAll('#pill .ar-member')].map((m) => ({
    name: m.querySelector('.name').textContent, intent: m.dataset.intent ?? null, refused: m.classList.contains('refused'),
    object: m.querySelector('.object > *') ? getComputedStyle(m.querySelector('.object > *')).borderTopLeftRadius : null,
  })))
  assert.equal(members.length, 6, 'quatre membres, une mise en garde, un recalé')
  assert.deepEqual(members.map((m) => m.intent), [null, null, null, null, null, 'statement'], 'un seul cas déclaré fautif : la gélule')
  assert.deepEqual(members.map((m) => m.refused), [false, false, false, false, false, true], 'un seul cas refusé')
  /* les quatre membres portent le rayon plein — c'est ce qui en fait des membres */
  for (const m of members.slice(0, 4)) assert.ok(parseFloat(m.object) >= 9999 || /^50%/.test(m.object), `${m.name} : ${m.object}`)
  assert.equal(await p.evaluate(() => parseFloat(getComputedStyle(document.querySelector('#pill .ar-dot')).borderTopLeftRadius)), OFF_CHAIN.pill)
  /* la paire du bouton : deux fois le même objet, seul le fond change */
  const pair = await p.evaluate(() => [...document.querySelectorAll('#pill .ar-member.pair .ar-btn-pill')].map((b) => {
    const cs = getComputedStyle(b)
    return { r: parseFloat(cs.borderTopLeftRadius), h: cs.minHeight, pb: cs.paddingTop, pi: cs.paddingLeft, f: cs.fontSize, background: cs.backgroundColor, ink: cs.color,
      sign: b.closest('.ar-trial').querySelector('.verdict').className }
  }))
  assert.equal(pair.length, 2, 'deux fois le même mot')
  assert.deepEqual(pair.map((b) => b.r), [OFF_CHAIN.pill, OFF_CHAIN.pill], 'les deux sont en pilule — la forme n’est pas la faute')
  for (const key of ['h', 'pb', 'pi', 'f']) assert.equal(pair[0][key], pair[1][key], `la paire ne diffère pas par « ${key} » : ${pair[0][key]} / ${pair[1][key]}`)
  assert.notEqual(pair[0].background, pair[1].background, 'la seule chose qui change est le fond')
  assert.deepEqual(pair.map((b) => b.sign), ['verdict attention', 'verdict good'], 'le doux est une mise en garde (⚠), le plein est juste (✓) — jamais un refus')
  /* le seul recalé : la pilule sur un contenu qui passe à la ligne */
  assert.equal(await p.evaluate(() => parseFloat(getComputedStyle(document.querySelector('#pill .ar-capsule')).borderTopLeftRadius)), OFF_CHAIN.pill)
  assert.ok(await p.evaluate(() => { const g = document.querySelector('#pill .ar-capsule'); return g.getBoundingClientRect().height > 2 * parseFloat(getComputedStyle(g).fontSize) }), 'la gélule passe à la ligne')
  /* l'interrupteur et les onglets vivent, au clavier comme au pointeur */
  await p.locator('#pill .ar-inter').click(); assert.equal(await p.getAttribute('#pill .ar-inter', 'aria-checked'), 'false')
  await p.locator('#pill .ar-tabs button').nth(1).click(); assert.equal(await p.getAttribute('#pill .ar-tabs button >> nth=1', 'aria-selected'), 'true')
  /* les pièges sont RENDUS par ce qu'ils disent : à chaque racine, l'objet juste porte le cran de
     la card et le faux sa valeur écrite (déclarée : data-intent) ; le coin saturé porte son coin
     fixe quand la boîte descend, et le juste le cran du composant */
  const band = (i) => `#wreck .doc-band:nth-child(${i})`
  for (const root of ROOTS) {
    await adjust(p, 'ar-p-hard', root)
    const r = await p.evaluate((b) => [...document.querySelectorAll(`${b} .ar-obj-box`)].map((e) => parseFloat(getComputedStyle(e).borderTopLeftRadius)), band(1))
    list(r, [OFF_CHAIN_HARD, chain({ root }).r[1]], `piège 1, racine ${root} — les deux coins rendus (le faux à gauche)`, TOL)
    assert.equal(await p.getAttribute(`${band(1)} .demo-side.bad`, 'data-intent'), 'statement', 'le faux est déclaré')
  }
  for (const h of [72, 40]) {
    await adjust(p, 'ar-p-sat', h)
    const v = await p.evaluate((b) => [...document.querySelectorAll(`${b} .ar-obj-box`)].map((e) => { const cs = getComputedStyle(e); return [parseFloat(cs.borderTopLeftRadius), parseFloat(cs.height)] }), band(5))
    list(v[1], [chain().rCtl, h], `piège 5, hauteur ${h} — le juste : le cran du composant`, TOL); list(v[0], [CORNER_SAT, h], `piège 5, hauteur ${h} — le faux : son coin fixe`, TOL)
  }
  /* les voisins dépareillés : dans la même rangée, le juste met le cran du composant sur le champ ET le bouton */
  const rows = await p.evaluate((b) => [...document.querySelectorAll(`${b} .ar-row`)].map((r) => [...r.children].map((e) => parseFloat(getComputedStyle(e).borderTopLeftRadius))), band(3))
  assert.equal(rows[1][0], rows[1][1], 'juste : le même cran pour les deux'); assert.notEqual(rows[0][0], rows[0][1], 'faux : deux crans dans la même rangée')
  await close()
})
test('2 · la feuille de la page consomme, pour chaque preuve, la variable ou le token qu’elle nomme, et dit ses casses', () => {
  const css = CSS()
  const block = (sel) => { const i = css.indexOf(`\n${sel} {`); assert.ok(i >= 0, `sélecteur absent : ${sel}`); return css.slice(i, css.indexOf('}', i)) }
  const waits = (sel, decl) => assert.ok(block(sel).includes(decl), `${sel} : « ${decl} » attendu`)
  waits('.ar-panel', 'border-radius: var(--ar-r1) var(--ar-r1) 0 0'); waits('.ar-panel', 'padding: var(--ar-p1)'); waits('.ar-panel', 'gap: var(--ar-g1)')
  waits('.ar-card', 'border-radius: var(--ar-r2)'); waits('.ar-card', 'padding: var(--ar-p2)'); waits('.ar-card', 'gap: var(--ar-g2)')
  waits('.ar-line', 'border-radius: var(--ar-r3)'); waits('.ar-line', 'padding: var(--ar-p3)'); waits('.ar-line', 'gap: var(--ar-g3)')
  waits('.ar-btn', 'border-radius: var(--ar-rctl)'); waits('.ar-btn', 'min-height: var(--control-height)')
  for (const sel of ['.ar-dot', '.ar-avatar', '.ar-inter', '.ar-tabs']) waits(sel, 'border-radius: var(--r-pill)')
  /* Le bouton en pilule n'est plus une casse depuis le 31 août : sa règle ne pose que
     des tokens du kit, elle n'a donc rien à déclarer — et écrire « casse » sur cette
     ligne serait une déclaration fausse. Ce qu'on exige à la place : que la règle du
     bouton soit entièrement faite de tokens (la forme est permise), que la seule chose
     qui distingue le bouton doux soit son fond, et que la gélule — le seul vrai recalé
     — garde ses deux lignes dites. */
  for (const decl of ['min-height: var(--control-height)', 'padding: var(--pad-3-block) var(--pad-3-inline)', 'border-radius: var(--r-pill)']) waits('.ar-btn-pill', decl)
  assert.equal(block('.ar-btn-pill.soft').replace(/^[^{]*\{/, '').trim().replace(/;\s*$/, '').split(';').map((d) => d.split(':')[0].trim()).sort().join(' '), 'background color',
    'le bouton doux ne se distingue que par son remplissage')
  assert.doesNotMatch(block('.ar-btn-pill'), /casse|broken/, '.ar-btn-pill : la forme est permise, rien à déclarer')
  assert.match(block('.ar-capsule'), /casse|broken/, '.ar-capsule : casse dite')
})

/* ── 3 · La racine sous les yeux ── */
test('3 · à racine 0 tout est carré et le bouton aussi ; à 38 la chaîne est 38 · 19 · 9,5 · 4,75 et la marge suit ; le curseur ne dépasse jamais la borne', async () => {
  const { p, close } = await nav.page(URL())
  assert.equal(await p.getAttribute('#ar-root', 'max'), String(BOUNDS.root[1])); assert.equal(await p.getAttribute('#ar-root', 'min'), '0')
  assert.equal(await p.inputValue('#ar-root'), String(CHARTER.root), 'la charte au départ')
  await adjust(p, 'ar-root', 0); await p.waitForTimeout(250)
  for (const s of ['.ar-panel', '.ar-card', '.ar-line', '.ar-brand', '.ar-btn']) ok(await calcPx(p, `#depth ${s}`, 'borderTopLeftRadius'), 0, `racine 0 — ${s}`)
  await adjust(p, 'ar-root', 38); await p.waitForTimeout(250)
  list(await p.evaluate(() => ['.ar-panel', '.ar-card', '.ar-line', '.ar-brand'].map((s) => parseFloat(getComputedStyle(document.querySelector(`#depth ${s}`)).borderTopLeftRadius))), [38, 19, 9.5, 4.75], 'racine 38', TOL)
  ok(await calcPx(p, '#depth .ar-panel', 'paddingTop'), 38, 'la marge du panneau monte avec la racine')
  await close()
})

/* ── 4 · Ni l'écran ni la densité ; les titres glissent ── */
test('4 · les coins de la fiche ne bougent ni avec la largeur ni avec la densité ; la scène, elle, suit la base ; l’affiche et les sections glissent', async () => {
  const display = []
  for (const W of WIDTHS) for (const density of ['comfortable', 'compact']) {
    const { p, close } = await nav.page(URL(), { width: W, density })
    const s = chain()
    list(await p.evaluate(() => ['.ar-panel', '.ar-card', '.ar-line', '.ar-brand', '.ar-btn'].map((x) => parseFloat(getComputedStyle(document.querySelector(`#depth ${x}`)).borderTopLeftRadius))), [...s.r, s.rCtl], `${W} ${density} — coins fixes`, TOL)
    ok(await calcPx(p, '#depth .ar-panel', 'paddingTop'), s.pad[0], `${W} ${density} — la fiche vit sur la charte, pas sur le réglage du site`)
    ok(await calcPx(p, '#depth .demo-stage', 'paddingTop'), expected('pad-2-block', W, DENSITIES[density]), `${W} ${density} — la scène suit la base`)
    if (density === 'comfortable') { const h1 = await calcPx(p, '.gdoc-hero h1', 'fontSize'); ok(h1, expected('doc-cover', W), `${W} — affiche`); ok(await calcPx(p, '.gdoc-sec h2', 'fontSize'), expected('doc-section', W), `${W} — section`); display.push(h1) }
    await close()
  }
  assert.ok(display[0] < display[1] && display[1] < display[2], `l'affiche glisse : ${display}`)
})

/* ── 5 · C17 ── */
test('5 · dans les deux thèmes, tout tertiaire rendu porte 600 au moins, au cran étiquette au moins, jamais un paragraphe lu', async () => {
  for (const theme of ['light', 'dark']) {
    const { p, close } = await nav.page(URL(), { width: 1440, theme })
    const f = await faultsC17(p, theme, 1440)
    assert.deepEqual(f, [], `${theme} : ${f.length} faute(s)`)
    const howmany = await p.evaluate((t) => [...document.querySelectorAll('main *')].filter((e) => getComputedStyle(e).color === t).length, rgb(inks(theme)['text-tertiary']))
    assert.ok(howmany >= 10, `${theme} : ${howmany} emplois du tertiaire`)
    await close()
  }
})

/* ── 6 · Rien en dur ── */
test('6 · marges, espaces, coins, tailles : chaque valeur calculée est une valeur du moteur, hors des lignes qui disent « hors chaîne » ou « casse » ; zéro débord ; zéro erreur', async () => {
  const css = CSS(), global = fs.readFileSync(path.join(KIT, 'app/globals.css'), 'utf8')
  const exclusions = ['padding', 'gap', 'border-radius', 'margin'].flatMap((prop) => [...selectorsDeclaredAll(css, prop), ...selectorsInEm(css, prop), ...selectorsInEm(global, prop)])
  /* le dessin du labo (svg) parle en unités de viewBox, dites hors chaîne dans la vue */
  const sizes = ['svg *', ...selectorsDeclaredAll(css, 'font-size'), ...selectorsDeclaredAll(global, 'font-size'), ...selectorsInEm(css), ...selectorsInEm(global)]
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
test('6 · dans la feuille, chaque couleur écrite en dur est dite — sur sa ligne, ou dans l’en-tête du bloc de scène qui la porte (la fiche Navette est un décor, hors chaîne)', () => {
  const css = CSS()
  const faults = []
  let header = '', insideHeader = false
  css.split('\n').forEach((l, i) => {
    if (/^\/\* ── /.test(l)) { header = l; insideHeader = !/\*\//.test(l); return }
    if (insideHeader) { header += l; insideHeader = !/\*\//.test(l); return }
    if (!/#[0-9A-Fa-f]{3,6}\b|rgba?\(/.test(l) || /^\s*(\/\*|\*)/.test(l)) return
    if (/hors chaîne|casse|broken|décor|verdict/.test(l) || /hors chaîne|décor/.test(header)) return
    faults.push(`arrondis.css:${i + 1} ${l.trim().slice(0, 80)}`)
  })
  assert.deepEqual(faults, [])
})

/* ── 8 · L'écriture et le répertoire (8 septembre 2026, soir) ──
   La queue commune a disparu ; UN répertoire (#registre) range les six coins
   (#code), les six pièges (#casser, en h4) et la liste (#invisibles) ; les
   deux paragraphes d'histoire de page sont sortis. */
test('8 · l’écriture : aucun mot qui commande ou décrit, pas d’histoire de page, pas de pied, un seul répertoire au titre de la page, aucun saut de niveau ; six pièges en h4, trois pièces', async () => {
  const { p, close } = await nav.page(URL(), { width: 1440 })
  assert.deepEqual(await faultsWriting(p), [])
  assert.equal(await p.locator('main .gdoc-sec').count(), 5, 'trois preuves, un répertoire, le code')
  assert.equal(await p.locator('#registry #wreck h4.doc-band-name').count(), 6, 'six pièges, en h4 sous leur sous-titre')
  assert.equal(await p.locator('#registry .doc-piece-head h3').count(), 2, 'deux pièces')
  assert.ok(await p.locator('#code .doc-code tbody tr').count() >= 6, 'les six coins')
  await close()
})
