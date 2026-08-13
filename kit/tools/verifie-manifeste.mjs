#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// VÉRIFICATEUR DE MANIFESTE — cohérence entre les couches d'autorité
// (Fili Component Contract 1.0.0) :
//   TypeScript (ce que le composant accepte — déjà gardé par tsc via axe<U>())
//   ↔ manifeste (statut, intention, doctrine, exemples)
//   ↔ doctrine (content/md) ↔ RULES compilées (dist/build) ↔ atelier (registry).
//
// Échoue (exit 1) si :
//   - un dossier de composant n'a pas d'entrée de manifeste (ou l'inverse) ;
//   - une entrée pointe une fiche doctrinale ou une RULES inexistante ;
//   - une RULES compilée cite une version de source différente de la fiche actuelle
//     (fiche périmée → un agent recevrait une API potentiellement fausse).
// Avertit (sans échouer) si :
//   - un contrôle de formulaire ne déclare pas son rôle de validation (détection
//     STRUCTURELLE en AST : élément input/textarea/select ou role combobox/switch
//     réellement RENDU — pas une occurrence textuelle dans un sélecteur CSS) ;
//   - un composant déclaré field/group sans test de validité NI test d'accessibilité.
// Avertit (sans échouer) si :
//   - un composant stable est absent de l'atelier ;
//   - un composant sans doctrine est status "stable" (dette documentée) ;
//   - une entrée experimental (jamais proposée aux agents par le catalogue).
// ─────────────────────────────────────────────────────────────────────────────
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chargeTypescript } from "./fili-check.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST = JSON.parse(readFileSync(join(ROOT, "packages/react/manifest.json"), "utf8")).entries;
const COMPONENTS = join(ROOT, "packages/react/src/components");
const MD = join(ROOT, "apps/site/content/md");
const RULES = join(ROOT, "dist/build");
const REGISTRY = readFileSync(join(ROOT, "apps/site/app/ui/registry.tsx"), "utf8");

// dossier → nom public
const DIR_TO_NAME = {
  accordion: "Accordion", alert: "Alert", "app-layout": "AppLayout", "app-shell": "AppShell",
  brand: "Brand", button: "Button", card: "Card", "card-group": "CardGroup",
  checkbox: "Checkbox", chip: "Chip", radio: "Radio",
  "compact-button": "CompactButton", container: "Container", "delete-button": "DeleteButton",
  divider: "Divider", drawer: "Drawer", dropdown: "Dropdown", input: "Input", link: "Link",
  modal: "Modal", nav: "Nav", select: "Select", skeleton: "Skeleton", "skip-link": "SkipLink",
  "submit-button": "SubmitButton", switch: "Switch", tabs: "Tabs", "theme-toggle": "ThemeToggle",
  toast: "Toast", toc: "TableOfContents",
};

let fails = 0, warns = 0;
const fail = (m) => { console.error(`  ❌ ${m}`); fails++; };
const warn = (m) => { console.warn(`  ⚠ ${m}`); warns++; };

const byName = Object.fromEntries(MANIFEST.map((e) => [e.name, e]));

// ── 1. Bijection dossiers ↔ manifeste ────────────────────────────────────────
const dirs = readdirSync(COMPONENTS).filter((d) => !d.startsWith(".") && !d.startsWith("__"));
for (const d of dirs) {
  const name = DIR_TO_NAME[d];
  if (!name) { fail(`dossier components/${d} inconnu du mapping du vérificateur`); continue; }
  if (!byName[name]) fail(`composant ${name} (components/${d}) sans entrée de manifeste`);
}
for (const e of MANIFEST)
  if (e.package === "@fili/react" && !Object.values(DIR_TO_NAME).includes(e.name))
    fail(`entrée de manifeste ${e.name} sans dossier de composant`);

// ── 1bis. API COMPOUND ⇒ anatomie déclarée ET complète ───────────────────────
// Un voyant vert ne doit plus pouvoir ignorer une sous-API publique (c'est exactement
// ainsi que `CardGroup.Card` a vécu invisible des vérificateurs — garde du 2026-07-30).
// Complémentaire du niveau tsc (`anatomie<T>()` est désormais EXHAUSTIF) : ce contrôle-ci
// attrape l'entrée qui omet `anatomy` tout court pour un composant compound.
for (const d of dirs) {
  const name = DIR_TO_NAME[d];
  const e = name ? byName[name] : null;
  if (!e || e.status === "interne") continue;
  const srcPath = join(COMPONENTS, d, `${d}.tsx`);
  if (!existsSync(srcPath)) continue;
  const src = readFileSync(srcPath, "utf8");
  const m = src.match(new RegExp(`export const ${name}\\s*=\\s*(?:Object\\.assign\\(|\\{)([\\s\\S]*?);`));
  if (!m) continue; // export simple (fonction/forwardRef) : pas d'anatomie à déclarer
  const cles = [...m[1].matchAll(/(?:^|[,{(]\s*)([A-Za-z_]\w*)\s*:/gm)].map((x) => x[1]);
  if (!cles.length) continue;
  if (!e.anatomy?.length) {
    fail(`${name} : API compound (${cles.join(", ")}) sans champ anatomy dans le manifeste`);
    continue;
  }
  for (const k of cles)
    if (!e.anatomy.includes(`${name}.${k}`))
      fail(`${name} : sous-composant public ${name}.${k} absent de l'anatomie du manifeste`);
}


// ── 1ter. RÔLE DE VALIDATION : tout contrôle de formulaire le DÉCLARE ─────────
// Détection STRUCTURELLE (AST), pas textuelle : `t.closest('[role="combobox"]…')`
// dans app-layout est une CHAÎNE, pas un élément rendu — une recherche par motif la
// prendrait pour un contrôle de formulaire. Le contrat de composant exige la
// déclaration de tout composant qui rend RÉELLEMENT un élément associable à un
// formulaire ; c'est ce qui empêche un contrôle futur de naître sans décision.
const ts = chargeTypescript(ROOT);
if (!ts) {
  fail("TypeScript introuvable — la détection structurelle des contrôles de formulaire est requise, pas d'analyse dégradée");
} else {
  const TAGS_FORMULAIRE = new Set(["input", "textarea", "select"]);
  const ROLES_FORMULAIRE = new Set(["combobox", "switch"]);
  const TESTS = join(ROOT, "packages/react/src/components/__tests__");
  const corpusTests = existsSync(TESTS)
    ? readdirSync(TESTS)
        .filter((f) => /\.tsx?$/.test(f))
        .map((f) => readFileSync(join(TESTS, f), "utf8"))
        .join("\n")
    : "";

  const rendUnControle = (src, file) => {
    const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    let trouve = false;
    const visite = (node) => {
      if (trouve) return;
      if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
        const tag = node.tagName.getText();
        if (TAGS_FORMULAIRE.has(tag)) { trouve = true; return; }
        for (const a of node.attributes.properties) {
          if (!ts.isJsxAttribute(a) || a.name.getText() !== "role") continue;
          const init = a.initializer;
          const v = init && ts.isStringLiteral(init) ? init.text : null;
          if (v && ROLES_FORMULAIRE.has(v)) { trouve = true; return; }
        }
      }
      ts.forEachChild(node, visite);
    };
    visite(sf);
    return trouve;
  };

  for (const d of dirs) {
    const name = DIR_TO_NAME[d];
    const e = name ? byName[name] : null;
    if (!e || e.status === "interne") continue;
    const srcPath = join(COMPONENTS, d, `${d}.tsx`);
    if (!existsSync(srcPath)) continue;
    if (!rendUnControle(readFileSync(srcPath, "utf8"), `${d}.tsx`)) continue;

    const v = e.validation;
    if (!v || !v.role) {
      fail(`${name} : rend un contrôle de formulaire sans déclaration de rôle de validation (manifeste : validation.role = field | group | none)`);
      continue;
    }
    if (!["field", "group", "none"].includes(v.role)) {
      fail(`${name} : validation.role « ${v.role} » invalide (field | group | none)`);
      continue;
    }
    if (v.role === "none") {
      if (!v.justification || v.justification.trim().length < 40)
        fail(`${name} : validation.role "none" sans justification suffisante — un contrôle hors chaîne dit POURQUOI`);
      continue;
    }
    // field | group : la déclaration doit être COMPLÈTE — c'est elle que lit un agent.
    for (const cle of [
      "externalConstraints", "ariaInvalidTarget", "messageBinding", "focusTarget",
      "summaryRole", "requiredBehavior", "pendingBehavior", "correctionBehavior",
    ]) {
      const val = v[cle];
      if (!val || (Array.isArray(val) && !val.length))
        fail(`${name} : validation.${cle} manquant (rôle « ${v.role} » — la déclaration doit être complète)`);
    }
    if (!v.examples?.valid || !v.examples?.invalid)
      fail(`${name} : validation.examples doit donner un cas valide ET un cas invalide`);
    // Un porteur de validation ne se livre pas sans preuve exécutée.
    const cite = new RegExp(`\\b${name}\\b`).test(corpusTests);
    const preuveVerdict = cite && /verdict|Validation\./.test(corpusTests);
    const preuveA11y = cite && /aria-invalid/.test(corpusTests);
    if (!preuveVerdict) fail(`${name} : déclaré « ${v.role} » sans test citant un verdict (packages/react/src/components/__tests__)`);
    if (!preuveA11y) fail(`${name} : déclaré « ${v.role} » sans test d'accessibilité citant aria-invalid`);
  }
}

// ── 2. Doctrine et RULES pointées existent ───────────────────────────────────
const version = (file) => readFileSync(file, "utf8").match(/^version:\s*([\d.]+)/m)?.[1] ?? null;
for (const e of MANIFEST) {
  for (const k of ["ux", "ui"]) {
    const ref = e.doctrine?.[k];
    if (!ref || !ref.endsWith(".md")) continue;
    if (!existsSync(join(MD, ref.split(" ")[0].replace(/ .*/, "")))) fail(`${e.name} : doctrine ${k} introuvable — ${ref}`);
  }
  if (e.rules && !existsSync(join(RULES, e.rules))) fail(`${e.name} : RULES introuvable — dist/build/${e.rules}`);
  if (!e.doctrine && e.status === "stable" && !e.dette)
    fail(`${e.name} : stable sans doctrine NI dette qualifiée — compléter, qualifier (champ dette), ou requalifier experimental/interne`);
  if (e.status === "experimental") warn(`${e.name} : experimental — non proposé aux agents`);
  // Contrat d'un composant STABLE (fermeture §5) : exemple compilable, accessibilité,
  // anti-patterns. (Les axes typés sont garantis par tsc via axe<U>() ; l'atelier au §4.)
  if (e.status === "stable" && e.package === "@fili/react") {
    if (!e.canonicalExamples?.length) fail(`${e.name} : stable sans exemple canonique compilable`);
    if (!e.accessibility?.length) fail(`${e.name} : stable sans exigences accessibles minimales`);
    if (!e.antiPatterns?.length) fail(`${e.name} : stable sans anti-patterns principaux`);
  }
}

// ── 2bis. fiches de manque (MISSING-COMPONENT-PROTOCOL) ──────────────────────
import { readdirSync as rd } from "node:fs";
const MANQUES = join(ROOT, "apps/site/content/md/inventaires/manques");
const marqueurs = new Map(); // slug → [files]
(function scanApps(dir) {
  for (const en of rd(dir)) {
    if (en === "node_modules" || en === ".next" || en.startsWith(".")) continue;
    const p = join(dir, en);
    const st = require0(p);
    if (st.isDirectory()) scanApps(p);
    else if (/\.(tsx|jsx)$/.test(en))
      for (const m of readFileSync(p, "utf8").matchAll(/FILI-MANQUE:\s*([\w-]+)/g))
        marqueurs.set(m[1], [...(marqueurs.get(m[1]) ?? []), p]);
  }
})(join(ROOT, "apps"));
function require0(p) { return statSync(p); }
if (existsSync(MANQUES)) {
  for (const f of rd(MANQUES).filter((x) => x.endsWith(".md"))) {
    const slug = f.replace(/\.md$/, "");
    const corps = readFileSync(join(MANQUES, f), "utf8");
    const statut = corps.match(/-\s*Statut\s*:\s*(\S+)/)?.[1];
    if (!statut || !["proposé", "validé", "refusé", "résolu"].includes(statut))
      fail(`manque ${slug} : Statut absent ou invalide (proposé | validé | refusé | résolu)`);
    if (statut === "résolu" && marqueurs.has(slug))
      fail(`manque ${slug} : marqué résolu mais des implémentations locales FILI-MANQUE subsistent (${marqueurs.get(slug).length})`);
    const promo = corps.match(/-\s*Promotion\s*:\s*(\w+)/)?.[1];
    if (promo && !byName[promo]) fail(`manque ${slug} : annonce une promotion « ${promo} » absente du manifeste`);
  }
}
for (const [slug, fichiers] of marqueurs)
  if (!existsSync(join(MANQUES, `${slug}.md`)))
    fail(`FILI-MANQUE: ${slug} sans fiche (${fichiers.length} marqueur(s)) — créer content/md/inventaires/manques/${slug}.md`);

// ── 3. Fraîcheur des RULES vs sources ────────────────────────────────────────
for (const e of MANIFEST) {
  if (!e.rules || !e.doctrine) continue;
  const rulesPath = join(RULES, e.rules);
  if (!existsSync(rulesPath)) continue;
  const compiled = readFileSync(rulesPath, "utf8");
  for (const k of ["ux", "ui"]) {
    const ref = e.doctrine[k];
    if (!ref || !ref.endsWith(".md")) continue;
    const srcPath = join(MD, ref);
    if (!existsSync(srcPath)) continue;
    const vSrc = version(srcPath);
    if (!vSrc) continue;
    const base = ref.split("/").pop().replace(".md", ""); // p.ex. BUTTON-UX
    const m = compiled.match(new RegExp(`${base}[^\\d]*v?([\\d.]+)`));
    if (m && m[1] !== vSrc)
      fail(`${e.name} : RULES compilée cite ${base} v${m[1]} mais la source est v${vSrc} — recompiler (compile-regles.py)`);
  }
}

// ── 4. Atelier ───────────────────────────────────────────────────────────────
for (const e of MANIFEST) {
  if (e.package !== "@fili/react" || e.status === "interne") continue;
  if (!new RegExp(`\\b${e.name}\\b`).test(REGISTRY)) warn(`${e.name} : absent de l'atelier (registry.tsx)`);
}

console.log(`\nManifeste : ${MANIFEST.length} entrées · ${fails} incohérence(s) · ${warns} avertissement(s)`);
if (fails) { console.error("\n❌ Divergence entre les couches d'autorité."); process.exit(1); }
console.log("✅ Manifeste cohérent avec le code, la doctrine, les RULES et l'atelier (aux avertissements près).");
