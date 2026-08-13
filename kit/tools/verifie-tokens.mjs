#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// VÉRIFICATEUR DE TOKENS v2 — le kit ET ses consommateurs du monorepo.
//
// PORTÉE (2026-07-30) : la racine n'est plus codée en dur. Elle est DÉCLARÉE dans
// RACINES, avec des exclusions nommées et justifiées une par une (même grammaire que
// tools/fili-check.config.monorepo.json). Un fichier créé demain sous une racine
// déclarée est donc couvert le jour de sa création — la propriété « pages à venir »
// ne tient qu'à ça. La version précédente ne regardait que packages/react/src : le
// site, premier consommateur du kit, échappait entièrement à la garde (constat de
// l'audit de cohérence du 2026-07-30 — page d'accueil intégralement en valeurs dures).
//
// Détections :
//   1. var(--x) INCONNUE. Une variable est connue si elle est : un token global
//      généré (tokens.css), OU déclarée dans le MÊME DOSSIER de composant (mécanique
//      locale — une var locale de delete-button ne valide PAS le même nom ailleurs),
//      OU listée dans PARTAGEES (partage inter-composants explicite et justifié).
//   2. fallback var(--x, valeur) : masque un mauvais nom (inconnue) ou fige un token.
//   3. classes Tailwind de la palette par défaut (tsx).
//   4. valeurs en dur dans les .css : couleurs (hex/rgb/hsl), dimensions px/rem/em,
//      durées ms/s, z-index numériques.
//   5. valeurs arbitraires Tailwind ([13px]…) et rounded-full (tsx).
//
// Trois niveaux de traitement :
//   - EXCEPTIONS (verifie-tokens.exceptions.json) : mécanique/géométrie NOMMÉE et classée ;
//   - PÉRIMÈTRE STRICT (tranche pilote + lib) : zéro écart, la baseline n'y a pas cours ;
//   - BASELINE (verifie-tokens.baseline.json) : la dette CONNUE hors pilote, versionnée
//     (fichier, type, motif, occurrences, justification, vague). Le mode --strict échoue
//     sur tout écart NOUVEAU, toute AUGMENTATION d'occurrences, tout écart du périmètre
//     strict. Une RÉDUCTION est signalée (et acceptée par --update-baseline, qui ne fait
//     que réduire ou supprimer — jamais ajouter : un nouvel écart est une décision, pas
//     une mise à jour).
//
// Usage : node tools/verifie-tokens.mjs [--strict] [--update-baseline]
//         node tools/verifie-tokens.mjs --adopte <étiquette de racine>   (usage unique)
// ─────────────────────────────────────────────────────────────────────────────
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// ── RACINES : ce qui est vérifié. Inclusives, exclusions justifiées une par une. ──
// `etiquette` préfixe la clé des constats. Elle est VIDE pour le kit : les clés
// historiques (baseline, exceptions, périmètre strict) restent valides telles quelles.
const RACINES = [
  {
    dir: "packages/react/src",
    etiquette: "",
    raison: "le kit lui-même — périmètre historique de la garde",
    exclure: [],
  },
  {
    dir: "apps/site/app",
    etiquette: "apps/site/app/",
    raison: "le site : premier consommateur du kit et vitrine de la doctrine — une page non conforme y contredit ce qu'elle documente",
    exclure: [
      { chemin: "ui", raison: "Atelier : les démonstrations posent VOLONTAIREMENT des valeurs (nuancier, règle graduée, aperçu redimensionnable) — montrer un token exige de l'afficher. Couvert par verifie-kit.py." },
      { chemin: "test", raison: "Pages de test internes (cas d'usage) — hors produit, jamais publiées en navigation." },
      { chemin: "exemples-manifeste.gen.tsx", raison: "Fichier de travail généré par verifie-exemples (gitignoré) — son contenu est celui du manifeste, déjà vérifié à la source." },
    ],
  },
];

const TOKENS_CSS = join(ROOT, "packages/tokens/dist/tokens.css");
const EXC_PATH = join(ROOT, "tools/verifie-tokens.exceptions.json");
const BASE_PATH = join(ROOT, "tools/verifie-tokens.baseline.json");
const STRICT = process.argv.includes("--strict");
const UPDATE = process.argv.includes("--update-baseline");
const INIT = process.argv.includes("--init-baseline"); // bootstrap UNIQUE de la dette pré-existante
// --adopte <étiquette> : constat UNIQUE de la dette d'une racine nouvellement déclarée.
const ADOPTE = (() => {
  const i = process.argv.indexOf("--adopte");
  return i !== -1 ? process.argv[i + 1] : null;
})();

// Périmètre strict = tranche pilote + couche partagée + entrée CSS.
const STRICT_SCOPE = [
  "components/button/", "components/compact-button/", "components/input/",
  "components/card/", "components/skeleton/", "components/nav/", "lib/", "styles.css",
];
// Partage inter-dossiers EXPLICITE (toute entrée doit être justifiée ici même) :
const PARTAGEES = new Set([
  // néant aujourd'hui — les mécaniques locales restent dans leur dossier.
]);

const exceptions = existsSync(EXC_PATH) ? JSON.parse(readFileSync(EXC_PATH, "utf8")) : [];
/**
 * Une exception porte sur un couple fichier + motif. Elle peut RESTREINDRE sa portée avec
 * `contexte` : une expression régulière confrontée au texte qui précède le motif, motif
 * compris (donc ancrable par `$`). C'est ce qui permet d'excepter « la durée nulle d'une
 * bascule de `visibility` » sans excepter « toute durée nulle du fichier » — une exception
 * sans périmètre est une wildcard, et une wildcard ne se relit pas. Sans `contexte`, la
 * portée reste le couple fichier + motif (toutes les entrées historiques).
 */
const excepted = (file, motif, portee = null) =>
  exceptions.find((e) => {
    if (!file.includes(e.file) || !motif.includes(e.motif)) return false;
    if (!e.contexte) return true;
    return portee != null && new RegExp(e.contexte).test(portee);
  });

// ── Variables connues : globales + locales PAR DOSSIER ───────────────────────
const globales = new Set();
for (const m of readFileSync(TOKENS_CSS, "utf8").matchAll(/--([\w-]+)\s*:/g)) globales.add(m[1]);

const files = [];
const sources = [];
for (const racine of RACINES) {
  const base = join(ROOT, racine.dir);
  if (!existsSync(base)) { console.error(`✗ racine déclarée introuvable : ${racine.dir}`); process.exit(1); }
  (function walk(dir) {
    for (const e of readdirSync(dir)) {
      const p = join(dir, e);
      const rel = relative(base, p);
      if (racine.exclure.some((x) => rel === x.chemin || rel.startsWith(x.chemin + "/"))) continue;
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.(tsx?|css)$/.test(e)) { files.push(p); sources.push([racine.etiquette + rel, readFileSync(p, "utf8")]); }
    }
  })(base);
}

// dossier → variables qui y sont déclarées (css `--x:` ou tsx `"--x"` posée en style/JS)
const localesParDossier = new Map();
for (const [file, src] of sources) {
  const dossier = file.includes("/") ? file.slice(0, file.lastIndexOf("/")) : ".";
  const set = localesParDossier.get(dossier) ?? new Set();
  for (const m of src.matchAll(/(--[\w-]+)\s*:/g)) set.add(m[1].slice(2));
  for (const m of src.matchAll(/["'](--[\w-]+)["']\s*[:,\]]/g)) set.add(m[1].slice(2));
  localesParDossier.set(dossier, set);
}
const connue = (name, file) => {
  if (globales.has(name) || PARTAGEES.has(name)) return true;
  const dossier = file.includes("/") ? file.slice(0, file.lastIndexOf("/")) : ".";
  return localesParDossier.get(dossier)?.has(name) ?? false;
};

// ── Balayage ─────────────────────────────────────────────────────────────────
const findings = [];
const push = (file, line, type, motif, detail = "", portee = null) => {
  const exc = excepted(file, motif, portee);
  findings.push({ file, line, type, motif, detail, exc: exc?.classe });
};

const PALETTE =
  /(?:^|[\s"'`:])((?:bg|text|border|ring|outline|divide|fill|stroke)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3})(?![\w-])/g;

for (const [file, src] of sources) {
  let dansCommentaire = false;
  src.split("\n").forEach((brut, i) => {
    const n = i + 1;
    // suivi des blocs /* … */ multilignes : on retire la partie commentée de la ligne
    let l = brut;
    if (dansCommentaire) {
      const fin = l.indexOf("*/");
      if (fin === -1) return;
      l = l.slice(fin + 2);
      dansCommentaire = false;
    }
    l = l.replace(/\/\*[^]*?\*\//g, "");
    const debut = l.indexOf("/*");
    if (debut !== -1) { l = l.slice(0, debut); dansCommentaire = true; }
    if (/^\s*\/\//.test(l) || !l.trim()) return;
    for (const m of l.matchAll(/var\(\s*--([\w-]+)\s*(?:,\s*([^)]+))?\)/g)) {
      const [, name, fb] = m;
      if (!connue(name, file))
        push(file, n, "var-inconnue", `--${name}`, fb ? `fallback « ${fb.trim()} » masque le mauvais nom ou la fuite de portée` : "");
      else if (fb && !fb.includes("var(") && !/transparent|inherit|none/.test(fb))
        push(file, n, "fallback-dupliquant", `--${name}`, `fallback « ${fb.trim()} » fige la valeur du token`);
    }
    if (file.endsWith(".tsx")) {
      for (const m of l.matchAll(PALETTE)) if (!m[1].includes("p-")) push(file, n, "palette-defaut", m[1]);
      for (const m of l.matchAll(/[\w-]+-\[(\d+(?:\.\d+)?(?:px|rem|em))\]/g)) push(file, n, "arbitraire", m[0]);
      if (/rounded-full/.test(l)) push(file, n, "rounded-full", "rounded-full", "préférer rounded-pill (token)");
      // Valeur en dur posée en STYLE INLINE (objet React) : `borderRadius: 10`,
      // `padding: "80px 24px"`. Aucune classe à lire — c'est exactement par là que la
      // page d'accueil échappait à toutes les gardes (audit 2026-07-30). Une propriété
      // dont la valeur est `var(--x)` ou une expression n'est PAS concernée : seule la
      // valeur littérale l'est.
      for (const m of l.matchAll(
        /\b(borderRadius|borderWidth|border|padding|paddingTop|paddingRight|paddingBottom|paddingLeft|margin|marginTop|marginRight|marginBottom|marginLeft|gap|rowGap|columnGap|fontSize|letterSpacing|width|height|minWidth|maxWidth|minHeight|maxHeight|inset|boxShadow)\s*:\s*(\d+(?:\.\d+)?(?![\w.])|"[^"]*\d(?:px|rem|em)[^"]*"|'[^']*\d(?:px|rem|em)[^']*')/g,
      )) {
        if (m[2] === "0") continue; // zéro n'est pas une valeur d'échelle (même règle que le balayage CSS)
        push(file, n, "style-inline-en-dur", `${m[1]}: ${m[2]}`, "un rôle de token ou une classe tokenisée existe");
      }
    }
    if (file.endsWith(".css")) {
      // Une DÉFINITION de variable locale (`--tt-w: 36px`) est la tokenisation locale du
      // composant — classée « définition-var-locale », jamais comptée en dette (la dette,
      // c'est la valeur consommée en dur, pas la valeur nommée). On retire ces segments
      // de la ligne AVANT le balayage (multi-déclarations comprises) en les comptant.
      let defs = 0;
      const sansDefs = l.replace(/--[\w-]+\s*:[^;{}]*/g, (seg) => {
        for (const mm of seg.matchAll(/(?<![\w.-])\d*\.?\d+(?:px|rem|em|ms|s)(?![\w-])|#(?:[0-9a-fA-F]{3}){1,2}\b|(?:rgba?|hsla?)\([^)]+\)/g)) {
          findings.push({ file, line: n, type: "définition", motif: mm[0], detail: seg.trim().slice(0, 60), exc: "définition-var-locale" });
          defs++;
        }
        return "--def:_";
      });
      // `portee` = le texte de la déclaration jusqu'à la fin du motif : c'est lui que
      // confronte le `contexte` d'une exception (voir `excepted`).
      const pousseDur = (t, m, d, portee = null) => push(file, n, t, m, d, portee);
      // masque les fallbacks var() déjà comptés, puis cherche les valeurs en dur restantes
      const hors = sansDefs.replace(/var\([^)]*\)/g, "var()");
      for (const m of hors.matchAll(/#(?:[0-9a-fA-F]{3}){1,2}\b/g)) {
        if (m[0] === "#000" && /mask|linear-gradient\(#000/.test(l)) continue; // masque géométrique
        pousseDur("hex-en-dur", m[0], l.trim().slice(0, 80));
      }
      for (const m of hors.matchAll(/(?:rgba?|hsla?)\([^)]+\)/g)) pousseDur("rgba-en-dur", m[0], l.trim().slice(0, 60));
      for (const m of hors.matchAll(/(?<![\w.-])(\d*\.?\d+)(px|rem|em)(?![\w-])/g)) {
        if (m[1] === "0") continue;
        pousseDur("dimension-en-dur", `${m[1]}${m[2]}`, l.trim().slice(0, 70));
      }
      for (const m of hors.matchAll(/(?<![\w.-])(\d*\.?\d+)(ms|s)(?![\w-])/g))
        pousseDur("duree-en-dur", `${m[1]}${m[2]}`, l.trim().slice(0, 60), hors.slice(0, m.index + m[0].length));
      for (const m of hors.matchAll(/z-index\s*:\s*(\d+)/g)) pousseDur("z-index-en-dur", `z-index:${m[1]}`, "hors échelle --z-*");
    }
  });
}

// ── Classement : exceptions / strict / baseline ──────────────────────────────
const open = findings.filter((f) => !f.exc);
const classed = findings.filter((f) => f.exc);
const inStrict = (f) => STRICT_SCOPE.some((s) => f.file.startsWith(s) || f.file === s);
const strictFails = open.filter(inStrict);
const horsPilote = open.filter((f) => !inStrict(f));

// clé stable (indépendante des numéros de ligne)
const cle = (f) => `${f.file}|${f.type}|${f.motif}`;
const compte = new Map();
for (const f of horsPilote) compte.set(cle(f), (compte.get(cle(f)) ?? 0) + 1);

const baseline = existsSync(BASE_PATH) ? JSON.parse(readFileSync(BASE_PATH, "utf8")) : { entries: [] };
const baseMap = new Map(baseline.entries.map((e) => [`${e.file}|${e.type}|${e.motif}`, e]));

const nouveaux = [], augmentes = [], reduits = [], disparus = [];
for (const [k, n] of compte) {
  const b = baseMap.get(k);
  if (!b) nouveaux.push({ k, n });
  else if (n > b.occurrences) augmentes.push({ k, avant: b.occurrences, apres: n });
  else if (n < b.occurrences) reduits.push({ k, avant: b.occurrences, apres: n });
}
for (const [k, b] of baseMap) if (!compte.has(k)) disparus.push({ k, avant: b.occurrences });

// ── Rapport ──────────────────────────────────────────────────────────────────
console.log(`\nVérificateur de tokens v2 — ${files.length} fichiers · ${findings.length} constat(s) bruts`);
console.log(`  exceptions classées : ${classed.length} · baseline : ${baseline.entries.length} entrée(s) (${baseline.entries.reduce((a, e) => a + e.occurrences, 0)} occ.)`);
if (strictFails.length) {
  console.log(`\n■ PÉRIMÈTRE STRICT (pilote+lib) — ${strictFails.length} écart(s) :`);
  for (const f of strictFails.slice(0, 25)) console.log(`   ${f.file}:${f.line}  [${f.type}] ${f.motif}${f.detail ? " — " + f.detail : ""}`);
}
if (nouveaux.length) {
  console.log(`\n■ NOUVEAUX écarts hors baseline — ${nouveaux.length} :`);
  for (const { k, n } of nouveaux.slice(0, 25)) console.log(`   ${k} ×${n}`);
}
if (augmentes.length) {
  console.log(`\n■ AUGMENTATIONS vs baseline — ${augmentes.length} :`);
  for (const { k, avant, apres } of augmentes) console.log(`   ${k} : ${avant} → ${apres}`);
}
if (reduits.length || disparus.length)
  console.log(`\n○ Dette en baisse : ${reduits.length} réduite(s), ${disparus.length} éteinte(s) — accepter via --update-baseline.`);

if (INIT) {
  const VAGUES = {
    "components/select/": "vague 2 (Select/Switch)", "components/switch/": "vague 2 (Select/Switch)",
    "components/tabs/": "vague 3 (Tabs/Accordion)", "components/accordion/": "vague 3 (Tabs/Accordion)",
    "components/divider/": "vague 3", "components/alert/": "vague 4 (Alert/Toast)",
    "components/toast/": "vague 4 (Alert/Toast)", "components/card-group/": "vague 5 (CardGroup)",
    "components/modal/": "vague 6 (superposés)", "components/drawer/": "vague 6 (superposés)",
    "components/dropdown/": "vague 6 (superposés)", "components/app-layout/": "vague 7 (gabarits)",
    "components/app-shell/": "vague 7 (gabarits)", "components/toc/": "vague 7 (gabarits)",
    "components/container/": "vague 7 (gabarits)", "components/brand/": "vague 8 (spécialisés)",
    "components/theme-toggle/": "vague 8 (spécialisés)", "components/delete-button/": "vague 8 (expressifs)",
    "components/submit-button/": "vague 8 (expressifs)", "components/skip-link/": "vague 7 (gabarits)",
    "components/link/": "vague 1 (Link)",
  };
  const parCle = new Map();
  for (const f of horsPilote) {
    const k = cle(f);
    if (!parCle.has(k)) parCle.set(k, { file: f.file, type: f.type, motif: f.motif, occurrences: 0,
      nature: f.type,
      justification: "dette pré-existante au chantier cohérence (constat 2026-07-29) — aucune augmentation tolérée",
      vague: Object.entries(VAGUES).find(([d]) => f.file.startsWith(d))?.[1] ?? "à qualifier" });
    parCle.get(k).occurrences++;
  }
  writeFileSync(BASE_PATH, JSON.stringify({
    note: "Baseline de dette tokens — versionnée. Toute AUGMENTATION ou tout NOUVEL écart échoue en --strict ; les réductions s'acceptent via --update-baseline. Ajouter une entrée est une DÉCISION (édition manuelle justifiée).",
    creee: "2026-07-29 — bootstrap --init-baseline (usage unique)",
    entries: [...parCle.values()].sort((a, b) => a.file.localeCompare(b.file) || a.motif.localeCompare(b.motif)),
  }, null, 2) + "\n");
  console.log(`\nBaseline initialisée : ${parCle.size} entrée(s), ${horsPilote.length} occurrence(s).`);
  process.exit(0);
}
if (ADOPTE) {
  // ADOPTION D'UNE RACINE (usage unique par racine) — le seul geste qui AJOUTE des
  // entrées à la baseline sans édition manuelle, et il est volontairement étroit :
  //   - il n'accepte qu'une étiquette de racine DÉCLARÉE (pas un chemin quelconque) ;
  //   - il ne touche à aucune entrée existante ;
  //   - il refuse si la racine a déjà des entrées (une adoption ne se rejoue pas :
  //     après elle, tout écart nouveau est un écart nouveau).
  // Élargir la portée d'une garde fait apparaître d'un coup la dette qu'elle ignorait ;
  // la refuser en bloc ferait désactiver la garde, l'accepter en silence la viderait de
  // son sens. On la CONSTATE, datée et justifiée, et plus rien ne s'y ajoute.
  const etiquettes = RACINES.map((r) => r.etiquette).filter(Boolean);
  if (!etiquettes.includes(ADOPTE)) {
    console.error(`\n✗ --adopte attend l'étiquette d'une racine déclarée : ${etiquettes.join(", ")}`);
    process.exit(1);
  }
  if (baseline.entries.some((e) => e.file.startsWith(ADOPTE))) {
    console.error(`\n✗ la racine « ${ADOPTE} » a déjà des entrées : son adoption a eu lieu. Un écart nouveau se corrige, se classe, ou entre par édition manuelle justifiée.`);
    process.exit(1);
  }
  const ajouts = new Map();
  for (const f of horsPilote.filter((f) => f.file.startsWith(ADOPTE))) {
    const k = cle(f);
    if (baseMap.has(k)) continue;
    if (!ajouts.has(k))
      ajouts.set(k, {
        file: f.file, type: f.type, motif: f.motif, occurrences: 0, nature: f.type,
        justification: `dette constatée à l'ADOPTION de la racine « ${ADOPTE} » par la garde (2026-07-30, cf. DECISIONS.md) — antérieure à l'élargissement, aucune augmentation tolérée`,
        vague: "vague 9 (site)",
      });
    ajouts.get(k).occurrences++;
  }
  const entries = [...baseline.entries, ...ajouts.values()].sort((a, b) => a.file.localeCompare(b.file) || a.motif.localeCompare(b.motif));
  writeFileSync(BASE_PATH, JSON.stringify({ ...baseline, maj: `verifie-tokens --adopte ${ADOPTE} (constat d'adoption de racine)`, entries }, null, 2) + "\n");
  console.log(`\nRacine « ${ADOPTE} » adoptée : ${ajouts.size} entrée(s) ajoutée(s), ${[...ajouts.values()].reduce((a, e) => a + e.occurrences, 0)} occurrence(s) constatées. Les entrées existantes n'ont pas bougé.`);
  process.exit(0);
}
if (UPDATE) {
  // Ne fait QUE réduire/supprimer — jamais ajouter (un nouvel écart = une décision).
  const entries = baseline.entries
    .filter((e) => compte.has(`${e.file}|${e.type}|${e.motif}`))
    .map((e) => ({ ...e, occurrences: Math.min(e.occurrences, compte.get(`${e.file}|${e.type}|${e.motif}`)) }));
  writeFileSync(BASE_PATH, JSON.stringify({ ...baseline, maj: "verifie-tokens --update-baseline (réductions uniquement)", entries }, null, 2) + "\n");
  console.log(`\nBaseline réécrite : ${entries.length} entrée(s) (réductions/extinctions acceptées).`);
}

const ko = strictFails.length + nouveaux.length + augmentes.length;
if (STRICT && ko) {
  console.error(`\n❌ --strict : ${strictFails.length} écart(s) pilote · ${nouveaux.length} nouveau(x) · ${augmentes.length} augmentation(s).`);
  console.error(`   Un nouvel écart se corrige, se classe en exception nommée, ou entre dans la baseline`);
  console.error(`   PAR ÉDITION MANUELLE justifiée de tools/verifie-tokens.baseline.json (jamais automatique).`);
  process.exit(1);
}
console.log(STRICT ? "\n✅ Strict : pilote propre, aucune dette nouvelle." : "\n(mode rapport — `--strict` pour bloquer)");
