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

export type Sommaire = [string, string, string][]; /* [id, index, libellé] */

/* La liste des pages vit dans pages.ts — une seule, lue par le menu, le
   rail, le tiroir et l'accueil (7 septembre 2026). Le rail ne porte plus
   la sienne : il ne peut plus diverger de l'accueil. */
import { CATEGORIES, cleDe, familleDe, pageDe, pagesDe, type Famille, type Page } from "./pages";

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
const CROIX = (
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
function maisonDe(page: string): { famille: string; soeurs: Page[] } | null {
  const ici = familleDe(page);
  if (!ici) return null;
  return { famille: ici.famille.nom, soeurs: pagesDe(ici.famille).filter((pg) => pg.chemin) };
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
function Entree({ pg, page }: { pg: Page; page: string }) {
  if (!pg.chemin) return <span className="index-lien avenir">{pg.nom}</span>;
  if (cleDe(pg) === page) return (
    <span className="index-lien on" aria-current="page">
      {pg.nom}<span className="rail-marque" />
    </span>
  );
  return (
    <Link className="index-lien" href={pg.chemin}>
      {pg.nom}<span className="rail-marque" />
    </Link>
  );
}

function Familles({ familles, page }: { familles: Famille[]; page: string }) {
  return (
    <div className="index-familles" data-cols={familles.reduce((n, f) => n + f.colonnes.length, 0)}>
      {familles.map((f) => (
        <section key={f.nom} className="index-famille"
          data-large={f.colonnes.length > 1 ? f.colonnes.length : undefined}>
          <p className="index-fam">{f.nom}</p>
          {f.colonnes.length > 1 ? (
            <div className="index-paquets">
              {/* Les paquets décident de la répartition en colonnes, mais ne
                  se nomment plus : une étiquette de catégorie au-dessus d'une
                  liste de pages se confondait avec les pages elles-mêmes
                  (verdict d'Auteur, 2 septembre). Le groupement se voit, il
                  ne se dit pas. */}
              {f.colonnes.map((colonne, i) => (
                <div key={i} className="index-liste">
                  {colonne.flatMap((paquet) => paquet.pages).map((pg) => (
                    <Entree key={pg.nom} pg={pg} page={page} />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="index-liste">
              {pagesDe(f).map((pg) => <Entree key={pg.nom} pg={pg} page={page} />)}
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
export function FeuilleSite({ page, ouvert, fermer, ancre, onglet }: {
  page: string; ouvert: boolean; fermer: () => void; ancre: React.RefObject<HTMLElement>;
  onglet?: string;
}) {
  const [actif, setActif] = useState("systeme");
  const tenu = useRef<HTMLDivElement>(null);
  const barre = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ouvert) return;
    if (onglet && CATEGORIES.some((c) => c.cle === onglet)) setActif(onglet);
    tenu.current?.focus();
  }, [ouvert, onglet]);

  /* Échap ferme et rend le focus au bouton d'où l'on venait ; la tabulation
     boucle dans la feuille tant qu'elle est ouverte. */
  useEffect(() => {
    if (!ouvert) return;
    const surTouche = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.stopPropagation(); fermer(); ancre.current?.focus(); return; }
      if (e.key !== "Tab" || !tenu.current) return;
      const cibles = Array.from(tenu.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])')).filter((n) => n.offsetParent !== null);
      if (!cibles.length) return;
      const premier = cibles[0], dernier = cibles[cibles.length - 1];
      if (e.shiftKey && document.activeElement === premier) { e.preventDefault(); dernier.focus(); }
      else if (!e.shiftKey && document.activeElement === dernier) { e.preventDefault(); premier.focus(); }
    };
    document.addEventListener("keydown", surTouche);
    return () => document.removeEventListener("keydown", surTouche);
  }, [ouvert, fermer, ancre]);

  /* Les onglets suivent le motif de rangée : un seul atteignable au clavier,
     les flèches déplacent, Début et Fin vont aux extrémités. */
  const surTouches = (e: React.KeyboardEvent, i: number) => {
    const pas = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    let n = -1;
    if (pas) n = (i + pas + CATEGORIES.length) % CATEGORIES.length;
    if (e.key === "Home") n = 0;
    if (e.key === "End") n = CATEGORIES.length - 1;
    if (n < 0) return;
    e.preventDefault(); setActif(CATEGORIES[n].cle);
    barre.current?.querySelectorAll<HTMLElement>(".mega-onglet")[n]?.focus();
  };

  return (
    <div className={`feuille ${ouvert ? "ouverte" : ""}`} hidden={!ouvert}>
      <div className="feuille-voile" onClick={() => { fermer(); ancre.current?.focus(); }} />
      <div className="feuille-tenu" role="dialog" aria-modal="true"
        aria-label="Toutes les pages du kit" tabIndex={-1} ref={tenu}>
        <div className="feuille-tete">
          <Link className="feuille-accueil" href="/">Accueil</Link>
          <span className="feuille-version">{VERSION}</span>
        </div>
        <div className="mega">
          <div className="mega-onglets">
            <button className="mega-fermer" type="button" aria-label="Fermer le menu"
              title="Fermer" onClick={() => { fermer(); ancre.current?.focus(); }}>
              {CROIX}
            </button>
            <div className="mega-rangee" role="tablist" aria-label="Sections du kit" ref={barre}>
            {CATEGORIES.map((o, i) => (
              <button key={o.cle} className="mega-onglet" type="button" role="tab"
                id={`ong-${o.cle}`} aria-controls={`pan-${o.cle}`}
                aria-selected={actif === o.cle} tabIndex={actif === o.cle ? 0 : -1}
                onClick={() => setActif(o.cle)} onKeyDown={(e) => surTouches(e, i)}>
                {o.nom}
              </button>
            ))}
            </div>
          </div>
          {CATEGORIES.map((o) => (
            <div key={o.cle} className="mega-panneau" role="tabpanel" id={`pan-${o.cle}`}
              aria-labelledby={`ong-${o.cle}`} tabIndex={0} hidden={actif !== o.cle}>
              {o.familles
                ? <Familles familles={o.familles} page={page} />
                : <div className="mega-info">
                    <p className="index-fam">{o.nom}</p>
                    <p>{o.dit}</p>
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
function FeuilleSections({ sommaire, actifId, ouvert, fermer, ancre }: {
  sommaire: Sommaire; actifId: string; ouvert: boolean; fermer: () => void;
  ancre: React.RefObject<HTMLElement>;
}) {
  const tenu = useRef<HTMLDivElement>(null);
  useEffect(() => { if (ouvert) tenu.current?.focus(); }, [ouvert]);
  useEffect(() => {
    if (!ouvert) return;
    const surTouche = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.stopPropagation(); fermer(); ancre.current?.focus(); }
    };
    document.addEventListener("keydown", surTouche);
    return () => document.removeEventListener("keydown", surTouche);
  }, [ouvert, fermer, ancre]);

  return (
    <div className={`feuille par-le-bas ${ouvert ? "ouverte" : ""}`} hidden={!ouvert}>
      <div className="feuille-voile" onClick={() => { fermer(); ancre.current?.focus(); }} />
      <div className="feuille-tenu" role="dialog" aria-modal="true"
        aria-label="Sections de cette page" tabIndex={-1} ref={tenu}>
        <div className="feuille-tete">
          <span className="rail-titre">Sur cette page</span>
          <button className="feuille-fermer" type="button"
            onClick={() => { fermer(); ancre.current?.focus(); }}>Fermer</button>
        </div>
        <div className="rail-liste">
          {sommaire.map(([id, n, t]) => (
            <a key={id} className={`rail-lien ${actifId === id ? "actif" : ""}`}
              href={`#${id}`} onClick={fermer}>
              <span className="rail-index">{n}</span><span>{t}</span><span className="rail-marque" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export function RailDoc({ page, titre, sommaire, actifId, pied }: {
  page: string; titre: string; sommaire: Sommaire; actifId: string; pied: string;
}) {
  const [feuille, setFeuille] = useState<"" | "site" | "sections">("");
  const ouvreRail = useRef<HTMLButtonElement>(null);
  const pastilleSite = useRef<HTMLButtonElement>(null);
  const pastilleSecs = useRef<HTMLButtonElement>(null);
  const ancre = useRef<HTMLElement>(null!);

  const ouvrir = (quoi: "site" | "sections", depuis: React.RefObject<HTMLElement>) => {
    ancre.current = depuis.current as HTMLElement;
    setFeuille(quoi);
  };
  const fermer = () => setFeuille("");

  const courante = sommaire.find(([id]) => id === actifId) ?? sommaire[0];
  const maison = maisonDe(page);
  const courantePage = pageDe(page);

  return (
    <>
      {/* Sous le palier : deux boutons là où il n'y avait plus rien. */}
      <div className="nav-barre">
        <button className="pastille" type="button" ref={pastilleSite}
          aria-expanded={feuille === "site"} onClick={() => ouvrir("site", pastilleSite)}>
          <span className="pastille-ou">{BURGER}Menu</span><b>{maison?.famille ?? titre}</b>
        </button>
        <button className="pastille" type="button" ref={pastilleSecs}
          aria-expanded={feuille === "sections"} onClick={() => ouvrir("sections", pastilleSecs)}>
          <span className="pastille-ou">Sur cette page</span>
          <b>{courante ? `${courante[1]} ${courante[2]}` : ""}</b>
        </button>
      </div>

      <nav className="gdoc-rail" aria-label="Navigation du kit et sommaire de la page">
        <div className="rail-fixe">
          {/* Le rail garde la hiérarchie d'origine : une étiquette mono, puis
              une liste — deux fois (verdict d'Auteur, 2 septembre). Au-dessus,
              une seule ligne pour ouvrir tout le site. */}
          <button className="rail-ouvre" type="button" ref={ouvreRail}
            aria-expanded={feuille === "site"} onClick={() => ouvrir("site", ouvreRail)}>
            <span className="rail-ouvre-dit">{BURGER}Menu</span>
          </button>
          {/* Premier étage : la famille, et ses pages ouvertes. Celle où l'on
              est ne se clique pas. */}
          {maison && maison.soeurs.length > 1 && (
            <div className="rail-bloc">
              <span className="rail-titre">{maison.famille}</span>
              <div className="rail-liste">
                {maison.soeurs.map((pg) => (
                  cleDe(pg) === page
                    ? <span key={pg.nom} className="rail-lien simple actif" aria-current="page">
                        {pg.nom}<span className="rail-marque" />
                      </span>
                    : <Link key={pg.nom} className="rail-lien simple" href={pg.chemin!}>
                        {pg.nom}<span className="rail-marque" />
                      </Link>
                ))}
              </div>
            </div>
          )}
          <div className="rail-bloc rail-somm">
            <span className="rail-titre">{courantePage?.nom ?? "Sur cette page"}</span>
            <div className="rail-liste">
              {sommaire.map(([id, n, t]) => (
                <a key={id} className={`rail-lien ${actifId === id ? "actif" : ""}`} href={`#${id}`}>
                  <span className="rail-index">{n}</span><span>{t}</span><span className="rail-marque" />
                </a>
              ))}
            </div>
          </div>
          <div className="rail-pied">{courantePage?.pied ?? pied}</div>
        </div>
      </nav>

      <FeuilleSite page={page} ouvert={feuille === "site"} fermer={fermer} ancre={ancre} />
      <FeuilleSections sommaire={sommaire} actifId={actifId}
        ouvert={feuille === "sections"} fermer={fermer} ancre={ancre} />
    </>
  );
}

/* Entrée en scène + section active — l'observation, pas le calcul. Le
   mouvement lui-même vit en CSS, derrière prefers-reduced-motion. */
export function useDocSections(defaut: string) {
  const [actifId, setActifId] = useState(defaut);
  /* Pas de tableau de dépendances : l'effet se réarme à chaque rendu.
     Raison (24 août) : le rechargement à chaud de Next remplace les nœuds
     du DOM — un observateur posé une seule fois surveillait des sections
     orphelines, et tout ce qui n'était pas encore révélé restait invisible
     à vie (« la partie adaptation a été effacée »). Se réarmer coûte deux
     observateurs par rendu, et les rendus sont rares. */
  useEffect(() => {
    const secs = Array.from(document.querySelectorAll<HTMLElement>(".gdoc-sec"));
    if (!("IntersectionObserver" in window)) {
      secs.forEach((s) => s.classList.add("posee"));
      return;
    }
    const io = new IntersectionObserver((entrees) => {
      entrees.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("posee"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -12% 0px" });
    const spy = new IntersectionObserver((entrees) => {
      entrees.forEach((e) => { if (e.isIntersecting) setActifId(e.target.id); });
    }, { rootMargin: "-40% 0px -50% 0px" });
    secs.forEach((s) => { if (!s.classList.contains("posee")) io.observe(s); spy.observe(s); });
    return () => { io.disconnect(); spy.disconnect(); };
  });
  return actifId;
}
