/* L'espace est distribué par le conteneur, jamais réclamé par l'enfant — R3.2. */
export function Pile({ espace = 4, children }) {
  return <div className={`pile e${espace}`}>{children}</div>
}
export function Grille({ colonnes = 2, espace = 5, children }) {
  return <div className={`grille col-${colonnes} e${espace}`}>{children}</div>
}
