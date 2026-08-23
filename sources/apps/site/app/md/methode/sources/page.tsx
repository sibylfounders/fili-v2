import fs from "fs";
import path from "path";
import { VueSources } from "./vue";

export type Entree = {
  nom: string;
  famille: string;
  url: string;
  description: string;
  monogramme: string;
  logo: string;
  citations: number;
  sujets: number;
};

export type Sources = {
  titre: string;
  lead: string;
  total_citations: number;
  total_hotes: number;
  familles: string[];
  entrees: Entree[];
};

const DOSSIER_LOGOS = path.join(process.cwd(), "public", "logos");

function sources(): Sources {
  const p = path.join(process.cwd(), "content", "doctrine", "sources.json");
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

/** Logos réellement déposés — lu une fois au rendu, pas un test par entrée. */
function logosPresents(): string[] {
  try {
    return fs.readdirSync(DOSSIER_LOGOS);
  } catch {
    return [];
  }
}

/**
 * Page Sources — SERVEUR : elle ne fait que lire le disque et passer des données
 * sérialisables à `vue.tsx`, qui porte toute la composition (cf. l'en-tête de ce fichier).
 */
export default function SourcesPage() {
  return <VueSources d={sources()} logos={logosPresents()} />;
}
