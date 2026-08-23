---
component: overlay
layer: ux
type: foundation
version: 1.0.0 # 1.0.0 : première rédaction — fondation née du besoin prouvé « off-canvas du shell » (AppShell, 2026-07-24) et de la case réservée par ELEVATION (« premier consommateur d'overlay modal : échelle z-index et scrim ») et déléguée par ACCESSIBILITY (« ordre et absence de piège au futur composant modal »). Périmètre arbitré : fondation overlay + Drawer ; modale/popover/dropdown/tooltip mappés, différés. Cf. DECISIONS.md 2026-07-24.
last_updated: 2026-07-24
companion: OVERLAY-UI.md
confidence: mixed # la mécanique modale (piège de focus, Échap, retour au déclencheur, fond inerte) est établie (ARIA APG dialog, WCAG) ; l'ordre des couches z-index est établi par convergence ; le nombre de crans et les valeurs exactes sont un arbitrage interne.
---

# Overlay — Couche UX (fondation)

> Cette fondation porte la **couche au-dessus du flux** : ce qui recouvre le contenu au lieu de s'y insérer.
> Elle ne dessine aucun composant ; elle pose la mécanique que **drawer, modale, popover, dropdown, tooltip**
> (et le toast existant) partagent : ordre d'empilement, voile, gestion du focus, verrouillage du défilement,
> inertie du fond, fermeture. ELEVATION avait déjà nommé cette couche (« au-dessus du flux — toast, modale,
> popover, menu ») et lui réservait « l'échelle z-index et le scrim » ; ACCESSIBILITY lui déléguait « l'ordre
> et l'absence de piège » de focus. Cette fondation remplit ces deux cases.

## Note de transposition — ce que la fondation est, et n'est pas

RÈGLE [OVERLAY-R01] : `overlay` est une **fondation sans axes** (ni style/tone/size) — une propriété transversale, pas un
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Overlay est une fondation sans axes : elle possède l'échelle z-index, le token de voile, le contrat de focus en superposition, le verrouillage du défilement, l'inertie du fond et les patterns de fermeture ; elle délègue l'ombre à ELEVATION, l'anneau de focus à BORDER, les durées et courbes à MOTION, le wording à VOICE et l'ordre de focus général à ACCESSIBILITY.
composant. Elle **possède** : l'échelle `z-index`, le token `overlay.scrim`, le contrat de focus en
superposition (piège, retour), le verrouillage du défilement, l'inertie du fond, les patterns de fermeture.
Elle **délègue** : l'**ombre** d'un superposé à ELEVATION (`elevation.overlay`), le **focus ring** à BORDER,
les **durées/courbes** d'entrée-sortie à MOTION, le **wording** d'un titre à VOICE, l'**ordre de focus
général** à ACCESSIBILITY (qui, elle, lui a délégué le seul piège en superposition).

## La distinction fondatrice : modal vs non-modal

RÈGLE [OVERLAY-R02] : tout superposé est **modal** ou **non-modal**, et ce choix détermine toute sa mécanique.
STATUT : propriété universelle
SOURCE : S1, S4, S6
ÉNONCÉ : Tout superposé est soit modal, soit non-modal, et ce choix détermine l'intégralité de sa mécanique : présence d'un voile, piège de focus, inertie du fond, verrouillage du défilement, mode de fermeture et ancrage.
MESURE : chaque superposé est déclaré modal ou non-modal ; aucun superposé ne combine voile et fond actif, ni piège de focus et absence de voile

| | **Modal** | **Non-modal** |
|---|---|---|
| Exemples | modale/dialog, **drawer / off-canvas** | popover, dropdown/menu, tooltip (+ toast, existant) |
| Voile (scrim) | oui | non |
| Focus | **piégé** dans le superposé ; fond **inerte** | libre ; fond actif |
| Fermeture | Échap + bouton ; retour du focus au déclencheur | **light-dismiss** (Échap OU clic/focus dehors) |
| Défilement du fond | **verrouillé** | libre |
| Ancrage | centré (modale) ou bord (drawer) | **ancré au déclencheur** |

> **Pourquoi cette ligne d'abord** : elle décide du scrim, du piège, du scroll-lock et de l'inertie d'un coup.
> Un superposé mal rangé (une modale sans piège, un popover avec scrim) trahit l'attente de l'utilisateur.

## Ordre d'empilement (z-index)

RÈGLE [OVERLAY-R03] : tout superposé référence un cran de `z-index` — jamais un entier codé en dur. Cinq couches, dans
STATUT : parti pris d'identité
SOURCE : S3, S5
ÉNONCÉ : Tout superposé applique un cran de l'échelle z-index du système plutôt qu'un entier codé en dur, dans l'ordre sticky < overlay (modal) < popover (non-modal ancré) < toast < tooltip.
MESURE : aucune valeur numérique de z-index écrite en dur dans le code d'un superposé
cet ordre : `z-index.sticky` (collant dans le flux) < `z-index.overlay` (modal : scrim + surface) <
`z-index.popover` (non-modal ancré) < `z-index.toast` < `z-index.tooltip`.

> **Pourquoi popover AU-DESSUS de overlay** : un menu ou un tooltip ouvert *depuis* une modale doit passer
> au-dessus d'elle (règle APG). **Pourquoi le tooltip tout en haut** : un libellé au survol ne doit jamais
> être masqué. CONFIANCE : l'ordre est établi par convergence (Bootstrap/Material/Microsoft) ; le nombre de
> crans (cinq) est un arbitrage interne compact.

## Voile (scrim)

RÈGLE [OVERLAY-R04] : un superposé **modal** pose un **voile** `overlay.scrim` entre le fond et sa surface — il assombrit
STATUT : propriété universelle
SOURCE : S1, S7
ÉNONCÉ : Un superposé modal pose un voile entre le contenu devenu inerte et sa surface ; un superposé non-modal n'en pose jamais. Le voile partage la couche z-index du superposé et est rendu derrière sa surface.
MESURE : un superposé modal a exactement un voile ; un superposé non-modal en a zéro
le contenu inerte et concentre l'attention. Un superposé **non-modal n'a jamais de voile**. Le scrim partage
la couche `z-index.overlay` (rendu derrière la surface par ordre du DOM), il n'ajoute pas de cran.

RÈGLE [OVERLAY-R05] : un clic sur le voile **ferme** le superposé modal (équivalent d'une annulation) — cohérent avec le
STATUT : parti pris d'identité
SOURCE : S4
ÉNONCÉ : Un clic sur le voile ferme le superposé modal comme le ferait une annulation, sauf lorsqu'une perte de saisie est en jeu : le propriétaire du superposé demande alors confirmation avant de fermer.
MESURE : un clic sur le voile déclenche la même action que le bouton d'annulation du superposé
light-dismiss du non-modal, sauf quand une perte de saisie est en jeu (le propriétaire du superposé décide
alors de confirmer avant de fermer).

## Focus et clavier

RÈGLE [OVERLAY-R06] : (**modal**) à l'ouverture, le focus **entre** dans le superposé (premier élément focalisable, ou la
STATUT : propriété universelle
SOURCE : S1, S2
ÉNONCÉ : À l'ouverture d'un superposé modal, le focus entre dans le superposé ; Tab et Maj+Tab bouclent à l'intérieur ; le fond est inerte, inatteignable au clavier comme au lecteur d'écran ; Échap ferme ; à la fermeture, le focus revient au déclencheur, ou à l'élément le plus pertinent si le déclencheur a disparu.
MESURE : aucun élément focalisable hors du superposé n'est atteignable au clavier pendant qu'il est ouvert ; Échap ferme ; le focus revient au déclencheur à la fermeture
surface avec `tabindex=-1`) ; **Tab / Maj+Tab bouclent** à l'intérieur (piège) ; le fond est **inerte**
(`aria-modal` / `inert`, non atteignable au clavier ni au lecteur d'écran) ; **Échap ferme** ; à la
fermeture, le focus **revient au déclencheur** (ou à l'élément qui a le plus de sens si le déclencheur a
disparu). Source : ARIA APG, motif *Dialog (Modal)*.

> **Pourquoi le piège est admis** malgré WCAG 2.1.2 (« pas de piège au clavier ») : le critère exige un moyen
> de sortie au clavier ; **Échap est ce moyen**. Le piège modal, échappable, est le motif accepté — pas une
> violation.

RÈGLE [OVERLAY-R07] : (**non-modal**) **pas de piège**, le fond reste actif ; le superposé se ferme en **light-dismiss**
STATUT : propriété universelle
SOURCE : S4, S8
ÉNONCÉ : Un superposé non-modal ne piège jamais le focus et laisse le fond actif ; il se ferme en light-dismiss (Échap ou clic/focus en dehors), rend le focus au déclencheur et reste ancré à ce déclencheur.
MESURE : le fond reste focalisable pendant l'ouverture ; Échap et un clic en dehors ferment tous deux le superposé ; le focus revient au déclencheur
(Échap OU clic/focus en dehors) et rend le focus au déclencheur ; il reste **ancré** au déclencheur.

## Défilement et inertie du fond

RÈGLE [OVERLAY-R08] : un superposé **modal verrouille le défilement** du fond tant qu'il est ouvert (le fond ne bouge pas
STATUT : propriété universelle
SOURCE : S1, S6
ÉNONCÉ : Un superposé modal verrouille le défilement du fond et rend ce fond inerte tant qu'il est ouvert ; un superposé non-modal ne verrouille rien et ne rend rien inerte.
MESURE : pendant qu'un modal est ouvert, le document ne défile pas et aucun élément du fond n'est focalisable ni exposé au lecteur d'écran
sous le superposé) et rend le fond **inerte**. Un superposé **non-modal ne verrouille rien** et ne rend rien
inerte : la page vit normalement autour de lui.

## Mouvement

RÈGLE [OVERLAY-R09] : l'entrée et la sortie d'un superposé utilisent les durées/courbes de MOTION (une grande surface
STATUT : parti pris d'identité
SOURCE : S9
ÉNONCÉ : L'entrée et la sortie d'un superposé utilisent les durées et courbes de MOTION — une grande surface relève de la durée lente — et respectent prefers-reduced-motion en supprimant le glissement ; l'ombre s'anime en opacité et jamais par interpolation de box-shadow.
MESURE : sous prefers-reduced-motion: reduce, aucune translation à l'entrée ni à la sortie
relève de `motion.slow`) et **respectent `prefers-reduced-motion`** (apparition sans glissement si réduit).
L'ombre suit `elevation.overlay` — animée en opacité, jamais en `box-shadow` interpolé (règle ELEVATION).

## Frontières (ce que la fondation ne fait pas)

RÈGLE [OVERLAY-R10] : l'**ombre** d'un superposé est `elevation.overlay` — overlay la **consomme**, ne la redéfinit pas.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Overlay ne redéfinit ni l'ombre (elevation.overlay), ni l'anneau de focus (BORDER), ni l'ordre de focus général et la non-occultation de la cible focalisée (ACCESSIBILITY, BORDER), ni le wording d'un titre (VOICE), ni les règles propres du toast : il ne possède que le piège de focus en superposition et le cran z-index qu'il prête au toast.
Le **focus ring** reste BORDER ; l'**ordre de focus général** et « la cible focalisée n'est jamais masquée »
restent ACCESSIBILITY/BORDER — overlay ne possède que le **piège en superposition** délégué. Le **toast**
(composant existant) garde ses propres règles (empilement FIFO, auto-dismiss) ; overlay ne lui apporte que le
cran `z-index.toast`. Le **wording** d'un titre de modale reste VOICE.

## Sources et niveau de confiance (couche UX)
| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| S1 | Focus modal : entre à l'ouverture, piège Tab/Maj+Tab, Échap ferme, retour au déclencheur, fond inerte | [ARIA APG — Dialog (Modal)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) | Établi |
| S2 | Le piège modal est admis car Échap fournit la sortie clavier | [WCAG 2.1.2 — No Keyboard Trap](https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html) | Établi |
| S3 | Ordre des couches z-index (sticky < overlay/backdrop < popover < tooltip < toast) | [Material Style — Z-index](https://materialstyle.github.io/materialstyle/3.1/layout/z-index/), [Microsoft Atlas — Z-index](https://design.learn.microsoft.com/tokens/z-index.html) | Établi par convergence |
| S4 | Popover/menu/tooltip non-modaux, ancrés au déclencheur, light-dismiss | [Carbon — Popover](https://carbondesignsystem.com/components/popover/usage/) | Établi |
| S5 | Nombre de crans (cinq), valeurs exactes, opacité du scrim (50 %) | Arbitrage interne au produit | Non formalisé — à éprouver |
| S6 | La plateforme distingue nativement modal et non-modal : show() affiche un dialogue modeless, showModal() met le dialogue dans le top layer et rend le document « blocked by the modal dialog », donc inerte hors du dialogue | [WHATWG HTML — The dialog element](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element) | Établi, spécification normative — le verrouillage du défilement, lui, n'y figure pas |
| S7 | Le voile est une propriété du modal, pas du superposé en général : une boîte ::backdrop n'est rendue que pour les éléments du top layer — un dialogue ouvert par show() n'en a aucune | [MDN — ::backdrop](https://developer.mozilla.org/en-US/docs/Web/CSS/::backdrop) | Établi, documentation de référence adossée à la spécification CSS Position 4 |
| S8 | Light-dismiss du non-modal : un popover auto se ferme par un clic en dehors ou par Échap, reste toujours non-modal, et le focus revient à l'invocateur à la fermeture clavier | [MDN — Using the Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using) | Établi, comportement normalisé par la plateforme |
| S9 | prefers-reduced-motion détecte que l'utilisateur a demandé la réduction des animations non essentielles ; la valeur reduce impose de supprimer, réduire ou remplacer le mouvement | [MDN — prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) | Établi, media feature standard |

*Toute règle sans source explicite repose sur un raisonnement de mécanisme (cohérence interne, ergonomie).*
