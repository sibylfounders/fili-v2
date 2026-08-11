/* Verse dans le dépôt les tracés du jeu d'icônes déclaré à la planche.
   On ne dessine pas d'icônes : on en emprunte à un jeu existant, et on grave
   d'où elles viennent. Le tracé versé ici est une COPIE datée d'une source
   nommée — pas une création, et pas une dépendance de rendu : Fili doit
   s'ouvrir hors ligne.

   Usage, depuis un poste qui a accès au registre de paquets :
     npm i -D lucide-static
     node scripts/vendorer-icones.mjs

   Le fichier produit remplace le dépannage dessiné à la main, et la planche
   cesse de porter sa dette. */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const RACINE = path.resolve(fileURLToPath(new URL('../', import.meta.url)))
const PAQUET = path.join(RACINE, 'node_modules/lucide-static')

if (!fs.existsSync(PAQUET)) {
  console.log('\n🔴 REFUS DE VERSER — le paquet « lucide-static » n\'est pas installé.\n')
  console.log('   npm i -D lucide-static && node scripts/vendorer-icones.mjs\n')
  console.log('   Rien n\'a été écrit : verser un tracé inventé sous le nom d\'un jeu')
  console.log('   existant serait un faux, et il serait indétectable.\n')
  process.exit(2)
}

const planche = JSON.parse(fs.readFileSync(path.join(RACINE, 'fili/expression.json'), 'utf8'))
const meta = JSON.parse(fs.readFileSync(path.join(PAQUET, 'package.json'), 'utf8'))

/* On extrait des FORMES, pas du balisage : une chaîne de balisage réinjectée
   serait un échappement, et le garde-fou l'interdit à raison. */
const BALISES = ['path', 'circle', 'line', 'rect', 'polyline', 'polygon', 'ellipse']
const formes = (svg) => {
  const out = []
  for (const m of svg.matchAll(/<(\w+)([^>]*)\/?>/g)) {
    const [, tag, attrs] = m
    if (!BALISES.includes(tag)) continue
    const f = { t: tag }
    for (const a of attrs.matchAll(/([\w-]+)="([^"]*)"/g)) {
      const v = Number(a[2])
      f[a[1]] = Number.isNaN(v) ? a[2] : v
    }
    out.push(f)
  }
  return out
}

const traces = {}
const manques = []
for (const [etat, v] of Object.entries(planche.icones)) {
  if (etat.startsWith('$')) continue
  const f = path.join(PAQUET, 'icons', `${v.lucide}.svg`)
  if (!fs.existsSync(f)) { manques.push(`${etat} → ${v.lucide}`); continue }
  traces[etat] = formes(fs.readFileSync(f, 'utf8'))
}

if (manques.length > 0) {
  console.log(`\n🔴 REFUS DE VERSER — ${String(manques.length)} correspondance(s) sans icône dans le jeu :\n`)
  manques.forEach((m) => console.log('   ' + m))
  console.log('\n   Corrigez la correspondance dans fili/expression.json. Rien n\'a été écrit.\n')
  process.exit(1)
}

fs.writeFileSync(path.join(RACINE, 'fili/icones.json'), JSON.stringify({
  $comment: "Formes versées depuis le jeu déclaré à la planche, en données structurées et non en balisage. Copie datée d'une source nommée, pas une création. Regénérer : node scripts/vendorer-icones.mjs",
  $source: 'lucide-static',
  $version: meta.version,
  $licence: meta.license,
  $grille: 24,
  $trait: 2,
  formes: traces,
}, null, 2) + '\n')
console.log(`\n🟢 ${String(Object.keys(traces).length)} icônes versées depuis lucide-static ${meta.version} (${meta.license}).\n`)
