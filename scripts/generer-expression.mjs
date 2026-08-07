/* Traduit en module de la zone système ce que le produit doit lire à l'exécution :
   les tracés d'icônes et la grille sur laquelle ils sont dessinés. Les couleurs
   n'y passent pas — elles vont de la palette calculée aux utilitaires, sans
   transiter par un module du produit. */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const RACINE = path.resolve(fileURLToPath(new URL('../', import.meta.url)))
const jeu = JSON.parse(fs.readFileSync(path.join(RACINE, 'fili.icones.json'), 'utf8'))

const sortie = `/* GÉNÉRÉ depuis fili.icones.json — ne pas éditer à la main.
   Regénérer : node scripts/generer-expression.mjs
   Source du jeu : ${jeu.$source}${jeu.$version ? ` ${jeu.$version}` : ''}${jeu.$licence ? ` (${jeu.$licence})` : ''} */

export const GRILLE = ${String(jeu.$grille)}
export const TRAIT = ${String(jeu.$trait)}

export const ICONES = ${JSON.stringify(jeu.formes, null, 2)} as const

export type NomIcone = keyof typeof ICONES
`
fs.writeFileSync(path.join(RACINE, 'src/system/expression.genere.ts'), sortie)
console.log('généré → src/system/expression.genere.ts')
