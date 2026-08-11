/* Zone système. Une page est une suite de Section : c'est R4.1.
   La densité déclarée devient une respiration réelle — c'est ce qui fait
   qu'on discute d'un rythme écrit et non d'une impression (S4).
   La marque de tête déclare que cette section porte ce qui compte d'abord :
   la section ne se dessine pas autrement pour autant. Ce que la déclaration
   promet, c'est le rendu qui doit l'honorer, et c'est l'œil qui le juge (B-2).
   Les trois densités prennent trois crans voisins de l'Échelle : le rythme
   entre deux sections n'est pas couvert par la loi — le manque était déjà nommé
   — et il est ici prolongé par la même raison géométrique, vers le haut. */
import type { ReactNode } from 'react'

type Densite = 'compact' | 'normal' | 'ample'

const RESPIRATION: Record<Densite, string> = {
  compact: 'py-block-coque',
  normal: 'py-block-page',
  ample: 'py-block-large',
}

export function Section({
  densite,
  tete = false,
  fond = false,
  children,
  ...reste
}: {
  densite: Densite
  tete?: boolean
  fond?: boolean
  children: ReactNode
} & Record<string, unknown>) {
  return (
    <section
      className={`${RESPIRATION[densite]} px-inline-coque mobile:px-inline-page ${fond ? 'bg-papier-creux' : 'bg-papier'}`}
      data-densite={densite}
      data-tete={tete ? 'oui' : undefined}
      {...reste}
    >
      <div className="mx-auto max-w-page">{children}</div>
    </section>
  )
}
