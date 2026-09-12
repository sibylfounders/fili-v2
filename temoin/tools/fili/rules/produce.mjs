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

const ROOT = path.resolve(fileURLToPath(new URL('../../../', import.meta.url)))
const read = (n) => JSON.parse(fs.readFileSync(path.join(ROOT, n), 'utf8'))

const geo = read('fili/geometry.json')
const reg = read('fili/registry.json')
const pla = read('fili/expression.json')
const pal = read('fili/palette.json')

const steps = (o) => Object.keys(o || {}).filter((k) => !k.startsWith('$'))
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
const depth = reg.spacing.depths
const ent = geo.entries

/* Refus de statuer : sans échelle, pas de règles. */
if (!depth?.length || !geo.margins) {
  console.error('\n  🔴 REFUS DE STATUER — la géométrie ou le registre sont incomplets\n')
  process.exit(2)
}

const lineDepth = depth
  .map((p) => `| \`${p}\` | ${px(geo.margins[p])} px | ${px(geo.gaps[p])} px | ${geo.radii[p] !== undefined ? px(geo.radii[p]) + ' px' : '—'} |`)
  .join('\n')

const colors = steps(pal.neutrals).map((c) => `\`${c}\``).join(' · ')
const states = steps(pal.states).map((c) => `\`${c}\``).join(' · ')
const sizes = steps(pla.sizes).map((c) => `\`text-${c.replace(/[A-Z]/g, (x) => '-' + x.toLowerCase())}\``).join(' · ')
const weights = steps(pla.weights).map((c) => `\`font-${c}\``).join(' · ')
const families = steps(pla.families).map((c) => `\`font-${c}\``).join(' · ')
const radii = steps(pla.radii).map((c) => `\`rounded-${c}\``).join(' · ')
const widths = steps(pla.measures).map((c) => `\`max-w-${c}\``).join(' · ')
const toggles = steps(pla.toggles).map((c) => `\`${c}:\``).join(' · ')
const components = (() => {
  const s = fs.readFileSync(path.join(ROOT, 'src/system/index.ts'), 'utf8')
  return [...s.matchAll(/^export \{([^}]+)\} from/gm)]
    .flatMap((m) => m[1].split(',').map((x) => x.trim()))
    .filter((n) => /^[A-Z]/.test(n))
})()

const md = `# Règles à lire avant d'écrire une interface

> **Fichier généré.** Ne pas le modifier à la main : il est produit depuis les
> pièces du dépôt par \`tools/fili/rules/produce.mjs\`. Pour le mettre à jour :
> \`npm run fili:rules\`.

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
${lineDepth}

Ces longueurs sont **arrondies pour la lecture**. Le calcul garde ses
décimales, et de toute façon aucune de ces valeurs n'arrive telle quelle à
l'écran : elles s'ouvrent et se resserrent avec la largeur.

Tout descend de trois décisions : une base de **${nb(ent.base)} px**, un
intervalle de **${nb(ent.ratio)}**, et un arrondi de départ de
**${nb(ent.radiusRoot)} px** — qui est un réglage à part, borné par la marge.
Ces valeurs bougent avec la largeur de l'écran toutes seules — tu n'as rien à
faire pour ça.

### Un texte suivi se compose au niveau \`${geo.prose.depth}\`, jamais plus fin

Un article n'est pas un écran d'outil. Entre deux paragraphes, l'espace ne se
juge pas en profondeur d'emboîtement mais **en multiples du corps** : il faut au
moins une fois le corps, et pas plus d'une fois et demie. Confronté à notre
échelle, **un seul niveau y tombe**.

En dessous, les paragraphes se collent et le texte devient un mur ; au-dessus,
ils se détachent et on lit des blocs séparés au lieu d'un propos suivi.

Le composant de prose s'en charge tout seul. Si tu composes du texte long à la
main, c'est à toi de poser le bon niveau — et le robot le vérifie.

### Deux composants voisins ne sont jamais dans une pile fine

Un bouton, un champ, une liste de choix sont des **cibles** : le doigt doit les
distinguer. La planche exige au moins ${nb(pla.targets.gapMini.value.replace('px',''))} entre deux
cibles voisines, et les écarts des niveaux les plus fins tombent en dessous — sur
un téléphone plus encore, parce que le vertical s'y resserre.

**Une pile qui contient des composants emploie donc au minimum l'espace
\`${geo.depthMiniTargets}\`.** En dessous, deux boutons se touchent presque et
le doigt se trompe. Ce n'est pas une préférence : c'est la seule règle du corpus
qu'un utilisateur peut sentir dans son pouce.

Deux boutons **groupés**, eux, se touchent franchement — c'est un cas déclaré, et
un contour commun vaut mieux qu'un interstice trop court.

### La densité se règle par zone, et elle décale d'un cran

Un tableau dense dans une page qui ne l'est pas : \`densite="serre"\` fait respirer
la zone comme le niveau du dessous, \`densite="ample"\` comme celui du dessus.
**Rien n'est multiplié, aucune valeur n'est inventée** — on se déplace dans
l'échelle qui existe, et le déplacement s'arrête tout seul aux deux bouts.

\`\`\`
✅  <Pile espace="coque" densite="serre">   (respire comme « carte »)
❌  <div style={{ gap: 'calc(var(--x) * 0.75)' }}>
\`\`\`

Pour régler la densité du produit **entier**, on ne touche pas à ce réglage : on
change la base. Les deux ne font pas double emploi — l'un est local, l'autre est
le système.

### Une frontière est un groupe, pas un écart plus grand

La profondeur dit *où tu es*. Elle ne dit pas *ce qui va avec quoi*. Deux
paragraphes du même propos et deux propos différents sont au même niveau, donc au
même écart — et les groupes cessent de se lire.

**Tu ne réponds pas en écartant davantage. Tu réponds en groupant.** Ce qui va
ensemble entre dans la même pile ; la pile du dessus déclare la frontière, et son
écart passe **deux crans au-dessus** — ce qui tombe exactement sur la marge du
niveau. On s'écarte d'un groupe autant qu'on s'écarte du bord.

\`\`\`
✅  <Pile espace="carte" frontiere>
      <Pile espace="carte">titre + texte</Pile>
      <Pile espace="carte">titre + texte</Pile>
    </Pile>
❌  <div className="mt-block-page">        (une marge extérieure, jamais)
\`\`\`

**Ce qui compte comme frontière**, et rien d'autre : entre deux surfaces sœurs ·
au bord de la fenêtre · sous une image · avant un titre qui n'ouvre pas le bloc.
Les quatre se lisent dans la structure sans savoir de quoi parle l'écran — comme
la profondeur, ce sont des faits, pas des jugements.

### Une rangée se ferme quand elle le peut, se solde sinon

L'œil pèse les masses avant de lire. Deux blocs côte à côte sont comparés en
hauteur avant qu'un mot soit déchiffré : un bas qui traîne, un vide sous une
colonne se voient de loin.

**Une rangée à colonnes se ferme** quand elle porte un élément élastique — une
image : il prend la hauteur que le texte impose, et les bas arrivent ensemble, à
une ligne près. **Elle se solde** sinon : sans élément élastique, les hauteurs de
contenu restent proches (rapport 1,5 au plus — réglage ⚪, à valider à l'œil).
Les hauteurs se mesurent **sur le contenu, jamais sur la boîte**.

**L'empilement n'est jamais une réponse** : à une rangée qui ne se ferme pas, tu
réponds par la forme des items (une, carte, vignette, ligne, titre), pas en les
empilant. **Un contrôle n'est jamais élastique** — un bouton ne se tire pas à la
hauteur d'un bloc. Un filet garde le même espace de chaque côté, à une ligne
près. La règle ne vaut que pour une rangée effectivement à colonnes, à la
largeur où les items sont côte à côte. Épreuve : \`node kit/tests/verify.mjs
<fichier.html>\` (loi 16 de Composition, 11 septembre 2026).

### Les deux axes ne se mélangent jamais

L'horizontal et le vertical ne respirent pas au même rythme. Le nom de la classe
porte son axe, et **un token horizontal posé sur une propriété verticale est une
faute** que le robot voit.

\`\`\`
✅  px-inline-container  py-block-container
✅  gap-x-inline-carte   gap-y-block-carte
❌  py-inline-coque      gap-y-inline-carte
\`\`\`

### L'espace se pose par le conteneur, jamais par l'enfant

Un élément ne pousse pas son voisin. C'est le conteneur qui distribue.

\`\`\`
✅  <Pile espace="carte">…</Pile>          ✅  <Grille colonnes={2} espace="coque">
❌  <div className="mt-block-card">       ❌  style={{ marginTop: 12 }}
\`\`\`

**Aucune marge extérieure n'est autorisée**, sauf \`mx-auto\` pour centrer.

---

## 2 · Le texte — la taille découle du niveau

Tu ne choisis pas une taille. Tu dis de quel niveau il s'agit, et la taille suit.

Tailles : ${sizes}
Graisses : ${weights}
Polices : ${families}

Le corps vaut **${nb(ent.body)} px**, c'est la base commune partout. Un titre de
niveau 2 est à un pas de l'intervalle (${nb(ent.intervalHeadings)}), un titre de
niveau 1 à deux pas. Trois graisses suffisent : une quatrième compenserait une
hiérarchie mal posée.

---

## 3 · Les couleurs — huit fonds et encres, quatre états

Fonds et encres : ${colors}
États : ${states}

Une seule couleur est choisie dans tout le système (\`${pal.$primary}\`) ; toutes
les autres en sont calculées, et chaque paire fond/texte tient son contraste par
construction. **Tu n'écris jamais un code couleur, ni le nom d'une couleur qui
ne vient pas d'ici.** La palette du système REMPLACE celle de l'outil, elle ne
s'y ajoute pas : les couleurs livrées par défaut n'existent plus, elles ne
compilent pas. Un état s'emploie par paire : la surface, et ce qui s'écrit
dessus.

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

${radii}

**La marge commande l'arrondi.** **Aucun arrondi ne dépasse la marge qui le
porte** — ni au départ, ni à aucun niveau. En dessous, c'est un choix : on
descend jusqu'à l'angle droit si on veut. Le réglage de départ vaut aujourd'hui
${nb(ent.base)} ; il peut monter jusqu'au double, point où l'arrondi de la coque
touche exactement sa marge, jamais plus. Au-delà, le système refuse de calculer —
il ne rabat pas la valeur en silence.

**Une surface** suit la profondeur : son rayon se divise par deux à chaque niveau.
\`rounded-net\` pour ce qui se lit — une section, un tableau.

**Un composant** — bouton, champ, liste de choix, token — ne suit pas la profondeur.
Il prend \`rounded-control\`, et ce rayon ne change ni avec l'endroit où il tombe,
ni avec le thème : un bouton doit se reconnaître partout. Il est plus petit que le
rayon de sa carte par construction, parce qu'un arrondi se lit par rapport à la
taille de l'objet.

**L'air horizontal d'un composant est large** — \`px-inline-container\`, un peu plus de
la moitié de sa hauteur. Le serré, \`px-inline-card\`, n'est pas une taille mais un
rôle : un bouton sans texte, ou des boutons groupés. Deux cas, pas un de plus, et
jamais sur une pastille.

**Le coin d'une pastille mange, et il mange de plus en plus haut.** Un coin de
rayon R réserve **0,293 × R** en diagonale : ce qui entre dans ce carré sort de la
surface. Sur une surface ordinaire tu n'as rien à vérifier — la marge est toujours
largement au-dessus, par construction. Sur une pastille, si : son arrondi vaut la
moitié de sa hauteur, donc il grandit avec elle. **Au-delà de
${px(geo.corner.dotHeightMax.wide)} de haut en air large, ou de
${px(geo.corner.dotHeightMax.tight)} en air serré, la marge horizontale ne
tient plus le coin.** Une pastille plus haute que ça n'est plus une pastille :
c'est une surface, et elle prend un rayon de surface.

**\`rounded-dot\` est une forme, pas un arrondi** — et c'est une promesse :
ce composant tient sur une ligne. Sur deux lignes, le texte entre dans la courbe.
Un composant dont le libellé peut se replier ne devient jamais une pastille.

### La taille au doigt

Une zone qui réagit au doigt mesure au moins **${pla.targets.floor.value}** —
c'est un plancher légal, pas un objectif — et vise **${pla.targets.comfort.value}**.
Deux cibles voisines gardent **${pla.targets.gapMini.value}** entre elles.

**Un composant peut être dessiné plus petit que ça. Sa zone d'atteinte, non.**
Quand la composition demande un objet plus court que la cible — un bouton posé
dans une tête de carte à côté d'un logo, une action rangée près d'un titre — le
contour rétrécit et la zone qui réagit reste à la cible : la classe
\`reached-comfort\` l'étend tout autour, sans rien dessiner et sans pousser les
voisins. **Rétrécir un composant sans elle est une faute, pas un choix.** Elle ne
dispense pas de l'écart minimal : deux atteintes qui se recouvrent rendent le
clic imprévisible.

Largeurs : ${widths} — un bloc de texte suivi ne dépasse jamais \`max-w-reading\`.

Bascules d'écran : ${toggles} — et rien d'autre. Aucune largeur écrite à la main
dans une requête média.

---

## 5 · Les composants — tu passes par eux, toujours

Une balise interactive nue est refusée. Ces ${components.length} pièces existent,
tu les emploies :

${components.map((c) => `\`${c}\``).join(' · ')}

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

Le skeleton d'attente ressemble à ce qu'il remplace. **Le rond qui tourne est
interdit** : il occupe sans informer. Une seule animation existe dans tout le
système, la respiration du skeleton — il n'y en a pas d'autre à choisir.

**Ce qui vient d'ailleurs entre par une seule porte.** Une donnée lue à la main
dans une page contourne le conteneur, donc les quatre états, et il ne reste que
le cas heureux.

Un état vide dit ce qui remplirait le vide, jamais seulement qu'il est vide.

---

## 7 · Ce que tu peux casser, et à quel prix

Tu as le droit de sortir des règles de forme, à une condition : **le déclarer et
écrire pourquoi**, au point exact où tu le fais.

\`\`\`jsx
<section data-intent="statement" data-reason="affiche pleine page — rupture voulue">
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


## 9 · L'architecture des feuilles — le kit ne paie pas pour les démos

Le CSS du front vit dans quatre feuilles, et une seule règle les sépare :
**le socle ne porte jamais le décor d'une démonstration.**

- **\`kit.css\`** — le socle livrable : primitives, patterns, halo de focus. Chargé
  partout. Ni mise en page du site de doc, ni décor de démo ; neutre en mise en
  page (aucune requête de fenêtre ni de conteneur).
- **\`app.css\`** — la coque du site de documentation : en-tête, rail, feuille,
  mega-menu, gabarit, paliers, et — en fin de feuille pour primer — les lois de
  survie (postures divisées) et le plomb. Chargée partout, après \`kit.css\`. Ce
  n'est pas le kit.
- **\`demo.css\`** — l'outillage commun des démonstrations (aperçu redimensionnable,
  espaces visibles, cadre, étages). Chargé **uniquement** par les pages qui
  montrent des preuves.
- **\`<page>.css\`** — le décor propre à une page (le bento de Couleur, les objets
  de Composition…). Chargé par sa seule route.

Le décor d'une démonstration va dans le CSS de sa page, ou dans \`demo.css\` s'il
sert plusieurs pages — **jamais** dans \`kit.css\` ni \`app.css\`. Une animation se
fait en CSS et n'anime que \`transform\` et \`opacity\` (jamais \`filter\`, \`width\` ou
\`box-shadow\`, qui recalculent à chaque image) ; si l'effet ne peut pas s'exprimer
ainsi, il devient une démo lourde en WebGL/canvas, chargée à la demande sur sa
seule page, avec un repli statique. L'épreuve \`tests/frontiere.test.mjs\` bloque si
un décor de démo retombe dans le socle.

---

## Avant de rendre ton travail

1. Aucun nombre écrit à la main, hors les sept tolérés.
2. Aucune balise interactive nue.
3. Chaque attente expose ses quatre états.
4. Aucun token horizontal sur une propriété verticale.
5. Aucune marge extérieure, sauf \`mx-auto\`.
6. Chaque écart choisi par profondeur, pas au jugé.
7. Aucun décor de démo dans \`kit.css\` ni \`app.css\` — il vit dans \`demo.css\` ou le CSS de la page.

Puis lance \`npm run qpm\`. S'il rougit, c'est toi qui as tort, pas lui.
`

fs.writeFileSync(path.join(ROOT, '..', 'docs', 'REGLES.md'), md)
console.log(`regles: REGLES.md — ${depth.length} profondeurs, ${components.length} composants, ${steps(pal.neutrals).length + steps(pal.states).length} couleurs`)
