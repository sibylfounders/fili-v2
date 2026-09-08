/* Calcule la palette depuis la primaire et les règles de la planche.
   Rien n'est saisi ici : ce fichier applique une règle, il ne choisit pas.
   Regénérer et constater un diff vide est la preuve que la palette est
   reproductible — ce qu'une liste d'hexadécimaux écrits à la main n'est jamais. */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { hexToLch, lchToHex, contrast, contrasting, therePlusSoft, partner } from './color.mjs'

const ROOT = path.resolve(fileURLToPath(new URL('../../../', import.meta.url)))
const P = JSON.parse(fs.readFileSync(path.join(ROOT, 'fili/expression.json'), 'utf8'))
const G = P.$generation

const [, , HUE] = hexToLch(P.$primary.value)
const CN = G.neutrals.chroma
const TARGET = G.pairs.text
const TARGET_UI = G.pairs.interface
/* Le plafond de confort : au-delà, un texte ne gagne plus en lisibilité, il
   gagne en dureté. C'est un seuil déclaré comme les autres, pas un goût. */
const COMFORT = G.pairs.comfort
/* Le cran du milieu : ni la donnee, ni la reformulation. */
const FRAMING = G.pairs.framing

/* ── Les surfaces neutres : une échelle de gris à la teinte de la primaire ── */
const TIERS = {
  paper: 1.0, paperHollow: 0.968, paperHover: 0.928, paperSelection: 0.892, scene: 0.245,
}
const surfaces = Object.fromEntries(
  Object.entries(TIERS).map(([n, L]) => [n, lchToHex([L, n === 'paper' ? 0 : CN, HUE])])
)

/* ── Les encres : chacune est la partenaire d'une surface, pas un choix ───── */
/* L'encre qui porte ne va PLUS au bout : elle s'arrête au plafond de confort.
   Elle reste la plus légère qui tienne son seuil — mais le seuil visé est celui
   du confort, très au-dessus du plancher, et non l'extrême que la famille
   permet. Celle qui accompagne, elle, ne vise que le plancher : c'est ce qui
   distingue un texte qui porte d'un texte qui accompagne. */
const ink = therePlusSoft(surfaces.paper, [CN, HUE], COMFORT)
const inkSoft = therePlusSoft(surfaces.paperSelection, [CN, HUE], FRAMING)
/* Le troisieme cran : la reformulation. La plus legere qui tienne encore le
   plancher — en dessous, un texte cesse d'etre lisible, et un role de plus ne
   vaut jamais une ligne illisible. */
const inkLight = therePlusSoft(surfaces.paperSelection, [CN, HUE], TARGET)
/* Sur la scène, la symétrie exacte : la moins claire qui tienne le confort. */
const inkInverse = partner(surfaces.scene, [CN, HUE], COMFORT, { toTheBottom: false })
/* Un contrôle désactivé est hors seuil par exception WCAG 1.4.3 : sa clarté est
   posée, pas calculée, et l'exception est déclarée à la planche. */
const inkOff = lchToHex([0.72, CN, HUE])
/* Un filet décoratif ne porte aucun sens seul : lui non plus n'a pas de seuil. */
const stroke = lchToHex([0.9, CN, HUE])
const strokeNet = therePlusSoft(surfaces.paperHollow, [CN, HUE], TARGET_UI)

/* ── Les états : teinte conventionnelle, tirée vers la primaire, bornée ───── */
const gapShort = (of, to) => (((to - of + 180) % 360) - 180)
const harmonize = (anchor) => {
  const d = gapShort(anchor, HUE) * G.harmonization.attraction
  const bound = G.harmonization.band
  return (anchor + Math.max(-bound, Math.min(bound, d)) + 360) % 360
}

const states = {}
for (const [name, anchor] of Object.entries(G.harmonization.anchors)) {
  const H = anchor === 'primary' ? HUE : harmonize(anchor)
  const surface = lchToHex([0.955, 0.04, H])
  const full = lchToHex([0.45, 0.16, H])
  states[name] = {
    hue: Number(H.toFixed(1)),
    anchor: anchor === 'primary' ? Number(HUE.toFixed(1)) : anchor,
    surface,
    /* La plus douce qui tienne 7:1 : au-delà l'encre vire au noir et la teinte
       de l'état — la seule chose qu'elle avait à dire — disparaît. */
    on: therePlusSoft(surface, [0.13, H], 7),
    full,
    onFull: contrasting(full, [0.02, H], TARGET, 'light'),
    stroke: therePlusSoft(surfaces.paper, [0.1, H], TARGET_UI),
  }
}

const palette = {
  $generated: 'GÉNÉRÉ par tools/fili/expression/palette.mjs depuis fili/expression.json. Ne pas éditer à la main : la prochaine génération écraserait la retouche, et une valeur retouchée serait une valeur sans provenance.',
  $primary: P.$primary.value,
  $hue: Number(HUE.toFixed(1)),
  $space: G.space,
  neutrals: { ...surfaces, ink, inkSoft, inkLight, inkOff, inkInverse, stroke, strokeNet, accent: P.$primary.value },
  states,
}
fs.writeFileSync(path.join(ROOT, 'fili/palette.json'), JSON.stringify(palette, null, 2) + '\n')

console.log(`\nPALETTE CALCULÉE — primaire ${P.$primary.value}, teinte ${HUE.toFixed(1)}°, chroma des neutres ${String(CN)}\n`)
console.log('  Surfaces et encres')
for (const [n, v] of Object.entries(palette.neutrals)) console.log(`    ${n.padEnd(16)} ${v}`)
console.log('\n  États — ancre → teinte harmonisée')
for (const [n, v] of Object.entries(states))
  console.log(`    ${n.padEnd(12)} ${String(v.anchor).padStart(5)}° → ${String(v.hue).padStart(5)}°   surface ${v.surface} · sur ${v.on} (${contrast(v.on, v.surface).toFixed(2)}:1) · plein ${v.full} · dessus ${v.onFull} (${contrast(v.onFull, v.full).toFixed(2)}:1)`)
console.log('\n  → fili/palette.json\n')
