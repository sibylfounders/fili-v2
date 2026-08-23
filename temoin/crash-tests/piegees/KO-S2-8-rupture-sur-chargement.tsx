import { EtatAsync } from '../design-system/index.ts'
import { useRequete } from '../design-system/donnees/useRequete.js'

export function KOS28() {
  const requete = useRequete('/factures')
  return (
    <EtatAsync
      requete={requete}
      erreur={<p>Erreur</p>}
      vide={<p>Rien</p>}
      enfants={(d) => <p>{d.length}</p>}
      data-intent="statement"
      data-intent-slot="chargement"
      data-intent-reason="la réponse est instantanée, il n'y a rien à montrer"
    />
  )
}
