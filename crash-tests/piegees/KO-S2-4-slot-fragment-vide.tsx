import { EtatAsync } from '../design-system/index.ts'
import { useRequete } from '../design-system/donnees/useRequete.js'

export function KOS24() {
  const requete = useRequete('/factures')
  return <EtatAsync requete={requete} chargement={<p>…</p>} erreur={<p>Erreur</p>} vide={<></>} enfants={(d) => <p>{d.length}</p>} />
}
