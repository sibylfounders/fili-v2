"use client";
import { useSyncExternalStore } from "react";

/* Le réglage de stack — fichier renommé le 9 septembre 2026 : « adaptation »
   est le nom d'une famille (/adaptation). Le 11 septembre, l'attribut et
   l'API suivent : <html data-stack>, useStack, <Stack /> — le mot est rendu
   à la couche qui pose zones, posture et segments sur la page (adaptive.tsx).
   Le stack est un réglage de theming global : Tailwind (défaut),
   shadcn (géométrie shadcn/ui — rayons md, contrôles h-9 ; la couleur
   vient toujours de la famille, dans les deux thèmes), HTML natif
   (décimales calculées, valeurs fluides). Mémorisé d'une page et d'une
   visite à l'autre.

   État lu depuis <html> par useSyncExternalStore, calé pendant
   l'hydratation : le réglage affiché ne repasse jamais par sa valeur
   par défaut au chargement. */

const KEY = "kit-stack";
export type StackName = "tailwind" | "shadcn" | "html";

const read = (): StackName => {
  const a = document.documentElement.dataset.stack;
  return a === "shadcn" || a === "html" ? a : "tailwind";
};

const subscribe = (cb: () => void) => {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-stack"] });
  return () => mo.disconnect();
};

export function useStack() {
  const stack = useSyncExternalStore(subscribe, read, () => "tailwind" as StackName);
  const changer = (a: StackName) => {
    if (a === "tailwind") delete document.documentElement.dataset.stack;
    else document.documentElement.dataset.stack = a;
    try { localStorage.setItem(KEY, a); } catch {}
  };
  const styl = stack === "shadcn" ? "shadcn" : stack === "html" ? "HTML natif" : "Tailwind";
  const tw = stack !== "html"; /* shadcn vit sur Tailwind : mêmes accrochages 4-16 */
  return { stack, changer, styl, tw };
}

export function Stack() {
  const { changer } = useStack();
  const CHOICE: [StackName, string][] = [["tailwind", "Tailwind"], ["shadcn", "shadcn"], ["html", "HTML natif"]];
  return (
    <div className="block">
      <span className="mono muted">Stack — tout le site</span>
      <div className="rank" style={{ gap: "var(--gap-3-inline)" }}>
        {CHOICE.map(([a, name]) => (
          /* bouton actif dessiné en CSS depuis <html data-stack> */
          <button key={a} data-choice-stack={a} className="button" onClick={() => changer(a)}>{name}</button>
        ))}
      </div>
    </div>
  );
}
