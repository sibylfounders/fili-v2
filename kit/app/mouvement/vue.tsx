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

   · LES PREUVES (01 à 03) — sans gabarit, sur la scène de nuit (verdicts
     d'Auteur du 7 septembre, d'après les vidéos de Sajid : un seul objet,
     gros, sur le noir ; la valeur écrite à côté de la chose ; l'objet se
     transforme tout seul et le sous-titre explique) : LA MOLETTE QUI MENT
     (situation — une main dessinée fait glisser la jauge d'un témoin, la
     barre du bas traîne, l'écart se peint en rouge et se MESURE, trois
     sous-titres) ; QUATRE DURÉES (variation — quatre situations en conseil,
     l'objet qui répond pour de vrai, puis une taille de trop) ; DO / DON'T
     (vocabulaire — le même menu deux fois au même instant, quatre choses à
     comparer, le verdict de chaque colonne déduit de la feuille). Les deux
     boucles se figent sous mouvement réduit et s'avancent alors à la main.
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
/* ── La boucle. Une preuve qui se joue toute seule est une suite d'étapes ;
   la boucle avance d'elle-même quand le mouvement est libre, et se fige
   sous mouvement réduit — on avance alors à la main, une étape par appui.
   Elle se met en pause quand l'onglet n'est plus visible, et au clic.
   Les tempos de la boucle sont une chorégraphie (verdict d'Auteur,
   7 septembre : « une petite animation automatique, c'est bien plus
   parlant ») ; ce qui bouge à l'écran prend les jetons du kit. ── */
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
function useBoucle(n: number, periode: (i: number) => number) {
  const [i, setI] = useState(0);
  const [pause, setPause] = useState(false);
  const [visible, setVisible] = useState(true);
  const libre = useLibre();
  useEffect(() => {
    const lire = () => setVisible(!document.hidden);
    lire(); document.addEventListener("visibilitychange", lire);
    return () => document.removeEventListener("visibilitychange", lire);
  }, []);
  const avancer = () => setI((x) => (x + 1) % n);
  useEffect(() => {
    if (!libre || pause || !visible) return;
    const t = setTimeout(avancer, periode(i));
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, pause, visible, libre, n]);
  return { i, avancer, aller: (x: number) => setI(x % n), pause, setPause, libre };
}
/* La commande de la boucle : pause et lecture quand elle tourne seule ;
   « étape suivante » quand le mouvement est réduit. */
function Commande({ b }: { b: ReturnType<typeof useBoucle> }) {
  return b.libre
    ? <button type="button" className="bouton mv-commande" aria-pressed={b.pause} onClick={() => b.setPause(!b.pause)}>{b.pause ? "Lecture" : "Pause"}</button>
    : <button type="button" className="bouton mv-commande" onClick={b.avancer}>Étape suivante</button>;
}
/* Deux images qu'on rejoue : on retire l'état, on laisse passer une image, on le remet. */
function rejouer(setEtat: (v: boolean) => void) {
  setEtat(false);
  return requestAnimationFrame(() => requestAnimationFrame(() => setEtat(true)));
}

/* ── 01 · La molette qui ment — la main invisible. La fiche du témoin en
   grand ; une main dessinée fait glisser la jauge ; sous la piste, la barre
   qui suit et la barre qui traîne, et l'écart entre elles se peint en rouge
   tant qu'il existe, son chiffre lu sur le rendu. Sans voix, c'est le
   sous-titre qui explique : trois, un par étape. ── */
const V0 = 22, V1 = 84; /* chorégraphie : les deux positions de la main */
const GLISSE_MS = 1600; /* chorégraphie : le temps que met la main */
function Main() {
  return (
    <svg className="mv-main-dessin" viewBox="0 0 24 32" aria-hidden="true">
      <path d="M9 2.5c0-1.4 2.6-1.4 2.6 0V14l1.2-.4c.9-.3 1.7.1 2 .9l.3.8 1.1-.5c.9-.4 1.9 0 2.2.9l.2.6 1.3-.3c1-.2 1.9.5 1.9 1.5v6.2c0 3.6-2.9 6.3-6.5 6.3h-2.6c-2 0-3.9-.9-5.1-2.5L2.3 22c-.7-.9-.5-2.1.4-2.7.8-.6 1.9-.4 2.5.4L7 21.5V2.5z" />
    </svg>
  );
}
function Molette() {
  const b = useBoucle(3, (i) => [GLISSE_MS + ms("slow") + 300, 2000, 2400][i]);
  const [v, setV] = useState(V0);
  const [saut, setSaut] = useState(true);
  const juste = useRef<HTMLDivElement>(null), faux = useRef<HTMLDivElement>(null), piste = useRef<HTMLDivElement>(null);
  const [ecart, setEcart] = useState({ de: 0, a: 0, px: 0 });
  const [pic, setPic] = useState(0);
  /* étape 0 : la main revient au départ sans se jouer, puis glisse — libre,
     image par image ; réduite, elle saute (un déplacement ne se joue pas) */
  useEffect(() => {
    if (b.i !== 0) return;
    let vivant = true;
    setSaut(true); setV(V0); setPic(0);
    const depart = requestAnimationFrame(() => requestAnimationFrame(() => {
      if (!vivant) return;
      setSaut(false);
      if (!b.libre) { setV(V1); return; }
      const debut = performance.now();
      const pas = (t: number) => {
        if (!vivant) return;
        const k = Math.min(1, (t - debut) / GLISSE_MS);
        setV(Math.round(V0 + (V1 - V0) * k));
        if (k < 1) requestAnimationFrame(pas);
      };
      requestAnimationFrame(pas);
    }));
    return () => { vivant = false; cancelAnimationFrame(depart); };
  }, [b.i, b.libre]);
  /* le mensonge, lu : tant que les deux barres diffèrent, on lit leurs largeurs à chaque image */
  useEffect(() => {
    let vivant = true; let max = 0;
    const lire = () => {
      if (!vivant || !juste.current || !faux.current || !piste.current) return;
      const L = piste.current.getBoundingClientRect().width || 1;
      const j = juste.current.getBoundingClientRect().width, f = faux.current.getBoundingClientRect().width;
      const e = Math.abs(j - f); max = Math.max(max, e);
      setEcart({ de: (Math.min(j, f) / L) * 100, a: (Math.max(j, f) / L) * 100, px: e });
      if (e > 0.5) requestAnimationFrame(lire); else if (max > 0.5) setPic((p) => Math.max(p, max));
    };
    requestAnimationFrame(lire);
    return () => { vivant = false; };
  }, [v]);
  const ment = ecart.px > 0.5;
  const style = { "--mv-w": `${v}%`, "--mv-de": `${ecart.de}%`, "--mv-l": `${Math.max(0, ecart.a - ecart.de)}%` } as React.CSSProperties;
  const sousTitre = b.i === 0
    ? (ment ? `la main glisse — la barre du bas traîne : ${fmt(ecart.px)} px derrière` : "la main glisse")
    : b.i === 1
      ? (pic > 0.5 ? `la main s'est arrêtée — la barre du bas a menti de ${fmt(pic)} px au plus` : "la main s'est arrêtée")
      : "une valeur qu'on fait glisser ne s'anime pas";
  return (
    <div className="mv-scene" style={style} data-etape={b.i}>
      <div className="mv-fiche" role="img" aria-label={`Fiche du témoin Léa Fontan, crédibilité ${v} pour cent ; la barre animée est ${ment ? `${fmt(ecart.px)} pixels derrière` : "à la valeur"}`}>
        <div className="mv-fiche-tete">
          <span className="mv-avatar" aria-hidden="true">LF</span>
          <span className="mv-fiche-nom"><b>Léa Fontan</b><span>Témoin · entendue le 12 mai</span></span>
          <output className="mv-fiche-nombre">{v} %</output>
        </div>
        <div className="mv-pile">
          <span className="mv-pile-dit">Crédibilité</span>
          <div ref={piste} className="mv-piste">
            <span className="mv-trace" />
            <span className={`mv-doigt${b.libre && b.i === 0 && !saut ? " glisse" : ""}`}><Main /></span>
          </div>
          <p className="mv-verdict-tete mv-pile-dit"><span className="verdict bon" aria-hidden="true">✓</span><span>à la valeur</span></p>
          <div className="mv-jauge-piste"><div ref={juste} className="mv-jauge-barre" /></div>
          <p className="mv-verdict-tete mv-pile-dit"><span className="verdict ko" aria-hidden="true">✗</span><span>animée</span></p>
          <div className="mv-jauge-piste" data-intent="statement">
            <div ref={faux} className={`mv-jauge-barre ment${saut ? " saut" : ""}`} />
            <span className="mv-mensonge" hidden={!ment} />
            <span className="mv-mensonge-cote" hidden={!ment}>{fmt(ecart.px)} px</span>
          </div>
        </div>
      </div>
      <p className={`mv-sous-titre${b.i === 2 ? " regle" : ment ? " ko" : ""}`} aria-live="polite">{sousTitre}</p>
      <Commande b={b} />
    </div>
  );
}

/* ── 02 · Quatre durées — la situation d'abord. Quatre cas concrets, l'un
   après l'autre, en conseil : ce que vous faites, l'objet qui répond, la
   durée qu'il prend et pourquoi cette taille-là. Cinquième cas : un menu
   au cran expressif — il traîne. Les durées sont lues au moteur ; ce que
   chaque objet joue est lu sur le rendu. ── */
type Cas = { cran: Cran; vous: string; pourquoi: string; faute?: boolean };
const CAS: Cas[] = [
  { cran: "fast", vous: "Vous survolez un bouton", pourquoi: "Un survol répond, il ne se regarde pas. Au-delà de 160 ms, la couleur poursuit le curseur au lieu de le suivre." },
  { cran: "base", vous: "Vous ouvrez un menu", pourquoi: "Un menu s'ouvre des dizaines de fois par jour : assez long pour être vu, trop court pour être attendu." },
  { cran: "slow", vous: "Vous ouvrez un panneau", pourquoi: "Un panneau change l'écran. Il a besoin d'un passage, sinon l'état d'avant disparaît sans qu'on sache où il est allé." },
  { cran: "expressive", vous: "Une section arrive au défilement", pourquoi: "Une découverte, pas une réponse : elle peut prendre son temps. Le plafond des réponses d'interface ne la vise pas." },
  { cran: "expressive", vous: "Vous ouvrez un menu… à 700 ?", pourquoi: "Le cran d'une section sur un objet qu'on ouvre cent fois par jour : on l'attend.", faute: true },
];
function QuatreDurees({ surMesure }: { surMesure: (m: number[]) => void }) {
  const b = useBoucle(CAS.length, (i) => ms(CAS[i].cran) + 2600);
  const cas = CAS[b.i];
  const [joue, setJoue] = useState(false);
  const objet = useRef<HTMLDivElement>(null);
  const lus = useRef<number[]>([]);
  useEffect(() => {
    const r = rejouer(setJoue);
    const lecture = setTimeout(() => {
      if (!objet.current) return;
      const cible = objet.current.querySelector<HTMLElement>("[data-joue]");
      if (!cible) return;
      const d = enMs(getComputedStyle(cible).transitionDuration.split(",")[0]);
      if (!lus.current.includes(d)) { lus.current = [...lus.current, d]; surMesure(lus.current); }
    }, 60);
    return () => { cancelAnimationFrame(r); clearTimeout(lecture); };
  }, [b.i, surMesure]);
  return (
    <div className="mv-scene" data-etape={b.i}>
      <div className="mv-cas">
        <div className="mv-cas-dire">
          <p className="mv-cas-vous">{cas.vous}</p>
          <p className={`mv-cas-duree${cas.faute ? " ko" : ""}`}><b>{ms(cas.cran)} ms</b><span>{cas.faute ? "il traîne" : emploi(cas.cran)}</span></p>
          <p className="mv-cas-pourquoi">{cas.pourquoi}</p>
        </div>
        <div ref={objet} className="mv-cadre" data-cran={cas.cran} data-intent={cas.faute ? "statement" : undefined}>
          {b.i === 0 && (
            <button type="button" className={`bouton mv-obj-bouton${joue ? " survole" : ""}`} data-joue tabIndex={-1}>Enregistrer</button>
          )}
          {(b.i === 1 || b.i === 4) && (
            <div className="mv-scene-menu">
              <button type="button" className="bouton" aria-expanded={joue} tabIndex={-1}>Actions du témoin</button>
              <div className={`mv-menu${cas.faute ? " traine" : ""}${joue ? " ouvert" : ""}`} role="menu" aria-hidden={!joue} data-joue>
                <span className="mv-menu-item" role="menuitem">Entendre à nouveau</span>
                <span className="mv-menu-item" role="menuitem">Confronter</span>
                <span className="mv-menu-item danger" role="menuitem">Récuser</span>
              </div>
            </div>
          )}
          {b.i === 2 && (
            <div className="mv-obj-ecran">
              <span className="mv-obj-ligne large" /><span className="mv-obj-ligne" /><span className="mv-obj-ligne courte" />
              <div className={`mv-panneau${joue ? " ouvert" : ""}`} data-joue aria-hidden={!joue}>
                <b>Récuser le témoin ?</b><span>Le témoignage sera retiré du dossier.</span>
                <span className="mv-panneau-actions"><span className="bouton on">Récuser</span><span className="bouton">Annuler</span></span>
              </div>
            </div>
          )}
          {b.i === 3 && (
            <div className={`mv-obj-section${joue ? " la" : ""}`} data-joue aria-hidden={!joue}>
              <b>Les témoins entendus</b><span className="mv-obj-ligne large" /><span className="mv-obj-ligne" /><span className="mv-obj-ligne courte" />
            </div>
          )}
        </div>
      </div>
      <Commande b={b} />
    </div>
  );
}

/* ── 03 · Dire ce qu'on voit — Do / Don't. Deux colonnes fixes, le même
   menu de chaque côté ; on choisit ce qu'on compare (la durée, la courbe,
   le départ, l'origine) et les deux menus se rejouent en même temps : à
   gauche la règle tenue, à droite la faute qui lui répond. La légende de
   chaque colonne est lue sur le rendu. ── */
const CHOIX: { cle: string; nom: string; faute: string; mot: string }[] = [
  { cle: "duree", nom: "La durée", faute: "traine", mot: "il traîne" },
  { cle: "courbe", nom: "La courbe", faute: "rebond", mot: "il rebondit" },
  { cle: "depart", nom: "Le départ", faute: "neant", mot: "il naît du néant" },
  { cle: "origine", nom: "L'origine", faute: "milieu", mot: "il s'ouvre du milieu" },
];
function MenuTemoin({ classe, ouvert, refMenu }: { classe?: string; ouvert: boolean; refMenu: React.RefObject<HTMLDivElement> }) {
  return (
    <div className="mv-scene-menu">
      <button type="button" className="bouton" aria-expanded={ouvert} tabIndex={-1}>Actions du témoin</button>
      <div ref={refMenu} className={`mv-menu${classe ? ` ${classe}` : ""}${ouvert ? " ouvert" : ""}`} role="menu" aria-hidden={!ouvert}>
        <span className="mv-menu-item" role="menuitem">Entendre à nouveau</span>
        <span className="mv-menu-item" role="menuitem">Confronter à un autre témoin</span>
        <span className="mv-menu-item danger" role="menuitem">Récuser</span>
      </div>
    </div>
  );
}
function DoDont() {
  const [choix, setChoix] = useState(0);
  const [ouvert, setOuvert] = useState(false);
  const bon = useRef<HTMLDivElement>(null), mauvais = useRef<HTMLDivElement>(null);
  const [lus, setLus] = useState<{ bon: { ok: boolean; dit: string }; mauvais: { ok: boolean; dit: string } } | null>(null);
  const jouer = (i: number) => { setChoix(i); rejouer(setOuvert); };
  useEffect(() => {
    const r = rejouer(setOuvert);
    if (bon.current && mauvais.current) {
      const lire = (el: HTMLElement) => { const lu = lireMenu(el); const o = lu.origine.split(" ").map(parseFloat); return juger(lu, o[0] === 0 && o[1] === 0); };
      setLus({ bon: lire(bon.current), mauvais: lire(mauvais.current) });
    }
    return () => cancelAnimationFrame(r);
  }, [choix]);
  const c = CHOIX[choix];
  return (
    <div className="mv-scene">
      <div className="mv-choix" role="group" aria-label="Ce qu'on compare">
        {CHOIX.map((x, i) => (
          <button key={x.cle} type="button" className={`bouton${choix === i ? " on" : ""}`} aria-pressed={choix === i} onClick={() => jouer(i)}>{x.nom}</button>
        ))}
      </div>
      <div className="mv-duo">
        <div className="mv-cote">
          <p className="mv-verdict-tete"><span className={`verdict ${lus?.bon.ok === false ? "ko" : "bon"}`} aria-hidden="true">{lus?.bon.ok === false ? "✗" : "✓"}</span><span>il se pose</span></p>
          <MenuTemoin ouvert={ouvert} refMenu={bon} />
          <span className="mv-lu" data-verdict={lus?.bon.ok === false ? "ko" : "bon"}>{lus?.bon.dit}</span>
        </div>
        <div className="mv-cote" data-intent="statement">
          <p className="mv-verdict-tete"><span className={`verdict ${lus?.mauvais.ok ? "bon" : "ko"}`} aria-hidden="true">{lus?.mauvais.ok ? "✓" : "✗"}</span><span>{c.mot}</span></p>
          <MenuTemoin classe={c.faute} ouvert={ouvert} refMenu={mauvais} />
          <span className="mv-lu" data-verdict={lus?.mauvais.ok ? "bon" : "ko"}>{lus?.mauvais.dit}</span>
        </div>
      </div>
      <button type="button" className="bouton mv-commande" onClick={() => jouer(choix)}>Rejouer</button>
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
              une interface qui bouge partout finit par ne plus rien dire. Ici, quatre
              durées, <b>une</b> courbe, et chacune sait où elle va. Ce que vous ne pouvez pas voir, la page le mesure pour vous.
            </p>
          </section>

          {/* ══════════ 01 · situation ══════════ */}
          <section className="gdoc-sec pose" id="molette">
            <div className="gdoc-sec-tete">
              <p className="kicker">01 · La molette qui ment</p>
              <h2>Une valeur qu&apos;on fait glisser ne s&apos;anime pas</h2>
              <p className="sourd">Une molette promet une chose simple : ce que vous voyez est la valeur
              où est votre doigt. Dès que la scène porte une transition, elle traîne derrière — et vous
              regardez l&apos;animation au lieu du nombre. La démonstration cesse de démontrer. Regardez la
              main glisser : la barre du bas court après elle, et l&apos;écart est mesuré à chaque image.</p>
            </div>
            <div className="gdoc-corps">
              <figure className="gd-figure">
                <div className="banc noir" data-theme="dark">
                  <Molette />
                </div>
                <figcaption className="gd-legende">
                  une main, deux barres · en haut aucune transition sur la largeur réglée · en bas {ms("slow")} ms
                  sur la valeur qu&apos;on tient — le rouge est l&apos;écart rendu, son chiffre est lu, pas décrété
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
              <p className="sourd">À cent millisecondes on ne le voit pas, on le sent : c&apos;est la
              taille d&apos;un bouton. À sept cents, on l&apos;attend : c&apos;est la taille d&apos;une
              section qui arrive. Entre les deux, le menu et le panneau. Quatre situations, quatre
              tailles — et une cinquième, où la taille n&apos;est pas la bonne.</p>
            </div>
            <div className="gdoc-corps">
              <figure className="gd-figure">
                <div className="banc noir" data-theme="dark">
                  <QuatreDurees surMesure={setMesures} />
                </div>
                <figcaption className="gd-legende">
                  {mesures.length
                    ? `${mesures.map((m) => fmt(m)).join(" · ")} ms, lus sur le rendu · quatre objets, une courbe — chacun prend la durée de son emploi`
                    : "quatre objets, une courbe — chacun prend la durée de son emploi"}
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
              avec des mots précis — il se pose, il rebondit, il naît du néant, il s&apos;ouvre du
              milieu — et chaque mot est déjà une règle, tenue ou cassée. Le même menu deux fois, au
              même instant : à gauche la règle, à droite le mot qui la casse, et la page lit dans la
              feuille ce que chacun produit vraiment.</p>
            </div>
            <div className="gdoc-corps">
              <figure className="gd-figure">
                <div className="banc noir" data-theme="dark">
                  <DoDont />
                </div>
                <figcaption className="gd-legende">
                  le même menu deux fois · quatre choses à comparer · le verdict de chaque colonne est déduit de la
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
