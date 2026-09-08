import { Stack, Grid, Heading, Text } from '../design-system/index.ts'

export function KOS312() {
  return (
    <Grid columns={3} space="page">
      <Stack space="page"><Heading level={3}>Un</Heading><Text variant="end">Description</Text></Stack>
      <Stack space="page"><Heading level={3}>Deux</Heading><Text variant="end">Description</Text></Stack>
      <Stack space="page"><Heading level={3}>Trois</Heading><Text variant="end">Description</Text></Stack>
    </Grid>
  )
}
