import { StateAsync } from '../design-system/index.ts'
import { useRequest } from '../design-system/data/useRequest.js'

export function KOS28() {
  const request = useRequest('/factures')
  return (
    <StateAsync
      request={request}
      error={<p>Erreur</p>}
      empty={<p>Rien</p>}
      children={(d) => <p>{d.length}</p>}
      data-intent="statement"
      data-intent-slot="loading"
      data-intent-reason="la réponse est instantanée, il n'y a rien à montrer"
    />
  )
}
