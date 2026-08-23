"use client";
import { useEffect, useState } from "react";

/* Le thème est un réglage de theming global : Clair, Système (défaut — le
   sombre s'active sur la préférence du système, règle C13), Sombre. Posé
   en attribut sur <html>, résolu par les jetons --c-* de tokens.css
   (une valeur par thème et par rôle, règle C12), mémorisé d'une page et
   d'une visite à l'autre. Tant que la palette n'est pas généralisée au
   site (accord d'Auteur attendu), il n'agit pleinement que sur la page
   Couleur, seule branchée sur la famille réelle. */

const CLE = "kit-theme";
export type Thème = "clair" | "systeme" | "sombre";

const lire = (): Thème => {
  if (typeof document === "undefined") return "systeme";
  const t = document.documentElement.dataset.theme;
  return t === "clair" || t === "sombre" ? t : "systeme";
};

export function useTheme() {
  const [theme, setTheme] = useState<Thème>("systeme");
  useEffect(() => {
    setTheme(lire());
    const mo = new MutationObserver(() => setTheme(lire()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);
  const changer = (t: Thème) => {
    if (t === "systeme") delete document.documentElement.dataset.theme;
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
  const CHOIX: [Thème, string][] = [["clair", "Clair"], ["systeme", "Système"], ["sombre", "Sombre"]];
  return (
    <div className="bloc">
      <span className="mono sourd">Thème — clair / sombre</span>
      <div className="rang" style={{ gap: "var(--rr-inline-sm)" }}>
        {CHOIX.map(([t, nom]) => (
          <button key={t} className={`bouton ${theme === t ? "on" : ""}`} onClick={() => changer(t)}>{nom}</button>
        ))}
      </div>
    </div>
  );
}
