/* Zone système. La taille découle du niveau, jamais du lieu — R4.5.
   Deux voix seulement : le contenu est en courante, titres compris. Le serif
   partait avec le parti chaud ; il tombe avec lui. */
import type { ReactNode } from 'react'

export function Titre({ niveau, children }: { niveau: 1 | 2 | 3; children: ReactNode }) {
  if (niveau === 1)
    return <h1 className="text-balance text-niveau1 font-appuyee text-encre">{children}</h1>
  if (niveau === 2)
    return <h2 className="text-balance text-niveau2 font-appuyee text-encre">{children}</h2>
  return <h3 className="text-niveau3 font-moyenne text-encre">{children}</h3>
}
