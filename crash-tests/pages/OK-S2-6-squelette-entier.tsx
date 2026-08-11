/* Le même écran, tenu. La section qui attend attend en entier : son titre et sa
   phrase deviennent gris avec le reste, et rien ne parle pendant le chargement.
   Le haut de page reste écrit : il n'attend rien. R2.7 doit passer. */
import { Section, Titre, Texte, Pile, Alerte, Vide, Squelette, EtatAsync } from '../design-system/index.ts'
import { useRequete } from '../design-system/donnees/useRequete.js'

export function PageOKS26() {
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
            <Pile espace="large">
              <Pile espace="carte">
                <Squelette forme="titre" />
                <Squelette forme="lignes" lignes={1} />
              </Pile>
              <Squelette forme="lignes" lignes={3} />
            </Pile>
          }
          erreur={
            <Pile espace="large">
              <Pile espace="carte">
                <Titre niveau={2}>Les envois</Titre>
                <Texte variante="fin">Une ligne par relance partie.</Texte>
              </Pile>
              <Alerte titre="Le service ne répond pas"><Texte variante="fin">Réessayer.</Texte></Alerte>
            </Pile>
          }
          vide={
            <Pile espace="large">
              <Pile espace="carte">
                <Titre niveau={2}>Les envois</Titre>
                <Texte variante="fin">Une ligne par relance partie.</Texte>
              </Pile>
              <Vide titre="Aucune relance"><Texte variante="fin">Rien n'est encore parti.</Texte></Vide>
            </Pile>
          }
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
