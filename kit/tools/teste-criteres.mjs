#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// Le test de non-régression du Lot 1 — la règle a-t-elle vraiment quitté le code ?
//
// Deux moteurs, un seul DOM :
//   A. `controlesDansLaPage` de `tools/verifie-rendu.mjs` — les règles EN DUR ;
//   B. l'évaluateur de `tools/criteres-grammaire.mjs` piloté par les `CRITERE:`
//      lus dans `apps/site/content/doctrine/*.json` — le corpus.
// Ils tournent sur les mêmes pages construites. Leur sortie doit coïncider.
//
//   Identique  → la règle vit dans le corpus, le code n'en est plus dépositaire.
//   Divergente → soit le CRITERE dit autre chose que le code, soit le code
//                disait autre chose que la règle. Les deux sont des TROUVAILLES.
//
// ── Portée déclarée (aucune couverture n'est suggérée au-delà) ───────────────
// L'instrument ici est **jsdom**, pas Chromium : cette machine n'a pas de
// navigateur. jsdom ne fait pas de mise en page. Le test vaut donc pour les
// critères qui ne dépendent QUE de la structure du document — les trois posés
// à ce jour. Tout critère mesurant une géométrie ou un style calculé
// (`mesure()`, `contraste()`) est HORS de portée de ce harnais et doit passer
// par `execute-criteres.mjs` sous Chromium. Le rapport le redit à chaque
// exécution : un plafond silencieux ferait lire « tout est couvert ».
//
// Usage : node tools/teste-criteres.mjs [--out <dir>]
// ─────────────────────────────────────────────────────────────────────────────
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { litLeCorpus, compile, evalueDansLaPage } from "./criteres-grammaire.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const require_ = createRequire(import.meta.url);
const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? process.argv[i + 1] : d; };
const OUT = join(ROOT, arg("out", "apps/site/out"));

let JSDOM;
try { ({ JSDOM } = require_("jsdom")); }
catch { console.error("✗ teste-criteres : jsdom introuvable (npm i -D jsdom)."); process.exit(2); }
if (!existsSync(OUT)) { console.error(`✗ teste-criteres : ${relative(ROOT, OUT)} n'existe pas — construire le site d'abord.`); process.exit(2); }

// ── A. Les contrôles en dur, prélevés dans verifie-rendu.mjs ────────────────
// On ne les recopie pas : on prend le texte de la source. Une divergence entre
// la copie et l'original serait la pire des non-régressions.
const src = readFileSync(join(ROOT, "tools/verifie-rendu.mjs"), "utf8");
const debut = src.indexOf("function controlesDansLaPage()");
// Fin par équilibrage des accolades depuis la première : chercher le prochain
// « \nfunction » couperait au milieu si un commentaire en contenait un.
let fin = -1;
if (debut >= 0) {
  let n = 0;
  for (let i = src.indexOf("{", debut); i < src.length; i++) {
    if (src[i] === "{") n++;
    else if (src[i] === "}" && --n === 0) { fin = i + 1; break; }
  }
}
if (debut < 0 || fin < 0) { console.error("✗ teste-criteres : `controlesDansLaPage` introuvable dans verifie-rendu.mjs — le prélèvement doit être revu."); process.exit(2); }
const SOURCE_A = src.slice(debut, fin);

// ── B. Le corpus ────────────────────────────────────────────────────────────
const manques = [];
const lus = litLeCorpus(join(ROOT, "apps/site/content/doctrine"));
const programme = lus.map((c) => compile(c, manques)).filter(Boolean);
if (manques.length) {
  console.error("✗ critère(s) non compilé(s) — le moteur ne devine pas :");
  for (const m of manques) console.error(`    ${m.id} : ${m.raison} — « ${m.texte} »`);
  process.exit(1);
}

// ── La correspondance symptôme → règle, DÉCLARÉE ────────────────────────────
// Le code nommait des symptômes (« titre-absent »), le corpus nomme des règles.
// Deux symptômes peuvent tomber sous une seule règle : c'est le cas de R06, qui
// dit « exactement un » et absorbe donc l'absence ET le doublon.
// ── Divergences ASSUMÉES — même mécanique que `fraicheur.derives.json` ──────
// Une divergence déclarée ici ne fait pas échouer le harnais, mais elle reste
// IMPRIMÉE à chaque exécution : on ne la fait pas taire, on la reconnaît. Toute
// divergence absente de cette liste échoue. Résorber = corriger le CRITERE (ou
// le code) et supprimer l'entrée.
const DIVERGENCES_ASSUMEES = [
  {
    cle: "/épreuve/invalide-groupe|ACCESSIBILITY-R18|input#1",
    cote: "corpus",
    motif:
      "Le code remonte au porteur du message avec closest() ; le CRITERE, écrit avec " +
      "porte(), n'interroge que l'élément. Corriger demanderait le prédicat " +
      "porte_ou_ascendant(attr) — arbitré le 2026-07-31 : on ne l'ajoute pas. " +
      "R18 reste donc partiellement automatisée (cf. LOT1 § 6.3).",
  },
];

const CORRESPOND = {
  "titre-absent": "TYPOGRAPHY-R06",
  "titre-duplique": "TYPOGRAPHY-R06",
  "titre-saute": "TYPOGRAPHY-R07",
  "message-orphelin": "ACCESSIBILITY-R17",
  "erreur-sans-message": "ACCESSIBILITY-R18",
};
// Les motifs sont rédigés différemment de part et d'autre. On compare des
// OCCURRENCES, pas des phrases : chaque règle déclare comment identifier la
// sienne. Toute normalisation est écrite ici, en clair, et nulle part ailleurs.
const OCCURRENCE = {
  // R06 : les deux moteurs comptent les h1. L'occurrence, c'est le compte.
  "TYPOGRAPHY-R06": {
    a: (f) => (f.regle === "titre-absent" ? "0" : String(parseInt(f.motif, 10))),
    b: (f) => String(parseInt(f.motif, 10)),
  },
  // R07 : l'occurrence, c'est le saut lui-même (« h2 → h4 »), rédigé à l'identique
  // des deux côtés. Le rang distingue deux sauts identiques sur une même page.
  "TYPOGRAPHY-R07": { a: (f) => f.motif, b: (f) => f.motif },
  // R17 : l'occurrence, c'est l'identifiant mort désigné — les deux moteurs
  // le rédigent à l'identique (`balise attribut="id"`).
  "ACCESSIBILITY-R17": { a: (f) => f.motif, b: (f) => f.motif },
  // R18 : l'occurrence, c'est l'élément fautif. Aucun des deux moteurs n'exporte
  // d'identité de nœud ; le seul dénominateur commun est la balise. On la
  // complète par un RANG dans l'ordre du DOM (voir `indexe`) pour que deux
  // éléments fautifs de même balise sur une page ne se confondent pas.
  "ACCESSIBILITY-R18": { a: (f) => f.motif, b: (f) => f.balise },
};

/** Ajoute un rang par (page, règle, occurrence) : l'ordre d'émission est
 *  l'ordre du DOM des deux côtés, donc les rangs se correspondent. */
function indexe(cles) {
  const vu = new Map();
  return cles.map((k) => { const n = (vu.get(k) || 0) + 1; vu.set(k, n); return `${k}#${n}`; });
}

// ── Cas d'épreuve — le site construit ne déclenche presque rien ─────────────
// 90 pages saines ne prouvent pas que deux moteurs disent la même chose : elles
// prouvent qu'ils se taisent tous les deux. Ces cas forcent CHAQUE branche.
//
// Précaution (loi 4.16 — un corpus de test écrit par l'auditeur mesure
// l'auditeur) : ces fixtures ne décident PAS si un verdict est juste. Elles ne
// servent qu'à comparer deux implémentations sur la même entrée. Le juge reste
// la règle du corpus, pas ce fichier.
const EPREUVES = [
  ["/épreuve/h1-absent",        "<h2>Sans racine</h2>"],
  ["/épreuve/h1-unique",        "<h1>Le sujet</h1><h2>Une section</h2>"],
  ["/épreuve/h1-double",        "<h1>Premier</h1><h1>Second</h1>"],
  ["/épreuve/h1-triple",        "<h1>A</h1><h1>B</h1><h1>C</h1>"],
  ["/épreuve/titres-suite",     "<h1>a</h1><h2>b</h2><h3>c</h3><h2>d</h2><h3>e</h3>"],
  ["/épreuve/titres-saut",      "<h1>a</h1><h2>b</h2><h4>c</h4>"],
  ["/épreuve/titres-saut-2",    "<h1>a</h1><h3>b</h3><h2>c</h2><h5>d</h5>"],
  ["/épreuve/titres-saut-bis",  "<h1>a</h1><h2>b</h2><h4>c</h4><h2>d</h2><h4>e</h4>"],
  ["/épreuve/titres-descente",  "<h1>a</h1><h2>b</h2><h3>c</h3><h1>d</h1>"],
  ["/épreuve/idref-valide",     '<h1>t</h1><input aria-describedby="aide"><p id="aide">Format attendu</p>'],
  ["/épreuve/idref-mort",       '<h1>t</h1><input aria-describedby="fantome">'],
  ["/épreuve/idref-morts-2",    '<h1>t</h1><input aria-describedby="a b"><textarea aria-labelledby="c"></textarea>'],
  ["/épreuve/idref-mixte",      '<h1>t</h1><p id="ok">ok</p><input aria-describedby="ok absent">'],
  ["/épreuve/invalide-nu",      '<h1>t</h1><input aria-invalid="true">'],
  ["/épreuve/invalide-decrit",  '<h1>t</h1><input aria-invalid="true" aria-describedby="e"><p id="e">Requis</p>'],
  ["/épreuve/invalide-errmsg",  '<h1>t</h1><input aria-invalid="true" aria-errormessage="e"><p id="e">Requis</p>'],
  ["/épreuve/invalide-groupe",  '<h1>t</h1><fieldset aria-describedby="e"><input aria-invalid="true"></fieldset><p id="e">Requis</p>'],
];

// ── Les pages ───────────────────────────────────────────────────────────────
// HORS DOCTRINE : /docs (prototypes de test servis par le site) n'est pas une page du
// système — exclu et ANNONCÉ dans le résumé (jamais d'exclusion silencieuse).
// Même arbitrage que verifie-rendu.mjs (Aurélien, 2026-08-02).
const pages = [];
let horsDoctrine = 0;
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) { if (e !== "_next") walk(p); continue; }
    if (extname(p) !== ".html") continue;
    const brut = relative(OUT, p).replace(/\\/g, "/");
    if (brut === "docs" || brut.startsWith("docs/")) { horsDoctrine += 1; continue; }
    const rel = "/" + brut.replace(/index\.html$/, "").replace(/\.html$/, "");
    if (!/\/404\/?$/.test(rel)) pages.push({ url: rel.replace(/\/$/, "") || "/", fichier: p });
  }
})(OUT);
pages.sort((x, y) => x.url.localeCompare(y.url));
for (const [url, corps] of EPREUVES) pages.push({ url, html: `<!doctype html><html lang="fr"><body>${corps}</body></html>` });

// ── Exécution — même DOM, deux moteurs ──────────────────────────────────────
const moteurA = new Function(`return (${SOURCE_A})`)();
const A = [], B = [];
for (const { url, fichier, html } of pages) {
  const dom = new JSDOM(html ?? readFileSync(fichier, "utf8"), { pretendToBeVisual: false });
  const w = dom.window;
  // jsdom ne pose pas de boîtes. On rend la visibilité NEUTRE et identique pour
  // les deux moteurs : tout élément présent compte. C'est exactement pourquoi
  // les critères géométriques sont hors portée de ce harnais.
  // Talon de mise en page. Il doit être NEUTRE POUR LES DEUX moteurs, sinon le
  // harnais fabrique lui-même la divergence qu'il prétend mesurer : le contrôle
  // en dur ne consulte que `getClientRects`, l'évaluateur du corpus consulte
  // aussi le style calculé. `display:none` est le seul fait de mise en page que
  // jsdom connaisse vraiment — on le respecte, et rien de plus.
  w.Element.prototype.getClientRects = function () {
    for (let n = this; n && n.nodeType === 1; n = n.parentElement)
      if (w.getComputedStyle(n).display === "none") return [];
    return [{}];
  };
  w.Element.prototype.getBoundingClientRect = function () { return { width: 100, height: 100, top: 0, left: 0, right: 100, bottom: 100, x: 0, y: 0 }; };
  // jsdom sans `runScripts` n'exécute rien dans la page : les deux moteurs sont
  // compilés côté Node et lisent le DOM par les globales, qu'on branche ici sur
  // la fenêtre courante. Même DOM, mêmes globales, deux implémentations.
  const gd = globalThis.document, gs = globalThis.getComputedStyle;
  globalThis.document = w.document;
  globalThis.getComputedStyle = (el, ps) => w.getComputedStyle(el, ps);
  try {
    for (const c of moteurA().constats) if (CORRESPOND[c.regle]) A.push({ page: url, ...c });
    // Seules les règles qui ONT un contrôle en dur en face sont comparables. Une
    // règle que le corpus exécute et que le code n'a jamais connue (COLOR-R09…)
    // n'est pas une divergence : il n'y a rien à confronter.
    const comparables = new Set(Object.values(CORRESPOND));
    for (const c of evalueDansLaPage(programme))
      if (comparables.has(c.regle) && !c.nonConcluant) B.push({ page: url, ...c });
  } finally {
    globalThis.document = gd;
    globalThis.getComputedStyle = gs;
    w.close();
  }
}

const cle = (f, cote) => {
  const r = cote === "a" ? CORRESPOND[f.regle] : f.regle;
  return `${f.page}|${r}|${OCCURRENCE[r] ? OCCURRENCE[r][cote](f) : f.motif}`;
};
const setA = new Map(indexe(A.map((f) => cle(f, "a"))).map((k, i) => [k, A[i]]));
const setB = new Map(indexe(B.map((f) => cle(f, "b"))).map((k, i) => [k, B[i]]));
const seulA = [...setA.keys()].filter((k) => !setB.has(k));
const seulB = [...setB.keys()].filter((k) => !setA.has(k));

// ── Rapport ─────────────────────────────────────────────────────────────────
console.log(`\nNon-régression Lot 1 — ${pages.length - EPREUVES.length} page(s) construite(s) + ${EPREUVES.length} cas d'épreuve, instrument : jsdom (structure seule).`);
console.log(`Règles confrontées : ${[...new Set(Object.values(CORRESPOND))].join(", ")}`);
const horsPortee = programme.filter((p) => !new Set(Object.values(CORRESPOND)).has(p.id)).map((p) => p.id);
if (horsPortee.length) console.log(`Hors comparaison (aucun contrôle en dur en face) : ${horsPortee.join(", ")}`);
console.log(`Contrôles du code couverts : ${Object.keys(CORRESPOND).join(", ")}`);
console.log(`\n  code (verifie-rendu) : ${A.length} occurrence(s)`);
console.log(`  corpus (CRITERE)     : ${B.length} occurrence(s)`);
if (horsDoctrine) console.log(`  hors doctrine        : ${horsDoctrine} page(s) sous /docs exclue(s) (prototypes servis, pas des pages du système)`);

const hors = programme.filter((p) => (p.termes || []).some((t) => t.nom === "mesure" || t.nom === "contraste"));
if (hors.length) console.log(`\n  ⚠ hors portée de ce harnais (géométrie / style calculé) : ${hors.map((p) => p.id).join(", ")}`);

const assumee = new Map(DIVERGENCES_ASSUMEES.map((d) => [d.cle, d]));
const ecarts = [...seulA.map((k) => ({ k, cote: "code" })), ...seulB.map((k) => ({ k, cote: "corpus" }))];
const declarees = ecarts.filter((e) => assumee.get(e.k)?.cote === e.cote);
const nouvelles = ecarts.filter((e) => assumee.get(e.k)?.cote !== e.cote);
// Une entrée assumée qui ne correspond plus à rien est un mensonge résiduel.
const perimees = DIVERGENCES_ASSUMEES.filter((d) => !ecarts.some((e) => e.k === d.cle && e.cote === d.cote));

for (const e of declarees) {
  console.log(`\n⚠ divergence ASSUMÉE (${e.cote} seul) : ${e.k}`);
  console.log(`   ${assumee.get(e.k).motif}`);
}
for (const d of perimees) console.log(`\n! entrée assumée sans objet — à supprimer : ${d.cle}`);
for (const e of nouvelles) {
  const f = e.cote === "code" ? setA.get(e.k) : setB.get(e.k);
  console.log(`\n❌ divergence NOUVELLE (${e.cote} seul) : ${e.k}   · ${f.detail}`);
}
if (nouvelles.length || perimees.length) {
  console.error(`\n❌ ${nouvelles.length} divergence(s) non déclarée(s), ${perimees.length} entrée(s) sans objet — à instruire, pas à masquer.`);
  process.exit(1);
}
console.log(`\n✅ Code et corpus s'accordent sur ${[...new Set(Object.values(CORRESPOND))].length} règles${declarees.length ? ` (${declarees.length} divergence assumée, imprimée ci-dessus)` : ""}.`);
process.exit(0);
