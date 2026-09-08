/* Zone système. C'est ici que <button> est légitime, et nulle part ailleurs.

   L'AIR HORIZONTAL est large par défaut — un peu plus de la moitié de la hauteur
   du bouton. Décision d'Auteur du 2026-08-11, rendue sur essai : l'air moyen a
   été jugé limite, l'air large suffisant.

   SERRÉ n'est pas une taille, c'est un RÔLE. Deux cas seulement, et pas un de
   plus : un bouton sans texte — l'icône est carrée, il n'y a pas de ligne à
   dégager — et des boutons groupés, qui se touchent. Jamais sur une pastille :
   la courbe mange déjà les bords, le texte s'y colle. */
import type { ReactNode } from 'react'

type Variant = 'main' | 'discret'

/* L'air. Le serré ne se choisit pas pour gagner de la place : il se déclare
   parce que le bouton est dans l'un des deux cas nommés. */
type Air = 'wide' | 'tight'

const AIR: Record<Air, string> = {
  wide: 'px-inline-container',
  tight: 'px-inline-card',
}

const LOOK: Record<Variant, string> = {
  main:
    'bg-ink text-ink-inverse border-ink hover:bg-scene hover:border-scene disabled:bg-stroke-net disabled:border-stroke-net',
  discret: 'bg-paper text-ink border-stroke-net hover:border-ink disabled:text-ink-off',
}

export function Button({
  children,
  onPress,
  variant = 'main',
  disabled = false,
  air = 'wide',
}: {
  children: ReactNode
  onPress?: () => void
  variant?: Variant
  disabled?: boolean
  air?: Air
}) {
  return (
    <button
      type="button"
      onClick={onPress}
      disabled={disabled}
      className={`inline-flex w-fit items-center justify-center rounded-control border-system ${AIR[air]} py-block-detail text-end font-mean transition-colors duration-base ease-standard disabled:cursor-not-allowed ${LOOK[variant]}`}
    >
      {children}
    </button>
  )
}
