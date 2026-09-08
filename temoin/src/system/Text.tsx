/* Zone système. Quatre variantes, et pas une de plus : au-delà, on compense
   une hiérarchie mal posée au lieu de la poser.
   L'encre porte le rang : la donnée au contraste le plus fort, le cadrage en
   dessous, la reformulation encore en dessous. Trois crans, tous au-dessus du
   plancher lisible — une information secondaire ne peut pas être plus
   contrastée que la principale (décision du 2026-08-11). */
import type { ReactNode } from 'react'

type Variant = 'body' | 'lede' | 'end' | 'menu'

const LOOK: Record<Variant, string> = {
  body: 'text-body text-ink max-w-reading',
  lede: 'text-lede text-ink-soft max-w-reading',
  end: 'text-end text-ink-light',
  menu: 'font-mechanical text-menu font-mean uppercase text-ink-soft',
}

export function Text({ variant = 'body', children }: { variant?: Variant; children: ReactNode }) {
  return <p className={LOOK[variant]}>{children}</p>
}
