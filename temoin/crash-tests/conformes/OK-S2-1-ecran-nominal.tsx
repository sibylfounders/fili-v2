import { EtatAsync } from '../design-system/index.ts'
import { useRequete } from '../design-system/donnees/useRequete.js'

export function OKS21() {
  const requete = useRequete('/factures')
  return (
    <EtatAsync
      requete={requete}
      chargement={<p>Chargement des factures…</p>}
      erreur={<p>Les factures n'ont pas pu être chargées. Réessayer.</p>}
      vide={<p>Aucune facture pour le moment.</p>}
      enfants={(factures) => <p>{factures.length} factures</p>}
    />
  )
}
