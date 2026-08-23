---
component: composition
layer: ux
type: foundation # la contrainte transversale qui règle la PAGE, quand les autres familles règlent les éléments
version: 1.0.0 # 1.0.0 : première rédaction au moule V2, actée EN BLOC par l'Auteur le 23 août 2026 (« go on ajoute ça ») — huit règles nées de l'inventaire (quinze lois du fonds, sept déjà couvertes ailleurs), des cinq planches annotées fournies par l'Auteur, et de la leçon des vingt retours sur le kit. Aucun CRITERE posé : les assertions viendront quand le Gardien mordra sur le kit.
last_updated: 2026-08-23
confidence: mixed # la Gestalt est établie (un siècle de littérature) ; la part décidable par machine varie règle par règle, dite à chaque fois
---

# Composition — Couche UX (fondation) · moule V2

> Les autres familles règlent les éléments ; celle-ci règle la page. Fonds
> complet inventorié : quinze lois, dont sept vivent déjà ailleurs (proximité
> Y1/Y2, échelle Y3, mesure T5/M2, hiérarchie R20-R21, un h1 G1, grille en
> phase 3). Les huit règles d'ici sont celles qui n'avaient pas de maison.
> Inventaire : `claude/inventaire-lois-composition-2026-08-23.md` · exemples
> mesurés : `claude/pature-composition-2026-08-23.md`.

## Les huit règles

### RÈGLE [COMPOSITION-CP1] — Un costume, un seul rôle

STATUT : propriété universelle (Gestalt — similarité, lue à l'envers)
SOURCE : S1, S2 ; leçon vécue sur le kit (deux lignes en petites capitales confondues)
ÉNONCÉ : Une combinaison typographique nommée (famille, corps, casse, graisse, couleur) n'est employée que pour un seul rôle déclaré. Ce qui se ressemble est perçu comme de même nature — deux rôles sous le même costume mentent au lecteur.
MESURE : chaque costume déclaré au registre porte exactement un rôle ; aucun costume orphelin.
TEST : piégée — deux rôles distincts rendus en petites capitales mono → rouge.
DÉPENDANCE : les rôles de texte au registre.
VERDICT : actée en bloc — accord d'Auteur du 23 août 2026.

### RÈGLE [COMPOSITION-CP2] — La région commune se mérite

STATUT : parti pris d'identité (Gestalt — région commune ; retours d'Auteur sur les cartes et séparateurs)
SOURCE : S1, S2, S6
ÉNONCÉ : Une surface délimitée (fond, bordure, carte) n'apparaît que là où le blanc ne suffit pas à faire le groupe — et une surface n'est jamais à moitié vide : son contenu la remplit ou elle n'existe pas. Le blanc sépare avant le trait.
MESURE : toute surface bordée groupe au moins deux éléments liés ; l'espace résiduel d'une surface reste sous un cran d'échelle.
TEST : piégée — une carte dont la moitié est du vide → rouge ; piégée — un filet séparateur là où l'écart de crans suffit → relecture.
DÉPENDANCE : l'échelle d'espacement (crans).
VERDICT : actée en bloc — accord d'Auteur du 23 août 2026.

### RÈGLE [COMPOSITION-CP3] — Un dominant par vue

STATUT : propriété universelle (hiérarchie visuelle ; jumelle visuelle de G1)
SOURCE : S3, S4
ÉNONCÉ : Une vue a exactement un élément qui se lit en premier. Deux dominants, c'est aucun.
MESURE : un seul élément au corps maximal par vue ; l'écart entre le dominant et le reste vaut au moins un échelon.
TEST : piégée — deux titres au même corps maximal dans une vue → rouge.
DÉPENDANCE : l'échelle typographique.
VERDICT : actée en bloc — accord d'Auteur du 23 août 2026.

### RÈGLE [COMPOSITION-CP4] — L'essentiel sur le chemin de l'œil

STATUT : parti pris d'identité (patterns de lecture F/Z)
SOURCE : S3, S4
ÉNONCÉ : L'œil entre en haut à gauche et balaie en F (contenu dense) ou en Z (contenu aéré). L'essentiel vit sur ce chemin ; les réglages et les métadonnées vivent hors du chemin — à droite, en bas.
MESURE : le premier contenu porteur de sens est dans le premier quadrant ; aucun réglage n'y vit.
TEST : relecture — décidable à l'œil, pas à la machine.
DÉPENDANCE : aucune.
VERDICT : actée en bloc — accord d'Auteur du 23 août 2026.

### RÈGLE [COMPOSITION-CP5] — La rupture se dépense

STATUT : parti pris d'identité (effet Von Restorff ; parent de « le gras avec parcimonie » R23)
SOURCE : S2, S3
ÉNONCÉ : L'élément qui rompt la série attire l'œil — c'est une monnaie qui se dépense. Une seule famille de rupture par vue, déclarée (chez nous : le traitement rouge des casses). Si tout rompt, rien ne rompt.
MESURE : au plus une famille de traitement « hors série » par vue, déclarée au registre.
TEST : piégée — deux traitements de rupture différents dans la même vue → rouge.
DÉPENDANCE : le registre des traitements déclarés.
VERDICT : actée en bloc — accord d'Auteur du 23 août 2026.

### RÈGLE [COMPOSITION-CP6] — Peu d'axes, tenus

STATUT : propriété universelle (alignement)
SOURCE : S3, S5
ÉNONCÉ : Tout élément partage un axe d'alignement avec d'autres, et une vue tient sur peu d'axes de départ. Un élément qui ne s'aligne sur rien flotte ; un axe par élément, c'est du bruit.
MESURE : nombre d'axes verticaux de départ de contenu par vue ≤ 3 (hors châssis).
TEST : piégée — un bloc décalé qui n'ouvre aucun axe partagé → rouge.
DÉPENDANCE : la grille (phase 3) précisera les axes légitimes.
VERDICT : actée en bloc — accord d'Auteur du 23 août 2026.

### RÈGLE [COMPOSITION-CP7] — Chaque espace porte un rôle nommé

STATUT : parti pris d'identité (vocabulaire de Curtis, goût d'Auteur)
SOURCE : S7
ÉNONCÉ : Un espace n'est jamais qu'une valeur : il a un rôle — inset (retrait de surface), squish/stretch inset (retrait resserré/étiré), stack (vertical entre empilés), inline (horizontal entre alignés), grid (gouttières). Le registre nomme le rôle ; les outils du kit l'affichent.
MESURE : chaque jeton d'espace consommé est rattachable à un rôle ; « voir les espaces » affiche le rôle, pas seulement le nom du cran.
TEST : piégée — un espace sans rôle assignable → question de registre ouverte.
DÉPENDANCE : le registre des rôles d'espace.
VERDICT : actée en bloc — accord d'Auteur du 23 août 2026.

### RÈGLE [COMPOSITION-CP8] — Le blanc d'abord

STATUT : méthode de travail (pas une assertion — dite pour être tenue)
SOURCE : S6
ÉNONCÉ : On compose en partant de trop de blanc, puis on retire — jamais l'inverse. On ne remplit pas l'écran : chaque élément reçoit son air avant qu'on resserre.
MESURE : aucune — c'est un ordre des opérations, vérifié par la relecture.
VERDICT : actée en bloc — accord d'Auteur du 23 août 2026.

## Sources

| Réf. | Affirmation | Source |
|---|---|---|
| S1 | Lois de Gestalt : proximité, similarité, région commune, connexion, prägnanz | [IxDF — Gestalt Principles](https://ixdf.org/literature/topics/gestalt-principles) |
| S2 | Formulations UI des lois de perception (proximité, région commune, Von Restorff) | [Laws of UX](https://lawsofux.com/) |
| S3 | Hiérarchie visuelle : taille, contraste, alignement, patterns F/Z | [CareerFoundry — Visual Hierarchy](https://careerfoundry.com/en/blog/ux-design/what-is-visual-hierarchy/) |
| S4 | Groupement par le blanc dans les formulaires ; l'équidistance est l'erreur canonique | [NN/g — Form Design White Space](https://www.nngroup.com/articles/form-design-white-space/) |
| S5 | La grille comme structure ; lisibilité d'abord ; 7-10 mots par ligne | Müller-Brockmann, *Grid Systems in Graphic Design* |
| S6 | « Start with too much white space » ; séparer par l'espace avant les traits | Wathan & Schoger, *Refactoring UI* |
| S7 | Rôles d'espace : inset, squish, stretch, stack, inline, grid ; base 16, progression géométrique | [Curtis — Space in Design Systems](https://medium.com/eightshapes-llc/space-in-design-systems-188bcbae0d62) |

*Les cinq planches annotées fournies par l'Auteur (23 août 2026) sont la pièce
d'origine : échelle des liens 4·8·16·32, interdit de la collision, symétrie du
padding, le blanc séparateur premier.*

## Limites dites

- Aucun CRITERE posé : les assertions naîtront quand le Gardien mordra sur le
  kit — c'est la condition pour que cette famille soit vérifiée et pas
  seulement écrite.
- CP4 et CP8 ne sont pas décidables par machine : affaires de relecture, dites
  comme telles.
- Actée EN BLOC par accord d'Auteur explicite — pas de séance règle par règle :
  toute règle d'ici peut être renversée plus tard, jamais en silence.
