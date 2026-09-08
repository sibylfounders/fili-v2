/**
 * C3 — Écrit avec le plus grand soin, sans accès aux décisions du projet.
 * Ni registre, ni échelle, ni seuils, ni composants : rien d'autre que
 * l'intention de faire du bon travail.
 *
 * Soin apporté volontairement : les quatre états sont traités, la hiérarchie
 * de titres est continue, l'échelle d'espacement est cohérente (base 8),
 * les messages d'erreur sont humains et offrent une porte de sortie,
 * les cibles tactiles font 44 px, le contraste est tenu.
 */
import { Section, Stack, TextField, Button, StateAsync, Skeleton, Alert, Empty } from '../design-system/index.ts'
import { useRequest, useMutation } from '../design-system/data/useRequest.js'

export function PolishedNotInformed() {
  const invoices = useRequest('/factures')
  const { launch, inWaiting, error } = useMutation('/relances')

  return (
    <main className="mx-auto max-w-5xl p-8">
      <Section density="compact">
        <Stack space="container">
          <Stack space="card">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Facturation</p>
            <h1 className="font-semibold tracking-tight text-gray-900">Suivi des factures</h1>
          </Stack>
          <p className="max-w-prose text-base text-gray-600">
            Les factures en cours, leur échéance et leur statut.
          </p>
        </Stack>
      </Section>

      <Section density="normal" aria-labelledby="filters">
        <Stack space="container">
          <h2 id="filters" className="font-semibold text-gray-900">Filtrer</h2>
          <div className="flex flex-wrap gap-4">
            <TextField id="client" label="Client" />
            <TextField id="status" label="Statut" />
          </div>
        </Stack>
      </Section>

      <Section density="compact" aria-labelledby="list">
        <Stack space="page">
          <h2 id="list" className="font-semibold text-gray-900">Les factures</h2>
          <StateAsync
            request={invoices}
            loading={<Skeleton lines={2} />}
            error={
              <Alert heading="Les factures sont indisponibles">
                <p className="text-sm text-red-700">
                  Le service de facturation ne répond pas. Aucune relance n'a été envoyée.
                  Vous pouvez réessayer, ou revenir dans quelques minutes.
                </p>
              </Alert>
            }
            empty={
              <Empty heading="Aucune facture en cours">
                <p className="text-sm text-gray-600">
                  Rien n'est en attente de paiement. Les factures réglées n'apparaissent pas ici.
                </p>
              </Empty>
            }
            children={(data) => (
              <ul className="grid gap-4 sm:grid-cols-3">
                {data.map((f) => (
                  <li key={f.id} className="rounded-lg border border-gray-200 p-5">
                    <Stack space="container">
                      <Stack space="detail">
                        <h3 className="font-semibold text-gray-900">{f.client}</h3>
                        <p className="text-sm text-gray-600">{f.amount} · échéance {f.due}</p>
                      </Stack>
                      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">{f.status}</p>
                    </Stack>
                  </li>
                ))}
              </ul>
            )}
          />
        </Stack>
      </Section>

      <Section density="compact" aria-labelledby="act">
        <Stack space="container">
          <h2 id="act" className="font-semibold text-gray-900">Agir</h2>
          <Stack space="card">
            <Button onPress={launch}>
              {inWaiting ? 'Envoi de la relance…' : 'Relancer le client'}
            </Button>
            {error ? (
              <p role="status" className="text-sm text-red-700">
                La relance n'est pas partie. Réessayer.
              </p>
            ) : null}
          </Stack>
        </Stack>
      </Section>
    </main>
  )
}
