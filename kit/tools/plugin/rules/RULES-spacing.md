---
sujet: spacing
type: fondation
resume: "La proximité comme information : échelle fermée, rythme vertical, densité, responsive, espace réservé dans le temps (le cadre de page est passé à la fondation grid)"
requires: []
selon-contexte: ["border (séparateurs : l'espace d'abord, le trait en dernier recours)", "motion (déplacement non sollicité)", "grid (le cadre de page — largeurs de conteneur — a migré vers la fondation grid)"]
---
# RULES — Spacing & layout (compilé, condensé)

> Généré depuis `foundations/spacing/SPACING-UX.md` (v1.2.0) et `SPACING-UI.md` (v1.2.0). Règles condensées pour le build — la source fait autorité. Ne pas éditer à la main. Tokens : `dist/tokens.yaml`.

## Nature
- Fondation. Le **cadre de page** (largeurs de conteneur) vit désormais dans la fondation `grid` (cf. RULES-grid). La **grille de colonnes** reste absente — pas de système 12 colonnes ; les grilles se définissent par gap (token spacing) + breakpoint. Ne pas l'inventer.
- **Règle cardinale : l'espace est un canal d'information** — la proximité encode la relation (lié < frère < groupe). Ce que l'espace dit doit être vrai.

## L'échelle (fermée)
| Cran | Rôle |
|---|---|
| `spacing.base` | l'unité de la grille — tout espacement est un multiple |
| `spacing.xs` | écarts intra-bloc serrés (titre/corps, label/champ, gap icône minimal) |
| `spacing.sm` | gaps internes standard (icône/texte, padding compact) |
| `spacing.md` | padding de croisière + écart entre frères (field_gap, grid_gap) |
| `spacing.lg` | padding des grands conteneurs (= le "card-padding" — pas de second token) |
| `spacing.xl` | séparation de groupes logiques (fieldset_gap) |
| `spacing.section` | rythme vertical de page — gabarits uniquement, jamais dans un composant |

- **Aucune valeur hors échelle.** Si aucun cran ne va : STOP, remonter (l'échelle évolue par les tokens, pas par l'écran).
- Un écart *dans* un composant ne dépasse pas `lg`. Séparation de groupes = saut d'échelle franc, pas un cran adjacent.
- Interne ≤ externe : un contenu n'est jamais plus proche du bord du voisin que du sien.
- Séparateurs : l'espace d'abord, le fond ensuite, le trait en dernier recours (cf. RULES-border).

## Rythme vertical
- Même échelle, même monotonie sur l'axe Y : intra-bloc (`xs`–`sm`) < frères (`md`) < groupes (`xl`) < sections (`section`). Aucune seconde échelle verticale.
- Un titre est plus proche de ce qu'il ouvre que de ce qu'il ferme : espace au-dessus > au-dessous, d'au moins un cran (ex. h2 de section : `section` au-dessus, `md` au-dessous).
- Hauteurs posées = multiples de `spacing.base` (les `scale.*` le sont déjà). Interlignes : baseline SOUPLE — gouvernés par la lisibilité ; ne pas les recaler sur la grille sans arbitrage produit.

## Densité
- compact = un cran sous comfortable, sur la même échelle. La densité change les espacements, jamais la structure.

## Responsive
- **Deux régimes** : mobile / desktop, bascule unique `breakpoint.mobile`. Pas de palier tablette (décision — STOP si un cas l'exige).
- Sous le breakpoint : 1 colonne, primaires full-width, cibles 44px. Desktop : hauteur interactive min `scale.desktop-min`.
- Les crans ne changent pas de valeur au breakpoint. Media queries sur `breakpoint.mobile` uniquement.
- Espacement en px (le zoom texte n'a pas à gonfler les paddings) — la typographie est en rem : cohérent, pas contradictoire.

## Ajustement optique
- Légitime quand l'œil et le calcul divergent — local, jamais promu en valeur d'échelle, toujours commenté sur place.

## L'espace dans le temps
- L'espace réservé ne dépend pas de l'état (skeleton aux dimensions réelles, espace de l'alert réservé si possible). Le déplacement non sollicité est traité par RULES-motion.

## Risque
| Cas | Risque | Sévérité |
|---|---|---|
| Proximité qui ment | Information reliée au mauvais élément | Élevée |
| Valeur hors échelle | Rythme cassé, dérive | Élevée |
| Écrasement mobile hors échelle | Cibles tactiles accolées | Élevée |
| Contenu qui saute (espace non réservé) | Cible déplacée sous le doigt | Élevée |
| Interne > externe | Appartenance visuelle fausse | Moyenne-élevée |

CONFIANCE : proximité/Gestalt, échelle fermée, interne<externe = établi (Carbon, Polaris, Atlassian). Breakpoint unique et px = décisions internes datées 2026-07-11, réversibles.
