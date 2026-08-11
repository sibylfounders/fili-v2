import path from 'node:path'
import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactHooks from 'eslint-plugin-react-hooks'
import tailwindcss from 'eslint-plugin-tailwindcss'
import { fili_config } from './tools/fili/eslint.fili.js'

/**
 * Chaîne de preuve FILI — partie automatisable de S4 et de S2.
 *
 * Toutes les règles a11y sont en `error`, jamais en `warn` : un warning est un
 * FAIL déguisé, et la doctrine ne connaît pas le « PASS avec réserve ».
 *
 * Rappel : ce lint ne couvre qu'environ 30 % des non-conformités WCAG.
 * Il ne dispense pas des tests manuels S4-T3 à S4-T7.
 */
export default tseslint.config(
  {
    /* La batterie de crash-tests tourne avec sa propre configuration isolée
       (tools/fili/eslint.crash.js). Ses fixtures ne sont pas du code de projet :
       elles ne sont pas dans tsconfig.app.json et n'ont pas à y entrer. */
    ignores: ['dist', 'node_modules', 'crash-tests', 'archive/k1-pieces', 'temoins', 'fili-v2'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      jsxA11y.flatConfigs.strict,
    ],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.app.json', './tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      tailwindcss,
    },
    settings: {
      // Chemin ABSOLU obligatoire : eslint-plugin-tailwindcss@3.18 délègue à
      // tailwind-api-utils, qui fait `resolveModule('tailwindcss', { paths: [dirname(config)] })`.
      // Avec un chemin relatif, dirname vaut "." et local-pkg échoue à résoudre
      // tailwindcss — d'où « Could not resolve tailwindcss ». Reproduit et tracé.
      tailwindcss: {
        config: path.resolve(import.meta.dirname, 'tailwind.config.js'),
        callees: ['classnames', 'clsx', 'cn'],
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,

      /* --- Règle d'or n°1 — le Design System avant le HTML brut ------------ */
      'tailwindcss/no-arbitrary-value': 'error',
      'tailwindcss/no-custom-classname': 'error',
      'tailwindcss/classnames-order': 'error',
      'tailwindcss/enforces-shorthand': 'error',

      /* --- Règle d'or n°2 — accessibilité, tout en error ------------------- */
      'jsx-a11y/no-static-element-interactions': 'error',
      'jsx-a11y/click-events-have-key-events': 'error',
      'jsx-a11y/no-noninteractive-element-interactions': 'error',
      'jsx-a11y/anchor-is-valid': 'error',
      'jsx-a11y/heading-has-content': 'error',
      'jsx-a11y/html-has-lang': 'error',
      'jsx-a11y/label-has-associated-control': 'error',
      'jsx-a11y/no-autofocus': 'error',

      /* --- Règle d'or n°3 — sécurité applicative --------------------------- */
      'react-hooks/exhaustive-deps': 'error',
      'no-restricted-properties': [
        'error',
        {
          object: 'window',
          property: 'localStorage',
          message:
            'RGPD — aucune donnée personnelle en localStorage non chiffré (doctrine R3).',
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'JSXAttribute[name.name="dangerouslySetInnerHTML"]',
          message: 'Injection HTML non assainie interdite (doctrine R3).',
        },
        {
          selector: 'JSXAttribute[name.name="style"]',
          message:
            'Styles inline interdits — les valeurs viennent des tokens (doctrine R1, garde-fou n°3).',
        },
      ],
    },
  },

  /* Le Gardien garde src/ : le produit vit sous les 29 assertions,
     pas seulement les crash-tests. */
  ...fili_config,
)
