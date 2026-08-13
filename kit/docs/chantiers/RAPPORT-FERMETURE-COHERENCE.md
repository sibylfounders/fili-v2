# Rapport de fermeture — chantier cohérence (2026-07-29, commits a54567d → 818e5a0)

> Critère de réussite visé : *un agent reçoit le bon contrat Fili, connaît l'API réellement
> disponible, utilise les composants existants, signale les manquants, ne peut pas inventer
> silencieusement une option, et un site incorrect fait échouer la vérification avant publication.*
> Statuts employés : **TERMINÉ-VÉRIFIÉ** · **PARTIEL** · **DETTE ACCEPTÉE** · **DÉCISION REQUISE** · **HORS PÉRIMÈTRE**.

## 1. Ce qui a été corrigé (vs l'audit de fermeture)

| Écart de l'audit | Verdict | Statut |
|---|---|---|
| `npm run verifie` non bloquant | scripts scindés `rapport:*` / `verifie:*` ; `verifie` = chaîne complète (tokens → manifeste:check → manifeste → tokens strict → consommation strict → exemples → tsc → tests → paquet → site) | TERMINÉ-VÉRIFIÉ (les 7 premiers maillons attestés sur machine le 2026-07-29 ; tests et site attestés le 2026-08-01 — cf. §4) |
| Génération silencieuse du manifeste | `manifeste:check` compare la génération EN MÉMOIRE au commité, n'écrit rien, message de régénération | TERMINÉ-VÉRIFIÉ |
| CI publie sur simple build visuel | pages.yml verrouillé — fichier PROTÉGÉ contre l'écriture à distance ; **appliqué le 2026-08-01** (`af3f023`) et réaligné sur la porte élargie | PARTIEL (appliqué et cohérent localement ; **jamais exécuté par GitHub** — cf. §4) |
| 61 écarts non bloquants | baseline versionnée `tools/verifie-tokens.baseline.json` : 146 entrées / 305 occurrences (détection ÉTENDUE : dimensions, durées, z-index, couleurs), chacune avec justification et vague ; tout nouveau/augmentation échoue ; `--update-baseline` ne sait QUE réduire | TERMINÉ-VÉRIFIÉ |
| Var locale « connue partout » | portée PAR DOSSIER de composant + liste `PARTAGEES` explicite (vide) | TERMINÉ-VÉRIFIÉ |
| Validateur consommation regex/ligne, non livré | `fili-check.mjs` : AST TypeScript, fichier complet, portable (`node fili-check.mjs .`), config d'exclusions justifiées, échec clair sans TypeScript ; livré dans le paquet ; `verifie-consommation` = enveloppe monorepo du même moteur | TERMINÉ-VÉRIFIÉ (fixtures ± + auto-test dans build-plugin) |
| JSX multiligne non détecté | fixture dédiée (input multiligne) détectée | TERMINÉ-VÉRIFIÉ |
| FILI-MANQUE sans fiche | fiche exigée (`.fili/manques/` consommateur · `content/md/inventaires/manques/` monorepo), statuts contrôlés (proposé/validé/refusé/résolu), résolu+marqueur = échec, promotion fantôme = échec | TERMINÉ-VÉRIFIÉ (1er cas réel : `chip-renvoi`) |
| Paquet sans Contract/Protocol/validateur | 6 livrables ajoutés + **liens documentaires des KIT vérifiés mécaniquement** (lien mort = paquet non produit) ; KIT-socle ne cite plus de chemin interne au monorepo | TERMINÉ-VÉRIFIÉ (paquet 70 fichiers, 217 Ko) |
| « Le manifeste ne peut pas mentir » vrai du seul pilote | axes `axe<U>()` sur les 27, props `propsDe<P>()`, anatomie `anatomie<T>()`, exemple canonique + accessibilité + anti-patterns EXIGÉS pour tout stable, dette doctrinale QUALIFIÉE (champ `dette`) sinon échec | TERMINÉ-VÉRIFIÉ (limite honnête : une prop inventée qui collisionne avec un attribut HTML passe le garde `propsDe` ; les axes, eux, sont étanches) |
| Atelier dérivé pour 3 composants | 16 composants de plus dérivés (Select, Tabs, Drawer, Modal, Dropdown, Container, Link, Skeleton, Alert, Toast, Switch, ThemeToggle, Delete/SubmitButton, CardGroup…) ; **Card séparée de la démo CardGroup** (2 entrées, expandable inclus) | TERMINÉ-VÉRIFIÉ (reste manuel, assumé : contrôles pédagogiques — position d'icône, contenus de démo) |
| Marque active « Sibyl » | atelier (Fili Docs, Fili, fili.fr), commentaires techniques @fili/* ; historiques/journaux INTACTS ; skill `design-system-md` non renommée (compat installations) | TERMINÉ-VÉRIFIÉ |

## 2. Commandes exécutées et résultats exacts (sur ta machine, 818e5a0)

```
npm run manifeste:check      → ✅ manifest.json à jour (27 composants)
verifie-tokens --strict      → ✅ pilote 0 écart · 0 nouveau · 0 augmentation (baseline 146/305)
verifie-consommation --strict→ ✅ 23 fichiers AST · 0 écart · 2 manques déclarés (chip-renvoi)
verifie-manifeste            → ✅ 27 entrées · 0 incohérence · 0 avertissement
verifie-exemples             → ✅ 28 exemples canoniques compilent (26 composants importés)
tsc site                     → ✅ (inclut les gardes de types du manifeste)
build-plugin                 → ✅ 70 fichiers, 217 Ko — auto-test fili-check + 0 lien mort
teste-fili-check             → ✅ 10 détections sur fixture négative, 0 faux positif
```

## 3. Couvertures

- **Manifeste** : 27/27 entrées ; axes typés sur 24 composants porteurs d'axes ; props gardées partout où l'API publique est typée (exception : sous-composants de Dropdown — props non exportées, garde au niveau des axes seulement) ; 28 exemples canoniques compilables ; 3 dettes doctrinales qualifiées (AppLayout, Skeleton, ThemeToggle, Brand, Drawer, Dropdown — champ `dette` avec vague).
- **Atelier** : options dérivées du manifeste pour 20 entrées ; restent manuels (choix assumés) : contrôles pédagogiques (icône, labels, données de démo) et le contrôle `field_type` d'Input (c'est le type HTML, pas une prop).
- **Tests** : pilote couvert en API/interaction/accessibilité (26 assertions : défauts, alias `style`→`variant` + priorité, relief data-*, focus v2, clearable/Password/Search/Number, aria-invalid, Card clickable/selectable/loading, axe-core sans violation hors color-contrast).

## 4. Ce qui reste ouvert — avec propriétaire et prochaine action

| Ouvert | Statut | Prochaine action |
|---|---|---|
| Exécution des tests vitest | **TERMINÉ-VÉRIFIÉ** (2026-08-01, `af3f023`) — `npm test` → code 0, **10 fichiers, 226 tests réussis** | — |
| `npm audit` | **DÉCISION REQUISE** (2026-08-01) — exécuté, **2 vulnérabilités `high`** ; la correction proposée est une migration majeure vers Next 16. Voir § 7. | Arbitrer la stratégie de mise à niveau. Aucun correctif n'a été appliqué. |
| Build Next + `npm run verifie` complet | **TERMINÉ-VÉRIFIÉ** (2026-08-01, `af3f023`) — `npm run verifie` → code 0 ; build **96 pages**, rendu strict **93 pages, 0 nouveau constat** ; l'arbre suivi n'a pas été resali | — |
| pages.yml | **PARTIEL** — le fichier est **appliqué** (`af3f023`) et sa **cohérence locale est vérifiée** : ses 17 étapes reproduisent le script `verifie` dans le même ordre, plus `npm ci` et `npx playwright install`, ce dernier remonté AVANT `verifie:contraste`. Mais **le workflow n'a jamais été exécuté par GitHub** : les 9 commits ne sont pas poussés. Un fichier cohérent n'est pas un workflow qui passe. | Pousser, puis lire le premier run réel. Rien ne sera « vérifié » avant. |
| Tests visuels (clair/sombre/reduced-motion/hover/pressed) | **DETTE ACCEPTÉE** — jsdom n'a pas de moteur de rendu ; Storybook exclu | Harnais Playwright sur l'Atelier (le cloud a Chromium ; il faut @playwright/test installable — Terminal) — vague dédiée |
| Tests adaptatifs (220px, redimensionnement réel du conteneur) | **DETTE ACCEPTÉE** — container queries invisibles en jsdom | Même harnais Playwright, pages /ui en `fill` |
| Baseline 146 entrées | **DETTE ACCEPTÉE** — gelée, ne peut plus croître | Résorption par vagues (2→8), `--update-baseline` à chaque réduction |
| `chip-renvoi` (2 boutons natifs des grilles doctrine) | **DÉCISION REQUISE** — fiche `proposé` | Valider/refuser la promotion (Chip de renvoi) |
| Retrait d'AppShell du baril ; sort du token `accent` (libéré par le focus v2) ; alias `style` (retrait en majeure) ; fiches condensées du plugin (éditoriales vs dérivées) | **DÉCISION REQUISE** | Arbitrages listés aussi dans RAPPORT-CHANTIER-COHERENCE §5 |
| Storybook, nouveaux composants, refonte visuelle, renommage de la skill | **HORS PÉRIMÈTRE** (consigne) | — |

## 5. Contenu exact du paquet agents (build/design-system-md.plugin, v1.7.1, 70 fichiers)

47 RULES-* · KIT-socle + 8 KIT-<intention> (générés du manifeste) · FILI-COMPONENT-CONTRACT.md ·
MISSING-COMPONENT-PROTOCOL.md · fili-check.mjs + fili-check.config.example.json ·
modele-fiche-manque.md · manifest.json · tokens.css/tokens.yaml/theme-gate.mjs ·
CLAUDE.md/AGENTS.md/SKILL.md (routeur, règle 11 = charge des KIT si @fili/react) · README + plugin.json.
Publication versionnée : `npm run plugin` (publie.js proposera le bump depuis 1.7.1).

## 6. Note d'implémentation pour la suite

Le moteur AST est UN fichier (`tools/fili-check.mjs`), consommé par le monorepo (verifie-consommation),
par le paquet (copie au build, auto-testée) et par les consommateurs (`node fili-check.mjs .`).
Toute nouvelle détection s'ajoute là, avec sa fixture dans `tools/fixtures/fili-check/` — l'auto-test
du build refuse un paquet dont le validateur a perdu une détection.

## 7. Audit de dépendances — relevé du 2026-08-01, aucune correction appliquée

`npm audit --json`, exécuté au Terminal macOS sur `af3f023`. **Deux vulnérabilités `high`.**
La commande est **inexécutable depuis une session Cowork** : le pont et le conteneur cloud
répondent tous deux `403 blocked-by-allowlist` sur `registry.npmjs.org`.

### Ce qui est installé, vérifié dans l'arbre réel

| Paquet | Installé | Déclaré | D'où il vient |
|---|---|---|---|
| `next` | **14.2.35** | `apps/site` → `^14.2.15` | dépendance **directe** du site |
| `postcss` (racine) | **8.4.31** | — | **épinglé EXACTEMENT par `next`** (`next` → `postcss: 8.4.31`) |
| `postcss` (site) | 8.5.22 | `apps/site` → `^8.4.47` | pipeline Tailwind/autoprefixer du site |

Le fait décisif : la PostCSS vulnérable n'est pas celle qu'utilise le pipeline CSS du site.
Elle est **enfermée dans l'épinglage de Next**, qui la fixe à la version exacte. Elle ne peut
donc pas être relevée sans changer Next — ce qui explique la correction proposée par npm.

### Applicabilité PROBABLE au déploiement statique

Le site est construit en export statique :

```js
output: "export",  images: { unoptimized: true }
```

Il n'y a donc **ni serveur Next à l'exécution, ni middleware, ni optimiseur d'images** : les
classes d'alertes qui visent ces surfaces n'ont pas de cible dans le déploiement actuel.
Le mot **probable** est là exprès. Cette lecture porte sur la *surface d'exécution*, pas sur le
contenu précis des avis : les identifiants d'avis ne sont lisibles que dans la sortie de
`npm audit --json`, que l'agent n'a pas pu produire. **Rien ici ne permet de déclarer ces
alertes corrigées, ni négligeables.** Une alerte qui vise la chaîne de BUILD, et non le serveur,
resterait applicable — l'export statique ne protège pas de ce qui s'exécute pour le produire.

### Statut et décision restante

**DÉCISION REQUISE.** Trois routes existent — migrer vers Next 16 (majeure, chantier à part
entière), attendre un correctif de la ligne 14.x, ou documenter une dette acceptée après
lecture des avis. **Aucune n'est retenue ici**, et la dette n'est pas déclarée acceptée.

Interdictions respectées, et vérifiables au diff : `npm audit fix` **n'a pas été lancé** ;
`package.json` et `package-lock.json` **ne sont pas modifiés** ; les versions de Next et de
PostCSS **n'ont pas changé**. La mise à niveau sera un chantier séparé.

## 8. Résidu ignoré `_to_delete_rangement/` — inventaire et traitement

3,6 Mo, 148 fichiers, dossier gitignoré (`_to_delete*/`). **Il n'était pas que du résidu** :
`CAHIER-FILI-AUDIT.md` — document versionné, commité en `156987a` — y cite **quatre fichiers
nommément**, les trois maquettes exécutables de `pilote/` (`navigateur-fili.html`,
`planche-fili-v2.html`, `fili-audite-par-fili.html`) et `lot0-verdicts.csv`. Une suppression en
bloc aurait cassé ces renvois depuis un document du dépôt.

| Famille | Poids | Classement | Sort |
|---|---|---|---|
| `pilote/` — maquettes exécutables, verdicts et instruments du lot 0 | 1,6 Mo | **preuve unique, citée par un document versionné** | **conservé en place** |
| `_smoke-validation.mjs` + `_smoke-validation-build/` | 182 Ko | preuve palliative, **citée** par `VALIDATION-CHAINE.md` § 6bis, et **supplantée** par `npm test` (226 tests) | **conservé en place** |
| `_generate.apres.mjs`, `_theme.avant.cjs` | ~20 Ko | copies d'états déjà versionnés par git (`8080e95`) | supprimé |
| `demo/` (7 versions successives d'une même démo), `_kit/`, `tw/`, 4 scripts `_patch_*.py`, `_lot15.tar.gz`, 2 journaux, `.DS_Store`, `__pycache__`, et les scripts de session `commits.sh` / `partition.sh` / `pages.yml` (ce dernier commité en `af3f023`) | ~1,9 Mo | **résidus reproductibles** | supprimé |
| — | — | *indécidable* | **aucun** |

**Décision d'Aurélien, 2026-08-01** (interface à choix, option recommandée retenue) :
supprimer les seuls résidus reproductibles, conserver en place les deux familles citées par
un document du dépôt. Motif : aucune citation cassée, et aucun document hors du périmètre de
cette clôture n'a besoin d'être retouché. Le dossier subsiste à ≈1,7 Mo — **dette nommée, pas
fermée**. L'archivage hors dépôt de `pilote/` reste possible plus tard, mais il exigera de
mettre à jour `CAHIER-FILI-AUDIT.md`, qui n'était pas dans le périmètre autorisé ici.
