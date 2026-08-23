---
sujet: form
type: pattern
resume: "Orchestration d'un formulaire entier : structure, convention requis, stratégie de validation, résumé d'erreurs, focus, cycle de soumission complet (idle→succès/erreur serveur/timeout/succès partiel), coordination bouton/champs"
requires: ["input", "button", "alert"]
selon-contexte: ["form-multi-step", "form-async-validation", "form-conditional-fields", "form-autosave", "form-server-errors", "form-sensitive-data", "form-partial-success", "interaction (rôles Button/Link/Input/Alert = six intentions)", "motion (apparitions réactives, dépliage)", "voice (cycle → ton)", "emotion (succès : un événement un porteur ; délégué)"]
---
# RULES — Form (compilé, condensé)

> Généré depuis `patterns/form/FORM-UX.md` (v2.1.0) et `FORM-UI.md` (v1.2.0). Règles condensées pour le build — la source fait autorité en cas de doute. Ne pas éditer à la main. Tokens : `dist/tokens.yaml`. Sept extensions conditionnelles existent (colonne ci-dessus) — charger uniquement celle(s) que le contexte du build exige réellement, cf. protocole du routeur.

## Nature
- Pattern de composition, pas un composant : aucun axe visuel propre — un formulaire est une séquence et une coordination de champs + bouton, jamais une variante d'état visuelle.

## Frontières d'autorité
- **input** : label, helper text, valeur, état local, erreur locale, ARIA du champ, mécanique de validation d'un champ isolé.
- **button** : affordance, label d'action, loading, anti double-activation, feedback local.
- **alert** : conteneur du message global (structure, tone, icône, persistance, fermeture, tokens), `role="alert"` vs `role="status"`.
- **form** : convention requis/optionnel, ordre/groupement, **stratégie** de timing de validation (reçue d'input), validation croisée, apparition du résumé, coordination inline/global, focus, cycle de soumission, conservation des données.
- Contenu métier d'une erreur serveur (le texte exact) : produit/serveur, hors design system.

## Structure et groupement
- Champs liés par le sens → `fieldset` + `legend` qui nomme le groupe (WCAG 1.3.1) ; groupement visuel (`fieldset_gap`) et sémantique toujours ensemble.
- Ordre des champs = ordre du focus clavier = logique utilisateur ; jamais de `tabindex` positif.
- Un seul bouton de soumission (BUTTON-UX fait autorité sur la cardinalité).
- Formulaire "long" = dès que l'utilisateur doit scroller pour voir toutes les erreurs possibles (pas de seuil chiffré).
- Modale : réservée aux saisies courtes ; conteneur régi par BUTTON-UX (pas d'activation réflexe du destructif) et ALERT-UX (jamais de pleine page en modale).
- Édition inline (table) : c'est un champ, INPUT-UX fait autorité — le pattern commence à plusieurs champs soumis ensemble.

## Convention "champ requis"
- Décision prise une fois **pour tout le formulaire**, jamais champ par champ — critère : **marquer la minorité**.
  - Majorité obligatoire → marquer les seuls optionnels ("(optionnel)").
  - Majorité optionnelle → marquer les seuls obligatoires.
  - Tout obligatoire → annonce unique en tête, rien champ par champ.
  - Mixte sans majorité nette → marquer les obligatoires (convention la plus comprise).
- CONFIANCE : convergence — GOV.UK (jamais d'astérisque, marque l'optionnel) ↔ Carbon (règle de majorité) ↔ Material (astérisque systématique) divergent réellement ; la règle de proportion est une décision interne calibrée sur ce principe.
- Convention annoncée explicitement en tête ("Les champs marqués * sont obligatoires" / "Tous les champs sont obligatoires"), jamais l'astérisque isolé.
- Indicateur visuel + `required`/`aria-required="true"` combinés sur tout champ obligatoire. Vaut pour tout le produit, jamais variable d'un formulaire à l'autre.

## Stratégie de validation (reçue d'INPUT-UX)
- Décision du formulaire assemblé, pas du champ isolé : **submit-only** (défaut formulaires courts/simples) ou **blur sur champs à risque de format** (défaut formulaires longs/contraints). Mécanique par champ → RULES-input.
- CONFIANCE : divergence documentée — GOV.UK (submit-only, blur déconseillé) ↔ Carbon (blur). Décision interne par formulaire, calibrée sur le risque réel d'erreur.
- Jamais de validation avant la fin de la première saisie du champ. Contraintes connues expliquées **avant** la saisie (WCAG 3.3.2).
- **Validation croisée** (dates début/fin, champs mutuellement exclusifs) : l'erreur appartient au groupe, message qui nomme la relation, ancrée sur le premier champ du groupe ; jouée au submit (ou au blur du dernier champ du groupe).

## Résumé d'erreurs
- Apparaît **après un échec de soumission**, en tête de formulaire — jamais préventivement.
- Conteneur = **alert danger permanent** (non fermable tant que des erreurs subsistent), injecté dynamiquement → `role="alert"`. Structure et tokens → RULES-alert.
- Corps = liste de **liens d'ancre** ; chaque lien reprend le message d'erreur exact ("L'adresse email est requise", pas "Email"). Erreur croisée → lien vers le premier champ du groupe.
- Ne remplace pas les messages inline : les deux coexistent.
- Titre de page préfixé "Erreur : …" en cas d'échec.
- CONFIANCE : établi (WCAG 3.3.1, G83/G85/G139 ; GOV.UK ; titre de page : convergence GOV.UK + WAI).

## Focus après échec de soumission
- Formulaire court : focus sur le premier champ en erreur. Long ou erreurs multiples : focus sur le résumé.
- Conservation du contexte après correction : le champ garde erreur + valeur quand l'utilisateur revient du résumé.
- En SPA (React/Vue/Angular) : le déplacement de focus et l'annonce ne viennent jamais gratuitement — à gérer explicitement à chaque mise à jour d'état.
- CONFIANCE : établi (Deque, WebAIM, W3C, GOV.UK).

## Coordination bouton/champs
- **Bouton de soumission actif en permanence** : validation au clic, affichage des erreurs (inline + résumé), déplacement du focus. Jamais de bouton désactivé comme mécanisme de validation préalable.
- Désactivation justifiée uniquement pendant le traitement asynchrone de la soumission (anti double-soumission → RULES-button).
- CONFIANCE : non formalisé (émergent) — Carbon documente encore l'inverse sur formulaire court.
- **Frontière (pivot 2026-07-21)** : le noyau universel — jamais de désactivation silencieuse, jamais l'état du bouton comme seul canal d'erreur — fonde seul une non-conformité chez un hôte tiers ; « bouton actif en permanence » est un parti pris d'identité paramétrable → en audit : *divergence de position documentée*, pas un défaut.

## Cycle de soumission (machine à états — cas nominal)
```text
idle → validating → invalid → correcting → validating → submitting → success
submitting → server_error → retrying → submitting
submitting → timeout → retrying → submitting
submitting → partial_success
```
- **idle → validating** : activation du submit ; rien de visible ; valeurs conservées.
- **validating → invalid** : ≥1 erreur client → résumé + inline + titre "Erreur :" ; `role="alert"` ; focus résumé/premier champ ; bouton actif ; **valeurs toutes conservées**.
- **invalid → correcting** : l'inline disparaît à la revalidation du champ ; le résumé reste jusqu'à resoumission.
- **correcting → validating** (resoumission) : erreurs **recalculées de zéro** — aucune obsolète ne survit.
- **validating → submitting** : 0 erreur → bouton loading+désactivé (seule désactivation légitime) ; traitement > ~5s → `aria-live="polite"` ; valeurs conservées, champs figés.
- **submitting → success** : redirection (page de confirmation, focus au titre) OU alert success in-page ; valeurs vidées (tâche conclue) ou conservées (paramètres).
- **submitting → server_error** : alert danger (quoi/pourquoi/comment sortir) — pas un résumé de champs ; `role="alert"` ; focus l'alert ; bouton réactivé ; **valeurs toutes conservées** ; retry → retrying. Erreurs de champ renvoyées par le serveur → invalid, mappées comme une validation (le serveur fait toujours foi sur le client — jamais d'empilement en cas de contradiction). Détail approfondi → RULES-form-server-errors.
- **submitting → timeout** : alert danger + Réessayer ; valeurs conservées ; retry → retrying.
- **retrying → submitting** : valeurs réutilisées telles quelles, aucune ressaisie ; idempotence côté produit nécessaire pour un envoi à effet unique.
- **submitting → partial_success** : alert warning (ce qui a réussi / ce qui reste) ; focus l'alert ; parties réussies figées, reliquat conservé → correcting. Détail approfondi → RULES-form-partial-success.
- Annulation d'une soumission en cours : seulement si réellement possible, retour à l'état antérieur intact. Session expirée/perte de connexion : dire ce qui est préservé, jamais échouer en silence.
- CONFIANCE : squelette établi (WCAG 3.3.1, GOV.UK, WAI) ; partial_success et annulation non formalisés (raisonnement de mécanisme).

## Limites de temps imposées à l'utilisateur
- Toute limite imposée (expiration de session, jeton, compte à rebours) est **contrôlable** (prolonger/désactiver/exempter), sauf limite essentielle (WCAG 2.2.1).
- **Avertir avant** l'expiration (alert → RULES-alert ; `role="alert"` si réactif), avec le temps de réagir.
- À l'expiration, **conserver les données** — reprise sans formulaire vide. Distinct du `timeout` serveur du cycle (versant réseau).

## Risque et contexte — friction proportionnelle au coût de l'erreur
| Contexte | Coût d'erreur | Friction |
|---|---|---|
| Recherche | Nul | Aucune — submit implicite |
| Contact, création rapide | Faible | Submit-only, undo plutôt que confirmation |
| Inscription | Moyen | Blur sur champs de format |
| Paramètres | Moyen | Soumission explicite OU autosave, jamais ambigu |
| Authentification | Moyen + a11y critique | Pas de test cognitif (WCAG 3.3.8 AA) — détail → RULES-form-sensitive-data |
| Paiement, juridique | Élevé | Récapitulation vérifiable + confirmation (WCAG 3.3.4 AA) — détail → RULES-form-sensitive-data |
| Données sensibles/médicales | Élevé | Minimisation, pas de validation-espion — détail → RULES-form-sensitive-data |
| Consentement | Élevé (légal) | Cases jamais pré-cochées, poids visuel égal |
| Suppression | Critique | Paliers de friction de BUTTON-UX, orchestrés ici |
- CONFIANCE : établi pour 3.3.4/3.3.7/3.3.8 (critères WCAG AA) ; table de calibrage = décision interne.

## Risque
| Cas | Risque | Sévérité |
|---|---|---|
| Focus non géré après échec (SPA) | Lecteur d'écran perdu, aucune annonce | Critique |
| Valeurs perdues après une erreur | Double saisie punitive, abandon | Critique |
| Limite de temps sans avertissement ni prolongation | Perte de saisie/tâche à l'expiration (2.2.1) | Élevée |
| Bouton désactivé comme validation | Confusion, abandon, exclusion | Élevée |
| Erreur serveur muette ou déguisée en erreur de champ | Correction impossible | Élevée |
| Pas de résumé d'erreurs sur formulaire long | Correction fastidieuse, abandon | Moyenne |
| Soumission longue sans annonce | Pas de feedback AT, double soumission tentée | Moyenne |
| Convention "requis" incohérente entre formulaires | Confusion cumulative | Faible-moyenne |
| Erreur obsolète qui survit à la correction | Défiance, formulaire perçu "cassé" | Moyenne |

## Règle transversale
- **La friction doit informer, jamais bloquer silencieusement.**

## Application des Languages
- **Interaction** : le formulaire n'invente aucun rôle, il **assemble** les six intentions d'`INTERACTION-UX` (submit = agir, « Modifier » = naviguer, ajout = agir secondaire, champs = saisir, résumé/message = comprendre un état) ; l'assemblage passe le **Test de reconnaissance** (deux rôles jamais rendus indiscernables).
- **Motion** : les apparitions orchestrées suivent `MOTION-UX` — **réactives, jamais préventives** (résumé en opacité après un échec, jamais au chargement) ; le dépliage d'un champ conditionnel = **continuité** (déclenché par l'utilisateur) ; reduced-motion en crossfade/bascule ; le gel des champs pendant `submitting` est un **verrou métier** (anti double-soumission), pas un verrou d'animation.
- **Voice** : chaque état du cycle se rattache à la table « Le ton suit l'utilisateur » de `VOICE-UX` — idle = routine, invalid = erreur utilisateur (ne jamais blâmer), submitting = attente, success = factuel (réchauffé d'un cran ssi le moment E-motion est catalogué), server_error = panne assumée, partial_success = warning honnête.
- **E-motion** : `success` tombe sur le moment #1 du catalogue d'`EMOTION-UX`, mais le formulaire **route, ne duplique pas** — **un événement, un porteur** : la réussite s'incarne une seule fois selon « la confirmation doit-elle rester consultable ? » (alert productif consultable / toast illustré injecté / SubmitButton résolu en place) ; budget de rareté (contextes à seuil seulement) ; contrat de repli (le succès vit dans l'ARIA/le statique — on perd la fête, jamais le fait).

---

## Règles techniques (UI)

```yaml
spacing:
  field_gap: spacing.md        # entre deux champs indépendants
  fieldset_gap: spacing.xl     # entre groupes logiques — sensiblement plus large
  label_to_field: spacing.xs   # le plus resserré — le lien label/champ doit rester évident
```

- Pas de tokens error_summary propres : le résumé est rendu comme un alert `tone: danger` (tokens → RULES-alert).
- Aucun token d'état propre au cycle de soumission : chaque moment consomme les tokens du composant qui le porte (bouton loading → RULES-button ; alerts → RULES-alert ; erreurs de champ → RULES-input ; transitions → motion.fast/ease-out).
- Les liens d'ancre du résumé héritent du texte du tone (`color.danger`) et sont **soulignés**.
- Texte du résumé au seuil 4.5:1 (texte courant).
- Typographie : aucun texte propre — labels/messages héritent d'INPUT-UI, le résumé de ALERT-UI.
