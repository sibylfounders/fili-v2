---
component: button
layer: ui
version: 1.9.0 # 1.9.0 : les six états nommés par INTERACTION-R13 sont enfin outillés — BUTTON-U02 sort l'ACTIVE du registre optionnel [data-relief] (une propriété universelle ne peut pas dépendre d'un réglage débrayable) et le pose en identité TACTILE partagée (.ds-pressable), sans un seul token de couleur nouveau ; BUTTON-U03 remplace l'`opacity: .5` de l'état INDISPONIBLE par un couple de rôles ENCADRÉ (surface-disabled / on-surface-disabled, 1,8:1 ≤ r ≤ 4,5:1 dans validate-contrast) ; la fenêtre de motion des états cesse d'être opaque (hover/focus/active = motion.fast = 100 ms, une seule déclaration). Cf. DECISIONS.md 2026-07-31. 1.8.0 : focus v2 — l'anneau garde la géométrie unique de BORDER mais sa couleur devient un cran SUBTIL ACCORDÉ AU TONE (control.focus-*, défaut primary éclairci) ; remplace l'essai accent de la 1.7.0 (arbitrage Aurélien 2026-07-29 après-midi, cf. DECISIONS.md). 1.7.0 : 1.7.0 : (a) axe `style` renommé `variant` (Fili Component Contract 1.0.0 — `style` masquait l'attribut DOM React ; alias déprécié conservé dans @fili/react jusqu'à la prochaine majeure) ; (b) RETRAIT du tone warning (arbitrage 2026-07-29 — l'avertissement est un message, la famille chromatique warning reste aux messages/statuts) ; (c) focus ring : retour à l'anneau UNIQUE color.accent de la fondation BORDER via les rôles control.focus-* — abroge l'anneau « accordé au ton » (1.4.1), résout la contradiction croisée avec BORDER-UI ; (d) le contraste des couples est couvert par validate-contrast.mjs (test-rendu.js jamais porté — trou documenté). Cf. DECISIONS.md 2026-07-29. 1.6.2 : chemins repointés vers `content/md/` — fin de la migration vers le monorepo Sibyl DS (2026-07-27) ; aucune règle, aucun token, aucune source modifiés. 1.6.1 : note de frontière (pivot 2026-07-21) — ce fichier est l'implémentation de référence, jamais un critère d'audit d'une interface tierce. 1.6.0 : Instrument E-motion (SubmitButton, gabarit) + un événement un porteur ; rattachement nommé Motion/Voice ; repli reduced-motion spinner. 1.5.1 : résilience des libellés longs — repli intrinsèque, hauteur minimale et absence de troncature. 1.5.0 : adoption d'INTERACTION-UI et ADAPTIVE-UI.
last_updated: 2026-07-29
companion: BUTTON-UX.md
tokens:
  sizing:
    # Valeurs indicatives, non contraignantes — la grille de base et l'échelle vivent dans DESIGN.md (spacing.*, scale.*).
    # À recalibrer sur l'échelle d'espacement réelle du produit qui adopte ce fichier.
    sm: { height: scale.compact, padding_x: spacing.sm, padding_y: spacing.xs, radius: radius.sm }
    md: { height: scale.base, padding_x: spacing.md, padding_y: spacing.sm, radius: radius.md }
    lg: { height: scale.expanded, padding_x: spacing.lg, padding_y: spacing.md, radius: radius.md }
    # Relation attendue entre les trois : sm < md < lg, ratio approximatif observé ailleurs ~1.2-1.25x d'un cran à l'autre
  content_spacing:
    text_only: padding_x standard (cf. sizing)
    icon_only: padding égal horizontal/vertical, proche d'un carré — pas le padding_x standard
    icon_and_text: spacing.xs à spacing.sm entre icône et texte, inférieur au padding externe du bouton
  label_typography: # ajouté en 1.2.1 — le style du label était déduit silencieusement (cf. content/md/foundations/TYPOGRAPHY-UI.md)
    family: typography.body.fontFamily
    fallback: typography.fallback.sans
    size: typography.body.fontSize
    weight: typography.display.fontWeight # la graisse de titre (500) sert de graisse de label — un label est court et doit se détacher de son contexte
  min_touch_target: 44px
  icon: # ajouté en 1.3.0 — relié à la fondation (foundations/iconography/)
    size: icon.md # icon.lg en icon-only lg — jamais de taille libre (cf. ICONOGRAPHY-UI.md)
  motion: # ajouté en 1.3.0 — relié au langage (languages/motion/)
    # 1.9.0 : les trois états de feedback partagent la MÊME fenêtre — ils ne peuvent pas se
    # désynchroniser, et le token cesse d'être opaque : motion.fast VAUT 100 ms, à l'intérieur
    # du seuil de perception d'instantanéité que LAWS-R29 (Doherty) fixe à 100 ms.
    hover: { duration: motion.fast, easing: motion.ease-out }
    focus: { duration: motion.fast, easing: motion.ease-out }
    active: { duration: motion.fast, easing: motion.ease-out }
    spinner: rotation continue linéaire — seule exception au bannissement du linéaire (cf. MOTION-UI.md)
  focus_ring_style: # ajouté en 1.3.0 — la couleur existait (colors.focus_ring), largeur et écart étaient déduits (cf. BORDER-UI.md)
    width: border.focus-width
    offset: border.focus-offset
  axes:
    variant: [filled, stroke, lighter, ghost] # nom canonique depuis 1.7.0 (Contract) ; `style` reste un alias déprécié dans @fili/react
    tone: [primary, neutral, destructive] # warning RETIRÉ (2026-07-29) — l'avertissement est un message (Alert), pas une action
    size: [sm, md, lg]
  # Un tone = une couleur sémantique déclinée sur ses 4 rôles de rendu.
  #   solid / on_solid / solid_hover  → style FILLED (aplat + texte on-color + hover assombri)
  #   fg (+ border)                   → style STROKE (texte/bordure colorés sur fond de page)
  #   subtle / on_subtle / subtle_hover → style LIGHTER (fond teinté doux + texte de tone)
  #   fg (fg_ghost pour neutral)      → style GHOST (texte coloré, fond au hover = subtle)
  # STROKE et GHOST font apparaître `subtle` au hover ; FILLED et LIGHTER assombrissent leur fond.
  tones:
    primary:
      solid: color.primary
      on_solid: color.on-primary
      solid_hover: color.primary-hover
      fg: color.primary
      border: color.primary
      subtle: color.secondary
      on_subtle: color.on-secondary
      subtle_hover: color.secondary-hover
    neutral:
      solid: color.neutral-strong
      on_solid: color.on-primary
      solid_hover: color.neutral-strong-hover
      fg: color.text-primary
      fg_ghost: color.text-secondary
      border: color.border-strong
      subtle: color.surface
      on_subtle: color.text-primary
      subtle_hover: color.surface-hover
    destructive:
      solid: color.danger
      on_solid: color.on-primary
      solid_hover: color.danger-hover
      fg: color.danger
      border: color.danger
      subtle: color.danger-subtle
      on_subtle: color.danger
      subtle_hover: color.danger-subtle-hover
  # Anneau de focus v2 (1.8.0, arbitrage 2026-07-29 après-midi) : géométrie UNIQUE de la
  # fondation BORDER (focus_ring_style, outline extérieur, :focus-visible via .ds-focus-ring),
  # couleur SUBTILE ACCORDÉE AU TONE en crans tokenisés — primary → control.focus-primary
  # (défaut), neutral → control.focus-neutral, destructive → control.focus-danger.
  # Remplace l'essai `color.accent` du matin ; diffère du per-tone historique (1.4.1) par
  # la teinte subtile « à la Tailwind » et par des CRANS TOKENISÉS (zéro déduction locale).
  focus_ring: control.focus-<tone> (défaut control.focus-primary — lib/focus.css, .ds-focus-ring)
  states: [default, hover, focus, active, disabled, loading]
confidence: mixed
---

# Bouton — Couche UI

> **Frontière (pivot 2026-07-21)** : ce fichier est l'**implémentation de référence** — ses tokens, tailles et ratios décrivent *ce* système, jamais des critères d'audit d'une interface tierce. En audit d'hôte, l'universel vit dans BUTTON-UX (usage, hiérarchie, états, wording) et dans les planchers externes (cible tactile au plancher WCAG 2.5.8 ; le 44px est le confort renforcé maison).

> Ce fichier contient tout ce qui est spécifique à une identité visuelle : tokens, tailles, contrastes, contraintes techniques d'implémentation. Il change à chaque refonte de marque ou de grille. Pour le raisonnement (quand utiliser quoi, pourquoi, quel wording, quel risque), voir `BUTTON-UX.md` — ce dernier reste stable même si cette couche change complètement.

## Les 3 axes, en bref
Ce composant se décrit sur 3 axes indépendants, combinables librement (le raisonnement derrière chacun est dans BUTTON-UX.md) :
- **Variant** (ex-`style`, renommé 1.7.0 — Fili Component Contract) : filled, stroke, lighter, ghost — le **remplissage** (comment le bouton occupe la surface), du plus appuyé au plus discret
- **Tone** : primary, neutral, destructive — la **couleur sémantique** (ce que l'action signifie) ; warning retiré (2026-07-29)
- **Size** : sm, md, lg — densité du contexte

Variant et tone sont **pleinement orthogonaux** : les 4 × 3 = 12 combinaisons colorées existent toutes et résolvent chacune un token explicite. C'est le changement clé de la 1.4.0 — avant, `emphasis` mélangeait remplissage (primary = plein) et rang (secondary/ghost), et `tone` n'avait que neutral/destructive/warning. Désormais primary et neutral sont des **tones** (une couleur bleue de marque, une couleur neutre « noire ») que chaque style habille différemment. (Raisonnement complet du renommage : BUTTON-UX.md et DECISIONS.md 2026-07-18.)

## Mapping style × tone
Chaque tone (bloc `tones.<tone>` de l'en-tête) fournit ses déclinaisons ; le style choisit lesquelles s'appliquent :

| Style | Fond au repos | Texte / icône | Bordure | Fond au hover |
|---|---|---|---|---|
| **filled** | `solid` (aplat plein) | `on_solid` (blanc/on-color) | — | `solid_hover` (assombri d'un cran) |
| **stroke** | fond de page | `fg` (couleur du tone) | `border` (= `fg`, sauf neutral = `border-strong`) | `subtle` (le fond teinté apparaît) |
| **lighter** | `subtle` (fond teinté doux) | `on_subtle` (couleur du tone lisible sur `subtle`) | — | `subtle_hover` (teinte soutenue d'un cran) |
| **ghost** | fond de page | `fg` (neutral : `fg_ghost`, plus discret) | — | `subtle` (le fond teinté apparaît) |

Deux régimes de hover, comme avant mais généralisés à tous les tones : **filled et lighter** *assombrissent* leur fond existant (`solid_hover` / `subtle_hover`) ; **stroke et ghost** n'ont pas de fond au repos, le hover en *fait apparaître* un (`subtle`).

Règle générale qui en découle : **tout tone fournit d'emblée les quatre déclinaisons** — `solid`/`on_solid`/`solid_hover` (filled), `fg`/`border` (stroke), `subtle`/`on_subtle`/`subtle_hover` (lighter). Un tone qui n'en fournirait qu'une partie ne peut pas porter les 4 styles ; le build le refuse (token manquant). C'est la même séparation fond/premier-plan que pratiquent les systèmes majeurs (Carbon, Polaris), portée ici à une grille complète.

**Le tone warning est retiré (2026-07-29).** Son histoire : réputé « jamais un fond plein » jusqu'en 1.20.0, doté d'un solid à 7.09:1 par DESIGN.md 1.21.0 — mais le composant ne l'a jamais implémenté, avec un rationale que l'arbitrage du 2026-07-29 a confirmé : l'avertissement est un **message** (Alert, Badge), jamais une action, et un stroke warning se confond avec une alerte. La famille chromatique `warning` reste entière côté tokens pour ses vrais consommateurs (Alert, Toast, Input status).

## États — tokens hover
Le hover est "le principal signal d'affordance sur desktop" (BUTTON-UX.md). Les 12 couples texte/fond au repos ET au hover restent ≥ 4.5:1 — couverts par le contrôle de contraste de la chaîne tokens (`validate-contrast.mjs`, 72 paires clair+sombre ; la paire la plus tendue, `lighter` + destructive au hover, tient à 4.60:1 grâce au `danger-subtle-hover` calibré). Le script `tools/test-rendu.js` cité par les versions antérieures n'a jamais été porté au monorepo — trou ouvert de l'étape 7, journalisé. `loading` reste un comportement et non une couleur (le label devient un indicateur, cf. BUTTON-UX.md). `active` et `disabled`, eux, ont cessé d'être une dette en 1.9.0 — mais aucun des deux n'a coûté un token de couleur : l'un est une géométrie, l'autre un couple de rôles neutres qui existait déjà en creux. Les deux règles ci-dessous les fixent.

RÈGLE [BUTTON-U02] : l'état d'activation est une identité TACTILE, partagée, et indépendante du registre de relief.
STATUT : implémentation de référence
SOURCE : interne (INTERACTION-R13, INTERACTION-R14)
ÉNONCÉ : L'état d'activation du bouton se signale par une course géométrique brève — un enfoncement et une réduction d'échelle — portée par une couche partagée, jamais par un token de couleur supplémentaire ni par un mécanisme propre au composant ; il reste perceptible quel que soit le registre de relief, actif ou débrayé.
MESURE : l'état pressé produit une transformation géométrique mesurable lorsque le registre de relief est débrayé, et aucun composant ne définit sa propre course d'activation en dehors de la couche partagée

Ce que la règle corrige : l'active existait, mais **uniquement sous `[data-relief]`** — couleur enfoncée, ombre interne et 0,5 px de course vivaient tous dans `relief.css`. Relief débrayé depuis le panneau Theming, le bouton n'accusait plus réception du clic. Or `INTERACTION-R13` est une *propriété universelle* : elle ne peut pas être suspendue par un réglage. La couche partagée (`lib/interaction.css`, `.ds-pressable`) porte donc le **minimum indépendant du registre** — `translateY(0.5px) scale(0.98)` ; le relief garde ce qui lui est propre, la couleur enfoncée et l'ombre, et **l'enrichit** au lieu de le créer.

Pourquoi une géométrie et pas une couleur : `INTERACTION-R14` parle d'une « sensation de pression ». Un cran chromatique par tone aurait ajouté trois valeurs × quatre styles à une grille qui en porte déjà huit, pour dire ce qu'un déplacement de 0,5 px dit sans ambiguïté. Aucun rôle n'est né pour cet état.

`prefers-reduced-motion` — lecture explicite : c'est la **transition** qui tombe (`transition-duration: 0s`), pas l'état. Un changement de géométrie instantané n'est pas du mouvement vestibulaire, et supprimer la course rendrait l'active silencieux précisément pour les utilisateurs qui en ont le plus besoin. `INTERACTION-R14` subordonne l'identité tactile à la préférence de mouvement : elle est ici *dépouillée de son animation*, pas abolie.

Dérogation nommée — `amplitude-de-geste` : `DeleteButton` presse à `0.95` et non `0.98`. Sa pression n'est pas un accusé de réception mais un **geste de confirmation maintenu** ; l'amplitude fait partie du message. Écart tracé, pas arbitraire.

RÈGLE [BUTTON-U03] : l'état indisponible est UN état tokenisé, jamais une opacité composite.
STATUT : implémentation de référence
SOURCE : interne (INTERACTION-R13, BUTTON-R80)
ÉNONCÉ : L'indisponibilité se rend par un couple de rôles nommés — un remplissage inerte et un texte inerte — dont le contraste est encadré par la chaîne de tokens ; aucune opacité globale n'est appliquée au contrôle, et aucun signal d'interactivité (relief, survol, pression) ne subsiste sur un contrôle indisponible.
MESURE : aucun composant du kit n'applique d'opacité à l'état indisponible ; le couple texte/fond de cet état est fait de deux tokens et son ratio est encadré entre 1,8:1 et 4,5:1 en clair comme en sombre

Ce que la règle corrige, et c'était double. (1) `opacity: .5` était une **valeur en dur**, ce que le § Implémentation de ce fichier interdit explicitement — et son intensité *variait* : 2,29:1 pour un filled posé sur la page, 2,34:1 pour le même posé sur une carte, 3,38:1 pour un ghost. « Disabled » n'était pas un état, c'en était douze, dont aucun n'était vérifiable par une chaîne qui raisonne sur des **paires** de tokens. (2) Plus grave : `relief.css` ne portait aucune garde `:disabled`. Sous le registre actif — le défaut — un bouton indisponible gardait son ombre d'objet posé, s'éclaircissait au survol et s'enfonçait au clic. Il *mentait* sur sa disponibilité, ce qui est l'exact envers de `BUTTON-R80`.

L'encadrement plutôt qu'un plancher : c'est le seul couple du système dont le ratio doit rester **sous** un plafond. Au-dessus de 4,5:1 l'indisponible se confondrait avec un contrôle actif (`INTERACTION-R13` exige des états distincts) ; sous 1,8:1 il deviendrait le disabled silencieux que `BUTTON-R80` proscrit. `validate-contrast.mjs` vérifie donc les deux bornes, sur les trois fonds où l'état se pose (remplissage inerte, page, surface) : 2,05 / 2,54 / 2,31 en clair, 2,13 / 4,16 / 3,04 en sombre. WCAG 1.4.3 exempte les contrôles indisponibles du seuil texte — l'inertie *est* le signal, elle n'est pas un défaut de contraste.

Les rôles ne font pas grandir la rampe : `surface-disabled` et `on-surface-disabled` reprennent des crans existants (`neutral.200/700`, `neutral.400/500`) sous un nom d'**intention**, exactement comme `neutral` est un alias de `surface-inverse`. Un style sans remplissage au repos n'en gagne pas un en devenant inerte : `stroke` garde sa limite, `ghost` reste transparent, tous deux se lisent sur le texte — même arbitrage que Material, Carbon et Polaris.

Portée au-delà du bouton : la règle est écrite ici parce que le bouton est le composant qui la produisait le plus, mais elle vaut pour le kit. `CompactButton`, `Switch`, `Select` et la marque de la famille du choix consommaient la même opacité en dur et consomment désormais la même couche.

## Motion — hover et repli du spinner

Les tokens de mouvement du Button vivent dans l'en-tête (clés `hover`, `spinner` du bloc `motion:`) ; le
raisonnement est dans `BUTTON-UX.md` § Application du langage de motion. Cette section en fixe la
technique et le repli, en héritage direct de `MOTION-UI.md`.

- **Hover** : `motion.fast` / `motion.ease-out` (cf. `MOTION-UI.md`, ligne « Bouton »). Transition CSS
  de préférence aux keyframes — réversible nativement depuis l'état courant (un re-hover pendant la
  sortie inverse la transition sans saut).
- **Spinner du `loading`** : `transform: rotate` en rotation continue **linéaire** — seule exception au
  bannissement du linéaire (`MOTION-UI.md`). Les keyframes sont réservées à cette boucle.
- **Repli `prefers-reduced-motion` du spinner** : la rotation s'arrête ; l'indicateur de chargement
  reste présent sous forme **statique** ou en **pulse d'opacité douce** (jamais un flash), en miroir
  exact de `MOTION-UI.md` (« spinner remplacé par un indicateur statique ou un pulse d'opacité »). Un
  bloc média global porte cette bascule ; le composant ne la redéclare pas. L'information « en cours »
  ne dépend jamais de la rotation — elle reste portée par l'ARIA et par le label devenu indicateur.

## Instrument E-motion — implémentation (SubmitButton)

Le Button est le gabarit d'E-motion (raisonnement : `BUTTON-UX.md` § Instrument E-motion — le moment
d'envoi). Cette couche **hérite le gabarit sans le redéfinir** — la source d'autorité reste
`EMOTION-UI.md`.

- **Anatomie en trois actes** (anticipation → acte → résolution), reprise telle quelle de
  `EMOTION-UI.md` § Anatomie ; le SubmitButton n'invente aucun temps.
- **Glyphe dessiné** : l'avion, sa traînée et le glyphe de succès se **dessinent** en `stroke-dashoffset`
  (de plein à zéro) sur un `path` SVG — jamais un déplacement de layout ; `transform`/`opacity`
  uniquement pour le pliage et le vol.
- **Plafond de durée** : la somme des trois actes ne dépasse **jamais** `motion.celebration` (le plafond
  dur d'`EMOTION-UI.md`) ; au-delà, la fête est perçue comme un blocage.
- **Repli `prefers-reduced-motion`, par acte** (hérité d'`EMOTION-UI.md`) : actes 1 et 2 supprimés (pas
  de vol, pas de pliage, pas de traînée, pas de spring), acte 3 conservé en bascule instantanée — le
  bouton affiche **directement l'icône pleine** et « Envoyé ✓ ». Le fait reste, la fête est retirée,
  sans perte.
- **Un événement, un porteur** : si l'envoi délègue sa confirmation à un toast success injecté, le Button
  ne joue pas la séquence (il reste un contrôle `loading` → statique productif) — cf. `BUTTON-UX.md`
  § Instrument E-motion.

La compatibilité (façon caniuse) et le budget de poids de ce moment signature suivent `EMOTION-UI.md`
§ Compatibilité & poids — repli **statique fonctionnel** garanti tout en bas de l'échelle.

## Tailles — valeurs techniques
- **sm** : `scale.compact`, radius légèrement réduit pour rester proportionné.
- **md** : `scale.base`, taille par défaut.
- **lg** : `scale.expanded`, même radius que md — l'agrandir proportionnellement donnerait un effet pilule non désiré.

**Aucune valeur px absolue n'est fixée ici volontairement** — ce gabarit ne définit pas de grille de base. La seule garantie est la relation relative (sm < md < lg, ratio ~1.2-1.25x observé ailleurs dans l'industrie). À mapper sur l'échelle d'espacement réelle du produit qui adopte ce fichier.

**Espacement selon le contenu** (texte seul / icône seule / icône + texte) : voir `content_spacing` dans l'en-tête — l'icône seule prend un padding proche du carré, l'icône + texte a un gap interne (`spacing.xs` à `spacing.sm`) plus resserré que le padding externe.

**Règle de cohérence dans un groupe** : ne jamais mélanger les tailles au sein d'un même groupe de boutons — un groupe partage toujours la même taille, même si les emphasis diffèrent.

## Accessibilité — spécifications techniques
- Contraste minimum 3:1 sur tous les états visibles
- Focus visible obligatoire, jamais supprimé sans remplacement équivalent. **Géométrie unique de la fondation BORDER** (outline, `border.focus-width`/`border.focus-offset`, `:focus-visible`, défini une fois — `lib/focus.css`), **couleur subtile accordée au tone** en crans tokenisés `control.focus-*` (primary éclairci par défaut). L'anneau s'ajoute à la bordure d'état et reste discernable sur les fonds d'usage.
- Bouton icône seule → `aria-label` systématique, sans exception
- Zone tactile minimum 44px, y compris quand la taille visuelle est `sm` — la zone de clic peut s'étendre au-delà des limites visuelles du bouton plutôt que de descendre sous ce seuil

## Adaptation au conteneur

- Le Button seul garde une largeur ajustée à son contenu. Le pattern parent décide s'il remplit la
  largeur disponible ; « primaire = pleine largeur sous `breakpoint.mobile` » n'est plus une règle du
  composant.
- Un groupe étroit peut s'empiler ou regrouper ses actions secondaires via une Container Query portée
  par le groupe. Ses états se nomment `compact`, `regular`, `expanded`, jamais mobile/desktop.
- Le seuil vient du contenu réel du groupe, pas de `breakpoint.mobile`. Le style, le tone, le label
  accessible et la friction ne changent jamais avec la largeur.
- Le Button ne dépasse jamais la largeur disponible. Un libellé long se replie aux limites de mots,
  puis à l'intérieur d'un mot en dernier recours (`overflow-wrap: anywhere`) ; il n'est ni coupé ni
  remplacé par une ellipse. Les valeurs de taille deviennent alors des **hauteurs minimales** : un
  Button texte peut grandir verticalement, tandis qu'un Button `icon-only` reste un carré fixe.
- Ce repli est un comportement intrinsèque et ne justifie pas à lui seul une Container Query. Une
  requête de conteneur n'intervient que lorsqu'un véritable état de composition change.
- La cible tactile minimum reste 44px quand le contexte d'entrée le nécessite ; `scale.desktop-min`
  reste le minimum visuel des contextes denses avec pointeur précis. La capacité d'entrée relève d'une
  Media Query, pas d'une requête de largeur du Button.

RÈGLE [BUTTON-U01] : le Button ne consomme aucune élévation. Son affordance matérielle vient de son remplissage, de
STATUT : implémentation de référence
SOURCE : interne
ÉNONCÉ : Le code du bouton n'implémente aucune ombre portée à l'état de repos ; son affordance vient du remplissage, de la bordure, des états et du focus.
MESURE : aucun token d'élévation (ombre) n'est appliqué au bouton à l'état de repos
sa limite, de ses états et de son focus (`INTERACTION-UI.md`), pas d'une ombre de repos.

## Implémentation & reproductibilité
- Chaque propriété visuelle (couleur, radius, padding) doit être liée à un token du design system — jamais une valeur codée en dur, même pour une exception ponctuelle.
- **Parité design/code obligatoire** : le rendu Figma et le rendu en production doivent être visuellement identiques à chaque évolution du composant. Un écart non détecté devient une dette invisible qui se propage à chaque nouvelle instance copiée.
- **Risque spécifique à la génération par IA** : un agent qui génère un bouton sans référence explicite à ces tokens a tendance à halluciner sa propre interprétation du style — c'est précisément ce que ce fichier sert à éviter en étant fourni comme contexte. (Cas vécu à l'origine de cette règle : cf. DECISIONS.md.)
- Aucun override de style au cas par cas dans le code applicatif — toute exception visuelle doit remonter au design system, pas rester locale à un écran.
- **Exception documentée** : un bouton de connexion sociale (Google, Apple...) suit les contraintes de proportion et de couleur de la marque tierce plutôt que ces tokens — override tracé, pas arbitraire.

## Sources et niveau de confiance (couche UI)
| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| T1 | Zone tactile minimum 44px | Recommandations WCAG / Apple HIG / Material Design | Établi, standard de l'industrie |
| T2 | Séparation style (remplissage) / tone (couleur) en deux axes orthogonaux | Material Design 3 (variants filled/outlined/text/tonal), IBM Carbon, Shopify Polaris | Établi — convention convergente ; Material 3 nomme quasi identiquement les quatre remplissages |
| T3 | Style à 4 remplissages filled/stroke/lighter/ghost | Material 3 (filled/tonal/outlined/text), Untitled UI, systèmes produit contemporains | Convergence — le « lighter » (fond tonal doux) est le tonal de Material 3 |
| T4 | Tailles comme 3e axe indépendant, non mélangées dans un groupe | IBM Carbon, Material Design | Convention établie, valeurs de hauteur précises variables selon le système |
| T5 | Refus de figer des valeurs px absolues sans grille définie | Décision méthodologique interne à ce fichier | N/A — choix de conception, pas une affirmation empirique |
| T7 | État pressé rendu par une transformation géométrique brève plutôt que par un cran chromatique dédié | Material Design 3 (state layer + ressort), Apple HIG (press feedback), IBM Carbon | Convergence — la forme du signal varie (échelle, enfoncement, calque d'état), le principe d'un accusé de réception distinct du survol ne varie pas |
| T8 | État indisponible rendu par un couple de rôles neutres, volontairement sous le seuil de contraste du texte | IBM Carbon (`$button-disabled` / `$text-on-color-disabled`), Material 3 (conteneur 12 %, libellé 38 %), Shopify Polaris | Établi — les trois systèmes rendent l'indisponible par une PAIRE dédiée, aucun par une opacité appliquée au contrôle entier |
| T9 | Exemption WCAG des contrôles indisponibles au seuil 4.5:1 | WCAG 2.2, 1.4.3 (Contrast Minimum) — note sur les composants inactifs | Établi, normatif |
| T6 | Tone décliné sur 4 rôles (`solid`/`on_solid`/`solid_hover`, `fg`/`border`, `subtle`/`on_subtle`/`subtle_hover`) pour porter les 4 styles | IBM Carbon (ghost/danger), Shopify Polaris (plain/critical), Material 3 (tonal) — même séparation fond/premier-plan | Établi par convergence ; noms de tokens propres à ce système |
| T7 | Hover en state layer (fond assombri ou remplissage léger apparaissant) | Material Design (state layers), observation production | Établi par convergence ; valeurs exactes dans DESIGN.md, vérifiées au contraste par tools/test-rendu.js |
| T8 | `tone.destructive_text` explicite plutôt que déduit | Constat F04 d'un premier outillage (numérotation historique, sans lien avec le F04 de tools/reports/RAPPORT-TEST.md — cf. DECISIONS.md) | N/A — dette de spécification comblée, pas une affirmation empirique |
| T9 | Anatomie 3 actes / glyphe `stroke-dashoffset` / somme ≤ `motion.celebration` / reduced-motion par acte | `EMOTION-UI.md` § Anatomie / Techniques / reduced-motion | Établi — hérité sans redéfinition |
| T10 | Repli reduced-motion du spinner (indicateur statique ou pulse d'opacité) | `MOTION-UI.md` (« spinner remplacé par un indicateur statique ou un pulse d'opacité ») | Établi — hérité (web.dev + choix interne) |
| T11 | Hover fast/ease-out, spinner linear, transition interruptible | `MOTION-UI.md` § Mapping / Techniques | Établi — hérité |

*Toute règle de cette couche sans source explicite ci-dessus repose sur une convention d'implémentation standard, pas sur une étude chiffrée.*
