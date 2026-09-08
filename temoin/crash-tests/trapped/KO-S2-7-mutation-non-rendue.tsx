import { Button } from '../design-system/index.ts'
import { useMutation } from '../design-system/data/useRequest.js'

export function KOS27() {
  const { launch, inWaiting, error } = useMutation('/factures')
  return <Button onPress={launch}>Envoyer</Button>
}
