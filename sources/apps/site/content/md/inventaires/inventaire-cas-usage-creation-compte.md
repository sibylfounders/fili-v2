# Inventaire des cas d'usage — Création de compte (flow de parcours)

> Checklist de couverture pour `content/md/flows/CREATION-COMPTE-UX.md` v1.2.0. Premier inventaire de la nature Flow : les cas ne sont pas des variantes visuelles mais des **moments** et des **arbitrages** du parcours. La colonne « statut » rend les trous visibles ; chaque cas renvoie à la règle qui le tranche (ou à son propriétaire) via la table d'autorité.

**Statuts** : `Couvert` (une règle du flow ou d'un propriétaire tranche le cas) · `Partiel` (posé mais incomplet, ou partagé avec un propriétaire hors design system) · `Absent` (identifié, pas encore traité) · `En attente` (relève d'une décision produit / juridique / sécurité serveur — le design system rend la frontière visible sans trancher à la place du métier).

---

## 1. Socle du parcours

| Cas d'usage | Description | Statut et propriétaire |
|---|---|---|
| Point d'entrée et promesse | Comment la personne arrive à l'inscription, et ce qu'on lui promet | **Couvert** — creation-compte § Préconditions et points d'entrée |
| Choix de la méthode | Offrir e-mail, SSO/social et lien magique sans en piéger aucun | **Couvert** — creation-compte § Choisir une méthode |
| Saisie du minimum viable | Ne demander que l'identifiant et le moyen d'auth pour créer le compte | **Couvert** — creation-compte § Le minimum viable + FORM |
| Machine à états du parcours | La trajectoire du compte entre écrans, de rien à actif | **Couvert** — creation-compte § Machine à états du parcours |
| États transitoires | Les moments d'attente (soumission, création, envoi) et leur sortie de scène | **Couvert** — creation-compte § États transitoires + BUTTON / ALERT |
| Atterrissage et prochaine action | Où la personne est déposée une fois le compte créé | **Couvert** — creation-compte § L'atterrissage |

## 2. Identité, credential, sécurité

| Cas d'usage | Description | Statut et propriétaire |
|---|---|---|
| Mot de passe à l'inscription | Le champ de création du mot de passe | **Couvert** — INPUT + extension force-mot-de-passe |
| Force et règles du mot de passe | 15 caractères en facteur unique, 8 avec MFA, 64 acceptés, blocklist, pas d'expiration ni de composition arbitraires | **Couvert** — extension creation-compte-force-mot-de-passe (NIST SP 800-63B-4) |
| Connexion fédérée / SSO / social | S'inscrire via un fournisseur tiers | **Couvert** — extension creation-compte-sso-social |
| Retour par une autre méthode (même e-mail) | Inscrit via un tiers, la personne revient par e-mail | **Couvert** — rapprochement après preuve de contrôle uniquement, extension sso-social |
| E-mail déjà utilisé | L'adresse saisie correspond à un compte existant | **Couvert** — extension creation-compte-email-deja-utilise |
| Prévention des doublons | Un même humain ne doit pas produire deux comptes | **Couvert** — extensions sso-social + email-deja-utilise |
| Anti-robot / captcha | Bloquer les inscriptions automatisées sans punir l'humain | **Couvert** — pas de test cognitif bloquant (WCAG 3.3.8), alternative accessible |
| Vérification de l'e-mail | Vérifier avant activation quand l'adresse porte l'identité ; borner explicitement tout accès provisoire faible risque | **Couvert** — extension creation-compte-verification-email |
| Invitation / lien magique | Entrer par un lien reçu plutôt qu'un mot de passe | **Partiel** — offert comme méthode, pas de moment dédié ; creation-compte § Points d'entrée |
| Expiration d'un lien ou d'un code | Le lien ou le code de vérification a expiré | **Couvert** — extension verification-email |
| Renvoi d'un code | Redemander un code non reçu | **Couvert** — extension verification-email (anti-spam) |
| Changement d'adresse e-mail en cours | Corriger l'e-mail avant de le valider | **Couvert** — extension verification-email |
| Limitation des tentatives | Trop d'essais d'inscription ou de vérification | **Partiel** — signalement UX = ALERT / VOICE ; mécanique = serveur, hors DS |
| Détection de fraude / contrôle supplémentaire | Un signal de risque impose une vérification en plus | **En attente** — sécurité serveur / produit ; le flow expose le point, ne le tranche pas |

## 3. Conformité et contenu

| Cas d'usage | Description | Statut et propriétaire |
|---|---|---|
| Consentements obligatoires et facultatifs | Séparer le nécessaire (CGU) du facultatif (marketing) | **Couvert** — extension creation-compte-consentement (RGPD art. 7) |
| Acceptation des conditions (CGU) | Recueillir l'accord aux conditions d'utilisation | **Couvert** — extension consentement, séparée du marketing |
| Champ de profil réclamé à l'inscription | Tentation d'ajouter nom, société, téléphone à l'entrée | **Couvert** — creation-compte § Le minimum viable (profilage progressif) |
| Âge minimum selon le contexte | Vérifier un âge plancher quand la loi l'exige | **En attente** — décision produit / juridique (COPPA, RGPD art. 8), hors périmètre DS |
| Internationalisation (wording, expansion, RTL) | Adapter le parcours à d'autres langues et sens de lecture | **En attente** — VOICE pour le wording ; RTL non traité au niveau flow |

## 4. Résilience et sortie

| Cas d'usage | Description | Statut et propriétaire |
|---|---|---|
| Erreurs locales (champ) | Une saisie de champ est invalide | **Couvert** — INPUT / FORM |
| Erreurs serveur | Le serveur refuse ou échoue | **Couvert** — ALERT / FORM + extensions |
| Indisponibilité réseau | La requête ne part pas ou se perd | **Partiel** — cycle de soumission = FORM ; message = ALERT / VOICE ; pas de règle flow dédiée |
| Chargement et soumission | Le parcours attend une réponse serveur | **Couvert** — BUTTON (loading) / FORM |
| Anti-double-activation | Éviter la double soumission d'un même écran | **Couvert** — BUTTON |
| Abandon et reprise | La personne quitte en cours et revient plus tard | **Couvert** — creation-compte § Abandon et réentrée |
| Sortie de scène de chaque état transitoire | Aucun état d'attente ne reste figé sans issue | **Couvert** — creation-compte § États transitoires |
| Création partielle du compte | Compte créé mais non finalisé ou non vérifié | **En attente** — produit / serveur ; purge ou complétion à trancher |
| Échec serveur après création | Le compte existe mais l'étape suivante échoue | **Partiel** — ALERT + creation-compte § États transitoires ; récupération = produit |
| Suppression / correction après une erreur | Annuler ou corriger après un faux départ | **En attente** — produit (annulation / rollback), hors périmètre DS |

## 5. Accessibilité du parcours

| Cas d'usage | Description | Statut et propriétaire |
|---|---|---|
| Clavier de bout en bout | Franchir tout le parcours sans souris | **Couvert** — ACCESSIBILITY + creation-compte § Accessibilité du parcours |
| Focus au changement d'écran ou d'étape | Le focus suit la progression du parcours | **Couvert** — creation-compte § Accessibilité du parcours (WCAG 2.4.3) |
| Annonces de transition et de progression | Signaler une mise à jour sans changement de contexte, sans doubler une transition déjà portée par le focus | **Couvert** — creation-compte § Accessibilité du parcours (WCAG 4.1.3) |
| Gestionnaire de mots de passe / autofill | Laisser remplir et coller sans entrave | **Couvert** — INPUT (collage et gestionnaires autorisés) |
| Accessibilité de l'e-mail de vérification et de son lien | Le message et son lien doivent rester utilisables | **Partiel** — extension verification-email ; le contenu de l'e-mail sort du rendu web |

---

## Ce que cet inventaire n'impose pas
- Les cas `En attente` sont des **décisions produit, juridiques ou de sécurité serveur** : le flow nomme le cas et son propriétaire mais ne tranche pas à la place du métier — âge minimum, création partielle, suppression après erreur, step-up de fraude, i18n / RTL.
- Les cas `Partiel` sont **partagés** avec un propriétaire hors design system (serveur, contenu d'e-mail) : le flow porte le signalement UX, pas la mécanique.
- À confronter au crawl Mobbin : le corpus réel révélera surtout des **étapes, états et récupérations** — c'est la section « Résilience et sortie » qui bougera le plus.
