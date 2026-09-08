"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* ── Le rail nu du gabarit documentaire (CG2) et son repère de défilement.
   Aucun fond, aucune bordure : l'alignement et le blanc portent tout.

   Décision du 2 septembre 2026 — le rail garde la PAGE, pas le site.
   Il portait deux listes de même poids : les pages du kit, puis les sections.
   Mesuré sur le rail d'avant : 845 px à six pages, 1 187 px à quatorze,
   2 213 px avec les composants — pour 712 px de place sur un treize pouces.
   Il débordait donc déjà au présent, et sa hauteur dépendait de la feuille
   de route. Désormais : UNE ligne pour la famille en cours, la colonne
   entière pour le sommaire, et tout le site dans une feuille à onglets qui
   ne coûte pas une ligne au rail. Sur petit écran, une barre à deux boutons
   remplace le sommaire qui disparaissait purement et simplement. ── */

export type Toc = [string, string, string][]; /* [id, index, libellé] */

/* La liste des pages vit dans pages.ts — une seule, lue par le menu, le
   rail, le tiroir et l'accueil (7 septembre 2026). Le rail ne porte plus
   la sienne : il ne peut plus diverger de l'accueil. */
import { CATEGORIES, keyOf, familyOf, pageOf, pagesOf, type Family, type Page } from "./pages";

/* Les trois traits remplissent leur boîte (3 → 13 sur 16) et la boîte est
   réglée sur la hauteur des capitales du mot : l'encre du signe et l'encre
   du mot font alors la même hauteur, et la ligne se lit d'un bloc. Centrées
   sur la même boîte de ligne, elles partagent le même axe (mesuré). */
const BURGER = (
  <svg className="rail-burger" viewBox="0 0 16 16" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M2.5 3h11" /><path d="M2.5 8h11" /><path d="M2.5 13h11" />
  </svg>
);

/* La croix ferme la feuille depuis la rangée d'onglets, là où l'œil est déjà.
   La maison n'y est plus : « Accueil » est devenu le titre cliquable de la
   feuille, en haut à gauche (verdict d'Auteur, 2 septembre). */
const CROSS = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
    strokeLinecap="round" aria-hidden="true">
    <path d="M3.5 3.5l9 9" /><path d="M12.5 3.5l-9 9" />
  </svg>
);

/* La version du kit, dite une seule fois. */
const VERSION = "v1.5";

/* Le pied du rail. Il tenait une fiche technique — « COLOR-UX · dix-sept
   règles · deux thèmes » — c'est-à-dire de la plomberie dans la couche
   visible, et un renseignement que personne ne cherchait là. Il dit
   maintenant une phrase : la page a le droit d'avoir de l'esprit dans sa
   marge (verdict d'Auteur, 2 septembre). La phrase vit dans la liste des
   pages, à côté de la page qui la porte. */

/* Le chemin inverse : de la page où l'on est vers sa famille et ses sœurs.
   Le rail peut alors offrir le déplacement le plus fréquent — passer d'une
   fondation à l'autre — sans ouvrir la feuille. Seules les pages OUVERTES y
   figurent : une sœur à venir n'est pas un déplacement. */
function houseOf(page: string): { family: string; sisters: Page[] } | null {
  const here = familyOf(page);
  if (!here) return null;
  return { family: here.family.name, sisters: pagesOf(here.family).filter((pg) => pg.path) };
}

/* Une page ouverte est un lien ; une page à venir occupe sa place sans
   promettre ce qu'elle ne tient pas (ni cliquable, ni au clavier).

   Deux pannes réparées le 2 septembre — « parfois, cliquer dans le menu
   recharge la page au lieu de m'emmener où j'ai cliqué » :

   1. LA PAGE EN COURS ÉTAIT UN LIEN VERS ELLE-MÊME. Cliquer dessus ne
      pouvait rien faire d'autre que recharger. Elle n'est plus cliquable :
      on ne propose pas d'aller là où l'on est déjà.
   2. TOUTE LA NAVIGATION PASSAIT PAR DES <a> NUS. Chaque entrée du menu
      rechargeait le document entier — l'écran blanchit, le défilement
      repart de zéro, et l'arrivée à l'ancre se perd en route. Les liens
      internes passent par le routeur : la page change sans recharger. */
function Entry({ pg, page }: { pg: Page; page: string }) {
  if (!pg.path) return <span className="index-link upcoming">{pg.name}</span>;
  if (keyOf(pg) === page) return (
    <span className="index-link on" aria-current="page">
      {pg.name}<span className="rail-brand" />
    </span>
  );
  return (
    <Link className="index-link" href={pg.path}>
      {pg.name}<span className="rail-brand" />
    </Link>
  );
}

function Families({ families, page }: { families: Family[]; page: string }) {
  return (
    <div className="index-families" data-cols={families.reduce((n, f) => n + f.columns.length, 0)}>
      {families.map((f) => (
        <section key={f.name} className="index-family"
          data-wide={f.columns.length > 1 ? f.columns.length : undefined}>
          <p className="index-fam">{f.name}</p>
          {f.columns.length > 1 ? (
            <div className="index-batches">
              {/* Les paquets décident de la répartition en colonnes, mais ne
                  se nomment plus : une étiquette de catégorie au-dessus d'une
                  liste de pages se confondait avec les pages elles-mêmes
                  (verdict d'Auteur, 2 septembre). Le groupement se voit, il
                  ne se dit pas. */}
              {f.columns.map((column, i) => (
                <div key={i} className="index-list">
                  {column.flatMap((batch) => batch.pages).map((pg) => (
                    <Entry key={pg.name} pg={pg} page={page} />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="index-list">
              {pagesOf(f).map((pg) => <Entry key={pg.name} pg={pg} page={page} />)}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}

/* La feuille du site : un onglet à la fois. Chaque panneau tient d'un regard,
   et la feuille ne grandit plus avec le kit. Exportée depuis le 7 septembre :
   l'accueil l'ouvre lui aussi, déjà posée sur l'onglet demandé (`onglet`) —
   une famille sans page ouverte y mène, ses pages à venir sous les yeux. */
export function SheetSite({ page, open, close, anchor, tab }: {
  page: string; open: boolean; close: () => void; anchor: React.RefObject<HTMLElement>;
  tab?: string;
}) {
  const [active, setActive] = useState("system");
  const held = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    if (tab && CATEGORIES.some((c) => c.key === tab)) setActive(tab);
    held.current?.focus();
  }, [open, tab]);

  /* Échap ferme et rend le focus au bouton d'où l'on venait ; la tabulation
     boucle dans la feuille tant qu'elle est ouverte. */
  useEffect(() => {
    if (!open) return;
    const onKeystroke = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.stopPropagation(); close(); anchor.current?.focus(); return; }
      if (e.key !== "Tab" || !held.current) return;
      const targets = Array.from(held.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])')).filter((n) => n.offsetParent !== null);
      if (!targets.length) return;
      const first = targets[0], last = targets[targets.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeystroke);
    return () => document.removeEventListener("keydown", onKeystroke);
  }, [open, close, anchor]);

  /* Les onglets suivent le motif de rangée : un seul atteignable au clavier,
     les flèches déplacent, Début et Fin vont aux extrémités. */
  const onKeystrokes = (e: React.KeyboardEvent, i: number) => {
    const increment = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    let n = -1;
    if (increment) n = (i + increment + CATEGORIES.length) % CATEGORIES.length;
    if (e.key === "Home") n = 0;
    if (e.key === "End") n = CATEGORIES.length - 1;
    if (n < 0) return;
    e.preventDefault(); setActive(CATEGORIES[n].key);
    bar.current?.querySelectorAll<HTMLElement>(".mega-tab")[n]?.focus();
  };

  return (
    <div className={`sheet ${open ? "open" : ""}`} hidden={!open}>
      <div className="sheet-veil" onClick={() => { close(); anchor.current?.focus(); }} />
      <div className="sheet-held" role="dialog" aria-modal="true"
        aria-label="Toutes les pages du kit" tabIndex={-1} ref={held}>
        <div className="sheet-head">
          <Link className="sheet-home" href="/">Accueil</Link>
          <span className="sheet-version">{VERSION}</span>
        </div>
        <div className="mega">
          <div className="mega-tabs">
            <button className="mega-close" type="button" aria-label="Fermer le menu"
              title="Fermer" onClick={() => { close(); anchor.current?.focus(); }}>
              {CROSS}
            </button>
            <div className="mega-row" role="tablist" aria-label="Sections du kit" ref={bar}>
            {CATEGORIES.map((o, i) => (
              <button key={o.key} className="mega-tab" type="button" role="tab"
                id={`ong-${o.key}`} aria-controls={`pan-${o.key}`}
                aria-selected={active === o.key} tabIndex={active === o.key ? 0 : -1}
                onClick={() => setActive(o.key)} onKeyDown={(e) => onKeystrokes(e, i)}>
                {o.name}
              </button>
            ))}
            </div>
          </div>
          {CATEGORIES.map((o) => (
            <div key={o.key} className="mega-panel" role="tabpanel" id={`pan-${o.key}`}
              aria-labelledby={`ong-${o.key}`} tabIndex={0} hidden={active !== o.key}>
              {o.families
                ? <Families families={o.families} page={page} />
                : <div className="mega-info">
                    <p className="index-fam">{o.name}</p>
                    <p>{o.says}</p>
                  </div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* La feuille du sommaire — elle n'existe que sous le palier, là où le rail
   cède la colonne. Avant, les ancres disparaissaient sans remplacement. */
function SheetSections({ toc, activeId, open, close, anchor }: {
  toc: Toc; activeId: string; open: boolean; close: () => void;
  anchor: React.RefObject<HTMLElement>;
}) {
  const held = useRef<HTMLDivElement>(null);
  useEffect(() => { if (open) held.current?.focus(); }, [open]);
  useEffect(() => {
    if (!open) return;
    const onKeystroke = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.stopPropagation(); close(); anchor.current?.focus(); }
    };
    document.addEventListener("keydown", onKeystroke);
    return () => document.removeEventListener("keydown", onKeystroke);
  }, [open, close, anchor]);

  return (
    <div className={`sheet from-below ${open ? "open" : ""}`} hidden={!open}>
      <div className="sheet-veil" onClick={() => { close(); anchor.current?.focus(); }} />
      <div className="sheet-held" role="dialog" aria-modal="true"
        aria-label="Sections de cette page" tabIndex={-1} ref={held}>
        <div className="sheet-head">
          <span className="rail-heading">Sur cette page</span>
          <button className="sheet-close" type="button"
            onClick={() => { close(); anchor.current?.focus(); }}>Fermer</button>
        </div>
        <div className="rail-list">
          {toc.map(([id, n, t]) => (
            <a key={id} className={`rail-link ${activeId === id ? "active" : ""}`}
              href={`#${id}`} onClick={close}>
              <span className="rail-index">{n}</span><span>{t}</span><span className="rail-brand" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export function RailDoc({ page, heading, toc, activeId, foot }: {
  page: string; heading: string; toc: Toc; activeId: string; foot: string;
}) {
  const [sheet, setSheet] = useState<"" | "site" | "sections">("");
  const opensRail = useRef<HTMLButtonElement>(null);
  const dotSite = useRef<HTMLButtonElement>(null);
  const dotSecs = useRef<HTMLButtonElement>(null);
  const anchor = useRef<HTMLElement>(null!);

  const open = (what: "site" | "sections", since: React.RefObject<HTMLElement>) => {
    anchor.current = since.current as HTMLElement;
    setSheet(what);
  };
  const close = () => setSheet("");

  const current = toc.find(([id]) => id === activeId) ?? toc[0];
  const house = houseOf(page);
  const currentPage = pageOf(page);

  return (
    <>
      {/* Sous le palier : deux boutons là où il n'y avait plus rien. */}
      <div className="nav-bar">
        <button className="dot" type="button" ref={dotSite}
          aria-expanded={sheet === "site"} onClick={() => open("site", dotSite)}>
          <span className="dot-or">{BURGER}Menu</span><b>{house?.family ?? heading}</b>
        </button>
        <button className="dot" type="button" ref={dotSecs}
          aria-expanded={sheet === "sections"} onClick={() => open("sections", dotSecs)}>
          <span className="dot-or">Sur cette page</span>
          <b>{current ? `${current[1]} ${current[2]}` : ""}</b>
        </button>
      </div>

      <nav className="gdoc-rail" aria-label="Navigation du kit et sommaire de la page">
        <div className="rail-fixed">
          {/* Le rail garde la hiérarchie d'origine : une étiquette mono, puis
              une liste — deux fois (verdict d'Auteur, 2 septembre). Au-dessus,
              une seule ligne pour ouvrir tout le site. */}
          <button className="rail-opens" type="button" ref={opensRail}
            aria-expanded={sheet === "site"} onClick={() => open("site", opensRail)}>
            <span className="rail-opens-says">{BURGER}Menu</span>
          </button>
          {/* Premier étage : la famille, et ses pages ouvertes. Celle où l'on
              est ne se clique pas. */}
          {house && house.sisters.length > 1 && (
            <div className="rail-block">
              <span className="rail-heading">{house.family}</span>
              <div className="rail-list">
                {house.sisters.map((pg) => (
                  keyOf(pg) === page
                    ? <span key={pg.name} className="rail-link simple active" aria-current="page">
                        {pg.name}<span className="rail-brand" />
                      </span>
                    : <Link key={pg.name} className="rail-link simple" href={pg.path!}>
                        {pg.name}<span className="rail-brand" />
                      </Link>
                ))}
              </div>
            </div>
          )}
          <div className="rail-block rail-sum">
            <span className="rail-heading">{currentPage?.name ?? "Sur cette page"}</span>
            <div className="rail-list">
              {toc.map(([id, n, t]) => (
                <a key={id} className={`rail-link ${activeId === id ? "active" : ""}`} href={`#${id}`}>
                  <span className="rail-index">{n}</span><span>{t}</span><span className="rail-brand" />
                </a>
              ))}
            </div>
          </div>
          <div className="rail-foot">{currentPage?.foot ?? foot}</div>
        </div>
      </nav>

      <SheetSite page={page} open={sheet === "site"} close={close} anchor={anchor} />
      <SheetSections toc={toc} activeId={activeId}
        open={sheet === "sections"} close={close} anchor={anchor} />
    </>
  );
}

/* Entrée en scène + section active — l'observation, pas le calcul. Le
   mouvement lui-même vit en CSS, derrière prefers-reduced-motion. */
export function useDocSections(defaults: string) {
  const [activeId, setActiveId] = useState(defaults);
  /* Pas de tableau de dépendances : l'effet se réarme à chaque rendu.
     Raison (24 août) : le rechargement à chaud de Next remplace les nœuds
     du DOM — un observateur posé une seule fois surveillait des sections
     orphelines, et tout ce qui n'était pas encore révélé restait invisible
     à vie (« la partie adaptation a été effacée »). Se réarmer coûte deux
     observateurs par rendu, et les rendus sont rares. */
  useEffect(() => {
    const secs = Array.from(document.querySelectorAll<HTMLElement>(".gdoc-sec"));
    if (!("IntersectionObserver" in window)) {
      secs.forEach((s) => s.classList.add("set"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("set"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -12% 0px" });
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActiveId(e.target.id); });
    }, { rootMargin: "-40% 0px -50% 0px" });
    secs.forEach((s) => { if (!s.classList.contains("set")) io.observe(s); spy.observe(s); });
    return () => { io.disconnect(); spy.disconnect(); };
  });
  return activeId;
}
