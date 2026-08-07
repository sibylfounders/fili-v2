/* Zone système. Aucun verdict ne se lit à la couleur seule (K2 §7.1) : chaque
   état porte une forme. Les formes ne sont pas dessinées ici — elles viennent
   d'un jeu déclaré à la planche, versé au dépôt avec sa version et sa licence,
   et stockées en données plutôt qu'en balisage : une chaîne de balisage
   réinjectée serait un échappement, et le corpus l'interdit.
   Le composant ne connaît ni la grille ni l'épaisseur du jeu : il les lit, pour
   que remplacer le jeu ne demande de toucher à aucun composant. */
import { ICONES, GRILLE, TRAIT } from './expression.genere.ts'
import type { NomIcone } from './expression.genere.ts'

type Taille = 'petite' | 'courante' | 'grande'

const MESURE: Record<Taille, string> = {
  petite: 'h-petite w-petite',
  courante: 'h-courante w-courante',
  grande: 'h-grande w-grande',
}

type Forme = { t: string } & Record<string, string | number>

export function Icone({ nom, taille = 'petite' }: { nom: NomIcone; taille?: Taille }) {
  const formes = ICONES[nom] as readonly Forme[]
  return (
    <svg
      viewBox={`0 0 ${String(GRILLE)} ${String(GRILLE)}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={TRAIT}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 ${MESURE[taille]}`}
    >
      {formes.map((f, i) => {
        const { t, ...reste } = f
        if (t === 'circle') return <circle key={i} {...reste} />
        if (t === 'line') return <line key={i} {...reste} />
        if (t === 'rect') return <rect key={i} {...reste} />
        if (t === 'polyline') return <polyline key={i} {...reste} />
        if (t === 'polygon') return <polygon key={i} {...reste} />
        if (t === 'ellipse') return <ellipse key={i} {...reste} />
        return <path key={i} {...reste} />
      })}
    </svg>
  )
}
