---
component: link
layer: ui
version: 1.2.0 # 1.2.0 : focus v2 + retrait du token `color.accent` (DESIGN 1.34.0, arbitrage 2026-07-29) — l'anneau passe aux rôles `control.focus-*` (défaut primary éclairci), géométrie BORDER inchangée ; aucune autre règle modifiée. 1.1.0 : rattachement nommé à Motion (transition d'état = feedback, focus ring jamais animé) — 2026-07-21. 1.0.0 : première rédaction — mapping inline/standalone/navigation et états sur les tokens existants
last_updated: 2026-07-29
companion: LINK-UX.md
tokens:
  typography:
    font: typography.body
    fallback: typography.fallback.sans
  colors:
    default: color.primary
    hover: color.primary-hover
    visited: color.text-secondary
  focus:
    color: control.focus-color # focus v2 (2026-07-29) — cran subtil, défaut primary éclairci
    width: border.focus-width
    offset: border.focus-offset
  icon:
    inline: icon.sm
    standalone: icon.md
  motion:
    state: { duration: motion.fast, easing: motion.ease-out }
  axes:
    context: [inline, standalone, navigation]
    icon: [none, leading, trailing, only]
confidence: established
---

# Link — Couche UI

> Tokens et techniques du Link. Le choix Link vs Button, les destinations et le wording vivent dans
> `LINK-UX.md`.

## Contextes de rendu

| Contexte | Rendu |
|---|---|
| `inline` | soulignement visible au repos ; couleur `colors.default` |
| `standalone` | texte + éventuelle icône ; soulignement ou indicateur directionnel constant |
| `navigation` | traitement du groupe de navigation ; état courant non chromatique + sémantique |

RÈGLE [LINK-U01] : `inline` reste souligné au repos. Le hover peut renforcer l'épaisseur ou le décalage du
STATUT : propriété universelle
SOURCE : T1
ÉNONCÉ : Un lien inline est souligné au repos ; le survol peut renforcer l'épaisseur ou le décalage du soulignement mais n'est jamais le moment où le lien devient enfin identifiable.
MESURE : un lien inline porte une décoration de texte visible à l'état de repos, pas seulement au survol
soulignement, mais ne doit pas être le moment où le lien devient enfin identifiable.

RÈGLE [LINK-U02] : `standalone` reste visuellement plus léger qu'un Button. Ajouter une boîte, un fond et des
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Un lien autonome reste visuellement plus léger qu'un bouton ; lui donner une boîte, un fond et des états de pression équivalents à un bouton signifie que le choix du composant doit être réexaminé.
états de pression équivalents à un Button signifie que le choix du composant doit être réexaminé.

## États

- default : `color.primary`, soulignement selon le contexte ;
- hover : `color.primary-hover`, soulignement maintenu ;
- focus : outline `control.focus-color` (focus v2, cran subtil), `border.focus-width`, `border.focus-offset` ;
- active : variation immédiate, sans déplacement de layout ;
- visited : `color.text-secondary` uniquement dans les contextes où l'historique aide.

RÈGLE [LINK-U03] : le soulignement utilise les propriétés CSS dédiées (`text-decoration-*`) et reste lisible
STATUT : implémentation de référence
SOURCE : T6
ÉNONCÉ : Le soulignement d'un lien est produit par les propriétés CSS dédiées text-decoration-* et reste lisible autour des jambages ; il n'est pas simulé par une bordure qui traverse les lignes.
MESURE : aucun soulignement de lien produit par border-bottom
avec les jambages ; il n'est pas simulé par une border qui traverse les lignes.

RÈGLE [LINK-U04] : les changements de couleur utilisent `motion.fast`/`motion.ease-out` — la transition d'état
STATUT : implémentation de référence
SOURCE : T4, T7
ÉNONCÉ : Les changements de couleur d'un lien s'animent sur la durée courte et la courbe de sortie du système au titre du feedback d'état, et sont supprimables sous prefers-reduced-motion sans perte d'information.
MESURE : sous prefers-reduced-motion: reduce, aucune transition du lien n'est nécessaire pour comprendre son état
du lien relève de la fonction **feedback** de `MOTION-UX.md` (§ Durées : « petit changement = cran
court »). Sous `prefers-reduced-motion`, la transition peut être supprimée sans perte d'information
(repli conforme à `MOTION-UX.md` § prefers-reduced-motion).

RÈGLE [LINK-U05] : le focus ring n'est jamais animé — c'est une information de position pour la navigation
STATUT : parti pris d'identité
SOURCE : T4
ÉNONCÉ : L'anneau de focus d'un lien n'est jamais animé : c'est une information de position pour la navigation clavier, pas un effet.
MESURE : aucune propriété de l'anneau de focus n'est transitionnée ou animée
clavier, pas un effet (règle partagée `MOTION-UX.md` § Ce qui ne s'anime pas / `BORDER-UX.md`, qui
fait autorité sur le ring).

## Sémantique

RÈGLE [LINK-U06] : navigation = élément `<a>` avec une destination réelle. Un handler JavaScript peut enrichir
STATUT : propriété universelle
SOURCE : T2
ÉNONCÉ : Toute navigation est portée par un élément d'ancre muni d'une destination réelle ; un gestionnaire JavaScript peut enrichir le comportement, jamais remplacer l'attribut de destination.
MESURE : tout élément de navigation est une ancre porteuse d'un href non vide
le comportement, pas remplacer `href`.

RÈGLE [LINK-U07] : destination courante = `aria-current` approprié. Nouveau contexte ou téléchargement =
STATUT : propriété universelle
SOURCE : T2, T3
ÉNONCÉ : La destination courante est déclarée par la valeur appropriée d'aria-current, et un changement de contexte ou un téléchargement porte les attributs natifs correspondants accompagnés de l'annonce accessible prévue.
MESURE : la destination courante porte aria-current ; tout téléchargement porte l'attribut download
attributs natifs correspondants et annonce accessible prévue dans LINK-UX.

RÈGLE [LINK-U08] : un lien étendu de Card suit la technique documentée dans `CARD-UI.md`; les actions internes
STATUT : propriété universelle
SOURCE : T2
ÉNONCÉ : Le lien étendu d'une carte suit la technique documentée du composant carte, et les actions internes restent des éléments frères du lien, jamais ses descendants.
MESURE : aucun élément interactif n'est descendant du lien étendu d'une carte
restent des siblings, jamais des descendants du lien.

## Icônes et cible

RÈGLE [LINK-U09] : l'icône inline utilise `icon.sm`; un lien autonome peut utiliser `icon.md`. Le trait et le
STATUT : implémentation de référence
SOURCE : interne
ÉNONCÉ : L'icône d'un lien inline utilise la taille d'icône petite et celle d'un lien autonome peut utiliser la taille moyenne ; le trait et le dessin suivent la fondation d'iconographie.
MESURE : icône de lien inline = icon.sm ; icône de lien autonome ≤ icon.md
dessin suivent `ICONOGRAPHY-UI.md`.

RÈGLE [LINK-U10] : en `only`, le nom accessible est obligatoire et la zone interactive atteint la cible tactile
STATUT : propriété universelle
SOURCE : T5, T8
ÉNONCÉ : Un lien icône seule porte obligatoirement un nom accessible et une zone interactive atteignant la cible tactile commune de 44 px, sans que le glyphe lui-même soit agrandi.
MESURE : tout lien icône seule a un nom accessible non vide et une zone interactive ≥ 44×44 px CSS
commune de 44px sans imposer que le glyphe lui-même soit agrandi.

## Sources et niveau de confiance

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| T1 | Soulignement et signal non chromatique des liens inline | [WCAG 2.2 — 1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color) | Établi |
| T2 | Lien natif avec destination réelle | [HTML Living Standard — Links](https://html.spec.whatwg.org/multipage/links.html) | Normatif |
| T3 | `aria-current` pour l'élément courant d'un ensemble | [WAI-ARIA — aria-current](https://www.w3.org/TR/wai-aria-1.2/#aria-current) | Normatif |
| T4 | Transition d'état = feedback motion ; focus ring jamais animé | `MOTION-UX.md` (§ Durées / § Ce qui ne s'anime pas), `BORDER-UX.md` | Établi — langage transversal |
| T5 | Cible pointeur : 24 × 24 px CSS (AA) et 44 × 44 px CSS (AAA) | [WCAG 2.2 — 2.5.5 Target Size (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html) ; [WCAG 2.2 — 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) | Établi, standard (AAA et AA) — le « 44 px commun » n'était rattaché à aucune référence |
| T6 | Le soulignement natif contourne les jambages : text-decoration-skip-ink vaut auto par défaut, comportement qu'aucune bordure simulée ne reproduit | [MDN — text-decoration-skip-ink](https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration-skip-ink) | Normatif — largement disponible depuis mars 2022 |
| T7 | prefers-reduced-motion: reduce signale une préférence de suppression ou de réduction des animations non essentielles | [MDN — prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) | Normatif |
| T8 | Nom et rôle programmatiquement déterminables pour tout composant, liens icône seule compris | [WCAG 2.2 — 4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html) | Établi, standard (A) |
