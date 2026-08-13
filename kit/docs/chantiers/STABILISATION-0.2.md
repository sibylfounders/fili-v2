# Stabilisation 0.2 — retour à un état fiable

> Chantier de fiabilisation, **pas** d'avancement : aucun composant, aucune extension de
> baseline. Aucun commit n'a été créé.

## Repères Git

| | |
|---|---|
| SHA de départ | `fc61f8b24f4de66af6beda8dd1f261140688589e` |
| SHA courant | `fc61f8b` — **aucun commit produit** |
| Branche | `main` |
| Écart `origin/main` | +5 commits locaux non poussés (`origin/main` = `50301c2`) |
| Statut Git | 17 fichiers modifiés, 2 nouveaux ; SHA inchangé de bout en bout, aucun autre agent |

## Contrainte d'exécution — à lire avant toute reprise

Trois commandes ne peuvent PAS être jouées depuis la session Cowork :

- `npm test` (vitest 4) exige `rolldown-binding.linux-arm64-gnu.node` ; le `node_modules` du
  dépôt n'a que `@rolldown/binding-darwin-arm64`, et la VM Linux du pont échoue en
  `MODULE_NOT_FOUND`. Le conteneur cloud n'a aucun accès au registre npm (403
  `host_not_allowed`) : le binding manquant ne peut pas y être installé.
- `npm run build --workspace @fili/site` dépasse le plafond de 45 s de la VM et demanderait
  `@next/swc-linux-*`.
- `npm run verifie:rendu` en balayage strict dépend de ce build.

Elles doivent être jouées au Terminal macOS. Tant que la porte complète n'a pas rendu `0`, le
chantier reste incomplet, quelle que soit la qualité des corrections.

```bash
cd ~/Claude/Projects/Fili && npm run verifie
```

## Checklist

| # | Tâche | État | Preuve |
|---|---|---|---|
| 0 | Sécuriser l'intervention | FAIT | SHA/branche/statut relevés, modifications antérieures préservées |
| 1 | Défaut `Checkbox.Group` (CHOICE-R18) | FAIT | 7 scénarios, 16/16 en jsdom + React réel |
| 2 | Contrat des liens Markdown | FAIT | 31/31 sur le rendu `react-markdown` RÉEL ; auto-test du rendu vert |
| 3 | Les quatre durées `0s` | FAIT | `verifie:tokens` vert sans baseline ; portée prouvée par un `transform 0s` temporaire |
| 4 | Bruit des tests | PARTIEL | 3 sources sur 4 ; canvas d'axe-core hors périmètre (voir dettes) |
| 5 | Fraîcheur des contrats touchés | FAIT | manifeste régénéré, 35 exemples compilent, garde de consommation |
| 6 | Dépendances React non injectives | FAIT | collision reproduite ET corrigée ; dérivations 100 % `useMemo`, plus aucune ref écrite pendant le rendu |
| 7 | `tel:` : vrai lien, pas faux lien | FAIT | href conservé, rôle `link` présent, protocoles dangereux toujours vidés — sous-ensemble Fili, pas la RFC complète |
| 8 | Fin du traitement magique `NextLink` | FAIT | champ `imports`, agrégation générique, plus aucune mention de Next dans le vérificateur |
| 9 | Qualification de la preuve Chromium | FAIT | garde automatique et vérification ponctuelle distinguées ici et dans `DECISIONS.md` |
| 10 | Vérification finale complète | **FAIT** | `npm run verifie` → code **0** au Terminal macOS (2026-08-01). Détail au § « Porte complète » ci-dessous. |
| 11 | Commit | **FAIT** | `04ab6d8` (12 fichiers) ; trois fichiers partagés sont partis avec `9a4b425` — voir la note du § « Porte complète » |

## Défauts corrigés dans cette passe

### A. Dépendances React non injectives (`Checkbox.Group`, `CardGroup`)

**Cause.** Les deux composants donnaient `liste.join("|")` en dépendance à `useMemo`. Une
chaîne jointe n'est pas injective : `["a|b"]` et `["a", "b"]` produisent la même. Avec un
`onValueChange` stable, aucune dépendance ne bougeait, le contexte restait figé sur la
sélection précédente, et l'affichage devenait périmé.

**Correction, en deux temps — le premier essai était insuffisant.** `Checkbox.Group` prend la
sélection reçue telle quelle, avec une constante de module `AUCUNE` pour que le cas non
contrôlé n'invalide pas le mémo à chaque rendu ; c'est la valeur immuable réelle, et cette
partie n'a pas bougé depuis. `CardGroup`, en revanche, a d'abord reçu un `useListeStable` qui
tenait l'identité de ses listes dérivées dans une **ref comparée pendant le rendu**. Les tests
de collision passaient — mais l'écriture avait lieu hors du flux de rendu : invisible au rendu
concurrent, et survivant à un rendu abandonné. Un test vert obtenu par une impureté reste une
impureté.

**Forme finale : dérivations pures.** `useListeStable` est supprimé. `items` vient d'un
`useMemo` sur `children` (la validation de la frontière y est conservée mot pour mot), `cles`
et `valeurs` d'un `useMemo` sur `items`, `retenues` d'un `useMemo` sur `selection` et `value`,
et le contexte dépend de ces listes elles-mêmes. Aucune sérialisation, aucune comparaison
profonde, aucune écriture dans une ref pendant le rendu, aucun tableau reçu muté, API publique
inchangée. Contrepartie assumée : quand le parent recrée ses enfants à chaque rendu, la
collection se recompose plus souvent et ses effets de disposition se rejouent — la justesse
passe avant cette micro-optimisation.

**Preuve.** Avant la suppression du hook, `_smoke-collision.mjs` avait joué le scénario deux
fois : sur la source corrigée l'affichage suivait, sur une variante où `join("|")` était
réinjecté il restait périmé (`[true,false,false]`) — le défaut est donc bien celui décrit.
Après le passage aux dérivations pures, `_smoke-cardgroup.mjs` rejoue la collision (état
`["false","true","true"]` après `["a","b"]`) et vérifie en plus que les effets de disposition
suivent la liste : retirer une carte déplace le coin bas-droit, réordonner les clés recalcule
les coins. 8/8.

### B. `tel:` — un lien qui n'en était plus un

**Cause.** `react-markdown` assainit les URL avec une allowlist de protocoles
(`^(https?|ircs?|mailto|xmpp)$`). `tel:` n'y figurait pas : l'adresse était vidée, et un
`<a href="">` garde la facture d'un lien tout en perdant sa destination et son rôle
accessible `link`.

**Correction.** `markdown.tsx` passe un `urlTransform` qui laisse passer un **sous-ensemble
volontairement strict** des URI `tel:` — préfixe `tel:`, signe `+` facultatif, chiffres et
séparateurs visuels simples — et délègue tout le reste à `defaultUrlTransform`, l'API publique
de la version installée. Aucune allowlist maison ne remplace la leur : un cas est ajouté
devant elle. `tel:` ne passe pas par `next/link` — ce n'est pas une page, il n'a ni `basePath`
ni barre finale à recevoir.

**Ce que ce sous-ensemble ne couvre pas.** Ce n'est **pas** la RFC 3966, et Fili ne prétend pas
l'implémenter : extensions (`;ext=`), paramètres et `;phone-context=` n'en font pas partie. Une
forme non reconnue n'est pas traitée à part — elle retombe sur `defaultUrlTransform` et se
retrouve neutralisée, au même titre qu'un protocole dangereux. Élargir le sous-ensemble sera
une décision, le jour où le corpus en aura besoin.

**Ce que la version précédente de ce rapport présentait comme un résultat** — `href=""`
verrouillé par un test — **n'en était pas un** : c'était un faux lien entériné. Les
assertions correspondantes sont supprimées, et `DECISIONS.md` ne raconte plus qu'une seule
décision.

### C. Détection magique de `NextLink` dans le vérificateur d'exemples

**Cause.** `verifie-exemples.mjs` reconnaissait le nom `NextLink` dans le JSX et injectait
l'import correspondant. Le format du manifeste s'en trouvait couplé implicitement à Next.

**Correction.** `ExempleCanonique` gagne un champ facultatif `imports?: string[]`. L'exemple
d'intégration de `Card.TitleLink asChild` déclare le sien. Le vérificateur agrège et
dédoublonne ces déclarations, et déduit les identifiants qu'elles apportent (défaut, espace
de noms, nommés, alias) pour ne pas les réimporter depuis le baril — sans connaître aucune
bibliothèque. Le consommateur « plugin » rend ces imports avec l'extrait, pour que l'exemple
reste autonome. `@fili/react` ne gagne aucune dépendance.

## Ce qui est gardé automatiquement, et ce qui ne l'est pas

**Garde automatique persistante**, rejouée à chaque exécution de la chaîne : la structure CSS
de la bascule de visibilité des rails (`app-layout-visibilite.test.tsx` — état fermé caché,
délai tokenisé, ouverture sans délai, transition coupée en mouvement réduit), le périmètre
borné de l'exception de tokens, et le contrôle de rendu général sur les pages construites.

**Vérification manuelle ponctuelle**, faite une fois dans Chromium le 2026-07-30 et **non
rejouée** : la séquence dynamique d'ouverture et de fermeture des rails — rail fermé
réellement invisible et hors tabulation, visible dès la première frame, caché seulement après
le glissement, sans délai résiduel en `prefers-reduced-motion`. Le contrôle de rendu général
n'actionne pas les rails : cette séquence n'est garantie par aucune garde, et le rapport ne
prétend pas le contraire.

**Dette future éventuelle** : un scénario navigateur dynamique dédié. Il n'est pas créé ici.

## Résultats réellement rejoués (après toutes les corrections)

| Commande | Sortie | Mesure |
|---|---|---|
| `npm run tokens:build` | 0 | 70 paires de contraste, 0 échec requis |
| `npm run manifeste:check` | 0 | à jour, 30 composants |
| `npm run verifie:manifeste` | 0 | 30 entrées, 0 incohérence, 0 avertissement |
| `npm run verifie:tokens` | 0 | 456 bruts · 106 exceptions · baseline **178 / 350 occ., inchangée** |
| `npm run verifie:consommation` | 0 | 38 fichiers, 1 `FILI-MANQUE` (slider), constat 0 |
| `npm run verifie:exemples` | 0 | 35 exemples, 29 composants, 1 import d'intégration déclaré |
| `npm run verifie:tsc` | 0 | — |
| `npm run plugin:build` | 0 | 71 fichiers, 232 Ko |
| `node tools/teste-verifie-rendu.mjs` | 0 | 5 détections, 0 faux positif, `lien-hors-basepath` éprouvée |
| `git diff --check` | 0 | — |
| **`npm test`** | **0** | **10 fichiers, 226 tests réussis** |
| **`npm run build --workspace @fili/site`** | **0** | **96 pages générées** |
| **`npm run verifie:rendu` (strict)** | **0** | **93 pages balayées, 0 nouveau constat** |
| **`npm run verifie`** | **0** | **porte complète — contient les trois ci-dessus** |

> **Le tableau ci-dessus mélange deux dates, et il faut le lire ainsi.** Les dix premières
> lignes datent de la passe du 2026-07-30, sur l'arbre d'alors (`fc61f8b` + modifications).
> Leurs mesures — 456 constats bruts, 106 exceptions, 38 fichiers, 35 exemples, 71 fichiers de
> paquet — ne décrivent plus l'arbre commité : quatre chantiers de plus y ont été versés
> depuis. Les quatre dernières lignes, elles, datent du **2026-08-01** et portent sur `af3f023`.
> Elles ne sont pas rejouées ici : elles sont reprises de la porte complète.

## Porte complète — le résultat, et d'où il vient (2026-08-01)

```
npm run verifie   →  code de sortie 0
```

| Ce qui est mesuré | Résultat |
|---|---|
| Tests React (vitest) | **10 fichiers, 226 tests réussis** |
| Build Next (`@fili/site`) | **96 pages générées** |
| Vérificateur de rendu, strict | **93 pages balayées, 0 nouveau constat** |
| Manifeste | **30 composants, 0 incohérence** |
| Consommation du kit | conforme |
| Critères du corpus, contraste, couche UX | réussis |
| L'arbre après la porte | **non resali** — les générateurs n'ont produit aucun écart |

**Provenance.** Ces quatre premières mesures viennent d'un **audit indépendant conduit par
Codex** sur `af3f023`, et non d'une exécution de l'agent : `npm test` (rolldown *darwin-arm64*),
le build Next (plafond de 45 s) et tout ce qui ouvre Chromium restent hors d'atteinte depuis
une session Cowork — la contrainte du § précédent reste vraie, elle n'a pas disparu. Ce que
l'agent a pu rejouer lui-même sur l'arbre commité, en lecture seule : manifeste 30 entrées /
0 incohérence · `verifie:tokens --strict` (463 constats bruts, 113 exceptions, baseline
**178 / 350 occ., inchangée**) · `verifie:consommation` (44 fichiers, constat à 0) ·
`verifie:exemples` (39 exemples, 29 composants, 2 imports d'intégration) · `verifie:flows`
(code 0) · `verifie:tsc` (propre).

**Commits.** Les corrections de ce chantier sont dans **`04ab6d8`** — « Stabilisation 0.2 : un
`tel:` qui n'appelait personne, une durée nulle qui n'était pas une durée, et deux dérivations
écrites hors du rendu », 12 fichiers, sur la base `26a1eac`. Trois fichiers de ce chantier ont
voyagé avec **`9a4b425`** (la chaîne de validation), parce qu'ils portaient les deux chantiers
à la fois et qu'un fichier ne se coupe pas : `checkbox.tsx` (le registre d'exclusivité de
CHOICE-R18 y côtoie la prop `verdict`), `vitest.config.ts` (le retrait du bloc `esbuild` y
côtoie l'alias du greffon) et `choice.test.tsx`, déplacé délibérément pour qu'un test ne
précède jamais son sujet dans l'histoire. HEAD au moment de la clôture : **`af3f023`**.

Preuves obtenues hors vitest, sur la VM du pont : collision 4/4 (2 scénarios corrigés, 2
échecs attendus sur la variante régressée), CHOICE-R18 16/16, rendu Markdown réel 31/31,
adresses de liens 16/16. Elles attestent les COMPORTEMENTS ; elles n'attestent pas la
mécanique du harnais vitest, qui reste à confirmer par `npm test`.

Repères des passes précédentes, au Terminal : `npm test` avait rendu 129 tests / 2 échecs (les
deux sur le cas `tel:` de `markdown-site.test.tsx` — c'est ce constat qui a conduit à la
correction B plutôt qu'à un verrouillage du faux lien), puis la porte complète était passée à
135/135 tests, 35 exemples, 93 routes construites, 90 pages contrôlées, zéro constat de rendu,
baseline inchangée. **Cette micro-passe a modifié `card-group.tsx` depuis** : ces résultats ne
la couvrent plus, et la porte doit être rejouée.

## Tests de régression ajoutés dans cette passe

- `choice.test.tsx` — « COLLISION de sérialisation : `['a|b']` puis `['a','b']` » : rendu,
  rerender avec le même callback stable, vérification que `a|b` est décoché et que `a` et `b`
  sont cochés.
- `card-group.test.tsx` — le même scénario pour le régime `selection="multiple"`, sur
  `aria-checked`.
- `card-group.test.tsx` — « la disposition suit la LISTE » : retirer une carte, puis
  réordonner les clés, doit continuer de recalculer filets et coins. C'est la garde qui
  accompagne le passage aux dérivations pures ; une dépendance mal dérivée la casse.
- `markdown-site.test.tsx` — `tel:` vrai lien accessible avec son href ; `tel:` non routé (ni
  `basePath`, ni barre finale) ; trois protocoles dangereux neutralisés (`javascript:`,
  `data:`, `tel:javascript:`) ; facture du kit sur toutes les natures valides, `tel:` compris.

## Fichiers modifiés

```
 M apps/site/app/components/lien-markdown.tsx
 M apps/site/app/components/markdown.tsx
 M apps/site/content/md/core/DECISIONS.md
 M packages/react/manifest.json                      (régénéré)
 M packages/react/src/components/card-group/card-group.tsx
 M packages/react/src/components/checkbox/checkbox.tsx
 M packages/react/src/components/__tests__/card-group.test.tsx
 M packages/react/src/components/__tests__/choice.test.tsx
 M packages/react/src/components/__tests__/markdown-site.test.tsx
 M packages/react/src/components/__tests__/pilote.test.tsx
 M packages/react/src/manifest/pilote.ts
 M packages/react/src/manifest/schema.ts
 M packages/react/vitest.config.ts
 M tools/plugin/genere-catalogue.js
 M tools/verifie-exemples.mjs
 M tools/verifie-tokens.exceptions.json
 M tools/verifie-tokens.mjs
?? docs/chantiers/STABILISATION-0.2.md               (ce fichier)
?? packages/react/src/components/__tests__/app-layout-visibilite.test.tsx
```

Harnais de fumée et scripts de patch jetables : dossier gitignoré `_to_delete_rangement/`,
hors dépôt.

## Dettes laissées HORS PÉRIMÈTRE

Elles préexistent à ce chantier ou en sortent explicitement ; aucune n'est absorbée ici.

- Bruit canvas d'axe-core dans la sortie des tests — cause identifiée (`axe.js`,
  `document.createElement('canvas').getContext('2d')` dans la voie color-contrast) ; un stub
  mal calibré changerait les verdicts axe, et la sortie n'est pas observable depuis ici.
- Baseline historique des tokens : 178 entrées, 350 occurrences.
- Dérives documentaires déjà assumées du paquet plugin.
- `slider` déclaré `FILI-MANQUE`, fiche en attente d'arbitrage.
- Extension du schéma du manifeste aux props de toutes les sous-API compound — le trou est
  nommé dans l'entrée `Card`, il n'est pas comblé.
- 21 composants publics sans test direct ; `@fili/charts` sans test.
- Scénario navigateur dynamique pour les rails.
- Découpe de `apps/site/app/ui/registry.tsx` et de `packages/react/src/manifest/catalogue.ts` ;
  contrat universel indépendant de React ; distribution npm de `@fili/react`.

## Chantier clos — 2026-08-01

La porte a rendu **0**, le diff a été relu chantier par chantier, et les corrections sont
commitées (`04ab6d8`, plus les trois fichiers partagés dans `9a4b425`). L'arbre suivi est
propre ; la vérification complète ne l'a pas resali.

Ce qui n'est PAS clos et ne doit pas être lu comme tel : les dettes du § « Hors périmètre »
ci-dessus restent ouvertes, telles qu'écrites — bruit canvas d'axe-core sous jsdom, baseline
historique 178/350, 21 composants publics sans test direct, `@fili/charts` sans test, scénario
navigateur dynamique pour les rails, découpe de `registry.tsx` et `catalogue.ts`, contrat
universel hors React, distribution npm de `@fili/react`, `slider` en `FILI-MANQUE`.
Aucune n'a été traitée par cette clôture, et aucune n'a été requalifiée.
