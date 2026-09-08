/* Zone système. Un jeton dit un état par son LIBELLÉ et sa TEINTE — jamais par
   la couleur seule, le libellé en est le second porteur (K2 §7.1).
   La teinte n'est pas une charte : elle vient d'une convention que personne n'a
   le droit de casser. Elle est calculée depuis la primaire, jamais choisie.

   LA FORME N'APPARAÎT QUE S'IL EST SEUL. Décision d'Auteur du 2026-08-11 :
   pas d'icône sur ce qui se répète. Un signal qui apparaît une fois informe ;
   le même, répété sur vingt lignes, devient du grain. Ce n'est donc pas le
   nombre de signaux qui gouverne, c'est le nombre de fois — et « suis-je dans
   une liste ? » se lit dans la structure, là où « ai-je trop de signaux ? »
   demandait un jugement. */
import type { ReactNode } from 'react'
import { Icon } from './Icon.tsx'
import type { NameIcon } from './expression.generated.ts'

type Tone = 'lock' | 'waiting' | 'idea' | 'refusal'

/* Chaque état porte son couple — une surface et ce qui s'écrit dessus — et sa
   forme. L'erreur est rouge, le succès vert, l'alerte jaune : ce sont des
   conventions, pas la voix de Fili, et les casser au nom de l'agnosticisme
   serait de l'arrogance. Seule l'idée reste neutre : elle ne dit rien encore. */
const LOOK: Record<Tone, string> = {
  refusal: 'border-error-stroke bg-error-surface text-error-on',
  lock: 'border-success-stroke bg-success-surface text-success-on',
  waiting: 'border-alert-stroke bg-alert-surface text-alert-on',
  idea: 'border-stroke bg-paper text-ink-soft',
}

const SHAPE: Record<Tone, NameIcon> = {
  lock: 'lock',
  waiting: 'waiting',
  idea: 'idea',
  refusal: 'refusal',
}

export function Chip({
  tone = 'idea',
  repeats = false,
  children,
}: {
  tone?: Tone
  /* Déclaré par ce qui contient le jeton : une ligne de liste, une cellule de
     tableau, toute suite d'éléments de même nature. */
  repeats?: boolean
  children: ReactNode
}) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-x-inline-card rounded-control border-system px-inline-detail py-block-detail text-end font-mean ${LOOK[tone]}`}
    >
      {repeats ? null : <Icon name={SHAPE[tone]} />}
      {children}
    </span>
  )
}
