---
sujet: form-conditional-fields
type: extension
extension-de: form
resume: "Champs conditionnels et groupes répétables : apparition sans vol de focus, sort des valeurs masquées, focus après ajout/suppression"
requires: ["form"]
selon-contexte: []
---
# RULES — Form / Champs conditionnels et groupes répétables (extension, compilée)

> Généré depuis `patterns/form/FORM-UX.md` § "Champs conditionnels et groupes répétables". Charger avec RULES-form quand le build décrit des champs qui apparaissent selon une réponse, ou des groupes "ajouter une ligne". Ne pas éditer à la main.

## Champs conditionnels
- Un champ/groupe déclenché par une réponse apparaît **immédiatement après le champ déclencheur** dans l'ordre de lecture et de focus.
- L'apparition ne vole pas le focus, pas de saut de lecture (même règle d'insertion que l'alert) ; annoncée si risque de la manquer (`aria-expanded` sur le déclencheur, ou `aria-live="polite"` si la révélation est distante).
- Une valeur saisie puis masquée n'est **pas soumise** mais reste mémorisée tant que la page vit — l'utilisateur qui rebascule retrouve sa saisie.
- Une erreur portée par un champ désormais masqué disparaît du résumé — on ne demande pas de corriger l'invisible.

## Groupes répétables
- Action d'ajout = bouton secondaire ou ghost, jamais le primary du formulaire.
- Après ajout : focus au premier champ du nouveau groupe. Après suppression : focus au bouton d'ajout ou au groupe suivant — jamais perdu en tête de page.
- Chaque groupe est un fieldset numéroté dans sa legend ("Bénéficiaire 2") pour que les erreurs du résumé restent adressables.

CONFIANCE : non formalisé — patterns observés (GOV.UK "add another" est communautaire, pas normatif) ; sort des valeurs masquées = raisonnement de mécanisme.
