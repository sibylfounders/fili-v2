/* É3 · La famille des témoins — parcours P2 · Juger un témoin.
 *
 * Ce qui compte d'abord : LE TÉMOIN COURANT de chaque gabarit. L'historique se
 * déplie ; il ne s'expose pas. Un écran qui déroule toutes les générations fait
 * chercher le présent dans le passé — c'est la même faute que K1 a nommée sur
 * l'empilement de donnée brute.
 *
 * Le témoin est montré RENDU, en vignette, depuis le fichier que la chaîne a
 * produit à partir de la source vérifiée (#016). Aucune capture, aucune
 * miniature dessinée : ce qu'on voit est ce qui sera jugé.
 *
 * Un témoin illisible est SIGNALÉ, et les autres restent lisibles (K2 §6). Le
 * masquer donnerait une famille complète en apparence, avec un trou muet.
 */
import {
  Section, Heading, Text, Stack, Grid, Chip, Alert, Empty, Skeleton,
  Button, Render, StateAsync, useRequest, LABELS, phrase,
} from '../system/index.ts'

type Generation = { date: string; states: number; unreadable: boolean }
type Family = {
  template: string
  name: string
  current: Generation | null
  preview: string | null
  history: Generation[]
}

const T = LABELS.screens.family
const C = LABELS.common

export function ScreenFamily() {
  const families = useRequest<Family[]>('/temoins')

  return (
    <main>
      {/* ── ample · la tête : les témoins courants, rien d'autre ─────────── */}
      <Section head density="ample">
        <Stack space="wide">
          <Stack space="container">
            <Text variant="menu">{T.kicker}</Text>
            <Heading level={1}>{T.heading}</Heading>
            <Text variant="lede">{T.lede}</Text>
          </Stack>
          <StateAsync
            request={families}
            loading={<Skeleton shape="block" lines={1} />}
            error={
              <Alert heading={T.states.errorHeading} announces="alert">
                <Stack space="card">
                  <Text variant="end">
                    {phrase(T.states.errorBody, { reason: families.error ?? '' })}
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
              <Grid columns={2} space="wide">
                {list.map((f) => (
                  <Stack space="page" key={f.template}>
                    <Stack space="detail">
                      <Text variant="menu">{f.template}</Text>
                      <Heading level={2}>{f.name}</Heading>
                    </Stack>
                    {f.current === null ? (
                      <Empty heading={T.states.emptyHeading}>
                        <Text variant="end">{T.states.emptyBody}</Text>
                      </Empty>
                    ) : f.current.unreadable || f.preview === null ? (
                      <Alert heading={T.states.suspendedHeading} tone="waiting" announces="status">
                        <Text variant="end">{T.unreadable}</Text>
                      </Alert>
                    ) : (
                      <Render source={f.preview} heading={f.name} height="thumbnail" />
                    )}
                    {f.current === null ? null : (
                      <Stack space="detail">
                        <Chip repeats tone="idea">{f.current.date}</Chip>
                        <Text variant="end">
                          {phrase(T.statesCount, { n: f.current.states })}
                        </Text>
                      </Stack>
                    )}
                    <Button
                      disabled={f.current === null || f.current.unreadable}
                      onPress={() => {
                        window.location.hash = `#jugement/${f.template}`
                      }}
                    >
                      {C.actions.judgeTheWitness}
                    </Button>
                  </Stack>
                ))}
              </Grid>
            )}
          />
        </Stack>
      </Section>

      {/* ── compact · l'historique, qui se déplie et ne s'expose pas ─────── */}
      <Section density="compact" door>
        <Stack space="wide">
          <StateAsync
            request={families}
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
                  <Heading level={2}>{T.historyHeading}</Heading>
                  <Text variant="end">{T.historyHelp}</Text>
                </Stack>
                <Alert heading={T.states.suspendedHeading} tone="waiting" announces="status">
                  <Text variant="end">{T.states.historySuspended}</Text>
                </Alert>
              </>
            }
            empty={
              <>
                <Stack space="card">
                  <Heading level={2}>{T.historyHeading}</Heading>
                  <Text variant="end">{T.historyHelp}</Text>
                </Stack>
                <Empty heading={T.states.emptyHeading}>
                  <Text variant="end">{T.states.emptyBody}</Text>
                </Empty>
              </>
            }
            children={(list) => (
              <>
                <Stack space="card">
                  <Heading level={2}>{T.historyHeading}</Heading>
                  <Text variant="end">{T.historyHelp}</Text>
                </Stack>
                <Stack space="wide">
                  {list.map((f) => (
                    <Stack space="card" key={f.template}>
                      <Heading level={3}>{f.name}</Heading>
                      {f.history.length === 0 ? (
                        <Text variant="end">{T.states.emptyBody}</Text>
                      ) : (
                        <Stack space="detail">
                          {f.history.map((g) => (
                            <Text variant="end" key={g.date}>
                              {g.date} — {phrase(T.statesCount, { n: g.states })}
                            </Text>
                          ))}
                        </Stack>
                      )}
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
