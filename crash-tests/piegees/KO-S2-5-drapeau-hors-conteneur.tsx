import { EtatAsync } from '../design-system/index.ts'
import { useRequete } from '../design-system/donnees/useRequete.js'

export function KOS25() {
  const { chargement, donnees } = useRequete('/factures')
  if (chargement) return <p>Chargement…</p>
  return <EtatAsync requete={donnees} chargement={<p>…</p>} erreur={<p>Erreur</p>} vide={<p>Rien</p>} enfants={(d) => <p>{d.length}</p>} />
}
