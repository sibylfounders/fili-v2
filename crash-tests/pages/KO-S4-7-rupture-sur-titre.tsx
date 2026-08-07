import { Section, Titre } from '../design-system/index.ts'

export function PageKO7() {
  return (
    <main>
      <Section tete densite="ample"><Titre niveau={1}>Un</Titre></Section>
      <Section densite="compact">
        <Titre niveau={3} data-intent="statement" data-intent-reason="je saute le niveau 2, c'est voulu">Trois</Titre>
      </Section>
    </main>
  )
}
