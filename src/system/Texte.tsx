/* Zone système. Quatre variantes, et pas une de plus : au-delà, on compense
   une hiérarchie mal posée au lieu de la poser. */
import type { ReactNode } from 'react'

type Variante = 'corps' | 'chapeau' | 'fin' | 'menu'

const ALLURE: Record<Variante, string> = {
  corps: 'text-corps text-encre max-w-lecture',
  chapeau: 'text-chapeau text-encre-douce max-w-lecture',
  fin: 'text-fin text-encre-douce',
  menu: 'font-mecanique text-menu font-moyenne uppercase text-encre-douce',
}

export function Texte({ variante = 'corps', children }: { variante?: Variante; children: ReactNode }) {
  return <p className={ALLURE[variante]}>{children}</p>
}
