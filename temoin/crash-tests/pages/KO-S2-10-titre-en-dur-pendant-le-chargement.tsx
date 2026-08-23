/* Le défaut de la séance du 2026-08-07, isolé : la section attend ses données,
   et son titre — avec la phrase posée sous lui — reste écrit à côté du gris.
   L'écran se lit à moitié. R2.7 doit rougir. */
import { Section, Titre, Texte, Pile, Alerte, Vide, Squelette, EtatAsync } from '../design-system/index.ts'
import { useRequete } from '../design-system/donnees/useRequete.js'

export function PageKOS210() {
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
        <Pile espace="large">
          <Pile espace="carte">
            <Titre niveau={2}>Les envois</Titre>
            <Texte variante="fin">Une ligne par relance partie.</Texte>
          </Pile>
          <EtatAsync
            requete={relances}
            chargement={<Squelette forme="lignes" lignes={3} />}
            erreur={<Alerte titre="Le service ne répond pas"><Texte variante="fin">Réessayer.</Texte></Alerte>}
            vide={<Vide titre="Aucune relance"><Texte variante="fin">Rien n'est encore parti.</Texte></Vide>}
            enfants={(liste) => <Texte variante="corps">{liste.length} relances</Texte>}
          />
        </Pile>
      </Section>
    </main>
  )
}
