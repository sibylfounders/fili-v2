/* Le lexique — la correspondance entre les deux langues.
 *
 * L'Échelle Semantic Rhythm (l'outil de l'Auteur) et Fili (le dépôt) portent les
 * mêmes idées sous d'autres noms. Ce fichier est la table de traduction, et il
 * produit deux pièces :
 *   fili/lexique.json          — la table, lisible par une machine
 *   src/lexique.genere.css     — les alias, pour qu'un écran écrit dans une
 *                                langue s'habille avec les jetons de l'autre
 *
 * RÈGLE — la table ne déclare aucune valeur. Chaque entrée pointe sur un jeton
 * qui existe déjà dans fili/geometrie.json, et le générateur REFUSE DE STATUER
 * si l'un d'eux manque. Un lexique qui invente un mot ne traduit plus, il ment.
 *
 * node tools/fili/lexique/produire.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const RACINE = path.resolve(fileURLToPath(new URL('../../../', import.meta.url)))
const geo = JSON.parse(fs.readFileSync(path.join(RACINE, 'fili/geometrie.json'), 'utf8'))

/* La table. Relevée dans l'outil de l'Auteur le 2026-08-11, dans la charge utile
   qu'il envoie à ses écrans de démonstration (rrLatestTokens). */
const TABLE = [
  { outil: '--pagePadX', fili: 'inline-marge-coque', quoi: "la marge horizontale du premier niveau" },
  { outil: '--pagePadY', fili: 'block-marge-coque', quoi: "la marge verticale du premier niveau" },
  { outil: '--cardPadX', fili: 'inline-marge-carte', quoi: "la marge horizontale d'une carte" },
  { outil: '--cardPadY', fili: 'block-marge-carte', quoi: "la marge verticale d'une carte" },
  { outil: '--subPadX', fili: 'inline-marge-detail', quoi: "la marge horizontale d'un détail" },
  { outil: '--subPadY', fili: 'block-marge-detail', quoi: "la marge verticale d'un détail" },
  { outil: '--gapInline', fili: 'inline-ecart-coque', quoi: "l'écart horizontal entre deux voisins" },
  { outil: '--gapBlock', fili: 'block-ecart-coque', quoi: "l'écart vertical entre deux voisins" },
  { outil: '--cardR', fili: 'radius-coque', quoi: "le rayon du premier niveau" },
  { outil: '--ctl', fili: 'radius-coque', quoi: "le rayon d'un contrôle — même cran que la carte" },
  { outil: '--subR', fili: 'radius-carte', quoi: "le rayon du deuxième niveau" },
  { outil: '--subsubR', fili: 'radius-detail', quoi: "le rayon du troisième niveau" },
  { outil: '--controlSize', fili: 'control-cible', quoi: "la hauteur d'un contrôle" },
  { outil: '--heading-2', fili: 'type-titre2', quoi: "un titre à un pas du corps" },
  { outil: '--heading-1', fili: 'type-titre1', quoi: "un titre à deux pas du corps" },
]

/* Ce qui ne se traduit pas. On le nomme plutôt que de bricoler un équivalent. */
const INTRADUISIBLES = [
  { cote: 'outil', nom: '--pageR', quoi: "le rayon du cadre de la démonstration — c'est le rayon racine, et Fili ne l'expose pas comme jeton : chez lui le rayon racine EST la marge, il n'a pas de nom propre." },
  { cote: 'outil', nom: '--gap', quoi: "la moyenne de l'écart horizontal et vertical. Fili refuse de la produire : une valeur qui porte les deux axes à la fois mélange deux échelles, et c'est précisément ce que sa règle des espaces interdit." },
  { cote: 'outil', nom: '--type-scale', quoi: "l'intervalle des titres. Ce n'est pas un jeton mais une décision d'entrée : elle vaut " + (geo.entrees?.intervalleTitres ?? '—') + " chez Fili." },
  { cote: 'outil', nom: 'fontSize', quoi: "la taille du corps, envoyée à part. Chez Fili c'est le jeton type-corps." },
  { cote: 'fili', nom: 'inline/block-marge-page · -large', quoi: "deux profondeurs au-dessus de la coque, pour le rythme entre sections. L'Échelle s'arrête à trois niveaux : l'outil n'a rien à leur opposer." },
  { cote: 'fili', nom: 'inline/block-ecart-carte · -detail', quoi: "un écart par profondeur. L'outil n'en porte qu'un seul, et ses deux axes en descendent." },
  { cote: 'fili', nom: 'inline-bord · block-bord', quoi: "le bord structurel. L'outil le calcule mais ne l'envoie pas à ses écrans." },
]

/* Refus de statuer : chaque cible doit exister. */
const absents = TABLE.filter((e) => !geo.jetons?.[e.fili]).map((e) => e.fili)
if (absents.length) {
  console.error(`\n  🔴 REFUS DE STATUER — jetons introuvables dans fili/geometrie.json :\n     ${absents.join(', ')}\n`)
  process.exit(2)
}

const piece = {
  $comment: "Le lexique entre l'Échelle Semantic Rhythm et Fili. PIÈCE GÉNÉRÉE — ne pas éditer à la main : tout vient de tools/fili/lexique/produire.mjs.",
  $regle: "Aucune valeur n'est déclarée ici. Chaque entrée pointe sur un jeton de fili/geometrie.json, et la génération refuse de statuer si l'un manque.",
  $releve: "Table relevée dans l'outil de l'Auteur le 2026-08-11 — la charge utile envoyée à ses écrans de démonstration.",
  $arbitrage: {
    tranche: "Les noms de Fili restent la référence. Ceux de l'outil sont des alias.",
    date: "2026-08-11",
    motif: "Ce n'est pas un arbitrage de goût : les noms de l'outil se lisent mieux, et c'est reconnu. C'est un fait de mécanique. La règle qui attrape un jeton horizontal posé sur une propriété verticale se déclenche sur les préfixes 'inline-' et 'block-' : le nom N'EST PAS une convention d'écriture, c'est la prise du contrôle. Les renommer, c'est réécrire une règle verrouillée, le registre qu'elle lit, la configuration des utilitaires et les emplois dans les écrans — pour un gain de confort.",
    cePermet: "Dans une feuille de style écrite à la main, les noms de l'outil sont utilisables tels quels : src/lexique.genere.css les fait pointer sur les jetons du dépôt.",
    ceQuOnRefuse: "Ajouter les noms de l'outil comme classes utilitaires en plus de celles de Fili. Ce serait deux façons légales d'écrire la même valeur, et c'est ce que ce système interdit partout ailleurs. Une équivalence déclarée dans un lexique n'est pas un doublon ; deux classes qui font la même chose en sont un.",
    seRouvre: "Par une entrée de journal, jamais en silence. Le coût de la bascule est chiffré : la règle des espaces, le registre, la configuration, et les emplois dans les sept écrans.",
  },
  correspondances: TABLE.map((e) => ({
    outil: e.outil,
    fili: `--rr-${e.fili}`,
    quoi: e.quoi,
    valeur: geo.jetons[e.fili].css,
    socle: geo.jetons[e.fili].base,
  })),
  intraduisibles: INTRADUISIBLES,
}
fs.writeFileSync(path.join(RACINE, 'fili/lexique.json'), JSON.stringify(piece, null, 2) + '\n')

const css = `/* PIÈCE GÉNÉRÉE — ne pas éditer à la main.
   Produite par tools/fili/lexique/produire.mjs.

   Les alias de l'Échelle Semantic Rhythm. Un écran écrit dans la langue de
   l'outil de l'Auteur s'habille ici avec les jetons de Fili, sans être réécrit :
   les noms changent, les valeurs restent celles du dépôt.

   Ce qui ne se traduit pas est nommé dans fili/lexique.json — jamais bricolé. */
:root {
${TABLE.map((e) => `  ${e.outil}: var(--rr-${e.fili}); /* ${e.quoi} */`).join('\n')}

  /* L'intervalle des titres n'est pas un jeton mais une décision d'entrée. */
  --type-scale: ${geo.entrees?.intervalleTitres ?? 1.25};
}
`
fs.writeFileSync(path.join(RACINE, 'src/lexique.genere.css'), css)

console.log(`lexique: ${TABLE.length} correspondances · ${INTRADUISIBLES.length} intraduisibles nommés`)
