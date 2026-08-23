/* La taille découle du niveau. Aucune surcharge locale — R4.5. */
export function Titre({ niveau, children }) {
  if (niveau === 1) return <h1 className="t1">{children}</h1>
  if (niveau === 2) return <h2 className="t2">{children}</h2>
  return <h3 className="t3">{children}</h3>
}
