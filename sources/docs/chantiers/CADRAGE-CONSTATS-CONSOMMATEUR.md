---
name: cadrage-constats-consommateur
description: Cadrage (étape 1 de la Méthode) du cycle de vie des constats d'audit côté consommateur — constat journalisé, acceptation, contestation, dérogation datée, re-audit avec mémoire. Complète le circuit d'arbitrage (DL), qui ne couvre que le registre « à trancher ».
version: 0.1.0 # 0.1.0 : premier cadrage (2026-07-28) — nature, test de transposition, mécanisme en quatre pièces, frontières en négatif, boucle de retour, arbitrages ouverts. Origine : exploration des fonctionnalités de Fili Audit du 2026-07-28 — la famille « circuit de vie des constats » jugée la plus structurante après le pilote DL. Aucune modification du paquet, du routeur ni des fiches.
statut: proposition — aucun arbitrage rendu, rien n'est branché dans la chaîne
date: 2026-07-28
---

# Cadrage — le cycle de vie des constats d'audit côté consommateur

## 0. La demande

Fili Audit sait émettre : le mode audit charge les règles, leurs MESURE et le statut de frontière, et produit des constats dans trois registres — `à corriger`, `suggestion`, `à trancher`. Le registre `à trancher` a désormais son circuit complet (constat d'arbitrage → journal `DECISIONS-locales.md`, cf. `CADRAGE-ARBITRAGE-CONSOMMATEUR.md`). Les deux autres registres n'ont **que l'aller** : un constat émis n'a ni statut, ni destinataire, ni mémoire. Trois questions restent sans réponse dès qu'un audit n'est plus un événement isolé mais une pratique :

- **que devient** un constat une fois émis — accepté, corrigé, contesté, assumé ? Aujourd'hui : rien ; il vit dans un rapport que personne ne relit ;
- **où s'écrit** l'écart assumé — l'équipe qui décide de ne pas corriger le fait silencieusement, et le prochain audit re-signale le même écart comme une découverte ;
- **comment un re-audit sait** ce qui a déjà été constaté, corrigé ou assumé — sans mémoire, chaque audit repart de zéro et son rapport mélange le nouveau et le connu, ce qui use la confiance de l'équipe auditée plus vite que les écarts eux-mêmes.

Le présent cadrage spécifie le **retour** : constat émis → journalisé chez le consommateur → statué par l'humain → relu par l'agent au prochain audit → remonté vers la Méthode quand il se répète.

## 1. Nature de l'objet

Ce n'est **pas un sujet de design** : pas de fiche `CONSTAT-UX/UI`, rien dans les six catégories éditoriales. C'est un **mécanisme de la distribution** (étape 9), volet Fili Audit — et il crée la **troisième surface possédée par le consommateur**, après les valeurs de `tokens.yaml` et les décisions de `DECISIONS-locales.md` : le consommateur possède le **devenir** de ses constats, jamais leur qualification. L'autorité se répartit ainsi :

- la **Méthode** fait autorité sur le format du constat, les registres et les règles du cycle (qui a le droit d'écrire quel statut) ;
- les **fiches** restent propriétaires des règles et des MESURE — la **qualification** d'un constat (propriété universelle → non-conformité, parti pris → suggestion) vient du statut de frontière et ne se négocie pas localement ;
- le **consommateur** fait autorité sur la **suite** : accepter, corriger, contester, déroger — à l'intérieur de l'espace que la qualification laisse ouvert.

## 2. Test de transposition

Le modèle qui se transpose est le **cycle de vie des décisions locales** (`CADRAGE-ARBITRAGE-CONSOMMATEUR.md` § 8), à vérifier champ par champ plutôt qu'à copier :

- se transposent tels quels : l'identifiant stable jamais réattribué, le statut, la portée explicite comme clé de chargement, les **règles citées + version du paquet** (détection mécanique du vieillissement), la condition de réexamen, la chaîne de remplacement ;
- `cle-question` devient **clé de constat** : règle citée × emplacement normalisé — c'est elle qui permet au re-audit de reconnaître « le même écart » mécaniquement, jamais un rapprochement sémantique approximatif ;
- la `MESURE`, intransposable à une décision locale, est ici **centrale** : c'est le critère de clôture — un constat déterministe se ferme quand sa MESURE repasse, et la distinction déterministe / semi-déterministe / assisté (`PILOTE-RELATIONS-ARBITRAGES.md` § 8) se transpose au **droit de clôture** (§ 3d).

Ce qui ne se transpose **pas** : le geste de l'arbitre. Sur une DL, il tranche une question que le corpus laisse ouverte ; sur un constat, il ne peut pas dire « la règle a tort » — face à une `propriété universelle`, son choix se réduit à corriger, déroger en le datant, ou qualifier le constat de faux positif. Le rôle est le même (l'arbitre déclaré à l'installation), le pouvoir n'est pas le même.

## 3. Le mécanisme en quatre pièces

### a. Le constat journalisé — le format

Même discipline que le constat d'arbitrage : un format compact, appendé au journal, jamais une prose libre. Proposition (nommage au § 6) :

```text
CA-012 [ouvert] à-corriger — 2026-07-28
Règle   : BUTTON-R19 [loi] · paquet 1.8.0
Écran   : réglages du compte / fin de formulaire
Constat : deux actions au rang dominant — MESURE : au plus un par vue
Clé     : BUTTON-R19 × reglages-compte/fin-formulaire
```

Le constat porte la provenance déjà en place dans `dist/audit/` (version du paquet, empreinte de la source) : on peut prouver de quelle version du corpus chaque constat est sorti. Les champs de suite (décision, justification, échéance de réexamen) ne sont remplis que par l'humain.

### b. Les statuts — proposition de jeu fermé

```text
ouvert ──► accepte ──► corrige ──► verifie          (clos)
   │
   ├──► conteste ──► faux-positif                    (clos — signal de calibration, § 5)
   │            └──► derogation ──► a-revoir         (vivant — réexamen obligatoire)
   │
   └──► decline                                      (clos — réservé au registre suggestion)
```

Règles de survie, transposées des DL :

- un constat en `derogation` **ne se re-signale pas comme nouveau** au prochain audit tant qu'il reste actif et compatible avec la version courante du paquet — il se **compte** (la dette reste visible dans chaque rapport), il ne se **redécouvre** pas ;
- une **évolution d'une règle citée** (version du sujet, ÉNONCÉ, MESURE, statut de frontière) place la dérogation en `a-revoir` — détectable mécaniquement par règles citées + version du paquet ;
- l'agent **ne rouvre et ne réactive jamais seul** ; mais un constat `verifie` dont la MESURE recasse produit un **nouveau** constat qui cite l'ancien (`reprend: CA-nnn`) — la chaîne garde l'historique des récidives, qui est une information en soi.

### c. La dérogation — la dette rendue visible

Une dérogation n'est **pas** une décision locale : la DL tranche là où le corpus **se tait**, la dérogation assume un écart là où le corpus **parle**. Les deux objets ne se mélangent pas. Champs obligatoires : justification, arbitre (le rôle), et **condition de réexamen** (échéance, événement, ou montée de version des sujets cités) — une dérogation sans réexamen est invalide, c'est précisément la dérogation silencieuse et éternelle que ce cadrage existe pour empêcher.

Sur une `propriété universelle`, la dérogation reste possible — interdire ne ferait que pousser l'écart hors du journal — mais elle reste comptée comme **non-conformité assumée**, jamais versée au conforme. Sur un parti pris (registre `suggestion`), `decline` suffit : on ne déroge pas à une proposition.

### d. Le re-audit — la mémoire

Avant d'auditer, l'agent **relit le journal** — chargement ciblé par portée, index compact au socle, même révision que l'arbitrage n°3 des DL. Le rapport partitionne alors chaque écart en quatre : **nouveau** / **connu-ouvert** (déjà signalé, jamais statué) / **dette** (dérogations actives et `a-revoir`) / **résolu** depuis le dernier audit. C'est cette partition qui change la nature du livrable : d'une photo, le rapport devient un différentiel — et le « résolu » donne à l'équipe la preuve que corriger paie.

Droits d'écriture, même discipline que les DL : l'agent écrit les constats `ouvert` ; il peut **proposer** `verifie` quand une MESURE **déterministe** repasse (la clôture assistée reste humaine — arbitrage n°3, § 6) ; accepter, contester, déroger, décliner sont des gestes humains, toujours. Aucune écriture dans le journal sans l'autorisation donnée à l'installation, ou au cas par cas.

## 4. Frontières — ce que le cycle n'est pas

- **Pas un outil de ticketing.** L'export d'un constat vers l'outil de l'équipe (ClickUp, Jira, Linear…) est une projection possible et à sens unique ; le journal fait foi, jamais l'inverse. Rien de tel en v1.
- **Pas une plateforme.** En v1, le cycle vit dans des fichiers du dépôt du consommateur, comme les deux autres surfaces. Tableau de bord multi-produits, rôles multiples, état partagé hors dépôt : c'est un choix d'architecture ultérieur, qui se cadrera à part — jamais une extension silencieuse de ce format.
- **Pas un mécanisme d'affaiblissement des règles.** Une dérogation ne modifie jamais une règle, un statut de frontière ni une MESURE ; elle est locale, datée, et porte sa condition de réexamen. Si les dérogations s'accumulent sur la même règle, c'est la boucle de retour (§ 5) qui doit travailler — jamais le journal qui fait jurisprudence.
- **Pas les DL.** Le registre `à trancher` part dans le circuit d'arbitrage, inchangé. Un constat ne devient jamais une DL ni l'inverse ; un constat peut citer une DL (une décision locale active peut couvrir le choix que l'audit rencontre — l'écart n'en est alors pas un), une DL ne cite jamais un constat.
- **Rien d'automatique** au-delà de la proposition de clôture déterministe — et même elle est un arbitrage ouvert.

## 5. La boucle de retour vers la Méthode

Trois signaux distincts, trois destinations distinctes :

- les **faux positifs** retournent vers le paquet : chaque `faux-positif` justifié est un cas de calibration — candidat au banc de test de la checklist d'évaluation, versionné avec le paquet. Un taux qui monte sur une règle signale une MESURE mal écrite ou une exception manquante (`exception-de`) ;
- les **dérogations récurrentes** sur la même règle — chez plusieurs consommateurs, ou trois fois chez le même — interrogent le **statut de frontière** : une propriété universelle constamment dérogée est peut-être un parti pris mal classé. C'est exactement l'annotation progressive tirée par l'usage que l'étape 4 prescrit — jamais une passe de réécriture ;
- les **constats sur cas non couverts** alimentent les inventaires : un « non couvert » rencontré cinq fois sur le terrain change de priorité dans la carte de couverture.

Canal de collecte : **manuel en mission**, comme les DL (arbitrage n°5 du cadrage arbitrage) — relecture des journaux aux points client, rien d'outillé tant qu'aucun journal réel n'existe.

C'est la même ligne d'offre que le circuit d'arbitrage, prolongée : l'audit ponctuel fait la porte d'entrée, mais c'est le cycle — qui statue, où s'écrit la dette, ce qui remonte — qui transforme une prestation en pratique installée chez le client.

## 6. Arbitrages ouverts — à rendre avant toute tranche

1. **Nommage et emplacement** : `CONSTATS.md`, préfixe `CA-nnn`, racine du paquet à côté de `tokens.yaml` et `DECISIONS-locales.md` — les trois surfaces consommateur co-localisées ?
2. **Journal unique ou rapport par audit** : proposition — journal unique comme source, le rapport d'audit devient une projection datée du journal (la partition du § 3d), jamais un document autonome.
3. **Clôture déterministe** : l'agent a-t-il le droit d'écrire `verifie` seul quand une MESURE déterministe repasse, ou seulement de le proposer ?
4. **Dérogation sur propriété universelle** : permise avec réexamen obligatoire (proposition du § 3c), ou réservée aux partis pris en v1 ?
5. **Jeu de statuts** : le jeu fermé du § 3b est-il le bon ? `decline` mérite-t-il une trace, ou une suggestion déclinée se clôt-elle sans écriture ?
6. **Seuil** : à partir de combien de dérogations actives le paquet recommande-t-il la remontée plutôt que l'accumulation (les DL disent ~30) ?
7. **Export ticketing** : hors v1 — à confirmer explicitement pour que la frontière du § 4 soit une décision, pas un oubli.

## 7. Tranche pilote — proposition, rien n'est implémenté

Même veine que la tranche DL, à ne découper qu'après les arbitrages du § 6 : gabarit `tools/plugin/CONSTATS.gabarit.md` copié dans le paquet par `build-plugin.js` (étape bloquante, comme 2bis) ; § « Constats » dans le routeur généré, chargé en mode audit (relecture du journal avant d'auditer, partition nouveau / connu / dette / résolu, constat `ouvert` = seule écriture permise à l'agent) ; **quatrième test d'installation** dans le SKILL : *« Audite ce formulaire »* sur le faux projet client — le cycle est branché si l'agent relit le journal, reconnaît une dérogation active sans la re-signaler comme nouvelle, émet les nouveaux constats au format, propose sans statuer, et ne clôt rien. La doctrine, le compilateur et les fiches restent intouchés.

Aucun lot sans validation explicite.
