import { Section, Heading } from '../design-system/index.ts'

export function PageKO6() {
  return (
    <main>
      <Section head density="ample"><Heading level={1}>Un</Heading></Section>
      <Section density="compact"><Heading level={2} className="text-5xl">Agrandi à la main</Heading></Section>
    </main>
  )
}
