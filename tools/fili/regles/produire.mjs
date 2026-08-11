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
const prof = reg.espacement.profondeurs
const ent = geo.entrees

/* Refus de statuer : sans échelle, pas de règles. */
if (!prof?.length || !geo.marges) {
  console.error('\n  🔴 REFUS DE STATUER — la géométrie ou le registre sont incomplets\n')
  process.exit(2)
}

const ligneProfondeur = prof
  .map((p) => `| \`${p}\` | ${nb(geo.marges[p])} px | ${nb(geo.ecarts[p])} px | ${geo.rayons[p] !== undefined ? nb(geo.rayons[p]) + ' px' : '—'} |`)
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

Tout descend de trois décisions : une base de **${nb(ent.base)} px**, un
intervalle de **${nb(ent.ratio)}**, et le rayon qui vaut la moitié de la marge.
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

**Aucun état ne se lit à la couleur seule.** Une erreur porte aussi un mot, et
une forme.

---

## 4 · Les formes

Rayons : ${rayons} — le rayon suit la profondeur, il se divise par deux à chaque
niveau. \`rounded-net\` pour ce qui se lit (une section, un tableau),
\`rounded-pastille\` pour une pastille.

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
