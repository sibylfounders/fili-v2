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

   · LES PREUVES (01 à 03) — sans gabarit, versées de la pièce
     kit-mouvement-nu.html jugée par l'Auteur le 7 septembre (« Mieux, pousse
     sur le kit »). Trois scènes, trois tempéraments, et rien ne se joue
     seul — on lit : LA MAIN INVISIBLE (situation, sur la marque — une main
     dessinée règle la jauge du témoin par à-coups, d'abord avec la faute,
     la barre traîne et l'écart se peint en rouge et se MESURE, puis comme
     il faut ; un sous-titre par étape) ; QUATRE SITUATIONS (variation, la
     mise en scène du film de Rythme — ce que vous faites, l'objet qui
     répond, la durée et son pourquoi, puis une taille de trop) ; LE LEXIQUE
     EN GESTES (vocabulaire, sur le blanc nu — six mots, six tuiles, le même
     bloc qui joue son mot au ralenti, le verdict lu). Sous mouvement réduit,
     les lectures s'avancent à la main, une étape par appui.
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

/* ── 03 · Dire ce qu'on voit. Sept mots pour un seul menu. Chaque mot
   donne au menu une autre façon d'arriver ; la page lit ensuite dans la
   feuille ce que le mot produit — durée, courbe, taille de départ, point
   d'origine — et rend son verdict. Rien n'est décrété par le bouton. ── */
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
/* ── La lecture. Rien ne se joue seul : « Lire » joue la scène une fois, du
   début à la fin, puis propose de la rejouer. Sous mouvement réduit, on
   avance à la main, une étape par appui. Un onglet caché arrête la lecture.
   Les tempos du récit — combien de temps une phrase reste — sont une
   chorégraphie (verdict d'Auteur, 7 septembre) ; ce qui bouge à l'écran
   prend les jetons du kit. ── */
function useLibre() {
  const [libre, setLibre] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const lire = () => setLibre(mq.matches);
    lire(); mq.addEventListener("change", lire);
    return () => mq.removeEventListener("change", lire);
  }, []);
  return libre;
}
function useLecture(etapes: number[], surFin?: () => void) {
  const libre = useLibre();
  const [i, setI] = useState(-1);          /* -1 : au repos, avant la première lecture */
  const [enCours, setEnCours] = useState(false);
  const [fini, setFini] = useState(false);
  useEffect(() => {
    if (!enCours || i < 0) return;
    if (i >= etapes.length) { setEnCours(false); setFini(true); surFin?.(); return; }
    if (!libre) return;
    const t = setTimeout(() => setI(i + 1), etapes[i]);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, enCours, libre]);
  useEffect(() => {
    const cacher = () => { if (document.hidden && enCours) { setEnCours(false); setFini(true); surFin?.(); } };
    document.addEventListener("visibilitychange", cacher);
    return () => document.removeEventListener("visibilitychange", cacher);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enCours]);
  const lire = () => { setFini(false); setEnCours(true); setI(0); };
  const arreter = () => { setEnCours(false); setFini(true); surFin?.(); };
  const suivant = () => { if (i + 1 >= etapes.length) { setEnCours(false); setFini(true); surFin?.(); } else setI(i + 1); };
  return { i, libre, enCours, fini, lire, arreter, suivant };
}
/* La commande d'une lecture : Lire, puis Arrêter pendant, puis Rejouer ;
   sous mouvement réduit, Lire puis Étape suivante. */
function Commande({ l }: { l: ReturnType<typeof useLecture> }) {
  if (!l.enCours) return <button type="button" className="bouton on mv-commande" onClick={l.lire}>{l.fini ? "Rejouer" : "Lire"}</button>;
  return l.libre
    ? <button type="button" className="bouton mv-commande" onClick={l.arreter}>Arrêter</button>
    : <button type="button" className="bouton mv-commande" onClick={l.suivant}>Étape suivante</button>;
}
/* ── 01 · La main invisible. La fiche du témoin ; une main dessinée règle
   la crédibilité par à-coups, deux fois : d'abord avec la faute (la barre
   porte une transition et court après la main — l'écart se peint en rouge
   et se mesure), puis comme il faut (la barre est sous la main, à l'image
   près). Un sous-titre par étape. ── */
const V0 = 22, V1 = 84; /* chorégraphie : le départ et l'arrivée de la main */
const COUPS: [number, number, number][] = [[V0, 58, 240], [58, 46, 200], [46, V1, 280]]; /* chorégraphie : trois coups vifs [de, à, ms] */
const PAUSE = 1700; /* chorégraphie : la pause entre deux coups */
const GESTE = COUPS.reduce((t, c) => t + c[2], 0) + PAUSE * (COUPS.length - 1);
function Main() {
  return (
    <svg className="mv-main" viewBox="0 0 24 32" aria-hidden="true">
      <path d="M9 2.5c0-1.4 2.6-1.4 2.6 0V14l1.2-.4c.9-.3 1.7.1 2 .9l.3.8 1.1-.5c.9-.4 1.9 0 2.2.9l.2.6 1.3-.3c1-.2 1.9.5 1.9 1.5v6.2c0 3.6-2.9 6.3-6.5 6.3h-2.6c-2 0-3.9-.9-5.1-2.5L2.3 22c-.7-.9-.5-2.1.4-2.7.8-.6 1.9-.4 2.5.4L7 21.5V2.5z" />
    </svg>
  );
}
function Molette() {
  const [st, setSt] = useState<React.ReactNode>("");
  const l = useLecture([4200, GESTE + ms("slow") + 1200, 5200, 4200, GESTE + 1200, 5600], () => setSt(""));
  const [v, setV] = useState(V0);
  const [faute, setFaute] = useState(true);
  const [saut, setSaut] = useState(true);
  const [tenue, setTenue] = useState(false);
  const barre = useRef<HTMLDivElement>(null), piste = useRef<HTMLDivElement>(null);
  const [ecart, setEcart] = useState({ de: 0, l: 0, px: 0 });
  const pic = useRef(0);
  const glisseur = useRef<number>(0);
  /* le mensonge, lu : tant que la barre n'est pas où est la main, on lit sa largeur à chaque image */
  useEffect(() => {
    let vivant = true;
    const lire = () => {
      if (!vivant || !barre.current || !piste.current) return;
      const L = piste.current.getBoundingClientRect().width || 1, b = barre.current.getBoundingClientRect().width, cible = (v / 100) * L;
      const e = Math.abs(cible - b); pic.current = Math.max(pic.current, e);
      setEcart({ de: (Math.min(cible, b) / L) * 100, l: (e / L) * 100, px: e });
      if (e > 0.5) requestAnimationFrame(lire);
    };
    requestAnimationFrame(lire);
    return () => { vivant = false; };
  }, [v]);
  /* la main : trois coups vifs, deux pauses ; réduite, elle saute — un déplacement ne se joue pas */
  const coups = () => {
    if (!l.libre) { setV(V1); return; }
    const coup = (n: number) => {
      if (n >= COUPS.length) return;
      const [de, a, duree] = COUPS[n], debut = performance.now();
      const pas = (t: number) => {
        const k = Math.min(1, (t - debut) / duree); setV(Math.round(de + (a - de) * k));
        if (k < 1) glisseur.current = requestAnimationFrame(pas);
        else glisseur.current = window.setTimeout(() => coup(n + 1), PAUSE);
      };
      pas(debut);
    };
    coup(0);
  };
  const revenir = () => { setSaut(true); pic.current = 0; setV(V0); setTenue(false); requestAnimationFrame(() => requestAnimationFrame(() => setSaut(false))); };
  useEffect(() => {
    cancelAnimationFrame(glisseur.current); clearTimeout(glisseur.current);
    const i = l.i;
    if (i === 0) { setFaute(true); revenir(); setSt(<><b>D&apos;abord la faute.</b> La barre porte une transition de {ms("slow")} ms. Une main va régler la crédibilité, par à-coups, de {V0} à {V1} %. Regardez la barre, pas la main.</>); }
    if (i === 1) { setTenue(true); setSt("La main est déjà là. La barre court après."); coups(); }
    if (i === 2) { setTenue(false); setSt(<>La barre a menti de <span className="ko">{fmt(pic.current)} px</span> au plus. Pendant qu&apos;elle rattrapait la main, vous regardiez l&apos;animation, pas le nombre.</>); }
    if (i === 3) { setFaute(false); revenir(); setSt(<><b>Maintenant comme il faut.</b> La même barre, sans transition. La même main, les mêmes coups.</>); }
    if (i === 4) { setTenue(true); setSt("La barre est sous la main, à l'image près. Il n'y a rien à regarder d'autre que le nombre."); coups(); }
    if (i === 5) { setTenue(false); setSt(<><b>Une valeur qu&apos;on fait glisser ne s&apos;anime pas.</b> Ce qu&apos;on tient au doigt est à la valeur tout de suite.</>); }
    return () => { cancelAnimationFrame(glisseur.current); clearTimeout(glisseur.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [l.i]);
  const ment = ecart.px > 0.5;
  const style = { "--mv-w": `${v}%`, "--mv-de": `${ecart.de}%`, "--mv-l": `${ecart.l}%` } as React.CSSProperties;
  return (
    <div className="mv-scene" style={style} data-etape={l.i}>
      <div className="carte mv-fiche" role="img" aria-label={`Fiche du témoin Léa Fontan. Crédibilité ${v} pour cent. La barre ${faute ? "est animée" : "est à la valeur"}${ment ? `, ${fmt(ecart.px)} pixels derrière la main` : ""}.`}>
        <div className="mv-fiche-tete">
          <span className="mv-avatar" aria-hidden="true">LF</span>
          <span className="mv-fiche-nom"><b>Léa Fontan</b><span>Témoin · entendue le 12 mai</span></span>
          <output className="mv-fiche-nombre">{v} %</output>
        </div>
        <div className="mv-pile">
          <span className="mv-pile-dit">Crédibilité</span>
          <div ref={piste} className={`mv-piste${tenue ? " tenue" : ""}`}>
            <span className="mv-trace" />
            <span className="mv-doigt"><Main /></span>
          </div>
          <p className="mv-pile-dit">
            {faute ? <><span className="verdict ko" aria-hidden="true">✗</span><span>animée</span></> : <><span className="verdict bon" aria-hidden="true">✓</span><span>à la valeur</span></>}
          </p>
          <div className="mv-jauge-piste" data-intent={faute ? "statement" : undefined}>
            <div ref={barre} className={`mv-jauge-barre${faute ? " ment" : ""}${saut ? " saut" : ""}`} />
            <span className="mv-mensonge" hidden={!ment} />
            <span className="mv-mensonge-cote" hidden={!ment}>{fmt(ecart.px)} px</span>
          </div>
        </div>
      </div>
      {/* le sous-titre : pendant la faute, il lit l'écart image par image */}
      <p className={`mv-sous-titre${st ? " on" : ""}${l.i === 5 ? " regle" : ""}`} aria-live="polite">
        {l.i === 1 && ment ? <>La main est déjà là. La barre court après — <span className="ko">{fmt(ecart.px)} px derrière</span>.</> : st}
      </p>
      <Commande l={l} />
    </div>
  );
}

/* ── 02 · Quatre situations — la mise en scène du film de Rythme (verdict
   d'Auteur, 7 septembre). Un seul plateau : le panneau de marque décalé à
   droite, la carte de l'objet qui mord dessus, le compteur, le lecteur sur
   la page. Ce qui est dans le panneau change de slide en slide : ce que
   vous faites, la durée et son emploi, le pourquoi. ── */
type Cas = { cran: Cran; vous: React.ReactNode; obj: "bouton" | "menu" | "panneau" | "section"; pourquoi: string; faute?: boolean };
const CAS: Cas[] = [
  { cran: "fast", vous: <>Vous <em>survolez</em> un bouton</>, obj: "bouton",
    pourquoi: "Un survol répond, il ne se regarde pas. Au-delà de 160 ms, la couleur poursuit le curseur. Vous ne l'avez pas vu : vous l'avez senti." },
  { cran: "base", vous: <>Vous <em>ouvrez</em> un menu</>, obj: "menu",
    pourquoi: "Un menu s'ouvre des dizaines de fois par jour. Assez long pour être vu, trop court pour être attendu." },
  { cran: "slow", vous: <>Vous ouvrez un <em>panneau</em></>, obj: "panneau",
    pourquoi: "Un panneau change l'écran. Il lui faut un passage, sinon l'état d'avant disparaît sans qu'on sache où il est allé." },
  { cran: "expressive", vous: <>Une <em>section</em> arrive au défilement</>, obj: "section",
    pourquoi: "Une découverte, pas une réponse : elle peut prendre son temps. Vous n'attendez rien d'elle." },
  { cran: "expressive", vous: <>Vous ouvrez un menu… <em>à 700 ?</em></>, obj: "menu", faute: true,
    pourquoi: "Le même menu, au cran d'une section. Cette fois vous l'attendez — et cent fois par jour, c'est long." },
];
const SLIDE_MS = 7000; /* chorégraphie : chaque situation reste sept secondes quand le film se joue */
const LECTURE_MS = 2400; /* chorégraphie : le temps de lire la situation avant que l'objet réponde */
function Curseur() {
  return <svg className="mv-curseur" viewBox="0 0 16 22" aria-hidden="true"><path d="M1 1l6 16 2.2-6.2L15.5 9z" /></svg>;
}
function Objet({ cas, joue }: { cas: Cas; joue: boolean }) {
  if (cas.obj === "bouton") return <><span className={`bouton mv-obj${joue ? " survole" : ""}`} data-joue>Enregistrer</span><Curseur /></>;
  if (cas.obj === "menu") return (
    <div className="mv-scene-menu">
      <span className="bouton mv-obj">Actions du témoin</span>
      <div className={`mv-menu${cas.faute ? " traine" : ""}${joue ? " ouvert" : ""}`} data-joue role="menu" aria-hidden={!joue}>
        <span className="mv-menu-item" role="menuitem">Entendre à nouveau</span><span className="mv-menu-item" role="menuitem">Confronter</span><span className="mv-menu-item danger" role="menuitem">Récuser</span>
      </div>
    </div>
  );
  if (cas.obj === "panneau") return (
    <div className="mv-ecran">
      <span className="mv-ligne large" /><span className="mv-ligne" /><span className="mv-ligne courte" />
      <div className={`mv-panneau${joue ? " ouvert" : ""}`} data-joue aria-hidden={!joue}>
        <b>Récuser le témoin ?</b><span>Le témoignage sera retiré du dossier.</span>
        <span className="mv-panneau-actions"><span className="bouton on">Récuser</span><span className="bouton">Annuler</span></span>
      </div>
    </div>
  );
  return (
    <div className={`mv-section${joue ? " la" : ""}`} data-joue aria-hidden={!joue}>
      <b>Les témoins entendus</b><span className="mv-ligne large" /><span className="mv-ligne" /><span className="mv-ligne courte" />
    </div>
  );
}
function Situations({ surMesure }: { surMesure: (m: number[]) => void }) {
  const libre = useLibre();
  const [i, setI] = useState(0);
  const [joue, setJoue] = useState(false);
  const [enCours, setEnCours] = useState(false);
  const [fini, setFini] = useState(false);
  const [mots, setMots] = useState(true);
  const carte = useRef<HTMLDivElement>(null), temps = useRef<HTMLElement>(null);
  const lus = useRef<number[]>([]);
  const cas = CAS[i];
  /* poser une situation, puis l'objet répond — après qu'on a eu le temps de lire */
  const repondre = () => {
    const o = carte.current?.querySelector<HTMLElement>("[data-joue]"), cur = carte.current?.querySelector<HTMLElement>(".mv-curseur");
    if (!o || !carte.current) return;
    if (cur) {
      const ro = o.getBoundingClientRect();
      cur.style.left = "18%"; cur.style.top = "70%"; cur.classList.add("la");
      requestAnimationFrame(() => requestAnimationFrame(() => { const rk = cur.getBoundingClientRect(); cur.style.translate = `${ro.left + ro.width * 0.55 - rk.left}px ${ro.top + ro.height * 0.55 - rk.top}px`; }));
    }
    setTimeout(() => setJoue(true), cur ? ms("slow") + 150 : 0);
  };
  /* la durée de l'objet est lue sur son rendu dès que la situation est posée — au repos, avant qu'il réponde */
  const mesurer = () => {
    const o = carte.current?.querySelector<HTMLElement>("[data-joue]");
    if (!o) return;
    const d = enMs(getComputedStyle(o).transitionDuration.split(",")[0]);
    if (!lus.current.includes(d)) { lus.current = [...lus.current, d]; surMesure(lus.current); }
  };
  useEffect(() => {
    setJoue(false); setMots(false); mesurer();
    const t1 = setTimeout(() => setMots(true), ms("slow"));
    const t2 = setTimeout(repondre, enCours ? LECTURE_MS : 1200);
    let t3: number | undefined;
    if (enCours) {
      if (temps.current) { temps.current.style.transition = "none"; temps.current.style.scale = "0 1"; requestAnimationFrame(() => requestAnimationFrame(() => { if (temps.current) { temps.current.style.transition = `scale ${SLIDE_MS}ms linear`; temps.current.style.scale = "1 1"; } })); }
      if (libre) t3 = window.setTimeout(() => { if (i + 1 < CAS.length) setI(i + 1); else { setEnCours(false); setFini(true); } }, SLIDE_MS);
      else { setEnCours(false); setFini(true); }
    }
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, enCours]);
  useEffect(() => {
    const cacher = () => { if (document.hidden && enCours) setEnCours(false); };
    document.addEventListener("visibilitychange", cacher);
    return () => document.removeEventListener("visibilitychange", cacher);
  }, [enCours]);
  const lire = () => {
    if (enCours) { setEnCours(false); if (temps.current) temps.current.style.transition = "none"; return; }
    setFini(false); setEnCours(true); if (fini || i === CAS.length - 1) setI(0);
  };
  const aller = (n: number) => { setEnCours(false); setFini(false); setI(n); };
  return (
    <div className="mv-scena" data-slide={i}>
      <p className="mv-scena-chap">Quatre situations, et une de trop</p>
      <p className="mv-scena-cpt" aria-live="polite"><b>{i + 1}</b><span>sur {CAS.length}</span></p>
      <div className="mv-scena-panneau">
        <div className={`mv-scena-mots${mots ? "" : " off"}`}>
          <p className="mv-scena-titre">{cas.vous}</p>
          <p className={`mv-scena-duree${cas.faute ? " ko" : ""}`}><b>{ms(cas.cran)} ms</b><span>{cas.faute ? "il traîne" : emploi(cas.cran)}</span></p>
          <p className="mv-scena-sous">{cas.pourquoi}</p>
        </div>
      </div>
      <div className="mv-scena-scene">
        <div ref={carte} className="mv-scena-carte" data-intent={cas.faute ? "statement" : undefined}><Objet cas={cas} joue={joue} /></div>
      </div>
      <div className="mv-player">
        <button className="mv-rond" type="button" aria-label="Situation précédente" disabled={i === 0} onClick={() => aller(i - 1)}>←</button>
        <button className={`mv-rond mv-lect${enCours ? " en-cours" : ""}${fini ? " fin" : ""}`} type="button" aria-label={enCours ? "Pause" : fini ? "Rejouer" : "Lire"} onClick={lire}>
          <svg className="ic ic-play" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11l9-5.5z" /></svg>
          <svg className="ic ic-pause" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" /></svg>
          <svg className="ic ic-re" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3a5 5 0 1 0 4.6 3h-1.7A3.4 3.4 0 1 1 8 4.6V7l3.5-3L8 1z" /></svg>
        </button>
        <button className="mv-rond" type="button" aria-label="Situation suivante" disabled={i === CAS.length - 1} onClick={() => aller(i + 1)}>→</button>
        <span className="mv-cpt">{i + 1} / {CAS.length}</span>
        <span className="mv-temps" aria-hidden="true"><i ref={temps} /></span>
      </div>
    </div>
  );
}

/* ── 03 · Dire ce qu'on voit — le lexique en gestes (verdict d'Auteur,
   7 septembre : « A »). Six tuiles, un mot chacune, ✓ ou ✗ ; dans chaque
   tuile, le même bloc joue son mot au ralenti quand on le lance. Le verdict
   de chaque tuile est déduit de ce que la feuille produit, ramené à la
   vitesse réelle. ── */
const RALENTI = 3; /* chorégraphie : chaque geste est joué trois fois plus lentement, pour qu'il se lise ; le verdict lu divise par trois */
const LEXIQUE: { cle: string; mot: string; dit: string }[] = [
  { cle: "pose", mot: "il se pose", dit: "Un fondu et un petit déplacement, sur la courbe du kit. C'est ainsi qu'une infobulle ou un dépliant entre." },
  { cle: "bouton", mot: "il sort de son bouton", dit: "Il grandit depuis presque sa taille, depuis le coin qui touche son déclencheur. On sait d'où il vient." },
  { cle: "rebond", mot: "il rebondit", dit: "Sa courbe dépasse la cible et revient : un ressort. Rien de réel ne rebondit en s'ouvrant." },
  { cle: "neant", mot: "il naît du néant", dit: "Il part de zéro — il n'existait pas une image plus tôt. Un objet réel grandit depuis presque là où il sera." },
  { cle: "milieu", mot: "il s'ouvre du milieu", dit: "Il grandit depuis son propre centre, pas depuis son déclencheur. Il n'appartient plus à ce qui l'a appelé." },
  { cle: "traine", mot: "il traîne", dit: "Le cran d'une section, 700 ms, sur un objet qu'on ouvre cent fois par jour. On l'attend." },
];
function jugerObjet(el: HTMLElement): { ok: boolean; dit: string } {
  const lu = auRepos(el, (cs) => {
    const durees = cs.transitionDuration.split(",").map((d) => enMs(d) / RALENTI);
    const depasse = Array.from(cs.transitionTimingFunction.matchAll(/cubic-bezier\(([^)]*)\)/g)).some((m) => { const n = m[1].split(",").map(Number); return n[1] > 1 || n[3] > 1; });
    const o = cs.transformOrigin.split(" ").map(parseFloat), s = cs.scale;
    return { duree: Math.max(...durees), depasse, depart: s === "none" ? null : parseFloat(s), aucoin: o[0] === 0 && o[1] === 0 };
  });
  if (lu.duree === 0) return { ok: false, dit: "aucune durée : un état remplace l'autre" };
  if (lu.depart === 0) return { ok: false, dit: `part de 0 · ${lu.duree} ms` };
  if (lu.depasse) return { ok: false, dit: `la courbe dépasse sa cible · ${lu.duree} ms` };
  if (lu.duree > ms("base")) return { ok: false, dit: `${lu.duree} ms — un objet qu'on ouvre vit à ${ms("base")}` };
  if (!lu.aucoin) return { ok: false, dit: `${lu.duree} ms, depuis le milieu — pas depuis son déclencheur` };
  return { ok: true, dit: `${lu.duree} ms · la courbe du kit${lu.depart !== null ? ` · part de ${dec(lu.depart)}` : ""} · depuis son déclencheur` };
}
function Tuile({ mot, joue, surLire }: { mot: typeof LEXIQUE[number]; joue: boolean; surLire: () => void }) {
  const obj = useRef<HTMLDivElement>(null);
  const [v, setV] = useState<{ ok: boolean; dit: string } | null>(null);
  useEffect(() => { if (obj.current) setV(jugerObjet(obj.current)); }, []);
  return (
    <div className="mv-lex" data-mot={mot.cle} data-intent={v && !v.ok ? "statement" : undefined}>
      <h3><span>{mot.mot}</span>{v && <span className={`verdict ${v.ok ? "bon" : "ko"}`} aria-hidden="true">{v.ok ? "✓" : "✗"}</span>}</h3>
      <div className="mv-lex-scene">
        <span className="mv-lex-decl" aria-hidden="true" />
        <div ref={obj} className={`mv-lex-obj${joue ? " la" : ""}`} aria-hidden="true"><i /><i /><i /></div>
      </div>
      {v && <span className={`mv-lu${v.ok ? "" : " ko"}`}>{v.dit}</span>}
      <p className="mv-lex-dit">{mot.dit}</p>
      <button type="button" className="bouton" onClick={surLire} aria-label={`Lire « ${mot.mot} »`}>{joue ? "Rejouer" : "Lire"}</button>
    </div>
  );
}
function Lexique() {
  const [joues, setJoues] = useState<boolean[]>(LEXIQUE.map(() => false));
  const timers = useRef<number[]>([]);
  const jouer = (k: number) => {
    setJoues((j) => j.map((x, n) => (n === k ? false : x)));
    requestAnimationFrame(() => requestAnimationFrame(() => setJoues((j) => j.map((x, n) => (n === k ? true : x)))));
  };
  const tout = () => {
    timers.current.forEach(clearTimeout); timers.current = [];
    setJoues(LEXIQUE.map(() => false));
    LEXIQUE.forEach((_, k) => { timers.current.push(window.setTimeout(() => jouer(k), 400 + k * 1900)); }); /* chorégraphie : un mot après l'autre, le temps de le voir */
  };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  return (
    <div className="mv-scene">
      <div className="mv-lexique" style={{ "--mv-ralenti": RALENTI } as React.CSSProperties}>
        {LEXIQUE.map((m, k) => <Tuile key={m.cle} mot={m} joue={joues[k]} surLire={() => jouer(k)} />)}
      </div>
      <button type="button" className="bouton on mv-commande" onClick={tout}>Tout lire</button>
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
  ["molette", "01", "La main invisible"],
  ["durees", "02", "Quatre situations"],
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
              On ne peut pas le regarder, seulement l&apos;attraper. C&apos;est pour ça qu&apos;on le règle
              mal : une durée de trop se sent sans se voir, une courbe héritée ne signe rien. Ici, quatre
              durées, <b>une</b> courbe, et chacune sait où elle va. Les trois scènes qui suivent se lisent
              comme un film : ce que vous ne pouvez pas voir, la page le mesure.
            </p>
          </section>

          {/* ══════════ 01 · situation — la main invisible ══════════ */}
          <section className="gdoc-sec pose" id="molette">
            <div className="gdoc-sec-tete">
              <p className="kicker">01 · La main invisible</p>
              <h2>Une valeur qu&apos;on fait glisser ne s&apos;anime pas</h2>
              <p className="sourd">Une molette promet une chose simple : ce que vous voyez est la valeur
              où est votre doigt. Si la scène porte une transition, elle traîne derrière — et vous regardez
              l&apos;animation au lieu du nombre. Ici, une main fait le geste à votre place, deux fois :
              d&apos;abord avec la faute, puis comme il faut.</p>
            </div>
            <div className="gdoc-corps">
              <figure className="gd-figure">
                <div className="banc primaire">
                  <Molette />
                </div>
                <figcaption className="gd-legende">
                  une main, une barre, deux passages · d&apos;abord {ms("slow")} ms sur la valeur qu&apos;on tient, puis aucune transition —
                  le rouge est l&apos;écart rendu entre la barre et la main, son chiffre est lu, pas décrété
                </figcaption>
              </figure>
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <p>Le jumeau du verdict du 2 septembre, « une molette ne repeint que sa scène » : là on
                empêchait la page de bouger, ici on empêche la scène de mentir sur le nombre.</p>
                <Regles ids={["m4", "m5"]} />
              </div></details>
            </div>
          </section>

          {/* ══════════ 02 · variation — quatre situations ══════════ */}
          <section className="gdoc-sec pose" id="durees">
            <div className="gdoc-sec-tete">
              <p className="kicker">02 · Quatre situations</p>
              <h2>Une durée n&apos;est pas un goût, c&apos;est une taille</h2>
              <p className="sourd">À cent millisecondes, on ne voit rien : on sent. C&apos;est la taille
              d&apos;un bouton. À sept cents, on attend : c&apos;est la taille d&apos;une section qui
              arrive. Entre les deux, le menu et le panneau. Quatre situations, quatre tailles — et une
              cinquième, où la taille n&apos;est pas la bonne.</p>
            </div>
            <div className="gdoc-corps">
              <figure className="gd-figure">
                <Situations surMesure={setMesures} />
                <figcaption className="gd-legende">
                  {mesures.length
                    ? `${mesures.map((m) => fmt(m)).join(" · ")} ms, lus sur le rendu · quatre objets, une courbe — chacun prend la durée de son emploi`
                    : "quatre objets, une courbe — chacun prend la durée de son emploi"}
                </figcaption>
              </figure>
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <p>La durée se déduit de l&apos;objet et de la fréquence du geste, jamais de l&apos;humeur
                de celui qui écrit la ligne. Le cran de {ms("expressive")} n&apos;est pas une réponse
                d&apos;interface : c&apos;est une découverte au défilement.</p>
                <Regles ids={["m3", "m10", "m2"]} />
              </div></details>
            </div>
          </section>

          {/* ══════════ 03 · vocabulaire — le lexique en gestes ══════════ */}
          <section className="gdoc-sec pose" id="mots">
            <div className="gdoc-sec-tete">
              <p className="kicker">03 · Dire ce qu&apos;on voit</p>
              <h2>On ne gouverne pas ce qu&apos;on ne sait pas nommer</h2>
              <p className="sourd">« Ça fait bizarre » n&apos;est pas un verdict. Un mouvement se décrit
              avec des mots précis, et chaque mot est déjà une règle, tenue ou cassée. Voici le lexique :
              six mots, et le même objet qui joue chacun d&apos;eux.</p>
            </div>
            <div className="gdoc-corps">
              <figure className="gd-figure">
                <Lexique />
                <figcaption className="gd-legende">
                  six mots, six tuiles, le même objet · joué au ralenti ×{RALENTI} pour que le geste se lise · le verdict de chaque tuile est déduit
                  de la durée, de la courbe, du départ et de l&apos;origine — lus sur le rendu, ramenés à la vitesse réelle
                </figcaption>
              </figure>
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <p>Le septième mot, « il saute », n&apos;a rien à montrer : un état remplace l&apos;autre,
                sans passage. Ce qu&apos;on sait nommer, on peut le corriger.</p>
                <Regles ids={["m6", "m7", "m2", "m3"]} />
              </div></details>
            </div>
          </section>

          {/* ══════════ 04 · répertoire ══════════ */}
          <section className="gdoc-sec pose" id="casser">
            <div className="gdoc-sec-tete">
              <p className="kicker">04 · Les règles qu&apos;on peut casser</p>
              <h2>Voyez ce qui se passe quand la règle saute</h2>
              <p className="sourd">Aucune de ces fautes ne déclenche d&apos;erreur. Elles se sentent
              avant de se voir. Alors le juste et le faux jouent côte à côte, au même instant, et chaque
              colonne lit ce qu&apos;elle joue.</p>
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
