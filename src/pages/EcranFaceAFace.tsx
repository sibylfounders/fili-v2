/* É4 · Le face-à-face — parcours P2 · Juger un témoin.
 *
 * Ce qui compte d'abord : L'IMAGE, pleine largeur. Tout le reste après. Un
 * écran de jugement qui met la métadonnée avant l'image fait juger la
 * métadonnée — K2 §5. Le titre reste présent parce qu'une page sans titre de
 * premier niveau n'est pas navigable ; la métadonnée, elle, est reléguée à la
 * section suivante. C'est une promesse de composition, et c'est l'œil qui la
 * tranche au point de passage B-1.
 *
 * La comparaison se fait PAR BASCULE, au même endroit : le précédent remplace
 * le courant dans le même cadre. Côte à côte, chaque rendu perdrait la moitié
 * de la largeur et l'on jugerait deux vignettes ; en bascule, l'œil compare de
 * mémoire immédiate, et c'est ce qui révèle les écarts de rythme.
 *
 * L'erreur n'affiche AUCUNE image de secours (K2 §6) : juger une capture au
 * lieu du rendu vérifié annulerait le sens du témoin (#016).
 *
 * Le verdict est binaire. Un refus exige un motif écrit : un refus qu'on ne
 * peut pas relire ne vaut pas mieux qu'une hésitation.
 */
import { useState } from 'react'
import {
  Section, Titre, Texte, Pile, Grille, Jeton, Alerte, Vide, Squelette,
  Button, TextField, Rendu, EtatAsync, useRequete, useMutation, LIBELLES, formuler,
} from '../system/index.ts'

type Generation = { date: string; source: string; etats: number }
type FaceAFace = {
  gabarit: string
  nom: string
  courant: Generation
  precedent: Generation | null
  batterie: string
}
type Verdict = { date: string; issue: string }

const T = LIBELLES.ecrans.faceAFace
const C = LIBELLES.commun

export function EcranFaceAFace() {
  const face = useRequete<FaceAFace>('/faceAFace')
  const verdicts = useRequete<Verdict[]>('/verdicts')
  const { lancer, enAttente, succes } = useMutation('/verdicts')
  const [surPrecedent, setSurPrecedent] = useState(false)
  const [motif, setMotif] = useState('')
  const [motifManquant, setMotifManquant] = useState(false)

  return (
    <main>
      {/* ── ample · la tête : l'image, pleine largeur ────────────────────── */}
      <Section tete densite="ample">
        <Pile espace="large">
          <Pile espace="carte">
            <Texte variante="menu">{T.surtitre}</Texte>
            <Titre niveau={1}>{T.titre}</Titre>
          </Pile>
          <EtatAsync
            requete={face}
            chargement={<Squelette forme="bloc" lignes={1} />}
            erreur={
              <Alerte titre={T.etats.erreurTitre} annonce="alerte">
                <Pile espace="carte">
                  <Texte variante="fin">
                    {formuler(T.etats.erreurCorps, { raison: face.erreur ?? '' })}
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
            enfants={(f) => {
              const montre = surPrecedent && f.precedent !== null ? f.precedent : f.courant
              const enPrecedent = surPrecedent && f.precedent !== null
              return (
                <Pile espace="large">
                  <Rendu
                    source={montre.source}
                    titre={formuler(T.cadreTitre, { gabarit: f.nom, date: montre.date })}
                    hauteur="pleine"
                  />
                  <Pile espace="detail">
                    <Jeton ton={enPrecedent ? 'idee' : 'attente'}>
                      {formuler(
                        enPrecedent ? T.bascule.marquePrecedent : T.bascule.marqueCourant,
                        { date: montre.date },
                      )}
                    </Jeton>
                    {f.precedent === null ? (
                      <Texte variante="fin">{T.etats.videCorps}</Texte>
                    ) : (
                      <Button
                        variante="discret"
                        onPress={() => {
                          setSurPrecedent(!surPrecedent)
                        }}
                      >
                        {enPrecedent ? T.bascule.versCourant : T.bascule.versPrecedent}
                      </Button>
                    )}
                  </Pile>
                </Pile>
              )
            }}
          />
        </Pile>
      </Section>

      {/* ── compact · la métadonnée, et pas avant ─────────────────────────── */}
      <Section densite="compact" fond>
        <Pile espace="large">
          <EtatAsync
            requete={face}
            chargement={
              <>
                <Squelette forme="titre" />
                <Squelette forme="lignes" lignes={2} />
              </>
            }
            erreur={
              <>
                <Titre niveau={2}>{T.metaTitre}</Titre>
                <Alerte titre={T.etats.suspenduTitre} ton="attente" annonce="statut">
                  <Texte variante="fin">{T.etats.erreurAide}</Texte>
                </Alerte>
              </>
            }
            vide={
              <>
                <Titre niveau={2}>{T.metaTitre}</Titre>
                <Vide titre={T.etats.videTitre}>
                  <Texte variante="fin">{T.etats.videCorps}</Texte>
                </Vide>
              </>
            }
            enfants={(f) => (
              <>
                <Titre niveau={2}>{T.metaTitre}</Titre>
                <Grille colonnes={4} espace="large">
                  <Pile espace="detail">
                    <Texte variante="menu">{T.metaGabarit}</Texte>
                    <Texte variante="corps">{f.nom}</Texte>
                  </Pile>
                  <Pile espace="detail">
                    <Texte variante="menu">{T.metaDate}</Texte>
                    <Texte variante="corps">{f.courant.date}</Texte>
                  </Pile>
                  <Pile espace="detail">
                    <Texte variante="menu">{T.metaEtats}</Texte>
                    <Texte variante="corps">{f.courant.etats}</Texte>
                  </Pile>
                  <Pile espace="detail">
                    <Texte variante="menu">{T.metaBatterie}</Texte>
                    <Texte variante="corps">{f.batterie}</Texte>
                  </Pile>
                </Grille>
              </>
            )}
          />
        </Pile>
      </Section>

      {/* ── normal · l'acte : accepter, ou refuser avec motif ─────────────── */}
      <Section densite="normal">
        <Pile espace="large">
          <EtatAsync
            requete={verdicts}
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
                  <Titre niveau={2}>{T.acteTitre}</Titre>
                  <Texte variante="fin">{T.acteAide}</Texte>
                </Pile>
                <Alerte titre={T.etats.suspenduTitre} ton="attente" annonce="statut">
                  <Texte variante="fin">{T.etats.acteFerme}</Texte>
                </Alerte>
              </>
            }
            vide={
              <>
                <Pile espace="carte">
                  <Titre niveau={2}>{T.acteTitre}</Titre>
                  <Texte variante="fin">{T.acteAide}</Texte>
                </Pile>
                <Pile espace="large">
                  <TextField
                    label={T.motifLabel}
                    aide={motifManquant ? T.motifVide : T.motifAide}
                    invalide={motifManquant}
                    multiligne
                    valeur={motif}
                    surSaisie={(v) => {
                      setMotif(v)
                      setMotifManquant(false)
                    }}
                  />
                  <Pile espace="carte">
                    <Button desactive={enAttente} onPress={lancer}>
                      {enAttente ? T.accepterEnCours : T.accepter}
                    </Button>
                    <Button
                      variante="discret"
                      desactive={enAttente}
                      onPress={() => {
                        if (motif.trim() === '') setMotifManquant(true)
                        else lancer()
                      }}
                    >
                      {enAttente ? T.refuserEnCours : T.refuser}
                    </Button>
                  </Pile>
                </Pile>
              </>
            }
            enfants={(liste) => (
              <>
                <Pile espace="carte">
                  <Titre niveau={2}>{T.acteTitre}</Titre>
                  <Texte variante="fin">{T.acteAide}</Texte>
                </Pile>
                <Pile espace="page">
                  <Pile espace="detail">
                    <Texte variante="menu">
                      {succes ? T.etats.succesTitre : C.statuts.accepte}
                    </Texte>
                    <Texte variante="corps">
                      {formuler(T.etats.succesCorps, { date: liste[0].date })}
                    </Texte>
                  </Pile>
                  <Jeton ton={liste[0].issue === 'refus' ? 'refus' : 'verrou'}>
                    {liste[0].issue === 'refus' ? C.statuts.refuse : C.statuts.accepte}
                  </Jeton>
                </Pile>
              </>
            )}
          />
        </Pile>
      </Section>
    </main>
  )
}
