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
sujet: accordion
nature: components
resume: "Un **disclosure** : un en-tête révèle ou masque une région de contenu."
selon-contexte: [border, spacing]
source: ACCORDION-UX.md v1.0.0 + ACCORDION-UI.md v1.0.0
empreinte: sha256:380f17559719c5cc
regles: {loi: 5, preference: 3, non_qualifie: 0}
---
# RULES — accordion (compilé, mode build)

> Extrait mécaniquement de la doctrine par `tools/compile-regles.py`. Ne pas éditer à la main.
>
> **Étiquettes.** `[loi]` — vrai de tout produit : appliquer, et signaler comme non-conformité.
> `[préférence]` — notre choix, pas une norme : proposer en le disant, jamais imposer dans un
> produit qui n'est pas le nôtre. `[non qualifié]` — statut pas encore tranché : **traiter comme
> une préférence** et remonter la question.
> Ce que ne couvre aucune règle ci-dessous : ne pas trancher, poser la question.

## Règles de design

- **[loi]** Chaque section d'un accordéon est révélée ou masquée par un en-tête qui est un bouton ; le contenu replié n'est pas détruit et sa réouverture restitue l'état précédent. `ACCORDION-R01`
- **[préférence]** Plusieurs sections d'un accordéon peuvent être ouvertes simultanément ; la fermeture automatique des autres sections à l'ouverture d'une section est une option demandée explicitement, jamais le comportement par défaut. `ACCORDION-R02`
- **[loi]** L'en-tête d'une section est un bouton portant aria-expanded et aria-controls vers sa région, laquelle est nommée par cet en-tête ; lorsque les en-têtes structurent la page, le bouton est l'unique enfant d'un élément de titre de niveau cohérent, et Entrée comme Espace basculent l'état. `ACCORDION-R03`
- **[loi]** L'ouverture ou la fermeture d'une section ne déplace ni le focus ni le contenu déjà sous le pointeur : le focus reste sur l'en-tête activé, la tabulation entre et sort librement, et aucun piège de focus n'est posé. `ACCORDION-R04`
- **[loi]** L'état ouvert ou fermé d'une section se lit à un indicateur non chromatique — chevron orienté, signe plus ou moins — et jamais à la seule couleur. `ACCORDION-R05`
- **[loi]** Le dépliage et le repliage d'une section sont un mouvement sur place emprunté aux tokens de mouvement, et deviennent une bascule instantanée lorsque l'utilisateur a demandé moins de mouvement, sans jamais escamoter de contenu. `ACCORDION-R06`

## Consignes d'implémentation

- **[préférence]** L'en-tête d'accordéon résout son retrait, le rayon de son fond de survol et sa couleur de texte sur les tokens, et son chevron — icône en couleur courante — pivote à l'ouverture par transformation, aux durées et courbes des tokens de mouvement. `ACCORDION-U01`
- **[préférence]** La région ouverte prend son retrait dans l'échelle d'espacement, et la séparation entre deux sections passe d'abord par l'espace, le trait n'intervenant qu'en dernier recours. `ACCORDION-U02`

## Non couvert — poser la question, ne rien trancher

- Superposé (modal) : Un contenu qui recouvre et piège.


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
sujet: alert
nature: components
resume: "Ce fichier contient le raisonnement : tones, persistance, empilement, wording, risques."
selon-contexte: [button, consentement, emotion, form, input, interaction, motion, toast, typography, voice]
source: ALERT-UX.md v1.4.0 + ALERT-UI.md v1.4.0
empreinte: sha256:4d6bec19530fdfd5
regles: {loi: 18, preference: 44, non_qualifie: 0}
---
# RULES — alert (compilé, mode build)

> Extrait mécaniquement de la doctrine par `tools/compile-regles.py`. Ne pas éditer à la main.
>
> **Étiquettes.** `[loi]` — vrai de tout produit : appliquer, et signaler comme non-conformité.
> `[préférence]` — notre choix, pas une norme : proposer en le disant, jamais imposer dans un
> produit qui n'est pas le nôtre. `[non qualifié]` — statut pas encore tranché : **traiter comme
> une préférence** et remonter la question.
> Ce que ne couvre aucune règle ci-dessous : ne pas trancher, poser la question.

## Règles de design

- **[préférence]** Un alert porte l'un des quatre tones info, success, warning ou danger ; il n'existe pas de tone neutre, info étant le degré zéro de la gravité. `ALERT-R03`
- **[préférence]** Le registre de gravité maximale est nommé selon ce qu'il signifie pour chaque composant — danger pour l'alert, destructive pour le bouton, error pour l'input — sans terme unique imposé. `ALERT-R04`
- **[préférence]** L'alert n'expose aucune variante de taille : sa largeur est celle de son conteneur et sa hauteur celle de son contenu. `ALERT-R05`
- **[préférence]** La persistance d'un alert vaut permanent lorsque seule la fin de la condition met fin au message, et dismissible lorsque l'utilisateur peut le clore. `ALERT-R06`
- **[préférence]** L'alert est l'expression canonique de l'intention « comprendre un état » : il informe sur un état et ne propose jamais un geste. `ALERT-R12`
- **[loi]** Un alert sert à porter une information contextuelle que l'utilisateur doit voir sans avoir à la chercher. `ALERT-R13`
- **[préférence]** Le retour immédiat d'une action qui vient de réussir est porté par un toast plutôt que par un alert. `ALERT-R14`
- **[loi]** Une décision qui doit bloquer l'utilisateur est portée par un dialogue d'alerte, jamais par un alert. `ALERT-R15`
- **[loi]** Un alert ne porte jamais de contenu promotionnel. `ALERT-R16`
- **[loi]** Le degré d'interruption se choisit sur l'urgence réelle du message selon l'échelle croissante alert, toast, modale. `ALERT-R17`
- **[loi]** Une erreur portant sur un seul champ est rendue par le message inline de ce champ ; l'alert n'intervient que lorsque l'information dépasse l'élément. `ALERT-R18`
- **[préférence]** Les quatre tones de l'alert sont la projection sur ce composant de l'axe état-émotionnel de la voix : le ton du texte se déduit du tone du conteneur. `ALERT-R19`
- **[préférence]** Le tone info informe sans alarmer : état du système, précision utile, nouveauté factuelle. `ALERT-R20`
- **[préférence]** Seul le tone info se justifie pour un contenu purement proactif sans risque associé. `ALERT-R21`
- **[loi]** Une information qui n'a pas besoin d'être remarquée est intégrée au contenu courant plutôt que placée dans un alert. `ALERT-R22`
- **[préférence]** Le tone success s'emploie pour confirmer durablement un état acquis dont la confirmation doit rester consultable. `ALERT-R23`
- **[préférence]** Un succès qui n'est qu'un retour d'action relève du toast et non de l'alert. `ALERT-R24`
- **[préférence]** Le tone warning signale une condition qui mérite attention avant d'agir, sans qu'aucune erreur ne soit encore commise. `ALERT-R25`
- **[préférence]** Un warning énonce ce qu'il faut faire ou surveiller, et pas seulement qu'une attention est requise. `ALERT-R26`
- **[préférence]** Le tone danger signale qu'une condition grave est déjà vraie, erreur constatée ou état critique persistant. `ALERT-R27`
- **[préférence]** Le tone danger reste rare : plusieurs alerts danger simultanés signalent un défaut d'architecture de l'information. `ALERT-R28`
- **[loi]** Un alert danger énonce ce qui se passe, pourquoi, et comment en sortir. `ALERT-R29`
- **[préférence]** Le message d'un alert décrit l'écart et la sortie sans jamais qualifier ni accuser l'utilisateur. `ALERT-R30`
- **[préférence]** Un alert permanent vit aussi longtemps que sa condition et ne peut pas être fermé par l'utilisateur. `ALERT-R31`
- **[préférence]** La persistance permanente est réservée aux messages proactifs chargés avec la page et aux conditions qui doivent être résolues. `ALERT-R32`
- **[loi]** La résolution d'une condition consécutive à une action de l'utilisateur est annoncée par un message qui prend le relais, et non par la seule disparition de l'alert. `ALERT-R33`
- **[préférence]** Un mot porte toujours l'information de résolution : la disparition visuelle et le changement de couleur ne sont jamais les seuls canaux. `ALERT-R34`
- **[préférence]** Un alert qui n'est ni bloquant ni critique est fermable par l'utilisateur. `ALERT-R35`
- **[loi]** Le contrôle de fermeture d'un alert est un bouton focusable, doté d'un nom accessible et d'une cible de taille suffisante. `ALERT-R36`
- **[préférence]** La fermeture d'un alert est mémorisée au moins pour la durée de la session, et durablement pour les annonces ponctuelles. `ALERT-R37`
- **[préférence]** Un alert fermé peut réapparaître si sa condition redevient vraie ou s'aggrave : il s'agit alors d'un nouveau message. `ALERT-R38`
- **[préférence]** Toutes les combinaisons de tone et de persistance sont possibles, mais info-dismissible et danger-permanent sont les régimes nominaux et les autres demandent une justification. `ALERT-R39`
- **[préférence]** L'ordre de composition d'un alert est icône, titre, corps, actions, la croix de fermeture venant au coin opposé au sens de lecture. `ALERT-R40`
- **[loi]** Chaque tone est porté par une icône propre, constante dans tout le produit, en plus de sa couleur. `ALERT-R41`
- **[loi]** L'icône de tone est un canal d'information redondant et ne peut pas être retirée pour alléger le rendu. `ALERT-R42`
- **[loi]** Les tones se distinguent par des formes d'icône différentes, et pas seulement par des couleurs différentes. `ALERT-R43`
- **[préférence]** Le titre d'un alert énonce le message en une ligne et porte le contenu, pas la catégorie. `ALERT-R44`
- **[préférence]** Le corps d'un alert énonce le pourquoi et le moyen de corriger ; il est facultatif quand le titre suffit. `ALERT-R45`
- **[préférence]** Le corps d'un alert tient en une à deux phrases ; au-delà, l'information est liée plutôt qu'entassée. `ALERT-R46`
- **[préférence]** Un alert met en avant une seule action ; une seconde n'est tolérée que sous forme de lien discret. `ALERT-R47`
- **[préférence]** Le tone d'un alert décrit la condition et ne détermine pas le tone du bouton qu'il contient, lequel décrit l'action. `ALERT-R49`
- **[préférence]** Un alert permanent ne présente jamais de croix de fermeture. `ALERT-R50`
- **[préférence]** Un seul alert est affiché par niveau de conteneur ; au-delà, les messages sont agrégés en un seul. `ALERT-R51`
- **[préférence]** Lorsque plusieurs alerts cohabitent, ils sont ordonnés par gravité décroissante et jamais par ordre d'arrivée. `ALERT-R52`
- **[préférence]** Un alert unique agrégeant plusieurs conditions est préféré à une pile d'alerts. `ALERT-R53`
- **[loi]** Un alert présent au chargement de la page est du contenu ordinaire : il ne porte pas de région live et ne fait pas l'objet d'une annonce spéciale. `ALERT-R54`
- **[loi]** Un alert inséré après une action est annoncé aux technologies d'assistance par une région live, role=alert pour les messages critiques et role=status pour les messages advisoires. `ALERT-R55`
- **[préférence]** L'insertion d'un alert ne doit pas déplacer le contenu situé sous le point de lecture courant. `ALERT-R56`
- **[préférence]** L'apparition d'un alert réactif se joue en opacité seule, sans translation, et sa disparition prend le cran de durée inférieur à son apparition. `ALERT-R57`
- **[préférence]** Un alert chargé avec la page ne s'anime pas. `ALERT-R58`
- **[préférence]** L'apparition en opacité d'un alert est conservée telle quelle sous mouvement réduit, faute de mouvement spatial à supprimer. `ALERT-R59`
- **[loi]** Le conteneur d'un alert n'est ni focusable ni cliquable et ne porte aucun état de survol ou de focus ; seuls ses enfants interactifs en portent. `ALERT-R61`
- **[loi]** Un signal sonore d'alerte double toujours un message textuel et visuel et ne porte jamais seul l'information. `ALERT-R62`
- **[préférence]** L'alert n'active aucun instrument expressif : sa chorégraphie et son wording restent dans le registre productif. `ALERT-R63`
- **[préférence]** Le porteur d'un problème et le porteur de sa résolution sont deux composants distincts : l'alert porte le problème, un message de succès ou un toast porte la récupération. `ALERT-R64`
- **[préférence]** Aucune exception de ton chaleureux ne s'applique aux alerts de tone danger ou warning. `ALERT-R65`
- **[loi]** Un alert de portée page est placé en tête du contenu, sur toute sa largeur, avant ce qu'il conditionne. `ALERT-R66`
- **[préférence]** La position de tête de page est réservée aux conditions qui affectent la page entière. `ALERT-R67`
- **[préférence]** Un alert de portée section se place sous le titre de la section concernée et en épouse la largeur. `ALERT-R68`
- **[préférence]** Dans une modale, l'alert se place au-dessus des champs ou boutons concernés et n'y prend jamais la portée d'un alert de page. `ALERT-R69`
- **[préférence]** Un alert peut se placer immédiatement au-dessus d'un contrôle précis lorsque la condition ne concerne que ce geste. `ALERT-R70`
- **[loi]** Le degré d'interruption d'un message est proportionnel à l'urgence réelle de ce message, jamais à la visibilité souhaitée par son émetteur. `ALERT-R74`

## Non couvert — poser la question, ne rien trancher

- Feedback immédiat d'action ("Enregistré ✓") : Le retour est réactif et de vie courte.
- Alerte bloquante exigeant une décision : L'utilisateur ne doit pas pouvoir continuer.
- Bannière de consentement (cookies) : Un consentement réglementaire est requis.
- Contenu promotionnel / upsell : On veut pousser du marketing dans le flux.
- Bannière globale multi-pages (système entier) : Le message persiste à travers la navigation.
- Dans une collection (alert entre les cartes) : Un message s'insère dans une grille ou une liste.
- Contenu de l'alert mis à jour en place : Le contenu change sans re-création.
- Auto-dismiss temporisé : Le message disparaît seul après quelques secondes.
- RTL (lecture droite-gauche) : La langue se lit de droite à gauche.
- Reduced motion : L'utilisateur limite les animations.
- Contenu long (paragraphe+) : Le message dépasse deux phrases.
- Sans icône : On envisage de porter le tone par la seule couleur.


---

---
sujet: border
nature: foundations
resume: "Ce fichier contient le raisonnement : les rôles du trait, le critère délimitant/décoratif, le focus ring."
selon-contexte: [alert, button, card, color, input, motion, overlay, radius, spacing]
source: BORDER-UX.md v1.3.0 + BORDER-UI.md v1.3.0
empreinte: sha256:f2f5033a84470302
regles: {loi: 8, preference: 14, non_qualifie: 0}
---
# RULES — border (compilé, mode build)

> Extrait mécaniquement de la doctrine par `tools/compile-regles.py`. Ne pas éditer à la main.
>
> **Étiquettes.** `[loi]` — vrai de tout produit : appliquer, et signaler comme non-conformité.
> `[préférence]` — notre choix, pas une norme : proposer en le disant, jamais imposer dans un
> produit qui n'est pas le nôtre. `[non qualifié]` — statut pas encore tranché : **traiter comme
> une préférence** et remonter la question.
> Ce que ne couvre aucune règle ci-dessous : ne pas trancher, poser la question.

## Règles de design

- **[loi]** Un trait doit avoir un rôle explicite — délimiter un élément interactif, grouper du contenu ou séparer deux zones. Le rôle décide de sa couleur et du contraste exigé. `BORDER-R02`
- **[loi]** Si un élément n'est identifiable que par sa bordure, cette bordure doit atteindre un contraste de 3:1 avec son fond. `BORDER-R03`
- **[préférence]** Nous utilisons une seule épaisseur de trait, 1px, partout. `BORDER-R04`
- **[préférence]** Nous ne changeons jamais l'épaisseur d'un trait pour signaler un état : la couleur s'en charge, et le contenu ne bouge pas. `BORDER-R05`
- **[préférence]** Notre anneau de focus est le même partout : une couleur, une largeur, un écart, définis une seule fois. `BORDER-R06`
- **[préférence]** Chez nous, l'anneau de focus s'ajoute à la bordure existante plutôt que de la remplacer — les deux restent lisibles ensemble. `BORDER-R07`
- **[loi]** L'indicateur de focus ne doit jamais être supprimé sans un remplacement au moins aussi visible. `BORDER-R08`
- **[loi]** L'élément qui a le focus ne doit jamais être masqué, même en partie, par un en-tête collant ou un élément superposé. `BORDER-R09`
- **[préférence]** Chez nous, l'anneau de focus apparaît instantanément, sans animation. `BORDER-R10`
- **[préférence]** Notre anneau est d'une seule couleur : sur un fond imprévisible il peut se fondre, et nous ne traitons pas encore ce cas. `BORDER-R11`
- **[loi]** Une information portée par un fond ou une ombre disparaît en mode contraste forcé ; le trait, lui, survit — c'est sur lui qu'il faut compter. `BORDER-R12`
- **[préférence]** Le trait reste à 1px CSS, y compris sur écran haute densité. `BORDER-R13`
- **[préférence]** Les changements de couleur d'un trait s'animent ; l'apparition de l'anneau de focus, jamais. `BORDER-R14`
- **[loi]** Un même gris n'a pas le même statut selon qu'il délimite, groupe ou sépare : c'est l'usage qui décide, pas la valeur. `BORDER-R16`

## Consignes d'implémentation

- **[préférence]** Le code applique 1px à tous les traits ; un état change la couleur, jamais l'épaisseur. `BORDER-U01`
- **[préférence]** L'anneau de focus se pose en `outline` avec un décalage extérieur, jamais en `border`. `BORDER-U02`
- **[préférence]** Le rayon de l'anneau suit celui du composant, augmenté du décalage. `BORDER-U03`
- **[préférence]** L'anneau apparaît sans transition. `BORDER-U04`
- **[loi]** Utiliser `:focus-visible` plutôt que `:focus`. `BORDER-U05`
- **[loi]** Ne jamais écrire `outline: none` sur un élément atteignable au clavier sans un remplacement équivalent. `BORDER-U06`
- **[préférence]** Exception : un élément focalisable uniquement par script (`tabindex="-1"`) ne porte pas d'anneau. `BORDER-U07`
- **[préférence]** Le contraste des bordures est vérifié automatiquement à la génération. `BORDER-U08`

## Non couvert — poser la question, ne rien trancher

- Style de trait (dashed, dotted) : Une zone de dépôt appelle un trait pointillé.


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
sujet: consentement
nature: flows
resume: "Ce fichier n'est ni un composant ni un pattern d'écran."
selon-contexte: [alert, border, button, color, creation-compte, form, grid, modal, navigation, overlay, performance, radius, spacing]
source: CONSENTEMENT-UX.md v1.1.0 + CONSENTEMENT-UI.md v1.1.0
empreinte: sha256:d2aa2aa1b3ff3be1
regles: {loi: 11, preference: 8, non_qualifie: 0}
---
# RULES — consentement (compilé, mode build)

> Extrait mécaniquement de la doctrine par `tools/compile-regles.py`. Ne pas éditer à la main.
>
> **Étiquettes.** `[loi]` — vrai de tout produit : appliquer, et signaler comme non-conformité.
> `[préférence]` — notre choix, pas une norme : proposer en le disant, jamais imposer dans un
> produit qui n'est pas le nôtre. `[non qualifié]` — statut pas encore tranché : **traiter comme
> une préférence** et remonter la question.
> Ce que ne couvre aucune règle ci-dessous : ne pas trancher, poser la question.

## Règles de design

- **[loi]** Un bandeau de consentement ne s'affiche que si le site dépose au moins un traceur soumis à consentement ; l'inventaire des stockages doit être établi avant de concevoir le bandeau. `CONSENTEMENT-R03`
- **[loi]** Si le texte du bandeau affirme que le site n'utilise que des traceurs strictement nécessaires, et que l'inventaire le confirme, le bandeau est signalé comme sans objet. `CONSENTEMENT-R05`
- **[loi]** Chaque issue proposée doit produire un effet observable et différent ; un choix sans conséquence ne doit pas être présenté comme un choix. `CONSENTEMENT-R06`
- **[loi]** Le refus doit être atteignable en autant d'actions que l'acceptation, au même niveau de l'interface. `CONSENTEMENT-R07`
- **[loi]** Les boutons d'acceptation et de refus doivent avoir un traitement visuel strictement identique. `CONSENTEMENT-R08`
- **[loi]** L'absence d'action ne doit jamais être interprétée comme un consentement ; l'état par défaut est le refus. `CONSENTEMENT-R09`
- **[préférence]** Chez nous, les libellés des deux actions nomment la catégorie de traceurs concernée plutôt que d'exprimer un assentiment général. `CONSENTEMENT-R10`
- **[préférence]** Chez nous, aucun contenu n'est bloqué tant que le visiteur n'a pas répondu au bandeau. `CONSENTEMENT-R11`
- **[loi]** Le bandeau de consentement ne doit pas être fixé à l'écran, afin de ne jamais recouvrir un élément focalisé. `CONSENTEMENT-R12`
- **[préférence]** Placer le bandeau en tout premier dans le corps du document, avant le lien d'évitement. `CONSENTEMENT-R13`
- **[préférence]** Chez nous, le choix exprimé est conservé six mois, sans nouvelle sollicitation pendant cette durée, refus compris. `CONSENTEMENT-R14`
- **[préférence]** Après le choix, afficher un message de confirmation en lieu et place du bandeau, énonçant le choix retenu et offrant un lien pour le modifier ainsi qu'un bouton de fermeture. `CONSENTEMENT-R15`
- **[loi]** Un point d'accès permanent, présent sur toutes les pages, doit permettre de modifier ou retirer le choix exprimé. `CONSENTEMENT-R16`

## Consignes d'implémentation

- **[préférence]** Chez nous, le bandeau de consentement n'introduit aucun token propre et réutilise intégralement ceux d'alerte, de bouton, de couleur et d'espacement. `CONSENTEMENT-UI-R01`
- **[loi]** Les boutons d'acceptation et de refus doivent référencer le même token de style de bouton. `CONSENTEMENT-UI-R02`
- **[préférence]** Chez nous, les deux actions du bandeau sont rendues en style `ghost` par défaut. `CONSENTEMENT-UI-R03`
- **[loi]** Le bandeau ne consomme aucun token de superposition et n'est jamais fixé à l'écran. `CONSENTEMENT-UI-R04`
- **[loi]** Les seuils de contraste habituels s'appliquent sans dérogation au bandeau de consentement. `CONSENTEMENT-UI-R05`
- **[préférence]** Chez nous, le bandeau apparaît par une transition d'opacité courte, sans déplacement, et ses actions sont immédiatement activables. `CONSENTEMENT-UI-R06`


---

---
sujet: creation-compte
nature: flows
resume: "Ce fichier n'est ni un composant (BUTTON-UX, INPUT-UX) ni un pattern (FORM-UX) — c'est un **flow**, un parcours nommé de bout en bout."
selon-contexte: [alert, button, emotion, form, input, interaction, laws, motion, voice]
source: CREATION-COMPTE-UX.md v1.3.3
empreinte: sha256:d056b46924bcd6fe
regles: {loi: 28, preference: 29, non_qualifie: 0}
---
# RULES — creation-compte (compilé, mode build)

> Extrait mécaniquement de la doctrine par `tools/compile-regles.py`. Ne pas éditer à la main.
>
> **Étiquettes.** `[loi]` — vrai de tout produit : appliquer, et signaler comme non-conformité.
> `[préférence]` — notre choix, pas une norme : proposer en le disant, jamais imposer dans un
> produit qui n'est pas le nôtre. `[non qualifié]` — statut pas encore tranché : **traiter comme
> une préférence** et remonter la question.
> Ce que ne couvre aucune règle ci-dessous : ne pas trancher, poser la question.

## Règles de design

- **[préférence]** Le design system ne crée aucun token dédié à ce flow : ses états sont rendus uniquement par les composants qu'il coordonne. `CREATION-COMPTE-R02`
- **[loi]** Un parcours d'inscription doit se limiter au strict minimum nécessaire pour créer le compte et reporter le reste après la première valeur perçue. `CREATION-COMPTE-R03`
- **[préférence]** Nous découpons le parcours d'inscription en quatre moments au maximum, dont deux conditionnels. `CREATION-COMPTE-R05`
- **[préférence]** Nous limitons le nombre d'étapes d'inscription au strict nécessaire : pour la plupart des produits grand public, un seul écran suffit. `CREATION-COMPTE-R06`
- **[loi]** Le parcours d'inscription ne doit jamais redemander une information déjà obtenue à une étape précédente ou via un fournisseur tiers. `CREATION-COMPTE-R07`
- **[préférence]** Nous considérons qu'un compte n'a besoin, pour exister, que d'un identifiant et d'un moyen d'authentification ; le reste est du profil. `CREATION-COMPTE-R08`
- **[préférence]** Nous ne demandons pas nom, entreprise, téléphone ou cas d'usage à l'inscription, sauf si le compte serait inutilisable sans. `CREATION-COMPTE-R09`
- **[loi]** Un produit ne doit pas exiger la création d'un compte avant d'avoir montré une valeur, quand un accès invité ou un essai est possible. `CREATION-COMPTE-R10`
- **[préférence]** Nous présentons toutes les méthodes d'inscription à poids visuel comparable, sans en déguiser une en défaut ni en reléguer une en lien minuscule. `CREATION-COMPTE-R11`
- **[loi]** Deux comptes ne doivent jamais être rapprochés sur la seule ressemblance de leurs adresses e-mail ; une preuve de contrôle est requise. `CREATION-COMPTE-R12`
- **[préférence]** Nous limitons les fournisseurs tiers proposés aux options réellement pertinentes pour l'audience, plutôt qu'une liste exhaustive de logos. `CREATION-COMPTE-R13`
- **[loi]** Un formulaire d'inscription ne doit comporter qu'un seul champ mot de passe, avec bascule d'affichage, jamais de champ de confirmation. `CREATION-COMPTE-R14`
- **[loi]** Le collage et les gestionnaires de mots de passe doivent être autorisés sur le champ mot de passe et sur les codes de vérification. `CREATION-COMPTE-R15`
- **[loi]** Les contraintes du mot de passe doivent être annoncées avant la saisie, jamais révélées seulement après un envoi refusé. `CREATION-COMPTE-R16`
- **[loi]** L'inscription ne doit jamais imposer de test cognitif bloquant ; un anti-robot éventuel doit offrir une alternative accessible. `CREATION-COMPTE-R17`
- **[loi]** Un compte dont l'e-mail établit l'identité ou sert à la récupération ne doit être actif qu'après vérification de cet e-mail. `CREATION-COMPTE-R18`
- **[préférence]** Nous ne terminons jamais une inscription réussie sur une impasse : la personne est déposée devant un premier pas concret dans le produit. `CREATION-COMPTE-R19`
- **[préférence]** Nous n'empilons pas, juste après la création du compte, tous les écrans de profil qu'on a reportés à l'inscription. `CREATION-COMPTE-R20`
- **[préférence]** Nous confirmons la création de compte par un message de succès discret, avec un ton légèrement plus chaleureux qu'ailleurs dans le parcours. `CREATION-COMPTE-R21`
- **[loi]** Un même rôle d'interface doit garder les mêmes signaux visuels d'un écran à l'autre du parcours d'inscription. `CREATION-COMPTE-R23`
- **[préférence]** Nous distinguons toujours l'action de progresser dans le parcours (un bouton) de celle d'en sortir (un lien), sans jamais les confondre. `CREATION-COMPTE-R24`
- **[préférence]** Nous limitons les transitions entre écrans du parcours d'inscription à un registre sobre (fade / fade through), sans motif expressif. `CREATION-COMPTE-R26`
- **[préférence]** Nous faisons porter l'annonce d'un changement d'écran par le déplacement du focus ; l'animation l'accompagne sans la remplacer ni la doubler. `CREATION-COMPTE-R27`
- **[loi]** Sous la préférence de mouvement réduit, les transitions doivent être instantanées, et le premier écran ne doit jamais s'animer à son chargement. `CREATION-COMPTE-R28`
- **[préférence]** Nous associons à chaque état du parcours (attente, erreur, atterrissage) un ton défini : rassurant, sans blâme, ou encourageant selon le moment. `CREATION-COMPTE-R29`
- **[préférence]** Nous réservons le seul réchauffement de ton du parcours au moment de l'atterrissage ; partout ailleurs, le ton reste sobre, jamais exubérant. `CREATION-COMPTE-R30`
- **[préférence]** Nous réservons un seul moment expressif à tout le parcours d'inscription : l'atterrissage, au moment où le compte est créé. `CREATION-COMPTE-R31`
- **[préférence]** Nous avons choisi une anatomie sobre pour l'animation de l'atterrissage : un glyphe qui se dessine, sans rebond, jouée une seule fois. `CREATION-COMPTE-R32`
- **[préférence]** Nous faisons porter le moment expressif de l'atterrissage par le message de confirmation (alert ou toast succès), pas par un élément propre au flow. `CREATION-COMPTE-R33`
- **[loi]** L'état « compte créé » doit rester lisible dans le contenu statique et l'ARIA indépendamment de toute animation, qui ne fait que l'accompagner. `CREATION-COMPTE-R34`
- **[préférence]** Nous limitons le parcours d'inscription à un seul moment de célébration animée, jamais un enchaînement de célébrations à chaque étape. `CREATION-COMPTE-R35`
- **[loi]** Le design de l'inscription doit garantir la sécurité perçue (mot de passe masqué par défaut, gestionnaires non bloqués, pas de confirmation d'adresses enregistrées), pas la sécurité serveur. `CREATION-COMPTE-R36`
- **[préférence]** Nous exigeons que chaque friction du parcours d'inscription (champ, étape, vérification) soit justifiée par une valeur ou un risque réels, jamais par habitude. `CREATION-COMPTE-R38`
- **[loi]** Un compte dont l'e-mail établit l'identité ou la récupération doit être vérifié avant activation ; un accès provisoire suppose un périmètre à faible risque explicitement borné. `CREATION-COMPTE-R39`
- **[préférence]** Nous affichons l'attente de vérification d'e-mail par un message d'information persistant et non bloquant, pas par une modale récurrente. `CREATION-COMPTE-R40`
- **[préférence]** Nous proposons toujours de renvoyer le lien ou le code de vérification, avec un anti-spam honnête et un moyen de corriger l'adresse e-mail saisie. `CREATION-COMPTE-R41`
- **[loi]** L'écran atteint après expiration d'un lien de vérification doit proposer un renvoi immédiat sans redemander l'adresse e-mail. `CREATION-COMPTE-R42`
- **[préférence]** Nous ramenons la personne, après vérification réussie de son e-mail, là où elle allait plutôt que sur une page morte « e-mail vérifié ». `CREATION-COMPTE-R43`
- **[préférence]** Nous affichons les fournisseurs tiers d'inscription à poids visuel égal entre eux et comparable à l'option e-mail. `CREATION-COMPTE-R44`
- **[loi]** Un compte créé par SSO ne doit jamais fusionner automatiquement avec un compte e-mail existant sur la seule correspondance d'adresse. `CREATION-COMPTE-R45`
- **[préférence]** Nous ne demandons aux fournisseurs SSO que le minimum (identité et e-mail vérifié), jamais des périmètres d'accès larges par précaution. `CREATION-COMPTE-R46`
- **[préférence]** Nous gérons explicitement l'échec ou l'annulation d'une connexion SSO en ramenant la personne à l'écran de méthode, avec un message neutre. `CREATION-COMPTE-R47`
- **[loi]** Un e-mail rendu déjà vérifié par un fournisseur de confiance ne doit pas relancer le parcours de vérification d'e-mail. `CREATION-COMPTE-R48`
- **[loi]** Le mot de passe doit privilégier la longueur sur la complexité : au moins 15 caractères en facteur unique (8 avec MFA), 64 acceptés, sans composition ni expiration forcées. `CREATION-COMPTE-R49`
- **[loi]** Un mot de passe compromis ou évident (fuite connue, égal à l'e-mail, suite triviale) doit être refusé via une blocklist. `CREATION-COMPTE-R50`
- **[préférence]** Nous n'affichons un indicateur de force du mot de passe que s'il reflète une mesure réelle, mise à jour après une pause, jamais à chaque touche. `CREATION-COMPTE-R51`
- **[loi]** Le champ mot de passe d'inscription doit annoncer ses contraintes avant la saisie, autoriser collage et gestionnaires, offrir une bascule, sans champ de confirmation. `CREATION-COMPTE-R52`
- **[loi]** Un e-mail déjà utilisé doit ouvrir un chemin vers la connexion ou la récupération, sans renvoyer la personne au début ni effacer sa saisie. `CREATION-COMPTE-R53`
- **[préférence]** Nous demandons au produit d'arbitrer explicitement, une fois pour toutes, entre une posture ouverte ou neutre face à un e-mail déjà utilisé. `CREATION-COMPTE-R54`
- **[préférence]** Tant que le produit n'a pas tranché la posture sur « e-mail déjà utilisé », nous appliquons par défaut la posture neutre et remontons la décision. `CREATION-COMPTE-R55`
- **[loi]** En posture neutre, la disponibilité d'un e-mail ne doit jamais être révélée en direct pendant la frappe, seulement à la soumission, côté serveur. `CREATION-COMPTE-R56`
- **[loi]** L'accès au produit ne doit jamais dépendre d'un consentement marketing distinct de l'acceptation des CGU. `CREATION-COMPTE-R57`
- **[loi]** Aucune case de consentement ne doit être pré-cochée, et chaque finalité doit avoir sa propre case, jamais un « tout accepter » qui les regroupe. `CREATION-COMPTE-R58`
- **[loi]** Une case de consentement facultative (marketing) ne doit pas être mise en avant visuellement par rapport aux autres éléments du formulaire. `CREATION-COMPTE-R59`
- **[loi]** L'accès aux CGU et à la politique de confidentialité doit être visible avant le point de décision de l'inscription, pas seulement en pied de page. `CREATION-COMPTE-R60`
- **[loi]** La politique de confidentialité doit se présenter comme une information consultable, jamais comme un objet qu'on « accepte » avec les CGU. `CREATION-COMPTE-R61`
- **[loi]** Une vérification d'âge minimum, si elle est requise, doit se faire par simple déclaration, sans interrogatoire, et sans stocker plus de données que nécessaire. `CREATION-COMPTE-R62`

## Non couvert — poser la question, ne rien trancher

- Âge minimum selon le contexte : Vérifier un âge plancher quand la loi l'exige.
- Suppression / correction après une erreur : Annuler ou corriger après un faux départ.


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
sujet: emotion
nature: languages
resume: "La couche d'**expression** du système : les moments où l'interface a le droit de sortir de la rigueur productive pour offrir un instant humain."
selon-contexte: [button, interaction, motion, voice]
source: EMOTION-UX.md v1.1.1 + EMOTION-UI.md v1.2.0
empreinte: sha256:d839b3aa1227266d
regles: {loi: 4, preference: 4, non_qualifie: 0}
---
# RULES — emotion (compilé, mode build)

> Extrait mécaniquement de la doctrine par `tools/compile-regles.py`. Ne pas éditer à la main.
>
> **Étiquettes.** `[loi]` — vrai de tout produit : appliquer, et signaler comme non-conformité.
> `[préférence]` — notre choix, pas une norme : proposer en le disant, jamais imposer dans un
> produit qui n'est pas le nôtre. `[non qualifié]` — statut pas encore tranché : **traiter comme
> une préférence** et remonter la question.
> Ce que ne couvre aucune règle ci-dessous : ne pas trancher, poser la question.

## Règles de design

- **[préférence]** Le recours à un moment expressif se justifie par le poids du moment pour l'utilisateur et jamais par une intention décorative : l'intensité de l'expression est proportionnelle à l'importance de l'instant. `EMOTION-R01`
- **[loi]** Un moment expressif ne se déclenche jamais sur une action réflexe ou à haute fréquence, et ne se répète pas plus d'une fois par séquence utile : au-delà, l'animation cesse d'être un signal et devient un obstacle qui allonge la tâche. `EMOTION-R02`
- **[préférence]** Un moment expressif ne se place que sur un moment inscrit au catalogue des moments mérités — réussite d'un envoi, franchissement d'une première fois, cap atteint, sortie d'erreur, vide ou attente assumés — et nulle part ailleurs. `EMOTION-R03`
- **[loi]** Un moment expressif est toujours une amélioration et jamais un canal d'information : l'état qu'il célèbre est exposé indépendamment sous forme statique et programmatiquement déterminable, de sorte que la suppression de l'animation ne retire aucune information. `EMOTION-R05`
- **[loi]** Sous une préférence utilisateur de mouvement réduit, un moment expressif dégrade vers sa version productive ou instantanée — l'état final s'installe sans déplacement — et jamais vers l'absence d'état. `EMOTION-R06`
- **[loi]** Le registre expressif relève le parti pris d'identité mais ne relâche aucune contrainte d'accessibilité : pas plus de trois flashs par seconde, aucun verrouillage de l'action par l'animation, et aucune information portée par le seul mouvement. `EMOTION-R07`
- **[préférence]** Un moment expressif joue sur quatre instruments — mouvement, voix, couleur, forme — dont la couleur puise exclusivement dans les rôles de couleur existants du système, sans jamais introduire de valeur nouvelle. `EMOTION-R08`
- **[préférence]** Les instruments d'un moment expressif se résolvent de manière accordée : la fin du mouvement, le changement de voix et l'installation de la couleur convergent sur le même temps plutôt que de se succéder indépendamment. `EMOTION-R09`

## Non couvert — poser la question, ne rien trancher

- Action réflexe ou à haute fréquence : Une action réflexe ou répétée (hover, navigation, envoi 40 fois par jour).
- Répétition à chaque frappe ou par item de liste : Le même moment serait rejoué en boucle.
- Micro‑interaction purement fonctionnelle : Un feedback purement fonctionnel (press, bordure d'erreur).
- Décor gratuit sans moment : On envisage une animation « pour faire joli ».
- Instruments désaccordés : Mouvement, voix et couleur ne se résolvent pas ensemble.
- E‑motion comme canal d'information : On tenterait de porter un état par la seule animation.
- Effet local copié d'un écran à l'autre : Un CSS expressif est recollé sans gouvernance.


---

---
sujet: form
nature: patterns
resume: "Ce fichier n'est pas un composant au sens de BUTTON-UX.md ou INPUT-UX.md — c'est un **pattern**, une règle qui n'émerge que quand plusieurs champs et un bouton sont assemblés."
selon-contexte: [alert, button, emotion, input, interaction, motion, toast, voice]
source: FORM-UX.md v2.4.0 + FORM-UI.md v1.3.0
empreinte: sha256:2266fea548ff554e
regles: {loi: 17, preference: 51, non_qualifie: 0}
---
# RULES — form (compilé, mode build)

> Extrait mécaniquement de la doctrine par `tools/compile-regles.py`. Ne pas éditer à la main.
>
> **Étiquettes.** `[loi]` — vrai de tout produit : appliquer, et signaler comme non-conformité.
> `[préférence]` — notre choix, pas une norme : proposer en le disant, jamais imposer dans un
> produit qui n'est pas le nôtre. `[non qualifié]` — statut pas encore tranché : **traiter comme
> une préférence** et remonter la question.
> Ce que ne couvre aucune règle ci-dessous : ne pas trancher, poser la question.

## Règles de design

- **[loi]** Les champs formant un groupe de sens doivent être réunis dans un fieldset avec une legend, pour que les lecteurs d'écran annoncent le contexte du groupe. `FORM-R04`
- **[loi]** L'ordre des champs et du focus doit suivre la logique de la tâche et ne jamais utiliser de tabindex positif pour corriger un DOM mal ordonné. `FORM-R05`
- **[préférence]** Nous définissons un formulaire comme long non par un nombre de champs mais par le besoin de scroller pour voir toutes les erreurs possibles. `FORM-R07`
- **[préférence]** Dans une modale, nous réservons le formulaire aux saisies courtes et déplaçons tout formulaire long en page complète. `FORM-R08`
- **[préférence]** Nous décidons une fois pour tout le formulaire s'il marque les champs requis ou les champs optionnels, jamais champ par champ. `FORM-R10`
- **[préférence]** Nous marquons uniquement la minorité des champs, requis ou optionnels selon la proportion, pour que le marqueur reste informatif. `FORM-R11`
- **[préférence]** Nous affichons toujours en tête de formulaire une phrase expliquant la convention de marquage retenue, pas seulement l'indicateur visuel isolé. `FORM-R12`
- **[loi]** Chaque champ obligatoire doit porter l'attribut required ou aria-required="true" en plus de son indicateur visuel. `FORM-R13`
- **[préférence]** Nous appliquons la même convention requis/optionnel à tous les formulaires du produit, jamais une convention différente d'un écran à l'autre. `FORM-R14`
- **[préférence]** Nous décidons la stratégie de timing de validation au niveau du formulaire entier, pas champ par champ. `FORM-R15`
- **[préférence]** Nous choisissons par formulaire entre valider uniquement à la soumission ou valider au blur avec un délai d'environ 500 ms sur les champs à risque. `FORM-R16`
- **[préférence]** Nous ne validons jamais un champ à chaque frappe sans délai, ni avant que l'utilisateur ait terminé sa première saisie. `FORM-R17`
- **[loi]** Les contraintes de format connues d'avance doivent être expliquées avant la saisie, pas seulement révélées après une erreur. `FORM-R18`
- **[préférence]** Nous rattachons une erreur de combinaison entre champs à leur groupe entier, jamais à un champ isolé arbitraire. `FORM-R19`
- **[loi]** Après un échec de soumission, une vue d'ensemble de toutes les erreurs doit être donnée avant que l'utilisateur ne les redécouvre en scrollant. `FORM-R20`
- **[loi]** Le résumé d'erreurs doit être structuré comme une alerte de tonalité danger, non fermable, annoncée via role="alert". `FORM-R21`
- **[loi]** Le résumé d'erreurs ne doit apparaître qu'après un échec de soumission, jamais de façon préventive. `FORM-R22`
- **[loi]** Le résumé d'erreurs doit lister des liens d'ancre vers chaque champ en erreur, en reprenant le message d'erreur exact. `FORM-R23`
- **[loi]** Le résumé d'erreurs ne doit jamais remplacer les messages d'erreur inline à côté de chaque champ — les deux doivent coexister. `FORM-R24`
- **[préférence]** Nous préfixons le titre de la page par « Erreur : » après un échec de soumission d'un formulaire rendu côté serveur. `FORM-R25`
- **[préférence]** Nous déplaçons le focus vers le premier champ en erreur pour un formulaire court, ou vers le résumé pour un formulaire long ou à erreurs multiples. `FORM-R26`
- **[préférence]** Nous faisons en sorte qu'un champ atteint depuis un lien du résumé conserve son message d'erreur et sa valeur saisie. `FORM-R27`
- **[préférence]** Nous gardons le bouton de soumission actif en permanence avant l'envoi, plutôt que de le désactiver comme validation préalable. `FORM-R28`
- **[préférence]** Nous ne désactivons le bouton de soumission que pendant le traitement asynchrone de l'envoi, jamais comme validation préalable. `FORM-R29`
- **[préférence]** Chaque état du cycle de soumission définit précisément ce qui devient visible, ce qui est annoncé, où va le focus et le sort des valeurs saisies. `FORM-R31`
- **[préférence]** Nous réaffichons toujours les champs avec exactement les valeurs saisies par l'utilisateur après un échec, quelle qu'en soit la cause. `FORM-R32`
- **[préférence]** Nous faisons toujours prévaloir le verdict du serveur sur celui du client quand les deux se contredisent sur un champ. `FORM-R33`
- **[préférence]** Nous ne proposons d'annuler une soumission en cours que si l'annulation est réellement possible, sans jamais le simuler faussement. `FORM-R34`
- **[préférence]** En cas de session expirée ou de perte de connexion, nous informons toujours l'utilisateur de ce qui s'est passé et de ce qui est préservé. `FORM-R35`
- **[préférence]** Pour un envoi à effet unique comme un paiement, l'idempotence côté produit reste nécessaire en plus des mécanismes anti double-activation. `FORM-R36`
- **[préférence]** Nous distinguons toujours une erreur serveur portant sur un champ précis d'une erreur globale, jamais déguisée en erreur de champ. `FORM-R37`
- **[préférence]** Nous faisons en sorte qu'un nouvel essai après erreur réutilise les valeurs déjà saisies, sans jamais vider le formulaire. `FORM-R38`
- **[préférence]** Quand seule une partie d'une demande aboutit, nous affichons une alerte d'avertissement listant réussites et reliquat, jamais un simple succès ou échec. `FORM-R40`
- **[préférence]** Après un succès partiel, seules les parties échouées du formulaire restent soumissibles à nouveau. `FORM-R41`
- **[préférence]** Nous découpons un formulaire en plusieurs étapes seulement quand sa longueur ou sa charge cognitive le justifie, jamais par esthétique. `FORM-R42`
- **[préférence]** Chaque étape d'un formulaire multi-étapes valide ses propres champs, sans faire découvrir plus tard une erreur d'une étape déjà validée. `FORM-R43`
- **[préférence]** Le retour en arrière dans un formulaire multi-étapes ne doit jamais perdre les données déjà saisies. `FORM-R44`
- **[loi]** Une information déjà fournie dans le parcours ne doit jamais être redemandée sans être pré-remplie ou rappelée. `FORM-R45`
- **[loi]** Un engagement juridique ou financier doit passer par une étape de récapitulation vérifiable avant sa soumission finale. `FORM-R46`
- **[préférence]** Nous ajoutons un indicateur de progression uniquement quand le nombre d'étapes n'est pas évident, jamais cliquable vers l'avant. `FORM-R47`
- **[préférence]** Le bouton de la dernière étape d'un formulaire multi-étapes doit refléter l'action réelle, jamais un générique 'Suivant'. `FORM-R48`
- **[préférence]** Quand la validité d'un champ dépend d'un aller-retour serveur, ce champ doit afficher un état d'attente visible et annoncé. `FORM-R49`
- **[préférence]** Une validation asynchrone en cours ne doit jamais bloquer la soumission en silence. `FORM-R50`
- **[préférence]** Un verdict de validation asynchrone périmé est toujours jeté, et la soumission revérifie côté serveur. `FORM-R51`
- **[préférence]** La validation asynchrone est réservée aux champs dont la validité ne peut pas être calculée localement. `FORM-R52`
- **[préférence]** Un champ ou groupe conditionnel doit toujours apparaître immédiatement après le champ qui le déclenche. `FORM-R53`
- **[loi]** L'apparition d'un champ conditionnel ne doit jamais voler le focus, et doit être annoncée si l'utilisateur risque de la manquer. `FORM-R54`
- **[préférence]** Une valeur saisie dans un champ ensuite masqué n'est pas soumise mais reste mémorisée pour être restaurée si la condition redevient vraie. `FORM-R55`
- **[préférence]** Dans un groupe répétable, le bouton d'ajout est toujours secondaire et le focus va au nouveau groupe après ajout. `FORM-R56`
- **[préférence]** Nous activons l'autosave seulement quand le coût d'une perte de saisie est élevé, jamais par défaut sur un formulaire court. `FORM-R57`
- **[préférence]** Le statut d'autosave doit être visible en annonce discrète, et un échec d'autosave doit déclencher un avertissement explicite. `FORM-R58`
- **[préférence]** L'autosave ne remplace jamais la soumission du formulaire et ne se déclenche jamais pendant l'envoi lui-même. `FORM-R59`
- **[préférence]** À la reprise d'un brouillon, nous annonçons toujours explicitement ce qui a été restauré. `FORM-R60`
- **[loi]** Toute limite de temps imposée à l'utilisateur doit être supprimable, ajustable ou prolongeable après avertissement, sauf exception normative. `FORM-R61`
- **[loi]** L'expiration d'une limite de temps doit toujours être annoncée à l'avance, laissant le temps de la prolonger. `FORM-R62`
- **[préférence]** Nous assemblons le formulaire à partir de rôles fixes : action pour le submit, navigation pour Modifier, action secondaire pour l'ajout, information pour le résumé. `FORM-R64`
- **[préférence]** Le formulaire assemblé doit rester lisible en niveaux de gris et sans survol : deux rôles différents ne sont jamais rendus indiscernables. `FORM-R65`
- **[préférence]** Les apparitions orchestrées par le formulaire sont toujours réactives à une action, jamais préventives, et animées en opacité plutôt qu'en glissement. `FORM-R66`
- **[préférence]** Le dépliage d'un champ conditionnel est un mouvement de continuité déclenché par l'action de l'utilisateur. `FORM-R67`
- **[loi]** Sous la préférence de mouvement réduit, les apparitions du formulaire doivent dégrader en crossfade ou bascule instantanée, sans perte d'information. `FORM-R68`
- **[préférence]** Nous distinguons toujours le verrou métier d'un verrou d'animation : aucune interaction n'attend qu'une transition visuelle se termine. `FORM-R69`
- **[préférence]** Nous faisons correspondre chaque état du cycle de soumission à un registre de ton précis, de la routine à la panne assumée. `FORM-R70`
- **[préférence]** Nous incarnons la réussite d'un envoi dans un seul porteur choisi selon sa consultabilité, jamais dans deux canaux simultanés. `FORM-R71`
- **[préférence]** Nous réservons tout moment de célébration aux contextes à seuil et ne l'utilisons jamais sur une action répétitive ou réflexe. `FORM-R72`
- **[loi]** L'information de succès doit toujours rester disponible par un canal statique et annoncé, que l'animation ne porte jamais seule. `FORM-R73`
- **[préférence]** Nous calibrons le niveau de friction sur le coût réel d'une erreur dans le contexte précis du formulaire, jamais uniformément. `FORM-R74`
- **[loi]** Pour tout engagement juridique ou financier, la soumission doit être réversible, vérifiée ou confirmée. `FORM-R75`
- **[préférence]** Nous appliquons au formulaire le même principe qu'au bouton et au champ : la friction doit informer, jamais bloquer silencieusement. `FORM-R77`

## Non couvert — poser la question, ne rien trancher

- Édition inline (table) : Une seule cellule devient éditable et se soumet seule.
- Astérisques répétés sur tous les champs : Presque tous les champs sont obligatoires.
- Captcha / anti-robot : Distinguer un humain d'un robot.
- Upload de fichier : Envoyer un fichier.


---

---
sujet: gesture
nature: languages
resume: "Ce langage définit ce qu'un **geste** a le droit de faire."
selon-contexte: [motion, touch]
source: GESTURE-UX.md v1.0.0 + GESTURE-UI.md v1.0.0
empreinte: sha256:42a6248dd566feea
regles: {loi: 14, preference: 11, non_qualifie: 0}
---
# RULES — gesture (compilé, mode build)

> Extrait mécaniquement de la doctrine par `tools/compile-regles.py`. Ne pas éditer à la main.
>
> **Étiquettes.** `[loi]` — vrai de tout produit : appliquer, et signaler comme non-conformité.
> `[préférence]` — notre choix, pas une norme : proposer en le disant, jamais imposer dans un
> produit qui n'est pas le nôtre. `[non qualifié]` — statut pas encore tranché : **traiter comme
> une préférence** et remonter la question.
> Ce que ne couvre aucune règle ci-dessous : ne pas trancher, poser la question.

## Règles de design

- **[loi]** Un geste ne possède ni forme ni état au repos : il n'est perceptible qu'une fois connu, ce qui impose qu'il soit à la fois annoncé par un indice perceptible et doublé par une alternative simple menant à la même fonction. `GESTURE-R01`
- **[préférence]** Un geste est un raccourci qui accélère une fonction déjà accessible par un autre chemin, et jamais le moyen exclusif de l'atteindre. `GESTURE-R02`
- **[loi]** Toute fonction opérée par un geste multipoint ou à trajectoire est également opérable par un pointeur unique sans trajectoire, sauf lorsque le geste multipoint ou à trajectoire est essentiel. `GESTURE-R03`
- **[loi]** Toute fonction opérée par un glissement est également réalisable par un pointeur unique sans glisser, sauf lorsque le glissement est essentiel ou que la fonction est fournie par l'agent utilisateur sans modification par l'auteur. `GESTURE-R04`
- **[loi]** Toute fonction déclenchée par le mouvement de l'appareil ou de l'utilisateur dispose d'un contrôle d'interface équivalent et d'un moyen de désactiver la réponse au mouvement, sauf lorsque le mouvement passe par une interface prise en charge par l'accessibilité ou qu'il est essentiel à la fonction. `GESTURE-R05`
- **[préférence]** La seule dispense d'alternative est le caractère essentiel du geste, quand le tracé constitue lui-même la donnée ; ce caractère se déclare explicitement au cas par cas et ne se présume jamais. `GESTURE-R06`
- **[loi]** Un geste est annoncé par un indice perceptible au repos — poignée, bord de contenu visible, chevron — ou par une instruction explicite : un geste sans indice ni instruction n'est pas découvrable et sa fonction reste ignorée. `GESTURE-R07`
- **[loi]** Les gestes réservés par la plateforme d'accueil sont respectés et jamais redéfinis : aucun geste applicatif ne se place dans une zone ou une direction dont le système d'exploitation ou l'agent utilisateur conserve la maîtrise. `GESTURE-R08`
- **[préférence]** L'aide au premier usage d'un geste est ponctuelle et non bloquante : elle ne se répète pas à chaque venue et ne s'interpose jamais entre la personne et la fonction. `GESTURE-R09`
- **[loi]** Un geste ne s'engage qu'au-delà d'un seuil franc de distance ou de durée ; en deçà de ce seuil rien ne se produit et le défilement conserve la priorité. `GESTURE-R10`
- **[loi]** L'effet d'un geste n'est acté qu'au franchissement du seuil suivi d'un relâchement dans la zone d'effet ; ramener le pointeur hors de cette zone avant de relâcher annule le geste sans conséquence. `GESTURE-R11`
- **[préférence]** Le retour d'accompagnement pendant le geste est porté par des propriétés composables uniquement et se réduit lorsque l'utilisateur demande moins de mouvement, sans que la fonction du geste en soit jamais retirée. `GESTURE-R12`
- **[loi]** Toute fonction exposée par un geste est également opérable au clavier, sauf lorsque la fonction sous-jacente exige une entrée dépendant du tracé du mouvement et pas seulement de ses extrémités. `GESTURE-R13`
- **[loi]** Les technologies d'assistance capturent les gestes tactiles pour leur propre navigation : toute fonction gestuelle reste donc exposée par un contrôle dont le nom et le rôle sont programmatiquement déterminables, et non par le seul geste brut. `GESTURE-R14`
- **[loi]** L'alternative à pointeur unique et l'alternative sans glisser constituent l'accès principal des personnes à motricité réduite, qui ne peuvent ni tracer un chemin précis ni maintenir un appui : ce ne sont pas des compléments de confort. `GESTURE-R15`

## Consignes d'implémentation

- **[préférence]** Les gestes s'implémentent sur les événements pointeur, qui unifient souris, doigt et stylet en un seul modèle, et non sur des familles d'événements tactiles et souris traitées séparément. `GESTURE-U01`
- **[préférence]** La fonction est portée par un contrôle natif et le geste n'est qu'un raccourci branché par-dessus, de sorte que l'alternative à pointeur unique et l'opérabilité clavier existent par construction et non par rattrapage. `GESTURE-U02`
- **[préférence]** Un geste à trajectoire ne s'engage qu'au-delà d'une distance minimale qui le distingue d'un appui et d'un défilement ; en deçà l'événement revient à l'agent utilisateur, et le sens dominant se fixe au premier franchissement puis se tient jusqu'au relâchement. `GESTURE-U03`
- **[loi]** L'annulation du pointeur par l'agent utilisateur et le relâchement hors de la zone d'effet ramènent l'élément à son état initial sans exécuter la fonction, celle-ci n'étant acquise qu'au franchissement du seuil suivi d'un relâchement dans la zone. `GESTURE-U04`
- **[préférence]** Pendant le geste, seules les propriétés composables de transformation et d'opacité sont animées ; lorsque l'utilisateur demande moins de mouvement, le suivi cède la place à une bascule d'état instantanée sans perte de fonction. `GESTURE-U05`
- **[préférence]** Les contrôles qui portent l'alternative à un geste sont des cibles tactiles de plein droit et respectent la taille confortable et l'espacement minimal du système : une alternative trop petite pour être touchée n'est pas une alternative. `GESTURE-U06`
- **[loi]** L'affordant d'un geste est rendu par des moyens statiques et perceptibles sans interaction préalable : il ne dépend ni d'une animation seule, absente quand l'utilisateur demande moins de mouvement, ni du seul survol, indisponible sur un dispositif qui ne survole pas. `GESTURE-U07`
- **[préférence]** L'aide au premier usage est une surcouche non modale légère, fermée au premier appui et non ré-affichée par défaut : elle ne piège pas le focus et ne conditionne pas l'accès au contenu sous-jacent. `GESTURE-U08`
- **[préférence]** Le régime d'entrée se déclare par les requêtes de média de pointeur et de survol : sous un pointeur de précision limitée, les contrôles-alternatives sont dimensionnés pour le doigt, et sous un dispositif incapable de survoler, aucun affordant de geste ne dépend du survol. `GESTURE-U09`
- **[loi]** Un élément générique rendu gestuel expose un rôle et un nom accessibles et n'intercepte aucun événement clavier ni aucune interaction d'assistance destinés au contrôle natif qui porte la fonction. `GESTURE-U10`


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
sujet: iconography
nature: foundations
resume: "Ce fichier contient le raisonnement : quand une icône a le droit d'exister, ce qu'elle porte, ce qu'elle ne remplace jamais."
selon-contexte: [alert, button, card, color, input, motion, spacing]
source: ICONOGRAPHY-UX.md v1.0.0 + ICONOGRAPHY-UI.md v1.0.0
empreinte: sha256:d86596ba0df16fc3
regles: {loi: 9, preference: 9, non_qualifie: 0}
---
# RULES — iconography (compilé, mode build)

> Extrait mécaniquement de la doctrine par `tools/compile-regles.py`. Ne pas éditer à la main.
>
> **Étiquettes.** `[loi]` — vrai de tout produit : appliquer, et signaler comme non-conformité.
> `[préférence]` — notre choix, pas une norme : proposer en le disant, jamais imposer dans un
> produit qui n'est pas le nôtre. `[non qualifié]` — statut pas encore tranché : **traiter comme
> une préférence** et remonter la question.
> Ce que ne couvre aucune règle ci-dessous : ne pas trancher, poser la question.

## Règles de design

- **[loi]** Toute icône est accompagnée d'un libellé textuel partout où c'est possible, et aucune icône n'est ajoutée là où elle n'est pas nécessaire. `ICONOGRAPHY-R04`
- **[préférence]** Le droit d'une icône à paraître sans libellé visible est défini par une liste fermée et déclarée, non par un jugement au cas par cas. `ICONOGRAPHY-R05`
- **[loi]** Tout contrôle réduit à une icône porte un nom accessible non vide décrivant sa fonction ; une info-bulle au survol ne tient jamais lieu de nom accessible. `ICONOGRAPHY-R06`
- **[préférence]** Une action dont l'icône ne se laisse ni concevoir ni trouver en moins de cinq secondes se désigne par un mot et non par un glyphe. `ICONOGRAPHY-R07`
- **[loi]** Un glyphe ne désigne qu'un seul sens dans tout le produit, et un sens donné est toujours porté par le même glyphe. `ICONOGRAPHY-R08`
- **[préférence]** Aucun symbole dont le sens est déjà établi ailleurs n'est réaffecté à un autre sens. `ICONOGRAPHY-R09`
- **[loi]** Une icône porteuse de sens est un canal redondant d'une information déjà exprimée autrement : elle ne se retire pas pour alléger, et sa silhouette distingue le sens sans recours à la couleur. `ICONOGRAPHY-R10`
- **[préférence]** La bibliothèque adopte un style de contour unique à trait constant, et réserve la variante pleine à la signalisation d'un état actif. `ICONOGRAPHY-R11`
- **[préférence]** Une icône doit rester lisible au plus petit cran ; un glyphe dont les détails se bouchent est simplifié ou retiré, le cran n'est pas augmenté pour lui. `ICONOGRAPHY-R12`
- **[préférence]** Les icônes s'en tiennent à des formes simples et frontales, sans perspective, sans volume et sans détail intérieur superflu. `ICONOGRAPHY-R13`
- **[loi]** Les tailles d'icône proviennent d'un jeu fermé de crans appariés aux corps de texte ; une icône ne se redimensionne jamais hors de ces crans, elle change de cran. `ICONOGRAPHY-R14`
- **[loi]** À côté d'un texte, l'icône est centrée verticalement sur la ligne plutôt qu'alignée sur la ligne de base, et prend la couleur du texte qu'elle accompagne. `ICONOGRAPHY-R15`
- **[loi]** Une icône porteuse d'information respecte un contraste d'au moins 3:1 avec les couleurs adjacentes ; une icône décorative en est exemptée et est retirée de l'arbre d'accessibilité. `ICONOGRAPHY-R16`
- **[loi]** La cible tactile d'une icône interactive s'obtient par extension du padding et jamais par agrandissement du glyphe. `ICONOGRAPHY-R17`
- **[préférence]** Le spinner est traité comme une icône animée : il occupe le cran de l'icône qu'il remplace sans modifier la géométrie du composant. `ICONOGRAPHY-R18`
- **[préférence]** Une icône qui varie avec l'état est le même glyphe transformé plutôt qu'un second glyphe, et l'état reste exposé programmatiquement. `ICONOGRAPHY-R19`
- **[préférence]** Les icônes sont rendues en SVG inline héritant de la couleur du texte, et non par une police d'icônes. `ICONOGRAPHY-R20`
- **[loi]** Une icône n'est jamais le seul dépositaire d'un sens : toute information qu'elle porte reste disponible par le texte, le rôle ou la structure. `ICONOGRAPHY-R22`

## Non couvert — poser la question, ne rien trancher

- Illustration : Un visuel d'empty state ou pédagogique s'affiche.
- RTL : La langue se lit de droite à gauche.


---

---
sujet: input
nature: components
resume: "Ce fichier contient le raisonnement : quand valider, quel wording, quels risques."
selon-contexte: [accessibility, adaptive, border, button, emotion, form, interaction, motion, toast, typography, voice]
source: INPUT-UX.md v1.7.1 + INPUT-UI.md v1.6.0
empreinte: sha256:df4c0e6aef8b4e07
regles: {loi: 22, preference: 35, non_qualifie: 0}
---
# RULES — input (compilé, mode build)

> Extrait mécaniquement de la doctrine par `tools/compile-regles.py`. Ne pas éditer à la main.
>
> **Étiquettes.** `[loi]` — vrai de tout produit : appliquer, et signaler comme non-conformité.
> `[préférence]` — notre choix, pas une norme : proposer en le disant, jamais imposer dans un
> produit qui n'est pas le nôtre. `[non qualifié]` — statut pas encore tranché : **traiter comme
> une préférence** et remonter la question.
> Ce que ne couvre aucune règle ci-dessous : ne pas trancher, poser la question.

## Règles de design

- **[loi]** Le tone (neutral/error/success/warning) doit reprendre les états de validation natifs à tous les frameworks UI courants (ex. Material UI). `INPUT-R02`
- **[préférence]** Nous définissons l'input comme l'expression canonique de l'intention de saisie : label, bordure et contenu signalent où saisir, même au repos. `INPUT-R05`
- **[préférence]** Nous excluons toute élévation de type action sur l'input : le focus et la bordure d'état portent seuls l'expression de la saisie. `INPUT-R06`
- **[préférence]** Nous imposons que label, valeur, contrainte nécessaire et message d'erreur restent visibles dans toute adaptation d'espace. `INPUT-R07`
- **[loi]** La transition de couleur de la bordure d'état doit rester un feedback qui confirme un changement déjà signalé ailleurs, jamais son unique vecteur d'information. `INPUT-R08`
- **[loi]** L'information d'erreur ne doit jamais reposer sur la seule couleur ou animation de la bordure : elle doit être portée par un texte lié techniquement au champ. `INPUT-R09`
- **[préférence]** Nous choisissons de conserver la transition de couleur de la bordure d'état sous prefers-reduced-motion, cette préférence ciblant le mouvement spatial, pas la couleur. `INPUT-R10`
- **[préférence]** Nous n'insérons le message d'erreur qu'à la suite d'une action de l'utilisateur, jamais par un déplacement de contenu non sollicité. `INPUT-R11`
- **[préférence]** Nous recommandons l'input pour toute donnée exprimée en texte libre ou semi-libre, comme un nom, un email, un montant ou une recherche. `INPUT-R12`
- **[préférence]** Nous déconseillons l'input pour un choix parmi des options prédéfinies et limitées, ce rôle revenant au select, au radio ou à la checkbox. `INPUT-R13`
- **[préférence]** Nous classons le champ de recherche comme un input, et non une action, car la nature de la donnée saisie prime sur l'action déclenchée ensuite. `INPUT-R14`
- **[loi]** Le type de champ HTML doit correspondre à la nature réelle de la donnée saisie, car il détermine le clavier, la validation native et le comportement attendu. `INPUT-R15`
- **[préférence]** Nous utilisons le tone neutral par défaut, tant qu'aucune validation en cours ou réussie ne nécessite d'être signalée visuellement. `INPUT-R16`
- **[préférence]** Nous utilisons le tone error pour signaler qu'une valeur ne respecte pas le format ou la contrainte attendue. `INPUT-R17`
- **[préférence]** Nous déclenchons la validation inline au blur, sauf sur les champs à fort risque de format où elle se joue ~500ms après la frappe, jamais avant la première saisie complète. `INPUT-R18`
- **[préférence]** Nous réservons le tone success aux champs à forte friction perçue, comme la disponibilité d'un identifiant, plutôt qu'à toute validation réussie. `INPUT-R20`
- **[préférence]** Nous utilisons le tone warning pour signaler une valeur acceptée mais qui mérite l'attention, plus rarement que sur le bouton. `INPUT-R21`
- **[loi]** Un message d'erreur doit décrire l'écart et la correction sans jamais qualifier ou blâmer l'utilisateur. `INPUT-R22`
- **[loi]** Un message d'erreur doit expliquer pourquoi la valeur est invalide et comment la corriger, pas seulement signaler qu'elle est fausse. `INPUT-R23`
- **[préférence]** Nous réservons la validation inline aux champs à fort risque d'erreur, car la généraliser oblige à un va-et-vient constant entre saisie et correction. `INPUT-R24`
- **[préférence]** Nous distinguons le helper text, aide persistante visible dès le focus, du message d'erreur qui le remplace temporairement. `INPUT-R25`
- **[préférence]** Nous faisons en sorte que le message d'erreur remplace temporairement le helper text plutôt que de s'y ajouter. `INPUT-R26`
- **[préférence]** Nous affichons le compteur de caractères dès l'apparition du champ à limite, avant que l'utilisateur commence à taper. `INPUT-R27`
- **[préférence]** Nous intégrons le prefix ou suffix comme élément non éditable à l'intérieur du champ, jamais comme un label externe séparé. `INPUT-R28`
- **[préférence]** Nous n'affichons le bouton d'effacement qu'une fois le champ non vide. `INPUT-R29`
- **[préférence]** Nous marquons systématiquement tout champ obligatoire par un astérisque ou une mention textuelle équivalente. `INPUT-R30`
- **[loi]** Un message d'erreur doit être précédé du mot « Erreur » ou d'une icône dédiée, jamais signalé par la seule couleur du texte. `INPUT-R31`
- **[loi]** Le champ doit accepter dictée et collage sans interception bloquante ; tout formatage doit s'appliquer après coup, jamais en empêchant la saisie. `INPUT-R32`
- **[loi]** Le nom accessible du champ doit contenir le texte de son libellé visible, conformément à WCAG 2.5.3 (Label in Name). `INPUT-R33`
- **[préférence]** Nous réservons la taille sm de l'input aux tableaux éditables, cellules inline et filtres compacts. `INPUT-R34`
- **[préférence]** Nous utilisons la taille md comme taille par défaut de l'input, pour les formulaires standards. `INPUT-R35`
- **[préférence]** Nous réservons la taille lg aux champs de recherche hero et aux formulaires d'onboarding à fort enjeu de conversion. `INPUT-R36`
- **[préférence]** Nous interdisons de mélanger les tailles d'input au sein d'un même groupe de champs liés, comme un bloc adresse. `INPUT-R37`
- **[loi]** Le label du champ doit rester visible en permanence, y compris pendant la saisie ; il ne doit jamais être porté uniquement par le placeholder. `INPUT-R38`
- **[préférence]** Nous groupons visuellement les champs appartenant à un même ensemble logique, comme un bloc adresse. `INPUT-R39`
- **[préférence]** Nous exigeons que le passage en mode édition d'un champ inline soit visuellement non ambigu. `INPUT-R41`
- **[loi]** La barre de recherche doit utiliser le type HTML natif « search » plutôt qu'un champ texte stylisé, pour conserver les comportements natifs du navigateur. `INPUT-R42`
- **[loi]** Le champ de mot de passe doit capturer une donnée sensible masquée par défaut, tout en restant vérifiable par l'utilisateur avant soumission. `INPUT-R44`
- **[loi]** Un formulaire doit utiliser un seul champ de mot de passe avec un toggle de visibilité, plutôt qu'un champ de confirmation séparé. `INPUT-R45`
- **[loi]** Le champ de mot de passe doit rester masqué par défaut ; seul un toggle actionné explicitement peut afficher le texte en clair, jamais l'inverse. `INPUT-R46`
- **[loi]** Au moment de la soumission, le champ doit revenir au type « password » s'il ne l'était pas déjà. `INPUT-R47`
- **[loi]** Le champ de mot de passe doit toujours autoriser le copier-coller, car le bloquer casse l'usage des gestionnaires de mots de passe. `INPUT-R48`
- **[loi]** Le champ de mot de passe doit désactiver la correction orthographique et la mise en majuscule automatique. `INPUT-R49`
- **[préférence]** Nous affichons les exigences de format du mot de passe avant la saisie, sans imposer de règle de complexité sans justification de sécurité réelle. `INPUT-R50`
- **[loi]** Le champ de carte bancaire doit être traité comme une donnée à très haut risque, encadrée par la contrainte non négociable de conformité PCI-DSS. `INPUT-R51`
- **[loi]** Les champs numéro de carte et CVV doivent être rendus via l'iframe du processeur de paiement, hors du contrôle direct du design system. `INPUT-R52`
- **[loi]** Les champs de paiement non sensibles (titulaire, adresse de facturation) doivent utiliser les valeurs autocomplete standard dédiées. `INPUT-R53`
- **[loi]** Le remplissage automatique du navigateur ou d'un gestionnaire de mots de passe est un comportement natif qui doit être anticipé, pas subi. `INPUT-R54`
- **[loi]** L'autofill du navigateur ne doit jamais être désactivé sans raison de sécurité valable et documentée. `INPUT-R55`
- **[préférence]** Nous excluons tout instrument E-motion du champ de saisie lui-même, car la saisie est une action réflexe et à haute fréquence. `INPUT-R56`
- **[préférence]** Nous maintenons le champ en état error dans un registre strictement productif, le soulagement de la résolution restant porté par un composant séparé. `INPUT-R57`
- **[préférence]** Nous calibrons la friction de validation sur le risque réel d'erreur du champ, plutôt que d'appliquer un traitement uniforme. `INPUT-R58`

## Consignes d'implémentation

- **[préférence]** Le code anime la couleur de la bordure d'état en motion.fast/ease-out, tandis que le message d'erreur apparaît sans délai. `INPUT-U01`
- **[préférence]** Le code conserve la transition de couleur de la bordure d'état sous prefers-reduced-motion, en héritant du bloc média global. `INPUT-U02`
- **[préférence]** Le code fixe l'élévation de l'Input à elevation.none dans tous ses états, sans inset requis. `INPUT-U03`
- **[préférence]** Le code ne doit jamais masquer le label, la valeur, une contrainte nécessaire ou le message d'erreur via une Container Query. `INPUT-U04`
- **[préférence]** Le code de l'Input n'utilise jamais breakpoint.mobile pour déduire sa largeur ; la réorganisation est déléguée au pattern parent. `INPUT-U05`

## Non couvert — poser la question, ne rien trancher

- Dans une modale : La saisie se fait dans une fenêtre superposée.
- Filtre (liste, dashboard) : Le champ affine un résultat affiché.
- Formulaire multi-étapes : Le champ appartient à un parcours en étapes.
- Champ de commentaire/réponse : La saisie est sociale, avec envoi séparé.
- Autocomplete / suggestions : Des propositions apparaissent pendant la saisie.
- Validation asynchrone (ex: dispo d'un username) : Un verdict vient du serveur pendant la saisie.
- Autosave : La saisie se sauvegarde sans action explicite.
- Autofill / gestionnaire de mots de passe navigateur : Le navigateur remplit automatiquement le champ.
- Label flottant (floating label) : Le label rétrécit et monte au focus.
- Icône leading/trailing dans le champ : Une icône de contexte accompagne le champ.
- Champs connectés (ex: select + input) : Deux composants sont visuellement fusionnés.
- Champ de paiement (carte bancaire) : L'utilisateur saisit une carte bancaire.
- Données personnelles sensibles : Le champ collecte des données sensibles.
- Recherche critique pour le produit : La recherche est au cœur du produit.


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
sujet: link
nature: components
resume: "Un lien promet une destination."
selon-contexte: [border, card, emotion, iconography, interaction, motion, voice]
source: LINK-UX.md v1.1.0 + LINK-UI.md v1.1.0
empreinte: sha256:709a7c8e5cbb6976
regles: {loi: 19, preference: 11, non_qualifie: 0}
---
# RULES — link (compilé, mode build)

> Extrait mécaniquement de la doctrine par `tools/compile-regles.py`. Ne pas éditer à la main.
>
> **Étiquettes.** `[loi]` — vrai de tout produit : appliquer, et signaler comme non-conformité.
> `[préférence]` — notre choix, pas une norme : proposer en le disant, jamais imposer dans un
> produit qui n'est pas le nôtre. `[non qualifié]` — statut pas encore tranché : **traiter comme
> une préférence** et remonter la question.
> Ce que ne couvre aucune règle ci-dessous : ne pas trancher, poser la question.

## Règles de design

- **[loi]** Un déclencheur qui conduit l'utilisateur vers une autre page, ressource, section ou URL est un lien. `LINK-R01`
- **[loi]** Un déclencheur dont l'activation modifie l'état courant, soumet, crée, supprime ou lance un traitement est un bouton, y compris dans une application monopage : c'est le résultat perçu qui décide, pas la technologie de routage. `LINK-R02`
- **[loi]** Un lien qui ouvre une modale d'action et un bouton qui conduit vers une page sont l'un et l'autre des promesses fausses ; toute exception se justifie par le parcours, jamais par un besoin de style. `LINK-R03`
- **[loi]** Un lien placé dans un bloc de texte reste identifiable sans dépendre de la couleur seule, le soulignement étant le signal par défaut. `LINK-R04`
- **[loi]** Le libellé d'un lien garde son sens hors de son contexte immédiat ; un libellé générique répété est proscrit dès que plusieurs occurrences mènent à des destinations différentes. `LINK-R05`
- **[préférence]** Un lien autonome peut associer texte et icône directionnelle ; il reste plus léger qu'un bouton adjacent et ne concurrence pas l'action dominante de l'écran. `LINK-R06`
- **[loi]** Dans un ensemble de navigation, la destination courante est signalée par un indice non chromatique et par l'état programmatique correspondant, et n'est pas présentée comme une action. `LINK-R07`
- **[loi]** Un lien de téléchargement annonce la nature du fichier et, quand elle est utile, sa taille, avant l'activation. `LINK-R08`
- **[loi]** L'ouverture d'un nouvel onglet reste exceptionnelle et est annoncée dans le libellé ou par une indication accessible équivalente ; une icône seule ne suffit pas tant que sa signification n'est pas établie dans le produit. `LINK-R09`
- **[préférence]** Les états default, hover, focus, active et visited d'un lien restent distinguables les uns des autres partout où ils s'appliquent. `LINK-R10`
- **[préférence]** L'état visited est réservé aux collections de contenu où se souvenir des pages consultées sert la tâche ; il peut être omis dans la navigation applicative persistante lorsqu'il brouillerait le repère de destination courante. `LINK-R11`
- **[préférence]** Un lien n'a pas d'état désactivé : une destination indisponible est retirée ou remplacée par une explication, jamais laissée sous la forme d'un lien inerte. `LINK-R12`
- **[préférence]** Une icône de lien complète le libellé — en tête elle décrit la ressource, en fin elle décrit la direction ou la nature de la destination — et ne le remplace que si le lien conserve un nom accessible explicite. `LINK-R13`
- **[loi]** Un lien réduit à une icône porte un nom accessible et une cible pointeur suffisante, et sa forme ne le fait pas passer pour un bouton alors que son résultat est une navigation. `LINK-R14`
- **[loi]** Une carte cliquable vers un détail contient un lien réel dont le texte accessible est le titre de la carte ; l'extension de la surface cliquable est une technique de ce lien, pas un gestionnaire de clic posé sur un conteneur inerte. `LINK-R15`
- **[loi]** Les actions internes à une carte restent hors du lien et conservent leur propre sémantique ; aucun élément interactif n'est descendant d'un lien. `LINK-R16`
- **[loi]** Le texte d'un lien décrit la destination ou la ressource, et évite l'URL brute dès qu'un nom humain est disponible. `LINK-R17`
- **[loi]** Le contexte accessible d'un lien permet d'en comprendre la fonction, et deux liens portant le même texte accessible conduisent à la même nature de destination. `LINK-R18`
- **[loi]** Un lien dit « aller », un bouton dit « faire » ; le poids visuel ne modifie jamais cette répartition. `LINK-R20`
- **[préférence]** Le lien n'invoque aucun instrument d'animation expressive : un clic de navigation est une interaction à haute fréquence, hors du catalogue des moments mérités, et son seul besoin temporel est le feedback d'état. `LINK-R21`

## Consignes d'implémentation

- **[loi]** Un lien inline est souligné au repos ; le survol peut renforcer l'épaisseur ou le décalage du soulignement mais n'est jamais le moment où le lien devient enfin identifiable. `LINK-U01`
- **[préférence]** Un lien autonome reste visuellement plus léger qu'un bouton ; lui donner une boîte, un fond et des états de pression équivalents à un bouton signifie que le choix du composant doit être réexaminé. `LINK-U02`
- **[préférence]** Le soulignement d'un lien est produit par les propriétés CSS dédiées text-decoration-* et reste lisible autour des jambages ; il n'est pas simulé par une bordure qui traverse les lignes. `LINK-U03`
- **[préférence]** Les changements de couleur d'un lien s'animent sur la durée courte et la courbe de sortie du système au titre du feedback d'état, et sont supprimables sous prefers-reduced-motion sans perte d'information. `LINK-U04`
- **[préférence]** L'anneau de focus d'un lien n'est jamais animé : c'est une information de position pour la navigation clavier, pas un effet. `LINK-U05`
- **[loi]** Toute navigation est portée par un élément d'ancre muni d'une destination réelle ; un gestionnaire JavaScript peut enrichir le comportement, jamais remplacer l'attribut de destination. `LINK-U06`
- **[loi]** La destination courante est déclarée par la valeur appropriée d'aria-current, et un changement de contexte ou un téléchargement porte les attributs natifs correspondants accompagnés de l'annonce accessible prévue. `LINK-U07`
- **[loi]** Le lien étendu d'une carte suit la technique documentée du composant carte, et les actions internes restent des éléments frères du lien, jamais ses descendants. `LINK-U08`
- **[préférence]** L'icône d'un lien inline utilise la taille d'icône petite et celle d'un lien autonome peut utiliser la taille moyenne ; le trait et le dessin suivent la fondation d'iconographie. `LINK-U09`
- **[loi]** Un lien icône seule porte obligatoirement un nom accessible et une zone interactive atteignant la cible tactile commune de 44 px, sans que le glyphe lui-même soit agrandi. `LINK-U10`


---

---
sujet: modal
nature: components
resume: "La modale est le superposé qui **interrompt** : elle bloque le flux, réclame une décision ou une saisie"
selon-contexte: [button, form, overlay]
source: MODAL-UX.md v1.0.0 + MODAL-UI.md v1.0.1
empreinte: sha256:8af333f61a23f8ed
regles: {loi: 10, preference: 15, non_qualifie: 0}
---
# RULES — modal (compilé, mode build)

> Extrait mécaniquement de la doctrine par `tools/compile-regles.py`. Ne pas éditer à la main.
>
> **Étiquettes.** `[loi]` — vrai de tout produit : appliquer, et signaler comme non-conformité.
> `[préférence]` — notre choix, pas une norme : proposer en le disant, jamais imposer dans un
> produit qui n'est pas le nôtre. `[non qualifié]` — statut pas encore tranché : **traiter comme
> une préférence** et remonter la question.
> Ce que ne couvre aucune règle ci-dessous : ne pas trancher, poser la question.

## Règles de design

- **[loi]** Une modale porte toujours une conclusion : au moins une action qui la ferme et clôt la question posée. Un contenu sans fin naturelle — navigation libre, exploration longue, information destinée à persister — relève d'une page, jamais d'une modale. `MODAL-R02`
- **[préférence]** Une modale n'est légitime que lorsque trois conditions tiennent ensemble : l'interruption est courte, une décision doit être prise avant de pouvoir continuer ailleurs, et le contexte d'origine doit être retrouvé intact ; dès que l'une manque, le besoin est routé vers une page, un drawer, une saisie en ligne, une notification ou un popover. `MODAL-R03`
- **[préférence]** Une seule modale est ouverte à la fois : une modale n'en déclenche jamais une seconde et deux surfaces modales ne se superposent jamais. `MODAL-R04`
- **[préférence]** Lorsqu'une action lancée depuis une modale réclame elle-même une confirmation, la modale ouverte remplace son propre contenu par l'étape de confirmation au lieu d'empiler une seconde surface ; fermer puis rouvrir n'est admis que si le contexte de retour n'a pas besoin d'être préservé. `MODAL-R05`
- **[préférence]** Trois familles d'usage seulement sont admises pour la modale — confirmation d'action, saisie courte, détail ou lecture — chacune fixant son contenu, son cran de largeur et son nombre d'actions ; toute quatrième famille suppose de remonter l'arbitrage. `MODAL-R06`
- **[préférence]** Le cran de largeur d'une modale est déterminé par sa famille d'usage et jamais par la longueur de son contenu : un texte long se replie en lignes supplémentaires, il ne fait pas passer la modale au cran supérieur. `MODAL-R07`
- **[loi]** Toute action destructive et irréversible dont le coût dépasse ce qu'une annulation suffirait à réparer se confirme dans une modale de la famille confirmation, jamais par une simple alerte dans le flux ni par une boîte de dialogue native du navigateur. `MODAL-R08`
- **[loi]** Le titre et le corps d'une confirmation destructive nomment l'objet réel visé et la conséquence de l'action, jamais une formule générique : la question doit se comprendre sans relire l'écran de fond. `MODAL-R09`
- **[loi]** Dans une modale de confirmation destructive, l'action irréversible n'est jamais celle qu'un appui réflexe sur Entrée déclenche : le focus initial va à l'action la moins destructive, ou aucune action n'est pré-activée ; l'emphase et la position du bouton destructif restent fixées par le langage de bouton. `MODAL-R10`
- **[loi]** Une destruction à enjeu élevé — volume important, ressources dépendantes, recréation coûteuse — exige une confirmation renforcée, dont la forme documentée est la saisie manuelle du nom de la ressource avant activation du bouton destructif ; la modale héberge ce mécanisme sans le redéfinir. `MODAL-R11`
- **[préférence]** Le clic sur le voile est le seul des trois moyens de fermeture qui se désarme, et seulement lorsqu'une fermeture accidentelle perdrait une saisie en cours ; Échap et le bouton de fermeture restent actifs dans tous les cas, et la confirmation de perte de données incombe au consommateur du composant, qui ne l'implémente pas nativement. `MODAL-R13`
- **[loi]** Toute modale expose un nom accessible : un titre visible référencé par aria-labelledby, ou à défaut un aria-label explicite porté par la surface ; l'absence des deux laisse le dialogue annoncé sans complément. `MODAL-R14`
- **[loi]** Le titre d'une modale nomme la tâche ou la question qu'elle pose, sous forme de phrase verbale brève, et jamais la catégorie du composant. `MODAL-R15`
- **[préférence]** Dans une modale de saisie, le focus d'entrée va au premier contrôle de saisie et non au bouton de fermeture ; le bouton de fermeture de l'en-tête n'est jamais placé avant le contenu principal dans l'ordre de tabulation. `MODAL-R17`
- **[loi]** Au-delà de la hauteur disponible, seule la région de contenu d'une modale défile : l'en-tête et le pied restent fixes et visibles, et la surface entière ne défile jamais. `MODAL-R18`
- **[loi]** Le pied d'actions d'une modale reste atteignable sans défiler, et sa fixation ne recouvre jamais entièrement un contrôle qui vient de recevoir le focus dans la région défilante. `MODAL-R19`
- **[loi]** Une information qui n'appelle aucune décision immédiate — succès, erreur non bloquante, changement de statut — se rend par une notification non modale ou une alerte dans le flux, jamais par une modale. `MODAL-R21`

## Consignes d'implémentation

- **[préférence]** L'en-tête du composant établit lui-même la liaison entre le titre et la surface, qui porte role="dialog" et aria-modal="true", sans identifiant à câbler à la main ; une modale sans en-tête reçoit un aria-label explicite. `MODAL-U01`
- **[préférence]** La modale n'admet que deux crans de largeur : un cran étroit pour la confirmation et la saisie courte, un cran par défaut pour le détail, l'illustration et le tableau court ; aucun troisième cran n'existe, un contenu plus large relevant d'une page. `MODAL-U02`
- **[préférence]** Le voile est rendu en position fixe sur tout le cadre d'affichage et avant la surface dans l'ordre du document, donc derrière elle, les deux partageant le même cran d'empilement ; la surface porte l'ombre de superposé, un rayon, un fond et une bordure référencés en jetons. `MODAL-U03`
- **[préférence]** L'implémentation réalise le contrat de focus par un piège manuel géré au clavier : le focus entre dans la surface à l'ouverture, sur le premier élément focalisable ou sur la surface elle-même rendue focalisable par programme, Tab et Maj+Tab bouclent entre le premier et le dernier élément focalisable, et la fermeture restitue le focus à l'élément actif capturé à l'ouverture. `MODAL-U04`
- **[préférence]** Trois déclencheurs appellent la fermeture — la touche Échap, le bouton de fermeture de l'en-tête, et le clic sur le voile lorsqu'il est armé ; désarmer le clic sur le voile ne retire que ce troisième déclencheur. `MODAL-U06`
- **[préférence]** L'entrée et la sortie de la surface animent l'opacité et une translation verticale sur le cran de durée lent, le voile animant son opacité sur la même durée ; sous préférence de mouvement réduit, la transition est supprimée, jamais l'état final. `MODAL-U07`
- **[préférence]** Le verrou de défilement porte sur la région qui défile réellement et non sur le document : l'implémentation verrouille le corps du document et chaque ancêtre défilant du déclencheur, puis restaure l'état d'origine de chacun à la fermeture. `MODAL-U09`
- **[préférence]** Aucune prise de focus liée à un superposé ne fait défiler quoi que ce soit : l'entrée du focus comme son retour au déclencheur demandent explicitement au navigateur de ne pas amener l'élément dans le champ de vision. `MODAL-U10`

## Non couvert — poser la question, ne rien trancher

- Formulaire long multi-champs : Inscription, réglages complets d'un objet — plusieurs sections de champs.
- Wizard multi-étapes : Séquence d'écrans qui progresse vers un but (ex. création de compte).
- À l'arrivée sur une URL profonde (deep link) : Une route applicative ouvre directement la modale au chargement.
- Ouverture automatique sans interaction : Une modale s'affiche au chargement sans déclencheur explicite (ex. onboarding).
- Confirmation de perte de données avant fermeture : Échap ou la croix sont actionnés avec une saisie non enregistrée.
- Drawer : Un panneau ancré à un bord plutôt que centré à l'écran.
- Toast : Une notification éphémère et non-modale, sans décision requise.
- Alert inline : Un message dans le flux de la page, non superposé.
- Popover / dropdown : Un superposé non-modal ancré au déclencheur, pour un détail court.
- Modale sur modale (empilement) : Une seconde modale s'ouvrirait depuis une première déjà ouverte.
- Page dédiée : Un contenu long, autonome, navigable et partageable par URL.
- Confirmation native du navigateur (beforeunload) : L'avertissement natif à la fermeture d'onglet ou de fenêtre.


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
sujet: navigation
nature: patterns
resume: "**Orchestration** d'une navigation, pas un composant neuf : elle **assemble** des destinations (`link` en"
selon-contexte: [link]
source: NAVIGATION-UX.md v1.0.0 + NAVIGATION-UI.md v1.0.0
empreinte: sha256:aef249d7a6749cec
regles: {loi: 5, preference: 6, non_qualifie: 0}
---
# RULES — navigation (compilé, mode build)

> Extrait mécaniquement de la doctrine par `tools/compile-regles.py`. Ne pas éditer à la main.
>
> **Étiquettes.** `[loi]` — vrai de tout produit : appliquer, et signaler comme non-conformité.
> `[préférence]` — notre choix, pas une norme : proposer en le disant, jamais imposer dans un
> produit qui n'est pas le nôtre. `[non qualifié]` — statut pas encore tranché : **traiter comme
> une préférence** et remonter la question.
> Ce que ne couvre aucune règle ci-dessous : ne pas trancher, poser la question.

## Règles de design

- **[loi]** Chaque bloc majeur de liens de navigation est exposé dans un élément nav porteur d'une étiquette accessible distincte, et le contenu principal dans un unique main. `NAVIGATION-R01`
- **[loi]** Dans un bloc de navigation, la destination correspondant à la page affichée est la seule à porter aria-current, et son état courant est signalé par au moins un indice non chromatique en plus de la couleur. `NAVIGATION-R02`
- **[préférence]** Sous le seuil de compacité du shell, la navigation latérale devient un panneau hors-écran dont le scrim, le confinement du focus et la fermeture sont fournis par le composant overlay et non redéfinis par la navigation. `NAVIGATION-R03`
- **[préférence]** Le sommaire « sur cette page » liste les sections du document affiché, marque l'entrée correspondant à la section lue par aria-current et par un indice non chromatique, et complète la navigation principale sans s'y substituer. `NAVIGATION-R04`
- **[loi]** L'activation d'une entrée de sommaire mène à sa section par une ancre, et le défilement associé est instantané dès que l'utilisateur a demandé une réduction des animations ; l'indicateur actif reflète la position de lecture sans la piloter. `NAVIGATION-R05`
- **[loi]** Le premier élément focalisable du document est un lien qui mène directement au contenu principal ; il peut n'être visible qu'au focus, mais il doit alors le devenir. `NAVIGATION-R06`
- **[loi]** L'ordre de tabulation à travers la navigation préserve le sens et l'opérabilité du contenu, et aucun élément de la navigation ne retient le focus au clavier. `NAVIGATION-R07`

## Consignes d'implémentation

- **[préférence]** Le rythme vertical et l'indentation des sous-niveaux de la navigation latérale dérivent de l'échelle spacing, et l'état courant d'un lien combine un fond secondary ou un trait avec une variation de graisse, jamais la couleur seule. `NAVIGATION-U01`
- **[préférence]** L'entrée active du sommaire porte un trait latéral border de couleur primary et une graisse accrue en plus d'aria-current, ses espacements et retraits venant de spacing. `NAVIGATION-U02`
- **[préférence]** Le lien d'évitement est retiré du rendu visuel tant qu'il n'a pas le focus et devient pleinement visible au focus, au-dessus du contenu, avec l'anneau, le rayon et le fond issus des tokens. `NAVIGATION-U03`
- **[préférence]** Aucune valeur d'espacement, de couleur, de rayon ou de trait n'est écrite en dur dans la navigation : tout référence un token existant, et l'off-canvas applique les tokens d'overlay sans les redéfinir. `NAVIGATION-U04`

## Non couvert — poser la question, ne rien trancher

- Fil d'Ariane (breadcrumb) : Chemin dans l'arborescence.
- Barre de nav horizontale : Onglets de premier niveau en haut.


---

---
sujet: overlay
nature: foundations
resume: "Cette fondation porte la **couche au-dessus du flux** : ce qui recouvre le contenu au lieu de s'y insérer."
selon-contexte: []
source: OVERLAY-UX.md v1.0.0 + OVERLAY-UI.md v1.0.0
empreinte: sha256:767b9d6a8bef58d3
regles: {loi: 6, preference: 8, non_qualifie: 0}
---
# RULES — overlay (compilé, mode build)

> Extrait mécaniquement de la doctrine par `tools/compile-regles.py`. Ne pas éditer à la main.
>
> **Étiquettes.** `[loi]` — vrai de tout produit : appliquer, et signaler comme non-conformité.
> `[préférence]` — notre choix, pas une norme : proposer en le disant, jamais imposer dans un
> produit qui n'est pas le nôtre. `[non qualifié]` — statut pas encore tranché : **traiter comme
> une préférence** et remonter la question.
> Ce que ne couvre aucune règle ci-dessous : ne pas trancher, poser la question.

## Règles de design

- **[loi]** Tout superposé est soit modal, soit non-modal, et ce choix détermine l'intégralité de sa mécanique : présence d'un voile, piège de focus, inertie du fond, verrouillage du défilement, mode de fermeture et ancrage. `OVERLAY-R02`
- **[préférence]** Tout superposé applique un cran de l'échelle z-index du système plutôt qu'un entier codé en dur, dans l'ordre sticky < overlay (modal) < popover (non-modal ancré) < toast < tooltip. `OVERLAY-R03`
- **[loi]** Un superposé modal pose un voile entre le contenu devenu inerte et sa surface ; un superposé non-modal n'en pose jamais. Le voile partage la couche z-index du superposé et est rendu derrière sa surface. `OVERLAY-R04`
- **[préférence]** Un clic sur le voile ferme le superposé modal comme le ferait une annulation, sauf lorsqu'une perte de saisie est en jeu : le propriétaire du superposé demande alors confirmation avant de fermer. `OVERLAY-R05`
- **[loi]** À l'ouverture d'un superposé modal, le focus entre dans le superposé ; Tab et Maj+Tab bouclent à l'intérieur ; le fond est inerte, inatteignable au clavier comme au lecteur d'écran ; Échap ferme ; à la fermeture, le focus revient au déclencheur, ou à l'élément le plus pertinent si le déclencheur a disparu. `OVERLAY-R06`
- **[loi]** Un superposé non-modal ne piège jamais le focus et laisse le fond actif ; il se ferme en light-dismiss (Échap ou clic/focus en dehors), rend le focus au déclencheur et reste ancré à ce déclencheur. `OVERLAY-R07`
- **[loi]** Un superposé modal verrouille le défilement du fond et rend ce fond inerte tant qu'il est ouvert ; un superposé non-modal ne verrouille rien et ne rend rien inerte. `OVERLAY-R08`
- **[préférence]** L'entrée et la sortie d'un superposé utilisent les durées et courbes de MOTION — une grande surface relève de la durée lente — et respectent prefers-reduced-motion en supprimant le glissement ; l'ombre s'anime en opacité et jamais par interpolation de box-shadow. `OVERLAY-R09`

## Consignes d'implémentation

- **[préférence]** La surface d'un superposé modal applique le cran z-index.overlay et son voile vit dans la même couche, placé avant la surface dans le DOM afin d'être rendu derrière elle ; un superposé non-modal ancré applique z-index.popover. `OVERLAY-U01`
- **[préférence]** Le voile d'un superposé modal est un plan plein de couleur overlay.scrim, en position fixed et inset 0, couvrant la fenêtre et placé sous la surface ; aucun superposé non-modal ne pose de voile. `OVERLAY-U02`
- **[préférence]** La surface d'un superposé porte l'ombre elevation.overlay — jamais elevation.raised, réservée au survol cliquable —, le rayon radius.md et le fond background ; overlay consomme ces tokens sans en créer aucun. `OVERLAY-U03`
- **[loi]** À l'ouverture d'un superposé modal, le fond reçoit inert (à défaut aria-hidden) — non focalisable et invisible au lecteur d'écran — et le défilement du document est verrouillé ; à la fermeture, l'inertie et le verrou sont retirés et le focus revient au déclencheur. `OVERLAY-U04`
- **[préférence]** L'entrée et la sortie d'un superposé utilisent une durée MOTION — motion.slow pour une grande surface —, animent l'ombre elevation.overlay en opacité, et suppriment tout glissement sous prefers-reduced-motion. `OVERLAY-U06`
- **[préférence]** Aucune valeur d'empilement, d'ombre, de rayon, de durée ou de couleur n'est écrite en dur dans un superposé : tout référence z-index.*, overlay.scrim, elevation.overlay, radius.md, motion.* et border.* ; le toast conserve ses propres règles d'empilement et n'emprunte à overlay que le cran z-index.toast. `OVERLAY-U07`

## Non couvert — poser la question, ne rien trancher

- Ombre d'un superposé : Relief de la surface flottante.
- Anneau de focus interne : Focus d'un contrôle dans le superposé.
- Ordre de focus général : Séquence de tabulation de la page.


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
sujet: radius
nature: foundations
resume: "Ce fichier contient le raisonnement : ce que le rayon suit, l'imbrication, le pill."
selon-contexte: [alert, border, button, card, input]
source: RADIUS-UX.md v1.1.0 + RADIUS-UI.md v1.1.0
empreinte: sha256:b06ffc5dfc5424dd
regles: {loi: 2, preference: 7, non_qualifie: 0}
---
# RULES — radius (compilé, mode build)

> Extrait mécaniquement de la doctrine par `tools/compile-regles.py`. Ne pas éditer à la main.
>
> **Étiquettes.** `[loi]` — vrai de tout produit : appliquer, et signaler comme non-conformité.
> `[préférence]` — notre choix, pas une norme : proposer en le disant, jamais imposer dans un
> produit qui n'est pas le nôtre. `[non qualifié]` — statut pas encore tranché : **traiter comme
> une préférence** et remonter la question.
> Ce que ne couvre aucune règle ci-dessous : ne pas trancher, poser la question.

## Règles de design

- **[préférence]** Le rayon est une propriété d'identité et non d'état : il ne varie jamais entre repos, survol, focus, erreur ou sélection. `RADIUS-R02`
- **[préférence]** Le cran de rayon se choisit selon la taille et le type du composant, sur une échelle fermée et croissante. `RADIUS-R03`
- **[préférence]** Le rayon n'est jamais dérivé d'un pourcentage ni d'une fraction de la hauteur : c'est un cran choisi, qui ne croît pas proportionnellement à la taille. `RADIUS-R04`
- **[préférence]** Deux contrôles de même taille voisins dans une même composition partagent le même cran de rayon. `RADIUS-R05`
- **[loi]** Un coin intérieur n'est jamais plus rond que le coin extérieur qui le contient : au contact il épouse le rayon extérieur, à distance il vaut le rayon extérieur moins l'écart. `RADIUS-R06`
- **[loi]** Un anneau posé à l'extérieur d'un composant prend pour rayon celui du composant augmenté de son écart. `RADIUS-R07`
- **[préférence]** Le rayon plein est réservé aux contenus mono-ligne dont la forme est intrinsèquement une pilule ; aucun contrôle ni contenu susceptible de passer en multiligne ne le prend. `RADIUS-R08`
- **[préférence]** L'angle droit n'a pas de token dans l'échelle : rien n'est carré par défaut, et un besoin réel devrait ajouter explicitement un cran nul. `RADIUS-R10`
- **[préférence]** Le rayon suit la taille du composant et rien d'autre : ni son importance, ni son état, ni une préférence locale d'écran. `RADIUS-R12`


---

---
sujet: select
nature: components
resume: "Choisir **une** valeur parmi un ensemble **prédéfini et limité**."
selon-contexte: [border, input, overlay]
source: SELECT-UX.md v1.0.0 + SELECT-UI.md v1.0.0
empreinte: sha256:6c39265f766658fd
regles: {loi: 8, preference: 3, non_qualifie: 0}
---
# RULES — select (compilé, mode build)

> Extrait mécaniquement de la doctrine par `tools/compile-regles.py`. Ne pas éditer à la main.
>
> **Étiquettes.** `[loi]` — vrai de tout produit : appliquer, et signaler comme non-conformité.
> `[préférence]` — notre choix, pas une norme : proposer en le disant, jamais imposer dans un
> produit qui n'est pas le nôtre. `[non qualifié]` — statut pas encore tranché : **traiter comme
> une préférence** et remonter la question.
> Ce que ne couvre aucune règle ci-dessous : ne pas trancher, poser la question.

## Règles de design

- **[préférence]** Le select est réservé au choix unique dans une liste assez longue ou encombrante pour justifier d'être repliée ; en deçà du seuil retenu d'environ cinq options comparables d'un coup d'œil, le choix est présenté en radios visibles, une saisie libre relève du champ de texte et une bascule à effet immédiat du switch. `SELECT-R01`
- **[loi]** Le déclencheur d'un select affiche la valeur actuellement sélectionnée, ou à défaut un placeholder neutre qui n'est ni une option sélectionnable ni une valeur soumissible, et jamais une étiquette figée qui masquerait la sélection. `SELECT-R02`
- **[loi]** La liste d'un select est un superposé non modal : ancrée à son déclencheur, sans voile, sans piège de focus, refermée aussi bien par Échap que par un clic ou un focus à l'extérieur, et rendant le focus au déclencheur à la fermeture. `SELECT-R03`
- **[loi]** À l'ouverture de la liste, l'option sélectionnée — ou la première à défaut — devient l'option active sans que le focus du document quitte le déclencheur : l'option active est désignée par aria-activedescendant et rendue visible dans la liste. `SELECT-R04`
- **[loi]** Le select est intégralement opérable au clavier selon le motif combobox à sélection seule : fermé, les flèches, Entrée, Espace et toute frappe de caractère l'ouvrent, la frappe présélectionnant par correspondance ; ouvert, les flèches déplacent l'option active, Début et Fin vont aux extrêmes, Entrée et Espace sélectionnent et ferment, Échap ferme sans changer la valeur et Tab ferme en validant l'option active. `SELECT-R05`
- **[loi]** Le déclencheur d'un select expose role=combobox, aria-expanded et une relation programmatique vers sa liste, et son nom accessible reprend le libellé visible ; la liste expose role=listbox, chaque option role=option avec son état de sélection, et la valeur choisie est restituée comme nom et valeur du combobox. `SELECT-R06`
- **[loi]** Le select distingue visuellement trois choses différentes — l'option survolée, l'option active et l'option sélectionnée — et expose ses états : désactivé et alors non focalisable, vide et alors signalé par un placeholder neutre, en erreur et alors signalé sans que le select prenne en charge l'orchestration du message. `SELECT-R07`

## Consignes d'implémentation

- **[préférence]** Le déclencheur d'un select résout sa hauteur interactive, son rayon, son fond, sa couleur de texte et ses retraits sur les échelles de tokens, et porte une bordure délimitante contrastée à au moins 3:1, seule marque de la présence du contrôle ; son chevron est une icône en couleur courante. `SELECT-U01`
- **[préférence]** La liste d'un select reprend le niveau d'empilement, l'ombre, le rayon et le fond du superposé non modal, sans voile, et s'aligne en ancrage comme en largeur sur son déclencheur. `SELECT-U03`
- **[loi]** L'option sélectionnée d'une liste est marquée par un canal non chromatique — une coche — en plus de toute variation de couleur, et l'option active se distingue par une surface qui lui est propre. `SELECT-U04`
- **[loi]** L'ouverture et la fermeture de la liste empruntent leurs durées et leurs courbes aux tokens de mouvement, et se réduisent à une apparition sans glissement lorsque l'utilisateur a demandé moins de mouvement. `SELECT-U05`

## Non couvert — poser la question, ne rien trancher

- Options groupées : Regrouper par catégorie.
- Recherche dans la liste (combobox éditable) : Saisie qui filtre les options.
- Multi-sélection : Plusieurs valeurs à la fois.


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
sujet: surface
nature: foundations
resume: "Ce fichier contient le raisonnement : ce qu'est un plan, quand il mérite d'exister, ce qui le distingue et ce qui survit quand un canal tombe."
selon-contexte: [button, card, collection, color, elevation, input, modal, overlay, spacing, typography]
source: SURFACE-UX.md v1.0.0 + SURFACE-UI.md v1.0.0
empreinte: sha256:25cdf30aa5a01b17
regles: {loi: 6, preference: 15, non_qualifie: 0}
---
# RULES — surface (compilé, mode build)

> Extrait mécaniquement de la doctrine par `tools/compile-regles.py`. Ne pas éditer à la main.
>
> **Étiquettes.** `[loi]` — vrai de tout produit : appliquer, et signaler comme non-conformité.
> `[préférence]` — notre choix, pas une norme : proposer en le disant, jamais imposer dans un
> produit qui n'est pas le nôtre. `[non qualifié]` — statut pas encore tranché : **traiter comme
> une préférence** et remonter la question.
> Ce que ne couvre aucune règle ci-dessous : ne pas trancher, poser la question.

## Règles de design

- **[loi]** Une surface est un plan étendu qui porte du contenu et se distingue de son voisinage ; un aplat sans contenu est un décor et non une surface. `SURFACE-R02`
- **[préférence]** Le système expose quatre rôles de plan — fond de page, surface, surface visée, surface inversée — et un seul cran de profondeur entre le fond de page et la surface. `SURFACE-R03`
- **[préférence]** Le remplissage d'un plan au survol signale la visée, et le relief signale la pressabilité : ce sont deux signaux distincts, jamais synonymes. `SURFACE-R04`
- **[préférence]** Le remplissage de survol d'un plan n'est pas soumis au seuil de 3:1, mais les couples texte/fond qu'il crée sont vérifiés au même seuil que le repos. `SURFACE-R05`
- **[préférence]** Une surface se distingue par son remplissage, son trait, son rayon ou son élévation ; l'absence des quatre signifie que le plan n'a pas lieu d'exister. `SURFACE-R06`
- **[loi]** En mode de couleurs forcées, les remplissages de deux plans adjacents sont ramenés à la même couleur système et cessent de les distinguer, les ombres sont supprimées, et seul le trait survit en étant recoloré. `SURFACE-R07`
- **[loi]** Un plan qui constitue le seul signal d'identification d'un composant d'interface atteint 3:1 avec les couleurs adjacentes, et aucune ombre n'est comptée dans ce calcul. `SURFACE-R08`
- **[préférence]** Un plan devient une surface s'il porte un contenu nommable et autonome, si sa frontière doit être perçue, s'il change d'état, ou s'il vit sur une autre couche du flux. `SURFACE-R09`
- **[préférence]** L'espace est essayé avant le plan, et le plan avant le trait ; un plan qui ne fait rien que l'espace ne ferait pas n'est pas créé. `SURFACE-R10`
- **[préférence]** Les rôles de plan appartiennent au registre neutre : un plan neutre ne porte jamais d'état sémantique, et un fond sémantique n'est pas un rôle de plan. `SURFACE-R11`
- **[loi]** Le plan inversé est un rôle nommé qui se consomme avec son couple de texte et de trait, et jamais en réutilisant les jetons prévus pour fond clair. `SURFACE-R12`
- **[loi]** Un plan s'écarte du fond de page dans la direction que le thème impose — plus sombre en thème clair, plus clair en thème sombre — et les valeurs de plan appartiennent au thème. `SURFACE-R13`
- **[préférence]** Le système ne renforce aujourd'hui aucun plan sous la préférence de contraste élevé ; cette absence est une position déclarée et non un oubli. `SURFACE-R14`
- **[préférence]** Un plan situe le contenu et ne promet aucune action ; la promesse d'action vient du relief, du trait, du curseur et de la sémantique. `SURFACE-R17`

## Consignes d'implémentation

- **[préférence]** Tout plan référence l'un des quatre rôles nommés, qui détermine son usage, son seuil et les textes admis dessus. `SURFACE-U01`
- **[préférence]** Le remplissage d'un plan est peint sur une couche dédiée placée sous le contenu, et non sur l'élément porteur. `SURFACE-U02`
- **[préférence]** Le remplissage d'un plan se transitionne sur le cran rapide, l'ombre ne s'interpole jamais, et la préférence de mouvement réduit supprime le déplacement sans supprimer l'état final. `SURFACE-U03`
- **[préférence]** Chaque plan crée ses propres paires texte/fond, qui sont mesurées avant usage ; un texte secondaire ne se pose pas sur le plan de survol tant que la paire n'est pas déclarée. `SURFACE-U04`
- **[préférence]** Le plan inversé se consomme avec son texte et son trait inversés, jamais avec les jetons prévus pour fond clair. `SURFACE-U05`
- **[loi]** Une surface dont la frontière porte de l'information déclare une bordure en couleur système sous le mode de couleurs forcées. `SURFACE-U06`
- **[préférence]** Tout remplissage de plan référence un rôle de jeton ; les substituts de média ne sont pas des plans et sortent du périmètre. `SURFACE-U07`


---

---
sujet: switch
nature: components
resume: "Activer ou désactiver **une fonction, tout de suite**."
selon-contexte: [border]
source: SWITCH-UX.md v1.0.0 + SWITCH-UI.md v1.0.0
empreinte: sha256:77b26f89f1d9ef33
regles: {loi: 5, preference: 1, non_qualifie: 0}
---
# RULES — switch (compilé, mode build)

> Extrait mécaniquement de la doctrine par `tools/compile-regles.py`. Ne pas éditer à la main.
>
> **Étiquettes.** `[loi]` — vrai de tout produit : appliquer, et signaler comme non-conformité.
> `[préférence]` — notre choix, pas une norme : proposer en le disant, jamais imposer dans un
> produit qui n'est pas le nôtre. `[non qualifié]` — statut pas encore tranché : **traiter comme
> une préférence** et remonter la question.
> Ce que ne couvre aucune règle ci-dessous : ne pas trancher, poser la question.

## Règles de design

- **[loi]** Un switch est réservé aux bascules binaires dont l'effet est immédiat et n'appelle aucune validation ; une sélection binaire qui n'est appliquée qu'à la soumission d'un formulaire est une case à cocher, et l'un ne se substitue jamais à l'autre. `SWITCH-R01`
- **[loi]** L'état d'un switch se lit à un canal non chromatique — la position du pouce sur la piste — en plus de toute variation de couleur, et un libellé d'état accompagne la bascule quand la conséquence de l'état n'est pas évidente. `SWITCH-R03`
- **[loi]** Un switch porte un libellé qui nomme ce qu'il gouverne ; ce libellé est cliquable, il est contenu dans le nom accessible du contrôle, et les états désactivé et focalisé restent perceptibles. `SWITCH-R04`
- **[loi]** Un switch expose role=switch et aria-checked, bascule à la barre d'espace, et notifie son changement d'état par aria-checked plutôt que par le seul déplacement visuel du pouce. `SWITCH-R05`

## Consignes d'implémentation

- **[préférence]** La piste d'un switch est une pilule et son pouce un disque inscrit séparé des bords par un retrait constant ; l'état inactif oppose une piste de surface bordée à au moins 3:1 et un pouce de fond, l'état actif une piste primaire et un pouce en couleur sur primaire, la transition empruntant les tokens de mouvement. `SWITCH-U01`
- **[loi]** Quelle que soit la taille visuelle de la piste, la zone interactive d'un switch — libellé cliquable compris — atteint le seuil de cible renforcé de 44 × 44 px CSS. `SWITCH-U03`

## Non couvert — poser la question, ne rien trancher

- vs Checkbox : Sélection validée à la soumission d'un formulaire.
- vs Radio : Choix exclusif parmi plusieurs.
- Bascule qui appelle le serveur (asynchrone) : État d'attente, retour arrière si échec.


---

---
sujet: tabs
nature: components
resume: "Des onglets **découpent un même objet en vues exclusives** : un seul volet visible à la fois, et"
selon-contexte: [accessibility, border, button, link, motion, navigation]
source: TABS-UX.md v1.0.0 + TABS-UI.md v1.0.0
empreinte: sha256:447b8c3c656340eb
regles: {loi: 17, preference: 11, non_qualifie: 0}
---
# RULES — tabs (compilé, mode build)

> Extrait mécaniquement de la doctrine par `tools/compile-regles.py`. Ne pas éditer à la main.
>
> **Étiquettes.** `[loi]` — vrai de tout produit : appliquer, et signaler comme non-conformité.
> `[préférence]` — notre choix, pas une norme : proposer en le disant, jamais imposer dans un
> produit qui n'est pas le nôtre. `[non qualifié]` — statut pas encore tranché : **traiter comme
> une préférence** et remonter la question.
> Ce que ne couvre aucune règle ci-dessous : ne pas trancher, poser la question.

## Règles de design

- **[loi]** Un jeu d'onglets s'applique à un seul objet dont les volets sont des vues alternatives du même sujet, et non à des sujets distincts regroupés par commodité de mise en page. `TABS-R01`
- **[loi]** Les onglets sont écartés lorsque deux volets doivent être comparés simultanément, lorsque leur contenu doit rester trouvable par la recherche dans la page, lorsqu'il n'existe qu'un seul volet, ou lorsque les volets sont en réalité les étapes ordonnées d'un parcours. `TABS-R02`
- **[loi]** Des onglets n'affichent qu'un seul volet à la fois ; l'exclusivité est le critère qui les sépare d'un accordéon, dont plusieurs sections peuvent être ouvertes simultanément et lues à la suite. `TABS-R03`
- **[loi]** Lorsque l'usage réel conduit les utilisateurs à ouvrir successivement tous les onglets pour tout lire, le contenu relève d'un composant multi-ouvert et non d'un jeu d'onglets. `TABS-R04`
- **[préférence]** Une bascule d'onglet change de vue à l'intérieur de la même page : elle ne modifie pas l'URL et n'ajoute pas d'entrée dans l'historique, de sorte que le bouton Retour du navigateur ne défait jamais un changement d'onglet. `TABS-R05`
- **[loi]** Un jeu de volets qui doit être partageable par URL, indexable ou atteignable par le bouton Retour relève de la navigation : ses déclencheurs deviennent des liens et la sémantique de tablist est abandonnée au profit d'une navigation étiquetée, l'apparence visuelle des onglets pouvant être conservée. `TABS-R06`
- **[préférence]** Le nombre d'onglets reste restreint à ce qui tient sur une seule ligne dans la largeur disponible, aucun seuil numérique absolu n'étant fixé. `TABS-R07`
- **[loi]** Un jeu d'onglets ne se répartit jamais sur deux lignes : en cas de débordement, la liste d'onglets défile horizontalement ou le contenu est refondu. `TABS-R08`
- **[loi]** Le libellé d'un onglet est court et nominal — un ou deux mots — et n'est jamais une phrase complète ni un verbe d'action, un onglet ouvrant une vue et ne déclenchant pas une opération. `TABS-R09`
- **[loi]** L'onglet courant se distingue par au moins un canal non chromatique en plus de la couleur — poids typographique et trait ou fond porteur — et jamais par la couleur seule. `TABS-R10`
- **[loi]** L'état sélectionné de l'onglet courant est exposé programmatiquement par aria-selected, redondant avec le signal visuel : ni l'un ni l'autre n'est seul porteur de l'information. `TABS-R11`
- **[loi]** Deux modes d'activation d'un onglet coexistent : l'activation automatique, où le volet suit le focus, et l'activation manuelle, où les flèches ne déplacent que le focus et où Entrée ou Espace active l'onglet focalisé. `TABS-R12`
- **[loi]** L'activation automatique est le mode par défaut tant que le volet associé s'affiche sans latence perceptible, ce qui suppose son contenu déjà disponible ; dès que l'affichage d'un volet engage une requête, un calcul ou un rendu coûteux, l'activation manuelle s'impose. `TABS-R13`
- **[loi]** La liste porte role=tablist, chaque onglet role=tab et chaque volet role=tabpanel, et un seul onglet — le courant — reste dans l'ordre de tabulation avec tabindex 0, les autres en étant retirés avec tabindex -1, de sorte que la tabulation entre et sort de la liste en une étape. `TABS-R14`
- **[loi]** À l'intérieur de la liste d'onglets, les flèches gauche et droite déplacent le focus d'onglet en onglet avec bouclage du dernier au premier, Origine porte le focus au premier onglet et Fin au dernier ; le mode d'activation détermine si ce déplacement change aussi le volet affiché. `TABS-R15`
- **[loi]** Le conteneur du volet est inclus dans l'ordre de tabulation avec tabindex 0 lorsqu'il ne commence pas par un élément focalisable, et le couple onglet/volet se relie dans les deux sens par aria-controls et aria-labelledby. `TABS-R16`
- **[préférence]** Par défaut, le volet non courant est retiré du DOM plutôt que masqué, son maintien en mémoire devant être demandé explicitement. `TABS-R17`
- **[préférence]** Un volet contenant une saisie utilisateur que la bascule ne doit pas perdre reste monté et seulement masqué, au lieu d'être démonté : le coût de le garder en mémoire est inférieur au coût d'une saisie effacée silencieusement. `TABS-R18`
- **[loi]** Un jeu d'onglets n'a jamais d'état sans onglet sélectionné : en l'absence de valeur initiale explicite, le premier onglet monté devient courant, et il existe toujours un volet visible. `TABS-R19`
- **[préférence]** L'atteinte d'un onglet précis depuis l'extérieur de la page passe par un paramètre d'URL ou un fragment lu au montage pour initialiser la valeur, et non par une entrée d'historique poussée à chaque bascule. `TABS-R20`

## Consignes d'implémentation

- **[préférence]** La structure du composant est une racine porteuse du contexte, une liste portant role=tablist et son orientation, des onglets portant role=tab, et des volets portant role=tabpanel placés en frères de la liste ; la liste porte une étiquette accessible obligatoire sans laquelle aucun jeu d'onglets ne s'affiche. `TABS-U01`
- **[préférence]** La racine accepte soit une valeur contrôlée assortie de son gestionnaire de changement, soit une valeur initiale non contrôlée, jamais les deux logiques mêlées ; la variante visuelle et le mode d'activation sont des propriétés explicites dont les valeurs par défaut sont la variante ligne et l'activation automatique. `TABS-U02`
- **[préférence]** Un onglet et son volet se relient par une valeur partagée dont l'implémentation dérive les identifiants ainsi que les attributs aria-controls et aria-labelledby, à partir d'un identifiant de base unique généré au montage et jamais codé en dur. `TABS-U03`
- **[préférence]** La liste d'onglets défile horizontalement et ne revient jamais à la ligne ; la variante ligne repose sur un séparateur bas de rôle délimitant, la variante pastille sur une piste au rayon plein bordée, et les espacements des deux variantes proviennent de l'échelle d'espacement. `TABS-U04`
- **[préférence]** Le texte d'un onglet reprend la famille et la graisse de base du corps de texte, seul le cran de taille variant avec la densité de la variante, et ses paddings proviennent de l'échelle d'espacement plutôt que d'une valeur en pixels. `TABS-U05`
- **[loi]** Le signal de l'onglet courant est porté par deux propriétés simultanées — le poids typographique renforcé et un trait ou un fond porteur — dont au moins une est non chromatique, et jamais par la seule couleur du texte. `TABS-U06`
- **[préférence]** Les transitions d'état d'un onglet empruntent la durée courte et la courbe sortante du mouvement, et l'anneau de focus n'est jamais animé. `TABS-U07`
- **[loi]** Le volet inclus dans l'ordre de tabulation reçoit un anneau de focus visible à l'arrivée au clavier, y compris lorsqu'il est vide, et le volet non courant maintenu monté est masqué par l'attribut natif hidden. `TABS-U08`

## Non couvert — poser la question, ne rien trancher

- Comparateur de plans tarifaires : Deux offres à regarder en même temps, pas l'une après l'autre.
- Formulaire long découpé en onglets : Champs d'une même soumission répartis en volets exclusifs.
- Deux volets à comparer côte à côte : Le contenu masqué est précisément ce qu'on veut voir en même temps.
- Contenu cherché au Cmd+F : Le volet non monté ou masqué échappe à la recherche de page.
- Un seul volet disponible : Un onglet unique n'est pas un choix — habillage inutile.
- Étapes d'un parcours imposé : Ordre contraint, pas de bascule libre — c'est un stepper.
- Sujets sans rapport logés côte à côte : Les volets ne décrivent pas le même objet.
- Onglet désactivé : Fonctionnalité verrouillée (plan, permission) rendue non activable.
- Widget avec scroll interne à préserver : Position de défilement à conserver entre deux visites du volet.
- Badge de compteur sur un onglet : Ex. « Messages (3) » — affichage d'un nombre sur le libellé.
- Regroupement multi-ouvert : Plusieurs sections ouvertes à la fois.
- Bascule partageable par URL à chaque clic : Historique poussé à chaque changement de volet.
- Superposé qui recouvre et piège : Contenu qui masque le reste de l'écran.


---

---
sujet: toast
nature: components
resume: "Ce fichier contient le raisonnement : tone, timing, actions, empilement, position, instrument"
selon-contexte: [adaptive, alert, button, emotion, motion, voice]
source: TOAST-UX.md v1.0.0 + TOAST-UI.md v1.1.0
empreinte: sha256:db75eae28a834e4b
regles: {loi: 7, preference: 23, non_qualifie: 0}
---
# RULES — toast (compilé, mode build)

> Extrait mécaniquement de la doctrine par `tools/compile-regles.py`. Ne pas éditer à la main.
>
> **Étiquettes.** `[loi]` — vrai de tout produit : appliquer, et signaler comme non-conformité.
> `[préférence]` — notre choix, pas une norme : proposer en le disant, jamais imposer dans un
> produit qui n'est pas le nôtre. `[non qualifié]` — statut pas encore tranché : **traiter comme
> une préférence** et remonter la question.
> Ce que ne couvre aucune règle ci-dessous : ne pas trancher, poser la question.

## Règles de design

- **[loi]** Le toast confirme l'issue immédiate d'une action déclenchée par l'utilisateur lorsque cette confirmation n'a pas besoin de rester consultable. `TOAST-R05`
- **[loi]** Le toast n'est employé ni pour une condition qui dure, ni pour une décision qui doit bloquer l'utilisateur, ni pour du contenu promotionnel. `TOAST-R06`
- **[préférence]** Le toast porte l'un des quatre tones info, success, warning ou danger, identiques à ceux de l'alert ; il n'existe pas de tone neutre. `TOAST-R08`
- **[préférence]** Les tones warning et danger sont autorisés sur un toast à la seule condition que la condition grave dispose d'un répondant durable ailleurs dans l'interface ; un toast n'est jamais l'unique porteur d'un état qui persiste. `TOAST-R09`
- **[loi]** Le minuteur d'un toast se suspend intégralement au survol du pointeur et au focus clavier, et ne reprend son décompte qu'à leur sortie. `TOAST-R10`
- **[loi]** Un toast n'est jamais le seul porteur d'une information : l'état qu'il confirme reste lisible dans l'écran sous-jacent après sa disparition. `TOAST-R11`
- **[préférence]** La durée d'affichage d'un toast ne descend jamais sous cinq secondes, qu'il porte une action ou non. `TOAST-R12`
- **[préférence]** Un toast porte au plus une action ; il n'expose jamais une seconde sortie ni un second lien. `TOAST-R13`
- **[préférence]** L'action d'un toast est soumise à la même suspension de minuteur que son texte, afin que la fenêtre de décision annoncée reste effective au survol comme au focus clavier. `TOAST-R14`
- **[préférence]** Au plus trois toasts sont affichés simultanément. `TOAST-R16`
- **[préférence]** Une pile de toasts s'ordonne par ordre chronologique d'arrivée et non par gravité décroissante, contrairement à une pile d'alerts qui empile des conditions simultanément vraies. `TOAST-R17`
- **[préférence]** Lorsque le plafond d'empilement est atteint, le toast le plus ancien sort ; les toasts ne sont jamais agrégés en un message de synthèse. `TOAST-R18`
- **[préférence]** La position et la largeur d'un toast sont déterminées par l'espace du conteneur qui l'héberge et non par un ancrage fixe à un coin du viewport. `TOAST-R19`
- **[préférence]** Le moment E-motion « réussite d'un envoi ou d'une soumission » s'incarne dans le toast et non dans l'alert. `TOAST-R21`
- **[préférence]** L'instrument illustration ne s'active que sur un toast seul à l'écran, jamais sur un toast qui rejoint une pile existante. `TOAST-R22`
- **[loi]** Un toast confirme un événement passé et ne peut jamais être le seul endroit où vit une information qui compte encore. `TOAST-R27`

## Consignes d'implémentation

- **[préférence]** Le toast porte elevation.overlay, seul écart de relief avec l'alert qui n'en porte aucune : le relief signale la superposition, il n'est pas un décor. `TOAST-U01`
- **[préférence]** Le toast n'expose pas de bouton de fermeture par défaut, la suspension du minuteur au survol et au focus étant tenue pour couvrir le besoin de temps de lecture supplémentaire. `TOAST-U02`
- **[préférence]** La durée d'affichage d'un toast vaut la durée de base, augmentée d'une extension par mot au-delà de huit mots et d'un bonus si une action est présente, bornée par une valeur de plafond. `TOAST-U03`
- **[loi]** Le minuteur se suspend au survol du toast et à tout focus contenu dans le toast, action comprise, et reprend son décompte à leur sortie sans jamais repartir de zéro. `TOAST-U04`
- **[préférence]** Le minuteur est implémenté par un unique délai programmé par toast, annulé et relancé aux entrées et sorties de survol ou de focus, jamais par une boucle d'intervalle recalculée en continu. `TOAST-U05`
- **[préférence]** La file de toasts est en premier entré premier sorti avec un plafond de trois ; l'arrivée d'un quatrième toast fait sortir le plus ancien selon la chorégraphie de disparition normale et non par coupure brutale. `TOAST-U06`
- **[préférence]** Chaque toast d'une pile possède son propre minuteur indépendant ; l'arrivée d'un nouveau toast ne réinitialise pas le temps déjà écoulé des précédents. `TOAST-U07`
- **[préférence]** La région qui héberge la pile de toasts est déclarée conteneur de requête sur l'axe inline, et non ancrée en dur au viewport. `TOAST-U08`
- **[préférence]** Un élément déclaré conteneur de requête et sorti du flux normal reçoit obligatoirement une largeur explicite : la containment de taille l'empêche de tirer sa largeur de son contenu, et un plafond de largeur seul ne détermine aucune largeur de départ. `TOAST-U09`
- **[préférence]** En état compact la région de toasts occupe la pleine largeur utile et empile du bas vers le haut ; en états regular et expanded elle est ancrée en bas au centre, à la largeur maximale de structure. `TOAST-U10`
- **[préférence]** Quand l'instrument illustration s'active, le glyphe est dessiné par animation de son tracé, jamais rendu par une illustration statique importée. `TOAST-U11`
- **[préférence]** L'animation de l'instrument suit trois actes — anticipation, tracé du glyphe, résolution chromatique — dont la somme des durées ne dépasse pas la durée de célébration. `TOAST-U12`
- **[loi]** Sous prefers-reduced-motion, les actes de mouvement de l'instrument sont supprimés et l'état final est atteint par bascule instantanée, sans perte de l'information portée. `TOAST-U13`
- **[préférence]** La condition d'activation de l'instrument est évaluée à l'injection du toast et non en continu : un acte déjà commencé va à son terme, mais aucun nouveau moment illustré ne démarre tant que la pile compte plus d'un toast. `TOAST-U14`


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


---

---
sujet: voice
nature: languages
resume: "Ce fichier contient le raisonnement : quelle est la voix du produit, comment le ton s'adapte à l'utilisateur, pourquoi le mot est le canal d'information le plus fiable du système."
selon-contexte: [alert, button, card, color, emotion, form, iconography, input, laws, motion, typography]
source: VOICE-UX.md v1.3.1 + VOICE-UI.md v1.2.0
empreinte: sha256:b030de4474fdcbc5
regles: {loi: 25, preference: 10, non_qualifie: 0}
---
# RULES — voice (compilé, mode build)

> Extrait mécaniquement de la doctrine par `tools/compile-regles.py`. Ne pas éditer à la main.
>
> **Étiquettes.** `[loi]` — vrai de tout produit : appliquer, et signaler comme non-conformité.
> `[préférence]` — notre choix, pas une norme : proposer en le disant, jamais imposer dans un
> produit qui n'est pas le nôtre. `[non qualifié]` — statut pas encore tranché : **traiter comme
> une préférence** et remonter la question.
> Ce que ne couvre aucune règle ci-dessous : ne pas trancher, poser la question.

## Règles de design

- **[loi]** La voix du produit reste constante d'une surface à l'autre tandis que le ton s'ajuste à l'état de la personne qui lit (routine, erreur, panne, succès, attente, destruction). `VOICE-R02`
- **[préférence]** Le registre du produit est productif et non expressif : clarté, précision et sobriété, sans humour d'apparat, superlatif marketing ni sur-célébration. `VOICE-R03`
- **[préférence]** Le relèvement de registre ne s'étend jamais à une erreur, à une action destructive ni à une action fréquente ou réflexe : ces cas restent strictement productifs. `VOICE-R06`
- **[loi]** Le texte est le canal d'information de dernier recours du système : toute information portée par la couleur, le mouvement ou la forme reste disponible en mots, car le mot survit à la couleur coupée, au mouvement coupé, à l'icône incomprise et au lecteur d'écran. `VOICE-R07`
- **[loi]** Le libellé d'un lien ou d'un bouton se comprend hors de son contexte : il nomme la destination ou la conséquence de l'action, jamais une formule générique. `VOICE-R08`
- **[loi]** L'écriture d'interface dit la chose la plus simple qui soit vraie : phrases courtes, voix active, un sujet par phrase, le mot courant plutôt que le mot savant. `VOICE-R09`
- **[loi]** Aucun jargon technique, code d'erreur ni sigle interne n'est exposé à l'utilisateur, et un acronyme inévitable est développé à sa première occurrence. `VOICE-R10`
- **[loi]** La concision retire les mots vides et jamais l'information nécessaire : elle ne justifie pas de supprimer la cause d'un problème ni le moyen de le corriger. `VOICE-R11`
- **[préférence]** Le système tient une table de correspondance entre l'état de la personne et le ton employé, qui fixe notamment un succès routinier bref et factuel, sans félicitation ni célébration. `VOICE-R12`
- **[loi]** Un message d'erreur ne qualifie jamais la personne : il décrit en texte l'écart constaté et la correction attendue, et le produit prend à son compte les défaillances système. `VOICE-R13`
- **[loi]** La voix ne change pas d'un écran à l'autre : ni familiarité soudaine, ni formalisme intermittent. `VOICE-R14`
- **[loi]** Un concept est désigné par un seul mot dans toute l'interface, et ce mot ne désigne pas un autre concept ailleurs. `VOICE-R15`
- **[loi]** Le niveau de lecture visé reste bas, au service de l'accessibilité cognitive et des personnes non natives ; aucun seuil chiffré n'est fixé à ce jour, et cette absence est une position assumée. `VOICE-R16`
- **[loi]** Le texte d'interface s'écrit traduisible : aucune phrase construite par concaténation de fragments à l'exécution, aucune longueur codée en dur, et pas d'idiome ni de jeu de mots qui ne franchisse pas les langues. `VOICE-R17`
- **[loi]** Le mot descriptif porte l'accessibilité non visuelle — texte alternatif utile, nom accessible qui dit l'action, texte de lien signifiant — et le nom accessible d'un contrôle contient le texte visible de son libellé. `VOICE-R18`
- **[loi]** Le mot porte l'information quand les autres canaux tombent : il l'énonce sans blâmer, dans un vocabulaire constant, la clarté primant sur l'élégance. `VOICE-R20`

## Consignes d'implémentation

- **[loi]** Les titres, boutons, labels et menus s'écrivent en sentence case : une majuscule au premier mot, le reste en minuscules hors noms propres. `VOICE-U02`
- **[préférence]** Les capitales sont réservées aux étiquettes rendues avec le style de label (pastilles, badges, kickers) et ne portent jamais une phrase ni un libellé d'action. `VOICE-U03`
- **[loi]** Un libellé court, un label, un titre ou un bouton ne se termine pas par un point ; la ponctuation finale revient dès qu'il y a une phrase complète d'aide ou d'erreur, ou au moins deux phrases. `VOICE-U04`
- **[loi]** Les points de suspension signalent une action qui demande une étape supplémentaire avant de s'exécuter et ne figurent jamais sur une action qui agit immédiatement. `VOICE-U05`
- **[loi]** La ponctuation suit la norme typographique française — espace insécable avant les deux-points, le point-virgule, le point d'exclamation et le point d'interrogation, guillemets français en contenu — la ponctuation ASCII n'étant conservée que dans les blocs de code et de données. `VOICE-U06`
- **[préférence]** Le point d'exclamation est proscrit dans l'interface produit, hors message de bienvenue rare et hors microcopy de résolution d'un moment E-motion catalogué. `VOICE-U07`
- **[loi]** Toute donnée numérique s'écrit en chiffres et non en lettres, les lettres restant réservées à un usage rhétorique hors données. `VOICE-U08`
- **[loi]** Les nombres suivent le format de la locale — séparateur de milliers par espace insécable, virgule décimale, espace insécable avant l'unité et le symbole — et ce format n'est jamais codé en dur dans une chaîne : il est délégué au formatage sensible à la locale. `VOICE-U09`
- **[loi]** Une date affichée n'est jamais ambiguë entre les conventions de locale, et le format long avec le mois nommé est préféré partout où la place le permet. `VOICE-U10`
- **[loi]** Le temps relatif n'est employé qu'en deçà de 24 à 48 heures, au-delà desquelles la date absolue s'affiche, et tout horodatage relatif est doublé de la date absolue dans sa valeur machine. `VOICE-U11`
- **[préférence]** La prose de lecture ne dépasse pas la mesure de lecture maximale du système, les libellés d'action restent courts, et une troncature ne masque jamais une information décisive, dont la version complète reste accessible. `VOICE-U12`
- **[préférence]** Le lexique du produit fixe un mot unique par concept, l'engagement portant sur le fait de ne pas mélanger deux désignations pour la même action plutôt que d'interdire des synonymes en soi. `VOICE-U13`
- **[loi]** Un message d'erreur ne porte ni interjection de fausse légèreté, ni emoji, ni point d'exclamation : un incident se traite avec calme et ne se minimise pas. `VOICE-U14`
- **[loi]** Un message d'erreur énonce ce qui s'est passé, pourquoi et comment corriger, sans attribuer de faute à la personne, et fournit la correction dès qu'elle est connue. `VOICE-U15`
- **[préférence]** Un succès routinier se confirme brièvement et au passé accompli, sans félicitation ni point d'exclamation. `VOICE-U16`
- **[préférence]** Le microcopy de résolution d'un moment E-motion catalogué est la seule exception au gabarit de succès et peut se réchauffer d'un cran, jamais par défaut. `VOICE-U17`
- **[loi]** Un état vide énonce la situation et pointe la première action qui la comble, en distinguant l'absence de résultat d'une recherche de l'absence de contenu encore créé. `VOICE-U18`
- **[loi]** Une confirmation destructive nomme la conséquence exacte de l'action, et son bouton porte le verbe de cette action plutôt qu'une formule générique. `VOICE-U19`
- **[préférence]** Un état d'attente énonce au présent progressif ce qui est en train de se passer, le mot doublant l'indicateur visuel sans le remplacer. `VOICE-U20`

## Non couvert — poser la question, ne rien trancher

- Consentement / mentions : Un consentement ou une mention légale s'affiche.
- Sens de lecture (RTL) : Une langue se lit de droite à gauche.
