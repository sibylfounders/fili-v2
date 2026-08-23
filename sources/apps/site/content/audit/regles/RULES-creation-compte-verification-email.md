---
sujet: "creation-compte-verification-email"
type: "extension"
extension-de: "creation-compte"
resume: "Vérification de l'e-mail selon le rôle de l'adresse et le risque : preuve avant activation, ou accès provisoire explicitement borné ; renvoi, correction, expiration et reprise du parcours."
requires: ["creation-compte"]
selon-contexte: []
source-version: "1.3.2"
source-sha256: "7aa1fb9eb9dc9f84951bc7fc5f33611c664a92be1d96134d90399161fa2db54b"
source-file: "atelier/flows/creation-compte/CREATION-COMPTE-UX.md"
---
# RULES — Création de compte / Vérification de l'e-mail (extension compilée)

> Extrait mécaniquement de `atelier/flows/creation-compte/CREATION-COMPTE-UX.md` (v1.3.2, SHA-256 `7aa1fb9eb9dc9f84951bc7fc5f33611c664a92be1d96134d90399161fa2db54b`). Charger avec `creation-compte` seulement si le contexte l'exige. Ne pas éditer.

RÈGLE : choisir la porte selon le rôle réel de l'e-mail. S'il établit l'identité ou la récupération, vérifier avant d'activer le compte. Un accès provisoire avant vérification n'est possible que dans un périmètre faible risque explicitement borné ; il n'est jamais le défaut silencieux d'un produit « grand public ».

RÈGLE : lorsqu'un accès provisoire est autorisé, l'état « en attente de vérification » est **persistant et non bloquant** — un `alert` d'information (ALERT-UX), pas une modale récurrente. Il nomme clairement les fonctions indisponibles et fournit le chemin de vérification.

RÈGLE : toujours offrir un **renvoi** du lien/code, avec un anti-spam honnête (compte à rebours visible avant de pouvoir renvoyer), et un chemin pour **corriger l'e-mail** — la faute de frappe dans l'adresse est le premier motif de non-réception, pas la panne d'e-mail.

RÈGLE : un lien de vérification **expire** ; l'écran atteint après expiration ne dit pas seulement « lien expiré » — il propose d'en renvoyer un immédiatement, sans redemander l'e-mail (WCAG 3.3.7).

RÈGLE : la vérification réussie ramène la personne **là où elle allait**, pas sur une page morte « e-mail vérifié ». Si elle était en train de faire une action sensible, l'action reprend.

CONFIANCE : établi pour la vérification de possession lorsque l'e-mail porte l'identité ; l'étendue d'un éventuel accès provisoire reste une décision de risque produit.
