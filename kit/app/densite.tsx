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

const CLE = "kit-density";
export type Densité = "airy" | "comfortable" | "compact";

const lire = (): Densité => {
  const d = document.documentElement.dataset.density;
  return d === "compact" || d === "airy" ? d : "comfortable";
};

const abonner = (cb: () => void) => {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-density"] });
  return () => mo.disconnect();
};

export function useDensite() {
  const densite = useSyncExternalStore(abonner, lire, () => "comfortable" as Densité);
  const changer = (d: Densité) => {
    if (d === "comfortable") delete document.documentElement.dataset.density;
    else document.documentElement.dataset.density = d;
    try { localStorage.setItem(CLE, d); } catch {}
  };
  return { densite, changer };
}

export function Densite() {
  const { changer } = useDensite();
  const CHOIX: [Densité, string][] = [["airy", "Aéré"], ["comfortable", "Confortable"], ["compact", "Compact"]];
  return (
    <div className="bloc">
      <span className="mono sourd">Densité — tout le site</span>
      <div className="rang" style={{ gap: "var(--space-inline-sm)" }}>
        {CHOIX.map(([d, nom]) => (
          /* bouton actif dessiné en CSS depuis <html data-density> */
          <button key={d} data-choix-density={d} className="bouton" onClick={() => changer(d)}>{nom}</button>
        ))}
      </div>
    </div>
  );
}
