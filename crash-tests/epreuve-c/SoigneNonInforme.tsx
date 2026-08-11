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
import { Section, Pile, TextField, Button, EtatAsync, Squelette, Alerte, Vide } from '../design-system/index.ts'
import { useRequete, useMutation } from '../design-system/donnees/useRequete.js'

export function SoigneNonInforme() {
  const factures = useRequete('/factures')
  const { lancer, enAttente, erreur } = useMutation('/relances')

  return (
    <main className="mx-auto max-w-5xl p-8">
      <Section densite="compact">
        <Pile espace="coque">
          <Pile espace="carte">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Facturation</p>
            <h1 className="font-semibold tracking-tight text-gray-900">Suivi des factures</h1>
          </Pile>
          <p className="max-w-prose text-base text-gray-600">
            Les factures en cours, leur échéance et leur statut.
          </p>
        </Pile>
      </Section>

      <Section densite="normal" aria-labelledby="filtres">
        <Pile espace="coque">
          <h2 id="filtres" className="font-semibold text-gray-900">Filtrer</h2>
          <div className="flex flex-wrap gap-4">
            <TextField id="client" label="Client" />
            <TextField id="statut" label="Statut" />
          </div>
        </Pile>
      </Section>

      <Section densite="compact" aria-labelledby="liste">
        <Pile espace="page">
          <h2 id="liste" className="font-semibold text-gray-900">Les factures</h2>
          <EtatAsync
            requete={factures}
            chargement={<Squelette lignes={2} />}
            erreur={
              <Alerte titre="Les factures sont indisponibles">
                <p className="text-sm text-red-700">
                  Le service de facturation ne répond pas. Aucune relance n'a été envoyée.
                  Vous pouvez réessayer, ou revenir dans quelques minutes.
                </p>
              </Alerte>
            }
            vide={
              <Vide titre="Aucune facture en cours">
                <p className="text-sm text-gray-600">
                  Rien n'est en attente de paiement. Les factures réglées n'apparaissent pas ici.
                </p>
              </Vide>
            }
            enfants={(donnees) => (
              <ul className="grid gap-4 sm:grid-cols-3">
                {donnees.map((f) => (
                  <li key={f.id} className="rounded-lg border border-gray-200 p-5">
                    <Pile espace="coque">
                      <Pile espace="detail">
                        <h3 className="font-semibold text-gray-900">{f.client}</h3>
                        <p className="text-sm text-gray-600">{f.montant} · échéance {f.echeance}</p>
                      </Pile>
                      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">{f.statut}</p>
                    </Pile>
                  </li>
                ))}
              </ul>
            )}
          />
        </Pile>
      </Section>

      <Section densite="compact" aria-labelledby="agir">
        <Pile espace="coque">
          <h2 id="agir" className="font-semibold text-gray-900">Agir</h2>
          <Pile espace="carte">
            <Button onPress={lancer}>
              {enAttente ? 'Envoi de la relance…' : 'Relancer le client'}
            </Button>
            {erreur ? (
              <p role="status" className="text-sm text-red-700">
                La relance n'est pas partie. Réessayer.
              </p>
            ) : null}
          </Pile>
        </Pile>
      </Section>
    </main>
  )
}
