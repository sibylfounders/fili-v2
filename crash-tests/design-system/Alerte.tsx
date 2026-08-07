export function Alerte({ titre, children }) {
  return (
    <div className="alerte" role="status">
      <h3 className="t3 alerte-titre">{titre}</h3>
      <div className="alerte-corps">{children}</div>
    </div>
  )
}
