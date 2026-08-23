import { useRequete } from '../design-system/donnees/useRequete.js'

export function KOS21() {
  const { donnees } = useRequete('/factures')
  return <ul>{donnees.map((d) => <li key={d.id}>{d.libelle}</li>)}</ul>
}
