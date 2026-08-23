"use client";
import { useEffect, useState } from "react";

/* La densité est un réglage de theming : elle s'applique à tout le site
   (attribut sur <html>, décalage d'un cran dans tokens.css — règle Y5)
   et se mémorise d'une page et d'une visite à l'autre.
   Trois crans : Aéré (un cran plus haut) · Confortable · Compact (un cran
   plus bas). Valeurs API en anglais : airy / comfortable / compact
   (décision d'Auteur, 23 août — l'API du kit parle anglais). */

const CLE = "kit-density";
export type Densité = "airy" | "comfortable" | "compact";

const lire = (): Densité => {
  if (typeof document === "undefined") return "comfortable";
  const d = document.documentElement.dataset.density;
  return d === "compact" || d === "airy" ? d : "comfortable";
};

export function useDensite() {
  const [densite, setDensite] = useState<Densité>("comfortable");
  useEffect(() => {
    setDensite(lire());
    const mo = new MutationObserver(() => setDensite(lire()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-density"] });
    return () => mo.disconnect();
  }, []);
  const changer = (d: Densité) => {
    if (d === "comfortable") delete document.documentElement.dataset.density;
    else document.documentElement.dataset.density = d;
    try { localStorage.setItem(CLE, d); } catch {}
  };
  return { densite, changer };
}

export function Densite() {
  const { densite, changer } = useDensite();
  const CHOIX: [Densité, string][] = [["airy", "Aéré"], ["comfortable", "Confortable"], ["compact", "Compact"]];
  return (
    <div className="bloc">
      <span className="mono sourd">Densité — tout le site</span>
      <div className="rang" style={{ gap: "var(--space-inline-sm)" }}>
        {CHOIX.map(([d, nom]) => (
          <button key={d} className={`bouton ${densite === d ? "on" : ""}`} onClick={() => changer(d)}>{nom}</button>
        ))}
      </div>
    </div>
  );
}
