---
sujet: form-multi-step
type: extension
extension-de: form
resume: "Formulaire en plusieurs étapes : validation par étape, retour sans perte, ask-once, récapitulation avant soumission finale, progression"
requires: ["form"]
selon-contexte: []
---
# RULES — Form / Multi-étapes (extension, compilée)

> Généré depuis `patterns/form/FORM-UX.md` § "Formulaire en plusieurs étapes". Charger avec RULES-form quand le build décrit des étapes/wizard/checkout en plusieurs pas. Ne pas éditer à la main.

- Découper par longueur/charge cognitive réelle, pas par esthétique — le point extrême est GOV.UK ("one thing per page") ; la plupart des produits utilisent des étapes thématiques.
- Chaque étape valide **ses propres champs** à son "Continuer" — pas de découverte d'erreur d'étape 1 à l'étape 4. La validation croisée inter-étapes se joue à la dernière étape.
- Retour arrière : ne perd jamais les données déjà saisies, ni de l'étape quittée ni des précédentes. Lien/bouton retour toujours présent.
- Ne jamais redemander une information déjà fournie dans le parcours — la pré-remplir ou la rappeler (WCAG 2.2 — 3.3.7 Redundant Entry, niveau A ; GOV.UK "ask once").
- Étape de **récapitulation** ("Vérifiez vos réponses") obligatoire avant soumission finale dès que l'engagement est juridique ou financier — mécanisme qui satisfait WCAG 3.3.4 (AA). Chaque ligne a un lien "Modifier" qui ramène à l'étape concernée sans perdre le reste.
- Indicateur de progression : utile si le nombre d'étapes n'est pas évident ; tester sans, ajouter si la recherche le montre nécessaire (GOV.UK). Jamais cliquable vers l'avant.
- Label du bouton de la dernière étape = la conclusion réelle ("Confirmer ma commande"), jamais "Suivant" (règle BUTTON-UX, appliquée à la séquence).
- CONFIANCE : établi pour retour-sans-perte/ask-once/check-answers (GOV.UK, WCAG 3.3.7) ; convergence pour la progression ; le seuil de découpage reste une décision produit.
