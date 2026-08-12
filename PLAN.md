# Le plan

> **Où on va.** Ce fichier répond à une question que les deux autres ne posent
> pas : `system-map.md` dit où on en est, `journal.md` dit pourquoi on en est là,
> celui-ci dit ce qu'on fait ensuite et dans quel ordre.
>
> Arrêté le 11 août 2026 à la suite de la décision `#061`, **relevé le 12 août** :
> le premier temps est terminé, et le rem du deuxième aussi. — on garde la machine,
> on arrête l'appareil de preuve. Il se réécrit quand la direction change, et ce
> changement passe par une entrée de journal.

---

## Où on est

Un robot qui bloque le mauvais code avant qu'il parte, et qui marche : trente
règles, chacune sabotée exprès pour prouver qu'elle sait dire non.

Une chaîne qui calcule les espaces, les rayons, les couleurs et les tailles à
partir de sept décisions, et rien d'autre.

Sept écrans qui servent de banc d'essai.

Un fichier de règles que l'IA lit avant d'écrire — `REGLES.md`.

Une marge qui commande l'arrondi, une zone de clic qui ne rétrécit pas avec le
contour, et des longueurs affichées à l'entier — les trois décisions du 12 août.

**Ce qui manque : cinq contrôles à brancher, puis la sortie.** Il y en avait une
dizaine le 11 août ; **elles sont toutes réglées** — entrées, absorbées ou écartées.

---

## Où on va

**Un outil qui empêche une IA de produire de la bouillie visuelle, et qu'on peut
poser sur un projet qui n'est pas Fili.**

On y sera le jour où quelqu'un qui ne connaît pas la doctrine — une autre IA, un
développeur, l'Auteur dans six mois — écrit un écran correct avec, sans que
personne intervienne.

---

## 1 · Les règles qui changent le résultat tout de suite

Elles ne touchent pas au moteur. Chacune tient dans une séance de travail, et
l'effet se voit sur les écrans le jour même.

### ✅ La profondeur se lit au contraste — *fait, `#062`*

Une surface qui **regroupe** d'autres surfaces reste proche du fond. Une surface
qui **porte** du contenu s'en écarte. La hiérarchie se lit donc sans une seule
ombre portée, et elle survit au thème sombre, à l'impression et à un écran mal
réglé.

Sur chaque surface, l'encre suit le même ordre : la donnée au contraste le plus
fort, le cadrage en dessous, la reformulation encore en dessous.

**La forme vérifiable de la règle** — une information déclarée secondaire ne peut
pas être plus contrastée que la principale. Un contraste est un nombre, et le
système sait déjà les calculer.

**Son prix** — il faut que chaque élément déclare son rang. Le système ne sait
aujourd'hui marquer que la section qui compte d'abord ; c'est le même geste, à
étendre.

**Ses trois suites** — une surface qui ne regroupe ni ne porte est une surface de
trop · une liste de liens vit nue, seul l'élément actif reçoit une surface · une
surface d'appel double son épaisseur verticale.

### ✅ Un signal par intention — *fait, `#065`*

Jamais une pastille, plus une flèche, plus une couleur pour dire une seule chose.

### ✅ Les composants sortent de la chaîne des rayons — *fait, `#063` et `#064`*

Un bouton, un champ, une pilule, un interrupteur gardent un rayon propre, qui ne
bouge ni avec la profondeur ni avec le thème. Il serait contre-productif qu'un
bouton change d'arrondi selon l'endroit où il tombe.

---

## 2 · Les règles qui touchent le moteur

Plus lourdes : elles retouchent ce qui calcule. Chacune se regarde en avant/après
avant d'être gardée.

**✅ Tout en rem, base 16** — *fait le 12 août, `#069`*. Restent en pixels la cible
au doigt, les traits d'un pixel et la largeur d'écran minimale : ils ne doivent pas
grandir avec le texte. Vérifié sur quatre-vingt-dix mesures : aucune valeur ne
bouge à taille de texte normale.

**✅ L'écart sur « même surface ou pas »** — *fait le 12 août, `#074`*. Elle
s'ajoute à la profondeur au lieu de la remplacer, le saut vaut deux crans — soit la
marge du niveau —, et une frontière n'est pas un écart plus grand : **c'est un
groupe**, parce qu'un enfant ne réclame jamais d'espace.

**✅ Le curseur de densité** — *fait le 12 août, `#076`*. Il est **local**, et il
décale d'un cran dans l'échelle au lieu de multiplier : régler la densité du produit
entier, la base sait déjà le faire. En le préparant, une faute d'accessibilité est
apparue — deux cibles voisines étaient trop près, `#075`.

**✅ Les trois règles de coin** — *faites le 12 août, `#073`, et il n'en restait
qu'une*. La bande de tolérance mesurait la mauvaise chose ; la saturation était déjà
couverte trois fois plus strictement. Seul le dégagement est écrit — et il ne mord
que sur la pastille, dont l'arrondi ne descend pas de la chaîne.

---

## 3 · Armer le robot

Six contrôles d'audit sont écrits. **Le robot n'en applique qu'un** — celui de
proximité. Les cinq autres se branchent une fois que les règles du dessus
existent ; avant, ils n'auraient rien à vérifier.

1. Aucun enfant plus rond que son parent.
2. Aucune surface plus épaisse que celle qui la contient.
3. Jamais plus de deux positions horizontales dans une carte.
4. Icônes et jauges alignées entre cartes voisines, à toutes les densités.
5. Zéro débordement horizontal à 390 px.
6. L'écart entre surfaces au moins égal au padding qui les habille. ✅ *en place*

---

## 4 · La sortie

Poser le tout sur un projet qui n'est pas Fili, et regarder ce que ça donne.

C'est la seule épreuve qu'on garde. C'est aussi la seule qui puisse répondre à la
question posée le 11 août — *qu'est-ce que ce système apporte ?* — parce que
personne ne peut y répondre depuis l'intérieur.

---

## Mis de côté, avec la condition qui les rouvre

**Le rognage du texte** (`#072`). Le défaut est chiffré : cinq points et demi de
blanc subi par bord sur l'axe vertical, la moitié d'un cran. Le remède coûte un
double régime tant qu'un écran sur six ne le prend pas en charge. Se rouvre si la
prise en charge monte, ou si le blanc propre à nos trois fontes diffère beaucoup
de l'une à l'autre — ce relevé reste à faire.

**Les composants qui suivent leur surface** (`#070`). Essayé et écarté : la
contrainte d'outil avait disparu, mais un bouton qui grossit selon sa profondeur
dit la structure au lieu de dire le sens. Fermé.

**La grille de quatre** (`#071`). Mesurée : elle donne le même écart à deux
profondeurs d'emboîtement. Fermée.

---

## Ce qui n'est plus sur le chemin

Le protocole de jugement et ses neuf points de passage. Les séances. Les témoins
datés à chaque génération. Les épreuves qui restaient. Finir le produit Fili.

Rien n'est supprimé : tout dort au dépôt et se rouvre par une entrée de journal.
**Les sept écrans ne sont plus une fin — ils sont le banc d'essai.**

---

## L'ordre

Le temps 3 dépend des temps 1 et 2. Le temps 4 dépend des trois autres.
À l'intérieur des temps 1 et 2, l'ordre est libre.
