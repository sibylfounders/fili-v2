import { register } from 'node:module'
import { pathToFileURL } from 'node:url'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const RACINE = path.resolve(fileURLToPath(new URL('../../../', import.meta.url)))
register(pathToFileURL(path.join(RACINE, 'tools/fili/temoin/loader.mjs')))

/* Le rendu prend sa source en argument. Sans argument, il rend l'Écran Témoin
   dans temoin.html : l'usage historique est le comportement par défaut. */
const arg = (nom, defaut) => {
  const i = process.argv.indexOf(`--${nom}`)
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : defaut
}
const SOURCE = arg('page', 'crash-tests/pages/Temoin.tsx')
const EXPORT = arg('export', 'Temoin')
const SORTIE = arg('sortie', 'temoin.html')
const TITRE = arg('titre', 'FILI · Écran Témoin')

const { rendre } = await import(pathToFileURL(path.join(RACINE, 'tools/fili/temoin/runtime.mjs')).href)
const module_ = await import(pathToFileURL(path.join(RACINE, SOURCE)).href)
const Composant = module_[EXPORT]
if (typeof Composant !== 'function')
  throw new Error(`export « ${EXPORT} » introuvable dans ${SOURCE}`)

const css = ['crash-tests/design-system/tokens.css', 'crash-tests/design-system/style.css']
  .map((f) => readFileSync(path.join(RACINE, f), 'utf8')).join('\n')

const corps = rendre({ type: Composant, props: {}, enfants: [] })

const page = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${TITRE}</title>
<style>
${css}
</style>
</head>
<body>
${corps}
</body>
</html>
`
const cible = path.join(RACINE, SORTIE)
mkdirSync(path.dirname(cible), { recursive: true })
writeFileSync(cible, page)
console.log('rendu →', cible, `(${page.length} octets)`)
