/* Source asynchrone déclarée au registre. Zone système.
   Le bac à sable renvoie un état différent par chemin, pour que le témoin
   expose de vrais états non nominaux. */
const EMPTY = typeof process !== 'undefined' && process.env && process.env.FILI_EMPTY === '1'

const FIXTURES = {
  '/factures': EMPTY
    ? { data: [], loading: false, error: null }
    : { data: [
        { id: 'f1', client: 'Atelier Ravel',    amount: '2 400 €', due: '12 août',      status: 'En retard' },
        { id: 'f2', client: 'Studio Marceau',   amount: '860 €',   due: '19 août',      status: 'En attente' },
        { id: 'f3', client: 'Fonderie du Nord', amount: '5 130 €', due: '2 septembre',  status: 'En attente' }
      ], loading: false, error: null },
  '/relances': { data: [], loading: false, error: null },
  '/composants': { data: [
    { id: 'button', name: 'Button', variants: 'principal · discret · en attente' },
    { id: 'field',  name: 'TextField', variants: 'normal · erreur · lecture seule' },
    { id: 'state',   name: 'EtatAsync', variants: 'chargement · erreur · vide · contenu' }
  ], loading: false, error: null },
  '/journal':   { data: [], loading: false, error: null },
  '/telemetrie':{ data: null, loading: false, error: 'service indisponible' },
  '/audit':     { data: null, loading: true, error: null }
}
export function useRequest(path) {
  return FIXTURES[path] ?? { data: [], loading: false, error: null }
}
export function useMutation() {
  return { launch() {}, inWaiting: true, error: null, success: false }
}
