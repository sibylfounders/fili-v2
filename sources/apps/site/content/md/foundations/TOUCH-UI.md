---
component: touch
layer: ui
type: foundation
version: 1.0.0 # 1.0.0 : première rédaction — grammaire technique de la cible tactile ; crée les tokens touch.* dans DESIGN.md et impose leur consommation par les composants interactifs (min-height/min-width, hit-area, pointer:coarse).
last_updated: 2026-07-25
companion: TOUCH-UX.md
tokens:
  cible:
    plancher: touch.target-min # 24 — plancher AA (WCAG 2.5.8)
    confort: touch.target-comfortable # 44 — cible par défaut au doigt (WCAG 2.5.5 AAA / Apple HIG)
    espacement: touch.target-spacing # 8 — écart minimal entre cibles adjacentes
  application:
    hauteur_mini: touch.target-comfortable # min-height/min-width d'une cible principale
    pointeur_grossier: '@media (pointer: coarse)' # le régime où le confort devient obligatoire
confidence: mixed
---

# Fondation tactile (touch) — Couche UI

> Ce fichier traduit `TOUCH-UX.md` en grammaire de rendu. Il **crée** les tokens `touch.*` dans
> `DESIGN.md` et dit comment un composant les consomme. Les valeurs concrètes vivent dans `DESIGN.md`
> (l'implémentation de référence) ; ce fichier ne cite que les noms de tokens.

## Les tokens

| Token | Rôle |
|---|---|
| `touch.target-min` | plancher absolu d'une cible tactile — niveau AA |
| `touch.target-comfortable` | cible confortable par défaut au doigt — niveau AAA / HIG |
| `touch.target-spacing` | écart minimal entre deux cibles adjacentes |

RÈGLE [TOUCH-U01] : aucun composant ne code une taille de cible en dur — il référence un de ces trois tokens.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Aucun composant ne code une taille de cible en dur : il référence l'un des trois tokens de cible tactile du système.
MESURE : aucune valeur numérique de hauteur/largeur minimale de cible en dur ; référence à touch.target-min, -comfortable ou -spacing
Un composant qui posait sa propre hauteur minimale « à la main » (36, 40, 48…) la relit désormais
contre `touch.*`.

## Comment un composant consomme la cible

RÈGLE [TOUCH-U02] : la cible se garantit par **`min-height` et `min-width`**, pas par la seule hauteur de
STATUT : implémentation de référence
SOURCE : T1
ÉNONCÉ : La cible se garantit par une hauteur et une largeur minimales déclarées, et non par la seule hauteur du contenu ou du padding.
MESURE : min-height et min-width présents sur toute cible interactive
contenu. Un bouton dont le texte fait 20 px de haut atteint la cible par le padding **et** par un
`min-height` qui empêche l'écrasement.

RÈGLE [TOUCH-U03] : **la zone tactile peut déborder le dessin.** Une icône de `icon.md` (20) se touche dans une
STATUT : implémentation de référence
SOURCE : T1
ÉNONCÉ : La zone tactile peut déborder le dessin : le supplément se produit par padding ou par une zone étendue transparente, sans agrandir l'élément visible.
MESURE : zone tactile ≥ touch.target-comfortable même quand le dessin est plus petit
cible de `touch.target-comfortable` (44) — le supplément est du padding, ou une zone étendue
(pseudo-élément, `::before` transparent) qui n'agrandit pas le dessin visible.

RÈGLE [TOUCH-U04] : le régime tactile se déclare par **`@media (pointer: coarse)`** (et/ou `(hover: none)`) : sur
STATUT : implémentation de référence
SOURCE : T2
ÉNONCÉ : Le régime tactile se déclare par les requêtes de média de pointeur grossier et d'absence de survol : sur pointeur grossier la cible principale passe à la taille confortable et aucune affordance ne dépend du survol ; sur pointeur fin une densité plus serrée reste permise au-dessus du plancher.
MESURE : sous (pointer: coarse), cible principale ≥ touch.target-comfortable ; sous (hover: none), aucune affordance portée par :hover
pointeur grossier, la cible principale passe à `touch.target-comfortable` et aucune affordance ne
dépend du `:hover`. Sur pointeur fin, une densité plus serrée reste permise, `touch.target-min`
faisant toujours plancher.

## Matrice de consommation par composant

| Composant | Cible visée | Technique |
|---|---|---|
| Button | `touch.target-comfortable` (coarse) | `min-height` ; `sm` peut viser `touch.target-min` **hors** coarse |
| Input / Select | `touch.target-comfortable` (coarse) | `min-height` du champ et du déclencheur |
| Switch / Checkbox | `touch.target-comfortable` | zone tactile étendue autour de la piste, dessin plus petit |
| Icon-only (compact-button, fermeture) | `touch.target-comfortable` | padding ou hit-area ; l'icône reste à `icon.*` |
| Lien inline | exempté (inline) | ne pas gonfler l'interligne ; hors du fil, la cible suit les crans |
| Ligne d'action (nav, liste, toc) | `touch.target-comfortable` | hauteur de ligne + espacement vertical ≥ `touch.target-spacing` |

## Espacement

RÈGLE [TOUCH-U05] : deux cibles adjacentes sont séparées d'au moins `touch.target-spacing`. Quand la densité
STATUT : propriété universelle
SOURCE : T1
ÉNONCÉ : Deux cibles adjacentes sont séparées d'au moins l'espacement minimal ; lorsque la densité impose le plancher, cet espacement est obligatoire et non optionnel.
MESURE : écart ≥ touch.target-spacing ; cercle de 24 px de diamètre centré sur chaque cible sans intersection avec une cible voisine
force `touch.target-min`, l'espacement **n'est pas** optionnel : c'est lui qui, avec la zone de
sécurité de 24 px de WCAG 2.5.8, rend deux petites cibles distinctes.

## Annulation du pointeur

RÈGLE [TOUCH-U06] : l'action se lie à l'**événement de relâchement** (`pointerup`/`click`), jamais au
STATUT : propriété universelle
SOURCE : T3
ÉNONCÉ : L'action se lie à l'événement de relâchement et jamais à l'événement de contact ; un contrôle personnalisé qui agit au contact supprime l'issue de secours fournie nativement par un bouton ou un lien.
MESURE : aucun handler d'action attaché à pointerdown, mousedown ou touchstart
`pointerdown`. Le comportement natif d'un `<button>`/`<a>` le fournit gratuitement : glisser hors de
la cible avant de lever annule. Un contrôle custom qui écoute `pointerdown` pour agir **casse** cette
issue de secours (WCAG 2.5.2) — à proscrire.

## Robustesse

RÈGLE [TOUCH-U07] : sous `forced-colors`, la cible garde sa taille (géométrie, pas couleur) — l'agrandissement
STATUT : implémentation de référence
SOURCE : T5
ÉNONCÉ : En mode de couleurs forcées, la cible conserve exactement sa taille : sa géométrie ne dépend d'aucun fond, d'aucune image et d'aucune ombre, qui sont supprimés dans ce mode.
MESURE : taille de cible identique avec et sans forced-colors: active ; aucune zone tactile produite par un box-shadow ou une image de fond
ne dépend d'aucun fond ni ombre.

RÈGLE [TOUCH-U08] : tailles en unités qui suivent le zoom (le token résout une valeur cohérente au zoom
STATUT : implémentation de référence
SOURCE : T7
ÉNONCÉ : Les tailles de cible s'expriment dans des unités qui suivent l'agrandissement du navigateur, de sorte qu'aucune cible ne rétrécit relativement au contenu agrandi.
MESURE : aucune cible dont la taille reste constante alors que le contenu est agrandi à 200 %
navigateur) ; jamais une cible figée qui rétrécit relativement au contenu agrandi.

RÈGLE [TOUCH-U09] : une cible custom (`div`/`span` rendue interactive) ne réduit pas la surface native attendue
STATUT : propriété universelle
SOURCE : T6
ÉNONCÉ : Un élément générique rendu interactif conserve la surface attendue d'un contrôle natif et expose un rôle, un nom et des états programmatiquement déterminables : la taille ne compense pas une sémantique manquante.
MESURE : toute cible custom expose un rôle et un nom accessibles, et une surface ≥ touch.target-min
et conserve son rôle et son nom accessibles — la taille ne compense pas une sémantique manquante.

## Vérifiabilité

- `valide-dossier.js` résout les références `touch.*` (groupe ajouté à ses motifs de tokens).
- La taille rendue au doigt ne se teste pas entièrement en statique (comme le `clamp()` typographique
  ou le comportement animé) : les tests qui comptent sont (1) DevTools en émulation tactile — chaque
  cible principale ≥ `touch.target-comfortable` ; (2) `(hover: none)` — aucune fonction masquée ;
  (3) un contrôle custom : l'action part bien du relâchement, pas du contact.

## Sources et niveau de confiance (couche UI)

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| T1 | `min-height`/`min-width` + hit-area étendue pour la cible tactile | [WCAG 2.2 — 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum) ; [Apple HIG — Gestures](https://developer.apple.com/design/human-interface-guidelines/gestures) | Établi |
| T2 | Régime tactile via `pointer: coarse` / `hover: none` | [MDN — pointer](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer), [MDN — hover](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover) | Établi |
| T3 | Action au relâchement (pointer cancellation) | [WCAG 2.2 — 2.5.2 Pointer Cancellation](https://www.w3.org/WAI/WCAG22/Understanding/pointer-cancellation.html) | Établi, standard d'accessibilité |
| T4 | Consommation par les composants (min-height, hit-area) | Décision interne issue de `TOUCH-UX.md` | À éprouver par tests d'appareil |
| T5 | Le mode de couleurs forcées force box-shadow, text-shadow et background-image à none et remplace les couleurs, mais ne modifie ni la mise en page ni la géométrie | [MDN — @media/forced-colors](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors) | Établi — spécification documentée par MDN |
| T6 | Un contrôle personnalisé doit exposer nom, rôle, états et valeurs de façon programmatiquement déterminable, via les API d'accessibilité ou WAI-ARIA | [WCAG 2.2 — 4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html) | Établi, standard (A) |
| T7 | Agrandissement jusqu'à 200 % sans perte de contenu ni de fonctionnalité, contrôles et libellés compris | [WCAG 2.2 — 1.4.4 Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html) | Établi, standard (AA) |
