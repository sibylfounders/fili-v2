/* É1 · Le verdict — parcours P1 · Prononcer le verdict.
 *
 * Ce qui compte d'abord : LE RÉSULTAT DE LA BATTERIE. Ce que le poste de
 * travail doit dire en premier n'est pas ce qui a été fait, mais si le dépôt
 * tient et dans quelles proportions. C'est l'arbitrage d'Auteur du B-1, rendu
 * à la séance du 2026-08-07 : la déclaration de K2 §5 — l'intégrité du juge
 * d'abord — a été prononcée non, et elle tombe avec son écran.
 *
 * L'intégrité du juge ne disparaît pas pour autant : elle vient juste après,
 * parce qu'elle dit ce que le résultat vaut. Un résultat vert rendu par un
 * juge amputé ne vaut rien, et la page doit encore pouvoir le montrer — mais
 * elle le montre en deuxième, comme une garantie, plus comme un préalable.
 *
 * La marque de tête suit le résultat : elle déclare quelle section porte ce
 * qui compte d'abord, et elle ne se dessine pas autrement pour autant. Ce que
 * la déclaration promet, c'est au rendu de l'honorer, et c'est l'œil qui le
 * juge à la séance suivante.
 *
 * La respiration : seule la section du résultat est ample — c'est l'arbitrage
 * du B-9. Les trois autres ne montent pas à son niveau. Elles alternent parce
 * que R4.3 refuse trois sections de même densité à la suite : une page qui ne
 * change jamais de respiration se lit comme un formulaire. « Seul le résultat
 * respire » et « les autres ne se ressemblent pas trois fois de suite » ne
 * s'opposent pas — la seconde dit seulement comment la première s'écrit.
 *
 * L'écart de tête reste celui du 7 août : 48 px. Il avait été porté à 96 px
 * pour satisfaire R3.7 quand le résultat portait son propre titre ; ce titre
 * ayant été retiré par arbitrage d'Auteur, la valeur d'origine redevient
 * tenable et reprend sa place. Une valeur qu'aucun arbitrage ne réclame n'a
 * pas à changer.
 *
 * Le refus de statuer n'est pas une panne : c'est un verdict à part entière,
 * annoncé comme une alerte (K2 §7.2). Et il ferme l'acte : on ne consigne pas
 * un verdict qu'on n'a pas mérité (#021).
 *
 * Le succès — « Run consigné, daté » — est le cinquième état que K2 §6 déclare
 * pour ce gabarit. Il s'annonce À L'ENDROIT DU GESTE, dans la section de
 * l'acte, et nulle part ailleurs : ce qui compte d'abord est le résultat, et un
 * succès qui remonterait en tête le déplacerait. Il prend le rôle « statut » et
 * non « alerte » — un acte réussi rend compte, il n'interrompt pas —, ce qui le
 * rend audible pour un lecteur d'écran là où un simple changement d'intitulé ne
 * l'était pas. L'acte reste ouvert après coup : un poste de travail se rouvre,
 * et consigner un run plus tard n'est pas une exception à traiter mais le geste
 * normal.
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
      {/* ── ample · la tête : le résultat, avant tout le reste ───────────── */}
      <Section tete densite="ample">
        <Pile espace="large">
          <Pile espace="coque">
            <Texte variante="menu">{T.surtitre}</Texte>
            <Titre niveau={1}>{T.titre}</Titre>
            <Texte variante="chapeau">{T.chapeau}</Texte>
          </Pile>
          {/* Le résultat n'a pas de titre à lui : le grand titre de la page EST
              son titre. C'est l'arbitrage d'Auteur du 2026-08-08, et il répare
              une faute de conception assistée — la réorganisation du B-1 avait
              laissé le bloc de l'intégrité sans rien au-dessus de lui, et un
              quatrième titre avait été inventé pour boucher ce trou au lieu de
              le montrer. Un déplacement de hiérarchie n'est jamais un geste
              sans contenu : il en produit toujours, et ce contenu-là ne
              s'invente pas, il s'arbitre. */}
          <EtatAsync
              requete={batterie}
              data-intent="statement"
              data-intent-slot="chargement"
              data-intent-reason="le compte qui avance est une exigence déclarée de ce gabarit — montrer une progression réelle plutôt qu'un rond qui tourne ; c'est la seule chose qui parle pendant l'attente, et elle ne décrit pas le contenu à venir"
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
                    <Pile espace="coque">
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
                <Pile espace="large">
                  <Jeton ton={b.ecarts === 0 ? 'verrou' : 'refus'}>
                    {b.ecarts === 0 ? T.batterieVerte : formuler(T.batterieRouge, { n: b.ecarts })}
                  </Jeton>
                  {/* La phrase annonce les trois chiffres, et elle est posée
                      contre eux. Au-dessus du bloc, elle flottait à égale
                      distance du chapeau et du résultat : l'œil ne savait plus
                      à quoi elle appartenait. Arbitrage d'Auteur du 2026-08-08.
                      Conséquence assumée : elle n'apparaît qu'avec les chiffres
                      qu'elle annonce, donc pas dans les états sans chiffres. */}
                  <Texte variante="fin">{T.etats.chargementAide}</Texte>
                  <Grille colonnes={3} espace="large">
                    <Pile espace="detail">
                      <Texte variante="menu">{C.mesures.fixturesPiegees}</Texte>
                      <Texte variante="corps">{b.piegees}</Texte>
                    </Pile>
                    <Pile espace="detail">
                      <Texte variante="menu">{C.mesures.fixturesConformes}</Texte>
                      <Texte variante="corps">{b.conformes}</Texte>
                    </Pile>
                    <Pile espace="detail">
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

      {/* ── ce que le résultat vaut : l'intégrité du juge ─────────────────── */}
      <Section densite="compact" porte>
        <Pile espace="large">
          <EtatAsync
            requete={integrite}
            chargement={
              <>
                <Pile espace="carte">
                  <Squelette forme="titre" />
                  <Squelette forme="lignes" lignes={1} />
                </Pile>
                <Squelette forme="jetons" lignes={1} />
              </>
            }
            erreur={
              <>
                <Pile espace="carte">
                  <Titre niveau={2}>{T.integriteTitre}</Titre>
                  <Texte variante="fin">{T.integriteAide}</Texte>
                </Pile>
                <Alerte titre={T.etats.erreurTitre} annonce="alerte">
                  <Pile espace="carte">
                    <Texte variante="fin">
                      {formuler(T.etats.erreurCorps, { raison: integrite.erreur ?? '' })}
                    </Texte>
                    <Texte variante="fin">{T.etats.erreurAide}</Texte>
                  </Pile>
                </Alerte>
              </>
            }
            vide={
              <>
                <Pile espace="carte">
                  <Titre niveau={2}>{T.integriteTitre}</Titre>
                  <Texte variante="fin">{T.integriteAide}</Texte>
                </Pile>
                <Vide titre={T.integriteTitre}>
                  <Texte variante="fin">{T.etats.videCorps}</Texte>
                </Vide>
              </>
            }
            enfants={(i) => (
              <>
                <Pile espace="carte">
                  <Titre niveau={2}>{T.integriteTitre}</Titre>
                  <Texte variante="fin">{T.integriteAide}</Texte>
                </Pile>
                <Pile espace="coque">
                  <Jeton ton="verrou">
                    {formuler(T.integriteEntier, { n: i.portees })}
                  </Jeton>
                  <Texte variante="fin">
                    {C.mesures.assertions} : {i.portees}/{i.total}
                  </Texte>
                </Pile>
              </>
            )}
          />
        </Pile>
      </Section>

      {/* ── ce qui rougit, assertion par assertion ────────────────────────── */}
      <Section densite="normal">
        <Pile espace="large">
          <EtatAsync
            requete={constats}
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
                  <Titre niveau={2}>{T.constatsTitre}</Titre>
                  <Texte variante="fin">{T.constatsAide}</Texte>
                </Pile>
                <Alerte titre={T.etats.suspenduTitre} ton="attente" annonce="statut">
                  <Texte variante="fin">{T.etats.constatsSuspendus}</Texte>
                </Alerte>
              </>
            }
            vide={
              <>
                <Pile espace="carte">
                  <Titre niveau={2}>{T.constatsTitre}</Titre>
                  <Texte variante="fin">{T.constatsAide}</Texte>
                </Pile>
                <Vide titre={LIBELLES.ecrans.constat.etats.videTitre}>
                  <Texte variante="fin">
                    {formuler(LIBELLES.ecrans.constat.etats.videCorps, { assertion: 'Le corpus' })}
                  </Texte>
                </Vide>
              </>
            }
            enfants={(liste) => (
              <>
                <Pile espace="carte">
                  <Titre niveau={2}>{T.constatsTitre}</Titre>
                  <Texte variante="fin">{T.constatsAide}</Texte>
                </Pile>
                <Pile espace="large">
                  {liste.map((c) => (
                    <Pile espace="carte" key={c.id}>
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
              </>
            )}
          />
        </Pile>
      </Section>

      {/* ── l'acte ────────────────────────────────────────────────────────── */}
      <Section densite="compact" porte>
        <Pile espace="large">
          <EtatAsync
            requete={runs}
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
                  <Titre niveau={2}>{T.consigneTitre}</Titre>
                  <Texte variante="fin">{T.consigneAide}</Texte>
                </Pile>
                <Alerte titre={T.etats.suspenduTitre} ton="attente" annonce="statut">
                  <Texte variante="fin">{T.etats.consigneFermee}</Texte>
                </Alerte>
              </>
            }
            vide={
              <>
                <Pile espace="carte">
                  <Titre niveau={2}>{T.consigneTitre}</Titre>
                  <Texte variante="fin">{T.consigneAide}</Texte>
                </Pile>
                <Pile espace="page">
                  <Vide titre={T.etats.videTitre}>
                    <Texte variante="fin">{T.etats.videCorps}</Texte>
                  </Vide>
                  <Button onPress={lancer} desactive={enAttente}>
                    {enAttente ? C.actions.consignerEnCours : C.actions.consignerLeRun}
                  </Button>
                </Pile>
              </>
            }
            enfants={(liste) => (
              <>
                <Pile espace="carte">
                  <Titre niveau={2}>{T.consigneTitre}</Titre>
                  <Texte variante="fin">{T.consigneAide}</Texte>
                </Pile>
                <Pile espace="page">
                  {succes ? (
                    <Alerte titre={T.etats.succesTitre} ton="verrou" annonce="statut">
                      <Texte variante="fin">
                        {formuler(T.etats.succesCorps, { date: liste[0].date })}
                      </Texte>
                    </Alerte>
                  ) : (
                    <Pile espace="detail">
                      <Texte variante="menu">{T.derniersRunsTitre}</Texte>
                      <Texte variante="corps">
                        {formuler(T.etats.succesCorps, { date: liste[0].date })}
                      </Texte>
                    </Pile>
                  )}
                  <Button onPress={lancer} desactive={enAttente}>
                    {enAttente ? C.actions.consignerEnCours : C.actions.consignerLeRun}
                  </Button>
                </Pile>
              </>
            )}
          />
        </Pile>
      </Section>
    </main>
  )
}
