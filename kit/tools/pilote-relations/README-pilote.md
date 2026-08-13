# Pilote relations & arbitrages — socle commun Fili

Démonstrateur de la cascade de dépendances et d'impacts spécifiée dans `docs/chantiers/PILOTE-RELATIONS-ARBITRAGES.md` (0.3.0). Node sans dépendance, limité à la tranche **interaction, button, link, card, form, creation-compte**. Les fiches de doctrine ne sont **jamais** modifiées ni annotées par ce pilote.

## Fichiers

- `relations.fixture.json` — **fixture** : les relations et la tension T-001 (« Visibilité des actions vs hiérarchie du groupe ») que les futures lignes `LIENS` et fichiers `T-xxx` déclareraient. Le contrat fermé des types (consommateurs, conséquences) est défini une fois dans `_consommateurs` ; chaque arête porte sa **preuve** propre, obligatoire. Substitut de pilote, pas une source éditoriale à faire vivre.
- `genere-index.js` — extrait les règles des six fiches, **valide** (périmètre exact ci-dessous), calcule inverses et impacts, écrit `index-relations.json`.
- `simule-impact.js` — simule une modification (`mecanique` | `semantique`) d'une règle et produit le rapport d'impact. Une modification mécanique régénère l'artefact du sujet propriétaire, l'index relationnel et les artefacts incorporant la donnée — et **rien d'autre** (aucune revue sémantique).
- `index-relations.json`, `RAPPORT-IMPACT-*.md` — **artefacts générés**, jamais édités à la main, reproductibles.

## Périmètre exact du validateur (13 validations, auto-testées une à une)

Références résolues (relations, cibles de cession, pôles) ; doublons (relations, IDs de règles, IDs de tensions) ; cycles `derive-de` et `cede-a` ; statut `note de méthode` obligatoire des règles cédantes ; champs obligatoires des tensions (`statut`, `portee`, `poles`, `provenance`, `confiance`, conséquence observable) ; preuve non vide par relation ; type `tension` interdit dans `relations` ; types au contrat fermé avec consommateur. **Aucune validation sémantique du contenu des règles ni de la justesse éditoriale des relations** — « 0 erreur » ne dit jamais plus que ce périmètre.

## Commandes

```bash
node tools/pilote-relations/genere-index.js              # régénère l'index
node tools/pilote-relations/genere-index.js --auto-test  # 13/13 : chaque validation détecte son cas
node tools/pilote-relations/simule-impact.js INTERACTION-R07 semantique   # scénario de validation principal
node tools/pilote-relations/simule-impact.js INTERACTION-R07 mecanique    # contre-épreuve : recompilations seules
```

## Instantané daté — 2026-07-28 (l'autorité reste les commandes, jamais ce paragraphe)

- Tranche du pilote : **357 règles** extraites, **16 relations** déclarées (10 `derive-de`, 3 `exception-de`, 3 `cede-a`), 16 inverses calculées, 1 tension. Auto-test : **13/13**. (18 → 16 le 2026-07-28 : retrait de `BUTTON-R23 → INTERACTION-R15` — la hiérarchie dominante/alternative ne dérive pas de la matérialité proportionnelle — et de `CARD-R04 exception-de CARD-R01` — l'état sélectionné confirme l'axe `interaction_mode`, il ne le borne pas ; aucune relation de remplacement sans preuve éditoriale.)
- Corpus entier : **37 sujets éditoriaux**, dont **36 compilés** (`laws`, audience humaine, ne compile jamais) ; **993 règles qualifiées, 0 non qualifiée** (`python3 tools/compile-regles.py --tous`). Le passage de 996 à 993 est la requalification des trois pointeurs de cession (`BUTTON-R65`, `BUTTON-R76`, `FORM-R06`) en `note de méthode` — une note de méthode ne compile pas ; la projection de `BUTTON-R76` était restée en retard d'un jour, rattrapée par `extrait-decisions.py`.
- Chaîne réelle constatée : fiche MD → `tools/extrait-decisions.py <sujet>` (→ `content/doctrine/<sujet>.json`) → `tools/compile-regles.py` (→ `dist/build` + `dist/audit`) → `tools/plugin/build-plugin.js` (paquet). Oublier la projection `extrait-decisions` laisse `dist/` mentir — c'est précisément la classe d'oubli que la cascade d'impact vise.

## Limites observées

- **Profondeur transitive nulle** dans la tranche : aucune règle ne dérive d'une règle déjà dérivée. La clôture transitive est implémentée et attend des chaînes réelles, annotées tirées par l'usage.
- **La 4e cession** (`BUTTON-R76` → `CONSENTEMENT-R08`) sort de la tranche : elle entrera quand `consentement` y entrera. La fixture ne la déclare pas pour ne pas déclencher `id-inexistant`.
- **Couche UX seulement** : les règles `SUJET-Unn` des fichiers UI ne sont pas extraites.
- **Extraction par motif** (`RÈGLE [ID]`) : robuste sur la grammaire actuelle, à remplacer par le vrai parseur de la chaîne de compilation le jour du portage.
- La cascade d'impact du rapport **décrit** les régénérations ; elle ne les **exécute** pas — le pilote répond « quoi refaire et pourquoi », pas encore « c'est refait ».
