import { Section, Heading } from '../design-system/index.ts'

export function PageKO3() {
  return (
    <main>
      <Section head density="normal"><Heading level={1}>Un</Heading></Section>
      <Section density="normal"><Heading level={2}>Deux</Heading></Section>
      <Section density="normal"><Heading level={2}>Trois</Heading></Section>
    </main>
  )
}
