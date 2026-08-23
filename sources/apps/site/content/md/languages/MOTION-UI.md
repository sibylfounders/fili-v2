---
component: motion
layer: ui
type: language
version: 1.1.0 # 1.1.0 : Motion devient un langage de premier niveau ; les tokens restent résolus dans DESIGN.md.
last_updated: 2026-07-20
companion: MOTION-UX.md
tokens:
  durees: # créées dans DESIGN.md 1.11.0 — les micro-interactions existantes n'avaient aucun vocabulaire commun
    fast: motion.fast # feedback : hover, press, changements de couleur/bordure
    base: motion.base # continuité locale : chevron, apparition, dépliage
    slow: motion.slow # grandes surfaces — provisionné (panneaux, futurs superposés)
  courbes:
    entree: motion.ease-out
    sortie: motion.ease-in
    sur_place: motion.ease-in-out
  regles_de_composition:
    sortie_plus_courte: la sortie prend le cran inférieur de son entrée
    spinner: rotation continue linéaire — seule exception au bannissement du linéaire
confidence: mixed
---

# Langage de mouvement — Couche UI

> Techniques et mapping des tokens. Le raisonnement (registre productif, interruption, reduced-motion, ce qui ne s'anime pas) vit dans MOTION-UX.md. Les valeurs sont résolues dans DESIGN.md.

## Mapping des micro-interactions existantes

| Micro-interaction | Durée | Courbe | Propriétés animées |
|---|---|---|---|
| Hover bouton (state layer) | `motion.fast` | `motion.ease-out` | background-color (composite-friendly : aplat simple) |
| Hover carte cliquable (élévation) | `motion.fast` | `motion.ease-out` | opacité d'un pseudo-élément pré-rendu (jamais box-shadow interpolé, cf. technique ci-dessous) |
| Bordure d'état de l'input (repos → error) | `motion.fast` | `motion.ease-out` | border-color ; le message d'erreur, lui, apparaît sans délai |
| Chevron expandable | `motion.base` | `motion.ease-in-out` | transform: rotate (expand_chevron_rotation, CARD-UI) |
| Dépliage de la carte expandable | `motion.base` | `motion.ease-in-out` | transform/opacity (technique grid-rows ou mesure, jamais height animée à l'aveugle) |
| Apparition de l'alert réactif | `motion.base` | `motion.ease-out` | opacity — jamais de slide qui pousse le contenu |
| Disparition de l'alert | `motion.fast` (cran inférieur de l'entrée) | `motion.ease-in` | opacity |
| Pulse du skeleton | boucle lente | linéaire admis (opacité seule) | opacity entre deux valeurs proches — coupé sous reduced-motion |
| Spinner (bouton loading) | rotation continue | linear | transform: rotate |
| Focus ring | **aucune** — apparition instantanée | — | interdit de transition (BORDER-UX) |

## Techniques imposées

- **Ombre au survol** : le box-shadow ne s'interpole pas (paint coûteux) — l'ombre `elevation.raised` est pré-rendue sur un pseudo-élément à `opacity: 0`, le hover anime l'opacité (composite pur).
- **Dépliage** : jamais `height: auto` interpolé naïvement ; techniques admises : `grid-template-rows: 0fr → 1fr`, ou mesure JS + transform. Le contenu sous le pli se déplace *parce que l'utilisateur l'a demandé* — c'est l'exception légitime au non-déplacement (MOTION-UX).
- **Interruptibilité** : transitions CSS de préférence aux keyframes pour les changements d'état (réversibles nativement depuis l'état courant) ; keyframes réservées aux boucles (pulse, spinner).
- **reduced-motion** : un bloc média global coupe déplacements/rotations/échelles et conserve opacité/couleur — chaque consommateur en hérite, aucun ne le redéclare localement.
- **Exception documentée** : le contournement autofill d'INPUT-UI (`transition: background-color 9999s`) n'est **pas** une animation — c'est un hack de neutralisation documenté, hors vocabulaire motion ; il ne consomme volontairement aucun token.

## Consommation par les composants

| Consommateur | Micro-interactions | Référence |
|---|---|---|
| Bouton (BUTTON-UI.md) | hover fast/ease-out, spinner linear | states |
| Input (INPUT-UI.md) | bordure d'état fast, hack autofill (hors vocabulaire, documenté) | — |
| Card (CARD-UI.md) | hover fast (pseudo-élément), chevron + dépliage base/in-out, skeleton pulse | states |
| Alert (ALERT-UI.md) | apparition base/ease-out (opacity), disparition fast/ease-in | persistance |
| Form (FORM-UI.md) | hérite via input et alert | — |

## Vérifiabilité

- `valide-dossier.js` vérifie la résolution des tokens `motion.*` (groupe ajouté à ses motifs).
- Le comportement animé ne se vérifie pas statiquement (même limite que le `clamp()` typographique) : les tests qui comptent sont manuels et documentés — (1) OS en reduced-motion : plus aucun déplacement, l'information demeure ; (2) interruption : re-hover pendant une sortie, la transition s'inverse sans saut ; (3) performance : DevTools, les animations restent sur le compositeur (pas de layout/paint dans la timeline).

## Sources et niveau de confiance (couche UI)

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| T1 | Ombre par opacité de pseudo-élément ; transform/opacity seuls | [web.dev — Animations guide](https://web.dev/articles/animations-guide) | Établi — littérature performance |
| T2 | Transitions CSS interruptibles nativement | Comportement spécifié (CSS Transitions) | Établi |
| T3 | Linéaire réservé au spinner | [Polaris — Motion tokens](https://polaris-react.shopify.com/tokens/motion) | Établi chez Polaris, adopté |
| T4 | Skeleton conservé mais statique sous reduced-motion | [web.dev — prefers-reduced-motion](https://web.dev/articles/prefers-reduced-motion) (indicateurs à conserver), choix interne plus strict | Convergence + décision interne |
| T5 | Les propriétés colorimétriques (background-color, border-color) sautent l'étape layout mais déclenchent un repaint : elles ne sont pas « composite » | [MDN — Animation performance and frame rate](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Animation_performance_and_frame_rate) | Établi — corrige l'annotation du tableau de mapping |
