---
component: button
layer: ux
version: 1.10.0 # 1.10.0 : RETRAIT du tone warning (arbitrage Aurélien 2026-07-29, cf. DECISIONS.md) — l'avertissement est un message (Alert), jamais une action ; R31/R32 abrogées (IDs conservés), R16/R17/R26 et la table de combinaisons ajustés (4 × 3 = 12) ; la doctrine cesse d'annoncer une API que le composant refuse depuis la 0.3.0. 1.9.0 : BUTTON-R65 requalifié en note de méthode — pointeur non normatif vers FORM-R28 (FORM-UX.md), qui portait déjà la règle, la mesure et les sources depuis la cession du 2026-07-03 ; ÉNONCÉ et MESURE normatifs retirés du pointeur, aucune règle métier modifiée (2026-07-28, cf. DECISIONS.md). 1.8.1 : chemins repointés vers `content/md/` — fin de la migration vers le monorepo Sibyl DS (2026-07-27) ; aucune règle, aucun token, aucune source modifiés. 1.8.0 : BUTTON-R76 cède son autorité à CONSENTEMENT-UX (R08) — la symétrie de poids visuel des deux options d'un bandeau de consentement est une contrainte du pattern, pas une règle du bouton ; l'ID est conservé et pointe vers son nouveau propriétaire (2026-07-27, 4e cession d'autorité journalisée, cf. DECISIONS.md). 1.7.0 : Instrument E-motion (SubmitButton, gabarit) + un événement un porteur ; rattachement nommé Motion/Voice ; repli reduced-motion spinner. 1.6.1 : le libellé visible reste intégralement lisible quand l'espace manque — repli avant troncature, libellé court uniquement s'il est validé. 1.6.0 : rattachement au Langage d'interaction et à l'Architecture adaptative.
last_updated: 2026-07-29
companion: BUTTON-UI.md
confidence: mixed # voir détail par section — certaines règles sont établies, d'autres sont un cas isolé documenté
---

# Bouton — Couche UX

> Ce fichier contient le raisonnement : quand utiliser quoi, pourquoi, quel wording, quel risque. Il reste stable même si l'identité visuelle change complètement — c'est la partie transférable d'une marque à l'autre. Pour les tokens, tailles en pixels, contrastes et détails d'implémentation, voir `BUTTON-UI.md`.

## But
Un bouton déclenche une action immédiate et engage l'utilisateur dans une décision. Il ne navigue pas simplement — il *fait quelque chose*. C'est ce qui le distingue d'un lien : le lien déplace, le bouton agit. Toute règle ci-dessous découle de ce principe : plus l'action est engageante ou coûteuse à annuler, plus le bouton doit porter de friction et de clarté.

## Quand l'utiliser / ne pas l'utiliser

RÈGLE [BUTTON-R01] : utiliser pour toute action qui modifie un état, soumet une donnée, ou déclenche un processus (valider, supprimer, envoyer, activer).
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous utilisons un bouton pour toute action qui modifie un état, soumet une donnée ou déclenche un processus, jamais pour une simple navigation.

RÈGLE [BUTTON-R02] : ne pas utiliser pour une simple navigation vers une autre page ou section — c'est le rôle du lien.
STATUT : propriété universelle
SOURCE : interne
ÉNONCÉ : Un contrôle qui se contente de naviguer vers une autre page doit être un lien, pas un bouton, car les deux n'ont pas le même comportement clavier natif.
MESURE : un élément de navigation pure utilise un lien (<a href>), jamais un bouton

> **Pourquoi** : confondre les deux casse les attentes natives du clavier et du lecteur d'écran (un lien s'active à l'Entrée, un bouton aussi à l'Espace).

RÈGLE [BUTTON-R03] : cas limite fréquent — un bouton qui ouvre une modale n'est pas une navigation au sens strict, mais engage un flux — traité comme bouton, pas comme lien.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, un bouton qui ouvre une fenêtre modale est traité comme un bouton, même s'il ne navigue pas au sens strict.
MESURE : un contrôle qui ouvre une fenêtre modale est implémenté comme un bouton, pas comme un lien

## Application du langage d'interaction

RÈGLE [BUTTON-R04] : le Button est l'expression canonique de l'intention **agir** dans `INTERACTION-UX.md`. Sa
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, la forme, la bordure et les états visuels d'un bouton doivent suffire à le faire reconnaître comme un contrôle interactif avant même la lecture de son texte.
forme, sa limite et ses états doivent le rendre identifiable comme contrôle avant la lecture du label.

RÈGLE [BUTTON-R05] : cette présence ne signifie pas « ajouter une ombre ». Le style, le fond, la bordure et les
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, un bouton ne signale jamais son affordance par une ombre portée : celle-ci vient de son style, sa bordure et ses états.
MESURE : aucune ombre portée n'est appliquée au bouton à l'état de repos
états portent déjà l'affordance ; l'élévation reste gouvernée par `ELEVATION-UX.md` et n'est pas
consommée par le Button.

RÈGLE [BUTTON-R06] : même en style `ghost`, un Button ne devient pas un Link. Il conserve une zone de contrôle,
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, même dans son style le plus discret, un bouton reste un vrai bouton avec zone de contrôle et états propres, jamais un lien déguisé.
MESURE : un bouton en style discret reste un élément bouton avec états de focus et de pression, jamais un lien
des états de pression/focus et la sémantique d'une action. Si le résultat est une destination, utiliser
`LINK-UX.md`.

## Application du langage de motion

RÈGLE [BUTTON-R07] : les mouvements du Button sont du **feedback** au sens de `MOTION-UX.md` — confirmer qu'une
STATUT : parti pris d'identité
SOURCE : S13
ÉNONCÉ : Chez nous, le survol d'un bouton produit une transition rapide et progressive, signal de retour immédiat plutôt qu'information nouvelle.
MESURE : la transition de survol du bouton utilise une durée courte et un ralentissement en sortie (ease-out)
action a été reçue, court et discret. Le hover, principal signal d'affordance sur desktop, se rend au
cran `motion.fast` sur une courbe `motion.ease-out` (valeurs et technique dans `BUTTON-UI.md` § tokens
`motion`).

RÈGLE [BUTTON-R08] : toute transition d'état du Button est **interruptible et repart de l'état courant** — un
STATUT : parti pris d'identité
SOURCE : S13
ÉNONCÉ : Chez nous, toute animation d'état du bouton est interruptible : redéclencher le survol pendant une transition l'inverse depuis où elle en est.
MESURE : un nouveau survol pendant la transition de sortie inverse l'animation depuis son état courant sans la relancer depuis le début
re-hover pendant la sortie du hover **inverse** la transition là où elle en est, sans rejouer ni mettre
en file une animation (`MOTION-UX.md` § Interruption).

RÈGLE [BUTTON-R09] : le **spinner** du `loading` (cf. § États et comportement) est la **seule exception** au
STATUT : parti pris d'identité
SOURCE : S13
ÉNONCÉ : Chez nous, seule la rotation continue de l'indicateur de chargement se fait à vitesse constante ; tout autre mouvement du bouton accélère ou décélère.
MESURE : seule la rotation de l'indicateur de chargement du bouton utilise une vitesse constante (linéaire)
bannissement du mouvement linéaire — sa rotation continue reste linéaire là où tout déplacement du
système décélère ou accélère (`MOTION-UX.md` : « jamais de linéaire pour un déplacement, une seule
exception : la rotation continue du spinner »). Son repli `prefers-reduced-motion` (indicateur statique
ou pulse d'opacité) vit dans `BUTTON-UI.md`.

> **Pourquoi** : le mouvement du Button porte le *fait qu'un geste a été reçu*, jamais une information
> qui ne vivrait que dans lui — sous `prefers-reduced-motion` il dégrade sans perte, l'état restant
> dans l'ARIA et le statique.

## Instrument E-motion — le moment d'envoi (SubmitButton)

RÈGLE [BUTTON-R10] : le Button est le **premier citoyen et le gabarit** d'`EMOTION-UX.md`. Le moment catalogué
STATUT : parti pris d'identité
SOURCE : S10
ÉNONCÉ : Chez nous, la réussite d'un envoi s'incarne d'abord dans le bouton de soumission lui-même, qui se transforme visuellement avant d'afficher la confirmation.
**« réussite d'un envoi / d'une soumission »** s'incarne d'abord dans le **SubmitButton « avion en
papier »** : envoi async → l'objet se plie et vole (pliage/vol) → l'état se résout en « Envoyé ✓ ».
Toute autre incarnation d'E-motion hérite de son anatomie (cf. `EMOTION-UI.md` et `BUTTON-UI.md`
§ Instrument E-motion — implémentation).

RÈGLE [BUTTON-R11] : **un événement, un porteur.** Le moment « réussite d'un envoi » ne s'incarne qu'**une seule
STATUT : parti pris d'identité
SOURCE : S11
ÉNONCÉ : Chez nous, la célébration d'un envoi réussi ne se joue qu'à un seul endroit à la fois, jamais sur le bouton et dans une notification en même temps.
MESURE : la célébration animée d'un envoi réussi n'apparaît jamais simultanément sur le bouton et dans une notification pour le même événement
fois** par séquence — porté soit par le bouton de soumission quand il résout **EN PLACE** (l'avion se
plie → « Envoyé ✓ » sur le bouton lui-même), soit par un **toast success illustré** quand la
confirmation est **INJECTÉE** ailleurs (`TOAST-UX.md` § Instrument E-motion), jamais les deux. Quand le
Button délègue, il reste **productif** (pas de fête sur le bouton) : qui délègue ne duplique pas.

RÈGLE [BUTTON-R12] : Contrat de repli inviolable (hérité d'`EMOTION-UX.md`) : l'animation ne porte jamais
STATUT : propriété universelle
SOURCE : S12
ÉNONCÉ : L'information transmise par une animation doit toujours rester disponible sans elle : en mode mouvement réduit, l'état final s'affiche instantanément, sans perte.
MESURE : quand les animations sont réduites, l'état final s'affiche instantanément et l'information reste disponible sans dépendre de l'animation
l'information — l'état vit dans l'ARIA et le statique ; sous `prefers-reduced-motion` le moment dégrade
vers sa version instantanée (le fait, jamais la fête), sans perte.

RÈGLE [BUTTON-R13] : Budget de rareté (`EMOTION-UX.md`) : jamais sur une action réflexe ou à haute fréquence ; un
STATUT : parti pris d'identité
SOURCE : S12
ÉNONCÉ : Chez nous, l'animation de célébration d'un envoi ne se joue jamais sur une action répétitive ou réflexe, seulement sur les moments qui le méritent.
MESURE : une même animation de célébration ne se déclenche pas plus d'une fois par séquence utilisateur, ni sur une action répétitive
seul moment par séquence utile. Un submit répété 40 fois par jour ne déclenche **jamais** l'avion — le
moment n'est mérité que là où l'envoi compte.

RÈGLE [BUTTON-R14] : la mécanique async que l'avion **célèbre** est celle déjà spécifiée aux § Anti double-soumission
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, l'envoi démarre réellement dès le premier clic indépendamment de toute animation, et l'état serveur réel prévaut toujours sur elle.
MESURE : le bouton passe en état loading ou disabled dès le premier clic, avant la fin de toute animation de célébration
(usage unique) et § Bouton de confirmation — l'envoi réel part indépendamment de l'animation, le bouton
passe en `loading`/`disabled` dès le premier clic, et l'état réel prime si la réponse serveur arrive
avant la fin de la fête. E-motion ne change pas cette mécanique, il la met en scène.

> **Pourquoi « un événement, un porteur »** : célébrer une même réussite deux fois (sur le bouton *et*
> dans un toast) dédouble le signal et le banalise — même logique que « un seul primary par vue » et que
> le budget de rareté. Le composant qui délègue reste utile sans se répéter.

RÈGLE [BUTTON-R15] : le **DeleteButton « froissage »** (animation E-motion envisagée sur une action destructive)
STATUT : note de méthode
SOURCE : S15
ÉNONCÉ : Ce document signale que l'animation envisagée pour un bouton de suppression n'est pas encore tranchée et reste un point ouvert.
reste un **point ouvert non tranché** — il n'est ni catalogué ni arbitré ici (cf. `EMOTION-UX.md`
§ À approfondir et DECISIONS.md).

CONFIANCE : le gabarit SubmitButton et le contrat de repli sont établis (hérités d'`EMOTION-UX.md`) ; le
DeleteButton reste un point ouvert, remonté et non tranché.

## Décision encodée

RÈGLE [BUTTON-R16] : le bouton encode deux informations indépendantes, pas une seule liste de variantes :
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, un bouton se définit par deux dimensions indépendantes : le style, qui exprime son poids visuel, et le tone, qui exprime la nature de l'action.
  - **Style** (le remplissage) : filled, stroke, lighter, ghost — répond à *"quel poids visuel donne-t-on à ce bouton ?"* (du plus appuyé au plus discret).
  - **Tone** (le sens sémantique) : primary, neutral, destructive — répond à *"quelle est la nature de l'action ?"* (action de marque, action neutre, conséquence destructive). L'avertissement n'est pas une nature d'action : c'est un message (cf. retrait du tone warning, 2026-07-29).

RÈGLE [BUTTON-R17] : les deux axes se combinent librement — 4 × 3 = 12 combinaisons colorées. Un bouton n'est jamais "juste destructive" — il est toujours une combinaison des deux (ex: ghost + destructive pour une suppression discrète en table, filled + destructive pour une confirmation de suppression en modale).
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, les styles et les tones d'un bouton se combinent librement, formant douze combinaisons de couleurs possibles, chacune ayant un sens propre.
MESURE : chaque combinaison des styles et des tones du bouton dispose d'un rendu de couleur défini

> **Pourquoi deux axes plutôt qu'une liste plate de variantes** : une liste ne peut pas exprimer un destructive à faible poids visuel (icône de suppression discrète en table), et les systèmes majeurs (Material Design 3, IBM Carbon, Shopify Polaris) séparent tous le remplissage de la couleur. (Historique du choix : cf. DECISIONS.md.)

> **Note de vocabulaire (1.5.0)** : jusqu'en 1.4.0 l'axe s'appelait `emphasis` et listait primary/secondary/ghost. Ce nom confondait deux questions distinctes — *comment le bouton est rempli* (désormais l'axe `style`) et *quel rang l'action tient dans la vue* (dominante, alternative, mineure). Ce **rang** n'est pas un axe du composant : c'est une décision d'usage qu'on obtient en choisissant une combinaison style+tone. Le raisonnement ci-dessous (un seul dominant par vue, l'alternative ne concurrence jamais le dominant, le mineur pour le faible enjeu) est conservé tel quel ; il est simplement rattaché à ses combinaisons canoniques. La correspondance :
>
> | Rang de l'action | Combinaison canonique | Rôle |
> |---|---|---|
> | **Dominante** (ex-« primary ») | `filled` + `primary` (ou le tone de la conséquence : `filled` + `destructive`) | l'action que la vue est conçue pour provoquer |
> | **Alternative** (ex-« secondary ») | `stroke` ou `lighter` + `neutral` | option légitime qui ne concurrence pas la dominante |
> | **Mineure** (ex-« ghost ») | `ghost` + le tone approprié | action à faible enjeu ; le tone compense si l'enjeu monte |

Les valeurs de tokens exactes pour chaque combinaison vivent dans `BUTTON-UI.md`.

## Hiérarchie, style et tone : le raisonnement

### Hiérarchie de l'action (le rang, rendu par le style)

> Cette section raisonne sur le **rang** d'une action dans la vue — dominante, alternative, mineure. Ce rang n'est pas un axe du composant (cf. « Décision encodée » : les axes sont `style` et `tone`) ; on l'obtient en choisissant un remplissage (`style`) et une couleur (`tone`). Les trois sous-sections gardent leurs anciens noms (primary/secondary/ghost) comme **noms de rang**, avec leur combinaison canonique en tête.

#### Dominante — ex-« primary » (canonique : `filled` + `primary`)

RÈGLE [BUTTON-R18] : porter l'action que le parcours est conçu pour provoquer sur cette vue — pas "une action importante" au sens large.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, le bouton dominant d'une vue porte précisément l'action que ce parcours est conçu pour provoquer, pas n'importe quelle action jugée importante.

RÈGLE [BUTTON-R19] : un seul primary visible par vue.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, une vue ne doit jamais afficher plus d'un bouton dominant à la fois, pour ne pas diluer le signal de priorité.
MESURE : un seul bouton au rang dominant est visible par vue

> **Pourquoi** : deux primary côte à côte annulent le signal qu'ils sont censés porter — l'utilisateur ne sait plus lequel prioriser, ce qui recrée artificiellement l'indécision que la hiérarchie visuelle devait éliminer.
> **Erreur fréquente** : le primary par réflexe esthétique ("il est plus beau") plutôt que par intention — ça dilue sa valeur de signal partout où il apparaît ensuite dans le produit.

RÈGLE [BUTTON-R20] : précision sur "une vue" — un header persistant (sticky) et le contenu qu'il surplombe sont deux zones fonctionnellement distinctes : le CTA de header (souvent "Contact", "Se connecter") et un primary de contenu (ex: un CTA de hero) peuvent coexister à l'écran sans violer la règle.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, le bouton d'action du header persistant et le bouton dominant du contenu comptent comme deux zones distinctes et peuvent coexister à l'écran.
MESURE : un bouton d'action de header persistant et un bouton dominant de contenu peuvent coexister à l'écran

RÈGLE [BUTTON-R21] : les deux ne doivent jamais avoir exactement le même poids visuel — l'un des deux doit clairement dominer.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, le bouton du header et celui du contenu de page ne doivent jamais avoir exactement le même poids visuel : l'un des deux doit dominer.
MESURE : le bouton du header et le bouton dominant de contenu n'ont pas exactement le même poids visuel

> **Pourquoi** : l'utilisateur les perçoit comme deux registres différents (navigation persistante vs action de page) — sinon l'ambiguïté que la règle cherche à éviter revient par la porte de derrière.

#### Alternative — ex-« secondary » (canonique : `stroke`/`lighter` + `neutral`)

RÈGLE [BUTTON-R22] : offrir une action alternative légitime, sans jamais concurrencer la dominante — typiquement "Annuler", "Retour", "Plus tard".
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, un bouton alternatif propose une option légitime, comme annuler ou retour, qui ne concurrence jamais visuellement le bouton dominant.

RÈGLE [BUTTON-R23] : toujours moins de poids visuel que le primary adjacent — jamais la même intensité, même si la taille et la forme sont identiques.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, un bouton alternatif a toujours moins de poids visuel que le bouton dominant placé à côté de lui, même à taille identique.
MESURE : le bouton alternatif utilise un style moins appuyé que le bouton dominant placé à côté de lui

> **Pourquoi** : le secondary répond à la question "et si je ne veux pas faire l'action principale, quelle est mon autre option raisonnable ?"
> **Erreur fréquente** : transformer un secondary en deuxième primary déguisé — l'utilisateur perçoit inconsciemment une hésitation du produit lui-même sur ce qu'il veut qu'on fasse.
> **Rendu (1.5.0)** : l'alternative se rend en `stroke` + `neutral` ou `lighter` + `neutral` — moins de remplissage que la dominante `filled`, sans lui voler la couleur de marque.

#### Mineure — ex-« ghost » (canonique : `ghost` + tone approprié)

RÈGLE [BUTTON-R24] : porter une action mineure, présente mais qui ne doit pas capter l'attention en premier — "Voir plus", "Modifier les préférences".
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, un bouton mineur porte une action secondaire présente mais volontairement peu visible, comme voir plus ou modifier les préférences.

RÈGLE [BUTTON-R25] : si l'action réelle a un enjeu fort, c'est un signe qu'elle est mal classée en ghost, pas que le ghost doit être plus visible.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, si une action en style discret a un enjeu réel fort, c'est le classement de l'action qui doit être revu, pas la visibilité du bouton.

RÈGLE [BUTTON-R26] : exception documentée — un ghost peut porter une action à enjeu réel si son tone (destructive) compense — voir table de combinaisons.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, un bouton au style le plus discret peut porter une action à enjeu réel si sa couleur sémantique compense sa faible présence visuelle.

> **Pourquoi** : sa faible présence visuelle est une caractéristique, pas un défaut à corriger — le ghost tolère d'être visuellement discret précisément parce que l'action qu'il porte est à faible enjeu.
> **Erreur fréquente** : y loger une action à fort enjeu par manque d'espace ou par souci de minimalisme visuel, sans lui donner le tone correspondant.

### Tone (sens sémantique)

#### Primary

RÈGLE [BUTTON-R27] : la couleur de marque — porte l'action que le produit veut voir aboutir. C'est le tone de la dominante par défaut (`filled` + `primary`), et le seul tone tiré de la palette de marque plutôt que d'un état sémantique.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, un seul tone de bouton est tiré directement de la couleur de marque ; les autres tones expriment un état sémantique.
MESURE : seul le tone de marque du bouton utilise une couleur issue de la palette de marque

> **Pourquoi un tone à part** : depuis 1.5.0 `primary` n'est plus un rang (« le bouton dominant ») mais une **couleur**. Le rang se rend par le style ; la couleur de marque, elle, peut habiller n'importe quel style — un `stroke` + `primary` (bouton bordé bleu) ou un `lighter` + `primary` (bouton bleu doux) sont des usages légitimes, pas des anomalies.

#### Neutral

RÈGLE [BUTTON-R28] : le tone par défaut hors marque — l'action n'a pas de charge sémantique particulière au-delà de son style. Rendu en « noir » (fond `neutral-strong` en filled, texte `text-primary` sinon).
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, le tone neutre est la couleur par défaut d'un bouton qui n'a pas de charge sémantique particulière au-delà de son style.

La grande majorité des boutons d'un produit sont neutral (souvent en `stroke` ou `ghost` : l'alternative, la mineure).

#### Destructive

RÈGLE [BUTTON-R29] : signaler sans ambiguïté qu'une action retire, supprime, ou annule quelque chose de façon coûteuse à revenir en arrière.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, le tone destructif signale sans ambiguïté qu'une action supprime, retire ou annule quelque chose de coûteux à revenir en arrière.

RÈGLE [BUTTON-R30] : ne jamais positionner un destructive à l'endroit exact où se trouve habituellement une action fréquente dans l'interface.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, un bouton destructif n'est jamais placé exactement là où se trouve habituellement une action fréquente, pour éviter le clic accidentel.
MESURE : aucun bouton au tone destructif n'occupe l'emplacement habituel d'une action fréquente de l'interface

> **Pourquoi** : le risque de clic accidentel par mémoire musculaire est réel. Le rôle du destructive n'est pas juste "rouge" (cf. BUTTON-UI.md pour le token exact) — c'est un signal d'alarme qui doit rester rare pour garder sa valeur d'alerte.
> **Erreur fréquente** : réutiliser le tone destructive pour des actions simplement "négatives" mais réversibles (ex: "Retirer du panier") — ça banalise le signal là où ça compte vraiment.

#### Warning — tone retiré (2026-07-29)

RÈGLE [BUTTON-R31] : abrogée — le tone warning est retiré du bouton (arbitrage 2026-07-29, cf. DECISIONS.md).
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : L'avertissement est un message, jamais une action : il vit dans Alert (et les futurs Badge), pas dans Button — un bouton d'avertissement au style contour se confond avec une alerte. L'action « à portée réelle » que R31 visait (signaler, alerter un tiers) se porte avec un tone primary ou neutral et un libellé explicite ; c'est le contexte (modale de confirmation, message adjacent) qui porte l'avertissement. L'ID est conservé pour l'historique.

RÈGLE [BUTTON-R32] : abrogée avec R31 — la règle d'isolement de l'avertissement suit le tone retiré.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Sans tone d'avertissement, la règle d'isolement correspondante n'a plus d'objet sur le bouton ; l'isolement du destructif (R30) demeure.

### Combinaisons observées et exemples

RÈGLE [BUTTON-R33] : table ci-dessous
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Ce document présente sous forme de tableau les combinaisons observées de style et de tone avec un exemple et un contexte typique pour chacune.

Colonne « Style × Tone » = la combinaison réelle du composant (les deux axes) ; le rang indiqué est l'usage qu'elle sert.

| Style × Tone | Rang | Exemple | Contexte typique |
|---|---|---|---|
| filled + primary | dominante | "Confirmer la commande" | CTA principal standard |
| filled + destructive | dominante | "Supprimer définitivement mon compte" | Bouton de confirmation dans une modale destructive — reste la dominante *de cette modale* |
| stroke / lighter + neutral | alternative | "Annuler", "Retour" | Option de retrait standard |
| ghost + neutral | mineure | "Voir plus" | Action mineure, faible enjeu |
| ghost + destructive | mineure | Icône de suppression dans une table/liste | Poids visuel faible, tone qui compense par la couleur et la confirmation |

> **Ce que cette table révèle** : le remplissage (`style`) et la gravité de l'action (`tone`) sont deux questions différentes. Un ghost + destructive n'est pas "moins grave" qu'un filled + destructive — c'est la même gravité, affichée avec moins d'insistance parce que le contexte l'exige. Cohérent avec la règle transversale plus bas : la friction doit suivre le risque réel, pas le poids visuel choisi pour d'autres raisons.

### Principe transversal entre style et tone

RÈGLE [BUTTON-R34] : le choix de style et de tone n'est jamais une décision esthétique — c'est une déclaration explicite sur l'enjeu de l'action pour l'utilisateur à cet instant précis.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, le choix du style et du tone d'un bouton n'est jamais esthétique : il déclare explicitement l'enjeu réel de l'action pour l'utilisateur.

> **Pourquoi** : se tromper casse la lisibilité de l'interface plus sûrement qu'une erreur de couleur ou d'espacement.

## Tailles : le raisonnement (valeurs exactes dans BUTTON-UI.md)

RÈGLE [BUTTON-R35] : la taille répond à une question différente du style et du tone : *quelle est la densité du contexte qui accueille ce bouton ?*
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, la taille d'un bouton répond à la densité du contexte qui l'accueille, pas à l'importance perçue de l'action.

RÈGLE [BUTTON-R36] : **sm** — contextes denses : tableaux, barres d'outils, panneaux latéraux compacts.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, la plus petite taille de bouton est réservée aux contextes denses comme les tableaux, barres d'outils et panneaux compacts.

RÈGLE [BUTTON-R37] : **md** — la taille par défaut : formulaires, la majorité des contextes standards.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, la taille moyenne est la taille par défaut du bouton, utilisée dans les formulaires et la majorité des contextes standards.

RÈGLE [BUTTON-R38] : **lg** — contextes à forte emphase visuelle volontaire : hero, CTA marketing, écrans de conversion.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, la plus grande taille de bouton est réservée aux contextes à forte emphase visuelle volontaire, comme un hero ou un CTA marketing.

RÈGLE [BUTTON-R39] : ne jamais mélanger les tailles au sein d'un même groupe de boutons — un groupe partage toujours la même taille, même si les styles diffèrent.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, tous les boutons d'un même groupe partagent toujours la même taille, même si leurs styles diffèrent.
MESURE : tous les boutons d'un même groupe partagent la même taille

> **Erreur à éviter d'emblée** : confondre taille et style. "Large" ne veut pas dire "important", et un bouton small peut très bien porter un tone destructive ou un style filled.
> **Erreur fréquente** : choisir la taille en fonction de "ce qui a l'air bien" plutôt que de la densité réelle du contexte — le même écueil que pour le style.

## Autres rôles comportementaux
Ces rôles ne sont pas des variantes visuelles — ce sont des **comportements** qui peuvent s'appliquer à plusieurs combinaisons style/tone. Ils sont fréquemment oubliés parce qu'ils ne rentrent pas dans la grille des styles et des tones.

### Toggle / bouton d'état

RÈGLE [BUTTON-R40] : basculer entre deux états persistants (suivre/ne plus suivre, activer/désactiver), pas déclencher une action ponctuelle.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, un bouton d'état bascule entre deux états persistants, comme suivre ou ne plus suivre, il ne déclenche pas une action ponctuelle.

RÈGLE [BUTTON-R41] : l'état visuel doit refléter l'état *actuel*, jamais l'action à venir — un bouton "Suivi ✓" indique qu'on suit déjà, il ne dit pas "cliquez pour suivre".
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, le label d'un bouton d'état décrit l'état actuel de l'élément, jamais l'action qu'un clic déclencherait.
MESURE : le label du bouton d'état décrit l'état actuel plutôt que l'action déclenchée par le clic

> **Erreur fréquente** : formuler le label comme une instruction ("Suivre" alors qu'on suit déjà) plutôt que comme un état.

### Bouton de confirmation (hors modale)

RÈGLE [BUTTON-R42] : valider une action déjà engagée ailleurs dans le flux.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, un bouton de confirmation valide une action déjà engagée plus tôt dans le flux, il ne l'initie pas.

RÈGLE [BUTTON-R43] : toujours accompagné d'une option d'annulation visible au même niveau de la séquence, jamais isolé seul comme unique issue possible.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, un bouton de confirmation est toujours accompagné d'une option d'annulation visible au même niveau, jamais seul comme unique issue.
MESURE : une option d'annulation est visible au même niveau que le bouton de confirmation

> **Pourquoi** : se distingue du primary générique par le fait qu'il conclut une séquence déjà commencée plutôt que d'ouvrir une nouvelle intention.

### Bouton d'annulation / Undo

RÈGLE [BUTTON-R44] : permettre de revenir sur une action qui vient d'être exécutée, généralement via un toast ou une notification temporaire ("Élément supprimé — Annuler").
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, un bouton d'annulation permet de revenir sur une action qui vient d'être exécutée, généralement affiché dans une notification temporaire.

RÈGLE [BUTTON-R45] : la durée d'affichage doit être suffisante pour une décision réfléchie (5-8 secondes minimum), sans bloquer l'interface le temps de cette fenêtre.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, le message proposant d'annuler une action reste visible au moins 5 à 8 secondes, sans bloquer le reste de l'interface pendant ce délai.
MESURE : le message proposant d'annuler une action reste affiché au moins 5 à 8 secondes

RÈGLE [BUTTON-R46] : un pattern d'undo bien conçu peut réduire le besoin de confirmation préalable — arbitrage valide, mais les deux ne doivent jamais être absents en même temps sur une action à enjeu réel.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, une action à enjeu réel doit toujours offrir soit une confirmation préalable, soit une option d'annulation après coup, jamais aucune des deux.
MESURE : une action à enjeu réel dispose d'au moins l'un des deux mécanismes : confirmation préalable ou annulation après coup

### Quel palier choisir : le critère de décision

RÈGLE [BUTTON-R47] : le critère qui fonctionne réellement est **le coût de recréation de la donnée si l'action est mal exécutée** :
STATUT : parti pris d'identité
SOURCE : S9
ÉNONCÉ : Chez nous, le niveau de friction avant une suppression dépend du coût de recréation de la donnée si l'action est mal exécutée.
  1. **Triviale à recréer ou à annuler** (ex: un commentaire court, un item de liste simple) → suppression directe, undo après coup. Pas de confirmation préalable — elle ajouterait de la friction sans bénéfice.
  2. **Pas facilement récupérable, mais pas exceptionnelle** (ex: un brouillon travaillé, une configuration) → confirmation simple avec explication de la conséquence, sans délai ni saisie.
  3. **Coûteuse ou longue à recréer, ou supprime un volume important** (ex: un fil de discussion entier avec ses réponses, un compte) → confirmation différée (délai ou saisie de type "tapez SUPPRIMER").

RÈGLE [BUTTON-R48] : ce critère s'applique même à deux boutons visuellement identiques (même icône poubelle, même ghost + destructive) — la donnée derrière détermine le palier de friction, pas l'apparence du bouton.
STATUT : parti pris d'identité
SOURCE : S9
ÉNONCÉ : Chez nous, deux boutons de suppression visuellement identiques peuvent avoir des niveaux de friction différents selon la donnée qu'ils suppriment.

> **Pourquoi** : le choix ne doit pas se faire sur "c'est grave ou pas", trop vague pour trancher.

CONFIANCE : établi — pattern "Delete/Remove" explicitement documenté (IBM Carbon), pas une déduction (cf. table Sources).

### Anti double-soumission (usage unique)

RÈGLE [BUTTON-R49] : empêcher qu'une action à effet unique (paiement, envoi définitif) soit déclenchée plusieurs fois par un utilisateur impatient ou par une latence réseau perçue comme un échec.
STATUT : propriété universelle
SOURCE : S2
ÉNONCÉ : Une action à effet unique, comme un paiement ou un envoi définitif, doit être protégée contre un déclenchement multiple par impatience ou latence réseau.

RÈGLE [BUTTON-R50] : dès le premier clic, le bouton doit passer en état loading/disabled immédiatement — avant même la réponse du serveur.
STATUT : propriété universelle
SOURCE : S2
ÉNONCÉ : Dès le premier clic sur une action à effet unique, le bouton doit passer en état de chargement ou désactivé, avant même la réponse du serveur.
MESURE : dès le premier clic, le bouton passe en état loading ou disabled avant la réponse du serveur

### Confirmation différée (délai ou saisie de confirmation)

RÈGLE [BUTTON-R51] : ajouter une friction volontaire et consciente avant qu'une action destructive à enjeu élevé ne devienne exécutable, pour empêcher le clic réflexe.
STATUT : parti pris d'identité
SOURCE : S7
ÉNONCÉ : Chez nous, une friction volontaire retarde l'exécution d'une action destructive à enjeu élevé, pour empêcher un clic réflexe.

RÈGLE [BUTTON-R52] : un délai de 2-3 secondes avant que le bouton de confirmation finale ne devienne cliquable, ou une saisie explicite ("tapez SUPPRIMER pour confirmer") pour les actions les plus critiques.
STATUT : parti pris d'identité
SOURCE : S7
ÉNONCÉ : Chez nous, la confirmation finale d'une action très critique impose un délai de 2 à 3 secondes avant d'être cliquable, ou une saisie explicite de confirmation.
MESURE : le bouton de confirmation finale reste non cliquable pendant 2 à 3 secondes, ou nécessite la saisie d'un mot de confirmation, pour les actions les plus critiques

CONFIANCE : convergence — pattern largement observé en production (suppression de dépôt GitHub, clôture de compte Stripe), non quantifié académiquement.

## Relations entre boutons
Un bouton n'est presque jamais seul — sa lisibilité dépend souvent de son voisin.

RÈGLE [BUTTON-R53] : ordre entre primary et secondary — pas de règle universelle. Deux conventions coexistent réellement selon le type de paire :
STATUT : parti pris d'identité
SOURCE : S6
ÉNONCÉ : Chez nous, l'ordre entre bouton dominant et alternatif suit une convention propre à chaque type de paire, faute de convention universelle établie.
  - *Paire d'authentification en header* (Log in / Join) : secondary précède, primary clôt la lecture à droite en LTR.
  - *Paire de CTA de hero ou de contenu* : aucune convention dominante observée — les deux ordres existent sur des sites réels.
  - *Modale* : culturellement variable selon plateforme et framework.

RÈGLE [BUTTON-R54] : la seule règle qui tienne réellement est la cohérence interne au produit — une fois un ordre choisi pour un type de paire donné, il ne doit jamais varier d'un écran à l'autre.
STATUT : parti pris d'identité
SOURCE : S6
ÉNONCÉ : Chez nous, une fois un ordre choisi pour un type de paire de boutons, il reste identique sur tout le produit, sans jamais varier d'un écran à l'autre.
MESURE : l'ordre choisi pour un type de paire de boutons donné est identique sur tous les écrans du produit

> *(Révision qui a mené à cette règle : cf. DECISIONS.md.)*

RÈGLE [BUTTON-R55] : deux boutons de poids identique juxtaposés — à proscrire hors des cas volontaires de choix binaire équilibré (ex: "Accepter" / "Refuser" un consentement).
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, deux boutons de poids visuel identique côte à côte sont à proscrire, sauf dans un choix binaire volontairement équilibré.
MESURE : aucun couple de boutons adjacents ne partage le même poids visuel, sauf choix binaire équilibré explicite

RÈGLE [BUTTON-R56] : menu à choix parallèles (3 options ou plus, poids égal) — cas distinct : quand plusieurs options de même nature sont proposées côte à côte sans hiérarchie voulue (ex: "Image / Photo / Fichier"), l'égalité de poids visuel est l'intention correcte. La règle de cardinalité du primary ne s'applique pas ici.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, un menu d'au moins trois options proposées à poids visuel égal côte à côte est un cas où la règle du bouton dominant unique ne s'applique pas.

RÈGLE [BUTTON-R57] : espacement minimum entre boutons adjacents — suffisant pour éviter le mis-clic (valeurs précises dans BUTTON-UI.md).
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, l'espacement entre deux boutons adjacents doit être suffisant pour éviter le clic accidentel sur le mauvais bouton.

## Grille et intégration structurelle

RÈGLE [BUTTON-R58] : le bouton hérite de la grille du contenu qu'il accompagne — il ne flotte jamais de façon arbitraire.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, un bouton hérite toujours de la grille du contenu qu'il accompagne, il ne flotte jamais de façon arbitraire.

RÈGLE [BUTTON-R59] : alignement — un bouton d'action lié à un bloc de contenu s'aligne sur la même grille que ce contenu, jamais centré "parce que ça fait plus propre".
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, un bouton lié à un bloc de contenu s'aligne sur la même grille que ce contenu, jamais centré par simple préférence esthétique.
MESURE : un bouton lié à un bloc de contenu est aligné sur la même grille que ce contenu, pas centré

RÈGLE [BUTTON-R60] : un seul bouton de soumission par formulaire.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, un formulaire ne doit jamais avoir plus d'un bouton de soumission.
MESURE : un formulaire ne contient qu'un seul bouton de soumission

> **Pourquoi** : deux boutons de validation de poids équivalent forcent un arbitrage que l'utilisateur ne devrait jamais avoir à faire.

RÈGLE [BUTTON-R61] : l'adaptation à l'espace suit `ADAPTIVE-UX.md` : un groupe de boutons peut s'empiler, se
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, un groupe de boutons peut se réorganiser selon la largeur de son conteneur, mais chaque bouton garde toujours la même action, le même style et le même niveau de friction.
MESURE : quelle que soit la disposition adoptée par un groupe de boutons, chaque bouton garde la même action, le même style, le même tone, le même nom accessible et le même niveau de friction
réorganiser ou regrouper ses actions secondaires selon la largeur de son **conteneur**. Le Button
conserve son action, son style, son tone, son nom accessible et son niveau de friction.

RÈGLE [BUTTON-R62] : le libellé visible d'une action n'est jamais tronqué automatiquement pour faire tenir le
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, le texte visible d'un bouton n'est jamais tronqué automatiquement ; il se replie sur plusieurs lignes si besoin plutôt que d'être coupé.
MESURE : le texte visible du bouton n'est jamais coupé par une ellipse automatique
Button. Quand l'espace manque, le texte peut se replier afin que la conséquence reste entièrement
lisible. Une formulation courte ne remplace le libellé courant que si cette alternative a été conçue
et validée ; elle n'est jamais inventée par le composant.

> **Pourquoi** : une ellipse masque précisément l'information qui permet à l'utilisateur de prévoir
> le résultat de son action. Un libellé qui occupe plusieurs lignes peut signaler un problème de
> wording, mais le masquer constitue un problème plus grave que l'augmentation ponctuelle de hauteur.

## Contextes d'intégration
Le rôle générique d'une combinaison (cf. sections précédentes) reste valable partout, mais chaque contexte ajoute ses propres contraintes.

### Dans un formulaire

RÈGLE [BUTTON-R63] : position en fin de flux, jamais en milieu de scroll pour un formulaire long.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, le bouton de soumission d'un formulaire se trouve toujours en fin de parcours, jamais au milieu d'un long formulaire qui défile.
MESURE : le bouton de soumission d'un formulaire long est positionné en fin de flux, pas au milieu du contenu défilant

RÈGLE [BUTTON-R64] : le label du bouton final doit refléter la conclusion réelle de l'action ("Confirmer mon inscription"), pas rester générique ("Suivant") sur la toute dernière étape.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, le libellé du bouton final d'un formulaire reflète la conclusion réelle de l'action plutôt que de rester générique sur la dernière étape.

RÈGLE [BUTTON-R65] : coordination avec la validation des champs — **autorité cédée à `FORM-UX.md`** (cession du 2026-07-03, requalifiée le 2026-07-28). La règle normative — bouton de soumission actif en permanence, validation au clic — sa mesure et ses sources sont portées par `FORM-R28` (et `FORM-R29` pour la seule désactivation légitime, le traitement asynchrone). Ce document n'en est plus le propriétaire.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : La règle du bouton de soumission actif en permanence appartient à FORM-UX (R28) ; ce document n'en est plus le propriétaire.

### Dans une table ou une liste (action rapide, souvent en icône)

RÈGLE [BUTTON-R66] : piège fréquent — afficher les icônes d'action uniquement au survol de la ligne (hover-only) : fonctionne sur desktop, rend l'action invisible et donc inaccessible sur tactile.
STATUT : propriété universelle
SOURCE : interne
ÉNONCÉ : Une action affichée uniquement au survol d'une ligne doit rester accessible sans survol, car les appareils tactiles n'ont pas de hover et l'action deviendrait inutilisable.
MESURE : les icônes d'action d'une ligne de table restent visibles ou accessibles sans nécessiter de survol

RÈGLE [BUTTON-R67] : une action destructive en icône reste destructive — la confirmation reste obligatoire, mais ne doit pas s'appliquer à *toutes* les icônes (une action "éditer" n'a pas besoin de la même friction).
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, une action destructive représentée par une simple icône reste soumise à confirmation obligatoire, contrairement à une icône d'action réversible.
MESURE : une icône d'action destructive déclenche toujours une confirmation avant exécution

### Dans une modale

RÈGLE [BUTTON-R68] : le bouton qui referme/valide la modale suit la convention de position définie une fois pour tout le produit — jamais réinventée modale par modale.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, la position du bouton qui referme ou valide une modale suit une convention unique définie pour tout le produit, jamais réinventée au cas par cas.
MESURE : la position du bouton principal d'une modale est identique sur toutes les modales du produit

RÈGLE [BUTTON-R69] : le bouton destructif d'une modale de confirmation ne doit jamais être le bouton par défaut activable au clavier par un simple "Entrée" réflexe.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, dans une modale de confirmation, le bouton destructif n'est jamais celui qui s'active par défaut avec la touche Entrée.
MESURE : dans une modale de confirmation destructive, le bouton par défaut activable à la touche Entrée n'est pas le bouton destructif

### Dans une carte (card)

RÈGLE [BUTTON-R70] : cardinalité et position des actions — régies par `content/md/components/CARD-UX.md` (section "Zone d'actions"), qui fait autorité. Ce fichier garde autorité sur le *choix* de chaque bouton (style, tone, taille) une fois son emplacement décidé par la carte. (Partage d'autorité : cf. DECISIONS.md.)
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Ce document précise que le nombre et la position des actions dans une carte relèvent d'un autre document, mais que le style de chaque bouton reste défini ici.

RÈGLE [BUTTON-R71] : espace contraint — rester lisible même en grille dense, sans réduire le padding sous le seuil de zone tactile (cf. BUTTON-UI.md).
STATUT : propriété universelle
SOURCE : interne
ÉNONCÉ : Un bouton en grille dense doit rester lisible sans que son padding ne descende sous le seuil minimal de zone tactile accessible.
MESURE : le padding du bouton ne descend jamais sous le seuil minimal de zone tactile, même en grille dense

### Dans une barre de navigation (header)

RÈGLE [BUTTON-R72] : le CTA de header reste visible au scroll ou se repositionne intelligemment plutôt que de disparaître.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, le bouton d'action du header reste visible au défilement ou se repositionne intelligemment, il ne disparaît jamais.
MESURE : le bouton d'action du header reste visible ou accessible pendant le défilement de la page

RÈGLE [BUTTON-R73] : un seul CTA primary dans le header — les autres liens de navigation restent des liens, pas des boutons.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, un header ne contient qu'un seul bouton d'action dominant ; les autres éléments de navigation restent des liens, pas des boutons.
MESURE : un seul bouton au rang dominant apparaît dans le header, les autres éléments de navigation sont des liens

### Pagination

RÈGLE [BUTTON-R74] : les états actif/inactif doivent être visuellement sans ambiguïté — la page courante n'est pas cliquable.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, dans une pagination, la page actuellement affichée n'est jamais cliquable et son état est visuellement sans ambiguïté.
MESURE : le bouton représentant la page courante dans une pagination n'est pas cliquable

RÈGLE [BUTTON-R75] : notion de progression explicite quand c'est pertinent (ex: "Page 3 sur 12").
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, une pagination affiche, quand c'est pertinent, une indication explicite de progression comme le numéro de page sur le total.

### Dans une bannière (cookies/consentement ou promotionnelle)

RÈGLE [BUTTON-R76] : consentement — **autorité cédée à `CONSENTEMENT-UX` le 2026-07-27**. La symétrie de poids visuel entre l'acceptation et le refus n'est pas une règle du bouton : c'est une contrainte du flow de consentement, qui s'impose au bouton. Elle est désormais portée par `CONSENTEMENT-R08` (UX) et `CONSENTEMENT-UI-R02` (tokens).
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : La règle de poids visuel équivalent des deux options d'un bandeau de consentement appartient à CONSENTEMENT-UX (R08) ; ce document n'en est plus le propriétaire.

> **Pourquoi ce déplacement** : rangée ici, la règle n'avait pas de place pour la question qui la
> précède — *faut-il un bandeau ?*. Un audit qui ne dispose que de R76 corrige la couleur d'un bouton
> sur un bandeau qui n'aurait pas dû exister. Quatrième cession d'autorité journalisée.
> Cf. DECISIONS.md 2026-07-27.

RÈGLE [BUTTON-R77] : promotionnelle — le bouton de fermeture doit rester une action facile et sans friction.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, le bouton de fermeture d'une bannière promotionnelle reste une action facile et sans friction.
MESURE : le bouton de fermeture d'une bannière promotionnelle est immédiatement accessible sans étape supplémentaire

### Bouton flottant (FAB, mobile)

RÈGLE [BUTTON-R78] : réserver une zone d'exclusion autour du FAB pour ne jamais masquer du contenu critique en dessous.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, un bouton d'action flottant réserve une zone d'exclusion autour de lui pour ne jamais masquer de contenu critique.
MESURE : une zone d'exclusion est réservée autour du bouton flottant pour ne masquer aucun contenu critique

RÈGLE [BUTTON-R79] : un seul FAB par écran.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, un écran ne doit jamais afficher plus d'un bouton d'action flottant à la fois.
MESURE : un seul bouton d'action flottant est présent par écran

> **Pourquoi** : sa force vient de sa rareté, comme le primary.

## États et comportement (le raisonnement — états techniques dans BUTTON-UI.md)

RÈGLE [BUTTON-R80] : le **disabled silencieux est proscrit** — toute désactivation doit exposer sa cause (tooltip, texte inline, ou changement visuel qui la rend déductible).
STATUT : parti pris d'identité
SOURCE : S2
ÉNONCÉ : Chez nous, un bouton désactivé ne doit jamais l'être silencieusement : la cause de la désactivation doit toujours être exposée à l'utilisateur.
MESURE : tout bouton désactivé expose la raison de sa désactivation via un texte, une infobulle ou un changement visuel explicite

RÈGLE [BUTTON-R81] : le **loading state** remplace le label par un indicateur de progression plutôt que de simplement griser le bouton.
STATUT : parti pris d'identité
SOURCE : S2
ÉNONCÉ : Chez nous, l'état de chargement d'un bouton remplace son libellé par un indicateur de progression, plutôt que de simplement le griser.
MESURE : l'état de chargement du bouton remplace le libellé par un indicateur de progression plutôt que de simplement le griser

> **Pourquoi** : réduit l'attente perçue sans changer le temps réel.

RÈGLE [BUTTON-R82] : sur mobile, l'absence de hover est compensée par un retour haptique léger au tap.
STATUT : parti pris d'identité
SOURCE : S2
ÉNONCÉ : Chez nous, sur mobile, l'absence de survol est compensée par un léger retour haptique au moment où l'utilisateur touche le bouton.

RÈGLE [BUTTON-R83] : ce retour haptique est **un supplément, jamais l'unique confirmation** — un appareil sans vibreur, ou un utilisateur qui l'a désactivé, ne perd aucune information : le changement d'état reste porté visuellement (et textuellement si nécessaire). C'est le principe « jamais un seul canal » appliqué à l'haptique (cf. ACCESSIBILITY-UX.md, propriétaire du contrat ; COLOR/MOTION pour les autres canaux).
STATUT : propriété universelle
SOURCE : S4
ÉNONCÉ : Le retour haptique d'un bouton ne doit jamais être l'unique confirmation d'une action : le changement d'état doit toujours rester perceptible visuellement.
MESURE : le changement d'état du bouton reste perceptible visuellement sans dépendre du retour haptique

RÈGLE [BUTTON-R84] : **une action grave ne se déclenche jamais au `pointerdown`** — elle part sur l'événement de relâche (`click` / `pointerup`), et un appui commencé sur le bouton puis relâché en dehors est **annulé** (WCAG 2.5.2, « Pointer Cancellation »). Le comportement natif de `<button>` le garantit ; le recréer sur un `div` avec un handler `pointerdown` le casse.
STATUT : propriété universelle
SOURCE : S3
ÉNONCÉ : Une action grave ne doit jamais se déclencher dès l'enfoncement du bouton : elle doit partir au relâchement, et un appui relâché en dehors du bouton doit être annulé.
MESURE : une action grave se déclenche à l'événement de relâche (click/pointerup), jamais à l'enfoncement (pointerdown), et un appui relâché en dehors du bouton est annulé

> **Pourquoi** : déclencher dès l'enfoncement retire à l'utilisateur moteur, tremblant ou distrait sa dernière chance de corriger un geste — d'autant plus coûteux sur une action destructive, où la réversibilité est nulle par définition.

RÈGLE [BUTTON-R85] : sur desktop, le hover est le principal signal d'affordance — il confirme avant le clic que l'élément est bien interactif.
STATUT : parti pris d'identité
SOURCE : S13
ÉNONCÉ : Chez nous, sur desktop, le survol du bouton est le principal signal confirmant qu'il est bien interactif avant le clic.
MESURE : un changement visuel perceptible se produit au survol du bouton sur desktop

> **Pourquoi** : un bouton sans changement visuel perceptible au survol laisse un doute, surtout sur les combinaisons discrètes (ghost).

RÈGLE [BUTTON-R86] : compte à rebours (action différée) — quand une action ne peut être réitérée qu'après un délai, le compte à rebours doit rester visible en continu sur le bouton lui-même.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, quand une action ne peut être réitérée qu'après un délai, le compte à rebours reste affiché en continu sur le bouton.
MESURE : le compte à rebours d'une action différée reste affiché en continu sur le bouton lui-même

CONFIANCE : établi — ces patterns sont largement observés en production (Stripe, Linear, GitHub) au-delà d'un cas isolé.

## Wording

RÈGLE [BUTTON-R87] : un verbe d'action qui décrit le bénéfice ou la conséquence bat systématiquement un label générique.
STATUT : parti pris d'identité
SOURCE : S1
ÉNONCÉ : Chez nous, un verbe d'action qui décrit le bénéfice ou la conséquence est préféré à un label générique comme valider ou OK.

> **Pourquoi** : "Submit", "OK", "Valider" ne disent rien du résultat ; "Créer mon compte", "Confirmer la commande" le disent.
> **Cas documenté** — Joshua Porter a mesuré qu'en renommant un bouton "Register" en "Continue", les ventes ont augmenté d'environ 45%, soit ~300M$ en rythme annuel pour le site concerné.

CONFIANCE : cas isolé — largement cité, non généralisable en coefficient.

RÈGLE [BUTTON-R88] : ce § Wording est **encadré par `VOICE-UX.md`** comme cadre unificateur — il en est même une
STATUT : propriété universelle
SOURCE : S14
ÉNONCÉ : Le texte d'un bouton doit rester compréhensible même hors contexte, et un même concept doit toujours porter le même mot partout dans le produit.
MESURE : le texte du bouton reste compréhensible hors de tout contexte environnant, et un même concept est toujours désigné par le même mot dans toute l'interface
**source nommée** (`VOICE-UX.md` renvoie explicitement à « BUTTON-UX § Wording »). En héritent trois
contraintes non négociables : *un verbe qui décrit la conséquence bat un label générique* ; le **texte
de bouton se suffit hors contexte** et dit ce qu'il fait (texte signifiant, WCAG 2.4.4) ; **un concept =
un mot** partout (« Supprimer » ne devient pas « Effacer » puis « Retirer » selon l'écran).

RÈGLE [BUTTON-R89] : le label du **submit** peut se **réchauffer d'un seul cran** — et uniquement là — sur le moment
STATUT : parti pris d'identité
SOURCE : S14
ÉNONCÉ : Chez nous, le ton du bouton de soumission ne se réchauffe que sur le moment précis de succès d'un envoi catalogué ; partout ailleurs il reste factuel.
MESURE : en dehors du moment de succès d'envoi catalogué, le libellé du bouton ne contient ni emoji ni point d'exclamation
E-motion **catalogué** (« C'est parti ✈️ » plutôt que « Envoyé »), au titre de l'exception cadrée de
`VOICE-UX.md` § Exception E-motion. Hors de ce moment mérité, le registre reste **productif** : pas
d'emoji, pas de « ! », pas de sur-célébration — l'exception ne s'étend **jamais** à une erreur, à une
action destructive ni à une action fréquente ou réflexe.

> **Pourquoi** : le réchauffement est une **exception bornée**, pas un registre — il ne vit que sur un
> moment du catalogue E-motion (§ Instrument E-motion) et sous son budget de rareté ; partout ailleurs,
> le wording reste factuel.

## Forme et contenu (raisonnement — spacing exact dans BUTTON-UI.md)

**Texte seul** : le cas le plus simple et le plus fréquent — toute la charge de clarté repose sur le wording.

RÈGLE [BUTTON-R90] : l'emplacement de l'icône est un axe à cinq valeurs — **none** (texte seul), **leading** (icône en tête), **trailing** (icône en fin), **both** (une icône de chaque côté), **only** (icône seule, sans texte). C'est le même axe côté code (playground) et côté Figma (propriété d'instance).
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, la position de l'icône d'un bouton est l'une de cinq valeurs possibles : aucune, en tête, en fin, des deux côtés, ou icône seule.
MESURE : la position de l'icône du bouton correspond à l'une de cinq valeurs : aucune, en tête, en fin, des deux côtés, ou icône seule

RÈGLE [BUTTON-R91] : icône seule (**only**) — pas de label visible, donc **aria-label obligatoire sans exception** (cf. BUTTON-UI.md), et le bouton devient **carré** (largeur = hauteur, padding égal). Pour un usage récurrent en espace très contraint, préférer le composant CompactButton dédié.
STATUT : propriété universelle
SOURCE : interne
ÉNONCÉ : Un bouton qui n'affiche qu'une icône, sans texte visible, doit toujours porter un nom accessible, sans aucune exception.
MESURE : un bouton n'affichant qu'une icône, sans texte visible, possède toujours un nom accessible (aria-label)

RÈGLE [BUTTON-R92] : icône + texte (**leading** / **trailing**) — l'ordre suit le sens de lecture et l'intention : icône en tête (leading) pour une action de navigation ou de catégorisation ; icône en fin (trailing) pour une action de progression ou d'ouverture.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, l'icône se place en tête du texte pour une action de navigation, et en fin de texte pour une action de progression ou d'ouverture.

RÈGLE [BUTTON-R93] : **both** — une icône de part et d'autre du label (ex : sélecteur « ‹ Précédent … Suivant › » dans un même bouton) ; réservé aux cas où les deux directions portent réellement du sens, sinon c'est du bruit visuel.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, une icône de chaque côté du texte n'est utilisée que lorsque les deux directions portent réellement du sens.

> **Pourquoi** : un ordre incohérent d'un bouton à l'autre brouille ce signal directionnel.

RÈGLE [BUTTON-R94] : badge / compteur (ex: "Panier (3)") — ne doit jamais nuire à la lisibilité du label principal : c'est une information d'état, pas une seconde action cliquable.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, un badge ou compteur affiché sur un bouton est une simple information d'état, jamais une seconde action cliquable.
MESURE : le badge ou compteur affiché sur un bouton n'est pas un élément cliquable indépendant

RÈGLE [BUTTON-R95] : avatar / image (ex: connexion sociale) — les contraintes de la marque tierce priment sur le design system interne pour ce cas précis : exception documentée, pas un override arbitraire.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, un bouton de connexion sociale suit les contraintes de la marque tierce plutôt que le design system interne, à titre d'exception documentée.

## Risque par combinaison

RÈGLE [BUTTON-R96] : table ci-dessous
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Ce document présente sous forme de tableau le risque principal, sa sévérité et sa réversibilité pour chaque combinaison de style et de tone du bouton.

| Style + Tone | Risque principal | Sévérité | Réversibilité |
|---|---|---|---|
| filled + primary (conversion) | Perte de conversion si wording/état mal géré | Élevée | Facile à corriger, sessions perdues non récupérables |
| filled/ghost + destructive | Perte de données, confiance utilisateur | Critique | Nulle par définition — le design doit compenser |
| ghost + destructive (icône table/liste) | Exclusion accessibilité en plus du risque destructive | Critique | Nulle pour l'action, triviale pour la correction du bouton lui-même |
| Désactivé sans cause (tout style) | Confusion, abandon silencieux | Moyenne | Facile à corriger, invisible dans les rapports de bug classiques |
| filled/stroke + neutral (engagement financier) | Double soumission, perte de confiance si mal confirmé | Critique | Nulle en cas de double débit — dépend d'un remboursement manuel |

## Règle transversale

RÈGLE [BUTTON-R97] : **la friction doit être proportionnelle au risque réel de l'action, jamais uniforme.**
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, le niveau de friction d'un bouton doit toujours être proportionnel au risque réel de l'action, jamais appliqué de façon uniforme.

> **Pourquoi** : un bouton primary d'ajout au panier ne mérite pas la même charge de confirmation qu'un bouton de suppression de compte — appliquer le même niveau de friction partout use la vigilance de l'utilisateur là où elle compte vraiment.

## Sources et niveau de confiance (couche UX)
| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| S1 | Wording "Register" → "Continue", +45% ventes (~300M$) | Joshua Porter, étude de cas UIE | Cas isolé, largement cité, non généralisable en coefficient |
| S2 | Patterns disabled/loading/haptique mobile | Observation production (Stripe, Linear, GitHub) | Établi par convergence, non académique |
| S3 | Annulation du pointeur : action à la relâche, annulable (2.5.2) | [WCAG 2.1 — 2.5.2 Pointer Cancellation](https://www.w3.org/WAI/WCAG21/Understanding/pointer-cancellation.html) | Établi, standard d'accessibilité |
| S4 | Haptique jamais unique canal de feedback | WCAG 4.1.2 / 1.3.3 — principe des canaux (cf. ACCESSIBILITY-UX.md) | Établi — transposition interne du principe des canaux |
| S5 | Dark pattern sur bannières de consentement (poids visuel inégal) | Littérature UX/éthique du design, largement documentée | Établi |
| S6 | Ordre des boutons en modale (convention culturelle) | Observation cross-plateforme (macOS, web) | Établi comme divergence documentée, pas de règle universelle |
| S7 | Confirmation différée (délai 2-3s / type-to-confirm) | Observation production (GitHub, Stripe) | Pattern répandu, non quantifié académiquement |
| S8 | Distinction Warning vs Destructive (statut propre) | Observation patterns mobile (menus d'action) | Non formalisée dans la littérature de design system grand public |
| S9 | Critère de décision à 3 paliers (coût de recréation de la donnée) | IBM Carbon, pattern "Delete/Remove" documenté | Établi — pattern explicitement documenté, pas une déduction |
| S10 | SubmitButton « avion en papier » = premier citoyen / gabarit d'E-motion (moment « réussite d'un envoi ») | `EMOTION-UX.md` § Gouvernance / catalogue | Établi — déjà tranché, moment catalogué |
| S11 | « Un événement, un porteur » (bouton en place OU toast injecté, jamais les deux) | Arbitrage utilisateur 2026-07-21 ; cohérent avec le budget de rareté E-motion | Décision d'identité interne, non re-sourcée en externe |
| S12 | Contrat de repli + budget de rareté E-motion (reduced-motion, action réflexe exclue) | `EMOTION-UX.md` § Contrat de repli / loi cardinale (WCAG 2.3.3, 1.4.13) | Établi — hérité, standard d'accessibilité |
| S13 | Hover = feedback (fast/ease-out), transition interruptible, spinner seule exception au linéaire | `MOTION-UX.md` § Feedback / Interruption / courbes (Carbon, Polaris) | Établi — consensus fort |
| S14 | Cadre unificateur du wording (conséquence, WCAG 2.4.4, un concept = un mot) + exception E-motion bornée | `VOICE-UX.md` § Texte signifiant / § Exception E-motion | Établi (WCAG 2.4.4) ; exception bornée = décision interne |
| S15 | DeleteButton « froissage » — point ouvert non tranché | `EMOTION-UX.md` § À approfondir ; DECISIONS.md 2026-07-20 | Point ouvert — remonté, pas résolu |

*Toute règle de cette couche sans source explicite ci-dessus repose sur un raisonnement de mécanisme (ergonomie, charge cognitive) plutôt que sur une étude chiffrée.*

## À approfondir (hors scope de cette version)
- Extension aux flows multi-écrans impliquant plusieurs boutons en séquence (prochaine étape du projet, une fois le composant bouton stabilisé)
