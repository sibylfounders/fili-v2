import { Section, Titre, Texte } from '../design-system/index.ts'

export function PageKOS58() {
  return (
    <main>
      <Section densite="ample"><Section tete><Titre niveau={1}>Tête à l'étage en dessous</Titre></Section></Section>
      <Section densite="compact"><Titre niveau={2}>Section 2</Titre><Texte>Corps 2</Texte></Section>
      <Section densite="normal"><Titre niveau={2}>Section 3</Titre><Texte>Corps 3</Texte></Section>
    </main>
  )
}
