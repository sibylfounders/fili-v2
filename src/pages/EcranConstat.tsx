/* É2 · Le constat — parcours P1 · Prononcer le verdict.
 *
 * Ce qui compte d'abord : l'assertion et sa raison d'être, PAS la ligne
 * fautive. Un écran qui liste les fichiers d'abord fait croire que le problème
 * est local alors qu'il est doctrinal (K2 §5).
 *
 * Cet écran n'a pas d'acte : il se lit. C'est assumé — le parcours P1 porte
 * son acte sur É1, et un écran qui n'agit pas n'est pas pour autant une
 * surface morte.
 */
import {
  Section, Titre, Texte, Pile, Jeton, Alerte, Vide, Squelette,
  Button, EtatAsync, useRequete, LIBELLES, formuler,
} from '../system/index.ts'

type Assertion = {
  id: string
  contrat: string
  enonce: string
  raison: string
  ruptureLevable: boolean
}
type Occurrence = { id: string; fichier: string; ligne: number }

const T = LIBELLES.ecrans.constat
const C = LIBELLES.commun

export function EcranConstat() {
  const constat = useRequete<Assertion>('/constat')
  const occurrences = useRequete<Occurrence[]>('/occurrences')

  return (
    <main>
      {/* ── ample · la tête : l'assertion et sa raison d'être ─────────────── */}
      <Section tete densite="ample">
        <EtatAsync
          requete={constat}
          chargement={<Squelette forme="lignes" lignes={3} />}
          erreur={
            <Alerte titre={T.etats.erreurTitre} annonce="alerte">
              <Texte variante="fin">
                {formuler(T.etats.erreurCorps, { raison: constat.erreur ?? '' })}
              </Texte>
            </Alerte>
          }
          vide={
            <Vide titre={T.etats.videTitre}>
              <Texte variante="fin">
                {formuler(T.etats.videCorps, { assertion: 'Cette assertion' })}
              </Texte>
            </Vide>
          }
          enfants={(a) => (
            <Pile espace={7}>
              <Pile espace={3}>
                <Texte variante="menu">{T.surtitre}</Texte>
                <Titre niveau={1}>{formuler(T.titre, { assertion: a.id })}</Titre>
                <Texte variante="chapeau">{a.enonce}</Texte>
              </Pile>
              <Pile espace={2}>
                <Jeton ton="refus">{a.id}</Jeton>
                <Texte variante="fin">{T.raisonAide}</Texte>
              </Pile>
            </Pile>
          )}
        />
      </Section>

      {/* ── compact · d'où elle vient, et ce qu'une rupture ne lève jamais ── */}
      <Section densite="compact" fond>
        <EtatAsync
          requete={constat}
          chargement={<Squelette forme="lignes" lignes={2} />}
          erreur={
            <Alerte titre={T.etats.erreurTitre} ton="attente" annonce="statut">
              <Texte variante="fin">
                {formuler(T.etats.erreurCorps, { raison: constat.erreur ?? '' })}
              </Texte>
            </Alerte>
          }
          vide={
            <Vide titre={T.contratTitre}>
              <Texte variante="fin">
                {formuler(T.etats.videCorps, { assertion: 'Cette assertion' })}
              </Texte>
            </Vide>
          }
          enfants={(a) => (
            <Pile espace={6}>
              <Pile espace={2}>
                <Titre niveau={2}>{T.raisonTitre}</Titre>
                <Texte variante="corps">{a.raison}</Texte>
              </Pile>
              <Pile espace={2}>
                <Titre niveau={3}>{T.contratTitre}</Titre>
                <Texte variante="fin">{a.contrat}</Texte>
              </Pile>
              <Pile espace={2}>
                <Titre niveau={3}>{T.ruptureTitre}</Titre>
                <Texte variante="fin">{T.ruptureCorps}</Texte>
              </Pile>
            </Pile>
          )}
        />
      </Section>

      {/* ── normal · où elle rougit — le fichier n'arrive qu'ici ──────────── */}
      <Section densite="normal">
        <Pile espace={6}>
          <Pile espace={2}>
            <Titre niveau={2}>{T.occurrencesTitre}</Titre>
            <Texte variante="fin">{T.occurrencesAide}</Texte>
          </Pile>
          <EtatAsync
            requete={occurrences}
            chargement={<Squelette forme="lignes" lignes={4} />}
            erreur={
              <Alerte titre={T.etats.suspenduTitre} ton="attente" annonce="statut">
                <Texte variante="fin">{T.etats.occurrencesSuspendues}</Texte>
              </Alerte>
            }
            vide={
              <Vide titre={T.etats.videTitre}>
                <Texte variante="fin">
                  {formuler(T.etats.videCorps, { assertion: 'Cette assertion' })}
                </Texte>
              </Vide>
            }
            enfants={(liste) => (
              <Pile espace={6}>
                {liste.map((o) => (
                  <Pile espace={2} key={o.id}>
                    <Texte variante="corps">
                      {formuler(T.occurrenceFichier, { fichier: o.fichier, ligne: o.ligne })}
                    </Texte>
                  </Pile>
                ))}
              </Pile>
            )}
          />
        </Pile>
      </Section>

      {/* ── compact · le retour ──────────────────────────────────────────── */}
      <Section densite="compact" fond>
        <Pile espace={4}>
          <Titre niveau={2}>{C.actions.revenirAuVerdict}</Titre>
          <Button variante="discret">{C.actions.revenirAuVerdict}</Button>
        </Pile>
      </Section>
    </main>
  )
}
