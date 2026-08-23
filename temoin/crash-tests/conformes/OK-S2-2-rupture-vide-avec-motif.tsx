import { EtatAsync } from '../design-system/index.ts'
import { useRequete } from '../design-system/donnees/useRequete.js'

export function OKS22() {
  const requete = useRequete('/etapes')
  return (
    <EtatAsync
      requete={requete}
      chargement={<p>Chargement…</p>}
      erreur={<p>Les étapes n'ont pas pu être chargées. Réessayer.</p>}
      enfants={(etapes) => <p>{etapes.length} étapes</p>}
      data-intent="statement"
      data-intent-slot="vide"
      data-intent-reason="le contrat serveur garantit au moins une étape : l'état vide est structurellement impossible"
    />
  )
}
