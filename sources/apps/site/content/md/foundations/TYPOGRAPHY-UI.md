---
component: typography
layer: ui
type: foundation
version: 1.1.0 # 1.1.0 : section "Consommation par les composants" — la fondation était orpheline, aucun composant ne la référençait (leurs styles de texte étaient des déductions silencieuses)
last_updated: 2026-07-05
companion: TYPOGRAPHY-UX.md
tokens:
  headings: # résolus dans DESIGN.md 1.6.0 (typography.headings.*) — clamp(min, fixe-rem + pente-vw, max)
    h1: typography.headings.h1
    h2: typography.headings.h2
    h3: typography.headings.h3
    h4: typography.headings.h4
    h5: typography.headings.h5
    h6: typography.headings.h6
  text_styles:
    display: typography.display
    body: typography.body
    label_mono: typography.label-mono
  fallback:
    sans: typography.fallback.sans
    mono: typography.fallback.mono
  measure:
    reading_max: measure.reading-max
confidence: mixed # cf. TYPOGRAPHY-UX.md — l'échelle fluide contient un point débattu
---

# Typographie — Couche UI (fondation)

> Valeurs et contraintes techniques. Le raisonnement (sens vs lisibilité, fluid type et zoom, mesure) vit dans TYPOGRAPHY-UX.md. Toutes les valeurs sont résolues dans DESIGN.md — aucune n'est définie ici.

## Échelle de titres — construction

L'échelle vit dans `DESIGN.md` (`typography.headings.h1` à `.h6`). Ce que ce fichier fixe, c'est sa **grammaire de construction** :

- **`rem` dans le minimum, le maximum ET la partie fixe de la valeur préférée** — jamais de `px` seul, jamais de `vw` seul (échec WCAG 1.4.4, cf. TYPOGRAPHY-UX.md). La composante `rem` répond au zoom, la composante `vw` porte la fluidité.
- **Ratio max/min ≤ 2.5 par échelon** — le garde-fou du point débattu. L'échelle actuelle est très en dessous :

| Échelon | Plage (équivalent px, racine navigateur par défaut) | Ratio max/min |
|---|---|---|
| h1 | 32 → 48 | 1.50 |
| h2 | 24 → 32 | 1.33 |
| h3 | 20 → 24 | 1.20 |
| h4 | 18 → 20 | 1.11 |
| h5 | 16 → 18 | 1.13 |
| h6 | 14 → 16 | 1.14 |

- Le **max de h1 rejoint `typography.display`** : le style display reste la voix du hero (fontWeight et lineHeight propres), h1 est l'échelon *structurel* de même amplitude maximale — deux usages, une seule taille de crête, pas de concurrence visuelle.
- La pente `vw` est calculée pour une interpolation entre `breakpoint.mobile` et sa valeur doublée (la largeur de page de référence du système) — l'échelle et le layout bougent sur les mêmes bornes.
- **Rappel UX** : ces tailles habillent des *niveaux structurels* — le niveau d'un heading suit le contenu, sa taille peut y déroger localement (cf. TYPOGRAPHY-UX.md, hiérarchie sémantique vs visuelle).

## Piles de secours (fallback stacks)

Geist et JetBrains Mono **ne sont pas embarquées** dans le dossier — tout rendu les charge depuis un service externe ou les suppose installées (risque : sans pile déclarée, le rendu retombe sur le défaut navigateur, métriques imprévisibles). Règle :

- Toute déclaration de police écrit `fontFamily` **puis** la pile : `typography.fallback.sans` derrière Geist, `typography.fallback.mono` derrière JetBrains Mono — jamais une famille seule.
- Les piles privilégient les fontes système à métriques proches (`system-ui`, `ui-monospace`) : en cas de non-chargement, la page reste composée et le décalage de métriques (layout shift) est limité.
- Le chargement web utilise `font-display: swap` — le texte reste lisible pendant le chargement, dans la pile de secours.

## Mesure de lecture — application

- Le texte courant est borné par `measure.reading-max` (en `ch` — l'unité suit la police et la taille effective, donc le zoom).
- S'applique aux paragraphes et blocs de lecture, **pas aux titres** (cf. TYPOGRAPHY-UX.md).
- Le conteneur reste fluide en dessous de la borne : `max-width`, jamais `width` fixe.

## Consommation par les composants (ajouté en 1.1.0)

Une fondation ne vaut que consommée. Chaque composant qui compose du texte déclare désormais ses styles en référence à cette fondation, dans son propre *-UI.md — la couleur du texte restait tokenisée (les `_text` de chaque composant), mais famille, corps et graisse étaient déduits silencieusement :

| Consommateur | Texte | Référence |
|---|---|---|
| Bouton (BUTTON-UI.md) | label | corps `typography.body`, graisse de titre (`typography.display.fontWeight`) |
| Input (INPUT-UI.md) | valeur saisie, label, messages | corps `typography.body` — **jamais en dessous** : sous l'équivalent 16 px, iOS zoome au focus |
| Card (CARD-UI.md) | titre de carte | taille `typography.headings.h4` par défaut — le *niveau* du heading suit la page, pas la taille (la règle "niveau ≠ taille" en application) |
| Alert (ALERT-UI.md) | titre + corps | corps `typography.body`, titre en graisse (`typography.display.fontWeight`) — pas un heading (cf. ALERT-UI, accessibilité) |
| Form (FORM-UI.md) | hérite via alert et input | — |

## Vérifiabilité — limite d'outillage assumée

`tools/test-rendu.js` vérifie la **résolution** de ces tokens (le nom existe dans DESIGN.md) via `tools/valide-dossier.js`, mais **ne peut pas vérifier le comportement fluide** : une expression `clamp()` ne s'évalue qu'en contexte de rendu (largeur de viewport, zoom, taille de racine). Le test qui compte — zoom navigateur à 200 %, texte doublé — est un test manuel documenté dans TYPOGRAPHY-UX.md. Signalé ici plutôt que simulé : une vérification statique de `clamp()` donnerait une fausse assurance sur précisément le point débattu de cette fondation.

## Sources et niveau de confiance (couche UI)

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| T1 | Grammaire clamp(rem, rem + vw, rem) | [Smashing Magazine, nov. 2023](https://www.smashingmagazine.com/2023/11/addressing-accessibility-concerns-fluid-type/), [Adrian Roselli](https://adrianroselli.com/2019/12/responsive-type-and-zoom.html) | Établi comme mitigation ; limite au zoom extrême débattue (cf. TYPOGRAPHY-UX.md) |
| T2 | Ratio ≤ 2.5 par échelon | [Smashing Magazine, nov. 2023](https://www.smashingmagazine.com/2023/11/addressing-accessibility-concerns-fluid-type/) | Communément admis, pas un critère WCAG officiel |
| T3 | Piles de secours à métriques proches + font-display: swap | Pratique standard de chargement de polices web (web.dev, littérature performance) | Établi par convergence |
| T4 | Mesure en ch, max-width sur le texte courant | Typographie classique (cf. TYPOGRAPHY-UX.md) + comportement documenté de l'unité ch | Établi |
| T5 | Les tailles de police en px ne sont pas accessibles ; privilégier les valeurs relatives au corps racine, dont le défaut usuel est 16 px mais reste modifiable par l'utilisateur | [MDN — font-size](https://developer.mozilla.org/en-US/docs/Web/CSS/font-size) ; [MDN — CSS length units](https://developer.mozilla.org/en-US/docs/Web/CSS/length) | Établi — fonde la grammaire clamp(rem, rem + vw, rem) sur une source de plateforme |
