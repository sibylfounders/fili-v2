"use client";
import { useEffect, useState } from "react";

/* La densité est un réglage de theming : elle s'applique à tout le site
   (attribut sur <html>, décalage d'un cran dans tokens.css — règle Y5)
   et se mémorise d'une page et d'une visite à l'autre.
   Trois crans : Aéré (un cran plus haut) · Confortable · Compact (un cran
   plus bas). */

const CLE = "kit-densite";
export type Densité = "aere" | "confortable" | "compact";

const lire = (): Densité => {
  if (typeof document === "undefined") return "confortable";
  const d = document.documentElement.dataset.densite;
  return d === "compact" || d === "aere" ? d : "confortable";
};

export function useDensite() {
  const [densite, setDensite] = useState<Densité>("confortable");
  useEffect(() => {
    setDensite(lire());
    const mo = new MutationObserver(() => setDensite(lire()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-densite"] });
    return () => mo.disconnect();
  }, []);
  const changer = (d: Densité) => {
    if (d === "confortable") delete document.documentElement.dataset.densite;
    else document.documentElement.dataset.densite = d;
    try { localStorage.setItem(CLE, d); } catch {}
  };
  return { densite, changer };
}

export function Densite() {
  const { densite, changer } = useDensite();
  const CHOIX: [Densité, string][] = [["aere", "Aéré"], ["confortable", "Confortable"], ["compact", "Compact"]];
  return (
    <div className="bloc">
      <span className="mono sourd">Densité — tout le site</span>
      <div className="rang" style={{ gap: "var(--rr-inline-sm)" }}>
        {CHOIX.map(([d, nom]) => (
          <button key={d} className={`bouton ${densite === d ? "on" : ""}`} onClick={() => changer(d)}>{nom}</button>
        ))}
      </div>
    </div>
  );
}
