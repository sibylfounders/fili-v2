/* Zone système. Aucun verdict ne se lit à la couleur seule (K2 §7.1) : chaque
   état porte une forme. Les formes ne sont pas dessinées ici — elles viennent
   d'un jeu déclaré à la planche, versé au dépôt avec sa version et sa licence,
   et stockées en données plutôt qu'en balisage : une chaîne de balisage
   réinjectée serait un échappement, et le corpus l'interdit.
   Le composant ne connaît ni la grille ni l'épaisseur du jeu : il les lit, pour
   que remplacer le jeu ne demande de toucher à aucun composant. */
import { ICONS, GRID, STROKE } from './expression.generated.ts'
import type { NameIcon } from './expression.generated.ts'

type Size = 'small' | 'current' | 'large'

const MEASURE: Record<Size, string> = {
  small: 'h-small w-small',
  current: 'h-current w-current',
  large: 'h-large w-large',
}

type Shape = { t: string } & Record<string, string | number>

export function Icon({ name, size = 'small' }: { name: NameIcon; size?: Size }) {
  const shapes = ICONS[name] as readonly Shape[]
  return (
    <svg
      viewBox={`0 0 ${String(GRID)} ${String(GRID)}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 ${MEASURE[size]}`}
    >
      {shapes.map((f, i) => {
        const { t, ...rest } = f
        if (t === 'circle') return <circle key={i} {...rest} />
        if (t === 'line') return <line key={i} {...rest} />
        if (t === 'rect') return <rect key={i} {...rest} />
        if (t === 'polyline') return <polyline key={i} {...rest} />
        if (t === 'polygon') return <polygon key={i} {...rest} />
        if (t === 'ellipse') return <ellipse key={i} {...rest} />
        return <path key={i} {...rest} />
      })}
    </svg>
  )
}
