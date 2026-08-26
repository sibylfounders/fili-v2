"use client";
import { useEffect, useState } from "react";

/* ── Le rail nu du gabarit documentaire (CG2) et son repère de
   défilement — partagés par les pages du kit passées au gabarit.
   Aucun fond, aucune bordure : l'alignement et le blanc portent tout. ── */

export type Sommaire = [string, string, string][]; /* [id, index, libellé] */

const PAGES: [string, string, string][] = [
  ["/", "accueil", "Accueil"],
  ["/rythme", "rythme", "Rythme"],
  ["/typo", "typo", "Typographie"],
  ["/couleur", "couleur", "Couleur"],
  ["/arrondis", "arrondis", "Arrondis"],
  ["/composition", "composition", "Composition"],
];

export function RailDoc({ page, titre, sommaire, actifId, pied }: {
  page: string; titre: string; sommaire: Sommaire; actifId: string; pied: string;
}) {
  return (
    <nav className="gdoc-rail" aria-label="Navigation et sommaire">
      <div className="rail-fixe">
        <div className="rail-bloc rail-sites">
          <span className="rail-titre">Kit</span>
          <div className="rail-liste">
            {PAGES.map(([href, id, nom]) => (
              <a key={id} className={`rail-lien simple ${page === id ? "actif" : ""}`}
                href={href} aria-current={page === id ? "page" : undefined}>
                {nom}<span className="rail-marque" />
              </a>
            ))}
          </div>
        </div>
        <div className="rail-bloc rail-somm">
          <span className="rail-titre">{titre}</span>
          <div className="rail-liste">
            {sommaire.map(([id, n, t]) => (
              <a key={id} className={`rail-lien ${actifId === id ? "actif" : ""}`} href={`#${id}`}>
                <span className="rail-index">{n}</span><span>{t}</span><span className="rail-marque" />
              </a>
            ))}
          </div>
        </div>
        <div className="rail-pied">{pied}</div>
      </div>
    </nav>
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
