import { Section, Heading, Text } from '../design-system/index.ts'

export function PageKOS52() {
  return (
    <main>
      <Section density="ample" head><Heading level={1}>Section une</Heading></Section>
      <Section density="compact" head><Heading level={2}>Section 2</Heading><Text>Corps 2</Text></Section>
      <Section density="normal"><Heading level={2}>Section 3</Heading><Text>Corps 3</Text></Section>
      <Section density="normal"><Heading level={2}>Section 4</Heading><Text>Corps 4</Text></Section>
      <Section density="ample"><Heading level={2}>Section 5</Heading><Text>Corps 5</Text></Section>
      <Section density="compact"><Heading level={2}>Section 6</Heading><Text>Corps 6</Text></Section>
      <Section density="normal"><Heading level={2}>Section 7</Heading><Text>Corps 7</Text></Section>
    </main>
  )
}
