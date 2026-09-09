"use client";

import { useEffect, useRef, useState } from "react";
import { RailDoc, useDocSections, type Toc } from "../rail";
import { Bands, Band, Demo, DemoSides, DemoSide, ListRules, PanelRegistry } from "../levels";
import type { LineList, LineCode } from "../levels";
import { MOTION } from "../../derivation.mjs";
import "./motion.css";

/* ══════════════════════════════════════════════════════════════════════
   /mouvement — trois règles en trois comparaisons (la trace, la cause, le
   regard), puis le répertoire au gabarit des autres pages : les règles
   qu'on peut casser (quatre paires, un seul geste joue les deux côtés, la
   tête de chaque côté est lue sur le rendu), celles qu'on ne peut pas
   montrer (en liste), et le code (lu au moteur). Page reprise le 8
   septembre 2026 sur les instructions d'Auteur : la densité d'un chapitre,
   l'impact d'une démonstration. Les valeurs sont LUES, jamais décrétées.
   ══════════════════════════════════════════════════════════════════════ */
const TOC: Toc = [
  ["trace", "01", "La trace"],
  ["cause", "02", "La cause"],
  ["gaze", "03", "Le regard"],
  ["registry", "04", "Le registre"],
  ["code", "05", "Le code"],
];
type Step = keyof typeof MOTION.durations;
const ms = (c: Step) => MOTION.durations[c].ms;
const use = (c: Step) => MOTION.durations[c].use;
const dec = (v: number) => String(Math.round(v * 100) / 100).replace(".", ",");
const inMs = (s: string) => { const v = parseFloat(s); return s.trim().endsWith("ms") ? v : v * 1000; };
/* Lire un objet AU REPOS : pendant qu'une transition court, la valeur calculée
   est celle de l'image en cours, pas celle de la règle. On lit un jumeau posé
   un instant à côté, sans son état ouvert, puis retiré. */
function atRest<T>(el: HTMLElement, read: (cs: CSSStyleDeclaration) => T): T {
  const twin = el.cloneNode(false) as HTMLElement;
  twin.removeAttribute("id"); twin.classList.remove("open", "there");
  twin.style.visibility = "hidden"; twin.setAttribute("aria-hidden", "true");
  el.parentElement?.appendChild(twin);
  try { return read(getComputedStyle(twin)); } finally { twin.remove(); }
}

/* ── Les règles et leurs sources, lues sous chaque preuve ── */
type Src = { t: string; h: string };
const DECISIONS: Src = { t: "Décisions du 3 septembre 2026, sur pièce (les trois lois)", h: "#" };
const BACKGROUNDS: Src = { t: "Fonds Emil Kowalski (Linear, Sonner, Vaul) — emilkowal.ski", h: "https://emilkowal.ski/" };
const RULES: { id: string; name: string; heading: string; statement: string; src: Src[] }[] = [
  { id: "m1", name: "1", heading: "Moins de mouvement ne veut pas dire aucun mouvement",
    statement: "Sous prefers-reduced-motion: reduce, aucune transition ni animation ne porte transform, translate, scale, rotate ni de défilement doux ; les transitions d'opacité et de couleur restent admises. Le réglage vise les troubles vestibulaires, provoqués par du mouvement dans l'espace — pas par un fondu.",
    src: [{ t: "WCAG 2.3.3 — Animation from Interactions", h: "https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html" }, { t: "WCAG 2.2.2 — Pause, Stop, Hide", h: "https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html" }, { t: "MDN — prefers-reduced-motion", h: "https://developer.mozilla.org/docs/Web/CSS/@media/prefers-reduced-motion" }, DECISIONS] },
  { id: "m2", name: "2", heading: "La courbe du kit est la sienne",
    statement: "Ce qui entre et ce qui sort décélère, sur une courbe choisie — jamais une courbe livrée d'origine, jamais une accélération finale sur de l'interface. Une seule courbe au registre : --e-out.",
    src: [{ t: "Emil Kowalski — Great Animations", h: "https://emilkowal.ski/ui/great-animations" }, DECISIONS] },
  { id: "m3", name: "3", heading: "Chaque durée sait où elle va",
    statement: "Quatre durées, chacune avec son emploi écrit : 100 bouton, survol, appui · 200 menu, infobulle, dépliant · 300 drawer, fenêtre, panneau · 700 arrivée d'une section au défilement. Une durée employée hors de sa table est une faute, ou une chorégraphie déclarée sur sa ligne.",
    src: [{ t: "Emil Kowalski — 7 Practical Animation Tips", h: "https://emilkowal.ski/ui/practical-animation-tips" }, DECISIONS] },
  { id: "m4", name: "4", heading: "Une valeur qu'on fait glisser ne s'anime pas",
    statement: "Pendant qu'une molette est tenue, les objets qu'elle règle n'ont aucune transition sur la propriété réglée : ils sont à la valeur, à l'image près. Sinon la scène traîne derrière le doigt et le lecteur regarde l'animation au lieu du nombre.",
    src: [{ t: "Verdict d'Auteur du 2 septembre 2026 — « une molette ne repeint que sa scène »", h: "#" }, DECISIONS] },
  { id: "m5", name: "5", heading: "Deux propriétés animables, pas trois",
    statement: "Un mouvement anime le déplacement (transform, translate, scale) et la transparence. Jamais une largeur, une hauteur, une marge ni une position : elles recalculent la mise en page à chaque image.",
    src: [{ t: "Emil Kowalski — Great Animations", h: "https://emilkowal.ski/ui/great-animations" }, { t: "MDN — Animation performance and frame rate", h: "https://developer.mozilla.org/docs/Web/Performance/Guides/Animation_performance_and_frame_rate" }] },
  { id: "m6", name: "6", heading: "Un objet s'ouvre depuis son déclencheur",
    statement: "Le point d'origine d'un menu, d'une infobulle ou d'un panneau est le bouton qui l'a appelé : transform-origin sur le coin qui touche le déclencheur, jamais le centre.",
    src: [{ t: "Emil Kowalski — Great Animations (« origin-aware »)", h: "https://emilkowal.ski/ui/great-animations" }] },
  { id: "m7", name: "7", heading: "Rien ne naît du néant",
    statement: "Un objet qui entre part de presque sa taille (0,95) avec un fondu — jamais d'une taille nulle. Un objet réel ne surgit pas, il grandit depuis presque là où il sera.",
    src: [BACKGROUNDS] },
  { id: "m8", name: "8", heading: "Une transition, jamais une image-clé, dès qu'on peut interrompre",
    statement: "Un état qu'on peut quitter en cours de route (ouvrir puis refermer aussitôt) se joue en transition : elle change de destination sans repartir de zéro. Les images-clés ne s'interrompent pas.",
    src: [{ t: "Emil Kowalski — Building a Toast Component (Sonner)", h: "https://emilkowal.ski/ui/building-a-toast-component" }] },
  { id: "m9", name: "9", heading: "L'appui répond",
    statement: "Une vraie commande s'enfonce légèrement (0,97) pendant qu'on la tient, au cran rapide ; le relâchement est immédiat. C'est le retour le moins cher de toute l'interface.",
    src: [BACKGROUNDS, { t: "Passe du 4 septembre 2026 sur les pages du kit", h: "#" }] },
  { id: "m10", name: "10", heading: "La fréquence décide, pas le goût",
    statement: "Ce qu'on fait cent fois par jour ne s'anime pas — un raccourci clavier, une ligne de liste, la sélection d'un onglet. Trois motifs seulement justifient un mouvement : expliquer, répondre, réjouir.",
    src: [{ t: "Emil Kowalski — You Don't Need Animations", h: "https://emilkowal.ski/ui/you-dont-need-animations" }] },
];
function Rules({ ids }: { ids: string[] }) {
  return (
    <div className="mv-rules">
      {ids.map((id) => RULES.find((r) => r.id === id)!).map((r) => (
        <div key={r.id} className="mv-rule">
          <b><span className="badge">règle {r.name}</span> {r.heading}</b>
          <span>{r.statement}</span>
          <span className="mv-rule-src">Sources : {r.src.map((sc, i) => (
            <span key={sc.t}>{i > 0 && " · "}{sc.h === "#" ? sc.t : <a href={sc.h}>{sc.t}</a>}</span>
          ))}</span>
        </div>
      ))}
    </div>
  );
}


const Check = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="m3.2 8.1 3 3.05 6.6-6.55" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

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
    <article className={`motion-panel trace-panel ${good ? "is-good" : "is-bad"}`}>
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
  const [read, setRead] = useState<{ duration: number; curve: boolean } | null>(null);
  useEffect(() => {
    const good = scene.current?.querySelector<HTMLElement>(".trace-panel.is-good .trace-moving");
    if (good) setRead(atRest(good, (cs) => ({ duration: inMs(cs.transitionDuration.split(",")[0]), curve: cs.transitionTimingFunction.split(/,(?![^(]*\))/)[0].trim() === MOTION.curve })));
  }, []);
  return (
    <div className="motion-demo trace-demo" ref={scene}>
      <Demo situation="Une carte passe de « À faire » à « Terminé »"
        action={{ label: run ? "Rejouer" : "Déplacer", onClick: move }}
        caption={<>
          {read ? `${read.duration} ms${read.curve ? " sur la courbe du kit" : ""}, lus sur le rendu — le cran d'une section, parce que la carte change de zone` : "la même carte, un seul déplacement"}
          {read && read.duration === 0 ? " · mouvement réduit : elle saute, et c'est voulu" : ""}
        </>}>
        <DemoSides>
          <DemoSide ok={false} verdict="La carte disparaît, une autre paraît"><TraceBoard good={false} right={right} run={run} /></DemoSide>
          <DemoSide ok verdict="La carte se déplace"><TraceBoard good right={right} run={run} /></DemoSide>
        </DemoSides>
      </Demo>
    </div>
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
    <article className={`motion-panel origin-panel ${good ? "is-good" : "is-bad"} ${open ? "is-open" : ""}`}>
      <div className="origin-stage">
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
  const [read, setRead] = useState<{ duration: number; origins: string[] } | null>(null);
  useEffect(() => {
    const menus = Array.from(scene.current?.querySelectorAll<HTMLElement>(".origin-menu") ?? []);
    if (menus.length === 2) setRead({ duration: inMs(getComputedStyle(menus[1]).transitionDuration.split(",")[0]),
      origins: menus.map((m) => { const o = getComputedStyle(m).transformOrigin.split(" ").map(parseFloat); return o[0] === 0 && o[1] === 0 ? "le coin du bouton" : "son propre centre"; }) });
  }, []);
  return (
    <div className="motion-demo cause-demo" ref={scene}>
      <Demo situation="Le même menu, deux points de départ"
        action={{ label: open ? "Fermer" : "Ouvrir", onClick: toggle }}
        caption={read ? `${read.duration} ms, le cran du panneau · point de départ lu sur le rendu : ${read.origins[1]} / ${read.origins[0]}` : "le même menu, un seul geste"}>
        <DemoSides>
          <DemoSide ok={false} verdict="Le menu sort de nulle part"><CausePanel good={false} open={open} toggle={toggle} /></DemoSide>
          <DemoSide ok verdict="Le menu sort de son bouton"><CausePanel good open={open} toggle={toggle} /></DemoSide>
        </DemoSides>
      </Demo>
    </div>
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
    <article className={`motion-panel gaze-panel ${good ? "is-good" : "is-bad"}`}>
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
  const [counts, setCounts] = useState<number[] | null>(null);
  const update = () => setRun((value) => value + 1);
  /* comptées sur le rendu, une image après la mise à jour : combien de cartes s'animent de chaque côté */
  useEffect(() => {
    if (!run) return;
    const id = requestAnimationFrame(() => {
      const count = (sel: string) => Array.from(scene.current?.querySelectorAll<HTMLElement>(`${sel} .gaze-card`) ?? []).filter((c) => getComputedStyle(c).animationName !== "none").length;
      setCounts([count(".gaze-panel.is-bad"), count(".gaze-panel.is-good")]);
    });
    return () => cancelAnimationFrame(id);
  }, [run]);
  return (
    <div className="motion-demo gaze-demo" ref={scene}>
      <Demo situation="Une donnée change sur le tableau de bord"
        action={{ label: run ? "Changer encore" : "Mettre à jour", onClick: update }}
        caption={counts ? (counts[0] + counts[1] ? `${counts[0]} cartes animées d'un côté, ${counts[1]} de l'autre — comptées sur le rendu · ${ms("expressive")} ms, le cran d'une arrivée` : "mouvement réduit : rien ne s'anime, la carte qui a changé est seulement étiquetée") : "huit cartes, une seule donnée change"}>
        <DemoSides>
          <DemoSide ok={false} verdict="Les huit cartes bougent"><GazeBoard good={false} target={target} run={run} /></DemoSide>
          <DemoSide ok verdict="Seule la carte qui change bouge"><GazeBoard good target={target} run={run} /></DemoSide>
        </DemoSides>
      </Demo>
    </div>
  );
}

/* ══ Les règles qu'on peut casser, dans le cadre des démonstrations (verdict
   d'Auteur, 9 septembre) : le faux à gauche, le juste à droite, un seul geste
   dans la tête joue les deux côtés, et le verdict de chaque côté est LU sur le
   rendu. Le ralenti est écrit sous le cadre. ══ */
const SLOWED_PAIRS = 3; /* chorégraphie : chaque paire joue trois fois plus lentement, et le dit ; les verdicts lus divisent par trois */
function Scene({ situation, action, scene, children }: {
  situation: string; action?: { label: string; onClick: () => void }; scene: React.RefObject<HTMLDivElement>; children: React.ReactNode;
}) {
  return (
    <div className="mv-scene" style={{ "--mv-slowed": SLOWED_PAIRS } as React.CSSProperties} ref={scene}>
      <Demo situation={situation} action={action} caption={<span className="mv-slowed" aria-hidden="true">ralenti ×{SLOWED_PAIRS}</span>}>
        <DemoSides>{children}</DemoSides>
      </Demo>
    </div>
  );
}
/* Les deux côtés sont lus dans l'ordre du document : le faux d'abord, puis le juste. */
const WRONG = 0, RIGHT = 1;

/* 1 · Le survol suit le curseur : la même rangée deux fois, et la durée que chacune prend.
   Pas de geste scripté (retour d'Auteur, 9 septembre) : le lecteur balaie lui-même
   une rangée de petits boutons, et la rangée lente traîne derrière son curseur. */
const HOVER_ROW = ["Entendre", "Confronter", "Récuser", "Ajourner", "Classer", "Notifier"];
function HoverRow({ slow }: { slow?: boolean }) {
  return (
    <div className={`mv-row${slow ? " slow" : ""}`} aria-hidden="true">
      {HOVER_ROW.map((l) => <span key={l} className="button">{l}</span>)}
    </div>
  );
}
function BandHover() {
  const scene = useRef<HTMLDivElement>(null);
  const [durations, setDurations] = useState<number[]>([]);
  useEffect(() => {
    if (!scene.current) return;
    setDurations(Array.from(scene.current.querySelectorAll<HTMLElement>(".mv-row")).map((r) => inMs(getComputedStyle(r.querySelector(".button")!).transitionDuration.split(",")[0]) / SLOWED_PAIRS));
  }, []);
  const okOf = (d?: number) => d === undefined || d <= ms("fast");
  const says = (d?: number) => d === undefined ? "" : okOf(d) ? `${d} ms — il suit le curseur` : `${d} ms — il poursuit le curseur`;
  return (
    <Scene situation="Le curseur balaie une rangée de boutons" scene={scene}>
      <DemoSide ok={okOf(durations[WRONG])} verdict={says(durations[WRONG])}><HoverRow slow /></DemoSide>
      <DemoSide ok={okOf(durations[RIGHT])} verdict={says(durations[RIGHT])}><HoverRow /></DemoSide>
    </Scene>
  );
}

/* 2 · Un menu vit à 200 : deux menus, un seul geste — l'un au cran du menu, l'autre au cran d'une section. */
function BandDrags() {
  const [open, setOpen] = useState(false);
  const scene = useRef<HTMLDivElement>(null);
  const [durations, setDurations] = useState<number[]>([]);
  useEffect(() => {
    if (!scene.current) return;
    setDurations(Array.from(scene.current.querySelectorAll<HTMLElement>(".mv-menu")).map((m) => inMs(getComputedStyle(m).transitionDuration.split(",")[0]) / SLOWED_PAIRS));
  }, []);
  const okOf = (d?: number) => d === undefined || d <= ms("base");
  const says = (d?: number) => d === undefined ? "" : okOf(d) ? `${d} ms — il est là quand on le veut` : `${d} ms — on l'attend`;
  const Menu = ({ drags }: { drags?: boolean }) => (
    <div className="mv-scene-menu">
      <button type="button" className="button" aria-expanded={open} onClick={() => setOpen(!open)}>Actions du témoin</button>
      <div className={`mv-menu${drags ? " drags" : ""}${open ? " open" : ""}`} role="menu" aria-hidden={!open}>
        <span className="mv-menu-item" role="menuitem">Entendre à nouveau</span>
        <span className="mv-menu-item" role="menuitem">Confronter</span>
        <span className="mv-menu-item danger" role="menuitem">Récuser</span>
      </div>
    </div>
  );
  return (
    <Scene situation="Un menu, ouvert des dizaines de fois par jour" action={{ label: open ? "Fermer" : "Ouvrir", onClick: () => setOpen(!open) }} scene={scene}>
      <DemoSide ok={okOf(durations[WRONG])} verdict={says(durations[WRONG])}><Menu drags /></DemoSide>
      <DemoSide ok={okOf(durations[RIGHT])} verdict={says(durations[RIGHT])}><Menu /></DemoSide>
    </Scene>
  );
}

/* 3 · Rien ne naît du néant : deux notifications, un seul geste. */
function Toast({ cls, there }: { cls?: string; there: boolean }) {
  return (
    <div className={`mv-toast${cls ? ` ${cls}` : ""}${there ? " there" : ""}`} role="status" aria-hidden={!there}>
      <span className="point" aria-hidden="true" />Verdict enregistré
    </div>
  );
}
function BandNothing() {
  const [there, setThere] = useState(false);
  const scene = useRef<HTMLDivElement>(null);
  const [begins, setBegins] = useState<(number | null)[]>([]);
  useEffect(() => {
    if (!scene.current) return;
    setBegins(Array.from(scene.current.querySelectorAll<HTMLElement>(".mv-toast")).map((t) => atRest(t, (cs) => (cs.scale === "none" ? null : parseFloat(cs.scale)))));
  }, []);
  const notify = () => { setThere(false); requestAnimationFrame(() => requestAnimationFrame(() => setThere(true))); };
  const okOf = (d?: number | null) => d === undefined || d === null || d > 0;
  const says = (d?: number | null) => d === undefined ? "" : d === null ? "elle apparaît à sa taille" : d > 0 ? `elle part de ${dec(d)} — presque sa taille` : "elle part de 0 — elle surgit du néant";
  return (
    <Scene situation="Une notification arrive" action={{ label: "Notifier", onClick: notify }} scene={scene}>
      <DemoSide ok={okOf(begins[WRONG])} verdict={says(begins[WRONG])}><div className="mv-scene-toast"><Toast cls="nothing" there={there} /></div></DemoSide>
      <DemoSide ok={okOf(begins[RIGHT])} verdict={says(begins[RIGHT])}><div className="mv-scene-toast"><Toast there={there} /></div></DemoSide>
    </Scene>
  );
}

/* 4 · Moins de mouvement, pas aucun : ce que voit quelqu'un qui a demandé
   moins de mouvement — notre règle à gauche (le fondu reste), l'ancienne à
   droite (tout coupé : elle surgit sans passage). Les deux scènes simulent
   le réglage système ; le site, lui, y obéit par ses portillons. */
function BandReduced() {
  const [there, setThere] = useState(false);
  const scene = useRef<HTMLDivElement>(null);
  const [readSet, setReadSet] = useState<{ props: string; duration: number }[]>([]);
  useEffect(() => {
    if (!scene.current) return;
    setReadSet(Array.from(scene.current.querySelectorAll<HTMLElement>(".mv-toast")).map((t) => atRest(t, (cs) => ({ props: cs.transitionProperty, duration: inMs(cs.transitionDuration.split(",")[0]) / SLOWED_PAIRS }))));
  }, []);
  const notify = () => { setThere(false); requestAnimationFrame(() => requestAnimationFrame(() => setThere(true))); };
  const says = (l?: { props: string; duration: number }) => l === undefined ? "" : l.duration === 0 ? "tout coupé : elle surgit sans passage" : /translate|scale/.test(l.props) ? "elle monte et grandit en apparaissant" : `le fondu reste (${l.duration} ms), le déplacement est parti`;
  const okOf = (l?: { duration: number }) => l === undefined || l.duration > 0;
  return (
    <Scene situation="La même notification, pour qui a demandé moins de mouvement" action={{ label: "Notifier", onClick: notify }} scene={scene}>
      <DemoSide ok={okOf(readSet[WRONG])} verdict={says(readSet[WRONG])}><div className="mv-scene-toast mv-cut"><Toast there={there} /></div></DemoSide>
      <DemoSide ok={okOf(readSet[RIGHT])} verdict={says(readSet[RIGHT])}><div className="mv-scene-toast mv-reduced"><Toast there={there} /></div></DemoSide>
    </Scene>
  );
}


/* ── Le répertoire : les valeurs sont LUES au moteur, jamais recopiées. ── */
const CODE: LineCode[] = [
  { rule: "Un bouton, un survol, un appui",
    written: <><span className="cs-kw">transition</span>: color <span className="cs-var">var(--m-fast)</span> <span className="cs-var">var(--e-out)</span></>,
    product: `${ms("fast")} ms`, note: use("fast") },
  { rule: "Un menu, une infobulle, un dépliant",
    written: <><span className="cs-kw">transition</span>: opacity <span className="cs-var">var(--m-base)</span> <span className="cs-var">var(--e-out)</span></>,
    product: `${ms("base")} ms`, note: use("base") },
  { rule: "Un drawer, une fenêtre, un panneau",
    written: <><span className="cs-kw">animation</span>: pose <span className="cs-var">var(--m-slow)</span> <span className="cs-var">var(--e-out)</span></>,
    product: `${ms("slow")} ms`, note: use("slow") },
  { rule: "L'arrivée d'une section",
    written: <><span className="cs-kw">transition</span>: opacity <span className="cs-var">var(--m-expressive)</span> <span className="cs-var">var(--e-out)</span></>,
    product: `${ms("expressive")} ms`, note: use("expressive") },
  { rule: "La courbe du kit",
    written: <><span className="cs-kw">--e-out</span>: <span className="cs-var">{MOTION.curve}</span></>,
    product: "départ vif, pose franche", note: "la seule courbe du registre — validée à l'œil le 7 septembre 2026" },
  { rule: "Un déplacement", fallback: true,
    written: <><span className="cs-kw">@media</span> (prefers-reduced-motion: no-preference) {"{ … }"}</>,
    product: "sous son portillon", note: "transform, translate, scale, rotate, défilement doux — jamais nus" },
  { rule: "Un fondu", fallback: true,
    written: <><span className="cs-kw">transition</span>: opacity <span className="cs-var">var(--m-base)</span> <span className="cs-var">var(--e-out)</span></>,
    product: "nu", note: "il reste sous mouvement réduit : il aide à comprendre, il ne déplace rien" },
  { rule: "L'appui", fallback: true,
    written: <><span className="cs-kw">animation</span>: appui <span className="cs-var">var(--m-fast)</span> <span className="cs-var">var(--e-out)</span> both</>,
    product: "scale 0.97", note: "sur :active ; par animation, pour s'ajouter à ce que la commande anime déjà" },
  { rule: "Une chorégraphie", fallback: true,
    written: <><span className="cs-kw">transition</span>: transform 620ms <span className="cs-var">var(--e-out)</span> <span className="cs-com">/* chorégraphie : … */</span></>,
    product: "tolérée, dite", note: "une durée à la main n'existe que sur une ligne qui la déclare" },
];
const LIST: LineList[] = [
  { name: "Deux propriétés, pas trois",
    says: "Un mouvement anime le déplacement et la transparence. Jamais une largeur, une hauteur ni une marge : elles recalculent la page à chaque image.",
    or: "dans le code" },
  { name: "Aucune durée écrite à la main",
    says: "Une transition ou une animation prend un token du moteur — ou dit « chorégraphie » sur sa ligne. Le moteur relit toutes les feuilles.",
    or: "dans le code" },
  { name: "Un déplacement vit sous son portillon",
    says: "Transform, translate, scale, rotate et le défilement doux ne s'écrivent que sous « no-preference ». Un fondu s'écrit nu. Le mouvement réduit est vrai par construction.",
    or: "dans le code" },
  { name: "Une transition, jamais une image-clé, dès qu'on peut interrompre",
    says: "Ouvrir puis refermer aussitôt : une transition rebrousse chemin là où elle est ; une image-clé repart de zéro. L'appui, lui, est une animation — il ne s'interrompt pas, il se termine.",
    or: "dans le code" },
  { name: "Une chorégraphie se déclare et se date",
    says: "Une durée à la main n'existe que sur une ligne qui la déclare, avec le verdict qui l'autorise — le film de Rythme, l'entrée de l'accueil, le côté faute du regard.",
    or: "dans le code" },
  { name: "Une valeur qu'on fait glisser ne s'anime pas",
    says: "Pendant qu'une molette est tenue, ce qu'elle règle est à la valeur, à l'image près. Sinon la scène traîne derrière le doigt et on regarde l'animation au lieu du nombre.",
    or: "sur l'écran allumé", tone: "render" },
  { name: "L'appui répond, le focus ne s'anime pas",
    says: "Chaque vraie commande s'enfonce à 0,97 pendant qu'on la tient, au cran rapide. L'anneau de focus, lui, apparaît d'un coup : au clavier, on veut savoir où l'on est.",
    or: "sur l'écran allumé", tone: "render" },
  { name: "Ce qu'on fait cent fois par jour ne s'anime pas",
    says: "Un raccourci, une ligne de liste, un onglet : la fréquence décide. Trois motifs seulement justifient un mouvement — expliquer, répondre, réjouir.",
    or: "nulle part — décision d'Auteur", tone: "author" },
];

export default function View() {
  const activeId = useDocSections("trace");

  return (
    <div className="gdoc-background motion-page">
      <div className="gdoc">
        <RailDoc page="mouvement" heading="Fondation · Mouvement" toc={TOC} activeId={activeId} foot="Le mouvement garde le fil — ou le coupe." />

        <main className="gdoc-content" id="content">
          <section className="gdoc-hero motion-hero">
            <p className="kicker">Le mouvement</p>
            <h1>Le mouvement garde le fil<span className="point" aria-hidden="true" /></h1>
            <p className="lede">
              Un mouvement dure une fraction de seconde : on ne le regarde pas, on le subit. Il aide à
              comprendre ce qui vient de changer — ou il dérange. Trois règles font la différence, et
              quatre durées, <b>une</b> courbe, les font tenir.
            </p>
          </section>

          {/* ══════════ 01 · la trace ══════════ */}
          <section className="gdoc-sec set" id="trace">
            <div className="gdoc-sec-head">
              <p className="kicker">01 · La trace</p>
              <h2>Ce qui change reste le même objet</h2>
              <p className="muted">Quand un objet change de place ou d&apos;état d&apos;un coup, l&apos;œil doit
              reconstruire ce qui s&apos;est passé. S&apos;il le voit se déplacer, il n&apos;a rien à reconstruire.</p>
            </div>
            <div className="gdoc-body">
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
                <Rules ids={["m5", "m8", "m1"]} />
              </div></details>
            </div>
          </section>

          {/* ══════════ 02 · la cause ══════════ */}
          <section className="gdoc-sec set" id="cause">
            <div className="gdoc-sec-head">
              <p className="kicker">02 · La cause</p>
              <h2>Tout mouvement part de quelque part</h2>
              <p className="muted">Un menu, un panneau, une infobulle appartiennent à ce qui les a ouverts.
              Leur point de départ le dit — ou le cache.</p>
            </div>
            <div className="gdoc-body">
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
                <Rules ids={["m6", "m7", "m3"]} />
              </div></details>
            </div>
          </section>

          {/* ══════════ 03 · le regard ══════════ */}
          <section className="gdoc-sec set" id="gaze">
            <div className="gdoc-sec-head">
              <p className="kicker">03 · Le regard</p>
              <h2>Un seul changement prend la lumière</h2>
              <p className="muted">Le mouvement attire l&apos;œil. Il ne peut le faire que pour une chose à la fois.</p>
            </div>
            <div className="gdoc-body">
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
                <Rules ids={["m10", "m3", "m2"]} />
              </div></details>
            </div>
          </section>

          {/* ═══ LE RÉPERTOIRE — une seule section, au mouvement (8 sept. 2026,
              aligné sur les cinq autres pages, dans l'ordre commun) : les quatre
              paires qui se cassent (#wreck, en h4), les règles qui se vérifient
              ailleurs (#invisibles), puis le moteur — quatre durées, une courbe,
              lues au registre (#code). ═══ */}
          <section className="gdoc-sec set" id="registry">
            <div className="gdoc-sec-head">
              <p className="kicker">04 · Le registre</p>
              <h2>Quatre durées, une courbe — et tout ce qui les fait tenir</h2>
              <p className="muted">Quatre fautes qui ne déclenchent aucune erreur et se sentent avant de
              se voir, le juste et le faux côte à côte ; les règles qui ne se photographient pas — le
              mouvement moins que les autres ; et les valeurs du moteur, lues au registre. Les lignes
              marquées « décision d&apos;Auteur » sont des réglages du kit, pas des lois de la
              perception.</p>
            </div>
            <div className="gdoc-body">
              <div className="doc-piece" id="wreck">
                <div className="doc-piece-head">
                  <h3>Quatre fautes, le juste et le faux au même instant</h3>
                  <p className="muted">Aucune ne déclenche d&apos;erreur. Un seul geste joue les deux
                  côtés, et chaque côté lit ce qu&apos;il joue.</p>
                </div>
              <Bands>
                <Band level={4} name="Le survol suit le curseur" side={`${ms("fast")} ms`} bare
                  says="Un retour au survol se joue en cent millisecondes. Au-delà, la couleur poursuit le curseur au lieu de le suivre — et la page a l'air de réfléchir à chaque geste."
                  rules={<Rules ids={["m3", "m9"]} />}>
                  <BandHover />
                </Band>
                <Band level={4} name="Un menu vit à 200" side={`${ms("base")} ms`} bare
                  says="Ce qu'on ouvre des dizaines de fois par jour ne se fait pas attendre. Le même menu au cran d'une section, 700 ms, est à peine plus beau — et cent fois plus long."
                  rules={<Rules ids={["m3", "m10"]} />}>
                  <BandDrags />
                </Band>
                <Band level={4} name="Rien ne naît du néant" side={`de ${dec(0.95)} à 1`} bare
                  says="Une notification qui arrive part de presque sa taille, avec un fondu. Partie de zéro, elle surgit comme un objet qui n'existait pas une image plus tôt."
                  rules={<Rules ids={["m7"]} />}>
                  <BandNothing />
                </Band>
                <Band level={4} name="Moins de mouvement, pas aucun" side="les fondus restent" bare
                  says="Quelqu'un qui a demandé moins de mouvement à son système ne veut pas d'objets qui se déplacent. Il a toujours besoin de savoir qu'une chose est arrivée : le fondu reste. Notre ancienne règle coupait tout."
                  rules={<Rules ids={["m1"]} />}>
                  <BandReduced />
                </Band>
              </Bands>
              </div>

              <div className="doc-piece" id="invisibles">
                <div className="doc-piece-head">
                  <h3>Les autres règles</h3>
                  <p className="muted">Elles se vérifient dans le code, sur l&apos;écran allumé, ou
                  nulle part — et alors elles s&apos;assument comme un choix, daté.</p>
                </div>
                <ListRules lines={LIST} />
                <details className="prov"><summary>Règles &amp; sources</summary><div>
                  <Rules ids={["m5", "m8", "m4", "m9", "m10"]} />
                </div></details>
              </div>
            </div>
          </section>

          {/* ═══ LE CODE — une section à part, après le registre (verdict d'Auteur,
              9 septembre : « le code doit être une section à part, sur toutes
              les pages ») : ce qu'on écrit, ce que ça produit, lu au moteur. ═══ */}
          <section className="gdoc-sec set" id="code">
            <div className="gdoc-sec-head">
              <p className="kicker">05 · Le code</p>
              <h2>Le moteur</h2>
              <p className="muted">Chaque valeur est lue au moteur, jamais recopiée. Une durée qui
                  n&apos;est pas dans cette table est une faute — ou une chorégraphie, qui se déclare.</p>
            </div>
            <div className="gdoc-body">
              <PanelRegistry lines={CODE} />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
