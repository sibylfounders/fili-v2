/* Le lexique — la correspondance entre les deux langues.
 *
 * L'Échelle Semantic Rhythm (l'outil de l'Auteur) et Fili (le dépôt) portent les
 * mêmes idées sous d'autres noms. Ce fichier est la table de traduction, et il
 * produit deux pièces :
 *   fili/lexique.json          — la table, lisible par une machine
 *   src/lexique.genere.css     — les alias, pour qu'un écran écrit dans une
 *                                langue s'habille avec les tokens de l'autre
 *
 * RÈGLE — la table ne déclare aucune valeur. Chaque entrée pointe sur un token
 * qui existe déjà dans fili/geometrie.json, et le générateur REFUSE DE STATUER
 * si l'un d'eux manque. Un lexique qui invente un mot ne traduit plus, il ment.
 *
 * node tools/fili/lexique/produire.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(fileURLToPath(new URL('../../../', import.meta.url)))
const geo = JSON.parse(fs.readFileSync(path.join(ROOT, 'fili/geometry.json'), 'utf8'))

/* La table. Relevée dans l'outil de l'Auteur le 2026-08-11, dans la charge utile
   qu'il envoie à ses écrans de démonstration (rrLatestTokens). */
const TABLE = [
  { tool: '--pagePadX', fili: 'inline-margin-container', what: "la marge horizontale du premier niveau" },
  { tool: '--pagePadY', fili: 'block-margin-container', what: "la marge verticale du premier niveau" },
  { tool: '--cardPadX', fili: 'inline-margin-card', what: "la marge horizontale d'une carte" },
  { tool: '--cardPadY', fili: 'block-margin-card', what: "la marge verticale d'une carte" },
  { tool: '--subPadX', fili: 'inline-margin-detail', what: "la marge horizontale d'un détail" },
  { tool: '--subPadY', fili: 'block-margin-detail', what: "la marge verticale d'un détail" },
  { tool: '--gapInline', fili: 'inline-gap-container', what: "l'écart horizontal entre deux voisins" },
  { tool: '--gapBlock', fili: 'block-gap-container', what: "l'écart vertical entre deux voisins" },
  { tool: '--cardR', fili: 'radius-container', what: "le rayon du premier niveau" },
  { tool: '--ctl', fili: 'radius-container', what: "le rayon d'un contrôle — même cran que la carte" },
  { tool: '--subR', fili: 'radius-card', what: "le rayon du deuxième niveau" },
  { tool: '--subsubR', fili: 'radius-detail', what: "le rayon du troisième niveau" },
  { tool: '--controlSize', fili: 'control-target', what: "la hauteur d'un contrôle" },
  { tool: '--heading-2', fili: 'type-heading2', what: "un titre à un pas du corps" },
  { tool: '--heading-1', fili: 'type-heading1', what: "un titre à deux pas du corps" },
]

/* Ce qui ne se traduit pas. On le nomme plutôt que de bricoler un équivalent. */
const UNTRANSLATABLE = [
  { side: 'tool', name: '--pageR', what: "le rayon du cadre de la démonstration — c'est le rayon racine, et Fili ne l'expose pas comme token : chez lui le rayon racine EST la marge, il n'a pas de nom propre." },
  { side: 'tool', name: '--gap', what: "la moyenne de l'écart horizontal et vertical. Fili refuse de la produire : une valeur qui porte les deux axes à la fois mélange deux échelles, et c'est précisément ce que sa règle des espaces interdit." },
  { side: 'tool', name: '--type-scale', what: "l'intervalle des titres. Ce n'est pas un token mais une décision d'entrée : elle vaut " + (geo.entries?.intervalHeadings ?? '—') + " chez Fili." },
  { side: 'tool', name: 'fontSize', what: "la taille du corps, envoyée à part. Chez Fili c'est le token type-corps." },
  { side: 'fili', name: 'inline/block-marge-page · -large', what: "deux profondeurs au-dessus de la coque, pour le rythme entre sections. L'Échelle s'arrête à trois niveaux : l'outil n'a rien à leur opposer." },
  { side: 'fili', name: 'inline/block-ecart-carte · -detail', what: "un écart par profondeur. L'outil n'en porte qu'un seul, et ses deux axes en descendent." },
  { side: 'fili', name: 'inline-bord · block-bord', what: "le bord structurel. L'outil le calcule mais ne l'envoie pas à ses écrans." },
]

/* Refus de statuer : chaque cible doit exister. */
const missing = TABLE.filter((e) => !geo.tokens?.[e.fili]).map((e) => e.fili)
if (missing.length) {
  console.error(`\n  🔴 REFUS DE STATUER — tokens introuvables dans fili/geometry.json :\n     ${missing.join(', ')}\n`)
  process.exit(2)
}

const piece = {
  $comment: "Le lexique entre l'Échelle Semantic Rhythm et Fili. PIÈCE GÉNÉRÉE — ne pas éditer à la main : tout vient de tools/fili/lexicon/produce.mjs.",
  $rule: "Aucune valeur n'est déclarée ici. Chaque entrée pointe sur un token de fili/geometry.json, et la génération refuse de statuer si l'un manque.",
  $survey: "Table relevée dans l'outil de l'Auteur le 2026-08-11 — la charge utile envoyée à ses écrans de démonstration.",
  $ruling: {
    slice: "Les noms de Fili restent la référence. Ceux de l'outil sont des alias.",
    date: "2026-08-11",
    reason: "Ce n'est pas un arbitrage de goût : les noms de l'outil se lisent mieux, et c'est reconnu. C'est un fait de mécanique. La règle qui attrape un token horizontal posé sur une propriété verticale se déclenche sur les préfixes 'inline-' et 'block-' : le nom N'EST PAS une convention d'écriture, c'est la prise du contrôle. Les renommer, c'est réécrire une règle verrouillée, le registre qu'elle lit, la configuration des utilitaires et les emplois dans les écrans — pour un gain de confort.",
    ceAllows: "Dans une feuille de style écrite à la main, les noms de l'outil sont utilisables tels quels : src/lexicon.generated.css les fait pointer sur les tokens du dépôt.",
    ceQuOnRefused: "Ajouter les noms de l'outil comme classes utilitaires en plus de celles de Fili. Ce serait deux façons légales d'écrire la même valeur, et c'est ce que ce système interdit partout ailleurs. Une équivalence déclarée dans un lexique n'est pas un doublon ; deux classes qui font la même chose en sont un.",
    seReopens: "Par une entrée de journal, jamais en silence. Le coût de la bascule est chiffré : la règle des espaces, le registre, la configuration, et les emplois dans les sept écrans.",
  },
  mappings: TABLE.map((e) => ({
    tool: e.tool,
    fili: `--rr-${e.fili}`,
    what: e.what,
    value: geo.tokens[e.fili].css,
    foundation: geo.tokens[e.fili].base,
  })),
  untranslatable: UNTRANSLATABLE,
}
fs.writeFileSync(path.join(ROOT, 'fili/lexicon.json'), JSON.stringify(piece, null, 2) + '\n')

const css = `/* PIÈCE GÉNÉRÉE — ne pas éditer à la main.
   Produite par tools/fili/lexique/produire.mjs.

   Les alias de l'Échelle Semantic Rhythm. Un écran écrit dans la langue de
   l'outil de l'Auteur s'habille ici avec les tokens de Fili, sans être réécrit :
   les noms changent, les valeurs restent celles du dépôt.

   Ce qui ne se traduit pas est nommé dans fili/lexique.json — jamais bricolé. */
:root {
${TABLE.map((e) => `  ${e.tool}: var(--rr-${e.fili}); /* ${e.what} */`).join('\n')}

  /* L'intervalle des titres n'est pas un token mais une décision d'entrée. */
  --type-scale: ${geo.entries?.intervalHeadings ?? 1.25};
}
`
fs.writeFileSync(path.join(ROOT, 'src/lexicon.generated.css'), css)

console.log(`lexique: ${TABLE.length} correspondances · ${UNTRANSLATABLE.length} intraduisibles nommés`)
