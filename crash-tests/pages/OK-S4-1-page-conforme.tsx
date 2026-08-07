import { Section, Titre, Texte } from '../design-system/index.ts'

export function PageOK1() {
  return (
    <main>
      <Section tete densite="ample"><Titre niveau={1}>Une page qui respire</Titre></Section>
      <Section densite="compact"><Titre niveau={2}>Deux</Titre></Section>
      <Section densite="compact"><Titre niveau={2}>Trois</Titre><Titre niveau={3}>Sous-titre</Titre></Section>
      <Section densite="normal"><Texte>Quatre</Texte></Section>
      <Section densite="ample"><Titre niveau={2}>Cinq</Titre></Section>
    </main>
  )
}
