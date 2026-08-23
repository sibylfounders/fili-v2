// ─────────────────────────────────────────────────────────────────────────────
// SYNC DS-MD → contrat DS-UI — Node pur.
//
// Lit le frontmatter d'autorité de la doctrine (`apps/site/content/md/core/DESIGN.md`,
// section DS-MD du monorepo) et régénère src/ds-md.contract.mjs, puis affiche le diff
// avec le contrat précédent. C'est le SEUL point d'entrée des valeurs DS-MD dans DS-UI :
// on ne recopie plus une couleur à la main.
//
// Depuis la migration vers le monorepo Fili, la doctrine vit DANS le monorepo : plus aucun
// chemin vers l'ancien dépôt « Design System MD », gelé et en lecture seule. Le
// tokens.yaml du paquet Cowork est, lui aussi, dérivé de ce même DESIGN.md
// (tools/plugin/genere-tokens.js) — une seule source, deux consommateurs.
//
// Chemin source : $DS_MD_TOKENS, sinon la doctrine du monorepo.
// Usage : npm run sync:ds-md   (puis `npm run verify:ds-md`)
// ─────────────────────────────────────────────────────────────────────────────
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join, resolve } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const CONTRACT = join(HERE, "..", "src", "ds-md.contract.mjs");
const DEFAULT_SRC = resolve(HERE, "..", "..", "..", "apps", "site", "content", "md", "core", "DESIGN.md");
const SRC = process.env.DS_MD_TOKENS || DEFAULT_SRC;

let raw;
try { raw = readFileSync(SRC, "utf8"); }
catch {
  console.error(`❌ doctrine DS-MD introuvable : ${SRC}`);
  console.error(`   Renseigne le chemin via DS_MD_TOKENS=/chemin/vers/DESIGN.md node build/sync-ds-md.mjs`);
  process.exit(1);
}

// Les valeurs vivent dans le frontmatter YAML ; la prose qui suit ne doit jamais être lue.
const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
const head = fm ? fm[1] : raw;

// Parse plat, ciblé : sections top-level → { clef: "valeur" } (commentaires # ignorés).
const WANT = new Set(["colors", "spacing", "radius", "elevation"]);
const parsed = {};
let section = null;
for (const line of head.split("\n")) {
  const top = line.match(/^([a-z_][\w-]*):\s*(#.*)?$/i);
  if (top) { section = top[1]; if (WANT.has(section)) parsed[section] = {}; continue; }
  if (!section || !WANT.has(section)) continue;
  const kv = line.match(/^  ([\w-]+):\s*"([^"]*)"/);
  if (kv) parsed[section][kv[1]] = kv[2];
}

// Fondations : on ne garde que les clefs du contrat courant (superset DS-UI ignoré).
const KEEP = {
  spacing: ["base", "xs", "sm", "md", "lg", "xl", "section"],
  radius: ["sm", "md", "lg", "pill"],
  elevation: ["none", "raised", "overlay"],
};
const pick = (obj, keys) => Object.fromEntries(keys.filter((k) => k in (obj || {})).map((k) => [k, obj[k]]));

const version = (head.match(/^version:\s*"?([\d.]+)"?/m) || raw.match(/DESIGN\.md v([\d.]+)/) || [])[1] || "inconnue";
const today = new Date().toISOString().slice(0, 10);

const next = {
  colors: parsed.colors || {},
  spacing: pick(parsed.spacing, KEEP.spacing),
  radius: pick(parsed.radius, KEEP.radius),
  elevation: pick(parsed.elevation, KEEP.elevation),
  // ancre display : reprise du frontmatter (sync ciblé, valeurs stables)
  typography: { display: { fontFamily: "Geist", fontSize: "48px", fontWeight: 500, lineHeight: "1.1" } },
};

// Diff avec le contrat précédent, s'il existe.
let prev = null, prevVersion = null, prevSyncedAt = null;
try {
  const mod = await import(pathToFileURL(CONTRACT).href);
  prev = mod.contract; prevVersion = mod.dsMdVersion; prevSyncedAt = mod.syncedAt;
} catch { /* premier sync */ }
if (prev) {
  const changes = [];
  const walk = (a, b, path) => {
    const keys = new Set([...Object.keys(a || {}), ...Object.keys(b || {})]);
    for (const k of keys) {
      const av = a?.[k], bv = b?.[k];
      if (av && typeof av === "object") { walk(av, bv, `${path}${k}.`); continue; }
      if (bv && typeof bv === "object") { walk(av, bv, `${path}${k}.`); continue; }
      if (String(av) !== String(bv)) changes.push(`  ${path}${k} : ${av ?? "∅"} → ${bv ?? "∅"}`);
    }
  };
  walk(prev, next, "");
  // Idempotence : contrat identique (mêmes valeurs, même version DESIGN.md) → rien n'est
  // réécrit, la date de sync existante est conservée.
  if (!changes.length && prevVersion === version) {
    console.log(`Contrat déjà à jour (DESIGN.md v${version}, sync du ${prevSyncedAt}) — fichier non réécrit.`);
    process.exit(0);
  }
  console.log(changes.length ? `Changements DS-MD → contrat :\n${changes.join("\n")}` : `Aucune valeur modifiée — version DESIGN.md ${prevVersion} → ${version}, contrat réécrit pour tracer la version.`);
} else {
  console.log("Premier sync — contrat créé.");
}

const body = `// ─────────────────────────────────────────────────────────────────────────────
// CONTRAT DS-MD — valeurs d'AUTORITÉ importées de « Design System MD ».
//
// GÉNÉRÉ par build/sync-ds-md.mjs depuis apps/site/content/md/core/DESIGN.md.
// NE PAS ÉDITER À LA MAIN : relancer \`npm run sync:ds-md\` pour rafraîchir.
//
// La doctrine fait autorité sur les VALEURS ; tokens.source.mjs fait autorité sur les
// NOMS et l'organisation en trois étages. build/verify-ds-md.mjs asserte que chaque
// token DS-UI correspondant porte EXACTEMENT la valeur ci-dessous. Une divergence non
// déclarée est une dérive.
//
// Source : doctrine DS-MD — DESIGN.md v${version}
// ─────────────────────────────────────────────────────────────────────────────

export const dsMdVersion = ${JSON.stringify(version)};
export const syncedAt = ${JSON.stringify(today)};

export const contract = ${JSON.stringify(next, null, 2)};
`;
writeFileSync(CONTRACT, body);
console.log(`\n✅ ${CONTRACT.split("/").slice(-1)[0]} régénéré depuis DESIGN.md v${version} (${today}).`);
console.log(`   Relance la garde : node build/verify-ds-md.mjs`);
