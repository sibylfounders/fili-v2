---
sujet: accessibility
nature: principles
resume: "Ce fichier pose les **obligations universelles** d'accessibilité que tout composant, pattern, fondation et langage doit respecter — le contrat minimal, pas le détail."
selon-contexte: []
source: ACCESSIBILITY-UX.md v1.1.1
empreinte: sha256:992fdf4da2ee5f1f
regles: {loi: 8, preference: 2, non_qualifie: 0}
---
# RULES — accessibility (compilé, mode build)

> Extrait mécaniquement de la doctrine par `tools/compile-regles.py`. Ne pas éditer à la main.
>
> **Étiquettes.** `[loi]` — vrai de tout produit : appliquer, et signaler comme non-conformité.
> `[préférence]` — notre choix, pas une norme : proposer en le disant, jamais imposer dans un
> produit qui n'est pas le nôtre. `[non qualifié]` — statut pas encore tranché : **traiter comme
> une préférence** et remonter la question.
> Ce que ne couvre aucune règle ci-dessous : ne pas trancher, poser la question.

## Règles de design

- **[loi]** Toute fonction doit être utilisable au clavier seul, atteignable et activable sans souris ni écran tactile. `ACCESSIBILITY-R04`
- **[loi]** Aucune fonction ne doit dépendre uniquement du survol, d'un geste complexe, du glisser-déposer ou de la parole. `ACCESSIBILITY-R06`
- **[loi]** Le focus clavier doit toujours être visible, suivre un ordre cohérent, ne jamais être piégé ni masqué par un élément superposé. `ACCESSIBILITY-R07`
- **[loi]** Chaque contrôle doit exposer nom, rôle et valeur à l'arbre d'accessibilité, et son nom accessible doit contenir le libellé affiché. `ACCESSIBILITY-R08`
- **[loi]** Aucune information ni instruction ne doit reposer uniquement sur une caractéristique sensorielle ou sur la couleur. `ACCESSIBILITY-R09`
- **[loi]** Une alternative simple doit exister pour tout geste complexe ou glisser-déposer, et une action grave ne doit jamais se déclencher au pointerdown seul. `ACCESSIBILITY-R10`
- **[loi]** Toute cible interactive doit mesurer au moins 24 × 24 pixels CSS ou bénéficier d'un espacement équivalent, sauf exceptions prévues. `ACCESSIBILITY-R11`
- **[préférence]** Nous appliquons les mécanismes normatifs pour toute limite de temps imposée, et renforçons l'exigence en annonçant et préservant les données déjà saisies. `ACCESSIBILITY-R12`
- **[loi]** Aucun contenu ne doit produire de flash dangereux — au maximum trois flashs par seconde, dans le respect des seuils établis. `ACCESSIBILITY-R13`
- **[préférence]** Nous testons chaque écran assemblé avant livraison avec le clavier seul, un lecteur d'écran, le zoom 200 %, un usage tactile imprécis et le mode mouvement réduit. `ACCESSIBILITY-R14`

## Non couvert — poser la question, ne rien trancher

- Mode sombre : Maintenir les contrastes et la hiérarchie.
- Notifications interruptives : Éviter et contrôler les interruptions non urgentes.


---

---
sujet: interaction
nature: languages
resume: "Ce langage définit comment un élément communique son **rôle** avant même que son libellé soit"
selon-contexte: [adaptive, border, button, elevation, motion]
source: INTERACTION-UX.md v1.1.0 + INTERACTION-UI.md v1.1.0
empreinte: sha256:342cae56181eaa03
regles: {loi: 19, preference: 13, non_qualifie: 0}
---
# RULES — interaction (compilé, mode build)

> Extrait mécaniquement de la doctrine par `tools/compile-regles.py`. Ne pas éditer à la main.
>
> **Étiquettes.** `[loi]` — vrai de tout produit : appliquer, et signaler comme non-conformité.
> `[préférence]` — notre choix, pas une norme : proposer en le disant, jamais imposer dans un
> produit qui n'est pas le nôtre. `[non qualifié]` — statut pas encore tranché : **traiter comme
> une préférence** et remonter la question.
> Ce que ne couvre aucune règle ci-dessous : ne pas trancher, poser la question.

## Règles de design

- **[préférence]** Une interface se comprend avant d'être lue : la forme, la structure, la position et les états annoncent le rôle d'un élément, et le libellé ne fait que préciser ensuite l'intention. `INTERACTION-R01`
- **[loi]** Le fait de reconnaître un rôle avant de lire ne dispense jamais du texte accessible : aucun pictogramme ambigu ni aucun contrôle dépourvu de nom n'est admis. `INTERACTION-R02`
- **[préférence]** Le système reconnaît six intentions — agir, naviguer, saisir, choisir, consulter, comprendre un état — et le composant se choisit d'après l'intention et le résultat produit, jamais d'après le style souhaité. `INTERACTION-R03`
- **[loi]** Deux éléments qui se ressemblent et réagissent de la même façon promettent le même type de résultat, et deux rôles différents ne sont jamais rendus indiscernables. `INTERACTION-R04`
- **[loi]** La sémantique native suit l'intention : une action est portée par un bouton, une navigation par un lien avec destination, une saisie par un champ, et le style ne transforme jamais l'un en l'autre. `INTERACTION-R05`
- **[loi]** Un contrôle manipulable possède une limite et des états perceptibles ; cette présence peut venir d'un fond, d'une bordure, d'une forme, d'une position ou d'une réaction, et n'exige pas une ombre. `INTERACTION-R06`
- **[loi]** Une action de faible poids peut être visuellement discrète mais ne prend jamais l'apparence d'un lien : la hiérarchie module la présence, elle n'efface pas le rôle. `INTERACTION-R07`
- **[loi]** Une zone de saisie délimite clairement l'endroit où la valeur sera reçue : son label, sa limite, son contenu et son focus la distinguent d'un bouton comme d'une simple surface. `INTERACTION-R08`
- **[préférence]** Le caractère réceptif d'une zone de saisie décrit une fonction et non un effet imposé : une ombre interne peut soutenir cette lecture dans un thème, mais elle n'est ni universelle ni suffisante. `INTERACTION-R09`
- **[loi]** Une surface qui organise du contenu ne promet pas de clic : une surface cliquable reçoit une cible réelle et des signaux d'interaction supplémentaires, une surface statique ne copie jamais l'apparence d'un contrôle. `INTERACTION-R10`
- **[préférence]** L'ombre indique une relation spatiale ou un changement d'état et ne décore jamais ; les niveaux d'élévation et leurs usages restent la propriété de la fondation elevation. `INTERACTION-R11`
- **[loi]** L'action, la navigation, l'erreur, la sélection et le focus restent compréhensibles sans perception de la couleur : le mot, la forme, la bordure, l'icône ou la position fournissent au moins un second canal. `INTERACTION-R12`
- **[loi]** Les états de repos, de survol, de focus, d'activation, de chargement et d'indisponibilité sont distincts lorsqu'ils existent ; le changement d'état confirme ce qui arrive et ne révèle jamais tardivement qu'un élément était interactif. `INTERACTION-R13`
- **[loi]** Le focus clavier est un état à part entière et jamais une imitation du survol ; l'état d'activation peut donner une sensation de pression, mais celle-ci reste subordonnée à la visibilité du focus, au contraste et à la préférence de mouvement réduit. `INTERACTION-R14`
- **[préférence]** La matérialité d'un élément est proportionnelle au besoin de compréhension et jamais à son importance commerciale : elle sert d'abord à distinguer un contrôle, un réceptacle, une surface et une superposition. `INTERACTION-R15`
- **[préférence]** Un effet visuel n'est conservé que s'il répond à une question vérifiable sur l'élément : est-il manipulable, reçoit-il une information, organise-t-il du contenu, appartient-il à une couche temporaire, son état vient-il de changer. `INTERACTION-R16`
- **[préférence]** Un effet qui ne répond à aucune de ces questions est décoratif et ne fait pas partie du langage d'interaction. `INTERACTION-R17`
- **[préférence]** Le neumorphisme et le glassmorphism ne sont pas des langages par défaut du système, parce qu'ils font dépendre la compréhension d'effets fragiles, coûteux et insuffisamment contrastés ; un usage ponctuel hors composant reste possible si l'accessibilité et la performance sont démontrées. `INTERACTION-R18`
- **[loi]** Un même rôle conserve ses signaux essentiels dans tous les contextes : une action principale peut changer de taille ou de disposition, elle reste identifiable comme action. `INTERACTION-R19`
- **[loi]** L'adaptation à l'espace disponible ne change jamais la nature du résultat : elle peut réorganiser, condenser ou révéler progressivement, mais elle ne transforme pas une navigation en action. `INTERACTION-R20`
- **[préférence]** La cohérence n'est pas l'uniformité : les rôles qui font des promesses différentes reçoivent des expressions différentes. `INTERACTION-R21`
- **[loi]** Le langage d'interaction reste opérant au clavier, au toucher, au zoom, en couleurs forcées, sans survol et en mouvement réduit : aucun canal fragile — ombre, vibration, couleur, animation — n'est indispensable à la compréhension ou à l'usage. `INTERACTION-R22`
- **[loi]** Une icône seule conserve un nom accessible, un changement d'état conserve un libellé ou un état exposé programmatiquement, et une cible conserve la sémantique native attendue de son rôle. `INTERACTION-R23`
- **[loi]** Un composant qui remplit la même fonction est nommé et représenté de façon constante dans tout le produit : l'apparence cohérente accompagne une identification cohérente. `INTERACTION-R24`

## Consignes d'implémentation

- **[loi]** La présence au repos précède le retour visuel : le survol confirme une cible déjà reconnaissable et ne sert jamais à révéler une cible qui paraissait statique. `INTERACTION-U01`
- **[préférence]** Les transitions d'état utilisent la durée rapide et la courbe de sortie du système, portent sur des propriétés sobres, et deviennent instantanées sous préférence de mouvement réduit sans que le changement cesse d'être visible. `INTERACTION-U02`
- **[préférence]** L'état d'activation peut réduire un décalage ou une ombre déjà justifiée pour donner une sensation de pression ; il ne crée pas d'ombre de repos nouvelle et ne déplace jamais la mise en page. `INTERACTION-U03`
- **[préférence]** L'indicateur de focus est construit sur la géométrie de largeur et de décalage définie par la fondation de bordure, sa couleur appartient au composant propriétaire, et aucun effet tactile ne le remplace. `INTERACTION-U04`
- **[préférence]** Un contrôle indisponible conserve une forme et un rôle perceptibles : la baisse de contraste ne va jamais jusqu'à faire disparaître la limite qui le distingue du contenu. `INTERACTION-U05`
- **[loi]** En mode de couleurs forcées, les bordures, l'indicateur de focus et la sémantique native survivent même lorsque les fonds, les ombres et les reflets sont neutralisés par le système. `INTERACTION-U06`
- **[loi]** Sous un pointeur incapable de survoler, aucune information ni aucune action n'est masquée : le style de survol n'est qu'un renforcement facultatif. `INTERACTION-U07`
- **[loi]** Une implémentation tactile n'intercepte pas les événements natifs du contrôle et respecte l'annulation du pointeur : l'action se déclenche au relâchement sur la cible, et sortir de la cible avant de relâcher l'annule. `INTERACTION-U08`


---

---
sujet: adaptive
nature: principles
resume: "Ce principe s'applique indépendamment de React et de CSS : un composant réutilisable"
selon-contexte: []
source: ADAPTIVE-UX.md v1.1.0 + ADAPTIVE-UI.md v1.1.0
empreinte: sha256:bcc679dee265b0f6
regles: {loi: 13, preference: 14, non_qualifie: 0}
---
# RULES — adaptive (compilé, mode build)

> Extrait mécaniquement de la doctrine par `tools/compile-regles.py`. Ne pas éditer à la main.
>
> **Étiquettes.** `[loi]` — vrai de tout produit : appliquer, et signaler comme non-conformité.
> `[préférence]` — notre choix, pas une norme : proposer en le disant, jamais imposer dans un
> produit qui n'est pas le nôtre. `[non qualifié]` — statut pas encore tranché : **traiter comme
> une préférence** et remonter la question.
> Ce que ne couvre aucune règle ci-dessous : ne pas trancher, poser la question.

## Règles de design

- **[loi]** Une décision de mise en page qui dépend de la fenêtre est portée par la fenêtre, et une décision qui dépend de l'espace reçu par un composant réutilisable est portée par son conteneur : une requête média n'évalue que la fenêtre, une requête de conteneur évalue le conteneur. `ADAPTIVE-R01`
- **[loi]** Une décision de structure globale répond au viewport ou à l'environnement ; une décision interne à un composant réutilisable répond à l'espace réellement disponible dans son conteneur, la largeur de la fenêtre ne décrivant pas cet espace. `ADAPTIVE-R02`
- **[loi]** Les préférences et capacités d'environnement — mouvement réduit, schéma de couleur, contraste préféré, couleurs forcées, impression, survol et type de pointeur — restent exprimées par requête média : elles décrivent l'utilisateur et le mode de rendu, jamais la largeur d'un composant. `ADAPTIVE-R03`
- **[loi]** Quand la cause de l'adaptation est la largeur disponible du composant, le mécanisme est la requête de conteneur ; elle n'est pas employée lorsqu'une grille, un retour à la ligne ou une taille intrinsèque résout déjà la disposition. `ADAPTIVE-R04`
- **[préférence]** Les états adaptatifs portent des noms de capacité — compact, regular, expanded — et jamais des noms d'appareil comme mobile, tablet ou desktop. `ADAPTIVE-R05`
- **[préférence]** Le seuil d'un état dérive du contenu — le point où le libellé, les actions ou la disposition cessent de tenir correctement — et ne recopie pas un point de rupture global de la fenêtre. `ADAPTIVE-R06`
- **[préférence]** Les seuils ne sont pas partagés entre composants : deux composants atteignent leur état compact à des largeurs différentes lorsque leur contenu et leur structure diffèrent. `ADAPTIVE-R07`
- **[préférence]** L'espace disponible peut modifier la disposition interne, la densité et les espacements dans les limites du composant, l'ordre visuel tant que l'ordre de lecture reste logique, la longueur d'un libellé lorsqu'une alternative validée existe, la présence d'informations secondaires et le regroupement d'actions secondaires dans un menu accessible. `ADAPTIVE-R08`
- **[préférence]** L'espace disponible ne modifie jamais la nature d'une action ou d'une navigation, la priorité réelle d'une action, l'information nécessaire pour décider, le nom accessible d'un contrôle, l'ordre de lecture, ni l'énoncé d'une obligation légale, d'un risque ou d'une erreur à corriger. `ADAPTIVE-R09`
- **[loi]** Le plus petit état viable d'un composant conserve l'intention principale, le contexte minimal pour la comprendre et l'accès à toutes les fonctions essentielles : la réduction de l'espace n'entraîne aucune perte d'information ni de fonctionnalité. `ADAPTIVE-R10`
- **[loi]** Un accroissement de l'espace ne peut que révéler des descriptions, des métadonnées ou des actions secondaires ; une information nécessaire à la décision est présente dès l'état compact et n'est jamais différée à un état plus large. `ADAPTIVE-R11`
- **[loi]** Un contrôle réduit à sa seule icône conserve un nom accessible programmatiquement déterminable et s'appuie sur une icône déjà reconnue dans le système ; l'infobulle qui l'accompagne se déclenche au pointeur comme au focus clavier et reste écartable, survolable et persistante. `ADAPTIVE-R12`
- **[préférence]** Le composant possède son adaptation : son consommateur choisit le contexte et la largeur qu'il lui accorde, sans maintenir une série de surcharges propres à chaque page. `ADAPTIVE-R13`
- **[loi]** Un composant ne présume pas qu'une fenêtre large lui accorde un conteneur large : il reste fonctionnel en barre latérale, en modale, en cellule de grille, en panneau divisé et en pleine largeur, l'espace disponible étant indépendant du type d'appareil et de la taille de l'écran. `ADAPTIVE-R14`
- **[loi]** Un conteneur de requête est nommé dès que plusieurs ancêtres pourraient y répondre : en l'absence de nom, la requête se résout contre l'ancêtre qualifié le plus proche, qui n'est pas nécessairement celui qui porte le contrat. `ADAPTIVE-R15`
- **[préférence]** Le style de base d'un composant rend son plus petit état viable et les états plus riches sont une amélioration progressive : si le mécanisme d'adaptation n'est pas disponible, le composant reste utilisable. `ADAPTIVE-R18`
- **[loi]** Une bascule d'état adaptative ne constitue pas un changement de contexte : le focus, la valeur saisie et la tâche en cours sont conservés de part et d'autre de la bascule. `ADAPTIVE-R19`

## Consignes d'implémentation

- **[préférence]** Une requête de conteneur n'intervient que lorsque le composant doit réellement changer d'état ; un layout intrinsèque qui résout déjà la disposition — grille, retour à la ligne, tailles intrinsèques — n'est pas remplacé par des seuils. `ADAPTIVE-U01`
- **[préférence]** Le type de conteneur est inline-size lorsque seule la largeur logique pilote le composant ; size, qui applique la containment de taille sur les deux axes et fait s'effondrer l'élément sans taille de bloc contextuelle ou explicite, n'est employé que si une condition sur l'axe de bloc est réellement interrogée. `ADAPTIVE-U02`
- **[préférence]** Le conteneur de requête est nommé dès qu'un composant peut être imbriqué dans plusieurs conteneurs de requête, le nom exprimant le contrat et écartant la résolution implicite contre l'ancêtre qualifié le plus proche. `ADAPTIVE-U03`
- **[préférence]** Les seuils s'expriment en unités logiques et relatives — rem, unités de conteneur, pourcentages — et sont déclarés dans le fichier du composant propriétaire, accompagnés de la raison qui les a fait émerger. `ADAPTIVE-U04`
- **[préférence]** Le CSS de base rend l'état compact viable et les requêtes successives enrichissent vers regular puis expanded, ces états n'étant déclarés que s'ils existent réellement. `ADAPTIVE-U05`
- **[préférence]** Le nombre de seuils d'un composant est égal au nombre de changements structurels observables ; un seuil sans changement sémantique ou spatial net est supprimé. `ADAPTIVE-U06`
- **[préférence]** Un état qui ne dépend que de la place disponible est calculé par CSS et n'est pas exposé en propriété de composant : l'API n'oblige pas le consommateur à synchroniser JavaScript et disposition. `ADAPTIVE-U07`
- **[loi]** Le masquage complet ne s'applique qu'à du contenu secondaire dont l'absence a été autorisée par la couche UX ; une action essentielle reste atteignable dans tous les états, au besoin regroupée dans un menu accessible. `ADAPTIVE-U08`
- **[loi]** L'ordre du DOM porte un ordre de lecture correct dans tous les états : la mise en page peut déplacer visuellement des éléments sans réordonner le sens, et un déplacement qui change le sens impose de repenser la structure. `ADAPTIVE-U09`
- **[loi]** Une variante en icône seule conserve son nom accessible : le libellé est masqué visuellement par la technique commune du système, jamais retiré du nom accessible. `ADAPTIVE-U10`


---

---
sujet: cognitive-load
nature: principles
resume: "Ce fichier pose les **obligations universelles de charge cognitive** : ce que tout écran, composant, pattern et flow doit respecter pour que l'interface n'impose jamais plus de travail mental que…"
selon-contexte: [laws]
source: COGNITIVE-LOAD-UX.md v1.0.1
empreinte: sha256:62334d3ebc1c66d9
regles: {loi: 7, preference: 8, non_qualifie: 0}
---
# RULES — cognitive-load (compilé, mode build)

> Extrait mécaniquement de la doctrine par `tools/compile-regles.py`. Ne pas éditer à la main.
>
> **Étiquettes.** `[loi]` — vrai de tout produit : appliquer, et signaler comme non-conformité.
> `[préférence]` — notre choix, pas une norme : proposer en le disant, jamais imposer dans un
> produit qui n'est pas le nôtre. `[non qualifié]` — statut pas encore tranché : **traiter comme
> une préférence** et remonter la question.
> Ce que ne couvre aucune règle ci-dessous : ne pas trancher, poser la question.

## Règles de design

- **[préférence]** Tout écran ou toute vue déclare une décision principale et une seule ; les choix secondaires, réglages et chemins alternatifs lui sont subordonnés visuellement et structurellement. `COGNITIVE-LOAD-R05`
- **[préférence]** Le nombre de choix simultanés se justifie par le besoin de la décision présente et jamais par la place disponible : un conteneur plus large peut révéler du contenu secondaire, il n'autorise aucune décision nouvelle. `COGNITIVE-LOAD-R06`
- **[loi]** Une interface montre par défaut ce qui est nécessaire à la décision présente ; l'avancé, le rare et le détail ne se révèlent que sur demande explicite de l'utilisateur. `COGNITIVE-LOAD-R07`
- **[préférence]** La divulgation progressive ne masque jamais une information nécessaire pour décider : un coût, un engagement, une obligation ou un risque est visible avant l'action qui engage. `COGNITIVE-LOAD-R08`
- **[préférence]** Une fonction essentielle reste découvrable sans connaissance préalable : réduire le nombre de choix visibles ne justifie jamais d'enfouir une fonction, et le doute se remonte au lieu de se trancher par principe. `COGNITIVE-LOAD-R09`
- **[préférence]** Tout choix qui admet une réponse majoritaire sensée porte une valeur par défaut, afin que l'utilisateur corrige une proposition plutôt qu'il ne construise une réponse à vide. `COGNITIVE-LOAD-R10`
- **[loi]** Aucune valeur par défaut n'engage l'utilisateur à son insu : consentement, achat, abonnement et partage ne sont jamais pré-cochés, le consentement résultant toujours d'un acte positif de l'utilisateur. `COGNITIVE-LOAD-R11`
- **[loi]** Une valeur par défaut se distingue toujours d'une valeur saisie par l'utilisateur : le pré-remplissage est annoncé et un texte indicatif ne tient jamais lieu de valeur. `COGNITIVE-LOAD-R12`
- **[préférence]** Une action réversible s'exécute immédiatement et offre un chemin d'annulation visible pendant un délai raisonnable ; la confirmation bloquante est réservée à l'action irréversible ou coûteuse à défaire. `COGNITIVE-LOAD-R13`
- **[loi]** Une action irréversible déclare avant son exécution ce qu'elle détruit, sa portée et l'absence de retour ; à défaut d'être réversible, elle est vérifiée et confirmée avant d'être finalisée. `COGNITIVE-LOAD-R14`
- **[loi]** Une saisie en cours survit à la navigation, à l'interruption et à l'expiration : quand la conservation n'est pas garantie, l'utilisateur est averti de la durée d'inactivité qui entraînerait la perte, et toute limite de temps reste ajustable. `COGNITIVE-LOAD-R15`
- **[préférence]** Une commande d'annulation n'est affichée que si l'annulation est techniquement garantie ; à défaut, le système demande une confirmation honnête plutôt que de proposer une annulation fictive. `COGNITIVE-LOAD-R16`
- **[loi]** Aucune information nécessaire à une décision n'est à retenir d'un écran à l'autre : le contexte requis est re-présenté là où la décision se prend. `COGNITIVE-LOAD-R17`
- **[loi]** L'interface montre l'état plutôt qu'elle ne le fait mémoriser : où l'utilisateur en est, ce qui est fait et ce qui reste sont visibles à tout moment. `COGNITIVE-LOAD-R18`
- **[préférence]** Une information critique — erreur, coût, sécurité, obligation légale — ne prend jamais la forme d'un élément décoratif ou promotionnel, sous peine d'être filtrée avant lecture. `COGNITIVE-LOAD-R19`


---

---
sujet: performance
nature: principles
resume: "Ce fichier pose le **contrat des attentes** : ce que l'interface montre, dit et promet pendant que le système travaille."
selon-contexte: [laws]
source: PERFORMANCE-UX.md v1.0.1
empreinte: sha256:b14fd85a642c0639
regles: {loi: 6, preference: 8, non_qualifie: 0}
---
# RULES — performance (compilé, mode build)

> Extrait mécaniquement de la doctrine par `tools/compile-regles.py`. Ne pas éditer à la main.
>
> **Étiquettes.** `[loi]` — vrai de tout produit : appliquer, et signaler comme non-conformité.
> `[préférence]` — notre choix, pas une norme : proposer en le disant, jamais imposer dans un
> produit qui n'est pas le nôtre. `[non qualifié]` — statut pas encore tranché : **traiter comme
> une préférence** et remonter la question.
> Ce que ne couvre aucune règle ci-dessous : ne pas trancher, poser la question.

## Règles de design

- **[loi]** Une réponse obtenue en moins de 100 ms n'affiche aucun indicateur d'attente : le feedback d'activation du contrôle suffit, et tout indicateur y fabrique de la lenteur perçue. `PERFORMANCE-R06`
- **[préférence]** Entre 100 ms et 1 s, l'attente se signale localement par un changement d'état du seul élément déclencheur, sans indicateur global ni blocage d'écran. `PERFORMANCE-R07`
- **[loi]** Toute attente dépassant 1 s est rendue perceptible visuellement et annoncée aux technologies d'assistance par un message d'état programmatiquement déterminable sans prise de focus, l'interface restant utilisable partout où l'attente ne bloque pas réellement. `PERFORMANCE-R08`
- **[loi]** Au-delà de 10 s, ou dès que la durée est longue et inconnue, l'attente devient un état à part entière portant une progression réelle ou une estimation honnête, la possibilité de poursuivre une autre tâche quand c'est techniquement vrai, et un délai d'expiration toujours défini. `PERFORMANCE-R09`
- **[loi]** Un indicateur d'attente n'apparaît pas au premier instant : il est différé d'un court délai afin de laisser passer sans bruit les réponses rapides, et reste affiché une durée minimale perceptible une fois montré. `PERFORMANCE-R10`
- **[préférence]** Ce qui permet de décider ou d'agir s'affiche en premier — le contenu principal avant l'accessoire, la structure avant le détail — et le squelette de chargement promet exactement la structure qui va arriver, à l'endroit où elle arrivera. `PERFORMANCE-R11`
- **[loi]** Un contenu qui arrive tardivement ne déplace jamais ce qui est déjà affiché : son espace est réservé d'avance ou son arrivée est neutre pour la mise en page, afin qu'aucune lecture ne soit perdue et qu'aucun geste déjà engagé ne soit détourné. `PERFORMANCE-R12`
- **[préférence]** Une interface ne peut afficher le succès avant confirmation du serveur qu'à trois conditions cumulées : l'action est réversible ou rejouable sans dommage, son succès est très probable, et tout échec éventuel est réparé visiblement. `PERFORMANCE-R13`
- **[préférence]** L'affichage optimiste est interdit sur les actions irréversibles, les paiements, les engagements juridiques et toute action dont l'échec coûterait plus que l'attente économisée : ces actions attendent leur confirmation réelle. `PERFORMANCE-R14`
- **[préférence]** Un succès affiché de façon optimiste reste, pour le système, un état en cours : il n'est jamais re-présenté comme définitif à un endroit où l'utilisateur fonderait sur lui une décision irréversible. `PERFORMANCE-R15`
- **[loi]** Aucune progression affichée n'est déconnectée du travail réel : la barre est déterminée quand l'avancement est mesurable, indéterminée sinon, aucune étape n'est ajoutée au seul bénéfice de l'affichage, et une estimation de durée ne s'affiche que si elle est honnête. `PERFORMANCE-R16`
- **[préférence]** Aucune attente n'est fabriquée : quand le système peut répondre instantanément, il répond instantanément, et la mise en scène du travail n'est jamais employée pour augmenter la valeur perçue. `PERFORMANCE-R17`
- **[préférence]** Une attente qui dépasse la durée attendue le dit explicitement à l'utilisateur et lui ouvre une issue — réessayer, poursuivre ailleurs, être prévenu — plutôt que de laisser un indicateur tourner sans fin. `PERFORMANCE-R18`
- **[préférence]** Le temps de l'utilisateur est traité comme la ressource la plus chère que le produit dépense : chaque attente est un emprunt remboursé par un feedback au bon seuil, une structure stable, un optimisme mérité et une honnêteté totale, jamais par une mise en scène. `PERFORMANCE-R20`


---

---
sujet: button
nature: components
resume: "Ce fichier contient le raisonnement : quand utiliser quoi, pourquoi, quel wording, quel risque."
selon-contexte: [accessibility, adaptive, border, card, consentement, elevation, emotion, form, iconography, interaction, link, motion, toast, typography, voice]
source: BUTTON-UX.md v1.9.0 + BUTTON-UI.md v1.6.2
empreinte: sha256:28e3c503d988bed4
regles: {loi: 10, preference: 82, non_qualifie: 0}
---
# RULES — button (compilé, mode build)

> Extrait mécaniquement de la doctrine par `tools/compile-regles.py`. Ne pas éditer à la main.
>
> **Étiquettes.** `[loi]` — vrai de tout produit : appliquer, et signaler comme non-conformité.
> `[préférence]` — notre choix, pas une norme : proposer en le disant, jamais imposer dans un
> produit qui n'est pas le nôtre. `[non qualifié]` — statut pas encore tranché : **traiter comme
> une préférence** et remonter la question.
> Ce que ne couvre aucune règle ci-dessous : ne pas trancher, poser la question.

## Règles de design

- **[préférence]** Nous utilisons un bouton pour toute action qui modifie un état, soumet une donnée ou déclenche un processus, jamais pour une simple navigation. `BUTTON-R01`
- **[loi]** Un contrôle qui se contente de naviguer vers une autre page doit être un lien, pas un bouton, car les deux n'ont pas le même comportement clavier natif. `BUTTON-R02`
- **[préférence]** Chez nous, un bouton qui ouvre une fenêtre modale est traité comme un bouton, même s'il ne navigue pas au sens strict. `BUTTON-R03`
- **[préférence]** Chez nous, la forme, la bordure et les états visuels d'un bouton doivent suffire à le faire reconnaître comme un contrôle interactif avant même la lecture de son texte. `BUTTON-R04`
- **[préférence]** Chez nous, un bouton ne signale jamais son affordance par une ombre portée : celle-ci vient de son style, sa bordure et ses états. `BUTTON-R05`
- **[préférence]** Chez nous, même dans son style le plus discret, un bouton reste un vrai bouton avec zone de contrôle et états propres, jamais un lien déguisé. `BUTTON-R06`
- **[préférence]** Chez nous, le survol d'un bouton produit une transition rapide et progressive, signal de retour immédiat plutôt qu'information nouvelle. `BUTTON-R07`
- **[préférence]** Chez nous, toute animation d'état du bouton est interruptible : redéclencher le survol pendant une transition l'inverse depuis où elle en est. `BUTTON-R08`
- **[préférence]** Chez nous, seule la rotation continue de l'indicateur de chargement se fait à vitesse constante ; tout autre mouvement du bouton accélère ou décélère. `BUTTON-R09`
- **[préférence]** Chez nous, la réussite d'un envoi s'incarne d'abord dans le bouton de soumission lui-même, qui se transforme visuellement avant d'afficher la confirmation. `BUTTON-R10`
- **[préférence]** Chez nous, la célébration d'un envoi réussi ne se joue qu'à un seul endroit à la fois, jamais sur le bouton et dans une notification en même temps. `BUTTON-R11`
- **[loi]** L'information transmise par une animation doit toujours rester disponible sans elle : en mode mouvement réduit, l'état final s'affiche instantanément, sans perte. `BUTTON-R12`
- **[préférence]** Chez nous, l'animation de célébration d'un envoi ne se joue jamais sur une action répétitive ou réflexe, seulement sur les moments qui le méritent. `BUTTON-R13`
- **[préférence]** Chez nous, l'envoi démarre réellement dès le premier clic indépendamment de toute animation, et l'état serveur réel prévaut toujours sur elle. `BUTTON-R14`
- **[préférence]** Chez nous, un bouton se définit par deux dimensions indépendantes : le style, qui exprime son poids visuel, et le tone, qui exprime la nature de l'action. `BUTTON-R16`
- **[préférence]** Chez nous, les styles et les tones d'un bouton se combinent librement, formant seize combinaisons de couleurs possibles, chacune ayant un sens propre. `BUTTON-R17`
- **[préférence]** Chez nous, le bouton dominant d'une vue porte précisément l'action que ce parcours est conçu pour provoquer, pas n'importe quelle action jugée importante. `BUTTON-R18`
- **[préférence]** Chez nous, une vue ne doit jamais afficher plus d'un bouton dominant à la fois, pour ne pas diluer le signal de priorité. `BUTTON-R19`
- **[préférence]** Chez nous, le bouton d'action du header persistant et le bouton dominant du contenu comptent comme deux zones distinctes et peuvent coexister à l'écran. `BUTTON-R20`
- **[préférence]** Chez nous, le bouton du header et celui du contenu de page ne doivent jamais avoir exactement le même poids visuel : l'un des deux doit dominer. `BUTTON-R21`
- **[préférence]** Chez nous, un bouton alternatif propose une option légitime, comme annuler ou retour, qui ne concurrence jamais visuellement le bouton dominant. `BUTTON-R22`
- **[préférence]** Chez nous, un bouton alternatif a toujours moins de poids visuel que le bouton dominant placé à côté de lui, même à taille identique. `BUTTON-R23`
- **[préférence]** Chez nous, un bouton mineur porte une action secondaire présente mais volontairement peu visible, comme voir plus ou modifier les préférences. `BUTTON-R24`
- **[préférence]** Chez nous, si une action en style discret a un enjeu réel fort, c'est le classement de l'action qui doit être revu, pas la visibilité du bouton. `BUTTON-R25`
- **[préférence]** Chez nous, un bouton au style le plus discret peut porter une action à enjeu réel si sa couleur sémantique compense sa faible présence visuelle. `BUTTON-R26`
- **[préférence]** Chez nous, un seul tone de bouton est tiré directement de la couleur de marque ; les autres tones expriment un état sémantique. `BUTTON-R27`
- **[préférence]** Chez nous, le tone neutre est la couleur par défaut d'un bouton qui n'a pas de charge sémantique particulière au-delà de son style. `BUTTON-R28`
- **[préférence]** Chez nous, le tone destructif signale sans ambiguïté qu'une action supprime, retire ou annule quelque chose de coûteux à revenir en arrière. `BUTTON-R29`
- **[préférence]** Chez nous, un bouton destructif n'est jamais placé exactement là où se trouve habituellement une action fréquente, pour éviter le clic accidentel. `BUTTON-R30`
- **[préférence]** Chez nous, le tone d'avertissement porte une action qui a un poids réel et mérite l'attention, sans jamais détruire ni retirer quoi que ce soit. `BUTTON-R31`
- **[préférence]** Chez nous, un bouton d'avertissement est isolé visuellement des actions fréquentes, selon la même logique que le bouton destructif. `BUTTON-R32`
- **[préférence]** Chez nous, le choix du style et du tone d'un bouton n'est jamais esthétique : il déclare explicitement l'enjeu réel de l'action pour l'utilisateur. `BUTTON-R34`
- **[préférence]** Chez nous, la taille d'un bouton répond à la densité du contexte qui l'accueille, pas à l'importance perçue de l'action. `BUTTON-R35`
- **[préférence]** Chez nous, la plus petite taille de bouton est réservée aux contextes denses comme les tableaux, barres d'outils et panneaux compacts. `BUTTON-R36`
- **[préférence]** Chez nous, la taille moyenne est la taille par défaut du bouton, utilisée dans les formulaires et la majorité des contextes standards. `BUTTON-R37`
- **[préférence]** Chez nous, la plus grande taille de bouton est réservée aux contextes à forte emphase visuelle volontaire, comme un hero ou un CTA marketing. `BUTTON-R38`
- **[préférence]** Chez nous, tous les boutons d'un même groupe partagent toujours la même taille, même si leurs styles diffèrent. `BUTTON-R39`
- **[préférence]** Chez nous, un bouton d'état bascule entre deux états persistants, comme suivre ou ne plus suivre, il ne déclenche pas une action ponctuelle. `BUTTON-R40`
- **[préférence]** Chez nous, le label d'un bouton d'état décrit l'état actuel de l'élément, jamais l'action qu'un clic déclencherait. `BUTTON-R41`
- **[préférence]** Chez nous, un bouton de confirmation valide une action déjà engagée plus tôt dans le flux, il ne l'initie pas. `BUTTON-R42`
- **[préférence]** Chez nous, un bouton de confirmation est toujours accompagné d'une option d'annulation visible au même niveau, jamais seul comme unique issue. `BUTTON-R43`
- **[préférence]** Chez nous, un bouton d'annulation permet de revenir sur une action qui vient d'être exécutée, généralement affiché dans une notification temporaire. `BUTTON-R44`
- **[préférence]** Chez nous, le message proposant d'annuler une action reste visible au moins 5 à 8 secondes, sans bloquer le reste de l'interface pendant ce délai. `BUTTON-R45`
- **[préférence]** Chez nous, une action à enjeu réel doit toujours offrir soit une confirmation préalable, soit une option d'annulation après coup, jamais aucune des deux. `BUTTON-R46`
- **[préférence]** Chez nous, le niveau de friction avant une suppression dépend du coût de recréation de la donnée si l'action est mal exécutée. `BUTTON-R47`
- **[préférence]** Chez nous, deux boutons de suppression visuellement identiques peuvent avoir des niveaux de friction différents selon la donnée qu'ils suppriment. `BUTTON-R48`
- **[loi]** Une action à effet unique, comme un paiement ou un envoi définitif, doit être protégée contre un déclenchement multiple par impatience ou latence réseau. `BUTTON-R49`
- **[loi]** Dès le premier clic sur une action à effet unique, le bouton doit passer en état de chargement ou désactivé, avant même la réponse du serveur. `BUTTON-R50`
- **[préférence]** Chez nous, une friction volontaire retarde l'exécution d'une action destructive à enjeu élevé, pour empêcher un clic réflexe. `BUTTON-R51`
- **[préférence]** Chez nous, la confirmation finale d'une action très critique impose un délai de 2 à 3 secondes avant d'être cliquable, ou une saisie explicite de confirmation. `BUTTON-R52`
- **[préférence]** Chez nous, l'ordre entre bouton dominant et alternatif suit une convention propre à chaque type de paire, faute de convention universelle établie. `BUTTON-R53`
- **[préférence]** Chez nous, une fois un ordre choisi pour un type de paire de boutons, il reste identique sur tout le produit, sans jamais varier d'un écran à l'autre. `BUTTON-R54`
- **[préférence]** Chez nous, deux boutons de poids visuel identique côte à côte sont à proscrire, sauf dans un choix binaire volontairement équilibré. `BUTTON-R55`
- **[préférence]** Chez nous, un menu d'au moins trois options proposées à poids visuel égal côte à côte est un cas où la règle du bouton dominant unique ne s'applique pas. `BUTTON-R56`
- **[préférence]** Chez nous, l'espacement entre deux boutons adjacents doit être suffisant pour éviter le clic accidentel sur le mauvais bouton. `BUTTON-R57`
- **[préférence]** Chez nous, un bouton hérite toujours de la grille du contenu qu'il accompagne, il ne flotte jamais de façon arbitraire. `BUTTON-R58`
- **[préférence]** Chez nous, un bouton lié à un bloc de contenu s'aligne sur la même grille que ce contenu, jamais centré par simple préférence esthétique. `BUTTON-R59`
- **[préférence]** Chez nous, un formulaire ne doit jamais avoir plus d'un bouton de soumission. `BUTTON-R60`
- **[préférence]** Chez nous, un groupe de boutons peut se réorganiser selon la largeur de son conteneur, mais chaque bouton garde toujours la même action, le même style et le même niveau de friction. `BUTTON-R61`
- **[préférence]** Chez nous, le texte visible d'un bouton n'est jamais tronqué automatiquement ; il se replie sur plusieurs lignes si besoin plutôt que d'être coupé. `BUTTON-R62`
- **[préférence]** Chez nous, le bouton de soumission d'un formulaire se trouve toujours en fin de parcours, jamais au milieu d'un long formulaire qui défile. `BUTTON-R63`
- **[préférence]** Chez nous, le libellé du bouton final d'un formulaire reflète la conclusion réelle de l'action plutôt que de rester générique sur la dernière étape. `BUTTON-R64`
- **[loi]** Une action affichée uniquement au survol d'une ligne doit rester accessible sans survol, car les appareils tactiles n'ont pas de hover et l'action deviendrait inutilisable. `BUTTON-R66`
- **[préférence]** Chez nous, une action destructive représentée par une simple icône reste soumise à confirmation obligatoire, contrairement à une icône d'action réversible. `BUTTON-R67`
- **[préférence]** Chez nous, la position du bouton qui referme ou valide une modale suit une convention unique définie pour tout le produit, jamais réinventée au cas par cas. `BUTTON-R68`
- **[préférence]** Chez nous, dans une modale de confirmation, le bouton destructif n'est jamais celui qui s'active par défaut avec la touche Entrée. `BUTTON-R69`
- **[loi]** Un bouton en grille dense doit rester lisible sans que son padding ne descende sous le seuil minimal de zone tactile accessible. `BUTTON-R71`
- **[préférence]** Chez nous, le bouton d'action du header reste visible au défilement ou se repositionne intelligemment, il ne disparaît jamais. `BUTTON-R72`
- **[préférence]** Chez nous, un header ne contient qu'un seul bouton d'action dominant ; les autres éléments de navigation restent des liens, pas des boutons. `BUTTON-R73`
- **[préférence]** Chez nous, dans une pagination, la page actuellement affichée n'est jamais cliquable et son état est visuellement sans ambiguïté. `BUTTON-R74`
- **[préférence]** Chez nous, une pagination affiche, quand c'est pertinent, une indication explicite de progression comme le numéro de page sur le total. `BUTTON-R75`
- **[préférence]** Chez nous, le bouton de fermeture d'une bannière promotionnelle reste une action facile et sans friction. `BUTTON-R77`
- **[préférence]** Chez nous, un bouton d'action flottant réserve une zone d'exclusion autour de lui pour ne jamais masquer de contenu critique. `BUTTON-R78`
- **[préférence]** Chez nous, un écran ne doit jamais afficher plus d'un bouton d'action flottant à la fois. `BUTTON-R79`
- **[préférence]** Chez nous, un bouton désactivé ne doit jamais l'être silencieusement : la cause de la désactivation doit toujours être exposée à l'utilisateur. `BUTTON-R80`
- **[préférence]** Chez nous, l'état de chargement d'un bouton remplace son libellé par un indicateur de progression, plutôt que de simplement le griser. `BUTTON-R81`
- **[préférence]** Chez nous, sur mobile, l'absence de survol est compensée par un léger retour haptique au moment où l'utilisateur touche le bouton. `BUTTON-R82`
- **[loi]** Le retour haptique d'un bouton ne doit jamais être l'unique confirmation d'une action : le changement d'état doit toujours rester perceptible visuellement. `BUTTON-R83`
- **[loi]** Une action grave ne doit jamais se déclencher dès l'enfoncement du bouton : elle doit partir au relâchement, et un appui relâché en dehors du bouton doit être annulé. `BUTTON-R84`
- **[préférence]** Chez nous, sur desktop, le survol du bouton est le principal signal confirmant qu'il est bien interactif avant le clic. `BUTTON-R85`
- **[préférence]** Chez nous, quand une action ne peut être réitérée qu'après un délai, le compte à rebours reste affiché en continu sur le bouton. `BUTTON-R86`
- **[préférence]** Chez nous, un verbe d'action qui décrit le bénéfice ou la conséquence est préféré à un label générique comme valider ou OK. `BUTTON-R87`
- **[loi]** Le texte d'un bouton doit rester compréhensible même hors contexte, et un même concept doit toujours porter le même mot partout dans le produit. `BUTTON-R88`
- **[préférence]** Chez nous, le ton du bouton de soumission ne se réchauffe que sur le moment précis de succès d'un envoi catalogué ; partout ailleurs il reste factuel. `BUTTON-R89`
- **[préférence]** Chez nous, la position de l'icône d'un bouton est l'une de cinq valeurs possibles : aucune, en tête, en fin, des deux côtés, ou icône seule. `BUTTON-R90`
- **[loi]** Un bouton qui n'affiche qu'une icône, sans texte visible, doit toujours porter un nom accessible, sans aucune exception. `BUTTON-R91`
- **[préférence]** Chez nous, l'icône se place en tête du texte pour une action de navigation, et en fin de texte pour une action de progression ou d'ouverture. `BUTTON-R92`
- **[préférence]** Chez nous, une icône de chaque côté du texte n'est utilisée que lorsque les deux directions portent réellement du sens. `BUTTON-R93`
- **[préférence]** Chez nous, un badge ou compteur affiché sur un bouton est une simple information d'état, jamais une seconde action cliquable. `BUTTON-R94`
- **[préférence]** Chez nous, un bouton de connexion sociale suit les contraintes de la marque tierce plutôt que le design system interne, à titre d'exception documentée. `BUTTON-R95`
- **[préférence]** Chez nous, le niveau de friction d'un bouton doit toujours être proportionnel au risque réel de l'action, jamais appliqué de façon uniforme. `BUTTON-R97`

## Consignes d'implémentation

- **[préférence]** Le code du bouton n'implémente aucune ombre portée à l'état de repos ; son affordance vient du remplissage, de la bordure, des états et du focus. `BUTTON-U01`


---

---
sujet: card
nature: components
resume: "Ce fichier contient le raisonnement : modes d'interaction, composition, empty state, risques."
selon-contexte: [adaptive, border, button, collection, emotion, input, interaction, link, motion, toast, typography, voice]
source: CARD-UX.md v1.4.1 + CARD-UI.md v1.5.2
empreinte: sha256:1ae75e2f2b6bcf0b
regles: {loi: 8, preference: 42, non_qualifie: 0}
---
# RULES — card (compilé, mode build)

> Extrait mécaniquement de la doctrine par `tools/compile-regles.py`. Ne pas éditer à la main.
>
> **Étiquettes.** `[loi]` — vrai de tout produit : appliquer, et signaler comme non-conformité.
> `[préférence]` — notre choix, pas une norme : proposer en le disant, jamais imposer dans un
> produit qui n'est pas le nôtre. `[non qualifié]` — statut pas encore tranché : **traiter comme
> une préférence** et remonter la question.
> Ce que ne couvre aucune règle ci-dessous : ne pas trancher, poser la question.

## Règles de design

- **[préférence]** Le mode d'interaction d'une carte est reconnaissable au repos ; le survol confirme une cible déjà annoncée et ne révèle jamais après coup qu'une carte était cliquable. `CARD-R11`
- **[préférence]** L'adaptation d'une carte à la largeur de son conteneur peut changer sa disposition, sa densité et la divulgation d'informations secondaires, jamais son mode d'interaction, son sujet, sa destination ni les informations nécessaires pour décider. `CARD-R12`
- **[préférence]** La carte convient au parcours de contenus hétérogènes dont chaque élément se suffit à lui-même : tableau de bord, flux varié, catalogue où l'image porte l'essentiel de la décision. `CARD-R15`
- **[préférence]** La carte ne convient pas à la comparaison ni à la recherche parmi des éléments homogènes, où une liste ou une table est supérieure. `CARD-R16`
- **[préférence]** Lorsqu'un même écran peut relever des deux régimes, le critère qui tranche est le mode de lecture dominant : la découverte appelle la carte, l'évaluation comparative appelle la liste ou la table, quitte à offrir les deux modes. `CARD-R17`
- **[préférence]** Une carte statique présente un groupe d'informations sans être elle-même une cible ; les seules cibles sont les éléments interactifs placés à l'intérieur. `CARD-R18`
- **[préférence]** Le mode statique est le seul qui accepte librement plusieurs éléments interactifs internes. `CARD-R19`
- **[préférence]** Dans une carte cliquable, toute la surface constitue une cible unique, typiquement une navigation vers le détail du sujet. `CARD-R20`
- **[préférence]** Quand une carte cliquable doit malgré tout porter des actions, celles-ci sont des éléments frères dans le document, dotés de cibles propres et distinctes, et cette coexistence est arbitrée explicitement plutôt que subie. `CARD-R23`
- **[préférence]** Une carte sélectionnable représente une option dans un choix : son activation sélectionne, elle ne navigue pas. `CARD-R24`
- **[loi]** L'état sélectionné d'une carte est signalé autrement que par la couleur seule et est exposé programmatiquement. `CARD-R25`
- **[préférence]** Dans un groupe de cartes sélectionnables, toutes partagent le même mode de sélection — simple ou multiple — et la même structure interne. `CARD-R26`
- **[préférence]** Une carte dépliable masque puis révèle un contenu secondaire volumineux sans faire quitter le contexte ; elle ne sert pas à dissimuler une information nécessaire à la décision. `CARD-R27`
- **[préférence]** Lorsqu'une carte dépliable contient des éléments interactifs, seul un contrôle dédié déclenche le dépliage ; lorsqu'elle n'en contient pas, toute la surface peut le déclencher. `CARD-R28`
- **[préférence]** Une même collection ne mélange jamais plusieurs modes d'interaction de carte. `CARD-R29`
- **[préférence]** La densité confortable est le défaut de la carte : tableaux de bord, pages de contenu, catalogues. `CARD-R30`
- **[préférence]** La densité compacte est réservée aux contextes denses : panneaux latéraux, listes de cartes à fort volume, widgets. `CARD-R31`
- **[préférence]** La densité modifie le remplissage interne et les écarts entre emplacements, jamais la structure : une carte compacte a les mêmes emplacements, dans le même ordre, qu'une carte confortable. `CARD-R32`
- **[préférence]** Une collection de cartes partage une densité unique. `CARD-R33`
- **[préférence]** L'ordre des emplacements d'une carte est canonique — media, en-tête, corps, zone d'actions — chaque emplacement restant facultatif ; cet ordre ne se réinvente pas carte par carte. `CARD-R34`
- **[préférence]** Le media d'une carte porte l'identification visuelle du sujet ; une image qui n'aide ni à identifier ni à décider agrandit la carte sans bénéfice. `CARD-R35`
- **[préférence]** Une collection de cartes emploie un ratio d'image unique et fixe. `CARD-R36`
- **[préférence]** L'absence de media est un cas normal et non une erreur : elle est traitée par un remplacement délibéré de même encombrement, jamais par une image cassée ni par un effondrement de la carte. `CARD-R37`
- **[loi]** Toute image informative d'une carte porte une alternative textuelle ; une image purement décorative est explicitement marquée comme telle afin d'être ignorée par les technologies d'assistance. `CARD-R38`
- **[loi]** Le titre d'une carte nomme le sujet de la carte et en décrit le propos ; il est le point d'entrée de la lecture visuelle comme de la lecture d'écran. `CARD-R39`
- **[loi]** Le titre d'une carte est un élément de titre sémantique réel, de niveau identique sur toutes les cartes d'une même collection. `CARD-R40`
- **[préférence]** Le corps d'une carte donne juste assez d'information pour décider d'entrer ou de passer : la carte est un résumé, pas le contenu lui-même. `CARD-R41`
- **[préférence]** Le texte d'une carte est tronqué à un nombre de lignes constant plutôt que laissé libre ; la troncature ne masque jamais une information décisive et le texte complet reste accessible. `CARD-R42`
- **[préférence]** Une carte ne porte qu'une seule action principale ; les actions secondaires passent en icônes discrètes ou en menu de débordement, jamais en boutons texte concurrents. `CARD-R45`
- **[loi]** Les actions d'une carte occupent une position constante dans toute la collection : en pied de carte pour les appels à l'action, en coin d'en-tête pour les actions portant sur l'objet entier. `CARD-R46`
- **[préférence]** Les actions d'une carte ne sont jamais visibles au seul survol : un menu de débordement permanent est préférable à des icônes qui apparaissent. `CARD-R47`
- **[préférence]** Une collection vide affiche un état vide structuré : image facultative, titre court et positif, explication de la cause du vide, et action pour en sortir. `CARD-R49`
- **[préférence]** Le texte d'un état vide diffère selon sa cause : première utilisation, absence de résultat, ou erreur. `CARD-R50`
- **[préférence]** Le survol d'une carte cliquable confirme son affordance par une élévation ou une bordure renforcée ; une carte statique ne réagit pas au survol. `CARD-R54`
- **[loi]** Une carte cliquable ou sélectionnable est une cible clavier : elle présente un indicateur de focus visible, portant sur la carte entière, qui n'est jamais supprimé. `CARD-R55`
- **[préférence]** Le chargement d'une collection est occupé par des cartes squelettes qui reproduisent la structure et les dimensions des cartes réelles, plutôt que par un indicateur global. `CARD-R56`
- **[préférence]** Rien n'anime au chargement initial d'une collection de cartes : seuls les changements réactifs déclenchés par l'utilisateur sont animés, les squelettes occupent l'attente sans entrer en scène. `CARD-R59`
- **[loi]** Le mouvement d'une carte confirme un changement d'état sans jamais le porter seul : l'état déplié ou replié est exposé programmatiquement, de sorte que la suppression de l'animation ne supprime aucune information. `CARD-R60`
- **[préférence]** Sous préférence de mouvement réduit, le chevron d'une carte dépliable saute à son orientation finale sans rotation animée et le contenu révélé apparaît en fondu instantané plutôt qu'en glissement : l'information reste intégrale, seul le déplacement spatial disparaît. `CARD-R61`
- **[préférence]** Une carte est une surface de consultation calme : un battement expressif sur un conteneur de lecture mentirait sur son rôle, comme le ferait un style cliquable sur une carte statique. `CARD-R63`
- **[préférence]** Un composant qui vit en collection est disqualifié d'emblée pour tout moment expressif : ce qui se répète à chaque carte cesse d'être un moment mérité. `CARD-R64`
- **[préférence]** En grille, les cartes ont des largeurs uniformes et des hauteurs alignées par rangée ; c'est le ratio d'image fixe et la troncature du texte qui rendent cet alignement possible. `CARD-R67`
- **[préférence]** En grille, chaque emplacement occupe la même position sur toutes les cartes : la répétition visuelle promet la prédictibilité et chaque écart la rompt. `CARD-R68`
- **[préférence]** En liste verticale, quand la lecture est séquentielle, une carte peut adopter une disposition horizontale plaçant le media à côté du contenu. `CARD-R69`
- **[préférence]** Une liste de cartes homogènes comparées entre elles rouvre la question du composant : la liste simple redevient candidate. `CARD-R70`
- **[préférence]** Une carte statistique — un chiffre, un libellé, une tendance — est statique par défaut ; si elle conduit vers un détail, elle devient cliquable et suit toutes les règles de ce mode. `CARD-R71`
- **[préférence]** La hiérarchie d'un tableau de bord vient de la taille occupée par chaque carte dans la grille, non d'un axe de style porté par la carte. `CARD-R72`
- **[préférence]** Un carrousel de cartes signale son débordement en laissant une carte partiellement visible en bord de zone ; un carrousel dont rien ne dépasse est indistinguable d'une grille complète. `CARD-R73`
- **[loi]** Toute opération de déplacement offerte au glisser-déposer dispose d'une alternative à pointeur unique réalisant le même déplacement sans maintien ni traînée, et le déplacement effectif est annoncé aux technologies d'assistance. `CARD-R74`
- **[préférence]** L'interactivité d'une carte est univoque : soit la carte est la cible, soit elle contient des cibles, sans ambiguïté possible entre les deux. `CARD-R76`

## Non couvert — poser la question, ne rien trancher

- Carte promotionnelle / alert : La carte veut porter un message mis en avant.
- Carte tâche (kanban) : La carte se déplace entre colonnes.
- Masonry (hauteurs variables) : Les cartes ont des hauteurs différentes (Pinterest).
- Carte dans une modale / side panel : La carte vit dans un espace contraint.
- Carte draggable : On réordonne les cartes.
- Carte dismissable : L'utilisateur peut fermer définitivement la carte.
- Swipe actions mobiles : On glisse une carte pour révéler des actions.


---

---
sujet: collection
nature: patterns
resume: "Ce pattern orchestre **une grille d'items et ses outils** : la zone de collection, la mécanique des colonnes, la croissance (charger plus, pagination), le tri et les filtres, les états de…"
selon-contexte: [adaptive, card, grid, spacing, surface]
source: COLLECTION-UX.md v1.0.1 + COLLECTION-UI.md v1.0.0
empreinte: sha256:4562ca0766c8a1eb
regles: {loi: 5, preference: 28, non_qualifie: 0}
---
# RULES — collection (compilé, mode build)

> Extrait mécaniquement de la doctrine par `tools/compile-regles.py`. Ne pas éditer à la main.
>
> **Étiquettes.** `[loi]` — vrai de tout produit : appliquer, et signaler comme non-conformité.
> `[préférence]` — notre choix, pas une norme : proposer en le disant, jamais imposer dans un
> produit qui n'est pas le nôtre. `[non qualifié]` — statut pas encore tranché : **traiter comme
> une préférence** et remonter la question.
> Ce que ne couvre aucune règle ci-dessous : ne pas trancher, poser la question.

## Règles de design

- **[préférence]** Une collection d'items homogènes présente des items de même poids et de même largeur, disposés sur une grille dont les colonnes émergent d'une largeur minimale d'item. `COLLECTION-R04`
- **[préférence]** Une collection composée dispose des blocs de tailles différentes sur une grille explicite à colonnes égales, chaque bloc occupant un nombre entier de cellules, le nombre de colonnes se choisissant sur le contenu plutôt que sur un nombre canonique repris d'un autre système. `COLLECTION-R05`
- **[préférence]** Une même collection n'applique qu'un seul régime de grille ; une collection composée peut contenir une collection d'items homogènes, jamais l'inverse. `COLLECTION-R06`
- **[préférence]** Le nombre de colonnes d'une collection se déduit de la largeur minimale d'un item et de l'espace réellement disponible dans son conteneur, jamais d'une classe d'appareil ni d'un point de rupture intermédiaire. `COLLECTION-R07`
- **[préférence]** Sous le point de rupture mobile, la collection s'affiche en colonne unique occupant toute la largeur disponible. `COLLECTION-R08`
- **[préférence]** La dernière rangée incomplète conserve la largeur d'item des rangées pleines : aucun item ne s'étire pour combler l'espace restant. `COLLECTION-R09`
- **[loi]** Le passage d'un nombre de colonnes à un autre préserve l'ordre de lecture, l'ordre du document et l'ordre de focus ; la mise en avant d'un item se décide par son rang, jamais par une réorganisation visuelle qui contredit l'ordre programmatique. `COLLECTION-R10`
- **[préférence]** Une collection réduite à un ou deux items conserve la grille et les largeurs de la collection pleine, sans mise en scène particulière du petit nombre. `COLLECTION-R11`
- **[préférence]** Une collection n'utilise qu'une seule valeur de gouttière, identique entre colonnes et rangées, prise dans l'échelle d'espacement du système et appariée à la densité de la collection. `COLLECTION-R12`
- **[préférence]** La zone de collection peut se distinguer du fond de page par une surface propre, qui englobe la grille et ses outils comme une seule région perçue. `COLLECTION-R13`
- **[préférence]** Les outils portant sur l'ensemble de la collection — tri, filtres, recherche, compteur — occupent une position constante au-dessus de la grille ; un contrôle qui ne porte que sur un item appartient à cet item. `COLLECTION-R14`
- **[préférence]** Le tri appliqué par défaut est visible et nommé dans l'interface : une collection n'arrive jamais triée silencieusement. `COLLECTION-R15`
- **[préférence]** Un filtre actif dès l'arrivée sur la collection est déclaré visiblement : aucune restriction du jeu de résultats n'est appliquée sans que l'utilisateur puisse la constater. `COLLECTION-R16`
- **[loi]** Les filtres actifs restent affichés, chacun retirable d'un seul geste, et le compteur de résultats reflète le jeu filtré à chaque changement. `COLLECTION-R17`
- **[préférence]** Par défaut, une collection longue s'étend sur demande explicite de l'utilisateur, sans déplacer sa position de lecture ni éloigner le pied de page. `COLLECTION-R19`
- **[préférence]** La pagination remplace l'extension à la demande lorsque la position d'un résultat doit être adressable — citée, retrouvée ou comparée. `COLLECTION-R20`
- **[préférence]** Le défilement infini n'est jamais le seul moyen de parcourir une collection : il est doublé d'un chemin fini, et il est exclu d'un écran dont le pied de page doit rester atteignable. `COLLECTION-R21`
- **[préférence]** Le retour à une collection déjà consultée en restaure la position, le tri et les filtres. `COLLECTION-R22`
- **[préférence]** L'échec du chargement d'un incrément laisse en place les items déjà affichés et propose une reprise locale de la seule opération échouée. `COLLECTION-R23`
- **[préférence]** Au chargement initial, les marques d'attente occupent un nombre de cellules stable, de sorte que l'arrivée du contenu ne déplace pas la grille, et rien ne s'anime. `COLLECTION-R24`
- **[loi]** Un tri ou un filtrage réorganise la grille sobrement et sans changement de contexte — ni déplacement du focus, ni changement de vue imposé ; sous préférence de mouvement réduit, le nouveau résultat remplace l'ancien sans transition. `COLLECTION-R25`
- **[loi]** Tout changement du jeu de résultats est annoncé aux technologies d'assistance par un message de statut déterminable programmatiquement, qui ne prend pas le focus. `COLLECTION-R26`
- **[préférence]** Dans une collection, le mode d'interaction est une propriété du groupe et la présence d'une cible une propriété de l'élément ; un élément sans cible ne présente aucun signal d'interaction. `COLLECTION-R33`
- **[préférence]** L'uniformité de largeur, de rythme, d'ordre et de règles est le contrat d'une collection : la mise en avant d'un item passe par son rang, par sa taille en cellules ou par son contenu, jamais par une exception locale à ce contrat. `COLLECTION-R32`

## Consignes d'implémentation

- **[préférence]** La grille d'items se déclare par une répétition de colonnes bornées par une largeur minimale d'item et une fraction de l'espace restant, sans requête média ; la largeur minimale est plafonnée par la largeur du conteneur, et le mode de répétition retenu ne remplit pas les colonnes manquantes de la dernière rangée. `COLLECTION-U01`
- **[préférence]** Sous le point de rupture mobile, la colonne unique n'est forcée par une requête média que lorsqu'elle n'émerge pas déjà du plafonnement de la largeur minimale d'item. `COLLECTION-U02`
- **[préférence]** La gouttière d'une collection est un token d'espacement unique par niveau de densité, appliqué identiquement aux colonnes et aux rangées. `COLLECTION-U03`
- **[préférence]** La zone de collection peut porter un fond de surface distinct du fond de page et un remplissage pris dans l'échelle d'espacement, les items conservant le fond de base. `COLLECTION-U06`
- **[préférence]** La grille du régime composé se déclare en colonnes égales, les blocs s'y étendant par portées de cellules entières. `COLLECTION-U07`
- **[préférence]** L'espace entre blocs appartient à la grille : aucun bloc ne déclare de marge externe. `COLLECTION-U08`
- **[préférence]** Le déclencheur d'extension à la demande est un bouton secondaire placé dans le flux sous la grille, jamais flottant, et il suit le cycle d'action en cours avec protection contre la double activation. `COLLECTION-U09`
- **[préférence]** Les marques d'attente occupent un nombre de cellules fixe, au moins une rangée pleine, et sont remplacées en place par les cellules réelles. `COLLECTION-U10`
- **[loi]** Le compteur de résultats est la seule région live de la collection et son annonce est polie ; la grille elle-même n'est jamais déclarée région live. `COLLECTION-U11`

## Non couvert — poser la question, ne rien trancher

- Table de données : Le besoin est un tableau à colonnes triables.


---

---
sujet: color
nature: foundations
resume: "Ce fichier contient le raisonnement : rôles, registres, redondance, contraste, theming."
selon-contexte: [alert, button, card, elevation, form, input, link]
source: COLOR-UX.md v1.2.0 + COLOR-UI.md v1.2.0
empreinte: sha256:115abe39bbc5881d
regles: {loi: 13, preference: 10, non_qualifie: 0}
---
# RULES — color (compilé, mode build)

> Extrait mécaniquement de la doctrine par `tools/compile-regles.py`. Ne pas éditer à la main.
>
> **Étiquettes.** `[loi]` — vrai de tout produit : appliquer, et signaler comme non-conformité.
> `[préférence]` — notre choix, pas une norme : proposer en le disant, jamais imposer dans un
> produit qui n'est pas le nôtre. `[non qualifié]` — statut pas encore tranché : **traiter comme
> une préférence** et remonter la question.
> Ce que ne couvre aucune règle ci-dessous : ne pas trancher, poser la question.

## Règles de design

- **[loi]** Le rôle d'une couleur et sa valeur sont deux décisions distinctes : les composants référencent le rôle, et la valeur vit dans une source unique dont elle peut changer entièrement sans qu'aucune règle d'usage bouge. `COLOR-R02`
- **[loi]** La palette se répartit en trois registres étanches — marque, sémantique, neutres — et chaque token appartient à un seul d'entre eux. `COLOR-R03`
- **[loi]** Une couleur ne change jamais de registre selon le contexte : un token de marque ne porte jamais un état, un token sémantique ne sert jamais de décor. `COLOR-R04`
- **[préférence]** Le registre marque se limite aux rôles fonctionnels existants : une teinte purement décorative ne reçoit pas de token. `COLOR-R05`
- **[préférence]** Chaque registre a son niveau d'expression — les couleurs sémantiques existent en couple texte/fond subtil, les neutres en échelle — et toute nouvelle valeur sémantique fournit son couple complet dès sa création. `COLOR-R06`
- **[loi]** Aucune information ne repose sur la couleur seule. `COLOR-R07`
- **[loi]** Chaque usage sémantique de la couleur déclare un canal redondant non chromatique — icône, mot ou forme — qui ne peut être retiré pour alléger. `COLOR-R08`
- **[loi]** Le texte courant atteint 4,5:1 avec son fond, et tout composant d'interface ou état requis pour l'identifier atteint 3:1 avec les couleurs adjacentes. `COLOR-R09`
- **[loi]** La conformité au contraste s'établit par paire et non par token isolé : chaque couleur de texte déclare les fonds sur lesquels elle est vérifiée. `COLOR-R10`
- **[préférence]** Les couples texte/fond des états de survol sont vérifiés au même seuil que l'état de repos, bien que la norme en exempte le survol. `COLOR-R11`
- **[préférence]** Le token de texte le plus faible est réservé aux métadonnées accessoires et n'est jamais employé pour du texte fonctionnel. `COLOR-R12`
- **[préférence]** Les états interactifs sont portés par des tokens dédiés et jamais calculés à la volée dans les composants. `COLOR-R13`
- **[préférence]** L'état désactivé n'a pas de tokens dédiés tant qu'aucun composant ne documente un état désactivé légitime ; le jour venu, le couple complet fond/texte/bordure est créé en une seule fois. `COLOR-R14`
- **[loi]** Dans un système à thèmes, un token de couleur résout une valeur par thème : l'architecture par tokens est la condition d'existence d'un second thème. `COLOR-R15`
- **[préférence]** Le mode sombre n'est pas couvert par décision explicite ; son adoption ajouterait une table de valeurs sans déplacer les rôles, et imposerait une re-vérification intégrale des seuils de contraste. `COLOR-R16`
- **[préférence]** La surface sombre de mise en avant est un panneau local sur page claire et ne constitue pas l'amorce d'un thème sombre ; son usage ne se généralise pas. `COLOR-R17`
- **[loi]** Deux textes garantis sur un même fond ne peuvent tous deux atteindre 4,5:1 que s'ils tombent du même côté de l'échelle de luminance. `COLOR-R18`
- **[loi]** Le rapport de contraste ne dépendant que de la luminance relative, teinter un neutre en conservant sa luminance ne modifie aucun rapport de contraste et reste sûr par construction. `COLOR-R19`
- **[préférence]** Le teintage d'un neutre s'opère en espace OKLCh — lightness figée, teinte cible posée — puis la luminance relative d'origine est recalée par dichotomie pour absorber la dérive de conversion. `COLOR-R20`
- **[loi]** En mode de couleurs forcées par le système, la palette est remplacée d'office et les fonds et ombres disparaissent : ce mode n'est jamais neutralisé, et l'interface s'appuie sur ce qui survit — sémantique, bordures, texte. `COLOR-R21`
- **[loi]** Du texte posé sur une image imprévisible ne garantit aucun contraste : il est soit adossé à un voile de contraste, soit sorti du média, jamais laissé nu. `COLOR-R22`
- **[préférence]** Le voile de contraste se calcule et ne s'ajuste pas à l'œil : le pixel le plus défavorable est échantillonné derrière chaque zone de texte, l'opacité minimale nécessaire est calculée pour atteindre 4,5:1, et le résultat est revérifié à plusieurs formats de viewport. `COLOR-R23`
- **[loi]** La couleur s'applique par rôle et jamais par valeur, et un rôle ne porte jamais deux sens. `COLOR-R25`

## Non couvert — poser la question, ne rien trancher

- Couleur désactivée (disabled) : Un contrôle est désactivé.
- Scrim / voile de superposition : Un fond s'assombrit derrière une modale.
- Couleur de sélection (texte surligné, item sélectionné) : Du texte ou un item est sélectionné.
- Texte sur photo/media : Du texte se pose sur une image imprévisible.
- Dataviz / graphiques : Une palette de graphiques.
- Mode sombre (dark mode) : L'interface passe en thème sombre.
- Contraste élevé forcé (forced-colors / high contrast) : L'OS force ses propres couleurs.
- Impression : Le contenu est imprimé.
- Sémantique divergente entre produits (rouge = danger vs solde négatif) : Un métier détourne le rouge.


---

---
sujet: elevation
nature: foundations
resume: "Ce fichier contient le raisonnement : ce que la profondeur *signifie*, quand le relief est un signal et quand il est du bruit."
selon-contexte: [alert, button, card, input, interaction, motion, surface, toast, typography]
source: ELEVATION-UX.md v2.0.0 + ELEVATION-UI.md v2.0.0
empreinte: sha256:bad4b5fa13aaf5c6
regles: {loi: 3, preference: 13, non_qualifie: 0}
---
# RULES — elevation (compilé, mode build)

> Extrait mécaniquement de la doctrine par `tools/compile-regles.py`. Ne pas éditer à la main.
>
> **Étiquettes.** `[loi]` — vrai de tout produit : appliquer, et signaler comme non-conformité.
> `[préférence]` — notre choix, pas une norme : proposer en le disant, jamais imposer dans un
> produit qui n'est pas le nôtre. `[non qualifié]` — statut pas encore tranché : **traiter comme
> une préférence** et remonter la question.
> Ce que ne couvre aucune règle ci-dessous : ne pas trancher, poser la question.

## Règles de design

- **[préférence]** L'élévation ne dit qu'une chose : à quelle couche du flux un élément appartient — à plat, soulevé mais dans le flux, ou au-dessus du flux. `ELEVATION-R02`
- **[préférence]** Un élément interactif doit porter un signifiant perceptible de sa nature ; ce système choisit le relief comme signifiant. `ELEVATION-R03`
- **[préférence]** Toute surface est classée dans l'une de trois natures — posé, creusé, plat — et cette classe détermine son relief. `ELEVATION-R04`
- **[préférence]** Un effet de relief qui ne répond à aucune question de matérialité fonctionnelle est décoratif et interdit. `ELEVATION-R05`
- **[loi]** L'ombrage suppose une source de lumière unique et venue du haut, la perception humaine interprétant toute ombre selon un a priori de lumière d'en haut. `ELEVATION-R07`
- **[préférence]** Un objet posé a trois états dans une seule métaphore : posé au repos, soulevé au survol, enfoncé à l'appui. `ELEVATION-R08`
- **[préférence]** En thème sombre les directions de la physique du relief sont conservées et seules les valeurs changent. `ELEVATION-R09`
- **[préférence]** Le repos d'une surface est à plat : l'élévation soulevée n'est accordée qu'au survol des surfaces cliquables. `ELEVATION-R10`
- **[préférence]** La mise en avant passe par le fond et non par l'ombre : élévation et fond contrasté ne se cumulent pas. `ELEVATION-R11`
- **[préférence]** L'échelle d'ombre compte exactement trois niveaux ; l'ombre interne d'enfoncement est un état, pas un palier. `ELEVATION-R12`
- **[préférence]** Les ombres sont teintées sur la couleur de texte primaire, jamais en noir pur, et se distinguent par leur portée plutôt que par leur seule opacité. `ELEVATION-R13`
- **[préférence]** Les ombres se remplacent instantanément et ne sont jamais interpolées ; seules les couleurs transitionnent. `ELEVATION-R14`
- **[préférence]** Un squelette de chargement ne porte jamais de relief : il occupe l'espace du contenu sans promettre d'interaction. `ELEVATION-R15`
- **[loi]** Aucune information ne repose sur la seule ombre ni sur le seul liseré : en mode de couleurs forcées les ombres sont supprimées et les fonds dégradés annulés. `ELEVATION-R16`
- **[loi]** Les valeurs d'élévation et de liseré appartiennent au thème : un thème les redéfinit comme il redéfinit ses couleurs de fond. `ELEVATION-R17`
- **[préférence]** Le relief dit la nature d'un élément et jamais son importance, qui passe par la place, le contraste et le nom. `ELEVATION-R19`

## Non couvert — poser la question, ne rien trancher

- Empilement de superpositions : Une modale contient un popover.
- Élévation pendant un drag : On soulève une carte pendant un glisser-déposer.
- Mode sombre : L'interface passe en sombre.
- z-index anarchique : Les z-index se battent sans échelle.


---

---
sujet: grid
nature: foundations
resume: "Ce fichier porte le raisonnement du **cadre de page** : quelle largeur maximale un conteneur doit"
selon-contexte: [collection]
source: GRID-UX.md v1.2.0 + GRID-UI.md v1.2.0
empreinte: sha256:87af549ad571e494
regles: {loi: 2, preference: 20, non_qualifie: 0}
---
# RULES — grid (compilé, mode build)

> Extrait mécaniquement de la doctrine par `tools/compile-regles.py`. Ne pas éditer à la main.
>
> **Étiquettes.** `[loi]` — vrai de tout produit : appliquer, et signaler comme non-conformité.
> `[préférence]` — notre choix, pas une norme : proposer en le disant, jamais imposer dans un
> produit qui n'est pas le nôtre. `[non qualifié]` — statut pas encore tranché : **traiter comme
> une préférence** et remonter la question.
> Ce que ne couvre aucune règle ci-dessous : ne pas trancher, poser la question.

## Règles de design

- **[préférence]** Tout conteneur de page borné tire sa largeur maximale d'un token de conteneur nommé, jamais d'une valeur brute ni d'un point de rupture détourné en largeur. `GRID-R01`
- **[préférence]** Un écran de saisie mono-colonne focalisée applique le cran de conteneur le plus étroit et se centre. `GRID-R02`
- **[préférence]** Une page de contenu ou d'application à colonne unique applique le cran de conteneur intermédiaire. `GRID-R03`
- **[préférence]** Une surface dense assumée applique le cran de conteneur le plus large, qui reste borné au lieu de suivre la fenêtre indéfiniment. `GRID-R04`
- **[préférence]** Un élément décoratif ou immersif peut délibérément déborder le conteneur, ce débordement étant déclaré comme une intention et non subi. `GRID-R05`
- **[préférence]** Le contenu lisible ou actionnable placé dans un bloc pleine largeur se re-borne sur un conteneur nommé et ne s'étale jamais d'un bord à l'autre. `GRID-R06`
- **[préférence]** Un conteneur borné se centre par marges automatiques symétriques dès que la fenêtre dépasse sa borne. `GRID-R07`
- **[préférence]** La marge entre le conteneur et le bord de la fenêtre est prise dans l'échelle d'espacement et n'introduit aucune valeur propre à la grille. `GRID-R08`
- **[préférence]** Un conteneur imbriqué dans un conteneur déjà borné hérite de la largeur du parent et n'applique ni seconde largeur maximale ni seconde marge de page. `GRID-R09`
- **[loi]** En dessous de sa borne, un conteneur occupe la largeur disponible moins la marge de page, et aucun contenu ne provoque de défilement horizontal à 320 px CSS de large. `GRID-R10`
- **[loi]** Le passage d'un régime de largeur à l'autre ne retire ni n'altère aucune information ni fonctionnalité, et ne restreint pas l'usage à une seule orientation. `GRID-R11`
- **[préférence]** Un shell applicatif se compose d'un rail de navigation, d'une colonne de contenu qui applique le cadre de page, et d'un rail d'outils secondaire. `GRID-R16`
- **[préférence]** Chaque rail tire sa largeur d'un token dédié à largeur fixe, la colonne de contenu prenant l'espace restant. `GRID-R17`
- **[préférence]** Quand la largeur se raréfie, les régions du shell quittent le flux dans l'ordre inverse de leur priorité, la colonne de contenu ne cédant jamais. `GRID-R18`

## Consignes d'implémentation

- **[préférence]** Un conteneur borné applique un token de largeur en largeur maximale et des marges logiques automatiques pour le centrage. `GRID-U01`
- **[préférence]** Le cran de conteneur se choisit sur le contexte fonctionnel documenté en couche UX, non sur l'espace disponible. `GRID-U02`
- **[préférence]** La marge entre le conteneur et le bord de la fenêtre est un remplissage horizontal pris dans l'échelle d'espacement. `GRID-U03`
- **[préférence]** En régime étroit, le conteneur occupe la pleine largeur moins la marge de page, la largeur maximale restant sans effet. `GRID-U04`
- **[préférence]** Un élément pleine largeur neutralise la largeur maximale et la marge de page, tandis que le contenu lisible qu'il abrite se re-borne sur un token de conteneur. `GRID-U05`
- **[préférence]** Chaque rail est un élément non flexible dont la base est un token de largeur de rail, la colonne de contenu étant le seul élément flexible. `GRID-U07`
- **[préférence]** Les seuils de bascule des régions du shell sont des tokens de point de rupture, jamais des largeurs en dur. `GRID-U08`
- **[préférence]** La marge de page s'applique dans la colonne de contenu, tandis que chaque rail porte son propre remplissage et n'hérite pas de la marge de page. `GRID-U10`


---

---
sujet: motion
nature: languages
resume: "Ce fichier contient le raisonnement : à quoi le mouvement sert, combien de temps il dure, qui il ne doit jamais gêner."
selon-contexte: [alert, border, button, card, color, form, iconography, input, performance, spacing]
source: MOTION-UX.md v1.3.2 + MOTION-UI.md v1.1.0
empreinte: sha256:33f45622086aea76
regles: {loi: 8, preference: 13, non_qualifie: 0}
---
# RULES — motion (compilé, mode build)

> Extrait mécaniquement de la doctrine par `tools/compile-regles.py`. Ne pas éditer à la main.
>
> **Étiquettes.** `[loi]` — vrai de tout produit : appliquer, et signaler comme non-conformité.
> `[préférence]` — notre choix, pas une norme : proposer en le disant, jamais imposer dans un
> produit qui n'est pas le nôtre. `[non qualifié]` — statut pas encore tranché : **traiter comme
> une préférence** et remonter la question.
> Ce que ne couvre aucune règle ci-dessous : ne pas trancher, poser la question.

## Règles de design

- **[préférence]** Un mouvement d'interface ne remplit que deux fonctions : confirmer qu'une action a été reçue (feedback, court et discret) ou relier deux états pour expliquer le changement (continuité, plus long mais jamais spectaculaire). `MOTION-R02`
- **[préférence]** Le registre du mouvement est productif et non expressif : aucun mouvement décoratif, d'ambiance, de célébration ou de marque, et toute exception se journalise. `MOTION-R04`
- **[loi]** Toute information portée par un mouvement doit exister aussi sans lui : sous forme textuelle ou programmatiquement déterminable, le mouvement n'étant qu'une confirmation sensorielle. `MOTION-R06`
- **[préférence]** L'amplitude du changement décide de la durée : petit changement, cran court ; continuité locale, cran médian ; grande surface, cran long. `MOTION-R07`
- **[loi]** Un feedback rendu en moins d'environ 100 ms est perçu comme instantané, et une transition d'interface qui dépasse environ 400 ms est perçue comme lente. `MOTION-R08`
- **[loi]** La sortie d'un élément est plus rapide que son entrée, ce qui part n'ayant plus besoin d'attention. `MOTION-R09`
- **[préférence]** Le mouvement ne verrouille jamais l'interaction : aucune action n'attend la fin d'une animation pour devenir disponible. `MOTION-R10`
- **[préférence]** Ce qui entre décélère, ce qui sort accélère, ce qui bouge sur place fait les deux — et le vocabulaire s'arrête à ces trois courbes. `MOTION-R11`
- **[préférence]** Aucun déplacement n'utilise une courbe linéaire ; le linéaire est réservé à la rotation continue d'un indicateur de chargement. `MOTION-R12`
- **[préférence]** Toute transition est interruptible et repart de la valeur courante : aucune file d'attente d'animations, aucun état d'attente de fin d'animation, aucun rejeu en double. `MOTION-R13`
- **[préférence]** L'indicateur de focus apparaît instantanément : il n'est jamais animé ni retardé, car il porte une information de position clavier et non un effet. `MOTION-R14`
- **[préférence]** Rien ne s'anime au chargement initial d'une page : les entrées animées sont réservées aux changements consécutifs à une action de l'utilisateur. `MOTION-R15`
- **[loi]** Le contenu ne se déplace jamais sans action de l'utilisateur : une insertion dynamique réserve son espace, ou à défaut s'insère hors du point de lecture. `MOTION-R16`
- **[préférence]** Les éléments qui réagissent ensemble s'animent ensemble : aucun décalage en cascade décoratif. `MOTION-R17`
- **[loi]** Sous prefers-reduced-motion: reduce, les déplacements, rotations et changements d'échelle sont supprimés ou remplacés ; les changements d'opacité et de couleur peuvent subsister, la préférence visant le mouvement spatial. `MOTION-R18`
- **[préférence]** Sous mouvement réduit, les bascules d'état sont instantanées ou en fondu, le chevron saute à son orientation finale, le squelette reste visible sans pulsation et l'indicateur de chargement cède la place à un rendu statique. `MOTION-R19`
- **[loi]** Une animation déclenchée par une interaction doit pouvoir être désactivée, et tout mouvement automatique qui dure plus de cinq secondes et se présente en parallèle d'autre contenu doit offrir un moyen de le mettre en pause, de l'arrêter ou de le masquer. `MOTION-R20`
- **[loi]** Aucune séquence ne flashe plus de trois fois par seconde, et aucune ne franchit les seuils de flash général ou de flash rouge. `MOTION-R21`
- **[préférence]** Le seul mouvement en boucle admis est l'indicateur de chargement, qui pulse en opacité douce ; aucun clignotement décoratif n'existe dans le système. `MOTION-R22`
- **[loi]** Les animations portent sur des propriétés composites — transform et opacity — et jamais sur des propriétés qui déclenchent le layout ou un repaint coûteux. `MOTION-R23`
- **[préférence]** Le mouvement est un commentaire et jamais le texte : il confirme, relie et occupe l'attente, mais n'informe pas seul, ne bloque pas et ne décore pas. `MOTION-R25`


---

---
sujet: spacing
nature: foundations
resume: "Ce fichier contient le raisonnement : proximité, hiérarchie de l'espace, échelle fermée, responsive."
selon-contexte: [adaptive, alert, button, card, collection, form, grid, input]
source: SPACING-UX.md v1.2.1 + SPACING-UI.md v1.2.0
empreinte: sha256:61797e752d89c081
regles: {loi: 7, preference: 13, non_qualifie: 0}
---
# RULES — spacing (compilé, mode build)

> Extrait mécaniquement de la doctrine par `tools/compile-regles.py`. Ne pas éditer à la main.
>
> **Étiquettes.** `[loi]` — vrai de tout produit : appliquer, et signaler comme non-conformité.
> `[préférence]` — notre choix, pas une norme : proposer en le disant, jamais imposer dans un
> produit qui n'est pas le nôtre. `[non qualifié]` — statut pas encore tranché : **traiter comme
> une préférence** et remonter la question.
> Ce que ne couvre aucune règle ci-dessous : ne pas trancher, poser la question.

## Règles de design

- **[loi]** Tout espacement du système est un multiple entier d'une unité de base unique. `SPACING-R04`
- **[loi]** L'échelle d'espacement est fermée : on choisit un cran existant sans inventer de valeur intermédiaire ; un besoin répété fait évoluer l'échelle, pas l'écran. `SPACING-R05`
- **[préférence]** Chez nous l'échelle est délibérément plus courte que celles des systèmes majeurs et ne s'allonge que sur un besoin réel journalisé. `SPACING-R06`
- **[loi]** L'espace encode la relation : plus deux éléments sont proches, plus leur lien est perçu comme fort, et cette proximité l'emporte sur les autres indices visuels de groupement. `SPACING-R07`
- **[loi]** La hiérarchie de proximité est monotone : l'écart entre éléments liés est inférieur à l'écart entre frères, lui-même inférieur à l'écart entre groupes. `SPACING-R08`
- **[loi]** L'espacement interne d'un composant est toujours inférieur ou égal à son espacement externe. `SPACING-R09`
- **[préférence]** La séparation entre deux groupes passe par un saut d'échelle franc et non par un cran adjacent. `SPACING-R10`
- **[préférence]** La séparation se fait d'abord par l'espace, ensuite par le fond, et en dernier recours seulement par un trait dessiné. `SPACING-R11`
- **[préférence]** L'empilement vertical est un usage de l'échelle existante et non une seconde échelle. `SPACING-R12`
- **[préférence]** Un titre est placé plus près de ce qu'il ouvre que de ce qu'il ferme : l'espace au-dessus dépasse l'espace au-dessous d'au moins un cran. `SPACING-R13`
- **[préférence]** Toute hauteur posée par le système s'exprime en multiples de la grille de base et s'y justifie. `SPACING-R14`
- **[préférence]** Les interlignes restent gouvernés par la lisibilité et non par la grille de base : aucun interligne n'est recalé sur la grille sans arbitrage explicite. `SPACING-R15`
- **[préférence]** La densité d'un composant est un décalage d'exactement un cran sur l'échelle commune, jamais une valeur propre. `SPACING-R16`
- **[préférence]** La densité modifie les espacements et jamais la structure : l'ordre des emplacements et la présence des éléments restent identiques. `SPACING-R17`
- **[loi]** Quand l'équilibre mathématique et l'équilibre perçu divergent, l'ajustement optique est légitime s'il reste local, n'est jamais promu en valeur d'échelle, et est commenté là où il vit. `SPACING-R18`
- **[préférence]** Le système ne définit que deux régimes de mise en page, mobile et desktop, séparés par un seuil unique. `SPACING-R19`
- **[préférence]** Les crans conservent la même valeur de part et d'autre du seuil responsive : ce qui change au mobile est la densité et la disposition, jamais la valeur des crans. `SPACING-R20`
- **[préférence]** L'espacement s'exprime en pixels et non en unités relatives au texte, la typographie restant seule à suivre l'agrandissement. `SPACING-R21`
- **[loi]** L'espace occupé par un élément ne dépend pas de son état : la place du contenu attendu ou différé est réservée dès la mise en page initiale. `SPACING-R22`
- **[préférence]** L'espace est un canal d'information et non un reste : ce que les distances disent d'une page doit être aussi vrai que ce qu'en dit le texte. `SPACING-R24`

## Non couvert — poser la question, ne rien trancher

- Alignement optique vs mathématique : Un élément paraît décentré malgré des px égaux.
- Contenu plus long que prévu : Le contenu déborde (traduction, titres longs).
- Tablette / intermédiaire : L'écran est intermédiaire.
- Zoom navigateur / rem : L'utilisateur zoome le texte.


---

---
sujet: touch
nature: foundations
resume: "Cette fondation ne porte pas une forme ni une couleur : elle porte une **contrainte de taille et"
selon-contexte: [button, laws]
source: TOUCH-UX.md v1.0.0 + TOUCH-UI.md v1.0.0
empreinte: sha256:99e9c9e5bf20a7fb
regles: {loi: 13, preference: 10, non_qualifie: 0}
---
# RULES — touch (compilé, mode build)

> Extrait mécaniquement de la doctrine par `tools/compile-regles.py`. Ne pas éditer à la main.
>
> **Étiquettes.** `[loi]` — vrai de tout produit : appliquer, et signaler comme non-conformité.
> `[préférence]` — notre choix, pas une norme : proposer en le disant, jamais imposer dans un
> produit qui n'est pas le nôtre. `[non qualifié]` — statut pas encore tranché : **traiter comme
> une préférence** et remonter la question.
> Ce que ne couvre aucune règle ci-dessous : ne pas trancher, poser la question.

## Règles de design

- **[loi]** Une interface tactile se conçoit pour un doigt imprécis, qui masque sa propre cible et ne survole pas, et non pour un curseur qui vise un pixel : cette différence se traduit en contraintes de taille, d'espacement et d'affordance, pas en ajustements esthétiques. `TOUCH-R01`
- **[loi]** La cible tactile est la région qui accepte l'action du pointeur, pas le dessin visible : réduire une icône ne réduit jamais la zone qui la reçoit. `TOUCH-R02`
- **[préférence]** Le système expose exactement trois crans de cible tactile — une taille confortable par défaut, un plancher absolu, un espacement minimal — et aucune autre valeur. `TOUCH-R03`
- **[préférence]** Toute cible vise par défaut la taille confortable ; descendre au plancher exige un besoin de densité réel et documenté, et n'est jamais permis sans respecter l'espacement minimal. `TOUCH-R04`
- **[loi]** Une cible ne peut descendre sous le plancher de 24 px CSS que si elle est prise dans le fil d'un texte (inline) ou si sa petitesse est essentielle à sa fonction. `TOUCH-R06`
- **[préférence]** Les exceptions au plancher se déclarent explicitement au cas par cas ; une cible sous le plancher sans exception déclarée est un défaut, pas un choix. `TOUCH-R07`
- **[préférence]** Chez nous, les actions primaires et fréquentes d'un parcours au doigt se placent dans la zone atteignable à une main (centre et bas d'écran), et le haut et les coins sont réservés aux actions peu fréquentes. `TOUCH-R08`
- **[loi]** Aucune cible tapable ne se place dans une zone réservée aux gestes système (balayage de bord, barre d'accueil, encoche) : ces régions appartiennent au système d'exploitation. `TOUCH-R09`
- **[loi]** Aucune information ni aucune action ne repose sur le seul survol : sous un pointeur incapable de survoler, la totalité des fonctions reste atteignable, l'appui tenant lieu de signal d'affordance. `TOUCH-R10`
- **[loi]** L'action se déclenche au relâchement sur la cible et jamais au premier contact ; glisser le doigt hors de la cible avant de lever annule l'action. `TOUCH-R11`
- **[loi]** Le retour haptique est un supplément facultatif et jamais un canal unique : il est absent de nombreux appareils et navigateurs et reste désactivable par l'utilisateur. `TOUCH-R12`
- **[loi]** Une cible reste atteignable et activable à 200 % d'agrandissement : ses dimensions dérivent de tokens qui suivent le zoom, jamais d'une valeur absolue figée. `TOUCH-R13`
- **[loi]** La taille confortable et l'espacement minimal sont des exigences d'accessibilité motrice — ils protègent les personnes dont la visée tremble ou manque de précision — et ne se négocient pas au nom de la densité visuelle. `TOUCH-R14`
- **[loi]** Toute cible tactile est également opérable au clavier, porte un indicateur de focus visible et expose un nom et un rôle accessibles : la taille de la cible ne remplace jamais sa sémantique. `TOUCH-R15`

## Consignes d'implémentation

- **[préférence]** Aucun composant ne code une taille de cible en dur : il référence l'un des trois tokens de cible tactile du système. `TOUCH-U01`
- **[préférence]** La cible se garantit par une hauteur et une largeur minimales déclarées, et non par la seule hauteur du contenu ou du padding. `TOUCH-U02`
- **[préférence]** La zone tactile peut déborder le dessin : le supplément se produit par padding ou par une zone étendue transparente, sans agrandir l'élément visible. `TOUCH-U03`
- **[préférence]** Le régime tactile se déclare par les requêtes de média de pointeur grossier et d'absence de survol : sur pointeur grossier la cible principale passe à la taille confortable et aucune affordance ne dépend du survol ; sur pointeur fin une densité plus serrée reste permise au-dessus du plancher. `TOUCH-U04`
- **[loi]** Deux cibles adjacentes sont séparées d'au moins l'espacement minimal ; lorsque la densité impose le plancher, cet espacement est obligatoire et non optionnel. `TOUCH-U05`
- **[loi]** L'action se lie à l'événement de relâchement et jamais à l'événement de contact ; un contrôle personnalisé qui agit au contact supprime l'issue de secours fournie nativement par un bouton ou un lien. `TOUCH-U06`
- **[préférence]** En mode de couleurs forcées, la cible conserve exactement sa taille : sa géométrie ne dépend d'aucun fond, d'aucune image et d'aucune ombre, qui sont supprimés dans ce mode. `TOUCH-U07`
- **[préférence]** Les tailles de cible s'expriment dans des unités qui suivent l'agrandissement du navigateur, de sorte qu'aucune cible ne rétrécit relativement au contenu agrandi. `TOUCH-U08`
- **[loi]** Un élément générique rendu interactif conserve la surface attendue d'un contrôle natif et expose un rôle, un nom et des états programmatiquement déterminables : la taille ne compense pas une sémantique manquante. `TOUCH-U09`


---

---
sujet: typography
nature: foundations
resume: "Ce fichier contient le raisonnement : hiérarchie, lisibilité, risques."
selon-contexte: [alert, button, card, form, input]
source: TYPOGRAPHY-UX.md v1.1.3 + TYPOGRAPHY-UI.md v1.1.0
empreinte: sha256:4b5768ddbbf4940c
regles: {loi: 15, preference: 16, non_qualifie: 0}
---
# RULES — typography (compilé, mode build)

> Extrait mécaniquement de la doctrine par `tools/compile-regles.py`. Ne pas éditer à la main.
>
> **Étiquettes.** `[loi]` — vrai de tout produit : appliquer, et signaler comme non-conformité.
> `[préférence]` — notre choix, pas une norme : proposer en le disant, jamais imposer dans un
> produit qui n'est pas le nôtre. `[non qualifié]` — statut pas encore tranché : **traiter comme
> une préférence** et remonter la question.
> Ce que ne couvre aucune règle ci-dessous : ne pas trancher, poser la question.

## Règles de design

- **[loi]** La typographie porte deux décisions séparées — la structure sémantique du contenu et les conditions physiques de lisibilité — et aucune des deux ne se prend à la place de l'autre. `TYPOGRAPHY-R03`
- **[loi]** Le niveau sémantique d'un texte et son traitement visuel se décident indépendamment l'un de l'autre. `TYPOGRAPHY-R04`
- **[loi]** Les niveaux de titre h1 à h6 décrivent la structure du contenu et ne sont jamais employés pour obtenir un effet de style. `TYPOGRAPHY-R05`
- **[loi]** Une page comporte un seul titre de niveau 1, qui est le titre du document. `TYPOGRAPHY-R06`
- **[loi]** Les niveaux de titre se suivent sans saut : un niveau n n'est jamais suivi directement d'un niveau n+2. `TYPOGRAPHY-R07`
- **[loi]** Le niveau d'un titre suit la structure du contenu et sa taille suit le design : un titre de niveau inférieur peut légitimement être rendu plus petit qu'un titre de niveau supérieur. `TYPOGRAPHY-R08`
- **[loi]** Un texte qui doit avoir l'apparence d'un titre sans en être un prend son style sur un élément non-titre. `TYPOGRAPHY-R09`
- **[préférence]** Les tailles de texte varient continûment entre une borne minimale et une borne maximale en fonction de la largeur du viewport, plutôt que par paliers. `TYPOGRAPHY-R10`
- **[loi]** Une taille de texte ne s'exprime jamais en unités viewport seules, qui ne répondent pas au zoom du navigateur et font échouer le critère de redimensionnement du texte. `TYPOGRAPHY-R11`
- **[préférence]** Toute taille fluide combine rem et vw dans clamp(), avec une composante rem dans le minimum, dans le maximum et dans la partie fixe de la valeur préférée. `TYPOGRAPHY-R12`
- **[préférence]** La conformité au redimensionnement du texte se vérifie par un test de zoom navigateur réel, et non par la seule forme de la formule ni par un redimensionnement de fenêtre. `TYPOGRAPHY-R13`
- **[préférence]** Le rapport entre la taille maximale et la taille minimale d'un même échelon typographique ne dépasse pas 2,5. `TYPOGRAPHY-R14`
- **[loi]** La longueur de ligne du texte courant est bornée, la lisibilité d'un paragraphe dépendant davantage de sa mesure que de sa taille. `TYPOGRAPHY-R15`
- **[préférence]** Le texte courant vise une longueur de ligne d'environ 45 à 75 caractères, bornée par une largeur maximale exprimée en unités ch et jamais en pixels. `TYPOGRAPHY-R16`
- **[préférence]** Une taille de texte fluide s'accompagne toujours d'une largeur maximale sur le bloc de texte, faute de quoi la mesure se dégrade sur grand écran. `TYPOGRAPHY-R17`
- **[loi]** Le texte courant est composé avec un interlignage d'au moins 1,5 fois le corps, et les grands corps peuvent recevoir un interlignage plus serré. `TYPOGRAPHY-R18`
- **[préférence]** L'interlignage n'est pas une constante du système : il se détermine en fonction du corps et de l'usage du texte. `TYPOGRAPHY-R19`
- **[loi]** La graisse n'est jamais le seul canal par lequel une hiérarchie de texte est exprimée. `TYPOGRAPHY-R20`
- **[loi]** La hiérarchie typographique se construit par combinaison du corps, de la graisse et de la position, un corps nettement supérieur pouvant dominer une graisse plus forte. `TYPOGRAPHY-R21`
- **[préférence]** Les graisses semi-grasses portent les titres et jamais le texte long, et aucune graisse plus fine que la graisse standard n'est employée sous le corps de texte courant. `TYPOGRAPHY-R22`
- **[préférence]** Le gras est réservé à l'information critique que le lecteur risque de manquer ; le gras et l'italique restent rares et ne se cumulent pas. `TYPOGRAPHY-R23`
- **[préférence]** Les titres sont rédigés en sentence case, décision prise une fois pour l'ensemble du produit. `TYPOGRAPHY-R24`
- **[préférence]** Les capitales sont réservées aux étiquettes brèves, jamais au texte courant, et s'accompagnent d'un interlettrage de 5 à 12 % du corps. `TYPOGRAPHY-R25`
- **[loi]** La casse haute s'applique par la feuille de style et jamais en saisissant le contenu en capitales, afin que le texte source reste dans sa casse d'origine. `TYPOGRAPHY-R26`
- **[préférence]** Le texte est aligné sur le bord de début de ligne par défaut, le retour à la ligne régulier servant de repère de lecture. `TYPOGRAPHY-R27`
- **[loi]** Le texte d'interface n'est jamais justifié. `TYPOGRAPHY-R28`
- **[préférence]** Le centrage est réservé aux titres courts et aux moments éditoriaux, jamais appliqué à un paragraphe. `TYPOGRAPHY-R29`
- **[préférence]** Le texte courant n'est jamais composé sous l'équivalent de 16 px, et sa taille s'exprime en unités relatives au corps racine. `TYPOGRAPHY-R30`
- **[préférence]** Les champs de saisie ne descendent jamais sous l'équivalent de 16 px, faute de quoi Safari iOS zoome automatiquement la page à la prise de focus. `TYPOGRAPHY-R31`
- **[préférence]** Quatre échelons de titres stylés suffisent en usage courant, la récurrence de niveaux 5 et 6 signalant une structure de contenu à réorganiser. `TYPOGRAPHY-R32`
- **[loi]** La structure appartient au contenu et l'apparence appartient au design : aucune des deux ne se déduit de l'autre. `TYPOGRAPHY-R34`

## Non couvert — poser la question, ne rien trancher

- Texte d'accroche / lead : Un premier paragraphe est mis en avant.
- Chiffres alignés (montants, tables) : Des nombres se comparent verticalement.
- Texte traduit (expansion ~30 %) : Le texte est traduit (allemand, finnois).
- Préférences utilisateur (reduced motion, contraste élevé) : L'utilisateur active un mode d'accessibilité.
- RTL / scripts non latins : La langue se lit de droite à gauche.
- Impression : Le contenu est imprimé.
