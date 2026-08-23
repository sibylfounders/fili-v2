# RAPPORT D'IMPACT — INTERACTION-R07 (modification mecanique, SIMULÉE)

> Artefact généré par `simule-impact.js` — la fiche source n'a pas été modifiée ;
> aucune règle dépendante n'est réécrite automatiquement. Fixture de pilote, tranche :
> interaction, button, link, card, form, creation-compte.

## La règle

`INTERACTION-R07` — sujet propriétaire : **interaction** (`languages/INTERACTION-UX.md`), statut : propriété universelle, MESURE : oui.

## 1. Dépendants directs

- `BUTTON-R06` via `derive-de` — BUTTON-R06 : même en ghost, un Button ne devient pas un Link — déclinaison de « une action de faible poids ne devient jamais un faux lien ».
- `T-001` via `tension` (pôle a) — pôle a de T-001

## 2. Dépendants indirects (clôture sur les relations normatives)

Aucun dans la tranche — l'impact indirect passe par les projections (artefacts et audits ci-dessous). La profondeur transitive réelle ne se verra qu'à mesure que les relations s'annotent, tirées par l'usage.

## 3. Sujets et composants concernés (projection calculée)

`interaction` — agrégés depuis les règles touchées ; aucun graphe de composants maintenu à la main.

## 4–6. Actions requises

| Élément | Action | Pourquoi |
|---|---|---|
| RULES-interaction (dist/build + dist/audit + paquet) | **recompiler** | artefact généré du sujet propriétaire — propagation automatique |
| index-relations.json | **recompiler** | l'index relationnel incorpore chaque règle extraite — propagation automatique |
| artefacts incorporant directement INTERACTION-R07 (doctrine/interaction.json, rapports d'impact le citant) | **recompiler** | artefact généré qui incorpore la donnée modifiée — propagation automatique |

Automatisable : `recompiler`, `retester`. Jamais automatisable : `réexaminer humainement`.

## 7. Clôture

Chaque ligne ci-dessus cite la relation qui la justifie (colonne Pourquoi). La décision prise à l'issue des réexamens (modifier l'aval, le confirmer, requalifier la relation) se journalise dans `DECISIONS.md` (Méthode, étape 8).
