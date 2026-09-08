/* É6 · Le journal — parcours P3 · Acter une décision.
 *
 * Ce qui compte d'abord : LA DERNIÈRE DÉCISION, lisible en entier. Les
 * précédentes sont consultables et ne s'exposent pas — cinquante entrées
 * affichées d'emblée sont exactement l'empilement de donnée brute que le
 * verdict de K1 a nommé.
 *
 * Rien n'est résumé. Une entrée se lit en entier ou pas du tout : un journal
 * résumé par la machine qui l'affiche est un journal réécrit par elle, et la
 * règle 3 — on n'édite jamais une entrée passée — vaut aussi pour celui qui la
 * donne à voir.
 *
 * Le produit n'offre AUCUN geste d'édition. Ce n'est pas une omission : c'est
 * la règle rendue mécanique par l'absence du bouton (K2 §10.3).
 */
import { useState } from 'react'
import {
  Section, Heading, Text, Stack, Chip, Alert, Empty, Skeleton,
  Button, Prose, StateAsync, useRequest, LABELS, phrase,
} from '../system/index.ts'

type Entry = {
  number: string
  heading: string
  date: string
  dot: string
  status: string
  body: string
}

const T = LABELS.screens.journal

const TONE: Record<string, 'lock' | 'waiting' | 'idea' | 'refusal'> = {
  '🟢': 'lock', '🟡': 'waiting', '⚪': 'idea', '🔴': 'refusal',
}
const tone = (p: string) => TONE[p] ?? 'idea'

export function ScreenJournal() {
  const journal = useRequest<Entry[]>('/journal')
  const [open, setOpen] = useState<string[]>([])
  const toggle = (n: string) => {
    setOpen(open.includes(n) ? open.filter((x) => x !== n) : [...open, n])
  }

  return (
    <main>
      {/* ── ample · la tête : la dernière décision, en entier ─────────────── */}
      <Section head density="ample">
        <Stack space="wide">
          <Stack space="container">
            <Text variant="menu">{T.kicker}</Text>
            <Heading level={1}>{T.heading}</Heading>
            <Text variant="lede">{T.lede}</Text>
          </Stack>
          <StateAsync
            request={journal}
            loading={<Skeleton shape="lines" lines={4} />}
            error={
              <Alert heading={T.states.errorHeading} announces="alert">
                <Stack space="card">
                  <Text variant="end">
                    {phrase(T.states.errorBody, { reason: journal.error ?? '' })}
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
            children={(list) => (
              <Stack space="wide">
                <Stack space="card">
                  <Text variant="menu">{T.lastOneHeading}</Text>
                  <Chip repeats tone={tone(list[0].dot)}>
                    {list[0].number} · {list[0].date}
                  </Chip>
                  <Heading level={2}>{list[0].heading}</Heading>
                </Stack>
                <Prose text={list[0].body} />
              </Stack>
            )}
          />
        </Stack>
      </Section>

      {/* ── compact · les précédentes, repliées ──────────────────────────── */}
      <Section density="compact" door>
        <Stack space="wide">
          <StateAsync
            request={journal}
            loading={
              <>
                <Stack space="card">
                  <Skeleton shape="heading" />
                  <Skeleton shape="lines" lines={1} />
                </Stack>
                <Skeleton shape="lines" lines={3} />
              </>
            }
            error={
              <>
                <Stack space="card">
                  <Heading level={2}>{T.previousHeading}</Heading>
                  <Text variant="end">{T.previousHelp}</Text>
                </Stack>
                <Alert heading={T.states.suspendedHeading} tone="waiting" announces="status">
                  <Text variant="end">{T.states.previousSuspended}</Text>
                </Alert>
              </>
            }
            empty={
              <>
                <Stack space="card">
                  <Heading level={2}>{T.previousHeading}</Heading>
                  <Text variant="end">{T.previousHelp}</Text>
                </Stack>
                <Empty heading={T.states.emptyHeading}>
                  <Text variant="end">{T.states.emptyBody}</Text>
                </Empty>
              </>
            }
            children={(list) => (
              <>
                <Stack space="card">
                  <Heading level={2}>{T.previousHeading}</Heading>
                  <Text variant="end">{T.previousHelp}</Text>
                </Stack>
                {list.length < 2 ? (
                  <Empty heading={T.states.emptyHeading}>
                    <Text variant="end">{T.states.emptyBody}</Text>
                  </Empty>
                ) : (
                  <Stack space="wide">
                    {list.slice(1).map((e) => (
                      <Stack space="card" key={e.number}>
                        <Chip repeats tone={tone(e.dot)}>
                          {e.number} · {e.date}
                        </Chip>
                        <Heading level={3}>{e.heading}</Heading>
                        <Button
                          variant="discret"
                          onPress={() => {
                            toggle(e.number)
                          }}
                        >
                          {open.includes(e.number) ? T.fold : T.unfold}
                        </Button>
                        {open.includes(e.number) ? <Prose text={e.body} /> : null}
                      </Stack>
                    ))}
                  </Stack>
                )}
              </>
            )}
          />
        </Stack>
      </Section>

      {/* ── normal · ce que le journal a perdu, et qui reste écrit ────────── */}
      <Section density="normal">
        <Stack space="wide">
          <StateAsync
            request={journal}
            loading={<Skeleton shape="lines" lines={1} />}
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
            children={(list) => (
              <Stack space="card">
                <Text variant="menu">{phrase(T.count, { n: list.length })}</Text>
                <Text variant="body">{T.hole}</Text>
              </Stack>
            )}
          />
        </Stack>
      </Section>
    </main>
  )
}
