/* LE CRASH-TEST DU MOTEUR — kit/derivation.test.mjs
   Chaque page de décision du 25 août 2026 a affiché des chiffres ; le moteur
   doit les reproduire avec les réglages de la page, au dixième de pixel.
   Rien ici n'est une opinion : ce sont les valeurs lues sur les huit pages
   (claude/livrables/decision-1…8-*.html), la planche « avant contre trois
   racines », et le tokens.css d'avant (la couleur ne bouge pas d'un bit).

   Lancer : node --test kit/derivation.test.mjs                              */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  chain, tokens, fluid, aWidth, factor, AXES, CHARTER, BOUNDS, DENSITIES, OFF_CHAIN,
  toCssRhythm, toFigma, toTailwind, REGISTRY, INTENTS, WEIGHT, derived, toCss, verify, contrast, hexToLch, lchToHex, range, rangeFamily, rangeNeutrals, PRIMARY_DEFAULTS, ACCENT_AUTHOR, PAIRS_DECLAREDALL, WIDTH_FREEZE, PART_STATES, CEILING_STATES, MOTION, LAYOUTS, POSTURE, linear, fonts,
} from './derivation.mjs'

const HERE = path.dirname(fileURLToPath(import.meta.url))
/* au dixième de pixel, comme les pages l'affichent */
const near = (a, b, tol = 0.051, msg) => assert.ok(Math.abs(a - b) <= tol, msg ?? `${a} attendu ${b}`)
const list = (a, b, tol, msg) => a.forEach((v, i) => near(v, b[i], tol, `${msg ?? ''} [${i}] ${v} attendu ${b[i]}`))

/* ── La charte : ce que la planche a tranché ── */
test('charte — racine 16 (planche du 25 août) : coins 16 · 8 · 4 · 2, bouton 4, marges 24 · 17 · 12, espaces 17 · 12', () => {
  assert.equal(CHARTER.root, 16)
  const s = chain()
  list(s.r, [16, 8, 4, 2])
  assert.equal(s.rCtl, 4)
  list(s.pad, [24, 17, 12])
  list(s.gap.slice(0, 2), [17, 12])
  assert.equal(s.edge, 24)
})

/* ── Décision 1 : l'espace entre deux frères vaut leur marge ── */
test('décision 1 — marges 24 · 17 · 12, espaces 17 · 12, bord 24 ; l’espace d’une profondeur = la marge de ses enfants', () => {
  const s = chain({ root: 24 })
  list(s.pad, [24, 17, 12], 0.05, 'margins')
  list(s.gap.slice(0, 2), [17, 12], 0.05, 'spaces')
  assert.equal(s.gap[0], s.pad[1]); assert.equal(s.gap[1], s.pad[2])
  assert.equal(s.edge, s.pad[0])
  /* B (l'octave) écartée : jamais 24 · 12 · 6 avec √2 */
  assert.notEqual(Math.round(s.pad[1]), 12)
})

/* ── Décision 2 : la coque est le niveau 1 et porte la racine, bornée à 38 ── */
test('décision 2 — racine 24 : 24 · 12 · 6 · 3 ; borne 38 acceptée, 39 et 48 refusées', () => {
  list(chain({ root: 24 }).r, [24, 12, 6, 3])
  list(chain({ root: 38 }).r, [38, 19, 9.5, 4.75])
  assert.throws(() => chain({ root: 39 }), /décision 2/)
  assert.throws(() => chain({ root: 48 }), /décision 2/)
  assert.deepEqual(BOUNDS.root, [0, 38])
})
test('décision 2 — la marge ne descend jamais sous le coin (vu à racine 38 sur la page : la carte relevée à 19)', () => {
  const s = chain({ root: 38 })
  assert.ok(s.pad.every((m, i) => m >= s.r[i]))
  near(s.pad[0], 38); near(s.pad[1], 19)
  assert.ok(s.guarantees.marginAtAboveOfCorner)
  assert.ok(chain().guarantees.marginSurveyed.every((x) => x === false), 'à la charte la règle ne joue pas')
})

/* ── Décision 3 : le composant prend le coin de la ligne ── */
test('décision 3 — le bouton = racine ÷ 4 : 0 · 1 · 2 · 6 · 8 · 9,5 pour les racines 0 · 4 · 8 · 24 · 32 · 38', () => {
  const table = [[0, 0], [4, 1], [8, 2], [24, 6], [32, 8], [38, 9.5]]
  for (const [root, button] of table) {
    const s = chain({ root })
    near(s.rCtl, button, 0.001, `racine ${root}`)
    assert.equal(s.rCtl, s.r[2], 'le bouton est le coin de la ligne')
  }
  assert.equal(tokens(chain())['r-ctl'].css, 'var(--r-3)')
  /* aucun enfant plus rond que son parent, sans clause d'exception */
  for (const root of [0, 4, 8, 12, 16, 24, 32, 38]) assert.ok(chain({ root }).guarantees.childLessCircle, `racine ${root}`)
})

/* ── Décision 4 : la densité change la base, coins fixes ── */
test('décision 4 — compact 16 → 16 · 11,3 · 8 ; aéré 32 → 32 · 22,6 · 16 ; les coins ne bougent pas', () => {
  const c = chain({ base: 16 }), a = chain({ base: 32 }), m = chain({ base: 24 })
  list(c.pad, [16, 11.3, 8], 0.05, 'compact')
  list(a.pad, [32, 22.6, 16], 0.05, 'aéré')
  assert.deepEqual(c.r, m.r); assert.deepEqual(a.r, m.r); assert.equal(c.rCtl, a.rCtl)
  assert.deepEqual(DENSITIES, { compact: 16, comfortable: 24, airy: 32 })
  assert.throws(() => chain({ base: 12 }), /décision 4/)
})
test('décision 4 — ce que la page a rendu : à racine 24 en compact, la coque garde 24 de marge (16 < 24) ; à racine 16, elle descend à 16', () => {
  near(chain({ base: 16, root: 24 }).pad[0], 24)
  near(chain({ base: 16, root: 16 }).pad[0], 16)
})

/* ── Décision 5 : le corps borné à 16, six crans × 1,25 ── */
test('décision 5 — à 320 : 12,8 · 16 · 20 · 25 · 31,3 · 39,1 ; à 1440 : 13,7 · 17,1 · 21,4 · 26,8 · 33,4 · 41,8', () => {
  const j = tokens(chain())
  const names = ['small', 'body', 'h3', 'h2', 'h1', 'display']
  list(names.map((n) => j[`font-size-${n}`].bottom), [12.8, 16, 20, 25, 31.3, 39.1], 0.051, 'à 320')
  list(names.map((n) => j[`font-size-${n}`].top), [13.7, 17.1, 21.4, 26.8, 33.4, 41.8], 0.051, 'à 1440')
  /* le plancher : sous 700 px environ, le corps reste à 16 — jamais 15,4 */
  near(aWidth(16, 'type', 320, 16), 16); near(aWidth(16, 'type', 600, 16), 16)
  assert.ok(aWidth(16, 'type', 1000, 16) > 16)
  /* un seul corps : plus de --font-size-base */
  assert.ok(!('font-size-base' in j))
  /* T10, faute détectable : aucun token de corps dont la borne basse passe sous 1rem */
  assert.ok(j['font-size-body'].css.startsWith('clamp(1rem,'))
})

/* ── Décision 6 : la cible au doigt en rem × axe control ── */
test('décision 6 — 44 → 46,6 à 100 % ; 66 → 70 à 150 % ; 88 → 93 à 200 % ; plancher 24 px en px', () => {
  const j = tokens(chain())
  near(j['control-height'].bottom, 44); near(j['control-height'].top, 46.6)
  near(j['control-height'].bottom * 1.5, 66); near(j['control-height'].top * 1.5, 70, 0.05)
  near(j['control-height'].bottom * 2, 88); near(j['control-height'].top * 2, 93.3, 0.05)
  assert.ok(j['control-height'].css.startsWith('clamp(2.75rem,'), 'en rem')
  assert.equal(j['target-min'].css, '24px')
})

/* ── Décision 7 : le rythme glisse sans palier, les coins ne glissent pas ── */
test('décision 7 — quatre axes (inline 0,80–1,20 · block 0,90–1,16 · type 0,96–1,07 · control 1,00–1,06), pas d’axe radius', () => {
  assert.deepEqual(AXES, { inline: { min: 0.8, max: 1.2 }, block: { min: 0.9, max: 1.16 }, type: { min: 0.96, max: 1.07 }, control: { min: 1, max: 1.06 } })
  assert.ok(!('radius' in AXES))
  const j = tokens(chain())
  for (const n of ['r-1', 'r-2', 'r-3', 'r-4']) assert.ok(!j[n].css.includes('clamp'), `${n} fixe`)
  /* la courbe adoucie : au gel de 768, l'axe inline vaut 0,941 (pas le milieu 1,00) */
  near(factor('inline', 768), 0.9408, 0.001)
  near(factor('inline', 320), 0.8); near(factor('inline', 1440), 1.2)
  assert.equal(WIDTH_FREEZE, 768)
  assert.equal(OFF_CHAIN.thresholdSetupInPage, 40) /* le seuil des deux régimes, en em */
})

/* ── Décision 8 : un seul registre, site compris ── */
test('décision 8 — la table « après » de la page : pad 24 · 17 · 12, espaces 17 · 12, coins 24 · 12 · 6 · 3 (racine 24), bouton 6, corps 16 → 17,1, h3 20 → 21', () => {
  const s = chain({ root: 24 }), j = tokens(s)
  list(s.pad, [24, 17, 12]); list(s.gap.slice(0, 2), [17, 12]); list(s.r, [24, 12, 6, 3]); assert.equal(s.rCtl, 6)
  near(j['font-size-body'].bottom, 16); near(j['font-size-body'].top, 17.1)
  near(j['font-size-h3'].bottom, 20); near(j['font-size-h3'].top, 21.4)
  near(j['font-size-display'].bottom, 39.1); near(j['font-size-display'].top, 41.8)
})
test('décision 8 — les crans de page sont la chaîne continuée au-dessus de la coque : 34 · 48 (migration du 11 août) · 68 · 96 · 136 · 192', () => {
  list(chain().page, [33.9, 48, 67.9, 96, 135.8, 192], 0.051)
  /* seuls les crans consommés sont émis : 1 (la frontière à trois crans, #139),
     2 (tête, gouttière), 3 (marge), 4 (silence), 6 (rail) */
  const j = tokens(chain())
  assert.deepEqual(Object.keys(j).filter((n) => /^page-.*-block$/.test(n)), ['page-1-block', 'page-2-block', 'page-3-block', 'page-4-block', 'page-6-block'])
})

/* ── Le gabarit documentaire, dérivé (verdict d'Auteur du 25 août sur la planche du gabarit) ── */
test('gabarit — les titres du site glissent comme le gabarit nu (amendement d’Auteur) : bornes dérivées (affiche : section → sept crans ; section : h1 → section), pentes 6 vw et 3,4 vw déclarées', () => {
  const j = tokens(chain())
  near(j['font-size-section'].bottom, 43.7); near(j['font-size-section'].top, 46.7)
  near(j['font-size-cover-max'].bottom, 76.3); near(j['font-size-cover-max'].top, 81.6)
  near(j['font-size-section'].base / j['font-size-display'].base, Math.sqrt(1.25), 0.001)
  assert.equal(REGISTRY.doc['doc-cover'], 'clamp(var(--font-size-section), 6vw, var(--font-size-cover-max))')
  assert.equal(REGISTRY.doc['doc-section'], 'clamp(var(--font-size-h1), 3.4vw, var(--font-size-section))')
  assert.ok(!('font-size-cover' in j) && !('font-size-display-2' in j), 'pas de token sans consommateur')
})
test('gabarit — les huit crans --doc-* sont des alias de la chaîne, plus une valeur à part ; le silence suit la densité (64 · 96 · 128)', () => {
  const css = toCssRhythm()
  const block = css.slice(css.indexOf('/* Le gabarit documentaire'))
  for (const [n, v] of Object.entries(REGISTRY.doc)) assert.ok(block.includes(`--${n}: ${v};`), `${n} → ${v}`)
  /* label : l'étiquette mono, un cran et demi sous le corps (11,5 → 12,3) */
  near(tokens(chain())['font-size-label'].bottom, 11.4); near(tokens(chain())['font-size-label'].top, 12.3)
  assert.ok(block.includes('--doc-silence: var(--page-4-block);'))
  assert.ok(block.includes('--doc-cover: clamp(var(--font-size-section), 6vw, var(--font-size-cover-max));') && block.includes('--doc-section: clamp(var(--font-size-h1), 3.4vw, var(--font-size-section));'))
  /* les colonnes ne suivent pas la densité : leur valeur est celle de la chaîne confortable, écrite */
  const j = tokens(chain())
  assert.ok(block.includes(`--doc-rail: ${j['page-6-inline'].css};`) && block.includes(`--doc-gutter: ${j['page-2-inline'].css};`) && block.includes(`--doc-margin: ${j['edge-inline'].css};`), 'colonnes pincées')
  /* le palier du rail est une somme résolue par le moteur (11 septembre 2026) : marge + rail + gouttière + lecture 34 + marge, au demi-rem au-dessus */
  assert.equal(LAYOUTS.doc.sums.rail, 58, 'le palier du rail : 58 rem, la somme sur la chaîne confortable')
  assert.ok(block.includes(`@media (min-width: ${LAYOUTS.doc.sums.rail}rem)`) && block.includes('--doc-zones: 2;') && block.includes(`--doc-margin: ${j['page-3-inline'].css};`), 'la marge de page suit le régime, et le régime est dit (--doc-zones)')
  assert.ok(!/--doc-(cover|section|silence|tete|scene-[a-z]+): (clamp\([\d.]|\d)/.test(css), 'aucun --doc-* posé en valeur (les bornes de l’affiche sont des tokens ; les colonnes portent la valeur écrite de la chaîne)')
  list([chain({ base: 16 }).page[3], chain().page[3], chain({ base: 32 }).page[3]], [64, 96, 128])
})

/* ── Le moteur d'avant : ce qui ne devait pas bouger n'a pas bougé ── */
test('rythme — les tokens de la coque valent ceux du tokens.css d’avant, au dix-millième (pad-1 = ancien step-i6 / step-b8, control-height)', () => {
  const j = tokens(chain())
  assert.equal(j['pad-1-inline'].css, 'clamp(1.2rem, 1.0286rem + 0.8571vw, 1.8rem)')
  assert.equal(j['pad-1-block'].css, 'clamp(1.35rem, 1.2386rem + 0.5571vw, 1.74rem)')
  assert.equal(j['pad-3-inline'].css, 'clamp(0.6rem, 0.5143rem + 0.4286vw, 0.9rem)')
  assert.equal(j['control-height'].css, 'clamp(2.75rem, 2.7029rem + 0.2357vw, 2.915rem)')
})
test('couleur — la famille dérivée est celle du tokens.css d’avant, au bit près (74 valeurs, deux thèmes), et les paires tiennent', () => {
  const css = fs.readFileSync(path.join(HERE, 'app/tokens.css'), 'utf8')
  const pal = derived(PRIMARY_DEFAULTS)
  /* la couleur est le second bloc à thèmes du fichier — la graisse (8 septembre) a le sien avant ; on lit après son en-tête */
  const since = css.indexOf('GÉNÉRÉ par kit/derivation.mjs depuis primary')
  const block = (marker) => {
    const i = css.indexOf(marker, since); const end = css.indexOf('}', i)
    return Object.fromEntries([...css.slice(i, end).matchAll(/--([a-z-]+): (#[0-9A-F]{6});/g)].map((m) => [m[1], m[2]]))
  }
  const light = block(':root, [data-theme="light"]'), dark = block('[data-theme="dark"]')
  assert.ok(Object.keys(light).length >= 37 && Object.keys(dark).length >= 37)
  for (const [n, v] of Object.entries(light)) if (n !== 'text-tertiary') assert.equal(pal.light[n], v, `light ${n}`)
  for (const [n, v] of Object.entries(dark)) if (n !== 'text-tertiary') assert.equal(pal.dark[n], v, `dark ${n}`)
  /* text-tertiary : calé au seuil du TEXTE depuis le 12 septembre 2026 (`#147`, révise `#124`) — il était
     à 3:1 sous l'exception « objets secondaires », levée parce que 24 de ses 35 emplois sont du texte lu
     et qu'aucun de ses crans (11,4 à 13,7 px) n'atteint les 18,66 px que l'exemption « grand texte » exige */
  for (const t of ['light', 'dark']) { const r = contrast(pal[t]['text-tertiary'], pal[t].surface); assert.ok(r >= 4.5 && r < 4.6, `${t} tertiary au seuil : ${r}`) ; assert.ok(contrast(pal[t]['text-tertiary'], pal[t].bg) >= 4.5) }
  assert.ok(contrast(pal.light['text-tertiary'], pal.light.bg) < contrast(pal.light['text-secondary'], pal.light.bg), 'plus clair que le texte second')
  assert.deepEqual(verify(pal), [])
  assert.ok(toCss(pal).includes('--primary: #4F46E5;'))
})

/* ── Décision du 30 août 2026 (#131) : l'accent est un choix d'auteur, le focus passe à primary ── */
test('couleur — l\'accent d\'auteur est souverain (telle quelle, deux thèmes) ; le focus-ring tient 3:1 partout ; sans choix, le repli calcule l\'écart de charte', () => {
  assert.equal(ACCENT_AUTHOR, '#75E242')
  const pal = derived(PRIMARY_DEFAULTS) /* l'accent d'auteur s'applique par défaut à la charte */
  assert.equal(pal.light.accent, ACCENT_AUTHOR); assert.equal(pal.dark.accent, ACCENT_AUTHOR)
  assert.equal(pal.meta.accentAuthor, true)
  /* souverain : plus aucune paire déclarée ne porte l'accent — et le contraste n'est PAS réécrit */
  assert.ok(!PAIRS_DECLAREDALL.some(([t, f]) => t === 'accent' || f === 'accent'))
  assert.ok(contrast(pal.light.accent, pal.light.bg) < 3, 'la valeur d\'auteur n\'est pas recalée')
  /* le focus-ring, lui, reste sous contrat, pour la charte et pour des marques pâles ou sombres */
  for (const hex of [PRIMARY_DEFAULTS, '#F4A6C1', '#111111', '#FACC15']) {
    const q = derived(hex)
    for (const th of ['light', 'dark']) for (const f of ['bg', 'surface'])
      assert.ok(contrast(q[th]['focus-ring'], q[th][f]) >= 3, `${hex} ${th} focus-ring sur ${f}`)
    assert.deepEqual(verify(q), [], hex)
  }
  /* le repli : une autre primaire sans choix d'auteur retrouve l'écart de charte, calé */
  const q = derived('#1DB954')
  assert.equal(q.meta.accentAuthor, false)
  assert.ok(contrast(q.light.accent, q.light.bg) >= 3 && contrast(q.dark.accent, q.dark.bg) >= 3)
  /* et un choix d'auteur explicite passe tel quel sur n'importe quelle marque */
  assert.equal(derived('#1DB954', '#75E242').light.accent, '#75E242')
})

/* ── Décision du 31 août 2026 (#133) : le halo de focus — trois familles, deux régimes ── */
test('couleur — le trait clavier du halo est le cran le moins soutenu qui tient 3:1 (marque, rouge ; neutre = border-strong) ; le clic ne montre rien (aucun token pâle) ; les paires tiennent pour toute marque', () => {
  for (const hex of [PRIMARY_DEFAULTS, '#F4A6C1', '#111111', '#FACC15', '#1DB954', '#F97316']) {
    const q = derived(hex)
    for (const th of ['light', 'dark']) {
      const p = q[th], backgrounds = [p.bg, p.surface], light = th === 'light'
      for (const t of ['focus-ring', 'focus-ring-danger', 'focus-ring-neutral'])
        for (const f of backgrounds) assert.ok(contrast(p[t], f) >= 3, `${hex} ${th} ${t}`)
      /* le moins soutenu : un cran de clarté plus loin vers le fond, et ça ne tient plus */
      for (const [t, src] of [['focus-ring', 'primary'], ['focus-ring-danger', 'danger']]) {
        const [L, C, H] = hexToLch(p[t])
        const plusFar = lchToHex([light ? L + 0.02 : L - 0.02, C, H])
        assert.ok(backgrounds.some((f) => contrast(plusFar, f) < 3), `${hex} ${th} ${t} est bien au bord du seuil (${src})`)
      }
      assert.equal(p['focus-ring-neutral'], p['border-strong'])
      /* le clic ne montre rien : aucun token de trait pâle ne survit (C4 — un rôle sans consommateur ne reste pas) */
      for (const dead of ['focus-ring-soft', 'focus-ring-danger-soft', 'focus-ring-neutral-soft']) assert.equal(p[dead], undefined, dead)
    }
    assert.deepEqual(verify(q), [], hex)
  }
  /* les trois traits sortent dans le CSS et dans Figma, et aucun token pâle n'y traîne */
  const css = toCss(derived(PRIMARY_DEFAULTS))
  for (const t of ['focus-ring', 'focus-ring-danger', 'focus-ring-neutral']) assert.ok(css.includes(`--${t}: #`), t)
  assert.ok(!css.includes('-soft'))
  assert.ok(toFigma().color.light['focus-ring-danger'].$value.startsWith('#'))
  assert.equal(toFigma().color.light['focus-ring-soft'], undefined)
})

/* ── Décision du 27 août 2026, révisée le 30 août (COLOR-UX 2.8.0) : l'adaptation des états est légère — un quart, plafonné à 12° ── */
test('couleur — les états suivent un quart du déplacement de la marque, plafonné à 12°, du bon côté ; rien ne bouge à la charte ni sous une marque sans teinte ; les paires tiennent', () => {
  assert.equal(PART_STATES, 0.25); assert.equal(CEILING_STATES, 12)
  const PAL = derived(PRIMARY_DEFAULTS)
  /* le fond doux n'est jamais calé : sa teinte dit exactement le déplacement appliqué */
  const turn = (hex, v = 'danger-subtle') => ((hexToLch(derived(hex).light[v])[2] - hexToLch(PAL.light[v])[2] + 540) % 360) - 180
  /* l'orange (#F97316, teinte ≈ 48°) est à +131° par l'arc court : le quart dépasse le plafond → +12, vers l'orange — la faute d'arc d'avant rendait −12 */
  near(turn('#F97316'), 12, 1.2, 'orange : +12°')
  /* le vert Spotify (≈ 149°) est à −128° : → −12 */
  near(turn('#1DB954'), -12, 1.2, 'spotify : −12°')
  /* le rose pastel (≈ 357°) est à +80° : → +12 */
  near(turn('#F4A6C1'), 12, 1.2, 'rose : +12°')
  /* la marine (≈ 266°) est à −11° : le quart, −2,9 */
  near(turn('#1E3A8A'), -2.9, 1.2, 'marine : −2,9°')
  /* à la charte et sous une marque sans teinte : aucun déplacement */
  near(turn(PRIMARY_DEFAULTS), 0, 0.01, 'charter'); near(turn('#111111'), 0, 0.01, 'black')
  /* et toutes les paires tiennent, dans les deux thèmes, pour chacune */
  for (const hex of ['#F97316', '#1DB954', '#F4A6C1', '#1E3A8A', '#111111', '#E50914', '#4A154B']) assert.deepEqual(verify(derived(hex)), [], hex)
})

/* ── C17 : le tertiaire est une intention, jamais un défaut ── */
// Le bloc CSS (entre ses accolades) qui contient une ligne donnée.
const blockOf = (src, line) => { const i = src.indexOf(line); const a = src.lastIndexOf('{', i); const z = src.indexOf('}', i); return src.slice(a, z) }
test('C17 — chaque emploi de text-tertiary dans les feuilles du kit porte « tertiaire : » et ce que c’est, et son cran de graisse (le rôle titre) ; aucun style en ligne ne le pose', () => {
  const faults = []
  for (const [f, src] of readApp()) {
    if (f === 'app/tokens.css') continue
    src.split('\n').forEach((line, i) => {
      if (!line.includes('var(--text-tertiary)')) return
      if (f.endsWith('.css')) {
        if (!/tertiaire\s*:/.test(line)) faults.push(`${f}:${i + 1} — tertiaire sans intention dite`)
        if (!/(font-weight:\s*|font:\s*(normal\s+)?)(var\(--weight-heading\)|700\b)/.test(blockOf(src, line))) faults.push(`${f}:${i + 1} — tertiaire en petit sans son cran de graisse (le rôle titre, ou un 700 déclaré)`)
      }
      else if (/style=\{/.test(line) || /color:\s*["']var\(--text-tertiary\)/.test(line)) faults.push(`${f}:${i + 1} — tertiaire posé en ligne`)
    })
  }
  assert.deepEqual(faults, [])
})

/* ── Les intentions : une seule table, et toutes passent la chaîne ── */
test('intentions — six préréglages, une seule table, tous dans les bornes (Ludique ramenée à 38)', () => {
  assert.equal(INTENTS.length, 6)
  for (const i of INTENTS) { const s = chain(i); assert.ok(s.pad.every((m, k) => m >= s.r[k]), i.name) }
  assert.equal(INTENTS.find((i) => i.name === 'Ludique').root, 38)
})
test('gap-4 et la cible compacte — la chaîne continuée d’un cran vers le bas (6 = base ÷ 4) ; 31 = cible ÷ √2', () => {
  const s = chain(); near(s.gap[3], 6); near(s.controlCompact, 31.1)
  const j = tokens(s); assert.ok(j['gap-4-block'] && j['control-height-compact'])
})

/* ── Les sorties : CSS, Tailwind, Figma — une seule source ── */
test('sorties — tokens.css, Tailwind et Figma portent les mêmes tokens, et pas un nombre hors chaîne sans être déclaré', () => {
  const css = toCssRhythm(), tw = toTailwind(), fg = toFigma()
  const j = tokens(chain())
  for (const n of Object.keys(j)) {
    assert.ok(css.includes(`--${n}:`), `css ${n}`)
    if (/^(pad|gap|edge|page)-/.test(n)) assert.equal(tw.spacing[n], `var(--${n})`)
  }
  /* densités : trois blocs, la chaîne recalculée, jamais un cran décalé */
  assert.ok(css.includes('[data-density="compact"]') && css.includes('[data-density="airy"]'))
  assert.ok(css.includes('--pad-1-inline: clamp(0.8rem,'), 'compact : coque 16 → 12,8 à 320')
  assert.ok(css.includes('--pad-1-inline: clamp(1.6rem,'), 'aéré : coque 32 → 25,6 à 320')
  /* Figma : gelé à 768 (décision 7), bornes en description */
  near(parseFloat(fg.spacing['pad-1-inline'].$value), aWidth(24, 'inline', WIDTH_FREEZE), 0.01)
  assert.match(fg.spacing['pad-1-inline'].$description, /19\.2 à 28\.8 px/)
  assert.equal(fg.radius['r-1'].$value, '16px')
  assert.equal(fg.color.light.primary.$value, '#4F46E5')
  /* les anciens noms sont morts, partout : plus de pont */
  for (const dead of ['--radius:', '--radius-card', '--radius-shell', '--font-size-base', '--step-', '--space-inline', '--space-block']) assert.ok(!css.includes(dead), `${dead} est mort`)
})

/* ── Le site : un seul registre (décision 8) — aucun ancien nom, aucun token orphelin, aucun --doc-* posé ── */
const readApp = () => {
  const read = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((f) => (f.isDirectory() ? read(path.join(d, f.name)) : /\.(tsx|css)$/.test(f.name) ? [path.join(d, f.name)] : []))
  return read(path.join(HERE, 'app')).map((f) => [path.relative(HERE, f), fs.readFileSync(f, 'utf8')])
}
test('site — plus aucun ancien nom (--space-*, --radius*, --step-*, --font-size-base) dans app/', () => {
  const faults = []
  /* « --radius » cité à propos de shadcn (le nom que shadcn lit) n'est pas un token du kit */
  for (const [f, src] of readApp()) if (f !== 'app/tokens.css') for (const m of src.matchAll(/--(space-[a-z0-9-]+|radius(?:-card|-shell)?|step-[a-z0-9]+|font-size-base)\b/g)) {
    const line = src.slice(src.lastIndexOf('\n', m.index) + 1, src.indexOf('\n', m.index))
    if (m[1] === 'radius' && /shadcn/i.test(line)) continue
    faults.push(`${f} → --${m[1]}`)
  }
  assert.deepEqual([...new Set(faults)], [])
})
test('site — chaque var(--…) consommée est définie : par la chaîne, le registre, ou la page elle-même', () => {
  const css = toCssRhythm()
  const defined = new Set([...css.matchAll(/--([a-z0-9-]+):/g)].map((m) => m[1]))
  const color = new Set(Object.keys(derived(PRIMARY_DEFAULTS).light))
  const sources = readApp()
  const locaux = new Set(sources.flatMap(([, src]) => [...src.matchAll(/["']?--([a-z0-9-]+)["']?(?:\s+as\s+string\])?\s*:/g)].map((m) => m[1])))
  const orphans = new Set()
  for (const [f, src] of sources) for (const m of src.matchAll(/var\(--([a-z0-9-]+)[,)]/g)) if (!defined.has(m[1]) && !color.has(m[1]) && !locaux.has(m[1])) orphans.add(`${f} → --${m[1]}`)
  assert.deepEqual([...orphans], [], 'tokens consommés sans définition')
})
test('site — « pas de nombre » : dans les feuilles du kit, un espace, une taille ou un rayon est un token, ou une valeur déclarée hors chaîne / casse (les blocs de dette exceptés)', () => {
  const faults = []
  for (const [f, src] of readApp().filter(([f]) => f.endsWith('.css') && f !== 'app/tokens.css' && f !== 'app/fonts.css')) {
    let debt = false
    src.split('\n').forEach((line, i) => {
      if (/HORS CHAÎNE — dette déclarée/.test(line)) debt = true
      if (/FIN DE LA DETTE/.test(line)) debt = false /* une dette est bornée : elle n'exempte que son bloc (7 septembre 2026) */
      if (debt) return
      if (/hors chaîne|casse/.test(line)) return
      for (const m of line.matchAll(/(?:^|[\s;{])(font-size|border-radius|padding(?:-[a-z]+)?|gap|row-gap|column-gap|margin(?:-[a-z]+)?)\s*:\s*([^;}]+)/g)) {
        const v = m[2].trim()
        if (/^(0|1px|2px|auto|100%|50%|inherit|initial|unset|none)(\s+(0|1px|2px|auto|100%|50%))*$/.test(v)) continue
        /* les proportions typographiques en em (un point sous un titre, l'air d'une ligature) ne sont pas des espaces de la chaîne ; −1px est un trait */
        if (/\d(px|rem|ch)\b/.test(v) && !/\dem\b/.test(v) && !/^-1px$/.test(v) && !/^calc\(-?1 \* var/.test(v)) faults.push(`${f}:${i + 1} ${m[1]}: ${v}`)
      }
    })
  }
  assert.deepEqual(faults.slice(0, 40), [], `${faults.length} valeur(s) posée(s)`)
})
test('site — « pas de nombre » dans les vues : un style inline pose un token, ou déclare sa valeur (« hors chaîne », « casse », ou l\'élément dit data-intent="statement") — décision d\'Auteur du 9 septembre 2026', () => {
  const faults = []
  const PROPS = /\b(fontSize|borderRadius|padding(?:Top|Right|Bottom|Left|Inline|Block)?|gap|rowGap|columnGap|margin(?:Top|Right|Bottom|Left|Inline|Block)?)\s*:\s*(["'`])([^"'`]*)\2/g
  for (const [f, src] of readApp().filter(([f]) => f.endsWith('.tsx'))) {
    let debt = false
    const lines = src.split('\n')
    lines.forEach((line, i) => {
      if (/HORS CHAÎNE — dette déclarée/.test(line)) debt = true
      if (/FIN DE LA DETTE/.test(line)) debt = false
      if (debt) return
      if (/hors chaîne|casse/.test(line) || (i > 0 && /hors chaîne|casse/.test(lines[i - 1]))) return /* en JSX, le commentaire vit sur la ligne du dessus */
      /* l'élément ouvert sur cette ligne (ou les lignes juste au-dessus, jusqu'à son « < ») porte-t-il l'intention ? */
      const head = lines.slice(Math.max(0, i - 6), i + 1).join('\n')
      const tag = head.slice(head.lastIndexOf('<'))
      if (/data-intent=/.test(tag)) return
      for (const m of line.matchAll(PROPS)) {
        const v = m[3].trim()
        if (/^(0|1px|2px|auto|100%|50%|inherit|initial|unset|none)(\s+(0|1px|2px|auto|100%|50%))*$/.test(v)) continue
        if (/\d(px|rem|ch)\b/.test(v) && !/\dem\b/.test(v) && !/^-1px$/.test(v)) faults.push(`${f}:${i + 1} ${m[1]}: ${v}`)
      }
    })
  }
  assert.deepEqual(faults.slice(0, 40), [], `${faults.length} valeur(s) posée(s) dans les vues`)
})


/* ── Le mouvement (décisions d'Auteur du 3 septembre 2026) : quatre durées avec leur emploi, une courbe,
   et plus une seule durée écrite à la main dans les pages ── */
test('mouvement — quatre durées (100 · 200 · 300 · 700), chacune avec son emploi, et la courbe du kit ; les trois sorties les portent', () => {
  assert.deepEqual(Object.values(MOTION.durations).map((d) => d.ms), [100, 200, 300, 700])
  for (const [n, d] of Object.entries(MOTION.durations)) assert.ok(d.use.length > 3, `${n} : une durée sans emploi écrit est une valeur libre`)
  assert.notEqual(MOTION.curve, 'cubic-bezier(0, 0, 0.2, 1)', 'la courbe de Material n’est pas une décision')
  const css = toCssRhythm(), tw = toTailwind(), fg = toFigma()
  for (const [n, d] of Object.entries(MOTION.durations)) {
    assert.ok(css.includes(`--m-${n}: ${d.ms}ms; /* ${d.use} */`), `css ${n} avec son emploi sur la ligne`)
    assert.equal(tw.transitionDuration[n], `var(--m-${n})`)
    assert.equal(fg.motion[n].$value, `${d.ms}ms`)
  }
  assert.ok(css.includes(`--e-out: ${MOTION.curve};`))
  assert.equal(tw.transitionTimingFunction.out, 'var(--e-out)')
  assert.deepEqual(fg.motion['ease-out'].$value, [0.23, 1, 0.32, 1])
})
test('graisse — trois rôles (400 · 500 · 600) ; en sombre chaque rôle s’allège du même écart, jamais plus lourd ; les trois sorties portent les deux valeurs', () => {
  assert.deepEqual(WEIGHT.roles, { body: 400, label: 500, heading: 600 })
  assert.ok(WEIGHT.gapDark >= 0, 'la sombre n’est jamais plus lourde que la claire (T14)')
  for (const n of Object.keys(WEIGHT.roles)) assert.equal(WEIGHT.roles[n] - WEIGHT.dark(n), WEIGHT.gapDark, `${n} : le même écart pour chaque rôle`)
  const css = toCssRhythm(), tw = toTailwind(), fg = toFigma()
  const light = css.slice(css.indexOf('--weight-body'), css.indexOf('[data-theme="dark"]', css.indexOf('--weight-body')))
  const dark = css.slice(css.indexOf('[data-theme="dark"]', css.indexOf('--weight-body')))
  for (const [n, v] of Object.entries(WEIGHT.roles)) {
    assert.ok(light.includes(`--weight-${n}: ${v};`), `css clair ${n}`)
    assert.ok(dark.includes(`--weight-${n}: ${WEIGHT.dark(n)};`), `css sombre ${n}`)
    assert.equal(tw.fontWeight[n], `var(--weight-${n})`)
    assert.equal(fg.fontWeight[n].$value, v)
  }
  /* la préférence système du sombre est servie comme le thème déclaré */
  assert.ok(/prefers-color-scheme: dark\) \{\s*:root:not\(\[data-theme="light"\]\) \{[^}]*--weight-body/.test(dark), 'le sombre par préférence système porte aussi la graisse')
})
/* ── T13 / T14 : une graisse est un rôle, jamais un nombre (9 septembre 2026) ── */
test('site — « pas de graisse à la main » : dans les feuilles et les vues du kit, une graisse est un token (--weight-body / -label / -heading), ou un nombre déclaré hors chaîne / casse sur sa ligne', () => {
  const faults = []
  for (const [f, src] of readApp().filter(([f]) => f !== 'app/tokens.css' && f !== 'app/fonts.css')) {
    src.split('\n').forEach((line, i) => {
      if (/hors chaîne|casse/.test(line)) return
      for (const m of line.matchAll(/(?:font-weight\s*:\s*|(?<![-\w])font\s*:\s*(?:normal\s+)?|fontWeight\s*[:=]\s*["']?)(\d{3})\b/g)) faults.push(`${f}:${i + 1} — ${m[1]}`)
    })
  }
  assert.deepEqual(faults, [], `${faults.length} graisse(s) à la main`)
})
test('site — aucune durée ni courbe écrite à la main dans les feuilles : une transition ou une animation prend un token de mouvement, ou dit « chorégraphie » sur sa ligne', () => {
  const faults = []
  for (const [f, src] of readApp().filter(([f]) => f.endsWith('.css') && f !== 'app/tokens.css')) {
    src.split('\n').forEach((line, i) => {
      if (/chorégraphie|hors chaîne/.test(line)) return
      const withoutComment = line.replace(/\/\*.*?\*\//g, '')
      if (!/transition|animation/.test(withoutComment)) return
      for (const m of withoutComment.matchAll(/(?<![\w-])(\d*\.?\d+)(ms|s)(?![\w-])/g)) {
        const ms = m[2] === 's' ? parseFloat(m[1]) * 1000 : parseFloat(m[1])
        if (ms === 0) continue /* « 0s » : pas une durée, un ordre */
        faults.push(`${f}:${i + 1} ${m[0]}`)
      }
      if (/cubic-bezier|\bease(-in|-out|-in-out)?\b/.test(withoutComment)) faults.push(`${f}:${i + 1} courbe à la main`)
    })
  }
  assert.deepEqual(faults.slice(0, 60), [], `${faults.length} durée(s) ou courbe(s) posée(s) à la main`)
})
test('site — mouvement réduit (décision 1 du 3 septembre) : un déplacement (transform, translate, scale, rotate, défilement doux) ne s’écrit que sous « no-preference » ; un fondu s’écrit nu — les chorégraphies déclarées sont gardées par leur propre portillon', () => {
  const faults = []
  const MOVED = /\b(transform|translate|scale|rotate|offset-path|offset-distance)\b/
  for (const [f, src] of readApp().filter(([f]) => f.endsWith('.css') && f !== 'app/tokens.css')) {
    const lines = src.split('\n')
    /* les images-clés qui déplacent */
    const moves = new Set()
    for (const m of src.matchAll(/@keyframes\s+([\w-]+)\s*\{([\s\S]*?)\}\s*\}/g)) if (MOVED.test(m[2])) moves.add(m[1])
    for (const m of src.matchAll(/@keyframes\s+([\w-]+)\s*\{([^{}]*\{[^{}]*\}[^{}]*)*\}/g)) if (MOVED.test(m[0])) moves.add(m[1])
    /* où l'on est : dans un bloc no-preference, ou pas — au compte des accolades */
    let depth = 0, gate = -1
    lines.forEach((line, i) => {
      const nc = line.replace(/\/\*.*?\*\//g, '')
      if (/prefers-reduced-motion:\s*no-preference/.test(nc)) gate = depth
      const inside = gate >= 0
      if (!/chorégraphie|hors chaîne/.test(line)) {
        if (/scroll-behavior\s*:\s*smooth/.test(nc) && !inside) faults.push(`${f}:${i + 1} défilement doux hors portillon`)
        const tr = nc.match(/transition(?:-property)?\s*:\s*([^;}]+)/)
        if (tr && MOVED.test(tr[1]) && !inside) faults.push(`${f}:${i + 1} déplacement en transition hors portillon`)
        const an = nc.match(/animation(?:-name)?\s*:\s*([^;}]+)/)
        if (an && !inside && an[1].split(/\s+/).some((word) => moves.has(word))) faults.push(`${f}:${i + 1} déplacement en animation hors portillon`)
      }
      for (const c of nc) { if (c === '{') depth++; else if (c === '}') { depth--; if (gate >= 0 && depth <= gate) gate = -1 } }
    })
  }
  assert.deepEqual(faults, [], `${faults.length} déplacement(s) qui joueraient encore sous mouvement réduit`)
})

/* ── Stratégie postures (11 septembre 2026) : le gabarit déclare ses zones, les seuils sont des sommes, la posture se dérive ── */
test('postures — le gabarit déclare trois zones et son niveau ; le palier du rail est une somme résolue sur la chaîne (58 rem) ; bande, table et liste sont des sommes de colonnes déclarées ; aucune somme n’est un nombre posé', () => {
  const d = LAYOUTS.doc
  assert.equal(d.level, 'N2')
  assert.deepEqual(Object.keys(d.zones), ['reading', 'nav', 'marks'])
  assert.equal(d.zones.reading.rem, 17); assert.equal(d.zones.reading.comfort, 34)
  assert.equal(d.zones.nav.token, 'doc-rail'); assert.equal(d.zones.marks.token, 'doc-rail')
  /* le palier : la plus petite fenêtre où marge + rail + gouttière + lecture 34 + marge tiennent, au demi-rem au-dessus */
  const W = d.sums.rail * 16
  const need = 2 * linear('page-3-inline', W) + linear('page-6-inline', W) + linear('page-2-inline', W) + 34
  assert.ok(d.sums.rail >= need && d.sums.rail - 0.5 < need, `58 rem : la somme y tient (${need.toFixed(2)}) et pas un demi-rem plus bas`)
  assert.equal(d.sums.band, d.columns.say.rem + d.gutter + d.columns.scene.rem)
  assert.equal(d.sums.table, Math.round((d.columns.name.rem + d.columns.says.rem + d.columns.ref.rem + 2 * d.cell) * 10) / 10)
  assert.equal(d.sums.list, Math.round((d.columns.ref.rem + d.cell + d.columns.value.rem) * 10) / 10)
  assert.equal(d.gutter, 3.6, 'la gouttière à sa borne haute : une somme ne glisse pas')
  for (const c of Object.values(d.columns)) assert.ok(c.rem > 0 && c.protects, 'chaque colonne dit ce qu’elle protège')
  assert.ok(!('thresholdRail' in OFF_CHAIN), 'le 69 a quitté la table des valeurs hors chaîne')
})
test('postures — sur le web la posture se dérive : deux segments côte à côte → Livre, l’un sur l’autre → Laptop ; un segment → Mobile sous la somme à deux zones, Tablet dès qu’elle tient', () => {
  const two = LAYOUTS.doc.twoZones
  assert.equal(POSTURE.keyOf(POSTURE.derive({ widthRem: 50, segments: 2, hinge: 'vertical', twoZones: two })), 'book')
  assert.equal(POSTURE.keyOf(POSTURE.derive({ widthRem: 35.7, segments: 2, hinge: 'horizontal', twoZones: two })), 'laptop')
  assert.equal(POSTURE.keyOf(POSTURE.derive({ widthRem: 390 / 16, segments: 1, twoZones: two })), 'mobile')
  assert.equal(POSTURE.keyOf(POSTURE.derive({ widthRem: 25, segments: 1, twoZones: two })), 'mobile', 'le pliable fermé : Mobile')
  assert.equal(POSTURE.keyOf(POSTURE.derive({ widthRem: 50, segments: 1, twoZones: two })), 'mobile', 'à plat sur 800 px, une zone tient : encore Mobile — la surface, pas l’appareil')
  assert.equal(POSTURE.keyOf(POSTURE.derive({ widthRem: 820 / 16, segments: 1, twoZones: two })), 'mobile')
  assert.equal(POSTURE.keyOf(POSTURE.derive({ widthRem: 1180 / 16, segments: 1, twoZones: two })), 'tablet')
  assert.equal(POSTURE.keyOf(POSTURE.derive({ widthRem: 90, segments: 1, twoZones: two })), 'tablet', 'un écran de bureau est une surface plane : Tablet')
  assert.equal(POSTURE.of(125, 'vertical'), POSTURE.postures.book, 'l’angle dit la même chose que les segments')
})

/* ── La greffe (11 septembre 2026) : les deux polices du site sont des décisions d'entrée ── */
test('greffe — sans entrée, la charte : --font-heading vaut la famille du texte ; avec fontText/fontHeading, les deux familles entrent, la mécanique reste au kit', () => {
  const charte = toCssRhythm()
  assert.ok(charte.includes('--font-sans: "Geist"') && charte.includes('--font-heading: var(--font-sans);'), 'au kit, les titres prennent la famille du texte')
  const same = fonts({ fontText: 'Roboto', fontHeading: 'Roboto' })
  assert.equal(same['font-sans'], '"Roboto", ui-sans-serif, system-ui, sans-serif')
  assert.equal(same['font-heading'], 'var(--font-sans)', 'un site à une seule famille n’en reçoit pas deux')
  const two = toCssRhythm({ fontText: 'Inter', fontHeading: 'Fraunces' })
  assert.ok(two.includes('--font-sans: "Inter", ui-sans-serif') && two.includes('--font-heading: "Fraunces", ui-sans-serif'))
  assert.ok(two.includes(REGISTRY.fonts['font-mono']), 'la mécanique ne change pas avec le site')
  const kitCss = fs.readFileSync(path.join(HERE, 'app/kit.css'), 'utf8')
  assert.ok(/h1, h2, h3, h4, h5, h6 \{ font-family: var\(--font-heading\); \}/.test(kitCss), 'le token a un consommateur : les titres')
})
