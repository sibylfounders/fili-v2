---
sujet: form-sensitive-data
type: extension
extension-de: form
resume: "Paiement, données médicales/sensibles, consentement : friction calibrée sur le coût réel, récapitulation WCAG 3.3.4, accessible authentication 3.3.8"
requires: ["form", "input", "button", "form-multi-step"]
selon-contexte: []
---
# RULES — Form / Données sensibles (extension, compilée)

> Généré depuis `patterns/form/FORM-UX.md` § "Risque et contexte". Charger avec RULES-form quand le build touche paiement, authentification, données médicales/sensibles ou consentement. Champs concernés (mot de passe, carte bancaire) → RULES-input fait autorité sur le champ lui-même. Ne pas éditer à la main.

| Contexte | Coût d'erreur | Friction adaptée |
|---|---|---|
| Authentification | Moyen + accessibilité critique | Pas de test cognitif — WCAG 2.2, 3.3.8 (AA) : pas de puzzle, copier-coller autorisé. Champ mot de passe → RULES-input. |
| Paiement, engagement juridique | Élevé, difficilement réversible | Récapitulation vérifiable + confirmation explicite — WCAG 3.3.4 (AA) : réversible, vérifié ou confirmé. Champs carte → RULES-input (iframe PCI). |
| Données sensibles / médicales | Élevé (confidentialité) | Ne collecter que le nécessaire ; pas de validation-espion (pas d'aller-retour serveur sur une donnée sensible avant soumission explicite) ; consentement distinct. |
| Consentement | Élevé (légal) | Cases jamais pré-cochées, une case par finalité, poids visuel égal des options (RULES-button, bannières). |

- WCAG 3.3.4 (AA) n'est pas un conseil de style — pour les engagements juridiques/financiers ou la modification de données contrôlées par l'utilisateur, la soumission doit être réversible, vérifiée ou confirmée. La récapitulation multi-étapes (RULES-form-multi-step) est le mécanisme standard.
- CONFIANCE : établi (WCAG 2.2 — 3.3.4, 3.3.8, niveau AA).
