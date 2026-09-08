import { register } from 'node:module'
import { pathToFileURL } from 'node:url'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(fileURLToPath(new URL('../../../', import.meta.url)))
register(pathToFileURL(path.join(ROOT, 'tools/fili/witness/loader.mjs')))

/* Le rendu prend sa source en argument. Sans argument, il rend l'Écran Témoin
   dans temoin.html : l'usage historique est le comportement par défaut. */
const arg = (name, defaults) => {
  const i = process.argv.indexOf(`--${name}`)
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : defaults
}
const SOURCE = arg('page', 'crash-tests/pages/Witness.tsx')
const EXPORT = arg('export', 'Witness')
const OUTPUT = arg('output', 'witness.html')
const HEADING = arg('heading', 'FILI · Écran Témoin')

const { toRender } = await import(pathToFileURL(path.join(ROOT, 'tools/fili/witness/runtime.mjs')).href)
const module_ = await import(pathToFileURL(path.join(ROOT, SOURCE)).href)
const Component = module_[EXPORT]
if (typeof Component !== 'function')
  throw new Error(`export « ${EXPORT} » introuvable dans ${SOURCE}`)

const css = ['crash-tests/design-system/tokens.css', 'crash-tests/design-system/style.css']
  .map((f) => readFileSync(path.join(ROOT, f), 'utf8')).join('\n')

const body = toRender({ type: Component, props: {}, children: [] })

const page = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${HEADING}</title>
<style>
${css}
</style>
</head>
<body>
${body}
</body>
</html>
`
const target = path.join(ROOT, OUTPUT)
mkdirSync(path.dirname(target), { recursive: true })
writeFileSync(target, page)
console.log('rendu →', target, `(${page.length} octets)`)
