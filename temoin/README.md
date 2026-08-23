# FILI V2 — socle technique

Design Ops &amp; Code Governance. Ce dépôt est un **cadre avant d'être un produit** :
les règles, les limites et les crash-tests priment sur la production de code.

## Démarrer

```bash
npm install
npm run dev        # http://localhost:5173
```

## Les deux documents vivants

| Fichier | Répond à |
|---|---|
| [`system-map.md`](./system-map.md) | **Où on en est** — statuts, crash-tests, dettes ouvertes |
| [`journal.md`](./journal.md) | **Pourquoi on en est là** — décisions datées, alternatives écartées |
| [`PLAN.md`](./PLAN.md) | **Où on va** — ce qu'on fait ensuite, et dans quel ordre |
| [`REGLES.md`](./REGLES.md) | **Comment écrire une interface ici** — le fichier que l'IA lit avant d'écrire. Généré. |

Ils ne se remplacent pas et ne se dupliquent pas. Toute décision qui déplace la
carte ouvre une entrée au journal, dans le même geste.

## Crash-tests de la Qualité Perçue Minimale

```bash
npm run qpm            # batterie S2 + mutation + lint a11y
npm run qpm:s2         # S2 seul — zéro dépendance, tourne avant npm install
npm run qpm:s2:mutate  # S2-T9 : injecte un défaut, exige que la batterie rougisse
npm run lint           # partie automatisable de S2 et S4
```

Un test est **binaire**. Un sujet passe 🟢 à 100 % de PASS sur 100 % du périmètre.
Un seul FAIL laisse la porte fermée — voir le contrat de verrouillage dans
`system-map.md § 2 bis`.

## Intégration continue

`.github/workflows/qpm.yml` — déclenché sur `push` et `pull_request` vers
`main` / `master`.

C'est **le seul endroit où la batterie tourne en entier**. Le hook pre-commit
passe `--no-build` pour rester supportable au quotidien, donc S2-T8 y reste
BLOQUÉ ; la CI est le seul lieu qui peut verrouiller S2.

Aucun `continue-on-error`, aucun `|| true`, aucune étape optionnelle.

### Protection de branche à activer côté GitHub

Le fichier de CI ne protège rien tout seul : sans ces réglages, une PR rouge
reste fusionnable. Dans **Settings → Branches → Add branch ruleset** :

| Réglage | Valeur |
|---|---|
| Require a pull request before merging | ✅ |
| Require status checks to pass | ✅ — cocher `Crash-tests QPM` |
| Require branches to be up to date before merging | ✅ |
| Do not allow bypassing the above settings | ✅ |

Le dernier est le plus important : une protection contournable par son auteur
n'est pas une protection, c'est un rappel.

## Règles du socle

- **Zéro valeur en dur** dans les composants. Couleurs, espacements, rayons,
  durées viennent des tokens. Seuls `src/index.css` et `tailwind.config.js` ont
  le droit de contenir des littéraux.
- **Styles inline interdits** — la règle est appliquée par le lint, pas par la
  bonne volonté.
- **4 états obligatoires** dès qu'un rendu dépend d'une donnée : Normal,
  Loading, Error, Empty. Un composant à un seul état est un composant non livré.
- **Lint a11y en `error`**, jamais en `warn`. Un warning est un FAIL déguisé.

## Structure

```
fili-v2/
├── system-map.md · journal.md      documentation vivante
├── scripts/qpm-s2.mjs              crash-test S2, zéro dépendance
├── eslint.config.js                chaîne de preuve a11y + tokens
├── tailwind.config.js              tokens sémantiques
└── src/
    ├── index.css                   tokens primitifs, focus, reduced-motion
    ├── App.tsx                     page d'attente (écart HTML brut déclaré)
    └── main.tsx
```
