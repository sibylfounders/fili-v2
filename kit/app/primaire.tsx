"use client";
import { useSyncExternalStore } from "react";
import { derive, versCss, PRIMAIRE_DEFAUT } from "../derivation.mjs";

/* Primary est LE réglage de theming de tête — la décision d'entrée dont
   toute la famille couleur se calcule (kit/derivation.mjs). Global, comme
   le thème et la densité : la feuille dérivée est injectée sur <html>
   (style #kit-primaire, après tokens.css, mêmes sélecteurs — elle couvre
   les deux thèmes), l'hex vit en attribut data-primary, et le tout est
   mémorisé d'une visite à l'autre. Au chargement, le script de layout.tsx
   réinjecte la feuille EN CACHE avant la première peinture : aucun flash,
   aucune dérivation au boot. À la primaire de la charte, la feuille est
   retirée : les jetons générés de tokens.css font foi. */

const CLE = "kit-primary";
const CLE_CSS = "kit-primary-css";

const lire = (): string => document.documentElement.dataset.primary ?? PRIMAIRE_DEFAUT;

const abonner = (cb: () => void) => {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-primary"] });
  return () => mo.disconnect();
};

export function usePrimaire() {
  const primaire = useSyncExternalStore(abonner, lire, () => PRIMAIRE_DEFAUT);
  const changer = (hex: string) => {
    const h = hex.toUpperCase();
    if (h === PRIMAIRE_DEFAUT) {
      document.getElementById("kit-primaire")?.remove();
      delete document.documentElement.dataset.primary;
      try { localStorage.removeItem(CLE); localStorage.removeItem(CLE_CSS); } catch {}
      return;
    }
    const css = versCss(derive(h), h);
    let st = document.getElementById("kit-primaire");
    if (!st) { st = document.createElement("style"); st.id = "kit-primaire"; document.head.appendChild(st); }
    st.textContent = css;
    document.documentElement.dataset.primary = h;
    try { localStorage.setItem(CLE, h); localStorage.setItem(CLE_CSS, css); } catch {}
  };
  return { primaire, changer };
}

export function Primaire() {
  const { primaire, changer } = usePrimaire();
  return (
    <div className="bloc">
      <span className="mono sourd">Primary — tout le site</span>
      <div className="rang" style={{ gap: "var(--space-inline-sm)" }}>
        <input type="color" value={primaire} aria-label="Primary — la décision d'entrée"
          onChange={(e) => changer(e.target.value)}
          style={{ width: "var(--control-height)", height: "var(--control-height)", padding: 0, border: "1px solid var(--border-strong)", borderRadius: "var(--radius)", background: "var(--bg)", cursor: "pointer" }} />
        <span className="mono">{primaire}</span>
        {primaire !== PRIMAIRE_DEFAUT && (
          <button className="bouton" onClick={() => changer(PRIMAIRE_DEFAUT)}>Charte</button>
        )}
      </div>
    </div>
  );
}
