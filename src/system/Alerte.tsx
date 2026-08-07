/* Zone système. Un état non nominal est annoncé. Le refus de statuer de É1 est
   un verdict à part entière, et il s'annonce comme une alerte — K2 §7.2, et la
   perte n°1 du run de K1 que le produit ne reconduit pas.
   Le refus prend le rouge de la convention, le suspendu le jaune — tous deux
   calculés depuis la primaire, et tous deux doublés d'une forme et d'un libellé. Aucune assertion ne vérifie encore le rôle
   d'annonce — il entrera au corpus avec S6, et le défaut serait invisible au
   Gardien. C'est écrit pour que personne ne le découvre. */
import type { ReactNode } from 'react'
import { Icone } from './Icone.tsx'

type Annonce = 'alerte' | 'statut'
type Ton = 'refus' | 'attente'

const ALLURE: Record<Ton, string> = {
  refus: 'border-l-marqueur border-erreur-plein bg-erreur-surface text-erreur-sur',
  attente: 'border-l-marqueur border-alerte-plein bg-alerte-surface text-alerte-sur',
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
      className={`flex flex-col gap-3 border-systeme p-5 ${ALLURE[ton]}`}
    >
      <p className="flex items-center gap-2 text-niveau3 font-appuyee">
        <Icone nom={ton === 'refus' ? 'refus' : 'attente'} taille="grande" />
        {titre}
      </p>
      <div className="text-fin">{children}</div>
    </div>
  )
}
