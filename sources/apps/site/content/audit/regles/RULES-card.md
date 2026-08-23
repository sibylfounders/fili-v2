---
sujet: card
type: composant
resume: "Conteneur de collection : mode d'interaction × densité, slots, skeleton, empty state — la sémantique appartient au contenu, pas au conteneur"
requires: ["interaction", "adaptive"]
selon-contexte: ["button (si la carte porte des actions)", "link (si la carte navigue vers un détail)", "elevation (survol raised des cartes cliquables)", "motion (feedback/continuité, reduced-motion chevron, skeleton)", "voice (empty state, ton vide/démarrage)", "emotion (sans objet — surface calme, budget de rareté)"]
---
# RULES — Card (compilé, condensé)

> Généré depuis `components/card/CARD-UX.md` (v1.3.0) et `CARD-UI.md` (v1.4.0). Règles condensées pour le build — la source fait autorité. Ne pas éditer à la main. Tokens : `dist/tokens.yaml`.

## Axes
- Deux axes : **interaction_mode** (static/clickable/selectable/expandable) × **density** (comfortable/compact).
- **Pas d'axe style** : la carte vit en collection, hiérarchie volontairement absente. Le style de conteneur (outlined/elevated) est une décision produit unique, pas un choix par instance.
- **Pas de tone** : la sémantique appartient au *contenu* (badge de statut, texte), jamais au conteneur. Une carte "d'erreur" = un alert, pas une variante de carte. L'état "sélectionné" est un état d'interaction, pas un tone.
- **Pas de size** : hauteur dictée par le contenu, largeur par la grille. Seule la densité module le padding.
- Media, titre, nombre d'actions = des *slots* optionnels (media/header/corps/actions), pas des axes.

## Usage
- Utiliser pour parcourir du contenu hétérogène où chaque item se suffit : dashboard, flux, catalogue où l'image décide.
- **Pas pour comparer/rechercher des items homogènes** → liste ou table (les cartes dégradent la scannabilité — le réflexe "cartes = plus moderne" est une erreur documentée NN/g). CONFIANCE : établi.
- Cas limite (résultats de recherche produits) : mode de lecture dominant — découverte → carte ; évaluation comparative → liste/table ; sinon proposer les deux.

## Partage d'autorité
- Nombre et position des actions dans une carte : ce fichier fait autorité. Emphasis/tone/taille des boutons internes : RULES-button.
- Zone tactile des boutons en grille dense : RULES-button.

## Modes d'interaction
- **Static** : la carte n'est pas une cible ; les interactifs vivent à l'intérieur. Seul mode acceptant librement plusieurs interactifs internes. Jamais de style suggérant la cliquabilité (ombre au survol, cursor pointer) sur une statique.
- **Clickable** : toute la surface = une seule cible (navigation vers le détail, loi de Fitts).
  - **Règle absolue : aucun élément interactif imbriqué** (tabulation incohérente, lecteur d'écran imprévisible = exclusion). CONFIANCE : établi.
  - Cliquabilité par vrai lien/bouton sémantique étendu à la surface — jamais `div` + onclick.
  - Si actions internes indispensables : siblings dans le DOM, cibles dédiées, décision consciente.
- **Selectable** : le clic sélectionne, ne navigue pas. État sélectionné signalé par plus que la couleur (bordure + coche). Distinguer "sélectionné" de "survolé". Groupe homogène : même mode (single/multi), même structure.
- **Expandable** : révéler du contenu *secondaire* sans quitter le contexte — jamais du contenu essentiel à la décision. Si contenu interactif : seul le chevron déclenche ; sinon toute la surface peut.
- **Règle de groupe : jamais de modes mélangés dans une même collection.**
- Le mode se reconnaît au repos. Le hover confirme une cible ; il ne révèle pas après coup qu'elle
  était interactive.

## Densité
- comfortable = défaut ; compact = contextes denses (panneaux, forts volumes, widgets).
- La densité module padding et écarts, jamais la structure ni l'ordre des slots. Une collection = une seule densité.

## Composition (slots)
- Ordre canonique : **media → header → corps → actions**. Slots optionnels, ordre jamais réinventé par carte.
- **Media** : identifier, pas décorer. Ratio unique et fixe pour toute la collection. Media manquant = cas normal : remplacement délibéré (fond + icône/initiales). Alt obligatoire si informative, `alt=""` explicite si décorative.
- **Header** : titre = vrai titre sémantique, même niveau sur toute la collection. Pas de titre-seul-lien sur une carte "presque cliquable" — choix franc entre clickable et statique.
- **Corps** : juste assez pour décider d'entrer ou passer. Texte tronqué à nombre de lignes constant (l'alignement de la collection prime). Badge de statut = la sémantique vit ici, jamais sur le conteneur.
- **Actions** : une seule action principale par carte ; secondaires en icônes discrètes ou menu de débordement, jamais en boutons texte concurrents. Position constante (footer, ou coin de header pour les actions d'objet). **Jamais d'actions visibles uniquement au survol** (inaccessible tactile) — un menu de débordement toujours visible vaut mieux.

## Empty state
- Collection vide : état structuré — image facultative, titre court positif, pourquoi c'est vide, action de sortie. Wording par cas : première utilisation ≠ sans résultat ≠ erreur. Jamais d'écran blanc silencieux (vide = bug pour l'utilisateur).
- Carte incomplète (pas d'image…) : pas un empty state — données incomplètes traitées slot par slot.

## États
- Hover : cliquable uniquement — élévation ou bordure renforcée. Une statique ne réagit pas (le hover EST le signal de cliquabilité, il ne ment pas).
- Focus ring obligatoire sur la carte entière (clickable/selectable), jamais supprimé.
- Loading : skeletons reproduisant la structure et les dimensions réelles, pas de spinner global.

## Contextes
- **Grille** (référence) : largeurs uniformes, hauteurs alignées par rangée, slots à position identique partout.
- **Liste verticale** : lecture séquentielle — disposition horizontale possible (media à gauche). Si items homogènes comparés : reposer la question "simple liste ?".
- **Dashboard** : carte-KPI = statique sauf si elle navigue (alors clickable, toutes les règles du mode). Hiérarchie par la taille dans la grille, pas par un axe de style.
- **Carrousel** : signaler le débordement (carte partiellement visible en bord).
- **Kanban / déplaçable** : tout déplacement offert au glisser-déposer a une **alternative à pointeur unique** (bouton/menu « Déplacer vers… »), annoncée au lecteur d'écran (WCAG 2.5.7) — le drag n'est jamais le seul chemin. Le reste (affordance de saisie, réordonnancement fin) → futur pattern collection.

## Risque
| Cas | Risque | Sévérité |
|---|---|---|
| Interactifs imbriqués dans une clickable | Exclusion clavier/lecteur d'écran | Critique |
| div + onclick | Invisible aux technologies d'assistance | Critique |
| Actions hover-only | Inaccessible tactile | Élevée |
| Déplacement au glisser-déposer sans alternative | Exclusion clavier/motricité (2.5.7) | Élevée |
| Sélection par couleur seule | Exclusion daltonisme | Élevée |
| Cartes pour items homogènes à comparer | Comparaison difficile, abandon | Moyenne |
| Collection vide sans empty state | Vide = bug, abandon silencieux | Moyenne |
| Style cliquable sur statique (ou inverse) | Affordance mensongère | Moyenne |
| Ratio d'image variable | Grille cassée | Faible-moyenne |

## Règle transversale
- **L'interactivité d'une carte est univoque : soit la carte est la cible, soit elle contient des cibles — jamais d'ambiguïté.**

## Application des Languages
- **Interaction** : la Card statique incarne l'intention **consulter** (`INTERACTION-UX`, « lire une information organisée ») — elle organise sans se donner pour une cible et passe le **Test de reconnaissance** (en gris et sans hover, distincte d'une cliquable).
- **Motion** : le hover d'une cliquable = **feedback** (`motion.fast`) ; rotation du chevron et dépliage expandable = **continuité** (`motion.base`) — `MOTION-UX`. Sous `prefers-reduced-motion`, le chevron **saute** et le contenu apparaît en **crossfade** (l'info ouvert/fermé reste) ; le skeleton_pulse est coupé quand même (squelette statique).
- **Voice** : l'empty state applique `VOICE-UX` § « Le ton suit l'utilisateur » ligne **Vide / démarrage** — distinguer « rien encore » de « rien trouvé » ; sur l'erreur, **ne jamais blâmer** ; badges de statut = **un concept = un mot** (lexique constant).
- **E-motion** : **sans objet — surface calme** (arbitrage). Composant-collection : le **budget de rareté** disqualifie ce qui se répète par carte ; le moment « vide/attente qui a une personnalité » s'incarne dans le **contenu injecté** (Toast), jamais dans le conteneur ; empty state d'erreur et « sans résultat » restent strictement productifs.

---

## Règles techniques (UI)

```yaml
containment: # décision produit : outlined par défaut, elevated réservé au hover des cliquables
  outlined: { background: color.background, border: color.border, radius: radius.lg, shadow: elevation.none }
  elevated: { background: color.background, radius: radius.lg, shadow: elevation.raised }
density:
  comfortable: { padding: spacing.md, slot_gap: spacing.sm }
  compact: { padding: spacing.sm, slot_gap: spacing.xs }
media: { ratio: media_ratio.landscape, fallback_background: color.surface, fallback_icon: color.text-muted }
collection: { grid_gap: spacing.md }
typography: { title_size: typography.headings.h4, body_font: typography.body, fallback: typography.fallback.sans }
states:
  hover_shadow: elevation.raised # cliquables uniquement
  focus_ring: color.accent
  selected_border: color.primary
  skeleton_background: color.surface
  expand_chevron: color.text-secondary
  expand_chevron_rotation: "180deg"
min_touch_target: 44px # cibles internes
```

### Conteneur
- Outlined par défaut ; l'élévation est le signal d'affordance au hover des cliquables — jamais l'état de repos de toutes les cartes.
- Fond de zone de collection `color.surface` ≠ fond des cartes `color.background`.

### Media
- `media_ratio.landscape` (16/9) par défaut, `square` pour avatar/produit centré. `aspect-ratio` CSS + `object-fit: cover`, jamais de hauteur px fixe.
- Fallback : bloc de même ratio, fond surface, icône/initiales muted — la grille ne voit pas la différence. `loading="lazy"` en collection longue.

### Clickable — implémentation
- Lien étendu par pseudo-élément (`.card__title-link::after { position:absolute; inset:0 }`), le lien porte le titre (c'est lui qu'annonce le lecteur d'écran).
- Actions secondaires : siblings DOM (jamais dans le lien), repositionnées via z-index — chaque cible distincte au clavier. La cardinalité UX s'applique d'abord.

### Accessibilité
- Collection = balisage liste (`ul/li` ou `role="list"`).
- Titre = vrai heading (h2…h4), même niveau sur la collection ; le NIVEAU suit la structure de la page, la TAILLE reste `title_size` (règle "niveau ≠ taille").
- Sélection : `selected_border` + indicateur non chromatique + état technique (`aria-pressed` ou input réel).
- Ordre DOM = ordre visuel (pas de réordonnancement CSS).
- Chevron expandable : toujours visible au repos (distingue expandable de static), rotation 180° à l'état déplié + `aria-expanded`, coin du header, 44px si seul déclencheur.
- Skeleton : `aria-hidden="true"` + `aria-busy="true"` sur la collection.

### Adaptation au conteneur
- La grille de collection décide de ses colonnes ; la Card décide de sa disposition interne selon
  l'espace reçu.
- États `compact` / `regular` / `expanded`, seuils dérivés du contenu, pas de
  `breakpoint.mobile`.
- Disposition, densité et métadonnées secondaires peuvent évoluer. Mode d'interaction, destination,
  titre et informations nécessaires à la décision restent identiques.
- Jamais de `:hover` comme seul déclencheur d'affichage.
