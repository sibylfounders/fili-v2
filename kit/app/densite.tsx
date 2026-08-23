"use client";
import { useEffect, useState } from "react";

/* La densité est un réglage de theming : elle s'applique à tout le site
   (attribut sur <html>, décalage d'un cran dans tokens.css — règle Y5)
   et se mémorise d'une page et d'une visite à l'autre. */

const CLE = "kit-densite";
const lireCompact = () =>
  typeof document !== "undefined" && document.documentElement.dataset.densite === "compact";

export function useDensite() {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    setCompact(lireCompact());
    const mo = new MutationObserver(() => setCompact(lireCompact()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-densite"] });
    return () => mo.disconnect();
  }, []);
  const changer = (c: boolean) => {
    if (c) document.documentElement.dataset.densite = "compact";
    else delete document.documentElement.dataset.densite;
    try { localStorage.setItem(CLE, c ? "compact" : "confortable"); } catch {}
  };
  return { compact, changer };
}

export function Densite() {
  const { compact, changer } = useDensite();
  return (
    <div className="bloc">
      <span className="mono sourd">Densité — tout le site</span>
      <div className="rang" style={{ gap: "var(--rr-inline-sm)" }}>
        <button className={`bouton ${!compact ? "on" : ""}`} onClick={() => changer(false)}>Confortable</button>
        <button className={`bouton ${compact ? "on" : ""}`} onClick={() => changer(true)}>Compact</button>
      </div>
    </div>
  );
}
