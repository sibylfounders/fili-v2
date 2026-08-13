import fs from "fs";
import path from "path";

/**
 * Doctrine — données de fiche extraites du site DS-MD généré (public/sujets/*.html)
 * vers `content/doctrine/<slug>.json`. Structure ouverte, prête à passer sous un CMS :
 * le rendu ne connaît que ces objets, jamais le HTML d'origine (hors illustrations
 * et démos générées, conservées telles quelles — ce sont des images).
 */

const ROOT = path.join(process.cwd(), "content", "doctrine");

export type Bloc = { titre: string; html: string };
export type Regle = { tag: string; html: string; id?: string };

/** Lien vers une source, tel que cité dans la bibliographie du fichier UX. */
export type Lien = { label: string; url: string | null };
export type Source = { ref: string; affirmation: string; liens: Lien[]; confiance: string };

/**
 * Décision sourcée — l'unité que DS Audit doit pouvoir citer : un identifiant stable,
 * le problème, la solution (la règle), les cas d'usage qui l'éprouvent, les sources.
 * `statut` est le statut de frontière : ce qu'un audit a le droit d'opposer à un tiers.
 */
export type StatutFrontiere = "universelle" | "identite" | "implementation" | "methode";
export type Decision = {
  id: string;
  /** `ux` = un arbitrage de design ; `ui` = une consigne d'implémentation. */
  couche: "ux" | "ui";
  /** La règle telle qu'elle est écrite pour le système — dense, avec ses renvois internes. */
  solution: string;
  /** La même, dite en une phrase pour quelqu'un d'extérieur : c'est elle qui part en rapport. */
  enonce: string;
  /** Critère vérifiable quand il existe — sans lui, pas de constat automatique possible. */
  mesure: string;
  /** L'expression exécutable de la MESURE, dans la grammaire `CRITERE`. Vide = non automatisable. */
  critere: string;
  /** L'état dans lequel la mesure est prise (`repos`, `soumission-vide`, `tabulation`). */
  scene: string;
  /** Ce que fait le secteur quand il fait autrement. La preuve qu'on a lu avant de choisir. */
  contre: string;
  probleme: string;
  statut: StatutFrontiere;
  statutLibelle: string;
  interne: boolean;
  sources: Source[];
  /** La source qu'un rapport affiche (la première citée). */
  principale: Source | null;
  confiance: string;
  cas: { id: string; titre: string; famille: string }[];
};
export type Cas = {
  id: string;
  titre: string;
  quand: string;
  statut: string | null;
  lien: string;
  kicker: string;
  visuel: string | null;
  blocs: Bloc[];
  sourceRegles: string;
  regles: Regle[];
};
export type Famille = { kicker: string; titre: string; visuel: string | null; cas: Cas[] };
export type Chapeau = { kicker: string; titre: string; lead: string };
export type Token = { token: string; ref: string; valeur: string; couleur: string | null };

export type Fiche = {
  slug: string;
  nom: string;
  nature: string;
  embleme: string;
  meta: string;
  confiance: string;
  onglets: { id: string; label: string }[];
  essentiel: {
    kicker: string;
    question: string;
    detail: string;
    titreRegles: string;
    regles: { num: string; texte: string }[];
    preuves: { valeur: string; libelle: string }[];
    rules: { nom: string; source: string };
  };
  casChapeau: Chapeau;
  cas: Famille[];
  specs: Chapeau & { css: string; specimens: string[]; tokens: Token[] };
  evolution: { date: string; titre: string; html: string }[];
  /** Présent sur les sujets passés au format « décisions sourcées » (pilote : border). */
  decisions?: Decision[];
};

let _slugs: string[] | null = null;

/**
 * `content/doctrine/` héberge aussi des données qui ne sont PAS des fiches — `sources.json`
 * alimente la page propre `/md/methode/sources/`. Une fiche se reconnaît à ses volets :
 * sans ce filtre, `generateStaticParams` réclamait une page `/md/sources` et le build
 * de production tombait sur `f.cas` absent.
 */
function estFiche(x: unknown): x is Fiche {
  const f = x as Partial<Fiche> | undefined | null;
  return !!f && typeof f.slug === "string" && Array.isArray(f.cas);
}

export function slugsDoctrine(): string[] {
  if (_slugs) return _slugs;
  _slugs = fs.existsSync(ROOT)
    ? fs
        .readdirSync(ROOT)
        .filter((f) => f.endsWith(".json"))
        .map((f) => f.replace(/\.json$/, ""))
        .filter((slug) => fiche(slug) !== undefined)
        .sort()
    : [];
  return _slugs;
}

const _cache = new Map<string, Fiche | undefined>();

/** Lecture mémoïsée : la nav réclame les 33 fiches à chaque page rendue au build. */
export function fiche(slug: string): Fiche | undefined {
  if (_cache.has(slug)) return _cache.get(slug);
  const p = path.join(ROOT, `${slug}.json`);
  const brut: unknown = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : undefined;
  const f = estFiche(brut) ? brut : undefined;
  _cache.set(slug, f);
  return f;
}

export function nbCas(f: Fiche): number {
  return f.cas.reduce((n, fam) => n + fam.cas.length, 0);
}
