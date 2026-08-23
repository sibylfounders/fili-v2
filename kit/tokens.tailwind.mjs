/**
 * SORTIE JUMELLE TAILWIND — même source que app/tokens.css, autre cible.
 * Le marché demande l'adaptation : CSS natif ET Tailwind. Les utilitaires
 * pointent sur les variables, jamais sur des valeurs — le rythme continue
 * de vivre après compilation (doctrine du kit géométrie, conservée).
 *
 * NOMMAGE (décision d'Auteur, 23 août 2026) : l'API du kit parle anglais,
 * conventions marché — la doctrine et les pages restent en français.
 *
 * Usage : import { rhythm, typography, color } from './tokens.tailwind.mjs'
 * puis dans tailwind.config : theme.extend.spacing = rhythm.spacing, etc.
 *
 * NOTE D'AUTEUR (23 août 2026) : si un consommateur Tailwind exige un thème
 * à valeurs littérales (sans variables), les valeurs sortiront ARRONDIES —
 * jamais de décimales à quatre chiffres dans un thème Tailwind. Tant que les
 * utilitaires pointent sur les variables (le cas ici), la question ne se
 * pose pas : la variable se résout au rendu.
 */
export const rhythm = {
  spacing: {
    'inline-xs': 'var(--space-inline-xs)',
    'inline-sm': 'var(--space-inline-sm)',
    'inline-unit': 'var(--space-inline-unit)',
    'inline-lg': 'var(--space-inline-lg)',
    'inline-xl': 'var(--space-inline-xl)',
    'inline-2xl': 'var(--space-inline-2xl)',
    'block-xs': 'var(--space-block-xs)',
    'block-sm': 'var(--space-block-sm)',
    'block-md': 'var(--space-block-md)',
    'block-control': 'var(--space-block-control)',
    'block-card': 'var(--space-block-card)',
    'block-unit': 'var(--space-block-unit)',
    'block-lg': 'var(--space-block-lg)',
    'block-xl': 'var(--space-block-xl)',
    'block-page': 'var(--space-block-page)',
  },
  borderRadius: {
    DEFAULT: 'var(--radius)',
    card: 'var(--radius-card)',
    shell: 'var(--radius-shell)',
  },
  height: { control: 'var(--control-height)' },
  fontSize: { base: 'var(--font-size-base)' },
};

/* Sortie jumelle — typographie (même origine que tokens.css ; les valeurs
   littérales d'un thème Tailwind sortiraient ARRONDIES, note d'Auteur). */
export const typography = {
  fontFamily: {
    sans: "var(--font-sans)",
    mono: "var(--font-mono)",
  },
  fontSize: {
    body: "var(--font-size-body)",
    h3: "var(--font-size-h3)",
    h2: "var(--font-size-h2)",
    h1: "var(--font-size-h1)",
    display: "var(--font-size-display)",
  },
  lineHeight: {
    body: "var(--leading-body)",
    heading: "var(--leading-heading)",
  },
  maxWidth: { measure: "var(--measure)" },
  letterSpacing: { label: "var(--tracking-label)" },
};


/* Sortie jumelle — couleur (COLOR-UX.md 2.0.0). Les utilitaires pointent
   sur les variables : le thème (clair/sombre) se résout au rendu, jamais
   dans une classe — un thème littéral figerait un seul des deux thèmes.
   Les deux rôles de texte suivent la convention foreground du marché. */
export const color = {
  colors: {
    background: "var(--bg)",
    surface: "var(--surface)",
    foreground: "var(--text-primary)",
    "muted-foreground": "var(--text-secondary)",
    border: "var(--border)",
    "border-strong": "var(--border-strong)",
    primary: {
      DEFAULT: "var(--primary)",
      hover: "var(--primary-hover)",
      subtle: "var(--primary-subtle)",
    },
    "on-primary": {
      DEFAULT: "var(--on-primary)",
      subtle: "var(--on-primary-subtle)",
    },
    danger: {
      DEFAULT: "var(--danger)",
      subtle: "var(--danger-subtle)",
    },
    "on-danger": "var(--on-danger)",
    success: {
      DEFAULT: "var(--success)",
      subtle: "var(--success-subtle)",
    },
    "on-success": "var(--on-success)",
    code: { bg: "var(--code-bg)", text: "var(--code-text)" },
  },
};

/* ── Le thème Tailwind LITTÉRAL — deux échelles assumées (décision d'Auteur,
   23 août) : Tailwind garde sa grille 4-16, valeurs ARRONDIES au cran le plus
   proche, jamais de décimales ; le CSS natif garde les décimales calculées
   via les variables (rhythm.spacing ci-dessus). On ne mélange jamais les
   deux : un projet choisit son échelle et s'y tient. min = borne 320 px,
   max = borne 1440 px (thème par régime, la fluidité reste aux variables). */
export const rhythmLiteral = {
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
