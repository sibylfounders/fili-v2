/* Zone système. Un état non nominal est annoncé. Le refus de statuer de É1 est
   un verdict à part entière, et il s'annonce comme une alerte — K2 §7.2, et la
   perte n°1 du run de K1 que le produit ne reconduit pas.
   Le refus prend le rouge de la convention, le suspendu le jaune — tous deux
   calculés depuis la primaire, et tous deux doublés d'une forme et d'un libellé. Aucune assertion ne vérifie encore le rôle
   d'annonce — il entrera au corpus avec S6, et le défaut serait invisible au
   Gardien. C'est écrit pour que personne ne le découvre.

   Le troisième ton — « verrou » — porte ce qui vient d'être acquis. Il existe
   parce qu'un acte réussi est un état déclaré au contrat (K2 §6) et qu'il ne
   s'annonçait nulle part : l'écran changeait trois mots, et un lecteur d'écran
   n'entendait rien. Il prend le rôle « statut » et jamais « alerte » : un
   succès rend compte, il n'interrompt pas. Son vocabulaire est celui du jeton
   — même nom de ton, même forme, même couple de teintes —, pour qu'un état
   n'ait pas deux noms selon l'endroit où on le lit. */
import type { ReactNode } from 'react'
import { Icone } from './Icone.tsx'
import type { NomIcone } from './expression.genere.ts'

type Annonce = 'alerte' | 'statut'
type Ton = 'refus' | 'attente' | 'verrou'

const ALLURE: Record<Ton, string> = {
  refus: 'border-l-marqueur border-erreur-plein bg-erreur-surface text-erreur-sur',
  attente: 'border-l-marqueur border-alerte-plein bg-alerte-surface text-alerte-sur',
  verrou: 'border-l-marqueur border-succes-plein bg-succes-surface text-succes-sur',
}

const FORME: Record<Ton, NomIcone> = {
  refus: 'refus',
  attente: 'attente',
  verrou: 'verrou',
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
      className={`flex flex-col gap-y-block-coque border-systeme px-inline-carte py-block-carte ${ALLURE[ton]}`}
    >
      <p className="flex items-center gap-x-inline-carte text-niveau3 font-appuyee">
        <Icone nom={FORME[ton]} taille="grande" />
        {titre}
      </p>
      <div className="text-fin">{children}</div>
    </div>
  )
}
