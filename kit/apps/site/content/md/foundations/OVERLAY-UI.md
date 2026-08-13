---
component: overlay
layer: ui
type: foundation
version: 1.0.0 # 1.0.0 : première rédaction — mapping des tokens de la couche superposée (z-index, scrim) et grammaire d'application (position, inertie, scroll-lock, focus). Valeurs dans DESIGN.md 1.30.0 (groupes z-index et overlay). Cf. OVERLAY-UX.md, DECISIONS.md 2026-07-24.
last_updated: 2026-07-24
companion: OVERLAY-UX.md
confidence: mixed
---

# Overlay — Couche UI (tokens)

> Ce fichier mappe les contextes de OVERLAY-UX.md sur les tokens. Toutes les valeurs vivent dans `DESIGN.md`
> (`z-index.*`, `overlay.scrim`) et `tokens.yaml` ; aucune valeur brute ici. L'ombre est un token ELEVATION,
> les durées un token MOTION.

## Ordre d'empilement

Cinq crans, appliqués en `z-index` — jamais un entier codé en dur :

```yaml
z-index:
  sticky:  z-index.sticky    # 100  — en-tête, rails sticky du shell (dans le flux)
  overlay: z-index.overlay   # 1000 — scrim + surface d'un superposé MODAL (drawer, modale)
  popover: z-index.popover   # 1100 — superposé NON-MODAL ancré (dropdown, menu, popover)
  toast:   z-index.toast     # 1200 — notifications éphémères (toast)
  tooltip: z-index.tooltip   # 1300 — la couche la plus haute
```

RÈGLE [OVERLAY-U01] : la **surface** d'un superposé modal applique `z-index.overlay` ; son **scrim** vit dans la même
STATUT : implémentation de référence
SOURCE : T2, T5
ÉNONCÉ : La surface d'un superposé modal applique le cran z-index.overlay et son voile vit dans la même couche, placé avant la surface dans le DOM afin d'être rendu derrière elle ; un superposé non-modal ancré applique z-index.popover.
MESURE : le voile précède la surface dans l'ordre du DOM et porte le même cran de z-index qu'elle
couche, placé **avant** la surface dans le DOM (rendu derrière). Un superposé non-modal ancré applique
`z-index.popover`.

## Voile (scrim)

RÈGLE [OVERLAY-U02] : le voile d'un superposé modal est un plan plein `overlay.scrim` couvrant la fenêtre
STATUT : implémentation de référence
SOURCE : interne
ÉNONCÉ : Le voile d'un superposé modal est un plan plein de couleur overlay.scrim, en position fixed et inset 0, couvrant la fenêtre et placé sous la surface ; aucun superposé non-modal ne pose de voile.
MESURE : le voile est en position: fixed avec inset: 0 ; aucun voile n'est associé à un superposé non-modal
(`position: fixed`, inset 0), sous la surface. Aucun superposé non-modal ne pose de scrim.

## Ombre et surface

RÈGLE [OVERLAY-U03] : la surface d'un superposé porte l'ombre `elevation.overlay` (jamais `raised`, réservé au survol
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : La surface d'un superposé porte l'ombre elevation.overlay — jamais elevation.raised, réservée au survol cliquable —, le rayon radius.md et le fond background ; overlay consomme ces tokens sans en créer aucun.
MESURE : ombre = elevation.overlay et rayon = radius.md sur la surface de tout superposé
cliquable) et un rayon `radius.md` ; elle repose sur `background`. Overlay **consomme** ces tokens, il n'en
crée aucun.

## Focus, inertie, défilement

RÈGLE [OVERLAY-U04] : à l'ouverture d'un superposé **modal**, le fond reçoit `inert` (ou `aria-hidden`) — non focalisable,
STATUT : propriété universelle
SOURCE : T1, T4
ÉNONCÉ : À l'ouverture d'un superposé modal, le fond reçoit inert (à défaut aria-hidden) — non focalisable et invisible au lecteur d'écran — et le défilement du document est verrouillé ; à la fermeture, l'inertie et le verrou sont retirés et le focus revient au déclencheur.
MESURE : le fond porte inert pendant l'ouverture et ne le porte plus après la fermeture ; le focus revient au déclencheur
invisible au lecteur d'écran — et le défilement du document est **verrouillé** (le fond ne défile pas sous la
surface). À la fermeture, l'inertie et le verrou sont **retirés** et le focus **revient au déclencheur**.

RÈGLE [OVERLAY-U05] : le **focus ring** d'un contrôle à l'intérieur d'un superposé reste celui de BORDER
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Un contrôle situé à l'intérieur d'un superposé conserve l'anneau de focus défini par BORDER (border.focus-width, border.focus-offset) ; overlay ne redéfinit jamais l'anneau.
(`border.focus-width` / `border.focus-offset`) — overlay ne redéfinit pas le ring.

## Mouvement

RÈGLE [OVERLAY-U06] : l'entrée/sortie utilise une durée MOTION (grande surface → `motion.slow`), l'ombre s'anime en
STATUT : parti pris d'identité
SOURCE : T6
ÉNONCÉ : L'entrée et la sortie d'un superposé utilisent une durée MOTION — motion.slow pour une grande surface —, animent l'ombre elevation.overlay en opacité, et suppriment tout glissement sous prefers-reduced-motion.
MESURE : sous prefers-reduced-motion: reduce, aucune transformation de position n'est appliquée au superposé
opacité (`elevation.overlay`), et l'ensemble respecte `prefers-reduced-motion` (pas de glissement si réduit).

## Frontières

RÈGLE [OVERLAY-U07] : aucune valeur d'empilement, d'ombre, de rayon, de durée ou de couleur n'est écrite en dur : tout
STATUT : implémentation de référence
SOURCE : T3
ÉNONCÉ : Aucune valeur d'empilement, d'ombre, de rayon, de durée ou de couleur n'est écrite en dur dans un superposé : tout référence z-index.*, overlay.scrim, elevation.overlay, radius.md, motion.* et border.* ; le toast conserve ses propres règles d'empilement et n'emprunte à overlay que le cran z-index.toast.
MESURE : aucun littéral numérique ou hexadécimal de z-index, ombre, rayon, durée ou couleur dans le code d'un superposé
référence `z-index.*`, `overlay.scrim`, `elevation.overlay`, `radius.md`, `motion.*`, `border.*`. Le toast
conserve ses propres règles d'empilement et n'emprunte à overlay que le cran `z-index.toast`.

## Sources et niveau de confiance (couche UI)
| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| T1 | Fond `inert` + verrouillage du défilement pour un modal | [ARIA APG — Dialog (Modal)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) | Établi |
| T2 | Crans z-index espacés, ordonnés par type de couche | [Microsoft Atlas — Z-index](https://design.learn.microsoft.com/tokens/z-index.html) | Établi par convergence |
| T3 | Valeurs exactes des crans et opacité du scrim | Arbitrage interne (DESIGN.md 1.30.0) | Non formalisé — ajustable |
| T4 | L'attribut inert retire l'élément et tout son sous-arbre de l'ordre de tabulation et de l'arbre d'accessibilité : plus de focus, plus d'événements de clic, invisible aux technologies d'assistance | [MDN — inert](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inert) | Établi, attribut standard largement disponible depuis 2023 |
| T5 | À z-index égal ou non spécifié, les éléments positionnés s'empilent dans l'ordre d'apparition du HTML — c'est ce qui fait qu'un voile placé avant la surface est rendu derrière elle sans cran supplémentaire | [MDN — Stacking without the z-index property](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Positioned_layout/Stacking_without_z-index) | Établi, règle d'empilement CSS |
| T6 | prefers-reduced-motion: reduce signale la préférence utilisateur pour une interface sans mouvement non essentiel | [MDN — prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) | Établi, media feature standard |

*Toute règle sans source explicite repose sur un raisonnement de mécanisme (cohérence avec les fondations voisines).*
