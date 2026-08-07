/* Zone système. La taille découle du niveau, jamais du lieu — R4.5.
   Le titrage est la voix qui prononce : c'est le seul endroit du produit où
   la famille « titrage » de la planche s'emploie. */
import type { ReactNode } from 'react'

export function Titre({ niveau, children }: { niveau: 1 | 2 | 3; children: ReactNode }) {
  if (niveau === 1)
    return <h1 className="text-balance font-titrage text-niveau1 font-appuyee text-encre">{children}</h1>
  if (niveau === 2)
    return <h2 className="text-balance font-titrage text-niveau2 font-appuyee text-encre">{children}</h2>
  return <h3 className="font-titrage text-niveau3 font-moyenne text-encre">{children}</h3>
}
