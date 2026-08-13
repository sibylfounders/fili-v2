---
component: laws
layer: ux
type: principle
version: 1.3.2 # 1.3.2 : wording — « accent » (teinte de marque sortie en DESIGN 1.34.0, focus v2) remplacé par « marque parcimonieuse » dans Von Restorff ; aucun catalogue ni règle modifiés. 1.3.1 : la carte d'application renvoie Doherty aussi vers le principe performance (contrat des attentes, 2026-07-21) ; rien d'autre ne change. 1.3.0 : naissance du principe opérationnel cognitive-load (2026-07-21, cf. DECISIONS.md) — la carte d'application renvoie vers lui (Cognitive Load, Selective Attention) et l'anti-camouflage « candidate » est promu en RÈGLE chez lui ; le statut de référence humaine de ce catalogue reste inchangé. 1.2.0 : Laws devient un principe de premier niveau ; son statut de référence humaine non compilée reste inchangé. 1.1.0 : reclassée « référence humaine » — audience: humans, PAS compilée vers dist/ (l'IA ne la charge jamais au build). Décision 2026-07-12, cf. DECISIONS.md. 1.0.0 : première rédaction — catalogue large (27 lois, périmètre lawsofux.com + sources primaires) ; inventaire et benchmark faits AVANT livraison ; UX-only par nature (aucun token)
last_updated: 2026-07-29
companion: none # principe sans couche UI — décision justifiée dans la note de transposition
audience: humans # principe de RÉFÉRENCE : s'adresse aux humains (revue, formation), pas à l'IA au moment du build — non compilé en RULES, absent du routeur. Les lois s'appliquent via les principes/fondations/composants qui, eux, sont chargés.
confidence: mixed # les lois de perception (Gestalt) et les seuils temporels (Doherty, Fitts) sont établis ; plusieurs "lois" nommées sont des heuristiques ou des effets d'ampleur variable, marqués comme tels ; deux mythes courants sont réfutés (Miller "7 items", règle des 3 clics)
---

# Lois UX — Couche UX (principe)

> Ce fichier est un **catalogue de lecture théorique** : il nomme les lois de psychologie et d'ergonomie qui fondent les règles déjà écrites ailleurs dans le système, en donne la source, la portée réelle, la limite, et **la carte de là où chacune s'applique déjà**. Il ne crée aucune contrainte nouvelle et ne porte aucune valeur — les règles opérationnelles vivent dans les autres principes, les fondations, les langages et les composants, vers lesquels chaque loi renvoie.

## Note de transposition (à lire en premier)

RÈGLE [LAWS-R01] : les lois UX forment le **principe théorique** du système — ni variantes (composant), ni assemblage (pattern), ni token transversal. C'est le corpus que les autres sujets *appliquent* et *citent* déjà (Doherty dans MOTION, Hick dans l'inflation du primary de BUTTON, Gestalt/proximité dans SPACING). Le modèle à axes ne s'y applique pas ; le modèle rôle/valeur non plus.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Le catalogue des lois UX est un principe théorique : il ne se modélise ni en axes ni en rôle/valeur, n'introduit aucune contrainte propre, et se borne à nommer le corpus que les autres sujets appliquent et citent.

RÈGLE [LAWS-R02] : **ce principe s'adresse aux humains, pas à l'IA du build** (`audience: humans`). Il n'est **pas compilé vers `dist/`** : aucun `RULES-laws`, absent du routeur, jamais chargé au moment de générer de l'UI. Motif — les lois ne posent aucune contrainte que le build consomme (elles renvoient toutes à une règle qui vit ailleurs) ; les charger à chaque build ne ferait qu'alourdir sans rien contraindre. Il vit donc dans l'atelier et sur le site (revue, formation, argumentation), et son influence passe par les sujets opérationnels qui, eux, sont compilés et chargés. Décision journalée (DECISIONS.md 2026-07-12).
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Le catalogue des lois s'adresse aux humains et n'est pas compilé : il ne produit aucun fichier de règles dans dist/, n'apparaît pas dans le routeur, et n'est jamais chargé au moment de générer de l'UI.
MESURE : absence de RULES-laws dans dist/ et absence d'entrée laws dans le routeur

RÈGLE [LAWS-R03] : **ce principe n'a pas de couche UI — par nature, pas par oubli.** Un catalogue de lois n'a ni surface visuelle (hex, px) ni lexique concret : ses « valeurs » sont les tokens et règles des autres sujets, qui portent déjà l'implémentation. Créer une couche `LAWS-UI` reviendrait à dupliquer ce qui vit dans les couches UI de motion, spacing, button… — exactement le travers que le principe de dédoublonnage interdit. Sa couche « concrète » est donc la **carte d'application** en fin de fichier : loi → où elle est déjà implémentée.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Le catalogue des lois n'a pas de couche UI : sa couche concrète est la carte d'application reliant chaque loi à la règle qui l'implémente, et aucun fichier UI factice n'est créé pour satisfaire l'outillage.
MESURE : companion: none déclaré ; aucun fichier LAWS-UI ; chaque loi du catalogue possède une ligne dans la carte d'application ou une mention explicite de trou

> **Conséquence outillée résolue** : `valide-dossier.js` reconnaît `companion: none` et exempte les sujets UX-only déclarés. **Ne pas** créer un UI factice pour satisfaire le script : ce serait une valeur sans besoin réel (guardrail COLOR).

RÈGLE [LAWS-R04] : une loi ne s'applique **jamais seule**. La plupart sont en tension avec une autre (Hick « montre moins » ↔ découvrabilité et Fitts ; Miller « limite » ↔ Tesler « la complexité ne disparaît pas »). Le rôle de ce principe est de rendre ces tensions **visibles**, pas de les trancher — l'arbitrage remonte, comme partout ailleurs (les lignes CONFIANCE calibrent la vitesse de remontée).
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Une loi ne s'invoque jamais seule : chaque entrée du catalogue expose la ou les lois avec lesquelles elle est en tension, et un arbitrage entre lois contradictoires remonte au lieu d'être tranché par le catalogue.

RÈGLE [LAWS-R05] : **une loi nommée n'est pas une loi vraie.** Le mot « loi » recouvre ici des choses d'ampleur très inégale : des résultats robustes (Fitts, Gestalt, Doherty), des heuristiques utiles (Occam, Postel), des effets réels mais contextuels (Peak-End, Aesthetic-Usability), et des formules **abusées** (Miller « 7 items », la « règle des 3 clics »). Chaque entrée porte donc son niveau de confiance, et les deux mythes les plus tenaces sont réfutés à leur source.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Le mot « loi » ne vaut pas preuve : chaque entrée du catalogue porte un niveau de confiance explicite et distingue les résultats robustes, les heuristiques et les formules réfutées.
MESURE : chaque entrée du catalogue porte un niveau de confiance et un renvoi vers sa source primaire

## Comment lire une entrée

Chaque loi tient en une ligne d'énoncé, une portée réelle, une **frontière** (là où elle cesse d'être vraie ou devient manipulatrice), et un renvoi vers la règle du système qui l'implémente déjà. Les lois sont groupées par domaine cognitif — le même découpage que l'inventaire.

## 1. Charge cognitive et mémoire

RÈGLE [LAWS-R06] : **Cognitive Load (Sweller) — la loi-mère.** Toute charge mentale qu'une interface impose *au-delà* de la tâche elle-même est du gaspillage (charge extrinsèque). C'est le principe implicite de tout le système : registre productif du MOTION, échelles fermées de SPACING et RADIUS, « un token naît d'un besoin réel ». Frontière : réduire la charge extrinsèque ne veut pas dire cacher — un choix retiré de l'écran reste un choix à faire ailleurs (cf. Tesler).
STATUT : propriété universelle
SOURCE : S15
ÉNONCÉ : Toute charge mentale imposée par la présentation de l'interface au-delà de la tâche elle-même est une charge extrinsèque à supprimer ; la réduire ne consiste jamais à masquer une décision, qui resterait alors à prendre ailleurs.

RÈGLE [LAWS-R07] : **Miller's Law — à corriger, pas à appliquer.** L'énoncé populaire « 7±2 éléments maximum » est un **abus** : Miller (1956) parlait de la capacité de la mémoire de travail sur des *unités non structurées*, pas d'une limite de menus, d'onglets ou de champs. La règle utile qui en dérive est le **chunking** (regrouper), pas le plafond numérique. Frontière : ne jamais justifier « maximum 7 items » par Miller — segmenter un numéro de carte en groupes de 4, oui ; brider une navigation à 7 entrées « à cause de Miller », non.
STATUT : propriété universelle
SOURCE : S6, S16, S17
ÉNONCÉ : Aucune limite d'items d'interface — menu, onglets, champs — ne se justifie par Miller (1956) : la seule règle utilisable qui en dérive est le regroupement en unités signifiantes, jamais un plafond numérique.
MESURE : aucune contrainte de cardinalité du système n'est justifiée par une référence à Miller ou au « 7±2 »

> **Pourquoi** : c'est exactement le travers que le système combat ailleurs — une formule citée hors de sa source (comme « le contraste suffit » pour le daltonisme, COLOR). La loi vraie est plus modeste et plus utile que sa version virale.

RÈGLE [LAWS-R08] : **Chunking — regrouper pour mémoriser.** Découper l'information en unités signifiantes allège la mémoire de travail. Implémenté par le FORM-multi-step (une décision par étape), la proximité de SPACING (regroupement visuel), la segmentation des nombres et dates (VOICE-UI).
STATUT : propriété universelle
SOURCE : S16, S17
ÉNONCÉ : L'information longue ou dense se découpe en unités signifiantes — étapes, groupes visuels, segments de nombres et de dates — plutôt que d'être présentée d'un seul bloc.

RÈGLE [LAWS-R09] : **Working Memory — volatile et rare.** Ne jamais exiger de l'utilisateur qu'il retienne une information d'un écran à l'autre. Implémenté par l'« ask-once » et la récapitulation avant soumission finale (FORM-multi-step), par le helper text *persistant* plutôt que l'aide qui disparaît (INPUT).
STATUT : propriété universelle
SOURCE : S17, S18
ÉNONCÉ : L'interface n'exige jamais qu'une information soit retenue d'un écran à l'autre : ce qui a déjà été saisi est redonné à voir au moment où il sert, et l'aide nécessaire à une saisie reste visible au lieu de disparaître.
MESURE : aucune donnée déjà saisie n'est redemandée ; aucune aide nécessaire à la saisie n'est masquée après son premier affichage

RÈGLE [LAWS-R10] : **Zeigarnik Effect — l'inachevé reste présent.** Une tâche interrompue occupe la mémoire ; une barre de progression visible exploite cet effet pour *aider* (FORM-multi-step, statut d'autosave). Frontière éthique : le même levier retourné en dark pattern (relances culpabilisantes, « votre profil n'est complété qu'à 40 % » à répétition) est hors registre — l'effet sert l'utilisateur, jamais la pression.
STATUT : parti pris d'identité
SOURCE : S22, interne
ÉNONCÉ : La progression d'une tâche longue est rendue visible pour aider la reprise, jamais pour exercer une pression : aucune relance ni aucun message n'a pour seul déclencheur le caractère incomplet d'une tâche.
MESURE : aucune notification ni message dont l'unique condition de déclenchement est un taux de complétion inférieur à 100 %

RÈGLE [LAWS-R11] : **Selective Attention — l'utilisateur ignore le bruit.** La « banner blindness » est réelle : ce qui ressemble à de la publicité est filtré avant lecture. Fonde la sobriété du MOTION (le mouvement capte l'attention de force, donc parcimonie) et la rareté de l'alert. Frontière (promue en RÈGLE opérationnelle par le principe cognitive-load, 2026-07-21) : ne jamais déguiser une information critique en élément décoratif ou promotionnel — elle sera filtrée avec le reste.
STATUT : propriété universelle
SOURCE : S19, S14
ÉNONCÉ : Aucune information critique ne prend l'apparence d'un élément décoratif ou promotionnel : ce qui ressemble à une publicité est filtré avant lecture, et le mouvement, qui capte l'attention de force, reste parcimonieux.

## 2. Décision et action

RÈGLE [LAWS-R12] : **Hick's Law — le choix coûte du temps.** Le temps de décision croît avec le nombre *et* la complexité des options. Implémenté par l'inflation du primary (un seul BUTTON primary par vue), les registres étanches (COLOR : une couleur = un sens), un CTA dominant par section. Frontière : Hick pousse à réduire les choix visibles, mais réduire ≠ enfouir — un choix caché derrière trois clics reste un choix (tension avec Fitts et la découvrabilité, arbitrée au cas par cas).
STATUT : parti pris d'identité
SOURCE : S4, S20
ÉNONCÉ : Chez nous, une vue porte une action dominante et une seule, et chaque registre de couleur porte un sens unique ; réduire le nombre d'options visibles ne consiste jamais à enfouir une option derrière une navigation plus profonde.
MESURE : au plus un bouton primary par vue

RÈGLE [LAWS-R13] : **Choice Overload — corollaire de Hick.** Au-delà d'un seuil, l'abondance d'options réduit la satisfaction et la probabilité de décision. Implémenté par la cardinalité des actions en carte (CARD) et le nombre d'actions portées par une alert (ALERT).
STATUT : parti pris d'identité
SOURCE : S21, interne
ÉNONCÉ : Le nombre d'actions portées par une carte ou une alerte est plafonné par une règle explicite du composant concerné, et non par un seuil général d'abondance d'options.

RÈGLE [LAWS-R14] : **Fitts's Law — grand et proche se cliquent vite.** Le temps d'atteinte d'une cible est proportionnel à la distance / à la taille. Implémenté par la zone tactile minimale de 44px (BUTTON-UI, standard WCAG 2.5.5), par les actions placées près de leur contexte, par les cibles de bord d'écran (infiniment « profondes »). Établi — une des rares vraies lois quantifiées de l'UX.
STATUT : propriété universelle
SOURCE : S3
ÉNONCÉ : Le temps d'atteinte d'une cible croît avec la distance à parcourir et décroît avec la taille de la cible : une action fréquente est grande et placée près de son contexte d'usage, et les bords d'écran comptent comme des cibles de profondeur infinie.
MESURE : toute action fréquente présente une zone tactile ≥ 44 px CSS (WCAG 2.5.5)

RÈGLE [LAWS-R15] : **Goal-Gradient Effect — l'effort s'intensifie près du but.** La progression visible motive d'autant plus qu'on approche de la fin (FORM-multi-step). Frontière : la progression doit être *vraie* — une fausse jauge (progrès artificiel, étapes gonflées) trahit l'effet.
STATUT : parti pris d'identité
SOURCE : S23, interne
ÉNONCÉ : Toute progression affichée reflète l'avancement réel de la tâche : ni étape gonflée, ni avance offerte, ni jauge qui progresse sans travail accompli.
MESURE : la valeur de progression affichée est une fonction du nombre d'étapes réellement franchies sur le nombre d'étapes réellement requises

RÈGLE [LAWS-R16] : **Tesler's Law — la complexité se conserve.** Toute tâche a une complexité irréductible ; la seule question est *qui l'absorbe* — le système ou l'utilisateur. Le système absorbe : autofill et normalisation (INPUT/Postel), messages qui diagnostiquent à la place de l'utilisateur (INPUT : *pourquoi* et *comment corriger*), valeurs par défaut sensées. Frontière : on ne peut pas supprimer la complexité, seulement décider où elle tombe — la reporter *toujours* sur l'utilisateur est le défaut par paresse.
STATUT : parti pris d'identité
SOURCE : S11, interne
ÉNONCÉ : La complexité irréductible d'une tâche est absorbée par le système et non reportée sur la personne : normalisation des saisies, valeurs par défaut sensées, messages qui énoncent la cause et la correction.

RÈGLE [LAWS-R17] : **Postel's Law (robustesse) — tolérant en entrée, strict en sortie.** Accepter les formes variées de saisie (espaces dans un IBAN ou un numéro de carte, casse d'un e-mail, tirets d'un téléphone) et normaliser en interne ; ne jamais rejeter sur la forme ce qu'on peut nettoyer. Implémenté par la tolérance de l'INPUT et sa validation qui vise le sens, pas la syntaxe cosmétique.
STATUT : propriété universelle
SOURCE : S25, S26, S12, S24
ÉNONCÉ : Une saisie est acceptée dans toutes ses formes usuelles — espaces, tirets, parenthèses, casse — puis normalisée en interne ; aucun rejet ne porte sur une forme que le système peut nettoyer, et la validation porte sur le sens.
MESURE : un numéro de téléphone, un numéro de carte ou une adresse e-mail saisis avec espaces, tirets ou casse variable sont acceptés et normalisés sans message d'erreur

RÈGLE [LAWS-R18] : **Occam's Razor — la solution la plus simple qui marche gagne.** Ne pas provisionner ce qu'aucun besoin réel ne réclame : disabled non tokenisé tant qu'inutile (COLOR), tokens qui naissent d'un besoin. C'est la version conception du principe d'économie du système.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Aucun token, état ou variante n'est provisionné avant qu'un besoin réel ne l'exige : la solution la plus simple qui répond au besoin constaté est retenue.
MESURE : tout token du système est référencé par au moins un consommateur

RÈGLE [LAWS-R19] : **Paradox of the Active User — personne ne lit la doc.** Les utilisateurs se lancent immédiatement plutôt que d'apprendre d'abord ; l'aide doit donc être *contextuelle et dans l'action*, pas préalable. Fonde « le helper text visible dès le focus, avant l'erreur » (INPUT) et l'onboarding intégré plutôt que le tutoriel bloquant (VOICE). Établi — observation robuste (Carroll & Rosson).
STATUT : propriété universelle
SOURCE : S13
ÉNONCÉ : L'aide est contextuelle et disponible dans l'action plutôt que préalable : aucune fonction ne suppose la lecture d'une documentation ou le passage par un tutoriel bloquant avant usage.
MESURE : aucun écran d'apprentissage obligatoire ne précède l'accès à une fonction

RÈGLE [LAWS-R20] : **Flow (Csíkszentmihályi) — la concentration ininterrompue est précieuse.** Rien ne doit rompre l'élan sans raison : le MOTION « ne verrouille jamais l'interaction », le contenu « ne se déplace jamais sans action de l'utilisateur » (SPACING/MOTION). L'interruption se justifie seulement quand l'enjeu la vaut (destructive, perte de données).
STATUT : propriété universelle
SOURCE : S32, S33
ÉNONCÉ : Le contenu ne se déplace ni ne change de contexte sans action de la personne, et aucune animation ne verrouille l'interaction ; l'interruption n'est légitime que devant un enjeu destructeur ou une perte de données.
MESURE : aucun changement de contexte non déclenché par l'utilisateur (WCAG 3.2.5) ; tout contenu en mouvement ou en mise à jour automatique de plus de 5 s est pausable (WCAG 2.2.2) ; aucune animation ne bloque les entrées

RÈGLE [LAWS-R21] : **Parkinson's Law — la tâche remplit le temps disponible (trou signalé).** Une tâche s'étale jusqu'à occuper le temps qu'on lui laisse ; d'où l'intérêt des accélérateurs (autofill, valeurs par défaut, raccourcis). Non couvert par un consommateur actuel — le produit n'a pas encore de mécanique de temps ni de saisie longue ; activé le jour d'un formulaire lourd ou d'une limite temporelle.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Le catalogue déclare Parkinson comme trou assumé : aucune règle d'accélérateur de saisie n'est écrite tant que le produit n'a ni saisie longue ni limite de temps, et le sujet est réactivé avec la première surface concernée.

## 3. Perception et regroupement (lois de Gestalt)

> **Pourquoi ce bloc est solide** : les lois de Gestalt sont les mieux établies du catalogue (psychologie de la perception, un siècle de validation). Le système en dépend lourdement — surtout la proximité.

RÈGLE [LAWS-R22] : **Proximity — proche = lié.** Les éléments rapprochés sont perçus comme un groupe, indépendamment de tout trait. C'est la loi que SPACING transforme en *information* : un label collé à son champ lui appartient ; un écart plus grand sépare deux groupes. La loi Gestalt la plus adossée au système.
STATUT : propriété universelle
SOURCE : S2
ÉNONCÉ : Les éléments rapprochés sont perçus comme un groupe indépendamment de tout trait : l'espacement porte donc l'information de regroupement, avec un écart plus petit à l'intérieur d'un groupe qu'entre deux groupes.
MESURE : l'écart interne à un groupe est strictement inférieur à l'écart qui le sépare du groupe voisin

RÈGLE [LAWS-R23] : **Common Region — une frontière partagée regroupe.** Un fond ou un cadre commun lie son contenu plus fort que la proximité seule. Implémenté par la CARD (le conteneur *est* le groupe) et le rôle de regroupement de la BORDER.
STATUT : propriété universelle
SOURCE : S2
ÉNONCÉ : Un fond ou un cadre commun regroupe son contenu plus fortement que la proximité seule : un conteneur déclare un groupe et ne s'emploie donc jamais comme simple ornement.

RÈGLE [LAWS-R24] : **Similarity — semblable = même famille.** Les éléments qui partagent forme, couleur ou taille sont perçus comme apparentés. Fonde les registres de COLOR (même rôle → même traitement) et la cohérence des tones.
STATUT : propriété universelle
SOURCE : S2
ÉNONCÉ : Les éléments qui partagent forme, couleur ou taille sont perçus comme appartenant à la même famille : un même rôle reçoit toujours le même traitement visuel, et deux rôles distincts n'en partagent jamais un seul.

RÈGLE [LAWS-R25] : **Uniform Connectedness — le lien visuel explicite prime.** Ce qui est relié par un trait ou un fond continu est le regroupement le plus fort de tous (au-dessus de la proximité et de la similarité). Implémenté par les séparateurs/regroupements de BORDER et les fonds `*-subtle` de l'alert.
STATUT : propriété universelle
SOURCE : S2
ÉNONCÉ : Un lien visuel explicite — trait continu ou fond partagé — produit le regroupement le plus fort, au-dessus de la proximité et de la similarité ; il s'emploie là où le groupement doit être sans ambiguïté.

RÈGLE [LAWS-R26] : **Prägnanz / Loi de simplicité — l'œil cherche la forme la plus simple.** On perçoit le complexe comme l'arrangement le plus simple possible. Fonde l'iconographie à trait constant (ICONOGRAPHY) et les silhouettes distinctes des tones (les formes font le travail que la couleur ne garantit pas — COLOR/daltonisme).
STATUT : propriété universelle
SOURCE : S2
ÉNONCÉ : La perception ramène le complexe à l'arrangement le plus simple : les formes portent le sens indépendamment de la couleur — trait constant en iconographie, silhouettes distinctes selon les états — afin qu'aucune information ne repose sur la seule teinte.

RÈGLE [LAWS-R27] : **Von Restorff Effect (isolation) — ce qui diffère se retient.** L'élément visuellement isolé est mémorisé et attire l'action. C'est la justification du primary *unique* (BUTTON) et de la couleur de marque *parcimonieuse* (COLOR). Frontière : l'effet s'annule si tout se distingue — un écran où tout est mis en avant n'a plus de point focal (la même inflation que « le primary partout »).
STATUT : propriété universelle
SOURCE : S27, S14
ÉNONCÉ : Un élément qui rompt l'homogénéité de son contexte est mieux mémorisé, et l'effet disparaît dès que la distinction se généralise : la mise en avant et l'action primaire restent uniques dans leur vue.
MESURE : au plus un élément par vue porte le traitement d'accentuation réservé

RÈGLE [LAWS-R28] : **Serial Position Effect — on retient le début et la fin (partiellement couvert).** Dans une liste, les premiers et derniers éléments sont mieux mémorisés que le milieu ; placer les items importants aux extrémités. Implicite dans l'ordre des actions, mais **trou** : pas de règle explicite tant qu'un composant navigation/liste n'existe pas — activé avec lui.
STATUT : propriété universelle
SOURCE : S28
ÉNONCÉ : Dans une liste, les éléments de tête et de queue sont mieux mémorisés que ceux du milieu : les entrées décisives se placent aux extrémités et jamais au centre d'une longue série.

## 4. Temps, effort perçu et confiance

RÈGLE [LAWS-R29] : **Doherty Threshold — sous ~400 ms, l'utilisateur reste dans le flux.** Quand système et utilisateur répondent l'un à l'autre sous 400 ms, l'engagement se maintient et la productivité grimpe. C'est la borne haute de toute l'échelle du MOTION ; le feedback perçu-instantané est sous ~100 ms (Nielsen). Établi — un des seuils fondateurs, déjà pleinement implémenté.
STATUT : propriété universelle
SOURCE : S29, S5
ÉNONCÉ : Une réponse du système obtenue sous 400 ms maintient la personne dans son flux et une réponse sous 100 ms est perçue comme instantanée : ces deux seuils bornent l'échelle des durées d'animation et de retour du système.
MESURE : toute durée d'animation ou de retour du système ≤ 400 ms ; retour d'appui perçu instantané ≤ 100 ms

RÈGLE [LAWS-R30] : **Aesthetic-Usability Effect — le beau paraît utilisable (un risque autant qu'un levier).** Un design perçu comme esthétique est jugé plus facile à utiliser, *même quand il ne l'est pas*. Levier : le soin visuel achète de la tolérance aux petits défauts. **Risque, et c'est le point** : le fini esthétique **masque les problèmes d'utilisabilité en test** — les utilisateurs les signalent moins. Règle du système : ne **jamais** laisser « c'est beau » clore une question d'utilisabilité en revue ; l'esthétique et l'utilisabilité se vérifient séparément (parallèle exact au « contraste et redondance sont deux exigences indépendantes » de COLOR).
STATUT : parti pris d'identité
SOURCE : S9, S30, S31
ÉNONCÉ : L'esthétique et l'utilisabilité se vérifient séparément : un jugement esthétique favorable ne clôt jamais une question d'utilisabilité en revue, car le soin visuel gonfle l'utilisabilité perçue et fait sous-déclarer les défauts en test.

RÈGLE [LAWS-R31] : **Peak-End Rule — on juge sur le pic et la fin.** Le souvenir d'une expérience est dominé par son moment le plus intense et par sa fin, pas par sa moyenne. Conséquence : soigner *particulièrement* les moments d'erreur (pic négatif) et de succès/clôture (la fin) — c'est là que se joue le VOICE (ton du message d'erreur : calme, orienté solution ; ton du message final : net, sans sur-célébration). Établi (Kahneman) ; l'ampleur exacte en UI reste contextuelle.
STATUT : propriété universelle
SOURCE : S8
ÉNONCÉ : Le souvenir d'un parcours est dominé par son moment le plus intense et par sa fin : les messages d'erreur et les messages de clôture reçoivent un soin supérieur au reste — calmes et orientés solution pour les premiers, nets et sans sur-célébration pour les seconds.

RÈGLE [LAWS-R32] : **Jakob's Law — l'utilisateur passe son temps sur *d'autres* produits.** Il s'attend donc à ce que le tien marche comme ceux qu'il connaît déjà. C'est la **justification méthodologique du benchmark** présent dans chaque fiche du système (Carbon, Polaris, Material, GOV.UK, Atlassian) : converger avec les conventions établies n'est pas un manque d'originalité, c'est respecter la mémoire acquise de l'utilisateur. La loi la plus structurante pour ce système — elle explique pourquoi « convergence » est un niveau de confiance à part entière. Frontière : suivre la convention *sauf* quand elle est mesurablement mauvaise (le disabled comme validation, écarté malgré sa fréquence — cf. DECISIONS.md).
STATUT : note de méthode
SOURCE : S10
ÉNONCÉ : Chaque fiche du système porte un benchmark des design systems publics de référence : converger avec les conventions rencontrées ailleurs est une exigence de méthode, et s'en écarter demande un motif journalé.
MESURE : chaque fiche comporte une section de benchmark citant au moins deux design systems publics

## Bonus — deux mythes réfutés (pour couper court en revue)

RÈGLE [LAWS-R33] : **« La règle des 3 clics » est fausse.** Aucune donnée ne montre que les utilisateurs abandonnent après 3 clics ; ce qui compte est que *chaque* clic soit évident et progresse vers le but, pas leur nombre (étude Joshua Porter / UIE). À opposer à toute exigence « tout doit être atteignable en 3 clics ».
STATUT : propriété universelle
SOURCE : S7, S34
ÉNONCÉ : Aucune exigence du système ne se formule en nombre de clics : la qualité d'un parcours se juge à l'évidence de chaque étape et à sa progression vers le but, pas au décompte des interactions.
MESURE : aucune règle du système ne fixe un plafond de clics ou de niveaux de profondeur

RÈGLE [LAWS-R34] : **« Miller = 7 items » est un abus** (traité au § 1) — la source ne dit pas ça.
STATUT : note de méthode
SOURCE : S6, S16
ÉNONCÉ : Le catalogue traite le « 7±2 de Miller » comme un mythe réfuté et renvoie au traitement unique de la règle correspondante, sans le redocumenter une seconde fois.

> **Pourquoi ces deux-là ici** : ce sont les « lois » les plus dégainées en réunion pour trancher un désaccord sans donnée. Les documenter avec leur réfutation, c'est donner à l'IA consommatrice et à l'humain de quoi *remonter* plutôt que d'obéir à une formule.

## Risque

RÈGLE [LAWS-R35] : table ci-dessous — le risque d'un principe-catalogue n'est pas visuel mais **argumentatif** (une loi mal invoquée justifie une mauvaise décision).
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Le catalogue porte une table de risque dont les entrées sont argumentatives et non visuelles : chaque manière connue de mal invoquer une loi y figure avec sa sévérité.
MESURE : la table de risque du catalogue couvre au moins la citation hors source, le retournement en dark pattern, l'esthétique qui masque un défaut et la loi appliquée sans sa tension

| Cas | Risque principal | Sévérité |
|---|---|---|
| Loi citée hors de sa source (Miller « 7 », 3 clics) | Décision justifiée par un mythe, débat clos à tort | Élevée |
| Loi manipulable retournée en dark pattern (Zeigarnik, Goal-gradient) | Exploitation de l'utilisateur, perte de confiance, enjeu éthique | Élevée |
| Aesthetic-usability qui masque un défaut d'UX en test | Problème réel non détecté car « c'est joli » | Élevée |
| Une seule loi appliquée en ignorant sa tension (Hick vs découvrabilité) | Sur-simplification, fonction enfouie | Moyenne à élevée |
| Loi appliquée mais non nommée (règle sans sa justification) | Règle fragile, indéfendable en revue, dupliquée par ignorance | Moyenne |
| Von Restorff dilué (tout est mis en avant) | Plus aucun point focal — inflation | Moyenne |

## Règle transversale

RÈGLE [LAWS-R36] : **une loi UX explique une règle, elle ne la remplace pas — et jamais seule.** Ce fichier donne le *pourquoi* profond des contraintes écrites ailleurs ; il ne crée pas de contrainte, ne porte pas de valeur, et n'autorise personne à trancher un arbitrage « parce qu'une loi le dit ». Quand deux lois se contredisent (elles le font souvent), on remonte.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Une loi UX explique une règle et ne la remplace jamais : aucune décision de design n'est tranchée par l'invocation d'une loi unique, et une contradiction entre deux lois remonte au lieu d'être arbitrée localement.

> **Pourquoi** : c'est la déclinaison théorique du principe des canaux du système (COLOR : jamais la couleur seule ; MOTION : le mouvement confirme, n'informe jamais seul). Ici : **la loi éclaire, elle ne décide jamais seule.** Une décision de design adossée à une unique loi hors contexte est aussi fragile qu'une information portée par un seul canal.

## Carte d'application — où chaque loi vit déjà (la « couche concrète » de ce principe)

> Cette table remplace la couche `LAWS-UI` absente : elle relie chaque loi à la règle qui l'implémente, pour que citer la loi et trouver son implémentation soit un seul geste. C'est l'outil qui résorbe le trou-type de ce principe (la loi appliquée mais non nommée).

| Loi | Implémentée par | Fichier faisant autorité |
|---|---|---|
| Cognitive Load | Registre productif, échelles fermées, tokens à la demande — et le contrat opérationnel transversal | MOTION-UX, SPACING-UX, DESIGN.md (guardrails), COGNITIVE-LOAD-UX |
| Chunking / Working Memory | Étapes, ask-once, récapitulation, helper persistant | FORM-UX (multi-step), INPUT-UX |
| Zeigarnik | Progression, autosave | FORM-UX (multi-step, autosave) |
| Selective Attention | Sobriété du mouvement, rareté de l'alert, anti-camouflage | MOTION-UX, ALERT-UX, COGNITIVE-LOAD-UX |
| Hick / Choice Overload | Primary unique, registres, cardinalité des actions | BUTTON-UX, COLOR-UX, CARD-UX, ALERT-UX |
| Fitts | Zone tactile 44px, cibles proches | BUTTON-UI (WCAG 2.5.5) |
| Goal-Gradient | Progression du multi-step | FORM-UX |
| Tesler | Autofill, normalisation, messages qui diagnostiquent | INPUT-UX |
| Postel | Tolérance de saisie, normalisation | INPUT-UX |
| Occam | Pas de provision sans besoin (grid, disabled) | SPACING-UX, COLOR-UX |
| Paradox of the Active User | Helper avant erreur, onboarding contextuel | INPUT-UX, VOICE-UX |
| Flow | Non-verrouillage, pas de déplacement non sollicité | MOTION-UX, SPACING-UX |
| Gestalt (proximité, région, similarité, connexité, Prägnanz) | Proximité = info, conteneurs, registres, trait constant | SPACING-UX, CARD-UX, BORDER-UX, COLOR-UX, ICONOGRAPHY-UX |
| Von Restorff | Primary unique, marque parcimonieuse | BUTTON-UX, COLOR-UX |
| Serial Position | (trou — attend un composant navigation/liste) | — |
| Doherty | Échelle sous 400 ms, feedback < 100 ms — et le contrat des attentes | MOTION-UX / DESIGN.md (motion.*), PERFORMANCE-UX |
| Aesthetic-Usability | Traité comme risque de revue | ce fichier (§ risque) |
| Peak-End | Ton des messages d'erreur et de clôture | VOICE-UX, ALERT-UX, INPUT-UX |
| Jakob | Le benchmark de chaque fiche | méthode (README §5, METHODE §5) |
| Parkinson | (trou — attend une mécanique de temps) | — |

## Sources et niveau de confiance

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| S1 | Corpus de référence des « lois UX » (énoncés, regroupements) | [Laws of UX — Jon Yablonski](https://lawsofux.com/) (et l'ouvrage *Laws of UX*, O'Reilly) | Établi comme vulgarisation de référence — chaque loi renvoyée à sa source primaire ci-dessous |
| S2 | Lois de Gestalt (proximité, similarité, région commune, connexité, Prägnanz) | Psychologie de la Gestalt (Wertheimer, Koffka) ; [IxDF — Gestalt principles](https://www.interaction-design.org/literature/topics/gestalt-principles) | Établi — un siècle de validation en perception |
| S3 | Fitts's Law (temps ∝ distance/taille) | Fitts (1954) ; [NN/g — Fitts's Law](https://www.nngroup.com/articles/fitts-law/) | Établi — loi quantifiée robuste |
| S4 | Hick's Law (temps de décision ∝ log du nombre de choix) | Hick (1952), Hyman (1953) ; [lawsofux.com/hicks-law](https://lawsofux.com/hicks-law/) | Établi — avec la nuance « complexité, pas seulement nombre » |
| S5 | Doherty Threshold (~400 ms) | Doherty & Thadhani, IBM (1982) ; [lawsofux.com/doherty-threshold](https://lawsofux.com/doherty-threshold/) ; convergent avec [NN/g — Response Times](https://www.nngroup.com/articles/response-times-3-important-limits/) | Établi — déjà implémenté par MOTION |
| S6 | Miller (1956) porte sur la mémoire de travail, PAS sur une limite d'items UI | [Miller, *The Magical Number Seven*](https://psychclassics.yorku.ca/Miller/) ; [NN/g — The Myth of “Seven, Plus or Minus 2”](https://www.nngroup.com/articles/short-term-memory-and-web-usability/) | Établi (réfutation du mythe) |
| S7 | « Règle des 3 clics » non fondée | [UIE / Joshua Porter — Testing the Three-Click Rule](https://articles.uie.com/three_click_rule/) | Établi (réfutation) |
| S8 | Peak-End Rule | Kahneman & Tversky ; [NN/g — Peak-End Rule](https://www.nngroup.com/articles/peak-end-rule/) | Établi (mémoire) ; ampleur en UI contextuelle |
| S9 | Aesthetic-Usability Effect | Kurosu & Kashimura (1995), Tractinsky ; [NN/g — Aesthetic-Usability Effect](https://www.nngroup.com/articles/aesthetic-usability-effect/) | Établi — y compris son revers (masque les défauts en test) |
| S10 | Jakob's Law | [NN/g — Jakob's Law of Internet UX](https://www.nngroup.com/videos/jakobs-law-internet-ux/) ; [lawsofux.com/jakobs-law](https://lawsofux.com/jakobs-law/) | Établi — fonde la pratique du benchmark |
| S11 | Tesler's Law (conservation de la complexité) | Larry Tesler ; [lawsofux.com/teslers-law](https://lawsofux.com/teslers-law/) | Convergence — heuristique de conception largement admise |
| S12 | Postel's Law (robustesse) | RFC 760/761 (Jon Postel) ; [lawsofux.com/postels-law](https://lawsofux.com/postels-law/) | Établi en réseau ; transposé UI par convergence |
| S13 | Paradox of the Active User | Carroll & Rosson (1987) ; [NN/g](https://www.nngroup.com/articles/paradox-of-the-active-user/) | Établi par recherche |
| S14 | Zeigarnik, Goal-Gradient, Serial Position, Von Restorff, Selective Attention, Flow, Parkinson, Occam, Choice Overload | Sources primaires respectives, agrégées par [lawsofux.com](https://lawsofux.com/) et [IxDF](https://www.interaction-design.org/) | Mixte — effets réels d'ampleur variable, chacun marqué dans son entrée |
| S15 | Sweller (1988) fonde la théorie de la charge cognitive : une présentation qui impose au penseur un traitement mental sans rapport avec l'apprentissage visé consomme la capacité de travail et dégrade le résultat — c'est la charge extrinsèque. | [Sweller, J. (1988). *Cognitive Load During Problem Solving: Effects on Learning*, Cognitive Science 12, 257–285](https://mrbartonmaths.com/resourcesnew/8.%20Research/Explicit%20Instruction/Cognitive%20Load%20during%20problem%20solving.pdf) | Établi — article original, théorie massivement répliquée. Réserve : le corpus est celui de la psychologie de l'apprentissage (résolution de problèmes, instruction) ; la transposition à l'interface est une extension par analogie, pas un résultat de Sweller. |
| S16 | Miller (1956) sépare explicitement deux limites qui partagent par coïncidence le chiffre 7 : l'empan du jugement absolu (limité par la quantité d'information, en bits) et l'empan de mémoire immédiate (limité par le nombre d'unités, en chunks). Il écrit lui-même que ce sont « des sortes de limitations tout à fait différentes », ouvre par « j'ai été persécuté par un entier », et ne prescrit AUCUNE limite de menu, de liste ou de champ. | [Miller, G. A. (1956). *The Magical Number Seven, Plus or Minus Two*, Psychological Review 63(2), 81–97 — texte intégral](https://labs.la.utexas.edu/gilden/files/2016/04/MagicNumberSeven-Miller1956.pdf) | Établi — source primaire lue. **Corrige le fichier LAWS-UX lui-même** : LAWS-R07 attribue à Miller « la capacité de la mémoire de travail sur des unités non structurées ». C'est encore la lecture populaire : Miller distingue jugement absolu et empan mnésique et refuse de les confondre. La réfutation du mythe est bonne, sa reformulation ne l'est pas. |
| S17 | Cowan (2001) réexamine la capacité de stockage à court terme : quand le regroupement et la répétition subvocale sont empêchés, la limite centrale se situe autour de **quatre** unités, pas sept. | [Cowan, N. (2001). *The magical number 4 in short-term memory: a reconsideration of mental storage capacity*, Behavioral and Brain Sciences 24(1), 87–114](https://philpapers.org/rec/COWTMN) | Établi — article de référence avec commentaires par les pairs. Renforce la réfutation de LAWS-R07/R34 et **contredit la valeur de 7** que le fichier laisse implicitement subsister. |
| S18 | La sixième heuristique de Nielsen (« Recognition rather than recall ») pose que l'interface doit minimiser la charge mnésique en rendant visibles éléments, actions et options plutôt qu'en exigeant leur rappel. | [Nielsen, J. — *10 Usability Heuristics for User Interface Design* (heuristiques 4 et 6), NN/g, 1994](https://www.nngroup.com/articles/ten-usability-heuristics/) | Établi — jeu d'heuristiques publié en 1994 après analyse factorielle de 249 problèmes d'utilisabilité, adopté comme norme de fait dans toute la profession. Fonde LAWS-R09 mieux que Miller ne le ferait. |
| S19 | La cécité aux bannières est documentée par dix ans d'oculométrie : les gens ne regardent presque jamais ce qui a l'apparence d'une publicité, que ce soit une publicité ou non ; l'exception éthiquement problématique est la publicité déguisée en contenu éditorial, qui capte des fixations. | [NN/g — *Banner Blindness: Old and New Findings* / the original eyetracking research (recherche menée depuis 1997)](https://www.nngroup.com/articles/banner-blindness-original-eyetracking/) | Établi — programme oculométrique longitudinal. Fonde directement l'interdiction anti-camouflage de LAWS-R11. |
| S20 | La loi de Hick est très largement mal appliquée en IHM : dans les tâches d'interface, très compatibles stimulus-réponse et sur-apprises, le temps de réaction au choix peut souvent être considéré comme constant. Le caractère logarithmique de la recherche dans un menu hiérarchique vient de la recherche visuelle (Landauer & Nachbar 1985), pas de Hick. Les auteurs montrent même que, prise au pied de la lettre, la loi de Hick suggère d'afficher **le plus d'items possible** — l'inverse du « moins, c'est mieux » qu'on lui fait dire. | [Liu, W., Gori, J., Rioul, O., Beaudouin-Lafon, M. & Guiard, Y. (2020). *How Relevant is Hick's Law for HCI ?*, CHI '20](https://perso.telecom-paristech.fr/rioul/publis/202001liugoririoulbeaudouinlafonguiard.pdf) | Établi — article de conférence majeure (CHI), analyse formelle. **Contredit frontalement l'usage que LAWS-R12 fait de Hick** : Hick (1952) et Hyman (1953) existent bien, mais ils ne fondent ni « un seul primary par vue » ni la réduction du nombre d'options en interface. |
| S21 | La méta-analyse de la surcharge de choix couvre 63 conditions expérimentales, 50 études et 5 036 participants : la taille d'effet moyenne est **quasiment nulle**, avec une variance considérable entre études, et les auteurs ne parviennent pas à identifier de conditions suffisantes de son apparition. | [Scheibehenne, B., Greifeneder, R. & Todd, P. M. (2010). *Can There Ever Be Too Many Options? A Meta-Analytic Review of Choice Overload*, Journal of Consumer Research 37(3), 409–425](https://academic.oup.com/jcr/article-abstract/37/3/409/1827647) | Établi — méta-analyse revue par les pairs (contestée par Chernev et al. 2010, ce qui laisse au mieux un effet conditionnel). **Interdit de traiter LAWS-R13 comme universel** : la « surcharge de choix » n'est pas un effet robuste. |
| S22 | Méta-analyse 2025 de l'effet Zeigarnik : le rapport des tâches interrompues rappelées sur les tâches achevées rappelées est de **0,99** — aucun avantage mnésique pour l'inachevé. Les auteurs concluent que l'effet « manque de validité universelle » et « ne peut simplement pas être répliqué de manière fiable ». L'effet Ovsiankina (reprise de la tâche interrompue, 67 %) tient, lui. | [Ghibellini, R. & Meier, B. (2025). *Interruption, recall and resumption: a meta-analysis of the Zeigarnik and Ovsiankina effects*, Humanities and Social Sciences Communications](https://www.nature.com/articles/s41599-025-05000-w) | Établi — méta-analyse revue par les pairs. **Contredit LAWS-R10** : la barre de progression et l'autosave restent de bonnes idées, mais Zeigarnik ne les justifie pas ; c'est la reprise (Ovsiankina) qui est étayée, pas la rémanence mnésique. |
| S23 | Kivetz, Urminsky & Zheng (2006) ressuscitent l'hypothèse du gradient de but chez l'humain — et documentent en même temps la **progression illusoire** : les clients qui reçoivent une carte de 12 cases dont 2 sont pré-tamponnées achèvent leurs 10 achats plus vite que ceux qui reçoivent une carte de 10 cases vierges. | [Kivetz, R., Urminsky, O. & Zheng, Y. (2006). *The Goal-Gradient Hypothesis Resurrected: Purchase Acceleration, Illusionary Goal Progress, and Customer Retention*, Journal of Marketing Research 43(1), 39–58](https://journals.sagepub.com/doi/abs/10.1509/jmkr.43.1.39) | Établi — article original revu par les pairs. **Contredit la frontière posée par LAWS-R15** (« une fausse jauge trahit l'effet ») : empiriquement, la jauge gonflée fonctionne mieux. L'objection à la progression truquée est **éthique**, pas empirique — et le fichier doit le dire ainsi, sous peine d'être réfuté en revue par la source qu'il invoque. |
| S24 | L'IETF a explicitement révisé le principe de robustesse de Postel : tolérer les entrées inattendues « n'est plus considéré comme une bonne pratique dans tous les scénarios », parce que les conséquences négatives sur l'interopérabilité s'accumulent quand une implémentation accepte silencieusement une entrée défectueuse, et qu'un défaut toléré devient un standard de fait. | [RFC 9413 — *Maintaining Robust Protocols*, M. Thomson & D. Schinazi, IAB, juin 2023 (issu du draft « The Harmful Consequences of the Robustness Principle »)](https://datatracker.ietf.org/doc/html/rfc9413) | Établi — RFC de l'IAB. **Rend caduque la source réseau invoquée par LAWS-R17** (RFC 760/761) : citer « Postel » comme norme est aujourd'hui faux côté protocoles. La pratique UI (tolérance de saisie) reste valide, mais elle doit être sourcée sur les design systems, pas sur les RFC. |
| S25 | GOV.UK impose la tolérance de saisie : « Allow users enter phone numbers in whatever format is familiar to them. Allow for additional spaces, hyphens, dashes and brackets » ; et pour les cartes : « Let users enter payment card numbers in whatever format is familiar to them. Allow additional spaces, hyphens and dashes. » | [GOV.UK Design System — Phone numbers](https://design-system.service.gov.uk/patterns/phone-numbers/) ; [GOV.UK Design System — Payment card details](https://design-system.service.gov.uk/patterns/payment-card-details/) | Établi — design system public d'État, guidance normative explicite sur deux patterns distincts. |
| S26 | Le design system de l'ONS pose la même exigence : le champ téléphone « doit accommoder toutes les variations de numéro pour que l'utilisateur saisisse dans le format dont il a l'habitude », espaces, parenthèses, tirets et indicatifs compris. | [ONS Service Manual — Design system, Ask users for: Phone numbers](https://service-manual.ons.gov.uk/design-system/patterns/phone-numbers) | Établi — second design system public. Réserve : l'ONS prescrit l'acceptation, pas explicitement la normalisation en interne. Avec GOV.UK (S25), la convergence sur la tolérance de saisie est acquise ; la normalisation reste un choix interne. |
| S27 | Hunt (1995) revient à ce que von Restorff a réellement montré : la saillance perceptive **n'est pas nécessaire** à l'effet d'isolation, et la différence entre l'item isolé et son entourage n'y suffit pas — elle ne produit l'effet que rapportée à un contexte de similarité. La distinctivité est un construit théorique sur la mémoire, pas un synonyme de « ça saute aux yeux ». | [Hunt, R. R. (1995). *The subtlety of distinctiveness: What von Restorff really did*, Psychonomic Bulletin & Review 2(1), 105–112](https://link.springer.com/article/10.3758/BF03214414) | Établi — article de revue revu par les pairs. **Nuance LAWS-R27** : von Restorff mesure de la **mémorisation**, pas de l'attraction de l'action ; « l'élément isolé attire l'action » est une extrapolation non sourcée. En revanche la frontière du fichier (« l'effet s'annule si tout se distingue ») est exactement ce que Hunt établit. |
| S28 | Glanzer & Cunitz (1966) dissocient les deux moitiés de la courbe de position sérielle : après une tâche interférente de 30 secondes, l'effet de récence disparaît alors que l'effet de primauté subsiste — deux mécanismes de stockage distincts. | [Glanzer, M. & Cunitz, A. R. (1966). *Two storage mechanisms in free recall*, Journal of Verbal Learning and Verbal Behavior 5(4), 351–360](https://psychologysorted.blog/wp-content/uploads/2019/07/glanzer-and-cunitz_1966.pdf) | Établi — un des effets les mieux répliqués de la psychologie de la mémoire (avec Murdock 1962). Réserve pour l'UI : l'effet est mesuré en **rappel libre de listes de mots mémorisées**, pas en lecture d'une liste qui reste affichée — la transposition à une navigation visible relève de la convergence, pas de la démonstration. |
| S29 | Doherty & Thadhani (1982) mesurent la productivité de programmeurs et d'ingénieurs selon le temps de réponse du système : le nombre de transactions par heure croît nettement sous la seconde, et passer de 3 s à 0,3 s fait passer un programmeur de 180 à 371 transactions par heure (+106 %). | [Doherty, W. J. & Thadhani, A. J. (1982). *The Economic Value of Rapid Response Time*, IBM (novembre 1982) — notice du Computer History Museum](https://www.computerhistory.org/collections/catalog/102751398) ; [texte intégral repris](https://jlelliotton.blogspot.com/p/the-economic-value-of-rapid-response.html) | Établi comme source primaire réelle — mais **c'est une étude de productivité industrielle, pas une expérience psychologique contrôlée**, et le seuil de 400 ms popularisé sous le nom de « Doherty Threshold » est une lecture postérieure : le document argumente le passage sous la seconde et illustre à 300 ms. Sa transposition en plafond de **durée d'animation** est une extension du système, légitime mais nôtre. |
| S30 | Sonderegger & Sauer (2010) testent 60 adolescents sur deux simulations de téléphone fonctionnellement identiques ne différant que par l'apparence : l'appareil attrayant produit **à la fois** des temps de tâche réduits et une utilisabilité perçue supérieure. | [Sonderegger, A. & Sauer, J. (2010). *The influence of design aesthetics in usability testing: effects on user performance and perceived usability*, Applied Ergonomics 41(3), 403–410](https://pubmed.ncbi.nlm.nih.gov/19892317/) | Établi — expérience contrôlée revue par les pairs. **Nuance LAWS-R30** : la formule « le beau paraît utilisable même quand il ne l'est pas » est trop tranchée ; l'esthétique influe fortement sur le perçu et de façon variable sur la performance réelle. La règle de revue (vérifier séparément) reste bonne, sa justification doit être reformulée. |
| S31 | L'effet esthétique-utilisabilité a pour source primaire Kurosu & Kashimura, *Apparent usability vs. inherent usability*, dans les actes compagnons de CHI '95 (ACM, p. 292–293), sur des distributeurs automatiques ; l'utilisabilité apparente y est moins corrélée à l'utilisabilité inhérente qu'à la beauté apparente. Tractinsky (2000) prolonge ce résultat. | [Aesthetic–usability effect — citation exacte de Kurosu & Kashimura (1995) et de Tractinsky (2000)](https://en.wikipedia.org/wiki/Aesthetic%E2%80%93usability_effect) | Convergence — la référence primaire est identifiée et vérifiable (CHI '95 companion), mais consultée ici via une source secondaire, l'original étant sous paywall ACM. À remplacer par la référence ACM le jour d'un accès. |
| S32 | WCAG 2.2, critère 3.2.5 « Change on Request » (AAA) : « Changes of context are initiated only by user request or a mechanism is available to turn off such changes. » | [W3C — Understanding SC 3.2.5 Change on Request (WCAG 2.2)](https://www.w3.org/WAI/WCAG22/Understanding/change-on-request.html) | Établi — norme W3C. Fonde LAWS-R20 bien plus solidement que le concept de flow, qui n'a jamais été mesuré sur une interface. |
| S33 | WCAG 2.2, critère 2.2.2 « Pause, Stop, Hide » (niveau A) : tout contenu qui bouge, clignote, défile ou se met à jour automatiquement pendant plus de cinq secondes en parallèle d'un autre contenu doit pouvoir être mis en pause, arrêté ou masqué, sauf si le mouvement est essentiel. | [W3C — Understanding SC 2.2.2 Pause, Stop, Hide (WCAG 2.2)](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html) | Établi — norme W3C, niveau A. Seconde jambe normative de LAWS-R20. |
| S34 | L'étude qui réfute la règle des 3 clics porte sur 44 participants, 620 tâches et plus de 8 000 clics : la probabilité d'abandon après trois clics n'est pas supérieure à celle après douze, des participants poursuivent au-delà de 25 clics, et la satisfaction varie peu (46 % à 61 %) quelle que soit la longueur du parcours. L'auteur conclut que la plainte porte sur l'échec à trouver, pas sur le nombre de clics. | [Porter, J. (2003). *Testing the Three-Click Rule*, User Interface Engineering — URL actuelle (l'adresse articles.uie.com citée en S7 redirige désormais ici)](https://articles.centercentre.com/three_click_rule) | Établi comme réfutation, avec une réserve à porter : **étude industrielle, non revue par les pairs, un seul protocole**. Elle suffit à retirer tout fondement à la règle des 3 clics (qui n'en a jamais eu), pas à établir une loi inverse. À noter aussi : l'URL de S7 est morte et doit être mise à jour. |

*Aucune règle de ce fichier n'introduit de contrainte propre : chaque loi renvoie à une règle déjà sourcée dans sa fondation ou son composant. La confiance affichée ici porte sur la loi elle-même (est-elle vraie ?), pas sur l'implémentation (déjà vérifiée là où elle vit).*

## À approfondir

- **Serial Position Effect** : à activer avec un composant navigation/menu/liste — placer les entrées clés en tête et en pied.
- **Parkinson's Law** : à activer le jour d'une saisie longue ou d'une limite de temps — accélérateurs (autofill, défauts, raccourcis).
- **Selective Attention** : règle anti-camouflage **promue en RÈGLE** par le principe `cognitive-load` (2026-07-21) — reste à l'éprouver sur un premier composant de contenu marketing.
- **Éthique du design (dark patterns)** : ce fichier signale la frontière loi-par-loi ; un sujet transversal « patterns trompeurs » (Brignull / deceptive patterns) pourrait naître si le produit ajoute des surfaces d'acquisition ou de rétention.
- **Loi vs donnée produit** : ces lois sont générales ; le jour où le produit a de la mesure réelle (tests, analytics), la donnée locale prime sur la loi générale (comme un précédent journalé prime sur un benchmark).
