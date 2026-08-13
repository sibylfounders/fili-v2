---
component: tabs
layer: ui
type: component
version: 1.1.1 # 1.1.1 : la piste de la variante pill est rattachée nommément à la liste fermée de RADIUS-R08 (2026-08-03) — aucune valeur changée. 1.1.0 : focus v2 + retrait du token `color.accent` (DESIGN 1.34.0, arbitrage 2026-07-29) — l'anneau passe aux rôles `control.focus-*` ; aucune autre règle modifiée. 1.0.0 : première rédaction — mapping tokens. Aucun token neuf : trait courant `color.primary`, poids `typography.display.fontWeight`, pastille `radius.pill` + `elevation.raised`, transitions `motion.fast`/`motion.ease-out`, anneau de focus = BORDER. Cf. TABS-UX.md et packages/react/src/components/tabs/tabs.tsx.
last_updated: 2026-07-29
companion: TABS-UX.md
confidence: mixed # le mapping suit les tokens déjà établis par BUTTON/LINK/ACCORDION ; l'état disabled n'a pas de token de couleur dédié (dette assumée, cf. BUTTON-UI.md).
---

# Tabs — Couche UI (tokens)

> Mapping des contextes de TABS-UX.md sur les tokens et sur l'API réelle
> (`packages/react/src/components/tabs/tabs.tsx`). Aucune valeur brute.

## Structure ARIA et API

RÈGLE [TABS-U01] : la structure est `Tabs.Root` (contexte + valeur contrôlée/non contrôlée) > `Tabs.List`
STATUT : implémentation de référence
SOURCE : T1, T7
ÉNONCÉ : La structure du composant est une racine porteuse du contexte, une liste portant role=tablist et son orientation, des onglets portant role=tab, et des volets portant role=tabpanel placés en frères de la liste ; la liste porte une étiquette accessible obligatoire sans laquelle aucun jeu d'onglets ne s'affiche.
MESURE : tout élément role=tablist porte un nom accessible non vide
(`role="tablist"`, `aria-orientation="horizontal"`) > `Tabs.Tab` (`role="tab"`) et, en frère,
`Tabs.Panel` (`role="tabpanel"`). `Tabs.List` porte une prop `label` **obligatoire** — l'étiquette
annoncée au lecteur d'écran (`aria-label`) ; aucun jeu d'onglets ne s'affiche sans elle.

RÈGLE [TABS-U02] : `Tabs.Root` accepte `value`/`onValueChange` (contrôlé) ou `defaultValue` (non contrôlé) —
STATUT : implémentation de référence
SOURCE : interne
ÉNONCÉ : La racine accepte soit une valeur contrôlée assortie de son gestionnaire de changement, soit une valeur initiale non contrôlée, jamais les deux logiques mêlées ; la variante visuelle et le mode d'activation sont des propriétés explicites dont les valeurs par défaut sont la variante ligne et l'activation automatique.
MESURE : aucune instance ne fournit simultanément une valeur contrôlée et une valeur initiale non contrôlée
jamais les deux logiques mélangées. Sans valeur initiale, **le premier `Tabs.Tab` monté** s'auto-
sélectionne (renvoi TABS-UX § Onglet par défaut). `variant` vaut `"line"` ou `"pill"` ;
`activation` vaut `"auto"` (défaut) ou `"manual"` (renvoi TABS-UX § Activation).

RÈGLE [TABS-U03] : `Tabs.Tab` et `Tabs.Panel` partagent le même `value` — l'implémentation dérive
STATUT : implémentation de référence
SOURCE : interne
ÉNONCÉ : Un onglet et son volet se relient par une valeur partagée dont l'implémentation dérive les identifiants ainsi que les attributs aria-controls et aria-labelledby, à partir d'un identifiant de base unique généré au montage et jamais codé en dur.
MESURE : aucun identifiant d'onglet ou de volet n'est écrit en clair dans le composant
`id`/`aria-controls`/`aria-labelledby` de ce `value` et d'un `baseId` unique (`React.useId`),
jamais codés en dur. `Tabs.Panel` accepte `keepMounted` (défaut `false` : démonté quand non
courant — renvoi TABS-UX § Volet démonté ou masqué).

## Tablist

RÈGLE [TABS-U04] : le conteneur défile horizontalement (`overflow-x-auto`) — jamais de retour à la ligne
STATUT : parti pris d'identité
SOURCE : T5, interne
ÉNONCÉ : La liste d'onglets défile horizontalement et ne revient jamais à la ligne ; la variante ligne repose sur un séparateur bas de rôle délimitant, la variante pastille sur une piste au rayon plein bordée, et les espacements des deux variantes proviennent de l'échelle d'espacement.
(renvoi TABS-UX § Débordement). Variante `line` : séparateur bas en `color.border` (rôle
délimitante douce, pas de seuil de contraste requis — groupement), espacement entre onglets en
`spacing.lg`. Variante `pill` : piste en `color.background`, bordure `color.border`, rayon
`radius.pill` (consommateur nommé dans la liste fermée de RADIUS-R08 depuis le 2026-08-03 — la variante
est nommée d'après sa forme ; le fond de piste est une gélule, pas un conteneur au sens de RADIUS-R12),
padding interne `3px`, espacement entre onglets `spacing.xs` (`gap-0.5`).

## Onglet (`Tabs.Tab`) — états

| État | Texte | Fond / trait porteur | Poids |
|---|---|---|---|
| Repos | `color.text-secondary` | `line` : trait bas transparent · `pill` : aucun fond | normal |
| Survol | `color.text-primary` | `line` : trait bas `color.border-strong` (hover) | normal |
| Courant | `color.text-primary` | `line` : trait bas `color.primary` · `pill` : fond `color.surface` + `elevation.raised` | `typography.display.fontWeight` (renforcé) |
| Focus (clavier) | inchangé | anneau `border.focus-width` / `border.focus-offset` en `control.focus-color` (focus v2), extérieur à la boîte (BORDER-UI) | inchangé |
| Désactivé | CONFIANCE : non formalisé — arbitrage à remonter (aucun token `text-disabled` dans DESIGN.md ; dette assumée comme `disabled` de BUTTON-UI.md) | — | — |

RÈGLE [TABS-U05] : le texte de l'onglet suit `typography.body` ; la variante `line` compose en corps réduit
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Le texte d'un onglet reprend la famille et la graisse de base du corps de texte, seul le cran de taille variant avec la densité de la variante, et ses paddings proviennent de l'échelle d'espacement plutôt que d'une valeur en pixels.
(cran `sm`), la variante `pill` en corps compact (cran `xs`) — même famille, même graisse de base,
seul le cran de taille change avec la densité du motif. Le padding horizontal/vertical de l'onglet
vient de `spacing.sm` (`line`) et `spacing.md`/`1.5` (`pill`) — jamais une valeur en pixels codée
dans le composant.

RÈGLE [TABS-U06] : le **canal non chromatique** de l'onglet courant (renvoi TABS-UX) est porté par la paire
STATUT : propriété universelle
SOURCE : T3, T5, T8
ÉNONCÉ : Le signal de l'onglet courant est porté par deux propriétés simultanées — le poids typographique renforcé et un trait ou un fond porteur — dont au moins une est non chromatique, et jamais par la seule couleur du texte.
MESURE : l'onglet courant diffère des autres par au moins deux propriétés visuelles, dont une non chromatique
`typography.display.fontWeight` (poids) + trait/fond porteur (`color.primary` en `line`,
`elevation.raised` en `pill`) — deux signaux, jamais la couleur du texte seule.

RÈGLE [TABS-U07] : les transitions (couleur du texte, trait) utilisent `motion.fast` / `motion.ease-out` — un
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Les transitions d'état d'un onglet empruntent la durée courte et la courbe sortante du mouvement, et l'anneau de focus n'est jamais animé.
MESURE : aucune propriété de l'anneau de focus n'apparaît dans une transition ou une animation
petit changement d'état est un feedback court (renvoi MOTION-UI). L'anneau de focus n'est **jamais**
animé (BORDER-UI, MOTION-UX § ce qui ne s'anime pas).

## Volet (`Tabs.Panel`)

RÈGLE [TABS-U08] : le volet est focalisable (`tabindex="0"`) — il reçoit donc un anneau de focus visible à
STATUT : propriété universelle
SOURCE : T1, T2, T6
ÉNONCÉ : Le volet inclus dans l'ordre de tabulation reçoit un anneau de focus visible à l'arrivée au clavier, y compris lorsqu'il est vide, et le volet non courant maintenu monté est masqué par l'attribut natif hidden.
MESURE : tout tabpanel de tabindex=0 présente un indicateur de focus visible à la prise de focus clavier
l'arrivée au clavier, y compris vide (BORDER-UI documente explicitement cette exception : un panneau
d'onglet `tabindex="0"` **n'est pas** une cible de focus programmatique masquée, l'anneau reste dû).
Le volet non courant est masqué par l'attribut natif `hidden` quand `keepMounted` est actif, ou
simplement absent du DOM sinon.

## Frontières — aucune valeur en dur

RÈGLE [TABS-U09] : tout référence un token existant : couleurs par rôle (`color.text-secondary`,
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Toute valeur de couleur, d'espacement, de rayon, de relief, de mouvement, de focus et de typographie du composant référence un token existant, aucune valeur brute n'étant écrite dans le composant.
MESURE : aucune valeur littérale de couleur, de durée, de rayon ou d'espacement n'apparaît dans le code du composant
`color.text-primary`, `color.primary`, `color.border`, `color.border-strong`, `color.surface`,
`color.background`, `control.focus-color`), espacement (`spacing.xs`, `spacing.sm`, `spacing.md`,
`spacing.lg`), rayon (`radius.pill`), relief (`elevation.raised`), mouvement (`motion.fast`,
`motion.ease-out`), focus (`border.focus-width`, `border.focus-offset`), typographie
(`typography.body`, `typography.display.fontWeight`). Aucune couleur, durée ou rayon n'est écrit en
clair dans le composant.

## Sources et niveau de confiance (couche UI)
| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| T1 | `label` obligatoire sur la tablist (nom accessible du groupe) | [ARIA APG — Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) | Établi |
| T2 | Anneau de focus dû sur un tabpanel `tabindex="0"`, même vide | `BORDER-UI.md` § Focus ring — exception cible programmatique | Établi (interne) |
| T3 | Poids + trait/fond comme canal non chromatique de l'onglet courant | convergence avec `LINK-UI.md` (état courant de navigation) | Établi par convergence |
| T4 | Absence de token `text-disabled` — dette assumée | `BUTTON-UI.md` (« disabled … dette assumée tant qu'un besoin réel ne l'a pas fait émerger ») | Non formalisé |
| T5 | L'information visuelle nécessaire à identifier un composant d'interface et son état atteint un contraste de 3:1, un contour n'étant pas exigé lorsque le composant présente un contenu visible suffisamment contrasté | [WCAG 2.2 — 1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) | Établi, standard (niveau AA) — arbitre la dispense de seuil que U04 accorde au séparateur bas de la variante ligne (délimitation de groupe, non porteuse d'état : dispense recevable) mais pas au trait de l'onglet courant, qui identifie l'état sélectionné et reste soumis au 3:1 ; le fichier UI ne pose ce seuil nulle part |
| T6 | Toute interface opérable au clavier dispose d'un mode où l'indicateur de focus clavier est visible | [WCAG 2.2 — 2.4.7 Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html) | Établi, standard (niveau AA) — donne son ancrage normatif à l'exception interne de BORDER-UI invoquée par U08 (anneau dû sur un tabpanel focalisable, même vide) |
| T7 | Si la liste d'onglets possède une étiquette visible, l'élément role=tablist la référence par aria-labelledby ; c'est seulement à défaut d'étiquette visible qu'il porte un aria-label | [ARIA APG — Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) | Établi (pratique de référence W3C) — divergence relevée : U01 impose une prop label rendue en aria-label et n'ouvre aucune voie vers aria-labelledby, ce qui inverse l'ordre de préférence du motif et duplique l'étiquette quand un titre visible coiffe déjà la liste |
| T8 | La couleur n'est jamais le seul moyen visuel de véhiculer une information, d'indiquer une action, d'appeler une réponse ou de distinguer un élément visuel | [WCAG 2.2 — 1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) | Établi, standard (niveau A) — la couche UI invoquait le « canal non chromatique » par renvoi à la couche UX sans référence normative propre ; à noter, le document d'explication de 1.4.1 ne traite pas explicitement le cas des onglets |

*Toute règle sans source explicite repose sur un raisonnement de mécanisme (cohérence avec les fondations voisines).*
