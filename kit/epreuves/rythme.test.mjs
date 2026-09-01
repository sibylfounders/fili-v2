/* LE CRASH-TEST DE LA PAGE RYTHME — kit/epreuves/rythme.test.mjs
   Ce qui doit être vrai à l'écran, mesuré sans l'œil (plan validé par
   l'Auteur le 26 août 2026) :
   1 · chaque chiffre affiché sort du moteur ;
   2 · chaque preuve est rendue par son propre jeton ;
   3 · la densité recalcule sous les yeux ;
   4 · les titres glissent avec l'écran ;
   5 · le tertiaire suit C17 ;
   6 · rien en dur hors des lignes déclarées.

   Remise à niveau du 1er septembre 2026 : la page a changé les 31 août et
   1er septembre — le pied du laboratoire a perdu sa phrase-fleuve au profit
   de l'amorce « deux fois le même geste », la marge du panneau est devenue
   un anneau de quatre bandes, la carte de la tranche est devenue une rangée,
   le menu est devenu un contrôle, et la réglette de la chaîne est arrivée
   sous la scène. Les épreuves disent maintenant CE QUE LA PAGE PROUVE
   AUJOURD'HUI — aucune n'a été relâchée pour passer : ce qui n'était plus
   mesurable a été remplacé par une mesure plus dure au même endroit.       */
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
/* Le pied du laboratoire ne porte plus onze nombres (1er septembre) : il ne
   dit que la garantie que le moteur a dû appliquer. La démonstration, elle,
   est passée dans l'amorce — quatre échantillons d'espace RENDUS À LEUR
   TAILLE RÉELLE. C'est plus dur à tenir qu'une phrase de chiffres : la scène
   elle-même doit mesurer ce que le moteur produit, au dixième de pixel. */
const INTENTIONS_SEL = '#decisions .gdoc-corps > .rang .bouton'
test('1 · l’amorce du laboratoire rend, pour les six intentions, les quatre espaces que le moteur produit — leur taille réelle, leur cote, leur rapport', async () => {
  const { p, fermer } = await nav.page(URL())
  /* chaque paire se révèle POUR ELLE SEULE depuis le 1er septembre : deux boutons, deux gestes */
  const revelateurs = p.locator('#decisions .ry-paire .ry-juge > .bouton')
  assert.equal(await revelateurs.count(), 2, 'une paire, un bouton')
  for (let k = 0; k < 2; k++) { await revelateurs.nth(k).click(); assert.equal(await revelateurs.nth(k).getAttribute('aria-pressed'), 'true', `l’écart ${k} se montre`) }
  for (let i = 0; i < INTENTIONS.length; i++) {
    await p.locator(INTENTIONS_SEL).nth(i).click()
    const s = chaine(INTENTIONS[i]), n = INTENTIONS[i].nom
    /* le retrait n'est pas recopié ici : il se lit dans le verdict, et tout en découle */
    const badges = await textes(p, '#decisions .ry-verdict .badge')
    assert.equal(badges.length, 2, `${n} — deux paires, deux verdicts`)
    const retrait = nombres(badges[0])[0]
    assert.ok(retrait > 0 && nombres(badges[1])[0] === retrait, `${n} — le même geste des deux côtés : ${badges}`)
    /* en haut la marge de la coque, en bas l'espace le plus serré ; à droite, le même moins le retrait */
    const attendus = [s.pad[0], s.pad[0] - retrait, s.gap[3], s.gap[3] - retrait].map((v) => Math.max(v, 0))
    const hauteurs = await p.evaluate(() => [...document.querySelectorAll('#decisions .ry-ech-espace')].map((e) => parseFloat(getComputedStyle(e).height)))
    liste(hauteurs, attendus, `${n} — les quatre espaces, à leur taille réelle`, 0.51)
    /* la cote écrite dans l'espace est ce que l'espace mesure */
    liste((await textes(p, '#decisions .ry-ech-cote')).flatMap(nombres), attendus.map(arrondi), `${n} — les cotes`)
    /* le verdict n'est pas écrit d'avance : le rapport se déduit des deux longueurs */
    for (const [k, r] of [attendus[0] / attendus[1], attendus[2] / attendus[3]].entries()) {
      const lus = nombres(badges[k])
      assert.equal(lus.length, 2, `${n} — le verdict ${k} dit le retrait et le rapport : ${badges[k]}`)
      ok(lus[1], Math.round(r * 100) / 100, `${n} — rapport ${k}`, 0.005)
      /* la phrase suit le rapport, elle ne le commente pas au hasard */
      const phrase = await texte(p, '#decisions .ry-verdict', k)
      assert.match(phrase, r < 1.3 ? /jumeaux/ : r >= 1.8 ? /soude/ : /tout juste/, `${n} — la phrase du verdict ${k} (rapport ${r.toFixed(2)})`)
    }
    /* la garantie du moteur est dite quand elle a joué, et seulement là */
    const relevee = s.garanties.margeRelevee.some(Boolean)
    const pied = await p.evaluate(() => document.querySelector('#decisions').textContent.includes('une marge a été relevée au coin'))
    assert.equal(pied, relevee, `${n} — la marge relevée est dite si et seulement si le moteur l'a relevée`)
  }
  await fermer()
})
test('1 · les chiffres du vocabulaire et de la table des axes sont ceux du moteur', async () => {
  const { p, fermer } = await nav.page(URL())
  const legendes = await textes(p, '#vocabulaire .ry-voc-tuile .gd-legende')
  const { pad: pd, gap: g, r } = SOCLE
  liste(nombres(legendes[0]), [pd[0], r[0], g[0]].map(arrondi), 'coque')
  liste(nombres(legendes[1]), [pd[1], r[1], g[1]].map(arrondi), 'carte')
  liste(nombres(legendes[2]), [pd[2], r[2], g[2], g[3]].map(arrondi), 'ligne')
  const rangs = await p.evaluate(() => [...document.querySelectorAll('#vocabulaire table tbody tr')].map((tr) => tr.lastElementChild.textContent))
  const axes = ['inline', 'block', 'type', 'control']
  axes.forEach((a, i) => liste(nombres(rangs[i]), [AXES[a].min, AXES[a].max], `axe ${a}`, 0.001))
  assert.match(rangs[4], /fixes/)
  await fermer()
})
test('1 · les douze réponses du « bon cran » lisent le registre calculé (charte, bornes, jeton nommé)', async () => {
  const { p, fermer } = await nav.page(URL())
  const natures = await p.locator('#cran .ry-question').nth(0).locator('.bouton').count()
  const profs = await p.locator('#cran .ry-question').nth(1).locator('.bouton').count()
  assert.equal(natures * profs, 12)
  for (let n = 0; n < natures; n++) for (let q = 0; q < profs; q++) {
    await p.locator('#cran .ry-question').nth(0).locator('.bouton').nth(n).click()
    await p.locator('#cran .ry-question').nth(1).locator('.bouton').nth(q).click()
    const noms = (await texte(p, '#cran .ry-reponse b')).split(' · ').map((s) => s.replace(/^--/, ''))
    const lignes = await textes(p, '#cran .ry-reponse .gd-legende > span')
    assert.equal(lignes.length, noms.length)
    noms.forEach((nom, i) => {
      const t = J[nom]; assert.ok(t, `jeton inconnu du moteur : ${nom}`)
      assert.ok(lignes[i].startsWith(`--${nom} : `), `${nom} : la ligne nomme un autre jeton (${lignes[i]})`)
      const lus = nombres(lignes[i].split(' : ')[1])
      liste(lus, (t.axe ? [t.base, t.bas, t.haut] : [t.base]).map(arrondi), nom)
    })
  }
  await fermer()
})
test('1 · la table de correspondance (dépliant de 08) est le registre ligne à ligne : charte, bornes, grille de 4, CSS', async () => {
  const { p, fermer } = await nav.page(URL())
  await p.locator('#adaptation details.prov summary').click()
  const rangs = await p.evaluate(() => [...document.querySelectorAll('#adaptation table tbody tr')].map((tr) => [...tr.children].map((td) => td.textContent)))
  const noms = Object.keys(J).filter((n) => /^(pad|gap|edge|page)-/.test(n))
  assert.deepEqual(rangs.map((r) => r[0]), noms.map((n) => `--${n}`))
  for (const [nom, base, bornes, tw, css] of rangs) {
    const t = J[nom.slice(2)]
    liste(nombres(base), [arrondi(t.base)], `${nom} charte`)
    liste(nombres(bornes), [t.bas, t.haut].map(arrondi), `${nom} bornes`)
    liste(nombres(tw), [grille4(t.bas), grille4(t.haut)], `${nom} grille de 4`)
    assert.equal(css, t.css, `${nom} CSS`)
  }
  const tete = await texte(p, '#adaptation table thead')
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
  /* [sélecteur, propriété calculée, jeton] — la tranche Coursue : coque → carte → ligne */
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
  ['#echelle .tr-sub', 'borderTopLeftRadius', 'r-3'], ['#echelle .tr-sub', 'rowGap', 'gap-4-block'],
  ['#echelle .tr-btn', 'borderTopLeftRadius', 'r-ctl'], ['#echelle .tr-btn', 'minHeight', 'control-height'],
  /* une entrée de menu est un CONTRÔLE, pas une ligne de texte (31 août) : sa hauteur est
     la cible compacte, sa marge est horizontale seule — et le menu se serre au plus serré */
  ['#echelle .tr-item', 'borderTopLeftRadius', 'r-3'], ['#echelle .tr-item', 'paddingLeft', 'pad-3-inline'],
  ['#echelle .tr-item', 'minHeight', 'control-height-compact'], ['#echelle .tr-nav', 'rowGap', 'gap-4-block'],
  /* la réglette est une légende faite de vraies boîtes de ligne */
  ['#echelle .ry-reglette .ry-cran', 'paddingTop', 'pad-3-block'], ['#echelle .ry-reglette .ry-cran', 'paddingLeft', 'pad-3-inline'],
  ['#echelle .ry-reglette .ry-cran', 'borderTopLeftRadius', 'r-3'], ['#echelle .ry-reglette .ry-cran', 'rowGap', 'gap-4-block'],
  /* l'amorce : sa carte est une carte, ses échantillons se tiennent au plus serré */
  ['#decisions .ry-ech-carte', 'paddingTop', 'pad-2-block'], ['#decisions .ry-ech-carte', 'borderTopLeftRadius', 'r-2'],
  ['#decisions .ry-amorce', 'rowGap', 'gap-1-block'], ['#decisions .ry-juge', 'rowGap', 'gap-2-block'],
  /* la paire est une grille : les deux échantillons et la question sur les mêmes rangs (1er septembre) */
  ['#decisions .ry-paire', 'columnGap', 'gap-1-inline'],
  ['#decisions .ry-ech-bloc', 'borderTopLeftRadius', 'r-4'], ['#decisions .ry-ech-cote', 'borderTopLeftRadius', 'r-4'],
  /* la profondeur : coque, carte, ligne, et le bouton au coin de la ligne */
  ['#profondeur .ry-prof-coque', 'borderTopLeftRadius', 'r-1'], ['#profondeur .ry-prof-coque', 'paddingTop', 'pad-1-block'],
  ['#profondeur .ry-prof-carte', 'borderTopLeftRadius', 'r-2'], ['#profondeur .ry-prof-carte', 'paddingLeft', 'pad-2-inline'],
  ['#profondeur .ry-prof-ligne', 'borderTopLeftRadius', 'r-3'], ['#profondeur .ry-prof-ligne', 'paddingTop', 'pad-3-block'],
  ['#profondeur .ry-prof-btn', 'borderTopLeftRadius', 'r-ctl'],
  /* la proximité, au repos : entre cartes au-dessus du titre, dans la ligne sous le titre et sous le libellé */
  ['#proximite .ry-prox-carte', 'borderTopLeftRadius', 'r-2'], ['#proximite .ry-prox-carte', 'paddingTop', 'pad-2-block'],
  ['#proximite .ry-champ', 'borderTopLeftRadius', 'r-ctl'], ['#proximite .ry-champ', 'minHeight', 'control-height'],
  /* la densité et le vocabulaire consomment ce qu'ils nomment */
  ['#densite .ry-dcarte', 'borderTopLeftRadius', 'r-2'], ['#densite .ry-sk', 'borderTopLeftRadius', 'r-pill'],
  ['#vocabulaire .ry-vocfig.coque', 'borderTopLeftRadius', 'r-1'],
  ['#vocabulaire .ry-vocfig.carte', 'paddingTop', 'pad-2-block'], ['#vocabulaire .ry-vocfig.ligne', 'columnGap', 'gap-3-inline'],
  ['#vocabulaire .ry-vocbadge', 'paddingTop', 'gap-4-block'], ['#vocabulaire .ry-vocbadge', 'paddingLeft', 'gap-3-inline'],
  /* les boîtes des figures portent le coin de leur profondeur — la figure DIT ce qu'elle nomme */
  ['#vocabulaire .ry-vocbox', 'borderTopLeftRadius', 'r-2'], ['#vocabulaire .ry-vocbox.ligne', 'borderTopLeftRadius', 'r-3'],
  ['#vocabulaire .ry-vocbox.item', 'borderTopLeftRadius', 'r-3'],
  /* la proximité : la carte et sa colonne */
  ['#proximite .ry-prox', 'rowGap', 'gap-2-block'],
  /* la scène de preuve de 03 est empruntée à /composition, dont la marge est une dette
     déclarée : son ESPACE, lui, est sur la chaîne, et c'est ce qu'on mesure ici */
  ['#profondeur .co-preuve1', 'rowGap', 'pad-3-block'], ['#profondeur .co-gauche', 'rowGap', 'pad-3-block'],
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
    /* la paire de l'amorce se replie sous 56 rem : la question descend sous les deux cartes,
       et l'écart des rangs passe d'un cran serré au cran de la carte — les deux sont des jetons */
    ok(await calcPx(p, '#decisions .ry-paire', 'rowGap'), attendu(W >= 56 * 16 ? 'gap-4-block' : 'gap-2-block', W), `${W} px — l’écart des rangs de la paire`)
    /* la proximité : les quatre écarts de la carte, au repos */
    const ecarts = await p.evaluate(() => [...document.querySelectorAll('#proximite .ry-prox-carte .espace')].map((e) => parseFloat(getComputedStyle(e).height)))
    liste(ecarts, ['gap-1-block', 'gap-3-block', 'gap-1-block', 'gap-3-block'].map((n) => attendu(n, W)), `${W} px — proximité au repos`, TOL)
    await fermer()
  }
})
test('2 · les casses sont rendues par le jeton menteur, déclarées (data-intent="statement") — et la ligne cassée est deux fois plus ronde que sa carte', async () => {
  const W = 1440
  const { p, fermer } = await nav.page(URL(), { largeur: W })
  /* la profondeur */
  await p.locator('#profondeur .bouton.casse').click()
  assert.equal(await p.getAttribute('#profondeur .ry-prof-ligne', 'data-intent'), 'statement')
  ok(await calcPx(p, '#profondeur .ry-prof-ligne', 'borderTopLeftRadius'), 2 * attendu('r-2', W), 'coin cassé = 2 × coin de la carte')
  await p.locator('#profondeur .bouton.casse').click()
  ok(await calcPx(p, '#profondeur .ry-prof-ligne', 'borderTopLeftRadius'), attendu('r-3', W), 'réparé : le coin de la ligne')
  /* la proximité : le titre, puis le libellé */
  const ecarts = () => p.evaluate(() => [...document.querySelectorAll('#proximite .ry-prox-carte .espace')].map((e) => [parseFloat(getComputedStyle(e).height), e.dataset.intent ?? null]))
  await p.locator('#proximite .bouton.casse').nth(1).click()
  let e = await ecarts()
  liste(e.map((x) => x[0]), ['gap-2-block', 'gap-2-block', 'gap-1-block', 'gap-3-block'].map((n) => attendu(n, W)), 'titre cassé : le même écart des deux côtés', TOL)
  assert.deepEqual(e.map((x) => x[1]), ['statement', 'statement', null, null])
  await p.locator('#proximite .bouton.casse').nth(1).click()
  await p.locator('#proximite .bouton.casse').nth(0).click()
  e = await ecarts()
  liste(e.map((x) => x[0]), ['gap-1-block', 'gap-3-block', 'gap-1-block', 'gap-1-block'].map((n) => attendu(n, W)), 'libellé cassé : aussi loin de son champ que de ce qui précède', TOL)
  assert.deepEqual(e.map((x) => x[1]), [null, null, 'statement', 'statement'])
  await fermer()
})
test('2 · le laboratoire rend la géométrie des six intentions, en px calculés par le moteur', async () => {
  const { p, fermer } = await nav.page(URL())
  for (let i = 0; i < INTENTIONS.length; i++) {
    await p.locator(INTENTIONS_SEL).nth(i).click()
    const s = chaine(INTENTIONS[i]), n = INTENTIONS[i].nom
    ok(await calcPx(p, '#decisions .ry-lab', 'paddingTop'), s.pad[0], `${n} coque marge`); ok(await calcPx(p, '#decisions .ry-lab', 'borderTopLeftRadius'), s.r[0], `${n} coque coin`)
    ok(await calcPx(p, '#decisions .ry-lab-carte', 'paddingTop'), s.pad[1], `${n} carte marge`); ok(await calcPx(p, '#decisions .ry-lab-carte', 'borderTopLeftRadius'), s.r[1], `${n} carte coin`)
    ok(await calcPx(p, '#decisions .ry-lab-carte', 'rowGap'), s.gap[0], `${n} entre cartes`); ok(await calcPx(p, '#decisions .ry-lab-ligne', 'columnGap'), s.gap[1], `${n} entre lignes`)
    ok(await calcPx(p, '#decisions .ry-lab-cellule', 'paddingTop'), s.pad[2], `${n} ligne marge`); ok(await calcPx(p, '#decisions .ry-lab-cellule', 'borderTopLeftRadius'), s.r[2], `${n} ligne coin`)
    ok(await calcPx(p, '#decisions .ry-lab-cellule', 'rowGap'), s.gap[2], `${n} dans la ligne`); ok(await calcPx(p, '#decisions .ry-lab-btn', 'borderTopLeftRadius'), s.rCtl, `${n} bouton`)
  }
  await fermer()
})
test('2 · la feuille de la page consomme, pour chaque preuve, le jeton qu’elle nomme', () => {
  const css = fs.readFileSync(path.join(KIT, 'app/rythme/rythme.css'), 'utf8')
  const bloc = (sel) => { const i = css.indexOf(`\n${sel} {`); assert.ok(i >= 0, `sélecteur absent : ${sel}`); return css.slice(i, css.indexOf('}', i)) }
  const attend = (sel, decl) => assert.ok(bloc(sel).includes(decl), `${sel} : « ${decl} » attendu`)
  attend('.tranche', 'padding: var(--pad-1-block) var(--pad-1-inline)'); attend('.tranche', 'border-radius: var(--r-1)'); attend('.tranche', 'gap: var(--gap-1-inline)')
  attend('.tr-carte', 'border-radius: var(--r-2)'); attend('.tr-sub', 'padding: var(--pad-3-block) var(--pad-3-inline)'); attend('.tr-sub', 'border-radius: var(--r-3)')
  attend('.tr-btn', 'border-radius: var(--r-ctl)'); attend('.tr-btn', 'min-height: var(--control-height)')
  attend('.ry-prof-coque', 'border-radius: var(--r-1)'); attend('.ry-prof-carte', 'border-radius: var(--r-2)'); attend('.ry-prof-ligne', 'border-radius: var(--r-3)')
  attend('.ry-prox-carte', 'padding: var(--pad-2-block) var(--pad-2-inline)'); attend('.ry-dcarte', 'padding: var(--pad-2-block) var(--pad-2-inline)')
  attend('.ry-vocfig.coque', 'padding: var(--pad-1-block) var(--pad-1-inline)'); attend('.ry-vocfig.carte', 'padding: var(--pad-2-block) var(--pad-2-inline)'); attend('.ry-vocfig.ligne', 'padding: var(--pad-3-block) var(--pad-3-inline)')
  /* la réglette et l'amorce sont faites des mêmes boîtes que le reste de la page */
  attend('.ry-reglette .ry-cran', 'padding: var(--pad-3-block) var(--pad-3-inline)'); attend('.ry-reglette .ry-cran', 'border-radius: var(--r-3)')
  attend('.ry-ech-carte', 'padding: var(--pad-2-block) var(--pad-2-inline)'); attend('.ry-ech-carte', 'border-radius: var(--r-2)')
  /* la casse est dite sur sa ligne */
  assert.match(bloc('.ry-prof-ligne[data-intent="statement"]'), /casse/)
  /* les deux mesures qui ne descendent pas de la chaîne sont dites, chacune sur SA ligne :
     la place du « ÷ √2 » entre deux boîtes de réglette, et la pastille de cote de l'amorce */
  for (const sel of ['.ry-reglette', '.ry-ech-cote']) assert.match(bloc(sel), /hors chaîne/, `${sel} : l’exception n’est pas dite`)
})

/* ── 3 · La densité recalcule sous les yeux ── */
test('3 · par le tiroir, la densité change la base de la tranche, du silence, de la carte du milieu — jamais les coins, jamais les colonnes', async () => {
  const W = 1440
  const { p, fermer } = await nav.page(URL(), { largeur: W })
  const mesurer = async () => ({
    tranche: await calcPx(p, '#echelle .tranche', 'paddingTop'), coin: await calcPx(p, '#echelle .tranche', 'borderTopLeftRadius'),
    silence: await calcPx(p, '#densite.gdoc-sec', 'paddingTop'), milieu: await calcPx(p, '#densite .ry-dcarte', 'paddingTop', 1),
    aere: await calcPx(p, '#densite .ry-dcarte', 'paddingTop', 0), compact: await calcPx(p, '#densite .ry-dcarte', 'paddingTop', 2),
    rail: parseFloat((await calc(p, '.gdoc', 'gridTemplateColumns')).split(' ')[0]), gouttiere: await calcPx(p, '.gdoc', 'columnGap'), marge: await calcPx(p, '.gdoc', 'paddingLeft'),
    etiquette: await texte(p, '#densite .ry-detiq', 1),
  })
  const attendre = (densite) => ({
    tranche: attendu('pad-1-block', W, DENSITES[densite]), coin: attendu('r-1', W), silence: attendu('doc-silence', W, DENSITES[densite]),
    milieu: attendu('pad-2-block', W, DENSITES[densite]), aere: attendu('pad-2-block', W, DENSITES.airy), compact: attendu('pad-2-block', W, DENSITES.compact),
    rail: attendu('doc-rail', W), gouttiere: attendu('doc-gouttiere', W), marge: attendu('doc-marge', W),
  })
  const noms = { compact: 'compact', comfortable: 'confortable', airy: 'aéré' }
  const verifier = async (densite) => {
    const m = await mesurer(), a = attendre(densite)
    for (const k of Object.keys(a)) ok(m[k], a[k], `${densite} — ${k}`)
    assert.ok(m.etiquette.includes(`${noms[densite]} · base ${DENSITES[densite]}`), `${densite} — étiquette : ${m.etiquette}`)
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
test('3 · la densité chargée au démarrage donne la même chaîne, aux trois largeurs', async () => {
  for (const densite of DENSITES_SITE) for (const W of LARGEURS) {
    const { p, fermer } = await nav.page(URL(), { largeur: W, densite })
    ok(await calcPx(p, '#echelle .tranche', 'paddingTop'), attendu('pad-1-block', W, DENSITES[densite]), `${densite} ${W} — coque`)
    ok(await calcPx(p, '#echelle .tr-sub', 'paddingLeft'), attendu('pad-3-inline', W, DENSITES[densite]), `${densite} ${W} — ligne`)
    ok(await calcPx(p, '#echelle .tr-btn', 'borderTopLeftRadius'), attendu('r-ctl', W), `${densite} ${W} — bouton fixe`)
    ok(await calcPx(p, '.gdoc', 'columnGap'), attendu('doc-gouttiere', W), `${densite} ${W} — gouttière fixe`)
    await fermer()
  }
})

/* ── 4 · Les titres glissent avec l'écran ── */
test('4 · l’affiche et les titres de section valent la règle déclarée à chaque largeur, et grandissent strictement', async () => {
  const affiche = [], section = []
  for (const W of LARGEURS) {
    const { p, fermer } = await nav.page(URL(), { largeur: W })
    const h1 = await calcPx(p, '.gdoc-heros h1', 'fontSize'), h2 = await calcPx(p, '.gdoc-sec h2', 'fontSize')
    ok(h1, attendu('doc-cover', W), `${W} — affiche`); ok(h2, attendu('doc-section', W), `${W} — section`)
    /* La réponse du bon cran est en affiche, elle aussi — « grossir énormément le
       résultat ». Elle vit dans une boîte qui porte le mot « cran », comme les boîtes
       de la réglette : cette mesure est ce qui empêche une règle de voisinage de
       rabattre l'affiche au cran étiquette sans que rien ne se voie. */
    ok(await calcPx(p, '#cran .ry-affiche', 'fontSize'), attendu('doc-cover', W), `${W} — réponse en affiche`)
    affiche.push(h1); section.push(h2)
    await fermer()
  }
  assert.ok(affiche[0] < affiche[1] && affiche[1] < affiche[2], `l'affiche glisse : ${affiche}`)
  assert.ok(section[0] < section[1] && section[1] < section[2], `la section glisse : ${section}`)
  /* la densité ne touche pas aux titres */
  const { p, fermer } = await nav.page(URL(), { largeur: 1440, densite: 'compact' })
  ok(await calcPx(p, '.gdoc-heros h1', 'fontSize'), affiche[2], 'compact — la même affiche')
  await fermer()
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
    for (const s of ['#adaptation', '#echelle', '#decisions', '#profondeur', '#densite', '#proximite', '#cran', '#vocabulaire']) await p.locator(`${s} details.prov summary`).click()
    const f = await fautesEnDur(p, W, DENSITES.comfortable, { exclusions })
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
