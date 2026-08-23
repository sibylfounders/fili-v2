---
name: cadrage-pipeline-information
description: Cadrage (étape 1 de la Méthode) du format d'arbitrage standardisé et de la cartographie des producteurs/consommateurs de signal par fiche — le maillon amont de la boucle d'Impact et le rôle qui le tient.
version: 0.1.0 # 0.1.0 : premier cadrage (2026-07-28) — nature, test de transposition des 7 critères NN/g, format d'arbitrage tabulé (proposition), registre des signaux (proposition), rôle de mainteneur, évaluation des 4 gabarits NN/g, cinq arbitrages ouverts. Origine : veille NN/g du 2026-07-28 — Sara Paul, « Boost Design Autonomy with an Information Pipeline » (17 avril 2026). Aucune modification des fiches, du compilateur, du routeur ni du paquet.
statut: cadrage — arbitrages ouverts, rien d'implémenté
date: 2026-07-28
---

# Cadrage — le pipeline d'information : arbitrage standardisé, signaux amont, rôle

## 0. La demande et la source

Source : *Boost Design Autonomy with an Information Pipeline*, Sara Paul, NN/g, 17 avril 2026 — <https://www.nngroup.com/articles/information-pipeline/>. Thèse : l'autonomie de conception s'obtient en comblant méthodiquement ses angles morts d'information — être suffisamment informé pour peser de façon crédible sur des décisions partagées.

Trois manques identifiés chez Fili, dans l'ordre de la demande :

1. **L'arbitrage se justifie en prose.** Il vit à trois endroits — le « Pourquoi » des entrées de `DECISIONS.md` (étape 8), les RÉSOLUTIONS ACQUISES et l'ARBITRAGE CONTEXTUEL des tensions `T-xxx`, la `justification` des décisions locales `DL-nnn` — mais sans structure commune : deux arbitrages pris à six mois d'écart ne sont pas comparables, et Fili Audit ne peut pas les contrôler.
2. **Aucune fiche ne déclare ses producteurs de signal.** La boucle d'Impact sait propager une modification vers l'aval (dépendants, artefacts, audits) ; rien ne dit d'où viendrait le signal qui *déclencherait* cette modification. Une fiche sans producteur de signal identifié est une fiche qu'aucun signal ne viendra corriger — c'est le maillon amont manquant.
3. **Personne ne tient nommément le pipeline.** L'article chiffre l'entretien à ~1 h par semaine, adossée aux réunions clés ; sans rôle nommé, le registre meurt en trois semaines.

## 1. Nature de l'objet

Ce n'est **pas un sujet de design** : rien dans les six catégories éditoriales, pas de fiche, pas de `RULES-*`. Ce sont deux mécanismes de la Méthode et un rôle :

- le **format d'arbitrage** sert les étapes 4 (qualification), 8 (journalisation) et les tensions du socle — un seul format, trois lieux d'usage ;
- le **registre des signaux** sert la boucle d'Impact (son maillon amont) et l'étape 2 (l'inventaire sait désormais *qui* peut le contredire) ;
- le **rôle** est une décision d'organisation, pas un document.

**Vocabulaire — collision à désamorcer d'emblée.** « Amont/aval » désigne déjà, dans le pilote relations, la dérivation normative entre règles (`derive-de`). Le présent cadrage parle de **flux d'information**, pas de dérivation : on dira **producteurs de signal** (amont informationnel : qui peut apprendre quelque chose à la fiche) et **consommateurs** (aval informationnel : qui implémente ce que la fiche prescrit). Les deux graphes ne se mélangent pas.

## 2. Test de transposition — les sept critères NN/g au périmètre d'un design system

La table réelle de l'article compare **3 options sur 7 lignes** : User Impact, Business Impact, Time to Launch, Engineering Effort, Future Maintenance, Parity between devices, In summary — chiffres réels sur les deux premières (95 % des plaintes ; annulations 23 % → 15 %), estimations temporelles précises, qualitatif ancré sur le reste, synthèse narrative en clôture. Ce qui se transpose :

| Critère NN/g | Transposition Fili | Verdict |
|---|---|---|
| User Impact | **Impact utilisateur** — inchangé : c'est le cœur de la doctrine | se transpose tel quel |
| Business Impact | **Impact système & adoption** — le « business » d'un corpus, c'est sa consommation : sujets et consommateurs touchés, dette évitée ou créée, duplication | se transpose en changeant d'objet |
| Time to Launch | **Délai** — quand la règle/décision doit être disponible (audit qui bute, mission en cours) | se transpose |
| Engineering Effort | **Effort** — rédaction + projections + recompilation + migration éventuelle | se transpose |
| Future Maintenance | **Maintenance future** — chez un DS, c'est souvent le coût dominant (chaque règle est un engagement d'entretien perpétuel) | candidat 5e critère, cf. A1 |
| Parity between devices | — spécifique à un produit multi-plateformes | ne se transpose pas |
| In summary | **Synthèse** — une ligne narrative par option | se transpose |

## 3. Le format d'arbitrage standardisé (proposition, à trancher en A1–A3)

Une table, une colonne par option, une ligne par critère — le même squelette dans les trois lieux :

```text
ARBITRAGE [date — lieu : DECISIONS | T-xxx | DL-nnn]
Question : <une phrase — réutilisable comme clé de question>

| Critère                    | Option A | Option B | (Option C…) |
| Impact utilisateur         | …        | …        |             |
| Impact système & adoption  | …        | …        |             |
| Délai                      | …        | …        |             |
| Effort                     | …        | …        |             |
| (Maintenance future)       | …        | …        |             |
| Synthèse                   | une ligne narrative par option        |

Décision : option X — <une phrase>
CONFIANCE : établi | convergence | cas isolé | non formalisé
```

**Chiffrage (proposition pour A2).** Chaque cellule porte au minimum une **échelle ancrée** (fort / moyen / faible, ancres écrites une fois pour toutes) — toujours possible, jamais un prétexte à cellule vide. Un **chiffre réel** s'exige dès qu'un producteur de signal en fournit (analytics, tickets, comptage d'audit) ; il ne se **fabrique jamais**. Un arbitrage sans aucun chiffre réel reste recevable, mais sa CONFIANCE plafonne à « cas isolé » — l'absence de donnée est signalée, pas maquillée.

**Ce que Fili Audit peut alors contrôler** — mécaniquement : au moins deux options ; toutes les lignes de critères remplies ; la décision pointe une option de la table ; la CONFIANCE respecte le plafond de chiffrage. En assisté : la synthèse ne contredit pas ses lignes. C'est exactement ce que la prose interdisait.

**Ce que le format ne remplace pas.** Le « Pourquoi » narratif reste — le format s'applique quand il y a eu **choix entre options** ; une décision sans alternative réelle (correction factuelle, cession d'autorité) n'a pas à s'inventer des options de décor.

## 4. Le registre des signaux (proposition, à trancher en A4)

Un registre séparé et compact — pas un champ de fiche (une passe globale sur 37 sujets est exactement ce que la doctrine interdit). Par sujet réellement actif :

```text
SUJET <slug>
  Producteurs de signal : <producteur — type — fréquence — dernier signal>
  Consommateurs        : <équipe / installation du paquet — surface consommée>
```

Amorçage **tiré par l'usage**, avec les producteurs qui existent déjà : `consentement` (audit externe du 2026-07-27), `creation-compte` et `form` (pilotes login/inscription du 2026-07-16), `border` (pilote décisions sourcées du 2026-07-26), et — générique — les journaux `DECISIONS-locales.md` en mission (chaque DL est un signal). Les consommateurs sont aujourd'hui inconnus hors missions : le registre a le droit de l'écrire.

**La règle qui en découle** : un sujet sans entrée au registre est un **angle mort déclaré** — projection calculable (liste des sujets sans producteur), affichée dans les rapports, jamais bloquante à la compilation. L'angle mort n'est pas une faute ; l'angle mort silencieux, si.

## 5. Le rôle qui tient le pipeline

Un **rôle**, pas une personne : « mainteneur du pipeline » — ~1 h par semaine, adossée à un rendez-vous existant (la revue hebdomadaire des audits et de `DECISIONS.md`), pour : mettre à jour le registre, relancer les producteurs muets, archiver les signaux périmés, remonter les DL récurrentes en étape 1. Côté corpus, le rôle est tenu aujourd'hui par le fondateur ; côté consommateur, c'est l'**arbitre déclaré** de `DECISIONS-locales.md` qui tient le registre local — même logique de rôle déclaré à l'installation. Activation **après** A1–A4 : nommer un gardien avant que le registre existe, c'est nommer un gardien de rien.

## 6. Les quatre gabarits NN/g, évalués avant d'écrire quoi que ce soit

- **Information Tracker** (XLSX, 6 colonnes : projects/owners/product/files/status/notes) — grain projet, pas grain règle/sujet ; recouvert par `DECISIONS.md` + le registre § 4. **Ne pas adopter** ; retenir l'idée des colonnes « dernier contact / statut » pour le registre.
- **Outreach Scripts** (PDF) — scripts de prise de contact pour collecter du signal sans transaction unilatérale. Sans objet pour le corpus ; **utile en mission** (collecte chez le client) : à verser au kit mission de l'offre, pas au monorepo doctrine.
- **Dependency Map** (PDF) — l'équivalent règle-à-règle existe déjà (index relationnel du pilote) ; la version flux d'information **est** le registre § 4. **Ne pas adopter.**
- **Design Ops Guide** (XLSX : livrable → impact, durée, inputs) — objet d'agence/organisation, pas de corpus : candidat pour l'offre de conseil, hors périmètre Fili. **Écarter ici.**

Verdict : rien à adopter tel quel ; deux emprunts (colonnes de suivi du tracker ; scripts d'outreach côté missions).

## 7. Arbitrages ouverts — à trancher

- **A1 — Les critères.** (a) Les 4 de l'article tels quels ; (b) les 4 transposés (impact utilisateur / impact système & adoption / délai / effort) **+ maintenance future en 5e**. *Recommandation : (b)* — chez un design system, la maintenance est le coût dominant, et NN/g elle-même la garde dans sa table réelle.
- **A2 — Recevabilité sans chiffre.** (a) Irrecevable sans chiffre réel sur ≥ 2 critères ; (b) recevable avec échelles ancrées partout, chiffre réel exigé seulement quand un producteur en fournit, CONFIANCE plafonnée à « cas isolé » sinon. *Recommandation : (b)* — exiger deux chiffres fabrique des faux chiffres ; plafonner la confiance dit la vérité.
- **A3 — Où vit la table.** (a) Dans la fiche ; (b) dans `DECISIONS.md` (et la DL côté consommateur), la fiche ne portant que la règle résultante, la tension référençant l'entrée. *Recommandation : (b)* — l'arbitrage est un événement daté ; c'est la logique déjà actée (« narration migrée vers DECISIONS », autorité au grain de la décision).
- **A4 — Champ de fiche ou registre séparé.** (a) Champ frontmatter par fiche (implique une passe globale — contraire à la doctrine) ; (b) registre séparé, amorcé par les sujets où un signal existe, angle mort déclaré pour les autres. *Recommandation : (b).*
- **A5 — Activation du rôle** : après A1–A4, désignation du rôle et du rendez-vous porteur ; dépend des quatre tranchages.

## 8. Frontières — ce que ce cadrage n'est pas

Pas de nouvelle catégorie éditoriale ni d'entrée de navigation ; rien n'est branché dans le compilateur, le routeur ou le paquet ; aucune passe globale sur les fiches ; le format d'arbitrage ne rétroagit pas sur les arbitrages passés (ils restent en prose, datés) — il s'applique aux suivants, tiré par l'usage, comme tout le reste.
