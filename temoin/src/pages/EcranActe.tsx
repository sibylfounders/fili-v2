/* É7 · L'acte — parcours P3 · Acter une décision.
 *
 * Ce qui compte d'abord : CE QUE LA DÉCISION FERME. L'écran s'ouvre sur cette
 * seule question, et le récit vient après. L'ordre n'est pas une commodité de
 * formulaire : des conséquences écrites en dernier se rédigent quand la
 * décision est déjà racontée, donc déjà justifiée — on décrit alors le coût
 * d'une chose qu'on a fini de défendre.
 *
 * Fili COMPOSE, il n'écrit pas dans le journal. C'est l'arbitrage d'Auteur, et
 * il a une conséquence heureuse : une entrée passée reste hors de portée du
 * produit, parce que le produit n'a jamais la main dessus.
 *
 * Aucun geste d'édition n'existe ici. Ce n'est pas une omission : c'est la
 * règle 3 du journal rendue mécanique par l'absence du bouton (K2 §10.3).
 */
import { useState } from 'react'
import {
  Section, Titre, Texte, Pile, Jeton, Alerte, Vide, Squelette,
  Button, TextField, Selection, EtatAsync, useRequete, useMutation, LIBELLES, formuler,
} from '../system/index.ts'
import type { Option } from '../system/index.ts'

type Cible = { id: string; groupe: string; nom: string; statut: string }
type Acte = {
  numero: string
  date: string
  verrouVert: boolean
  motifVerrou: string | null
  cibles: Cible[]
}
type Brouillon = { numero: string; date: string; titre: string }

const T = LIBELLES.ecrans.acte
const C = LIBELLES.commun

/* Les quatre statuts que la carte emploie, dans l'ordre où elle les déclare.
   « Verrouillé » est montré même quand il est refusé : un choix retiré de la
   liste laisse croire qu'il n'existe pas, alors qu'il existe et qu'il n'est
   pas ouvert maintenant. */
const STATUTS = (verrouVert: boolean): Option[] => [
  { valeur: '🟢', libelle: C.statuts.verrou, indisponible: !verrouVert },
  { valeur: '🟡', libelle: C.statuts.attente },
  { valeur: '⚪', libelle: C.statuts.idee },
  { valeur: '🔴', libelle: C.statuts.refus },
]

export function EcranActe() {
  const acte = useRequete<Acte>('/acte')
  const brouillons = useRequete<Brouillon[]>('/brouillons')
  const { lancer, enAttente, succes } = useMutation('/brouillons')

  const [consequences, setConsequences] = useState('')
  const [contexte, setContexte] = useState('')
  const [decision, setDecision] = useState('')
  const [sens, setSens] = useState('')
  const [alternatives, setAlternatives] = useState('')
  const [cible, setCible] = useState('')
  const [vers, setVers] = useState('🟡')
  const [manquants, setManquants] = useState<string[]>([])

  const verifier = () => {
    const trous: string[] = []
    if (consequences.trim() === '') trous.push(T.consequencesLabel)
    if (decision.trim() === '') trous.push(T.decisionLabel)
    if (alternatives.trim() === '') trous.push(T.alternativesLabel)
    if (cible === '') trous.push(T.cibleLabel)
    setManquants(trous)
    if (trous.length === 0) lancer()
  }

  return (
    <main>
      {/* ── ample · la tête : ce que la décision ferme, et rien d'autre ──── */}
      <Section tete densite="ample">
        <Pile espace="large">
          <Pile espace="coque">
            <Texte variante="menu">{T.surtitre}</Texte>
            <Titre niveau={1}>{T.titre}</Titre>
            <Texte variante="chapeau">{T.chapeau}</Texte>
          </Pile>
          <EtatAsync
            requete={acte}
            chargement={<Squelette forme="lignes" lignes={3} />}
            erreur={
              <Alerte titre={T.etats.erreurTitre} annonce="alerte">
                <Pile espace="carte">
                  <Texte variante="fin">
                    {formuler(T.etats.erreurCorps, { raison: acte.erreur ?? '' })}
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
            enfants={(a) => (
              <Pile espace="large">
                <Pile espace="detail">
                  <Texte variante="menu">{T.numeroTitre}</Texte>
                  <Jeton ton="idee">
                    {a.numero} · {a.date}
                  </Jeton>
                  <Texte variante="fin">{T.numeroAide}</Texte>
                </Pile>
                <TextField
                  label={T.consequencesLabel}
                  aide={T.consequencesAide}
                  multiligne
                  desactive={enAttente}
                  valeur={consequences}
                  surSaisie={setConsequences}
                />
              </Pile>
            )}
          />
        </Pile>
      </Section>

      {/* ── compact · le reste de l'entrée, dans l'ordre du journal ──────── */}
      <Section densite="compact" porte>
        <Pile espace="large">
          <Pile espace="carte">
            <Titre niveau={2}>{T.resteTitre}</Titre>
            <Texte variante="fin">{T.resteAide}</Texte>
          </Pile>
          <TextField
              label={T.contexteLabel}
              multiligne
              desactive={enAttente}
              valeur={contexte}
              surSaisie={setContexte}
            />
            <TextField
              label={T.decisionLabel}
              desactive={enAttente}
              valeur={decision}
              surSaisie={setDecision}
            />
            <TextField
              label={T.sensLabel}
              multiligne
              desactive={enAttente}
              valeur={sens}
              surSaisie={setSens}
            />
            <TextField
              label={T.alternativesLabel}
              aide={T.alternativesAide}
              multiligne
              desactive={enAttente}
              valeur={alternatives}
              surSaisie={setAlternatives}
            />
        </Pile>
      </Section>

      {/* ── normal · le déplacement de statut, et le verrou qui se mérite ── */}
      <Section densite="normal">
        <Pile espace="large">
          <EtatAsync
            requete={acte}
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
                  <Titre niveau={2}>{T.statutTitre}</Titre>
                  <Texte variante="fin">{T.statutAide}</Texte>
                </Pile>
                <Alerte titre={T.etats.suspenduTitre} ton="attente" annonce="statut">
                  <Texte variante="fin">{T.etats.acteFerme}</Texte>
                </Alerte>
              </>
            }
            vide={
              <>
                <Pile espace="carte">
                  <Titre niveau={2}>{T.statutTitre}</Titre>
                  <Texte variante="fin">{T.statutAide}</Texte>
                </Pile>
                <Vide titre={T.etats.videTitre}>
                  <Texte variante="fin">{T.etats.videCorps}</Texte>
                </Vide>
              </>
            }
            enfants={(a) => (
              <>
                <Pile espace="carte">
                  <Titre niveau={2}>{T.statutTitre}</Titre>
                  <Texte variante="fin">{T.statutAide}</Texte>
                </Pile>
                <Pile espace="large">
                  <Selection
                    label={T.cibleLabel}
                    aide={T.cibleAide}
                    desactive={enAttente}
                    valeur={cible}
                    surChoix={setCible}
                    options={a.cibles.map((c) => ({
                      valeur: c.id,
                      libelle: `${c.statut} ${c.nom}`,
                      groupe: c.groupe,
                    }))}
                  />
                  <Selection
                    label={T.versLabel}
                    desactive={enAttente}
                    valeur={vers}
                    surChoix={setVers}
                    options={STATUTS(a.verrouVert)}
                  />
                  {a.verrouVert ? (
                    <Alerte titre={T.verrouTitre} ton="attente" annonce="statut">
                      <Texte variante="fin">{T.verrouOuvert}</Texte>
                    </Alerte>
                  ) : (
                    <Alerte titre={T.verrouTitre} annonce="alerte">
                      <Texte variante="fin">
                        {formuler(T.verrouFerme, { motif: a.motifVerrou ?? '' })}
                      </Texte>
                    </Alerte>
                  )}
                </Pile>
              </>
            )}
          />
        </Pile>
      </Section>

      {/* ── compact · déposer, et ce qui a déjà été composé ──────────────── */}
      <Section densite="compact" porte>
        <Pile espace="large">
          <EtatAsync
            requete={brouillons}
            chargement={
              <>
                <Pile espace="carte">
                  <Squelette forme="titre" />
                  <Squelette forme="lignes" lignes={1} />
                </Pile>
                <Squelette forme="lignes" lignes={1} />
              </>
            }
            erreur={
              <>
                <Pile espace="carte">
                  <Titre niveau={2}>{T.brouillonsTitre}</Titre>
                  <Texte variante="fin">{T.brouillonsAide}</Texte>
                </Pile>
                <Alerte titre={T.etats.erreurTitre} annonce="alerte">
                  <Pile espace="carte">
                    <Texte variante="fin">
                      {formuler(T.etats.erreurCorps, { raison: brouillons.erreur ?? '' })}
                    </Texte>
                    <Texte variante="fin">{T.etats.erreurAide}</Texte>
                  </Pile>
                </Alerte>
              </>
            }
            vide={
              <>
                <Pile espace="carte">
                  <Titre niveau={2}>{T.brouillonsTitre}</Titre>
                  <Texte variante="fin">{T.brouillonsAide}</Texte>
                </Pile>
                <Pile espace="large">
                  <Vide titre={T.etats.videTitre}>
                    <Texte variante="fin">{T.etats.videCorps}</Texte>
                  </Vide>
                  {manquants.length === 0 ? null : (
                    <Alerte titre={T.etats.erreurTitre} annonce="alerte">
                      <Texte variante="fin">
                        {formuler(T.champsManquants, { champs: manquants.join(' · ') })}
                      </Texte>
                    </Alerte>
                  )}
                  <Button desactive={enAttente} onPress={verifier}>
                    {enAttente ? T.deposerEnCours : T.deposer}
                  </Button>
                  <Texte variante="fin">{T.immuable}</Texte>
                </Pile>
              </>
            }
            enfants={(liste) => (
              <>
                <Pile espace="carte">
                  <Titre niveau={2}>{T.brouillonsTitre}</Titre>
                  <Texte variante="fin">{T.brouillonsAide}</Texte>
                </Pile>
                <Pile espace="large">
                  <Pile espace="carte">
                    <Texte variante="menu">
                      {succes ? T.etats.succesTitre : T.brouillonsTitre}
                    </Texte>
                    <Texte variante="corps">
                      {formuler(T.etats.succesCorps, {
                        numero: liste[0].numero,
                        date: liste[0].date,
                      })}
                    </Texte>
                  </Pile>
                  <Pile espace="page">
                    {liste.map((b) => (
                      <Pile espace="detail" key={b.numero}>
                        <Jeton repete ton="attente">
                          {b.numero} · {b.date}
                        </Jeton>
                        <Texte variante="fin">{b.titre}</Texte>
                      </Pile>
                    ))}
                  </Pile>
                  <Texte variante="fin">{T.immuable}</Texte>
                </Pile>
              </>
            )}
          />
        </Pile>
      </Section>
    </main>
  )
}
