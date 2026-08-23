/* C1 — le Gardien juge le code, pas son auteur.
   Le même fichier, deux origines déclarées opposées, deux verdicts comparés. */
import fs from 'node:fs'
import path from 'node:path'
import { ESLint } from 'eslint'
import { fileURLToPath } from 'node:url'

const RACINE = path.resolve(fileURLToPath(new URL('../../../', import.meta.url)))
const CIBLE = path.join(RACINE, 'crash-tests/epreuve-c/SoigneNonInforme.tsx')
const eslint = new ESLint({ cwd: RACINE, cache: false,
  overrideConfigFile: path.join(RACINE, 'tools/fili/eslint.crash.js') })

const original = fs.readFileSync(CIBLE, 'utf8')
const ORIGINES = [
  '/* Origine declaree : ecrit a la main par un humain. */\n',
  "/* Origine declaree : genere par un assistant, modele de derniere generation, a partir d'un prompt. */\n"
]

const verdicts = []
try {
  for (const entete of ORIGINES) {
    fs.writeFileSync(CIBLE, entete + original)
    const [r] = await eslint.lintFiles([CIBLE])
    verdicts.push(r.messages.map((m) => `${m.ruleId}:${m.line - 1}`).sort().join('|'))
  }
} finally { fs.writeFileSync(CIBLE, original) }

const identiques = verdicts[0] === verdicts[1]
console.log('\nC1 — INVARIANCE AU PRODUCTEUR\n')
console.log(`  origine « ecrit a la main »          : ${verdicts[0].split('|').length} constats`)
console.log(`  origine « genere par un assistant »  : ${verdicts[1].split('|').length} constats`)
console.log(`\n  ${identiques ? '✅ verdicts strictement identiques' : '❌ les verdicts diffèrent'}\n`)
process.exit(identiques ? 0 : 1)
