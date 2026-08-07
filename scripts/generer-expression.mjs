/* Traduit la planche des registres (fili.expression.json) en un module de la
   zone système. Rien n'est saisi deux fois : ce qui n'est pas dans la planche
   n'existe pas dans le produit. Regénérer et constater un diff vide est la
   preuve que la provenance tient — en attendant que S6 la rende opposable. */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const RACINE = path.resolve(fileURLToPath(new URL('../', import.meta.url)))
const planche = JSON.parse(fs.readFileSync(path.join(RACINE, 'fili.expression.json'), 'utf8'))
const sansMeta = (o) => Object.fromEntries(Object.entries(o).filter(([k]) => !k.startsWith('$')))

const icones = Object.fromEntries(
  Object.entries(sansMeta(planche.icones)).map(([nom, v]) => [nom, v.trace])
)
const sortie = `/* GÉNÉRÉ depuis fili.expression.json — ne pas éditer à la main.
   Regénérer : node scripts/generer-expression.mjs
   La planche est la source ; ce fichier n'en est que la traduction. */

/* Seules les icônes traversent : un tracé est une forme, et une forme se rend.
   Les tons, eux, vont directement de la planche aux utilitaires — les faire
   transiter par un module du produit ferait entrer des couleurs littérales en
   zone applicative, sans qu'aucun composant y gagne quoi que ce soit. */
export const ICONES = ${JSON.stringify(icones, null, 2)} as const

export type NomIcone = keyof typeof ICONES
`
const cible = path.join(RACINE, 'src/system/expression.genere.ts')
fs.writeFileSync(cible, sortie)
console.log('généré →', path.relative(RACINE, cible))
