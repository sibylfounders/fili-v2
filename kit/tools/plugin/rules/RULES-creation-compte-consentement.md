---
sujet: "creation-compte-consentement"
type: "extension"
extension-de: "creation-compte"
resume: "Inscription : distinguer contrat, information de confidentialité et consentement facultatif ; aucun consentement pré-coché ou groupé, une finalité par choix."
requires: ["creation-compte"]
selon-contexte: []
source-version: "1.4.0"
source-sha256: "3b81433c41d652dfb0688dc14cdf23762dbd4dbff6df3a58377af60e10e778d1"
source-file: "content/md/flows/CREATION-COMPTE-UX.md"
---
# RULES — Création de compte / Consentement à l'inscription (extension compilée)

> Extrait mécaniquement de `content/md/flows/CREATION-COMPTE-UX.md` (v1.3.2, SHA-256 `7aa1fb9eb9dc9f84951bc7fc5f33611c664a92be1d96134d90399161fa2db54b`). Charger avec `creation-compte` seulement si le contexte l'exige. Ne pas éditer.

RÈGLE : distinguer trois actes qui n'ont pas la même base : **accepter les CGU** peut matérialiser le contrat ; **prendre connaissance de la politique de confidentialité** est une information, pas un consentement global au traitement ; **consentir** ne concerne que les finalités réellement facultatives (marketing, traitements optionnels). L'accès au produit ne dépend jamais d'un consentement marketing — sinon il n'est pas libre (RGPD art. 7).

RÈGLE : **aucune case pré-cochée** pour un consentement (RGPD, EDPB — le consentement suppose un acte positif clair) ; **une finalité = une case** (dégroupage), jamais un « j'accepte tout » qui mélange CGU, cookies et marketing.

RÈGLE : appliquer la convention de marquage du formulaire à l'envers de l'habitude — ici l'**optionnel** (marketing) est explicitement présenté comme tel, et rien dans la mise en forme ne pousse à cocher (poids visuel égal, pas de case marketing plus grosse ou colorée que le reste — pas de dark pattern, cf. `content/md/principles/LAWS-UX.md`).

RÈGLE : donner accès aux CGU et à l'information de confidentialité **avant** le point de décision — pas seulement en pied de page. Le mécanisme de la case et du lien appartient à FORM/INPUT ; la base légale et le texte appartiennent au produit/juridique.

RÈGLE : **la politique de confidentialité se présente, elle ne s'accepte pas** (RGPD art. 13 — une information due, pas un contrat). ❌ « En créant un compte, vous acceptez nos CGU **et notre politique de confidentialité** » — un même geste ne peut pas porter à la fois un accord contractuel et une prise de connaissance. ❌ « J'accepte la politique de confidentialité » (case dédiée ou groupée). ✅ « En créant un compte, vous acceptez nos CGU. Consultez notre politique de confidentialité. » La fusion se signale **même sans case à cocher**, dès qu'un « vous acceptez » englobe la politique de confidentialité.

RÈGLE : si le service impose un âge minimum, le vérifier **sobrement** (une déclaration, pas un interrogatoire) et sans stocker plus que nécessaire — la minimisation des données s'applique aussi à la vérification d'âge.

CONFIANCE : établi pour le cadre RGPD (art. 4(11), art. 7 ; lignes directrices EDPB) ; l'implémentation exacte (quelles finalités, quel texte) est une décision produit et juridique, hors design system.
