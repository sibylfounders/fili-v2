/* Le titre est bien passé dans le conteneur, mais le chargement lui-même parle :
   une pastille écrite en vrai texte, à côté du gris. R2.7 doit rougir — sauf
   déclaration d'intention avec motif, que cet écran ne porte pas. */
import { Section, Heading, Text, Stack, Chip, Alert, Empty, Skeleton, StateAsync } from '../design-system/index.ts'
import { useRequest } from '../design-system/data/useRequest.js'

export function PageKOS211() {
  const reminders = useRequest('/relances')
  return (
    <main>
      <Section density="ample" head>
        <Stack space="container">
          <Text variant="menu">Facturation</Text>
          <Heading level={1}>Suivi des relances</Heading>
          <Text variant="lede">Ce qui est parti, et à qui.</Text>
        </Stack>
      </Section>

      <Section density="compact" background>
        <StateAsync
          request={reminders}
          loading={
            <Stack space="container">
              <Chip tone="waiting">Chargement en cours</Chip>
              <Skeleton shape="lines" lines={3} />
            </Stack>
          }
          error={<Alert heading="Le service ne répond pas"><Text variant="end">Réessayer.</Text></Alert>}
          empty={<Empty heading="Aucune relance"><Text variant="end">Rien n'est encore parti.</Text></Empty>}
          children={(list) => (
            <Stack space="wide">
              <Stack space="card">
                <Heading level={2}>Les envois</Heading>
                <Text variant="end">Une ligne par relance partie.</Text>
              </Stack>
              <Text variant="body">{list.length} relances</Text>
            </Stack>
          )}
        />
      </Section>
    </main>
  )
}
