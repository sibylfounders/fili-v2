export function Vide({ titre, children }) {
  return (
    <div className="vide">
      <h3 className="t3">{titre}</h3>
      <div className="vide-corps">{children}</div>
    </div>
  )
}
