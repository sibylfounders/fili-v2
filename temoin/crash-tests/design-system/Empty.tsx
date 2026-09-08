export function Empty({ heading, children }) {
  return (
    <div className="empty">
      <h3 className="t3">{heading}</h3>
      <div className="empty-body">{children}</div>
    </div>
  )
}
