"use client";
import { useSyncExternalStore } from "react";
import { derived, toCss, PRIMARY_DEFAULTS } from "../derivation.mjs";

/* Primary est LE réglage de theming de tête — la décision d'entrée dont
   toute la famille couleur se calcule (kit/derivation.mjs). Global, comme
   le thème et la densité : la feuille dérivée est injectée sur <html>
   (style #kit-primaire, après tokens.css, mêmes sélecteurs — elle couvre
   les deux thèmes), l'hex vit en attribut data-primary, et le tout est
   mémorisé d'une visite à l'autre. Au chargement, le script de layout.tsx
   réinjecte la feuille EN CACHE avant la première peinture : aucun flash,
   aucune dérivation au boot. À la primaire de la charte, la feuille est
   retirée : les tokens générés de tokens.css font foi. */

const KEY = "kit-primary";
const KEY_CSS = "kit-primary-css";

const read = (): string => document.documentElement.dataset.primary ?? PRIMARY_DEFAULTS;

const subscribe = (cb: () => void) => {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-primary"] });
  return () => mo.disconnect();
};

export function usePrimary() {
  const primary = useSyncExternalStore(subscribe, read, () => PRIMARY_DEFAULTS);
  const changer = (hex: string) => {
    const h = hex.toUpperCase();
    if (h === PRIMARY_DEFAULTS) {
      document.getElementById("kit-primary")?.remove();
      delete document.documentElement.dataset.primary;
      try { localStorage.removeItem(KEY); localStorage.removeItem(KEY_CSS); } catch {}
      return;
    }
    const css = toCss(derived(h), h);
    let st = document.getElementById("kit-primary");
    if (!st) { st = document.createElement("style"); st.id = "kit-primary"; document.head.appendChild(st); }
    st.textContent = css;
    document.documentElement.dataset.primary = h;
    try { localStorage.setItem(KEY, h); localStorage.setItem(KEY_CSS, css); } catch {}
  };
  return { primary, changer };
}

export function Primary() {
  const { primary, changer } = usePrimary();
  return (
    <div className="block">
      <span className="mono muted">Primary — tout le site</span>
      <div className="rank" style={{ gap: "var(--gap-3-inline)" }}>
        <input type="color" value={primary} aria-label="Primary — la décision d'entrée"
          onChange={(e) => changer(e.target.value)}
          style={{ width: "var(--control-height)", height: "var(--control-height)", padding: 0, border: "1px solid var(--border-strong)", borderRadius: "var(--r-ctl)", background: "var(--bg)", cursor: "pointer" }} />
        <span className="mono">{primary}</span>
        {primary !== PRIMARY_DEFAULTS && (
          <button className="button" onClick={() => changer(PRIMARY_DEFAULTS)}>Charte</button>
        )}
      </div>
    </div>
  );
}
