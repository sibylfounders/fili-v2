/* Le même écran, tenu. La section qui attend attend en entier : son titre et sa
   phrase deviennent gris avec le reste, et rien ne parle pendant le chargement.
   Le haut de page reste écrit : il n'attend rien. R2.7 doit passer. */
import { Section, Heading, Text, Stack, Alert, Empty, Skeleton, StateAsync } from '../design-system/index.ts'
import { useRequest } from '../design-system/data/useRequest.js'

export function PageOKS26() {
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
            <Stack space="wide">
              <Stack space="card">
                <Skeleton shape="heading" />
                <Skeleton shape="lines" lines={1} />
              </Stack>
              <Skeleton shape="lines" lines={3} />
            </Stack>
          }
          error={
            <Stack space="wide">
              <Stack space="card">
                <Heading level={2}>Les envois</Heading>
                <Text variant="end">Une ligne par relance partie.</Text>
              </Stack>
              <Alert heading="Le service ne répond pas"><Text variant="end">Réessayer.</Text></Alert>
            </Stack>
          }
          empty={
            <Stack space="wide">
              <Stack space="card">
                <Heading level={2}>Les envois</Heading>
                <Text variant="end">Une ligne par relance partie.</Text>
              </Stack>
              <Empty heading="Aucune relance"><Text variant="end">Rien n'est encore parti.</Text></Empty>
            </Stack>
          }
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
