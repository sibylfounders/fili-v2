import { Section, Titre } from '../design-system/index.ts'

export function PageKO5() {
  return (
    <main>
      <Section tete densite="ample"><Titre niveau={1}>Un</Titre></Section>
      <Section densite="compact"><Titre niveau={3}>Trois</Titre></Section>
    </main>
  )
}
