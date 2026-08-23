import {
  Section, Titre, Texte, Pile, Grille, Jeton,
  Alerte, Vide, Squelette, Button, EtatAsync
} from '../design-system/index.ts'
import { useRequete, useMutation } from '../design-system/donnees/useRequete.js'

export function DetailFacture() {
  const relances = useRequete('/relances')
  const { lancer, enAttente, erreur } = useMutation('/relances')

  return (
    <main>
      <Section densite="ample">
        <Pile espace="large">
          <Texte variante="menu">Facturation · Atelier Ravel</Texte>
          <Titre niveau={1}>Facture F-2026-118</Titre>
          <Texte variante="chapeau">
            2 400 € dus depuis le 12 août. Deux relances ont déjà été envoyées.
          </Texte>
        </Pile>
      </Section>

      <Section densite="normal" fond>
        <Pile espace="large">
          <Titre niveau={2}>Le détail</Titre>
          <Grille colonnes={4} espace="large">
            <Pile espace="detail">
              <Jeton ton="neutre">Client</Jeton>
              <Texte variante="fin">Atelier Ravel</Texte>
            </Pile>
            <Pile espace="detail">
              <Jeton ton="neutre">Montant</Jeton>
              <Texte variante="fin">2 400 €</Texte>
            </Pile>
            <Pile espace="detail">
              <Jeton ton="attente">Échéance</Jeton>
              <Texte variante="fin">12 août 2026</Texte>
            </Pile>
            <Pile espace="detail">
              <Jeton ton="attente">Statut</Jeton>
              <Texte variante="fin">En retard de 25 jours</Texte>
            </Pile>
          </Grille>
        </Pile>
      </Section>

      <Section densite="compact">
        <Pile espace="large">
          <Titre niveau={2}>Relances envoyées</Titre>
          <EtatAsync
            requete={relances}
            chargement={<Squelette lignes={2} />}
            erreur={
              <Alerte titre="L'historique n'a pas pu être chargé">
                <Texte variante="fin">Le service ne répond pas. Réessayer.</Texte>
              </Alerte>
            }
            vide={
              <Vide titre="Aucune relance envoyée">
                <Texte variante="fin">Ce client n'a encore rien reçu pour cette facture.</Texte>
              </Vide>
            }
            enfants={(liste) => (
              <Grille colonnes={3} espace="large">
                {liste.map((r) => (
                  <Pile espace="detail" key={r.id}>
                    <Titre niveau={3}>{r.date}</Titre>
                    <Texte variante="fin">{r.canal}</Texte>
                  </Pile>
                ))}
              </Grille>
            )}
          />
        </Pile>
      </Section>

      <Section densite="normal" fond>
        <Pile espace="large">
          <Titre niveau={2}>Agir</Titre>
          <Pile espace="carte">
            <Button onPress={lancer}>{enAttente ? 'Envoi de la relance…' : 'Relancer maintenant'}</Button>
            {erreur ? <Texte variante="fin">La relance n'est pas partie. Réessayer.</Texte> : null}
          </Pile>
        </Pile>
      </Section>
    </main>
  )
}
