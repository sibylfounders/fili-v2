/* Zone système. Les deux sources déclarées au registre (async.lectures et
   async.mutations). Une donnée distante n'entre dans le produit que par ici,
   et elle ne se rend que par EtatAsync — c'est R2.1. */
import { lireSource } from './source.ts'
import type { Instantane } from './source.ts'

export type Requete<T> = Instantane<T>

export function useRequete<T>(chemin: string): Requete<T> {
  return lireSource<T>(chemin)
}

export type Mutation = {
  lancer: () => void
  enAttente: boolean
  erreur: string | null
  succes: boolean
}

const MUTATIONS = new Map<string, Mutation>()

export function installerMutation(chemin: string, mutation: Mutation): void {
  MUTATIONS.set(chemin, mutation)
}

export function useMutation(chemin: string): Mutation {
  const trouve = MUTATIONS.get(chemin)
  if (trouve === undefined)
    return { lancer: () => undefined, enAttente: false, erreur: null, succes: false }
  return trouve
}
