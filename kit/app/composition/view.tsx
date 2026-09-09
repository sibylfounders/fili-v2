"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { RailDoc, useDocSections, type Toc } from "../rail";
import { PanelCode } from "../preview";
import { useAdaptation } from "../adaptation";
import { Bands, Band, Demo, DemoSides, DemoSide, DemoScene, ListRules } from "../levels";
import type { LineList } from "../levels";
import type { ReactNode } from "react";

/* ═══════════════════════════════════════════════════════════════════════
   PAGE COMPOSITION — gabarit « documentaire nu ».
   Pièce de référence : kit-composition-nu.html (verdict d'Auteur, 24 août).

   Le sujet de cette page n'est pas une matière — des lettres, des
   distances, des couleurs — c'est LE REGARD. Trois preuves, trois natures,
   et surtout TROIS OBJETS DIFFÉRENTS : la faute commise pendant la séance
   a été de faire servir le même écran à toutes les preuves.
   · OBJET VIVANT — une interface de travail qu'on casse, une faute à la
     fois ; les repères se posent sur le composant, aux coordonnées
     relevées, et le survol la répare.
   · SITUATION — une page de journal et une affiche : la densité décide du
     parcours de l'œil, et le tracé le rejoue en boucle.
   · MATIÈRE — une page de magazine : l'encre est couverte de taches
     mesurées, et l'espace blanc apparaît pour ce qu'il est.
   Puis les deux étages du gabarit commun (versés le 7 septembre 2026
   depuis la page d'essai, jugée sur pièce) : en bandes, quatre lois qui
   se VOIENT — le bon et le mauvais côte à côte, le même objet deux fois,
   une seule chose qui change ; en liste, celles qu'aucune image ne
   prouve, avec la page qui les tient. Les quinze lois du fonds sont
   toutes là : cinq sur l'écran de la preuve 01, une par preuve 02 et 03,
   quatre en bandes, quatre en liste — la table qui les répétait a disparu.
   Enfin l'adaptation : le même écran, écrit dans votre stack — la
   composition n'a pas de token à elle, elle dépense ceux des autres
   familles, dans un ordre.
   ═══════════════════════════════════════════════════════════════════════ */

const TOC: Toc = [
  ["broken", "01", "L'écran qu'on casse"],
  ["journey", "02", "Le chemin de l'œil"],
  ["blanc", "03", "L'espace blanc"],
  ["registry", "04", "Le registre"],
  ["code", "05", "Le code"],
];

const px = (n: number) => `${Math.round(n)}px`;

/* ══ OBJET 1 · une interface de travail ═══════════════════════════════ */
function Application({ fault }: { fault: string }) {
  return (
    <div className={`co-app ${fault}`}>
      <div className="co-app-head"><i /><b>Conformité</b></div>
      <div className="co-app-body">
        <div className="co-b co-kpi">
          <span className="co-label">Dossiers à valider</span><b>34</b>
          <span className="co-sub">dont 6 en retard</span>
        </div>
        <div className="co-b co-cta">
          <span className="co-b1">Valider</span><span className="co-b2">Exporter</span>
        </div>
        <div className="co-b co-list">
          <span className="co-label">Derniers dossiers</span>
          {[["Meunier SAS", "62 %"], ["Atelier Vidal", "100 %"], ["Groupe Ferrand", "38 %"]].map(([n, p]) => (
            <span key={n} className="co-li"><i />{n}<span className="co-pct">{p}</span></span>
          ))}
        </div>
        <div className="co-b">
          <span className="co-label">Affichage</span>
          <span className="co-field">Trier par : date</span>
          <span className="co-field">Densité : confortable</span>
        </div>
      </div>
    </div>
  );
}

type Fault = { key: string; name?: string; verdict: string; prompt?: string; solution: string; says: string };
const FAULTS: Fault[] = [
  { key: "", verdict: "Rien de cassé : un dominant, trois groupes, un seul axe",
    prompt: "↑ chaque mot est relié à ce qu'il nomme", solution: "",
    says: "L'écran de départ : le chiffre entre en premier, les groupes sont faits par l'écart seul, et tout part de la même verticale." },
  { key: "f-dominant", name: "deux dominants", verdict: "Faux · deux dominants, c'est aucun",
    solution: "Réparé · un seul corps maximal",
    says: "Le titre de la liste a pris le corps du chiffre — rien d'autre n'a changé. L'œil hésite désormais entre deux entrées, et une hésitation de plus est une décision de moins." },
  { key: "f-partition", name: "tout cloisonné", verdict: "Faux · quatre surfaces pour des groupes que le blanc faisait déjà",
    solution: "Réparé · les quatre cadres retirés",
    says: "Une surface se mérite : elle n'apparaît que là où l'écart ne suffit pas à faire le groupe. Ici les quatre cadres n'ajoutent aucune information — ils ajoutent quatre traits." },
  { key: "f-equi", name: "écarts tous égaux", verdict: "Faux · dedans et dehors mesurent pareil",
    solution: "Réparé · l'écart entre groupes triplé",
    says: "Les cotes relevées sur le rendu le disent : l'écart entre deux groupes vaut celui qui sépare deux lignes d'un même groupe. C'est l'erreur canonique des formulaires." },
  { key: "f-axes", name: "quatre axes", verdict: "Faux · quatre départs différents",
    solution: "Réparé · les blocs ramenés sur la même verticale",
    says: "Les fils sont posés aux bords gauches réels des blocs. Deux départs à moins de trois pixels comptent pour un seul axe : l'œil ne les distingue pas, la mesure non plus." },
  { key: "f-rupture", name: "la rupture partout", verdict: "Faux · si tout rompt, rien ne rompt",
    solution: "Réparé · l'accent rendu à un seul élément",
    says: "La couleur d'accent est une monnaie : elle se dépense une fois par écran. Posée partout, elle ne désigne plus rien — et le bouton qui devait décider devient un décor parmi d'autres." },
];

/* Le calque : il ne décrit pas la faute, il la montre là où elle est. */
function Overlay({ fault, holder }: { fault: string; holder: React.RefObject<HTMLDivElement | null> }) {
  const [html, setHtml] = useState("");
  const set = useCallback(() => {
    const ec = holder.current?.querySelector<HTMLElement>(".co-app");
    if (!ec) return;
    const base = ec.getBoundingClientRect();
    const rect = (el: Element) => {
      const r = el.getBoundingClientRect();
      return { x: r.left - base.left, y: r.top - base.top, w: r.width, h: r.height, b: r.bottom - base.top };
    };
    const out: string[] = [];
    const frame = (el: Element | null, text: string) => {
      if (!el) return;
      const r = rect(el);
      out.push(`<span class="co-r-frame" style="left:${px(r.x - 4)};top:${px(r.y - 4)};width:${px(r.w + 8)};height:${px(r.h + 8)}"></span>`);
      if (text) out.push(`<span class="co-r-label" style="left:${px(Math.max(r.x - 4, 2))};top:${px(r.y < 18 ? r.b + 12 : r.y - 11)}">${text}</span>`);
    };
    const blocks = Array.from(ec.querySelectorAll(".co-app-body > .co-b"));
    /* Un bloc occupe toute la largeur ; son TEXTE, non. Pour poser une
       étiquette dans le vide, c'est le texte qu'il faut mesurer. */
    const endText = (el: Element) => {
      const g = document.createRange(); g.selectNodeContents(el);
      return g.getBoundingClientRect().right - base.left;
    };
    /* Les blancs de la carte : trois entre les blocs, un en bas. Ce sont
       les seuls endroits où une étiquette ne recouvre jamais rien. */
    const whites = () => {
      const t: number[] = [];
      for (let i = 0; i < blocks.length - 1; i++) t.push((rect(blocks[i]).b + rect(blocks[i + 1]).y) / 2);
      t.push((rect(blocks[blocks.length - 1]).b + base.height) / 2);
      return t;
    };

    if (fault === "f-dominant") {
      /* L'étiquette se pose APRÈS le texte qu'elle désigne ; si le corps a
         tellement grossi qu'il ne reste plus de place, elle passe dessous. */
      const toName = (el: Element | null) => {
        if (!el) return;
        frame(el, "");
        const r = rect(el), f = endText(el);
        const wide = f + 12 > base.width - 84;
        out.push(`<span class="co-r-label" style="left:${px(wide ? r.x : f + 12)};top:${px(wide ? r.b + 14 : r.y + r.h / 2)}">dominant</span>`);
      };
      toName(ec.querySelector(".co-kpi b"));
      toName(ec.querySelector(".co-list .co-label"));
    }
    if (fault === "f-partition") {
      blocks.forEach((b) => frame(b, ""));
      frame(blocks[1], "le blanc suffisait");
    }
    if (fault === "f-equi") {
      /* Les quatre cotes sur UNE seule verticale, dans le vide à droite de
         la carte : c'est l'alignement qui rend les quatre nombres
         comparables d'un coup d'œil. Le nombre s'écrit à gauche de sa cote,
         là où aucun contenu ne va. */
      const col = base.width - 96;
      const grade = (top: number, bottom: number, text: string) => {
        const h = Math.max(bottom - top, 1);
        out.push(`<span class="co-r-side" style="left:${px(col)};top:${px(top)};height:${px(h)}"></span>`);
        out.push(`<span class="co-r-label end" style="left:${px(col - 8)};top:${px(top + h / 2)}">${text}</span>`);
      };
      for (let i = 0; i < blocks.length - 1; i++) {
        const a = rect(blocks[i]), b = rect(blocks[i + 1]);
        grade(a.b, b.y, `${Math.round(Math.max(b.y - a.b, 1))}`);
      }
      const l = Array.from(ec.querySelectorAll(".co-list .co-li"));
      const a = rect(l[0]), b = rect(l[1]);
      grade(a.b, b.y, `${Math.round(Math.max(b.y - a.b, 1))} · dans le groupe`);
    }
    if (fault === "f-axes") {
      const axes: number[] = [];
      blocks.forEach((b) => {
        const x = Math.round(rect(b).x);
        if (!axes.some((u) => Math.abs(u - x) < 3)) axes.push(x);
      });
      /* Quatre étiquettes au même endroit ne se lisent pas. Chacune
         descend dans un blanc différent de la carte, collée à SON fil. */
      const holes = whites();
      axes.sort((a, b) => a - b).forEach((x, i) => {
        out.push(`<span class="co-r-thread" style="left:${px(x)};top:0;height:100%"></span>`);
        const y = holes[i] ?? 14 + i * 20;
        out.push(`<span class="co-r-label" style="left:${px(x + 5)};top:${px(y)}">axe ${i + 1}</span>`);
      });
    }
    if (fault === "f-rupture") {
      const targets = ec.querySelectorAll(".co-label, .co-b1, .co-b2, .co-pct, .co-app-head b");
      targets.forEach((el) => {
        const r = rect(el);
        out.push(`<span class="co-r-bullet" style="left:${px(Math.max(r.x - 12, 3))};top:${px(r.y + r.h / 2)}"></span>`);
      });
      const r = rect(ec.querySelector(".co-b2")!);
      out.push(`<span class="co-r-label" style="left:${px(r.x + r.w + 10)};top:${px(r.y + r.h / 2)}">l'accent, dépensé ${targets.length} fois</span>`);
    }
    setHtml(out.join(""));
  }, [fault, holder]);

  useEffect(() => {
    const t = setTimeout(set, 0);
    window.addEventListener("resize", set);
    return () => { clearTimeout(t); window.removeEventListener("resize", set); };
  }, [set]);

  return <div className="co-overlay" dangerouslySetInnerHTML={{ __html: html }} />;
}

/* ══ LA LÉGENDE · le vocabulaire relié à ce qu'il nomme ══════════════
   Le mot n'est plus posé SUR l'écran — il est posé à côté, et un filet le
   relie à son organe. Trois mots à droite ; le quatrième sous la carte,
   parce que l'axe est une verticale et qu'elle descend jusqu'à lui.
   Aucun numéro à retenir : le trait fait le lien. Tout est calculé en
   pixels réels sur le banc, et refait à chaque changement de largeur. */
const LEXICON: [string, string][] = [
  ["le dominant", "ce qui se lit en premier. Il y en a un — jamais deux, jamais zéro."],
  ["l'espace blanc", "ce qui fait le travail. Il sépare avant le trait, et il groupe avant la carte."],
  ["le groupe", "ce que l'œil réunit sans qu'on le lui dise, par la proximité ou par une surface partagée."],
];
const AXIS: [string, string] = ["l'axe de départ",
  "la verticale d'où les contenus commencent. Deux ou trois par vue ; au-delà, ça flotte."];

type Drawing = { w: number; h: number; axis: string; bridles: string[]; hairlines: string[]; points: { x: number; y: number }[] };

function Caption({ bench, active }: { bench: React.RefObject<HTMLDivElement | null>; active: boolean }) {
  const [d, setD] = useState<Drawing | null>(null);
  const set = useCallback(() => {
    const b = bench.current;
    const ec = b?.querySelector<HTMLElement>(".co-app");
    const foot = b?.querySelector<HTMLElement>(".co-lex-foot");
    const dl = b?.querySelector<HTMLElement>(".co-lex");
    const words = b ? Array.from(b.querySelectorAll<HTMLElement>(".co-lex > div")) : [];
    if (!b || !ec || !foot || !dl || words.length < 3) return setD(null);
    if (!active) { delete dl.dataset.set; words.forEach((m) => { m.style.top = ""; }); return setD(null); }
    const base = b.getBoundingClientRect();
    /* Un demi-pixel : un trait de 1 px posé sur un entier se rend flou. */
    const half = (n: number) => Math.round(n) + 0.5;
    const r = (el: Element) => {
      const q = el.getBoundingClientRect();
      return { x: q.left - base.left, y: q.top - base.top, w: q.width, h: q.height,
               d: q.right - base.left, b: q.bottom - base.top };
    };
    /* Le chiffre occupe un bloc pleine largeur : on mesure son TEXTE. */
    const text = (el: Element) => {
      const g = document.createRange(); g.selectNodeContents(el);
      const q = g.getBoundingClientRect();
      return { d: q.right - base.left, m: q.top + q.height / 2 - base.top };
    };
    const a = r(ec);
    const blocks = Array.from(ec.querySelectorAll(".co-app-body > .co-b"));
    const fields = Array.from(ec.querySelectorAll(".co-field"));
    if (blocks.length < 3 || !fields.length) return setD(null);

    /* ── Les trois organes, et d'où part leur filet ── */
    const bridles: string[] = [];
    const k = text(ec.querySelector(".co-kpi b")!);
    /* L'espace blanc : une cote posée DANS l'écart, à droite du bouton. */
    const y1 = half(r(blocks[1]).b), y2 = half(r(blocks[2]).y);
    const gx = half(r(ec.querySelector(".co-b2")!).d + 10);
    bridles.push(`M${gx - 5} ${y1}h10M${gx} ${y1}V${y2}M${gx - 5} ${y2}h10`);
    /* Le groupe : une accolade au flanc du bloc que l'œil réunit. */
    const z1 = half(r(fields[0]).y), z2 = half(r(fields[fields.length - 1]).b);
    const gz = half(a.d + 8);
    bridles.push(`M${gz - 5} ${z1}h10M${gz} ${z1}V${z2}M${gz - 5} ${z2}h10`);
    const organs = [
      { x: half(k.d + 12), y: half(k.m) },
      { x: gx, y: half((y1 + y2) / 2) },
      { x: gz, y: half((z1 + z2) / 2) },
    ];

    /* L'axe : la verticale descend jusqu'au mot qui la nomme. */
    const axis = `M${half(r(blocks[0]).x)} ${half(a.y - 10)}V${half(r(foot).b)}`;

    /* ── Colonnes empilées (petit écran) : les mots reprennent le fil du
       document, et aucun filet n'est tracé — un filet faux vaut moins que
       pas de filet. ── */
    const hairlines: string[] = [], points: { x: number; y: number }[] = [];
    if (r(words[0]).x < a.d) {
      delete dl.dataset.set;
      words.forEach((m) => { m.style.top = ""; });
    } else {
      /* Chaque mot est posé À LA HAUTEUR de son organe : le filet devient
         une droite. Un coude n'apparaît que si deux mots se gênaient. */
      dl.dataset.set = "1";
      let floor = 0;
      organs.forEach((o, i) => {
        const dt = words[i].querySelector("dt");
        const offset = (dt ? dt.getBoundingClientRect().height : 20) + 9;
        const t = Math.max(Math.round(o.y - offset), floor);
        words[i].style.top = `${t}px`;
        floor = t + words[i].getBoundingClientRect().height + 16;
      });
      organs.forEach((o, i) => {
        const dd = words[i].querySelector("dd");
        const py = half(r(dd ?? words[i]).y + 9), pxx = half(r(words[i]).x - 18);
        const right = Math.abs(py - o.y) <= 4;
        hairlines.push(right ? `M${o.x} ${o.y}H${pxx}`
                          : `M${o.x} ${o.y}H${pxx - 22 - i * 10}V${py}H${pxx}`);
        points.push({ x: pxx, y: right ? o.y : py });
      });
    }
    setD({ w: Math.round(base.width), h: Math.round(base.height), axis, bridles, hairlines, points });
  }, [bench, active]);

  useEffect(() => {
    const t = setTimeout(set, 0);
    const b = bench.current;
    const ro = b ? new ResizeObserver(set) : null;
    if (b && ro) ro.observe(b);
    window.addEventListener("resize", set);
    return () => { clearTimeout(t); ro?.disconnect(); window.removeEventListener("resize", set); };
  }, [set, bench]);

  if (!d) return null;
  return (
    <svg className="co-hairlines" width={d.w} height={d.h} viewBox={`0 0 ${d.w} ${d.h}`} aria-hidden="true">
      <path className="co-f-stroke" d={d.axis} />
      {d.bridles.map((t, i) => <path className="co-f-stroke" key={`b${i}`} d={t} />)}
      {d.hairlines.map((t, i) => <path className="co-f-stroke" key={`f${i}`} d={t} />)}
      {d.points.map((t, i) => <circle className="co-f-point" key={`p${i}`} cx={t.x} cy={t.y} r="4" />)}
    </svg>
  );
}

/* ══ OBJET 2 · une page de journal, une affiche ═══════════════════════
   Le tracé est calculé en pixels RÉELS : un SVG étiré fausse la longueur
   du chemin, et le trait apparaîtrait par morceaux au lieu de courir. */
function Trace({ type, delay }: { type: "F" | "Z"; delay: string }) {
  const anchor = useRef<HTMLSpanElement>(null);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  useEffect(() => {
    const el = anchor.current?.parentElement;
    if (!el) return;
    const read = () => {
      const r = el.getBoundingClientRect();
      setBox({ w: Math.round(r.width), h: Math.round(r.height) });
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  if (!box || box.w < 40) return <span ref={anchor} hidden />;
  const X = (f: number) => Math.round(box.w * f);
  const Y = (f: number) => Math.round(box.h * f);
  const d = type === "F"
    ? `M${X(0.08)} ${Y(0.13)} L${X(0.92)} ${Y(0.13)} L${X(0.08)} ${Y(0.36)} L${X(0.74)} ${Y(0.36)} L${X(0.08)} ${Y(0.58)} L${X(0.46)} ${Y(0.58)} L${X(0.08)} ${Y(0.80)} L${X(0.30)} ${Y(0.80)}`
    : `M${X(0.10)} ${Y(0.12)} L${X(0.90)} ${Y(0.12)} L${X(0.10)} ${Y(0.84)} L${X(0.90)} ${Y(0.84)}`;
  const pts = d.split(/[ML]/).slice(1).map((c) => c.trim().split(/\s+/).map(Number));
  let len = 0;
  for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  return (
    <>
      <span ref={anchor} hidden />
      <svg className="co-trace" width={box.w} height={box.h} aria-hidden="true"
        style={{ ["--len" as string]: `${Math.round(len)}px`, ["--delay" as string]: delay }}>
        <path className="co-path" d={d} />
        <path className="co-gaze" d={d} />
      </svg>
    </>
  );
}

/* ══ OBJET 3 · une page de magazine — l'espace blanc ══════════════════ */
function Magazine() {
  const holder = useRef<HTMLDivElement>(null);
  const [ink, setInk] = useState(false);
  const [tight, setTight] = useState(false);
  const [tasks, setTasks] = useState("");
  const [part, setPart] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);

  const measureIt = useCallback(() => {
    const art = holder.current?.querySelector<HTMLElement>(".co-mag");
    if (!art) return;
    const base = art.getBoundingClientRect();
    const boxes: DOMRect[] = [];
    const range = document.createRange();
    const walk = (el: Node) => {
      el.childNodes.forEach((n) => {
        if (n.nodeType === 3 && (n.textContent ?? "").trim()) {
          range.selectNodeContents(n);
          boxes.push(...Array.from(range.getClientRects()));
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(art);
    const area = boxes.reduce((a, r) => a + r.width * r.height, 0);
    setPart(Math.round((area / (base.width * base.height)) * 100));
    setTasks(boxes.filter((r) => r.width > 0 && r.height > 0)
      .map((r) => `<span class="co-task" style="left:${px(r.left - base.left)};top:${px(r.top - base.top)};width:${px(r.width)};height:${px(r.height)}"></span>`)
      .join(""));
    setHeight((h) => h ?? Math.round(base.height));
  }, []);

  useEffect(() => {
    const t = setTimeout(measureIt, 0);
    window.addEventListener("resize", measureIt);
    return () => { clearTimeout(t); window.removeEventListener("resize", measureIt); };
  }, [ink, tight, measureIt]);

  /* Forme B (verdict d'Auteur, 9 septembre) : l'action retire l'espace blanc et se
     retourne ; ce qu'on montre — le texte ou l'encre seule — est le choix sous la
     tête, à la place d'une ligne de verdict. La mesure, lue sur le rendu, est la légende. */
  return (
    <Demo situation="Une page de magazine ordinaire"
      action={{ label: "Retirer l'espace blanc", back: "Rendre l'espace blanc", active: tight, onClick: () => setTight(!tight) }}
      bar={<span className="demo-seg" role="group" aria-label="Ce qu'on montre">
        <span className="mono muted">Montrer</span>
        <button type="button" className={`button ${ink ? "" : "on"}`} aria-pressed={!ink} onClick={() => setInk(false)}>le texte</button>
        <button type="button" className={`button ${ink ? "on" : ""}`} aria-pressed={ink} onClick={() => setInk(true)}>l'encre seule</button>
      </span>}
      caption={tight ? "même encre, même surface : l'air a disparu"
        : part === null ? undefined : `l'encre occupe ${part} % de cette page ; tout le reste est de l'espace blanc`}>
      <DemoScene ok={tight ? false : null}>
      <div className="co-scene co-duo-t">
        <div className="co-left">
          <div ref={holder} className={`co-door ${tight ? "tight" : ""}`}
            style={tight && height ? { minHeight: `${height}px` } : undefined}>
            <article className="co-mag">
              <span className="co-section">Métier · Composition</span>
              <h3>Ce que l&apos;on croit vide fait la moitié du travail</h3>
              <p className="co-lede-mag">Le blanc n&apos;est pas ce qui reste quand on a fini de
              placer. C&apos;est ce qui sépare, ce qui groupe, et ce qui désigne.</p>
              <p className="co-pullquote">« On ne dessine pas des formes : on dessine ce qu&apos;il
              y a entre elles. »</p>
              <div className="co-body-mag">
                <p>Un typographe expérimenté ne commence pas par écrire. Il pose d&apos;abord les
                marges, décide ce qui respire, et n&apos;ajoute qu&apos;ensuite — parce qu&apos;un
                texte trop serré ne devient pas plus dense, il devient illisible.</p>
                <p>La tentation inverse est constante : il faut faire entrer un bloc de plus, et
                le seul espace disponible est celui qui ne contient rien. On le rogne donc, puis
                on rogne encore, et personne ne sait dire à quel moment la page a cessé de se
                lire.</p>
                <p>C&apos;est un arbitrage silencieux : il ne supprime aucune information, il
                supprime la possibilité de les distinguer. Le lecteur, lui, ne dira jamais « les
                marges sont trop courtes » — il dira que c&apos;est confus, ou il partira.</p>
              </div>
            </article>
            {ink && <div className="co-overlay" dangerouslySetInnerHTML={{ __html: tasks }} />}
          </div>
          <div className="co-foot">
            <span className="co-prompt" style={{ opacity: 1 }}>
              {ink ? "les taches sont mesurées sur le rendu, pas dessinées" : ""}
            </span>
          </div>
        </div>
        <p className="co-says">{tight
          ? "Pas un signe n'a été retiré : mêmes mots, même corps, même famille. Ce qui a disparu, c'est ce qu'on prenait pour du vide — et avec lui, les groupes, la hiérarchie, et l'endroit où poser l'œil."
          : ink
            ? "Chaque tache couvre un signe. Tout le reste — l'immense majorité de la page — est de l'espace blanc : il n'occupe pas la place, il la donne."
            : "Une page de magazine ordinaire. Sa forme se lit avant le premier mot : les marges, les colonnes et les respirations disent par où entrer."}</p>
      </div>
      </DemoScene>
    </Demo>
  );
}

/* ══ 04 · Les règles qu'on peut voir — la paire ══════════════════════
   À gauche ce qui tient, à droite ce qui casse, en même temps : l'œil
   compare, il n'a pas à se souvenir (verdict d'Auteur, 7 septembre). Le
   verdict est en TÊTE de colonne — c'est lui qui fait lire deux colonnes
   et non quatre objets. Le signe (✓ / ✗) est celui de la planche des
   Arrondis : même langue. ══ */
/* Le même objet, deux fois, dans le cadre des démonstrations (verdict
   d'Auteur, 9 septembre) : le fautif à gauche, déclaré ; le juste à droite.
   Aucune action — les deux états vivent ensemble, il n'y a rien à rejouer. */
function Pair({ situation, good, bad, saysGood, saysBad }: {
  situation: string; good: ReactNode; bad: ReactNode; saysGood: string; saysBad: string;
}) {
  return (
    <Demo situation={situation}>
      <DemoSides>
        <DemoSide ok={false} verdict={saysBad}><div className="cb-object">{bad}</div></DemoSide>
        <DemoSide ok verdict={saysGood}><div className="cb-object">{good}</div></DemoSide>
      </DemoSides>
    </Demo>
  );
}

/* Un emplacement d'image, vide, avec son icône — la matière de la paire
   des photos. L'icône est décorative : la légende dit tout. */
const Photo = () => (
  <div className="cb-photo" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="15.5" cy="9.5" r="1.5" fill="currentColor" stroke="none" />
      <path d="M3 17l5.5-5.5 4 4 2.5-2.5L21 19" />
    </svg>
  </div>
);

const Photos = ({ cut }: { cut?: boolean }) => (
  <div className={`cb-photos${cut ? " cut" : ""}`}>
    <Photo /><p className="cb-caption">Le port au matin</p>
    <Photo /><p className="cb-caption">Le quai à midi</p>
  </div>
);

const Card = ({ heavy }: { heavy?: boolean }) => (
  <div className={`card cb-card${heavy ? " heavy" : ""}`}>
    <p className="cb-card-heading">Trois dossiers en attente</p>
    <p className="cb-card-text">Deux depuis hier, un depuis ce matin. Aucun n&apos;est en retard.</p>
  </div>
);

const Column = ({ defeat }: { defeat?: boolean }) => (
  <div className={`cb-column${defeat ? " defeat" : ""}`}>
    <p className="cb-block heading">Avant de partir</p>
    <p className="cb-block text">Le train part à l&apos;heure, le quai change parfois.</p>
    <div className="cb-block slab"><i /><i /><i /></div>
  </div>
);

/* ══ 05 · Les règles qu'on ne peut pas montrer — elles vivent chez les
   autres familles, et on dit où. ══ */
const LIST: LineList[] = [
  { name: "Hiérarchie par combinaison", tone: "code",
    says: "un titre se reconnaît à plusieurs signes — corps, graisse, couleur, place — jamais à sa taille seule",
    or: <>La typographie — l&apos;échelle et ses graisses</> },
  { name: "Mesure de lecture", tone: "render",
    says: "sept à dix mots par ligne ; au-delà, l'œil perd le début de la ligne suivante",
    or: <>La typographie — mesurée à l&apos;écran</> },
  { name: "Dedans plus serré que dehors", tone: "code",
    says: "l'espace à l'intérieur d'un groupe est toujours plus petit que celui qui le sépare du voisin",
    or: <>Le rythme — deux crans de la même chaîne</> },
  { name: "Rôles d'espace nommés", tone: "code",
    says: "retrait, empilement, alignement, gouttière : chaque espace a un nom, aucun n'est réglé à l'œil",
    or: <>Le rythme — la chaîne</> },
];

/* ── 05 · L'adaptation — le même système, dans votre stack. L'objet est
   l'écran de la preuve 01, écrit proprement : un dominant (un cran de
   typo, dépensé une fois), des groupes faits par le blanc seul (un écart
   de rythme, plus large dehors que dedans), un seul axe (une grille à une
   colonne), l'accent posé sur un seul élément. La composition n'a pas de
   token à elle : elle dépense ceux des autres familles. ── */
const SNIPPETS: Record<string, Record<string, string>> = {
  React: {
    Tailwind: `// tailwind.config : theme.extend <- rhythm, typography, color (tokens.tailwind.mjs)
// La composition n'a pas de token à elle : elle dépense ceux des autres familles
export function ScreenConformite({ folders, delay, last }) {
  return (
    <main className="grid gap-pad-2-block py-pad-2-block px-pad-1-inline">  {/* une colonne : un seul axe ; dehors… */}
      <section className="grid gap-gap-3-block">                            {/* …plus large que dedans — le blanc fait le groupe */}
        <span className="text-muted-foreground">Folders à valider</span>
        <b className="text-h1 leading-heading font-semibold">{folders}</b>  {/* the dominant : one single by view */}
        <span className="text-muted-foreground">dont {delay} inside delay</span>
      </section>
      <section className="flex gap-pad-3-inline">
        <button className="h-control rounded-ctl bg-primary text-on-primary">Valider</button>  {/* l'accent, dépensé une fois */}
        <button className="h-control rounded-ctl text-primary-text">Exporter</button>
      </section>
      <section className="grid gap-gap-3-block">                            {/* aucune surface : elle ne se mérite pas ici */}
        <span className="text-muted-foreground">Last folders</span>
        {last.map((d) => <span key={d.name}>{d.name}</span>)}
      </section>
    </main>
  );
}`,
    shadcn: `// shadcn/ui vit sur Tailwind — donc sur nos tokens. Il fournit une surface
// (Card) et un accent (Button) : la composition décide où les dépenser
import { Button } from "@/components/ui/button";

export function ScreenConformite({ folders, delay, last }) {
  return (
    <main className="grid gap-pad-2-block py-pad-2-block px-pad-1-inline">
      <section className="grid gap-gap-3-block">
        <span className="text-muted-foreground">Folders à valider</span>
        <b className="text-h1 leading-heading font-semibold">{folders}</b>
        <span className="text-muted-foreground">dont {delay} inside delay</span>
      </section>
      <section className="flex gap-pad-3-inline">
        <Button>Valider</Button>                 {/* the variant by défaut door l'accent : une fois */}
        <Button variant="ghost">Exporter</Button>
      </section>
      <section className="grid gap-gap-3-block">   {/* pas de <Card> : le blanc fait déjà le groupe */}
        <span className="text-muted-foreground">Last folders</span>
        {last.map((d) => <span key={d.name}>{d.name}</span>)}
      </section>
    </main>
  );
}`,
    "HTML natif": `/* Le normatif : la règle et le token. Ce code n'est qu'un exemple. */
export function ScreenConformite({ folders, delay, last }) {
  return (
    <main className="screen">
      <section className="group">
        <span className="label">Folders à valider</span>
        <b className="dominant">{folders}</b>
        <span className="label">dont {delay} inside delay</span>
      </section>
      <section className="actions">
        <button className="main">Valider</button>
        <button className="second">Exporter</button>
      </section>
      <section className="group">
        <span className="label">Last folders</span>
        {last.map((d) => <span key={d.name}>{d.name}</span>)}
      </section>
    </main>
  );
}

/* styles.css — aucun token propre : ceux du rythme, de la typo, de la couleur */
.screen    { display: grid; gap: var(--pad-2-block);           /* dehors… */
            padding: var(--pad-2-block) var(--pad-1-inline); }
.group   { display: grid; gap: var(--gap-3-block); }           /* …plus large que dedans */
.dominant { font: var(--weight-heading) var(--font-size-h1) / var(--leading-heading) var(--font-sans); }  /* un seul par vue */
.label{ color: var(--text-secondary); }
.actions  { display: flex; gap: var(--pad-3-inline); }
.main{ background: var(--primary); color: var(--on-primary); }  /* l'accent, dépensé une fois */
.second   { color: var(--primary-text); }                            /* le second ne le dépense pas */
.main, .second { height: var(--control-height); border-radius: var(--r-ctl); }`,
  },
  Angular: {
    Tailwind: `@Component({
  selector: "kit-ecran-conformite",
  template: \`
    <main class="grid gap-pad-2-block py-pad-2-block px-pad-1-inline">
      <section class="grid gap-gap-3-block">
        <span class="text-muted-foreground">Dossiers à valider</span>
        <b class="text-h1 leading-heading font-semibold">{{ dossiers }}</b>
        <span class="text-muted-foreground">dont {{ retard }} en retard</span>
      </section>
      <section class="flex gap-pad-3-inline">
        <button class="h-control rounded-ctl bg-primary text-on-primary">Valider</button>
        <button class="h-control rounded-ctl text-primary-text">Exporter</button>
      </section>
      <section class="grid gap-gap-3-block">
        <span class="text-muted-foreground">Derniers dossiers</span>
        @for (d of derniers; track d.nom) { <span>{{ d.nom }}</span> }
      </section>
    </main>\`,
})
export class EcranConformite {
  @Input() dossiers = 0; @Input() retard = 0; @Input() derniers: { nom: string }[] = [];
}`,
    shadcn: `// spartan/ui porte l'esprit de shadcn côté Angular — mêmes classes,
// donc mêmes tokens : l'accent au bouton par défaut, la surface non dépensée
@Component({
  selector: "kit-ecran-conformite",
  template: \`
    <main class="grid gap-pad-2-block py-pad-2-block px-pad-1-inline">
      <section class="grid gap-gap-3-block">
        <span class="text-muted-foreground">Dossiers à valider</span>
        <b class="text-h1 leading-heading font-semibold">{{ dossiers }}</b>
        <span class="text-muted-foreground">dont {{ retard }} en retard</span>
      </section>
      <section class="flex gap-pad-3-inline">
        <button hlmBtn>Valider</button>
        <button hlmBtn variant="ghost">Exporter</button>
      </section>
      <section class="grid gap-gap-3-block">
        <span class="text-muted-foreground">Derniers dossiers</span>
        @for (d of derniers; track d.nom) { <span>{{ d.nom }}</span> }
      </section>
    </main>\`,
})
export class EcranConformite {
  @Input() dossiers = 0; @Input() retard = 0; @Input() derniers: { nom: string }[] = [];
}`,
    "HTML natif": `@Component({
  selector: "kit-ecran-conformite",
  template: \`
    <main class="screen">
      <section class="group">
        <span class="label">Dossiers à valider</span>
        <b class="dominant">{{ dossiers }}</b>
        <span class="label">dont {{ retard }} en retard</span>
      </section>
      <section class="actions">
        <button class="main">Valider</button>
        <button class="second">Exporter</button>
      </section>
      <section class="group">
        <span class="label">Derniers dossiers</span>
        @for (d of derniers; track d.nom) { <span>{{ d.nom }}</span> }
      </section>
    </main>\`,
  styleUrl: "./ecran-conformite.css", // var(--pad-2-block) · var(--gap-3-block) · var(--font-size-h1) · var(--primary)
})
export class EcranConformite {
  @Input() dossiers = 0; @Input() retard = 0; @Input() derniers: { nom: string }[] = [];
}`,
  },
  HTML: {
    Tailwind: `<main class="grid gap-pad-2-block py-pad-2-block px-pad-1-inline">
  <section class="grid gap-gap-3-block">
    <span class="text-muted-foreground">Dossiers à valider</span>
    <b class="text-h1 leading-heading font-semibold">34</b>
    <span class="text-muted-foreground">dont 6 en retard</span>
  </section>
  <section class="flex gap-pad-3-inline">
    <button class="h-control rounded-ctl bg-primary text-on-primary">Valider</button>
    <button class="h-control rounded-ctl text-primary-text">Exporter</button>
  </section>
  <section class="grid gap-gap-3-block">
    <span class="text-muted-foreground">Derniers dossiers</span>
    <span>Meunier SAS</span><span>Atelier Vidal</span><span>Groupe Ferrand</span>
  </section>
</main>`,
    shadcn: `<!-- shadcn est une bibliothèque React : en HTML pur il n'en reste que
     ses classes Tailwind — bg-primary y résout notre --primary, une fois -->
<main class="grid gap-pad-2-block py-pad-2-block px-pad-1-inline">
  <section class="grid gap-gap-3-block">
    <span class="text-muted-foreground">Dossiers à valider</span>
    <b class="text-h1 leading-heading font-semibold">34</b>
    <span class="text-muted-foreground">dont 6 en retard</span>
  </section>
  <section class="flex gap-pad-3-inline">
    <button class="h-9 rounded-md bg-primary text-primary-foreground">Valider</button>
    <button class="h-9 rounded-md hover:bg-accent">Exporter</button>
  </section>
  <section class="grid gap-gap-3-block">
    <span class="text-muted-foreground">Derniers dossiers</span>
    <span>Meunier SAS</span><span>Atelier Vidal</span><span>Groupe Ferrand</span>
  </section>
</main>`,
    "HTML natif": `<link rel="stylesheet" href="kit/tokens.css" />

<main class="screen">
  <section class="group">
    <span class="label">Dossiers à valider</span>
    <b class="dominant">34</b>
    <span class="label">dont 6 en retard</span>
  </section>
  <section class="actions">
    <button class="main">Valider</button>
    <button class="second">Exporter</button>
  </section>
  <section class="group">
    <span class="label">Derniers dossiers</span>
    <span>Meunier SAS</span><span>Atelier Vidal</span><span>Groupe Ferrand</span>
  </section>
</main>

<style>
  .screen    { display: grid; gap: var(--pad-2-block);
              padding: var(--pad-2-block) var(--pad-1-inline); }
  .group   { display: grid; gap: var(--gap-3-block); }
  .dominant { font: var(--weight-heading) var(--font-size-h1) / var(--leading-heading) var(--font-sans); }
  .label{ color: var(--text-secondary); }
  .actions  { display: flex; gap: var(--pad-3-inline); }
  .main{ background: var(--primary); color: var(--on-primary); }
  .second   { color: var(--primary-text); }
  .main, .second { height: var(--control-height); border-radius: var(--r-ctl); }
</style>`,
  },
};

export default function View() {
  const activeId = useDocSections("broken");
  const [fault, setFault] = useState("");
  const [repaired, setRepaired] = useState(false); /* le pointeur est sur l'écran : il se répare, et le verdict le dit */
  const [fw, setFw] = useState<"React" | "Angular" | "HTML">("HTML");
  const { styl } = useAdaptation();
  const door = useRef<HTMLDivElement>(null);
  const bench = useRef<HTMLDivElement>(null);
  const current = FAULTS.find((f) => f.key === fault)!;

  return (
    <div className="gdoc-background">
      <div className="gdoc">
        <RailDoc page="composition" heading="Fondation · Composition" toc={TOC}
          activeId={activeId} foot="COMPOSITION-UX · huit règles · deux jugées à l'œil" />

        <main className="gdoc-content" id="content">

          <section className="gdoc-hero">
            <p className="kicker">La composition</p>
            <h1>L&apos;œil décide avant vous<span className="point" aria-hidden="true" /></h1>
            <p className="lede"><b>Les autres fondations règlent une matière : des lettres, des
            distances, des couleurs.</b> Celle-ci règle ce qui arrive quand toutes sont justes et
            que ça ne marche pas quand même — l&apos;ordre du regard, ce qu&apos;il groupe, ce
            qu&apos;il ne voit jamais.</p>
          </section>

          <section className="gdoc-sec set" id="broken">
            <div className="gdoc-sec-head">
              <p className="kicker">01 · L&apos;écran qu&apos;on casse</p>
              <h2>Un écran juste, et cinq façons de le casser — une à la fois</h2>
              <p className="muted">Au repos, l&apos;écran nomme ses organes — le dominant,
              l&apos;espace blanc, le groupe, l&apos;axe de départ : <b>quatre mots suffisent</b>
              à parler de composition avec quelqu&apos;un d&apos;autre. Une faute commise, et
              les repères deviennent rouges à l&apos;endroit exact où ça casse ; au survol,
              l&apos;écran se répare.</p>
            </div>
            <div className="gdoc-body">
              {/* Le cadre (verdict d'Auteur, 9 septembre) : la faute se choisit sous la tête,
                  à la place d'une ligne de verdict — une à la fois, la même puce la retire.
                  La colonne de droite commente la faute, le pied de la scène dit le GESTE ;
                  la scène rougit (statement) tant qu'elle n'est pas réparée. */}
              <Demo situation="Un écran de réglages, juste au repos"
                bar={<span className="demo-seg" role="group" aria-label="La faute">
                  <span className="mono muted">Casser</span>
                  {FAULTS.filter((f) => f.key).map((f) => (
                    <button key={f.key} type="button" className={`button ${fault === f.key ? "on" : ""}`}
                      aria-pressed={fault === f.key}
                      onClick={() => setFault(fault === f.key ? "" : f.key)}>
                      {f.name}
                    </button>
                  ))}
                </span>}>
              <DemoScene ok={fault ? repaired : null}>
              <div className="co-scene co-proof1">
                {/* Au repos, la colonne de droite EST le vocabulaire, relié à
                    l'écran par des filets ; dès qu'on casse, elle laisse la
                    place au commentaire de la faute. Les deux restent posés
                    l'un sur l'autre pour que rien ne saute au changement. */}
                <div className="co-bench" ref={bench}>
                  <div className="co-left">
                    <div className="co-door" ref={door} onMouseEnter={() => setRepaired(true)} onMouseLeave={() => setRepaired(false)}>
                      <Application fault={fault} />
                      <Overlay fault={fault} holder={door} />
                    </div>
                    <div className={`co-lex-foot ${fault ? "off" : ""}`}>
                      <dl><div><dt>{AXIS[0]}</dt><dd>{AXIS[1]}</dd></div></dl>
                    </div>
                    <div className="co-foot">
                      {/* le pied dit l'état et le geste : la faute, puis — sous le pointeur — ce qui l'a réparée */}
                      <span className="co-prompt">
                        {fault ? (repaired ? `${current.solution} — ↑ relâchez : la faute revient` : `${current.verdict} — ↑ survolez l'écran : il se répare sous vos yeux`) : current.prompt}
                      </span>
                    </div>
                  </div>
                  <div className="co-right">
                    <dl className={`co-lex ${fault ? "off" : ""}`}>
                      {LEXICON.map(([m, t]) => (<div key={m}><dt>{m}</dt><dd>{t}</dd></div>))}
                    </dl>
                    <p className={`co-says ${fault ? "" : "off"}`}>{current.says}</p>
                  </div>
                  <Caption bench={bench} active={!fault} />
                </div>
              </div>
              </DemoScene>
              </Demo>
            </div>
          </section>

          <section className="gdoc-sec set" id="journey">
            <div className="gdoc-sec-head">
              <p className="kicker">02 · Le chemin de l&apos;œil</p>
              <h2>La densité décide du parcours</h2>
              <p className="muted">L&apos;œil entre en haut à gauche — toujours. Ce qu&apos;il
              fait ensuite dépend de ce qu&apos;on lui donne. Deux objets que tout oppose : une
              page de journal, et une affiche. Le premier se balaie en <b>F</b>, la seconde se
              parcourt en <b>Z</b>. Ce n&apos;est pas une théorie à retenir, c&apos;est une
              contrainte de placement.</p>
            </div>
            <div className="gdoc-body">
              <div className="co-pair">
                <div>
                  <span className="co-name-object">une page de journal — le F</span>
                  <div className="co-door">
                    <article className="co-press">
                      <span className="co-kicker">Économie</span>
                      <h3>Les ateliers de la vallée rouvrent après huit mois d&apos;arrêt</h3>
                      <p className="co-signature">Camille Ferrand · 14 mars</p>
                      <div className="co-cols">
                        <p>La décision est tombée mardi soir, à l&apos;issue d&apos;une réunion
                        qui aura duré plus de six heures. Les trois sites reprendront leur
                        activité dès la semaine prochaine, avec des effectifs réduits d&apos;un
                        quart par rapport à l&apos;an dernier.</p>
                        <p>« Nous avons obtenu ce que nous demandions depuis le début », explique
                        une déléguée, qui rappelle que le calendrier reste soumis à la livraison
                        des pièces attendues d&apos;Allemagne.</p>
                        <p>Les commandes, elles, n&apos;ont pas attendu : le carnet est plein
                        jusqu&apos;en septembre, et deux clients historiques ont déjà confirmé
                        leurs volumes.</p>
                        <p>Reste la question du transport, que personne n&apos;a voulu trancher
                        publiquement. Elle reviendra sur la table au printemps.</p>
                      </div>
                      <div className="co-hairline" />
                      <div className="co-brief">
                        <span>· Le tribunal reporte l&apos;audience au 2 avril.</span>
                        <span>· Trois communes s&apos;associent pour la ligne 4.</span>
                        <span>· Le marché du bois recule pour le deuxième trimestre.</span>
                      </div>
                    </article>
                    <Trace type="F" delay="0s" />
                  </div>
                </div>
                <div>
                  <span className="co-name-object">une affiche — le Z</span>
                  <div className="co-door">
                    <div className="co-display">
                      <span className="co-brand">Ateliers Vidal</span>
                      <div>
                        <p className="co-heading-display">Portes ouvertes,<br />samedi 12 avril.</p>
                        <p className="co-sub-display">Trois ateliers, une visite guidée toutes les
                        heures, et le café est offert.</p>
                      </div>
                      <span className="co-action">Réserver une place</span>
                    </div>
                    <Trace type="Z" delay="0.55s" />
                  </div>
                </div>
              </div>
              {/* une légende tient en une ligne (verdict d'Auteur, 2 septembre) : le détail est au dépliant */}
              <p className="gd-caption">sur le journal, l&apos;œil descend et balaie de moins en moins
              loin ; sur l&apos;affiche, deux allers-retours, et l&apos;action au dernier coin</p>
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <p><b>Ce que les deux tracés disent</b> — sur le journal, l&apos;œil descend la
                première colonne et balaie de moins en moins loin : les fins de lignes sont les
                moins lues. Sur l&apos;affiche, il fait deux allers-retours et s&apos;arrête sur le
                dernier coin : c&apos;est là que se met l&apos;action, jamais au milieu.</p>
                <p><b>L&apos;essentiel sur le chemin de l&apos;œil</b> — l&apos;essentiel vit sur
                le parcours ; les réglages et les métadonnées vivent en dehors. Cette règle se
                juge à la relecture : aucune mesure ne dit où est l&apos;essentiel.</p>
                <p className="muted">Sources : <a href="https://careerfoundry.com/en/blog/ux-design/what-is-visual-hierarchy/">patterns de lecture F/Z</a> ·
                Müller-Brockmann, <i>Grid Systems in Graphic Design</i>.</p>
              </div></details>
            </div>
          </section>

          <section className="gdoc-sec set" id="blanc">
            <div className="gdoc-sec-head">
              <p className="kicker">03 · L&apos;espace blanc</p>
              <h2>La seule matière qu&apos;on rogne en croyant ne rien perdre</h2>
              <p className="muted">Une page est faite de deux choses : de l&apos;encre, et de
              l&apos;espace blanc. La première se compte en signes, la seconde passe pour du
              vide — c&apos;est donc toujours elle qu&apos;on sacrifie quand il faut faire entrer
              une ligne de plus. Voici ce qu&apos;elle occupe vraiment, et ce que coûte sa
              disparition.</p>
            </div>
            <div className="gdoc-body">
              <Magazine />
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <p><b>Le blanc d&apos;abord</b> — on compose en partant de trop d&apos;espace
                blanc, puis on retire ; jamais l&apos;inverse. Cette règle se juge à la
                relecture : la mesure dit combien d&apos;espace blanc il reste, jamais s&apos;il
                a été donné avant d&apos;être repris.</p>
                <p className="muted">Sources : <a href="https://www.nngroup.com/articles/form-design-white-space/">NN/g — Form Design White Space</a> ·
                Wathan &amp; Schoger, <i>Refactoring UI</i> · Müller-Brockmann, <i>Grid Systems in Graphic Design</i>.</p>
              </div></details>
            </div>
          </section>

          {/* ═══ LE RÉPERTOIRE — une seule section, à la composition (8 sept.
              2026) : les quatre paires (#bandes, en h4 — le même objet deux fois,
              une seule chose change), les lois qui vivent chez les autres familles
              (#liste), et l'écran de la première preuve écrit proprement
              (#adaptation) — ici l'extrait est du vrai contenu : la composition
              n'a pas de token à elle, seulement un ordre. ═══ */}
          <section className="gdoc-sec set" id="registry">
            <div className="gdoc-sec-head">
              <p className="kicker">04 · Le registre</p>
              <h2>La composition n&apos;a pas de matière à elle</h2>
              <p className="muted">Elle dépense celle des autres familles — des crans de texte, des
              écarts de rythme, une couleur — dans un ordre. Quatre lois qui se voient sur le
              même objet pris deux fois ; quatre lois qui vivent chez les autres familles ; et
              l&apos;écran de la première preuve, écrit proprement. Deux lois de cette page se
              jugent à l&apos;œil, sans faire semblant de les mesurer : le chemin de l&apos;œil et
              le blanc donné avant d&apos;être repris.</p>
            </div>
            <div className="gdoc-body">
              <div className="doc-piece" id="bands">
                <div className="doc-piece-head">
                  <h3>Le même objet, deux fois. Une seule chose change.</h3>
                  <p className="muted">Un habit, un trait, un cadre, un bord. Ces fautes-là ne
                  cassent rien — la page marche toujours, elle est juste un peu moins claire, et
                  personne ne sait dire pourquoi.</p>
                </div>
              <Bands>

                <Band level={4} name="Ce qui agit et ce qui constate ne s'habillent pas pareil" side="une seule chose change : l'habit du mot « Enregistré »" bare
                  says="Un bouton est une promesse : ce qui en a l'habit se clique. « Enregistré » ne fait rien, mais habillé en bouton il reçoit le clic et ne répond pas — et à partir de là, le lecteur ne croit plus aucun bouton de la page. Un état se dit avec un badge ; seule une action a droit à l'habit."
                  rules={<p>Loi de similarité (Gestalt) : ce qui se ressemble est perçu comme de même
                    nature. Sur une interface, l&apos;habit d&apos;un bouton est une promesse
                    d&apos;usage — Material 3 le dit du bouton posé « à côté d&apos;éléments visuellement
                    similaires ».</p>}>
                  <Pair situation="Un formulaire enregistré, et le bouton qui l'enregistre" saysGood="L'état est un badge, l'action est un bouton" saysBad="Deux boutons : le premier ne répond à rien"
                    good={<div className="cb-line"><span className="badge good">Enregistré</span><span className="button">Enregistrer</span></div>}
                    bad={<div className="cb-line"><span className="button">Enregistré</span><span className="button">Enregistrer</span></div>} />
                </Band>

                <Band level={4} name="Un trait relie plus fort que l'espace" side="une seule chose change : un filet entre la photo et sa légende" bare
                  says="Une légende tient à sa photo par l'air : peu dessous, davantage avant la suivante. Un filet posé entre les deux gagne contre cet air — l'œil suit le trait, et la légende change de photo. Un séparateur n'est jamais décoratif : il déplace un groupe, même quand personne ne l'a voulu."
                  rules={<p>Connexion uniforme (Palmer &amp; Rock, 1994) : un trait qui relie deux
                    éléments l&apos;emporte sur la proximité et sur la similarité. Un séparateur
                    n&apos;est jamais décoratif — il déplace un groupe.</p>}>
                  <Pair situation="Deux photos, chacune avec sa légende" saysGood="La légende appartient à la photo du dessus" saysBad="Le filet l'a rattachée à la photo du dessous"
                    good={<Photos />} bad={<Photos cut />} />
                </Band>

                <Band level={4} name="Une surface se mérite" side="une seule chose change : un cadre appuyé autour de la carte" bare
                  says="Une carte, c'est un fond et un peu d'espace ; ça suffit à grouper. Un cadre appuyé ajouté « pour faire fini » n'ajoute aucune information, seulement un trait de plus à regarder — l'œil voit d'abord la boîte, et lit après. La bordure vient en dernier recours, après l'espace et le fond."
                  rules={<p>Prägnanz (Gestalt) : l&apos;œil retient la forme la plus simple qu&apos;on
                    lui donne. Wathan &amp; Schoger, <i>Refactoring UI</i> : les bordures sont le
                    dernier recours pour séparer, après l&apos;espace et le fond.</p>}>
                  <Pair situation="Une carte et son texte" saysGood="Le texte vient en premier" saysBad="La boîte vient en premier"
                    good={<Card />} bad={<Card heavy />} />
                </Band>

                <Band level={4} name="Tout part du même bord" side="une seule chose change : le bord de départ du texte et du tableau" bare
                  says="Un titre, un texte, un tableau : trois choses, un seul bord, et la colonne existe. Que chacune parte d'un peu ailleurs, et aucun bloc ne paraît fautif — mais la page n'a plus de bord, et l'œil zigzague pour descendre. Trois pixels entre deux départs suffisent à fabriquer un axe de plus, et chaque axe de plus est du bruit."
                  rules={<p>La grille (Müller-Brockmann, <i>Grid Systems</i>) : colonnes et
                    gouttières sortent de la même base que l&apos;échelle ; un élément qui ne part
                    pas d&apos;un axe existant en crée un, et chaque axe de plus est du bruit.</p>}>
                  <Pair situation="Un titre, un texte, un tableau" saysGood="Un bord : l'œil descend droit" saysBad="Trois bords : l'œil zigzague"
                    good={<Column />} bad={<Column defeat />} />
                </Band>

              </Bands>
              </div>

              <div className="doc-piece" id="list">
                <div className="doc-piece-head">
                  <h3>Les lois qui vivent chez les autres familles</h3>
                  <p className="muted">Chacune se vérifie là où sa matière est réglée. Le contrôle
                  dira « aucune des fautes nommées n&apos;est présente » — jamais « c&apos;est bien
                  composé ».</p>
                </div>
                <ListRules lines={LIST} />
                <details className="prov"><summary>Les lois comportementales, et pourquoi elles ne sont pas ici</summary><div>
                  <p>Hick, Fitts, Miller — le temps de décision, la difficulté d&apos;atteindre une
                  cible, la charge de mémoire — gouvernent l&apos;<b>interaction</b>, pas la
                  composition. Elles concerneront les composants, quand les fondations seront
                  verrouillées. Les mêler ici donnerait une famille qui parle de tout et ne décide
                  de rien.</p>
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
              <h2>L&apos;écran de la première preuve, écrit proprement</h2>
              <p className="muted">Un système normatif enfermé dans un framework n&apos;est
                  qu&apos;une bibliothèque. Ici le normatif vit dans la règle et le token — et la
                  composition n&apos;a pas de token à elle : elle dépense ceux des autres familles,
                  dans un ordre. React, Angular ou HTML n&apos;en sont que des consommateurs.</p>
            </div>
            <div className="gdoc-body">
              <PanelCode language={styl} tools={
                <>{(["HTML", "React", "Angular"] as const).map((f) => (
                  <button key={f} className={`button ${fw === f ? "on" : ""}`} onClick={() => setFw(f)}>{f}</button>
                ))}</>
              } code={SNIPPETS[fw][styl]} />
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <p>Le normatif, ici, c&apos;est <b>la règle et le token</b> — pas le code. La
                composition ne crée aucun token : le dominant est un cran de l&apos;échelle
                typographique (<code>--font-size-h1</code>) dépensé une seule fois ; un groupe
                est un écart de l&apos;échelle de rythme, plus large dehors
                (<code>--pad-2-block</code>) que dedans (<code>--gap-3-block</code>) ;
                l&apos;axe est une grille à une colonne ; l&apos;accent est la couleur primaire
                (<code>--primary</code>) posée sur un seul élément. Aucune surface : le blanc
                fait déjà le groupe. Les sorties Tailwind et shadcn pointent sur les mêmes
                variables.</p>
                <p><b>Ce que le code ne porte pas</b> : le chemin de l&apos;œil et le blanc donné
                avant d&apos;être repris. Ces deux règles se jugent à la relecture — aucun
                extrait ne les garantit, et on ne fait pas semblant.</p>
                <p className="muted">Sources : COMPOSITION-UX (huit règles, deux jugées à
                l&apos;œil) · Nathan Curtis, <i>Space in Design Systems</i> · Wathan &amp;
                Schoger, <i>Refactoring UI</i>.</p>
              </div></details>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
