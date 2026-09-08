import {
  Section, Heading, Text, Stack, Grid, Chip,
  Alert, Empty, Skeleton, Button, TextField, StateAsync
} from '../../design-system/index.ts'
import { useRequest, useMutation } from '../../design-system/data/useRequest.js'

export function TrackingInvoices() {
  const invoices = useRequest('/factures')
  const { launch, inWaiting, error } = useMutation('/relances')

  return (
    <main>
      <Section density="ample">
        <Stack space="wide">
          <Text variant="menu">Facturation</Text>
          <Heading level={1}>Suivi des factures</Heading>
          <Text variant="lede">
            Les factures en cours, leur échéance et leur statut. Relancer un client
            envoie un rappel et vous dit ce qu'il est devenu.
          </Text>
        </Stack>
      </Section>

      <Section density="compact" background>
        <Stack space="wide">
          <Heading level={2}>Filtrer</Heading>
          <Grid columns={2} space="wide">
            <Stack space="card">
              <TextField id="client" label="Rechercher un client" />
            </Stack>
            <Stack space="card">
              <TextField id="status" label="Statut" />
            </Stack>
          </Grid>
        </Stack>
      </Section>

      <Section density="normal">
        <Stack space="wide">
          <Heading level={2}>Les factures</Heading>
          <StateAsync
            request={invoices}
            loading={<Skeleton lines={4} />}
            error={
              <Alert heading="Les factures n'ont pas pu être chargées">
                <Text variant="end">
                  Le service de facturation ne répond pas. Aucune relance n'a été
                  envoyée. Réessayer, ou revenir plus tard.
                </Text>
              </Alert>
            }
            empty={
              <Empty heading="Aucune facture en cours">
                <Text variant="end">
                  Rien n'est en attente de paiement. Les factures réglées
                  n'apparaissent pas ici.
                </Text>
              </Empty>
            }
            children={(list) => (
              <Grid columns={3} space="wide">
                {list.map((invoice) => (
                  <Stack space="detail" key={invoice.id}>
                    <Heading level={3}>{invoice.client}</Heading>
                    <Text variant="end">{invoice.amount} · échéance {invoice.due}</Text>
                    <Chip tone="waiting">{invoice.status}</Chip>
                  </Stack>
                ))}
              </Grid>
            )}
          />
        </Stack>
      </Section>

      <Section density="normal" background>
        <Stack space="wide">
          <Heading level={2}>Relancer</Heading>
          <Stack space="card">
            <Button onPress={launch}>{inWaiting ? 'Envoi de la relance…' : 'Relancer le client'}</Button>
            {error ? <Text variant="end">La relance n'est pas partie. Réessayer.</Text> : null}
          </Stack>
        </Stack>
      </Section>

      <Section density="compact">
        <Text variant="end">Les relances sont conservées trente jours, puis effacées.</Text>
      </Section>
    </main>
  )
}
