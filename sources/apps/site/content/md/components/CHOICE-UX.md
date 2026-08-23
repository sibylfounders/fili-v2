---
component: choice
layer: ux
type: component
version: 1.0.0 # 1.0.0 : première rédaction — besoin réel : QUATRE règles déjà écrites désignaient des composants absents (SWITCH-UX renvoie des règles « à la checkbox » ; SELECT-UX prescrit des radios sous le seuil ; CARD-R25 exige un input checkbox/radio réel pour l'état sélectionné ; CARD-R26 impose single ou multi dans une collection sélectionnable). Une SEULE paire pour la famille — Checkbox et Radio partagent frontière, anatomie, états, tokens et accessibilité, comme Button et CompactButton partagent BUTTON. Périmètre arbitré (2026-07-30) : contrôles nus d'abord ; la carte de choix (Card.Control) et l'axe de sélection de CardGroup suivent. Cf. DECISIONS.md 2026-07-30 et inventaires/manques/famille-du-choix.md.
last_updated: 2026-07-30
companion: CHOICE-UI.md
confidence: mixed # les rôles natifs, le clavier du groupe et l'état mixte sont établis (ARIA APG) ; la frontière avec le switch et la place du libellé sont des consensus convergents ; la facture est un parti pris.
---

# Choice — Couche UX (composant)

> Capturer un choix **validé à la soumission** : indépendant et cumulable (case à cocher), ou
> **exclusif** dans un ensemble borné (bouton radio). Ce que l'utilisateur coche n'agit pas tout
> de suite — c'est précisément ce qui sépare cette famille du switch.

## La ligne de partage — trois questions, trois composants

RÈGLE [CHOICE-R01] : **le choix se valide, le switch agit.** Une sélection qui n'est appliquée qu'à la
STATUT : propriété universelle
SOURCE : S4, renvoi SWITCH-R01
ÉNONCÉ : Un contrôle de choix capture une sélection appliquée à la soumission ; une bascule dont l'effet est immédiat est un switch, et l'un ne se substitue jamais à l'autre.
MESURE : aucun contrôle de choix n'applique son effet au clic sans soumission, et aucun switch n'attend un bouton d'enregistrement
soumission du formulaire est une case à cocher ou un bouton radio ; une bascule dont l'effet est
immédiat est un switch. La frontière est posée par `SWITCH-UX` et lue dans les deux sens : ce fichier
est le versant que SWITCH annonçait sans pouvoir le désigner.

RÈGLE [CHOICE-R02] : **cumulable ou exclusif** — c'est la seule question qui sépare la case du radio. Des
STATUT : propriété universelle
SOURCE : S1, S2
ÉNONCÉ : Des options cumulables appellent des cases à cocher ; des options mutuellement exclusives appellent des boutons radio, jamais l'inverse.
MESURE : aucun ensemble d'options exclusives n'est rendu en cases à cocher, et aucun ensemble cumulable n'est rendu en boutons radio
options qui peuvent coexister sont des cases (zéro, une ou plusieurs) ; des options qui s'excluent sont
des radios (zéro ou une). Le nombre d'options ne décide de rien — c'est la nature du choix qui décide.

RÈGLE [CHOICE-R03] : **une case isolée n'est pas un choix parmi un** — c'est la bascule d'une option unique
STATUT : propriété universelle
SOURCE : S2
ÉNONCÉ : Une case à cocher isolée exprime l'acceptation ou l'activation d'une option unique ; un choix qui n'offre qu'une seule réponse possible ne se rend jamais en case à cocher.
MESURE : toute case isolée exprime une option activable, jamais une alternative unique
(un consentement, une préférence). Si la question offre plusieurs réponses dont une seule est
recevable, ce sont des radios — même s'il n'y en a que deux, et même si « oui / non » tente
d'économiser une option.

RÈGLE [CHOICE-R04] : **au-delà du seuil, la question change de composant.** L'autorité sur le nombre
STATUT : note de méthode
SOURCE : renvoi SELECT-UX
ÉNONCÉ : L'arbitrage entre radios visibles et liste déroulante appartient au document du select ; ce fichier n'en fixe pas le seuil.
d'options à partir duquel une liste déroulante remplace des radios visibles appartient à `SELECT-UX`,
qui la source sur trois systèmes publics. Ici, on retient seulement la conséquence : **sous le seuil,
la bonne réponse est ce composant**, et c'est la raison pour laquelle son absence était une dette.

## Le groupe — là où vit l'exclusivité

RÈGLE [CHOICE-R05] : **l'exclusivité appartient au GROUPE, pas au bouton.** Un radio isolé n'a pas de sens :
STATUT : propriété universelle
SOURCE : S1
ÉNONCÉ : L'exclusivité est une propriété de l'ensemble : un bouton radio n'existe que dans un groupe qui porte le nom de la question et l'unicité de la réponse.
MESURE : tout bouton radio appartient à un groupe nommé, et aucun groupe n'autorise deux réponses simultanées
c'est l'ensemble qui porte la question, le nom commun et l'unicité de la réponse. Un radio hors groupe
est un défaut de conception, pas une variante.

RÈGLE [CHOICE-R06] : **le groupe a un nom accessible, toujours** — la question elle-même. Qu'elle soit
STATUT : propriété universelle
SOURCE : S1
ÉNONCÉ : Un groupe de choix expose la question comme nom accessible, par un libellé visible référencé ou une étiquette explicite.
MESURE : tout groupe de choix porte un nom accessible non vide, référençant le libellé visible quand il existe
rendue par un titre de section, une légende ou un texte, elle doit être **rattachée techniquement** au
groupe : la proximité visuelle ne suffit pas — un lecteur d'écran qui entre dans le groupe doit entendre
la question avant les options.

RÈGLE [CHOICE-R07] : **les cases sont indépendantes ; leur groupe est facultatif mais l'étiquetage ne l'est pas.**
STATUT : propriété universelle
SOURCE : S2
ÉNONCÉ : Quand des cases à cocher répondent ensemble à une même question, elles sont réunies dans un groupe nommé par cette question ; isolées, elles n'en ont pas besoin.
MESURE : tout ensemble de cases répondant à une question commune est réuni dans un groupe portant cette question
Dès que plusieurs cases répondent à une même question, elles forment un groupe nommé par elle. Une case
isolée (un consentement) n'a pas de groupe : son libellé porte tout.

## Le libellé

RÈGLE [CHOICE-R08] : **le libellé est embarqué, à côté du contrôle, et il est cliquable.** À la différence
STATUT : parti pris d'identité
SOURCE : interne, renvoi INPUT-R38
ÉNONCÉ : Le libellé d'un contrôle de choix est rendu par le composant lui-même, à côté du contrôle, et l'ensemble libellé + contrôle forme une seule cible.
MESURE : le libellé d'un contrôle de choix est lié à son contrôle et l'activer bascule l'état
du champ de saisie, dont le libellé se pose **au-dessus** (bloc champ, `Input.Field`), celui d'un
contrôle de choix se pose **en ligne**, à sa droite — et le composant le rend lui-même, comme le fait
déjà `Switch`. Deux anatomies, deux mécaniques : c'est une décision, pas un accident.

RÈGLE [CHOICE-R09] : **le libellé dit l'option, pas l'action, et se comprend hors contexte.** « Recevoir
STATUT : propriété universelle
SOURCE : S2
ÉNONCÉ : Le libellé d'une option nomme l'option et reprend la part utile de la question, de façon à rester compréhensible lu isolément.
MESURE : chaque libellé d'option reste compréhensible lu seul, hors de sa question
le résumé hebdomadaire », pas « Cliquer ici ». Et il reprend la part utile de la question quand la
réponse serait ambiguë isolée : un lecteur d'écran qui parcourt les options les entend souvent sans
la question — « Non, je ne me déplacerai dans aucun de ces pays » vaut mieux que « Non ».

RÈGLE [CHOICE-R10] : **l'aide d'une option est une phrase courte, sans point final.** Elle est lue à chaque
STATUT : propriété universelle
SOURCE : S2
ÉNONCÉ : L'aide attachée à une option tient en une phrase courte et ne contient pas de lien.
MESURE : toute aide d'option tient en une phrase et ne contient aucun lien
item par les lecteurs d'écran : une aide bavarde se paie autant de fois qu'il y a d'options. Elle ne
contient pas de lien — la nature du lien n'est pas annoncée de façon fiable dans ce contexte.

## Les états

RÈGLE [CHOICE-R11] : **l'indéterminé n'est pas un troisième choix.** Il décrit un parent dont les enfants
STATUT : propriété universelle
SOURCE : S3
ÉNONCÉ : L'état indéterminé exprime qu'un ensemble d'options est partiellement coché ; il n'est jamais une valeur choisie par l'utilisateur ni une valeur soumise.
MESURE : aucun contrôle indéterminé n'est atteignable par une action de l'utilisateur ni transmis comme valeur
sont **partiellement** cochés — jamais un état que l'utilisateur choisit, jamais une valeur envoyée au
serveur. Il se calcule, il ne se sélectionne pas. Un cycle à trois états au clic est un autre besoin,
hors périmètre.

RÈGLE [CHOICE-R12] : **l'état ne passe jamais par la seule couleur.** La coche, le point et leur présence
STATUT : propriété universelle
SOURCE : renvoi ACCESSIBILITY (WCAG 1.4.1)
ÉNONCÉ : L'état coché est porté par une marque perceptible indépendamment de la couleur.
MESURE : l'état coché reste distinguable de l'état décoché en niveaux de gris
portent l'information ; la couleur la renforce. La règle est celle du système, rappelée ici parce que
c'est le composant où la tentation est la plus forte.

RÈGLE [CHOICE-R13] : **une option pré-cochée est une décision, jamais un confort.** Elle oriente la réponse
STATUT : propriété universelle
SOURCE : renvoi CONSENTEMENT-UX
ÉNONCÉ : Une option pré-cochée doit être justifiée par le produit, et un consentement n'est jamais pré-coché.
MESURE : aucune option de consentement n'est pré-cochée
et doit pouvoir se défendre. Pour un **consentement**, la question ne se pose pas : jamais pré-coché —
l'autorité est `CONSENTEMENT-UX`, ce fichier ne fait que refuser de fournir le moyen de l'enfreindre.

## Le clavier

RÈGLE [CHOICE-R14] : **un groupe de radios est UN seul arrêt de tabulation, et la sélection suit le focus.**
STATUT : propriété universelle
SOURCE : S1
ÉNONCÉ : La tabulation entre ou sort d'un groupe de radios sans le parcourir ; à l'intérieur, les flèches déplacent le focus et cochent l'option atteinte.
MESURE : un groupe de radios n'expose qu'un seul arrêt de tabulation, et les quatre flèches y déplacent le focus en cochant
La tabulation entre dans le groupe (sur l'option cochée, ou sur la première si aucune ne l'est) et en
sort ; à l'intérieur, ce sont les **flèches** qui circulent — et elles cochent l'option atteinte.
Espace coche l'option focalisée si elle ne l'est pas déjà. Un groupe où chaque radio est tabulable est
un groupe cassé.

RÈGLE [CHOICE-R15] : **chaque case à cocher est un arrêt de tabulation, et Espace la bascule.** Les cases
STATUT : propriété universelle
SOURCE : S3
ÉNONCÉ : Chaque case à cocher est atteinte par la tabulation et bascule à la barre d'espace.
MESURE : chaque case à cocher est atteignable au clavier et bascule à la barre d'espace
étant indépendantes, il n'y a rien à faire circuler : elles se parcourent une à une. C'est la
différence de comportement clavier qui rend l'erreur de composant sensible, pas seulement visible.

RÈGLE [CHOICE-R16] : **la cible inclut le libellé.** Le plancher tactile s'applique à l'ensemble
STATUT : propriété universelle
SOURCE : renvoi TOUCH
ÉNONCÉ : La cible effective d'un contrôle de choix comprend son libellé et respecte le plancher de taille de cible du système.
MESURE : la cible effective contrôle + libellé atteint le plancher tactile du système
contrôle + libellé, pas au seul carré de la case. Un contrôle de 16 px n'est pas une cible de 16 px.

## L'erreur

RÈGLE [CHOICE-R17] : **l'erreur d'un groupe se rattache au groupe, pas à sa première option.** Elle est
STATUT : propriété universelle
SOURCE : S2
ÉNONCÉ : Le message d'erreur d'un ensemble de choix est rattaché au groupe et reprend la question posée.
MESURE : le message d'erreur d'un groupe de choix est associé au groupe et non à une option isolée
annoncée avec la question, pas au milieu des options, et son texte **reprend la question** — « Sélectionnez
les pays où vous vous rendrez » plutôt que « Champ obligatoire ». Le timing de validation, le résumé
d'erreurs et la convention requis/optionnel restent à `FORM-UX` : le contrôle ne décide pas quand il a tort.

RÈGLE [CHOICE-R18] : **l'option exclusive se place en dernier, séparée, et décoche les autres.** « Aucune de
STATUT : propriété universelle
SOURCE : S2
ÉNONCÉ : Une option exclusive au sein d'un ensemble cumulable est placée en dernier, visuellement séparée, et sa sélection décoche les autres options.
MESURE : toute option exclusive d'un ensemble cumulable est en dernière position et décoche les autres à sa sélection
ces réponses » n'est pas une option comme les autres : elle contredit toutes les autres. Elle vient en
fin de liste, détachée du reste, et la sélectionner vide le reste. Sans ce comportement, l'ensemble
accepte un état contradictoire qu'il faudra rejeter ensuite — une erreur qu'on aurait pu ne pas créer.

## Les frontières

RÈGLE [CHOICE-R19] : **la carte de choix reste une carte.** Quand une option est présentée comme une surface
STATUT : note de méthode
SOURCE : renvoi CARD-R25, CARD-R26
ÉNONCÉ : Une option présentée sous forme de carte héberge un contrôle de choix sans le réimplémenter, et l'exclusivité de l'ensemble reste déclarée par la collection.
la carte héberge le contrôle — elle ne le redessine pas. `CARD-R25` exige déjà que l'état sélectionné
soit exposé programmatiquement (« case, bouton radio ou attribut d'état ARIA »), et `CARD-R26` que la
collection déclare si elle est exclusive ou cumulable. Ce fichier fournit enfin les deux premiers
termes de cette alternative.

## Sources et niveau de confiance

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| S1 | Groupe de radios : `role="radiogroup"` + `role="radio"`, `aria-checked` ; la tabulation entre et sort du groupe (focus sur l'option cochée, sinon la première) ; les flèches déplacent le focus, décochent l'option précédente et cochent la nouvelle — la sélection suit le focus ; Espace coche l'option focalisée ; le groupe porte un libellé visible référencé par `aria-labelledby` ou une `aria-label` | [W3C WAI — ARIA APG, Radio Group Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/) | Établi — pratique de référence du W3C |
| S2 | Les cases servent à sélectionner plusieurs options ou à basculer une option unique, et ne s'emploient pas quand une seule sélection est permise (ce sont alors des radios) ; les cases répondant à une même question sont réunies dans un `fieldset` avec une `legend` ; l'aide tient en une phrase courte sans point final et sans lien, car elle est lue à chaque item ; l'option « aucune » se place en dernier, séparée par un « ou », et décoche les autres ; le message d'erreur reprend la question | [GOV.UK Design System — Checkboxes](https://design-system.service.gov.uk/components/checkboxes/) | Établi par convergence — système public vérifié |
| S3 | Case à cocher : `role="checkbox"`, Espace bascule l'état ; trois états — `aria-checked="true"` quand toutes les options du groupe sont cochées, `"false"` quand aucune ne l'est, `"mixed"` quand certaines le sont : l'état mixte reflète l'état combiné des enfants | [W3C WAI — ARIA APG, Checkbox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/) | Établi — pratique de référence du W3C |
| S4 | Switch = effet immédiat ; case à cocher = sélection validée à la soumission | [NN/g — Toggle-Switch Guidelines](https://www.nngroup.com/articles/toggle-switch-guidelines/) (via `SWITCH-UX`, sources S2/S4/S5) | Convergent — trois systèmes indépendants dans la fiche d'origine |
| S5 | Sous un seuil d'environ cinq options, des radios visibles valent mieux qu'une liste déroulante ; une sélection multiple appelle des cases à cocher | `SELECT-UX.md` (sources USWDS, Scottish Government, NN/g) | Établi par convergence — reporté depuis la fiche propriétaire |
