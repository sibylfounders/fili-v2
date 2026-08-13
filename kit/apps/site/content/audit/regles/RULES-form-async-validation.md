---
sujet: form-async-validation
type: extension
extension-de: form
resume: "Validation asynchrone d'un champ pendant la saisie : état d'attente, soumission pendant l'attente, verdict périmé"
requires: ["form", "input"]
selon-contexte: []
---
# RULES — Form / Validation asynchrone (extension, compilée)

> Généré depuis `patterns/form/FORM-UX.md` § "Validation asynchrone (au niveau du formulaire)". Charger avec RULES-form quand le build vérifie une valeur via un aller-retour serveur pendant la saisie (disponibilité d'identifiant, code promo). Mécanique du champ (spinner, aria-live du résultat) → RULES-input. Ne pas éditer à la main.

- Un champ en validation asynchrone a un **état d'attente** visible et annoncé (mécanique : RULES-input).
- La validation en cours ne bloque jamais le submit silencieusement : le formulaire attend le verdict et le dit ("Vérification en cours…"), ou re-valide au submit.
- **Verdict périmé** : si la valeur change pendant l'aller-retour, le verdict qui revient est jeté, jamais appliqué à la nouvelle valeur.
- Le verdict asynchrone reste un verdict client au sens du cycle : la soumission re-vérifie côté serveur — le serveur fait toujours foi.
- Réservé aux champs dont la validité ne peut pas se calculer localement — pas un moyen de "valider en direct" ce qu'une regex ferait sans réseau.
- CONFIANCE : convergence pour l'état d'attente et l'annonce (tutoriel W3C/WAI, aria-live pendant la frappe) ; verdict périmé = non formalisé, raisonnement de mécanisme.
