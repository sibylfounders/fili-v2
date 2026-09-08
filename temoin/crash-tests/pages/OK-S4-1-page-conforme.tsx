import { Section, Heading, Text } from '../design-system/index.ts'

export function PageOK1() {
  return (
    <main>
      <Section head density="ample"><Heading level={1}>Une page qui respire</Heading></Section>
      <Section density="compact"><Heading level={2}>Deux</Heading></Section>
      <Section density="compact"><Heading level={2}>Trois</Heading><Heading level={3}>Sous-titre</Heading></Section>
      <Section density="normal"><Text>Quatre</Text></Section>
      <Section density="ample"><Heading level={2}>Cinq</Heading></Section>
    </main>
  )
}
