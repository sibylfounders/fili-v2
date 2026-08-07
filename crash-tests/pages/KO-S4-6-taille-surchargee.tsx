import { Section, Titre } from '../design-system/index.ts'

export function PageKO6() {
  return (
    <main>
      <Section tete densite="ample"><Titre niveau={1}>Un</Titre></Section>
      <Section densite="compact"><Titre niveau={2} className="text-5xl">Agrandi à la main</Titre></Section>
    </main>
  )
}
