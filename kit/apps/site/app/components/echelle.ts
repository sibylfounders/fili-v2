/**
 * L'Échelle Semantic Rhythm — dérivation géométrique d'Auteur.
 *
 * Trois décisions entrent : base B, ratio R, rayon racine R0.
 * Tout le reste en descend — personne ne choisit une valeur, on choisit
 * une profondeur. Source : le générateur d'Auteur
 * (semanticrhythmscale_9responsiverhythm.html) et la note de dérivation
 * du dépôt fili-v2 (claude/kit-creation-derivation.md, décision #050).
 *
 * Marges par profondeur : [B·R², B·R, B, B/R, B/R²] (large → détail).
 * L'écart d'une profondeur vaut la moitié de sa marge.
 * Rayons : [R0/2, R0/4, R0/8] — l'octave.
 *
 * Ce que ce module NE touche PAS, et c'est déclaré :
 * --space-section, --space-base, --radius-none/xs/2xl/pill — l'Échelle ne
 * définit que trois rayons et cinq profondeurs ; rien n'est inventé au-delà.
 */

const px = (n: number) => `${Math.round(n * 100) / 100}px`;

/** Correspondance avec les sept crans d'espacement du système :
 *  xs = écart détail · sm = écart carte · md = écart coque ·
 *  lg = marge coque (B) · xl = marge page · 2xl = marge large. */
export function espacesEchelle(B: number, R: number) {
  return {
    xs: px(B / (2 * R * R)),
    sm: px(B / (2 * R)),
    md: px(B / 2),
    lg: px(B),
    xl: px(B * R),
    "2xl": px(B * R * R),
  } as const;
}

/** Les trois rayons de l'octave, posés sur les trois crans thémables. */
export function rayonsEchelle(R0: number) {
  return { sm: px(R0 / 8), md: px(R0 / 4), lg: px(R0 / 2) } as const;
}

/** Plages du générateur d'Auteur — reprises telles quelles. */
export const BASES = [16, 20, 24, 28, 32];
export const RAYONS_RACINE = [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48];
export const RATIOS = [
  { value: "1.25", label: "1,25 · tierce majeure" },
  { value: "1.333", label: "1,333 · quarte juste" },
  { value: "1.414", label: "1,414 · triton (√2)" },
  { value: "1.5", label: "1,5 · quinte juste" },
  { value: "1.618", label: "1,618 · nombre d'or" },
  { value: "2", label: "2 · octave" },
];
