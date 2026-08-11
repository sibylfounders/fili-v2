/* Calcule la palette depuis la primaire et les règles de la planche.
   Rien n'est saisi ici : ce fichier applique une règle, il ne choisit pas.
   Regénérer et constater un diff vide est la preuve que la palette est
   reproductible — ce qu'une liste d'hexadécimaux écrits à la main n'est jamais. */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { hexVersLch, lchVersHex, contraste, contrastante, laPlusDouce, partenaire } from './couleur.mjs'

const RACINE = path.resolve(fileURLToPath(new URL('../../../', import.meta.url)))
const P = JSON.parse(fs.readFileSync(path.join(RACINE, 'fili/expression.json'), 'utf8'))
const G = P.$generation

const [, , TEINTE] = hexVersLch(P.$primaire.valeur)
const CN = G.neutres.chroma
const CIBLE = G.couples.texte
const CIBLE_UI = G.couples.interface
/* Le plafond de confort : au-delà, un texte ne gagne plus en lisibilité, il
   gagne en dureté. C'est un seuil déclaré comme les autres, pas un goût. */
const CONFORT = G.couples.confort

/* ── Les surfaces neutres : une échelle de gris à la teinte de la primaire ── */
const PALIERS = {
  papier: 1.0, papierCreux: 0.968, papierSurvol: 0.928, papierSelection: 0.892, scene: 0.245,
}
const surfaces = Object.fromEntries(
  Object.entries(PALIERS).map(([n, L]) => [n, lchVersHex([L, n === 'papier' ? 0 : CN, TEINTE])])
)

/* ── Les encres : chacune est la partenaire d'une surface, pas un choix ───── */
/* L'encre qui porte ne va PLUS au bout : elle s'arrête au plafond de confort.
   Elle reste la plus légère qui tienne son seuil — mais le seuil visé est celui
   du confort, très au-dessus du plancher, et non l'extrême que la famille
   permet. Celle qui accompagne, elle, ne vise que le plancher : c'est ce qui
   distingue un texte qui porte d'un texte qui accompagne. */
const encre = laPlusDouce(surfaces.papier, [CN, TEINTE], CONFORT)
const encreDouce = laPlusDouce(surfaces.papierSelection, [CN, TEINTE], CIBLE)
/* Sur la scène, la symétrie exacte : la moins claire qui tienne le confort. */
const encreInverse = partenaire(surfaces.scene, [CN, TEINTE], CONFORT, { versLeBas: false })
/* Un contrôle désactivé est hors seuil par exception WCAG 1.4.3 : sa clarté est
   posée, pas calculée, et l'exception est déclarée à la planche. */
const encreEteinte = lchVersHex([0.72, CN, TEINTE])
/* Un filet décoratif ne porte aucun sens seul : lui non plus n'a pas de seuil. */
const trait = lchVersHex([0.9, CN, TEINTE])
const traitNet = laPlusDouce(surfaces.papierCreux, [CN, TEINTE], CIBLE_UI)

/* ── Les états : teinte conventionnelle, tirée vers la primaire, bornée ───── */
const ecartCourt = (de, vers) => (((vers - de + 180) % 360) - 180)
const harmoniser = (ancre) => {
  const d = ecartCourt(ancre, TEINTE) * G.harmonisation.attraction
  const borne = G.harmonisation.bande
  return (ancre + Math.max(-borne, Math.min(borne, d)) + 360) % 360
}

const etats = {}
for (const [nom, ancre] of Object.entries(G.harmonisation.ancres)) {
  const H = ancre === 'primaire' ? TEINTE : harmoniser(ancre)
  const surface = lchVersHex([0.955, 0.04, H])
  const plein = lchVersHex([0.45, 0.16, H])
  etats[nom] = {
    teinte: Number(H.toFixed(1)),
    ancre: ancre === 'primaire' ? Number(TEINTE.toFixed(1)) : ancre,
    surface,
    /* La plus douce qui tienne 7:1 : au-delà l'encre vire au noir et la teinte
       de l'état — la seule chose qu'elle avait à dire — disparaît. */
    sur: laPlusDouce(surface, [0.13, H], 7),
    plein,
    surPlein: contrastante(plein, [0.02, H], CIBLE, 'clair'),
    trait: laPlusDouce(surfaces.papier, [0.1, H], CIBLE_UI),
  }
}

const palette = {
  $genere: 'GÉNÉRÉ par tools/fili/expression/palette.mjs depuis fili/expression.json. Ne pas éditer à la main : la prochaine génération écraserait la retouche, et une valeur retouchée serait une valeur sans provenance.',
  $primaire: P.$primaire.valeur,
  $teinte: Number(TEINTE.toFixed(1)),
  $espace: G.espace,
  neutres: { ...surfaces, encre, encreDouce, encreEteinte, encreInverse, trait, traitNet, accent: P.$primaire.valeur },
  etats,
}
fs.writeFileSync(path.join(RACINE, 'fili/palette.json'), JSON.stringify(palette, null, 2) + '\n')

console.log(`\nPALETTE CALCULÉE — primaire ${P.$primaire.valeur}, teinte ${TEINTE.toFixed(1)}°, chroma des neutres ${String(CN)}\n`)
console.log('  Surfaces et encres')
for (const [n, v] of Object.entries(palette.neutres)) console.log(`    ${n.padEnd(16)} ${v}`)
console.log('\n  États — ancre → teinte harmonisée')
for (const [n, v] of Object.entries(etats))
  console.log(`    ${n.padEnd(12)} ${String(v.ancre).padStart(5)}° → ${String(v.teinte).padStart(5)}°   surface ${v.surface} · sur ${v.sur} (${contraste(v.sur, v.surface).toFixed(2)}:1) · plein ${v.plein} · dessus ${v.surPlein} (${contraste(v.surPlein, v.plein).toFixed(2)}:1)`)
console.log('\n  → fili/palette.json\n')
