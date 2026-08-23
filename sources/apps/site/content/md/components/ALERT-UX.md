---
component: alert
layer: ux
version: 1.4.0 # 1.4.0 : rattachement nommé aux 4 Languages (Interaction, Motion, Voice, E-motion) — Alert désigné expression canonique de « Comprendre un état », lois d'affordance n°3/n°5 nommées, chorégraphie rattachée à MOTION-UX.md, contrat reduced-motion posé en POSITION explicite, tone relié à l'axe état-émotionnel de VOICE-UX.md, « ne jamais blâmer » et « le mot est le canal de dernier recours » nommés, section Instrument E-motion tranchant en négatif (E-motion délégué au success/toast de relais — arbitrage « un événement, un porteur » 2026-07-21) ; aucune règle existante retirée ni déplacée. 1.3.1 : vocabulaire aligné sur le modèle style × tone du bouton (DECISIONS 2026-07-18), aucune règle modifiée. 1.3.0 : contrat du canal sonore (un signal sonore reste doublé d'un message textuel, WCAG 1.4.1) — trou « partiel » de l'inventaire transversal accessibilité comblé chez son propriétaire (2026-07-14, cf. DECISIONS.md). 1.2.0 : renommage du composant callout → alert (décision 2026-07-11) — aucune règle modifiée, tous les renvois croisés mis à jour. Ancienne version : 1.1.3. # 1.1.3 : balisage RÈGLE/CONFIANCE, aucune règle modifiée. 1.1.2 : narration migrée vers DECISIONS.md. 1.1.1 : règle de silhouette d'icône (RAPPORT-TEST F03)
last_updated: 2026-07-21
companion: ALERT-UI.md
confidence: mixed
---

# Alert (banner / alert / notification inline) — Couche UX

> Ce fichier contient le raisonnement : tones, persistance, empilement, wording, risques. Tokens et techniques dans `ALERT-UI.md`.

## Note de transposition (à lire en premier)

RÈGLE [ALERT-R01] : les axes de l'alert sont **tone / persistance**.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Le composant alert se décrit par deux axes seulement : le tone (gravité) et la persistance (qui met fin au message).

RÈGLE [ALERT-R02] : **l'axe `style` n'existe pas ici.**
STATUT : note de méthode
SOURCE : S1
ÉNONCÉ : Le niveau de contraste visuel d'un alert découle de sa gravité et ne constitue pas un axe choisi par instance.
MESURE : aucune variante de contraste exposée par le composant

> **Pourquoi** : le candidat apparent (les notifications *high-contrast* / *low-contrast* de Carbon) n'est pas un axe indépendant : le niveau de contraste doit *suivre* la gravité du message — un danger discret ou un info tapageur seraient des mensonges d'interface. Un poids visuel qui découle mécaniquement d'un autre axe n'est pas un axe, c'est un rendu ; il vit dans ALERT-UI.md comme décision de style.

RÈGLE [ALERT-R03] : **tone : info / success / warning / danger — pas de `neutral`.** Sa valeur minimale est **info**, le degré zéro de la gravité, pas l'absence de sens.
STATUT : parti pris d'identité
SOURCE : S1, S3, S5, S6
ÉNONCÉ : Un alert porte l'un des quatre tones info, success, warning ou danger ; il n'existe pas de tone neutre, info étant le degré zéro de la gravité.
MESURE : l'énumération des tones vaut exactement info, success, warning, danger

> **Pourquoi** : l'alert ne peut pas être neutre : porter une charge sémantique est sa fonction même — c'est ce que `neutral` devient quand le composant *est* le message. Les 4 systèmes du benchmark convergent sur ce quatuor (Carbon, Polaris, Atlassian, Material).

RÈGLE [ALERT-R04] : sur le nom `danger` (vs `destructive` au bouton, `error` à l'input) — les trois composants nomment le même registre — la famille `color.danger` — par ce qu'il signifie *pour eux* : une action qui détruit, une saisie invalide, un état grave. Divergence assumée plutôt qu'un terme unique qui mentirait sur au moins un composant. (cf. DECISIONS.md.)
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Le registre de gravité maximale est nommé selon ce qu'il signifie pour chaque composant — danger pour l'alert, destructive pour le bouton, error pour l'input — sans terme unique imposé.

RÈGLE [ALERT-R05] : **size n'existe pas.** Largeur dictée par le conteneur (pleine page, section, élément), hauteur par le contenu. La variation de prominence selon le conteneur est un contexte d'intégration, pas un choix par instance.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : L'alert n'expose aucune variante de taille : sa largeur est celle de son conteneur et sa hauteur celle de son contenu.
MESURE : aucun axe size exposé par le composant

> **Pourquoi** : pas même une densité — un alert compact qui perdrait son icône ou son titre perdrait sa lisibilité de signal.

RÈGLE [ALERT-R06] : **persistance — permanent / dismissible** : l'axe qui encode *qui décide de la fin de vie du message* — personne tant que la condition est vraie (permanent), ou l'utilisateur (dismissible).
STATUT : parti pris d'identité
SOURCE : S2, S3
ÉNONCÉ : La persistance d'un alert vaut permanent lorsque seule la fin de la condition met fin au message, et dismissible lorsque l'utilisateur peut le clore.
MESURE : l'énumération de la persistance vaut exactement permanent, dismissible

> **Pourquoi** : distinction structurante dans tout le benchmark (Carbon : l'alert "ne se ferme jamais" ; Polaris : dismissible *sauf* information critique).

RÈGLE [ALERT-R07] : frontière du composant — la 3e valeur de persistance qu'on pourrait attendre, *temporaire* (le toast/snackbar, qui disparaît seul), est **exclue : c'est un autre composant**. Le critère est le rapport à la page : l'alert vit *dans le flux* (il charge avec le contenu ou s'y insère, pousse ce qui le suit, appartient au contexte qu'il annote) ; le toast vit *au-dessus du flux et dans le temps* (superposé, empilable, chronométré, placé par le système et non par la page). Même logique pour la modale d'alerte : elle bloque l'interaction, c'est un dialogue.
STATUT : note de méthode
SOURCE : S1, S5, S18
ÉNONCÉ : Un message chronométré qui se ferme seul relève du toast et un message qui bloque l'interaction relève de la modale : ni l'un ni l'autre n'est un alert.
MESURE : aucun alert ne se ferme automatiquement après un délai

Les trois forment l'échelle d'interruption documentée plus bas ("Quand ne pas l'utiliser"). (Cheminement complet du test de transposition et convergences du benchmark : cf. DECISIONS.md.)

## Partage d'autorité avec FORM-UX.md

RÈGLE [ALERT-R08] : le "résumé d'erreurs" de FORM-UX.md est structurellement un alert `danger` permanent placé en tête de formulaire.
STATUT : note de méthode
SOURCE : S26
ÉNONCÉ : Le résumé d'erreurs d'un formulaire est un alert de tone danger et de persistance permanente placé en tête de formulaire.

RÈGLE [ALERT-R09] : **ce fichier est la référence générique du conteneur** : structure (icône + titre + corps), redondance icône/couleur, tokens par tone, comportement `role="alert"`, non-dismissibilité tant que la condition persiste.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Ce fichier fait autorité sur le conteneur alert générique : structure, redondance icône/couleur, tokens par tone, rôles ARIA et non-dismissibilité.

RÈGLE [ALERT-R10] : **FORM-UX.md garde autorité sur l'orchestration propre au formulaire** : quand le résumé apparaît (échec de soumission), son contenu (chaque erreur reprend le message inline exact, en lien d'ancre vers le champ), la gestion du focus après échec, et la coexistence résumé/messages inline.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : L'orchestration du résumé d'erreurs dans un formulaire — déclenchement, contenu, gestion du focus, coexistence avec les messages inline — relève de FORM-UX.

(Décision : cf. DECISIONS.md.)

RÈGLE [ALERT-R11] : recoupement secondaire, non déplacé — la section "Dans une bannière (cookies/consentement ou promotionnelle)" de BUTTON-UX.md reste où elle est : elle régit les *boutons* d'une bannière de consentement, pas la bannière elle-même. La bannière de consentement en tant qu'objet est un pattern réglementaire (choix bloquant + persistance légale) qui déborde l'alert — signalé dans l'inventaire comme hors périmètre.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Les boutons d'une bannière de consentement relèvent de BUTTON-UX ; la bannière de consentement en tant qu'objet relève de CONSENTEMENT-UX.

## But

Un alert attire l'attention sur une information que le flux normal de la page ne suffirait pas à faire remarquer — un état du système, une condition qui affecte ce que l'utilisateur s'apprête à faire, le résultat d'une action passée. Contrairement au bouton (qui déclenche), à l'input (qui capture) et à la carte (qui organise), l'alert **interrompt — à un degré choisi**. Toute règle ci-dessous découle de ce statut : l'interruption est un budget qui s'épuise, chaque alert non indispensable dévalue tous les suivants.

RÈGLE [ALERT-R12] : dans la grille des six intentions d'`INTERACTION-UX.md` (§ Les six intentions), **l'alert est l'expression canonique de l'intention « Comprendre un état »** — recevoir un statut ou un retour. C'est l'ancrage de ce composant dans le langage Interaction : tout ce qui suit (non-interactivité de surface, redondance des canaux, wording du message) découle de cette promesse — l'alert *informe sur un état*, il ne *propose pas un geste*.
STATUT : parti pris d'identité
SOURCE : S11
ÉNONCÉ : L'alert est l'expression canonique de l'intention « comprendre un état » : il informe sur un état et ne propose jamais un geste.

> **Pourquoi** : les six intentions posent que « le rôle précède le style » — deux rôles différents ne se rendent jamais indiscernables. Nommer l'intention porteuse ici verrouille l'alert du côté « recevoir un retour » (avec badge et message explicite), à distance du bouton (« Agir ») et du lien (« Naviguer ») : c'est ce qui interdit qu'il emprunte leurs affordances (cf. § États et comportement, loi d'affordance n°3).

## Quand l'utiliser / ne pas l'utiliser

RÈGLE [ALERT-R13] : utiliser pour une information contextuelle qui doit être vue sans être cherchée : condition affectant la page (maintenance à venir, données partielles), conséquence d'un état (abonnement expirant), résumé d'erreurs de formulaire, avertissement avant une zone risquée.
STATUT : propriété universelle
SOURCE : S1, S3, S6, S25
ÉNONCÉ : Un alert sert à porter une information contextuelle que l'utilisateur doit voir sans avoir à la chercher.

RÈGLE [ALERT-R14] : ne pas utiliser pour le feedback immédiat d'une action qui vient de réussir ("Enregistré ✓") — c'est le territoire du toast : message réactif, à vie courte, qui n'a pas besoin d'occuper le flux.
STATUT : parti pris d'identité
SOURCE : S1, S2, S6
ÉNONCÉ : Le retour immédiat d'une action qui vient de réussir est porté par un toast plutôt que par un alert.

RÈGLE [ALERT-R15] : ne pas utiliser pour une décision qui doit bloquer l'utilisateur — c'est la modale.
STATUT : propriété universelle
SOURCE : S5, S16, S18
ÉNONCÉ : Une décision qui doit bloquer l'utilisateur est portée par un dialogue d'alerte, jamais par un alert.
MESURE : aucun alert ne bloque l'interaction avec le reste de la page

RÈGLE [ALERT-R16] : ne pas utiliser pour du contenu promotionnel ou d'upsell.
STATUT : propriété universelle
SOURCE : S3, S27
ÉNONCÉ : Un alert ne porte jamais de contenu promotionnel.

> **Pourquoi** : Polaris le dit explicitement : le banner porte de l'information nécessaire, le marketing a d'autres véhicules.

RÈGLE [ALERT-R17] : l'échelle d'interruption (le critère qui tranche) : **alert < toast < modale**. L'alert occupe l'espace sans interrompre le geste ; le toast interrompt l'attention quelques secondes ; la modale interrompt tout. Le niveau se choisit sur l'urgence *réelle* de la décision demandée à l'utilisateur, jamais sur l'envie de visibilité de l'émetteur.
STATUT : propriété universelle
SOURCE : S5, S6, S18
ÉNONCÉ : Le degré d'interruption se choisit sur l'urgence réelle du message selon l'échelle croissante alert, toast, modale.

> **Pourquoi** : Atlassian réserve même le banner système aux "critical system-level messaging" seulement. Monter d'un cran sans nécessité use la vigilance ; c'est la règle de friction du bouton, appliquée à l'attention.

RÈGLE [ALERT-R18] : cas limite fréquent — l'erreur qui concerne *un seul champ* : message inline de l'input (INPUT-UX.md), pas un alert. L'alert entre en scène quand l'information dépasse l'élément : plusieurs erreurs (résumé), une section entière, la page.
STATUT : propriété universelle
SOURCE : S3, S25, S26
ÉNONCÉ : Une erreur portant sur un seul champ est rendue par le message inline de ce champ ; l'alert n'intervient que lorsque l'information dépasse l'élément.
MESURE : aucun alert n'est émis pour une erreur portant sur un unique champ

## Tone (l'axe sémantique — natif ici)

RÈGLE [ALERT-R19] : **l'axe de gravité info / success / warning / danger est une projection, sur ce composant, de l'axe état-émotionnel de `VOICE-UX.md` (§ « Le ton suit l'utilisateur ») — pas un axe concurrent.** Voice fait varier le *ton* selon l'état de l'utilisateur (routine, erreur de l'utilisateur, erreur système / panne, succès, attente) ; l'alert fige ces états en quatre tones nommés et colorés qui les incarnent dans une surface. Le wording de chaque tone ci-dessous suit donc les prescriptions de Voice : c'est le même axe, vu depuis le conteneur qui le porte, pas une seconde taxonomie à réconcilier.
STATUT : parti pris d'identité
SOURCE : S13
ÉNONCÉ : Les quatre tones de l'alert sont la projection sur ce composant de l'axe état-émotionnel de la voix : le ton du texte se déduit du tone du conteneur.

> **Pourquoi** : sans ce rattachement, un lecteur pourrait croire que la gravité de l'alert et le ton de la voix sont deux réglages indépendants — et écrire un danger au ton badin ou un info alarmiste. En nommant la projection, on rend le ton du texte *déductible* du tone du conteneur.

### Info

RÈGLE [ALERT-R20] : le degré zéro — informer sans alarmer. État du système, précision utile, nouveauté factuelle ("Les exports sont désormais au format CSV").
STATUT : parti pris d'identité
SOURCE : S3, S13
ÉNONCÉ : Le tone info informe sans alarmer : état du système, précision utile, nouveauté factuelle.

RÈGLE [ALERT-R21] : c'est le seul tone qui se justifie pour un contenu purement proactif sans risque associé.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Seul le tone info se justifie pour un contenu purement proactif sans risque associé.

RÈGLE [ALERT-R22] : si l'information n'a même pas besoin d'être *remarquée*, elle n'a pas besoin d'un alert — du texte courant suffit.
STATUT : propriété universelle
SOURCE : S2, S25, S27
ÉNONCÉ : Une information qui n'a pas besoin d'être remarquée est intégrée au contenu courant plutôt que placée dans un alert.

> **Erreur fréquente** : l'info-poubelle — utiliser l'alert info comme emplacement d'annonces générales répétées. Chaque alert inutile entraîne l'utilisateur à ignorer les suivants, y compris les danger.

### Success

RÈGLE [ALERT-R23] : confirmer durablement qu'un état positif est acquis — pas féliciter pour un clic. Le success en alert se justifie quand la confirmation doit *rester consultable* (paiement validé en haut du récapitulatif, migration terminée avec bilan).
STATUT : parti pris d'identité
SOURCE : S2, S3
ÉNONCÉ : Le tone success s'emploie pour confirmer durablement un état acquis dont la confirmation doit rester consultable.

RÈGLE [ALERT-R24] : un success de simple feedback d'action appartient au toast, pas à l'alert.
STATUT : parti pris d'identité
SOURCE : S1, S2
ÉNONCÉ : Un succès qui n'est qu'un retour d'action relève du toast et non de l'alert.

> **Pourquoi** : Carbon va jusqu'à exclure success (et error réactif) de son alert permanent : ce qui charge avec la page est proactif, un succès est réactif par nature — d'où la règle de combinaison plus bas (permanent + success : à peu près jamais justifié).
> **Erreur fréquente** : le success qui ne part jamais — une confirmation vieille de dix minutes encore à l'écran devient du bruit, puis de la méfiance ("est-ce que ça date de maintenant ?").

### Warning

RÈGLE [ALERT-R25] : signaler une condition qui mérite attention avant d'agir — sans qu'aucune erreur ne soit encore commise. Quota bientôt atteint, fonctionnalité dépréciée, saisie acceptée mais risquée.
STATUT : parti pris d'identité
SOURCE : S3
ÉNONCÉ : Le tone warning signale une condition qui mérite attention avant d'agir, sans qu'aucune erreur ne soit encore commise.

RÈGLE [ALERT-R26] : un warning doit dire *quoi faire* ou *quoi surveiller*, pas seulement que "quelque chose" mérite attention.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Un warning énonce ce qu'il faut faire ou surveiller, et pas seulement qu'une attention est requise.

> **Pourquoi** : un avertissement sans action possible est de l'anxiété gratuite. Transposition directe du warning de l'input ("techniquement accepté mais mérite l'attention"), élargie de la valeur d'un champ à l'état d'un contexte.
> **Erreur fréquente** : utiliser warning comme "danger poli" pour adoucir une vraie erreur — si la condition est déjà bloquante ou destructrice, c'est un danger ; l'adoucir retarde la correction.

### Danger

RÈGLE [ALERT-R27] : signaler qu'une condition grave est *déjà* vraie — erreur bloquante, perte en cours, échéance dépassée. Couvre les deux registres : l'erreur-feedback (résumé d'erreurs de formulaire) et l'état critique persistant (paiement refusé, service coupé).
STATUT : parti pris d'identité
SOURCE : S3
ÉNONCÉ : Le tone danger signale qu'une condition grave est déjà vraie, erreur constatée ou état critique persistant.

RÈGLE [ALERT-R28] : règle de rareté — même logique que le destructive du bouton : le danger est un signal d'alarme qui ne garde sa valeur que rare. Plusieurs danger simultanés sur une page signalent un problème d'architecture de l'information, pas une page très en danger.
STATUT : parti pris d'identité
SOURCE : S10, S27
ÉNONCÉ : Le tone danger reste rare : plusieurs alerts danger simultanés signalent un défaut d'architecture de l'information.
MESURE : au plus un alert de tone danger visible simultanément par page

RÈGLE [ALERT-R29] : règle de complétude — un danger dit toujours quoi, pourquoi, et comment sortir : le gabarit du message d'erreur de l'input (INPUT-UX.md, section wording) s'applique au paragraphe entier.
STATUT : propriété universelle
SOURCE : S9, S19, S20
ÉNONCÉ : Un alert danger énonce ce qui se passe, pourquoi, et comment en sortir.
MESURE : toute erreur détectée est décrite en texte et assortie d'une suggestion de correction quand celle-ci est connue

RÈGLE [ALERT-R30] : **règle cardinale de wording héritée de `VOICE-UX.md` — ne jamais blâmer l'utilisateur.** Un danger décrit l'écart et la sortie (« Le paiement n'a pas abouti », « Le format attendu est JJ/MM/AAAA ») ; il ne qualifie jamais l'utilisateur (« saisie invalide », « vous n'avez pas rempli… »). Quand la faute est côté système, le produit la prend à son compte (« Nous n'avons pas pu enregistrer »), il n'accuse pas l'utilisateur d'un bug.
STATUT : parti pris d'identité
SOURCE : S13
ÉNONCÉ : Le message d'un alert décrit l'écart et la sortie sans jamais qualifier ni accuser l'utilisateur.

> **Pourquoi** : Voice pose « ne jamais blâmer » comme *règle cardinale du ton*, non négociable (Peak-End : le message d'erreur est le pic dont l'utilisateur se souvient). Le danger de l'alert est le lieu où ce risque est le plus aigu — c'est là que le langage Voice cesse d'être un conseil de style pour devenir une contrainte du composant.

> **Erreur fréquente** : le danger décoratif sur une condition simplement inhabituelle — banalise le signal exactement là où il doit rester intact.

## Persistance (l'axe inédit)

### Permanent

RÈGLE [ALERT-R31] : le message vit aussi longtemps que sa condition — l'utilisateur ne peut pas le fermer, seul un changement d'état le fait disparaître. Réservé aux informations dont l'ignorance a un coût réel : erreurs à corriger, conditions critiques actives.
STATUT : parti pris d'identité
SOURCE : S2, S3
ÉNONCÉ : Un alert permanent vit aussi longtemps que sa condition et ne peut pas être fermé par l'utilisateur.
MESURE : un alert permanent n'expose aucun contrôle de fermeture

RÈGLE [ALERT-R32] : permanent = proactif ou bloquant. Ce qui charge avec la page (Carbon : "always present on the screen and load with contents") ou ce qui doit être résolu (résumé d'erreurs). Jamais pour du confort d'émetteur.
STATUT : parti pris d'identité
SOURCE : S2
ÉNONCÉ : La persistance permanente est réservée aux messages proactifs chargés avec la page et aux conditions qui doivent être résolues.

RÈGLE [ALERT-R33] : résolution silencieuse — un alert permanent dont la condition cesse d'être vraie doit disparaître, mais pas *silencieusement* pour tout le monde : si la résolution résulte d'une action de l'utilisateur (erreurs corrigées, soumission réussie), la confirmation doit être annoncée par le mécanisme qui prend le relais (message de succès, changement d'état focalisé).
STATUT : propriété universelle
SOURCE : S15, S17
ÉNONCÉ : La résolution d'une condition consécutive à une action de l'utilisateur est annoncée par un message qui prend le relais, et non par la seule disparition de l'alert.
MESURE : la disparition d'un alert consécutive à une action utilisateur s'accompagne d'un message porté par une région live

> **Pourquoi** : visuellement, sa disparition est le signal de résolution ; pour un lecteur d'écran, un élément qui s'évapore n'annonce rien — un alert qui disparaît sans successeur laisse l'utilisateur non-voyant dans l'incertitude. (Origine de cette règle — 4e occurrence du biais "état transitoire" : cf. DECISIONS.md.)

RÈGLE [ALERT-R34] : cette résolution est l'application, sur l'alert, du principe de `VOICE-UX.md` « **le mot est le canal de dernier recours** » : la disparition visuelle et le changement de couleur sont des canaux qui *s'évaporent* (rien pour l'AT, rien sous forced-colors), seul un **mot** — message de succès, changement d'état focalisé — porte la résolution de façon inconditionnelle. Le relais textuel n'est pas une politesse, c'est le seul canal qui ne tombe jamais.
STATUT : parti pris d'identité
SOURCE : S13, S21
ÉNONCÉ : Un mot porte toujours l'information de résolution : la disparition visuelle et le changement de couleur ne sont jamais les seuls canaux.

### Dismissible

RÈGLE [ALERT-R35] : l'utilisateur peut clore le message — il en a pris connaissance, il reprend son espace. Le défaut raisonnable pour tout ce qui n'est ni bloquant ni critique (Polaris : "be dismissible unless they contain critical information or an important step").
STATUT : parti pris d'identité
SOURCE : S3
ÉNONCÉ : Un alert qui n'est ni bloquant ni critique est fermable par l'utilisateur.

RÈGLE [ALERT-R36] : règle de fermeture — la croix de fermeture est une cible à part entière (taille tactile, focusable, libellée "Fermer" pour le lecteur d'écran) — pas un ornement de coin.
STATUT : propriété universelle
SOURCE : S3, S28
ÉNONCÉ : Le contrôle de fermeture d'un alert est un bouton focusable, doté d'un nom accessible et d'une cible de taille suffisante.
MESURE : le bouton de fermeture porte un nom accessible et mesure au moins 24×24 px CSS

RÈGLE [ALERT-R37] : mémoire de fermeture — la fermeture doit être mémorisée au moins pour la session, et durablement pour les annonces ponctuelles.
STATUT : parti pris d'identité
SOURCE : S10
ÉNONCÉ : La fermeture d'un alert est mémorisée au moins pour la durée de la session, et durablement pour les annonces ponctuelles.
MESURE : un alert fermé ne réapparaît pas au chargement suivant de la même page dans la même session

RÈGLE [ALERT-R38] : exception explicite — si la *condition* redevient vraie ou s'aggrave (le quota warning fermé hier atteint 100 %), la réapparition est légitime — c'est un nouveau message, pas le retour de l'ancien.
STATUT : parti pris d'identité
SOURCE : S10
ÉNONCÉ : Un alert fermé peut réapparaître si sa condition redevient vraie ou s'aggrave : il s'agit alors d'un nouveau message.

> **Pourquoi** : fermer un alert est une décision de l'utilisateur — la respecter a une portée. Un alert dismissible re-affiché à chaque chargement de page n'est pas dismissible, il est harcelant.

### Combinaisons tone × persistance

RÈGLE [ALERT-R39] : table ci-dessous
STATUT : parti pris d'identité
SOURCE : S2, S3
ÉNONCÉ : Toutes les combinaisons de tone et de persistance sont possibles, mais info-dismissible et danger-permanent sont les régimes nominaux et les autres demandent une justification.

| Tone | Permanent | Dismissible |
|---|---|---|
| Info | Rare — seulement si l'info conditionne l'usage de la page (maintenance imminente) | **Le cas nominal de l'info** — annonce prise en compte, on ferme |
| Success | À peu près jamais justifié — un succès est réactif, il n'a pas vocation à occuper le flux sans fin (cf. Carbon, qui l'exclut de l'alert) | Confirmation durable mais congédiable — le bon défaut du success |
| Warning | Condition active à surveiller (quota, dépréciation à échéance) | Avertissement pris en compte — légitime si l'utilisateur peut réellement assumer le risque |
| Danger | **Le cas nominal du danger** — tant que la condition est vraie, le message reste (Polaris : jamais dismissible si critique) | Seulement si la gravité est passée ou assumable — un danger qu'on peut fermer sans conséquence était probablement un warning |

> **Ce que cette table révèle** : les deux axes sont indépendants dans la mécanique mais pas dans la légitimité — les diagonales info-dismissible et danger-permanent sont les régimes naturels, les cases inverses demandent une justification. Même structure que la table style × tone du bouton : toutes les combinaisons existent, toutes ne se valent pas.

## Composition (les slots — pas des axes)

RÈGLE [ALERT-R40] : ordre canonique : **icône → titre → corps → actions**, plus la **croix de fermeture** (dismissible uniquement) en coin opposé au sens de lecture.
STATUT : parti pris d'identité
SOURCE : S1, S3
ÉNONCÉ : L'ordre de composition d'un alert est icône, titre, corps, actions, la croix de fermeture venant au coin opposé au sens de lecture.
MESURE : l'ordre du DOM place le contenu du message avant le contrôle de fermeture

### Icône

RÈGLE [ALERT-R41] : porter le tone *autrement que par la couleur*. Une icône par tone, constante dans tout le produit.
STATUT : propriété universelle
SOURCE : S3, S21
ÉNONCÉ : Chaque tone est porté par une icône propre, constante dans tout le produit, en plus de sa couleur.
MESURE : aucune information de gravité portée par la couleur seule

RÈGLE [ALERT-R42] : l'icône n'est pas décorative, elle est le canal redondant du sens — elle ne se retire pas pour alléger. (WCAG 1.4.1 — l'information ne repose jamais sur la couleur seule ; et **loi d'affordance n°5** d'`INTERACTION-UX.md`, « la couleur renforce, elle ne crée pas seule le sens » — la forme de l'icône, sa silhouette et le mot fournissent le second canal que la couleur seule ne garantit pas.)
STATUT : propriété universelle
SOURCE : S11, S21
ÉNONCÉ : L'icône de tone est un canal d'information redondant et ne peut pas être retirée pour alléger le rendu.
MESURE : tout alert affiche l'icône correspondant à son tone

RÈGLE [ALERT-R43] : règle de silhouette — les quatre tones ont des **formes** d'icône distinctes, pas seulement des couleurs distinctes (cercle / cercle-coche / triangle / octogone — silhouettes fixées dans ALERT-UI.md).
STATUT : propriété universelle
SOURCE : S1, S3, S21
ÉNONCÉ : Les tones se distinguent par des formes d'icône différentes, et pas seulement par des couleurs différentes.
MESURE : les silhouettes d'icône des quatre tones sont deux à deux distinctes

> **Pourquoi** : la redondance doit tenir même quand la couleur ne sépare pas les tones entre eux — warning et danger sont proches pour une vision rouge-vert déficiente. C'est le pendant, côté alert, de la règle daltonisme de l'input (erreur signalée par plus que le rouge) et de la carte (sélection signalée par plus que la bordure).

CONFIANCE : établi — WCAG 2.1, critère 1.4.1, standard d'accessibilité.

### Titre

RÈGLE [ALERT-R44] : énoncer le message en une ligne — c'est lui que l'œil et le lecteur d'écran attrapent. Un utilisateur qui ne lit que le titre doit repartir avec l'essentiel.
STATUT : parti pris d'identité
SOURCE : S3
ÉNONCÉ : Le titre d'un alert énonce le message en une ligne et porte le contenu, pas la catégorie.

> **Erreur fréquente** : le titre-catégorie ("Erreur", "Attention") qui ne dit rien — le tone porte déjà la catégorie ; le titre porte le *contenu* ("Le paiement n'a pas abouti").

### Corps

RÈGLE [ALERT-R45] : le pourquoi et le comment-corriger — mêmes exigences de wording que le message d'erreur de l'input : diagnostic fait pour l'utilisateur, pas transféré à l'utilisateur. Optionnel si le titre suffit.
STATUT : parti pris d'identité
SOURCE : S9, S20
ÉNONCÉ : Le corps d'un alert énonce le pourquoi et le moyen de corriger ; il est facultatif quand le titre suffit.

RÈGLE [ALERT-R46] : règle de longueur — 1-2 phrases (Polaris). Au-delà, l'information relève d'une page, pas d'un alert — lier plutôt qu'entasser.
STATUT : parti pris d'identité
SOURCE : S3
ÉNONCÉ : Le corps d'un alert tient en une à deux phrases ; au-delà, l'information est liée plutôt qu'entassée.
MESURE : le corps d'un alert ne dépasse pas deux phrases

### Zone d'actions

RÈGLE [ALERT-R47] : offrir la sortie — corriger, réessayer, en savoir plus. **Une seule action mise en avant** (Polaris), une seconde tolérée en lien discret.
STATUT : parti pris d'identité
SOURCE : S3
ÉNONCÉ : Un alert met en avant une seule action ; une seconde n'est tolérée que sous forme de lien discret.
MESURE : au plus un bouton d'action mis en avant par alert

RÈGLE [ALERT-R48] : le choix de style/tone des boutons internes suit BUTTON-UX.md ; l'alert impose le nombre, comme la carte.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Le style et le tone des boutons contenus dans un alert relèvent de BUTTON-UX ; l'alert n'impose que leur nombre.

RÈGLE [ALERT-R49] : règle de cohérence de tone — l'action d'un alert danger n'est pas nécessairement un bouton destructive : le tone de l'alert décrit la condition ; le tone du bouton décrit l'action.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Le tone d'un alert décrit la condition et ne détermine pas le tone du bouton qu'il contient, lequel décrit l'action.

> **Pourquoi** : "Corriger" répare, ne détruit pas. Les confondre remet du rouge partout.

### Croix de fermeture

RÈGLE [ALERT-R50] : cf. persistance/dismissible. Jamais présente sur un permanent.
STATUT : parti pris d'identité
SOURCE : S3
ÉNONCÉ : Un alert permanent ne présente jamais de croix de fermeture.
MESURE : aucun contrôle de fermeture sur un alert de persistance permanente

> **Pourquoi** : une croix qui ne ferme pas, ou qui ferme ce qui va revenir, est une affordance mensongère (même famille que la carte statique stylée cliquable).

## Empilement et budget d'attention

Plusieurs conditions simultanément vraies produisent plusieurs alerts candidats — le cas n'est pas exceptionnel, il est l'état normal d'un produit mûr.

RÈGLE [ALERT-R51] : plafond pratique — **un alert par niveau de conteneur** (un pour la page, un par section concernée). Au-delà, agréger : trois warnings de quota deviennent un seul alert listant les trois.
STATUT : parti pris d'identité
SOURCE : S10
ÉNONCÉ : Un seul alert est affiché par niveau de conteneur ; au-delà, les messages sont agrégés en un seul.
MESURE : au plus un alert par niveau de conteneur

RÈGLE [ALERT-R52] : ordre en cas de cohabitation inévitable — gravité décroissante (danger avant warning avant info) — jamais l'ordre d'arrivée.
STATUT : parti pris d'identité
SOURCE : S10
ÉNONCÉ : Lorsque plusieurs alerts cohabitent, ils sont ordonnés par gravité décroissante et jamais par ordre d'arrivée.
MESURE : l'ordre d'affichage suit la gravité décroissante

RÈGLE [ALERT-R53] : la version agrégée est toujours préférable à la pile.
STATUT : parti pris d'identité
SOURCE : S2, S10, S26
ÉNONCÉ : Un alert unique agrégeant plusieurs conditions est préféré à une pile d'alerts.

> **Pourquoi** : Carbon : "avoid overloading a single page with multipl'alerts". Le résumé d'erreurs de FORM-UX.md est précisément ce mouvement (N erreurs → 1 alert).

CONFIANCE : non formalisé — raisonnement de mécanisme + convergence des "sparingly" (Carbon, Polaris), pas de règle chiffrée publiée trouvée.

## États et comportement

RÈGLE [ALERT-R54] : apparition au chargement (proactif) — l'alert est du contenu comme un autre : pas d'animation d'entrée nécessaire, pas d'annonce spéciale ; le lecteur d'écran le rencontre à sa place dans le flux, avant le contenu qu'il conditionne.
STATUT : propriété universelle
SOURCE : S15, S18
ÉNONCÉ : Un alert présent au chargement de la page est du contenu ordinaire : il ne porte pas de région live et ne fait pas l'objet d'une annonce spéciale.
MESURE : aucun rôle live sur un alert présent dans le DOM au chargement initial

RÈGLE [ALERT-R55] : apparition dynamique (réactif) — un alert injecté après une action doit être *annoncé* : `role="alert"` pour danger/warning réactifs, `role="status"` pour info/success (Polaris fait exactement cette distinction).
STATUT : propriété universelle
SOURCE : S4, S15, S16, S17
ÉNONCÉ : Un alert inséré après une action est annoncé aux technologies d'assistance par une région live, role=alert pour les messages critiques et role=status pour les messages advisoires.
MESURE : tout alert injecté dynamiquement porte role=alert ou role=status

> **Pourquoi** : c'est le cas SPA déjà documenté par FORM-UX.md — une mise à jour d'état côté client n'annonce rien gratuitement.

RÈGLE [ALERT-R56] : l'insertion ne doit pas provoquer de saut de mise en page sous le point de lecture — insérer au-dessus du viewport courant sans compensation vole la position de lecture.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : L'insertion d'un alert ne doit pas déplacer le contenu situé sous le point de lecture courant.
MESURE : aucun décalage de mise en page du contenu déjà visible lors de l'insertion d'un alert

RÈGLE [ALERT-R57] : **chorégraphie d'apparition / disparition — rattachée nommément à `MOTION-UX.md`.** L'apparition d'un alert *réactif* se joue **en opacité seule** (fondu), jamais en slide qui pousserait le contenu : c'est l'application directe de la règle « **le contenu ne se déplace jamais sans action de l'utilisateur** » de `MOTION-UX.md` — un alert injecté qui glisse déplacerait la cible sous le curseur d'un lecteur qui n'a rien demandé. La **sortie prend le cran inférieur de l'entrée** (plus brève, même registre, `motion.fast` vs `motion.base` — cf. ALERT-UI.md), et l'annonce au lecteur d'écran ne dépend jamais du mouvement.
STATUT : parti pris d'identité
SOURCE : S12
ÉNONCÉ : L'apparition d'un alert réactif se joue en opacité seule, sans translation, et sa disparition prend le cran de durée inférieur à son apparition.
MESURE : aucune propriété de translation dans l'animation d'apparition ou de disparition

RÈGLE [ALERT-R58] : **proactif = aucune animation.** Un alert chargé avec la page ne s'anime pas — « **rien n'anime au chargement initial** » (`MOTION-UX.md`) : le contenu proactif est du contenu comme un autre, l'entrée animée est réservée au réactif (conséquence d'une action). C'est la formulation d'origine de ce fichier (« pas d'animation d'entrée nécessaire ») que `MOTION-UX.md` a généralisée à tout le système, puis nous re-cite ici sous son nom.
STATUT : parti pris d'identité
SOURCE : S12
ÉNONCÉ : Un alert chargé avec la page ne s'anime pas.
MESURE : aucune animation d'entrée sur un alert présent au chargement initial

RÈGLE [ALERT-R59] : **contrat `prefers-reduced-motion` — POSITION explicite, pas un oubli.** L'apparition en opacité est **nativement conforme** au contrat reduced-motion de `MOTION-UX.md` (« réduire ≠ supprimer : les changements d'opacité et de couleur peuvent rester, seul le mouvement *spatial* se désactive »). Comme l'alert n'a **aucune translation à supprimer**, sa chorégraphie ne se dégrade pas sous `prefers-reduced-motion: reduce` — il n'y a rien à couper, le fondu demeure. Ce n'est pas un point resté ouvert (contrairement au « reduced motion » historiquement signalé en fin de fichier) : c'est une conformité par construction, posée ici comme position tenue.
STATUT : parti pris d'identité
SOURCE : S12
ÉNONCÉ : L'apparition en opacité d'un alert est conservée telle quelle sous mouvement réduit, faute de mouvement spatial à supprimer.
MESURE : aucune translation à désactiver sous prefers-reduced-motion pour ce composant

RÈGLE [ALERT-R60] : disparition — cf. "Résolution silencieuse" (permanent) et "Mémoire de fermeture" (dismissible).
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : La disparition d'un alert relève de la règle de résolution pour le permanent et de la mémoire de fermeture pour le dismissible.

RÈGLE [ALERT-R61] : l'alert n'a pas d'état hover/focus propre — il n'est pas interactif en surface ; seuls ses enfants (actions, croix, liens d'ancre) le sont.
STATUT : propriété universelle
SOURCE : S11, S16, S18
ÉNONCÉ : Le conteneur d'un alert n'est ni focusable ni cliquable et ne porte aucun état de survol ou de focus ; seuls ses enfants interactifs en portent.
MESURE : le conteneur alert n'est pas focusable et ne porte pas de gestionnaire de clic

> **Pourquoi** : un alert entièrement cliquable cumulerait les problèmes de la carte cliquable sans en avoir la légitimité (la cible naturelle est l'action, pas le message). C'est l'application directe de la **loi d'affordance n°3** d'`INTERACTION-UX.md` — « **une surface organise sans promettre un clic** » : l'alert est une surface qui porte du sens, pas un contrôle ; une surface statique ne copie jamais l'apparence d'un contrôle, ni ses états hover/focus. L'affordance de clic est réservée à ses enfants (actions, croix, liens d'ancre), jamais au conteneur.

CONFIANCE : établi — `role="alert"` vs `role="status"` : Polaris, convergent avec WCAG/ARIA.

RÈGLE [ALERT-R62] : **un éventuel signal sonore d'alerte reste strictement redondant** — si un canal sonore est un jour ajouté (bip pour une condition critique), il *double* le message, il ne le porte jamais seul : texte + icône + couleur portent déjà l'information en entier, un utilisateur sourd, en environnement silencieux ou au son coupé ne perd rien (WCAG 1.4.1 / 1.3.3, principe des canaux ; 1.4.2 pour le contrôle du son). Le son est un rappel d'attention, pas un porteur d'information.
STATUT : propriété universelle
SOURCE : S21, S22
ÉNONCÉ : Un signal sonore d'alerte double toujours un message textuel et visuel et ne porte jamais seul l'information.
MESURE : aucune information portée par le son seul

> **Pourquoi** : l'inventaire transversal a marqué le canal sonore « partiel » — l'alert garantit déjà texte + icône + couleur, mais aucune règle ne cadrait un futur son. Ce contrat est posé en avance, sur le modèle de MOTION (jamais l'information par le mouvement seul) : le jour où le produit sonorise une alerte, le principe est déjà écrit.

CONFIANCE : établi (principe des canaux, WCAG 1.4.1) ; aucun consommateur sonore actuel — contrat en avance.

## Instrument E-motion (statuer, même en négatif)

RÈGLE [ALERT-R63] : **l'alert ne porte aucun instrument expressif — position tranchée, pas silence.** Comme le toast statue sur son instrument, l'alert statue ici : c'est un composant **productif** de bout en bout, jamais un moment E-motion. Aucun des quatre instruments d'`EMOTION-UX.md` (mouvement expressif, voix chaleureuse, couleur de fête, illustration / forme) ne s'active sur un alert — sa chorégraphie reste en opacité productive (cf. § États et comportement), son wording dans le registre productif de `VOICE-UX.md`.
STATUT : parti pris d'identité
SOURCE : S14
ÉNONCÉ : L'alert n'active aucun instrument expressif : sa chorégraphie et son wording restent dans le registre productif.

RÈGLE [ALERT-R64] : **« un événement, un porteur » (arbitrage utilisateur 2026-07-21).** Le moment catalogué « **sortie d'une erreur / récupération** » d'`EMOTION-UX.md` — qui recoupe la « résolution silencieuse » d'un danger permanent enfin résolu (§ Persistance / Permanent) — ne s'incarne **pas dans l'alert danger elle-même** : l'alert reste le porteur *productif* du problème tant que la condition dure. Le soulagement, lui, s'incarne dans le **success / toast de relais** qui confirme la résolution **après coup** — exactement la distinction que `TOAST-UX.md` fait déjà « entre le problème et son soulagement ». Le porteur du problème et le porteur de la récupération sont deux composants distincts, jamais la même surface.
STATUT : parti pris d'identité
SOURCE : S14
ÉNONCÉ : Le porteur d'un problème et le porteur de sa résolution sont deux composants distincts : l'alert porte le problème, un message de succès ou un toast porte la récupération.

> **Pourquoi** : incarner la fête de la récupération dans l'alert danger qui porte *encore* le problème mélangerait deux battements émotionnels opposés sur une seule surface — l'alert doit rester lisible comme signal d'alarme tant que sa condition est vraie. Le budget de rareté d'E-motion (« un moment qui se répète cesse d'être expressif ») l'interdit d'autant plus sur un composant permanent par nature. Un événement (le problème), un porteur (l'alert) ; un autre événement (sa résolution), un autre porteur (le relais).

RÈGLE [ALERT-R65] : **l'exception chaleureuse ne touche jamais danger ni warning** — ni côté `VOICE-UX.md` (§ Exception E-motion : « l'exception ne s'étend jamais à une erreur… ni à une action destructive »), ni côté `EMOTION-UX.md`. Sur un alert danger / warning, le registre reste strictement productif : pas d'émoji, pas de « Oups », pas de « ! ». C'est la même frontière que `TOAST-UX.md` trace pour son instrument illustration — la chaleur est réservée aux moments positifs et rares, l'alarme n'en est jamais un.
STATUT : parti pris d'identité
SOURCE : S13, S14
ÉNONCÉ : Aucune exception de ton chaleureux ne s'applique aux alerts de tone danger ou warning.
MESURE : aucun émoji ni interjection dans un alert de tone danger ou warning

CONFIANCE : établi (position tranchée par arbitrage utilisateur 2026-07-21 ; cohérente avec le catalogue fermé et le budget de rareté d'`EMOTION-UX.md` et l'Exception E-motion de `VOICE-UX.md`).

## Contextes d'intégration

### Pleine page (bandeau de page)

RÈGLE [ALERT-R66] : en tête du contenu, sous le header, pleine largeur du contenu (Polaris) — avant ce qu'il conditionne, jamais après.
STATUT : propriété universelle
SOURCE : S3, S25, S26
ÉNONCÉ : Un alert de portée page est placé en tête du contenu, sur toute sa largeur, avant ce qu'il conditionne.
MESURE : l'alert de page précède dans le DOM le contenu qu'il conditionne

RÈGLE [ALERT-R67] : c'est la position au plus fort budget d'attention : réservée aux conditions qui affectent la page entière.
STATUT : parti pris d'identité
SOURCE : S3, S6
ÉNONCÉ : La position de tête de page est réservée aux conditions qui affectent la page entière.

### Section, carte, modale

RÈGLE [ALERT-R68] : sous le titre de la section concernée, largeur de la section (Polaris : "section-level") — l'alert hérite du conteneur qu'il annote, comme le bouton hérite de la grille de son contenu.
STATUT : parti pris d'identité
SOURCE : S3, S6
ÉNONCÉ : Un alert de portée section se place sous le titre de la section concernée et en épouse la largeur.

RÈGLE [ALERT-R69] : dans une modale — au-dessus des champs/boutons concernés ; jamais de alert pleine page *dans* une modale.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Dans une modale, l'alert se place au-dessus des champs ou boutons concernés et n'y prend jamais la portée d'un alert de page.

### Au-dessus d'un élément précis

RÈGLE [ALERT-R70] : le placement contextuel de Carbon ("above buttons/inputs when relevant") — pour une condition qui ne concerne qu'un geste précis ("l'export est indisponible pendant la maintenance", au-dessus du bouton d'export).
STATUT : parti pris d'identité
SOURCE : S1
ÉNONCÉ : Un alert peut se placer immédiatement au-dessus d'un contrôle précis lorsque la condition ne concerne que ce geste.

RÈGLE [ALERT-R71] : frontière avec le message inline de l'input — si la condition porte sur la *valeur* d'un champ, c'est INPUT-UX.md ; si elle porte sur la *disponibilité ou le contexte* du geste, c'est un alert.
STATUT : note de méthode
SOURCE : S25
ÉNONCÉ : Une condition portant sur la valeur d'un champ relève d'INPUT-UX ; une condition portant sur la disponibilité ou le contexte d'un geste relève de l'alert.

### En tête de formulaire (résumé d'erreurs)

RÈGLE [ALERT-R72] : le cas est entièrement orchestré par FORM-UX.md (cf. recoupement) — conteneur d'ici, chorégraphie de là-bas.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Le résumé d'erreurs en tête de formulaire emprunte son conteneur à l'alert et son orchestration à FORM-UX.

## Risque

RÈGLE [ALERT-R73] : table ci-dessous
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Les risques principaux de l'alert sont recensés et hiérarchisés par sévérité dans la table de risque du fichier.

| Cas | Risque principal | Sévérité |
|---|---|---|
| Alert réactif injecté sans annonce (SPA) | Utilisateur lecteur d'écran jamais informé d'une erreur pourtant affichée | Critique |
| Tone porté par la couleur seule (pas d'icône) | Exclusion daltonisme — un danger et un success indistinguables | Élevée |
| Signal sonore porteur d'information sans équivalent texte/visuel | Exclusion des utilisateurs sourds ou au son coupé (WCAG 1.4.1) | Élevée |
| Danger dismissible sur condition active | Condition critique masquée puis oubliée, perte de données ou d'échéance | Élevée |
| Inflation de alerts (info-poubelle, piles) | Cécité d'attention apprise — les vrais danger ignorés avec le reste | Élevée (différée — invisible dans les tests ponctuels) |
| Fermeture non mémorisée (réapparition à chaque page) | Harcèlement, apprentissage du réflexe "fermer sans lire" | Moyenne |
| Success permanent / confirmation qui ne part jamais | Méfiance sur la fraîcheur de tout ce que la page affiche | Moyenne |
| Insertion avec saut de mise en page | Perte de position de lecture, clic raté sur l'élément déplacé | Moyenne |
| Wording titre-catégorie sans contenu | Charge de diagnostic transférée à l'utilisateur | Moyenne |

## Règle transversale

RÈGLE [ALERT-R74] : **l'interruption doit être proportionnelle à l'urgence réelle du message, jamais à l'envie de visibilité de l'émetteur.**
STATUT : propriété universelle
SOURCE : S5, S6, S25, S27
ÉNONCÉ : Le degré d'interruption d'un message est proportionnel à l'urgence réelle de ce message, jamais à la visibilité souhaitée par son émetteur.

> **Pourquoi** : c'est la déclinaison pour l'attention du principe posé sur le bouton (la friction suit le risque), l'input (la validation suit le risque d'erreur) et la carte (l'affordance suit la fonction) : ici, ce qui doit suivre la réalité, c'est le *degré d'interruption* — un message qui monte d'un cran sans nécessité (alert→toast→modale, ou info déguisé en warning) dépense un budget d'attention qui manquera au prochain vrai danger.

## Sources et niveau de confiance

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| S1 | 4 variantes de notification (inline persistant / toast auto-fermant ~5s / actionable / alert permanent) | [IBM Carbon — Notification usage](https://carbondesignsystem.com/components/notification/usage/) | Établi — taxonomie explicitement documentée |
| S2 | Alert permanent = proactif, info/warning seulement, jamais success/error réactifs, "used sparingly" | [IBM Carbon — Notification usage](https://carbondesignsystem.com/components/notification/usage/) | Établi — règle explicite du système |
| S3 | 4 tones (info/success/warning/critical), dismissible sauf critique, 1 action principale max, placement page/section/élément | [Shopify Polaris — Banner](https://polaris-react.shopify.com/components/feedback-indicators/banner) | Établi — pattern documenté en détail |
| S4 | `role="alert"` (critique/warning) vs `role="status"` (info/success) | [Shopify Polaris — Banner](https://polaris-react.shopify.com/components/feedback-indicators/banner), convergent avec WCAG/ARIA | Établi |
| S5 | Échelle d'interruption snackbar (basse, auto-dismiss) < banner (moyenne, persiste jusqu'à action) < dialog (haute, bloque) | [Material Design — Banners](https://m2.material.io/components/banners) et [Snackbars](https://m2.material.io/design/components/snackbars.html), lus via source secondaire ([Soliant](https://www.soliantconsulting.com/blog/material-design-filemaker-snackbars-banners/)) car m3.material.io ne sert pas de contenu statique | Établi comme hiérarchie — vérification directe sur m3 non faite, à recouper si enjeu |
| S6 | Banner système réservé au "critical system-level messaging" ; flag pour confirmations à interaction minimale ; section message = portée de section | [Atlassian — Designing messages](https://atlassian.design/foundations/content/designing-messages), [Section message](https://atlassian.design/components/section-message/), [Flag](https://atlassian.design/components/flag/) | Établi — doctrine explicite d'Atlassian |
| S7 | Information jamais portée par la couleur seule (icône par tone) | WCAG 2.1 — 1.4.1 | Établi, standard d'accessibilité |
| S8 | Signal sonore toujours redondant avec le texte/visuel | WCAG 2.1 — 1.4.1 / 1.3.3 (principe des canaux), 1.4.2 (contrôle du son) | Établi, standard d'accessibilité — contrat en avance |
| S9 | Wording quoi/pourquoi/comment-corriger | INPUT-UX.md (Wroblewski, Baymard — déjà sourcé là-bas) | Établi — transposition interne |
| S10 | Mémoire de fermeture, plafond d'empilement par conteneur, budget d'attention | Raisonnement de mécanisme + convergence des "sparingly" (Carbon, Polaris) | Déduction argumentée — pas de règle chiffrée publiée trouvée |
| S11 | Alert = expression canonique de l'intention « Comprendre un état » ; non-interactivité de surface = loi d'affordance n°3 ; redondance icône/couleur = loi n°5 | `INTERACTION-UX.md` (§ Les six intentions ; lois d'affordance n°3 et n°5) | Établi — rattachement interne au langage |
| S12 | Apparition réactive en opacité (jamais de slide), proactif sans animation, sortie au cran inférieur de l'entrée, contrat reduced-motion natif (rien à couper) | `MOTION-UX.md` (« le contenu ne se déplace jamais sans action » ; « rien n'anime au chargement initial » ; reduced-motion « réduire ≠ supprimer ») | Établi — rattachement interne au langage |
| S13 | Tone = projection de l'axe état-émotionnel ; « ne jamais blâmer » (règle cardinale) ; « le mot est le canal de dernier recours » ; Exception E-motion inapplicable à danger/warning | `VOICE-UX.md` (§ Le ton suit l'utilisateur ; § Le mot est le canal d'information fiable ; § Exception E-motion) | Établi — rattachement interne au langage |
| S14 | Alert sans instrument expressif ; « un événement, un porteur » — récupération (« sortie d'erreur ») déléguée au success/toast de relais, pas à l'alert danger | `EMOTION-UX.md` (§ Catalogue des moments mérités, « sortie d'une erreur / récupération ») + arbitrage utilisateur 2026-07-21 | Décision d'identité interne, tranchée par arbitrage |
| S15 | Un message de statut qui apparaît sans recevoir le focus doit être programmatiquement déterminable pour être restitué par les technologies d'assistance ; role="status" pour un succès ou une progression, role="alert" pour une erreur ou un avertissement | [WCAG 2.2 — 4.1.3 Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) | Établi, standard (AA) — norme qui manquait alors que R33, R54 et R55 en dépendent entièrement |
| S16 | role="alert" équivaut à aria-live="assertive" + aria-atomic="true" ; le conteneur doit préexister dans le DOM à l'insertion du texte ; le focus n'a pas à être déplacé ; **le rôle est réservé au contenu textuel et non aux éléments interactifs**, pour lesquels alertdialog est indiqué | [MDN — ARIA alert role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/alert_role) | Établi — **contredit R36 et R47**, qui placent croix et bouton d'action dans un conteneur que R55 fait porter role="alert" |
| S17 | role="status" implique aria-live="polite" et aria-atomic="true" ; il porte l'information advisoire qui ne justifie pas d'interrompre, et l'élément ne doit pas recevoir le focus lors de sa mise à jour | [MDN — ARIA status role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/status_role) | Établi — documentation de référence |
| S18 | Un alert délivre un message important sans interrompre la tâche, ne déplace jamais le focus clavier, ne doit pas disparaître automatiquement, et n'est pas annoncé s'il est présent avant la fin du chargement de la page | [ARIA Authoring Practices Guide — Alert Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/) | Établi — pattern normatif de référence du W3C |
| S19 | Si une erreur de saisie est automatiquement détectée, l'élément en erreur est identifié et l'erreur est décrite à l'utilisateur en texte | [WCAG 2.2 — 3.3.1 Error Identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html) | Établi, standard (A) |
| S20 | Si une erreur de saisie est détectée et que des suggestions de correction sont connues, elles sont fournies à l'utilisateur, sauf si cela compromet la sécurité ou l'objectif du contenu | [WCAG 2.2 — 3.3.3 Error Suggestion](https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion.html) | Établi, standard (AA) |
| S21 | La couleur n'est jamais le seul moyen visuel de transmettre une information, d'indiquer une action, de solliciter une réponse ou de distinguer un élément visuel | [WCAG 2.2 — 1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) | Établi, standard (A) — le fichier citait « WCAG 2.1 — 1.4.1 » sans URL vérifiable |
| S22 | Les instructions ne reposent pas uniquement sur des caractéristiques sensorielles telles que la forme, la couleur, la taille, la position visuelle, l'orientation ou le son | [WCAG 2.2 — 1.3.3 Sensory Characteristics](https://www.w3.org/WAI/WCAG22/Understanding/sensory-characteristics.html) | Établi, standard (A) — mentionne explicitement le son, ce qui fonde R62 |
| S23 | Un son qui démarre automatiquement et dure plus de 3 secondes doit pouvoir être arrêté, mis en pause ou son volume contrôlé indépendamment du système | [WCAG 2.2 — 1.4.2 Audio Control](https://www.w3.org/WAI/WCAG22/Understanding/audio-control.html) | Établi, standard (A) — **seuil de 3 s : ce critère ne couvre pas un bip court**, contrairement à ce que suggérait le fichier |
| S24 | Les rôles alert et status créent des régions live avec aria-live assertive et polite implicites ; alert est réservé à l'information sensible au temps et ne doit pas provoquer de déplacement du focus | [WAI-ARIA 1.2 — rôle alert](https://www.w3.org/TR/wai-aria-1.2/#alert) | Établi — spécification W3C |
| S25 | Bannière de notification à utiliser avec parcimonie (« there's evidence that people often miss them ») ; ne pas l'utiliser pour une information directement liée à la tâche ni pour des erreurs de validation ; role="region" par défaut, role="alert" pour les confirmations de succès avec mise au focus ; la fermeture par l'utilisateur reste une question de recherche ouverte, non implémentée | [GOV.UK Design System — Notification banner](https://design-system.service.gov.uk/components/notification-banner/) | Établi — 9e système public consulté, absent du benchmark d'origine. **Contredit le mapping de rôles de R55 et le défaut dismissible de R35** |
| S26 | Le résumé d'erreurs se place en tête du conteneur principal, au-dessus du titre de page, chaque erreur étant un lien vers le champ concerné ; le focus y est déplacé au chargement ; le composant n'est pas fermable | [GOV.UK Design System — Error summary](https://design-system.service.gov.uk/components/error-summary/) | Établi — confirme R08, R53 et R66 par une source externe, le fichier ne s'appuyant que sur FORM-UX |
| S27 | Les utilisateurs ignorent systématiquement les zones perçues comme publicitaires, y compris des contenus légitimes présentant des caractéristiques de publicité, et évitent durablement une zone où ils ont déjà rencontré une promotion | [Nielsen Norman Group — Banner Blindness: Old and New Findings](https://www.nngroup.com/articles/banner-blindness-old-and-new-findings/) | Établi — première source externe pour la cécité d'attention invoquée par R16, R22, R28 et R74 |
| S28 | La cible d'un pointeur mesure au moins 24 × 24 px CSS (2.5.8, AA) ; le seuil de 44 × 44 px relève de 2.5.5 Target Size (Enhanced), niveau AAA | [WCAG 2.2 — 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) | Établi — **nuance le « 44 px standard externe non négociable » d'ALERT-UI** |

*Toute règle sans source explicite ci-dessus repose sur un raisonnement de mécanisme (attention, charge cognitive, accessibilité) plutôt que sur une étude chiffrée. Comme pour la carte, aucune étude type "+X%" n'a été trouvée pour ce composant — l'écart de niveau de preuve bouton/input vs carte/alert se confirme : les composants de feedback sont moins mesurés que les composants de conversion.*

## À approfondir

- **Toast / snackbar** : le composant frère exclu par la frontière de périmètre — candidat naturel de prochaine documentation (durées, empilement, undo — BUTTON-UX.md l'effleure déjà par la fenêtre 5-8s du pattern undo).
- **Bannière de consentement (cookies)** : pattern réglementaire distinct — les boutons restent régis par BUTTON-UX.md, l'objet lui-même n'est couvert nulle part.
- **Centre de notifications** (historique des messages passés) : hors périmètre — c'est une vue, pas un composant.
- **RTL et reduced motion** : position de l'icône/croix en lecture droite-gauche, insertion sans animation — signalés dans l'inventaire, non couverts.
