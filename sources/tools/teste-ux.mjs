// Les prédicats UX mordent-ils ? Cas d'épreuve à verdict connu.
import { createRequire } from "node:module";
import { compile, evalueDansLaPage } from "./criteres-grammaire.mjs";
let chromium;
try { ({ chromium } = createRequire(import.meta.url)("playwright")); }
catch { console.error("✗ teste-ux : playwright introuvable — `npm i -D playwright && npx playwright install chromium`."); process.exit(2); }
const R = {
  "INTERACTION-R23": 'chaque("button,a[href],[role=button],input[type=button],input[type=submit]") nomme()',
  "INTERACTION-R08": 'chaque("input:not([type=hidden]):not([type=button]):not([type=submit]),select,textarea") etiquete_visible()',
  "FORM-R05":        `compte("[tabindex]:not([tabindex='0']):not([tabindex='-1'])") == 0`,
  "INTERACTION-R10": 'compte("div[onclick],span[onclick],li[onclick],p[onclick],td[onclick]") == 0',
};
const m = [];
const prog = Object.entries(R).map(([id, critere]) => compile({ id, critere }, m));
if (m.length) { console.error("compilation :", m); process.exit(1); }
const CAS = [
  ["R23 · bouton avec texte",            '<button>Envoyer</button>', false],
  ["R23 · bouton icône nu",              '<button><svg></svg></button>', true],
  ["R23 · bouton icône + aria-label",    '<button aria-label="Fermer"><svg></svg></button>', false],
  ["R23 · aria-labelledby valide",       '<span id="t">Fermer</span><button aria-labelledby="t"><svg></svg></button>', false],
  ["R23 · aria-labelledby mort",         '<button aria-labelledby="absent"><svg></svg></button>', true],
  ["R23 · lien image avec alt",          '<a href="#"><img src="x" alt="Accueil"></a>', false],
  ["R23 · lien image sans alt",          '<a href="#"><img src="x" alt=""></a>', true],
  ["R08 · label for=",                   '<label for="a">Nom</label><input id="a">', false],
  ["R08 · label englobant",              '<label>Nom <input></label>', false],
  ["R08 · placeholder seul",             '<input placeholder="Nom">', true],
  ["R08 · aria-label seul (invisible)",  '<input aria-label="Nom">', true],
  ["R08 · label vide",                   '<label for="a"></label><input id="a">', true],
  ["R08 · select étiqueté",              '<label for="s">Pays</label><select id="s"><option>FR</option></select>', false],
  ["R05 · tabindex 0 et -1",             '<div tabindex="0">a</div><div tabindex="-1">b</div>', false],
  ["R05 · tabindex positif",             '<div tabindex="3">a</div>', true],
  ["R10 · div sans onclick",             '<div>carte</div>', false],
  ["R10 · div avec onclick",             '<div onclick="f()">carte</div>', true],
];
let nav;
try { nav = await chromium.launch(); }
catch { console.error("✗ teste-ux : aucun Chromium exécutable — `npx playwright install chromium`."); process.exit(2); }
const page = await (await nav.newContext()).newPage();
let ko = 0;
for (const [nom, html, attendu] of CAS) {
  await page.setContent(`<!doctype html><html lang="fr"><body>${html}</body></html>`);
  const r = await page.evaluate(evalueDansLaPage, prog);
  const cible = nom.slice(0, 3);
  const enFaute = r.some((x) => !x.nonConcluant && x.regle.includes(cible === "R23" ? "R23" : cible === "R08" ? "R08" : cible === "R05" ? "R05" : "R10"));
  const ok = enFaute === attendu;
  if (!ok) ko++;
  const d = r.find((x) => x.regle.includes(cible === "R23" ? "R23" : cible === "R08" ? "R08" : cible === "R05" ? "R05" : "R10"));
  console.log(`${ok ? "✓" : "✗"} ${nom.padEnd(38)} attendu ${attendu ? "EN FAUTE" : "conforme"} · obtenu ${enFaute ? "EN FAUTE" : "conforme"}${d ? "  (" + d.motif + ")" : ""}`);
}
await nav.close();
console.log(ko ? `\n✗ ${ko} cas en échec` : `\n✅ les ${CAS.length} cas d'épreuve tombent juste`);
process.exit(ko ? 1 : 0);
