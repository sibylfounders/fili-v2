import { Navigation } from "./nav";

export default function Accueil() {
  return (
    <div className="coquille">
      <Navigation actif="accueil" />
      <main className="contenu">
        <div>
          <h1>Un design system qui montre ses raisons</h1>
          <p className="sourd" style={{ marginTop: "var(--rr-block-md)" }}>
            Les documentations habituelles disent <b style={{ color: "var(--p-encre)" }}>quoi</b> faire.
            Ici, chaque règle porte en plus son <b style={{ color: "var(--p-encre)" }}>pourquoi</b>,
            sa <b style={{ color: "var(--p-encre)" }}>source</b> vérifiable, une démonstration qu&apos;on
            peut régler et casser — et l&apos;aveu daté de nos divergences avec le marché, y compris
            quand nous avons changé d&apos;avis.
          </p>
        </div>
        <section className="section">
          <div className="doc carte">
            <h2>Commencer par le rythme</h2>
            <p className="sourd">La première fondation en ligne : comment ce système espace les
            choses, pourquoi, et ce que ça change à l&apos;écran. <a href="/rythme">Ouvrir la page
            du Rythme →</a></p>
          </div>
          <aside className="sources-col">
            <h4>La méthode</h4>
            <p>Le système se reconstruit fondation par fondation — le rythme, puis la typographie,
            puis les autres. Les composants n&apos;arrivent qu&apos;une fois les fondations
            verrouillées : chacun naîtra avec la liste des règles qui l&apos;ont construit.</p>
          </aside>
        </section>
      </main>
      <aside className="reglages">
        <h3>Theming &amp; playground</h3>
        <p className="sourd" style={{ fontSize: "0.75rem" }}>Les réglages vivent sur chaque page de
        fondation — largeur simulée, densité, adaptation à votre stack (React, Angular, HTML ×
        CSS natif, Tailwind).</p>
      </aside>
    </div>
  );
}
