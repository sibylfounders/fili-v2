/* É6 · Le journal — parcours P3 · Acter une décision.
 *
 * Ce qui compte d'abord : LA DERNIÈRE DÉCISION, lisible en entier. Les
 * précédentes sont consultables et ne s'exposent pas — cinquante entrées
 * affichées d'emblée sont exactement l'empilement de donnée brute que le
 * verdict de K1 a nommé.
 *
 * Rien n'est résumé. Une entrée se lit en entier ou pas du tout : un journal
 * résumé par la machine qui l'affiche est un journal réécrit par elle, et la
 * règle 3 — on n'édite jamais une entrée passée — vaut aussi pour celui qui la
 * donne à voir.
 *
 * Le produit n'offre AUCUN geste d'édition. Ce n'est pas une omission : c'est
 * la règle rendue mécanique par l'absence du bouton (K2 §10.3).
 */
import { useState } from 'react'
import {
  Section, Titre, Texte, Pile, Jeton, Alerte, Vide, Squelette,
  Button, Prose, EtatAsync, useRequete, LIBELLES, formuler,
} from '../system/index.ts'

type Entree = {
  numero: string
  titre: string
  date: string
  pastille: string
  statut: string
  corps: string
}

const T = LIBELLES.ecrans.journal

const TON: Record<string, 'verrou' | 'attente' | 'idee' | 'refus'> = {
  '🟢': 'verrou', '🟡': 'attente', '⚪': 'idee', '🔴': 'refus',
}
const ton = (p: string) => TON[p] ?? 'idee'

export function EcranJournal() {
  const journal = useRequete<Entree[]>('/journal')
  const [ouvertes, setOuvertes] = useState<string[]>([])
  const basculer = (n: string) => {
    setOuvertes(ouvertes.includes(n) ? ouvertes.filter((x) => x !== n) : [...ouvertes, n])
  }

  return (
    <main>
      {/* ── ample · la tête : la dernière décision, en entier ─────────────── */}
      <Section tete densite="ample">
        <Pile espace="large">
          <Pile espace="coque">
            <Texte variante="menu">{T.surtitre}</Texte>
            <Titre niveau={1}>{T.titre}</Titre>
            <Texte variante="chapeau">{T.chapeau}</Texte>
          </Pile>
          <EtatAsync
            requete={journal}
            chargement={<Squelette forme="lignes" lignes={4} />}
            erreur={
              <Alerte titre={T.etats.erreurTitre} annonce="alerte">
                <Pile espace="carte">
                  <Texte variante="fin">
                    {formuler(T.etats.erreurCorps, { raison: journal.erreur ?? '' })}
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
              <Pile espace="large">
                <Pile espace="carte">
                  <Texte variante="menu">{T.derniereTitre}</Texte>
                  <Jeton repete ton={ton(liste[0].pastille)}>
                    {liste[0].numero} · {liste[0].date}
                  </Jeton>
                  <Titre niveau={2}>{liste[0].titre}</Titre>
                </Pile>
                <Prose texte={liste[0].corps} />
              </Pile>
            )}
          />
        </Pile>
      </Section>

      {/* ── compact · les précédentes, repliées ──────────────────────────── */}
      <Section densite="compact" porte>
        <Pile espace="large">
          <EtatAsync
            requete={journal}
            chargement={
              <>
                <Pile espace="carte">
                  <Squelette forme="titre" />
                  <Squelette forme="lignes" lignes={1} />
                </Pile>
                <Squelette forme="lignes" lignes={3} />
              </>
            }
            erreur={
              <>
                <Pile espace="carte">
                  <Titre niveau={2}>{T.precedentesTitre}</Titre>
                  <Texte variante="fin">{T.precedentesAide}</Texte>
                </Pile>
                <Alerte titre={T.etats.suspenduTitre} ton="attente" annonce="statut">
                  <Texte variante="fin">{T.etats.precedentesSuspendues}</Texte>
                </Alerte>
              </>
            }
            vide={
              <>
                <Pile espace="carte">
                  <Titre niveau={2}>{T.precedentesTitre}</Titre>
                  <Texte variante="fin">{T.precedentesAide}</Texte>
                </Pile>
                <Vide titre={T.etats.videTitre}>
                  <Texte variante="fin">{T.etats.videCorps}</Texte>
                </Vide>
              </>
            }
            enfants={(liste) => (
              <>
                <Pile espace="carte">
                  <Titre niveau={2}>{T.precedentesTitre}</Titre>
                  <Texte variante="fin">{T.precedentesAide}</Texte>
                </Pile>
                {liste.length < 2 ? (
                  <Vide titre={T.etats.videTitre}>
                    <Texte variante="fin">{T.etats.videCorps}</Texte>
                  </Vide>
                ) : (
                  <Pile espace="large">
                    {liste.slice(1).map((e) => (
                      <Pile espace="carte" key={e.numero}>
                        <Jeton repete ton={ton(e.pastille)}>
                          {e.numero} · {e.date}
                        </Jeton>
                        <Titre niveau={3}>{e.titre}</Titre>
                        <Button
                          variante="discret"
                          onPress={() => {
                            basculer(e.numero)
                          }}
                        >
                          {ouvertes.includes(e.numero) ? T.replier : T.deplier}
                        </Button>
                        {ouvertes.includes(e.numero) ? <Prose texte={e.corps} /> : null}
                      </Pile>
                    ))}
                  </Pile>
                )}
              </>
            )}
          />
        </Pile>
      </Section>

      {/* ── normal · ce que le journal a perdu, et qui reste écrit ────────── */}
      <Section densite="normal">
        <Pile espace="large">
          <EtatAsync
            requete={journal}
            chargement={<Squelette forme="lignes" lignes={1} />}
            erreur={
              <Alerte titre={T.etats.suspenduTitre} ton="attente" annonce="statut">
                <Texte variante="fin">{T.etats.erreurAide}</Texte>
              </Alerte>
            }
            vide={
              <Vide titre={T.etats.videTitre}>
                <Texte variante="fin">{T.etats.videCorps}</Texte>
              </Vide>
            }
            enfants={(liste) => (
              <Pile espace="carte">
                <Texte variante="menu">{formuler(T.compte, { n: liste.length })}</Texte>
                <Texte variante="corps">{T.trou}</Texte>
              </Pile>
            )}
          />
        </Pile>
      </Section>
    </main>
  )
}
