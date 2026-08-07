/* La coquille du produit. Elle ne compose rien : elle désigne le gabarit à
   rendre. Le routage réel entrera avec les trois gabarits restants — un
   routeur écrit pour quatre écrans serait un routeur écrit trop tôt. */
import { EcranVerdict } from './pages/EcranVerdict.tsx'
import { EcranConstat } from './pages/EcranConstat.tsx'
import { EcranFamille } from './pages/EcranFamille.tsx'
import { EcranFaceAFace } from './pages/EcranFaceAFace.tsx'

export type Gabarit = 'verdict' | 'constat' | 'famille' | 'faceAFace'

export default function App({ gabarit }: { gabarit: Gabarit }) {
  if (gabarit === 'constat') return <EcranConstat />
  if (gabarit === 'famille') return <EcranFamille />
  if (gabarit === 'faceAFace') return <EcranFaceAFace />
  return <EcranVerdict />
}
