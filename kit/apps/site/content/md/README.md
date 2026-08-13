# Doctrine — la source

Source de vérité du projet. Le noyau (`core/`), les sujets rangés par nature
(`principles/`, `languages/`, `foundations/`, `components/`, `patterns/`, `flows/`)
et les inventaires (`inventaires/`) vivent ici. La prose est lue par le site
(`apps/site/lib/md.ts`) ; la structure des fiches vit à côté, dans
`apps/site/content/doctrine/*.json`.

- Modifier ici, puis recompiler : `python3 tools/compile-regles.py --tous`
  (→ `dist/build/` et `dist/audit/`).
- Ne jamais reporter une correction à la main dans `dist/` — c'est une compilation.
- Une fiche `tools/plugin/rules/RULES-*.md` n'est PAS dérivable par script : c'est une
  condensation éditoriale d'une paire UX/UI, à repasser à la main puis
  `node tools/plugin/build-plugin.js`.
- Modifier une paire `<SUJET>-UX.md`/`-UI.md` change son empreinte SHA-256 : recompiler,
  sinon la provenance affichée dans `dist/` ment.
