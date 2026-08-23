# Fili

Design Ops & Code Governance — un cadre avant d'être un produit : les règles,
les limites et les crash-tests priment sur la production de code.

## La carte du dépôt

| Dossier | Ce que c'est | Point d'entrée |
|---|---|---|
| **`docs/`** | La gouvernance. `journal.md` (pourquoi on en est là — ne se réécrit jamais), `system-map.md` (où on en est), `PLAN.md` (où on va), `REGLES.md` (généré — ce qu'une IA lit avant d'écrire une interface). | lire, dans cet ordre |
| **`kit/`** | Le design system : corpus de règles en markdown, tokens, composants, site de consultation. Monorepo npm (`apps/`, `packages/`). | `cd kit && npm install && npm run dev` → http://localhost:3000 |
| **`temoin/`** | L'app témoin V2 (Vite + React + TypeScript strict) : le terrain d'épreuve où les règles sont testées sur de vrais écrans, avec ses outils, crash-tests et témoins HTML. | `cd temoin && npm install && npm run dev` |
| **`archive/`** | Les pièces historiques : épreuves passées, sauvetages datés. Rien n'y est actif. | consulter au besoin |

## Le garde-fou

Chaque commit fait tourner la batterie de la Qualité Perçue Minimale
(`temoin/scripts/qpm-s2.mjs`) via le hook `.githooks/pre-commit` — activation,
une fois : `git config core.hooksPath .githooks`. La chaîne complète, build
reproductible inclus, tourne en CI (`.github/workflows/qpm.yml`) : un seul
FAIL ferme la porte.

## Les règles de tenue

- Le journal (`docs/journal.md`) est scellé : les entrées passées ne se
  réécrivent jamais, toute entrée nouvelle attend l'accord d'Auteur.
- Aucune valeur en dur dans les interfaces : tout passe par les jetons.
- Un écart assumé se déclare et se date ; la négligence, elle, est interdite.

*Node : version dans `.nvmrc`. Rangement du dépôt effectué le 2026-08-23 —
l'historique complet de chaque fichier suit son déplacement (`git log --follow`).*
