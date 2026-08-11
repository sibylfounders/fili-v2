export function Squelette({ forme = 'lignes', lignes = 3 }) {
  if (forme === 'titre') return <div className="squelette" aria-busy="true" aria-live="polite"><div className="squelette-titre" /></div>
  return (
    <div className="squelette" aria-busy="true" aria-live="polite">
      {Array.from({ length: lignes }).map((_, i) => <div key={i} className="squelette-ligne" />)}
    </div>
  )
}
