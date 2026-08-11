# tours.md — combien de fois le Gardien a été convoqué

Le Gardien est le juge, pas le guide : le fichier a été réécrit depuis les quatre
contrats, puis soumis. Deux tours sur le fichier, trois tours de non-régression.

## Tours sur le fichier gouverné

`npx eslint --config tools/fili/eslint.crash.js crash-tests/epreuve-c/SoigneNonInforme.tsx`

| Tour | Constats | Ce que le tour a établi / corrigé |
|---|---|---|
| 1 | 35 | État des lieux avant toute écriture : R3.2 ×13, R4.5 ×7, R4.1 ×6, R1.1 ×5, R3.4 ×3, R2.1 ×1. |
| 2 | 0 | Après les 27 transformations : aucun constat. Rien n'a eu à être corrigé après coup — aucun aller-retour, aucune correction de rattrapage. |

## Tours de non-régression

`node tools/fili/crash-test/run.mjs`

| Tour | Résultat | Ce que le tour a établi |
|---|---|---|
| 3 | Intégrité 25/25 · 🟢 100 % | Le Gardien porte les 25 assertions, actives, et la batterie complète tient après la réécriture du fichier. |
| 4 | Intégrité 25/25 · 🟢 100 % | Lecture du contrôle d'intégrité en tête de rapport : identique. |
| 5 | Intégrité 25/25 · 🟢 100 % | Après l'adaptation de `tools/fili/temoin/rendu.mjs` et la production des pièces : rien n'a bougé. |

## Contrôle annexe, hors Gardien

Le rendu par défaut de `tools/fili/temoin/rendu.mjs` (sans argument) a été comparé
octet par octet à `temoin.html` d'avant l'adaptation : identique. Aucun autre
fichier du dépôt ne référence ce script.

## Total

**2 tours sur le fichier · 3 tours sur la batterie complète.**
Zéro rupture déclarée posée. Zéro transformation orpheline.
