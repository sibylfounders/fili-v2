/* ÉCRIT LES TROIS PIÈCES GÉNÉRÉES — kit/tokens.write.mjs
   app/tokens.css · tokens.tailwind.mjs · tokens.figma.json, depuis le moteur
   (kit/derivation.mjs). Séparé du moteur parce que le moteur est aussi chargé
   par le navigateur : ici seulement, on touche au disque.
   Lancer : npm run tokens  (ou node kit/tokens.write.mjs)                */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { toTokensCss, toTailwindFile, toFigma, PRIMARY_DEFAULTS } from './derivation.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const primary = process.argv.find((a) => a.startsWith('#')) ?? PRIMARY_DEFAULTS
const pieces = {
  'app/tokens.css': toTokensCss({}, primary),
  'tokens.tailwind.mjs': toTailwindFile(),
  'tokens.figma.json': JSON.stringify(toFigma({}, primary), null, 2) + '\n',
}
for (const [name, content] of Object.entries(pieces)) fs.writeFileSync(path.join(here, name), content)
console.log(`écrit : ${Object.keys(pieces).join(' · ')}`)
