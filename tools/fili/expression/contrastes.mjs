/* Vérifie les couples de la palette calculée.
   Il n'y a plus de liste de couples écrite à la main : un couple est une
   propriété de la palette, pas une paire qu'on se souvient de mesurer. Ce
   contrôle ne cherche donc pas des fautes — il vérifie que le calcul a bien
   produit ce qu'il promettait. Un écart ici est un défaut du générateur. */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { contraste } from './couleur.mjs'

const RACINE = path.resolve(fileURLToPath(new URL('../../../', import.meta.url)))
const P = JSON.parse(fs.readFileSync(path.join(RACINE, 'fili.expression.json'), 'utf8'))
const L = JSON.parse(fs.readFileSync(path.join(RACINE, 'fili.palette.json'), 'utf8'))
const { texte: TEXTE, interface: UI } = P.$generation.couples
const n = L.neutres

const COUPLES = [
  ['encre', 'papier', TEXTE, 'le texte qui porte'],
  ['encre', 'papierCreux', TEXTE, 'le texte qui porte, en retrait'],
  ['encre', 'papierSurvol', TEXTE, 'le texte qui porte, sous le pointeur'],
  ['encre', 'papierSelection', TEXTE, 'le texte qui porte, sur une sélection'],
  ['encreDouce', 'papier', TEXTE, "le texte qui accompagne"],
  ['encreDouce', 'papierCreux', TEXTE, "le texte qui accompagne, en retrait"],
  ['encreDouce', 'papierSelection', TEXTE, "le texte qui accompagne, sur une sélection"],
  ['encreInverse', 'scene', TEXTE, 'le texte posé sur une scène'],
  ['encreInverse', 'encre', TEXTE, "le texte du bouton principal"],
  ['accent', 'papier', TEXTE, 'un lien'],
  ['traitNet', 'papier', UI, "la délimitation d'un contrôle"],
  ['traitNet', 'papierCreux', UI, "la délimitation d'un contrôle, en retrait"],
  ['accent', 'papier', UI, "l'anneau de focus"],
].map(([a, b, s, q]) => [n[a], n[b], s, `${a} / ${b} — ${q}`])

for (const [nom, e] of Object.entries(L.etats)) {
  COUPLES.push([e.sur, e.surface, TEXTE, `${nom} · sur / surface — le libellé de l'état`])
  COUPLES.push([e.surPlein, e.plein, TEXTE, `${nom} · surPlein / plein — le libellé sur le ton plein`])
  COUPLES.push([e.trait, n.papier, UI, `${nom} · trait / papier — le contour de l'état`])
  COUPLES.push([e.plein, n.papier, UI, `${nom} · plein / papier — la pastille de l'état`])
}

let echecs = 0
console.log(`\nCOUPLES DE LA PALETTE — primaire ${L.$primaire}, teinte ${String(L.$teinte)}°\n`)
for (const [a, b, seuil, quoi] of COUPLES) {
  const r = contraste(a, b)
  const ok = r >= seuil
  if (!ok) echecs++
  console.log(`  ${ok ? '✅' : '🔴'} ${r.toFixed(2).padStart(6)}:1  (seuil ${String(seuil)})  ${quoi}`)
}
console.log(`\n  ${echecs === 0 ? '🟢 tous les couples tiennent — le calcul a produit ce qu\'il promettait' : `🔴 ${String(echecs)} couple(s) sous le seuil : le générateur est en faute`}\n`)
/* ── Le plafond, que personne ne mesure ──────────────────────────────────────
   Un seuil de contraste a toujours été lu comme un plancher. Google Fonts
   (« Introducing accessibility in typography ») écrit l'inverse aussi : des
   personnes ayant des troubles cognitifs peuvent éprouver une fatigue oculaire
   ou une distraction devant un très fort contraste — noir sur blanc à 21:1 est
   nommément cité — et la page propose 7:1, le niveau AAA, comme « bon milieu ».
   Ce contrôle ne bloque pas : le plafond n'est pas une exigence WCAG, c'est une
   recommandation, et son arbitrage appartient à l'Auteur. Mais il se mesure, et
   il est ici pour qu'il ne se décide pas en silence. */
const PLAFOND = 12
const hauts = COUPLES.filter(([a, b, seuil]) => seuil === TEXTE && contraste(a, b) > PLAFOND)
console.log(`  PLAFOND DE CONFORT — au-delà de ${String(PLAFOND)}:1, ${String(hauts.length)} couple(s) de texte\n`)
for (const [a, b, , quoi] of hauts)
  console.log(`  ⚠  ${contraste(a, b).toFixed(2).padStart(6)}:1  ${quoi}`)
if (hauts.length > 0) {
  console.log("\n     Ce n'est pas une faute : aucune règle WCAG ne pose de plafond.")
  console.log("     C'est un arbitrage non rendu. Le milieu recommandé est 7:1.\n")
}

console.log("  Ce que cette mesure ne dit pas : si la palette est juste. C'est B-4.\n")
process.exit(echecs === 0 ? 0 : 1)
