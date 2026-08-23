---
component: performance
layer: ux
type: principle
version: 1.0.1 # 1.0.1 : chemins repointés vers `content/md/` — fin de la migration vers le monorepo Sibyl DS (2026-07-27) ; aucune règle, aucun token, aucune source modifiés. 1.0.0 : première rédaction — le contrat des attentes, pendant temporel de cognitive-load. Inventaire transversal et benchmark faits AVANT livraison. Arbitrages du 2026-07-21 (cf. DECISIONS.md) : socle universel (5e RULES), seuils en prose (aucun token), anti-scintillement non chiffré jusqu'au premier consommateur outillé, nom « performance ».
last_updated: 2026-07-21
companion: none # principe UX-only pressenti, sur le modèle d'accessibility/cognitive-load : aucune valeur visuelle ni token propre — les mécaniques d'attente vivent chez leurs propriétaires (FORM, BUTTON, INPUT, CARD, COLLECTION, MOTION)
confidence: mixed # les seuils de réponse (0,1 s / 1 s / 10 s, NN/g) et la borne ~400 ms (Doherty, via le catalogue laws) sont établis ; l'interdit de l'attente artificielle va CONTRE une littérature documentée (labor illusion) — position interne assumée, marquée comme telle ; le délai anti-scintillement est une convergence non chiffrée
---

# Performance perçue — Couche UX (principe transversal)

> Ce fichier pose le **contrat des attentes** : ce que l'interface montre, dit et promet pendant que le système travaille. La vitesse *réelle* est une affaire d'ingénierie (poids, réseau, calcul) — hors périmètre ; la vitesse *perçue* est une affaire de design, et c'est elle que l'utilisateur vit. Le système possède déjà les morceaux (bornes d'animation chez `MOTION`, cycle de soumission chez `FORM`, squelette chez `CARD`, attente par champ chez `INPUT`) ; personne ne possédait le contrat transversal — quel feedback à quel délai, quand l'optimisme est permis, ce que l'honnêteté interdit. Comme `cognitive-load` face au catalogue des lois : ce principe contraint, cite, renvoie — il ne réécrit aucune mécanique. Source du besoin : `content/md/inventaires/inventaire-cas-usage-performance.md` (audit transversal du 2026-07-21).

## Note de transposition (à lire en premier)

RÈGLE [PERFORMANCE-R01] : la performance perçue est un **principe transversal** — ni variantes, ni assemblage, ni token ; le modèle à axes ne s'applique pas. Comme `accessibility` et `cognitive-load` : `companion: none` **sans** `audience: humans` — compilé vers `dist/RULES-performance.md` et **chargé d'office par le routeur pour toute intention** (5e RULES du socle universel, arbitré le 2026-07-21 — toute intention charge et attend ; le coût du socle est mesuré à chaque build et sa clause de réouverture est déjà journalisée chez cognitive-load).
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Le principe de performance perçue est un principe transversal sans variantes, sans assemblage et sans token propre : il est compilé en un jeu de règles unique et chargé d'office par le routeur pour toute intention.
MESURE : compilé vers dist/RULES-performance.md et présent dans le socle chargé pour toute intention

RÈGLE [PERFORMANCE-R02] : **frontière avec `motion`** — `MOTION` possède les durées et courbes des **animations** (ce qui bouge) ; ce principe possède le contrat des **attentes** (ce qu'on montre pendant que le système travaille). Les deux se rejoignent sur une conviction : tout le registre productif vit sous ~400 ms — mais une transition de 200 ms et une réponse serveur de 4 s sont deux problèmes différents, avec deux propriétaires.
STATUT : note de méthode
SOURCE : S2, interne
ÉNONCÉ : Les durées et les courbes des animations appartiennent à la fondation motion ; le contrat des attentes — ce que l'interface montre et promet pendant que le système travaille — appartient à ce principe, et une transition n'est jamais traitée comme une attente.

RÈGLE [PERFORMANCE-R03] : **aucun token nouveau.** Les seuils de ce fichier (~0,1 s / ~1 s / ~10 s) sont des **bornes de raisonnement sourcées**, pas des valeurs de design à thématiser — on ne re-thème pas la psychophysique. Ils restent en prose, comme la fourchette 45-75 caractères avant que `measure` n'ait un consommateur — position arbitrée le 2026-07-21, à revoir uniquement si un consommateur outillé (harness, lint) réclame des valeurs machine (cf. À approfondir).
STATUT : note de méthode
SOURCE : S1, S8, S9, interne
ÉNONCÉ : Les seuils de perception temporelle restent des bornes de raisonnement rédigées en prose sourcée et ne donnent lieu à aucun token tant qu'aucun consommateur outillé ne les réclame.
MESURE : aucun token de seuil temporel déclaré au titre de ce principe

RÈGLE [PERFORMANCE-R04] : ce principe **ne fait pas autorité sur un comportement précis** — il pose l'obligation, le propriétaire pose la mécanique (`FORM` pour le cycle de soumission et ses timeouts, `BUTTON` pour l'état loading, `INPUT` pour l'attente par champ, `CARD`/`COLLECTION` pour les squelettes). En cas de divergence, le propriétaire a raison.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Ce principe pose l'obligation et non la mécanique : chaque comportement d'attente est réglé par le composant qui le possède, et en cas de divergence le propriétaire fait autorité.

RÈGLE [PERFORMANCE-R05] : **la perception ne remplace pas la vitesse.** Un squelette ne répare pas dix secondes. Si une attente dépasse régulièrement ses bornes, la réponse est l'ingénierie ou la conception du parcours — pas un indicateur de plus. Ce constat se **remonte**, il ne se maquille pas.
STATUT : note de méthode
SOURCE : S1, interne
ÉNONCÉ : La perception ne remplace jamais la vitesse réelle : quand une attente dépasse régulièrement ses bornes, le constat se remonte comme un problème d'ingénierie ou de conception du parcours au lieu d'être absorbé par un indicateur supplémentaire.

## Le contrat — obligations universelles

### 1. L'échelle de l'attente — quel feedback à quel délai

RÈGLE [PERFORMANCE-R06] : sous **~100 ms**, aucun indicateur d'attente — le feedback d'activation suffit (press du `BUTTON`, focus du champ). Un spinner pour un aller-retour instantané *fabrique* de la lenteur perçue.
STATUT : propriété universelle
SOURCE : S1, S8
ÉNONCÉ : Une réponse obtenue en moins de 100 ms n'affiche aucun indicateur d'attente : le feedback d'activation du contrôle suffit, et tout indicateur y fabrique de la lenteur perçue.
MESURE : aucun indicateur d'attente rendu pour une opération résolue en moins de 100 ms

RÈGLE [PERFORMANCE-R07] : entre **~100 ms et ~1 s**, l'attente se porte **localement** — l'élément qui a déclenché change d'état (bouton en loading, champ en validation) ; pas d'indicateur global, pas de blocage d'écran. Le flux de pensée n'est pas rompu (NN/g : 1 s est la limite du flux ininterrompu).
STATUT : parti pris d'identité
SOURCE : S1, S9, interne
ÉNONCÉ : Entre 100 ms et 1 s, l'attente se signale localement par un changement d'état du seul élément déclencheur, sans indicateur global ni blocage d'écran.
MESURE : attente inférieure à 1 s : indicateur porté par le contrôle déclencheur, aucun overlay ni indicateur de page

RÈGLE [PERFORMANCE-R08] : au-delà de **~1 s**, l'attente est **visible et annoncée** — indicateur perceptible ET annonce aux technologies d'assistance (un spinner seul n'annonce rien — la mécanique `aria-live` vit chez `FORM`/`INPUT`). L'interface dit *que* ça travaille, et reste utilisable partout où l'attente ne bloque pas réellement.
STATUT : propriété universelle
SOURCE : S1, S3, S10
ÉNONCÉ : Toute attente dépassant 1 s est rendue perceptible visuellement et annoncée aux technologies d'assistance par un message d'état programmatiquement déterminable sans prise de focus, l'interface restant utilisable partout où l'attente ne bloque pas réellement.
MESURE : attente > 1 s : indicateur visible ET message d'état exposé via role="status" ou aria-live, sans déplacement du focus

RÈGLE [PERFORMANCE-R09] : au-delà de **~10 s** — ou dès que la durée est longue et inconnue — l'attente devient un **état à part entière** : progression réelle ou estimation honnête, possibilité de continuer autre chose quand c'est techniquement vrai, et un **timeout toujours défini** (jamais d'attente infinie silencieuse — le cycle de `FORM` fait autorité sur la reprise).
STATUT : propriété universelle
SOURCE : S1, S3, S11
ÉNONCÉ : Au-delà de 10 s, ou dès que la durée est longue et inconnue, l'attente devient un état à part entière portant une progression réelle ou une estimation honnête, la possibilité de poursuivre une autre tâche quand c'est techniquement vrai, et un délai d'expiration toujours défini.
MESURE : attente supérieure ou égale à 10 s : indicateur de progression déterminé si l'avancement est mesurable, et délai d'expiration explicite ; aucune attente sans borne de temps

CONFIANCE : établi — les trois seuils fondateurs (0,1 / 1 / 10 s) sont la littérature de référence (NN/g, Response Times), convergente avec Doherty (~400 ms, via le catalogue `laws`). Le placement exact d'un cas limite reste un jugement — au doute, traiter l'attente comme plus longue, jamais comme plus courte.

### 2. Anti-scintillement — un indicateur qui clignote est pire que l'attente

RÈGLE [PERFORMANCE-R10] : un indicateur d'attente **n'apparaît pas immédiatement** — il attend un court délai (l'ordre de quelques centaines de ms) pour laisser les réponses rapides passer sans bruit ; et **une fois montré, il reste un minimum perceptible** — un squelette qui flashe 80 ms est un défaut, pas un feedback.
STATUT : propriété universelle
SOURCE : S7, interne
ÉNONCÉ : Un indicateur d'attente n'apparaît pas au premier instant : il est différé d'un court délai afin de laisser passer sans bruit les réponses rapides, et reste affiché une durée minimale perceptible une fois montré.
MESURE : tout indicateur d'attente déclare un délai d'apparition non nul et une durée d'affichage minimale ; aucun cycle apparition-disparition sous le seuil de perception

> **Pourquoi** : l'indicateur est un *aveu* d'attente. L'afficher pour une réponse quasi instantanée transforme un système rapide en système qui a l'air lent ; le faire clignoter transforme l'attente en instabilité.

CONFIANCE : convergence — pattern documenté chez plusieurs systèmes de production (délai d'apparition des busy indicators) ; aucune valeur canonique interne tant qu'un consommateur réel n'existe pas — position arbitrée le 2026-07-21 : chiffrer sans besoin réel serait le travers que « un token naît d'un besoin réel » interdit.

### 3. Ordre d'apparition — l'utile d'abord, et rien ne bouge après coup

RÈGLE [PERFORMANCE-R11] : ce qui permet de **décider ou d'agir arrive en premier** — le contenu principal avant l'accessoire, la structure avant le détail. Le squelette est une **promesse de structure** (anatomie chez `CARD`, stabilité de grille chez `COLLECTION`) : il promet exactement ce qui va arriver, là où ça va arriver.
STATUT : parti pris d'identité
SOURCE : S6, interne
ÉNONCÉ : Ce qui permet de décider ou d'agir s'affiche en premier — le contenu principal avant l'accessoire, la structure avant le détail — et le squelette de chargement promet exactement la structure qui va arriver, à l'endroit où elle arrivera.
MESURE : le squelette reprend l'anatomie et l'emplacement du contenu final ; aucun élément accessoire rendu avant le contenu principal

RÈGLE [PERFORMANCE-R12] : **rien ne se déplace après coup** — un contenu qui arrive tard ne pousse pas ce que l'utilisateur lit et ne vole jamais le geste engagé (le clic parti vers un bouton qui s'est décalé). L'espace du tardif est réservé d'avance ou son arrivée est neutre pour la mise en page. Généralisation d'écran de la règle `COLLECTION` (« la grille ne saute pas ») et cousine du « le contenu ne se déplace jamais sans action » de `SPACING`/`MOTION`.
STATUT : propriété universelle
SOURCE : S6, S12
ÉNONCÉ : Un contenu qui arrive tardivement ne déplace jamais ce qui est déjà affiché : son espace est réservé d'avance ou son arrivée est neutre pour la mise en page, afin qu'aucune lecture ne soit perdue et qu'aucun geste déjà engagé ne soit détourné.
MESURE : CLS inférieur ou égal à 0,1 au 75e centile ; aucun décalage de mise en page non consécutif à une action de l'utilisateur

CONFIANCE : établi par convergence — la stabilité visuelle est documentée jusque dans les métriques du web (layout shift) ; l'obligation d'écran posée ici est la généralisation des règles locales existantes.

### 4. UI optimiste — la confiance se mérite

RÈGLE [PERFORMANCE-R13] : une interface peut **afficher le succès avant la confirmation serveur** à trois conditions cumulées : l'action est **réversible ou rejouable sans dommage**, son succès est **très probable**, et l'échec éventuel sera **réparé visiblement** (l'élément revient, l'écart est expliqué, rien ne se perd en silence — la reprise vit chez `FORM`, erreurs serveur).
STATUT : parti pris d'identité
SOURCE : S4, interne
ÉNONCÉ : Une interface ne peut afficher le succès avant confirmation du serveur qu'à trois conditions cumulées : l'action est réversible ou rejouable sans dommage, son succès est très probable, et tout échec éventuel est réparé visiblement.
MESURE : tout affichage optimiste documente les trois conditions et un chemin de réparation visible en cas d'échec

RÈGLE [PERFORMANCE-R14] : l'optimisme est **interdit** sur l'irréversible, le paiement, l'engagement légal et tout ce dont l'échec coûterait plus que l'attente économisée — ces actions attendent leur confirmation réelle (cohérent avec `cognitive-load` : la confirmation est réservée à ce qui la mérite, et « Annuler » est une promesse tenue).
STATUT : parti pris d'identité
SOURCE : S4, interne
ÉNONCÉ : L'affichage optimiste est interdit sur les actions irréversibles, les paiements, les engagements juridiques et toute action dont l'échec coûterait plus que l'attente économisée : ces actions attendent leur confirmation réelle.
MESURE : aucun rendu optimiste sur une action irréversible, un paiement ou un engagement juridique

RÈGLE [PERFORMANCE-R15] : un succès optimiste **reste un état en cours** pour le système — jamais re-présenté comme définitif à un endroit où l'utilisateur prendrait sur lui une décision irréversible fondée sur un état non confirmé.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Un succès affiché de façon optimiste reste, pour le système, un état en cours : il n'est jamais re-présenté comme définitif à un endroit où l'utilisateur fonderait sur lui une décision irréversible.
MESURE : aucun état optimiste non confirmé utilisé comme condition d'une action irréversible

CONFIANCE : convergence — l'UI optimiste est un pattern documenté (littérature d'interface, production : messageries, likes, listes) ; ses conditions exactes sont une position du système, alignée sur la réversibilité de `cognitive-load`.

### 5. Honnêteté de l'attente — le temps ne se met pas en scène

RÈGLE [PERFORMANCE-R16] : **jamais de fausse progression** — pas de barre qui avance sans lien avec le travail réel, pas d'étapes gonflées pour faire vivre une jauge (la frontière Goal-Gradient du catalogue `laws` devient ici un interdit opérationnel). Barre **déterminée** si l'avancement est mesurable, **indéterminée** sinon — et une estimation ne s'affiche que si elle est honnête.
STATUT : propriété universelle
SOURCE : S3, interne
ÉNONCÉ : Aucune progression affichée n'est déconnectée du travail réel : la barre est déterminée quand l'avancement est mesurable, indéterminée sinon, aucune étape n'est ajoutée au seul bénéfice de l'affichage, et une estimation de durée ne s'affiche que si elle est honnête.
MESURE : tout indicateur déterminé est piloté par un avancement réellement mesuré ; aucune étape présente uniquement pour alimenter la jauge

RÈGLE [PERFORMANCE-R17] : **jamais d'attente artificielle.** Si le système peut répondre instantanément, il répond instantanément — on ne ralentit pas « pour montrer le travail ». La labor illusion (l'attente mise en scène augmente la confiance perçue) est documentée : ce système choisit de **ne pas l'exploiter** — même famille de refus que les dark patterns de `cognitive-load`.
STATUT : parti pris d'identité
SOURCE : S5, interne
ÉNONCÉ : Aucune attente n'est fabriquée : quand le système peut répondre instantanément, il répond instantanément, et la mise en scène du travail n'est jamais employée pour augmenter la valeur perçue.
MESURE : aucun délai artificiel introduit entre la disponibilité de la réponse et son affichage

RÈGLE [PERFORMANCE-R18] : une attente qui **s'éternise l'avoue** — au-delà du raisonnable, l'interface le dit (« plus long que prévu ») et donne une issue (réessayer, continuer ailleurs, être prévenu) plutôt que de laisser un indicateur tourner à vide.
STATUT : parti pris d'identité
SOURCE : S1, S3, interne
ÉNONCÉ : Une attente qui dépasse la durée attendue le dit explicitement à l'utilisateur et lui ouvre une issue — réessayer, poursuivre ailleurs, être prévenu — plutôt que de laisser un indicateur tourner sans fin.
MESURE : tout état d'attente prolongée expose un message d'anomalie et au moins une action de sortie

CONFIANCE : établi pour la réfutation de la fausse progression (frontière du catalogue) ; l'interdit de l'attente artificielle est une **règle interne renforcée** qui va contre une littérature réelle (Buell & Norton, labor illusion) — position d'honnêteté assumée, marquée comme telle.

## Ce que ce principe ne fait pas

RÈGLE [PERFORMANCE-R19] : il ne mesure pas la performance réelle, ne fixe aucun budget technique, n'ajoute aucun token, et ne possède aucune mécanique d'attente — table de renvois ci-dessous. Quand la vitesse réelle est le problème, il l'expose et **remonte**.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Ce principe ne mesure pas la performance réelle, ne fixe aucun budget technique, n'ajoute aucun token et ne possède aucune mécanique d'attente : il renvoie à ses propriétaires et remonte les cas où la vitesse réelle est le problème.

## Renvois vers les propriétaires (aucune valeur ici)

| Obligation | Propriétaire normatif |
|---|---|
| État loading du déclencheur, press, anti-double-clic | `RULES-button` |
| Cycle de soumission, timeout, annonce > seuil, reprise après échec | `RULES-form` (+ `RULES-form-server-errors`) |
| Attente par champ (validation asynchrone) | `RULES-input`, `RULES-form-async-validation` |
| Anatomie du squelette, rien n'anime au chargement | `RULES-card` |
| Squelettes stables, croissance, échec de page suivante | `RULES-collection` |
| Durées/courbes des animations, pulse sous reduced-motion, spinner | `RULES-motion` |
| Mots de l'attente (« Envoi en cours… », « plus long que prévu ») | `RULES-voice` |
| Réversibilité, « Annuler » = promesse tenue | `RULES-cognitive-load` |
| Limites de temps contrôlables, conservation des données | `RULES-accessibility` |

## Tensions connues (à rendre visibles, jamais à trancher seul)

| Tension | Les deux forces | Arbitrage |
|---|---|---|
| Feedback ↔ bruit | Ne rien montrer inquiète ; montrer trop tôt fabrique de la lenteur | L'échelle du § 1 + l'anti-scintillement du § 2 |
| Optimisme ↔ honnêteté | Le succès anticipé fluidifie ; l'échec non réparé trahit | Les trois conditions du § 4 — au doute, attendre |
| Occuper ↔ mettre en scène | Le squelette rend l'attente lisible ; l'attente fabriquée ment | Occuper une attente réelle : oui ; en créer une : jamais |
| Perception ↔ vitesse réelle | Le design absorbe l'attente ; il ne la résout pas | Au-delà des bornes récurrentes : remonter, pas maquiller |

## Risque

| Cas | Risque principal | Sévérité |
|---|---|---|
| Optimisme sur l'irréversible (paiement, suppression) | Perte réelle présentée comme succès | Élevée |
| Fausse progression, étapes gonflées | Confiance détruite quand le mensonge se voit | Élevée |
| Attente > 1 s sans annonce (spinner muet) | Lecteur d'écran sans feedback, double soumission | Élevée |
| Contenu tardif qui déplace la page | Clic volé, lecture perdue | Moyenne à élevée |
| Indicateur instantané sur réponse rapide | Système rapide perçu comme lent | Moyenne |
| Échec post-optimisme réparé en silence | Donnée perdue sans que personne ne le sache | Élevée |
| Attente artificielle « pour faire sérieux » | Temps volé — et le jour où ça se sait, tout le reste devient suspect | Moyenne à élevée |

## Règle transversale

RÈGLE [PERFORMANCE-R20] : **le temps de l'utilisateur est la ressource la plus chère que le produit dépense.** Chaque attente est un emprunt : le contrat de ce principe — feedback au bon seuil, structure stable, optimisme mérité, honnêteté totale — est la façon de le rembourser. Une interface qui respecte le temps n'a presque jamais besoin de le mettre en scène.
STATUT : parti pris d'identité
SOURCE : S2, interne
ÉNONCÉ : Le temps de l'utilisateur est traité comme la ressource la plus chère que le produit dépense : chaque attente est un emprunt remboursé par un feedback au bon seuil, une structure stable, un optimisme mérité et une honnêteté totale, jamais par une mise en scène.

## Sources et niveau de confiance

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| S1 | Trois seuils de réponse : ~0,1 s (instantané), ~1 s (flux de pensée), ~10 s (limite d'attention) | [NN/g — Response Times: The 3 Important Limits](https://www.nngroup.com/articles/response-times-3-important-limits/) | Établi — littérature fondatrice, déjà citée par MOTION |
| S2 | ~400 ms : seuil d'engagement (Doherty) | via `LAWS-UX.md` (le catalogue fait autorité sur la loi) | Établi |
| S3 | Indicateurs de progression : percent-done si mesurable, sinon indéterminé ; feedback obligatoire au-delà du seuil | [NN/g — Progress Indicators](https://www.nngroup.com/articles/progress-indicators/) | Établi |
| S4 | UI optimiste : afficher le succès probable avant confirmation, réparer visiblement l'échec | [Smashing Magazine — Optimistic UI (Mishunov)](https://www.smashingmagazine.com/2016/11/true-lies-of-optimistic-user-interfaces/) ; production (messageries, réactions) | Convergence — conditions exactes = position interne |
| S5 | Labor illusion : l'attente mise en scène peut augmenter la valeur perçue — documentée ET refusée ici | Buell & Norton (2011), *The Labor Illusion* (Management Science) | Établi (l'effet) ; le refus de l'exploiter est une règle interne renforcée |
| S6 | Stabilité visuelle (le contenu tardif ne déplace pas la page) | Convergence web (métriques de layout shift) ; règles internes SPACING/MOTION/COLLECTION généralisées | Établi par convergence |
| S7 | Délai d'apparition + durée minimale d'un indicateur (anti-scintillement) | Convergence de production (busy indicators différés) | Convergence — non chiffré en interne, cf. arbitrage n°3 |
| S8 | Source primaire des seuils de réponse : Miller établit les paliers de temps de réponse acceptables dans les transactions conversationnelles homme-machine, dont le seuil de réaction perçue comme immédiate. | [Robert B. Miller — Response Time in Man-Computer Conversational Transactions, *Proc. AFIPS Fall Joint Computer Conference* vol. 33, 1968, p. 267-277](https://dl.acm.org/doi/10.1145/1476589.1476628) | Établi — source primaire, relevée dans la section Références de S1 (URL ACM DOI ; le serveur ACM renvoie 403 aux robots, la référence bibliographique fait foi) |
| S9 | Source primaire du seuil du flux de pensée (1 s) et des constantes temporelles de l'interaction, reprises ensuite par la littérature de vulgarisation. | [S. K. Card, G. G. Robertson & J. D. Mackinlay — The Information Visualizer, an Information Workspace, *Proc. ACM CHI'91*, p. 181-188](https://dl.acm.org/doi/10.1145/108844.108874) | Établi — source primaire, relevée dans la section Références de S1 (URL ACM DOI ; le serveur ACM renvoie 403 aux robots, la référence bibliographique fait foi) |
| S10 | Les messages d'état doivent être programmatiquement déterminables par un rôle ou une propriété, afin d'être présentés par les technologies d'assistance SANS recevoir le focus. La définition normative de « status message » couvre explicitement « l'état d'attente d'une application » et « la progression d'un processus » (Situation C des techniques suffisantes). | [WCAG 2.2 — 4.1.3 Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) | Établi — standard d'accessibilité (niveau AA), couvrant nommément l'attente et la progression |
| S11 | Toute limite de temps posée par le contenu doit pouvoir être désactivée, ajustée sur au moins dix fois sa durée par défaut, ou prolongée après un avertissement laissant au moins 20 s pour agir. Exceptions : événements en temps réel, contrainte essentielle, limite supérieure à 20 heures. | [WCAG 2.2 — 2.2.1 Timing Adjustable](https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html) | Établi — standard d'accessibilité (niveau A) ; encadre l'obligation de timeout défini |
| S12 | Seuils « bons » en vigueur des Core Web Vitals, mesurés au 75e centile : LCP inférieur ou égal à 2,5 s, INP inférieur ou égal à 200 ms, CLS inférieur ou égal à 0,1. INP est devenu Core Web Vital stable en 2024, en remplacement de First Input Delay (FID) — toute règle encore adossée au FID est périmée. | [web.dev — Web Vitals](https://web.dev/articles/vitals) | Établi — métriques publiées avec seuils chiffrés et versionnés |
| S13 | INP évalue la réactivité de l'interaction sur toute la vie de la page ; une valeur inférieure ou égale à 200 ms vaut « bonne réactivité ». Le navigateur restitue un retour visuel à la frame suivante, et fournir vite ce retour visuel — même pour une interaction complexe — évite que la page soit perçue comme non réactive. | [web.dev — Interaction to Next Paint (INP)](https://web.dev/articles/inp) | Établi — métrique publiée ; borne haute chiffrée du registre « feedback local » du § 1 |

CONFIANCE : les seuils et la doctrine des indicateurs sont établis ; les conditions de l'UI optimiste et l'interdit de l'attente artificielle sont des **positions du système**, identifiées comme telles (la seconde va sciemment contre la labor illusion). Toute obligation en conflit apparent avec une mécanique propriétaire : le propriétaire tranche — STOP, remonter si l'ambiguïté persiste.

## À approfondir

- **Composant de progression** : la barre déterminée (percent-done) n'a aucun composant dans le système — l'obligation « progression réelle si mesurable » est posée, le composant naîtra de son premier besoin réel ; d'ici là, un build qui en a besoin remonte.
- **Chiffrage de l'anti-scintillement** : délai d'apparition et durée minimale restent en ordre de grandeur — à chiffrer (et éventuellement tokeniser) au premier consommateur outillé, avec benchmark dédié.
- **Seuils en valeurs machine** : si un harness de test ou un lint consomme un jour les bornes 0,1/1/10 s, la question token se rouvre — jusque-là, prose sourcée.
- **UI optimiste — premier terrain** : le `TOAST` porteur d'une annulation est le premier candidat d'incarnation (avec la réversibilité de `cognitive-load`) ; documenter le cas réel quand il arrive.
- **Coût du socle à cinq** : mesuré à chaque build (RAPPORT-ROUTEUR) — la clause de réouverture socle/bundle vaut pour les trois principes chargés d'office.
