/* Le registre du produit. Les composants déclarés dans fili.registry.json
   vivent ici — plus dans les crash-tests, qui restent le terrain de preuve et
   ne partagent aucune ligne avec le produit.
   TextField était déclaré au registre sans emploi : É4 lui en donne un — un
   refus de témoin sans motif écrit ne se relit pas. Rendu est le cadre qui
   porte un témoin, et il n'existe que parce qu'un témoin se juge rendu et
   jamais en capture (entrée 016 du journal — la référence s'écrit ici sans
   son dièse, le scanner de la chaîne S2 lisant une référence à trois chiffres
   comme une couleur littérale ; faux positif déclaré plutôt que contourné). */
export { Section } from './Section.tsx'
export { Titre } from './Titre.tsx'
export { Texte } from './Texte.tsx'
export { Pile, Grille } from './Pile.tsx'
export { Jeton } from './Jeton.tsx'
export { Alerte } from './Alerte.tsx'
export { Vide } from './Vide.tsx'
export { Squelette } from './Squelette.tsx'
export { Rendu } from './Rendu.tsx'
export { Prose } from './Prose.tsx'
export { TextField } from './TextField.tsx'
export { Button } from './Button.tsx'
export { EtatAsync } from './EtatAsync.tsx'
export type { Requete } from './donnees/useRequete.ts'
export { useRequete, useMutation, installerMutation } from './donnees/useRequete.ts'
export { installerSource } from './donnees/source.ts'
export { LIBELLES, formuler } from './libelles.genere.ts'
