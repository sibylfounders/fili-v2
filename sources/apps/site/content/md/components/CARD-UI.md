---
component: card
layer: ui
version: 1.6.0 # 1.6.0 : focus v2 + retrait du token `color.accent` (DESIGN 1.34.0, arbitrage 2026-07-29) — `focus_ring` pointe désormais les rôles `control.focus-*` (cran subtil accordé à l'état, géométrie BORDER inchangée) ; aucune autre règle modifiée. 1.5.2 : chemins repointés vers `content/md/` — fin de la migration vers le monorepo Sibyl DS (2026-07-27) ; aucune règle, aucun token, aucune source modifiés. 1.5.1 (2026-07-21) : grid_gap devient un alias de compatibilité — l'autorité du gap de grille est transférée au pattern collection (COLLECTION-UI.md, mapping par densité), cf. DECISIONS.md. 1.5.0 (2026-07-21) : rattachement nommé Interaction/Motion/Voice, contrat reduced-motion chevron/dépliage, E-motion sans objet raisonné. 1.4.0 : adoption d'INTERACTION-UI et ADAPTIVE-UI — surface statique sans faux feedback ; disposition pilotée par le conteneur, grille de page propriétaire de ses colonnes. 1.3.1 : conteneur en radius.lg.
last_updated: 2026-07-29
companion: CARD-UX.md
tokens:
  containment:
    # Décision d'identité visuelle prise une fois pour tout le produit — pas un axe par instance (cf. note de transposition dans CARD-UX.md).
    # Ce design system choisit outlined par défaut, elevated réservé au survol des cartes cliquables.
    outlined: { background: color.background, border: color.border, radius: radius.lg, shadow: elevation.none }
    elevated: { background: color.background, radius: radius.lg, shadow: elevation.raised }
  density:
    comfortable: { padding: spacing.md, slot_gap: spacing.sm }
    compact: { padding: spacing.sm, slot_gap: spacing.xs }
  media:
    ratio: media_ratio.landscape
    fallback_background: color.surface
    fallback_icon: color.text-muted
  collection:
    grid_gap: spacing.md # ALIAS de compatibilité — autorité transférée au pattern collection le 2026-07-21 (COLLECTION-UI.md : collection_gap.compact = spacing.md, comfortable = spacing.lg) ; ne plus faire évoluer ici
  typography: # ajouté en 1.2.1 — relié à la fondation (foundations/typography/)
    title_size: typography.headings.h4 # taille par DÉFAUT du titre de carte — le NIVEAU du heading (h2...h4) suit la structure de la page, pas cette taille : c'est la règle "niveau ≠ taille" de TYPOGRAPHY-UX.md en application
    body_font: typography.body
    fallback: typography.fallback.sans
  states:
    hover_shadow: elevation.raised # cartes cliquables uniquement
    focus_ring: control.focus-color # focus v2 (2026-07-29) — cran subtil accordé à l'état (sélection → control.focus-primary) ; géométrie BORDER inchangée
    selected_border: color.primary
    skeleton_background: color.surface
    expand_chevron: color.text-secondary # le mode expandable doit être discernable de static au repos
    expand_chevron_rotation: "180deg" # rotation du chevron à l'état déplié — l'état est porté par l'orientation, pas par un changement de glyphe
  axes:
    interaction_mode: [static, clickable, selectable, expandable]
    density: [comfortable, compact]
  icon: # ajouté en 1.3.0 — relié à la fondation (foundations/iconography/)
    chevron_size: icon.sm
    action_size: icon.md
    media_fallback_size: icon.lg
  motion: # ajouté en 1.3.0 — relié au langage (languages/motion/)
    hover_elevation: { duration: motion.fast, easing: motion.ease-out } # ombre pré-rendue sur pseudo-élément, animée en opacité — jamais box-shadow interpolé (cf. MOTION-UI.md)
    chevron: { duration: motion.base, easing: motion.ease-in-out }
    skeleton_pulse: boucle lente d'opacité — coupée sous prefers-reduced-motion, le squelette reste visible statique (cf. MOTION-UI.md)
  focus_ring_style: # ajouté en 1.3.0 — cf. BORDER-UI.md
    width: border.focus-width
    offset: border.focus-offset
  min_touch_target: 44px # pour les cibles internes (icônes d'action) — standard externe non négociable
confidence: mixed
---

# Card — Couche UI

> Tokens et techniques d'implémentation. Le raisonnement (modes d'interaction, composition, empty state, risques) vit dans CARD-UX.md.

## Différence structurelle avec BUTTON-UI.md et INPUT-UI.md

Deux axes seulement (`interaction_mode`, `density`) — voir la note de transposition dans CARD-UX.md. Ni tone (le conteneur n'a pas de sémantique), ni size en hauteurs fixes : la hauteur d'une carte est dictée par son contenu, sa largeur par la grille. Les seules dimensions que ce fichier fixe sont le padding (densité), le ratio du media, et les écarts.

Les tokens `elevation.*` et `media_ratio.*` de DESIGN.md sont référencés ici par nom. (Ils ont été créés pour ce composant : cf. DECISIONS.md.)

## Style de conteneur

- **outlined** par défaut : fond `color.background`, bordure `color.border`, `radius.lg` (cran conteneur, cf. RADIUS — distinct du `radius.md` des contrôles).
- **elevated** (`elevation.raised`) réservé au retour de survol des cartes cliquables — l'élévation *est* le signal d'affordance, elle ne doit donc pas être l'état de repos de toutes les cartes, sinon le signal ne signale plus rien.
- Le fond de la page qui accueille des cartes outlined doit se distinguer du fond des cartes — `color.surface` en fond de zone de collection, `color.background` pour les cartes.

## Densité — valeurs techniques

Mêmes réserves que BUTTON-UI.md et INPUT-UI.md : pas de px absolu au-delà des tokens d'espacement, relation relative compact < comfortable. La densité change le padding et les écarts entre slots, jamais la structure ni l'ordre des slots.

## Media — valeurs techniques

- Ratio unique par collection : `media_ratio.landscape` (16/9) par défaut — `media_ratio.square` pour les cas avatar/produit centré. Implémentation par `aspect-ratio` CSS + `object-fit: cover`, jamais par hauteur fixe en px.
- Media manquant : bloc de même ratio, fond `color.surface`, icône ou initiales en `color.text-muted` — la grille ne doit pas voir la différence.
- Images : `alt` obligatoire si informative, `alt=""` explicite si décorative. Lazy-loading (`loading="lazy"`) recommandé en collection longue.

## Carte cliquable — technique d'implémentation

La cliquabilité de toute la surface vient d'un vrai lien étendu en CSS, pas d'un `div onclick` :

```css
.card { position: relative; }
.card__title-link::after {
  content: "";
  position: absolute;
  inset: 0; /* étend la cible du lien à toute la carte */
}
```

- Le lien porte le titre de la carte — c'est lui que le lecteur d'écran annonce.
- Les actions secondaires éventuelles sont des **siblings dans le DOM** (jamais imbriquées dans le lien), repositionnées visuellement au-dessus via `z-index` — chaque cible reste distincte au clavier.
- Cette technique n'est pas une invitation à multiplier les actions internes : la règle de cardinalité de CARD-UX.md s'applique d'abord.

## Accessibilité — spécifications techniques

- Collection de cartes = balisage de liste (`ul`/`li` ou `role="list"`) — le lecteur d'écran annonce le nombre d'items et la position.
- Titre de carte = élément de titre réel (`h2`...`h4`), même niveau sur toute la collection — le niveau suit la structure de la page qui accueille la collection, la taille reste `title_size` (règle "niveau ≠ taille", cf. content/md/foundations/TYPOGRAPHY-UX.md).
- Focus visible sur la carte cliquable/sélectionnable : `focus_ring` (rôles `control.focus-*`, focus v2), jamais supprimé.
- État sélectionné : `selected_border` (`color.primary`) **plus** un indicateur non chromatique (coche), et l'état exposé techniquement (`aria-pressed` ou input `checkbox`/`radio` réel selon le cas).
- Cibles internes (icônes d'action) : zone tactile minimum 44px, comme partout.
- Ordre DOM = ordre visuel : media avant header avant corps — pas de réordonnancement purement CSS qui désynchroniserait la lecture d'écran.

## Chevron du mode expandable

- Chevron en `expand_chevron` (`color.text-secondary`, ≥ 4.5:1 sur le fond de carte), toujours visible au repos — c'est lui qui distingue une carte expandable d'une carte static avant toute interaction.
- État déplié : rotation `expand_chevron_rotation` (180°) du même glyphe — l'orientation porte l'état, pas un changement d'icône (et l'état est exposé techniquement via `aria-expanded`).
- `prefers-reduced-motion: reduce` (cf. `MOTION-UI.md`) : le chevron **saute** à son orientation finale (pas de transition de rotation) et le contenu déplié apparaît en **crossfade instantané** au lieu de glisser — rotation/hauteur animée supprimées, `opacity` conservée ; l'état (`aria-expanded`) et le contenu restent intacts, seul le déplacement spatial disparaît.
- Position : coin du header, constante dans toute la collection — comme les actions d'objet.
- Zone tactile du chevron : `min_touch_target` quand le chevron est le seul déclencheur (carte à contenu interactif, cf. CARD-UX.md).

## Skeleton (chargement)

- Reprend exactement les dimensions de la carte réelle : bloc `media_ratio` + lignes de texte en `skeleton_background` (`color.surface`).
- `aria-hidden="true"` sur les squelettes + annonce de chargement au niveau de la collection (`aria-busy="true"`) — un lecteur d'écran n'a pas à parcourir des blocs vides.
- `skeleton_pulse` (boucle lente d'opacité) : comme indicateur de chargement, il bénéficie de l'**exemption WCAG 2.2.2** (le seuil des 5 s de mouvement automatique arrêtable ne s'applique pas aux indicateurs de chargement) ; le système applique néanmoins un **sur-respect interne** — sous `prefers-reduced-motion` le pulse est coupé *quand même* et le squelette reste visible statique, l'attente demeure signalée sans mouvement (cf. `MOTION-UI.md`).

## Adaptation au conteneur

- La **grille de collection** décide de son nombre de colonnes ; la Card décide de sa disposition
  interne selon la largeur qu'elle reçoit. Ces deux autorités ne sont pas mélangées.
- La Card utilise des états `compact`, `regular`, `expanded`. Les seuils viennent du moment où media,
  texte et actions cessent de tenir, pas de `breakpoint.mobile`.
- Compact peut empiler les slots ou réduire les métadonnées secondaires ; expanded peut placer le
  media à côté du contenu. Le mode d'interaction, la destination, le titre et les informations
  nécessaires à la décision restent identiques.
- Le survol n'existant pas sur tactile, aucune action ne dépend de `:hover` pour apparaître. Les Media
  Queries de capacité renforcent le feedback ; elles ne pilotent pas la disposition interne.

## Sources et niveau de confiance (couche UI)

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| T1 | Lien étendu par pseudo-élément + actions en siblings DOM | [Livefront](https://livefront.com/writing/accessibility-dos-and-donts-for-interactive-cards/), recoupé par la littérature accessibilité (Piccalilli, Berkeley DAP) | Établi — technique convergente entre sources indépendantes |
| T2 | Balisage liste pour les collections de cartes | [Livefront](https://livefront.com/writing/accessibility-dos-and-donts-for-interactive-cards/), WAI/WCAG | Établi |
| T3 | Zone tactile minimum 44px | WCAG / Apple HIG / Material Design | Établi, standard de l'industrie (seule valeur brute autorisée ici) |
| T4 | Ratio minimum 2:1 et espacement par tokens entre sections | [IBM Carbon — Tile usage](https://carbondesignsystem.com/components/tile/usage/) | Établi chez Carbon ; le choix 16/9 par défaut est une décision de ce design system, pas un standard |
| T5 | Padding de carte sur le token d'espacement standard (space-400 ≈ spacing.md) | [Shopify Polaris — Card layout](https://polaris-react.shopify.com/patterns/card-layout) | Établi chez Polaris, transposé à notre grille (spacing.base) |
| T6 | Élévation au survol comme signal d'affordance des cartes cliquables | Convention Material/MUI, observation production | Établi par convergence, non académique |
| T7 | Chevron/dépliage sous reduced-motion : chevron qui saute, crossfade, opacité conservée | `MOTION-UI.md`, WCAG 2.3.3 | Établi — rattachement interne nommé |
| T8 | `skeleton_pulse` : exemption WCAG 2.2.2 (indicateur de chargement) + coupé quand même sous reduced-motion | `MOTION-UI.md`, [WCAG 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html) | Établi — standard + sur-respect interne assumé |
| T9 | Le seuil de conformité courant pour une cible de pointage est 24 × 24 px CSS (niveau AA) ; le 44 px déclaré « standard externe non négociable » dans le frontmatter de CARD-UI.md est plus strict que la norme AA et relève d'un sur-respect interne, pas d'une obligation de conformité | [WCAG 2.2 — 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) | Normatif — correction de qualification : min_touch_target: 44px est un choix plus exigeant que le standard invoqué, à documenter comme tel |
