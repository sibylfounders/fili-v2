import { Section, Heading } from '../design-system/index.ts'

export function PageOK2() {
  return (
    <main>
      <Section head density="ample"><Heading level={1}>Manifeste</Heading></Section>
      <Section density="ample"><Heading level={2}>Deux</Heading></Section>
      <Section
        density="ample"
        data-intent="statement"
        data-intent-reason="respiration voulue : la page manifeste avance au même souffle du début à la fin"
      >
        <Heading level={2}>Trois</Heading>
      </Section>
    </main>
  )
}
