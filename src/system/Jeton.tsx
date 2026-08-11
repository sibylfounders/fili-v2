/* Zone système. Un jeton dit un état trois fois — par sa FORME, son LIBELLÉ et
   sa TEINTE — parce qu'aucun verdict ne se lit à la couleur seule (K2 §7.1).
   La teinte n'est pas une charte : elle vient d'une convention que personne n'a
   le droit de casser. Elle est calculée depuis la primaire, jamais choisie. */
import type { ReactNode } from 'react'
import { Icone } from './Icone.tsx'
import type { NomIcone } from './expression.genere.ts'

type Ton = 'verrou' | 'attente' | 'idee' | 'refus'

/* Chaque état porte son couple — une surface et ce qui s'écrit dessus — et sa
   forme. L'erreur est rouge, le succès vert, l'alerte jaune : ce sont des
   conventions, pas la voix de Fili, et les casser au nom de l'agnosticisme
   serait de l'arrogance. Seule l'idée reste neutre : elle ne dit rien encore. */
const ALLURE: Record<Ton, string> = {
  refus: 'border-erreur-trait bg-erreur-surface text-erreur-sur',
  verrou: 'border-succes-trait bg-succes-surface text-succes-sur',
  attente: 'border-alerte-trait bg-alerte-surface text-alerte-sur',
  idee: 'border-trait bg-papier text-encre-douce',
}

const FORME: Record<Ton, NomIcone> = {
  verrou: 'verrou',
  attente: 'attente',
  idee: 'idee',
  refus: 'refus',
}

export function Jeton({ ton = 'idee', children }: { ton?: Ton; children: ReactNode }) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-x-inline-carte rounded-controle border-systeme px-inline-detail py-block-detail text-fin font-moyenne ${ALLURE[ton]}`}
    >
      <Icone nom={FORME[ton]} />
      {children}
    </span>
  )
}
