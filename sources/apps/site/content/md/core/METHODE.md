---
name: "Méthode — pipeline de documentation d'un sujet"
version: "1.15.2" # 1.15.2 : rangement du dépôt (2026-07-29) — les documents de chantier (CADRAGE-*, MIGRATION-FILI, PILOTE-RELATIONS-ARBITRAGES, RAPPORT-*) quittent la racine pour docs/chantiers/ ; mentions repointées, aucune règle modifiée. 1.15.1 : correction factuelle (audit 2026-07-28) — quatre boucles de rétroaction, pas trois (la boucle d'Impact, capacité visée par le pilote, comptait déjà dans la table) ; nom hérité verify-ds-md signalé vers MIGRATION-FILI.md. 1.15.0 : réalignement sur l'architecture Fili (2026-07-27) — la Méthode produit et entretient le socle commun, Fili DS le consomme en build, Fili Audit en audit, leurs retours la réalimentent ; répartition d'autorité formalisée (la Méthode fait autorité sur le processus, les fiches sur leurs règles) ; étape 9 récrite en compilation + deux projections avec les chiffres réels du routeur (8 intentions, socle universel à 5 sujets, sorties dans le paquet) ; relations typées intégrées aux étapes 1, 4, 6, 7, 8, 9 et 10 en capacité PILOTE (cf. PILOTE-RELATIONS-ARBITRAGES.md), sans onzième étape ; boucle d'impact ajoutée aux rétroactions (capacité visée) ; synthèse en quatre phases pour la carte Fili. Aucune règle de design modifiée. 1.14.0 : étape 7 réécrite sur la chaîne réellement disponible dans le monorepo (tokens:build, tsc, compile-regles, build-plugin, extrait-decisions) ; les deux contrôles non portés — valide-dossier.js et test-rendu.js — sont désormais nommés comme des trous ouverts au lieu d'être promis. Aucune autre étape modifiée. 1.13.1 : 1.13.1 : chemins repointés vers `content/md/` — fin de la migration vers le monorepo Sibyl DS (2026-07-27) ; aucune règle, aucun token, aucune source modifiés. 1.13.0 : format « décisions sourcées » — identifiant stable, statut de frontière, sources citées par la règle, problème facultatif ; projection mécanique vers la fiche (tools/extrait-decisions.py). Pilote sur border, cf. DECISIONS.md 2026-07-26. 1.12.0 : 1.12.0 : re-synchronisation (2026-07-23) — exceptions UX-only formulées par nature (principes companion:none + flow, sans nombre en dur) ; hors-périmètre : Toast retiré (désormais documenté), exemples non couverts = modale/table/navigation/datepicker ; re-thématisation vs rebranding complet explicité (un fichier UX peut évoluer sous un rebranding complet). 1.11.0 : le routeur porte deux modes — build et audit (bundle sans tokens, statut de frontière, constats non couverts remontés) ; P2 du pivot 2026-07-21. 1.10.0 : statut de frontière (pivot 2026-07-21) — propriété universelle / parti pris d'identité / implémentation de référence entre dans la méthode, avec sa lecture d'audit. 1.9.0 : la méthode reconnaît les trois familles Core — Foundations, Languages, Principles — et leur test de classement. 1.8.1 : vocabulaire aligné sur le modèle style × tone du bouton (DECISIONS 2026-07-18), aucune règle modifiée. 1.8.0 : la nature Flow et ses exceptions UX-only entrent dans la méthode. Historique antérieur : cf. DECISIONS.md.
description: "Le fonctionnement du produit, étape par étape : comment une demande (« documente le sujet X ») devient une source UX/UI ou UX-only sourcée, éprouvée, journalisée, puis compilée en règles consommables par une IA. Compagnon visuel : la page Pipeline du site, /md/methode/process/ (source : content/md/methode/PROCESS.md)."
companion: "content/md/methode/PROCESS.md" # rendu par le site sur /md/methode/process/
---
# Méthode — le pipeline de documentation

## Rôle de ce fichier
La Méthode décrit **comment la connaissance est créée, qualifiée, vérifiée, publiée et entretenue**. Elle **produit et entretient le socle commun de Fili** ; elle ne décrit pas, à elle seule, le fonctionnement runtime des deux volets qui le consomment :

- **Fili DS** consomme le socle en mode **construction** (sélectionner, générer, justifier une interface) ;
- **Fili Audit** le consomme en mode **audit** (détecter, qualifier, expliquer les écarts d'une interface existante) ;
- les résultats d'usage, les audits et les arbitrages **retournent dans la Méthode** — c'est elle qui les qualifie et les republie.

```text
Méthode
→ produit et entretient le socle commun
→ Fili DS l'utilise pour construire
→ Fili Audit l'utilise pour examiner
→ leurs retours réalimentent la Méthode
```

Les pipelines runtime de Fili DS et Fili Audit (comment la connaissance est consommée pendant une tâche) sont fixés par le routeur généré (étape 9) — pas par ce fichier.

**Répartition d'autorité.** La Méthode fait **autorité sur le processus de production de la connaissance** (les dix étapes, leurs contrôles, leurs boucles). Les fiches `*-UX.md`/`*-UI.md` font **autorité sur leurs règles de design** — la Méthode n'invente aucune règle. Le `README.md` peut résumer la Méthode ; il ne peut pas la contredire silencieusement : en cas de divergence, ce fichier fait foi sur le processus, la fiche fait foi sur la règle, et la divergence se journalise (étape 8).

## Les deux couches de Fili

Fili repose sur une séparation stricte entre deux couches :

- **L'atelier** (la source) : `content/md/core/`, `content/md/foundations/`, `content/md/languages/`, `content/md/principles/`, `content/md/components/`, `content/md/patterns/`, `content/md/flows/` et `content/md/inventaires/`. C'est là que le raisonnement vit et que les décisions se journalisent. Riche et daté, il est trop lourd pour servir de contexte à une IA en train de coder. Foundations, Languages, Principles, Components, Patterns et Flows sont les seules catégories éditoriales — les relations entre règles (étape 4) sont un mécanisme interne, pas une catégorie de plus.
- **La distribution** (générée) : ce que les deux volets consomment — un `RULES-<sujet>.md` par sujet avec version et empreinte SHA-256 (`tools/compile-regles.py`, vers `dist/build/` et `dist/audit/`), les tokens, et un **routeur généré** (`CLAUDE.md` + son jumeau `AGENTS.md`, assemblés dans le paquet par `tools/plugin/build-plugin.js`) qui fixe le protocole et route chaque intention vers son bundle minimal. Elle n'est jamais éditée comme source : ce qui n'est pas encore dérivé mécaniquement est une dette explicite, pas une compilation prétendue.

Une troisième nature de fichier traverse les deux couches : `DESIGN.md`, seule source des valeurs réelles (hex, px). Une **re-thématisation** de ces valeurs (couleurs, radius, police) se fait dans ce seul fichier, sans toucher aux règles UX ; un **changement d'identité plus large** peut en revanche demander des décisions d'iconographie, de voix, de composition ou de forme qui dépassent les tokens.

## Le pipeline — 10 étapes

### 1. La demande et le cadrage
Tout part d'une demande : *« documente le sujet X »*. Deux décisions avant d'écrire quoi que ce soit :

- **La nature du sujet** : *fondation* (matière ou vocabulaire de construction — couleur, typographie), *langage* (canal d'expression — interaction, mouvement, voix, émotion), *principe* (obligation ou raisonnement transversal — accessibilité, adaptation, lois), *composant* (variantes visuelles propres — bouton, input, card, alert), *pattern* (composition de plusieurs composants sur un écran — form) ou *flow* (séquence de patterns ou d'écrans vers un but — création de compte).
- **Le test de transposition** : vérifier que le modèle d'axes (style / tone / size…) s'applique réellement au sujet, plutôt que de le copier par défaut. C'est ce test qui a donné 2 axes seulement à la carte, un axe inédit (persistance) à l'alert, et aucun axe au form.

Le périmètre se trace aussi en négatif : ce que le composant **n'est pas** (le toast exclu de l'alert par la frontière « dans le flux vs au-dessus du flux »). Ce cadrage fixe les **frontières et le propriétaire du sujet** : chaque règle qui naîtra ici aura ce sujet pour propriétaire, et c'est contre ces frontières que se jugeront plus tard les cessions d'autorité (étape 10).

### 2. L'inventaire des cas d'usage
Avant la rédaction, construire `content/md/inventaires/inventaire-cas-usage-x` (fichier .md) : la carte de tous les contextes où le composant apparaît. C'est un **outil de vérification** (checklist de couverture pour l'étape 6), pas du contenu à lire.

Règle apprise — biais confirmé 4 fois, désormais un prédicteur : **l'état transitoire** (loading, validation asynchrone, skeleton, disparition/résolution) est systématiquement le trou de la première rédaction. La section « sortie de scène / état d'attente » s'écrit donc d'office, avant le test de couverture.

Leçon typographie (v1.1.0) : cette étape s'applique **aussi aux fondations** — l'avoir sautée avait laissé 10 trous sur 33 cas.

Deux portées d'inventaire coexistent désormais :

- **inventaire de sujet** — vérifie un composant, pattern, flow ou fondation contre ses contextes ; chaque trou revient à ce sujet ou à un propriétaire nommé ;
- **inventaire transversal** — audite une contrainte qui traverse plusieurs propriétaires (premier cas : `inventaire-cas-usage-accessibilite.md`). Il cartographie les règles réparties, distingue couvert / partiel / absent / en attente, et **ne devient pas une source normative de substitution**. Un trou se comble dans le composant, pattern ou fondation qui en est propriétaire, puis le statut transversal est recalculé.

### 3. La rédaction UX/UI — paire ou exception déclarée
Un sujet visuel se documente en **2 fichiers** :

- **`X-UX`** (fichier .md) — le raisonnement : les axes, les règles, les frontières, les cas limites. Une re-thématisation (valeurs de tokens) ne le fait pas bouger ; un rebranding complet (voix, iconographie, formes, composition, partis pris d'identité) peut en revanche faire évoluer certaines de ses règles.
- **`X-UI`** (fichier .md) — les tokens visuels : référence toujours `DESIGN.md` **par nom de token**, jamais de valeur brute (hex, px) — sauf standard externe non négociable (ex. zone tactile 44px WCAG).

Si un token manque, il s'ajoute d'abord à `DESIGN.md` avec montée de version (la carte a introduit `elevation.*` et `media_ratio.*` ; l'alert, `info`/`info-subtle` et `success-subtle`).

Les exceptions UX-only sont déclarées par `companion: none` : les principes de référence ou transversaux sans traduction visuelle propre (`accessibility`, `cognitive-load`, `laws`, `performance`) et le flow qui orchestre des écrans sans posséder de pixels (`creation-compte`). Le validateur les reconnaît par leur nature (`companion: none` + type principle/language/foundation/flow), sans compte figé. L'exception décrit une différence de nature ; elle ne permet pas d'oublier un fichier UI nécessaire.

### 4. Le sourçage
Les affirmations non triviales sont **sourcées** ; les arbitrages débattus, divergents ou fragiles portent en plus un **niveau de confiance explicite** : *établi > convergence > cas isolé > non formalisé*. Chaque fiche se clôt sur son tableau de sources, avec une clause par défaut pour les règles de simple mécanisme — la couverture règle par règle n'est pas encore vérifiée mécaniquement. Les points réellement débattus sont marqués comme tels (ex. fluid type et WCAG 1.4.4 à zoom extrême — « émergent/débattu »).

Ce sourçage n'est pas décoratif : c'est lui qui indique à l'IA consommatrice (étape 9) quand trancher seule et quand remonter la question.

Depuis le pivot du 2026-07-21 (Fili = couche d'intelligence de conception au-dessus d'un design system hôte), le sourçage porte une seconde dimension : le **statut de frontière**, dans la continuité de la distinction « contrainte ≠ parti pris » née du stress-test du 2026-07-17. Trois statuts : la **propriété universelle** (contrainte — WCAG, standards, mécanismes établis) fonde seule une non-conformité en audit d'une interface tierce ; le **parti pris d'identité** (registres productifs de motion/voice, « jamais de disabled comme validation ») est paramétrable et se lit en audit comme une *divergence de registre* à signaler à part, jamais comme un défaut ; l'**implémentation de référence** (tokens, valeurs et variantes des fichiers `*-UI.md` et de `DESIGN.md`) n'est jamais un critère d'audit d'hôte. Le statut s'annote progressivement, tiré par l'usage des audits — pas par une passe de réécriture.

Qualifier une règle, c'est enfin déclarer ses **relations nécessaires**, quand elles sont constatées — jamais par passe globale, avec la même discipline que le statut de frontière : `derive-de` (la règle décline un principe amont — si l'amont change de sens, elle doit être réexaminée), `exception-de` (elle borne le domaine d'une autre), `cede-a` (son autorité appartient à un autre propriétaire — la règle cédante passe en `note de méthode`), et la **tension** (deux règles pertinentes peuvent entrer en conflit selon le contexte ; l'arbitrage vit dans un objet `T-xxx` qui possède seul ses pôles). Une relation n'est acceptée que si son consommateur et sa conséquence sont identifiés. **Capacité pilote** : le schéma, la cascade d'impact et le démonstrateur vivent dans `docs/chantiers/PILOTE-RELATIONS-ARBITRAGES.md` et `tools/pilote-relations/` — rien de tout cela n'est encore porté dans la grammaire des fiches ni dans la chaîne de compilation.

### 5. Le benchmark externe
Confronter la fiche à la littérature, aux standards et aux systèmes de design majeurs (Carbon, Polaris, Material, GOV.UK, Atlassian…) pour repérer ce que la première rédaction a manqué. Pour un flow, cette passe précède la confrontation à un corpus d'interfaces réelles : la littérature formule les règles ; le réel éprouve leur pouvoir de détection. Complémentaire à l'inventaire, elle ne le remplace pas.

### 6. Le test de couverture
Vérifier la fiche **contre l'inventaire** de l'étape 2 : chaque cas d'usage est-il couvert par une règle ? Identifier les trous, combler les prioritaires (l'ordre de grandeur constaté : ~3 trous prioritaires par composant). Tester avant livraison, pas après.

La couverture s'étend aux **dépendances et tensions réellement rencontrées** pendant le test : un cas d'usage qui bute sur une règle d'un autre sujet révèle une dépendance à déclarer (étape 4) ; deux règles pertinentes qui tirent en sens contraire révèlent une tension candidate. On déclare ce que le test a fait apparaître — pas ce qu'une passe systématique inventerait.

### 7. La vérification outillée
Quatre contrôles, tous lançables depuis la racine, tous sans autre dépendance que Node et Python. Ils ne se **remplacent** pas : chacun garde une frontière différente.

- **`npm run tokens:build`** — la **fidélité des valeurs et le contraste**. Enchaîne trois étapes : la génération (`tokens.css`, thème Tailwind, variables Figma), la **garde de fidélité** (`verify-ds-md.mjs` — nom technique hérité, cf. `docs/chantiers/MIGRATION-FILI.md` — qui confronte chaque token du package React à la valeur d'autorité de `DESIGN.md` : une divergence non déclarée dans `ds-md.map.mjs` **casse le build**), puis les **paires de contraste** (`validate-contrast.mjs`, seuils 4.5:1 pour le texte, 3:1 pour une bordure identifiante, en clair et en sombre). Le contrat de valeurs se rafraîchit par `npm run sync:ds-md`, jamais à la main.
- **`npx tsc --noEmit -p apps/site/tsconfig.json`** — le **typage** du site et des packages qu'il consomme.
- **`python3 tools/compile-regles.py --tous`** — la **compilation** vers `dist/build/` et `dist/audit/`, avec le compte loi / préférence / **non qualifié** et l'empreinte SHA-256 de chaque sujet. Le nombre de non qualifiées est le reste-à-faire réel de l'étape 4 ; une empreinte qui ne correspond plus signale une paire modifiée sans recompilation.
- **`node tools/plugin/build-plugin.js`** — le **graphe du routeur**. Un renvoi vers un sujet inconnu, une extension déclarée dans une intention, un `selon-contexte` qui ne boucle pas : erreur bloquante. Un sujet joignable par aucune intention : avertissement, listé dans `tools/plugin/reports/RAPPORT-ROUTEUR.md`.

À l'échelle d'un sujet, **`python3 tools/extrait-decisions.py <sujet>`** projette les annotations vers la fiche et signale au passage les règles sans source, les règles sans cas d'usage, et les « lois fragiles » — déclarées universelles sans norme ni convergence de deux systèmes.

Les seuils du système ne sont pas déclaratifs, ils sont **testés** : tout recalibrage de couleur se re-vérifie par `npm run tokens:build`, à relancer après toute modification de `DESIGN.md` ou d'un `*-UI.md`.

> **Ce que cette étape ne couvre plus.** Deux contrôles de l'ancien dépôt n'ont pas été portés dans le monorepo : `valide-dossier.js` (structure du dossier — paires UX/UI complètes, renvois croisés valides, versions incrémentées, aucune valeur brute non justifiée) et `test-rendu.js` (combinaisons d'axes visuellement indiscernables). Ce sont des trous ouverts, pas des contrôles déplacés : rien ne vérifie aujourd'hui qu'une paire est complète ni qu'un renvoi pointe quelque part. Le dire est plus utile que de laisser croire à une garantie qui n'existe plus.

> **Ce que cette étape couvrira quand le pilote sera porté.** La validation des identifiants de règles, des références entre règles, des cycles interdits de dépendance normative, et l'**index d'impact** (dépendants directs et transitifs d'une règle modifiée) existent en démonstrateur dans `tools/pilote-relations/` (auto-testé, tranche de six sujets). Ce sont des capacités **pilotes** : elles n'entrent dans cette liste qu'une fois portées dans la chaîne réelle.

### 8. La journalisation des décisions
Toute modification de **règle, de relation ou d'arbitrage** s'inscrit dans `DECISIONS.md`, datée : *ancien état → nouvel état → pourquoi*. Les fichiers `*-UX.md`/`*-UI.md` ne contiennent que les règles **actuelles** et renvoient au journal quand le contexte historique vaut le détour. Le journal n'est pas normatif sur les règles : en cas de divergence, le fichier de composant a raison — et la divergence elle-même se journalise.

### 9. La compilation du socle — et ses deux projections
L'étape 9 sépare ce qui est écrit de ce qui est consommé :

```text
Sources éditoriales
→ compilation du socle commun
→ projection Fili DS : règles de build + implémentation de référence
→ projection Fili Audit : règles auditables + statut de frontière, sans imposer les tokens de Fili
```

**La compilation.** `tools/compile-regles.py` (un sujet, ou `--tous`) extrait **mécaniquement** chaque `RULES-X` (.md) depuis la source UX, avec version et empreinte SHA-256 — c'est la généralisation, faite dans le monorepo, du mécanisme que l'ancien dépôt n'appliquait qu'au flow création de compte. Les sorties sont doubles : `dist/build/` et `dist/audit/`. Chaque `RULES-X` porte un **frontmatter de routage** : son périmètre, ses dépendances dures (`requires`) et conditionnelles (`selon-contexte`).

**Le routeur.** `tools/plugin/genere-routeur.js` compile ces frontmatters + une table d'intentions éditoriale — **huit intentions** aujourd'hui : Formulaire, Collection, Page de contenu, Feedback, Création de compte, Consentement, Cadre applicatif, Superposé modal — en un **routeur généré** (`CLAUDE.md`, auto-lu par Claude Code, son jumeau `AGENTS.md` pour Cursor/Codex/Copilot, et le `SKILL.md` du paquet), assemblé dans le paquet par `tools/plugin/build-plugin.js`, jamais édité à la main. Le **socle universel** — chargé pour toute intention — compte **cinq sujets** : `accessibility`, `interaction`, `adaptive`, `cognitive-load`, `performance`.

Le routeur peut être commun aux deux volets ; ce qui diffère, ce sont les **contextes consommés** et les **droits de conclusion** :

- **projection Fili DS (mode build)** : charger le socle (routeur + `tokens.yaml` + les cinq RULES universels) puis **uniquement** le bundle de l'intention reconnue ; intention inconnue → décomposer par sujet via la table et les `requires` ; retouche isolée → le seul fichier concerné ; sujet hors périmètre (table, datepicker, popover) → **s'arrêter et remonter**, ne pas improviser ; ne jamais lire la couche atelier pendant un build, ne jamais éditer la distribution à la main ; **s'arrêter et remonter la question** dès qu'une décision de design se pose au lieu d'être tranchée par une règle — les lignes CONFIANCE calibrent la vitesse de remontée ;
- **projection Fili Audit (mode audit)** : même table d'intentions, bundle chargé **sans** `tokens.yaml` — l'implémentation de référence n'est jamais un critère d'audit d'une interface tierce ; constats qui citent leurs règles, statut de frontière appliqué (à corriger / suggestion / à trancher), non-couverts remontés au lieu d'être improvisés.

Le script valide le graphe (toute mention « RULES-x » d'un corps doit être déclarée dans son frontmatter ; tout bundle est clos sur ses dépendances dures) et **refuse de régénérer** en cas d'erreur → `tools/plugin/reports/RAPPORT-ROUTEUR.md`, qui mesure aussi le coût en tokens par bundle. Pour installer la distribution dans un projet consommateur : `docs/INSTALLATION.md`, rendu public par la page installation du site avec l'archive de la distribution.

### 10. La boucle de dédoublonnage — et la correction des dépendances
Signal de méthode permanent, à l'origine de deux réorganisations :

- **Règle dupliquée entre deux composants → pattern.** La coordination bouton/champs trouvée en double entre `BUTTON-UX.md` et `INPUT-UX.md` a fait naître `content/md/patterns/FORM-UX.md`.
- **Recouvrement entre un pattern et un composant → le composant fait autorité.** Le résumé d'erreurs est un alert danger permanent : le conteneur vit dans `content/md/components/ALERT-UX.md`, `FORM-UX.md` garde l'orchestration propre au formulaire.

La **cession d'autorité** est l'issue normale de cette boucle : la règle qui n'est plus propriétaire garde son identifiant, passe en `note de méthode` et pointe vers son propriétaire réel (relation `cede-a`, étape 4 — quatre cessions journalisées à ce jour). La boucle corrige aussi les **dépendances** : un transfert de propriété repointe les relations qui visaient l'ancienne règle, et la validation (étape 7, quand elle sera portée) refuse une règle supprimée encore référencée.

Chaque composant documenté renvoie ainsi de la connaissance vers les précédents — le système converge au lieu de s'empiler.

## Les boucles de rétroaction

Le pipeline n'est pas linéaire ; quatre boucles le referment (la quatrième, Impact, est une capacité visée — pilote) :

| Boucle | De → vers | Déclencheur |
|---|---|---|
| Couverture | Étape 6 → étape 3 | Un trou trouvé contre l'inventaire → on complète la fiche |
| Dédoublonnage | Étape 10 → étapes 1–3 | Une règle en double → naissance d'un pattern ou transfert d'autorité |
| Arbitrage | Étape 9 → l'humain | L'IA consommatrice rencontre une décision non tranchée → elle s'arrête et expose les options |
| Impact *(capacité visée — pilote)* | Une règle modifiée → étapes 7, 8, 9 | Dépendants directs et transitifs identifiés → sorties recompilées → contrôles ciblés rejoués → conséquences sémantiques réexaminées → décision journalisée |

À quoi s'ajoute la boucle de fond : tout ce que les boucles produisent passe par l'étape 8 (journal) et se recompile en étape 9.

La boucle d'**Impact** distingue le mécanique du sémantique : une modification mécanique se propage automatiquement (recompilation) ; une modification sémantique **ne réécrit jamais automatiquement ses dépendants** — elle les invalide et les met en file de revue humaine. Son mécanisme n'est pas implémenté : c'est la capacité que vise le pilote (`docs/chantiers/PILOTE-RELATIONS-ARBITRAGES.md`, démonstrateur `tools/pilote-relations/`), à présenter comme telle tant qu'elle n'est pas portée.

## La Méthode en quatre phases (pour la carte Fili)

Synthèse visuelle uniquement — elle ne remplace pas les dix étapes :

```text
Cadrer                 étapes 1–2
Formuler               étapes 3–4
Éprouver               étapes 5–7
Publier et apprendre   étapes 8–10 + boucles
```

## En une phrase
Une demande entre, un inventaire cadre la couverture, une paire UX/UI sourcée est rédigée puis éprouvée (benchmark, couverture, scripts), les décisions sont journalisées, et le tout est compilé en règles légères qu'une IA peut consommer pour générer de l'UI conforme — ou pour auditer une interface existante en l'y confrontant — en remontant les arbitrages qu'elle n'a pas le droit de trancher.

## Décisions sourcées (pilote 2026-07-26 — sujet `border`)

Une règle n'est utile à un audit que si elle est **adressable** et **qualifiée**. Le format ajoute quatre
choses à chaque `RÈGLE`, dans le markdown qui reste la source de vérité :

```
RÈGLE [BORDER-R03] : <la solution — la règle elle-même>
STATUT : propriété universelle | parti pris d'identité | implémentation de référence | note de méthode
SOURCE : S1, S6            # références de la bibliographie de fin de fichier ; « interne » si la décision est nôtre
PROBLÈME : <une phrase>    # facultatif — à défaut, le « > **Pourquoi** » ou l'« > **Erreur fréquente** » qui suit
```

La bibliographie de fin de fichier gagne une colonne `Réf.` (`S1…Sn`) : les sources ne sont plus une
annexe du fichier, elles sont citées **par la règle**.

RÈGLE : le **statut de frontière** décide de ce qu'un audit a le droit d'opposer à un tiers.
`propriété universelle` = vraie de tout produit, opposable. `parti pris d'identité` = notre choix,
jamais imposé. `implémentation de référence` = vrai de ce code, pas du design. `note de méthode` = hors audit.

RÈGLE : le champ `PROBLÈME` reste **facultatif**. Toutes les règles n'ont pas de douleur à énoncer
(une définition n'en a pas) ; l'imposer partout fabriquerait du remplissage. `SOURCE`, lui, est
**obligatoire** — c'est la promesse : une règle sans source déclarée, fût-ce « interne », est un trou.

RÈGLE : les identifiants sont **stables et jamais réattribués**. Une règle retirée laisse son numéro
vacant ; le journal (DECISIONS.md) dit ce qu'elle est devenue.


RÈGLE : la **couche UI porte aussi ses règles**, avec le même format et un préfixe distinct
(`SUJET-Unn`, sources `T1…Tn`). Ce ne sont pas des arbitrages de design mais des consignes
d'implémentation : elles se citent en revue de code, pas en réunion client. Leur statut est le plus
souvent `implémentation de référence`.

RÈGLE : **l'autorité descend au grain de la décision.** La version et le niveau de confiance en tête
de fichier restent un journal de rédaction — ils ne font plus autorité sur une règle en particulier,
qui porte les siens. Deux endroits qui disent la même chose finissent par se contredire : en cas de
divergence, la décision a raison.


RÈGLE : deux champs complètent le format, tournés vers la **sortie d'audit** :
`ÉNONCÉ` — la règle dite en une phrase pour quelqu'un d'extérieur, sans renvoi interne (c'est elle
qui part en rapport et dans le prompt de correction) ; `MESURE` — le critère vérifiable, quand il
existe. Une règle sans mesure ne peut pas produire de constat automatique : l'outil ne promet que ce
qu'il sait constater. La **première source citée** est la source principale, celle qu'un rapport affiche.

RÈGLE : la sortie d'audit a **trois registres**, jamais mélangés — `à corriger` (norme violée),
`suggestion` (notre parti pris diffère), `à trancher` (le référentiel ne couvre pas : on pose la
question, on ne propose rien). Le registre se déduit du statut de frontière ; mélanger les trois fait
rejeter la liste entière.


RÈGLE : **une règle ne peut être une « propriété universelle » que si elle repose sur une norme
(W3C, WCAG, MDN) ou sur au moins DEUX systèmes indépendants qui convergent.** Un seul système d'accord
avec nous n'est pas une convergence, c'est un emprunt — la règle redescend en « parti pris d'identité ».
Le contrôle est mécanique : `tools/extrait-decisions.py` liste les « lois fragiles » à chaque passage.

RÈGLE : quand le secteur fait autrement, le champ `CONTRE` le dit, chiffré. Ce n'est pas une
concession : c'est la seule preuve qu'on a lu avant de choisir, et c'est ce qui distingue une doctrine
d'une compilation. Un lecteur qui voit quatre fois la même source conclut « copie » ; il faut lui
montrer là où nous avons tranché contre elle.

Projection mécanique vers la fiche du site (le markdown ne bouge pas) :
`python3 tools/extrait-decisions.py <slug>` — écrit `decisions[]` dans `apps/site/content/doctrine/<slug>.json`
et rattache à chaque décision les cas d'usage qui la citent (les cartes portaient déjà le texte de la règle).
Le script remonte deux trous : les décisions sans source déclarée, et celles qu'aucun cas d'usage n'éprouve.

