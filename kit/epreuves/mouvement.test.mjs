/* LE CRASH-TEST DE LA PAGE MOUVEMENT — kit/epreuves/mouvement.test.mjs
   Ce qui doit être vrai à l'écran, mesuré sans l'œil (écrit le 7 septembre
   2026, avec la page) :
   1 · chaque chiffre affiché est LU, jamais déclaré — les quatre durées de la
       légende sont celles que le rendu joue, et le retard de la molette qui ment
       est l'écart réel entre les deux barres, image par image ;
   2 · chaque pièce du kit est rendue par son jeton : la fiche est une carte, le
       cadre une surface, le menu une card, la paire deux colonnes de coque ;
   3 · tout ce qui bouge sur la page prend un cran du moteur et la courbe du kit —
       sauf ce qui se déclare casse, et chaque casse dit sa faute sur sa ligne ;
   4 · chaque casse rend le mensonge qu'elle déclare, et le verdict est DÉDUIT du
       rendu : les sept mots, les quatre bandes ;
   5 · sous mouvement réduit, les déplacements partent et les fondus restent —
       mesuré dans les deux réglages ; et trois des sept mots cessent d'être
       des fautes, parce que leur faute était un déplacement ;
   6 · la densité règle les coques, jamais un corps ; les titres glissent ; le
       tertiaire suit C17 ; rien en dur ; zéro débord ; zéro erreur ; la page est
       une fondation dans le menu, et ses étages sont comptés.

   Ce que cette épreuve NE juge PAS, et dit : si 100 ms « se sent » et si 700
   « s'attend ». Une durée se juge à l'œil ; l'épreuve vérifie seulement que la
   page joue bien celles qu'elle annonce. */
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { DENSITES, MOUVEMENT } from '../derivation.mjs'
import { KIT, LARGEURS, TOL, ouvrirSite, ouvrirNavigateur, attendu, proche, calcPx, calc, texte, textes, fautesC17, fautesEnDur, fautesTailles, selecteursDeclares, selecteursEnEm, lignesAvecSelecteur, debord } from './banc.mjs'

const ok = (a, b, msg, tol = TOL) => assert.ok(a !== null && proche(a, b, tol), `${msg} : ${a} attendu ${b}`)
const CSS = () => fs.readFileSync(path.join(KIT, 'app/mouvement/mouvement.css'), 'utf8')
const GLOBALES = () => fs.readFileSync(path.join(KIT, 'app/globals.css'), 'utf8')
const MS = Object.values(MOUVEMENT.durees).map((d) => d.ms)
const enMs = (s) => { const v = parseFloat(s); return s.trim().endsWith('ms') ? v : v * 1000 }

let site, nav
before(async () => { site = await ouvrirSite(); nav = await ouvrirNavigateur() })
after(async () => { await nav?.fermer(); site?.fermer() })
const URL = () => site.url + '/mouvement'
/* Le banc ouvre tout sous mouvement réduit. Cette page a besoin des deux
   réglages : une page « libre » est la même, sans la demande de réduction. */
async function pageLibre(url, { largeur = 1440 } = {}) {
  const ctx = await nav.navigateur.newContext({ viewport: { width: largeur, height: 900 }, reducedMotion: 'no-preference' })
  await ctx.addInitScript(() => { try { localStorage.clear(); localStorage.setItem('kit-theme', 'light') } catch {} })
  const p = await ctx.newPage()
  const erreurs = []
  p.on('pageerror', (e) => erreurs.push(String(e)))
  await p.goto(url, { waitUntil: 'networkidle' })
  await p.evaluate(() => document.fonts.ready)
  return { p, erreurs, fermer: () => ctx.close() }
}
const glisser = (p, valeur) => p.evaluate((v) => {
  const dial = document.querySelector('#mv-cred')
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(dial, v)
  dial.dispatchEvent(new Event('input', { bubbles: true }))
}, valeur)
const mot = (p, texteMot) => p.locator('#mots .mv-mots .bouton', { hasText: texteMot }).click()
const verdictMot = (p) => p.getAttribute('#mots .badge[data-verdict]', 'data-verdict')
const bande = (i) => `#casser .doc-bande:nth-child(${i})`
const casser = (p, i) => p.locator(`${bande(i)} .doc-casser`).click()
const badge = (p, i) => texte(p, `${bande(i)} .mv-scene .badge`)

/* ── 1 · Chaque chiffre affiché est lu ── */
test('1 · la légende des quatre durées lit sur le rendu ce que chaque cadre joue, et ce sont les quatre crans du moteur', async () => {
  const { p, fermer } = await nav.page(URL(), { largeur: 1440 })
  await p.waitForTimeout(300)
  const jouees = await p.$$eval('#durees .mv-pose', (es) => es.map((e) => getComputedStyle(e).transitionDuration.split(',')[0]))
  assert.deepEqual(jouees.map(enMs), MS, 'les cadres jouent les quatre crans, dans l\'ordre du moteur')
  const legende = await texte(p, '#durees .gd-legende')
  assert.match(legende, new RegExp(`^${MS.join(' · ')} ms, lus sur le rendu`), `la légende dit ce qui est joué : « ${legende.slice(0, 40)} »`)
  const tetes = await textes(p, '#durees .mv-cadre-tete b')
  assert.deepEqual(tetes.map(parseFloat), MS, 'chaque cadre porte sa durée, lue au moteur')
  assert.deepEqual(await textes(p, '#durees .mv-cadre-tete span'), Object.values(MOUVEMENT.durees).map((d) => d.emploi), 'et son emploi')
  await fermer()
})
test('1 · la molette qui ment : la barre de droite est en retard sur la gauche, image par image, puis la rejoint — le badge dit le retard mesuré, jamais un chiffre déclaré', async () => {
  const { p, fermer } = await nav.page(URL(), { largeur: 1440 })
  await p.locator('#mv-cred').scrollIntoViewIfNeeded(); await p.waitForTimeout(150)
  const avant = await texte(p, '#molette .mv-scene > .badge')
  assert.match(avant, /glissez la molette/, 'au repos, aucune faute')
  await glisser(p, 20)
  /* on regarde les deux barres pendant douze images, et le badge à chaque image */
  const film = await p.evaluate(() => new Promise((res) => {
    const lire = () => { const [g, d] = [...document.querySelectorAll('#molette .mv-jauge-barre')].map((e) => e.getBoundingClientRect().width); return { g, d, badge: document.querySelector('#molette .mv-scene > .badge').textContent } }
    const out = []; let n = 0
    const pas = () => { out.push(lire()); if (++n < 14) requestAnimationFrame(pas); else res(out) }
    requestAnimationFrame(pas)
  }))
  const ecarts = film.map((f) => Math.abs(f.g - f.d))
  assert.ok(ecarts[0] > 5, `à la première image, la droite est loin derrière : ${ecarts[0]} px`)
  assert.ok(ecarts.slice(1).every((e, i) => e <= ecarts[i] + TOL), `le retard ne fait que diminuer : ${ecarts.map((e) => e.toFixed(1)).join(' ')}`)
  const pendant = film.find((f) => /derrière la molette/.test(f.badge))
  assert.ok(pendant, 'pendant le retard, le badge le dit')
  const lu = parseFloat(pendant.badge.match(/([\d,]+) px/)[1].replace(',', '.'))
  /* la page et l'épreuve ne lisent pas forcément la même image : le chiffre du badge est
     borné par ce qui a pu être rendu — au plus l'écart entier (de 72 à 20 sur la piste),
     au moins le plus petit écart que l'épreuve a vu */
  const piste = await p.$eval('#molette .mv-jauge-piste', (e) => e.getBoundingClientRect().width)
  assert.ok(lu >= Math.min(...ecarts) - TOL && lu <= piste * 0.52 + 1, `le chiffre du badge (${lu}) est un écart rendu, entre ${Math.min(...ecarts).toFixed(1)} et ${(piste * 0.52).toFixed(1)}`)
  await p.waitForTimeout(MOUVEMENT.durees.slow.ms + 200)
  const apres = await texte(p, '#molette .mv-scene > .badge')
  const pic = parseFloat((apres.match(/menti de ([\d,]+) px/) ?? [])[1]?.replace(',', '.'))
  assert.ok(pic >= Math.max(...ecarts) - TOL && pic <= piste * 0.52 + 1, `rejointes : le pic dit (${pic}) vaut au moins le plus grand écart vu (${Math.max(...ecarts).toFixed(1)})`)
  const [g, d] = await p.$$eval('#molette .mv-jauge-barre', (es) => es.map((e) => e.getBoundingClientRect().width))
  ok(g, d, 'les deux barres sont enfin égales', 0.5)
  await fermer()
})

/* ── 2 · Chaque pièce du kit est rendue par son jeton ── */
test('2 · la fiche est une carte, le cadre une surface, le menu une card ; la paire est deux colonnes de coque ; la légende parle au cran étiquette', async () => {
  for (const W of LARGEURS) {
    const { p, fermer } = await nav.page(URL(), { largeur: W })
    ok(await calcPx(p, '#molette .mv-temoin', 'paddingTop'), attendu('pad-2-block', W), `${W} — la fiche, marge de carte`)
    ok(await calcPx(p, '#molette .mv-temoin', 'borderTopLeftRadius'), attendu('r-2', W), `${W} — la fiche, coin de carte`)
    ok(await calcPx(p, '#molette .mv-duo', 'rowGap'), attendu('pad-1-block', W), `${W} — la paire, l'écart de coque`)
    ok(await calcPx(p, '#durees .mv-cadre', 'paddingTop'), attendu('pad-2-block', W), `${W} — le cadre, marge de profondeur 2`)
    ok(await calcPx(p, '#durees .mv-cadre', 'borderTopLeftRadius'), attendu('r-2', W), `${W} — le cadre, coin de profondeur 2`)
    ok(await calcPx(p, '#durees .mv-verdict', 'borderTopLeftRadius'), attendu('r-3', W), `${W} — le verdict dans le cadre, coin de la ligne`)
    ok(await calcPx(p, '#mots .mv-menu', 'borderTopLeftRadius'), attendu('r-2', W), `${W} — le menu, coin de card`)
    ok(await calcPx(p, '#mots .mv-menu', 'paddingTop'), attendu('pad-3-block', W), `${W} — le menu, marge de ligne`)
    ok(await calcPx(p, '#mots .mv-menu-item', 'minHeight'), attendu('control-height-compact', W), `${W} — une entrée de menu, la cible compacte`)
    ok(await calcPx(p, '#molette .gd-legende', 'fontSize'), attendu('font-size-label', W), `${W} — la légende au cran étiquette`)
    const [g, d] = await p.$$eval('#molette .mv-cote', (es) => es.map((e) => { const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, b: r.bottom } }))
    if (W >= 640) { ok(await calcPx(p, '#molette .mv-duo', 'columnGap'), attendu('pad-1-inline', W), `${W} — l'écart entre les colonnes`); assert.ok(Math.abs(g.y - d.y) < 1 && d.x > g.x + g.w, `${W} — deux colonnes côte à côte`) }
    else assert.ok(d.y >= g.b - TOL && Math.abs(d.x - g.x) < 1, `${W} — sur téléphone, la paire s'empile`)
    await fermer()
  }
})

/* ── 3 · Tout ce qui bouge prend un cran et la courbe ── */
test('3 · sur le rendu, chaque transition d’un objet de la page dure un cran du moteur et suit la courbe du kit — hors des casses déclarées', async () => {
  const { p, fermer } = await pageLibre(URL())
  const fautes = await p.evaluate(([MS, courbe]) => {
    const f = []
    for (const el of document.querySelectorAll('main [class*="mv-"]')) {
      if (el.closest('[data-intent="statement"]')) continue
      const cs = getComputedStyle(el)
      if (cs.transitionProperty === 'all' && cs.transitionDuration === '0s') continue
      const durees = cs.transitionDuration.split(',').map((d) => { const v = parseFloat(d); return d.trim().endsWith('ms') ? v : v * 1000 })
      for (const ms of durees) if (ms !== 0 && !MS.includes(ms)) f.push(`${el.className} : ${ms} ms n'est pas un cran`)
      for (const c of cs.transitionTimingFunction.split(/,(?![^(]*\))/)) if (durees.some((m) => m > 0) && c.trim() !== courbe) f.push(`${el.className} : courbe ${c.trim()}`)
    }
    return [...new Set(f)]
  }, [MS, MOUVEMENT.courbe])
  assert.deepEqual(fautes, [], `${fautes.length} mouvement(s) hors moteur`)
  await fermer()
})
test('3 · la feuille : aucune durée ni courbe à la main hors d’une ligne qui se dit casse, et chaque casse de la page est dite', () => {
  const css = CSS()
  for (const [sel, l] of lignesAvecSelecteur(css)) {
    const nu = l.replace(/\/\*.*?\*\//g, '')
    if (!/transition|animation/.test(nu)) continue
    const main = /(?<![\w-])\d*\.?\d+(ms|s)(?![\w-])/.test(nu) || /cubic-bezier|\bease\b/.test(nu)
    if (main) assert.match(l, /casse \(hors chaîne\)/, `${sel} : une valeur à la main qui ne se déclare pas`)
  }
  for (const sel of ['.mv-jauge-barre.ment', '.mv-menu.saute', '.mv-menu.neant', '.mv-menu.rebond', '.mv-menu.traine', '.mv-menu.milieu', '.mv-toast.neant', '.mv-rangee.lente .bouton']) {
    const i = css.indexOf(sel); assert.ok(i >= 0, `casse absente : ${sel}`)
    assert.match(css.slice(i, css.indexOf('\n', i)), /casse/, `${sel} : casse dite sur sa ligne`)
  }
  assert.ok(!/chorégraphie/.test(css), 'cette page ne déclare aucune chorégraphie')
})

/* ── 4 · Chaque casse rend ce qu'elle déclare, et le verdict est déduit ── */
test('4 · les sept mots : deux justes, cinq fautes — chacune lue dans la feuille (durée nulle, départ à zéro, courbe qui dépasse, cran expressif, origine au milieu)', async () => {
  const { p, fermer } = await pageLibre(URL())
  await p.locator('#mots').scrollIntoViewIfNeeded(); await p.waitForTimeout(150)
  const attendus = [['ça se pose', 'bon', /200 ms · la courbe du kit · part de 0,95 · depuis le bouton/],
    ['ça sort de son bouton', 'bon', /depuis le bouton/],
    ['ça rebondit', 'ko', /dépasse sa cible/], ['ça saute', 'ko', /aucune durée/],
    ['ça naît du néant', 'ko', /part de 0/], ['ça traîne', 'ko', new RegExp(`${MOUVEMENT.durees.expressive.ms} ms sur un menu, qui vit à ${MOUVEMENT.durees.base.ms}`)],
    ["ça s'ouvre du milieu", 'ko', /depuis le milieu/]]
  for (const [m, v, dit] of attendus) {
    await mot(p, m); await p.waitForTimeout(60)
    assert.equal(await verdictMot(p), v, `« ${m} » : ${v}`)
    assert.match(await texte(p, '#mots .badge[data-verdict]'), dit, `« ${m} » : le verdict dit ce qui est lu`)
    assert.equal(await p.getAttribute('#mv-menu-actions', 'data-intent'), v === 'ko' ? 'statement' : null, `« ${m} » : ${v === 'ko' ? 'déclaré' : 'pas une casse'}`)
  }
  /* et le rendu rend bien la faute : « ça saute » n'a aucune transition, « ça naît du néant » part de 0 (lu sur un jumeau au repos) */
  await mot(p, 'ça saute'); assert.equal(await calc(p, '#mv-menu-actions', 'transitionDuration'), '0s')
  await mot(p, 'ça naît du néant'); await p.waitForTimeout(MOUVEMENT.durees.base.ms + 100)
  assert.equal(await p.evaluate(() => { const m = document.querySelector('#mv-menu-actions'), j = m.cloneNode(false); j.classList.remove('ouvert'); j.removeAttribute('id'); m.parentElement.appendChild(j); const s = getComputedStyle(j).scale; j.remove(); return s }), '0')
  await fermer()
})
test('4 · les quatre paires : le juste et le faux côte à côte, un seul geste joue les deux — le survol lent, l’origine au milieu, la naissance à zéro, l’ancienne règle qui coupait tout ; chaque tête de colonne est lue', async () => {
  const { p, fermer } = await pageLibre(URL())
  await p.locator('#casser').scrollIntoViewIfNeeded(); await p.waitForTimeout(150)
  const tete = (i, k) => texte(p, `${bande(i)} .mv-cote:nth-child(${k}) .mv-verdict-tete`)
  for (let i = 1; i <= 4; i++) {
    assert.equal(await p.getAttribute(`${bande(i)} .mv-cote:nth-child(1)`, 'data-intent'), null, `paire ${i} : le juste n'est pas une casse`)
    assert.equal(await p.getAttribute(`${bande(i)} .mv-cote:nth-child(2)`, 'data-intent'), 'statement', `paire ${i} : le fautif est déclaré`)
    assert.match(await tete(i, 1), /✓/); assert.match(await tete(i, 2), /✗/)
    assert.equal(await p.locator(`${bande(i)} .doc-casser`).count(), 0, `paire ${i} : pas de bouton casser`)
  }
  /* 1 · le survol : la même rangée deux fois, cent contre trois cents */
  assert.equal(enMs(await calc(p, `${bande(1)} .mv-rangee:not(.lente) .bouton`, 'transitionDuration')), MOUVEMENT.durees.fast.ms)
  assert.equal(enMs(await calc(p, `${bande(1)} .mv-rangee.lente .bouton`, 'transitionDuration')), MOUVEMENT.durees.slow.ms)
  assert.match(await tete(1, 1), new RegExp(`${MOUVEMENT.durees.fast.ms} ms — il suit le curseur`))
  assert.match(await tete(1, 2), new RegExp(`${MOUVEMENT.durees.slow.ms} ms — il poursuit le curseur`))
  assert.equal(await p.locator(`${bande(1)} .bouton`).count(), 6, 'trois boutons de chaque côté')
  /* 2 · l'origine : un clic ouvre les deux menus */
  assert.equal(await calc(p, `${bande(2)} .mv-menu`, 'transformOrigin', 0), '0px 0px', 'juste : depuis le coin du bouton')
  const o = (await calc(p, `${bande(2)} .mv-menu`, 'transformOrigin', 1)).split(' ').map(parseFloat)
  assert.ok(o[0] > 0 && o[1] > 0, `fautif : l'origine au milieu (${o})`)
  assert.match(await tete(2, 1), /depuis le coin qui touche son bouton/); assert.match(await tete(2, 2), /depuis son propre milieu/)
  await p.locator(`${bande(2)} .bouton`).first().click(); await p.waitForTimeout(MOUVEMENT.durees.base.ms + 60)
  assert.equal(await p.locator(`${bande(2)} .mv-menu.ouvert`).count(), 2, 'un geste, deux menus ouverts')
  /* 3 · le néant : un geste, deux notifications */
  assert.match(await tete(3, 1), /part de 0,95 — presque sa taille/); assert.match(await tete(3, 2), /part de 0 — elle surgit du néant/)
  await p.locator(`${bande(3)} .bouton`, { hasText: 'Notifier' }).click(); await p.waitForTimeout(MOUVEMENT.durees.base.ms + 60)
  assert.equal(await p.locator(`${bande(3)} .mv-toast.la`).count(), 2, 'un geste, deux notifications')
  /* 4 · moins de mouvement : notre règle contre l'ancienne */
  assert.equal(await calc(p, `${bande(4)} .mv-toast`, 'transitionProperty', 0), 'opacity', 'notre règle : le fondu seul')
  assert.equal(enMs(await calc(p, `${bande(4)} .mv-toast`, 'transitionDuration', 0)), MOUVEMENT.durees.base.ms, 'au cran du menu')
  assert.equal(await calc(p, `${bande(4)} .mv-toast`, 'transitionDuration', 1), '0s', "l'ancienne règle : rien")
  assert.match(await tete(4, 1), new RegExp(`le fondu reste \\(${MOUVEMENT.durees.base.ms} ms\\), le déplacement est parti`))
  assert.match(await tete(4, 2), /tout coupé : elle surgit sans passage/)
  await fermer()
})

/* ── 5 · Sous mouvement réduit, les déplacements partent et les fondus restent ── */
test('5 · dans les deux réglages : libre, le verdict monte et le menu grandit ; réduit, plus un déplacement sur la page, mais les fondus gardent leurs durées — et trois mots seulement restent des fautes', async () => {
  const libre = await pageLibre(URL()), reduit = await nav.page(URL(), { largeur: 1440 })
  const deplacements = (p) => p.evaluate(() => [...document.querySelectorAll('main [class*="mv-"]')].filter((e) => /translate|scale|transform/.test(getComputedStyle(e).transitionProperty)).length)
  assert.ok(await deplacements(libre.p) >= 6, 'libre : les objets se déplacent en entrant')
  assert.equal(await deplacements(reduit.p), 0, 'réduit : plus un seul déplacement en transition')
  const fondus = (p) => p.$$eval('#durees .mv-pose', (es) => es.map((e) => getComputedStyle(e).transitionDuration.split(',')[0]))
  assert.deepEqual((await fondus(reduit.p)).map(enMs), MS, 'réduit : les fondus gardent les quatre crans')
  assert.equal(await calc(reduit.p, '#durees .mv-pose', 'transitionProperty'), 'opacity', 'réduit : le fondu seul')
  assert.match(await calc(libre.p, '#durees .mv-pose', 'transitionProperty'), /opacity, translate/, 'libre : le fondu et la montée')
  /* réduit : « ça rebondit », « ça naît du néant », « ça s'ouvre du milieu » ne sont plus des fautes — leur faute était un déplacement */
  await reduit.p.locator('#mots').scrollIntoViewIfNeeded()
  const verdicts = {}
  for (const m of ['ça rebondit', 'ça naît du néant', "ça s'ouvre du milieu", 'ça saute', 'ça traîne']) { await mot(reduit.p, m); await reduit.p.waitForTimeout(60); verdicts[m] = await verdictMot(reduit.p) }
  assert.deepEqual(verdicts, { 'ça rebondit': 'bon', 'ça naît du néant': 'bon', "ça s'ouvre du milieu": 'bon', 'ça saute': 'ko', 'ça traîne': 'ko' }, 'réduit : seules les fautes de durée restent')
  await libre.fermer(); await reduit.fermer()
})

/* ── 6 · Densité, titres, C17, rien en dur, débord, erreurs, la place dans le menu, les étages ── */
test('6 · la scène suit la base de la densité ; le corps de la légende ne bouge pas ; l’affiche et les sections glissent avec l’écran', async () => {
  const W = 1440
  for (const densite of ['compact', 'airy']) {
    const { p, fermer } = await nav.page(URL(), { largeur: W, densite })
    ok(await calcPx(p, '#durees .mv-cadre', 'paddingTop'), attendu('pad-2-block', W, DENSITES[densite]), `${densite} — le cadre suit la base`)
    ok(await calcPx(p, '#molette .mv-duo', 'columnGap'), attendu('pad-1-inline', W, DENSITES[densite]), `${densite} — la paire suit la base`)
    ok(await calcPx(p, '#molette .gd-legende', 'fontSize'), attendu('font-size-label', W), `${densite} — la légende ne bouge pas`)
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
test('6 · dans les deux thèmes, tout tertiaire rendu porte 600 au moins, au cran étiquette au moins, jamais un paragraphe lu', async () => {
  for (const theme of ['light', 'dark']) {
    const { p, fermer } = await nav.page(URL(), { largeur: 1440, theme })
    const f = await fautesC17(p, theme, 1440)
    assert.deepEqual(f, [], `${theme} : ${f.length} faute(s)`)
    await fermer()
  }
})
test('6 · marges, espaces, coins, tailles : chaque valeur calculée est une valeur du moteur — hors casses ; zéro débord ; zéro erreur', async () => {
  const css = CSS(), g = GLOBALES()
  const exclusions = ['padding', 'gap', 'border-radius', 'margin'].flatMap((prop) => [...selecteursDeclares(css, prop), ...selecteursDeclares(g, prop), ...selecteursEnEm(css, prop), ...selecteursEnEm(g, prop)])
  const tailles = ['svg *', ...selecteursDeclares(css, 'font-size'), ...selecteursDeclares(g, 'font-size'), ...selecteursEnEm(css), ...selecteursEnEm(g)]
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
test('6 · le mouvement est une fondation (arbitrage du 7 septembre) : le rail le range avec ses sœurs, la feuille du site sous Geste, plus dans les langages ; trois preuves, quatre bandes, huit lignes en liste, neuf lignes de code', async () => {
  const { p, fermer } = await nav.page(URL(), { largeur: 1440 })
  const soeurs = await textes(p, '.gdoc-rail .rail-bloc:first-of-type .rail-lien')
  assert.ok(soeurs.includes('Mouvement') && soeurs.includes('Rythme'), `le rail : ${soeurs.join(', ')}`)
  assert.equal(await texte(p, '.gdoc-rail .rail-bloc:first-of-type .rail-titre'), 'Fondations')
  await p.locator('.rail-ouvre').click(); await p.waitForTimeout(MOUVEMENT.durees.slow.ms + 100)
  const familles = await p.$$eval('.feuille.ouverte .index-famille', (es) => es.map((e) => [e.querySelector('.index-fam').textContent, [...e.querySelectorAll('.index-lien')].map((l) => l.textContent)]))
  const langages = familles.find(([n]) => n === 'Langages')[1], fondations = familles.find(([n]) => n === 'Fondations')[1]
  assert.ok(!langages.includes('Mouvement') && fondations.includes('Mouvement'), 'Mouvement a quitté les langages pour les fondations')
  assert.ok(fondations.indexOf('Mouvement') < fondations.indexOf('Tactile'), 'sous Geste, avant Tactile')
  await p.keyboard.press('Escape')
  assert.equal(await p.locator('main .gdoc-sec').count(), 6, 'six sections')
  assert.equal(await p.locator('#casser .doc-bande').count(), 4, 'quatre bandes')
  assert.equal(await p.locator('#invisibles .doc-liste tbody tr').count(), 8, 'huit lignes en liste')
  assert.equal(await p.locator('#code .doc-code tbody tr').count(), 9, 'neuf lignes de code')
  const code = await textes(p, '#code .doc-code .cs-val')
  assert.deepEqual(code.slice(0, 4), MS.map((m) => `${m} ms`), 'le registre dit les quatre crans, lus au moteur')
  assert.match(await texte(p, '#code .doc-code'), new RegExp(MOUVEMENT.courbe.replace(/[()]/g, '\\$&')), 'et la courbe')
  await fermer()
})
