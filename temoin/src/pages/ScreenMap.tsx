/* É5 · La carte — parcours P3 · Acter une décision.
 *
 * Ce qui compte d'abord : LE PROCHAIN JALON OUVRABLE, et ce qui le bloque. Une
 * carte qui commence par l'inventaire fait chercher l'endroit où l'on est —
 * c'est l'empilement de donnée brute que le verdict de K1 a nommé.
 *
 * Elle décrit le présent. Le « pourquoi » vit dans le journal, et les deux
 * écrans ne se recouvrent pas : celui-ci ne raconte rien.
 *
 * L'erreur n'affiche AUCUNE carte partielle. Une carte incomplète se lit comme
 * un système incomplet, et c'est un mensonge plus coûteux qu'un refus.
 */
import {
  Section, Heading, Text, Stack, Grid, Chip, Alert, Empty, Skeleton,
  StateAsync, useRequest, LABELS, phrase,
} from '../system/index.ts'

type Line = { name: string; status: string }
type Milestone = Line & { locked: string; blocked: string }
type Contract = Line & { governs: string; assertions: string }
type Template = Line & { journey: string; witness: string }
type Piece = Line & { door: string; blocked: string }
type Debt = Line & { since: string; cost: string }
type Card = {
  milestones: Milestone[]
  contracts: Contract[]
  templates: Template[]
  instrument: Piece[]
  debts: Debt[]
  next: { name: string; status: string; blocked: string } | null
}

const T = LABELS.screens.card

/* Un statut ne se lit jamais à la couleur seule : la pastille est doublée du
   libellé que le registre déclare (K2 §7.1). */
const TONE: Record<string, 'lock' | 'waiting' | 'idea' | 'refusal'> = {
  '🟢': 'lock', '🟡': 'waiting', '⚪': 'idea', '🔴': 'refusal',
}
const WORD: Record<string, string> = {
  '🟢': LABELS.common.statuses.lock,
  '🟡': LABELS.common.statuses.waiting,
  '⚪': LABELS.common.statuses.idea,
  '🔴': LABELS.common.statuses.refusal,
}
const tone = (p: string) => TONE[p] ?? 'idea'
const word = (p: string) => WORD[p] ?? p

export function ScreenMap() {
  const card = useRequest<Card>('/carte')

  return (
    <main>
      {/* ── ample · la tête : le prochain jalon, et ce qui le bloque ─────── */}
      <Section head density="ample">
        <Stack space="wide">
          <Stack space="container">
            <Text variant="menu">{T.kicker}</Text>
            <Heading level={1}>{T.heading}</Heading>
            <Text variant="lede">{T.lede}</Text>
          </Stack>
          <StateAsync
            request={card}
            loading={<Skeleton shape="tokens" lines={1} />}
            error={
              <Alert heading={T.states.errorHeading} announces="alert">
                <Stack space="card">
                  <Text variant="end">
                    {phrase(T.states.errorBody, { reason: card.error ?? '' })}
                  </Text>
                  <Text variant="end">{T.states.errorHelp}</Text>
                </Stack>
              </Alert>
            }
            empty={
              <Empty heading={T.states.emptyHeading}>
                <Text variant="end">{T.states.emptyBody}</Text>
              </Empty>
            }
            children={(c) =>
              c.next === null ? (
                <Empty heading={T.states.emptyHeading}>
                  <Text variant="end">{T.states.emptyBody}</Text>
                </Empty>
              ) : (
                <Stack space="wide">
                  <Stack space="detail">
                    <Text variant="menu">{T.nextHeading}</Text>
                    <Heading level={2}>{c.next.name}</Heading>
                  </Stack>
                  <Stack space="detail">
                    <Text variant="menu">{T.nextBlocked}</Text>
                    <Text variant="body">
                      {c.next.blocked === '—' ? T.nextFree : c.next.blocked}
                    </Text>
                  </Stack>
                </Stack>
              )
            }
          />
        </Stack>
      </Section>

      {/* ── compact · le chapitre et les contrats ────────────────────────── */}
      <Section density="compact" door>
        <Stack space="wide">
          <StateAsync
            request={card}
            loading={<Skeleton shape="lines" lines={3} />}
            error={
              <Alert heading={T.states.suspendedHeading} tone="waiting" announces="status">
                <Text variant="end">{T.states.errorHelp}</Text>
              </Alert>
            }
            empty={
              <Empty heading={T.states.emptyHeading}>
                <Text variant="end">{T.states.emptyBody}</Text>
              </Empty>
            }
            children={(c) => (
              <Stack space="wide">
                <Stack space="page">
                  <Heading level={2}>{T.milestonesHeading}</Heading>
                  <Stack space="page">
                    {c.milestones.map((j) => (
                      <Stack space="detail" key={j.name}>
                        <Chip repeats tone={tone(j.status)}>{word(j.status)}</Chip>
                        <Heading level={3}>{j.name}</Heading>
                        <Text variant="end">{j.locked}</Text>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
                <Stack space="page">
                  <Heading level={2}>{T.contractsHeading}</Heading>
                  <Grid columns={2} space="wide">
                    {c.contracts.map((x) => (
                      <Stack space="detail" key={x.name}>
                        <Chip repeats tone={tone(x.status)}>{word(x.status)}</Chip>
                        <Heading level={3}>{x.name}</Heading>
                        <Text variant="end">{x.governs}</Text>
                      </Stack>
                    ))}
                  </Grid>
                </Stack>
              </Stack>
            )}
          />
        </Stack>
      </Section>

      {/* ── normal · les gabarits et l'instrument ────────────────────────── */}
      <Section density="normal">
        <Stack space="wide">
          <StateAsync
            request={card}
            loading={<Skeleton shape="lines" lines={3} />}
            error={
              <Alert heading={T.states.suspendedHeading} tone="waiting" announces="status">
                <Text variant="end">{T.states.errorHelp}</Text>
              </Alert>
            }
            empty={
              <Empty heading={T.states.emptyHeading}>
                <Text variant="end">{T.states.emptyBody}</Text>
              </Empty>
            }
            children={(c) => (
              <Stack space="wide">
                <Stack space="page">
                  <Heading level={2}>{T.templatesHeading}</Heading>
                  <Grid columns={2} space="wide">
                    {c.templates.map((g) => (
                      <Stack space="detail" key={g.name}>
                        <Chip repeats tone={tone(g.status)}>{word(g.status)}</Chip>
                        <Heading level={3}>{g.name}</Heading>
                        <Text variant="end">{g.witness}</Text>
                      </Stack>
                    ))}
                  </Grid>
                </Stack>
                <Stack space="page">
                  <Heading level={2}>{T.instrumentHeading}</Heading>
                  <Stack space="page">
                    {c.instrument.map((p) => (
                      <Stack space="detail" key={p.name}>
                        <Chip repeats tone={tone(p.status)}>{word(p.status)}</Chip>
                        <Heading level={3}>{p.name}</Heading>
                        <Text variant="end">{p.door}</Text>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              </Stack>
            )}
          />
        </Stack>
      </Section>

      {/* ── compact · les dettes ─────────────────────────────────────────── */}
      <Section density="compact" door>
        <Stack space="wide">
          <StateAsync
            request={card}
            loading={
              <>
                <Stack space="card">
                  <Skeleton shape="heading" />
                  <Skeleton shape="lines" lines={1} />
                </Stack>
                <Skeleton shape="lines" lines={2} />
              </>
            }
            error={
              <>
                <Stack space="card">
                  <Heading level={2}>{T.debtsHeading}</Heading>
                  <Text variant="end">{T.debtsHelp}</Text>
                </Stack>
                <Alert heading={T.states.suspendedHeading} tone="waiting" announces="status">
                  <Text variant="end">{T.states.debtSuspended}</Text>
                </Alert>
              </>
            }
            empty={
              <>
                <Stack space="card">
                  <Heading level={2}>{T.debtsHeading}</Heading>
                  <Text variant="end">{T.debtsHelp}</Text>
                </Stack>
                <Empty heading={T.states.emptyHeading}>
                  <Text variant="end">{T.states.emptyBody}</Text>
                </Empty>
              </>
            }
            children={(c) => (
              <>
                <Stack space="card">
                  <Heading level={2}>{T.debtsHeading}</Heading>
                  <Text variant="end">{T.debtsHelp}</Text>
                </Stack>
                <Stack space="wide">
                  {c.debts.map((d) => (
                    <Stack space="card" key={d.name}>
                      <Chip repeats tone={tone(d.status)}>{word(d.status)}</Chip>
                      <Heading level={3}>{d.name}</Heading>
                      <Text variant="end">{d.cost}</Text>
                    </Stack>
                  ))}
                </Stack>
              </>
            )}
          />
        </Stack>
      </Section>
    </main>
  )
}
