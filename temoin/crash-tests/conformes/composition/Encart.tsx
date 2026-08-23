import { Button } from '../../../src/system/index.js'

export function Encart({ children }) {
  return <div className="rounded border px-inline-carte py-block-carte">{children}<Button>Ouvrir</Button></div>
}
