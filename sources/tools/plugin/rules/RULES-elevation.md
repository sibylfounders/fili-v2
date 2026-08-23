---
sujet: elevation
type: fondation
resume: "Élévation & relief : l'ombre dit la couche — et le relief dit la nature (posé / creusé / plat, registre d'identité débrayable) ; repos à plat pour les surfaces, matrice posé/soulevé/enfoncé pour les objets"
requires: []
selon-contexte: ["motion (swaps d'ombre instantanés, jamais de box-shadow interpolé)", "border (l'arête du relief est une bordure réelle)", "interaction (test de matérialité fonctionnelle)"]
---
# RULES — Elevation & Relief (compilé, condensé)

> Généré depuis `foundations/elevation/ELEVATION-UX.md` (v2.0.0) et `ELEVATION-UI.md` (v2.0.0). Règles condensées pour le build — la source fait autorité. Ne pas éditer à la main. Tokens : `dist/tokens.yaml`.

## Nature
- Fondation. **Deux règles cardinales : l'ombre dit la couche, jamais l'importance — le relief dit la nature, jamais l'importance.**
- Trois niveaux d'ombre = les trois couches : à plat / soulevé / au-dessus du flux. Le relief n'ajoute AUCUN niveau : il compose ombre + arête (bordure) + liseré.

## Grammaire de relief (registre d'identité, DÉBRAYABLE — parti pris, jamais un critère d'audit d'hôte)
- À la création de tout composant, classer chaque surface :
  - **POSÉ** = objet actionnable ou couche flottante (bouton et dérivés, toast) : arête sombre `mix(tone, noir 38%)` + liseré interne **en dégradé** (clair EN HAUT `mix(tone, blanc ~40%)` fondant vers l'objet — jamais un anneau uniforme) + `elevation.raised` AU REPOS.
  - **CREUSÉ** = réceptacle (input) : fond `background`, ombre interne haute, double filet — le creux dit « on me remplit ».
  - **PLAT** = contenu (alert, texte, ghost, statique, skeleton) : rien — l'absence est la règle.
- **Le relief suit la FONCTION, jamais la décoration** (test des 5 questions d'INTERACTION).
- **Matrice d'états des posés** : défaut = posé (raised) · survol = SOULEVÉ (`overlay` + fond ÉCLAIRCI `mix(tone, blanc ~12%)` — la métaphore prime sur la convention state-layer) · appui = ENFONCÉ (ombre interne + fond assombri `mix(tone, noir ~20%)` + course 0,5 px).
- **Sombre** : mêmes directions ; l'enfoncé se dérive VERS LE NOIR — jamais via le token de survol (qui s'éclaircit en sombre → physique inversée) ; liserés dans la gamme du tone, jamais blanc pur ; ombres internes renforcées.
- **Une seule source de lumière (le haut), pour tout l'écran.**

## Surfaces (doctrine conservée, les deux registres)
- **Le repos d'une SURFACE est à plat.** `elevation.raised` = retour de survol des surfaces **cliquables** uniquement (card clickable) — en registre relief, arête + liseré vivent sur la couche de survol et disparaissent avec elle. Surface statique : jamais de réaction (affordance mensongère).
- Mise en avant ≠ élévation : `surface-contrast` sans ombre (non-cumul). Skeleton jamais élevé.
- `elevation.overlay` : composants superposés (toast au repos — c'est sa couche).

## Techniques
- Liseré = anneau 1 px par pseudo + `mask-composite: exclude` (un box-shadow ne dégrade pas) ; états via custom property.
- **Jamais de box-shadow interpolé** : swaps d'ombre INSTANTANÉS ; seules les couleurs transitionnent ; reduced-motion = tout instantané.
- Sans bordure structurelle (métrique de crans) : arête en `inset 0 0 0 1px`, liseré en pseudo décalé de 1 px.
- Ombres teintées `text-primary`, jamais noir pur ; niveaux distincts par la portée. Valeurs dépendantes du thème (à re-thématiser comme les couleurs).

## Ce que le relief ne garantit pas
- **Jamais le seul signal** : en forced-colors, ombres et liserés disparaissent — l'arête (bordure réelle), le focus ring et la sémantique doivent suffire.
- **Pas d'échelle z-index** : naîtra avec le premier consommateur d'overlay modal. STOP et remonter.

## Risque
| Cas | Risque | Sévérité |
|---|---|---|
| Relief sur surface statique | Affordance mensongère | Élevée |
| Relief généralisé aux surfaces | Signal annulé — skeuomorphisme | Élevée |
| Relief seul porteur d'info | Perdu en forced-colors | Élevée |
| Enfoncé dérivé du token hover en sombre | Physique inversée (l'objet monte à l'appui) | Élevée |
| Liseré uniforme / blanc pur en sombre | Lumière incohérente | Moyenne |
| Box-shadow interpolé | Paint coûteux | Moyenne |
| Cumul ombre + surface-contrast | Vocabulaires brouillés | Moyenne |

CONFIANCE : échelle courte et repos-à-plat des surfaces = établi (Atlassian, Carbon, Material 3) ; coût des signifiants faibles du flat = établi (NN/g) ; grammaire posé/creusé/plat et physique lumière-du-haut = **parti pris d'identité daté (2026-07-23), débrayable**, éprouvé dans l'implémentation de référence (atelier DS-UI) — à éprouver par tests utilisateurs. En audit d'hôte : seule l'affordance mensongère fonde une non-conformité, jamais l'absence de relief.
