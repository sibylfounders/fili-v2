/* Produit les deux pièces de la géométrie : la pièce structurée que la
   configuration lit, et la feuille de variables que le navigateur lit.
   Aucune valeur n'est écrite ici. Tout descend du moteur. */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { deriver, jetons, PROFONDEURS, AXES, ENTREES_DEFAUT } from './echelle.mjs'

const RACINE = path.resolve(fileURLToPath(new URL('../../../', import.meta.url)))

const socle = deriver(ENTREES_DEFAUT)
const j = jetons(socle)
const pireEcart = Object.entries(j).reduce((a, [n, v]) => (v.ecart > a.ecart ? { nom: n, ...v } : a), { ecart: 0 })

const piece = {
  $comment: "La géométrie du produit, dérivée de l'Échelle Semantic Rhythm. PIÈCE GÉNÉRÉE — ne pas éditer à la main : tout vient de tools/fili/geometrie/echelle.mjs.",
  $autorite: "Décision d'Auteur du 2026-08-11, journal #058. Loi reprise de claude/kit-creation-derivation.md (#050).",
  $verifie: "Confrontée à la source le 2026-08-11 : l'outil de l'Auteur a été lu ligne à ligne. EXACTS et vérifiés — les trois marges [B, B/R, B/R²], les trois rayons [R0/2, R0/4, R0/8], le bord = B, l'adoucissement x²(3−2x) de 320 à 1440, et les CINQ amplitudes d'axe. Le texte et la cible sont désormais dérivés comme dans la source : corps stable, titres à un et deux pas, cible sur son axe propre.",
  $ecartsDeclares: "Deux points s'écartent encore de la source, et ils ne sont PAS corrigés sans arbitrage : (1) la source ne porte QU'UN écart, base ÷ 2, quand cette pièce en dérive un par profondeur ; (2) la source s'arrête à trois profondeurs quand cette pièce en porte cinq — 'page' et 'large' prolongent la raison géométrique vers le haut, pour un rythme entre sections que la source ne couvre pas. Les deux touchent 56 emplois dans les sept écrans : les corriger est une refonte, pas une correction.",
  entrees: socle.entrees,
  $loiDuRayon: "Le rayon EST la marge — décision d'Auteur du 2026-08-11. La marge est la source ; il n'y a plus de rayon de départ à choisir. La loi de l'octave de l'Échelle est conservée : divisé par deux à chaque profondeur.",
  rayonRacine: socle.rayonRacine,
  profondeurs: PROFONDEURS,
  axes: AXES,
  marges: socle.marges,
  ecarts: socle.ecarts,
  rayons: socle.rayons,
  bord: socle.bord,
  texte: socle.texte,
  controle: socle.controle,
  $prixDeLaFluidite: {
    $comment: "Le générateur adoucit sa courbe ; le CSS ne sait qu'interpoler droit. Écart mesuré tous les 10 px de 320 à 1440, pas supposé.",
    pire: pireEcart.nom,
    ecartPx: pireEcart.ecart,
    aLargeur: pireEcart.largeur,
  },
  jetons: Object.fromEntries(Object.entries(j).map(([n, v]) => [n, { axe: v.axe, base: v.base, bas: v.bas, haut: v.haut, css: v.css }])),
}

fs.writeFileSync(path.join(RACINE, 'fili/geometrie.json'), JSON.stringify(piece, null, 2) + '\n')

const lignes = Object.entries(j).map(([n, v]) => `  --rr-${n}: ${v.css};`)
const css = `/* PIÈCE GÉNÉRÉE — ne pas éditer à la main.
   Produite par tools/fili/geometrie/produire.mjs depuis l'Échelle Semantic Rhythm.
   Base ${socle.entrees.base} · ratio ${socle.entrees.ratio} · rayon racine ${socle.rayonRacine} (= la marge : le rayon descend d'elle).
   Chaque jeton est fluide de 320 à 1440 px. Les deux axes ne bougent pas ensemble :
   l'horizontal va de ${AXES.inline.min} à ${AXES.inline.max}, le vertical de ${AXES.block.min} à ${AXES.block.max},
   le texte de ${AXES.type.min} à ${AXES.type.max}, les rayons de ${AXES.radius.min} à ${AXES.radius.max},
   les contrôles de ${AXES.control.min} à ${AXES.control.max}. */
:root {
${lignes.join('\n')}
}
`
fs.writeFileSync(path.join(RACINE, 'src/geometrie.genere.css'), css)

console.log(`geometrie: ${Object.keys(j).length} jetons produits · pire ecart ${pireEcart.ecart} px sur ${pireEcart.nom} a ${pireEcart.largeur} px`)
