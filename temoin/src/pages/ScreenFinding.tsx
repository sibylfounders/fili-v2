/* É2 · Le constat — parcours P1 · Prononcer le verdict.
 *
 * Ce qui compte d'abord : l'assertion et sa raison d'être, PAS la ligne
 * fautive. Un écran qui liste les fichiers d'abord fait croire que le problème
 * est local alors qu'il est doctrinal (K2 §5).
 *
 * Cet écran n'a pas d'acte : il se lit. C'est assumé — le parcours P1 porte
 * son acte sur É1, et un écran qui n'agit pas n'est pas pour autant une
 * surface morte.
 */
import {
  Section, Heading, Text, Stack, Chip, Alert, Empty, Skeleton,
  Button, StateAsync, useRequest, LABELS, phrase,
} from '../system/index.ts'

type Assertion = {
  id: string
  contract: string
  statement: string
  reason: string
  ruptureLiftable: boolean
}
type Occurrence = { id: string; file: string; line: number }

const T = LABELS.screens.finding
const C = LABELS.common

export function ScreenFinding() {
  const finding = useRequest<Assertion>('/constat')
  const occurrences = useRequest<Occurrence[]>('/occurrences')

  return (
    <main>
      {/* ── ample · la tête : l'assertion et sa raison d'être ─────────────── */}
      <Section head density="ample">
        <StateAsync
          request={finding}
          loading={<Skeleton shape="lines" lines={3} />}
          error={
            <Alert heading={T.states.errorHeading} announces="alert">
              <Text variant="end">
                {phrase(T.states.errorBody, { reason: finding.error ?? '' })}
              </Text>
            </Alert>
          }
          empty={
            <Empty heading={T.states.emptyHeading}>
              <Text variant="end">
                {phrase(T.states.emptyBody, { assertion: 'Cette assertion' })}
              </Text>
            </Empty>
          }
          children={(a) => (
            <Stack space="wide">
              <Stack space="container">
                <Text variant="menu">{T.kicker}</Text>
                <Heading level={1}>{phrase(T.heading, { assertion: a.id })}</Heading>
                <Text variant="lede">{a.statement}</Text>
              </Stack>
              <Stack space="card">
                <Chip tone="refusal">{a.id}</Chip>
                <Text variant="end">{T.reasonHelp}</Text>
              </Stack>
            </Stack>
          )}
        />
      </Section>

      {/* ── compact · d'où elle vient, et ce qu'une rupture ne lève jamais ── */}
      <Section density="compact" door>
        <StateAsync
          request={finding}
          loading={<Skeleton shape="lines" lines={2} />}
          error={
            <Alert heading={T.states.errorHeading} tone="waiting" announces="status">
              <Text variant="end">
                {phrase(T.states.errorBody, { reason: finding.error ?? '' })}
              </Text>
            </Alert>
          }
          empty={
            <Empty heading={T.contractHeading}>
              <Text variant="end">
                {phrase(T.states.emptyBody, { assertion: 'Cette assertion' })}
              </Text>
            </Empty>
          }
          children={(a) => (
            <Stack space="wide">
              <Stack space="card">
                <Heading level={2}>{T.reasonHeading}</Heading>
                <Text variant="body">{a.reason}</Text>
              </Stack>
              <Stack space="card">
                <Heading level={3}>{T.contractHeading}</Heading>
                <Text variant="end">{a.contract}</Text>
              </Stack>
              <Stack space="card">
                <Heading level={3}>{T.ruptureHeading}</Heading>
                <Text variant="end">{T.ruptureBody}</Text>
              </Stack>
            </Stack>
          )}
        />
      </Section>

      {/* ── normal · où elle rougit — le fichier n'arrive qu'ici ──────────── */}
      <Section density="normal">
        <Stack space="wide">
          <StateAsync
            request={occurrences}
            loading={
              <>
                <Stack space="card">
                  <Skeleton shape="heading" />
                  <Skeleton shape="lines" lines={1} />
                </Stack>
                <Skeleton shape="lines" lines={4} />
              </>
            }
            error={
              <>
                <Stack space="card">
                  <Heading level={2}>{T.occurrencesHeading}</Heading>
                  <Text variant="end">{T.occurrencesHelp}</Text>
                </Stack>
                <Alert heading={T.states.suspendedHeading} tone="waiting" announces="status">
                  <Text variant="end">{T.states.occurrencesSuspended}</Text>
                </Alert>
              </>
            }
            empty={
              <>
                <Stack space="card">
                  <Heading level={2}>{T.occurrencesHeading}</Heading>
                  <Text variant="end">{T.occurrencesHelp}</Text>
                </Stack>
                <Empty heading={T.states.emptyHeading}>
                  <Text variant="end">
                    {phrase(T.states.emptyBody, { assertion: 'Cette assertion' })}
                  </Text>
                </Empty>
              </>
            }
            children={(list) => (
              <>
                <Stack space="card">
                  <Heading level={2}>{T.occurrencesHeading}</Heading>
                  <Text variant="end">{T.occurrencesHelp}</Text>
                </Stack>
                <Stack space="wide">
                  {list.map((o) => (
                    <Stack space="card" key={o.id}>
                      <Text variant="body">
                        {phrase(T.occurrenceFile, { file: o.file, line: o.line })}
                      </Text>
                    </Stack>
                  ))}
                </Stack>
              </>
            )}
          />
        </Stack>
      </Section>

      {/* ── compact · le retour ──────────────────────────────────────────── */}
      <Section density="compact" door>
        <Stack space="page">
          <Heading level={2}>{C.actions.gobackAtVerdict}</Heading>
          <Button variant="discret">{C.actions.gobackAtVerdict}</Button>
        </Stack>
      </Section>
    </main>
  )
}
