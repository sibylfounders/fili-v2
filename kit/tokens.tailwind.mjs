/**
 * SORTIE JUMELLE TAILWIND — GÉNÉRÉE par kit/derivation.mjs, ne pas éditer.
 * Même source que app/tokens.css, autre cible : les utilitaires pointent sur
 * les variables, jamais sur des valeurs — le rythme continue de vivre après
 * compilation. L'API parle anglais (décision d'Auteur, 23 août 2026).
 *
 * Usage : import { rhythm, typography, color } from './tokens.tailwind.mjs'
 * puis dans tailwind.config : theme.extend.spacing = rhythm.spacing, etc.
 * Régénérer : npm run tokens
 */
export const rhythm = {
  spacing: {
    'pad-1-inline': 'var(--pad-1-inline)',
    'pad-2-inline': 'var(--pad-2-inline)',
    'pad-3-inline': 'var(--pad-3-inline)',
    'gap-1-inline': 'var(--gap-1-inline)',
    'gap-2-inline': 'var(--gap-2-inline)',
    'gap-3-inline': 'var(--gap-3-inline)',
    'gap-4-inline': 'var(--gap-4-inline)',
    'edge-inline': 'var(--edge-inline)',
    'page-2-inline': 'var(--page-2-inline)',
    'page-3-inline': 'var(--page-3-inline)',
    'page-4-inline': 'var(--page-4-inline)',
    'page-6-inline': 'var(--page-6-inline)',
    'pad-1-block': 'var(--pad-1-block)',
    'pad-2-block': 'var(--pad-2-block)',
    'pad-3-block': 'var(--pad-3-block)',
    'gap-1-block': 'var(--gap-1-block)',
    'gap-2-block': 'var(--gap-2-block)',
    'gap-3-block': 'var(--gap-3-block)',
    'gap-4-block': 'var(--gap-4-block)',
    'edge-block': 'var(--edge-block)',
    'page-2-block': 'var(--page-2-block)',
    'page-3-block': 'var(--page-3-block)',
    'page-4-block': 'var(--page-4-block)',
    'page-6-block': 'var(--page-6-block)'
  },
  borderRadius: {
    '1': 'var(--r-1)',
    '2': 'var(--r-2)',
    '3': 'var(--r-3)',
    '4': 'var(--r-4)',
    ctl: 'var(--r-ctl)',
    pill: 'var(--r-pill)'
  },
  height: {
    control: 'var(--control-height)',
    'control-compact': 'var(--control-height-compact)'
  },
  minHeight: {
    target: 'var(--target-min)'
  },
  screens: {
    desktop: '40em'
  }
};

/* Sortie jumelle — typographie : le corps borné et les crans dérivés (décision 5). */
export const typography = {
  fontFamily: {
    sans: 'var(--font-sans)',
    mono: 'var(--font-mono)',
    serif: 'var(--font-serif)'
  },
  fontSize: {
    label: 'var(--font-size-label)',
    small: 'var(--font-size-small)',
    body: 'var(--font-size-body)',
    h3: 'var(--font-size-h3)',
    h2: 'var(--font-size-h2)',
    h1: 'var(--font-size-h1)',
    display: 'var(--font-size-display)',
    'cover-max': 'var(--font-size-cover-max)',
    section: 'var(--font-size-section)'
  },
  lineHeight: {
    body: 'var(--leading-body)',
    heading: 'var(--leading-heading)'
  },
  maxWidth: {
    measure: 'var(--measure)'
  },
  letterSpacing: {
    label: 'var(--tracking-label)'
  }
};

/* Sortie jumelle — couleur (COLOR-UX.md 2.0.0). Les utilitaires pointent
   sur les variables : le thème (clair/sombre) se résout au rendu, jamais
   dans une classe. Les deux rôles de texte suivent la convention
   foreground du marché. */
export const color = {
  colors: {
    background: 'var(--bg)',
    surface: 'var(--surface)',
    'surface-hover': 'var(--surface-hover)',
    foreground: 'var(--text-primary)',
    'muted-foreground': 'var(--text-secondary)',
    'tertiary-foreground': 'var(--text-tertiary)',
    border: 'var(--border)',
    'border-strong': 'var(--border-strong)',
    primary: {
      DEFAULT: 'var(--primary)',
      hover: 'var(--primary-hover)',
      subtle: 'var(--primary-subtle)',
      text: 'var(--primary-text)',
      'text-hover': 'var(--primary-text-hover)'
    },
    'on-primary': {
      DEFAULT: 'var(--on-primary)',
      subtle: 'var(--on-primary-subtle)'
    },
    danger: {
      DEFAULT: 'var(--danger)',
      subtle: 'var(--danger-subtle)'
    },
    'on-danger': {
      DEFAULT: 'var(--on-danger)',
      subtle: 'var(--on-danger-subtle)'
    },
    success: {
      DEFAULT: 'var(--success)',
      subtle: 'var(--success-subtle)'
    },
    'on-success': {
      DEFAULT: 'var(--on-success)',
      subtle: 'var(--on-success-subtle)'
    },
    warning: {
      DEFAULT: 'var(--warning)',
      subtle: 'var(--warning-subtle)'
    },
    'on-warning': {
      DEFAULT: 'var(--on-warning)',
      subtle: 'var(--on-warning-subtle)'
    },
    info: {
      DEFAULT: 'var(--info)',
      subtle: 'var(--info-subtle)'
    },
    'on-info': {
      DEFAULT: 'var(--on-info)',
      subtle: 'var(--on-info-subtle)'
    },
    accent: 'var(--accent)',
    code: {
      bg: 'var(--code-bg)',
      text: 'var(--code-text)',
      com: 'var(--code-com)',
      str: 'var(--code-str)',
      kw: 'var(--code-kw)',
      tag: 'var(--code-tag)'
    }
  }
};

/* Le thème Tailwind LITTÉRAL — deux échelles assumées (décision d'Auteur,
   23 août) : Tailwind garde sa grille de 4, valeurs ARRONDIES au cran le
   plus proche ; le CSS natif garde les décimales via les variables. On ne
   mélange jamais les deux. min = borne 320 px, max = borne 1440 px ; le
   calcul exact est dit à côté. */
export const rhythmLiteral = {
  spacing: {
    'pad-1-inline': {
      min: '20px',
      max: '28px',
      calcule: '19.2 → 28.8 px'
    },
    'pad-2-inline': {
      min: '12px',
      max: '20px',
      calcule: '13.6 → 20.4 px'
    },
    'pad-3-inline': {
      min: '8px',
      max: '16px',
      calcule: '9.6 → 14.4 px'
    },
    'gap-1-inline': {
      min: '12px',
      max: '20px',
      calcule: '13.6 → 20.4 px'
    },
    'gap-2-inline': {
      min: '8px',
      max: '16px',
      calcule: '9.6 → 14.4 px'
    },
    'gap-3-inline': {
      min: '8px',
      max: '12px',
      calcule: '6.8 → 10.2 px'
    },
    'gap-4-inline': {
      min: '4px',
      max: '8px',
      calcule: '4.8 → 7.2 px'
    },
    'edge-inline': {
      min: '20px',
      max: '28px',
      calcule: '19.2 → 28.8 px'
    },
    'page-2-inline': {
      min: '40px',
      max: '56px',
      calcule: '38.4 → 57.6 px'
    },
    'page-3-inline': {
      min: '56px',
      max: '80px',
      calcule: '54.3 → 81.5 px'
    },
    'page-4-inline': {
      min: '76px',
      max: '116px',
      calcule: '76.8 → 115.2 px'
    },
    'page-6-inline': {
      min: '152px',
      max: '232px',
      calcule: '153.6 → 230.4 px'
    },
    'pad-1-block': {
      min: '20px',
      max: '28px',
      calcule: '21.6 → 27.8 px'
    },
    'pad-2-block': {
      min: '16px',
      max: '20px',
      calcule: '15.3 → 19.7 px'
    },
    'pad-3-block': {
      min: '12px',
      max: '12px',
      calcule: '10.8 → 13.9 px'
    },
    'gap-1-block': {
      min: '16px',
      max: '20px',
      calcule: '15.3 → 19.7 px'
    },
    'gap-2-block': {
      min: '12px',
      max: '12px',
      calcule: '10.8 → 13.9 px'
    },
    'gap-3-block': {
      min: '8px',
      max: '8px',
      calcule: '7.6 → 9.8 px'
    },
    'gap-4-block': {
      min: '4px',
      max: '8px',
      calcule: '5.4 → 7 px'
    },
    'edge-block': {
      min: '20px',
      max: '28px',
      calcule: '21.6 → 27.8 px'
    },
    'page-2-block': {
      min: '44px',
      max: '56px',
      calcule: '43.2 → 55.7 px'
    },
    'page-3-block': {
      min: '60px',
      max: '80px',
      calcule: '61.1 → 78.7 px'
    },
    'page-4-block': {
      min: '88px',
      max: '112px',
      calcule: '86.4 → 111.4 px'
    },
    'page-6-block': {
      min: '172px',
      max: '224px',
      calcule: '172.8 → 222.7 px'
    }
  }
};
