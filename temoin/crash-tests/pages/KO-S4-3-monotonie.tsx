import { Section, Titre } from '../design-system/index.ts'

export function PageKO3() {
  return (
    <main>
      <Section tete densite="normal"><Titre niveau={1}>Un</Titre></Section>
      <Section densite="normal"><Titre niveau={2}>Deux</Titre></Section>
      <Section densite="normal"><Titre niveau={2}>Trois</Titre></Section>
    </main>
  )
}
