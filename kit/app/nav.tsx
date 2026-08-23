export function Navigation({ actif }: { actif: "accueil" | "rythme" }) {
  return (
    <aside className="navigation">
      <a href="/" className={actif === "accueil" ? "actif" : ""}>Accueil</a>
      <span className="groupe">Fondations</span>
      <a href="/rythme" className={actif === "rythme" ? "actif" : ""}>Rythme</a>
      <span className="venir">Typographie — à venir</span>
      <span className="venir">Arrondis · Tactile · Couleur · Bordures — écrites, en attente d&apos;entrée</span>
      <span className="groupe">Plus tard</span>
      <span className="venir">Composants &amp; patterns — après le verrou des fondations</span>
    </aside>
  );
}
