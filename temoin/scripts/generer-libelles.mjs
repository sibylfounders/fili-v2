/* Traduit le catalogue de libellés (fili/libelles.json) en un module de la
   zone système. La voix du produit vit dans un seul endroit regardable :
   c'est la condition matérielle du point de passage B-5. */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const RACINE = path.resolve(fileURLToPath(new URL('../', import.meta.url)))
const brut = JSON.parse(fs.readFileSync(path.join(RACINE, 'fili/libelles.json'), 'utf8'))

const sansMeta = (v) => {
  if (Array.isArray(v)) return v
  if (v === null || typeof v !== 'object') return v
  return Object.fromEntries(
    Object.entries(v).filter(([k]) => !k.startsWith('$')).map(([k, x]) => [k, sansMeta(x)])
  )
}

const sortie = `/* GÉNÉRÉ depuis fili/libelles.json — ne pas éditer à la main.
   Regénérer : node scripts/generer-libelles.mjs
   Le catalogue est la source ; ce fichier n'en est que la traduction. */

export const LIBELLES = ${JSON.stringify(sansMeta(brut), null, 2)} as const

/* Un libellé porteur d'une valeur la reçoit ici, jamais par concaténation sur
   place : une phrase coupée en morceaux ne se relit plus d'un bloc. */
export function formuler(modele: string, valeurs: Record<string, string | number>): string {
  return modele.replace(/\\{(\\w+)\\}/g, (entier, cle: string) =>
    cle in valeurs ? String(valeurs[cle]) : entier
  )
}
`
fs.writeFileSync(path.join(RACINE, 'src/system/libelles.genere.ts'), sortie)
console.log('généré → src/system/libelles.genere.ts')
