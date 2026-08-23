/* Zone système. Quatre variantes, et pas une de plus : au-delà, on compense
   une hiérarchie mal posée au lieu de la poser.
   L'encre porte le rang : la donnée au contraste le plus fort, le cadrage en
   dessous, la reformulation encore en dessous. Trois crans, tous au-dessus du
   plancher lisible — une information secondaire ne peut pas être plus
   contrastée que la principale (décision du 2026-08-11). */
import type { ReactNode } from 'react'

type Variante = 'corps' | 'chapeau' | 'fin' | 'menu'

const ALLURE: Record<Variante, string> = {
  corps: 'text-corps text-encre max-w-lecture',
  chapeau: 'text-chapeau text-encre-douce max-w-lecture',
  fin: 'text-fin text-encre-legere',
  menu: 'font-mecanique text-menu font-moyenne uppercase text-encre-douce',
}

export function Texte({ variante = 'corps', children }: { variante?: Variante; children: ReactNode }) {
  return <p className={ALLURE[variante]}>{children}</p>
}
