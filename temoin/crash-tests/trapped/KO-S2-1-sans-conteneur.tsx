import { useRequest } from '../design-system/data/useRequest.js'

export function KOS21() {
  const { data } = useRequest('/factures')
  return <ul>{data.map((d) => <li key={d.id}>{d.label}</li>)}</ul>
}
