---
component: spacing
layer: ui
type: foundation
version: 1.2.0 # 1.2.0 : application du rythme vertical — pile verticale par rôles de crans, titres asymétriques, accrochage des hauteurs à la grille de base, état chiffré des interlignes (baseline souple). 1.1.0 : frontière avec ADAPTIVE — breakpoint global pour la page, Container Queries et seuils locaux pour les composants
last_updated: 2026-07-20
companion: SPACING-UX.md
tokens:
  # Aucune valeur définie ici — l'échelle vit dans DESIGN.md. Ce fichier fixe la grammaire d'application.
  echelle:
    base: spacing.base
    crans: [spacing.xs, spacing.sm, spacing.md, spacing.lg, spacing.xl, spacing.section]
  responsive:
    bascule: breakpoint.mobile
  hauteurs_interactives: # l'échelle jumelle des hauteurs de composants — même logique de crans
    crans: [scale.compact, scale.base, scale.expanded]
    minima: [scale.desktop-min]
confidence: mixed
---

# Espacement & layout — Couche UI (fondation)

> Grammaire d'application de l'échelle. Le raisonnement (proximité, échelle fermée, breakpoint unique, cadrage grid) vit dans SPACING-UX.md. Toutes les valeurs sont résolues dans DESIGN.md.

## L'échelle — rôles des crans

| Cran | Rôle dominant chez les consommateurs |
|---|---|
| `spacing.base` | l'unité de la grille — tout espacement est un multiple ; `xs` partage sa valeur mais est un *cran de l'échelle* (le plus petit écart utilisable), `base` est la *raison* de l'échelle |
| `spacing.xs` | écarts intra-bloc les plus serrés : titre/corps de l'alert, label/champ, gap icône-texte minimal |
| `spacing.sm` | gaps internes standard : icône/texte, slots compacts, padding compact |
| `spacing.md` | le padding de croisière (bouton md, alert, card comfortable) et l'écart entre frères (field_gap, grid_gap) |
| `spacing.lg` | padding des grands conteneurs — sert aussi de "card-padding" (ne pas créer de second token, cf. DESIGN.md) |
| `spacing.xl` | séparation de groupes logiques (fieldset_gap) |
| `spacing.section` | rythme vertical des sections de page — réservé aux gabarits, jamais à l'intérieur d'un composant |

Règle de lecture : un écart *dans* un composant ne dépasse pas `lg` ; `xl` et `section` appartiennent à la composition (patterns, gabarits). La hiérarchie de proximité (SPACING-UX) se vérifie en colonnes : tout consommateur doit pouvoir ordonner ses écarts du plus lié au plus séparé sans inversion.

## Densité — application

- comfortable = cran de référence ; compact = **un cran en dessous** sur la même échelle (CARD-UI : md/sm → sm/xs). Jamais deux crans, jamais une valeur propre.
- Les hauteurs interactives suivent la même logique sur leur échelle jumelle `scale.*` (compact/base/expanded) — bouton et input les consomment déjà par taille.

## Rythme vertical — application

| Relation verticale | Cran |
|---|---|
| dans un bloc (titre → corps, label → champ) | `xs`–`sm` |
| entre frères d'une même liste ou d'un même formulaire | `md` |
| entre groupes logiques | `xl` |
| entre sections de page (gabarits) | `section` |

- Titres : l'espace au-dessus prend le cran de la relation que le titre FERME, l'espace au-dessous celui de la relation qu'il OUVRE — donc toujours au-dessus > au-dessous (ex. h2 de section : `section` au-dessus, `md` au-dessous).
- Hauteurs sur la grille de base — état vérifié : `scale.compact/base/expanded` 32/40/48 ✓, `scale.desktop-min` 36 ✓, échelle spacing ✓ (multiples de 4). Interlignes calculés HORS grille (25,6 / 21 / 14,4 / 52,8 px) : baseline souple — ne pas « corriger » sans arbitrage (SPACING-UX).

## Responsive — application

- `breakpoint.mobile` appartient aux décisions globales de page : marges, régions principales,
  navigation et structure de collection quand le viewport en est bien la cause.
- L'adaptation interne d'un composant réutilisable suit `ADAPTIVE-UI.md` : Container Query et seuil
  dérivé du contenu. Ce seuil local n'est pas un token d'espacement et ne copie pas automatiquement
  `breakpoint.mobile`.
- Les crans de l'échelle **ne changent pas de valeur** au seuil — c'est la densité ou la disposition
  qui change (SPACING-UX).
- Les Media Queries restent autorisées pour les préférences et capacités (`prefers-reduced-motion`,
  contraste forcé, hover/pointer) ; elles ne servent pas à deviner la largeur d'un composant.

## Consommation par les composants

| Consommateur | Écarts consommés | Hiérarchie vérifiée |
|---|---|---|
| Bouton (BUTTON-UI.md) | padding_x/y par taille, gap icône-texte (xs-sm) | gap interne < padding externe ✓ |
| Input (INPUT-UI.md) | padding_x par taille | — |
| Card (CARD-UI.md) | padding/slot_gap par densité, grid_gap | slot_gap < padding ✓ |
| Alert (ALERT-UI.md) | padding md, icon_gap sm, title_to_body xs | xs < sm < md ✓ |
| Form (FORM-UI.md) | label_to_field xs < field_gap md < fieldset_gap xl | monotone ✓ |
| Gabarits (à venir) | section | — |

## Vérifiabilité

- `tools/valide-dossier.js` garantit qu'aucune valeur px hors tokens (exceptions 44px/1px) n'entre dans un `*-UI.md` — c'est l'échelle fermée, outillée.
- La **monotonie** de la hiérarchie de proximité (lié < frère < groupe) n'est pas vérifiée automatiquement — contrôle de revue, la table ci-dessus en tient l'état.
- Les ajustements optiques locaux (SPACING-UX) doivent être commentés là où ils vivent pour rester distinguables d'une dérive.

## Sources et niveau de confiance (couche UI)

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| T1 | Segmentation petits/moyens/grands crans par usage | [Atlassian — Spacing](https://atlassian.design/foundations/spacing) | Établi chez Atlassian, mapping propre à ce système |
| T2 | Densité = décalage d'un cran | Pratique interne (CARD-UI), convergente avec les échelles compactes des systèmes | Convergence, formalisation interne |
| T3 | Échelle fermée outillée | [Carbon — Spacing](https://carbondesignsystem.com/elements/spacing/overview/) (écarts à éviter), précédent interne (valide-dossier.js) | Établi |
