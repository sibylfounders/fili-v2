/* Zone système. Une page est une suite de Section : c'est la règle R4.1. */
export function Section({ densite, tete, fond, children, ...reste }) {
  return (
    <section className={`section densite-${densite}${fond ? ' creux' : ''}`} data-density={densite} data-tete={tete ? 'oui' : undefined} {...reste}>
      <div className="contenu">{children}</div>
    </section>
  )
}
