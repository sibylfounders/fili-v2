import fs from "fs";
import path from "path";
import { fiche } from "./doctrine";

/**
 * Doctrine — lecture du contenu migré de DS-MD (`content/md/`).
 * Le sujet est l'unité : une paire UX/UI (+ son inventaire de cas d'usage).
 * Le socle (DESIGN/DECISIONS/METHODE) et la méthode (pourquoi/process/vérification)
 * sont des documents simples.
 */

const ROOT = path.join(process.cwd(), "content", "md");

export type Layer = "ux" | "ui";

export type Nature = {
  dossier: string;
  label: string;
  pluriel: string;
  section: "core" | "application";
};

/** Ordre canonique, repris de DS-MD (tools/site/data.js). */
export const NATURES: Nature[] = [
  { dossier: "principles", label: "Principe", pluriel: "Principes", section: "core" },
  { dossier: "languages", label: "Langage", pluriel: "Langages", section: "core" },
  { dossier: "foundations", label: "Fondation", pluriel: "Fondations", section: "core" },
  { dossier: "components", label: "Composant", pluriel: "Composants", section: "application" },
  { dossier: "patterns", label: "Pattern", pluriel: "Patterns", section: "application" },
  { dossier: "flows", label: "Flow", pluriel: "Flows", section: "application" },
];

/** Inventaires (nommés en français) → sujet (slug anglais). */
const INVENTAIRES: Record<string, string> = {
  accessibilite: "accessibility", accordion: "accordion", adaptive: "adaptive", alert: "alert",
  bordure: "border", bouton: "button", card: "card", "charge-cognitive": "cognitive-load",
  collection: "collection", couleur: "color", "creation-compte": "creation-compte",
  elevation: "elevation", emotion: "emotion", espacement: "spacing", form: "form",
  gesture: "gesture", grid: "grid", iconographie: "iconography", input: "input",
  interaction: "interaction", link: "link", lois: "laws", motion: "motion",
  navigation: "navigation", overlay: "overlay", performance: "performance", radius: "radius",
  select: "select", switch: "switch", touch: "touch", typographie: "typography",
  voix: "voice", whitespace: "spacing", validation: "validation",
  modal: "modal", tabs: "tabs", consentement: "consentement", surface: "surface",
};

export type Meta = {
  version?: string;
  last_updated?: string;
  confidence?: string;
  type?: string;
  companion?: string;
};

export type Doc = { title: string; body: string; meta: Meta };

export type Sujet = {
  slug: string;
  nature: Nature;
  title: string;
  meta: Meta;
  ux?: Doc;
  ui?: Doc;
  inventaires: Doc[];
};

export type SimpleDoc = { slug: string; title: string; body: string; meta: Meta };

// ── lecture bas niveau ──────────────────────────────────────────────────────

function read(rel: string): string | null {
  const p = path.join(ROOT, rel);
  return fs.existsSync(p) ? fs.readFileSync(p, "utf8") : null;
}

function list(dir: string): string[] {
  const p = path.join(ROOT, dir);
  return fs.existsSync(p) ? fs.readdirSync(p).filter((f) => f.endsWith(".md")).sort() : [];
}

/** Frontmatter YAML plat : on ne garde que les clés utiles, commentaires `#` coupés. */
function frontmatter(src: string): { meta: Meta; body: string } {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { meta: {}, body: src };
  const meta: Meta = {};
  const KEYS = ["version", "last_updated", "confidence", "type", "companion"] as const;
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([a-z_]+)\s*:\s*(.*)$/);
    if (!kv) continue;
    const key = kv[1] as (typeof KEYS)[number];
    if (!KEYS.includes(key)) continue;
    const value = kv[2].split(" #")[0].trim().replace(/^["']|["']$/g, "");
    if (value) meta[key] = value;
  }
  return { meta, body: src.slice(m[0].length) };
}

/** Retire le premier titre de niveau 1 (repris dans l'en-tête de page). */
function stripH1(body: string): { title?: string; rest: string } {
  const m = body.match(/^\s*#\s+(.+?)\s*$/m);
  if (!m) return { rest: body.trim() };
  return { title: m[1], rest: (body.slice(0, m.index!) + body.slice(m.index! + m[0].length)).trim() };
}

function toDoc(src: string): Doc {
  const { meta, body } = frontmatter(src);
  const { title, rest } = stripH1(body);
  return { title: title ?? "", body: rest, meta };
}

/** « Couleur — Couche UX (fondation) » → « Couleur ». */
function nomCourt(titre: string, slug: string): string {
  const t = titre.split("—")[0].trim();
  return t || slug;
}

// ── référentiel ─────────────────────────────────────────────────────────────

let _sujets: Sujet[] | null = null;

export function sujets(): Sujet[] {
  if (_sujets) return _sujets;
  const out: Sujet[] = [];
  for (const nature of NATURES) {
    const parSlug = new Map<string, Sujet>();
    for (const file of list(nature.dossier)) {
      const m = file.match(/^(.+)-(UX|UI)\.md$/);
      if (!m) continue;
      const slug = m[1].toLowerCase();
      const layer = m[2].toLowerCase() as Layer;
      const doc = toDoc(read(`${nature.dossier}/${file}`)!);
      let s = parSlug.get(slug);
      if (!s) {
        s = { slug, nature, title: slug, meta: {}, inventaires: [] };
        parSlug.set(slug, s);
      }
      s[layer] = doc;
    }
    for (const s of parSlug.values()) {
      const ref = s.ux ?? s.ui!;
      s.title = nomCourt(ref.title, s.slug);
      s.meta = ref.meta;
      out.push(s);
    }
  }
  // inventaires rattachés à leur sujet
  const parSlug = new Map(out.map((s) => [s.slug, s]));
  for (const file of list("inventaires")) {
    const m = file.match(/^inventaire-cas-usage-(.+)\.md$/);
    if (!m) continue;
    const cible = INVENTAIRES[m[1]];
    const s = cible ? parSlug.get(cible) : undefined;
    if (s) s.inventaires.push(toDoc(read(`inventaires/${file}`)!));
  }
  out.sort((a, b) => a.title.localeCompare(b.title, "fr"));
  _sujets = out;
  return out;
}

export function sujet(slug: string): Sujet | undefined {
  return sujets().find((s) => s.slug === slug);
}

export function sujetsParNature(): { nature: Nature; items: Sujet[] }[] {
  const all = sujets();
  return NATURES.map((nature) => ({
    nature,
    // UNE seule dérivation de « la liste des sujets » : un sujet n'apparaît (vue d'ensemble
    // ET nav) que si sa fiche doctrine existe — donc que si sa page /md/<slug>/ est générée
    // (generateStaticParams lit slugsDoctrine). C'est le lien mort /md/chip/ du constat du
    // 2026-07-30 : CHIP-UX/UI.md existaient, chip.json non, et la vue d'ensemble promettait
    // une page jamais construite. Le jour où la fiche arrive, le sujet réapparaît seul.
    items: all.filter((s) => s.nature.dossier === nature.dossier && fiche(s.slug) !== undefined),
  })).filter((g) => g.items.length > 0);
}

// ── socle & méthode ─────────────────────────────────────────────────────────

const SOCLE: { slug: string; file: string; titre: string; sous: string }[] = [
  { slug: "design", file: "core/DESIGN.md", titre: "DESIGN", sous: "La source de vérité des valeurs — tokens, palettes, échelles." },
  { slug: "decisions", file: "core/DECISIONS.md", titre: "DECISIONS", sous: "Le journal des arbitrages : ancienne règle → nouvelle règle → pourquoi." },
  { slug: "methode", file: "core/METHODE.md", titre: "MÉTHODE", sous: "Comment une règle est écrite, éprouvée et versionnée." },
];

const METHODE: { slug: string; file: string; titre: string; sous: string }[] = [
  { slug: "pourquoi", file: "methode/POURQUOI.md", titre: "Pourquoi ce projet", sous: "La promesse, le mode d'emploi, la thèse et l'architecture." },
  { slug: "process", file: "methode/PROCESS.md", titre: "Process", sous: "Dix décisions, un pipeline, sept instruments." },
  { slug: "verification", file: "methode/VERIFICATION.md", titre: "Vérification", sous: "Ce qui est mesuré, ce qui reste manuel." },
];

function lire(reg: typeof SOCLE, slug: string): SimpleDoc | undefined {
  const e = reg.find((d) => d.slug === slug);
  if (!e) return undefined;
  const src = read(e.file);
  if (!src) return undefined;
  const { meta, body } = frontmatter(src);
  const { rest } = stripH1(body);
  return { slug: e.slug, title: e.titre, body: rest, meta };
}

export function socleIndex() { return SOCLE.map(({ slug, titre, sous }) => ({ slug, titre, sous })); }
export function methodeIndex() { return METHODE.map(({ slug, titre, sous }) => ({ slug, titre, sous })); }
export function socleDoc(slug: string) { return lire(SOCLE, slug); }
export function methodeDoc(slug: string) { return lire(METHODE, slug); }

/** Arbre de navigation sérialisable, consommé par la nav latérale (client). */
export type NavGroupe = {
  label: string;
  items: { slug: string; label: string; href: string; embleme?: string }[];
};

export function navTree(): NavGroupe[] {
  const groupes: NavGroupe[] = [
    {
      label: "Méthode",
      items: [
        ...methodeIndex().map((d) => ({ slug: d.slug, label: d.titre, href: `/md/methode/${d.slug}/` })),
        // Le socle est UNE page à volets (DESIGN / DECISIONS / MÉTHODE), rangée sous Méthode.
        { slug: "socle", label: "Socle", href: "/md/socle/" },
        // Sources : page propre (app/md/methode/sources/), pas un document markdown —
        // elle est donc déclarée ici à la main, comme le socle.
        { slug: "sources", label: "Sources", href: "/md/methode/sources/" },
      ],
    },
  ];
  for (const g of sujetsParNature()) {
    groupes.push({
      label: g.nature.pluriel,
      items: g.items.map((s) => ({
        slug: s.slug,
        label: s.title,
        href: `/md/${s.slug}/`,
        embleme: fiche(s.slug)?.embleme,
      })),
    });
  }
  return groupes;
}
