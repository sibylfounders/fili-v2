---
component: switch
layer: ui
type: component
version: 1.0.1 # 1.0.1 : la piste pill est rattachée nommément à la liste fermée de RADIUS-R08 (2026-08-03) — aucune valeur changée. 1.0.0 : première rédaction — mapping tokens. Aucun token neuf : piste en `radius.pill`, états en `color`, glissement du pouce en `motion.base`, anneau `border`, cible tactile 44px (ACCESSIBILITY). Cf. SWITCH-UX.md.
last_updated: 2026-07-24
companion: SWITCH-UX.md
confidence: mixed
---

# Switch — Couche UI (tokens)

> Mapping des contextes de SWITCH-UX.md sur les tokens. Aucune valeur brute : la géométrie est relationnelle
> (le pouce est un disque inscrit dans la piste), les couleurs et le mouvement viennent des fondations.

## Piste et pouce

RÈGLE [SWITCH-U01] : la **piste** est une pilule (`radius.pill` — consommateur nommé dans la liste fermée de RADIUS-R08 depuis le 2026-08-03 ; jusque-là ce fichier enfreignait un « badge/avatar uniquement » que personne n'avait rapproché de lui) ; le **pouce** est un disque inscrit, séparé des bords
STATUT : parti pris d'identité
SOURCE : T1, T2, T3
ÉNONCÉ : La piste d'un switch est une pilule et son pouce un disque inscrit séparé des bords par un retrait constant ; l'état inactif oppose une piste de surface bordée à au moins 3:1 et un pouce de fond, l'état actif une piste primaire et un pouce en couleur sur primaire, la transition empruntant les tokens de mouvement.
MESURE : aucune valeur brute de rayon, de couleur ou de durée sur le switch ; contraste de la bordure de piste inactive ≥ 3:1
par un retrait constant. **Off** : piste `surface` bordée `border-strong` (elle délimite un contrôle
interactif : 3:1), pouce `background`. **On** : piste `primary`, pouce `on-primary`. La transition du pouce
et du fond suit `motion.base` / `motion.ease-in-out` (mouvement sur place).

RÈGLE [SWITCH-U02] : l'anneau de focus est celui de BORDER (`border.focus-width` / `border.focus-offset`) ; l'état
STATUT : note de méthode
SOURCE : T2
ÉNONCÉ : L'anneau de focus du switch n'est pas redéfini localement : il reprend celui de la fondation bordure, et l'état désactivé abaisse l'opacité sans modifier ni le trait ni le rayon.
MESURE : aucun style de focus propre au switch ; trait et rayon identiques entre l'état normal et l'état désactivé
désactivé abaisse l'opacité sans changer le trait ni le rayon.

## Cible tactile

RÈGLE [SWITCH-U03] : quelle que soit la taille visuelle de la piste, la **zone interactive** atteint au minimum 44px
STATUT : propriété universelle
SOURCE : T4
ÉNONCÉ : Quelle que soit la taille visuelle de la piste, la zone interactive d'un switch — libellé cliquable compris — atteint le seuil de cible renforcé de 44 × 44 px CSS.
MESURE : cible pointeur du switch ≥ 44 × 44 px CSS, libellé inclus
(zone de confort ACCESSIBILITY) — le libellé cliquable y participe.

## Frontières

RÈGLE [SWITCH-U04] : aucune couleur, rayon ou durée codés en dur : tout référence `radius.pill`, `color` (`surface`,
STATUT : note de méthode
SOURCE : T5
ÉNONCÉ : Aucune couleur, rayon ni durée du switch n'est codé en dur — chacun résout un token de fondation — et le déplacement du pouce devient une bascule instantanée lorsque l'utilisateur a demandé moins de mouvement.
MESURE : aucune valeur brute dans l'implémentation du switch ; sous prefers-reduced-motion: reduce, le pouce ne glisse pas
`border-strong`, `primary`, `on-primary`, `background`), `motion.base` / `motion.ease-in-out`, `border.*`.
Le déplacement du pouce respecte `prefers-reduced-motion` (bascule instantanée si réduit).

## Sources et niveau de confiance (couche UI)
| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| T1 | Piste pilule + pouce inscrit, états on/off contrastés | convergence des systèmes (Material, Carbon) | Établi par convergence |
| T2 | Bordure délimitante d'un contrôle interactif à 3:1 → `border-strong` | BORDER-UX (guardrail) | Établi (interne) |
| T3 | La présentation visuelle des composants d'interface atteint un contraste d'au moins 3:1 avec les couleurs adjacentes ; la bordure n'est exigée que si rien d'autre n'identifie visuellement la présence du contrôle | [WCAG 2.2 — 1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) | Établi, standard (niveau AA) — donne à T2 son ancrage externe ; la forme même du switch pouvant l'identifier, la bordure de piste est un choix de sûreté, pas une obligation stricte |
| T4 | La cible pointeur mesure au moins 24 × 24 px CSS (AA) ; le seuil renforcé de 44 × 44 px CSS relève du niveau AAA | [WCAG 2.2 — 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) ; [WCAG 2.2 — 2.5.5 Target Size (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html) | Établi, standard (AA et AAA) — le 44 px du composant est le seuil AAA |
| T5 | L'animation déclenchée par interaction peut être désactivée ; prefers-reduced-motion: reduce exprime la demande de suppression ou de remplacement du mouvement non essentiel | [WCAG 2.2 — 2.3.3 Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) ; [MDN — prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) | Établi — niveau AAA, plusieurs techniques suffisantes admises |

*Toute règle sans source explicite repose sur un raisonnement de mécanisme (cohérence avec les fondations voisines).*
