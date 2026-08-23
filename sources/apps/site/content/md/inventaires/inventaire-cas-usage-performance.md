# Inventaire des cas d'usage — performance perçue (audit transversal)

> **Inventaire transversal** (troisième du genre, après accessibilité et charge cognitive) : il audite le traitement des attentes à travers les propriétaires (FORM, BUTTON, INPUT, CARD, COLLECTION, MOTION, VOICE) et **ne devient pas une source normative de substitution**. Un trou se comble chez son propriétaire — ou, pour une obligation d'écran sans propriétaire possible, dans le principe transversal `PERFORMANCE-UX.md` que cet inventaire a fait naître (2026-07-21). Statuts recalculés APRÈS l'écriture du principe.

## Mode d'emploi

- **Couvert** : une règle tranche le cas — propriétaire en majuscules.
- **Partiel** : l'obligation est posée, la mécanique attend un composant ou une épreuve du réel.
- **Absent / En attente** : position à prendre avant d'improviser.
- L'état transitoire est ici le sujet lui-même (comme pour MOTION) : le prédicteur s'applique en cherchant **l'attente dans l'attente** — l'interruption, l'échec et l'éternisation d'un chargement (sections 1 et 4).

## 1. L'échelle de l'attente

| Cas d'usage | Description | Statut et propriétaire |
|---|---|---|
| Réponse quasi instantanée | Sous ~100 ms : aucun indicateur, le feedback d'activation suffit | Couvert — BUTTON (press) + PERFORMANCE (interdit du spinner sur l'instantané) |
| Attente courte portée localement | Entre ~100 ms et ~1 s : l'élément déclencheur change d'état, pas d'indicateur global | Couvert — BUTTON (loading) + FORM (cycle) + PERFORMANCE (échelle) |
| Attente visible et annoncée | Au-delà de ~1 s : indicateur perceptible ET annonce (un spinner seul n'annonce rien) | Couvert — FORM (aria-live « Envoi en cours… ») + INPUT (attente par champ) + PERFORMANCE (obligation transversale) |
| Attente longue ou inconnue | Au-delà de ~10 s : état à part entière — progression ou estimation honnête, issue offerte | Partiel — PERFORMANCE (obligation) + FORM (timeout, reprise) ; la barre de progression déterminée n'a aucun composant — remonter |
| Indicateur anti-scintillement | Délai d'apparition + durée minimale une fois montré | Couvert — PERFORMANCE (obligation) ; chiffrage En attente (premier consommateur outillé) |
| Timeout toujours défini | Jamais d'attente infinie silencieuse ; la reprise est prévue | Couvert — FORM (cycle de soumission, états timeout/reprise) |

## 2. Apparition et stabilité

| Cas d'usage | Description | Statut et propriétaire |
|---|---|---|
| L'utile arrive en premier | Le contenu qui permet de décider précède l'accessoire | Couvert — PERFORMANCE (ordre d'apparition) |
| Squelette = promesse de structure | Le squelette reproduit exactement ce qui va arriver, là où ça va arriver | Couvert — CARD (anatomie) + COLLECTION (nombre de cellules stable) |
| Rien n'anime au chargement | Le contenu initial est du contenu, pas un spectacle d'entrée | Couvert — MOTION + CARD |
| Rien ne bouge après coup | Le contenu tardif ne déplace pas la lecture et ne vole pas le geste engagé | Couvert — PERFORMANCE (obligation d'écran, généralisation de COLLECTION « la grille ne saute pas ») |

## 3. Optimisme

| Cas d'usage | Description | Statut et propriétaire |
|---|---|---|
| Succès affiché avant confirmation | Trois conditions cumulées : réversible/rejouable, très probable, échec réparé visiblement | Couvert — PERFORMANCE (conditions) ; premier terrain d'incarnation : TOAST porteur d'une annulation (Partiel jusqu'au cas réel) |
| Optimisme interdit | Irréversible, paiement, engagement légal : on attend la confirmation réelle | Couvert — PERFORMANCE + COGNITIVE-LOAD (réversibilité, « Annuler » = promesse tenue) |
| Échec après optimisme | L'élément revient, l'écart est expliqué, rien ne se perd en silence | Couvert — PERFORMANCE (obligation) + FORM (erreurs serveur, reprise) |
| Succès optimiste = état en cours | Jamais une base pour une décision irréversible de l'utilisateur | Couvert — PERFORMANCE |

## 4. Honnêteté de l'attente

| Cas d'usage | Description | Statut et propriétaire |
|---|---|---|
| Fausse progression interdite | Pas de barre décorrélée du travail réel, pas d'étapes gonflées | Couvert — PERFORMANCE (la frontière Goal-Gradient du catalogue des lois devient un interdit opérationnel) |
| Barre déterminée ou indéterminée | Percent-done si mesurable, indéterminé sinon ; estimation seulement si honnête | Partiel — PERFORMANCE (doctrine) ; composant de progression à naître (cf. section 1) |
| Attente artificielle interdite | Le système répond dès qu'il peut — la labor illusion n'est pas exploitée | Couvert — PERFORMANCE (règle interne renforcée, position assumée contre une littérature documentée) |
| Attente qui s'éternise avouée | « Plus long que prévu » + issue (réessayer, continuer, être prévenu) | Couvert — PERFORMANCE (obligation) + VOICE (les mots de l'attente) |

## 5. Mécaniques existantes (le principe renvoie, ne réécrit pas)

| Cas d'usage | Description | Statut et propriétaire |
|---|---|---|
| Anti-double-soumission pendant l'attente | L'envoi neutralisé, l'état montré | Couvert — FORM / BUTTON |
| Validation asynchrone pendant la frappe | État d'attente du champ, verdict annoncé, jamais un submit muet | Couvert — INPUT + FORM (async validation) |
| Conservation des données pendant l'attente | Interruption, expiration : rien ne se perd | Couvert — FORM (autosave) + ACCESSIBILITY (limites de temps) |
| Spinner : rotation continue, reduced-motion | La seule exception au « jamais linéaire » ; pulse d'opacité en repli | Couvert — MOTION |
| Perception ≠ vitesse réelle | Une attente récurrente au-delà des bornes se remonte, ne se maquille pas | Couvert — PERFORMANCE (règle de remontée) |

## Bilan

20 cas. Avant le principe : 11 couverts par les propriétaires (FORM 5, BUTTON 2, CARD/COLLECTION 2, INPUT 1, MOTION 2 — l'échelle des attentes, l'optimisme et l'honnêteté n'avaient AUCUN propriétaire transversal). Après `PERFORMANCE-UX.md` (2026-07-21) : 17 couverts, 3 partiels avec chemin nommé (barre de progression → composant à naître, remonter ; chiffrage anti-scintillement → premier consommateur ; incarnation de l'optimisme → TOAST-annulation). Aucun absent sans position.

## Sources

Le sourçage vit dans `PERFORMANCE-UX.md` (table « Sources et niveau de confiance ») et, pour les lois citées (Doherty, Goal-Gradient), dans `LAWS-UX.md`. Cet inventaire est un outil de vérification, pas une source normative.
