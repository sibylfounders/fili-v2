---
component: interaction
layer: ux
type: language
version: 1.3.0 # 1.3.0 : `CRITERE` posés sur R08, R10, R23 — la couche UX entre dans le moteur (loi 4.20, 2026-07-31). 1.2.0 : 1.2.0 : le mode d'interaction (static/clickable/selectable/expandable) devient un axe transversal des surfaces-conteneurs (R26-R28) — promu depuis Card, qui n'en est plus que le premier consommateur. 1.1.0 : Interaction devient un langage de premier niveau, distinct des fondations qu'il compose. 1.0.0 : première rédaction — langage d'interaction fondé sur l'affordance honnête : reconnaître le rôle avant de lire, sans imposer une esthétique décorative
last_updated: 2026-07-29
companion: INTERACTION-UI.md
confidence: mixed # les obligations d'accessibilité et de cohérence sont établies ; la matérialité tactile sobre est une décision d'identité interne
---

# Langage d'interaction — Couche UX

> Ce langage définit comment un élément communique son **rôle** avant même que son libellé soit
> lu. Elle ne prescrit ni skeuomorphisme, ni ombre généralisée : elle impose une affordance honnête,
> cohérente et accessible. La traduction visuelle vit dans `INTERACTION-UI.md`.

## Premier principe

RÈGLE [INTERACTION-R01] : **une interface doit pouvoir être comprise avant d'être lue.** La forme, la structure, la
STATUT : parti pris d'identité
SOURCE : S4
ÉNONCÉ : Une interface se comprend avant d'être lue : la forme, la structure, la position et les états annoncent le rôle d'un élément, et le libellé ne fait que préciser ensuite l'intention.
position et les états indiquent d'abord le rôle ; le mot précise ensuite l'intention.

RÈGLE [INTERACTION-R02] : ce principe ne remplace jamais le texte accessible. « Reconnaître avant de lire » réduit
STATUT : propriété universelle
SOURCE : S3, S8
ÉNONCÉ : Le fait de reconnaître un rôle avant de lire ne dispense jamais du texte accessible : aucun pictogramme ambigu ni aucun contrôle dépourvu de nom n'est admis.
MESURE : tout contrôle non textuel porte un nom accessible qui décrit sa fonction
l'effort de compréhension ; il n'autorise ni pictogramme ambigu, ni contrôle sans nom.

> **Pourquoi** : une personne parcourt une interface en reconnaissant des régularités avant de lire
> chaque libellé. Quand une action, une navigation et une zone de saisie se ressemblent, elle doit
> interpréter chaque élément au lieu de s'appuyer sur le système.

## Les six intentions

RÈGLE [INTERACTION-R03] : le rôle précède le style. Le composant se choisit d'après ce qui se produit :
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Le système reconnaît six intentions — agir, naviguer, saisir, choisir, consulter, comprendre un état — et le composant se choisit d'après l'intention et le résultat produit, jamais d'après le style souhaité.

| Intention | Promesse faite à l'utilisateur | Expression canonique |
|---|---|---|
| **Agir** | déclencher un effet dans le contexte actuel | Button |
| **Naviguer** | aller vers une autre ressource ou position | Link |
| **Saisir** | fournir ou modifier une information | Input et contrôles de formulaire |
| **Choisir** | sélectionner une option ou un état | Checkbox, radio, switch, select |
| **Consulter** | lire une information organisée | Texte, Card statique, Panel |
| **Comprendre un état** | recevoir un statut ou un retour | Alert, badge, message explicite |

RÈGLE [INTERACTION-R04] : deux éléments qui se ressemblent et réagissent de la même façon doivent promettre le même
STATUT : propriété universelle
SOURCE : S1, S7
ÉNONCÉ : Deux éléments qui se ressemblent et réagissent de la même façon promettent le même type de résultat, et deux rôles différents ne sont jamais rendus indiscernables.
type de résultat. Inversement, deux rôles différents ne sont pas rendus indiscernables.

RÈGLE [INTERACTION-R05] : la sémantique native suit l'intention — un bouton reste un bouton, un lien reste un lien, un
STATUT : propriété universelle
SOURCE : S7, S3
ÉNONCÉ : La sémantique native suit l'intention : une action est portée par un bouton, une navigation par un lien avec destination, une saisie par un champ, et le style ne transforme jamais l'un en l'autre.
MESURE : toute action est portée par un contrôle exposant le rôle bouton et activable par Entrée et Espace ; toute navigation est portée par un lien avec destination
champ reste un champ. Le style ne transforme jamais artificiellement l'un en l'autre.

## Les lois d'affordance

### 1. Une action a une présence

RÈGLE [INTERACTION-R06] : un contrôle manipulable possède une limite et des états perceptibles. Cette présence peut
STATUT : propriété universelle
SOURCE : S6
ÉNONCÉ : Un contrôle manipulable possède une limite et des états perceptibles ; cette présence peut venir d'un fond, d'une bordure, d'une forme, d'une position ou d'une réaction, et n'exige pas une ombre.
MESURE : l'information visuelle qui identifie le contrôle et ses états atteint un contraste de 3:1 avec les couleurs adjacentes
venir d'un fond, d'une bordure, d'une forme, d'une position ou d'une réaction — pas nécessairement
d'une ombre.

RÈGLE [INTERACTION-R07] : une action de faible poids peut être visuellement discrète, mais elle ne devient jamais un
STATUT : propriété universelle
SOURCE : S7, S1
ÉNONCÉ : Une action de faible poids peut être visuellement discrète mais ne prend jamais l'apparence d'un lien : la hiérarchie module la présence, elle n'efface pas le rôle.
MESURE : aucun élément portant une action n'adopte la présentation visuelle réservée à la navigation
faux lien. La hiérarchie module la présence ; elle n'efface pas le rôle.

### 2. Une zone de saisie paraît réceptive

RÈGLE [INTERACTION-R08] : un champ délimite clairement l'endroit où la valeur sera reçue. Son label, sa bordure, son
STATUT : propriété universelle
SOURCE : S9, S6
ÉNONCÉ : Une zone de saisie délimite clairement l'endroit où la valeur sera reçue : son label, sa limite, son contenu et son focus la distinguent d'un bouton comme d'une simple surface.
MESURE : tout champ porte un label visible et une délimitation dont le contraste atteint 3:1 avec les couleurs adjacentes
CRITERE : chaque("input:not([type=hidden]):not([type=button]):not([type=submit]),select,textarea") etiquete_visible()

> **Portée du critère** : il n'automatise que la clause **label visible**. La délimitation à 3:1
> relève de `BORDER-R03`, dont le corpus dit lui-même (`BORDER-U09`) qu'elle n'est pas décidable
> par un script — savoir si un champ n'est identifiable *que* par sa bordure est un jugement.
contenu et son focus le distinguent d'un bouton et d'une simple surface.

RÈGLE [INTERACTION-R09] : « réceptif » décrit une fonction, pas un effet imposé. Une ombre interne peut soutenir cette
STATUT : parti pris d'identité
SOURCE : S5
ÉNONCÉ : Le caractère réceptif d'une zone de saisie décrit une fonction et non un effet imposé : une ombre interne peut soutenir cette lecture dans un thème, mais elle n'est ni universelle ni suffisante.
lecture dans un thème, mais elle n'est ni universelle ni suffisante.

### 3. Une surface organise sans promettre un clic

RÈGLE [INTERACTION-R10] : une Card statique reste calme. Une Card cliquable reçoit une cible réelle et des signaux
STATUT : propriété universelle
SOURCE : S7, S10
ÉNONCÉ : Une surface qui organise du contenu ne promet pas de clic : une surface cliquable reçoit une cible réelle et des signaux d'interaction supplémentaires, une surface statique ne copie jamais l'apparence d'un contrôle.
MESURE : toute surface cliquable expose un élément interactif natif atteignable au clavier ; aucune surface statique ne porte de gestionnaire de clic
CRITERE : compte("div[onclick],span[onclick],li[onclick],p[onclick],td[onclick]") == 0
d'interaction supplémentaires. Une surface statique ne copie jamais l'apparence d'un contrôle.

### 4. La profondeur explique une couche

RÈGLE [INTERACTION-R11] : l'ombre indique une relation spatiale ou un changement d'état ; elle ne décore pas. La
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : L'ombre indique une relation spatiale ou un changement d'état et ne décore jamais ; les niveaux d'élévation et leurs usages restent la propriété de la fondation elevation.
fondation `ELEVATION-UX.md` reste propriétaire de ses niveaux et de leurs usages.

### 5. La couleur renforce, elle ne crée pas seule le sens

RÈGLE [INTERACTION-R12] : action, navigation, erreur, sélection et focus restent compréhensibles sans perception de la
STATUT : propriété universelle
SOURCE : S2
ÉNONCÉ : L'action, la navigation, l'erreur, la sélection et le focus restent compréhensibles sans perception de la couleur : le mot, la forme, la bordure, l'icône ou la position fournissent au moins un second canal.
MESURE : en niveaux de gris, chaque rôle et chaque état reste identifiable par au moins un canal non chromatique
couleur. Le mot, la forme, la bordure, l'icône ou la position fournissent au moins un second canal.

### 6. Les états confirment la manipulation

RÈGLE [INTERACTION-R13] : repos, hover, focus, active, loading et disabled sont distincts quand ils existent. Le
STATUT : propriété universelle
SOURCE : S6, S12
ÉNONCÉ : Les états de repos, de survol, de focus, d'activation, de chargement et d'indisponibilité sont distincts lorsqu'ils existent ; le changement d'état confirme ce qui arrive et ne révèle jamais tardivement qu'un élément était interactif.
MESURE : aucune cible interactive n'est identifiable ou révélée par le seul survol
changement confirme ce qui arrive ; il ne révèle pas tardivement que l'élément était interactif.

RÈGLE [INTERACTION-R14] : le focus clavier est un état à part entière, jamais une imitation du hover. L'active peut
STATUT : propriété universelle
SOURCE : S11, S13
ÉNONCÉ : Le focus clavier est un état à part entière et jamais une imitation du survol ; l'état d'activation peut donner une sensation de pression, mais celle-ci reste subordonnée à la visibilité du focus, au contraste et à la préférence de mouvement réduit.
MESURE : un style de focus distinct du style de survol est défini pour chaque composant interactif, et aucun composant ne supprime l'indicateur de focus sans le remplacer
donner une sensation de pression, mais cette identité tactile reste subordonnée au focus visible, au
contraste et à `prefers-reduced-motion`.

## Une matérialité fonctionnelle, pas décorative

RÈGLE [INTERACTION-R15] : la matérialité est **proportionnelle au besoin de compréhension**, pas à l'importance
STATUT : parti pris d'identité
SOURCE : S5
ÉNONCÉ : La matérialité d'un élément est proportionnelle au besoin de compréhension et jamais à son importance commerciale : elle sert d'abord à distinguer un contrôle, un réceptacle, une surface et une superposition.
commerciale. Elle sert particulièrement à distinguer contrôle, réceptacle, surface et superposition.

RÈGLE [INTERACTION-R16] : un effet visuel est conservé seulement s'il répond à une question vérifiable :
STATUT : parti pris d'identité
SOURCE : S5
ÉNONCÉ : Un effet visuel n'est conservé que s'il répond à une question vérifiable sur l'élément : est-il manipulable, reçoit-il une information, organise-t-il du contenu, appartient-il à une couche temporaire, son état vient-il de changer.

- cet élément est-il manipulable ?
- reçoit-il une information ?
- organise-t-il du contenu ?
- appartient-il à une couche temporaire ?
- son état vient-il de changer ?

RÈGLE [INTERACTION-R17] : si l'effet ne répond à aucune de ces questions, il est décoratif et ne fait pas partie du
STATUT : parti pris d'identité
SOURCE : S5
ÉNONCÉ : Un effet qui ne répond à aucune de ces questions est décoratif et ne fait pas partie du langage d'interaction.
langage d'interaction.

RÈGLE [INTERACTION-R18] : le système évite le neumorphisme et le glassmorphism comme langage par défaut : ils rendent la
STATUT : parti pris d'identité
SOURCE : S5, S6
ÉNONCÉ : Le neumorphisme et le glassmorphism ne sont pas des langages par défaut du système, parce qu'ils font dépendre la compréhension d'effets fragiles, coûteux et insuffisamment contrastés ; un usage ponctuel hors composant reste possible si l'accessibilité et la performance sont démontrées.
compréhension dépendante d'effets fragiles, coûteux ou insuffisamment contrastés. Un usage ponctuel
reste possible hors composant si l'accessibilité et la performance sont démontrées.

## Le mode d'interaction des surfaces

> Né dans Card (axe `interaction_mode` de CARD-UX), promu ici le 2026-07-29 : static,
> clickable, selectable et expandable décrivent ce que promet TOUTE surface qui organise du
> contenu — carte, ligne de liste, tuile, carte de statistique — pas une propriété de Card.

RÈGLE [INTERACTION-R26] : le mode d'interaction est un axe transversal des surfaces-conteneurs.
STATUT : parti pris d'identité
SOURCE : interne, S7
ÉNONCÉ : Le mode d'interaction — static, clickable, selectable, expandable — est un axe transversal du langage : toute surface qui organise du contenu déclare ce qu'elle promet à travers ce mode, et le mode décrit un comportement, jamais un style.

RÈGLE [INTERACTION-R27] : le mode appartient aux surfaces-conteneurs, jamais aux contrôles.
STATUT : parti pris d'identité
SOURCE : S5, S7
ÉNONCÉ : Le mode d'interaction s'applique aux surfaces qui organisent du contenu et jamais aux contrôles, dont l'intention est intrinsèque ; généraliser le mode cliquable diluerait le signal du relief, qui ne reste lisible que parce qu'il est rare.
MESURE : aucun contrôle (bouton, lien, champ, sélecteur) ne porte l'axe mode ; le relief de survol n'existe que sur une surface déclarée clickable

RÈGLE [INTERACTION-R28] : un même mode porte les mêmes signaux sur toutes les surfaces.
STATUT : propriété universelle
SOURCE : S1, S7, S10
ÉNONCÉ : Deux surfaces de même mode se reconnaissent aux mêmes signaux dans tout le produit : clickable expose une cible réelle atteignable au clavier et ne gagne son relief qu'au survol ou au focus, selectable expose son état de sélection par un canal non chromatique en plus de la couleur, expandable porte son état d'ouverture par l'orientation d'un indicateur, et static ne réagit pas.
MESURE : toute surface clickable expose un élément interactif natif ; toute surface selectable expose son état programmatiquement et par un signal non chromatique

## Cohérence et variation

RÈGLE [INTERACTION-R19] : un même rôle conserve ses signaux essentiels dans tous les contextes. Une action principale
STATUT : propriété universelle
SOURCE : S1
ÉNONCÉ : Un même rôle conserve ses signaux essentiels dans tous les contextes : une action principale peut changer de taille ou de disposition, elle reste identifiable comme action.
peut changer de taille ou de disposition ; elle reste identifiable comme action.

RÈGLE [INTERACTION-R20] : l'adaptation à l'espace ne change jamais la nature du résultat. `ADAPTIVE-UX.md` peut
STATUT : propriété universelle
SOURCE : S1
ÉNONCÉ : L'adaptation à l'espace disponible ne change jamais la nature du résultat : elle peut réorganiser, condenser ou révéler progressivement, mais elle ne transforme pas une navigation en action.
réorganiser, condenser ou révéler progressivement ; il ne transforme pas une navigation en action.

RÈGLE [INTERACTION-R21] : la cohérence ne signifie pas uniformité. Button, Link, Input et Card ont justement des
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : La cohérence n'est pas l'uniformité : les rôles qui font des promesses différentes reçoivent des expressions différentes.
expressions différentes parce qu'ils font des promesses différentes.

## Accessibilité et robustesse

RÈGLE [INTERACTION-R22] : le langage reste opérant au clavier, au toucher, au zoom, en contraste forcé, sans hover et
STATUT : propriété universelle
SOURCE : S10, S15, S14, S12, S13
ÉNONCÉ : Le langage d'interaction reste opérant au clavier, au toucher, au zoom, en couleurs forcées, sans survol et en mouvement réduit : aucun canal fragile — ombre, vibration, couleur, animation — n'est indispensable à la compréhension ou à l'usage.
MESURE : toute fonction reste disponible et identifiable au clavier, à 400 % de zoom, sous forced-colors: active, sous (hover: none) et sous prefers-reduced-motion: reduce
avec mouvement réduit. Aucun canal fragile — ombre, vibration, couleur, animation — n'est indispensable.

RÈGLE [INTERACTION-R23] : une icône seule conserve un nom accessible ; un changement d'état conserve un libellé ou un
STATUT : propriété universelle
SOURCE : S3, S8
ÉNONCÉ : Une icône seule conserve un nom accessible, un changement d'état conserve un libellé ou un état exposé programmatiquement, et une cible conserve la sémantique native attendue de son rôle.
MESURE : tout contrôle sans texte visible porte un nom accessible et tout état est exposé programmatiquement
CRITERE : chaque("button,a[href],[role=button],input[type=button],input[type=submit]") nomme()

> **Portée du critère** : il vérifie qu'un nom accessible **existe**, pas qu'il *décrit la
> fonction*. « Bouton », « cliquez ici », « en savoir plus » passent. La pertinence du nom
> reste un constat assisté.
état programmatique ; une cible conserve la sémantique native attendue.

RÈGLE [INTERACTION-R24] : l'apparence cohérente accompagne une identification cohérente : un composant ayant la même
STATUT : propriété universelle
SOURCE : S1
ÉNONCÉ : Un composant qui remplit la même fonction est nommé et représenté de façon constante dans tout le produit : l'apparence cohérente accompagne une identification cohérente.
MESURE : un composant de même fonction porte le même nom accessible et la même représentation dans tout le produit
fonction est nommé et représenté de façon constante dans le produit.

## Test de reconnaissance

RÈGLE [INTERACTION-R25] : toute nouvelle famille de composants passe ces quatre questions :
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Toute nouvelle famille de composants est soumise aux quatre questions du test de reconnaissance — distinction des rôles en niveaux de gris, reconnaissance sans survol, visibilité du focus et de l'état au clavier, équivalence de résultat entre éléments visuellement équivalents — et un « non » appelle d'abord un meilleur composant, une meilleure sémantique ou une meilleure structure, jamais plus d'effets.

1. En niveaux de gris, distingue-t-on action, navigation, saisie et information ?
2. Sans hover, les cibles et leurs rôles restent-ils reconnaissables ?
3. Au clavier, le focus et l'état sont-ils visibles sans ambiguïté ?
4. Deux éléments visuellement équivalents produisent-ils un résultat de même nature ?

Un « non » n'appelle pas automatiquement plus d'effets : il appelle d'abord un meilleur composant,
une meilleure sémantique ou une meilleure structure.

## Risque

| Cas | Risque principal | Sévérité |
|---|---|---|
| Button rendu comme du texte | Action confondue avec navigation ou information | Élevée |
| Link rendu comme un Button sans nécessité | Navigation annoncée comme action | Élevée |
| Card statique traitée comme cliquable | Affordance mensongère | Élevée |
| Couleur comme seul signal | Sens perdu pour une partie des utilisateurs | Élevée |
| Hover comme révélation de la cible | Fonction invisible au tactile et au clavier | Élevée |
| Ombres et reflets généralisés | Bruit visuel, signal dilué, coût de rendu | Moyenne |
| Pression physique trop animée | Retard, inconfort ou distraction | Moyenne |

## Sources et niveau de confiance

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| S1 | Le rôle et les résultats attendus doivent être cohérents pour des composants identifiés de la même manière | [WCAG 2.2 — 3.2.4 Consistent Identification](https://www.w3.org/WAI/WCAG22/Understanding/consistent-identification) | Établi |
| S2 | La couleur ne doit pas être le seul moyen de transmettre une information | [WCAG 2.2 — 1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color) | Établi |
| S3 | Les contrôles ont un nom, un rôle et une valeur déterminables | [WCAG 2.2 — 4.1.2 Name, Role, Value](https://www.w3.org/TR/WCAG22/#name-role-value) | Établi |
| S4 | Les affordances et signifiants réduisent l'interprétation nécessaire | Don Norman, *The Design of Everyday Things* | Référence établie en design ; traduction visuelle interne |
| S5 | Matérialité fonctionnelle sobre et tactile | Décision d'identité interne, 2026-07-20 | À éprouver par tests utilisateurs |
| S6 | L'information visuelle nécessaire pour identifier un composant d'interface et ses états doit atteindre un contraste de 3:1 avec les couleurs adjacentes ; lorsqu'aucun autre moyen visuel n'identifie la présence du contrôle, sa limite doit elle-même satisfaire ce seuil | [WCAG 2.2 — 1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) | Établi, standard d'accessibilité (niveau AA) — **fonde R06, R08, R13 et U05, qui n'énonçaient « présence perceptible » sans aucun seuil** |
| S7 | Les actions d'un bouton sont distinctes de la fonction d'un lien ; quand un élément ressemble à un lien mais agit comme un bouton, la bonne réponse est d'ajuster le dessin pour qu'il corresponde à la fonction et au rôle, et un rôle déclaré est une promesse d'implémenter les interactions clavier attendues (Entrée et Espace activent le bouton) | [WAI-ARIA Authoring Practices — Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/) ; [APG — Read Me First](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/) | Établi, pratique de référence du W3C — **source normative directe de R04, R05, R07 et R10, jusqu'ici données comme des convictions internes** |
| S8 | Tout contenu non textuel qui est un contrôle ou accepte une saisie porte un nom décrivant sa fonction, et tout contenu non textuel dispose d'une alternative textuelle de valeur équivalente | [WCAG 2.2 — 1.1.1 Non-text Content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html) | Établi, standard d'accessibilité (niveau A) — fonde l'interdiction du pictogramme sans nom (R02, R23) |
| S9 | Des labels ou des instructions sont fournis dès que le contenu attend une saisie de l'utilisateur | [WCAG 2.2 — 3.3.2 Labels or Instructions](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html) | Établi, standard d'accessibilité (niveau A) — fonde l'exigence de label visible de R08 |
| S10 | Toute fonctionnalité du contenu est opérable par une interface clavier, sans exiger de synchronisation particulière des frappes | [WCAG 2.2 — 2.1.1 Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html) | Établi, standard d'accessibilité (niveau A) — fonde R10 (cible réelle) et R22 |
| S11 | Toute interface opérable au clavier dispose d'un mode où l'indicateur de focus clavier est visible ; le focus est un état propre, distinct du survol, de la sélection et de la coche, et l'indicateur ne se supprime pas sans remplacement | [WCAG 2.2 — 2.4.7 Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html) ; [MDN — :focus-visible](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible) | Établi — critère de niveau AA complété par la spécification CSS documentée par MDN ; fonde R14 et U04 |
| S12 | Le mécanisme d'entrée principal peut être incapable de survoler, auquel cas les effets de survol ne sont qu'une amélioration progressive ; tout contenu additionnel déclenché au survol ou au focus doit être révocable, survolable et persistant | [MDN — @media/hover](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover) ; [WCAG 2.2 — 1.4.13 Content on Hover or Focus](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html) | Établi — comportement plateforme documenté par MDN, complété par un critère WCAG (AA) ; fonde R13, R22 et U07 |
| S13 | La préférence de mouvement réduit exprime la demande d'une interface dont les animations sont supprimées, réduites ou remplacées, notamment pour les personnes souffrant de troubles vestibulaires | [MDN — prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) | Établi, préférence utilisateur normalisée — fonde la subordination de la sensation de pression dans R14 et le comportement de U02 |
| S14 | En mode de couleurs forcées, le navigateur impose ses propres valeurs aux couleurs de texte, de fond, de bordure et d'outline, et force les ombres portées, les ombres de texte et les images de fond non-url à néant : la bordure et l'anneau de focus survivent, l'ombre et le dégradé disparaissent | [MDN — @media (forced-colors)](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors) | Établi, comportement plateforme normalisé — **fonde U06 et l'interdiction de faire porter l'identification par une ombre (R06, R11, R18)** |
| S15 | Le contenu doit être présentable sans perte d'information ni de fonctionnalité et sans défilement bidimensionnel jusqu'à une largeur équivalente à 320 px CSS, ce qui correspond à un agrandissement de 400 % | [WCAG 2.2 — 1.4.10 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) | Établi, standard d'accessibilité (niveau AA) — donne au « au zoom » de R22 un seuil vérifiable |

## À approfondir

- Tester la reconnaissance Button / Link / Input / Card en maquette désaturée et sans hover.
- Éprouver la sensation tactile sur pointer fin, tactile et clavier sans créer de latence perceptible.
- Étendre le contrat aux futurs sélecteurs (checkbox, radio, switch, segmented control).
- Migrer les autres surfaces-conteneurs existantes (StatCard de la bibliothèque de charts, groupes de cartes) vers l'axe mode partagé (R26).
