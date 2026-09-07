/* LE CRASH-TEST DE LA PAGE RYTHME — kit/epreuves/rythme.test.mjs
   Ce qui doit être vrai à l'écran, mesuré sans l'œil (plan validé par
   l'Auteur le 26 août 2026) :
   1 · chaque chiffre affiché sort du moteur ;
   2 · chaque preuve est rendue par son propre jeton ;
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
import { chaine, jetons, INTENTIONS, DENSITES, AXES, LARGEUR_MIN, LARGEUR_MAX } from '../derivation.mjs'
import { KIT, LARGEURS, DENSITES_SITE, TOL, ouvrirSite, ouvrirNavigateur, attendu, proche, nombres, calcPx, calc, texte, textes, fautesC17, fautesEnDur, selecteursDeclares, selecteursEnEm, debord, rgb, encres } from './banc.mjs'

const SOCLE = chaine(), J = jetons(SOCLE)
const ok = (a, b, msg, tol = TOL) => assert.ok(a !== null && proche(a, b, tol), `${msg} : ${a} attendu ${b}`)
const liste = (a, b, msg, tol = 0.051) => { assert.equal(a.length, b.length, `${msg} : ${a.length} nombres, ${b.length} attendus (${a} / ${b})`); a.forEach((v, i) => ok(v, b[i], `${msg} [${i}]`, tol)) }
const grille4 = (v) => Math.round(v / 4) * 4
/* l'écriture des pages : un chiffre après la virgule */
const arrondi = (v) => Math.round(v * 10) / 10

let site, nav
before(async () => { site = await ouvrirSite(); nav = await ouvrirNavigateur() })
after(async () => { await nav?.fermer(); site?.fermer() })
const URL = () => site.url + '/rythme'

/* ── 1 · Chaque chiffre affiché sort du moteur ── */
test('1 · la table de correspondance (dépliant de 08) est le registre ligne à ligne : charte, bornes, grille de 4, CSS', async () => {
  const { p, fermer } = await nav.page(URL())
  await p.locator('#code details.prov summary').click()
  const rangs = await p.evaluate(() => [...document.querySelectorAll('#code details.prov table tbody tr')].map((tr) => [...tr.children].map((td) => td.textContent)))
  const noms = Object.keys(J).filter((n) => /^(pad|gap|edge|page)-/.test(n))
  assert.deepEqual(rangs.map((r) => r[0]), noms.map((n) => `--${n}`))
  for (const [nom, base, bornes, tw, css] of rangs) {
    const t = J[nom.slice(2)]
    liste(nombres(base), [arrondi(t.base)], `${nom} charte`)
    liste(nombres(bornes), [t.bas, t.haut].map(arrondi), `${nom} bornes`)
    liste(nombres(tw), [grille4(t.bas), grille4(t.haut)], `${nom} grille de 4`)
    assert.equal(css, t.css, `${nom} CSS`)
  }
  const tete = await texte(p, '#code details.prov table thead')
  assert.ok(tete.includes(`${LARGEUR_MIN} → ${LARGEUR_MAX}`))
  await fermer()
})
test('1 · dans la vue, aucun nombre en pixels n’est écrit à la main hors d’une ligne « hors chaîne »', () => {
  const src = fs.readFileSync(path.join(KIT, 'app/rythme/vue.tsx'), 'utf8')
  const fautes = []
  src.split('\n').forEach((l, i) => {
    if (/^\s*(\/\/|\/\*|\*)/.test(l) || /hors chaîne/.test(l)) return
    if (/(^|[^a-zA-Z_(])\d+([.,]\d+)? ?px\b/.test(l)) fautes.push(`vue.tsx:${i + 1} ${l.trim()}`)
  })
  assert.deepEqual(fautes, [])
})

/* ── 2 · Chaque preuve est rendue par son propre jeton — mesuré aux trois largeurs ── */
const PREUVES = [
  /* [sélecteur, propriété calculée, jeton] — la tranche Fili : coque → carte → ligne */
  ['#echelle .tranche', 'paddingTop', 'pad-1-block'], ['#echelle .tranche', 'paddingLeft', 'pad-1-inline'],
  ['#echelle .tranche', 'borderTopLeftRadius', 'r-1'], ['#echelle .tranche', 'columnGap', 'gap-1-inline'],
  /* la marge du panneau est tracée par quatre bandes posées sur son bord (31 août) :
     elles doivent valoir EXACTEMENT le rembourrage qu'elles montrent, sinon la scène ment */
  ['#echelle .ry-marge1 .haut', 'height', 'pad-1-block'], ['#echelle .ry-marge1 .bas', 'height', 'pad-1-block'],
  ['#echelle .ry-marge1 .gauche', 'width', 'pad-1-inline'], ['#echelle .ry-marge1 .droite', 'width', 'pad-1-inline'],
  ['#echelle .tr-carte', 'borderTopLeftRadius', 'r-2'],
  /* la carte est une rangée (1er septembre) : ses deux colonnes de marge sont ses enfants
     directs, ses marges hautes et basses et ses espaces vivent dans son dedans */
  ['#echelle .tr-carte > .espace.pad.h', 'width', 'pad-2-inline'],
  ['#echelle .tr-carte-corps > .espace.pad', 'height', 'pad-2-block'],
  ['#echelle .tr-carte-corps > .espace.gap', 'height', 'gap-2-block'],
  ['#echelle .tr-carte-corps .espace.gap.h', 'width', 'gap-3-inline'],
  ['#echelle .tr-sub', 'paddingTop', 'pad-3-block'], ['#echelle .tr-sub', 'paddingLeft', 'pad-3-inline'],
  ['#echelle .tr-sub', 'borderTopLeftRadius', 'r-3'],
  ['#echelle .tr-btn', 'borderTopLeftRadius', 'r-ctl'], ['#echelle .tr-btn', 'minHeight', 'control-height'],
  /* une entrée de menu est un CONTRÔLE, pas une ligne de texte (31 août) : sa hauteur est
     la cible compacte, sa marge est horizontale seule — et le menu se serre au plus serré */
  ['#echelle .tr-item', 'borderTopLeftRadius', 'r-3'], ['#echelle .tr-item', 'paddingLeft', 'pad-3-inline'],
  ['#echelle .tr-item', 'minHeight', 'control-height-compact'], ['#echelle .tr-nav', 'rowGap', 'gap-4-block'],
  /* la réglette est une légende faite de vraies boîtes de ligne */
  ['#echelle .ry-reglette .ry-cran', 'paddingTop', 'pad-3-block'], ['#echelle .ry-reglette .ry-cran', 'paddingLeft', 'pad-3-inline'],
  ['#echelle .ry-reglette .ry-cran', 'borderTopLeftRadius', 'r-3'], ['#echelle .ry-reglette .ry-cran', 'rowGap', 'gap-4-block'],
  /* l'amorce : sa carte est une carte, ses échantillons se tiennent au plus serré */
  /* la paire est une grille : les deux échantillons et la question sur les mêmes rangs (1er septembre) */
  /* la profondeur : coque, carte, ligne, et le bouton au coin de la ligne */
  /* 03 · la profondeur : la coque, sa carte, ses lignes, son bouton */
  ['#profondeur .ry-pf', 'borderTopLeftRadius', 'r-1'], ['#profondeur .ry-pf', 'paddingTop', 'pad-1-block'],
  ['#profondeur .ry-pf', 'rowGap', 'gap-1-block'],
  ['#profondeur .ry-pf-carte', 'borderTopLeftRadius', 'r-2'], ['#profondeur .ry-pf-carte', 'paddingLeft', 'pad-2-inline'],
  ['#profondeur .ry-pf-carte', 'rowGap', 'gap-2-block'],
  ['#profondeur .ry-pf-ligne', 'borderTopLeftRadius', 'r-3'], ['#profondeur .ry-pf-ligne', 'paddingTop', 'pad-3-block'],
  ['#profondeur .ry-pf-ligne', 'columnGap', 'gap-3-inline'],
  ['#profondeur .ry-pf-btn', 'borderTopLeftRadius', 'r-ctl'], ['#profondeur .ry-pf-btn', 'minHeight', 'control-height'],
  /* la proximité, au repos : entre cartes au-dessus du titre, dans la ligne sous le titre et sous le libellé */
  ['#bandes .ry-prox-carte', 'borderTopLeftRadius', 'r-2'], ['#bandes .ry-prox-carte', 'paddingTop', 'pad-2-block'],
  ['#bandes .ry-champ', 'borderTopLeftRadius', 'r-ctl'], ['#bandes .ry-champ', 'minHeight', 'control-height'],
  /* la densité et le vocabulaire consomment ce qu'ils nomment */
  /* 02 · les COINS de la scène de densité : eux ne bougent ni avec la densité,
     ni avec la largeur — c'est la moitié de ce que la preuve affirme. Ses marges
     et ses espaces suivent la largeur SIMULÉE du cadre : ils sont mesurés dans
     leur propre épreuve, plus bas. */
  ['#densite .ry-sd', 'borderTopLeftRadius', 'r-1'],
  ['#densite .ry-sd-carte', 'borderTopLeftRadius', 'r-2'],
  ['#densite .ry-sd-ligne', 'borderTopLeftRadius', 'r-3'],
  /* les fiches de l'étage « en colonnes » : le filet, la vignette, la commande */
  /* les scènes des bandes : deux sœurs, l'escalier des rapports, la carte en rem, la cible */
  ['#bandes .ry-fr-coque', 'paddingTop', 'pad-1-block'], ['#bandes .ry-fr-coque', 'borderTopLeftRadius', 'r-1'],
  ['#bandes .ry-fr-carte', 'borderTopLeftRadius', 'r-2'], ['#bandes .ry-fr-dit', 'paddingTop', 'pad-2-block'],
  ['#bandes .ry-rap-crans', 'rowGap', 'gap-3-block'], ['#bandes .ry-rap-cran', 'columnGap', 'gap-3-inline'],
  ['#bandes .ry-rem-carte', 'paddingTop', 'pad-2-block'], ['#bandes .ry-rem-carte', 'borderTopLeftRadius', 'r-2'],
  ['#bandes .ry-cible-btn', 'minHeight', 'control-height'], ['#bandes .ry-cible-btn', 'borderTopLeftRadius', 'r-ctl'],
  ['#bandes .ry-cible-jauge', 'minHeight', 'control-height'],
  /* l'étage « en bandes » : la parole à gauche, la scène à droite, la commande sous la phrase */
  ['#bandes .doc-bande', 'paddingTop', 'pad-1-block'],
  ['#bandes .doc-bande-dire', 'rowGap', 'gap-2-block'],
  /* la scène pleine : la variante « nue » s'efface, elle n'a ni fond ni marge — c'est son propos */
  ['#bandes .doc-scene:not(.nue)', 'borderTopLeftRadius', 'r-2'], ['#bandes .doc-scene:not(.nue)', 'paddingTop', 'pad-2-block'],
  ['#bandes .doc-casser', 'borderTopLeftRadius', 'r-3'], ['#bandes .doc-casser', 'minHeight', 'control-height-compact'],
  /* l'étage « dans le code » : le panneau et sa table */
  ['#code .doc-panneau', 'borderTopLeftRadius', 'r-1'], ['#code .doc-panneau', 'paddingTop', 'pad-1-block'],
  ['#code .doc-deplier', 'borderTopLeftRadius', 'r-ctl'], ['#code .doc-deplier', 'minHeight', 'control-height'],
]
/* Les quatre crans de la réglette, dans l'ordre où elle les pose : le jeton
   qu'elle DESSINE, et la valeur de charte qu'elle ÉCRIT à côté. */
const CRANS_REGLETTE = [
  ['pad-1-block', (s) => s.pad[0]], ['pad-2-block', (s) => s.pad[1]],
  ['gap-2-block', (s) => s.gap[1]], ['gap-3-inline', (s) => s.gap[2]],
]
test('2 · la tranche, la profondeur, la proximité, la densité et le vocabulaire sont rendus par leur jeton, aux trois largeurs', async () => {
  for (const W of LARGEURS) {
    const { p, fermer } = await nav.page(URL(), { largeur: W })
    for (const [sel, prop, jeton] of PREUVES) ok(await calcPx(p, sel, prop), attendu(jeton, W), `${W} px — ${sel} ${prop} = --${jeton}`)
    /* le chiffre et sa légende (2 septembre, retour d'Auteur) : un COUPLE typographique, pas
       deux voisins — aucun espace entre eux, c'est l'interligne du chiffre qui fait le travail */
    const couple = await p.evaluate(() => { const c = document.querySelector('#echelle .tr-sub'), b = c.querySelector('b'), cs = getComputedStyle(b)
      return [parseFloat(getComputedStyle(c).rowGap), parseFloat(cs.lineHeight) / parseFloat(cs.fontSize), parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--leading-heading'))] })
    assert.equal(couple[0], 0, `${W} px — le chiffre et sa légende n'ont pas d'espace entre eux`)
    ok(couple[1], couple[2], `${W} px — c'est l'interligne de titre qui les tient`, 0.01)
    /* la réglette (31 août) : quatre crans DESSINÉS à leur vraie longueur — c'est
       tout son propos, et c'est la seule preuve de la page qu'on peut fausser sans
       que rien ne se voie. Chaque barre vaut son jeton à cette largeur ; le nombre
       écrit à côté est la valeur de charte, comme partout ailleurs sur la page. */
    const barres = await p.evaluate(() => [...document.querySelectorAll('#echelle .ry-cran-barre')].map((b) => parseFloat(getComputedStyle(b).width)))
    liste(barres, CRANS_REGLETTE.map(([j]) => attendu(j, W)), `${W} px — la réglette à la vraie longueur`, TOL)
    liste((await textes(p, '#echelle .ry-reglette .ry-cran b')).flatMap(nombres), CRANS_REGLETTE.map(([, v]) => arrondi(v(SOCLE))), `${W} px — la réglette dit sa charte`)
    /* côte à côte, son écart vertical est un jeton du kit ; empilée (sous 56 rem), elle porte
       le « ÷ √2 » entre deux boîtes des deux côtés — c'est la seule mesure d'atelier de la page,
       et elle est dite sur sa ligne */
    const pas = await p.evaluate(() => { const cs = getComputedStyle(document.querySelector('#echelle .ry-reglette')); return [parseFloat(cs.rowGap), parseFloat(cs.columnGap)] })
    ok(pas[0], W >= 56 * 16 ? attendu('gap-1-block', W) : pas[1], `${W} px — l’écart vertical de la réglette`)
    /* la bande se replie sous 62 rem : la scène passe sous la parole, et l'écart
       des colonnes devient l'écart des rangs — les deux sont des jetons */
    ok(await calcPx(p, '#bandes .doc-bande', W >= 62 * 16 ? 'columnGap' : 'rowGap'),
       attendu(W >= 62 * 16 ? 'doc-gouttiere' : 'gap-1-block', W), `${W} px — l’écart de la bande`)
    /* la règle 1, mesurée pour elle-même : l'écart entre deux sœurs EST leur marge,
       au même pixel — c'est le même chiffre, pas deux réglages qui se ressemblent */
    const soeurs = await p.evaluate(() => {
      const c = document.querySelector('#bandes .ry-fr-coque')
      return [parseFloat(getComputedStyle(c.querySelector(':scope > .espace.h')).width),
              parseFloat(getComputedStyle(c.querySelector('.ry-fr-carte > .espace.h')).width)]
    })
    ok(soeurs[0], soeurs[1], `${W} px — l’écart entre sœurs = leur marge`)
    ok(soeurs[0], attendu('gap-1-inline', W), `${W} px — et c’est le jeton de l’espace entre frères`)
    /* l'escalier des rapports : quatre barres à leur vraie longueur, celles du registre */
    const barresRap = await p.evaluate(() => [...document.querySelectorAll('#bandes .ry-rap-barre')].map((b) => parseFloat(getComputedStyle(b).width)))
    liste(barresRap, [SOCLE.pad[0], SOCLE.pad[1], SOCLE.pad[2], SOCLE.gap[2]], `${W} px — l’escalier des rapports`, TOL)
    /* la proximité : les quatre écarts de la carte, au repos */
    const ecarts = await p.evaluate(() => [...document.querySelectorAll('#bandes .ry-prox-carte .espace')].map((e) => parseFloat(getComputedStyle(e).height)))
    liste(ecarts, ['gap-1-block', 'gap-3-block', 'gap-1-block', 'gap-3-block'].map((n) => attendu(n, W)), `${W} px — proximité au repos`, TOL)
    await fermer()
  }
})
test('2 · les casses sont rendues par le jeton menteur, déclarées (data-intent="statement") — et la ligne cassée est deux fois plus ronde que sa carte', async () => {
  const W = 1440
  const { p, fermer } = await nav.page(URL(), { largeur: W })
  /* la profondeur */
  /* Chaque commande est désignée par LA SCÈNE de sa bande : l'épreuve ne
     dépend plus de l'ordre des bandes dans la section. Les scènes glissent
     en 0,3 s : on lit après le mouvement, jamais pendant. */
  const basculer = async (scene) => { await p.locator(`#bandes .doc-bande:has(${scene}) .doc-casser`).click(); await p.waitForTimeout(600) }

  /* y1 · l'écart entre deux sœurs tombe sous leur marge */
  const ecartSoeurs = () => calcPx(p, '#bandes .ry-fr-coque > .espace.h', 'width')
  const margeSoeurs = () => calcPx(p, '#bandes .ry-fr-carte > .espace.h', 'width')
  await basculer('.ry-fr-coque')
  assert.equal(await p.getAttribute('#bandes .ry-fr-coque > .espace.h', 'data-intent'), 'statement')
  ok(await ecartSoeurs(), attendu('gap-3-inline', W), 'sœurs cassées : l’écart tombe sous la marge')
  await basculer('.ry-fr-coque')
  ok(await ecartSoeurs(), await margeSoeurs(), 'sœurs réparées : l’écart vaut la marge')

  /* y12 · la chaîne construite en retranchant : quatre longueurs jumelles */
  await basculer('.ry-rap')
  const barres = await p.evaluate(() => [...document.querySelectorAll('#bandes .ry-rap-barre')].map((b) => parseFloat(getComputedStyle(b).width)))
  liste(barres, [0, 1, 2, 3].map((i) => SOCLE.pad[0] - 4 * i), 'rapports cassés : on retire 4 px à chaque pas', TOL)
  await basculer('.ry-rap')

  /* y9 · au repos les deux cartes se ressemblent ; le texte agrandi les sépare :
     la marge en jetons grandit avec lui, la marge en pixels ne bouge pas */
  const margesRem = () => p.evaluate(() => [...document.querySelectorAll('#bandes .ry-rem-carte')].map((e) => parseFloat(getComputedStyle(e).paddingTop)))
  const auRepos = await margesRem()
  ok(auRepos[0], attendu('pad-2-block', W), 'au repos : la carte en jetons porte la marge du registre')
  ok(auRepos[1], 16, 'au repos : la carte en pixels porte 16')
  await basculer('.ry-rem')
  const agrandi = await margesRem()
  assert.ok(agrandi[0] > auRepos[0] + 1, `texte agrandi : la marge en jetons a suivi (${auRepos[0]} → ${agrandi[0]})`)
  ok(agrandi[1], 16, 'texte agrandi : la marge en pixels n’a pas bougé')
  await basculer('.ry-rem')

  /* y17 · la commande passe sous le plancher de la cible */
  await basculer('.ry-cible')
  ok(await calcPx(p, '#bandes .ry-cible-btn', 'minHeight'), 36, 'cible cassée : sous le plancher')
  await basculer('.ry-cible')
  ok(await calcPx(p, '#bandes .ry-cible-btn', 'minHeight'), attendu('control-height', W), 'cible réparée : la hauteur due')
  /* la proximité : le titre, puis le libellé */
  const ecarts = () => p.evaluate(() => [...document.querySelectorAll('#bandes .ry-prox-carte .espace')].map((e) => [parseFloat(getComputedStyle(e).height), e.dataset.intent ?? null]))
  /* deux fiches, deux commandes : la deuxième casse le libellé, la troisième le titre.
     Dans l'ordre du document, la carte du libellé vient avant celle du titre. */
  await basculer('.ry-prox-carte .ry-h3')
  let e = await ecarts()
  liste(e.map((x) => x[0]), ['gap-1-block', 'gap-3-block', 'gap-2-block', 'gap-2-block'].map((n) => attendu(n, W)), 'titre cassé : le même écart des deux côtés', TOL)
  assert.deepEqual(e.map((x) => x[1]), [null, null, 'statement', 'statement'])
  await basculer('.ry-prox-carte .ry-h3')
  await basculer('.ry-champ')
  e = await ecarts()
  liste(e.map((x) => x[0]), ['gap-1-block', 'gap-1-block', 'gap-1-block', 'gap-3-block'].map((n) => attendu(n, W)), 'libellé cassé : aussi loin de son champ que de ce qui précède', TOL)
  assert.deepEqual(e.map((x) => x[1]), ['statement', 'statement', null, null])
  await fermer()
})
test('2 · la feuille de la page consomme, pour chaque preuve, le jeton qu’elle nomme', () => {
  const css = fs.readFileSync(path.join(KIT, 'app/rythme/rythme.css'), 'utf8')
  const bloc = (sel) => { const i = css.indexOf(`\n${sel} {`); assert.ok(i >= 0, `sélecteur absent : ${sel}`); return css.slice(i, css.indexOf('}', i)) }
  const attend = (sel, decl) => assert.ok(bloc(sel).includes(decl), `${sel} : « ${decl} » attendu`)
  attend('.tranche', 'padding: var(--pad-1-block) var(--pad-1-inline)'); attend('.tranche', 'border-radius: var(--r-1)'); attend('.tranche', 'gap: var(--gap-1-inline)')
  attend('.tr-carte', 'border-radius: var(--r-2)'); attend('.tr-sub', 'padding: var(--pad-3-block) var(--pad-3-inline)'); attend('.tr-sub', 'border-radius: var(--r-3)')
  attend('.tr-btn', 'border-radius: var(--r-ctl)'); attend('.tr-btn', 'min-height: var(--control-height)')
  attend('.ry-pf', 'border-radius: var(--r-1)'); attend('.ry-pf-carte', 'border-radius: var(--r-2)'); attend('.ry-pf-ligne', 'border-radius: var(--r-3)')
  attend('.ry-prox-carte', 'padding: var(--pad-2-block) var(--pad-2-inline)')
  attend('.ry-sd', 'padding: var(--sd-p1) var(--sd-p1i)'); attend('.ry-sd', 'border-radius: var(--r-1)')
  attend('.ry-sd-carte', 'padding: var(--sd-p2) var(--sd-p2i)'); attend('.ry-sd-carte', 'border-radius: var(--r-2)')
  attend('.ry-sd-ligne', 'padding: var(--sd-p3) var(--sd-p3i)'); attend('.ry-sd-ligne', 'border-radius: var(--r-3)')
  attend('.ry-cible-btn', 'min-height: var(--control-height)')
  attend('.ry-fr-dit', 'padding-block: var(--pad-2-block)')
  /* les casses des bandes sont dites, chacune sur SA ligne */
  for (const sel of ['.ry-rem-carte.dur', '.ry-cible[data-intent="statement"] .ry-cible-btn'])
    assert.match(bloc(sel), /casse/, `${sel} : la casse n’est pas dite`)
  /* la réglette et l'amorce sont faites des mêmes boîtes que le reste de la page */
  attend('.ry-reglette .ry-cran', 'padding: var(--pad-3-block) var(--pad-3-inline)'); attend('.ry-reglette .ry-cran', 'border-radius: var(--r-3)')
  /* la casse est dite sur sa ligne */
  assert.match(bloc('.ry-pf-ligne[data-intent="statement"]'), /casse/)
  /* les mesures qui ne descendent pas de la chaîne sont dites, chacune sur SA ligne :
     la place du « ÷ √2 » entre deux boîtes de réglette, la mesure de la scène de densité */
  for (const sel of ['.ry-reglette']) assert.match(bloc(sel), /hors chaîne/, `${sel} : l’exception n’est pas dite`)
})

/* ── 3 · La densité recalcule sous les yeux ── */
test('3 · par le tiroir, la densité change la base de la tranche et du silence — jamais les coins, jamais les colonnes', async () => {
  const W = 1440
  const { p, fermer } = await nav.page(URL(), { largeur: W })
  const mesurer = async () => ({
    tranche: await calcPx(p, '#echelle .tranche', 'paddingTop'), coin: await calcPx(p, '#echelle .tranche', 'borderTopLeftRadius'),
    silence: await calcPx(p, '#densite.gdoc-sec', 'paddingTop'),
    rail: parseFloat((await calc(p, '.gdoc', 'gridTemplateColumns')).split(' ')[0]), gouttiere: await calcPx(p, '.gdoc', 'columnGap'), marge: await calcPx(p, '.gdoc', 'paddingLeft'),
  })
  const attendre = (densite) => ({
    tranche: attendu('pad-1-block', W, DENSITES[densite]), coin: attendu('r-1', W), silence: attendu('doc-silence', W, DENSITES[densite]),
    rail: attendu('doc-rail', W), gouttiere: attendu('doc-gouttiere', W), marge: attendu('doc-marge', W),
  })
  const verifier = async (densite) => {
    const m = await mesurer(), a = attendre(densite)
    for (const k of Object.keys(a)) ok(m[k], a[k], `${densite} — ${k}`)
  }
  await verifier('comfortable')
  liste([attendre('compact').silence, attendre('comfortable').silence, attendre('airy').silence].map((v) => v / attendu('page-4-block', W) * 96), [64, 96, 128], 'le silence, 64 · 96 · 128 à la base')
  for (const densite of ['compact', 'airy', 'comfortable']) {
    await p.locator('button.tiroir-poignee').click()
    await p.locator(`[data-choix-density="${densite}"]`).click()
    await p.keyboard.press('Escape')
    await p.waitForFunction((d) => (document.documentElement.dataset.density ?? 'comfortable') === d, densite)
    await p.waitForTimeout(100)
    assert.equal(await p.evaluate(() => document.documentElement.dataset.density ?? 'comfortable'), densite)
    await verifier(densite)
  }
  await fermer()
})
/* La preuve 02 déclare SA densité, entière : posée dans un site réglé
   autrement, elle rend quand même ce que sa légende annonce. Et la légende
   dit les bornes que le moteur produit pour CETTE base — jamais un chiffre
   recopié. */
test('3 · la scène de la preuve 02 suit ses DEUX réglages — la densité qu’elle annonce et la largeur simulée du cadre', async () => {
  const W = 1440
  const CRANS = [['.ry-sd', 'paddingTop', 'pad-1-block'], ['.ry-sd', 'paddingLeft', 'pad-1-inline'], ['.ry-sd', 'rowGap', 'gap-1-block'],
                 ['.ry-sd-carte', 'paddingTop', 'pad-2-block'], ['.ry-sd-carte', 'rowGap', 'gap-2-block'],
                 ['.ry-sd-ligne', 'paddingTop', 'pad-3-block'], ['.ry-sd-ligne', 'paddingLeft', 'pad-3-inline'],
                 ['.ry-sd-lignes', 'rowGap', 'gap-3-block']]
  /* la largeur que le cadre SIMULE — c'est elle qui règle la chaîne de la scène,
     pas la fenêtre : c'est tout le propos de la poignée */
  const simulee = async (p) => nombres(await texte(p, '#densite .puce-w'))[0]
  for (const site of DENSITES_SITE) {
    const { p, fermer } = await nav.page(URL(), { largeur: W, densite: site })
    const boutons = p.locator('#densite .apercu-outils .bouton')
    assert.equal(await boutons.count(), 3, 'trois densités au choix')
    for (const [i, d] of ['airy', 'comfortable', 'compact'].entries()) {
      await boutons.nth(i).click()
      await p.waitForTimeout(120)
      assert.equal(await p.getAttribute('#densite .ry-sd', 'data-densite'), d, `${site} — la scène déclare ${d}`)
      const S = await simulee(p)
      for (const [sel, prop, jeton] of CRANS)
        ok(await calcPx(p, `#densite ${sel}`, prop), attendu(jeton, S, DENSITES[d]), `site ${site} · scène ${d} à ${S} px — ${sel} ${prop}`)
      /* la légende dit la largeur simulée et les trois marges qu'on voit */
      const dit = nombres(await texte(p, '#densite .gd-legende'))
      liste(dit, [S, ...['pad-1-block', 'pad-2-block', 'pad-3-block'].map((n) => arrondi(attendu(n, S, DENSITES[d])))], `site ${site} · scène ${d} — la légende`)
      /* les coins, eux, ne bougent d'aucun des deux réglages */
      ok(await calcPx(p, '#densite .ry-sd', 'borderTopLeftRadius'), attendu('r-1', W), `site ${site} · scène ${d} — le coin ne suit pas la densité`)
    }
    /* la poignée : on la pousse au plus étroit, et toute la chaîne descend */
    const avant = await calcPx(p, '#densite .ry-sd', 'paddingTop')
    await p.locator('#densite .poignee').focus()
    await p.keyboard.press('Home')
    await p.waitForTimeout(200)
    const S = await simulee(p)
    assert.ok(S < 400, `la poignée est allée au plus étroit : ${S} px`)
    const apres = await calcPx(p, '#densite .ry-sd', 'paddingTop')
    ok(apres, attendu('pad-1-block', S, DENSITES.compact), `à ${S} px simulés — la marge de la coque`)
    assert.ok(apres < avant, `la chaîne a suivi la poignée : ${avant} → ${apres}`)
    await fermer()
  }
})

/* Les trois arcs de la preuve 03 sont tracés AU VRAI RAYON du registre : c'est
   tout leur propos — on doit voir le coin se plier en deux d'un niveau au
   suivant. Cassée, la ligne prend deux fois le coin de sa carte. */
test('3 · les trois arcs de la profondeur valent les coins du registre, et la casse double celui de la ligne', async () => {
  const W = 1440
  const { p, fermer } = await nav.page(URL(), { largeur: W })
  const rayons = () => p.evaluate(() => [...document.querySelectorAll('#profondeur .ry-pf-cote path')]
    .map((e) => { const d = e.getAttribute('d'); return parseFloat(d.slice(d.indexOf(' A ') + 3)) }))
  liste(await rayons(), [SOCLE.r[0], SOCLE.r[1], SOCLE.r[2]], 'les trois arcs, au vrai rayon', TOL)
  ok(await calcPx(p, '#profondeur .ry-pf-ligne', 'borderTopLeftRadius'), attendu('r-3', W), 'la ligne, au repos')
  await p.locator('#profondeur .bouton.casse').click()
  await p.waitForTimeout(600)
  assert.equal(await p.getAttribute('#profondeur .ry-pf-ligne', 'data-intent'), 'statement')
  ok(await calcPx(p, '#profondeur .ry-pf-ligne', 'borderTopLeftRadius'), 2 * attendu('r-2', W), 'cassée : deux fois le coin de sa carte')
  liste(await rayons(), [SOCLE.r[0], SOCLE.r[1], SOCLE.r[1] * 2], 'cassée : le troisième arc dépasse le deuxième', TOL)
  await p.locator('#profondeur .bouton.casse').click()
  await p.waitForTimeout(600)
  ok(await calcPx(p, '#profondeur .ry-pf-ligne', 'borderTopLeftRadius'), attendu('r-3', W), 'réparée')
  await fermer()
})

/* La page obéit à la règle 2 sur ELLE-MÊME : pour chaque section, l'espace
   AU-DESSUS du titre (le silence) dépasse celui d'AU-DESSOUS (la tête). Un
   titre équidistant flotte — c'est exactement la faute que la page documente. */
test('4 · chaque titre de section appartient à ce qu’il ouvre : le silence au-dessus dépasse la tête au-dessous', async () => {
  for (const W of LARGEURS) {
    const { p, fermer } = await nav.page(URL(), { largeur: W })
    const ids = ['echelle', 'densite', 'profondeur', 'bandes', 'liste', 'code']
    for (const id of ids) {
      const dessus = await calcPx(p, `#${id}.gdoc-sec`, 'paddingTop')
      const dessous = await calcPx(p, `#${id} .gdoc-corps`, 'marginTop')
      ok(dessus, attendu('doc-silence', W), `${W} px — #${id} : le silence au-dessus`)
      ok(dessous, attendu('doc-tete', W), `${W} px — #${id} : la tête au-dessous`)
      assert.ok(dessus > dessous, `#${id} : le titre flotte — ${dessus} au-dessus, ${dessous} au-dessous`)
    }
    await fermer()
  }
})

/* ── 5 · Le tertiaire suit C17 ── */
test('5 · dans les deux thèmes, tout tertiaire rendu porte 600 au moins, au cran étiquette au moins, jamais un paragraphe lu', async () => {
  for (const theme of ['light', 'dark']) {
    const { p, fermer } = await nav.page(URL(), { largeur: 1440, theme })
    assert.equal(await p.getAttribute('html', 'data-theme'), theme)
    const f = await fautesC17(p, theme, 1440)
    assert.deepEqual(f, [], `${theme} : ${f.length} faute(s)`)
    /* et il y en a : le kicker, les étiquettes de densité, les fiches du vocabulaire, les légendes */
    const combien = await p.evaluate((t) => [...document.querySelectorAll('main *')].filter((e) => getComputedStyle(e).color === t).length, rgb(encres(theme)['text-tertiary']))
    assert.ok(combien >= 10, `${theme} : ${combien} emplois du tertiaire`)
    await fermer()
  }
})

/* ── 6 · Rien en dur ── */
test('6 · dans les corps de sections, chaque marge, espace et coin calculé est une valeur du moteur à cette largeur (casses déclarées exceptées) ; la page ne déborde jamais de l’écran', async () => {
  /* Le balayage lit les DÉCLARATIONS de la feuille, comme ceux de /couleur, /typo
     et /arrondis : une mesure qui ne descend pas de la chaîne est admise si — et
     seulement si — sa ligne le dit. Ce que la page perd ici en balayage, elle le
     rend plus haut : chacun des sélecteurs ainsi dispensés est mesuré nommément,
     jeton par jeton, dans l'épreuve 2. */
  const css = fs.readFileSync(path.join(KIT, 'app/rythme/rythme.css'), 'utf8')
  const globales = fs.readFileSync(path.join(KIT, 'app/globals.css'), 'utf8')
  const exclusions = ['padding', 'padding-inline', 'padding-block', 'padding-inline-end', 'gap', 'row-gap', 'column-gap', 'border-radius', 'margin']
    .flatMap((prop) => [...selecteursDeclares(css, prop), ...selecteursDeclares(globales, prop), ...selecteursEnEm(css, prop), ...selecteursEnEm(globales, prop)])
  for (const W of LARGEURS) {
    const { p, fermer, erreurs } = await nav.page(URL(), { largeur: W })
    /* chaque bande porte son propre dépliant : on les ouvre tous, d'un coup */
    await p.evaluate(() => document.querySelectorAll('details.prov').forEach((d) => { d.open = true }))
    await p.waitForTimeout(120)
    /* La scène de la preuve 02 est réglée sur la largeur SIMULÉE par le cadre,
       pas sur celle de la fenêtre : ses marges sont bien des valeurs du moteur,
       mais à une autre largeur. Elle est mesurée nommément, jeton par jeton, dans
       son épreuve (3 · les deux réglages) — elle sort donc de ce balayage-ci. */
    const f = await fautesEnDur(p, W, DENSITES.comfortable, { exclusions: [...exclusions, '.ry-sd', '.ry-sd *'] })
    assert.deepEqual(f, [], `${W} px : ${f.length} valeur(s) hors moteur`)
    assert.deepEqual(erreurs, [], 'la page ne jette aucune erreur')
    assert.equal(await debord(p), 0, `${W} px : la page déborde de l'écran`)
    await fermer()
  }
})
test('6 · dans la vue, tout style posé en ligne est un jeton ou une valeur du moteur, ou sa ligne dit « hors chaîne »', () => {
  const src = fs.readFileSync(path.join(KIT, 'app/rythme/vue.tsx'), 'utf8')
  const fautes = []
  src.split('\n').forEach((l, i) => {
    for (const m of l.matchAll(/style=\{([^}]*\}?)/g)) {
      const s = m[1]
      if (/var\(|vars\b|\$\{/.test(s) || /hors chaîne/.test(l)) continue
      fautes.push(`vue.tsx:${i + 1} ${s}`)
    }
  })
  assert.deepEqual(fautes, [])
})
