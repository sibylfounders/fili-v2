// Générateur — Node pur. Source unique → 3 sorties (CSS, thème Tailwind, variables Figma).
// Aucune valeur n'est écrite à la main dans les sorties : tout vient de tokens.source.mjs.

import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  primitives, alpha, semantic, states,
  typography, spacing, radius, elevation, motion, grid, border, breakpoint, zIndex, overlay, meta,
  transversal, componentTokens,
} from "../src/tokens.source.mjs";

const DIST = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
mkdirSync(DIST, { recursive: true });

const resolve = (ref) => {
  const [fam, step] = ref.split(".");
  return primitives[fam][step];
};

// Rôles sémantiques À PLAT (noms d'autorité) → { name: {light, dark} }
const roles = {};
for (const [name, modes] of Object.entries(semantic))
  roles[name] = { light: resolve(modes.light), dark: resolve(modes.dark) };

// ── 1. tokens.css ────────────────────────────────────────────────────────────
let css = `/* GÉNÉRÉ depuis tokens.source.mjs — NE PAS ÉDITER. ${meta.name} */\n:root {\n`;
css += `  /* primitives */\n`;
for (const [fam, steps] of Object.entries(primitives))
  for (const [step, hex] of Object.entries(steps))
    css += `  --${fam}-${step}: ${hex};\n`;
for (const [k, v] of Object.entries(alpha)) css += `  --${k}: ${v};\n`;
css += `\n  /* rôles sémantiques — MODE CLAIR */\n`;
for (const [name, m] of Object.entries(roles)) css += `  --${name}: ${m.light};\n`;
css += `\n  /* typographie */\n`;
css += `  --font-sans: ${typography.fontFamily.sans};\n`;
css += `  --font-mono: ${typography.fontFamily.mono};\n`;
css += `  --font-label: ${typography.fontFamily.label};\n`;
for (const [k, v] of Object.entries(typography.heading)) css += `  --text-${k}: ${v};\n`;
for (const [k, v] of Object.entries(typography.size)) css += `  --size-${k}: ${v};\n`;
for (const [k, v] of Object.entries(typography.weight)) css += `  --weight-${k}: ${v};\n`;
for (const [k, v] of Object.entries(typography.icon)) css += `  --icon-${k}: ${v};\n`;
css += `\n  /* espacement */\n`;
for (const [k, v] of Object.entries(spacing)) css += `  --space-${k}: ${v};\n`;
css += `\n  /* rayon */\n`;
for (const [k, v] of Object.entries(radius)) css += `  --radius-${k}: ${v};\n`;
css += `\n  /* élévation */\n`;
for (const [k, v] of Object.entries(elevation)) css += `  --elevation-${k}: ${v};\n`;
css += `\n  /* motion — durées + courbes */\n`;
for (const [k, v] of Object.entries(motion.duration)) css += `  --duration-${k}: ${v};\n`;
for (const [k, v] of Object.entries(motion.easing)) css += `  --${k}: ${v};\n`;
css += `\n  /* grille — largeurs de conteneur */\n`;
for (const [k, v] of Object.entries(grid)) css += `  --${k}: ${v};\n`;
css += `\n  /* z-index — ordre des couches (DS-MD overlay 1.30.0) */\n`;
for (const [k, v] of Object.entries(zIndex)) css += `  --z-${k}: ${v};\n`;
css += `\n  /* overlay — voile modal */\n  --scrim: ${overlay.scrim};\n`;
css += `\n  /* breakpoints (référence CSS — les bascules réelles passent par les screens Tailwind) */\n`;
for (const [k, v] of Object.entries(breakpoint)) css += `  --breakpoint-${k}: ${v};\n`;
css += `\n  /* bordure / focus ring */\n`;
for (const [k, v] of Object.entries(border)) css += `  --${k}: ${v};\n`;

// Rôles transversaux (étage 2) et alias de composant (étage 3) — valeurs = var(--…) :
// la cascade est mécanique, un rôle maître se propage à ses consommateurs.
const flatModal = (groups, prefixFn) => {
  const light = [], dark = [];
  for (const [grp, toks] of Object.entries(groups))
    for (const [k, v] of Object.entries(toks)) {
      const name = prefixFn(grp, k);
      if (v && typeof v === "object") { light.push([name, v.light]); dark.push([name, v.dark]); }
      else light.push([name, v]);
    }
  return { light, dark };
};
const tv = flatModal(transversal, (g, k) => `${g}-${k}`);
const ct = flatModal(componentTokens, (g, k) => `${g}-${k}`);
css += `\n  /* étage 2 — rôles transversaux (cascade mécanique) */\n`;
for (const [k, v] of tv.light) css += `  --${k}: ${v};\n`;
css += `\n  /* étage 3 — alias de composant → rôles transversaux */\n`;
for (const [k, v] of ct.light) css += `  --${k}: ${v};\n`;
css += `}\n\n`;
css += `/* rôles sémantiques — MODE SOMBRE (data-theme + prefers) */\n`;
css += `[data-theme="dark"] {\n`;
for (const [name, m] of Object.entries(roles)) css += `  --${name}: ${m.dark};\n`;
for (const [k, v] of [...tv.dark, ...ct.dark]) css += `  --${k}: ${v};\n`;
css += `}\n\n@media (prefers-color-scheme: dark) {\n  :root:not([data-theme="light"]) {\n`;
for (const [name, m] of Object.entries(roles)) css += `    --${name}: ${m.dark};\n`;
for (const [k, v] of [...tv.dark, ...ct.dark]) css += `    --${k}: ${v};\n`;
css += `  }\n}\n`;
writeFileSync(join(DIST, "tokens.css"), css);

// ── 2. thème Tailwind (CJS) — les couleurs pointent vers les vars → modes gratuits ──
const primGroup = (fam) => Object.fromEntries(
  Object.keys(primitives[fam]).map((s) => [s, `var(--${fam}-${s})`]));

// Chaque rôle d'AUTORITÉ (à plat) devient une couleur Tailwind de premier niveau →
// classes bg-primary, text-text-primary, border-border-strong, bg-danger-subtle, ring-accent…
const colors = { transparent: "transparent", current: "currentColor", inherit: "inherit" };
for (const n of Object.keys(roles)) colors[n] = `var(--${n})`;
for (const fam of Object.keys(primitives)) if (fam !== "static") colors[`p-${fam}`] = primGroup(fam);
colors.scrim = "var(--scrim)";

/**
 * CE QUE LE THÈME REND SUBSTITUABLE — décidé le 2026-07-31 (fiche de manque
 * « variabilisation du thème », arbitrage Aurélien : « une ambiance, ce n'est justement pas
 * que la couleur »).
 *
 * Règle : tout axe qui a un token CSS traverse Tailwind en `var(--…)`, jamais en littéral.
 * Sans ça, surcharger une variable sur un conteneur ne déplace rien — les classes utilitaires
 * ont déjà été compilées en dur, et seuls les consommateurs CSS suivent. C'est ce qui rendait
 * couleur et rayon thémables (2026-07-29) pendant que les quatre autres axes restaient gelés.
 *
 * Substituables : couleur · rayon · espacement · famille · graisse · titrage · élévation ·
 * durée · courbe.
 *
 * NON substituables, et c'est nommé plutôt que masqué :
 *   - les crans de texte COURANT (`text-xs/sm/base/lg/xl`). Les défauts de Tailwind y portent
 *     un interlignage ; les remplacer par une chaîne le PERDRAIT, et le socle n'a aucun token
 *     d'interlignage à mettre à la place. À rouvrir avec une fiche « tokens d'interlignage ».
 *   - `font-bold`. Aucun `--weight-bold` n'existe. Deux usages résiduels, à résorber plutôt
 *     qu'à consacrer par un token de commodité.
 */
const theme = {
  colors,
  // THÉMABLE — voir la note de tête « Ce que le thème rend substituable ».
  fontFamily: Object.fromEntries(Object.keys(typography.fontFamily).map((k) => [k, `var(--font-${k})`])),
  fontSize: {
    ...Object.fromEntries(Object.keys(typography.heading).map((k) => [k, `var(--text-${k})`])),
    // le cran micro rejoint les classes texte (text-2xs) — les autres crans (xs..xl)
    // coïncident avec l'échelle Tailwind par défaut, 2xs est une extension.
    "2xs": "var(--size-2xs)",
  },
  // GRAISSE — absente du thème jusqu'au 2026-07-31 : `font-medium` et `font-semibold`
  // tombaient sur les défauts de Tailwind alors que `--weight-*` existait déjà en CSS.
  // `bold` n'est PAS repris : aucun token ne le porte (deux usages résiduels, à résorber).
  fontWeight: {
    normal: "var(--weight-regular)",
    medium: "var(--weight-medium)",
    semibold: "var(--weight-semibold)",
  },
  spacing: Object.fromEntries(Object.keys(spacing).map((k) => [k, `var(--space-${k})`])),
  // Rayon THÉMABLE de bout en bout : les classes rounded-* pointent vers var(--radius-*)
  // (le réglage « Rayon » du panneau Theming surcharge ces vars — avant, les classes Tailwind
  // étaient compilées en px durs et seuls les consommateurs CSS suivaient. Fix 2026-07-29).
  borderRadius: {
    ...Object.fromEntries(Object.entries(radius).map(([k]) => [k, `var(--radius-${k})`])),
    // Rôles transversaux + alias de composant : rounded-control, rounded-surface,
    // rounded-overlay, rounded-button, rounded-input, rounded-card…
    ...Object.fromEntries(Object.entries(transversal)
      .filter(([, toks]) => "radius" in toks).map(([g]) => [g, `var(--${g}-radius)`])),
    ...Object.fromEntries(Object.entries(componentTokens)
      .filter(([, toks]) => "radius" in toks).map(([g]) => [g, `var(--${g}-radius)`])),
  },
  boxShadow: Object.fromEntries(Object.keys(elevation).map((k) => [k, `var(--elevation-${k})`])),
  transitionDuration: Object.fromEntries(Object.keys(motion.duration).map((k) => [k, `var(--duration-${k})`])),
  // La variable CSS porte la clé BRUTE (`--ease-out`, mais `--spring` : la source ne préfixe
  // pas cette dernière). La classe, elle, reste `ease-out` / `ease-spring`.
  transitionTimingFunction: Object.fromEntries(
    Object.keys(motion.easing).map((k) => [k.replace(/^ease-/, ""), `var(--${k})`])),
  maxWidth: {
    ...Object.fromEntries(Object.entries(grid).filter(([k]) => !k.startsWith("rail-"))),
    menu: "var(--overlay-menu-max)", // max-w-menu — largeur des menus ancrés
  },
  screens: { ...breakpoint },
  width: Object.fromEntries(Object.entries(grid).filter(([k]) => k.startsWith("rail-"))),
  minWidth: Object.fromEntries(Object.entries(grid).filter(([k]) => k.startsWith("rail-"))),
  flexBasis: Object.fromEntries(Object.entries(grid).filter(([k]) => k.startsWith("rail-"))),
  zIndex: { ...zIndex },
};
writeFileSync(join(DIST, "tailwind.theme.cjs"),
  `// GÉNÉRÉ depuis tokens.source.mjs — NE PAS ÉDITER.\nmodule.exports = ${JSON.stringify(theme, null, 2)};\n`);

// ── 3. variables Figma (interchange) — collections + modes ─────────────────────
const figma = {
  collections: [
    {
      name: "Primitives", modes: ["Value"],
      variables: Object.entries(primitives).flatMap(([fam, steps]) =>
        Object.entries(steps).map(([step, hex]) =>
          ({ name: `${fam}/${step}`, type: "color", valuesByMode: { Value: hex } }))),
    },
    {
      name: "Semantic", modes: ["Light", "Dark"],
      variables: Object.entries(roles).map(([name, m]) =>
        ({ name: name.replace(/-/g, "/"), type: "color",
           valuesByMode: { Light: m.light, Dark: m.dark } })),
    },
    {
      name: "Motion", modes: ["Value"],
      variables: [
        ...Object.entries(motion.duration).map(([k, v]) =>
          ({ name: `duration/${k}`, type: "float", valuesByMode: { Value: parseFloat(v) } })), // ms
        ...Object.entries(motion.easing).map(([k, v]) =>
          ({ name: `easing/${k.replace(/^ease-/, "")}`, type: "string", valuesByMode: { Value: v } })),
      ],
    },
    {
      name: "Grid", modes: ["Value"],
      variables: Object.entries(grid).filter(([k]) => k.startsWith("container-")).map(([k, v]) =>
        ({ name: `container/${k.replace(/^container-/, "")}`, type: "float", valuesByMode: { Value: parseFloat(v) } })), // px
    },
    {
      name: "Radius", modes: ["Value"],
      variables: Object.entries(radius).map(([k, v]) =>
        ({ name: k, type: "float", valuesByMode: { Value: parseFloat(v) } })), // px (pill = 9999)
    },
    {
      name: "Spacing", modes: ["Value"],
      variables: Object.entries(spacing).map(([k, v]) =>
        ({ name: k, type: "float", valuesByMode: { Value: parseFloat(v) } })), // px
    },
    {
      name: "Border", modes: ["Value"],
      variables: Object.entries(border).map(([k, v]) =>
        ({ name: k.replace(/-/g, "/"), type: "float", valuesByMode: { Value: parseFloat(v) } })), // px
    },
  ],
};
writeFileSync(join(DIST, "figma-variables.json"), JSON.stringify(figma, null, 2));

const nRoles = Object.keys(roles).length;
const nPrims = Object.values(primitives).reduce((a, s) => a + Object.keys(s).length, 0);
console.log(`Généré dans dist/ :`);
console.log(`  tokens.css            (${nPrims} primitives + ${nRoles} rôles × 2 modes)`);
console.log(`  tailwind.theme.cjs    (couleurs → var(), modes automatiques)`);
console.log(`  figma-variables.json  (Primitives[Value] + Semantic[Light,Dark])`);
