---
component: voice
layer: ux
type: language
version: 1.3.1 # 1.3.1 : lecture d'audit du parti pris (pivot 2026-07-21) — chez un hôte tiers, le registre se lit comme paramètre relevable, jamais comme défaut. 1.3.0 : exception E-motion documentée côté Voice (elle n'existait qu'affirmée depuis EMOTION-UX.md, jamais réciproquée ici) — un agent chargeant Voice seul ne pouvait pas la découvrir ; correction de la ligne « Succès » du tableau de ton, qui excluait toute célébration sans distinguer le succès routinier du moment E-motion catalogué. 1.2.0 : Voice devient un langage de premier niveau, distinct des fondations typographiques qu'il emploie. 1.1.0 : distinction contrainte vs parti pris d'identité paramétrable (registre productif) — stress-test 2026-07-17. 1.0.0 : première rédaction — inventaire et benchmark faits AVANT livraison ; consolide les règles de wording déjà écrites dans BUTTON-UX (§ Wording), INPUT-UX (§ Contenu du message) et ALERT-UX, sans en retirer l'autorité (dédoublonnage : le composant garde son wording, le langage le nomme)
last_updated: 2026-07-21
companion: VOICE-UI.md
confidence: mixed # plain language, texte de lien signifiant et "ne jamais blâmer" sont établis (Nielsen, GOV.UK, WCAG) ; le registre "productif, pas expressif" est une décision d'identité interne (héritée de MOTION) ; le niveau de lecture cible n'est pas encore chiffré
---

# Voix & ton — Couche UX (langage)

> Ce fichier contient le raisonnement : quelle est la voix du produit, comment le ton s'adapte à l'utilisateur, pourquoi le mot est le canal d'information le plus fiable du système. Les mécaniques concrètes (capitalisation, ponctuation, nombres, dates, lexique, gabarits de messages) vivent dans `VOICE-UI.md` ; les longueurs de lecture dans `DESIGN.md` (`measure.reading-max`). Le wording propre à chaque composant reste dans son fichier (BUTTON-UX, INPUT-UX, ALERT-UX) — ce langage l'unifie, il ne le remplace pas.

## Note de transposition (à lire en premier)

RÈGLE [VOICE-R01] : la voix est un **langage de contenu** — pas de variantes visuelles, pas d'assemblage, pas de token de valeur : une grammaire transversale sur tout ce que le produit *dit*. Elle se scinde en deux couches : le **principe de voix** (stable, ce fichier — ce qu'est le produit quand il parle) et le **lexique + les mécaniques** (changeants avec la marque ou le produit, `VOICE-UI.md` — les mots exacts, la casse, les formats). Une voix qui référence des principes survit à un changement de marque ; un texte qui code en dur ses tournures meurt avec lui.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : La voix est un langage de contenu, sans variante visuelle ni token de valeur, scindé en deux couches : un principe de voix stable et un lexique de mécaniques appelé à changer avec la marque ou le produit.

RÈGLE [VOICE-R02] : la voix porte **un quasi-axe** propre aux langages — le **ton varie selon l'état émotionnel de l'utilisateur** (routine, erreur, panne, succès, attente, destruction). C'est la distinction classique **voix vs ton** : la voix est *constante* (la personnalité du produit ne change pas d'un écran à l'autre), le ton s'*ajuste* (on ne parle pas d'un échec de paiement comme d'un succès d'inscription). Le § « Le ton suit l'utilisateur » tient lieu de table d'axes.
STATUT : propriété universelle
SOURCE : S2, S15
ÉNONCÉ : La voix du produit reste constante d'une surface à l'autre tandis que le ton s'ajuste à l'état de la personne qui lit (routine, erreur, panne, succès, attente, destruction).

RÈGLE [VOICE-R03] : **le registre de ce produit est productif, pas expressif** — reprise littérale de MOTION-UX. Clarté, précision, sobriété ; pas d'humour d'apparat, pas de superlatif marketing, pas de sur-célébration. Le produit parle comme un collègue compétent et calme, pas comme une marque qui vend. Toute exception (surface marketing) se journalise et se cadre à part.
STATUT : parti pris d'identité
SOURCE : S6
ÉNONCÉ : Le registre du produit est productif et non expressif : clarté, précision et sobriété, sans humour d'apparat, superlatif marketing ni sur-célébration.

RÈGLE [VOICE-R04] : **distinguer la contrainte du parti pris (1.1.0)** — comme MOTION. Les contraintes (ne jamais blâmer, texte de lien signifiant WCAG 2.4.4, jamais l'information par le style seul, plain language accessible) ne se négocient pas ; le registre « productif, pas expressif » est un **parti pris d'identité paramétrable** — une surface marketing assumée peut relever le registre sans toucher aux contraintes d'accessibilité et d'anti-blâme. **Lecture d'audit (pivot 2026-07-21)** : face à une interface tierce, ce parti pris se lit comme un **paramètre relevable, jamais comme un défaut** — un « Parfait ! » chez un hôte au registre expressif assumé est une *divergence de registre* à signaler à part, pas une non-conformité ; seules les contraintes fondent un constat.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Les contraintes d'accessibilité et d'anti-blâme ne se négocient pas, tandis que le registre est un paramètre d'identité : en audit d'une interface tierce, un écart de registre se signale comme divergence paramétrable et jamais comme non-conformité.

## Exception E-motion (1.3.0) — le seul relèvement cadré du registre

RÈGLE [VOICE-R05] : **`EMOTION-UX.md` est l'unique exception cadrée au registre productif, et ce langage l'autorise explicitement.** Jusqu'ici l'autorisation n'existait que du côté d'E-motion (« Autorité : RULES-voice.md ») sans être réciproquée ici — un agent qui charge Voice sans E-motion n'avait aucun moyen de le savoir. Sur les moments mérités du catalogue d'E-motion (réussite d'un envoi, première fois, cap franchi, sortie d'erreur, vide avec personnalité) — et seulement ceux-là — le microcopy de résolution peut se réchauffer d'un cran : un émoji ponctuel et une formulation plus chaleureuse deviennent possibles (« C'est parti ✈️ » plutôt que « Envoyé »). Voice ne redéfinit pas cette exception, il la borne : E-motion reste gouverné par son propre catalogue fermé et son budget de rareté.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : L'unique relèvement autorisé du registre est le catalogue de moments E-motion, et cette autorisation est énoncée dans les deux fichiers qu'elle relie afin de ne pas dépendre de l'ordre de chargement des documents.

RÈGLE [VOICE-R06] : **l'exception ne s'étend jamais** à une erreur (utilisateur ou système), à une action destructive, ni à une action fréquente ou réflexe — ces cas restent strictement dans le registre productif (bannis : « Oups », emoji, « ! »). Une exception positive et rare n'est pas une porte vers l'expressif généralisé ; hors du catalogue d'E-motion, le § « Le ton suit l'utilisateur » ci-dessous fait seul autorité.
STATUT : parti pris d'identité
SOURCE : S6, S3
ÉNONCÉ : Le relèvement de registre ne s'étend jamais à une erreur, à une action destructive ni à une action fréquente ou réflexe : ces cas restent strictement productifs.

> **Pourquoi** : une règle d'autorité doit rester lisible depuis les deux fichiers qu'elle relie, sinon sa validité dépend de l'ordre dans lequel un agent charge les bundles — ce que le routeur ne garantit pas toujours (`selon-contexte` charge Voice quand E-motion est invoqué, jamais l'inverse).

## Le mot est le canal d'information fiable

RÈGLE [VOICE-R07] : **la règle cardinale de ce langage** — le texte est le **seul canal d'information qui survit à tout** : à la couleur coupée (daltonisme, forced-colors), au mouvement coupé (reduced-motion), à l'icône non comprise, au lecteur d'écran. Quand COLOR-UX dit « jamais la couleur seule », MOTION-UX « le mouvement n'informe jamais seul », ICONOGRAPHY-UX « jamais le dessin seul » — **le canal redondant qu'ils invoquent tous, c'est le mot.** Ce langage est donc le socle de la redondance de tout le système.
STATUT : propriété universelle
SOURCE : S10, S11
ÉNONCÉ : Le texte est le canal d'information de dernier recours du système : toute information portée par la couleur, le mouvement ou la forme reste disponible en mots, car le mot survit à la couleur coupée, au mouvement coupé, à l'icône incomprise et au lecteur d'écran.
MESURE : toute information portée par la couleur, le mouvement ou l'icône dispose d'un équivalent textuel

> **Pourquoi** : les trois autres canaux (couleur, mouvement, forme) sont rapides à percevoir mais faillibles ; le mot est plus lent mais **inconditionnel**. Un état d'erreur porte donc toujours le mot « Erreur » (INPUT), une résolution est *annoncée* (ALERT), un lien *décrit sa destination*. Retirer le mot pour « alléger » revient à retirer le seul canal garanti.

RÈGLE [VOICE-R08] : **le texte de lien et de bouton se suffit hors contexte.** « Cliquez ici », « En savoir plus », « OK » échouent : un lecteur d'écran qui liste les liens de la page, ou un utilisateur qui scanne, ne voit pas le contexte autour. Le libellé dit *où il mène* ou *ce qu'il fait* (WCAG 2.4.4 ; renvoi BUTTON-UX § Wording : « un verbe qui décrit la conséquence bat un label générique »).
STATUT : propriété universelle
SOURCE : S4, S17
ÉNONCÉ : Le libellé d'un lien ou d'un bouton se comprend hors de son contexte : il nomme la destination ou la conséquence de l'action, jamais une formule générique.
MESURE : aucun libellé de lien ou de bouton réduit à une formule générique (« cliquez ici », « en savoir plus », « OK »)

## Clarté d'abord — plain language

RÈGLE [VOICE-R09] : **dire la chose la plus simple qui soit vraie.** Phrases courtes, voix active, un sujet par phrase, le mot courant plutôt que le mot savant. On écrit pour être compris du premier coup, pas pour paraître sérieux.
STATUT : propriété universelle
SOURCE : S1, S18
ÉNONCÉ : L'écriture d'interface dit la chose la plus simple qui soit vraie : phrases courtes, voix active, un sujet par phrase, le mot courant plutôt que le mot savant.

RÈGLE [VOICE-R10] : **pas de jargon exposé à l'utilisateur.** Les termes techniques, codes d'erreur et sigles internes restent dans les logs et le support ; l'utilisateur lit une phrase humaine. Un acronyme inévitable se développe à sa première occurrence.
STATUT : propriété universelle
SOURCE : S3, S1
ÉNONCÉ : Aucun jargon technique, code d'erreur ni sigle interne n'est exposé à l'utilisateur, et un acronyme inévitable est développé à sa première occurrence.

> **Erreur fréquente** : croire qu'un vocabulaire technique inspire confiance. Il exclut — c'est le pendant écriture du « contraste qui rend lisible mais ne distingue pas » (COLOR) : un texte peut être grammaticalement parfait et rester incompréhensible pour qui ne partage pas le jargon.

RÈGLE [VOICE-R11] : **concision, mais pas au prix de la clarté.** On coupe les mots vides (« veuillez noter que », « afin de pouvoir »), pas l'information nécessaire. La concision sert la lisibilité (LAWS : Cognitive Load) ; elle ne justifie jamais de retirer le *pourquoi* ou le *comment corriger* d'un message.
STATUT : propriété universelle
SOURCE : S1, S18
ÉNONCÉ : La concision retire les mots vides et jamais l'information nécessaire : elle ne justifie pas de supprimer la cause d'un problème ni le moyen de le corriger.

## Le ton suit l'utilisateur (le quasi-axe)

RÈGLE [VOICE-R12] : **la voix ne change pas, le ton s'ajuste à l'état émotionnel.** Table de correspondance — c'est la structure d'axes de ce langage :
STATUT : parti pris d'identité
SOURCE : S2, S6
ÉNONCÉ : Le système tient une table de correspondance entre l'état de la personne et le ton employé, qui fixe notamment un succès routinier bref et factuel, sans félicitation ni célébration.

| État de l'utilisateur | Ton | Ce qu'on fait / ce qu'on évite |
|---|---|---|
| Routine, neutre | Clair, direct, discret | La voix par défaut ; on ne commente pas ce qui va de soi |
| Erreur *de l'utilisateur* | Calme, sans blâme, orienté solution | Dire *quoi corriger* ; jamais « vous avez fait une erreur », jamais culpabiliser |
| Erreur *système* / panne | Honnête, responsable, rassurant | Le produit assume (« Nous n'avons pas pu enregistrer ») ; proposer une suite, ne pas accuser l'utilisateur d'un bug |
| Action destructive | Direct, factuel, conséquence nommée | Nommer exactement ce qui sera perdu ; ni euphémisme (« nettoyer ») ni sur-dramatisation |
| Succès (routinier) | Bref, factuel | Confirmer et libérer ; pas de « Bravo ! », pas de confettis (écho MOTION : pas de célébration) |
| Succès (moment E-motion catalogué) | Chaleureux, ponctuel | Seul cas où le registre se réchauffe — cf. § Exception E-motion ci-dessus |
| Attente | Rassurant, informatif | Dire ce qui se passe (« Enregistrement… ») ; le visuel vient de MOTION, le mot d'ici |
| Vide / démarrage | Encourageant, orienté action | Distinguer « rien encore » de « rien trouvé » ; pointer la première action |

> **Pourquoi soigner particulièrement l'erreur et la fin** : Peak-End Rule (LAWS) — le souvenir d'une expérience est dominé par son pic (souvent une erreur) et sa fin. Un message d'erreur calme et utile, et un message de clôture net, pèsent plus que la moyenne des écrans.

RÈGLE [VOICE-R13] : **ne jamais blâmer l'utilisateur — règle cardinale du ton.** L'erreur est une information, pas un reproche. On décrit l'écart et la correction (« Le format attendu est JJ/MM/AAAA »), on ne qualifie pas l'utilisateur (« saisie invalide », « vous n'avez pas rempli… »). Quand la faute est côté système, le produit la prend à son compte.
STATUT : propriété universelle
SOURCE : S3, S13
ÉNONCÉ : Un message d'erreur ne qualifie jamais la personne : il décrit en texte l'écart constaté et la correction attendue, et le produit prend à son compte les défaillances système.
MESURE : toute erreur détectée est décrite en texte ; aucun message n'emploie de terme qualifiant la personne ou sa saisie (invalide, incorrect, illégal)

## Cohérence — une voix, un vocabulaire

RÈGLE [VOICE-R14] : **la voix est constante d'un écran à l'autre.** Pas de familiarité soudaine, pas de formalisme qui va et vient. Un utilisateur reconnaît le produit à sa manière de parler comme à ses couleurs (Gestalt/similarité, LAWS).
STATUT : propriété universelle
SOURCE : S2, S15
ÉNONCÉ : La voix ne change pas d'un écran à l'autre : ni familiarité soudaine, ni formalisme intermittent.

RÈGLE [VOICE-R15] : **un concept = un mot, partout.** « Supprimer » ne devient pas « Effacer » puis « Retirer » selon l'écran. Le lexique contrôlé vit dans `VOICE-UI.md` ; le principe est ici — c'est la version écriture des registres étanches de COLOR (une couleur = un sens ; un mot = un sens).
STATUT : propriété universelle
SOURCE : S8, S14
ÉNONCÉ : Un concept est désigné par un seul mot dans toute l'interface, et ce mot ne désigne pas un autre concept ailleurs.
MESURE : chaque concept du lexique n'apparaît que sous le mot retenu, à l'exclusion de ses synonymes écartés

> **Erreur fréquente** : varier les synonymes « pour ne pas se répéter », réflexe de rédaction littéraire. En UI, la répétition est une *fonctionnalité* : le même mot pour la même action réduit la charge cognitive et l'incertitude.

## Accessibilité et internationalisation

RÈGLE [VOICE-R16] : **le niveau de lecture reste bas par choix.** Plain language sert d'abord l'accessibilité cognitive (WCAG 3.1.5, AAA, vise un niveau collège) et les non-natifs. Aucun niveau chiffré n'est encore fixé pour ce produit — position explicite, pas oubli (cf. À approfondir).
STATUT : propriété universelle
SOURCE : S5, S18
ÉNONCÉ : Le niveau de lecture visé reste bas, au service de l'accessibilité cognitive et des personnes non natives ; aucun seuil chiffré n'est fixé à ce jour, et cette absence est une position assumée.

RÈGLE [VOICE-R17] : **écrire pour être traduisible, même monolingue.** Ne jamais **concaténer** des fragments de phrase par du code (l'ordre des mots change d'une langue à l'autre) ; ne pas coder la longueur en dur (certaines langues s'allongent ~30 %) — c'est un renvoi vers `measure` et vers la mécanique de troncature de VOICE-UI. Éviter les idiomes, l'humour et les jeux de mots qui ne franchissent pas les langues.
STATUT : propriété universelle
SOURCE : S7, S16, S19
ÉNONCÉ : Le texte d'interface s'écrit traduisible : aucune phrase construite par concaténation de fragments à l'exécution, aucune longueur codée en dur, et pas d'idiome ni de jeu de mots qui ne franchisse pas les langues.
MESURE : aucune chaîne d'interface assemblée par concaténation ; les variables passent par des paramètres nommés dans une chaîne complète

RÈGLE [VOICE-R18] : **le mot descriptif porte l'accessibilité non visuelle** — texte alternatif utile (pas « image »), `aria-label` qui dit l'action, texte de lien signifiant. C'est la même exigence que la redondance de COLOR, côté lecteur d'écran.
STATUT : propriété universelle
SOURCE : S11, S12
ÉNONCÉ : Le mot descriptif porte l'accessibilité non visuelle — texte alternatif utile, nom accessible qui dit l'action, texte de lien signifiant — et le nom accessible d'un contrôle contient le texte visible de son libellé.
MESURE : le nom accessible contient le texte visible du libellé

## Risque

RÈGLE [VOICE-R19] : table ci-dessous
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Le langage tient une table des risques de wording associant chaque cas de mauvais usage du mot à son risque principal et à sa sévérité.

| Cas | Risque principal | Sévérité |
|---|---|---|
| Message qui blâme l'utilisateur | Honte, abandon, perte de confiance (pic négatif, Peak-End) | Élevée |
| Erreur générique non actionnable (« Une erreur est survenue ») | Utilisateur bloqué sans issue — charge de résolution reportée (Tesler) | Élevée |
| Information portée par le style seul (rouge sans le mot) | Exclusion daltonisme / lecteur d'écran (WCAG 1.4.1) | Critique |
| Texte de lien/bouton non signifiant (« cliquez ici », « OK ») | Navigation lecteur d'écran cassée (WCAG 2.4.4) | Élevée |
| Jargon ou code technique brut exposé | Exclusion des non-experts, incompréhension | Moyenne à élevée |
| Vocabulaire incohérent (un concept, plusieurs mots) | Incertitude, l'utilisateur doute que ce soit la même action | Moyenne |
| Voix qui change de personnalité entre écrans | Produit perçu comme disparate, méfiance | Moyenne |
| Concaténation de fragments / longueur codée en dur | Traduction cassée, texte tronqué | Moyenne (élevée si multilingue) |
| Sur-promesse ou sur-célébration marketing dans l'UI produit | Ton faux, décalage avec le registre productif | Moyenne |

## Règle transversale

RÈGLE [VOICE-R20] : **le mot est le seul canal qui ne tombe jamais — il porte donc l'information, calmement, sans blâmer, dans un vocabulaire constant.** Voix stable, ton ajusté à l'utilisateur, clarté avant élégance.
STATUT : propriété universelle
SOURCE : S3, S4, S10
ÉNONCÉ : Le mot porte l'information quand les autres canaux tombent : il l'énonce sans blâmer, dans un vocabulaire constant, la clarté primant sur l'élégance.

> **Pourquoi** : c'est le socle des canaux redondants du système. COLOR, MOTION et ICONOGRAPHY disent tous « pas ce canal seul » — et se rabattent sur le texte. Si le texte lui-même est obscur, blâmant ou absent, la redondance de tout le système s'effondre. La voix n'est pas la couche décorative de l'UI : c'est sa couche d'information de dernier recours.

## Sources et niveau de confiance

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| S1 | Plain language, phrases courtes, voix active | [Nielsen Norman — Plain Language](https://www.nngroup.com/articles/plain-language-experts/), [GOV.UK — Content design: writing for GOV.UK](https://www.gov.uk/guidance/content-design/writing-for-gov-uk) | Établi — recherche utilisateur documentée |
| S2 | Voix constante / ton variable selon le contexte | [Mailchimp — Voice and Tone](https://styleguide.mailchimp.com/voice-and-tone/), [Shopify Polaris — Content](https://polaris.shopify.com/content/voice-and-tone) | Établi — convergence des guides de contenu majeurs |
| S3 | Ne jamais blâmer l'utilisateur ; l'erreur dit quoi corriger | [NN/g — Error-Message Guidelines](https://www.nngroup.com/articles/error-message-guidelines/), INPUT-UX (§ Contenu du message, Luke Wroblewski +22 %) | Établi |
| S4 | Texte de lien signifiant (pas « cliquez ici ») | [WCAG 2.4.4 — Link Purpose](https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context.html), [NN/g — Links](https://www.nngroup.com/articles/writing-links/) | Établi, standard d'accessibilité |
| S5 | Niveau de lecture accessible (viser ~niveau collège) | [WCAG 3.1.5 — Reading Level](https://www.w3.org/WAI/WCAG22/Understanding/reading-level.html) (AAA) | Établi (standard) ; niveau cible non encore chiffré pour ce produit |
| S6 | Registre « productif, pas expressif » | Reprise interne de MOTION-UX (dualité Carbon productif/expressif) | Décision d'identité interne, cohérente avec le reste du système |
| S7 | Ne pas concaténer, prévoir l'expansion de traduction | [W3C — Text size in translation](https://www.w3.org/International/articles/article-text-size), [Shopify Polaris — Grammar & mechanics](https://polaris.shopify.com/content/grammar-and-mechanics) | Établi — bonne pratique i18n |
| S8 | Cohérence lexicale (un concept, un mot) | [GOV.UK — Content design](https://www.gov.uk/guidance/content-design/writing-for-gov-uk), déclinaison écriture des registres COLOR | Établi par convergence |
| S9 | Soigner erreur et clôture (pic et fin) | Peak-End Rule (cf. LAWS-UX, Kahneman / NN/g) | Établi (mémoire) ; ampleur en UI contextuelle |
| S10 | La couleur n'est jamais le seul moyen visuel de véhiculer une information, d'indiquer une action, d'appeler une réponse ou de distinguer un élément — ce qui fonde le texte comme canal redondant obligatoire | [WCAG 2.2 — 1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) | Établi, standard d'accessibilité (niveau A) |
| S11 | Tout contenu non textuel dispose d'une alternative textuelle de même finalité ; un contenu non textuel qui est un contrôle porte un nom qui décrit sa fonction. Le texte alternatif dit pourquoi l'image est là et ne commence pas par « image » ou « photo » | [WCAG 2.2 — 1.1.1 Non-text Content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html) ; [NN/g — Alt Text: What to Write](https://www.nngroup.com/articles/write-alt-text/) | Établi, standard d'accessibilité (niveau A), complété par une synthèse NN/g |
| S12 | Pour un composant dont le libellé contient du texte, le nom accessible contient le texte présenté visuellement — norme la plus directement applicable à un langage d'interface | [WCAG 2.2 — 2.5.3 Label in Name](https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html) | Établi, standard d'accessibilité (niveau A) — bénéficie d'abord au pilotage vocal |
| S13 | Si une erreur de saisie est détectée automatiquement, l'élément en cause est identifié et l'erreur est décrite à l'utilisateur en texte (3.3.1, A) ; si des suggestions de correction sont connues, elles sont fournies (3.3.3, AA) | [WCAG 2.2 — 3.3.1 Error Identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html) ; [WCAG 2.2 — 3.3.3 Error Suggestion](https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion.html) | Établi, standards d'accessibilité (A et AA) — fonde le gabarit « quoi / pourquoi / comment corriger » |
| S14 | Les composants qui ont la même fonction dans un ensemble de pages sont identifiés de manière cohérente ; l'utilisateur ne doit pas avoir à se demander si des mots différents désignent la même chose | [WCAG 2.2 — 3.2.4 Consistent Identification](https://www.w3.org/WAI/WCAG22/Understanding/consistent-identification.html) ; [NN/g — Maintain Consistency and Adhere to Standards (heuristique 4)](https://www.nngroup.com/articles/consistency-and-standards/) | Établi (AA). **Nuance** : WCAG précise que « cohérent » n'est pas toujours « identique » (« Print receipt » / « Print invoice » sont conformes) — la règle interne « un concept = un mot » est plus stricte que la norme |
| S15 | La voix exprime le fond de la personnalité d'une organisation, le ton décrit la manière dont cette voix s'exprime et s'adapte aux situations ; le ton des messages d'erreur y est économique et direct | [Carbon Design System — Content overview](https://carbondesignsystem.com/guidelines/content/overview/) | Établi par convergence — deuxième design system public confirmant la distinction voix / ton (avec Mailchimp, S2) |
| S16 | La concaténation de fragments casse la traduction (ordre des mots, pluriels, ponctuation, séparation des mots) ; la recommandation est une chaîne complète à paramètres nommés, jamais des morceaux assemblés par le code | [Microsoft — Globalization: String concatenation](https://learn.microsoft.com/en-us/globalization/internationalization/concatenation) | Établi — documentation d'éditeur ; comble une lacune de S7, qui ne traite pas la concaténation |
| S17 | Les titres et les libellés décrivent le sujet ou la finalité — un libellé présent doit être exact et suffisamment descriptif | [WCAG 2.2 — 2.4.6 Headings and Labels](https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels.html) | Établi, standard d'accessibilité (AA) — complète 2.4.4 pour les libellés de bouton, que 2.4.4 ne couvre pas |
| S18 | Langage simple, niveau de lecture visé bas (~7e année), concision (« la manière la plus courte et la plus claire de donner l'information nécessaire à l'action ») et phrases commençant par un verbe | [Shopify Polaris — Content fundamentals](https://polaris-react.shopify.com/content/fundamentals) | Établi par convergence (avec S1). **Divergence à noter** : Polaris tolère le jargon « si c'est le mot qu'emploient réellement les marchands », là où ce fichier l'interdit sans nuance |
| S19 | L'expansion en traduction dépend de la longueur de la chaîne source : 200 à 300 % pour 10 caractères ou moins, 180 à 200 % de 11 à 20, et 130 % seulement au-delà de 70 caractères | [W3C — Text size in translation](https://www.w3.org/International/articles/article-text-size) | Établi. **Contredit ce fichier**, qui annonce « ~30 % » : ce chiffre n'est vrai que pour les textes longs, alors que les libellés courts d'interface — le cas le plus fréquent — peuvent doubler ou tripler |

*Le wording opérationnel de chaque composant reste sourcé dans son fichier (BUTTON-UX, INPUT-UX, ALERT-UX, FORM-UX) — ce langage en donne le cadre commun, il ne re-source pas chaque libellé.*

## À approfondir

- **Niveau de lecture cible** : fixer une fourchette mesurable (ex. indice de lisibilité) le jour où le produit a du contenu long — aujourd'hui position « bas par principe » sans chiffre.
- **Surface marketing / contenu de page** : un registre plus expressif (landing, articles) frotte avec le « productif seul » — frontière à trancher si ces pages entrent dans le périmètre produit (la documentation en a déjà : à cadrer).
- **RTL (sens de lecture)** : non couvert, décision produit non prise — même statut que le dark mode (COLOR).
- **Multilingue** : produit monolingue à ce jour ; les règles de traduisibilité sont écrites d'avance, non éprouvées.
- **Glossaire produit** : le lexique contrôlé de VOICE-UI est un noyau ; un glossaire complet naîtra avec le volume de surfaces.
- **Ton de la voix synthétique / notifications hors app** (e-mails, push) : canal voisin, non traité — à rattacher le jour où le produit émet hors de l'interface.
