export function Chip({ tone = 'neutral', children }) {
  return (
    <span className={`token token-${tone}`}>
      <span className={`dot dot-${tone}`} aria-hidden="true" />
      {children}
    </span>
  )
}
