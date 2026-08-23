# Rapport — chantier cohérence du kit @fili/react (2026-07-29, commit a54567d)

> Mission : transformer le kit React en système cohérent et mécaniquement applicable —
> une grammaire d'API, une cascade de tokens réelle, un manifeste machine-readable,
> un atelier dérivé, un catalogue agents, des validateurs. Périmètre de cette passe :
> audit + socle + tranche pilote Button/Input/Card (arbitrage Aurélien).

## 1. Verdict des constats initiaux

| Constat de l'audit | Verdict | Détail |
|---|---|---|
| Couche de tokens de composant absente | **défaut confirmé** | tokens.source.mjs annonçait 3 étages, n'en avait que 2 (primitives + rôles couleur). Corrigé : exports `transversal` (étage 2) et `componentTokens` (étage 3). |
| `--border-focus-width` vs `--focus-width` | **défaut confirmé** (bug de nommage) | card-group.css consommait deux variables inexistantes, masquées par un fallback 2px. Corrigé → `--control-focus-*`. |
| `bg-neutral-200` (Switch) | **défaut confirmé** | Classe hors thème (morte depuis que theme.colors est remplacé). Corrigé → `bg-surface-hover` (le sombre y gagne au passage). |
| Focus « ring accordé au tone » sur Button/CompactButton | **divergence intentionnelle mal journalisée** | BUTTON-UI 1.4.1 la documentait, le code citait une « 1.5.1 » sans rapport, et BORDER-UI affirmait le contraire dans sa table. Arbitrage : accent unifié. |
| Focus divergent sur Input/ThemeToggle/Alert/Toast/DeleteButton/SubmitButton | **défauts confirmés** (silencieux) | 4 façons de recomposer le même anneau. Tous alignés sur `.ds-focus-ring` / `--control-focus-*` / `outline-accent`. Input passe aussi de `:focus` à `:focus-visible` (BORDER-U05, loi). |
| RULES-button annonçant un tone `warning` | **défaut confirmé — double** | La doctrine elle-même l'annonçait (BUTTON-UX/UI), le code le refusait avec rationale. Arbitrage : retiré de la doctrine (R31/R32 abrogées, IDs conservés). |
| Paquet agents périmé | **défaut confirmé** | tools/plugin/rules figé au 26/07 : 6 fiches/11 en retard (button, card, input, alert, link, toast). Fiches button/input/toast/modal réalignées sur l'API réelle ; le validateur de manifeste garde désormais la fraîcheur dist/ vs sources. |
| Imports @sibyl résiduels | **défaut confirmé** | 2 imports actifs (registry.tsx), qui ne compilaient que grâce aux vieux symlinks de node_modules. Corrigés → @fili/*, invariant gardé (bloquant) par verifie-consommation. |
| `style` masquant l'attribut React | **défaut confirmé** | Migré : `variant` canonique, `style` alias déprécié (variant gagne, warning dev unique), retrait en majeure. |
| test-rendu.js cité par BUTTON-UI | **artefact** (script jamais porté) | La fiche dit désormais la vérité : contraste couvert par validate-contrast.mjs, trou journalisé. |
| Doctrine en retard sur le code (Input tone→status, Toast neutral, Modal wide) | **dette documentée** | Fiches condensées du plugin corrigées ; les paires sources INPUT/TOAST/MODAL restent à réviser (passe doctrine du lot 29/07, déjà planifiée). |

## 2. Chiffres

- **27** composants @fili/react (24 stables, 2 expressifs, 1 requalifié interne : AppShell) + 12 @fili/charts hors périmètre de cette passe.
- **Doctrine** : 11 paires propres, 9 couvertures par pattern/fondation, 4 sans rien (AppLayout, AppShell, Skeleton, ThemeToggle). 36 sujets · **997 règles** qualifiées · 0 non qualifiée après recompilation.
- **Tests avant : 0.** Après : tsc site (inclut le manifeste et ses gardes de types), 72 paires de contraste, garde de fidélité DESIGN.md, 6 exemples canoniques compilés, 4 validateurs. Toujours pas de tests de rendu/interaction (trou assumé, cf. plan).
- **Manifeste** : 27 entrées, 0 incohérence (bijection dossiers↔manifeste, doctrine/RULES existantes, versions fraîches, atelier).
- **Vérificateur de tokens** : 96 écarts relevés → 35 classés en exceptions nommées (mécanique E-motion, replis progressifs, variables locales), **0 écart dans le périmètre strict** (pilote + lib), 61 ouverts hors pilote (essentiellement card-group.css, app-layout, fallbacks dupliquants).
- **Consommation** : 0 écart dans les 23 fichiers d'app hors atelier ; 0 import @sibyl.
- **Paquet agents** : 64 fichiers (dont KIT-socle + 8 KIT-intention générés du manifeste), 185 Ko.

## 3. La cascade, vérifiée

`--button-radius → --control-radius → --radius-md` ; `--input-focus-color → --control-focus-color → --accent` ; `--rl-press → --control-pressed-shadow` (clair/sombre par le token, trois alphas divergents unifiés — normalisation visuelle assumée sur DeleteButton/SubmitButton) ; `--input-border → --field-border → --border`. Changer un rôle maître dans tokens.source.mjs se propage sans toucher un composant — c'est du `var()` natif, pas une convention.

## 4. Écarts restant volontairement ouverts

1. Les 61 écarts de tokens hors pilote (card-group.css en tête : ~20 px hors échelle, radius 6px, font-sizes durs) — à résorber vague par vague, le validateur les tient visibles.
2. Les composants déjà conformes au focus accent via classes Tailwind `outline-2` (Link, Tabs, Select…) ne consomment pas encore `--focus-width` : à basculer sur `.ds-focus-ring` lors de leur vague.
3. L'entrée « card » de l'atelier démontre la collection (options = CardGroup) : dérivation à faire à la vague CardGroup, avec promotion de ses props en axes de manifeste.
4. Les chaînes `code()` de l'atelier hors pilote ne sont pas compilées une à une (seuls les exemples canoniques du manifeste le sont).
5. `data-style` reste le hook CSS du relief (le DOM ne dit pas encore `data-variant`) — bascule en majeure, avec la suppression de l'alias.
6. z-index 40 (app-layout) et 60 (toast) hors échelle `--z-*` ; `--ch-cat-*` des charts en hexes durs.
7. Doctrine à écrire : Drawer, Dropdown, Skeleton, ThemeToggle, AppLayout ; paires INPUT/TOAST/MODAL/CARD/SELECT/SWITCH à réaligner sur le lot 29/07.

## 5. Décisions qui restent à Aurélien

1. **AppShell** : requalifié `interne` dans le manifeste (zéro consommateur) — le retirer du baril à la prochaine majeure ?
2. **Statut expressif** : DeleteButton/SubmitButton restent servis aux agents via les KIT (avec budget de rareté) — les réserver à un chargement explicite ?
3. **Fiches condensées du plugin** : elles restent éditoriales (OU-EST-QUOI). Faut-il les faire dériver de dist/build à terme, quitte à perdre la condensation manuelle ?
4. **Publication du paquet** : `npm run plugin` fera le bump (1.7.0 → 1.8.0 proposé : KIT + fiches réalignées + retrait warning).

## 6. Plan de propagation (vagues)

1. CompactButton ✅ (fait avec le pilote) et Link ; 2. Select et Switch ; 3. Tabs et Accordion ; 4. Alert et Toast ; 5. CardGroup (+ dérivation atelier) ; 6. Modal, Drawer, Dropdown ; 7. AppLayout, Nav, TableOfContents ; 8. spécialisés/expressifs + charts. À chaque vague : vocabulaire du Contract, entrée de manifeste détaillée (axes `axe<U>()`), tokens étage 3 si le contrat l'exige, exemples canoniques, extension du périmètre strict de verifie-tokens, doctrine réalignée.

## 7. À faire en Terminal (hors de portée du pont)

```bash
cd ~/Claude/Projects/Fili
rm -rf node_modules && npm install        # installation propre — plus AUCUN alias @sibyl requis
npx tsc --noEmit -p apps/site/tsconfig.json
npm run tokens:build && npm run verifie && npm run verifie:exemples
npm run build --workspace @fili/site      # next build (impossible depuis le pont, 45 s max)
npm run plugin                            # publie.js : bump versionné du paquet
git push                                  # a54567d (+ le commit du rapport)
# vider _to_delete/ (locks git + snapshot du chantier)
```
