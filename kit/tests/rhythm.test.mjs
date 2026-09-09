/* LE CRASH-TEST DE LA PAGE RYTHME — kit/tests/rhythm.test.mjs
   Ce qui doit être vrai à l'écran, mesuré sans l'œil (plan validé par
   l'Auteur le 26 août 2026) :
   1 · chaque chiffre affiché sort du moteur ;
   2 · chaque preuve est rendue par son propre token ;
   3 · la densité recalcule sous les yeux ;
   4 · les titres glissent avec l'écran ;
   5 · le tertiaire suit C17 ;
   6 · rien en dur hors des lignes déclarées.

   Remise à niveau du 1er septembre 2026, second passage : la page est passée
   au gabarit des quatre étages. Elle garde TROIS preuves — la chaîne (01), la
   densité en situation (02), la profondeur (03) — puis trois étages communs à
   toutes les pages du kit : les bandes (04), la liste (05), le code (06). Le
   bon cran, le
   laboratoire des six intentions, les trois cartes de densité et les tuiles du
   vocabulaire ont été retirés (verdict d'Auteur). Les épreuves disent CE QUE LA PAGE PROUVE
   AUJOURD'HUI — aucune n'a été relâchée pour passer.                        */
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { chain, tokens, INTENTS, DENSITIES, AXES, WIDTH_MIN, WIDTH_MAX } from '../derivation.mjs'
import { KIT, WIDTHS, DENSITIES_SITE, TOL, openSite, openBrowser, expected, near, numbers, calcPx, calc, text, texts, faultsC17, faultsInHard, selectorsDeclaredAll, selectorsInEm, overflow, rgb, inks , faultsWriting } from './bench.mjs'

const FOUNDATION = chain(), J = tokens(FOUNDATION)
const ok = (a, b, msg, tol = TOL) => assert.ok(a !== null && near(a, b, tol), `${msg} : ${a} attendu ${b}`)
const list = (a, b, msg, tol = 0.051) => { assert.equal(a.length, b.length, `${msg} : ${a.length} nombres, ${b.length} attendus (${a} / ${b})`); a.forEach((v, i) => ok(v, b[i], `${msg} [${i}]`, tol)) }
const grid4 = (v) => Math.round(v / 4) * 4
/* l'écriture des pages : un chiffre après la virgule */
const rounded = (v) => Math.round(v * 10) / 10

let site, nav
before(async () => { site = await openSite(); nav = await openBrowser() })
after(async () => { await nav?.close(); site?.close() })
const URL = () => site.url + '/rythme'

/* ── 1 · Chaque chiffre affiché sort du moteur ── */
test('1 · la table de correspondance (dépliant de 08) est le registre ligne à ligne : charte, bornes, grille de 4, CSS', async () => {
  const { p, close } = await nav.page(URL())
  await p.locator('#code details.prov summary').click()
  const ranks = await p.evaluate(() => [...document.querySelectorAll('#code details.prov table tbody tr')].map((tr) => [...tr.children].map((td) => td.textContent)))
  const names = Object.keys(J).filter((n) => /^(pad|gap|edge|page)-/.test(n))
  assert.deepEqual(ranks.map((r) => r[0]), names.map((n) => `--${n}`))
  for (const [name, base, bounds, tw, css] of ranks) {
    const t = J[name.slice(2)]
    list(numbers(base), [rounded(t.base)], `${name} charte`)
    list(numbers(bounds), [t.bottom, t.top].map(rounded), `${name} bornes`)
    list(numbers(tw), [grid4(t.bottom), grid4(t.top)], `${name} grille de 4`)
    assert.equal(css, t.css, `${name} CSS`)
  }
  const head = await text(p, '#code details.prov table thead')
  assert.ok(head.includes(`${WIDTH_MIN} → ${WIDTH_MAX}`))
  await close()
})
test('1 · dans la vue, aucun nombre en pixels n’est écrit à la main hors d’une ligne « hors chaîne »', () => {
  const src = fs.readFileSync(path.join(KIT, 'app/rythme/view.tsx'), 'utf8')
  const faults = []
  src.split('\n').forEach((l, i) => {
    if (/^\s*(\/\/|\/\*|\*)/.test(l) || /hors chaîne/.test(l)) return
    if (/(^|[^a-zA-Z_(])\d+([.,]\d+)? ?px\b/.test(l)) faults.push(`vue.tsx:${i + 1} ${l.trim()}`)
  })
  assert.deepEqual(faults, [])
})

/* ── 2 · Chaque preuve est rendue par son propre token — mesuré aux trois largeurs ── */
const PROOFS = [
  /* [sélecteur, propriété calculée, token] — la tranche Fili : coque → carte → ligne */
  ['#scale .slice', 'paddingTop', 'pad-1-block'], ['#scale .slice', 'paddingLeft', 'pad-1-inline'],
  ['#scale .slice', 'borderTopLeftRadius', 'r-1'], ['#scale .slice', 'columnGap', 'gap-1-inline'],
  /* la marge du panneau est tracée par quatre bandes posées sur son bord (31 août) :
     elles doivent valoir EXACTEMENT le rembourrage qu'elles montrent, sinon la scène ment */
  ['#scale .ry-margin1 .top', 'height', 'pad-1-block'], ['#scale .ry-margin1 .bottom', 'height', 'pad-1-block'],
  ['#scale .ry-margin1 .left', 'width', 'pad-1-inline'], ['#scale .ry-margin1 .right', 'width', 'pad-1-inline'],
  ['#scale .tr-card', 'borderTopLeftRadius', 'r-2'],
  /* la carte est une rangée (1er septembre) : ses deux colonnes de marge sont ses enfants
     directs, ses marges hautes et basses et ses espaces vivent dans son dedans */
  ['#scale .tr-card > .space.pad.h', 'width', 'pad-2-inline'],
  ['#scale .tr-card-body > .space.pad', 'height', 'pad-2-block'],
  ['#scale .tr-card-body > .space.gap', 'height', 'gap-2-block'],
  ['#scale .tr-card-body .space.gap.h', 'width', 'gap-3-inline'],
  ['#scale .tr-sub', 'paddingTop', 'pad-3-block'], ['#scale .tr-sub', 'paddingLeft', 'pad-3-inline'],
  ['#scale .tr-sub', 'borderTopLeftRadius', 'r-3'],
  ['#scale .tr-btn', 'borderTopLeftRadius', 'r-ctl'], ['#scale .tr-btn', 'minHeight', 'control-height'],
  /* une entrée de menu est un CONTRÔLE, pas une ligne de texte (31 août) : sa hauteur est
     la cible compacte, sa marge est horizontale seule — et le menu se serre au plus serré */
  ['#scale .tr-item', 'borderTopLeftRadius', 'r-3'], ['#scale .tr-item', 'paddingLeft', 'pad-3-inline'],
  ['#scale .tr-item', 'minHeight', 'control-height-compact'], ['#scale .tr-nav', 'rowGap', 'gap-4-block'],
  /* la réglette est une légende faite de vraies boîtes de ligne */
  ['#scale .ry-ruler .ry-step', 'paddingTop', 'pad-3-block'], ['#scale .ry-ruler .ry-step', 'paddingLeft', 'pad-3-inline'],
  ['#scale .ry-ruler .ry-step', 'borderTopLeftRadius', 'r-3'], ['#scale .ry-ruler .ry-step', 'rowGap', 'gap-4-block'],
  /* l'amorce : sa carte est une carte, ses échantillons se tiennent au plus serré */
  /* la paire est une grille : les deux échantillons et la question sur les mêmes rangs (1er septembre) */
  /* la profondeur : coque, carte, ligne, et le bouton au coin de la ligne */
  /* 03 · la profondeur : la coque, sa carte, ses lignes, son bouton */
  ['#depth .ry-pf', 'borderTopLeftRadius', 'r-1'], ['#depth .ry-pf', 'paddingTop', 'pad-1-block'],
  ['#depth .ry-pf', 'rowGap', 'gap-1-block'],
  ['#depth .ry-pf-card', 'borderTopLeftRadius', 'r-2'], ['#depth .ry-pf-card', 'paddingLeft', 'pad-2-inline'],
  ['#depth .ry-pf-card', 'rowGap', 'gap-2-block'],
  ['#depth .ry-pf-line', 'borderTopLeftRadius', 'r-3'], ['#depth .ry-pf-line', 'paddingTop', 'pad-3-block'],
  ['#depth .ry-pf-line', 'columnGap', 'gap-3-inline'],
  ['#depth .ry-pf-btn', 'borderTopLeftRadius', 'r-ctl'], ['#depth .ry-pf-btn', 'minHeight', 'control-height'],
  /* la proximité, au repos : entre cartes au-dessus du titre, dans la ligne sous le titre et sous le libellé */
  ['#bands .ry-prox-card', 'borderTopLeftRadius', 'r-2'], ['#bands .ry-prox-card', 'paddingTop', 'pad-2-block'],
  ['#bands .ry-field', 'borderTopLeftRadius', 'r-ctl'], ['#bands .ry-field', 'minHeight', 'control-height'],
  /* la densité et le vocabulaire consomment ce qu'ils nomment */
  /* 02 · les COINS de la scène de densité : eux ne bougent ni avec la densité,
     ni avec la largeur — c'est la moitié de ce que la preuve affirme. Ses marges
     et ses espaces suivent la largeur SIMULÉE du cadre : ils sont mesurés dans
     leur propre épreuve, plus bas. */
  ['#density .ry-sd', 'borderTopLeftRadius', 'r-1'],
  ['#density .ry-sd-card', 'borderTopLeftRadius', 'r-2'],
  ['#density .ry-sd-line', 'borderTopLeftRadius', 'r-3'],
  /* les fiches de l'étage « en colonnes » : le filet, la vignette, la commande */
  /* les scènes des bandes : deux sœurs, l'escalier des rapports, la carte en rem, la cible */
  /* chaque scène vit deux fois, fausse à gauche et juste à droite : on mesure le côté juste — la
     card en rem est agrandie d'entrée (×1,5), elle est mesurée pour elle-même dans l'épreuve 3 */
  ['#bands .demo-side.good .ry-fr-container', 'paddingTop', 'pad-1-block'], ['#bands .demo-side.good .ry-fr-container', 'borderTopLeftRadius', 'r-1'],
  ['#bands .demo-side.good .ry-fr-card', 'borderTopLeftRadius', 'r-2'], ['#bands .demo-side.good .ry-fr-says', 'paddingTop', 'pad-2-block'],
  ['#bands .demo-side.good .ry-ratio-steps', 'rowGap', 'gap-3-block'], ['#bands .demo-side.good .ry-ratio-step', 'columnGap', 'gap-3-inline'],
  ['#bands .demo-side.good .ry-rem-card', 'borderTopLeftRadius', 'r-2'],
  ['#bands .demo-side.good .ry-target-btn', 'minHeight', 'control-height'], ['#bands .demo-side.good .ry-target-btn', 'borderTopLeftRadius', 'r-ctl'],
  ['#bands .demo-side.good .ry-target-gauge', 'minHeight', 'control-height'],
  /* l'étage « en bandes » : la parole à gauche, la scène à droite ; le cadre de la démonstration
     porte sa situation et son action, en version compacte */
  ['#bands .doc-band', 'paddingTop', 'pad-1-block'],
  ['#bands .doc-band-say', 'rowGap', 'gap-2-block'],
  ['#bands .demo-go', 'minHeight', 'control-height-compact'],
  ['#bands .demo-stage', 'paddingTop', 'pad-2-block'],
  /* l'étage « dans le code » : le panneau et sa table */
  ['#code .doc-panel', 'borderTopLeftRadius', 'r-1'], ['#code .doc-panel', 'paddingTop', 'pad-1-block'],
  ['#code .doc-unfold', 'borderTopLeftRadius', 'r-ctl'], ['#code .doc-unfold', 'minHeight', 'control-height'],
]
/* Les quatre crans de la réglette, dans l'ordre où elle les pose : le token
   qu'elle DESSINE, et la valeur de charte qu'elle ÉCRIT à côté. */
const STEPS_RULER = [
  ['pad-1-block', (s) => s.pad[0]], ['pad-2-block', (s) => s.pad[1]],
  ['gap-2-block', (s) => s.gap[1]], ['gap-3-inline', (s) => s.gap[2]],
]
test('2 · la tranche, la profondeur, la proximité, la densité et le vocabulaire sont rendus par leur token, aux trois largeurs', async () => {
  for (const W of WIDTHS) {
    const { p, close } = await nav.page(URL(), { width: W })
    for (const [sel, prop, token] of PROOFS) ok(await calcPx(p, sel, prop), expected(token, W), `${W} px — ${sel} ${prop} = --${token}`)
    /* le chiffre et sa légende (2 septembre, retour d'Auteur) : un COUPLE typographique, pas
       deux voisins — aucun espace entre eux, c'est l'interligne du chiffre qui fait le travail */
    const pair = await p.evaluate(() => { const c = document.querySelector('#scale .tr-sub'), b = c.querySelector('b'), cs = getComputedStyle(b)
      return [parseFloat(getComputedStyle(c).rowGap), parseFloat(cs.lineHeight) / parseFloat(cs.fontSize), parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--leading-heading'))] })
    assert.equal(pair[0], 0, `${W} px — le chiffre et sa légende n'ont pas d'espace entre eux`)
    ok(pair[1], pair[2], `${W} px — c'est l'interligne de titre qui les tient`, 0.01)
    /* la réglette (31 août) : quatre crans DESSINÉS à leur vraie longueur — c'est
       tout son propos, et c'est la seule preuve de la page qu'on peut fausser sans
       que rien ne se voie. Chaque barre vaut son token à cette largeur ; le nombre
       écrit à côté est la valeur de charte, comme partout ailleurs sur la page. */
    const bars = await p.evaluate(() => [...document.querySelectorAll('#scale .ry-step-bar')].map((b) => parseFloat(getComputedStyle(b).width)))
    list(bars, STEPS_RULER.map(([j]) => expected(j, W)), `${W} px — la réglette à la vraie longueur`, TOL)
    list((await texts(p, '#scale .ry-ruler .ry-step b')).flatMap(numbers), STEPS_RULER.map(([, v]) => rounded(v(FOUNDATION))), `${W} px — la réglette dit sa charte`)
    /* côte à côte, son écart vertical est un token du kit ; empilée (sous 56 rem), elle porte
       le « ÷ √2 » entre deux boîtes des deux côtés — c'est la seule mesure d'atelier de la page,
       et elle est dite sur sa ligne */
    const increment = await p.evaluate(() => { const cs = getComputedStyle(document.querySelector('#scale .ry-ruler')); return [parseFloat(cs.rowGap), parseFloat(cs.columnGap)] })
    ok(increment[0], W >= 56 * 16 ? expected('gap-1-block', W) : increment[1], `${W} px — l’écart vertical de la réglette`)
    /* la bande se replie sous 62 rem : la scène passe sous la parole, et l'écart
       des colonnes devient l'écart des rangs — les deux sont des tokens */
    ok(await calcPx(p, '#bands .doc-band', W >= 62 * 16 ? 'columnGap' : 'rowGap'),
       expected(W >= 62 * 16 ? 'doc-gutter' : 'gap-1-block', W), `${W} px — l’écart de la bande`)
    /* la règle 1, mesurée pour elle-même : l'écart entre deux sœurs EST leur marge,
       au même pixel — c'est le même chiffre, pas deux réglages qui se ressemblent */
    const sisters = await p.evaluate(() => {
      const c = document.querySelector('#bands .demo-side.good .ry-fr-container')
      return [parseFloat(getComputedStyle(c.querySelector(':scope > .space.h')).width),
              parseFloat(getComputedStyle(c.querySelector('.ry-fr-card > .space.h')).width)]
    })
    ok(sisters[0], sisters[1], `${W} px — l’écart entre sœurs = leur marge`)
    ok(sisters[0], expected('gap-1-inline', W), `${W} px — et c’est le token de l’espace entre frères`)
    /* l'escalier des rapports : quatre barres à leur vraie longueur, celles du registre */
    const barsRatio = await p.evaluate(() => [...document.querySelectorAll('#bands .demo-side.good .ry-ratio-bar')].map((b) => parseFloat(getComputedStyle(b).width)))
    list(barsRatio, [FOUNDATION.pad[0], FOUNDATION.pad[1], FOUNDATION.pad[2], FOUNDATION.gap[2]], `${W} px — l’escalier des rapports`, TOL)
    /* la proximité : les quatre écarts de la carte, au repos */
    const gaps = await p.evaluate(() => [...document.querySelectorAll('#bands .demo-side.good .ry-prox-card .space')].map((e) => parseFloat(getComputedStyle(e).height)))
    list(gaps, ['gap-1-block', 'gap-3-block', 'gap-1-block', 'gap-3-block'].map((n) => expected(n, W)), `${W} px — proximité, côté juste`, TOL)
    await close()
  }
})
test('2 · les casses sont rendues par le token menteur, déclarées (data-intent="statement") — chaque côté montre son verdict au repos, l’action rejoue', async () => {
  const W = 1440
  const { p, close } = await nav.page(URL(), { width: W })
  /* Deux côtés par démonstration : le faux à gauche, déclaré ; le juste à droite.
     Chaque scène est désignée par ce qu'elle contient : l'épreuve ne dépend pas
     de l'ordre des bandes dans la section. */
  const band = (scene) => `#bands .doc-band:has(${scene})`
  const bad = (scene) => `${band(scene)} .demo-side.bad`, good = (scene) => `${band(scene)} .demo-side.good`
  for (const scene of ['.ry-fr-container', '.ry-ratio', '.ry-rem', '.ry-target', '.ry-prox-card .ry-h3', '.ry-field'])
    assert.equal(await p.getAttribute(bad(scene), 'data-intent'), 'statement', `${scene} : le côté faux se déclare`)

  /* y1 · l'écart entre deux sœurs tombe sous leur marge */
  const sisters = (side) => calcPx(p, `${side} .ry-fr-container > .space.h`, 'width')
  ok(await sisters(bad('.ry-fr-container')), expected('gap-3-inline', W), 'sœurs cassées : l’écart tombe sous la marge')
  ok(await sisters(good('.ry-fr-container')), await calcPx(p, `${good('.ry-fr-container')} .ry-fr-card > .space.h`, 'width'), 'sœurs justes : l’écart vaut la marge')

  /* y12 · la chaîne construite en retranchant : quatre longueurs jumelles */
  const bars = await p.evaluate((sel) => [...document.querySelectorAll(`${sel} .ry-ratio-bar`)].map((b) => parseFloat(getComputedStyle(b).width)), bad('.ry-ratio'))
  list(bars, [0, 1, 2, 3].map((i) => FOUNDATION.pad[0] - 4 * i), 'rapports cassés : on retire 4 px à chaque pas', TOL)

  /* y9 · le texte est agrandi d'entrée : la marge en tokens a suivi (×1,5), la marge en pixels
     n'a pas bougé. L'action rejoue : les deux cards reviennent au corps ×1 — la marge en tokens
     redevient celle du registre — puis le texte grandit à nouveau. */
  const margins = () => Promise.all([calcPx(p, `${good('.ry-rem')} .ry-rem-card`, 'paddingTop'), calcPx(p, `${bad('.ry-rem')} .ry-rem-card`, 'paddingTop')])
  const enlarged = await margins()
  ok(enlarged[0], expected('pad-2-block', W) * 1.5, 'texte agrandi : la marge en tokens a suivi', TOL)
  ok(enlarged[1], 16, 'texte agrandi : la marge en pixels n’a pas bougé')
  await p.locator(`${band('.ry-rem')} .demo-go`).click()
  await p.waitForTimeout(100)
  const atRest = await margins()
  ok(atRest[0], expected('pad-2-block', W), 'rejeu, au repos : la carte en tokens porte la marge du registre', TOL)
  ok(atRest[1], 16, 'rejeu, au repos : la carte en pixels porte 16')
  await p.waitForTimeout(1600)
  list(await margins(), enlarged, 'rejeu terminé : le texte est de nouveau agrandi', TOL)

  /* y17 · la commande passe sous le plancher de la cible */
  ok(await calcPx(p, `${bad('.ry-target')} .ry-target-btn`, 'minHeight'), 36, 'cible cassée : sous le plancher')
  ok(await calcPx(p, `${good('.ry-target')} .ry-target-btn`, 'minHeight'), expected('control-height', W), 'cible juste : la hauteur due')

  /* la proximité : le titre, puis le libellé — les quatre écarts de chaque côté, et leur cote écrite
     (les cotes sont cachées au repos depuis le 9 septembre : l'action du cadre les allume) */
  await p.locator('#bands .demo-go', { hasText: 'Montrer les espaces' }).first().click(); await p.waitForTimeout(150)
  const gaps = (sel) => p.evaluate((sel) => [...document.querySelectorAll(`${sel} .ry-prox-card .space`)].map((e) => [parseFloat(getComputedStyle(e).height), e.dataset.name]), sel)
  const cote = (v) => `${String(Math.round(v * 10) / 10).replace('.', ',')} px`
  let e = await gaps(bad('.ry-prox-card .ry-h3'))
  list(e.map((x) => x[0]), ['gap-2-block', 'gap-2-block'].map((n) => expected(n, W)), 'titre cassé : le même écart des deux côtés', TOL)
  assert.deepEqual(e.map((x) => x[1]), [cote(FOUNDATION.gap[1]), cote(FOUNDATION.gap[1])], 'titre cassé : chaque espace porte sa cote')
  e = await gaps(good('.ry-prox-card .ry-h3'))
  list(e.map((x) => x[0]), ['gap-1-block', 'gap-3-block'].map((n) => expected(n, W)), 'titre juste : un cran de plus au-dessus', TOL)
  assert.deepEqual(e.map((x) => x[1]), [cote(FOUNDATION.gap[0]), cote(FOUNDATION.gap[2])], 'titre juste : chaque espace porte sa cote')
  e = await gaps(bad('.ry-field'))
  list(e.map((x) => x[0]), ['gap-1-block', 'gap-1-block'].map((n) => expected(n, W)), 'libellé cassé : aussi loin de son champ que de ce qui précède', TOL)
  e = await gaps(good('.ry-field'))
  list(e.map((x) => x[0]), ['gap-1-block', 'gap-3-block'].map((n) => expected(n, W)), 'libellé juste : plus près de son champ', TOL)
  await close()
})
test('2 · la feuille de la page consomme, pour chaque preuve, le token qu’elle nomme', () => {
  const css = fs.readFileSync(path.join(KIT, 'app/rythme/rhythm.css'), 'utf8')
  const block = (sel) => { const i = css.indexOf(`\n${sel} {`); assert.ok(i >= 0, `sélecteur absent : ${sel}`); return css.slice(i, css.indexOf('}', i)) }
  const waits = (sel, decl) => assert.ok(block(sel).includes(decl), `${sel} : « ${decl} » attendu`)
  waits('.slice', 'padding: var(--pad-1-block) var(--pad-1-inline)'); waits('.slice', 'border-radius: var(--r-1)'); waits('.slice', 'gap: var(--gap-1-inline)')
  waits('.tr-card', 'border-radius: var(--r-2)'); waits('.tr-sub', 'padding: var(--pad-3-block) var(--pad-3-inline)'); waits('.tr-sub', 'border-radius: var(--r-3)')
  waits('.tr-btn', 'border-radius: var(--r-ctl)'); waits('.tr-btn', 'min-height: var(--control-height)')
  waits('.ry-pf', 'border-radius: var(--r-1)'); waits('.ry-pf-card', 'border-radius: var(--r-2)'); waits('.ry-pf-line', 'border-radius: var(--r-3)')
  waits('.ry-prox-card', 'padding: var(--pad-2-block) var(--pad-2-inline)')
  waits('.ry-sd', 'padding: var(--sd-p1) var(--sd-p1i)'); waits('.ry-sd', 'border-radius: var(--r-1)')
  waits('.ry-sd-card', 'padding: var(--sd-p2) var(--sd-p2i)'); waits('.ry-sd-card', 'border-radius: var(--r-2)')
  waits('.ry-sd-line', 'padding: var(--sd-p3) var(--sd-p3i)'); waits('.ry-sd-line', 'border-radius: var(--r-3)')
  waits('.ry-target-btn', 'min-height: var(--control-height)')
  waits('.ry-fr-says', 'padding-block: var(--pad-2-block)')
  /* les casses des bandes sont dites, chacune sur SA ligne */
  for (const sel of ['.ry-rem-card.hard', '.ry-target[data-intent="statement"] .ry-target-btn'])
    assert.match(block(sel), /casse|broken/, `${sel} : la casse n’est pas dite`)
  /* la réglette et l'amorce sont faites des mêmes boîtes que le reste de la page */
  waits('.ry-ruler .ry-step', 'padding: var(--pad-3-block) var(--pad-3-inline)'); waits('.ry-ruler .ry-step', 'border-radius: var(--r-3)')
  /* la casse est dite sur sa ligne */
  assert.match(block('.ry-pf-line[data-intent="statement"]'), /casse|broken/)
  /* les mesures qui ne descendent pas de la chaîne sont dites, chacune sur SA ligne :
     la place du « ÷ √2 » entre deux boîtes de réglette, la mesure de la scène de densité */
  for (const sel of ['.ry-ruler']) assert.match(block(sel), /hors chaîne/, `${sel} : l’exception n’est pas dite`)
})

/* ── 3 · La densité recalcule sous les yeux ── */
test('3 · par le drawer, la densité change la base de la tranche et du silence — jamais les coins, jamais les colonnes', async () => {
  const W = 1440
  const { p, close } = await nav.page(URL(), { width: W })
  const measureIt = async () => ({
    slice: await calcPx(p, '#scale .slice', 'paddingTop'), corner: await calcPx(p, '#scale .slice', 'borderTopLeftRadius'),
    silence: await calcPx(p, '#density.gdoc-sec', 'paddingTop'),
    rail: parseFloat((await calc(p, '.gdoc', 'gridTemplateColumns')).split(' ')[0]), gutter: await calcPx(p, '.gdoc', 'columnGap'), margin: await calcPx(p, '.gdoc', 'paddingLeft'),
  })
  const wait = (density) => ({
    slice: expected('pad-1-block', W, DENSITIES[density]), corner: expected('r-1', W), silence: expected('doc-silence', W, DENSITIES[density]),
    rail: expected('doc-rail', W), gutter: expected('doc-gutter', W), margin: expected('doc-margin', W),
  })
  const verify = async (density) => {
    const m = await measureIt(), a = wait(density)
    for (const k of Object.keys(a)) ok(m[k], a[k], `${density} — ${k}`)
  }
  await verify('comfortable')
  list([wait('compact').silence, wait('comfortable').silence, wait('airy').silence].map((v) => v / expected('page-4-block', W) * 96), [64, 96, 128], 'le silence, 64 · 96 · 128 à la base')
  for (const density of ['compact', 'airy', 'comfortable']) {
    await p.locator('button.drawer-handle').click()
    await p.locator(`[data-choice-density="${density}"]`).click()
    await p.keyboard.press('Escape')
    await p.waitForFunction((d) => (document.documentElement.dataset.density ?? 'comfortable') === d, density)
    await p.waitForTimeout(100)
    assert.equal(await p.evaluate(() => document.documentElement.dataset.density ?? 'comfortable'), density)
    await verify(density)
  }
  await close()
})
/* La preuve 02 déclare SA densité, entière : posée dans un site réglé
   autrement, elle rend quand même ce que sa légende annonce. Et la légende
   dit les bornes que le moteur produit pour CETTE base — jamais un chiffre
   recopié. */
test('3 · la scène de la preuve 02 suit ses DEUX réglages — la densité qu’elle annonce et la largeur simulée du cadre', async () => {
  const W = 1440
  const STEPS = [['.ry-sd', 'paddingTop', 'pad-1-block'], ['.ry-sd', 'paddingLeft', 'pad-1-inline'], ['.ry-sd', 'rowGap', 'gap-1-block'],
                 ['.ry-sd-card', 'paddingTop', 'pad-2-block'], ['.ry-sd-card', 'rowGap', 'gap-2-block'],
                 ['.ry-sd-line', 'paddingTop', 'pad-3-block'], ['.ry-sd-line', 'paddingLeft', 'pad-3-inline'],
                 ['.ry-sd-lines', 'rowGap', 'gap-3-block']]
  /* la largeur que le cadre SIMULE — c'est elle qui règle la chaîne de la scène,
     pas la fenêtre : c'est tout le propos de la poignée */
  const simulated = async (p) => numbers(await text(p, '#density .bullet-w'))[0]
  for (const site of DENSITIES_SITE) {
    const { p, close } = await nav.page(URL(), { width: W, density: site })
    const buttons = p.locator('#density .demo-bar .button')
    assert.equal(await buttons.count(), 3, 'trois densités au choix')
    for (const [i, d] of ['airy', 'comfortable', 'compact'].entries()) {
      await buttons.nth(i).click()
      await p.waitForTimeout(120)
      assert.equal(await p.getAttribute('#density .ry-sd', 'data-density'), d, `${site} — la scène déclare ${d}`)
      const S = await simulated(p)
      for (const [sel, prop, token] of STEPS)
        ok(await calcPx(p, `#density ${sel}`, prop), expected(token, S, DENSITIES[d]), `site ${site} · scène ${d} à ${S} px — ${sel} ${prop}`)
      /* la légende dit la largeur simulée et les trois marges qu'on voit */
      const says = numbers(await text(p, '#density .demo-caption'))
      list(says, [S, ...['pad-1-block', 'pad-2-block', 'pad-3-block'].map((n) => rounded(expected(n, S, DENSITIES[d])))], `site ${site} · scène ${d} — la légende`)
      /* les coins, eux, ne bougent d'aucun des deux réglages */
      ok(await calcPx(p, '#density .ry-sd', 'borderTopLeftRadius'), expected('r-1', W), `site ${site} · scène ${d} — le coin ne suit pas la densité`)
    }
    /* la poignée : on la pousse au plus étroit, et toute la chaîne descend */
    const before = await calcPx(p, '#density .ry-sd', 'paddingTop')
    await p.locator('#density .handle').focus()
    await p.keyboard.press('Home')
    await p.waitForTimeout(200)
    const S = await simulated(p)
    assert.ok(S < 400, `la poignée est allée au plus étroit : ${S} px`)
    const after = await calcPx(p, '#density .ry-sd', 'paddingTop')
    ok(after, expected('pad-1-block', S, DENSITIES.compact), `à ${S} px simulés — la marge de la coque`)
    assert.ok(after < before, `la chaîne a suivi la poignée : ${before} → ${after}`)
    await close()
  }
})

/* Les trois arcs de la preuve 03 sont tracés AU VRAI RAYON du registre : c'est
   tout leur propos — on doit voir le coin se plier en deux d'un niveau au
   suivant. Cassée, la ligne prend deux fois le coin de sa carte. */
test('3 · les trois arcs de la profondeur valent les coins du registre, et la casse double celui de la ligne', async () => {
  const W = 1440
  const { p, close } = await nav.page(URL(), { width: W })
  const radii = () => p.evaluate(() => [...document.querySelectorAll('#depth .ry-pf-side path')]
    .map((e) => { const d = e.getAttribute('d'); return parseFloat(d.slice(d.indexOf(' A ') + 3)) }))
  list(await radii(), [FOUNDATION.r[0], FOUNDATION.r[1], FOUNDATION.r[2]], 'les trois arcs, au vrai rayon', TOL)
  ok(await calcPx(p, '#depth .ry-pf-line', 'borderTopLeftRadius'), expected('r-3', W), 'la ligne, au repos')
  await p.locator('#depth .demo-go').click()
  await p.waitForTimeout(600)
  assert.equal(await p.getAttribute('#depth .ry-pf-line', 'data-intent'), 'statement')
  assert.equal(await p.locator('#depth .demo-single.bad').count(), 1, 'le verdict bascule avec la scène')
  ok(await calcPx(p, '#depth .ry-pf-line', 'borderTopLeftRadius'), 2 * expected('r-2', W), 'cassée : deux fois le coin de sa carte')
  list(await radii(), [FOUNDATION.r[0], FOUNDATION.r[1], FOUNDATION.r[1] * 2], 'cassée : le troisième arc dépasse le deuxième', TOL)
  await p.locator('#depth .demo-go').click()
  await p.waitForTimeout(600)
  ok(await calcPx(p, '#depth .ry-pf-line', 'borderTopLeftRadius'), expected('r-3', W), 'réparée')
  await close()
})

/* La page obéit à la règle 2 sur ELLE-MÊME : pour chaque section, l'espace
   AU-DESSUS du titre (le silence) dépasse celui d'AU-DESSOUS (la tête). Un
   titre équidistant flotte — c'est exactement la faute que la page documente. */
test('4 · chaque titre de section appartient à ce qu’il ouvre : le silence au-dessus dépasse la tête au-dessous', async () => {
  for (const W of WIDTHS) {
    const { p, close } = await nav.page(URL(), { width: W })
    const ids = ['scale', 'density', 'headings', 'registry', 'code']
    for (const id of ids) {
      const above = await calcPx(p, `#${id}.gdoc-sec`, 'paddingTop')
      const below = await calcPx(p, `#${id} .gdoc-body`, 'marginTop')
      ok(above, expected('doc-silence', W), `${W} px — #${id} : le silence au-dessus`)
      ok(below, expected('doc-head', W), `${W} px — #${id} : la tête au-dessous`)
      assert.ok(above > below, `#${id} : le titre flotte — ${above} au-dessus, ${below} at-below`)
    }
    await close()
  }
})

/* ── 5 · Le tertiaire suit C17 ── */
test('5 · dans les deux thèmes, tout tertiaire rendu porte 600 au moins, au cran étiquette au moins, jamais un paragraphe lu', async () => {
  for (const theme of ['light', 'dark']) {
    const { p, close } = await nav.page(URL(), { width: 1440, theme })
    assert.equal(await p.getAttribute('html', 'data-theme'), theme)
    const f = await faultsC17(p, theme, 1440)
    assert.deepEqual(f, [], `${theme} : ${f.length} faute(s)`)
    /* et il y en a : le kicker, les étiquettes de densité, les fiches du vocabulaire, les légendes */
    const howmany = await p.evaluate((t) => [...document.querySelectorAll('main *')].filter((e) => getComputedStyle(e).color === t).length, rgb(inks(theme)['text-tertiary']))
    assert.ok(howmany >= 10, `${theme} : ${howmany} emplois du tertiaire`)
    await close()
  }
})

/* ── 6 · Rien en dur ── */
test('6 · dans les corps de sections, chaque marge, espace et coin calculé est une valeur du moteur à cette largeur (casses déclarées exceptées) ; la page ne déborde jamais de l’écran', async () => {
  /* Le balayage lit les DÉCLARATIONS de la feuille, comme ceux de /couleur, /typo
     et /arrondis : une mesure qui ne descend pas de la chaîne est admise si — et
     seulement si — sa ligne le dit. Ce que la page perd ici en balayage, elle le
     rend plus haut : chacun des sélecteurs ainsi dispensés est mesuré nommément,
     token par token, dans l'épreuve 2. */
  const css = fs.readFileSync(path.join(KIT, 'app/rythme/rhythm.css'), 'utf8')
  const global = fs.readFileSync(path.join(KIT, 'app/globals.css'), 'utf8')
  const exclusions = ['padding', 'padding-inline', 'padding-block', 'padding-inline-end', 'gap', 'row-gap', 'column-gap', 'border-radius', 'margin']
    .flatMap((prop) => [...selectorsDeclaredAll(css, prop), ...selectorsDeclaredAll(global, prop), ...selectorsInEm(css, prop), ...selectorsInEm(global, prop)])
  for (const W of WIDTHS) {
    const { p, close, errors } = await nav.page(URL(), { width: W })
    /* chaque bande porte son propre dépliant : on les ouvre tous, d'un coup */
    await p.evaluate(() => document.querySelectorAll('details.prov').forEach((d) => { d.open = true }))
    await p.waitForTimeout(120)
    /* La scène de la preuve 02 est réglée sur la largeur SIMULÉE par le cadre,
       pas sur celle de la fenêtre : ses marges sont bien des valeurs du moteur,
       mais à une autre largeur. Elle est mesurée nommément, token par token, dans
       son épreuve (3 · les deux réglages) — elle sort donc de ce balayage-ci. */
    const f = await faultsInHard(p, W, DENSITIES.comfortable, { exclusions: [...exclusions, '.ry-sd', '.ry-sd *'] })
    assert.deepEqual(f, [], `${W} px : ${f.length} valeur(s) hors moteur`)
    assert.deepEqual(errors, [], 'la page ne jette aucune erreur')
    assert.equal(await overflow(p), 0, `${W} px : la page déborde de l'écran`)
    await close()
  }
})
test('6 · dans la vue, tout style posé en ligne est un token ou une valeur du moteur, ou sa ligne dit « hors chaîne »', () => {
  const src = fs.readFileSync(path.join(KIT, 'app/rythme/view.tsx'), 'utf8')
  const faults = []
  src.split('\n').forEach((l, i) => {
    for (const m of l.matchAll(/style=\{([^}]*\}?)/g)) {
      const s = m[1]
      if (/var\(|vars\b|\$\{/.test(s) || /hors chaîne/.test(l)) continue
      faults.push(`vue.tsx:${i + 1} ${s}`)
    }
  })
  assert.deepEqual(faults, [])
})

/* ── 8 · L'écriture et le répertoire (8 septembre 2026, soir) ──
   La chaîne et la profondeur sont fondues en une preuve, la descente (#echelle
   garde la tranche, #profondeur le schéma des trois étages, dans la même
   section) ; la queue commune a disparu ; UN répertoire (#registre) range les
   tokens et leur correspondance (#code), six bandes (#bandes, en h4) et la
   liste (#liste). */
test('8 · l’écriture : aucun mot qui commande ou décrit, pas d’histoire de page, pas de pied, un seul répertoire au titre de la page, aucun saut de niveau ; la descente porte la tranche et les trois étages ; six bandes en h4, la liste, la correspondance', async () => {
  const { p, close } = await nav.page(URL(), { width: 1440 })
  assert.deepEqual(await faultsWriting(p), [])
  assert.equal(await p.locator('main .gdoc-sec').count(), 6, 'quatre preuves, un répertoire, le code')
  assert.equal(await p.locator('#scale .slice').count() + await p.locator('#scale #depth .ry-pf').count(), 2, 'la descente : la tranche et les trois étages, dans la même preuve')
  assert.equal(await p.locator('#registry #bands h4.doc-band-name').count(), 6, 'six bandes, en h4 sous leur sous-titre')
  assert.ok(await p.locator('#registry #list .doc-list tbody tr').count() >= 1, 'la liste')
  assert.ok(await p.locator('#code .doc-code tbody tr').count() >= 1, 'les tokens')
  assert.equal(await p.locator('#registry .doc-piece-head h3').count(), 2, 'deux pièces')
  await close()
})
