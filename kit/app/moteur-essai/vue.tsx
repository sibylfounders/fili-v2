"use client";
import { useState, type CSSProperties } from "react";
import { RailDoc, useDocSections, type Sommaire } from "../rail";
import { Profondeurs, SituationDensite, Molette, Hierarchie } from "../rythme/vue";
import Scenario from "../rythme/scenario";
import { chaine, CHARTE, BORNES } from "../../derivation.mjs";

/* ═══════════════════════════════════════════════════════════════════════
   PAGE D'ESSAI — LE MOTEUR (2 septembre 2026)

   Elle a fait son travail : tout ce qu'elle a mis au point a été versé dans
   /rythme le 2 septembre — le scénario, la hiérarchie, les commandes, et
   leurs styles. Elle ne garde AUCUNE copie : elle importe le même code que
   la page du kit. Une copie n'est jamais la scène.
   Elle reste comme banc d'essai : on y juge une scène avant de la verser.
   ═══════════════════════════════════════════════════════════════════════ */

type Socle = ReturnType<typeof chaine>;
const fr = (v: number) => String(Math.round(v * 10) / 10).replace(".", ",");
const fr2 = (v: number) => String(Math.round(v * 100) / 100).replace(".", ",");


const SOMMAIRE: Sommaire = [
  ["moteur", "01", "Le moteur"],
  ["base", "02", "La base"],
  ["racine", "03", "La racine des coins"],
  ["titres", "04", "L'intervalle des titres"],
];

export default function Vue() {
  const [casse, setCasse] = useState(false);
  const [titres, setTitres] = useState<number>(CHARTE.intervalleTitres);
  const socleTitres = chaine({ intervalleTitres: titres }) as Socle;
  const actifId = useDocSections("moteur");
  return (
    <div className="gdoc-fond ry">
      <div className="gdoc">
        <RailDoc page="moteur-essai" titre="Essai · Le moteur" sommaire={SOMMAIRE}
          actifId={actifId} pied="Quatre nombres · une seule chaîne" />
        <main className="gdoc-contenu" id="contenu">

          <section className="gdoc-heros">
            <p className="kicker">Page d&apos;essai · Le moteur</p>
            <h1>Quatre nombres, et rien d&apos;autre<span className="point" aria-hidden="true" /></h1>
            <p className="chapo">
              Le moteur du kit prend <b>quatre décisions</b> et rend toute la géométrie : les
              marges, les espaces, les coins, les tailles de texte, la cible au doigt.
            </p>
          </section>

          <section className="gdoc-sec pose" id="moteur">
            <div className="gdoc-sec-tete">
              <p className="kicker">01 · Le moteur</p>
              <h2>Comment le moteur décide à notre place</h2>
            </div>
            <div className="gdoc-corps">
              <Scenario />
            </div>
          </section>

          <section className="gdoc-sec pose" id="base">
            <div className="gdoc-sec-tete">
              <p className="kicker">02 · La base</p>
              <h2>La base décide de la respiration</h2>
              <p className="sourd">La base, c&apos;est la marge du container — le point de départ
              de la chaîne. Aéré, confortable, compact : trois bases, une seule chaîne. Ce qui ne
              bouge pas d&apos;un pixel : les coins, les cibles et les tailles de texte.</p>
            </div>
            <div className="gdoc-corps">
              <SituationDensite />
            </div>
          </section>

          <section className="gdoc-sec pose" id="racine">
            <div className="gdoc-sec-tete">
              <p className="kicker">03 · La racine des coins</p>
              <h2>La racine ne touche à aucune marge</h2>
              <p className="sourd">Les coins ont leur propre nombre, et il se divise par deux à
              chaque étage — pas par l&apos;intervalle. Cassez la chaîne : la row devient plus
              ronde que la card qui la contient, et l&apos;emboîtement cesse net de se lire. Les
              marges, elles, n&apos;ont pas bougé.</p>
            </div>
            <div className="gdoc-corps">
              <div className="rang">
                <button className={`bouton casse ${casse ? "on" : ""}`} onClick={() => setCasse(!casse)}>
                  {casse ? "Réparer" : "Casser : l'enfant plus rond"}
                </button>
              </div>
              <figure className="gd-figure">
                <div className="banc sombre" data-theme="dark">
                  <Profondeurs casse={casse} />
                </div>
                <figcaption className="gd-legende">{casse
                  ? "la row est devenue plus ronde que la card qui la contient — l'emboîtement ne se lit plus"
                  : "le coin se divise par deux à chaque étage — et pas une marge n'a bougé"}</figcaption>
              </figure>
            </div>
          </section>

          <section className="gdoc-sec pose" id="titres">
            <div className="gdoc-sec-tete">
              <p className="kicker">04 · L&apos;intervalle des titres</p>
              <h2>Ce nombre ne règle pas une taille, il règle un contraste</h2>
              <p className="sourd">C&apos;est la décision qu&apos;on oublie toujours de compter, et
              pourtant elle est dans le moteur comme les trois autres. Elle ne grossit pas un
              titre : elle écarte tous les niveaux les uns des autres, d&apos;un seul geste. Le
              corps, lui, ne bouge pas d&apos;un pixel — il a un plancher, et c&apos;est le point
              fixe autour duquel tout se règle. Tournez le nombre jusqu&apos;aux deux bouts : la
              hiérarchie a deux façons de casser, et elles se voient.</p>
            </div>
            <div className="gdoc-corps">
              <div className="rang">
                <Molette id="mo-tit" label="Le titre plus ou moins haut"
                  min={BORNES.intervalleTitres[0]} max={BORNES.intervalleTitres[1]} pas={0.01}
                  valeur={titres} surValeur={setTitres} dit={fr2(titres)} />
              </div>
              <div className="banc voile">
                <Hierarchie socle={socleTitres} ratio={titres} />
              </div>
              <span className="gd-legende">
                {`quatre tailles de texte, un seul nombre — chaque cran vaut le précédent × ${fr2(titres)}, et le corps ne bouge pas`}
              </span>
            </div>
          </section>

          <footer className="gd-pied">
            <span>Page d&apos;essai — elle ne remplace rien</span>
            <span>Les blocs sont importés de la page Rythme, jamais recopiés</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
