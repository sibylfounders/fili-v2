---
sujet: "creation-compte-force-mot-de-passe"
type: "extension"
extension-de: "creation-compte"
resume: "Mot de passe selon NIST SP 800-63B-4 : 15 caractères en facteur unique, 8 avec MFA, 64 acceptés, blocklist, pas de composition ni expiration arbitraires."
requires: ["creation-compte"]
selon-contexte: []
source-version: "1.3.2"
source-sha256: "7aa1fb9eb9dc9f84951bc7fc5f33611c664a92be1d96134d90399161fa2db54b"
source-file: "atelier/flows/creation-compte/CREATION-COMPTE-UX.md"
---
# RULES — Création de compte / Force et règles du mot de passe (extension compilée)

> Extrait mécaniquement de `atelier/flows/creation-compte/CREATION-COMPTE-UX.md` (v1.3.2, SHA-256 `7aa1fb9eb9dc9f84951bc7fc5f33611c664a92be1d96134d90399161fa2db54b`). Charger avec `creation-compte` seulement si le contexte l'exige. Ne pas éditer.

RÈGLE : suivre NIST SP 800-63B-4 — **la longueur prime sur la complexité** ; exiger au moins **15 caractères** lorsque le mot de passe est le seul facteur, ou au moins **8** lorsqu'il n'est utilisable que dans un processus multifacteur ; accepter au moins 64 caractères ; **ne pas** imposer de composition arbitraire ni d'expiration périodique forcée.

RÈGLE : refuser les mots de passe **compromis ou évidents** (blocklist des fuites connues, mot de passe = e-mail, suites triviales) — c'est plus protecteur que n'importe quelle règle de composition, et ça se dit à la personne clairement, au bon moment.

RÈGLE : le **feedback de force est honnête**, pas un théâtre — une barre qui passe au vert dès trois caractères ment. S'il est affiché, il reflète une mesure réelle (longueur, présence dans une blocklist), et son timing suit la validation différée pendant la frappe (INPUT-UX) : après une pause, jamais à chaque touche.

RÈGLE : contraintes annoncées **avant** la saisie (WCAG 3.3.2), collage et gestionnaires **autorisés**, bascule d'affichage **offerte**, **un seul** champ (pas de confirmation). Ces quatre points sont l'application, au mot de passe d'inscription, de règles déjà posées par INPUT-UX et le cœur du flow.

CONFIANCE : établi pour les minima du référentiel NIST et WCAG 3.3.2 ; choisir un seuil plus exigeant ou afficher un indicateur de force reste une décision produit à justifier.
