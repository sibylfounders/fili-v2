/* Zone système. La traduction de l'Échelle en utilitaires.
   Elle vit ici et nulle part ailleurs : une page ne compose jamais une classe
   d'espacement — c'est R3.5, et c'est aussi ce qui rend l'Échelle révisable en
   un seul endroit.
   Ce qui a changé le 2026-08-11 : on ne demande plus « quel écart ? » mais
   « à quelle profondeur ? ». La profondeur se lit dans la structure, l'écart
   s'en déduit. Et les deux axes ne bougent pas ensemble : une colonne distribue
   verticalement, une grille distribue des deux côtés, et ce n'est pas le même
   jeton. */

export type Space = 'detail' | 'card' | 'container' | 'page' | 'wide'

/* profondeur → jeton, par axe. Les nombres vivent dans fili/geometrie.json. */
export const GAP_BLOCK: Record<Space, string> = {
  detail: 'gap-y-block-detail',
  card: 'gap-y-block-card',
  container: 'gap-y-block-container',
  page: 'gap-y-block-page',
  wide: 'gap-y-block-wide',
}

export const GAP_INLINE: Record<Space, string> = {
  detail: 'gap-x-inline-detail',
  card: 'gap-x-inline-card',
  container: 'gap-x-inline-container',
  page: 'gap-x-inline-page',
  wide: 'gap-x-inline-wide',
}

/* LA FRONTIÈRE. Deux choses qui ne vont pas ensemble ne sont pas plus espacées :
   elles sont dans deux groupes. C'est le conteneur du dessus qui porte l'écart de
   frontière — l'enfant ne réclame jamais rien, R3.2 tient.

   Sa valeur est deux crans au-dessus de l'écart du niveau, ce qui tombe
   exactement sur sa marge intérieure : on s'écarte d'un groupe autant qu'on
   s'écarte du bord. Décision d'Auteur du 2026-08-12, journal 074. */
export const BOUNDARY_BLOCK: Record<Space, string> = {
  detail: 'gap-y-block-boundary-detail',
  card: 'gap-y-block-boundary-card',
  container: 'gap-y-block-boundary-container',
  page: 'gap-y-block-boundary-page',
  wide: 'gap-y-block-boundary-wide',
}

export const BOUNDARY_INLINE: Record<Space, string> = {
  detail: 'gap-x-inline-boundary-detail',
  card: 'gap-x-inline-boundary-card',
  container: 'gap-x-inline-boundary-container',
  page: 'gap-x-inline-boundary-page',
  wide: 'gap-x-inline-boundary-wide',
}

/* LA DENSITÉ. Elle ne multiplie rien : elle décale d'un cran dans l'échelle.
   Une zone serrée respire comme le niveau du dessous, une zone ample comme celui
   du dessus. Aucune valeur nouvelle n'entre au système, et le décalage s'arrête
   de lui-même aux deux bouts de l'échelle.

   C'est un réglage LOCAL, et c'est tout son intérêt : régler la densité de tout
   le produit, la base sait déjà le faire. Resserrer un tableau sans toucher au
   reste de la page, non. Décision d'Auteur du 2026-08-12, journal 076. */
export type Density = 'tight' | 'normal' | 'ample'

const ORDER: Space[] = ['detail', 'card', 'container', 'page', 'wide']
const OFFSET: Record<Density, number> = { tight: -1, normal: 0, ample: 1 }

export function shift(space: Space, density: Density = 'normal'): Space {
  const i = ORDER.indexOf(space) + OFFSET[density]
  return ORDER[Math.min(ORDER.length - 1, Math.max(0, i))]
}
