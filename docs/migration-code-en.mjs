/* Migration du code de Fili vers l'anglais — 2026-09-08.
   Usage : node migrate.mjs <racine fili-v2> <dictionnaire.json> [--write]
   Sans --write : rapport seulement (collisions, renommages, compte des remplacements). */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const ROOT = path.resolve(process.argv[2]);
const DICT = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));
const WRITE = process.argv.includes('--write');
const ts = createRequire(import.meta.url)(path.join(ROOT, 'kit/node_modules/typescript/lib/typescript.js'));

const WORDS = DICT.mots;
const OVERRIDES = DICT.identifiants || {};
const FROZEN_SEGMENTS = new Set(['kit', 'temoin', 'docs', 'node_modules', 'public', 'app', 'src', 'tools', 'scripts', 'fili', 'fili-html', 'crash-tests', 'design-system', 'pages', 'lib', 'system', 'aurore']);
const ROUTE_DIRS = new Set(fs.readdirSync(path.join(ROOT, 'kit/app'), { withFileTypes: true }).filter(e => e.isDirectory()).map(e => e.name));
const SKIP = /node_modules|\/\.next|\/dist\/|\/\.git\/|_to_delete|\/archive\/|\/sources\/|\/docs\/charte\/|\/temoin\/public\/|\/temoin\/temoins\/|migration-code-en|\.DS_Store|package-lock|\.png$|\.tgz$|\.woff|\.plist$|\.sh$|\.log$|journal\.md$|\.githooks|_shots|derniere-course\.json$|tsconfig[\w.]*\.json$/;

/* ───── traduction d'un identifiant ───── */
const SCOPES = DICT.portees || [];
let CURRENT_SCOPE = null; // { identifiants }
function scopeFor(relPath) { for (const sc of SCOPES) if (sc.prefixes.some(p => relPath.startsWith(p))) return sc; return null; }
const cache = new Map();
function translateIdent(id) {
  const key = (CURRENT_SCOPE ? CURRENT_SCOPE.prefixes[0] + '|' : '') + id;
  if (cache.has(key)) return cache.get(key);
  let out;
  if (CURRENT_SCOPE && Object.hasOwn(CURRENT_SCOPE.identifiants, id)) out = CURRENT_SCOPE.identifiants[id];
  else if (Object.hasOwn(OVERRIDES, id)) out = OVERRIDES[id];
  else {
    for (const [re, rep] of REGEX_OVERRIDES) { if (re.test(id)) { out = id.replace(re, rep); break; } }
    if (out === undefined) out = id.replace(/[A-Z]?[a-z]+|[A-Z]+(?![a-z])|\d+/g, tok => {
      const lower = tok.toLowerCase();
      const w = Object.hasOwn(WORDS, lower) ? WORDS[lower] : null;
      if (!w) return tok;
      if (tok === tok.toUpperCase() && tok.length > 1) return w.toUpperCase();
      if (tok[0] === tok[0].toUpperCase()) return w[0].toUpperCase() + w.slice(1);
      return w;
    });
  }
  if (out !== id && RESERVED.has(out)) out = RESERVED_ALT[out] || out + '_';
  cache.set(key, out);
  return out;
}
const RESERVED = new Set('break case catch class const continue debugger default delete do else enum export extends false finally for function if import in instanceof new null return super switch this throw true try typeof var void while with yield let static implements interface package private protected public await arguments eval'.split(' '));
const RESERVED_ALT = { in: 'inside', with: 'along', case: 'instance', default: 'defaults', new: 'fresh', class: 'cls', break: 'rupture', delete: 'remove', function: 'fn', return: 'ret', if: 'cond', else: 'otherwise', for: 'each', while: 'during', do: 'perform', switch: 'toggle', this: 'self', null: 'nil', true: 'yes', false: 'no', typeof: 'kind', void: 'nothing', throw: 'raise', try: 'attempt', catch: 'trap', finally: 'lastly', continue: 'proceed', static: 'stat', package: 'pkg', interface: 'iface', private: 'priv', public: 'pub', await: 'awaited', let: 'lett', const: 'constant', var: 'variable', yield: 'produce', export: 'exported', import: 'imported', extends: 'extend', super: 'sup', enum: 'enumeration', instanceof: 'instance', debugger: 'dbg', arguments: 'args', eval: 'evaluate', implements: 'impl', protected: 'prot' };
const REGEX_OVERRIDES = [
  [/^(--rr-(?:inline|block)-(?:marge|ecart)-)ligne$/, (m, p) => translateIdent(p) + 'row'],
  [/^(--rr-radius-)ligne$/, (m, p) => p + 'row'],
  [/^(rr-(?:inline|block)-(?:marge|ecart)-)ligne$/, (m, p) => translateIdent(p) + 'row'],
];
/* chemin : segment par segment, sans toucher aux dossiers gelés, aux routes, aux fixtures OK-/KO- */
function translatePath(p) {
  return translatePath0(p).replace(/tools\/fili\/card\//g, 'tools/fili/map/').replace(/tools\/fili\/temoin\//g, 'tools/fili/witness/').replace(/(^|\/)temoins(\/|$)/g, '$1witnesses$2');
}
function translatePath0(p) {
  return p.split('/').map((seg, i, arr) => {
    if (seg === 'carte' && /^produire\./.test(arr[i + 1] || '')) return 'map';
    if (seg === 'temoin' && i > 0 && (arr[i - 1] === 'fili' || arr[i - 1] === '..')) return 'witness';
    if (seg === 'temoins') return 'witnesses';
    if (!seg || seg === '.' || seg === '..' || FROZEN_SEGMENTS.has(seg) || ROUTE_DIRS.has(seg)) return seg;
    if (/^(OK|KO)-/.test(seg)) return seg;
    if (/^fr\.fili\./.test(seg)) return seg;
    if (i === arr.length - 1 && /^(kit-.*\.html|piste-.*\.html|README\.md)$/.test(seg) && arr.length === 1) return seg;
    if (i === arr.length - 1 && arr.length === 2 && arr[0] === 'docs' && seg.endsWith('.md')) return seg;
    const parts = seg.split('.');
    const EXT = new Set(['ts','tsx','mjs','js','css','json','md','html','d','test','launchd','plist','sh','log','png','svg','woff2','txt']);
    return parts.map((p, j) => (j > 0 && EXT.has(p)) || !p ? p : translateIdent(p)).join('.');
  }).join('/');
}

/* ───── inventaires ───── */
const files = [];
(function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (SKIP.test(p + (e.isDirectory() ? '/' : ''))) continue; if (e.isDirectory()) walk(p); else files.push(p); } })(ROOT);
const rel = p => path.relative(ROOT, p);
const isCode = f => /\.(tsx?|mjs|js)$/.test(f);

const KNOWN_CLASSES = new Set(); const KEYFRAMES = new Set();
for (const f of files) if (f.endsWith('.css') || f.endsWith('.html')) {
  const t = fs.readFileSync(f, 'utf8');
  for (const m of t.matchAll(/(?<![-\d"'`\/\w]|[\w])\.([a-zA-Z_][\w-]*)/g)) KNOWN_CLASSES.add(m[1]);
  for (const m of t.matchAll(/(?<=\.[\w-]+)\.([a-zA-Z_][\w-]*)(?=[\s,{:>+~)\.])/g)) KNOWN_CLASSES.add(m[1]);
  for (const m of t.matchAll(/@keyframes\s+([\w-]+)/g)) KEYFRAMES.add(m[1]);
}
for (const f of files) if (isCode(f)) {
  const t = fs.readFileSync(f, 'utf8');
  for (const m of t.matchAll(/className=\{?["'`]([^"'`$]*)["'`]/g)) m[1].split(/\s+/).forEach(c => c && KNOWN_CLASSES.add(c));
}

const COMPONENTS = new Set();
for (const f of files) if (isCode(f)) for (const m of fs.readFileSync(f, 'utf8').matchAll(/\b(?:function|const|class|type|interface)\s+([A-Z][A-Za-z0-9]+)/g)) COMPONENTS.add(m[1]);
let SEEN = null; // Set des identifiants d'origine du fichier courant
const seen = id => { if (SEEN) SEEN.add(id); return id; };
const stats = { ident: 0, string: 0, css: 0, json: 0, md: 0, html: 0 };

/* ───── chaînes ───── */
const RX_PROP = /--[a-zA-Z][\w-]*/g;
const RX_DATA = /data-[a-z][\w-]*/g;
const RX_SEL = /(?<![-"'`\/])([.#])([a-zA-Z_][\w-]*)(?!\.(?:mjs|js|ts|tsx|css|json|md|html|svg|png|woff2?|log|sh|plist)\b)/g;
const TOKENISH = /^(?:[a-z][a-z0-9]*(?:[-_][a-z0-9]+)+|[a-z][a-z0-9]*|[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+|[a-z][a-zA-Z0-9]*|[a-z0-9]+(?:[-_.\/][A-Za-z0-9-]+)+)$/;
const TW_BARE = new Set('flex grid block inline hidden relative absolute fixed sticky static truncate uppercase lowercase capitalize italic underline border rounded shadow container contents isolate invisible visible antialiased overflow-hidden transition outline ring'.split(' '));
const STRING_LOG = [];
function translateStringy(s, ctx = {}) {
  const r = translateStringy0(s, ctx);
  if (r !== s && (/\s/.test(s.trim()) || (!ctx.classy && /^[a-z]+$/.test(s)))) STRING_LOG.push((ctx.classy ? '[classy] ' : '[libre] ') + s.replace(/\n/g, '⏎') + '  →  ' + r.replace(/\n/g, '⏎'));
  return r;
}
const STRING_KEEP = new Set(DICT.chaines_gardees || []);
function translateStringy0(s, ctx = {}) {
  const before = s;
  if (STRING_KEEP.has(s)) return s;
  if (/^\//.test(s) && !/node_modules/.test(s)) { /* route ou URL absolue : intact */ return s; }
  if (/^\.{0,2}\//.test(s) && !/\s/.test(s)) return translatePath(s); // chemin relatif
  s = s.replace(RX_PROP, translateIdent).replace(RX_DATA, translateIdent);
  s = s.replace(/\bfili\/([a-z][\w-]*)/g, (m, r) => 'fili/' + translateIdent(r));
  s = s.replace(/"([A-Za-z_$][\w]*)"(\s*:\s*)"([a-z][\w-]*)"/g, (m, k, sep, v) => `"${translateIdent(k)}"${sep}"${translateIdent(v)}"`);
  s = s.replace(/"([A-Za-z_$][\w]*)"(\s*):/g, (m, k, sp) => `"${translateIdent(k)}"${sp}:`);
  if (ctx.prose) { s = s.replace(RX_SEL, (m, sig, name) => sig + (KNOWN_CLASSES.has(name) || /-/.test(name) ? translateIdent(name) : name)); if (s !== before) stats.string++; return s; }
  if (COMPONENTS.has(s) && CURRENT_SCOPE) return translateIdent(s); // noms de composants cités en chaîne : le témoin seulement (registre, gardien)
  if (TOKENISH.test(s) && !/^\d/.test(s)) {
    if (/[\/.]/.test(s) && !/^[A-Z]/.test(s)) return translatePath(s);
    if (/^[a-z]/.test(s) || /^[A-Z][A-Z0-9_]+$/.test(s)) return translateIdent(s);
  }
  if (/\s/.test(s)) s = s.replace(/(?<![\w@:])(?:\.{1,2}\/)?[\w*-]+(?:\/[\w*.-]+)+(?![\w-])/g, tok => (/^(https?|www)/.test(tok) || !(/^\.{1,2}\//.test(tok) || /\.[a-z]{1,4}$/.test(tok) || /^(kit|temoin|docs|tools|src|app|fili|scripts|crash-tests|public|node_modules)\//.test(tok))) ? tok : translatePath(tok));
  s = s.replace(/\\`([^`\\\n]+)\\`/g, (m, inner) => '\\`' + mdInline(inner) + '\\`');
  if (ctx.classy === 'code') {
    s = s.replace(/(?<![\w$])([A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+|[a-z]+(?:[A-Z][a-z0-9]*)+|[a-z][a-z0-9]*(?:-[a-z0-9]+)+)(?![\w-])/g, tok => translateIdent(tok));
    if (s !== before) stats.string++;
    return s;
  }
  const toks = s.trim().split(/\s+/);
  const tailwindish = toks.length >= 1 && toks.every(t => (/^-?[a-z][\w-]*(:-?[\w-]+)*$/.test(t) && (/[-:]/.test(t) || TW_BARE.has(t))) || /^\$\{/.test(t)) && toks.some(t => /[-:]/.test(t));
  if (ctx.classy || tailwindish) {
    s = s.split(/(\s+)/).map(t => /^\s+$/.test(t) || !t ? t
      : /^-?[a-zA-Z_][\w-]*(:-?[\w-]+)*$/.test(t) && (KNOWN_CLASSES.has(t) || ctx.classy || tailwindish) ? t.split(':').map(x => x.startsWith('-') ? '-' + translateIdent(x.slice(1)) : translateIdent(x)).join(':')
      : t).join('');
  }
  s = s.replace(RX_SEL, (m, sig, name) => sig + (KNOWN_CLASSES.has(name) || sig === '#' || /-/.test(name) ? translateIdent(name) : name));
  if (s !== before) stats.string++;
  return s;
}

/* ───── chaînes qui contiennent du balisage, du CSS ou du code ───── */
function embedded(raw, file) {
  if (/<[a-z][a-z0-9]*[\s>\/]/.test(raw) && /\b(class|id|for|data-[a-z-]+|aria-controls)=/.test(raw)) return transformHtml(raw, file);
  if (!/</.test(raw) && /(^|\n)\s*[.#\[@:][^{}\n]*\{/.test(raw) && /;/.test(raw)) return transformCss(raw);
  if (/\b(export|import)\s+(function|const|type|interface|\{)|\bfunction\s+[a-z]\w*\s*\(/.test(raw)) return transformCode(raw, file + '.frag.ts', ts.ScriptKind.TS);
  return null;
}

/* ───── TS / JS ───── */
const CLASSY_ATTRS = new Set(['className', 'class', 'id', 'htmlFor', 'aria-controls', 'aria-labelledby', 'aria-describedby', 'for']);
const CLASSY_CALLS = new Set(['add', 'remove', 'toggle', 'contains', 'replace', 'getAttribute', 'setAttribute', 'hasAttribute', 'removeAttribute', 'getPropertyValue', 'setProperty', 'removeProperty', 'closest', 'matches', 'querySelector', 'querySelectorAll', 'locator', '$', '$$', '$eval', '$$eval', 'getElementById', 'getElementsByClassName', 'getItem', 'setItem', 'removeItem', 'clsx', 'cn', 'classNames']);
function transformCode(src, file, kind) {
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, kind);
  const edits = [];
  const PROSE_KEYS = new Set(['hasText', 'hasNotText', 'text', 'label', 'title', 'placeholder', 'alt', 'says', 'dit', 'note', 'why', 'pourquoi', 'verdict', 'enonce', 'libelle', 'legende', 'quoi', 'what', 'heading', 'titre', 'nom', 'name', 'texte', 'message', 'description', 'product', 'produit', 'regle', 'rule', 'motif', 'reason', 'chapo', 'lede']);
  function proseCtx(n) {
    let p = n.parent;
    if (ts.isTemplateSpan(p)) p = p.parent;
    if (ts.isTemplateExpression(p)) { n = p; p = p.parent; }
    if (ts.isJsxExpression(p)) p = p.parent;
    if (ts.isJsxAttribute(p)) { const nm = p.name.getText(); return /^aria-/.test(nm) || ['title', 'placeholder', 'alt'].includes(nm); }
    if (ts.isPropertyAssignment(p) && p.initializer === n) return PROSE_KEYS.has(p.name.getText().replace(/["']/g, ''));
    if (ts.isConditionalExpression(p) || ts.isParenthesizedExpression(p) || ts.isBinaryExpression(p) || ts.isArrayLiteralExpression(p)) return proseCtx(p);
    return false;
  }
  function classyCtx(n) {
    let p = n.parent;
    if (ts.isTemplateSpan(p)) p = p.parent;
    if (ts.isTemplateExpression(p)) { n = p; p = p.parent; }
    if (ts.isJsxExpression(p)) p = p.parent;
    if (ts.isJsxAttribute(p)) { const nm = p.name.getText(); if (CLASSY_ATTRS.has(nm)) return true; if (nm.startsWith('data-') || nm === 'name') return !/\s/.test(n.text || ''); return false; }
    if (ts.isTemplateExpression(p)) return classyCtx(p);
    if (ts.isConditionalExpression(p) || ts.isBinaryExpression(p) || ts.isParenthesizedExpression(p) || ts.isArrayLiteralExpression(p)) return classyCtx(p);
    if (ts.isCallExpression(p) || ts.isNewExpression(p)) { const e = p.expression; const nm = ts.isPropertyAccessExpression(e) ? e.name.text : ts.isIdentifier(e) ? e.text : ''; if (['add', 'remove', 'toggle', 'contains', 'replace'].includes(nm) && ts.isPropertyAccessExpression(e) && /classList$/.test(e.expression.getText())) return true; if (['replace', 'replaceAll', 'RegExp', 'includes', 'startsWith', 'endsWith', 'indexOf', 'split'].includes(nm)) return 'code'; return CLASSY_CALLS.has(nm); }
    const noSpace = !/\s/.test(n.text || '');
    if (ts.isElementAccessExpression(p) && p.argumentExpression === n) return noSpace;
    if (ts.isComputedPropertyName(p)) return noSpace;
    if (ts.isPropertyAssignment(p) && p.name === n) return noSpace;
    return false;
  }
  function visit(n) {
    if (ts.isIdentifier(n) || ts.isPrivateIdentifier(n)) {
      seen(n.text);
      const t = translateIdent(n.text);
      if (t !== n.text) { edits.push([n.getStart(sf), n.getEnd(), t]); stats.ident++; }
      // shorthand { nom } → { name: name } would change semantics; TS keeps it as ShorthandPropertyAssignment : text edit keeps shorthand ✓
    } else if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) {
      const raw = src.slice(n.getStart(sf) + 1, n.getEnd() - 1);
      const t = embedded(raw, file) ?? translateStringy(raw, { classy: classyCtx(n), prose: !classyCtx(n) && proseCtx(n) });
      if (t !== raw) edits.push([n.getStart(sf) + 1, n.getEnd() - 1, t]);
    } else if (ts.isTemplateHead(n) || ts.isTemplateMiddle(n) || ts.isTemplateTail(n)) {
      const start = n.getStart(sf) + 1, end = n.getEnd() - (ts.isTemplateTail(n) ? 1 : 2);
      const raw = src.slice(start, end);
      const t = embedded(raw, file) ?? translateStringy(raw, { classy: classyCtx(n.parent), prose: !classyCtx(n.parent) && proseCtx(n.parent) });
      if (t !== raw) edits.push([start, end, t]);
    } else if (ts.isRegularExpressionLiteral(n)) {
      const raw = n.text; let t = raw.replace(RX_PROP, translateIdent).replace(RX_DATA, translateIdent);
      t = t.replace(/\\\.([a-zA-Z_][\w-]*)/g, (m, c) => '\\.' + translateIdent(c));
      t = t.replace(/\bfili\/([a-z][\w-]*)/g, (m, r) => 'fili/' + translateIdent(r));
      t = t.replace(/"([A-Za-z_$][\w]*)"(\s*):/g, (m, k, sp) => `"${translateIdent(k)}"${sp}:`);
      t = t.replace(/\\b([a-z][a-zA-Z0-9_]*)\\b/g, (m, w) => '\\b' + translateIdent(w) + '\\b');
      t = t.replace(/(?<![\w\\])([a-z][a-zA-Z0-9]*)(?=:\s*["'])/g, (m, w) => translateIdent(w));
      t = t.replace(/\\\{([a-z][a-zA-Z0-9]*)\\\}/g, (m, w) => '\\{' + translateIdent(w) + '\\}');
      t = t.replace(/(?<![\\\w])([a-z]+(?:-[a-z0-9]+)+)(?![\w-])/g, (m) => translateIdent(m));
      if (t !== raw) edits.push([n.getStart(sf), n.getEnd(), t]);
    }
    ts.forEachChild(n, visit);
  }
  visit(sf);
  return applyEdits(src, edits);
}
function applyEdits(src, edits) {
  edits.sort((a, b) => b[0] - a[0]);
  let out = src, last = Infinity;
  for (const [s, e, t] of edits) { if (e > last) continue; out = out.slice(0, s) + t + out.slice(e); last = s; }
  return out;
}

/* ───── CSS ───── */
function transformCss(src) {
  // masque commentaires et chaînes (sauf grid-template-areas)
  const masks = [];
  let s = src.replace(/\/\*[\s\S]*?\*\//g, m => { masks.push(m); return ` ${masks.length - 1} `; });
  s = s.replace(/grid-template-areas\s*:\s*([^;]+);/g, (m, v) => 'grid-template-areas: ' + v.replace(/"([^"]*)"/g, (q, inner) => '"' + inner.split(/\s+/).map(w => w === '.' ? w : translateIdent(w)).join(' ') + '"') + ';');
  s = s.replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, m => { masks.push(m); return ` ${masks.length - 1} `; });
  const before = s;
  s = s.replace(RX_PROP, m => translateIdent(seen(m)));
  s = s.replace(/(?<![-\d])\.(-?[a-zA-Z_][\w-]*)/g, (m, c) => /^\d/.test(c) ? m : '.' + translateIdent(seen(c)));
  s = s.replace(/(?<![\w-])#([a-zA-Z_][\w-]*)(?![0-9a-fA-F]*[;,)\s}])/g, (m, c) => '#' + translateIdent(c));
  s = s.replace(/\[(data-[a-z][\w-]*)(\s*[*^$|~]?=\s*)?( \d+ |[\w-]+)?\]/g, (m, a, op, v) => `[${translateIdent(a)}${op ? op + (v && !v.startsWith(' ') ? translateIdent(v) : v ?? '') : ''}]`);
  s = s.replace(/@keyframes\s+([\w-]+)/g, (m, k) => '@keyframes ' + translateIdent(k));
  s = s.replace(/(animation(?:-name)?\s*:\s*)([^;]+)/g, (m, p, v) => p + v.replace(/[a-zA-Z_][\w-]*/g, w => KEYFRAMES.has(w) ? translateIdent(w) : w));
  s = s.replace(/(grid-(?:area|row|column)(?:-start|-end)?\s*:\s*)([^;]+)/g, (m, p, v) => p + v.replace(/(?<![\w-])([a-z][\w-]*)(?![\w-])/g, w => ['span', 'auto', 'inherit', 'initial', 'unset'].includes(w) ? w : translateIdent(w)));
  if (s !== before) stats.css++;
  s = s.replace(/ (\d+) /g, (m, i) => {
    const str = masks[+i];
    if (str.startsWith('/*')) return str;
    // chaînes CSS : attributs data-* dans les sélecteurs et var(--x) dans content
    return str.replace(RX_PROP, translateIdent).replace(RX_DATA, translateIdent);
  });
  return s;
}

/* ───── JSON ───── */
function transformJson(src) {
  const before = src;
  const walkJ = v => {
    if (Array.isArray(v)) return v.map(walkJ);
    if (v && typeof v === 'object') { const o = {}; for (const k of Object.keys(v)) o[translateIdent(seen(k))] = walkJ(v[k]); return o; }
    if (typeof v === 'string') { const t = translateStringy(v); return t; }
    return v;
  };
  const out = JSON.stringify(walkJ(JSON.parse(src)), null, 2) + (src.endsWith('\n') ? '\n' : '');
  if (out !== before) stats.json++;
  return out;
}

/* ───── HTML ───── */
function transformHtml(src, file) {
  let s = src;
  s = s.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/g, (m, css) => m.replace(css, transformCss(css)));
  // fragments de gabarit : un <style> ouvert sans fermeture, ou fermé sans ouverture
  if (/<style\b[^>]*>/.test(s) && !/<\/style>/.test(s)) { const i = s.search(/<style\b[^>]*>/); const j = s.indexOf('>', i) + 1; s = s.slice(0, j) + transformCss(s.slice(j)); }
  else if (/<\/style>/.test(s) && !/<style\b/.test(s)) { const j = s.indexOf('</style>'); s = transformCss(s.slice(0, j)) + s.slice(j); }
  s = s.replace(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g, (m, js) => m.replace(js, transformCode(js, file + '.js', ts.ScriptKind.JS)));
  s = s.replace(/<(?!script|style|\/)[a-zA-Z][^<>]*(?:>|$)/g, tag => tag
    .replace(/\b(class|id|for|aria-controls|aria-labelledby|aria-describedby)=("|')([^"']*)\2/g, (m, a, q, v) => `${a}=${q}${v.split(/(\s+)/).map(t => /^\s+$/.test(t) || !t ? t : translateIdent(t)).join('')}${q}`)
    .replace(/\b(data-[a-z][\w-]*)(=("|')([^"']*)\3)?/g, (m, a, eq, q, v) => translateIdent(a) + (eq ? `=${q}${TOKENISH.test(v) ? translateStringy(v) : v}${q}` : ''))
    .replace(/\bstyle=("|')([^"']*)\1/g, (m, q, v) => `style=${q}${v.replace(RX_PROP, translateIdent)}${q}`)
    .replace(/\b(href|src)=("|')([^"']*)\2/g, (m, a, q, v) => /^(https?:|\/\/|#|mailto)/.test(v) || v.startsWith('/') ? m : `${a}=${q}${translatePath(v.split(/[?#]/)[0]) + v.slice(v.split(/[?#]/)[0].length)}${q}`));
  s = s.replace(RX_PROP, translateIdent);
  if (s !== src) stats.html++;
  return s;
}

/* ───── Markdown ───── */
function transformMd(src) {
  let s = src;
  s = s.replace(/```(\w*)\n([\s\S]*?)```/g, (m, lang, body) => {
    if (/^(css)$/.test(lang)) return '```' + lang + '\n' + transformCss(body) + '```';
    if (/^(js|ts|tsx|jsx|mjs|javascript|typescript)$/.test(lang)) return '```' + lang + '\n' + transformCode(body, 'x.' + (lang === 'javascript' ? 'js' : lang === 'typescript' ? 'ts' : lang), lang.endsWith('sx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS) + '```';
    if (/^(json)$/.test(lang)) { try { return '```json\n' + transformJson(body) + '```'; } catch { return m; } }
    return m;
  });
  s = s.replace(/`([^`\n]+)`/g, (m, inner) => '`' + mdInline(inner) + '`');
  if (s !== src) stats.md++;
  return s;
}
function mdInline(inner) {
  {
    const t = inner
      .replace(RX_PROP, translateIdent).replace(RX_DATA, translateIdent)
      .replace(/(?<![\w./-])((?:\.{1,2}\/)?(?:[\w.-]+\/)+[\w.-]+)/g, p => /\.md$/.test(p) || /^claude\//.test(p) ? p : translatePath(p))
      .replace(/\bnpm run ([a-z]+(?::[a-z-]+)+)/g, (m, sc) => 'npm run ' + sc.split(':').map(translateIdent).join(':'))
      .replace(/(?<![\w-])([a-zA-Z_][\w]*(?:-[\w]+)+)(?![\w-]|\.md\b)/g, k => translateIdent(k))
      .replace(/(?<![\w.])([a-z][A-Za-z0-9]*)\s*(?=\()/g, fn => translateIdent(fn))
      .replace(/(?<![\w.-])([a-z]+[A-Z][A-Za-z0-9]*)(?![\w-])/g, c => translateIdent(c))
      .replace(/(?<![\w.-])([A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+)(?![\w-])/g, c => translateIdent(c))
      .replace(/(?<![\w-])\.([a-zA-Z_][\w-]*)/g, (m2, c) => KNOWN_CLASSES.has(c) ? '.' + translateIdent(c) : m2)
      .replace(/(?<![\w./-])([\w-]+\.(?:tsx?|mjs|js|css|json|html))(?![\w-])/g, f => translatePath(f));
    return t;
  }
}

/* ───── passe ───── */
const outputs = new Map(); // newPath → content
const renames = [];
const SEEN_BY_FILE = new Map();
for (const f of files) {
  const r = rel(f); const ext = path.extname(f);
  CURRENT_SCOPE = scopeFor(r);
  SEEN = new Set(); SEEN_BY_FILE.set(r, SEEN);
  let src = fs.readFileSync(f, 'utf8'); let out = src;
  try {
    if (ext === '.tsx') out = transformCode(src, f, ts.ScriptKind.TSX);
    else if (ext === '.ts') out = transformCode(src, f, ts.ScriptKind.TS);
    else if (ext === '.mjs' || ext === '.js') out = transformCode(src, f, ts.ScriptKind.JS);
    else if (ext === '.css') out = transformCss(src);
    else if (ext === '.json') out = transformJson(src);
    else if (ext === '.html') out = transformHtml(src, f);
    else if (ext === '.md') out = transformMd(src);
  } catch (e) { console.error('ÉCHEC', r, e.message); }
  if (r === 'temoin/tools/fili/LISEZMOI.md') { /* nom traduit par translatePath via le dictionnaire (lisezmoi → readme) */ }
  const nr = translatePath(r);
  if (nr !== r) renames.push([r, nr]);
  outputs.set(nr, { out, changed: out !== src, from: r });
}

/* ───── collisions ───── */
const collisions = [];
for (const [r, ids] of SEEN_BY_FILE) {
  CURRENT_SCOPE = scopeFor(r);
  const byTarget = new Map();
  for (const id of ids) { const t = translateIdent(id); if (!byTarget.has(t)) byTarget.set(t, new Set()); byTarget.get(t).add(id); }
  for (const [t, origins] of byTarget) if (origins.size > 1) collisions.push(`${r} : ${t} ← ${[...origins].join(' | ')}`);
}
CURRENT_SCOPE = null;
console.log(`fichiers lus : ${files.length} · modifiés : ${[...outputs.values()].filter(o => o.changed).length} · renommés : ${renames.length}`);
console.log('remplacements', stats);
console.log('\n── renommages ──'); for (const [a, b] of renames) console.log(`${a} → ${b}`);
console.log('\n── collisions possibles (' + collisions.length + ') ──'); for (const c of collisions.sort()) console.log(c);

fs.writeFileSync(path.join(process.env.HOME || '/tmp', 'mig-strings.log'), STRING_LOG.join('\n') + '\n');
if (WRITE) {
  for (const [nr, { out, from }] of outputs) {
    const target = path.join(ROOT, nr);
    if (nr !== from) { fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, out); fs.unlinkSync(path.join(ROOT, from)); }
    else if (out !== fs.readFileSync(target, 'utf8')) fs.writeFileSync(target, out);
  }
  // dossiers vides laissés derrière
  (function prune(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) if (e.isDirectory() && !/node_modules|\.git/.test(e.name)) { const p = path.join(d, e.name); prune(p); if (fs.readdirSync(p).length === 0) fs.rmdirSync(p); } })(ROOT);
  fs.writeFileSync(path.join(ROOT, 'docs/migration-code-en.renommages.json'), JSON.stringify(Object.fromEntries(renames), null, 2) + '\n');
  console.log('\nécrit.');
}
