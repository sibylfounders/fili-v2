---
sujet: "consentement"
type: "flow"
resume: "Décider s'il faut interrompre le visiteur pour un consentement, et si oui n'offrir que deux issues strictement équivalentes — le bandeau n'a aucune matière propre"
requires: ["alert", "button", "voice"]
selon-contexte: ["navigation (le lien permanent de retour sur le choix, en pied de page)", "overlay (seulement si le bandeau devient modal — ce n'est pas le défaut)", "modal (idem : voile, piège de focus, empilement)", "form (case d'acceptation liée à l'envoi d'un formulaire : extension form-sensitive-data, pas ce sujet)", "creation-compte (acceptation des CGU à l'inscription : extension creation-compte-consentement, pas ce sujet)"]
source-version: "1.1.0"
source-sha256: "a15d6ba34059bbdbe018207fb8b8f51ac8306a899b80d3a83b30c59f6fffc880"
source-file: "content/md/flows/CONSENTEMENT-UX.md"
---
# RULES — Consentement (flow, compilé)

> Condensé depuis `flows/CONSENTEMENT-UX.md` (v1.1.0) et `CONSENTEMENT-UI.md` (v1.1.0). Règles pour le build — la source fait autorité en cas de doute. Ne pas éditer à la main. Tokens : `dist/tokens.yaml`.

## Ce que ce sujet décide, et lui seul

RÈGLE : ce flow ne définit **aucun objet visuel neuf**. Le bandeau est un conteneur d'`alert` avec deux `button`, parfois un superposé. Ce qui lui appartient en propre, c'est **la décision d'interrompre** et **la symétrie du choix proposé**. Le reste est emprunté, et ne se réécrit jamais ici.

RÈGLE : il ne possède aucun token. Tout token qui naîtrait ici serait le signe d'une duplication — le bandeau consomme `alert`, `button`, la surface de `color`, le rythme de `spacing`, la largeur de `grid` et `radius.md`.

## La question préalable — avant de dessiner quoi que ce soit

RÈGLE [loi] : aucun bandeau ne s'affiche tant qu'un traitement soumis à consentement n'a pas été **identifié et listé**. L'inventaire des stockages (`cookies`, `localStorage`, `sessionStorage`, `IndexedDB`, service workers, appels à des domaines tiers) précède la maquette, jamais l'inverse. S'il ne contient rien de soumis à consentement, **on ne conçoit pas de bandeau**.
- mesure : inventaire daté ; aucun élément soumis à consentement → aucun bandeau.
- le secteur : GOV.UK écrit qu'un service n'utilisant que des cookies essentiels n'a pas besoin de bandeau — une page d'information suffit. Le DSFR décrit le bandeau comme s'affichant toujours, parce qu'il outille des sites d'État qui mesurent tous leur audience. Nous suivons GOV.UK, et c'est réversible.
- source : https://design-system.service.gov.uk/components/cookie-banner/

RÈGLE [loi] : un bandeau qui **déclare lui-même** n'utiliser que des traceurs techniques ou strictement nécessaires se contredit : son propre texte affirme qu'il n'a pas lieu d'être. Le signaler.
- mesure : le texte contient une formule d'exemption (« strictement nécessaires », « techniques uniquement », « aucun traceur publicitaire ») **et** l'inventaire ne relève aucun traceur soumis à consentement. Les deux conditions, jamais le texte seul — un site peut se déclarer sobre et charger une régie.

RÈGLE [loi] : quand **aucun dépôt ne varie** selon la réponse, le choix proposé est fictif. Un bouton « Refuser » qui ne refuse rien est un mensonge d'interface, même bienveillant. Le remède n'est pas de rendre le refus effectif : c'est de retirer une question qui n'avait pas lieu d'être posée.
- mesure : comparer l'état du stockage et les requêtes réseau après « Accepter » et après « Refuser ». États identiques → choix fictif.
- source : https://www.edpb.europa.eu/documents/guideline/guidelines-032022-on-deceptive-design-patterns-in-social-media-platform_en

> **Le design system constate, il ne qualifie pas.** Un audit rapporte l'inventaire mesuré et **pose la question** ; il ne conclut jamais « bandeau non requis ». Ce constat part au registre « à trancher », accompagné de l'inventaire — jamais au registre « à corriger ». La qualification dépend du droit applicable et de textes qui bougent ; une règle de design qui se prononcerait sur le droit serait fausse à la première réforme.

## Le choix, quand il est nécessaire

RÈGLE [loi] : refuser demande **exactement le même nombre d'actions** qu'accepter. Un refus qui passe par un écran de réglages quand l'acceptation tient en un clic n'est pas un refus offert.
- mesure : clics jusqu'au refus effectif = clics jusqu'à l'acceptation, les deux actions visibles simultanément, sans repli ni défilement.
- source : https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/comment-mettre-mon-site-web-en-conformite

RÈGLE [loi] : les deux actions portent le **même poids visuel** — même style de bouton, même taille, même contraste. Aucune n'est mise en avant par la couleur, le remplissage ou la position. C'est une contrainte du flow qui **s'impose au composant**, pas une exception du bouton.
- mesure : même valeur de `bouton.style`, dimensions rendues identiques à ±2 px, écart de contraste entre les deux ≤ 0,3:1.
- le secteur : la tentation constante est de donner le `fill` à l'acceptation « pour guider ». C'est exactement le nudge que la règle interdit.
- source : https://www.edpb.europa.eu/documents/guideline/guidelines-032022-on-deceptive-design-patterns-in-social-media-platform_en

RÈGLE [loi] : **le silence vaut refus.** Fermer le bandeau, l'ignorer, faire défiler ou poursuivre la navigation ne constituent jamais un consentement. Conséquence de conception : le bouton de fermeture **est** un refus, il ne se présente pas comme neutre.
- mesure : aucun dépôt soumis à consentement avant une action explicite sur un bouton d'acceptation.

RÈGLE [préférence] : les libellés nomment **ce qui est accepté**, pas l'assentiment — « Accepter les cookies de mesure d'audience », jamais « J'ai compris », « OK » ni « Continuer ».
- le secteur : le DSFR impose « Tout accepter » / « Tout refuser », plus courts et indépendants du contenu, au prix de la précision. Nous suivons GOV.UK, qui nomme la catégorie : un libellé qui nomme l'objet reste vrai quand le contenu du bandeau change.

RÈGLE [préférence] : le contenu du site **reste accessible** tant que le choix n'est pas fait — le bandeau informe, il ne prend pas la page en otage. Le *cookie wall* n'est pas illégal en soi en France : nous le refusons, nous ne prétendons pas qu'il est interdit.

## Où le bandeau se pose

RÈGLE [loi] : le bandeau **n'est jamais fixé** — ni `position: fixed`, ni `sticky` — pour ne masquer aucun élément qui reçoit le focus. Aucun token de superposition : pas de `z-index.overlay`, pas de voile, pas d'ombre d'élévation haute. Il se pose dans le flux, et la règle d'accessibilité est alors satisfaite **par construction** plutôt que par vigilance.
- mesure : `position` calculée ≠ `fixed` et ≠ `sticky` ; parcours clavier complet bandeau affiché, aucun élément focalisé recouvert.
- source : https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html

RÈGLE [préférence] : le bandeau est placé **immédiatement après l'ouverture de `<body>`, avant le lien d'évitement**, pour être rencontré en premier au clavier. Un bandeau visuellement en haut mais tardif dans le DOM oblige à traverser toute la page pour répondre à une question qui bloque la lecture.

RÈGLE [loi] : les seuils de contraste habituels s'appliquent **sans dérogation** — 4,5:1 pour le corps, 3:1 pour les traits et les bordures des deux boutons. Aucune tolérance liée au caractère temporaire du bandeau : c'est le premier élément rencontré, et il bloque la lecture tant qu'il n'est pas traité.

RÈGLE [préférence] : apparition par **transition d'opacité courte, sans déplacement** ; aucun glissement, aucun rebond, aucun délai avant l'activation des boutons. Sous `prefers-reduced-motion: reduce`, apparition instantanée. Un bandeau qui glisse 400 ms puis se stabilise fait manquer le premier clic.

RÈGLE [préférence] : le style commun des deux actions est libre — les deux en `ghost` ou les deux en `fill`. Notre défaut est **`ghost` pour les deux** : le bandeau est une information, pas une action attendue.

## Après le choix, et revenir dessus

RÈGLE [préférence] : le choix est **mémorisé six mois**, acceptation comme refus, et n'est pas redemandé pendant cette durée. GOV.UK mémorise un an, la CNIL recommande six mois : nous prenons la valeur la plus courte, donc la plus protectrice, et la seule qui satisfasse les références simultanément.

RÈGLE [préférence] : après le choix, un message de confirmation **remplace** le bandeau — il énonce ce qui a été choisi, porte le moyen d'y revenir, et un moyen de le fermer. Une disparition silencieuse ne confirme rien.
- mesure : message annoncé (`role="alert"`), focus déplacé par programme, fermeture rendant le focus à un point stable.
- source : https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html

RÈGLE [loi] : un moyen **permanent** de revenir sur son choix est atteignable depuis **toutes** les pages, sans avoir à retrouver le bandeau. Le retrait doit être aussi simple que le consentement.
- mesure : lien ou bouton dédié dans le pied de page de chaque page, menant à un écran où le choix courant est visible et modifiable.

## Gravité — de quoi dépend la sévérité d'un constat

| Ce que le site dépose | Ce que le flow exige |
|---|---|
| Rien, ou seulement des traceurs exemptés (langue, thème, panier, authentification, mémorisation du choix) | Aucun bandeau. Une page d'information suffit |
| Mesure d'audience limitée au seul éditeur, non recoupée, anonymisée | Question ouverte : remonter en « à trancher » avec l'inventaire, ne pas conclure |
| Publicité, personnalisation, réseaux sociaux, recoupement inter-sites | Bandeau complet : toutes les règles ci-dessus, sans exception |
| Aucun dépôt ne varie selon la réponse | Le choix est fictif — retirer la question, pas rendre le refus effectif |

## Frontières — ce que ce sujet ne décide pas

| Domaine | Propriétaire |
|---|---|
| Case d'acceptation liée à l'envoi d'un formulaire | `form` (extension `form-sensitive-data`) |
| Acceptation des CGU à l'inscription | `creation-compte` (extension `creation-compte-consentement`) |
| Conteneur du message : structure, tone, icône, persistance, fermeture | `alert` |
| Voile, piège de focus, empilement — si et seulement si le bandeau devient modal | `overlay` / `modal` |
| Affordance, chargement, anti double-activation des deux boutons | `button` |
| Ton et wording des libellés | `voice` |
| Lien permanent de retour sur le choix, en pied de page | `navigation` |
| Texte juridique, liste des finalités, durées de conservation, base légale | **Hors design system** — produit et conseil juridique |

## Non couvert — poser la question, ne rien trancher

- **Granularité par finalité** : le DSFR impose une modale de réglage par finalité, GOV.UK une page dédiée à boutons radio. Non tranché — le premier consommateur avec plus de deux finalités forcera la décision.
- **Cookie wall** : notre refus est un parti pris. Un consommateur dont le modèle économique en dépend demande un arbitrage documenté, pas un refus de principe.
- **Signaux navigateur** : si le consentement devient exprimable par un réglage du navigateur, le bandeau devient un repli pour les visiteurs sans signal. Rouvrir à l'adoption du texte.
- **Ressources tierces sans cookie** (polices, cartes, vidéos servies par un tiers) : elles transmettent l'adresse IP sans déposer de traceur. Ce n'est pas du consentement au sens de ce sujet, mais c'est rencontré dans le même audit. Sujet voisin, non ouvert.
