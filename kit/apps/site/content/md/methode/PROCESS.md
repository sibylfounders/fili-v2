# Process

> La méthode, en quatre volets — l'essentiel, les décisions, le pipeline, les instruments.

## L’essentiel

**La méthode**

Comment une demande devient-elle une UI conforme ?

Le raisonnement, pas seulement l’artefact — dix étapes, dix décisions et sept instruments, de la demande à la génération par une IA.

Une demande entre, un inventaire cadre la couverture, une paire UX/UI sourcée est rédigée puis éprouvée (benchmark, couverture, scripts), les décisions sont journalisées, et le tout est compilé en règles légères qu'une IA peut consommer pour générer de l'UI conforme — ou pour auditer une interface existante en l'y confrontant — en remontant les arbitrages qu'elle n'a pas le droit de trancher.

La Méthode décrit comment la connaissance est **créée, qualifiée, vérifiée, publiée et entretenue** : elle produit et entretient le **socle commun de Fili**. Ce que les deux volets en font pendant une tâche est un autre pipeline, fixé par le routeur : **Fili DS** consomme le socle en mode construction, **Fili Audit** en mode audit — et leurs retours (usage, audits, arbitrages) réalimentent la Méthode.

```text
Méthode
→ produit et entretient le socle commun
→ Fili DS l'utilise pour construire
→ Fili Audit l'utilise pour examiner
→ leurs retours réalimentent la Méthode
```

Vue d'ensemble en quatre phases (synthèse pour la carte Fili — elle ne remplace pas les dix étapes) :

```text
Cadrer                 étapes 1–2
Formuler               étapes 3–4
Éprouver               étapes 5–7
Publier et apprendre   étapes 8–10 + boucles
```

**01 / INVENTAIRE**

### Cartographier avant de décider

Les cas d’usage révèlent les situations que la première intuition oublie.

**02 / CONTRADICTION**

### Éprouver chaque règle

Une règle est confrontée aux autres sujets, aux standards et aux cas limites avant de devenir normative.

**03 / TRACE**

### Journaliser ce qui change

Chaque révision garde l’ancienne règle, la nouvelle et la raison de l’arbitrage.

**10**étapes du pipeline

**7**instruments de pensée

**96**décisions journalisées

Quatre volets composent cette page : **l’essentiel** (cette vue d’ensemble), **décider** (dix décisions et le raisonnement dessous), **le pipeline** (le déroulé en dix étapes) et **le lexique** (les instruments de pensée, nommés).

## Décider

**02 · Le jugement**

### Comment je décide

Dix décisions : le réflexe qu’on aurait eu, la vérification qui l’a attrapé, le principe qui en reste.

01 · Formulaire · accessibilité**Le bouton d'envoi désactivé**

« Un contrôle ne doit jamais cacher la raison de son propre blocage. »

Voir le raisonnement02 · Nommage · sémantique**La fausse cohérence des noms**

« Une cohérence qui trahit le sens n'en est pas une — c'est un mensonge bien rangé. »

Voir le raisonnement03 · Contraste · intégrité**L'exception que je me suis refusée**

« Une règle que je m'impose ne souffre pas d'exception esthétique — sinon ce n'est pas une règle, c'est une préférence. »

Voir le raisonnement04 · Couleur · rigueur**Recalibrer contre sa propre marque**

« Aucune valeur sacrée n'échappe à sa propre règle. »

Voir le raisonnement05 · Méthode · humilité**La règle bâtie sur un seul cas**

« Une occurrence n'est pas un motif — un seul cas ne fait pas une règle universelle. »

Voir le raisonnement06 · Rigueur · dette cachée**La déduction silencieuse**

« Ce qui marche par déduction juste est une dette, pas une solution. »

Voir le raisonnement07 · Méthode · l'instrument**Le test de transposition**

« La structure d'un composant se déduit de ce qu'il fait, pas de ce qui l'a précédé. »

Voir le raisonnement08 · Systèmes · lecture d'indice**Le sujet « orphelin »**

« Une anomalie est parfois une information sur la nature de l'objet, pas une erreur à réparer. »

Voir le raisonnement09 · Systèmes · coût**Un socle plutôt qu'un gros bloc**

« Le coût d'un système se paie à la lecture — ne fais charger que ce que la situation réclame. »

Voir le raisonnement10 · Occam · avant d'ajouter**La moitié existait déjà**

« Avant d'ajouter, vérifie ce qui existe déjà — deux noms pour la même valeur, c'est une dette, pas une richesse. »

Voir le raisonnement

## Pipeline

**03 · Le déroulé**

### Le pipeline

De la demande à la consommation par une IA, en dix étapes.

**Étape 1 / 10**

#### La demande et le cadrage

Tout part d'une demande : *« documente le sujet X »*. Deux décisions avant d'écrire quoi que ce soit :

Le détail de cette étape

- **La nature du sujet** : *fondation* (matière ou vocabulaire de construction — couleur, typographie), *langage* (canal d'expression — interaction, mouvement, voix, émotion), *principe* (obligation ou raisonnement transversal — accessibilité, adaptation, lois), *composant* (variantes visuelles propres — bouton, input, card, alert), *pattern* (composition de plusieurs composants sur un écran — form) ou *flow* (séquence de patterns ou d'écrans vers un but — création de compte).

- **Le test de transposition** : vérifier que le modèle d'axes (style / tone / size…) s'applique réellement au sujet, plutôt que de le copier par défaut. C'est ce test qui a donné 2 axes seulement à la carte, un axe inédit (persistance) à l'alert, et aucun axe au form.

Le périmètre se trace aussi en négatif : ce que le composant **n'est pas** (le toast exclu de l'alert par la frontière « dans le flux vs au-dessus du flux »). Ce cadrage fixe les **frontières et le propriétaire du sujet** : chaque règle qui naîtra ici aura ce sujet pour propriétaire, et c'est contre ces frontières que se jugeront plus tard les cessions d'autorité (étape 10).

**Étape 2 / 10**

#### L'inventaire des cas d'usage

Avant la rédaction, construire `content/md/inventaires/inventaire-cas-usage-x` (fichier .md) : la carte de tous les contextes où le composant apparaît. C'est un **outil de vérification** (checklist de couverture pour l'étape 6), pas du contenu à lire.

Le détail de cette étape

Règle apprise — biais confirmé 4 fois, désormais un prédicteur : **l'état transitoire** (loading, validation asynchrone, skeleton, disparition/résolution) est systématiquement le trou de la première rédaction. La section « sortie de scène / état d'attente » s'écrit donc d'office, avant le test de couverture.

Leçon typographie (v1.1.0) : cette étape s'applique **aussi aux fondations** — l'avoir sautée avait laissé 10 trous sur 33 cas.

Deux portées d'inventaire coexistent désormais :

- **inventaire de sujet** — vérifie un composant, pattern, flow ou fondation contre ses contextes ; chaque trou revient à ce sujet ou à un propriétaire nommé ;

- **inventaire transversal** — audite une contrainte qui traverse plusieurs propriétaires (premier cas : `inventaire-cas-usage-accessibilite.md`). Il cartographie les règles réparties, distingue couvert / partiel / absent / en attente, et **ne devient pas une source normative de substitution**. Un trou se comble dans le composant, pattern ou fondation qui en est propriétaire, puis le statut transversal est recalculé.

**Étape 3 / 10**

#### La rédaction UX/UI — paire ou exception déclarée

Un sujet visuel se documente en **2 fichiers** :

Le détail de cette étape

- **`X-UX`** (fichier .md) — le raisonnement : les axes, les règles, les frontières, les cas limites. Une re-thématisation (valeurs de tokens) ne le fait pas bouger ; un rebranding complet (voix, iconographie, formes, composition, partis pris d'identité) peut en revanche faire évoluer certaines de ses règles.

- **`X-UI`** (fichier .md) — les tokens visuels : référence toujours `DESIGN.md` **par nom de token**, jamais de valeur brute (hex, px) — sauf standard externe non négociable (ex. zone tactile 44px WCAG).

Si un token manque, il s'ajoute d'abord à `DESIGN.md` avec montée de version (la carte a introduit `elevation.*` et `media_ratio.*` ; l'alert, `info`/`info-subtle` et `success-subtle`).

Les exceptions UX-only sont déclarées par `companion: none` : les principes de référence ou transversaux sans traduction visuelle propre (`accessibility`, `cognitive-load`, `laws`, `performance`) et le flow qui orchestre des écrans sans posséder de pixels (`creation-compte`). Le validateur les reconnaît par leur nature (`companion: none` + type principle/language/foundation/flow), sans compte figé. L'exception décrit une différence de nature ; elle ne permet pas d'oublier un fichier UI nécessaire.

**Étape 4 / 10**

#### Le sourçage

Les affirmations non triviales sont **sourcées** ; les arbitrages débattus, divergents ou fragiles portent en plus un **niveau de confiance explicite** : *établi > convergence > cas isolé > non formalisé*. Chaque fiche se clôt sur son tableau de sources, avec une clause par défaut pour les règles de simple mécanisme — la couverture règle par règle n'est pas encore vérifiée mécaniquement.

Le détail de cette étape

Les points réellement débattus sont marqués comme tels (ex. fluid type et WCAG 1.4.4 à zoom extrême — « émergent/débattu »).

Ce sourçage n'est pas décoratif : c'est lui qui indique à l'IA consommatrice (étape 9) quand trancher seule et quand remonter la question.

Depuis le pivot du 2026-07-21 (Fili = couche d'intelligence de conception au-dessus d'un design system hôte), le sourçage porte une seconde dimension : le **statut de frontière**, dans la continuité de la distinction « contrainte ≠ parti pris » née du stress-test du 2026-07-17. Trois statuts : la **propriété universelle** (contrainte — WCAG, standards, mécanismes établis) fonde seule une non-conformité en audit d'une interface tierce ; le **parti pris d'identité** (registres productifs de motion/voice, « jamais de disabled comme validation ») est paramétrable et se lit en audit comme une *divergence de registre* à signaler à part, jamais comme un défaut ; l'**implémentation de référence** (tokens, valeurs et variantes des fichiers `*-UI.md` et de `DESIGN.md`) n'est jamais un critère d'audit d'hôte. Le statut s'annote progressivement, tiré par l'usage des audits — pas par une passe de réécriture.

Qualifier une règle, c'est enfin déclarer ses **relations nécessaires**, quand elles sont constatées — jamais par passe globale : `derive-de` (elle décline un principe amont), `exception-de` (elle borne une autre règle), `cede-a` (son autorité appartient à un autre propriétaire), et la **tension** (deux règles pertinentes peuvent entrer en conflit selon le contexte — l'arbitrage vit dans un objet `T-xxx` qui possède seul ses pôles). Une relation n'est acceptée que si son consommateur et sa conséquence sont identifiés. **Capacité pilote** : schéma, cascade d'impact et démonstrateur dans `docs/chantiers/PILOTE-RELATIONS-ARBITRAGES.md` et `tools/pilote-relations/` — rien n'est encore porté dans la grammaire des fiches ni dans la chaîne de compilation.

**Étape 5 / 10**

#### Le benchmark externe

Confronter la fiche à la littérature, aux standards et aux systèmes de design majeurs (Carbon, Polaris, Material, GOV.UK, Atlassian…) pour repérer ce que la première rédaction a manqué. Pour un flow, cette passe précède la confrontation à un corpus d'interfaces réelles : la littérature formule les règles ; le réel éprouve leur pouvoir de détection.

Le détail de cette étape

Complémentaire à l'inventaire, elle ne le remplace pas.

**Étape 6 / 10**

#### Le test de couverture

Vérifier la fiche **contre l'inventaire** de l'étape 2 : chaque cas d'usage est-il couvert par une règle ? Identifier les trous, combler les prioritaires (l'ordre de grandeur constaté : ~3 trous prioritaires par composant).

Le détail de cette étape

Tester avant livraison, pas après.

La couverture s'étend aux **dépendances et tensions réellement rencontrées** pendant le test : un cas d'usage qui bute sur une règle d'un autre sujet révèle une dépendance à déclarer (étape 4) ; deux règles pertinentes qui tirent en sens contraire révèlent une tension candidate. On déclare ce que le test a fait apparaître — pas ce qu'une passe systématique inventerait.

**Étape 7 / 10**

#### La vérification outillée

Le détail de cette étape

Quatre contrôles, tous lançables depuis la racine, tous sans autre dépendance que Node et Python. Ils ne se **remplacent** pas : chacun garde une frontière différente.

- **`npm run tokens:build`** — la **fidélité des valeurs et le contraste**. Enchaîne trois étapes : la génération (`tokens.css`, thème Tailwind, variables Figma), la **garde de fidélité** (`verify-ds-md.mjs` — nom technique hérité, cf. `docs/chantiers/MIGRATION-FILI.md` — qui confronte chaque token du package React à la valeur d'autorité de `DESIGN.md` : une divergence non déclarée dans `ds-md.map.mjs` **casse le build**), puis les **paires de contraste** (`validate-contrast.mjs`, seuils 4.5:1 pour le texte, 3:1 pour une bordure identifiante, en clair et en sombre). Le contrat de valeurs se rafraîchit par `npm run sync:ds-md`, jamais à la main.
- **`npx tsc --noEmit -p apps/site/tsconfig.json`** — le **typage** du site et des packages qu'il consomme.
- **`python3 tools/compile-regles.py --tous`** — la **compilation** vers `dist/build/` et `dist/audit/`, avec le compte loi / préférence / **non qualifié** et l'empreinte SHA-256 de chaque sujet. Le nombre de non qualifiées est le reste-à-faire réel de l'étape 4 ; une empreinte qui ne correspond plus signale une paire modifiée sans recompilation.
- **`node tools/plugin/build-plugin.js`** — le **graphe du routeur**. Un renvoi vers un sujet inconnu, une extension déclarée dans une intention, un `selon-contexte` qui ne boucle pas : erreur bloquante. Un sujet joignable par aucune intention : avertissement, listé dans `tools/plugin/reports/RAPPORT-ROUTEUR.md`.

À l'échelle d'un sujet, **`python3 tools/extrait-decisions.py <sujet>`** projette les annotations vers la fiche et signale au passage les règles sans source, les règles sans cas d'usage, et les « lois fragiles » — déclarées universelles sans norme ni convergence de deux systèmes.

Les seuils du système ne sont pas déclaratifs, ils sont **testés** : tout recalibrage de couleur se re-vérifie par `npm run tokens:build`, à relancer après toute modification de `DESIGN.md` ou d'un `*-UI.md`.

> **Ce que cette étape ne couvre plus.** Deux contrôles de l'ancien dépôt n'ont pas été portés dans le monorepo : `valide-dossier.js` (structure du dossier — paires UX/UI complètes, renvois croisés valides, versions incrémentées, aucune valeur brute non justifiée) et `test-rendu.js` (combinaisons d'axes visuellement indiscernables). Ce sont des trous ouverts, pas des contrôles déplacés : rien ne vérifie aujourd'hui qu'une paire est complète ni qu'un renvoi pointe quelque part. Le dire est plus utile que de laisser croire à une garantie qui n'existe plus.

> **Ce que cette étape couvrira quand le pilote sera porté.** La validation des identifiants de règles, des références entre règles, des cycles interdits de dépendance normative, et l'**index d'impact** (dépendants directs et transitifs d'une règle modifiée) existent en démonstrateur dans `tools/pilote-relations/` (auto-testé, tranche de six sujets). Capacités **pilotes** : elles n'entrent dans cette liste qu'une fois portées dans la chaîne réelle.

**Étape 8 / 10**

#### La journalisation des décisions

Toute modification de **règle, de relation ou d'arbitrage** s'inscrit dans `DECISIONS.md`, datée : *ancien état → nouvel état → pourquoi*. Les fichiers `*-UX.md`/`*-UI.md` ne contiennent que les règles **actuelles** et renvoient au journal quand le contexte historique vaut le détour.

Le détail de cette étape

Le journal n'est pas normatif sur les règles : en cas de divergence, le fichier de composant a raison — et la divergence elle-même se journalise.

**Étape 9 / 10**

#### La compilation du socle — et ses deux projections

L'étape 9 sépare ce qui est écrit de ce qui est consommé :

```text
Sources éditoriales
→ compilation du socle commun
→ projection Fili DS : règles de build + implémentation de référence
→ projection Fili Audit : règles auditables + statut de frontière, sans imposer les tokens de Fili
```

Le détail de cette étape

**La compilation.** `tools/compile-regles.py` (un sujet, ou `--tous`) extrait **mécaniquement** chaque `RULES-X` (.md) depuis la source UX, avec version et empreinte SHA-256 — la généralisation, faite dans le monorepo, du mécanisme que l'ancien dépôt n'appliquait qu'au flow création de compte. Sorties doubles : `dist/build/` et `dist/audit/`. Chaque `RULES-X` porte un **frontmatter de routage** : son périmètre, ses dépendances dures (`requires`) et conditionnelles (`selon-contexte`).

**Le routeur.** `tools/plugin/genere-routeur.js` compile ces frontmatters + une table d'intentions éditoriale — **huit intentions** aujourd'hui : Formulaire, Collection, Page de contenu, Feedback, Création de compte, Consentement, Cadre applicatif, Superposé modal — en un **routeur généré** (`CLAUDE.md`, auto-lu par Claude Code, son jumeau `AGENTS.md` pour Cursor/Codex/Copilot, et le `SKILL.md` du paquet), assemblé par `tools/plugin/build-plugin.js`, jamais édité à la main. Le **socle universel**, chargé pour toute intention, compte **cinq sujets** : `accessibility`, `interaction`, `adaptive`, `cognitive-load`, `performance`.

Le routeur peut être commun aux deux volets ; ce qui diffère, ce sont les **contextes consommés** et les **droits de conclusion** :

- **projection Fili DS (mode build)** : charger le socle (routeur + `tokens.yaml` + les cinq RULES universels) puis **uniquement** le bundle de l'intention reconnue ; intention inconnue → décomposer par sujet via la table et les `requires` ; retouche isolée → le seul fichier concerné ; sujet hors périmètre (table, datepicker, popover) → **s'arrêter et remonter**, ne pas improviser ; ne jamais lire la couche atelier pendant un build, ne jamais éditer la distribution à la main ; **s'arrêter et remonter la question** dès qu'une décision de design se pose au lieu d'être tranchée par une règle — les lignes CONFIANCE calibrent la vitesse de remontée ;

- **projection Fili Audit (mode audit)** : même table d'intentions, bundle chargé **sans** `tokens.yaml` — l'implémentation de référence n'est jamais un critère d'audit d'une interface tierce ; constats qui citent leurs règles, statut de frontière appliqué (à corriger / suggestion / à trancher), non-couverts remontés au lieu d'être improvisés.

Le script valide le graphe (toute mention « RULES-x » d'un corps doit être déclarée dans son frontmatter ; tout bundle est clos sur ses dépendances dures) et **refuse de régénérer** en cas d'erreur → `tools/plugin/reports/RAPPORT-ROUTEUR.md`, qui mesure aussi le coût en tokens par bundle. Pour installer la distribution dans un projet consommateur : `docs/INSTALLATION.md`, rendu public par la page installation du site avec l'archive de la distribution.

**Étape 10 / 10**

#### La boucle de dédoublonnage — et la correction des dépendances

Signal de méthode permanent, à l'origine de deux réorganisations :

Le détail de cette étape

- **Règle dupliquée entre deux composants → pattern.** La coordination bouton/champs trouvée en double entre `BUTTON-UX.md` et `INPUT-UX.md` a fait naître `content/md/patterns/FORM-UX.md`.

- **Recouvrement entre un pattern et un composant → le composant fait autorité.** Le résumé d'erreurs est un alert danger permanent : le conteneur vit dans `content/md/components/ALERT-UX.md`, `FORM-UX.md` garde l'orchestration propre au formulaire.

La **cession d'autorité** est l'issue normale de cette boucle : la règle qui n'est plus propriétaire garde son identifiant, passe en `note de méthode` et pointe vers son propriétaire réel (relation `cede-a`, étape 4 — quatre cessions journalisées à ce jour). La boucle corrige aussi les **dépendances** : un transfert de propriété repointe les relations qui visaient l'ancienne règle, et la validation (étape 7, quand elle sera portée) refuse une règle supprimée encore référencée.

Chaque composant documenté renvoie ainsi de la connaissance vers les précédents — le système converge au lieu de s'empiler.

##### Les boucles de rétroaction

Le pipeline n'est pas linéaire ; quatre boucles le referment (la quatrième, Impact, est une capacité visée — pilote) :

| Boucle | De → vers | Déclencheur |
|---|---|---|
| Couverture | Étape 6 → étape 3 | Un trou trouvé contre l'inventaire → on complète la fiche |
| Dédoublonnage | Étape 10 → étapes 1–3 | Une règle en double → naissance d'un pattern ou transfert d'autorité |
| Arbitrage | Étape 9 → l'humain | L'IA consommatrice rencontre une décision non tranchée → elle s'arrête et expose les options |
| Impact *(capacité visée — pilote)* | Une règle modifiée → étapes 7, 8, 9 | Dépendants directs et transitifs identifiés → sorties recompilées → contrôles ciblés rejoués → conséquences sémantiques réexaminées → décision journalisée |

À quoi s'ajoute la boucle de fond : tout ce que les boucles produisent passe par l'étape 8 (journal) et se recompile en étape 9.

La boucle d'**Impact** distingue le mécanique du sémantique : une modification mécanique se propage automatiquement (recompilation) ; une modification sémantique **ne réécrit jamais automatiquement ses dépendants** — elle les invalide et les met en file de revue humaine. Son mécanisme n'est pas implémenté : c'est la capacité que vise le pilote (`docs/chantiers/PILOTE-RELATIONS-ARBITRAGES.md`, démonstrateur `tools/pilote-relations/`).

##### En une phrase

Une demande entre, un inventaire cadre la couverture, une paire UX/UI sourcée est rédigée puis éprouvée (benchmark, couverture, scripts), les décisions sont journalisées, et le tout est compilé en règles légères qu'une IA peut consommer pour générer de l'UI conforme — ou pour auditer une interface existante en l'y confrontant — en remontant les arbitrages qu'elle n'a pas le droit de trancher.
