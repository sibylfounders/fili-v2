---
sujet: performance
type: principe
resume: "Contrat des attentes : feedback au bon seuil (~0,1 s rien / ~1 s local / au-delà visible et annoncé / ~10 s état à part avec issue), anti-scintillement, l'utile d'abord et rien ne bouge après coup, UI optimiste sous conditions, honnêteté totale (jamais de fausse progression ni d'attente artificielle) — pose l'obligation et renvoie au propriétaire"
requires: []
selon-contexte: ["button", "form", "form-server-errors", "form-async-validation", "input", "card", "collection", "motion", "voice", "cognitive-load", "accessibility"]
---
# RULES — Performance perçue (compilé, condensé)

> Généré depuis `principles/performance/PERFORMANCE-UX.md` (v1.0.0). **Socle universel** : ce fichier est chargé d'office avec le routeur pour toute intention. Il pose le contrat des attentes et **renvoie au propriétaire** — il ne réécrit ni cycle de soumission, ni squelette, ni durées d'animation. Ne pas éditer à la main. La source fait autorité.

## Nature
- Principe transversal, **sans token, sans valeur visuelle**. Il pose l'obligation ; le propriétaire pose la mécanique (FORM cycle/timeout, BUTTON loading, INPUT async, CARD/COLLECTION squelettes, MOTION durées). En divergence, le propriétaire a raison.
- La vitesse **réelle** est hors périmètre (ingénierie) — et la perception ne la remplace pas : une attente récurrente au-delà des bornes se **remonte**, elle ne se maquille pas.
- Aucun token : les seuils sont des bornes de raisonnement sourcées, pas des valeurs à thématiser.

## L'échelle de l'attente (tout écran généré en hérite)
- **< ~100 ms** : aucun indicateur — le feedback d'activation suffit. Un spinner sur de l'instantané fabrique de la lenteur.
- **~100 ms – 1 s** : l'attente est **locale** — l'élément déclencheur change d'état (bouton loading, champ en validation) ; pas d'indicateur global, pas de blocage.
- **> ~1 s** : attente **visible ET annoncée** (un spinner seul n'annonce rien — aria-live chez RULES-form/RULES-input) ; l'écran reste utilisable partout où l'attente ne bloque pas réellement.
- **> ~10 s ou durée inconnue longue** : état à part entière — progression réelle ou estimation honnête, issue offerte (réessayer, continuer ailleurs), **timeout toujours défini**.
- **Anti-scintillement** : l'indicateur attend un court délai avant d'apparaître, et reste un minimum perceptible une fois montré — un squelette qui flashe est un défaut.

## Ordre d'apparition
- L'utile d'abord : ce qui permet de décider ou d'agir arrive en premier ; le squelette est une promesse de structure exacte (RULES-card, stabilité RULES-collection).
- **Rien ne bouge après coup** : le contenu tardif ne déplace jamais ce qui est lu et ne vole jamais un geste engagé — espace réservé ou arrivée neutre.

## UI optimiste — trois conditions cumulées
- Autorisée si : action **réversible/rejouable**, succès **très probable**, échec **réparé visiblement** (rien ne se perd en silence — reprise RULES-form-server-errors).
- **Interdite** sur l'irréversible, le paiement, l'engagement légal (cohérent RULES-cognitive-load : « Annuler » = promesse tenue).
- Un succès optimiste reste un état en cours — jamais une base pour une décision irréversible de l'utilisateur.

## Honnêteté de l'attente
- **Jamais de fausse progression** ni d'étapes gonflées ; barre déterminée si mesurable, indéterminée sinon ; estimation seulement si honnête.
- **Jamais d'attente artificielle** — si le système peut répondre instantanément, il répond instantanément (la labor illusion existe ; ce système refuse de l'exploiter).
- Une attente qui s'éternise **s'avoue** (« plus long que prévu ») et donne une issue.

## Qui porte quoi (renvois — charger le propriétaire pour le détail)
| Besoin | Propriétaire |
|---|---|
| Loading du déclencheur, anti-double-clic | `RULES-button` |
| Cycle de soumission, timeout, annonce, reprise | `RULES-form` (+ `RULES-form-server-errors`, `RULES-form-async-validation`) |
| Attente par champ | `RULES-input` |
| Squelette, rien n'anime au chargement | `RULES-card` |
| Squelettes stables, croissance, échec de page suivante | `RULES-collection` |
| Durées/courbes, spinner, reduced-motion | `RULES-motion` |
| Mots de l'attente | `RULES-voice` |
| Réversibilité, confirmation méritée | `RULES-cognitive-load` |
| Limites de temps, conservation des données | `RULES-accessibility` |

CONFIANCE : seuils 0,1/1/10 s et doctrine des indicateurs établis (NN/g ; Doherty via le catalogue des lois) ; conditions de l'UI optimiste et interdit de l'attente artificielle = positions du système, identifiées comme telles. Décision non tranchée par une règle (cas limite entre deux seuils, optimisme d'un cas précis, estimation affichable ou non) : STOP — remonter.
