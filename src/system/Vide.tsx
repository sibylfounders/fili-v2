/* Zone système. Un état vide dit ce qui remplirait le vide, jamais seulement
   qu'il est vide — règle 5 du catalogue de libellés.
   Il n'est pas centré : le centrage de l'état vide est la perte n°3 du run de
   K1, et sa place dans la page est le premier cas concret de B-7. Il reste
   donc dans le flux, à la place exacte du contenu qu'il remplace. */
import type { ReactNode } from 'react'

export function Vide({ titre, children }: { titre: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 rounded-controle border border-dashed border-trait-net p-5">
      <p className="font-titrage text-n3 font-moyenne text-encre">{titre}</p>
      <div className="text-fin text-encre-douce">{children}</div>
    </div>
  )
}
