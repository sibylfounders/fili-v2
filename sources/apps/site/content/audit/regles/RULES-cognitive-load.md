---
sujet: cognitive-load
type: principe
resume: "Contrat de charge cognitive chargé pour TOUTE intention : une décision principale par moment, divulgation progressive (jamais un coût caché), défauts intelligents (jamais d'engagement pré-coché), réversibilité (undo > confirmation, « Annuler » = promesse tenue), reconnaissance plutôt que rappel, anti-camouflage — pose l'obligation et renvoie au propriétaire, ne duplique rien"
requires: []
selon-contexte: ["button", "form", "form-multi-step", "form-autosave", "form-sensitive-data", "creation-compte-consentement", "input", "adaptive", "alert", "toast", "motion", "voice", "accessibility"]
---
# RULES — Charge cognitive (compilé, condensé)

> Généré depuis `principles/cognitive-load/COGNITIVE-LOAD-UX.md` (v1.0.0). **Socle universel** : ce fichier est chargé d'office avec le routeur pour toute intention. Il pose le contrat minimal et **renvoie au propriétaire** — il ne réécrit ni mécanique de formulaire, ni destructive, ni wording. Ne pas éditer à la main. La source fait autorité.

## Nature
- Principe transversal, **sans token, sans valeur visuelle**. Il pose l'obligation ; le propriétaire pose la mécanique. En cas de divergence, le propriétaire a raison (ce n'est pas une source de substitution).
- Pendant **opérationnel** du catalogue des lois (`laws`, référence humaine, jamais chargée au build) : le catalogue explique, ce fichier contraint.
- **Aucun plafond numérique** : jamais « max N choix » (Miller « 7 items » et la règle des 3 clics sont des mythes réfutés au catalogue). La contrainte porte sur la structure, pas sur un nombre.

## Obligations universelles (tout écran généré en hérite)
- **Budget de décision** : un écran/vue déclare UNE décision principale ; le reste lui est subordonné visuellement et structurellement. Le nombre de choix simultanés se justifie par le besoin de la décision présente, jamais par l'espace disponible.
- **Divulgation progressive** : l'essentiel pour décider d'abord ; l'avancé, le rare et le détail sur demande explicite. **Frontière dure : jamais cacher un coût, un engagement, une obligation ou un risque** — ce qui engage se voit avant l'engagement. Réduire ≠ enfouir : une fonction essentielle reste découvrable.
- **Défauts intelligents** : tout choix à réponse majoritaire sensée porte un défaut ; un défaut se distingue toujours d'une valeur saisie. **Frontière dure : jamais d'engagement pré-coché** (consentement actif — mécanique chez RULES-form-sensitive-data / RULES-creation-compte-consentement).
- **Réversibilité** : le réversible s'exécute immédiatement avec une annulation visible ; la confirmation bloquante est réservée à l'irréversible et au coûteux-à-défaire (la banaliser désarme le garde-fou). L'irréversible se déclare AVANT (portée, non-retour). Quitter n'est pas perdre (autosave, limites de temps). **Un « Annuler » affiché est une promesse tenue** — sinon ne pas l'afficher.
- **Reconnaissance plutôt que rappel** : jamais faire retenir une info d'un écran à l'autre — re-présenter le contexte là où la décision se prend ; montrer l'état (progression, statut) plutôt que le faire mémoriser.
- **Anti-camouflage** : une information critique (erreur, coût, sécurité, obligation) ne ressemble jamais à du décor ou de la promotion — elle serait filtrée avant lecture.

## Tensions — rendre visible, ne pas trancher seul
| Tension | Règle de conduite |
|---|---|
| Réduire ↔ découvrir (Hick vs découvrabilité) | Par cas — remonter |
| Une décision par moment ↔ conservation de la complexité | Un écran par décision, pas un écran par champ — l'émiettement déplace la complexité au lieu de la réduire |
| Undo ↔ friction protectrice | Jamais les deux absents sur une action à conséquence |
| Divulgation ↔ transparence | La frontière « coût jamais caché » est non négociable |

## Qui porte quoi (renvois — charger le propriétaire pour le détail)
| Besoin | Propriétaire |
|---|---|
| Primary unique, hiérarchie des actions, mécanique destructive | `RULES-button` |
| Une décision par étape, ask-once, récap, progression | `RULES-form` (+ `RULES-form-multi-step`) |
| Survie de la saisie | `RULES-form-autosave` |
| Consentement actif, données sensibles | `RULES-form-sensitive-data`, `RULES-creation-compte-consentement` |
| Défaut ≠ valeur saisie, helper persistant | `RULES-input` |
| Divulgation par l'espace (compact → expanded) | `RULES-adaptive` |
| Rareté des interruptions ; toast porteur d'une annulation | `RULES-alert`, `RULES-toast` |
| Budget d'attention du mouvement | `RULES-motion` |
| Mots simples, ton des moments critiques | `RULES-voice` |
| Limites de temps contrôlables | `RULES-accessibility` |

CONFIANCE : fondements établis ou convergents (divulgation progressive et défauts NN/g, « one thing per page » GOV.UK — avec sa nuance : regrouper quand la recherche le justifie —, heuristiques de Nielsen 3/5/6, consentement actif RGPD/CJUE Planet49). Les règles internes renforcées (coût jamais caché, jamais d'engagement pré-coché, undo = promesse tenue, anti-camouflage) sont des positions du système. Décision non tranchée par une règle (découpage d'un parcours en moments, undo vs confirmation d'un cas précis, wording) : STOP — remonter.
