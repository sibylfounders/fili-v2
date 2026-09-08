export function Alert({ heading, children }) {
  return (
    <div className="alert" role="status">
      <h3 className="t3 alert-heading">{heading}</h3>
      <div className="alert-body">{children}</div>
    </div>
  )
}
