---
sujet: elevation
type: fondation
resume: "L'ombre dit la couche, jamais l'importance — repos à plat, raised au survol cliquable, overlay pour ce qui recouvre"
requires: []
selon-contexte: ["motion (animation d'ombre en opacité, jamais de box-shadow interpolé)"]
---
# RULES — Elevation (compilé, condensé)

> Généré depuis `foundations/elevation/ELEVATION-UX.md` (v1.1.0) et `ELEVATION-UI.md` (v1.1.0). Règles condensées pour le build — la source fait autorité. Ne pas éditer à la main. Tokens : `dist/tokens.yaml`.

## Nature
- Fondation. **Règle cardinale : l'élévation dit la couche, jamais l'importance.**
- Trois niveaux = les trois couches du système : à plat (dans le flux) / soulevé (prêt à répondre) / au-dessus du flux.

## Application
| Token | Autorisé | Interdit |
|---|---|---|
| `elevation.none` | l'état de repos de TOUTE surface | — |
| `elevation.raised` | retour de survol des surfaces **cliquables** uniquement (card clickable) | repos ; surface statique ; cumul avec surface-contrast |
| `elevation.overlay` | composants superposés — AUCUN n'existe : provisionné | tout usage dans le flux |

- **Le repos est à plat.** Le containment passe par la bordure ou le fond, jamais par l'ombre de repos. Une ombre généralisée n'afforde plus rien.
- Ombre sur surface statique = affordance mensongère (clic dans le vide) : interdit.
- **Mise en avant ≠ élévation** : `surface-contrast` met en avant par le fond, sans ombre (non-cumul).
- Bouton, input, alert : AUCUNE élévation, à aucun état — le feedback passe par les state layers, décision explicite.
- Ombres teintées `text-primary`, jamais noir pur ; niveaux distincts par la portée, pas l'opacité seule.

## Transitions
- repos ↔ raised : `motion.fast` + `motion.ease-out` ; instantané sous `prefers-reduced-motion`.
- Jamais de box-shadow interpolé — ombre pré-rendue sur pseudo-élément, animée en opacité (cf. RULES-motion).

## Ce que l'ombre ne garantit pas
- **Jamais le seul signal** : les box-shadow disparaissent en forced-colors — bordure, focus ring et sémantique doivent suffire.
- **Dark mode non couvert** (décision) — convention notée : surfaces éclaircies avec la hauteur.
- **Valeurs dépendantes du thème (1.1.0)** : `elevation.*` encode une ombre pour **fond clair** (teinte ~10 %) — quasi invisible sur fond sombre. Un thème doit la **redéfinir** comme les couleurs, sinon on croit avoir une ombre qu'on n'a pas (angle mort invisible en thème clair). Ce ne sont pas des constantes.
- **Pas d'échelle z-index** : naîtra avec le premier consommateur d'overlay. Si un composant superposé doit être généré : STOP, remonter.

## Risque
| Cas | Risque | Sévérité |
|---|---|---|
| Ombre de repos généralisée | Signal d'affordance annulé | Élevée |
| Ombre sur surface statique | Clic dans le vide | Élevée |
| Élévation seule porteuse d'info | Perdue en forced-colors | Élevée |
| Niveaux indiscernables | Hiérarchie spatiale illisible | Moyenne |
| Cumul ombre + surface-contrast | Vocabulaires brouillés | Moyenne |

CONFIANCE : échelle courte sémantique et repos-à-plat = établi par convergence (Atlassian, Carbon — parti pris le plus proche, Material 3 tonal). Dark mode différé = décision interne datée 2026-07-11.
