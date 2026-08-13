---
component: card
layer: ux
version: 1.4.1 # 1.4.1 (2026-07-21) : le pattern collection existe — la note Kanban renvoie à son extension à naître collection-kanban ; aucune règle modifiée. 1.4.0 (2026-07-21) : rattachement nommé Interaction/Motion/Voice, contrat reduced-motion chevron/dépliage, E-motion sans objet raisonné. 1.3.0 : rattachement au Langage d'interaction (surface statique calme, cible honnête) et à l'Architecture adaptative (états selon le conteneur sans perte d'information essentielle). 1.2.1 : vocabulaire aligné sur le modèle style × tone du bouton.
last_updated: 2026-07-21
companion: CARD-UI.md
confidence: mixed
---

# Card (carte) — Couche UX

> Ce fichier contient le raisonnement : modes d'interaction, composition, empty state, risques. Tokens et techniques dans `CARD-UI.md`.

## Note de transposition (à lire en premier)

RÈGLE [CARD-R01] : les axes de la carte sont **interaction_mode / density** — pas les 3 axes du bouton.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Le modèle de variantes de la carte repose sur deux axes seulement — mode d'interaction et densité — et ne transpose pas les trois axes du bouton.

RÈGLE [CARD-R02] : **l'axe `style` n'existe pas ici.** Le style de conteneur (outlined / elevated — cf. Material Design) pourrait y ressembler, mais c'est une décision d'identité visuelle prise une fois pour tout le produit, pas un choix par instance : il vit dans CARD-UI.md comme token, pas ici comme axe.
STATUT : note de méthode
SOURCE : S8, S30
ÉNONCÉ : Le style de conteneur (contour, élévation, remplissage) n'est pas un axe de variante de la carte : c'est une décision d'identité visuelle prise une fois pour tout le produit et portée par la couche UI, non un choix par instance.
MESURE : le style de conteneur n'est pas exposé comme propriété d'instance dans l'API du composant

> **Pourquoi** : la carte vit presque toujours **en collection** (grille, liste, dashboard), où la hiérarchie est *volontairement absente* — le régime du "menu à choix parallèles" documenté comme exception dans BUTTON-UX.md, devenu ici le cas normal.

RÈGLE [CARD-R03] : **tone n'existe pas** : le conteneur n'a pas de sémantique propre — la charge sémantique appartient au *contenu* de la carte (un badge de statut, un texte), jamais à la carte elle-même. Une carte "d'erreur" ou "d'alerte" n'est pas une variante de carte : c'est un autre composant (alert).
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : La carte n'a pas de sémantique propre : la charge sémantique appartient à son contenu, et une surface porteuse d'un sens d'alerte ou d'erreur relève d'un autre composant, pas d'une variante de carte.
MESURE : aucune variante de carte ne porte un nom de tone sémantique (succès, avertissement, erreur, information)

RÈGLE [CARD-R04] : seule exception apparente — l'état "sélectionné" d'une carte sélectionnable : un état d'interaction, pas un tone.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : L'état « sélectionné » d'une carte sélectionnable est un état d'interaction et non une variante sémantique du conteneur.

> **Pourquoi** : Polaris les sépare explicitement (Card vs Alert card).

RÈGLE [CARD-R05] : **size se réduit à la densité** (comfortable / compact) : la hauteur d'une carte est dictée par son contenu et sa largeur par la grille — pas de sm/md/lg. La densité module le padding interne et répond à la même question que size ("quelle est la densité du contexte ?") sans fixer de dimensions.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : La carte n'a pas d'axe de taille : sa hauteur est dictée par son contenu et sa largeur par la grille ; seule subsiste une densité qui module l'espacement interne.
MESURE : aucune variante de carte ne fixe de hauteur ni de largeur en dur

RÈGLE [CARD-R06] : les axes réels (issus du benchmark, notamment des 4 variantes de tile chez IBM Carbon) :
STATUT : note de méthode
SOURCE : S3
ÉNONCÉ : Les deux axes de la carte sont le mode d'interaction — statique, cliquable, sélectionnable, dépliable — qui détermine ce que la carte a le droit de contenir, et la densité.
  1. **Mode d'interaction** — static / clickable / selectable / expandable. C'est l'axe structurant : il détermine ce que la carte a le droit de contenir (une carte cliquable ne peut pas contenir de CTA imbriqué) et toutes les contraintes d'accessibilité.
  2. **Densité** — comfortable / compact.

RÈGLE [CARD-R07] : la présence d'une image, le nombre d'actions, la présence d'un titre ne sont **pas** des axes : ce sont des *slots* de composition (media / header / corps / zone d'actions), optionnels et combinables — l'équivalent de "Forme et contenu" chez le bouton.
STATUT : note de méthode
SOURCE : S5, S29
ÉNONCÉ : La présence d'un media, d'un titre ou d'actions n'est pas un axe de variante mais un jeu d'emplacements de composition, optionnels et combinables.

Principe retenu : **plus un composant est un conteneur, moins il a d'axes propres** — sa variabilité se déplace vers ce qu'il contient (form, cas extrême, n'a aucun axe). (Cheminement du test de transposition : cf. DECISIONS.md.)

## Partage d'autorité avec BUTTON-UX.md

RÈGLE [CARD-R08] : **la règle de cardinalité** ("un seul bouton d'action principal par carte, actions secondaires en icônes") vit ici (section "Zone d'actions") — ce fichier fait autorité sur le nombre et la position des actions dans une carte.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : L'autorité sur le nombre et la position des actions à l'intérieur d'une carte appartient au document de la carte, pas à celui du bouton.

RÈGLE [CARD-R09] : **la contrainte de zone tactile en grille dense** reste dans BUTTON-UX.md : c'est une propriété du bouton (son padding, son seuil de 44px), pas de la carte — la carte n'a pas à connaître les tokens du bouton.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : L'autorité sur la zone tactile d'un bouton, y compris en grille dense, reste au document du bouton : la carte n'a pas à connaître les tokens du bouton.

(Décision : cf. DECISIONS.md.)

## But

Une carte regroupe des informations liées à **un seul sujet** en une unité visuelle autonome, au sein d'une collection ou d'une page. Contrairement au bouton (qui déclenche) et à l'input (qui capture), la carte **organise et donne accès** : c'est un résumé qui sert de point d'entrée vers un contenu plus complet. Toute règle ci-dessous découle de ce statut de conteneur : la carte ne porte pas de sens en propre, elle donne une forme lisible à ce qu'elle contient.

## Application du langage d'interaction

RÈGLE [CARD-R10] : une Card statique exprime l'intention **consulter** : containment calme, aucune réaction de
STATUT : note de méthode
SOURCE : S13, S25
ÉNONCÉ : Chaque mode d'interaction de la carte incarne une intention du langage d'interaction — consulter pour la carte statique, naviguer pour la carte cliquable, choisir pour la carte sélectionnable — et la carte cliquable délègue sa cible aux règles du lien plutôt que d'en redéfinir la sémantique.
clic. Une Card clickable exprime une **navigation** et délègue sa cible à un vrai Link
(`LINK-UX.md`). Une Card selectable exprime un **choix** avec un contrôle et un état programmatiques.

RÈGLE [CARD-R11] : le mode d'interaction est reconnaissable au repos. Le hover confirme la cible ; il ne révèle
STATUT : parti pris d'identité
SOURCE : S13
ÉNONCÉ : Le mode d'interaction d'une carte est reconnaissable au repos ; le survol confirme une cible déjà annoncée et ne révèle jamais après coup qu'une carte était cliquable.
MESURE : aucun signal d'affordance d'une carte n'est porté exclusivement par un sélecteur de survol
pas après coup qu'une Card était cliquable.

RÈGLE [CARD-R12] : l'adaptation au conteneur peut changer disposition, densité et divulgation d'informations
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : L'adaptation d'une carte à la largeur de son conteneur peut changer sa disposition, sa densité et la divulgation d'informations secondaires, jamais son mode d'interaction, son sujet, sa destination ni les informations nécessaires pour décider.
MESURE : à toutes les largeurs, une carte conserve le même mode d'interaction et la même destination
secondaires. Elle ne change jamais le mode d'interaction, le sujet, la destination ni les informations
nécessaires pour décider.

RÈGLE [CARD-R13] : rattachement nommé — cette section applique `INTERACTION-UX.md`. La Card statique incarne l'intention **consulter** de son § « Les six intentions » (« lire une information organisée » — expression canonique explicitement listée : Texte, Card statique, Panel) : elle organise sans se donner pour une cible.
STATUT : note de méthode
SOURCE : S13
ÉNONCÉ : Le traitement de la carte se rattache nommément au langage d'interaction : la carte statique y est l'expression canonique de l'intention consulter et organise sans se donner pour une cible.

RÈGLE [CARD-R14] : les deux lois d'affordance qui gouvernent la Card sont nommées — loi 3 « une surface organise sans promettre un clic » (une Card statique reste calme, ne copie jamais l'apparence d'un contrôle) et loi 4 « la profondeur explique une couche » (l'élévation au survol indique un changement d'état, elle ne décore pas — d'où l'`elevation.raised` réservé au hover cliquable, jamais au repos généralisé).
STATUT : note de méthode
SOURCE : S13
ÉNONCÉ : Deux lois d'affordance gouvernent la carte et sont nommées plutôt que réécrites : une surface organise sans promettre un clic, et la profondeur explique un changement de couche au lieu de décorer.

> **Pourquoi** : la Card doit passer le « Test de reconnaissance » d'`INTERACTION-UX.md` — en niveaux de gris et sans hover, une Card statique se distingue d'une Card cliquable, et son rôle (consulter) ne se confond pas avec agir ou naviguer. Un « non » à ce test n'appelle pas plus d'effets mais un meilleur mode d'interaction ou une meilleure structure.

## Quand l'utiliser / ne pas l'utiliser

RÈGLE [CARD-R15] : utiliser pour parcourir du contenu hétérogène où chaque item se suffit à lui-même : dashboard, flux de contenus variés, catalogue où l'image porte l'essentiel de la décision.
STATUT : parti pris d'identité
SOURCE : S1, S29
ÉNONCÉ : La carte convient au parcours de contenus hétérogènes dont chaque élément se suffit à lui-même : tableau de bord, flux varié, catalogue où l'image porte l'essentiel de la décision.

RÈGLE [CARD-R16] : ne pas utiliser pour comparer ou rechercher parmi des items homogènes — une liste ou une table est alors supérieure.
STATUT : parti pris d'identité
SOURCE : S2
ÉNONCÉ : La carte ne convient pas à la comparaison ni à la recherche parmi des éléments homogènes, où une liste ou une table est supérieure.

> **Pourquoi** : la carte dégrade la scannabilité et rend la comparaison difficile (positions d'information variables d'une carte à l'autre). C'est le point le plus contre-intuitif du benchmark : le réflexe "des cartes, c'est plus moderne qu'une liste" est explicitement identifié comme une erreur par NN/g.

RÈGLE [CARD-R17] : cas limite fréquent — une liste de résultats de recherche produits : le critère qui tranche est le mode de lecture dominant : *découverte* (browse) → carte, *évaluation comparative* → liste/table, quitte à proposer les deux modes.
STATUT : parti pris d'identité
SOURCE : S2
ÉNONCÉ : Lorsqu'un même écran peut relever des deux régimes, le critère qui tranche est le mode de lecture dominant : la découverte appelle la carte, l'évaluation comparative appelle la liste ou la table, quitte à offrir les deux modes.

CONFIANCE : établi — NN/g, argumenté par mécanisme (scannabilité), pas chiffré.

## Mode d'interaction (l'axe structurant)

### Static (carte-conteneur)

RÈGLE [CARD-R18] : présenter un groupe d'informations, sans que la carte elle-même soit une cible. Les éléments interactifs (boutons, liens) vivent *à l'intérieur* et sont les seules cibles.
STATUT : parti pris d'identité
SOURCE : S3
ÉNONCÉ : Une carte statique présente un groupe d'informations sans être elle-même une cible ; les seules cibles sont les éléments interactifs placés à l'intérieur.
MESURE : aucun gestionnaire d'activation n'est posé sur le conteneur d'une carte statique

RÈGLE [CARD-R19] : c'est le seul mode qui accepte librement plusieurs éléments interactifs internes.
STATUT : parti pris d'identité
SOURCE : S3, S4
ÉNONCÉ : Le mode statique est le seul qui accepte librement plusieurs éléments interactifs internes.

> **Erreur fréquente** : donner à une carte statique un style qui suggère la cliquabilité (ombre au survol, curseur pointer) — l'utilisateur clique dans le vide et perd confiance dans les affordances du produit.

### Clickable (carte-cible)

RÈGLE [CARD-R20] : toute la surface de la carte est une seule et même cible — typiquement une navigation vers le détail du sujet.
STATUT : parti pris d'identité
SOURCE : S1, S3
ÉNONCÉ : Dans une carte cliquable, toute la surface constitue une cible unique, typiquement une navigation vers le détail du sujet.
MESURE : une carte cliquable n'expose qu'une seule cible d'activation pour l'ensemble de sa surface

> **Pourquoi** : l'intérêt est ergonomique — une grande cible est plus facile à atteindre qu'un petit lien (loi de Fitts).

RÈGLE [CARD-R21] : règle absolue — une carte cliquable ne contient **aucun élément interactif imbriqué**.
STATUT : note de méthode
SOURCE : S4, S24
ÉNONCÉ : L'interdiction d'imbriquer un élément interactif dans une carte cliquable n'est pas propre à la carte : elle renvoie à la règle du lien, qui interdit tout descendant interactif, et n'est pas réécrite ici.
MESURE : aucun élément interactif n'est descendant de l'élément qui rend la carte cliquable

> **Pourquoi** : un lien dans un lien ou un bouton dans une cible cliquable produit un ordre de tabulation incohérent et des annonces de lecteur d'écran imprévisibles — ce n'est pas une dégradation esthétique, c'est une exclusion.

RÈGLE [CARD-R22] : règle d'implémentation — la cliquabilité vient d'un vrai lien (ou bouton) sémantique étendu à la surface de la carte — jamais d'un `div` avec un gestionnaire de clic, invisible au clavier et au lecteur d'écran (technique exacte dans CARD-UI.md).
STATUT : note de méthode
SOURCE : S6, S9
ÉNONCÉ : La technique qui rend une carte cliquable renvoie aux règles du lien : la cliquabilité vient d'un élément sémantique réel étendu à la surface, jamais d'un conteneur inerte muni d'un gestionnaire de clic.
MESURE : aucune surface de carte navigable n'est portée par un élément non interactif muni d'un gestionnaire de clic

RÈGLE [CARD-R23] : si carte entièrement cliquable *et* boutons d'action internes sont tous deux nécessaires — les actions internes doivent être des *siblings* dans le DOM avec des cibles dédiées, et le conflit doit être une décision consciente, pas un accident (voir "Zone d'actions").
STATUT : implémentation de référence
SOURCE : S6, S9, S27
ÉNONCÉ : Quand une carte cliquable doit malgré tout porter des actions, celles-ci sont des éléments frères dans le document, dotés de cibles propres et distinctes, et cette coexistence est arbitrée explicitement plutôt que subie.
MESURE : les actions d'une carte cliquable ne sont pas descendantes de la cible de surface et disposent chacune d'une cible d'au moins 24 × 24 px CSS

> **Erreur fréquente** : vouloir le beurre et l'argent du beurre — carte entièrement cliquable *et* boutons d'action à l'intérieur, sans arbitrage.

CONFIANCE : établi — interdiction des imbrications convergente (Livefront, règles HTML/ARIA, recoupé par plusieurs sources d'accessibilité).

### Selectable (carte-option)

RÈGLE [CARD-R24] : la carte représente une option dans un choix (plan tarifaire, configuration, sélection multiple d'items). Le clic ne navigue pas — il sélectionne.
STATUT : parti pris d'identité
SOURCE : S3
ÉNONCÉ : Une carte sélectionnable représente une option dans un choix : son activation sélectionne, elle ne navigue pas.

RÈGLE [CARD-R25] : l'état sélectionné doit être signalé par plus que la couleur seule (bordure renforcée + coche, par exemple) — même exigence daltonisme que le message d'erreur de l'input.
STATUT : propriété universelle
SOURCE : S20, S22
ÉNONCÉ : L'état sélectionné d'une carte est signalé autrement que par la couleur seule et est exposé programmatiquement.
MESURE : l'état sélectionné porte au moins un indice non chromatique et un état programmatique (case, bouton radio ou attribut d'état ARIA)

RÈGLE [CARD-R26] : règle de cohérence — dans un groupe de cartes sélectionnables, toutes partagent le même mode (single ou multi) et la même structure interne — un groupe mixte est illisible.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Dans un groupe de cartes sélectionnables, toutes partagent le même mode de sélection — simple ou multiple — et la même structure interne.
MESURE : un groupe de cartes sélectionnables n'associe pas des sélections simples et multiples

> **Erreur fréquente** : ne pas distinguer visuellement "sélectionné" de "survolé" — l'utilisateur ne sait plus ce qu'il a réellement choisi.

### Expandable (carte-accordéon)

RÈGLE [CARD-R27] : masquer puis révéler un contenu secondaire volumineux sans quitter le contexte.
STATUT : parti pris d'identité
SOURCE : S3
ÉNONCÉ : Une carte dépliable masque puis révèle un contenu secondaire volumineux sans faire quitter le contexte ; elle ne sert pas à dissimuler une information nécessaire à la décision.

RÈGLE [CARD-R28] : si la carte contient des éléments interactifs, seul un contrôle dédié (chevron) déclenche l'expansion — pas toute la surface. Si elle n'en contient pas, toute la surface peut déclencher (convention Carbon).
STATUT : parti pris d'identité
SOURCE : S4, S24
ÉNONCÉ : Lorsqu'une carte dépliable contient des éléments interactifs, seul un contrôle dédié déclenche le dépliage ; lorsqu'elle n'en contient pas, toute la surface peut le déclencher.

> **Erreur fréquente** : utiliser l'expansion pour cacher du contenu essentiel à la décision — l'expansion est pour le secondaire, pas pour faire tenir l'important dans une grille.

### Règle de groupe

RÈGLE [CARD-R29] : ne jamais mélanger les modes d'interaction dans une même collection.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Une même collection ne mélange jamais plusieurs modes d'interaction de carte.
MESURE : toutes les cartes d'une collection partagent le même mode d'interaction

> **Pourquoi** : une grille où certaines cartes naviguent, d'autres sélectionnent, casse la prédictibilité que la répétition visuelle promet. Même logique que "un groupe de boutons partage la même taille".

## Densité (ce qui survit de l'axe size)

RÈGLE [CARD-R30] : **comfortable** — le défaut : dashboards, pages de contenu, catalogues.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : La densité confortable est le défaut de la carte : tableaux de bord, pages de contenu, catalogues.

RÈGLE [CARD-R31] : **compact** — contextes denses : panneaux latéraux, listes de cartes à fort volume, widgets.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : La densité compacte est réservée aux contextes denses : panneaux latéraux, listes de cartes à fort volume, widgets.

RÈGLE [CARD-R32] : la densité module le padding interne et les écarts entre slots (valeurs dans CARD-UI.md), jamais la structure : une carte compact a les mêmes slots dans le même ordre qu'une carte comfortable.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : La densité modifie le remplissage interne et les écarts entre emplacements, jamais la structure : une carte compacte a les mêmes emplacements, dans le même ordre, qu'une carte confortable.
MESURE : une carte compacte et une carte confortable exposent la même liste d'emplacements dans le même ordre

RÈGLE [CARD-R33] : même règle de groupe que partout — une collection partage une seule densité.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Une collection de cartes partage une densité unique.
MESURE : toutes les cartes d'une collection partagent la même densité

## Composition (les slots — pas des axes)

RÈGLE [CARD-R34] : ordre canonique : **media → header → corps → zone d'actions**. Chaque slot est optionnel ; l'ordre, lui, ne se réinvente pas carte par carte.
STATUT : parti pris d'identité
SOURCE : S5, S29
ÉNONCÉ : L'ordre des emplacements d'une carte est canonique — media, en-tête, corps, zone d'actions — chaque emplacement restant facultatif ; cet ordre ne se réinvente pas carte par carte.
MESURE : l'ordre des emplacements présents est identique sur toutes les cartes d'une collection

### Media (image, vidéo)

RÈGLE [CARD-R35] : porter l'identification visuelle du sujet — pas décorer. Une image qui n'aide pas à identifier ou décider est du bruit qui agrandit la carte sans bénéfice.
STATUT : parti pris d'identité
SOURCE : S11
ÉNONCÉ : Le media d'une carte porte l'identification visuelle du sujet ; une image qui n'aide ni à identifier ni à décider agrandit la carte sans bénéfice.

RÈGLE [CARD-R36] : règle de ratio — un ratio d'image unique et fixe pour toute la collection (token dans CARD-UI.md).
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Une collection de cartes emploie un ratio d'image unique et fixe.
MESURE : toutes les images d'une même collection partagent le même ratio

> **Pourquoi** : des hauteurs d'image variables détruisent l'alignement de la grille, qui est la principale promesse visuelle d'une collection de cartes.

RÈGLE [CARD-R37] : media manquant — prévoir un remplacement délibéré (couleur de fond + icône ou initiales) plutôt que de laisser la carte s'effondrer ou afficher une image cassée : le trou de media est un cas normal, pas une erreur.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : L'absence de media est un cas normal et non une erreur : elle est traitée par un remplacement délibéré de même encombrement, jamais par une image cassée ni par un effondrement de la carte.
MESURE : toute carte sans media affiche un bloc de remplacement de même ratio que le media attendu

RÈGLE [CARD-R38] : l'alternative textuelle est obligatoire, sauf si l'image est purement décorative (auquel cas elle doit être explicitement marquée comme telle).
STATUT : propriété universelle
SOURCE : S19
ÉNONCÉ : Toute image informative d'une carte porte une alternative textuelle ; une image purement décorative est explicitement marquée comme telle afin d'être ignorée par les technologies d'assistance.
MESURE : toute image de carte porte une alternative textuelle non vide, ou une alternative vide explicite si elle est décorative

> **Erreur fréquente** : laisser l'image porter l'information seule, sans équivalent textuel.

### Header (titre, sur-titre, avatar)

RÈGLE [CARD-R39] : nommer le sujet de la carte — c'est l'élément que le lecteur d'écran et l'œil utilisent comme point d'entrée.
STATUT : propriété universelle
SOURCE : S31, S5
ÉNONCÉ : Le titre d'une carte nomme le sujet de la carte et en décrit le propos ; il est le point d'entrée de la lecture visuelle comme de la lecture d'écran.
MESURE : chaque carte porte un titre non vide

RÈGLE [CARD-R40] : le titre est un vrai titre sémantique, de niveau cohérent dans toute la collection (toutes les cartes d'une grille ont le même niveau de titre).
STATUT : propriété universelle
SOURCE : S18, S29
ÉNONCÉ : Le titre d'une carte est un élément de titre sémantique réel, de niveau identique sur toutes les cartes d'une même collection.
MESURE : le titre de chaque carte d'une collection est un élément de titre (h1–h6) de même niveau

> **Erreur fréquente** : faire du titre le seul lien cliquable d'une carte "presque entièrement cliquable" — soit la carte est cliquable (mode clickable), soit le titre est un lien dans une carte statique, mais le choix doit être franc.

### Corps (texte, métadonnées, badges)

RÈGLE [CARD-R41] : donner juste assez d'information pour décider d'entrer ou passer — la carte est un résumé, pas le contenu lui-même.
STATUT : parti pris d'identité
SOURCE : S1, S29
ÉNONCÉ : Le corps d'une carte donne juste assez d'information pour décider d'entrer ou de passer : la carte est un résumé, pas le contenu lui-même.

RÈGLE [CARD-R42] : le texte est tronqué à une longueur fixe (nombre de lignes constant) plutôt que laissé libre — même raison que le ratio d'image : l'alignement de la collection prime sur l'exhaustivité d'une carte isolée. La troncature suit `VOICE-UI.md` (§ Longueur et troncature, token `measure`) : l'ellipsis ne masque jamais une information décisive et le texte complet reste accessible (`title`/tooltip).
STATUT : parti pris d'identité
SOURCE : S16
ÉNONCÉ : Le texte d'une carte est tronqué à un nombre de lignes constant plutôt que laissé libre ; la troncature ne masque jamais une information décisive et le texte complet reste accessible.
MESURE : toutes les cartes d'une collection tronquent leur corps au même nombre de lignes

RÈGLE [CARD-R43] : badge de statut — c'est ici, dans le contenu, que vit la sémantique (nouveau, en rupture, urgent...) — jamais sur le conteneur (cf. note de transposition : la carte n'a pas de tone).
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : La sémantique d'état — nouveau, en rupture, urgent — vit dans le contenu de la carte sous forme de badge, jamais sur le conteneur, qui n'a pas de tone.

RÈGLE [CARD-R44] : cohérence lexicale des badges — le libellé d'un statut suit **« un concept = un mot »** de `VOICE-UX.md` (lexique contrôlé dans `VOICE-UI.md`) : un même statut porte le même mot d'une carte et d'un écran à l'autre (« En rupture » ne devient pas « Épuisé » puis « Indisponible »), sinon l'utilisateur doute qu'il s'agisse du même état.
STATUT : note de méthode
SOURCE : S16
ÉNONCÉ : Le libellé d'un badge de statut n'est pas défini dans le document de la carte : il se rattache au lexique contrôlé du langage de voix, qui impose qu'un même statut porte le même mot d'un écran à l'autre.
MESURE : un même statut est désigné par un libellé unique dans tout le produit

### Zone d'actions (fait autorité — cf. partage en tête de fichier)

RÈGLE [CARD-R45] : règle de cardinalité — une seule action principale par carte ; les actions secondaires (favori, partage, menu) passent en icônes discrètes ou en menu de débordement, jamais en boutons texte concurrents.
STATUT : parti pris d'identité
SOURCE : S5
ÉNONCÉ : Une carte ne porte qu'une seule action principale ; les actions secondaires passent en icônes discrètes ou en menu de débordement, jamais en boutons texte concurrents.
MESURE : une carte ne contient qu'un seul bouton d'action principal

RÈGLE [CARD-R46] : règle de position — les actions vivent en fin de carte (footer) ou en coin de header pour les actions d'objet (éditer, menu) — position constante dans toute la collection.
STATUT : propriété universelle
SOURCE : S5, S29
ÉNONCÉ : Les actions d'une carte occupent une position constante dans toute la collection : en pied de carte pour les appels à l'action, en coin d'en-tête pour les actions portant sur l'objet entier.
MESURE : la zone d'actions occupe la même position sur toutes les cartes d'une collection

RÈGLE [CARD-R47] : ne jamais rendre les actions d'une carte visibles *uniquement* au survol. Un menu de débordement toujours visible vaut mieux que des icônes qui apparaissent.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Les actions d'une carte ne sont jamais visibles au seul survol : un menu de débordement permanent est préférable à des icônes qui apparaissent.
MESURE : aucune action de carte n'est révélée exclusivement par un sélecteur de survol

> **Pourquoi** : même piège que les icônes hover-only en table documenté dans BUTTON-UX.md — invisible donc inexistant sur écran tactile.

RÈGLE [CARD-R48] : renvoi — le choix de style/tone/taille des boutons internes suit BUTTON-UX.md : la carte impose le *nombre* et la *position*, le bouton garde ses propres règles.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Le style, le tone et la taille des boutons internes à une carte ne sont pas définis par le document de la carte : celui-ci fixe le nombre et la position, le document du bouton garde ses propres règles.

## Empty state (l'état vide d'une carte ou d'une collection)

Deux cas distincts que le benchmark (Carbon) sépare bien :

RÈGLE [CARD-R49] : **la collection est vide** (première utilisation, recherche sans résultat, erreur) — afficher un état vide structuré : image facultative, titre court et positif, explication de *pourquoi* c'est vide, action pour en sortir.
STATUT : parti pris d'identité
SOURCE : S10
ÉNONCÉ : Une collection vide affiche un état vide structuré : image facultative, titre court et positif, explication de la cause du vide, et action pour en sortir.
MESURE : aucune collection vide n'est rendue sans titre, explication et action

RÈGLE [CARD-R50] : le wording diffère selon le cas : première utilisation ("Commencez par ajouter...") ≠ recherche sans résultat ("Aucun résultat pour...") ≠ erreur (ton factuel + action corrective).
STATUT : parti pris d'identité
SOURCE : S10, S15
ÉNONCÉ : Le texte d'un état vide diffère selon sa cause : première utilisation, absence de résultat, ou erreur.

RÈGLE [CARD-R51] : rattachement nommé — ce wording applique `VOICE-UX.md` § « Le ton suit l'utilisateur », ligne **« Vide / démarrage »** (ton encourageant, orienté action) : il faut **distinguer « rien encore » de « rien trouvé »** — la première utilisation (« rien encore », on pointe la première action) ne se formule pas comme une recherche infructueuse (« rien trouvé », on relance la requête).
STATUT : note de méthode
SOURCE : S15
ÉNONCÉ : Le ton des états vides n'est pas redéfini dans le document de la carte : il se rattache au langage de voix, dont la ligne « vide / démarrage » impose de distinguer « rien encore » de « rien trouvé ».

RÈGLE [CARD-R52] : sur l'empty state d'**erreur**, la règle cardinale **« ne jamais blâmer »** de `VOICE-UX.md` s'applique : on décrit l'écart et la correction, on ne qualifie pas l'utilisateur ; quand la faute est côté système, le produit la prend à son compte.
STATUT : note de méthode
SOURCE : S15
ÉNONCÉ : Le texte d'un état vide d'erreur se rattache à la règle cardinale du langage de voix : on décrit l'écart et la correction sans qualifier l'utilisateur, et le produit prend à son compte la faute qui est la sienne.

RÈGLE [CARD-R53] : **une carte du flux manque de contenu** (pas d'image, description absente) — ce n'est pas un empty state, c'est un cas normal de données incomplètes : traité slot par slot (cf. "Media manquant"), sans casser la structure.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Une carte dont un emplacement est vide relève des données incomplètes et non de l'état vide : elle est traitée emplacement par emplacement, sans casser la structure de la collection.

> **Erreur fréquente** : l'écran blanc silencieux — une grille vide sans explication est indistinguable d'un bug pour l'utilisateur.

## États et comportement

RÈGLE [CARD-R54] : **hover (carte cliquable uniquement)** — le survol doit confirmer l'affordance : élévation ou bordure renforcée (tokens dans CARD-UI.md). Une carte statique, elle, ne réagit pas au survol.
STATUT : parti pris d'identité
SOURCE : S8, S9
ÉNONCÉ : Le survol d'une carte cliquable confirme son affordance par une élévation ou une bordure renforcée ; une carte statique ne réagit pas au survol.
MESURE : aucune carte statique ne définit de style de survol

> **Pourquoi** : la réaction au survol *est* le signal de cliquabilité, il ne doit jamais mentir.

RÈGLE [CARD-R55] : **focus visible** — une carte cliquable ou sélectionnable est une cible clavier comme une autre : focus ring obligatoire sur la carte entière, jamais supprimé.
STATUT : propriété universelle
SOURCE : S21
ÉNONCÉ : Une carte cliquable ou sélectionnable est une cible clavier : elle présente un indicateur de focus visible, portant sur la carte entière, qui n'est jamais supprimé.
MESURE : aucune règle de style ne supprime l'indicateur de focus d'une carte sans le remplacer par un indicateur visible

RÈGLE [CARD-R56] : **loading / skeleton** — pendant le chargement d'une collection, afficher des cartes squelettes qui reproduisent la structure réelle (bloc media, lignes de texte) plutôt qu'un spinner global. Le squelette doit avoir les mêmes dimensions que la carte réelle.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Le chargement d'une collection est occupé par des cartes squelettes qui reproduisent la structure et les dimensions des cartes réelles, plutôt que par un indicateur global.
MESURE : l'arrivée des données ne provoque aucun décalage de mise en page de la collection

> **Pourquoi** : réduit l'attente perçue et évite le saut de mise en page à l'arrivée des données — sinon il ajoute le layout shift qu'il devait éviter.

RÈGLE [CARD-R57] : **selected** — cf. mode selectable.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : L'état sélectionné n'est pas redéfini dans la section des états : il est entièrement régi par les règles du mode sélectionnable.

## Application du langage de motion

RÈGLE [CARD-R58] : rattachement nommé — les micro-mouvements de la Card appliquent `MOTION-UX.md`. Le hover d'une Card cliquable relève du **feedback** (confirmer que l'affordance a été reçue — court, `motion.fast`) ; la rotation du chevron et le dépliage du mode expandable relèvent de la **continuité** (relier deux états, expliquer d'où vient le changement — `motion.base`).
STATUT : note de méthode
SOURCE : S14
ÉNONCÉ : Les micro-mouvements de la carte se rattachent nommément au langage de motion : le survol d'une carte cliquable relève du feedback, la rotation du chevron et le dépliage relèvent de la continuité.

RÈGLE [CARD-R59] : **rien n'anime au chargement initial** — une collection de cartes est du contenu chargé avec la page, pas une conséquence réactive d'une action ; les squelettes occupent l'attente, ils n'« entrent » pas en animation. Seuls les changements réactifs (hover, sélection, dépliage déclenché par l'utilisateur) sont animés.
STATUT : parti pris d'identité
SOURCE : S14
ÉNONCÉ : Rien n'anime au chargement initial d'une collection de cartes : seuls les changements réactifs déclenchés par l'utilisateur sont animés, les squelettes occupent l'attente sans entrer en scène.
MESURE : aucune animation d'entrée n'est déclenchée par le rendu initial d'une collection de cartes

RÈGLE [CARD-R60] : **le mouvement confirme, il n'informe jamais seul** — l'état déplié/replié vit dans `aria-expanded`, pas dans la rotation du chevron ; couper le mouvement ne coupe aucune information. La rotation n'est qu'une confirmation sensorielle de ce que l'attribut porte déjà.
STATUT : propriété universelle
SOURCE : S22, S26
ÉNONCÉ : Le mouvement d'une carte confirme un changement d'état sans jamais le porter seul : l'état déplié ou replié est exposé programmatiquement, de sorte que la suppression de l'animation ne supprime aucune information.
MESURE : l'état déplié ou replié est porté par un attribut d'état programmatique et reste déterminable sans animation

RÈGLE [CARD-R61] : contrat `prefers-reduced-motion` (couche UX ; valeurs et sélecteurs dans CARD-UI.md) — le chevron **saute** à son orientation finale sans rotation animée, et le contenu révélé apparaît en **crossfade instantané** plutôt qu'en glissement ; l'information (ouvert/fermé, contenu présent) reste intégrale, seul le déplacement spatial disparaît.
STATUT : implémentation de référence
SOURCE : S14
ÉNONCÉ : Sous préférence de mouvement réduit, le chevron d'une carte dépliable saute à son orientation finale sans rotation animée et le contenu révélé apparaît en fondu instantané plutôt qu'en glissement : l'information reste intégrale, seul le déplacement spatial disparaît.
MESURE : sous prefers-reduced-motion, aucune transition de rotation ni de hauteur n'est appliquée au dépliage, et le contenu révélé reste présent

> **Pourquoi** : c'est la condition qui rend `prefers-reduced-motion` implémentable sans perte — puisque aucune information n'est portée par le seul mouvement, la préférence d'accessibilité dégrade le confort sensoriel, jamais la fonction.

## Instrument E-motion — sans objet (surface calme)

RÈGLE [CARD-R62] : statut tranché (arbitrage utilisateur 2026-07-21) — **la Card ne porte aucun moment E-motion.** L'absence est documentée et raisonnée, pas un oubli : elle se déduit du même raisonnement que l'exclusion danger/warning de `TOAST-UX.md` (§ Instrument E-motion), appliqué au conteneur plutôt qu'au tone.
STATUT : note de méthode
SOURCE : S17
ÉNONCÉ : La carte ne porte aucun moment d'animation expressive, et cette absence est documentée et raisonnée plutôt que laissée implicite.

RÈGLE [CARD-R63] : première raison — **surface de consultation calme.** La doctrine d'interaction fait de la Card statique l'expression de l'intention *consulter* (une surface qui organise sans promettre de clic) ; un battement expressif sur un conteneur de lecture mentirait sur son rôle, exactement comme un style cliquable sur une carte statique.
STATUT : parti pris d'identité
SOURCE : S13, S17
ÉNONCÉ : Une carte est une surface de consultation calme : un battement expressif sur un conteneur de lecture mentirait sur son rôle, comme le ferait un style cliquable sur une carte statique.

RÈGLE [CARD-R64] : seconde raison — **composant-collection.** La Card vit en collection (grille, liste, dashboard) ; or le budget de rareté d'`EMOTION-UX.md` (« un moment qui se répète cesse d'être expressif ») disqualifie d'emblée tout ce qui se répète par carte — une grille de vingt cartes est l'exact opposé d'un moment mérité.
STATUT : parti pris d'identité
SOURCE : S17
ÉNONCÉ : Un composant qui vit en collection est disqualifié d'emblée pour tout moment expressif : ce qui se répète à chaque carte cesse d'être un moment mérité.

RÈGLE [CARD-R65] : où va alors l'expression — le moment catalogué **« vide et attente qui ont une personnalité »** d'`EMOTION-UX.md` ne s'incarne pas dans le conteneur mais dans le **contenu injecté** (un Toast, réactif et seul à l'écran, cf. `TOAST-UX.md` § Instrument E-motion). L'expression appartient à ce qui est injecté, jamais au conteneur qui l'accueille.
STATUT : note de méthode
SOURCE : S17
ÉNONCÉ : L'expression liée au vide et à l'attente n'appartient pas au conteneur mais au contenu qui y est injecté ; le document de la carte renvoie sur ce point au composant réactif concerné.

RÈGLE [CARD-R66] : périmètre strict — l'empty state d'**erreur** et l'état **« sans résultat »** restent strictement productifs (ton factuel, « ne jamais blâmer ») : l'exception chaleureuse d'`EMOTION-UX.md`/`VOICE-UX.md` ne s'applique jamais à une erreur ni à une absence de résultat, ici pas davantage qu'ailleurs.
STATUT : note de méthode
SOURCE : S15, S17
ÉNONCÉ : L'exception chaleureuse du langage expressif ne s'applique ni à un état d'erreur ni à une absence de résultat, qui restent strictement productifs.

## Contextes d'intégration

### En grille (le cas de référence)

RÈGLE [CARD-R67] : largeurs uniformes, hauteurs idéalement alignées par rangée — c'est le ratio d'image fixe et la troncature de texte qui rendent cet alignement possible.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : En grille, les cartes ont des largeurs uniformes et des hauteurs alignées par rangée ; c'est le ratio d'image fixe et la troncature du texte qui rendent cet alignement possible.
MESURE : toutes les cartes d'une même rangée ont la même largeur

RÈGLE [CARD-R68] : la position de chaque slot est identique sur toutes les cartes — la grille promet la prédictibilité, chaque écart la rompt.
STATUT : parti pris d'identité
SOURCE : S5
ÉNONCÉ : En grille, chaque emplacement occupe la même position sur toutes les cartes : la répétition visuelle promet la prédictibilité et chaque écart la rompt.

### En liste verticale (cartes empilées)

RÈGLE [CARD-R69] : alternative à la grille quand la lecture est séquentielle — la carte peut alors passer en disposition horizontale (media à gauche, contenu à droite).
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : En liste verticale, quand la lecture est séquentielle, une carte peut adopter une disposition horizontale plaçant le media à côté du contenu.

RÈGLE [CARD-R70] : point de vigilance — si toutes les cartes sont homogènes et comparées entre elles, se reposer la question "liste de cartes ou simple liste ?" (cf. Quand ne pas l'utiliser).
STATUT : parti pris d'identité
SOURCE : S2
ÉNONCÉ : Une liste de cartes homogènes comparées entre elles rouvre la question du composant : la liste simple redevient candidate.

### En dashboard (carte-widget, carte-KPI)

RÈGLE [CARD-R71] : la carte-statistique (un chiffre + un libellé + une tendance) est une carte statique dans la quasi-totalité des cas — si elle navigue vers le détail, elle devient clickable et suit toutes les règles de ce mode.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Une carte statistique — un chiffre, un libellé, une tendance — est statique par défaut ; si elle conduit vers un détail, elle devient cliquable et suit toutes les règles de ce mode.

RÈGLE [CARD-R72] : la hiérarchie d'un dashboard vient de la taille des cartes dans la grille, pas d'un axe de style par carte — cohérent avec la note de transposition.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : La hiérarchie d'un tableau de bord vient de la taille occupée par chaque carte dans la grille, non d'un axe de style porté par la carte.

### En carrousel horizontal

RÈGLE [CARD-R73] : signaler le débordement (carte partiellement visible en bord d'écran) — un carrousel dont rien ne dépasse est indistinguable d'une grille complète.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Un carrousel de cartes signale son débordement en laissant une carte partiellement visible en bord de zone ; un carrousel dont rien ne dépasse est indistinguable d'une grille complète.

*Couverture partielle — signalé dans l'inventaire, à approfondir.*

### Kanban / carte déplaçable

RÈGLE [CARD-R74] : **toute opération offerte au glisser-déposer a une alternative à pointeur unique** — un bouton ou un menu « Déplacer vers… » qui réalise le même déplacement sans maintenir ni traîner (WCAG 2.5.7 « Dragging Movements »). Le glisser-déposer reste un raccourci, jamais le seul chemin : l'utilisateur au clavier, au contacteur ou à faible dextérité passe par l'alternative, et le déplacement effectif est annoncé au lecteur d'écran (départ → arrivée).
STATUT : propriété universelle
SOURCE : S7, S23, S28
ÉNONCÉ : Toute opération de déplacement offerte au glisser-déposer dispose d'une alternative à pointeur unique réalisant le même déplacement sans maintien ni traînée, et le déplacement effectif est annoncé aux technologies d'assistance.
MESURE : toute opération de glisser-déposer dispose d'un contrôle équivalent activable par un clic unique et au clavier

> **Pourquoi** : c'est l'application au conteneur du principe « pas de dépendance à une seule modalité » — un tableau Kanban où l'on ne peut avancer une carte qu'en la traînant exclut d'emblée qui ne peut pas produire ce geste continu.

*Le reste du Kanban — affordance visuelle de saisie, réordonnancement fin, région live d'annonce — relève de l'extension à naître `collection-kanban` du pattern collection (COLLECTION-UX.md, § À approfondir) ; hors scope ici. Seule l'obligation d'alternative est normative dans ce fichier.*

RÈGLE [CARD-R77] : la présence d'une cible n'est pas un mode. Dans une collection interactive, un élément peut n'avoir rien à ouvrir — il se déclare alors sans cible et perd toute affordance, sans que la collection change de mode. La règle appartient à `COLLECTION-UX` (R33) ; elle est rappelée ici parce que la carte en est le premier porteur.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : La règle de l'élément sans cible dans une collection interactive appartient à COLLECTION-UX (R33) ; ce document ne la redéfinit pas.

## Risque

RÈGLE [CARD-R75] : table ci-dessous
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Les risques de la carte sont recensés dans une table unique du document, ordonnée par sévérité ; elle ne crée aucune règle nouvelle mais qualifie la gravité des manquements aux règles précédentes.

| Cas | Risque principal | Sévérité |
|---|---|---|
| Carte cliquable avec éléments interactifs imbriqués | Exclusion clavier/lecteur d'écran, tabulation incohérente | Critique |
| Cliquabilité par div + onclick (non sémantique) | Cible invisible aux technologies d'assistance | Critique |
| Actions visibles uniquement au survol | Fonction inaccessible sur tactile | Élevée |
| Déplacement possible uniquement au glisser-déposer | Exclusion clavier/motricité (WCAG 2.5.7) | Élevée |
| Cartes pour des items homogènes à comparer | Scannabilité dégradée, comparaison difficile, abandon | Moyenne |
| Ratio d'image variable dans une collection | Grille cassée, lecture désordonnée | Faible à moyenne |
| État sélectionné signalé par la couleur seule | Exclusion daltonisme | Élevée |
| Collection vide sans empty state | Confusion (vide = bug ?), abandon silencieux | Moyenne |
| Style cliquable sur carte statique (ou l'inverse) | Affordance mensongère, perte de confiance | Moyenne |

## Règle transversale

RÈGLE [CARD-R76] : **l'interactivité d'une carte doit être univoque : soit la carte est la cible, soit elle contient des cibles — jamais une ambiguïté entre les deux.**
STATUT : parti pris d'identité
SOURCE : S6
ÉNONCÉ : L'interactivité d'une carte est univoque : soit la carte est la cible, soit elle contient des cibles, sans ambiguïté possible entre les deux.

> **Pourquoi** : c'est la déclinaison pour un conteneur du principe déjà posé pour le bouton (la friction suit le risque réel) et l'input (la validation suit le risque d'erreur) : ici, ce qui doit suivre la fonction réelle, c'est l'affordance — une surface qui a l'air cliquable doit l'être, une surface cliquable doit le montrer, et l'utilisateur ne doit jamais deviner où cliquer.

## Sources et niveau de confiance

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| S1 | Carte = résumé + point d'entrée, entièrement cliquable de préférence (Fitts) | [NN/g — Cards: UI-Component Definition](https://www.nngroup.com/articles/cards-component/) | Établi — article de référence, définition largement reprise |
| S2 | Cartes inférieures aux listes pour comparer/rechercher des items homogènes | [NN/g — Cards: UI-Component Definition](https://www.nngroup.com/articles/cards-component/) | Établi — argumenté par mécanisme (scannabilité), pas chiffré |
| S3 | 4 modes d'interaction (base/clickable/selectable/expandable) | [IBM Carbon — Tile usage](https://carbondesignsystem.com/components/tile/usage/) | Établi — taxonomie explicitement documentée par Carbon |
| S4 | Carte cliquable sans CTA interne ; expansion par chevron si contenu interactif | [IBM Carbon — Tile usage](https://carbondesignsystem.com/components/tile/usage/) | Établi — règle explicite du système |
| S5 | Structure header/corps/footer, actions d'objet en header, CTA en footer, 1 seule action mise en avant | [Shopify Polaris — Card layout](https://polaris-react.shopify.com/patterns/card-layout) | Établi — pattern documenté en détail par Polaris |
| S6 | Interdiction des éléments interactifs imbriqués ; siblings DOM + cible étendue en CSS ; balisage liste pour les collections | [Livefront — Accessibility dos and don'ts for interactive cards](https://livefront.com/writing/accessibility-dos-and-donts-for-interactive-cards/) | Établi — converge avec les règles HTML/ARIA, recoupé par plusieurs sources d'accessibilité |
| S7 | Alternative à pointeur unique pour tout glisser-déposer | [WCAG 2.2 — 2.5.7 Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html) | Établi, standard (2.2) |
| S8 | 3 styles de conteneur (elevated/filled/outlined) comme décision visuelle, pas hiérarchie par instance | [Material Design 3 — Cards](https://m3.material.io/components/cards/guidelines), recoupé via [MUI — Card](https://mui.com/material-ui/react-card/) | Établi pour l'existence des 3 styles ; l'interprétation "décision produit, pas axe par instance" est une lecture de ce fichier |
| S9 | Surface cliquable + actions détachées pour éviter les conflits d'événements | [MUI — Card (CardActionArea)](https://mui.com/material-ui/react-card/) | Établi — pattern d'implémentation documenté |
| S10 | Empty state : image/titre/corps/action, variantes première utilisation / sans résultat / erreur | [IBM Carbon — Empty states pattern](https://carbondesignsystem.com/patterns/empty-states-pattern/) | Établi — pattern documenté |
| S11 | Media = éducatif/identification, pas décoration ; toujours accompagné de texte | [Shopify Polaris — Media card](https://polaris-react.shopify.com/components/layout-and-structure/media-card) | Établi chez Polaris, formulation générale extrapolée |
| S12 | Absence de composant carte générique chez Atlassian (cartes spécialisées uniquement) | [Atlassian Design System](https://atlassian.design/design-system) + [question communauté restée sans doctrine générale](https://community.developer.atlassian.com/t/any-design-guidelines-around-an-issue-card-or-card-in-general-for-apps/25779) | Constat de structure — confirme que "carte" est moins standardisé que bouton/input d'un système à l'autre |
| S13 | Intention *consulter* + lois d'affordance 3 et 4 + Test de reconnaissance | `INTERACTION-UX.md` § Les six intentions / Les lois d'affordance / Test de reconnaissance | Établi — rattachement interne nommé |
| S14 | Hover = feedback, chevron/dépliage = continuité ; rien n'anime au chargement initial ; mouvement jamais seul porteur ; reduced-motion (chevron qui saute, crossfade) | `MOTION-UX.md` § Deux rôles / Le mouvement confirme… / prefers-reduced-motion | Établi — rattachement interne nommé |
| S15 | Wording empty state (« rien encore » vs « rien trouvé ») ; « ne jamais blâmer » sur l'erreur | `VOICE-UX.md` § Le ton suit l'utilisateur | Établi — rattachement interne nommé |
| S16 | Cohérence lexicale des badges (« un concept = un mot ») ; troncature (`measure`) | `VOICE-UX.md` § Cohérence lexicale + `VOICE-UI.md` § Lexique contrôlé / Longueur et troncature | Établi — rattachement interne nommé |
| S17 | Card = surface calme sans moment E-motion ; expression dans le contenu injecté (Toast) | `EMOTION-UX.md` (budget de rareté, catalogue) + `TOAST-UX.md` § Instrument E-motion | Déduction argumentée — arbitrage utilisateur 2026-07-21 |
| S18 | Information, structure et relations véhiculées par la présentation sont programmatiquement déterminables ou disponibles en texte — ce qui fonde le titre de carte réel et le balisage de collection | [WCAG 2.2 — 1.3.1 Info and Relationships](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) | Établi, standard (niveau A) — techniques suffisantes H42 (h1–h6) et H48 (ol/ul/dl) explicitement listées |
| S19 | Tout contenu non textuel dispose d'une alternative textuelle de finalité équivalente ; un contenu purement décoratif est implémenté de façon à pouvoir être ignoré par les technologies d'assistance | [WCAG 2.2 — 1.1.1 Non-text Content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html) | Établi, standard (niveau A) — couvre les deux volets de la règle media (alt obligatoire / décoratif explicitement marqué) |
| S20 | La couleur n'est jamais le seul moyen visuel de véhiculer une information, d'indiquer une action, d'appeler une réponse ou de distinguer un élément | [WCAG 2.2 — 1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) | Établi, standard (niveau A) — fonde l'exigence d'un indice non chromatique sur l'état sélectionné |
| S21 | Toute interface opérable au clavier dispose d'un mode où l'indicateur de focus clavier est visible | [WCAG 2.2 — 2.4.7 Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html) | Établi, standard (niveau AA) |
| S22 | Pour tout composant d'interface, le nom et le rôle sont programmatiquement déterminables, les états et propriétés modifiables sont programmatiquement réglables, et la notification de leur changement est disponible aux technologies d'assistance | [WCAG 2.2 — 4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html) | Établi, standard (niveau A) — fonde à la fois l'état sélectionné exposé et l'état déplié porté par un attribut, pas par le mouvement |
| S23 | Toute fonctionnalité du contenu est opérable au clavier, sauf lorsque la fonction sous-jacente dépend du tracé du mouvement et non de ses seuls points d'arrivée | [WCAG 2.2 — 2.1.1 Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html) | Établi, standard (niveau A) — complète 2.5.7 sur l'alternative au glisser-déposer |
| S24 | Le modèle de contenu de l'élément a interdit tout descendant de contenu interactif, tout descendant a et tout descendant portant l'attribut tabindex | [HTML Living Standard — 4.5.1 The a element](https://html.spec.whatwg.org/multipage/text-level-semantics.html) | Normatif — l'interdiction d'imbrication dans une carte cliquable n'est pas une convention de design system mais une contrainte de la spécification HTML |
| S25 | La finalité d'un lien est déterminable à partir de son texte seul ou de son texte et de son contexte programmatiquement déterminé — ce qui impose que le texte accessible d'une carte cliquable soit son titre | [WCAG 2.2 — 2.4.4 Link Purpose (In Context)](https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context.html) ; [WCAG 2.2 — 2.4.9 Link Purpose (Link Only)](https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-link-only.html) | Établi, standards (A et AAA) — la règle correspondante est portée par LINK-UX.md (R15/R16), la carte s'y rattache sans la réécrire |
| S26 | Dans le motif Disclosure, le déclencheur porte le rôle button et l'attribut aria-expanded vaut true quand le contenu est visible, false quand il est masqué ; Entrée et Espace l'activent | [ARIA Authoring Practices Guide — Disclosure Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/) | Normatif (pratique de référence W3C) — fonde le mode expandable : l'état vit dans aria-expanded, pas dans la rotation du chevron |
| S27 | La cible pour les entrées de pointage mesure au moins 24 × 24 px CSS, sauf exceptions d'espacement, d'équivalence, de texte en ligne, de contrôle par l'agent utilisateur ou d'essentialité | [WCAG 2.2 — 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) | Établi, standard (niveau AA) — s'applique aux cibles internes distinctes d'une carte cliquable |
| S28 | Les messages d'état, dont ceux qui portent sur l'attente et la progression d'un traitement, sont programmatiquement déterminables par rôle ou propriétés et présentables sans prise de focus | [WCAG 2.2 — 4.1.3 Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) | Établi, standard (niveau AA) — fonde l'annonce du déplacement effectif d'une carte et l'annonce de chargement d'une collection |
| S29 | Carte = point d'entrée résumant une information plus vaste ; anatomie en-tête / media / corps / pied avec les actions en pied ; groupe de cartes balisé ul + li ; niveau de titre choisi selon la structure de la page ; ratio d'image contrôlé par utilitaire | [U.S. Web Design System — Card](https://designsystem.digital.gov/components/card/) | Établi — troisième design system public vérifié sur la carte (avec Carbon S3/S4 et Polaris S5) ; fonde les convergences invoquées sur l'anatomie, la position des actions et le titre sémantique |
| S30 | « Les cartes affichent du contenu et des actions relatifs à un sujet unique » ; trois types de conteneur : elevated, filled, outlined | [Material Design 3 — Cards](https://m3.material.io/components/cards/overview) | Établi pour la définition et les trois types (page rendue en JavaScript : seule la description canonique de la page a pu être lue) — corrobore S8 |
| S31 | Les titres et les étiquettes décrivent le sujet ou la finalité | [WCAG 2.2 — 2.4.6 Headings and Labels](https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels.html) | Établi, standard (niveau AA) — donne un ancrage normatif au titre de carte qui « nomme le sujet » |

*Toute règle sans source explicite ci-dessus repose sur un raisonnement de mécanisme (affordance, charge cognitive, alignement de grille) plutôt que sur une étude chiffrée. Aucune étude chiffrée type "+X% de conversion" n'a été trouvée pour la carte — contrairement au bouton ($300M button) et à l'input (Wroblewski, Baymard) ; c'est un écart de niveau de preuve à garder en tête.*

## À approfondir

- **Kanban / drag-and-drop** : l'obligation d'alternative à pointeur unique est désormais normative (WCAG 2.5.7) ; l'affordance visuelle de saisie et le réordonnancement fin restent à traiter dans un futur pattern « collection ».
- **Carrousel horizontal** : effleuré, mérite un traitement complet (navigation, indicateurs, tactile).
- **Performance des collections longues** (virtualisation, lazy-loading des images) : enjeu réel signalé dans l'inventaire, plus technique qu'UX — à trancher entre CARD-UI.md et un futur pattern "collection".
