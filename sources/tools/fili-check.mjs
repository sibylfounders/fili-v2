#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// fili-check — le validateur de consommation PORTABLE du design system Fili.
//
// À exécuter depuis la racine d'un projet consommateur :
//   node fili-check.mjs .            (ou tout chemin cible)
//   node fili-check.mjs . --manifest ./manifest.json
//
// Analyse en AST TypeScript (fichier COMPLET, jamais ligne par ligne — un élément
// JSX écrit sur plusieurs lignes est vu comme un seul nœud). Échoue clairement si
// TypeScript n'est pas résolvable : pas d'analyse dégradée silencieuse.
//
// Détections (toutes bloquantes) :
//   button-natif     <button> recréant Button/CompactButton
//   input-natif      <input>/<textarea> recréant Input
//   select-natif     <select> recréant Select
//   div-cliquable    <div>/<span> porteur d'onClick (un contrôle est Button/Link)
//   role-button      role="button" sur un élément natif non-bouton
//   import-sibyl     ancienne importation @sibyl/*
//   palette-defaut   classe Tailwind de la palette brute là où un rôle Fili existe
//   carte-recreee    conteneur combinant bordure + rayon + espacement intérieur (Card
//                    recréée) — en classes OU en style inline : une carte reste une carte
//                    quelle que soit la façon dont elle est écrite
//   style-en-dur     valeur d'échelle écrite à la main dans un objet style={{}} (aucune
//                    classe à lire : c'est l'angle mort par lequel une page entière peut
//                    passer — constat de l'audit de cohérence du 2026-07-30)
//   prop-inventee    valeur d'axe hors de l'union du manifeste (ex. tone="magic")
//   statut-sans-verdict  un contrôle qui PORTE une validation (manifeste : validation.role
//                    field|group) reçoit un `status` / un `error` sans `verdict` : l'état
//                    d'erreur serait un style choisi, pas la conséquence d'un verdict
//   aria-invalid-manuel  `aria-invalid` écrit dans une page — l'attribut est DÉRIVÉ par le
//                    kit ; l'écrire à la main, c'est le désolidariser de la validation
//   manque-sans-fiche marqueur FILI-MANQUE sans fiche .fili/manques/<slug>.md
//   allow-sans-raison exception inline déclarée sans justification
//
// Exceptions — jamais implicites, toujours justifiées :
//   - inline, sur la ligne du nœud ou la précédente :
//       // fili-check-allow: <règle> — <raison>
//     (mécanique interne, démo volontaire de mauvaise pratique, infrastructure)
//   - par configuration : .fili/fili-check.config.json
//       { "roots": ["app","src"], "exclude": [{"path":"src/legacy","raison":"…"}],
//         "allow": [{"rule":"input-natif","path":"src/editor/","raison":"…"}] }
//   - implémentation locale PROVISOIRE : /* FILI-MANQUE: <slug> */ + fiche
//     .fili/manques/<slug>.md (modèle livré avec ce paquet) — recensée, pas sanctionnée.
// ─────────────────────────────────────────────────────────────────────────────
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, resolve, isAbsolute } from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const RACINES_DEFAUT = ["app", "src", "pages", "components"];
const PALETTE =
  /(?:^|[\s"'`:])((?:bg|text|border|ring|outline|divide|fill|stroke)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3})(?![\w-])/g;
const ATTRS_STANDARD =
  /^(class(Name)?|id|style|key|ref|children|href|src|alt|title|type|name|value|defaultValue|placeholder|disabled|required|checked|open|width|height|target|rel|role|tabIndex|lang|dir|slot|form|min|max|step|rows|cols|size|colSpan|rowSpan|htmlFor|onC|on[A-Z]|aria-|data-)/;

export function chargeTypescript(cible) {
  const essais = [
    () => createRequire(pathToFileURL(join(resolve(cible), "package.json")))("typescript"),
    () => createRequire(import.meta.url)("typescript"),
  ];
  for (const e of essais) { try { return e(); } catch { /* essai suivant */ } }
  return null;
}

export function analyser(cible, options = {}) {
  const racine = resolve(cible);
  const ts = options.ts ?? chargeTypescript(racine);
  if (!ts) {
    throw new Error(
      "fili-check : TypeScript introuvable — l'analyse syntaxique est requise, pas d'analyse dégradée.\n" +
      "  Installer dans le projet cible : npm i -D typescript",
    );
  }
  const confPath = options.config ?? join(racine, ".fili", "fili-check.config.json");
  const conf = existsSync(confPath) ? JSON.parse(readFileSync(confPath, "utf8")) : {};
  for (const ex of conf.exclude ?? [])
    if (!ex.raison) throw new Error(`fili-check : exclusion « ${ex.path} » sans raison — toute exclusion est justifiée.`);
  const manifeste = options.manifest
    ? JSON.parse(readFileSync(options.manifest, "utf8"))
    : null;
  const axesParComposant = new Map();
  for (const e of manifeste?.entries ?? [])
    if (e.axes) axesParComposant.set(e.name, e.axes);
  // Qui PORTE une validation ? Le manifeste le dit (validation.role), donc aucune liste de
  // noms n'est écrite ici : un contrôle futur est couvert le jour où il se déclare.
  const porteursDeVerdict = new Set();
  for (const e of manifeste?.entries ?? [])
    if (e.validation?.role === "field" || e.validation?.role === "group") porteursDeVerdict.add(e.name);

  const roots = (conf.roots ?? RACINES_DEFAUT).map((r) => join(racine, r)).filter(existsSync);
  const scanRoots = roots.length ? roots : [racine];
  const exclus = (p) => (conf.exclude ?? []).find((e) => relative(racine, p).startsWith(e.path));

  const files = [];
  const walk = (dir) => {
    for (const e of readdirSync(dir)) {
      if (e === "node_modules" || e.startsWith(".")) continue;
      const p = join(dir, e);
      if (statSync(p).isDirectory()) { if (!exclus(p)) walk(p); }
      else if (/\.(tsx|jsx)$/.test(e) && !exclus(p)) files.push(p);
    }
  };
  for (const r of scanRoots) walk(r);

  const findings = [];
  const manques = [];

  for (const path of files) {
    const file = relative(racine, path);
    const src = readFileSync(path, "utf8");
    const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const lignes = src.split("\n");
    const ligneDe = (pos) => sf.getLineAndCharacterOfPosition(pos).line + 1;
    const allowInline = (ligne, rule) => {
      for (const l of [lignes[ligne - 1] ?? "", lignes[ligne - 2] ?? ""]) {
        const m = l.match(/fili-check-allow:\s*([\w-]+)(?:\s*[—-]\s*(.+))?/);
        if (m && m[1] === rule) {
          if (!m[2] || !m[2].trim()) return { sansRaison: true };
          return { raison: m[2].trim() };
        }
      }
      return null;
    };
    const allowConf = (rule) => (conf.allow ?? []).find((a) => a.rule === rule && (!a.path || file.startsWith(a.path)) && a.raison);
    const pousse = (rule, ligne, motif, detail = "") => {
      if (rule !== "manque-sans-fiche" && lignesCouvertes.has(ligne)) return; // provisoire déclaré
      const inline = allowInline(ligne, rule);
      if (inline?.sansRaison) { findings.push({ file, ligne, rule: "allow-sans-raison", motif: rule, detail: "exception inline sans justification" }); return; }
      if (inline || allowConf(rule)) return;
      findings.push({ file, ligne, rule, motif, detail });
    };

    // marqueurs FILI-MANQUE (commentaires — sur le texte complet). Un marqueur AVEC fiche
    // valide couvre l'implémentation locale provisoire qu'il annote (l'élément qui suit) :
    // recensée, jamais sanctionnée — c'est le contrat du MISSING-COMPONENT-PROTOCOL.
    const lignesCouvertes = new Set();
    for (const m of src.matchAll(/FILI-MANQUE:\s*([\w-]+)/g)) {
      const slug = m[1];
      const ligne = ligneDe(m.index);
      const fiche = options.fichesManques
        ? join(options.fichesManques, `${slug}.md`)
        : join(racine, ".fili", "manques", `${slug}.md`);
      if (existsSync(fiche)) {
        manques.push({ file, ligne, slug, fiche: relative(racine, fiche) });
        lignesCouvertes.add(ligne + 1).add(ligne + 2);
      } else pousse("manque-sans-fiche", ligne, slug, `fiche attendue : ${relative(racine, fiche)}`);
    }

    const nomDeTag = (tag) =>
      ts.isIdentifier(tag) ? tag.text : ts.isPropertyAccessExpression(tag) ? `${tag.expression.getText()}.${tag.name.text}` : tag.getText();

    // ── D'où vient un nom ? ───────────────────────────────────────────────────
    // Sans ça, `<Link>` de next/link était traité comme le Link DU KIT : ses props
    // étaient vérifiées contre le manifeste (faux positifs possibles) et il échappait
    // aux règles de recréation (faux négatifs — la page d'accueil du site est passée
    // exactement par là). On lit donc les imports du fichier.
    const provenance = new Map();
    for (const st of sf.statements) {
      if (!ts.isImportDeclaration(st) || !ts.isStringLiteral(st.moduleSpecifier)) continue;
      const mod = st.moduleSpecifier.text;
      const b = st.importClause?.namedBindings;
      if (st.importClause?.name) provenance.set(st.importClause.name.text, mod);
      if (b && ts.isNamedImports(b)) for (const el of b.elements) provenance.set(el.name.text, mod);
      if (b && ts.isNamespaceImport(b)) provenance.set(b.name.text, mod);
    }
    // `@sibyl/*` est le MÊME kit sous son ancien nom : l'import est sanctionné à part
    // (import-sibyl), mais le composant reste le nôtre — sans quoi une importation
    // périmée dispenserait au passage du contrôle des props.
    const PAQUETS_KIT = [options.paquet ?? conf.paquet ?? "@fili/react", "@sibyl/react"];
    const duKit = (base) => {
      const mod = provenance.get(base);
      // importé du kit → oui ; importé d'ailleurs → non ; non importé (défini sur place,
      // ou barillet local qui ré-exporte le kit) → on garde le bénéfice du doute au
      // manifeste, comportement historique.
      return mod ? PAQUETS_KIT.some((p) => mod === p || mod.startsWith(p + "/")) : true;
    };

    // ── Style inline : les propriétés dont la valeur est un LITTÉRAL ──────────
    // Une valeur calculée (`width: pct + "%"`, `style={styles}`) reste licite : on ne
    // sait pas la juger et elle n'est pas une valeur d'échelle écrite à la main.
    const DIM_INLINE = /^(borderRadius|borderWidth|border|padding|padding(?:Top|Right|Bottom|Left|Inline|Block)|margin|margin(?:Top|Right|Bottom|Left|Inline|Block)|gap|rowGap|columnGap|fontSize|letterSpacing|width|height|minWidth|maxWidth|minHeight|maxHeight|inset|boxShadow|color|background|backgroundColor|borderColor)$/;
    // Renvoie { posees } — toutes les propriétés déclarées, quelle que soit leur valeur
    // (c'est ce qui dessine une carte) — et { litteraux } — celles dont la valeur est
    // écrite à la main (c'est ce qui court-circuite l'échelle). Les deux questions sont
    // distinctes : une carte dont la bordure est tokenisée reste une carte recréée.
    const styleDe = (attrs) => {
      const a = attrs.find((x) => ts.isJsxAttribute(x) && x.name.getText() === "style");
      const posees = new Set(), litteraux = [];
      if (!a?.initializer || !ts.isJsxExpression(a.initializer)) return { posees, litteraux };
      const obj = a.initializer.expression;
      if (!obj || !ts.isObjectLiteralExpression(obj)) return { posees, litteraux };
      for (const p of obj.properties) {
        if (!ts.isPropertyAssignment(p) || !p.name) continue;
        const cle = p.name.getText().replace(/["']/g, "");
        posees.add(cle);
        const v = p.initializer;
        let texte = null;
        if (ts.isNumericLiteral(v) && v.text !== "0") texte = v.text;
        else if (ts.isStringLiteral(v) && !v.text.includes("var(") && /\d(px|rem|em|%)|^#[0-9a-fA-F]{3,8}$|^(rgb|hsl)a?\(/.test(v.text)) texte = `"${v.text}"`;
        if (texte && DIM_INLINE.test(cle)) litteraux.push({ cle, texte });
      }
      return { posees, litteraux };
    };
    // Une carte est un CONTENEUR. Un <pre> bordé est un bloc de code, un <span> arrondi
    // est une étiquette : les signaler noierait la règle sous des faux positifs, et une
    // règle bruyante finit désactivée.
    const CONTENEUR = /^(div|section|article|aside|li|figure|form|label|a)$/;

    const visite = (node) => {
      if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier) && node.moduleSpecifier.text.startsWith("@sibyl/"))
        pousse("import-sibyl", ligneDe(node.getStart()), node.moduleSpecifier.text);

      if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
        const ligne = ligneDe(node.getStart());
        const nom = nomDeTag(node.tagName);
        const attrs = node.attributes.properties;
        const attr = (n) => attrs.find((a) => ts.isJsxAttribute(a) && a.name.getText() === n);
        const valeurTexte = (a) =>
          a?.initializer && ts.isStringLiteral(a.initializer) ? a.initializer.text
          : a?.initializer && ts.isJsxExpression(a.initializer) && a.initializer.expression && ts.isStringLiteral(a.initializer.expression) ? a.initializer.expression.text
          : null;
        const classes = valeurTexte(attr("className")) ?? "";
        const base0 = nom.split(".")[0];
        const estKit = /^[A-Z]/.test(base0) && axesParComposant.has(base0) && duKit(base0);

        // ── Valeurs en dur posées en style inline (toute balise SAUF le kit) ──
        // Le kit, lui, a le droit de composer ses propres mécaniques ; un consommateur
        // qui écrit `style={{ borderRadius: 10 }}` court-circuite l'échelle, et aucune
        // règle lisant des classes ne peut le voir.
        if (!estKit) {
          const { posees, litteraux } = styleDe(attrs);
          for (const { cle, texte } of litteraux)
            pousse("style-en-dur", ligne, `${nom} style={{ ${cle}: ${texte} }}`, "poser un rôle de token (var(--…)) ou une classe tokenisée");
          // Une CARTE ne se reconnaît pas à la façon dont elle est écrite : bordure +
          // rayon + espacement intérieur font une carte, en classes comme en style inline.
          if (CONTENEUR.test(nom) || /^[A-Z]/.test(nom)) {
            const carteInline = posees.has("borderRadius") && [...posees].some((c) => /^border([A-Z]|$)/.test(c) && c !== "borderRadius") && [...posees].some((c) => c.startsWith("padding"));
            const carteClasses = /(^|\s)border(-|\s|"|$)/.test(" " + classes + " ") && /rounded/.test(classes) && /(^|\s)p[xytblr]?-/.test(" " + classes);
            if (carteInline || carteClasses)
              pousse("carte-recreee", ligne, `${nom} bordure+rayon+espacement`, "c'est une Card — utiliser Card/CardGroup (@fili/react)");
          }
        }

        // ── L'état d'erreur est-il la CONSÉQUENCE d'un verdict ? ──────────────────────
        // Un `status` ou un `error` posé sur un porteur de validation SANS `verdict` est un
        // état choisi à la main : rien ne garantit qu'une donnée le justifie, et rien ne le
        // fera disparaître à la correction. Légitime dans une fixture qui montre un état
        // isolé — mais alors elle se déclare (`fili-check-allow: statut-sans-verdict — …`).
        if (porteursDeVerdict.has(base0) && duKit(base0)) {
          const aVerdict = attrs.some((a) => ts.isJsxAttribute(a) && a.name.getText() === "verdict");
          if (!aVerdict)
            for (const nomAttr of ["status", "error"]) {
              const a = attr(nomAttr);
              if (!a) continue;
              const v = valeurTexte(a);
              if (nomAttr === "status" && v === "default") continue; // ne prétend à aucune faute
              pousse(
                "statut-sans-verdict",
                ligne,
                `${nom} ${nomAttr}=${v != null ? `"${v}"` : "…"}`,
                "un état d'erreur descend d'un verdict (prop `verdict`) — sinon, déclarer la fixture",
              );
            }
        }

        // ── `aria-invalid` écrit à la main ────────────────────────────────────────────
        // Le kit le DÉRIVE du statut, lui-même dérivé du verdict. L'écrire dans une page,
        // c'est réintroduire la main humaine au milieu de la chaîne.
        if (attr("aria-invalid"))
          pousse("aria-invalid-manuel", ligne, `${nom} aria-invalid=…`, "l'attribut est dérivé du verdict par le kit");

        // ── Élément natif rendu PAR un composant du kit via `asChild` (Radix Slot) ─────
        // `<Nav.Link asChild><button …>` ou `<Chip asChild><a …>` : l'élément natif EST le
        // rendu du composant kit (facture, focus, sémantique choisie par le consommateur).
        // Ce n'est pas un contrôle recréé — c'est le motif de composition documenté du kit.
        // Seul le PARENT IMMÉDIAT compte : un natif enfoui plus bas reste une recréation.
        const rendaParKitAsChild = (() => {
          const el = ts.isJsxOpeningElement(node) ? node.parent : node; // JsxElement | JsxSelfClosing
          const wrap = el?.parent;
          if (!wrap || !ts.isJsxElement(wrap)) return false;
          const op = wrap.openingElement;
          const wnom = nomDeTag(op.tagName);
          const wbase = wnom.split(".")[0];
          if (!/^[A-Z]/.test(wbase) || !duKit(wbase)) return false;
          return op.attributes.properties.some((a) => ts.isJsxAttribute(a) && a.name.getText() === "asChild");
        })();

        if (/^[a-z]/.test(nom)) {
          if (!rendaParKitAsChild) {
            if (nom === "button") pousse("button-natif", ligne, "<button>", "utiliser Button / CompactButton (@fili/react)");
            if (nom === "input" || nom === "textarea") pousse("input-natif", ligne, `<${nom}>`, "utiliser Input (@fili/react)");
            if (nom === "select") pousse("select-natif", ligne, "<select>", "utiliser Select (native le rend aussi)");
            if ((nom === "div" || nom === "span") && attr("onClick")) pousse("div-cliquable", ligne, `<${nom} onClick>`, "un contrôle est un Button ou un Link");
            if (nom !== "button" && valeurTexte(attr("role")) === "button") pousse("role-button", ligne, `<${nom} role="button">`, "utiliser la primitive appropriée");
          }
          for (const m of classes.matchAll(PALETTE)) pousse("palette-defaut", ligne, m[1], "un rôle Fili existe (tokens sémantiques)");
        } else if (axesParComposant.size && duKit(base0)) {
          const base = nom.split(".")[0];
          // Les axes/props du manifeste décrivent la RACINE : ne vérifier que <X> ou <X.Root>
          // (les sous-composants ont leurs propres props, non couvertes ici).
          const estRacine = nom === base || nom === `${base}.Root`;
          const axes = estRacine ? axesParComposant.get(base) : undefined;
          if (axes) {
            for (const a of attrs) {
              if (!ts.isJsxAttribute(a)) continue;
              const an = a.name.getText();
              const axe = axes[an];
              const v = valeurTexte(a);
              if (axe && v != null && !(v in axe.values))
                pousse("prop-inventee", ligne, `${nom} ${an}="${v}"`, `valeurs réelles : ${Object.keys(axe.values).join(" | ")}`);
              else if (!axe && v != null && !ATTRS_STANDARD.test(an) && !Object.keys(axesParComposant.get(base) ?? {}).includes(an)) {
                const entree = (manifeste.entries.find((e) => e.name === base)) ?? null;
                const props = Object.keys(entree?.props ?? {});
                if (entree && !props.includes(an)) pousse("prop-inventee", ligne, `${nom} ${an}=…`, `hors manifeste (axes : ${Object.keys(axes).join(", ")} ; props : ${props.join(", ") || "—"})`);
              }
            }
          }
        }
      }
      ts.forEachChild(node, visite);
    };
    visite(sf);
  }
  return { files: files.length, findings, manques };
}

// ── BASELINE : adopter le validateur sur un code qui existe déjà ─────────────
// Sans elle, fili-check est tout ou rien : un projet réel ne l'allume jamais, parce
// que le premier passage sort des dizaines d'écarts et que personne ne s'arrête pour
// tout reprendre. On CONSTATE donc l'existant, daté et détaillé (fichier, règle, motif,
// occurrences, justification, vague), et à partir de là tout écart NOUVEAU échoue —
// y compris dans un fichier créé demain. Une entrée ne s'ajoute jamais toute seule :
// `--adopte` est un geste unique, ensuite c'est une édition manuelle justifiée.
const cleFinding = (f) => `${f.file}|${f.rule}|${f.motif}`;

export function classe(findings, baseline) {
  const connues = new Map((baseline?.entries ?? []).map((e) => [`${e.file}|${e.rule}|${e.motif}`, e]));
  const compte = new Map();
  for (const f of findings) compte.set(cleFinding(f), (compte.get(cleFinding(f)) ?? 0) + 1);
  const nouveaux = [], augmentes = [], reduits = [], disparus = [];
  for (const [k, n] of compte) {
    const b = connues.get(k);
    if (!b) nouveaux.push({ k, n, exemples: findings.filter((f) => cleFinding(f) === k).slice(0, 3) });
    else if (n > b.occurrences) augmentes.push({ k, avant: b.occurrences, apres: n });
    else if (n < b.occurrences) reduits.push({ k, avant: b.occurrences, apres: n });
  }
  for (const [k, b] of connues) if (!compte.has(k)) disparus.push({ k, avant: b.occurrences });
  return { nouveaux, augmentes, reduits, disparus, compte, connues };
}

export function baselineDepuis(findings, justification, vague) {
  const parCle = new Map();
  for (const f of findings) {
    const k = cleFinding(f);
    if (!parCle.has(k)) parCle.set(k, { file: f.file, rule: f.rule, motif: f.motif, occurrences: 0, justification, vague });
    parCle.get(k).occurrences++;
  }
  return [...parCle.values()].sort((a, b) => a.file.localeCompare(b.file) || a.rule.localeCompare(b.rule) || a.motif.localeCompare(b.motif));
}

export function rapport({ files, findings, manques }) {
  const parRegle = {};
  for (const f of findings) (parRegle[f.rule] ??= []).push(f);
  const lignes = [`\nfili-check — ${files} fichier(s) analysé(s) (AST TypeScript)`];
  for (const [rule, fs] of Object.entries(parRegle)) {
    lignes.push(`\n■ ${rule} — ${fs.length}`);
    for (const f of fs.slice(0, 30)) lignes.push(`   ${f.file}:${f.ligne}  ${f.motif}${f.detail ? " — " + f.detail : ""}`);
  }
  if (manques.length) {
    lignes.push(`\n○ Implémentations locales provisoires déclarées (FILI-MANQUE) — ${manques.length} :`);
    for (const m of manques) lignes.push(`   ${m.file}:${m.ligne}  ${m.slug} (fiche : ${m.fiche})`);
  }
  lignes.push(findings.length ? `\n❌ ${findings.length} écart(s) — un site incorrect ne se publie pas.` : `\n✅ Consommation conforme au kit Fili.`);
  return lignes.join("\n");
}

// ── CLI ──────────────────────────────────────────────────────────────────────
const estCli = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
if (estCli) {
  const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const opt = (n) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? process.argv[i + 1] : undefined; };
  const cible = args[0] ?? ".";
  try {
    const manifest = opt("manifest") ?? (existsSync(join(resolve(cible), "manifest.json")) ? join(resolve(cible), "manifest.json") : undefined);
    const res = analyser(cible, { config: opt("config"), manifest, fichesManques: opt("manques") });
    console.log(rapport(res));
    process.exit(res.findings.length ? 1 : 0);
  } catch (e) {
    console.error(String(e.message ?? e));
    process.exit(2);
  }
}
