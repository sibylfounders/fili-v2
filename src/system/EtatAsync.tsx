/* Zone système : c'est ici que la mécanique d'état s'écrit — et nulle part
   ailleurs (R2.4). Le conteneur ne « gère » rien : il rend l'oubli impossible.
   Les quatre slots sont obligatoires, et un slot rempli de rien coche la case
   sans rien dire à personne (R2.5). */
import type { ReactNode } from 'react'
import type { Requete } from './donnees/useRequete.ts'

export function EtatAsync<T>({
  requete,
  chargement,
  erreur,
  vide,
  enfants,
}: {
  requete: Requete<T>
  chargement: ReactNode
  erreur: ReactNode
  vide: ReactNode
  enfants: (donnees: T) => ReactNode
}) {
  if (requete.chargement) return chargement
  if (requete.erreur !== null) return erreur
  if (requete.donnees === null) return vide
  if (Array.isArray(requete.donnees) && requete.donnees.length === 0) return vide
  return enfants(requete.donnees)
}
