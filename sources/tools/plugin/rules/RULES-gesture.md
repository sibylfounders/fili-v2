---
sujet: gesture
type: langage
resume: "Le geste (swipe, drag, appui long, pinch) est un raccourci, jamais le seul chemin : alternative à pointeur unique (2.5.1) / sans glisser (2.5.7) / motion actuation (2.5.4) obligatoires, découvrabilité, seuil et annulation"
requires: []
selon-contexte: ["touch (la taille et l'atteinte des cibles et des alternatives — fondation voisine)"]
---
# RULES — Gesture / gestes (compilé, condensé)

> Généré depuis `languages/gesture/GESTURE-UX.md` (v1.0.0) et `GESTURE-UI.md` (v1.0.0). Langage comportemental — aucun token propre (compose `motion.*` pour le retour, `touch.*` pour les cibles). Ne pas éditer à la main. La source fait autorité.

## Nature
- Langage du **mouvement fait sur une cible** : balayer, glisser-déposer, appui long, multipoint. Pendant comportemental de la fondation `touch` (qui, elle, porte les tokens de taille).
- Un geste est **invisible** : ni libellé, ni bordure, ni état au repos. D'où deux exigences : **découvrable** (affordant visible) et **doublé** (alternative simple).
- **Règle cardinale : le geste est un raccourci, jamais une porte.** Il accélère pour l'expert ; il n'enlève l'accès à personne.
- **Contrainte ≠ parti pris** : les alternatives WCAG (2.5.1 / 2.5.7 / 2.5.4) sont non négociables ; le registre « raccourci seulement » est un parti pris d'identité interne.

## L'alternative (règle cardinale)
- Tout geste **à trajectoire (path-based) ou multipoint** → alternative à **pointeur unique** : la même fonction au tap/clic simple (WCAG 2.5.1, A). Balayer-pour-supprimer → un bouton supprimer existe aussi.
- Tout **glissement (drag)** → alternative **sans glisser** : boutons monter/descendre, « déplacer vers » (WCAG 2.5.7, AA).
- **Motion actuation** (secouer, incliner) → contrôle équivalent à l'écran **et** désactivable (WCAG 2.5.4, A).
- **Seule exception : le geste essentiel** — le tracé EST la donnée (signer, dessiner, carte libre). Déclarée, jamais présumée.

## Découvrabilité
- Un geste utile s'**annonce** (poignée, « peek », ombre, chevron) — frontière avec le langage interaction. Un geste sans indice est un secret.
- Respecter le **geste standard de plateforme** (swipe-back iOS, pull-to-refresh) plutôt qu'un concurrent maison.
- Aide au premier usage **ponctuelle**, non bloquante, non ré-affichée par défaut.

## Seuil, annulation, accident
- Déclenchement seulement au-delà d'un **seuil franc** (distance/durée) ; sous le seuil, rien. Le **défilement prime** sur un effleurement.
- **Annulable avant validation** : ramener et relâcher hors zone annule ; l'effet n'est acté qu'au seuil + relâchement dans la zone (parenté 2.5.2, `touch`).
- Retour d'accompagnement en **`transform`/`opacity`** (langage motion), coupé sous `prefers-reduced-motion` sans retirer la fonction.

## Accessibilité
- Toute fonction gestuelle est atteignable **au clavier** (contrat porté par le principe accessibility ; ce langage en est consommateur).
- L'**AT** capte ses propres gestes → l'action reste exposée par un **contrôle nommé**, pas un swipe brut.
- L'alternative à pointeur unique **est** l'accès pour la **motricité réduite**.

## Application (UI)
- Implémenter sur **Pointer Events** (`pointerdown/move/up/cancel`). L'action se lie à un **contrôle natif** (`<button>`/`<a>`) ; le geste est un raccourci branché par-dessus → alternative + clavier par construction.
- Cibles-alternatives = cibles tactiles ordinaires : `touch.target-comfortable` + `touch.target-spacing`.
- Affordant **statique et accessible** (peek, poignée) — jamais une animation seule ni le seul `:hover`.

## Risque
| Cas | Risque | Sévérité |
|---|---|---|
| Geste path/multipoint sans alternative | Fonction inaccessible (2.5.1) | Critique |
| Drag sans alternative sans glisser | Inaccessible en motricité réduite (2.5.7) | Critique |
| Motion actuation sans équivalent ni off | Déclenchement involontaire (2.5.4) | Élevée |
| Geste caché sans affordant | Découvert par personne | Élevée |
| Geste maison contre geste système | Conflit, action involontaire | Élevée |
| Pas de seuil (confusion scroll) | Action déclenchée en défilant | Moyenne |

CONFIANCE : alternatives (2.5.1 / 2.5.7 / 2.5.4), annulation (2.5.2), découvrabilité (Apple HIG, Material) = établi, standards d'accessibilité. Le registre « raccourci seulement » = décision interne datée 2026-07-25. Produit sans surface gestuelle réelle → langage anticipatoire : tout geste concret non couvert par un cas ci-dessus : STOP, remonter.
