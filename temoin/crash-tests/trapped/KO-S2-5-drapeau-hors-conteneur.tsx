import { StateAsync } from '../design-system/index.ts'
import { useRequest } from '../design-system/data/useRequest.js'

export function KOS25() {
  const { loading, data } = useRequest('/factures')
  if (loading) return <p>Chargement…</p>
  return <StateAsync request={data} loading={<p>…</p>} error={<p>Erreur</p>} empty={<p>Rien</p>} children={(d) => <p>{d.length}</p>} />
}
