---
sujet: "creation-compte-email-deja-utilise"
type: "extension"
extension-de: "creation-compte"
resume: "E-mail déjà utilisé : bifurcation vers connexion ou récupération, avec une posture d'énumération de comptes explicitement arbitrée et tenue sur tout le produit."
requires: ["creation-compte"]
selon-contexte: []
source-version: "1.3.2"
source-sha256: "7aa1fb9eb9dc9f84951bc7fc5f33611c664a92be1d96134d90399161fa2db54b"
source-file: "atelier/flows/creation-compte/CREATION-COMPTE-UX.md"
---
# RULES — Création de compte / E-mail déjà utilisé (extension compilée)

> Extrait mécaniquement de `atelier/flows/creation-compte/CREATION-COMPTE-UX.md` (v1.3.2, SHA-256 `7aa1fb9eb9dc9f84951bc7fc5f33611c664a92be1d96134d90399161fa2db54b`). Charger avec `creation-compte` seulement si le contexte l'exige. Ne pas éditer.

RÈGLE : ce cas n'est pas une erreur de saisie — c'est une **bifurcation**. La personne a probablement déjà un compte. Le parcours lui ouvre le chemin adapté (se connecter, ou récupérer son mot de passe), sans la renvoyer au début ni lui faire recommencer sa saisie (WCAG 3.3.7).

RÈGLE : arbitrer la **tension énumération de comptes ↔ entraide** avec le produit, et l'assumer :
- posture *ouverte* (grand public à faible enjeu) : dire « un compte existe déjà avec cet e-mail » et proposer la connexion — pratique, au prix d'une confirmation d'existence ;
- posture *neutre* (enjeu sécurité, OWASP) : ne pas confirmer l'existence dans l'interface, envoyer par e-mail le bon chemin (« si un compte existe, voici comment vous connecter »), et garder des temps de réponse constants pour ne pas trahir le compte par la latence.

Le flow **impose de choisir explicitement** l'une des deux et de la tenir partout (inscription, connexion, récupération) ; il n'impose pas laquelle — c'est le risque du produit qui tranche.

RÈGLE : **tant que le produit n'a pas tranché**, l'agent qui construit ne choisit pas à sa place : il **remonte le choix** (« posture ouverte ou neutre ? ») et applique **par défaut la posture neutre**, la plus protectrice — ne pas révéler l'existence d'un compte dans l'interface avant arbitrage. Retenir la posture ouverte **en silence** est le défaut à éviter : c'est une décision de sécurité, pas un réglage d'écran.

RÈGLE : la détection « déjà pris » pendant la saisie relève de la validation asynchrone (extension `form-async-validation`) ; en posture neutre, on ne la fait **pas** en direct (elle révélerait l'existence) — on ne tranche qu'à la soumission, côté serveur.

CONFIANCE : établi pour le risque d'énumération (OWASP) ; la posture est une décision de sécurité produit, non un défaut du design — le flow rend le choix visible et cohérent. **Défaut en l'absence d'arbitrage : posture neutre + remontée** (retour de pilote 2026-07-16 — un agent non briefé a choisi la posture ouverte en silence sur ce point précis).
