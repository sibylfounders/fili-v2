"use client";
import { useState, type CSSProperties } from "react";
import { RailDoc, useDocSections, type Toc } from "../rail";
import { Depths, SituationDensity, Wheel, Hierarchy } from "../rythme/view";
import Scenario from "../rythme/scenario";
import { chain, CHARTER, BOUNDS } from "../../derivation.mjs";

/* ═══════════════════════════════════════════════════════════════════════
   PAGE D'ESSAI — LE MOTEUR (2 septembre 2026)

   Elle a fait son travail : tout ce qu'elle a mis au point a été versé dans
   /rythme le 2 septembre — le scénario, la hiérarchie, les commandes, et
   leurs styles. Elle ne garde AUCUNE copie : elle importe le même code que
   la page du kit. Une copie n'est jamais la scène.
   Elle reste comme banc d'essai : on y juge une scène avant de la verser.
   ═══════════════════════════════════════════════════════════════════════ */

type Foundation = ReturnType<typeof chain>;
const fr = (v: number) => String(Math.round(v * 10) / 10).replace(".", ",");
const fr2 = (v: number) => String(Math.round(v * 100) / 100).replace(".", ",");


const TOC: Toc = [
  ["engine", "01", "Le moteur"],
  ["base", "02", "La base"],
  ["root", "03", "La racine des coins"],
  ["headings", "04", "L'intervalle des titres"],
];

export default function View() {
  const [broken, setBroken] = useState(false);
  const [headings, setHeadings] = useState<number>(CHARTER.intervalHeadings);
  const foundationHeadings = chain({ intervalHeadings: headings }) as Foundation;
  const activeId = useDocSections("engine");
  return (
    <div className="gdoc-background ry">
      <div className="gdoc">
        <RailDoc page="moteur-essai" heading="Essai · Le moteur" toc={TOC}
          activeId={activeId} foot="Quatre nombres · une seule chaîne" />
        <main className="gdoc-content" id="content">

          <section className="gdoc-hero">
            <p className="kicker">Page d&apos;essai · Le moteur</p>
            <h1>Quatre nombres, et rien d&apos;autre<span className="point" aria-hidden="true" /></h1>
            <p className="lede">
              Le moteur du kit prend <b>quatre décisions</b> et rend toute la géométrie : les
              marges, les espaces, les coins, les tailles de texte, la cible au doigt.
            </p>
          </section>

          <section className="gdoc-sec set" id="engine">
            <div className="gdoc-sec-head">
              <p className="kicker">01 · Le moteur</p>
              <h2>Comment le moteur décide à notre place</h2>
            </div>
            <div className="gdoc-body">
              <Scenario />
            </div>
          </section>

          <section className="gdoc-sec set" id="base">
            <div className="gdoc-sec-head">
              <p className="kicker">02 · La base</p>
              <h2>La base décide de la respiration</h2>
              <p className="muted">La base, c&apos;est la marge du container — le point de départ
              de la chaîne. Aéré, confortable, compact : trois bases, une seule chaîne. Ce qui ne
              bouge pas d&apos;un pixel : les coins, les cibles et les tailles de texte.</p>
            </div>
            <div className="gdoc-body">
              <SituationDensity />
            </div>
          </section>

          <section className="gdoc-sec set" id="root">
            <div className="gdoc-sec-head">
              <p className="kicker">03 · La racine des coins</p>
              <h2>La racine ne touche à aucune marge</h2>
              <p className="muted">Les coins ont leur propre nombre, et il se divise par deux à
              chaque étage — pas par l&apos;intervalle. Cassez la chaîne : la row devient plus
              ronde que la card qui la contient, et l&apos;emboîtement cesse net de se lire. Les
              marges, elles, n&apos;ont pas bougé.</p>
            </div>
            <div className="gdoc-body">
              <div className="rank">
                <button className={`button broken ${broken ? "on" : ""}`} onClick={() => setBroken(!broken)}>
                  {broken ? "Réparer" : "Casser : l'enfant plus rond"}
                </button>
              </div>
              <figure className="gd-figure">
                <div className="bench dark">
                  <Depths broken={broken} />
                </div>
                <figcaption className="gd-caption">{broken
                  ? "la row est devenue plus ronde que la card qui la contient — l'emboîtement ne se lit plus"
                  : "le coin se divise par deux à chaque étage — et pas une marge n'a bougé"}</figcaption>
              </figure>
            </div>
          </section>

          <section className="gdoc-sec set" id="headings">
            <div className="gdoc-sec-head">
              <p className="kicker">04 · L&apos;intervalle des titres</p>
              <h2>Ce nombre ne règle pas une taille, il règle un contraste</h2>
              <p className="muted">C&apos;est la décision qu&apos;on oublie toujours de compter, et
              pourtant elle est dans le moteur comme les trois autres. Elle ne grossit pas un
              titre : elle écarte tous les niveaux les uns des autres, d&apos;un seul geste. Le
              corps, lui, ne bouge pas d&apos;un pixel — il a un plancher, et c&apos;est le point
              fixe autour duquel tout se règle. Tournez le nombre jusqu&apos;aux deux bouts : la
              hiérarchie a deux façons de casser, et elles se voient.</p>
            </div>
            <div className="gdoc-body">
              <div className="rank">
                <Wheel id="mo-tit" label="Le titre plus ou moins haut"
                  min={BOUNDS.intervalHeadings[0]} max={BOUNDS.intervalHeadings[1]} increment={0.01}
                  value={headings} onValue={setHeadings} says={fr2(headings)} />
              </div>
              <div className="bench veil">
                <Hierarchy foundation={foundationHeadings} ratio={headings} />
              </div>
              <span className="gd-caption">
                {`quatre tailles de texte, un seul nombre — chaque cran vaut le précédent × ${fr2(headings)}, et le corps ne bouge pas`}
              </span>
            </div>
          </section>

          <footer className="gd-foot">
            <span>Page d&apos;essai — elle ne remplace rien</span>
            <span>Les blocs sont importés de la page Rythme, jamais recopiés</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
