/* Le bloc FILI à greffer dans la configuration ESLint du projet.
   Il ne remplace rien : il s'ajoute. */
import parser from '@typescript-eslint/parser'
import fili from './index.js'

export const fili_config = [
  {
    files: ['src/**/*.{ts,tsx}'],
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
export default fili_config
