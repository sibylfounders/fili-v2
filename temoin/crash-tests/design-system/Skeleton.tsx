export function Skeleton({ shape = 'lines', lines = 3 }) {
  if (shape === 'heading') return <div className="skeleton" aria-busy="true" aria-live="polite"><div className="skeleton-heading" /></div>
  return (
    <div className="skeleton" aria-busy="true" aria-live="polite">
      {Array.from({ length: lines }).map((_, i) => <div key={i} className="skeleton-line" />)}
    </div>
  )
}
