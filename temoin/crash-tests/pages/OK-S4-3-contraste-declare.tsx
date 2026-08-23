import { Section, Titre } from '../design-system/index.ts'

export function PageOK3() {
  return (
    <main>
      <Section tete densite="ample"><Titre niveau={1}>Un</Titre></Section>
      <Section densite="compact">
        <Titre niveau={2} className="text-5xl" data-intent="statement" data-intent-reason="contraste d'échelle assumé sur la page d'accueil">Deux</Titre>
      </Section>
    </main>
  )
}
