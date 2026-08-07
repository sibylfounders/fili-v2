import { Section, Titre, Texte } from '../design-system/index.ts'

export function PageOKS52() {
  return (
    <main>
      <Section densite="ample"><Titre niveau={1}>Section une</Titre></Section>
      <Section densite="compact" tete><Titre niveau={2}>Section 2</Titre><Texte>Corps 2</Texte></Section>
      <Section densite="normal"><Titre niveau={2}>Section 3</Titre><Texte>Corps 3</Texte></Section>
      <Section densite="normal"><Titre niveau={2}>Section 4</Titre><Texte>Corps 4</Texte></Section>
      <Section densite="ample"><Titre niveau={2}>Section 5</Titre><Texte>Corps 5</Texte></Section>
      <Section densite="compact"><Titre niveau={2}>Section 6</Titre><Texte>Corps 6</Texte></Section>
      <Section densite="normal"><Titre niveau={2}>Section 7</Titre><Texte>Corps 7</Texte></Section>
    </main>
  )
}
