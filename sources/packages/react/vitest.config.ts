import { fileURLToPath } from "node:url";
import ts from "typescript";
import { defineConfig, type Plugin } from "vitest/config";

/**
 * Les tests de CONSOMMATION importent des .tsx d'apps/site. Le tsconfig de Next déclare
 * `jsx: "preserve"` (obligatoire pour son build) : la transformation par défaut de vitest
 * le respecte et laisse passer du JSX brut → « invalid JS syntax » à l'analyse d'imports.
 * Ce plugin transpile explicitement les sources d'apps/site (jsx automatic, comme le
 * fait Next), sans toucher au tsconfig du site.
 */
const transpileAppsSite = (): Plugin => ({
  name: "fili:transpile-apps-site",
  enforce: "pre",
  transform(code, id) {
    const propre = id.split("?")[0];
    if (!/[/\\]apps[/\\]site[/\\].*\.tsx?$/.test(propre)) return null;
    return ts.transpileModule(code, {
      compilerOptions: {
        jsx: ts.JsxEmit.ReactJSX,
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022,
        verbatimModuleSyntax: false,
      },
      fileName: propre,
    }).outputText;
  },
});

// Harnais de test LÉGER du kit (fermeture chantier cohérence) — pas de Storybook :
// l'Atelier reste l'outil vivant ; ici, l'API, l'interaction et l'accessibilité
// s'attestent en jsdom. Les tests visuels/adaptatifs (rendu réel) restent un trou
// documenté (cf. docs/chantiers/RAPPORT-FERMETURE-COHERENCE.md).
export default defineConfig({
  plugins: [transpileAppsSite()],
  // Les tests de CONSOMMATION (atelier, rendu Markdown du site) importent les modules
  // réels d'apps/site, qui disent `from "@fili/react"` : l'alias pointe le baril SOURCE
  // pour que vitest le transforme comme le reste du kit (le lien workspace de
  // node_modules expose un main .ts que le chargeur node n'inline pas).
  resolve: {
    // Le plus SPÉCIFIQUE d'abord : les alias de Vite sont testés dans l'ordre des clés, et
    // « @fili/react » seul récrirait « @fili/react/validation » en « …/index.ts/validation ».
    alias: {
      "@fili/react/validation": fileURLToPath(new URL("./src/validation/index.ts", import.meta.url)),
      "@fili/react": fileURLToPath(new URL("./src/index.ts", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    // globals: true est REQUIS pour le nettoyage automatique de testing-library
    // entre les tests (sans lui, le DOM du test précédent fuit dans le suivant).
    globals: true,
    setupFiles: "./vitest.setup.ts",
    css: false,
    include: ["src/**/*.test.tsx"],
  },
  // UNE seule autorité de transformation. Vitest 4 tourne sur rolldown-vite : il pose
  // lui-même l'option `oxc`, et Vite avertissait alors que « esbuild et oxc sont déclarées
  // simultanément — les options oxc seront utilisées, celles d'esbuild ignorées ». Le bloc
  // `esbuild: { jsx: "automatic" }` qui vivait ici était donc DÉJÀ sans effet : c'est oxc
  // qui transforme le JSX du kit. Le retirer éteint l'avertissement sans rien changer à la
  // transformation. Les sources d'apps/site gardent leur transpilation explicite (plugin
  // ci-dessus), qui ne dépend ni de l'une ni de l'autre.
});
