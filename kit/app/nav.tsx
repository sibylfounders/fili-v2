export function Navigation({ active }: { active: "accueil" | "rythme" | "typo" | "couleur" | "arrondis" }) {
  return (
    <aside className="navigation">
      <a href="/" className={active === "accueil" ? "active" : ""}>Accueil</a>
      <span className="group">Fondations</span>
      <a href="/rythme" className={active === "rythme" ? "active" : ""}>Rythme</a>
      <a href="/typo" className={active === "typo" ? "active" : ""}>Typographie</a>
      <a href="/couleur" className={active === "couleur" ? "active" : ""}>Couleur</a>
      <a href="/arrondis" className={active === "arrondis" ? "active" : ""}>Arrondis</a>
      <span className="upcoming">Tactile · Bordures · Composition — écrites, en attente d&apos;entrée</span>
      <span className="group">Plus tard</span>
      <span className="upcoming">Composants &amp; patterns — après le verrou des fondations</span>
    </aside>
  );
}
