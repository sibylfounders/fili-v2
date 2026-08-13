---
component: grid
layer: ux
type: foundation
version: 1.2.0 # 1.2.0 : extension au SHELL applicatif — trois régions (rail de nav + contenu + rail d'outils), ordre de dégradation (le rail d'outils secondaire cède avant la nav), off-canvas sous breakpoint.tablet, repli des outils sous breakpoint.desktop. Le comportement overlay d'une région hors flux (scrim, focus trap, scroll-lock) reste hors périmètre (sujet overlay/drawer). Tokens : DESIGN.md 1.29.0. Cf. DECISIONS.md 2026-07-24. 1.1.0 : la clause de naissance est levée — la grille de colonnes appartient au pattern collection (COLLECTION-UX/UI, 2026-07-21, cf. DECISIONS.md) ; ce fichier garde le cadre de page ; grid.item-min vit dans DESIGN.md pour le pattern. 1.0.1 : vocabulaire aligné sur le modèle style × tone du bouton (DECISIONS 2026-07-18), aucune règle modifiée. 1.0.0 : première rédaction — fondation née du besoin prouvé « largeur de conteneur » (pilotes externes 2026-07-16, deux occurrences indépendantes). Inventaire et benchmark faits AVANT livraison (leçon typographie). La grille de colonnes reste différée (cf. note de transposition). Cf. DECISIONS.md 2026-07-16.
last_updated: 2026-07-21
companion: GRID-UI.md
confidence: mixed # les largeurs de conteneur et la mesure de lecture sont établies (convergence Carbon/GOV.UK/Material) ; le nombre exact de crans de conteneur est un arbitrage interne, marqué comme tel
---

# Grille & layout — Couche UX (fondation)

> Ce fichier porte le raisonnement du **cadre de page** : quelle largeur maximale un conteneur doit
> prendre, quand le borner, quand le laisser déborder. Pour les valeurs exactes (largeurs, marges,
> mapping des contextes), voir `GRID-UI.md`.

## Note de transposition — ce que cette fondation est, et n'est pas

Comme toute fondation, `grid` **n'a pas d'axes** (style/tone/size) : ce sont des propriétés de
composant, pas de contrainte transversale. Deux frontières la définissent en négatif :

- **≠ mesure de lecture.** La largeur maximale d'un *texte courant* (≈ 45-75 caractères par ligne) est
  déjà `measure.reading-max`, propriété de la typographie — pas de la grille. Un conteneur de formulaire
  n'est pas un bloc de prose : il se borne pour le focus et l'ergonomie de saisie, pas pour la lisibilité
  d'un paragraphe.
- **≠ espacement.** La *proximité* (gouttières, marges, densité) dérive de l'échelle `spacing` et lui
  appartient. La grille ne redéfinit aucune valeur d'espace : elle les **compose** en un cadre de page.

Et surtout, cette fondation **ne documente pas la grille de colonnes** (colonnes, gouttières
d'une collection) — non plus par report, mais par **propriété** : la clause de naissance écrite ici
(« la grille de colonnes naîtra avec le pattern collection/grille ») a été levée le 2026-07-21 —
le pattern `collection` (COLLECTION-UX/UI) possède désormais colonnes, gouttières et régimes de
grille. Cette fondation garde le cadre de page ; le refus d'anticiper sans consommateur reste la leçon.

## But

Un conteneur de page a une largeur maximale au-delà de laquelle il cesse d'être utile : un formulaire
étalé sur 1600 px disperse le regard, un tableau bridé à 480 px étouffe. Cette fondation nomme les
quelques largeurs de conteneur du système et dit laquelle répond à quel contexte — pour qu'aucun agent
n'ait à inventer une largeur, ni à détourner un breakpoint faute de token (le trou exact qu'ont révélé
les pilotes).

## Largeurs de conteneur

RÈGLE [GRID-R01] : tout conteneur de page borné référence une largeur de `grid.container-*`, jamais une valeur brute
STATUT : parti pris d'identité
SOURCE : S1, S5
ÉNONCÉ : Tout conteneur de page borné tire sa largeur maximale d'un token de conteneur nommé, jamais d'une valeur brute ni d'un point de rupture détourné en largeur.
MESURE : aucune largeur maximale littérale ni token de point de rupture dans une déclaration de largeur de conteneur
ni un breakpoint détourné — `breakpoint.*` est un point de bascule responsive, pas une largeur maximale.

RÈGLE [GRID-R02] : **narrow** — saisie mono-colonne focalisée : formulaire, écran d'authentification, création de
STATUT : parti pris d'identité
SOURCE : S1, S12
ÉNONCÉ : Un écran de saisie mono-colonne focalisée applique le cran de conteneur le plus étroit et se centre.
compte. Le conteneur se centre et reste étroit pour tenir le regard sur une seule colonne d'actions.

RÈGLE [GRID-R03] : **default** — page de contenu ou d'application à colonne unique : réglages, article, tableau de
STATUT : parti pris d'identité
SOURCE : S1, S12
ÉNONCÉ : Une page de contenu ou d'application à colonne unique applique le cran de conteneur intermédiaire.
bord simple. Largeur intermédiaire, confort de scan.

RÈGLE [GRID-R04] : **wide** — surface dense assumée : dashboard, collection, tableau large. Largeur maximale haute ;
STATUT : parti pris d'identité
SOURCE : S1, S13
ÉNONCÉ : Une surface dense assumée applique le cran de conteneur le plus large, qui reste borné au lieu de suivre la fenêtre indéfiniment.
au-delà, le contenu se disperse plutôt qu'il ne respire.

> **Pourquoi trois crans et pas un continuum** : les systèmes majeurs convergent vers quelques largeurs
> nommées (Carbon borne à 1584 px en 16 colonnes, GOV.UK à ~1020 px, Material cadre par window size
> classes) plutôt qu'une largeur libre — un petit jeu fermé se retient, se teste et se re-thématise ;
> une largeur au cas par cas ne se vérifie pas. CONFIANCE : le principe est établi (convergence) ; le
> choix de **trois** crans précisément est un arbitrage interne au produit.

## Pleine largeur (full-bleed)

RÈGLE [GRID-R05] : un élément décoratif ou immersif (hero, bandeau, image de fond, séparateur de section) peut
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Un élément décoratif ou immersif peut délibérément déborder le conteneur, ce débordement étant déclaré comme une intention et non subi.
**déborder** le conteneur et prendre toute la largeur de la fenêtre — c'est une intention, pas un oubli
de max-width.

RÈGLE [GRID-R06] : le contenu *lisible ou actionnable* à l'intérieur d'un full-bleed reste, lui, borné par un
STATUT : parti pris d'identité
SOURCE : S3
ÉNONCÉ : Le contenu lisible ou actionnable placé dans un bloc pleine largeur se re-borne sur un conteneur nommé et ne s'étale jamais d'un bord à l'autre.
MESURE : aucun texte ni contrôle plus large que le cran de conteneur le plus large dans un bloc pleine largeur
conteneur — un titre de hero ne s'étale pas d'un bord à l'autre sur grand écran.

## Marges et centrage

RÈGLE [GRID-R07] : un conteneur borné se **centre** dans la fenêtre (marges automatiques) ; il ne s'aligne pas à
STATUT : parti pris d'identité
SOURCE : S1
ÉNONCÉ : Un conteneur borné se centre par marges automatiques symétriques dès que la fenêtre dépasse sa borne.
MESURE : marges horizontales gauche et droite égales au-dessus de la borne
gauche « par défaut » ni ne se centre un bloc qui, lui, appartient à une grille de contenu alignée.

RÈGLE [GRID-R08] : la **marge de page** (espace entre le conteneur et le bord de l'écran) dérive de l'échelle
STATUT : parti pris d'identité
SOURCE : S4
ÉNONCÉ : La marge entre le conteneur et le bord de la fenêtre est prise dans l'échelle d'espacement et n'introduit aucune valeur propre à la grille.
MESURE : toute marge de page résout vers un token de l'échelle d'espacement
`spacing` — resserrée en régime mobile, plus large en desktop — jamais une valeur propre à la grille.

> **Pourquoi** : sur mobile, une marge trop large mange la surface utile ; sur desktop, une marge nulle
> colle le contenu aux bords. Le même principe de proximité que `spacing`, appliqué au cadre de page.

## Conteneurs imbriqués

RÈGLE [GRID-R09] : un conteneur dans un conteneur (une carte dans une page bornée) **n'additionne pas** les
STATUT : parti pris d'identité
SOURCE : S10, S16
ÉNONCÉ : Un conteneur imbriqué dans un conteneur déjà borné hérite de la largeur du parent et n'applique ni seconde largeur maximale ni seconde marge de page.
MESURE : aucune chaîne d'ancêtres ne porte deux largeurs maximales de conteneur ni deux marges de page
largeurs maximales ni les marges — la largeur vient du parent, l'enfant remplit ou se subdivise, il ne
se re-borne pas une seconde fois.

## Régime responsive

RÈGLE [GRID-R10] : sous `breakpoint.mobile`, le max-width **ne mord pas** — le conteneur prend la pleine largeur
STATUT : propriété universelle
SOURCE : S9, S10, S17
ÉNONCÉ : En dessous de sa borne, un conteneur occupe la largeur disponible moins la marge de page, et aucun contenu ne provoque de défilement horizontal à 320 px CSS de large.
MESURE : aucun défilement horizontal à 320 px CSS de large
moins la marge de page. Au-dessus, le max-width borne et centre.

RÈGLE [GRID-R11] : la bascule mobile/desktop change la **largeur** du conteneur, jamais la nature de son contenu —
STATUT : propriété universelle
SOURCE : S9, S11
ÉNONCÉ : Le passage d'un régime de largeur à l'autre ne retire ni n'altère aucune information ni fonctionnalité, et ne restreint pas l'usage à une seule orientation.
MESURE : à 320 px CSS de large, la totalité du contenu et des fonctions reste disponible, en portrait comme en paysage
cohérent avec le cadrage de SPACING (deux régimes réels, un seul breakpoint, pas une gamme de paliers).

## Frontières (ce que la grille ne fait pas)

RÈGLE [GRID-R12] : la largeur d'un **texte courant** relève de `measure.reading-max` (typographie), pas d'un
STATUT : note de méthode
SOURCE : S3
ÉNONCÉ : La largeur maximale d'un texte courant relève du token de mesure de lecture de la typographie et non d'un conteneur de grille.
`grid.container-*`. Si le besoin est « que cette prose reste lisible », c'est la mesure, pas le conteneur.

RÈGLE [GRID-R13] : la **densité**, les **gouttières** et la **proximité** relèvent de `spacing`. La grille compose
STATUT : note de méthode
SOURCE : S4
ÉNONCÉ : La densité, les gouttières et la proximité relèvent de l'échelle d'espacement ; la grille compose ces tokens et n'en crée aucun.
MESURE : aucun token d'espacement défini dans le groupe grille
des tokens `spacing`, elle n'en crée aucun.

RÈGLE [GRID-R14] : le **ratio** d'un média relève de `media_ratio`. La grille donne la largeur disponible, pas la
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Le rapport de forme d'un média relève de son propre sujet ; la grille ne fournit que la largeur disponible.
proportion de l'image.

RÈGLE [GRID-R15] : la **grille de colonnes** (nombre de colonnes, gouttières inter-colonnes d'une collection)
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : La grille de colonnes d'une collection appartient au pattern collection ; la fondation grille ne porte que le cadre de page.
MESURE : un build multi-colonnes charge les règles du pattern collection
appartient au **pattern collection** (COLLECTION-UX/UI) depuis le 2026-07-21 — un build multi-colonnes
charge RULES-collection ; ce fichier ne porte que le cadre de page.

## Shell applicatif — régions

> Le cadre de page ci-dessus borne UNE colonne de contenu. Un shell applicatif (documentation, dashboard,
> back-office) compose en plus des **régions permanentes** autour du contenu. Cette section étend la fondation
> au cadre multi-régions — elle ne remplace pas le conteneur, elle l'enchâsse.

RÈGLE [GRID-R16] : le shell a **trois régions** — un **rail de navigation** (début / gauche en LTR), la **colonne de
STATUT : parti pris d'identité
SOURCE : S6, S14
ÉNONCÉ : Un shell applicatif se compose d'un rail de navigation, d'une colonne de contenu qui applique le cadre de page, et d'un rail d'outils secondaire.
contenu** (qui applique le cadre de page ci-dessus, borné ou plein), un **rail d'outils** (fin / droite). Le
rail d'outils est la région **secondaire** : rien de ce qu'il porte (theming, playground, sommaire de page)
n'est nécessaire pour lire ou pour naviguer.

RÈGLE [GRID-R17] : le rail de navigation référence `grid.rail-nav`, le rail d'outils `grid.rail-tools` — largeurs fixes,
STATUT : parti pris d'identité
SOURCE : S8, S14
ÉNONCÉ : Chaque rail tire sa largeur d'un token dédié à largeur fixe, la colonne de contenu prenant l'espace restant.
MESURE : largeur de chaque rail = token dédié, jamais une unité relative à la fenêtre
jamais une valeur brute ni une fraction de la fenêtre. La colonne de contenu prend l'espace restant et y
applique son `grid.container-*`.

RÈGLE [GRID-R18] : **ordre de dégradation** (de la plus grande à la plus petite fenêtre) :
STATUT : parti pris d'identité
SOURCE : S7, S13, S14
ÉNONCÉ : Quand la largeur se raréfie, les régions du shell quittent le flux dans l'ordre inverse de leur priorité, la colonne de contenu ne cédant jamais.
MESURE : à toute largeur de fenêtre, la colonne de contenu est présente dans le flux
- au-dessus de `breakpoint.desktop` : les trois régions coexistent dans le flux ;
- entre `breakpoint.tablet` et `breakpoint.desktop` : le rail d'outils **cède le premier** — il quitte le flux
  et devient un **panneau invocable** ; nav + contenu restent ;
- sous `breakpoint.tablet` : le rail de navigation passe à son tour en **off-canvas** ; le contenu occupe toute
  la largeur ; les deux rails sont alors invocables à la demande.

> **Pourquoi le rail d'outils cède avant la nav** : la navigation est un besoin permanent (savoir où l'on est,
> aller ailleurs) ; les outils sont un confort. Quand la largeur devient rare, on sacrifie le confort avant le
> repère. CONFIANCE : le principe « la région secondaire cède d'abord » est établi ; les deux seuils exacts
> (1024 / 1280) et les largeurs de rails (280 / 320) sont un arbitrage interne, à éprouver.

RÈGLE [GRID-R19] : **off-canvas = overlay** : une région retirée du flux recouvre le contenu au lieu de le pousser ; elle
STATUT : note de méthode
SOURCE : S15, S14
ÉNONCÉ : Une région retirée du flux relève du registre overlay — voile, confinement du focus, verrouillage du défilement, retour du focus — comportement que la grille ne spécifie pas.
relève donc du registre overlay (scrim, piège de focus, verrouillage du défilement, retour du focus au
déclencheur). Ce comportement n'est **pas** spécifié par la grille — il appartient au sujet **overlay/drawer**,
hors périmètre à cette date : un build qui l'implémente **remonte avant de coder**.

RÈGLE [GRID-R20] : **frontière contenu vs shell** : les paliers `breakpoint.tablet` / `breakpoint.desktop` pilotent la
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Les paliers de bascule du shell pilotent la présence des rails et non les régimes du conteneur de contenu : deux échelles distinctes.
**présence des rails**, pas les régimes du conteneur de contenu — qui n'en a toujours que deux. Trois paliers
de shell, deux régimes de contenu : deux échelles distinctes, pas une contradiction avec « deux régimes réels ».

## Sources et niveau de confiance (couche UX)
| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| S1 | Un conteneur de page a une largeur maximale nommée (petit jeu fermé) | [Carbon — 2x Grid](https://carbondesignsystem.com/elements/2x-grid/overview/) (max 1584 px, 16 colonnes), [GOV.UK — Layout](https://design-system.service.gov.uk/styles/layout/) (wrapper ~1020 px) | Établi par convergence |
| S2 | Cadrer la largeur par classes de fenêtre plutôt qu'en continu | [Material — Responsive layout grid](https://m2.material.io/design/layout/responsive-layout-grid.html) (window size classes, marges/gouttières adaptatives) | Établi chez Material |
| S3 | Mesure de lecture ≈ 45-75 caractères, ≤ 80 (distincte de la largeur de conteneur) | [Baymard — Line length](https://baymard.com/blog/line-length-readability), WCAG 1.4.8 (≤ 80 caractères) | Établi — c'est l'argument de la frontière grid ≠ measure |
| S4 | Gouttières et marges dérivées de l'échelle d'espacement | [Atlassian — Grid](https://atlassian.design/foundations/grid-beta) (gouttières = valeurs spacing), [Carbon — 2x Grid](https://carbondesignsystem.com/elements/2x-grid/overview/) (mini-unit 8px) | Établi — cohérent avec le cadrage SPACING |
| S5 | Nombre exact de crans de conteneur (trois) | Arbitrage interne au produit | Non formalisé — à éprouver, ajustable sur besoin réel |
| S6 | Shell d'app/doc à trois régions (nav + contenu + outils/aside) | [Carbon — UI Shell](https://carbondesignsystem.com/), [Docusaurus — doc + TOC](https://docusaurus.io/), [Backstage — Layout](https://backstage.io/) | Établi par convergence |
| S7 | La région secondaire cède avant la primaire quand la place manque | Raisonnement de hiérarchie (repère permanent > confort) ; convergence des shells responsives | Établi (mécanisme) |
| S8 | Seuils exacts 1024 / 1280 et largeurs de rails 280 / 320 px | Arbitrage interne au produit (grille de 4px) | Non formalisé — à éprouver |
| S9 | Le contenu est présentable sans perte d'information ni de fonctionnalité et sans défilement en deux dimensions à une largeur équivalente à 320 px CSS, soit 1280 px à 400 % de zoom | [WCAG 2.2 — 1.4.10 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) | Établi, standard (AA) — **la seule norme qui contraigne directement le cadre de page, absente du fichier** |
| S10 | La largeur maximale ne fait qu'empêcher la largeur utilisée de dépasser la valeur donnée : l'élément peut être plus étroit. Une note d'accessibilité demande qu'un élément ainsi borné ne soit ni tronqué ni masquant au zoom | [MDN — max-width](https://developer.mozilla.org/en-US/docs/Web/CSS/max-width) | Établi — fonde « la borne ne mord pas » et la borne unique par conteneur |
| S11 | Le contenu ne restreint pas son affichage à une seule orientation, sauf si une orientation est essentielle | [WCAG 2.2 — 1.3.4 Orientation](https://www.w3.org/WAI/WCAG22/Understanding/orientation.html) | Établi, standard (AA) |
| S12 | Le composant Page de Polaris expose deux largeurs nommées : pleine largeur et largeur étroite, cette dernière explicitement destinée aux dispositions mono-colonne | [Shopify Polaris — Page](https://polaris-react.shopify.com/components/layout-and-structure/page) | Établi — un troisième système public converge sur un petit jeu fermé de largeurs nommées |
| S13 | Les classes de taille de fenêtre sont définies en largeur (compact, medium, expanded, large, extra-large) et servent aux décisions de disposition de haut niveau | [Android / Material — Use window size classes](https://developer.android.com/develop/adaptive-apps/guides/use-window-size-classes) | Établi — **remplace le lien Material 2 de S2, qui documente une grille 12 colonnes et non des classes de taille** |
| S14 | Le shell de Carbon distingue un en-tête, un panneau gauche fixé sous l'en-tête et un panneau droit optionnel de largeur constante et pleine hauteur, ces panneaux flottant toujours au-dessus du contenu | [Carbon — UI shell left panel](https://carbondesignsystem.com/components/UI-shell-left-panel/usage/) ; [Carbon — UI shell right panel](https://carbondesignsystem.com/components/UI-shell-right-panel/usage/) | Établi — **remplace un lien vers une page d'accueil. Contredit partiellement le fichier : en-tête omis, et rail secondaire toujours en superposition chez Carbon** |
| S15 | Contrat d'un dialogue modal : focus déplacé à l'intérieur, tabulation confinée, contenu extérieur inerte et visuellement obscurci, focus rendu au déclencheur à la fermeture | [W3C — ARIA APG, Dialog (Modal) Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) | Établi, note du W3C — source du contrat overlay que la grille délègue |
| S16 | Les requêtes de conteneur permettent à un composant de réagir à la taille de son conteneur plutôt qu'à celle de la fenêtre ; les requêtes média ne connaissent que la fenêtre | [MDN — Container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries) | Établi — **mécanisme absent du fichier, dont tout le récit responsive est fondé sur la fenêtre** |
| S17 | Le texte peut être agrandi jusqu'à 200 % sans perte de contenu ni de fonctionnalité | [WCAG 2.2 — 1.4.4 Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html) | Établi, standard (AA) |

*Toute règle de cette couche sans source explicite ci-dessus repose sur un raisonnement de mécanisme
(ergonomie, cohérence interne) plutôt que sur une étude chiffrée.*

## À approfondir (hors scope de cette version)
- La **grille de colonnes** — née le 2026-07-21 dans le pattern collection (grille intrinsèque,
  pas de N-colonnes canonique) ; son test de transposition a bien eu lieu chez elle.
- Un **palier intermédiaire** (tablette) — s'ajoutera sur besoin réel observé, pas par mimétisme.
