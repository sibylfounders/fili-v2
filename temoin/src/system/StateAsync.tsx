/* Zone système : c'est ici que la mécanique d'état s'écrit — et nulle part
   ailleurs (R2.4). Le conteneur ne « gère » rien : il rend l'oubli impossible.
   Les quatre slots sont obligatoires, et un slot rempli de rien coche la case
   sans rien dire à personne (R2.5).
   Le conteneur accepte les attributs de déclaration d'intention : c'est sur lui
   qu'une rupture de R2.7 se signe, à l'endroit exact où elle s'exerce. */
import type { ReactNode } from 'react'
import type { Request } from './data/useRequest.ts'

export function StateAsync<T>({
  request,
  loading,
  error,
  empty,
  children,
}: {
  request: Request<T>
  loading: ReactNode
  error: ReactNode
  empty: ReactNode
  children: (data: T) => ReactNode
} & Record<string, unknown>) {
  if (request.loading) return loading
  if (request.error !== null) return error
  if (request.data === null) return empty
  if (Array.isArray(request.data) && request.data.length === 0) return empty
  return children(request.data)
}
