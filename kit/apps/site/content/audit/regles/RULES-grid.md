---
sujet: grid
type: fondation
resume: "Largeurs de conteneur structurelles (narrow/default/wide), full-bleed, centrage, marges dérivées de spacing ; grille de colonnes différée"
requires: []
selon-contexte: ["spacing (marges et gouttières = tokens spacing, jamais des valeurs propres)", "typography (mesure de lecture d'un texte = measure.reading-max : frontière, ce n'est pas une largeur de conteneur)"]
---
# RULES — Grille & layout (compilé, condensé)

> Généré depuis `foundations/grid/GRID-UX.md` (v1.0.0) et `GRID-UI.md` (v1.0.0). Règles condensées pour le build — la source fait autorité. Ne pas éditer à la main. Tokens : `dist/tokens.yaml`.

## Nature
- Fondation **sans axes**. Elle porte le **cadre de page** : jusqu'où un conteneur s'étend, quand le borner, quand le laisser déborder.
- Portée de cette version : **largeurs de conteneur** uniquement. La **grille de colonnes** (12 colonnes, gouttières inter-colonnes) est **hors périmètre — différée** jusqu'au pattern collection. Un build qui a besoin d'une grille multi-colonnes s'arrête et remonte.

## Largeurs de conteneur
- Tout conteneur borné référence une largeur `grid.container-*`, jamais une valeur brute ni un `breakpoint.*` détourné (le breakpoint est un point de bascule, pas une max-width).

| Cran | Contexte |
|---|---|
| `grid.container-narrow` | formulaire, auth, création de compte — saisie mono-colonne focalisée |
| `grid.container-default` | page de contenu ou d'app à colonne unique |
| `grid.container-wide` | dashboard, collection, tableau large |

- Le cran suit le contexte, pas l'esthétique : un formulaire reste `narrow` même s'il « aurait la place » en `default`.
- Application : `max-width: grid.container-*` **+** `margin-inline: auto` (centrage). Conteneur imbriqué : n'additionne ni max-width ni marge — la largeur vient du parent.

## Full-bleed
- Un élément décoratif/immersif (hero, bandeau, image de fond, séparateur) peut prendre 100 % de la fenêtre — intention, pas oubli. Le contenu **lisible ou actionnable** à l'intérieur se re-borne sur un `grid.container-*`.

## Marges et régime responsive
- Marge de page = padding horizontal pris dans `spacing` : `spacing.md` en régime mobile, `spacing.lg` en desktop. Jamais une valeur propre à la grille.
- Sous `breakpoint.mobile`, le max-width **ne mord pas** : conteneur en pleine largeur moins la marge. Au-dessus, il borne et centre.
- La bascule change la largeur du conteneur, jamais la nature du contenu.

## Frontières (ce que la grille ne fait pas)
- Largeur d'un **texte courant** → `measure.reading-max` (typographie), pas un conteneur. Densité, gouttières, proximité → `spacing`. Ratio d'un média → `media_ratio`.
- **Grille de colonnes** → différée : STOP et remonter si le build en exige une.

## Risque
| Cas | Risque | Sévérité |
|---|---|---|
| Largeur en dur / breakpoint détourné comme max-width | Cadre non tokenisé, dérive | Élevée |
| Conteneur mono-colonne étalé sans max-width | Regard dispersé, formulaire illisible | Moyenne-élevée |
| Texte courant borné par un conteneur au lieu de `measure` | Mesure de lecture cassée sur grand écran | Moyenne |
| Grille de colonnes improvisée | Système inventé hors périmètre | Élevée |

CONFIANCE : largeurs de conteneur nommées + marges dérivées de l'espacement = établi par convergence (Carbon 2x-grid, GOV.UK, Material). Le choix de **trois** crans (480/1024/1440) est un arbitrage interne daté 2026-07-16, réversible.
