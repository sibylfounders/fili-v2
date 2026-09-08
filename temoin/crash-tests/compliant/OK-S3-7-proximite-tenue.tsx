import { Stack, Grid, Heading, Text } from '../design-system/index.ts'

export function OKS37() {
  return (
    <Grid columns={3} space="wide">
      <Stack space="detail"><Heading level={3}>Un</Heading><Text variant="end">Description</Text></Stack>
      <Stack space="detail"><Heading level={3}>Deux</Heading><Text variant="end">Description</Text></Stack>
      <Stack space="detail"><Heading level={3}>Trois</Heading><Text variant="end">Description</Text></Stack>
    </Grid>
  )
}
