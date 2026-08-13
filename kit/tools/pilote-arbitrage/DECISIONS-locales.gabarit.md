# DECISIONS-locales.md — journal des décisions du consommateur

> Ce fichier vous appartient, comme les valeurs de `tokens.yaml` : vos décisions, jamais les règles.
> Il journalise ce que **vous** tranchez là où le système ne couvre pas. Il ne modifie jamais une
> règle, un nom de token ni le routeur. L'agent relit les décisions **dont la portée croise la tâche
> en cours** ; il n'y écrit que des constats `en-attente` — et seulement avec votre autorisation —
> jamais une décision.
> Spécification : `docs/chantiers/CADRAGE-ARBITRAGE-CONSOMMATEUR.md` 0.4.0 (monorepo).

## Arbitre

- Rôle : *(obligatoire — ex. lead design)*
- Nom : *(facultatif)*
- Canal : *(ex. Slack #design-system)*

Sans arbitre déclaré, le circuit fonctionne — les constats s'accumulent `en-attente` — mais la
boucle reste ouverte, et l'agent le signale.

## Règles du journal (structure non modifiable)

- Une décision locale tranche uniquement le **non couvert** : jamais contre une règle du système,
  jamais contre une propriété universelle. Une décision qui contredit une règle est invalide —
  l'agent la signale et ne l'applique pas.
- Identifiants `DL-nnn` **stables, jamais réattribués**. Une décision retirée laisse son numéro vacant.
- **Statuts** : `en-attente` (constat écrit par l'agent) → `active` (décision rendue par l'arbitre) →
  `a-revoir` (une règle citée a évolué depuis l'arbitrage) ou `remplacee` (une décision plus récente
  la cite via `Remplace`). Une question tranchée ne se repose pas **tant que sa décision reste
  `active` et compatible avec la version courante du paquet** — pas « plus jamais ».
- Une **évolution d'une règle citée** (version du sujet, énoncé, statut de frontière) place la
  décision en `a-revoir`. L'agent **ne réactive jamais seul** une décision `a-revoir` ou
  `remplacee` : seul l'arbitre tranche à nouveau.
- **Aucune écriture sans votre autorisation explicite** — y compris le constat `en-attente`.
- Au-delà d'une trentaine de décisions `active`, une revue s'impose : les décisions récurrentes sont
  des **candidats règles** à remonter vers le système — elles n'ont pas vocation à vivre ici.

## Décisions

<!-- Format d'une entrée — l'en-tête reste compact, les champs de survie sont obligatoires :

DL-001 [active 2026-07-28 — rôle : lead design] <contexte en une phrase>
  Question : <clé de question stable — la formulation normalisée qui identifie « la même question »>
  Décision : <ce qui est tranché, en une phrase> — Justification : <pourquoi, en une phrase>
  Portée : <où ça s'applique> — Règles citées : <IDs Fili, ex. BUTTON-R19, T-001> — Paquet : <version lors de l'arbitrage>
  Réexamen : <condition explicite — échéance, événement, ou montée de version des sujets cités>
  Remplace : <DL-nnn, si applicable>

Un constat écrit par l'agent (avec votre autorisation), avant décision :

DL-002 [en-attente] <contexte en une phrase>
  Question : <la décision à rendre> — Options : <2 à 4, chacune avec sa conséquence>
  CONFIANCE : <ce que disent les règles voisines : établi / convergence / cas isolé / non formalisé> — Attendu : <qui tranche>
-->
