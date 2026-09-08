export function Button({ children, onPress, variant = 'main' }) {
  return (
    <button type="button" className={`btn btn-${variant}`} onClick={onPress}>{children}</button>
  )
}
