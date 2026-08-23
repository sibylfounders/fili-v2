---
component: iconography
layer: ui
type: foundation
version: 1.0.0
last_updated: 2026-07-11
companion: ICONOGRAPHY-UX.md
tokens:
  tailles: # créées dans DESIGN.md 1.10.0 par cette fondation — c'était la déduction silencieuse de 4 composants
    sm: icon.sm # dense, inline, chevrons
    md: icon.md # défaut — apparié au corps typography.body, comme Carbon apparie ses icônes 20 au corps 16
    lg: icon.lg # zones aérées, media fallback, icon-only lg
  trait:
    stroke: icon.stroke # constant sur toute la bibliothèque — décision d'identité, fixée dans DESIGN.md comme les polices
  couleur:
    heritage: currentColor # l'icône prend la couleur du texte qu'elle accompagne — jamais de couleur propre hors tone sémantique
  cible:
    min_touch_target: 44px # standard externe non négociable, comme partout
confidence: mixed
---

# Iconographie — Couche UI (fondation)

> Grammaire d'application : tailles, trait, alignement, implémentation SVG. Le raisonnement (droit d'exister, redondance, registre stable) vit dans ICONOGRAPHY-UX.md. Les valeurs sont résolues dans DESIGN.md.

## Tailles — mapping

| Cran | Usage | Appariement |
|---|---|---|
| `icon.sm` | chevrons, icônes inline dans le texte, contextes denses (table) | hauteurs `scale.compact`, petits corps (`typography.label`, équivalents 12-14) |
| `icon.md` | défaut : boutons, alert, input (clear, prefix/suffix) | corps `typography.body`, hauteurs `scale.base` |
| `icon.lg` | icon-only en taille lg, media fallback, zones aérées | hauteurs `scale.expanded` |

Jamais de taille libre entre les crans — une icône ne se redimensionne pas, elle change de cran (et si aucun cran ne va, c'est l'échelle qu'on questionne, cf. SPACING-UX sur l'échelle fermée).

## Implémentation

- **SVG inline** avec `fill`/`stroke: currentColor` — hérite de la couleur du texte adjacent ; pas d'icon font (ICONOGRAPHY-UX, risques).
- Icône décorative ou redondante avec le texte : `aria-hidden="true"` (défaut). Icône porteuse de sens sans texte : `aria-label` sur le contrôle, ou alternative textuelle ("Avertissement :" — cf. ALERT-UI).
- Ne pas répéter le texte adjacent dans le label ; ne pas décrire l'apparence ; jamais le mot "icône" dans un label (convention Polaris).
- À côté du texte : **centrage vertical** sur la ligne. Icône seule dans un contrôle : centrée dans la cible, padding quasi carré (BUTTON-UI icon_only).
- Cible : 44px minimum par extension du padding, jamais en gonflant le glyphe.
- Transformations d'état : `transform` sur le même glyphe (rotation du chevron : `expand_chevron_rotation`, CARD-UI) — durées/courbes dans MOTION-UI ; rotation continue du spinner : linéaire (seule exception au bannissement du linéaire, cf. MOTION-UI).

## Consommation par les composants

| Consommateur | Icônes | Cran | Référence |
|---|---|---|---|
| Bouton (BUTTON-UI.md) | leading/trailing, icon-only, spinner loading | md (lg en icon-only lg) | gap icône-texte : content_spacing |
| Alert (ALERT-UI.md) | icône de tone (silhouettes normatives icon_shape), croix dismiss | md | couleur = token du tone |
| Input (INPUT-UI.md) | clear, prefix/suffix, œil password | md | couleur text-secondary |
| Card (CARD-UI.md) | chevron expandable, actions d'objet, media fallback | sm (chevron), md (actions), lg (fallback) | chevron : expand_chevron |

## Vérifiabilité

- `valide-dossier.js` vérifie la résolution des tokens `icon.*` (groupe ajouté à ses motifs).
- Le contraste d'une icône informative (3:1) suit la couleur du texte qu'elle hérite — couvert par les paires de COLOR-UI tant que l'héritage est respecté ; une icône à couleur propre sortirait de cette garantie (interdit hors tone).
- La lisibilité du trait au cran sm est un contrôle visuel au choix de la bibliothèque — non calculable, signalé.

## Sources et niveau de confiance (couche UI)

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| T1 | Appariement tailles icône/texte | [Carbon — Icons usage](https://carbondesignsystem.com/elements/icons/usage/) (icônes 16/20 ↔ Plex 14/16) | Établi chez Carbon, transposé |
| T2 | SVG + currentColor, aria-hidden par défaut | [Carbon — Icons code](https://carbondesignsystem.com/elements/icons/code/), [Polaris — Icon](https://polaris-react.shopify.com/components/images-and-icons/icon) | Établi par convergence |
| T3 | Conventions de label (pas d'apparence, pas de répétition) | [Polaris — Icon](https://polaris-react.shopify.com/components/images-and-icons/icon) | Établi chez Polaris |
| T4 | Cible étendue par padding | [Carbon](https://carbondesignsystem.com/elements/icons/usage/), [Material](https://m1.material.io/style/icons.html) (24dp dans cible 48dp) | Établi par convergence |
