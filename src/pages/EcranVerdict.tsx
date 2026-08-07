/* É1 · Le verdict — parcours P1 · Prononcer le verdict.
 *
 * Ce qui compte d'abord : l'intégrité du juge, AVANT le verdict lui-même.
 * C'est la déclaration de K2 §5, et elle est portée par la marque de tête de
 * la première section. Ce que cette déclaration promet, c'est au rendu de
 * l'honorer — et c'est l'œil de l'Auteur qui le tranche, au point de passage
 * B-2. Le fichier ne peut pas se l'accorder à lui-même.
 *
 * Le refus de statuer n'est pas une panne : c'est un verdict à part entière,
 * annoncé comme une alerte (K2 §7.2). Et il ferme l'acte : on ne consigne pas
 * un verdict qu'on n'a pas mérité (#021).
 */
import {
  Section, Titre, Texte, Pile, Grille, Jeton, Alerte, Vide, Squelette,
  Button, EtatAsync, useRequete, useMutation, LIBELLES, formuler,
} from '../system/index.ts'

type Integrite = { total: number; portees: number }
type Mutations = { detectees: number; total: number; date: string }
type Batterie = { piegees: number; conformes: number; mutations: Mutations | null; ecarts: number }
type Progression = { faites: number; total: number }
type Constat = { id: string; assertion: string; contrat: string; occurrences: number; fichiers: number }
type Run = { date: string; verdict: string }

const T = LIBELLES.ecrans.verdict
const C = LIBELLES.commun

export function EcranVerdict() {
  const integrite = useRequete<Integrite>('/integrite')
  const batterie = useRequete<Batterie>('/batterie')
  const progression = useRequete<Progression>('/progression')
  const constats = useRequete<Constat[]>('/constats')
  const runs = useRequete<Run[]>('/runs')
  const { lancer, enAttente, succes } = useMutation('/runs')

  return (
    <main>
      {/* ── ample · la tête : l'intégrité du juge, avant le verdict ──────── */}
      <Section tete densite="ample">
        <Pile espace={7}>
          <Pile espace={3}>
            <Texte variante="menu">{T.surtitre}</Texte>
            <Titre niveau={1}>{T.titre}</Titre>
            <Texte variante="chapeau">{T.chapeau}</Texte>
          </Pile>
          <EtatAsync
            requete={integrite}
            chargement={<Squelette forme="jetons" lignes={1} />}
            erreur={
              <Alerte titre={T.etats.erreurTitre} annonce="alerte">
                <Pile espace={2}>
                  <Texte variante="fin">
                    {formuler(T.etats.erreurCorps, { raison: integrite.erreur ?? '' })}
                  </Texte>
                  <Texte variante="fin">{T.etats.erreurAide}</Texte>
                </Pile>
              </Alerte>
            }
            vide={
              <Vide titre={T.integriteTitre}>
                <Texte variante="fin">{T.etats.videCorps}</Texte>
              </Vide>
            }
            enfants={(i) => (
              <Pile espace={3}>
                <Jeton ton="verrou">
                  {formuler(T.integriteEntier, { n: i.portees })}
                </Jeton>
                <Texte variante="fin">
                  {C.mesures.assertions} : {i.portees}/{i.total}
                </Texte>
              </Pile>
            )}
          />
        </Pile>
      </Section>

      {/* ── compact · le verdict lui-même ────────────────────────────────── */}
      <Section densite="compact" fond>
        <Pile espace={6}>
          <Pile espace={2}>
            <Titre niveau={2}>{T.batterieTitre}</Titre>
            <Texte variante="fin">{T.etats.chargementAide}</Texte>
          </Pile>
          <EtatAsync
            requete={batterie}
            chargement={
              <EtatAsync
                requete={progression}
                chargement={<Squelette forme="lignes" lignes={2} />}
                erreur={
                  <Alerte titre={T.etats.erreurTitre} ton="attente" annonce="statut">
                    <Texte variante="fin">{T.etats.erreurAide}</Texte>
                  </Alerte>
                }
                vide={
                  <Vide titre={T.batterieTitre}>
                    <Texte variante="fin">{T.etats.videCorps}</Texte>
                  </Vide>
                }
                enfants={(p) => (
                  <Pile espace={3}>
                    <Jeton ton="attente">
                      {formuler(T.etats.chargement, { faites: p.faites, total: p.total })}
                    </Jeton>
                    <Squelette forme="lignes" lignes={2} />
                  </Pile>
                )}
              />
            }
            erreur={
              <Alerte titre={T.etats.suspenduTitre} ton="attente" annonce="statut">
                <Texte variante="fin">{T.etats.batterieSuspendue}</Texte>
              </Alerte>
            }
            vide={
              <Vide titre={T.batterieTitre}>
                <Texte variante="fin">{T.etats.videCorps}</Texte>
              </Vide>
            }
            enfants={(b) => (
              <Pile espace={5}>
                <Jeton ton={b.ecarts === 0 ? 'verrou' : 'refus'}>
                  {b.ecarts === 0 ? T.batterieVerte : formuler(T.batterieRouge, { n: b.ecarts })}
                </Jeton>
                <Grille colonnes={3} espace={5}>
                  <Pile espace={1}>
                    <Texte variante="menu">{C.mesures.fixturesPiegees}</Texte>
                    <Texte variante="corps">{b.piegees}</Texte>
                  </Pile>
                  <Pile espace={1}>
                    <Texte variante="menu">{C.mesures.fixturesConformes}</Texte>
                    <Texte variante="corps">{b.conformes}</Texte>
                  </Pile>
                  <Pile espace={1}>
                    <Texte variante="menu">{C.mesures.mutations}</Texte>
                    <Texte variante="corps">
                      {b.mutations === null
                        ? C.mesures.absente
                        : `${String(b.mutations.detectees)}/${String(b.mutations.total)}`}
                    </Texte>
                  </Pile>
                </Grille>
              </Pile>
            )}
          />
        </Pile>
      </Section>

      {/* ── normal · ce qui rougit, assertion par assertion ───────────────── */}
      <Section densite="normal">
        <Pile espace={6}>
          <Pile espace={2}>
            <Titre niveau={2}>{T.constatsTitre}</Titre>
            <Texte variante="fin">{T.constatsAide}</Texte>
          </Pile>
          <EtatAsync
            requete={constats}
            chargement={<Squelette forme="lignes" lignes={3} />}
            erreur={
              <Alerte titre={T.etats.suspenduTitre} ton="attente" annonce="statut">
                <Texte variante="fin">{T.etats.constatsSuspendus}</Texte>
              </Alerte>
            }
            vide={
              <Vide titre={LIBELLES.ecrans.constat.etats.videTitre}>
                <Texte variante="fin">
                  {formuler(LIBELLES.ecrans.constat.etats.videCorps, { assertion: 'Le corpus' })}
                </Texte>
              </Vide>
            }
            enfants={(liste) => (
              <Pile espace={6}>
                {liste.map((c) => (
                  <Pile espace={2} key={c.id}>
                    <Jeton ton="refus">{c.assertion}</Jeton>
                    <Titre niveau={3}>{c.contrat}</Titre>
                    <Texte variante="fin">
                      {formuler(LIBELLES.ecrans.constat.occurrencesCompte, {
                        n: c.occurrences,
                        f: c.fichiers,
                      })}
                    </Texte>
                  </Pile>
                ))}
              </Pile>
            )}
          />
        </Pile>
      </Section>

      {/* ── compact · l'acte ──────────────────────────────────────────────── */}
      <Section densite="compact" fond>
        <Pile espace={6}>
          <Pile espace={2}>
            <Titre niveau={2}>{T.consigneTitre}</Titre>
            <Texte variante="fin">{T.consigneAide}</Texte>
          </Pile>
          <EtatAsync
            requete={runs}
            chargement={<Squelette forme="lignes" lignes={1} />}
            erreur={
              <Alerte titre={T.etats.suspenduTitre} ton="attente" annonce="statut">
                <Texte variante="fin">{T.etats.consigneFermee}</Texte>
              </Alerte>
            }
            vide={
              <Pile espace={4}>
                <Vide titre={T.etats.videTitre}>
                  <Texte variante="fin">{T.etats.videCorps}</Texte>
                </Vide>
                <Button onPress={lancer} desactive={enAttente}>
                  {enAttente ? C.actions.consignerEnCours : C.actions.consignerLeRun}
                </Button>
              </Pile>
            }
            enfants={(liste) => (
              <Pile espace={4}>
                <Pile espace={1}>
                  <Texte variante="menu">
                    {succes ? T.etats.succesTitre : T.derniersRunsTitre}
                  </Texte>
                  <Texte variante="corps">
                    {formuler(T.etats.succesCorps, { date: liste[0].date })}
                  </Texte>
                </Pile>
                <Button onPress={lancer} desactive={enAttente}>
                  {enAttente ? C.actions.consignerEnCours : C.actions.consignerLeRun}
                </Button>
              </Pile>
            )}
          />
        </Pile>
      </Section>
    </main>
  )
}
