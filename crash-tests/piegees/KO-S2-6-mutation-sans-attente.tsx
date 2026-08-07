import { Button } from '../design-system/index.ts'
import { useMutation } from '../design-system/donnees/useRequete.js'

export function KOS26() {
  const { lancer } = useMutation('/factures')
  return <Button onPress={lancer}>Envoyer</Button>
}
