---
component: consentement
layer: ux
type: flow # une séquence dans le temps — constater, interrompre ou non, mémoriser, permettre le retour
version: 1.1.0 # 1.1.0 : le sujet quitte patterns pour flows (2026-07-27). Il ne décrit pas une composition d'écran comme FORM ou NAVIGATION, mais une séquence qui se joue dans le temps et se mémorise six mois — la définition d'un flow, à côté de creation-compte. Emprunter des composants ne fait pas une composition. 1.0.0 : naissance du sujet (2026-07-27). Déclencheur : l'audit externe Passion Courtage a rencontré un bandeau de consentement dont le texte déclarait lui-même n'utiliser que des traceurs techniques — donc exemptés — et dont le bouton « Refuser » ne refusait rien. La règle du poids visuel des deux actions vivait jusqu'ici dans BUTTON-UX (BUTTON-R76), mal rangée : elle est rapatriée ici. Cf. DECISIONS.md 2026-07-27.
last_updated: 2026-07-27
companion: CONSENTEMENT-UI.md
confidence: mixed
---

# Consentement — Couche UX (flow de parcours)

> Ce fichier n'est ni un composant ni un pattern d'écran. Le bandeau n'a pas de matière propre :
> c'est un conteneur d'alerte (ALERT), parfois un superposé (OVERLAY), avec deux boutons
> (BUTTON). Ce qui appartient à ce sujet, et à lui seul, c'est **la décision d'interrompre**
> et **la symétrie du choix proposé**. Le reste est emprunté.

## Note de transposition (à lire en premier)

RÈGLE [CONSENTEMENT-R01] : ce sujet ne définit aucun objet visuel nouveau. Il définit un parcours : constater un besoin, interrompre ou non, proposer deux issues équivalentes, mémoriser, permettre le retour.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Ce document décrit une séquence de décision, non un composant ; les tokens et les états visuels appartiennent aux sujets empruntés (ALERT, BUTTON, OVERLAY).

> **Pourquoi ce sujet naît maintenant** : la règle du poids visuel des deux actions vivait
> dans BUTTON-UX, où personne ne va la chercher, et où elle n'avait pas de place pour la
> question qui la précède — *faut-il un bandeau ?*. Une règle rangée au mauvais endroit est
> une règle qu'on n'applique pas.

## Frontières d'autorité (la table de référence)

RÈGLE [CONSENTEMENT-R02] : chaque règle du domaine consentement a exactement un propriétaire. En cas de doute, cette table tranche :
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Ce document fournit une table attribuant à chaque règle du domaine consentement un propriétaire unique.

| Domaine | Propriétaire |
|---|---|
| Décision d'afficher ou non un bandeau ; symétrie et libellés des deux issues ; mémorisation ; retour sur le choix | **CONSENTEMENT-UX** |
| Case à cocher d'acceptation liée à l'envoi d'un formulaire (traitement des données saisies) | FORM-UX (`form-sensitive-data`) |
| Acceptation des CGU et de la politique de confidentialité à l'inscription | CREATION-COMPTE-UX (`creation-compte-consentement`) |
| Conteneur du message : structure, tone, icône, persistance, fermeture, tokens | ALERT-UX / ALERT-UI |
| Voile, piège de focus, empilement — si et seulement si le bandeau devient modal | OVERLAY-UX / MODAL-UX |
| Affordance, état de chargement, anti double-activation des deux boutons | BUTTON-UX |
| Contraste, épaisseur, rayon du conteneur | COLOR-UI, BORDER-UI, RADIUS-UI |
| Texte juridique, liste des finalités, durées de conservation, base légale | Hors design system — produit et conseil juridique |

> **La dernière ligne est la plus importante.** Ce référentiel décrit des interfaces. Il ne
> qualifie pas juridiquement un traitement, et ne doit jamais être lu comme un avis de droit.

## La question préalable — avant de dessiner quoi que ce soit

RÈGLE [CONSENTEMENT-R03] : aucun bandeau ne s'affiche tant qu'un traitement soumis à consentement n'a pas été **identifié et listé**. L'inventaire des stockages et des appels tiers précède la maquette, jamais l'inverse.
STATUT : propriété universelle
SOURCE : S1, S2
ÉNONCÉ : Un bandeau de consentement ne s'affiche que si le site dépose au moins un traceur soumis à consentement ; l'inventaire des stockages doit être établi avant de concevoir le bandeau.
MESURE : inventaire daté des cookies, `localStorage`, `sessionStorage`, `IndexedDB`, service workers et appels à des domaines tiers. S'il ne contient aucun élément soumis à consentement, aucun bandeau n'est conçu.
POURQUOI : interrompre chaque visiteur pour demander une autorisation dont on n'a pas besoin est une interruption sans cause. Elle coûte une décision à 100 % des arrivants, n'apporte aucune protection supplémentaire, et habitue le public à cliquer sans lire — ce qui abîme les consentements qui, eux, comptent.

RÈGLE [CONSENTEMENT-R04] : le design system **constate**, il ne **qualifie** pas. Un audit rapporte la liste mesurée des stockages et pose la question ; il ne conclut jamais « bandeau non requis ». Ce constat se remonte au registre « à trancher », accompagné de l'inventaire, jamais au registre « à corriger ».
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : L'audit rapporte l'inventaire mesuré des stockages et pose la question de la nécessité du bandeau, sans trancher la qualification juridique.
POURQUOI : la qualification dépend du droit applicable, de la finalité réelle des traitements et de textes qui bougent — la proposition européenne « Digital Omnibus » de novembre 2025 (S6) réécrit précisément ces exemptions. Une règle de design qui se prononcerait sur le droit serait fausse à la première réforme, et engagerait une responsabilité qui n'est pas la nôtre.

RÈGLE [CONSENTEMENT-R05] : un bandeau qui déclare lui-même n'utiliser que des traceurs techniques ou strictement nécessaires **se contredit** : son propre texte affirme qu'il n'a pas lieu d'être. Le signaler.
STATUT : propriété universelle
SOURCE : S1, S2
ÉNONCÉ : Si le texte du bandeau affirme que le site n'utilise que des traceurs strictement nécessaires, et que l'inventaire le confirme, le bandeau est signalé comme sans objet.
MESURE : le texte du bandeau contient une formule d'exemption (« strictement nécessaires », « techniques uniquement », « aucun traceur publicitaire ») **et** l'inventaire de R03 ne relève aucun traceur soumis à consentement.
CONTRE : la formule peut être inexacte — un site peut se déclarer sobre et charger une régie. La mesure exige donc les deux conditions, jamais le texte seul.
POURQUOI : c'est le cas le plus fréquent chez les petites structures. Le bandeau est posé par précaution, par imitation, ou fourni par un thème. Personne ne vérifie jamais qu'il correspond à un besoin, et il survit des années.

RÈGLE [CONSENTEMENT-R06] : quand aucun dépôt ne varie selon la réponse, le choix proposé est **fictif**. Un bouton « Refuser » qui ne refuse rien est un mensonge d'interface, même bienveillant.
STATUT : propriété universelle
SOURCE : S3
ÉNONCÉ : Chaque issue proposée doit produire un effet observable et différent ; un choix sans conséquence ne doit pas être présenté comme un choix.
MESURE : comparer l'état du stockage et les requêtes réseau après « Accepter » et après « Refuser ». Si les deux états sont identiques, le choix est fictif.
POURQUOI : cela relève de la catégorie *Left in the Dark* du CEPD — l'interface laisse croire à un contrôle qui n'existe pas. Le remède n'est pas de rendre le refus effectif : c'est de retirer une question qui n'avait pas lieu d'être posée.

## Le choix, quand il est nécessaire

RÈGLE [CONSENTEMENT-R07] : refuser demande **exactement le même nombre d'actions** qu'accepter. Un refus qui passe par un écran de réglages quand l'acceptation tient en un clic n'est pas un refus offert.
STATUT : propriété universelle
SOURCE : S2, S3
ÉNONCÉ : Le refus doit être atteignable en autant d'actions que l'acceptation, au même niveau de l'interface.
MESURE : nombre de clics jusqu'au refus effectif = nombre de clics jusqu'à l'acceptation, et les deux actions sont visibles simultanément sans repli ni défilement.
POURQUOI : c'est la définition même de la catégorie *Obstructing* du CEPD, et l'exigence de la CNIL depuis les lignes directrices modificatives : refuser doit être aussi simple qu'accepter.

RÈGLE [CONSENTEMENT-R08] : les deux actions portent le **même poids visuel** — même style de bouton, même taille, même contraste. Aucune n'est mise en avant par la couleur, le remplissage ou la position.
STATUT : propriété universelle
SOURCE : S2, S3
ÉNONCÉ : Les boutons d'acceptation et de refus doivent avoir un traitement visuel strictement identique.
MESURE : même classe de style, mêmes dimensions à ±2 px, écart de contraste entre les deux boutons ≤ 0,3:1.
CONTRE : cette règle arrivait de BUTTON-R76, où elle était formulée comme une exception au modèle style × tone du bouton. Elle n'en est pas une : c'est une contrainte du pattern qui s'impose au composant, pas un cas particulier du composant.
POURQUOI : le déséquilibre visuel oriente le choix sans le contraindre — c'est la définition de *Stirring* chez le CEPD, et la CNIL exige des boutons présentés « au même niveau et selon un format identique ». C'est aussi, sur un site commercial, le point le plus exposé en cas de contrôle.

RÈGLE [CONSENTEMENT-R09] : le silence vaut refus. Fermer le bandeau, l'ignorer, faire défiler la page ou poursuivre la navigation ne constituent jamais un consentement.
STATUT : propriété universelle
SOURCE : S2
ÉNONCÉ : L'absence d'action ne doit jamais être interprétée comme un consentement ; l'état par défaut est le refus.
MESURE : aucun dépôt soumis à consentement avant une action explicite sur un bouton d'acceptation.
POURQUOI : le CEPD pose l'absence de consentement comme état par défaut jusqu'à ce que le consentement soit donné. La conséquence de conception est nette : le bouton de fermeture est un refus, il ne doit pas être présenté comme neutre.

RÈGLE [CONSENTEMENT-R10] : les libellés nomment **ce qui est accepté**, pas l'assentiment. « Accepter les cookies de mesure d'audience », pas « J'ai compris », « OK » ni « Continuer ».
STATUT : parti pris d'identité
SOURCE : S1
CONTRE : le DSFR (S4) impose « Tout accepter » et « Tout refuser », plus courts et indépendants du contenu, au prix de la précision. GOV.UK nomme la catégorie (« Accept analytics cookies »). Les deux positions sont défendables ; nous suivons GOV.UK parce qu'un libellé qui nomme l'objet reste vrai quand le contenu du bandeau change.
ÉNONCÉ : Chez nous, les libellés des deux actions nomment la catégorie de traceurs concernée plutôt que d'exprimer un assentiment général.

RÈGLE [CONSENTEMENT-R11] : le contenu du site reste accessible tant que le choix n'est pas fait — le bandeau informe, il ne prend pas la page en otage.
STATUT : parti pris d'identité
SOURCE : interne
CONTRE : le *cookie wall* n'est pas illégal en soi en France depuis la décision du Conseil d'État du 19 juin 2020, et la CNIL l'apprécie au cas par cas. Notre position est donc un parti pris, pas une norme : nous refusons le mur, nous ne prétendons pas qu'il est interdit.
ÉNONCÉ : Chez nous, aucun contenu n'est bloqué tant que le visiteur n'a pas répondu au bandeau.

## Où le bandeau se pose

RÈGLE [CONSENTEMENT-R12] : le bandeau ne doit jamais masquer, même partiellement, un élément qui reçoit le focus. En pratique : pas de `position: fixed`, pas de `sticky`.
STATUT : propriété universelle
SOURCE : S1, S5
ÉNONCÉ : Le bandeau de consentement ne doit pas être fixé à l'écran, afin de ne jamais recouvrir un élément focalisé.
MESURE : parcours clavier complet de la page bandeau affiché ; aucun élément focalisé n'est recouvert.
POURQUOI : c'est l'application directe du critère WCAG 2.2 « Focus Not Obscured », et la raison explicite pour laquelle GOV.UK interdit le bandeau collant. Un bandeau fixé en bas d'écran masque exactement ce que le clavier atteint en fin de page.

RÈGLE [CONSENTEMENT-R13] : le bandeau est placé immédiatement après l'ouverture de `<body>`, **avant** le lien d'évitement, pour être rencontré en premier au clavier.
STATUT : implémentation de référence
SOURCE : S1, S9
ÉNONCÉ : Placer le bandeau en tout premier dans le corps du document, avant le lien d'évitement.
POURQUOI : un bandeau visuellement en haut mais tardif dans le DOM oblige l'utilisateur clavier à traverser toute la page pour répondre à une question qui bloque sa lecture.

## Après le choix

RÈGLE [CONSENTEMENT-R14] : le choix est mémorisé et **n'est pas redemandé** à chaque visite. Notre durée de référence est de six mois, pour l'acceptation comme pour le refus.
STATUT : parti pris d'identité
SOURCE : S2, S1, S6
CONTRE : GOV.UK mémorise un an, la CNIL recommande six mois, et la proposition « Digital Omnibus » retient au moins six mois pour le refus. Nous alignons sur six mois — la valeur la plus courte des trois, donc la plus protectrice pour le visiteur, et la seule qui satisfait les trois références simultanément.
ÉNONCÉ : Chez nous, le choix exprimé est conservé six mois, sans nouvelle sollicitation pendant cette durée, refus compris.

RÈGLE [CONSENTEMENT-R15] : après le choix, un message de confirmation **remplace** le bandeau : il énonce ce qui a été choisi, porte le moyen de revenir dessus, et un moyen de le fermer.
STATUT : implémentation de référence
SOURCE : S1, S8
ÉNONCÉ : Après le choix, afficher un message de confirmation en lieu et place du bandeau, énonçant le choix retenu et offrant un lien pour le modifier ainsi qu'un bouton de fermeture.
MESURE : le message est annoncé (`role="alert"`), reçoit le focus par programme, et sa fermeture rend le focus à un point stable de la page.
POURQUOI : une disparition silencieuse ne confirme rien. Sans retour, l'utilisateur de lecteur d'écran ne sait pas si son clic a été pris en compte, et personne ne sait ce qui a été enregistré.

## Revenir sur son choix

RÈGLE [CONSENTEMENT-R16] : un moyen permanent de revenir sur son choix est atteignable depuis toutes les pages, sans avoir à retrouver le bandeau.
STATUT : propriété universelle
SOURCE : S2, S4, S1
ÉNONCÉ : Un point d'accès permanent, présent sur toutes les pages, doit permettre de modifier ou retirer le choix exprimé.
MESURE : un lien ou un bouton dédié est présent dans le pied de page de chaque page, et mène à un écran où le choix courant est visible et modifiable.
POURQUOI : le retrait doit être aussi simple que le consentement. Les trois références du panel convergent : le DSFR impose le lien en pied de page, GOV.UK une page « Cookies » dédiée, la CNIL exige la réversibilité.

## Risque

RÈGLE [CONSENTEMENT-R17] : le niveau d'exigence ne dépend pas du bandeau mais de ce que le site dépose.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Ce document fournit une table reliant la nature des traitements au niveau d'exigence attendu sur le pattern.

| Ce que le site dépose | Ce que le pattern exige |
|---|---|
| Rien, ou seulement des traceurs exemptés (choix de langue, thème, panier, authentification, mémorisation du choix lui-même) | Aucun bandeau. Une page d'information suffit. R03, R05 |
| Mesure d'audience limitée au seul éditeur, non recoupée, statistiques anonymisées | Question ouverte : selon les conditions remplies, l'exemption s'applique ou non. Remonter en « à trancher » avec l'inventaire. R04 |
| Publicité, personnalisation, réseaux sociaux, recoupement inter-sites | Bandeau complet : R07 à R16 sans exception |
| Aucun dépôt ne varie selon la réponse | Le choix est fictif : R06 |

## Sources et niveau de confiance

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| S1 | Pas de bandeau si le service n'utilise que des cookies essentiels (une page d'information suffit) ; libellés nommant la catégorie ; interdiction du bandeau collant au nom du focus non masqué ; placement avant le lien d'évitement ; message de confirmation avec `role="alert"`, focus déplacé et bouton de fermeture ; mémorisation un an | [GOV.UK Design System — Cookie banner](https://design-system.service.gov.uk/components/cookie-banner/) ; [GOV.UK — Cookies page](https://design-system.service.gov.uk/patterns/cookies-page/) | Établi — c'est le seul design system du panel qui spécifie le DOM, le focus et le texte de confirmation. Adopté ici pour R10, R12, R13, R15 |
| S2 | Catégories de traceurs exemptées de consentement (mémorisation du choix, authentification et sécurité, panier, personnalisation d'interface attendue, équilibrage de charge, accès limité aux contenus payants, mesure d'audience sous conditions) ; refuser aussi simple qu'accepter, boutons au même niveau et de format identique ; le silence vaut refus ; conservation du choix recommandée six mois ; réversibilité | [CNIL — Cookies et traceurs : que dit la loi ?](https://www.cnil.fr/fr/cookies-traceurs-que-dit-la-loi) ; [CNIL — Mettre son site en conformité](https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/comment-mettre-mon-site-web-en-conformite) ; [CNIL — Mesure d'audience exemptée](https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies-solutions-pour-les-outils-de-mesure-daudience) | Établi, régulateur national — cité pour le fait, jamais pour la qualification d'un cas particulier (cf. R04) |
| S3 | Six catégories de conception trompeuse : *Overloading*, *Skipping*, *Stirring*, *Obstructing*, *Fickle*, *Left in the Dark*. L'absence de consentement est l'état par défaut ; l'expression du refus doit être aussi simple que celle du consentement | [CEPD — Lignes directrices 03/2022, adoptées le 24 février 2023](https://www.edpb.europa.eu/documents/guideline/guidelines-032022-on-deceptive-design-patterns-in-social-media-platform_en) | Établi, régulateur européen. Les catégories sont nommées telles quelles ; nous en faisons l'application au bandeau, ce que le texte ne fait pas explicitement — l'inférence est nôtre |
| S4 | Quatre actions imposées (Personnaliser, Tout refuser, Tout accepter, Fermer) ; granularité par finalité dans une modale ; lien d'accès permanent obligatoire en pied de page ; position et ordre des boutons non modifiables | [DSFR — Gestionnaire de consentement](https://www.systeme-de-design.gouv.fr/version-courante/fr/composants/gestionnaire-de-consentement) | Établi — seul système du panel à imposer la granularité par finalité et le lien permanent. Nous divergeons sur les libellés (R10) |
| S5 | Un élément qui reçoit le focus ne doit pas être masqué par un contenu ajouté | [WCAG 2.2 — 2.4.11 Focus Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html) | Établi, standard (AA) — c'est la norme qui fonde l'interdiction du bandeau collant |
| S6 | Proposition de la Commission européenne du 12 novembre 2025 : nouvelles exemptions de stockage (article 88a), consentement exprimable par signaux automatisés lisibles par machine (article 88b), pas de nouvelle sollicitation pendant au moins six mois après un refus | [Osborne Clarke — analyse du Digital Omnibus](https://www.osborneclarke.com/insights/digital-omnibus-reshapes-eu-cookie-rules-leaves-banner-fatigue-largely-intact) ; [Taylor Wessing — Digital Omnibus et cookies](https://www.taylorwessing.com/en/global-data-hub/2026/the-digital-omnibus-proposal/gdh---the-digital-omnibus---cookies) | **Non stabilisé — proposition, non adoptée.** Citée uniquement pour justifier R04 : les règles bougent, le design system ne qualifie pas |
| S7 | **Relevé de benchmark, 2026-07-27 — qui documente ce pattern ?** Neuf design systems interrogés. Résultat : **2 sur 9** (GOV.UK, DSFR), tous deux publics. Sept absents : NHS, Carbon, Material 3, Polaris, Atlassian, Spectrum, Fluent 2. Détail et URL dans la section « Benchmark » ci-dessous | Relevé interne sur sources primaires (index de composants et de patterns officiels) | Établi — mesuré. Le NHS a le sujet en attente publique depuis 2020 sans l'avoir publié |
| S8 | Un message qui rend compte du résultat d'une action doit être annoncé sans déplacer le focus de force, via un rôle approprié | [WCAG 2.2 — 4.1.3 Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) | Établi, standard (AA) — c'est la norme qui fonde le `role="alert"` de R15, que GOV.UK applique sans la citer |
| S9 | L'ordre de parcours au clavier doit suivre un enchaînement qui préserve le sens et l'utilisabilité | [WCAG 2.2 — 2.4.3 Focus Order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html) | Établi, standard (A) — fonde R13 : un bandeau bloquant atteint en fin de parcours rompt l'enchaînement |

## Benchmark — relevé du 2026-07-27

> Le panel est affiché pour que personne n'ait à nous croire sur parole : ce sont les sources
> qu'un contradicteur irait lire, et ce qu'elles disent réellement, y compris quand elles nous
> contredisent.

**Qui documente le bandeau de consentement — 2 systèmes sur 9**

| Système | Statut | Ce qu'il en dit |
|---|---|---|
| GOV.UK Design System | **Présent** | Composant complet : pas de bandeau si cookies essentiels seuls, libellés nommant la catégorie, interdiction du collant, placement avant le lien d'évitement, confirmation annoncée, mémorisation un an |
| DSFR (France) | **Présent** | Composant complet : quatre actions imposées, granularité par finalité, lien permanent en pied de page, position et ordre non modifiables. Ne documente ni la confirmation après choix, ni l'ordre de focus |
| NHS digital service manual | Absent | Demandé publiquement au catalogue (dépôt de suivi), jamais publié |
| Carbon (IBM) | Absent | Aucun composant ni pattern de consentement dans les deux index |
| Material 3 (Google) | Absent | Aucune page de consentement sur le domaine |
| Shopify Polaris | Absent | `Banner` existe, mais c'est un conteneur de message générique |
| Atlassian Design System | Absent | `Banner`, `Flag`, `Section message` — aucune règle de consentement |
| Adobe Spectrum | Absent | `Alert banner`, `In-line alert` — aucune règle de consentement |
| Fluent 2 (Microsoft) | Absent | Aucune page de consentement sur le domaine |

**Ce que le relevé dit vraiment.** Le sujet est porté exclusivement par les design systems
d'État. Les six systèmes de produit l'ignorent — ce qui se comprend : ils outillent des
applications authentifiées, pas des sites publics soumis à l'ePrivacy. La conséquence pour
nous est double. D'abord, il n'y a pas de convergence de marché à invoquer : nos règles
s'appuient sur deux précédents et sur des textes de régulateurs, pas sur un consensus de
neuf systèmes comme pour la bordure. Ensuite, c'est un terrain où un design system privé
apporte quelque chose, parce que presque personne ne l'a écrit.

**Le point où nos deux précédents divergent.** GOV.UK dit : pas de bandeau si le service
n'utilise que des cookies essentiels. Le DSFR décrit le bandeau comme s'affichant toujours à
l'arrivée, sans poser la question préalable — parce qu'il outille des sites d'État qui
mesurent tous leur audience. Notre R03 suit GOV.UK. C'est un choix, et il est réversible.

## À approfondir

- **Signaux navigateur** (article 88b de la proposition Digital Omnibus) : si le consentement
  devient exprimable par un réglage du navigateur, le bandeau change de nature — il devient un
  repli pour les visiteurs sans signal. Rouvrir le sujet à l'adoption du texte.
- **Granularité par finalité** : le DSFR impose une modale de réglage par finalité, GOV.UK une
  page dédiée avec des boutons radio. Nous n'avons pas tranché entre les deux ; le premier
  consommateur qui aura plus de deux finalités forcera la décision.
- **Cookie wall** : R11 est un parti pris. Un consommateur dont le modèle économique en dépend
  demandera un arbitrage documenté, pas un refus de principe.
- **Ressources tierces sans cookie** : polices, cartes et vidéos chargées depuis un domaine
  tiers transmettent l'adresse IP du visiteur sans déposer le moindre traceur. Ce n'est donc
  pas du consentement au sens de ce sujet — mais c'est rencontré au même moment, dans le même
  audit. Sujet voisin à ouvrir, probablement dans PERFORMANCE-UX ou dans un sujet propre.
