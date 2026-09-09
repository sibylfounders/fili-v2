/* LE CRASH-TEST DE LA PAGE TYPO — kit/tests/typo.test.mjs
   Ce qui doit être vrai à l'écran, mesuré sans l'œil (plan validé par
   l'Auteur le 26 août 2026) :
   1 · chaque chiffre affiché sort du moteur ;
   2 · chaque preuve est rendue par son propre token (crans, voix, mesure, gazette, arbre, champ) ;
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
   sous un sous-titre), la liste (#invisibles) et les tokens (#code). Épreuve 8 :
   l'écriture — aucun mot qui commande ou décrit, pas d'histoire de page, pas de
   pied, un seul répertoire, aucun saut de niveau de titre ; et le compte des
   pièces.                                                                     */
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { chain, tokens, aWidth, AXES, CHARTER, DENSITIES, WIDTH_MIN, WIDTH_MAX, REGISTRY, WEIGHT } from '../derivation.mjs'
import { KIT, WIDTHS, TOL, openSite, openBrowser, expected, near, numbers, calcPx, calc, text, texts, faultsC17, faultsInHard, faultsSizes, selectorsDeclaredAll, overflow, rgb, inks, faultsWriting } from './bench.mjs'

const J = tokens(chain())
const ok = (a, b, msg, tol = TOL) => assert.ok(a !== null && near(a, b, tol), `${msg} : ${a} attendu ${b}`)
const list = (a, b, msg, tol = 0.051) => { assert.equal(a.length, b.length, `${msg} : ${a.length} nombres, ${b.length} attendus (${a} / ${b})`); a.forEach((v, i) => ok(v, b[i], `${msg} [${i}]`, tol)) }
const rounded = (v) => Math.round(v * 10) / 10
/* le corps que la page calcule à la largeur réelle de l'écran (carte du zoom) — la courbe du moteur */
const body = (W, zoom = 1) => aWidth(16, 'type', W / zoom, 16) * zoom
const STEPS = ['doc-cover', 'doc-section', 'font-size-display', 'font-size-h1', 'font-size-h2', 'font-size-h3', 'font-size-body', 'font-size-small']

let site, nav
before(async () => { site = await openSite(); nav = await openBrowser() })
after(async () => { await nav?.close(); site?.close() })
const URL = () => site.url + '/typo'

/* ── 1 · Chaque chiffre affiché sort du moteur ── */
test('1 · les huit fiches de l’échelle et sa légende disent les bornes, le rapport et le glissement du moteur', async () => {
  const { p, close } = await nav.page(URL())
  /* la fiche : « nom · bornes… » — on lit après le nom (« h1 » porte un chiffre qui n'est pas une borne) */
  const records = (await texts(p, '#range .gd-gstep .record')).map((f) => f.replace(/^[^·]*·\s*/, ''))
  assert.equal(records.length, 8, 'huit crans')
  const b = (n) => [J[n].bottom, J[n].top].map(rounded)
  list(numbers(records[0]), [rounded(J['font-size-section'].bottom), rounded(J['font-size-cover-max'].top)], 'couverture')
  list(numbers(records[1]), [rounded(J['font-size-h1'].bottom), rounded(J['font-size-section'].top)], 'section')
  for (const [i, n] of [[2, 'display'], [3, 'h1'], [4, 'h2'], [5, 'h3']]) list(numbers(records[i]), b(`font-size-${n}`), n)
  list(numbers(records[6]), [...b('font-size-body'), 1.6], 'body')
  assert.equal(REGISTRY.text['leading-body'], '1.6')
  list(numbers(records[7]), b('font-size-small'), 'small')
  /* la légende tient en UNE ligne (verdict d'Auteur, 2 septembre) : le rapport ; le détail — bornes,
     glissement — est descendu au dépliant, et c'est là qu'on le lit */
  const caption = await text(p, '#range .gd-caption')
  assert.ok(caption.includes(`× ${String(CHARTER.intervalHeadings).replace('.', ',')}`), `légende : « × ${CHARTER.intervalHeadings} »`)
  const disclosure = await text(p, '#range details.prov')
  for (const expected of [`bas à ${WIDTH_MIN} px`, `haut à ${WIDTH_MAX}`, `× ${String(AXES.type.max).replace('.', ',')}`]) assert.ok(disclosure.includes(expected), `dépliant : « ${expected} »`)
  /* les règles T4 et T10 citent le moteur, pas une valeur recopiée */
  const rules = await p.evaluate(() => [...document.querySelectorAll('#range details .badge, #gazette details .badge')].map((b) => b.parentElement.parentElement.textContent).join('\n'))
  assert.ok(rules.includes(`× ${String(CHARTER.intervalHeadings).replace('.', ',')}`) && rules.includes(`× ${String(AXES.type.max).replace('.', ',')} entre ${WIDTH_MIN} et ${WIDTH_MAX} px`), 'T4')
  assert.ok(rules.includes(`jamais ${String(rounded(16 * AXES.type.min)).replace('.', ',')}`) && rules.includes(`(${String(J['font-size-small'].base).replace('.', ',')})`), 'T10')
  await close()
})
/* La carte du zoom s'ouvre ALLUMÉE au ×2 depuis le 31 août : « la démo montre
   ce qui doit tenir sous zoom, pas l'état de repos » (verdict d'Auteur). Ce
   n'est pas un détail d'affichage — c'est l'état par défaut de la preuve, et
   l'épreuve le dit comme tel. Elle éprouve donc les trois états, dans l'ordre
   où la page les propose : le zoom, le repos, la casse. */
test('1 · le zoom, deux côtés : au repos la droite rend le corps du moteur au ×2 et la gauche celui du ×1 ; « Agrandir le texte » rejoue depuis ×1 et revient au même corps', async () => {
  for (const W of WIDTHS) {
    const { p, close } = await nav.page(URL(), { width: W })
    const card = '#wreck .doc-band:nth-child(1)'
    const bad = `${card} .demo-side.bad`, good = `${card} .demo-side.good`
    const render = (side) => calcPx(p, `${side} .tp-zoom-text`, 'fontSize')
    const read = () => text(p, `${good} .mono.muted`, 0).then((t) => numbers(t.replace(/.*=/, ''))[0])
    /* au repos, chaque côté montre ce que son verdict dit */
    ok(await render(good), body(W, 2), `${W} — droite : ×2 rendu`); ok(await read(), rounded(body(W, 2)), `${W} — ×2 affiché`)
    ok(await render(bad), body(W), `${W} — gauche : vw seul au zoom ×2, le corps de ×1`)
    assert.equal(await p.getAttribute(bad, 'data-intent'), 'statement')
    assert.match(await text(p, `${bad} .mono.muted`), /zoom ×2/)
    /* l'action rejoue : les deux repartent de ×1, la droite remonte à ×2, la gauche ne bouge pas */
    await p.locator(`${card} .demo-go`).click()
    await p.waitForTimeout(1600) /* la pause du rejeu (600) puis le cran d’une section (700) */
    ok(await render(good), body(W, 2), `${W} — rejoué : exactement le même corps`)
    ok(await render(bad), body(W), `${W} — rejoué : la gauche n’a pas bougé`)
    await close()
  }
})
test('1 · dans la vue, toute taille posée en ligne est un token ou le corps calculé, ou sa ligne (ou la précédente) dit « casse »', () => {
  const src = fs.readFileSync(path.join(KIT, 'app/typo/view.tsx'), 'utf8').split('\n')
  const faults = []
  src.forEach((l, i) => {
    for (const m of l.matchAll(/fontSize:\s*(`[^`]*`|"[^"]*"|[^,}]+)/g)) {
      if (/var\(--|\$\{body\w*\}|\btoken\b/.test(m[1])) continue
      if (/casse|broken/.test(l) || /casse|broken/.test(src[i - 1] ?? '')) continue
      faults.push(`vue.tsx:${i + 1} ${m[1]}`)
    }
  })
  assert.deepEqual(faults, [])
})

/* ── 2 · Chaque preuve est rendue par son propre token ── */
test('2 · les huit rangs de l’échelle valent leur cran à chaque largeur ; les crans de texte descendent strictement, l’échelle entière à l’écran large', async () => {
  for (const W of WIDTHS) {
    const { p, close } = await nav.page(URL(), { width: W })
    const sizes = await p.evaluate(() => [...document.querySelectorAll('#range .gd-gstep .spec')].map((e) => parseFloat(getComputedStyle(e).fontSize)))
    assert.equal(sizes.length, 8)
    STEPS.forEach((n, i) => ok(sizes[i], expected(n, W), `${W} — cran ${n}`))
    /* les six crans de texte descendent toujours ; les deux titres du site ont leur pente à eux (intention déclarée) :
       à 320 la section vaut h1, sous l'affiche — l'ordre complet ne tient qu'à l'écran large */
    for (let i = 3; i < 8; i++) assert.ok(sizes[i] < sizes[i - 1], `${W} — le cran ${i} n'est pas plus petit que le précédent (${sizes})`)
    assert.ok(sizes[0] > sizes[2] && sizes[1] >= sizes[3], `${W} — la couverture domine l'affiche, la section ne descend pas sous h1 (${sizes})`)
    if (W === WIDTH_MAX) for (let i = 1; i < 8; i++) assert.ok(sizes[i] < sizes[i - 1], `${W} — l'échelle entière descend (${sizes})`)
    await close()
  }
})
test('2 · les deux voix sont Geist et JetBrains Mono, réellement chargées ; chaque fonte déclarée a son fichier au dépôt, au nom près (T11)', async () => {
  const { p, close } = await nav.page(URL())
  const families = await p.evaluate(() => ({
    body: getComputedStyle(document.body).fontFamily, reads: getComputedStyle(document.querySelector('#fonts .gd-vblock.primary .gd-vglyph')).fontFamily,
    figure: getComputedStyle(document.querySelector('#fonts .gd-vblock.dark .gd-vglyph')).fontFamily,
    geist: document.fonts.check('16px Geist'), mono: document.fonts.check('16px "JetBrains Mono"'),
    loaded: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family),
  }))
  assert.match(families.body, /^"?Geist"?,/); assert.match(families.reads, /^"?Geist"?,/); assert.match(families.figure, /^"JetBrains Mono",/)
  assert.ok(families.geist && families.mono, 'fonts.check')
  assert.ok(families.loaded.includes('Geist') && families.loaded.includes('JetBrains Mono'), `fontes chargées : ${families.loaded}`)
  /* T11, au dépôt : la feuille des fontes ne déclare que des fichiers présents, sous les noms du registre */
  const css = fs.readFileSync(path.join(KIT, 'app/fonts.css'), 'utf8')
  for (const m of css.matchAll(/url\((\/fontes\/[^)]+)\)/g)) assert.ok(fs.existsSync(path.join(KIT, 'public', m[1])), `fichier absent : ${m[1]}`)
  const declaredAll = [...css.matchAll(/font-family:\s*"([^"]+)"/g)].map((m) => m[1])
  for (const f of ['Geist', 'JetBrains Mono']) assert.ok(declaredAll.includes(f), `${f} déclarée`)
  assert.ok(REGISTRY.fonts['font-sans'].startsWith('"Geist"') && REGISTRY.fonts['font-mono'].startsWith('"JetBrains Mono"'))
  await close()
})
test('2 · la mesure, dans son cadre : la courte à 28 ch, la juste à la mesure du registre, la sans-borne suit le cadre — le compteur recompte juste, et le verdict est LU sur la ligne rendue, pas décidé par le bouton', async () => {
  for (const W of [768, 1440]) {
    const { p, close } = await nav.page(URL(), { width: W })
    /* un cas à la fois (verdict d'Auteur, 2 septembre : « c'est trop haut ») : trois boutons, la même ligne */
    const read = () => p.evaluate(() => {
      const d = document.querySelector('#measure .gd-measure'), p = d.querySelector('p'), cs = getComputedStyle(p)
      const z = document.createElement('span'); z.textContent = '0'.repeat(20); z.style.cssText = 'position:absolute;visibility:hidden;white-space:pre'; p.appendChild(z)
      const ch = z.getBoundingClientRect().width / 20; z.remove()
      const track = d.querySelector('.gd-measure-track').getBoundingClientRect().width
      const bound = d.querySelector('.gd-measure-bound'), bw = bound.getBoundingClientRect().width, hidden = getComputedStyle(bound).visibility === 'hidden'
      return { maxW: cs.maxWidth, w: p.getBoundingClientRect().width, ch, track, bound: bw, boundHidden: hidden, verdict: d.querySelector('.badge').textContent.trim(),
        n: parseInt(d.querySelector('.mono.muted').textContent.match(/≈ (\d+)/)[1]), fs: parseFloat(cs.fontSize), lh: parseFloat(cs.lineHeight) }
    })
    const instance = async (name) => { await p.locator('#measure .demo-bar .button', { hasText: name }).click(); await p.waitForTimeout(150); return read() }
    const m = { short: await instance('Trop court'), right: await instance('Juste'), sans: await instance('Sans borne') }
    /* le ch du navigateur est l'avance du « 0 » ; vingt zéros rendus s'en écartent d'un rien (crénage) : 2 % */
    ok(parseFloat(m.short.maxW), 28 * m.short.ch, `${W} — courte : 28 ch`, 0.02 * 28 * m.short.ch)
    ok(parseFloat(m.right.maxW), 65 * m.right.ch, `${W} — juste : ${REGISTRY.text.measure}`, 0.02 * 65 * m.right.ch); assert.equal(REGISTRY.text.measure, '65ch')
    assert.equal(m.sans.maxW, 'none'); ok(m.sans.w, m.sans.track, `${W} — sans borne : tout le cadre`, 0.5)
    for (const [name, x] of Object.entries(m)) { ok(x.n, Math.round(x.w / x.ch), `${W} — compteur ${name}`, 1); ok(x.fs, expected('font-size-body', W), `${W} — corps ${name}`); ok(x.lh / x.fs, 1.6, `${W} — interligne ${name}`, 0.01) }
    /* le trait est la borne du registre, à sa vraie largeur — et il s'efface quand elle sort du cadre */
    for (const x of Object.values(m)) { ok(x.bound, Math.min(65 * x.ch, x.track), `${W} — le trait est la borne du registre, jamais plus large que le cadre`, 0.02 * 65 * x.ch); assert.equal(x.boundHidden, x.bound >= x.track - 1, `${W} — le trait s'efface hors du cadre`) }
    /* le verdict suit la ligne, pas le bouton : la courte n'est « trop courte » que si sa borne mord ;
       la juste n'est « juste » que si la borne est dans le cadre ; la sans-borne n'est « trop longue »
       que si la ligne a franchi le trait — sinon, dans les trois cas, « l'écran suffit » */
    assert.equal(m.short.verdict, m.short.w < m.short.track - 1 ? 'Trop court' : 'L’écran suffit', `${W} — verdict de la courte`)
    assert.equal(m.right.verdict, m.right.boundHidden ? 'L’écran suffit' : 'Juste', `${W} — verdict de la juste`)
    assert.equal(m.sans.verdict, m.sans.w > m.sans.bound + 1 ? 'Trop long' : 'L’écran suffit', `${W} — verdict de la sans-borne`)
    await close()
  }
})
test('2 · la gazette est fer à gauche, corps ≥ 16, interligne ≥ 1,5, capitales espacées par le style ; l’arbre décale d’une marge de carte ; le champ est au corps', async () => {
  for (const W of WIDTHS) {
    const { p, close } = await nav.page(URL(), { width: W })
    const g = await p.evaluate(() => { const p = document.querySelector('#gazette .gz-cols p'), cs = getComputedStyle(p); return { align: cs.textAlign, fs: parseFloat(cs.fontSize), lh: parseFloat(cs.lineHeight) } })
    assert.ok(['start', 'left'].includes(g.align), `${W} — fer : ${g.align}`); assert.ok(g.fs >= 16 - TOL, `${W} — corps ${g.fs}`); ok(g.fs, expected('font-size-body', W), `${W} — corps = body`)
    assert.ok(g.lh / g.fs >= 1.5, `${W} — interligne ${g.lh / g.fs}`)
    const date = await p.evaluate(() => { const cs = getComputedStyle(document.querySelector('#gazette .gz-date')); return { t: cs.textTransform, ls: parseFloat(cs.letterSpacing), fs: parseFloat(cs.fontSize) } })
    assert.equal(date.t, 'uppercase'); ok(date.ls, 0.08 * date.fs, `${W} — interlettrage 0,08 em`, 0.02); ok(date.fs, expected('font-size-small', W), `${W} — date au petit cran`)
    ok(await calcPx(p, '#gazette .gz-mast', 'fontSize'), expected('font-size-display', W), `${W} — manchette en affiche`)
    ok(await calcPx(p, '#gazette .gazette', 'paddingTop'), expected('pad-1-block', W), `${W} — la feuille est une coque`); ok(await calcPx(p, '#gazette .gazette', 'borderTopLeftRadius'), expected('r-1', W), `${W} — coin de coque`)
    ok(await calcPx(p, '#wreck .gd-tree-level', 'paddingInlineStart'), expected('pad-2-inline', W), `${W} — un niveau = la marge de carte`)
    ok(await calcPx(p, '#wreck .demo-side.good .tp-scene.field input', 'fontSize'), expected('font-size-body', W), `${W} — le champ au corps`)
    ok(await calcPx(p, '#fonts .gd-vblock', 'paddingTop'), expected('pad-1-block', W), `${W} — la voix est une coque`)
    /* la carte calée (4 septembre) : une seule valeur d'espace, des quatre côtés — celle de la coque */
    ok(await calcPx(p, '#wreck .demo-side.good .tp-alignment', 'paddingTop'), expected('pad-1-inline', W), `${W} — la carte calée, une valeur des quatre côtés`)
    ok(await calcPx(p, '#wreck .demo-side.good .tp-alignment', 'paddingLeft'), expected('pad-1-inline', W), `${W} — la carte calée, le côté`)
    await close()
  }
})
test('2 · la feuille de la page consomme, pour chaque preuve, le token qu’elle nomme', () => {
  const css = fs.readFileSync(path.join(KIT, 'app/typo/typo.css'), 'utf8')
  const block = (sel) => { const i = css.indexOf(`\n${sel} {`); assert.ok(i >= 0, `sélecteur absent : ${sel}`); return css.slice(i, css.indexOf('}', i)) }
  const waits = (sel, decl) => assert.ok(block(sel).includes(decl), `${sel} : « ${decl} » attendu`)
  waits('.gazette', 'padding: var(--pad-1-block) var(--pad-1-inline)'); waits('.gazette', 'border-radius: var(--r-1)')
  waits('.gz-cols p', 'font-size: var(--font-size-body)'); waits('.gz-cols p', 'line-height: var(--leading-body)'); waits('.gz-cols p', 'text-align: start')
  waits('.gz-date', 'letter-spacing: var(--tracking-label)'); waits('.gd-tree-level', 'padding-inline-start: var(--pad-2-inline)')
  waits('.gd-vblock', 'padding: var(--pad-1-block) var(--pad-1-inline)'); waits('.gd-measure p', 'font-size: var(--font-size-body)')
  for (const sel of ['.gazette.j-broken .gz-cols p', '.gazette.i-broken .gz-cols p']) assert.match(css.slice(css.indexOf(sel), css.indexOf('\n', css.indexOf(sel))), /casse|broken/, `${sel} : casse dite`)
})

/* ── 3 · Les casses rendent le mensonge qu'elles déclarent, et se réparent ── */
test('3 · nom orphelin, justifier, étouffer — déclarés, rendus, réparés ; saut de niveau, graisse, capitales, champ à 14 px, calage — le faux et le juste côte à côte, le faux déclaré', async () => {
  const W = 1440
  const { p, close } = await nav.page(URL(), { width: W })
  /* les preuves du haut de page vivent dans le cadre : l'action dans la tête, le verdict au-dessus de la scène */
  const go = (sec) => p.locator(`${sec} .demo-go`)
  /* le nom orphelin */
  await go('#fonts').click()
  assert.equal(await p.getAttribute('#fonts .gd-voice', 'data-intent'), 'statement')
  assert.match(await calc(p, '#fonts .gd-vblock.primary .gd-vglyph', 'fontFamily'), /^"Geist Text"/)
  assert.match(await text(p, '#fonts .demo-single.bad .demo-verdict'), /n'existe pas/)
  await go('#fonts').click(); assert.equal(await p.getAttribute('#fonts .gd-voice', 'data-intent'), null); assert.match(await calc(p, '#fonts .gd-vblock.primary .gd-vglyph', 'fontFamily'), /^"?Geist"?,/)
  assert.equal(await p.locator('#fonts .demo-single.neutral').count(), 1, 'réparé : le verdict redevient neutre')
  /* justifier (l'action), puis étouffer (le réglage sous la scène) — les deux se cumulent, le verdict les nomme */
  await go('#gazette').click()
  assert.equal(await p.getAttribute('#gazette .gazette', 'data-intent'), 'statement'); assert.equal(await calc(p, '#gazette .gz-cols p', 'textAlign'), 'justify')
  await p.locator('#gazette .demo-seg .button', { hasText: '1,15' }).click()
  assert.equal(await calc(p, '#gazette .gz-cols p', 'textAlign'), 'justify', 'les deux fautes se cumulent')
  const fs = await calcPx(p, '#gazette .gz-cols p', 'fontSize'); ok(await calcPx(p, '#gazette .gz-cols p', 'lineHeight'), 1.15 * fs, 'étouffé : 1,15', 0.1)
  assert.equal(await p.locator('#gazette .demo-single.bad').count(), 1, 'cassée : la scène est déclarée'); assert.match(await text(p, '#gazette .demo-caption'), /1,15/)
  await go('#gazette').click(); await p.locator('#gazette .demo-seg .button', { hasText: '1,6' }).click()
  assert.equal(await p.getAttribute('#gazette .gazette', 'data-intent'), null); ok(await calcPx(p, '#gazette .gz-cols p', 'lineHeight'), 1.6 * fs, 'réparé : 1,6', 0.1)
  /* les bandes (#casser) : la commande qui casse est celle du gabarit commun */
  const card = (i) => `#wreck .doc-band:nth-child(${i})`
  const bad = (i) => `${card(i)} .demo-side.bad`, good = (i) => `${card(i)} .demo-side.good`
  /* chaque bande : deux côtés, le faux déclaré (data-intent), le juste non ; le bouton en pointillé a disparu */
  assert.equal(await p.locator('#wreck .doc-wreck').count(), 0, 'plus de bouton « Casser » dans les bandes')
  for (const i of [2, 3, 4, 5, 6]) {
    assert.equal(await p.getAttribute(bad(i), 'data-intent'), 'statement', `bande ${i} : le faux se déclare`)
    assert.equal(await p.getAttribute(good(i), 'data-intent'), null, `bande ${i} : le juste ne se déclare pas`)
  }
  /* le saut de niveau */
  assert.deepEqual(await texts(p, `${bad(2)} .gd-tree-rank`), ['h1 · Le dossier', 'h2 · Première partie', 'h4 · Un détail', 'h2 · Deuxième partie'])
  assert.equal(await p.locator(`${bad(2)} .gd-tree-rank.ko`).count(), 1)
  assert.equal(await p.locator(`${good(2)} .gd-tree-rank.ko`).count(), 0)
  /* la graisse — la scène d'une bande : son paragraphe, pas la parole de gauche */
  ok(await calcPx(p, `${bad(3)} .tp-scene p`, 'fontWeight'), 600, 'graisse cassée')
  ok(await calcPx(p, `${good(3)} .tp-scene p`, 'fontWeight'), 400, 'graisse juste')
  /* les capitales */
  assert.equal(await calc(p, `${bad(4)} .tp-scene p`, 'textTransform'), 'uppercase')
  assert.equal(await calc(p, `${good(4)} .tp-scene p`, 'textTransform'), 'none')
  /* le champ */
  ok(await calcPx(p, `${bad(5)} input`, 'fontSize'), 14, 'champ à 14')
  ok(await calcPx(p, `${good(5)} input`, 'fontSize'), expected('font-size-body', W), 'champ au corps')
  /* le calage (4 septembre) : à droite, le haut mesuré sur la font livrée vaut les côtés ; à gauche, l'air de
     la ligne revient et le haut dépasse — les deux nombres sont MESURÉS sur la page, jamais déclarés.
     La mesure n'existe que si le navigateur du banc sait caler ; sinon la page le dit, et l'épreuve le lit. */
  const knows = await p.evaluate(() => CSS.supports('text-box-trim', 'trim-both'))
  const alignment = (sel) => p.evaluate((sel) => { const c = document.querySelector(sel), t = c.querySelector('.tp-witness'), cs = getComputedStyle(c)
    return { top: t.getBoundingClientRect().top - c.getBoundingClientRect().top, side: parseFloat(cs.paddingLeft) + parseFloat(cs.borderLeftWidth), says: [...c.querySelectorAll('.tp-cote-label')].map((l) => l.textContent).join(' · ') } }, sel)
  if (knows) {
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(100)
    const rest = await alignment(`${good(6)} .tp-alignment`); ok(rest.top, rest.side, 'calé : le haut vaut les côtés', 1)
    ok(numbers(rest.says)[0], rest.top, `calé, la page le dit : ${rest.says}`, 0.5)
    assert.equal(await p.locator(`${good(6)} .tp-line`).count(), 2, 'les lignes de la font : capitales, ligne de base'); assert.equal(await p.locator(`${good(6)} .tp-box`).count(), 1, 'la boîte mesurée')
    const broken = await alignment(`${bad(6)} .tp-alignment`); assert.ok(broken.top > broken.side + 2, `cassé : l'air revient au-dessus (${broken.top} > ${broken.side})`)
    ok(numbers(broken.says)[0], broken.top, `cassé, la page lit le haut : ${broken.says}`, 0.5)
  } else assert.match(await text(p, `${good(6)} .badge`), /ne sait pas encore caler/)
  await close()
})

/* ── 7 · La graisse (8 septembre) : une seule taille, et deux fonds ── */
test('7 · la liste au corps unique : un seul corps, les graisses du moteur (titre · courant · étiquette), l’encre seconde au sous-titre ; « égaliser » ramène tout au courant et à l’encre première, puis se répare', async () => {
  const W = 1440
  const { p, close } = await nav.page(URL(), { width: W })
  const bodyExpected = expected('font-size-body', W)
  for (const sel of ['.tp-sub-name', '.tp-sub-sub', '.tp-sub-button']) ok(await calcPx(p, `#weight ${sel}`, 'fontSize'), bodyExpected, `${sel} au corps`)
  ok(await calcPx(p, '#weight .tp-sub-name', 'fontWeight'), WEIGHT.roles.heading, 'le nom porte la graisse du titre')
  ok(await calcPx(p, '#weight .tp-sub-sub', 'fontWeight'), WEIGHT.roles.body, 'le sous-titre porte la graisse du courant')
  ok(await calcPx(p, '#weight .tp-sub-button', 'fontWeight'), WEIGHT.roles.label, 'le bouton porte la graisse de l’étiquette')
  assert.equal(await calc(p, '#weight .tp-sub-sub', 'color'), rgb(inks('light')['text-secondary']), 'le sous-titre est en encre seconde')
  /* la légende dit les trois graisses du moteur */
  const caption = await text(p, '#weight .demo-caption')
  for (const v of Object.values(WEIGHT.roles)) assert.ok(caption.includes(String(v)), `légende : ${v}`)
  /* égaliser : la casse est déclarée, tout tombe au courant et à l'encre première */
  await p.locator('#weight .demo-go').nth(0).click()
  assert.equal(await p.getAttribute('#weight .tp-subs', 'data-intent'), 'statement')
  ok(await calcPx(p, '#weight .tp-sub-name', 'fontWeight'), WEIGHT.roles.body, 'égalisé : le nom au courant')
  ok(await calcPx(p, '#weight .tp-sub-button', 'fontWeight'), WEIGHT.roles.body, 'égalisé : le bouton au courant')
  assert.equal(await calc(p, '#weight .tp-sub-sub', 'color'), rgb(inks('light')['text-primary']), 'égalisé : le sous-titre en encre première')
  assert.match(await text(p, '#weight .demo-single.bad .demo-verdict'), /plus rien ne se distingue/)
  await p.locator('#weight .demo-go').nth(0).click()
  assert.equal(await p.getAttribute('#weight .tp-subs', 'data-intent'), null)
  ok(await calcPx(p, '#weight .tp-sub-name', 'fontWeight'), WEIGHT.roles.heading, 'réparé')
  await close()
})

test('7 · deux fonds, deux graisses : le versant sombre est un vrai thème sombre, allégé de l’écart du registre ; le curseur ne repeint que lui ; « la même graisse » est la casse, et se répare', async () => {
  const W = 1440
  const { p, close } = await nav.page(URL(), { width: W })
  const light = '#weight .tp-background.light > p', black = '#weight .tp-background.black > p'
  ok(await calcPx(p, light, 'fontWeight'), WEIGHT.roles.body, 'clair : la graisse du courant')
  ok(await calcPx(p, black, 'fontWeight'), WEIGHT.dark('body'), 'sombre : allégé de l’écart du registre')
  /* le versant sombre porte les encres du thème sombre, pas une couleur de scène */
  assert.equal(await calc(p, '#weight .tp-background.black', 'backgroundColor'), rgb(inks('dark')['bg']))
  assert.equal(await calc(p, black, 'color'), rgb(inks('dark')['text-primary']))
  assert.equal(await calc(p, '#weight .tp-background.light', 'backgroundColor'), rgb(inks('light')['bg']))
  /* le token lui-même, dans les deux thèmes, tel que tokens.css le sert */
  const token = await p.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--weight-body').trim())
  assert.equal(token, String(WEIGHT.roles.body), 'la page claire sert la graisse claire')
  /* le curseur : l'écart affiché est celui du registre, et il repeint la carte sombre seule */
  assert.match(await text(p, '#weight .tp-wheel output'), new RegExp(`−${WEIGHT.gapDark}`))
  await p.locator('#tp-gap').fill('60')
  ok(await calcPx(p, black, 'fontWeight'), WEIGHT.roles.body - 60, 'curseur à 60 : le sombre suit')
  ok(await calcPx(p, light, 'fontWeight'), WEIGHT.roles.body, 'curseur à 60 : le clair ne bouge pas')
  assert.match(await text(p, '#weight .tp-background.black .mono'), /60/)
  /* la casse : la même graisse sur les deux fonds */
  await p.locator('#weight .demo-go').nth(1).click()
  assert.equal(await p.getAttribute('#weight .tp-background.black', 'data-intent'), 'statement')
  ok(await calcPx(p, black, 'fontWeight'), WEIGHT.roles.body, 'cassé : la même graisse')
  assert.match(await text(p, '#weight .demo-single.bad .demo-verdict'), /pèse plus/)
  assert.ok(await p.locator('#tp-gap').isDisabled(), 'cassé : l’écart ne se règle pas')
  await p.locator('#weight .demo-go').nth(1).click()
  assert.equal(await p.getAttribute('#weight .tp-background.black', 'data-intent'), null)
  ok(await calcPx(p, black, 'fontWeight'), WEIGHT.roles.body - 60, 'réparé : l’écart du curseur revient')
  await close()
})

/* ── 4 · La densité ne touche pas au texte ; les titres glissent ── */
test('4 · la densité change les marges des coques, jamais un corps ; l’affiche et les sections glissent avec l’écran', async () => {
  const W = 1440
  const ref = await nav.page(URL(), { width: W })
  const steps = await ref.p.evaluate(() => [...document.querySelectorAll('#range .gd-gstep .spec')].map((e) => parseFloat(getComputedStyle(e).fontSize)))
  await ref.close()
  for (const density of ['compact', 'airy']) {
    const { p, close } = await nav.page(URL(), { width: W, density })
    const c = await p.evaluate(() => [...document.querySelectorAll('#range .gd-gstep .spec')].map((e) => parseFloat(getComputedStyle(e).fontSize)))
    list(c, steps, `${density} — les crans ne bougent pas`, TOL)
    ok(await calcPx(p, '#gazette .gazette', 'paddingTop'), expected('pad-1-block', W, DENSITIES[density]), `${density} — la feuille suit la base`)
    ok(await calcPx(p, '#gazette .gz-cols p', 'fontSize'), expected('font-size-body', W), `${density} — le corps de la gazette ne bouge pas`)
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
test('5 · dans les deux thèmes, tout tertiaire rendu porte le rôle titre au moins (allégé en sombre), au cran étiquette au moins, jamais un paragraphe lu', async () => {
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
test('6 · marges, espaces, coins ET tailles de texte : chaque valeur calculée est une valeur du moteur à cette largeur (déclarées exceptées) ; zéro débord ; zéro erreur', async () => {
  const css = fs.readFileSync(path.join(KIT, 'app/typo/typo.css'), 'utf8') + fs.readFileSync(path.join(KIT, 'app/globals.css'), 'utf8')
  const exclusions = selectorsDeclaredAll(css, 'font-size')
  for (const W of WIDTHS) {
    const { p, close, errors } = await nav.page(URL(), { width: W })
    /* chaque bande porte son propre dépliant : on les ouvre tous, d'un coup */
    await p.evaluate(() => document.querySelectorAll('details.prov').forEach((d) => { d.open = true }))
    await p.waitForTimeout(120)
    const f = await faultsInHard(p, W, DENSITIES.comfortable, { exclusions: selectorsDeclaredAll(css, 'padding') }) /* les pastilles des cotes : réduction déclarée */
    assert.deepEqual(f, [], `${W} px : ${f.length} valeur(s) hors moteur`)
    /* la seule taille hors gamme admise sur cette page est le corps calculé de la carte
       du zoom — et la page s'ouvre au ×2 (31 août) : c'est CETTE valeur-là qui est rendue */
    const t = await faultsSizes(p, W, { exclusions, allowed: [body(W, 2)] })
    assert.deepEqual(t, [], `${W} px : ${t.length} taille(s) hors moteur`)
    assert.deepEqual(errors, [], 'la page ne jette aucune erreur')
    assert.equal(await overflow(p), 0, `${W} px : la page déborde de l'écran`)
    await close()
  }
})

/* ── 8 · L'écriture et le répertoire ── */
test('8 · l’écriture : aucun mot qui commande ou décrit l’écran, pas d’histoire de page, pas de pied, un seul répertoire au titre de la page, aucun saut de niveau ; six dérives en h4, treize règles, douze tokens', async () => {
  const { p, close } = await nav.page(URL(), { width: 1440 })
  assert.deepEqual(await faultsWriting(p), [])
  assert.equal(await p.locator('#registry #wreck h4.doc-band-name').count(), 6, 'six dérives, chacune sous le sous-titre en h4')
  assert.equal(await p.locator('#registry #invisibles .doc-list tbody tr').count(), 13, 'treize règles en liste')
  assert.equal(await p.locator('#code .doc-code tbody tr').count(), 12, 'douze tokens')
  assert.equal(await p.locator('main .gdoc-sec').count(), 7, 'cinq preuves, un répertoire, le code')
  assert.equal(await p.locator('#registry .doc-piece-head h3').count(), 2, 'deux pièces, chacune sous son sous-titre')
  await close()
})
