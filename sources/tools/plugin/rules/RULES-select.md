---
sujet: select
type: composant
resume: "Choix unique parmi des options prédéfinies : déclencheur (combobox) + liste (listbox) en popover NON-MODAL (overlay), clavier APG (↑↓ Début/Fin Entrée Échap, type-ahead), option sélectionnée marquée par une coche (jamais la seule couleur)"
requires: []
selon-contexte: ["overlay (la liste est un superposé non-modal : ancrage, light-dismiss, z-index.popover, elevation.overlay)", "form (le requis et la validation d'un select dans un formulaire)", "iconography (chevron + coche de l'option sélectionnée)", "input (frontière : le select n'est pas une saisie libre)"]
---
# RULES — Select (compilé, condensé)

> Généré depuis `components/select/SELECT-UX.md` (v1.0.0) et `SELECT-UI.md` (v1.1.0). Règles condensées pour le build — la source fait autorité. Ne pas éditer à la main. Tokens : `dist/tokens.yaml`.

## Nature
- Choisir **une** valeur parmi un ensemble **prédéfini et limité**. INPUT y renvoie dès que le choix n'est pas une saisie libre. Déclencheur (montre la valeur courante) + liste dépliable.
- **select** pour une liste longue/encombrante ; **radios** visibles pour peu d'options (≈ 2-5) ; **input** pour une saisie libre ; **switch** pour activer/désactiver tout de suite.

## Liste = popover non-modal (fondation overlay)
- Ancrée au déclencheur, **sans voile**, **sans piège de focus**, `z-index.popover` ; **light-dismiss** (Échap ou clic/focus dehors) ; retour du focus au déclencheur à la fermeture.
- À l'ouverture, l'option sélectionnée (ou la première) devient active ; navigation par `aria-activedescendant`.

## Clavier (select-only combobox, ARIA APG)
- Fermé : ↓/↑/Entrée/Espace ouvrent ; une frappe ouvre + présélectionne (type-ahead).
- Ouvert : ↑↓ déplacent l'actif, Début/Fin aux extrêmes, Entrée/Espace sélectionnent + ferment, Échap ferme sans changer, Tab ferme en validant l'actif.

## Rôle / nom / valeur
- Déclencheur `role="combobox"` + `aria-expanded` + `aria-haspopup="listbox"`, nom accessible = libellé visible ; liste `listbox`, options `option` + `aria-selected`.

## UI (tokens)
- Déclencheur : hauteur `scale.base`, `radius.md`, **bordure `border-strong`** (délimite un contrôle : 3:1), chevron `icon.md`, focus ring `border`.
- Liste : `z-index.popover`, `elevation.overlay`, **`radius.lg`** (cran CONTENEUR : une surface flottante n'est pas un contrôle — `radius.md` jusqu'au 2026-08-03 ; le déclencheur, lui, reste `radius.md`), fond `background` ; option active = `surface-hover` ; option sélectionnée = **coche** (icône, jamais la seule couleur). Ouverture en `motion.base`, `prefers-reduced-motion` respecté. Cible tactile 44px.

## Frontières
- Ancrage/dismiss/z-index → `overlay` ; requis/validation → `form` ; chevron/coche → `iconography` ; saisie libre → `input` ; wording → `voice`.

## Risque
| Cas | Risque | Sévérité |
|---|---|---|
| Liste modale (scrim + piège) au lieu de non-modale | Attente trahie, focus sur-contraint | Moyenne-élevée |
| Option sélectionnée signalée par la seule couleur | Choix illisible sans perception des couleurs (WCAG 1.4.1) | Élevée |
| Déclencheur qui masque la valeur courante | L'utilisateur ne sait plus ce qui est choisi | Moyenne |
| Clavier partiel (pas de type-ahead / Début-Fin) | Navigation lente, non conforme APG | Moyenne |

CONFIANCE : motif combobox/listbox + clavier = établi (ARIA APG *Select-Only Combobox*). Seuil select vs radios = repère convergent (NN/g), pas une loi. Mono-sélection ; multi/recherche différés.
