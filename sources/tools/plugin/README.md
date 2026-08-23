# tools/plugin — chaîne de fabrication du paquet Cowork

Produit `build/design-system-md.plugin`, le paquet installable dans Cowork.

```bash
npm run plugin                 # le chemin normal : livrer une nouvelle version
```

`publie.js` compare les sources du paquet à ce qui a été livré la dernière fois
(`etat-publication.json`). Identique : il s'arrête sur « rien de neuf » sans rien reconstruire.
Sinon il énumère ce qui a bougé, incrémente la version et reconstruit :

- **patch** (1.7.0 → 1.7.1) par défaut — une fiche retouchée, un token modifié ;
- **mineur** automatique si un sujet entre ou sort du corpus, ou avec `npm run plugin -- --minor` ;
- `-- --majeur` pour une rupture côté consommateur, `-- --version=2.1.0` pour imposer un numéro,
  `-- --sans-bump` pour reconstruire sans toucher à la version (mise au point).

Le numéro de version est ce qui distingue deux paquets pour celui qui les installe : il ne bouge
que quand le contenu livré a changé, et jamais deux fois pour le même contenu.

```bash
npm run plugin:build           # reconstruire sans passer par la logique de version
```

**L'installation demande toujours un geste** : glisser `build/design-system-md.plugin` dans une
conversation Cowork et accepter la carte. Il n'existe pas d'API d'installation silencieuse.
Le dossier `build/` n'est pas versionné.

## Ce qui est source, ce qui est généré

| Chemin | Statut |
|---|---|
| `apps/site/content/md/core/DESIGN.md` | **source** — frontmatter = tous les tokens |
| `apps/site/content/md/**/*-UX.md`, `*-UI.md` | **source** — la doctrine longue |
| `tools/plugin/rules/RULES-*.md` | **source** — condensations éditoriales (voir plus bas) |
| `tools/plugin/plugin.json` | **source** — nom, version, description du paquet |
| `tools/plugin/README-paquet.md` | **source** — README embarqué dans le paquet |
| `tools/plugin/theme-gate.mjs` | **source** — barrière consommateur, voyage avec les tokens |
| `tools/plugin/config-intentions.js` | **source** — table d'intentions, socle universel, hors-périmètre (source unique, partagée avec le harnais du pilote) |
| `tools/plugin/etat-publication.json` | **source** — mémoire de ce qui a été livré (écrit par `publie.js`, à committer) |
| `build/plugin/**` | généré |
| `tools/plugin/reports/RAPPORT-ROUTEUR.md` | généré (poids des bundles, erreurs, avertissements) |

## Le point qui se rate

Une fiche `RULES-<sujet>.md` **n'est pas dérivable par script**. C'est une condensation
éditoriale d'une paire `<SUJET>-UX.md` / `<SUJET>-UI.md` : on garde les règles normatives et les
arbitrages, on jette la prose et les cas d'usage. Aucun outil ne la régénère — modifier la
doctrine d'un sujet oblige à repasser sur sa fiche à la main.

**Ajouter un sujet** = écrire la paire `-UX`/`-UI` dans `apps/site/content/md/`, compiler sa
fiche dans `tools/plugin/rules/`, puis :

- si le sujet mérite sa propre porte d'entrée, ajouter une entrée à la table `INTENTIONS` de
  `config-intentions.js` (la partie éditoriale du routeur vit là, plus dans le script) ;
- sinon il reste accessible par la table des sujets du routeur — le rapport le signalera comme
  « orphelin », ce qui est l'état attendu dans ce cas.

## Contrat de frontmatter (le routeur échoue sinon)

```yaml
---
sujet: <slug identique au nom de fichier>
type: fondation | langage | principe | composant | pattern | flow | extension
resume: "une phrase"
requires: ["sujets chargés d'office avec celui-ci"]
selon-contexte: ["sujets à n'ajouter que si la situation se présente (raison)"]
---
```

Règle dure : toute mention `RULES-<slug>` dans le corps d'une fiche doit être déclarée dans son
`requires` ou son `selon-contexte`. Le plus simple est de nommer les sujets voisins en toutes
lettres dans le corps, sans le préfixe.

Une fiche `type: extension` porte en plus `extension-de: <parent>` ; elle n'entre jamais dans un
bundle d'intention, seulement dans la colonne « selon contexte » de son parent.

## Diffuser à d'autres utilisateurs — le jour où

Aujourd'hui la diffusion est manuelle : un fichier `.plugin`, une carte acceptée. Ça tient pour
une personne, pas pour une équipe ni pour un client.

Le chemin prévu par Claude est le **marketplace** : un dépôt git qui porte un
`.claude-plugin/marketplace.json` (champs obligatoires `name`, `owner`, `plugins[]`, chaque entrée
avec `name` et `source` — chemin relatif, dépôt GitHub, URL ou paquet npm). L'utilisateur ajoute le
marketplace une fois, installe le plugin depuis celui-ci, et reçoit ensuite les nouvelles versions —
mise à jour de fond, ou `/plugin marketplace update`. Le champ `version` du `plugin.json` sert
exactement à ça : tant qu'il ne bouge pas, personne ne reçoit rien. D'où la discipline de `publie.js`.

Ce que ça demanderait ici : un dépôt de distribution (public si des tiers doivent s'y brancher,
privé si la diffusion est contrôlée), un `publie.js` étendu qui copie `build/plugin/` dedans, commit
et push — le modèle de `deploie-md.sh` dans DS-MD. Décision reportée le 2026-07-28 : on reste au
fichier pour l'instant.

Source : <https://code.claude.com/docs/en/plugin-marketplaces.md>.

## Historique

Chaîne portée depuis le dépôt `Design System MD` le 2026-07-26 (`tools/genere-tokens.js` et
`tools/genere-routeur.js`), au moment où le paquet Cowork installé (1.6.0, 16/07) a divergé du
monorepo. Le reste de l'outillage DS-MD (génération du site, audits, garden) n'a pas été porté :
seul le chemin du paquet l'a été.

## Hors distribution

`DECISIONS-locales.gabarit.md` vit dans `tools/pilote-arbitrage/` : c'est un **artefact de
pilote**, retiré du paquet le 2026-07-28 tant que le cycle de vie des décisions locales
(`docs/chantiers/CADRAGE-ARBITRAGE-CONSOMMATEUR.md` § 8) n'est pas mécaniquement garanti. Il n'entre ni dans
le build, ni dans les empreintes de `publie.js`.
