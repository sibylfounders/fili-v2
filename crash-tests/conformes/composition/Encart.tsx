import { Button } from '../../../src/system/index.js'

export function Encart({ children }) {
  return <div className="rounded border p-4">{children}<Button>Ouvrir</Button></div>
}
