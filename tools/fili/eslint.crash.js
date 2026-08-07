/* Configuration dédiée à la batterie de crash-tests.
   Volontairement séparée de la configuration du projet : la batterie doit
   pouvoir tourner sans dépendre des réglages de lint de l'application. */
import parser from '@typescript-eslint/parser'
import fili from './index.js'

export default [
  { ignores: ['node_modules/**', 'dist/**'] },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser,
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } }
    },
    plugins: { fili },
    rules: {
      'fili/registry-required': 'error',
      'fili/no-raw-interactive': 'error',
      'fili/no-fake-interactive': 'error',
      'fili/registry-only-components': 'error',
      'fili/no-escape-hatch': 'error',
      'fili/etat-declare': 'error',
      'fili/discipline-spatiale': 'error',
      'fili/rythme-composition': 'error',
      'fili/arbitrage-lecture': 'error'
    }
  }
]
