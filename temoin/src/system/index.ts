/* Le registre du produit. Les composants déclarés dans fili/registry.json
   vivent ici — plus dans les crash-tests, qui restent le terrain de preuve et
   ne partagent aucune ligne avec le produit.
   TextField était déclaré au registre sans emploi : É4 lui en donne un — un
   refus de témoin sans motif écrit ne se relit pas. Rendu est le cadre qui
   porte un témoin, et il n'existe que parce qu'un témoin se juge rendu et
   jamais en capture (entrée 016 du journal — la référence s'écrit ici sans
   son dièse, le scanner de la chaîne S2 lisant une référence à trois chiffres
   comme une couleur littérale ; faux positif déclaré plutôt que contourné). */
export { Section } from './Section.tsx'
export { Heading } from './Heading.tsx'
export { Text } from './Text.tsx'
export { Stack, Grid } from './Stack.tsx'
export { Chip } from './Chip.tsx'
export { Alert } from './Alert.tsx'
export { Empty } from './Empty.tsx'
export { Skeleton } from './Skeleton.tsx'
export { Render } from './Render.tsx'
export { Prose } from './Prose.tsx'
export { Selection } from './Selection.tsx'
export type { Option } from './Selection.tsx'
export { TextField } from './TextField.tsx'
export { Button } from './Button.tsx'
export { StateAsync } from './StateAsync.tsx'
export type { Request } from './data/useRequest.ts'
export { useRequest, useMutation, installMutation } from './data/useRequest.ts'
export { installSource } from './data/source.ts'
export { LABELS, phrase } from './labels.generated.ts'
