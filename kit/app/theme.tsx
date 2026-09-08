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

const KEY = "kit-theme";
export type Thème = "light" | "system" | "dark";

const read = (): Thème => {
  const t = document.documentElement.dataset.theme;
  return t === "light" || t === "dark" ? t : "system";
};

const subscribe = (cb: () => void) => {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
};

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, read, () => "system" as Thème);
  const changer = (t: Thème) => {
    if (t === "system") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = t;
    try { localStorage.setItem(KEY, t); } catch {}
  };
  return { theme, changer };
}

/* La préférence du système, écoutée en direct — pour savoir quel thème
   « Système » résout réellement (et re-mesurer les paires au changement). */
export function useSchemeSystem() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setDark(mq.matches);
    const follow = (e: MediaQueryListEvent) => setDark(e.matches);
    mq.addEventListener("change", follow);
    return () => mq.removeEventListener("change", follow);
  }, []);
  return dark;
}

export function Theme() {
  const { changer } = useTheme();
  const CHOICE: [Thème, string][] = [["light", "Clair"], ["system", "Système"], ["dark", "Sombre"]];
  return (
    <div className="block">
      <span className="mono muted">Thème — tout le site</span>
      <div className="rank" style={{ gap: "var(--gap-3-inline)" }}>
        {CHOICE.map(([t, name]) => (
          /* le bouton actif est dessiné en CSS depuis <html data-theme> —
             juste dès la première peinture, sans attendre l'hydratation */
          <button key={t} data-choice-theme={t} className="button" onClick={() => changer(t)}>{name}</button>
        ))}
      </div>
    </div>
  );
}
