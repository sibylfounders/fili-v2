/* ── LA LISTE DES PAGES — une seule, lue partout (7 septembre 2026).

   Avant, le site portait DEUX listes : celle du menu (dans le rail) et
   celle de l'accueil (écrite à la main dans la page, avec des états déjà
   périmés et deux fondations oubliées). Elles ne pouvaient que diverger.
   Désormais une seule liste vit ici ; le menu, le rail et l'accueil la
   lisent. Créer une page = ajouter une ligne ; changer un état = changer
   un signe. Rien d'autre à toucher.

   Deux catégories (Système, Produit), six familles dans l'ordre d'Auteur
   (7 septembre) : Méthode, Principes, Langages, Fondations ; Composants,
   Patterns. Les familles viennent du corpus (sources/apps/site/content/md).
   Une famille se pose en COLONNES ; une colonne porte un ou plusieurs
   paquets. Les paquets décident de la répartition, ils ne se nomment pas
   dans le menu (verdict d'Auteur, 2 septembre).

   L'état d'une page est ÉCRIT ICI, à la main, à chaque verdict d'Auteur —
   c'est la carte du système (docs/system-map.md) qui fait foi, jamais une
   machine : ⚪ idée · 🟡 en cours · 🟢 verrouillé. Une page sans chemin
   existe au corpus, pas encore dans le kit : elle se pose, elle ne se
   clique pas. ── */

export type State = "⚪" | "🟡" | "🟢";

export type Page = {
  name: string;
  /* L'adresse dans le kit. Absente : la page est à venir. */
  path?: string;
  state?: State;
  /* Une phrase pour la carte de l'accueil : ce que la page prouve. */
  says?: string;
  /* La phrase du pied du rail : la page a le droit d'avoir de l'esprit
     dans sa marge (verdict d'Auteur, 2 septembre). */
  foot?: string;
};
export type Batch = { name: string; pages: Page[] };
export type Family = { name: string; columns: Batch[][] };
export type Category = { key: string; name: string; families?: Family[]; says?: string };

const p = (name: string, rest: Omit<Page, "name"> = {}): Page => ({ name, ...rest });

export const CATEGORIES: Category[] = [
  { key: "system", name: "Système", families: [
    { name: "Méthode", columns: [[{ name: "Méthode", pages: [
      p("Pourquoi ce projet"), p("Process"), p("Vérification"), p("Audit du corpus"),
    ] }]] },
    { name: "Principes", columns: [[{ name: "Principes", pages: [
      p("Accessibilité"),
      p("Adaptation", { path: "/adaptation", state: "🟡",
        says: "La zone, pas la fenêtre — un seuil est une somme de largeurs de travail, jamais un palier.",
        foot: "Un composant ne sait pas où est la fenêtre. Il sait combien de place il a." }),
      p("Charge cognitive"), p("Lois UX"),
      p("Performance perçue"), p("Validation et récupération"),
    ] }]] },
    { name: "Langages", columns: [[{ name: "Langages", pages: [
      p("E-motion"), p("Gestes"), p("Interaction"), p("Voix & ton"),
    ] }]] },
    /* Signe et Geste tiennent dans la même colonne : quatre paquets sur
       quatre colonnes obligeaient Fondations à passer à la ligne, et une
       famille sur deux lignes casse la rangée (verdict du 2 septembre). */
    { name: "Fondations", columns: [
      [{ name: "Espace", pages: [
        p("Rythme", { path: "/rythme", state: "🟡",
          says: "Deux axes, des crans déclarés — chaque distance de la page a une raison.",
          foot: "Aucune valeur n'a été tapée à la main. Aucune." }),
        p("Espacement"), p("Grille"),
        p("Composition", { path: "/composition", state: "🟡",
          says: "Le chemin de l'œil, l'écran qu'on casse, le bon et le mauvais côte à côte.",
          foot: "Votre œil suit un chemin. On l'a tracé avant lui." }),
      ] }],
      [{ name: "Matière", pages: [
        p("Couleur", { path: "/couleur", state: "🟡",
          says: "Des rôles, jamais des valeurs — chaque rapport mesuré sur la page rendue.",
          foot: "Une couleur décide, les autres suivent." }),
        p("Surfaces"), p("Bordures"),
        p("Arrondis", { path: "/arrondis", state: "🟡",
          says: "Un coin ne se choisit pas, il se déduit — un seul nombre engendre la chaîne.",
          foot: "Un coin faux se voit de l'autre bout de la pièce." }),
        p("Élévation"),
      ] }],
      [{ name: "Signe", pages: [
        p("Typographie", { path: "/typo", state: "🟡",
          says: "Deux voix, une échelle, une mesure — chaque lettre de la page sait pourquoi.",
          foot: "Deux fontes seulement. C'est déjà une opinion." }),
        p("Iconographie"),
      ] },
      /* Le mouvement a quitté les langages le 7 septembre 2026 (arbitrage
         délégué par l'Auteur) : depuis qu'il est une matière du moteur —
         quatre durées, une courbe, consommées par toutes les pages — c'est
         une fondation, sous Geste. Un langage dit comment le produit parle ;
         une fondation, de quoi il est fait. */
      { name: "Geste", pages: [
        p("Mouvement", { path: "/mouvement", state: "🟡",
          says: "Quatre durées, une courbe — et chacune sait où elle va.",
          foot: "Ce que vous ne voyez pas, vous le sentez quand même." }),
        p("Tactile"), p("Superpositions"),
      ] }],
    ] },
  ] },
  { key: "product", name: "Produit", families: [
    { name: "Composants", columns: [
      [{ name: "Commandes", pages: [p("Bouton"), p("Champ"), p("Case à cocher"), p("Interrupteur"), p("Sélecteur")] }],
      [{ name: "Navigation", pages: [p("Onglets"), p("Fil d'Ariane"), p("Pagination")] }],
      [{ name: "Affichage", pages: [p("Table"), p("Card"), p("Étiquette"), p("Avatar")] }],
      [{ name: "Retours", pages: [p("Dialogue"), p("Infobulle"), p("Bandeau"), p("Barre de progression")] }],
    ] },
    { name: "Patterns", columns: [
      [{ name: "Écrans", pages: [p("Tableau de bord"), p("Formulaire long"), p("Liste filtrable"),
        p("Assistant pas à pas"), p("Recherche")] }],
      [{ name: "États", pages: [p("Page vide"), p("Page d'erreur"), p("Chargement")] }],
    ] },
  ] },
  { key: "contact", name: "Contact",
    says: "À venir — par où joindre l'équipe du kit, et par où proposer une règle, une correction ou une pièce." },
  { key: "telechargements", name: "Téléchargements",
    says: "À venir — les tokens pour le code et pour Figma, le paquet du kit, et la charte à lire hors ligne." },
];

/* ── Ce qu'on lit dans la liste ── */

/* La clé d'une page ouverte est son chemin sans la barre : "/typo" → "typo".
   C'est le nom que les pages donnent au rail. */
export const keyOf = (page: Page) => page.path?.replace(/^\//, "") ?? null;

/* Les pages d'une famille, dans l'ordre de lecture (colonne par colonne). */
export const pagesOf = (f: Family): Page[] =>
  f.columns.flatMap((col) => col.flatMap((batch) => batch.pages));

/* Toutes les familles, toutes catégories confondues, dans l'ordre. */
export const FAMILIES: Family[] = CATEGORIES.flatMap((c) => c.families ?? []);

/* Toutes les pages ouvertes du kit, dans l'ordre des familles. */
export const OPEN: Page[] = FAMILIES.flatMap(pagesOf).filter((pg) => pg.path);

/* La première page ouverte d'une famille — là où mène son nom. */
export const firstOneOf = (f: Family): Page | undefined => pagesOf(f).find((pg) => pg.path);

/* Le chemin inverse : de la clé d'une page vers sa famille et sa catégorie. */
export function familyOf(key: string): { category: Category; family: Family } | null {
  for (const category of CATEGORIES) {
    for (const family of category.families ?? []) {
      if (pagesOf(family).some((pg) => keyOf(pg) === key)) return { category, family };
    }
  }
  return null;
}
export const pageOf = (key: string): Page | undefined => OPEN.find((pg) => keyOf(pg) === key);
