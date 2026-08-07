export function Squelette({ lignes = 3 }) {
  return (
    <div className="squelette" aria-busy="true" aria-live="polite">
      {Array.from({ length: lignes }).map((_, i) => <div key={i} className="squelette-ligne" />)}
    </div>
  )
}
