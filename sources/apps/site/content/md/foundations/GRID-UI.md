---
component: grid
layer: ui
type: foundation
version: 1.2.0 # 1.2.0 : tokens des régions du shell (rail-nav, rail-tools) et mapping des seuils (off-canvas nav = breakpoint.tablet, repli outils = breakpoint.desktop). Le comportement overlay d'une région hors flux reste au sujet overlay/drawer (hors périmètre). Valeurs : DESIGN.md 1.29.0. Cf. DECISIONS.md 2026-07-24. 1.1.0 : renvoi gouttières → pattern collection (clause levée le 2026-07-21, cf. DECISIONS.md) ; grid.item-min vit dans DESIGN.md pour COLLECTION-UI. 1.0.0 : première rédaction — mapping des largeurs de conteneur et des marges de page. Valeurs dans DESIGN.md 1.18.0 (groupe grid). Cf. DECISIONS.md 2026-07-16.
last_updated: 2026-07-21
companion: GRID-UX.md
confidence: mixed
---

# Grille & layout — Couche UI (tokens)

> Ce fichier mappe les contextes de GRID-UX.md sur les tokens. Toutes les valeurs vivent dans
> `DESIGN.md` (`grid.*`) et `tokens.yaml` ; aucune valeur brute ici. Les marges et gouttières ne sont
> pas des tokens propres à la grille : ce sont des tokens `spacing` réutilisés.

## Largeurs de conteneur

Trois crans, tous en `max-width` (le conteneur peut être plus étroit que sa borne, jamais plus large) :

```yaml
container:
  narrow:  grid.container-narrow    # formulaire, auth, création de compte — mono-colonne focalisée
  default: grid.container-default   # page de contenu ou d'app à colonne unique
  wide:    grid.container-wide       # dashboard, collection, tableau large
```

RÈGLE [GRID-U01] : un conteneur borné applique en `max-width` l'un des trois tokens (`grid.container-narrow`, `grid.container-default`, `grid.container-wide`) **et** `margin-inline: auto` (centrage).
STATUT : implémentation de référence
SOURCE : T1, T6, T8
ÉNONCÉ : Un conteneur borné applique un token de largeur en largeur maximale et des marges logiques automatiques pour le centrage.
MESURE : largeur maximale résolue vers un token de conteneur, marges logiques automatiques, aucune valeur littérale
Jamais de largeur en dur, jamais un `breakpoint.*` employé comme largeur.

RÈGLE [GRID-U02] : le choix du cran suit le contexte de GRID-UX (narrow/default/wide), pas l'esthétique — un
STATUT : parti pris d'identité
SOURCE : T1, T3
ÉNONCÉ : Le cran de conteneur se choisit sur le contexte fonctionnel documenté en couche UX, non sur l'espace disponible.
formulaire reste `narrow` même s'il « aurait de la place » en `default`.

## Marges de page (tokens spacing, pas grid)

RÈGLE [GRID-U03] : la marge entre le conteneur et le bord de la fenêtre est un padding horizontal pris dans
STATUT : parti pris d'identité
SOURCE : T2
ÉNONCÉ : La marge entre le conteneur et le bord de la fenêtre est un remplissage horizontal pris dans l'échelle d'espacement.
MESURE : remplissage horizontal du conteneur résolu vers un token d'espacement
l'échelle `spacing` :

```yaml
page_margin:
  mobile:  spacing.md   # régime étroit — sous breakpoint.mobile
  desktop: spacing.lg   # régime large — au-dessus de breakpoint.mobile
```

RÈGLE [GRID-U04] : sous `breakpoint.mobile`, le conteneur est en pleine largeur moins `page_margin.mobile` de chaque
STATUT : implémentation de référence
SOURCE : T7, T8
ÉNONCÉ : En régime étroit, le conteneur occupe la pleine largeur moins la marge de page, la largeur maximale restant sans effet.
MESURE : aucun défilement horizontal à 320 px CSS de large
côté ; le `max-width` ne mord pas (le contenu n'atteint pas encore la borne).

## Full-bleed

RÈGLE [GRID-U05] : un élément full-bleed retire le `max-width` et la marge (largeur = 100 % de la fenêtre) ; le
STATUT : implémentation de référence
SOURCE : T1
ÉNONCÉ : Un élément pleine largeur neutralise la largeur maximale et la marge de page, tandis que le contenu lisible qu'il abrite se re-borne sur un token de conteneur.
contenu lisible/actionnable à l'intérieur se re-borne sur l'un des trois tokens `grid.container-narrow`/`grid.container-default`/`grid.container-wide`.

## Gouttière de colonnes

RÈGLE [GRID-U06] : **toujours aucun token de gouttière ici** — la grille de colonnes vit dans le pattern
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Le groupe de tokens de la grille ne contient aucun token de gouttière : les gouttières appartiennent au pattern collection.
MESURE : aucune clé de gouttière dans le groupe grille
collection (COLLECTION-UI.md) depuis le 2026-07-21, et ses gouttières sont bien des tokens `spacing`
(mapping par densité), comme le cadrage SPACING l'exigeait. Seule `grid.item-min` (largeur minimale
d'un item de grille intrinsèque) a rejoint le groupe `grid` de DESIGN.md.

## Implémentation

- `max-width` en `grid.container-narrow`/`grid.container-default`/`grid.container-wide` ; centrage par marges automatiques ; padding horizontal en
  `spacing.md`/`spacing.lg` selon le régime.
- Aucune largeur ni marge codée en dur, même pour une exception : toute exception remonte au design system.
- Un conteneur imbriqué n'ajoute ni `max-width` ni marge de page : il hérite de la largeur du parent.

## Shell applicatif — tokens des régions

Trois régions ; les deux rails ont une largeur fixe en token, le contenu prend le reste :

```yaml
shell:
  rail-nav:   grid.rail-nav     # rail de navigation (début)
  rail-tools: grid.rail-tools   # rail d'outils (fin)
  content:    (espace restant)  # y applique grid.container-narrow / grid.container-default / grid.container-wide comme une page mono-colonne
seuils:
  off-canvas-nav: breakpoint.tablet    # sous 1024 : rail de nav en off-canvas
  repli-outils:   breakpoint.desktop   # sous 1280 : rail d'outils en panneau invocable
```

RÈGLE [GRID-U07] : les rails appliquent `grid.rail-nav` / `grid.rail-tools` en largeur fixe (`flex: 0 0 <token>`), jamais
STATUT : implémentation de référence
SOURCE : T4, T9
ÉNONCÉ : Chaque rail est un élément non flexible dont la base est un token de largeur de rail, la colonne de contenu étant le seul élément flexible.
MESURE : aucune croissance ni rétrécissement sur les rails, base = token de rail
un pourcentage ; la colonne de contenu est l'élément flexible et applique en son sein l'un des `grid.container-narrow / grid.container-default / grid.container-wide`.

RÈGLE [GRID-U08] : les seuils de bascule sont des `breakpoint.*`, jamais une largeur en dur — `breakpoint.desktop` fait
STATUT : parti pris d'identité
SOURCE : T5
ÉNONCÉ : Les seuils de bascule des régions du shell sont des tokens de point de rupture, jamais des largeurs en dur.
MESURE : toute requête média du shell référence un token de point de rupture
sortir le rail d'outils du flux, `breakpoint.tablet` fait sortir le rail de nav (dans cet ordre).

RÈGLE [GRID-U09] : une région hors flux (panneau invocable) relève du registre overlay (`elevation.overlay`, scrim, focus
STATUT : note de méthode
SOURCE : T10, T9
ÉNONCÉ : Une région hors flux relève du registre overlay — élévation dédiée, voile, confinement du focus, verrouillage du défilement.
trap, scroll-lock) — comportement NON porté par la grille ; cf. sujet overlay/drawer (hors périmètre à cette date).

RÈGLE [GRID-U10] : la **marge de page** interne à la colonne de contenu reste celle du cadre de page (`spacing.md`/`spacing.lg`
STATUT : parti pris d'identité
SOURCE : T2
ÉNONCÉ : La marge de page s'applique dans la colonne de contenu, tandis que chaque rail porte son propre remplissage et n'hérite pas de la marge de page.
selon le régime) ; chaque rail a son propre padding (`spacing`), il n'hérite pas de la marge de page.

## Sources et niveau de confiance (couche UI)
| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| T1 | `max-width` + marges auto pour borner et centrer un conteneur | [GOV.UK — Layout](https://design-system.service.gov.uk/styles/layout/) (`govuk-width-container`, max ~1020 px centré) | Établi |
| T2 | Marges/paddings de page pris dans l'échelle d'espacement | [Carbon — 2x Grid](https://carbondesignsystem.com/elements/2x-grid/overview/) (marges 16-24 px, mini-unit de 8 px), [Material — Layout](https://m2.material.io/design/layout/understanding-layout.html) (marges adaptatives) | Établi par convergence |
| T3 | Valeurs exactes des trois conteneurs (480 / 1024 / 1440 px) | Arbitrage interne, calé sur la grille de 8 px et la fourchette des systèmes majeurs | Non formalisé — ajustable sur besoin réel |
| T4 | Rails à largeur fixe + contenu flexible dans un shell | [Carbon — UI Shell](https://carbondesignsystem.com/), convergence des shells d'app | Établi par convergence |
| T5 | Largeurs de rails et seuils du shell (grid.rail-nav, grid.rail-tools, breakpoint.tablet, breakpoint.desktop) | Arbitrage interne, aligné sur la grille de base | Non formalisé — ajustable |
| T6 | Les marges logiques en ligne sont mappées sur des marges physiques selon le mode d'écriture et la direction du texte, et acceptent la valeur automatique | [MDN — margin-inline](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-inline) | Établi — justifie le centrage par propriété logique |
| T7 | Aucun défilement en deux dimensions ni perte d'information à une largeur équivalente à 320 px CSS | [WCAG 2.2 — 1.4.10 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) | Établi, standard (AA) — donne au régime étroit sa mesure vérifiable |
| T8 | La largeur maximale plafonne sans fixer ; note d'accessibilité MDN sur la troncature au zoom | [MDN — max-width](https://developer.mozilla.org/en-US/docs/Web/CSS/max-width) | Établi |
| T9 | Les panneaux droits du shell de Carbon ont une largeur constante, occupent toute la hauteur et flottent au-dessus du contenu | [Carbon — UI shell right panel](https://carbondesignsystem.com/components/UI-shell-right-panel/usage/) | Établi — **nuance le modèle « rail secondaire dans le flux » du fichier** |
| T10 | Contrat d'un dialogue modal : focus confiné, contenu extérieur inerte, focus rendu au déclencheur | [W3C — ARIA APG, Dialog (Modal) Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) | Établi, note du W3C |

*Toute règle sans source explicite repose sur un raisonnement de mécanisme (cohérence avec l'échelle
8 px et les régimes responsive du système) plutôt que sur une étude chiffrée.*
