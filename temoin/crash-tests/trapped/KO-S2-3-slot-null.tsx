import { StateAsync } from '../design-system/index.ts'
import { useRequest } from '../design-system/data/useRequest.js'

export function KOS23() {
  const request = useRequest('/factures')
  return <StateAsync request={request} loading={<p>…</p>} error={null} empty={<p>Rien</p>} children={(d) => <p>{d.length}</p>} />
}
