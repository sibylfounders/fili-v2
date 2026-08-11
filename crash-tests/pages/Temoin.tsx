import {
  Section, Titre, Texte, Pile, Grille, Jeton, Alerte, Vide, Squelette,
  Button, TextField, EtatAsync
} from '../design-system/index.ts'
import { useRequete, useMutation } from '../design-system/donnees/useRequete.js'

export function Temoin() {
  const composants = useRequete('/composants')
  const journal = useRequete('/journal')
  const telemetrie = useRequete('/telemetrie')
  const audit = useRequete('/audit')
  const { lancer, enAttente, erreur } = useMutation('/verification')

  return (
    <main>
      {/* ── ample ─────────────────────────────────────────────────────── */}
      <Section tete densite="ample">
        <Pile espace="large">
          <Texte variante="menu">FILI · Écran Témoin · version du 6 août 2026</Texte>
          <Titre niveau={1}>Une décision approuvée une fois devient un invariant vérifiable.</Titre>
          <Texte variante="chapeau">
            Cette page est écrite à la main sous les contrats S1 et S2, et elle passe
            sous le Leviathan. Ce que vous regardez n'est pas une maquette : c'est ce
            que la doctrine autorise, et rien d'autre.
          </Texte>
        </Pile>
      </Section>

      {/* ── compact ───────────────────────────────────────────────────── */}
      <Section densite="compact" fond>
        <Pile espace="large">
          <Titre niveau={2}>Où en est le système</Titre>
          <Grille colonnes={4} espace="large">
            <Pile espace="detail">
              <Jeton ton="verrou">S1 · Composants typés</Jeton>
              <Texte variante="fin">Six règles, verrouillé.</Texte>
            </Pile>
            <Pile espace="detail">
              <Jeton ton="verrou">S2 · Contrat d'état</Jeton>
              <Texte variante="fin">Six règles, verrouillé.</Texte>
            </Pile>
            <Pile espace="detail">
              <Jeton ton="attente">S3 · Discipline spatiale</Jeton>
              <Texte variante="fin">Fermé jusqu'à votre verdict sur cette page.</Texte>
            </Pile>
            <Pile espace="detail">
              <Jeton ton="neutre">S4 · Rythme de composition</Jeton>
              <Texte variante="fin">Fermé.</Texte>
            </Pile>
          </Grille>
        </Pile>
      </Section>

      {/* ── normal ── R2.7 déclarée : témoin gelé, voir le motif ───────── */}
      <Section
        densite="normal"
        data-intent="statement"
        data-intent-reason="écran témoin du MVP, jugé avant R2.7 : il est conservé tel qu'il a été jugé plutôt que retouché — un témoin ne se réécrit pas"
      >
        <Pile espace="large">
          <Pile espace="coque">
            <Titre niveau={2}>Les composants du registre</Titre>
            <Texte variante="chapeau">
              Une donnée distante ne s'affiche jamais nue : elle passe par un conteneur
              qui oblige à traiter les quatre cas.
            </Texte>
          </Pile>
          <EtatAsync
            requete={composants}
            chargement={<Squelette lignes={3} />}
            erreur={<Alerte titre="Le catalogue n'a pas pu être chargé">
              <Texte variante="fin">Le service de composants ne répond pas. Réessayer, ou continuer sans le catalogue.</Texte>
            </Alerte>}
            vide={<Vide titre="Aucun composant déclaré">
              <Texte variante="fin">Le registre est vide : déclarez un premier composant pour commencer.</Texte>
            </Vide>}
            enfants={(liste) => (
              <Grille colonnes={3} espace="large">
                {liste.map((c) => (
                  <Pile espace="carte" key={c.id}>
                    <Titre niveau={3}>{c.nom}</Titre>
                    <Texte variante="fin">{c.variantes}</Texte>
                  </Pile>
                ))}
              </Grille>
            )}
          />
          <Grille colonnes={2} espace="large">
            <Pile espace="carte">
              <TextField id="recherche" label="Rechercher un composant" />
              <Button onPress={lancer}>{enAttente ? 'Vérification en cours…' : 'Lancer la vérification'}</Button>
              {erreur ? <Texte variante="fin">La vérification a échoué. Réessayer.</Texte> : null}
            </Pile>
            <Pile espace="carte">
              <TextField id="registre" label="Chemin du registre" />
              <Button variante="discret">Ouvrir le registre</Button>
            </Pile>
          </Grille>
        </Pile>
      </Section>

      {/* ── normal ── deux densités identiques à la suite : autorisé, jamais trois */}
      <Section
        densite="normal"
        fond
        data-intent="statement"
        data-intent-reason="écran témoin du MVP, jugé avant R2.7 : il est conservé tel qu'il a été jugé plutôt que retouché — un témoin ne se réécrit pas ; et son titre couvre trois conteneurs à la fois, il n'appartient à aucun d'eux"
      >
        <Pile espace="large">
          <Pile espace="coque">
            <Titre niveau={2}>Ce qu'il se passe quand ça ne va pas</Titre>
            <Texte variante="chapeau">Trois états non nominaux, rendus par le même conteneur.</Texte>
          </Pile>
          <Grille colonnes={3} espace="page">
            <EtatAsync
              requete={telemetrie}
              chargement={<Squelette lignes={2} />}
              erreur={<Alerte titre="La télémétrie est indisponible">
                <Texte variante="fin">Le service ne répond pas. Les mesures d'aujourd'hui manqueront au rapport. Réessayer.</Texte>
              </Alerte>}
              vide={<Vide titre="Aucune mesure"><Texte variante="fin">Rien à afficher.</Texte></Vide>}
              enfants={(d) => <Texte variante="fin">{d.length} mesures</Texte>}
            />
            <EtatAsync
              requete={journal}
              chargement={<Squelette lignes={2} />}
              erreur={<Alerte titre="Journal indisponible"><Texte variante="fin">Réessayer.</Texte></Alerte>}
              vide={<Vide titre="Aucune décision aujourd'hui">
                <Texte variante="fin">Le journal se remplit à chaque arbitrage. Rien n'a été tranché depuis hier.</Texte>
              </Vide>}
              enfants={(d) => <Texte variante="fin">{d.length} décisions</Texte>}
            />
            <EtatAsync
              requete={audit}
              chargement={<Squelette lignes={2} />}
              erreur={<Alerte titre="Audit indisponible"><Texte variante="fin">Réessayer.</Texte></Alerte>}
              vide={<Vide titre="Aucun audit"><Texte variante="fin">Rien à afficher.</Texte></Vide>}
              enfants={(d) => <Texte variante="fin">{d.length} constats</Texte>}
            />
          </Grille>
        </Pile>
      </Section>

      {/* ── ample ── rupture déclarée ─────────────────────────────────── */}
      <Section
        densite="ample"
        data-intent="statement"
        data-intent-reason="page manifeste : le contraste d'échelle fait partie du propos, il n'est pas un accident de mise en page"
      >
        <Pile espace="large">
          <Texte variante="menu">Rupture déclarée</Texte>
          <p className="affiche">Ceci n'est pas une erreur. C'est une intention signée.</p>
          <Texte variante="fin">
            Cette section sort de l'échelle typographique. Elle passe parce qu'elle porte
            son intention et son motif, à l'endroit exact où elle s'exerce. Sans motif
            écrit, elle serait bloquée comme une négligence.
          </Texte>
        </Pile>
      </Section>

      {/* ── compact ───────────────────────────────────────────────────── */}
      <Section densite="compact" fond>
        <Pile espace="page">
          <Titre niveau={2}>Ce que cette page ne prouve pas</Titre>
          <Grille colonnes={3} espace="page">
            <Texte variante="fin">Qu'elle est belle. Elle prouve que la doctrine ne l'empêche pas de l'être.</Texte>
            <Texte variante="fin">Ce que l'IA en ferait. Elle est écrite à la main sous contrainte : c'est le plafond, pas le comportement d'un modèle.</Texte>
            <Texte variante="fin">Qu'elle est accessible. Le contraste et le clavier tiennent ; l'audit reste à faire.</Texte>
          </Grille>
        </Pile>
      </Section>
    </main>
  )
}
