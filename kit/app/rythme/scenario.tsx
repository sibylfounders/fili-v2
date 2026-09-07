"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState,
  type CSSProperties, type ReactNode } from "react";
import { TrancheFili } from "./vue";
import { chaine, CHARTE, BORNES, INTENTIONS } from "../../derivation.mjs";

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

const GROUPES: string[][] = [
  ["--pad-1-block", "--pad-1-inline"],
  ["--pad-2-block", "--pad-2-inline", "--pad-3-block", "--pad-3-inline"],
  ["--gap-1-block", "--gap-1-inline", "--gap-2-block", "--gap-2-inline",
   "--gap-3-block", "--gap-3-inline", "--gap-4-block", "--gap-4-inline"],
  ["--r-1", "--r-2", "--r-3"],
];
function masque(niveau: number): Record<string, string> {
  const v: Record<string, string> = {};
  GROUPES.forEach((g, k) => { if (niveau <= k) g.forEach((j) => { v[j] = "0px"; }); });
  if (niveau <= 4) v["--font-size-body"] = "var(--font-size-small)";
  return v;
}
const NU = masque(0);

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
type Coin = "centre" | "gauche" | "droite" | "haut" | "bas" | "hg" | "hd" | "bg" | "bd";
/* Quatre familles, quatre couleurs — et ce ne sont pas des couleurs
   inventées : les marges en rouge et les écarts en vert, c'est la
   convention des inspecteurs verrouillée le 24 août. Les coins et les
   tailles prennent les deux familles sémantiques qui restent. */
type Fam = "marge" | "espace" | "coin" | "taille";
const CRIBLE: { v: string; dit: string; fam: Fam; sel: string; idx?: number; ou: Coin }[] = [
  /* L'ordre suit la fiche, du haut vers le bas — donc les familles s'y
     mêlent, et c'est voulu (verdict d'Auteur) : personne ne prend ses
     décisions rangées par catégorie. La couleur seule les regroupe. */
  { v: "24", dit: "la marge du container", fam: "marge", sel: ".ry-marge1 .haut", ou: "centre" },
  { v: "14", dit: "le coin du container", fam: "coin", sel: ".tranche", ou: "hg" },
  { v: "20", dit: "la marge de la card", fam: "marge", sel: ".tr-carte-corps > .espace.pad", ou: "centre" },
  { v: "10", dit: "le coin de la card", fam: "coin", sel: ".tr-carte", ou: "hd" },
  { v: "40", dit: "la pastille de l'avatar", fam: "taille", sel: ".tr-avatar", ou: "gauche" },
  { v: "20", dit: "le nom", fam: "taille", sel: ".tr-nom", ou: "droite" },
  { v: "17", dit: "le corps du texte", fam: "taille", sel: ".tr-role", ou: "droite" },
  { v: "44", dit: "la hauteur d'un bouton", fam: "taille", sel: ".tr-btn.premier", ou: "gauche" },
  { v: "16", dit: "le retrait d'un bouton", fam: "marge", sel: ".tr-btn.premier", ou: "bas" },
  { v: "8", dit: "entre deux boutons", fam: "espace", sel: '.espace.h.gap[data-cran="4"]', idx: 0, ou: "haut" },
  { v: "6", dit: "le coin d'un bouton", fam: "coin", sel: ".ry-flex .tr-btn:last-child", ou: "hd" },
  { v: "12", dit: "entre deux rows", fam: "espace", sel: '.tr-carte-corps > .espace.gap[data-cran="3"]', idx: 1, ou: "centre" },
  { v: "10", dit: "la marge d'un bloc", fam: "marge", sel: ".tr-sub", idx: 0, ou: "gauche" },
  { v: "6", dit: "sous un chiffre", fam: "espace", sel: ".tr-sub b", idx: 0, ou: "bas" },
  { v: "13", dit: "la légende", fam: "taille", sel: ".tr-sub span", idx: 0, ou: "bas" },
  { v: "6", dit: "entre deux blocs", fam: "espace", sel: '.espace.h.gap[data-cran="4"]', idx: 1, ou: "bas" },
  { v: "12", dit: "avant les boutons", fam: "espace", sel: '.tr-carte-corps > .espace.gap[data-cran="3"]', idx: 0, ou: "centre" },
];

/* Le point d'accroche : un bord de l'élément, jamais son milieu quand
   l'élément porte du texte. */
function accroche(r: DOMRect, base: DOMRect, ou: Coin): { x: number; y: number } {
  const L = r.left - base.left, R = r.right - base.left;
  const T = r.top - base.top, B = r.bottom - base.top;
  const cx = (L + R) / 2, cy = (T + B) / 2;
  switch (ou) {
    case "gauche": return { x: L, y: cy };
    case "droite": return { x: R, y: cy };
    case "haut": return { x: cx, y: T };
    case "bas": return { x: cx, y: B };
    case "hg": return { x: L, y: T };
    case "hd": return { x: R, y: T };
    case "bg": return { x: L, y: B };
    case "bd": return { x: R, y: B };
    default: return { x: cx, y: cy };
  }
}
/* Deux étiquettes qui se recouvrent ne se lisent plus ni l'une ni l'autre :
   la seconde descend, elle ne change pas de camp. */
function ecarter(pts: ({ x: number; y: number } | null)[]): ({ x: number; y: number } | null)[] {
  const faits: { x: number; y: number }[] = [];
  return pts.map((p) => {
    if (!p) return null;
    const q = { ...p };
    for (let tour = 0; tour < 8; tour++) {
      const heurt = faits.some((f) => Math.abs(f.y - q.y) < 19 && Math.abs(f.x - q.x) < 72);
      if (!heurt) break;
      q.y += 21;
    }
    faits.push(q);
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
type Socle = ReturnType<typeof chaine>;
function jetonsMoteur(niveau: number, s: Socle): Record<string, string> {
  const px = (v: number) => `${Math.round(v * 100) / 100}px`;
  const o: Record<string, string> = {};
  const z = (encore: boolean, v: number) => (encore ? "0px" : px(v));
  o["--pad-1-block"] = o["--pad-1-inline"] = z(niveau <= 0, s.pad[0]);
  o["--pad-2-block"] = o["--pad-2-inline"] = z(niveau <= 1, s.pad[1]);
  o["--pad-3-block"] = o["--pad-3-inline"] = z(niveau <= 1, s.pad[2]);
  [0, 1, 2, 3].forEach((k) => {
    o[`--gap-${k + 1}-block`] = o[`--gap-${k + 1}-inline`] = z(niveau <= 2, s.gap[k]);
  });
  [0, 1, 2].forEach((k) => { o[`--r-${k + 1}`] = z(niveau <= 3, s.r[k]); });
  o["--r-ctl"] = z(niveau <= 3, s.rCtl);
  /* Le nom de la fiche joue le rôle du titre ; le texte autour joue le rôle
     du corps et garde son plancher. Tant que l'intervalle des titres n'est
     pas entré, les deux sont à plat — c'est ce que le quatrième nombre
     vient corriger, et rien d'autre ne bouge. */
  o["--font-size-body"] = niveau <= 4
    ? "var(--font-size-small)"
    : `calc(var(--font-size-small) * ${s.entrees.intervalleTitres})`;
  o["--control-height"] = px(s.control);
  o["--control-height-compact"] = px(s.controlCompact);
  return o;
}
const fr = (v: number) => String(Math.round(v * 10) / 10).replace(".", ",");
const fr2 = (v: number) => String(Math.round(v * 100) / 100).replace(".", ",");

function Molette({ id, nom, min, max, pas, valeur, surValeur, dit }: {
  id: string; nom: string; min: number; max: number; pas: number;
  valeur: number; surValeur: (v: number) => void; dit: string;
}) {
  return (
    <span className="mo-molette">
      <label htmlFor={id}>{nom}</label>
      <input type="range" id={id} min={min} max={max} step={pas} value={valeur}
        onChange={(e) => surValeur(+e.target.value)} />
      <output htmlFor={id} className="mono">{dit}</output>
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
type Version = { nom: string; vars: Record<string, string> };
const VERSIONS: Version[] = [
  { nom: "v1", vars: MAIN },
  { nom: "v1.1", vars: { ...MAIN,
    "--gap-2-block": "16px", "--gap-2-inline": "16px",
    "--r-1": "12px", "--r-2": "8px", "--r-3": "4px", "--font-size-body": "16px" } },
  { nom: "v2", vars: { ...MAIN,
    "--pad-1-block": "32px", "--pad-1-inline": "32px",
    "--pad-2-block": "16px", "--pad-2-inline": "16px",
    "--pad-3-block": "10px", "--pad-3-inline": "10px",
    "--gap-3-block": "6px", "--gap-3-inline": "12px",
    "--r-1": "8px", "--r-2": "16px", "--r-3": "2px", "--font-size-body": "15px" } },
  { nom: "v2-final", vars: { ...MAIN,
    "--pad-1-block": "20px", "--pad-1-inline": "20px",
    "--pad-2-block": "24px", "--pad-2-inline": "24px",
    "--gap-2-block": "10px", "--gap-2-inline": "10px",
    "--r-1": "16px", "--r-2": "12px", "--r-3": "8px", "--font-size-body": "18px" } },
  { nom: "v2-final-2", vars: { ...MAIN,
    "--pad-1-block": "28px", "--pad-1-inline": "28px",
    "--pad-2-block": "18px", "--pad-2-inline": "18px",
    "--gap-2-block": "8px", "--gap-2-inline": "8px",
    "--r-1": "10px", "--r-2": "10px", "--r-3": "10px", "--font-size-body": "16px" } },
];


/* Les ancres : de vrais éléments de la fiche, jamais des coordonnées. Le
   bloc va chercher l'endroit qu'il nomme et le suit quand ça bouge. */
const A_MARGE = ".ry-marge1 .haut";
const A_CARD = ".tr-carte-corps > .espace.pad";
const A_ECART = '.tr-carte-corps > .espace.gap[data-cran="3"]';
const A_COIN = ".tr-carte";
const A_NOM = ".tr-nom";

type Quoi = "base" | "intervalle" | "racine" | "titres";
type Note = { cle: string; ancre: string; titre: string; dit: string; ton?: "faute" | "deduit" };
const M_BASE: Note = { cle: "b", ancre: A_MARGE, titre: "la base · 24 px",
  dit: "La marge la plus extérieure, et la seule qui n'est déduite de rien. On commence par elle parce que tout le reste en descend." };
const M_INT: Note = { cle: "i", ancre: A_CARD, titre: "l'intervalle · ÷ 1,41",
  dit: "La card reçoit 17, la row 12. Personne ne les a écrits." };
const M_ECA: Note = { cle: "d", ancre: A_ECART, titre: "les écarts · déduits", ton: "deduit",
  dit: "L'espace entre deux voisins vaut leur marge : 12. Zéro décision." };
const M_RAC: Note = { cle: "r", ancre: A_COIN, titre: "la racine · 16 px",
  dit: "Le coin se divise par deux : 16, 8, 4. Un enfant n'est jamais plus rond que son parent." };
const M_TIT: Note = { cle: "s", ancre: A_NOM, titre: "l'intervalle des titres · × 1,25",
  dit: "Le nom monte d'un cran. Le texte reste à son plancher." };

/* Le compteur porte une HUMEUR en plus de sa couleur : une carte
   émotionnelle de designer. Le chiffre dit combien, la couleur dit si ça
   tient, l'humeur dit ce que ça fait de le vivre (idée d'Auteur,
   2 septembre). */
/* Un titre peut être une phrase, ou une phrase QUI COMPTE : la slide des
   dix-sept fait défiler son chiffre comme le compteur, et les deux montent
   ensemble (verdict d'Auteur, 2 septembre). */
type Titre = ReactNode | ((n: number) => ReactNode);
type Commun = { chap: string; compte: number; humeur: string; dit?: string;
  ton?: "faute" | "juste"; niveau?: number; vars?: Record<string, string>;
  /* Une slide peut faire défiler les VERSIONS de la fiche : les onglets
     tournent, et à chaque fois la card se recompose. */
  versions?: Version[] };
type Slide =
  | (Commun & { genre: "texte"; phrase: ReactNode; sous?: ReactNode })
  | (Commun & { genre: "visuel"; monte?: boolean; notes: Note[]; crible?: boolean;
      molette?: Quoi; moletteDit?: string; inconnu?: boolean; coins?: boolean; titre: Titre })
  | (Commun & { genre: "demo"; titre: Titre;
      commandes: "molettes" | "intentions"; arret?: boolean });

const SLIDES: Slide[] = [
  /* La question s'ouvre SUR l'exemple, pas à côté (verdict d'Auteur,
     2 septembre). Le compteur reste caché : c'est lui, la réponse, et elle
     tombe à la slide suivante — dans le vide à droite de la fiche, qui est
     exactement là où la liste va s'écrire. */
  { genre: "visuel", chap: "L'histoire", compte: 0, inconnu: true, humeur: "🤔", notes: [], vars: MAIN,
    titre: <>Vous savez <em>combien de décisions</em> il a fallu prendre pour rendre cette card agréable visuellement ?</> },

  { genre: "visuel", chap: "sans compter les allers-retours", compte: 17, monte: true, ton: "faute", humeur: "😅",
    notes: [], crible: true, vars: { ...NU, ...MAIN },
    titre: (n: number) => <><em>{n} décisions</em> prises minutieusement</> },

  /* La fiche ne quitte jamais la scène : chaque slide de texte dit dans
     quel état elle la montre. Ici, encore composée à la main — les
     étiquettes sont tombées, la card est belle, et c'est le sujet. */
  { genre: "texte", chap: "Le problème", compte: 425, ton: "faute", humeur: "😱",
    dit: "décisions sur 25 itérations", versions: VERSIONS,
    phrase: <>25 itérations plus tard, <em>plus personne ne sait quelle est la bonne
      version</em>.</>,
    sous: <>Le design system donne les valeurs. Il ne dit pas <b>laquelle va où</b> — alors à
      chaque version, quelqu&apos;un a choisi. Le suivant choisira autrement, <b>sans se tromper
      non plus</b>.</> },

  /* On n'annonce pas le chiffre ici (verdict d'Auteur, 2 septembre) : le
     compteur est là pour ça, et il retombe à zéro sous nos yeux pendant que
     la fiche se dénude. Dire « quatre » d'avance, c'est raconter la fin. */
  { genre: "texte", chap: "La bascule", compte: 0, humeur: "🧹", niveau: 0,
    phrase: <>On met ça à plat, <em>et on repart de zéro</em>.</>,
    sous: <>Cette fois on décide <b>avant</b> de dessiner — et on continue de compter.</> },

  { genre: "visuel", chap: "Le moteur · 1", compte: 1, humeur: "🙂", notes: [M_BASE], niveau: 1, molette: "base",
    titre: <>D&apos;abord, <em>la marge du container</em></> },

  { genre: "visuel", chap: "Le moteur · 2", compte: 2, humeur: "🙂", notes: [M_BASE, M_INT], niveau: 2, molette: "intervalle",
    titre: <>Puis elle <em>se divise à chaque étage</em></> },

  { genre: "visuel", chap: "Le moteur · les écarts", compte: 2, humeur: "😌", notes: [M_BASE, M_INT, M_ECA], niveau: 3, molette: "intervalle",
    /* Deux slides de suite tournent le même nombre — mais elles n'en
       montrent pas la même chose. Ici on ne règle pas la descente : on
       vérifie que les écarts la suivent sans qu'on les touche. L'étiquette
       le dit, sinon c'est deux fois le même curseur (verdict d'Auteur). */
    moletteDit: "tourne : les écarts suivent tout seuls",
    titre: <>Alors les écarts <em>se déduisent tout seuls</em></> },

  { genre: "visuel", chap: "Le moteur · 3", compte: 3, humeur: "🙂", notes: [M_BASE, M_INT, M_ECA, M_RAC], niveau: 4, molette: "racine", coins: true,
    titre: <>Ensuite, les coins <em>se divisent par deux</em></> },

  { genre: "visuel", chap: "Le moteur · 4", compte: 4, ton: "juste", humeur: "😃",
    notes: [M_BASE, M_INT, M_ECA, M_RAC, M_TIT], niveau: 5, molette: "titres",
    titre: <>Enfin, <em>le titre monte</em> et le texte reste</> },

  { genre: "texte", chap: "Le verdict", compte: 4, ton: "juste", humeur: "😎",
    dit: "décisions, pour les 25 pages", niveau: 5,
    phrase: <>425 décisions d&apos;un côté. <em>4 de l&apos;autre.</em></>,
    sous: <>Et ce 4 ne bougera pas : quatre pour vingt-cinq pages, quatre pour mille. Chaque
      distance sait d&apos;où elle vient — <b>on peut la retrouver, l&apos;expliquer, la changer
      partout d&apos;un coup</b>.</> },

  { genre: "demo", chap: "À toi", compte: 4, ton: "juste", humeur: "🎛️",
    commandes: "molettes",
    titre: <>Les quatre nombres, <em>entre tes mains</em></> },

  /* La dernière marche (idée d'Auteur, 2 septembre) : le moteur du kit
     range déjà des INTENTIONS — des jeux de nombres qui vont ensemble et
     qui ont un nom de métier. En choisir une, c'est prendre une seule
     décision et recevoir les quatre. Honnêteté de la slide : une intention
     porte trois nombres, le quatrième — l'intervalle des titres — est le
     même pour tout le monde, et c'est dit. */
  { genre: "demo", chap: "Bonus", compte: 1, ton: "juste", humeur: "🎁",
    dit: "décision prise", commandes: "intentions", arret: true,
    titre: <>Et même en <em>1 seule décision</em> !</> },
];
const DERNIER = SLIDES.length - 1;

/* Ce qui est NEUF sur chaque slide. Les blocs déjà posés ne se rejouent
   pas : ils restent où ils sont, réduits à leur ligne en gras et estompés.
   Seul le nouveau arrive, en entier (verdict d'Auteur, 2 septembre — tout
   effacer pour tout réafficher une par une donne le tournis et efface
   justement ce qu'on vient de comprendre). */
const NEUVES: string[][] = SLIDES.map((sl, k) => {
  if (sl.genre !== "visuel" || sl.crible) return [];
  let j = k - 1;
  while (j >= 0) {
    const p = SLIDES[j];
    if (p.genre === "visuel" && !p.crible) break;
    j -= 1;
  }
  const avant = new Set<string>();
  if (j >= 0) { const p = SLIDES[j]; if (p.genre === "visuel") p.notes.forEach((n) => avant.add(n.cle)); }
  return sl.notes.filter((n) => !avant.has(n.cle)).map((n) => n.cle);
});

/* Durée d'une slide : le temps de la lire (≈ 190 mots/minute), jamais moins
   de cinq secondes, et jamais moins que le temps qu'il faut à ses blocs
   pour se poser. */
function compter(n: ReactNode): number {
  if (n === null || n === undefined || typeof n === "boolean") return 0;
  if (typeof n === "string" || typeof n === "number") return String(n).trim().split(/\s+/).filter(Boolean).length;
  if (Array.isArray(n)) return n.reduce((s: number, x) => s + compter(x), 0);
  const e = n as { props?: { children?: ReactNode } };
  return e.props ? compter(e.props.children) : 0;
}
const titreDe = (sl: Slide, n: number): ReactNode =>
  sl.genre === "texte" ? null : (typeof sl.titre === "function" ? sl.titre(n) : sl.titre);

const DUREES = SLIDES.map((s) => {
  /* On ne quitte jamais la slide où la lecture s'arrête ; celle des quatre
     molettes, elle, laisse le temps d'y toucher puis passe la main. */
  if (s.genre === "demo") return s.arret ? 1e9 : 14000;
  if (s.genre === "texte") return Math.max(5200, (compter(s.phrase) + compter(s.sous)) * 340 + 1600);
  const blocs = s.crible ? 2300 : 1000 + Math.max(1, NEUVES[SLIDES.indexOf(s)].length) * 950;
  return Math.max(5200, 1000 + blocs + compter(titreDe(s, s.compte)) * 320 + 1600);
});

type Place = { y: number; x: number };

export default function Scenario() {
  const [i, setI] = useState(0);
  /* La slide COURANTE (i) et la slide AFFICHÉE (vu) sont deux choses : entre
     les deux, le temps de faire sortir l'ancienne avant de faire entrer la
     nouvelle. Sans ce délai, tout disparaissait d'un coup et réapparaissait —
     « cassant », dit le verdict d'Auteur du 2 septembre. La fiche, elle, ne
     participe pas au fondu : c'est le point fixe. */
  const [vu, setVu] = useState(0);
  const [sortie, setSortie] = useState(false);
  const vuRef = useRef(0);
  const [lecture, setLecture] = useState(false);
  const [avance, setAvance] = useState(0);
  const [poses, setPoses] = useState(0);
  const [ver, setVer] = useState(0);
  const roue = useRef(0);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const [places, setPlaces] = useState<Record<string, Place>>({});
  const [tags, setTags] = useState<({ x: number; y: number } | null)[]>([]);
  const [coude, setCoude] = useState(0);
  const [plafond, setPlafond] = useState(0);
  const [sol, setSol] = useState(0);

  const cadre = useRef<HTMLDivElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const fiche = useRef<HTMLDivElement>(null);
  const entete = useRef<HTMLDivElement>(null);
  const pied = useRef<HTMLDivElement>(null);
  const auto = useRef(true);
  const boucle = useRef(0);
  const debut = useRef(0);
  const courant = useRef(0);
  const chronos = useRef<number[]>([]);

  /* Les quatre molettes de la dernière slide. Elles ne repeignent que leur
     scène : aucune valeur ne descend sur le document. */
  const [base, setBase] = useState<number>(CHARTE.base);
  const [interv, setInterv] = useState<number>(CHARTE.intervalle);
  const [racine, setRacine] = useState<number>(CHARTE.racine);
  const [titres, setTitres] = useState<number>(CHARTE.intervalleTitres);
  const socle = chaine({ base, intervalle: interv, racine, intervalleTitres: titres }) as Socle;

  useEffect(() => {
    if (i === vuRef.current) return;
    setSortie(true);
    const t = window.setTimeout(() => {
      vuRef.current = i; setVu(i); setSortie(false);
    }, 200);
    return () => clearTimeout(t);
  }, [i]);

  const s = SLIDES[vu];
  const visuel = s.genre === "visuel" ? s : null;

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
  const REGLAGES: Record<Quoi, { id: string; nom: string; min: number; max: number; pas: number;
    valeur: number; surValeur: (v: number) => void; dit: string }> = {
    base: { id: "mo-base", nom: "plus ou moins d'air", min: BORNES.base[0], max: BORNES.base[1], pas: 1,
      valeur: base, surValeur: setBase, dit: `${fr(base)} px` },
    intervalle: { id: "mo-int", nom: "des étages plus ou moins serrés", min: BORNES.intervalle[0], max: BORNES.intervalle[1], pas: 0.01,
      valeur: interv, surValeur: setInterv, dit: fr2(interv) },
    racine: { id: "mo-rac", nom: "des coins plus ou moins ronds", min: BORNES.racine[0], max: BORNES.racine[1], pas: 1,
      valeur: racine, surValeur: setRacine, dit: `${fr(racine)} px` },
    titres: { id: "mo-tit", nom: "le titre plus ou moins haut", min: BORNES.intervalleTitres[0], max: BORNES.intervalleTitres[1], pas: 0.01,
      valeur: titres, surValeur: setTitres, dit: fr2(titres) },
  };
  const aLaMain = () => { auto.current = false; eteindre(); };

  const demo = s.genre === "demo";
  const crible = s.genre === "visuel" && !!s.crible;
  const question = s.genre === "visuel" && s.inconnu ? titreDe(s, score) : null;
  const inconnu = s.genre === "visuel" && !!s.inconnu;
  /* Une slide à blocs d'infos : le panneau n'y porte qu'un titre et une
     molette, ils se rangent en haut et laissent la place aux blocs. */
  const blocs = s.genre === "visuel" && !s.crible && !s.inconnu;

  /* Les jetons de la scène. Le crible pose ses valeurs écrites à la main,
     tout le reste vient du moteur — et CHAQUE slide, texte comprise, dit
     dans quel état elle montre la fiche. C'est ce qui permet de la garder à
     l'écran d'un bout à l'autre : « on efface tout » se voit, il ne se
     raconte pas. */
  const jetons: Record<string, string> = demo
    ? jetonsMoteur(5, socle)
    : s.versions ? s.versions[Math.min(ver, s.versions.length - 1)].vars
    : s.niveau !== undefined ? jetonsMoteur(s.niveau, socle) : (s.vars ?? {});

  /* ── Les blocs (ou les confettis) se posent un par un ── */
  useEffect(() => {
    chronos.current.forEach(clearTimeout); chronos.current = [];
    setPoses(0);
    const v = SLIDES[vu];
    if (v.genre !== "visuel") return;
    const n = v.crible ? CRIBLE.length : NEUVES[vu].length;
    const pas = v.crible ? 95 : 950;
    const depart = v.crible ? 320 : 620;
    for (let k = 0; k < n; k++) {
      chronos.current.push(window.setTimeout(() => setPoses(k + 1), depart + k * pas));
    }
    return () => { chronos.current.forEach(clearTimeout); chronos.current = []; };
  }, [vu]);

  /* Les onglets tournent tout seuls : c'est le défilé des versions qui
     raconte, pas un onglet posé. Un clic reprend la main et arrête le
     manège — et la lecture avec lui. */
  useEffect(() => {
    window.clearInterval(roue.current);
    setVer(0);
    const v = SLIDES[vu];
    if (!("versions" in v) || !v.versions) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const n = v.versions.length;
    roue.current = window.setInterval(() => setVer((k) => (k + 1) % n), 1250);
    return () => window.clearInterval(roue.current);
  }, [vu]);

  /* ── Le compteur : il monte quand la slide le demande, sinon il se pose ── */
  /* Le compteur ne se pose jamais : il part de là où il en est et rejoint
     la nouvelle valeur. C'est ce qui fait voir la montée (dix-sept par page,
     vingt-cinq pages) et surtout la chute — sans elle, 425 et 4 ne seraient
     que deux nombres écrits l'un après l'autre. */
  useEffect(() => {
    const v = SLIDES[vu];
    const depart = scoreRef.current, cible = v.compte;
    if (depart === cible) return;
    const D = v.genre === "visuel" && v.monte
      ? 1900   /* il monte au rythme des étiquettes qui tombent : ensemble, ils finissent ensemble */
      : Math.min(2200, 420 + Math.abs(cible - depart) * 4);
    let id = 0;
    const t0 = performance.now();
    const pas = (t: number) => {
      const q = Math.min(1, (t - t0) / D);
      const n = Math.round(depart + (cible - depart) * (1 - Math.pow(1 - q, 3)));
      scoreRef.current = n; setScore(n);
      if (q < 1) id = requestAnimationFrame(pas);
    };
    id = requestAnimationFrame(pas);
    return () => cancelAnimationFrame(id);
  }, [vu]);

  /* ── Chaque bloc va chercher l'endroit qu'il nomme. On mesure après la
       transition de géométrie, sinon on lirait la position d'avant. ── */
  const mesurer = useCallback(() => {
    const sc = scene.current, fi = fiche.current;
    if (!sc || !fi) return;
    const base = sc.getBoundingClientRect();
    setCoude(fi.getBoundingClientRect().right - base.left + 28);
    /* Le plafond : les blocs d'infos ne montent jamais au-dessus de
       l'en-tête du panneau. Sans lui, un bloc ancré haut sur la fiche
       venait s'écrire par-dessus le titre et la molette (verdict d'Auteur,
       2 septembre). C'est le bloc qui cède, pas le titre. */
    const en = entete.current, pi = pied.current;
    setPlafond(en ? en.getBoundingClientRect().bottom - base.top + 20 : 0);
    /* Le sol : le haut de la molette. Le commentaire se centre ENTRE les
       deux — pas au milieu du panneau, qui ne veut rien dire quand le titre
       et la commande n'ont pas la même hauteur (verdict d'Auteur). */
    setSol(pi ? pi.getBoundingClientRect().top - base.top - 20 : base.height);
    const v = SLIDES[vuRef.current];

    if (v.genre !== "visuel") return;
    if (v.crible) {
      const bf = fi.getBoundingClientRect();
      setTags(ecarter(CRIBLE.map((c) => {
        const els = fi.querySelectorAll(c.sel);
        const el = els[c.idx ?? 0] as HTMLElement | undefined;
        if (!el) return null;
        return accroche(el.getBoundingClientRect(), bf, c.ou);
      })));
      return;
    }
    const trouve: Record<string, Place> = {};
    v.notes.forEach((n) => {
      const el = sc.querySelector(n.ancre) as HTMLElement | null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      trouve[n.cle] = { y: r.top + r.height / 2 - base.top, x: r.right - base.left };
    });
    setPlaces(trouve);
  }, []);

  useLayoutEffect(() => {
    mesurer();
    const t1 = window.setTimeout(mesurer, 340);
    const t2 = window.setTimeout(mesurer, 780);
    window.addEventListener("resize", mesurer);
    return () => { clearTimeout(t1); clearTimeout(t2); window.removeEventListener("resize", mesurer); };
  }, [vu, poses, mesurer]);

  /* ── Le lecteur ── */
  const eteindre = useCallback(() => {
    cancelAnimationFrame(boucle.current); setLecture(false); setAvance(0);
  }, []);
  const allumer = useCallback((depuis?: number) => {
    cancelAnimationFrame(boucle.current);
    if (depuis !== undefined) { setI(depuis); courant.current = depuis; }
    debut.current = performance.now();
    setLecture(true);
    const pas = (t: number) => {
      const q = Math.min(1, (t - debut.current) / DUREES[courant.current]);
      setAvance(q);
      if (q >= 1) {
        if (courant.current >= DERNIER) { auto.current = false; eteindre(); return; }
        courant.current += 1; setI(courant.current); debut.current = t; setAvance(0);
        /* on ne joue pas par-dessus la main de l'utilisateur */
        const suite = SLIDES[courant.current];
        if (suite.genre === "demo" && suite.arret) { auto.current = false; eteindre(); return; }
      }
      boucle.current = requestAnimationFrame(pas);
    };
    boucle.current = requestAnimationFrame(pas);
  }, [eteindre]);
  const aller = useCallback((k: number) => {
    const n = Math.max(0, Math.min(DERNIER, k));
    courant.current = n; setI(n); debut.current = performance.now(); setAvance(0);
  }, []);

  /* Le scénario démarre quand il entre dans le champ et se met en pause
     quand on le quitte. Arrêté à la main, il ne redémarre plus seul. */
  useEffect(() => {
    const el = cadre.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { auto.current = false; return; }
    const oeil = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { if (auto.current) allumer(); } else eteindre(); });
    }, { threshold: 0.2 });
    oeil.observe(el);
    return () => { oeil.disconnect(); cancelAnimationFrame(boucle.current); };
  }, [allumer, eteindre]);

  useEffect(() => {
    const touche = (e: KeyboardEvent) => {
      const c = cadre.current; if (!c) return;
      const r = c.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key === "ArrowRight") { e.preventDefault(); auto.current = false; eteindre(); aller(courant.current + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); auto.current = false; eteindre(); aller(courant.current - 1); }
    };
    window.addEventListener("keydown", touche);
    return () => window.removeEventListener("keydown", touche);
  }, [aller, eteindre]);

  const bouge = (d: number) => { auto.current = false; eteindre(); aller(courant.current + d); };
  const fin = i >= DERNIER && !lecture;
  const bascule = () => {
    if (fin) { auto.current = true; allumer(0); return; }
    if (lecture) { auto.current = false; eteindre(); } else { auto.current = true; allumer(); }
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
  const rangs: { n: Note; y: number; ancre: Place | null }[] = [];
  if (visuel && !visuel.crible) {
    const neuves = NEUVES[vu];
    const vues = visuel.notes
      .filter((n) => neuves.includes(n.cle) && neuves.indexOf(n.cle) < poses);
    const depart = (plafond + sol) / 2 - ((vues.length - 1) * 88) / 2;
    vues.forEach((n, k) => {
      rangs.push({ n, y: Math.max(depart + k * 88, plafond), ancre: places[n.cle] ?? null });
    });
  }

  return (
    <div className={`mo-scena ${sortie ? "sort" : ""}`} ref={cadre}>

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
      <p className={`mo-compteur ${s.ton ?? ""}`}>
        <b>
          <span className="mo-humeur" key={s.humeur} aria-hidden="true">{s.humeur}</span>
          <i>{inconnu ? "?" : score}</i>
        </b>
        <span>{s.dit ?? (!inconnu && score === 1 ? "décision prise" : "décisions prises")}</span>
      </p>

      <div className={`banc primaire mo-cadre ${blocs ? "haut" : ""}`}>
        <div className="mo-entete" ref={entete}>
          {s.genre !== "texte" && !inconnu
            ? <h3 className="mo-titre">{titreDe(s, score)}</h3> : null}
        </div>

        {/* UNE seule colonne pour tout ce qui se remplace d'une slide à
            l'autre : elle sort avant que la suivante entre. Les blocs
            d'infos n'y sont pas — ils se rappellent d'une slide sur l'autre
            et ne doivent pas clignoter. */}
        <div className="mo-colonne">
          {question ? <h3 className="mo-question">{question}</h3> : null}

          {s.genre === "texte" ? (
            <div className={`mo-slide-texte ${s.ton ?? ""}`}>
              <p className="mo-phrase">{s.phrase}</p>
              {s.sous ? <p className="mo-sous">{s.sous}</p> : null}
            </div>
          ) : null}

          {crible ? (
            <ol className="mo-liste">
              {CRIBLE.map((c, k) => (
                <li key={k} className={`f-${c.fam} ${k < poses ? "on" : ""}`}>
                  <b><i className="mo-n">{c.v}</i><i className="mo-u">px</i></b>
                  <span>{c.dit}</span>
                </li>
              ))}
            </ol>
          ) : null}

          {/* Ni sous-titre ni bouton de retour sur la dernière slide : le
              titre dit déjà « entre tes mains », et les quatre molettes se
              voient. Ce qu'on retire ici, c'est ce qui répétait. */}
          {demo && s.commandes === "intentions" ? (
            <div className="mo-commandes">
              {/* La question garde le cadrage : ce ne sont pas des réglages
                  qu'on propose, ce sont des positionnements. */}
              <p className="mo-demande">Quel est le positionnement de ton produit ?</p>
              <ul className="mo-intentions">
                {(INTENTIONS as { nom: string; base: number; intervalle: number; racine: number; note: string }[])
                  .map((it) => {
                    const pris = base === it.base && interv === it.intervalle && racine === it.racine;
                    return (
                      <li key={it.nom}>
                        <button type="button" className={pris ? "on" : ""}
                          onClick={() => { aLaMain(); setBase(it.base); setInterv(it.intervalle);
                            setRacine(it.racine); setTitres(CHARTE.intervalleTitres); }}>
                          {it.nom}
                        </button>
                      </li>
                    );
                  })}
              </ul>
              <p className="mo-legende">
                {`un seul choix, et les trois nombres suivent : base ${fr(base)} · intervalle ${fr2(interv)} · racine ${fr(racine)} — le quatrième, l'intervalle des titres, est le même pour tout le monde`}
              </p>
            </div>
          ) : demo ? (
            <div className="mo-commandes">
              {(["base", "intervalle", "racine", "titres"] as Quoi[]).map((q) => (
                <Molette key={q} {...REGLAGES[q]} />
              ))}
              <p className="mo-legende">
                {`container ${fr(socle.pad[0])} · card ${fr(socle.pad[1])} · row ${fr(socle.pad[2])} — coins ${fr(socle.r[0])} · ${fr(socle.r[1])} · ${fr(socle.r[2])} — titre ${fr(socle.texte.h3)} sur un corps à ${fr(socle.texte.body)}`}
              </p>
            </div>
          ) : null}
        </div>

        {/* La molette se pose EN BAS du panneau : c'est une commande, elle
            n'a rien à faire entre le titre et ce qu'il annonce, et elle
            laisse ainsi toute la hauteur aux blocs d'infos. */}
        {s.genre === "visuel" && s.molette ? (
          <div className="mo-pied" ref={pied} onPointerDown={aLaMain} onKeyDown={aLaMain}>
            <Molette {...REGLAGES[s.molette]}
              nom={s.moletteDit ?? REGLAGES[s.molette].nom} />
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
        <div className="mo-porte">
          {/* Les arcs des coins ne sont plus MESURÉS sur la fiche : ils sont
              dessinés par les coins eux-mêmes, à partir du même jeton. Une
              cote mesurée décroche dès qu'on tourne la molette ; une cote
              dérivée ne le peut pas. Et elle porte son calcul, pas un
              nombre nu (verdict d'Auteur : « soit une formule, soit rien »). */}
          {/* Quand la fiche porte des valeurs écrites à la main (la slide
              « avant », le crible, les versions), c'est une rupture déclarée :
              elle le dit sur elle-même, et le banc la lit comme telle. */}
          <div className={`mo-fiche ${s.genre === "visuel" && s.coins ? "coins" : ""}`}
            ref={fiche}
            data-intent={!demo && s.niveau === undefined ? "statement" : undefined}
            style={{
              ...jetons,
              ...(s.genre === "visuel" && s.coins ? {
                "--coin-1": `"${fr(socle.r[0])} px"`,
                "--coin-2": `"÷ 2 = ${fr(socle.r[1])}"`,
                "--coin-3": `"÷ 2 = ${fr(socle.r[2])}"`,
              } : {}),
            } as CSSProperties}>
            <TrancheFili voir={false} menu={false} />

            {/* Une pastille dans le coin de la démo, une par version : elle
                dit laquelle on regarde, elle ne se pilote pas. Le défilé
                raconte tout seul (verdict d'Auteur, 2 septembre — les
                onglets faisaient une commande là où il fallait une
                étiquette). */}
            {s.versions ? (
              <span className="mo-version" key={s.versions[ver].nom}>
                {s.versions[ver].nom}
              </span>
            ) : null}
            {crible ? (
              <span className="mo-crible" aria-hidden="true">
                {CRIBLE.slice(0, poses).map((c, k) => tags[k] ? (
                  <i key={k} className={`f-${c.fam}`}
                    style={{ left: `${tags[k]!.x}px`, top: `${tags[k]!.y}px` }}>{c.v}<em>px</em></i>
                ) : null)}
              </span>
            ) : null}
          </div>
        </div>

        {!crible && !demo && !question ? (
          <>
            <svg className="mo-traits" aria-hidden="true">
              {rangs.map(({ n, y, ancre }) => ancre ? (
                <g key={n.cle} className={`mo-trait ${n.ton ?? ""}`}>
                  <polyline points={`${ancre.x},${ancre.y} ${coude},${ancre.y} ${coude},${y} ${coude + 20},${y}`} />
                  <circle cx={ancre.x} cy={ancre.y} r="3" />
                </g>
              ) : null)}
            </svg>
            <div className="mo-notes" style={{ left: `${coude + 20}px` }}>
              {rangs.map(({ n, y }) => (
                <article key={n.cle} className={`mo-note ${n.ton ?? ""}`} style={{ top: `${y}px` }}>
                  <b>{n.titre}</b><span>{n.dit}</span>
                </article>
              ))}
            </div>
          </>
        ) : null}
      </div>

      <div className="mo-player">
        <button type="button" className="mo-rond" onClick={() => bouge(-1)}
          disabled={i === 0} aria-label="Slide précédente">←</button>
        <button type="button" className={`mo-rond mo-lect ${lecture ? "en-cours" : ""} ${fin ? "fin" : ""}`}
          onClick={bascule}
          aria-label={fin ? "Rejouer le scénario" : lecture ? "Mettre en pause" : "Lancer la lecture"}>
          <svg viewBox="0 0 24 24" aria-hidden="true" className="ic ic-play"><path d="M8.2 5.4v13.2L19.4 12z" /></svg>
          <svg viewBox="0 0 24 24" aria-hidden="true" className="ic ic-pause"><path d="M7 5h3.4v14H7zM13.6 5H17v14h-3.6z" /></svg>
          <svg viewBox="0 0 24 24" aria-hidden="true" className="ic ic-re"><path d="M12 5V2L7 6l5 4V7c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6H4c0 4.4 3.6 8 8 8s8-3.6 8-8-3.6-8-8-8z" /></svg>
        </button>
        <button type="button" className="mo-rond" onClick={() => bouge(1)}
          disabled={i === DERNIER} aria-label="Slide suivante">→</button>
        <span className="mo-cpt mono">{i + 1} / {SLIDES.length}</span>
        <span className="mo-temps" aria-hidden="true">
          <i style={{ transform: `scaleX(${lecture ? avance : 0})` }} />
        </span>
      </div>
    </div>
  );
}
