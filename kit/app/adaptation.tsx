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

const CLE = "kit-adaptation";
export type Adapt = "tailwind" | "shadcn" | "html";

const lire = (): Adapt => {
  const a = document.documentElement.dataset.adaptation;
  return a === "shadcn" || a === "html" ? a : "tailwind";
};

const abonner = (cb: () => void) => {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-adaptation"] });
  return () => mo.disconnect();
};

export function useAdaptation() {
  const adaptation = useSyncExternalStore(abonner, lire, () => "tailwind" as Adapt);
  const changer = (a: Adapt) => {
    if (a === "tailwind") delete document.documentElement.dataset.adaptation;
    else document.documentElement.dataset.adaptation = a;
    try { localStorage.setItem(CLE, a); } catch {}
  };
  const styl = adaptation === "shadcn" ? "shadcn" : adaptation === "html" ? "HTML natif" : "Tailwind";
  const tw = adaptation !== "html"; /* shadcn vit sur Tailwind : mêmes accrochages 4-16 */
  return { adaptation, changer, styl, tw };
}

export function Adaptation() {
  const { adaptation, changer } = useAdaptation();
  const CHOIX: [Adapt, string][] = [["tailwind", "Tailwind"], ["shadcn", "shadcn"], ["html", "HTML natif"]];
  return (
    <div className="bloc">
      <span className="mono sourd">Adaptation — tout le site</span>
      <div className="rang" style={{ gap: "var(--space-inline-sm)" }}>
        {CHOIX.map(([a, nom]) => (
          <button key={a} className={`bouton ${adaptation === a ? "on" : ""}`} onClick={() => changer(a)}>{nom}</button>
        ))}
      </div>
    </div>
  );
}
