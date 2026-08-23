---
component: input
layer: ui
version: 1.7.0 # 1.7.0 : focus v2 + retrait du token `color.accent` (DESIGN 1.34.0, arbitrage 2026-07-29) — `focus_ring` pointe les rôles `control.focus-*` (cran subtil accordé au statut : error → control.focus-danger, etc.) ; aucune autre règle modifiée. 1.6.0 : rattachement nommé Motion/Voice, contrat reduced-motion de la bordure d'état, absence E-motion raisonnée (2026-07-21). 1.5.0 : adoption d'INTERACTION-UI et ADAPTIVE-UI — zone réceptive sans élévation, adaptation locale sans masquer label/aide requise/erreur. 1.4.2 : vocabulaire aligné sur le modèle style × tone du bouton.
last_updated: 2026-07-29
companion: INPUT-UX.md
tokens:
  sizing:
    # Valeurs indicatives, non contraignantes — mêmes réserves que BUTTON-UI.md sur l'absence de grille définie.
    sm: { height: scale.compact, padding_x: spacing.sm, radius: radius.sm }
    md: { height: scale.base, padding_x: spacing.md, radius: radius.md }
    lg: { height: scale.expanded, padding_x: spacing.lg, radius: radius.md }
  axes:
    tone: [neutral, error, success, warning]
    size: [sm, md, lg]
    field_type: [text, email, password, number, search, textarea]
  typography: # ajouté en 1.3.2 — relié à la fondation (foundations/typography/)
    value_font: typography.body # texte SAISI et label — jamais sous l'équivalent 16 px (iOS Safari zoome au focus, cf. TYPOGRAPHY-UX.md)
    message_font: typography.body-small # helper, message d'erreur, compteur : texte fonctionnel ~14 px, sous le corps ; ce n'est pas un champ, la règle des 16 px de l'input ne s'y applique pas (pilote externe 2026-07-16)
    fallback: typography.fallback.sans
  colors:
    value_text: color.text-primary # couleur du texte saisi — explicite plutôt que déduite
    tone.neutral_border: color.border-strong # bordure délimitante : seule délimitation du champ, 3:1 obligatoire (WCAG 1.4.11), cf. section "Bordure au repos"
    tone.error_border: color.danger
    tone.error_text: color.danger
    tone.success_border: color.success
    tone.warning_border: color.warning
    focus_ring: control.focus-color # focus v2 (2026-07-29) — cran subtil accordé au statut de la bordure (error → control.focus-danger…)
  icon: # ajouté en 1.4.0 — relié à la fondation (foundations/iconography/)
    size: icon.md # clear, prefix/suffix, œil password — couleur héritée de content_elements (text-secondary)
  motion: # ajouté en 1.4.0 — relié au langage (languages/motion/)
    state_border: { duration: motion.fast, easing: motion.ease-out } # repos → error/success/warning ; le MESSAGE d'erreur, lui, apparaît sans délai
    autofill_hack: hors vocabulaire motion — hack de neutralisation documenté (cf. section Autofill + MOTION-UI.md)
  focus_ring_style: # ajouté en 1.4.0 — cf. BORDER-UI.md
    width: border.focus-width
    offset: border.focus-offset
  content_elements:
    helper_text: color.text-secondary
    character_counter: color.text-secondary # texte fonctionnel courant (4.5:1) — aligné sur helper_text
    prefix_suffix: color.text-secondary
    clear_button_icon: color.text-secondary
    required_indicator: color.danger
  states: [default, focus, filled, error, disabled, readonly]
confidence: mixed
---

# Input — Couche UI

> Tokens et valeurs techniques. Le raisonnement (quand valider, quel wording, quels risques) vit dans INPUT-UX.md.

## Différence structurelle avec BUTTON-UI.md
Pas d'axe `style` ici — voir la note de transposition dans INPUT-UX.md. Le 3e axe de l'input est `field_type`, pas une hiérarchie visuelle.

## Tailles — valeurs techniques
Mêmes réserves que pour le bouton : pas de px absolu fixé, relation relative sm < md < lg à mapper sur la grille du produit.

## Bordure au repos
La bordure neutral utilise `color.border-strong` : un champ de saisie au repos est **identifié par sa seule bordure** — bordure *délimitante* au sens du guardrail de DESIGN.md (1.4.1), donc 3:1 obligatoire (WCAG 1.4.11 — le label indique *quoi* saisir, pas *où*). La carte outlined, dont la bordure est un groupement décoratif, garde `color.border` — le test de rendu applique ce critère identiquement aux deux composants. La subtilité visuelle du champ au repos y perd — assumé : un champ qu'on ne voit pas est un champ qu'on ne remplit pas. (Arbitrage complet : cf. DECISIONS.md.)

## Bordure d'état — transition et reduced-motion

RÈGLE [INPUT-U01] : `state_border` anime `border-color` de repos → error/success/warning en `motion.fast` /
STATUT : implémentation de référence
SOURCE : interne
ÉNONCÉ : Le code anime la couleur de la bordure d'état en motion.fast/ease-out, tandis que le message d'erreur apparaît sans délai.
MESURE : la bordure d'état transitionne border-color en motion.fast/ease-out ; le message d'erreur associé apparaît sans délai.
`motion.ease-out` — c'est du feedback (`MOTION-UI.md`, tableau des transitions, ligne « Bordure d'état
de l'input »). Le message d'erreur, lui, apparaît sans délai.

RÈGLE [INPUT-U02] : sous `prefers-reduced-motion`, cette transition **est conservée** — `MOTION-UI.md` § reduced-motion
STATUT : implémentation de référence
SOURCE : T4
ÉNONCÉ : Le code conserve la transition de couleur de la bordure d'état sous prefers-reduced-motion, en héritant du bloc média global.
MESURE : sous prefers-reduced-motion, la transition de border-color reste active et n'est pas redéclarée localement.
coupe déplacements/rotations/échelles mais **garde opacité et couleur** ; une transition de `border-color`
est un changement de couleur, elle reste donc autorisée, et ce champ ne la redéclare pas localement (il
hérite du bloc média global de MOTION-UI). Assumé, pas un oubli : l'information d'erreur ne dépend jamais
de cette animation (cf. INPUT-UX.md § Application du langage de motion).

## Matérialité et adaptation

RÈGLE [INPUT-U03] : l'Input reste à `elevation.none` dans tous ses états. La sensation réceptive vient du fond, de
STATUT : implémentation de référence
SOURCE : interne
ÉNONCÉ : Le code fixe l'élévation de l'Input à elevation.none dans tous ses états, sans inset requis.
MESURE : le token d'élévation appliqué à l'Input est elevation.none dans tous ses états.
la bordure, du label et du focus ; aucun inset n'est requis par le composant.

RÈGLE [INPUT-U04] : dans un conteneur étroit, les services trailing peuvent se regrouper seulement si leur accès
STATUT : implémentation de référence
SOURCE : interne
ÉNONCÉ : Le code ne doit jamais masquer le label, la valeur, une contrainte nécessaire ou le message d'erreur via une Container Query.
MESURE : aucune Container Query ne masque le label, la valeur, une contrainte nécessaire ou le message d'erreur.
et leur nom restent disponibles. Le label, la valeur, une contrainte nécessaire et le message d'erreur
ne sont jamais masqués par une Container Query.

RÈGLE [INPUT-U05] : une composition de champs utilise les Container Queries du pattern parent pour réorganiser les
STATUT : implémentation de référence
SOURCE : interne
ÉNONCÉ : Le code de l'Input n'utilise jamais breakpoint.mobile pour déduire sa largeur ; la réorganisation est déléguée au pattern parent.
MESURE : le composant Input ne contient aucune media query basée sur breakpoint.mobile.
colonnes. L'Input ne lit pas `breakpoint.mobile` pour deviner sa largeur.

## Accessibilité — spécifications techniques
- Label lié au champ via `for`/`id` ou `aria-labelledby` — jamais la seule proximité visuelle.
- Contraste minimum 3:1 sur la bordure à **tous** les états, y compris neutral au repos (cf. décision F02 ci-dessus) — pas seulement en error.
- Message d'erreur associé via `aria-describedby` pour qu'un lecteur d'écran l'annonce au focus du champ.

## Autofill navigateur — contournement technique
Le style de fond forcé par le navigateur sur un champ autofillé ne répond pas à `background-color` standard. Le contournement le plus répandu utilise une transition de `box-shadow` interne pour masquer visuellement la couleur imposée par le navigateur, appliqué sur le sélecteur `:-webkit-autofill` (et équivalents par navigateur) :

```css
input:-webkit-autofill {
  transition: background-color 9999s ease-in-out 0s;
  -webkit-text-fill-color: var(--text-primary);
}
```

Ce contournement n'est pas standardisé entre navigateurs — à tester spécifiquement sur Chrome, Safari et Firefox plutôt que supposé universel.

## Champ de paiement — limite du contrôle du design system
Les champs numéro de carte et CVV vivent typiquement dans un iframe fourni par le processeur de paiement (cf. raisonnement dans INPUT-UX.md). Le styling possible passe par l'API du processeur (ex: `styles` object chez Stripe/Hosted Fields), pas par les tokens de ce fichier directement — prévoir un mapping séparé des tokens de couleur/typo vers le format attendu par le processeur choisi.

## Sources et niveau de confiance (couche UI)
| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| T1 | Liaison label/champ technique obligatoire | WCAG | Établi, standard d'accessibilité |
| T2 | Tone comme axe natif aux frameworks UI | Material UI et équivalents | Établi par convergence |
| T3 | Contournement CSS autofill via box-shadow | Pratique répandue, non standardisée entre navigateurs | Solution technique connue, pas une spec officielle |
| T4 | Bordure d'état : transition de couleur conservée sous reduced-motion | `MOTION-UI.md` § reduced-motion (opacité/couleur conservées, hérité du bloc global) | Établi — contrat motion interne |
