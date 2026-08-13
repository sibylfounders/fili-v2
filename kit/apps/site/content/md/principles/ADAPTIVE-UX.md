---
component: adaptive
layer: ux
type: principle
version: 1.1.0 # 1.1.0 : Adaptive devient un principe de premier niveau — contrainte contextuelle universelle, sans créer une catégorie Architecture isolée. 1.0.0 : première rédaction — architecture adaptative : la page répond au viewport et à l'environnement ; le composant réutilisable répond à l'espace de son conteneur
last_updated: 2026-07-20
companion: ADAPTIVE-UI.md
confidence: established
---

# Principe adaptatif — Couche UX

> Ce principe s'applique indépendamment de React et de CSS : un composant réutilisable
> s'adapte à l'espace qu'il reçoit, pas au nom supposé de l'appareil. L'implémentation actuelle par
> Container Queries vit dans `ADAPTIVE-UI.md`.

## Principe

RÈGLE [ADAPTIVE-R01] : **la fenêtre définit la page ; le conteneur définit le composant.**
STATUT : propriété universelle
SOURCE : S1, S12
ÉNONCÉ : Une décision de mise en page qui dépend de la fenêtre est portée par la fenêtre, et une décision qui dépend de l'espace reçu par un composant réutilisable est portée par son conteneur : une requête média n'évalue que la fenêtre, une requête de conteneur évalue le conteneur.
MESURE : toute adaptation causée par la largeur d'un composant réutilisable est exprimée par une requête de conteneur, jamais par une requête média

RÈGLE [ADAPTIVE-R02] : une décision de structure globale répond au viewport ou à l'environnement. Une décision
STATUT : propriété universelle
SOURCE : S1, S2, S12
ÉNONCÉ : Une décision de structure globale répond au viewport ou à l'environnement ; une décision interne à un composant réutilisable répond à l'espace réellement disponible dans son conteneur, la largeur de la fenêtre ne décrivant pas cet espace.
interne à un composant réutilisable répond à l'espace réellement disponible dans son contexte.

> **Pourquoi** : une Card peut être large dans le contenu principal et étroite dans une sidebar sur
> le même écran. La largeur de la fenêtre ne décrit pas l'espace dont chacune dispose.

## Deux niveaux d'autorité

| Niveau | Question | Exemples |
|---|---|---|
| Page / application | quelle structure globale tient dans la fenêtre ? | navigation latérale → drawer, deux régions → une, marges de page |
| Composant réutilisable | quelle présentation tient dans son conteneur ? | Card verticale → horizontale, actions regroupées, métadonnées réorganisées |

RÈGLE [ADAPTIVE-R03] : une Media Query reste légitime pour les préférences et capacités d'environnement :
STATUT : propriété universelle
SOURCE : S13, S14, S15
ÉNONCÉ : Les préférences et capacités d'environnement — mouvement réduit, schéma de couleur, contraste préféré, couleurs forcées, impression, survol et type de pointeur — restent exprimées par requête média : elles décrivent l'utilisateur et le mode de rendu, jamais la largeur d'un composant.
MESURE : aucune de ces préférences n'est exprimée par une requête de conteneur
`prefers-reduced-motion`, contraste forcé, impression, schéma de couleur, hover/pointer. Ces critères
ne décrivent pas une largeur de composant.

RÈGLE [ADAPTIVE-R04] : une Container Query est le mécanisme par défaut quand **la largeur disponible du composant**
STATUT : propriété universelle
SOURCE : S1, S12
ÉNONCÉ : Quand la cause de l'adaptation est la largeur disponible du composant, le mécanisme est la requête de conteneur ; elle n'est pas employée lorsqu'une grille, un retour à la ligne ou une taille intrinsèque résout déjà la disposition.
est la cause de l'adaptation. Elle n'est pas utilisée par réflexe quand une grille ou un flux naturel
suffit.

## États sémantiques, pas appareils

RÈGLE [ADAPTIVE-R05] : les états adaptatifs se nomment par leur effet ou leur capacité — `compact`, `regular`,
STATUT : parti pris d'identité
SOURCE : S6, S7
ÉNONCÉ : Les états adaptatifs portent des noms de capacité — compact, regular, expanded — et jamais des noms d'appareil comme mobile, tablet ou desktop.
MESURE : aucun nom d'état, de classe ou de token adaptatif ne contient mobile, tablet ou desktop
`expanded` — jamais `mobile`, `tablet`, `desktop`.

RÈGLE [ADAPTIVE-R06] : les seuils viennent du contenu : un état bascule quand le label, les actions ou la mise en
STATUT : parti pris d'identité
SOURCE : S6, interne
ÉNONCÉ : Le seuil d'un état dérive du contenu — le point où le libellé, les actions ou la disposition cessent de tenir correctement — et ne recopie pas un point de rupture global de la fenêtre.
MESURE : aucun seuil de composant n'est défini par référence à un token de point de rupture global
page cessent de tenir correctement. Ils ne copient pas automatiquement `breakpoint.mobile`.

RÈGLE [ADAPTIVE-R07] : les seuils ne sont pas nécessairement universels. Deux composants peuvent atteindre leur
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Les seuils ne sont pas partagés entre composants : deux composants atteignent leur état compact à des largeurs différentes lorsque leur contenu et leur structure diffèrent.
état `compact` à des largeurs différentes parce que leur contenu et leur structure diffèrent.

## Adaptations autorisées

RÈGLE [ADAPTIVE-R08] : l'espace peut modifier :
STATUT : parti pris d'identité
SOURCE : interne, S8
ÉNONCÉ : L'espace disponible peut modifier la disposition interne, la densité et les espacements dans les limites du composant, l'ordre visuel tant que l'ordre de lecture reste logique, la longueur d'un libellé lorsqu'une alternative validée existe, la présence d'informations secondaires et le regroupement d'actions secondaires dans un menu accessible.

- la disposition interne ;
- la densité et les espacements dans les limites du composant ;
- l'ordre **visuel** si l'ordre de lecture reste logique ;
- la longueur d'un libellé quand une alternative validée existe ;
- la présence d'informations secondaires ;
- le regroupement d'actions secondaires dans un menu accessible.

RÈGLE [ADAPTIVE-R09] : l'espace ne modifie jamais :
STATUT : parti pris d'identité
SOURCE : interne, S8, S9
ÉNONCÉ : L'espace disponible ne modifie jamais la nature d'une action ou d'une navigation, la priorité réelle d'une action, l'information nécessaire pour décider, le nom accessible d'un contrôle, l'ordre de lecture, ni l'énoncé d'une obligation légale, d'un risque ou d'une erreur à corriger.
MESURE : le nom accessible et l'ordre de lecture d'un composant sont identiques dans tous ses états

- la nature de l'action ou de la navigation ;
- la priorité réelle d'une action ;
- l'information nécessaire pour décider ;
- le nom accessible d'un contrôle ;
- l'ordre DOM au détriment de l'ordre de lecture ;
- une obligation légale, un risque ou une erreur à corriger.

## Divulgation progressive

RÈGLE [ADAPTIVE-R10] : le plus petit état viable conserve l'intention principale, le contexte minimal pour la
STATUT : propriété universelle
SOURCE : S5, S3
ÉNONCÉ : Le plus petit état viable d'un composant conserve l'intention principale, le contexte minimal pour la comprendre et l'accès à toutes les fonctions essentielles : la réduction de l'espace n'entraîne aucune perte d'information ni de fonctionnalité.
MESURE : à une largeur équivalente à 320 px CSS (1280 px à 400 % de zoom), aucune perte d'information ni de fonctionnalité et aucun défilement en deux dimensions
comprendre et l'accès aux fonctions essentielles.

RÈGLE [ADAPTIVE-R11] : quand l'espace augmente, le composant peut révéler des descriptions, métadonnées ou actions
STATUT : propriété universelle
SOURCE : S5
ÉNONCÉ : Un accroissement de l'espace ne peut que révéler des descriptions, des métadonnées ou des actions secondaires ; une information nécessaire à la décision est présente dès l'état compact et n'est jamais différée à un état plus large.
MESURE : toute information requise pour agir est présente dans l'état le plus étroit
secondaires. Il ne révèle pas tardivement une information nécessaire qui aurait dû être présente dès
l'état compact.

RÈGLE [ADAPTIVE-R12] : une icône seule n'est pas une abréviation gratuite. Elle exige une icône reconnue dans le
STATUT : propriété universelle
SOURCE : S9, S10
ÉNONCÉ : Un contrôle réduit à sa seule icône conserve un nom accessible programmatiquement déterminable et s'appuie sur une icône déjà reconnue dans le système ; l'infobulle qui l'accompagne se déclenche au pointeur comme au focus clavier et reste écartable, survolable et persistante.
MESURE : tout contrôle en icône seule expose un nom accessible ; toute infobulle apparaît aussi au focus clavier
système, un nom accessible et, si nécessaire, un tooltip au clavier et au pointer.

## Autonomie et composition

RÈGLE [ADAPTIVE-R13] : le composant possède son adaptation. Son consommateur choisit le contexte et la largeur ; il
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Le composant possède son adaptation : son consommateur choisit le contexte et la largeur qu'il lui accorde, sans maintenir une série de surcharges propres à chaque page.
MESURE : aucune surcharge de disposition d'un composant réutilisable dans le code appelant
ne maintient pas une série d'overrides propres à chaque page.

RÈGLE [ADAPTIVE-R14] : un composant ne suppose pas qu'un viewport large implique un conteneur large. Il doit
STATUT : propriété universelle
SOURCE : S12, S6
ÉNONCÉ : Un composant ne présume pas qu'une fenêtre large lui accorde un conteneur large : il reste fonctionnel en barre latérale, en modale, en cellule de grille, en panneau divisé et en pleine largeur, l'espace disponible étant indépendant du type d'appareil et de la taille de l'écran.
MESURE : chaque composant réutilisable est vérifié dans au moins deux contextes de largeur différents à viewport constant
fonctionner dans une sidebar, une modale, une grille, un panneau divisé et une page pleine largeur.

RÈGLE [ADAPTIVE-R15] : les conteneurs sont nommés lorsque plusieurs ancêtres pourraient répondre, afin que le
STATUT : propriété universelle
SOURCE : S2, S12
ÉNONCÉ : Un conteneur de requête est nommé dès que plusieurs ancêtres pourraient y répondre : en l'absence de nom, la requête se résout contre l'ancêtre qualifié le plus proche, qui n'est pas nécessairement celui qui porte le contrat.
MESURE : toute requête de conteneur portant sur un composant imbriquable cite un nom de conteneur explicite
composant écoute le bon contexte et non le premier conteneur rencontré par hasard.

## Tests obligatoires

RÈGLE [ADAPTIVE-R16] : un composant adaptatif se teste :
STATUT : note de méthode
SOURCE : interne, S17, S18
ÉNONCÉ : Un composant adaptatif est validé étroit et large dans un même viewport, dans au moins deux contextes réels, avec un contenu court, long et traduit, au zoom et à espacement de texte accru, au clavier, au toucher et sans survol, et de part et d'autre de chacun de ses seuils.
MESURE : les six vérifications sont exécutées avant livraison d'un composant adaptatif

1. étroit et large dans **le même viewport** ;
2. dans au moins deux contextes réels ;
3. avec contenu court, long et traduit ;
4. au zoom et avec taille de texte accrue ;
5. au clavier, au toucher et sans hover ;
6. à chaque seuil, juste avant et juste après la bascule.

RÈGLE [ADAPTIVE-R17] : une capture « mobile » et une capture « desktop » ne suffisent plus à prouver l'adaptation
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Une capture en fenêtre étroite et une capture en fenêtre large ne constituent pas une preuve d'adaptation : la preuve porte sur le conteneur, à viewport constant.
d'un composant.

## Dégradation

RÈGLE [ADAPTIVE-R18] : le style de base est le plus petit état viable ; les états plus riches sont une amélioration
STATUT : parti pris d'identité
SOURCE : S20, interne
ÉNONCÉ : Le style de base d'un composant rend son plus petit état viable et les états plus riches sont une amélioration progressive : si le mécanisme d'adaptation n'est pas disponible, le composant reste utilisable.
MESURE : le composant reste utilisable lorsque les règles de requête de conteneur sont ignorées
progressive. Si le mécanisme d'adaptation n'est pas disponible, le composant reste utilisable.

RÈGLE [ADAPTIVE-R19] : les adaptations ne provoquent pas de changement inattendu pendant l'interaction. Un panneau
STATUT : propriété universelle
SOURCE : S11
ÉNONCÉ : Une bascule d'état adaptative ne constitue pas un changement de contexte : le focus, la valeur saisie et la tâche en cours sont conservés de part et d'autre de la bascule.
MESURE : après une bascule d'état provoquée par un redimensionnement, l'élément focalisé et les valeurs saisies sont inchangés
redimensionnable peut basculer d'état, mais le focus, la valeur et la tâche en cours sont conservés.

## Risque

| Cas | Risque principal | Sévérité |
|---|---|---|
| Composant piloté par le viewport | Mauvais rendu dans sidebar, modal ou split panel | Élevée |
| Seuil copié d'un appareil | Bascule sans rapport avec le contenu réel | Moyenne |
| Information essentielle masquée en compact | Décision impossible ou trompeuse | Élevée |
| Actions secondaires supprimées | Fonction perdue selon la largeur | Élevée |
| Ordre visuel différent de l'ordre DOM | Lecture et focus incohérents | Élevée |
| Trop de seuils | Comportement difficile à prévoir et tester | Moyenne |
| Conteneurs imbriqués non nommés | Requête déclenchée par le mauvais ancêtre | Moyenne |

## Sources et niveau de confiance

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| S1 | Une Container Query peut appliquer des styles selon la taille, le style ou l'état de défilement d'un conteneur | [MDN — CSS container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries) | Établi |
| S2 | Les requêtes de taille s'appuient sur un conteneur de requête explicite | [CSS Containment Module Level 3](https://www.w3.org/TR/css-contain-3/) | Normatif |
| S3 | Le contenu et les fonctions restent disponibles au reflow et au zoom | [WCAG 2.2 — 1.4.10 Reflow](https://www.w3.org/TR/WCAG22/#reflow), [1.4.4 Resize Text](https://www.w3.org/TR/WCAG22/#resize-text) | Établi |
| S4 | Noms compact/regular/expanded et seuils dérivés du contenu | Décision d'architecture interne | À éprouver par composant |
| S5 | Le contenu est présentable sans perte d'information ni de fonctionnalité et sans défilement en deux dimensions à une largeur équivalente à 320 px CSS (soit 1280 px à 400 % de zoom), sauf pour les parties qui exigent une disposition en deux dimensions | [WCAG 2.2 — 1.4.10 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) | Établi, standard (AA) — donne au « plus petit état viable » sa mesure vérifiable, absente du fichier qui n'énonce aucune largeur plancher |
| S6 | Les classes de taille de fenêtre sont nommées sémantiquement (compact, medium, expanded, large, extra-large) et explicitement pas destinées à une logique de type d'appareil : elles ne sont pas déterminées par la taille de l'écran, et l'écran partagé, le fenêtrage de bureau et les pliables font varier l'espace disponible indépendamment de l'appareil | [Android / Material — Use window size classes](https://developer.android.com/develop/adaptive-apps/guides/use-window-size-classes) | Établi, documentation de plateforme — soutient l'interdiction des noms d'appareil ; note que le vocabulaire d'Android est compact/medium/expanded, non compact/regular/expanded |
| S7 | Les classes de taille d'Apple emploient le vocabulaire compact et regular, sont des traits assignés aux scènes et aux vues, et changent dynamiquement (rotation, passage en Split View) | [Apple — Auto Layout Guide, Size-Class-Specific Layout](https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/AutolayoutPG/Size-ClassSpecificLayout.html) | Établi pour le vocabulaire (deuxième système public convergent sur des noms de capacité), mais **documentation archivée et vague** : elle ne formule pas explicitement « l'espace disponible, pas l'appareil ». Ne pas s'en servir pour plus que le vocabulaire |
| S8 | Lorsque l'ordre de présentation affecte le sens, un ordre de lecture correct doit pouvoir être déterminé programmatiquement ; le repositionnement par CSS est admis tant qu'il ne change pas le sens, et constitue un échec s'il le change | [WCAG 2.2 — 1.3.2 Meaningful Sequence](https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html) | Établi, standard (niveau A) — fonde la clause « l'ordre visuel peut changer si l'ordre de lecture reste logique » |
| S9 | Le nom et le rôle de tout composant d'interface doivent être programmatiquement déterminables, y compris pour les contrôles personnalisés générés par script | [WCAG 2.2 — 4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html) | Établi, standard (niveau A) |
| S10 | Un contenu additionnel déclenché au survol ou au focus doit être écartable, survolable et persistant ; la note explicite indique qu'un contenu déclenchable au survol du pointeur doit aussi l'être au focus clavier | [WCAG 2.2 — 1.4.13 Content on Hover or Focus](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html) | Établi, standard (AA) — fonde l'exigence d'infobulle au clavier de l'icône seule, que le fichier n'énonce qu'en « si nécessaire » |
| S11 | Les changements de contexte ne sont initiés que sur demande de l'utilisateur, ou un mécanisme permet de les désactiver ; l'intention est d'éliminer la confusion causée par des changements inattendus | [WCAG 2.2 — 3.2.5 Change on Request](https://www.w3.org/WAI/WCAG22/Understanding/change-on-request.html) | Établi, standard — **niveau AAA seulement** : la préservation du focus et de la valeur à travers une bascule est une exigence de robustesse plus qu'une obligation AA |
| S12 | En l'absence de nom, une requête de conteneur s'évalue contre l'ancêtre le plus proche portant un container-type correspondant ; nommer le conteneur permet de viser un conteneur précis. Les unités cqw, cqh, cqi, cqb, cqmin et cqmax valent 1 % de la dimension correspondante du conteneur de requête, et retombent sur les unités de petit viewport si aucun conteneur éligible n'existe | [MDN — CSS container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries) | Établi — @container et container-type sont Baseline « largement disponible » depuis février 2023 ; fonde la règle de nommage et les unités de seuil |
| S13 | prefers-reduced-motion détecte la préférence système pour un mouvement non essentiel réduit | [MDN — prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) | Établi — Baseline largement disponible depuis janvier 2020 |
| S14 | forced-colors détecte un mode de couleurs forcées imposant une palette limitée choisie par l'utilisateur (mots-clés système CanvasText, ButtonText, Canvas) ; prefers-contrast détecte une préférence de contraste (no-preference, more, less, custom) | [MDN — forced-colors](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors) ; [MDN — prefers-contrast](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast) | Établi — Baseline largement disponible depuis septembre 2022 (forced-colors) et mai 2022 (prefers-contrast) |
| S15 | pointer (none, coarse, fine) et hover (none, hover) décrivent le mécanisme d'entrée **primaire** seulement ; any-pointer et any-hover portent sur l'ensemble des dispositifs disponibles | [MDN — pointer](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer) ; [MDN — hover](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover) | Établi — Baseline largement disponible depuis décembre 2018. **Nuance absente du fichier** : « hover/pointer » ne décrit que le dispositif primaire, un appareil hybride (tactile + souris) n'est pas décrit par ces requêtes |
| S16 | prefers-reduced-data et prefers-reduced-transparency sont marquées expérimentales et en disponibilité limitée ; prefers-reduced-data est signalée comme non prise en charge par les agents utilisateurs, avec des spécificités susceptibles de changer | [MDN — prefers-reduced-data](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-data) ; [MDN — prefers-reduced-transparency](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-transparency) | **Disponibilité limitée / expérimental** — ces deux préférences ne peuvent pas rejoindre la liste des requêtes média « légitimes » du fichier comme si elles étaient acquises ; elles ne sont utilisables qu'en amélioration progressive |
| S17 | Le texte, contrôles et libellés compris, peut être agrandi jusqu'à 200 % sans perte de contenu ni de fonctionnalité | [WCAG 2.2 — 1.4.4 Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html) | Établi, standard (AA) — donne sa mesure au point « zoom et taille de texte accrue » du test |
| S18 | Aucune perte de contenu ni de fonctionnalité lorsque l'utilisateur porte l'interligne à 1,5 fois la taille de police, l'espace après paragraphe à 2 fois, l'interlettrage à 0,12 fois et l'espace entre mots à 0,16 fois | [WCAG 2.2 — 1.4.12 Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html) | Établi, standard (AA) — **critère absent du fichier**, alors qu'il est le stress-test le plus direct d'un seuil dérivé du contenu : l'espacement forcé déborde un composant calé au plus juste |
| S19 | Le contenu ne restreint pas son affichage et son fonctionnement à une seule orientation d'écran, sauf si une orientation est essentielle | [WCAG 2.2 — 1.3.4 Orientation](https://www.w3.org/WAI/WCAG22/Understanding/orientation.html) | Établi, standard (AA) — **contrainte d'environnement jamais mentionnée par le fichier**, dont la liste des requêtes média légitimes omet l'orientation |
| S20 | L'amélioration progressive fournit un socle de contenu et de fonctionnalité au plus grand nombre, les enrichissements n'étant appliqués que si l'agent utilisateur les prend en charge | [MDN — Progressive Enhancement (glossaire)](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement) | Établi comme pratique documentée — le choix d'en faire notre stratégie de dégradation reste un parti pris interne |

## À approfondir

- Formaliser un harness de test qui redimensionne le conteneur sans changer le viewport.
- Éprouver les Container Style Queries quand un besoin de contexte non dimensionnel apparaît.
- Documenter les conventions des futurs composants composites et slots imbriqués.
