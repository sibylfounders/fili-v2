/* La coquille du produit. Elle ne compose rien : elle désigne le gabarit à
   rendre. Le routage réel entrera avec les le gabarit restant — un
   routeur écrit pour six écrans serait un routeur écrit trop tôt. */
import { ScreenVerdict } from './pages/ScreenVerdict.tsx'
import { ScreenFinding } from './pages/ScreenFinding.tsx'
import { ScreenFamily } from './pages/ScreenFamily.tsx'
import { ScreenFaceToFace } from './pages/ScreenFaceToFace.tsx'
import { ScreenMap } from './pages/ScreenMap.tsx'
import { ScreenJournal } from './pages/ScreenJournal.tsx'
import { ScreenAct } from './pages/ScreenAct.tsx'

export type Template = 'verdict' | 'finding' | 'family' | 'faceAFace' | 'card' | 'journal' | 'act'

export default function App({ template }: { template: Template }) {
  if (template === 'finding') return <ScreenFinding />
  if (template === 'family') return <ScreenFamily />
  if (template === 'faceAFace') return <ScreenFaceToFace />
  if (template === 'card') return <ScreenMap />
  if (template === 'journal') return <ScreenJournal />
  if (template === 'act') return <ScreenAct />
  return <ScreenVerdict />
}
