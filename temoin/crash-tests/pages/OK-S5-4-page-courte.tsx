import { Section, Titre, Texte } from '../design-system/index.ts'

export function PageOKS54() {
  return (
    <main>
      <Section densite="ample" tete><Titre niveau={1}>Page courte</Titre></Section>
      <Section densite="compact"><Titre niveau={2}>Deux</Titre><Texte>Corps</Texte></Section>
    </main>
  )
}
