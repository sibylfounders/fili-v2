import { Section, Heading } from '../design-system/index.ts'

export function PageKO1() {
  return (
    <main>
      <Section head density="ample"><Heading level={1}>Titre</Heading></Section>
      <div className="px-inline-page py-block-page">Bloc anonyme au premier niveau</div>
    </main>
  )
}
