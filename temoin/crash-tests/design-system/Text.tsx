export function Text({ variant = 'body', children }) {
  return <p className={`txt txt-${variant}`}>{children}</p>
}
