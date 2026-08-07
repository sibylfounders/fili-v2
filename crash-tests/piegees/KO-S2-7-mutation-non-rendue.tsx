import { Button } from '../design-system/index.ts'
import { useMutation } from '../design-system/donnees/useRequete.js'

export function KOS27() {
  const { lancer, enAttente, erreur } = useMutation('/factures')
  return <Button onPress={lancer}>Envoyer</Button>
}
