/* L'immuabilité du journal, rendue mécanique — et rendue mécanique AU DÉPÔT.
 *
 * K2 §10.3 posait la règle : « on n'édite ni ne supprime une entrée passée ».
 * Elle n'était que de la discipline. La faire respecter en retirant le geste de
 * l'interface ne suffit pas : ce serait une propriété de l'écran, elle
 * disparaîtrait avec Fili et n'empêcherait rien d'une modification faite à la
 * main. Cette vérification est une propriété du dépôt : elle survit au produit,
 * et elle voit une réécriture d'où qu'elle vienne.
 *
 * Le mécanisme : une empreinte par entrée, versionnée. Une entrée passée dont
 * l'empreinte change est un refus. Une entrée qui disparaît est un refus. Une
 * entrée nouvelle est acceptée, et son empreinte est scellée au prochain sceau.
 *
 * Ce que ce dispositif NE fait PAS, et qui est dit : il n'empêche pas
 * physiquement l'écriture. Il la rend impossible à faire passer inaperçue —
 * ce qui est exactement ce que le projet demande depuis #021 : pas une
 * serrure, un juge qui refuse de statuer.
 */
import fs from 'node:fs'
import crypto from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(fileURLToPath(new URL('../../../', import.meta.url)))
const JOURNAL = path.join(ROOT, '..', 'docs', 'journal.md')
const SEAL = path.join(ROOT, '..', 'docs', 'journal.fingerprints.json')

/* Une entrée commence à un titre de niveau 2 portant son numéro : « ## #012 — … ».
   Le découpage est déterministe et ne dépend d'aucune interprétation. */
export function split(text) {
  const entries = new Map()
  const lines = text.split('\n')
  let current = null
  let body = []
  for (const l of lines) {
    const m = /^##\s+`?(#\d{3})`?\s*(.*)$/.exec(l)
    if (m) {
      if (current) entries.set(current, body.join('\n').trim())
      current = m[1]
      body = [l]
      continue
    }
    if (current) body.push(l)
  }
  if (current) entries.set(current, body.join('\n').trim())
  return entries
}

const fingerprint = (s) => crypto.createHash('sha256').update(s, 'utf8').digest('hex').slice(0, 16)

export function verify() {
  if (!fs.existsSync(JOURNAL)) return { decide: false, reason: 'journal.md introuvable' }
  const entries = split(fs.readFileSync(JOURNAL, 'utf8'))
  const current = Object.fromEntries([...entries].map(([id, body]) => [id, fingerprint(body)]))
  if (!fs.existsSync(SEAL))
    return { decide: true, first: true, entries: Object.keys(current).length, rewritten: [], disparues: [], fresh: Object.keys(current), current }

  const seal = JSON.parse(fs.readFileSync(SEAL, 'utf8')).fingerprints
  const rewritten = Object.keys(seal).filter((id) => current[id] !== undefined && current[id] !== seal[id])
  const disparues = Object.keys(seal).filter((id) => current[id] === undefined)
  const fresh = Object.keys(current).filter((id) => seal[id] === undefined)
  return { decide: true, first: false, entries: Object.keys(current).length, rewritten, disparues, fresh, current }
}

export function seal(current, entries) {
  fs.writeFileSync(SEAL, JSON.stringify({
    $comment: "Empreintes des entrées du journal. Une entrée passée dont l'empreinte change est une réécriture, et le dépôt la refuse. Scellé par tools/fili/journal/immutable.mjs.",
    entries,
    fingerprints: current
  }, null, 2) + '\n')
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = verify()
  if (!r.decide) { console.log(`\n🔴 REFUS DE STATUER — ${r.reason}\n`); process.exit(2) }

  const sealed = process.argv.includes('--seal')
  console.log(`\nIMMUABILITÉ DU JOURNAL — ${String(r.entries)} entrées lues\n`)
  for (const id of r.rewritten) console.log(`  🔴 ${id} — entrée passée RÉÉCRITE`)
  for (const id of r.disparues) console.log(`  🔴 ${id} — entrée passée DISPARUE`)
  for (const id of r.fresh) console.log(`  ➕ ${id} — entrée nouvelle`)

  const fault = r.rewritten.length + r.disparues.length
  if (fault > 0 && !sealed) {
    console.log(`\n  🔴 ${String(fault)} atteinte(s) au passé. Le journal ne se réécrit pas : il s'ajoute.\n`)
    process.exit(1)
  }
  if (sealed) {
    if (fault > 0) { console.log('\n  🔴 Sceller n\'efface pas une réécriture. Restaurez l\'entrée d\'abord.\n'); process.exit(1) }
    seal(r.current, r.entries)
    console.log(`\n  🟢 scellé — ${String(r.entries)} entrées.\n`)
  } else {
    console.log(`\n  🟢 aucune entrée passée touchée.\n`)
  }
}
