import { Pile, Grille, Titre, Texte } from '../design-system/index.ts'

export function KOS312() {
  return (
    <Grille colonnes={3} espace="page">
      <Pile espace="page"><Titre niveau={3}>Un</Titre><Texte variante="fin">Description</Texte></Pile>
      <Pile espace="page"><Titre niveau={3}>Deux</Titre><Texte variante="fin">Description</Texte></Pile>
      <Pile espace="page"><Titre niveau={3}>Trois</Titre><Texte variante="fin">Description</Texte></Pile>
    </Grille>
  )
}
