# Checklist d'évaluation de la tranche — SERT UNIQUEMENT À ÉVALUER LES SORTIES APRÈS GÉNÉRATION

> Jamais injectée dans une condition (protocole § 7.1) : l'injecter mélangerait deux variables et rendrait l'écart C3→C4 ininterprétable.
> Le périmètre ci-dessous est EXACTEMENT celui de `verifie-sortie.js` — trois documents, un seul périmètre (vérificateur, checklist, protocole § 7.3).

## Violations (comptées, par `verifie-sortie.js`)

- **V1 — semi-déterministe (convention de harnais)** : au plus un bouton au rang dominant par vue (BUTTON-R19). Convention : est « dominant » tout `Button` en `style="filled"` + `tone="primary"` — **y compris par défaut** (un `<Button>` sans props est dominant) — ainsi que `SubmitButton`.
- **V2 — déterministe** : action présentée comme un lien (INTERACTION-R07, LINK-R02) — uniquement quand la destination est **factice** (`href` absent, `"#"`, `javascript:`) ou la navigation **annulée** (`preventDefault`).
- **V3 — déterministe** : surface statique cliquable (INTERACTION-R10, CARD-R22) — `Card` en mode `static` (ou défaut) avec `onClick`, ou `div` avec `onClick`.

## Signaux (assistés — signalés, jamais comptés en violation)

- **S1** : un `Link`/`<a>` portant un `onClick` avec une destination littérale **réelle** ou une destination **dynamique** (`href={expr}`, template) — analytics légitime ou action déguisée : c'est un juge qui tranche, pas le script (la destination d'une expression n'est pas décidable statiquement).

## Jugé par un humain en aveugle (échelles ancrées)

- l'action attendue du parcours est-elle identifiable en moins de deux secondes, sans lire les libellés ?
- chaque action du groupe reste-t-elle identifiable comme un contrôle ?
- la hiérarchie des actions correspond-elle à ce que le parcours est conçu pour provoquer ?
- une navigation est-elle portée par un `Button` (BUTTON-R02) ? — **non vérifiable statiquement** par le harnais.

## Non couvert par le harnais (à juger au rendu)

Contraste 3:1 des limites, focus visible, cible tactile : portés par les composants du package — le harnais ne les recouvre pas et ne prétend pas les vérifier.
