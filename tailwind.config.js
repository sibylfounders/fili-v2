/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      /*
       * Couche de tokens sémantiques FILI — provisoire (🟡).
       * Règle d'or n°1 : aucune valeur en dur dans les composants.
       * Les valeurs réelles vivent dans src/index.css (@layer base) sous forme
       * de custom properties, pour permettre le thème clair/sombre sans
       * dupliquer la config. À terme : générées par Style Dictionary.
       */
      colors: {
        surface: {
          DEFAULT: 'rgb(var(--fili-surface) / <alpha-value>)',
          muted: 'rgb(var(--fili-surface-muted) / <alpha-value>)',
        },
        ink: {
          DEFAULT: 'rgb(var(--fili-ink) / <alpha-value>)',
          muted: 'rgb(var(--fili-ink-muted) / <alpha-value>)',
        },
        border: {
          DEFAULT: 'rgb(var(--fili-border) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--fili-accent) / <alpha-value>)',
          contrast: 'rgb(var(--fili-accent-contrast) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['var(--fili-font-sans)'],
        mono: ['var(--fili-font-mono)'],
      },
      borderRadius: {
        card: 'var(--fili-radius-card)',
      },
      maxWidth: {
        prose: 'var(--fili-measure)',
      },
    },
  },
  plugins: [],
}
