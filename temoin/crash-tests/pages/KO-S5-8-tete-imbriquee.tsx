import { Section, Heading, Text } from '../design-system/index.ts'

export function PageKOS58() {
  return (
    <main>
      <Section density="ample"><Section head><Heading level={1}>Tête à l'étage en dessous</Heading></Section></Section>
      <Section density="compact"><Heading level={2}>Section 2</Heading><Text>Corps 2</Text></Section>
      <Section density="normal"><Heading level={2}>Section 3</Heading><Text>Corps 3</Text></Section>
    </main>
  )
}
