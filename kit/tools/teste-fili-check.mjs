#!/usr/bin/env node
// Auto-test de fili-check sur les fixtures — exécuté par build-plugin AVANT l'empaquetage :
// le paquet ne livre jamais un validateur qui ne détecte plus ses cas de référence.
import { analyser } from "./fili-check.mjs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ici = dirname(fileURLToPath(import.meta.url));
const FIX = join(ici, "fixtures", "fili-check");
const manifest = join(ici, "..", "packages", "react", "manifest.json");

const attendues = ["import-sibyl", "button-natif", "input-natif", "select-natif", "div-cliquable",
  "role-button", "palette-defaut", "carte-recreee", "prop-inventee", "manque-sans-fiche",
  // ajoutées le 2026-07-30 : chaque écart trouvé à la main finit en fixture, sinon la
  // règle qui l'attrape peut disparaître sans que rien ne le dise.
  "style-en-dur"];

const neg = analyser(join(FIX, "incorrect"), { manifest });
const vues = new Set(neg.findings.map((f) => f.rule));
const manquantes = attendues.filter((r) => !vues.has(r));
if (manquantes.length) {
  console.error(`❌ fili-check ne détecte plus : ${manquantes.join(", ")} (fixture incorrecte)`);
  process.exit(1);
}
const pos = analyser(join(FIX, "conforme"), { manifest });
if (pos.findings.length) {
  console.error(`❌ fili-check signale à tort sur la fixture conforme :`);
  for (const f of pos.findings) console.error(`   ${f.file}:${f.ligne} [${f.rule}] ${f.motif}`);
  process.exit(1);
}
if (pos.manques.length !== 1 || pos.manques[0].slug !== "date-picker") {
  console.error("❌ le recensement FILI-MANQUE avec fiche ne fonctionne pas");
  process.exit(1);
}
console.log(`✅ fili-check : ${attendues.length} détections confirmées sur la fixture négative, 0 faux positif sur la conforme, manque déclaré recensé.`);
