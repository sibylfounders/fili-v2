/* Zone système. Un état non nominal n'est pas un accident de rendu : il est
   annoncé. Le refus de statuer de É1 est un verdict à part entière, et il
   s'annonce comme une alerte — K2 §7.2, et la perte n°1 du run de K1 que le
   produit ne reconduit pas.
   Aucune assertion ne vérifie encore ce rôle : il entrera au corpus avec S6.
   Ici il est tenu par construction, et le défaut serait invisible au Gardien —
   c'est écrit pour que personne ne le découvre. */
import type { ReactNode } from 'react'
import { Icone } from './Icone.tsx'

type Annonce = 'alerte' | 'statut'
type Ton = 'refus' | 'attente'

const ALLURE: Record<Ton, string> = {
  refus: 'border-signal/40 bg-signal/5 text-signal',
  attente: 'border-attente/40 bg-attente/5 text-attente',
}

export function Alerte({
  titre,
  ton = 'refus',
  annonce = 'alerte',
  children,
}: {
  titre: string
  ton?: Ton
  annonce?: Annonce
  children: ReactNode
}) {
  return (
    <div
      role={annonce === 'alerte' ? 'alert' : 'status'}
      className={`flex flex-col gap-3 rounded-controle border border-l-4 p-5 ${ALLURE[ton]}`}
    >
      <p className="flex items-center gap-2 font-titrage text-n3 font-appuyee">
        <Icone nom={ton === 'refus' ? 'refus' : 'attente'} />
        {titre}
      </p>
      <div className="text-fin text-encre">{children}</div>
    </div>
  )
}
