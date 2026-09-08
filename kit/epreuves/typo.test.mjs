/* LE CRASH-TEST DE LA PAGE TYPO — kit/epreuves/typo.test.mjs
   Ce qui doit être vrai à l'écran, mesuré sans l'œil (plan validé par
   l'Auteur le 26 août 2026) :
   1 · chaque chiffre affiché sort du moteur ;
   2 · chaque preuve est rendue par son propre jeton (crans, voix, mesure, gazette, arbre, champ) ;
   3 · chaque casse rend le mensonge qu'elle déclare, et se répare ;
   4 · la densité ne touche pas au texte ; les titres glissent ;
   5 · le tertiaire suit C17 ;
   6 · rien en dur — marges, espaces, coins, et tailles de texte.

   Remise à niveau du 1er septembre 2026 : la carte du zoom s'ouvre allumée au
   ×2 depuis le 31 août. L'épreuve ne redescend pas au repos pour passer — elle
   dit l'état par défaut de la preuve, et éprouve les trois états.

   Remise à niveau du 7 septembre 2026 : la page a pris les quatre étages (2 et
   3 septembre) — les gardes sont devenues des bandes (#casser), les voix vivent
   sous #fonts, la mesure se joue dans un cadre à poignée, un cas à la fois, et
   son verdict se LIT sur la ligne rendue au lieu d'être décidé par le bouton ;
   la légende de l'échelle tient en une ligne, le détail est au dépliant ; et
   une sixième bande, le calage (4 septembre), mesure ses deux bords sur la font
   livrée. Aucune épreuve n'a été relâchée pour passer : la mesure gagne le
   verdict lu et le calage.

   Remise à niveau du 8 septembre 2026 : la page a une section à part, la
   graisse (#graisse, décision d'Auteur) — la liste au corps unique, où seules
   la graisse et l'encre font la hiérarchie, et les deux fonds, où le versant
   sombre est un vrai thème sombre allégé de l'écart du registre. Épreuve 7 :
   les graisses rendues sont celles du moteur, la casse égalise et se répare,
   le curseur ne repeint que la carte sombre.

   Rééquilibrage du 8 septembre 2026 (soir, instructions d'Auteur) : la queue
   en trois sections communes aux pages a disparu ; la page porte UN répertoire
   (#registre) sous un titre à elle, qui range les six dérives (#casser, en h4
   sous un sous-titre), la liste (#invisibles) et les jetons (#code). Épreuve 8 :
   l'écriture — aucun mot qui commande ou décrit, pas d'histoire de page, pas de
   pied, un seul répertoire, aucun saut de niveau de titre ; et le compte des
   pièces.                                                                     */
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { chaine, jetons, aLargeur, AXES, CHARTE, DENSITES, LARGEUR_MIN, LARGEUR_MAX, REGISTRE, GRAISSE } from '../derivation.mjs'
import { KIT, LARGEURS, TOL, ouvrirSite, ouvrirNavigateur, attendu, proche, nombres, calcPx, calc, texte, textes, fautesC17, fautesEnDur, fautesTailles, selecteursDeclares, debord, rgb, encres, fautesEcriture } from './banc.mjs'

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
  /* la légende tient en UNE ligne (verdict d'Auteur, 2 septembre) : le rapport ; le détail — bornes,
     glissement — est descendu au dépliant, et c'est là qu'on le lit */
  const legende = await texte(p, '#gamme .gd-legende')
  assert.ok(legende.includes(`× ${String(CHARTE.intervalleTitres).replace('.', ',')}`), `légende : « × ${CHARTE.intervalleTitres} »`)
  const depliant = await texte(p, '#gamme details.prov')
  for (const attendu of [`bas à ${LARGEUR_MIN} px`, `haut à ${LARGEUR_MAX}`, `× ${String(AXES.type.max).replace('.', ',')}`]) assert.ok(depliant.includes(attendu), `dépliant : « ${attendu} »`)
  /* les règles T4 et T10 citent le moteur, pas une valeur recopiée */
  const regles = await p.evaluate(() => [...document.querySelectorAll('#gamme details .badge, #gazette details .badge')].map((b) => b.parentElement.parentElement.textContent).join('\n'))
  assert.ok(regles.includes(`× ${String(CHARTE.intervalleTitres).replace('.', ',')}`) && regles.includes(`× ${String(AXES.type.max).replace('.', ',')} entre ${LARGEUR_MIN} et ${LARGEUR_MAX} px`), 'T4')
  assert.ok(regles.includes(`jamais ${String(arrondi(16 * AXES.type.min)).replace('.', ',')}`) && regles.includes(`(${String(J['font-size-small'].base).replace('.', ',')})`), 'T10')
  await fermer()
})
/* La carte du zoom s'ouvre ALLUMÉE au ×2 depuis le 31 août : « la démo montre
   ce qui doit tenir sous zoom, pas l'état de repos » (verdict d'Auteur). Ce
   n'est pas un détail d'affichage — c'est l'état par défaut de la preuve, et
   l'épreuve le dit comme tel. Elle éprouve donc les trois états, dans l'ordre
   où la page les propose : le zoom, le repos, la casse. */
test('1 · la carte du zoom s’ouvre au ×2 : le corps affiché et le corps rendu sont ceux du moteur à la largeur réelle ; l’éteindre redescend au repos ; « vw seul » ne gagne pas un pixel', async () => {
  for (const W of LARGEURS) {
    const { p, fermer } = await nav.page(URL(), { largeur: W })
    const carte = '#casser .doc-bande:nth-child(1)'
    const zoom = () => p.locator(`${carte} .bouton`, { hasText: '×2' })
    const lu = () => texte(p, `${carte} .mono.sourd`, 0).then((t) => nombres(t.replace(/.*=/, ''))[0])
    const rendu = () => calcPx(p, `${carte} [style*="font-size"]`, 'fontSize')
    assert.equal(await zoom().getAttribute('aria-pressed'), 'true', `${W} — le zoom est allumé d’entrée`)
    ok(await lu(), arrondi(corps(W, 2)), `${W} — ×2 affiché`); ok(await rendu(), corps(W, 2), `${W} — ×2 rendu`)
    /* l'état de repos existe toujours, il n'est simplement plus le premier montré */
    await zoom().click()
    assert.equal(await zoom().getAttribute('aria-pressed'), 'false', `${W} — le zoom s’éteint`)
    ok(await lu(), arrondi(corps(W)), `${W} — repos affiché`); ok(await rendu(), corps(W), `${W} — repos rendu`)
    await zoom().click()
    ok(await rendu(), corps(W, 2), `${W} — rallumé : exactement le même corps`)
    /* la casse, au zoom : tout en vw, la part d'écran ne bouge pas, le texte non plus */
    await p.locator(`${carte} .doc-casser`).click()
    assert.equal(await p.getAttribute(`${carte} [style*="font-size"]`, 'data-intent'), 'statement')
    ok(await rendu(), corps(W), `${W} — vw seul au zoom ×2 : le corps de ×1`)
    assert.match(await texte(p, `${carte} .badge.ko`), /pas un pixel/)
    await p.locator(`${carte} .doc-casser`).click()
    ok(await rendu(), corps(W, 2), `${W} — réparé : le corps du zoom revient`)
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
    corps: getComputedStyle(document.body).fontFamily, lit: getComputedStyle(document.querySelector('#fonts .gd-vbloc.primaire .gd-vglyphe')).fontFamily,
    chiffre: getComputedStyle(document.querySelector('#fonts .gd-vbloc.sombre .gd-vglyphe')).fontFamily,
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
test('2 · la mesure, dans son cadre : la courte à 28 ch, la juste à la mesure du registre, la sans-borne suit le cadre — le compteur recompte juste, et le verdict est LU sur la ligne rendue, pas décidé par le bouton', async () => {
  for (const W of [768, 1440]) {
    const { p, fermer } = await nav.page(URL(), { largeur: W })
    /* un cas à la fois (verdict d'Auteur, 2 septembre : « c'est trop haut ») : trois boutons, la même ligne */
    const lire = () => p.evaluate(() => {
      const d = document.querySelector('#mesure .gd-mesure'), p = d.querySelector('p'), cs = getComputedStyle(p)
      const z = document.createElement('span'); z.textContent = '0'.repeat(20); z.style.cssText = 'position:absolute;visibility:hidden;white-space:pre'; p.appendChild(z)
      const ch = z.getBoundingClientRect().width / 20; z.remove()
      const piste = d.querySelector('.gd-mesure-piste').getBoundingClientRect().width
      const borne = d.querySelector('.gd-mesure-borne'), bw = borne.getBoundingClientRect().width, cachee = getComputedStyle(borne).visibility === 'hidden'
      return { maxW: cs.maxWidth, w: p.getBoundingClientRect().width, ch, piste, borne: bw, borneCachee: cachee, verdict: d.querySelector('.badge').textContent.trim(),
        n: parseInt(d.querySelector('.mono.sourd').textContent.match(/≈ (\d+)/)[1]), fs: parseFloat(cs.fontSize), lh: parseFloat(cs.lineHeight) }
    })
    const cas = async (nom) => { await p.locator('#mesure .apercu-outils .bouton', { hasText: nom }).click(); await p.waitForTimeout(150); return lire() }
    const m = { court: await cas('Trop court'), juste: await cas('Juste'), sans: await cas('Sans borne') }
    /* le ch du navigateur est l'avance du « 0 » ; vingt zéros rendus s'en écartent d'un rien (crénage) : 2 % */
    ok(parseFloat(m.court.maxW), 28 * m.court.ch, `${W} — courte : 28 ch`, 0.02 * 28 * m.court.ch)
    ok(parseFloat(m.juste.maxW), 65 * m.juste.ch, `${W} — juste : ${REGISTRE.texte.measure}`, 0.02 * 65 * m.juste.ch); assert.equal(REGISTRE.texte.measure, '65ch')
    assert.equal(m.sans.maxW, 'none'); ok(m.sans.w, m.sans.piste, `${W} — sans borne : tout le cadre`, 0.5)
    for (const [nom, x] of Object.entries(m)) { ok(x.n, Math.round(x.w / x.ch), `${W} — compteur ${nom}`, 1); ok(x.fs, attendu('font-size-body', W), `${W} — corps ${nom}`); ok(x.lh / x.fs, 1.6, `${W} — interligne ${nom}`, 0.01) }
    /* le trait est la borne du registre, à sa vraie largeur — et il s'efface quand elle sort du cadre */
    for (const x of Object.values(m)) { ok(x.borne, Math.min(65 * x.ch, x.piste), `${W} — le trait est la borne du registre, jamais plus large que le cadre`, 0.02 * 65 * x.ch); assert.equal(x.borneCachee, x.borne >= x.piste - 1, `${W} — le trait s'efface hors du cadre`) }
    /* le verdict suit la ligne, pas le bouton : la courte n'est « trop courte » que si sa borne mord ;
       la juste n'est « juste » que si la borne est dans le cadre ; la sans-borne n'est « trop longue »
       que si la ligne a franchi le trait — sinon, dans les trois cas, « l'écran suffit » */
    assert.equal(m.court.verdict, m.court.w < m.court.piste - 1 ? 'Trop court' : 'L’écran suffit', `${W} — verdict de la courte`)
    assert.equal(m.juste.verdict, m.juste.borneCachee ? 'L’écran suffit' : 'Juste', `${W} — verdict de la juste`)
    assert.equal(m.sans.verdict, m.sans.w > m.sans.borne + 1 ? 'Trop long' : 'L’écran suffit', `${W} — verdict de la sans-borne`)
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
    ok(await calcPx(p, '#casser .gd-arbre-niveau', 'paddingInlineStart'), attendu('pad-2-inline', W), `${W} — un niveau = la marge de carte`)
    ok(await calcPx(p, '#casser .tp-scene.champ input', 'fontSize'), attendu('font-size-body', W), `${W} — le champ au corps`)
    ok(await calcPx(p, '#fonts .gd-vbloc', 'paddingTop'), attendu('pad-1-block', W), `${W} — la voix est une coque`)
    /* la carte calée (4 septembre) : une seule valeur d'espace, des quatre côtés — celle de la coque */
    ok(await calcPx(p, '#casser .tp-calage', 'paddingTop'), attendu('pad-1-inline', W), `${W} — la carte calée, une valeur des quatre côtés`)
    ok(await calcPx(p, '#casser .tp-calage', 'paddingLeft'), attendu('pad-1-inline', W), `${W} — la carte calée, le côté`)
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
test('3 · nom orphelin, justifier, étouffer, saut de niveau, graisse, capitales, champ à 14 px, calage — chacune déclarée, rendue, réparée', async () => {
  const W = 1440
  const { p, fermer } = await nav.page(URL(), { largeur: W })
  const casse = (sec, n = 0) => p.locator(`${sec} .bouton.casse`).nth(n)
  /* le nom orphelin */
  await casse('#fonts').click()
  assert.equal(await p.getAttribute('#fonts .gd-voix', 'data-intent'), 'statement')
  assert.match(await calc(p, '#fonts .gd-vbloc.primaire .gd-vglyphe', 'fontFamily'), /^"Geist Text"/)
  assert.match(await texte(p, '#fonts .badge.ko'), /orphelin/)
  await casse('#fonts').click(); assert.equal(await p.getAttribute('#fonts .gd-voix', 'data-intent'), null); assert.match(await calc(p, '#fonts .gd-vbloc.primaire .gd-vglyphe', 'fontFamily'), /^"?Geist"?,/)
  /* justifier, puis étouffer — l'une remplace l'autre */
  await casse('#gazette', 0).click()
  assert.equal(await p.getAttribute('#gazette .gazette', 'data-intent'), 'statement'); assert.equal(await calc(p, '#gazette .gz-cols p', 'textAlign'), 'justify')
  await casse('#gazette', 1).click()
  assert.equal(await calc(p, '#gazette .gz-cols p', 'textAlign'), 'start', 'justifier se répare quand étouffer prend')
  const fs = await calcPx(p, '#gazette .gz-cols p', 'fontSize'); ok(await calcPx(p, '#gazette .gz-cols p', 'lineHeight'), 1.15 * fs, 'étouffé : 1,15', 0.1)
  assert.match(await texte(p, '#gazette .badge.ko'), /1,15/)
  await casse('#gazette', 1).click(); assert.equal(await p.getAttribute('#gazette .gazette', 'data-intent'), null); ok(await calcPx(p, '#gazette .gz-cols p', 'lineHeight'), 1.6 * fs, 'réparé : 1,6', 0.1)
  /* les bandes (#casser) : la commande qui casse est celle du gabarit commun */
  const carte = (i) => `#casser .doc-bande:nth-child(${i})`
  const casser = (i) => p.locator(`${carte(i)} .doc-casser`).click()
  /* le saut de niveau */
  await casser(2)
  assert.deepEqual(await textes(p, `${carte(2)} .gd-arbre-rang`), ['h1 · Le dossier', 'h2 · Première partie', 'h4 · Un détail', 'h2 · Deuxième partie'])
  assert.ok((await p.locator(`${carte(2)} .gd-arbre-rang.ko`).count()) === 1 && /h3 manquant/.test(await texte(p, `${carte(2)} .gd-arbre-note`)))
  await casser(2); assert.equal(await p.locator(`${carte(2)} .gd-arbre-rang.ko`).count(), 0)
  /* la graisse */
  /* la scène d'une bande : son paragraphe, pas la parole de gauche */
  const scene = (i) => `${carte(i)} .tp-scene p`
  ok(await calcPx(p, scene(3), 'fontWeight'), 400, 'graisse au repos')
  await casser(3); ok(await calcPx(p, scene(3), 'fontWeight'), 600, 'graisse cassée'); assert.equal(await p.getAttribute(scene(3), 'data-intent'), 'statement')
  await casser(3); ok(await calcPx(p, scene(3), 'fontWeight'), 400, 'graisse réparée')
  /* les capitales */
  assert.equal(await calc(p, scene(4), 'textTransform'), 'none')
  await casser(4); assert.equal(await calc(p, scene(4), 'textTransform'), 'uppercase'); assert.equal(await p.getAttribute(scene(4), 'data-intent'), 'statement')
  await casser(4); assert.equal(await calc(p, scene(4), 'textTransform'), 'none')
  /* le champ */
  await casser(5); ok(await calcPx(p, `${carte(5)} input`, 'fontSize'), 14, 'champ à 14'); assert.equal(await p.getAttribute(`${carte(5)} input`, 'data-intent'), 'statement'); assert.match(await texte(p, `${carte(5)} .badge.ko`), /14 px/)
  await casser(5); ok(await calcPx(p, `${carte(5)} input`, 'fontSize'), attendu('font-size-body', W), 'champ réparé')
  /* le calage (4 septembre) : au repos, le haut mesuré sur la font livrée vaut les côtés ; cassé, l'air de
     la ligne revient et le haut dépasse — les deux nombres sont MESURÉS sur la page, jamais déclarés.
     La mesure n'existe que si le navigateur du banc sait caler ; sinon la page le dit, et l'épreuve le lit. */
  const sait = await p.evaluate(() => CSS.supports('text-box-trim', 'trim-both'))
  const calage = () => p.evaluate(() => { const c = document.querySelector('#casser .tp-calage'), t = c.querySelector('.tp-temoin'), cs = getComputedStyle(c)
    return { haut: t.getBoundingClientRect().top - c.getBoundingClientRect().top, cote: parseFloat(cs.paddingLeft) + parseFloat(cs.borderLeftWidth), dit: c.parentElement.querySelector('.badge, .mono.sourd').textContent } })
  if (sait) {
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(100)
    const repos = await calage(); ok(repos.haut, repos.cote, 'calé : le haut vaut les côtés', 1)
    assert.ok(nombres(repos.dit).length >= 2 && Math.abs(nombres(repos.dit)[0] - nombres(repos.dit)[1]) <= 1, `calé, la page le dit : ${repos.dit}`)
    await casser(6); await p.waitForTimeout(100)
    assert.equal(await p.getAttribute('#casser .tp-calage', 'data-intent'), 'statement')
    const casse = await calage(); assert.ok(casse.haut > casse.cote + 2, `cassé : l'air revient au-dessus (${casse.haut} > ${casse.cote})`)
    assert.match(await texte(p, `${carte(6)} .badge.ko`), /n’est plus celle qu’on voit|n'est plus celle qu'on voit/)
    await casser(6); await p.waitForTimeout(100); const repare = await calage(); ok(repare.haut, repare.cote, 'réparé : le haut revient aux côtés', 1)
  } else assert.match(await texte(p, `${carte(6)} .badge`), /ne sait pas encore caler/)
  await fermer()
})

/* ── 7 · La graisse (8 septembre) : une seule taille, et deux fonds ── */
test('7 · la liste au corps unique : un seul corps, les graisses du moteur (titre · courant · étiquette), l’encre seconde au sous-titre ; « égaliser » ramène tout au courant et à l’encre première, puis se répare', async () => {
  const W = 1440
  const { p, fermer } = await nav.page(URL(), { largeur: W })
  const corpsAttendu = attendu('font-size-body', W)
  for (const sel of ['.tp-abo-nom', '.tp-abo-sous', '.tp-abo-bouton']) ok(await calcPx(p, `#graisse ${sel}`, 'fontSize'), corpsAttendu, `${sel} au corps`)
  ok(await calcPx(p, '#graisse .tp-abo-nom', 'fontWeight'), GRAISSE.roles.heading, 'le nom porte la graisse du titre')
  ok(await calcPx(p, '#graisse .tp-abo-sous', 'fontWeight'), GRAISSE.roles.body, 'le sous-titre porte la graisse du courant')
  ok(await calcPx(p, '#graisse .tp-abo-bouton', 'fontWeight'), GRAISSE.roles.label, 'le bouton porte la graisse de l’étiquette')
  assert.equal(await calc(p, '#graisse .tp-abo-sous', 'color'), rgb(encres('light')['text-secondary']), 'le sous-titre est en encre seconde')
  /* la légende dit les trois graisses du moteur */
  const legende = await texte(p, '#graisse .gd-legende')
  for (const v of Object.values(GRAISSE.roles)) assert.ok(legende.includes(String(v)), `légende : ${v}`)
  /* égaliser : la casse est déclarée, tout tombe au courant et à l'encre première */
  await p.locator('#graisse .bouton.casse').nth(0).click()
  assert.equal(await p.getAttribute('#graisse .tp-abos', 'data-intent'), 'statement')
  ok(await calcPx(p, '#graisse .tp-abo-nom', 'fontWeight'), GRAISSE.roles.body, 'égalisé : le nom au courant')
  ok(await calcPx(p, '#graisse .tp-abo-bouton', 'fontWeight'), GRAISSE.roles.body, 'égalisé : le bouton au courant')
  assert.equal(await calc(p, '#graisse .tp-abo-sous', 'color'), rgb(encres('light')['text-primary']), 'égalisé : le sous-titre en encre première')
  assert.match(await texte(p, '#graisse .badge.ko'), /plus rien ne se distingue/)
  await p.locator('#graisse .bouton.casse').nth(0).click()
  assert.equal(await p.getAttribute('#graisse .tp-abos', 'data-intent'), null)
  ok(await calcPx(p, '#graisse .tp-abo-nom', 'fontWeight'), GRAISSE.roles.heading, 'réparé')
  await fermer()
})

test('7 · deux fonds, deux graisses : le versant sombre est un vrai thème sombre, allégé de l’écart du registre ; le curseur ne repeint que lui ; « la même graisse » est la casse, et se répare', async () => {
  const W = 1440
  const { p, fermer } = await nav.page(URL(), { largeur: W })
  const clair = '#graisse .tp-fond.clair > p', noir = '#graisse .tp-fond.noir > p'
  ok(await calcPx(p, clair, 'fontWeight'), GRAISSE.roles.body, 'clair : la graisse du courant')
  ok(await calcPx(p, noir, 'fontWeight'), GRAISSE.sombre('body'), 'sombre : allégé de l’écart du registre')
  /* le versant sombre porte les encres du thème sombre, pas une couleur de scène */
  assert.equal(await calc(p, '#graisse .tp-fond.noir', 'backgroundColor'), rgb(encres('dark')['bg']))
  assert.equal(await calc(p, noir, 'color'), rgb(encres('dark')['text-primary']))
  assert.equal(await calc(p, '#graisse .tp-fond.clair', 'backgroundColor'), rgb(encres('light')['bg']))
  /* le jeton lui-même, dans les deux thèmes, tel que tokens.css le sert */
  const jeton = await p.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--weight-body').trim())
  assert.equal(jeton, String(GRAISSE.roles.body), 'la page claire sert la graisse claire')
  /* le curseur : l'écart affiché est celui du registre, et il repeint la carte sombre seule */
  assert.match(await texte(p, '#graisse .tp-molette output'), new RegExp(`−${GRAISSE.ecartSombre}`))
  await p.locator('#tp-ecart').fill('60')
  ok(await calcPx(p, noir, 'fontWeight'), GRAISSE.roles.body - 60, 'curseur à 60 : le sombre suit')
  ok(await calcPx(p, clair, 'fontWeight'), GRAISSE.roles.body, 'curseur à 60 : le clair ne bouge pas')
  assert.match(await texte(p, '#graisse .tp-fond.noir .mono'), /60/)
  /* la casse : la même graisse sur les deux fonds */
  await p.locator('#graisse .bouton.casse').nth(1).click()
  assert.equal(await p.getAttribute('#graisse .tp-fond.noir', 'data-intent'), 'statement')
  ok(await calcPx(p, noir, 'fontWeight'), GRAISSE.roles.body, 'cassé : la même graisse')
  assert.match(await texte(p, '#graisse .tp-fond.noir .badge.ko'), /pèse plus/)
  assert.ok(await p.locator('#tp-ecart').isDisabled(), 'cassé : l’écart ne se règle pas')
  await p.locator('#graisse .bouton.casse').nth(1).click()
  assert.equal(await p.getAttribute('#graisse .tp-fond.noir', 'data-intent'), null)
  ok(await calcPx(p, noir, 'fontWeight'), GRAISSE.roles.body - 60, 'réparé : l’écart du curseur revient')
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
    /* chaque bande porte son propre dépliant : on les ouvre tous, d'un coup */
    await p.evaluate(() => document.querySelectorAll('details.prov').forEach((d) => { d.open = true }))
    await p.waitForTimeout(120)
    const f = await fautesEnDur(p, W, DENSITES.comfortable)
    assert.deepEqual(f, [], `${W} px : ${f.length} valeur(s) hors moteur`)
    /* la seule taille hors gamme admise sur cette page est le corps calculé de la carte
       du zoom — et la page s'ouvre au ×2 (31 août) : c'est CETTE valeur-là qui est rendue */
    const t = await fautesTailles(p, W, { exclusions, admis: [corps(W, 2)] })
    assert.deepEqual(t, [], `${W} px : ${t.length} taille(s) hors moteur`)
    assert.deepEqual(erreurs, [], 'la page ne jette aucune erreur')
    assert.equal(await debord(p), 0, `${W} px : la page déborde de l'écran`)
    await fermer()
  }
})

/* ── 8 · L'écriture et le répertoire ── */
test('8 · l’écriture : aucun mot qui commande ou décrit l’écran, pas d’histoire de page, pas de pied, un seul répertoire au titre de la page, aucun saut de niveau ; six dérives en h4, treize règles, douze jetons', async () => {
  const { p, fermer } = await nav.page(URL(), { largeur: 1440 })
  assert.deepEqual(await fautesEcriture(p), [])
  assert.equal(await p.locator('#registre #casser h4.doc-bande-nom').count(), 6, 'six dérives, chacune sous le sous-titre en h4')
  assert.equal(await p.locator('#registre #invisibles .doc-liste tbody tr').count(), 13, 'treize règles en liste')
  assert.equal(await p.locator('#registre #code .doc-code tbody tr').count(), 12, 'douze jetons')
  assert.equal(await p.locator('main .gdoc-sec').count(), 6, 'cinq preuves et un répertoire')
  assert.equal(await p.locator('#registre .doc-piece-tete h3').count(), 3, 'trois pièces, chacune sous son sous-titre')
  await fermer()
})
