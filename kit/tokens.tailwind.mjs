/**
 * SORTIE JUMELLE TAILWIND — même source que app/tokens.css, autre cible.
 * Le marché demande l'adaptation : CSS natif ET Tailwind. Les utilitaires
 * pointent sur les variables, jamais sur des valeurs — le rythme continue
 * de vivre après compilation (doctrine du kit géométrie, conservée).
 *
 * Usage : import { rythme } from './tokens.tailwind.mjs'
 * puis dans tailwind.config : theme.extend.spacing = rythme.spacing, etc.
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
