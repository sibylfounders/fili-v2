/* Zone système. C'est ici que <button> est légitime, et nulle part ailleurs. */
import type { ReactNode } from 'react'

type Variante = 'principal' | 'discret'

const ALLURE: Record<Variante, string> = {
  principal:
    'bg-encre text-encre-inverse border-encre hover:bg-scene hover:border-scene disabled:bg-trait-net disabled:border-trait-net',
  discret: 'bg-papier text-encre border-trait-net hover:border-encre disabled:text-encre-eteinte',
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
      className={`inline-flex w-fit items-center justify-center rounded-controle border-systeme px-inline-carte py-block-detail text-fin font-moyenne transition-colors duration-base ease-standard disabled:cursor-not-allowed ${ALLURE[variante]}`}
    >
      {children}
    </button>
  )
}
