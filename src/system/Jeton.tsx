/* Zone système. Un jeton dit un état. Il le dit trois fois — par sa forme,
   par son ton et par son libellé — parce qu'aucun verdict ne se lit à la
   couleur seule (K2 §7.1). Retirer la forme rendrait le produit illisible
   pour une partie des gens qui pourraient l'utiliser. */
import type { ReactNode } from 'react'
import { Icone } from './Icone.tsx'
import type { NomIcone } from './expression.genere.ts'

type Ton = 'verrou' | 'attente' | 'idee' | 'refus'

const ALLURE: Record<Ton, string> = {
  verrou: 'text-verrou border-verrou/30 bg-verrou/5',
  attente: 'text-attente border-attente/30 bg-attente/5',
  idee: 'text-encre-douce border-trait-net/40 bg-papier',
  refus: 'text-signal border-signal/30 bg-signal/5',
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
      className={`inline-flex items-center gap-2 rounded-doux border px-2 py-1 text-fin font-moyenne ${ALLURE[ton]}`}
    >
      <Icone nom={FORME[ton]} />
      {children}
    </span>
  )
}
