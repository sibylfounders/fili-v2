/* Zone système. Une page est une suite de Section : c'est la règle R4.1. */
export function Section({ density, head, background, children, ...rest }) {
  return (
    <section className={`section density-${density}${background ? ' hollow' : ''}`} data-density={density} data-head={head ? 'oui' : undefined} {...rest}>
      <div className="content">{children}</div>
    </section>
  )
}
