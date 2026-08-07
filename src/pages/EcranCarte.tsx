/* É5 · La carte — parcours P3 · Acter une décision.
 *
 * Ce qui compte d'abord : LE PROCHAIN JALON OUVRABLE, et ce qui le bloque. Une
 * carte qui commence par l'inventaire fait chercher l'endroit où l'on est —
 * c'est l'empilement de donnée brute que le verdict de K1 a nommé.
 *
 * Elle décrit le présent. Le « pourquoi » vit dans le journal, et les deux
 * écrans ne se recouvrent pas : celui-ci ne raconte rien.
 *
 * L'erreur n'affiche AUCUNE carte partielle. Une carte incomplète se lit comme
 * un système incomplet, et c'est un mensonge plus coûteux qu'un refus.
 */
import {
  Section, Titre, Texte, Pile, Grille, Jeton, Alerte, Vide, Squelette,
  EtatAsync, useRequete, LIBELLES, formuler,
} from '../system/index.ts'

type Ligne = { nom: string; statut: string }
type Jalon = Ligne & { verrouille: string; bloque: string }
type Contrat = Ligne & { gouverne: string; assertions: string }
type Gabarit = Ligne & { parcours: string; temoin: string }
type Piece = Ligne & { porte: string; bloque: string }
type Dette = Ligne & { depuis: string; cout: string }
type Carte = {
  jalons: Jalon[]
  contrats: Contrat[]
  gabarits: Gabarit[]
  instrument: Piece[]
  dettes: Dette[]
  prochain: { nom: string; statut: string; bloque: string } | null
}

const T = LIBELLES.ecrans.carte

/* Un statut ne se lit jamais à la couleur seule : la pastille est doublée du
   libellé que le registre déclare (K2 §7.1). */
const TON: Record<string, 'verrou' | 'attente' | 'idee' | 'refus'> = {
  '🟢': 'verrou', '🟡': 'attente', '⚪': 'idee', '🔴': 'refus',
}
const MOT: Record<string, string> = {
  '🟢': LIBELLES.commun.statuts.verrou,
  '🟡': LIBELLES.commun.statuts.attente,
  '⚪': LIBELLES.commun.statuts.idee,
  '🔴': LIBELLES.commun.statuts.refus,
}
const ton = (p: string) => TON[p] ?? 'idee'
const mot = (p: string) => MOT[p] ?? p

export function EcranCarte() {
  const carte = useRequete<Carte>('/carte')

  return (
    <main>
      {/* ── ample · la tête : le prochain jalon, et ce qui le bloque ─────── */}
      <Section tete densite="ample">
        <Pile espace={7}>
          <Pile espace={3}>
            <Texte variante="menu">{T.surtitre}</Texte>
            <Titre niveau={1}>{T.titre}</Titre>
            <Texte variante="chapeau">{T.chapeau}</Texte>
          </Pile>
          <EtatAsync
            requete={carte}
            chargement={<Squelette forme="jetons" lignes={1} />}
            erreur={
              <Alerte titre={T.etats.erreurTitre} annonce="alerte">
                <Pile espace={2}>
                  <Texte variante="fin">
                    {formuler(T.etats.erreurCorps, { raison: carte.erreur ?? '' })}
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
            enfants={(c) =>
              c.prochain === null ? (
                <Vide titre={T.etats.videTitre}>
                  <Texte variante="fin">{T.etats.videCorps}</Texte>
                </Vide>
              ) : (
                <Pile espace={5}>
                  <Pile espace={1}>
                    <Texte variante="menu">{T.prochainTitre}</Texte>
                    <Titre niveau={2}>{c.prochain.nom}</Titre>
                  </Pile>
                  <Pile espace={1}>
                    <Texte variante="menu">{T.prochainBloque}</Texte>
                    <Texte variante="corps">
                      {c.prochain.bloque === '—' ? T.prochainLibre : c.prochain.bloque}
                    </Texte>
                  </Pile>
                </Pile>
              )
            }
          />
        </Pile>
      </Section>

      {/* ── compact · le chapitre et les contrats ────────────────────────── */}
      <Section densite="compact" fond>
        <Pile espace={7}>
          <EtatAsync
            requete={carte}
            chargement={<Squelette forme="lignes" lignes={3} />}
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
            enfants={(c) => (
              <Pile espace={7}>
                <Pile espace={4}>
                  <Titre niveau={2}>{T.jalonsTitre}</Titre>
                  <Pile espace={4}>
                    {c.jalons.map((j) => (
                      <Pile espace={1} key={j.nom}>
                        <Jeton ton={ton(j.statut)}>{mot(j.statut)}</Jeton>
                        <Titre niveau={3}>{j.nom}</Titre>
                        <Texte variante="fin">{j.verrouille}</Texte>
                      </Pile>
                    ))}
                  </Pile>
                </Pile>
                <Pile espace={4}>
                  <Titre niveau={2}>{T.contratsTitre}</Titre>
                  <Grille colonnes={2} espace={6}>
                    {c.contrats.map((x) => (
                      <Pile espace={1} key={x.nom}>
                        <Jeton ton={ton(x.statut)}>{mot(x.statut)}</Jeton>
                        <Titre niveau={3}>{x.nom}</Titre>
                        <Texte variante="fin">{x.gouverne}</Texte>
                      </Pile>
                    ))}
                  </Grille>
                </Pile>
              </Pile>
            )}
          />
        </Pile>
      </Section>

      {/* ── normal · les gabarits et l'instrument ────────────────────────── */}
      <Section densite="normal">
        <Pile espace={7}>
          <EtatAsync
            requete={carte}
            chargement={<Squelette forme="lignes" lignes={3} />}
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
            enfants={(c) => (
              <Pile espace={7}>
                <Pile espace={4}>
                  <Titre niveau={2}>{T.gabaritsTitre}</Titre>
                  <Grille colonnes={2} espace={6}>
                    {c.gabarits.map((g) => (
                      <Pile espace={1} key={g.nom}>
                        <Jeton ton={ton(g.statut)}>{mot(g.statut)}</Jeton>
                        <Titre niveau={3}>{g.nom}</Titre>
                        <Texte variante="fin">{g.temoin}</Texte>
                      </Pile>
                    ))}
                  </Grille>
                </Pile>
                <Pile espace={4}>
                  <Titre niveau={2}>{T.instrumentTitre}</Titre>
                  <Pile espace={4}>
                    {c.instrument.map((p) => (
                      <Pile espace={1} key={p.nom}>
                        <Jeton ton={ton(p.statut)}>{mot(p.statut)}</Jeton>
                        <Titre niveau={3}>{p.nom}</Titre>
                        <Texte variante="fin">{p.porte}</Texte>
                      </Pile>
                    ))}
                  </Pile>
                </Pile>
              </Pile>
            )}
          />
        </Pile>
      </Section>

      {/* ── compact · les dettes ─────────────────────────────────────────── */}
      <Section densite="compact" fond>
        <Pile espace={6}>
          <Pile espace={2}>
            <Titre niveau={2}>{T.dettesTitre}</Titre>
            <Texte variante="fin">{T.dettesAide}</Texte>
          </Pile>
          <EtatAsync
            requete={carte}
            chargement={<Squelette forme="lignes" lignes={2} />}
            erreur={
              <Alerte titre={T.etats.suspenduTitre} ton="attente" annonce="statut">
                <Texte variante="fin">{T.etats.detteSuspendue}</Texte>
              </Alerte>
            }
            vide={
              <Vide titre={T.etats.videTitre}>
                <Texte variante="fin">{T.etats.videCorps}</Texte>
              </Vide>
            }
            enfants={(c) => (
              <Pile espace={6}>
                {c.dettes.map((d) => (
                  <Pile espace={2} key={d.nom}>
                    <Jeton ton={ton(d.statut)}>{mot(d.statut)}</Jeton>
                    <Titre niveau={3}>{d.nom}</Titre>
                    <Texte variante="fin">{d.cout}</Texte>
                  </Pile>
                ))}
              </Pile>
            )}
          />
        </Pile>
      </Section>
    </main>
  )
}
