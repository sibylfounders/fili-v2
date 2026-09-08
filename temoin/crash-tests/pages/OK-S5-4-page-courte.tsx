import { Section, Heading, Text } from '../design-system/index.ts'

export function PageOKS54() {
  return (
    <main>
      <Section density="ample" head><Heading level={1}>Page courte</Heading></Section>
      <Section density="compact"><Heading level={2}>Deux</Heading><Text>Corps</Text></Section>
    </main>
  )
}
