---
component: form
layer: ui
type: pattern
version: 1.3.0 # 1.3.0 : crans d'apparition orchestrés nommés dans languages/motion/ (MOTION-UI) — résumé d'erreurs réactif, dépliage conditionnel, reduced-motion hérité (2026-07-21). 1.2.1 : renvoi de motion aligné sur sa nature de langage ; aucune règle ni valeur modifiée. 1.2.0 : note d'orchestration ajoutée — le cycle de soumission (FORM-UX 2.0.0) ne crée AUCUN token propre : chaque état est rendu par les tokens des composants coordonnés (BUTTON-UI loading, ALERT-UI tones, INPUT-UI error, motion.*). 1.1.1 : narration migrée vers DECISIONS.md.
last_updated: 2026-07-21
companion: FORM-UX.md
tokens:
  spacing:
    field_gap: spacing.md
    fieldset_gap: spacing.xl
    label_to_field: spacing.xs
  # Pas de tokens error_summary ici : le résumé d'erreurs est rendu comme un alert tone=danger,
  # ses tokens (fond, bordure, texte, radius, padding) vivent dans ALERT-UI.md (cf. DECISIONS.md).
confidence: mixed
---

# Formulaire — Couche UI (pattern de composition)

> Tokens de composition — espacement entre champs, style du résumé d'erreurs. Le raisonnement vit dans FORM-UX.md. Typographie : le pattern n'a pas de texte propre — labels et messages héritent d'INPUT-UI.md, le résumé d'erreurs de ALERT-UI.md, tous deux reliés à la fondation (foundations/typography/).

## Espacement
- Entre deux champs indépendants : `field_gap`
- Entre deux groupes de champs logiques (ex: bloc adresse vs bloc contact) : `fieldset_gap`, sensiblement plus large que `field_gap` pour marquer la séparation
- Entre un label et son champ : `label_to_field`, le plus resserré des trois — le lien visuel doit rester évident

## Résumé d'erreurs — style
Le résumé d'erreurs est un **alert `tone: danger`** — son style (fond, bordure, texte, radius, padding) vit dans `ALERT-UI.md`, qui fait autorité. Reste propre au formulaire : le corps du résumé est une liste de liens d'ancre (cf. FORM-UX.md) — les liens héritent du token de texte du tone (`color.danger`), soulignés pour rester identifiables comme liens dans un bloc déjà coloré. (Historique du déplacement : cf. DECISIONS.md.)

## Cycle de soumission — aucun token propre
Les états du cycle (FORM-UX.md, machine à états) ne créent aucun token de pattern — chaque moment est rendu par les tokens du composant qui le porte :
- `submitting` → bouton loading/disabled (**BUTTON-UI.md**), transitions `motion.fast`/`motion.ease-out` (**languages/motion/**) ;
- `invalid` / erreurs → bordures et textes error des champs (**INPUT-UI.md**), résumé en alert danger (**ALERT-UI.md**) ;
- `success` / `partial_success` / `server_error` → alerts success/warning/danger (**ALERT-UI.md**) ;
- statut d'autosave et annonces de traitement long → texte fonctionnel courant (`color.text-secondary`, seuil 4.5:1), pas un composant.

Un état du cycle qui semblerait exiger un token propre est un signal que la règle est au mauvais niveau — la déplacer vers le composant concerné (principe de dédoublonnage, cf. METHODE.md § 10).

## Apparitions orchestrées — crans de motion
Le formulaire ne crée aucune valeur de motion propre ; il **consomme** les crans de `languages/motion/` (`MOTION-UI.md`) pour les apparitions qu'il orchestre (le raisonnement — réactif jamais préventif, continuité, verrou métier ≠ animation — vit dans FORM-UX.md § Orchestration des quatre Languages / Motion et dans MOTION-UX.md) :
- **apparition du résumé d'erreurs** (réactif, après échec de soumission) → `motion.base` / `motion.ease-out`, en **opacité seule** — jamais un slide qui pousse le contenu sous le point de lecture (miroir exact de l'« Apparition de l'alert réactif », `MOTION-UI.md`) ;
- **dépliage d'un champ / groupe conditionnel** → `motion.base` / `motion.ease-in-out`, technique `grid-template-rows` (`0fr → 1fr`) ou mesure + transform, **jamais `height: auto` interpolé à l'aveugle** — le contenu se déplace parce que l'utilisateur l'a demandé (exception légitime au non-déplacement, `MOTION-UI.md`) ;
- **sortie** (résumé qui se résout, champ qui se replie) → cran inférieur de l'entrée (`motion.fast` / `motion.ease-in`) ;
- **`prefers-reduced-motion`** → hérité du **bloc média global** de `MOTION-UI.md` : crossfade ou bascule instantanée, aucun glissement ; l'information demeure. Le formulaire ne redéclare jamais ce contrat localement — il en hérite via input et alert.

## Sources et niveau de confiance (couche UI)
| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| T1 | Résumé d'erreurs stylé comme une alerte distincte | Convention WCAG/design systems, pas une valeur chiffrée | Établi comme pattern, valeurs précises à la discrétion du produit |
| T2 | Texte du résumé au seuil 4.5:1 (texte courant, pas texte large) | WCAG 2.1 — 1.4.3 | Établi, standard d'accessibilité |
| T3 | Aucun token d'état propre au pattern | Cohérence interne (note de transposition FORM-UX.md : pas d'axes, pas d'états visuels propres) | Décision interne, testée par la boucle de dédoublonnage |
| T4 | Apparitions (résumé d'erreurs réactif, dépliage conditionnel) : crans base/ease-out et base/ease-in-out, opacité, sortie au cran inférieur, reduced-motion hérité | `MOTION-UI.md` (apparition de l'alert réactif, dépliage, bloc reduced-motion global) | Établi — consommation de tokens motion, aucune valeur propre au pattern |
