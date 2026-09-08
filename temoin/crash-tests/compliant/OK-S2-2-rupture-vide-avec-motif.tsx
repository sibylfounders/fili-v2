import { StateAsync } from '../design-system/index.ts'
import { useRequest } from '../design-system/data/useRequest.js'

export function OKS22() {
  const request = useRequest('/etapes')
  return (
    <StateAsync
      request={request}
      loading={<p>Chargement…</p>}
      error={<p>Les étapes n'ont pas pu être chargées. Réessayer.</p>}
      children={(steps) => <p>{steps.length} étapes</p>}
      data-intent="statement"
      data-intent-slot="empty"
      data-intent-reason="le contrat serveur garantit au moins une étape : l'état vide est structurellement impossible"
    />
  )
}
