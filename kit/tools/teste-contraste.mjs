// Le prédicat mord-il ? Cas d'épreuve à verdict connu, calculés à la main.
import { createRequire } from "node:module";
import { compile, evalueDansLaPage } from "./criteres-grammaire.mjs";
let chromium;
try { ({ chromium } = createRequire(import.meta.url)("playwright")); }
catch { console.error("✗ teste-contraste : playwright introuvable — `npm i -D playwright && npx playwright install chromium`."); process.exit(2); }
const CRIT = 'chaque("body *") contraste(color) >= 4.5 ou mesure(font-size) >= 24 et contraste(color) >= 3 ou mesure(font-size) >= 18.66 et mesure(font-weight) >= 700 et contraste(color) >= 3';
const m=[]; const prog=[compile({id:"COLOR-R09",critere:CRIT}, m)];
const CAS = [
  ["noir sur blanc — 21:1",                 '<p style="color:#000;background:#fff">x</p>', false],
  ["gris 767676 sur blanc — 4.54:1",        '<p style="color:#767676;background:#fff">x</p>', false],
  ["gris 777 sur blanc — 4.48:1",           '<p style="color:#777;background:#fff">x</p>', true],
  ["gris clair BBB sur blanc — 2.0:1",      '<p style="color:#bbb;background:#fff">x</p>', true],
  ["BBB mais 30px — seuil 3:1",             '<p style="color:#bbb;background:#fff;font-size:30px">x</p>', true],
  ["999 à 30px — 2.85:1, seuil 3:1",        '<p style="color:#999;background:#fff;font-size:30px">x</p>', true],
  ["949494 à 30px — 3.03:1, seuil 3:1",     '<p style="color:#949494;background:#fff;font-size:30px">x</p>', false],
  ["949494 à 20px gras — seuil 3:1",        '<p style="color:#949494;background:#fff;font-size:20px;font-weight:700">x</p>', false],
  ["949494 à 20px normal — seuil 4.5:1",    '<p style="color:#949494;background:#fff;font-size:20px">x</p>', true],
  ["fond hérité de l ancêtre",              '<div style="background:#000"><p style="color:#333">x</p></div>', true],
  ["texte semi-transparent sur blanc",      '<p style="color:rgba(0,0,0,.25);background:#fff">x</p>', true],
  ["opacité .85 sur un ancêtre",            '<div style="background:#fff"><div style="opacity:.85"><p style="color:#767676">x</p></div></div>', true],
  ["aucun fond déclaré — canevas blanc",    '<p style="color:#ccc">x</p>', true],
];
let nav;
try { nav = await chromium.launch(); }
catch { console.error("✗ teste-contraste : aucun Chromium exécutable — `npx playwright install chromium`.\n  Le contraste s'observe, il ne se déduit pas : ce harnais ne dégrade pas en silence."); process.exit(2); }
const page = await (await nav.newContext()).newPage();
let ko = 0;
for (const [nom, html, attenduEnFaute] of CAS) {
  await page.setContent(`<!doctype html><html><body style="margin:0">${html}</body></html>`);
  const r = await page.evaluate(evalueDansLaPage, prog);
  const enFaute = r.some((x) => !x.nonConcluant);
  const ok = enFaute === attenduEnFaute;
  if (!ok) ko++;
  console.log(`${ok ? "✓" : "✗"} ${nom.padEnd(42)} attendu ${attenduEnFaute ? "EN FAUTE" : "conforme"} · obtenu ${enFaute ? "EN FAUTE" : "conforme"}${r[0]?.motif ? "  (" + r[0].motif + ")" : ""}`);
}
await nav.close();
console.log(ko ? `\n✗ ${ko} cas d'épreuve en échec` : "\n✅ les 13 cas d'épreuve tombent juste");
process.exit(ko ? 1 : 0);
