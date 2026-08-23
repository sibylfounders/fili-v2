---
component: select
layer: ui
type: component
version: 1.1.0 # 1.1.0 : la LISTE passe de `radius.md` à `radius.lg` (cran conteneur — une surface flottante n'est pas un contrôle) ; le déclencheur reste `radius.md`. Application de l'axe déclaré par RADIUS-R12, arbitrage Aurélien 2026-08-03. 1.0.0 : première rédaction — mapping tokens du déclencheur et de la liste. Aucun token neuf : hauteur `scale.base`, `radius.md`, `border-strong` (bordure délimitante), `icon.md` (chevron), liste sur `overlay` (elevation.overlay, z-index.popover). Cf. SELECT-UX.md.
last_updated: 2026-07-24
companion: SELECT-UX.md
confidence: mixed
---

# Select — Couche UI (tokens)

> Mapping des contextes de SELECT-UX.md sur les tokens. Aucune valeur brute : le déclencheur est un contrôle
> standard, la liste un superposé non-modal de la fondation `overlay`.

## Déclencheur

RÈGLE [SELECT-U01] : hauteur interactive `scale.base` (compacte `scale.compact`, aérée `scale.expanded`), rayon
STATUT : parti pris d'identité
SOURCE : T1, T2, T4
ÉNONCÉ : Le déclencheur d'un select résout sa hauteur interactive, son rayon, son fond, sa couleur de texte et ses retraits sur les échelles de tokens, et porte une bordure délimitante contrastée à au moins 3:1, seule marque de la présence du contrôle ; son chevron est une icône en couleur courante.
MESURE : aucune valeur brute de hauteur, rayon, couleur ou retrait sur le déclencheur ; contraste de la bordure délimitante ≥ 3:1
`radius.md`, **bordure délimitante `border-strong`** (le select délimite seul un contrôle interactif :
3:1 requis), fond `background`, texte `text-primary` (placeholder `text-muted`), padding pris dans
`spacing`. Le chevron est une icône `icon.md` en `currentColor` (renvoi ICONOGRAPHY).

RÈGLE [SELECT-U02] : l'anneau de focus est celui de BORDER (`border.focus-width` / `border.focus-offset`) ; l'état
STATUT : note de méthode
SOURCE : T2
ÉNONCÉ : L'anneau de focus du select n'est pas redéfini localement : il reprend celui de la fondation bordure, et l'état désactivé abaisse l'opacité sans modifier ni le trait ni le rayon.
MESURE : aucun style de focus propre au select ; trait et rayon identiques entre l'état normal et l'état désactivé
désactivé abaisse l'opacité sans changer le trait ni le rayon.

## Liste (popover non-modal)

RÈGLE [SELECT-U03] : la liste applique `z-index.popover`, l'ombre `elevation.overlay`, le rayon **`radius.lg`** (cran CONTENEUR : la liste est une surface flottante, pas un contrôle — `radius.md` jusqu'au 2026-08-03, cf. RADIUS-R12 ; le DÉCLENCHEUR, lui, reste `radius.md` parce qu'il est bien un contrôle), le fond
STATUT : implémentation de référence
SOURCE : T1
ÉNONCÉ : La liste d'un select reprend le niveau d'empilement, l'ombre, le rayon et le fond du superposé non modal, sans voile, et s'aligne en ancrage comme en largeur sur son déclencheur.
MESURE : la liste applique le token d'empilement popover et l'ombre de superposé ; aucun voile n'est rendu ; largeur de la liste égale à celle du déclencheur
`background` ; **pas de scrim** (non-modal). Elle est ancrée au déclencheur et alignée sur sa largeur.

RÈGLE [SELECT-U04] : une option a un padding `spacing` ; l'option **active** (survol/clavier) prend `surface-hover` ;
STATUT : propriété universelle
SOURCE : T3
ÉNONCÉ : L'option sélectionnée d'une liste est marquée par un canal non chromatique — une coche — en plus de toute variation de couleur, et l'option active se distingue par une surface qui lui est propre.
MESURE : l'option sélectionnée porte un indicateur non chromatique ; la distinction entre option active et option sélectionnée ne repose pas sur la seule couleur
l'option **sélectionnée** est marquée par une **coche** (icône, jamais la seule couleur — canal redondant,
renvoi ACCESSIBILITY/ICONOGRAPHY) et un texte `text-primary`.

## Mouvement

RÈGLE [SELECT-U05] : l'ouverture/fermeture de la liste utilise `motion.base` et respecte `prefers-reduced-motion`
STATUT : propriété universelle
SOURCE : T5
ÉNONCÉ : L'ouverture et la fermeture de la liste empruntent leurs durées et leurs courbes aux tokens de mouvement, et se réduisent à une apparition sans glissement lorsque l'utilisateur a demandé moins de mouvement.
MESURE : aucune durée ni courbe en dur ; sous prefers-reduced-motion: reduce, aucune translation n'est jouée
(apparition sans glissement si réduit) ; l'ombre suit `elevation.overlay` (animée en opacité).

## Frontières

RÈGLE [SELECT-U06] : aucune valeur d'empilement, d'ombre, de rayon, de hauteur ou de couleur codée en dur : tout
STATUT : note de méthode
SOURCE : T6
ÉNONCÉ : Aucune valeur d'empilement, d'ombre, de rayon, de hauteur, de couleur, de retrait ni de durée du select n'est codée en dur : chacune résout un token de fondation, et la cible pointeur du déclencheur atteint le seuil de confort retenu par l'accessibilité.
MESURE : aucune valeur brute dans l'implémentation du select ; cible pointeur du déclencheur ≥ 44 × 44 px CSS
référence `scale.*`, `radius.*`, `border-strong`, `icon.*`, `z-index.popover`, `elevation.overlay`,
`spacing.*`, `motion.*`, `border.*`. La cible tactile respecte le minimum de 44px (ACCESSIBILITY).

## Sources et niveau de confiance (couche UI)
| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| T1 | Liste ancrée en `elevation.overlay` + `z-index.popover`, sans scrim | fondation `overlay` (OVERLAY-UI) | Établi (interne) |
| T2 | Bordure délimitante d'un contrôle interactif à 3:1 → `border-strong` | BORDER-UX (guardrail) | Établi (interne) |
| T3 | La couleur n'est jamais le seul moyen visuel de véhiculer une information, d'indiquer une action, d'appeler une réponse ou de distinguer un élément visuel | [WCAG 2.2 — 1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) | Établi, standard (niveau A) — fonde la coche sur l'option sélectionnée |
| T4 | La présentation visuelle des composants d'interface atteint un contraste d'au moins 3:1 avec les couleurs adjacentes ; une bordure n'est exigée que lorsqu'aucun autre indice visuel n'identifie la présence du contrôle | [WCAG 2.2 — 1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) | Établi, standard (niveau AA) — donne à T2 son ancrage externe et sa condition : le 3:1 porte sur la bordure seulement si elle est le seul indice du contrôle |
| T5 | L'animation de mouvement déclenchée par une interaction peut être désactivée sauf si elle est essentielle ; la préférence système se lit par prefers-reduced-motion, dont la valeur reduce demande de supprimer ou de remplacer le mouvement non essentiel | [WCAG 2.2 — 2.3.3 Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) ; [MDN — prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) | Établi — 2.3.3 est de niveau AAA et n'impose pas prefers-reduced-motion comme unique technique ; ancrage assumé, la média-requête n'est qu'une des solutions suffisantes |
| T6 | La cible pointeur mesure au moins 24 × 24 px CSS (AA), avec exceptions dont le rendu par défaut du navigateur ; le seuil renforcé de 44 × 44 px CSS relève du niveau AAA | [WCAG 2.2 — 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) ; [WCAG 2.2 — 2.5.5 Target Size (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html) | Établi, standard (AA et AAA) — le 44 px cité par le composant est le seuil AAA, pas le seuil de conformité courant ; l'exception « contrôle du navigateur » joue en faveur du select natif |

*Toute règle sans source explicite repose sur un raisonnement de mécanisme (cohérence avec les fondations voisines).*
