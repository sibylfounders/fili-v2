/* Zone système : c'est ici que la mécanique d'état s'écrit — et nulle part ailleurs. */
export function EtatAsync({ requete, chargement, erreur, vide, enfants }) {
  if (requete.chargement) return chargement
  if (requete.erreur) return erreur
  if (!requete.donnees || requete.donnees.length === 0) return vide
  return enfants(requete.donnees)
}
