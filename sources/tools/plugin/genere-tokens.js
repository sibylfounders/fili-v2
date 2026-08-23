#!/usr/bin/env node
/**
 * tools/plugin/genere-tokens.js — génère tokens.css + tokens.yaml depuis le frontmatter
 * de apps/site/content/md/core/DESIGN.md (source de vérité unique du monorepo Fili).
 *
 * Usage :  node tools/plugin/genere-tokens.js [dossier-de-sortie]
 * Défaut du dossier de sortie : build/plugin/skills/design-system-md/
 *
 * Porté depuis `Design System MD/tools/genere-tokens.js` (2026-07-26). Seuls les chemins
 * changent : le parser, la table des groupes et les guardrails sont repris à l'identique —
 * la sortie doit rester octet pour octet celle de DS-MD à version de DESIGN.md égale.
 *
 * Convention de nommage :
 *   colors.primary              → --color-primary   (le groupe s'écrit "colors", les références "color.*")
 *   spacing.md                  → --spacing-md
 *   scale.desktop-min           → --scale-desktop-min
 *   typography.display.fontSize → --type-display-font-size
 *
 * Node sans aucune dépendance.
 */

'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const DESIGN_PATH = path.join(ROOT, 'apps', 'site', 'content', 'md', 'core', 'DESIGN.md');
const OUT_DIR = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(ROOT, 'build', 'plugin', 'skills', 'design-system-md');

// --- mini-parser YAML (sous-ensemble suffisant pour DESIGN.md) ---
function stripComment(line) {
  let inS = false, inD = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === "'" && !inD) inS = !inS;
    else if (c === '"' && !inS) inD = !inD;
    else if (c === '#' && !inS && !inD && (i === 0 || /\s/.test(line[i - 1]))) return line.slice(0, i);
  }
  return line;
}
function parseScalar(raw) {
  let v = raw.trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) return v.slice(1, -1);
  return v;
}
function parseFrontmatter(mdText) {
  const m = mdText.match(/^---\n([\s\S]*?)\n---/);
  if (!m) throw new Error('Pas de frontmatter dans DESIGN.md');
  const root = {};
  const stack = [{ indent: -1, obj: root }];
  for (const rawLine of m[1].split('\n')) {
    const line = stripComment(rawLine).replace(/\s+$/, '');
    if (!line.trim()) continue;
    const indent = line.match(/^\s*/)[0].length;
    const t = line.trim();
    const idx = t.indexOf(':');
    if (idx === -1) continue;
    const key = t.slice(0, idx).trim();
    const rest = t.slice(idx + 1).trim();
    while (stack.length && indent <= stack[stack.length - 1].indent) stack.pop();
    const parent = stack[stack.length - 1].obj;
    if (rest === '') { const child = {}; parent[key] = child; stack.push({ indent, obj: child }); }
    else parent[key] = parseScalar(rest);
  }
  return root;
}

const design = parseFrontmatter(fs.readFileSync(DESIGN_PATH, 'utf8'));
const kebab = s => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase().replace(/_/g, '-');

// groupe YAML → préfixe CSS ("colors" s'écrit color.* dans les fichiers, on garde ce singulier)
const GROUPS = {
  colors: 'color',
  spacing: 'spacing',
  scale: 'scale',
  radius: 'radius',
  elevation: 'elevation',
  media_ratio: 'media-ratio',
  breakpoint: 'breakpoint',
  measure: 'measure',
  border: 'border',
  control: 'control', // ajouté 2026-08-03 (DESIGN 1.35.0) — crans de couleur de l'anneau de focus : --control-focus-*
  icon: 'icon',
  motion: 'motion',
  grid: 'grid',
  'z-index': 'z',
  overlay: 'overlay',
  touch: 'touch',
};

fs.mkdirSync(OUT_DIR, { recursive: true });

// --- tokens.css --------------------------------------------------------------
const lines = [];
lines.push('/* tokens.css — GÉNÉRÉ par tools/plugin/genere-tokens.js depuis apps/site/content/md/core/DESIGN.md ' +
  `(version ${design.version || '?'}). NE PAS ÉDITER À LA MAIN : régénérer avec \`node tools/plugin/build-plugin.js\`. */`);
lines.push(':root {');
for (const [group, prefix] of Object.entries(GROUPS)) {
  const table = design[group];
  if (!table) continue;
  lines.push(`  /* ${group} */`);
  for (const [k, v] of Object.entries(table)) {
    if (typeof v !== 'string') continue;
    lines.push(`  --${prefix}-${kebab(k)}: ${v};`);
  }
}
if (design.typography) {
  lines.push('  /* typography */');
  for (const [style, props] of Object.entries(design.typography)) {
    if (typeof props !== 'object') continue;
    for (const [p, v] of Object.entries(props)) {
      if (p === 'note') continue;
      const cssVal = p === 'fontFamily' ? `"${v}"` : v; // les noms de police se citent
      lines.push(`  --type-${kebab(style)}-${kebab(p)}: ${cssVal};`);
    }
  }
}
lines.push('}');
lines.push('');
fs.writeFileSync(path.join(OUT_DIR, 'tokens.css'), lines.join('\n'));
console.log(`  tokens.css (${lines.length - 3} propriétés, DESIGN v${design.version})`);

// --- tokens.yaml -------------------------------------------------------------
// Dérivé du frontmatter de DESIGN.md : uniquement les groupes de tokens, commentaires
// préservés verbatim (source de vérité unique). En-tête auto-versionné + guardrails.
(function genereTokensYaml() {
  const raw = fs.readFileSync(DESIGN_PATH, 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!m) throw new Error('Pas de frontmatter dans DESIGN.md');
  // ATTENTION : cette liste et la table GROUPS ci-dessus doivent rester d'accord. Un groupe présent
  // dans DESIGN.md mais absent d'ICI est supprimé de tokens.yaml SANS ERREUR — c'est ce silence qui a
  // laissé `control.focus-*` hors distribution pendant cinq jours (cf. DESIGN.md 1.35.0, 2026-08-03).
  const GROUPES = new Set(['colors', 'typography', 'spacing', 'scale', 'breakpoint', 'measure', 'radius', 'elevation', 'media_ratio', 'border', 'control', 'icon', 'motion', 'grid', 'z-index', 'overlay', 'touch']);
  const corps = [];
  let garder = false;
  for (const ligne of m[1].split('\n')) {
    const indent = ligne.match(/^\s*/)[0].length;
    if (indent === 0 && /^[A-Za-z0-9_-]+\s*:/.test(ligne)) {
      const cle = ligne.slice(0, ligne.indexOf(':')).trim();
      garder = GROUPES.has(cle);
      if (garder) { if (corps.length) corps.push(''); corps.push(ligne); }
      continue;
    }
    if (garder) corps.push(ligne);
  }
  const v = design.version || '?';
  const entete =
    `# tokens.yaml — GÉNÉRÉ par tools/plugin/genere-tokens.js depuis DESIGN.md v${v} (frontmatter, valeurs uniquement).\n` +
    `# NE PAS ÉDITER À LA MAIN : régénérer avec \`node tools/plugin/build-plugin.js\`. Source de vérité : apps/site/content/md/core/DESIGN.md.\n`;
  const guardrails = [
    '',
    '# Guardrails (rappel — arbitrés dans DESIGN.md, cf. RULES-* pour le détail) :',
    '# - Jamais primary/accent pour un état sémantique — danger/success/warning/info ont leurs tokens.',
    "# - Bordure délimitante (seul signal d'un composant interactif) → border-strong (3:1) ; décorative → border.",
    '# - Jamais de valeur brute (hex, px) hors DESIGN.md. Contraste vérifié côté mainteneur au build ; node theme-gate.mjs (consommateur qui re-thématise — livré ici à côté de ce fichier).',
    "# - L'échelle d'espacement est fermée ; les états ne changent ni le trait ni le rayon ; repos à plat ; reduced-motion obligatoire.",
    '',
  ].join('\n');
  fs.writeFileSync(path.join(OUT_DIR, 'tokens.yaml'), entete + '\n' + corps.join('\n') + '\n' + guardrails);
  console.log(`  tokens.yaml (${GROUPES.size} groupes, DESIGN v${v})`);
})();

// --- theme-gate.mjs (barrière consommateur, voyage avec les tokens) -----------
(function copieThemeGate() {
  const src = path.join(__dirname, 'theme-gate.mjs');
  if (!fs.existsSync(src)) { console.warn('  ! theme-gate.mjs introuvable — non copié'); return; }
  fs.copyFileSync(src, path.join(OUT_DIR, 'theme-gate.mjs'));
  console.log('  theme-gate.mjs (barrière de re-thématisation côté consommateur)');
})();

module.exports = { version: design.version };
