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

const RACINE = path.resolve(fileURLToPath(new URL('../../../', import.meta.url)))
const SOURCE = path.join(RACINE, '..', 'docs', 'system-map.md')

/* Les cinq tableaux attendus, avec leur en-tête exacte. L'en-tête EST le
   contrat : si elle change, le document a changé de forme, et une forme
   changée se déclare — elle ne se rattrape pas par tolérance. */
const ATTENDUS = [
  { cle: 'jalons', titre: '1. Les jalons du chapitre', colonnes: ['Jalon', 'Statut', 'Ce qu\'il verrouille', 'Ce qui le bloque'] },
  { cle: 'contrats', titre: '2. Les contrats du corpus', colonnes: ['Contrat', 'Statut', 'Ce qu\'il gouverne', 'Assertions'] },
  { cle: 'gabarits', titre: '3. Le produit', colonnes: ['Gabarit', 'Parcours', 'Statut', 'Témoin'] },
  { cle: 'instrument', titre: '4. L\'instrument de la Voie B', colonnes: ['Pièce', 'Statut', 'Ce qu\'elle porte', 'Ce qui la bloque'] },
  { cle: 'dettes', titre: '5. Les dettes ouvertes', colonnes: ['Dette', 'Statut', 'Depuis', 'Ce qu\'elle coûte'] },
]

const cellules = (ligne) =>
  ligne.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim())

const nettoyer = (s) => s.replace(/\*\*/g, '').replace(/`/g, '').trim()

export function lireCarte(texte) {
  const lignes = texte.split('\n')
  const manques = []
  const tables = {}

  for (const a of ATTENDUS) {
    const iTitre = lignes.findIndex((l) => l.startsWith('## ') && l.includes(a.titre))
    if (iTitre === -1) { manques.push(`section « ${a.titre} » absente`); continue }

    const iEntete = lignes.findIndex((l, i) => i > iTitre && l.trim().startsWith('|'))
    const iFin = lignes.findIndex((l, i) => i > iTitre && l.startsWith('## '))
    if (iEntete === -1 || (iFin !== -1 && iEntete > iFin)) {
      manques.push(`tableau de « ${a.titre} » absent`); continue
    }

    const entete = cellules(lignes[iEntete]).map(nettoyer)
    if (entete.length !== a.colonnes.length || entete.some((c, i) => c !== a.colonnes[i])) {
      manques.push(`en-tête de « ${a.titre} » modifiée : attendu ${a.colonnes.join(' · ')}, lu ${entete.join(' · ')}`)
      continue
    }

    const corps = []
    for (let i = iEntete + 2; i < lignes.length && (iFin === -1 || i < iFin); i++) {
      const l = lignes[i]
      if (!l.trim().startsWith('|')) break
      const c = cellules(l)
      if (c.length !== a.colonnes.length) {
        manques.push(`ligne mal formée dans « ${a.titre} » : ${String(c.length)} colonnes au lieu de ${String(a.colonnes.length)}`)
        break
      }
      corps.push(Object.fromEntries(a.colonnes.map((nom, j) => [nom, nettoyer(c[j])])))
    }
    if (corps.length === 0) manques.push(`tableau de « ${a.titre} » vide`)
    tables[a.cle] = corps
  }

  return { tables, manques }
}

/* Ce qui compte d'abord sur É5 : le prochain jalon ouvrable, et ce qui le
   bloque. Il se calcule, il ne se déclare pas — un jalon désigné à la main
   resterait juste jusqu'au jour où il ne le serait plus. */
export function prochainJalon(jalons) {
  const enCours = jalons.find((j) => j.Statut === '🟡')
  if (enCours) return { nom: enCours.Jalon, statut: 'en cours', bloque: enCours['Ce qui le bloque'] }
  const suivant = jalons.find((j) => j.Statut === '⚪')
  if (suivant) return { nom: suivant.Jalon, statut: 'ouvrable', bloque: suivant['Ce qui le bloque'] }
  return null
}

export function produire() {
  if (!fs.existsSync(SOURCE)) return { erreur: 'system-map.md est introuvable' }
  const { tables, manques } = lireCarte(fs.readFileSync(SOURCE, 'utf8'))
  if (manques.length > 0) return { erreur: `la carte n'a pas la forme déclarée — ${manques.join(' · ')}` }
  return {
    donnees: {
      jalons: tables.jalons.map((j) => ({
        nom: j.Jalon, statut: j.Statut, verrouille: j['Ce qu\'il verrouille'], bloque: j['Ce qui le bloque'],
      })),
      contrats: tables.contrats.map((c) => ({
        nom: c.Contrat, statut: c.Statut, gouverne: c['Ce qu\'il gouverne'], assertions: c.Assertions,
      })),
      gabarits: tables.gabarits.map((g) => ({
        nom: g.Gabarit, parcours: g.Parcours, statut: g.Statut, temoin: g['Témoin'],
      })),
      instrument: tables.instrument.map((p) => ({
        nom: p['Pièce'], statut: p.Statut, porte: p['Ce qu\'elle porte'], bloque: p['Ce qui la bloque'],
      })),
      dettes: tables.dettes.map((d) => ({
        nom: d.Dette, statut: d.Statut, depuis: d.Depuis, cout: d['Ce qu\'elle coûte'],
      })),
      prochain: prochainJalon(tables.jalons),
    },
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = produire()
  if (r.erreur) { console.error('🔴 REFUS DE STATUER —', r.erreur); process.exit(1) }
  console.log('carte lue —',
    `${String(r.donnees.jalons.length)} jalons ·`,
    `${String(r.donnees.contrats.length)} contrats ·`,
    `${String(r.donnees.gabarits.length)} gabarits ·`,
    `${String(r.donnees.instrument.length)} pièces ·`,
    `${String(r.donnees.dettes.length)} dettes`)
  console.log('  prochain jalon :', r.donnees.prochain?.nom, '—', r.donnees.prochain?.bloque)
}
