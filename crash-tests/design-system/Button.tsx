export function Button({ children, onPress, variante = 'principal' }) {
  return (
    <button type="button" className={`btn btn-${variante}`} onClick={onPress}>{children}</button>
  )
}
