/* Zone système. L'état que Fili lit vient du dépôt, jamais d'un service.
   Fili est un poste local et mono-utilisateur : il charge son état une fois,
   au démarrage, et il ne s'actualise pas tout seul. C'est une limite, elle
   est écrite ici plutôt que découverte — et elle est exactement ce qu'un
   poste de gouvernance peut se permettre : on relance une lecture quand on
   veut savoir, on ne surveille pas un tableau de bord. */

export type Instantane<T> = {
  donnees: T | null
  chargement: boolean
  erreur: string | null
}

const ETAT = new Map<string, Instantane<unknown>>()

export function installerSource<T>(chemin: string, instantane: Instantane<T>): void {
  ETAT.set(chemin, instantane)
}

export function lireSource<T>(chemin: string): Instantane<T> {
  const trouve = ETAT.get(chemin)
  /* Une source jamais installée est en cours de lecture, pas vide.
     Dire « vide » de ce qu'on n'a pas encore lu est un mensonge d'interface. */
  if (trouve === undefined) return { donnees: null, chargement: true, erreur: null }
  return trouve as Instantane<T>
}
