"use client";
import { useEffect, useMemo, useState } from "react";
import { derive, contraste, PRIMAIRE_DEFAUT } from "../derivation.mjs";
import { usePrimaire } from "./primaire";

/* ── LA PORTE (proposition HTML validée du 24 août, appliquée au kit).
   Deux terres d'emprunt, dites : la couverture de la charte (le
   dévoilement, le monogramme) ; le générateur Semantic Rhythm (on
   manipule une entrée, tout recalcule). Le moteur d'ici n'est pas une
   copie : c'est LE moteur du site — la puce choisie habille tout. ── */

const D_FILI = "M356.879 197C377.293 197 391.501 204.877 394.412 217.448C395.121 220.046 395.493 223.172 395.493 226.924C395.493 239.317 385.756 248.688 372.672 248.688C364.199 248.688 357.063 244.568 353.216 238.18C353.14 238.054 353.066 237.927 352.993 237.799C351.177 234.635 350.156 230.938 350.156 226.924C350.156 216.714 356.765 208.556 366.239 205.999C363.899 203.331 360.302 201.836 355.368 201.836C339.045 201.836 329.977 216.043 321.514 257.453L317.584 277.101H338.67L391.566 277.101V391.962C391.566 411.912 393.682 417.655 407.889 424.305V424.909H340.181V424.305C354.387 417.655 356.503 411.912 356.503 391.962V310.35C356.503 298.163 355.002 290.617 349.615 284.96H316.073L281.917 424.909C270.128 472.97 248.668 493.222 213 494.733V494.128C232.345 485.363 242.018 452.113 253.202 404.355L280.406 284.96H260.456L261.06 282.542L282.521 275.892L286.451 261.987C299.146 218.461 321.514 197 356.879 197ZM430.349 381C417.664 381 408 390.472 408 403C408 415.528 417.664 425 430.349 425C443.336 425 453 415.528 453 403C453 390.472 443.336 381 430.349 381Z";

function Monogramme({ style }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox="211 195 244 301.7" fill="currentColor" aria-hidden="true" style={style}>
      <path fillRule="evenodd" d={D_FILI} />
    </svg>
  );
}

const ESSAIS: { hex: string; nom: string }[] = [
  { hex: "#1DB954", nom: "Un vert franc" },
  { hex: "#E50914", nom: "Un rouge vif" },
  { hex: "#BE38F3", nom: "Un violet moyen — le cas limite" },
];

const fmt = (r: number) => (Math.round(r * 100) / 100).toFixed(2).replace(".", ",");

export default function Accueil() {
  const { primaire, changer } = usePrimaire();
  const pal = useMemo(() => derive(primaire) as unknown as {
    light: Record<string, string>;
    meta: { saisie: string; aplat: string; aplatAjuste: boolean };
  }, [primaire]);
  /* Les mesures ne se rendent qu'au client : la primaire mémorisée n'est
     connue qu'après l'hydratation. */
  const [pret, setPret] = useState(false);
  useEffect(() => setPret(true), []);

  const rAplat = contraste(pal.light["on-primary"], pal.light.primary) as number;
  const rPage = contraste(pal.light["text-primary"], pal.light.bg) as number;
  const rDoux = contraste(pal.light["on-primary-subtle"], pal.light["primary-subtle"]) as number;

  return (
    <div className="accueil">

      <header className="acc-couv acc-colonne">
        <div className="acc-couv-tete acc-fade" style={{ ["--i" as string]: 0 }}>
          <Monogramme style={{ height: "1.9rem", width: "auto", color: "var(--primary)" }} />
          <b>FILI</b>
        </div>
        <div className="acc-couv-corps">
          <p className="kicker acc-rise" style={{ ["--i" as string]: 1 }}><span>Le kit — trois fondations, un moteur</span></p>
          <h1>
            <span className="acc-rise" style={{ ["--i" as string]: 2 }}><span>Ce kit ne se décrit pas.</span></span>
            <span className="acc-rise" style={{ ["--i" as string]: 3 }}><span>Il se prouve.</span></span>
          </h1>
          <span className="acc-point acc-pop" style={{ ["--i" as string]: 4 }} aria-hidden="true" />
          <p className="acc-chapo acc-fade" style={{ ["--i" as string]: 5 }}><b>Chaque affirmation de ce site est
          mesurée sur la page que vous lisez.</b> La typographie, le rythme, la couleur — et un
          moteur : une décision d&apos;entrée, tout le système sort.</p>
        </div>
        <p className="acc-couv-pied kicker acc-fade" style={{ ["--i" as string]: 6 }}>Design ops &amp; code governance · corpus vivant</p>
      </header>

      <main>

        <section className="acc-sec acc-colonne" id="moteur">
          <div className="acc-sec-tete">
            <p className="kicker">01 · Le moteur</p>
            <h2>Une décision entre. Tout sort.</h2>
            <p className="sourd">Choisissez une couleur : tout le site — fonds, encres, gammes —
            se recalcule sous vos yeux, et les rapports de contraste se mesurent à l&apos;instant
            même. Si votre couleur ne peut pas porter son encre, l&apos;aplat glisse d&apos;un
            cran — et il le dit.</p>
          </div>
          <div className="acc-sec-corps">
            <div className="acc-mo">
              <div className="acc-mo-rail" role="group" aria-label="Choisir une couleur de marque">
                <button className="acc-mo-chip" title="Fili — la charte"
                  aria-pressed={primaire === PRIMAIRE_DEFAUT}
                  onClick={() => changer(PRIMAIRE_DEFAUT)}>
                  <Monogramme style={{ width: "1.5rem", height: "1.5rem", color: "var(--primary)" }} />
                </button>
                {ESSAIS.map((e) => (
                  <button key={e.hex} className="acc-mo-chip" title={e.nom}
                    aria-pressed={primaire === e.hex}
                    onClick={() => changer(e.hex)}>
                    <span className="acc-pastille" style={{ background: e.hex }} />
                  </button>
                ))}
                <label className="acc-mo-chip" title="Votre couleur">
                  <span className="acc-pastille" style={{ background: "conic-gradient(#F43F5E, #F59E0B, #22C55E, #06B6D4, #6366F1, #F43F5E)" }} />
                  <input type="color" value={primaire} onChange={(e) => changer(e.target.value)}
                    aria-label="Choisir votre couleur de marque" />
                </label>
              </div>
              <div className="acc-mo-scene">
                <div className="acc-mo-duo">
                  <div className="acc-mo-carte" style={{ background: "var(--primary)", color: "var(--on-primary)" }}>
                    <Monogramme style={{ height: "clamp(3rem, 6vw, 4.2rem)", width: "auto" }} />
                    <b>L&apos;aplat porte son encre</b>
                  </div>
                  <div className="acc-mo-carte" style={{ background: "var(--primary-subtle)", color: "var(--on-primary-subtle)" }}>
                    <Monogramme style={{ height: "clamp(3rem, 6vw, 4.2rem)", width: "auto", color: "var(--primary)" }} />
                    <b>Le fond doux murmure</b>
                  </div>
                </div>
                {pret && (
                  <div className="acc-mo-mesures" aria-live="polite">
                    <span className="badge"><span className="acc-puce" style={{ background: pal.light["on-primary"] }} />encre sur aplat · {fmt(rAplat)}:1 — mesuré à l&apos;instant</span>
                    <span className="badge"><span className="acc-puce" style={{ background: pal.light["text-primary"] }} />encre de page sur blanc · {fmt(rPage)}:1 — mesuré à l&apos;instant</span>
                    <span className="badge"><span className="acc-puce" style={{ background: pal.light["on-primary-subtle"] }} />encre douce sur fond doux · {fmt(rDoux)}:1 — mesuré à l&apos;instant</span>
                    {pal.meta.aplatAjuste && (
                      <span className="badge acc-dit">aplat glissé : {pal.meta.saisie} → {pal.meta.aplat} — dit, jamais tu</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="acc-sec acc-colonne" id="fondations">
          <div className="acc-sec-tete">
            <p className="kicker">02 · Trois fondations</p>
            <h2>Chacune parle sa langue</h2>
            <p className="sourd">Pas de vignettes : des spécimens. La typographie montre son
            échelle, le rythme ses crans, la couleur ses couples — trois secondes chacune,
            puis la page complète.</p>
          </div>
          <div className="acc-sec-corps">
            <div className="acc-fonds">
              <a className="acc-fond" href="/typo">
                <p className="kicker">Fondation</p>
                <h3>La typographie</h3>
                <div className="acc-fond-specimen">
                  <div className="acc-sp-typo" aria-hidden="true">
                    <span style={{ fontSize: "3.4rem" }}>Aa</span>
                    <span style={{ fontSize: "2.3rem" }}>Aa</span>
                    <span style={{ fontSize: "1.55rem", color: "var(--text-secondary)" }}>Aa</span>
                    <span style={{ fontSize: "1.05rem", color: "var(--text-secondary)" }}>Aa</span>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>Aa</span>
                  </div>
                </div>
                <p>Deux voix, une échelle, une mesure — chaque lettre de la page sait pourquoi.</p>
                <span className="acc-fond-lien">Lire la fondation →</span>
              </a>
              <a className="acc-fond" href="/rythme">
                <p className="kicker">Fondation</p>
                <h3>Le rythme</h3>
                <div className="acc-fond-specimen">
                  <div className="acc-sp-rythme" aria-hidden="true">
                    <i style={{ width: "18%" }} /><i style={{ width: "30%" }} /><i style={{ width: "46%" }} /><i style={{ width: "68%" }} /><i style={{ width: "100%" }} />
                  </div>
                </div>
                <p>Deux axes, des crans déclarés — chaque distance de la page a une raison.</p>
                <span className="acc-fond-lien">Lire la fondation →</span>
              </a>
              <a className="acc-fond" href="/couleur">
                <p className="kicker">Fondation</p>
                <h3>La couleur</h3>
                <div className="acc-fond-specimen">
                  <div className="acc-sp-couleur" aria-hidden="true">
                    <i><b style={{ background: "var(--primary)" }} /><b style={{ background: "var(--primary-subtle)" }} /></i>
                    <i><b style={{ background: "var(--danger)" }} /><b style={{ background: "var(--danger-subtle)" }} /></i>
                    <i><b style={{ background: "var(--success)" }} /><b style={{ background: "var(--success-subtle)" }} /></i>
                  </div>
                </div>
                <p>Des rôles, jamais des valeurs — chaque rapport mesuré sur la page rendue.</p>
                <span className="acc-fond-lien">Lire la fondation →</span>
              </a>
            </div>
          </div>
        </section>

        <section className="acc-sec acc-colonne" id="carte">
          <div className="acc-sec-tete">
            <p className="kicker">03 · La carte du système</p>
            <h2>Où en est le kit</h2>
            <p className="sourd">Un sujet n&apos;avance pas tant que le précédent n&apos;est pas
            verrouillé — la carte fait foi.</p>
          </div>
          <div className="acc-sec-corps">
            <div className="acc-carte">
              <table>
                <thead><tr><th>Sujet</th><th>État</th><th>Ce qu&apos;on y trouve</th></tr></thead>
                <tbody>
                  <tr><td><a href="/typo">Typographie</a></td><td className="acc-etat">🟢 verrouillé</td><td>deux voix, l&apos;échelle, la mesure, la gazette et son banc d&apos;essai</td></tr>
                  <tr><td><a href="/rythme">Rythme</a></td><td className="acc-etat">🟢 verrouillé</td><td>deux axes, les crans responsives, le laboratoire des distances</td></tr>
                  <tr><td><a href="/couleur">Couleur</a></td><td className="acc-etat">🟡 en cours</td><td>seize règles, deux thèmes, le moteur et ses garde-fous</td></tr>
                  <tr><td><a href="/composition">Composition</a></td><td className="acc-etat">🟡 en cours</td><td>huit règles, le chemin de l&apos;œil, les axes mesurés sur le rendu</td></tr>
                  <tr><td>En situation</td><td className="acc-etat">⚪ idée</td><td>les fondations au travail sur de vrais écrans</td></tr>
                </tbody>
              </table>
            </div>
            <p className="sourd" style={{ fontSize: "0.8125rem" }}>Déjà écrites, en attente
            d&apos;entrée : arrondis · tactile · bordures. Composants et patterns restent gelés
            jusqu&apos;au verrou des fondations.</p>
            <details className="prov"><summary>Règles &amp; sources</summary><div>
              <p>La couverture et son dévoilement reprennent la charte Fili (planche couverture,
              monogramme, rise-masks). L&apos;objet vivant reprend le principe du générateur
              Semantic Rhythm : on manipule une entrée, tout recalcule — ici c&apos;est le vrai
              moteur du site (kit/derivation.mjs), pas une maquette. Le gabarit suit le relevé
              « documentaire nu » du 24 août — un principe porteur par page, rails nus, un seul
              geste de couleur.</p>
            </div></details>
          </div>
        </section>

      </main>
    </div>
  );
}
