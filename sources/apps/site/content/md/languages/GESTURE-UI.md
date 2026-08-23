---
component: gesture
layer: ui
type: language
version: 1.0.0 # 1.0.0 : première rédaction — grammaire technique des gestes : événements pointeur, alternative à pointeur unique, seuils, annulation. Aucun token propre — référence motion.* (durées du retour) et touch.* (tailles des cibles et alternatives).
last_updated: 2026-07-25
companion: GESTURE-UX.md
confidence: mixed
---

# Langage des gestes (gesture) — Couche UI

> Ce fichier traduit `GESTURE-UX.md` en techniques. Langage **comportemental sans token propre** : il
> compose `motion.*` (le retour d'accompagnement du geste) et `touch.*` (les cibles des alternatives).
> Il n'ajoute aucune valeur à `DESIGN.md`.

## Événements et alternative

RÈGLE [GESTURE-U01] : implémenter les gestes sur les **Pointer Events** (`pointerdown`/`move`/`up`/`cancel`), qui
STATUT : implémentation de référence
SOURCE : T1
ÉNONCÉ : Les gestes s'implémentent sur les événements pointeur, qui unifient souris, doigt et stylet en un seul modèle, et non sur des familles d'événements tactiles et souris traitées séparément.
MESURE : aucun gestionnaire de geste attaché à touchstart ou mousedown seuls ; cycle pointerdown / pointermove / pointerup / pointercancel complet
unifient souris, doigt et stylet — pas sur des `touchstart`/`mousedown` séparés qui divergent.

RÈGLE [GESTURE-U02] : l'action ne se lie **jamais** au seul geste. Le chemin canonique est : un **contrôle natif**
STATUT : implémentation de référence
SOURCE : T2
ÉNONCÉ : La fonction est portée par un contrôle natif et le geste n'est qu'un raccourci branché par-dessus, de sorte que l'alternative à pointeur unique et l'opérabilité clavier existent par construction et non par rattrapage.
MESURE : toute fonction exposée par un geste est également portée par un élément de contrôle natif focalisable et activable
(`<button>`, `<a>`) porte la fonction ; le geste est un **raccourci additionnel** branché par-dessus.
Ainsi l'alternative à pointeur unique (WCAG 2.5.1) et le clavier existent par construction, pas après
coup.

| Geste | Alternative obligatoire (même fonction) |
|---|---|
| Balayer pour supprimer/archiver | bouton d'action révélé ou menu « … » |
| Glisser pour réordonner (drag) | boutons monter/descendre, ou « déplacer vers » |
| Pincer pour zoomer | boutons +/−, double-tap, ou champ de niveau |
| Appui long pour menu contextuel | bouton « … » visible menant au même menu |
| Tirer pour rafraîchir | bouton « rafraîchir » |
| Secouer pour annuler (motion) | bouton « annuler » + réglage pour désactiver |

## Seuil et annulation

RÈGLE [GESTURE-U03] : un geste à trajectoire ne s'engage qu'au-delà d'un **seuil** (une distance minimale) qui le
STATUT : parti pris d'identité
SOURCE : T5, interne
ÉNONCÉ : Un geste à trajectoire ne s'engage qu'au-delà d'une distance minimale qui le distingue d'un appui et d'un défilement ; en deçà l'événement revient à l'agent utilisateur, et le sens dominant se fixe au premier franchissement puis se tient jusqu'au relâchement.
MESURE : aucun effet avant franchissement du seuil de distance ; un seul sens de geste actif entre le franchissement et le relâchement
distingue d'un tap ou d'un scroll ; en deçà, l'événement revient au défilement. Le sens dominant
(vertical = scroll, horizontal = geste, ou l'inverse) se décide au premier franchissement et se tient.

RÈGLE [GESTURE-U04] : `pointercancel` (le navigateur reprend le pointeur pour défiler) et le relâchement **hors
STATUT : propriété universelle
SOURCE : T1, T6
ÉNONCÉ : L'annulation du pointeur par l'agent utilisateur et le relâchement hors de la zone d'effet ramènent l'élément à son état initial sans exécuter la fonction, celle-ci n'étant acquise qu'au franchissement du seuil suivi d'un relâchement dans la zone.
MESURE : à réception de pointercancel ou au relâchement hors zone, retour à l'état initial et aucune fonction exécutée
zone** ramènent l'élément à son état initial via une transition `motion` — l'effet n'est acté qu'au
franchissement du seuil **et** au relâchement dans la zone d'effet (parenté WCAG 2.5.2).

RÈGLE [GESTURE-U05] : pendant le geste, n'animer que **`transform`/`opacity`** (le contenu qui suit le doigt) ;
STATUT : implémentation de référence
SOURCE : T3, T7
ÉNONCÉ : Pendant le geste, seules les propriétés composables de transformation et d'opacité sont animées ; lorsque l'utilisateur demande moins de mouvement, le suivi cède la place à une bascule d'état instantanée sans perte de fonction.
MESURE : aucune propriété déclenchant une mise en page animée pendant le geste ; sous prefers-reduced-motion: reduce, suivi remplacé par une bascule instantanée
sous `prefers-reduced-motion`, le suivi se réduit à une bascule d'état instantanée — la fonction
demeure, l'accompagnement part (contrat hérité de `MOTION-UI`).

## Cibles des alternatives

RÈGLE [GESTURE-U06] : les contrôles-alternatives (le bouton « supprimer » révélé, les boutons +/−) sont des cibles
STATUT : parti pris d'identité
SOURCE : T4
ÉNONCÉ : Les contrôles qui portent l'alternative à un geste sont des cibles tactiles de plein droit et respectent la taille confortable et l'espacement minimal du système : une alternative trop petite pour être touchée n'est pas une alternative.
MESURE : tout contrôle-alternative mesure au moins touch.target-comfortable et respecte touch.target-spacing
tactiles comme les autres : ils respectent `touch.target-comfortable` et `touch.target-spacing`
(`TOUCH-UI`). Une alternative trop petite pour être touchée n'est pas une alternative.

## Découvrabilité (technique)

RÈGLE [GESTURE-U07] : l'affordant d'un geste est rendu par des moyens **statiques et accessibles** — un « peek »
STATUT : propriété universelle
SOURCE : T7, T10
ÉNONCÉ : L'affordant d'un geste est rendu par des moyens statiques et perceptibles sans interaction préalable : il ne dépend ni d'une animation seule, absente quand l'utilisateur demande moins de mouvement, ni du seul survol, indisponible sur un dispositif qui ne survole pas.
MESURE : l'affordant reste visible sous prefers-reduced-motion: reduce et sous (hover: none)
(un bord visible), une poignée (`::before` avec un motif), un chevron. Il n'est pas porté par une
animation seule (invisible sous reduced-motion) ni par le seul `:hover` (absent au doigt, cf.
`TOUCH-UI`).

RÈGLE [GESTURE-U08] : le coach-mark de premier usage est un overlay **non-modal** léger (cf. fondation overlay),
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : L'aide au premier usage est une surcouche non modale légère, fermée au premier appui et non ré-affichée par défaut : elle ne piège pas le focus et ne conditionne pas l'accès au contenu sous-jacent.
MESURE : le coach-mark ne capture pas le focus, se ferme au premier appui et n'est pas ré-affiché après une première fermeture
fermé au premier tap, non ré-affiché par défaut.

## Robustesse

RÈGLE [GESTURE-U09] : sous `(pointer: coarse)`, les cibles-alternatives sont dimensionnées pour le doigt ; sous
STATUT : implémentation de référence
SOURCE : T10
ÉNONCÉ : Le régime d'entrée se déclare par les requêtes de média de pointeur et de survol : sous un pointeur de précision limitée, les contrôles-alternatives sont dimensionnés pour le doigt, et sous un dispositif incapable de survoler, aucun affordant de geste ne dépend du survol.
MESURE : sous (pointer: coarse), tout contrôle-alternative ≥ touch.target-comfortable ; sous (hover: none), aucun affordant de geste conditionné au survol
`(hover: none)`, aucun affordant de geste ne dépend du survol.

RÈGLE [GESTURE-U10] : un `<div>` rendu « swipable » conserve un rôle et un nom accessibles et ne capte pas les
STATUT : propriété universelle
SOURCE : T8, T9
ÉNONCÉ : Un élément générique rendu gestuel expose un rôle et un nom accessibles et n'intercepte aucun événement clavier ni aucune interaction d'assistance destinés au contrôle natif qui porte la fonction.
MESURE : tout élément générique gestuel expose un rôle et un nom accessibles ; toute fonction reste déclenchable au clavier sur le contrôle natif
événements clavier/AT destinés au contrôle natif sous-jacent.

## Vérifiabilité

- Aucun token propre à résoudre (le langage compose `motion.*` et `touch.*`, vérifiés chez leurs
  propriétaires).
- Le comportement gestuel ne se teste pas en statique : les tests qui comptent sont manuels —
  (1) chaque geste a son alternative atteignable au tap **et** au clavier ; (2) `pointercancel` et le
  relâchement hors zone annulent proprement ; (3) sous reduced-motion, le suivi s'efface mais la
  fonction reste.

## Sources et niveau de confiance (couche UI)

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| T1 | Pointer Events unifient souris/doigt/stylet ; `pointercancel` | [MDN — Pointer events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events) | Établi |
| T2 | Alternative à pointeur unique / sans glisser branchée sur un contrôle natif | [WCAG 2.2 — 2.5.1](https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures.html), [2.5.7](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html) | Établi, standard d'accessibilité |
| T3 | Retour de geste en `transform`/`opacity`, coupé sous reduced-motion | [web.dev — Animations guide](https://web.dev/articles/animations-guide) ; `MOTION-UI` | Établi + héritage interne |
| T4 | Cibles-alternatives dimensionnées au doigt | `TOUCH-UI` (touch.target-comfortable, touch.target-spacing) | Décision interne cohérente |
| T5 | touch-action détermine comment la région d'un élément peut être manipulée au doigt ; par défaut le navigateur traite seul le pan et le pincement, et l'application reçoit un pointercancel quand il prend la main — pan-x et pan-y restreignent le pan à un axe, none rend tous les gestes à l'application, manipulation conserve pan et pincement en supprimant le double-appui pour zoomer | [MDN — touch-action](https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action) | Établi — spécification CSS documentée par MDN |
| T6 | Pour une fonction opérable à pointeur unique, l'une au moins de ces conditions est vraie : l'événement de contact n'exécute aucune part de la fonction ; la fonction s'achève au relâchement avec un moyen de l'interrompre avant achèvement ou de l'annuler après ; le relâchement inverse le résultat du contact ; ou l'exécution au contact est essentielle | [WCAG 2.2 — 2.5.2 Pointer Cancellation](https://www.w3.org/WAI/WCAG22/Understanding/pointer-cancellation.html) | Établi, standard d'accessibilité (niveau A) |
| T7 | prefers-reduced-motion vaut reduce lorsque l'utilisateur a activé le réglage de réduction du mouvement ; la consigne est de supprimer, réduire ou remplacer l'animation, la fonction demeurant | [MDN — @media/prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) | Établi — spécification CSS documentée par MDN |
| T8 | Un contrôle personnalisé doit exposer nom, rôle, états et valeurs de façon programmatiquement déterminable, y compris lorsqu'il est généré par script | [WCAG 2.2 — 4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html) | Établi, standard d'accessibilité (niveau A) |
| T9 | Toute fonctionnalité doit rester opérable au clavier, sauf entrée dépendante du tracé du mouvement — un élément rendu gestuel ne peut donc pas intercepter les événements clavier destinés au contrôle qui porte la fonction | [WCAG 2.2 — 2.1.1 Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html) | Établi, standard d'accessibilité (niveau A) |
| T10 | La requête de média pointer indique la précision du dispositif de pointage principal (coarse pour un doigt sur écran tactile, fine pour une souris, none en l'absence de dispositif) ; la requête hover indique si ce dispositif peut survoler commodément, hover: none couvrant les appareils qui ne survolent pas ou n'émulent le survol que par un appui long malcommode | [MDN — @media/pointer](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer) ; [MDN — @media/hover](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover) | Établi — spécifications CSS documentées par MDN |
