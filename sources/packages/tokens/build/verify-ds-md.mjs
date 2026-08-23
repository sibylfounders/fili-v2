// ─────────────────────────────────────────────────────────────────────────────
// GARDE DE FIDÉLITÉ DS-UI ↔ DS-MD — Node pur, sans build, CI-ready.
//
// Asserte que chaque token DS-UI correspondant à un token d'autorité DS-MD
// (cf. ds-md.contract.mjs) porte EXACTEMENT la même valeur, en mode clair.
//   • aligné            → silencieux (compté)
//   • divergence ASSUMÉE (ds-md.map.mjs → acknowledged) → ⚠ visible, non bloquant
//   • dérive NON déclarée → ❌ bloquant (exit 1)
//
// Le mode clair suffit : DS-MD ne tokenise que le clair ; le sombre est une
// EXTENSION DS-UI (dette assumée de DS-MD), hors périmètre du contrat.
// ─────────────────────────────────────────────────────────────────────────────
import {
  primitives, semantic, states, spacing, radius, elevation, typography,
} from "../src/tokens.source.mjs";
import { contract, dsMdVersion } from "../src/ds-md.contract.mjs";
import { colorMap, acknowledged } from "../src/ds-md.map.mjs";

const resolvePrim = (ref) => {
  const [fam, step] = String(ref).split(".");
  return primitives[fam]?.[step];
};

// Résout tous les rôles/états DS-UI en hex, mode CLAIR.
const roleLight = {};
for (const [name, modes] of Object.entries(semantic))
  roleLight[name] = resolvePrim(modes.light);
for (const [fam, steps] of Object.entries(states))
  for (const [step, m] of Object.entries(steps)) roleLight[`${fam}-${step}`] = resolvePrim(m.light);

const dsUiColor = (spec) =>
  spec?.role ? roleLight[spec.role] : spec?.prim ? resolvePrim(spec.prim) : undefined;

const norm = (v) => String(v).trim().toUpperCase();
const foundations = { spacing, radius, elevation };

let ok = 0, warn = 0, fail = 0;
const lines = [];
const A = "\x1b[0m", G = "\x1b[32m", Y = "\x1b[33m", R = "\x1b[31m", D = "\x1b[2m";

// ── 1. Couleurs ──────────────────────────────────────────────────────────────
for (const [tok, hex] of Object.entries(contract.colors)) {
  const key = `colors.${tok}`;
  const spec = colorMap[tok];
  if (!spec) {
    if (acknowledged[key]) { lines.push(`${Y}  ⚠ ${key}${A} — non couvert par DS-UI ${D}(${hex})${A}`); warn++; }
    else { lines.push(`${R}  ❌ ${key}${A} — aucun token DS-UI ne porte ${hex}, et aucune divergence assumée`); fail++; }
    continue;
  }
  const got = dsUiColor(spec);
  if (got === undefined) { lines.push(`${R}  ❌ ${key}${A} — mapping ${JSON.stringify(spec)} irrésolu`); fail++; continue; }
  if (norm(got) === norm(hex)) { ok++; continue; }
  if (acknowledged[key]) { lines.push(`${Y}  ⚠ ${key}${A} — DS-MD ${hex} ≠ DS-UI ${got} ${D}(assumé)${A}`); warn++; }
  else { lines.push(`${R}  ❌ ${key}${A} — DS-MD ${hex} ≠ DS-UI ${got} ${D}(${JSON.stringify(spec)})${A}`); fail++; }
}

// ── 2. Fondations non-couleur ────────────────────────────────────────────────
for (const grp of ["spacing", "radius", "elevation"]) {
  for (const [k, v] of Object.entries(contract[grp])) {
    const key = `${grp}.${k}`;
    const got = foundations[grp]?.[k];
    if (got === undefined) {
      if (acknowledged[key]) { lines.push(`${Y}  ⚠ ${key}${A} — absent de DS-UI ${D}(assumé)${A}`); warn++; }
      else { lines.push(`${R}  ❌ ${key}${A} — DS-MD ${v} mais absent de DS-UI`); fail++; }
      continue;
    }
    if (norm(got) === norm(v)) { ok++; continue; }
    if (acknowledged[key]) { lines.push(`${Y}  ⚠ ${key}${A} — DS-MD ${v} ≠ DS-UI ${got} ${D}(assumé)${A}`); warn++; }
    else { lines.push(`${R}  ❌ ${key}${A} — DS-MD ${v} ≠ DS-UI ${got}`); fail++; }
  }
}

// ── 3. Ancre typographique (display) ─────────────────────────────────────────
for (const [k, v] of Object.entries(contract.typography.display)) {
  if (k === "fontFamily") {
    const sans = typography.fontFamily?.sans || "";
    if (sans.split(",")[0].trim() === v) ok++;
    else { lines.push(`${R}  ❌ typography.display.fontFamily${A} — DS-MD ${v} absent en tête de sans (${sans.split(",")[0]})`); fail++; }
    continue;
  }
  const got = typography.display?.[k];
  if (norm(got) === norm(v)) ok++;
  else { lines.push(`${R}  ❌ typography.display.${k}${A} — DS-MD ${v} ≠ DS-UI ${got}`); fail++; }
}

// ── Rapport ──────────────────────────────────────────────────────────────────
console.log(`\nContrat DS-MD v${dsMdVersion} — fidélité DS-UI (mode clair)\n`);
console.log(lines.length ? lines.join("\n") : `${D}  (tout aligné)${A}`);
console.log(`\n${G}${ok} aligné(s)${A} · ${Y}${warn} divergence(s) assumée(s)${A} · ${fail ? R : D}${fail} dérive(s) non assumée(s)${A}`);

if (fail) {
  console.error(`\n${R}❌ ${fail} dérive(s) : une valeur DS-UI contredit DS-MD sans arbitrage déclaré.${A}`);
  console.error(`   Aligner la valeur DS-UI, ou déclarer la divergence dans src/ds-md.map.mjs (acknowledged).`);
  process.exit(1);
}
console.log(`\n${G}✅ Aucune dérive silencieuse — DS-UI est fidèle à DS-MD (aux divergences assumées près).${A}`);
if (warn) console.log(`${D}   ${warn} arbitrage(s) ouvert(s) à trancher — détail ci-dessus.${A}`);
