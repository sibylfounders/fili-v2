/* Zone système. Les deux sources déclarées au registre (async.lectures et
   async.mutations). Une donnée distante n'entre dans le produit que par ici,
   et elle ne se rend que par EtatAsync — c'est R2.1. */
import { readSource } from './source.ts'
import type { Snapshot } from './source.ts'

export type Request<T> = Snapshot<T>

export function useRequest<T>(path: string): Request<T> {
  return readSource<T>(path)
}

export type Mutation = {
  launch: () => void
  inWaiting: boolean
  error: string | null
  success: boolean
}

const MUTATIONS = new Map<string, Mutation>()

export function installMutation(path: string, mutation: Mutation): void {
  MUTATIONS.set(path, mutation)
}

export function useMutation(path: string): Mutation {
  const found = MUTATIONS.get(path)
  if (found === undefined)
    return { launch: () => undefined, inWaiting: false, error: null, success: false }
  return found
}
