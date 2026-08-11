/* Zone système. C'est ici que <button> est légitime, et nulle part ailleurs.

   L'AIR HORIZONTAL est large par défaut — un peu plus de la moitié de la hauteur
   du bouton. Décision d'Auteur du 2026-08-11, rendue sur essai : l'air moyen a
   été jugé limite, l'air large suffisant.

   SERRÉ n'est pas une taille, c'est un RÔLE. Deux cas seulement, et pas un de
   plus : un bouton sans texte — l'icône est carrée, il n'y a pas de ligne à
   dégager — et des boutons groupés, qui se touchent. Jamais sur une pastille :
   la courbe mange déjà les bords, le texte s'y colle. */
import type { ReactNode } from 'react'

type Variante = 'principal' | 'discret'

/* L'air. Le serré ne se choisit pas pour gagner de la place : il se déclare
   parce que le bouton est dans l'un des deux cas nommés. */
type Air = 'large' | 'serre'

const AIR: Record<Air, string> = {
  large: 'px-inline-coque',
  serre: 'px-inline-carte',
}

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
  air = 'large',
}: {
  children: ReactNode
  onPress?: () => void
  variante?: Variante
  desactive?: boolean
  air?: Air
}) {
  return (
    <button
      type="button"
      onClick={onPress}
      disabled={desactive}
      className={`inline-flex w-fit items-center justify-center rounded-controle border-systeme ${AIR[air]} py-block-detail text-fin font-moyenne transition-colors duration-base ease-standard disabled:cursor-not-allowed ${ALLURE[variante]}`}
    >
      {children}
    </button>
  )
}
