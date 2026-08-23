---
component: touch
layer: ux
type: foundation
version: 1.0.0 # 1.0.0 : première rédaction — la fondation qui tokenise la TAILLE et l'ATTEINTE d'une cible tactile (touch.target-min/comfortable/spacing). Comble une déduction silencieuse : DESIGN.md référençait « le 44px tactile » via scale.desktop-min sans jamais le nommer. Inventaire + benchmark faits avant livraison.
last_updated: 2026-07-25
companion: TOUCH-UI.md
confidence: mixed # les seuils de cible (24 AA, 44 AAA) sont établis par WCAG/HIG ; le choix des trois crans et de l'espacement par défaut est un arbitrage interne
---

# Fondation tactile (touch) — Couche UX

> Cette fondation ne porte pas une forme ni une couleur : elle porte une **contrainte de taille et
> d'atteinte**. Une cible doit être assez grande pour être touchée sans erreur, assez isolée de ses
> voisines, et placée là où le doigt arrive. Les valeurs (`touch.*`) vivent dans `DESIGN.md` ; leur
> application technique vit dans `TOUCH-UI.md`. Le *geste* (glisser, balayer, pincer) est un sujet
> voisin distinct : `GESTURE` (langage).

## Note de transposition (à lire en premier)

RÈGLE [TOUCH-R01] : le doigt n'est pas une souris. Il est **imprécis** (une empreinte de contact d'environ 9 mm,
STATUT : propriété universelle
SOURCE : S13, S10
ÉNONCÉ : Une interface tactile se conçoit pour un doigt imprécis, qui masque sa propre cible et ne survole pas, et non pour un curseur qui vise un pixel : cette différence se traduit en contraintes de taille, d'espacement et d'affordance, pas en ajustements esthétiques.
là où un curseur vise un pixel), il **masque sa propre cible**, et il n'a **pas de survol** fiable.
La fondation touch traduit ces trois faits en une seule exigence mesurable : la cible tactile a une
taille plancher, une taille confortable et un espacement minimal — nommés une fois, pour tout le système.

RÈGLE [TOUCH-R02] : **la cible n'est pas l'icône.** La zone qui reçoit le doigt (le *hit target*) peut être bien
STATUT : propriété universelle
SOURCE : S1, S13
ÉNONCÉ : La cible tactile est la région qui accepte l'action du pointeur, pas le dessin visible : réduire une icône ne réduit jamais la zone qui la reçoit.
MESURE : zone tactile ≥ cran visé, indépendamment des dimensions du dessin
plus grande que le dessin visible. Une icône de 20 px se touche dans une cible de 44 px grâce au
padding. Réduire le dessin ne réduit jamais la cible.

> **Pourquoi** : la première cause d'erreur au doigt n'est pas la mauvaise compréhension, c'est le
> **ratage** — une cible trop petite ou trop proche d'une autre. C'est une contrainte physique, pas
> esthétique : elle ne se négocie pas au nom de la densité visuelle.

## Les trois crans de cible

RÈGLE [TOUCH-R03] : trois valeurs, et une lecture simple — **confort par défaut, plancher en dernier recours,
STATUT : parti pris d'identité
SOURCE : S6
ÉNONCÉ : Le système expose exactement trois crans de cible tactile — une taille confortable par défaut, un plancher absolu, un espacement minimal — et aucune autre valeur.
espacement toujours**.

| Cran | Rôle | Quand |
|---|---|---|
| `touch.target-comfortable` | la cible tactile **par défaut** | toute action principale ou fréquente au doigt |
| `touch.target-min` | le **plancher absolu** | cible dense justifiée (barre d'outils, tableau) — jamais en dessous |
| `touch.target-spacing` | l'**écart minimal** entre deux cibles adjacentes | dès que deux cibles se touchent du regard |

RÈGLE [TOUCH-R04] : `touch.target-comfortable` est la valeur qu'on vise sans y penser. On ne descend à
STATUT : parti pris d'identité
SOURCE : S6, S2
ÉNONCÉ : Toute cible vise par défaut la taille confortable ; descendre au plancher exige un besoin de densité réel et documenté, et n'est jamais permis sans respecter l'espacement minimal.
MESURE : cible par défaut = touch.target-comfortable ; usage de touch.target-min accompagné d'une justification de densité écrite
`touch.target-min` que lorsque la densité est un besoin réel et documenté — et **jamais** sans
respecter `touch.target-spacing`, qui rend deux petites cibles distinctes.

RÈGLE [TOUCH-R05] : sous `touch.target-min`, le build **s'arrête et remonte**. Une cible plus petite que le
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Quand une cible tomberait sous le plancher hors des deux exceptions nommées, le build s'interrompt et remonte le cas au lieu de livrer.
plancher n'est légitime que dans deux cas nommés (ci-dessous : *inline* et *essentiel*) ; hors de
ces cas, c'est un défaut, pas un choix.

> **Pourquoi ces valeurs** : `touch.target-min` (24) est le plancher AA de WCAG 2.5.8 ;
> `touch.target-comfortable` (44) est à la fois le seuil AAA de WCAG 2.5.5 et la recommandation
> d'Apple (44 pt) — deux autorités qui convergent sur la même cible confortable. Material vise 48 dp,
> un cran au-dessus : le choix de 44 place la barre au point de convergence WCAG/HIG, pas au maximum.

## Les deux exceptions au plancher

RÈGLE [TOUCH-R06] : une cible peut descendre sous `touch.target-min` dans **deux cas seulement**, tous deux
STATUT : propriété universelle
SOURCE : S1
ÉNONCÉ : Une cible ne peut descendre sous le plancher de 24 px CSS que si elle est prise dans le fil d'un texte (inline) ou si sa petitesse est essentielle à sa fonction.
MESURE : toute cible < 24×24 px CSS relève du cas inline ou du cas essentiel
prévus par WCAG 2.5.8 :

1. **En ligne (inline)** — une cible prise dans le fil d'un texte (un lien dans un paragraphe) suit
   la ligne ; on ne gonfle pas l'interligne pour l'agrandir.
2. **Essentiel** — quand la petitesse est *intrinsèque à la fonction* : un point précis sur une
   carte, une poignée de sélection fine. La cible ne peut pas être plus grande sans changer ce
   qu'elle fait.

RÈGLE [TOUCH-R07] : ces deux exceptions se **déclarent**, elles ne se présument pas. Toute autre cible sous le
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Les exceptions au plancher se déclarent explicitement au cas par cas ; une cible sous le plancher sans exception déclarée est un défaut, pas un choix.
MESURE : toute cible sous le plancher porte une déclaration d'exception nommée
plancher est un défaut. Une exception « inline » qui pourrait être un vrai bouton n'en est pas une.

## L'atteinte — où le doigt arrive

RÈGLE [TOUCH-R08] : les actions **primaires et fréquentes** d'un parcours au doigt visent la **zone
STATUT : parti pris d'identité
SOURCE : S5, S14
ÉNONCÉ : Chez nous, les actions primaires et fréquentes d'un parcours au doigt se placent dans la zone atteignable à une main (centre et bas d'écran), et le haut et les coins sont réservés aux actions peu fréquentes.
atteignable** (bas et centre de l'écran à une main). Le haut de l'écran et les coins coûtent un
repositionnement de la main : on y réserve les actions **peu fréquentes** (fermer, revenir, régler).

RÈGLE [TOUCH-R09] : on ne place jamais une cible tapable là où elle entre en **conflit avec un geste système**
STATUT : propriété universelle
SOURCE : S12, S2
ÉNONCÉ : Aucune cible tapable ne se place dans une zone réservée aux gestes système (balayage de bord, barre d'accueil, encoche) : ces régions appartiennent au système d'exploitation.
MESURE : aucune cible interactive dans les zones d'exclusion de gestes déclarées par la plateforme
(zone de balayage du bord, barre d'accueil, encoche). La frontière avec le système appartient au
système.

> **Pourquoi** : la loi de Fitts (cf. `LAWS-UX`) dit qu'une cible est d'autant plus rapide à
> atteindre qu'elle est grande ET proche. L'atteinte est l'autre moitié de la taille : une cible de
> 44 placée hors de portée du pouce reste coûteuse.

## L'appui remplace le survol

RÈGLE [TOUCH-R10] : au doigt, il n'y a **pas de hover** — le **press** (l'appui) est le signal d'affordance. La
STATUT : propriété universelle
SOURCE : S10
ÉNONCÉ : Aucune information ni aucune action ne repose sur le seul survol : sous un pointeur incapable de survoler, la totalité des fonctions reste atteignable, l'appui tenant lieu de signal d'affordance.
MESURE : sous (hover: none), 100 % des fonctions restent atteignables
fondation touch impose que **rien** (ni information, ni action) ne vive derrière le seul survol :
sous `(hover: none)`, tout reste accessible. Cette règle est partagée avec `INTERACTION` (qui la pose
pour l'affordance) et `MOTION` (qui pose le feedback de press) ; touch en est le propriétaire côté
entrée physique.

RÈGLE [TOUCH-R11] : l'action se déclenche au **relâchement sur la cible**, jamais au premier contact. Glisser le
STATUT : propriété universelle
SOURCE : S4
ÉNONCÉ : L'action se déclenche au relâchement sur la cible et jamais au premier contact ; glisser le doigt hors de la cible avant de lever annule l'action.
MESURE : aucune action déclenchée sur l'événement de contact ; sortie de la cible avant relâchement = annulation
doigt hors de la cible avant de lever **annule** l'action — c'est l'annulation du pointeur
(WCAG 2.5.2), une issue de secours contre le tap raté.

RÈGLE [TOUCH-R12] : le **retour haptique** (vibration) est un supplément facultatif, jamais un canal unique : il
STATUT : propriété universelle
SOURCE : S11
ÉNONCÉ : Le retour haptique est un supplément facultatif et jamais un canal unique : il est absent de nombreux appareils et navigateurs et reste désactivable par l'utilisateur.
MESURE : aucune information ni action portée uniquement par le retour haptique
est absent de beaucoup d'appareils, désactivable, et invisible pour qui ne le sent pas.

## Robustesse et accessibilité

RÈGLE [TOUCH-R13] : la cible reste tapable **au zoom** (200 %, loupe) — les tailles dérivent de tokens, jamais
STATUT : propriété universelle
SOURCE : S9
ÉNONCÉ : Une cible reste atteignable et activable à 200 % d'agrandissement : ses dimensions dérivent de tokens qui suivent le zoom, jamais d'une valeur absolue figée.
MESURE : toute cible reste ≥ touch.target-min et activable à 200 % de zoom
d'un px absolu qui ne suit pas l'agrandissement.

RÈGLE [TOUCH-R14] : la marge de `touch.target-comfortable` et de `touch.target-spacing` **est** l'accessibilité
STATUT : propriété universelle
SOURCE : S1, S2
ÉNONCÉ : La taille confortable et l'espacement minimal sont des exigences d'accessibilité motrice — ils protègent les personnes dont la visée tremble ou manque de précision — et ne se négocient pas au nom de la densité visuelle.
motrice : elle protège la personne dont la visée tremble ou manque de précision. Ce n'est pas un
confort esthétique, c'est une rampe.

RÈGLE [TOUCH-R15] : une cible n'existe **jamais que pour le doigt**. Toute cible tactile est aussi atteignable au
STATUT : propriété universelle
SOURCE : S7, S8
ÉNONCÉ : Toute cible tactile est également opérable au clavier, porte un indicateur de focus visible et expose un nom et un rôle accessibles : la taille de la cible ne remplace jamais sa sémantique.
MESURE : toute cible tactile est focalisable au clavier, montre un focus visible et porte un nom accessible programmatiquement déterminable
clavier, avec un focus visible et un nom accessible — la taille de la cible ne remplace pas son
libellé. (Le contrat clavier/focus complet appartient au principe `accessibility`.)

## Test tactile

RÈGLE [TOUCH-R16] : toute nouvelle famille de cibles passe ces quatre questions :
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Toute nouvelle famille de cibles est soumise aux quatre questions du test tactile (taille, espacement, indépendance au survol, atteignabilité clavier/zoom/nom), et un « non » appelle une cible plus grande, mieux espacée ou mieux placée, jamais plus dense.

1. Au doigt, chaque cible atteint-elle `touch.target-comfortable`, ou au moins `touch.target-min`
   **avec** l'espacement ?
2. Deux cibles adjacentes sont-elles séparées d'au moins `touch.target-spacing` ?
3. Aucune fonction ne dépend-elle du seul survol (`(hover: none)`) ?
4. Toute cible reste-t-elle atteignable au clavier, au zoom, et porte-t-elle un nom accessible ?

Un « non » n'appelle pas une cible plus dense : il appelle une cible plus grande, mieux espacée, ou
mieux placée.

## Risque

| Cas | Risque principal | Sévérité |
|---|---|---|
| Cible sous `touch.target-min` hors exception | Ratage systématique au doigt | Élevée |
| Deux petites cibles collées (pas d'espacement) | Action voisine déclenchée par erreur | Élevée |
| Fonction derrière le seul hover | Invisible au doigt et au clavier | Élevée |
| Cible = icône (dessin) au lieu de zone | Cible réelle bien plus petite qu'elle n'en a l'air | Élevée |
| Action primaire fréquente en haut d'écran | Coût d'atteinte répété au pouce | Moyenne |
| Cible tapable dans une zone de geste système | Conflit, déclenchement système involontaire | Moyenne |
| Retour haptique comme seul signal | Perdu sur appareil sans vibreur ou vibration coupée | Moyenne |
| Taille figée en px absolu | Cible qui ne suit pas le zoom | Moyenne |

## Sources et niveau de confiance

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| S1 | Cible minimale de 24 × 24 px CSS (avec exceptions inline / essentiel / espacement) | [WCAG 2.2 — 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum) | Établi, standard d'accessibilité (niveau AA) |
| S2 | Cible confortable de 44 × 44 px CSS | [WCAG 2.1 — 2.5.5 Target Size (Enhanced)](https://www.w3.org/WAI/WCAG21/Understanding/target-size-enhanced) (AAA) ; [Apple — Human Interface Guidelines, Touchscreen gestures](https://developer.apple.com/design/human-interface-guidelines/gestures) (44 pt) | Établi — convergence WCAG AAA + Apple |
| S3 | Cible tactile ~48 dp et espacement ~8 dp | [Material Design — Accessibility, touch targets](https://m2.material.io/design/usability/accessibility.html#layout-and-typography) | Établi chez Material ; le système retient 44/8 (convergence WCAG/HIG) |
| S4 | Annulation au relâchement (down-event ≠ déclenchement) | [WCAG 2.2 — 2.5.2 Pointer Cancellation](https://www.w3.org/WAI/WCAG22/Understanding/pointer-cancellation.html) | Établi, standard d'accessibilité (niveau A) |
| S5 | Cible plus rapide si grande et proche (taille ↔ atteinte) | [Loi de Fitts](https://lawsofux.com/fittss-law/) (cf. `LAWS-UX`) | Référence établie en design |
| S6 | Trois crans (24 / 44 / 8) et « confort par défaut » | Décision d'identité interne, 2026-07-25 | Arbitrage interne, aligné sur les seuils sourcés |
| S7 | Toute fonctionnalité doit être opérable au clavier, quel que soit le dispositif d'entrée principal — une cible conçue pour le doigt n'est jamais dispensée du clavier | [WCAG 2.2 — 2.1.1 Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html) | Établi, standard d'accessibilité (niveau A) |
| S8 | Le nom et le rôle de tout composant d'interface doivent être programmatiquement déterminables, y compris pour les contrôles générés par script | [WCAG 2.2 — 4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html) | Établi, standard d'accessibilité (niveau A) |
| S9 | Le texte, contrôles et libellés compris, doit pouvoir être agrandi jusqu'à 200 % sans perte de contenu ni de fonctionnalité | [WCAG 2.2 — 1.4.4 Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html) | Établi, standard (AA) — la mention explicite de « controls and labels » couvre la cible, pas seulement le texte |
| S10 | Le mécanisme d'entrée principal peut être incapable de survoler ; les effets de survol doivent être une amélioration progressive, et tout contenu déclenché au survol doit l'être aussi au focus | [MDN — @media/hover](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover) ; [WCAG 2.2 — 1.4.13 Content on Hover or Focus](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html) | Établi — spécification CSS documentée par MDN, complétée par un critère WCAG (AA) |
| S11 | La vibration n'est disponible que si le matériel existe, ne fait rien sinon, et l'API est en disponibilité limitée (absente de navigateurs largement utilisés) | [MDN — Vibration API](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API) | Établi — statut de support documenté par MDN ; fonde l'interdiction du haptique comme canal unique |
| S12 | Les gestes système (retour depuis les bords, accueil et bascule en bas d'écran) entrent en conflit avec les contrôles placés dans ces zones ; la recommandation est de n'y placer aucun contrôle permanent | [Android — Gesture navigation](https://developer.android.com/develop/ui/views/touch-and-input/gestures/gesturenav) | Établi, documentation constructeur — converge avec Apple HIG (S2) : deux plateformes, même interdit |
| S13 | Mesures de la surface de contact du doigt (bout du doigt 16 à 20 mm, pouce jusqu'à 25 mm) et taille minimale empirique de 1 × 1 cm ; le problème vient des cibles trop petites, pas des doigts | [Nielsen Norman Group — Touch Targets on Touchscreens](https://www.nngroup.com/articles/touch-target-size/) | Établi — synthèse de recherche (Parhi, Karlson & Bederson). **Contredit partiellement ce fichier**, qui annonce ~9 mm là où NN/g relève 16 à 20 mm : arbitrage à prendre |
| S14 | Relevé observationnel sur 1 333 personnes : 49 % d'usage à une main, 36 % en berceau, 15 % à deux mains ; les gens touchent le centre de l'écran, pas les coins ni les bords | [Steven Hoober — How Do Users Really Hold Mobile Devices ? (UXmatters, 2013)](https://www.uxmatters.com/mt/archives/2013/02/how-do-users-really-hold-mobile-devices.php) | Recherche observationnelle établie, **mais l'auteur a lui-même désavoué ses schémas d'arc du pouce** ; seul le constat « centre » tient |

## À approfondir

- **Retour haptique** : canal voisin de `MOTION` et cité par `BUTTON-UX` au tap — son vocabulaire
  propre (intensité, patterns) attend une vraie surface native ; documenté ici seulement comme
  supplément non indispensable.
- **Densité par contexte** : une barre d'outils dense légitime `touch.target-min` + espacement ;
  reste à éprouver le seuil où la densité cesse d'être justifiable (candidat `adaptive`).
- **Frontière avec les gestes système** : la cartographie exacte des zones réservées (bord, encoche)
  dépend de l'OS — à documenter le jour d'une surface applicative réelle (voir aussi `GESTURE`).
