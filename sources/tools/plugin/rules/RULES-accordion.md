---
sujet: accordion
type: composant
resume: "Disclosure réutilisable : en-tête bouton (aria-expanded) qui révèle/masque une région ; multi-ouvert par défaut (single-open optionnel), état conservé, chevron non chromatique qui pivote, dépliage motion.base, jamais un piège de focus"
requires: []
selon-contexte: ["iconography (chevron d'état qui pivote)", "motion (dépliage/repliage de la hauteur ; reduced-motion)", "link (un lien placé dans une région d'accordion)"]
---
# RULES — Accordion (compilé, condensé)

> Généré depuis `components/accordion/ACCORDION-UX.md` (v1.0.0) et `ACCORDION-UI.md` (v1.0.0). Règles condensées pour le build — la source fait autorité. Ne pas éditer à la main. Tokens : `dist/tokens.yaml`.

## Nature
- **Disclosure** : un en-tête révèle/masque une région ; un accordion en empile plusieurs. Réutilisable (nav, FAQ, réglages), pas seulement la nav.
- Contenu masqué **non détruit** ; le rouvrir retrouve l'état.

## Ouverture
- **Multi-ouvert par défaut** (plusieurs sections ouvertes) ; single-open = **option**, jamais imposée (elle cache du contenu et surprend).

## Clavier / rôle (ARIA APG)
- En-tête `button` + `aria-expanded` + `aria-controls` ; région `aria-labelledby`. **Entrée/Espace** basculent. En-tête enveloppé d'un titre (`h2`-`h6`) quand il structure la page.
- L'ouverture **ne vole pas le focus**, ne déplace pas la page ; **aucun piège de focus** (≠ modal).

## État — jamais la seule couleur
- Indicateur **non chromatique** (chevron qui pivote, +/−), pas la couleur seule.

## UI (tokens)
- En-tête : padding `spacing`, survol `surface-hover` en `radius.md`, chevron `icon.sm`/`icon.md` qui pivote en `motion.base`/`motion.ease-in-out`, focus ring `border`, cible 44px.
- Région : padding `spacing` ; séparateur = `border` mais l'espace d'abord. Dépliage `motion.base`, `prefers-reduced-motion` respecté.

## Frontières
- Chevron → `iconography` ; durées → `motion` ; lien interne → `link` ; focus ring → `border` ; wording → `voice`. Un disclosure qui recouvre et piège n'est pas un accordion : c'est `overlay`.

## Risque
| Cas | Risque | Sévérité |
|---|---|---|
| Ouverture qui vole le focus / déplace la page | Désorientation, perte de repère | Moyenne |
| État ouvert/fermé porté par la seule couleur | Illisible sans perception des couleurs (WCAG 1.4.1) | Élevée |
| Single-open imposé dans une nav | Contenu caché, surprise | Moyenne |
| Contenu détruit à la fermeture | Perte d'état / de saisie | Moyenne-élevée |

CONFIANCE : motif disclosure/accordion = établi (ARIA APG). Défaut multi-ouvert = convergent (Carbon, GOV.UK details).
