import { EchelleVivante, Densite, Proximite, Adaptation } from "./demos";

const REGLES = [
  { id: "y1", nom: "Y1", titre: "L'intérieur ne dépasse jamais l'extérieur", enonce: "L'espacement interne d'un composant est toujours inférieur ou égal à son espacement externe." },
  { id: "y2", nom: "Y2", titre: "Le titre appartient à ce qu'il ouvre", enonce: "L'espace au-dessus d'un titre dépasse l'espace au-dessous d'au moins un cran." },
  { id: "y3", nom: "Y3", titre: "Les hauteurs s'accrochent à la grille", enonce: "Toute hauteur posée par le système s'exprime en multiples de la grille de base et s'y justifie." },
  { id: "y4", nom: "Y4", titre: "L'interligne suit la lisibilité, pas la grille", enonce: "Baseline souple : aucun interligne n'est recalé sur la grille sans arbitrage explicite et journalisé." },
  { id: "y5", nom: "Y5", titre: "La densité est un décalage d'un cran", enonce: "Jamais une valeur propre, jamais un multiplicateur — un cran d'écart sur l'échelle commune." },
  { id: "y6", nom: "Y6", titre: "La densité ne change jamais la structure", enonce: "L'ordre des emplacements et la présence des éléments restent identiques d'une densité à l'autre." },
  { id: "y7", nom: "Y7", titre: "Deux régimes, un seul seuil", enonce: "Mobile et desktop, séparés par un seuil de largeur unique — un troisième régime naîtra d'un besoin réel journalisé." },
  { id: "y8", nom: "Y8", titre: "Les crans sont responsives — c'est le cran qui varie, jamais l'écran", enonce: "Chaque cran peut résoudre une valeur différente selon le régime, ou glisser entre deux bornes — mais la variation vit dans le jeton, au registre. Renversée en séance sur arbitrage d'Auteur : position GOV.UK, alignée sur l'Échelle Semantic Rhythm.", renversee: true },
  { id: "y9", nom: "Y9", titre: "La géométrie d'espacement vit en rem", enonce: "Base 16 ; restent en pixels, par décision explicite : la cible au doigt, les traits d'un pixel et la largeur d'écran minimale. Renverse la loi du fonds (#069).", renversee: true },
];

function Badges({ ids }: { ids: string[] }) {
  return (
    <span className="rang" style={{ gap: "var(--rr-inline-sm)" }}>
      {ids.map((i) => <a key={i} className="badge" href={`#${i}`}>{i.toUpperCase()}</a>)}
    </span>
  );
}

export default function Rythme() {
  return (
    <main className="page">
      <div>
        <p className="mono sourd">Fondation 1 · jugée en séance le 23 août 2026 · 9 règles, 9 verdicts</p>
        <h1>Le Rythme</h1>
        <p className="sourd">
          L&apos;Échelle Semantic Rhythm fait foi — valeurs lues sur l&apos;étalon,
          jamais recopiées. Chaque démonstration porte le badge de ses lois : clique-le.
        </p>
      </div>

      <section className="carte">
        <div className="rang"><h2>L&apos;échelle sous les yeux</h2><Badges ids={["y8", "y9", "y3"]} /></div>
        <EchelleVivante />
      </section>

      <section className="carte">
        <div className="rang"><h2>La densité</h2><Badges ids={["y5", "y6"]} /></div>
        <Densite />
      </section>

      <section className="carte">
        <div className="rang"><h2>La proximité — casse-la pour la voir</h2><Badges ids={["y1", "y2"]} /></div>
        <Proximite />
      </section>

      <section className="carte">
        <div className="rang"><h2>L&apos;adaptation</h2><span className="badge">doctrine</span></div>
        <Adaptation />
      </section>

      <section className="carte" id="regles">
        <h2>Les neuf lois de la famille</h2>
        {REGLES.map((r) => (
          <div key={r.id} id={r.id} className="regle">
            <b>
              <span className={`badge ${r.renversee ? "ko" : ""}`}>{r.nom}</span>{" "}
              {r.titre}
              {r.renversee ? <span className="sourd"> — renversée en séance</span> : null}
            </b>
            <span className="sourd">{r.enonce}</span>
          </div>
        ))}
        <p className="sourd" style={{ fontSize: "0.875em" }}>
          Source de vérité : la fondation SPACING-UX 2.0.0 (verdicts inscrits règle
          par règle) et la pièce de séance au projet. Ici, la loi se regarde.
        </p>
      </section>
    </main>
  );
}
