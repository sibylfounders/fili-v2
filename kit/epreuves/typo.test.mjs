/* LE CRASH-TEST DE LA PAGE TYPO — kit/epreuves/typo.test.mjs
   Ce qui doit être vrai à l'écran, mesuré sans l'œil (plan validé par
   l'Auteur le 26 août 2026) :
   1 · chaque chiffre affiché sort du moteur ;
   2 · chaque preuve est rendue par son propre jeton (crans, voix, mesure, gazette, arbre, champ) ;
   3 · chaque casse rend le mensonge qu'elle déclare, et se répare ;
   4 · la densité ne touche pas au texte ; les titres glissent ;
   5 · le tertiaire suit C17 ;
   6 · rien en dur — marges, espaces, coins, et tailles de texte.           */
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { chaine, jetons, aLargeur, AXES, CHARTE, DENSITES, LARGEUR_MIN, LARGEUR_MAX, REGISTRE } from '../derivation.mjs'
import { KIT, LARGEURS, TOL, ouvrirSite, ouvrirNavigateur, attendu, proche, nombres, calcPx, calc, texte, textes, fautesC17, fautesEnDur, fautesTailles, selecteursDeclares, debord, rgb, encres } from './banc.mjs'

const J = jetons(chaine())
const ok = (a, b, msg, tol = TOL) => assert.ok(a !== null && proche(a, b, tol), `${msg} : ${a} attendu ${b}`)
const liste = (a, b, msg, tol = 0.051) => { assert.equal(a.length, b.length, `${msg} : ${a.length} nombres, ${b.length} attendus (${a} / ${b})`); a.forEach((v, i) => ok(v, b[i], `${msg} [${i}]`, tol)) }
const arrondi = (v) => Math.round(v * 10) / 10
/* le corps que la page calcule à la largeur réelle de l'écran (carte du zoom) — la courbe du moteur */
const corps = (W, zoom = 1) => aLargeur(16, 'type', W / zoom, 16) * zoom
const CRANS = ['doc-cover', 'doc-section', 'font-size-display', 'font-size-h1', 'font-size-h2', 'font-size-h3', 'font-size-body', 'font-size-small']

let site, nav
before(async () => { site = await ouvrirSite(); nav = await ouvrirNavigateur() })
after(async () => { await nav?.fermer(); site?.fermer() })
const URL = () => site.url + '/typo'

/* ── 1 · Chaque chiffre affiché sort du moteur ── */
test('1 · les huit fiches de l’échelle et sa légende disent les bornes, le rapport et le glissement du moteur', async () => {
  const { p, fermer } = await nav.page(URL())
  /* la fiche : « nom · bornes… » — on lit après le nom (« h1 » porte un chiffre qui n'est pas une borne) */
  const fiches = (await textes(p, '#gamme .gd-gcran .fiche')).map((f) => f.replace(/^[^·]*·\s*/, ''))
  assert.equal(fiches.length, 8, 'huit crans')
  const b = (n) => [J[n].bas, J[n].haut].map(arrondi)
  liste(nombres(fiches[0]), [arrondi(J['font-size-section'].bas), arrondi(J['font-size-cover-max'].haut)], 'couverture')
  liste(nombres(fiches[1]), [arrondi(J['font-size-h1'].bas), arrondi(J['font-size-section'].haut)], 'section')
  for (const [i, n] of [[2, 'display'], [3, 'h1'], [4, 'h2'], [5, 'h3']]) liste(nombres(fiches[i]), b(`font-size-${n}`), n)
  liste(nombres(fiches[6]), [...b('font-size-body'), 1.6], 'corps')
  assert.equal(REGISTRE.texte['leading-body'], '1.6')
  liste(nombres(fiches[7]), b('font-size-small'), 'petit')
  const legende = await texte(p, '#gamme .gd-legende')
  for (const attendu of [`bas à ${LARGEUR_MIN} px`, `haut à ${LARGEUR_MAX} px`, `× ${String(CHARTE.intervalleTitres).replace('.', ',')}`, `× ${String(AXES.type.max).replace('.', ',')}`]) assert.ok(legende.includes(attendu), `légende : « ${attendu} »`)
  /* les règles T4 et T10 citent le moteur, pas une valeur recopiée */
  const regles = await p.evaluate(() => [...document.querySelectorAll('#gamme details .badge, #gazette details .badge')].map((b) => b.parentElement.parentElement.textContent).join('\n'))
  assert.ok(regles.includes(`× ${String(CHARTE.intervalleTitres).replace('.', ',')}`) && regles.includes(`× ${String(AXES.type.max).replace('.', ',')} entre ${LARGEUR_MIN} et ${LARGEUR_MAX} px`), 'T4')
  assert.ok(regles.includes(`jamais ${String(arrondi(16 * AXES.type.min)).replace('.', ',')}`) && regles.includes(`(${String(J['font-size-small'].base).replace('.', ',')})`), 'T10')
  await fermer()
})
test('1 · la carte du zoom : « corps = N px » est le corps du moteur à la largeur réelle, rendu tel quel ; ×2 double ; « vw seul » ne gagne pas un pixel', async () => {
  for (const W of LARGEURS) {
    const { p, fermer } = await nav.page(URL(), { largeur: W })
    const carte = '#garde .gd-gardes .carte:nth-child(1)'
    const lu = () => texte(p, `${carte} .mono.sourd:not(:first-child)`, 0).then((t) => nombres(t.replace(/.*=/, ''))[0])
    const rendu = () => calcPx(p, `${carte} [style*="font-size"]`, 'fontSize')
    ok(await lu(), arrondi(corps(W)), `${W} — affiché`); ok(await rendu(), corps(W), `${W} — rendu`)
    await p.locator(`${carte} .bouton`, { hasText: '×2' }).click()
    ok(await lu(), arrondi(corps(W, 2)), `${W} — ×2 affiché`); ok(await rendu(), corps(W, 2), `${W} — ×2 rendu`)
    await p.locator(`${carte} .bouton.casse`).click()
    assert.equal(await p.getAttribute(`${carte} [style*="font-size"]`, 'data-intent'), 'statement')
    ok(await rendu(), corps(W), `${W} — vw seul au zoom ×2 : le corps de ×1`)
    assert.match(await texte(p, `${carte} .badge.ko`), /pas un pixel/)
    await fermer()
  }
})
test('1 · dans la vue, toute taille posée en ligne est un jeton ou le corps calculé, ou sa ligne (ou la précédente) dit « casse »', () => {
  const src = fs.readFileSync(path.join(KIT, 'app/typo/vue.tsx'), 'utf8').split('\n')
  const fautes = []
  src.forEach((l, i) => {
    for (const m of l.matchAll(/fontSize:\s*(`[^`]*`|"[^"]*"|[^,}]+)/g)) {
      if (/var\(--|\$\{corps\}|\bjeton\b/.test(m[1])) continue
      if (/casse/.test(l) || /casse/.test(src[i - 1] ?? '')) continue
      fautes.push(`vue.tsx:${i + 1} ${m[1]}`)
    }
  })
  assert.deepEqual(fautes, [])
})

/* ── 2 · Chaque preuve est rendue par son propre jeton ── */
test('2 · les huit rangs de l’échelle valent leur cran à chaque largeur ; les crans de texte descendent strictement, l’échelle entière à l’écran large', async () => {
  for (const W of LARGEURS) {
    const { p, fermer } = await nav.page(URL(), { largeur: W })
    const tailles = await p.evaluate(() => [...document.querySelectorAll('#gamme .gd-gcran .spec')].map((e) => parseFloat(getComputedStyle(e).fontSize)))
    assert.equal(tailles.length, 8)
    CRANS.forEach((n, i) => ok(tailles[i], attendu(n, W), `${W} — cran ${n}`))
    /* les six crans de texte descendent toujours ; les deux titres du site ont leur pente à eux (intention déclarée) :
       à 320 la section vaut h1, sous l'affiche — l'ordre complet ne tient qu'à l'écran large */
    for (let i = 3; i < 8; i++) assert.ok(tailles[i] < tailles[i - 1], `${W} — le cran ${i} n'est pas plus petit que le précédent (${tailles})`)
    assert.ok(tailles[0] > tailles[2] && tailles[1] >= tailles[3], `${W} — la couverture domine l'affiche, la section ne descend pas sous h1 (${tailles})`)
    if (W === LARGEUR_MAX) for (let i = 1; i < 8; i++) assert.ok(tailles[i] < tailles[i - 1], `${W} — l'échelle entière descend (${tailles})`)
    await fermer()
  }
})
test('2 · les deux voix sont Geist et JetBrains Mono, réellement chargées ; chaque fonte déclarée a son fichier au dépôt, au nom près (T11)', async () => {
  const { p, fermer } = await nav.page(URL())
  const familles = await p.evaluate(() => ({
    corps: getComputedStyle(document.body).fontFamily, lit: getComputedStyle(document.querySelector('#voix .gd-vbloc.primaire .gd-vglyphe')).fontFamily,
    chiffre: getComputedStyle(document.querySelector('#voix .gd-vbloc.sombre .gd-vglyphe')).fontFamily,
    geist: document.fonts.check('16px Geist'), mono: document.fonts.check('16px "JetBrains Mono"'),
    chargees: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family),
  }))
  assert.match(familles.corps, /^"?Geist"?,/); assert.match(familles.lit, /^"?Geist"?,/); assert.match(familles.chiffre, /^"JetBrains Mono",/)
  assert.ok(familles.geist && familles.mono, 'fonts.check')
  assert.ok(familles.chargees.includes('Geist') && familles.chargees.includes('JetBrains Mono'), `fontes chargées : ${familles.chargees}`)
  /* T11, au dépôt : la feuille des fontes ne déclare que des fichiers présents, sous les noms du registre */
  const css = fs.readFileSync(path.join(KIT, 'app/fontes.css'), 'utf8')
  for (const m of css.matchAll(/url\((\/fontes\/[^)]+)\)/g)) assert.ok(fs.existsSync(path.join(KIT, 'public', m[1])), `fichier absent : ${m[1]}`)
  const declarees = [...css.matchAll(/font-family:\s*"([^"]+)"/g)].map((m) => m[1])
  for (const f of ['Geist', 'JetBrains Mono']) assert.ok(declarees.includes(f), `${f} déclarée`)
  assert.ok(REGISTRE.fontes['font-sans'].startsWith('"Geist"') && REGISTRE.fontes['font-mono'].startsWith('"JetBrains Mono"'))
  await fermer()
})
test('2 · la mesure : la courte à 28 ch, la juste à la mesure du registre, la sans-borne suit l’écran — et le compteur recompte juste', async () => {
  for (const W of [768, 1440]) {
    const { p, fermer } = await nav.page(URL(), { largeur: W })
    const m = await p.evaluate(() => [...document.querySelectorAll('#mesure .gd-mesure')].map((d) => {
      const p = d.querySelector('p'), cs = getComputedStyle(p)
      const z = document.createElement('span'); z.textContent = '0'.repeat(20); z.style.cssText = 'position:absolute;visibility:hidden;white-space:pre'; p.appendChild(z)
      const ch = z.getBoundingClientRect().width / 20; z.remove()
      return { maxW: cs.maxWidth, w: p.getBoundingClientRect().width, ch, parent: d.getBoundingClientRect().width, n: parseInt(d.querySelector('.badge').textContent.match(/≈ (\d+)/)[1]), fs: parseFloat(cs.fontSize), lh: parseFloat(cs.lineHeight) }
    }))
    /* le ch du navigateur est l'avance du « 0 » ; vingt zéros rendus s'en écartent d'un rien (crénage) : 2 % */
    ok(parseFloat(m[0].maxW), 28 * m[0].ch, `${W} — courte : 28 ch`, 0.02 * 28 * m[0].ch)
    ok(parseFloat(m[1].maxW), 65 * m[1].ch, `${W} — juste : ${REGISTRE.texte.measure}`, 0.02 * 65 * m[1].ch); assert.equal(REGISTRE.texte.measure, '65ch')
    assert.equal(m[2].maxW, 'none'); ok(m[2].w, m[2].parent, `${W} — sans borne : toute la largeur`, 0.5)
    for (const [i, x] of m.entries()) { ok(x.n, Math.round(x.w / x.ch), `${W} — compteur ${i}`, 1); ok(x.fs, attendu('font-size-body', W), `${W} — corps ${i}`); ok(x.lh / x.fs, 1.6, `${W} — interligne ${i}`, 0.01) }
    await fermer()
  }
})
test('2 · la gazette est fer à gauche, corps ≥ 16, interligne ≥ 1,5, capitales espacées par le style ; l’arbre décale d’une marge de carte ; le champ est au corps', async () => {
  for (const W of LARGEURS) {
    const { p, fermer } = await nav.page(URL(), { largeur: W })
    const g = await p.evaluate(() => { const p = document.querySelector('#gazette .gz-cols p'), cs = getComputedStyle(p); return { align: cs.textAlign, fs: parseFloat(cs.fontSize), lh: parseFloat(cs.lineHeight) } })
    assert.ok(['start', 'left'].includes(g.align), `${W} — fer : ${g.align}`); assert.ok(g.fs >= 16 - TOL, `${W} — corps ${g.fs}`); ok(g.fs, attendu('font-size-body', W), `${W} — corps = body`)
    assert.ok(g.lh / g.fs >= 1.5, `${W} — interligne ${g.lh / g.fs}`)
    const date = await p.evaluate(() => { const cs = getComputedStyle(document.querySelector('#gazette .gz-date')); return { t: cs.textTransform, ls: parseFloat(cs.letterSpacing), fs: parseFloat(cs.fontSize) } })
    assert.equal(date.t, 'uppercase'); ok(date.ls, 0.08 * date.fs, `${W} — interlettrage 0,08 em`, 0.02); ok(date.fs, attendu('font-size-small', W), `${W} — date au petit cran`)
    ok(await calcPx(p, '#gazette .gz-mast', 'fontSize'), attendu('font-size-display', W), `${W} — manchette en affiche`)
    ok(await calcPx(p, '#gazette .gazette', 'paddingTop'), attendu('pad-1-block', W), `${W} — la feuille est une coque`); ok(await calcPx(p, '#gazette .gazette', 'borderTopLeftRadius'), attendu('r-1', W), `${W} — coin de coque`)
    ok(await calcPx(p, '#garde .gd-arbre-niveau', 'paddingInlineStart'), attendu('pad-2-inline', W), `${W} — un niveau = la marge de carte`)
    ok(await calcPx(p, '#garde .champ input', 'fontSize'), attendu('font-size-body', W), `${W} — le champ au corps`)
    ok(await calcPx(p, '#voix .gd-vbloc', 'paddingTop'), attendu('pad-1-block', W), `${W} — la voix est une coque`)
    await fermer()
  }
})
test('2 · la feuille de la page consomme, pour chaque preuve, le jeton qu’elle nomme', () => {
  const css = fs.readFileSync(path.join(KIT, 'app/typo/typo.css'), 'utf8')
  const bloc = (sel) => { const i = css.indexOf(`\n${sel} {`); assert.ok(i >= 0, `sélecteur absent : ${sel}`); return css.slice(i, css.indexOf('}', i)) }
  const attend = (sel, decl) => assert.ok(bloc(sel).includes(decl), `${sel} : « ${decl} » attendu`)
  attend('.gazette', 'padding: var(--pad-1-block) var(--pad-1-inline)'); attend('.gazette', 'border-radius: var(--r-1)')
  attend('.gz-cols p', 'font-size: var(--font-size-body)'); attend('.gz-cols p', 'line-height: var(--leading-body)'); attend('.gz-cols p', 'text-align: start')
  attend('.gz-date', 'letter-spacing: var(--tracking-label)'); attend('.gd-arbre-niveau', 'padding-inline-start: var(--pad-2-inline)')
  attend('.gd-vbloc', 'padding: var(--pad-1-block) var(--pad-1-inline)'); attend('.gd-mesure p', 'font-size: var(--font-size-body)')
  for (const sel of ['.gazette.j-cassee .gz-cols p', '.gazette.i-cassee .gz-cols p']) assert.match(css.slice(css.indexOf(sel), css.indexOf('\n', css.indexOf(sel))), /casse/, `${sel} : casse dite`)
})

/* ── 3 · Les casses rendent le mensonge qu'elles déclarent, et se réparent ── */
test('3 · nom orphelin, justifier, étouffer, saut de niveau, graisse, capitales, champ à 14 px — chacune déclarée, rendue, réparée', async () => {
  const W = 1440
  const { p, fermer } = await nav.page(URL(), { largeur: W })
  const casse = (sec, n = 0) => p.locator(`${sec} .bouton.casse`).nth(n)
  /* le nom orphelin */
  await casse('#voix').click()
  assert.equal(await p.getAttribute('#voix .gd-voix', 'data-intent'), 'statement')
  assert.match(await calc(p, '#voix .gd-vbloc.primaire .gd-vglyphe', 'fontFamily'), /^"Geist Text"/)
  assert.match(await texte(p, '#voix .badge.ko'), /orphelin/)
  await casse('#voix').click(); assert.equal(await p.getAttribute('#voix .gd-voix', 'data-intent'), null); assert.match(await calc(p, '#voix .gd-vbloc.primaire .gd-vglyphe', 'fontFamily'), /^"?Geist"?,/)
  /* justifier, puis étouffer — l'une remplace l'autre */
  await casse('#gazette', 0).click()
  assert.equal(await p.getAttribute('#gazette .gazette', 'data-intent'), 'statement'); assert.equal(await calc(p, '#gazette .gz-cols p', 'textAlign'), 'justify')
  await casse('#gazette', 1).click()
  assert.equal(await calc(p, '#gazette .gz-cols p', 'textAlign'), 'start', 'justifier se répare quand étouffer prend')
  const fs = await calcPx(p, '#gazette .gz-cols p', 'fontSize'); ok(await calcPx(p, '#gazette .gz-cols p', 'lineHeight'), 1.15 * fs, 'étouffé : 1,15', 0.1)
  assert.match(await texte(p, '#gazette .badge.ko'), /1,15/)
  await casse('#gazette', 1).click(); assert.equal(await p.getAttribute('#gazette .gazette', 'data-intent'), null); ok(await calcPx(p, '#gazette .gz-cols p', 'lineHeight'), 1.6 * fs, 'réparé : 1,6', 0.1)
  /* le saut de niveau */
  const carte = (i) => `#garde .gd-gardes .carte:nth-child(${i})`
  await p.locator(`${carte(2)} .bouton.casse`).click()
  assert.deepEqual(await textes(p, `${carte(2)} .gd-arbre-rang`), ['h1 · Le dossier', 'h2 · Première partie', 'h4 · Un détail', 'h2 · Deuxième partie'])
  assert.ok((await p.locator(`${carte(2)} .gd-arbre-rang.ko`).count()) === 1 && /h3 manquant/.test(await texte(p, `${carte(2)} .gd-arbre-note`)))
  await p.locator(`${carte(2)} .bouton.casse`).click(); assert.equal(await p.locator(`${carte(2)} .gd-arbre-rang.ko`).count(), 0)
  /* la graisse */
  ok(await calcPx(p, `${carte(3)} p`, 'fontWeight'), 400, 'graisse au repos')
  await p.locator(`${carte(3)} .bouton.casse`).click(); ok(await calcPx(p, `${carte(3)} p`, 'fontWeight'), 600, 'graisse cassée'); assert.equal(await p.getAttribute(`${carte(3)} p`, 'data-intent'), 'statement')
  await p.locator(`${carte(3)} .bouton.casse`).click(); ok(await calcPx(p, `${carte(3)} p`, 'fontWeight'), 400, 'graisse réparée')
  /* les capitales */
  assert.equal(await calc(p, `${carte(4)} p`, 'textTransform'), 'none')
  await p.locator(`${carte(4)} .bouton.casse`).click(); assert.equal(await calc(p, `${carte(4)} p`, 'textTransform'), 'uppercase'); assert.equal(await p.getAttribute(`${carte(4)} p`, 'data-intent'), 'statement')
  await p.locator(`${carte(4)} .bouton.casse`).click(); assert.equal(await calc(p, `${carte(4)} p`, 'textTransform'), 'none')
  /* le champ */
  await p.locator(`${carte(5)} .bouton.casse`).click(); ok(await calcPx(p, `${carte(5)} input`, 'fontSize'), 14, 'champ à 14'); assert.equal(await p.getAttribute(`${carte(5)} input`, 'data-intent'), 'statement'); assert.match(await texte(p, `${carte(5)} .badge.ko`), /14 px/)
  await p.locator(`${carte(5)} .bouton.casse`).click(); ok(await calcPx(p, `${carte(5)} input`, 'fontSize'), attendu('font-size-body', W), 'champ réparé')
  await fermer()
})

/* ── 4 · La densité ne touche pas au texte ; les titres glissent ── */
test('4 · la densité change les marges des coques, jamais un corps ; l’affiche et les sections glissent avec l’écran', async () => {
  const W = 1440
  const ref = await nav.page(URL(), { largeur: W })
  const crans = await ref.p.evaluate(() => [...document.querySelectorAll('#gamme .gd-gcran .spec')].map((e) => parseFloat(getComputedStyle(e).fontSize)))
  await ref.fermer()
  for (const densite of ['compact', 'airy']) {
    const { p, fermer } = await nav.page(URL(), { largeur: W, densite })
    const c = await p.evaluate(() => [...document.querySelectorAll('#gamme .gd-gcran .spec')].map((e) => parseFloat(getComputedStyle(e).fontSize)))
    liste(c, crans, `${densite} — les crans ne bougent pas`, TOL)
    ok(await calcPx(p, '#gazette .gazette', 'paddingTop'), attendu('pad-1-block', W, DENSITES[densite]), `${densite} — la feuille suit la base`)
    ok(await calcPx(p, '#gazette .gz-cols p', 'fontSize'), attendu('font-size-body', W), `${densite} — le corps de la gazette ne bouge pas`)
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
    assert.ok(combien >= 10, `${theme} : ${combien} emplois du tertiaire`)
    await fermer()
  }
})

/* ── 6 · Rien en dur ── */
test('6 · marges, espaces, coins ET tailles de texte : chaque valeur calculée est une valeur du moteur à cette largeur (déclarées exceptées) ; zéro débord ; zéro erreur', async () => {
  const css = fs.readFileSync(path.join(KIT, 'app/typo/typo.css'), 'utf8') + fs.readFileSync(path.join(KIT, 'app/globals.css'), 'utf8')
  const exclusions = selecteursDeclares(css, 'font-size')
  for (const W of LARGEURS) {
    const { p, fermer, erreurs } = await nav.page(URL(), { largeur: W })
    for (const s of ['#voix', '#gamme', '#mesure', '#gazette', '#garde', '#adaptation']) await p.locator(`${s} details.prov summary`).click()
    const f = await fautesEnDur(p, W, DENSITES.comfortable)
    assert.deepEqual(f, [], `${W} px : ${f.length} valeur(s) hors moteur`)
    const t = await fautesTailles(p, W, { exclusions, admis: [corps(W)] })
    assert.deepEqual(t, [], `${W} px : ${t.length} taille(s) hors moteur`)
    assert.deepEqual(erreurs, [], 'la page ne jette aucune erreur')
    assert.equal(await debord(p), 0, `${W} px : la page déborde de l'écran`)
    await fermer()
  }
})
