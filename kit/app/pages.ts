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

export type Etat = "⚪" | "🟡" | "🟢";

export type Page = {
  nom: string;
  /* L'adresse dans le kit. Absente : la page est à venir. */
  chemin?: string;
  etat?: Etat;
  /* Une phrase pour la carte de l'accueil : ce que la page prouve. */
  dit?: string;
  /* La phrase du pied du rail : la page a le droit d'avoir de l'esprit
     dans sa marge (verdict d'Auteur, 2 septembre). */
  pied?: string;
};
export type Paquet = { nom: string; pages: Page[] };
export type Famille = { nom: string; colonnes: Paquet[][] };
export type Categorie = { cle: string; nom: string; familles?: Famille[]; dit?: string };

const p = (nom: string, reste: Omit<Page, "nom"> = {}): Page => ({ nom, ...reste });

export const CATEGORIES: Categorie[] = [
  { cle: "systeme", nom: "Système", familles: [
    { nom: "Méthode", colonnes: [[{ nom: "Méthode", pages: [
      p("Pourquoi ce projet"), p("Process"), p("Vérification"), p("Audit du corpus"),
    ] }]] },
    { nom: "Principes", colonnes: [[{ nom: "Principes", pages: [
      p("Accessibilité"), p("Adaptatif"), p("Charge cognitive"), p("Lois UX"),
      p("Performance perçue"), p("Validation et récupération"),
    ] }]] },
    { nom: "Langages", colonnes: [[{ nom: "Langages", pages: [
      p("E-motion"), p("Gestes"), p("Interaction"), p("Voix & ton"),
    ] }]] },
    /* Signe et Geste tiennent dans la même colonne : quatre paquets sur
       quatre colonnes obligeaient Fondations à passer à la ligne, et une
       famille sur deux lignes casse la rangée (verdict du 2 septembre). */
    { nom: "Fondations", colonnes: [
      [{ nom: "Espace", pages: [
        p("Rythme", { chemin: "/rythme", etat: "🟡",
          dit: "Deux axes, des crans déclarés — chaque distance de la page a une raison.",
          pied: "Aucune valeur n'a été tapée à la main. Aucune." }),
        p("Espacement"), p("Grille"),
        p("Composition", { chemin: "/composition", etat: "🟡",
          dit: "Le chemin de l'œil, l'écran qu'on casse, le bon et le mauvais côte à côte.",
          pied: "Votre œil suit un chemin. On l'a tracé avant lui." }),
      ] }],
      [{ nom: "Matière", pages: [
        p("Couleur", { chemin: "/couleur", etat: "🟡",
          dit: "Des rôles, jamais des valeurs — chaque rapport mesuré sur la page rendue.",
          pied: "Une couleur décide, les autres suivent." }),
        p("Surfaces"), p("Bordures"),
        p("Arrondis", { chemin: "/arrondis", etat: "🟡",
          dit: "Un coin ne se choisit pas, il se déduit — un seul nombre engendre la chaîne.",
          pied: "Un coin faux se voit de l'autre bout de la pièce." }),
        p("Élévation"),
      ] }],
      [{ nom: "Signe", pages: [
        p("Typographie", { chemin: "/typo", etat: "🟡",
          dit: "Deux voix, une échelle, une mesure — chaque lettre de la page sait pourquoi.",
          pied: "Deux fontes seulement. C'est déjà une opinion." }),
        p("Iconographie"),
      ] },
      /* Le mouvement a quitté les langages le 7 septembre 2026 (arbitrage
         délégué par l'Auteur) : depuis qu'il est une matière du moteur —
         quatre durées, une courbe, consommées par toutes les pages — c'est
         une fondation, sous Geste. Un langage dit comment le produit parle ;
         une fondation, de quoi il est fait. */
      { nom: "Geste", pages: [
        p("Mouvement", { chemin: "/mouvement", etat: "🟡",
          dit: "Quatre durées, une courbe — et chacune sait où elle va.",
          pied: "Ce que vous ne voyez pas, vous le sentez quand même." }),
        p("Tactile"), p("Superpositions"),
      ] }],
    ] },
  ] },
  { cle: "produit", nom: "Produit", familles: [
    { nom: "Composants", colonnes: [
      [{ nom: "Commandes", pages: [p("Bouton"), p("Champ"), p("Case à cocher"), p("Interrupteur"), p("Sélecteur")] }],
      [{ nom: "Navigation", pages: [p("Onglets"), p("Fil d'Ariane"), p("Pagination")] }],
      [{ nom: "Affichage", pages: [p("Table"), p("Card"), p("Étiquette"), p("Avatar")] }],
      [{ nom: "Retours", pages: [p("Dialogue"), p("Infobulle"), p("Bandeau"), p("Barre de progression")] }],
    ] },
    { nom: "Patterns", colonnes: [
      [{ nom: "Écrans", pages: [p("Tableau de bord"), p("Formulaire long"), p("Liste filtrable"),
        p("Assistant pas à pas"), p("Recherche")] }],
      [{ nom: "États", pages: [p("Page vide"), p("Page d'erreur"), p("Chargement")] }],
    ] },
  ] },
  { cle: "contact", nom: "Contact",
    dit: "À venir — par où joindre l'équipe du kit, et par où proposer une règle, une correction ou une pièce." },
  { cle: "telechargements", nom: "Téléchargements",
    dit: "À venir — les jetons pour le code et pour Figma, le paquet du kit, et la charte à lire hors ligne." },
];

/* ── Ce qu'on lit dans la liste ── */

/* La clé d'une page ouverte est son chemin sans la barre : "/typo" → "typo".
   C'est le nom que les pages donnent au rail. */
export const cleDe = (page: Page) => page.chemin?.replace(/^\//, "") ?? null;

/* Les pages d'une famille, dans l'ordre de lecture (colonne par colonne). */
export const pagesDe = (f: Famille): Page[] =>
  f.colonnes.flatMap((col) => col.flatMap((paquet) => paquet.pages));

/* Toutes les familles, toutes catégories confondues, dans l'ordre. */
export const FAMILLES: Famille[] = CATEGORIES.flatMap((c) => c.familles ?? []);

/* Toutes les pages ouvertes du kit, dans l'ordre des familles. */
export const OUVERTES: Page[] = FAMILLES.flatMap(pagesDe).filter((pg) => pg.chemin);

/* La première page ouverte d'une famille — là où mène son nom. */
export const premiereDe = (f: Famille): Page | undefined => pagesDe(f).find((pg) => pg.chemin);

/* Le chemin inverse : de la clé d'une page vers sa famille et sa catégorie. */
export function familleDe(cle: string): { categorie: Categorie; famille: Famille } | null {
  for (const categorie of CATEGORIES) {
    for (const famille of categorie.familles ?? []) {
      if (pagesDe(famille).some((pg) => cleDe(pg) === cle)) return { categorie, famille };
    }
  }
  return null;
}
export const pageDe = (cle: string): Page | undefined => OUVERTES.find((pg) => cleDe(pg) === cle);
