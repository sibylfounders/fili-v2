import { StateAsync } from '../design-system/index.ts'
import { useRequest } from '../design-system/data/useRequest.js'

export function KOS24() {
  const request = useRequest('/factures')
  return <StateAsync request={request} loading={<p>…</p>} error={<p>Erreur</p>} empty={<></>} children={(d) => <p>{d.length}</p>} />
}
