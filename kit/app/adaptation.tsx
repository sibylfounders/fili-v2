"use client";
import { useSyncExternalStore } from "react";

/* L'adaptation est un réglage de theming global : Tailwind (défaut),
   shadcn (géométrie shadcn/ui — rayons md, contrôles h-9 ; la couleur
   vient toujours de la famille, dans les deux thèmes), HTML natif
   (décimales calculées, valeurs fluides). Mémorisé d'une page et d'une
   visite à l'autre.

   État lu depuis <html> par useSyncExternalStore, calé pendant
   l'hydratation : le réglage affiché ne repasse jamais par sa valeur
   par défaut au chargement. */

const KEY = "kit-adaptation";
export type Adapt = "tailwind" | "shadcn" | "html";

const read = (): Adapt => {
  const a = document.documentElement.dataset.adaptation;
  return a === "shadcn" || a === "html" ? a : "tailwind";
};

const subscribe = (cb: () => void) => {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-adaptation"] });
  return () => mo.disconnect();
};

export function useAdaptation() {
  const adaptation = useSyncExternalStore(subscribe, read, () => "tailwind" as Adapt);
  const changer = (a: Adapt) => {
    if (a === "tailwind") delete document.documentElement.dataset.adaptation;
    else document.documentElement.dataset.adaptation = a;
    try { localStorage.setItem(KEY, a); } catch {}
  };
  const styl = adaptation === "shadcn" ? "shadcn" : adaptation === "html" ? "HTML natif" : "Tailwind";
  const tw = adaptation !== "html"; /* shadcn vit sur Tailwind : mêmes accrochages 4-16 */
  return { adaptation, changer, styl, tw };
}

export function Adaptation() {
  const { changer } = useAdaptation();
  const CHOICE: [Adapt, string][] = [["tailwind", "Tailwind"], ["shadcn", "shadcn"], ["html", "HTML natif"]];
  return (
    <div className="block">
      <span className="mono muted">Adaptation — tout le site</span>
      <div className="rank" style={{ gap: "var(--gap-3-inline)" }}>
        {CHOICE.map(([a, name]) => (
          /* bouton actif dessiné en CSS depuis <html data-adaptation> */
          <button key={a} data-choice-adaptation={a} className="button" onClick={() => changer(a)}>{name}</button>
        ))}
      </div>
    </div>
  );
}
