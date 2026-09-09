/* LE CRASH-TEST DE LA PAGE COULEUR — kit/tests/color.test.mjs
   Ce qui doit être vrai à l'écran, mesuré sans l'œil (plan validé par
   l'Auteur le 26 août 2026) :
   1 · chaque chiffre affiché sort du moteur (hex, RGB, rapports) et tient son seuil ;
   2 · chaque preuve est peinte par son propre token (mosaïque, nuancier, gammes, alerte, panneaux, voile) ;
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
import { derived, contrast, range, rangeNeutrals, rangeFamily, setOnRange, hexToLch, PAIRS_DECLAREDALL, PRIMARY_DEFAULTS, DENSITIES, CEILING_STATES } from '../derivation.mjs'
import { KIT, WIDTHS, TOL, openSite, openBrowser, expected, near, calcPx, calc, text, texts, faultsC17, faultsInHard, faultsSizes, selectorsDeclaredAll, selectorsInEm, overflow, rgb, inks , faultsWriting } from './bench.mjs'

const ok = (a, b, msg, tol = TOL) => assert.ok(a !== null && near(a, b, tol), `${msg} : ${a} attendu ${b}`)
const PAL = derived(PRIMARY_DEFAULTS)
/* l'écriture des rapports sur la page : deux décimales, virgule, « :1 » */
const fmt = (r) => `${r.toFixed(2).replace('.', ',')}:1`
const ratio = (pal, t, f) => contrast(pal[t.replace(/^--/, '')], pal[f.replace(/^--/, '')])
/* Le nuancier est passé en SIX LIGNES SIGNÉES, rangées en deux groupes, le
   31 août : la coupure est celle du jugement — ce qui ne juge rien d'un côté,
   les trois verdicts de l'autre. L'ordre ci-dessous est celui de la page ; il
   n'est pas décoratif, c'est la démonstration elle-même (« ne pas dépenser un
   verdict là où il n'y a rien à juger »), et l'épreuve le mesure comme tel. */
const GROUPS_SWATCHES = [
  ['Ce qui ne juge pas', ['primary', 'neutral', 'info']],
  ['Les trois verdicts', ['danger', 'success', 'warning']],
]
const PAIRS = {
  primary: ['--primary', '--on-primary', '--primary-subtle', '--on-primary-subtle'],
  neutral: ['--text-primary', '--bg', '--surface', '--text-secondary'],
  info: ['--info', '--on-info', '--info-subtle', '--on-info-subtle'],
  danger: ['--danger', '--on-danger', '--danger-subtle', '--on-danger-subtle'],
  success: ['--success', '--on-success', '--success-subtle', '--on-success-subtle'],
  warning: ['--warning', '--on-warning', '--warning-subtle', '--on-warning-subtle'],
}
const TABS = GROUPS_SWATCHES.flatMap(([, tokens]) => tokens).map((j) => [j, ...PAIRS[j]])
const TILES = [['primary', '--on-primary'], ['bg', '--text-primary'], ['primary-subtle', '--on-primary-subtle'], ['text-primary', '--bg'], ['surface', '--text-primary'], ['border-strong', '--bg']]
/* résoudre un token dans un hôte thématisé, comme la page le fait — par le moteur de rendu */
const resolve = (p, theme, names) => p.evaluate(([theme, names]) => {
  const h = document.createElement('div'); h.dataset.theme = theme; document.body.appendChild(h)
  const s = document.createElement('span'); h.appendChild(s)
  const out = {}
  for (const n of names) { s.style.color = `var(--${n})`; out[n] = getComputedStyle(s).color }
  h.remove(); return out
}, [theme, names])
const toHex = (rgbText) => '#' + rgbText.match(/\d+/g).slice(0, 3).map((v) => Number(v).toString(16).padStart(2, '0')).join('').toUpperCase()
/* attendre que la page ait fini ses relevés (elle mesure après le rendu) */
const survey = (p) => p.waitForFunction(() => ![...document.querySelectorAll('#charte .cm-specs, #swatches .gd-lng-record, #code table td')].some((e) => e.textContent.includes('…')))
/* Remise à niveau du 7 septembre 2026 : la page a pris les quatre étages (2 septembre,
   verdict d'Auteur : « garde 01 à 03 puis 05 ; 04 devient une règle qu'on peut casser »).
   « Deux thèmes » est devenu la première bande de #casser — UN seul panneau, dans le thème
   du lecteur, et la table des paires dans son dépliant ; les garde-fous sont quatre bandes ;
   la table des rôles est descendue dans le dépliant de #code. Aucune mesure relâchée : le
   panneau unique est mesuré dans les DEUX thèmes en rechargeant la page, et la casse
   « teinter ne coûte rien » (inventée le 2 septembre) entre à l'épreuve 4. */
const TABLE_ROLES = '#code details.prov table'

let site, nav
before(async () => { site = await openSite(); nav = await openBrowser() })
after(async () => { await nav?.close(); site?.close() })
const URL = () => site.url + '/couleur'

/* ── 1 · Chaque chiffre affiché sort du moteur ── */
test('1 · la mosaïque, ses proportions et la table des rôles disent les valeurs dérivées, dans les deux thèmes', async () => {
  for (const theme of ['light', 'dark']) {
    const { p, close } = await nav.page(URL(), { theme }); await survey(p)
    const pal = PAL[theme]
    const specs = await p.evaluate(() => [...document.querySelectorAll('#charte .cm-tile')].map((t) => [...t.querySelectorAll('.cm-specs span')].map((s) => s.textContent)))
    assert.equal(specs.length, 6)
    TILES.forEach(([role], i) => {
      const hex = pal[role]
      assert.equal(specs[i][1], hex, `${theme} — ${role} hex`)
      assert.equal(specs[i][3], `RGB ${[1, 3, 5].map((k) => parseInt(hex.slice(k, k + 2), 16)).join(', ')}`, `${theme} — ${role} RGB`)
      assert.equal(specs[i][0], `color.${role === 'bg' ? 'background' : role}`)
    })
    /* depuis le 9 septembre : les proportions sous le tableau de bord, la mosaïque au registre (#charte) */
    const props = await p.evaluate(() => [...document.querySelectorAll('#palette .cp-col')].map((c) => [c.querySelector('.cp-hex').textContent, c.querySelector('.cp-pct').textContent, getComputedStyle(c).flexBasis]))
    const expectedAll = [['bg', 56], ['surface', 18], ['text-primary', 14], ['border-strong', 7], ['primary', 5]]
    expectedAll.forEach(([role, part], i) => { assert.equal(props[i][0], pal[role], `${theme} — proportion ${role}`); assert.equal(props[i][1], `${part} %`); assert.equal(props[i][2], `${part}%`) })
    assert.equal(expectedAll.reduce((s, [, x]) => s + x, 0), 100, 'les parts font 100')
    /* la table des rôles : quinze rôles, la valeur claire ET sombre, quel que soit le thème de la page */
    const lines = await p.evaluate((t) => [...document.querySelectorAll(`${t} tbody tr`)].map((tr) => [...tr.children].map((td) => td.textContent.trim())), TABLE_ROLES)
    assert.equal(lines.length, 15)
    const roles = { 'primary': ['primary'], 'on-primary': ['on-primary'], 'primary-subtle': ['primary-subtle'], background: ['bg'], surface: ['surface'], 'text-primary': ['text-primary'], 'text-secondary': ['text-secondary'], 'text-tertiary': ['text-tertiary'], border: ['border'], 'border-strong': ['border-strong'], 'danger / subtil': ['danger', 'danger-subtle'], 'success / subtil': ['success', 'success-subtle'], 'warning / subtil': ['warning', 'warning-subtle'], 'on-warning-subtle': ['on-warning-subtle'], 'info / subtil': ['info', 'info-subtle'] }
    for (const [name, light, dark] of lines) {
      const r = roles[name]; assert.ok(r, `rôle inconnu : ${name}`)
      assert.equal(light.replace(/\s*\/\s*/g, ' '), r.map((x) => PAL.light[x]).join(' '), `${theme} — ${name} clair`)
      assert.equal(dark.replace(/\s*\/\s*/g, ' '), r.map((x) => PAL.dark[x]).join(' '), `${theme} — ${name} sombre`)
    }
    await close()
  }
})
test('1 · le nuancier, les deux panneaux, la table complète, le mini-écran et les gris teintés disent les rapports du moteur — et chaque paire tient son seuil, dans les deux thèmes', async () => {
  for (const theme of ['light', 'dark']) {
    const { p, close } = await nav.page(URL(), { theme }); await survey(p)
    const pal = PAL[theme]
    /* le nuancier lit le thème courant — et il est rangé par le jugement (31 août) */
    const groups = await p.evaluate(() => [...document.querySelectorAll('#swatches .gd-nfam')].map((s) => ({
      heading: s.querySelector('.gd-nfam-heading').textContent,
      lines: [...s.querySelectorAll('.gd-lng-record')].map((f) => f.textContent.split(' · ')[0]),
    })))
    assert.deepEqual(groups.map((g) => [g.heading, g.lines]), GROUPS_SWATCHES, `${theme} — les deux groupes du nuancier`)
    const records = await texts(p, '#swatches .gd-lng-record')
    assert.equal(records.length, 6, `${theme} — six lignes signées`)
    TABS.forEach(([token, tone, , soft, onSoft], i) => assert.equal(records[i], `${token} · ${pal[tone.slice(2)]} · doux ${pal[soft.slice(2)]} · ${fmt(ratio(pal, onSoft, soft))}`, `${theme} — languette ${token}`))
    /* le panneau du contraste par paire : UN seul, dans le thème du lecteur (2 septembre) — trois rapports, lus */
    const badges = await p.evaluate(() => [...document.querySelectorAll('#wreck .gd-pan .badge')].map((b) => b.textContent))
    assert.deepEqual(badges, [['--text-primary', '--surface'], ['--text-secondary', '--surface'], ['--on-primary', '--primary']].map(([a, b]) => fmt(ratio(pal, a, b))), `panneau ${theme}`)
    for (const b of badges) assert.ok(parseFloat(b.replace(',', '.')) >= 4.5, `panneau ${theme} : ${b}`)
    /* la table complète, dans le dépliant de sa règle : chaque ligne, les deux thèmes, au seuil */
    await p.locator('#wreck .doc-band:nth-child(1) details.prov summary').click()
    const lines = await p.evaluate(() => [...document.querySelectorAll('#wreck .doc-band:nth-child(1) table tbody tr')].map((tr) => [tr.querySelector('.mono').textContent, tr.children[1].textContent, tr.children[2].textContent, tr.children[3].textContent]))
    assert.equal(lines.length, 27) /* 23 + les quatre traits clavier du halo de focus, rouge et neutre (#133) */
    for (const [pair, threshold, light, dark] of lines) {
      const [t, f] = pair.split(' / ')
      const s = threshold === '3:1' ? 3 : 4.5
      const decl = PAIRS_DECLAREDALL.find(([a, b]) => `--${a}` === t && `--${b}` === f); assert.ok(decl && decl[2] === s, `${pair} : paire déclarée au moteur avec le seuil ${s}`)
      assert.equal(light, fmt(ratio(PAL.light, t, f)), `${pair} clair`); assert.equal(dark, fmt(ratio(PAL.dark, t, f)), `${pair} sombre`)
      assert.ok(ratio(PAL.light, t, f) >= s && ratio(PAL.dark, t, f) >= s, `${pair} tient ${s}`)
    }
    /* le mini-écran, dans ses deux versants ; les gris à luminance constante : un rapport sous chaque tuile */
    for (const t of ['light', 'dark']) assert.equal(await text(p, `#wreck .cl-side[data-theme="${t}"] .badge`), fmt(ratio(PAL[t], '--on-primary', '--primary')), `mini-écran ${t}`)
    const gray = ['#6B7280', '#78716A', '#67737F'].map((h) => (Math.round(contrast(h, '#FFFFFF') * 10) / 10).toFixed(1).replace('.', ','))
    assert.ok(gray.every((g) => g === gray[0]), `trois gris, un rapport : ${gray}`)
    assert.deepEqual(await texts(p, '#wreck .cl-hue-ratio'), gray.map((g) => `${g}:1`), 'chaque gris porte son rapport')
    assert.equal(await text(p, '#wreck .cl-hue .badge'), 'le même rapport pour les trois')
    await close()
  }
})

/* ── 2 · Chaque preuve est peinte par son propre token ── */
test('2 · la mosaïque, le nuancier, les gammes, l’alerte et les panneaux sont peints par la valeur dérivée ; le voile du bento est calculé et tient 4,5', async () => {
  for (const theme of ['light', 'dark']) {
    const { p, close } = await nav.page(URL(), { theme }); await survey(p)
    const pal = PAL[theme]
    const painted = await p.evaluate(() => [...document.querySelectorAll('#charte .cm-tile')].map((t) => [getComputedStyle(t).backgroundColor, getComputedStyle(t).color]))
    TILES.forEach(([role, on], i) => { assert.equal(painted[i][0], rgb(pal[role]), `${theme} — tuile ${role} peinte`); assert.equal(painted[i][1], rgb(pal[on.slice(2)]), `${theme} — tuile ${role} encre`) })
    const lng = await p.evaluate(() => [...document.querySelectorAll('#swatches .gd-lng')].map((l) => [getComputedStyle(l.querySelector('.gd-lng-soft')).backgroundColor, getComputedStyle(l.querySelector('.gd-lng-soft')).color, getComputedStyle(l.querySelector('.gd-lng-tone')).backgroundColor, getComputedStyle(l.querySelector('.gd-lng-tone')).color]))
    TABS.forEach(([token, tone, onTone, soft, onSoft], i) => assert.deepEqual(lng[i], [soft, onSoft, tone, onTone].map((n) => rgb(pal[n.slice(2)])), `${theme} — languette ${token} peinte`))
    /* les gammes 50–950 : la barre est la gamme du moteur ; les rôles posés sont ceux qu'il pose */
    /* depuis le 8 septembre (soir), les gammes vivent au répertoire, ouvertes d'entrée */
    const bars = await p.evaluate(() => [...document.querySelectorAll('#registry #gammes .gm')].map((g) => ({
      hex: [...g.querySelectorAll('.gm-bar button')].map((b) => b.getAttribute('aria-label').split(' — ')[1]),
      steps: [...g.querySelectorAll('.gm-step')].map((c) => ({ step: c.firstElementChild.textContent, roles: [...c.querySelectorAll('.gm-role')].map((r) => r.textContent) })),
    })))
    assert.equal(bars.length, 6)
    const L = PAL.light
    const expectedList = [
      [range(PRIMARY_DEFAULTS), { primary: L.primary, hover: L['primary-hover'], subtle: L['primary-subtle'], text: L['primary-text'], 'code-bg': L['code-bg'] }],
      [rangeNeutrals(PRIMARY_DEFAULTS), { bg: L.bg, surface: L.surface, hover: L['surface-hover'], border: L['border-strong'], secondary: L['text-secondary'], text: L['text-primary'] }],
      ...['danger', 'success', 'warning', 'info'].map((n) => { const roles = { [n]: L[n], subtle: L[`${n}-subtle`] }; if (L[`on-${n}-subtle`].toUpperCase() !== L[n].toUpperCase()) roles['on-subtle'] = L[`on-${n}-subtle`]; return [rangeFamily(L[n], L[`${n}-subtle`]), roles] }),
    ]
    expectedList.forEach(([steps, roles], i) => {
      assert.deepEqual(bars[i].hex, steps.map(([, h]) => h), `gamme ${i} — la barre`)
      const setAll = setOnRange(steps, roles)
      bars[i].steps.forEach(({ step, roles: readSet }) => assert.deepEqual(readSet, (setAll[step] ?? []).map((r) => (r.exact ? r.role : `≈ ${r.role}`)), `gamme ${i} — rôles sur ${step}`))
    })
    /* l'alerte : fond doux, filet et encre du danger — une carte (coin, marge) */
    const al = '#wreck .doc-band:nth-child(2) [style*="border-inline-start"]'
    assert.equal(await calc(p, al, 'backgroundColor'), rgb(pal['danger-subtle'])); assert.equal(await calc(p, al, 'borderLeftColor'), rgb(pal.danger)); assert.equal(await calc(p, al, 'color'), rgb(pal.danger))
    ok(await calcPx(p, al, 'borderTopLeftRadius'), expected('r-2', 1440), 'alerte : coin de carte'); ok(await calcPx(p, al, 'paddingTop'), expected('pad-2-block', 1440), 'alerte : marge de carte')
    /* le panneau du contraste rend le thème du lecteur ; les deux versants du mini-écran rendent chacun le leur */
    const c = await p.evaluate(() => { const pan = document.querySelector('#wreck .gd-pan'); return [getComputedStyle(pan.querySelector('.gd-pan-card')).backgroundColor, getComputedStyle(pan.querySelector('.gd-pan-card span')).color] })
    assert.deepEqual(c, [rgb(pal.bg), rgb(pal['text-primary'])], `panneau peint dans le thème ${theme}`)
    for (const t of ['light', 'dark']) {
      const v = await p.evaluate((t) => { const e = document.querySelector(`#wreck .cl-side[data-theme="${t}"] [style*="border"]`); return [getComputedStyle(e).backgroundColor, getComputedStyle(e.firstElementChild).backgroundColor] }, t)
      assert.deepEqual(v, [rgb(PAL[t].bg), rgb(PAL[t].primary)], `versant ${t} peint dans son thème`)
    }
    /* le voile du bento : un calcul, dit, qui tient 4,5 */
    await p.waitForFunction(() => /voile \d+ %/.test(document.querySelector('#situation .bn-veil-says')?.textContent ?? ''))
    const says = await text(p, '#situation .bn-veil-says')
    const m = says.match(/voile (\d+) % · pire couleur du dessin ([\d,]+):1/); assert.ok(m, `voile dit : ${says}`)
    assert.ok(parseFloat(m[2].replace(',', '.')) >= 4.5 - 0.005, `${theme} — le voile tient 4,5 : ${says}`)
    const alpha = await p.evaluate(() => parseFloat(getComputedStyle(document.querySelector('#situation .bn-photo')).getPropertyValue('--bn-veil')))
    ok(alpha * 100, parseInt(m[1]), `${theme} — le voile posé est celui qui est dit`, 0.5)
    await close()
  }
})

/* ── 3 · Le moteur sous les yeux ── */
/* Depuis le 31 août, la démo REGARDE, elle ne pilote plus : la marque du site se
   choisit dans la barre d'outils, et nulle part ailleurs. Prendre une marque dans
   le rail ne change que cette scène-là. L'épreuve dit donc DEUX choses au lieu
   d'une, et c'est plus dur que l'ancienne : que toute la scène soit dérivée de la
   marque regardée — et que la page, elle, ne bouge pas d'un pixel de couleur. */
test('3 · une marque entre par le rail : la scène entière est dérivée d’elle, les sémantiques gardent leur teinte, les paires déclarées tiennent — et la page ne change PAS de primaire', async () => {
  const { p, close } = await nav.page(URL()); await survey(p)
  const chips = p.locator('#engine .mk-chip[title]')
  const names = await chips.evaluateAll((els) => els.map((e) => e.title))
  /* l'état de la page avant qu'on touche au rail : c'est lui qui ne doit pas bouger */
  const varPage = () => p.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--primary').trim().toUpperCase())
  const tilePage = () => calc(p, '#charte .cm-tile', 'backgroundColor')
  assert.equal(await varPage(), PAL.light.primary, 'au départ, la page est sur la charte')
  const brands = { Spotify: '#1DB954', Netflix: '#E50914', Slack: '#4A154B' }
  for (const [name, hex] of Object.entries(brands)) {
    await chips.nth(names.indexOf(name)).click()
    await p.waitForFunction((n) => document.querySelector('#engine .mk-large .mk-base')?.textContent === n, name)
    const pal = derived(hex)
    /* la scène : le plein et le doux, logo et nom, dérivés de la marque regardée */
    const scene = await p.evaluate(() => [...document.querySelectorAll('#engine .mk-large')].map((g) => [getComputedStyle(g).backgroundColor, getComputedStyle(g).color]))
    assert.deepEqual(scene, [[rgb(pal.light.primary), rgb(pal.light['on-primary'])], [rgb(pal.light['primary-subtle']), rgb(pal.light['primary-text'])]], `${name} — la scène`)
    /* le chip choisi porte sa marque, et lui seul */
    assert.equal(await p.evaluate(() => [...document.querySelectorAll('#engine .mk-chip[title]')].filter((c) => c.getAttribute('aria-pressed') === 'true').length), 1, `${name} — un seul chip enfoncé`)
    await p.waitForTimeout(200) /* le chip anime son fond (0,15 s) ; le banc le lit au repos */
    assert.equal(await calc(p, `#engine .mk-chip[title="${name}"]`, 'backgroundColor'), rgb(hex), `${name} — le chip enfoncé porte sa couleur`)
    const bars = await p.evaluate(() => [...document.querySelectorAll('#engine .mk-rank')].map((r) => [...r.querySelectorAll('.mk-bar')].map((b) => getComputedStyle(b).backgroundColor)))
    assert.deepEqual(bars[0], range(hex).filter(([c]) => [100, 300, 500, 700].includes(c)).map(([, h]) => rgb(h)), `${name} — la gamme`)
    assert.deepEqual(bars[1], ['danger', 'success', 'warning', 'info'].flatMap((v) => [rgb(pal.light[v]), rgb(pal.light[`${v}-subtle`])]), `${name} — les sémantiques`)
    /* un rouge reste un rouge : la teinte de chaque famille ne s'éloigne pas de la charte de plus que le plafond du moteur, au degré d'arrondi 8 bits près */
    for (const v of ['danger', 'success', 'warning', 'info']) { const d = Math.abs(((hexToLch(pal.light[v])[2] - hexToLch(PAL.light[v])[2] + 540) % 360) - 180); assert.ok(d <= CEILING_STATES + 1, `${name} — ${v} a tourné de ${d.toFixed(0)}°`) }
    /* la famille dérivée tient ses seuils : la conformité n'est pas vérifiée après coup, elle est obtenue */
    for (const t of ['light', 'dark']) for (const [a, b, threshold] of PAIRS_DECLAREDALL) {
      const r = contrast(pal[t][a.replace(/^--/, '')], pal[t][b.replace(/^--/, '')])
      assert.ok(r >= threshold, `${name} ${t} — ${a}/${b} : ${r.toFixed(2)} < ${threshold}`)
    }
    /* et la page n'a pas bougé — c'est la décision du 31 août, mesurée */
    assert.equal(await p.evaluate(() => document.documentElement.dataset.primary ?? null), null, `${name} — la démo ne pilote pas le site`)
    assert.equal(await varPage(), PAL.light.primary, `${name} — la page reste sur la charte`)
    assert.equal(await tilePage(), rgb(PAL.light.primary), `${name} — la mosaïque reste sur la charte`)
  }
  /* l'onglet Fili porte la couleur du site — c'est à quoi il sert */
  await chips.nth(names.indexOf('Fili')).click()
  await p.waitForFunction(() => document.querySelector('#engine .mk-large .mk-base')?.textContent === 'Fili')
  assert.equal(await calc(p, '#engine .mk-large', 'backgroundColor'), rgb(PAL.light.primary), 'retour à la charte')
  /* les paires déclarées tiennent aussi sur la page RENDUE, dans les deux thèmes */
  for (const t of ['light', 'dark']) {
    const tokens = [...new Set(PAIRS_DECLAREDALL.flatMap(([a, b]) => [a, b]))]
    const v = await resolve(p, t, tokens)
    for (const [a, b, threshold] of PAIRS_DECLAREDALL) { const r = contrast(toHex(v[a]), toHex(v[b])); assert.ok(r >= threshold, `page ${t} — ${a}/${b} : ${r.toFixed(2)} < ${threshold}`) }
  }
  await close()
})

/* ── 4 · Les casses ── */
test('4 · pâlir l’encre, prêter la marque, survoler par filtre, forcer une action sombre, teinter sans tenir la luminance — chacune déclarée, rendue, jugée, réparée', async () => {
  const { p, close } = await nav.page(URL()); await survey(p)
  const band = (i) => `#wreck .doc-band:nth-child(${i})`
  const wreck = (i) => p.locator(`${band(i)} .doc-wreck`).click()
  /* pâlir l'encre douce : le gris refusé, posé de force, et le verdict tombe */
  const pan = `${band(1)} .gd-pan`
  await wreck(1); await p.waitForSelector(`${pan}[data-intent="statement"] .badge.ko`)
  assert.equal(await p.getAttribute(pan, 'data-intent'), 'statement')
  assert.equal(await p.evaluate((s) => getComputedStyle(document.querySelector(s)).getPropertyValue('--text-secondary').trim(), pan), '#9CA3AF')
  const badge = await text(p, `${pan} .badge.ko`)
  assert.ok(badge.startsWith(fmt(contrast('#9CA3AF', PAL.light.surface))) && /recalé d'office/.test(badge) && contrast('#9CA3AF', PAL.light.surface) < 4.5, `pâli : ${badge}`)
  await wreck(1); await p.waitForFunction((s) => !document.querySelector(`${s}[data-intent]`) && !document.querySelector(`${s} .badge.ko`), pan, { timeout: 3000 })
  assert.equal(await p.getAttribute(pan, 'data-intent'), null); assert.equal(await p.locator(`${pan} .badge.ko`).count(), 0, 'réparé : le verdict remonte')
  /* la marque prêtée à l'erreur */
  const c1 = band(2)
  await wreck(2)
  const al = `${c1} [style*="border-inline-start"]`
  assert.equal(await p.getAttribute(al, 'data-intent'), 'statement'); assert.equal(await calc(p, al, 'backgroundColor'), rgb(PAL.light['primary-subtle'])); assert.match(await text(p, `${c1} .badge.ko`), /marque/)
  await wreck(2); assert.equal(await calc(p, al, 'backgroundColor'), rgb(PAL.light['danger-subtle']))
  /* le survol par filtre : une couleur qu'aucun registre ne connaît */
  const c2 = band(3)
  await p.locator(`${c2} .demo-full`).hover(); await p.waitForTimeout(350)
  assert.equal(await calc(p, `${c2} .demo-full`, 'filter'), 'none'); assert.equal(await calc(p, `${c2} .demo-full`, 'backgroundColor'), rgb(PAL.light['primary-hover']), 'au repos, le survol est un token')
  await wreck(3); await p.locator(`${c2} .demo-full`).hover(); await p.waitForTimeout(350)
  assert.match(await calc(p, `${c2} .demo-full`, 'filter'), /brightness/); assert.equal(await calc(p, `${c2} .demo-full`, 'backgroundColor'), rgb(PAL.light.primary), 'cassé : un filtre sur la marque')
  assert.match(await text(p, `${c2} .badge.ko`), /calculé à la volée/)
  await wreck(3)
  /* l'action sombre forcée en thème sombre : C14 mord */
  const c3 = band(4)
  await wreck(4); await p.waitForSelector(`${c3} [data-theme="dark"][data-intent="statement"] .badge.ko`)
  assert.equal(await p.getAttribute(`${c3} [data-theme="dark"]`, 'data-intent'), 'statement')
  const r = contrast(PAL.dark['on-primary'], '#312E81'); assert.ok(r < 4.5)
  assert.equal(await text(p, `${c3} [data-theme="dark"] .badge`), `${fmt(r)} — illisible`)
  assert.equal(await text(p, `${c3} [data-theme="light"] .badge`), fmt(ratio(PAL.light, '--on-primary', '--primary')), 'le clair ne bouge pas')
  await wreck(4); await p.waitForFunction((s) => !document.querySelector(`${s} .badge.ko`), c3)
  /* le rapport se relit sur le rendu après la réparation : on attend la mesure, pas le tiret */
  await p.waitForFunction((s) => !/—/.test(document.querySelector(`${s} [data-theme="dark"] .badge`)?.textContent ?? '—'), c3, { timeout: 3000 })
  assert.equal(await text(p, `${c3} [data-theme="dark"] .badge`), fmt(ratio(PAL.dark, '--on-primary', '--primary')), 'réparé')
  /* teinter sans tenir la luminance (casse inventée le 2 septembre) : les trois gris se ressemblent encore,
     leurs rapports n'ont plus rien à voir — chacun calculé sur la valeur rendue, jamais recopié */
  const c5 = band(5)
  const ratios = async () => { const t = await p.evaluate((s) => [...document.querySelectorAll(`${s} .cl-hue-tile`)].map((e) => getComputedStyle(e).backgroundColor), c5)
    return [t.map((c) => (Math.round(contrast(toHex(c), '#FFFFFF') * 10) / 10).toFixed(1).replace('.', ',') + ':1'), await texts(p, `${c5} .cl-hue-ratio`)] }
  let [computed, said] = await ratios(); assert.deepEqual(said, computed, 'au repos, chaque rapport dit est celui de la tuile rendue'); assert.ok(said.every((d) => d === said[0]), 'un seul rapport pour les trois')
  await wreck(5); await p.waitForSelector(`${c5} .badge.ko`)
  ;[computed, said] = await ratios(); assert.deepEqual(said, computed, 'cassé, chaque rapport dit est encore celui de la tuile rendue'); assert.ok(new Set(said).size === 3, `cassé : trois rapports différents (${said})`)
  assert.equal(await text(p, `${c5} .badge.ko`), 'trois rapports différents')
  await wreck(5); await p.waitForFunction((s) => !document.querySelector(`${s} .badge.ko`), c5)
  await close()
})

/* ── 5 · Le thème sombre, et C17 ── */
test('5 · dans les deux thèmes, tout tertiaire rendu porte 600 au moins, au cran étiquette au moins, jamais un paragraphe lu (le tableau des rôles : dette dite, hors jeu)', async () => {
  for (const theme of ['light', 'dark']) {
    const { p, close } = await nav.page(URL(), { width: 1440, theme }); await survey(p)
    assert.equal(await calc(p, 'body', 'backgroundColor'), rgb(PAL[theme].surface), `${theme} — la page est dans son thème (le corps de page est la surface)`)
    const f = (await faultsC17(p, theme, 1440)).filter((x) => !x.startsWith('td.'))
    assert.deepEqual(f, [], `${theme} : ${f.length} faute(s)`)
    const howmany = await p.evaluate((t) => [...document.querySelectorAll('main *')].filter((e) => getComputedStyle(e).color === t).length, rgb(inks(theme)['text-tertiary']))
    assert.ok(howmany >= 10, `${theme} : ${howmany} emplois du tertiaire`)
    await close()
  }
})

/* ── 6 · Rien en dur ── */
test('6 · marges, espaces, coins, tailles : chaque valeur calculée est une valeur du moteur (déclarées exceptées) ; les titres glissent ; la densité règle les coques ; zéro débord ; zéro erreur', async () => {
  const css = fs.readFileSync(path.join(KIT, 'app/globals.css'), 'utf8')
  const exclusions = [...selectorsDeclaredAll(css, 'font-size'), ...selectorsInEm(css)]
  /* les espaces en em (une flèche et son chiffre, la pastille d'un statut) : des proportions
     typographiques, comme le vérificateur du site l'admet — et, comme sur /arrondis, les
     mesures d'objet DITES sur leur ligne : la lane du ton du nuancier en est une, et le fond
     doux lui réserve sa place (déclarée depuis le 1er septembre) */
  const props = ['gap', 'row-gap', 'column-gap', 'padding', 'padding-inline', 'padding-block', 'padding-inline-end', 'border-radius', 'margin']
  const inEm = props.flatMap((prop) => [...selectorsInEm(css, prop), ...selectorsDeclaredAll(css, prop)])
  const display = []
  for (const W of WIDTHS) {
    const { p, close, errors } = await nav.page(URL(), { width: W }); await survey(p)
    /* chaque bande porte son propre dépliant : on les ouvre tous, d'un coup */
    await p.evaluate(() => document.querySelectorAll('details.prov').forEach((d) => { d.open = true }))
    await p.waitForTimeout(120)
    const f = await faultsInHard(p, W, DENSITIES.comfortable, { exclusions: inEm })
    assert.deepEqual(f, [], `${W} px : ${f.length} valeur(s) hors moteur`)
    /* Le fond doux du nuancier sort du balayage parce qu'il DÉCLARE la place qu'il
       réserve à la lane du ton. On la mesure donc nommément, et plus durement que le
       balayage ne le ferait : la place réservée vaut exactement la lane, plus la marge
       de ligne — et tout le reste de la ligne est bien sur la chaîne. */
    const lng = await p.evaluate(() => {
      const d = document.querySelector('#swatches .gd-lng-soft'), t = document.querySelector('#swatches .gd-lng-tone')
      const cd = getComputedStyle(d)
      return { top: parseFloat(cd.paddingTop), left: parseFloat(cd.paddingLeft), right: parseFloat(cd.paddingRight), space: parseFloat(cd.rowGap), lane: t.getBoundingClientRect().width }
    })
    ok(lng.top, expected('pad-3-block', W), `${W} — le fond doux : marge de ligne`)
    ok(lng.left, expected('pad-3-inline', W), `${W} — le fond doux : marge de ligne`)
    ok(lng.space, expected('gap-4-block', W), `${W} — le fond doux : au plus serré`)
    ok(lng.right, lng.lane + expected('pad-3-inline', W), `${W} — la place réservée = la lane du ton + la marge`, 0.5)
    const t = await faultsSizes(p, W, { exclusions })
    assert.deepEqual(t, [], `${W} px : ${t.length} taille(s) hors moteur`)
    assert.deepEqual(errors, [], 'la page ne jette aucune erreur')
    assert.equal(await overflow(p), 0, `${W} px : la page déborde de l'écran`)
    const h1 = await calcPx(p, '.gdoc-hero h1', 'fontSize'); ok(h1, expected('doc-cover', W), `${W} — affiche`); ok(await calcPx(p, '.gdoc-sec h2', 'fontSize'), expected('doc-section', W), `${W} — section`); display.push(h1)
    await close()
  }
  assert.ok(display[0] < display[1] && display[1] < display[2], `l'affiche glisse : ${display}`)
  for (const density of ['compact', 'airy']) {
    const { p, close } = await nav.page(URL(), { width: 1440, density })
    ok(await calcPx(p, '#wreck .doc-band:nth-child(2) [style*="border-inline-start"]', 'paddingTop'), expected('pad-2-block', 1440, DENSITIES[density]), `${density} — l'alerte suit la base`)
    ok(await calcPx(p, '#situation .bench', 'paddingTop'), expected('pad-1-block', 1440, DENSITIES[density]), `${density} — la scène suit la base`)
    await close()
  }
})
test('6 · dans la vue, toute couleur écrite en dur est une casse, une étude, ou une marque du rail — dite sur sa ligne ou juste au-dessus', () => {
  const src = fs.readFileSync(path.join(KIT, 'app/couleur/view.tsx'), 'utf8').split('\n')
  const faults = []
  src.forEach((l, i) => {
    if (!/#[0-9A-Fa-f]{6}\b|rgba?\(\s*\d/.test(l)) return
    if (/^\s*(\/\/|\/\*|\*)/.test(l) || /^\s*[{ ]*id: "/.test(l) || /hex: "#/.test(l)) return /* commentaires, et les marques du rail (leur couleur est leur identité) */
    const context = src.slice(Math.max(0, i - 3), i + 1).join('\n')
    if (/casse|broken|étude|hors chaîne/.test(context)) return
    faults.push(`vue.tsx:${i + 1} ${l.trim().slice(0, 90)}`)
  })
  assert.deepEqual(faults, [])
})

/* ── 8 · L'écriture et le répertoire (8 septembre 2026, soir) ──
   La palette et la situation sont fondues en une preuve, la marque rare
   (#situation le tableau de bord et les proportions ; la mosaïque au registre, #charte, dans la même
   section) ; la queue commune a disparu ; UN répertoire (#registre) range les
   rôles (#code), les six gammes (#gammes, ouvertes), cinq bandes (#casser, en
   h4) et la liste (#invisibles). */
test('8 · l’écriture : aucun mot qui commande ou décrit, pas d’histoire de page, pas de pied, un seul répertoire au titre de la page, aucun saut de niveau ; la marque rare porte le tableau de bord et la mosaïque ; quatre pièces au répertoire, les gammes ouvertes', async () => {
  const { p, close } = await nav.page(URL(), { width: 1440 })
  assert.deepEqual(await faultsWriting(p), [])
  assert.equal(await p.locator('main .gdoc-sec').count(), 4, 'trois preuves et un répertoire')
  assert.equal(await p.locator('#palette #situation .bn-photo').count(), 1, 'la marque rare : le tableau de bord porte la preuve')
  assert.ok(await p.locator('#palette .cp-col').count() >= 3 && await p.locator('#palette .cm-tile').count() === 0, 'sous lui, les proportions seules — la mosaïque est au registre')
  assert.ok(await p.locator('#registry #charte .cm-tile').count() >= 6, 'la charte en mosaïque, entière, au registre')
  assert.equal(await p.locator('#registry #wreck h4.doc-band-name').count(), 5, 'cinq gestes, en h4 sous leur sous-titre')
  assert.equal(await p.locator('#registry .doc-piece-head h3').count(), 5, 'cinq pièces')
  assert.equal(await p.locator('#registry #gammes .gm').count(), 6, 'six gammes, lisibles sans un clic')
  assert.ok(await p.$eval('#registry #gammes details.prov', (d) => d.open), 'les gammes sont ouvertes d\'entrée')
  assert.ok(await p.locator('#registry #invisibles .doc-list tbody tr').count() >= 1, 'la liste')
  await close()
})
