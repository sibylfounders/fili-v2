"use client";
import { useEffect, useState } from "react";

/* Le thème est un réglage de theming GLOBAL — jamais page par page
   (décision d'Auteur, 23 août) : Clair, Système (défaut — le sombre
   s'active sur la préférence du système, règle C13), Sombre. Posé en
   attribut sur <html> (valeurs API : light / dark), résolu par les
   jetons de tokens.css (une valeur par thème et par rôle, règle C12),
   mémorisé d'une page et d'une visite à l'autre. */

const CLE = "kit-theme";
export type Thème = "light" | "system" | "dark";

const lire = (): Thème => {
  if (typeof document === "undefined") return "system";
  const t = document.documentElement.dataset.theme;
  return t === "light" || t === "dark" ? t : "system";
};

export function useTheme() {
  const [theme, setTheme] = useState<Thème>("system");
  useEffect(() => {
    setTheme(lire());
    const mo = new MutationObserver(() => setTheme(lire()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);
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
  const { theme, changer } = useTheme();
  const CHOIX: [Thème, string][] = [["light", "Clair"], ["system", "Système"], ["dark", "Sombre"]];
  return (
    <div className="bloc">
      <span className="mono sourd">Thème — tout le site</span>
      <div className="rang" style={{ gap: "var(--space-inline-sm)" }}>
        {CHOIX.map(([t, nom]) => (
          <button key={t} className={`bouton ${theme === t ? "on" : ""}`} onClick={() => changer(t)}>{nom}</button>
        ))}
      </div>
    </div>
  );
}
