/* Source asynchrone déclarée au registre. Zone système.
   Le bac à sable renvoie un état différent par chemin, pour que le témoin
   expose de vrais états non nominaux. */
const VIDE = typeof process !== 'undefined' && process.env && process.env.FILI_VIDE === '1'

const FIXTURES = {
  '/factures': VIDE
    ? { donnees: [], chargement: false, erreur: null }
    : { donnees: [
        { id: 'f1', client: 'Atelier Ravel',    montant: '2 400 €', echeance: '12 août',      statut: 'En retard' },
        { id: 'f2', client: 'Studio Marceau',   montant: '860 €',   echeance: '19 août',      statut: 'En attente' },
        { id: 'f3', client: 'Fonderie du Nord', montant: '5 130 €', echeance: '2 septembre',  statut: 'En attente' }
      ], chargement: false, erreur: null },
  '/relances': { donnees: [], chargement: false, erreur: null },
  '/composants': { donnees: [
    { id: 'button', nom: 'Button', variantes: 'principal · discret · en attente' },
    { id: 'field',  nom: 'TextField', variantes: 'normal · erreur · lecture seule' },
    { id: 'etat',   nom: 'EtatAsync', variantes: 'chargement · erreur · vide · contenu' }
  ], chargement: false, erreur: null },
  '/journal':   { donnees: [], chargement: false, erreur: null },
  '/telemetrie':{ donnees: null, chargement: false, erreur: 'service indisponible' },
  '/audit':     { donnees: null, chargement: true, erreur: null }
}
export function useRequete(chemin) {
  return FIXTURES[chemin] ?? { donnees: [], chargement: false, erreur: null }
}
export function useMutation() {
  return { lancer() {}, enAttente: true, erreur: null, succes: false }
}
