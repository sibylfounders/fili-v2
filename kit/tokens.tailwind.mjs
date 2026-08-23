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
  },
  lineHeight: {
    courant: "var(--t-interligne-courant)",
    titre: "var(--t-interligne-titre)",
  },
  maxWidth: { mesure: "var(--t-mesure)" },
  letterSpacing: { etiquette: "var(--t-interlettrage-etiquette)" },
};
