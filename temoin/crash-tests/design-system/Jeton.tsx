export function Jeton({ ton = 'neutre', children }) {
  return (
    <span className={`jeton jeton-${ton}`}>
      <span className={`pastille pastille-${ton}`} aria-hidden="true" />
      {children}
    </span>
  )
}
