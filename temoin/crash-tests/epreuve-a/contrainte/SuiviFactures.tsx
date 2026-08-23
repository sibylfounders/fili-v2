import {
  Section, Titre, Texte, Pile, Grille, Jeton,
  Alerte, Vide, Squelette, Button, TextField, EtatAsync
} from '../../design-system/index.ts'
import { useRequete, useMutation } from '../../design-system/donnees/useRequete.js'

export function SuiviFactures() {
  const factures = useRequete('/factures')
  const { lancer, enAttente, erreur } = useMutation('/relances')

  return (
    <main>
      <Section densite="ample">
        <Pile espace="large">
          <Texte variante="menu">Facturation</Texte>
          <Titre niveau={1}>Suivi des factures</Titre>
          <Texte variante="chapeau">
            Les factures en cours, leur échéance et leur statut. Relancer un client
            envoie un rappel et vous dit ce qu'il est devenu.
          </Texte>
        </Pile>
      </Section>

      <Section densite="compact" fond>
        <Pile espace="large">
          <Titre niveau={2}>Filtrer</Titre>
          <Grille colonnes={2} espace="large">
            <Pile espace="carte">
              <TextField id="client" label="Rechercher un client" />
            </Pile>
            <Pile espace="carte">
              <TextField id="statut" label="Statut" />
            </Pile>
          </Grille>
        </Pile>
      </Section>

      <Section densite="normal">
        <Pile espace="large">
          <Titre niveau={2}>Les factures</Titre>
          <EtatAsync
            requete={factures}
            chargement={<Squelette lignes={4} />}
            erreur={
              <Alerte titre="Les factures n'ont pas pu être chargées">
                <Texte variante="fin">
                  Le service de facturation ne répond pas. Aucune relance n'a été
                  envoyée. Réessayer, ou revenir plus tard.
                </Texte>
              </Alerte>
            }
            vide={
              <Vide titre="Aucune facture en cours">
                <Texte variante="fin">
                  Rien n'est en attente de paiement. Les factures réglées
                  n'apparaissent pas ici.
                </Texte>
              </Vide>
            }
            enfants={(liste) => (
              <Grille colonnes={3} espace="large">
                {liste.map((facture) => (
                  <Pile espace="detail" key={facture.id}>
                    <Titre niveau={3}>{facture.client}</Titre>
                    <Texte variante="fin">{facture.montant} · échéance {facture.echeance}</Texte>
                    <Jeton ton="attente">{facture.statut}</Jeton>
                  </Pile>
                ))}
              </Grille>
            )}
          />
        </Pile>
      </Section>

      <Section densite="normal" fond>
        <Pile espace="large">
          <Titre niveau={2}>Relancer</Titre>
          <Pile espace="carte">
            <Button onPress={lancer}>{enAttente ? 'Envoi de la relance…' : 'Relancer le client'}</Button>
            {erreur ? <Texte variante="fin">La relance n'est pas partie. Réessayer.</Texte> : null}
          </Pile>
        </Pile>
      </Section>

      <Section densite="compact">
        <Texte variante="fin">Les relances sont conservées trente jours, puis effacées.</Texte>
      </Section>
    </main>
  )
}
