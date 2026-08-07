/* Zone système. L'espace est distribué par le conteneur, jamais réclamé par
   l'enfant — R3.2. Et le rapport entre l'écart d'un groupe et celui de ses
   enfants est ce qui dit à l'œil ce qui va avec quoi — R3.7. */
import type { ReactNode } from 'react'
import { ECART } from './espace.ts'
import type { Espace } from './espace.ts'

const COLONNES: Record<2 | 3 | 4, string> = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

export function Pile({ espace = 4, children }: { espace?: Espace; children: ReactNode }) {
  return <div className={`flex flex-col ${ECART[espace]}`}>{children}</div>
}

export function Grille({
  colonnes = 2,
  espace = 5,
  children,
}: {
  colonnes?: 2 | 3 | 4
  espace?: Espace
  children: ReactNode
}) {
  return <div className={`grid ${COLONNES[colonnes]} ${ECART[espace]}`}>{children}</div>
}
