/* Produit les deux pièces de la géométrie : la pièce structurée que la
   configuration lit, et la feuille de variables que le navigateur lit.
   Aucune valeur n'est écrite ici. Tout descend du moteur. */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { derive, tokens, DEPTHS, AXES, ENTRIES_DEFAULTS } from './scale.mjs'

const ROOT = path.resolve(fileURLToPath(new URL('../../../', import.meta.url)))

const foundation = derive(ENTRIES_DEFAULTS)
const j = tokens(foundation)
const worstGap = Object.entries(j).reduce((a, [n, v]) => (v.gap > a.gap ? { name: n, ...v } : a), { gap: 0 })

const piece = {
  $comment: "La géométrie du produit, dérivée de l'Échelle Semantic Rhythm. PIÈCE GÉNÉRÉE — ne pas éditer à la main : tout vient de tools/fili/geometry/scale.mjs.",
  $authority: "Décision d'Auteur du 2026-08-11, journal #058. Loi reprise de claude/kit-creation-derivation.md (#050).",
  $verified: "Confrontée à la source le 2026-08-11 : l'outil de l'Auteur a été lu ligne à ligne. EXACTS et vérifiés — les trois marges [B, B/R, B/R²], les trois rayons [R0/2, R0/4, R0/8], le bord = B, l'adoucissement x²(3−2x) de 320 à 1440, et les CINQ amplitudes d'axe. Le texte et la cible sont désormais dérivés comme dans la source : corps stable, titres à un et deux pas, cible sur son axe propre.",
  $gapsDeclaredAll: "Deux points s'écartent encore de la source, et ils ne sont PAS corrigés sans arbitrage : (1) la source ne porte QU'UN écart, base ÷ 2, quand cette pièce en dérive un par profondeur ; (2) la source s'arrête à trois profondeurs quand cette pièce en porte cinq — 'page' et 'large' prolongent la raison géométrique vers le haut, pour un rythme entre sections que la source ne couvre pas. Les deux touchent 56 emplois dans les sept écrans : les corriger est une refonte, pas une correction.",
  entries: foundation.entries,
  $lawOfRadius: "L'arrondi est un réglage à part, séparé de l'espace : un système peut être large et vif, ou serré et rond. MAIS LA MARGE LE COMMANDE — aucun arrondi ne dépasse la marge qui le porte, et le réglage de départ ne dépasse pas le double de la marge de base, point où la coque touche exactement la sienne. Décision d'Auteur du 2026-08-12. Les surfaces divisent leur rayon par deux à chaque profondeur. Un composant, lui, prend le TIERS du rayon racine — mais sa taille ne bouge pas, donc l'arrondi se rabat sur elle : jamais plus des deux tiers de sa marge verticale. Au-delà, le produit emploie la pastille — une forme, pas un arrondi. Décisions d'Auteur du 2026-08-11.",
  radiusRoot: foundation.radiusRoot,
  dotRequired: foundation.dotRequired,
  $lawOfCorner: "Un coin de rayon R réserve (1 − 1/√2) × R en diagonale : tout ce qui entre dans ce carré sort de la surface. Sur une surface la garantie est démontrable — le plafond de l'arrondi la rend inatteignable. Sur une pastille il n'y en a aucune : son rayon vaut la moitié de sa hauteur, donc au-delà d'une certaine hauteur la marge horizontale ne suffit plus. Décision d'Auteur du 2026-08-12, journal #073.",
  corner: foundation.corner,
  $lawOfTargets: "Deux zones que le doigt doit distinguer gardent au moins l ecart minimal declare a la planche. La profondeur la plus fine qui le tient a toutes les largeurs est calculee ici : en dessous, une pile ne peut pas contenir de composants. Faute relevee et corrigee le 2026-08-12, journal 075.",
  depthMiniTargets: foundation.depthMiniTargets,
  $lawOfTextTracking: "Un article n est pas un ecran d outil : l ecart entre deux paragraphes se juge en multiples du corps. La recommandation publique tient entre une et une fois et demie le corps ; confronte a l echelle, un seul niveau y tombe. Le moteur refuse de statuer si la profondeur declaree passe sous le plancher. Journal 079.",
  prose: foundation.prose,
  depths: DEPTHS,
  axes: AXES,
  margins: foundation.margins,
  gaps: foundation.gaps,
  radii: foundation.radii,
  edge: foundation.edge,
  text: foundation.text,
  control: foundation.control,
  $priceOfThereFluidity: {
    $comment: "Le générateur adoucit sa courbe ; le CSS ne sait qu'interpoler droit. Écart mesuré tous les 10 px de 320 à 1440, pas supposé.",
    worst: worstGap.name,
    gapPx: worstGap.gap,
    aWidth: worstGap.width,
  },
  tokens: Object.fromEntries(Object.entries(j).map(([n, v]) => [n, { axis: v.axis, base: v.base, bottom: v.bottom, top: v.top, css: v.css }])),
}

fs.writeFileSync(path.join(ROOT, 'fili/geometry.json'), JSON.stringify(piece, null, 2) + '\n')

const lines = Object.entries(j).map(([n, v]) => `  --rr-${n}: ${v.css};`)
const css = `/* PIÈCE GÉNÉRÉE — ne pas éditer à la main.
   Produite par tools/fili/geometrie/produire.mjs depuis l'Échelle Semantic Rhythm.
   Base ${foundation.entries.base} · ratio ${foundation.entries.ratio} · arrondi de départ ${foundation.radiusRoot}.
   TOUT EN REM, sauf la cible au doigt : la taille de texte de l'utilisateur commande.
   Chaque token est fluide de 320 à 1440 px. Les deux axes ne bougent pas ensemble :
   l'horizontal va de ${AXES.inline.min} à ${AXES.inline.max}, le vertical de ${AXES.block.min} à ${AXES.block.max},
   le texte de ${AXES.type.min} à ${AXES.type.max}, les rayons de ${AXES.radius.min} à ${AXES.radius.max},
   les contrôles de ${AXES.control.min} à ${AXES.control.max}. */
:root {
${lines.join('\n')}
}
`
fs.writeFileSync(path.join(ROOT, 'src/geometry.generated.css'), css)

console.log(`geometrie: ${Object.keys(j).length} tokens produits · pire ecart ${worstGap.gap} px sur ${worstGap.name} a ${worstGap.width} px`)
