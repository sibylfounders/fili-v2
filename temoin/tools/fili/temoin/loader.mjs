/* Transpile le JSX à la volée : le témoin rendu vient du fichier même
   que le Leviathan a vérifié, pas d'une transposition à la main.

   Et il détourne « react » vers le strict nécessaire au rendu d'un arrêt sur
   image. Sans ce détournement, tout écran qui pose un crochet d'état serait
   irrenderable par la chaîne — donc intémoignable —, et l'on serait ramené à
   la capture que #016 interdit. */
import { readFile } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'
import ts from 'typescript'

const ICI = path.resolve(fileURLToPath(import.meta.url), '..')
const RUNTIME = pathToFileURL(path.join(ICI, 'runtime.mjs')).href
const REACT = pathToFileURL(path.join(ICI, 'react-temoin.mjs')).href

export async function resolve(specifier, context, next) {
  if (specifier === 'react') return { url: REACT, format: 'module', shortCircuit: true }
  return next(specifier, context)
}

export async function load(url, context, next) {
  if (url.endsWith('.tsx')) {
    const source = await readFile(fileURLToPath(url), 'utf8')
    const { outputText } = ts.transpileModule(source, {
      compilerOptions: { jsx: ts.JsxEmit.React, jsxFactory: 'h', jsxFragmentFactory: 'Fragment',
                         target: ts.ScriptTarget.ESNext, module: ts.ModuleKind.ESNext }
    })
    return { format: 'module', shortCircuit: true,
             source: `import { h, Fragment } from ${JSON.stringify(RUNTIME)};\n${outputText}` }
  }
  return next(url, context)
}
