export function Navigation({ actif }: { actif: "accueil" | "rythme" | "typo" }) {
  return (
    <aside className="navigation">
      <a href="/" className={actif === "accueil" ? "actif" : ""}>Accueil</a>
      <span className="groupe">Fondations</span>
      <a href="/rythme" className={actif === "rythme" ? "actif" : ""}>Rythme</a>
      <a href="/typo" className={actif === "typo" ? "actif" : ""}>Typographie</a>
      <span className="venir">Arrondis · Tactile · Couleur · Bordures — écrites, en attente d&apos;entrée</span>
      <span className="groupe">Plus tard</span>
      <span className="venir">Composants &amp; patterns — après le verrou des fondations</span>
    </aside>
  );
}
