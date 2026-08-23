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

export function Jeton({
  ton = 'idee',
  repete = false,
  children,
}: {
  ton?: Ton
  /* Déclaré par ce qui contient le jeton : une ligne de liste, une cellule de
     tableau, toute suite d'éléments de même nature. */
  repete?: boolean
  children: ReactNode
}) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-x-inline-carte rounded-controle border-systeme px-inline-detail py-block-detail text-fin font-moyenne ${ALLURE[ton]}`}
    >
      {repete ? null : <Icone nom={FORME[ton]} />}
      {children}
    </span>
  )
}
