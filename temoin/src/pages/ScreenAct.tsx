/* É7 · L'acte — parcours P3 · Acter une décision.
 *
 * Ce qui compte d'abord : CE QUE LA DÉCISION FERME. L'écran s'ouvre sur cette
 * seule question, et le récit vient après. L'ordre n'est pas une commodité de
 * formulaire : des conséquences écrites en dernier se rédigent quand la
 * décision est déjà racontée, donc déjà justifiée — on décrit alors le coût
 * d'une chose qu'on a fini de défendre.
 *
 * Fili COMPOSE, il n'écrit pas dans le journal. C'est l'arbitrage d'Auteur, et
 * il a une conséquence heureuse : une entrée passée reste hors de portée du
 * produit, parce que le produit n'a jamais la main dessus.
 *
 * Aucun geste d'édition n'existe ici. Ce n'est pas une omission : c'est la
 * règle 3 du journal rendue mécanique par l'absence du bouton (K2 §10.3).
 */
import { useState } from 'react'
import {
  Section, Heading, Text, Stack, Chip, Alert, Empty, Skeleton,
  Button, TextField, Selection, StateAsync, useRequest, useMutation, LABELS, phrase,
} from '../system/index.ts'
import type { Option } from '../system/index.ts'

type Target = { id: string; group: string; name: string; status: string }
type Act = {
  number: string
  date: string
  lockGreen: boolean
  reasonLock: string | null
  targets: Target[]
}
type Draft = { number: string; date: string; heading: string }

const T = LABELS.screens.act
const C = LABELS.common

/* Les quatre statuts que la carte emploie, dans l'ordre où elle les déclare.
   « Verrouillé » est montré même quand il est refusé : un choix retiré de la
   liste laisse croire qu'il n'existe pas, alors qu'il existe et qu'il n'est
   pas ouvert maintenant. */
const STATUSES = (lockGreen: boolean): Option[] => [
  { value: '🟢', label: C.statuses.lock, unavailable: !lockGreen },
  { value: '🟡', label: C.statuses.waiting },
  { value: '⚪', label: C.statuses.idea },
  { value: '🔴', label: C.statuses.refusal },
]

export function ScreenAct() {
  const act = useRequest<Act>('/acte')
  const drafts = useRequest<Draft[]>('/brouillons')
  const { launch, inWaiting, success } = useMutation('/brouillons')

  const [consequences, setConsequences] = useState('')
  const [context, setContext] = useState('')
  const [decision, setDecision] = useState('')
  const [direction, setDirection] = useState('')
  const [alternatives, setAlternatives] = useState('')
  const [target, setTarget] = useState('')
  const [to, setTo] = useState('🟡')
  const [missing, setMissing] = useState<string[]>([])

  const verify = () => {
    const holes: string[] = []
    if (consequences.trim() === '') holes.push(T.consequencesLabel)
    if (decision.trim() === '') holes.push(T.decisionLabel)
    if (alternatives.trim() === '') holes.push(T.alternativesLabel)
    if (target === '') holes.push(T.targetLabel)
    setMissing(holes)
    if (holes.length === 0) launch()
  }

  return (
    <main>
      {/* ── ample · la tête : ce que la décision ferme, et rien d'autre ──── */}
      <Section head density="ample">
        <Stack space="wide">
          <Stack space="container">
            <Text variant="menu">{T.kicker}</Text>
            <Heading level={1}>{T.heading}</Heading>
            <Text variant="lede">{T.lede}</Text>
          </Stack>
          <StateAsync
            request={act}
            loading={<Skeleton shape="lines" lines={3} />}
            error={
              <Alert heading={T.states.errorHeading} announces="alert">
                <Stack space="card">
                  <Text variant="end">
                    {phrase(T.states.errorBody, { reason: act.error ?? '' })}
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
            children={(a) => (
              <Stack space="wide">
                <Stack space="detail">
                  <Text variant="menu">{T.numberHeading}</Text>
                  <Chip tone="idea">
                    {a.number} · {a.date}
                  </Chip>
                  <Text variant="end">{T.numberHelp}</Text>
                </Stack>
                <TextField
                  label={T.consequencesLabel}
                  help={T.consequencesHelp}
                  multiline
                  disabled={inWaiting}
                  value={consequences}
                  onInput={setConsequences}
                />
              </Stack>
            )}
          />
        </Stack>
      </Section>

      {/* ── compact · le reste de l'entrée, dans l'ordre du journal ──────── */}
      <Section density="compact" door>
        <Stack space="wide">
          <Stack space="card">
            <Heading level={2}>{T.restHeading}</Heading>
            <Text variant="end">{T.restHelp}</Text>
          </Stack>
          <TextField
              label={T.contextLabel}
              multiline
              disabled={inWaiting}
              value={context}
              onInput={setContext}
            />
            <TextField
              label={T.decisionLabel}
              disabled={inWaiting}
              value={decision}
              onInput={setDecision}
            />
            <TextField
              label={T.directionLabel}
              multiline
              disabled={inWaiting}
              value={direction}
              onInput={setDirection}
            />
            <TextField
              label={T.alternativesLabel}
              help={T.alternativesHelp}
              multiline
              disabled={inWaiting}
              value={alternatives}
              onInput={setAlternatives}
            />
        </Stack>
      </Section>

      {/* ── normal · le déplacement de statut, et le verrou qui se mérite ── */}
      <Section density="normal">
        <Stack space="wide">
          <StateAsync
            request={act}
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
                  <Heading level={2}>{T.statusHeading}</Heading>
                  <Text variant="end">{T.statusHelp}</Text>
                </Stack>
                <Alert heading={T.states.suspendedHeading} tone="waiting" announces="status">
                  <Text variant="end">{T.states.actClosed}</Text>
                </Alert>
              </>
            }
            empty={
              <>
                <Stack space="card">
                  <Heading level={2}>{T.statusHeading}</Heading>
                  <Text variant="end">{T.statusHelp}</Text>
                </Stack>
                <Empty heading={T.states.emptyHeading}>
                  <Text variant="end">{T.states.emptyBody}</Text>
                </Empty>
              </>
            }
            children={(a) => (
              <>
                <Stack space="card">
                  <Heading level={2}>{T.statusHeading}</Heading>
                  <Text variant="end">{T.statusHelp}</Text>
                </Stack>
                <Stack space="wide">
                  <Selection
                    label={T.targetLabel}
                    help={T.targetHelp}
                    disabled={inWaiting}
                    value={target}
                    onChoice={setTarget}
                    options={a.targets.map((c) => ({
                      value: c.id,
                      label: `${c.status} ${c.name}`,
                      group: c.group,
                    }))}
                  />
                  <Selection
                    label={T.toLabel}
                    disabled={inWaiting}
                    value={to}
                    onChoice={setTo}
                    options={STATUSES(a.lockGreen)}
                  />
                  {a.lockGreen ? (
                    <Alert heading={T.lockHeading} tone="waiting" announces="status">
                      <Text variant="end">{T.lockOpen}</Text>
                    </Alert>
                  ) : (
                    <Alert heading={T.lockHeading} announces="alert">
                      <Text variant="end">
                        {phrase(T.lockClosed, { reason: a.reasonLock ?? '' })}
                      </Text>
                    </Alert>
                  )}
                </Stack>
              </>
            )}
          />
        </Stack>
      </Section>

      {/* ── compact · déposer, et ce qui a déjà été composé ──────────────── */}
      <Section density="compact" door>
        <Stack space="wide">
          <StateAsync
            request={drafts}
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
                  <Heading level={2}>{T.draftsHeading}</Heading>
                  <Text variant="end">{T.draftsHelp}</Text>
                </Stack>
                <Alert heading={T.states.errorHeading} announces="alert">
                  <Stack space="card">
                    <Text variant="end">
                      {phrase(T.states.errorBody, { reason: drafts.error ?? '' })}
                    </Text>
                    <Text variant="end">{T.states.errorHelp}</Text>
                  </Stack>
                </Alert>
              </>
            }
            empty={
              <>
                <Stack space="card">
                  <Heading level={2}>{T.draftsHeading}</Heading>
                  <Text variant="end">{T.draftsHelp}</Text>
                </Stack>
                <Stack space="wide">
                  <Empty heading={T.states.emptyHeading}>
                    <Text variant="end">{T.states.emptyBody}</Text>
                  </Empty>
                  {missing.length === 0 ? null : (
                    <Alert heading={T.states.errorHeading} announces="alert">
                      <Text variant="end">
                        {phrase(T.fieldsMissing, { fields: missing.join(' · ') })}
                      </Text>
                    </Alert>
                  )}
                  <Button disabled={inWaiting} onPress={verify}>
                    {inWaiting ? T.dropInCourse : T.drop}
                  </Button>
                  <Text variant="end">{T.immutable}</Text>
                </Stack>
              </>
            }
            children={(list) => (
              <>
                <Stack space="card">
                  <Heading level={2}>{T.draftsHeading}</Heading>
                  <Text variant="end">{T.draftsHelp}</Text>
                </Stack>
                <Stack space="wide">
                  <Stack space="card">
                    <Text variant="menu">
                      {success ? T.states.successHeading : T.draftsHeading}
                    </Text>
                    <Text variant="body">
                      {phrase(T.states.successBody, {
                        number: list[0].number,
                        date: list[0].date,
                      })}
                    </Text>
                  </Stack>
                  <Stack space="page">
                    {list.map((b) => (
                      <Stack space="detail" key={b.number}>
                        <Chip repeats tone="waiting">
                          {b.number} · {b.date}
                        </Chip>
                        <Text variant="end">{b.heading}</Text>
                      </Stack>
                    ))}
                  </Stack>
                  <Text variant="end">{T.immutable}</Text>
                </Stack>
              </>
            )}
          />
        </Stack>
      </Section>
    </main>
  )
}
