---
component: color
layer: ui
type: foundation
version: 1.3.0 # 1.3.0 : retrait d'`accent` du registre marque et de la table des consommateurs — le focus ring passe aux crans control.focus-* accordés (focus v2, DESIGN 1.34.0, arbitrage 2026-07-29 soir). 1.2.0 : # 1.2.0 : ajout de Link à la table des consommateurs ; il réutilise primary/primary-hover et ne crée aucun token. 1.1.0 : alignement sur le modèle style × tone (DESIGN.md 1.21.0, DECISIONS 2026-07-18) — paires garanties étendues (on-primary sur neutral-strong/-hover et warning/-hover ; danger sur danger-subtle-hover), « warning jamais un fond plein » levé, table de consommation du bouton réécrite en rôles par tone. Aucun hex ici (les valeurs vivent dans DESIGN.md). 1.0.1 : note d'hypothèse « thème clair » sur la paire surface-contrast (stress-test 2026-07-17) — aucune valeur changée
last_updated: 2026-07-20
companion: COLOR-UX.md
tokens:
  # Cette couche ne définit AUCUNE valeur — elle organise les tokens de DESIGN.md par registre
  # et fixe les paires texte/fond garanties. Les valeurs vivent dans DESIGN.md, seule source.
  registres:
    marque: [color.primary, color.primary-hover, color.on-primary, color.secondary]
    semantique: [color.danger, color.danger-hover, color.danger-subtle, color.success, color.success-subtle, color.warning, color.warning-subtle, color.warning-subtle-hover, color.info, color.info-subtle]
    neutres_texte: [color.text-primary, color.text-secondary, color.text-muted]
    neutres_surfaces: [color.background, color.surface, color.surface-hover, color.surface-contrast]
    neutres_bordures: [color.border, color.border-strong]
confidence: mixed # les paires et seuils sont vérifiés numériquement (test-rendu.js) ; l'organisation par registre est une décision interne
---

# Couleur — Couche UI (fondation)

> Organisation des tokens par registre et paires texte/fond garanties. Le raisonnement (registres étanches, redondance, theming) vit dans COLOR-UX.md. Toutes les valeurs sont résolues dans DESIGN.md — aucune n'est définie ici.

## Paires texte/fond garanties

Un token de texte n'est conforme que *sur un fond donné* (COLOR-UX). Les paires garanties de ce système — toutes re-vérifiées par `tools/test-rendu.js` à chaque régénération :

| Texte | Fonds garantis (≥ 4.5:1) | Notes |
|---|---|---|
| `color.text-primary` | `background`, `surface`, `surface-hover`, fonds `*-subtle` | le texte de croisière |
| `color.text-secondary` | `background`, `surface`, fonds `*-subtle` | texte fonctionnel secondaire (helper, compteur, icônes de service) |
| `color.text-muted` | aucun au seuil texte | **métadonnées accessoires uniquement** — jamais du texte fonctionnel (précédent F01) |
| `color.on-primary` | `primary`, `primary-hover`, `neutral-strong`, `neutral-strong-hover`, `danger`, `danger-hover`, `warning`, `warning-hover` | texte des fonds pleins — étendu en 1.1.0 aux fonds du modèle style × tone : neutral-strong 17.74:1, warning 7.09:1 (DESIGN.md 1.21.0) |
| `color.danger` | `background`, `danger-subtle`, `danger-subtle-hover` | 6.47:1 / 5.30:1 / 4.60:1 (hover du style lighter, calibré en 1.21.0) |
| `color.success` | `background`, `success-subtle` | 5.02:1 / 4.57:1 (recalibré 1.4.0) |
| `color.warning` | `background`, `warning-subtle`, `warning-subtle-hover` | comme texte ; depuis DESIGN.md 1.21.0 l'ambre profond tient AUSSI en fond plein (blanc dessus 7.09:1 — cf. ligne `on-primary`) |
| `color.info` | `background`, `info-subtle` | 6.70:1 / 5.49:1 |
| `color.background` / `color.on-primary` | `surface-contrast` | seuls textes admis sur le panneau sombre (+ `text-muted`) ; **hypothèse de thème clair** : ce couple n'est satisfiable que si `background` et `on-primary` tombent du même côté de la luminance — en thème sombre, cela force `primary` clair (règle dérivée, COLOR-UX § Theming) |

Au seuil **3:1 (non-texte)** : `color.border-strong` (bordure délimitante) sur `background`/`surface` — recalibrage fondateur de 1.3.0. (Le focus ring, désormais en crans `control.focus-*` dérivés par color-mix, tient sa visibilité de la teinte de base de chaque famille, elle-même sous contrôle de contraste.)

## Combinaisons interdites (rappel outillé)

- Tout texte fonctionnel sur un fond non listé ci-dessus → re-passer par `test-rendu.js` avant usage.
- Les tokens de texte `text-*` (pensés pour fond clair) sur `surface-contrast` — hors `text-muted` en métadonnée.
- `primary`/`secondary` pour porter un état sémantique, `danger`/`success`/`warning`/`info` pour décorer — les registres sont étanches (COLOR-UX).
- Un hex nouveau dans un `*-UI.md` — il passe d'abord par DESIGN.md (guardrail existant, appliqué par `valide-dossier.js`).

## Consommation par les composants

| Consommateur | Registre marque | Registre sémantique | Neutres |
|---|---|---|---|
| Bouton (BUTTON-UI.md) | primary/on-primary (tone `primary`), control.focus-* accordé au tone (focus) | destructive→danger, warning — chaque tone porte ses rôles `solid`/`on_solid`/`fg`/`border`/`subtle` (modèle style × tone) | neutral-strong(-hover), border-strong, text-*, surface-hover |
| Link (LINK-UI.md) | primary (repos), primary-hover (survol), control.focus-primary (focus) | — | text-secondary pour l'état visité quand le contexte le demande ; le soulignement reste le signal non chromatique |
| Input (INPUT-UI.md) | control.focus-* accordé au status (focus) | error→danger, success, warning (bordures) | border-strong (délimitante), text-* |
| Card (CARD-UI.md) | primary (selected), control.focus-primary (focus) | — (le conteneur n'a pas de sémantique) | background/surface, border, text-* |
| Alert (ALERT-UI.md) | — | les 4 tones en couples complets | text-secondary (croix) |
| Form (FORM-UI.md) | — | hérite de l'alert danger | — |

Chaque composant nomme le registre `danger` selon ce qu'il signifie pour lui (destructive/error/danger) — divergence assumée, journalisée à la création de l'alert.

## Vérifiabilité

- `tools/test-rendu.js` calcule les ratios WCAG de toutes les combinaisons documentées des composants — les paires de ce fichier sont couvertes par ce test tant que les composants les consomment.
- Limite assumée : une paire listée ici mais consommée par aucun composant n'est pas testée automatiquement (le script parcourt les combinaisons des `*-UI.md` de composants) — en ajouter un consommateur ou vérifier le ratio à la main lors de l'ajout.
- Le test au contraste ne vérifie pas la redondance (1.4.1) — celle-ci reste une exigence de revue (icône, mot, forme), non calculable.

## Sources et niveau de confiance (couche UI)

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| T1 | Ratios des paires texte/fond | Calcul formule WCAG (tools/test-rendu.js), valeurs DESIGN.md 1.8.0 | Vérifié numériquement |
| T2 | Paires garanties par tokens appariés (container/on-container, field/border par calque) | [Material 3](https://developer.android.com/design/ui/mobile/guides/styles/color) (paires de rôles), [Carbon](https://carbondesignsystem.com/elements/color/usage/) (tokens contextuels par layer) | Établi — même mécanique, implémentation plus simple ici (un seul thème) |
| T3 | Hover exempté de 1.4.11 mais testé quand même | [WCAG 1.4.11 Understanding](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html) | Établi (exemption) ; sur-test = choix interne |
