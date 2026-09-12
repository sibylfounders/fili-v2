/* LE CRASH-TEST DE LA PAGE ADAPTATION — kit/tests/adaptive.test.mjs
   Versée le 9 septembre 2026 depuis le témoin de la doctrine du jour. Ce qui
   doit être vrai à l'écran, mesuré sans l'œil :
   1 · le seuil : sous la somme (liste + gouttière + fiche), la liste n'existe
       pas et la zone fantôme dit ce qui manque ; au-dessus, elle est là et la
       fiche n'a pas bougé d'un pixel ;
   2 · la hauteur : au-dessus du plancher, une feuille sur un voile ; en
       dessous, une page pleine — et le verdict le lit ;
   3 · les segments : ouvert, deux zones ; fermé, une ; « ignorer le pli » est
       une casse déclarée, qui se retourne ;
   4 · les plans : entrouvert, la frontière est médiane et chaque plan a le
       format fermé ; à plat en portrait, elle est décentrée et le clavier se
       scinde ; « ignorer la frontière » est une casse déclarée ;
   5 · les tokens, C17, rien en dur (hors l'appareil en trois dimensions, objet
       imité déclaré), zéro débord, zéro erreur ; l'écriture d'Auteur ; la page
       est un principe dans le menu ; huit sections, six preuves, huit lignes
       en liste, dix lignes de code lues au moteur ; cinq pièces.

   Ce que cette épreuve NE juge PAS, et dit : si la doctrine est juste. Aucune
   règle de cette page n'est acquise (⚪) ; l'épreuve vérifie seulement que la
   page joue bien ce qu'elle annonce. */
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { DENSITIES, ADAPTATION } from '../derivation.mjs'
import { KIT, WIDTHS, openSite, openBrowser, calc, text, texts, faultsC17, faultsInHard, faultsSizes, selectorsDeclaredAll, selectorsInEm, overflow, faultsWriting } from './bench.mjs'

const CSS = () => fs.readFileSync(path.join(KIT, 'app/adaptation/adaptive.css'), 'utf8')
const GLOBAL = () => ['app/kit.css', 'app/app.css', 'app/demo.css'].map((x) => fs.readFileSync(path.join(KIT, x), 'utf8')).join('\n')
const REM = 16
const TWO = ADAPTATION.threshold(ADAPTATION.work.list.rem, ADAPTATION.work.sheet.rem)

let site, nav
before(async () => { site = await openSite(); nav = await openBrowser() })
after(async () => { await nav?.close(); site?.close() })
const URL = () => site.url + '/adaptation'
const box = (p, sel) => p.$eval(sel, (e) => { const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height } })
const shown = (p, sel) => p.$eval(sel, (e) => getComputedStyle(e).display !== 'none')
/* la poignée du banc, au clavier : Origine (le plus étroit), Fin (la largeur de départ), puis des pas */
async function setWidth(p, section, px) {
  const handle = p.locator(`${section} .handle[aria-orientation="vertical"]`)
  await handle.focus()
  await p.keyboard.press('Home')
  let now = 320
  while (now + 16 <= px) { await p.keyboard.press('ArrowRight'); now += 16 }
  await p.waitForTimeout(80)
}

test('1 · le seuil : sous la somme, la liste n\'existe pas et le fantôme dit ce qui manque ; au-dessus, elle est là à sa largeur de travail et la place gagnée va à la fiche', async () => {
  const { p, close } = await nav.page(URL(), { width: 1440 })
  await p.locator('#threshold').scrollIntoViewIfNeeded(); await p.waitForTimeout(150)
  await setWidth(p, '#threshold', 560)
  assert.equal(await shown(p, '#threshold .ad-two .ad-list'), false, 'à 560 px, pas de liste')
  assert.match(await text(p, '#threshold .ad-ghost .m'), /^manque \d+,?\d* rem$/, 'le fantôme dit le manque')
  assert.match(await text(p, '#threshold .demo-caption'), /une zone/, 'la légende lit une zone')
  await setWidth(p, '#threshold', Math.ceil(TWO * REM) + 32)
  assert.equal(await shown(p, '#threshold .ad-two .ad-list'), true, 'au-dessus de la somme, la liste existe')
  const list = await box(p, '#threshold .ad-two .ad-list'), sheet = await box(p, '#threshold .ad-two .ad-sheet')
  assert.ok(list.w >= 17 * REM - 1 && list.w <= 20 * REM + 1, `la liste tient sa largeur de travail (${list.w} px)`)
  assert.ok(sheet.w >= 26 * REM - 1, `la fiche ne descend pas sous 26 rem (${sheet.w} px)`)
  await setWidth(p, '#threshold', 1000)
  const wide = await box(p, '#threshold .ad-two .ad-sheet'), listWide = await box(p, '#threshold .ad-two .ad-list')
  assert.ok(wide.w > sheet.w + 40 && listWide.w <= 20 * REM + 1, `la place gagnée va à la fiche (${sheet.w} → ${wide.w}), pas à la liste (${listWide.w})`)
  assert.match(await text(p, '#threshold .demo-caption'), /deux zones/, 'la légende lit deux zones')
  assert.match(await text(p, '#threshold .demo-caption'), new RegExp(`= ${String(TWO).replace('.', ',')} rem`), 'la somme est lue au moteur')
  await close()
})

test('2 · la hauteur : feuille au-dessus du plancher, page pleine en dessous — un bouton écrase la fenêtre, le verdict le lit', async () => {
  const { p, close } = await nav.page(URL(), { width: 1440 })
  await p.locator('#height').scrollIntoViewIfNeeded(); await p.waitForTimeout(150)
  assert.equal(await shown(p, '#height .ad-veil'), true, 'à 560 px de haut, le voile est là : une feuille')
  assert.match(await text(p, '#height .demo-verdict'), /Feuille/)
  assert.equal(await p.locator('#height .ad-handle-h').count(), 0, 'pas de poignée : un bouton')
  await p.locator('#height .demo-go').click(); await p.waitForTimeout(500)
  assert.equal(await shown(p, '#height .ad-veil'), false, 'écrasée à 300 px, plus de voile : une page pleine')
  assert.match(await text(p, '#height .demo-verdict'), /Page pleine/)
  assert.equal(await p.getAttribute('#height .demo-go', 'aria-pressed'), 'true', 'l\'action se retourne')
  await p.locator('#height .demo-go').click(); await p.waitForTimeout(500)
  assert.equal(await shown(p, '#height .ad-veil'), true, 'rétablie : la feuille revient')
  assert.match(await text(p, '#height .demo-caption'), new RegExp(`plancher ${ADAPTATION.floorHeight} rem`), 'le plancher est lu au moteur')
  await close()
})

test('3 · les segments : ouvert, deux zones ; fermé, une ; ignorer le pli est une casse déclarée qui se retourne', async () => {
  const { p, close } = await nav.page(URL(), { width: 1440 })
  await p.locator('#segments').scrollIntoViewIfNeeded(); await p.waitForTimeout(400)
  assert.equal(await shown(p, '#segments .ad-duo .ad-list'), true, 'ouvert : la liste est là')
  assert.equal(await p.locator('#segments .demo-single.good').count(), 1)
  await p.locator('#segments .demo-go').click(); await p.waitForTimeout(100)
  assert.equal(await p.getAttribute('#segments .demo-single', 'data-intent'), 'statement', 'ignorer le pli : la rupture est déclarée')
  assert.equal(await p.getAttribute('#segments .demo-go', 'aria-pressed'), 'true', 'l\'action est retournée')
  await p.locator('#segments .demo-go').click(); await p.waitForTimeout(100)
  assert.equal(await p.locator('#segments .demo-single.good').count(), 1, 'et elle se retourne')
  await p.locator('#segments .demo-seg .button', { hasText: 'Fermé' }).click(); await p.waitForTimeout(400)
  assert.equal(await shown(p, '#segments .ad-duo .ad-list'), false, 'fermé : une zone')
  assert.equal(await p.locator('#segments .demo-go').count(), 0, 'fermé : rien à ignorer')
  await close()
})

test('4 · les plans : un livre qu\'on ouvre — la couverture porte l\'écran extérieur dehors et l\'intérieur gauche dedans ; à plat la division est choisie ; à 125° la couverture a tourné de 55° autour de la charnière, son contenu avec elle, la surface logique ne change pas et la règle impose la frontière ; trois positions animées ; ignorer la charnière est une casse marquée ; quatre états lus au moteur — 0° fermé, 1–90° semi-ouvert, 91–179° largement ouvert, 180° à plat ; Retourner tourne l\'appareil', async () => {
  const { p, close } = await nav.page(URL(), { width: 1440 })
  await p.locator('#planes').scrollIntoViewIfNeeded(); await p.waitForTimeout(400)
  assert.equal(await p.locator('#planes .demo-seg .button').count(), 3, 'trois positions — 0, 125, 180 — et Retourner')
  const a = await box(p, '#planes .ad-cover .ad-zone-a'), b = await box(p, '#planes .ad-cover .ad-zone-b')
  assert.ok(a.w < b.w, `à plat, la division de l'interface est décentrée (${a.w} / ${b.w})`)
  assert.equal(await p.locator('#planes .ad-cover .ad-keys.split').count(), 1, 'à 800 px d\'un seul tenant, le clavier se scinde')
  assert.match(await text(p, '#planes .ad-angle'), /à plat · .*Tablet/, 'la posture est lue à côté des positions')
  await p.locator('#planes .ad-angle .button', { hasText: '125°' }).click(); await p.waitForTimeout(700)
  const m = await calc(p, '#planes .ad-cover', 'transform')
  assert.match(m, /^matrix3d/, 'en Livre, la couverture est une surface 3D')
  const cos = parseFloat(m.replace('matrix3d(', '').split(',')[0])
  assert.ok(Math.abs(cos - Math.cos(55 * Math.PI / 180)) < 0.01, `tournée de 55° : cos = ${cos}`)
  assert.equal(await calc(p, '#planes .ad-cover', 'transformOrigin').then((o) => o.split(' ')[0]), '400px', 'autour de la charnière')
  assert.equal(await p.$eval('#planes .ad-cover .ad-zone-a', (e) => getComputedStyle(e).transform), 'none', 'le contenu ne porte aucune transformation propre : il est solidaire de sa surface')
  assert.equal(await p.$eval('#planes .ad-cover .ad-screen', (e) => e.style.gridTemplateColumns), '50% 50%', 'Livre : la règle impose la frontière médiane')
  assert.equal(await p.locator('#planes .ad-fixed-panel .ad-keys.fixed').count(), 1, 'le clavier tient entier dans le panneau proche')
  assert.match(await text(p, '#planes .demo-caption'), /800 × 571 px · inchangé/, 'la surface logique n\'a pas changé')
  assert.match(await text(p, '#planes .ad-angle'), /largement ouvert · Tablet → Livre/, 'la posture, elle, a changé — et l\'état est lu')
  await p.locator('#planes .demo-go').click(); await p.waitForTimeout(100)
  assert.equal(await p.getAttribute('#planes .demo-single', 'data-intent'), 'statement', 'ignorer la charnière : déclaré')
  assert.equal(await p.$eval('#planes .ad-cover .ad-screen', (e) => e.style.gridTemplateColumns), '34% 66%', 'naïf : la division ne connaît que la largeur')
  assert.equal(await p.locator('#planes .ad-book .ad-crease').count(), 1, 'le pli est marqué')
  assert.equal(await p.locator('#planes .ad-cover .ad-face-inner .ad-keys.whole').count(), 1, 'naïf : le clavier entier, centré sur le pli')
  await p.locator('#planes .demo-go').click(); await p.waitForTimeout(100)
  assert.equal(await p.locator('#planes .ad-book .ad-crease').count(), 0, 'respecter la charnière : l\'interface se corrige')
  await p.locator('#planes .ad-angle').getByRole('button', { name: '0°', exact: true }).click(); await p.waitForTimeout(700)
  assert.equal(await p.locator('#planes .ad-book.ad-closed').count(), 1, '0° : fermé, l\'écran intérieur n\'est pas utilisé')
  assert.equal(await p.locator('#planes .ad-cover .ad-screen').count(), 0, 'plus de composition intérieure')
  assert.equal(await p.locator('#planes .ad-face-outer:not(.off) .ad-keys.whole').count(), 1, 'l\'écran extérieur, sur la couverture : une zone, le clavier entier')
  assert.match(await text(p, '#planes .ad-angle'), /fermé · .*Mobile/, '0° : Mobile')
  await p.locator('#planes .demo-tools .button', { hasText: 'Retourner' }).click(); await p.waitForTimeout(800)
  assert.equal(await p.getAttribute('#planes .ad-device', 'data-rotated'), 'true', 'Retourner : le même appareil, tourné de 90°')
  await p.locator('#planes .ad-angle .button', { hasText: '125°' }).click(); await p.waitForTimeout(700)
  assert.match(await text(p, '#planes .ad-angle'), /Laptop/, 'tourné et entrouvert : Laptop')
  assert.ok(await p.locator('#planes .ad-canvas.turned').count() > 0, 'la toile se redresse')
  await close()
})

test('5 · dans les deux thèmes, tout tertiaire rendu porte le rôle titre au moins, au cran étiquette au moins, jamais un paragraphe lu', async () => {
  for (const theme of ['light', 'dark']) {
    const { p, close } = await nav.page(URL(), { width: 1440, theme })
    const f = await faultsC17(p, theme, 1440)
    assert.deepEqual(f, [], `${theme} : ${f.length} faute(s)`)
    await close()
  }
})
test('5 · marges, espaces, coins, tailles : chaque valeur calculée est une valeur du moteur — hors des valeurs déclarées et de l\'appareil imité ; zéro débord ; zéro erreur', async () => {
  const css = CSS(), g = GLOBAL()
  const exclusions = ['.ad-book', '.ad-book *', ...['padding', 'gap', 'border-radius', 'margin'].flatMap((prop) => [...selectorsDeclaredAll(css, prop), ...selectorsDeclaredAll(g, prop), ...selectorsInEm(css, prop), ...selectorsInEm(g, prop)])]
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
test('5 · l\'adaptation est un principe : le rail la range avec ses sœurs ; huit sections, six preuves, huit lignes en liste, dix lignes de code lues au moteur', async () => {
  const { p, close } = await nav.page(URL(), { width: 1440 })
  assert.equal(await text(p, '.gdoc-rail .rail-heading'), 'Adaptation', 'le rail garde la page : une seule page ouverte dans les principes')
  assert.equal(await p.locator('main .gdoc-sec').count(), 8, 'six preuves, un répertoire, le code')
  assert.equal(await p.locator('main .gdoc-sec .demo').count(), 6, 'six preuves')
  assert.equal(await p.locator('#invisibles .doc-list tbody tr').count(), 8, 'huit lignes en liste')
  assert.equal(await p.locator('#code .doc-code tbody tr').count(), 10, 'dix lignes de code')
  assert.equal(await p.locator('#postures .doc-list tbody tr').count(), 4, 'quatre états physiques')
  const code = await texts(p, '#code .doc-code .cs-val')
  assert.equal(code[1], `${ADAPTATION.work.list.rem} + ${String(ADAPTATION.gutter).replace('.', ',')} + ${ADAPTATION.work.sheet.rem}`, 'le seuil est une somme, lue au moteur')
  await close()
})
test('5 · l\'écriture : aucun mot qui commande ou décrit, pas d\'histoire de page, pas de pied, un seul répertoire, aucun saut de niveau ; cinq pièces', async () => {
  const { p, close } = await nav.page(URL(), { width: 1440 })
  assert.deepEqual(await faultsWriting(p), [])
  assert.equal(await p.locator('#registry .doc-piece-head h3').count(), 5, 'cinq pièces')
  await close()
})
