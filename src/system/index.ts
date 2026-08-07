/* Le registre du produit. Les composants déclarés dans fili.registry.json
   vivent ici — plus dans les crash-tests, qui restent le terrain de preuve et
   ne partagent aucune ligne avec le produit.
   TextField n'est pas encore construit : É7 · L'acte est le seul gabarit qui
   en ait l'emploi, et l'ordre de construction acté en K5 dit qu'on ne
   construit que ce que le parcours en cours exige. Son absence est déclarée. */
export { Section } from './Section.tsx'
export { Titre } from './Titre.tsx'
export { Texte } from './Texte.tsx'
export { Pile, Grille } from './Pile.tsx'
export { Jeton } from './Jeton.tsx'
export { Alerte } from './Alerte.tsx'
export { Vide } from './Vide.tsx'
export { Squelette } from './Squelette.tsx'
export { Button } from './Button.tsx'
export { EtatAsync } from './EtatAsync.tsx'
export type { Requete } from './donnees/useRequete.ts'
export { useRequete, useMutation, installerMutation } from './donnees/useRequete.ts'
export { installerSource } from './donnees/source.ts'
export { LIBELLES, formuler } from './libelles.genere.ts'
