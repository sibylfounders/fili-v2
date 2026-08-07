/* Zone système. Aucun verdict ne se lit à la couleur seule (K2 §7.1) :
   chaque état porte une forme, et la forme vient de la planche des registres.
   Ce composant n'est pas exporté au registre : il n'a pas d'emploi hors d'un
   jeton ou d'une alerte, et un composant sans emploi propre n'entre pas. */
import { ICONES } from './expression.genere.ts'
import type { NomIcone } from './expression.genere.ts'

export function Icone({ nom }: { nom: NomIcone }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className="shrink-0"
    >
      <path d={ICONES[nom]} />
    </svg>
  )
}
