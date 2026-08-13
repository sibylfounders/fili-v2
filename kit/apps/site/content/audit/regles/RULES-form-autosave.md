---
sujet: form-autosave
type: extension
extension-de: form
resume: "Brouillon et autosave : statut annoncé, échec = avertissement, jamais pendant submitting, restauration"
requires: ["form"]
selon-contexte: []
---
# RULES — Form / Brouillon et autosave (extension, compilée)

> Généré depuis `patterns/form/FORM-UX.md` § "Brouillon et autosave". Charger avec RULES-form quand le build décrit une persistance automatique ou un brouillon explicite (édition longue, session fragile). Ne pas éditer à la main.

- L'autosave se justifie par un coût de perte élevé (saisie longue, session fragile) — pas par défaut sur un formulaire de trois champs.
- Le brouillon explicite ("Enregistrer comme brouillon") est l'alternative quand l'utilisateur doit garder le contrôle de ce qui est persisté (contenus sensibles).
- Statut visible et sobre : "Enregistré à 14 h 32" / "Enregistrement…" en `role="status"` (annonce polie).
- Un échec d'autosave est un vrai avertissement (alert warning) : l'utilisateur croit être protégé, il ne l'est plus.
- L'autosave ne remplace pas la soumission — il persiste un état inachevé sans le valider ni le soumettre ; jamais d'autosave pendant `submitting`.
- À la reprise, dire ce qui a été restauré ("Brouillon du 3 juillet restauré") plutôt que de présenter silencieusement des champs pré-remplis d'origine incertaine.

CONFIANCE : non formalisé — aucun système benchmarké ne norme l'autosave ; raisonnement de mécanisme + convergence des implémentations observées (éditeurs de contenu).
