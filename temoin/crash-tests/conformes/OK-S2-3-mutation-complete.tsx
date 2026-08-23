import { Button } from '../design-system/index.ts'
import { useMutation } from '../design-system/donnees/useRequete.js'

export function OKS23() {
  const { lancer, enAttente, erreur } = useMutation('/factures')
  return (
    <div>
      <Button onPress={lancer}>{enAttente ? 'Envoi en cours…' : 'Envoyer'}</Button>
      {erreur ? <p>L'envoi a échoué. Réessayer.</p> : null}
    </div>
  )
}
