"use client";
import { useSyncExternalStore } from "react";

/* La densité est un réglage de theming : elle s'applique à tout le site
   (attribut sur <html>, décalage d'un cran dans tokens.css — règle Y5)
   et se mémorise d'une page et d'une visite à l'autre.
   Trois crans : Aéré (un cran plus haut) · Confortable · Compact (un cran
   plus bas). Valeurs API en anglais : airy / comfortable / compact
   (décision d'Auteur, 23 août — l'API du kit parle anglais).

   État lu depuis <html> par useSyncExternalStore, calé pendant
   l'hydratation : le réglage affiché ne repasse jamais par sa valeur
   par défaut au chargement. */

const KEY = "kit-density";
export type Densité = "airy" | "comfortable" | "compact";

const read = (): Densité => {
  const d = document.documentElement.dataset.density;
  return d === "compact" || d === "airy" ? d : "comfortable";
};

const subscribe = (cb: () => void) => {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-density"] });
  return () => mo.disconnect();
};

export function useDensity() {
  const density = useSyncExternalStore(subscribe, read, () => "comfortable" as Densité);
  const changer = (d: Densité) => {
    if (d === "comfortable") delete document.documentElement.dataset.density;
    else document.documentElement.dataset.density = d;
    try { localStorage.setItem(KEY, d); } catch {}
  };
  return { density, changer };
}

export function Density() {
  const { changer } = useDensity();
  const CHOICE: [Densité, string][] = [["airy", "Aéré"], ["comfortable", "Confortable"], ["compact", "Compact"]];
  return (
    <div className="block">
      <span className="mono muted">Densité — tout le site</span>
      <div className="rank" style={{ gap: "var(--gap-3-inline)" }}>
        {CHOICE.map(([d, name]) => (
          /* bouton actif dessiné en CSS depuis <html data-density> */
          <button key={d} data-choice-density={d} className="button" onClick={() => changer(d)}>{name}</button>
        ))}
      </div>
    </div>
  );
}
