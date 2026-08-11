/* Zone système. L'espace est distribué par le conteneur, jamais réclamé par
   l'enfant — R3.2. Et le rapport entre l'écart d'un groupe et celui de ses
   enfants est ce qui dit à l'œil ce qui va avec quoi — R3.7. Depuis l'Échelle,
   ce rapport n'est plus un seuil posé de l'extérieur : c'est le ratio, et deux
   profondeurs voisines en sont séparées par construction. */
import type { ReactNode } from 'react'
import { ECART_BLOC, ECART_INLINE } from './espace.ts'
import type { Espace } from './espace.ts'

const COLONNES: Record<2 | 3 | 4, string> = {
  2: 'grid-cols-1 mobile:grid-cols-2',
  3: 'grid-cols-1 mobile:grid-cols-2 tablette:grid-cols-3',
  4: 'grid-cols-1 mobile:grid-cols-2 tablette:grid-cols-4',
}

export function Pile({ espace = 'page', children }: { espace?: Espace; children: ReactNode }) {
  return <div className={`flex flex-col ${ECART_BLOC[espace]}`}>{children}</div>
}

export function Grille({
  colonnes = 2,
  espace = 'large',
  children,
}: {
  colonnes?: 2 | 3 | 4
  espace?: Espace
  children: ReactNode
}) {
  return (
    <div className={`grid ${COLONNES[colonnes]} ${ECART_INLINE[espace]} ${ECART_BLOC[espace]}`}>
      {children}
    </div>
  )
}
