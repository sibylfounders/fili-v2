import fs from "fs";
import path from "path";

const ROOT = path.join(process.cwd(), "content", "audit");
export type Doc = { slug: string; category: string; title: string; body: string };

function readCat(cat: string): Doc[] {
  const dir = path.join(ROOT, cat);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const body = fs.readFileSync(path.join(dir, f), "utf8");
      const slug = f.replace(/\.md$/, "");
      const m = body.match(/^#\s+(.+)$/m);
      return { slug, category: cat, title: m ? m[1] : slug, body };
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}
export function auditIntro(): string {
  const p = path.join(ROOT, "index.md");
  return fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "# Audit";
}
export function docsByCategory() { return { protocoles: readCat("protocoles"), regles: readCat("regles") }; }
export function allDocs(): Doc[] { return [...readCat("protocoles"), ...readCat("regles")]; }
export function allSlugs(): string[] { return allDocs().map((d) => d.slug); }
export function getDoc(slug: string): Doc | undefined { return allDocs().find((d) => d.slug === slug); }
