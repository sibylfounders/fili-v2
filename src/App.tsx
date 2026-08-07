/* La coquille du produit. Elle ne compose rien : elle désigne le gabarit à
   rendre. Le routage réel entrera avec les le gabarit restant — un
   routeur écrit pour six écrans serait un routeur écrit trop tôt. */
import { EcranVerdict } from './pages/EcranVerdict.tsx'
import { EcranConstat } from './pages/EcranConstat.tsx'
import { EcranFamille } from './pages/EcranFamille.tsx'
import { EcranFaceAFace } from './pages/EcranFaceAFace.tsx'
import { EcranCarte } from './pages/EcranCarte.tsx'
import { EcranJournal } from './pages/EcranJournal.tsx'

export type Gabarit = 'verdict' | 'constat' | 'famille' | 'faceAFace' | 'carte' | 'journal'

export default function App({ gabarit }: { gabarit: Gabarit }) {
  if (gabarit === 'constat') return <EcranConstat />
  if (gabarit === 'famille') return <EcranFamille />
  if (gabarit === 'faceAFace') return <EcranFaceAFace />
  if (gabarit === 'carte') return <EcranCarte />
  if (gabarit === 'journal') return <EcranJournal />
  return <EcranVerdict />
}
