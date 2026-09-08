/* L'espace est distribué par le conteneur, jamais réclamé par l'enfant — R3.2. */
export function Stack({ space = 4, children }) {
  return <div className={`stack e${space}`}>{children}</div>
}
export function Grid({ columns = 2, space = 5, children }) {
  return <div className={`grid col-${columns} e${space}`}>{children}</div>
}
