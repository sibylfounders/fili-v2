---
component: modal
layer: ui
type: component
version: 1.1.0 # 1.1.0 : la surface passe de `radius.md` à `radius.lg` — application de l'axe conteneur/contrôle déclaré par RADIUS-R12 (arbitrage Aurélien 2026-08-03). La modale portait le rayon d'un contrôle : toute card `radius.lg` posée dedans était plus ronde que son conteneur, l'« oreille » que RADIUS-R06 interdit. Aucun autre changement. 1.0.1 : le verrou de défilement porte sur la région défilante du shell, pas sur le document, et aucun focus ne fait défiler (preventScroll) — correction d'un saut de page observé le 2026-07-26 à la fermeture par clic sur le voile. 1.0.0 : 1.0.0 : première rédaction — mapping tokens de l'implémentation réelle (packages/react/src/components/modal/modal.tsx), livrée le 2026-07-26 avant sa doctrine. Aucun token neuf hormis grid.overlay (DESIGN.md 1.32.0, déjà introduit pour ce composant). Cf. MODAL-UX.md, DECISIONS.md 2026-07-26.
last_updated: 2026-07-26
companion: MODAL-UX.md
confidence: mixed
---

# Modal — Couche UI (tokens)

> Mapping des contextes de `MODAL-UX.md` sur les tokens. Aucune valeur brute : tout référence `DESIGN.md`.
> Modal **consomme** intégralement `OVERLAY-UI.md` (z-index, scrim, ombre, focus) — ce fichier ne fait que
> nommer où et comment.

## Structure (API réelle)

Composé `Modal` = `Modal.Root` (alias `Modal`) + `.Header` + `.Body` + `.Footer` + `.Close`, portés par
`packages/react/src/components/modal/modal.tsx` :

```
<Modal open={open} onClose={onClose} size="narrow" dismissOnScrim>
  <Modal.Header kicker="Optionnel" level={2}>Titre de la modale</Modal.Header>
  <Modal.Body>Contenu, défile seul au-delà de la hauteur disponible</Modal.Body>
  <Modal.Footer>
    <Button variant="stroke" tone="neutral" onClick={onClose}>Annuler</Button>
    <Button variant="filled" tone="destructive">Supprimer</Button>
  </Modal.Footer>
</Modal>
```

RÈGLE [MODAL-U01] : `Header` pose automatiquement `aria-labelledby` sur la surface (`role="dialog"`, `aria-modal="true"`)
STATUT : implémentation de référence
SOURCE : T1, T5
ÉNONCÉ : L'en-tête du composant établit lui-même la liaison entre le titre et la surface, qui porte role="dialog" et aria-modal="true", sans identifiant à câbler à la main ; une modale sans en-tête reçoit un aria-label explicite.
MESURE : aucune modale du produit ne câble d'aria-labelledby manuellement ; toute modale sans en-tête déclare un aria-label non vide
via son titre — aucun ID à câbler à la main. Sans `Header`, passer `aria-label` sur `Modal`.

## Props

| Prop | Rôle | Défaut |
|---|---|---|
| `open` | Monte/démonte la modale (portail vers `document.body`) | requis |
| `onClose` | Appelé par Échap, la croix, et le clic-voile (si actif) | requis |
| `size` | `narrow` (`grid.container-narrow`) ou `default` (`grid.overlay`) | `narrow` |
| `dismissOnScrim` | Clic sur le voile = fermeture | `true` |
| `Header.closable` | Affiche `Modal.Close` dans l'en-tête | `true` |
| `Header.level` | Niveau de titre (`h2`/`h3`/`h4`) | `2` |

## Largeur — deux crans GRID, jamais un de plus

RÈGLE [MODAL-U02] : `size="narrow"` applique `max-width: grid.container-narrow` (480) — la modale de confirmation et de
STATUT : parti pris d'identité
SOURCE : T4
ÉNONCÉ : La modale n'admet que deux crans de largeur : un cran étroit pour la confirmation et la saisie courte, un cran par défaut pour le détail, l'illustration et le tableau court ; aucun troisième cran n'existe, un contenu plus large relevant d'une page.
MESURE : la prop de taille n'accepte que les deux valeurs déclarées ; aucune largeur maximale de modale hors des deux jetons de grille correspondants
saisie courte. `size="default"` applique `max-width: grid.overlay` (640) — la modale de détail, d'illustration
ou de tableau court. Aucun autre cran : au-delà, `MODAL-UX.md` renvoie à une page.

## Voile, empilement, ombre

RÈGLE [MODAL-U03] : le voile applique `overlay.scrim` en `position: fixed`, inset 0, rendu **avant** la surface dans le
STATUT : implémentation de référence
SOURCE : T1, T2, T8
ÉNONCÉ : Le voile est rendu en position fixe sur tout le cadre d'affichage et avant la surface dans l'ordre du document, donc derrière elle, les deux partageant le même cran d'empilement ; la surface porte l'ombre de superposé, un rayon, un fond et une bordure référencés en jetons.
MESURE : le voile précède la surface dans l'ordre du document ; aucune couleur, ombre, rayon ni valeur d'empilement écrite en dur
DOM (donc derrière) — les deux partagent `z-index.overlay`, hérité tel quel d'`OVERLAY-UI.md`. La surface
porte `elevation.overlay` (jamais `elevation.raised`), un rayon **`radius.lg`** (cran CONTENEUR — la modale
est le plus grand conteneur du système ; `radius.md` jusqu'au 2026-08-03, un cran de contrôle qui rendait
non concentrique toute card `lg` posée dedans, cf. RADIUS-R06/R12), un fond `background`, une
bordure `border-border`.

## Focus, scroll-lock, inertie (état réel de l'implémentation)

RÈGLE [MODAL-U04] : à l'ouverture, le focus **entre** dans la surface (premier élément `FOCUSABLE`, sinon la surface
STATUT : implémentation de référence
SOURCE : T1
ÉNONCÉ : L'implémentation réalise le contrat de focus par un piège manuel géré au clavier : le focus entre dans la surface à l'ouverture, sur le premier élément focalisable ou sur la surface elle-même rendue focalisable par programme, Tab et Maj+Tab bouclent entre le premier et le dernier élément focalisable, et la fermeture restitue le focus à l'élément actif capturé à l'ouverture.
MESURE : Tab depuis le dernier élément focalisable ramène au premier ; à la fermeture, l'élément focalisé est celui qui était actif à l'ouverture
elle-même via `tabindex=-1`) ; Tab/Maj+Tab **bouclent** entre le premier et le dernier élément focalisable
(piège manuel, géré par le gestionnaire `onKeyDown`) ; à la fermeture, le focus **revient** à
`document.activeElement` capturé à l'ouverture. Le défilement du `body` est verrouillé (`overflow: hidden`)
tant que `open` est vrai, et restauré à la fermeture.

RÈGLE [MODAL-U05] : le ring de focus interne d'un contrôle dans la modale reste `border.focus-width` /
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Le composant ne redéfinit à aucun endroit l'anneau de focus des contrôles qu'il héberge ni celui de son propre bouton de fermeture : la largeur et le décalage de l'anneau restent la propriété du langage de bordure.
`border.focus-offset` — le composant ne le redéfinit à aucun endroit ; `Modal.Close` applique le même contrat
(`focus-visible:outline` en `border.focus-width`, décalage `border.focus-offset`).

**Limite assumée (identique au Drawer)** : le fond n'est **pas** mis `inert` — faute de référence à la racine
applicative dans ce package, l'inertie est **approchée** par la combinaison scrim + piège de focus manuel +
`aria-modal="true"`, pas par l'attribut `inert` natif. Un lecteur d'écran naviguant en mode « lecture »
(virtual cursor) plutôt qu'en interaction directe peut donc atteindre le fond. C'est un écart documenté à
`OVERLAY-UX.md` (qui prescrit `inert`), pas un oubli silencieux — même réserve que le composant Drawer.

## Fermeture

RÈGLE [MODAL-U06] : trois déclencheurs appellent `onClose` — la touche `Escape`, `Modal.Close` (croix par défaut de
STATUT : implémentation de référence
SOURCE : T1
ÉNONCÉ : Trois déclencheurs appellent la fermeture — la touche Échap, le bouton de fermeture de l'en-tête, et le clic sur le voile lorsqu'il est armé ; désarmer le clic sur le voile ne retire que ce troisième déclencheur.
MESURE : Échap et le bouton de fermeture appellent la fermeture quelle que soit la valeur de la prop de fermeture au voile
`Header`, `aria-label="Fermer"` si aucun enfant), et le clic sur le voile **si** `dismissOnScrim` est `true`
(défaut). Passer `dismissOnScrim={false}` désarme uniquement le troisième — Échap et la croix restent actifs
dans tous les cas (cf. `MODAL-UX.md` § La fermeture).

## Mouvement

RÈGLE [MODAL-U07] : l'entrée/sortie de la surface anime `opacity` + `translate-y` sur `motion.slow` (`ease-out`) — cran
STATUT : parti pris d'identité
SOURCE : T6
ÉNONCÉ : L'entrée et la sortie de la surface animent l'opacité et une translation verticale sur le cran de durée lent, le voile animant son opacité sur la même durée ; sous préférence de mouvement réduit, la transition est supprimée, jamais l'état final.
MESURE : sous prefers-reduced-motion: reduce, aucune transition n'est jouée et l'état final est atteint immédiatement
« grande surface » d'`OVERLAY-UI.md`. Le voile anime son `opacity` sur la même durée. Les deux respectent
`motion-reduce:transition-none` (`prefers-reduced-motion`), qui coupe la transition, pas l'état final.

## Frontières

RÈGLE [MODAL-U08] : aucune couleur, rayon, ombre, durée ou largeur codés en dur — tout référence `z-index.overlay`,
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Aucune couleur, rayon, ombre, durée, largeur ni espacement n'est écrit en dur dans le composant : toute valeur visuelle référence un jeton du système, et le séparateur du pied n'est posé qu'après avoir épuisé l'espacement.
MESURE : aucune valeur brute dans le fichier du composant ; toute valeur visuelle résout vers un jeton déclaré
`overlay.scrim`, `elevation.overlay`, `radius.lg`, `border.focus-width`/`border.focus-offset`,
`motion.slow`, `grid.container-narrow`, `grid.overlay`, l'espacement `space.*` (padding `lg`/`md`/`sm` du
`Header`/`Body`/`Footer`). Le `Footer` applique un séparateur `border-border` en trait supérieur — l'espace
d'abord, le trait en dernier recours (renvoi SPACING/BORDER, même garde-fou qu'Accordion).


## Verrou de défilement dans un shell (précision 1.0.1)

RÈGLE [MODAL-U09] : le verrou porte sur **la région qui défile réellement**, pas sur le document. Dans un shell
STATUT : implémentation de référence
SOURCE : interne
ÉNONCÉ : Le verrou de défilement porte sur la région qui défile réellement et non sur le document : l'implémentation verrouille le corps du document et chaque ancêtre défilant du déclencheur, puis restaure l'état d'origine de chacun à la fermeture.
MESURE : à l'ouverture, chaque ancêtre défilant du déclencheur porte un débordement masqué ; à la fermeture, la valeur d'origine de chacun est restaurée
applicatif, `document.body` ne défile pas : c'est le `<main>` de l'AppLayout qui porte
`overflow-y: auto`. Verrouiller le body seul ne verrouille rien. L'implémentation verrouille le body
**et chaque ancêtre défilant du déclencheur** (`lib/scroll-lock.ts`), et restaure l'état d'origine à la
fermeture.

RÈGLE [MODAL-U10] : aucun `focus()` d'un superposé ne fait défiler quoi que ce soit — entrée du focus comme retour
STATUT : implémentation de référence
SOURCE : T7
ÉNONCÉ : Aucune prise de focus liée à un superposé ne fait défiler quoi que ce soit : l'entrée du focus comme son retour au déclencheur demandent explicitement au navigateur de ne pas amener l'élément dans le champ de vision.
MESURE : tout appel de focus du composant passe l'option preventScroll à vrai
au déclencheur utilisent `{ preventScroll: true }`. Le déclencheur est déjà à sa place puisque le fond
n'a pas bougé ; laisser le navigateur « révéler » la cible produit un saut visible.

> **Erreur fréquente** : `document.body.style.overflow = "hidden"` recopié depuis un exemple de page
> classique. Dans une app à régions, c'est un verrou qui ne verrouille pas — le fond glisse sous la
> modale, et le retour du focus ramène l'utilisateur ailleurs qu'où il avait cliqué.

## Sources et niveau de confiance

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| T1 | Voile `overlay.scrim` sous la surface, même couche `z-index.overlay` | `OVERLAY-UI.md`, [ARIA APG — Dialog (Modal)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) | Établi |
| T2 | Ombre `elevation.overlay`, jamais `raised` | `OVERLAY-UI.md`, renvoi ELEVATION | Établi |
| T3 | Piège de focus manuel + `aria-modal` en l'absence d'`inert` natif est une approximation acceptable, pas une conformité totale | [ARIA APG — Dialog (Modal)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) (prescrit `inert`/`aria-hidden` du fond) | Cas isolé — écart documenté, à combler si une racine applicative devient disponible |
| T4 | Deux crans de largeur (`grid.container-narrow` 480 / `grid.overlay` 640) | Arbitrage interne, `DESIGN.md` 1.32.0, `DECISIONS.md` 2026-07-26 | Non formalisé — arbitrage à remonter si un troisième cran est demandé |
| T5 | Le nom et le rôle de tout composant d'interface doivent pouvoir être déterminés par programme — la liaison automatique du titre à la surface est l'implémentation de cette obligation | [WCAG 2.2 — 4.1.2 Name, Role, Value (A)](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html) | Établi — critère normatif vérifié |
| T6 | prefers-reduced-motion détecte la demande de réduction des animations non essentielles ; la valeur reduce impose de supprimer, réduire ou remplacer le mouvement, pas d'annuler l'état final | [MDN — prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) | Établi — media feature standard, vérifié |
| T7 | « A value of false for preventScroll (the default) means that the browser will scroll the element into view after focusing it. If preventScroll is set to true, no scrolling will occur » — le saut de page à la prise de focus est le comportement par défaut du navigateur, qu'il faut désactiver explicitement | [MDN — HTMLElement.focus()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) | Établi — documentation de référence vérifiée |
| T8 | La boîte ::backdrop est de la taille du cadre d'affichage et rendue immédiatement sous l'élément présenté dans le top layer ; seuls les éléments du top layer en obtiennent une, et un dialogue ouvert par show() n'en a aucune — le voile est donc une propriété du modal, jamais du superposé en général | [MDN — ::backdrop](https://developer.mozilla.org/en-US/docs/Web/CSS/::backdrop) | Établi — documentation de référence adossée à CSS Position 4, vérifiée |

*Toute règle sans source explicite repose sur un raisonnement de mécanisme (cohérence avec `OVERLAY-UI.md` et l'implémentation réelle de `modal.tsx`).*
