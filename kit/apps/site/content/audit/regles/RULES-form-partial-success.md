---
sujet: form-partial-success
type: extension
extension-de: form
resume: "Succès partiel : ce qui a réussi vs ce qui reste, alert warning, parties réussies figées, reliquat conservé"
requires: ["form"]
selon-contexte: []
---
# RULES — Form / Succès partiel (extension, compilée)

> Généré depuis `patterns/form/FORM-UX.md` § "Succès partiel". Le socle RULES-form couvre déjà `submitting → partial_success` dans la machine à états ; cette extension détaille le traitement du contenu et des données. Charger avec RULES-form quand le build peut réussir partiellement (import en lot, commande à plusieurs lignes). Ne pas éditer à la main.

- Quand une partie seulement de la demande aboutit (import de 80 lignes sur 100, commande validée mais un article refusé), ni un success ni un danger ne dit la vérité — c'est un **alert warning** qui liste ce qui a réussi et ce qui reste à faire, avec le focus dessus.
- Les parties réussies ne sont pas re-soumises au retry (figées ou retirées du formulaire) ; les parties échouées gardent leurs valeurs et redeviennent le périmètre de la soumission suivante.

CONFIANCE : non formalisé — cas absent des systèmes benchmarkés ; raisonnement de mécanisme (un success qui ment retire toute valeur au signal success).
