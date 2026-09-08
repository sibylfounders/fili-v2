/* Zone système. La taille découle du niveau, jamais du lieu — R4.5.
   Deux voix seulement : le contenu est en courante, titres compris. Le serif
   partait avec le parti chaud ; il tombe avec lui. */
import type { ReactNode } from 'react'

export function Heading({ level, children }: { level: 1 | 2 | 3; children: ReactNode }) {
  if (level === 1)
    return <h1 className="text-balance text-level1 font-pressed text-ink">{children}</h1>
  if (level === 2)
    return <h2 className="text-balance text-level2 font-pressed text-ink">{children}</h2>
  return <h3 className="text-level3 font-mean text-ink">{children}</h3>
}
