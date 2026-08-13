---
component: motion
layer: ux
type: language
version: 1.3.2 # 1.3.2 : lecture d'audit du parti pris (pivot 2026-07-21) — seul le volet contraintes fonde une non-conformité chez un hôte tiers ; le registre se signale comme divergence, jamais comme défaut. 1.3.1 : frontière nommée avec le principe performance (2026-07-21) — motion possède les durées et courbes des animations, performance le contrat des attentes ; aucune règle modifiée. 1.3.0 : Motion devient un langage de premier niveau — le canal temporel qui exprime feedback et continuité ; les tokens motion.* restent des fondations techniques dans DESIGN.md. 1.2.1 : note « À approfondir » — patterns de transition inter-écrans de M3 (container transform, shared axis, fade through, fade) recensés comme hors périmètre jusqu'au layout/navigation, pour ne pas les redécouvrir (2026-07-19). 1.2.0 : distinction contrainte (WCAG) vs parti pris d'identité paramétrable (registre productif) — stress-test 2026-07-17. 1.1.0 : ajout de l'interdit dur du flash dangereux (WCAG 2.3.1) — trou P1 de l'inventaire transversal accessibilité comblé chez son propriétaire (2026-07-14, cf. DECISIONS.md). 1.0.0 : première rédaction — inventaire et benchmark faits avant livraison ; crée les tokens motion.* dans DESIGN.md 1.11.0 (les micro-interactions existaient sans vocabulaire commun : hover, chevron, disparition de l'alert, skeleton)
last_updated: 2026-07-21
companion: MOTION-UI.md
confidence: mixed # les plages de durées, les courbes et reduced-motion sont établis par convergence ; le registre "productif seulement" est une décision d'identité interne
---

# Langage de mouvement — Couche UX

> Ce fichier contient le raisonnement : à quoi le mouvement sert, combien de temps il dure, qui il ne doit jamais gêner. Les valeurs (`motion.*` — durées, courbes) vivent dans `DESIGN.md` ; les techniques vivent dans `MOTION-UI.md`.

## Note de transposition (à lire en premier)

RÈGLE [MOTION-R01] : le motion est un **langage temporel** — pas d'axes : il exprime tous les changements d'état du système par le feedback et la continuité. Particularité : ce langage est *entièrement fait* d'états transitoires — le prédicteur "état transitoire" du README ne désigne plus un trou probable mais le sujet lui-même ; son application ici devient : traiter d'office **l'interruption** (l'état transitoire de l'état transitoire, cf. § Interruption).
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Le motion est un langage temporel sans axes : il couvre tous les changements d'état du système par le feedback et la continuité, et traite l'interruption comme état transitoire de l'état transitoire.

RÈGLE [MOTION-R02] : le mouvement porte deux fonctions, et seulement deux :
STATUT : parti pris d'identité
SOURCE : S5
ÉNONCÉ : Un mouvement d'interface ne remplit que deux fonctions : confirmer qu'une action a été reçue (feedback, court et discret) ou relier deux états pour expliquer le changement (continuité, plus long mais jamais spectaculaire).
  1. **Le feedback** — confirmer qu'une action a été reçue (hover, press, transition d'état). Court, discret, immédiat.
  2. **La continuité** — relier deux états pour expliquer d'où vient le changement (chevron qui tourne, contenu qui se déplie, alert qui se résout). Un peu plus long, jamais spectaculaire.

RÈGLE [MOTION-R03] : **frontière avec le principe `performance`** (2026-07-21) — ce langage possède les durées et courbes des **animations** ; le contrat des **attentes** (quel feedback à quel délai, optimisme, honnêteté de la progression) vit dans PERFORMANCE-UX.md. L'indicateur de chargement appartient aux deux : sa forme et son mouvement ici, son moment d'apparition et sa sincérité là-bas.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Les durées et les courbes relèvent du langage de mouvement ; le contrat des attentes — quel feedback à quel délai, honnêteté de la progression — relève du principe de performance.

RÈGLE [MOTION-R04] : **le registre de ce produit est productif, pas expressif** (dualité Carbon) : documentation, précision, sobriété. Le mouvement décoratif, d'ambiance ou de célébration est hors registre par décision — pas de bounce, pas de stagger d'apparat, pas d'animation de marque. Toute exception se journalise.
STATUT : parti pris d'identité
SOURCE : S5
ÉNONCÉ : Le registre du mouvement est productif et non expressif : aucun mouvement décoratif, d'ambiance, de célébration ou de marque, et toute exception se journalise.
MESURE : aucun rebond, aucun stagger d'apparat, aucune animation de marque

RÈGLE [MOTION-R05] : **distinguer la contrainte du parti pris (1.2.0).** Deux natures de règles cohabitent dans ce langage et ne se négocient pas de la même façon : les **contraintes** (WCAG — reduced-motion, flash < 3/s, transform/opacity, jamais l'information par le mouvement seul) sont **non négociables** ; le **registre « productif seulement »** est un **parti pris d'identité** (ligne CONFIANCE « décision interne »), donc **paramétrable par un consommateur qui l'assume** — une marque expressive (ex. un hero interactif) peut relever le registre **sans jamais toucher aux contraintes** (mouvement coupé sous reduced-motion, transform/opacity seuls, aucune information portée par le mouvement). Le système encadre la dérogation au lieu de la forcer : relever le registre est un chemin sanctionné, pas une entorse. **Lecture d'audit (pivot 2026-07-21)** : face à une interface tierce, seul le volet *contraintes* fonde une non-conformité ; une animation expressive chez un hôte au registre assumé est une *divergence de registre* à signaler à part, pas un défaut.
STATUT : note de méthode
SOURCE : S5
ÉNONCÉ : Les contraintes d'accessibilité du mouvement ne se négocient pas, tandis que le registre productif est un parti pris paramétrable : un écart de registre chez un consommateur tiers se signale comme divergence, jamais comme non-conformité.

> **Pourquoi** : le mouvement est le canal le plus intrusif du système — il capte l'attention de force (la vision périphérique est câblée pour détecter le mouvement). Un produit de documentation qui bouge beaucoup est un produit qui interrompt beaucoup.

## Le mouvement confirme, il n'informe jamais seul

RÈGLE [MOTION-R06] : **la règle cardinale** : toute information portée par un mouvement existe aussi statiquement — l'état du chevron est dans `aria-expanded`, la résolution de l'alert est annoncée (ALERT-UX), le chargement a son indicateur visible. Le mouvement est une *confirmation sensorielle*, jamais la *source* de l'information.
STATUT : propriété universelle
SOURCE : S10, S6, S7
ÉNONCÉ : Toute information portée par un mouvement doit exister aussi sans lui : sous forme textuelle ou programmatiquement déterminable, le mouvement n'étant qu'une confirmation sensorielle.
MESURE : tout état signalé par une animation est exposé dans le DOM ou en texte, et reste lisible mouvement coupé

> **Pourquoi** : c'est la condition qui rend `prefers-reduced-motion` implémentable sans perte : si couper le mouvement coupait de l'information, la préférence d'accessibilité deviendrait une dégradation fonctionnelle.

## Durées — l'échelle et ses bornes

RÈGLE [MOTION-R07] : trois crans (`motion.fast` / `motion.base` / `motion.slow`), et une lecture simple : **petit changement = cran court, grand changement = cran long**. Feedback (hover, couleur) : fast. Continuité locale (chevron, apparition, dépliage) : base. Grandes surfaces (panneaux, futurs superposés) : slow.
STATUT : parti pris d'identité
SOURCE : S1
ÉNONCÉ : L'amplitude du changement décide de la durée : petit changement, cran court ; continuité locale, cran médian ; grande surface, cran long.
MESURE : toute durée d'animation provient d'un token motion.fast, motion.base ou motion.slow, jamais d'une valeur en dur

RÈGLE [MOTION-R08] : bornes sourcées — sous ~100 ms, un feedback est perçu comme instantané (Nielsen) ; au-delà de ~400 ms, une transition paraît lente (Material). L'échelle entière de ce système vit dans cette fenêtre, et son cran le plus long reste sous la borne haute.
STATUT : propriété universelle
SOURCE : S2, S1
ÉNONCÉ : Un feedback rendu en moins d'environ 100 ms est perçu comme instantané, et une transition d'interface qui dépasse environ 400 ms est perçue comme lente.
MESURE : aucune durée de transition d'interface supérieure à 400 ms

RÈGLE [MOTION-R09] : **la sortie est plus courte que l'entrée** : ce qui part n'a plus besoin d'attention — en pratique, une sortie prend le cran inférieur de son entrée (entrée base → sortie fast).
STATUT : propriété universelle
SOURCE : S3, S15
ÉNONCÉ : La sortie d'un élément est plus rapide que son entrée, ce qui part n'ayant plus besoin d'attention.
MESURE : pour un même élément, durée de sortie strictement inférieure à la durée d'entrée

RÈGLE [MOTION-R10] : le mouvement **ne verrouille jamais l'interaction** : aucune action n'attend la fin d'une animation pour être disponible ; l'animation accompagne le changement d'état, elle ne le retarde pas.
STATUT : parti pris d'identité
SOURCE : S1
ÉNONCÉ : Le mouvement ne verrouille jamais l'interaction : aucune action n'attend la fin d'une animation pour devenir disponible.
MESURE : aucune action désactivée ou différée pendant la durée d'une animation

## Courbes — trois, et pourquoi pas plus

RÈGLE [MOTION-R11] : trois courbes (`motion.ease-out` / `motion.ease-in` / `motion.ease-in-out`), mappées sur les trois situations : **ce qui entre décélère** (ease-out : arrive vite, se pose), **ce qui sort accélère** (ease-in : s'efface sans traîner), **ce qui bouge sur place fait les deux** (ease-in-out : chevron, dépliage). Consensus explicite des quatre systèmes benchmarkés.
STATUT : parti pris d'identité
SOURCE : S4
ÉNONCÉ : Ce qui entre décélère, ce qui sort accélère, ce qui bouge sur place fait les deux — et le vocabulaire s'arrête à ces trois courbes.
MESURE : toute animation consomme une des trois courbes motion.ease-out, motion.ease-in ou motion.ease-in-out

RÈGLE [MOTION-R12] : **jamais de linéaire pour un déplacement** ("le mouvement strictement linéaire paraît artificiel à l'œil" — Carbon) — une seule exception : la **rotation continue du spinner** (Polaris la réserve exactement à ça).
STATUT : parti pris d'identité
SOURCE : S4
ÉNONCÉ : Aucun déplacement n'utilise une courbe linéaire ; le linéaire est réservé à la rotation continue d'un indicateur de chargement.
MESURE : aucune transition sur transform en timing-function linear, hors indicateur de chargement

## Interruption — écrit d'office

RÈGLE [MOTION-R13] : toute transition est **interruptible et repart de l'état courant** : un re-hover pendant la sortie du hover inverse la transition là où elle en est ; un double clic sur le chevron ne rejoue pas deux animations. Jamais de file d'attente d'animations, jamais d'état "en attente de fin d'animation".
STATUT : parti pris d'identité
SOURCE : S12
ÉNONCÉ : Toute transition est interruptible et repart de la valeur courante : aucune file d'attente d'animations, aucun état d'attente de fin d'animation, aucun rejeu en double.
MESURE : un re-déclenchement pendant une transition inverse le mouvement depuis l'état courant, sans saut ni verrou

> **Pourquoi** : les transitions CSS ont ce comportement nativement — le perdre (animations par keyframes rejouées, verrous JS) est une régression qu'on s'interdit d'introduire.

## Ce qui ne s'anime pas

RÈGLE [MOTION-R14] : **le focus ring n'est jamais animé** — c'est une information de position pour la navigation clavier, pas un effet (règle partagée avec BORDER-UX, qui fait autorité sur le ring).
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : L'indicateur de focus apparaît instantanément : il n'est jamais animé ni retardé, car il porte une information de position clavier et non un effet.
MESURE : aucune propriété de transition sur l'outline ou le box-shadow de focus

RÈGLE [MOTION-R15] : **rien n'anime au chargement initial** de la page — le contenu proactif est du contenu comme un autre (généralisation de ALERT-UX : "pas d'animation d'entrée nécessaire") ; les entrées animées sont réservées aux changements *réactifs* (conséquences d'une action).
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Rien ne s'anime au chargement initial d'une page : les entrées animées sont réservées aux changements consécutifs à une action de l'utilisateur.
MESURE : aucune animation d'entrée déclenchée avant la première interaction

RÈGLE [MOTION-R16] : **le contenu ne se déplace jamais sans action de l'utilisateur** : l'insertion dynamique réserve son espace quand c'est possible (ALERT-UX, SPACING-UX) ; à défaut, elle insère sous le point de lecture. Le déplacement non sollicité est le mouvement le plus hostile — il déplace la cible sous le curseur.
STATUT : propriété universelle
SOURCE : S11, S7
ÉNONCÉ : Le contenu ne se déplace jamais sans action de l'utilisateur : une insertion dynamique réserve son espace, ou à défaut s'insère hors du point de lecture.
MESURE : CLS ≤ 0,1, les décalages survenant dans les 500 ms suivant une interaction discrète étant exclus

RÈGLE [MOTION-R17] : pas de **stagger décoratif** : ce qui réagit ensemble bouge ensemble (des cartes qui apparaissent en cascade, c'est de l'expressif — hors registre).
STATUT : parti pris d'identité
SOURCE : S5
ÉNONCÉ : Les éléments qui réagissent ensemble s'animent ensemble : aucun décalage en cascade décoratif.
MESURE : aucun delay échelonné entre éléments d'un même groupe

## prefers-reduced-motion — le contrat d'accessibilité

RÈGLE [MOTION-R18] : sous `prefers-reduced-motion: reduce` : **les déplacements, rotations, changements d'échelle se désactivent ; les changements d'opacité et de couleur peuvent rester** (la préférence vise le mouvement *spatial* — troubles vestibulaires : nausées, vertiges — pas le changement visuel). "Reduce" ne veut pas dire zéro : un crossfade remplace un glissement.
STATUT : propriété universelle
SOURCE : S6, S14
ÉNONCÉ : Sous prefers-reduced-motion: reduce, les déplacements, rotations et changements d'échelle sont supprimés ou remplacés ; les changements d'opacité et de couleur peuvent subsister, la préférence visant le mouvement spatial.
MESURE : sous prefers-reduced-motion: reduce, aucune translation, rotation ni mise à l'échelle animée

RÈGLE [MOTION-R19] : applications concrètes chez les consommateurs : bascules d'état instantanées ou en fondu (hover, élévation), chevron qui *saute* à son orientation finale, **skeleton sans pulse** (l'attente reste visible, statique — l'indicateur demeure, le mouvement part), spinner remplacé par un indicateur statique ou un pulse d'opacité.
STATUT : implémentation de référence
SOURCE : S6
ÉNONCÉ : Sous mouvement réduit, les bascules d'état sont instantanées ou en fondu, le chevron saute à son orientation finale, le squelette reste visible sans pulsation et l'indicateur de chargement cède la place à un rendu statique.

RÈGLE [MOTION-R20] : cadre normatif — WCAG 2.3.3 (AAA) : les animations d'interaction doivent pouvoir être désactivées ; WCAG 2.2.2 (A) : tout mouvement automatique de plus de 5 s doit être arrêtable. Le seul mouvement en boucle du système (pulse du skeleton) est un indicateur de chargement — exemption prévue par 2.2.2 — et il est *quand même* coupé sous reduced-motion, par choix.
STATUT : propriété universelle
SOURCE : S7
ÉNONCÉ : Une animation déclenchée par une interaction doit pouvoir être désactivée, et tout mouvement automatique qui dure plus de cinq secondes et se présente en parallèle d'autre contenu doit offrir un moyen de le mettre en pause, de l'arrêter ou de le masquer.
MESURE : aucune animation en boucle de plus de 5 s présentée en parallèle d'autre contenu sans mécanisme de pause, d'arrêt ou de masquage

CONFIANCE : établi (WCAG, MDN/web.dev, convergence des systèmes) ; le sur-respect du skeleton est une décision interne.

## Flash et clignotement — l'interdit dur

RÈGLE [MOTION-R21] : **aucune séquence ne flashe plus de trois fois par seconde**, et rien ne franchit les seuils de flash général ou de flash rouge (WCAG 2.3.1, niveau A). Le registre productif ne prévoit aucun flash — cette règle **verrouille** l'interdit pour tout futur consommateur (célébration, alerte clignotante, chargement pulsé agressif) : le clignotement rapide « pour attirer l'œil » est proscrit, l'attention se gagne par la place et le mot, jamais par le stroboscope.
STATUT : propriété universelle
SOURCE : S8
ÉNONCÉ : Aucune séquence ne flashe plus de trois fois par seconde, et aucune ne franchit les seuils de flash général ou de flash rouge.
MESURE : ≤ 3 flashs par seconde ; seuils de flash général et de flash rouge non franchis

RÈGLE [MOTION-R22] : le seul mouvement en boucle admis reste l'indicateur de chargement (skeleton, spinner) — il pulse en **opacité douce**, jamais en flash ; un clignotement décoratif, rapide (dangereux) comme lent (bruit), n'existe pas dans le registre.
STATUT : parti pris d'identité
SOURCE : S7
ÉNONCÉ : Le seul mouvement en boucle admis est l'indicateur de chargement, qui pulse en opacité douce ; aucun clignotement décoratif n'existe dans le système.
MESURE : aucune animation en boucle hors indicateur de chargement

> **Pourquoi** : c'est le seul risque du langage qui ne dégrade pas le confort mais peut **déclencher une crise** (épilepsie photosensible). Contrairement à une durée trop longue (agaçante) ou à un layout animé (saccadé), un flash au-dessus du seuil est un danger physiologique sans contrepartie ergonomique négociable — d'où l'interdit dur, distinct du reste du registre.

CONFIANCE : établi — WCAG 2.3.1 (seuil des trois flashs) et 2.3.2 sont un standard d'accessibilité.

## Performance — la contrainte qui décide des techniques

RÈGLE [MOTION-R23] : n'animer que **`transform` et `opacity`** (étape composite — pas de layout, pas de paint) ; jamais width/height/top/margin (layout) ni box-shadow interpolé (paint) — les techniques concrètes (ombre par pseudo-élément, dépliage) vivent dans MOTION-UI.
STATUT : propriété universelle
SOURCE : S9, S13
ÉNONCÉ : Les animations portent sur des propriétés composites — transform et opacity — et jamais sur des propriétés qui déclenchent le layout ou un repaint coûteux.
MESURE : aucune propriété de layout dans les transitions

> **Pourquoi** : une animation qui saccade est pire que pas d'animation — elle transforme le feedback en bruit. La contrainte technique rejoint le registre sobre : ce qui est cher à animer est précisément ce qu'on ne veut pas animer.

## Risque

RÈGLE [MOTION-R24] : table ci-dessous
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Le langage tient une table des risques du mouvement, de leur nature et de leur sévérité.

| Cas | Risque principal | Sévérité |
|---|---|---|
| Information portée par le mouvement seul | Perte fonctionnelle sous reduced-motion, AT aveugle | Critique |
| Flash > 3/s ou seuil de flash rouge franchi | Risque de crise photosensible (WCAG 2.3.1) | Critique |
| reduced-motion ignoré | Troubles vestibulaires — nausées, vertiges (WCAG 2.3.3) | Élevée |
| Contenu déplacé sans action utilisateur | Cible mouvante, clics ratés, lecture perdue | Élevée |
| Mouvement qui verrouille l'interaction | Utilisateur otage de l'animation | Élevée |
| Animation de layout (width/top/margin) | Saccades, feedback transformé en bruit | Moyenne à élevée |
| Boucle > 5 s non arrêtable (hors indicateurs) | Échec WCAG 2.2.2 (niveau A) | Élevée |
| Durées > ~400 ms | Produit perçu comme lent | Moyenne |
| Focus animé | Position clavier incertaine | Moyenne |
| Vocabulaire incohérent (durées/courbes par écran) | Produit perçu comme disparate | Moyenne |

## Règle transversale

RÈGLE [MOTION-R25] : **le mouvement est un commentaire — jamais le texte.** Il confirme, relie, occupe l'attente ; il n'informe pas seul, ne bloque pas, ne décore pas.
STATUT : parti pris d'identité
SOURCE : S10
ÉNONCÉ : Le mouvement est un commentaire et jamais le texte : il confirme, relie et occupe l'attente, mais n'informe pas seul, ne bloque pas et ne décore pas.

> **Pourquoi** : c'est la déclinaison temporelle du principe des canaux (COLOR-UX : jamais la couleur seule ; ICONOGRAPHY-UX : jamais le dessin seul) — le mouvement est le troisième canal non fiable : le plus rapide à percevoir, le premier à disparaître (reduced-motion, AT, captures).

## Sources et niveau de confiance

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| S1 | Plages de durées 50-400 ms, petit=court/grand=long | [Atlassian — Motion](https://atlassian.design/foundations/motion) (interactions 50-150 / transitions 150-400), [Carbon — Motion](https://carbondesignsystem.com/elements/motion/overview/) (70-700 ms), [Material — durées](https://m1.material.io/motion/duration-easing.html) (au-delà de 400 ms : lent), [Polaris — tokens](https://polaris-react.shopify.com/tokens/motion) | Établi — convergence des quatre systèmes |
| S2 | < 100 ms perçu instantané ; 1 s limite du flux de pensée | [NN/g — Response Times](https://www.nngroup.com/articles/response-times-3-important-limits/) ; [Doherty threshold](https://lawsofux.com/doherty-threshold/) (< 400 ms) | Établi — littérature fondatrice |
| S3 | Sortie plus courte que l'entrée | [Material v1 — Duration & easing](https://m1.material.io/motion/duration-easing.html) (225/195 ms) | Établi chez Material, convergent |
| S4 | ease-out entrée / ease-in sortie / ease-in-out sur place ; jamais linéaire sauf spinner | [Carbon](https://carbondesignsystem.com/elements/motion/overview/), [Atlassian](https://atlassian.design/foundations/motion), [Polaris](https://polaris-react.shopify.com/tokens/motion) (linear réservé aux spinners), [Material 3 — easing & duration](https://m3.material.io/styles/motion/easing-and-duration/tokens-specs) | Établi — consensus fort |
| S5 | Dualité productive/expressive | [Carbon — Motion](https://carbondesignsystem.com/elements/motion/overview/) | Établi chez Carbon — le "productif seul" est un choix d'identité interne |
| S6 | reduced-motion : réduire ≠ supprimer ; opacité conservable, déplacement remplacé | [MDN — prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion), [web.dev](https://web.dev/articles/prefers-reduced-motion) | Établi |
| S7 | WCAG 2.3.3 (AAA) et 2.2.2 (A, exemption des indicateurs de progression) | [W3C — Animation from Interactions](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions), [Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html) | Établi, standard d'accessibilité |
| S8 | Flash ≤ 3/s, seuils général et rouge (WCAG 2.3.1) | [W3C — Three Flashes or Below Threshold](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html) | Établi, standard d'accessibilité |
| S9 | transform/opacity seuls (composite) | [web.dev — Animations guide](https://web.dev/articles/animations-guide) | Établi — littérature performance |
| S10 | Toute information véhiculée par la présentation doit être programmatiquement déterminable ou disponible en texte — fondement normatif du « jamais l'information par le mouvement seul », qui n'était appuyé sur aucune norme | [WCAG 2.2 — 1.3.1 Info and Relationships](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) | Établi, standard (A) |
| S11 | Les décalages de mise en page non sollicités sont mesurés et pénalisés (seuil « bon » à 0,1) ; les décalages survenant dans les 500 ms suivant une interaction discrète sont explicitement exclus — la distinction exacte que pose R16 | [web.dev — Cumulative Layout Shift (CLS)](https://web.dev/articles/cls) | Établi — métrique Core Web Vitals, seuil chiffré |
| S12 | Le réamorçage d'une transition interrompue est spécifié : la nouvelle transition part de la valeur courante de la propriété (« reversing-adjusted start value ») | [W3C — CSS Transitions Level 1](https://www.w3.org/TR/css-transitions-1/) | Établi, spécification W3C |
| S13 | transform et opacity ne déclenchent qu'une recomposition ; les propriétés géométriques déclenchent layout puis repaint, et les propriétés colorimétriques déclenchent un repaint | [MDN — Animation performance and frame rate](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Animation_performance_and_frame_rate) | Établi, documentation de référence — **contredit le tableau de mapping de MOTION-UI**, qui qualifie background-color de « composite-friendly » |
| S14 | Ancrage normatif de la caractéristique média prefers-reduced-motion et de sa valeur reduce | [W3C — Media Queries Level 5, prefers-reduced-motion](https://www.w3.org/TR/mediaqueries-5/#prefers-reduced-motion) | Établi, spécification W3C |
| S15 | **Relevé de convergence du 2026-07-27 — la sortie est plus rapide que l'entrée.** Atlassian (« make exit motion faster than entrances »), Carbon (easing de sortie accéléré, « its departure from the screen is permanent »), Material v1 (225 ms entrée / 195 ms sortie) | [Atlassian — Motion](https://atlassian.design/foundations/motion) ; [Carbon — Motion](https://carbondesignsystem.com/elements/motion/overview/) ; [Material v1 — Duration & easing](https://m1.material.io/motion/duration-easing.html) | Établi par convergence — 3 systèmes vérifiés sur source primaire |
| S16 | **Nuance relevée le 2026-07-27.** WCAG 2.2.2 exige trois conditions cumulatives, dont « presented in parallel with other content » ; l'exemption des indicateurs de chargement est conditionnelle, réservée au cas où aucune interaction n'est possible pendant la phase. Un squelette qui pulse à côté d'autre contenu n'est donc pas exempté d'office | [WCAG 2.2 — 2.2.2 Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html) | Établi, standard (A) — **nuance R20 et R22** |

## À approfondir

- **Toast/snackbar** : ses durées d'affichage (auto-dismiss) sont une décision du composant à naître — ce langage ne fournit que le vocabulaire d'entrée/sortie.
- **Futurs superposés** (modale) : entrée en slow + scrim — à confirmer avec elevation.overlay et le scrim (COLOR-UX).
- **Patterns de transition inter-écrans (M3)** : Material 3 documente quatre chorégraphies de navigation entre surfaces — *container transform* (un élément se transforme en un autre : carte → page de détail), *shared axis* (relation directionnelle x/y/z entre pairs : onglets, stepper), *fade through* (le sortant s'efface puis l'entrant apparaît, sans lien fort) et *fade* (entrée/sortie dans les limites de l'écran : dialog, menu). **Hors périmètre pour l'instant** — on n'a ni layout ni navigation, et ces patterns relèvent du registre expressif/spatial qu'on a écarté (§ Note de transposition). À rouvrir le jour où le produit a des vues superposées ou une vraie navigation : *fade through* et *fade* rentrent sans peine dans le registre productif ; *container transform* et *shared axis* sont plus expressifs et demandent un arbitrage (comme le relèvement de registre du 1.2.0). On garde le vocabulaire (durées/courbes/entrée-sortie) qui les alimenterait ; ce qui manque, c'est l'orchestration cross-composant. Réf. [M3 — Transition patterns](https://m3.material.io/styles/motion/transitions/transition-patterns).
- **View Transitions API** : hors périmètre tant que les transitions restent locales à un composant (c'est le levier technique des patterns inter-écrans ci-dessus).
- **Retour haptique mobile** (BUTTON-UX le mentionne au tap) : canal voisin du motion, non traité ici — à rattacher le jour où le produit a une surface native.
