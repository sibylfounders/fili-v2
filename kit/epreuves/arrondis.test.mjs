/* LE CRASH-TEST DE LA PAGE ARRONDIS — kit/epreuves/arrondis.test.mjs
   Ce qui doit être vrai à l'écran, mesuré sans l'œil (plan validé par
   l'Auteur le 26 août 2026) :
   1 · chaque chiffre affiché sort du moteur (légendes, table des intentions) ;
   2 · chaque preuve est rendue par son propre cran (la fiche Navette, le labo du coin, la pilule, les vignettes) ;
   3 · la racine sous les yeux : un nombre tourne, toute la chaîne suit, les invariants tiennent ;
   4 · les coins ne suivent ni l'écran ni la densité ; les titres glissent ;
   5 · le tertiaire suit C17 ;
   6 · rien en dur — marges, espaces, coins, tailles, couleurs écrites, hors des lignes qui le disent. */
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { chaine, INTENTIONS, CHARTE, BORNES, DENSITES, HORS_CHAINE } from '../derivation.mjs'
import { KIT, LARGEURS, TOL, ouvrirSite, ouvrirNavigateur, attendu, proche, nombres, calcPx, calc, texte, textes, fautesC17, fautesEnDur, fautesTailles, selecteursDeclares, selecteursEnEm, lignesAvecSelecteur, debord, rgb, encres } from './banc.mjs'

const ok = (a, b, msg, tol = TOL) => assert.ok(a !== null && proche(a, b, tol), `${msg} : ${a} attendu ${b}`)
const liste = (a, b, msg, tol = 0.051) => { assert.equal(a.length, b.length, `${msg} : ${a.length} nombres, ${b.length} attendus (${a} / ${b})`); a.forEach((v, i) => ok(v, b[i], `${msg} [${i}]`, tol)) }
const arrondi = (v) => Math.round(v * 10) / 10
const RACINES = [CHARTE.racine, 0, 24, BORNES.racine[1]]
const CSS = () => fs.readFileSync(path.join(KIT, 'app/arrondis/arrondis.css'), 'utf8')

let site, nav
before(async () => { site = await ouvrirSite(); nav = await ouvrirNavigateur() })
after(async () => { await nav?.fermer(); site?.fermer() })
const URL = () => site.url + '/arrondis'
const regler = async (p, id, v) => { await p.locator(`#${id}`).fill(String(v)); await p.waitForFunction(([id, v]) => document.querySelector(`output[for="${id}"]`).textContent === String(v), [id, v]) }

/* ── 1 · Chaque chiffre affiché sort du moteur ── */
test('1 · la légende de la fiche Navette suit la racine du curseur, chiffre par chiffre ; la légende du coin dit √2 ; la table dit chaque intention', async () => {
  const { p, fermer } = await nav.page(URL())
  for (const racine of RACINES) {
    await regler(p, 'ar-racine', racine)
    const s = chaine({ racine })
    const lus = nombres(await texte(p, '#profondeur .gd-legende'))
    liste(lus, [s.r[0], s.pad[0], s.r[1], s.pad[1], s.r[2], s.pad[2], s.r[3], s.rCtl, 4, s.gap[0], s.gap[1], s.gap[2]].map(arrondi), `racine ${racine}`)
  }
  for (const [ri, e] of [[12, 12], [4, 0], [36, 24]]) {
    await regler(p, 'ar-ri', ri); await regler(p, 'ar-ecart', e)
    const lus = nombres(await texte(p, '#coin .gd-legende'))
    const attendus = e > 0 ? [ri, e, ri, arrondi(e * Math.SQRT2), Math.round((Math.SQRT2 - 1) * 100), ri + e, e] : [ri, e, ri, 0, ri + e, e]
    liste(lus, attendus, `coin ${ri} · écart ${e}`)
  }
  for (let i = 0; i < INTENTIONS.length; i++) {
    await p.locator('#repertoire .rang .bouton').nth(i).click()
    const t = INTENTIONS[i], s = chaine(t)
    const rangs = await p.evaluate(() => [...document.querySelectorAll('#repertoire .ar-table tbody tr')].map((tr) => [...tr.children].slice(2).map((td) => td.textContent)))
    assert.equal(rangs.length, 7)
    for (let k = 0; k < 4; k++) { liste(nombres(rangs[k][0]), [arrondi(s.r[k])], `${t.nom} — coin ${k}`); if (k < 3) liste(nombres(rangs[k][1]), [arrondi(s.pad[k])], `${t.nom} — marge ${k}`); else assert.equal(rangs[k][1], '—') }
    liste(nombres(rangs[4][0]), [arrondi(s.rCtl)], `${t.nom} — composant`); liste(nombres(rangs[4][1]), [arrondi(s.pad[2])], `${t.nom} — marge du composant`)
    assert.deepEqual(rangs[5], ['plein', '—']); assert.deepEqual(rangs[6], ['—', '—'])
    const legende = await texte(p, '#repertoire .gd-legende')
    assert.ok(legende.startsWith(`${t.nom} — base ${t.base} · racine ${t.racine} · intervalle ${t.note}`), `${t.nom} — légende : ${legende}`)
  }
  await fermer()
})

/* ── 2 · Chaque preuve est rendue par son propre cran ── */
test('2 · la fiche Navette : panneau, carte, ligne, marque, boutons — coin ÷ 2 par profondeur, marge et espace de profondeur, aux quatre racines', async () => {
  const { p, fermer } = await nav.page(URL())
  for (const racine of RACINES) {
    await regler(p, 'ar-racine', racine)
    await p.waitForTimeout(250) /* la fiche anime ses coins (0,2 s) ; le banc les lit au repos */
    const s = chaine({ racine }), n = `racine ${racine}`
    ok(await calcPx(p, '#profondeur .ar-panneau', 'borderTopLeftRadius'), s.r[0], `${n} — panneau coin`); ok(await calcPx(p, '#profondeur .ar-panneau', 'paddingTop'), s.pad[0], `${n} — panneau marge`); ok(await calcPx(p, '#profondeur .ar-panneau', 'rowGap'), s.gap[0], `${n} — panneau espace`)
    ok(await calcPx(p, '#profondeur .ar-carte', 'borderTopLeftRadius'), s.r[1], `${n} — carte coin`); ok(await calcPx(p, '#profondeur .ar-carte', 'paddingTop'), s.pad[1], `${n} — carte marge`); ok(await calcPx(p, '#profondeur .ar-carte', 'rowGap'), s.gap[1], `${n} — carte espace`)
    ok(await calcPx(p, '#profondeur .ar-ligne', 'borderTopLeftRadius'), s.r[2], `${n} — ligne coin`); ok(await calcPx(p, '#profondeur .ar-ligne', 'paddingTop'), s.pad[2], `${n} — ligne marge`); ok(await calcPx(p, '#profondeur .ar-ligne', 'columnGap'), s.gap[2], `${n} — ligne espace`)
    ok(await calcPx(p, '#profondeur .ar-marque', 'borderTopLeftRadius'), s.r[3], `${n} — marque coin`)
    ok(await calcPx(p, '#profondeur .ar-btn', 'borderTopLeftRadius'), s.rCtl, `${n} — bouton = racine ÷ 4`); ok(await calcPx(p, '#profondeur .ar-btn', 'paddingTop'), s.pad[2], `${n} — bouton marge de ligne`); ok(await calcPx(p, '#profondeur .ar-actions', 'columnGap'), s.gap[1], `${n} — entre les boutons`)
    ok(await calcPx(p, '#profondeur .ar-btn', 'minHeight'), attendu('control-height', 1440), `${n} — la cible au doigt`)
    /* les invariants, mesurés : aucun enfant plus rond que son parent ; aucune marge sous son coin */
    const r = await p.evaluate(() => ['.ar-panneau', '.ar-carte', '.ar-ligne', '.ar-marque'].map((s) => parseFloat(getComputedStyle(document.querySelector(`#profondeur ${s}`)).borderTopLeftRadius)))
    const m = await p.evaluate(() => ['.ar-panneau', '.ar-carte', '.ar-ligne'].map((s) => parseFloat(getComputedStyle(document.querySelector(`#profondeur ${s}`)).paddingTop)))
    for (let k = 1; k < 4; k++) assert.ok(r[k] <= r[k - 1] + TOL, `${n} — l'enfant ${k} est plus rond que son parent (${r})`)
    for (let k = 0; k < 3; k++) assert.ok(m[k] >= r[k] - TOL, `${n} — la marge ${k} descend sous le coin (${m} / ${r})`)
    if (racine === BORNES.racine[1]) { ok(m[0], racine, `${n} — la marge du panneau relevée au coin`); ok(m[1], racine / 2, `${n} — la marge de la carte relevée au coin`) }
  }
  await fermer()
})
test('2 · le labo du coin dessine ce qu’il dit : à gauche le même rayon, à droite le rayon intérieur plus l’écart ; la pilule est une liste fermée de quatre, ses deux recalés sont dits', async () => {
  const { p, fermer } = await nav.page(URL())
  for (const [ri, e] of [[12, 12], [8, 20], [36, 0]]) {
    await regler(p, 'ar-ri', ri); await regler(p, 'ar-ecart', e)
    const k = 3.2 /* hors chaîne, dit dans la vue : une unité du dessin = 3,2 */
    const rx = await p.evaluate(() => [...document.querySelectorAll('#coin .ar-coin svg')].map((svg) => [...svg.querySelectorAll('rect')].slice(1).map((r) => parseFloat(r.getAttribute('rx')))))
    assert.deepEqual(rx, [[ri * k, ri * k], [(ri + e) * k, ri * k]], `coin ${ri} · écart ${e} — les rayons dessinés`)
    const verdicts = await textes(p, '#coin .ar-coin .verdict')
    assert.deepEqual(verdicts, ['✗', '✓'])
  }
  /* la pilule : les quatre membres portent le rayon plein ; les deux recalés aussi — c'est leur faute, déclarée ; la gélule passe à la ligne */
  const membres = await p.evaluate(() => [...document.querySelectorAll('#pilule .ar-membre')].map((m) => ({ nom: m.querySelector('.nom').textContent, intent: m.dataset.intent ?? null, objet: m.querySelector('.objet > *') ? getComputedStyle(m.querySelector('.objet > *')).borderTopLeftRadius : null })))
  assert.equal(membres.length, 6)
  assert.deepEqual(membres.map((m) => m.intent), [null, null, null, null, 'statement', 'statement'])
  for (const m of membres) assert.ok(parseFloat(m.objet) >= 9999 || /^50%|^[\d.]+px$/.test(m.objet), `${m.nom} : ${m.objet}`)
  assert.equal(await p.evaluate(() => parseFloat(getComputedStyle(document.querySelector('#pilule .ar-pastille')).borderTopLeftRadius)), HORS_CHAINE.pilule)
  assert.equal(await p.evaluate(() => parseFloat(getComputedStyle(document.querySelector('#pilule .ar-btn-pilule')).borderTopLeftRadius)), HORS_CHAINE.pilule, 'le bouton recalé porte la pilule qu’il n’a pas le droit de porter')
  assert.ok(await p.evaluate(() => { const g = document.querySelector('#pilule .ar-gelule'); return g.getBoundingClientRect().height > 2 * parseFloat(getComputedStyle(g).fontSize) }), 'la gélule passe à la ligne')
  /* l'interrupteur et les onglets vivent, au clavier comme au pointeur */
  await p.locator('#pilule .ar-inter').click(); assert.equal(await p.getAttribute('#pilule .ar-inter', 'aria-checked'), 'false')
  await p.locator('#pilule .ar-onglets button').nth(1).click(); assert.equal(await p.getAttribute('#pilule .ar-onglets button >> nth=1', 'aria-selected'), 'true')
  /* les vignettes de la table portent le coin de chaque intention */
  for (let i = 0; i < INTENTIONS.length; i++) {
    await p.locator('#repertoire .rang .bouton').nth(i).click(); await p.waitForTimeout(250)
    const s = chaine(INTENTIONS[i])
    const v = await p.evaluate(() => [...document.querySelectorAll('#repertoire .ar-ex')].map((e) => getComputedStyle(e).borderTopLeftRadius))
    liste(v.slice(0, 5).map(parseFloat), [...s.r, s.rCtl], `${INTENTIONS[i].nom} — vignettes`, TOL); assert.ok(parseFloat(v[5]) >= 9999); assert.equal(v[6], '0px')
  }
  await fermer()
})
test('2 · la feuille de la page consomme, pour chaque preuve, la variable ou le jeton qu’elle nomme, et dit ses casses', () => {
  const css = CSS()
  const bloc = (sel) => { const i = css.indexOf(`\n${sel} {`); assert.ok(i >= 0, `sélecteur absent : ${sel}`); return css.slice(i, css.indexOf('}', i)) }
  const attend = (sel, decl) => assert.ok(bloc(sel).includes(decl), `${sel} : « ${decl} » attendu`)
  attend('.ar-panneau', 'border-radius: var(--ar-r1) var(--ar-r1) 0 0'); attend('.ar-panneau', 'padding: var(--ar-p1)'); attend('.ar-panneau', 'gap: var(--ar-g1)')
  attend('.ar-carte', 'border-radius: var(--ar-r2)'); attend('.ar-carte', 'padding: var(--ar-p2)'); attend('.ar-carte', 'gap: var(--ar-g2)')
  attend('.ar-ligne', 'border-radius: var(--ar-r3)'); attend('.ar-ligne', 'padding: var(--ar-p3)'); attend('.ar-ligne', 'gap: var(--ar-g3)')
  attend('.ar-btn', 'border-radius: var(--ar-rctl)'); attend('.ar-btn', 'min-height: var(--control-height)')
  for (const sel of ['.ar-pastille', '.ar-avatar', '.ar-inter', '.ar-onglets']) attend(sel, 'border-radius: var(--r-pill)')
  for (const sel of ['.ar-btn-pilule', '.ar-gelule']) assert.match(bloc(sel), /casse/, `${sel} : casse dite`)
})

/* ── 3 · La racine sous les yeux ── */
test('3 · à racine 0 tout est carré et le bouton aussi ; à 38 la chaîne est 38 · 19 · 9,5 · 4,75 et la marge suit ; le curseur ne dépasse jamais la borne', async () => {
  const { p, fermer } = await nav.page(URL())
  assert.equal(await p.getAttribute('#ar-racine', 'max'), String(BORNES.racine[1])); assert.equal(await p.getAttribute('#ar-racine', 'min'), '0')
  assert.equal(await p.inputValue('#ar-racine'), String(CHARTE.racine), 'la charte au départ')
  await regler(p, 'ar-racine', 0); await p.waitForTimeout(250)
  for (const s of ['.ar-panneau', '.ar-carte', '.ar-ligne', '.ar-marque', '.ar-btn']) ok(await calcPx(p, `#profondeur ${s}`, 'borderTopLeftRadius'), 0, `racine 0 — ${s}`)
  await regler(p, 'ar-racine', 38); await p.waitForTimeout(250)
  liste(await p.evaluate(() => ['.ar-panneau', '.ar-carte', '.ar-ligne', '.ar-marque'].map((s) => parseFloat(getComputedStyle(document.querySelector(`#profondeur ${s}`)).borderTopLeftRadius))), [38, 19, 9.5, 4.75], 'racine 38', TOL)
  ok(await calcPx(p, '#profondeur .ar-panneau', 'paddingTop'), 38, 'la marge du panneau monte avec la racine')
  await fermer()
})

/* ── 4 · Ni l'écran ni la densité ; les titres glissent ── */
test('4 · les coins de la fiche ne bougent ni avec la largeur ni avec la densité ; la scène, elle, suit la base ; l’affiche et les sections glissent', async () => {
  const affiche = []
  for (const W of LARGEURS) for (const densite of ['comfortable', 'compact']) {
    const { p, fermer } = await nav.page(URL(), { largeur: W, densite })
    const s = chaine()
    liste(await p.evaluate(() => ['.ar-panneau', '.ar-carte', '.ar-ligne', '.ar-marque', '.ar-btn'].map((x) => parseFloat(getComputedStyle(document.querySelector(`#profondeur ${x}`)).borderTopLeftRadius))), [...s.r, s.rCtl], `${W} ${densite} — coins fixes`, TOL)
    ok(await calcPx(p, '#profondeur .ar-panneau', 'paddingTop'), s.pad[0], `${W} ${densite} — la fiche vit sur la charte, pas sur le réglage du site`)
    ok(await calcPx(p, '#profondeur .banc', 'paddingTop'), attendu('pad-1-block', W, DENSITES[densite]), `${W} ${densite} — la scène suit la base`)
    if (densite === 'comfortable') { const h1 = await calcPx(p, '.gdoc-heros h1', 'fontSize'); ok(h1, attendu('doc-cover', W), `${W} — affiche`); ok(await calcPx(p, '.gdoc-sec h2', 'fontSize'), attendu('doc-section', W), `${W} — section`); affiche.push(h1) }
    await fermer()
  }
  assert.ok(affiche[0] < affiche[1] && affiche[1] < affiche[2], `l'affiche glisse : ${affiche}`)
})

/* ── 5 · C17 ── */
test('5 · dans les deux thèmes, tout tertiaire rendu porte 600 au moins, au cran étiquette au moins, jamais un paragraphe lu', async () => {
  for (const theme of ['light', 'dark']) {
    const { p, fermer } = await nav.page(URL(), { largeur: 1440, theme })
    const f = await fautesC17(p, theme, 1440)
    assert.deepEqual(f, [], `${theme} : ${f.length} faute(s)`)
    const combien = await p.evaluate((t) => [...document.querySelectorAll('main *')].filter((e) => getComputedStyle(e).color === t).length, rgb(encres(theme)['text-tertiary']))
    assert.ok(combien >= 10, `${theme} : ${combien} emplois du tertiaire`)
    await fermer()
  }
})

/* ── 6 · Rien en dur ── */
test('6 · marges, espaces, coins, tailles : chaque valeur calculée est une valeur du moteur, hors des lignes qui disent « hors chaîne » ou « casse » ; zéro débord ; zéro erreur', async () => {
  const css = CSS(), globales = fs.readFileSync(path.join(KIT, 'app/globals.css'), 'utf8')
  const exclusions = ['padding', 'gap', 'border-radius', 'margin'].flatMap((prop) => [...selecteursDeclares(css, prop), ...selecteursEnEm(css, prop), ...selecteursEnEm(globales, prop)])
  /* le dessin du labo (svg) parle en unités de viewBox, dites hors chaîne dans la vue */
  const tailles = ['svg *', ...selecteursDeclares(css, 'font-size'), ...selecteursDeclares(globales, 'font-size'), ...selecteursEnEm(css), ...selecteursEnEm(globales)]
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
test('6 · dans la feuille, chaque couleur écrite en dur est dite — sur sa ligne, ou dans l’en-tête du bloc de scène qui la porte (la fiche Navette est un décor, hors chaîne)', () => {
  const css = CSS()
  const fautes = []
  let entete = '', dansEntete = false
  css.split('\n').forEach((l, i) => {
    if (/^\/\* ── /.test(l)) { entete = l; dansEntete = !/\*\//.test(l); return }
    if (dansEntete) { entete += l; dansEntete = !/\*\//.test(l); return }
    if (!/#[0-9A-Fa-f]{3,6}\b|rgba?\(/.test(l) || /^\s*(\/\*|\*)/.test(l)) return
    if (/hors chaîne|casse|décor|verdict/.test(l) || /hors chaîne|décor/.test(entete)) return
    fautes.push(`arrondis.css:${i + 1} ${l.trim().slice(0, 80)}`)
  })
  assert.deepEqual(fautes, [])
})
