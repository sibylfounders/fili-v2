---
component: navigation
layer: ux
type: pattern
version: 1.0.0 # 1.0.0 : première rédaction — sujet auparavant HORS PÉRIMÈTRE, entré en scope avec le shell (2026-07-24). Pattern d'ASSEMBLAGE : landmark <nav>, hiérarchie, état courant (délégué à LINK), regroupement (délégué à ACCORDION), TOC « sur cette page » (scrollspy), skip-link. Périmètre arbitré : nav latérale + TOC + skip-link ; fil d'Ariane mappé mais différé. Cf. DECISIONS.md 2026-07-24.
last_updated: 2026-07-24
companion: NAVIGATION-UI.md
confidence: mixed # landmarks, aria-current et skip-link sont établis (WCAG/APG) ; le comportement de scrollspy du TOC est un consensus convergent.
---

# Navigation — Couche UX (pattern)

> **Orchestration** d'une navigation, pas un composant neuf : elle **assemble** des destinations (`link` en
> contexte navigation), les **regroupe** (`accordion`), les place dans des **repères** (landmarks) et gère
> l'**état courant**. Elle couvre trois surfaces : la **nav latérale**, la **table des matières « sur cette
> page »**, et le **skip-link**. Le fil d'Ariane est cartographié mais différé.

## Repères (landmarks)

RÈGLE [NAVIGATION-R01] : toute navigation vit dans un `nav` **étiqueté** (`aria-label`) ; quand plusieurs coexistent, chacune
STATUT : propriété universelle
SOURCE : S1, S4
ÉNONCÉ : Chaque bloc majeur de liens de navigation est exposé dans un élément nav porteur d'une étiquette accessible distincte, et le contenu principal dans un unique main.
MESURE : chaque nav de la page porte un aria-label ou aria-labelledby, tous distincts entre eux, et la page contient un seul main
porte une étiquette distincte (« Navigation principale », « Sur cette page »). Le contenu principal est un
`main` — cible du skip-link.

## Nav latérale

RÈGLE [NAVIGATION-R02] : les destinations sont des **liens** (`link`, contexte navigation) ; leur regroupement est un
STATUT : propriété universelle
SOURCE : S1, S5, S6, S7
ÉNONCÉ : Dans un bloc de navigation, la destination correspondant à la page affichée est la seule à porter aria-current, et son état courant est signalé par au moins un indice non chromatique en plus de la couleur.
MESURE : un seul élément par bloc de navigation porte aria-current, et l'état courant reste distinguable en niveaux de gris
**accordion**. La **destination courante** est signalée par `link` (aria-current + signal **non chromatique**)
— **un seul** lien courant à la fois. La hiérarchie (groupe → sous-liens) se lit à l'indentation et au
regroupement, pas à la seule couleur.

RÈGLE [NAVIGATION-R03] : sous les seuils du shell, la nav latérale passe **off-canvas** — comportement porté par `overlay`
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Sous le seuil de compacité du shell, la navigation latérale devient un panneau hors-écran dont le scrim, le confinement du focus et la fermeture sont fournis par le composant overlay et non redéfinis par la navigation.
(scrim, focus, dismiss), pas par ce pattern. Un skip-link permet de sauter la nav pour atteindre le contenu.

## Table des matières « sur cette page »

RÈGLE [NAVIGATION-R04] : le TOC liste les **sections de la page courante** ; l'entrée **active suit la lecture** (la section
STATUT : parti pris d'identité
SOURCE : S3, S5, S6
ÉNONCÉ : Le sommaire « sur cette page » liste les sections du document affiché, marque l'entrée correspondant à la section lue par aria-current et par un indice non chromatique, et complète la navigation principale sans s'y substituer.
MESURE : une seule entrée du sommaire porte aria-current à un instant donné, et l'entrée active reste distinguable en niveaux de gris
visible), marquée par `aria-current` et un repère **non chromatique** (trait/gras), jamais la seule couleur.
Le TOC **complète** la nav principale, il ne la remplace pas — c'est de la navigation *intra-page*.

RÈGLE [NAVIGATION-R05] : cliquer une entrée **défile** vers la section (ancre) ; le scrollspy **reflète** la lecture, il ne la
STATUT : propriété universelle
SOURCE : S8, S9
ÉNONCÉ : L'activation d'une entrée de sommaire mène à sa section par une ancre, et le défilement associé est instantané dès que l'utilisateur a demandé une réduction des animations ; l'indicateur actif reflète la position de lecture sans la piloter.
MESURE : sous prefers-reduced-motion: reduce, aucun défilement animé n'est appliqué (scroll-behavior différent de smooth)
pilote pas. Sous `prefers-reduced-motion`, le défilement est instantané (renvoi MOTION).

## Skip-link (aller au contenu)

RÈGLE [NAVIGATION-R06] : le **premier élément focalisable** de la page est un lien « **Aller au contenu** » — **masqué
STATUT : propriété universelle
SOURCE : S2, S10
ÉNONCÉ : Le premier élément focalisable du document est un lien qui mène directement au contenu principal ; il peut n'être visible qu'au focus, mais il doit alors le devenir.
MESURE : le premier élément focalisable du document est un lien dont la cible est le main
visuellement jusqu'au focus**, puis visible — qui déplace le focus vers le `main`. Obligatoire dès qu'une nav
longue précède le contenu (renvoi ACCESSIBILITY : focus ordonné, franchissable au clavier).

## Clavier

RÈGLE [NAVIGATION-R07] : Tab traverse la navigation dans un **ordre qui suit le sens** ; **aucun piège de focus** ; les
STATUT : propriété universelle
SOURCE : S11, S12
ÉNONCÉ : L'ordre de tabulation à travers la navigation préserve le sens et l'opérabilité du contenu, et aucun élément de la navigation ne retient le focus au clavier.
MESURE : chaque élément interactif de la navigation peut être atteint puis quitté au clavier seul, sans tabindex positif
accordéons de nav suivent le clavier d'`accordion`, les liens celui de `link`. La navigation reste
**entièrement franchissable au clavier**.

## Frontières

RÈGLE [NAVIGATION-R08] : l'**item** est un `link` ; le **regroupement** un `accordion` ; l'**off-canvas** relève d'`overlay` ;
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Ce pattern ne redéfinit aucun mécanisme : l'item relève de link, le regroupement d'accordion, l'off-canvas d'overlay, l'anneau de focus de border, l'ordre de focus général d'accessibility et le libellé de voice.
l'**anneau de focus** de `border` ; l'**ordre de focus général** d'`accessibility` ; le **mot** d'un libellé
de `voice`. Ce pattern ne redéfinit aucun de ces mécanismes — il les **compose**.

## Sources et niveau de confiance (couche UX)
| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| S1 | `nav` étiqueté, `main`, un seul `aria-current="page"` | [WAI — Landmarks](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/), [aria-current](https://www.w3.org/TR/wai-aria-1.1/#aria-current) | Établi |
| S2 | Skip-link masqué jusqu'au focus, saute au contenu | [WCAG 2.4.1 — Bypass Blocks](https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html) | Établi |
| S3 | TOC « sur cette page » avec entrée active suivant la lecture (scrollspy) | Convergence des docs (Docusaurus, MDN) | Convergent |
| S4 | Un document peut contenir plusieurs nav (navigation de site, navigation intra-page) ; nav n'est destiné qu'aux blocs majeurs de liens, et l'étiquetage accessible sert à les distinguer | [MDN — L'élément nav](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/nav) | Établi — référence normative de plateforme |
| S5 | L'indication de la position courante dans une barre de navigation est une technique suffisante ; le critère cite explicitement ARIA26 (aria-current) et G128 | [WCAG 2.2 — 2.4.8 Location](https://www.w3.org/WAI/WCAG22/Understanding/location.html) | Établi, standard (AAA) |
| S6 | La couleur n'est jamais le seul moyen visuel de transmettre une information ou de distinguer un élément — l'état courant d'un lien de navigation exige un second canal | [WCAG 2.2 — 1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) | Établi, standard (A) |
| S7 | Le menu de navigation à divulgation est le motif ARIA de référence pour regrouper des destinations sous un en-tête dépliable | [ARIA APG — Disclosure (Show/Hide) Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/) | Établi, motif de référence W3C |
| S8 | La valeur reduce indique que l'utilisateur a demandé la suppression ou la réduction des animations fondées sur le mouvement | [MDN — prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) | Établi — référence normative de plateforme |
| S9 | Le défilement lui-même est essentiel et autorisé, mais toute animation non essentielle ajoutée à l'interaction de défilement doit pouvoir être désactivée | [WCAG 2.2 — 2.3.3 Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) | Établi, standard (AAA) |
| S10 | Le premier élément interactif de la page est un lien vers le début du contenu principal, et un lien visible uniquement au focus satisfait le critère | [WCAG 2.2 — Technique G1](https://www.w3.org/WAI/WCAG22/Techniques/general/G1) | Établi, technique suffisante référencée pour 2.4.1 — c'est G1, et non 2.4.1, qui décrit « premier élément focalisable » et « masqué jusqu'au focus » |
| S11 | Si le focus peut entrer dans un composant au clavier, il doit pouvoir en sortir au clavier seul | [WCAG 2.2 — 2.1.2 No Keyboard Trap](https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html) | Établi, standard (A) |
| S12 | Les composants focalisables reçoivent le focus dans un ordre qui préserve le sens et l'opérabilité | [WCAG 2.2 — 2.4.3 Focus Order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html) | Établi, standard (A) |

*Toute règle sans source explicite repose sur un raisonnement de mécanisme (cohérence interne, ergonomie).*
