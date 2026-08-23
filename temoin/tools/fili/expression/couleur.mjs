/* Le moteur de couleur. Déterministe, sans dépendance, 0 % d'IA — comme le
   Gardien. Il travaille en OKLCH parce que c'est le seul espace où faire varier
   la clarté ne fait pas dériver la teinte : sans cela, une échelle de gris
   « tirée d'une primaire » virerait de couleur d'un palier à l'autre, et une
   paire calculée pour tenir son contraste ne le tiendrait qu'à peu près. */

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

/* Hors gamut, on réduit la chroma jusqu'à rentrer : la clarté et la teinte sont
   ce qu'on a décidé, la saturation est ce qu'on peut se permettre. */
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

/* Cherche la clarté qui fait tenir la paire à son seuil, sans toucher ni à la
   teinte ni à la chroma. Une paire n'est pas deux couleurs choisies puis
   mesurées : c'est une couleur choisie et sa partenaire calculée pour elle. */
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

/* Deux façons de poser une partenaire, et elles ne servent pas à la même chose.
   « contrastante » va au bout : l'encre la plus franche que la famille permette,
   et on vérifie qu'elle dépasse le seuil. « laPlusDouce » fait l'inverse : elle
   cherche la valeur la plus légère qui tienne encore — c'est ce qu'on veut d'un
   texte d'accompagnement ou d'un filet, jamais d'un texte qui porte. */
export function contrastante(fond, [C, H], cible, sens = 'sombre') {
  for (const L of sens === 'sombre' ? [0.22, 0.16, 0.1, 0.05] : [0.97, 0.985, 0.995, 1]) {
    const hex = lchVersHex([L, C, H])
    if (contraste(hex, fond) >= cible) return hex
  }
  throw new Error(`aucune partenaire ${sens} n'atteint ${String(cible)}:1 sur ${fond}`)
}
export const laPlusDouce = partenaire
