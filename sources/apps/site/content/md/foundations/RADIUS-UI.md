---
component: radius
layer: ui
type: foundation
version: 1.2.0 # 1.2.0 : les deux axes de R12 sont appliqués — la grammaire pose d'abord « conteneur ou contrôle ? », la table de consommation est complétée des superposés (modale, liste de select, toast) qui n'y figuraient pas, et les deux consommateurs réels du pill (switch, tabs-pill) y entrent. Arbitrage Aurélien 2026-08-03. 1.1.0 : cran conteneur radius.lg — stress-test 2026-07-17
last_updated: 2026-07-11
companion: RADIUS-UX.md
tokens:
  # Aucune valeur définie ici — l'échelle vit dans DESIGN.md. Ce fichier fixe la grammaire d'application.
  crans:
    petit: radius.sm # petites hauteurs (bouton/input sm)
    controle: radius.md # contrôles de taille standard (bouton/input md-lg) — le rayon de croisière des contrôles
    conteneur: radius.lg # TOUT conteneur, quelle que soit sa taille (card, alert, modale, liste flottante de select, toast) — cran ajouté en 1.1.0, axe déclaré en 1.2.0
    plein: radius.pill # liste FERMÉE de formes intrinsèquement pilule : badge/tag, avatar, piste de switch, piste tabs-pill (cf. RADIUS-R08) — jamais un contrôle ordinaire
confidence: mixed
---

# Radius — Couche UI (fondation)

> Grammaire d'application de l'échelle. Le raisonnement (le rayon suit la taille, imbrication, pill borné) vit dans RADIUS-UX.md. Les valeurs sont résolues dans DESIGN.md.

## Application

- **Choix du cran — dans cet ordre, jamais en % de la hauteur** :
  1. *Forme intrinsèquement pilule ?* (liste fermée : badge/tag, avatar, piste de switch, piste tabs-pill) → `radius.pill`. Si le composant n'y figure pas : STOP, remonter — on n'ajoute pas une entrée localement.
  2. *Conteneur ou contrôle ?* Conteneur (card, alert, **modale**, **liste flottante d'un select**, **toast**) → `radius.lg`, **quelle que soit sa taille**.
  3. *Contrôle* → sa taille décide : `scale.compact` → `radius.sm` ; standard (bouton/input md-lg) → `radius.md`.
- **Le déclencheur d'un select est un contrôle, sa liste est un conteneur** — le même composant résout deux crans différents, et c'est correct : ce sont deux objets de nature différente.
- **Cohérence de groupe** : les contrôles voisins d'une même taille partagent le même cran (bouton md + input md → `radius.md`) — déjà le cas chez les consommateurs, désormais une règle.
- **Imbrication** : coin interne collé → épouse le rayon externe (media de carte) ; élément concentrique interne → rayon externe − écart ; anneau externe (focus ring) → rayon du composant **+ `border.focus-offset`** (cf. BORDER-UI).
- **Stabilité** : aucun état ne modifie le rayon.

## Consommation par les composants

| Consommateur | Crans consommés |
|---|---|
| Bouton (BUTTON-UI.md) | sm → `radius.sm` ; md/lg → `radius.md` (pas de proportionnalité, décision documentée) |
| Input (INPUT-UI.md) | même mapping que le bouton, par taille |
| Card (CARD-UI.md) | `radius.lg` (conteneur, 1.1.0) ; media imbriqué épouse le coin |
| Alert (ALERT-UI.md) | `radius.lg` (conteneur, 1.1.0) |
| **Modale (MODAL-UI.md)** | `radius.lg` (conteneur) — **était `radius.md` jusqu'au 2026-08-03** : une card `lg` dans une modale `md` violait la concentricité de R06 |
| **Select (SELECT-UI.md)** | déclencheur → `radius.md` (contrôle) ; **liste flottante → `radius.lg`** (conteneur) — la liste était `radius.md` jusqu'au 2026-08-03 |
| Toast (TOAST-UI.md) | `radius.lg` (conteneur) — identique à alert, déjà spécifié en 1.1.0 |
| Switch (SWITCH-UI.md) | piste → `radius.pill` (forme intrinsèque, liste fermée R08) |
| Tabs (TABS-UI.md) | variante `pill` : piste → `radius.pill` (liste fermée R08) ; variante `line` : aucun rayon |
| Badge/tag (à naître) | `radius.pill` — candidat documenté |

## Vérifiabilité

- `valide-dossier.js` vérifie la résolution des tokens `radius.*` ; la concentricité des imbrications est un contrôle visuel de revue (non calculable depuis les .md) — signalé plutôt que simulé.

## Sources et niveau de confiance (couche UI)

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| T1 | Mapping par taille, échelle fermée | [Atlassian — Radius](https://atlassian.design/foundations/radius), précédents internes (BUTTON-UI, INPUT-UI) | Établi par convergence |
| T2 | Rayon du ring = base + offset | [Atlassian — Radius](https://atlassian.design/foundations/radius) (leur token de rayon de focus, calculé base + écart) | Établi chez Atlassian, adopté (BORDER-UI) |
