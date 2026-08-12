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

/* LA FRONTIÈRE. Deux choses qui ne vont pas ensemble ne sont pas plus espacées :
   elles sont dans deux groupes. C'est le conteneur du dessus qui porte l'écart de
   frontière — l'enfant ne réclame jamais rien, R3.2 tient.

   Sa valeur est deux crans au-dessus de l'écart du niveau, ce qui tombe
   exactement sur sa marge intérieure : on s'écarte d'un groupe autant qu'on
   s'écarte du bord. Décision d'Auteur du 2026-08-12, journal 074. */
export const FRONTIERE_BLOC: Record<Espace, string> = {
  detail: 'gap-y-block-frontiere-detail',
  carte: 'gap-y-block-frontiere-carte',
  coque: 'gap-y-block-frontiere-coque',
  page: 'gap-y-block-frontiere-page',
  large: 'gap-y-block-frontiere-large',
}

export const FRONTIERE_INLINE: Record<Espace, string> = {
  detail: 'gap-x-inline-frontiere-detail',
  carte: 'gap-x-inline-frontiere-carte',
  coque: 'gap-x-inline-frontiere-coque',
  page: 'gap-x-inline-frontiere-page',
  large: 'gap-x-inline-frontiere-large',
}
