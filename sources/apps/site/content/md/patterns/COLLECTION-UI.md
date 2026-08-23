---
component: collection
layer: ui
type: pattern
version: 1.0.0 # 1.0.0 : première rédaction — mapping tokens/techniques du pattern collection. Un seul token nouveau : grid.item-min (DESIGN.md 1.27.0). Gouttières = tokens spacing (cadrage SPACING respecté) ; autorité du gap transférée depuis CARD-UI (DECISIONS.md 2026-07-21).
last_updated: 2026-07-21
companion: COLLECTION-UX.md
confidence: mixed
---

# Collection — Couche UI (tokens et techniques)

> Ce fichier mappe les règles de `COLLECTION-UX.md` sur les tokens et les techniques. Toutes les valeurs vivent dans `DESIGN.md` / `tokens.yaml` ; **un seul token est né avec ce pattern** (`grid.item-min`, DESIGN.md 1.27.0) — tout le reste compose l'existant. Les tokens internes d'une carte (padding, slot_gap, ratio) restent dans `CARD-UI.md`.

## Grille intrinsèque (régime items homogènes)

RÈGLE [COLLECTION-U01] : la grille de référence tient en une déclaration — colonnes émergentes, sans media query :
STATUT : implémentation de référence
SOURCE : T1, T2
ÉNONCÉ : La grille d'items se déclare par une répétition de colonnes bornées par une largeur minimale d'item et une fraction de l'espace restant, sans requête média ; la largeur minimale est plafonnée par la largeur du conteneur, et le mode de répétition retenu ne remplit pas les colonnes manquantes de la dernière rangée.
MESURE : aucune requête média ne définit le nombre de colonnes ; la largeur minimale d'item est bornée par la largeur du conteneur

```css
.collection {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, var(--grid-item-min)), 1fr));
  gap: var(--collection-gap);
}
```

- `--grid-item-min` ← `grid.item-min` (valeur unique du pattern, définie dans DESIGN.md — 64 × la grille de base ; arbitrée le 2026-07-21).
- `min(100%, …)` : dans un conteneur plus étroit que l'item minimal (sidebar, split), la grille passe à une colonne au lieu de déborder — jamais de scroll horizontal accidentel.
- **`auto-fill`, jamais `auto-fit`** : la dernière rangée incomplète garde la largeur d'item ; `auto-fit` étirerait les derniers items (déformation interdite par la couche UX).

RÈGLE [COLLECTION-U02] : sous `breakpoint.mobile`, colonne unique pleine largeur (moins la marge de page `GRID-UI`) — le comportement émerge déjà de `min(100%, …)` dans la plupart des cas ; la media query n'est ajoutée que si un item plus étroit que `grid.item-min` doit malgré tout occuper toute la largeur.
STATUT : implémentation de référence
SOURCE : T1
ÉNONCÉ : Sous le point de rupture mobile, la colonne unique n'est forcée par une requête média que lorsqu'elle n'émerge pas déjà du plafonnement de la largeur minimale d'item.

## Gouttières (tokens spacing, pas grid)

RÈGLE [COLLECTION-U03] : une seule valeur de gouttière par collection (colonnes ET rangées), appareillée à la densité `CARD` :
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : La gouttière d'une collection est un token d'espacement unique par niveau de densité, appliqué identiquement aux colonnes et aux rangées.
MESURE : une seule déclaration d'espacement de grille par collection, résolue vers un token d'espacement

```yaml
collection_gap:
  comfortable: spacing.lg   # collections aérées (galerie, catalogue)
  compact:     spacing.md   # dashboards denses, listes d'admin
```

RÈGLE [COLLECTION-U04] : **transfert d'autorité** — `CARD-UI.md` portait `grid_gap: spacing.md` en attente de propriétaire ; cette ligne est désormais un alias de compatibilité qui renvoie ici (CARD-UI 1.5.1, journalisé). Aucune valeur ne change pour l'existant : `compact` reprend `spacing.md`.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Le token de gouttière autrefois porté par le composant d'item devient un alias de compatibilité renvoyant au pattern de collection, sans changement de valeur pour l'existant.

## Cadre et zone de collection

RÈGLE [COLLECTION-U05] : le conteneur de page d'une collection est `grid.container-wide` (max-width + centrage — `GRID-UI` fait autorité) ; la grille remplit ce cadre, elle ne se re-borne pas.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Le cadre de page d'une collection est le conteneur borné défini par les fondations de grille ; la grille de collection remplit ce cadre et ne se re-borne pas.
MESURE : aucune largeur maximale déclarée sur la grille elle-même

RÈGLE [COLLECTION-U06] : la zone de collection (grille + barre d'outils + compteur) peut se poser sur le fond `surface` (token calibré précisément pour la distinction zone de collection / carte, cf. DESIGN.md 1.3.0) avec un padding `spacing.lg` ; les cartes gardent leur fond `background`.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : La zone de collection peut porter un fond de surface distinct du fond de page et un remplissage pris dans l'échelle d'espacement, les items conservant le fond de base.

## Régime composé (dashboard)

RÈGLE [COLLECTION-U07] : grille explicite à colonnes égales, spans en cellules entières :
STATUT : implémentation de référence
SOURCE : interne
ÉNONCÉ : La grille du régime composé se déclare en colonnes égales, les blocs s'y étendant par portées de cellules entières.
MESURE : toute portée de bloc est un nombre entier de colonnes

```css
.dashboard {
  display: grid;
  grid-template-columns: repeat(var(--dashboard-cols), 1fr); /* --dashboard-cols : choisi par le contenu, cf. UX */
  gap: var(--collection-gap);
}
.widget--large { grid-column: span 2; }  /* toujours des cellules entières */
```

RÈGLE [COLLECTION-U08] : mêmes gouttières que le régime homogène ; un widget ne définit jamais sa propre marge externe (la grille possède l'espace entre widgets).
STATUT : implémentation de référence
SOURCE : interne
ÉNONCÉ : L'espace entre blocs appartient à la grille : aucun bloc ne déclare de marge externe.
MESURE : aucune marge externe déclarée sur les éléments de la grille

## Croissance et stabilité

RÈGLE [COLLECTION-U09] : « Charger plus » est un `BUTTON` secondary, centré sous la grille, dans le flux (jamais flottant) ; pendant le chargement il suit le cycle de soumission (état en cours, anti-double-clic — `BUTTON`/`FORM`).
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Le déclencheur d'extension à la demande est un bouton secondaire placé dans le flux sous la grille, jamais flottant, et il suit le cycle d'action en cours avec protection contre la double activation.

RÈGLE [COLLECTION-U10] : les squelettes occupent un **nombre de cellules fixe** (une rangée pleine au minimum) et les cellules réelles les remplacent en place — aucun layout shift mesurable (la grille ne change pas de hauteur au remplacement d'une rangée complète).
STATUT : implémentation de référence
SOURCE : interne
ÉNONCÉ : Les marques d'attente occupent un nombre de cellules fixe, au moins une rangée pleine, et sont remplacées en place par les cellules réelles.
MESURE : hauteur de grille identique entre l'état d'attente et l'état chargé d'une rangée

RÈGLE [COLLECTION-U11] : le compteur de résultats est une région live polie :
STATUT : propriété universelle
SOURCE : T3, T5
ÉNONCÉ : Le compteur de résultats est la seule région live de la collection et son annonce est polie ; la grille elle-même n'est jamais déclarée région live.
MESURE : exactement un élément à annonce polie dans la collection, portant le compteur de résultats

```html
<p class="collection-compteur" aria-live="polite">42 résultats</p>
```

— une seule région live par collection (le compteur), jamais la grille entière (annonce chaque carte = bruit).

## Implémentation

- Aucune largeur de colonne, gouttière ou hauteur codée en dur ; `grid.item-min` est la seule dimension propre au pattern.
- Ordre DOM = ordre visuel ; aucune propriété `order` pour « remonter » un item (l'ordre se décide dans les données).
- Balisage liste (`ul/li` ou `role="list"`) sur la grille — cf. sources a11y de `CARD`.
- `prefers-reduced-motion` : remplacement sans transition lors d'un tri/filtre (cf. UX).

## Sources et niveau de confiance (couche UI)

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| T1 | `repeat(auto-fill, minmax(min(100%, X), 1fr))` — grille intrinsèque robuste aux conteneurs étroits | [web.dev — One-line layouts (RAM)](https://web.dev/articles/one-line-layouts), [MDN — repeat()](https://developer.mozilla.org/en-US/docs/Web/CSS/repeat) | Établi — technique standard |
| T2 | `auto-fill` vs `auto-fit` (dernière rangée non étirée) | [MDN — auto-fill/auto-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Auto-placement_in_grid_layout) | Établi |
| T3 | Région live polie pour un compteur mis à jour | [MDN — ARIA live regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions) | Établi — mécanique à éprouver à la première implémentation (cf. UX) |
| T4 | Valeur de `grid.item-min` (fixée dans DESIGN.md) et mapping des gouttières | Arbitrage interne du 2026-07-21 — 64 × la grille de base, dans la fourchette des largeurs de carte observées | Non formalisé — à éprouver, ajustable sur besoin réel |
| T5 | Le compteur mis à jour est un message de statut au sens de la norme : déterminable programmatiquement, présenté sans prise de focus ; la liste de résultats elle-même n'en est pas un | [WCAG 2.2 — 4.1.3 Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) | Établi, standard (AA) — fonde « une seule région live, le compteur, jamais la grille » |

*Toute règle sans source explicite repose sur un raisonnement de mécanisme (cohérence avec l'échelle de la grille de base et les régimes du système) plutôt que sur une étude chiffrée.*
