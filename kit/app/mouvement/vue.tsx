"use client";
import { useEffect, useRef, useState } from "react";
import { RailDoc, useDocSections, type Sommaire } from "../rail";
import { Bandes, Bande, ListeRegles, PanneauRegistre } from "../etages";
import type { LigneListe, LigneCode } from "../etages";
import { MOUVEMENT } from "../../derivation.mjs";
import "./mouvement.css";

/* ═══════════════════════════════════════════════════════════════════════
   PAGE MOUVEMENT — gabarit « documentaire nu », quatre étages. Plan de
   preuves validé par l'Auteur le 4 septembre 2026, construite le 7.

   La terre de la famille : le mouvement n'existe que pendant qu'il se
   produit. On ne peut pas le regarder, seulement l'attraper. Les trois
   preuves partent de là, et aucune ne reprend une preuve d'une autre page.

   · LES PREUVES (01 à 03) — sans gabarit : LA MOLETTE QUI MENT (situation —
     la jauge d'un témoin de Fili, à gauche elle suit le doigt, à droite
     elle traîne, et le retard est MESURÉ) ; LE MÊME GESTE, QUATRE DURÉES
     (variation — un verdict qui se pose, rejoué à chacun des quatre crans,
     lus au moteur) ; DIRE CE QU'ON VOIT (vocabulaire — sept mots pour un
     menu ; la page lit dans la feuille ce que chaque mot produit et rend
     son verdict).
   · LES TROIS ÉTAGES (04 à 06) — au gabarit commun d'etages.tsx : quatre
     bandes en PAIRES, le juste et le faux côte à côte sans bouton (verdict
     d'Auteur du 7 septembre) — le survol qui suit, l'objet qui sort de son
     bouton, rien ne naît du néant, moins de mouvement mais pas aucun ; la liste des
     règles qu'aucune image ne prouve ; le registre des quatre durées et de
     la courbe.

   Les trois lois du 3 septembre (décisions d'Auteur, sur pièce) :
   1 · sous mouvement réduit, les déplacements partent, les fondus restent ;
   2 · la courbe du kit est la sienne — cubic-bezier(0.23, 1, 0.32, 1),
       validée à l'œil sur le site le 7 septembre ;
   3 · chaque durée sait où elle va : 100 bouton · survol · appui, 200 menu ·
       infobulle · dépliant, 300 tiroir · fenêtre · panneau, 700 arrivée
       d'une section.
   Les nombres de la page sont LUS — au moteur (MOUVEMENT) ou sur le rendu
   (getComputedStyle) — jamais recopiés.
   ═══════════════════════════════════════════════════════════════════════ */

type Cran = keyof typeof MOUVEMENT.durees;
const CRANS = Object.keys(MOUVEMENT.durees) as Cran[];
const ms = (c: Cran) => MOUVEMENT.durees[c].ms;
const emploi = (c: Cran) => MOUVEMENT.durees[c].emploi;
const fmt = (v: number) => String(Math.round(v * 10) / 10).replace(".", ",");
/* Une proportion (0,95) garde ses deux décimales. */
const dec = (v: number) => String(Math.round(v * 100) / 100).replace(".", ",");
/* Une durée calculée (« 0.3s ») → millisecondes. */
const enMs = (s: string) => { const v = parseFloat(s); return s.trim().endsWith("ms") ? v : v * 1000; };

/* ── Les règles — dans les dépliants « Règles & sources » de leur preuve ── */
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
    <div style={{ display: "grid", gap: "var(--gap-1-block)" }}>
      {ids.map((id) => REGLES.find((r) => r.id === id)!).map((r) => (
        <div key={r.id} style={{ display: "grid", gap: "var(--gap-3-block)", maxWidth: "var(--measure)" }}>
          <b style={{ color: "var(--text-primary)" }}><span className="badge">règle {r.nom}</span> {r.titre}</b>
          <span>{r.enonce}</span>
          <span style={{ fontSize: "var(--font-size-small)" }}>Sources : {r.src.map((sc, i) => (
            <span key={sc.t}>{i > 0 && " · "}{sc.h === "#" ? sc.t : <a href={sc.h}>{sc.t}</a>}</span>
          ))}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Un réglage de scène : un curseur, une valeur ── */
function Dial({ id, label, min, max, step, value, onChange }: {
  id: string; label: string; min: number; max: number; step: number; value: number; onChange: (v: number) => void;
}) {
  return (
    <span className="mv-dial">
      <label htmlFor={id}>{label}</label>
      <input type="range" id={id} min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} />
      <output htmlFor={id}>{value}</output>
    </span>
  );
}

/* ── 01 · La molette qui ment. Deux fois la même fiche ; à droite, la barre
   porte une transition sur la valeur qu'on règle. Le retard n'est pas
   décrété : la page lit la largeur rendue des deux barres à chaque image
   tant qu'elles diffèrent, et le badge dit l'écart en pixels. ── */
function FicheTemoin({ valeur, ment, barre }: { valeur: number; ment?: boolean; barre: React.RefObject<HTMLDivElement> }) {
  return (
    <div className="carte mv-temoin" role="img"
      aria-label={`Fiche du témoin Léa Fontan, crédibilité ${valeur} pour cent`}>
      <div className="mv-temoin-tete">
        <span className="mv-avatar" aria-hidden="true">LF</span>
        <span className="mv-temoin-nom"><b>Léa Fontan</b><span>Témoin · entendue le 12 mai</span></span>
      </div>
      <div className="mv-jauge">
        <div className="mv-jauge-ligne"><span>Crédibilité</span><output>{valeur} %</output></div>
        <div className="mv-jauge-piste">
          <div ref={barre} className={`mv-jauge-barre${ment ? " ment" : ""}`} style={{ "--mv-w": `${valeur}%` } as React.CSSProperties} />
        </div>
      </div>
    </div>
  );
}
function Molette() {
  const [v, setV] = useState(72);
  const juste = useRef<HTMLDivElement>(null), faux = useRef<HTMLDivElement>(null);
  const [retard, setRetard] = useState(0);
  const [pic, setPic] = useState(0);
  /* À chaque changement, on lit les deux barres image par image jusqu'à ce
     qu'elles se rejoignent : l'écart maximal observé est le mensonge. */
  useEffect(() => {
    let vivant = true;
    let max = 0;
    const lire = () => {
      if (!vivant || !juste.current || !faux.current) return;
      const ecart = Math.abs(juste.current.getBoundingClientRect().width - faux.current.getBoundingClientRect().width);
      max = Math.max(max, ecart);
      setRetard(ecart);
      if (ecart > 0.5) requestAnimationFrame(lire); else setPic(max);
    };
    requestAnimationFrame(lire);
    return () => { vivant = false; };
  }, [v]);
  const ment = retard > 0.5;
  return (
    <div className="mv-scene">
      <Dial id="mv-cred" label="Crédibilité" min={0} max={100} step={1} value={v} onChange={setV} />
      <div className="mv-duo">
        <div className="mv-cote">
          <p className="mv-verdict-tete"><span className="verdict bon" aria-hidden="true">✓</span><span>la barre est à la valeur, à l&apos;image près</span></p>
          <FicheTemoin valeur={v} barre={juste} />
        </div>
        <div className="mv-cote" data-intent="statement">
          <p className="mv-verdict-tete"><span className="verdict ko" aria-hidden="true">✗</span><span>la barre s&apos;anime pendant qu&apos;on la règle</span></p>
          <FicheTemoin valeur={v} ment barre={faux} />
        </div>
      </div>
      {/* Le verdict se LIT : l'écart entre les deux barres, mesuré sur le rendu. */}
      <span className={`badge ${ment ? "ko" : "bon"}`} aria-live="polite">
        {ment
          ? `la barre de droite est ${fmt(retard)} px derrière la molette`
          : pic > 0.5
            ? `les deux barres se sont rejointes — la droite a menti de ${fmt(pic)} px au plus`
            : "les deux barres sont à la valeur — glissez la molette"}
      </span>
    </div>
  );
}

/* ── 02 · Le même geste, nos quatre durées. Un verdict qui se pose, quatre
   fois, et une seule chose change : la durée. Les crans et leurs emplois
   sont lus au moteur ; la légende lit sur le rendu ce que chaque cadre
   joue vraiment. ── */
function QuatreDurees({ surMesure }: { surMesure: (m: number[]) => void }) {
  const [joue, setJoue] = useState(false);
  const cadres = useRef<HTMLDivElement>(null);
  const rejouer = () => {
    setJoue(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setJoue(true)));
  };
  useEffect(() => { const t = setTimeout(() => setJoue(true), 200); return () => clearTimeout(t); }, []);
  useEffect(() => {
    if (!cadres.current) return;
    const lus = Array.from(cadres.current.querySelectorAll<HTMLElement>(".mv-pose")).map((e) => enMs(getComputedStyle(e).transitionDuration.split(",")[0]));
    surMesure(lus);
  }, [surMesure]);
  return (
    <div className="mv-scene">
      <div className="mv-quatre" ref={cadres}>
        {CRANS.map((c) => (
          <div key={c} className={`mv-cadre${joue ? " joue" : ""}`} data-cran={c}>
            <div className="mv-cadre-tete"><b>{ms(c)} ms</b><span>{emploi(c)}</span></div>
            <div className="mv-verdict mv-pose">
              <span className="badge">Verdict</span>
              <span className="mv-verdict-mot">Recevable</span>
              <span className="mv-verdict-dit">Témoignage de Léa Fontan</span>
            </div>
          </div>
        ))}
      </div>
      <button type="button" className="bouton" onClick={rejouer}>Rejouer</button>
    </div>
  );
}

/* ── 03 · Dire ce qu'on voit. Sept mots pour un seul menu. Chaque mot
   donne au menu une autre façon d'arriver ; la page lit ensuite dans la
   feuille ce que le mot produit — durée, courbe, taille de départ, point
   d'origine — et rend son verdict. Rien n'est décrété par le bouton. ── */
const MOTS: { cle: string; mot: string }[] = [
  { cle: "pose", mot: "ça se pose" },
  { cle: "bouton", mot: "ça sort de son bouton" },
  { cle: "rebond", mot: "ça rebondit" },
  { cle: "saute", mot: "ça saute" },
  { cle: "neant", mot: "ça naît du néant" },
  { cle: "traine", mot: "ça traîne" },
  { cle: "milieu", mot: "ça s'ouvre du milieu" },
];
type Lu = { duree: number; depasse: boolean; depart: number | null; origine: string; proprietes: string };
/* Lire un objet AU REPOS : pendant qu'une transition court, la valeur calculée
   est celle de l'image en cours, pas celle de la règle. On lit donc un jumeau
   posé un instant à côté, sans son état ouvert, puis retiré. */
function auRepos<T>(el: HTMLElement, lire: (cs: CSSStyleDeclaration) => T): T {
  const jumeau = el.cloneNode(false) as HTMLElement;
  jumeau.removeAttribute("id"); jumeau.classList.remove("ouvert", "la");
  jumeau.style.visibility = "hidden"; jumeau.setAttribute("aria-hidden", "true");
  el.parentElement?.appendChild(jumeau);
  try { return lire(getComputedStyle(jumeau)); } finally { jumeau.remove(); }
}
function lireMenu(el: HTMLElement): Lu {
  return auRepos(el, (cs) => {
    const durees = cs.transitionDuration.split(",").map((d) => enMs(d));
    /* une courbe qui dépasse sa cible : un point de contrôle au-dessus de 1, sur n'importe quelle propriété */
    const depasse = Array.from(cs.transitionTimingFunction.matchAll(/cubic-bezier\(([^)]*)\)/g))
      .some((m) => { const n = m[1].split(",").map(Number); return n[1] > 1 || n[3] > 1; });
    const s = cs.scale;
    return { duree: Math.max(...durees), depasse, depart: s === "none" ? null : parseFloat(s), origine: cs.transformOrigin, proprietes: cs.transitionProperty };
  });
}
/* Le verdict, déduit de ce qui est lu — jamais du mot cliqué. */
function juger(lu: Lu, aucoin: boolean): { ok: boolean; dit: string } {
  if (lu.duree === 0) return { ok: false, dit: "aucune durée : un état remplace l'autre, rien ne passe" };
  if (lu.depart === 0) return { ok: false, dit: `part de 0 : un objet réel ne naît pas du néant — ${lu.duree} ms` };
  if (lu.depasse) return { ok: false, dit: `la courbe dépasse sa cible et revient : ${lu.duree} ms, jamais sur de l'interface` };
  if (lu.duree > ms("base")) return { ok: false, dit: `${lu.duree} ms sur un menu, qui vit à ${ms("base")} : il traîne` };
  if (!aucoin) return { ok: false, dit: `${lu.duree} ms, mais depuis le milieu — pas depuis le bouton qui l'a appelé` };
  return { ok: true, dit: `${lu.duree} ms · la courbe du kit${lu.depart !== null ? ` · part de ${dec(lu.depart)}` : ""} · depuis le bouton` };
}
function Mots() {
  const [mot, setMot] = useState("pose");
  const [ouvert, setOuvert] = useState(false);
  const [verdict, setVerdict] = useState<{ ok: boolean; dit: string } | null>(null);
  const menu = useRef<HTMLDivElement>(null);
  const choisir = (cle: string) => {
    setMot(cle); setOuvert(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setOuvert(true)));
  };
  useEffect(() => {
    if (!menu.current) return;
    const lu = lireMenu(menu.current);
    const origine = lu.origine.split(" ").map(parseFloat);
    setVerdict(juger(lu, origine[0] === 0 && origine[1] === 0));
  }, [mot]);
  return (
    <div className="mv-scene">
      <div className="mv-mots" role="group" aria-label="Comment le menu arrive">
        {MOTS.map((m) => (
          <button key={m.cle} type="button" className={`bouton${mot === m.cle ? " on" : ""}`} aria-pressed={mot === m.cle}
            onClick={() => choisir(m.cle)}>{m.mot}</button>
        ))}
      </div>
      <div className="mv-scene-menu">
        <button type="button" className="bouton" aria-expanded={ouvert} aria-controls="mv-menu-actions" onClick={() => setOuvert(!ouvert)}>Actions du témoin</button>
        <div ref={menu} id="mv-menu-actions" className={`mv-menu ${mot === "pose" || mot === "bouton" ? "" : mot}${ouvert ? " ouvert" : ""}`}
          role="menu" aria-hidden={!ouvert} data-mot={mot} data-intent={mot === "pose" || mot === "bouton" ? undefined : "statement"}>
          <span className="mv-menu-item" role="menuitem">Entendre à nouveau</span>
          <span className="mv-menu-item" role="menuitem">Confronter à un autre témoin</span>
          <span className="mv-menu-item" role="menuitem">Joindre une pièce</span>
          <span className="mv-menu-item danger" role="menuitem">Récuser</span>
        </div>
      </div>
      {verdict && (
        <span className={`badge ${verdict.ok ? "bon" : "ko"}`} aria-live="polite" data-verdict={verdict.ok ? "bon" : "ko"}>{verdict.dit}</span>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   LES BANDES — une règle et comment elle échoue, CÔTE À CÔTE (verdict
   d'Auteur, 7 septembre : « pour le mouvement, deux colonnes bon / pas
   bon plutôt qu'un bouton casser »). Le même objet deux fois, une seule
   chose change ; un seul geste joue les deux côtés en même temps, et la
   tête de chaque colonne est lue sur le rendu.
   ══════════════════════════════════════════════════════════════════════ */
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

/* 2 · Un objet s'ouvre depuis son déclencheur : deux menus, un seul geste. */
function BandeOrigine() {
  const [ouvert, setOuvert] = useState(false);
  const scene = useRef<HTMLDivElement>(null);
  const [origines, setOrigines] = useState<string[]>([]);
  useEffect(() => {
    if (!scene.current) return;
    setOrigines(Array.from(scene.current.querySelectorAll<HTMLElement>(".mv-menu")).map((m) => getComputedStyle(m).transformOrigin));
  }, []);
  const aucoin = (o?: string) => !!o && o.split(" ").map(parseFloat).every((n) => n === 0);
  const dit = (o?: string) => o === undefined ? "" : aucoin(o) ? "il grandit depuis le coin qui touche son bouton" : "il grandit depuis son propre milieu";
  const Menu = ({ milieu }: { milieu?: boolean }) => (
    <div className="mv-scene-menu">
      <button type="button" className="bouton" aria-expanded={ouvert} onClick={() => setOuvert(!ouvert)}>Actions du témoin</button>
      <div className={`mv-menu${milieu ? " milieu" : ""}${ouvert ? " ouvert" : ""}`} role="menu" aria-hidden={!ouvert}>
        <span className="mv-menu-item" role="menuitem">Entendre à nouveau</span>
        <span className="mv-menu-item" role="menuitem">Confronter</span>
        <span className="mv-menu-item danger" role="menuitem">Récuser</span>
      </div>
    </div>
  );
  return (
    <div className="mv-duo" ref={scene}>
      <Cote ok={origines[0] === undefined || aucoin(origines[0])} dit={dit(origines[0])}><Menu /></Cote>
      <Cote ok={origines[1] === undefined || aucoin(origines[1])} faux dit={dit(origines[1])}><Menu milieu /></Cote>
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

/* ── Étage « en liste » — ce qu'aucune image ne prouve. ── */
const LISTE: LigneListe[] = [
  { nom: "Deux propriétés, pas trois",
    dit: "Un mouvement anime le déplacement et la transparence. Jamais une largeur, une hauteur ni une marge : elles recalculent la page à chaque image.",
    ou: "dans le code" },
  { nom: "Aucune durée écrite à la main",
    dit: "Une transition ou une animation prend un jeton de mouvement — ou dit « chorégraphie » sur sa ligne. Le moteur relit toutes les feuilles.",
    ou: "dans le code" },
  { nom: "Un déplacement vit sous son portillon",
    dit: "Transform, translate, scale, rotate et le défilement doux ne s'écrivent que sous « no-preference ». Un fondu s'écrit nu. Le mouvement réduit est vrai par construction.",
    ou: "dans le code" },
  { nom: "Une transition, jamais une image-clé, dès qu'on peut interrompre",
    dit: "Ouvrir puis refermer aussitôt : une transition rebrousse chemin là où elle est ; une image-clé repart de zéro. L'appui, lui, est une animation — il ne s'interrompt pas, il se termine.",
    ou: "dans le code" },
  { nom: "Une chorégraphie se déclare et se date",
    dit: "Trois seulement sur le site : le film de Rythme, l'entrée de l'accueil, la boucle du chemin de l'œil. Chacune dit son tempo sur sa ligne, avec le verdict qui l'autorise.",
    ou: "dans le code" },
  { nom: "L'appui répond",
    dit: "Chaque vraie commande du kit s'enfonce à 0,97 pendant qu'on la tient, au cran rapide. Tenez n'importe quel bouton de cette page.",
    ou: "sur l'écran allumé", ton: "rendu" },
  { nom: "Le focus ne s'anime pas",
    dit: "L'anneau apparaît d'un coup : au clavier, on veut savoir où l'on est, pas regarder arriver le halo.",
    ou: "sur l'écran allumé", ton: "rendu" },
  { nom: "Ce qu'on fait cent fois par jour ne s'anime pas",
    dit: "Un raccourci, une ligne de liste, un onglet : la fréquence décide. Trois motifs seulement justifient un mouvement — expliquer, répondre, réjouir.",
    ou: "nulle part — décision d'Auteur", ton: "auteur" },
];

/* ── Étage « dans le code » — les valeurs sont LUES au moteur, jamais recopiées. ── */
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
    produit: "départ vif, pose franche", note: "la seule courbe du registre — validée à l'œil sur le site le 7 septembre 2026" },
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
    produit: "tolérée, dite", note: "une durée à la main n'existe que sur une ligne qui la déclare, avec le verdict qui l'autorise" },
];

const SOMMAIRE: Sommaire = [
  ["molette", "01", "La molette qui ment"],
  ["durees", "02", "Quatre durées"],
  ["mots", "03", "Dire ce qu'on voit"],
  ["casser", "04", "Les règles qu'on peut casser"],
  ["invisibles", "05", "Les règles qu'on ne peut pas montrer"],
  ["code", "06", "Dans le code"],
];

export default function Vue() {
  const actifId = useDocSections("molette");
  const [mesures, setMesures] = useState<number[]>([]);

  return (
    <div className="gdoc-fond">
      <div className="gdoc">
        <RailDoc page="mouvement" titre="Fondation · Mouvement" sommaire={SOMMAIRE} actifId={actifId} pied="Quatre durées, une courbe, et chacune sait où elle va" />

        <main className="gdoc-contenu" id="contenu">

          <section className="gdoc-heros">
            <p className="kicker">Le mouvement</p>
            <h1>Le mouvement n&apos;existe que pendant qu&apos;il se produit<span className="point" aria-hidden="true" /></h1>
            <p className="chapo">
              On ne peut pas le regarder, seulement l&apos;attraper — et c&apos;est pour ça qu&apos;on le
              règle si mal. Une durée de trop se sent sans se voir, une courbe héritée ne signe rien, et
              une interface qui bouge partout finit par ne plus rien dire. Ici, quatre durées,
              <b>une</b> courbe, et chacune sait où elle va. Ce que vous ne pouvez pas voir, la page le mesure pour vous.
            </p>
          </section>

          {/* ══════════ 01 · situation ══════════ */}
          <section className="gdoc-sec pose" id="molette">
            <div className="gdoc-sec-tete">
              <p className="kicker">01 · La molette qui ment</p>
              <h2>Une valeur qu&apos;on fait glisser ne s&apos;anime pas</h2>
              <p className="sourd">Une molette promet une chose simple : ce que vous voyez est la valeur
              où est votre doigt. Dès que la scène porte une transition, elle traîne derrière — et vous
              regardez l&apos;animation au lieu du nombre. La démonstration cesse de démontrer. Tenez la
              molette et regardez les deux barres : l&apos;écart entre elles est mesuré à chaque image.</p>
            </div>
            <div className="gdoc-corps">
              <figure className="gd-figure">
                <div className="banc voile">
                  <Molette />
                </div>
                <figcaption className="gd-legende">
                  même fiche, même molette · à gauche aucune transition sur la largeur réglée · à droite {ms("slow")} ms
                  sur la valeur qu&apos;on tient — le retard est lu sur le rendu, pas décrété
                </figcaption>
              </figure>
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <p>Le jumeau du verdict du 2 septembre, « une molette ne repeint que sa scène » : là on
                empêchait la page de bouger, ici on empêche la scène de mentir sur le nombre. La fiche
                d&apos;Arrondis et le film de Rythme y obéissent depuis le 4 septembre.</p>
                <Regles ids={["m4", "m5"]} />
              </div></details>
            </div>
          </section>

          {/* ══════════ 02 · variation ══════════ */}
          <section className="gdoc-sec pose" id="durees">
            <div className="gdoc-sec-tete">
              <p className="kicker">02 · Quatre durées</p>
              <h2>Une durée n&apos;est pas un goût, c&apos;est une taille</h2>
              <p className="sourd">Le même verdict se pose quatre fois, et une seule chose change. À
              cent millisecondes on ne le voit pas, on le sent : c&apos;est la taille d&apos;un bouton.
              À sept cents, on l&apos;attend : c&apos;est la taille d&apos;une section qui arrive. Entre
              les deux, le menu et le panneau. Rejouez-les autant de fois qu&apos;il faut pour que
              l&apos;échelle vous entre dans l&apos;œil.</p>
            </div>
            <div className="gdoc-corps">
              <figure className="gd-figure">
                <div className="banc voile">
                  <QuatreDurees surMesure={setMesures} />
                </div>
                <figcaption className="gd-legende">
                  {mesures.length
                    ? `${mesures.map((m) => fmt(m)).join(" · ")} ms, lus sur le rendu · même objet, même courbe, même distance — seule la durée change`
                    : "même objet, même courbe, même distance — seule la durée change"}
                </figcaption>
              </figure>
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <p>La durée se déduit de l&apos;objet et de la fréquence du geste, jamais de l&apos;humeur
                de celui qui écrit la ligne. Le cran de {ms("expressive")} n&apos;est pas une réponse
                d&apos;interface — c&apos;est une découverte au défilement, et le plafond de 300 ne le
                vise pas.</p>
                <Regles ids={["m3", "m2"]} />
              </div></details>
            </div>
          </section>

          {/* ══════════ 03 · vocabulaire ══════════ */}
          <section className="gdoc-sec pose" id="mots">
            <div className="gdoc-sec-tete">
              <p className="kicker">03 · Dire ce qu&apos;on voit</p>
              <h2>On ne gouverne pas ce qu&apos;on ne sait pas nommer</h2>
              <p className="sourd">« Ça fait bizarre » n&apos;est pas un verdict. Un mouvement se décrit
              avec des mots précis — il se pose, il sort de son bouton, il rebondit, il saute — et
              chaque mot est déjà une règle, tenue ou cassée. Choisissez un mot : le menu arrive comme
              vous l&apos;avez dit, et la page lit dans la feuille ce que ce mot produit vraiment.</p>
            </div>
            <div className="gdoc-corps">
              <figure className="gd-figure">
                <div className="banc voile">
                  <Mots />
                </div>
                <figcaption className="gd-legende">
                  un seul menu, sept façons d&apos;arriver · deux sont justes · le verdict est déduit de la
                  durée, de la courbe, de la taille de départ et du point d&apos;origine — lus sur le rendu
                </figcaption>
              </figure>
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <Regles ids={["m6", "m7", "m2", "m3"]} />
              </div></details>
            </div>
          </section>

          {/* ══════════ 04 · répertoire ══════════ */}
          <section className="gdoc-sec pose" id="casser">
            <div className="gdoc-sec-tete">
              <p className="kicker">04 · Les règles qu&apos;on peut casser</p>
              <h2>Voyez ce qui se passe quand la règle saute</h2>
              <p className="sourd">Aucune de ces fautes ne déclenche d&apos;erreur nulle part. Elles se
              sentent avant de se voir — c&apos;est ce qui les rend coûteuses. Alors le juste et le faux
              jouent côte à côte, au même instant, et chaque colonne lit ce qu&apos;elle joue.</p>
            </div>
            <div className="gdoc-corps">
              <Bandes>
                <Bande nom="Le survol suit le curseur" cote={`${ms("fast")} ms`} nue
                  dit="Un retour au survol se joue en cent millisecondes. Au-delà, la couleur poursuit le curseur au lieu de le suivre — et la page a l'air de réfléchir à chaque geste. Passez sur les deux rangées."
                  regles={<Regles ids={["m3", "m10"]} />}>
                  <BandeSurvol />
                </Bande>
                <Bande nom="Un objet s'ouvre depuis son déclencheur" cote="depuis le coin du bouton" nue
                  dit="Le menu grandit depuis le coin qui touche son bouton : on comprend d'où il vient. Depuis son propre milieu, il n'appartient plus à rien. Ouvrez-les."
                  regles={<Regles ids={["m6"]} />}>
                  <BandeOrigine />
                </Bande>
                <Bande nom="Rien ne naît du néant" cote="de 0,95 à 1" nue
                  dit="Une notification qui arrive part de presque sa taille, avec un fondu. Partie de zéro, elle surgit comme un objet qui n'existait pas une image plus tôt."
                  regles={<Regles ids={["m7"]} />}>
                  <BandeNeant />
                </Bande>
                <Bande nom="Moins de mouvement, pas aucun" cote="les fondus restent" nue
                  dit="Quelqu'un qui a demandé moins de mouvement à son système ne veut pas d'objets qui se déplacent. Il a toujours besoin de savoir qu'une chose est arrivée : le fondu reste. Notre ancienne règle coupait tout — plus sévère que la norme, elle coûtait des repères à des gens qu'elle ne protégeait pas."
                  regles={<Regles ids={["m1"]} />}>
                  <BandeReduit />
                </Bande>
              </Bandes>
            </div>
          </section>

          <section className="gdoc-sec pose" id="invisibles">
            <div className="gdoc-sec-tete">
              <p className="kicker">05 · Les règles qu&apos;on ne peut pas montrer</p>
              <h2>Elles se vérifient ailleurs — et on vous dit où</h2>
              <p className="sourd">Certaines règles ne se photographient pas — le mouvement moins que
              les autres. Elles se vérifient dans le code, à l&apos;écran allumé, ou nulle part du tout.</p>
            </div>
            <div className="gdoc-corps">
              <ListeRegles lignes={LISTE} />
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <Regles ids={["m5", "m8", "m9", "m10", "m1"]} />
              </div></details>
            </div>
          </section>

          <section className="gdoc-sec pose" id="code">
            <div className="gdoc-sec-tete">
              <p className="kicker">06 · Dans le code</p>
              <h2>Le même système, dans votre stack</h2>
            </div>
            <div className="gdoc-corps">
              <PanneauRegistre lignes={CODE} />
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <p><b>Ce qui fait foi.</b> Quatre durées et une courbe, au moteur, avec leur emploi sur
                la ligne. Les sorties Figma et Tailwind portent les mêmes valeurs. Le moteur relit toutes
                les feuilles du site : une durée écrite à la main y est une faute, sauf sur une ligne
                qui se déclare chorégraphie.</p>
                <p><b>Ce qui a changé le 3 septembre.</b> Les deux courbes de Material, jamais arbitrées,
                ont quitté le registre ; le kit s&apos;est donné la sienne. Les quatre durées, qui
                n&apos;avaient pas de règle d&apos;emploi, en ont une. Et le mouvement réduit ne coupe
                plus tout : les déplacements partent, les fondus restent.</p>
                <Regles ids={["m2", "m3", "m1"]} />
              </div></details>
            </div>
          </section>

          <footer className="gd-pied">
            <span>Cette page obéit aux règles qu&apos;elle raconte</span>
            <span>Quatre durées, une courbe · Léa Fontan est un témoin fictif</span>
          </footer>

        </main>
      </div>
    </div>
  );
}
