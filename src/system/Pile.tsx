/* Zone système. L'espace est distribué par le conteneur, jamais réclamé par
   l'enfant — R3.2. Et le rapport entre l'écart d'un groupe et celui de ses
   enfants est ce qui dit à l'œil ce qui va avec quoi — R3.7. Depuis l'Échelle,
   ce rapport n'est plus un seuil posé de l'extérieur : c'est le ratio, et deux
   profondeurs voisines en sont séparées par construction. */
import type { ReactNode } from 'react'
import { ECART_BLOC, ECART_INLINE, FRONTIERE_BLOC, FRONTIERE_INLINE, decaler } from './espace.ts'
import type { Densite } from './espace.ts'
import type { Espace } from './espace.ts'

const COLONNES: Record<2 | 3 | 4, string> = {
  2: 'grid-cols-1 mobile:grid-cols-2',
  3: 'grid-cols-1 mobile:grid-cols-2 tablette:grid-cols-3',
  4: 'grid-cols-1 mobile:grid-cols-2 tablette:grid-cols-4',
}

/* FRONTIÈRE. Ce que cette pile sépare ne va pas ensemble : deux propos, deux
   surfaces sœurs, ce qui suit une image, un titre qui n'ouvre pas. L'écart passe
   alors deux crans au-dessus, soit la marge du niveau. Ce n'est pas un réglage
   d'aération : c'est une déclaration de structure, et elle se vérifie. */
export function Pile({
  espace = 'page',
  frontiere = false,
  densite = 'normal',
  children,
}: {
  espace?: Espace
  frontiere?: boolean
  /* Serré ou ample décalent d'un cran dans l'échelle, sans inventer de valeur. */
  densite?: Densite
  children: ReactNode
}) {
  const cran = decaler(espace, densite)
  return (
    <div className={`flex flex-col ${(frontiere ? FRONTIERE_BLOC : ECART_BLOC)[cran]}`}>
      {children}
    </div>
  )
}

export function Grille({
  colonnes = 2,
  espace = 'large',
  frontiere = false,
  densite = 'normal',
  children,
}: {
  colonnes?: 2 | 3 | 4
  espace?: Espace
  frontiere?: boolean
  densite?: Densite
  children: ReactNode
}) {
  const cran = decaler(espace, densite)
  const x = (frontiere ? FRONTIERE_INLINE : ECART_INLINE)[cran]
  const y = (frontiere ? FRONTIERE_BLOC : ECART_BLOC)[cran]
  return <div className={`grid ${COLONNES[colonnes]} ${x} ${y}`}>{children}</div>
}
