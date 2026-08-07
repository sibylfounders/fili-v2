/* Zone système. Aucun verdict ne se lit à la couleur seule (K2 §7.1) :
   chaque état porte une forme, et la forme vient de la planche des registres.
   Sa taille aussi : une icône qui n'est pas accordée au texte qu'elle
   accompagne se lit comme un accident. */
import { ICONES } from './expression.genere.ts'
import type { NomIcone } from './expression.genere.ts'

type Taille = 'petite' | 'courante' | 'grande'

const MESURE: Record<Taille, string> = {
  petite: 'h-petite w-petite',
  courante: 'h-courante w-courante',
  grande: 'h-grande w-grande',
}

export function Icone({ nom, taille = 'courante' }: { nom: NomIcone; taille?: Taille }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 ${MESURE[taille]}`}
    >
      <path d={ICONES[nom]} />
    </svg>
  )
}
