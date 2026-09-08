/* Zone système : c'est ici que la mécanique d'état s'écrit — et nulle part ailleurs. */
export function StateAsync({ request, loading, error, empty, children }) {
  if (request.loading) return loading
  if (request.error) return error
  if (!request.data || request.data.length === 0) return empty
  return children(request.data)
}
