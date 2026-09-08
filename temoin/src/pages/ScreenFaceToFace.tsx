/* É4 · Le face-à-face — parcours P2 · Juger un témoin.
 *
 * Ce qui compte d'abord : L'IMAGE, pleine largeur. Tout le reste après. Un
 * écran de jugement qui met la métadonnée avant l'image fait juger la
 * métadonnée — K2 §5. Le titre reste présent parce qu'une page sans titre de
 * premier niveau n'est pas navigable ; la métadonnée, elle, est reléguée à la
 * section suivante. C'est une promesse de composition, et c'est l'œil qui la
 * tranche au point de passage B-1.
 *
 * La comparaison se fait PAR BASCULE, au même endroit : le précédent remplace
 * le courant dans le même cadre. Côte à côte, chaque rendu perdrait la moitié
 * de la largeur et l'on jugerait deux vignettes ; en bascule, l'œil compare de
 * mémoire immédiate, et c'est ce qui révèle les écarts de rythme.
 *
 * L'erreur n'affiche AUCUNE image de secours (K2 §6) : juger une capture au
 * lieu du rendu vérifié annulerait le sens du témoin (#016).
 *
 * Le verdict est binaire. Un refus exige un motif écrit : un refus qu'on ne
 * peut pas relire ne vaut pas mieux qu'une hésitation.
 */
import { useState } from 'react'
import {
  Section, Heading, Text, Stack, Grid, Chip, Alert, Empty, Skeleton,
  Button, TextField, Render, StateAsync, useRequest, useMutation, LABELS, phrase,
} from '../system/index.ts'

type Generation = { date: string; source: string; states: number }
type FaceAFace = {
  template: string
  name: string
  current: Generation
  previous: Generation | null
  battery: string
}
type Verdict = { date: string; issue: string }

const T = LABELS.screens.faceAFace
const C = LABELS.common

export function ScreenFaceToFace() {
  const face = useRequest<FaceAFace>('/faceAFace')
  const verdicts = useRequest<Verdict[]>('/verdicts')
  const { launch, inWaiting, success } = useMutation('/verdicts')
  const [onPrevious, setOnPrevious] = useState(false)
  const [reason, setReason] = useState('')
  const [reasonMissing, setReasonMissing] = useState(false)

  return (
    <main>
      {/* ── ample · la tête : l'image, pleine largeur ────────────────────── */}
      <Section head density="ample">
        <Stack space="wide">
          <Stack space="card">
            <Text variant="menu">{T.kicker}</Text>
            <Heading level={1}>{T.heading}</Heading>
          </Stack>
          <StateAsync
            request={face}
            loading={<Skeleton shape="block" lines={1} />}
            error={
              <Alert heading={T.states.errorHeading} announces="alert">
                <Stack space="card">
                  <Text variant="end">
                    {phrase(T.states.errorBody, { reason: face.error ?? '' })}
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
            children={(f) => {
              const shows = onPrevious && f.previous !== null ? f.previous : f.current
              const inPrevious = onPrevious && f.previous !== null
              return (
                <Stack space="wide">
                  <Render
                    source={shows.source}
                    heading={phrase(T.frameHeading, { template: f.name, date: shows.date })}
                    height="full"
                  />
                  <Stack space="detail">
                    <Chip tone={inPrevious ? 'idea' : 'waiting'}>
                      {phrase(
                        inPrevious ? T.toggle.brandPrevious : T.toggle.brandCurrent,
                        { date: shows.date },
                      )}
                    </Chip>
                    {f.previous === null ? (
                      <Text variant="end">{T.states.emptyBody}</Text>
                    ) : (
                      <Button
                        variant="discret"
                        onPress={() => {
                          setOnPrevious(!onPrevious)
                        }}
                      >
                        {inPrevious ? T.toggle.toCurrent : T.toggle.toPrevious}
                      </Button>
                    )}
                  </Stack>
                </Stack>
              )
            }}
          />
        </Stack>
      </Section>

      {/* ── compact · la métadonnée, et pas avant ─────────────────────────── */}
      <Section density="compact" door>
        <Stack space="wide">
          <StateAsync
            request={face}
            loading={
              <>
                <Skeleton shape="heading" />
                <Skeleton shape="lines" lines={2} />
              </>
            }
            error={
              <>
                <Heading level={2}>{T.metaHeading}</Heading>
                <Alert heading={T.states.suspendedHeading} tone="waiting" announces="status">
                  <Text variant="end">{T.states.errorHelp}</Text>
                </Alert>
              </>
            }
            empty={
              <>
                <Heading level={2}>{T.metaHeading}</Heading>
                <Empty heading={T.states.emptyHeading}>
                  <Text variant="end">{T.states.emptyBody}</Text>
                </Empty>
              </>
            }
            children={(f) => (
              <>
                <Heading level={2}>{T.metaHeading}</Heading>
                <Grid columns={4} space="wide">
                  <Stack space="detail">
                    <Text variant="menu">{T.metaTemplate}</Text>
                    <Text variant="body">{f.name}</Text>
                  </Stack>
                  <Stack space="detail">
                    <Text variant="menu">{T.metaDate}</Text>
                    <Text variant="body">{f.current.date}</Text>
                  </Stack>
                  <Stack space="detail">
                    <Text variant="menu">{T.metaStates}</Text>
                    <Text variant="body">{f.current.states}</Text>
                  </Stack>
                  <Stack space="detail">
                    <Text variant="menu">{T.metaBattery}</Text>
                    <Text variant="body">{f.battery}</Text>
                  </Stack>
                </Grid>
              </>
            )}
          />
        </Stack>
      </Section>

      {/* ── normal · l'acte : accepter, ou refuser avec motif ─────────────── */}
      <Section density="normal">
        <Stack space="wide">
          <StateAsync
            request={verdicts}
            loading={
              <>
                <Stack space="card">
                  <Skeleton shape="heading" />
                  <Skeleton shape="lines" lines={1} />
                </Stack>
                <Skeleton shape="lines" lines={1} />
              </>
            }
            error={
              <>
                <Stack space="card">
                  <Heading level={2}>{T.actHeading}</Heading>
                  <Text variant="end">{T.actHelp}</Text>
                </Stack>
                <Alert heading={T.states.suspendedHeading} tone="waiting" announces="status">
                  <Text variant="end">{T.states.actClosed}</Text>
                </Alert>
              </>
            }
            empty={
              <>
                <Stack space="card">
                  <Heading level={2}>{T.actHeading}</Heading>
                  <Text variant="end">{T.actHelp}</Text>
                </Stack>
                <Stack space="wide">
                  <TextField
                    label={T.reasonLabel}
                    help={reasonMissing ? T.reasonEmpty : T.reasonHelp}
                    invalid={reasonMissing}
                    multiline
                    value={reason}
                    onInput={(v) => {
                      setReason(v)
                      setReasonMissing(false)
                    }}
                  />
                  {/* Deux cibles : l espace ne descend pas sous celui que le
                      moteur autorise, sinon le doigt se trompe (S2-T10). */}
                  <Stack space="container">
                    <Button disabled={inWaiting} onPress={launch}>
                      {inWaiting ? T.acceptInCourse : T.accept}
                    </Button>
                    <Button
                      variant="discret"
                      disabled={inWaiting}
                      onPress={() => {
                        if (reason.trim() === '') setReasonMissing(true)
                        else launch()
                      }}
                    >
                      {inWaiting ? T.refuseInCourse : T.refuse}
                    </Button>
                  </Stack>
                </Stack>
              </>
            }
            children={(list) => (
              <>
                <Stack space="card">
                  <Heading level={2}>{T.actHeading}</Heading>
                  <Text variant="end">{T.actHelp}</Text>
                </Stack>
                <Stack space="page">
                  <Stack space="detail">
                    <Text variant="menu">
                      {success ? T.states.successHeading : C.statuses.accepted}
                    </Text>
                    <Text variant="body">
                      {phrase(T.states.successBody, { date: list[0].date })}
                    </Text>
                  </Stack>
                  <Chip tone={list[0].issue === 'refusal' ? 'refusal' : 'lock'}>
                    {list[0].issue === 'refusal' ? C.statuses.refused : C.statuses.accepted}
                  </Chip>
                </Stack>
              </>
            )}
          />
        </Stack>
      </Section>
    </main>
  )
}
