/* Zone système. La traduction de l'échelle déclarée en utilitaires.
   Elle vit ici et nulle part ailleurs : une page ne compose jamais une classe
   d'espacement — c'est R3.5, et c'est aussi ce qui rend l'échelle révisable
   en un seul endroit. */

export type Espace = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

/* prop → pas de l'échelle, exactement la table du registre (espacement.pixels). */
export const ECART: Record<Espace, string> = {
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-6',
  6: 'gap-8',
  7: 'gap-12',
  8: 'gap-16',
  9: 'gap-24',
  10: 'gap-32',
}
