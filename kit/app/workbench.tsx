"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import { SURFACES } from "../derivation.mjs";
import { usePrimary } from "./primary";
import { useTheme, useSchemeSystem } from "./theme";
import { Drawer } from "./drawer";
import { SUN, MOON, DEVICE } from "./icons";

/* ── LA BANDE D'ATELIER (11 septembre 2026) — les trois réglages qu'on touche
   sans arrêt, dans l'en-tête, à portée de clic : la couleur, le fond, la
   surface. Le reste vit derrière « ⋯ », dans le drawer, où il était déjà.

   LA SURFACE — une fenêtre, pas une maquette. Un site ne peut pas
   redimensionner la fenêtre où il vit ; il peut redimensionner CELLE QU'IL A
   OUVERTE. Les trois boutons ouvrent donc une seule fenêtre — « le banc » —
   et la redimensionnent au clic suivant : vraie surface, vraies requêtes de
   média et de conteneur, vraie posture, sans rechargement. La fenêtre du banc
   se reconnaît (window.name) et se redimensionne elle-même : on pilote de là
   où on regarde.

   CE QU'ELLE NE FAIT PAS : le pli. Les segments de viewport viennent du
   navigateur, jamais d'une page — un quatrième bouton « pliable » donnerait
   les dimensions d'un Fold sans sa frontière, c'est-à-dire une posture fausse.
   Le pli reste à DevTools (Galaxy Fold · écran double) pour l'œil, et à
   l'épreuve `tests/postures.test.mjs` pour la mesure, qui le passe à chaque
   course.

   LES SIGNES vivent dans icons.tsx — dessinés d'après Lucide, recopiés. ── */

const BANC = "fili-banc";

/* La surface en cours, écoutée sur la fenêtre — la clé de la surface dont la largeur est celle de la
   fenêtre, ou rien. On lit la clé et non la largeur : la bande ne se redessine que quand la réponse
   change, pas à chaque pixel d'un redimensionnement. */
const matching = (w: number) => (Object.keys(SURFACES) as (keyof typeof SURFACES)[]).find((k) => Math.abs(w - SURFACES[k].w) < 2) ?? null;
const useSurface = () => useSyncExternalStore(
  (cb) => { window.addEventListener("resize", cb); return () => window.removeEventListener("resize", cb); },
  () => matching(window.innerWidth), () => null,
);

/* Une fenêtre se pose à une surface INTÉRIEURE : on ajoute l'habillage du
   navigateur, et on ne dépasse jamais l'écran. */
function fit(win: Window, w: number, h: number) {
  const dw = win.outerWidth - win.innerWidth, dh = win.outerHeight - win.innerHeight;
  win.resizeTo(Math.min(w + dw, win.screen.availWidth), Math.min(h + dh, win.screen.availHeight));
}
type Banc = Window & { __filiFit?: (w: number, h: number) => void };

export function Workbench() {
  const { primary, changer: changerPrimary } = usePrimary();
  const { theme, changer: changerTheme } = useTheme();
  const systemDark = useSchemeSystem();
  const surface = useSurface();
  const [here, setHere] = useState(false); /* sommes-nous DANS le banc ? */

  useEffect(() => {
    if (window.name !== BANC) return;
    setHere(true);
    (window as Banc).__filiFit = (w, h) => fit(window, w, h);
  }, []);

  const dark = theme === "dark" || (theme === "system" && systemDark);

  const pose = (key: keyof typeof SURFACES) => {
    const s = SURFACES[key];
    if (here) { fit(window, s.w, s.h); return; }
    const win = window.open(location.pathname, BANC, `width=${s.w},height=${s.h},popup=yes`) as Banc | null;
    if (!win) return; /* fenêtre refusée par le navigateur : rien à faire de plus */
    win.focus();
    /* déjà ouverte : elle se pose elle-même ; tout juste ouverte : on attend qu'elle sache le faire */
    let tries = 0;
    const knock = () => {
      if (win.closed) return;
      if (win.__filiFit) return win.__filiFit(s.w, s.h);
      if (tries++ < 40) setTimeout(knock, 100);
    };
    knock();
  };

  return (
    <div className="wb" role="group" aria-label="Bande d'atelier">
      {/* la couleur : la décision d'entrée, en pastille — le sélecteur du système, comme dans le drawer */}
      <label className="wb-swatch" title={`Couleur — ${primary}`}>
        <span className="wb-chip" style={{ background: primary }} aria-hidden="true" />
        <input type="color" value={primary} aria-label={`Couleur de la marque — ${primary}`}
          onChange={(e) => changerPrimary(e.target.value)} />
      </label>

      {/* le fond : le signe dit où l'on est, l'étiquette dit où l'on va. Pas d'état
          plein ici — un bouton encre signalerait une surface choisie, or il n'y a
          pas de « fond actif » à opposer à un autre : les trois choix (clair,
          système, sombre) vivent dans le drawer. */}
      <button type="button" className="wb-btn"
        aria-label={dark ? "Passer en clair" : "Passer en sombre"} title={dark ? "Sombre" : "Clair"}
        onClick={() => changerTheme(dark ? "light" : "dark")}>
        {dark ? MOON : SUN}
      </button>

      {/* les appareils : un groupe, parce qu'ils se retirent ensemble quand la bande n'a plus la place */}
      <span className="wb-devices">
      <span className="wb-sep" aria-hidden="true" />

      {(Object.keys(SURFACES) as (keyof typeof SURFACES)[]).map((key) => {
        const s = SURFACES[key];
        return (
          <button key={key} type="button" className="wb-btn" onClick={() => pose(key)}
            aria-pressed={surface === key}
            aria-label={`${s.name} — ${s.w} × ${s.h}`} title={`${s.name} · ${s.w} × ${s.h}`}>
            {DEVICE[key]}
          </button>
        );
      })}
      </span>

      {/* le reste des réglages — densité, stack, banc des postures — derrière « ⋯ » */}
      <Drawer />
    </div>
  );
}
