/* Transpile le JSX à la volée : le témoin rendu vient du fichier même
   que le Leviathan a vérifié, pas d'une transposition à la main. */
import { readFile } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'
import ts from 'typescript'

const RUNTIME = pathToFileURL(path.resolve(fileURLToPath(import.meta.url), '../runtime.mjs')).href

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
