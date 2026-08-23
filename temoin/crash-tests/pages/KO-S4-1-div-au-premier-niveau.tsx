import { Section, Titre } from '../design-system/index.ts'

export function PageKO1() {
  return (
    <main>
      <Section tete densite="ample"><Titre niveau={1}>Titre</Titre></Section>
      <div className="px-inline-page py-block-page">Bloc anonyme au premier niveau</div>
    </main>
  )
}
