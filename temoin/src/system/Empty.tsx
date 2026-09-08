/* Zone système. Un état vide dit ce qui remplirait le vide, jamais seulement
   qu'il est vide — règle 5 du catalogue de libellés.
   Il n'est pas centré : le centrage de l'état vide est la perte n°3 du run de
   K1, et sa place dans la page est le premier cas concret de B-7. Il reste
   donc dans le flux, à la place exacte du contenu qu'il remplace. */
import type { ReactNode } from 'react'

export function Empty({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-y-block-card rounded-detail border-system border-dashed border-stroke-net bg-paper px-inline-card py-block-card">
      <p className="text-level3 font-mean text-ink">{heading}</p>
      <div className="text-end text-ink-soft">{children}</div>
    </div>
  )
}
