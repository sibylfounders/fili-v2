# Prédictions — enregistrées AVANT toute génération valide

## Révision de protocole (2026-07-28) — AVANT tout run valide

Le protocole v1 (C4 = C3 + T-001 + critères d'audit) mélangait deux variables. **Protocole v2, corrigé sur revue d'Aurélien : C4 = exactement le bundle C3 + T-001, rien d'autre ; la checklist d'audit sert uniquement à évaluer les sorties et n'est injectée dans aucune condition** (`checklist-evaluation.md`, sortie du dossier `contextes/`). Huit sorties de la tâche A avaient été générées sous le protocole v1 avant la correction : elles sont **invalidées et mises en quarantaine** dans `sorties-invalidees-protocole-v1/` — elles ne comptent dans aucune métrique. Aucun run du protocole v2 n'a été lancé ; l'expérience attend un feu vert explicite.

Date initiale : 2026-07-27. Ce fichier ne sera plus modifié après le premier run valide (seule la section « Résultats » sera ajoutée en fin de test, sans toucher aux prédictions).

## Dispositif

3 tâches (A toolbar de collection, B groupe d'actions par élément de collection — reformulée le 2026-07-28 pour rester dans la portée de T-001 resserrée, C fin de formulaire) × 4 conditions × 2 tirages = 24 sorties. Modèle générateur : sonnet (profil réaliste d'une IA consommatrice), prompt de tâche, contexte technique et consigne de sortie **identiques mot pour mot** entre conditions ; seule la connaissance design varie :

- C1 : aucune ;
- C2 : corpus compilé entier (`dist/build/RULES-*`, 36 sujets, ~233 Ko) sans routage ;
- C3 : bundle routé (fermeture exacte du routeur, vérifiée contre RAPPORT-ROUTEUR : Formulaire 18 fichiers, Collection 12) + socle universel ;
- C4 : exactement le même bundle que C3, + T-001 (« Visibilité des actions vs hiérarchie du groupe ») — rien d'autre ; une seule variable sépare C3 de C4.

Adaptation documentée avant test : le corpus injecté est `dist/build` (règles **adressables**, IDs présents) et non le paquet plugin (sans IDs) — pour que la citation par ID soit possible dans C2, C3 et C4 à égalité ; C1 ne peut citer que des principes nommés, ce qui est le comportement mesuré.

Convention de harnais (semi-déterministe) : « rang dominant » = `Button` avec `style` filled et `tone` primary, **défauts inclus**, plus `SubmitButton`.

## Prédictions

- **P1** : C2 ≤ C3 sur la qualité d'interface (dilution du contexte) — contre-intuitif mais attendu ; un C2 > C3 net invaliderait la valeur du routeur (H1).
- **P2** : C4 ≥ C3 nettement sur la justification (traçabilité ≥ 80 % de citations par ID valides et justes en C4 ; reconnaissance de la tension +1 point de médiane minimum vs C3) — c'est H3.
- **P3** : l'écart C4−C3 sur l'**interface** (checklist + échelles assistées) est la vraie inconnue du pilote — aucune prédiction de signe ; c'est H2. Attendu concentré sur la tâche C (piège de la destructive) et la tâche A (5 actions pour 1 rang dominant).
- **P4** : C1 produira ≥ 1 violation de checklist par sortie en moyenne (dominants multiples ou card statique cliquable), et des justifications sans référence vérifiable.

## Seuils de décision (repris de la spec, H1–H4)

- H1 confirmée si C3 > C2 sur l'interface (médianes des deux familles).
- H2 confirmée si C4 > C3 sur l'interface uniquement : +1 pt de médiane assistée, ou +2 violations évitées en moyenne sur la checklist d'évaluation (jamais injectée). C3→C4 mesure la seule valeur de l'arbitrage explicite.
- H3 confirmée si C4 ≥ 80 % de décisions citant un ID existant avec justesse ≥ 1, et reconnaissance de la tension +1 pt de médiane vs C3.
- H4 confirmée si la sortie témoin à 3 violations injectées est détectée 3/3 par la checklist AVANT le test principal.

## Ce que ce dispositif ne mesure pas (limites assumées d'avance)

- Le rendu réel (contraste, focus, cible tactile) : porté par les composants du package, non vérifié statiquement ici — jugement humain sur rendu local pour les échelles assistées.
- Un juge LLM indépendant d'une autre famille de modèles n'est pas accessible depuis cette session : les jugements assistés reviennent à Aurélien (+ éventuel juge extérieur), en aveugle, via le paquet fourni.
- n = 2 tirages par cellule : médianes et tendances, pas de statistique inférentielle.
