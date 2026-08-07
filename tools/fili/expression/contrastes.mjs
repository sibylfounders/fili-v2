/* Mesure les contrastes de la planche des registres d'expression.
   Déterministe, sans dépendance. Il ne juge rien : il mesure, et il dit
   quel seuil WCAG s'applique à chaque emploi déclaré. Le jugement de la
   planche est B-4 ; sa légalité sera une condition du verrou de S6. */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const RACINE = path.resolve(fileURLToPath(new URL('../../../', import.meta.url)))
const planche = JSON.parse(fs.readFileSync(path.join(RACINE, 'fili.expression.json'), 'utf8'))

const canal = (v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
const luminance = (hex) => {
  const n = hex.replace('#', '')
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255)
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b)
}
const ratio = (a, b) => {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}

const t = (nom) => planche.tons[nom].valeur

/* Les couples réellement employés par le produit, et le seuil qui leur
   correspond. Un seuil de 3 pour un élément d'interface (WCAG 1.4.11),
   4,5 pour du texte courant (WCAG 1.4.3). */
const COUPLES = [
  ['encre',        'papier',       4.5, 'texte qui porte, sur le fond'],
  ['encre',        'papierCreux',  4.5, 'texte qui porte, sur un fond en retrait'],
  ['encreDouce',   'papier',       4.5, 'texte qui accompagne, sur le fond'],
  ['encreDouce',   'papierCreux',  4.5, 'texte qui accompagne, sur un fond en retrait'],
  ['verrou',       'papier',       4.5, 'libellé du verrouillé'],
  ['attente',      'papier',       4.5, "libellé de l'en cours"],
  ['signal',       'papier',       4.5, 'libellé du refus'],
  ['verrou',       'papierCreux',  4.5, 'libellé du verrouillé, en retrait'],
  ['attente',      'papierCreux',  4.5, "libellé de l'en cours, en retrait"],
  ['signal',       'papierCreux',  4.5, 'libellé du refus, en retrait'],
  ['encreInverse', 'signal',       4.5, 'texte posé sur un ton plein'],
  ['encreInverse', 'verrou',       4.5, 'texte posé sur un ton plein'],
  ['traitNet',     'papier',       3.0, "délimitation d'un contrôle (WCAG 1.4.11)"],
  ['traitNet',     'papierCreux',  3.0, "délimitation d'un contrôle, en retrait"],
  ['verrou',       'papier',       3.0, "pastille d'état — forme porteuse de sens"],
  ['attente',      'papier',       3.0, "pastille d'état — forme porteuse de sens"],
  ['signal',       'papier',       3.0, "pastille d'état — forme porteuse de sens"]
]

let echecs = 0
console.log('\nCONTRASTES DE LA PLANCHE — mesure, pas jugement\n')
for (const [a, b, seuil, emploi] of COUPLES) {
  const r = ratio(t(a), t(b))
  const ok = r >= seuil
  if (!ok) echecs++
  console.log(`  ${ok ? '✅' : '🔴'} ${r.toFixed(2).padStart(6)}:1  (seuil ${seuil})  ${a} / ${b} — ${emploi}`)
}
console.log(`\n  ${echecs === 0 ? '🟢 les couples déclarés tiennent leur seuil' : `🔴 ${echecs} couple(s) sous le seuil`}\n`)
console.log('  Ce que cette mesure ne dit pas : si la planche est juste. C\'est B-4.\n')
process.exit(echecs === 0 ? 0 : 1)
