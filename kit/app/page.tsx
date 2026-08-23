import { Navigation } from "./nav";
import { Densite } from "./densite";

export default function Accueil() {
  return (
    <div className="coquille">
      <Navigation actif="accueil" />

      <main className="contenu">
        <div className="tete-page">
          <p className="kicker">Kit · par Sibyl</p>
          <h1>Un design system qui montre ses raisons</h1>
          <p className="chapo">
            Pas un design system de plus : un système où <b>chaque élément d&apos;interface
            remonte aux lois qui l&apos;ont construit</b> — l&apos;énoncé en clair, la source
            vérifiable, l&apos;arbitrage daté. Et où chaque loi se règle, se casse et se
            regarde agir, sur des bancs d&apos;essai vivants.
          </p>
        </div>

        <section className="bloc-section">
          <p className="kicker">01 · Les fondations</p>
          <h2>Deux fondations vivantes, sept en chemin</h2>
          <div className="tuiles">
            <a href="/rythme" className="tuile">
              <span className="mono sourd">Fondation · actée le 23 août 2026</span>
              <span className="tuile-titre">Le rythme</span>
              <span className="tuile-specimen" aria-hidden>
                <span className="barre" style={{ width: "calc(8 * var(--rr-inline-unit))" }} />
                <span className="barre" style={{ width: "calc(5 * var(--rr-inline-unit))" }} />
                <span className="barre" style={{ width: "calc(3 * var(--rr-inline-unit))" }} />
                <span className="barre" style={{ width: "calc(2 * var(--rr-inline-unit))" }} />
              </span>
              <span className="sourd">Neuf règles d&apos;espacement, une échelle générée —
              chaque distance a une raison, et vous pouvez la tirer.</span>
              <span className="tuile-appel">Ouvrir la fondation →</span>
            </a>
            <a href="/typo" className="tuile">
              <span className="mono sourd">Fondation · actée le 23 août 2026</span>
              <span className="tuile-titre">La typographie</span>
              <span className="tuile-specimen" style={{ fontSize: "var(--t-titre-1)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.1 }} aria-hidden>
                Aa Bb Éé 013
              </span>
              <span className="sourd">Onze règles de composition, deux mesures de rendu —
              et les fontes livrées avec le kit, au nom exact.</span>
              <span className="tuile-appel">Ouvrir la fondation →</span>
            </a>
          </div>
          <p className="sourd">Déjà écrites, en attente d&apos;entrée : arrondis · tactile ·
          couleur · bordures. Puis : surfaces, élévation, grille, iconographie, superpositions.</p>
        </section>

        <section className="bloc-section">
          <p className="kicker">02 · La méthode</p>
          <h2>Comment une loi entre ici</h2>
          <div className="etapes">
            <div className="regle"><b>1 · Elle s&apos;écrit, et se date.</b>
            <span className="sourd">Un énoncé, une mesure décidable sans contexte, un test qui
            sait la casser, une dépendance dite — et ses sources citées comme motifs, jamais
            comme exigences.</span></div>
            <div className="regle"><b>2 · Elle passe en séance.</b>
            <span className="sourd">Verdict règle par règle, par l&apos;auteur du système.
            Les renversements sont conservés, datés et motivés — y compris quand nous avons
            changé d&apos;avis.</span></div>
            <div className="regle"><b>3 · Elle devient page vivante.</b>
            <span className="sourd">Un banc d&apos;essai où on la règle, où on la casse, où on
            la voit mordre. Une loi qu&apos;on peut voir agir vaut dix pages de doctrine.</span></div>
          </div>
        </section>

        <section className="bloc-section">
          <p className="kicker">03 · La règle du jeu</p>
          <h2>Les fondations d&apos;abord, les composants ensuite</h2>
          <p className="sourd" style={{ maxWidth: "var(--t-mesure)" }}>Composants et patterns sont
          gelés jusqu&apos;au verrou des fondations. Chaque composant naîtra ensuite avec sa
          fiche « les lois qui m&apos;ont construit » — et le normatif restera la règle et le
          jeton : React, Angular, HTML, CSS natif ou Tailwind n&apos;en sont que des
          consommateurs.</p>
        </section>
      </main>

      <aside className="reglages">
        <h3>Theming &amp; playground</h3>
        <Densite />
        <p className="sourd" style={{ fontSize: "0.75rem" }}>Chaque fondation apporte ses
        réglages : densité et adaptation sur le rythme, zoom lecteur et adaptation sur la
        typographie. Le thème arrivera avec sa fondation couleur.</p>
      </aside>
    </div>
  );
}
