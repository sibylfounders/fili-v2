# Protocole d’audit rapide v1.1.0

Ce profil sert à orienter rapidement une décision avant un éventuel approfondissement. Une première correction visible en moins de deux minutes et un audit utilisable en quelques minutes sont des **objectifs à mesurer**, pas une promesse acquise.

## Résultat attendu

La restitution humaine contient uniquement :

- l’écran concerné ;
- ce qui ne fonctionne pas ;
- pourquoi cela pose problème ;
- ce qu’il faut corriger, tester ou vérifier ;
- la règle utile lorsqu’elle ajoute une information ;
- un prompt adapté à la nature de l’action.

Les conformités, hypothèses non observables et détails de méthode restent hors de la vue principale.

`scope: "flow"` est réservé à un problème produit par la séquence, le parcours ou un comportement transversal démontré sur plusieurs états. Sans finding de ce type, aucune vue Flow n’est affichée. Sa recommandation reste limitée au problème global et n’agrège pas les corrections locales.

## Collecte

1. Capturer le chemin principal réellement accessible.
2. Conserver une image par écran ou état distinct rencontré.
3. Ne pas rechercher systématiquement les cas limites absents.
4. Ne pas transcrire tout le texte pendant la collecte.
5. Arrêter lorsque la tâche principale aboutit ou bloque.

Pour un produit responsive, commencer par le chemin mobile puis vérifier les mêmes étapes sur desktop lorsque le temps le permet. Chaque finding porte un `view_context` (`both`, `mobile`, `desktop`, `unknown`) qui décrit où le problème existe réellement. Une comparaison manquante reste `unknown`.

Une absence dans le corpus n’est jamais transformée en défaut.

## Analyse

Le référentiel est chargé une seule fois, uniquement pour les familles de règles déclenchées par les écrans observés.

Un finding n’est créé que si :

1. un problème ou une tension est relié à une preuve identifiée ;
2. son impact est explicable en français courant ;
3. une correction, un test ou un arbitrage concret peut être proposé.

Il n’existe aucun quota de recommandations.

## Données minimales

L’agent renseigne `observations.json` et `findings.json`. Chaque finding porte une classification parmi `corriger`, `tester`, `verifier` et `arbitrage_humain`, ainsi que `incremental_value: "unproven"`.

Les fichiers de synthèse, l’instantané des règles, les mesures d’exécution et les builds sont produits par `audit/tools/audit.js`.

## Mesure obligatoire

Séparer autant que possible :

- collecte ou import ;
- analyse ;
- recommandations ;
- génération et validation ;
- tokens et coût lorsqu’ils sont fournis par le fournisseur.

Une valeur absente reste `null`. Aucun coût n’est estimé.

## Limite de revendication

Sans audit témoin indépendant, ce mode ne démontre aucune plus-value incrémentale propre au référentiel.
