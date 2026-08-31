"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { RailDoc, useDocSections, type Sommaire } from "../rail";
import { PanneauCode } from "../apercu";
import { useAdaptation } from "../adaptation";

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
   Puis le répertoire : les quinze lois du fonds, où vit chacune, qui la
   juge — et ce que la machine ne sait pas juger, dit et non tu.
   Enfin l'adaptation : le même écran, écrit dans votre stack — la
   composition n'a pas de jeton à elle, elle dépense ceux des autres
   familles, dans un ordre.
   ═══════════════════════════════════════════════════════════════════════ */

const SOMMAIRE: Sommaire = [
  ["casse", "01", "L'écran qu'on casse"],
  ["parcours", "02", "Le chemin de l'œil"],
  ["blanc", "03", "L'espace blanc"],
  ["fonds", "04", "Le fonds complet"],
  ["adaptation", "05", "L'adaptation"],
];

const px = (n: number) => `${Math.round(n)}px`;

/* ══ OBJET 1 · une interface de travail ═══════════════════════════════ */
function Application({ faute }: { faute: string }) {
  return (
    <div className={`co-app ${faute}`}>
      <div className="co-app-tete"><i /><b>Conformité</b></div>
      <div className="co-app-corps">
        <div className="co-b co-kpi">
          <span className="co-etq">Dossiers à valider</span><b>34</b>
          <span className="co-sous">dont 6 en retard</span>
        </div>
        <div className="co-b co-cta">
          <span className="co-b1">Valider</span><span className="co-b2">Exporter</span>
        </div>
        <div className="co-b co-liste">
          <span className="co-etq">Derniers dossiers</span>
          {[["Meunier SAS", "62 %"], ["Atelier Vidal", "100 %"], ["Groupe Ferrand", "38 %"]].map(([n, p]) => (
            <span key={n} className="co-li"><i />{n}<span className="co-pct">{p}</span></span>
          ))}
        </div>
        <div className="co-b">
          <span className="co-etq">Affichage</span>
          <span className="co-champ">Trier par : date</span>
          <span className="co-champ">Densité : confortable</span>
        </div>
      </div>
    </div>
  );
}

type Faute = { cle: string; nom?: string; verdict: string; invite?: string; solution: string; dit: string };
const FAUTES: Faute[] = [
  { cle: "", verdict: "rien de cassé — un dominant, trois groupes, un seul axe",
    invite: "↑ chaque mot est relié à ce qu'il nomme — cassez-en un", solution: "",
    dit: "L'écran de départ : le chiffre entre en premier, les groupes sont faits par l'écart seul, et tout part de la même verticale." },
  { cle: "f-dominant", nom: "deux dominants", verdict: "Faux · deux dominants, c'est aucun",
    solution: "Réparé · un seul corps maximal",
    dit: "Le titre de la liste a pris le corps du chiffre — rien d'autre n'a changé. L'œil hésite désormais entre deux entrées, et une hésitation de plus est une décision de moins." },
  { cle: "f-cloison", nom: "tout cloisonné", verdict: "Faux · quatre surfaces pour des groupes que le blanc faisait déjà",
    solution: "Réparé · les quatre cadres retirés",
    dit: "Une surface se mérite : elle n'apparaît que là où l'écart ne suffit pas à faire le groupe. Ici les quatre cadres n'ajoutent aucune information — ils ajoutent quatre traits." },
  { cle: "f-equi", nom: "écarts tous égaux", verdict: "Faux · dedans et dehors mesurent pareil",
    solution: "Réparé · l'écart entre groupes triplé",
    dit: "Les cotes relevées sur le rendu le disent : l'écart entre deux groupes vaut celui qui sépare deux lignes d'un même groupe. C'est l'erreur canonique des formulaires." },
  { cle: "f-axes", nom: "quatre axes", verdict: "Faux · quatre départs différents",
    solution: "Réparé · les blocs ramenés sur la même verticale",
    dit: "Les fils sont posés aux bords gauches réels des blocs. Deux départs à moins de trois pixels comptent pour un seul axe : l'œil ne les distingue pas, la mesure non plus." },
  { cle: "f-rupture", nom: "la rupture partout", verdict: "Faux · si tout rompt, rien ne rompt",
    solution: "Réparé · l'accent rendu à un seul élément",
    dit: "La couleur d'accent est une monnaie : elle se dépense une fois par écran. Posée partout, elle ne désigne plus rien — et le bouton qui devait décider devient un décor parmi d'autres." },
];

/* Le calque : il ne décrit pas la faute, il la montre là où elle est. */
function Calque({ faute, hote }: { faute: string; hote: React.RefObject<HTMLDivElement | null> }) {
  const [html, setHtml] = useState("");
  const poser = useCallback(() => {
    const ec = hote.current?.querySelector<HTMLElement>(".co-app");
    if (!ec) return;
    const base = ec.getBoundingClientRect();
    const rect = (el: Element) => {
      const r = el.getBoundingClientRect();
      return { x: r.left - base.left, y: r.top - base.top, w: r.width, h: r.height, b: r.bottom - base.top };
    };
    const out: string[] = [];
    const cadre = (el: Element | null, texte: string) => {
      if (!el) return;
      const r = rect(el);
      out.push(`<span class="co-r-cadre" style="left:${px(r.x - 4)};top:${px(r.y - 4)};width:${px(r.w + 8)};height:${px(r.h + 8)}"></span>`);
      if (texte) out.push(`<span class="co-r-etq" style="left:${px(Math.max(r.x - 4, 2))};top:${px(r.y < 18 ? r.b + 12 : r.y - 11)}">${texte}</span>`);
    };
    const blocs = Array.from(ec.querySelectorAll(".co-app-corps > .co-b"));
    /* Un bloc occupe toute la largeur ; son TEXTE, non. Pour poser une
       étiquette dans le vide, c'est le texte qu'il faut mesurer. */
    const finTexte = (el: Element) => {
      const g = document.createRange(); g.selectNodeContents(el);
      return g.getBoundingClientRect().right - base.left;
    };
    /* Les blancs de la carte : trois entre les blocs, un en bas. Ce sont
       les seuls endroits où une étiquette ne recouvre jamais rien. */
    const blancs = () => {
      const t: number[] = [];
      for (let i = 0; i < blocs.length - 1; i++) t.push((rect(blocs[i]).b + rect(blocs[i + 1]).y) / 2);
      t.push((rect(blocs[blocs.length - 1]).b + base.height) / 2);
      return t;
    };

    if (faute === "f-dominant") {
      /* L'étiquette se pose APRÈS le texte qu'elle désigne ; si le corps a
         tellement grossi qu'il ne reste plus de place, elle passe dessous. */
      const nommer = (el: Element | null) => {
        if (!el) return;
        cadre(el, "");
        const r = rect(el), f = finTexte(el);
        const large = f + 12 > base.width - 84;
        out.push(`<span class="co-r-etq" style="left:${px(large ? r.x : f + 12)};top:${px(large ? r.b + 14 : r.y + r.h / 2)}">dominant</span>`);
      };
      nommer(ec.querySelector(".co-kpi b"));
      nommer(ec.querySelector(".co-liste .co-etq"));
    }
    if (faute === "f-cloison") {
      blocs.forEach((b) => cadre(b, ""));
      cadre(blocs[1], "le blanc suffisait");
    }
    if (faute === "f-equi") {
      /* Les quatre cotes sur UNE seule verticale, dans le vide à droite de
         la carte : c'est l'alignement qui rend les quatre nombres
         comparables d'un coup d'œil. Le nombre s'écrit à gauche de sa cote,
         là où aucun contenu ne va. */
      const col = base.width - 96;
      const coter = (haut: number, bas: number, texte: string) => {
        const h = Math.max(bas - haut, 1);
        out.push(`<span class="co-r-cote" style="left:${px(col)};top:${px(haut)};height:${px(h)}"></span>`);
        out.push(`<span class="co-r-etq fin" style="left:${px(col - 8)};top:${px(haut + h / 2)}">${texte}</span>`);
      };
      for (let i = 0; i < blocs.length - 1; i++) {
        const a = rect(blocs[i]), b = rect(blocs[i + 1]);
        coter(a.b, b.y, `${Math.round(Math.max(b.y - a.b, 1))}`);
      }
      const l = Array.from(ec.querySelectorAll(".co-liste .co-li"));
      const a = rect(l[0]), b = rect(l[1]);
      coter(a.b, b.y, `${Math.round(Math.max(b.y - a.b, 1))} · dans le groupe`);
    }
    if (faute === "f-axes") {
      const axes: number[] = [];
      blocs.forEach((b) => {
        const x = Math.round(rect(b).x);
        if (!axes.some((u) => Math.abs(u - x) < 3)) axes.push(x);
      });
      /* Quatre étiquettes au même endroit ne se lisent pas. Chacune
         descend dans un blanc différent de la carte, collée à SON fil. */
      const trous = blancs();
      axes.sort((a, b) => a - b).forEach((x, i) => {
        out.push(`<span class="co-r-fil" style="left:${px(x)};top:0;height:100%"></span>`);
        const y = trous[i] ?? 14 + i * 20;
        out.push(`<span class="co-r-etq" style="left:${px(x + 5)};top:${px(y)}">axe ${i + 1}</span>`);
      });
    }
    if (faute === "f-rupture") {
      const cibles = ec.querySelectorAll(".co-etq, .co-b1, .co-b2, .co-pct, .co-app-tete b");
      cibles.forEach((el) => {
        const r = rect(el);
        out.push(`<span class="co-r-puce" style="left:${px(Math.max(r.x - 12, 3))};top:${px(r.y + r.h / 2)}"></span>`);
      });
      const r = rect(ec.querySelector(".co-b2")!);
      out.push(`<span class="co-r-etq" style="left:${px(r.x + r.w + 10)};top:${px(r.y + r.h / 2)}">l'accent, dépensé ${cibles.length} fois</span>`);
    }
    setHtml(out.join(""));
  }, [faute, hote]);

  useEffect(() => {
    const t = setTimeout(poser, 0);
    window.addEventListener("resize", poser);
    return () => { clearTimeout(t); window.removeEventListener("resize", poser); };
  }, [poser]);

  return <div className="co-calque" dangerouslySetInnerHTML={{ __html: html }} />;
}

/* ══ LA LÉGENDE · le vocabulaire relié à ce qu'il nomme ══════════════
   Le mot n'est plus posé SUR l'écran — il est posé à côté, et un filet le
   relie à son organe. Trois mots à droite ; le quatrième sous la carte,
   parce que l'axe est une verticale et qu'elle descend jusqu'à lui.
   Aucun numéro à retenir : le trait fait le lien. Tout est calculé en
   pixels réels sur le banc, et refait à chaque changement de largeur. */
const LEXIQUE: [string, string][] = [
  ["le dominant", "ce qui se lit en premier. Il y en a un — jamais deux, jamais zéro."],
  ["l'espace blanc", "ce qui fait le travail. Il sépare avant le trait, et il groupe avant la carte."],
  ["le groupe", "ce que l'œil réunit sans qu'on le lui dise, par la proximité ou par une surface partagée."],
];
const AXE: [string, string] = ["l'axe de départ",
  "la verticale d'où les contenus commencent. Deux ou trois par vue ; au-delà, ça flotte."];

type Dessin = { w: number; h: number; axe: string; brides: string[]; filets: string[]; points: { x: number; y: number }[] };

function Legende({ banc, actif }: { banc: React.RefObject<HTMLDivElement | null>; actif: boolean }) {
  const [d, setD] = useState<Dessin | null>(null);
  const poser = useCallback(() => {
    const b = banc.current;
    const ec = b?.querySelector<HTMLElement>(".co-app");
    const pied = b?.querySelector<HTMLElement>(".co-lex-pied");
    const dl = b?.querySelector<HTMLElement>(".co-lex");
    const mots = b ? Array.from(b.querySelectorAll<HTMLElement>(".co-lex > div")) : [];
    if (!b || !ec || !pied || !dl || mots.length < 3) return setD(null);
    if (!actif) { delete dl.dataset.pose; mots.forEach((m) => { m.style.top = ""; }); return setD(null); }
    const base = b.getBoundingClientRect();
    /* Un demi-pixel : un trait de 1 px posé sur un entier se rend flou. */
    const demi = (n: number) => Math.round(n) + 0.5;
    const r = (el: Element) => {
      const q = el.getBoundingClientRect();
      return { x: q.left - base.left, y: q.top - base.top, w: q.width, h: q.height,
               d: q.right - base.left, b: q.bottom - base.top };
    };
    /* Le chiffre occupe un bloc pleine largeur : on mesure son TEXTE. */
    const texte = (el: Element) => {
      const g = document.createRange(); g.selectNodeContents(el);
      const q = g.getBoundingClientRect();
      return { d: q.right - base.left, m: q.top + q.height / 2 - base.top };
    };
    const a = r(ec);
    const blocs = Array.from(ec.querySelectorAll(".co-app-corps > .co-b"));
    const champs = Array.from(ec.querySelectorAll(".co-champ"));
    if (blocs.length < 3 || !champs.length) return setD(null);

    /* ── Les trois organes, et d'où part leur filet ── */
    const brides: string[] = [];
    const k = texte(ec.querySelector(".co-kpi b")!);
    /* L'espace blanc : une cote posée DANS l'écart, à droite du bouton. */
    const y1 = demi(r(blocs[1]).b), y2 = demi(r(blocs[2]).y);
    const gx = demi(r(ec.querySelector(".co-b2")!).d + 10);
    brides.push(`M${gx - 5} ${y1}h10M${gx} ${y1}V${y2}M${gx - 5} ${y2}h10`);
    /* Le groupe : une accolade au flanc du bloc que l'œil réunit. */
    const z1 = demi(r(champs[0]).y), z2 = demi(r(champs[champs.length - 1]).b);
    const gz = demi(a.d + 8);
    brides.push(`M${gz - 5} ${z1}h10M${gz} ${z1}V${z2}M${gz - 5} ${z2}h10`);
    const organes = [
      { x: demi(k.d + 12), y: demi(k.m) },
      { x: gx, y: demi((y1 + y2) / 2) },
      { x: gz, y: demi((z1 + z2) / 2) },
    ];

    /* L'axe : la verticale descend jusqu'au mot qui la nomme. */
    const axe = `M${demi(r(blocs[0]).x)} ${demi(a.y - 10)}V${demi(r(pied).b)}`;

    /* ── Colonnes empilées (petit écran) : les mots reprennent le fil du
       document, et aucun filet n'est tracé — un filet faux vaut moins que
       pas de filet. ── */
    const filets: string[] = [], points: { x: number; y: number }[] = [];
    if (r(mots[0]).x < a.d) {
      delete dl.dataset.pose;
      mots.forEach((m) => { m.style.top = ""; });
    } else {
      /* Chaque mot est posé À LA HAUTEUR de son organe : le filet devient
         une droite. Un coude n'apparaît que si deux mots se gênaient. */
      dl.dataset.pose = "1";
      let plancher = 0;
      organes.forEach((o, i) => {
        const dt = mots[i].querySelector("dt");
        const decal = (dt ? dt.getBoundingClientRect().height : 20) + 9;
        const t = Math.max(Math.round(o.y - decal), plancher);
        mots[i].style.top = `${t}px`;
        plancher = t + mots[i].getBoundingClientRect().height + 16;
      });
      organes.forEach((o, i) => {
        const dd = mots[i].querySelector("dd");
        const py = demi(r(dd ?? mots[i]).y + 9), pxx = demi(r(mots[i]).x - 18);
        const droit = Math.abs(py - o.y) <= 4;
        filets.push(droit ? `M${o.x} ${o.y}H${pxx}`
                          : `M${o.x} ${o.y}H${pxx - 22 - i * 10}V${py}H${pxx}`);
        points.push({ x: pxx, y: droit ? o.y : py });
      });
    }
    setD({ w: Math.round(base.width), h: Math.round(base.height), axe, brides, filets, points });
  }, [banc, actif]);

  useEffect(() => {
    const t = setTimeout(poser, 0);
    const b = banc.current;
    const ro = b ? new ResizeObserver(poser) : null;
    if (b && ro) ro.observe(b);
    window.addEventListener("resize", poser);
    return () => { clearTimeout(t); ro?.disconnect(); window.removeEventListener("resize", poser); };
  }, [poser, banc]);

  if (!d) return null;
  return (
    <svg className="co-filets" width={d.w} height={d.h} viewBox={`0 0 ${d.w} ${d.h}`} aria-hidden="true">
      <path className="co-f-trait" d={d.axe} />
      {d.brides.map((t, i) => <path className="co-f-trait" key={`b${i}`} d={t} />)}
      {d.filets.map((t, i) => <path className="co-f-trait" key={`f${i}`} d={t} />)}
      {d.points.map((t, i) => <circle className="co-f-point" key={`p${i}`} cx={t.x} cy={t.y} r="4" />)}
    </svg>
  );
}

/* ══ OBJET 2 · une page de journal, une affiche ═══════════════════════
   Le tracé est calculé en pixels RÉELS : un SVG étiré fausse la longueur
   du chemin, et le trait apparaîtrait par morceaux au lieu de courir. */
function Trace({ type, retard }: { type: "F" | "Z"; retard: string }) {
  const ancre = useRef<HTMLSpanElement>(null);
  const [boite, setBoite] = useState<{ w: number; h: number } | null>(null);
  useEffect(() => {
    const el = ancre.current?.parentElement;
    if (!el) return;
    const lire = () => {
      const r = el.getBoundingClientRect();
      setBoite({ w: Math.round(r.width), h: Math.round(r.height) });
    };
    lire();
    const ro = new ResizeObserver(lire);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  if (!boite || boite.w < 40) return <span ref={ancre} hidden />;
  const X = (f: number) => Math.round(boite.w * f);
  const Y = (f: number) => Math.round(boite.h * f);
  const d = type === "F"
    ? `M${X(0.08)} ${Y(0.13)} L${X(0.92)} ${Y(0.13)} L${X(0.08)} ${Y(0.36)} L${X(0.74)} ${Y(0.36)} L${X(0.08)} ${Y(0.58)} L${X(0.46)} ${Y(0.58)} L${X(0.08)} ${Y(0.80)} L${X(0.30)} ${Y(0.80)}`
    : `M${X(0.10)} ${Y(0.12)} L${X(0.90)} ${Y(0.12)} L${X(0.10)} ${Y(0.84)} L${X(0.90)} ${Y(0.84)}`;
  const pts = d.split(/[ML]/).slice(1).map((c) => c.trim().split(/\s+/).map(Number));
  let len = 0;
  for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  return (
    <>
      <span ref={ancre} hidden />
      <svg className="co-trace" width={boite.w} height={boite.h} aria-hidden="true"
        style={{ ["--len" as string]: `${Math.round(len)}px`, ["--retard" as string]: retard }}>
        <path className="co-chemin" d={d} />
        <path className="co-regard" d={d} />
      </svg>
    </>
  );
}

/* ══ OBJET 3 · une page de magazine — l'espace blanc ══════════════════ */
function Magazine() {
  const hote = useRef<HTMLDivElement>(null);
  const [encre, setEncre] = useState(false);
  const [serre, setSerre] = useState(false);
  const [taches, setTaches] = useState("");
  const [part, setPart] = useState<number | null>(null);
  const [hauteur, setHauteur] = useState<number | null>(null);

  const mesurer = useCallback(() => {
    const art = hote.current?.querySelector<HTMLElement>(".co-mag");
    if (!art) return;
    const base = art.getBoundingClientRect();
    const boites: DOMRect[] = [];
    const range = document.createRange();
    const parcourir = (el: Node) => {
      el.childNodes.forEach((n) => {
        if (n.nodeType === 3 && (n.textContent ?? "").trim()) {
          range.selectNodeContents(n);
          boites.push(...Array.from(range.getClientRects()));
        } else if (n.nodeType === 1) parcourir(n);
      });
    };
    parcourir(art);
    const aire = boites.reduce((a, r) => a + r.width * r.height, 0);
    setPart(Math.round((aire / (base.width * base.height)) * 100));
    setTaches(boites.filter((r) => r.width > 0 && r.height > 0)
      .map((r) => `<span class="co-tache" style="left:${px(r.left - base.left)};top:${px(r.top - base.top)};width:${px(r.width)};height:${px(r.height)}"></span>`)
      .join(""));
    setHauteur((h) => h ?? Math.round(base.height));
  }, []);

  useEffect(() => {
    const t = setTimeout(mesurer, 0);
    window.addEventListener("resize", mesurer);
    return () => { clearTimeout(t); window.removeEventListener("resize", mesurer); };
  }, [encre, serre, mesurer]);

  return (
    <>
      <div className="rang">
        <button className={`bouton ${encre ? "on" : ""}`} onClick={() => setEncre(!encre)}>
          {encre ? "Rendre le texte" : "Ne montrer que l'encre"}
        </button>
        <button className={`bouton casse ${serre ? "on" : ""}`} onClick={() => setSerre(!serre)}>
          {serre ? "Rendre l'espace blanc" : "Retirer l'espace blanc"}
        </button>
        <span className={`badge ${serre ? "ko" : ""}`}>
          {serre ? "même encre, même surface — l'air a disparu"
                 : part === null ? "…" : `l'encre occupe ${part} % de cette page`}
        </span>
      </div>
      <div className="co-scene co-duo-t">
        <div className="co-gauche">
          <div ref={hote} className={`co-porte ${serre ? "serre" : ""}`}
            style={serre && hauteur ? { minHeight: `${hauteur}px` } : undefined}>
            <article className="co-mag">
              <span className="co-rubrique">Métier · Composition</span>
              <h3>Ce que l&apos;on croit vide fait la moitié du travail</h3>
              <p className="co-chapo-mag">Le blanc n&apos;est pas ce qui reste quand on a fini de
              placer. C&apos;est ce qui sépare, ce qui groupe, et ce qui désigne.</p>
              <p className="co-exergue">« On ne dessine pas des formes : on dessine ce qu&apos;il
              y a entre elles. »</p>
              <div className="co-corps-mag">
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
            {encre && <div className="co-calque" dangerouslySetInnerHTML={{ __html: taches }} />}
          </div>
          <div className="co-pied">
            <span className="co-invite" style={{ opacity: 1 }}>
              {encre ? "les taches sont mesurées sur le rendu, pas dessinées" : ""}
            </span>
          </div>
        </div>
        <p className="co-dit">{serre
          ? "Pas un signe n'a été retiré : mêmes mots, même corps, même famille. Ce qui a disparu, c'est ce qu'on prenait pour du vide — et avec lui, les groupes, la hiérarchie, et l'endroit où poser l'œil."
          : encre
            ? "Chaque tache couvre un signe. Tout le reste — l'immense majorité de la page — est de l'espace blanc : il n'occupe pas la place, il la donne."
            : "Une page de magazine ordinaire. Regardez d'abord sa forme, avant de lire un mot : ce sont les marges, les colonnes et les respirations qui vous disent par où entrer."}</p>
      </div>
    </>
  );
}

/* ══ Le fonds : quinze lois, où vit chacune, qui la juge ══════════════ */
const FONDS: [string, string, string, string][] = [
  /* Alinéa entré le 31 août 2026 : la proximité ne fait pas que lier, elle
     efface — un élément posé contre ses sosies cesse d'être reconnu.
     Material 3 le dit du bouton placé « à côté d'éléments visuellement
     similaires ». Ce n'est pas une loi de plus : c'est la même, poussée. */
  ["Proximité", "ce qui est proche est perçu comme lié — et posé contre des éléments qui lui ressemblent, un élément cesse d'être reconnu pour ce qu'il est", "Rythme", ""],
  ["Similarité", "un costume visuel = un rôle : deux rôles sous le même costume mentent au lecteur", "ici", "machine"],
  ["Région commune", "une surface se mérite : elle n'apparaît que là où le blanc ne suffit pas", "ici", "machine"],
  ["Connexion uniforme", "un trait qui relie unit plus fort que tout", "en référence", ""],
  ["Prägnanz", "l'œil cherche la forme la plus simple : le simple gagne", "principe de tête", ""],
  ["Un dominant par vue", "une seule chose se lit en premier ; deux dominants, c'est aucun", "ici", "machine"],
  ["Hiérarchie par combinaison", "corps, graisse, couleur, position — jamais la taille seule", "Typographie", ""],
  ["Sens de lecture", "l'œil balaie en F ou en Z ; l'essentiel vit sur ce chemin", "ici", "œil"],
  ["La rupture se dépense", "une seule famille de rupture par vue", "ici", "machine"],
  ["Le blanc d'abord", "on part de trop d'espace blanc, puis on retire — jamais l'inverse", "ici", "œil"],
  ["Peu d'axes, tenus", "tout élément partage un axe de départ ; un axe par élément, c'est du bruit", "ici", "machine"],
  ["Grille", "colonnes et gouttières sortent de la même base que l'échelle", "à venir", ""],
  ["Mesure de lecture", "sept à dix mots par ligne", "Typographie", ""],
  ["Dedans plus serré que dehors", "l'interne ne dépasse jamais l'externe, sur l'échelle", "Rythme", ""],
  ["Rôles d'espace nommés", "retrait, empilement, alignement, gouttière", "ici", "machine"],
];

/* ── 05 · L'adaptation — le même système, dans votre stack. L'objet est
   l'écran de la preuve 01, écrit proprement : un dominant (un cran de
   typo, dépensé une fois), des groupes faits par le blanc seul (un écart
   de rythme, plus large dehors que dedans), un seul axe (une grille à une
   colonne), l'accent posé sur un seul élément. La composition n'a pas de
   jeton à elle : elle dépense ceux des autres familles. ── */
const SNIPPETS: Record<string, Record<string, string>> = {
  React: {
    Tailwind: `// tailwind.config : theme.extend <- rhythm, typography, color (tokens.tailwind.mjs)
// La composition n'a pas de jeton à elle : elle dépense ceux des autres familles
export function EcranConformite({ dossiers, retard, derniers }) {
  return (
    <main className="grid gap-pad-2-block py-pad-2-block px-pad-1-inline">  {/* une colonne : un seul axe ; dehors… */}
      <section className="grid gap-gap-3-block">                            {/* …plus large que dedans — le blanc fait le groupe */}
        <span className="text-muted-foreground">Dossiers à valider</span>
        <b className="text-h1 leading-heading font-semibold">{dossiers}</b>  {/* le dominant : un seul par vue */}
        <span className="text-muted-foreground">dont {retard} en retard</span>
      </section>
      <section className="flex gap-pad-3-inline">
        <button className="h-control rounded-ctl bg-primary text-on-primary">Valider</button>  {/* l'accent, dépensé une fois */}
        <button className="h-control rounded-ctl text-primary-text">Exporter</button>
      </section>
      <section className="grid gap-gap-3-block">                            {/* aucune surface : elle ne se mérite pas ici */}
        <span className="text-muted-foreground">Derniers dossiers</span>
        {derniers.map((d) => <span key={d.nom}>{d.nom}</span>)}
      </section>
    </main>
  );
}`,
    shadcn: `// shadcn/ui vit sur Tailwind — donc sur nos jetons. Il fournit une surface
// (Card) et un accent (Button) : la composition décide où les dépenser
import { Button } from "@/components/ui/button";

export function EcranConformite({ dossiers, retard, derniers }) {
  return (
    <main className="grid gap-pad-2-block py-pad-2-block px-pad-1-inline">
      <section className="grid gap-gap-3-block">
        <span className="text-muted-foreground">Dossiers à valider</span>
        <b className="text-h1 leading-heading font-semibold">{dossiers}</b>
        <span className="text-muted-foreground">dont {retard} en retard</span>
      </section>
      <section className="flex gap-pad-3-inline">
        <Button>Valider</Button>                 {/* le variant par défaut porte l'accent : une fois */}
        <Button variant="ghost">Exporter</Button>
      </section>
      <section className="grid gap-gap-3-block">   {/* pas de <Card> : le blanc fait déjà le groupe */}
        <span className="text-muted-foreground">Derniers dossiers</span>
        {derniers.map((d) => <span key={d.nom}>{d.nom}</span>)}
      </section>
    </main>
  );
}`,
    "HTML natif": `/* Le normatif : la règle et le jeton. Ce code n'est qu'un exemple. */
export function EcranConformite({ dossiers, retard, derniers }) {
  return (
    <main className="ecran">
      <section className="groupe">
        <span className="etiquette">Dossiers à valider</span>
        <b className="dominant">{dossiers}</b>
        <span className="etiquette">dont {retard} en retard</span>
      </section>
      <section className="actions">
        <button className="principal">Valider</button>
        <button className="second">Exporter</button>
      </section>
      <section className="groupe">
        <span className="etiquette">Derniers dossiers</span>
        {derniers.map((d) => <span key={d.nom}>{d.nom}</span>)}
      </section>
    </main>
  );
}

/* styles.css — aucun jeton propre : ceux du rythme, de la typo, de la couleur */
.ecran    { display: grid; gap: var(--pad-2-block);           /* dehors… */
            padding: var(--pad-2-block) var(--pad-1-inline); }
.groupe   { display: grid; gap: var(--gap-3-block); }           /* …plus large que dedans */
.dominant { font: 600 var(--font-size-h1) / var(--leading-heading) var(--font-sans); }  /* un seul par vue */
.etiquette{ color: var(--text-secondary); }
.actions  { display: flex; gap: var(--pad-3-inline); }
.principal{ background: var(--primary); color: var(--on-primary); }  /* l'accent, dépensé une fois */
.second   { color: var(--primary-text); }                            /* le second ne le dépense pas */
.principal, .second { height: var(--control-height); border-radius: var(--r-ctl); }`,
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
// donc mêmes jetons : l'accent au bouton par défaut, la surface non dépensée
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
    <main class="ecran">
      <section class="groupe">
        <span class="etiquette">Dossiers à valider</span>
        <b class="dominant">{{ dossiers }}</b>
        <span class="etiquette">dont {{ retard }} en retard</span>
      </section>
      <section class="actions">
        <button class="principal">Valider</button>
        <button class="second">Exporter</button>
      </section>
      <section class="groupe">
        <span class="etiquette">Derniers dossiers</span>
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

<main class="ecran">
  <section class="groupe">
    <span class="etiquette">Dossiers à valider</span>
    <b class="dominant">34</b>
    <span class="etiquette">dont 6 en retard</span>
  </section>
  <section class="actions">
    <button class="principal">Valider</button>
    <button class="second">Exporter</button>
  </section>
  <section class="groupe">
    <span class="etiquette">Derniers dossiers</span>
    <span>Meunier SAS</span><span>Atelier Vidal</span><span>Groupe Ferrand</span>
  </section>
</main>

<style>
  .ecran    { display: grid; gap: var(--pad-2-block);
              padding: var(--pad-2-block) var(--pad-1-inline); }
  .groupe   { display: grid; gap: var(--gap-3-block); }
  .dominant { font: 600 var(--font-size-h1) / var(--leading-heading) var(--font-sans); }
  .etiquette{ color: var(--text-secondary); }
  .actions  { display: flex; gap: var(--pad-3-inline); }
  .principal{ background: var(--primary); color: var(--on-primary); }
  .second   { color: var(--primary-text); }
  .principal, .second { height: var(--control-height); border-radius: var(--r-ctl); }
</style>`,
  },
};

export default function Vue() {
  const actifId = useDocSections("casse");
  const [faute, setFaute] = useState("");
  const [fw, setFw] = useState<"React" | "Angular" | "HTML">("HTML");
  const { styl } = useAdaptation();
  const porte = useRef<HTMLDivElement>(null);
  const banc = useRef<HTMLDivElement>(null);
  const courante = FAUTES.find((f) => f.cle === faute)!;

  return (
    <div className="gdoc-fond">
      <div className="gdoc">
        <RailDoc page="composition" titre="Fondation · Composition" sommaire={SOMMAIRE}
          actifId={actifId} pied="COMPOSITION-UX · huit règles · deux jugées à l'œil" />

        <main className="gdoc-contenu" id="contenu">

          <section className="gdoc-heros">
            <p className="kicker">Fondation · La composition</p>
            <h1>Rien n&apos;est faux dans le détail — et l&apos;écran ne se lit pas<span className="point" aria-hidden="true" /></h1>
            <p className="chapo"><b>Les autres fondations règlent une matière : des lettres, des
            distances, des couleurs.</b> Celle-ci règle ce qui arrive quand toutes sont justes et
            que ça ne marche pas quand même — l&apos;ordre du regard, ce qu&apos;il groupe, ce
            qu&apos;il ne voit jamais.</p>
          </section>

          <section className="gdoc-sec pose" id="casse">
            <div className="gdoc-sec-tete">
              <p className="kicker">01 · L&apos;écran qu&apos;on casse</p>
              <h2>Un écran juste. Cassez-le, une faute à la fois.</h2>
              <p className="sourd">Au repos, l&apos;écran nomme ses organes — le dominant,
              l&apos;espace blanc, le groupe, l&apos;axe de départ : <b>quatre mots suffisent</b>
              à parler de composition avec quelqu&apos;un d&apos;autre. Chaque mot est écrit à
              côté de l&apos;écran et relié par un filet à ce qu&apos;il désigne. Cassez-en
              un, et les repères deviennent rouges à l&apos;endroit exact où ça casse.
              <b> Survolez l&apos;écran</b> — il se répare sous vos yeux.</p>
            </div>
            <div className="gdoc-corps">
              <div className="rang">
                {FAUTES.filter((f) => f.cle).map((f) => (
                  <button key={f.cle} className={`bouton casse ${faute === f.cle ? "on" : ""}`}
                    aria-pressed={faute === f.cle}
                    onClick={() => setFaute(faute === f.cle ? "" : f.cle)}>
                    Casser : {f.nom}
                  </button>
                ))}
              </div>
              <div className="co-scene co-preuve1">
                {/* Le haut dit l'ÉTAT (faux / réparé), le bas dit le GESTE
                    (survolez / relâchez) : jamais deux messages qui se
                    contredisent. Les deux badges occupent la même case. */}
                <span className="co-verdict">
                  <span className={`badge ${faute ? "ko" : ""}`}>{courante.verdict}</span>
                  {faute && <span className="badge bon">{courante.solution}</span>}
                </span>
                {/* Au repos, la colonne de droite EST le vocabulaire, relié à
                    l'écran par des filets ; dès qu'on casse, elle laisse la
                    place au commentaire de la faute. Les deux restent posés
                    l'un sur l'autre pour que rien ne saute au changement. */}
                <div className="co-banc" ref={banc}>
                  <div className="co-gauche">
                    <div className="co-porte" ref={porte}>
                      <Application faute={faute} />
                      <Calque faute={faute} hote={porte} />
                    </div>
                    <div className={`co-lex-pied ${faute ? "off" : ""}`}>
                      <dl><div><dt>{AXE[0]}</dt><dd>{AXE[1]}</dd></div></dl>
                    </div>
                    <div className="co-pied">
                      <span className="co-invite">
                        {faute ? "↑ survolez l'écran : il se répare sous vos yeux" : courante.invite}
                      </span>
                      {faute && <span className="co-solution">↑ relâchez : la faute revient</span>}
                    </div>
                  </div>
                  <div className="co-droite">
                    <dl className={`co-lex ${faute ? "off" : ""}`}>
                      {LEXIQUE.map(([m, t]) => (<div key={m}><dt>{m}</dt><dd>{t}</dd></div>))}
                    </dl>
                    <p className={`co-dit ${faute ? "" : "off"}`}>{courante.dit}</p>
                  </div>
                  <Legende banc={banc} actif={!faute} />
                </div>
              </div>
            </div>
          </section>

          <section className="gdoc-sec pose" id="parcours">
            <div className="gdoc-sec-tete">
              <p className="kicker">02 · Le chemin de l&apos;œil</p>
              <h2>La densité décide du parcours</h2>
              <p className="sourd">L&apos;œil entre en haut à gauche — toujours. Ce qu&apos;il
              fait ensuite dépend de ce qu&apos;on lui donne. Deux objets que tout oppose : une
              page de journal, et une affiche. Le premier se balaie en <b>F</b>, la seconde se
              parcourt en <b>Z</b>. Ce n&apos;est pas une théorie à retenir, c&apos;est une
              contrainte de placement.</p>
            </div>
            <div className="gdoc-corps">
              <div className="co-paire">
                <div>
                  <span className="co-nom-objet">une page de journal — le F</span>
                  <div className="co-porte">
                    <article className="co-presse">
                      <span className="co-surtitre">Économie</span>
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
                      <div className="co-filet" />
                      <div className="co-breve">
                        <span>· Le tribunal reporte l&apos;audience au 2 avril.</span>
                        <span>· Trois communes s&apos;associent pour la ligne 4.</span>
                        <span>· Le marché du bois recule pour le deuxième trimestre.</span>
                      </div>
                    </article>
                    <Trace type="F" retard="0s" />
                  </div>
                </div>
                <div>
                  <span className="co-nom-objet">une affiche — le Z</span>
                  <div className="co-porte">
                    <div className="co-affiche">
                      <span className="co-marque">Ateliers Vidal</span>
                      <div>
                        <p className="co-titre-aff">Portes ouvertes,<br />samedi 12 avril.</p>
                        <p className="co-sous-aff">Trois ateliers, une visite guidée toutes les
                        heures, et le café est offert.</p>
                      </div>
                      <span className="co-action">Réserver une place</span>
                    </div>
                    <Trace type="Z" retard="0.55s" />
                  </div>
                </div>
              </div>
              <p className="gd-legende">à gauche, l&apos;œil descend la première colonne et balaie
              de moins en moins loin — les fins de lignes sont les moins lues ; à droite, il fait
              deux allers-retours et s&apos;arrête sur le dernier coin : c&apos;est là que se met
              l&apos;action, jamais au milieu.</p>
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <p><b>L&apos;essentiel sur le chemin de l&apos;œil</b> — l&apos;essentiel vit sur
                le parcours ; les réglages et les métadonnées vivent en dehors. Cette règle se
                juge à la relecture : aucune mesure ne dit où est l&apos;essentiel.</p>
                <p className="sourd">Sources : <a href="https://careerfoundry.com/en/blog/ux-design/what-is-visual-hierarchy/">patterns de lecture F/Z</a> ·
                Müller-Brockmann, <i>Grid Systems in Graphic Design</i>.</p>
              </div></details>
            </div>
          </section>

          <section className="gdoc-sec pose" id="blanc">
            <div className="gdoc-sec-tete">
              <p className="kicker">03 · L&apos;espace blanc</p>
              <h2>La seule matière qu&apos;on rogne en croyant ne rien perdre</h2>
              <p className="sourd">Une page est faite de deux choses : de l&apos;encre, et de
              l&apos;espace blanc. La première se compte en signes, la seconde passe pour du
              vide — c&apos;est donc toujours elle qu&apos;on sacrifie quand il faut faire entrer
              une ligne de plus. Voici ce qu&apos;elle occupe vraiment, et ce que coûte sa
              disparition.</p>
            </div>
            <div className="gdoc-corps">
              <Magazine />
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <p><b>Le blanc d&apos;abord</b> — on compose en partant de trop d&apos;espace
                blanc, puis on retire ; jamais l&apos;inverse. Cette règle se juge à la
                relecture : la mesure dit combien d&apos;espace blanc il reste, jamais s&apos;il
                a été donné avant d&apos;être repris.</p>
                <p className="sourd">Sources : <a href="https://www.nngroup.com/articles/form-design-white-space/">NN/g — Form Design White Space</a> ·
                Wathan &amp; Schoger, <i>Refactoring UI</i> · Müller-Brockmann, <i>Grid Systems in Graphic Design</i>.</p>
              </div></details>
            </div>
          </section>

          <section className="gdoc-sec pose" id="fonds">
            <div className="gdoc-sec-tete">
              <p className="kicker">04 · Le fonds complet</p>
              <h2>Quinze lois, et il n&apos;y en a pas d&apos;autres</h2>
              <p className="sourd">En croisant la psychologie de la perception, les référentiels
              du métier et la tradition éditoriale, le fonds de la composition tient en quinze
              lois. Sept vivent déjà dans nos autres familles — les y répéter serait fabriquer
              deux sources pour une même chose ; huit vivent ici.</p>
            </div>
            <div className="gdoc-corps">
              <div style={{ width: "100%", overflowX: "auto" }}>
                <table className="tableau aere" style={{ width: "100%" }}>
                  <thead><tr><th>loi</th><th>en une phrase</th><th>où elle vit</th><th>qui la juge</th></tr></thead>
                  <tbody>
                    {FONDS.map(([nom, phrase, ou, juge]) => (
                      <tr key={nom}>
                        <td style={{ whiteSpace: "nowrap" }}>{nom}</td>
                        <td className="sourd">{phrase}</td>
                        <td><span className={`badge ${ou === "ici" ? "bon" : ""}`}>{ou}</span></td>
                        <td>{juge
                          ? <span className={`badge ${juge === "œil" ? "ko" : "bon"}`}>{juge === "œil" ? "l'œil" : "la machine"}</span>
                          : <span className="sourd">—</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="sourd" style={{ maxWidth: "var(--measure)" }}><b>Deux des huit se
              jugent à l&apos;œil, et on ne fait pas semblant de les mesurer.</b> Aucune mesure ne
              dit où est l&apos;essentiel d&apos;une page, ni si l&apos;air a été donné avant
              d&apos;être repris. Un dispositif qui surestime ses garanties est le pire des
              dispositifs : le contrôle dira « aucune des fautes nommées n&apos;est présente » —
              jamais « c&apos;est bien composé ». Cette phrase-là reste à un lecteur.</p>
              <details className="prov"><summary>Les lois comportementales, et pourquoi elles ne sont pas ici</summary><div>
                <p>Hick, Fitts, Miller — le temps de décision, la difficulté d&apos;atteindre une
                cible, la charge de mémoire — gouvernent l&apos;<b>interaction</b>, pas la
                composition. Elles concerneront les composants, quand les fondations seront
                verrouillées. Les mêler ici donnerait une famille qui parle de tout et ne décide
                de rien.</p>
              </div></details>
            </div>
          </section>

          {/* ══════════ 05 · l'adaptation ══════════ */}
          <section className="gdoc-sec pose" id="adaptation">
            <div className="gdoc-sec-tete">
              <p className="kicker">05 · L&apos;adaptation</p>
              <h2>Le même système, dans votre stack</h2>
              <p className="sourd">Un système normatif enfermé dans un framework n&apos;est
              qu&apos;une bibliothèque. Ici le normatif vit dans la règle et le jeton — et la
              composition n&apos;a pas de jeton à elle : elle dépense ceux des autres familles,
              dans un ordre. L&apos;écran de la première preuve, écrit proprement ; React,
              Angular ou HTML n&apos;en sont que des consommateurs.</p>
            </div>
            <div className="gdoc-corps">
              <PanneauCode langage={styl} outils={
                <>{(["HTML", "React", "Angular"] as const).map((f) => (
                  <button key={f} className={`bouton ${fw === f ? "on" : ""}`} onClick={() => setFw(f)}>{f}</button>
                ))}</>
              } code={SNIPPETS[fw][styl]} />
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <p>Le normatif, ici, c&apos;est <b>la règle et le jeton</b> — pas le code. La
                composition ne crée aucun jeton : le dominant est un cran de l&apos;échelle
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
                <p className="sourd">Sources : COMPOSITION-UX (huit règles, deux jugées à
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
