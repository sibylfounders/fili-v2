# Inventaire des cas d'usage — Espacement & layout (fondation)

> Inventaire des *usages de l'espace* chez les consommateurs. Sert de checklist au test de couverture de SPACING-UX.md. Le cadrage de cette fondation inclut la question du **grid** (cf. note de transposition de SPACING-UX.md) : la grille de colonnes n'a pas de fondation propre à ce jour — ce choix est lui-même un cas de l'inventaire.

---

## 1. Par rôle d'espacement

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Padding interne d'un composant | Bouton (padding_x/y par taille), input, card (densité), alert | Couvert — l'échelle sert de vocabulaire commun, densité = décalage d'un cran |
| Écart entre éléments liés (gap) | Icône/texte du bouton, icône/texte de l'alert, label/champ | Couvert — règle de proximité : lié < séparé |
| Écart entre éléments frères | Champs d'un formulaire (field_gap), cartes d'une grille (grid_gap) | Couvert |
| Séparation entre groupes | fieldset_gap, sensiblement plus large que field_gap | Couvert — le saut d'échelle marque la séparation |
| Rythme vertical de page | spacing.section (80px) entre sections de gabarit | Couvert — token provisionné en 1.7.0, la fondation lui donne sa règle d'usage |
| Espace de respiration du texte | Mesure de lecture, interligne | Couvert par renvoi — la typographie fait autorité (measure.reading-max, lineHeight) |
| Alignement optique vs mathématique | Icône ou pastille qui "paraît" décentrée malgré des px égaux | **Non couvert actuellement** — aucun cas interne tranché ; signalé |

## 2. Par contexte d'intégration

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Formulaire | label_to_field < field_gap < fieldset_gap | Couvert (FORM-UI) — la hiérarchie de proximité en application |
| Grille de cartes | grid_gap constant, ratio unique, 1 colonne sous breakpoint.mobile | Couvert |
| Groupe de boutons | Écart interne d'un groupe, jamais de tailles mélangées | Couvert (BUTTON-UI content_spacing + règle de groupe) |
| Page / gabarit de documentation | Sections en spacing.section, contenu borné par la mesure | Couvert |
| Grille de colonnes (12 colonnes, gouttières, marges) | Le "grid" au sens Atlassian/Carbon | Couvert par décision de cadrage — pas de système de colonnes tant qu'aucun consommateur n'en a besoin ; les gouttières existantes sont des tokens spacing ; la décision est documentée et réversible (pattern collection/grille candidat) |
| Densité d'écran (dashboard dense vs page de lecture) | compact/comfortable des composants | Couvert — la densité est un axe de composant, la fondation fournit la règle du cran |

## 3. Par état / comportement dans le temps

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Insertion dynamique de contenu | Alert injecté : l'espace se crée, le contenu saute | Couvert par renvoi — ALERT-UX (réserver l'espace) + fondation motion (le déplacement se traite, ne s'anime pas par défaut) |
| Skeleton / chargement | Le squelette occupe le même espace que le contenu réel | Couvert par renvoi (CARD-UI) — règle générale posée : l'espace réservé ne dépend pas de l'état |
| Contenu vide (empty state) | L'espace d'une zone sans contenu | Couvert par renvoi (CARD-UX empty state) |
| Contenu plus long que prévu | Traduction +30 %, titres longs | **Non couvert actuellement** — même signalement que la typographie (expansion de traduction), l'espacement fixe des hauteurs y est sensible |

## 4. Par plateforme / device

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Desktop | Cas de référence | Couvert |
| Mobile | 1 colonne sous breakpoint.mobile, primaires full-width, zone tactile 44px | Couvert — le breakpoint unique est une décision assumée (2 régimes, pas N paliers) |
| Tablette / intermédiaire | Entre 480px et le desktop de référence | **Non couvert actuellement** — le système ne définit que 2 régimes ; à trancher si un consommateur exige un palier intermédiaire |
| Zoom navigateur / rem | Les espacements en px ne suivent pas le zoom texte | **Non couvert actuellement** — l'échelle est en px (contrairement à la typographie en rem) ; incohérence potentielle signalée, à arbitrer |

## 5. Par enjeu / risque

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Valeur hors échelle | Un 13px local qui casse le rythme | Couvert — guardrail : l'échelle est fermée, toute nouvelle valeur passe par DESIGN.md |
| Deux tokens pour une même valeur | Le cas card-padding/spacing.lg évité en 1.7.0 | Couvert — précédent journalisé |
| Proximité qui ment | Un label plus proche du champ voisin que du sien | Couvert — la hiérarchie de proximité est la règle cardinale |
| Espace comme seul séparateur de groupes | Sans bordure ni fond, l'espace doit suffire à grouper | Couvert — c'est le mécanisme voulu (Gestalt), la bordure décorative reste disponible |
| Écrasement sur petit écran | Paddings fixes qui mangent l'espace utile mobile | Couvert partiellement — la densité compact existe, mais aucune règle de bascule automatique ; signalé |

---

## Bilan du test de couverture

Sur **24 cas recensés**, **6 étaient non couverts après la première rédaction** de SPACING-UX.md.

**Comblés en 1.0.0 (avant livraison)** : alignement optique (règle posée : l'œil arbitre, l'écart documenté), zoom/rem (position explicite : px assumé pour l'espacement, raisonnement documenté — l'espace n'a pas à grandir avec le texte, WCAG 1.4.4 porte sur le texte), écrasement mobile (règle du cran de densité).

**Restent non couverts** : palier tablette (à trancher au premier consommateur réel), expansion de traduction (3e signalement — transversal, mérite un traitement système un jour). Aucun critique.

**Note de méthode** : confirmation du constat de l'inventaire couleur — sur une fondation, les trous sont des contextes pas encore nés plus que des états oubliés. Le cas "grid" a été traité en cadrage plutôt qu'en trou : la question "faut-il une fondation grid ?" appartient au test de transposition, pas au test de couverture.
