import { Section, Heading } from '../design-system/index.ts'

export function PageKO7() {
  return (
    <main>
      <Section head density="ample"><Heading level={1}>Un</Heading></Section>
      <Section density="compact">
        <Heading level={3} data-intent="statement" data-intent-reason="je saute le niveau 2, c'est voulu">Trois</Heading>
      </Section>
    </main>
  )
}
