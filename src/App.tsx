/* La coquille du produit. Elle ne compose rien : elle désigne le gabarit à
   rendre. Le routage réel entrera avec les cinq gabarits restants — un routeur
   écrit pour deux écrans serait un routeur écrit pour rien. */
import { EcranVerdict } from './pages/EcranVerdict.tsx'
import { EcranConstat } from './pages/EcranConstat.tsx'

export type Gabarit = 'verdict' | 'constat'

export default function App({ gabarit }: { gabarit: Gabarit }) {
  if (gabarit === 'constat') return <EcranConstat />
  return <EcranVerdict />
}
