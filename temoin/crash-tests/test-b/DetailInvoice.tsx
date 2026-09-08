import {
  Section, Heading, Text, Stack, Grid, Chip,
  Alert, Empty, Skeleton, Button, StateAsync
} from '../design-system/index.ts'
import { useRequest, useMutation } from '../design-system/data/useRequest.js'

export function DetailInvoice() {
  const reminders = useRequest('/relances')
  const { launch, inWaiting, error } = useMutation('/relances')

  return (
    <main>
      <Section density="ample">
        <Stack space="wide">
          <Text variant="menu">Facturation · Atelier Ravel</Text>
          <Heading level={1}>Facture F-2026-118</Heading>
          <Text variant="lede">
            2 400 € dus depuis le 12 août. Deux relances ont déjà été envoyées.
          </Text>
        </Stack>
      </Section>

      <Section density="normal" background>
        <Stack space="wide">
          <Heading level={2}>Le détail</Heading>
          <Grid columns={4} space="wide">
            <Stack space="detail">
              <Chip tone="neutral">Client</Chip>
              <Text variant="end">Atelier Ravel</Text>
            </Stack>
            <Stack space="detail">
              <Chip tone="neutral">Montant</Chip>
              <Text variant="end">2 400 €</Text>
            </Stack>
            <Stack space="detail">
              <Chip tone="waiting">Échéance</Chip>
              <Text variant="end">12 août 2026</Text>
            </Stack>
            <Stack space="detail">
              <Chip tone="waiting">Statut</Chip>
              <Text variant="end">En retard de 25 jours</Text>
            </Stack>
          </Grid>
        </Stack>
      </Section>

      <Section density="compact">
        <Stack space="wide">
          <Heading level={2}>Relances envoyées</Heading>
          <StateAsync
            request={reminders}
            loading={<Skeleton lines={2} />}
            error={
              <Alert heading="L'historique n'a pas pu être chargé">
                <Text variant="end">Le service ne répond pas. Réessayer.</Text>
              </Alert>
            }
            empty={
              <Empty heading="Aucune relance envoyée">
                <Text variant="end">Ce client n'a encore rien reçu pour cette facture.</Text>
              </Empty>
            }
            children={(list) => (
              <Grid columns={3} space="wide">
                {list.map((r) => (
                  <Stack space="detail" key={r.id}>
                    <Heading level={3}>{r.date}</Heading>
                    <Text variant="end">{r.channel}</Text>
                  </Stack>
                ))}
              </Grid>
            )}
          />
        </Stack>
      </Section>

      <Section density="normal" background>
        <Stack space="wide">
          <Heading level={2}>Agir</Heading>
          <Stack space="card">
            <Button onPress={launch}>{inWaiting ? 'Envoi de la relance…' : 'Relancer maintenant'}</Button>
            {error ? <Text variant="end">La relance n'est pas partie. Réessayer.</Text> : null}
          </Stack>
        </Stack>
      </Section>
    </main>
  )
}
