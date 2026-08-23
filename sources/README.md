# Fili — monorepo

Les sites de la constellation Fili sur **une même stack** : Next.js + npm workspaces,
avec des packages partagés. Un dev apprend l'organisation une fois, elle vaut pour tous.

Pour savoir quel fichier s'écrit à la main et lequel se régénère, lire `OU-EST-QUOI.md`.

## Lancer en local
```bash
npm install            # une fois (installe tout le workspace)
npm run dev            # -> apps/site sur http://localhost:3000
```
Le serveur recharge à chaud : à chaque modif de fichier, la page se met à jour toute seule.

## Structure
```
packages/
  tokens/      @fili/tokens — source des tokens (dist servie : /css, /tailwind, /figma)
  react/       @fili/react  — composants ; le site les consomme, jamais une copie locale
  charts/      @fili/charts — primitives de visualisation
apps/
  site/        @fili/site — Next 14 (app router), export statique
               /md doctrine · /ui atelier et catalogue · /audit
tools/
  compile-regles.py    doctrine -> dist/build et dist/audit (étape 9 de la méthode)
  plugin/              paquet Cowork « design-system-md » (build-plugin.js)
dist/
  build/ audit/        distribution compilée, jamais éditée à la main
```

## Commandes
```bash
npm run dev                                  # serveur de dev (apps/site)
npm run build                                # tous les workspaces
npm run tokens:build                         # tokens + garde de fidélité + contrastes
npm run build --workspace @fili/site        # export statique -> apps/site/out/
python3 tools/compile-regles.py --tous       # recompile dist/build et dist/audit
node tools/plugin/build-plugin.js            # paquet Cowork -> build/design-system-md.plugin
```

## Conventions (identiques par app)
- `app/` (App Router), `content/` (markdown et doctrine), `components/`, `lib/`.
- Les tokens viennent de `@fili/tokens` ; aucune valeur en dur.
- Les composants viennent de `@fili/react` ; avant d'en composer un dans `apps/site`,
  vérifier qu'il vient du package — sinon le promouvoir d'abord.
- `npm run tokens:build` échoue si une valeur DS-UI s'écarte de `DESIGN.md` sans
  arbitrage déclaré dans `packages/tokens/src/ds-md.map.mjs`.
