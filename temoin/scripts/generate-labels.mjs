/* Traduit le catalogue de libellés (fili/libelles.json) en un module de la
   zone système. La voix du produit vit dans un seul endroit regardable :
   c'est la condition matérielle du point de passage B-5. */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(fileURLToPath(new URL('../', import.meta.url)))
const raw = JSON.parse(fs.readFileSync(path.join(ROOT, 'fili/labels.json'), 'utf8'))

const withoutMeta = (v) => {
  if (Array.isArray(v)) return v
  if (v === null || typeof v !== 'object') return v
  return Object.fromEntries(
    Object.entries(v).filter(([k]) => !k.startsWith('$')).map(([k, x]) => [k, withoutMeta(x)])
  )
}

const output = `/* GÉNÉRÉ depuis fili/libelles.json — ne pas éditer à la main.
   Regénérer : node scripts/generer-libelles.mjs
   Le catalogue est la source ; ce fichier n'en est que la traduction. */

export const LABELS = ${JSON.stringify(withoutMeta(raw), null, 2)} as const

/* Un libellé porteur d'une valeur la reçoit ici, jamais par concaténation sur
   place : une phrase coupée en morceaux ne se relit plus d'un bloc. */
export function phrase(model: string, values: Record<string, string | number>): string {
  return model.replace(/\\{(\\w+)\\}/g, (whole, key: string) =>
    key in values ? String(values[key]) : whole
  )
}
`
fs.writeFileSync(path.join(ROOT, 'src/system/labels.generated.ts'), output)
console.log('généré → src/system/labels.generated.ts')
