---
sujet: "creation-compte"
type: "flow"
resume: "Parcours de création de compte : demander le minimum, choisir et sécuriser la méthode, gérer les états inter-écrans, puis conduire à une première valeur sans inventer de règles de composant."
requires: ["form", "input", "button", "alert", "voice"]
selon-contexte: ["creation-compte-verification-email", "creation-compte-sso-social", "creation-compte-force-mot-de-passe", "creation-compte-email-deja-utilise", "creation-compte-consentement"]
source-version: "1.4.0"
source-sha256: "3b81433c41d652dfb0688dc14cdf23762dbd4dbff6df3a58377af60e10e778d1"
source-file: "content/md/flows/CREATION-COMPTE-UX.md"
---
# RULES — Création de compte (flow, compilé)

> Généré mécaniquement depuis `content/md/flows/CREATION-COMPTE-UX.md` (v1.3.2, SHA-256 `7aa1fb9eb9dc9f84951bc7fc5f33611c664a92be1d96134d90399161fa2db54b`). Ne pas éditer : la source fait autorité.

## Note de transposition

RÈGLE : le modèle à 3 axes (style/tone/size) ne s'applique pas — un parcours n'a pas de variante visuelle. Un pattern n'en avait déjà pas (une séquence, pas un objet) ; un flow est une séquence *de patterns*, un cran plus haut encore. Ce qu'il coordonne, ce ne sont pas des champs et un bouton, mais des **moments** : plusieurs écrans, plusieurs décisions, un but unique — que la personne reparte avec un compte utilisable.

RÈGLE : le flow ne possède aucun état visuel propre. Les états qu'il fait vivre (saisie, attente d'un verdict serveur, email en attente de vérification, compte créé) sont rendus par les composants qu'il coordonne — bouton en `loading`, `alert` d'information, champ en erreur — jamais par un token « création-compte-* » qui n'existe pas.

## But

Un parcours de création de compte transforme un visiteur en utilisateur authentifiable, en réclamant **le strict minimum** pour que le compte existe, puis en le déposant devant la première valeur du produit. Sa fonction n'est ni celle du formulaire (assembler une saisie cohérente sur un écran), ni celle du bouton (déclencher), ni celle de l'input (capturer) — c'est de **décider ce qu'on demande, quand, en combien de moments**, et d'arbitrer les tensions qui n'existent qu'au niveau du parcours : la friction contre l'abandon, l'ouverture de l'accès contre la vérification, l'entraide (« vous avez déjà un compte ? ») contre la sécurité (l'énumération de comptes), le consentement légal contre la fluidité.

RÈGLE : le principe directeur du parcours — **le minimum pour créer, le reste plus tard.** Tout ce qui n'est pas indispensable à l'existence du compte (préférences, profil enrichi, équipe, facturation) se demande *après* la première valeur, par profilage progressif, jamais en barrage à l'entrée. Chaque champ ajouté à l'inscription est un impôt prélevé avant toute contrepartie.

> **Pourquoi** : la création de compte est le point du produit où l'engagement est le plus faible et l'abandon le plus facile — la personne n'a encore rien reçu. Baymard mesure la « création de compte forcée » comme l'une des premières causes d'abandon de tunnel ; chaque friction non justifiée par une valeur déjà perçue se paie en départs.

## Frontières d'autorité (la table de référence)

RÈGLE : un flow **n'invente aucune règle de composant ou de pattern** — il les séquence. En cas de doute, cette table tranche :

| Domaine | Propriétaire |
|---|---|
| Champ e-mail / mot de passe : type, label, helper, valeur, état local, erreur locale, ARIA, bascule d'affichage du mot de passe | INPUT-UX / INPUT-UI |
| Mécanique de validation d'un champ isolé (blur, différé pendant la frappe, wording du message) | INPUT-UX |
| Assemblage d'**un écran** de saisie : ordre intra-écran, convention requis/optionnel, résumé d'erreurs, focus après échec, cycle de soumission de l'écran | FORM-UX / FORM-UI |
| Mécanique **multi-écran** : retour sans perte, ne pas redemander (ask-once), récapitulation | FORM-UX § multi-étapes (extension `form-multi-step`) — le flow s'appuie dessus, ne la réécrit pas |
| Validation asynchrone d'un champ (« cet e-mail est-il pris ? ») | FORM-UX § validation asynchrone (extension `form-async-validation`) |
| Affordance, label du CTA, `loading`, anti double-activation, un seul bouton de soumission par écran | BUTTON-UX |
| Message global (bandeau « vérifiez votre e-mail », erreur serveur, succès) : structure, tone, icône, persistance | ALERT-UX / ALERT-UI |
| Ton et wording (bienvenue, erreurs, non-culpabilisation, casse, gabarits de messages) | VOICE |
| **Cohérence d'identification d'un même rôle d'un écran à l'autre** (CTA de progression, lien « j'ai déjà un compte », retour) ; distinction **Agir** vs **Naviguer** à l'échelle de la séquence | INTERACTION-UX (`INTERACTION-UX.md` — le flow applique, ne réinvente pas l'affordance) |
| **Chorégraphie de transition entre écrans** du parcours (registre productif : *fade* / *fade through*) | MOTION-UX (`MOTION-UX.md`) |
| **Moment expressif de l'atterrissage** (« compte créé ») : quand il se pose, **qui le porte**, son budget de rareté et son repli | EMOTION-UX (`EMOTION-UX.md` — catalogue fermé ; entrée via DECISIONS.md) |
| **Séquence inter-écrans du parcours** : quoi demander, quand, en combien de moments ; ce qui est reporté après la première valeur | **CREATION-COMPTE** |
| **Choix de la méthode** d'inscription (e-mail+mot de passe, SSO/social, sans mot de passe) et leur poids relatif | **CREATION-COMPTE** |
| **Stratégie de vérification de l'e-mail** (laisser entrer puis vérifier, ou barrer l'accès) | **CREATION-COMPTE** |
| **Posture sur « e-mail déjà utilisé »** : bifurcation vers la connexion vs énumération de comptes | **CREATION-COMPTE** (posture sécurité arbitrée avec le produit) |
| **Séquence de consentement** à l'inscription : ce qu'on demande, séparé de quoi, dans quel ordre | **CREATION-COMPTE** (le mécanisme de la case : FORM/INPUT ; le fond légal : le produit) |
| **Atterrissage post-inscription** : où la personne est déposée une fois le compte créé | **CREATION-COMPTE** |
| Logique d'authentification serveur, hachage/stockage du mot de passe, envoi réel des e-mails, texte juridique des CGU, base légale RGPD | Le produit / le serveur / le juridique — hors design system |

## Le squelette du parcours

RÈGLE : le parcours canonique tient en quatre moments, dont deux sont conditionnels :

1. **Choisir une méthode** — e-mail+mot de passe, un fournisseur tiers (Google, Apple…), ou un lien magique / passkey. Un seul écran, méthodes à poids visuel comparable.
2. **Saisir le minimum** — pour l'e-mail+mot de passe : e-mail + mot de passe (un seul champ, avec bascule d'affichage), rien de plus qu'il ne faille à la création. Cet écran *est* un `form` — toutes ses règles d'assemblage lui appartiennent.
3. **Vérifier l'e-mail** *(conditionnel — cf. extension)* — avant activation lorsque l'e-mail établit l'identité ou la récupération ; un accès provisoire limité n'est admis que si le risque produit le permet explicitement.
4. **Atterrir** — le compte existe : déposer la personne devant un premier pas concret, jamais sur une impasse « compte créé ».

RÈGLE : ne jamais découper ce parcours en plus d'étapes que sa charge réelle n'en impose (FORM-UX § multi-étapes fait autorité sur le découpage). Pour la majorité des produits grand public, l'inscription e-mail tient sur **un seul écran** ; la multiplication d'étapes à l'inscription est presque toujours un symptôme de champs qu'on aurait dû reporter (point 1 de « But »).

RÈGLE : le flow **ne demande jamais deux fois** une information déjà obtenue (WCAG 2.2 — 3.3.7 Redundant Entry, niveau A). Un e-mail saisi à l'étape « méthode » est pré-rempli ensuite ; une donnée rendue par un fournisseur SSO n'est pas redemandée. Le mécanisme appartient à `form-multi-step` ; c'est le flow qui décide *quelle* donnée circule.

## Le minimum viable d'un compte

RÈGLE : le compte n'a besoin, pour exister, que d'un **identifiant** (presque toujours l'e-mail) et d'un moyen d'**authentification** (mot de passe, ou délégation à un tiers, ou lien/possession). Tout le reste est du profil.

RÈGLE : ne pas demander le nom, l'entreprise, le téléphone, le cas d'usage, à l'inscription — sauf si le compte est *littéralement inutilisable* sans. Ces informations se récoltent au premier moment où elles servent réellement, dans le produit (profilage progressif). La question de contrôle : « le compte peut-il exister et rendre sa première valeur sans ce champ ? » Si oui, le champ n'a rien à faire ici.

> **Pourquoi** : c'est la même logique que la convention requis/optionnel du formulaire (FORM-UX), remontée d'un cran — au lieu de « marquer la minorité de champs optionnels », le flow décide *quels champs existent tout court* à ce moment. Le meilleur champ d'inscription est celui qu'on a su reporter.

RÈGLE : ne pas exiger la création d'un compte avant d'avoir montré une valeur quand c'est évitable — proposer un accès invité (guest) ou un essai sans compte, et convertir *après*. L'inscription forcée en amont de toute valeur est un anti-pattern de conversion documenté.

CONFIANCE : établi — profilage progressif et coût de la création forcée sont convergents (Baymard sur l'abandon de tunnel, NN/g sur l'inscription) ; le seuil exact « quel champ est indispensable » reste une décision produit, à trancher produit par produit.

## Choisir une méthode

RÈGLE : quand plusieurs méthodes d'inscription coexistent (e-mail, SSO/social, lien magique, passkey), elles s'offrent à **poids visuel comparable** — aucune méthode déguisée en choix par défaut inévitable, aucune méthode reléguée en lien minuscule. Le mécanisme du bouton (style, tone) appartient à BUTTON-UX ; le flow décide qu'aucune méthode ne piège l'utilisateur.

RÈGLE : ne jamais enfermer la personne dans la méthode choisie, mais ne **jamais rapprocher deux comptes sur le seul fait que leurs chaînes d'e-mail se ressemblent**. Le rapprochement (account linking) exige une preuve de contrôle : réauthentification du compte existant, ou identité explicitement vérifiée par un fournisseur de confiance selon une politique documentée. En l'absence de preuve, ouvrir un chemin de récupération ou d'assistance sans créer de doublon silencieux. La mécanique reste côté produit ; le flow impose la preuve et le chemin de sortie. (cf. extension `creation-compte-sso-social`.)

RÈGLE : présenter les fournisseurs tiers réellement pertinents pour l'audience, pas une collection exhaustive de logos. Trois portes claires valent mieux que huit qui noient le choix (charge de sélection — la même logique que Hick, cf. `content/md/principles/LAWS-UX.md`).

## Identité et moyen d'authentification

RÈGLE : un **seul** champ de mot de passe, jamais de « confirmez le mot de passe ». La confirmation par double saisie est un anti-pattern : elle double la friction pour se prémunir d'une faute de frappe qu'une **bascule d'affichage** (voir/masquer) corrige mieux. Le champ et sa bascule appartiennent à INPUT-UX ; le flow décide qu'il n'y a pas de second champ.

RÈGLE : autoriser le collage et les gestionnaires de mots de passe partout, sur le champ mot de passe comme sur les codes de vérification. Bloquer le collage « pour la sécurité » dégrade la sécurité (il décourage les mots de passe forts et uniques) et l'accessibilité.

RÈGLE : les contraintes du mot de passe s'annoncent **avant** la saisie (WCAG 3.3.2, niveau A), pas en punition après un envoi refusé. Le détail des règles et le feedback de force vivent dans l'extension `creation-compte-force-mot-de-passe` ; leur *timing* d'affichage est une règle d'input/form (validation différée pendant la frappe).

RÈGLE : pas de test cognitif bloquant à l'inscription (WCAG 2.2 — 3.3.8 Accessible Authentication, niveau AA) — pas de puzzle, pas de mémorisation imposée, copier-coller toujours permis. Si un anti-robot est nécessaire, il doit offrir une alternative accessible (cf. FORM-UX § « À approfondir » sur le captcha).

## Vérifier l'e-mail — calibrer l'activation au risque

RÈGLE : il n'existe pas de défaut universel « soft gate ». Lorsque l'e-mail sert d'identifiant, de canal de récupération ou de preuve de possession, le compte n'est **actif** qu'après vérification. Un produit à faible risque peut autoriser avant cela un espace provisoire strictement limité, sans action sensible ni exposition de données ; ce choix est une décision produit/sécurité explicite, jamais une optimisation de conversion appliquée par habitude.

> **Pourquoi** : vérifier trop tôt peut ajouter de la friction ; activer trop tôt peut permettre l'usurpation, l'abus ou rendre la récupération ambiguë. La bonne frontière dépend de ce que le compte non vérifié peut réellement faire. La sécurité de l'identité prime sur une généralisation de conversion.

Le détail (renvoi, expiration du lien, e-mail erroné, état « en attente ») vit dans l'extension `creation-compte-verification-email`.

CONFIANCE : établi pour l'exigence de preuve lorsque l'e-mail porte l'identité (OWASP) ; variable pour l'accès provisoire limité, qui reste un arbitrage de risque produit à mesurer localement.

## L'atterrissage — le compte existe, et après ?

RÈGLE : une inscription réussie **ne se termine jamais sur une impasse** (« Votre compte a été créé. » et rien). Elle dépose la personne devant un **premier pas concret** dans le produit : un état vide orienté action, une première tâche amorcée, la valeur pour laquelle elle est venue. Le succès n'est pas la fin du parcours — c'est le début de l'usage.

RÈGLE : ne pas empiler, juste après la création, tous les écrans qu'on s'est retenu de mettre à l'inscription. Le profilage progressif se déclenche au fil de l'usage, quand chaque question trouve son moment ; un tunnel d'onboarding de dix écrans en remplacement d'un formulaire long n'a fait que déplacer la friction.

RÈGLE : confirmer la création par le canal adapté — un `alert` de succès discret suffit le plus souvent ; l'e-mail de bienvenue relève du produit, pas d'une interruption d'interface. Le ton de la confirmation appartient à VOICE — **sobre hors ce moment, un cran chaleureux sur lui** : l'atterrissage étant l'unique moment E-motion catalogué du parcours, le microcopy s'y réchauffe d'un cran (`VOICE-UX.md` § Exception E-motion ; cf. § Instrument E-motion — l'atterrissage), sans jamais devenir exubérant.

## Préconditions et points d'entrée
- **Précondition** : la personne n'est pas déjà authentifiée (si elle l'est, rediriger — ne pas réafficher l'inscription).
- On arrive par des portes différentes, chacune porte un contexte à respecter : un CTA marketing (aucune donnée pré-acquise) ; une **action gatée** (l'utilisateur voulait faire quelque chose — après création, le **ramener à son intention**, pas à un accueil générique) ; une **invitation / lien** (e-mail pré-rempli et non redemandé, contexte de l'invitant conservé) ; un lien profond partagé.
- Ne jamais faire payer deux fois une information déjà obtenue par le point d'entrée (WCAG 2.2 — 3.3.7). Mémoriser l'intention d'entrée pour la restituer à l'atterrissage.

## Machine à états du parcours
- Distincte de la machine à états de **soumission** d'un écran (celle-ci appartient à `form`) : ici, la trajectoire **inter-écrans** du compte lui-même.
- `inexistant → en cours (méthode choisie → minimum saisi) → créé (en attente de vérification) → vérifié → actif`, avec deux bifurcations : `e-mail déjà utilisé → chemin vers la connexion / récupération` — **dont la FORME dépend de la posture arbitrée (extension `creation-compte-email-deja-utilise`) ; défaut NEUTRE : le chemin part par e-mail, pas par l'interface** — et `abandonné → réentrée`. Un produit peut fusionner `vérifié` et `actif`, mais ne doit pas les confondre silencieusement.

| Transition | Ce qui devient visible | Focus | Sort de la saisie | Condition de sortie |
|---|---|---|---|---|
| → méthode choisie | l'écran de saisie de la méthode | premier champ / bouton fournisseur | — | méthode sélectionnée |
| → minimum saisi | soumission (`form`), bouton `loading` | maintenu puis résultat | conservée si erreur | le serveur accepte |
| → créé (en attente) | écran de vérification ou espace provisoire borné, selon la décision de risque | titre de l'écran atteint | — | compte créé côté serveur |
| → vérifié / actif | activation, ou levée des restrictions provisoires | selon le changement de contexte | — | possession de l'e-mail confirmée |
| → e-mail déjà utilisé | **selon la posture arbitrée — cette cellule ne tranche pas.** Défaut **NEUTRE** tant que le produit n'a pas arbitré : aucune confirmation d'existence dans l'interface, chemin envoyé par e-mail, temps de réponse constants. Posture **OUVERTE** seulement si le produit l'a retenue : « un compte existe déjà » + chemin vers la connexion. Saisie préservée dans les deux cas. | neutre → alert de confirmation d'envoi ; ouverte → champ e-mail / lien connexion | conservée | selon la posture |
| → abandonné | rien (l'utilisateur part) | — | conservée si reprise possible | reprise ou purge |
- Le rendu de chaque état est délégué (bouton `loading`, `alert`, champ en erreur) : le flow possède la **séquence**, pas les pixels.

## États transitoires
- Tout moment d'attente (soumission, création, envoi de l'e-mail de vérification) est un **état transitoire** qui doit avoir une **sortie de scène définie** : succès, erreur, ou dépassement de délai — jamais un écran figé sans issue.
- Le rendu appartient aux composants (`button` `loading`, `alert` pour l'attente non bloquante, `form` pour le cycle de soumission) ; le flow garantit seulement qu'aucun état transitoire ne reste sans issue et que la saisie survit à un aller-retour.

## Abandon et réentrée
- L'abandon est un **résultat normal**, pas un échec : ne pas culpabiliser, ne pas piéger. La friction non contrepartie est la première cause d'abandon (Baymard, NN/g) — d'où le minimum viable.
- Permettre la **reprise** : reprendre là où la personne allait, sans reperdre la saisie ni la méthode. Une réentrée par la même adresse ne doit pas produire un doublon (cf. « e-mail déjà utilisé »).
- **Compte partiellement créé** (créé mais non vérifié, abandonné en cours) : décider *purge* ou *complétion à la réentrée* — c'est une **décision produit**, que le flow rend visible sans la trancher.

## Accessibilité du parcours
- La couche accessibilité des composants est **déléguée** à la fondation `accessibility` (socle universel) (le flow ne la duplique pas). Ce que le flow porte, c'est l'accessibilité **inter-écrans** :
  - lors d'un vrai changement de vue dans une SPA, placer le focus programmatiquement sur le titre ou le début pertinent du nouvel écran ; lors d'une navigation de page native, préserver le comportement attendu du navigateur. WCAG 2.4.3 exige un ordre logique, pas une recette unique de déplacement ;
  - utiliser une région de statut (WCAG 4.1.3) pour une progression ou un résultat **mis à jour sans changement de contexte et sans déplacement du focus**. Ne pas annoncer deux fois la même transition par focus + `aria-live` ;
  - le parcours reste **franchissable au clavier** de bout en bout, y compris les bascules de méthode et les rappels de vérification (jamais de piège de focus dans un bandeau ou une modale).

## Les quatre Languages au niveau parcours

RÈGLE : un flow **n'invente aucune règle de Language** — il les *applique à l'échelle de la séquence*. Les composants portent Interaction, Motion, Voice et E-motion écran par écran ; le parcours nomme ce qui ne se voit **qu'entre les écrans** et **désigne qui porte** le moment expressif. Renvois nommés : `INTERACTION-UX.md`, `MOTION-UX.md`, `VOICE-UX.md`, `EMOTION-UX.md`.

### Interaction — cohérence d'identification inter-écrans (`INTERACTION-UX.md`)

RÈGLE : un même **rôle** garde ses **signaux d'un écran à l'autre** (WCAG 2.2 — 3.2.4 Consistent Identification). Le CTA de progression, le lien « j'ai déjà un compte », le retour : chacun se présente à l'identique de l'écran « méthode » à l'écran « minimum » jusqu'à l'atterrissage. Le mécanisme d'affordance appartient à `INTERACTION-UX.md` ; le flow garantit qu'il ne **dérive pas** d'un écran au suivant.

RÈGLE : distinguer **Agir** — progresser dans le tunnel (soumettre, continuer) — de **Naviguer** — bifurquer hors du tunnel (« j'ai déjà un compte » → connexion, retour). Deux intentions différentes ne se rendent jamais indiscernables (`INTERACTION-UX.md` § Les six intentions) : la progression est un `button`, la bifurcation un `link` — jamais l'un déguisé en l'autre.

RÈGLE : le **« Test de reconnaissance »** (`INTERACTION-UX.md`) se remonte à l'échelle de la **séquence** : en niveaux de gris et sans hover, un même rôle reste-t-il reconnaissable *d'un écran à l'autre*, et les rôles distincts (progresser vs bifurquer) restent-ils distincts ? Un « non » n'appelle pas plus d'effets, mais une identification plus cohérente.

> **Pourquoi** : au niveau composant, une incohérence trouble un écran ; au niveau parcours, elle fait douter la personne qu'elle est toujours dans le même produit — au moment précis où l'engagement est le plus faible.

### Motion — transitions inter-écrans (`MOTION-UX.md`)

RÈGLE : ce parcours multi-écrans **est** la navigation que `MOTION-UX.md` § À approfondir attendait pour **rouvrir les transitions inter-écrans**. La chorégraphie retenue reste dans le **registre productif** : un *fade* / *fade through* (le sortant s'efface, l'entrant apparaît) — le **défaut sûr**. Les patterns **expressifs** — *shared axis*, *container transform* — sont **écartés** (ils exigeraient un relèvement de registre non retenu ici).

RÈGLE : la transition s'**articule avec le focus programmatique inter-écrans** (§ Accessibilité du parcours) — l'animation accompagne le changement de vue, elle ne **remplace ni ne double** l'annonce ; le déplacement du focus reste le porteur de l'information « on a changé d'écran ».

RÈGLE : le contrat `prefers-reduced-motion` s'applique intégralement (`MOTION-UX.md`) — sous la préférence, **bascule instantanée** d'un écran à l'autre, sans crossfade spatial et sans perte. Et **rien n'anime au chargement initial** : le premier écran du parcours se pose sans animation d'entrée ; seules les transitions *réactives* (conséquence d'une avancée dans le tunnel) s'animent.

### Voice — le ton suit l'état du parcours (`VOICE-UX.md`)

RÈGLE : mapper chaque état du parcours au § « Le ton suit l'utilisateur » de `VOICE-UX.md` — **attente** (soumission, création, envoi de la vérification) : rassurant, sans dramatiser ; **erreur** (« e-mail déjà utilisé », refus serveur) : **sans blâme**, jamais culpabilisant ; **atterrissage** (« compte créé », état vide de départ) : ton **« Vide / démarrage »** — encourageant, orienté action, qui pointe le premier pas.

RÈGLE : **réconcilier** le « sobre, jamais exubérant » du § L'atterrissage avec l'**Exception E-motion** (`VOICE-UX.md` 1.3.0). L'atterrissage est le **moment E-motion catalogué** « première fois / onboarding franchi » : sur ce **seul** moment du parcours, le microcopy peut se **réchauffer d'un cran** (renvoi `VOICE-UX.md` § Exception E-motion). La règle du § L'atterrissage devient donc : **sobre hors ce moment, un cran chaleureux sur lui** — jamais au-delà, jamais sur une erreur ni une action réflexe.

## Instrument E-motion — l'atterrissage

RÈGLE : le parcours **porte un seul moment expressif** — l'**atterrissage**, à l'écran « compte créé ». C'est le moment catalogué **« première fois / onboarding franchi »** d'`EMOTION-UX.md` (un seuil de parcours ; l'émotion marque le passage). Aucun autre battement du tunnel n'y a droit.

RÈGLE : **anatomie SOBRE** (arbitrage utilisateur 2026-07-21) — un **glyphe qui se dessine**, **SANS `spring`/overshoot** : plus calme que l'avion de l'envoi (le premier citoyen d'E-motion), parce que l'atterrissage est un aboutissement posé, pas un lancement. **UNE seule fois** dans tout le parcours ; repli reduced-motion vers le fait instantané.

RÈGLE : **le flow ne possède pas les pixels — il désigne le porteur.** Le moment s'incarne dans **un `alert` (ou un toast) success à l'atterrissage** — cohérent avec « un événement, un porteur » : le parcours nomme *qui* célèbre (le message de confirmation de création), il ne réanime pas lui-même les pixels. Le rendu et la chorégraphie appartiennent au composant porteur et à `EMOTION-UI.md`.

RÈGLE : **Contrat de repli inviolable (hérité d'`EMOTION-UX.md`) : l'état "compte créé/actif" vit dans l'ARIA et le statique ; l'animation ne fait que le célébrer ; sous `prefers-reduced-motion`, bascule instantanée, sans perte.**

RÈGLE : **Budget de rareté (`EMOTION-UX.md`) : un seul moment expressif dans tout le parcours, jamais un tunnel de célébrations.** La rigueur productive du reste du tunnel est ce qui rend cette note audible ; c'est la même logique que « ne pas empiler, juste après la création, tous les écrans reportés » (§ L'atterrissage).

> **Pourquoi** : l'atterrissage est le point de plus fort engagement du parcours (§ L'atterrissage — le succès n'est pas la fin, c'est le début de l'usage) — le seul endroit où une note chaleureuse est méritée. La multiplier (une célébration par étape) la détruirait ; l'omettre laisserait le seuil se franchir sans être ressenti.

CONFIANCE : anatomie et porteur arbitrés (2026-07-21) ; l'**entrée au catalogue** d'E-motion est une décision de design tranchée qui passe par **DECISIONS.md** (`EMOTION-UX.md` § Le catalogue des moments MÉRITÉS) — cataloguée séparément de cette source de flow.

## Instrumentation (des repères, pas des règles)
- Utile à mesurer pour décider quoi reporter ou simplifier : abandon **par étape**, taux de vérification, répartition **par méthode**, erreurs les plus fréquentes.
- Ces mesures **informent** les arbitrages (quel champ reporter, soft vs hard gate) ; elles ne **deviennent jamais** des règles UX. Un chiffre observé ailleurs (« +X % ») n'est pas une prescription transposable.

## Sécurité côté humain — ce que le flow porte, ce qu'il délègue

RÈGLE : le design de l'inscription porte la **sécurité vécue** (ne pas afficher le mot de passe en clair par défaut, permettre la bascule ; ne pas exposer inutilement quels e-mails sont enregistrés ; ne pas bloquer les gestionnaires) — jamais la sécurité côté serveur (hachage, limitation de débit, détection de fraude), qui est hors design system. La tension centrale — aider un utilisateur qui a déjà un compte **sans** confirmer à un inconnu qu'une adresse est enregistrée — est arbitrée dans l'extension `creation-compte-email-deja-utilise`.

## Risque

RÈGLE : table ci-dessous.

| Cas | Risque principal | Sévérité |
|---|---|---|
| Vérification e-mail en barrage avant toute valeur sans risque identifié | Friction et abandon évitables | Moyenne à élevée |
| Activation complète avant preuve de possession de l'e-mail | Usurpation, récupération ambiguë, abus de compte | Élevée |
| Champs de profil (nom, société, téléphone) exigés à l'inscription | Friction non contrepartie, abandon, données de mauvaise qualité | Élevée |
| « E-mail déjà utilisé » traité comme un mur, sans chemin vers la connexion | Utilisateur revenant bloqué, perçoit le produit comme cassé | Élevée |
| Message « e-mail déjà utilisé » qui confirme l'existence d'un compte à un inconnu | Énumération de comptes — fuite de la base d'e-mails | Moyenne à élevée (selon le produit) |
| Inscription forcée avant toute valeur (pas d'invité/essai) | Abandon de conversion documenté | Élevée |
| « Confirmez le mot de passe » + collage bloqué | Double friction, mots de passe plus faibles, exclusion des gestionnaires | Moyenne |
| Consentement marketing pré-coché ou groupé avec les CGU | Non-conformité RGPD (consentement non libre), défiance | Élevée (légal) |
| Atterrissage sur une impasse « compte créé » sans premier pas | Élan perdu au moment de plus fort engagement | Moyenne |
| Enfermement dans une méthode (doublon Google vs e-mail) | Comptes fantômes, utilisateur qui ne se retrouve pas | Moyenne |
| Test cognitif / captcha inaccessible à l'inscription | Exclusion (WCAG 3.3.8), abandon | Élevée |

## Règle transversale

RÈGLE : même logique que pour le bouton, l'input et le formulaire, remontée au parcours — **chaque friction du parcours doit être justifiée par une valeur ou un risque réels, jamais par habitude.** Un champ de plus, une étape de plus, une vérification en amont : chacun doit payer sa place par une contrepartie que la personne perçoit, ou disparaître.

> **Pourquoi** : un formulaire vidé après erreur, un bouton désactivé sans raison, une vérification qui barre l'accès et un champ « société » obligatoire à l'inscription sont quatre formes du même défaut — on fait payer l'utilisateur avant de l'avoir servi. Le flow est l'échelle où ce défaut coûte le plus cher, parce que l'engagement y est le plus faible.

## Sources et niveau de confiance

| Affirmation | Source | Confiance |
|---|---|---|
| Le minimum pour créer, le reste par profilage progressif | NN/g (inscription, progressive disclosure) ; Baymard (abandon de tunnel) | Établi |
| Création de compte forcée = cause majeure d'abandon ; proposer invité/essai | Baymard Institute (checkout usability, forced account creation) | Établi |
| « Confirmez le mot de passe » est un anti-pattern ; préférer la bascule d'affichage | NN/g (password creation, show-password) | Convergence forte |
| Autoriser collage et gestionnaires de mots de passe | NIST SP 800-63B ; consensus sécurité/accessibilité | Établi |
| Contraintes de mot de passe annoncées avant la saisie | WCAG 3.3.2 (niveau A) | Établi |
| Pas de test cognitif à l'authentification / inscription | WCAG 2.2 — 3.3.8 (niveau AA) | Établi — critère |
| Ne pas redemander une info déjà fournie dans le parcours | WCAG 2.2 — 3.3.7 (niveau A) ; GOV.UK « ask once » | Établi — critère |
| Longueur > complexité, 15 caractères en facteur unique (8 avec MFA), pas d'expiration forcée, blocklist | [NIST SP 800-63B-4](https://pages.nist.gov/800-63-4/sp800-63b.html) | Établi (référentiel) |
| Vérification e-mail avant activation quand l'adresse porte l'identité ; accès provisoire seulement selon le risque | [OWASP — Email Validation and Verification](https://cheatsheetseries.owasp.org/cheatsheets/Email_Validation_and_Verification_Cheat_Sheet.html) | Établi pour la preuve ; décision produit pour le provisoire |
| Consentement : libre, éclairé, spécifique, non pré-coché, dégroupé du nécessaire | RGPD art. 4(11) & art. 7 ; lignes directrices EDPB sur le consentement | Établi — cadre légal |
| Énumération de comptes : ne pas confirmer l'existence d'une adresse | OWASP (authentication / account enumeration) | Établi — mais en tension avec l'UX, posture arbitrée |
| Rapprochement de comptes seulement après preuve de contrôle, jamais sur l'e-mail seul | OWASP (identité et vérification de l'e-mail) ; politique d'identité du produit | Établi pour la preuve ; mécanique produit |
| Squelette à quatre moments, découpage minimal des étapes | Dérivé de FORM-UX § multi-étapes (GOV.UK « one thing per page ») appliqué au parcours | Structure interne dérivée |

## À approfondir

- **Connexion (login)** : le pendant du parcours — récupération de mot de passe, « rester connecté », verrouillage après échecs. Flow voisin, à traiter quand la nature Flow s'étendra ; plusieurs règles ici (bascule d'affichage, pas de test cognitif, énumération) lui seront communes.
- **Onboarding produit** : la séquence *après* l'atterrissage (activation, premier succès) — distincte de la création de compte proprement dite ; frontière à tracer quand elle existera pour éviter que l'inscription ne réabsorbe le tunnel qu'elle a su reporter.
- **Passkeys / sans mot de passe** : mentionné comme méthode ; sa mécanique propre (WebAuthn, repli) mérite son traitement quand un consommateur en a besoin.
- **Comptes d'organisation / invitation** : créer un compte *dans* une équipe (invité par un tiers) inverse plusieurs hypothèses (l'e-mail est déjà connu, le rôle est prédéfini) — parcours dérivé à part entière.

---
