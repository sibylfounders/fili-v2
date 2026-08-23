import { EtatAsync } from '../design-system/index.ts'
import { useRequete } from '../design-system/donnees/useRequete.js'

export function KOS23() {
  const requete = useRequete('/factures')
  return <EtatAsync requete={requete} chargement={<p>…</p>} erreur={null} vide={<p>Rien</p>} enfants={(d) => <p>{d.length}</p>} />
}
