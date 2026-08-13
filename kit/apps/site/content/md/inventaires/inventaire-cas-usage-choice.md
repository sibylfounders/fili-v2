# Inventaire des cas d'usage — la famille du choix

> Méthode, étape 2. Les situations qui **éprouvent** les règles de `CHOICE-UX.md` : chacune est
> soit couverte par une règle, soit un trou déclaré. L'inventaire précède la couverture — il sert
> à découvrir ce que la première intuition oublie.

## Cases à cocher

| # | Situation | Règle qui tranche | Ce qu'elle éprouve |
|---|---|---|---|
| C1 | **Consentement explicite** à une politique avant création de compte | R03, R13 | Une case isolée n'est pas un choix parmi un ; jamais pré-cochée. Autorité du flow : `CONSENTEMENT-UX`. |
| C2 | **Options cumulables** d'un formulaire (pays visités, centres d'intérêt) | R02, R07 | Le groupe nommé par la question ; l'étiquetage collectif. |
| C3 | **« Aucune de ces réponses »** dans un ensemble cumulable | R18 | L'option exclusive : dernière, séparée, décoche les autres. Sans elle, un état contradictoire est saisissable. |
| C4 | **Parent d'une liste partiellement cochée** (« tout sélectionner ») | R11 | L'indéterminé se calcule ; il n'est ni cliquable comme troisième état, ni soumis. |
| C5 | **Préférence de compte** enregistrée par un bouton « Enregistrer » | R01 | La frontière avec le switch : effet différé ⇒ case, pas bascule. |
| C6 | **Une seule case obligatoire** (accepter pour continuer) | R17, renvoi FORM | L'erreur est rattachée à la case et reprend la question, pas « Champ obligatoire ». |
| C7 | Case dont le libellé fait trois lignes sur mobile | UI (enroulement) | Le libellé s'enroule sous lui-même, jamais tronqué : une option tronquée ne peut pas être évaluée. |
| C8 | Case accompagnée d'une aide par option | R10 | L'aide tient en une phrase, sans lien — elle est relue à chaque item. |

## Boutons radio

| # | Situation | Règle qui tranche | Ce qu'elle éprouve |
|---|---|---|---|
| R1 | **Choix d'une formule** (mensuel / annuel) | R02, R05 | Exclusivité portée par le groupe ; deux options suffisent à justifier des radios. |
| R2 | **Oui / non** à une question fermée | R03 | La tentation d'économiser une option en mettant une seule case : refusée. |
| R3 | **Six options ou plus** | R04, renvoi SELECT-UX | Le seuil où la question change de composant — l'autorité reste au select. |
| R4 | Groupe **sans option pré-sélectionnée** | R13, R14 | Une valeur par défaut est une décision ; la tabulation entre alors sur la première option. |
| R5 | Groupe **avec** option pré-sélectionnée | R14 | La tabulation entre sur l'option cochée, pas sur la première. |
| R6 | Navigation au clavier dans le groupe | R14 | Un seul arrêt de tabulation ; les flèches déplacent le focus **et** cochent. |
| R7 | Question rendue par un titre de section plutôt qu'une légende | R06 | Le nom accessible doit être rattaché techniquement — la proximité visuelle ne suffit pas. |
| R8 | Deux groupes de radios sur la même page | R05 | Chaque groupe a son nom propre ; les options d'un groupe n'interfèrent pas avec l'autre. |

## Aux frontières

| # | Situation | Où ça tranche | Statut |
|---|---|---|---|
| F1 | **Réglage à effet immédiat** (thème sombre) | `SWITCH-UX` | Couvert — c'est un switch, pas un choix. |
| F2 | **Filtre à facettes** dans une liste de résultats | `CHIP-R03` | Hors périmètre, déjà écarté : autre besoin, à qualifier s'il émerge. |
| F3 | **Option présentée comme une carte** (plan tarifaire) | R19, `CARD-R25`, `CARD-R26` | Partiellement couvert : la carte héberge le contrôle ; `Card.Control` et l'axe de sélection de `CardGroup` restent à livrer. |
| F4 | **Sélection dans un tableau** (cocher des lignes) | — | **TROU DÉCLARÉ** : la sélection de lignes engage un composant Table que le kit n'a pas. À qualifier le jour où Table arrive. |
| F5 | **Choix multiple au-delà du seuil** (liste longue à cocher) | `SELECT-UX` | Trou partagé : le select multiple n'existe pas non plus. Signalé, non traité ici. |
| F6 | **Bouton segmenté** (choix exclusif rendu en boutons) | — | **TROU DÉCLARÉ** : même cardinalité qu'un groupe de radios, autre facture. À qualifier si un besoin réel émerge — ne pas anticiper. |

## Couverture

Seize situations, **quatorze couvertes** par les règles de `CHOICE-UX`, deux renvoyées à leur
propriétaire (`SWITCH`, `CHIP`), **trois trous déclarés** (F4 sélection de lignes, F5 choix multiple
long, F6 bouton segmenté) — aucun n'est bloquant pour la tranche, tous sont nommés plutôt que
découverts plus tard. Le ratio est cohérent avec les tranches précédentes : la première passe laisse
des trous, leur nombre baisse quand ils sont cherchés activement.
