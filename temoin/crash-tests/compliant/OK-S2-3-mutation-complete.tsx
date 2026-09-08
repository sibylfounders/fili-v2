import { Button } from '../design-system/index.ts'
import { useMutation } from '../design-system/data/useRequest.js'

export function OKS23() {
  const { launch, inWaiting, error } = useMutation('/factures')
  return (
    <div>
      <Button onPress={launch}>{inWaiting ? 'Envoi en cours…' : 'Envoyer'}</Button>
      {error ? <p>L'envoi a échoué. Réessayer.</p> : null}
    </div>
  )
}
