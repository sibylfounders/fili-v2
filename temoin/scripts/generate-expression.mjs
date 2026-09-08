/* Traduit en module de la zone système ce que le produit doit lire à l'exécution :
   les tracés d'icônes et la grille sur laquelle ils sont dessinés. Les couleurs
   n'y passent pas — elles vont de la palette calculée aux utilitaires, sans
   transiter par un module du produit. */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(fileURLToPath(new URL('../', import.meta.url)))
const deck = JSON.parse(fs.readFileSync(path.join(ROOT, 'fili/icons.json'), 'utf8'))

const output = `/* GÉNÉRÉ depuis fili/icones.json — ne pas éditer à la main.
   Regénérer : node scripts/generer-expression.mjs
   Source du jeu : ${deck.$source}${deck.$version ? ` ${deck.$version}` : ''}${deck.$licence ? ` (${deck.$licence})` : ''} */

export const GRID = ${String(deck.$grid)}
export const STROKE = ${String(deck.$stroke)}

export const ICONS = ${JSON.stringify(deck.shapes, null, 2)} as const

export type NameIcon = keyof typeof ICONS
`
fs.writeFileSync(path.join(ROOT, 'src/system/expression.generated.ts'), output)
console.log('généré → src/system/expression.generated.ts')
