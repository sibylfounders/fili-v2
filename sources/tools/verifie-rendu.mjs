#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// VÉRIFICATEUR DE RENDU — la seule garde qui voie le RÉSULTAT.
//
// Les autres gardes lisent l'intention (la source). Celle-ci ouvre les pages
// construites dans un Chromium sans tête et interroge le DOM CALCULÉ. C'est la
// seule façon de voir ce qu'aucune lecture de source ne dit :
//   · un anneau de focus qui n'est pas celui du système (constat du 2026-07-30 :
//     la page d'accueil portait l'anneau du navigateur — invisible en source) ;
//   · un contraste insuffisant une fois la cascade résolue ;
//   · une cible tactile réellement trop petite après mise en page ;
//   · une hiérarchie de titres cassée par la composition des morceaux.
//
// L'INVENTAIRE SE DÉRIVE : les pages viennent du dossier construit, jamais d'une
// liste tenue à la main. Une page créée demain est vérifiée le jour où elle est
// construite, sans que personne ne l'inscrive nulle part.
//
// Usage :
//   node tools/verifie-rendu.mjs [--strict] [--adopte] [--json] [--focus N] [--out <dir>]
//
// Prérequis (aucune analyse dégradée silencieuse — le harnais échoue en le disant) :
//   npm i -D playwright && npx playwright install chromium
// ─────────────────────────────────────────────────────────────────────────────
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";
import { createRequire } from "node:module";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const require_ = createRequire(import.meta.url);
const STRICT = process.argv.includes("--strict");
const ADOPTE = process.argv.includes("--adopte");
const JSON_OUT = process.argv.includes("--json"); // sortie lisible par l'auto-test
const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? process.argv[i + 1] : d; };
const OUT = join(ROOT, arg("out", "apps/site/out"));
const BASE_PATH = join(ROOT, "tools/verifie-rendu.baseline.json");
// Plafond de balayage des éléments focusables par page. Il existe pour une raison de
// temps, et il est ANNONCÉ dans le rapport : un plafond silencieux ferait lire
// « tout est couvert » là où une partie ne l'est pas.
const MAX_FOCUS = Number(arg("focus", "14"));

// ── Prérequis ────────────────────────────────────────────────────────────────
let chromium;
try { ({ chromium } = require_("playwright")); }
catch {
  console.error("✗ verifie-rendu : playwright introuvable — le rendu ne se déduit pas, il s'observe.");
  console.error("  Installer : npm i -D playwright && npx playwright install chromium");
  process.exit(2);
}
if (!existsSync(OUT)) {
  console.error(`✗ verifie-rendu : ${relative(ROOT, OUT)} n'existe pas — construire le site d'abord (npm run build --workspace @fili/site).`);
  process.exit(2);
}

// ── Inventaire DÉRIVÉ du dossier construit ───────────────────────────────────
// HORS DOCTRINE : le sous-arbre /docs (prototypes et archives de test servis par le site)
// n'est PAS une page du système — il est exclu du balayage, et cette exclusion est
// ANNONCÉE dans chaque rapport ci-dessous : une exclusion silencieuse ferait lire
// « tout est couvert » là où une partie ne l'est pas (même principe que le plafond
// --focus). Arbitrage d'Aurélien, 2026-08-02.
const pages = [];
const horsDoctrine = [];
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) { if (e !== "_next") walk(p); }
    else if (e.endsWith(".html")) {
      const rel = relative(OUT, p).replace(/\\/g, "/");
      // Les pages d'erreur GÉNÉRÉES par Next (404.html / 404/index.html, idem 500) ne sont
      // pas des pages métier : les juger produisait du bruit (h1 générique, liens hors
      // inventaire) sans rien protéger — le comportement d'erreur du framework n'est pas
      // notre autorité.
      if (/^(404|500)(\.html|\/index\.html)$/.test(rel)) continue;
      if (rel === "docs" || rel.startsWith("docs/")) { horsDoctrine.push("/" + rel); continue; }
      pages.push("/" + rel.replace(/index\.html$/, "").replace(/\.html$/, ""));
    }
  }
})(OUT);
pages.sort();
horsDoctrine.sort();

// Le basePath n'est pas dans le dépôt : la CI l'injecte au build (configure-pages).
// On le DÉDUIT du HTML construit — sans ça, un balayage en CI servirait des pages
// sans CSS et jugerait un rendu qui n'existe pas. Une garde qui se trompe en silence
// est pire que pas de garde.
const racineHtml = existsSync(join(OUT, "index.html")) ? readFileSync(join(OUT, "index.html"), "utf8") : "";
const mBase = racineHtml.match(/["'](\/[^"']*?)\/_next\//);
const BASEPATH = mBase ? mBase[1] : "";

// Les chemins RÉELS servis (avec basePath) et l'ensemble normalisé pour les liens.
const norme = (u) => {
  let x = u.split("#")[0].split("?")[0];
  if (BASEPATH && x.startsWith(BASEPATH)) x = x.slice(BASEPATH.length) || "/";
  return x.length > 1 && x.endsWith("/") ? x.slice(0, -1) : x;
};
const pagesConnues = new Set(pages.map(norme));

// ── Serveur statique minimal (zéro dépendance) ───────────────────────────────
// file:// ne résout pas les chemins absolus (/_next/…) : sans serveur, aucune CSS
// ne serait chargée et TOUT le rendu serait faux — un harnais qui se trompe en
// silence est pire que pas de harnais.
const MIME = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".json": "application/json",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".woff2": "font/woff2", ".ico": "image/x-icon" };
const serveur = createServer((req, res) => {
  let url = decodeURIComponent(req.url.split("?")[0]);
  if (BASEPATH && url.startsWith(BASEPATH)) url = url.slice(BASEPATH.length) || "/";
  const essais = [join(OUT, url), join(OUT, url, "index.html"), join(OUT, url + ".html")];
  for (const f of essais) {
    if (existsSync(f) && statSync(f).isFile()) {
      res.writeHead(200, { "content-type": MIME[extname(f)] ?? "application/octet-stream" });
      res.end(readFileSync(f));
      return;
    }
  }
  res.writeHead(404); res.end("404");
});
const port = await new Promise((ok) => serveur.listen(0, "127.0.0.1", () => ok(serveur.address().port)));
const base = `http://127.0.0.1:${port}`;

// ── Les contrôles, exécutés DANS la page ─────────────────────────────────────
// Tout ce qui suit s'évalue dans le navigateur : ce sont des valeurs calculées,
// pas des intentions lues.
function controlesDansLaPage() {
  const out = [];
  const dit = (regle, motif, detail) => out.push({ regle, motif, detail });
  const gc = (el, p) => getComputedStyle(el).getPropertyValue(p).trim();
  const norm = (c) => c.replace(/\s+/g, "").toLowerCase();

  // Les crans de focus du système, lus sur la racine : le harnais ne connaît aucune
  // couleur en dur, il demande au thème ce qu'il attend.
  const racine = getComputedStyle(document.documentElement);
  const sonde = document.createElement("span");
  document.body.appendChild(sonde);
  const crans = new Set();
  for (const n of ["primary", "neutral", "danger", "success", "warning", "info"]) {
    const v = racine.getPropertyValue("--control-focus-" + n).trim();
    if (!v) continue;
    sonde.style.color = v; // laisse le navigateur résoudre color-mix()
    crans.add(norm(getComputedStyle(sonde).color));
  }
  sonde.remove();

  // 1. HIÉRARCHIE DE TITRES — un seul h1, aucun niveau sauté.
  const titres = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].filter((h) => h.getClientRects().length);
  const h1 = titres.filter((h) => h.tagName === "H1");
  if (h1.length === 0) dit("titre-absent", "aucun h1", "toute page nomme son sujet une fois");
  if (h1.length > 1) dit("titre-duplique", h1.length + " h1", h1.map((h) => h.textContent.trim().slice(0, 30)).join(" | "));
  let precedent = 0;
  for (const h of titres) {
    const n = Number(h.tagName[1]);
    if (precedent && n > precedent + 1) dit("titre-saute", "h" + precedent + " → h" + n, (h.textContent || "").trim().slice(0, 40));
    precedent = n;
  }

  // 2. (retiré le 2026-07-30) « dur-au-dom » : la détection des valeurs source appartient
  // au validateur AST (fili-check `style-en-dur` / verifie-tokens `style-inline-en-dur`),
  // qui lit l'INTENTION avec ses exceptions justifiées. La redite au DOM calculé signalait
  // des styles légitimes posés par le kit lui-même (géométrie d'animation, mesures runtime,
  // `0px`) : du bruit, pas une garde. Ce harnais ne garde que ce que SEUL le rendu voit.

  // 3. CIBLE TACTILE — plancher de 24px (TOUCH, WCAG 2.5.8), mesuré après mise en page.
  const interactifs = [...document.querySelectorAll('a[href],button,input:not([type=hidden]),select,textarea,[tabindex]:not([tabindex="-1"])')]
    .filter((el) => el.getClientRects().length && gc(el, "visibility") !== "hidden");
  for (const el of interactifs) {
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) continue;
    if (r.height < 24 && r.width < 24)
      dit("cible-trop-petite", Math.round(r.width) + "×" + Math.round(r.height), (el.textContent || el.getAttribute("aria-label") || el.tagName).trim().slice(0, 40));
  }

  // 3bis. MESSAGE ORPHELIN — un contrôle qui DÉSIGNE un message inexistant.
  // La chaîne de validation repose entièrement sur cette association : un `aria-describedby`
  // (ou `aria-labelledby`, ou `aria-errormessage`) qui pointe dans le vide fait disparaître
  // le message pour la technologie d'assistance sans rien changer à l'écran — le défaut le
  // plus silencieux de la chaîne. Seul le rendu voit l'identifiant FINAL : les identifiants
  // sont générés (React.useId), aucune lecture de source ne peut les confronter.
  for (const el of document.querySelectorAll("[aria-describedby],[aria-labelledby],[aria-errormessage]")) {
    for (const attribut of ["aria-describedby", "aria-labelledby", "aria-errormessage"]) {
      const brut = el.getAttribute(attribut);
      if (!brut) continue;
      for (const id of brut.split(/\s+/).filter(Boolean)) {
        if (document.getElementById(id)) continue;
        dit(
          "message-orphelin",
          el.tagName.toLowerCase() + " " + attribut + '="' + id + '"',
          "aucun élément ne porte cet identifiant — le message n'existe que pour l'œil",
        );
      }
    }
  }

  // 3ter. ARIA-INVALID SANS MESSAGE — une erreur annoncée qu'on ne peut pas lire.
  // `aria-invalid="true"` dit « cette valeur est refusée » ; sans message associé, il ne dit
  // pas POURQUOI (WCAG 3.3.1/3.3.3). Un groupe porte le sien sur son fieldset : on remonte.
  for (const el of document.querySelectorAll('[aria-invalid="true"]')) {
    const porteur = el.closest("[aria-describedby],[aria-errormessage]");
    if (!porteur) dit("erreur-sans-message", el.tagName.toLowerCase(), "aria-invalid posé sans message associé (aria-describedby)");
  }

  // 4. LIENS INTERNES — collectés ici, confrontés côté Node à l'inventaire construit.
  const liens = [];
  for (const a of document.querySelectorAll("a[href]")) {
    const h = a.getAttribute("href");
    if (!h || /^(#|mailto:|tel:|https?:|\/\/)/.test(h)) continue;
    liens.push({ href: h, texte: (a.textContent || "").trim().slice(0, 40) });
  }

  return { constats: out, focusables: interactifs.length, crans: [...crans], liens };
}

// Le focus se mesure au CLAVIER : :focus-visible ne s'applique pas de la même façon
// à un focus programmatique, et c'est précisément la pseudo-classe qu'on vérifie.
//
// L'INDICATEUR n'est pas forcément sur l'élément actif : Input pose volontairement son
// anneau sur son cadre — `[data-slot="input"]:has(input:focus-visible)` — pendant que le
// champ lui-même porte une outline TRANSPARENTE (le `outline-none` de Tailwind écrit
// `outline: 2px solid transparent`, qui n'indique rien). On inspecte donc l'élément actif
// PUIS ses ancêtres proches (le porteur du composant, 3 niveaux au plus), en ne comptant
// comme indicateur qu'une outline réellement VISIBLE : style ≠ none, largeur ≥ 1, couleur
// non transparente. Une ombre de repos (box-shadow) n'est jamais une preuve de focus —
// la fondation Focus/Bordure est une outline, tout le reste est hors système.
function mesureFocusDansLaPage() {
  const el = document.activeElement;
  if (!el || el === document.body) return null;
  const transparente = (c) => {
    const x = c.replace(/\s+/g, "").toLowerCase();
    if (x === "transparent") return true;
    const m = x.match(/^rgba?\(([^)]+)\)$/);
    if (!m) return false;
    const parts = m[1].split(",");
    return parts.length === 4 && parseFloat(parts[3]) === 0;
  };
  const anneauDe = (n) => {
    const s = getComputedStyle(n);
    if (s.outlineStyle === "none") return null;
    if ((parseFloat(s.outlineWidth) || 0) < 1) return null;
    if (transparente(s.outlineColor)) return null; // outline-none Tailwind = pas un indicateur
    return s.outlineColor.replace(/\s+/g, "").toLowerCase();
  };
  let couleur = null;
  let delegue = false;
  let n = el;
  for (let i = 0; n && n !== document.body && i < 4; i++, n = n.parentElement) {
    const c = anneauDe(n);
    if (c) { couleur = c; delegue = n !== el; break; }
  }
  return {
    balise: el.tagName.toLowerCase(),
    nom: (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 40),
    couleur,
    delegue,
  };
}

// ── Balayage ─────────────────────────────────────────────────────────────────
const navigateur = await chromium.launch();
const contexte = await navigateur.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
const findings = [];
let focusablesVus = 0, focusablesPlafonnes = 0;

for (const chemin of pages) {
  const page = await contexte.newPage();
  const erreurs = [];
  page.on("pageerror", (e) => erreurs.push(String(e.message).slice(0, 100)));
  try {
    await page.goto(base + BASEPATH + chemin, { waitUntil: "networkidle", timeout: 20000 });
  } catch (e) {
    findings.push({ page: chemin, regle: "page-injoignable", motif: String(e.message).split("\n")[0].slice(0, 80), detail: "" });
    await page.close();
    continue;
  }
  const { constats, focusables, crans, liens } = await page.evaluate(controlesDansLaPage);
  // LIEN MORT : une page peut être parfaite et pointer vers une page qui n'existe pas.
  // Le cas s'est produit — la Vue d'ensemble annonçait Chip et renvoyait vers un /md/chip
  // jamais généré (deux dérivations divergentes de « la liste des sujets »). Aucune
  // lecture de source ne le voit, et un balayage qui ne visite que les pages existantes
  // non plus : il faut confronter les liens à l'inventaire.
  for (const l of liens ?? []) {
    const cible = norme(l.href.startsWith("/") ? l.href : new URL(l.href, "http://x" + chemin).pathname);
    if (!pagesConnues.has(cible) && !/\.[a-z0-9]{2,5}$/i.test(cible))
      findings.push({ page: chemin, regle: "lien-mort", motif: l.href, detail: `« ${l.texte} » — aucune page construite à cette adresse` });
    // LIEN HORS BASEPATH : la page existe, l'adresse écrite ne la sert pas. `norme()` retire
    // le préfixe pour comparer à l'inventaire — ce faisant, elle acceptait indifféremment
    // /fili/md et /md, et laissait passer précisément le défaut du 2026-07-30 : trois
    // destinations de la page d'accueil et toute la grille de doctrine écrites en `<a href>`
    // nu, donc sans le préfixe que next/link pose seul. Vert en local (basePath vide),
    // mortes une fois publiées. Le rendu est le seul endroit qui voie l'adresse FINALE.
    if (BASEPATH && l.href.startsWith("/") && !l.href.startsWith(BASEPATH + "/") && l.href !== BASEPATH)
      findings.push({
        page: chemin,
        regle: "lien-hors-basepath",
        motif: l.href,
        detail: `« ${l.texte} » — attendu sous ${BASEPATH}/ ; composer next/link (Link/Nav.Link/Card.TitleLink asChild) plutôt qu'un <a href> nu`,
      });
  }
  for (const c of constats) findings.push({ page: chemin, ...c });
  for (const e of erreurs) findings.push({ page: chemin, regle: "erreur-javascript", motif: e, detail: "" });

  // FOCUS : on tabule pour de vrai, jusqu'au plafond annoncé.
  const aVerifier = Math.min(focusables, MAX_FOCUS);
  focusablesVus += aVerifier;
  focusablesPlafonnes += Math.max(0, focusables - MAX_FOCUS);
  const vus = new Set();
  for (let i = 0; i < aVerifier; i++) {
    await page.keyboard.press("Tab");
    const f = await page.evaluate(mesureFocusDansLaPage);
    if (!f) break;
    const identite = `${f.balise}|${f.nom}`;
    if (vus.has(identite)) continue;
    vus.add(identite);
    if (!f.couleur) {
      findings.push({ page: chemin, regle: "focus-invisible", motif: `${f.balise} « ${f.nom} »`, detail: "aucun indicateur au clavier (WCAG 2.4.7) — ni sur l'élément, ni sur le porteur du composant" });
    } else if (crans.length && !crans.includes(f.couleur)) {
      findings.push({ page: chemin, regle: "focus-hors-systeme", motif: `${f.balise} « ${f.nom} »`, detail: `anneau ${f.couleur}${f.delegue ? " (porté par un ancêtre)" : ""} — hors des crans control.focus-* (probablement celui du navigateur)` });
    }
  }
  await page.close();
}
await navigateur.close();
serveur.close();

// ── Constat versionné (même mécanique que les autres gardes) ─────────────────
const cle = (f) => `${f.page}|${f.regle}|${f.motif}`;
const baseline = existsSync(BASE_PATH) ? JSON.parse(readFileSync(BASE_PATH, "utf8")) : { entries: [] };
const connues = new Map(baseline.entries.map((e) => [`${e.page}|${e.regle}|${e.motif}`, e]));
const compte = new Map();
for (const f of findings) compte.set(cle(f), (compte.get(cle(f)) ?? 0) + 1);
const nouveaux = [], augmentes = [], reduits = [], disparus = [];
for (const [k, n] of compte) {
  const b = connues.get(k);
  if (!b) nouveaux.push({ k, n });
  else if (n > b.occurrences) augmentes.push({ k, avant: b.occurrences, apres: n });
  else if (n < b.occurrences) reduits.push({ k, avant: b.occurrences, apres: n });
}
for (const [k, b] of connues) if (!compte.has(k)) disparus.push({ k, avant: b.occurrences });

if (JSON_OUT) {
  console.log(JSON.stringify({ pages: pages.length, horsDoctrine, findings }, null, 2));
  process.exit(0);
}

const parRegle = {};
for (const f of findings) (parRegle[f.regle] ??= []).push(f);

console.log(`\nVérificateur de rendu — ${pages.length} page(s) construite(s), ${findings.length} constat(s)`);
if (horsDoctrine.length)
  console.log(`  hors doctrine : ${horsDoctrine.length} page(s) sous /docs exclue(s) du balayage (prototypes servis, pas des pages du système)`);
console.log(`  focus éprouvé au clavier sur ${focusablesVus} élément(s)` +
  (focusablesPlafonnes ? ` · ${focusablesPlafonnes} NON éprouvé(s) (plafond --focus ${MAX_FOCUS} par page)` : ""));
// Une garde inerte doit se DIRE : sans basePath, `lien-hors-basepath` ne peut rien voir, et
// un vert local ne prouve alors rien sur le site publié (c'est exactement ce qui a laissé
// passer les liens morts du 2026-07-30).
console.log(
  BASEPATH
    ? `  basePath « ${BASEPATH} » détecté — les liens internes sont confrontés à l'adresse FINALE`
    : "  basePath vide (build local) — la règle « lien-hors-basepath » est INERTE ici ; c'est la CI qui la joue",
);
for (const [regle, fs] of Object.entries(parRegle)) {
  console.log(`\n■ ${regle} — ${fs.length}`);
  for (const f of fs.slice(0, 12)) console.log(`   ${f.page}  ${f.motif}${f.detail ? " — " + f.detail : ""}`);
  if (fs.length > 12) console.log(`   … ${fs.length - 12} autre(s)`);
}

if (ADOPTE) {
  if (baseline.entries.length) {
    console.error("\n✗ le constat d'adoption a déjà eu lieu — un écart nouveau se corrige ou entre par édition manuelle justifiée.");
    process.exit(1);
  }
  const parCle = new Map();
  for (const f of findings) {
    const k = cle(f);
    if (!parCle.has(k)) parCle.set(k, { page: f.page, regle: f.regle, motif: f.motif, occurrences: 0,
      justification: "constat d'adoption du harnais de rendu (2026-07-30, cf. DECISIONS.md) — antérieur à la garde, aucune augmentation tolérée",
      vague: "vague 10 (rendu)" });
    parCle.get(k).occurrences++;
  }
  writeFileSync(BASE_PATH, JSON.stringify({
    note: "Constat de conformité au RENDU — versionné. Tout écart NOUVEAU ou toute AUGMENTATION échoue en --strict, y compris sur une page construite après ce constat. --adopte ne se rejoue pas.",
    creee: "2026-07-30 — première mise en service du harnais",
    entries: [...parCle.values()].sort((a, b) => a.page.localeCompare(b.page) || a.regle.localeCompare(b.regle) || a.motif.localeCompare(b.motif)),
  }, null, 2) + "\n");
  console.log(`\nConstat écrit : ${parCle.size} entrée(s), ${findings.length} occurrence(s).`);
  process.exit(0);
}

console.log(`\n  constat : ${baseline.entries.length} entrée(s) connue(s) — à résorber, jamais à augmenter`);
if (nouveaux.length) {
  console.log(`\n■ NOUVEAUX écarts hors constat — ${nouveaux.length} :`);
  for (const { k, n } of nouveaux.slice(0, 25)) console.log(`   ${k} ×${n}`);
}
if (augmentes.length) {
  console.log(`\n■ AUGMENTATIONS vs constat — ${augmentes.length} :`);
  for (const { k, avant, apres } of augmentes) console.log(`   ${k} : ${avant} → ${apres}`);
}
if (reduits.length || disparus.length)
  console.log(`\n○ Conformité en hausse : ${reduits.length} réduit(s), ${disparus.length} éteint(s) — mettre le constat à jour.`);

if (STRICT && (nouveaux.length || augmentes.length)) {
  console.error(`\n❌ --strict : ${nouveaux.length} nouveau(x) · ${augmentes.length} augmentation(s) au rendu.`);
  process.exit(1);
}
console.log(STRICT ? "\n✅ Strict : aucun écart nouveau au rendu." : "\n(mode rapport — `--strict` pour bloquer)");
