"use client";
import { useEffect, useState, useSyncExternalStore } from "react";

/* Le thème est un réglage de theming GLOBAL — jamais page par page
   (décision d'Auteur, 23 août) : Clair, Système (défaut — le sombre
   s'active sur la préférence du système, règle C13), Sombre. Posé en
   attribut sur <html> (valeurs API : light / dark), résolu par les
   jetons de tokens.css (une valeur par thème et par rôle, règle C12),
   mémorisé d'une page et d'une visite à l'autre.

   L'état est lu depuis <html> par useSyncExternalStore : le script de
   layout.tsx pose l'attribut avant toute peinture, et React se cale
   dessus PENDANT l'hydratation — le réglage affiché ne repasse jamais
   par sa valeur par défaut au chargement (le « flash » du 23 août). */

const CLE = "kit-theme";
export type Thème = "light" | "system" | "dark";

const lire = (): Thème => {
  const t = document.documentElement.dataset.theme;
  return t === "light" || t === "dark" ? t : "system";
};

const abonner = (cb: () => void) => {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
};

export function useTheme() {
  const theme = useSyncExternalStore(abonner, lire, () => "system" as Thème);
  const changer = (t: Thème) => {
    if (t === "system") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = t;
    try { localStorage.setItem(CLE, t); } catch {}
  };
  return { theme, changer };
}

/* La préférence du système, écoutée en direct — pour savoir quel thème
   « Système » résout réellement (et re-mesurer les paires au changement). */
export function useSchemeSysteme() {
  const [sombre, setSombre] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setSombre(mq.matches);
    const suivre = (e: MediaQueryListEvent) => setSombre(e.matches);
    mq.addEventListener("change", suivre);
    return () => mq.removeEventListener("change", suivre);
  }, []);
  return sombre;
}

export function Theme() {
  const { changer } = useTheme();
  const CHOIX: [Thème, string][] = [["light", "Clair"], ["system", "Système"], ["dark", "Sombre"]];
  return (
    <div className="bloc">
      <span className="mono sourd">Thème — tout le site</span>
      <div className="rang" style={{ gap: "var(--gap-3-inline)" }}>
        {CHOIX.map(([t, nom]) => (
          /* le bouton actif est dessiné en CSS depuis <html data-theme> —
             juste dès la première peinture, sans attendre l'hydratation */
          <button key={t} data-choix-theme={t} className="bouton" onClick={() => changer(t)}>{nom}</button>
        ))}
      </div>
    </div>
  );
}
