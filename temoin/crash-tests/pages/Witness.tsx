import {
  Section, Heading, Text, Stack, Grid, Chip, Alert, Empty, Skeleton,
  Button, TextField, StateAsync
} from '../design-system/index.ts'
import { useRequest, useMutation } from '../design-system/data/useRequest.js'

export function Witness() {
  const components = useRequest('/composants')
  const journal = useRequest('/journal')
  const telemetry = useRequest('/telemetrie')
  const audit = useRequest('/audit')
  const { launch, inWaiting, error } = useMutation('/verification')

  return (
    <main>
      {/* ── ample ─────────────────────────────────────────────────────── */}
      <Section head density="ample">
        <Stack space="wide">
          <Text variant="menu">FILI · Écran Témoin · version du 6 août 2026</Text>
          <Heading level={1}>Une décision approuvée une fois devient un invariant vérifiable.</Heading>
          <Text variant="lede">
            Cette page est écrite à la main sous les contrats S1 et S2, et elle passe
            sous le Leviathan. Ce que vous regardez n'est pas une maquette : c'est ce
            que la doctrine autorise, et rien d'autre.
          </Text>
        </Stack>
      </Section>

      {/* ── compact ───────────────────────────────────────────────────── */}
      <Section density="compact" background>
        <Stack space="wide">
          <Heading level={2}>Où en est le système</Heading>
          <Grid columns={4} space="wide">
            <Stack space="detail">
              <Chip tone="lock">S1 · Composants typés</Chip>
              <Text variant="end">Six règles, verrouillé.</Text>
            </Stack>
            <Stack space="detail">
              <Chip tone="lock">S2 · Contrat d'état</Chip>
              <Text variant="end">Six règles, verrouillé.</Text>
            </Stack>
            <Stack space="detail">
              <Chip tone="waiting">S3 · Discipline spatiale</Chip>
              <Text variant="end">Fermé jusqu'à votre verdict sur cette page.</Text>
            </Stack>
            <Stack space="detail">
              <Chip tone="neutral">S4 · Rythme de composition</Chip>
              <Text variant="end">Fermé.</Text>
            </Stack>
          </Grid>
        </Stack>
      </Section>

      {/* ── normal ── R2.7 déclarée : témoin gelé, voir le motif ───────── */}
      <Section
        density="normal"
        data-intent="statement"
        data-intent-reason="écran témoin du MVP, jugé avant R2.7 : il est conservé tel qu'il a été jugé plutôt que retouché — un témoin ne se réécrit pas"
      >
        <Stack space="wide">
          <Stack space="container">
            <Heading level={2}>Les composants du registre</Heading>
            <Text variant="lede">
              Une donnée distante ne s'affiche jamais nue : elle passe par un conteneur
              qui oblige à traiter les quatre cas.
            </Text>
          </Stack>
          <StateAsync
            request={components}
            loading={<Skeleton lines={3} />}
            error={<Alert heading="Le catalogue n'a pas pu être chargé">
              <Text variant="end">Le service de composants ne répond pas. Réessayer, ou continuer sans le catalogue.</Text>
            </Alert>}
            empty={<Empty heading="Aucun composant déclaré">
              <Text variant="end">Le registre est vide : déclarez un premier composant pour commencer.</Text>
            </Empty>}
            children={(list) => (
              <Grid columns={3} space="wide">
                {list.map((c) => (
                  <Stack space="card" key={c.id}>
                    <Heading level={3}>{c.name}</Heading>
                    <Text variant="end">{c.variants}</Text>
                  </Stack>
                ))}
              </Grid>
            )}
          />
          <Grid columns={2} space="wide">
            <Stack space="card">
              <TextField id="search" label="Rechercher un composant" />
              <Button onPress={launch}>{inWaiting ? 'Vérification en cours…' : 'Lancer la vérification'}</Button>
              {error ? <Text variant="end">La vérification a échoué. Réessayer.</Text> : null}
            </Stack>
            <Stack space="card">
              <TextField id="registry" label="Chemin du registre" />
              <Button variant="discret">Ouvrir le registre</Button>
            </Stack>
          </Grid>
        </Stack>
      </Section>

      {/* ── normal ── deux densités identiques à la suite : autorisé, jamais trois */}
      <Section
        density="normal"
        background
        data-intent="statement"
        data-intent-reason="écran témoin du MVP, jugé avant R2.7 : il est conservé tel qu'il a été jugé plutôt que retouché — un témoin ne se réécrit pas ; et son titre couvre trois conteneurs à la fois, il n'appartient à aucun d'eux"
      >
        <Stack space="wide">
          <Stack space="container">
            <Heading level={2}>Ce qu'il se passe quand ça ne va pas</Heading>
            <Text variant="lede">Trois états non nominaux, rendus par le même conteneur.</Text>
          </Stack>
          <Grid columns={3} space="page">
            <StateAsync
              request={telemetry}
              loading={<Skeleton lines={2} />}
              error={<Alert heading="La télémétrie est indisponible">
                <Text variant="end">Le service ne répond pas. Les mesures d'aujourd'hui manqueront au rapport. Réessayer.</Text>
              </Alert>}
              empty={<Empty heading="Aucune mesure"><Text variant="end">Rien à afficher.</Text></Empty>}
              children={(d) => <Text variant="end">{d.length} mesures</Text>}
            />
            <StateAsync
              request={journal}
              loading={<Skeleton lines={2} />}
              error={<Alert heading="Journal indisponible"><Text variant="end">Réessayer.</Text></Alert>}
              empty={<Empty heading="Aucune décision aujourd'hui">
                <Text variant="end">Le journal se remplit à chaque arbitrage. Rien n'a été tranché depuis hier.</Text>
              </Empty>}
              children={(d) => <Text variant="end">{d.length} décisions</Text>}
            />
            <StateAsync
              request={audit}
              loading={<Skeleton lines={2} />}
              error={<Alert heading="Audit indisponible"><Text variant="end">Réessayer.</Text></Alert>}
              empty={<Empty heading="Aucun audit"><Text variant="end">Rien à afficher.</Text></Empty>}
              children={(d) => <Text variant="end">{d.length} constats</Text>}
            />
          </Grid>
        </Stack>
      </Section>

      {/* ── ample ── rupture déclarée ─────────────────────────────────── */}
      <Section
        density="ample"
        data-intent="statement"
        data-intent-reason="page manifeste : le contraste d'échelle fait partie du propos, il n'est pas un accident de mise en page"
      >
        <Stack space="wide">
          <Text variant="menu">Rupture déclarée</Text>
          <p className="display">Ceci n'est pas une erreur. C'est une intention signée.</p>
          <Text variant="end">
            Cette section sort de l'échelle typographique. Elle passe parce qu'elle porte
            son intention et son motif, à l'endroit exact où elle s'exerce. Sans motif
            écrit, elle serait bloquée comme une négligence.
          </Text>
        </Stack>
      </Section>

      {/* ── compact ───────────────────────────────────────────────────── */}
      <Section density="compact" background>
        <Stack space="page">
          <Heading level={2}>Ce que cette page ne prouve pas</Heading>
          <Grid columns={3} space="page">
            <Text variant="end">Qu'elle est belle. Elle prouve que la doctrine ne l'empêche pas de l'être.</Text>
            <Text variant="end">Ce que l'IA en ferait. Elle est écrite à la main sous contrainte : c'est le plafond, pas le comportement d'un modèle.</Text>
            <Text variant="end">Qu'elle est accessible. Le contraste et le clavier tiennent ; l'audit reste à faire.</Text>
          </Grid>
        </Stack>
      </Section>
    </main>
  )
}
