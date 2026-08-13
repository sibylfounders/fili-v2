// Génère packages/react/manifest.json depuis src/manifest/ (source TypeScript).
// Node pur + transpilation TS légère (typescript est déjà une dépendance du monorepo).
// Le TYPE-CHECK du manifeste est fait par le tsc du site (l'atelier importe
// @fili/react/manifest) — ici on ne fait qu'ÉMETTRE le JSON pour les outils Node
// (catalogue agents, validateurs) sans bundler.
//
// Usage : node packages/react/build/genere-manifeste.mjs           (écrit manifest.json)
//         node packages/react/build/genere-manifeste.mjs --check   (fraîcheur : compare
//         la génération en mémoire au manifest.json COMMITÉ, échoue s'ils diffèrent,
//         n'écrit RIEN — une simple vérification ne modifie jamais le dépôt)

import { readFileSync, writeFileSync, mkdirSync, rmSync, mkdtempSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { createRequire } from "node:module";

const here = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(here, "..");
const srcDir = join(pkgRoot, "src", "manifest");
const require = createRequire(import.meta.url);
const ts = require("typescript");

const FILES = ["schema.ts", "pilote.ts", "catalogue.ts", "index.ts"];
// Hors du dépôt : sous le pont Cowork (device_bash), unlink est interdit dans le
// dossier monté — os.tmpdir() reste nettoyable partout.
const tmp = mkdtempSync(join(tmpdir(), "fili-manifest-"));

for (const f of FILES) {
  const source = readFileSync(join(srcDir, f), "utf8");
  const out = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
      verbatimModuleSyntax: false,
    },
    fileName: f,
  }).outputText
    // les imports relatifs sans extension → .mjs locaux
    .replace(/from "\.\/(schema|pilote|catalogue)"/g, 'from "./$1.mjs"');
  writeFileSync(join(tmp, f.replace(/\.ts$/, ".mjs")), out);
}

const { manifest } = await import(pathToFileURL(join(tmp, "index.mjs")).href);
try { rmSync(tmp, { recursive: true, force: true }); } catch { /* bac à sable sans unlink */ }

const outPath = join(pkgRoot, "manifest.json");
const contenu = 
  JSON.stringify(
    { $schema: "./src/manifest/schema.ts", generated: "genere-manifeste.mjs — NE PAS ÉDITER", entries: manifest },
    null,
    2,
  ) + "\n";

if (process.argv.includes("--check")) {
  const commite = readFileSync(outPath, "utf8");
  if (commite !== contenu) {
    console.error("❌ manifest.json est PÉRIMÉ par rapport à la source src/manifest/.");
    console.error("   Régénérer puis committer : npm run manifeste:build");
    process.exit(1);
  }
  console.log(`✅ manifest.json à jour (${manifest.length} composants).`);
} else {
  writeFileSync(outPath, contenu);
  console.log(`manifest.json : ${manifest.length} composants (${manifest.filter((e) => e.status === "stable").length} stables).`);
}
