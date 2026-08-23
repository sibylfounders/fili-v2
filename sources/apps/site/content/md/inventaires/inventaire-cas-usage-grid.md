# Inventaire des cas d'usage — Fondation Grille & layout

> Carte de couverture de la fondation `grid` : les contextes où une **largeur de conteneur** ou un
> **cadre de page** entre en jeu. La grille de colonnes proprement dite (gouttières, 12 colonnes) est
> hors périmètre de cette première version — elle naîtra avec le pattern collection/grille (cf.
> GRID-UX.md, note de transposition). Cet inventaire sert de checklist pour le test de couverture.

---

## 1. Par type de conteneur

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Conteneur mono-colonne étroit | Formulaire, auth, saisie focalisée | Largeur bornée bien sous la pleine page ; centré ; le pilote a montré le trou ici |
| Conteneur de contenu standard | Page de contenu, article, réglages, app à colonne unique | Largeur intermédiaire ; lisibilité et confort de scan |
| Conteneur large | Dashboard, collection dense, tableau large | Largeur maximale haute ; densité assumée |
| Pleine largeur (full-bleed) | Hero, bandeau, image de fond, séparateur visuel | Pas de max-width ; déborde volontairement le conteneur |
| Conteneur imbriqué | Un conteneur dans un autre (carte dans une grille) | N'additionne pas les marges ; la largeur vient du parent |

## 2. Par relation au contenu

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Texte courant (prose) | Paragraphes longs à lire | Relève de `measure.reading-max` (typographie), PAS de la largeur de conteneur — frontière à tenir |
| Champs de formulaire | Saisie mono-colonne | Largeur de conteneur étroite ; ni la mesure de lecture ni la pleine page |
| Collection d'items | Cartes, lignes, vignettes | Largeur large + (à terme) grille de colonnes — colonnes différées ici |
| Média | Image, vidéo, ratio fixe | Largeur héritée du conteneur ; ratio géré par `media_ratio` |

## 3. Par régime responsive

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Sous le breakpoint mobile | Écran étroit | Conteneur en pleine largeur moins la marge ; le max-width ne mord pas |
| Au-dessus du breakpoint | Écran large | Le max-width borne et centre ; la marge tient le contenu à distance des bords |
| Bascule mobile/desktop | Même conteneur, deux régimes | La largeur change, jamais la nature du contenu (cf. SPACING : deux régimes, un breakpoint) |

## 4. Par marge et gouttière

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Marge de page | Espace entre le conteneur et le bord de l'écran | Dérive de l'échelle `spacing`, pas une valeur propre |
| Gouttière entre colonnes | Espace entre items d'une future grille | Dérive de `spacing` (différé avec la grille de colonnes) |
| Centrage du conteneur | Conteneur borné centré dans la fenêtre | Marges auto ; jamais un centrage « parce que c'est plus propre » d'un bloc aligné sur la grille |

---

## Comment utiliser cet inventaire

Chaque ligne est un cas à couvrir par une règle de GRID-UX/GRID-UI, **ou** à renvoyer explicitement à
son propriétaire (la mesure de lecture → typographie ; la proximité/densité → spacing ; le ratio média →
`media_ratio`). Un « trou » qui appartient en fait à une autre fondation n'est pas un trou de grid : c'est
une frontière à documenter. La grille de colonnes (catégorie 1 « collection » + gouttières de la
catégorie 4) est **volontairement non couverte** dans cette version — statut : différé jusqu'au pattern
collection.
