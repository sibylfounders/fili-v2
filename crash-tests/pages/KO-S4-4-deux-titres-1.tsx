import { Section, Titre } from '../design-system/index.ts'

export function PageKO4() {
  return (
    <main>
      <Section tete densite="ample"><Titre niveau={1}>Premier</Titre></Section>
      <Section densite="compact"><Titre niveau={1}>Second</Titre></Section>
    </main>
  )
}
