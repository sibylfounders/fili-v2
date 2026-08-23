---
component: creation-compte
layer: ux
type: flow
version: 1.4.0 # 1.4.0 : la table d'états cesse d'écrire la posture OUVERTE comme un acquis — la cellule « e-mail déjà utilisé » disait « chemin vers la connexion / lien connexion » sans conditionnelle, alors que l'extension impose le défaut NEUTRE tant que le produit n'a pas arbitré (règle née du retour de pilote 2026-07-16). L'extension étant en `selon-contexte`, l'agent qui construit le parcours nominal ne la charge pas : il lisait donc la posture ouverte, exactement le défaut que 1.2.1 avait voulu fermer. Cellule et diagramme d'états conditionnés. Arbitrage Aurélien 2026-08-03. 1.3.3 : chemins repointés vers `content/md/` — fin de la migration vers le monorepo Sibyl DS (2026-07-27) ; aucune règle, aucun token, aucune source modifiés. 1.3.2 : la fusion implicite devient une RÈGLE autonome avec exemples ❌/✅ — le re-test à froid a montré qu'une clause enfouie en fin de paragraphe n'est pas appliquée par un agent (2e manqué F08). 1.3.1 : consentement — le piège de la fusion IMPLICITE nommé (« en créant un compte, vous acceptez CGU et politique de confidentialité ») ; angle mort F08 révélé par le test à froid n°2 du mode audit (2026-07-21). 1.3.0 : application nommée des 4 Languages au parcours ; moment E-motion « atterrissage » sobre ; transitions inter-écrans productives (2026-07-21). 1.2.2 : vocabulaire aligné sur le modèle style × tone du bouton (DECISIONS 2026-07-18), aucune règle modifiée. 1.2.1 : posture « e-mail déjà utilisé » — défaut sûr (neutre) + remontée obligatoire tant que le produit n'a pas arbitré (retour de pilote 2026-07-16). 1.2.0 : référentiels sécurité 2026 recalibrés — NIST SP 800-63B-4 (15 caractères en facteur unique, 8 seulement avec MFA), aucun rapprochement de comptes sur le seul e-mail, activation/vérification décidée par le risque, focus et annonces de transition séparés, consentement distinct du contrat et de l'information. Première compilation mécanique Flow → RULES avec empreinte de source. 1.1.0 : inventaire recalibré en statuts francs + 6 sections flow. Historique : cf. DECISIONS.md.
last_updated: 2026-07-21
companion: none
confidence: mixed
---

# Création de compte — Couche UX (flow de parcours)

> Ce fichier n'est ni un composant (BUTTON-UX, INPUT-UX) ni un pattern (FORM-UX) — c'est un **flow**, un parcours nommé de bout en bout. Il n'introduit **aucune règle visuelle ni aucun token** : il orchestre des écrans, chacun assemblé par le pattern `form` à partir des composants `input`/`button`/`alert`, sur le ton de `voice`. Vit dans `content/md/flows/`, pas `content/md/patterns/`, pour que la distinction — *un écran* vs *une séquence d'écrans vers un but* — reste visible dans la structure elle-même. `companion: none` : le flow n'a pas de couche UI.

## Note de transposition

RÈGLE [CREATION-COMPTE-R01] : le modèle à 3 axes (style/tone/size) ne s'applique pas — un parcours n'a pas de variante visuelle. Un pattern n'en avait déjà pas (une séquence, pas un objet) ; un flow est une séquence *de patterns*, un cran plus haut encore. Ce qu'il coordonne, ce ne sont pas des champs et un bouton, mais des **moments** : plusieurs écrans, plusieurs décisions, un but unique — que la personne reparte avec un compte utilisable.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Cette note précise que le modèle à 3 axes (style/tone/size) ne s'applique pas à un flow, qui n'a pas de déclinaison visuelle propre.

RÈGLE [CREATION-COMPTE-R02] : le flow ne possède aucun état visuel propre. Les états qu'il fait vivre (saisie, attente d'un verdict serveur, email en attente de vérification, compte créé) sont rendus par les composants qu'il coordonne — bouton en `loading`, `alert` d'information, champ en erreur — jamais par un token « création-compte-* » qui n'existe pas.
STATUT : implémentation de référence
SOURCE : interne
ÉNONCÉ : Le design system ne crée aucun token dédié à ce flow : ses états sont rendus uniquement par les composants qu'il coordonne.
MESURE : aucun token de design nommé « création-compte-* » n'existe dans la codebase

## But

Un parcours de création de compte transforme un visiteur en utilisateur authentifiable, en réclamant **le strict minimum** pour que le compte existe, puis en le déposant devant la première valeur du produit. Sa fonction n'est ni celle du formulaire (assembler une saisie cohérente sur un écran), ni celle du bouton (déclencher), ni celle de l'input (capturer) — c'est de **décider ce qu'on demande, quand, en combien de moments**, et d'arbitrer les tensions qui n'existent qu'au niveau du parcours : la friction contre l'abandon, l'ouverture de l'accès contre la vérification, l'entraide (« vous avez déjà un compte ? ») contre la sécurité (l'énumération de comptes), le consentement légal contre la fluidité.

RÈGLE [CREATION-COMPTE-R03] : le principe directeur du parcours — **le minimum pour créer, le reste plus tard.** Tout ce qui n'est pas indispensable à l'existence du compte (préférences, profil enrichi, équipe, facturation) se demande *après* la première valeur, par profilage progressif, jamais en barrage à l'entrée. Chaque champ ajouté à l'inscription est un impôt prélevé avant toute contrepartie.
STATUT : propriété universelle
SOURCE : S1,S2
ÉNONCÉ : Un parcours d'inscription doit se limiter au strict minimum nécessaire pour créer le compte et reporter le reste après la première valeur perçue.

> **Pourquoi** : la création de compte est le point du produit où l'engagement est le plus faible et l'abandon le plus facile — la personne n'a encore rien reçu. Baymard mesure la « création de compte forcée » comme l'une des premières causes d'abandon de tunnel ; chaque friction non justifiée par une valeur déjà perçue se paie en départs.

## Frontières d'autorité (la table de référence)

RÈGLE [CREATION-COMPTE-R04] : un flow **n'invente aucune règle de composant ou de pattern** — il les séquence. En cas de doute, cette table tranche :
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Cette table de référence précise qu'un flow ne crée aucune règle de composant ou de pattern : elle indique quel document fait autorité sur chaque sujet.

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

RÈGLE [CREATION-COMPTE-R05] : le parcours canonique tient en quatre moments, dont deux sont conditionnels :
STATUT : parti pris d'identité
SOURCE : S13
ÉNONCÉ : Nous découpons le parcours d'inscription en quatre moments au maximum, dont deux conditionnels.
MESURE : le parcours comprend au maximum quatre moments : choisir une méthode, saisir le minimum, vérifier l'e-mail (si nécessaire), atterrir

1. **Choisir une méthode** — e-mail+mot de passe, un fournisseur tiers (Google, Apple…), ou un lien magique / passkey. Un seul écran, méthodes à poids visuel comparable.
2. **Saisir le minimum** — pour l'e-mail+mot de passe : e-mail + mot de passe (un seul champ, avec bascule d'affichage), rien de plus qu'il ne faille à la création. Cet écran *est* un `form` — toutes ses règles d'assemblage lui appartiennent.
3. **Vérifier l'e-mail** *(conditionnel — cf. extension)* — avant activation lorsque l'e-mail établit l'identité ou la récupération ; un accès provisoire limité n'est admis que si le risque produit le permet explicitement.
4. **Atterrir** — le compte existe : déposer la personne devant un premier pas concret, jamais sur une impasse « compte créé ».

RÈGLE [CREATION-COMPTE-R06] : ne jamais découper ce parcours en plus d'étapes que sa charge réelle n'en impose (FORM-UX § multi-étapes fait autorité sur le découpage). Pour la majorité des produits grand public, l'inscription e-mail tient sur **un seul écran** ; la multiplication d'étapes à l'inscription est presque toujours un symptôme de champs qu'on aurait dû reporter (point 1 de « But »).
STATUT : parti pris d'identité
SOURCE : S13
ÉNONCÉ : Nous limitons le nombre d'étapes d'inscription au strict nécessaire : pour la plupart des produits grand public, un seul écran suffit.

RÈGLE [CREATION-COMPTE-R07] : le flow **ne demande jamais deux fois** une information déjà obtenue (WCAG 2.2 — 3.3.7 Redundant Entry, niveau A). Un e-mail saisi à l'étape « méthode » est pré-rempli ensuite ; une donnée rendue par un fournisseur SSO n'est pas redemandée. Le mécanisme appartient à `form-multi-step` ; c'est le flow qui décide *quelle* donnée circule.
STATUT : propriété universelle
SOURCE : S7
ÉNONCÉ : Le parcours d'inscription ne doit jamais redemander une information déjà obtenue à une étape précédente ou via un fournisseur tiers.
MESURE : aucune information déjà saisie ou fournie par un fournisseur SSO n'est redemandée à l'écran suivant du parcours

## Le minimum viable d'un compte

RÈGLE [CREATION-COMPTE-R08] : le compte n'a besoin, pour exister, que d'un **identifiant** (presque toujours l'e-mail) et d'un moyen d'**authentification** (mot de passe, ou délégation à un tiers, ou lien/possession). Tout le reste est du profil.
STATUT : parti pris d'identité
SOURCE : S1
ÉNONCÉ : Nous considérons qu'un compte n'a besoin, pour exister, que d'un identifiant et d'un moyen d'authentification ; le reste est du profil.
MESURE : le formulaire d'inscription ne demande par défaut qu'un identifiant et un moyen d'authentification, aucun autre champ

RÈGLE [CREATION-COMPTE-R09] : ne pas demander le nom, l'entreprise, le téléphone, le cas d'usage, à l'inscription — sauf si le compte est *littéralement inutilisable* sans. Ces informations se récoltent au premier moment où elles servent réellement, dans le produit (profilage progressif). La question de contrôle : « le compte peut-il exister et rendre sa première valeur sans ce champ ? » Si oui, le champ n'a rien à faire ici.
STATUT : parti pris d'identité
SOURCE : S1
ÉNONCÉ : Nous ne demandons pas nom, entreprise, téléphone ou cas d'usage à l'inscription, sauf si le compte serait inutilisable sans.
MESURE : le formulaire d'inscription ne comporte pas de champ nom, entreprise, téléphone ou cas d'usage, sauf si le compte est inutilisable sans

> **Pourquoi** : c'est la même logique que la convention requis/optionnel du formulaire (FORM-UX), remontée d'un cran — au lieu de « marquer la minorité de champs optionnels », le flow décide *quels champs existent tout court* à ce moment. Le meilleur champ d'inscription est celui qu'on a su reporter.

RÈGLE [CREATION-COMPTE-R10] : ne pas exiger la création d'un compte avant d'avoir montré une valeur quand c'est évitable — proposer un accès invité (guest) ou un essai sans compte, et convertir *après*. L'inscription forcée en amont de toute valeur est un anti-pattern de conversion documenté.
STATUT : propriété universelle
SOURCE : S2
ÉNONCÉ : Un produit ne doit pas exiger la création d'un compte avant d'avoir montré une valeur, quand un accès invité ou un essai est possible.

CONFIANCE : établi — profilage progressif et coût de la création forcée sont convergents (Baymard sur l'abandon de tunnel, NN/g sur l'inscription) ; le seuil exact « quel champ est indispensable » reste une décision produit, à trancher produit par produit.

## Choisir une méthode

RÈGLE [CREATION-COMPTE-R11] : quand plusieurs méthodes d'inscription coexistent (e-mail, SSO/social, lien magique, passkey), elles s'offrent à **poids visuel comparable** — aucune méthode déguisée en choix par défaut inévitable, aucune méthode reléguée en lien minuscule. Le mécanisme du bouton (style, tone) appartient à BUTTON-UX ; le flow décide qu'aucune méthode ne piège l'utilisateur.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous présentons toutes les méthodes d'inscription à poids visuel comparable, sans en déguiser une en défaut ni en reléguer une en lien minuscule.
MESURE : toutes les méthodes d'inscription proposées à l'écran de choix ont un poids visuel comparable (taille, contraste, position)

RÈGLE [CREATION-COMPTE-R12] : ne jamais enfermer la personne dans la méthode choisie, mais ne **jamais rapprocher deux comptes sur le seul fait que leurs chaînes d'e-mail se ressemblent**. Le rapprochement (account linking) exige une preuve de contrôle : réauthentification du compte existant, ou identité explicitement vérifiée par un fournisseur de confiance selon une politique documentée. En l'absence de preuve, ouvrir un chemin de récupération ou d'assistance sans créer de doublon silencieux. La mécanique reste côté produit ; le flow impose la preuve et le chemin de sortie. (cf. extension `creation-compte-sso-social`.)
STATUT : propriété universelle
SOURCE : S12
ÉNONCÉ : Deux comptes ne doivent jamais être rapprochés sur la seule ressemblance de leurs adresses e-mail ; une preuve de contrôle est requise.
MESURE : le rapprochement de deux comptes n'a lieu qu'après réauthentification ou preuve d'identité vérifiée, jamais sur la seule ressemblance des adresses e-mail

RÈGLE [CREATION-COMPTE-R13] : présenter les fournisseurs tiers réellement pertinents pour l'audience, pas une collection exhaustive de logos. Trois portes claires valent mieux que huit qui noient le choix (charge de sélection — la même logique que Hick, cf. `content/md/principles/LAWS-UX.md`).
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous limitons les fournisseurs tiers proposés aux options réellement pertinentes pour l'audience, plutôt qu'une liste exhaustive de logos.

## Identité et moyen d'authentification

RÈGLE [CREATION-COMPTE-R14] : un **seul** champ de mot de passe, jamais de « confirmez le mot de passe ». La confirmation par double saisie est un anti-pattern : elle double la friction pour se prémunir d'une faute de frappe qu'une **bascule d'affichage** (voir/masquer) corrige mieux. Le champ et sa bascule appartiennent à INPUT-UX ; le flow décide qu'il n'y a pas de second champ.
STATUT : propriété universelle
SOURCE : S3
ÉNONCÉ : Un formulaire d'inscription ne doit comporter qu'un seul champ mot de passe, avec bascule d'affichage, jamais de champ de confirmation.
MESURE : le formulaire d'inscription ne contient qu'un seul champ mot de passe, sans champ de confirmation

RÈGLE [CREATION-COMPTE-R15] : autoriser le collage et les gestionnaires de mots de passe partout, sur le champ mot de passe comme sur les codes de vérification. Bloquer le collage « pour la sécurité » dégrade la sécurité (il décourage les mots de passe forts et uniques) et l'accessibilité.
STATUT : propriété universelle
SOURCE : S4
ÉNONCÉ : Le collage et les gestionnaires de mots de passe doivent être autorisés sur le champ mot de passe et sur les codes de vérification.
MESURE : le collage n'est pas bloqué sur le champ mot de passe ni sur les champs de code de vérification

RÈGLE [CREATION-COMPTE-R16] : les contraintes du mot de passe s'annoncent **avant** la saisie (WCAG 3.3.2, niveau A), pas en punition après un envoi refusé. Le détail des règles et le feedback de force vivent dans l'extension `creation-compte-force-mot-de-passe` ; leur *timing* d'affichage est une règle d'input/form (validation différée pendant la frappe).
STATUT : propriété universelle
SOURCE : S5
ÉNONCÉ : Les contraintes du mot de passe doivent être annoncées avant la saisie, jamais révélées seulement après un envoi refusé.
MESURE : les contraintes du mot de passe sont affichées avant la première saisie, pas seulement après un rejet

RÈGLE [CREATION-COMPTE-R17] : pas de test cognitif bloquant à l'inscription (WCAG 2.2 — 3.3.8 Accessible Authentication, niveau AA) — pas de puzzle, pas de mémorisation imposée, copier-coller toujours permis. Si un anti-robot est nécessaire, il doit offrir une alternative accessible (cf. FORM-UX § « À approfondir » sur le captcha).
STATUT : propriété universelle
SOURCE : S6
ÉNONCÉ : L'inscription ne doit jamais imposer de test cognitif bloquant ; un anti-robot éventuel doit offrir une alternative accessible.
MESURE : aucun test cognitif (puzzle, mémorisation imposée) n'est requis pour finaliser l'inscription ; le copier-coller est toujours permis

## Vérifier l'e-mail — calibrer l'activation au risque

RÈGLE [CREATION-COMPTE-R18] : il n'existe pas de défaut universel « soft gate ». Lorsque l'e-mail sert d'identifiant, de canal de récupération ou de preuve de possession, le compte n'est **actif** qu'après vérification. Un produit à faible risque peut autoriser avant cela un espace provisoire strictement limité, sans action sensible ni exposition de données ; ce choix est une décision produit/sécurité explicite, jamais une optimisation de conversion appliquée par habitude.
STATUT : propriété universelle
SOURCE : S9
ÉNONCÉ : Un compte dont l'e-mail établit l'identité ou sert à la récupération ne doit être actif qu'après vérification de cet e-mail.

> **Pourquoi** : vérifier trop tôt peut ajouter de la friction ; activer trop tôt peut permettre l'usurpation, l'abus ou rendre la récupération ambiguë. La bonne frontière dépend de ce que le compte non vérifié peut réellement faire. La sécurité de l'identité prime sur une généralisation de conversion.

Le détail (renvoi, expiration du lien, e-mail erroné, état « en attente ») vit dans l'extension `creation-compte-verification-email`.

CONFIANCE : établi pour l'exigence de preuve lorsque l'e-mail porte l'identité (OWASP) ; variable pour l'accès provisoire limité, qui reste un arbitrage de risque produit à mesurer localement.

## L'atterrissage — le compte existe, et après ?

RÈGLE [CREATION-COMPTE-R19] : une inscription réussie **ne se termine jamais sur une impasse** (« Votre compte a été créé. » et rien). Elle dépose la personne devant un **premier pas concret** dans le produit : un état vide orienté action, une première tâche amorcée, la valeur pour laquelle elle est venue. Le succès n'est pas la fin du parcours — c'est le début de l'usage.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous ne terminons jamais une inscription réussie sur une impasse : la personne est déposée devant un premier pas concret dans le produit.
MESURE : l'écran final de l'inscription réussie affiche un état vide orienté action ou une tâche amorcée, pas seulement un message de confirmation isolé

RÈGLE [CREATION-COMPTE-R20] : ne pas empiler, juste après la création, tous les écrans qu'on s'est retenu de mettre à l'inscription. Le profilage progressif se déclenche au fil de l'usage, quand chaque question trouve son moment ; un tunnel d'onboarding de dix écrans en remplacement d'un formulaire long n'a fait que déplacer la friction.
STATUT : parti pris d'identité
SOURCE : S1
ÉNONCÉ : Nous n'empilons pas, juste après la création du compte, tous les écrans de profil qu'on a reportés à l'inscription.
MESURE : aucune séquence d'écrans de profilage n'est affichée immédiatement après la création du compte, avant tout usage du produit

RÈGLE [CREATION-COMPTE-R21] : confirmer la création par le canal adapté — un `alert` de succès discret suffit le plus souvent ; l'e-mail de bienvenue relève du produit, pas d'une interruption d'interface. Le ton de la confirmation appartient à VOICE — **sobre hors ce moment, un cran chaleureux sur lui** : l'atterrissage étant l'unique moment E-motion catalogué du parcours, le microcopy s'y réchauffe d'un cran (`VOICE-UX.md` § Exception E-motion ; cf. § Instrument E-motion — l'atterrissage), sans jamais devenir exubérant.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous confirmons la création de compte par un message de succès discret, avec un ton légèrement plus chaleureux qu'ailleurs dans le parcours.
MESURE : la confirmation de création de compte est un alert de succès discret, sans modale ni interruption bloquante

## Préconditions et points d'entrée
- **Précondition** : la personne n'est pas déjà authentifiée (si elle l'est, rediriger — ne pas réafficher l'inscription).
- On arrive par des portes différentes, chacune porte un contexte à respecter : un CTA marketing (aucune donnée pré-acquise) ; une **action gatée** (l'utilisateur voulait faire quelque chose — après création, le **ramener à son intention**, pas à un accueil générique) ; une **invitation / lien** (e-mail pré-rempli et non redemandé, contexte de l'invitant conservé) ; un lien profond partagé.
- Ne jamais faire payer deux fois une information déjà obtenue par le point d'entrée (WCAG 2.2 — 3.3.7). Mémoriser l'intention d'entrée pour la restituer à l'atterrissage.

## Machine à états du parcours
- Distincte de la machine à états de **soumission** d'un écran (celle-ci appartient à `form`) : ici, la trajectoire **inter-écrans** du compte lui-même.
- `inexistant → en cours (méthode choisie → minimum saisi) → créé (en attente de vérification) → vérifié → actif`, avec deux bifurcations : `e-mail déjà utilisé → chemin vers la connexion / récupération` — **dont la FORME dépend de la posture arbitrée (extension `creation-compte-email-deja-utilise`), défaut neutre : le chemin part par e-mail, pas par l'interface** — et `abandonné → réentrée`. Un produit peut fusionner `vérifié` et `actif`, mais ne doit pas les confondre silencieusement.

| Transition | Ce qui devient visible | Focus | Sort de la saisie | Condition de sortie |
|---|---|---|---|---|
| → méthode choisie | l'écran de saisie de la méthode | premier champ / bouton fournisseur | — | méthode sélectionnée |
| → minimum saisi | soumission (`form`), bouton `loading` | maintenu puis résultat | conservée si erreur | le serveur accepte |
| → créé (en attente) | écran de vérification ou espace provisoire borné, selon la décision de risque | titre de l'écran atteint | — | compte créé côté serveur |
| → vérifié / actif | activation, ou levée des restrictions provisoires | selon le changement de contexte | — | possession de l'e-mail confirmée |
| → e-mail déjà utilisé | **selon la posture arbitrée — cette cellule ne tranche pas.** Défaut **NEUTRE** (tant que le produit n'a pas arbitré) : aucune confirmation d'existence dans l'interface, le chemin part par e-mail, temps de réponse constants. Posture **OUVERTE**, seulement si le produit l'a explicitement retenue : « un compte existe déjà avec cet e-mail » + chemin vers la connexion. **La saisie est préservée dans les deux cas.** | neutre → l'alert de confirmation d'envoi ; ouverte → champ e-mail / lien connexion | conservée | selon la posture |
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

RÈGLE [CREATION-COMPTE-R22] : un flow **n'invente aucune règle de Language** — il les *applique à l'échelle de la séquence*. Les composants portent Interaction, Motion, Voice et E-motion écran par écran ; le parcours nomme ce qui ne se voit **qu'entre les écrans** et **désigne qui porte** le moment expressif. Renvois nommés : `INTERACTION-UX.md`, `MOTION-UX.md`, `VOICE-UX.md`, `EMOTION-UX.md`.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Cette note précise qu'un flow n'invente aucune règle de langage de conception : il les applique à l'échelle de la séquence d'écrans.

### Interaction — cohérence d'identification inter-écrans (`INTERACTION-UX.md`)

RÈGLE [CREATION-COMPTE-R23] : un même **rôle** garde ses **signaux d'un écran à l'autre** (WCAG 2.2 — 3.2.4 Consistent Identification). Le CTA de progression, le lien « j'ai déjà un compte », le retour : chacun se présente à l'identique de l'écran « méthode » à l'écran « minimum » jusqu'à l'atterrissage. Le mécanisme d'affordance appartient à `INTERACTION-UX.md` ; le flow garantit qu'il ne **dérive pas** d'un écran au suivant.
STATUT : propriété universelle
SOURCE : interne
ÉNONCÉ : Un même rôle d'interface doit garder les mêmes signaux visuels d'un écran à l'autre du parcours d'inscription.
MESURE : le CTA de progression, le lien « déjà un compte » et le lien de retour gardent la même forme, couleur et libellé sur tous les écrans du parcours

RÈGLE [CREATION-COMPTE-R24] : distinguer **Agir** — progresser dans le tunnel (soumettre, continuer) — de **Naviguer** — bifurquer hors du tunnel (« j'ai déjà un compte » → connexion, retour). Deux intentions différentes ne se rendent jamais indiscernables (`INTERACTION-UX.md` § Les six intentions) : la progression est un `button`, la bifurcation un `link` — jamais l'un déguisé en l'autre.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous distinguons toujours l'action de progresser dans le parcours (un bouton) de celle d'en sortir (un lien), sans jamais les confondre.
MESURE : l'action de progression (soumettre, continuer) est un bouton, l'action de bifurcation (déjà un compte, retour) est un lien, jamais l'inverse

RÈGLE [CREATION-COMPTE-R25] : le **« Test de reconnaissance »** (`INTERACTION-UX.md`) se remonte à l'échelle de la **séquence** : en niveaux de gris et sans hover, un même rôle reste-t-il reconnaissable *d'un écran à l'autre*, et les rôles distincts (progresser vs bifurquer) restent-ils distincts ? Un « non » n'appelle pas plus d'effets, mais une identification plus cohérente.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Cette note décrit une méthode de vérification (le « test de reconnaissance » en niveaux de gris) à appliquer à l'échelle de la séquence d'écrans.

> **Pourquoi** : au niveau composant, une incohérence trouble un écran ; au niveau parcours, elle fait douter la personne qu'elle est toujours dans le même produit — au moment précis où l'engagement est le plus faible.

### Motion — transitions inter-écrans (`MOTION-UX.md`)

RÈGLE [CREATION-COMPTE-R26] : ce parcours multi-écrans **est** la navigation que `MOTION-UX.md` § À approfondir attendait pour **rouvrir les transitions inter-écrans**. La chorégraphie retenue reste dans le **registre productif** : un *fade* / *fade through* (le sortant s'efface, l'entrant apparaît) — le **défaut sûr**. Les patterns **expressifs** — *shared axis*, *container transform* — sont **écartés** (ils exigeraient un relèvement de registre non retenu ici).
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous limitons les transitions entre écrans du parcours d'inscription à un registre sobre (fade / fade through), sans motif expressif.
MESURE : la transition entre écrans du parcours est un fade ou fade through ; aucun shared axis ni container transform n'est utilisé

RÈGLE [CREATION-COMPTE-R27] : la transition s'**articule avec le focus programmatique inter-écrans** (§ Accessibilité du parcours) — l'animation accompagne le changement de vue, elle ne **remplace ni ne double** l'annonce ; le déplacement du focus reste le porteur de l'information « on a changé d'écran ».
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous faisons porter l'annonce d'un changement d'écran par le déplacement du focus ; l'animation l'accompagne sans la remplacer ni la doubler.
MESURE : l'annonce du changement d'écran est portée par le déplacement du focus, jamais dupliquée par l'animation ou un aria-live simultané

RÈGLE [CREATION-COMPTE-R28] : le contrat `prefers-reduced-motion` s'applique intégralement (`MOTION-UX.md`) — sous la préférence, **bascule instantanée** d'un écran à l'autre, sans crossfade spatial et sans perte. Et **rien n'anime au chargement initial** : le premier écran du parcours se pose sans animation d'entrée ; seules les transitions *réactives* (conséquence d'une avancée dans le tunnel) s'animent.
STATUT : propriété universelle
SOURCE : interne
ÉNONCÉ : Sous la préférence de mouvement réduit, les transitions doivent être instantanées, et le premier écran ne doit jamais s'animer à son chargement.
MESURE : sous prefers-reduced-motion, les transitions entre écrans sont instantanées ; le premier écran du parcours ne joue aucune animation d'entrée au chargement

### Voice — le ton suit l'état du parcours (`VOICE-UX.md`)

RÈGLE [CREATION-COMPTE-R29] : mapper chaque état du parcours au § « Le ton suit l'utilisateur » de `VOICE-UX.md` — **attente** (soumission, création, envoi de la vérification) : rassurant, sans dramatiser ; **erreur** (« e-mail déjà utilisé », refus serveur) : **sans blâme**, jamais culpabilisant ; **atterrissage** (« compte créé », état vide de départ) : ton **« Vide / démarrage »** — encourageant, orienté action, qui pointe le premier pas.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous associons à chaque état du parcours (attente, erreur, atterrissage) un ton défini : rassurant, sans blâme, ou encourageant selon le moment.

RÈGLE [CREATION-COMPTE-R30] : **réconcilier** le « sobre, jamais exubérant » du § L'atterrissage avec l'**Exception E-motion** (`VOICE-UX.md` 1.3.0). L'atterrissage est le **moment E-motion catalogué** « première fois / onboarding franchi » : sur ce **seul** moment du parcours, le microcopy peut se **réchauffer d'un cran** (renvoi `VOICE-UX.md` § Exception E-motion). La règle du § L'atterrissage devient donc : **sobre hors ce moment, un cran chaleureux sur lui** — jamais au-delà, jamais sur une erreur ni une action réflexe.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous réservons le seul réchauffement de ton du parcours au moment de l'atterrissage ; partout ailleurs, le ton reste sobre, jamais exubérant.

## Instrument E-motion — l'atterrissage

RÈGLE [CREATION-COMPTE-R31] : le parcours **porte un seul moment expressif** — l'**atterrissage**, à l'écran « compte créé ». C'est le moment catalogué **« première fois / onboarding franchi »** d'`EMOTION-UX.md` (un seuil de parcours ; l'émotion marque le passage). Aucun autre battement du tunnel n'y a droit.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous réservons un seul moment expressif à tout le parcours d'inscription : l'atterrissage, au moment où le compte est créé.
MESURE : le parcours ne comporte qu'un seul moment animé ou expressif (l'atterrissage) ; aucun autre écran n'a d'animation d'émotion

RÈGLE [CREATION-COMPTE-R32] : **anatomie SOBRE** (arbitrage utilisateur 2026-07-21) — un **glyphe qui se dessine**, **SANS `spring`/overshoot** : plus calme que l'avion de l'envoi (le premier citoyen d'E-motion), parce que l'atterrissage est un aboutissement posé, pas un lancement. **UNE seule fois** dans tout le parcours ; repli reduced-motion vers le fait instantané.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous avons choisi une anatomie sobre pour l'animation de l'atterrissage : un glyphe qui se dessine, sans rebond, jouée une seule fois.
MESURE : l'animation de l'atterrissage est un glyphe qui se dessine sans effet spring/overshoot, jouée une seule fois ; sous mouvement réduit, l'état s'affiche instantanément

RÈGLE [CREATION-COMPTE-R33] : **le flow ne possède pas les pixels — il désigne le porteur.** Le moment s'incarne dans **un `alert` (ou un toast) success à l'atterrissage** — cohérent avec « un événement, un porteur » : le parcours nomme *qui* célèbre (le message de confirmation de création), il ne réanime pas lui-même les pixels. Le rendu et la chorégraphie appartiennent au composant porteur et à `EMOTION-UI.md`.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous faisons porter le moment expressif de l'atterrissage par le message de confirmation (alert ou toast succès), pas par un élément propre au flow.
MESURE : le moment expressif de l'atterrissage est porté par un composant alert ou toast de type succès, jamais par un élément propre au flow

RÈGLE [CREATION-COMPTE-R34] : **Contrat de repli inviolable (hérité d'`EMOTION-UX.md`) : l'état "compte créé/actif" vit dans l'ARIA et le statique ; l'animation ne fait que le célébrer ; sous `prefers-reduced-motion`, bascule instantanée, sans perte.**
STATUT : propriété universelle
SOURCE : interne
ÉNONCÉ : L'état « compte créé » doit rester lisible dans le contenu statique et l'ARIA indépendamment de toute animation, qui ne fait que l'accompagner.
MESURE : l'état « compte créé/actif » est présent dans le contenu statique et l'ARIA indépendamment de l'animation ; sous mouvement réduit, la bascule est instantanée et sans perte

RÈGLE [CREATION-COMPTE-R35] : **Budget de rareté (`EMOTION-UX.md`) : un seul moment expressif dans tout le parcours, jamais un tunnel de célébrations.** La rigueur productive du reste du tunnel est ce qui rend cette note audible ; c'est la même logique que « ne pas empiler, juste après la création, tous les écrans reportés » (§ L'atterrissage).
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous limitons le parcours d'inscription à un seul moment de célébration animée, jamais un enchaînement de célébrations à chaque étape.
MESURE : le parcours ne contient qu'un seul moment de célébration animée (l'atterrissage), aucun autre écran n'a d'animation festive

> **Pourquoi** : l'atterrissage est le point de plus fort engagement du parcours (§ L'atterrissage — le succès n'est pas la fin, c'est le début de l'usage) — le seul endroit où une note chaleureuse est méritée. La multiplier (une célébration par étape) la détruirait ; l'omettre laisserait le seuil se franchir sans être ressenti.

CONFIANCE : anatomie et porteur arbitrés (2026-07-21) ; l'**entrée au catalogue** d'E-motion est une décision de design tranchée qui passe par **DECISIONS.md** (`EMOTION-UX.md` § Le catalogue des moments MÉRITÉS) — cataloguée séparément de cette source de flow.

## Instrumentation (des repères, pas des règles)
- Utile à mesurer pour décider quoi reporter ou simplifier : abandon **par étape**, taux de vérification, répartition **par méthode**, erreurs les plus fréquentes.
- Ces mesures **informent** les arbitrages (quel champ reporter, soft vs hard gate) ; elles ne **deviennent jamais** des règles UX. Un chiffre observé ailleurs (« +X % ») n'est pas une prescription transposable.

## Sécurité côté humain — ce que le flow porte, ce qu'il délègue

RÈGLE [CREATION-COMPTE-R36] : le design de l'inscription porte la **sécurité vécue** (ne pas afficher le mot de passe en clair par défaut, permettre la bascule ; ne pas exposer inutilement quels e-mails sont enregistrés ; ne pas bloquer les gestionnaires) — jamais la sécurité côté serveur (hachage, limitation de débit, détection de fraude), qui est hors design system. La tension centrale — aider un utilisateur qui a déjà un compte **sans** confirmer à un inconnu qu'une adresse est enregistrée — est arbitrée dans l'extension `creation-compte-email-deja-utilise`.
STATUT : propriété universelle
SOURCE : S11,S4,S3
ÉNONCÉ : Le design de l'inscription doit garantir la sécurité perçue (mot de passe masqué par défaut, gestionnaires non bloqués, pas de confirmation d'adresses enregistrées), pas la sécurité serveur.
MESURE : le mot de passe n'est pas affiché en clair par défaut (bascule disponible) ; le collage et les gestionnaires ne sont jamais bloqués ; aucun message ne confirme quelles adresses e-mail sont déjà enregistrées

## Risque

RÈGLE [CREATION-COMPTE-R37] : table ci-dessous.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Cette entrée renvoie au tableau des risques du parcours d'inscription et de leur sévérité ; ce n'est pas une règle de design en soi.

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

RÈGLE [CREATION-COMPTE-R38] : même logique que pour le bouton, l'input et le formulaire, remontée au parcours — **chaque friction du parcours doit être justifiée par une valeur ou un risque réels, jamais par habitude.** Un champ de plus, une étape de plus, une vérification en amont : chacun doit payer sa place par une contrepartie que la personne perçoit, ou disparaître.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous exigeons que chaque friction du parcours d'inscription (champ, étape, vérification) soit justifiée par une valeur ou un risque réels, jamais par habitude.

> **Pourquoi** : un formulaire vidé après erreur, un bouton désactivé sans raison, une vérification qui barre l'accès et un champ « société » obligatoire à l'inscription sont quatre formes du même défaut — on fait payer l'utilisateur avant de l'avoir servi. Le flow est l'échelle où ce défaut coûte le plus cher, parce que l'engagement y est le plus faible.

## Sources et niveau de confiance

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| S1 | Le minimum pour créer, le reste par profilage progressif | NN/g (inscription, progressive disclosure) ; Baymard (abandon de tunnel) | Établi |
| S2 | Création de compte forcée = cause majeure d'abandon ; proposer invité/essai | Baymard Institute (checkout usability, forced account creation) | Établi |
| S3 | « Confirmez le mot de passe » est un anti-pattern ; préférer la bascule d'affichage | NN/g (password creation, show-password) | Convergence forte |
| S4 | Autoriser collage et gestionnaires de mots de passe | NIST SP 800-63B ; consensus sécurité/accessibilité | Établi |
| S5 | Contraintes de mot de passe annoncées avant la saisie | WCAG 3.3.2 (niveau A) | Établi |
| S6 | Pas de test cognitif à l'authentification / inscription | WCAG 2.2 — 3.3.8 (niveau AA) | Établi — critère |
| S7 | Ne pas redemander une info déjà fournie dans le parcours | WCAG 2.2 — 3.3.7 (niveau A) ; GOV.UK « ask once » | Établi — critère |
| S8 | Longueur > complexité, 15 caractères en facteur unique (8 avec MFA), pas d'expiration forcée, blocklist | [NIST SP 800-63B-4](https://pages.nist.gov/800-63-4/sp800-63b.html) | Établi (référentiel) |
| S9 | Vérification e-mail avant activation quand l'adresse porte l'identité ; accès provisoire seulement selon le risque | [OWASP — Email Validation and Verification](https://cheatsheetseries.owasp.org/cheatsheets/Email_Validation_and_Verification_Cheat_Sheet.html) | Établi pour la preuve ; décision produit pour le provisoire |
| S10 | Consentement : libre, éclairé, spécifique, non pré-coché, dégroupé du nécessaire | RGPD art. 4(11) & art. 7 ; lignes directrices EDPB sur le consentement | Établi — cadre légal |
| S11 | Énumération de comptes : ne pas confirmer l'existence d'une adresse | OWASP (authentication / account enumeration) | Établi — mais en tension avec l'UX, posture arbitrée |
| S12 | Rapprochement de comptes seulement après preuve de contrôle, jamais sur l'e-mail seul | OWASP (identité et vérification de l'e-mail) ; politique d'identité du produit | Établi pour la preuve ; mécanique produit |
| S13 | Squelette à quatre moments, découpage minimal des étapes | Dérivé de FORM-UX § multi-étapes (GOV.UK « one thing per page ») appliqué au parcours | Structure interne dérivée |

## À approfondir

- **Connexion (login)** : le pendant du parcours — récupération de mot de passe, « rester connecté », verrouillage après échecs. Flow voisin, à traiter quand la nature Flow s'étendra ; plusieurs règles ici (bascule d'affichage, pas de test cognitif, énumération) lui seront communes.
- **Onboarding produit** : la séquence *après* l'atterrissage (activation, premier succès) — distincte de la création de compte proprement dite ; frontière à tracer quand elle existera pour éviter que l'inscription ne réabsorbe le tunnel qu'elle a su reporter.
- **Passkeys / sans mot de passe** : mentionné comme méthode ; sa mécanique propre (WebAuthn, repli) mérite son traitement quand un consommateur en a besoin.
- **Comptes d'organisation / invitation** : créer un compte *dans* une équipe (invité par un tiers) inverse plusieurs hypothèses (l'e-mail est déjà connu, le rôle est prédéfini) — parcours dérivé à part entière.

---

# Extensions conditionnelles

> Chaque extension ci-dessous est compilée en un `dist/RULES-creation-compte-<nom>.md` distinct (`type: extension`, `extension-de: creation-compte`). Elle ne se charge **jamais** d'office avec le flow : seulement quand le contexte du build la nomme réellement. Charge le flow parent d'abord, l'extension en complément ciblé.

## Extension — Vérification de l'e-mail  ·  `creation-compte-verification-email`

RÈGLE [CREATION-COMPTE-R39] : choisir la porte selon le rôle réel de l'e-mail. S'il établit l'identité ou la récupération, vérifier avant d'activer le compte. Un accès provisoire avant vérification n'est possible que dans un périmètre faible risque explicitement borné ; il n'est jamais le défaut silencieux d'un produit « grand public ».
STATUT : propriété universelle
SOURCE : S9
ÉNONCÉ : Un compte dont l'e-mail établit l'identité ou la récupération doit être vérifié avant activation ; un accès provisoire suppose un périmètre à faible risque explicitement borné.

RÈGLE [CREATION-COMPTE-R40] : lorsqu'un accès provisoire est autorisé, l'état « en attente de vérification » est **persistant et non bloquant** — un `alert` d'information (ALERT-UX), pas une modale récurrente. Il nomme clairement les fonctions indisponibles et fournit le chemin de vérification.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous affichons l'attente de vérification d'e-mail par un message d'information persistant et non bloquant, pas par une modale récurrente.
MESURE : l'état « en attente de vérification » est affiché via un alert d'information persistant, jamais une modale récurrente ; il indique les fonctions indisponibles et un chemin de vérification

RÈGLE [CREATION-COMPTE-R41] : toujours offrir un **renvoi** du lien/code, avec un anti-spam honnête (compte à rebours visible avant de pouvoir renvoyer), et un chemin pour **corriger l'e-mail** — la faute de frappe dans l'adresse est le premier motif de non-réception, pas la panne d'e-mail.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous proposons toujours de renvoyer le lien ou le code de vérification, avec un anti-spam honnête et un moyen de corriger l'adresse e-mail saisie.
MESURE : un lien « renvoyer » est proposé avec un délai ou compte à rebours visible avant réactivation, et un chemin pour corriger l'adresse e-mail saisie est disponible

RÈGLE [CREATION-COMPTE-R42] : un lien de vérification **expire** ; l'écran atteint après expiration ne dit pas seulement « lien expiré » — il propose d'en renvoyer un immédiatement, sans redemander l'e-mail (WCAG 3.3.7).
STATUT : propriété universelle
SOURCE : S7
ÉNONCÉ : L'écran atteint après expiration d'un lien de vérification doit proposer un renvoi immédiat sans redemander l'adresse e-mail.
MESURE : l'écran affiché après expiration du lien de vérification propose un renvoi immédiat sans redemander l'adresse e-mail

RÈGLE [CREATION-COMPTE-R43] : la vérification réussie ramène la personne **là où elle allait**, pas sur une page morte « e-mail vérifié ». Si elle était en train de faire une action sensible, l'action reprend.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous ramenons la personne, après vérification réussie de son e-mail, là où elle allait plutôt que sur une page morte « e-mail vérifié ».
MESURE : après vérification réussie, la personne est redirigée vers l'action ou l'écran qu'elle visait avant l'inscription, pas vers une page « e-mail vérifié » isolée

CONFIANCE : établi pour la vérification de possession lorsque l'e-mail porte l'identité ; l'étendue d'un éventuel accès provisoire reste une décision de risque produit.

## Extension — SSO et connexion sociale  ·  `creation-compte-sso-social`

RÈGLE [CREATION-COMPTE-R44] : les fournisseurs tiers s'affichent à **poids visuel égal** entre eux et comparable à l'e-mail — le mécanisme (style/tone) est de BUTTON-UX ; l'exigence d'absence de piège est du flow.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous affichons les fournisseurs tiers d'inscription à poids visuel égal entre eux et comparable à l'option e-mail.
MESURE : les boutons des fournisseurs SSO ont un poids visuel égal entre eux et comparable au bouton d'inscription par e-mail

RÈGLE [CREATION-COMPTE-R45] : viser un seul compte par personne sans créer de faille : même e-mail via un fournisseur puis par mot de passe ⇒ proposer un rapprochement **après preuve de contrôle** du compte existant ou identité tierce explicitement vérifiée. Ne jamais fusionner automatiquement sur la seule égalité de l'e-mail ; sans preuve, ouvrir récupération ou assistance.
STATUT : propriété universelle
SOURCE : S12
ÉNONCÉ : Un compte créé par SSO ne doit jamais fusionner automatiquement avec un compte e-mail existant sur la seule correspondance d'adresse.
MESURE : le rapprochement d'un compte SSO avec un compte e-mail existant n'a lieu qu'après réauthentification ou preuve d'identité vérifiée, jamais automatiquement sur la seule correspondance d'adresse

RÈGLE [CREATION-COMPTE-R46] : ne réclamer au fournisseur que le **minimum** (identité + e-mail vérifié) ; ne pas demander des périmètres (scopes) larges « au cas où ». Un écran de consentement OAuth qui réclame trop est un motif d'abandon et de défiance.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous ne demandons aux fournisseurs SSO que le minimum (identité et e-mail vérifié), jamais des périmètres d'accès larges par précaution.
MESURE : l'intégration SSO ne demande au fournisseur que l'identité et l'e-mail vérifié, aucun scope additionnel n'est demandé par défaut

RÈGLE [CREATION-COMPTE-R47] : gérer explicitement l'**échec ou l'annulation** côté fournisseur (la personne ferme la fenêtre, refuse le partage) — retour à l'écran de méthode avec un message neutre (VOICE), jamais une impasse ni une accusation.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous gérons explicitement l'échec ou l'annulation d'une connexion SSO en ramenant la personne à l'écran de méthode, avec un message neutre.
MESURE : en cas d'échec ou d'annulation du SSO, la personne revient à l'écran de choix de méthode avec un message neutre, sans accusation

RÈGLE [CREATION-COMPTE-R48] : un e-mail rendu **déjà vérifié** par un fournisseur de confiance ne relance pas le parcours de vérification (WCAG 3.3.7 — ne pas redemander).
STATUT : propriété universelle
SOURCE : S7
ÉNONCÉ : Un e-mail rendu déjà vérifié par un fournisseur de confiance ne doit pas relancer le parcours de vérification d'e-mail.
MESURE : si le fournisseur SSO atteste l'e-mail comme déjà vérifié, aucun écran de vérification d'e-mail supplémentaire n'est affiché

CONFIANCE : convergence (pratiques des grands fournisseurs) ; la mécanique de linking et le choix des fournisseurs restent des décisions produit.

## Extension — Force et règles du mot de passe  ·  `creation-compte-force-mot-de-passe`

RÈGLE [CREATION-COMPTE-R49] : suivre NIST SP 800-63B-4 — **la longueur prime sur la complexité** ; exiger au moins **15 caractères** lorsque le mot de passe est le seul facteur, ou au moins **8** lorsqu'il n'est utilisable que dans un processus multifacteur ; accepter au moins 64 caractères ; **ne pas** imposer de composition arbitraire ni d'expiration périodique forcée.
STATUT : propriété universelle
SOURCE : S8
ÉNONCÉ : Le mot de passe doit privilégier la longueur sur la complexité : au moins 15 caractères en facteur unique (8 avec MFA), 64 acceptés, sans composition ni expiration forcées.
MESURE : le mot de passe minimum est de 15 caractères en authentification à facteur unique (8 si MFA obligatoire), au moins 64 caractères acceptés, aucune règle de composition imposée ni expiration périodique forcée

RÈGLE [CREATION-COMPTE-R50] : refuser les mots de passe **compromis ou évidents** (blocklist des fuites connues, mot de passe = e-mail, suites triviales) — c'est plus protecteur que n'importe quelle règle de composition, et ça se dit à la personne clairement, au bon moment.
STATUT : propriété universelle
SOURCE : S8
ÉNONCÉ : Un mot de passe compromis ou évident (fuite connue, égal à l'e-mail, suite triviale) doit être refusé via une blocklist.
MESURE : le mot de passe saisi est comparé à une blocklist de mots de passe compromis ou évidents (fuites connues, valeur égale à l'e-mail, suites triviales) et refusé s'il y figure

RÈGLE [CREATION-COMPTE-R51] : le **feedback de force est honnête**, pas un théâtre — une barre qui passe au vert dès trois caractères ment. S'il est affiché, il reflète une mesure réelle (longueur, présence dans une blocklist), et son timing suit la validation différée pendant la frappe (INPUT-UX) : après une pause, jamais à chaque touche.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Nous n'affichons un indicateur de force du mot de passe que s'il reflète une mesure réelle, mise à jour après une pause, jamais à chaque touche.
MESURE : l'indicateur de force du mot de passe, s'il est affiché, reflète une mesure réelle et se met à jour après une pause dans la frappe, pas à chaque touche

RÈGLE [CREATION-COMPTE-R52] : contraintes annoncées **avant** la saisie (WCAG 3.3.2), collage et gestionnaires **autorisés**, bascule d'affichage **offerte**, **un seul** champ (pas de confirmation). Ces quatre points sont l'application, au mot de passe d'inscription, de règles déjà posées par INPUT-UX et le cœur du flow.
STATUT : propriété universelle
SOURCE : S5,S3,S4
ÉNONCÉ : Le champ mot de passe d'inscription doit annoncer ses contraintes avant la saisie, autoriser collage et gestionnaires, offrir une bascule, sans champ de confirmation.
MESURE : le champ mot de passe d'inscription affiche ses contraintes avant la saisie, autorise le collage et les gestionnaires, propose une bascule d'affichage, et n'a pas de champ de confirmation

CONFIANCE : établi pour les minima du référentiel NIST et WCAG 3.3.2 ; choisir un seuil plus exigeant ou afficher un indicateur de force reste une décision produit à justifier.

## Extension — E-mail déjà utilisé  ·  `creation-compte-email-deja-utilise`

RÈGLE [CREATION-COMPTE-R53] : ce cas n'est pas une erreur de saisie — c'est une **bifurcation**. La personne a probablement déjà un compte. Le parcours lui ouvre le chemin adapté (se connecter, ou récupérer son mot de passe), sans la renvoyer au début ni lui faire recommencer sa saisie (WCAG 3.3.7).
STATUT : propriété universelle
SOURCE : S7
ÉNONCÉ : Un e-mail déjà utilisé doit ouvrir un chemin vers la connexion ou la récupération, sans renvoyer la personne au début ni effacer sa saisie.
MESURE : en cas d'e-mail déjà utilisé, un chemin vers la connexion ou la récupération est proposé sans effacer ni redemander la saisie déjà faite

RÈGLE [CREATION-COMPTE-R54] : arbitrer la **tension énumération de comptes ↔ entraide** avec le produit, et l'assumer :
STATUT : parti pris d'identité
SOURCE : S11
ÉNONCÉ : Nous demandons au produit d'arbitrer explicitement, une fois pour toutes, entre une posture ouverte ou neutre face à un e-mail déjà utilisé.
- posture *ouverte* (grand public à faible enjeu) : dire « un compte existe déjà avec cet e-mail » et proposer la connexion — pratique, au prix d'une confirmation d'existence ;
- posture *neutre* (enjeu sécurité, OWASP) : ne pas confirmer l'existence dans l'interface, envoyer par e-mail le bon chemin (« si un compte existe, voici comment vous connecter »), et garder des temps de réponse constants pour ne pas trahir le compte par la latence.

Le flow **impose de choisir explicitement** l'une des deux et de la tenir partout (inscription, connexion, récupération) ; il n'impose pas laquelle — c'est le risque du produit qui tranche.

RÈGLE [CREATION-COMPTE-R55] : **tant que le produit n'a pas tranché**, l'agent qui construit ne choisit pas à sa place : il **remonte le choix** (« posture ouverte ou neutre ? ») et applique **par défaut la posture neutre**, la plus protectrice — ne pas révéler l'existence d'un compte dans l'interface avant arbitrage. Retenir la posture ouverte **en silence** est le défaut à éviter : c'est une décision de sécurité, pas un réglage d'écran.
STATUT : parti pris d'identité
SOURCE : S11
ÉNONCÉ : Tant que le produit n'a pas tranché la posture sur « e-mail déjà utilisé », nous appliquons par défaut la posture neutre et remontons la décision.
MESURE : en l'absence d'arbitrage produit explicite, l'écran « e-mail déjà utilisé » applique la posture neutre (aucune confirmation d'existence de compte dans l'interface) et signale le choix à trancher

RÈGLE [CREATION-COMPTE-R56] : la détection « déjà pris » pendant la saisie relève de la validation asynchrone (extension `form-async-validation`) ; en posture neutre, on ne la fait **pas** en direct (elle révélerait l'existence) — on ne tranche qu'à la soumission, côté serveur.
STATUT : propriété universelle
SOURCE : S11
ÉNONCÉ : En posture neutre, la disponibilité d'un e-mail ne doit jamais être révélée en direct pendant la frappe, seulement à la soumission, côté serveur.
MESURE : en posture neutre, aucune validation en direct pendant la frappe ne signale qu'un e-mail est déjà enregistré ; la vérification n'a lieu qu'à la soumission, côté serveur

CONFIANCE : établi pour le risque d'énumération (OWASP) ; la posture est une décision de sécurité produit, non un défaut du design — le flow rend le choix visible et cohérent. **Défaut en l'absence d'arbitrage : posture neutre + remontée** (retour de pilote 2026-07-16 — un agent non briefé a choisi la posture ouverte en silence sur ce point précis).

## Extension — Consentement à l'inscription  ·  `creation-compte-consentement`

RÈGLE [CREATION-COMPTE-R57] : distinguer trois actes qui n'ont pas la même base : **accepter les CGU** peut matérialiser le contrat ; **prendre connaissance de la politique de confidentialité** est une information, pas un consentement global au traitement ; **consentir** ne concerne que les finalités réellement facultatives (marketing, traitements optionnels). L'accès au produit ne dépend jamais d'un consentement marketing — sinon il n'est pas libre (RGPD art. 7).
STATUT : propriété universelle
SOURCE : S10
ÉNONCÉ : L'accès au produit ne doit jamais dépendre d'un consentement marketing distinct de l'acceptation des CGU.
MESURE : l'accès au produit n'est jamais conditionné à l'acceptation d'un consentement marketing distinct des CGU

RÈGLE [CREATION-COMPTE-R58] : **aucune case pré-cochée** pour un consentement (RGPD, EDPB — le consentement suppose un acte positif clair) ; **une finalité = une case** (dégroupage), jamais un « j'accepte tout » qui mélange CGU, cookies et marketing.
STATUT : propriété universelle
SOURCE : S10
ÉNONCÉ : Aucune case de consentement ne doit être pré-cochée, et chaque finalité doit avoir sa propre case, jamais un « tout accepter » qui les regroupe.
MESURE : aucune case de consentement n'est pré-cochée par défaut ; chaque finalité dispose de sa propre case, sans case globale regroupant CGU et marketing

RÈGLE [CREATION-COMPTE-R59] : appliquer la convention de marquage du formulaire à l'envers de l'habitude — ici l'**optionnel** (marketing) est explicitement présenté comme tel, et rien dans la mise en forme ne pousse à cocher (poids visuel égal, pas de case marketing plus grosse ou colorée que le reste — pas de dark pattern, cf. `content/md/principles/LAWS-UX.md`).
STATUT : propriété universelle
SOURCE : S10
ÉNONCÉ : Une case de consentement facultative (marketing) ne doit pas être mise en avant visuellement par rapport aux autres éléments du formulaire.
MESURE : la case de consentement marketing (optionnel) n'a pas de mise en forme plus visible (taille, couleur) que les autres éléments du formulaire

RÈGLE [CREATION-COMPTE-R60] : donner accès aux CGU et à l'information de confidentialité **avant** le point de décision — pas seulement en pied de page. Le mécanisme de la case et du lien appartient à FORM/INPUT ; la base légale et le texte appartiennent au produit/juridique.
STATUT : propriété universelle
SOURCE : S10
ÉNONCÉ : L'accès aux CGU et à la politique de confidentialité doit être visible avant le point de décision de l'inscription, pas seulement en pied de page.
MESURE : les liens vers les CGU et la politique de confidentialité sont visibles avant le point de décision (bouton de création de compte), pas uniquement en pied de page

RÈGLE [CREATION-COMPTE-R61] : **la politique de confidentialité se présente, elle ne s'accepte pas** (RGPD art. 13 — une information due, pas un contrat). ❌ « En créant un compte, vous acceptez nos CGU **et notre politique de confidentialité** » — un même geste ne peut pas porter à la fois un accord contractuel et une prise de connaissance. ❌ « J'accepte la politique de confidentialité » (case dédiée ou groupée). ✅ « En créant un compte, vous acceptez nos CGU. Consultez notre politique de confidentialité. » La fusion se signale **même sans case à cocher**, dès qu'un « vous acceptez » englobe la politique de confidentialité.
STATUT : propriété universelle
SOURCE : S10
ÉNONCÉ : La politique de confidentialité doit se présenter comme une information consultable, jamais comme un objet qu'on « accepte » avec les CGU.
MESURE : le texte associé au bouton de création de compte ne fait accepter que les CGU ; la politique de confidentialité est seulement mentionnée comme consultable, sans case ni verbe d'acceptation qui l'engloberait

RÈGLE [CREATION-COMPTE-R62] : si le service impose un âge minimum, le vérifier **sobrement** (une déclaration, pas un interrogatoire) et sans stocker plus que nécessaire — la minimisation des données s'applique aussi à la vérification d'âge.
STATUT : propriété universelle
SOURCE : interne
ÉNONCÉ : Une vérification d'âge minimum, si elle est requise, doit se faire par simple déclaration, sans interrogatoire, et sans stocker plus de données que nécessaire.
MESURE : si un âge minimum est requis, il est vérifié par une simple déclaration, sans pièce justificative demandée, et aucune donnée d'âge précise n'est stockée au-delà du nécessaire

CONFIANCE : établi pour le cadre RGPD (art. 4(11), art. 7 ; lignes directrices EDPB) ; l'implémentation exacte (quelles finalités, quel texte) est une décision produit et juridique, hors design system.
