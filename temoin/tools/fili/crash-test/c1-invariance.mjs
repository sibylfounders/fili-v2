/* C1 — le Gardien juge le code, pas son auteur.
   Le même fichier, deux origines déclarées opposées, deux verdicts comparés. */
import fs from 'node:fs'
import path from 'node:path'
import { ESLint } from 'eslint'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(fileURLToPath(new URL('../../../', import.meta.url)))
const TARGET = path.join(ROOT, 'crash-tests/test-c/PolishedNotInformed.tsx')
const eslint = new ESLint({ cwd: ROOT, cache: false,
  overrideConfigFile: path.join(ROOT, 'tools/fili/eslint.crash.js') })

const original = fs.readFileSync(TARGET, 'utf8')
const ORIGINS = [
  '/* Origine declaree : ecrit a la main par un humain. */\n',
  "/* Origine declaree : genere par un assistant, modele de derniere generation, a partir d'un prompt. */\n"
]

const verdicts = []
try {
  for (const header of ORIGINS) {
    fs.writeFileSync(TARGET, header + original)
    const [r] = await eslint.lintFiles([TARGET])
    verdicts.push(r.messages.map((m) => `${m.ruleId}:${m.line - 1}`).sort().join('|'))
  }
} finally { fs.writeFileSync(TARGET, original) }

const identical = verdicts[0] === verdicts[1]
console.log('\nC1 — INVARIANCE AU PRODUCTEUR\n')
console.log(`  origine « ecrit a la main »          : ${verdicts[0].split('|').length} constats`)
console.log(`  origine « genere par un assistant »  : ${verdicts[1].split('|').length} constats`)
console.log(`\n  ${identical ? '✅ verdicts strictement identiques' : '❌ les verdicts diffèrent'}\n`)
process.exit(identical ? 0 : 1)
