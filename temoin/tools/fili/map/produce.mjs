/* La carte, dérivée du document humain — et jamais devinée.
 *
 * Deux formes, une seule source. `system-map.md` reste le document que
 * l'Auteur écrit et relit ; ce script en tire la pièce que É5 affiche. Le
 * chemin inverse — écrire la pièce à la main et générer le markdown — aurait
 * produit deux vérités dont l'une se serait tue en dérivant.
 *
 * Le risque de cette dérivation est connu et il est traité de front : un
 * analyseur de markdown qui « fait au mieux » casse en silence au premier
 * titre reformulé, et l'écran montrerait une carte vide sans que personne le
 * sache. Celui-ci REFUSE DE STATUER. C'est le même geste que « pas de
 * registre, pas de verdict » : il vaut mieux un écran qui dit qu'il ne sait
 * pas qu'un écran qui montre le vide comme s'il était l'état du système.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(fileURLToPath(new URL('../../../', import.meta.url)))
const SOURCE = path.join(ROOT, '..', 'docs', 'system-map.md')

/* Les cinq tableaux attendus, avec leur en-tête exacte. L'en-tête EST le
   contrat : si elle change, le document a changé de forme, et une forme
   changée se déclare — elle ne se rattrape pas par tolérance. */
const EXPECTEDALL = [
  { key: 'milestones', heading: '1. Les jalons du chapitre', columns: ['Milestone', 'Statut', 'Ce qu\'il verrouille', 'Ce qui le bloque'] },
  { key: 'contracts', heading: '2. Les contrats du corpus', columns: ['Contract', 'Statut', 'Ce qu\'il gouverne', 'Assertions'] },
  { key: 'templates', heading: '3. Le produit', columns: ['Template', 'Parcours', 'Statut', 'Témoin'] },
  { key: 'instrument', heading: '4. L\'instrument de la Voie B', columns: ['Pièce', 'Statut', 'Ce qu\'elle porte', 'Ce qui la bloque'] },
  { key: 'debts', heading: '5. Les dettes ouvertes', columns: ['Debt', 'Statut', 'Depuis', 'Ce qu\'elle coûte'] },
]

const cells = (line) =>
  line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim())

const clean = (s) => s.replace(/\*\*/g, '').replace(/`/g, '').trim()

export function readCard(text) {
  const lines = text.split('\n')
  const lacks = []
  const tables = {}

  for (const a of EXPECTEDALL) {
    const iHeading = lines.findIndex((l) => l.startsWith('## ') && l.includes(a.heading))
    if (iHeading === -1) { lacks.push(`section « ${a.heading} » absente`); continue }

    const iHeader = lines.findIndex((l, i) => i > iHeading && l.trim().startsWith('|'))
    const iEnd = lines.findIndex((l, i) => i > iHeading && l.startsWith('## '))
    if (iHeader === -1 || (iEnd !== -1 && iHeader > iEnd)) {
      lacks.push(`tableau de « ${a.heading} » absent`); continue
    }

    const header = cells(lines[iHeader]).map(clean)
    if (header.length !== a.columns.length || header.some((c, i) => c !== a.columns[i])) {
      lacks.push(`en-tête de « ${a.heading} » modifiée : attendu ${a.columns.join(' · ')}, lu ${header.join(' · ')}`)
      continue
    }

    const body = []
    for (let i = iHeader + 2; i < lines.length && (iEnd === -1 || i < iEnd); i++) {
      const l = lines[i]
      if (!l.trim().startsWith('|')) break
      const c = cells(l)
      if (c.length !== a.columns.length) {
        lacks.push(`ligne mal formée dans « ${a.heading} » : ${String(c.length)} colonnes au lieu de ${String(a.columns.length)}`)
        break
      }
      body.push(Object.fromEntries(a.columns.map((name, j) => [name, clean(c[j])])))
    }
    if (body.length === 0) lacks.push(`tableau de « ${a.heading} » vide`)
    tables[a.key] = body
  }

  return { tables, lacks }
}

/* Ce qui compte d'abord sur É5 : le prochain jalon ouvrable, et ce qui le
   bloque. Il se calcule, il ne se déclare pas — un jalon désigné à la main
   resterait juste jusqu'au jour où il ne le serait plus. */
export function nextMilestone(milestones) {
  const inCourse = milestones.find((j) => j.Status === '🟡')
  if (inCourse) return { name: inCourse.Milestone, status: 'en cours', blocked: inCourse['Ce qui le bloque'] }
  const next = milestones.find((j) => j.Status === '⚪')
  if (next) return { name: next.Milestone, status: 'ouvrable', blocked: next['Ce qui le bloque'] }
  return null
}

export function produce() {
  if (!fs.existsSync(SOURCE)) return { error: 'system-map.md est introuvable' }
  const { tables, lacks } = readCard(fs.readFileSync(SOURCE, 'utf8'))
  if (lacks.length > 0) return { error: `la carte n'a pas la forme déclarée — ${lacks.join(' · ')}` }
  return {
    data: {
      milestones: tables.milestones.map((j) => ({
        name: j.Milestone, status: j.Status, locked: j['Ce qu\'il verrouille'], blocked: j['Ce qui le bloque'],
      })),
      contracts: tables.contracts.map((c) => ({
        name: c.Contract, status: c.Status, governs: c['Ce qu\'il gouverne'], assertions: c.Assertions,
      })),
      templates: tables.templates.map((g) => ({
        name: g.Template, journey: g.Journey, status: g.Status, witness: g['Témoin'],
      })),
      instrument: tables.instrument.map((p) => ({
        name: p['Pièce'], status: p.Status, door: p['Ce qu\'elle porte'], blocked: p['Ce qui la bloque'],
      })),
      debts: tables.debts.map((d) => ({
        name: d.Debt, status: d.Status, since: d.Since, cost: d['Ce qu\'elle coûte'],
      })),
      next: nextMilestone(tables.milestones),
    },
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = produce()
  if (r.error) { console.error('🔴 REFUS DE STATUER —', r.error); process.exit(1) }
  console.log('carte lue —',
    `${String(r.data.milestones.length)} jalons ·`,
    `${String(r.data.contracts.length)} contrats ·`,
    `${String(r.data.templates.length)} gabarits ·`,
    `${String(r.data.instrument.length)} pièces ·`,
    `${String(r.data.debts.length)} dettes`)
  console.log('  prochain jalon :', r.data.next?.name, '—', r.data.next?.blocked)
}
