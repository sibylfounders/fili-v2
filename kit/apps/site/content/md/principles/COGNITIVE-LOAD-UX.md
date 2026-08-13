---
component: cognitive-load
layer: ux
type: principle
version: 1.0.1 # 1.0.1 : chemins repointés vers `content/md/` — fin de la migration vers le monorepo Sibyl DS (2026-07-27) ; aucune règle, aucun token, aucune source modifiés. 1.0.0 : première rédaction — pendant OPÉRATIONNEL du catalogue laws (qui garde la théorie, audience: humans) ; inventaire transversal et benchmark faits AVANT livraison ; statut de socle universel arbitré le 2026-07-21 (cf. DECISIONS.md) ; UX-only par nature (aucun token)
last_updated: 2026-07-21
companion: none # principe UX-only, sur le modèle d'accessibility : aucune valeur visuelle ni token propre — chaque mécanique vit chez son propriétaire, ce fichier ne porte que l'obligation et le renvoi
confidence: mixed # les fondements (divulgation progressive NN/g, « one thing per page » GOV.UK, heuristiques de Nielsen 3/5/6, défauts NN/g, consentement actif RGPD/CJUE) sont établis ou convergents ; les règles internes renforcées (coût jamais caché, undo = promesse tenue, anti-camouflage) sont des positions du système, identifiées comme telles
---

# Charge cognitive — Couche UX (principe transversal)

> Ce fichier pose les **obligations universelles de charge cognitive** : ce que tout écran, composant, pattern et flow doit respecter pour que l'interface n'impose jamais plus de travail mental que la tâche elle-même. Il est le **pendant opérationnel** de `LAWS-UX.md` : les lois (Sweller, Hick, Tesler, Zeigarnik…) y restent la référence théorique, `audience: humans`, jamais chargée au build — ce principe, lui, est **compilé et consommé** au moment de générer de l'UI. Il ne réécrit aucune loi et aucune mécanique : il contraint, cite, et renvoie. Source du besoin : `content/md/inventaires/inventaire-cas-usage-charge-cognitive.md` (audit transversal du 2026-07-21).

## Note de transposition (à lire en premier)

RÈGLE [COGNITIVE-LOAD-R01] : la charge cognitive est un **principe transversal** — ni variantes (composant), ni assemblage (pattern), ni token ; le modèle à axes ne s'applique pas. Comme `accessibility` : `companion: none` **sans** `audience: humans` — compilé vers `dist/RULES-cognitive-load.md` et **chargé d'office par le routeur pour toute intention** (socle universel, arbitré le 2026-07-21 ; le coût en tokens du socle est mesuré à chaque build dans RAPPORT-ROUTEUR).
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : La charge cognitive est un principe transversal : elle n'a ni variantes de composant, ni assemblage de pattern, ni token propre, et elle est compilée en règles chargées d'office par le routeur pour toute intention, au titre de socle universel.
MESURE : un fichier de règles compilé existe pour le sujet et le routeur le charge pour 100 % des intentions

RÈGLE [COGNITIVE-LOAD-R02] : **frontière avec `laws`** — les lois éclairent, ce principe contraint. `LAWS-UX.md` reste le seul endroit où une loi est énoncée, sourcée et bornée ; chaque règle ici **cite** sa loi sans la réécrire. Si une règle opérationnelle de ce fichier semble contredire la portée d'une loi du catalogue, le catalogue a raison sur la loi, ce fichier a raison sur l'obligation — et l'écart se remonte.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Une loi UX n'est énoncée, sourcée et bornée que dans le catalogue des lois ; ce principe cite la loi sans la réécrire, le catalogue fait autorité sur la loi, le principe fait autorité sur l'obligation, et tout écart se remonte.
MESURE : aucune mention de loi dans ce fichier n'en redonne l'énoncé ; chacune renvoie au catalogue

> **Pourquoi ce principe alors que le catalogue existe** : `LAWS-UX.md` déclare lui-même Cognitive Load « principe implicite de tout le système » et signalait des trous opérationnels (anti-camouflage « candidate à passer de frontière à RÈGLE »). Implicite = invisible au build : avant ce fichier, aucune règle chargée ne contraignait le nombre de décisions d'un écran, la divulgation, les défauts ou la réversibilité *en tant qu'obligations transversales*. Elles existaient en pièces détachées chez les propriétaires ; ce fichier les élève en contrat unique, comme l'a fait `accessibility` pour ses obligations.

RÈGLE [COGNITIVE-LOAD-R03] : ce principe **ne fait pas autorité sur un comportement précis** — il pose l'obligation, le propriétaire pose la mécanique (`FORM` pour le multi-step, `BUTTON` pour le destructive, `INPUT` pour les défauts de saisie…). En cas de divergence, le propriétaire a raison. Même clause qu'`accessibility` : pas une source normative de substitution.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Ce principe pose l'obligation et jamais la mécanique : en cas de divergence avec le composant, la fondation ou le flow propriétaire, le propriétaire fait autorité.

RÈGLE [COGNITIVE-LOAD-R04] : ce principe **ne quantifie aucun plafond**. Aucune règle ne dira « maximum N choix » — le plafond numérique est le mythe que `LAWS-UX.md` réfute (Miller « 7 items », règle des 3 clics). La contrainte porte sur la **structure** (hiérarchie, divulgation, défauts), jamais sur un nombre magique.
STATUT : note de méthode
SOURCE : S9, S10
ÉNONCÉ : Aucune règle de charge cognitive ne fixe de plafond numérique d'options, d'étapes ou de clics : la contrainte porte sur la structure — hiérarchie, divulgation, défauts — et jamais sur un nombre.
MESURE : aucune règle du sujet ne comporte de seuil numérique d'options, d'étapes ou de clics

## Le contrat — obligations universelles

### 1. Budget de décision — une intention principale par moment

RÈGLE [COGNITIVE-LOAD-R05] : tout écran ou toute vue déclare **une décision principale**, et une seule. Tout le reste — choix secondaires, réglages, chemins alternatifs — lui est subordonné visuellement et structurellement. Le système l'applique déjà localement (primary unique de `BUTTON`, une décision par étape du `FORM` multi-step) ; l'obligation devient ici celle de **l'écran assemblé**, pas seulement du composant.
STATUT : parti pris d'identité
SOURCE : S3, S11
ÉNONCÉ : Tout écran ou toute vue déclare une décision principale et une seule ; les choix secondaires, réglages et chemins alternatifs lui sont subordonnés visuellement et structurellement.
MESURE : une seule décision principale déclarée par écran ou vue ; une seule action de rang primaire rendue

RÈGLE [COGNITIVE-LOAD-R06] : le nombre de choix simultanés se justifie par le besoin de la décision présente, jamais par l'espace disponible. Un conteneur large peut révéler du contenu secondaire (cf. `adaptive`, divulgation par l'espace) — il n'autorise pas des décisions nouvelles.
STATUT : parti pris d'identité
SOURCE : S3, S11
ÉNONCÉ : Le nombre de choix simultanés se justifie par le besoin de la décision présente et jamais par la place disponible : un conteneur plus large peut révéler du contenu secondaire, il n'autorise aucune décision nouvelle.
MESURE : aucune décision nouvelle introduite par un palier de largeur ; les paliers ne font varier que la révélation de contenu

> **Pourquoi** : Hick — le temps de décision croît avec le nombre *et* la complexité des options (cf. LAWS § 2) ; « one thing per page » du GOV.UK Service Manual — « commencer par découper le formulaire en pages ne contenant qu'une seule chose », avec sa nuance d'origine : c'est la recherche utilisateur qui dit quand regrouper (usage interne intensif, allers-retours rapides entre tâches).

CONFIANCE : convergence — « one thing per page » est documenté par un système majeur et largement observé ; le découpage exact d'un parcours en « moments » reste un arbitrage par cas (voir Tensions : un émiettement mécanique déplace la complexité au lieu de la réduire — GOV.UK lui-même regroupe quand la recherche le justifie).

### 2. Divulgation progressive — l'essentiel d'abord, le détail sur demande

RÈGLE [COGNITIVE-LOAD-R07] : par défaut, une interface montre ce qui est nécessaire à la décision présente ; l'avancé, le rare et le détail se révèlent **sur demande explicite**. La cause est ici la complexité — distincte de la divulgation par l'espace, qui appartient à `adaptive` et répond à la largeur du conteneur.
STATUT : propriété universelle
SOURCE : S2
ÉNONCÉ : Une interface montre par défaut ce qui est nécessaire à la décision présente ; l'avancé, le rare et le détail ne se révèlent que sur demande explicite de l'utilisateur.
MESURE : aucun contenu classé avancé ou rare n'est rendu à l'état initial de la vue

RÈGLE [COGNITIVE-LOAD-R08] : (frontière dure) la divulgation **ne cache jamais** l'information nécessaire pour décider — un coût, un engagement, une obligation, un risque **se voient avant** l'action qui engage. C'est l'extension transversale du « ne révèle pas tardivement une information nécessaire » d'`adaptive`, et la ligne qui sépare la divulgation progressive de la dissimulation.
STATUT : parti pris d'identité
SOURCE : S7, S2
ÉNONCÉ : La divulgation progressive ne masque jamais une information nécessaire pour décider : un coût, un engagement, une obligation ou un risque est visible avant l'action qui engage.
MESURE : toute information de coût, d'engagement, d'obligation ou de risque est rendue dans la même vue que l'action qui engage, sans interaction de révélation préalable

RÈGLE [COGNITIVE-LOAD-R09] : réduire n'est pas enfouir — une fonction essentielle reste découvrable sans connaissance préalable. La tension Hick ↔ découvrabilité (cf. LAWS) ne se tranche pas par principe : au doute, remonter.
STATUT : parti pris d'identité
SOURCE : S4, S11
ÉNONCÉ : Une fonction essentielle reste découvrable sans connaissance préalable : réduire le nombre de choix visibles ne justifie jamais d'enfouir une fonction, et le doute se remonte au lieu de se trancher par principe.

CONFIANCE : établi — progressive disclosure documentée (NN/g). La frontière « jamais un coût caché » est une **règle interne renforcée** à portée éthique, convergente avec le corpus deceptive patterns (Brignull).

### 3. Défauts intelligents — le système propose, l'utilisateur dispose

RÈGLE [COGNITIVE-LOAD-R10] : tout choix qui admet une réponse majoritaire sensée porte un **défaut** ; l'utilisateur corrige un défaut plutôt qu'il ne construit une réponse à vide. C'est la forme la plus directe d'absorption de complexité par le système (Tesler, cf. LAWS § 2) — et la plus puissante : la plupart des utilisateurs ne changent jamais un défaut (NN/g), ce qui en fait une responsabilité autant qu'un levier.
STATUT : parti pris d'identité
SOURCE : S5, S1
ÉNONCÉ : Tout choix qui admet une réponse majoritaire sensée porte une valeur par défaut, afin que l'utilisateur corrige une proposition plutôt qu'il ne construise une réponse à vide.
MESURE : tout champ ou réglage dont une réponse majoritaire est identifiée expose une valeur par défaut

RÈGLE [COGNITIVE-LOAD-R11] : (frontière dure) un défaut **n'engage jamais à l'insu** — jamais de consentement, d'achat, d'abonnement ou de partage pré-coché. Le consentement est **actif** ; sa mécanique appartient à `FORM-sensitive-data` et au flow `creation-compte-consentement`, qui font autorité.
STATUT : propriété universelle
SOURCE : S6
ÉNONCÉ : Aucune valeur par défaut n'engage l'utilisateur à son insu : consentement, achat, abonnement et partage ne sont jamais pré-cochés, le consentement résultant toujours d'un acte positif de l'utilisateur.
MESURE : aucune case de consentement, d'achat, d'abonnement ou de partage n'est cochée à l'état initial

RÈGLE [COGNITIVE-LOAD-R12] : un défaut se distingue toujours d'une valeur saisie — l'utilisateur sait ce qu'il a choisi et ce qui a été choisi pour lui. La mécanique (placeholder ≠ valeur, pré-remplissage annoncé) appartient à `INPUT`.
STATUT : propriété universelle
SOURCE : S14, S5
ÉNONCÉ : Une valeur par défaut se distingue toujours d'une valeur saisie par l'utilisateur : le pré-remplissage est annoncé et un texte indicatif ne tient jamais lieu de valeur.
MESURE : tout champ pré-rempli porte une indication de pré-remplissage ; aucune valeur portée par le seul texte indicatif

CONFIANCE : établi pour l'effet des défauts (NN/g, « The Power of Defaults » : les utilisateurs gardent massivement les valeurs proposées) ; établi **normativement** pour la frontière du consentement (RGPD ; CJUE C-673/17 « Planet49 » : la case pré-cochée n'est pas un consentement).

### 4. Réversibilité — annuler vaut mieux que confirmer

RÈGLE [COGNITIVE-LOAD-R13] : une action **réversible** s'exécute immédiatement, avec un chemin d'annulation visible et un délai raisonnable. La **confirmation bloquante** est réservée à l'irréversible et au coûteux-à-défaire — la banaliser en détruit la valeur (fatigue de confirmation : cliquer « oui » devient un réflexe, et le garde-fou ne protège plus l'irréversible).
STATUT : parti pris d'identité
SOURCE : S4, S18
ÉNONCÉ : Une action réversible s'exécute immédiatement et offre un chemin d'annulation visible pendant un délai raisonnable ; la confirmation bloquante est réservée à l'action irréversible ou coûteuse à défaire.
MESURE : aucune confirmation bloquante sur une action réversible ; toute action réversible expose une commande d'annulation visible

RÈGLE [COGNITIVE-LOAD-R14] : l'irréversible **se déclare avant** l'exécution : ce que l'action détruit, sa portée, l'absence de retour. La mécanique destructive (styles, garde-fous, friction proportionnelle) appartient à `BUTTON` ; le cas DeleteButton reste OUVERT au journal et n'est pas tranché ici.
STATUT : propriété universelle
SOURCE : S18, S4
ÉNONCÉ : Une action irréversible déclare avant son exécution ce qu'elle détruit, sa portée et l'absence de retour ; à défaut d'être réversible, elle est vérifiée et confirmée avant d'être finalisée.
MESURE : toute action qui engage juridiquement, engage financièrement ou détruit des données est réversible, vérifiée, ou confirmée avant finalisation

RÈGLE [COGNITIVE-LOAD-R15] : **quitter n'est pas perdre** — une saisie en cours survit à la navigation, à l'interruption et à l'expiration quand c'est techniquement possible (propriétaires : `FORM` autosave ; `accessibility` pour les limites de temps).
STATUT : propriété universelle
SOURCE : S15, S19
ÉNONCÉ : Une saisie en cours survit à la navigation, à l'interruption et à l'expiration : quand la conservation n'est pas garantie, l'utilisateur est averti de la durée d'inactivité qui entraînerait la perte, et toute limite de temps reste ajustable.
MESURE : données conservées au-delà de 20 heures d'inactivité, ou avertissement explicite de la durée entraînant la perte ; toute limite de temps désactivable, ajustable ou prolongeable

RÈGLE [COGNITIVE-LOAD-R16] : (frontière dure) un « Annuler » affiché est une **promesse tenue** — si l'annulation n'est pas techniquement garantie, ne pas l'afficher ; une confirmation honnête vaut mieux qu'un undo fictif.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Une commande d'annulation n'est affichée que si l'annulation est techniquement garantie ; à défaut, le système demande une confirmation honnête plutôt que de proposer une annulation fictive.
MESURE : toute commande d'annulation exposée est adossée à une opération d'annulation effective

> **Pourquoi** : « User control and freedom » (Nielsen, heuristique n°3) — l'utilisateur a besoin d'une sortie de secours clairement signalée ; l'undo encourage l'exploration là où la confirmation punit l'essai.

CONFIANCE : établi pour l'heuristique et le pattern (undo largement observé en production : messageries, corbeilles) ; la répartition undo / confirmation par cas d'usage reste à éprouver composant par composant — premier terrain concret : le `TOAST` porteur d'une action d'annulation.

### 5. Reconnaissance plutôt que rappel — la mémoire est au système

RÈGLE [COGNITIVE-LOAD-R17] : ne jamais exiger de retenir une information d'un écran à l'autre — le contexte nécessaire est **re-présenté là où la décision se prend**. Mécaniques propriétaires déjà en place : ask-once et récapitulation (`FORM` multi-step), helper persistant plutôt qu'aide qui disparaît (`INPUT`).
STATUT : propriété universelle
SOURCE : S4, S9
ÉNONCÉ : Aucune information nécessaire à une décision n'est à retenir d'un écran à l'autre : le contexte requis est re-présenté là où la décision se prend.
MESURE : toute donnée nécessaire à une étape est affichée dans cette étape, sans dépendance à la mémorisation d'un écran précédent

RÈGLE [COGNITIVE-LOAD-R18] : l'interface **montre l'état** plutôt qu'elle ne le fait mémoriser — où j'en suis, ce qui est fait, ce qui reste (progression du `FORM` multi-step, statut d'autosave).
STATUT : propriété universelle
SOURCE : S4
ÉNONCÉ : L'interface montre l'état plutôt qu'elle ne le fait mémoriser : où l'utilisateur en est, ce qui est fait et ce qui reste sont visibles à tout moment.
MESURE : tout parcours à plusieurs étapes affiche l'étape courante, les étapes faites et les étapes restantes

CONFIANCE : établi — « Recognition rather than recall » (Nielsen, heuristique n°6) ; Working Memory (cf. LAWS § 1). Cette section n'ajoute aucune mécanique : elle élève en obligation universelle ce que `FORM` et `INPUT` possèdent déjà.

### 6. Anti-camouflage — le critique ne ressemble jamais au décor

RÈGLE [COGNITIVE-LOAD-R19] : une information critique (erreur, coût, sécurité, obligation légale) ne prend **jamais** la forme d'un élément décoratif ou promotionnel — ce qui ressemble à de la publicité est filtré avant lecture (banner blindness, cf. LAWS § Selective Attention). Ce fichier **promeut en RÈGLE** le trou que `LAWS-UX.md` signalait comme « candidate » dans son À approfondir. La forme du message reste chez ses propriétaires (`ALERT` pour les tones, `VOICE` pour le mot) ; l'interdit du déguisement est l'obligation transversale posée ici.
STATUT : parti pris d'identité
SOURCE : S8, S13
ÉNONCÉ : Une information critique — erreur, coût, sécurité, obligation légale — ne prend jamais la forme d'un élément décoratif ou promotionnel, sous peine d'être filtrée avant lecture.
MESURE : aucun message critique rendu avec les styles, placements ou composants réservés au contenu promotionnel ou décoratif

CONFIANCE : convergence — la banner blindness est documentée (NN/g) ; la formulation opérationnelle est une formalisation interne, première rédaction.

## Ce que ce principe ne fait pas

RÈGLE [COGNITIVE-LOAD-R20] : il ne possède **aucune mécanique** (table de renvois ci-dessous), ne fixe **aucun nombre**, et ne tranche **aucune tension** — il les rend visibles et l'arbitrage remonte, à la vitesse calibrée par les lignes CONFIANCE.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Ce principe ne possède aucune mécanique, ne fixe aucun nombre et ne tranche aucune tension : il rend les tensions visibles et fait remonter l'arbitrage à la vitesse calibrée par ses lignes de confiance.
MESURE : aucun token ni valeur définis dans le fichier ; chaque obligation renvoie à un propriétaire nommé

## Renvois vers les propriétaires (aucune valeur ici)

| Obligation | Propriétaire normatif |
|---|---|
| Primary unique, hiérarchie des actions, mécanique destructive | `RULES-button` (DeleteButton : OUVERT au journal) |
| Une décision par étape, ask-once, récapitulation, progression | `RULES-form` + `RULES-form-multi-step` |
| Survie de la saisie (autosave, interruption) | `RULES-form-autosave` |
| Consentement actif, données sensibles | `RULES-form-sensitive-data`, `RULES-creation-compte-consentement` |
| Défaut ≠ valeur saisie, helper persistant, diagnostic d'erreur | `RULES-input` |
| Divulgation par l'espace (compact → expanded) | `RULES-adaptive` |
| Rareté et hiérarchie des interruptions ; toast porteur d'une annulation | `RULES-alert`, `RULES-toast` |
| Sobriété du mouvement (l'attention est un budget) | `RULES-motion` |
| Mots simples, une idée par phrase, ton des moments critiques | `RULES-voice` |
| Limites de temps contrôlables | `RULES-accessibility` |

## Tensions connues (à rendre visibles, jamais à trancher seul)

| Tension | Les deux forces | Arbitrage |
|---|---|---|
| Réduire ↔ découvrir | Hick pousse à montrer moins ; une fonction enfouie n'existe plus | Par cas — remonter |
| Une décision par moment ↔ Tesler | Émietter un parcours n'élimine pas sa complexité, il la déplace | Un écran par décision, pas un écran par champ — GOV.UK regroupe quand la recherche le justifie |
| Défauts ↔ contrôle | Le défaut allège ; le défaut invisible déresponsabilise | Défaut visible, distinct, corrigeable |
| Undo ↔ friction protectrice | Une confirmation retirée exige un undo réellement tenu | Jamais les deux absents sur une action à conséquence |
| Divulgation ↔ transparence | Cacher le détail allège ; cacher le coût trompe | Frontière dure du § 2 — non négociable |

## Risque

| Cas | Risque principal | Sévérité |
|---|---|---|
| Divulgation retournée en dissimulation (coût, engagement caché) | Dark pattern — confiance détruite, enjeu légal | Élevée |
| Défaut pré-coché d'engagement | Consentement invalide (RGPD), enjeu légal direct | Élevée |
| « Annuler » affiché mais non garanti techniquement | Perte réelle + promesse trahie — pire qu'une confirmation | Élevée |
| « Une décision par écran » appliqué mécaniquement | Parcours émietté, complexité déplacée (Tesler ignoré) | Moyenne à élevée |
| Plafond numérique inventé pour trancher (« max 7 ») | Décision justifiée par un mythe réfuté au catalogue | Moyenne |
| Confirmation banalisée sur le réversible | Fatigue de confirmation — le garde-fou ne protège plus l'irréversible | Moyenne |

## Sources et niveau de confiance

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| S1 | Charge extrinsèque = gaspillage ; le système absorbe la complexité | Sweller (cognitive load theory) ; Tesler — via `LAWS-UX.md` (le catalogue fait autorité sur les lois) | Établi (théorie) ; transposition UI par convergence |
| S2 | Divulgation progressive : l'essentiel d'abord, le détail sur demande | [NN/g — Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/) | Établi |
| S3 | Une décision principale par page/moment — et regrouper quand la recherche le justifie | [GOV.UK Service Manual — Structuring forms](https://www.gov.uk/service-manual/design/form-structure) (« splitting the form across multiple pages with each page containing just one thing ») | Convergence — pattern documenté d'un système majeur, nuance d'origine incluse |
| S4 | User control and freedom (sortie de secours, undo) ; error prevention ; recognition rather than recall | [NN/g — 10 Usability Heuristics (n°3, 5, 6)](https://www.nngroup.com/articles/ten-usability-heuristics/) | Établi comme heuristiques de référence — pas des lois quantifiées |
| S5 | Les utilisateurs changent rarement les valeurs par défaut | [NN/g — The Power of Defaults](https://www.nngroup.com/articles/the-power-of-defaults/) | Établi (observation robuste) |
| S6 | La case pré-cochée n'est pas un consentement | RGPD art. 4(11) et 7 ; CJUE C-673/17 (Planet49, 2019) | Établi — normatif |
| S7 | Frontières éthiques (dissimulation, pré-cochage, pression) | [Deceptive Patterns — Brignull](https://www.deceptive.design/) | Établi comme catalogue de référence |
| S8 | Banner blindness / attention sélective | [NN/g — Banner Blindness](https://www.nngroup.com/articles/banner-blindness-old-and-new-findings/) ; via `LAWS-UX.md` | Établi (observation robuste) |
| S9 | La capacité pure de la mémoire à court terme est d'environ QUATRE chunks (fourchette 3 à 5), et non sept ; le « nombre magique sept » de Miller relevait selon Cowan d'un procédé rhétorique et d'estimations composites gonflées par la mémoire à long terme, la répétition et le chunking. | [Cowan, *The magical number 4 in short-term memory: A reconsideration of mental storage capacity*, Behavioral and Brain Sciences, 24, 2001, p. 87-185](https://memory.psych.missouri.edu/assets/doc/articles/2001/cowan-bbs-2001.pdf) | Établi — article cible de BBS, publication primaire vérifiée. AJOUT : aucune référence de mémoire de travail n'était sourcée ni dans ce fichier ni dans `LAWS-UX.md`. |
| S10 | Le « 7 ± 2 » ne s'applique pas au nombre d'éléments d'une interface : un menu repose sur la reconnaissance et non sur la mémorisation, donc il n'est pas à limiter à sept entrées. | [NN/g — Short-Term Memory and Web Usability (Nielsen, 2009)](https://www.nngroup.com/articles/short-term-memory-and-web-usability) | Établi pour la réfutation de l'usage UI. ATTENTION : cet article continue lui-même d'avancer « environ 7 chunks » pour la mémoire à court terme et ne cite pas Cowan — il réfute l'application au menu, pas le chiffre. Le chiffre corrigé est en S9. Par ailleurs le lien Miller primaire retenu par `LAWS-UX.md` (psychclassics.yorku.ca/Miller/) est INACCESSIBLE (boucle de redirections) au 2026-07-27 : à remplacer. |
| S11 | Loi de Hick : le temps de réaction de choix croît avec l'incertitude informationnelle des alternatives (gain d'information à débit approximativement constant). | [Hick, *On the Rate of Gain of Information*, Quarterly Journal of Experimental Psychology, 4(1), 1952, p. 11-26](https://journals.sagepub.com/doi/10.1080/17470215208416600) | Établi — publication primaire vérifiée. AJOUT : le fichier invoque Hick (R06, R09) sans référence propre, en déléguant à `LAWS-UX.md`, qui ne fournit pour Hick qu'un lien de vulgarisation (lawsofux.com). Portée réelle : temps de réaction en tâche de choix simple — l'extrapolation au nombre de décisions d'un écran n'est pas dans la source. |
| S12 | Les mécanismes de navigation répétés sur plusieurs pages d'un ensemble apparaissent dans le même ordre relatif à chaque répétition, sauf changement initié par l'utilisateur. | [WCAG 2.2 — 3.2.3 Consistent Navigation](https://www.w3.org/WAI/WCAG22/Understanding/consistent-navigation.html) | Établi, standard d'accessibilité (niveau AA). AJOUT : critère explicitement motivé par la réduction de charge cognitive, absent du fichier. |
| S13 | Des composants ayant la même fonctionnalité dans un ensemble de pages sont identifiés de manière cohérente. | [WCAG 2.2 — 3.2.4 Consistent Identification](https://www.w3.org/WAI/WCAG22/Understanding/consistent-identification.html) | Établi, standard d'accessibilité (niveau AA). AJOUT — fonde normativement l'anti-camouflage (R19) : un même rôle garde une même identification. |
| S14 | Des étiquettes ou des instructions sont fournies lorsque le contenu requiert une saisie de l'utilisateur. | [WCAG 2.2 — 3.3.2 Labels or Instructions](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html) | Établi, standard d'accessibilité (niveau A). AJOUT — ancrage normatif de R12 : une valeur pré-remplie non annoncée prive l'utilisateur de l'instruction requise. Ancrage INDIRECT : le critère ne nomme pas le pré-remplissage. |
| S15 | Toute limite de temps fixée par le contenu est désactivable, ajustable (jusqu'à dix fois la durée par défaut) ou prolongeable (avertissement puis au moins 20 secondes pour prolonger, au moins dix fois), hors exceptions temps réel, essentielle et au-delà de 20 heures. | [WCAG 2.2 — 2.2.1 Timing Adjustable](https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html) | Établi, standard d'accessibilité (niveau A). AJOUT — ancre R15, que le fichier renvoyait à `accessibility` sans citer le critère. |
| S16 | Une aide contextuelle est disponible. | [WCAG 2.2 — 3.3.5 Help](https://www.w3.org/WAI/WCAG22/Understanding/help.html) | Établi, standard d'accessibilité (niveau AAA). AJOUT — référence disponible pour le helper persistant renvoyé à `INPUT` ; non mobilisée par une règle de ce fichier. |
| S17 | Quand un texte exige un niveau de lecture supérieur au premier cycle du secondaire, un contenu supplémentaire ou une version plus simple est disponible. | [WCAG 2.2 — 3.1.5 Reading Level](https://www.w3.org/WAI/WCAG22/Understanding/reading-level.html) | Établi, standard d'accessibilité (niveau AAA). AJOUT — référence disponible pour « mots simples » renvoyé à `VOICE` ; non mobilisée par une règle de ce fichier. |
| S18 | Pour toute page entraînant un engagement juridique, une transaction financière, la modification ou la suppression de données contrôlées par l'utilisateur, la soumission est réversible, OU vérifiée avec possibilité de correction, OU confirmée par un mécanisme de revue avant finalisation. | [WCAG 2.2 — 3.3.4 Error Prevention (Legal, Financial, Data)](https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data.html) | Établi, standard d'accessibilité (niveau AA). AJOUT MAJEUR — c'est l'ancrage normatif direct de la doctrine réversibilité/confirmation (R13, R14), que le fichier ne fondait que sur une heuristique NN/g. Le critère valide la structure « réversible OU confirmé », pas la préférence pour l'undo, qui reste un parti pris. |
| S19 | Les utilisateurs sont avertis de la durée d'inactivité pouvant entraîner une perte de données, sauf si les données sont conservées plus de 20 heures en l'absence d'action. | [WCAG 2.2 — 2.2.6 Timeouts](https://www.w3.org/WAI/WCAG22/Understanding/timeouts.html) | Établi, standard d'accessibilité (niveau AAA). AJOUT — donne à R15 (« quitter n'est pas perdre ») un seuil mesurable (20 heures) que le fichier n'avait pas. |

CONFIANCE : les fondements de chaque section sont établis ou convergents et cités depuis leur propriétaire théorique (`LAWS-UX.md`) ou leur source primaire ; aucune règle de ce fichier n'introduit de mécanique nouvelle. Les **règles internes renforcées** (coût jamais caché, jamais d'engagement pré-coché, undo = promesse tenue, anti-camouflage) sont identifiées comme telles. Toute obligation qui semble entrer en conflit avec une règle propriétaire : le propriétaire tranche — STOP, remonter si l'ambiguïté persiste.

## À approfondir

- **Undo / confirmation par cas** : la répartition précise se documentera composant par composant — premier terrain : le `TOAST` porteur d'une action d'annulation ; le futur composant superposé (modale) héritera de la règle « confirmation réservée à l'irréversible ».
- **Défaut d'une collection** (tri, filtre, densité par défaut) : besoin réel repéré à l'inventaire, sans propriétaire désigné — `CARD` est candidate le jour où une collection réelle l'exige ; position à prendre avant, ne pas improviser.
- **Anti-camouflage** : à re-tester le jour d'un premier composant de contenu marketing (bannière, promo) — la règle est posée, son épreuve du réel reste à venir.
- **Coût du socle** : le poids du quatrième RULES universel est mesuré à chaque build (RAPPORT-ROUTEUR) ; si le socle enfle au fil des principes, l'arbitrage socle/bundle se rouvre avec les chiffres.
