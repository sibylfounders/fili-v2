/* Zone système. L'état que Fili lit vient du dépôt, jamais d'un service.
   Fili est un poste local et mono-utilisateur : il charge son état une fois,
   au démarrage, et il ne s'actualise pas tout seul. C'est une limite, elle
   est écrite ici plutôt que découverte — et elle est exactement ce qu'un
   poste de gouvernance peut se permettre : on relance une lecture quand on
   veut savoir, on ne surveille pas un tableau de bord. */

export type Snapshot<T> = {
  data: T | null
  loading: boolean
  error: string | null
}

const STATE = new Map<string, Snapshot<unknown>>()

export function installSource<T>(path: string, snapshot: Snapshot<T>): void {
  STATE.set(path, snapshot)
}

export function readSource<T>(path: string): Snapshot<T> {
  const found = STATE.get(path)
  /* Une source jamais installée est en cours de lecture, pas vide.
     Dire « vide » de ce qu'on n'a pas encore lu est un mensonge d'interface. */
  if (found === undefined) return { data: null, loading: true, error: null }
  return found as Snapshot<T>
}
