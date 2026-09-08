import { Section, Heading } from '../design-system/index.ts'

export function PageKO4() {
  return (
    <main>
      <Section head density="ample"><Heading level={1}>Premier</Heading></Section>
      <Section density="compact"><Heading level={1}>Second</Heading></Section>
    </main>
  )
}
