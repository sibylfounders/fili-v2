import fs from "fs";
import path from "path";

/**
 * Lecture des graphes de flow — projections produites par `tools/extrait-flow.mjs`
 * depuis `content/md/flows/*-UX.md`. Niveau 2 : ne jamais écrire ici à la main.
 */

const RACINE = path.join(process.cwd(), "content", "flows");

export type Verdict =
  | "couvert"
  | "partiel"
  | "en attente d'un arbitrage"
  | "à traiter"
  | "sans rattachement";

export type Intervention = { cas: string; statut: string; proprietaire: string | null };

export type Moment = {
  id: string;
  index: number;
  titre: string;
  conditionnel: boolean;
  precision: string | null;
  texte: string;
  /** Cas d'usage rattachés par citation littérale du § dans l'inventaire. */
  casRattaches: string[];
  interventions: Intervention[];
  verdict: Verdict;
};

export type SousEtat = { id: string; libelle: string };

export type Etat = {
  id: string;
  libelle: string;
  precision: string | null;
  sousEtats: SousEtat[];
  entree: string;
  sortie: string;
};

export type Transition = {
  de: string | null;
  vers: string;
  dans?: string;
  nature: "sequence" | "bifurcation";
  libelle?: string;
  visible?: string | null;
  focus?: string | null;
  saisie?: string | null;
  condition?: string | null;
};

export type Bifurcation = { id: string; depuis: string; vers: string };

export type Extension = { slug: string; titre: string; couverture: string[] };

export type Frontiere = { domaine: string; proprietaire: string; duFlow: boolean };

export type Cas = {
  famille: string;
  cas: string;
  description: string;
  statut: string;
  proprietaire: string | null;
  /** Le § de la fiche cité par l'inventaire, quand il y en a un. */
  section?: string | null;
};

/** Cas rattachés à un § que ne porte aucun moment : transversaux au parcours. */
export type Transversal = { section: string; cas: string[] };

export type Graphe = {
  flow: string;
  version: string;
  source: { fiche: string; inventaire: string | null; empreinte: string };
  moments: Moment[];
  etats: Etat[];
  transitions: Transition[];
  bifurcations: Bifurcation[];
  extensions: Extension[];
  frontieres: Frontiere[];
  couverture: Cas[];
  transversal: Transversal[];
  /** Les branches du OU d'entrée, lues dans le texte du premier moment. */
  methodes: string[];
  resume: Record<string, number>;
  aArbitrer: string[];
  nonLu: string[];
};

export function slugsFlows(): string[] {
  if (!fs.existsSync(RACINE)) return [];
  return fs
    .readdirSync(RACINE)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""))
    .sort();
}

export function graphe(slug: string): Graphe | undefined {
  const p = path.join(RACINE, `${slug}.json`);
  if (!fs.existsSync(p)) return undefined;
  return JSON.parse(fs.readFileSync(p, "utf8")) as Graphe;
}

export function tousLesGraphes(): Graphe[] {
  return slugsFlows()
    .map((s) => graphe(s))
    .filter((g): g is Graphe => Boolean(g));
}

/** Un flow n'est diagrammable que si sa fiche porte une machine à états lisible. */
export const diagrammable = (g: Graphe) => g.etats.length > 0 && g.transitions.length > 0;
