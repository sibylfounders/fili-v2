/* LE MOTEUR DE LA FAMILLE COULEUR — kit/derivation.mjs
   Une seule décision d'entrée : primary. Tout le reste se calcule.

   Porté du moteur du témoin (temoin/tools/fili/expression/couleur.mjs +
   palette.mjs — déterministe, sans dépendance, OKLCH : le seul espace où
   faire varier la clarté ne fait pas dériver la teinte), et CALIBRÉ SUR LA
   CHARTE DE CONCEPTION FILI (docs/charte/filicharte_6.html) : à la primaire
   de la charte (#4F46E5), la dérivation reproduit ses valeurs.

   Les règles du calcul :
   · NEUTRES — clartés et chromas de la charte, teinte = celle de primary :
     teinter un neutre à luminance quasi constante est gratuit (C15).
   · MARQUE — primary est la décision, et reste ENTIÈRE : l'aplat d'action
     porte la couleur saisie telle quelle, son texte on-primary est CHERCHÉ
     du côté qui tient (noir sur une marque claire, blanc sur une sombre).
     Seul primary-text — le lien, du texte posé sur les fonds — est calé
     AA quand la marque ne tient pas 4,5:1 : on assombrit le lien, jamais
     la marque. hover, subtle et leurs textes sont des ancres de clarté et
     de chroma posées par la charte, à la teinte de primary (C7).
   · ACCENT — l'anneau de focus garde l'écart de teinte que la charte lui
     donne face à primary (−55°) : il tourne avec la marque, sans jamais se
     confondre avec elle.
   · SÉMANTIQUE — chaque état garde sa teinte de charte ; quand primary
     bouge, le déplacement le tire d'un quart, borné à ±12° : un rouge reste
     un rouge — il devient le rouge de cette famille-là (C3 : jamais la
     marque pour un état).
   · CALAGE — toute paire déclarée sous son seuil est recalée par recherche
     de clarté, jamais laissée en dessous (C7, C9) — la règle de la charte
     (« assombries d'un cran ou deux ; aucune n'a changé de famille »),
     mécanisée. La conformité AA n'est pas vérifiée après coup : elle est
     obtenue par construction.

   Régénérer les jetons : node kit/derivation.mjs --css > (bloc tokens.css)
   Vérifier une primaire :  node kit/derivation.mjs "#0E7C5B"            */

const versLineaire = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const versSrgb = (c) => (c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055)

export function hexVersRgb(hex) {
  const n = hex.replace('#', '')
  return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255)
}
export function rgbVersHex([r, g, b]) {
  const q = (v) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, '0')
  return `#${q(r)}${q(g)}${q(b)}`.toUpperCase()
}
export function rgbVersOklab([R, G, B]) {
  const r = versLineaire(R), g = versLineaire(G), b = versLineaire(B)
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  return [
    0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s,
  ]
}
export function oklabVersRgb([L, A, B]) {
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3
  const s = (L - 0.0894841775 * A - 1.2914855480 * B) ** 3
  return [
    versSrgb(+4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    versSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    versSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s),
  ]
}
export const oklabVersLch = ([L, a, b]) => [L, Math.hypot(a, b), ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360]
export const lchVersOklab = ([L, C, H]) => [L, C * Math.cos((H * Math.PI) / 180), C * Math.sin((H * Math.PI) / 180)]
export const hexVersLch = (hex) => oklabVersLch(rgbVersOklab(hexVersRgb(hex)))

/* Hors gamut, on réduit la chroma jusqu'à rentrer : la clarté et la teinte
   sont ce qu'on a décidé, la saturation est ce qu'on peut se permettre. */
export function lchVersHex([L, C, H]) {
  let c = C
  for (let i = 0; i < 64; i++) {
    const rgb = oklabVersRgb(lchVersOklab([L, c, H]))
    if (rgb.every((v) => v >= -0.001 && v <= 1.001)) return rgbVersHex(rgb)
    c *= 0.96
  }
  return rgbVersHex(oklabVersRgb(lchVersOklab([L, 0, H])))
}

const canal = (v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
export function luminance(hex) {
  const [r, g, b] = hexVersRgb(hex).map(canal)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
export function contraste(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}

/* La partenaire : on fait varier la clarté, à teinte et chroma constantes,
   jusqu'au seuil. Une paire n'est pas deux couleurs choisies puis mesurées :
   c'est une couleur choisie et sa partenaire calculée pour elle. */
export function partenaire(fond, [C, H], cible, { versLeBas = true } = {}) {
  let lo = 0, hi = 1, meilleur = versLeBas ? '#000000' : '#FFFFFF'
  for (let i = 0; i < 40; i++) {
    const L = (lo + hi) / 2
    const hex = lchVersHex([L, C, H])
    if (contraste(hex, fond) >= cible) { meilleur = hex; if (versLeBas) lo = L; else hi = L }
    else if (versLeBas) hi = L; else lo = L
  }
  return meilleur
}
/* Le côté le plus lisible : teinté d'abord, pur ensuite, l'autre côté enfin. */
function surCouleur(fond, [C, H], cible, prefere = 'clair') {
  const clairs = [lchVersHex([0.985, Math.min(C, 0.02), H]), '#FFFFFF']
  const sombres = [lchVersHex([0.145, Math.min(C, 0.03), H]), '#000000']
  const ordre = prefere === 'clair' ? [...clairs, ...sombres] : [...sombres, ...clairs]
  for (const hex of ordre) if (contraste(hex, fond) >= cible) return hex
  return ordre.reduce((a, b) => (contraste(a, fond) >= contraste(b, fond) ? a : b))
}
/* Une valeur ancrée, recalée si une de ses paires ne tient pas son seuil —
   contre TOUS ses fonds : la contrainte la plus dure gagne. */
function cale(hex, fonds, cible, [C, H], { versLeBas = true } = {}) {
  let retenu = hex
  for (let passe = 0; passe < 2; passe++)
    for (const f of fonds)
      if (contraste(retenu, f) < cible) retenu = partenaire(f, [C, H], cible, { versLeBas })
  return retenu
}

export const PRIMAIRE_DEFAUT = '#4F46E5'
const H0 = hexVersLch(PRIMAIRE_DEFAUT)[2] /* la teinte de la charte : l'origine du calibrage */
const ecartCourt = (de, vers) => (((vers - de + 180) % 360) - 180)

export function derive(primaire = PRIMAIRE_DEFAUT) {
  const [Lp, Cp, H] = hexVersLch(primaire)
  /* Les états suivent le DÉPLACEMENT de la primaire : un quart, borné ±12°.
     À la primaire de la charte, l'écart est nul — reproduction exacte. */
  const suit = (hCharte) => {
    const tire = Math.max(-12, Math.min(12, ecartCourt(H0, H) * 0.25))
    return (hCharte + tire + 360) % 360
  }

  const light = {}
  const dark = {}

  /* ── Neutres — teintés à la marque, clartés de la charte ── */
  light.bg = '#FFFFFF'
  light.surface = lchVersHex([0.967, 0.003, H])
  light['surface-hover'] = lchVersHex([0.928, 0.006, H])
  light.border = light['surface-hover']
  light['text-primary'] = lchVersHex([0.210, 0.028, H])
  light['text-secondary'] = cale(lchVersHex([0.446, 0.024, H]), [light.bg, light.surface], 4.5, [0.024, H])
  light['border-strong'] = cale(lchVersHex([0.551, 0.022, H]), [light.bg, light.surface], 3, [0.022, H])

  dark.bg = lchVersHex([0.130, 0.025, H])
  dark.surface = lchVersHex([0.210, 0.030, H])
  dark['surface-hover'] = lchVersHex([0.278, 0.028, H])
  dark.border = dark['surface-hover']
  dark['text-primary'] = '#FFFFFF'
  dark['text-secondary'] = cale(lchVersHex([0.714, 0.019, H]), [dark.bg, dark.surface], 4.5, [0.019, H], { versLeBas: false })
  dark['border-strong'] = cale(lchVersHex([0.714, 0.019, H]), [dark.bg, dark.surface], 3, [0.019, H], { versLeBas: false })

  /* ── Marque — la décision reste entière ; seul le lien est calé ── */
  const saisie = rgbVersHex(hexVersRgb(primaire))
  const cote = (hex) => (luminance(hex) > 0.1833 ? 'sombre' : 'clair') /* le côté qui peut tenir 4,5:1 */

  /* Le fond doux reste DOUX face à l'aplat : toujours nettement plus clair
     (à la primaire de la charte, il retombe sur elle) ; et si la marque est
     elle-même pastel, il devient un voile quasi blanc, désaturé — sinon les
     deux se confondent. */
  let Ls = Math.max(0.930, Math.min(0.975, Lp + 0.419))
  let Cs = Math.min(0.033, Cp)
  if (Lp > 0.86) { Ls = 0.978; Cs = Math.min(0.016, Cp * 0.3) }
  light['primary-subtle'] = lchVersHex([Ls, Cs, H])
  light.primary = saisie /* l'aplat de marque : jamais touché */
  light['primary-hover'] = lchVersHex([Lp - 0.054, Cp, H])
  light['on-primary'] = surCouleur(light.primary, [0.02, H], 4.5, cote(light.primary))
  light['primary-text'] = cale(saisie, [light.bg, light.surface, light['primary-subtle']], 4.5, [Cp, H])
  const Lt = hexVersLch(light['primary-text'])[0]
  light['primary-text-hover'] = cale(lchVersHex([Lt - 0.05, Cp, H]), [light.bg, light.surface], 4.5, [Cp, H])
  light['on-primary-subtle'] = cale(lchVersHex([0.398, Math.min(0.177, Cp), H]), [light['primary-subtle']], 4.5, [Math.min(0.177, Cp), H])

  dark['primary-subtle'] = lchVersHex([0.257, Math.min(0.086, Cp), H])
  dark.primary = Lp >= 0.62 ? saisie : lchVersHex([0.680, Cp, H]) /* une marque claire vit telle quelle en sombre */
  const Lb = hexVersLch(dark.primary)[0]
  dark['primary-hover'] = lchVersHex([Math.min(Lb + 0.08, 0.92), Cp * 0.66, H])
  dark['on-primary'] = surCouleur(dark.primary, [0.03, H], 4.5, cote(dark.primary))
  dark['primary-text'] = cale(dark.primary, [dark.bg, dark.surface, dark['primary-subtle']], 4.5, [Cp, H], { versLeBas: false })
  const Ltd = hexVersLch(dark['primary-text'])[0]
  dark['primary-text-hover'] = cale(lchVersHex([Math.min(Ltd + 0.05, 0.95), Cp * 0.66, H]), [dark.bg, dark.surface], 4.5, [Cp * 0.66, H], { versLeBas: false })
  dark['on-primary-subtle'] = cale(lchVersHex([0.870, Math.min(0.062, Cp), H]), [dark['primary-subtle']], 4.5, [Math.min(0.062, Cp), H], { versLeBas: false })

  /* ── Accent — l'anneau de focus : l'écart de la charte, conservé ── */
  const Ha = (H - 55.3 + 360) % 360
  light.accent = cale(lchVersHex([0.609, 0.111, Ha]), [light.bg, light.surface], 3, [0.111, Ha])
  dark.accent = cale(lchVersHex([0.609, 0.111, Ha]), [dark.bg, dark.surface], 3, [0.111, Ha], { versLeBas: false })

  /* ── Sémantique — ancres de la charte, tirées par le déplacement ── */
  /* Chaque facette garde SA teinte de charte (le doux du warning est jaune,
     son ton est brun) — toutes tirées par le même déplacement. */
  const ETATS = {
    danger:  { ton: [0.505, 0.190, 27.5],  doux: [0.936, 0.031, 17.7],  dTon: [0.711, 0.166, 22.2], dDoux: [0.258, 0.089, 26.0] },
    success: { ton: [0.527, 0.137, 150.1], doux: [0.962, 0.043, 156.7], dTon: [0.800, 0.182, 151.7], dDoux: [0.266, 0.063, 152.9] },
    warning: { ton: [0.473, 0.125, 46.2],  doux: [0.962, 0.058, 95.6],  dTon: [0.837, 0.164, 84.4], dDoux: [0.279, 0.074, 45.6] },
    info:    { ton: [0.488, 0.217, 264.4], doux: [0.932, 0.032, 255.6], dTon: [0.714, 0.143, 254.6], dDoux: [0.282, 0.087, 267.9] },
  }
  const pose = ([L, C, Hc]) => [L, C, suit(Hc)]
  for (const [nom, e] of Object.entries(ETATS)) {
    const ton = pose(e.ton), doux = pose(e.doux), dTon = pose(e.dTon), dDoux = pose(e.dDoux)
    light[`${nom}-subtle`] = lchVersHex(doux)
    light[nom] = cale(lchVersHex(ton), [light.bg, light[`${nom}-subtle`]], 4.5, [ton[1], ton[2]])
    light[`on-${nom}`] = surCouleur(light[nom], [0.02, ton[2]], 4.5, 'clair')
    dark[`${nom}-subtle`] = lchVersHex(dDoux)
    dark[nom] = cale(lchVersHex(dTon), [dark.surface, dark[`${nom}-subtle`]], 4.5, [dTon[1], dTon[2]], { versLeBas: false })
    dark[`on-${nom}`] = surCouleur(dark[nom], [0.03, dTon[2]], 4.5, 'sombre')
  }

  /* ── La paire fixe du panneau de code — jamais inversée (C12) ── */
  light['code-bg'] = dark['code-bg'] = '#1C1928'
  light['code-text'] = dark['code-text'] = '#C9C4F8'

  /* La décision d'entrée, et ce que le calage en a fait — dit, jamais tu.
     La marque (l'aplat) n'est jamais touchée ; seul le lien peut l'être. */
  const meta = { saisie, aplat: light.primary, lien: light['primary-text'], lienAjuste: saisie !== light['primary-text'] }
  return { light, dark, meta }
}

/* La gamme primitive 50–950, dérivée de la primaire : les clartés de la
   gamme de référence (l'indigo du registre), le chroma mis à l'échelle de
   la primaire saisie, sa teinte partout. Une gamme d'ILLUSTRATION : les
   rôles ne consomment jamais une primitive — elle montre l'échelle sur
   laquelle les rôles se posent. */
const GAMME_ANCRES = [
  [50, 0.962, 0.018], [100, 0.930, 0.033], [200, 0.870, 0.062],
  [300, 0.785, 0.104], [400, 0.680, 0.158], [500, 0.585, 0.204],
  [600, 0.511, 0.230], [700, 0.457, 0.215], [800, 0.398, 0.177],
  [900, 0.359, 0.135], [950, 0.257, 0.086],
]
export function gamme(primaire = PRIMAIRE_DEFAUT) {
  const [, Cp, H] = hexVersLch(primaire)
  const ratio = Cp / 0.230 /* le chroma de la saisie, rapporté au cran 600 de référence */
  return GAMME_ANCRES.map(([cran, L, C]) => [cran, lchVersHex([L, C * ratio, H])])
}

/* Les paires déclarées (C7) — celles que la page mesure. */
export const PAIRES_DECLAREES = [
  ['text-primary', 'bg', 4.5], ['text-primary', 'surface', 4.5],
  ['text-secondary', 'bg', 4.5], ['text-secondary', 'surface', 4.5],
  ['primary-text', 'bg', 4.5], ['primary-text', 'surface', 4.5], ['primary-text-hover', 'bg', 4.5],
  ['on-primary', 'primary', 4.5],
  ['primary-text', 'primary-subtle', 4.5], ['on-primary-subtle', 'primary-subtle', 4.5],
  ['danger', 'danger-subtle', 4.5], ['on-danger', 'danger', 4.5],
  ['success', 'success-subtle', 4.5], ['on-success', 'success', 4.5],
  ['warning', 'warning-subtle', 4.5], ['on-warning', 'warning', 4.5],
  ['info', 'info-subtle', 4.5], ['on-info', 'info', 4.5],
  ['border-strong', 'bg', 3], ['accent', 'bg', 3], ['accent', 'surface', 3],
]
export function verifier(pal) {
  const fautes = []
  for (const theme of ['light', 'dark']) {
    for (const [t, f, seuil] of PAIRES_DECLAREES) {
      const r = contraste(pal[theme][t], pal[theme][f])
      if (r < seuil) fautes.push({ theme, texte: t, fond: f, seuil, rapport: Number(r.toFixed(2)) })
    }
  }
  return fautes
}

/* Sortie CSS — le bloc de tokens.css, prêt à coller. */
export function versCss(pal, primaire = PRIMAIRE_DEFAUT) {
  const ligne = (o, n) => `  --${n}: ${o[n]};`
  const NOMS = ['bg', 'surface', 'surface-hover', 'text-primary', 'text-secondary', 'border', 'border-strong',
    'primary', 'primary-hover', 'on-primary', 'primary-text', 'primary-text-hover', 'primary-subtle', 'on-primary-subtle', 'accent',
    'danger', 'danger-subtle', 'on-danger', 'success', 'success-subtle', 'on-success',
    'warning', 'warning-subtle', 'on-warning', 'info', 'info-subtle', 'on-info', 'code-bg', 'code-text']
  const bloc = (o) => NOMS.map((n) => ligne(o, n)).join('\n')
  return [
    `/* GÉNÉRÉ par kit/derivation.mjs depuis primary ${primaire} — ne pas éditer`,
    `   à la main : une valeur retouchée serait une valeur sans provenance.`,
    `   Régénérer : node kit/derivation.mjs --css */`,
    `:root, [data-theme="light"] {`, `  color-scheme: light;`, bloc(pal.light), `}`,
    ``, `[data-theme="dark"] {`, `  color-scheme: dark;`, bloc(pal.dark), `}`,
    ``, `@media (prefers-color-scheme: dark) {`, `  :root:not([data-theme="light"]) {`,
    `    color-scheme: dark;`, bloc(pal.dark).replace(/^ {2}/gm, '    '), `  }`, `}`,
  ].join('\n')
}

/* ── Ligne de commande ── */
const estCli = typeof process !== 'undefined' && process.argv?.[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())
if (estCli) {
  const args = process.argv.slice(2)
  const css = args.includes('--css')
  const hex = args.find((a) => a.startsWith('#')) ?? PRIMAIRE_DEFAUT
  const pal = derive(hex)
  if (css) { console.log(versCss(pal, hex)) }
  else {
    console.log(`\nFAMILLE DÉRIVÉE — primary ${hex} (teinte ${hexVersLch(hex)[2].toFixed(1)}°)\n`)
    for (const theme of ['light', 'dark']) {
      console.log(`  ${theme}`)
      for (const [n, v] of Object.entries(pal[theme])) console.log(`    ${n.padEnd(18)} ${v}`)
    }
    const fautes = verifier(pal)
    console.log(fautes.length === 0
      ? `\n  ${PAIRES_DECLAREES.length * 2} paires · 2 thèmes — toutes au seuil ✓\n`
      : `\n  ⚠ ${fautes.length} paire(s) sous le seuil :\n` + fautes.map((f) => `    [${f.theme}] ${f.texte} sur ${f.fond} : ${f.rapport}:1 < ${f.seuil}:1`).join('\n') + '\n')
  }
}
