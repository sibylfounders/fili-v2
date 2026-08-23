/* É3 · La famille des témoins — parcours P2 · Juger un témoin.
 *
 * Ce qui compte d'abord : LE TÉMOIN COURANT de chaque gabarit. L'historique se
 * déplie ; il ne s'expose pas. Un écran qui déroule toutes les générations fait
 * chercher le présent dans le passé — c'est la même faute que K1 a nommée sur
 * l'empilement de donnée brute.
 *
 * Le témoin est montré RENDU, en vignette, depuis le fichier que la chaîne a
 * produit à partir de la source vérifiée (#016). Aucune capture, aucune
 * miniature dessinée : ce qu'on voit est ce qui sera jugé.
 *
 * Un témoin illisible est SIGNALÉ, et les autres restent lisibles (K2 §6). Le
 * masquer donnerait une famille complète en apparence, avec un trou muet.
 */
import {
  Section, Titre, Texte, Pile, Grille, Jeton, Alerte, Vide, Squelette,
  Button, Rendu, EtatAsync, useRequete, LIBELLES, formuler,
} from '../system/index.ts'

type Generation = { date: string; etats: number; illisible: boolean }
type Famille = {
  gabarit: string
  nom: string
  courant: Generation | null
  apercu: string | null
  historique: Generation[]
}

const T = LIBELLES.ecrans.famille
const C = LIBELLES.commun

export function EcranFamille() {
  const familles = useRequete<Famille[]>('/temoins')

  return (
    <main>
      {/* ── ample · la tête : les témoins courants, rien d'autre ─────────── */}
      <Section tete densite="ample">
        <Pile espace="large">
          <Pile espace="coque">
            <Texte variante="menu">{T.surtitre}</Texte>
            <Titre niveau={1}>{T.titre}</Titre>
            <Texte variante="chapeau">{T.chapeau}</Texte>
          </Pile>
          <EtatAsync
            requete={familles}
            chargement={<Squelette forme="bloc" lignes={1} />}
            erreur={
              <Alerte titre={T.etats.erreurTitre} annonce="alerte">
                <Pile espace="carte">
                  <Texte variante="fin">
                    {formuler(T.etats.erreurCorps, { raison: familles.erreur ?? '' })}
                  </Texte>
                  <Texte variante="fin">{T.etats.erreurAide}</Texte>
                </Pile>
              </Alerte>
            }
            vide={
              <Vide titre={T.etats.videTitre}>
                <Texte variante="fin">{T.etats.videCorps}</Texte>
              </Vide>
            }
            enfants={(liste) => (
              <Grille colonnes={2} espace="large">
                {liste.map((f) => (
                  <Pile espace="page" key={f.gabarit}>
                    <Pile espace="detail">
                      <Texte variante="menu">{f.gabarit}</Texte>
                      <Titre niveau={2}>{f.nom}</Titre>
                    </Pile>
                    {f.courant === null ? (
                      <Vide titre={T.etats.videTitre}>
                        <Texte variante="fin">{T.etats.videCorps}</Texte>
                      </Vide>
                    ) : f.courant.illisible || f.apercu === null ? (
                      <Alerte titre={T.etats.suspenduTitre} ton="attente" annonce="statut">
                        <Texte variante="fin">{T.illisible}</Texte>
                      </Alerte>
                    ) : (
                      <Rendu source={f.apercu} titre={f.nom} hauteur="vignette" />
                    )}
                    {f.courant === null ? null : (
                      <Pile espace="detail">
                        <Jeton repete ton="idee">{f.courant.date}</Jeton>
                        <Texte variante="fin">
                          {formuler(T.etatsCompte, { n: f.courant.etats })}
                        </Texte>
                      </Pile>
                    )}
                    <Button
                      desactive={f.courant === null || f.courant.illisible}
                      onPress={() => {
                        window.location.hash = `#jugement/${f.gabarit}`
                      }}
                    >
                      {C.actions.jugerLeTemoin}
                    </Button>
                  </Pile>
                ))}
              </Grille>
            )}
          />
        </Pile>
      </Section>

      {/* ── compact · l'historique, qui se déplie et ne s'expose pas ─────── */}
      <Section densite="compact" porte>
        <Pile espace="large">
          <EtatAsync
            requete={familles}
            chargement={
              <>
                <Pile espace="carte">
                  <Squelette forme="titre" />
                  <Squelette forme="lignes" lignes={1} />
                </Pile>
                <Squelette forme="lignes" lignes={2} />
              </>
            }
            erreur={
              <>
                <Pile espace="carte">
                  <Titre niveau={2}>{T.historiqueTitre}</Titre>
                  <Texte variante="fin">{T.historiqueAide}</Texte>
                </Pile>
                <Alerte titre={T.etats.suspenduTitre} ton="attente" annonce="statut">
                  <Texte variante="fin">{T.etats.historiqueSuspendu}</Texte>
                </Alerte>
              </>
            }
            vide={
              <>
                <Pile espace="carte">
                  <Titre niveau={2}>{T.historiqueTitre}</Titre>
                  <Texte variante="fin">{T.historiqueAide}</Texte>
                </Pile>
                <Vide titre={T.etats.videTitre}>
                  <Texte variante="fin">{T.etats.videCorps}</Texte>
                </Vide>
              </>
            }
            enfants={(liste) => (
              <>
                <Pile espace="carte">
                  <Titre niveau={2}>{T.historiqueTitre}</Titre>
                  <Texte variante="fin">{T.historiqueAide}</Texte>
                </Pile>
                <Pile espace="large">
                  {liste.map((f) => (
                    <Pile espace="carte" key={f.gabarit}>
                      <Titre niveau={3}>{f.nom}</Titre>
                      {f.historique.length === 0 ? (
                        <Texte variante="fin">{T.etats.videCorps}</Texte>
                      ) : (
                        <Pile espace="detail">
                          {f.historique.map((g) => (
                            <Texte variante="fin" key={g.date}>
                              {g.date} — {formuler(T.etatsCompte, { n: g.etats })}
                            </Texte>
                          ))}
                        </Pile>
                      )}
                    </Pile>
                  ))}
                </Pile>
              </>
            )}
          />
        </Pile>
      </Section>
    </main>
  )
}
