import { Pile, Grille, Titre, Texte } from '../design-system/index.ts'

export function OKS37() {
  return (
    <Grille colonnes={3} espace="large">
      <Pile espace="detail"><Titre niveau={3}>Un</Titre><Texte variante="fin">Description</Texte></Pile>
      <Pile espace="detail"><Titre niveau={3}>Deux</Titre><Texte variante="fin">Description</Texte></Pile>
      <Pile espace="detail"><Titre niveau={3}>Trois</Titre><Texte variante="fin">Description</Texte></Pile>
    </Grille>
  )
}
