---
component: interaction
layer: ui
type: language
version: 1.2.0 # 1.2.0 : implémentation de référence du mode d'interaction en couche partagée unique (U09-U11) — relief pré-rendu animé en opacité, lien étendu, extraction depuis Card. 1.1.0 : Interaction devient un langage de premier niveau, distinct des fondations qu'il compose. 1.0.0 : première rédaction — grammaire technique d'affordance ; compose les tokens existants sans créer un thème d'effets
last_updated: 2026-07-29
companion: INTERACTION-UX.md
tokens:
  action:
    boundary: color.border-strong
    hover_surface: color.surface-hover
    press_duration: motion.fast
  receptive:
    boundary: color.border-strong
    background: color.background
  surface:
    rest_shadow: elevation.none
  focus:
    width: border.focus-width
    offset: border.focus-offset
  state_motion:
    duration: motion.fast
    easing: motion.ease-out
confidence: mixed
---

# Langage d'interaction — Couche UI

> Ce fichier traduit `INTERACTION-UX.md` en grammaire de rendu. Il **compose** les tokens existants ;
> il n'ajoute ni ombre de bouton, ni gradient, ni valeur brute à `DESIGN.md`.

## Matrice de rendu

| Rôle | Repos | Réaction | Ne doit pas devenir |
|---|---|---|---|
| Action (Button) | forme et limite perceptibles selon son style | hover/active/focus distincts | texte de navigation ambigu |
| Navigation (Link) | texte identifiable comme lien, inline souligné | soulignement/contraste/focus renforcés | faux bouton d'action |
| Saisie (Input) | zone réceptive délimitée + label visible | bordure d'état + focus ring | surface élevée |
| Information (Card statique) | containment calme, `elevation.none` | aucune réaction de clic | contrôle sans cible |
| Card cliquable | cible réelle + différence au hover/focus | `elevation.raised` autorisé au hover | `div onclick` |
| Superposition | séparation de couche | `elevation.overlay` selon ELEVATION | importance rendue par l'ombre |

## Contrat des états

RÈGLE [INTERACTION-U01] : la présence au repos précède le feedback. Un hover ne sert pas à révéler une cible qui semblait
STATUT : propriété universelle
SOURCE : T5, T9
ÉNONCÉ : La présence au repos précède le retour visuel : le survol confirme une cible déjà reconnaissable et ne sert jamais à révéler une cible qui paraissait statique.
MESURE : sous (hover: none), toute cible reste reconnaissable ; aucun style de survol n'est le seul signal d'existence d'une cible
statique ; il confirme une cible déjà reconnaissable.

RÈGLE [INTERACTION-U02] : les transitions d'état utilisent `motion.fast` et `motion.ease-out`. Elles portent sur des
STATUT : implémentation de référence
SOURCE : T4, T6
ÉNONCÉ : Les transitions d'état utilisent la durée rapide et la courbe de sortie du système, portent sur des propriétés sobres, et deviennent instantanées sous préférence de mouvement réduit sans que le changement cesse d'être visible.
MESURE : les transitions d'état n'emploient que motion.fast et motion.ease-out ; sous prefers-reduced-motion: reduce, la durée est nulle et le changement d'état reste visible
propriétés sobres ; sous `prefers-reduced-motion`, le changement reste visible mais devient instantané.

RÈGLE [INTERACTION-U03] : l'état `active` peut réduire un décalage ou une ombre **déjà justifiée** pour donner une
STATUT : implémentation de référence
SOURCE : T4
ÉNONCÉ : L'état d'activation peut réduire un décalage ou une ombre déjà justifiée pour donner une sensation de pression ; il ne crée pas d'ombre de repos nouvelle et ne déplace jamais la mise en page.
MESURE : l'état active ne déclare aucune propriété déclenchant un recalcul de layout et n'introduit aucune ombre absente à l'état de repos
sensation de pression. Il ne crée pas une nouvelle ombre de repos et ne déplace jamais le layout.

RÈGLE [INTERACTION-U04] : le focus utilise la géométrie `border.focus-width` + `border.focus-offset`. Sa couleur est
STATUT : implémentation de référence
SOURCE : T1, T7
ÉNONCÉ : L'indicateur de focus est construit sur la géométrie de largeur et de décalage définie par la fondation de bordure, sa couleur appartient au composant propriétaire, et aucun effet tactile ne le remplace.
MESURE : l'indicateur de focus est un outline dérivé de border.focus-width et border.focus-offset ; aucun composant ne supprime l'indicateur sans le remplacer
définie par le composant propriétaire ; aucun effet tactile ne le remplace.

RÈGLE [INTERACTION-U05] : `disabled` conserve la forme et le rôle perceptibles. La baisse de contraste ne doit pas
STATUT : parti pris d'identité
SOURCE : T9, T4
ÉNONCÉ : Un contrôle indisponible conserve une forme et un rôle perceptibles : la baisse de contraste ne va jamais jusqu'à faire disparaître la limite qui le distingue du contenu.
MESURE : aucun état disabled ne supprime la bordure ou le fond qui délimite le contrôle
faire disparaître la limite au point de confondre le contrôle avec le contenu.

## Composition autorisée

- **Limite** : bordure ou fond issus des tokens du composant ; `color.border-strong` quand la
  délimitation porte seule l'identification.
- **Surface d'état** : `color.surface-hover` ou le token sémantique de hover appartenant au composant.
- **Profondeur** : uniquement selon `ELEVATION-UI.md` ; aucune ombre de repos ajoutée ici.
- **Mouvement** : `motion.fast` pour hover/press/focus ; techniques de `MOTION-UI.md`.
- **Focus** : `outline` et offset selon `BORDER-UI.md`, jamais une border qui déplace le contenu.

## Le mode d'interaction — implémentation de référence

> Traduction des règles R26–R28 d'INTERACTION-UX : la couche partagée `ds-interactive`
> (lib/interaction dans l'implémentation de référence), extraite de Card le 2026-07-29.

RÈGLE [INTERACTION-U09] : une couche partagée unique implémente le mode, quel que soit le composant hôte.
STATUT : implémentation de référence
SOURCE : T4
ÉNONCÉ : Le mode d'interaction est rendu par une couche partagée unique — attribut de mode sur la racine, curseur, relief et cible étendue communs — que chaque surface-conteneur consomme au lieu de réimplémenter les signaux localement.
MESURE : les signaux du mode (curseur, relief de survol, cible étendue) proviennent de la couche partagée et ne sont pas redéfinis par le composant hôte

RÈGLE [INTERACTION-U10] : le relief du mode clickable est pré-rendu et animé en opacité, au survol et au focus seulement.
STATUT : implémentation de référence
SOURCE : T4, T9
ÉNONCÉ : Le relief d'une surface clickable est une ombre pré-rendue sur un pseudo-élément et animée en opacité, visible uniquement au survol et au focus interne ; aucune surface ne porte d'ombre de repos et aucun box-shadow n'est interpolé.
MESURE : au repos, l'ombre de la surface est d'opacité nulle ; la transition d'apparition porte sur opacity, jamais sur box-shadow

RÈGLE [INTERACTION-U11] : la cible réelle d'une surface clickable est un lien étendu ; les actions internes restent des voisins.
STATUT : implémentation de référence
SOURCE : T3
ÉNONCÉ : La cible réelle d'une surface clickable est un vrai lien dont un pseudo-élément étend la zone d'activation à toute la surface ; les actions internes sont des voisins positionnés au-dessus, jamais des descendants du lien.
MESURE : le lien étendu est l'élément annoncé par les technologies d'assistance ; aucune action interne n'est descendante du lien

## Robustesse

RÈGLE [INTERACTION-U06] : sous `forced-colors`, les bordures, le focus et la sémantique native survivent même si les
STATUT : propriété universelle
SOURCE : T8
ÉNONCÉ : En mode de couleurs forcées, les bordures, l'indicateur de focus et la sémantique native survivent même lorsque les fonds, les ombres et les reflets sont neutralisés par le système.
MESURE : sous forced-colors: active, chaque contrôle reste délimité par une bordure ou un outline recoloré par le système ; aucune identification ne repose sur box-shadow ni sur background-image
fonds, ombres ou reflets sont neutralisés.

RÈGLE [INTERACTION-U07] : sous `(hover: none)`, aucune information ni action n'est masquée. Le style `:hover` est un
STATUT : propriété universelle
SOURCE : T5, T10
ÉNONCÉ : Sous un pointeur incapable de survoler, aucune information ni aucune action n'est masquée : le style de survol n'est qu'un renforcement facultatif.
MESURE : sous (hover: none), aucune information ni action n'est inaccessible ; aucun contenu n'est déclenché uniquement par :hover
renforcement facultatif.

RÈGLE [INTERACTION-U08] : une implémentation tactile n'intercepte pas les événements natifs du contrôle et respecte
STATUT : propriété universelle
SOURCE : T11
ÉNONCÉ : Une implémentation tactile n'intercepte pas les événements natifs du contrôle et respecte l'annulation du pointeur : l'action se déclenche au relâchement sur la cible, et sortir de la cible avant de relâcher l'annule.
MESURE : aucun gestionnaire d'action sur pointerdown, mousedown ou touchstart ; l'action se déclenche au relâchement sur la cible
l'annulation du pointeur documentée dans BUTTON-UX.

## Vérification par composant

- **Button** : action réelle, état de repos reconnaissable, focus indépendant du hover.
- **Link** : destination réelle, soulignement inline, texte explicite, focus visible.
- **Input** : label visible, zone délimitée, erreurs reliées, jamais élevée.
- **Card** : absence d'état interactif si statique ; vrai lien/input si clickable/selectable.

## Sources et niveau de confiance

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| T1 | Focus visible et non masqué | [WCAG 2.2 — 2.4.7 Focus Visible](https://www.w3.org/TR/WCAG22/#focus-visible), [2.4.11 Focus Not Obscured](https://www.w3.org/TR/WCAG22/#focus-not-obscured-minimum) | Établi |
| T2 | Ne pas dépendre de la couleur seule | [WCAG 2.2 — 1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color) | Établi |
| T3 | Utiliser les éléments natifs pour leur rôle | [WAI-ARIA Authoring Practices — No ARIA is better than bad ARIA](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/) | Établi |
| T4 | Matrice visuelle action/réceptacle/surface | Décision interne issue d'INTERACTION-UX.md | À éprouver |
| T5 | La caractéristique de média hover distingue un pointeur principal capable de survoler d'un pointeur qui en est incapable, ou pour lequel le survol est malcommode ; les styles de survol ne s'appliquent conditionnellement que dans le premier cas | [MDN — @media/hover](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover) | Établi, comportement plateforme documenté — fonde U01 et U07 |
| T6 | La préférence de mouvement réduit demande la suppression, la réduction ou le remplacement des animations non essentielles, sans supprimer le changement d'état lui-même | [MDN — prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) | Établi, préférence utilisateur normalisée — fonde le second volet de U02 |
| T7 | La pseudo-classe :focus-visible ne s'applique que lorsque l'agent utilisateur juge l'indicateur de focus nécessaire, ce qui la sépare de :focus et de :hover ; supprimer l'indicateur rend la navigation clavier inaccessible aux personnes voyantes, et l'indicateur doit atteindre 3:1 avec les couleurs voisines | [MDN — :focus-visible](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible) | Établi, spécification CSS documentée par MDN — fonde la géométrie et l'indépendance du focus dans U04 |
| T8 | En mode de couleurs forcées, box-shadow et text-shadow sont forcés à néant et background-image non-url également, tandis que border-color et outline-color sont recolorés par le système : la bordure et l'anneau de focus survivent, l'ombre non | [MDN — @media (forced-colors)](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors) | Établi, comportement plateforme normalisé — **source décisive de U06, qui l'affirmait sans la citer** |
| T9 | L'information visuelle nécessaire pour identifier un composant d'interface et ses états atteint 3:1 avec les couleurs adjacentes ; les composants inactifs sont explicitement exemptés de cette exigence | [WCAG 2.2 — 1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) | Établi, standard (AA) — fonde U01 ; **l'exemption des composants inactifs montre que U05 est plus exigeant que la norme, donc un parti pris et non une obligation** |
| T10 | Tout contenu additionnel déclenché au survol ou au focus doit pouvoir être écarté sans déplacer le pointeur ni le focus, rester survolable et persister jusqu'à ce que le déclencheur disparaisse ou que l'utilisateur l'écarte | [WCAG 2.2 — 1.4.13 Content on Hover or Focus](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html) | Établi, standard d'accessibilité (niveau AA) — complète U07 |
| T11 | Pour toute fonctionnalité opérable par un pointeur unique, l'événement d'appui ne doit exécuter aucune partie de la fonction, ou bien l'exécution se fait au relâchement avec un moyen d'annuler avant achèvement ou d'annuler après, sauf lorsque l'exécution à l'appui est essentielle | [WCAG 2.2 — 2.5.2 Pointer Cancellation](https://www.w3.org/WAI/WCAG22/Understanding/pointer-cancellation.html) | Établi, standard d'accessibilité (niveau A) — **U08 déléguait cette obligation à BUTTON-UX ; c'est un critère normatif, pas une convention de composant** |
