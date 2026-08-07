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

const RACINE = path.resolve(fileURLToPath(new URL('../../../', import.meta.url)))
const JOURNAL = path.join(RACINE, 'journal.md')
const SCEAU = path.join(RACINE, 'journal.empreintes.json')

/* Une entrée commence à un titre de niveau 2 portant son numéro : « ## #012 — … ».
   Le découpage est déterministe et ne dépend d'aucune interprétation. */
export function decouper(texte) {
  const entrees = new Map()
  const lignes = texte.split('\n')
  let courant = null
  let corps = []
  for (const l of lignes) {
    const m = /^##\s+`?(#\d{3})`?\s*(.*)$/.exec(l)
    if (m) {
      if (courant) entrees.set(courant, corps.join('\n').trim())
      courant = m[1]
      corps = [l]
      continue
    }
    if (courant) corps.push(l)
  }
  if (courant) entrees.set(courant, corps.join('\n').trim())
  return entrees
}

const empreinte = (s) => crypto.createHash('sha256').update(s, 'utf8').digest('hex').slice(0, 16)

export function verifier() {
  if (!fs.existsSync(JOURNAL)) return { statuer: false, raison: 'journal.md introuvable' }
  const entrees = decouper(fs.readFileSync(JOURNAL, 'utf8'))
  const actuelles = Object.fromEntries([...entrees].map(([id, corps]) => [id, empreinte(corps)]))
  if (!fs.existsSync(SCEAU))
    return { statuer: true, premier: true, entrees: Object.keys(actuelles).length, reecrites: [], disparues: [], nouvelles: Object.keys(actuelles), actuelles }

  const sceau = JSON.parse(fs.readFileSync(SCEAU, 'utf8')).empreintes
  const reecrites = Object.keys(sceau).filter((id) => actuelles[id] !== undefined && actuelles[id] !== sceau[id])
  const disparues = Object.keys(sceau).filter((id) => actuelles[id] === undefined)
  const nouvelles = Object.keys(actuelles).filter((id) => sceau[id] === undefined)
  return { statuer: true, premier: false, entrees: Object.keys(actuelles).length, reecrites, disparues, nouvelles, actuelles }
}

export function sceller(actuelles, entrees) {
  fs.writeFileSync(SCEAU, JSON.stringify({
    $comment: "Empreintes des entrées du journal. Une entrée passée dont l'empreinte change est une réécriture, et le dépôt la refuse. Scellé par tools/fili/journal/immuable.mjs.",
    entrees,
    empreintes: actuelles
  }, null, 2) + '\n')
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = verifier()
  if (!r.statuer) { console.log(`\n🔴 REFUS DE STATUER — ${r.raison}\n`); process.exit(2) }

  const scelle = process.argv.includes('--sceller')
  console.log(`\nIMMUABILITÉ DU JOURNAL — ${String(r.entrees)} entrées lues\n`)
  for (const id of r.reecrites) console.log(`  🔴 ${id} — entrée passée RÉÉCRITE`)
  for (const id of r.disparues) console.log(`  🔴 ${id} — entrée passée DISPARUE`)
  for (const id of r.nouvelles) console.log(`  ➕ ${id} — entrée nouvelle`)

  const faute = r.reecrites.length + r.disparues.length
  if (faute > 0 && !scelle) {
    console.log(`\n  🔴 ${String(faute)} atteinte(s) au passé. Le journal ne se réécrit pas : il s'ajoute.\n`)
    process.exit(1)
  }
  if (scelle) {
    if (faute > 0) { console.log('\n  🔴 Sceller n\'efface pas une réécriture. Restaurez l\'entrée d\'abord.\n'); process.exit(1) }
    sceller(r.actuelles, r.entrees)
    console.log(`\n  🟢 scellé — ${String(r.entrees)} entrées.\n`)
  } else {
    console.log(`\n  🟢 aucune entrée passée touchée.\n`)
  }
}
