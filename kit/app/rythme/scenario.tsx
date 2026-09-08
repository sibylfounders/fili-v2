"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState,
  type CSSProperties, type ReactNode } from "react";
import { SliceFili } from "./view";
import { chain, CHARTER, BOUNDS, INTENTS } from "../../derivation.mjs";

/* ═══════════════════════════════════════════════════════════════════════
   LE SCÉNARIO DU MOTEUR — DES SLIDES (2 septembre 2026)

   Cinq verdicts d'Auteur ont fait converger la forme :
   · « c'est plus ça que j'attends — un scénario » : une démo n'a pas
     d'enjeu, une histoire en a un. L'enjeu est le nombre de décisions.
   · « mon œil balade trop de gauche à droite » : plus deux colonnes.
   · « des blocs d'infos comme ça, mais petit à petit » (planche jointe) :
     ce qui commente la fiche est POSÉ sur elle, relié par un trait à
     l'endroit exact qu'il nomme, et les blocs arrivent un par un.
   · « avant on faisait comme ça peut être fait en une seule slide ».
   · « rien n'interdit de faire comme sur PowerPoint : une slide texte avec
     la problématique, une slide image avec commentaires pour la solution.
     Début : on croule sous les décisions. Fin : on n'en a plus que 4. »

   D'où : UN cadre, toujours le même, et des slides qui s'y succèdent. Une
   slide de texte ne montre rien d'autre que sa phrase — l'œil n'a nulle
   part où aller. Une slide de visuel ne porte pas de récit — il est dans
   les blocs, attachés à ce qu'ils nomment.

   Trois lois tenues par ce fichier :
   1. La fiche n'est pas une copie — c'est la TrancheFili de la page Rythme.
   2. Aucune slide du moteur n'écrit une valeur : elle MASQUE les jetons pas
      encore entrés, et la géométrie revient d'elle-même. Les seules valeurs
      écrites en dur sont celles de la slide « avant » — c'est son sujet :
      elles ne descendent de rien. Rupture déclarée.
   3. Rien ne descend sur le document : tout est posé sur la scène.
   ═══════════════════════════════════════════════════════════════════════ */

const GROUPS: string[][] = [
  ["--pad-1-block", "--pad-1-inline"],
  ["--pad-2-block", "--pad-2-inline", "--pad-3-block", "--pad-3-inline"],
  ["--gap-1-block", "--gap-1-inline", "--gap-2-block", "--gap-2-inline",
   "--gap-3-block", "--gap-3-inline", "--gap-4-block", "--gap-4-inline"],
  ["--r-1", "--r-2", "--r-3"],
];
function mask(level: number): Record<string, string> {
  const v: Record<string, string> = {};
  GROUPS.forEach((g, k) => { if (level <= k) g.forEach((j) => { v[j] = "0px"; }); });
  if (level <= 4) v["--font-size-body"] = "var(--font-size-small)";
  return v;
}
const BARE = mask(0);

/* La slide « avant » : des valeurs écrites une par une, plausibles, et qui
   ne descendent de rien. */
const MAIN: Record<string, string> = {
  "--pad-1-block": "24px", "--pad-1-inline": "24px",
  "--pad-2-block": "20px", "--pad-2-inline": "20px",
  "--pad-3-block": "12px", "--pad-3-inline": "12px",
  "--gap-1-block": "16px", "--gap-1-inline": "16px",
  "--gap-2-block": "12px", "--gap-2-inline": "12px",
  "--gap-3-block": "10px", "--gap-3-inline": "8px",
  "--gap-4-block": "6px", "--gap-4-inline": "6px",
  "--r-1": "14px", "--r-2": "10px", "--r-3": "6px", "--font-size-body": "17px",
};

/* Les dix-sept décisions de l'ancienne méthode. Chacune est DITE dans la
   liste — c'est là qu'on lit ce qu'elle a décidé — et POSÉE sur la fiche à
   l'endroit qu'elle mesure vraiment.
   Deux verdicts d'Auteur ont façonné ce bloc : une étiquette ne masque pas
   le texte qu'elle commente, et elle doit être « crédible dans son
   emplacement » — une hauteur de bouton posée dans un coin vide ne montre
   rien. Donc aucune coordonnée écrite à la main : chaque étiquette va
   chercher SON élément dans la fiche et se pose sur son bord. */
type Corner = "center" | "left" | "right" | "top" | "bottom" | "hg" | "hd" | "bg" | "bd";
/* Quatre familles, quatre couleurs — et ce ne sont pas des couleurs
   inventées : les marges en rouge et les écarts en vert, c'est la
   convention des inspecteurs verrouillée le 24 août. Les coins et les
   tailles prennent les deux familles sémantiques qui restent. */
type Fam = "margin" | "space" | "corner" | "size";
const SIEVE: { v: string; says: string; fam: Fam; sel: string; idx?: number; or: Corner }[] = [
  /* L'ordre suit la fiche, du haut vers le bas — donc les familles s'y
     mêlent, et c'est voulu (verdict d'Auteur) : personne ne prend ses
     décisions rangées par catégorie. La couleur seule les regroupe. */
  { v: "24", says: "la marge du container", fam: "margin", sel: ".ry-margin1 .top", or: "center" },
  { v: "14", says: "le coin du container", fam: "corner", sel: ".slice", or: "hg" },
  { v: "20", says: "la marge de la card", fam: "margin", sel: ".tr-card-body > .space.pad", or: "center" },
  { v: "10", says: "le coin de la card", fam: "corner", sel: ".tr-card", or: "hd" },
  { v: "40", says: "la pastille de l'avatar", fam: "size", sel: ".tr-avatar", or: "left" },
  { v: "20", says: "le nom", fam: "size", sel: ".tr-name", or: "right" },
  { v: "17", says: "le corps du texte", fam: "size", sel: ".tr-role", or: "right" },
  { v: "44", says: "la hauteur d'un bouton", fam: "size", sel: ".tr-btn.first", or: "left" },
  { v: "16", says: "le retrait d'un bouton", fam: "margin", sel: ".tr-btn.first", or: "bottom" },
  { v: "8", says: "entre deux boutons", fam: "space", sel: '.space.h.gap[data-step="4"]', idx: 0, or: "top" },
  { v: "6", says: "le coin d'un bouton", fam: "corner", sel: ".ry-flex .tr-btn:last-child", or: "hd" },
  { v: "12", says: "entre deux rows", fam: "space", sel: '.tr-card-body > .space.gap[data-step="3"]', idx: 1, or: "center" },
  { v: "10", says: "la marge d'un bloc", fam: "margin", sel: ".tr-sub", idx: 0, or: "left" },
  { v: "6", says: "sous un chiffre", fam: "space", sel: ".tr-sub b", idx: 0, or: "bottom" },
  { v: "13", says: "la légende", fam: "size", sel: ".tr-sub span", idx: 0, or: "bottom" },
  { v: "6", says: "entre deux blocs", fam: "space", sel: '.space.h.gap[data-step="4"]', idx: 1, or: "bottom" },
  { v: "12", says: "avant les boutons", fam: "space", sel: '.tr-card-body > .space.gap[data-step="3"]', idx: 0, or: "center" },
];

/* Le point d'accroche : un bord de l'élément, jamais son milieu quand
   l'élément porte du texte. */
function hook(r: DOMRect, base: DOMRect, or: Corner): { x: number; y: number } {
  const L = r.left - base.left, R = r.right - base.left;
  const T = r.top - base.top, B = r.bottom - base.top;
  const cx = (L + R) / 2, cy = (T + B) / 2;
  switch (or) {
    case "left": return { x: L, y: cy };
    case "right": return { x: R, y: cy };
    case "top": return { x: cx, y: T };
    case "bottom": return { x: cx, y: B };
    case "hg": return { x: L, y: T };
    case "hd": return { x: R, y: T };
    case "bg": return { x: L, y: B };
    case "bd": return { x: R, y: B };
    default: return { x: cx, y: cy };
  }
}
/* Deux étiquettes qui se recouvrent ne se lisent plus ni l'une ni l'autre :
   la seconde descend, elle ne change pas de camp. */
function discard(pts: ({ x: number; y: number } | null)[]): ({ x: number; y: number } | null)[] {
  const facts: { x: number; y: number }[] = [];
  return pts.map((p) => {
    if (!p) return null;
    const q = { ...p };
    for (let turn = 0; turn < 8; turn++) {
      const clash = facts.some((f) => Math.abs(f.y - q.y) < 19 && Math.abs(f.x - q.x) < 72);
      if (!clash) break;
      q.y += 21;
    }
    facts.push(q);
    return q;
  });
}

/* ── Les jetons de la scène ──────────────────────────────────────────
   Le masque du récit, alimenté par le vrai moteur : les groupes pas encore
   entrés restent à zéro, les autres prennent la valeur que chaine() rend
   pour les réglages du moment. C'est ce qui permet de poser une molette
   sous le titre de chaque slide.

   Une réserve honnête, et une correction. La réserve : le glissement d'un
   axe à l'autre (l'horizontal et le vertical ne glissent pas au même rythme
   d'un écran à l'autre) reste le sujet de la page Rythme — ici on pose les
   valeurs au repos.
   La correction (verdict d'Auteur, 2 septembre) : la fiche est une
   MINIATURE — elle est composée un cran sous le corps de la page. On ne lui
   pose donc ni son corps ni ses étiquettes depuis la chaîne : monter
   l'intervalle des titres les faisait RAPETISSER, alors que la slide dit
   exactement l'inverse. Ce qui monte, c'est le nom ; le texte de la fiche
   ne bouge pas. */
type Foundation = ReturnType<typeof chain>;
function tokensEngine(level: number, s: Foundation): Record<string, string> {
  const px = (v: number) => `${Math.round(v * 100) / 100}px`;
  const o: Record<string, string> = {};
  const z = (still: boolean, v: number) => (still ? "0px" : px(v));
  o["--pad-1-block"] = o["--pad-1-inline"] = z(level <= 0, s.pad[0]);
  o["--pad-2-block"] = o["--pad-2-inline"] = z(level <= 1, s.pad[1]);
  o["--pad-3-block"] = o["--pad-3-inline"] = z(level <= 1, s.pad[2]);
  [0, 1, 2, 3].forEach((k) => {
    o[`--gap-${k + 1}-block`] = o[`--gap-${k + 1}-inline`] = z(level <= 2, s.gap[k]);
  });
  [0, 1, 2].forEach((k) => { o[`--r-${k + 1}`] = z(level <= 3, s.r[k]); });
  o["--r-ctl"] = z(level <= 3, s.rCtl);
  /* Le nom de la fiche joue le rôle du titre ; le texte autour joue le rôle
     du corps et garde son plancher. Tant que l'intervalle des titres n'est
     pas entré, les deux sont à plat — c'est ce que le quatrième nombre
     vient corriger, et rien d'autre ne bouge. */
  o["--font-size-body"] = level <= 4
    ? "var(--font-size-small)"
    : `calc(var(--font-size-small) * ${s.entries.intervalHeadings})`;
  o["--control-height"] = px(s.control);
  o["--control-height-compact"] = px(s.controlCompact);
  return o;
}
const fr = (v: number) => String(Math.round(v * 10) / 10).replace(".", ",");
const fr2 = (v: number) => String(Math.round(v * 100) / 100).replace(".", ",");

function Wheel({ id, name, min, max, increment, value, onValue, says }: {
  id: string; name: string; min: number; max: number; increment: number;
  value: number; onValue: (v: number) => void; says: string;
}) {
  return (
    <span className="mo-wheel">
      <label htmlFor={id}>{name}</label>
      <input type="range" id={id} min={min} max={max} step={increment} value={value}
        onChange={(e) => onValue(+e.target.value)} />
      <output htmlFor={id} className="mono">{says}</output>
    </span>
  );
}

/* ── LES VERSIONS ────────────────────────────────────────────────────
   La blague la plus vraie du métier : v1, v1.1, v2, v2-final, v2-final-2.
   À chaque version, quelqu'un a repris les mêmes familles de décisions et
   les a prises autrement — et personne ne s'est trompé : 32 est une marge
   raisonnable, 16 un coin raisonnable. Sauf qu'à la fin, la card de v2 a
   son enfant plus rond que son parent, celle de v2-final a une marge de
   card plus large que celle de son container, et celle de v2-final-2 a le
   même coin à tous les étages. Plus personne ne sait laquelle est la bonne
   (idée d'Auteur, 2 septembre).
   Toutes ces valeurs sont écrites une par une : c'est leur sujet, elles ne
   descendent de rien. ── */
type Version = { name: string; vars: Record<string, string> };
const VERSIONS: Version[] = [
  { name: "v1", vars: MAIN },
  { name: "v1.1", vars: { ...MAIN,
    "--gap-2-block": "16px", "--gap-2-inline": "16px",
    "--r-1": "12px", "--r-2": "8px", "--r-3": "4px", "--font-size-body": "16px" } },
  { name: "v2", vars: { ...MAIN,
    "--pad-1-block": "32px", "--pad-1-inline": "32px",
    "--pad-2-block": "16px", "--pad-2-inline": "16px",
    "--pad-3-block": "10px", "--pad-3-inline": "10px",
    "--gap-3-block": "6px", "--gap-3-inline": "12px",
    "--r-1": "8px", "--r-2": "16px", "--r-3": "2px", "--font-size-body": "15px" } },
  { name: "v2-final", vars: { ...MAIN,
    "--pad-1-block": "20px", "--pad-1-inline": "20px",
    "--pad-2-block": "24px", "--pad-2-inline": "24px",
    "--gap-2-block": "10px", "--gap-2-inline": "10px",
    "--r-1": "16px", "--r-2": "12px", "--r-3": "8px", "--font-size-body": "18px" } },
  { name: "v2-final-2", vars: { ...MAIN,
    "--pad-1-block": "28px", "--pad-1-inline": "28px",
    "--pad-2-block": "18px", "--pad-2-inline": "18px",
    "--gap-2-block": "8px", "--gap-2-inline": "8px",
    "--r-1": "10px", "--r-2": "10px", "--r-3": "10px", "--font-size-body": "16px" } },
];


/* Les ancres : de vrais éléments de la fiche, jamais des coordonnées. Le
   bloc va chercher l'endroit qu'il nomme et le suit quand ça bouge. */
const A_MARGIN = ".ry-margin1 .top";
const A_CARD = ".tr-card-body > .space.pad";
const A_GAP = '.tr-card-body > .space.gap[data-step="3"]';
const A_CORNER = ".tr-card";
const A_NAME = ".tr-name";

type What = "base" | "interval" | "root" | "headings";
type Note = { key: string; anchor: string; heading: string; says: string; tone?: "fault" | "deduit" };
const M_BASE: Note = { key: "b", anchor: A_MARGIN, heading: "la base · 24 px",
  says: "La marge la plus extérieure, et la seule qui n'est déduite de rien. On commence par elle parce que tout le reste en descend." };
const M_INT: Note = { key: "i", anchor: A_CARD, heading: "l'intervalle · ÷ 1,41",
  says: "La card reçoit 17, la row 12. Personne ne les a écrits." };
const M_ECA: Note = { key: "d", anchor: A_GAP, heading: "les écarts · déduits", tone: "deduit",
  says: "L'espace entre deux voisins vaut leur marge : 12. Zéro décision." };
const M_ROOT: Note = { key: "r", anchor: A_CORNER, heading: "la racine · 16 px",
  says: "Le coin se divise par deux : 16, 8, 4. Un enfant n'est jamais plus rond que son parent." };
const M_TIT: Note = { key: "s", anchor: A_NAME, heading: "l'intervalle des titres · × 1,25",
  says: "Le nom monte d'un cran. Le texte reste à son plancher." };

/* Le compteur porte une HUMEUR en plus de sa couleur : une carte
   émotionnelle de designer. Le chiffre dit combien, la couleur dit si ça
   tient, l'humeur dit ce que ça fait de le vivre (idée d'Auteur,
   2 septembre). */
/* Un titre peut être une phrase, ou une phrase QUI COMPTE : la slide des
   dix-sept fait défiler son chiffre comme le compteur, et les deux montent
   ensemble (verdict d'Auteur, 2 septembre). */
type Heading = ReactNode | ((n: number) => ReactNode);
type Common = { chap: string; count: number; mood: string; says?: string;
  tone?: "fault" | "right"; level?: number; vars?: Record<string, string>;
  /* Une slide peut faire défiler les VERSIONS de la fiche : les onglets
     tournent, et à chaque fois la card se recompose. */
  versions?: Version[] };
type Slide =
  | (Common & { genre: "text"; sentence: ReactNode; sub?: ReactNode })
  | (Common & { genre: "visual"; rises?: boolean; notes: Note[]; sieve?: boolean;
      wheel?: What; wheelSays?: string; unknown?: boolean; corners?: boolean; heading: Heading })
  | (Common & { genre: "demo"; heading: Heading;
      commands: "molettes" | "intents"; stop?: boolean });

const SLIDES: Slide[] = [
  /* La question s'ouvre SUR l'exemple, pas à côté (verdict d'Auteur,
     2 septembre). Le compteur reste caché : c'est lui, la réponse, et elle
     tombe à la slide suivante — dans le vide à droite de la fiche, qui est
     exactement là où la liste va s'écrire. */
  { genre: "visual", chap: "L'histoire", count: 0, unknown: true, mood: "🤔", notes: [], vars: MAIN,
    heading: <>Vous savez <em>combien de décisions</em> il a fallu prendre pour rendre cette card agréable visuellement ?</> },

  { genre: "visual", chap: "sans compter les allers-retours", count: 17, rises: true, tone: "fault", mood: "😅",
    notes: [], sieve: true, vars: { ...BARE, ...MAIN },
    heading: (n: number) => <><em>{n} décisions</em> prises minutieusement</> },

  /* La fiche ne quitte jamais la scène : chaque slide de texte dit dans
     quel état elle la montre. Ici, encore composée à la main — les
     étiquettes sont tombées, la card est belle, et c'est le sujet. */
  { genre: "text", chap: "Le problème", count: 425, tone: "fault", mood: "😱",
    says: "décisions sur 25 itérations", versions: VERSIONS,
    sentence: <>25 itérations plus tard, <em>plus personne ne sait quelle est la bonne
      version</em>.</>,
    sub: <>Le design system donne les valeurs. Il ne dit pas <b>laquelle va où</b> — alors à
      chaque version, quelqu&apos;un a choisi. Le suivant choisira autrement, <b>sans se tromper
      non plus</b>.</> },

  /* On n'annonce pas le chiffre ici (verdict d'Auteur, 2 septembre) : le
     compteur est là pour ça, et il retombe à zéro sous nos yeux pendant que
     la fiche se dénude. Dire « quatre » d'avance, c'est raconter la fin. */
  { genre: "text", chap: "La bascule", count: 0, mood: "🧹", level: 0,
    sentence: <>On met ça à plat, <em>et on repart de zéro</em>.</>,
    sub: <>Cette fois on décide <b>avant</b> de dessiner — et on continue de compter.</> },

  { genre: "visual", chap: "Le moteur · 1", count: 1, mood: "🙂", notes: [M_BASE], level: 1, wheel: "base",
    heading: <>D&apos;abord, <em>la marge du container</em></> },

  { genre: "visual", chap: "Le moteur · 2", count: 2, mood: "🙂", notes: [M_BASE, M_INT], level: 2, wheel: "interval",
    heading: <>Puis elle <em>se divise à chaque étage</em></> },

  { genre: "visual", chap: "Le moteur · les écarts", count: 2, mood: "😌", notes: [M_BASE, M_INT, M_ECA], level: 3, wheel: "interval",
    /* Deux slides de suite tournent le même nombre — mais elles n'en
       montrent pas la même chose. Ici on ne règle pas la descente : on
       vérifie que les écarts la suivent sans qu'on les touche. L'étiquette
       le dit, sinon c'est deux fois le même curseur (verdict d'Auteur). */
    wheelSays: "tourne : les écarts suivent tout seuls",
    heading: <>Alors les écarts <em>se déduisent tout seuls</em></> },

  { genre: "visual", chap: "Le moteur · 3", count: 3, mood: "🙂", notes: [M_BASE, M_INT, M_ECA, M_ROOT], level: 4, wheel: "root", corners: true,
    heading: <>Ensuite, les coins <em>se divisent par deux</em></> },

  { genre: "visual", chap: "Le moteur · 4", count: 4, tone: "right", mood: "😃",
    notes: [M_BASE, M_INT, M_ECA, M_ROOT, M_TIT], level: 5, wheel: "headings",
    heading: <>Enfin, <em>le titre monte</em> et le texte reste</> },

  { genre: "text", chap: "Le verdict", count: 4, tone: "right", mood: "😎",
    says: "décisions, pour les 25 pages", level: 5,
    sentence: <>425 décisions d&apos;un côté. <em>4 de l&apos;autre.</em></>,
    sub: <>Et ce 4 ne bougera pas : quatre pour vingt-cinq pages, quatre pour mille. Chaque
      distance sait d&apos;où elle vient — <b>on peut la retrouver, l&apos;expliquer, la changer
      partout d&apos;un coup</b>.</> },

  { genre: "demo", chap: "À toi", count: 4, tone: "right", mood: "🎛️",
    commands: "molettes",
    heading: <>Les quatre nombres, <em>entre tes mains</em></> },

  /* La dernière marche (idée d'Auteur, 2 septembre) : le moteur du kit
     range déjà des INTENTIONS — des jeux de nombres qui vont ensemble et
     qui ont un nom de métier. En choisir une, c'est prendre une seule
     décision et recevoir les quatre. Honnêteté de la slide : une intention
     porte trois nombres, le quatrième — l'intervalle des titres — est le
     même pour tout le monde, et c'est dit. */
  { genre: "demo", chap: "Bonus", count: 1, tone: "right", mood: "🎁",
    says: "décision prise", commands: "intents", stop: true,
    heading: <>Et même en <em>1 seule décision</em> !</> },
];
const LAST = SLIDES.length - 1;

/* Ce qui est NEUF sur chaque slide. Les blocs déjà posés ne se rejouent
   pas : ils restent où ils sont, réduits à leur ligne en gras et estompés.
   Seul le nouveau arrive, en entier (verdict d'Auteur, 2 septembre — tout
   effacer pour tout réafficher une par une donne le tournis et efface
   justement ce qu'on vient de comprendre). */
const FRESH: string[][] = SLIDES.map((sl, k) => {
  if (sl.genre !== "visual" || sl.sieve) return [];
  let j = k - 1;
  while (j >= 0) {
    const p = SLIDES[j];
    if (p.genre === "visual" && !p.sieve) break;
    j -= 1;
  }
  const before = new Set<string>();
  if (j >= 0) { const p = SLIDES[j]; if (p.genre === "visual") p.notes.forEach((n) => before.add(n.key)); }
  return sl.notes.filter((n) => !before.has(n.key)).map((n) => n.key);
});

/* Durée d'une slide : le temps de la lire (≈ 190 mots/minute), jamais moins
   de cinq secondes, et jamais moins que le temps qu'il faut à ses blocs
   pour se poser. */
function countUp(n: ReactNode): number {
  if (n === null || n === undefined || typeof n === "boolean") return 0;
  if (typeof n === "string" || typeof n === "number") return String(n).trim().split(/\s+/).filter(Boolean).length;
  if (Array.isArray(n)) return n.reduce((s: number, x) => s + countUp(x), 0);
  const e = n as { props?: { children?: ReactNode } };
  return e.props ? countUp(e.props.children) : 0;
}
const headingOf = (sl: Slide, n: number): ReactNode =>
  sl.genre === "text" ? null : (typeof sl.heading === "function" ? sl.heading(n) : sl.heading);

const DURATIONS = SLIDES.map((s) => {
  /* On ne quitte jamais la slide où la lecture s'arrête ; celle des quatre
     molettes, elle, laisse le temps d'y toucher puis passe la main. */
  if (s.genre === "demo") return s.stop ? 1e9 : 14000;
  if (s.genre === "text") return Math.max(5200, (countUp(s.sentence) + countUp(s.sub)) * 340 + 1600);
  const blocks = s.sieve ? 2300 : 1000 + Math.max(1, FRESH[SLIDES.indexOf(s)].length) * 950;
  return Math.max(5200, 1000 + blocks + countUp(headingOf(s, s.count)) * 320 + 1600);
});

type Place = { y: number; x: number };

export default function Scenario() {
  const [i, setI] = useState(0);
  /* La slide COURANTE (i) et la slide AFFICHÉE (vu) sont deux choses : entre
     les deux, le temps de faire sortir l'ancienne avant de faire entrer la
     nouvelle. Sans ce délai, tout disparaissait d'un coup et réapparaissait —
     « cassant », dit le verdict d'Auteur du 2 septembre. La fiche, elle, ne
     participe pas au fondu : c'est le point fixe. */
  const [seen, setSeen] = useState(0);
  const [output, setOutput] = useState(false);
  const seenRef = useRef(0);
  const [reading, setReading] = useState(false);
  const [advance, setAdvance] = useState(0);
  const [setAll, setSetAll] = useState(0);
  const [ver, setVer] = useState(0);
  const wheel = useRef(0);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const [places, setPlaces] = useState<Record<string, Place>>({});
  const [tags, setTags] = useState<({ x: number; y: number } | null)[]>([]);
  const [elbow, setElbow] = useState(0);
  const [ceiling, setCeiling] = useState(0);
  const [ground, setGround] = useState(0);

  const frame = useRef<HTMLDivElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const record = useRef<HTMLDivElement>(null);
  const header = useRef<HTMLDivElement>(null);
  const foot = useRef<HTMLDivElement>(null);
  const auto = useRef(true);
  const loop = useRef(0);
  const start = useRef(0);
  const current = useRef(0);
  const chronos = useRef<number[]>([]);

  /* Les quatre molettes de la dernière slide. Elles ne repeignent que leur
     scène : aucune valeur ne descend sur le document. */
  const [base, setBase] = useState<number>(CHARTER.base);
  const [interv, setInterv] = useState<number>(CHARTER.interval);
  const [root, setRoot] = useState<number>(CHARTER.root);
  const [headings, setHeadings] = useState<number>(CHARTER.intervalHeadings);
  const foundation = chain({ base, interval: interv, root, intervalHeadings: headings }) as Foundation;

  useEffect(() => {
    if (i === seenRef.current) return;
    setOutput(true);
    const t = window.setTimeout(() => {
      seenRef.current = i; setSeen(i); setOutput(false);
    }, 200);
    return () => clearTimeout(t);
  }, [i]);

  const s = SLIDES[seen];
  const visual = s.genre === "visual" ? s : null;

  /* Une molette pose la main sur le récit : la lecture s'arrête plutôt que
     de tirer la slide sous les doigts. */
  /* L'étiquette d'une molette dit ce qui CHANGE À L'ÉCRAN quand on la
     bouge — pas le nom du nombre, et pas davantage la formule : « cran »
     est du vocabulaire maison, il ne parle qu'à qui a déjà lu le kit
     (verdict d'Auteur, 2 septembre — « ON DIVISE CHAQUE CRAN PAR : non
     plus. Quoi ? »). Le nom du nombre reste dans le titre de la slide et
     dans son bloc d'infos, où il est expliqué.
     Un même nombre peut avoir deux étiquettes s'il se règle à deux endroits
     qui n'en montrent pas la même face : dans le scénario, l'intervalle
     resserre les ÉTAGES de la fiche ; à la section 03, il resserre
     l'ÉCHELLE entière. Deux fois la même phrase serait deux fois la même
     démonstration. */
  const SETTINGS: Record<What, { id: string; name: string; min: number; max: number; increment: number;
    value: number; onValue: (v: number) => void; says: string }> = {
    base: { id: "mo-base", name: "plus ou moins d'air", min: BOUNDS.base[0], max: BOUNDS.base[1], increment: 1,
      value: base, onValue: setBase, says: `${fr(base)} px` },
    interval: { id: "mo-int", name: "des étages plus ou moins serrés", min: BOUNDS.interval[0], max: BOUNDS.interval[1], increment: 0.01,
      value: interv, onValue: setInterv, says: fr2(interv) },
    root: { id: "mo-root", name: "des coins plus ou moins ronds", min: BOUNDS.root[0], max: BOUNDS.root[1], increment: 1,
      value: root, onValue: setRoot, says: `${fr(root)} px` },
    headings: { id: "mo-tit", name: "le titre plus ou moins haut", min: BOUNDS.intervalHeadings[0], max: BOUNDS.intervalHeadings[1], increment: 0.01,
      value: headings, onValue: setHeadings, says: fr2(headings) },
  };
  const aThereMain = () => { auto.current = false; turnoff(); };

  const demo = s.genre === "demo";
  const sieve = s.genre === "visual" && !!s.sieve;
  const question = s.genre === "visual" && s.unknown ? headingOf(s, score) : null;
  const unknown = s.genre === "visual" && !!s.unknown;
  /* Une slide à blocs d'infos : le panneau n'y porte qu'un titre et une
     molette, ils se rangent en haut et laissent la place aux blocs. */
  const blocks = s.genre === "visual" && !s.sieve && !s.unknown;

  /* Les jetons de la scène. Le crible pose ses valeurs écrites à la main,
     tout le reste vient du moteur — et CHAQUE slide, texte comprise, dit
     dans quel état elle montre la fiche. C'est ce qui permet de la garder à
     l'écran d'un bout à l'autre : « on efface tout » se voit, il ne se
     raconte pas. */
  const tokens: Record<string, string> = demo
    ? tokensEngine(5, foundation)
    : s.versions ? s.versions[Math.min(ver, s.versions.length - 1)].vars
    : s.level !== undefined ? tokensEngine(s.level, foundation) : (s.vars ?? {});

  /* ── Les blocs (ou les confettis) se posent un par un ── */
  useEffect(() => {
    chronos.current.forEach(clearTimeout); chronos.current = [];
    setSetAll(0);
    const v = SLIDES[seen];
    if (v.genre !== "visual") return;
    const n = v.sieve ? SIEVE.length : FRESH[seen].length;
    const increment = v.sieve ? 95 : 950;
    const begin = v.sieve ? 320 : 620;
    for (let k = 0; k < n; k++) {
      chronos.current.push(window.setTimeout(() => setSetAll(k + 1), begin + k * increment));
    }
    return () => { chronos.current.forEach(clearTimeout); chronos.current = []; };
  }, [seen]);

  /* Les onglets tournent tout seuls : c'est le défilé des versions qui
     raconte, pas un onglet posé. Un clic reprend la main et arrête le
     manège — et la lecture avec lui. */
  useEffect(() => {
    window.clearInterval(wheel.current);
    setVer(0);
    const v = SLIDES[seen];
    if (!("versions" in v) || !v.versions) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const n = v.versions.length;
    wheel.current = window.setInterval(() => setVer((k) => (k + 1) % n), 1250);
    return () => window.clearInterval(wheel.current);
  }, [seen]);

  /* ── Le compteur : il monte quand la slide le demande, sinon il se pose ── */
  /* Le compteur ne se pose jamais : il part de là où il en est et rejoint
     la nouvelle valeur. C'est ce qui fait voir la montée (dix-sept par page,
     vingt-cinq pages) et surtout la chute — sans elle, 425 et 4 ne seraient
     que deux nombres écrits l'un après l'autre. */
  useEffect(() => {
    const v = SLIDES[seen];
    const begin = scoreRef.current, target = v.count;
    if (begin === target) return;
    const D = v.genre === "visual" && v.rises
      ? 1900   /* il monte au rythme des étiquettes qui tombent : ensemble, ils finissent ensemble */
      : Math.min(2200, 420 + Math.abs(target - begin) * 4);
    let id = 0;
    const t0 = performance.now();
    const increment = (t: number) => {
      const q = Math.min(1, (t - t0) / D);
      const n = Math.round(begin + (target - begin) * (1 - Math.pow(1 - q, 3)));
      scoreRef.current = n; setScore(n);
      if (q < 1) id = requestAnimationFrame(increment);
    };
    id = requestAnimationFrame(increment);
    return () => cancelAnimationFrame(id);
  }, [seen]);

  /* ── Chaque bloc va chercher l'endroit qu'il nomme. On mesure après la
       transition de géométrie, sinon on lirait la position d'avant. ── */
  const measureIt = useCallback(() => {
    const sc = scene.current, fi = record.current;
    if (!sc || !fi) return;
    const base = sc.getBoundingClientRect();
    setElbow(fi.getBoundingClientRect().right - base.left + 28);
    /* Le plafond : les blocs d'infos ne montent jamais au-dessus de
       l'en-tête du panneau. Sans lui, un bloc ancré haut sur la fiche
       venait s'écrire par-dessus le titre et la molette (verdict d'Auteur,
       2 septembre). C'est le bloc qui cède, pas le titre. */
    const inside = header.current, pi = foot.current;
    setCeiling(inside ? inside.getBoundingClientRect().bottom - base.top + 20 : 0);
    /* Le sol : le haut de la molette. Le commentaire se centre ENTRE les
       deux — pas au milieu du panneau, qui ne veut rien dire quand le titre
       et la commande n'ont pas la même hauteur (verdict d'Auteur). */
    setGround(pi ? pi.getBoundingClientRect().top - base.top - 20 : base.height);
    const v = SLIDES[seenRef.current];

    if (v.genre !== "visual") return;
    if (v.sieve) {
      const bf = fi.getBoundingClientRect();
      setTags(discard(SIEVE.map((c) => {
        const els = fi.querySelectorAll(c.sel);
        const el = els[c.idx ?? 0] as HTMLElement | undefined;
        if (!el) return null;
        return hook(el.getBoundingClientRect(), bf, c.or);
      })));
      return;
    }
    const found: Record<string, Place> = {};
    v.notes.forEach((n) => {
      const el = sc.querySelector(n.anchor) as HTMLElement | null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      found[n.key] = { y: r.top + r.height / 2 - base.top, x: r.right - base.left };
    });
    setPlaces(found);
  }, []);

  useLayoutEffect(() => {
    measureIt();
    const t1 = window.setTimeout(measureIt, 340);
    const t2 = window.setTimeout(measureIt, 780);
    window.addEventListener("resize", measureIt);
    return () => { clearTimeout(t1); clearTimeout(t2); window.removeEventListener("resize", measureIt); };
  }, [seen, setAll, measureIt]);

  /* ── Le lecteur ── */
  const turnoff = useCallback(() => {
    cancelAnimationFrame(loop.current); setReading(false); setAdvance(0);
  }, []);
  const lightup = useCallback((since?: number) => {
    cancelAnimationFrame(loop.current);
    if (since !== undefined) { setI(since); current.current = since; }
    start.current = performance.now();
    setReading(true);
    const increment = (t: number) => {
      const q = Math.min(1, (t - start.current) / DURATIONS[current.current]);
      setAdvance(q);
      if (q >= 1) {
        if (current.current >= LAST) { auto.current = false; turnoff(); return; }
        current.current += 1; setI(current.current); start.current = t; setAdvance(0);
        /* on ne joue pas par-dessus la main de l'utilisateur */
        const next = SLIDES[current.current];
        if (next.genre === "demo" && next.stop) { auto.current = false; turnoff(); return; }
      }
      loop.current = requestAnimationFrame(increment);
    };
    loop.current = requestAnimationFrame(increment);
  }, [turnoff]);
  const go = useCallback((k: number) => {
    const n = Math.max(0, Math.min(LAST, k));
    current.current = n; setI(n); start.current = performance.now(); setAdvance(0);
  }, []);

  /* Le scénario démarre quand il entre dans le champ et se met en pause
     quand on le quitte. Arrêté à la main, il ne redémarre plus seul. */
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { auto.current = false; return; }
    const eye = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { if (auto.current) lightup(); } else turnoff(); });
    }, { threshold: 0.2 });
    eye.observe(el);
    return () => { eye.disconnect(); cancelAnimationFrame(loop.current); };
  }, [lightup, turnoff]);

  useEffect(() => {
    const keystroke = (e: KeyboardEvent) => {
      const c = frame.current; if (!c) return;
      const r = c.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key === "ArrowRight") { e.preventDefault(); auto.current = false; turnoff(); go(current.current + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); auto.current = false; turnoff(); go(current.current - 1); }
    };
    window.addEventListener("keydown", keystroke);
    return () => window.removeEventListener("keydown", keystroke);
  }, [go, turnoff]);

  const moves = (d: number) => { auto.current = false; turnoff(); go(current.current + d); };
  const end = i >= LAST && !reading;
  const toggle = () => {
    if (end) { auto.current = true; lightup(0); return; }
    if (reading) { auto.current = false; turnoff(); } else { auto.current = true; lightup(); }
  };

  /* Les blocs ne se marchent pas dessus : on les descend au besoin, et c'est
     le trait qui rattrape l'écart — jamais le bloc qui ment sur son ancre. */
  /* Une slide, un bloc : celui qui vient d'entrer. Les précédents ne sont
     plus rappelés en gris (verdict d'Auteur, 2 septembre — ils encombraient
     la scène et se marchaient dessus avec le titre).
     Le panneau se lit en trois bandes : le titre en haut, le commentaire
     centré ENTRE le titre et la molette, la molette en bas. Le bloc ne se
     cale donc plus sur l'ordonnée de ce qu'il nomme — c'est le trait qui
     fait le trajet, avec son coude. Il a toujours su le faire ; le bloc,
     lui, a une place dans la page. */
  const ranks: { n: Note; y: number; anchor: Place | null }[] = [];
  if (visual && !visual.sieve) {
    const fresh = FRESH[seen];
    const views = visual.notes
      .filter((n) => fresh.includes(n.key) && fresh.indexOf(n.key) < setAll);
    const begin = (ceiling + ground) / 2 - ((views.length - 1) * 88) / 2;
    views.forEach((n, k) => {
      ranks.push({ n, y: Math.max(begin + k * 88, ceiling), anchor: places[n.key] ?? null });
    });
  }

  return (
    <div className={`mo-scena ${output ? "sort" : ""}`} ref={frame}>

      {/* ── LA MISE EN PAGE (maquette d'Auteur, 2 septembre) ──────────────
          Le jaune n'est plus le cadre de tout : c'est un PANNEAU décalé vers
          la droite. Trois choses lui débordent dessus — la fiche par la
          gauche, le compteur par le coin haut droit — et deux choses restent
          sur la page, hors du panneau : le chapô et le lecteur. Ce qui
          déborde est ce qui traverse le scénario ; ce qui est dedans est ce
          qui change de slide en slide. ── */}
      <p className="mo-chap">{s.chap}</p>

      {/* Le compteur est un INSTRUMENT : il ne quitte jamais son coin, sur
          toutes les slides. À l'ouverture il affiche « ? » — la question est
          justement là, et la réponse tombe à la slide suivante. */}
      <p className={`mo-counter ${s.tone ?? ""}`}>
        <b>
          <span className="mo-mood" key={s.mood} aria-hidden="true">{s.mood}</span>
          <i>{unknown ? "?" : score}</i>
        </b>
        <span>{s.says ?? (!unknown && score === 1 ? "décision prise" : "décisions prises")}</span>
      </p>

      <div className={`bench primary mo-frame ${blocks ? "top" : ""}`}>
        <div className="mo-header" ref={header}>
          {s.genre !== "text" && !unknown
            ? <h3 className="mo-heading">{headingOf(s, score)}</h3> : null}
        </div>

        {/* UNE seule colonne pour tout ce qui se remplace d'une slide à
            l'autre : elle sort avant que la suivante entre. Les blocs
            d'infos n'y sont pas — ils se rappellent d'une slide sur l'autre
            et ne doivent pas clignoter. */}
        <div className="mo-column">
          {question ? <h3 className="mo-question">{question}</h3> : null}

          {s.genre === "text" ? (
            <div className={`mo-slide-text ${s.tone ?? ""}`}>
              <p className="mo-sentence">{s.sentence}</p>
              {s.sub ? <p className="mo-sub">{s.sub}</p> : null}
            </div>
          ) : null}

          {sieve ? (
            <ol className="mo-list">
              {SIEVE.map((c, k) => (
                <li key={k} className={`f-${c.fam} ${k < setAll ? "on" : ""}`}>
                  <b><i className="mo-n">{c.v}</i><i className="mo-u">px</i></b>
                  <span>{c.says}</span>
                </li>
              ))}
            </ol>
          ) : null}

          {/* Ni sous-titre ni bouton de retour sur la dernière slide : le
              titre dit déjà « entre tes mains », et les quatre molettes se
              voient. Ce qu'on retire ici, c'est ce qui répétait. */}
          {demo && s.commands === "intents" ? (
            <div className="mo-commands">
              {/* La question garde le cadrage : ce ne sont pas des réglages
                  qu'on propose, ce sont des positionnements. */}
              <p className="mo-request">Quel est le positionnement de ton produit ?</p>
              <ul className="mo-intents">
                {(INTENTS as { name: string; base: number; interval: number; root: number; note: string }[])
                  .map((it) => {
                    const taken = base === it.base && interv === it.interval && root === it.root;
                    return (
                      <li key={it.name}>
                        <button type="button" className={taken ? "on" : ""}
                          onClick={() => { aThereMain(); setBase(it.base); setInterv(it.interval);
                            setRoot(it.root); setHeadings(CHARTER.intervalHeadings); }}>
                          {it.name}
                        </button>
                      </li>
                    );
                  })}
              </ul>
              <p className="mo-caption">
                {`un seul choix, et les trois nombres suivent : base ${fr(base)} · intervalle ${fr2(interv)} · racine ${fr(root)} — le quatrième, l'intervalle des titres, est le même pour tout le monde`}
              </p>
            </div>
          ) : demo ? (
            <div className="mo-commands">
              {(["base", "interval", "root", "headings"] as What[]).map((q) => (
                <Wheel key={q} {...SETTINGS[q]} />
              ))}
              <p className="mo-caption">
                {`container ${fr(foundation.pad[0])} · card ${fr(foundation.pad[1])} · row ${fr(foundation.pad[2])} — coins ${fr(foundation.r[0])} · ${fr(foundation.r[1])} · ${fr(foundation.r[2])} — titre ${fr(foundation.text.h3)} sur un corps à ${fr(foundation.text.body)}`}
              </p>
            </div>
          ) : null}
        </div>

        {/* La molette se pose EN BAS du panneau : c'est une commande, elle
            n'a rien à faire entre le titre et ce qu'il annonce, et elle
            laisse ainsi toute la hauteur aux blocs d'infos. */}
        {s.genre === "visual" && s.wheel ? (
          <div className="mo-foot" ref={foot} onPointerDown={aThereMain} onKeyDown={aThereMain}>
            <Wheel {...SETTINGS[s.wheel]}
              name={s.wheelSays ?? SETTINGS[s.wheel].name} />
          </div>
        ) : null}
      </div>

      {/* ── LA FICHE ────────────────────────────────────────────────────
          Montée UNE fois pour tout le scénario, et jamais remontée : elle
          traverse les slides sans être reconstruite, et c'est ce qui permet
          de la voir évoluer au lieu de la voir réapparaître. Elle est posée
          par-dessus le panneau et déborde à sa gauche : rien de ce qu'on
          écrit à côté ne peut plus la déplacer. ── */}
      <div className="mo-scene" ref={scene}>
        <div className="mo-door">
          {/* Les arcs des coins ne sont plus MESURÉS sur la fiche : ils sont
              dessinés par les coins eux-mêmes, à partir du même jeton. Une
              cote mesurée décroche dès qu'on tourne la molette ; une cote
              dérivée ne le peut pas. Et elle porte son calcul, pas un
              nombre nu (verdict d'Auteur : « soit une formule, soit rien »). */}
          {/* Quand la fiche porte des valeurs écrites à la main (la slide
              « avant », le crible, les versions), c'est une rupture déclarée :
              elle le dit sur elle-même, et le banc la lit comme telle. */}
          <div className={`mo-record ${s.genre === "visual" && s.corners ? "corners" : ""}`}
            ref={record}
            data-intent={!demo && s.level === undefined ? "statement" : undefined}
            style={{
              ...tokens,
              ...(s.genre === "visual" && s.corners ? {
                "--corner-1": `"${fr(foundation.r[0])} px"`,
                "--corner-2": `"÷ 2 = ${fr(foundation.r[1])}"`,
                "--corner-3": `"÷ 2 = ${fr(foundation.r[2])}"`,
              } : {}),
            } as CSSProperties}>
            <SliceFili see={false} menu={false} />

            {/* Une pastille dans le coin de la démo, une par version : elle
                dit laquelle on regarde, elle ne se pilote pas. Le défilé
                raconte tout seul (verdict d'Auteur, 2 septembre — les
                onglets faisaient une commande là où il fallait une
                étiquette). */}
            {s.versions ? (
              <span className="mo-version" key={s.versions[ver].name}>
                {s.versions[ver].name}
              </span>
            ) : null}
            {sieve ? (
              <span className="mo-sieve" aria-hidden="true">
                {SIEVE.slice(0, setAll).map((c, k) => tags[k] ? (
                  <i key={k} className={`f-${c.fam}`}
                    style={{ left: `${tags[k]!.x}px`, top: `${tags[k]!.y}px` }}>{c.v}<em>px</em></i>
                ) : null)}
              </span>
            ) : null}
          </div>
        </div>

        {!sieve && !demo && !question ? (
          <>
            <svg className="mo-strokes" aria-hidden="true">
              {ranks.map(({ n, y, anchor }) => anchor ? (
                <g key={n.key} className={`mo-stroke ${n.tone ?? ""}`}>
                  <polyline points={`${anchor.x},${anchor.y} ${elbow},${anchor.y} ${elbow},${y} ${elbow + 20},${y}`} />
                  <circle cx={anchor.x} cy={anchor.y} r="3" />
                </g>
              ) : null)}
            </svg>
            <div className="mo-notes" style={{ left: `${elbow + 20}px` }}>
              {ranks.map(({ n, y }) => (
                <article key={n.key} className={`mo-note ${n.tone ?? ""}`} style={{ top: `${y}px` }}>
                  <b>{n.heading}</b><span>{n.says}</span>
                </article>
              ))}
            </div>
          </>
        ) : null}
      </div>

      <div className="mo-player">
        <button type="button" className="mo-circle" onClick={() => moves(-1)}
          disabled={i === 0} aria-label="Slide précédente">←</button>
        <button type="button" className={`mo-circle mo-readout ${reading ? "in-progress" : ""} ${end ? "end" : ""}`}
          onClick={toggle}
          aria-label={end ? "Rejouer le scénario" : reading ? "Mettre en pause" : "Lancer la lecture"}>
          <svg viewBox="0 0 24 24" aria-hidden="true" className="ic ic-play"><path d="M8.2 5.4v13.2L19.4 12z" /></svg>
          <svg viewBox="0 0 24 24" aria-hidden="true" className="ic ic-pause"><path d="M7 5h3.4v14H7zM13.6 5H17v14h-3.6z" /></svg>
          <svg viewBox="0 0 24 24" aria-hidden="true" className="ic ic-re"><path d="M12 5V2L7 6l5 4V7c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6H4c0 4.4 3.6 8 8 8s8-3.6 8-8-3.6-8-8-8z" /></svg>
        </button>
        <button type="button" className="mo-circle" onClick={() => moves(1)}
          disabled={i === LAST} aria-label="Slide suivante">→</button>
        <span className="mo-cnt mono">{i + 1} / {SLIDES.length}</span>
        <span className="mo-time" aria-hidden="true">
          <i style={{ transform: `scaleX(${reading ? advance : 0})` }} />
        </span>
      </div>
    </div>
  );
}
