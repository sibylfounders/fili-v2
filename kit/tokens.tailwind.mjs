/**
 * SORTIE JUMELLE TAILWIND — même source que app/tokens.css, autre cible.
 * Le marché demande l'adaptation : CSS natif ET Tailwind. Les utilitaires
 * pointent sur les variables, jamais sur des valeurs — le rythme continue
 * de vivre après compilation (doctrine du kit géométrie, conservée).
 *
 * Usage : import { rythme } from './tokens.tailwind.mjs'
 * puis dans tailwind.config : theme.extend.spacing = rythme.spacing, etc.
 *
 * NOTE D'AUTEUR (23 août 2026) : si un consommateur Tailwind exige un thème
 * à valeurs littérales (sans variables), les valeurs sortiront ARRONDIES —
 * jamais de décimales à quatre chiffres dans un thème Tailwind. Tant que les
 * utilitaires pointent sur les variables (le cas ici), la question ne se
 * pose pas : la variable se résout au rendu.
 */
export const rythme = {
  spacing: {
    'inline-xs': 'var(--rr-inline-xs)',
    'inline-sm': 'var(--rr-inline-sm)',
    'inline-unit': 'var(--rr-inline-unit)',
    'inline-lg': 'var(--rr-inline-lg)',
    'inline-xl': 'var(--rr-inline-xl)',
    'inline-2xl': 'var(--rr-inline-2xl)',
    'block-xs': 'var(--rr-block-xs)',
    'block-sm': 'var(--rr-block-sm)',
    'block-md': 'var(--rr-block-md)',
    'block-control': 'var(--rr-block-control)',
    'block-card': 'var(--rr-block-card)',
    'block-unit': 'var(--rr-block-unit)',
    'block-lg': 'var(--rr-block-lg)',
    'block-xl': 'var(--rr-block-xl)',
    'block-page': 'var(--rr-block-page)',
  },
  borderRadius: {
    rr: 'var(--rr-radius)',
    'rr-card': 'var(--rr-radius-card)',
    'rr-shell': 'var(--rr-radius-shell)',
  },
  height: { 'rr-control': 'var(--rr-control)' },
  fontSize: { 'rr-type': 'var(--rr-type)' },
};

/* Sortie jumelle — typographie (même origine que tokens.css ; les valeurs
   littérales d'un thème Tailwind sortiraient ARRONDIES, note d'Auteur). */
export const typo = {
  fontFamily: {
    interface: "var(--t-interface)",
    code: "var(--t-code)",
  },
  fontSize: {
    corps: "var(--t-corps)",
    "titre-3": "var(--t-titre-3)",
    "titre-2": "var(--t-titre-2)",
    "titre-1": "var(--t-titre-1)",
    affiche: "var(--t-affiche)",
  },
  lineHeight: {
    courant: "var(--t-interligne-courant)",
    titre: "var(--t-interligne-titre)",
  },
  maxWidth: { mesure: "var(--t-mesure)" },
  letterSpacing: { etiquette: "var(--t-interlettrage-etiquette)" },
};


/* ── Le thème Tailwind LITTÉRAL — deux échelles assumées (décision d'Auteur,
   23 août) : Tailwind garde sa grille 4-16, valeurs ARRONDIES au cran le plus
   proche, jamais de décimales ; le CSS natif garde les décimales calculées
   via les variables (rythme.spacing ci-dessus). On ne mélange jamais les
   deux : un projet choisit son échelle et s'y tient. min = borne 320 px,
   max = borne 1440 px (thème par régime, la fluidité reste aux variables). */
export const rythmeLitteral = {
  spacing: {
    "inline-xs": { min: "4px", max: "8px" }, /* calculé : 4.8 → 7.2 px */
    "inline-sm": { min: "6px", max: "10px" }, /* calculé : 6.2 → 9.4 px */
    "inline-unit": { min: "10px", max: "14px" }, /* calculé : 9.6 → 14.4 px */
    "inline-lg": { min: "14px", max: "20px" }, /* calculé : 13.6 → 20.4 px */
    "inline-xl": { min: "10px", max: "16px" }, /* calculé : 10.6 → 15.8 px */
    "inline-2xl": { min: "20px", max: "28px" }, /* calculé : 19.2 → 28.8 px */
    "block-xs": { min: "2px", max: "2px" }, /* calculé : 2.2 → 2.8 px */
    "block-sm": { min: "2px", max: "4px" }, /* calculé : 2.7 → 3.5 px */
    "block-md": { min: "4px", max: "4px" }, /* calculé : 3.8 → 4.9 px */
    "block-control": { min: "8px", max: "10px" }, /* calculé : 7.6 → 9.7 px */
    "block-card": { min: "16px", max: "20px" }, /* calculé : 15.3 → 19.7 px */
    "block-unit": { min: "10px", max: "14px" }, /* calculé : 10.8 → 13.9 px */
    "block-lg": { min: "16px", max: "20px" }, /* calculé : 15.3 → 19.7 px */
    "block-xl": { min: "14px", max: "16px" }, /* calculé : 13.5 → 17.4 px */
    "block-page": { min: "20px", max: "28px" }, /* calculé : 21.6 → 27.8 px */
  },
};
