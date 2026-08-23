---
component: toast
layer: ui
version: 1.1.0 # 1.1.0 : ancrage bas-centré (arbitrage utilisateur 2026-07-21, remplace la proposition bas-droit du premier jet) + correction d'un piège CSS (container-type sans largeur explicite → région/toasts invisibles, rapporté par l'utilisateur sur DS-UI). 1.0.0 : première rédaction, adoptée — compagnon technique de TOAST-UX.md v1.0.0. Reprend telles quelles les valeurs déjà établies ailleurs (tone/rendu d'ALERT-UI, elevation.overlay de RULES-interaction, motion/E-motion) ; propose des valeurs nouvelles là où TOAST-UX.md renvoyait explicitement ici (durée, ancrage) — marquées comme proposition, pas comme établi, jusqu'à vérification à l'usage.
last_updated: 2026-07-21
companion: TOAST-UX.md
tokens:
  axes:
    tone: [info, success, warning, danger] # identique à alert — aucun token de couleur nouveau
  tone:
    info: { background: color.info-subtle, border: color.info, text: color.info, icon: color.info }
    success: { background: color.success-subtle, border: color.success, text: color.success, icon: color.success }
    warning: { background: color.warning-subtle, border: color.warning, text: color.warning, icon: color.warning }
    danger: { background: color.danger-subtle, border: color.danger, text: color.danger, icon: color.danger }
  icon_shape: { info: circle, success: circle-check, warning: triangle, danger: octagon } # héritées d'alert, mêmes silhouettes normatives
  structure:
    radius: radius.lg
    padding: spacing.md
    icon_gap: spacing.sm
    action_gap: spacing.sm
    max_width: 24rem # proposition — largeur de lecture confortable pour 1-2 lignes, à l'état regular/expanded
  elevation: elevation.overlay # déjà désigné légitime pour le toast dans RULES-interaction.md (« Overlays (modale/popover/futur toast) : elevation.overlay légitime — signale une couche ») — seul écart avec alert, qui n'a aucune élévation
  motion:
    apparition: { duration: motion.base, easing: motion.ease-out } # identique au pattern alert réactif
    disparition: { duration: motion.fast, easing: motion.ease-in } # cran inférieur de l'entrée, comme alert
    reduced_motion: crossfade d'opacité conservé, jamais de translation supprimée sans remplacement (cf. § reduced-motion)
  duree: # PROPOSITION — TOAST-UX.md renvoyait explicitement ici la formule exacte, aucun token existant à réutiliser
    base_ms: 6000 # milieu de la fourchette 5-8s déjà établie (BUTTON-UX.md, pattern undo)
    extension_par_mot_ms: 50 # au-delà de 8 mots — temps de lecture, pas un chiffre sourcé, à vérifier à l'usage
    bonus_action_ms: 2000 # fenêtre supplémentaire si une action (undo) est présente — décision proposée, pas sourcée
    plafond_ms: 10000
  aria:
    reactive_danger_warning: role="alert"
    reactive_info_success: role="status"
  empilement: { max: 3, ordre: fifo, comportement_au_dela: le_plus_ancien_sort }
confidence: mixed
---

# Toast — Couche UI

> Tokens et techniques d'implémentation. Le raisonnement (tone, timing, actions, empilement,
> position, instrument E-motion) vit dans `TOAST-UX.md`. Ce fichier est un premier jet — les valeurs
> marquées « proposition » n'ont pas de source externe, contrairement à celles reprises d'`ALERT-UI.md`.

## Ce qui est repris tel quel (rien de nouveau à vérifier)

- **Tone et silhouettes** : mêmes 4 tones, mêmes tokens `{tone}-subtle`/`{tone}`, mêmes silhouettes
  d'icône normatives (cercle / cercle-coche / triangle / octogone) qu'`ALERT-UI.md`. Aucun token
  couleur nouveau.
- **`radius.lg`**, `spacing.md`/`spacing.sm` : cran conteneur et espacement, identiques à alert.
- **`role="alert"`/`role="status"`** : mapping identique à alert par tone — le toast est toujours
  réactif (jamais de variante proactive, contrairement à l'alert).

## Ce qui diverge d'Alert (et pourquoi)

RÈGLE [TOAST-U01] : **`elevation.overlay`** — le toast est le seul des deux composants à porter une élévation.
STATUT : parti pris d'identité
SOURCE : T2
ÉNONCÉ : Le toast porte elevation.overlay, seul écart de relief avec l'alert qui n'en porte aucune : le relief signale la superposition, il n'est pas un décor.
MESURE : elevation du toast == elevation.overlay
Ce n'est pas une extension inventée ici : `RULES-interaction.md` désignait déjà « Overlays
(modale/popover/**futur toast**) : `elevation.overlay` légitime » avant même que ce fichier existe.
Alert n'en porte aucune (il vit dans le flux, il n'a rien à signaler comme couche superposée) ; le
toast, lui, flotte au-dessus du contenu — c'est exactement le signal que le relief matériel doit
porter selon la doctrine Interaction (le relief est un signal, jamais un décor).

RÈGLE [TOAST-U02] : **pas de croix de fermeture par défaut** — proposition, non tranchée par `TOAST-UX.md`. Le
STATUT : parti pris d'identité
SOURCE : T10
ÉNONCÉ : Le toast n'expose pas de bouton de fermeture par défaut, la suspension du minuteur au survol et au focus étant tenue pour couvrir le besoin de temps de lecture supplémentaire.
MESURE : aucun contrôle de fermeture rendu par défaut
pause-au-survol/focus (§ Timing) couvre déjà le besoin « je n'ai pas eu le temps » ; ajouter une
croix dupliquerait l'affordance de sortie sur un composant qui, contrairement à l'alert, a déjà une
fin de vie programmée. À revoir si l'usage réel montre le besoin d'une sortie immédiate volontaire.

## Timing — implémentation

RÈGLE [TOAST-U03] : durée = `duree.base_ms` + `duree.extension_par_mot_ms` × (nombre de mots au-delà de 8) +
STATUT : parti pris d'identité
SOURCE : T7
ÉNONCÉ : La durée d'affichage d'un toast vaut la durée de base, augmentée d'une extension par mot au-delà de huit mots et d'un bonus si une action est présente, bornée par une valeur de plafond.
MESURE : durée = base_ms + extension_par_mot_ms x max(0, mots - 8) + bonus_action_ms si action, borné à plafond_ms
`duree.bonus_action_ms` si une action est présente, plafonné à `duree.plafond_ms`.

> **Statut de cette formule** : `TOAST-UX.md` renvoyait la valeur exacte à cette couche sans la
> fixer — ce n'est pas une règle établie en externe (contrairement au plancher 5-8s, lui sourcé sur
> `BUTTON-UX.md`/IBM Carbon), c'est une proposition de premier jet. À vérifier à l'usage avant de la
> marquer CONFIANCE établi.

RÈGLE [TOAST-U04] : le minuteur se **suspend** intégralement au `:hover` et au `:focus-within` du toast (y
STATUT : propriété universelle
SOURCE : T13, T14
ÉNONCÉ : Le minuteur se suspend au survol du toast et à tout focus contenu dans le toast, action comprise, et reprend son décompte à leur sortie sans jamais repartir de zéro.
MESURE : le temps restant après une période de survol ou de focus est égal au temps restant avant celle-ci
compris l'action s'il y en a une) — reprend à leur sortie, ne redémarre jamais de zéro (WCAG 2.2.1).

RÈGLE [TOAST-U05] : technique — un seul `setTimeout` par toast, remis à zéro par `clearTimeout`/relance sur
STATUT : implémentation de référence
SOURCE : interne
ÉNONCÉ : Le minuteur est implémenté par un unique délai programmé par toast, annulé et relancé aux entrées et sorties de survol ou de focus, jamais par une boucle d'intervalle recalculée en continu.
MESURE : aucun intervalle périodique dans la gestion du cycle de vie d'un toast
entrée/sortie de survol-focus, jamais une boucle d'intervalle qui recalcule en continu.

## Empilement — implémentation

RÈGLE [TOAST-U06] : file **FIFO**, plafond 3 (`empilement.max`) — le 4ᵉ toast entrant fait sortir le plus ancien
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : La file de toasts est en premier entré premier sorti avec un plafond de trois ; l'arrivée d'un quatrième toast fait sortir le plus ancien selon la chorégraphie de disparition normale et non par coupure brutale.
MESURE : empilement.max == 3 et ordre == fifo
immédiatement (disparition au cran `motion.fast`/`ease-in`, comme une disparition normale, pas une
coupure brutale).

RÈGLE [TOAST-U07] : chaque toast de la pile a son **propre minuteur indépendant** — l'arrivée d'un nouveau toast
STATUT : implémentation de référence
SOURCE : interne
ÉNONCÉ : Chaque toast d'une pile possède son propre minuteur indépendant ; l'arrivée d'un nouveau toast ne réinitialise pas le temps déjà écoulé des précédents.
ne remet pas à zéro le temps déjà écoulé des précédents.

## Position — implémentation Adaptive

RÈGLE [TOAST-U08] : le conteneur qui héberge la pile de toasts est un **conteneur de requête** (`container-type:
STATUT : implémentation de référence
SOURCE : T5
ÉNONCÉ : La région qui héberge la pile de toasts est déclarée conteneur de requête sur l'axe inline, et non ancrée en dur au viewport.
MESURE : la région porte container-type: inline-size
inline-size`), conformément à `ADAPTIVE-UI.md` — pas un ancrage codé en dur au viewport.

```css
.toast-region {
  container-type: inline-size;
  container-name: toast-region;
  position: fixed;
  inset-block-end: spacing.lg;
  inset-inline-start: 50%;
  transform: translateX(-50%);
  width: min(structure.max_width, calc(100vw - spacing.lg * 2)); /* largeur EXPLICITE — cf. RÈGLE piège ci-dessous */
}

@container toast-region (max-width: 28rem) {
  .toast-region {
    inset-inline: spacing.md; /* état compact : pleine largeur utile, plus de centrage */
    inset-inline-start: spacing.md;
    width: auto;
    transform: none;
  }
}
```

RÈGLE [TOAST-U09] : **une largeur EXPLICITE est obligatoire** (piège CSS découvert et corrigé le 2026-07-21,
STATUT : implémentation de référence
SOURCE : T9, T11
ÉNONCÉ : Un élément déclaré conteneur de requête et sorti du flux normal reçoit obligatoirement une largeur explicite : la containment de taille l'empêche de tirer sa largeur de son contenu, et un plafond de largeur seul ne détermine aucune largeur de départ.
MESURE : tout élément portant container-type et positionné hors flux déclare aussi une propriété de largeur
rapport utilisateur sur DS-UI — la région et ses toasts étaient invisibles). `container-type:
inline-size` retire au conteneur sa taille intrinsèque (containment) : un `max-inline-size` (ou
`max-width`) SEUL ne fixe rien tant que rien d'autre ne détermine la taille de départ — sans
`width` déclaré, l'élément s'effondre à une largeur nulle et tout son contenu devient invisible. RÈGLE
TRANSVERSALE pour tout futur conteneur de requête de ce système : `container-type` impose
toujours une largeur explicite, jamais un plafond seul.

RÈGLE [TOAST-U10] : état **compact** (espace insuffisant pour un centrage à marge fixe) → pleine largeur
STATUT : parti pris d'identité
SOURCE : T8
ÉNONCÉ : En état compact la région de toasts occupe la pleine largeur utile et empile du bas vers le haut ; en états regular et expanded elle est ancrée en bas au centre, à la largeur maximale de structure.
utile, empilement vertical du bas vers le haut. État **regular/expanded** → ancré **bas-centré**,
largeur `structure.max_width`.

> **Ancrage bas-centré** (arbitrage utilisateur 2026-07-21 — remplace la proposition « bas-droit »
> du premier jet, jamais vérifiée à l'usage). `TOAST-UX.md` renvoyait ce point ici sans le
> trancher ; l'utilisateur a tranché en conversation plutôt que d'attendre une convergence externe
> (Carbon/Polaris/Material proposent tous bas-droit, mais rien n'obligeait à les suivre).

## Instrument E-motion — implémentation

RÈGLE [TOAST-U11] : **hérite la technique d'`EMOTION-UI.md` sans exception** — quand l'instrument illustration
STATUT : implémentation de référence
SOURCE : T4
ÉNONCÉ : Quand l'instrument illustration s'active, le glyphe est dessiné par animation de son tracé, jamais rendu par une illustration statique importée.
MESURE : aucun asset d'illustration externe référencé par le composant toast
s'active (toast success, seul à l'écran, moment « envoi réussi »), le glyphe est **dessiné**
(`stroke-dashoffset` de plein à zéro sur l'icône `circle-check` de tone success), jamais une
illustration statique importée. C'est la seule technique établie à ce jour dans ce système (gabarit
SubmitButton) — l'arbitrage emoji/illustration externe (options A/B/C exposées en conversation le
2026-07-20, non tranché ; cf. `DECISIONS.md`) reste ouvert ; si l'option B est retenue plus tard,
cette section devra être amendée (nouvelle source d'asset, exception couleur documentée), pas
simplement étendue.

RÈGLE [TOAST-U12] : anatomie en trois actes héritée telle quelle — anticipation (`motion.fast`/`ease-in`) →
STATUT : implémentation de référence
SOURCE : T4
ÉNONCÉ : L'animation de l'instrument suit trois actes — anticipation, tracé du glyphe, résolution chromatique — dont la somme des durées ne dépasse pas la durée de célébration.
MESURE : somme des durées des trois actes <= motion.celebration
acte, le glyphe se dessine (`motion.expressive`/`spring`) → résolution, le vert s'installe
(`motion.expressive`/`ease-out`). Somme ≤ `motion.celebration`.

RÈGLE [TOAST-U13] : `prefers-reduced-motion` — actes 1-2 supprimés, acte 3 conservé en bascule instantanée :
STATUT : propriété universelle
SOURCE : T12, T4
ÉNONCÉ : Sous prefers-reduced-motion, les actes de mouvement de l'instrument sont supprimés et l'état final est atteint par bascule instantanée, sans perte de l'information portée.
MESURE : sous prefers-reduced-motion: reduce, aucune translation ni tracé animé, l'icône finale est rendue immédiatement
l'icône `circle-check` apparaît pleine directement, sans traînée. Le fait (succès confirmé) reste
intact.

RÈGLE [TOAST-U14] : condition d'activation vérifiée à l'injection, pas en continu — si un 2ᵉ toast arrive
STATUT : implémentation de référence
SOURCE : interne
ÉNONCÉ : La condition d'activation de l'instrument est évaluée à l'injection du toast et non en continu : un acte déjà commencé va à son terme, mais aucun nouveau moment illustré ne démarre tant que la pile compte plus d'un toast.
pendant que le glyphe du 1ᵉʳ se dessine encore, le 1ᵉʳ **termine** son acte en cours (le moment ne
se coupe pas net) mais aucun nouveau moment illustré ne démarre tant que la pile n'est pas revenue à
un seul élément.

## Accessibilité — spécifications techniques

- Toujours réactif : `role="alert"` (danger/warning) ou `role="status"` (info/success), conteneur
  live présent dans le DOM avant l'injection — même exigence qu'alert.
- Icône `aria-hidden="true"` si le tone est déjà annoncé par le texte/rôle ; sinon alternative
  textuelle. Jamais la couleur seule (WCAG 1.4.1), hérité d'alert.
- Zone tactile de l'action (si présente) : 44px minimum, focusable, libellée explicitement (pas
  « Annuler » seul si le contexte n'est pas clair au lecteur d'écran — « Annuler la suppression »).
- `prefers-reduced-motion` : bloc média global hérité de `MOTION-UI.md`, aucune redéclaration locale.
- RTL : l'ancrage bas-centré n'a, par construction, aucun miroir à écrire (un centre ne dépend pas
  du sens de lecture) — seul l'état compact utilise `inset-inline` (logique, pas `left`/`right`),
  qui s'inverse nativement si jamais un ancrage de coin revenait en jeu.

## Sources et niveau de confiance (couche UI)

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| T1 | Tone/silhouettes/rendu couleur | `ALERT-UI.md` (repris à l'identique) | Établi — transposition interne |
| T2 | `elevation.overlay` légitime pour le toast | `RULES-interaction.md` (« Overlays… futur toast ») | Établi — déjà écrit avant ce fichier |
| T3 | Motion apparition/disparition (base/fast, ease-out/in) | `MOTION-UI.md` (pattern alert réactif, repris à l'identique) | Établi — transposition interne |
| T4 | Technique instrument illustration (stroke-dashoffset, 3 actes, reduced-motion par acte) | `EMOTION-UI.md` (héritage direct, gabarit SubmitButton) | Établi — hérité |
| T5 | Container Query pour la position (pas d'ancrage viewport fixe) | `ADAPTIVE-UI.md` | Établi — application directe |
| T6 | `role="alert"`/`role="status"`, timing suspendu au survol/focus | `ALERT-UI.md` ; WCAG 2.2.1 | Établi |
| T7 | Formule de durée (base 6000ms, extension/mot, bonus action, plafond) | Proposition de premier jet, aucune source externe | **Non établi — à vérifier à l'usage** |
| T8 | Ancrage bas-centré | Arbitrage utilisateur explicite, 2026-07-21 (remplace la proposition bas-droit du premier jet) | Établi — décision d'identité interne |
| T9 | `container-type` nécessite une largeur explicite (sinon la région s'effondre à une largeur nulle) | Comportement CSS spécifié (containment), corrigé après rapport utilisateur 2026-07-21 | Établi — piège CSS documenté |
| T10 | Pas de croix de fermeture par défaut | Raisonnement de mécanisme (redondance avec pause-au-survol) | Déduction argumentée, non testée |
| T11 | container-type: inline-size « Establishes a query container for dimensional queries on the inline axis of the container. Applies style and inline-size containment to the element. The inline size of the element can be computed in isolation, ignoring the child elements. » Établir un conteneur inline-size ne fait pas à lui seul s'effondrer l'élément : sa taille inline doit être fixée par le contexte (un élément de bloc en flux s'étire à la largeur de son parent) ou déclarée explicitement. | [MDN — container-type](https://developer.mozilla.org/en-US/docs/Web/CSS/container-type) | Établi — spécification CSS. Confirme le diagnostic de U09 pour le cas rencontré (région en position: fixed, donc sans largeur contextuelle, dont le contenu ne peut plus la déterminer), mais **la généralisation transversale de U09 est trop large** : un conteneur de requête en flux normal tire sa largeur de son parent et ne s'effondre pas. La condition manquante est « hors flux » (position: fixed/absolute, float, inline-block), pas « container-type ». |
| T12 | La media feature prefers-reduced-motion exprime la préférence système de réduction du mouvement ; réduire n'est pas supprimer l'information, l'état final doit rester atteignable. | [MDN — prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) | Établi — spécification CSS, non re-fetchée dans cette passe (déjà sourcée dans MOTION). Fonde U13. |
| T13 | Valeurs de durée observées dans les systèmes publics vérifiés : Carbon 5 s (optionnel), Radix 5 000 ms par défaut, React Aria minimum 5 s recommandé, Fluent 7 s sans action, Atlassian 8 s, Nord 10 000 ms, Polaris au moins 10 000 ms dès qu'une action est présente. | [Radix — Toast](https://www.radix-ui.com/primitives/docs/components/toast) ; [React Aria — Toast](https://react-aria.adobe.com/Toast) ; [Fluent 2 — Toast](https://fluent2.microsoft.design/components/web/react/core/toast/usage) ; [Polaris — Toast](https://polaris-react.shopify.com/components/deprecated/toast) | Établi — convergence sur une fourchette 5-10 s, pas sur une valeur. La base de 6 000 ms de U03 tient dans la fourchette ; le total de 8 000 ms pour un toast avec action est **sous le plancher explicitement qualifié d'accessibilité par Polaris**. |
| T14 | Convergence vérifiée sur la suspension du minuteur : Radix « Pauses closing on hover, focus and window blur » ; React Aria « Timers automatically pause when the user focuses or hovers over a toast » ; Fluent « People who navigate via mouse can pause the timer by hovering over the toast » ; ICDS « A user can also hover over the toast with their mouse to pause the timer ». | [Radix — Toast](https://www.radix-ui.com/primitives/docs/components/toast) ; [React Aria — Toast](https://react-aria.adobe.com/Toast) ; [Fluent 2 — Toast](https://fluent2.microsoft.design/components/web/react/core/toast/usage) ; [ICDS — Toast accessibility](https://design.sis.gov.uk/components/feedback-progress/toast/accessibility) | Établi — quatre systèmes, dont deux couvrant explicitement le focus clavier en plus du survol. Fonde U04 et R10 en `universelle` **par convergence de systèmes, non par la norme WCAG 2.2.1** que les deux fichiers invoquent à tort (cf. S9). |

## À approfondir

- Vérifier la formule de durée à l'usage réel (textes longs, undo fréquent) avant de la marquer établie.
- Tester l'ancrage bas-centré avec une barre d'actions flottante ou une navigation basse (mobile)
  qui occuperait déjà le bas de l'écran.
- Si l'arbitrage emoji/illustration bascule sur l'option B : revoir uniquement § Instrument E-motion,
  aucune autre section n'est concernée.
