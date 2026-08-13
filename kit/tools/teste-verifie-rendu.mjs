#!/usr/bin/env node
// Auto-test du harnais de RENDU sur ses fixtures — même discipline que fili-check :
// une règle qui cesse de détecter doit faire du bruit tout de suite, pas le jour où
// elle laisserait passer une vraie page. Exécuté par la chaîne, avant le vrai balayage.
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ici = dirname(fileURLToPath(import.meta.url));
// `dur-au-dom` a été retiré le 2026-07-30 : la détection des valeurs source appartient au
// validateur AST (fili-check / verifie-tokens) — le rendu ne garde que l'observable.
// `message-orphelin` et `erreur-sans-message` (2026-07-30, chaîne de validation) : les
// identifiants sont GÉNÉRÉS (React.useId) — aucune lecture de source ne peut confronter un
// aria-describedby à sa cible, seul le rendu voit l'identifiant final.
const attendues = ["titre-saute", "cible-trop-petite", "focus-hors-systeme", "focus-invisible", "lien-mort",
                   "message-orphelin", "erreur-sans-message"];

let brut;
try {
  brut = execFileSync(process.execPath, [join(ici, "verifie-rendu.mjs"), "--out", "tools/fixtures/rendu", "--json"], {
    cwd: join(ici, ".."), encoding: "utf8", stdio: ["ignore", "pipe", "pipe"],
  });
} catch (e) {
  console.error("❌ le harnais de rendu n'a pas pu s'exécuter sur ses fixtures :");
  console.error(String(e.stderr ?? e.message).slice(0, 400));
  process.exit(1);
}
const { findings } = JSON.parse(brut);
const surIncorrect = new Set(findings.filter((f) => f.page.startsWith("/incorrect")).map((f) => f.regle));
const manquantes = attendues.filter((r) => !surIncorrect.has(r));
if (manquantes.length) {
  console.error(`❌ le harnais de rendu ne détecte plus : ${manquantes.join(", ")} (fixture négative)`);
  process.exit(1);
}
// Le champ à l'outline TRANSPARENTE (le `outline-none` de Tailwind) doit être refusé :
// une outline invisible n'est pas un indicateur de focus.
if (!findings.some((f) => f.page.startsWith("/incorrect") && f.regle === "focus-invisible" && /transparente/.test(f.motif))) {
  console.error("❌ l'outline transparente sans porteur d'anneau n'est plus refusée (fixture négative)");
  process.exit(1);
}
const fauxPositifs = findings.filter((f) => f.page.startsWith("/conforme"));
if (fauxPositifs.length) {
  console.error("❌ le harnais signale à tort sur la fixture conforme :");
  for (const f of fauxPositifs) console.error(`   ${f.page} [${f.regle}] ${f.motif}`);
  process.exit(1);
}
/**
 * Deuxième fixture : un build SOUS basePath. La règle « lien-hors-basepath » ne peut rien
 * voir quand le préfixe est vide — c'est-à-dire dans tous les builds locaux, et c'est
 * précisément pourquoi trois liens morts ont vécu jusqu'à la publication (2026-07-30).
 * Elle a donc besoin de sa propre fixture pour être éprouvée hors de la CI.
 */
let brutBase;
try {
  brutBase = execFileSync(process.execPath, [join(ici, "verifie-rendu.mjs"), "--out", "tools/fixtures/rendu-basepath", "--json"], {
    cwd: join(ici, ".."), encoding: "utf8", stdio: ["ignore", "pipe", "pipe"],
  });
} catch (e) {
  console.error("❌ le harnais de rendu n'a pas pu s'exécuter sur la fixture basePath :");
  console.error(String(e.stderr ?? e.message).slice(0, 400));
  process.exit(1);
}
const horsBase = JSON.parse(brutBase).findings.filter((f) => f.regle === "lien-hors-basepath");
if (horsBase.length !== 1 || horsBase[0].motif !== "/md/") {
  console.error("❌ « lien-hors-basepath » : attendu exactement 1 constat sur /md/ — obtenu " +
    JSON.stringify(horsBase.map((f) => f.motif)));
  process.exit(1);
}
// Et le lien CORRECT (/fili/md/) ne doit produire ni ce constat, ni un lien-mort.
const fauxSurBase = JSON.parse(brutBase).findings.filter((f) => f.motif === "/fili/md/");
if (fauxSurBase.length) {
  console.error("❌ « lien-hors-basepath » signale à tort l'adresse correcte /fili/md/");
  process.exit(1);
}

console.log(`✅ harnais de rendu : ${attendues.length} détections confirmées sur la fixture négative (dont l'outline transparente refusée), 0 faux positif sur la conforme — l'Input au focus délégué est accepté ; « lien-hors-basepath » éprouvée sur sa propre fixture.`);
