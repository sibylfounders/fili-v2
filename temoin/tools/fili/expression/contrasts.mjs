/* Vérifie les couples de la palette calculée.
   Il n'y a plus de liste de couples écrite à la main : un couple est une
   propriété de la palette, pas une paire qu'on se souvient de mesurer. Ce
   contrôle ne cherche donc pas des fautes — il vérifie que le calcul a bien
   produit ce qu'il promettait. Un écart ici est un défaut du générateur. */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { contrast } from './color.mjs'

const ROOT = path.resolve(fileURLToPath(new URL('../../../', import.meta.url)))
const P = JSON.parse(fs.readFileSync(path.join(ROOT, 'fili/expression.json'), 'utf8'))
const L = JSON.parse(fs.readFileSync(path.join(ROOT, 'fili/palette.json'), 'utf8'))
const { text: TEXT, interface: UI } = P.$generation.pairs
const n = L.neutrals

const PAIRS = [
  ['ink', 'paper', TEXT, 'le texte qui porte'],
  ['ink', 'paperHollow', TEXT, 'le texte qui porte, en retrait'],
  ['ink', 'paperHover', TEXT, 'le texte qui porte, sous le pointeur'],
  ['ink', 'paperSelection', TEXT, 'le texte qui porte, sur une sélection'],
  ['inkSoft', 'paper', TEXT, "le texte qui accompagne"],
  ['inkSoft', 'paperHollow', TEXT, "le texte qui accompagne, en retrait"],
  ['inkSoft', 'paperSelection', TEXT, "le texte qui accompagne, sur une sélection"],
  ['inkInverse', 'scene', TEXT, 'le texte posé sur une scène'],
  ['inkInverse', 'ink', TEXT, "le texte du bouton principal"],
  ['accent', 'paper', TEXT, 'un lien'],
  ['strokeNet', 'paper', UI, "la délimitation d'un contrôle"],
  ['strokeNet', 'paperHollow', UI, "la délimitation d'un contrôle, en retrait"],
  ['accent', 'paper', UI, "l'anneau de focus"],
].map(([a, b, s, q]) => [n[a], n[b], s, `${a} / ${b} — ${q}`])

for (const [name, e] of Object.entries(L.states)) {
  PAIRS.push([e.on, e.surface, TEXT, `${name} · sur / surface — le libellé de l'état`])
  PAIRS.push([e.onFull, e.full, TEXT, `${name} · surPlein / plein — le libellé sur le ton plein`])
  PAIRS.push([e.stroke, n.paper, UI, `${name} · trait / papier — le contour de l'état`])
  PAIRS.push([e.full, n.paper, UI, `${name} · plein / papier — la pastille de l'état`])
}

let failures = 0
console.log(`\nCOUPLES DE LA PALETTE — primaire ${L.$primary}, teinte ${String(L.$hue)}°\n`)
for (const [a, b, threshold, what] of PAIRS) {
  const r = contrast(a, b)
  const ok = r >= threshold
  if (!ok) failures++
  console.log(`  ${ok ? '✅' : '🔴'} ${r.toFixed(2).padStart(6)}:1  (seuil ${String(threshold)})  ${what}`)
}
console.log(`\n  ${failures === 0 ? '🟢 tous les couples tiennent — le calcul a produit ce qu\'il promettait' : `🔴 ${String(failures)} couple(s) sous le seuil : le générateur est en faute`}\n`)
/* ── Le plafond, que personne ne mesure ──────────────────────────────────────
   Un seuil de contraste a toujours été lu comme un plancher. Google Fonts
   (« Introducing accessibility in typography ») écrit l'inverse aussi : des
   personnes ayant des troubles cognitifs peuvent éprouver une fatigue oculaire
   ou une distraction devant un très fort contraste — noir sur blanc à 21:1 est
   nommément cité — et la page propose 7:1, le niveau AAA, comme « bon milieu ».
   Ce contrôle ne bloque pas : le plafond n'est pas une exigence WCAG, c'est une
   recommandation, et son arbitrage appartient à l'Auteur. Mais il se mesure, et
   il est ici pour qu'il ne se décide pas en silence. */
/* Le plafond n'est plus un nombre écrit ici : il est déclaré à la planche, au
   même rang que les planchers, et l'encre est désormais CALCULÉE pour s'y
   arrêter. Le contrôle change donc de nature — il ne signale plus un arbitrage
   manquant, il vérifie qu'un arbitrage rendu tient. La tolérance existe parce
   qu'une recherche par dichotomie s'arrête juste AU-DESSUS de sa cible : elle
   ne pardonne pas un dépassement, elle reconnaît le pas de la recherche. */
const CEILING = P.$generation.pairs.comfort
const TOLERANCE = 0.1
const tops = PAIRS.filter(([a, b, threshold]) => threshold === TEXT && contrast(a, b) > CEILING + TOLERANCE)
console.log(`  PLAFOND DE CONFORT — ${String(CEILING)}:1 déclaré à la planche, ${String(tops.length)} dépassement(s)\n`)
for (const [a, b, , what] of tops)
  console.log(`  ⚠  ${contrast(a, b).toFixed(2).padStart(6)}:1  ${what}`)
if (tops.length > 0) {
  console.log("\n     Ce n'est pas une faute : aucune règle WCAG ne pose de plafond.")
  console.log('     Mais le projet en a déclaré un, et il est franchi.\n')
} else {
  console.log("  🟢 le plafond tient — le texte qui porte est calculé pour s'y arrêter,")
  console.log('     et non pour aller au plus franc que la famille permette.\n')
}

console.log("  Ce que cette mesure ne dit pas : si la palette est juste. C'est B-4.\n")
process.exit(failures === 0 ? 0 : 1)
