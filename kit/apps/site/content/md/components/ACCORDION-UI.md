---
component: accordion
layer: ui
type: component
version: 1.0.0 # 1.0.0 : première rédaction — mapping tokens. Aucun token neuf : en-tête au survol `surface-hover`, `radius.md`, chevron `icon.sm`/`icon.md`, dépliage `motion.base`, séparateur `border`. Cf. ACCORDION-UX.md.
last_updated: 2026-07-24
companion: ACCORDION-UX.md
confidence: mixed
---

# Accordion — Couche UI (tokens)

> Mapping des contextes de ACCORDION-UX.md sur les tokens. Aucune valeur brute.

## En-tête

RÈGLE [ACCORDION-U01] : l'en-tête a un padding pris dans `spacing`, un rayon `radius.md` sur son fond de survol
STATUT : parti pris d'identité
SOURCE : T1, T2
ÉNONCÉ : L'en-tête d'accordéon résout son retrait, le rayon de son fond de survol et sa couleur de texte sur les tokens, et son chevron — icône en couleur courante — pivote à l'ouverture par transformation, aux durées et courbes des tokens de mouvement.
MESURE : aucune valeur brute sur l'en-tête ; le chevron pivote par transformation, sans substitution d'icône
(`surface-hover`), un texte `text-primary`. Le **chevron** est une icône `icon.sm` (ou `icon.md`) en
`currentColor` (couleur `text-muted`/`text-secondary`), qui **pivote** à l'ouverture via `transform` +
`motion.base` / `motion.ease-in-out`. Anneau de focus = BORDER (`border.focus-width` / `border.focus-offset`).

## Région

RÈGLE [ACCORDION-U02] : la région ouverte a un padding `spacing` ; un **séparateur** entre sections, si nécessaire, est un
STATUT : parti pris d'identité
SOURCE : T2, T3
ÉNONCÉ : La région ouverte prend son retrait dans l'échelle d'espacement, et la séparation entre deux sections passe d'abord par l'espace, le trait n'intervenant qu'en dernier recours.
MESURE : la séparation par défaut entre deux sections est un espacement, non un trait
trait `border` — mais l'**espace d'abord** (renvoi SPACING/BORDER : le trait en dernier recours). Le
dépliage anime la hauteur en `motion.base`, `prefers-reduced-motion` respecté (bascule instantanée).

## Frontières

RÈGLE [ACCORDION-U03] : aucune couleur, rayon ou durée codés en dur : tout référence `spacing.*`, `radius.md`,
STATUT : note de méthode
SOURCE : T4
ÉNONCÉ : Aucune couleur, rayon ni durée de l'accordéon n'est codé en dur — chacun résout un token de fondation — et la cible pointeur de l'en-tête atteint le seuil de confort retenu par l'accessibilité.
MESURE : aucune valeur brute dans l'implémentation de l'accordéon ; cible pointeur de l'en-tête ≥ 44 × 44 px CSS
`surface-hover`, `text-*`, `icon.*`, `motion.*`, `border`. La cible tactile de l'en-tête respecte 44px
(ACCESSIBILITY).

## Sources et niveau de confiance (couche UI)
| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| T1 | Chevron qui pivote comme indicateur d'état, animé en motion | convergence des systèmes | Établi par convergence |
| T2 | Espace avant le trait pour séparer les sections | SPACING-UX / BORDER-UX (guardrail) | Établi (interne) |
| T3 | L'animation déclenchée par interaction doit pouvoir être désactivée ; prefers-reduced-motion: reduce exprime cette demande de l'utilisateur | [WCAG 2.2 — 2.3.3 Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) ; [MDN — prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) | Établi — niveau AAA, plusieurs techniques suffisantes admises |
| T4 | La cible pointeur mesure au moins 24 × 24 px CSS (AA) ; le seuil renforcé de 44 × 44 px CSS relève du niveau AAA | [WCAG 2.2 — 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) ; [WCAG 2.2 — 2.5.5 Target Size (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html) | Établi, standard (AA et AAA) — le 44 px du composant est le seuil AAA, pas le seuil de conformité courant |

*Toute règle sans source explicite repose sur un raisonnement de mécanisme (cohérence avec les fondations voisines).*
