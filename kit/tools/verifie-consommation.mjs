#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// VÉRIFICATEUR DE CONSOMMATION (monorepo) — enveloppe du moteur PORTABLE
// tools/fili-check.mjs (AST TypeScript, fichier complet), avec :
//   - la configuration monorepo EXPLICITE (fili-check.config.monorepo.json —
//     exclusions justifiées une à une, jamais implicites) ;
//   - l'invariant GLOBAL @sibyl/* balayé sur TOUT apps/ (atelier et tests compris) ;
//   - les fiches de manque du monorepo : content/md/inventaires/manques/<slug>.md
//     (chez un consommateur : .fili/manques/<slug>.md — cf. MISSING-COMPONENT-PROTOCOL).
//
// Mode par défaut : rapport (exit 0 sauf @sibyl). `--strict` : exit 1 sur tout écart.
// ─────────────────────────────────────────────────────────────────────────────
import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { analyser, rapport, classe, baselineDepuis } from "./fili-check.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const STRICT = process.argv.includes("--strict");
const ADOPTE = process.argv.includes("--adopte"); // constat UNIQUE de l'existant
const BASE_PATH = join(ROOT, "tools/fili-check.baseline.json");

// ── 1. moteur portable, config monorepo, manifeste réel ──────────────────────
const res = analyser(ROOT, {
  config: join(ROOT, "tools/fili-check.config.monorepo.json"),
  manifest: join(ROOT, "packages/react/manifest.json"),
  fichesManques: join(ROOT, "apps/site/content/md/inventaires/manques"),
});

// ── 2. invariant global : AUCUN import @sibyl/*, partout dans apps/ ──────────
let sibyl = 0;
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    if (e === "node_modules" || e === ".next" || e.startsWith(".")) continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx?|jsx?|mjs|cjs)$/.test(e)) {
      readFileSync(p, "utf8").split("\n").forEach((l, i) => {
        if (/from ["']@sibyl\//.test(l)) {
          res.findings.push({ file: relative(ROOT, p), ligne: i + 1, rule: "import-sibyl", motif: l.trim(), detail: "invariant global (atelier compris)" });
          sibyl++;
        }
      });
    }
  }
})(join(ROOT, "apps"));

// ── 3. constat versionné : l'existant est CONNU, le nouveau échoue ───────────
// L'invariant @sibyl n'y entre jamais : il ne se constate pas, il se corrige.
const baseline = existsSync(BASE_PATH) ? JSON.parse(readFileSync(BASE_PATH, "utf8")) : { entries: [] };
const jugeables = res.findings.filter((f) => f.rule !== "import-sibyl");

if (ADOPTE) {
  if (baseline.entries.length) {
    console.error("\n✗ le constat d'adoption a déjà eu lieu : un écart nouveau se corrige, se classe en exception nommée, ou entre par édition manuelle justifiée de tools/fili-check.baseline.json.");
    process.exit(1);
  }
  const entries = baselineDepuis(
    jugeables,
    "constat d'adoption des règles élargies de fili-check (2026-07-30, cf. DECISIONS.md) — écarts antérieurs à l'élargissement, aucune augmentation tolérée",
    "vague 9 (site)",
  );
  writeFileSync(BASE_PATH, JSON.stringify({
    note: "Constat de conformité du site au kit — versionné. Tout écart NOUVEAU ou toute AUGMENTATION échoue en --strict, y compris dans un fichier créé après ce constat. Une entrée ne s'ajoute que par décision (édition manuelle justifiée) : --adopte ne se rejoue pas.",
    creee: "2026-07-30 — élargissement des règles (styles inline, carte recréée indépendante de l'écriture)",
    entries,
  }, null, 2) + "\n");
  console.log(`\nConstat écrit : ${entries.length} entrée(s), ${jugeables.length} occurrence(s).`);
  process.exit(0);
}

const { nouveaux, augmentes, reduits, disparus } = classe(jugeables, baseline);

console.log(rapport(res));
console.log(`\n  constat : ${baseline.entries.length} entrée(s) connue(s) (${baseline.entries.reduce((a, e) => a + e.occurrences, 0)} occ.) — à résorber, jamais à augmenter`);
if (nouveaux.length) {
  console.log(`\n■ NOUVEAUX écarts hors constat — ${nouveaux.length} :`);
  for (const { k, n, exemples } of nouveaux.slice(0, 25))
    console.log(`   ${k} ×${n}${exemples[0] ? `  (${exemples[0].file}:${exemples[0].ligne})` : ""}`);
}
if (augmentes.length) {
  console.log(`\n■ AUGMENTATIONS vs constat — ${augmentes.length} :`);
  for (const { k, avant, apres } of augmentes) console.log(`   ${k} : ${avant} → ${apres}`);
}
if (reduits.length || disparus.length)
  console.log(`\n○ Conformité en hausse : ${reduits.length} réduit(s), ${disparus.length} éteint(s) — mettre le constat à jour.`);

if (sibyl) { console.error(`\n❌ ${sibyl} import(s) @sibyl/* — la migration Fili ne tolère aucun retour.`); process.exit(1); }
if (STRICT && (nouveaux.length || augmentes.length)) {
  console.error(`\n❌ --strict : ${nouveaux.length} nouveau(x) · ${augmentes.length} augmentation(s).`);
  console.error("   Corriger, classer en exception nommée (fili-check-allow: <règle> — <raison>), ou déclarer un manque (FILI-MANQUE + fiche).");
  process.exit(1);
}
if (STRICT) console.log("\n✅ Strict : aucun écart nouveau (le constat ne grandit pas).");
else console.log("(mode rapport — `--strict` pour bloquer)");
