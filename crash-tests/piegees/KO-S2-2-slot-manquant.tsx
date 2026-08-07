import { EtatAsync } from '../design-system/index.ts'
import { useRequete } from '../design-system/donnees/useRequete.js'

export function KOS22() {
  const requete = useRequete('/factures')
  return <EtatAsync requete={requete} chargement={<p>…</p>} vide={<p>Rien</p>} enfants={(d) => <p>{d.length}</p>} />
}
