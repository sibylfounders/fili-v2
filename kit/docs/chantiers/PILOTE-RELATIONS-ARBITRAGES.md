---
name: pilote-relations-arbitrages
description: Pilote interne à Fili — relations typées entre règles, tensions et arbitrages, cascade de dépendances et d'impacts. Remplace FILI-PILOTE.md (0.1.0).
version: 0.3.0 # 0.3.0 : audit du 2026-07-28 — protocole corrigé (une seule variable entre C3 et C4 : C4 = bundle routé + T-001, la checklist d'audit sert uniquement à l'évaluation et n'est injectée dans aucune condition ; H2/H3 et grille adaptées) ; T-001 resserrée « Visibilité des actions vs hiérarchie du groupe » (pôle hiérarchie = BUTTON-R18/R19/R23 ; INTERACTION-R10/R15/R17 retirées ; le cas Card attendra un usage réel) ; cascade mécanique précisée (artefact du sujet + index relationnel + artefacts incorporant la donnée) ; validateur renforcé (preuve obligatoire, doublons, cycles cede-a, champs de tension, statut note de méthode des cédantes) ; les cessions BUTTON-R65 et FORM-R06 sont désormais réellement des pointeurs note de méthode dans les fiches (cf. DECISIONS.md 2026-07-28). 0.2.0 : recadrage de marque (Fili ombrelle, Fili DS, Fili Audit — le socle commun n'a pas de nom de produit) ; huit corrections de revue intégrées ; décision d'architecture « gestion des dépendances et des impacts » ; pilote d'implémentation tools/pilote-relations. 0.1.0 : première spécification (arbitrages + test à quatre conditions).
statut: proposition — les fiches de doctrine, le compilateur et le routeur ne sont pas modifiés
date: 2026-07-27
---

# Pilote — relations, arbitrages et cascade d'impact

## 0. Cadre : où ce pilote vit dans Fili

**Fili** est le projet et la marque ombrelle. Il porte deux volets :

- **Fili DS** — la conception et la production d'interfaces : doctrine, sélection contextuelle, mode build, implémentation UI et atelier ;
- **Fili Audit** — l'analyse et l'audit d'interfaces existantes.

Le corpus, le routeur, les liens typés et les arbitrages décrits ici constituent le **socle commun interne** aux deux volets. Ce socle n'est pas un troisième produit et ne reçoit pas de nom : c'est la matière que les deux volets consomment. Ce document spécifie un **pilote interne à Fili** — pas un produit à côté du reste.

### Comment le socle est consommé, sans duplication

La connaissance n'est écrite qu'une fois, dans l'atelier (markdown). Elle est compilée une fois, puis **projetée** deux fois :

```text
Sources éditoriales (atelier, markdown)
→ compilation du socle commun (règles, relations, tokens, routeur)
→ projection Fili DS   : règles de build + implémentation de référence + tokens
→ projection Fili Audit : règles auditables + statut de frontière, sans imposer les tokens de Fili
```

- **Fili DS** consomme le socle pour **sélectionner** (routeur d'intention, bundle minimal), **générer** (règles + tokens + implémentation de référence) et **justifier** (chaîne de citations : chaque décision de hiérarchie cite sa règle, chaque conflit cite sa tension).
- **Fili Audit** consomme le même socle pour **détecter** (les MESURE et les critères des tensions), **qualifier** (le statut de frontière décide du registre : à corriger / suggestion / à trancher) et **expliquer** (le constat cite la règle, la tension explique l'arbitrage attendu). L'implémentation de référence n'est jamais un critère d'audit d'une interface tierce.

Le routeur peut être commun ; ce qui diffère entre les deux volets, ce sont les **contextes chargés** (avec ou sans tokens) et les **droits de conclusion** (générer une solution vs qualifier un écart). Aucune règle, aucune tension n'existe en deux exemplaires.

### Non-objectifs, valables au-delà du pilote

- **Aucune base de graphe, aucune base spécialisée.** Markdown reste la source éditoriale ; tout graphe est un **résultat de compilation**, reproductible et régénérable.
- **Aucune nouvelle catégorie éditoriale.** Foundations, Languages, Principles, Components, Patterns et Flows restent inchangés ; rien n'apparaît dans la navigation. Les relations sont un mécanisme interne, pas un vocabulaire visible.
- **Aucune passe globale.** Ni annotation du corpus entier, ni réécriture, ni renommage de marque dans cette étape (l'inventaire de migration vit dans `MIGRATION-FILI.md`).
- **Aucune modification automatique de règle.** Jamais, sous aucun type de relation.

## 1. Décision d'architecture : une gestion de dépendances et d'impacts

La cartographie des relations est un mécanisme de **gestion des dépendances et des impacts**, comparable aux dépendances entre tokens, mais adapté à la connaissance de design. Le principe directeur :

> Une modification **mécanique** peut se propager automatiquement.
> Une modification **sémantique** ne réécrit jamais automatiquement ses dépendants — elle déclenche une invalidation et une revue.

```text
Tokens                → recalcul automatique
Artefacts générés     → recompilation automatique
Connaissance sémantique → invalidation et revue
```

Concrètement, une modification sémantique déclenche : la recompilation des sorties générées ; l'identification des règles dépendantes ; la liste des composants, patterns et flows concernés ; les audits et tests à rejouer ; une révision humaine partout où un arbitrage est nécessaire.

Est **mécanique** ce qui ne change pas le sens : renvoi repointé, chemin corrigé, faute d'orthographe, montée de version sans changement de règle, valeur de token recalculée. Est **sémantique** ce qui touche `ÉNONCÉ`, `MESURE`, `STATUT`, `SOURCE` ou la portée d'une règle — et toute création ou suppression de règle ou de relation.

## 2. L'unité du graphe : la règle, à ID stable

L'unité éditoriale maintenue à la main est la **règle identifiée par son ID stable** (`SUJET-Rnn`, `SUJET-Unn`) — identifiants jamais réattribués, conformément au format « décisions sourcées » (Méthode 1.13.0). Tout le reste est **projection calculée** :

- le **sujet propriétaire** d'une règle se déduit du fichier qui la contient ;
- l'impact sur un composant, un pattern ou un flow s'**agrège à partir des règles** contenues dans son sujet — on ne maintient pas un second graphe manuel de composants, patterns et flows ;
- les fichiers, sujets et artefacts générés (`RULES-*`, routeur, index) apparaissent dans les rapports comme des projections, jamais comme une seconde source éditoriale.

## 3. Les quatre relations

Une relation n'est acceptée que si son **consommateur** et sa **conséquence** sont identifiés. Le jeu de types est fermé ; en proposer un cinquième exige de nommer les deux.

| Type | Sens | Ce qu'il dit | Consommateur |
|---|---|---|---|
| `derive-de` | règle aval → règle amont | « je suis la traduction locale de ce principe ; si l'amont change de sens, je dois être réexaminée » | justification (Fili DS), cascade d'impact |
| `exception-de` | règle → règle | « je borne le domaine de validité de cette règle » | Fili Audit (éviter le faux positif — ex. `BUTTON-R56` borne `BUTTON-R19` pour les menus à choix parallèles) |
| `cede-a` | règle → règle | « mon autorité appartient désormais à cette règle ; je ne suis plus qu'un pointeur » | routeur et Fili Audit (router vers le propriétaire réel). La règle cédante prend **obligatoirement** le statut `note de méthode` — sans ÉNONCÉ normatif ni MESURE — c'est le cas précis où cette quatrième valeur s'applique (modèle : `BUTTON-R70` → `CARD-R08` ; requalifications du 2026-07-28 : `BUTTON-R65` → `FORM-R28`, `FORM-R06` → `BUTTON-R60`). Le validateur le vérifie (§ 10.4) |
| `tension` | règle ↔ règle, portée par un objet `T-xxx` | « nous entrons en conflit ; l'arbitrage est décrit ailleurs » | Fili DS (raisonner l'arbitrage en génération), Fili Audit (vérifier l'arbitrage rendu) |

Il n'y a pas de type `verifie` : le critère d'audit déterministe vit dans la ligne `MESURE`, co-localisée avec sa règle.

### Syntaxe cible (hors périmètre de ce pilote)

À terme, `derive-de`, `exception-de` et `cede-a` se déclarent dans la grammaire de règle existante, par une ligne optionnelle au même rang que `MESURE` :

```text
RÈGLE [BUTTON-R23] : toujours moins de poids visuel que le primary adjacent…
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : …
MESURE : …
LIENS : derive-de=INTERACTION-R15
```

Deux règles de source unique, sans exception :

1. **La relation ne s'écrit qu'à un seul endroit.** Le compilateur matérialise les arêtes inverses (si A `derive-de` B, alors B *est-déclinée-par* A) ; l'inverse n'est jamais écrit à la main.
2. **La tension possède ses pôles.** Ils sont déclarés dans son fichier `T-xxx`, nulle part ailleurs : on ne répète pas `tension=T-xxx` dans les règles. Le compilateur produit les liens règle → tension à partir des pôles.

Dans ce pilote, les fiches de doctrine ne sont pas modifiées : les relations de la tranche vivent dans une **fixture** (`tools/pilote-relations/relations.fixture.json`) qui représente ce que les lignes `LIENS` et les fichiers `T-xxx` déclareraient. La fixture est un substitut de pilote, clairement marquée comme telle — pas une seconde source éditoriale à conserver.

## 4. La cascade d'impact

Pour chaque type de relation, ce qu'une modification de la règle visée déclenche chez ses dépendants :

| Relation | Modification **mécanique** de l'amont | Modification **sémantique** de l'amont |
|---|---|---|
| `derive-de` | `recompiler` (les artefacts des sujets touchés) — aucune revue | `réexaminer humainement` la règle aval + `recompiler` + `retester` si l'aval porte une MESURE + `re-auditer` les audits qui citaient l'aval |
| `exception-de` | `recompiler` | règle bornée modifiée → `réexaminer humainement` l'exception (tient-elle encore ?) ; exception modifiée → `re-auditer` (le périmètre des faux positifs a bougé) |
| `cede-a` | `recompiler` (routage) | propriétaire modifié → `recompiler` + `re-auditer` sa portée ; la règle cédante elle-même → `aucune propagation` (c'est un pointeur) ; propriétaire supprimé → **erreur de validation**, jamais une propagation silencieuse |
| `tension` | `recompiler` | un pôle modifié → `réexaminer humainement` la tension (l'arbitrage peut basculer) + `re-auditer` les contextes de sa portée |
| règle sans relation sortante ni entrante | `recompiler` | `recompiler` + `retester` si MESURE ; `aucune propagation` au-delà de son sujet |

Portée exacte de `recompiler` sur une modification **mécanique** : l'artefact généré du **sujet propriétaire**, l'**index relationnel**, et **tout artefact généré qui incorpore directement la donnée modifiée** — rien d'autre. Une modification mécanique ne déclenche jamais de réécriture ni de revue sémantique des règles dépendantes.

Trois invariants :

- une relation de dépendance **ne modifie jamais automatiquement la source d'une règle aval** — le maximum qu'elle produit est une entrée « à réexaminer » dans un rapport ;
- `recompiler` et `retester` sont automatisables ; `réexaminer humainement` ne l'est pas et ne le devient jamais ;
- toute cascade aboutit à l'étape 8 de la Méthode : la décision prise (modifier l'aval, la confirmer, requalifier la relation) se journalise.

## 5. L'objet tension — schéma unique

Une tension est une **arête entre deux ensembles de règles** dont les recommandations entrent en conflit quand elles s'appliquent au même endroit. Un seul schéma couvre les arbitrages déjà résolus, les arbitrages contextuels à rendre pendant la génération, et les candidats en attente : c'est le champ `statut` qui les distingue.

Un fichier par tension — emplacement cible `content/md/tensions/T-xxx.md`, à créer seulement à l'implémentation réelle :

```yaml
---
id: T-001
titre: court, nommant les deux pôles
statut: resolue | contextuelle | candidate
portee: globale | liste de contextes nommés (toolbar, formulaire, card…)
poles:
  a: [IDs de règles]   # seule déclaration des pôles — jamais répétée côté règles
  b: [IDs de règles]
provenance: decision (date DECISIONS.md) | audit | benchmark | redaction-deliberee
confiance: etabli | convergence | cas-isole | non-formalise   # échelle de l'étape 4
---
```

Corps, sections dans cet ordre : **NATURE DU CONFLIT** (pourquoi les deux pôles ne peuvent pas être maximisés ensemble) ; **PLANCHER / PLAFOND** (les bornes non négociables de chaque côté, citant les règles et leurs MESURE) ; **RÉSOLUTIONS ACQUISES** (sous-cas tranchés : condition → règle qui prime → référence) ; **ARBITRAGE CONTEXTUEL** (pour une `contextuelle` : les facteurs qui font pencher, ordonnés, formulés en questions — jamais en formule de score) ; **CONSÉQUENCE OBSERVABLE** (*obligatoire quel que soit le statut* : ce qu'un audit constate si l'arbitrage est mal rendu, en distinguant déterministe / semi-déterministe / assisté, cf. § 8) ; **EXEMPLES** (au moins un cas réel).

Champs obligatoires, vérifiés par le validateur (§ 10.4) : `statut`, `portee`, `poles` (deux côtés non vides), `provenance`, `confiance`, et la conséquence observable. Une tension à qui il en manque un est rejetée — pas rétrogradée silencieusement.

Cycle de vie : `candidate` (repérée — typiquement dans `DECISIONS.md` — mais non qualifiée : il peut manquer les pôles par ID, la portée ou la conséquence observable ; **aucun consommateur ne la lit**) → `contextuelle` (une partie de l'arbitrage se rend en génération) → `resolue` (entièrement tranchée par conditions), chaque passage journalisé. `DECISIONS.md` est une source de candidats **à qualifier un par un**, jamais une collection à convertir automatiquement. Premiers candidats naturels : les quatre cessions d'autorité journalisées, le retrait de « le primary mène la lecture », « le bouton désactivé n'est plus un mécanisme de validation » (prévention d'erreur vs perceptibilité du feedback), la symétrie du bandeau de consentement (hiérarchie des actions vs équité du choix).

Une tension relie naturellement deux pôles : ce va-et-vient n'est **pas** un cycle interdit. Les cycles interdits concernent la seule dépendance normative `derive-de` (§ 10).

## 6. T-001 — Visibilité des actions vs hiérarchie du groupe

Seule tension rédigée délibérément (graine du pilote) ; toutes les suivantes naissent tirées par l'usage. Le cas de la Card (surface calme vs actions internes) n'est **pas** une tension de plus tant qu'un usage réel ne la réclame pas.

```yaml
---
id: T-001
titre: Visibilité des actions vs hiérarchie du groupe
statut: contextuelle
portee: [toolbar, groupe-d-actions, formulaire]
poles:
  a: [INTERACTION-R06, INTERACTION-R07, BUTTON-R04]   # chaque action veut rester reconnaissable
  b: [BUTTON-R18, BUTTON-R19, BUTTON-R23]             # le groupe n'a qu'une hiérarchie
provenance: redaction-deliberee
confiance: convergence
---
```

**NATURE DU CONFLIT.** Chaque action d'un groupe doit rester reconnaissable comme contrôle (`INTERACTION-R06`) sans jamais se déguiser en lien (`INTERACTION-R07`) — mais le groupe ne peut pas satisfaire toutes les demandes de visibilité : un seul rang dominant (`BUTTON-R19`), réservé à l'action que le parcours est conçu pour provoquer (`BUTTON-R18`), les autres cédant en poids (`BUTTON-R23`). Chaque action doit rester reconnaissable, sans que toutes réclament le rang dominant.

**PLANCHER / PLAFOND.** Plancher de visibilité : une action discrète ne devient jamais un faux lien (`INTERACTION-R07`, MESURE) ni un fantôme sans limite ni états (`INTERACTION-R06`, MESURE contraste 3:1). Plafond de visibilité : au plus un rang dominant par vue (`BUTTON-R19`, MESURE).

**RÉSOLUTIONS ACQUISES.** Paire dominante/alternative → l'alternative cède toujours en poids, même à taille identique (`BUTTON-R23`). Menu à choix parallèles (≥3 options de même nature) → l'égalité de poids est l'intention correcte, la cardinalité ne s'applique pas (`BUTTON-R56`, `exception-de=BUTTON-R19`). Header persistant vs contenu → deux zones distinctes (`BUTTON-R20`), jamais à poids exactement égal (`BUTTON-R21`).

**ARBITRAGE CONTEXTUEL** — pour la zone restante (un groupe de 3 à 7 actions de poids intermédiaires) :

1. Quelle action ce parcours est-il **conçu pour provoquer** (`BUTTON-R18`) ? Elle seule peut prétendre au rang dominant — et si aucune ne l'est, personne ne le prend : `BUTTON-R19` borne à un, il n'en impose aucun.
2. Pour chaque autre action : quel est le **coût de ne pas la voir** (fréquence × coût de la rater) ? Élevé → présence pleine au rang alternatif ; faible → rang mineur ou repli en overflow — sans jamais passer sous le plancher (`INTERACTION-R07`).
3. Une action **destructive** distingue trois axes indépendants : son `tone` (destructif), son **rang visuel** et sa **friction** (confirmation, annulation). Dans un contexte ordinaire, elle ne gagne pas en visibilité ce qu'elle porte en danger — rang alternatif ou mineur. Mais quand la séquence est **précisément conçue pour confirmer la destruction** (modale « Confirmer la suppression »), le rang dominant lui revient : c'est l'action que ce parcours provoque (`BUTTON-R18`). `BUTTON-R43` impose une annulation visible au même niveau de la séquence ; il n'interdit pas le rang dominant.

**CONSÉQUENCE OBSERVABLE.** Semi-déterministe : au plus un bouton au rang dominant par vue (MESURE `BUTTON-R19` — cf. § 8 pour la raison du classement). Déterministe : aucune action présentée comme un lien (MESURE `INTERACTION-R07`) ; contraste 3:1 des limites de contrôle (MESURE `INTERACTION-R06`). Assisté : « l'action attendue du parcours est-elle identifiable en moins de deux secondes, sans lire les libellés ? » ; « chaque action du groupe reste-t-elle identifiable comme un contrôle ? » (échelles ancrées).

**EXEMPLES.** Les tâches A et C du protocole (§ 7). Historique : le retrait de « le primary mène la lecture » (DECISIONS, début 2026-07) est un arbitrage passé de cette tension.

## 7. Protocole du test à quatre conditions

Ce test mesure la valeur de la connaissance injectée pour la **génération** ; le pilote d'impact (§ 10) mesure la valeur des relations pour la **maintenance**. Les deux partagent les schémas ci-dessus.

### 7.1 Ce qui est identique dans les quatre conditions

- **Le contexte technique minimal** : la liste des composants du package React et les tokens nécessaires pour produire une sortie compilable. Identique partout — la capacité technique de produire du code n'est pas la variable mesurée.
- **La consigne de sortie et de justification**, mot pour mot : un unique fichier contenant le composant React de l'écran, suivi d'un bloc de commentaire `JUSTIFICATION` listant chaque décision de hiérarchie sous la forme `décision → fondement cité ; si deux règles entrent en conflit, nomme le conflit et justifie l'arbitrage`. C1 cite ce qu'il peut.
- Le modèle, le prompt de tâche, le nombre de tirages.

**Seule la connaissance de design injectée varie — et une seule variable sépare deux conditions adjacentes :**

| | Connaissance injectée |
|---|---|
| **C1** | Aucune. |
| **C2** | Le corpus compilé entier (`RULES-*`, tous sujets), sans routage. |
| **C3** | Le bundle routé (fermeture exacte du routeur + socle universel). |
| **C4** | Exactement le même bundle que C3, **+ T-001** — rien d'autre. |

C1→C2 mesure le **contenu brut** ; C2→C3 la **sélection** ; C3→C4 la **valeur de l'arbitrage explicite**, seule variable entre les deux.

**La checklist d'audit n'est injectée dans aucune condition.** Elle sert uniquement à évaluer les sorties après génération (§ 7.3 et § 7.4) — l'injecter dans une condition mélangerait deux variables et rendrait l'écart C3→C4 ininterprétable.

### 7.2 Tâches (trois, chacune contenant T-001)

- **A — toolbar de collection** : liste de factures, cinq actions de poids inégaux (créer, exporter, filtrer, supprimer la sélection, paramètres). Piège : cinq actions « importantes », un seul rang dominant disponible.
- **B — groupe d'actions par élément de collection** : liste « Membres de l'équipe » avec une action globale (inviter) et, par ligne, quatre actions de fréquences inégales (voir le profil, modifier le rôle, réinitialiser le mot de passe, désactiver le compte — destructive). Piège : plusieurs actions qui doivent toutes rester reconnaissables, un seul rang dominant disponible pour toute la vue, et un arbitrage explicite visible/réduit/replié par ligne. (La tâche a été reformulée le 2026-07-28 : l'ancienne « card de collection » testait la tension Card, volontairement hors de T-001 resserrée.)
- **C — fin de formulaire** : enregistrer, annuler, supprimer le compte. Piège : la destructive qui réclame de la visibilité — et le parcours (des réglages) n'est **pas** conçu pour la provoquer, contrairement à une modale de confirmation.

### 7.3 Volume, aveugle, jugement

3 tâches × 4 conditions × 2 tirages = 24 sorties. Jugement en aveugle : sorties anonymisées, bloc JUSTIFICATION séparé du rendu avant jugement, ordre aléatoire, condition masquée ; le juge de l'interface ne voit pas la justification, et réciproquement. Juges : Aurélien + au moins un juge indépendant (designer extérieur, sinon LLM-juge d'une autre famille, notes marquées comme telles et validées par échantillonnage humain). Métriques **figées avant le test**, deux familles notées séparément :

**Qualité de l'interface** — (a) checklist exécutée par `verifie-sortie.js`, au périmètre exact de `checklist-evaluation.md` (trois documents, un seul périmètre) : action présentée comme un lien **uniquement** sur destination factice ou navigation annulée (déterministe) ; surface statique cliquable (déterministe) ; au plus un rang dominant par vue (semi-déterministe, convention de harnais, § 8) ; un lien à destination réelle **ou dynamique** (`href={expr}`) portant un `onClick` est un **signal assisté**, jamais une violation ; (b) échelle assistée (1–5, ancres rédigées avant le test) : hiérarchie perçue, reconnaissance de chaque action comme contrôle, conformité au langage d'interaction, navigation portée par un Button (non vérifiable statiquement). Contraste, focus et cible tactile sont portés par les composants du package et jugés au rendu — le harnais ne prétend pas les vérifier.

**Qualité de la justification** — (a) traçabilité (mécanique) : proportion des décisions citant un ID de règle ou de tension existant ; (b) justesse (jugement, 0–2) : la règle citée soutient-elle la décision ; (c) reconnaissance de la tension (jugement, 0–2) : le conflit est-il identifié et arbitré.

**Prédictions enregistrées avant le test** : C2 ≤ C3 sur l'interface (dilution — contre-intuitif mais attendu, et utile) ; C4 ≥ C3 nettement sur la justification ; l'écart C4−C3 sur l'interface est la vraie inconnue.

### 7.4 Contrôle de la boucle d'audit

Avant le test principal : injecter trois violations connues (deux dominants, action stylée en lien, surface statique cliquable) dans une sortie témoin et vérifier que la checklist les détecte toutes (3/3). Sinon, corriger les critères avant de juger quoi que ce soit.

Note d'outillage : aucun contrôle porté ne vérifie aujourd'hui les MESURE de la tranche — `valide-dossier.js` et `test-rendu.js` de l'ancien dépôt **n'ont pas été portés** (trou ouvert documenté, PROCESS.md étape 7). Le harnais du pilote implémente ces vérifications pour le test uniquement ; il ne prétend pas les porter.

## 8. Critères d'audit : déterministe, semi-déterministe, assisté

- **Déterministe** : exécutable sur le DOM, le CSS ou les tokens sans jugement ni convention — l'assertion de la MESURE suffit (« aucune surface statique ne porte de gestionnaire de clic »).
- **Semi-déterministe** : exécutable seulement à travers une convention déclarée. Le cas type est le **rang dominant** : le rang n'est pas une prop du composant — il naît d'une combinaison (style × tone) et du contexte. Dans le harnais expérimental, une **annotation de harnais** (la convention documentée : la combinaison canonique de la dominante vaut « rang dominant ») rend le comptage exécutable ; sur une interface tierce, le même critère redevient assisté. Un critère semi-déterministe déclare toujours sa convention.
- **Assisté** : exige un jugement humain, ou LLM validé par échantillonnage humain. Toujours une **question fermée avec ancres**, jamais une consigne ouverte. Un critère assisté qui s'avère formalisable migre (journalisé en étape 8).

Le **statut de frontière** s'applique aux trois, avec le vocabulaire exact de la Méthode (étape 4) — trois statuts opérationnels : une **propriété universelle** fonde seule une non-conformité sur une interface tierce ; un **parti pris d'identité** se lit comme divergence de registre ; une **implémentation de référence** n'est jamais un critère d'audit d'hôte. La quatrième valeur de la grammaire, `note de méthode`, est hors audit ; dans ce pilote elle n'apparaît que comme statut d'une règle cédante (`cede-a`, § 3). Une tension hérite du statut le plus faible des règles qu'elle relie.

## 9. Règles anti-inflation

1. **Consommateur et conséquence obligatoires.** Aucun lien et aucune tension sans consommateur identifié et sans conséquence observable (ou cas d'usage réel documenté). Une tension qui n'en a pas reste `candidate` — et une `candidate` n'est lue par personne.
2. **Tiré par l'usage, jamais par passe globale.** Une relation naît d'une collision ou d'une dépendance constatée : un audit qui bute, une génération qui hésite, une décision journalisée. T-001 est la seule graine délibérée.
3. **Jeu de types fermé** (§ 3).
4. **`DECISIONS.md` = candidats**, qualification manuelle, une entrée à la fois. Le journal reste non normatif sur les règles ; la tension pointe la fiche.
5. **Caducité.** Une tension jamais sollicitée après un cycle d'usage défini (proposition : 10 audits ou générations traversant sa portée) est marquée *dormante* et réexaminée — fusion, rétrogradation, ou suppression journalisée.
6. **Le pilote n'annote que la tranche** (§ 10.1), quelle que soit la tentation.

## 10. Pilote d'implémentation — la cascade démontrée

### 10.1 Tranche

Sujets : **interaction, button, link, card, form, creation-compte** (sources UX). Rien d'autre n'est extrait ni annoté. (La tranche du test de génération, § 7, y ajoute la lecture de color et touch ; le pilote d'impact n'en a pas besoin.)

### 10.2 Livrables (`tools/pilote-relations/`, Node sans dépendance)

- `relations.fixture.json` — la fixture éditoriale de la tranche : relations `derive-de` / `exception-de` / `cede-a` déclarées par règle, tensions avec leurs pôles. Chaque relation cite des IDs réels des fiches. Substitut de pilote (§ 3), pas une source à faire vivre.
- `genere-index.js` — extrait les règles des six fiches (ID, sujet propriétaire, STATUT, présence de MESURE), charge la fixture, calcule les **relations inverses** et les **impacts directs et transitifs**, exécute les validations (§ 10.4), écrit `index-relations.json`. **Artefact généré, jamais édité à la main, reproductible.**
- `simule-impact.js` — prend un ID et une nature de modification (`mecanique` | `semantique`), lit l'index, produit un rapport répondant aux sept questions du § 10.5. Mode simulation : la fiche n'est jamais modifiée.

### 10.3 Scénario de validation principal

> Une modification **simulée** (sémantique) de `INTERACTION-R07` produit un rapport expliquant quels éléments sont directement et indirectement touchés, pourquoi, et quelle action est requise pour chacun — sans changer réellement le sens de `INTERACTION-R07`.

Sortie attendue : `RAPPORT-IMPACT-INTERACTION-R07.md` (généré).

### 10.4 Validations minimales

Le contrat **fermé** des types (§ 3) définit une fois pour toutes leurs consommateurs et leurs conséquences — ces métadonnées ne se répètent pas sur chaque arête. Chaque relation porte en revanche sa **preuve propre** (la trace dans la fiche qui la justifie), obligatoire et non vide.

Le générateur détecte et rapporte : une référence vers un ID inexistant (y compris une règle supprimée encore référencée) ; une relation dupliquée ; un identifiant de règle dupliqué à l'extraction ; un identifiant de tension dupliqué ; une dépendance normative (`derive-de`) cyclique ; un cycle de `cede-a` ; une cession dont la cible n'existe pas ; une source de `cede-a` dont le statut n'est pas `note de méthode` ; une relation de type inconnu ou sans consommateur au contrat ; le type `tension` déclaré dans `relations` (les tensions n'existent que dans `tensions`) ; une relation sans preuve ; une tension à qui manque un champ obligatoire (`statut`, `portee`, `poles` des deux côtés, `provenance`, `confiance`, conséquence observable). Les tensions relient deux pôles par nature — ce n'est pas un cycle interdit ; l'interdiction de cycle porte sur `derive-de` et `cede-a`. Un auto-test (fixtures volontairement fautives) prouve que **chacune** de ces validations détecte réellement son cas.

Le rapport de sortie n'affiche jamais « 0 erreur » comme un blanc-seing : il énonce le périmètre exactement garanti — références, doublons, cycles, statuts de cession, champs de tension, preuves — et rappelle qu'**aucune validation sémantique du contenu des règles** n'est faite.

### 10.5 Critère de succès

Le pilote est concluant seulement si, à partir d'un ID modifié, le socle peut répondre de façon **vérifiable** : 1. qu'est-ce qui dépend directement de cette règle ; 2. qu'est-ce qui en dépend indirectement ; 3. quels sujets et composants sont concernés ; 4. qu'est-ce qui peut être recompilé automatiquement ; 5. qu'est-ce qui doit être revu humainement ; 6. quels tests ou audits doivent être rejoués ; 7. pourquoi chaque élément apparaît dans le rapport.

## 11. Hypothèses du test de génération et critères de décision

Les hypothèses sont strictement séparées : H2 ne parle que d'interface, H3 que de justification — la branche « H2 échoue mais H3 réussit » est réellement atteignable.

- **H1 — Sélection** : un contexte routé bat un corpus déversé. *Confirmée si* C3 > C2 sur la qualité d'**interface** (médianes des deux familles de critères).
- **H2 — Arbitrage → interface** : injecter la tension (seule variable C3→C4) améliore les **décisions et l'interface produite**. *Confirmée si* C4 > C3 sur la qualité d'interface uniquement : +1 point de médiane sur les échelles assistées, ou +2 violations évitées en moyenne sur la checklist d'évaluation. La justification n'entre pas dans H2.
- **H3 — Arbitrage → justification** : injecter la tension rend la justification vérifiable et l'arbitrage explicite. *Confirmée si* en C4, ≥ 80 % des décisions citent un ID existant avec justesse ≥ 1, et si la reconnaissance de la tension gagne ≥ 1 point de médiane vs C3. L'interface n'entre pas dans H3. (C3 peut citer des IDs — le corpus injecté est adressable — mais ne connaît pas T-001 : l'écart mesure l'apport de l'objet tension, pas l'accès aux IDs.)
- **H4 — Boucle d'audit** : le contrôle § 7.4 détecte 3 violations sur 3.

Grille de décision :

- **H2 confirmée** → l'arbitrage explicite sert la génération : qualifier les candidates de `DECISIONS.md`, étendre la grammaire `LIENS` à la tranche suivante, toujours tiré par l'usage.
- **H2 échoue, H3 confirmée** → l'objet tension ne rend pas les interfaces meilleures mais rend les arbitrages **vérifiables et explicites** : réorienter l'investissement vers Fili Audit et la justification. C'est un pivot documenté, pas un échec.
- **H1 échoue** (C2 ≥ C3) → le problème est en amont : la sélection du routeur n'apporte pas ce qu'elle promet. Suspendre, corriger le routeur, rejouer.
- **H2 et H3 échouent** → l'hypothèse centrale est invalidée dans l'état de l'art des modèles : la grammaire reste en dormance éditoriale, aucun investissement d'outillage au-delà du pilote d'impact (§ 10), dont la valeur de maintenance se juge séparément sur son propre critère (§ 10.5). Rejouer coûtera une journée ; l'infrastructure construite à tort aurait coûté des mois.

Dans tous les cas : résultats, prédictions tenues ou démenties, décision — journalisés dans `DECISIONS.md` (étape 8).
