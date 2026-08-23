---
component: emotion
layer: ux
type: language
version: 1.1.1 # 1.1.1 : ajout d'un point ouvert (§ À approfondir) sur le DeleteButton de DS-UI (froissage E-motion sur une action destructive, 2026-07-19) — absent du catalogue, non tranché, remonté sans être résolu ici. Aucune règle modifiée. 1.1.0 : E-motion devient un langage d'expression de premier niveau, distinct de la fondation motion qu'il gouverne. 1.0.0 : première rédaction — la couche d'EXPRESSION du système. Emprunte le « chemin sanctionné » que MOTION-UX.md 1.2.0 avait laissé ouvert (le registre productif est un parti pris paramétrable). Ne crée pas de contrainte : elle en LÈVE une (la borne ~400ms, le « productif seulement ») pour des moments strictement mérités, sans jamais toucher au contrat d'accessibilité. Cf. DECISIONS.md 2026-07-18.
last_updated: 2026-07-20
companion: EMOTION-UI.md
confidence: mixed # le contrat de repli et l'héritage WCAG sont établis (hérités de motion/accessibility) ; la proportionnalité et le « budget de rareté » sont un parti pris d'identité interne, assumé
---

# E‑motion — Couche UX (langage d'expression)

> La couche d'**expression** du système : les moments où l'interface a le droit de sortir de la rigueur productive pour offrir un instant humain. E‑motion = **é‑motion portée par le mouvement** — le mouvement est l'instrument principal, pas le seul. Le raisonnement (quand, pourquoi, quel budget, quel repli) vit ici ; les tokens expressifs et la chorégraphie technique vivent dans `EMOTION-UI.md`.

## But
Un design system ultra‑cadré rassure mais peut sonner monotone. E‑motion est le **contrepoids assumé** : une couche mince, rare, gouvernée, qui donne une âme au système sans en trahir la rigueur. Elle ne s'oppose pas à la fondation `motion` — elle en est l'**extension sanctionnée**. MOTION‑UX pose que le registre « productif seulement » est *un parti pris d'identité paramétrable, qu'un consommateur expressif peut relever sans toucher aux contraintes*. E‑motion **est** ce consommateur, formalisé : elle relève le parti pris (durées plus longues, courbes à caractère, célébration) pour des moments choisis, et pour eux seuls.

## La loi cardinale : l'expression est proportionnelle au SENS du moment

RÈGLE [EMOTION-R01] : le choix d'offrir un moment E‑motion n'est jamais esthétique — c'est une déclaration que *cet instant précis compte* pour l'utilisateur. C'est le miroir exact de la règle transversale du bouton (« la friction est proportionnelle au risque réel ») : ici, **l'expression est proportionnelle au poids émotionnel du moment**.
STATUT : parti pris d'identité
SOURCE : S3
ÉNONCÉ : Le recours à un moment expressif se justifie par le poids du moment pour l'utilisateur et jamais par une intention décorative : l'intensité de l'expression est proportionnelle à l'importance de l'instant.

RÈGLE [EMOTION-R02] : **rareté obligatoire (le budget de délice).** Un moment expressif qui se répète cesse d'être expressif — il devient une attente, puis une gêne. C'est la même mécanique que « un seul primary par vue » : un signal partout n'est plus un signal. La rigueur du reste du système est ce qui *rend audible* la note expressive ; sans le silence autour, elle n'est que du bruit.
STATUT : propriété universelle
SOURCE : S3, S10, S11
ÉNONCÉ : Un moment expressif ne se déclenche jamais sur une action réflexe ou à haute fréquence, et ne se répète pas plus d'une fois par séquence utile : au-delà, l'animation cesse d'être un signal et devient un obstacle qui allonge la tâche.
MESURE : aucun moment expressif déclenché sur une action répétée à l'intérieur d'une même séquence (frappe, survol, item de liste) ; une occurrence au plus par séquence utile
  - Jamais sur une action **réflexe** ou **à haute fréquence** (un hover, un clic de navigation, un envoi qu'on répète 40 fois par jour). Mal placé, l'effet se retourne : il ralentit et agace.
  - Un même moment E‑motion ne se déclenche qu'une fois par séquence utile (pas à chaque frappe, pas à chaque item d'une liste).

## Le catalogue des moments MÉRITÉS

RÈGLE [EMOTION-R03] : E‑motion ne se pose que sur les **battements émotionnels** d'un parcours — pas ailleurs. Le catalogue de départ :
STATUT : parti pris d'identité
SOURCE : S4, S12
ÉNONCÉ : Un moment expressif ne se place que sur un moment inscrit au catalogue des moments mérités — réussite d'un envoi, franchissement d'une première fois, cap atteint, sortie d'erreur, vide ou attente assumés — et nulle part ailleurs.
MESURE : tout moment expressif livré correspond à une entrée nommée du catalogue

| Moment | Exemple | Pourquoi il est mérité |
|---|---|---|
| **Réussite d'un envoi / d'une soumission** | « Envoyer » → l'avion en papier part | L'utilisateur a confié quelque chose ; l'accusé de réception mérite d'être ressenti, pas seulement lu |
| **Première fois / onboarding franchi** | Fin d'un setup, premier projet créé | Un seuil de parcours ; l'émotion marque le passage |
| **Cap / accomplissement** | Objectif atteint, dernière tâche cochée | La récompense d'un effort, pas d'un clic |
| **Sortie d'une erreur / récupération** | Un blocage enfin résolu | Le soulagement mérite d'être reconnu |
| **Vide et attente qui ont une personnalité** | Empty state, chargement long assumé | Les creux du parcours, là où un système sec laisse l'utilisateur seul |

RÈGLE [EMOTION-R04] : hors de ce catalogue, on ne s'improvise pas un moment. Ajouter une entrée est une **décision de design tranchée** (elle passe par DECISIONS.md), pas un réflexe d'implémenteur.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : L'ajout d'une entrée au catalogue des moments mérités est une décision de design tranchée et consignée, jamais une initiative prise au moment de l'implémentation.
MESURE : toute entrée du catalogue renvoie à une décision datée dans DECISIONS.md

## Le contrat de repli (INVIOLABLE)

RÈGLE [EMOTION-R05] : **E‑motion est toujours une amélioration, jamais un canal d'information.** L'état (succès, envoi, accomplissement) vit dans l'ARIA et dans le statique — l'animation ne fait que le *célébrer*. Couper l'animation ne coupe jamais l'information.
STATUT : propriété universelle
SOURCE : S7, S8
ÉNONCÉ : Un moment expressif est toujours une amélioration et jamais un canal d'information : l'état qu'il célèbre est exposé indépendamment sous forme statique et programmatiquement déterminable, de sorte que la suppression de l'animation ne retire aucune information.
MESURE : animation désactivée : l'état (succès, envoi, accomplissement) reste exposé en texte et annoncé par un rôle de message de statut

RÈGLE [EMOTION-R06] : `prefers-reduced-motion` — le moment expressif **dégrade proprement** vers sa version productive/instantanée (le repli de la fondation `motion`), pas vers rien. L'avion ne vole pas ; le bouton passe directement à « Envoyé ✓ ». L'utilisateur sensible au mouvement perd la *fête*, jamais le *fait*.
STATUT : propriété universelle
SOURCE : S5, S6
ÉNONCÉ : Sous une préférence utilisateur de mouvement réduit, un moment expressif dégrade vers sa version productive ou instantanée — l'état final s'installe sans déplacement — et jamais vers l'absence d'état.
MESURE : sous prefers-reduced-motion: reduce, aucune animation de célébration ne se déclenche et l'état final reste atteint et annoncé

RÈGLE [EMOTION-R07] : E‑motion **hérite intégralement du contrat d'accessibilité de `motion`** — et n'en relâche aucune clause. Ce qui est relevé est le *parti pris d'identité* (productif→expressif), jamais la contrainte : pas de flash > 3/s (WCAG 2.3.1), on n'anime que `transform`/`opacity`, le mouvement ne verrouille jamais une action, rien n'informe par le seul mouvement. (Détail des interdits : `RULES-motion.md`, `RULES-accessibility.md`.)
STATUT : propriété universelle
SOURCE : S5, S8, S9, S14
ÉNONCÉ : Le registre expressif relève le parti pris d'identité mais ne relâche aucune contrainte d'accessibilité : pas plus de trois flashs par seconde, aucun verrouillage de l'action par l'animation, et aucune information portée par le seul mouvement.
MESURE : aucune séquence expressive ne dépasse trois flashs par seconde, ne bloque une action en cours, ni ne porte une information absente de l'état statique

## Plus que du mouvement : les quatre instruments

RÈGLE [EMOTION-R08] : E‑motion joue sur plusieurs instruments accordés — le mouvement est la porte d'entrée, pas toute la pièce.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Un moment expressif joue sur quatre instruments — mouvement, voix, couleur, forme — dont la couleur puise exclusivement dans les rôles de couleur existants du système, sans jamais introduire de valeur nouvelle.
MESURE : aucune valeur de couleur en dur dans un moment expressif : toute couleur provient d'un rôle de couleur existant
- **Mouvement** (premier violon) : la chorégraphie, le caractère (cf. EMOTION-UI, cran `motion.expressive`/`motion.spring`).
- **Voix** : le microcopy du moment se réchauffe d'un cran (« C'est parti ✈️ » plutôt que « Envoyé »). Autorité : `RULES-voice.md` — E‑motion ne redéfinit pas la voix, elle en autorise le registre chaleureux sur ces instants.
- **Couleur** : puise dans les tokens (le vert de succès, le primary de marque) — jamais une couleur nouvelle ; la chaleur vient de l'usage, pas d'un hex inventé.
- **Illustration / forme** : un glyphe qui se dessine, une silhouette qui se plie — au service du moment, jamais gratuite.

RÈGLE [EMOTION-R09] : un moment réussi **accorde** ses instruments (le mouvement se résout au moment où la voix change et où le vert s'installe) ; désaccordés, ils font du bruit.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Les instruments d'un moment expressif se résolvent de manière accordée : la fin du mouvement, le changement de voix et l'installation de la couleur convergent sur le même temps plutôt que de se succéder indépendamment.

## Gouvernance

RÈGLE [EMOTION-R10] : chaque moment signature est un **composant/comportement catalogué, versionné, budget‑gated** — pas un effet local. Un composant qui invoque E‑motion est une **exception documentée** (au même titre qu'un bouton de connexion sociale), tracée, jamais arbitraire.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Tout moment expressif est un composant ou un comportement catalogué, versionné et soumis à un budget, déclaré comme exception documentée ; un effet d'animation défini localement dans un écran n'est pas un moment expressif.
MESURE : tout moment expressif possède une entrée de catalogue versionnée ; aucun effet expressif défini au niveau d'un écran

RÈGLE [EMOTION-R11] : le premier citoyen d'E‑motion est le **SubmitButton « avion en papier »** (envoi async → pliage/vol → succès). Il sert de preuve et de gabarit : tout futur moment suit son anatomie (cf. EMOTION-UI) et son contrat de repli.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Le SubmitButton « avion en papier » fait office de gabarit de référence : tout nouveau moment expressif reprend son anatomie en trois actes et son contrat de repli.

## Sources et niveau de confiance
| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| S1 | Le registre productif est un parti pris paramétrable, relevable par un chemin sanctionné | MOTION-UX.md 1.2.0 (interne) | Établi en interne — E‑motion est ce chemin |
| S2 | L'animation ne porte jamais l'information seule ; repli reduced-motion obligatoire | WCAG 2.3.3, 1.4.13 ; MOTION-UX/ACCESSIBILITY | Établi, standard d'accessibilité |
| S3 | Expression proportionnelle au sens ; rareté (« budget de délice ») | Décision d'identité interne — miroir de « friction ∝ risque » et « un seul primary par vue » | Parti pris de conception, assumé, pas une étude chiffrée |
| S4 | Les moments de « délice » se placent aux battements du parcours, pas partout | Convergence pratique (peak‑end rule, NN/g sur le delight) ; catalogue propre à ce système | Émergent — cadre interne, à enrichir par l'usage réel |
| S5 | « Motion animation triggered by interaction can be disabled, unless the animation is essential to the functionality or the information being conveyed. » — ancrage normatif du repli de R06 et de la clause « rien d'essentiel dans l'animation » de R05/R07. À noter : le critère est de niveau AAA, alors que le fichier traite le repli comme INVIOLABLE — le système est ici plus strict que la norme, ce qui est un renforcement légitime et non une déduction | [WCAG 2.2 — 2.3.3 Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) | Établi, standard d'accessibilité (AAA) — c'est LE critère applicable à une célébration déclenchée par un clic, et non 2.2.2 (cf. S14) |
| S6 | Ancrage plateforme de la préférence utilisateur : la valeur « reduce » signale que l'utilisateur a demandé la minimisation des animations non essentielles (motif : troubles vestibulaires). MDN recommande explicitement de **remplacer ou réduire** l'animation décorative plutôt que de simplement la supprimer — corrobore mot pour mot la clause de R06 « dégrade vers sa version productive, pas vers rien » | [MDN — prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) | Établi — documentation de référence, Baseline widely available depuis janvier 2020 |
| S7 | Les messages de statut — dont ceux qui « provide information to the user on the success or results of an action » — doivent être programmatiquement déterminables par rôle ou propriété et présentables par les technologies d'assistance sans recevoir le focus. Fonde la clause de R05 : l'état de succès vit dans l'ARIA, l'animation ne fait que le célébrer | [WCAG 2.2 — 4.1.3 Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) | Établi, standard d'accessibilité (AA) — référence plus directe que le 1.4.13 cité par le fichier (cf. contradiction relevée en S14) |
| S8 | « Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element. » Étend à la couleur le principe du canal unique que R05 pose pour le mouvement, et borne l'instrument « couleur » de R08 | [WCAG 2.2 — 1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) | Établi, standard d'accessibilité (A) |
| S9 | « Web pages do not contain anything that flashes more than three times in any one second period, or the flash is below the general flash and red flash thresholds. » Donne sa référence vérifiée au seuil « pas de flash > 3/s » que R07 cite en prose sans lien — pertinent pour les particules et étincelles autorisées par EMOTION-UI | [WCAG 2.2 — 2.3.1 Three Flashes or Below Threshold](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html) | Établi, standard d'accessibilité (A) |
| S10 | **Relevé de convergence du 2026-07-27 — la rareté du registre expressif est une convention partagée, pas un parti pris propre à ce système.** Carbon : « Reserve expressive motion for occasional, important moments, to better capture the user's attention and offer a rhythmic break to the productive experience » et « Is your motion frequently noticed by average users? If so, consider removing or minimizing it ». Atlassian : « Reserve longer, more expressive motion for low-frequency moments like onboarding, first-run experiences, or milestone celebrations » et « If someone will trigger this motion dozens of times a day, keep it under 150ms ». Deux systèmes publics posent, indépendamment, exactement la thèse de R02 — y compris la formule « pause rythmique dans l'expérience productive » qui est le résumé littéral du but d'E-motion. Le fichier classait cela en S3 « parti pris de conception assumé, pas une étude chiffrée » : la rareté est en réalité sourcée ; ce qui reste interne, c'est le catalogue (R03), pas le principe | [Carbon — Motion overview](https://carbondesignsystem.com/elements/motion/overview/) ; [Atlassian — Motion](https://atlassian.design/foundations/motion) | Établi par convergence — 2 design systems publics vérifiés sur source primaire, le 2026-07-27 |
| S11 | « Animations that are repeatedly encountered are roadblocks to content and lengthen the amount of time to complete a task », et le retour utilisateur type « this [animation] was nice the first time, but now it's getting annoying ». Appuie la clause de R02 sur les actions réflexes et à haute fréquence par un constat de test, et non par une intuition | [Nielsen Norman Group — Animation for Attention and Comprehension](https://www.nngroup.com/articles/animation-usability/) | Établi — synthèse de tests utilisateurs d'une autorité reconnue ; pas une publication à comité de lecture, d'où l'appui conjoint sur S10 |
| S12 | La règle du pic-fin (Kahneman & Fredrickson, 1993) : les moments les plus intenses et le moment final d'une expérience pèsent de façon disproportionnée dans le souvenir qu'on en garde ; d'où la recommandation de concentrer l'effort de conception sur les pics et la fin plutôt que uniformément. **Précision d'honnêteté** : l'expérience fondatrice porte sur la mémoire d'une douleur physique (immersion en eau froide), pas sur le plaisir d'une interface. La règle est réelle et identifiable ; la transposition « donc on place une célébration animée sur ces battements » est une extrapolation propre à ce fichier, ce qui maintient R03 en parti pris d'identité | [Nielsen Norman Group — The Peak-End Rule](https://www.nngroup.com/articles/peak-end-rule/) | Recherche établie (Kahneman & Fredrickson 1993) — mais transposition à l'expression d'interface non démontrée |
| S13 | Effet esthétique-utilisabilité, réplication contrôlée : 60 participants, deux simulations de téléphone fonctionnellement identiques. L'apparence a agi à la fois sur l'utilisabilité perçue (« participants using the highly appealing phone rated their appliance as being more usable ») **et sur la performance réelle** (« reduced task completion times for the attractive model »). **Constat de qualification** : c'est la seule littérature qui pourrait fonder la prémisse générale du fichier (« un système ultra-cadré rassure mais peut sonner monotone »), et elle la soutient — mais aucune des 11 règles n'invoque cet effet. La littérature esthétique-utilisabilité ne peut donc promouvoir aucune règle : elle valide l'intention du langage, pas ses énoncés | [Sonderegger & Sauer (2010) — The influence of design aesthetics in usability testing: effects on user performance and perceived usability, *Applied Ergonomics*](https://pubmed.ncbi.nlm.nih.gov/19892317/) | Établi — publication à comité de lecture ; non mobilisable pour une règle de ce fichier |
| S14 | **Correction d'une intuition courante.** 2.2.2 exige trois conditions cumulatives — « (1) starts automatically, (2) lasts more than five seconds, and (3) is presented in parallel with other content » — et le Understanding précise que « starts automatically » exclut ce qui résulte d'une activation intentionnelle : « for example, selecting a link or button ». **Une célébration déclenchée par un clic sur « Envoyer » n'est donc PAS couverte par 2.2.2** ; le critère applicable est 2.3.3 (S5). En revanche, un déclenchement au survol ou au focus compte comme démarrage automatique — ce qui donne une seconde raison, normative, à l'interdiction posée par R02 de placer un moment expressif sur un hover | [WCAG 2.2 — 2.2.2 Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html) | Établi, standard d'accessibilité (A) — délimite le périmètre réel du critère |
| S2 (correction) | **Contradiction relevée dans la bibliographie du fichier.** S2 adosse « l'animation ne porte jamais l'information seule ; repli reduced-motion obligatoire » à « WCAG 2.3.3, 1.4.13 ». 1.4.13 est *Content on Hover or Focus* : il traite de la persistance et du rejet du contenu apparaissant au survol ou au focus, et n'a aucun rapport avec le canal d'information ni avec le mouvement réduit. Les références correctes sont 4.1.3 (S7) et 1.4.1 (S8) pour le canal d'information, 2.3.3 (S5) pour le repli | [WCAG 2.2 — 1.4.13 Content on Hover or Focus](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html) | Mis-citation confirmée — S2 doit renvoyer à 4.1.3 / 1.4.1 / 2.3.3 |

## À approfondir

- **DeleteButton (DS-UI, 2026-07-19) — point NON TRANCHÉ.** L'implémentation DS-UI porte un DeleteButton dont les lettres du label se froissent en boule avant de tomber dans la corbeille (animation E-motion — cran `motion.spring`, convergence de particules). Ce moment n'apparaît dans aucun des deux fichiers qui font autorité : absent du catalogue des moments mérités ci-dessus (qui ne couvre que succès/première fois/cap/sortie d'erreur/vide — rien sur une action destructive), et absent de `BUTTON-UX.md`, qui ne connaît pas de composant nommé « DeleteButton » distinct du modèle générique style×tone. Il entre en tension potentielle avec VOICE-UX § « Le ton suit l'utilisateur » (action destructive : « direct, factuel, conséquence nommée ; ni euphémisme ni sur-dramatisation ») — un froissage ludique avant la corbeille peut se lire comme l'équivalent visuel d'un euphémisme.
- Conformément au protocole du routeur (« décision de design non tranchée : stoppe, expose les options, attends l'arbitrage »), ce point est **remonté, pas résolu**. Options à trancher par l'utilisateur : (1) cataloguer un nouveau moment « retrait/suppression d'un élément » avec une anatomie sobre et distincte de l'avion (sans `spring`/overshoot, cohérente avec le ton factuel du destructif) ; (2) reclasser le froissage comme un signal de transition d'état relevant d'`INTERACTION-UX.md`/`MOTION-UX.md` plutôt que d'E-motion, s'il ne s'agit pas d'un moment « mérité » au sens de ce fichier ; (3) sobriser ou retirer l'animation pour rester dans le registre productif. Cf. DECISIONS.md 2026-07-20.
