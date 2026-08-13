---
sujet: overlay
type: fondation
resume: "La couche au-dessus du flux : distinction modal/non-modal, ordre d'empilement z-index (5 crans), scrim, piège de focus, scroll-lock, inertie du fond, patterns de fermeture ; l'ombre reste elevation.overlay"
requires: []
selon-contexte: ["elevation (l'ombre d'un superposé = elevation.overlay ; overlay la consomme, ne la redéfinit pas)", "motion (durées/courbes d'entrée-sortie ; ombre animée en opacité)", "border (focus ring d'un contrôle dans le superposé)"]
---
# RULES — Overlay (compilé, condensé)

> Généré depuis `foundations/overlay/OVERLAY-UX.md` (v1.0.0) et `OVERLAY-UI.md` (v1.0.0). Règles condensées pour le build — la source fait autorité. Ne pas éditer à la main. Tokens : `dist/tokens.yaml`.

## Nature
- Fondation **sans axes**. Elle porte la **couche au-dessus du flux** : ce qui recouvre le contenu au lieu de s'y insérer. Mécanique partagée par drawer, modale, popover, dropdown, tooltip (et le toast existant).
- Elle **possède** : échelle `z-index`, token `overlay.scrim`, piège de focus en superposition, scroll-lock, inertie du fond, fermeture. Elle **délègue** : l'ombre à `elevation.overlay`, le focus ring à `border`, les durées à `motion`, le wording à `voice`, l'ordre de focus général à `accessibility`.

## Modal vs non-modal (la distinction fondatrice)
| | Modal (drawer, modale) | Non-modal (popover, dropdown, tooltip, toast) |
|---|---|---|
| Scrim | oui | non |
| Focus | piégé, fond inerte | libre, fond actif |
| Fermeture | Échap + bouton, retour au déclencheur | light-dismiss (Échap ou clic/focus dehors) |
| Scroll de fond | verrouillé | libre |
| Ancrage | centré / bord | ancré au déclencheur |

## z-index — cinq crans (jamais un entier en dur)
`z-index.sticky` (100) < `z-index.overlay` (1000, scrim + surface modale) < `z-index.popover` (1100, non-modal ancré) < `z-index.toast` (1200) < `z-index.tooltip` (1300).
- popover > overlay : un menu ouvert depuis une modale passe au-dessus d'elle. tooltip au sommet : jamais masqué. Le scrim partage la couche `overlay` (derrière la surface par ordre DOM), pas un cran de plus.

## Scrim
- Un superposé **modal** pose `overlay.scrim` (plein, `position: fixed`, sous la surface) ; un **non-modal n'a jamais de scrim**. Clic sur le scrim = fermeture (sauf perte de saisie → confirmer).

## Focus / clavier
- **Modal** : focus entre à l'ouverture ; Tab/Maj+Tab bouclent (piège) ; fond **inerte** (`aria-modal`/`inert`) ; **Échap ferme** ; focus **revient au déclencheur**. WCAG 2.1.2 respecté car Échap est la sortie clavier.
- **Non-modal** : pas de piège, fond actif ; light-dismiss ; ancré au déclencheur.

## Scroll & mouvement
- Modal : **scroll de fond verrouillé** + fond inerte tant que ouvert. Non-modal : rien de verrouillé.
- Entrée/sortie en durée `motion` (grande surface → `motion.slow`), ombre `elevation.overlay` animée en opacité, `prefers-reduced-motion` respecté.

## Frontières
- L'**ombre** reste `elevation.overlay` (consommée, pas redéfinie) ; le **focus ring** reste `border` ; l'**ordre de focus général** reste `accessibility` (qui délègue le seul piège en superposition) ; le **toast** garde ses règles (n'emprunte que `z-index.toast`) ; le **wording** reste `voice`.

## Risque
| Cas | Risque | Sévérité |
|---|---|---|
| z-index codé en dur | Guerre d'empilement, dérive | Élevée |
| Modale sans piège de focus / sans retour au déclencheur | Utilisateur clavier perdu, WCAG 2.4.3 cassé | Élevée |
| Modale sans fond inerte / sans scroll-lock | Le fond « fuit » sous le superposé | Moyenne-élevée |
| Popover avec scrim, ou modale sans | Attente utilisateur trahie (modal/non-modal confondus) | Moyenne |
| Ombre d'un superposé redéfinie hors elevation | Deux sources d'ombre divergentes | Moyenne |

CONFIANCE : mécanique modale (piège, Échap, retour, inertie) = établie (ARIA APG *Dialog*, WCAG 2.1.2). Ordre z-index = établi par convergence (Bootstrap/Material/Microsoft). Nombre de crans (5), valeurs et opacité du scrim (50 %) = arbitrage interne daté 2026-07-24, réversible.
