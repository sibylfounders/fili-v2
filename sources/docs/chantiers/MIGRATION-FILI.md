---
name: migration-fili
description: Inventaire de migration de nom vers Fili / Fili DS / Fili Audit — état relevé au 2026-08-01, catégories 2 et 3 ouvertes, catégorie 5 partiellement close.
version: 0.2.0 # 0.2.0 : rediagnostic du 2026-08-01 — le document déclarait « rien n'est renommé » alors que le paquet et le dossier du dépôt le sont depuis le 30/07. Catégories 1 et 4 closes, 3 et 5 rouvertes sur leur reste réel, un classement corrigé (elevation.json), six chemins morts retirés de la catégorie 1. 0.1.0 : première rédaction — inventaire de risque, aucun remplacement exécuté (2026-07-27).
date: 2026-07-27
revu: 2026-08-01
statut: inventaire partiellement exécuté — chaque catégorie encore ouverte attend une validation explicite avant toute exécution
---

# Migration de nom — inventaire

Structure de marque cible : **Fili** (le projet et la marque ombrelle), **Fili DS** (conception et production d'interfaces — doctrine, sélection contextuelle, mode build, implémentation UI, atelier), **Fili Audit** (analyse et audit d'interfaces existantes). Le corpus, le routeur, les liens typés et les arbitrages sont le **socle commun interne**, sans nom de produit propre.

Ce document classe les occurrences des anciens noms par **risque de renommage**.

## État au 2026-08-01 — ce qui a été exécuté depuis la v0.1.0

La v0.1.0 se terminait sur « rien n'est renommé dans cette étape ». Ce n'est plus vrai depuis le 2026-07-30, et le document a vécu quatre jours en le déclarant encore. Deux lots de la catégorie 5 — les deux plus cassants — sont **faits** :

- **`@sibyl/react` → `@fili/react`**, exécuté. Les seules occurrences de `@sibyl/` qui subsistent dans le dépôt sont **délibérées** et ne sont pas des restes : l'invariant global de `tools/verifie-consommation.mjs` (qui **échoue** au premier import `@sibyl/*` retrouvé, partout dans `apps/`), la règle `import-sibyl` de `tools/fili-check.mjs`, et la fixture `tools/fixtures/fili-check/incorrect/` qui doit précisément être détectée. Ce sont des gardes anti-retour : les effacer retirerait la garde, pas la dette.
- **Dossier du dépôt** : `~/Claude/Projects/Fili`. Les chemins absolus, la config locale et la mémoire de projet suivent.

Les deux lots sont **journalisés** dans `DECISIONS.md` — « Migration close : les derniers imports `@sibyl/*` actifs (registry de l'atelier) passent à `@fili/*` ; l'invariant est gardé par le validateur de consommation. »

Ce qui reste ouvert, et il faut le dire nettement : **deux catégories, pas une.** La catégorie 2 (nom de la skill, URLs, libellés du routeur) et la catégorie 3 (les six fichiers `*ds-md*`).

## 1. Mentions éditoriales et titres — **quasi close**

Texte lu par des humains, sans effet sur le build ni sur les chemins.

Reste au 2026-08-01, relevé par balayage du dépôt :

- `README.md` — 1 occurrence ;
- trois **commentaires de code**, invisibles pour l'utilisateur : `apps/site/app/ui/card-imgs.ts`, `apps/site/app/ui/card-group.tsx`, `apps/site/app/doctrine-demo.css`.

> **Six chemins de la v0.1.0 n'existent plus dans ce dépôt** et sont retirés de cette catégorie : `OU-EST-QUOI.md`, `docs/INSTALLATION.md`, `METHODE.md`, `PROCESS.md`, `POURQUOI.md`, `AUDIT-DU-CORPUS.md`. L'inventaire les listait encore ; il pointait des fichiers morts. Ils vivent hors du monorepo, et leur sort n'appartient pas à ce document.

Précaution inchangée : passer fiche par fiche (montée de version par fiche touchée), jamais par sed global — certains « DS-MD » désignent le concept (→ Fili), d'autres un chemin ou un outil (→ catégorie 3).

## 2. Noms de produits et de navigation — **ouverte**

Visibles par l'utilisateur, sans être des identifiants techniques :

- **le nom du paquet Cowork / skill installée** : `design-system-md`. Il vit dans cinq fichiers du build du paquet — `tools/plugin/build-plugin.js` (dossier de sortie et nom de l'archive `.plugin`), `tools/plugin/genere-catalogue.js`, `tools/plugin/genere-routeur.js` (dossier **et** le champ `name:` du `SKILL.md` généré), `tools/plugin/genere-tokens.js`. Le renommer change l'identité de la skill chez les consommateurs installés ;
- la navigation du site (`/md/…`, libellés de sections, la page installation et le nom de l'archive distribuée) ;
- les intitulés **« mode build » / « mode audit »** du routeur généré, qui deviennent conceptuellement les projections **Fili DS** / **Fili Audit**. Le texte est produit par `tools/plugin/genere-routeur.js` et n'a pas bougé : le routeur livré dit toujours « Deux modes : **build** … et **audit** … ».

À traiter après la catégorie 1, avec une communication de renommage pour les consommateurs du paquet.

## 3. Noms techniques — identifiants, chemins, clés — **ouverte**

Chaque renommage casse quelque chose ; à traiter par lots atomiques avec vérification.

**Faits** :

- ~~**Package npm** : `@sibyl/react` → `@fili/react`~~ — exécuté le 2026-07-30, gardé par `verifie-consommation.mjs` (cf. § État).
- ~~**Dossier du dépôt** : `~/Claude/Projects/Sibyl DS`~~ — exécuté, le dépôt est `~/Claude/Projects/Fili`.

**Ouverts** — six fichiers et deux scripts npm, tous vivants :

| chemin | rôle | risque propre |
|---|---|---|
| `packages/tokens/build/verify-ds-md.mjs` | garde de fidélité des tokens | **appelé par `tokens:build`**, donc par la porte `verifie` et par la CI |
| `packages/tokens/build/sync-ds-md.mjs` | synchronisation depuis la source de doctrine | script npm `sync:ds-md` |
| `packages/tokens/src/ds-md.map.mjs` | table de correspondance des tokens | importé par les précédents |
| `packages/tokens/src/ds-md.contract.mjs` | contrat de forme des tokens | importé par les précédents |
| `tools/extrait-fiches-ds-md.py` | extraction des fiches | outil de migration doctrinale |
| `tools/README-migration-doctrine.md` | mode d'emploi des précédents | prose, suit ses scripts |

Scripts npm concernés : `sync:ds-md` et `verify:ds-md` (workspace `@fili/tokens`).

**Arbitrage Aurélien, 2026-08-01** : cette catégorie **reste ouverte** — c'est bien une dette de nommage, pas un vocabulaire hors périmètre. Elle ne se traite **pas** pendant la fermeture des chantiers : renommer `verify-ds-md.mjs` déplace `tokens:build`, donc la première étape de la porte, en plein J0. Lot atomique à programmer seul, après.

- **Générateurs et sorties** : `tools/plugin/genere-routeur.js` (textes générés du routeur), `compile-regles.py` (en-têtes), artefacts `dist/`, rapport `RAPPORT-ROUTEUR.md` — régénérables : recompiler plutôt que rééditer.
- **Ce dépôt de connaissance transverse** : la skill Cowork `sibyl-modeles-tokens` et la mémoire de projet (références au nom du dépôt).

## 4. Références historiques — conservent l'ancien nom

Ne pas réécrire l'histoire :

- `DECISIONS.md` : les entrées datées citent les noms de l'époque — un journal ne se renomme pas ;
- les changelogs de version dans les frontmatters des fiches (« fin de la migration vers le monorepo Sibyl DS ») ;
- l'ancien dépôt `Design System MD` / `Design System UI` (lecture seule, base de connaissance) ;
- les identifiants de règles existants : **aucun ID ne change** — ils sont stables et jamais réattribués, la marque n'y touche pas.

> **Classement corrigé le 2026-08-01.** La v0.1.0 rangeait `content/doctrine/*.json` en catégorie 3, « régénérables : recompiler plutôt que rééditer ». C'est vrai du mécanisme, faux du contenu : `elevation.json` cite six fois « maquettes Figma **Sibyl** 86:129 et 128:136 » — une **source datée**, c'est-à-dire la trace de l'endroit où la décision a été prise. Recompiler ne l'effacerait pas, et ne le doit pas. Ces occurrences relèvent de la catégorie 4. Ce qui reste en catégorie 3 pour ces fichiers, ce sont les chaînes qui nomment l'**outil** ou le **chemin**, pas celles qui nomment une source.

## 5. Changements cassants — stratégie de compatibilité ou migration atomique

- ~~**`@sibyl/react` → `@fili/react`**~~ — **fait** (2026-07-30). Migration atomique dans le monorepo ; aucune période de double publication n'a été nécessaire, le paquet n'étant pas publié hors du monorepo.
- ~~**Renommage du dossier du dépôt**~~ — **fait**.
- **Nom de la skill du paquet** (`design-system-md` → nom Fili) : **ouvert**. Casse l'auto-chargement chez les consommateurs installés (`CLAUDE.md`/`AGENTS.md` pointant l'ancien nom). Prévoir une version de transition dont l'ancien nom référence le nouveau, ou une note d'installation.
- **URLs du site** (`/md/…`) si renommées : **ouvert**, redirections nécessaires.

## Ordre de migration — ce qui reste

1. **Éditorial** (catégorie 1, reliquat) — `README.md` et les trois commentaires de code. Vérification : `npm run verifie:tsc` (rien ne doit bouger).
2. **Générateurs** (textes produits par `genere-routeur.js`, `compile-regles.py`) puis régénération de toute la distribution. Vérification : `npm run plugin:build` sans erreur, diff du routeur relu.
3. **Produit et navigation** (catégorie 2) — libellés « mode build / mode audit » → **Fili DS / Fili Audit**, puis nom de la skill, avec note aux consommateurs. Vérification : `npm run build --workspace @fili/site`, installation du paquet dans un projet témoin.
4. **Techniques** (catégorie 3) — **un seul lot, seul, hors semaine de fermeture** : les six fichiers `*ds-md*` + les deux scripts npm, renommés ensemble. Vérification après le lot : `npm run verifie` complet (`verify-ds-md.mjs` est dans `tokens:build`).
5. **URLs `/md/`** (catégorie 5, reliquat) — avec redirections.

Chaque lot se journalise dans `DECISIONS.md` (étape 8). Aucun lot ne démarre sans validation explicite de son périmètre.
