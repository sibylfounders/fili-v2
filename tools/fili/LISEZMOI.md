# La greffe FILI — le Leviathan dans ce dépôt

Rien de ce qui existait n'a été remplacé. Cette greffe ajoute :

| Chemin | Rôle |
|---|---|
| `fili.registry.json` | Le registre déclaré. **Pas de registre, pas de verdict** : sans lui, le gardien refuse de statuer plutôt que d'afficher vert. |
| `tools/fili/index.js` | Les règles. Déterministes, sans dépendance, 0 % IA. |
| `tools/fili/eslint.fili.js` | Le bloc à greffer dans `eslint.config.js` du projet (garde `src/`). |
| `tools/fili/eslint.crash.js` | La configuration isolée de la batterie. |
| `tools/fili/crash-test/` | La batterie : fixtures attendues, tests de mutation, démonstration du portail. |
| `tools/fili/temoin/` | Le rendu de l'Écran Témoin depuis sa source vérifiée. |
| `crash-tests/` | Le terrain de preuve : design system minimal, pages, fixtures piégées et conformes. |

## Commandes

```bash
npm run fili:crash-test    # 45 pièges bloqués · 22 conformes passants
npm run fili:mutations     # 36 sabotages du gardien, tous détectés
npm run fili:temoin        # régénère crash-tests/temoin.html depuis le TSX vérifié
npm run fili:check         # le gardien sur src/ uniquement
```

## Ce que la greffe change dans le projet

Deux ajouts, aucun remplacement :

1. `eslint.config.js` — deux lignes : l'import du bloc FILI et son ajout en fin
   de configuration. `npm run lint` garde désormais `src/`, donc le hook de
   pre-commit et la CI aussi.
2. `package.json` — quatre scripts `fili:*`. Aucun script existant n'est modifié.
