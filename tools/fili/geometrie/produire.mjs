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
  $loiDuRayon: "L'arrondi est un réglage à part, séparé de l'espace : un système peut être large et vif, ou serré et rond. MAIS LA MARGE LE COMMANDE — aucun arrondi ne dépasse la marge qui le porte, et le réglage de départ ne dépasse pas le double de la marge de base, point où la coque touche exactement la sienne. Décision d'Auteur du 2026-08-12. Les surfaces divisent leur rayon par deux à chaque profondeur. Un composant, lui, prend le TIERS du rayon racine — mais sa taille ne bouge pas, donc l'arrondi se rabat sur elle : jamais plus des deux tiers de sa marge verticale. Au-delà, le produit emploie la pastille — une forme, pas un arrondi. Décisions d'Auteur du 2026-08-11.",
  rayonRacine: socle.rayonRacine,
  pastilleExigee: socle.pastilleExigee,
  $loiDuCoin: "Un coin de rayon R réserve (1 − 1/√2) × R en diagonale : tout ce qui entre dans ce carré sort de la surface. Sur une surface la garantie est démontrable — le plafond de l'arrondi la rend inatteignable. Sur une pastille il n'y en a aucune : son rayon vaut la moitié de sa hauteur, donc au-delà d'une certaine hauteur la marge horizontale ne suffit plus. Décision d'Auteur du 2026-08-12, journal #073.",
  coin: socle.coin,
  $loiDesCibles: "Deux zones que le doigt doit distinguer gardent au moins l ecart minimal declare a la planche. La profondeur la plus fine qui le tient a toutes les largeurs est calculee ici : en dessous, une pile ne peut pas contenir de composants. Faute relevee et corrigee le 2026-08-12, journal 075.",
  profondeurMiniCibles: socle.profondeurMiniCibles,
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
   Base ${socle.entrees.base} · ratio ${socle.entrees.ratio} · arrondi de départ ${socle.rayonRacine}.
   TOUT EN REM, sauf la cible au doigt : la taille de texte de l'utilisateur commande.
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
