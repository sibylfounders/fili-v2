/* Le titre est bien passé dans le conteneur, mais le chargement lui-même parle :
   une pastille écrite en vrai texte, à côté du gris. R2.7 doit rougir — sauf
   déclaration d'intention avec motif, que cet écran ne porte pas. */
import { Section, Titre, Texte, Pile, Jeton, Alerte, Vide, Squelette, EtatAsync } from '../design-system/index.ts'
import { useRequete } from '../design-system/donnees/useRequete.js'

export function PageKOS211() {
  const relances = useRequete('/relances')
  return (
    <main>
      <Section densite="ample" tete>
        <Pile espace="coque">
          <Texte variante="menu">Facturation</Texte>
          <Titre niveau={1}>Suivi des relances</Titre>
          <Texte variante="chapeau">Ce qui est parti, et à qui.</Texte>
        </Pile>
      </Section>

      <Section densite="compact" fond>
        <EtatAsync
          requete={relances}
          chargement={
            <Pile espace="coque">
              <Jeton ton="attente">Chargement en cours</Jeton>
              <Squelette forme="lignes" lignes={3} />
            </Pile>
          }
          erreur={<Alerte titre="Le service ne répond pas"><Texte variante="fin">Réessayer.</Texte></Alerte>}
          vide={<Vide titre="Aucune relance"><Texte variante="fin">Rien n'est encore parti.</Texte></Vide>}
          enfants={(liste) => (
            <Pile espace="large">
              <Pile espace="carte">
                <Titre niveau={2}>Les envois</Titre>
                <Texte variante="fin">Une ligne par relance partie.</Texte>
              </Pile>
              <Texte variante="corps">{liste.length} relances</Texte>
            </Pile>
          )}
        />
      </Section>
    </main>
  )
}
