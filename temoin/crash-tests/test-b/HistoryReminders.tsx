import {
  Section, Heading, Text, Stack, Grid, Chip,
  Alert, Empty, Skeleton, TextField, StateAsync
} from '../design-system/index.ts'
import { useRequest } from '../design-system/data/useRequest.js'

export function HistoryReminders() {
  const reminders = useRequest('/relances')

  return (
    <main>
      <Section density="ample">
        <Stack space="wide">
          <Text variant="menu">Facturation</Text>
          <Heading level={1}>Historique des relances</Heading>
          <Text variant="lede">
            Tout ce qui est parti, à qui, et par quel canal. Conservé trente jours.
          </Text>
        </Stack>
      </Section>

      <Section density="compact" background>
        <Stack space="wide">
          <Heading level={2}>Filtrer</Heading>
          <Grid columns={2} space="wide">
            <Stack space="card">
              <TextField id="periode" label="Période" />
            </Stack>
            <Stack space="card">
              <TextField id="channel" label="Canal" />
            </Stack>
          </Grid>
        </Stack>
      </Section>

      <Section density="compact">
        <Stack space="wide">
          <Heading level={2}>Les envois</Heading>
          <StateAsync
            request={reminders}
            loading={<Skeleton lines={3} />}
            error={
              <Alert heading="L'historique est indisponible">
                <Text variant="end">Le service ne répond pas. Aucune relance n'a été perdue. Réessayer.</Text>
              </Alert>
            }
            empty={
              <Empty heading="Aucun envoi sur la période">
                <Text variant="end">Élargissez la période, ou réinitialisez le filtre.</Text>
              </Empty>
            }
            children={(list) => (
              <Grid columns={3} space="wide">
                {list.map((r) => (
                  <Stack space="detail" key={r.id}>
                    <Heading level={3}>{r.client}</Heading>
                    <Text variant="end">{r.date}</Text>
                    <Chip tone="lock">{r.channel}</Chip>
                  </Stack>
                ))}
              </Grid>
            )}
          />
        </Stack>
      </Section>

      <Section density="normal" background>
        <Stack space="page">
          <Heading level={2}>Ce que dit la loi</Heading>
          <Text variant="end">
            Les relances sont conservées trente jours puis effacées. Aucune donnée
            de paiement n'y figure.
          </Text>
        </Stack>
      </Section>
    </main>
  )
}
