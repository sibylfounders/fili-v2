/* ÉCRIT LES TROIS PIÈCES GÉNÉRÉES — kit/tokens.ecrire.mjs
   app/tokens.css · tokens.tailwind.mjs · tokens.figma.json, depuis le moteur
   (kit/derivation.mjs). Séparé du moteur parce que le moteur est aussi chargé
   par le navigateur : ici seulement, on touche au disque.
   Lancer : npm run tokens  (ou node kit/tokens.ecrire.mjs)                */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { versTokensCss, versTailwindFichier, versFigma, PRIMAIRE_DEFAUT } from './derivation.mjs'

const ici = path.dirname(fileURLToPath(import.meta.url))
const primaire = process.argv.find((a) => a.startsWith('#')) ?? PRIMAIRE_DEFAUT
const pieces = {
  'app/tokens.css': versTokensCss({}, primaire),
  'tokens.tailwind.mjs': versTailwindFichier(),
  'tokens.figma.json': JSON.stringify(versFigma({}, primaire), null, 2) + '\n',
}
for (const [nom, contenu] of Object.entries(pieces)) fs.writeFileSync(path.join(ici, nom), contenu)
console.log(`écrit : ${Object.keys(pieces).join(' · ')}`)
