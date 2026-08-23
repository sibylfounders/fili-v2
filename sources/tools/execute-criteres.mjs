#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// execute-criteres — le moteur PILOTÉ PAR LE CORPUS.
//
// Il ne connaît aucune règle. Il lit les fiches de doctrine
// (`apps/site/content/doctrine/*.json`), y prend le champ `critere` quand il
// existe, le compile dans la grammaire fermée du Lot 1, et l'exécute sur les
// pages construites — les mêmes que `tools/verifie-rendu.mjs`.
//
// Ce que ce fichier n'a PAS le droit de faire :
//   • inventer un prédicat absent de la table ci-dessous ;
//   • deviner ce qu'un critère mal formé voulait dire ;
//   • passer sous silence un critère qu'il n'a pas su compiler.
// Les trois cas remontent comme MANQUE, et le processus sort en erreur — même
// mécanique que le MISSING-COMPONENT-PROTOCOL, appliquée au moteur.
//
// Usage : node tools/execute-criteres.mjs [--json] [--out <dir>]
// ─────────────────────────────────────────────────────────────────────────────
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { litLeCorpus, compile, evalueDansLaPage, evalueLesValeurs } from "./criteres-grammaire.mjs";
import { recolteDansLaPage } from "./instrument-statique.mjs";
import { joue, SCENES, REJEUX } from "./instrument-interactif.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const require_ = createRequire(import.meta.url);
const JSON_OUT = process.argv.includes("--json");
const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? process.argv[i + 1] : d; };
const OUT = join(ROOT, arg("out", "apps/site/out"));
const DOCTRINE = join(ROOT, "apps/site/content/doctrine");

let chromium;
try { ({ chromium } = require_("playwright")); }
catch {
  console.error("✗ execute-criteres : playwright introuvable — le rendu ne se déduit pas, il s'observe.");
  process.exit(2);
}
if (!existsSync(OUT)) {
  console.error(`✗ execute-criteres : ${relative(ROOT, OUT)} n'existe pas — construire le site d'abord.`);
  process.exit(2);
}

// ── 1-3. Corpus, grammaire, évaluateur : un seul exemplaire ────────────────
// Rien n'est redéfini ici. Le test de non-régression (`teste-criteres.mjs`)
// importe exactement les mêmes fonctions : les deux harnais ne peuvent pas
// diverger sans que le fichier partagé bouge.
const criteres = litLeCorpus(DOCTRINE);
const manques = [];
const compiles = criteres.map((c) => compile(c, manques)).filter(Boolean);

// ── 4. Les mêmes pages que verifie-rendu ────────────────────────────────────
const pages = [];
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) { if (e !== "_next") walk(p); continue; }
    if (extname(p) !== ".html") continue;
    const rel = "/" + relative(OUT, p).replace(/\\/g, "/").replace(/index\.html$/, "").replace(/\.html$/, "");
    if (!/\/404\/?$/.test(rel)) pages.push(rel.replace(/\/$/, "") || "/");
  }
})(OUT);
pages.sort();

const MIME = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".json": "application/json",
  ".svg": "image/svg+xml", ".woff2": "font/woff2", ".png": "image/png", ".ico": "image/x-icon", ".txt": "text/plain" };
const racineHtml = existsSync(join(OUT, "index.html")) ? readFileSync(join(OUT, "index.html"), "utf8") : "";
const mBase = racineHtml.match(/["'](\/[^"']*?)\/_next\//);
const BASEPATH = mBase ? mBase[1] : "";
const serveur = createServer((req, res) => {
  let u = decodeURIComponent(req.url.split("?")[0]);
  if (BASEPATH && u.startsWith(BASEPATH)) u = u.slice(BASEPATH.length) || "/";
  let f = join(OUT, u);
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  if (!existsSync(f) && existsSync(f + ".html")) f += ".html";
  if (!existsSync(f)) { res.statusCode = 404; return res.end("404"); }
  res.setHeader("content-type", MIME[extname(f)] || "application/octet-stream");
  res.end(readFileSync(f));
});
const port = await new Promise((ok) => serveur.listen(0, "127.0.0.1", () => ok(serveur.address().port)));
const base = `http://127.0.0.1:${port}`;

let navigateur;
try { navigateur = await chromium.launch(); }
catch (e) {
  console.error("✗ execute-criteres : aucun Chromium exécutable — `npx playwright install chromium`.");
  console.error("  Le rendu ne se déduit pas, il s'observe : ce harnais ne dégrade pas en silence.");
  console.error("  (Les critères purement structurels se confrontent sans navigateur : `node tools/teste-criteres.mjs`.)");
  process.exit(2);
}
const contexte = await navigateur.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
const findings = [];
const attentes = [];
const nonConcluants = []; // mesurables en principe, non établis en fait — jamais « conforme »
// Les critères STATIQUES portent sur la feuille de style, pas sur le document :
// ils se récoltent UNE fois, sur la première page qui charge la cascade complète.
// Les évaluer par page produirait N fois le même constat sur la même déclaration.
const statiques = compiles.filter((c) => c.statique);
const proprietes = [...new Set(statiques.flatMap((c) => c.selecteur.split(",").map((x) => x.trim())))];
let statiqueFait = !statiques.length;

for (const p of pages) {
  const page = await contexte.newPage();
  await page.goto(base + (BASEPATH || "") + p, { waitUntil: "networkidle" }).catch(() => {});
  // Laisser les apparitions au défilement se poser. Un élément mesuré à mi-fondu
  // n'a pas la couleur qu'il aura : on déroule la page, on remonte, on attend les
  // animations. Sans ça le contraste se mesure sur un état transitoire.
  await page.evaluate(async () => {
    const h = document.body.scrollHeight;
    for (let y = 0; y < h; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 600));
    await Promise.all(document.getAnimations().map((a) => a.finished.catch(() => {})));
  }).catch(() => {});
  const constats = await page.evaluate(evalueDansLaPage, compiles);
  for (const c of constats) (c.nonConcluant ? nonConcluants : findings).push({ page: p, ...c });
  if (!statiqueFait) {
    const recolte = await page.evaluate(recolteDansLaPage, proprietes);
    const r = evalueLesValeurs(compiles, recolte);
    for (const c of r.constats) findings.push({ page: "(feuille de style)", ...c });
    attentes.push(...r.attentes);
    statiqueFait = true;
  }
  await page.close();
}

// ── Les scènes : mesurer dans un ÉTAT, pas au repos ─────────────────────────
// Une règle comme FORM-R24 ne mesure RIEN sur une page tranquille : aucun champ
// n'est en erreur tant que personne n'a soumis. Mesurer au repos et conclure
// « rien à signaler » serait la façon la plus polie de ne pas auditer.
// Rejeu × REJEUX et unanimité (§ 11.5) : un constat interactif qui ne se
// reproduit pas à l'identique n'est pas un constat, c'est un non concluant.
const parScene = {};
for (const c of compiles) if (!c.statique && c.scene && c.scene !== "repos") (parScene[c.scene] ||= []).push(c);
const injouables = [];
for (const [scene, lot] of Object.entries(parScene)) {
  if (!SCENES[scene]) {
    manques.push({ id: lot.map((c) => c.id).join(", "), raison: `scène absente de la liste fermée : ${scene}`, texte: scene });
    continue;
  }
  for (const chemin of pages) {
    const rejeux = [];
    let note = "";
    for (let k = 0; k < REJEUX; k++) {
      const page = await contexte.newPage();
      await page.goto(base + (BASEPATH || "") + chemin, { waitUntil: "networkidle" }).catch(() => {});
      const j = await joue(page, scene);
      note = j.note;
      if (!j.jouee) { await page.close(); rejeux.push(null); continue; }
      let r = [];
      if (scene === "tabulation") {
        for (let i = 0; i < (j.parcourt || 0); i++) {
          await page.keyboard.press("Tab");
          r.push(...await page.evaluate(evalueDansLaPage, lot));
        }
      } else r = await page.evaluate(evalueDansLaPage, lot);
      await page.close();
      rejeux.push(r);
    }
    if (rejeux.some((r) => r === null)) { injouables.push({ scene, page: chemin, note }); continue; }
    const cles = rejeux.map((r) => JSON.stringify(r.map((x) => `${x.regle}|${x.motif}`).sort()));
    if (!cles.every((c) => c === cles[0])) {
      for (const c of rejeux[0])
        nonConcluants.push({ page: chemin, regle: c.regle, motif: `${REJEUX} rejeux divergents dans la scène « ${scene} »`, detail: c.detail });
      continue;
    }
    for (const c of rejeux[0]) findings.push({ page: `${chemin} · scène ${scene}`, ...c });
  }
}
await navigateur.close();
serveur.close();

// ── 5. Sortie ───────────────────────────────────────────────────────────────
if (JSON_OUT) {
  console.log(JSON.stringify({ pages: pages.length, criteres: compiles.length, manques, attentes, injouables, nonConcluants, findings }, null, 2));
  process.exit(manques.length ? 1 : 0);
}

console.log(`\nMoteur piloté par le corpus — ${compiles.length} critère(s) lus dans la doctrine, ${pages.length} page(s).\n`);
for (const c of compiles) console.log(`  ${c.id.padEnd(20)} ${criteres.find((x) => x.id === c.id).critere}`);
const parRegle = {};
for (const f of findings) (parRegle[f.regle] ||= []).push(f);
console.log("");
for (const [r, lot] of Object.entries(parRegle)) {
  console.log(`✗ ${r} — ${lot.length} occurrence(s)`);
  for (const f of lot.slice(0, 6)) console.log(`    ${f.page}  ${f.motif}  · ${f.detail}`);
  if (lot.length > 6) console.log(`    … ${lot.length - 6} de plus`);
}
if (!findings.length) console.log("✓ aucun écart sur les critères lus dans le corpus.");
// Un jeu de tokens vide n'est PAS une conformité : c'est une donnée que le client
// n'a pas encore déclarée (loi 4.18). Le taire ferait lire « rien à signaler ».
if (nonConcluants.length) {
  console.log("\nNON CONCLUANTS — la mesure existe, la valeur n'a pas pu être établie :");
  const par = {};
  for (const c of nonConcluants) par[`${c.regle} — ${c.motif}`] = (par[`${c.regle} — ${c.motif}`] || 0) + 1;
  for (const [k, n] of Object.entries(par)) console.log(`  ${n} × ${k}`);
}
// Une scène injouable n'est PAS une conformité : c'est une mesure qui n'a pas eu
// lieu, et le rapport doit pouvoir le dire (page sans formulaire, sans focusable…).
if (injouables.length) {
  console.log("\nSCÈNES INJOUABLES — la mesure n'a pas eu lieu :");
  const par = {};
  for (const i of injouables) par[`${i.scene} — ${i.note}`] = (par[`${i.scene} — ${i.note}`] || 0) + 1;
  for (const [k, n] of Object.entries(par)) console.log(`  ${n} page(s) · ${k}`);
}
if (attentes.length) {
  console.log("\nEN ATTENTE DE DÉCLARATION — ni conforme, ni en écart :");
  for (const a of attentes) console.log(`  ${a.regle} — ${a.motif} · ${a.examinees} déclaration(s) examinée(s)`);
}
if (manques.length) {
  console.error(`\n✗ ${manques.length} critère(s) NON COMPILÉ(S) — le moteur ne devine pas :`);
  for (const m of manques) console.error(`    ${m.id} : ${m.raison} — « ${m.texte} »`);
  process.exit(1);
}
