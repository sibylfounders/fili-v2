import {
  Section, Titre, Texte, Pile, Grille, Jeton,
  Alerte, Vide, Squelette, TextField, EtatAsync
} from '../design-system/index.ts'
import { useRequete } from '../design-system/donnees/useRequete.js'

export function HistoriqueRelances() {
  const relances = useRequete('/relances')

  return (
    <main>
      <Section densite="ample">
        <Pile espace={5}>
          <Texte variante="menu">Facturation</Texte>
          <Titre niveau={1}>Historique des relances</Titre>
          <Texte variante="chapeau">
            Tout ce qui est parti, à qui, et par quel canal. Conservé trente jours.
          </Texte>
        </Pile>
      </Section>

      <Section densite="compact" fond>
        <Pile espace={5}>
          <Titre niveau={2}>Filtrer</Titre>
          <Grille colonnes={2} espace={6}>
            <Pile espace={2}>
              <TextField id="periode" label="Période" />
            </Pile>
            <Pile espace={2}>
              <TextField id="canal" label="Canal" />
            </Pile>
          </Grille>
        </Pile>
      </Section>

      <Section densite="compact">
        <Pile espace={5}>
          <Titre niveau={2}>Les envois</Titre>
          <EtatAsync
            requete={relances}
            chargement={<Squelette lignes={3} />}
            erreur={
              <Alerte titre="L'historique est indisponible">
                <Texte variante="fin">Le service ne répond pas. Aucune relance n'a été perdue. Réessayer.</Texte>
              </Alerte>
            }
            vide={
              <Vide titre="Aucun envoi sur la période">
                <Texte variante="fin">Élargissez la période, ou réinitialisez le filtre.</Texte>
              </Vide>
            }
            enfants={(liste) => (
              <Grille colonnes={3} espace={5}>
                {liste.map((r) => (
                  <Pile espace={1} key={r.id}>
                    <Titre niveau={3}>{r.client}</Titre>
                    <Texte variante="fin">{r.date}</Texte>
                    <Jeton ton="verrou">{r.canal}</Jeton>
                  </Pile>
                ))}
              </Grille>
            )}
          />
        </Pile>
      </Section>

      <Section densite="normal" fond>
        <Pile espace={4}>
          <Titre niveau={2}>Ce que dit la loi</Titre>
          <Texte variante="fin">
            Les relances sont conservées trente jours puis effacées. Aucune donnée
            de paiement n'y figure.
          </Texte>
        </Pile>
      </Section>
    </main>
  )
}
