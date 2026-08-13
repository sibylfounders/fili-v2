---
name: cadrage-arbitrage-consommateur
description: Cadrage (étape 1 de la Méthode) du circuit d'arbitrage côté consommateur — constat formaté, arbitre désigné, journal de décisions locales. Complète la boucle Arbitrage (étape 9 → l'humain), qui ne décrit aujourd'hui que l'aller.
version: 0.4.1 # 0.4.1 : retrait de la distribution (audit 2026-07-28) — la tranche pilote du § 7 est débranchée du paquet tant que le cycle de vie (§ 8) n'est pas mécaniquement garanti : plus de copie du gabarit par build-plugin.js, plus de chargement, d'instructions d'écriture ni de § « Décisions locales » dans le routeur généré, test d'installation n°3 retiré, poids et empreinte du paquet recalculés sans le journal, version du paquet ramenée à 1.7.0 (le 1.8.0 n'a jamais été diffusé : aucune archive publiée sur le site, aucun paquet ni artefact d'installation distribué). Le gabarit devient un artefact de pilote : tools/pilote-arbitrage/DECISIONS-locales.gabarit.md. Le cadrage, les statuts et le cycle de vie du § 8 restent inchangés. 0.4.0 : cycle de vie des décisions locales (audit du 2026-07-28, § 8) — statuts en-attente/active/a-revoir/remplacee, clé de question stable, règles citées + version du paquet, arbitre en rôle, condition de réexamen, chaîne de remplacement ; « ne se repose plus jamais » devient « pas tant que la décision reste active et compatible avec la version courante » ; une évolution d'une règle citée met la décision en a-revoir ; l'agent ne réactive jamais seul ; écriture uniquement avec autorisation explicite du consommateur ; chargement ciblé par portée (révision de l'arbitrage n°3). Gabarit aligné ; rien de nouveau n'est branché dans la chaîne. 0.3.1 : premier déroulé du test d'installation n°3 (2026-07-28, agent isolé sans contexte, paquet 1.8.0 extrait tel que construit, faux projet client) — 5/5 : journal relu (absence d'arbitre signalée au client), formulaire intact (aucun datepicker improvisé), constat DL-001 conforme au format (contexte, question, 3 options avec conséquences, CONFIANCE « non formalisé » justifiée, attendu), appendé `en attente`, rien tranché ; le constat cite le point 5 du routeur et l'axe field_type de RULES-input. Reste la validation en installation Cowork réelle (glisser le .plugin dans une session propre). 0.3.0 : tranche pilote du § 7 implémentée (lot validé par Aurélien, 2026-07-28) — gabarit `tools/plugin/DECISIONS-locales.gabarit.md` copié dans le paquet par build-plugin.js, § « Décisions locales » et point 8 réécrits dans le routeur généré (genere-routeur.js), troisième test d'installation dans le SKILL, README-paquet à deux surfaces consommateur, paquet 1.8.0 reconstruit (56 fichiers, socle +~0,6 k). 0.2.0 : les six arbitrages du § 6 sont rendus (Aurélien, 2026-07-28) — socle universel, strict non couvert en v1, constats « en attente » appendés au journal, remontée manuelle en mission, nommage et emplacement confirmés. La tranche pilote (§ 7) est débloquée ; rien n'est encore implémenté. 0.1.0 : premier cadrage (2026-07-28) — nature, test de transposition, mécanisme en trois pièces, frontières en négatif, boucle de retour, arbitrages ouverts. Origine : manque identifié le 2026-07-28 (module organisationnel du cours NN/g « AI for Design Workflows » confronté au périmètre de Fili). Aucune modification du paquet, du routeur ni des fiches.
statut: tranche pilote DÉBRANCHÉE de la distribution (2026-07-28) — cadrage et cycle de vie (§ 8) valides ; re-branchement conditionné à la garantie mécanique du cycle de vie
date: 2026-07-28
---

# Cadrage — le circuit d'arbitrage côté consommateur

## 0. La demande

La Méthode connaît déjà la boucle **Arbitrage** : *« Étape 9 → l'humain — l'IA consommatrice rencontre une décision non tranchée → elle s'arrête et expose les options. »* Cette boucle ne décrit que **l'aller**. Trois questions restent sans réponse dès que le consommateur du paquet n'est plus Aurélien :

- **à qui** l'agent expose-t-il les options (qui est l'arbitre, sous quel délai répond-il) ;
- **où** la décision rendue s'écrit-elle (aujourd'hui : nulle part — la même question se repose à chaque session, ou se tranche silencieusement et différemment selon les jours) ;
- **comment** les décisions rendues sur le terrain remontent-elles vers la Méthode (quels arbitrages récurrents sont des candidats règles).

Le présent cadrage spécifie le **retour** de la boucle : décision rendue → journalisée chez le consommateur → relue par l'agent → remontée vers la Méthode quand elle se répète.

## 1. Nature de l'objet

Ce n'est **pas un sujet de design** : pas de fiche `ARBITRAGE-UX/UI`, pas de `RULES-arbitrage`, rien dans les six catégories éditoriales. C'est un **mécanisme de la distribution** (étape 9), au même titre que le routeur — et il crée la **deuxième surface possédée par le consommateur**.

La première surface est connue : les **valeurs** de `tokens.yaml` (jamais ses noms). La deuxième suit la même logique de propriété : le consommateur possède **ses décisions** (jamais les règles). L'autorité se répartit ainsi :

- la **Méthode** fait autorité sur le protocole du circuit (format du constat, format du journal, règles de préséance) ;
- les **fiches** restent propriétaires de leurs règles — aucune décision locale ne les modifie ;
- le **consommateur** fait autorité sur ses décisions locales, à l'intérieur de l'espace que les règles laissent ouvert.

## 2. Test de transposition

Le modèle d'axes (style / tone / size) ne s'applique pas — ce n'est pas un composant. Ce qui se transpose réellement vient de deux formats existants, à vérifier champ par champ plutôt qu'à copier :

- le format **« décisions sourcées »** (Méthode 1.13.0) se transpose à la décision locale : identifiant stable jamais réattribué, date, décision en une phrase, portée — mais `SOURCE` devient *l'arbitre qui a tranché*, et `STATUT` n'a pas de sens local (voir préséance, § 3c) ;
- les **trois registres de la sortie d'audit** (`à corriger` / `suggestion` / `à trancher`) se transposent au déclenchement : le constat d'arbitrage est la forme runtime du registre **`à trancher`** — le référentiel ne couvre pas, on pose la question, on ne propose rien en douce.

Ce qui ne se transpose **pas** : le champ `MESURE` (une décision locale n'est pas un critère d'audit), la bibliographie `S1…Sn` (la source d'une décision locale est une personne, pas une référence).

## 3. Le mécanisme en trois pièces

### a. Le constat d'arbitrage — le format d'émission

Quand l'agent stoppe (protocole du routeur, point 8 ; sujets non couverts, point 5), il n'émet plus une question libre mais un **constat formaté**, même discipline que les constats d'audit :

```text
ARBITRAGE [en attente]
Contexte   : <la demande en cours, en une phrase>
Sujet      : <le sujet ou la règle la plus proche — ou « non couvert »>
Question   : <la décision à rendre, en une phrase>
Options    : <2 à 4 options, chacune avec sa conséquence>
CONFIANCE  : <ce que les règles voisines disent — établi / convergence / cas isolé / non formalisé>
Attendu    : <qui tranche, et ce qui se passe une fois tranché>
```

Le constat est émis dans les deux modes : en **build** (décision non tranchée) comme en **audit** (registre `à trancher`).

### b. L'arbitre — un rôle déclaré, pas une personne implicite

Le paquet déclare un champ **arbitre** que le consommateur renseigne à l'installation (nom, rôle, canal). Même contrat que `tokens.yaml` : le consommateur remplit les valeurs, ne change pas la structure. Sans arbitre déclaré, le circuit fonctionne quand même — les constats s'accumulent « en attente » — mais le paquet dit explicitement que la boucle est ouverte.

### c. Le journal — `DECISIONS-locales.md`, possédé par le consommateur

Le miroir consommateur de `DECISIONS.md` : chaque décision rendue s'y écrit (identifiant `DL-nnn`, date, contexte, décision, arbitre, portée — schéma complet au § 8). L'agent le **relit** comme couche de décisions locales — la question tranchée ne se repose pas **tant que la décision reste `active` et compatible avec la version courante du paquet** (cycle de vie, § 8). Trois règles de préséance, non négociables :

- une décision locale ne modifie **jamais** une règle, un token-nom, ni le routeur — elle vit à côté ;
- une décision locale ne peut **jamais** contredire une `propriété universelle` — l'agent refuse de la relire comme valide et la remonte ;
- face à un `parti pris d'identité`, la décision locale peut diverger **en le disant** — c'est une *divergence de registre* assumée côté consommateur, jamais un silence.

## 4. Frontières — ce que le circuit n'est pas

- **Pas un mécanisme de fork.** Le journal ne contient que des décisions dans l'espace non couvert ou laissé ouvert ; une réécriture locale de règle n'a pas de forme légale dans ce format.
- **Pas les tensions du pilote.** Une `tension` (`T-xxx`, cf. `PILOTE-RELATIONS-ARBITRAGES.md`) est un conflit **interne au corpus**, arbitré par la Méthode et versionné avec elle. Une décision locale est **externe au corpus** : elle tranche là où le corpus se tait. Les deux objets ne se mélangent pas et ne se référencent pas dans le même sens (une DL peut citer une règle ; une règle ne cite jamais une DL).
- **Pas une source normative de substitution** — même garde-fou que l'inventaire transversal : si les journaux locaux se mettent à faire loi, c'est que des règles manquent, et c'est la boucle de retour (§ 5) qui doit travailler, pas le journal grossir.
- **Rien d'automatique.** Aucune décision n'entre au journal sans avoir été rendue par l'arbitre humain. L'agent écrit le constat « en attente », jamais la décision.

## 5. La boucle de retour vers la Méthode

Les décisions locales récurrentes sont le **signal terrain** de la boucle de dédoublonnage (étape 10), étendue hors du corpus : la même `DL` rendue chez plusieurs consommateurs — ou trois fois chez le même — est un **candidat règle** qui entre en étape 1 chez Fili. Le canal de collecte reste à trancher (§ 6) ; le principe, lui, est déjà dans la Méthode : *« les résultats d'usage, les audits et les arbitrages retournent dans la Méthode — c'est elle qui les qualifie et les republie. »*

C'est aussi la ligne de l'offre : l'outillage fait la porte d'entrée, mais c'est ce circuit — qui tranche, où ça s'écrit, ce qui remonte — qui est le cœur de valeur. L'outil sans l'organisation ne fait que déplacer le chaos plus vite.

## 6. Arbitrages — rendus (Aurélien, 2026-07-28)

1. **Nommage** : `DECISIONS-locales.md`, préfixe `DL-nnn` — **confirmé** (miroir explicite de DECISIONS.md).
2. **Emplacement** : racine du paquet, à côté de `tokens.yaml` — **confirmé** (la co-localisation des deux surfaces consommateur rend la règle de propriété évidente).
3. **Chargement** : **au socle universel**, toujours relu — une décision locale ignorée parce que son sujet n'était pas chargé, c'est le mécanisme qui ment. Coût tenu par le format d'entrée compact (~3 lignes) et un seuil au-delà duquel le paquet recommande la remontée plutôt que l'accumulation.
4. **Périmètre de l'arbitre en v1** : **strict non couvert**. La divergence assumée face à un `parti pris d'identité` (§ 3c, troisième règle) est reportée en v2 — un pilote qui ne fork jamais est plus simple à tenir et à défendre. La règle du § 3c reste écrite comme cible ; elle n'est pas active en v1.
5. **Canal de remontée** : **manuel en mission** — relecture des journaux locaux aux points client, les DL récurrentes entrent en étape 1. Rien d'outillé tant qu'aucun journal réel n'existe.
6. **Écriture du constat « en attente »** : **appendé au journal**, statut `en attente`, converti en décision par l'arbitre. Seule écriture autorisée à l'agent : le constat, jamais la décision.

## 7. Tranche pilote — implémentée (lot validé, 2026-07-28)

Portée dans la distribution, paquet **1.8.0** : gabarit `tools/plugin/DECISIONS-locales.gabarit.md` (arbitre en tête, règles du journal, format `DL-nnn` compact 3 lignes) copié en `DECISIONS-locales.md` dans le paquet par `build-plugin.js` (étape 2bis, bloquant si absent) ; routeur généré porteur d'un § « Décisions locales » (relecture avant remontée, constat `en attente` = seule écriture permise à l'agent, seuil de remontée ~30 DL) et d'un point 8 réécrit ; **troisième test d'installation** dans le SKILL : *« Ajoute un datepicker au formulaire »* — le circuit est branché si l'agent relit le journal, émet le constat formaté, l'écrit `en attente`, et ne tranche rien ; README-paquet à deux surfaces consommateur. La doctrine, le compilateur de règles et les fiches restent intouchés.

**Premier déroulé (2026-07-28, agent isolé, faux projet client « Atelier Lunaire ») : 5/5.** L'agent a relu le journal, signalé l'absence d'arbitre déclaré, laissé le formulaire intact, appendé un constat `DL-001 [en attente]` conforme au format (3 options avec conséquences, CONFIANCE « non formalisé », attendu), et n'a rien tranché — sa réponse client renvoie la décision à l'arbitre. Reste pilote tant qu'aucun journal réel n'existe chez un consommateur ; validation restante : le même test après installation réelle du `.plugin` dans une session Cowork propre.

**Retrait (2026-07-28, audit).** La tranche ci-dessus est **débranchée de la distribution** : le cycle de vie du § 8 (statuts, clé de question, `a-revoir` sur évolution d'une règle citée) n'est pas mécaniquement garanti, et un journal distribué sans cette garantie laisserait d'anciennes décisions survivre silencieusement aux évolutions de Fili. Le paquet revient à 1.7.0 (1.8.0 jamais diffusé — vérifié sur les seuls faits de distribution : aucune archive publiée sur le site, aucun paquet ni artefact d'installation distribué) ; le gabarit vit désormais en `tools/pilote-arbitrage/DECISIONS-locales.gabarit.md`, artefact de pilote hors distribution. Le déroulé 5/5 du test n°3 reste un résultat acquis du pilote. Condition de re-branchement : l'outillage qui détecte mécaniquement `a-revoir` (règles citées × version du paquet) et le chargement ciblé par portée.

## 8. Cycle de vie d'une décision locale — pour qu'aucune décision ne survive silencieusement à Fili

Cadrage du 2026-07-28 (audit). Rien de nouveau n'est branché dans la chaîne : ce paragraphe fixe le format que le gabarit porte et que le futur outillage vérifiera.

### Champs minimaux d'une décision

- **id** : `DL-nnn`, stable, jamais réattribué ;
- **statut** : `en-attente` | `active` | `a-revoir` | `remplacee` (l'ancien `rendue` se lit `active`) ;
- **portee** : explicite (intention, sujet, écran, produit) — c'est la clé de chargement ;
- **cle-question** : formulation stable et normalisée de la question tranchée — c'est elle qui identifie « la même question », jamais un rapprochement sémantique approximatif ;
- **regles-citees** : les IDs Fili que la décision cite (règles, tensions) ;
- **version-paquet** : la version du paquet Fili utilisée lors de l'arbitrage ;
- **arbitre** : le **rôle** obligatoire (le nom personnel reste facultatif) ;
- **decision**, **justification**, **date** ;
- **reexamen** : condition de réexamen explicite (échéance, événement, ou montée de version des sujets cités) ;
- **remplace** : `DL-nnn` de la décision remplacée (facultatif — la chaîne garde l'historique).

### Règles de survie

- « La question ne se repose plus jamais » devient : **elle ne se repose pas tant que la décision reste `active` et compatible avec la version courante du paquet.**
- Une **évolution d'une règle citée** (version du sujet, ÉNONCÉ, statut de frontière) place la décision en `a-revoir` — détectable mécaniquement par `regles-citees` + `version-paquet`, sans rapprochement sémantique.
- L'agent **ne réactive jamais seul** une décision `a-revoir` ou `remplacee` : seul l'arbitre la repasse en `active`, la remplace (nouvelle DL avec `remplace:`) ou la retire.
- **Aucune écriture dans le journal sans autorisation explicite du consommateur** — le constat `en-attente` lui-même n'est appendé qu'avec l'accord donné à l'installation, ou au cas par cas.
- Le **chargement est ciblé par portée** : l'agent relit les décisions dont la portée croise la tâche en cours — jamais un déversement illimité du journal dans tout contexte. Révision de l'arbitrage n°3 du § 6 : « au socle universel, toujours relu » désigne l'**index des portées** (compact), pas le corps de toutes les décisions.
