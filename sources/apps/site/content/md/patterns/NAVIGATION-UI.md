---
component: navigation
layer: ui
type: pattern
version: 1.0.0 # 1.0.0 : première rédaction — mapping tokens de l'assemblage. Aucun token neuf : rythme en `spacing`, liens en tokens de LINK, TOC avec repère non chromatique, skip-link visible au focus (BORDER). Cf. NAVIGATION-UX.md.
last_updated: 2026-07-24
companion: NAVIGATION-UX.md
confidence: mixed
---

# Navigation — Couche UI (tokens)

> Mapping de l'assemblage sur les tokens. La navigation ne crée aucun token : elle compose ceux de `link`,
> `accordion`, `spacing` et `border`.

## Nav latérale

RÈGLE [NAVIGATION-U01] : le rythme vertical (entre groupes, entre liens) dérive de `spacing` ; l'indentation d'un sous-niveau
STATUT : implémentation de référence
SOURCE : T1, T3
ÉNONCÉ : Le rythme vertical et l'indentation des sous-niveaux de la navigation latérale dérivent de l'échelle spacing, et l'état courant d'un lien combine un fond secondary ou un trait avec une variation de graisse, jamais la couleur seule.
MESURE : l'état courant d'un lien de navigation reste distinguable en niveaux de gris
est un cran `spacing`. Les liens appliquent les tokens de `link` (contexte navigation) ; l'état courant y est
porté (renvoi LINK), signalé par un fond `secondary` et/ou un trait, **plus** le poids — jamais la couleur seule.

## Table des matières

RÈGLE [NAVIGATION-U02] : les entrées du TOC sont des liens (`link`, navigation) ; l'entrée active porte un **repère non
STATUT : implémentation de référence
SOURCE : T1, T3
ÉNONCÉ : L'entrée active du sommaire porte un trait latéral border de couleur primary et une graisse accrue en plus d'aria-current, ses espacements et retraits venant de spacing.
MESURE : l'entrée active porte aria-current et se distingue des autres par au moins un écart de graisse ou un trait, hors couleur
chromatique** — un trait latéral (`border`, couleur `primary`) **et** un poids accru — en plus d'`aria-current`.
Espace et retrait viennent de `spacing`.

## Skip-link

RÈGLE [NAVIGATION-U03] : le skip-link est **hors flux visuel** (retiré à l'écran) tant qu'il n'a pas le focus ; **au focus**,
STATUT : implémentation de référence
SOURCE : T2, T4, T5
ÉNONCÉ : Le lien d'évitement est retiré du rendu visuel tant qu'il n'a pas le focus et devient pleinement visible au focus, au-dessus du contenu, avec l'anneau, le rayon et le fond issus des tokens.
MESURE : au focus, le lien d'évitement est entièrement visible dans le viewport et n'est recouvert par aucun élément superposé
il devient visible — fond `background`, bordure/anneau `border` (`border.focus-width`), rayon `radius.md`,
au-dessus du contenu (`z-index.sticky` au minimum). Il ne doit jamais rester caché **au focus**.

## Frontières

RÈGLE [NAVIGATION-U04] : aucune valeur d'espacement, de couleur ou de trait codée en dur : tout référence `spacing.*`,
STATUT : implémentation de référence
SOURCE : interne
ÉNONCÉ : Aucune valeur d'espacement, de couleur, de rayon ou de trait n'est écrite en dur dans la navigation : tout référence un token existant, et l'off-canvas applique les tokens d'overlay sans les redéfinir.
MESURE : aucun littéral de longueur ou de couleur dans les styles de navigation
`radius.*`, `border*`, et les tokens de `link`. L'off-canvas de la nav applique `overlay` (z-index, scrim),
non redéfini ici.

## Sources et niveau de confiance (couche UI)
| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| T1 | État courant = fond `secondary`/trait + poids, jamais la couleur seule | LINK-UI + WCAG 1.4.1 | Établi (interne) |
| T2 | Skip-link visible uniquement au focus, au-dessus du contenu | WCAG 2.4.1, pattern « skip link » | Établi |
| T3 | La couleur n'est jamais le seul moyen visuel de distinguer un élément — fondement du « jamais la couleur seule » sur l'état courant et l'entrée active du sommaire | [WCAG 2.2 — 1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) | Établi, standard (A) |
| T4 | Toute interface opérable au clavier dispose d'un mode où l'indicateur de focus est visible — fonde le « jamais caché au focus » du lien d'évitement | [WCAG 2.2 — 2.4.7 Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html) | Établi, standard (AA) |
| T5 | Un lien d'évitement visible uniquement au focus satisfait 2.4.1 ; c'est la technique, non le critère, qui décrit cette forme | [WCAG 2.2 — Technique G1](https://www.w3.org/WAI/WCAG22/Techniques/general/G1) | Établi, technique suffisante — comble l'absence d'URL de T2 |
| T6 | L'élément courant d'un ensemble est identifié par aria-current ; l'indication de position dans une barre de navigation est une technique suffisante | [WCAG 2.2 — 2.4.8 Location](https://www.w3.org/WAI/WCAG22/Understanding/location.html) | Établi, standard (AAA) |

*Toute règle sans source explicite repose sur un raisonnement de mécanisme (cohérence avec les fondations voisines).*
