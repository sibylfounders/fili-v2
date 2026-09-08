import { Section, Heading } from '../design-system/index.ts'

export function PageOK3() {
  return (
    <main>
      <Section head density="ample"><Heading level={1}>Un</Heading></Section>
      <Section density="compact">
        <Heading level={2} className="text-5xl" data-intent="statement" data-intent-reason="contraste d'échelle assumé sur la page d'accueil">Deux</Heading>
      </Section>
    </main>
  )
}
