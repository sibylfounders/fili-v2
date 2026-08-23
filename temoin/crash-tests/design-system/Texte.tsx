export function Texte({ variante = 'corps', children }) {
  return <p className={`txt txt-${variante}`}>{children}</p>
}
