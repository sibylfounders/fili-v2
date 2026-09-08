import { Button } from '../../../src/system/index.js'

export function Inset({ children }) {
  return <div className="rounded border px-inline-card py-block-card">{children}<Button>Ouvrir</Button></div>
}
