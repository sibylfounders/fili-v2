---
sujet: touch
type: fondation
resume: "Taille et atteinte des cibles tactiles : trois crans (touch.target-min 24 / comfortable 44 / spacing 8), confort par défaut, plancher + exceptions inline/essentiel, l'appui remplace le survol, annulation au relâchement"
requires: []
selon-contexte: ["gesture (le mouvement fait SUR la cible : swipe, drag, pinch — langage voisin)"]
---
# RULES — Touch / entrée tactile (compilé, condensé)

> Généré depuis `foundations/touch/TOUCH-UX.md` (v1.0.0) et `TOUCH-UI.md` (v1.0.0). Règles condensées pour le build — la source fait autorité. Ne pas éditer à la main. Tokens : `dist/tokens.yaml`.

## Nature
- Fondation qui tokenise la **taille** et l'**atteinte** d'une cible tactile. Comble une déduction silencieuse : le « 44px tactile » était cité par `scale.desktop-min` sans jamais être nommé.
- **Le doigt n'est pas une souris** : imprécis (~9 mm), il masque sa cible, pas de survol fiable. La cible a donc une taille plancher, une taille confortable, un espacement minimal.
- **Règle cardinale : la cible n'est pas l'icône.** La zone qui reçoit le doigt (hit target) peut déborder le dessin — une icône `icon.md` (20) se touche dans une cible de 44 par le padding. Réduire le dessin ne réduit jamais la cible.

## Les trois crans
- `touch.target-comfortable` (44) — cible **par défaut** au doigt : toute action principale ou fréquente. Convergence WCAG 2.5.5 AAA + Apple HIG (44 pt).
- `touch.target-min` (24) — **plancher absolu** (WCAG 2.5.8 AA) : cible dense justifiée seulement. **Sous ce plancher → STOP et remonte**, sauf exception déclarée.
- `touch.target-spacing` (8) — **écart minimal** entre deux cibles adjacentes. Quand la densité force le plancher, l'espacement n'est **pas** optionnel.

## Les deux exceptions au plancher (déclarées, jamais présumées)
- **Inline** — cible prise dans le fil d'un texte (lien dans un paragraphe) : suit la ligne, on ne gonfle pas l'interligne.
- **Essentiel** — la petitesse est intrinsèque à la fonction (point précis sur une carte, poignée fine). Toute autre cible sous le plancher = défaut.

## Atteinte
- Actions primaires/fréquentes → **zone atteignable** (bas et centre, à une main). Haut d'écran et coins → actions **peu fréquentes** (coût de repositionnement, loi de Fitts).
- Jamais de cible tapable en conflit avec un **geste système** (bord, encoche, barre d'accueil).

## L'appui remplace le survol
- Pas de hover au doigt : le **press** est le signal d'affordance. Rien (info ni action) ne vit derrière le seul `:hover` — sous `(hover: none)`, tout reste accessible. Règle partagée avec le langage interaction (affordance) et motion (feedback de press) ; propriétaire ici = entrée physique.
- Action au **relâchement sur la cible**, jamais au premier contact : glisser hors avant de lever **annule** (WCAG 2.5.2). Un contrôle custom qui agit sur `pointerdown` casse cette issue.
- **Retour haptique** = supplément facultatif, jamais un canal unique.

## Application (UI)
- Cible garantie par **`min-height`/`min-width`**, pas la seule hauteur de contenu ; hit-area étendue (padding, `::before`) sans agrandir le dessin.
- Régime tactile via **`@media (pointer: coarse)`** / `(hover: none)` : cible principale → `touch.target-comfortable`, aucune affordance sur le seul hover. Sur pointeur fin, densité serrée permise, plancher toujours à `touch.target-min`.
- Consommateurs : button, input/select, switch/checkbox, icon-only, ligne d'action → visent le confort (coarse) ; lien inline exempté.

## Risque
| Cas | Risque | Sévérité |
|---|---|---|
| Cible < `touch.target-min` hors exception | Ratage systématique au doigt | Élevée |
| Cibles collées sans espacement | Action voisine déclenchée | Élevée |
| Fonction derrière le seul hover | Invisible au doigt et au clavier | Élevée |
| Cible = dessin au lieu de zone | Cible réelle trop petite | Élevée |
| Action fréquente en haut d'écran | Coût d'atteinte répété | Moyenne |
| Taille figée en px absolu | Ne suit pas le zoom | Moyenne |

CONFIANCE : 24 (AA) et 44 (AAA/HIG) = établi (WCAG 2.5.8 / 2.5.5, Apple HIG, Material 48/8) ; annulation au relâchement = établi (WCAG 2.5.2). Le choix des trois crans (24/44/8) et « confort par défaut » = décision interne datée 2026-07-25. Cible sous le plancher hors exception, ou fonction sans équivalent clavier : STOP, remonter.
