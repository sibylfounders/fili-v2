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
  chaine, jetons, fluide, aLargeur, facteur, AXES, CHARTE, BORNES, DENSITES, HORS_CHAINE,
  versCssRythme, versFigma, versTailwind, REGISTRE, INTENTIONS, derive, versCss, verifier, contraste, hexVersLch, lchVersHex, gamme, gammeFamille, gammeNeutres, PRIMAIRE_DEFAUT, ACCENT_AUTEUR, PAIRES_DECLAREES, LARGEUR_GEL, PART_ETATS, PLAFOND_ETATS,
} from './derivation.mjs'

const ICI = path.dirname(fileURLToPath(import.meta.url))
/* au dixième de pixel, comme les pages l'affichent */
const proche = (a, b, tol = 0.051, msg) => assert.ok(Math.abs(a - b) <= tol, msg ?? `${a} attendu ${b}`)
const liste = (a, b, tol, msg) => a.forEach((v, i) => proche(v, b[i], tol, `${msg ?? ''} [${i}] ${v} attendu ${b[i]}`))

/* ── La charte : ce que la planche a tranché ── */
test('charte — racine 16 (planche du 25 août) : coins 16 · 8 · 4 · 2, bouton 4, marges 24 · 17 · 12, espaces 17 · 12', () => {
  assert.equal(CHARTE.racine, 16)
  const s = chaine()
  liste(s.r, [16, 8, 4, 2])
  assert.equal(s.rCtl, 4)
  liste(s.pad, [24, 17, 12])
  liste(s.gap.slice(0, 2), [17, 12])
  assert.equal(s.edge, 24)
})

/* ── Décision 1 : l'espace entre deux frères vaut leur marge ── */
test('décision 1 — marges 24 · 17 · 12, espaces 17 · 12, bord 24 ; l’espace d’une profondeur = la marge de ses enfants', () => {
  const s = chaine({ racine: 24 })
  liste(s.pad, [24, 17, 12], 0.05, 'marges')
  liste(s.gap.slice(0, 2), [17, 12], 0.05, 'espaces')
  assert.equal(s.gap[0], s.pad[1]); assert.equal(s.gap[1], s.pad[2])
  assert.equal(s.edge, s.pad[0])
  /* B (l'octave) écartée : jamais 24 · 12 · 6 avec √2 */
  assert.notEqual(Math.round(s.pad[1]), 12)
})

/* ── Décision 2 : la coque est le niveau 1 et porte la racine, bornée à 38 ── */
test('décision 2 — racine 24 : 24 · 12 · 6 · 3 ; borne 38 acceptée, 39 et 48 refusées', () => {
  liste(chaine({ racine: 24 }).r, [24, 12, 6, 3])
  liste(chaine({ racine: 38 }).r, [38, 19, 9.5, 4.75])
  assert.throws(() => chaine({ racine: 39 }), /décision 2/)
  assert.throws(() => chaine({ racine: 48 }), /décision 2/)
  assert.deepEqual(BORNES.racine, [0, 38])
})
test('décision 2 — la marge ne descend jamais sous le coin (vu à racine 38 sur la page : la carte relevée à 19)', () => {
  const s = chaine({ racine: 38 })
  assert.ok(s.pad.every((m, i) => m >= s.r[i]))
  proche(s.pad[0], 38); proche(s.pad[1], 19)
  assert.ok(s.garanties.margeAuDessusDuCoin)
  assert.ok(chaine().garanties.margeRelevee.every((x) => x === false), 'à la charte la règle ne joue pas')
})

/* ── Décision 3 : le composant prend le coin de la ligne ── */
test('décision 3 — le bouton = racine ÷ 4 : 0 · 1 · 2 · 6 · 8 · 9,5 pour les racines 0 · 4 · 8 · 24 · 32 · 38', () => {
  const table = [[0, 0], [4, 1], [8, 2], [24, 6], [32, 8], [38, 9.5]]
  for (const [racine, bouton] of table) {
    const s = chaine({ racine })
    proche(s.rCtl, bouton, 0.001, `racine ${racine}`)
    assert.equal(s.rCtl, s.r[2], 'le bouton est le coin de la ligne')
  }
  assert.equal(jetons(chaine())['r-ctl'].css, 'var(--r-3)')
  /* aucun enfant plus rond que son parent, sans clause d'exception */
  for (const racine of [0, 4, 8, 12, 16, 24, 32, 38]) assert.ok(chaine({ racine }).garanties.enfantMoinsRond, `racine ${racine}`)
})

/* ── Décision 4 : la densité change la base, coins fixes ── */
test('décision 4 — compact 16 → 16 · 11,3 · 8 ; aéré 32 → 32 · 22,6 · 16 ; les coins ne bougent pas', () => {
  const c = chaine({ base: 16 }), a = chaine({ base: 32 }), m = chaine({ base: 24 })
  liste(c.pad, [16, 11.3, 8], 0.05, 'compact')
  liste(a.pad, [32, 22.6, 16], 0.05, 'aéré')
  assert.deepEqual(c.r, m.r); assert.deepEqual(a.r, m.r); assert.equal(c.rCtl, a.rCtl)
  assert.deepEqual(DENSITES, { compact: 16, comfortable: 24, airy: 32 })
  assert.throws(() => chaine({ base: 12 }), /décision 4/)
})
test('décision 4 — ce que la page a rendu : à racine 24 en compact, la coque garde 24 de marge (16 < 24) ; à racine 16, elle descend à 16', () => {
  proche(chaine({ base: 16, racine: 24 }).pad[0], 24)
  proche(chaine({ base: 16, racine: 16 }).pad[0], 16)
})

/* ── Décision 5 : le corps borné à 16, six crans × 1,25 ── */
test('décision 5 — à 320 : 12,8 · 16 · 20 · 25 · 31,3 · 39,1 ; à 1440 : 13,7 · 17,1 · 21,4 · 26,8 · 33,4 · 41,8', () => {
  const j = jetons(chaine())
  const noms = ['small', 'body', 'h3', 'h2', 'h1', 'display']
  liste(noms.map((n) => j[`font-size-${n}`].bas), [12.8, 16, 20, 25, 31.3, 39.1], 0.051, 'à 320')
  liste(noms.map((n) => j[`font-size-${n}`].haut), [13.7, 17.1, 21.4, 26.8, 33.4, 41.8], 0.051, 'à 1440')
  /* le plancher : sous 700 px environ, le corps reste à 16 — jamais 15,4 */
  proche(aLargeur(16, 'type', 320, 16), 16); proche(aLargeur(16, 'type', 600, 16), 16)
  assert.ok(aLargeur(16, 'type', 1000, 16) > 16)
  /* un seul corps : plus de --font-size-base */
  assert.ok(!('font-size-base' in j))
  /* T10, faute détectable : aucun jeton de corps dont la borne basse passe sous 1rem */
  assert.ok(j['font-size-body'].css.startsWith('clamp(1rem,'))
})

/* ── Décision 6 : la cible au doigt en rem × axe control ── */
test('décision 6 — 44 → 46,6 à 100 % ; 66 → 70 à 150 % ; 88 → 93 à 200 % ; plancher 24 px en px', () => {
  const j = jetons(chaine())
  proche(j['control-height'].bas, 44); proche(j['control-height'].haut, 46.6)
  proche(j['control-height'].bas * 1.5, 66); proche(j['control-height'].haut * 1.5, 70, 0.05)
  proche(j['control-height'].bas * 2, 88); proche(j['control-height'].haut * 2, 93.3, 0.05)
  assert.ok(j['control-height'].css.startsWith('clamp(2.75rem,'), 'en rem')
  assert.equal(j['target-min'].css, '24px')
})

/* ── Décision 7 : le rythme glisse sans palier, les coins ne glissent pas ── */
test('décision 7 — quatre axes (inline 0,80–1,20 · block 0,90–1,16 · type 0,96–1,07 · control 1,00–1,06), pas d’axe radius', () => {
  assert.deepEqual(AXES, { inline: { min: 0.8, max: 1.2 }, block: { min: 0.9, max: 1.16 }, type: { min: 0.96, max: 1.07 }, control: { min: 1, max: 1.06 } })
  assert.ok(!('radius' in AXES))
  const j = jetons(chaine())
  for (const n of ['r-1', 'r-2', 'r-3', 'r-4']) assert.ok(!j[n].css.includes('clamp'), `${n} fixe`)
  /* la courbe adoucie : au gel de 768, l'axe inline vaut 0,941 (pas le milieu 1,00) */
  proche(facteur('inline', 768), 0.9408, 0.001)
  proche(facteur('inline', 320), 0.8); proche(facteur('inline', 1440), 1.2)
  assert.equal(LARGEUR_GEL, 768)
  assert.equal(HORS_CHAINE.seuilMiseEnPage, 40) /* le seuil des deux régimes, en em */
})

/* ── Décision 8 : un seul registre, site compris ── */
test('décision 8 — la table « après » de la page : pad 24 · 17 · 12, espaces 17 · 12, coins 24 · 12 · 6 · 3 (racine 24), bouton 6, corps 16 → 17,1, h3 20 → 21', () => {
  const s = chaine({ racine: 24 }), j = jetons(s)
  liste(s.pad, [24, 17, 12]); liste(s.gap.slice(0, 2), [17, 12]); liste(s.r, [24, 12, 6, 3]); assert.equal(s.rCtl, 6)
  proche(j['font-size-body'].bas, 16); proche(j['font-size-body'].haut, 17.1)
  proche(j['font-size-h3'].bas, 20); proche(j['font-size-h3'].haut, 21.4)
  proche(j['font-size-display'].bas, 39.1); proche(j['font-size-display'].haut, 41.8)
})
test('décision 8 — les crans de page sont la chaîne continuée au-dessus de la coque : 34 · 48 (migration du 11 août) · 68 · 96 · 136 · 192', () => {
  liste(chaine().page, [33.9, 48, 67.9, 96, 135.8, 192], 0.051)
  /* seuls les crans consommés sont émis : 2 (tête, gouttière), 3 (marge), 4 (silence), 6 (rail) */
  const j = jetons(chaine())
  assert.deepEqual(Object.keys(j).filter((n) => /^page-.*-block$/.test(n)), ['page-2-block', 'page-3-block', 'page-4-block', 'page-6-block'])
})

/* ── Le gabarit documentaire, dérivé (verdict d'Auteur du 25 août sur la planche du gabarit) ── */
test('gabarit — les titres du site glissent comme le gabarit nu (amendement d’Auteur) : bornes dérivées (affiche : section → sept crans ; section : h1 → section), pentes 6 vw et 3,4 vw déclarées', () => {
  const j = jetons(chaine())
  proche(j['font-size-section'].bas, 43.7); proche(j['font-size-section'].haut, 46.7)
  proche(j['font-size-cover-max'].bas, 76.3); proche(j['font-size-cover-max'].haut, 81.6)
  proche(j['font-size-section'].base / j['font-size-display'].base, Math.sqrt(1.25), 0.001)
  assert.equal(REGISTRE.doc['doc-cover'], 'clamp(var(--font-size-section), 6vw, var(--font-size-cover-max))')
  assert.equal(REGISTRE.doc['doc-section'], 'clamp(var(--font-size-h1), 3.4vw, var(--font-size-section))')
  assert.ok(!('font-size-cover' in j) && !('font-size-display-2' in j), 'pas de jeton sans consommateur')
})
test('gabarit — les huit crans --doc-* sont des alias de la chaîne, plus une valeur à part ; le silence suit la densité (64 · 96 · 128)', () => {
  const css = versCssRythme()
  const bloc = css.slice(css.indexOf('/* Le gabarit documentaire'))
  for (const [n, v] of Object.entries(REGISTRE.doc)) assert.ok(bloc.includes(`--${n}: ${v};`), `${n} → ${v}`)
  /* label : l'étiquette mono, un cran et demi sous le corps (11,5 → 12,3) */
  proche(jetons(chaine())['font-size-label'].bas, 11.4); proche(jetons(chaine())['font-size-label'].haut, 12.3)
  assert.ok(bloc.includes('--doc-silence: var(--page-4-block);'))
  assert.ok(bloc.includes('--doc-cover: clamp(var(--font-size-section), 6vw, var(--font-size-cover-max));') && bloc.includes('--doc-section: clamp(var(--font-size-h1), 3.4vw, var(--font-size-section));'))
  /* les colonnes ne suivent pas la densité : leur valeur est celle de la chaîne confortable, écrite */
  const j = jetons(chaine())
  assert.ok(bloc.includes(`--doc-rail: ${j['page-6-inline'].css};`) && bloc.includes(`--doc-gouttiere: ${j['page-2-inline'].css};`) && bloc.includes(`--doc-marge: ${j['edge-inline'].css};`), 'colonnes pincées')
  assert.ok(bloc.includes('@media (min-width: 69rem)') && bloc.includes(`--doc-marge: ${j['page-3-inline'].css};`), 'la marge de page suit le régime')
  assert.ok(!/--doc-(cover|section|silence|tete|scene-[a-z]+): (clamp\([\d.]|\d)/.test(css), 'aucun --doc-* posé en valeur (les bornes de l’affiche sont des jetons ; les colonnes portent la valeur écrite de la chaîne)')
  liste([chaine({ base: 16 }).page[3], chaine().page[3], chaine({ base: 32 }).page[3]], [64, 96, 128])
})

/* ── Le moteur d'avant : ce qui ne devait pas bouger n'a pas bougé ── */
test('rythme — les jetons de la coque valent ceux du tokens.css d’avant, au dix-millième (pad-1 = ancien step-i6 / step-b8, control-height)', () => {
  const j = jetons(chaine())
  assert.equal(j['pad-1-inline'].css, 'clamp(1.2rem, 1.0286rem + 0.8571vw, 1.8rem)')
  assert.equal(j['pad-1-block'].css, 'clamp(1.35rem, 1.2386rem + 0.5571vw, 1.74rem)')
  assert.equal(j['pad-3-inline'].css, 'clamp(0.6rem, 0.5143rem + 0.4286vw, 0.9rem)')
  assert.equal(j['control-height'].css, 'clamp(2.75rem, 2.7029rem + 0.2357vw, 2.915rem)')
})
test('couleur — la famille dérivée est celle du tokens.css d’avant, au bit près (74 valeurs, deux thèmes), et les paires tiennent', () => {
  const css = fs.readFileSync(path.join(ICI, 'app/tokens.css'), 'utf8')
  const pal = derive(PRIMAIRE_DEFAUT)
  const bloc = (marqueur) => {
    const i = css.indexOf(marqueur); const fin = css.indexOf('}', i)
    return Object.fromEntries([...css.slice(i, fin).matchAll(/--([a-z-]+): (#[0-9A-F]{6});/g)].map((m) => [m[1], m[2]]))
  }
  const clair = bloc(':root, [data-theme="light"]'), sombre = bloc('[data-theme="dark"]')
  assert.ok(Object.keys(clair).length >= 37 && Object.keys(sombre).length >= 37)
  for (const [n, v] of Object.entries(clair)) if (n !== 'text-tertiary') assert.equal(pal.light[n], v, `light ${n}`)
  for (const [n, v] of Object.entries(sombre)) if (n !== 'text-tertiary') assert.equal(pal.dark[n], v, `dark ${n}`)
  /* text-tertiary (25 août) : le gris clair des petits textes indicatifs, calé à 3:1 — exception déclarée */
  for (const t of ['light', 'dark']) { const r = contraste(pal[t]['text-tertiary'], pal[t].surface); assert.ok(r >= 3 && r < 3.1, `${t} tertiary au seuil : ${r}`) ; assert.ok(contraste(pal[t]['text-tertiary'], pal[t].bg) >= 3) }
  assert.ok(contraste(pal.light['text-tertiary'], pal.light.bg) < contraste(pal.light['text-secondary'], pal.light.bg), 'plus clair que le texte second')
  assert.deepEqual(verifier(pal), [])
  assert.ok(versCss(pal).includes('--primary: #4F46E5;'))
})

/* ── Décision du 30 août 2026 (#131) : l'accent est un choix d'auteur, le focus passe à primary ── */
test('couleur — l\'accent d\'auteur est souverain (telle quelle, deux thèmes) ; le focus-ring tient 3:1 partout ; sans choix, le repli calcule l\'écart de charte', () => {
  assert.equal(ACCENT_AUTEUR, '#75E242')
  const pal = derive(PRIMAIRE_DEFAUT) /* l'accent d'auteur s'applique par défaut à la charte */
  assert.equal(pal.light.accent, ACCENT_AUTEUR); assert.equal(pal.dark.accent, ACCENT_AUTEUR)
  assert.equal(pal.meta.accentAuteur, true)
  /* souverain : plus aucune paire déclarée ne porte l'accent — et le contraste n'est PAS réécrit */
  assert.ok(!PAIRES_DECLAREES.some(([t, f]) => t === 'accent' || f === 'accent'))
  assert.ok(contraste(pal.light.accent, pal.light.bg) < 3, 'la valeur d\'auteur n\'est pas recalée')
  /* le focus-ring, lui, reste sous contrat, pour la charte et pour des marques pâles ou sombres */
  for (const hex of [PRIMAIRE_DEFAUT, '#F4A6C1', '#111111', '#FACC15']) {
    const q = derive(hex)
    for (const th of ['light', 'dark']) for (const f of ['bg', 'surface'])
      assert.ok(contraste(q[th]['focus-ring'], q[th][f]) >= 3, `${hex} ${th} focus-ring sur ${f}`)
    assert.deepEqual(verifier(q), [], hex)
  }
  /* le repli : une autre primaire sans choix d'auteur retrouve l'écart de charte, calé */
  const q = derive('#1DB954')
  assert.equal(q.meta.accentAuteur, false)
  assert.ok(contraste(q.light.accent, q.light.bg) >= 3 && contraste(q.dark.accent, q.dark.bg) >= 3)
  /* et un choix d'auteur explicite passe tel quel sur n'importe quelle marque */
  assert.equal(derive('#1DB954', '#75E242').light.accent, '#75E242')
})

/* ── Décision du 31 août 2026 (#133) : le halo de focus — trois familles, deux régimes ── */
test('couleur — le trait clavier du halo est le cran le moins soutenu qui tient 3:1 (marque, rouge ; neutre = border-strong) ; le trait clic est le cran 200 / 800, hors contrat ; les paires tiennent pour toute marque', () => {
  for (const hex of [PRIMAIRE_DEFAUT, '#F4A6C1', '#111111', '#FACC15', '#1DB954', '#F97316']) {
    const q = derive(hex)
    for (const th of ['light', 'dark']) {
      const p = q[th], fonds = [p.bg, p.surface], clair = th === 'light'
      for (const t of ['focus-ring', 'focus-ring-danger', 'focus-ring-neutral'])
        for (const f of fonds) assert.ok(contraste(p[t], f) >= 3, `${hex} ${th} ${t}`)
      /* le moins soutenu : un cran de clarté plus loin vers le fond, et ça ne tient plus */
      for (const [t, src] of [['focus-ring', 'primary'], ['focus-ring-danger', 'danger']]) {
        const [L, C, H] = hexVersLch(p[t])
        const plusLoin = lchVersHex([clair ? L + 0.02 : L - 0.02, C, H])
        assert.ok(fonds.some((f) => contraste(plusLoin, f) < 3), `${hex} ${th} ${t} est bien au bord du seuil (${src})`)
      }
      assert.equal(p['focus-ring-neutral'], p['border-strong'])
      /* le trait pâle : cran 200 en clair, 800 en sombre — sur la gamme de sa famille */
      const cran = (g, n) => Object.fromEntries(g)[n]
      assert.equal(p['focus-ring-soft'], cran(gamme(p.primary), clair ? 200 : 800))
      assert.equal(p['focus-ring-danger-soft'], cran(gammeFamille(p.danger, p['danger-subtle']), clair ? 200 : 800))
      assert.equal(p['focus-ring-neutral-soft'], cran(gammeNeutres(p.primary), clair ? 200 : 800))
    }
    assert.deepEqual(verifier(q), [], hex)
  }
  /* hors contrat, et dit : aucune paire déclarée ne porte un trait pâle */
  assert.ok(!PAIRES_DECLAREES.some(([t, f]) => t.endsWith('-soft') || f.endsWith('-soft')))
  /* à la charte, en clair, le trait pâle est SOUS 3:1 — c'est le choix d'Auteur, pas une faute silencieuse */
  const c = derive(PRIMAIRE_DEFAUT).light
  assert.ok(contraste(c['focus-ring-soft'], c.bg) < 3)
  /* les six jetons sortent dans le CSS et dans Figma */
  const css = versCss(derive(PRIMAIRE_DEFAUT))
  for (const t of ['focus-ring', 'focus-ring-danger', 'focus-ring-neutral', 'focus-ring-soft', 'focus-ring-danger-soft', 'focus-ring-neutral-soft']) assert.ok(css.includes(`--${t}: #`), t)
  assert.ok(versFigma().color.light['focus-ring-danger-soft'].$value.startsWith('#'))
})

/* ── Décision du 27 août 2026, révisée le 30 août (COLOR-UX 2.8.0) : l'adaptation des états est légère — un quart, plafonné à 12° ── */
test('couleur — les états suivent un quart du déplacement de la marque, plafonné à 12°, du bon côté ; rien ne bouge à la charte ni sous une marque sans teinte ; les paires tiennent', () => {
  assert.equal(PART_ETATS, 0.25); assert.equal(PLAFOND_ETATS, 12)
  const PAL = derive(PRIMAIRE_DEFAUT)
  /* le fond doux n'est jamais calé : sa teinte dit exactement le déplacement appliqué */
  const tour = (hex, v = 'danger-subtle') => ((hexVersLch(derive(hex).light[v])[2] - hexVersLch(PAL.light[v])[2] + 540) % 360) - 180
  /* l'orange (#F97316, teinte ≈ 48°) est à +131° par l'arc court : le quart dépasse le plafond → +12, vers l'orange — la faute d'arc d'avant rendait −12 */
  proche(tour('#F97316'), 12, 1.2, 'orange : +12°')
  /* le vert Spotify (≈ 149°) est à −128° : → −12 */
  proche(tour('#1DB954'), -12, 1.2, 'spotify : −12°')
  /* le rose pastel (≈ 357°) est à +80° : → +12 */
  proche(tour('#F4A6C1'), 12, 1.2, 'rose : +12°')
  /* la marine (≈ 266°) est à −11° : le quart, −2,9 */
  proche(tour('#1E3A8A'), -2.9, 1.2, 'marine : −2,9°')
  /* à la charte et sous une marque sans teinte : aucun déplacement */
  proche(tour(PRIMAIRE_DEFAUT), 0, 0.01, 'charte'); proche(tour('#111111'), 0, 0.01, 'noir')
  /* et toutes les paires tiennent, dans les deux thèmes, pour chacune */
  for (const hex of ['#F97316', '#1DB954', '#F4A6C1', '#1E3A8A', '#111111', '#E50914', '#4A154B']) assert.deepEqual(verifier(derive(hex)), [], hex)
})

/* ── C17 : le tertiaire est une intention, jamais un défaut ── */
// Le bloc CSS (entre ses accolades) qui contient une ligne donnée.
const blocDe = (src, ligne) => { const i = src.indexOf(ligne); const a = src.lastIndexOf('{', i); const z = src.indexOf('}', i); return src.slice(a, z) }
test('C17 — chaque emploi de text-tertiary dans les feuilles du kit porte « tertiaire : » et ce que c’est, et son cran de graisse (600 au moins) ; aucun style en ligne ne le pose', () => {
  const fautes = []
  for (const [f, src] of lireApp()) {
    if (f === 'app/tokens.css') continue
    src.split('\n').forEach((ligne, i) => {
      if (!ligne.includes('var(--text-tertiary)')) return
      if (f.endsWith('.css')) {
        if (!/tertiaire\s*:/.test(ligne)) fautes.push(`${f}:${i + 1} — tertiaire sans intention dite`)
        if (!/(font-weight:\s*|font:\s*)(6|7)00\b/.test(blocDe(src, ligne))) fautes.push(`${f}:${i + 1} — tertiaire en petit sans son cran de graisse (600 au moins)`)
      }
      else if (/style=\{/.test(ligne) || /color:\s*["']var\(--text-tertiary\)/.test(ligne)) fautes.push(`${f}:${i + 1} — tertiaire posé en ligne`)
    })
  }
  assert.deepEqual(fautes, [])
})

/* ── Les intentions : une seule table, et toutes passent la chaîne ── */
test('intentions — six préréglages, une seule table, tous dans les bornes (Ludique ramenée à 38)', () => {
  assert.equal(INTENTIONS.length, 6)
  for (const i of INTENTIONS) { const s = chaine(i); assert.ok(s.pad.every((m, k) => m >= s.r[k]), i.nom) }
  assert.equal(INTENTIONS.find((i) => i.nom === 'Ludique').racine, 38)
})
test('gap-4 et la cible compacte — la chaîne continuée d’un cran vers le bas (6 = base ÷ 4) ; 31 = cible ÷ √2', () => {
  const s = chaine(); proche(s.gap[3], 6); proche(s.controlCompact, 31.1)
  const j = jetons(s); assert.ok(j['gap-4-block'] && j['control-height-compact'])
})

/* ── Les sorties : CSS, Tailwind, Figma — une seule source ── */
test('sorties — tokens.css, Tailwind et Figma portent les mêmes jetons, et pas un nombre hors chaîne sans être déclaré', () => {
  const css = versCssRythme(), tw = versTailwind(), fg = versFigma()
  const j = jetons(chaine())
  for (const n of Object.keys(j)) {
    assert.ok(css.includes(`--${n}:`), `css ${n}`)
    if (/^(pad|gap|edge|page)-/.test(n)) assert.equal(tw.spacing[n], `var(--${n})`)
  }
  /* densités : trois blocs, la chaîne recalculée, jamais un cran décalé */
  assert.ok(css.includes('[data-density="compact"]') && css.includes('[data-density="airy"]'))
  assert.ok(css.includes('--pad-1-inline: clamp(0.8rem,'), 'compact : coque 16 → 12,8 à 320')
  assert.ok(css.includes('--pad-1-inline: clamp(1.6rem,'), 'aéré : coque 32 → 25,6 à 320')
  /* Figma : gelé à 768 (décision 7), bornes en description */
  proche(parseFloat(fg.spacing['pad-1-inline'].$value), aLargeur(24, 'inline', LARGEUR_GEL), 0.01)
  assert.match(fg.spacing['pad-1-inline'].$description, /19\.2 à 28\.8 px/)
  assert.equal(fg.radius['r-1'].$value, '16px')
  assert.equal(fg.color.light.primary.$value, '#4F46E5')
  /* les anciens noms sont morts, partout : plus de pont */
  for (const mort of ['--radius:', '--radius-card', '--radius-shell', '--font-size-base', '--step-', '--space-inline', '--space-block']) assert.ok(!css.includes(mort), `${mort} est mort`)
})

/* ── Le site : un seul registre (décision 8) — aucun ancien nom, aucun jeton orphelin, aucun --doc-* posé ── */
const lireApp = () => {
  const lire = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((f) => (f.isDirectory() ? lire(path.join(d, f.name)) : /\.(tsx|css)$/.test(f.name) ? [path.join(d, f.name)] : []))
  return lire(path.join(ICI, 'app')).map((f) => [path.relative(ICI, f), fs.readFileSync(f, 'utf8')])
}
test('site — plus aucun ancien nom (--space-*, --radius*, --step-*, --font-size-base) dans app/', () => {
  const fautes = []
  /* « --radius » cité à propos de shadcn (le nom que shadcn lit) n'est pas un jeton du kit */
  for (const [f, src] of lireApp()) if (f !== 'app/tokens.css') for (const m of src.matchAll(/--(space-[a-z0-9-]+|radius(?:-card|-shell)?|step-[a-z0-9]+|font-size-base)\b/g)) {
    const ligne = src.slice(src.lastIndexOf('\n', m.index) + 1, src.indexOf('\n', m.index))
    if (m[1] === 'radius' && /shadcn/i.test(ligne)) continue
    fautes.push(`${f} → --${m[1]}`)
  }
  assert.deepEqual([...new Set(fautes)], [])
})
test('site — chaque var(--…) consommée est définie : par la chaîne, le registre, ou la page elle-même', () => {
  const css = versCssRythme()
  const definis = new Set([...css.matchAll(/--([a-z0-9-]+):/g)].map((m) => m[1]))
  const couleur = new Set(Object.keys(derive(PRIMAIRE_DEFAUT).light))
  const sources = lireApp()
  const locaux = new Set(sources.flatMap(([, src]) => [...src.matchAll(/["']?--([a-z0-9-]+)["']?(?:\s+as\s+string\])?\s*:/g)].map((m) => m[1])))
  const orphelins = new Set()
  for (const [f, src] of sources) for (const m of src.matchAll(/var\(--([a-z0-9-]+)[,)]/g)) if (!definis.has(m[1]) && !couleur.has(m[1]) && !locaux.has(m[1])) orphelins.add(`${f} → --${m[1]}`)
  assert.deepEqual([...orphelins], [], 'jetons consommés sans définition')
})
test('site — « pas de nombre » : dans les feuilles du kit, un espace, une taille ou un rayon est un jeton, ou une valeur déclarée hors chaîne / casse (les blocs de dette exceptés)', () => {
  const fautes = []
  for (const [f, src] of lireApp().filter(([f]) => f.endsWith('.css') && f !== 'app/tokens.css' && f !== 'app/fontes.css')) {
    let dette = false
    src.split('\n').forEach((ligne, i) => {
      if (/HORS CHAÎNE — dette déclarée/.test(ligne)) dette = true
      if (dette) return
      if (/hors chaîne|casse/.test(ligne)) return
      for (const m of ligne.matchAll(/(?:^|[\s;{])(font-size|border-radius|padding(?:-[a-z]+)?|gap|row-gap|column-gap|margin(?:-[a-z]+)?)\s*:\s*([^;}]+)/g)) {
        const v = m[2].trim()
        if (/^(0|1px|2px|auto|100%|50%|inherit|initial|unset|none)(\s+(0|1px|2px|auto|100%|50%))*$/.test(v)) continue
        /* les proportions typographiques en em (un point sous un titre, l'air d'une ligature) ne sont pas des espaces de la chaîne ; −1px est un trait */
        if (/\d(px|rem|ch)\b/.test(v) && !/\dem\b/.test(v) && !/^-1px$/.test(v) && !/^calc\(-?1 \* var/.test(v)) fautes.push(`${f}:${i + 1} ${m[1]}: ${v}`)
      }
    })
  }
  assert.deepEqual(fautes.slice(0, 40), [], `${fautes.length} valeur(s) posée(s)`)
})

