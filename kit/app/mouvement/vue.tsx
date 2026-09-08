"use client";

import { useState } from "react";
import { RailDoc, useDocSections, type Sommaire } from "../rail";
import { ListeRegles, PanneauRegistre } from "../etages";
import type { LigneListe, LigneCode } from "../etages";
import { MOUVEMENT } from "../../derivation.mjs";
import "./mouvement.css";

const SOMMAIRE: Sommaire = [
  ["trace", "01", "La trace"],
  ["cause", "02", "La cause"],
  ["regard", "03", "Le regard"],
  ["moteur", "04", "Le moteur"],
];
type Cran = keyof typeof MOUVEMENT.durees;
const ms = (c: Cran) => MOUVEMENT.durees[c].ms;
const emploi = (c: Cran) => MOUVEMENT.durees[c].emploi;

const Play = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M5.25 3.15 12.4 8l-7.15 4.85z" fill="currentColor" />
  </svg>
);

const Check = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="m3.2 8.1 3 3.05 6.6-6.55" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function DemoButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" className="bouton on motion-replay" onClick={onClick}>
      <Play />
      <span>{children}</span>
    </button>
  );
}

function TaskCard() {
  return (
    <div className="trace-card">
      <span className="trace-avatar">AN</span>
      <span className="trace-copy">
        <b>Affiche d&apos;été</b>
        <i><span /> <span /> <span /></i>
      </span>
      <span className="trace-handle">••</span>
    </div>
  );
}

function TraceBoard({ good, right, run }: { good: boolean; right: boolean; run: number }) {
  const direction = right ? "to-right" : "to-left";
  return (
    <article className={`motion-panel trace-panel ${good ? "is-good" : "is-bad"}`} data-intent={good ? undefined : "statement"}>
      <div className="motion-panel-head">
        <span>{good ? "La carte se déplace" : "La carte disparaît, une autre paraît"}</span>
      </div>
      <div className="trace-board" aria-label={good ? "Bon exemple : la carte reste visible pendant tout son déplacement" : "Mauvais exemple : la carte disparaît puis réapparaît ailleurs"}>
        <div className="trace-column"><span>À faire</span><i /></div>
        <div className="trace-column"><span>Terminé</span><i /></div>
        <div className="trace-route" aria-hidden="true"><span /></div>
        {good ? (
          <div className={`trace-moving ${right ? "at-right" : "at-left"}`}><TaskCard /></div>
        ) : (
          <div key={`${run}-${direction}`} className={`trace-moving trace-teleport ${run ? direction : "at-left"}`}><TaskCard /></div>
        )}
      </div>
    </article>
  );
}

function TraceDemo() {
  const [right, setRight] = useState(false);
  const [run, setRun] = useState(0);
  const move = () => { setRight((value) => !value); setRun((value) => value + 1); };

  return (
    <figure className="motion-demo trace-demo">
      <div className="motion-demo-head">
        <b>Une carte passe de « À faire » à « Terminé »</b>
        <DemoButton onClick={move}>{run ? "Rejouer" : "Déplacer"}</DemoButton>
      </div>
      <div className="motion-compare">
        <TraceBoard good={false} right={right} run={run} />
        <TraceBoard good right={right} run={run} />
      </div>
    </figure>
  );
}

function MenuCard() {
  return (
    <div className="origin-menu" role="menu">
      <span className="origin-menu-title">Projet Atlas</span>
      <span role="menuitem"><i className="origin-icon square" />Renommer</span>
      <span role="menuitem"><i className="origin-icon duplicate" />Dupliquer</span>
      <span role="menuitem" className="danger"><i className="origin-icon trash" />Supprimer</span>
    </div>
  );
}

function CausePanel({ good, open, toggle }: { good: boolean; open: boolean; toggle: () => void }) {
  return (
    <article className={`motion-panel origin-panel ${good ? "is-good" : "is-bad"} ${open ? "is-open" : ""}`} data-intent={good ? undefined : "statement"}>
      <div className="motion-panel-head">
        <span>{good ? "Le menu sort de son bouton" : "Le menu sort de nulle part"}</span>
      </div>
      <div className="origin-stage">
        <div className="origin-ghost" aria-hidden="true"><span /><i /></div>
        <span className="origin-ray" aria-hidden="true" />
        <button type="button" className="origin-trigger" aria-expanded={open} onClick={toggle}>
          <span className="origin-thumb">A</span>
          <span><b>Projet Atlas</b><small>Menu du projet</small></span>
          <span className="origin-dots">•••</span>
        </button>
        <MenuCard />
      </div>
    </article>
  );
}

function CauseDemo() {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((value) => !value);
  return (
    <figure className="motion-demo cause-demo">
      <div className="motion-demo-head">
        <b>Le même menu, deux points de départ</b>
        <DemoButton onClick={toggle}>{open ? "Fermer" : "Ouvrir"}</DemoButton>
      </div>
      <div className="motion-compare">
        <CausePanel good={false} open={open} toggle={toggle} />
        <CausePanel good open={open} toggle={toggle} />
      </div>
    </figure>
  );
}

const cards = [
  ["Revenus", "24 680 €", "metric"],
  ["Conversion", "4,8 %", "bars"],
  ["Commandes", "1 284", "counter"],
  ["Trafic", "En hausse", "line"],
  ["Équipe", "8 membres", "people"],
  ["Stock", "À surveiller", "stock"],
  ["Messages", "12 nouveaux", "messages"],
  ["Campagne", "Prête", "campaign"],
] as const;

function MiniVisual({ type }: { type: (typeof cards)[number][2] }) {
  if (type === "bars") return <span className="mini-bars"><i /><i /><i /><i /></span>;
  if (type === "line") return <svg className="mini-line" viewBox="0 0 80 24" aria-hidden="true"><path d="M2 20 17 14 31 17 46 7 60 11 78 3" /></svg>;
  if (type === "people") return <span className="mini-people"><i>A</i><i>M</i><i>S</i></span>;
  if (type === "stock") return <span className="mini-stock"><i /><i /><i /></span>;
  if (type === "messages") return <span className="mini-message"><i /><i /></span>;
  if (type === "campaign") return <span className="mini-campaign"><i /></span>;
  if (type === "counter") return <span className="mini-delta">+ 18 %</span>;
  return <span className="mini-spark"><i /><i /><i /><i /><i /></span>;
}

function GazeBoard({ good, target, run }: { good: boolean; target: number; run: number }) {
  return (
    <article className={`motion-panel gaze-panel ${good ? "is-good" : "is-bad"}`} data-intent={good ? undefined : "statement"}>
      <div className="motion-panel-head">
        <span>{good ? "Seule la carte qui change bouge" : "Les huit cartes bougent"}</span>
      </div>
      <div key={run} className={`gaze-grid ${run ? "is-running" : ""}`} aria-label={good ? "Bon exemple : seule la carte modifiée s'anime" : "Mauvais exemple : toutes les cartes s'animent en même temps"}>
        {cards.map(([title, value, type], index) => (
          <div key={title} className={`gaze-card gaze-${type} ${index === target ? "is-target" : ""}`}>
            <span>{title}</span>
            <b>{value}</b>
            <MiniVisual type={type} />
            {index === target && <em><Check />Mis à jour</em>}
          </div>
        ))}
      </div>
    </article>
  );
}

function GazeDemo() {
  const [run, setRun] = useState(0);
  const targets = [2, 5, 7];
  const target = targets[Math.max(run - 1, 0) % targets.length];
  const update = () => setRun((value) => value + 1);
  return (
    <figure className="motion-demo gaze-demo">
      <div className="motion-demo-head">
        <b>Une donnée change sur le tableau de bord</b>
        <DemoButton onClick={update}>{run ? "Changer encore" : "Mettre à jour"}</DemoButton>
      </div>
      <div className="motion-compare">
        <GazeBoard good={false} target={target} run={run} />
        <GazeBoard good target={target} run={run} />
      </div>
    </figure>
  );
}

/* ── Le répertoire : les valeurs sont LUES au moteur, jamais recopiées. ── */
const CODE: LigneCode[] = [
  { regle: "Un bouton, un survol, un appui",
    ecrit: <><span className="cs-kw">transition</span>: color <span className="cs-var">var(--m-fast)</span> <span className="cs-var">var(--e-out)</span></>,
    produit: `${ms("fast")} ms`, note: emploi("fast") },
  { regle: "Un menu, une infobulle, un dépliant",
    ecrit: <><span className="cs-kw">transition</span>: opacity <span className="cs-var">var(--m-base)</span> <span className="cs-var">var(--e-out)</span></>,
    produit: `${ms("base")} ms`, note: emploi("base") },
  { regle: "Un tiroir, une fenêtre, un panneau",
    ecrit: <><span className="cs-kw">animation</span>: pose <span className="cs-var">var(--m-slow)</span> <span className="cs-var">var(--e-out)</span></>,
    produit: `${ms("slow")} ms`, note: emploi("slow") },
  { regle: "L'arrivée d'une section",
    ecrit: <><span className="cs-kw">transition</span>: opacity <span className="cs-var">var(--m-expressive)</span> <span className="cs-var">var(--e-out)</span></>,
    produit: `${ms("expressive")} ms`, note: emploi("expressive") },
  { regle: "La courbe du kit",
    ecrit: <><span className="cs-kw">--e-out</span>: <span className="cs-var">{MOUVEMENT.courbe}</span></>,
    produit: "départ vif, pose franche", note: "la seule courbe du registre — validée à l'œil le 7 septembre 2026" },
  { regle: "Un déplacement", repli: true,
    ecrit: <><span className="cs-kw">@media</span> (prefers-reduced-motion: no-preference) {"{ … }"}</>,
    produit: "sous son portillon", note: "transform, translate, scale, rotate, défilement doux — jamais nus" },
  { regle: "Un fondu", repli: true,
    ecrit: <><span className="cs-kw">transition</span>: opacity <span className="cs-var">var(--m-base)</span> <span className="cs-var">var(--e-out)</span></>,
    produit: "nu", note: "il reste sous mouvement réduit : il aide à comprendre, il ne déplace rien" },
  { regle: "L'appui", repli: true,
    ecrit: <><span className="cs-kw">animation</span>: appui <span className="cs-var">var(--m-fast)</span> <span className="cs-var">var(--e-out)</span> both</>,
    produit: "scale 0.97", note: "sur :active ; par animation, pour s'ajouter à ce que la commande anime déjà" },
  { regle: "Une chorégraphie", repli: true,
    ecrit: <><span className="cs-kw">transition</span>: transform 620ms <span className="cs-var">var(--e-out)</span> <span className="cs-com">/* chorégraphie : … */</span></>,
    produit: "tolérée, dite", note: "une durée à la main n'existe que sur une ligne qui la déclare" },
];
const LISTE: LigneListe[] = [
  { nom: "Deux propriétés, pas trois",
    dit: "Un mouvement anime le déplacement et la transparence. Jamais une largeur, une hauteur ni une marge.",
    ou: "dans le code" },
  { nom: "Aucune durée écrite à la main",
    dit: "Une transition prend un jeton du moteur, ou dit « chorégraphie » sur sa ligne.",
    ou: "dans le code" },
  { nom: "Un déplacement vit sous son portillon",
    dit: "Sous mouvement réduit, les déplacements partent et les fondus restent.",
    ou: "dans le code" },
  { nom: "Une valeur qu'on fait glisser ne s'anime pas",
    dit: "Ce qu'on tient au doigt est à la valeur tout de suite.",
    ou: "sur l'écran allumé", ton: "rendu" },
  { nom: "L'appui répond",
    dit: "Chaque vraie commande s'enfonce à 0,97 pendant qu'on la tient.",
    ou: "sur l'écran allumé", ton: "rendu" },
  { nom: "Ce qu'on fait cent fois par jour ne s'anime pas",
    dit: "Un raccourci, une ligne de liste, un onglet : la fréquence décide.",
    ou: "nulle part — décision d'Auteur", ton: "auteur" },
];

export default function Vue() {
  const actifId = useDocSections("trace");

  return (
    <div className="gdoc-fond motion-page">
      <div className="gdoc">
        <RailDoc page="mouvement" titre="Fondation · Mouvement" sommaire={SOMMAIRE} actifId={actifId} pied="Le mouvement garde le fil — ou le coupe." />

        <main className="gdoc-contenu" id="contenu">
          <section className="gdoc-heros motion-hero">
            <p className="kicker">Le motion</p>
            <h1>Le mouvement garde le fil<span className="point" aria-hidden="true" /></h1>
            <p className="chapo">Trois règles. Trois gestes.</p>
          </section>

          <section className="gdoc-sec pose" id="trace">
            <div className="gdoc-sec-tete">
              <p className="kicker">01 · La trace</p>
              <h2>Ce qui change reste le même objet</h2>
            </div>
            <div className="gdoc-corps"><TraceDemo /></div>
          </section>

          <section className="gdoc-sec pose" id="cause">
            <div className="gdoc-sec-tete">
              <p className="kicker">02 · La cause</p>
              <h2>Tout mouvement part de quelque part</h2>
            </div>
            <div className="gdoc-corps"><CauseDemo /></div>
          </section>

          <section className="gdoc-sec pose" id="regard">
            <div className="gdoc-sec-tete">
              <p className="kicker">03 · Le regard</p>
              <h2>Un seul changement prend la lumière</h2>
            </div>
            <div className="gdoc-corps"><GazeDemo /></div>
          </section>

          {/* ── 04 · le répertoire : le moteur, lu au registre ── */}
          <section className="gdoc-sec pose" id="moteur">
            <div className="gdoc-sec-tete">
              <p className="kicker">04 · Le moteur</p>
              <h2>Quatre durées, une courbe</h2>
            </div>
            <div className="gdoc-corps">
              <PanneauRegistre lignes={CODE} />
              <ListeRegles lignes={LISTE} />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
