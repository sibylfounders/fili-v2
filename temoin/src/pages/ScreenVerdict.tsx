/* É1 · Le verdict — parcours P1 · Prononcer le verdict.
 *
 * Ce qui compte d'abord : LE RÉSULTAT DE LA BATTERIE. Ce que le poste de
 * travail doit dire en premier n'est pas ce qui a été fait, mais si le dépôt
 * tient et dans quelles proportions. C'est l'arbitrage d'Auteur du B-1, rendu
 * à la séance du 2026-08-07 : la déclaration de K2 §5 — l'intégrité du juge
 * d'abord — a été prononcée non, et elle tombe avec son écran.
 *
 * L'intégrité du juge ne disparaît pas pour autant : elle vient juste après,
 * parce qu'elle dit ce que le résultat vaut. Un résultat vert rendu par un
 * juge amputé ne vaut rien, et la page doit encore pouvoir le montrer — mais
 * elle le montre en deuxième, comme une garantie, plus comme un préalable.
 *
 * La marque de tête suit le résultat : elle déclare quelle section porte ce
 * qui compte d'abord, et elle ne se dessine pas autrement pour autant. Ce que
 * la déclaration promet, c'est au rendu de l'honorer, et c'est l'œil qui le
 * juge à la séance suivante.
 *
 * La respiration : seule la section du résultat est ample — c'est l'arbitrage
 * du B-9. Les trois autres ne montent pas à son niveau. Elles alternent parce
 * que R4.3 refuse trois sections de même densité à la suite : une page qui ne
 * change jamais de respiration se lit comme un formulaire. « Seul le résultat
 * respire » et « les autres ne se ressemblent pas trois fois de suite » ne
 * s'opposent pas — la seconde dit seulement comment la première s'écrit.
 *
 * L'écart de tête reste celui du 7 août : 48 px. Il avait été porté à 96 px
 * pour satisfaire R3.7 quand le résultat portait son propre titre ; ce titre
 * ayant été retiré par arbitrage d'Auteur, la valeur d'origine redevient
 * tenable et reprend sa place. Une valeur qu'aucun arbitrage ne réclame n'a
 * pas à changer.
 *
 * Le refus de statuer n'est pas une panne : c'est un verdict à part entière,
 * annoncé comme une alerte (K2 §7.2). Et il ferme l'acte : on ne consigne pas
 * un verdict qu'on n'a pas mérité (#021).
 *
 * Le succès — « Run consigné, daté » — est le cinquième état que K2 §6 déclare
 * pour ce gabarit. Il s'annonce À L'ENDROIT DU GESTE, dans la section de
 * l'acte, et nulle part ailleurs : ce qui compte d'abord est le résultat, et un
 * succès qui remonterait en tête le déplacerait. Il prend le rôle « statut » et
 * non « alerte » — un acte réussi rend compte, il n'interrompt pas —, ce qui le
 * rend audible pour un lecteur d'écran là où un simple changement d'intitulé ne
 * l'était pas. L'acte reste ouvert après coup : un poste de travail se rouvre,
 * et consigner un run plus tard n'est pas une exception à traiter mais le geste
 * normal.
 */
import {
  Section, Heading, Text, Stack, Grid, Chip, Alert, Empty, Skeleton,
  Button, StateAsync, useRequest, useMutation, LABELS, phrase,
} from '../system/index.ts'

type Integrity = { total: number; reaches: number }
type Mutations = { detected: number; total: number; date: string }
type Battery = { trapped: number; compliant: number; mutations: Mutations | null; gaps: number }
type Progress = { made: number; total: number }
type Finding = { id: string; assertion: string; contract: string; occurrences: number; files: number }
type Run = { date: string; verdict: string }

const T = LABELS.screens.verdict
const C = LABELS.common

export function ScreenVerdict() {
  const integrity = useRequest<Integrity>('/integrite')
  const battery = useRequest<Battery>('/batterie')
  const progress = useRequest<Progress>('/progression')
  const findings = useRequest<Finding[]>('/constats')
  const runs = useRequest<Run[]>('/runs')
  const { launch, inWaiting, success } = useMutation('/runs')

  return (
    <main>
      {/* ── ample · la tête : le résultat, avant tout le reste ───────────── */}
      <Section head density="ample">
        <Stack space="wide">
          <Stack space="container">
            <Text variant="menu">{T.kicker}</Text>
            <Heading level={1}>{T.heading}</Heading>
            <Text variant="lede">{T.lede}</Text>
          </Stack>
          {/* Le résultat n'a pas de titre à lui : le grand titre de la page EST
              son titre. C'est l'arbitrage d'Auteur du 2026-08-08, et il répare
              une faute de conception assistée — la réorganisation du B-1 avait
              laissé le bloc de l'intégrité sans rien au-dessus de lui, et un
              quatrième titre avait été inventé pour boucher ce trou au lieu de
              le montrer. Un déplacement de hiérarchie n'est jamais un geste
              sans contenu : il en produit toujours, et ce contenu-là ne
              s'invente pas, il s'arbitre. */}
          <StateAsync
              request={battery}
              data-intent="statement"
              data-intent-slot="loading"
              data-intent-reason="le compte qui avance est une exigence déclarée de ce gabarit — montrer une progression réelle plutôt qu'un rond qui tourne ; c'est la seule chose qui parle pendant l'attente, et elle ne décrit pas le contenu à venir"
              loading={
                <StateAsync
                  request={progress}
                  loading={<Skeleton shape="lines" lines={2} />}
                  error={
                    <Alert heading={T.states.errorHeading} tone="waiting" announces="status">
                      <Text variant="end">{T.states.errorHelp}</Text>
                    </Alert>
                  }
                  empty={
                    <Empty heading={T.batteryHeading}>
                      <Text variant="end">{T.states.emptyBody}</Text>
                    </Empty>
                  }
                  children={(p) => (
                    <Stack space="container">
                      <Chip tone="waiting">
                        {phrase(T.states.loading, { made: p.made, total: p.total })}
                      </Chip>
                      <Skeleton shape="lines" lines={2} />
                    </Stack>
                  )}
                />
              }
              error={
                <Alert heading={T.states.suspendedHeading} tone="waiting" announces="status">
                  <Text variant="end">{T.states.batterySuspended}</Text>
                </Alert>
              }
              empty={
                <Empty heading={T.batteryHeading}>
                  <Text variant="end">{T.states.emptyBody}</Text>
                </Empty>
              }
              children={(b) => (
                <Stack space="wide">
                  <Chip tone={b.gaps === 0 ? 'lock' : 'refusal'}>
                    {b.gaps === 0 ? T.batteryGreen : phrase(T.batteryRed, { n: b.gaps })}
                  </Chip>
                  {/* La phrase annonce les trois chiffres, et elle est posée
                      contre eux. Au-dessus du bloc, elle flottait à égale
                      distance du chapeau et du résultat : l'œil ne savait plus
                      à quoi elle appartenait. Arbitrage d'Auteur du 2026-08-08.
                      Conséquence assumée : elle n'apparaît qu'avec les chiffres
                      qu'elle annonce, donc pas dans les états sans chiffres. */}
                  <Text variant="end">{T.states.loadingHelp}</Text>
                  <Grid columns={3} space="wide">
                    <Stack space="detail">
                      <Text variant="menu">{C.measures.fixturesTrapped}</Text>
                      <Text variant="body">{b.trapped}</Text>
                    </Stack>
                    <Stack space="detail">
                      <Text variant="menu">{C.measures.fixturesCompliant}</Text>
                      <Text variant="body">{b.compliant}</Text>
                    </Stack>
                    <Stack space="detail">
                      <Text variant="menu">{C.measures.mutations}</Text>
                      <Text variant="body">
                        {b.mutations === null
                          ? C.measures.missing
                          : `${String(b.mutations.detected)}/${String(b.mutations.total)}`}
                      </Text>
                    </Stack>
                  </Grid>
                </Stack>
            )}
          />
        </Stack>
      </Section>

      {/* ── ce que le résultat vaut : l'intégrité du juge ─────────────────── */}
      <Section density="compact" door>
        <Stack space="wide">
          <StateAsync
            request={integrity}
            loading={
              <>
                <Stack space="card">
                  <Skeleton shape="heading" />
                  <Skeleton shape="lines" lines={1} />
                </Stack>
                <Skeleton shape="tokens" lines={1} />
              </>
            }
            error={
              <>
                <Stack space="card">
                  <Heading level={2}>{T.integrityHeading}</Heading>
                  <Text variant="end">{T.integrityHelp}</Text>
                </Stack>
                <Alert heading={T.states.errorHeading} announces="alert">
                  <Stack space="card">
                    <Text variant="end">
                      {phrase(T.states.errorBody, { reason: integrity.error ?? '' })}
                    </Text>
                    <Text variant="end">{T.states.errorHelp}</Text>
                  </Stack>
                </Alert>
              </>
            }
            empty={
              <>
                <Stack space="card">
                  <Heading level={2}>{T.integrityHeading}</Heading>
                  <Text variant="end">{T.integrityHelp}</Text>
                </Stack>
                <Empty heading={T.integrityHeading}>
                  <Text variant="end">{T.states.emptyBody}</Text>
                </Empty>
              </>
            }
            children={(i) => (
              <>
                <Stack space="card">
                  <Heading level={2}>{T.integrityHeading}</Heading>
                  <Text variant="end">{T.integrityHelp}</Text>
                </Stack>
                <Stack space="container">
                  <Chip tone="lock">
                    {phrase(T.integrityWhole, { n: i.reaches })}
                  </Chip>
                  <Text variant="end">
                    {C.measures.assertions} : {i.reaches}/{i.total}
                  </Text>
                </Stack>
              </>
            )}
          />
        </Stack>
      </Section>

      {/* ── ce qui rougit, assertion par assertion ────────────────────────── */}
      <Section density="normal">
        <Stack space="wide">
          <StateAsync
            request={findings}
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
                  <Heading level={2}>{T.findingsHeading}</Heading>
                  <Text variant="end">{T.findingsHelp}</Text>
                </Stack>
                <Alert heading={T.states.suspendedHeading} tone="waiting" announces="status">
                  <Text variant="end">{T.states.findingsSuspended}</Text>
                </Alert>
              </>
            }
            empty={
              <>
                <Stack space="card">
                  <Heading level={2}>{T.findingsHeading}</Heading>
                  <Text variant="end">{T.findingsHelp}</Text>
                </Stack>
                <Empty heading={LABELS.screens.finding.states.emptyHeading}>
                  <Text variant="end">
                    {phrase(LABELS.screens.finding.states.emptyBody, { assertion: 'Le corpus' })}
                  </Text>
                </Empty>
              </>
            }
            children={(list) => (
              <>
                <Stack space="card">
                  <Heading level={2}>{T.findingsHeading}</Heading>
                  <Text variant="end">{T.findingsHelp}</Text>
                </Stack>
                <Stack space="wide">
                  {list.map((c) => (
                    <Stack space="card" key={c.id}>
                      <Chip repeats tone="refusal">{c.assertion}</Chip>
                      <Heading level={3}>{c.contract}</Heading>
                      <Text variant="end">
                        {phrase(LABELS.screens.finding.occurrencesCount, {
                          n: c.occurrences,
                          f: c.files,
                        })}
                      </Text>
                    </Stack>
                  ))}
                </Stack>
              </>
            )}
          />
        </Stack>
      </Section>

      {/* ── l'acte ────────────────────────────────────────────────────────── */}
      <Section density="compact" door>
        <Stack space="wide">
          <StateAsync
            request={runs}
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
                  <Heading level={2}>{T.instructionHeading}</Heading>
                  <Text variant="end">{T.instructionHelp}</Text>
                </Stack>
                <Alert heading={T.states.suspendedHeading} tone="waiting" announces="status">
                  <Text variant="end">{T.states.instructionClosed}</Text>
                </Alert>
              </>
            }
            empty={
              <>
                <Stack space="card">
                  <Heading level={2}>{T.instructionHeading}</Heading>
                  <Text variant="end">{T.instructionHelp}</Text>
                </Stack>
                <Stack space="page">
                  <Empty heading={T.states.emptyHeading}>
                    <Text variant="end">{T.states.emptyBody}</Text>
                  </Empty>
                  <Button onPress={launch} disabled={inWaiting}>
                    {inWaiting ? C.actions.recordInCourse : C.actions.recordTheRun}
                  </Button>
                </Stack>
              </>
            }
            children={(list) => (
              <>
                <Stack space="card">
                  <Heading level={2}>{T.instructionHeading}</Heading>
                  <Text variant="end">{T.instructionHelp}</Text>
                </Stack>
                <Stack space="page">
                  {success ? (
                    <Alert heading={T.states.successHeading} tone="lock" announces="status">
                      <Text variant="end">
                        {phrase(T.states.successBody, { date: list[0].date })}
                      </Text>
                    </Alert>
                  ) : (
                    <Stack space="detail">
                      <Text variant="menu">{T.lastRunsHeading}</Text>
                      <Text variant="body">
                        {phrase(T.states.successBody, { date: list[0].date })}
                      </Text>
                    </Stack>
                  )}
                  <Button onPress={launch} disabled={inWaiting}>
                    {inWaiting ? C.actions.recordInCourse : C.actions.recordTheRun}
                  </Button>
                </Stack>
              </>
            )}
          />
        </Stack>
      </Section>
    </main>
  )
}
