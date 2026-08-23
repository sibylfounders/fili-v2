---
sujet: "creation-compte-sso-social"
type: "extension"
extension-de: "creation-compte"
resume: "SSO et connexion sociale : fournisseurs comparables, scopes minimaux, échec géré et rapprochement uniquement après preuve de contrôle — jamais sur la seule égalité d'un e-mail."
requires: ["creation-compte"]
selon-contexte: []
source-version: "1.3.2"
source-sha256: "7aa1fb9eb9dc9f84951bc7fc5f33611c664a92be1d96134d90399161fa2db54b"
source-file: "atelier/flows/creation-compte/CREATION-COMPTE-UX.md"
---
# RULES — Création de compte / SSO et connexion sociale (extension compilée)

> Extrait mécaniquement de `atelier/flows/creation-compte/CREATION-COMPTE-UX.md` (v1.3.2, SHA-256 `7aa1fb9eb9dc9f84951bc7fc5f33611c664a92be1d96134d90399161fa2db54b`). Charger avec `creation-compte` seulement si le contexte l'exige. Ne pas éditer.

RÈGLE : les fournisseurs tiers s'affichent à **poids visuel égal** entre eux et comparable à l'e-mail — le mécanisme (style/tone) est de BUTTON-UX ; l'exigence d'absence de piège est du flow.

RÈGLE : viser un seul compte par personne sans créer de faille : même e-mail via un fournisseur puis par mot de passe ⇒ proposer un rapprochement **après preuve de contrôle** du compte existant ou identité tierce explicitement vérifiée. Ne jamais fusionner automatiquement sur la seule égalité de l'e-mail ; sans preuve, ouvrir récupération ou assistance.

RÈGLE : ne réclamer au fournisseur que le **minimum** (identité + e-mail vérifié) ; ne pas demander des périmètres (scopes) larges « au cas où ». Un écran de consentement OAuth qui réclame trop est un motif d'abandon et de défiance.

RÈGLE : gérer explicitement l'**échec ou l'annulation** côté fournisseur (la personne ferme la fenêtre, refuse le partage) — retour à l'écran de méthode avec un message neutre (VOICE), jamais une impasse ni une accusation.

RÈGLE : un e-mail rendu **déjà vérifié** par un fournisseur de confiance ne relance pas le parcours de vérification (WCAG 3.3.7 — ne pas redemander).

CONFIANCE : convergence (pratiques des grands fournisseurs) ; la mécanique de linking et le choix des fournisseurs restent des décisions produit.
