/* Zone système. La traduction de l'Échelle en utilitaires.
   Elle vit ici et nulle part ailleurs : une page ne compose jamais une classe
   d'espacement — c'est R3.5, et c'est aussi ce qui rend l'Échelle révisable en
   un seul endroit.
   Ce qui a changé le 2026-08-11 : on ne demande plus « quel écart ? » mais
   « à quelle profondeur ? ». La profondeur se lit dans la structure, l'écart
   s'en déduit. Et les deux axes ne bougent pas ensemble : une colonne distribue
   verticalement, une grille distribue des deux côtés, et ce n'est pas le même
   jeton. */

export type Espace = 'detail' | 'carte' | 'coque' | 'page' | 'large'

/* profondeur → jeton, par axe. Les nombres vivent dans fili/geometrie.json. */
export const ECART_BLOC: Record<Espace, string> = {
  detail: 'gap-y-block-detail',
  carte: 'gap-y-block-carte',
  coque: 'gap-y-block-coque',
  page: 'gap-y-block-page',
  large: 'gap-y-block-large',
}

export const ECART_INLINE: Record<Espace, string> = {
  detail: 'gap-x-inline-detail',
  carte: 'gap-x-inline-carte',
  coque: 'gap-x-inline-coque',
  page: 'gap-x-inline-page',
  large: 'gap-x-inline-large',
}
