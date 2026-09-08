/* LE CRASH-TEST DE LA PAGE COULEUR — kit/epreuves/couleur.test.mjs
   Ce qui doit être vrai à l'écran, mesuré sans l'œil (plan validé par
   l'Auteur le 26 août 2026) :
   1 · chaque chiffre affiché sort du moteur (hex, RGB, rapports) et tient son seuil ;
   2 · chaque preuve est peinte par son propre jeton (mosaïque, nuancier, gammes, alerte, panneaux, voile) ;
   3 · le moteur sous les yeux : une marque entre, toute la famille suit, les seuils tiennent ;
   4 · les casses rendent le mensonge qu'elles déclarent, et se réparent ;
   5 · le thème sombre, et C17 dans les deux thèmes ;
   6 · rien en dur — marges, espaces, coins, tailles, couleurs écrites.

   Remise à niveau du 1er septembre 2026 : le nuancier est passé en six lignes
   signées rangées en deux groupes (31 août), et la démo du moteur REGARDE au
   lieu de piloter la page. Les épreuves 1, 2 et 3 disent ces deux décisions au
   lieu de décrire la page d'avant ; l'épreuve 3, en particulier, exige
   désormais AUSSI que la page ne bouge pas.                                  */
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { derive, contraste, gamme, gammeNeutres, gammeFamille, poserSurGamme, hexVersLch, PAIRES_DECLAREES, PRIMAIRE_DEFAUT, DENSITES, PLAFOND_ETATS } from '../derivation.mjs'
import { KIT, LARGEURS, TOL, ouvrirSite, ouvrirNavigateur, attendu, proche, calcPx, calc, texte, textes, fautesC17, fautesEnDur, fautesTailles, selecteursDeclares, selecteursEnEm, debord, rgb, encres , fautesEcriture } from './banc.mjs'

const ok = (a, b, msg, tol = TOL) => assert.ok(a !== null && proche(a, b, tol), `${msg} : ${a} attendu ${b}`)
const PAL = derive(PRIMAIRE_DEFAUT)
/* l'écriture des rapports sur la page : deux décimales, virgule, « :1 » */
const fmt = (r) => `${r.toFixed(2).replace('.', ',')}:1`
const rapport = (pal, t, f) => contraste(pal[t.replace(/^--/, '')], pal[f.replace(/^--/, '')])
/* Le nuancier est passé en SIX LIGNES SIGNÉES, rangées en deux groupes, le
   31 août : la coupure est celle du jugement — ce qui ne juge rien d'un côté,
   les trois verdicts de l'autre. L'ordre ci-dessous est celui de la page ; il
   n'est pas décoratif, c'est la démonstration elle-même (« ne pas dépenser un
   verdict là où il n'y a rien à juger »), et l'épreuve le mesure comme tel. */
const GROUPES_NUANCIER = [
  ['Ce qui ne juge pas', ['primary', 'neutral', 'info']],
  ['Les trois verdicts', ['danger', 'success', 'warning']],
]
const COUPLES = {
  primary: ['--primary', '--on-primary', '--primary-subtle', '--on-primary-subtle'],
  neutral: ['--text-primary', '--bg', '--surface', '--text-secondary'],
  info: ['--info', '--on-info', '--info-subtle', '--on-info-subtle'],
  danger: ['--danger', '--on-danger', '--danger-subtle', '--on-danger-subtle'],
  success: ['--success', '--on-success', '--success-subtle', '--on-success-subtle'],
  warning: ['--warning', '--on-warning', '--warning-subtle', '--on-warning-subtle'],
}
const LANGUETTES = GROUPES_NUANCIER.flatMap(([, jetons]) => jetons).map((j) => [j, ...COUPLES[j]])
const TUILES = [['primary', '--on-primary'], ['bg', '--text-primary'], ['primary-subtle', '--on-primary-subtle'], ['text-primary', '--bg'], ['surface', '--text-primary'], ['border-strong', '--bg']]
/* résoudre un jeton dans un hôte thématisé, comme la page le fait — par le moteur de rendu */
const resoudre = (p, theme, noms) => p.evaluate(([theme, noms]) => {
  const h = document.createElement('div'); h.dataset.theme = theme; document.body.appendChild(h)
  const s = document.createElement('span'); h.appendChild(s)
  const out = {}
  for (const n of noms) { s.style.color = `var(--${n})`; out[n] = getComputedStyle(s).color }
  h.remove(); return out
}, [theme, noms])
const versHex = (rgbTexte) => '#' + rgbTexte.match(/\d+/g).slice(0, 3).map((v) => Number(v).toString(16).padStart(2, '0')).join('').toUpperCase()
/* attendre que la page ait fini ses relevés (elle mesure après le rendu) */
const releve = (p) => p.waitForFunction(() => ![...document.querySelectorAll('#palette .cm-specs, #nuancier .gd-lng-fiche, #code table td')].some((e) => e.textContent.includes('…')))
/* Remise à niveau du 7 septembre 2026 : la page a pris les quatre étages (2 septembre,
   verdict d'Auteur : « garde 01 à 03 puis 05 ; 04 devient une règle qu'on peut casser »).
   « Deux thèmes » est devenu la première bande de #casser — UN seul panneau, dans le thème
   du lecteur, et la table des paires dans son dépliant ; les garde-fous sont quatre bandes ;
   la table des rôles est descendue dans le dépliant de #code. Aucune mesure relâchée : le
   panneau unique est mesuré dans les DEUX thèmes en rechargeant la page, et la casse
   « teinter ne coûte rien » (inventée le 2 septembre) entre à l'épreuve 4. */
const TABLE_ROLES = '#code details.prov table'

let site, nav
before(async () => { site = await ouvrirSite(); nav = await ouvrirNavigateur() })
after(async () => { await nav?.fermer(); site?.fermer() })
const URL = () => site.url + '/couleur'

/* ── 1 · Chaque chiffre affiché sort du moteur ── */
test('1 · la mosaïque, ses proportions et la table des rôles disent les valeurs dérivées, dans les deux thèmes', async () => {
  for (const theme of ['light', 'dark']) {
    const { p, fermer } = await nav.page(URL(), { theme }); await releve(p)
    const pal = PAL[theme]
    const specs = await p.evaluate(() => [...document.querySelectorAll('#palette .cm-tuile')].map((t) => [...t.querySelectorAll('.cm-specs span')].map((s) => s.textContent)))
    assert.equal(specs.length, 6)
    TUILES.forEach(([role], i) => {
      const hex = pal[role]
      assert.equal(specs[i][1], hex, `${theme} — ${role} hex`)
      assert.equal(specs[i][3], `RGB ${[1, 3, 5].map((k) => parseInt(hex.slice(k, k + 2), 16)).join(', ')}`, `${theme} — ${role} RGB`)
      assert.equal(specs[i][0], `color.${role === 'bg' ? 'background' : role}`)
    })
    await p.locator('#palette .rang .bouton', { hasText: 'Proportions' }).click()
    const props = await p.evaluate(() => [...document.querySelectorAll('#palette .cp-col')].map((c) => [c.querySelector('.cp-hex').textContent, c.querySelector('.cp-pct').textContent, getComputedStyle(c).flexBasis]))
    const attendus = [['bg', 56], ['surface', 18], ['text-primary', 14], ['border-strong', 7], ['primary', 5]]
    attendus.forEach(([role, part], i) => { assert.equal(props[i][0], pal[role], `${theme} — proportion ${role}`); assert.equal(props[i][1], `${part} %`); assert.equal(props[i][2], `${part}%`) })
    assert.equal(attendus.reduce((s, [, x]) => s + x, 0), 100, 'les parts font 100')
    /* la table des rôles : quinze rôles, la valeur claire ET sombre, quel que soit le thème de la page */
    const lignes = await p.evaluate((t) => [...document.querySelectorAll(`${t} tbody tr`)].map((tr) => [...tr.children].map((td) => td.textContent.trim())), TABLE_ROLES)
    assert.equal(lignes.length, 15)
    const roles = { 'primary': ['primary'], 'on-primary': ['on-primary'], 'primary-subtle': ['primary-subtle'], background: ['bg'], surface: ['surface'], 'text-primary': ['text-primary'], 'text-secondary': ['text-secondary'], 'text-tertiary': ['text-tertiary'], border: ['border'], 'border-strong': ['border-strong'], 'danger / subtil': ['danger', 'danger-subtle'], 'success / subtil': ['success', 'success-subtle'], 'warning / subtil': ['warning', 'warning-subtle'], 'on-warning-subtle': ['on-warning-subtle'], 'info / subtil': ['info', 'info-subtle'] }
    for (const [nom, clair, sombre] of lignes) {
      const r = roles[nom]; assert.ok(r, `rôle inconnu : ${nom}`)
      assert.equal(clair.replace(/\s*\/\s*/g, ' '), r.map((x) => PAL.light[x]).join(' '), `${theme} — ${nom} clair`)
      assert.equal(sombre.replace(/\s*\/\s*/g, ' '), r.map((x) => PAL.dark[x]).join(' '), `${theme} — ${nom} sombre`)
    }
    await fermer()
  }
})
test('1 · le nuancier, les deux panneaux, la table complète, le mini-écran et les gris teintés disent les rapports du moteur — et chaque paire tient son seuil, dans les deux thèmes', async () => {
  for (const theme of ['light', 'dark']) {
    const { p, fermer } = await nav.page(URL(), { theme }); await releve(p)
    const pal = PAL[theme]
    /* le nuancier lit le thème courant — et il est rangé par le jugement (31 août) */
    const groupes = await p.evaluate(() => [...document.querySelectorAll('#nuancier .gd-nfam')].map((s) => ({
      titre: s.querySelector('.gd-nfam-titre').textContent,
      lignes: [...s.querySelectorAll('.gd-lng-fiche')].map((f) => f.textContent.split(' · ')[0]),
    })))
    assert.deepEqual(groupes.map((g) => [g.titre, g.lignes]), GROUPES_NUANCIER, `${theme} — les deux groupes du nuancier`)
    const fiches = await textes(p, '#nuancier .gd-lng-fiche')
    assert.equal(fiches.length, 6, `${theme} — six lignes signées`)
    LANGUETTES.forEach(([jeton, ton, , doux, surDoux], i) => assert.equal(fiches[i], `${jeton} · ${pal[ton.slice(2)]} · doux ${pal[doux.slice(2)]} · ${fmt(rapport(pal, surDoux, doux))}`, `${theme} — languette ${jeton}`))
    /* le panneau du contraste par paire : UN seul, dans le thème du lecteur (2 septembre) — trois rapports, lus */
    const badges = await p.evaluate(() => [...document.querySelectorAll('#casser .gd-pan .badge')].map((b) => b.textContent))
    assert.deepEqual(badges, [['--text-primary', '--surface'], ['--text-secondary', '--surface'], ['--on-primary', '--primary']].map(([a, b]) => fmt(rapport(pal, a, b))), `panneau ${theme}`)
    for (const b of badges) assert.ok(parseFloat(b.replace(',', '.')) >= 4.5, `panneau ${theme} : ${b}`)
    /* la table complète, dans le dépliant de sa règle : chaque ligne, les deux thèmes, au seuil */
    await p.locator('#casser .doc-bande:nth-child(1) details.prov summary').click()
    const lignes = await p.evaluate(() => [...document.querySelectorAll('#casser .doc-bande:nth-child(1) table tbody tr')].map((tr) => [tr.querySelector('.mono').textContent, tr.children[1].textContent, tr.children[2].textContent, tr.children[3].textContent]))
    assert.equal(lignes.length, 27) /* 23 + les quatre traits clavier du halo de focus, rouge et neutre (#133) */
    for (const [paire, seuil, clair, sombre] of lignes) {
      const [t, f] = paire.split(' / ')
      const s = seuil === '3:1' ? 3 : 4.5
      const decl = PAIRES_DECLAREES.find(([a, b]) => `--${a}` === t && `--${b}` === f); assert.ok(decl && decl[2] === s, `${paire} : paire déclarée au moteur avec le seuil ${s}`)
      assert.equal(clair, fmt(rapport(PAL.light, t, f)), `${paire} clair`); assert.equal(sombre, fmt(rapport(PAL.dark, t, f)), `${paire} sombre`)
      assert.ok(rapport(PAL.light, t, f) >= s && rapport(PAL.dark, t, f) >= s, `${paire} tient ${s}`)
    }
    /* le mini-écran, dans ses deux versants ; les gris à luminance constante : un rapport sous chaque tuile */
    for (const t of ['light', 'dark']) assert.equal(await texte(p, `#casser .cl-versant[data-theme="${t}"] .badge`), fmt(rapport(PAL[t], '--on-primary', '--primary')), `mini-écran ${t}`)
    const gris = ['#6B7280', '#78716A', '#67737F'].map((h) => (Math.round(contraste(h, '#FFFFFF') * 10) / 10).toFixed(1).replace('.', ','))
    assert.ok(gris.every((g) => g === gris[0]), `trois gris, un rapport : ${gris}`)
    assert.deepEqual(await textes(p, '#casser .cl-teinte-rapport'), gris.map((g) => `${g}:1`), 'chaque gris porte son rapport')
    assert.equal(await texte(p, '#casser .cl-teinte .badge'), 'le même rapport pour les trois')
    await fermer()
  }
})

/* ── 2 · Chaque preuve est peinte par son propre jeton ── */
test('2 · la mosaïque, le nuancier, les gammes, l’alerte et les panneaux sont peints par la valeur dérivée ; le voile du bento est calculé et tient 4,5', async () => {
  for (const theme of ['light', 'dark']) {
    const { p, fermer } = await nav.page(URL(), { theme }); await releve(p)
    const pal = PAL[theme]
    const peint = await p.evaluate(() => [...document.querySelectorAll('#palette .cm-tuile')].map((t) => [getComputedStyle(t).backgroundColor, getComputedStyle(t).color]))
    TUILES.forEach(([role, sur], i) => { assert.equal(peint[i][0], rgb(pal[role]), `${theme} — tuile ${role} peinte`); assert.equal(peint[i][1], rgb(pal[sur.slice(2)]), `${theme} — tuile ${role} encre`) })
    const lng = await p.evaluate(() => [...document.querySelectorAll('#nuancier .gd-lng')].map((l) => [getComputedStyle(l.querySelector('.gd-lng-doux')).backgroundColor, getComputedStyle(l.querySelector('.gd-lng-doux')).color, getComputedStyle(l.querySelector('.gd-lng-ton')).backgroundColor, getComputedStyle(l.querySelector('.gd-lng-ton')).color]))
    LANGUETTES.forEach(([jeton, ton, surTon, doux, surDoux], i) => assert.deepEqual(lng[i], [doux, surDoux, ton, surTon].map((n) => rgb(pal[n.slice(2)])), `${theme} — languette ${jeton} peinte`))
    /* les gammes 50–950 : la barre est la gamme du moteur ; les rôles posés sont ceux qu'il pose */
    /* depuis le 8 septembre (soir), les gammes vivent au répertoire, ouvertes d'entrée */
    const barres = await p.evaluate(() => [...document.querySelectorAll('#registre #gammes .gm')].map((g) => ({
      hex: [...g.querySelectorAll('.gm-barre button')].map((b) => b.getAttribute('aria-label').split(' — ')[1]),
      crans: [...g.querySelectorAll('.gm-cran')].map((c) => ({ cran: c.firstElementChild.textContent, roles: [...c.querySelectorAll('.gm-role')].map((r) => r.textContent) })),
    })))
    assert.equal(barres.length, 6)
    const L = PAL.light
    const attendues = [
      [gamme(PRIMAIRE_DEFAUT), { primary: L.primary, hover: L['primary-hover'], subtle: L['primary-subtle'], text: L['primary-text'], 'code-bg': L['code-bg'] }],
      [gammeNeutres(PRIMAIRE_DEFAUT), { bg: L.bg, surface: L.surface, hover: L['surface-hover'], border: L['border-strong'], secondary: L['text-secondary'], text: L['text-primary'] }],
      ...['danger', 'success', 'warning', 'info'].map((n) => { const roles = { [n]: L[n], subtle: L[`${n}-subtle`] }; if (L[`on-${n}-subtle`].toUpperCase() !== L[n].toUpperCase()) roles['on-subtle'] = L[`on-${n}-subtle`]; return [gammeFamille(L[n], L[`${n}-subtle`]), roles] }),
    ]
    attendues.forEach(([crans, roles], i) => {
      assert.deepEqual(barres[i].hex, crans.map(([, h]) => h), `gamme ${i} — la barre`)
      const poses = poserSurGamme(crans, roles)
      barres[i].crans.forEach(({ cran, roles: lus }) => assert.deepEqual(lus, (poses[cran] ?? []).map((r) => (r.exact ? r.role : `≈ ${r.role}`)), `gamme ${i} — rôles sur ${cran}`))
    })
    /* l'alerte : fond doux, filet et encre du danger — une carte (coin, marge) */
    const al = '#casser .doc-bande:nth-child(2) [style*="border-inline-start"]'
    assert.equal(await calc(p, al, 'backgroundColor'), rgb(pal['danger-subtle'])); assert.equal(await calc(p, al, 'borderLeftColor'), rgb(pal.danger)); assert.equal(await calc(p, al, 'color'), rgb(pal.danger))
    ok(await calcPx(p, al, 'borderTopLeftRadius'), attendu('r-2', 1440), 'alerte : coin de carte'); ok(await calcPx(p, al, 'paddingTop'), attendu('pad-2-block', 1440), 'alerte : marge de carte')
    /* le panneau du contraste rend le thème du lecteur ; les deux versants du mini-écran rendent chacun le leur */
    const c = await p.evaluate(() => { const pan = document.querySelector('#casser .gd-pan'); return [getComputedStyle(pan.querySelector('.gd-pan-carte')).backgroundColor, getComputedStyle(pan.querySelector('.gd-pan-carte span')).color] })
    assert.deepEqual(c, [rgb(pal.bg), rgb(pal['text-primary'])], `panneau peint dans le thème ${theme}`)
    for (const t of ['light', 'dark']) {
      const v = await p.evaluate((t) => { const e = document.querySelector(`#casser .cl-versant[data-theme="${t}"] [style*="border"]`); return [getComputedStyle(e).backgroundColor, getComputedStyle(e.firstElementChild).backgroundColor] }, t)
      assert.deepEqual(v, [rgb(PAL[t].bg), rgb(PAL[t].primary)], `versant ${t} peint dans son thème`)
    }
    /* le voile du bento : un calcul, dit, qui tient 4,5 */
    await p.waitForFunction(() => /voile \d+ %/.test(document.querySelector('#situation .bn-voile-dit')?.textContent ?? ''))
    const dit = await texte(p, '#situation .bn-voile-dit')
    const m = dit.match(/voile (\d+) % · pire couleur du dessin ([\d,]+):1/); assert.ok(m, `voile dit : ${dit}`)
    assert.ok(parseFloat(m[2].replace(',', '.')) >= 4.5 - 0.005, `${theme} — le voile tient 4,5 : ${dit}`)
    const alpha = await p.evaluate(() => parseFloat(getComputedStyle(document.querySelector('#situation .bn-photo')).getPropertyValue('--bn-voile')))
    ok(alpha * 100, parseInt(m[1]), `${theme} — le voile posé est celui qui est dit`, 0.5)
    await fermer()
  }
})

/* ── 3 · Le moteur sous les yeux ── */
/* Depuis le 31 août, la démo REGARDE, elle ne pilote plus : la marque du site se
   choisit dans la barre d'outils, et nulle part ailleurs. Prendre une marque dans
   le rail ne change que cette scène-là. L'épreuve dit donc DEUX choses au lieu
   d'une, et c'est plus dur que l'ancienne : que toute la scène soit dérivée de la
   marque regardée — et que la page, elle, ne bouge pas d'un pixel de couleur. */
test('3 · une marque entre par le rail : la scène entière est dérivée d’elle, les sémantiques gardent leur teinte, les paires déclarées tiennent — et la page ne change PAS de primaire', async () => {
  const { p, fermer } = await nav.page(URL()); await releve(p)
  const chips = p.locator('#moteur .mk-chip[title]')
  const noms = await chips.evaluateAll((els) => els.map((e) => e.title))
  /* l'état de la page avant qu'on touche au rail : c'est lui qui ne doit pas bouger */
  const varPage = () => p.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--primary').trim().toUpperCase())
  const tuilePage = () => calc(p, '#palette .cm-tuile', 'backgroundColor')
  assert.equal(await varPage(), PAL.light.primary, 'au départ, la page est sur la charte')
  const marques = { Spotify: '#1DB954', Netflix: '#E50914', Slack: '#4A154B' }
  for (const [nom, hex] of Object.entries(marques)) {
    await chips.nth(noms.indexOf(nom)).click()
    await p.waitForFunction((n) => document.querySelector('#moteur .mk-grande .mk-base')?.textContent === n, nom)
    const pal = derive(hex)
    /* la scène : le plein et le doux, logo et nom, dérivés de la marque regardée */
    const scene = await p.evaluate(() => [...document.querySelectorAll('#moteur .mk-grande')].map((g) => [getComputedStyle(g).backgroundColor, getComputedStyle(g).color]))
    assert.deepEqual(scene, [[rgb(pal.light.primary), rgb(pal.light['on-primary'])], [rgb(pal.light['primary-subtle']), rgb(pal.light['primary-text'])]], `${nom} — la scène`)
    /* le chip choisi porte sa marque, et lui seul */
    assert.equal(await p.evaluate(() => [...document.querySelectorAll('#moteur .mk-chip[title]')].filter((c) => c.getAttribute('aria-pressed') === 'true').length), 1, `${nom} — un seul chip enfoncé`)
    await p.waitForTimeout(200) /* le chip anime son fond (0,15 s) ; le banc le lit au repos */
    assert.equal(await calc(p, `#moteur .mk-chip[title="${nom}"]`, 'backgroundColor'), rgb(hex), `${nom} — le chip enfoncé porte sa couleur`)
    const barres = await p.evaluate(() => [...document.querySelectorAll('#moteur .mk-rang')].map((r) => [...r.querySelectorAll('.mk-barre')].map((b) => getComputedStyle(b).backgroundColor)))
    assert.deepEqual(barres[0], gamme(hex).filter(([c]) => [100, 300, 500, 700].includes(c)).map(([, h]) => rgb(h)), `${nom} — la gamme`)
    assert.deepEqual(barres[1], ['danger', 'success', 'warning', 'info'].flatMap((v) => [rgb(pal.light[v]), rgb(pal.light[`${v}-subtle`])]), `${nom} — les sémantiques`)
    /* un rouge reste un rouge : la teinte de chaque famille ne s'éloigne pas de la charte de plus que le plafond du moteur, au degré d'arrondi 8 bits près */
    for (const v of ['danger', 'success', 'warning', 'info']) { const d = Math.abs(((hexVersLch(pal.light[v])[2] - hexVersLch(PAL.light[v])[2] + 540) % 360) - 180); assert.ok(d <= PLAFOND_ETATS + 1, `${nom} — ${v} a tourné de ${d.toFixed(0)}°`) }
    /* la famille dérivée tient ses seuils : la conformité n'est pas vérifiée après coup, elle est obtenue */
    for (const t of ['light', 'dark']) for (const [a, b, seuil] of PAIRES_DECLAREES) {
      const r = contraste(pal[t][a.replace(/^--/, '')], pal[t][b.replace(/^--/, '')])
      assert.ok(r >= seuil, `${nom} ${t} — ${a}/${b} : ${r.toFixed(2)} < ${seuil}`)
    }
    /* et la page n'a pas bougé — c'est la décision du 31 août, mesurée */
    assert.equal(await p.evaluate(() => document.documentElement.dataset.primary ?? null), null, `${nom} — la démo ne pilote pas le site`)
    assert.equal(await varPage(), PAL.light.primary, `${nom} — la page reste sur la charte`)
    assert.equal(await tuilePage(), rgb(PAL.light.primary), `${nom} — la mosaïque reste sur la charte`)
  }
  /* l'onglet Fili porte la couleur du site — c'est à quoi il sert */
  await chips.nth(noms.indexOf('Fili')).click()
  await p.waitForFunction(() => document.querySelector('#moteur .mk-grande .mk-base')?.textContent === 'Fili')
  assert.equal(await calc(p, '#moteur .mk-grande', 'backgroundColor'), rgb(PAL.light.primary), 'retour à la charte')
  /* les paires déclarées tiennent aussi sur la page RENDUE, dans les deux thèmes */
  for (const t of ['light', 'dark']) {
    const jetons = [...new Set(PAIRES_DECLAREES.flatMap(([a, b]) => [a, b]))]
    const v = await resoudre(p, t, jetons)
    for (const [a, b, seuil] of PAIRES_DECLAREES) { const r = contraste(versHex(v[a]), versHex(v[b])); assert.ok(r >= seuil, `page ${t} — ${a}/${b} : ${r.toFixed(2)} < ${seuil}`) }
  }
  await fermer()
})

/* ── 4 · Les casses ── */
test('4 · pâlir l’encre, prêter la marque, survoler par filtre, forcer une action sombre, teinter sans tenir la luminance — chacune déclarée, rendue, jugée, réparée', async () => {
  const { p, fermer } = await nav.page(URL()); await releve(p)
  const bande = (i) => `#casser .doc-bande:nth-child(${i})`
  const casser = (i) => p.locator(`${bande(i)} .doc-casser`).click()
  /* pâlir l'encre douce : le gris refusé, posé de force, et le verdict tombe */
  const pan = `${bande(1)} .gd-pan`
  await casser(1); await p.waitForSelector(`${pan}[data-intent="statement"] .badge.ko`)
  assert.equal(await p.getAttribute(pan, 'data-intent'), 'statement')
  assert.equal(await p.evaluate((s) => getComputedStyle(document.querySelector(s)).getPropertyValue('--text-secondary').trim(), pan), '#9CA3AF')
  const badge = await texte(p, `${pan} .badge.ko`)
  assert.ok(badge.startsWith(fmt(contraste('#9CA3AF', PAL.light.surface))) && /recalé d'office/.test(badge) && contraste('#9CA3AF', PAL.light.surface) < 4.5, `pâli : ${badge}`)
  await casser(1); await p.waitForFunction((s) => !document.querySelector(`${s}[data-intent]`) && !document.querySelector(`${s} .badge.ko`), pan, { timeout: 3000 })
  assert.equal(await p.getAttribute(pan, 'data-intent'), null); assert.equal(await p.locator(`${pan} .badge.ko`).count(), 0, 'réparé : le verdict remonte')
  /* la marque prêtée à l'erreur */
  const c1 = bande(2)
  await casser(2)
  const al = `${c1} [style*="border-inline-start"]`
  assert.equal(await p.getAttribute(al, 'data-intent'), 'statement'); assert.equal(await calc(p, al, 'backgroundColor'), rgb(PAL.light['primary-subtle'])); assert.match(await texte(p, `${c1} .badge.ko`), /marque/)
  await casser(2); assert.equal(await calc(p, al, 'backgroundColor'), rgb(PAL.light['danger-subtle']))
  /* le survol par filtre : une couleur qu'aucun registre ne connaît */
  const c2 = bande(3)
  await p.locator(`${c2} .demo-plein`).hover(); await p.waitForTimeout(350)
  assert.equal(await calc(p, `${c2} .demo-plein`, 'filter'), 'none'); assert.equal(await calc(p, `${c2} .demo-plein`, 'backgroundColor'), rgb(PAL.light['primary-hover']), 'au repos, le survol est un jeton')
  await casser(3); await p.locator(`${c2} .demo-plein`).hover(); await p.waitForTimeout(350)
  assert.match(await calc(p, `${c2} .demo-plein`, 'filter'), /brightness/); assert.equal(await calc(p, `${c2} .demo-plein`, 'backgroundColor'), rgb(PAL.light.primary), 'cassé : un filtre sur la marque')
  assert.match(await texte(p, `${c2} .badge.ko`), /calculé à la volée/)
  await casser(3)
  /* l'action sombre forcée en thème sombre : C14 mord */
  const c3 = bande(4)
  await casser(4); await p.waitForSelector(`${c3} [data-theme="dark"][data-intent="statement"] .badge.ko`)
  assert.equal(await p.getAttribute(`${c3} [data-theme="dark"]`, 'data-intent'), 'statement')
  const r = contraste(PAL.dark['on-primary'], '#312E81'); assert.ok(r < 4.5)
  assert.equal(await texte(p, `${c3} [data-theme="dark"] .badge`), `${fmt(r)} — illisible`)
  assert.equal(await texte(p, `${c3} [data-theme="light"] .badge`), fmt(rapport(PAL.light, '--on-primary', '--primary')), 'le clair ne bouge pas')
  await casser(4); await p.waitForFunction((s) => !document.querySelector(`${s} .badge.ko`), c3)
  assert.equal(await texte(p, `${c3} [data-theme="dark"] .badge`), fmt(rapport(PAL.dark, '--on-primary', '--primary')), 'réparé')
  /* teinter sans tenir la luminance (casse inventée le 2 septembre) : les trois gris se ressemblent encore,
     leurs rapports n'ont plus rien à voir — chacun calculé sur la valeur rendue, jamais recopié */
  const c5 = bande(5)
  const rapports = async () => { const t = await p.evaluate((s) => [...document.querySelectorAll(`${s} .cl-teinte-tuile`)].map((e) => getComputedStyle(e).backgroundColor), c5)
    return [t.map((c) => (Math.round(contraste(versHex(c), '#FFFFFF') * 10) / 10).toFixed(1).replace('.', ',') + ':1'), await textes(p, `${c5} .cl-teinte-rapport`)] }
  let [calcules, dits] = await rapports(); assert.deepEqual(dits, calcules, 'au repos, chaque rapport dit est celui de la tuile rendue'); assert.ok(dits.every((d) => d === dits[0]), 'un seul rapport pour les trois')
  await casser(5); await p.waitForSelector(`${c5} .badge.ko`)
  ;[calcules, dits] = await rapports(); assert.deepEqual(dits, calcules, 'cassé, chaque rapport dit est encore celui de la tuile rendue'); assert.ok(new Set(dits).size === 3, `cassé : trois rapports différents (${dits})`)
  assert.equal(await texte(p, `${c5} .badge.ko`), 'trois rapports différents')
  await casser(5); await p.waitForFunction((s) => !document.querySelector(`${s} .badge.ko`), c5)
  await fermer()
})

/* ── 5 · Le thème sombre, et C17 ── */
test('5 · dans les deux thèmes, tout tertiaire rendu porte 600 au moins, au cran étiquette au moins, jamais un paragraphe lu (le tableau des rôles : dette dite, hors jeu)', async () => {
  for (const theme of ['light', 'dark']) {
    const { p, fermer } = await nav.page(URL(), { largeur: 1440, theme }); await releve(p)
    assert.equal(await calc(p, 'body', 'backgroundColor'), rgb(PAL[theme].surface), `${theme} — la page est dans son thème (le corps de page est la surface)`)
    const f = (await fautesC17(p, theme, 1440)).filter((x) => !x.startsWith('td.'))
    assert.deepEqual(f, [], `${theme} : ${f.length} faute(s)`)
    const combien = await p.evaluate((t) => [...document.querySelectorAll('main *')].filter((e) => getComputedStyle(e).color === t).length, rgb(encres(theme)['text-tertiary']))
    assert.ok(combien >= 10, `${theme} : ${combien} emplois du tertiaire`)
    await fermer()
  }
})

/* ── 6 · Rien en dur ── */
test('6 · marges, espaces, coins, tailles : chaque valeur calculée est une valeur du moteur (déclarées exceptées) ; les titres glissent ; la densité règle les coques ; zéro débord ; zéro erreur', async () => {
  const css = fs.readFileSync(path.join(KIT, 'app/globals.css'), 'utf8')
  const exclusions = [...selecteursDeclares(css, 'font-size'), ...selecteursEnEm(css)]
  /* les espaces en em (une flèche et son chiffre, la pastille d'un statut) : des proportions
     typographiques, comme le vérificateur du site l'admet — et, comme sur /arrondis, les
     mesures d'objet DITES sur leur ligne : la lane du ton du nuancier en est une, et le fond
     doux lui réserve sa place (déclarée depuis le 1er septembre) */
  const props = ['gap', 'row-gap', 'column-gap', 'padding', 'padding-inline', 'padding-block', 'padding-inline-end', 'border-radius', 'margin']
  const enEm = props.flatMap((prop) => [...selecteursEnEm(css, prop), ...selecteursDeclares(css, prop)])
  const affiche = []
  for (const W of LARGEURS) {
    const { p, fermer, erreurs } = await nav.page(URL(), { largeur: W }); await releve(p)
    /* chaque bande porte son propre dépliant : on les ouvre tous, d'un coup */
    await p.evaluate(() => document.querySelectorAll('details.prov').forEach((d) => { d.open = true }))
    await p.waitForTimeout(120)
    const f = await fautesEnDur(p, W, DENSITES.comfortable, { exclusions: enEm })
    assert.deepEqual(f, [], `${W} px : ${f.length} valeur(s) hors moteur`)
    /* Le fond doux du nuancier sort du balayage parce qu'il DÉCLARE la place qu'il
       réserve à la lane du ton. On la mesure donc nommément, et plus durement que le
       balayage ne le ferait : la place réservée vaut exactement la lane, plus la marge
       de ligne — et tout le reste de la ligne est bien sur la chaîne. */
    const lng = await p.evaluate(() => {
      const d = document.querySelector('#nuancier .gd-lng-doux'), t = document.querySelector('#nuancier .gd-lng-ton')
      const cd = getComputedStyle(d)
      return { haut: parseFloat(cd.paddingTop), gauche: parseFloat(cd.paddingLeft), droite: parseFloat(cd.paddingRight), espace: parseFloat(cd.rowGap), lane: t.getBoundingClientRect().width }
    })
    ok(lng.haut, attendu('pad-3-block', W), `${W} — le fond doux : marge de ligne`)
    ok(lng.gauche, attendu('pad-3-inline', W), `${W} — le fond doux : marge de ligne`)
    ok(lng.espace, attendu('gap-4-block', W), `${W} — le fond doux : au plus serré`)
    ok(lng.droite, lng.lane + attendu('pad-3-inline', W), `${W} — la place réservée = la lane du ton + la marge`, 0.5)
    const t = await fautesTailles(p, W, { exclusions })
    assert.deepEqual(t, [], `${W} px : ${t.length} taille(s) hors moteur`)
    assert.deepEqual(erreurs, [], 'la page ne jette aucune erreur')
    assert.equal(await debord(p), 0, `${W} px : la page déborde de l'écran`)
    const h1 = await calcPx(p, '.gdoc-heros h1', 'fontSize'); ok(h1, attendu('doc-cover', W), `${W} — affiche`); ok(await calcPx(p, '.gdoc-sec h2', 'fontSize'), attendu('doc-section', W), `${W} — section`); affiche.push(h1)
    await fermer()
  }
  assert.ok(affiche[0] < affiche[1] && affiche[1] < affiche[2], `l'affiche glisse : ${affiche}`)
  for (const densite of ['compact', 'airy']) {
    const { p, fermer } = await nav.page(URL(), { largeur: 1440, densite })
    ok(await calcPx(p, '#casser .doc-bande:nth-child(2) [style*="border-inline-start"]', 'paddingTop'), attendu('pad-2-block', 1440, DENSITES[densite]), `${densite} — l'alerte suit la base`)
    ok(await calcPx(p, '#situation .banc', 'paddingTop'), attendu('pad-1-block', 1440, DENSITES[densite]), `${densite} — la scène suit la base`)
    await fermer()
  }
})
test('6 · dans la vue, toute couleur écrite en dur est une casse, une étude, ou une marque du rail — dite sur sa ligne ou juste au-dessus', () => {
  const src = fs.readFileSync(path.join(KIT, 'app/couleur/vue.tsx'), 'utf8').split('\n')
  const fautes = []
  src.forEach((l, i) => {
    if (!/#[0-9A-Fa-f]{6}\b|rgba?\(\s*\d/.test(l)) return
    if (/^\s*(\/\/|\/\*|\*)/.test(l) || /^\s*[{ ]*id: "/.test(l) || /hex: "#/.test(l)) return /* commentaires, et les marques du rail (leur couleur est leur identité) */
    const contexte = src.slice(Math.max(0, i - 3), i + 1).join('\n')
    if (/casse|étude|hors chaîne/.test(contexte)) return
    fautes.push(`vue.tsx:${i + 1} ${l.trim().slice(0, 90)}`)
  })
  assert.deepEqual(fautes, [])
})

/* ── 8 · L'écriture et le répertoire (8 septembre 2026, soir) ──
   La palette et la situation sont fondues en une preuve, la marque rare
   (#palette garde la mosaïque, #situation le tableau de bord, dans la même
   section) ; la queue commune a disparu ; UN répertoire (#registre) range les
   rôles (#code), les six gammes (#gammes, ouvertes), cinq bandes (#casser, en
   h4) et la liste (#invisibles). */
test('8 · l’écriture : aucun mot qui commande ou décrit, pas d’histoire de page, pas de pied, un seul répertoire au titre de la page, aucun saut de niveau ; la marque rare porte le tableau de bord et la mosaïque ; quatre pièces au répertoire, les gammes ouvertes', async () => {
  const { p, fermer } = await nav.page(URL(), { largeur: 1440 })
  assert.deepEqual(await fautesEcriture(p), [])
  assert.equal(await p.locator('main .gdoc-sec').count(), 4, 'trois preuves et un répertoire')
  assert.equal(await p.locator('#palette #situation .bn-photo').count() + await p.locator('#palette .cm-tuile').count() > 1 ? 1 : 0, 1, 'la marque rare : le tableau de bord et la mosaïque, dans la même preuve')
  assert.equal(await p.locator('#registre #casser h4.doc-bande-nom').count(), 5, 'cinq gestes, en h4 sous leur sous-titre')
  assert.equal(await p.locator('#registre .doc-piece-tete h3').count(), 4, 'quatre pièces')
  assert.equal(await p.locator('#registre #gammes .gm').count(), 6, 'six gammes, lisibles sans un clic')
  assert.ok(await p.$eval('#registre #gammes details.prov', (d) => d.open), 'les gammes sont ouvertes d\'entrée')
  assert.ok(await p.locator('#registre #invisibles .doc-liste tbody tr').count() >= 1, 'la liste')
  await fermer()
})
