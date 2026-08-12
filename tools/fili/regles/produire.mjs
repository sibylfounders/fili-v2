/* Produit REGLES.md — le fichier que l'IA lit AVANT d'écrire une interface.
 *
 * PIÈCE GÉNÉRÉE. Aucune valeur n'est écrite ici : tout est lu dans les pièces du
 * dépôt (géométrie, registre, planche, palette) et mis en phrases. Un fichier de
 * règles écrit à la main dérive de ce qu'il décrit — c'est le seul défaut qu'il
 * ne peut pas se permettre.
 *
 * node tools/fili/regles/produire.mjs      →  REGLES.md
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const RACINE = path.resolve(fileURLToPath(new URL('../../../', import.meta.url)))
const lire = (n) => JSON.parse(fs.readFileSync(path.join(RACINE, n), 'utf8'))

const geo = lire('fili/geometrie.json')
const reg = lire('fili/registry.json')
const pla = lire('fili/expression.json')
const pal = lire('fili/palette.json')

const crans = (o) => Object.keys(o || {}).filter((k) => !k.startsWith('$'))
const nb = (n) => (Math.round(n * 100) / 100).toString().replace('.', ',')
/* LA LONGUEUR AFFICHÉE est arrondie à l'entier. Le calcul, lui, garde ses
   décimales : c'est la décision du 2026-08-12. Un tableau qui donne 16,9706 fait
   lire une précision que personne n'emploie et que l'écran ne rend jamais — la
   même valeur vaut 13,6 sur un téléphone et 20,4 sur un bureau. On arrondit donc
   POUR LA LECTURE, à l'entier et non au pair : afficher 16 pour 16,97 mentirait
   d'un point entier, l'entier ment de trois centièmes et reste reconnaissable
   dans le rendu. Les ratios, eux, gardent leurs décimales — 1,41 n'est pas une
   longueur. */
const px = (n) => Math.round(n).toString()
const prof = reg.espacement.profondeurs
const ent = geo.entrees

/* Refus de statuer : sans échelle, pas de règles. */
if (!prof?.length || !geo.marges) {
  console.error('\n  🔴 REFUS DE STATUER — la géométrie ou le registre sont incomplets\n')
  process.exit(2)
}

const ligneProfondeur = prof
  .map((p) => `| \`${p}\` | ${px(geo.marges[p])} px | ${px(geo.ecarts[p])} px | ${geo.rayons[p] !== undefined ? px(geo.rayons[p]) + ' px' : '—'} |`)
  .join('\n')

const couleurs = crans(pal.neutres).map((c) => `\`${c}\``).join(' · ')
const etats = crans(pal.etats).map((c) => `\`${c}\``).join(' · ')
const tailles = crans(pla.tailles).map((c) => `\`text-${c.replace(/[A-Z]/g, (x) => '-' + x.toLowerCase())}\``).join(' · ')
const graisses = crans(pla.graisses).map((c) => `\`font-${c}\``).join(' · ')
const familles = crans(pla.familles).map((c) => `\`font-${c}\``).join(' · ')
const rayons = crans(pla.rayons).map((c) => `\`rounded-${c}\``).join(' · ')
const largeurs = crans(pla.mesures).map((c) => `\`max-w-${c}\``).join(' · ')
const bascules = crans(pla.bascules).map((c) => `\`${c}:\``).join(' · ')
const composants = (() => {
  const s = fs.readFileSync(path.join(RACINE, 'src/system/index.ts'), 'utf8')
  return [...s.matchAll(/^export \{([^}]+)\} from/gm)]
    .flatMap((m) => m[1].split(',').map((x) => x.trim()))
    .filter((n) => /^[A-Z]/.test(n))
})()

const md = `# Règles à lire avant d'écrire une interface

> **Fichier généré.** Ne pas le modifier à la main : il est produit depuis les
> pièces du dépôt par \`tools/fili/regles/produire.mjs\`. Pour le mettre à jour :
> \`npm run fili:regles\`.

Tu écris une interface dans ce dépôt. Ces règles ne sont pas des conseils : un
robot les vérifie avant que le code parte, et il bloque. Lis-les en entier
d'abord — elles sont courtes.

---

## La règle qui commande toutes les autres

**Tu n'écris jamais un nombre.**

Pas de \`padding: 16px\`, pas de \`gap-4\`, pas de \`p-[13px]\`, pas de
\`font-size: 18px\`, pas de \`#4F46E5\`, pas de \`border-radius: 8px\`.
Chaque valeur vient d'une classe nommée. Si tu ne trouves pas la classe, tu ne
bricoles pas : tu t'arrêtes et tu poses la question.

**Et tu écris en rem, jamais en pixels.** Toute la géométrie s'exprime en
multiples de la taille de texte de l'utilisateur : quand il l'agrandit dans son
navigateur, le système entier suit. Le pixel ne demeure que pour trois choses qui
ne doivent PAS grandir avec le texte — la cible au doigt, les traits d'un pixel,
et la largeur d'écran minimale. Tu n'as de toute façon rien à convertir : les
classes portent déjà la bonne unité.

**Les seules valeurs brutes tolérées** : \`0\`, \`1px\`, \`2px\`, \`50%\`,
\`100%\`, \`auto\`, \`9999px\`. Rien d'autre, jamais.

---

## 1 · L'espace — tu ne choisis pas, tu constates

On ne te demande pas *quel écart mettre*. On te demande **à quelle profondeur
d'emboîtement tu te trouves**. C'est un fait lisible dans la structure, pas un
jugement.

| Profondeur | Marge intérieure | Écart entre voisins | Rayon |
|---|---|---|---|
${ligneProfondeur}

Ces longueurs sont **arrondies pour la lecture**. Le calcul garde ses
décimales, et de toute façon aucune de ces valeurs n'arrive telle quelle à
l'écran : elles s'ouvrent et se resserrent avec la largeur.

Tout descend de trois décisions : une base de **${nb(ent.base)} px**, un
intervalle de **${nb(ent.ratio)}**, et un arrondi de départ de
**${nb(ent.rayonRacine)} px** — qui est un réglage à part, borné par la marge.
Ces valeurs bougent avec la largeur de l'écran toutes seules — tu n'as rien à
faire pour ça.

### Les deux axes ne se mélangent jamais

L'horizontal et le vertical ne respirent pas au même rythme. Le nom de la classe
porte son axe, et **un jeton horizontal posé sur une propriété verticale est une
faute** que le robot voit.

\`\`\`
✅  px-inline-coque      py-block-coque
✅  gap-x-inline-carte   gap-y-block-carte
❌  py-inline-coque      gap-y-inline-carte
\`\`\`

### L'espace se pose par le conteneur, jamais par l'enfant

Un élément ne pousse pas son voisin. C'est le conteneur qui distribue.

\`\`\`
✅  <Pile espace="carte">…</Pile>          ✅  <Grille colonnes={2} espace="coque">
❌  <div className="mt-block-carte">       ❌  style={{ marginTop: 12 }}
\`\`\`

**Aucune marge extérieure n'est autorisée**, sauf \`mx-auto\` pour centrer.

---

## 2 · Le texte — la taille découle du niveau

Tu ne choisis pas une taille. Tu dis de quel niveau il s'agit, et la taille suit.

Tailles : ${tailles}
Graisses : ${graisses}
Polices : ${familles}

Le corps vaut **${nb(ent.corps)} px**, c'est la base commune partout. Un titre de
niveau 2 est à un pas de l'intervalle (${nb(ent.intervalleTitres)}), un titre de
niveau 1 à deux pas. Trois graisses suffisent : une quatrième compenserait une
hiérarchie mal posée.

---

## 3 · Les couleurs — huit fonds et encres, quatre états

Fonds et encres : ${couleurs}
États : ${etats}

Une seule couleur est choisie dans tout le système (\`${pal.$primaire}\`) ; toutes
les autres en sont calculées, et chaque paire fond/texte tient son contraste par
construction. **Tu n'écris jamais un code couleur.** Un état s'emploie par paire :
la surface, et ce qui s'écrit dessus.

\`\`\`
✅  bg-erreur-surface text-erreur-sur      ✅  bg-papier text-encre
❌  bg-[#FFEAEB]                           ❌  text-red-600
\`\`\`

**Aucun état ne se lit à la couleur seule.** Une erreur porte toujours un mot.
La forme s'y ajoute quand l'élément est **seul** — et disparaît quand il se
répète : dans une liste ou un tableau, la même icône vingt fois devient du grain.
C'est le composant qui le tient, tu n'as qu'à déclarer que tu es dans une suite.

---

## 4 · Les formes

### Les rayons

${rayons}

**La marge commande l'arrondi.** **Aucun arrondi ne dépasse la marge qui le
porte** — ni au départ, ni à aucun niveau. En dessous, c'est un choix : on
descend jusqu'à l'angle droit si on veut. Le réglage de départ vaut aujourd'hui
${nb(ent.base)} ; il peut monter jusqu'au double, point où l'arrondi de la coque
touche exactement sa marge, jamais plus. Au-delà, le système refuse de calculer —
il ne rabat pas la valeur en silence.

**Une surface** suit la profondeur : son rayon se divise par deux à chaque niveau.
\`rounded-net\` pour ce qui se lit — une section, un tableau.

**Un composant** — bouton, champ, liste de choix, jeton — ne suit pas la profondeur.
Il prend \`rounded-controle\`, et ce rayon ne change ni avec l'endroit où il tombe,
ni avec le thème : un bouton doit se reconnaître partout. Il est plus petit que le
rayon de sa carte par construction, parce qu'un arrondi se lit par rapport à la
taille de l'objet.

**L'air horizontal d'un composant est large** — \`px-inline-coque\`, un peu plus de
la moitié de sa hauteur. Le serré, \`px-inline-carte\`, n'est pas une taille mais un
rôle : un bouton sans texte, ou des boutons groupés. Deux cas, pas un de plus, et
jamais sur une pastille.

**Le coin d'une pastille mange, et il mange de plus en plus haut.** Un coin de
rayon R réserve **0,293 × R** en diagonale : ce qui entre dans ce carré sort de la
surface. Sur une surface ordinaire tu n'as rien à vérifier — la marge est toujours
largement au-dessus, par construction. Sur une pastille, si : son arrondi vaut la
moitié de sa hauteur, donc il grandit avec elle. **Au-delà de
${px(geo.coin.pastilleHauteurMax.large)} de haut en air large, ou de
${px(geo.coin.pastilleHauteurMax.serre)} en air serré, la marge horizontale ne
tient plus le coin.** Une pastille plus haute que ça n'est plus une pastille :
c'est une surface, et elle prend un rayon de surface.

**\`rounded-pastille\` est une forme, pas un arrondi** — et c'est une promesse :
ce composant tient sur une ligne. Sur deux lignes, le texte entre dans la courbe.
Un composant dont le libellé peut se replier ne devient jamais une pastille.

### La taille au doigt

Une zone qui réagit au doigt mesure au moins **${pla.cibles.plancher.valeur}** —
c'est un plancher légal, pas un objectif — et vise **${pla.cibles.confort.valeur}**.
Deux cibles voisines gardent **${pla.cibles.ecartMini.valeur}** entre elles.

**Un composant peut être dessiné plus petit que ça. Sa zone d'atteinte, non.**
Quand la composition demande un objet plus court que la cible — un bouton posé
dans une tête de carte à côté d'un logo, une action rangée près d'un titre — le
contour rétrécit et la zone qui réagit reste à la cible : la classe
\`atteinte-confort\` l'étend tout autour, sans rien dessiner et sans pousser les
voisins. **Rétrécir un composant sans elle est une faute, pas un choix.** Elle ne
dispense pas de l'écart minimal : deux atteintes qui se recouvrent rendent le
clic imprévisible.

Largeurs : ${largeurs} — un bloc de texte suivi ne dépasse jamais \`max-w-lecture\`.

Bascules d'écran : ${bascules} — et rien d'autre. Aucune largeur écrite à la main
dans une requête média.

---

## 5 · Les composants — tu passes par eux, toujours

Une balise interactive nue est refusée. Ces ${composants.length} pièces existent,
tu les emploies :

${composants.map((c) => `\`${c}\``).join(' · ')}

\`\`\`
✅  <Button onPress={…}>Prononcer</Button>
❌  <button onClick={…}>Prononcer</button>
❌  <div onClick={…} className="cursor-pointer">
\`\`\`

---

## 6 · Les états — rien ne tourne dans le vide

Tout ce qui attend une réponse expose ses états : **ça charge, ça a raté, c'est
vide, voilà le contenu.** Aucun n'est optionnel, et la mécanique passe par
\`EtatAsync\` — jamais par des conditions écrites à la main dans la page.

Le squelette d'attente ressemble à ce qu'il remplace. **Le rond qui tourne est
interdit** : il occupe sans informer.

Un état vide dit ce qui remplirait le vide, jamais seulement qu'il est vide.

---

## 7 · Ce que tu peux casser, et à quel prix

Tu as le droit de sortir des règles de forme, à une condition : **le déclarer et
écrire pourquoi**, au point exact où tu le fais.

\`\`\`jsx
<section data-intent="statement" data-motif="affiche pleine page — rupture voulue">
\`\`\`

Sans motif, c'est refusé. Et **une intention déclarée ne lève jamais une règle
d'accessibilité** : ni le clavier, ni l'ordre des titres, ni l'annonce d'un état,
ni le contraste, ni le respect de « je ne veux pas d'animations ». Ces cinq-là ne
se négocient pas.

---

## 8 · Le ton

Phrases courtes, mot courant plutôt que mot savant. **Pas d'excuses** — jamais
« désolé », jamais « une erreur est survenue » : dis ce qui s'est passé et ce qui
reste possible. **Pas de félicitations**, aucun point d'exclamation. Le problème
d'abord, la solution ensuite, un seul de chaque.

---

## Avant de rendre ton travail

1. Aucun nombre écrit à la main, hors les sept tolérés.
2. Aucune balise interactive nue.
3. Chaque attente expose ses quatre états.
4. Aucun jeton horizontal sur une propriété verticale.
5. Aucune marge extérieure, sauf \`mx-auto\`.
6. Chaque écart choisi par profondeur, pas au jugé.

Puis lance \`npm run qpm\`. S'il rougit, c'est toi qui as tort, pas lui.
`

fs.writeFileSync(path.join(RACINE, 'REGLES.md'), md)
console.log(`regles: REGLES.md — ${prof.length} profondeurs, ${composants.length} composants, ${crans(pal.neutres).length + crans(pal.etats).length} couleurs`)
