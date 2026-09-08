import { Button } from '../design-system/index.ts'
import { useMutation } from '../design-system/data/useRequest.js'

export function KOS26() {
  const { launch } = useMutation('/factures')
  return <Button onPress={launch}>Envoyer</Button>
}
