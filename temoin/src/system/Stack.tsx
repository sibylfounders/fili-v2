/* Zone système. L'espace est distribué par le conteneur, jamais réclamé par
   l'enfant — R3.2. Et le rapport entre l'écart d'un groupe et celui de ses
   enfants est ce qui dit à l'œil ce qui va avec quoi — R3.7. Depuis l'Échelle,
   ce rapport n'est plus un seuil posé de l'extérieur : c'est le ratio, et deux
   profondeurs voisines en sont séparées par construction. */
import type { ReactNode } from 'react'
import { GAP_BLOCK, GAP_INLINE, BOUNDARY_BLOCK, BOUNDARY_INLINE, shift } from './space.ts'
import type { Density } from './space.ts'
import type { Space } from './space.ts'

const COLUMNS: Record<2 | 3 | 4, string> = {
  2: 'grid-cols-1 mobile:grid-cols-2',
  3: 'grid-cols-1 mobile:grid-cols-2 tablet:grid-cols-3',
  4: 'grid-cols-1 mobile:grid-cols-2 tablet:grid-cols-4',
}

/* FRONTIÈRE. Ce que cette pile sépare ne va pas ensemble : deux propos, deux
   surfaces sœurs, ce qui suit une image, un titre qui n'ouvre pas. L'écart passe
   alors deux crans au-dessus, soit la marge du niveau. Ce n'est pas un réglage
   d'aération : c'est une déclaration de structure, et elle se vérifie. */
export function Stack({
  space = 'page',
  boundary = false,
  density = 'normal',
  children,
}: {
  space?: Space
  boundary?: boolean
  /* Serré ou ample décalent d'un cran dans l'échelle, sans inventer de valeur. */
  density?: Density
  children: ReactNode
}) {
  const step = shift(space, density)
  return (
    <div className={`flex flex-col ${(boundary ? BOUNDARY_BLOCK : GAP_BLOCK)[step]}`}>
      {children}
    </div>
  )
}

export function Grid({
  columns = 2,
  space = 'wide',
  boundary = false,
  density = 'normal',
  children,
}: {
  columns?: 2 | 3 | 4
  space?: Space
  boundary?: boolean
  density?: Density
  children: ReactNode
}) {
  const step = shift(space, density)
  const x = (boundary ? BOUNDARY_INLINE : GAP_INLINE)[step]
  const y = (boundary ? BOUNDARY_BLOCK : GAP_BLOCK)[step]
  return <div className={`grid ${COLUMNS[columns]} ${x} ${y}`}>{children}</div>
}
