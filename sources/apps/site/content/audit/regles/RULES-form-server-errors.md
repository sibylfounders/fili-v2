---
sujet: form-server-errors
type: extension
extension-de: form
resume: "Approfondissement des erreurs serveur : mapping erreur de champ vs erreur globale, contradiction client/serveur, reprise et idempotence"
requires: ["form"]
selon-contexte: []
---
# RULES — Form / Erreurs serveur (extension, compilée)

> Généré depuis `patterns/form/FORM-UX.md` § "Erreurs serveur et reprise". Le cas nominal (server_error, timeout, retry) est déjà dans RULES-form (socle) — cette extension charge l'approfondissement : mapping fin, contradictions, idempotence. Charger avec RULES-form quand le build doit gérer des retours serveur détaillés (API avec erreurs de champ nommées, paiement, intégrations tierces). Ne pas éditer à la main.

- Deux natures d'erreur serveur, deux traitements :
  - **erreur de champ renvoyée par le serveur** (email déjà pris, stock épuisé) → mappée comme une erreur de validation : inline sur le champ + entrée au résumé + focus selon les règles d'échec.
  - **erreur globale** (5xx, service indisponible) → alert danger en tête, quoi/pourquoi/comment sortir, porte l'action de reprise — jamais déguisée en erreur de champ.
- Le retry réutilise les valeurs telles quelles — un bouton Réessayer qui vide le formulaire est une insulte.
- Si la reprise peut créer un doublon (envoi peut-être passé côté serveur), le produit doit le dire ou garantir l'idempotence.
- Erreurs contradictoires client/serveur : **le serveur fait foi**. Une erreur serveur sur un champ jugé valide côté client remplace le verdict client — jamais d'empilement.
- Le texte exact d'une erreur serveur est une décision produit/serveur, hors design system ; le gabarit (ALERT-UX) et la chorégraphie (form) sont normés.

CONFIANCE : cas nominal établi (WCAG 3.3.1 pour l'affichage) ; mapping fin et idempotence = raisonnement de mécanisme, non documentés par les systèmes benchmarkés.
