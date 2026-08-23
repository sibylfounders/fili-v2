import { Section, Titre } from '../design-system/index.ts'

export function PageOK2() {
  return (
    <main>
      <Section tete densite="ample"><Titre niveau={1}>Manifeste</Titre></Section>
      <Section densite="ample"><Titre niveau={2}>Deux</Titre></Section>
      <Section
        densite="ample"
        data-intent="statement"
        data-intent-reason="respiration voulue : la page manifeste avance au même souffle du début à la fin"
      >
        <Titre niveau={2}>Trois</Titre>
      </Section>
    </main>
  )
}
