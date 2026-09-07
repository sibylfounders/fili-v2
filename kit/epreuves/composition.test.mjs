/* LE CRASH-TEST DE LA PAGE COMPOSITION — kit/epreuves/composition.test.mjs
   Ce qui doit être vrai à l'écran, mesuré sans l'œil (écrit le 7 septembre
   2026, quand la page a pris ses deux étages du bas et fermé sa dette) :
   1 · chaque chiffre affiché est MESURÉ sur le rendu, jamais déclaré — les cotes
       de la preuve 01, la part d'encre de la preuve 03 ;
   2 · chaque pièce du kit est rendue par son jeton : la scène est une coque, un
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
import { DENSITES } from '../derivation.mjs'
import { KIT, LARGEURS, TOL, ouvrirSite, ouvrirNavigateur, attendu, proche, nombres, calcPx, calc, texte, textes, fautesC17, fautesEnDur, fautesTailles, selecteursDeclares, selecteursEnEm, debord, rgb, encres } from './banc.mjs'

const ok = (a, b, msg, tol = TOL) => assert.ok(a !== null && proche(a, b, tol), `${msg} : ${a} attendu ${b}`)
const CSS = () => fs.readFileSync(path.join(KIT, 'app/composition/composition.css'), 'utf8')
const GLOBALES = () => fs.readFileSync(path.join(KIT, 'app/globals.css'), 'utf8')
const VUE = () => fs.readFileSync(path.join(KIT, 'app/composition/vue.tsx'), 'utf8')

let site, nav
before(async () => { site = await ouvrirSite(); nav = await ouvrirNavigateur() })
after(async () => { await nav?.fermer(); site?.fermer() })
const URL = () => site.url + '/composition'
const casser = (p, nom) => p.locator('#casse .bouton.casse', { hasText: nom }).click()
const bande = (i) => `#bandes .doc-bande:nth-child(${i})`
const cote = (i, k) => `${bande(i)} .cb-cote:nth-child(${k})` /* 1 = le juste, 2 = le fautif */
const boites = (p, sel) => p.evaluate((sel) => [...document.querySelectorAll(sel)].map((e) => { const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height, b: r.bottom } }), sel)

/* ── 1 · Chaque chiffre affiché est mesuré sur le rendu ── */
test('1 · les cotes de « écarts tous égaux » sont les distances rendues entre les blocs ; « quatre axes » compte les départs distincts ; la rupture compte ses cibles ; la part d’encre est celle du rendu', async () => {
  const { p, fermer } = await nav.page(URL(), { largeur: 1440 })
  await casser(p, 'écarts tous égaux'); await p.waitForTimeout(80)
  const blocs = await boites(p, '#casse .co-app-corps > .co-b'), lignes = await boites(p, '#casse .co-liste .co-li')
  const lus = nombres((await textes(p, '#casse .co-r-etq')).join(' '))
  const attendus = []
  for (let i = 0; i < blocs.length - 1; i++) attendus.push(Math.round(Math.max(blocs[i + 1].y - blocs[i].b, 1)))
  attendus.push(Math.round(Math.max(lignes[1].y - lignes[0].b, 1)))
  assert.deepEqual(lus, attendus, 'les cotes sont les distances rendues')
  assert.ok(new Set(attendus).size === 1, `cassé, tous les écarts mesurent pareil : ${attendus}`)
  await casser(p, 'quatre axes'); await p.waitForTimeout(80)
  const departs = [...new Set((await boites(p, '#casse .co-app-corps > .co-b')).map((r) => Math.round(r.x)))]
  assert.equal(await p.locator('#casse .co-r-fil').count(), departs.length, 'un fil par départ distinct')
  assert.ok(departs.length >= 3, `quatre axes : ${departs.length} départs distincts`)
  await casser(p, 'la rupture partout'); await p.waitForTimeout(80)
  const cibles = await p.locator('#casse .co-app .co-etq, #casse .co-app .co-b1, #casse .co-app .co-b2, #casse .co-app .co-pct, #casse .co-app .co-app-tete b').count()
  assert.match(await texte(p, '#casse .co-r-etq'), new RegExp(`dépensé ${cibles} fois`))
  /* la part d'encre : recomputée ici de la même façon — l'aire des boîtes de texte sur l'aire de la page */
  await p.waitForTimeout(80)
  const part = await p.evaluate(() => {
    const art = document.querySelector('#blanc .co-mag'), base = art.getBoundingClientRect(), range = document.createRange()
    let aire = 0
    const marcher = (n) => { n.childNodes.forEach((c) => { if (c.nodeType === 3 && c.textContent.trim()) { range.selectNodeContents(c); for (const r of range.getClientRects()) aire += r.width * r.height } else if (c.nodeType === 1) marcher(c) }) }
    marcher(art); return Math.round((aire / (base.width * base.height)) * 100)
  })
  assert.ok(part > 5 && part < 60, `une part d'encre plausible : ${part} %`)
  assert.match(await texte(p, '#blanc .rang .badge'), new RegExp(`l'encre occupe ${part} %`))
  await fermer()
})

/* ── 2 · Chaque pièce du kit est rendue par son jeton ── */
test('2 · la scène est une coque, le banc s’écarte du deuxième cran de page, la légende parle au petit cran ; la paire du bas est deux colonnes — l’écart entre elles dépasse tout écart dedans', async () => {
  for (const W of LARGEURS) {
    const { p, fermer } = await nav.page(URL(), { largeur: W })
    ok(await calcPx(p, '#casse .co-scene', 'paddingTop'), attendu('pad-1-block', W), `${W} — la scène, marge de coque (haut)`)
    ok(await calcPx(p, '#casse .co-scene', 'paddingLeft'), attendu('pad-1-inline', W), `${W} — la scène, marge de coque (côté)`)
    ok(await calcPx(p, '#casse .co-scene', 'borderTopLeftRadius'), attendu('r-1', W), `${W} — coin de coque`)
    ok(await calcPx(p, '#casse .co-banc', 'columnGap'), attendu('page-2-inline', W), `${W} — le banc, deuxième cran de page`)
    ok(await calcPx(p, '#parcours .co-paire', 'columnGap'), attendu('page-2-inline', W), `${W} — journal et affiche, deuxième cran de page`)
    ok(await calcPx(p, '#casse .co-lex dt', 'fontSize'), attendu('font-size-small', W), `${W} — la légende au petit cran`)
    ok(await calcPx(p, '#casse .co-dit', 'fontSize'), attendu('font-size-body', W), `${W} — le commentaire au corps`)
    /* la paire : à deux colonnes, l'écart entre elles est la marge de coque, et il domine */
    ok(await calcPx(p, '#bandes .cb-paire', 'rowGap'), attendu('pad-1-block', W), `${W} — la paire, l'écart de coque (haut)`)
    if (W >= 640) {
      const entre = await calcPx(p, '#bandes .cb-paire', 'columnGap')
      ok(entre, attendu('pad-1-inline', W), `${W} — la paire, l'écart de coque entre colonnes`)
      const dedans = await p.evaluate(() => Math.max(...[...document.querySelectorAll('#bandes .cb-cote:first-child *')].flatMap((e) => { const cs = getComputedStyle(e); return [cs.rowGap, cs.columnGap, cs.marginTop, cs.marginBottom].map(parseFloat).filter((v) => !Number.isNaN(v)) })))
      assert.ok(entre > dedans + TOL, `${W} — dedans plus serré que dehors : ${dedans} < ${entre}`)
      const [g, d] = await boites(p, `${bande(1)} .cb-cote`)
      assert.ok(Math.abs(g.y - d.y) < 1 && d.x > g.x + g.w, `${W} — deux colonnes côte à côte`)
    } else {
      const [g, d] = await boites(p, `${bande(1)} .cb-cote`)
      assert.ok(d.y >= g.b - TOL && Math.abs(d.x - g.x) < 1, `${W} — sur téléphone, la paire s'empile`)
    }
    /* le juste ne dépense que le registre : un badge, un bouton, une carte du kit */
    ok(await calcPx(p, `${cote(1, 1)} .bouton`, 'minHeight'), attendu('control-height', W), `${W} — le bouton du juste est le bouton du kit`)
    ok(await calcPx(p, `${cote(3, 1)} .carte`, 'paddingTop'), attendu('pad-2-block', W), `${W} — la carte du juste est la carte du kit`)
    ok(await calcPx(p, `${cote(3, 1)} .carte`, 'borderTopLeftRadius'), attendu('r-2', W), `${W} — coin de carte`)
    ok(await calcPx(p, `${cote(4, 1)} .cb-bloc.pave`, 'paddingLeft'), attendu('pad-3-inline', W), `${W} — le pavé, marge de ligne`)
    await fermer()
  }
})
test('2 · la feuille consomme, pour chaque pièce, le jeton qu’elle nomme, et dit chacune de ses casses', () => {
  const css = CSS(), g = GLOBALES()
  const bloc = (src, sel) => { const i = src.indexOf(`\n${sel} {`); assert.ok(i >= 0, `sélecteur absent : ${sel}`); return src.slice(i, src.indexOf('}', i)) }
  const attend = (src, sel, decl) => assert.ok(bloc(src, sel).includes(decl), `${sel} : « ${decl} » attendu`)
  attend(g, '.co-scene', 'padding: var(--pad-1-block) var(--pad-1-inline)'); attend(g, '.co-banc', 'gap: var(--page-2-inline)')
  attend(g, '.co-duo-t', 'gap: var(--page-2-inline)'); attend(g, '.co-paire', 'gap: var(--page-2-inline)')
  attend(css, '.cb-paire', 'gap: var(--pad-1-block) var(--pad-1-inline)'); attend(css, '.cb-photos', 'gap: var(--gap-4-block)')
  attend(css, '.cb-bloc.pave', 'padding: var(--pad-3-block) var(--pad-3-inline)')
  for (const sel of ['.cb-photos.coupees > .cb-legende', '.cb-carte.lourde', '.cb-colonne.defaite .cb-bloc.titre', '.cb-colonne.defaite .cb-bloc.texte', '.cb-colonne.defaite .cb-bloc.pave']) {
    const i = css.indexOf(sel); assert.ok(i >= 0, `casse absente : ${sel}`)
    assert.match(css.slice(css.lastIndexOf('\n', i), css.indexOf('\n', i)), /casse/, `${sel} : casse dite sur sa ligne`)
  }
  /* la dette du 25 août est fermée : plus un bloc de dette dans le registre de la page, chaque valeur restante dit qu'elle est une réduction */
  const debut = g.indexOf('PAGE COMPOSITION'), fin = g.indexOf('LES TROIS ÉTAGES', debut) > 0 ? g.indexOf('LES TROIS ÉTAGES', debut) : g.length
  const blocPage = g.slice(debut, fin)
  assert.ok(!/HORS CHAÎNE — dette déclarée/.test(blocPage), 'plus de dette déclarée sur la page')
  assert.ok((blocPage.match(/réduction déclarée/g) ?? []).length >= 9, 'les réductions sont dites, une par ligne')
})

/* ── 3 · Chaque casse rend le mensonge qu'elle déclare, et se répare ── */
test('3 · l’écran : deux dominants, tout cloisonné, écarts égaux, quatre axes, la rupture partout — chacune rendue, et le survol la répare', async () => {
  const { p, fermer } = await nav.page(URL(), { largeur: 1440 })
  const app = '#casse .co-app'
  const repos = { titre: await calcPx(p, `${app} .co-liste .co-etq`, 'fontSize'), kpi: await calcPx(p, `${app} .co-kpi b`, 'fontSize'),
    bord: await calcPx(p, `${app} .co-b`, 'borderTopWidth'), departs: new Set((await boites(p, `${app} .co-app-corps > .co-b`)).map((r) => Math.round(r.x))).size }
  assert.ok(repos.titre < repos.kpi / 2, 'au repos, un seul dominant'); assert.equal(repos.bord, 0, 'au repos, aucun cadre'); assert.equal(repos.departs, 1, 'au repos, un seul axe')
  const survol = async () => { await p.hover(`${app}`); await p.waitForTimeout(60) }
  const loin = async () => { await p.mouse.move(5, 5); await p.waitForTimeout(60) }
  /* deux dominants */
  await casser(p, 'deux dominants'); await loin()
  ok(await calcPx(p, `${app} .co-liste .co-etq`, 'fontSize'), repos.kpi, 'cassé : le titre de la liste au corps du chiffre', 0.5)
  assert.match(await texte(p, '#casse .co-verdict .badge.ko'), /deux dominants/)
  await survol(); ok(await calcPx(p, `${app} .co-liste .co-etq`, 'fontSize'), repos.titre, 'survolé : réparé')
  /* tout cloisonné */
  await casser(p, 'deux dominants'); await casser(p, 'tout cloisonné'); await loin()
  assert.equal(await p.locator(`${app} .co-b`).evaluateAll((es) => es.filter((e) => parseFloat(getComputedStyle(e).borderTopWidth) > 0).length), 4, 'cassé : quatre cadres')
  await survol(); assert.equal(await calcPx(p, `${app} .co-b`, 'borderTopWidth'), 0, 'survolé : les cadres retirés')
  /* écarts égaux */
  await casser(p, 'tout cloisonné'); await casser(p, 'écarts tous égaux'); await loin()
  const blocs = await boites(p, `${app} .co-app-corps > .co-b`), lignes = await boites(p, `${app} .co-liste .co-li`)
  const entre = blocs[1].y - blocs[0].b, dans = lignes[1].y - lignes[0].b
  assert.ok(Math.abs(entre - dans) < 1, `cassé : dedans (${dans}) et dehors (${entre}) mesurent pareil`)
  await survol(); const r = await boites(p, `${app} .co-app-corps > .co-b`), l = await boites(p, `${app} .co-liste .co-li`)
  assert.ok(r[1].y - r[0].b > 2 * (l[1].y - l[0].b), 'survolé : dehors redevient bien plus large que dedans')
  /* quatre axes */
  await casser(p, 'écarts tous égaux'); await casser(p, 'quatre axes'); await loin()
  assert.ok(new Set((await boites(p, `${app} .co-app-corps > .co-b`)).map((x) => Math.round(x.x))).size >= 3, 'cassé : plusieurs départs')
  await survol(); assert.equal(new Set((await boites(p, `${app} .co-app-corps > .co-b`)).map((x) => Math.round(x.x))).size, 1, 'survolé : un seul axe')
  /* la rupture partout */
  await casser(p, 'quatre axes'); await casser(p, 'la rupture partout'); await loin()
  const primaire = rgb(encres('light').primary)
  const accent = () => p.evaluate((c) => [...document.querySelectorAll('#casse .co-app *')].filter((e) => getComputedStyle(e).color === c || getComputedStyle(e).backgroundColor === c).length, primaire)
  assert.ok(await accent() >= 5, 'cassé : l\'accent partout')
  await survol(); assert.ok(await accent() <= 2, 'survolé : l\'accent rendu à un seul élément')
  await casser(p, 'la rupture partout'); assert.equal(await p.locator('#casse .co-verdict .badge.ko').count(), 0, 'réparé : plus de verdict rouge')
  await fermer()
})
test('3 · l’espace blanc retiré : mêmes mots, même corps, même surface — l’air seul a disparu ; l’encre montrée est celle mesurée ; le chemin de l’œil rend ses deux tracés', async () => {
  const { p, fermer } = await nav.page(URL(), { largeur: 1440 })
  const lire = () => p.evaluate(() => { const a = document.querySelector('#blanc .co-mag'), r = a.getBoundingClientRect(), p = a.querySelector('.co-corps-mag p')
    return { h: r.height, mots: a.textContent.trim().split(/\s+/).length, fs: parseFloat(getComputedStyle(p).fontSize), porte: document.querySelector('#blanc .co-porte').getBoundingClientRect().height } })
  const avant = await lire()
  await p.locator('#blanc .bouton.casse').click(); await p.waitForTimeout(120)
  const apres = await lire()
  assert.equal(apres.mots, avant.mots, 'pas un mot retiré'); ok(apres.fs, avant.fs, 'même corps')
  assert.ok(apres.h < avant.h * 0.8, `l'article a perdu son air : ${apres.h} < ${avant.h}`)
  ok(apres.porte, avant.porte, 'la surface est gardée : la place de la page ne bouge pas', 1)
  assert.match(await texte(p, '#blanc .rang .badge.ko'), /l'air a disparu/)
  await p.locator('#blanc .bouton.casse').click(); await p.waitForTimeout(120)
  await p.locator('#blanc .bouton', { hasText: 'encre' }).click(); await p.waitForTimeout(120)
  const taches = await p.locator('#blanc .co-tache').count(), lignes = await p.evaluate(() => { const range = document.createRange(); let n = 0
    const marcher = (e) => e.childNodes.forEach((c) => { if (c.nodeType === 3 && c.textContent.trim()) { range.selectNodeContents(c); n += [...range.getClientRects()].filter((r) => r.width > 0 && r.height > 0).length } else if (c.nodeType === 1) marcher(c) })
    marcher(document.querySelector('#blanc .co-mag')); return n })
  assert.equal(taches, lignes, 'une tache par ligne de texte rendue')
  assert.equal(await p.locator('#parcours .co-paire > div').count(), 2, 'journal et affiche')
  assert.ok(await p.locator('#parcours svg path').count() >= 2, 'deux tracés rendus')
  await fermer()
})
test('3 · les quatre paires : le fautif diffère du juste par une seule chose, mesurée — deux habits identiques, une légende qui change de camp, un cadre, trois départs', async () => {
  const { p, fermer } = await nav.page(URL(), { largeur: 1440 })
  for (let i = 1; i <= 4; i++) {
    assert.equal(await p.getAttribute(cote(i, 1), 'data-intent'), null, `paire ${i} : le juste n'est pas une casse`)
    assert.equal(await p.getAttribute(cote(i, 2), 'data-intent'), 'statement', `paire ${i} : le fautif est déclaré`)
    assert.match(await texte(p, `${cote(i, 1)} .cb-verdict`), /✓/); assert.match(await texte(p, `${cote(i, 2)} .cb-verdict`), /✗/)
  }
  /* 1 · un habit, un rôle : à gauche un badge et un bouton ; à droite deux boutons au même fond */
  const fond = (sel) => calc(p, sel, 'backgroundColor')
  assert.notEqual(await fond(`${cote(1, 1)} .badge`), await fond(`${cote(1, 1)} .bouton`), 'juste : deux habits')
  assert.equal(await fond(`${cote(1, 2)} .bouton:first-child`), await fond(`${cote(1, 2)} .bouton:last-child`), 'fautif : le même habit')
  assert.equal(await p.locator(`${cote(1, 2)} .bouton`).count(), 2)
  /* le texte est centré dans le bouton, toujours — quel que soit l'élément qui le porte (verdict d'Auteur, 7 septembre) */
  for (const k of [1, 2]) {
    const centre = await p.evaluate((sel) => { const b = document.querySelector(sel), r = b.getBoundingClientRect(), g = document.createRange(); g.selectNodeContents(b); const t = g.getBoundingClientRect(); return Math.abs((t.top + t.bottom) / 2 - (r.top + r.bottom) / 2) }, `${cote(1, k)} .bouton`)
    assert.ok(centre < 1, `paire 1, côté ${k} : le texte est centré dans le bouton (${centre} px)`)
  }
  /* 2 · le trait : une légende est plus près de sa photo que de la suivante ; cassée, l'inverse */
  const dist = async (k) => { const [p1, l1, p2] = await boites(p, `${cote(2, k)} .cb-photos > *`); return { sienne: l1.y - p1.b, suivante: p2.y - l1.b } }
  const j = await dist(1), f = await dist(2)
  assert.ok(j.sienne < j.suivante, `juste : la légende tient à sa photo (${j.sienne} < ${j.suivante})`)
  assert.ok(f.sienne > f.suivante, `fautif : la légende a rejoint la photo d'après (${f.sienne} > ${f.suivante})`)
  ok(await calcPx(p, `${cote(2, 2)} .cb-legende`, 'borderTopWidth'), 2, 'fautif : le filet')
  ok(await calcPx(p, `${cote(2, 1)} .cb-legende`, 'borderTopWidth'), 0, 'juste : pas de filet')
  /* 3 · le simple gagne : même carte, seul le cadre change */
  const cj = await p.evaluate((sel) => { const c = document.querySelector(sel), cs = getComputedStyle(c); return { bord: parseFloat(cs.borderTopWidth), style: cs.borderTopStyle, pad: cs.paddingTop, fs: getComputedStyle(c.querySelector('.cb-carte-texte')).fontSize, ombre: cs.boxShadow, fond: cs.backgroundImage } }, `${cote(3, 1)} .carte`)
  const cf = await p.evaluate((sel) => { const c = document.querySelector(sel), cs = getComputedStyle(c); return { bord: parseFloat(cs.borderTopWidth), style: cs.borderTopStyle, pad: cs.paddingTop, fs: getComputedStyle(c.querySelector('.cb-carte-texte')).fontSize, ombre: cs.boxShadow, fond: cs.backgroundImage } }, `${cote(3, 2)} .carte`)
  assert.equal(cj.bord, 1); assert.equal(cf.bord, 4); assert.equal(cf.style, 'double')
  assert.equal(cj.pad, cf.pad, 'même marge'); assert.equal(cj.fs, cf.fs, 'même corps'); assert.equal(cf.ombre, 'none', 'pas d\'ombre : une seule chose change'); assert.equal(cf.fond, 'none')
  /* 4 · un bord commun : trois départs égaux ; cassés, trois départs différents */
  const departs = async (k) => (await boites(p, `${cote(4, k)} .cb-bloc`)).map((r) => Math.round(r.x))
  const dj = await departs(1), df = await departs(2)
  assert.equal(new Set(dj).size, 1, `juste : un bord (${dj})`); assert.equal(new Set(df).size, 3, `fautif : trois bords (${df})`)
  await fermer()
})

/* ── 4 · La densité règle les coques, jamais un corps ; les titres glissent ── */
test('4 · la scène suit la base de la densité ; le corps de la légende ne bouge pas ; l’affiche et les sections glissent avec l’écran', async () => {
  const W = 1440
  for (const densite of ['compact', 'airy']) {
    const { p, fermer } = await nav.page(URL(), { largeur: W, densite })
    ok(await calcPx(p, '#casse .co-scene', 'paddingTop'), attendu('pad-1-block', W, DENSITES[densite]), `${densite} — la scène suit la base`)
    ok(await calcPx(p, '#bandes .cb-paire', 'columnGap'), attendu('pad-1-inline', W, DENSITES[densite]), `${densite} — la paire suit la base`)
    ok(await calcPx(p, '#casse .co-lex dt', 'fontSize'), attendu('font-size-small', W), `${densite} — la légende ne bouge pas`)
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

/* ── 5 · C17 ── */
test('5 · dans les deux thèmes, tout tertiaire rendu porte 600 au moins, au cran étiquette au moins, jamais un paragraphe lu', async () => {
  for (const theme of ['light', 'dark']) {
    const { p, fermer } = await nav.page(URL(), { largeur: 1440, theme })
    const f = await fautesC17(p, theme, 1440)
    assert.deepEqual(f, [], `${theme} : ${f.length} faute(s)`)
    const combien = await p.evaluate((t) => [...document.querySelectorAll('main *')].filter((e) => getComputedStyle(e).color === t).length, rgb(encres(theme)['text-tertiary']))
    assert.ok(combien >= 6, `${theme} : ${combien} emplois du tertiaire`)
    await fermer()
  }
})

/* ── 6 · Rien en dur, hors des lignes qui le disent ; zéro débord ; zéro erreur ; quinze lois ── */
test('6 · marges, espaces, coins, tailles : chaque valeur calculée est une valeur du moteur — sauf les réductions déclarées (les objets imités) et les casses ; zéro débord ; zéro erreur', async () => {
  const css = CSS(), g = GLOBALES()
  const exclusions = ['padding', 'gap', 'border-radius', 'margin'].flatMap((prop) => [...selecteursDeclares(css, prop), ...selecteursDeclares(g, prop), ...selecteursEnEm(css, prop), ...selecteursEnEm(g, prop)])
  /* les objets imités (l'interface, le journal, l'affiche, le magazine) sont des réductions déclarées : tout ce qu'ils contiennent est à leur échelle */
  const reductions = ['.co-app', '.co-app *', '.co-presse', '.co-presse *', '.co-affiche', '.co-affiche *', '.co-mag', '.co-mag *', '.co-calque *', '.co-filets *', '.co-lex-pied']
  const tailles = ['svg *', ...reductions, ...selecteursDeclares(css, 'font-size'), ...selecteursDeclares(g, 'font-size'), ...selecteursEnEm(css), ...selecteursEnEm(g)]
  for (const W of LARGEURS) {
    const { p, fermer, erreurs } = await nav.page(URL(), { largeur: W })
    for (const d of await p.locator('main details.prov summary').all()) await d.click()
    const f = await fautesEnDur(p, W, DENSITES.comfortable, { exclusions: [...exclusions, ...reductions] })
    assert.deepEqual(f, [], `${W} px : ${f.length} valeur(s) hors moteur`)
    const t = await fautesTailles(p, W, { exclusions: tailles })
    assert.deepEqual(t, [], `${W} px : ${t.length} taille(s) hors moteur`)
    assert.deepEqual(erreurs, [], 'la page ne jette aucune erreur')
    assert.equal(await debord(p), 0, `${W} px : la page déborde de l'écran`)
    await fermer()
  }
})
test('6 · les quinze lois sont toutes là, une seule fois : cinq sur l’écran, une par preuve 02 et 03, quatre en bandes, quatre en liste', async () => {
  const vue = VUE()
  assert.equal((vue.match(/cle: "f-/g) ?? []).length, 5, 'cinq fautes sur l\'écran')
  const { p, fermer } = await nav.page(URL(), { largeur: 1440 })
  assert.equal(await p.locator('#bandes .doc-bande').count(), 4, 'quatre bandes')
  assert.equal(await p.locator('#liste .doc-liste tbody tr').count(), 4, 'quatre lois en liste')
  assert.deepEqual(await textes(p, '#liste .doc-liste .l-nom'), ['Hiérarchie par combinaison', 'Mesure de lecture', 'Dedans plus serré que dehors', 'Rôles d\'espace nommés'])
  assert.equal(await p.locator('#parcours').count() + await p.locator('#blanc').count(), 2, 'le chemin de l\'œil et l\'espace blanc')
  assert.equal(await p.locator('#fonds').count(), 0, 'la table des quinze lois a disparu')
  await fermer()
})
