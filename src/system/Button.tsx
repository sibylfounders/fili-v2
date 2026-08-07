/* Zone système. C'est ici que <button> est légitime, et nulle part ailleurs. */
import type { ReactNode } from 'react'

type Variante = 'principal' | 'discret'

const ALLURE: Record<Variante, string> = {
  principal:
    'bg-encre text-encre-inverse border-encre hover:bg-signal hover:border-signal disabled:bg-trait-net disabled:border-trait-net',
  discret: 'bg-papier text-encre border-trait-net hover:border-encre disabled:text-trait-net',
}

export function Button({
  children,
  onPress,
  variante = 'principal',
  desactive = false,
}: {
  children: ReactNode
  onPress?: () => void
  variante?: Variante
  desactive?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onPress}
      disabled={desactive}
      className={`inline-flex items-center justify-center rounded-controle border px-5 py-3 text-fin font-moyenne transition-colors duration-breve ease-standard disabled:cursor-not-allowed ${ALLURE[variante]}`}
    >
      {children}
    </button>
  )
}
