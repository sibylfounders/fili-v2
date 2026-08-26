export function Navigation({ actif }: { actif: "accueil" | "rythme" | "typo" | "couleur" | "arrondis" }) {
  return (
    <aside className="navigation">
      <a href="/" className={actif === "accueil" ? "actif" : ""}>Accueil</a>
      <span className="groupe">Fondations</span>
      <a href="/rythme" className={actif === "rythme" ? "actif" : ""}>Rythme</a>
      <a href="/typo" className={actif === "typo" ? "actif" : ""}>Typographie</a>
      <a href="/couleur" className={actif === "couleur" ? "actif" : ""}>Couleur</a>
      <a href="/arrondis" className={actif === "arrondis" ? "actif" : ""}>Arrondis</a>
      <span className="venir">Tactile · Bordures · Composition — écrites, en attente d&apos;entrée</span>
      <span className="groupe">Plus tard</span>
      <span className="venir">Composants &amp; patterns — après le verrou des fondations</span>
    </aside>
  );
}
