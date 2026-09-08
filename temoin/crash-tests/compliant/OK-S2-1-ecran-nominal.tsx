import { StateAsync } from '../design-system/index.ts'
import { useRequest } from '../design-system/data/useRequest.js'

export function OKS21() {
  const request = useRequest('/factures')
  return (
    <StateAsync
      request={request}
      loading={<p>Chargement des factures…</p>}
      error={<p>Les factures n'ont pas pu être chargées. Réessayer.</p>}
      empty={<p>Aucune facture pour le moment.</p>}
      children={(invoices) => <p>{invoices.length} factures</p>}
    />
  )
}
