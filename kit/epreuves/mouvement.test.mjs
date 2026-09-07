/* LE CRASH-TEST DE LA PAGE MOUVEMENT — kit/epreuves/mouvement.test.mjs
   Ce qui doit être vrai à l'écran, mesuré sans l'œil (réécrit le 7 septembre
   2026 au soir, quand les trois preuves de la pièce kit-mouvement-nu.html ont
   été versées dans la page) :
   1 · chaque chiffre affiché est LU, jamais déclaré — la main invisible : la
       barre court après la main, l'écart est peint en rouge à sa largeur rendue
       et chiffré, puis la barre rejoint la main ; le second passage ne ment pas ;
       les quatre situations jouent la durée de leur emploi et la légende lit ce
       qui a été joué ;
   2 · chaque pièce du kit est rendue par son jeton : la fiche est une carte, la
       main est au bout de la barre, la carte du film et le panneau, les tuiles ;
   3 · tout ce qui bouge sur la page prend un cran du moteur et la courbe du kit —
       sauf ce qui se déclare casse, et chaque casse dit sa faute sur sa ligne ;
   4 · chaque casse rend le mensonge qu'elle déclare, et le verdict est DÉDUIT du
       rendu : les six mots du lexique, les quatre bandes ;
   5 · rien ne se joue seul : chaque scène attend « Lire » ; sous mouvement
       réduit, les lectures s'avancent à la main, les déplacements partent et
       les fondus restent — et trois mots du lexique cessent d'être des fautes ;
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
const RALENTI = 3 /* le ralenti du lexique, dit dans la page */
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
/* Sous mouvement réduit — le réglage du banc — on lit à la main : « Lire », puis « Étape suivante ». */
const commande = (p, sec) => p.locator(`${sec} .mv-commande`).click()
const bande = (i) => `#casser .doc-bande:nth-child(${i})`
const boites = (p, sel) => p.evaluate((sel) => [...document.querySelectorAll(sel)].map((e) => { const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height, b: r.bottom, d: r.right } }), sel)

/* ── 1 · Chaque chiffre affiché est lu ── */
test('1 · la main invisible : avec la faute, la barre court après la main — l’écart est peint en rouge à sa largeur rendue, chiffré, et ne fait que fondre ; le sous-titre dit le pic mesuré ; comme il faut, la barre est sous la main à l’image près', async () => {
  const { p, fermer } = await nav.page(URL(), { largeur: 1440 })
  await p.locator('#molette').scrollIntoViewIfNeeded(); await p.waitForTimeout(150)
  assert.equal(await texte(p, '#molette .mv-commande'), 'Lire', 'rien ne se joue seul')
  await commande(p, '#molette'); await p.waitForTimeout(150) /* étape 0 : la faute, au départ */
  assert.equal(await texte(p, '#molette .mv-commande'), 'Étape suivante', 'réduit : on avance à la main')
  assert.equal(await p.getAttribute('#molette .mv-jauge-piste', 'data-intent'), 'statement', 'la faute est déclarée')
  assert.match(await texte(p, '#molette .mv-sous-titre'), /D'abord la faute/)
  const piste = await p.$eval('#molette .mv-piste', (e) => e.getBoundingClientRect().width)
  await commande(p, '#molette'); await p.waitForTimeout(60) /* étape 1 : réduit, la main saute — la barre, elle, traîne (c'est sa casse) */
  const film = await p.evaluate(() => new Promise((res) => {
    const lire = () => { const b = document.querySelector('#molette .mv-jauge-barre').getBoundingClientRect().width, d = document.querySelector('#molette .mv-doigt').getBoundingClientRect()
      const r = document.querySelector('#molette .mv-mensonge'), rr = r && !r.hidden ? r.getBoundingClientRect().width : null
      return { b, main: (d.left + d.right) / 2 - document.querySelector('#molette .mv-jauge-piste').getBoundingClientRect().left, rouge: rr, cote: document.querySelector('#molette .mv-mensonge-cote')?.textContent ?? '', st: document.querySelector('#molette .mv-sous-titre').textContent } }
    const out = []; let n = 0
    const pas = () => { out.push(lire()); if (++n < 14) requestAnimationFrame(pas); else res(out) }
    requestAnimationFrame(pas)
  }))
  const ecarts = film.map((f) => Math.abs(f.main - f.b))
  assert.ok(ecarts[0] > 5, `à la première image, la barre est loin derrière la main : ${ecarts[0].toFixed(1)} px`)
  assert.ok(ecarts.slice(1).every((e, i) => e <= ecarts[i] + TOL), `le retard ne fait que diminuer : ${ecarts.map((e) => e.toFixed(1)).join(' ')}`)
  const pendant = film.map((f, i) => ({ ...f, i })).filter((f) => f.rouge !== null)
  assert.ok(pendant.length >= 2, 'pendant le retard, le rouge est peint')
  for (const f of pendant) {
    assert.ok(f.rouge >= ecarts[f.i] - 2.5 && f.rouge <= piste * 0.62 + 1, `le rouge couvre l'écart rendu (${f.rouge.toFixed(1)} pour ${ecarts[f.i].toFixed(1)})`)
    assert.match(f.cote, /px$/); assert.match(f.st, /court après — [\d,]+ px derrière/)
  }
  assert.ok(pendant.slice(1).every((f, k) => f.rouge <= pendant[k].rouge + TOL), 'le rouge ne fait que fondre')
  await p.waitForTimeout(MOUVEMENT.durees.slow.ms + 200)
  const [g] = await p.$$eval('#molette .mv-jauge-barre', (es) => es.map((e) => e.getBoundingClientRect().width))
  ok(g, film[0].main, 'la barre a rejoint la main', 1)
  assert.equal(await p.locator('#molette .mv-mensonge:not([hidden])').count(), 0, 'le rouge a fondu')
  await commande(p, '#molette'); await p.waitForTimeout(120) /* étape 2 : le pic */
  const pic = parseFloat((await texte(p, '#molette .mv-sous-titre')).match(/menti de ([\d,]+) px/)?.[1]?.replace(',', '.'))
  assert.ok(pic >= Math.max(...ecarts) - TOL && pic <= piste * 0.62 + 1, `le sous-titre dit le pic mesuré (${pic}), au moins le plus grand écart vu (${Math.max(...ecarts).toFixed(1)})`)
  await commande(p, '#molette'); await p.waitForTimeout(120) /* étape 3 : comme il faut */
  assert.equal(await p.getAttribute('#molette .mv-jauge-piste', 'data-intent'), null, 'plus une casse')
  assert.equal(await calc(p, '#molette .mv-jauge-barre', 'transitionDuration'), '0s', 'aucune transition')
  await commande(p, '#molette'); await p.waitForTimeout(60) /* étape 4 : la main saute, la barre est déjà là */
  const [b2, m2] = await p.evaluate(() => { const b = document.querySelector('#molette .mv-jauge-barre').getBoundingClientRect().width, d = document.querySelector('#molette .mv-doigt').getBoundingClientRect(); return [b, (d.left + d.right) / 2 - document.querySelector('#molette .mv-jauge-piste').getBoundingClientRect().left] })
  ok(b2, m2, 'comme il faut : la barre est sous la main, à l\'image près', 1)
  assert.equal(await p.locator('#molette .mv-mensonge:not([hidden])').count(), 0, 'et aucun rouge')
  await commande(p, '#molette'); await p.waitForTimeout(120)
  assert.match(await texte(p, '#molette .mv-sous-titre.regle'), /Une valeur qu'on fait glisser ne s'anime pas/, 'la règle, en dernier')
  await commande(p, '#molette'); await p.waitForTimeout(120)
  assert.equal(await texte(p, '#molette .mv-commande'), 'Rejouer', 'la lecture est finie')
  await fermer()
})
test('1 · quatre situations : à chaque situation l’objet qui répond joue la durée de son emploi, lue sur le rendu ; le compteur suit ; la légende lit les quatre crans ; la cinquième est la faute — un menu au cran expressif', async () => {
  const { p, fermer } = await nav.page(URL(), { largeur: 1440 })
  await p.locator('#durees').scrollIntoViewIfNeeded()
  const emplois = Object.values(MOUVEMENT.durees).map((d) => d.emploi)
  const objets = ['.mv-obj', '.mv-menu', '.mv-panneau', '.mv-section']
  assert.equal(await p.getAttribute('#durees .mv-lect', 'aria-label'), 'Lire', 'rien ne se joue seul')
  for (let i = 0; i < MS.length; i++) {
    if (i > 0) { await p.locator('#durees .mv-rond[aria-label="Situation suivante"]').click(); await p.waitForTimeout(1400) }
    assert.equal(await p.locator(`#durees .mv-scena-carte ${objets[i]}[data-joue]`).count(), 1, `situation ${i + 1} : l'objet est ${objets[i]}`)
    assert.equal(enMs(await calc(p, '#durees .mv-scena-carte [data-joue]', 'transitionDuration')), MS[i], `situation ${i + 1} : il joue ${MS[i]} ms`)
    assert.match(await texte(p, '#durees .mv-scena-duree b'), new RegExp(`^${MS[i]} ms`)); assert.equal(await texte(p, '#durees .mv-scena-duree span'), emplois[i])
    assert.equal(await texte(p, '#durees .mv-cpt'), `${i + 1} / 5`); assert.equal(await texte(p, '#durees .mv-scena-cpt b'), String(i + 1))
    assert.equal(await p.getAttribute('#durees .mv-scena-carte', 'data-intent'), null, `situation ${i + 1} : pas une casse`)
  }
  assert.match(await texte(p, '#durees .gd-legende'), new RegExp(`^${MS.join(' · ')} ms, lus sur le rendu`), 'la légende dit ce qui a été joué')
  await p.locator('#durees .mv-rond[aria-label="Situation suivante"]').click(); await p.waitForTimeout(1400)
  assert.equal(enMs(await calc(p, '#durees .mv-scena-carte .mv-menu[data-joue]', 'transitionDuration')), MOUVEMENT.durees.expressive.ms, 'la faute : un menu au cran expressif')
  assert.equal(await p.getAttribute('#durees .mv-scena-carte', 'data-intent'), 'statement', 'déclarée')
  assert.equal(await texte(p, '#durees .mv-scena-duree.ko span'), 'il traîne')
  assert.ok(await p.locator('#durees .mv-rond[aria-label="Situation suivante"]').isDisabled(), 'la dernière : pas de suivante')
  await p.locator('#durees .mv-lect').click(); await p.waitForTimeout(300)
  assert.equal(await texte(p, '#durees .mv-cpt'), '1 / 5', 'Lire depuis la fin reprend au début')
  await fermer()
})

/* ── 2 · Chaque pièce du kit est rendue par son jeton ── */
test('2 · la fiche est une carte, la main est au bout de la barre et la piste et la barre partagent le même bord ; la carte du film et son panneau ; les tuiles du lexique ; la paire d’une bande est deux colonnes de coque ; la légende parle au cran étiquette', async () => {
  for (const W of LARGEURS) {
    const { p, fermer } = await nav.page(URL(), { largeur: W })
    ok(await calcPx(p, '#molette .mv-fiche', 'paddingTop'), attendu('pad-2-block', W), `${W} — la fiche, marge de carte`)
    ok(await calcPx(p, '#molette .mv-fiche', 'borderTopLeftRadius'), attendu('r-2', W), `${W} — la fiche, coin de carte`)
    ok(await calcPx(p, '#molette .mv-piste', 'height'), attendu('control-height', W), `${W} — la piste de la main, la hauteur d'une commande`)
    ok(await calcPx(p, '#molette .mv-jauge-piste', 'height'), attendu('gap-3-block', W), `${W} — la barre, le troisième cran d'espace`)
    const [piste, barre] = await boites(p, '#molette .mv-trace, #molette .mv-jauge-piste')
    assert.ok(Math.abs(piste.x - barre.x) < 1 && Math.abs(piste.d - barre.d) < 1, `${W} — la piste et la barre partagent le même bord`)
    const [doigt, plein] = await boites(p, '#molette .mv-doigt, #molette .mv-jauge-barre')
    assert.ok(Math.abs((doigt.x + doigt.d) / 2 - plein.d) < 1, `${W} — la main est au bout de la barre`)
    ok(await calcPx(p, '#durees .mv-scena-carte', 'paddingTop'), attendu('pad-1-block', W), `${W} — la carte du film, marge de coque`)
    ok(await calcPx(p, '#durees .mv-scena-carte', 'borderTopLeftRadius'), attendu('r-2', W), `${W} — la carte du film, coin de card`)
    ok(await calcPx(p, '#durees .mv-scena-panneau', 'borderTopLeftRadius'), attendu('r-1', W), `${W} — le panneau, coin de coque`)
    await p.locator('#durees .mv-rond[aria-label="Situation suivante"]').click(); await p.waitForTimeout(150) /* la deuxième situation : le menu */
    ok(await calcPx(p, '#durees .mv-menu', 'paddingTop'), attendu('pad-3-block', W), `${W} — le menu, marge de ligne`)
    ok(await calcPx(p, '#mots .mv-lex-scene', 'borderTopLeftRadius'), attendu('r-2', W), `${W} — une tuile, coin de card`)
    ok(await calcPx(p, '#mots .mv-lex-obj', 'paddingTop'), attendu('pad-3-block', W), `${W} — le bloc joué, marge de ligne`)
    ok(await calcPx(p, '#molette .gd-legende', 'fontSize'), attendu('font-size-label', W), `${W} — la légende au cran étiquette`)
    ok(await calcPx(p, `${bande(1)} .mv-duo`, 'rowGap'), attendu('pad-1-block', W), `${W} — la paire, l'écart de coque`)
    if (W >= 640) { ok(await calcPx(p, `${bande(1)} .mv-duo`, 'columnGap'), attendu('pad-1-inline', W), `${W} — l'écart entre les colonnes`); const [g, d] = await boites(p, `${bande(1)} .mv-cote`); assert.ok(Math.abs(g.y - d.y) < 1 && d.x > g.x + g.w, `${W} — deux colonnes côte à côte`) }
    else { const [g, d] = await boites(p, `${bande(1)} .mv-cote`); assert.ok(d.y >= g.b - TOL && Math.abs(d.x - g.x) < 1, `${W} — sur téléphone, la paire s'empile`) }
    await fermer()
  }
})

/* ── 3 · Tout ce qui bouge prend un cran et la courbe ── */
test('3 · sur le rendu, chaque transition d’un objet de la page dure un cran du moteur (au ralenti du lexique près) et suit la courbe du kit — hors des casses déclarées', async () => {
  const { p, fermer } = await pageLibre(URL())
  const fautes = await p.evaluate(([MS, courbe, RALENTI]) => {
    const f = []
    for (const el of document.querySelectorAll('main [class*="mv-"]')) {
      if (el.closest('[data-intent="statement"]')) continue
      const cs = getComputedStyle(el)
      if (cs.transitionProperty === 'all' && cs.transitionDuration === '0s') continue
      const ralenti = el.closest('.mv-lexique') ? RALENTI : 1
      const durees = cs.transitionDuration.split(',').map((d) => { const v = parseFloat(d); return (d.trim().endsWith('ms') ? v : v * 1000) / ralenti })
      for (const ms of durees) if (ms !== 0 && !MS.some((m) => Math.abs(m - ms) < 0.5)) f.push(`${el.className} : ${ms} ms n'est pas un cran`)
      for (const c of cs.transitionTimingFunction.split(/,(?![^(]*\))/)) if (durees.some((m) => m > 0) && c.trim() !== courbe && c.trim() !== 'linear') f.push(`${el.className} : courbe ${c.trim()}`)
    }
    return [...new Set(f)]
  }, [MS, MOUVEMENT.courbe, RALENTI])
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
  for (const sel of ['.mv-jauge-barre.ment', '.mv-menu.traine', '.mv-menu.neant', '.mv-menu.rebond', '.mv-menu.milieu', '.mv-lex[data-mot="rebond"] .mv-lex-obj', '.mv-lex[data-mot="neant"] .mv-lex-obj', '.mv-lex[data-mot="milieu"] .mv-lex-obj', '.mv-lex[data-mot="traine"] .mv-lex-obj', '.mv-toast.neant', '.mv-rangee.lente .bouton', '.mv-coupe .mv-toast']) {
    const i = css.indexOf(sel); assert.ok(i >= 0, `casse absente : ${sel}`)
    assert.match(css.slice(i, css.indexOf('\n', i)), /casse/, `${sel} : casse dite sur sa ligne`)
  }
  assert.ok((css.match(/chorégraphie/g) ?? []).length >= 6, 'le ralenti du lexique est une chorégraphie, dite sur chaque ligne')
})

/* ── 4 · Chaque casse rend ce qu'elle déclare, et le verdict est déduit ── */
test('4 · le lexique : six mots, deux justes et quatre fautes, chacune lue dans la feuille et ramenée à la vitesse réelle (courbe qui dépasse, départ à zéro, origine au milieu, cran expressif) ; « Lire » joue le mot, « Tout lire » les joue l’un après l’autre', async () => {
  const { p, fermer } = await pageLibre(URL())
  await p.locator('#mots').scrollIntoViewIfNeeded(); await p.waitForTimeout(150)
  const attendus = [['pose', 'bon', /^200 ms · la courbe du kit · depuis son déclencheur/], ['bouton', 'bon', /^200 ms · la courbe du kit · part de 0,8 · depuis son déclencheur/],
    ['rebond', 'ko', /dépasse sa cible · 200 ms/], ['neant', 'ko', /part de 0 · 200 ms/], ['milieu', 'ko', /200 ms, depuis le milieu/], ['traine', 'ko', new RegExp(`${MOUVEMENT.durees.expressive.ms} ms — un objet qu'on ouvre vit à ${MOUVEMENT.durees.base.ms}`)]]
  for (const [cle, v, dit] of attendus) {
    const t = `#mots .mv-lex[data-mot="${cle}"]`
    assert.match(await texte(p, `${t} .mv-lu`), dit, `« ${cle} » : le verdict dit ce qui est lu`)
    assert.equal(await p.locator(`${t} .mv-lu.ko`).count(), v === 'ko' ? 1 : 0, `« ${cle} » : ${v}`)
    assert.equal(await p.getAttribute(t, 'data-intent'), v === 'ko' ? 'statement' : null, `« ${cle} » : ${v === 'ko' ? 'déclaré' : 'pas une casse'}`)
    assert.match(await texte(p, `${t} h3`), v === 'ko' ? /✗/ : /✓/)
  }
  /* le rendu rend bien la faute, au ralenti : le bloc de « il traîne » dure 700 × 3, celui de « il naît du néant » part de 0 */
  assert.equal(enMs(await calc(p, '#mots .mv-lex[data-mot="traine"] .mv-lex-obj', 'transitionDuration')), MOUVEMENT.durees.expressive.ms * RALENTI)
  assert.equal(await calc(p, '#mots .mv-lex[data-mot="neant"] .mv-lex-obj', 'scale'), '0')
  await p.locator('#mots .mv-lex[data-mot="pose"] .bouton').click(); await p.waitForTimeout(80)
  assert.equal(await p.locator('#mots .mv-lex[data-mot="pose"] .mv-lex-obj.la').count(), 1, 'Lire joue le mot')
  assert.equal(await texte(p, '#mots .mv-lex[data-mot="pose"] .bouton'), 'Rejouer')
  await p.locator('#mots .mv-commande').click(); await p.waitForTimeout(600)
  assert.equal(await p.locator('#mots .mv-lex-obj.la').count(), 1, 'Tout lire : le premier, puis les autres')
  await p.waitForTimeout(1900 * 5 + 300)
  assert.equal(await p.locator('#mots .mv-lex-obj.la').count(), 6, 'tous joués, l\'un après l\'autre')
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
  assert.equal(enMs(await calc(p, `${bande(1)} .mv-rangee:not(.lente) .bouton`, 'transitionDuration')), MOUVEMENT.durees.fast.ms)
  assert.equal(enMs(await calc(p, `${bande(1)} .mv-rangee.lente .bouton`, 'transitionDuration')), MOUVEMENT.durees.slow.ms)
  assert.match(await tete(1, 1), new RegExp(`${MOUVEMENT.durees.fast.ms} ms — il suit le curseur`)); assert.match(await tete(1, 2), new RegExp(`${MOUVEMENT.durees.slow.ms} ms — il poursuit le curseur`))
  assert.equal(await calc(p, `${bande(2)} .mv-menu`, 'transformOrigin', 0), '0px 0px', 'juste : depuis le coin du bouton')
  const o = (await calc(p, `${bande(2)} .mv-menu`, 'transformOrigin', 1)).split(' ').map(parseFloat)
  assert.ok(o[0] > 0 && o[1] > 0, `fautif : l'origine au milieu (${o})`)
  await p.locator(`${bande(2)} .bouton`).first().click(); await p.waitForTimeout(MOUVEMENT.durees.base.ms + 60)
  assert.equal(await p.locator(`${bande(2)} .mv-menu.ouvert`).count(), 2, 'un geste, deux menus ouverts')
  assert.match(await tete(3, 1), /part de 0,95 — presque sa taille/); assert.match(await tete(3, 2), /part de 0 — elle surgit du néant/)
  await p.locator(`${bande(3)} .bouton`, { hasText: 'Notifier' }).click(); await p.waitForTimeout(MOUVEMENT.durees.base.ms + 60)
  assert.equal(await p.locator(`${bande(3)} .mv-toast.la`).count(), 2, 'un geste, deux notifications')
  assert.equal(await calc(p, `${bande(4)} .mv-toast`, 'transitionProperty', 0), 'opacity', 'notre règle : le fondu seul')
  assert.equal(await calc(p, `${bande(4)} .mv-toast`, 'transitionDuration', 1), '0s', "l'ancienne règle : rien")
  assert.match(await tete(4, 1), new RegExp(`le fondu reste \\(${MOUVEMENT.durees.base.ms} ms\\), le déplacement est parti`)); assert.match(await tete(4, 2), /tout coupé : elle surgit sans passage/)
  await fermer()
})

/* ── 5 · Rien ne se joue seul ; sous mouvement réduit, les déplacements partent et les fondus restent ── */
test('5 · rien ne se joue seul : libre ou réduit, les scènes attendent « Lire » ; réduit, plus un déplacement en transition, mais les fondus gardent leurs durées — et trois mots du lexique cessent d’être des fautes, parce que leur faute était un déplacement', async () => {
  const libre = await pageLibre(URL()), reduit = await nav.page(URL(), { largeur: 1440 })
  for (const { p } of [libre, reduit]) {
    await p.waitForTimeout(600)
    assert.equal(await texte(p, '#molette .mv-commande'), 'Lire'); assert.equal(await p.getAttribute('#durees .mv-lect', 'aria-label'), 'Lire')
    assert.equal(await p.locator('#mots .mv-lex-obj.la').count(), 0, 'le lexique attend qu\'on le lance')
    assert.equal(await p.locator('#molette .mv-mensonge:not([hidden])').count(), 0, 'la main n\'a pas bougé')
  }
  const deplacements = (p) => p.evaluate(() => [...document.querySelectorAll('main [class*="mv-"]')].filter((e) => /translate|scale|transform/.test(getComputedStyle(e).transitionProperty)).length)
  assert.ok(await deplacements(libre.p) >= 8, 'libre : les objets se déplacent en entrant')
  assert.equal(await deplacements(reduit.p), 0, 'réduit : plus un seul déplacement en transition')
  assert.equal(await calc(reduit.p, '#mots .mv-lex[data-mot="pose"] .mv-lex-obj', 'transitionProperty'), 'opacity', 'réduit : le fondu seul')
  assert.equal(enMs(await calc(reduit.p, '#mots .mv-lex[data-mot="pose"] .mv-lex-obj', 'transitionDuration')), MOUVEMENT.durees.base.ms * RALENTI, 'réduit : et il garde son cran (au ralenti)')
  /* réduit : le rebond, le néant, le milieu ne sont plus des fautes — leur faute était un déplacement ; le cran expressif, si */
  const verdicts = Object.fromEntries(await reduit.p.$$eval('#mots .mv-lex', (es) => es.map((e) => [e.dataset.mot, e.querySelector('.mv-lu').classList.contains('ko') ? 'ko' : 'bon'])))
  assert.deepEqual(verdicts, { pose: 'bon', bouton: 'bon', rebond: 'bon', neant: 'bon', milieu: 'bon', traine: 'ko' }, 'réduit : seule la faute de durée reste')
  /* réduit : la lecture du film ne s'enchaîne pas seule */
  await reduit.p.locator('#durees .mv-lect').click(); await reduit.p.waitForTimeout(400)
  assert.equal(await reduit.p.getAttribute('#durees .mv-lect', 'aria-label'), 'Rejouer', 'réduit : Lire joue la situation et s\'arrête')
  await libre.fermer(); await reduit.fermer()
})

/* ── 6 · Densité, titres, C17, rien en dur, débord, erreurs, la place dans le menu, les étages ── */
test('6 · la scène suit la base de la densité ; le corps de la légende ne bouge pas ; l’affiche et les sections glissent avec l’écran', async () => {
  const W = 1440
  for (const densite of ['compact', 'airy']) {
    const { p, fermer } = await nav.page(URL(), { largeur: W, densite })
    ok(await calcPx(p, '#durees .mv-scena-carte', 'paddingTop'), attendu('pad-1-block', W, DENSITES[densite]), `${densite} — la carte du film suit la base`)
    ok(await calcPx(p, `${bande(1)} .mv-duo`, 'columnGap'), attendu('pad-1-inline', W, DENSITES[densite]), `${densite} — la paire suit la base`)
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
test('6 · marges, espaces, coins, tailles : chaque valeur calculée est une valeur du moteur — hors casses et cotes déclarées ; zéro débord ; zéro erreur', async () => {
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
test('6 · le mouvement est une fondation (arbitrage du 7 septembre) : le rail le range avec ses sœurs, la feuille du site sous Geste ; six sections, six mots, quatre bandes, huit lignes en liste, neuf lignes de code', async () => {
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
  assert.equal(await p.locator('#mots .mv-lex').count(), 6, 'six mots')
  assert.equal(await p.locator('#casser .doc-bande').count(), 4, 'quatre bandes')
  assert.equal(await p.locator('#invisibles .doc-liste tbody tr').count(), 8, 'huit lignes en liste')
  assert.equal(await p.locator('#code .doc-code tbody tr').count(), 9, 'neuf lignes de code')
  const code = await textes(p, '#code .doc-code .cs-val')
  assert.deepEqual(code.slice(0, 4), MS.map((m) => `${m} ms`), 'le registre dit les quatre crans, lus au moteur')
  await fermer()
})
