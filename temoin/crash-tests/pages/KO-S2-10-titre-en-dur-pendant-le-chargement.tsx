/* Le défaut de la séance du 2026-08-07, isolé : la section attend ses données,
   et son titre — avec la phrase posée sous lui — reste écrit à côté du gris.
   L'écran se lit à moitié. R2.7 doit rougir. */
import { Section, Heading, Text, Stack, Alert, Empty, Skeleton, StateAsync } from '../design-system/index.ts'
import { useRequest } from '../design-system/data/useRequest.js'

export function PageKOS210() {
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
        <Stack space="wide">
          <Stack space="card">
            <Heading level={2}>Les envois</Heading>
            <Text variant="end">Une ligne par relance partie.</Text>
          </Stack>
          <StateAsync
            request={reminders}
            loading={<Skeleton shape="lines" lines={3} />}
            error={<Alert heading="Le service ne répond pas"><Text variant="end">Réessayer.</Text></Alert>}
            empty={<Empty heading="Aucune relance"><Text variant="end">Rien n'est encore parti.</Text></Empty>}
            children={(list) => <Text variant="body">{list.length} relances</Text>}
          />
        </Stack>
      </Section>
    </main>
  )
}
