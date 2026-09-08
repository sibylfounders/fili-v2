"use client";

import { useEffect, useRef, useState } from "react";
import { RailDoc, useDocSections, type Sommaire } from "../rail";
import { Bandes, Bande, ListeRegles, PanneauRegistre } from "../etages";
import type { LigneListe, LigneCode } from "../etages";
import { MOUVEMENT } from "../../derivation.mjs";
import "./mouvement.css";

/* ══════════════════════════════════════════════════════════════════════
   /mouvement — trois règles en trois comparaisons (la trace, la cause, le
   regard), puis le répertoire au gabarit des autres pages : les règles
   qu'on peut casser (quatre paires, un seul geste joue les deux côtés, la
   tête de chaque côté est lue sur le rendu), celles qu'on ne peut pas
   montrer (en liste), et le code (lu au moteur). Page reprise le 8
   septembre 2026 sur les instructions d'Auteur : la densité d'un chapitre,
   l'impact d'une démonstration. Les valeurs sont LUES, jamais décrétées.
   ══════════════════════════════════════════════════════════════════════ */
const SOMMAIRE: Sommaire = [
  ["trace", "01", "La trace"],
  ["cause", "02", "La cause"],
  ["regard", "03", "Le regard"],
  ["casser", "04", "Les règles qu'on peut casser"],
  ["invisibles", "05", "Les règles qu'on ne peut pas montrer"],
  ["code", "06", "Dans le code"],
];
type Cran = keyof typeof MOUVEMENT.durees;
const ms = (c: Cran) => MOUVEMENT.durees[c].ms;
const emploi = (c: Cran) => MOUVEMENT.durees[c].emploi;
const dec = (v: number) => String(Math.round(v * 100) / 100).replace(".", ",");
const enMs = (s: string) => { const v = parseFloat(s); return s.trim().endsWith("ms") ? v : v * 1000; };
/* Lire un objet AU REPOS : pendant qu'une transition court, la valeur calculée
   est celle de l'image en cours, pas celle de la règle. On lit un jumeau posé
   un instant à côté, sans son état ouvert, puis retiré. */
function auRepos<T>(el: HTMLElement, lire: (cs: CSSStyleDeclaration) => T): T {
  const jumeau = el.cloneNode(false) as HTMLElement;
  jumeau.removeAttribute("id"); jumeau.classList.remove("ouvert", "la");
  jumeau.style.visibility = "hidden"; jumeau.setAttribute("aria-hidden", "true");
  el.parentElement?.appendChild(jumeau);
  try { return lire(getComputedStyle(jumeau)); } finally { jumeau.remove(); }
}

/* ── Les règles et leurs sources, lues sous chaque preuve ── */
type Src = { t: string; h: string };
const DECISIONS: Src = { t: "Décisions du 3 septembre 2026, sur pièce (les trois lois)", h: "#" };
const FONDS: Src = { t: "Fonds Emil Kowalski (Linear, Sonner, Vaul) — emilkowal.ski", h: "https://emilkowal.ski/" };
const REGLES: { id: string; nom: string; titre: string; enonce: string; src: Src[] }[] = [
  { id: "m1", nom: "1", titre: "Moins de mouvement ne veut pas dire aucun mouvement",
    enonce: "Sous prefers-reduced-motion: reduce, aucune transition ni animation ne porte transform, translate, scale, rotate ni de défilement doux ; les transitions d'opacité et de couleur restent admises. Le réglage vise les troubles vestibulaires, provoqués par du mouvement dans l'espace — pas par un fondu.",
    src: [{ t: "WCAG 2.3.3 — Animation from Interactions", h: "https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html" }, { t: "WCAG 2.2.2 — Pause, Stop, Hide", h: "https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html" }, { t: "MDN — prefers-reduced-motion", h: "https://developer.mozilla.org/docs/Web/CSS/@media/prefers-reduced-motion" }, DECISIONS] },
  { id: "m2", nom: "2", titre: "La courbe du kit est la sienne",
    enonce: "Ce qui entre et ce qui sort décélère, sur une courbe choisie — jamais une courbe livrée d'origine, jamais une accélération finale sur de l'interface. Une seule courbe au registre : --e-out.",
    src: [{ t: "Emil Kowalski — Great Animations", h: "https://emilkowal.ski/ui/great-animations" }, DECISIONS] },
  { id: "m3", nom: "3", titre: "Chaque durée sait où elle va",
    enonce: "Quatre durées, chacune avec son emploi écrit : 100 bouton, survol, appui · 200 menu, infobulle, dépliant · 300 tiroir, fenêtre, panneau · 700 arrivée d'une section au défilement. Une durée employée hors de sa table est une faute, ou une chorégraphie déclarée sur sa ligne.",
    src: [{ t: "Emil Kowalski — 7 Practical Animation Tips", h: "https://emilkowal.ski/ui/practical-animation-tips" }, DECISIONS] },
  { id: "m4", nom: "4", titre: "Une valeur qu'on fait glisser ne s'anime pas",
    enonce: "Pendant qu'une molette est tenue, les objets qu'elle règle n'ont aucune transition sur la propriété réglée : ils sont à la valeur, à l'image près. Sinon la scène traîne derrière le doigt et le lecteur regarde l'animation au lieu du nombre.",
    src: [{ t: "Verdict d'Auteur du 2 septembre 2026 — « une molette ne repeint que sa scène »", h: "#" }, DECISIONS] },
  { id: "m5", nom: "5", titre: "Deux propriétés animables, pas trois",
    enonce: "Un mouvement anime le déplacement (transform, translate, scale) et la transparence. Jamais une largeur, une hauteur, une marge ni une position : elles recalculent la mise en page à chaque image.",
    src: [{ t: "Emil Kowalski — Great Animations", h: "https://emilkowal.ski/ui/great-animations" }, { t: "MDN — Animation performance and frame rate", h: "https://developer.mozilla.org/docs/Web/Performance/Guides/Animation_performance_and_frame_rate" }] },
  { id: "m6", nom: "6", titre: "Un objet s'ouvre depuis son déclencheur",
    enonce: "Le point d'origine d'un menu, d'une infobulle ou d'un panneau est le bouton qui l'a appelé : transform-origin sur le coin qui touche le déclencheur, jamais le centre.",
    src: [{ t: "Emil Kowalski — Great Animations (« origin-aware »)", h: "https://emilkowal.ski/ui/great-animations" }] },
  { id: "m7", nom: "7", titre: "Rien ne naît du néant",
    enonce: "Un objet qui entre part de presque sa taille (0,95) avec un fondu — jamais d'une taille nulle. Un objet réel ne surgit pas, il grandit depuis presque là où il sera.",
    src: [FONDS] },
  { id: "m8", nom: "8", titre: "Une transition, jamais une image-clé, dès qu'on peut interrompre",
    enonce: "Un état qu'on peut quitter en cours de route (ouvrir puis refermer aussitôt) se joue en transition : elle change de destination sans repartir de zéro. Les images-clés ne s'interrompent pas.",
    src: [{ t: "Emil Kowalski — Building a Toast Component (Sonner)", h: "https://emilkowal.ski/ui/building-a-toast-component" }] },
  { id: "m9", nom: "9", titre: "L'appui répond",
    enonce: "Une vraie commande s'enfonce légèrement (0,97) pendant qu'on la tient, au cran rapide ; le relâchement est immédiat. C'est le retour le moins cher de toute l'interface.",
    src: [FONDS, { t: "Passe du 4 septembre 2026 sur les pages du kit", h: "#" }] },
  { id: "m10", nom: "10", titre: "La fréquence décide, pas le goût",
    enonce: "Ce qu'on fait cent fois par jour ne s'anime pas — un raccourci clavier, une ligne de liste, la sélection d'un onglet. Trois motifs seulement justifient un mouvement : expliquer, répondre, réjouir.",
    src: [{ t: "Emil Kowalski — You Don't Need Animations", h: "https://emilkowal.ski/ui/you-dont-need-animations" }] },
];
function Regles({ ids }: { ids: string[] }) {
  return (
    <div className="mv-regles">
      {ids.map((id) => REGLES.find((r) => r.id === id)!).map((r) => (
        <div key={r.id} className="mv-regle">
          <b><span className="badge">règle {r.nom}</span> {r.titre}</b>
          <span>{r.enonce}</span>
          <span className="mv-regle-src">Sources : {r.src.map((sc, i) => (
            <span key={sc.t}>{i > 0 && " · "}{sc.h === "#" ? sc.t : <a href={sc.h}>{sc.t}</a>}</span>
          ))}</span>
        </div>
      ))}
    </div>
  );
}

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
  const scene = useRef<HTMLDivElement>(null);
  const [lu, setLu] = useState<{ duree: number; courbe: boolean } | null>(null);
  useEffect(() => {
    const bon = scene.current?.querySelector<HTMLElement>(".trace-panel.is-good .trace-moving");
    if (bon) setLu(auRepos(bon, (cs) => ({ duree: enMs(cs.transitionDuration.split(",")[0]), courbe: cs.transitionTimingFunction.split(/,(?![^(]*\))/)[0].trim() === MOUVEMENT.courbe })));
  }, []);
  return (
    <figure className="gd-figure">
      <div className="motion-demo trace-demo" ref={scene}>
        <div className="motion-demo-head">
          <b>Une carte passe de « À faire » à « Terminé »</b>
          <DemoButton onClick={move}>{run ? "Rejouer" : "Déplacer"}</DemoButton>
        </div>
        <div className="motion-compare">
          <TraceBoard good={false} right={right} run={run} />
          <TraceBoard good right={right} run={run} />
        </div>
      </div>
      <figcaption className="gd-legende">
        {lu ? `${lu.duree} ms${lu.courbe ? " sur la courbe du kit" : ""}, lus sur le rendu — le cran d'une section, parce que la carte change de zone` : "la même carte, un seul déplacement"}
        {lu && lu.duree === 0 ? " · mouvement réduit : elle saute, et c'est voulu" : ""}
      </figcaption>
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
  const scene = useRef<HTMLDivElement>(null);
  const [lu, setLu] = useState<{ duree: number; origines: string[] } | null>(null);
  useEffect(() => {
    const menus = Array.from(scene.current?.querySelectorAll<HTMLElement>(".origin-menu") ?? []);
    if (menus.length === 2) setLu({ duree: enMs(getComputedStyle(menus[1]).transitionDuration.split(",")[0]),
      origines: menus.map((m) => { const o = getComputedStyle(m).transformOrigin.split(" ").map(parseFloat); return o[0] === 0 && o[1] === 0 ? "le coin du bouton" : "son propre centre"; }) });
  }, []);
  return (
    <figure className="gd-figure">
      <div className="motion-demo cause-demo" ref={scene}>
        <div className="motion-demo-head">
          <b>Le même menu, deux points de départ</b>
          <DemoButton onClick={toggle}>{open ? "Fermer" : "Ouvrir"}</DemoButton>
        </div>
        <div className="motion-compare">
          <CausePanel good={false} open={open} toggle={toggle} />
          <CausePanel good open={open} toggle={toggle} />
        </div>
      </div>
      <figcaption className="gd-legende">
        {lu ? `${lu.duree} ms, le cran du panneau · point de départ lu sur le rendu : ${lu.origines[1]} / ${lu.origines[0]}` : "le même menu, un seul geste"}
      </figcaption>
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
  const scene = useRef<HTMLDivElement>(null);
  const [comptes, setComptes] = useState<number[] | null>(null);
  const update = () => setRun((value) => value + 1);
  /* comptées sur le rendu, une image après la mise à jour : combien de cartes s'animent de chaque côté */
  useEffect(() => {
    if (!run) return;
    const id = requestAnimationFrame(() => {
      const compte = (sel: string) => Array.from(scene.current?.querySelectorAll<HTMLElement>(`${sel} .gaze-card`) ?? []).filter((c) => getComputedStyle(c).animationName !== "none").length;
      setComptes([compte(".gaze-panel.is-bad"), compte(".gaze-panel.is-good")]);
    });
    return () => cancelAnimationFrame(id);
  }, [run]);
  return (
    <figure className="gd-figure">
      <div className="motion-demo gaze-demo" ref={scene}>
        <div className="motion-demo-head">
          <b>Une donnée change sur le tableau de bord</b>
          <DemoButton onClick={update}>{run ? "Changer encore" : "Mettre à jour"}</DemoButton>
        </div>
        <div className="motion-compare">
          <GazeBoard good={false} target={target} run={run} />
          <GazeBoard good target={target} run={run} />
        </div>
      </div>
      <figcaption className="gd-legende">
        {comptes ? (comptes[0] + comptes[1] ? `${comptes[0]} cartes animées d'un côté, ${comptes[1]} de l'autre — comptées sur le rendu · ${ms("expressive")} ms, le cran d'une arrivée` : "mouvement réduit : rien ne s'anime, la carte qui a changé est seulement étiquetée") : "huit cartes, une seule donnée change"}
      </figcaption>
    </figure>
  );
}

/* ══ Les règles qu'on peut casser : le juste et le faux côte à côte, un seul geste joue les deux, la tête de chaque côté est lue sur le rendu. ══ */
function Cote({ ok, dit, faux, children }: { ok: boolean; dit: string; faux?: boolean; children: React.ReactNode }) {
  return (
    <div className="mv-cote" data-intent={faux ? "statement" : undefined}>
      <p className="mv-verdict-tete"><span className={`verdict ${ok ? "bon" : "ko"}`} aria-hidden="true">{ok ? "✓" : "✗"}</span><span>{dit}</span></p>
      {children}
    </div>
  );
}

/* 1 · Le survol suit le curseur : la même rangée deux fois, et la durée que chacune prend. */
function BandeSurvol() {
  const scene = useRef<HTMLDivElement>(null);
  const [durees, setDurees] = useState<number[]>([]);
  useEffect(() => {
    if (!scene.current) return;
    setDurees(Array.from(scene.current.querySelectorAll<HTMLElement>(".mv-rangee")).map((r) => enMs(getComputedStyle(r.querySelector(".bouton")!).transitionDuration.split(",")[0])));
  }, []);
  const okDe = (d?: number) => d === undefined || d <= ms("fast");
  const dit = (d?: number) => d === undefined ? "" : okDe(d) ? `${d} ms — il suit le curseur` : `${d} ms — il poursuit le curseur`;
  const Rangee = () => (<><button type="button" className="bouton">Entendre</button><button type="button" className="bouton">Confronter</button><button type="button" className="bouton">Récuser</button></>);
  return (
    <div className="mv-duo" ref={scene}>
      <Cote ok={okDe(durees[0])} dit={dit(durees[0])}><div className="mv-rangee"><Rangee /></div></Cote>
      <Cote ok={okDe(durees[1])} faux dit={dit(durees[1])}><div className="mv-rangee lente"><Rangee /></div></Cote>
    </div>
  );
}

/* 2 · Un menu vit à 200 : deux menus, un seul geste — l'un au cran du menu, l'autre au cran d'une section. */
function BandeTraine() {
  const [ouvert, setOuvert] = useState(false);
  const scene = useRef<HTMLDivElement>(null);
  const [durees, setDurees] = useState<number[]>([]);
  useEffect(() => {
    if (!scene.current) return;
    setDurees(Array.from(scene.current.querySelectorAll<HTMLElement>(".mv-menu")).map((m) => enMs(getComputedStyle(m).transitionDuration.split(",")[0])));
  }, []);
  const okDe = (d?: number) => d === undefined || d <= ms("base");
  const dit = (d?: number) => d === undefined ? "" : okDe(d) ? `${d} ms — il est là quand on le veut` : `${d} ms — on l'attend`;
  const Menu = ({ traine }: { traine?: boolean }) => (
    <div className="mv-scene-menu">
      <button type="button" className="bouton" aria-expanded={ouvert} onClick={() => setOuvert(!ouvert)}>Actions du témoin</button>
      <div className={`mv-menu${traine ? " traine" : ""}${ouvert ? " ouvert" : ""}`} role="menu" aria-hidden={!ouvert}>
        <span className="mv-menu-item" role="menuitem">Entendre à nouveau</span>
        <span className="mv-menu-item" role="menuitem">Confronter</span>
        <span className="mv-menu-item danger" role="menuitem">Récuser</span>
      </div>
    </div>
  );
  return (
    <div className="mv-duo" ref={scene}>
      <Cote ok={okDe(durees[0])} dit={dit(durees[0])}><Menu /></Cote>
      <Cote ok={okDe(durees[1])} faux dit={dit(durees[1])}><Menu traine /></Cote>
    </div>
  );
}

/* 3 · Rien ne naît du néant : deux notifications, un seul geste. */
function Toast({ classe, la }: { classe?: string; la: boolean }) {
  return (
    <div className={`mv-toast${classe ? ` ${classe}` : ""}${la ? " la" : ""}`} role="status" aria-hidden={!la}>
      <span className="point" aria-hidden="true" />Verdict enregistré
    </div>
  );
}
function BandeNeant() {
  const [la, setLa] = useState(false);
  const scene = useRef<HTMLDivElement>(null);
  const [departs, setDeparts] = useState<(number | null)[]>([]);
  useEffect(() => {
    if (!scene.current) return;
    setDeparts(Array.from(scene.current.querySelectorAll<HTMLElement>(".mv-toast")).map((t) => auRepos(t, (cs) => (cs.scale === "none" ? null : parseFloat(cs.scale)))));
  }, []);
  const notifier = () => { setLa(false); requestAnimationFrame(() => requestAnimationFrame(() => setLa(true))); };
  const okDe = (d?: number | null) => d === undefined || d === null || d > 0;
  const dit = (d?: number | null) => d === undefined ? "" : d === null ? "elle apparaît à sa taille" : d > 0 ? `elle part de ${dec(d)} — presque sa taille` : "elle part de 0 — elle surgit du néant";
  return (
    <div className="mv-scene">
      <div className="mv-duo" ref={scene}>
        <Cote ok={okDe(departs[0])} dit={dit(departs[0])}><div className="mv-scene-toast"><Toast la={la} /></div></Cote>
        <Cote ok={okDe(departs[1])} faux dit={dit(departs[1])}><div className="mv-scene-toast"><Toast classe="neant" la={la} /></div></Cote>
      </div>
      <button type="button" className="bouton" onClick={notifier}>Notifier</button>
    </div>
  );
}

/* 4 · Moins de mouvement, pas aucun : ce que voit quelqu'un qui a demandé
   moins de mouvement — notre règle à gauche (le fondu reste), l'ancienne à
   droite (tout coupé : elle surgit sans passage). Les deux scènes simulent
   le réglage système ; le site, lui, y obéit par ses portillons. */
function BandeReduit() {
  const [la, setLa] = useState(false);
  const scene = useRef<HTMLDivElement>(null);
  const [lus, setLus] = useState<{ props: string; duree: number }[]>([]);
  useEffect(() => {
    if (!scene.current) return;
    setLus(Array.from(scene.current.querySelectorAll<HTMLElement>(".mv-toast")).map((t) => auRepos(t, (cs) => ({ props: cs.transitionProperty, duree: enMs(cs.transitionDuration.split(",")[0]) }))));
  }, []);
  const notifier = () => { setLa(false); requestAnimationFrame(() => requestAnimationFrame(() => setLa(true))); };
  const dit = (l?: { props: string; duree: number }) => l === undefined ? "" : l.duree === 0 ? "tout coupé : elle surgit sans passage" : /translate|scale/.test(l.props) ? "elle monte et grandit en apparaissant" : `le fondu reste (${l.duree} ms), le déplacement est parti`;
  return (
    <div className="mv-scene">
      <div className="mv-duo" ref={scene}>
        <Cote ok={lus[0] === undefined || lus[0].duree > 0} dit={dit(lus[0])}><div className="mv-scene-toast mv-reduit"><Toast la={la} /></div></Cote>
        <Cote ok={lus[1] === undefined || lus[1].duree > 0} faux dit={dit(lus[1])}><div className="mv-scene-toast mv-coupe"><Toast la={la} /></div></Cote>
      </div>
      <button type="button" className="bouton" onClick={notifier}>Notifier</button>
    </div>
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
    dit: "Un mouvement anime le déplacement et la transparence. Jamais une largeur, une hauteur ni une marge : elles recalculent la page à chaque image.",
    ou: "dans le code" },
  { nom: "Aucune durée écrite à la main",
    dit: "Une transition ou une animation prend un jeton du moteur — ou dit « chorégraphie » sur sa ligne. Le moteur relit toutes les feuilles.",
    ou: "dans le code" },
  { nom: "Un déplacement vit sous son portillon",
    dit: "Transform, translate, scale, rotate et le défilement doux ne s'écrivent que sous « no-preference ». Un fondu s'écrit nu. Le mouvement réduit est vrai par construction.",
    ou: "dans le code" },
  { nom: "Une transition, jamais une image-clé, dès qu'on peut interrompre",
    dit: "Ouvrir puis refermer aussitôt : une transition rebrousse chemin là où elle est ; une image-clé repart de zéro. L'appui, lui, est une animation — il ne s'interrompt pas, il se termine.",
    ou: "dans le code" },
  { nom: "Une chorégraphie se déclare et se date",
    dit: "Une durée à la main n'existe que sur une ligne qui la déclare, avec le verdict qui l'autorise — le film de Rythme, l'entrée de l'accueil, le côté faute du regard.",
    ou: "dans le code" },
  { nom: "Une valeur qu'on fait glisser ne s'anime pas",
    dit: "Pendant qu'une molette est tenue, ce qu'elle règle est à la valeur, à l'image près. Sinon la scène traîne derrière le doigt et on regarde l'animation au lieu du nombre.",
    ou: "sur l'écran allumé", ton: "rendu" },
  { nom: "L'appui répond, le focus ne s'anime pas",
    dit: "Chaque vraie commande s'enfonce à 0,97 pendant qu'on la tient, au cran rapide. L'anneau de focus, lui, apparaît d'un coup : au clavier, on veut savoir où l'on est.",
    ou: "sur l'écran allumé", ton: "rendu" },
  { nom: "Ce qu'on fait cent fois par jour ne s'anime pas",
    dit: "Un raccourci, une ligne de liste, un onglet : la fréquence décide. Trois motifs seulement justifient un mouvement — expliquer, répondre, réjouir.",
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
            <p className="kicker">Le mouvement</p>
            <h1>Le mouvement garde le fil<span className="point" aria-hidden="true" /></h1>
            <p className="chapo">
              Un mouvement dure une fraction de seconde : on ne le regarde pas, on le subit. Il aide à
              comprendre ce qui vient de changer — ou il dérange. Trois règles font la différence, et
              quatre durées, <b>une</b> courbe, les font tenir.
            </p>
          </section>

          {/* ══════════ 01 · la trace ══════════ */}
          <section className="gdoc-sec pose" id="trace">
            <div className="gdoc-sec-tete">
              <p className="kicker">01 · La trace</p>
              <h2>Ce qui change reste le même objet</h2>
              <p className="sourd">Quand un objet change de place ou d&apos;état d&apos;un coup, l&apos;œil doit
              reconstruire ce qui s&apos;est passé. S&apos;il le voit se déplacer, il n&apos;a rien à reconstruire.</p>
            </div>
            <div className="gdoc-corps">
              <TraceDemo />
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <p><b>Observation.</b> L&apos;œil suit un objet qui se déplace ; il perd un objet qui saute. Quand
                une carte disparaît d&apos;une colonne et réapparaît dans l&apos;autre, rien ne dit que c&apos;est la
                même — il faut la relire pour s&apos;en assurer.</p>
                <p><b>Règle.</b> Un changement d&apos;état déplace ou transforme le même objet ; il ne le remplace
                pas. Un déplacement s&apos;écrit en transition, jamais en image-clé, pour pouvoir être
                interrompu ; il n&apos;anime que la position et la transparence, jamais la taille de la boîte.
                Exception : quand l&apos;état d&apos;après n&apos;a plus rien à voir avec l&apos;état d&apos;avant — changer
                de page — le fondu suffit.</p>
                <p><b>Réglage FILI.</b> Un objet qui change de zone prend le cran d&apos;une section, {ms("expressive")} ms ;
                un déplacement local, {ms("slow")}. Sous mouvement réduit, il saute — le fondu reste.</p>
                <Regles ids={["m5", "m8", "m1"]} />
              </div></details>
            </div>
          </section>

          {/* ══════════ 02 · la cause ══════════ */}
          <section className="gdoc-sec pose" id="cause">
            <div className="gdoc-sec-tete">
              <p className="kicker">02 · La cause</p>
              <h2>Tout mouvement part de quelque part</h2>
              <p className="sourd">Un menu, un panneau, une infobulle appartiennent à ce qui les a ouverts.
              Leur point de départ le dit — ou le cache.</p>
            </div>
            <div className="gdoc-corps">
              <CauseDemo />
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <p><b>Observation.</b> Devant un objet qui apparaît, on cherche d&apos;où il vient. S&apos;il grandit
                depuis le bouton qu&apos;on vient de presser, la question ne se pose pas. S&apos;il surgit ailleurs,
                on le rattache à rien.</p>
                <p><b>Règle.</b> Un objet appelé grandit depuis le coin qui touche son déclencheur, de presque
                sa taille ({dec(0.95)}), avec un fondu. Nuance : un objet que personne n&apos;a appelé — une
                notification — part du bord de l&apos;écran qui la porte, pas d&apos;un bouton.</p>
                <p><b>Réglage FILI.</b> Un menu ou une infobulle : {ms("base")} ms. Un panneau ou une fenêtre :
                {" "}{ms("slow")}. Toujours la même courbe.</p>
                <Regles ids={["m6", "m7", "m3"]} />
              </div></details>
            </div>
          </section>

          {/* ══════════ 03 · le regard ══════════ */}
          <section className="gdoc-sec pose" id="regard">
            <div className="gdoc-sec-tete">
              <p className="kicker">03 · Le regard</p>
              <h2>Un seul changement prend la lumière</h2>
              <p className="sourd">Le mouvement attire l&apos;œil. Il ne peut le faire que pour une chose à la fois.</p>
            </div>
            <div className="gdoc-corps">
              <GazeDemo />
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <p><b>Observation.</b> Plusieurs mouvements en même temps s&apos;annulent : l&apos;œil ne va nulle
                part, et ce qui a changé se perd dans ce qui a bougé.</p>
                <p><b>Règle.</b> Une mise à jour n&apos;anime que ce qui a changé ; le reste ne bouge pas. Nuance :
                une liste qui se réordonne peut déplacer plusieurs lignes, parce que c&apos;est un seul
                changement — et c&apos;est précisément la trace de chaque ligne qu&apos;on protège.</p>
                <p><b>Réglage FILI.</b> Une donnée qui change se signale au cran d&apos;une arrivée,
                {" "}{ms("expressive")} ms. Un décalage entre plusieurs objets n&apos;existe que s&apos;il explique un
                ordre ; sinon, tout part en même temps. Ce qu&apos;on fait cent fois par jour ne s&apos;anime pas.</p>
                <Regles ids={["m10", "m3", "m2"]} />
              </div></details>
            </div>
          </section>

          {/* ══════════ 04 · les règles qu'on peut casser ══════════ */}
          <section className="gdoc-sec pose" id="casser">
            <div className="gdoc-sec-tete">
              <p className="kicker">04 · Les règles qu&apos;on peut casser</p>
              <h2>Voyez ce qui se passe quand la règle saute</h2>
              <p className="sourd">Aucune de ces fautes ne déclenche d&apos;erreur. Elles se sentent avant de se
              voir. Alors le juste et le faux jouent côte à côte, au même instant, et chaque côté lit ce
              qu&apos;il joue.</p>
            </div>
            <div className="gdoc-corps">
              <Bandes>
                <Bande nom="Le survol suit le curseur" cote={`${ms("fast")} ms`} nue
                  dit="Un retour au survol se joue en cent millisecondes. Au-delà, la couleur poursuit le curseur au lieu de le suivre — et la page a l'air de réfléchir à chaque geste."
                  regles={<Regles ids={["m3", "m9"]} />}>
                  <BandeSurvol />
                </Bande>
                <Bande nom="Un menu vit à 200" cote={`${ms("base")} ms`} nue
                  dit="Ce qu'on ouvre des dizaines de fois par jour ne se fait pas attendre. Le même menu au cran d'une section, 700 ms, est à peine plus beau — et cent fois plus long."
                  regles={<Regles ids={["m3", "m10"]} />}>
                  <BandeTraine />
                </Bande>
                <Bande nom="Rien ne naît du néant" cote={`de ${dec(0.95)} à 1`} nue
                  dit="Une notification qui arrive part de presque sa taille, avec un fondu. Partie de zéro, elle surgit comme un objet qui n'existait pas une image plus tôt."
                  regles={<Regles ids={["m7"]} />}>
                  <BandeNeant />
                </Bande>
                <Bande nom="Moins de mouvement, pas aucun" cote="les fondus restent" nue
                  dit="Quelqu'un qui a demandé moins de mouvement à son système ne veut pas d'objets qui se déplacent. Il a toujours besoin de savoir qu'une chose est arrivée : le fondu reste. Notre ancienne règle coupait tout."
                  regles={<Regles ids={["m1"]} />}>
                  <BandeReduit />
                </Bande>
              </Bandes>
            </div>
          </section>

          {/* ══════════ 05 · les règles qu'on ne peut pas montrer ══════════ */}
          <section className="gdoc-sec pose" id="invisibles">
            <div className="gdoc-sec-tete">
              <p className="kicker">05 · Les règles qu&apos;on ne peut pas montrer</p>
              <h2>Elles se vérifient ailleurs — et on vous dit où</h2>
              <p className="sourd">Certaines règles ne se photographient pas — le mouvement moins que les
              autres. Elles se vérifient dans le code, à l&apos;écran allumé, ou nulle part du tout.</p>
            </div>
            <div className="gdoc-corps">
              <ListeRegles lignes={LISTE} />
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <Regles ids={["m5", "m8", "m4", "m9", "m10"]} />
              </div></details>
            </div>
          </section>

          {/* ══════════ 06 · dans le code ══════════ */}
          <section className="gdoc-sec pose" id="code">
            <div className="gdoc-sec-tete">
              <p className="kicker">06 · Dans le code</p>
              <h2>Quatre durées, une courbe</h2>
              <p className="sourd">Chaque valeur ci-dessous est lue au moteur, jamais recopiée. Une durée qui
              n&apos;est pas dans cette table est une faute — ou une chorégraphie, qui se déclare.</p>
            </div>
            <div className="gdoc-corps">
              <PanneauRegistre lignes={CODE} />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
