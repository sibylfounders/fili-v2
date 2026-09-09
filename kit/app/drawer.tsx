"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Primary } from "./primary";
import { Theme } from "./theme";
import { Density } from "./density";
import { Adaptation } from "./adaptation";
import { OPEN } from "./pages";

/* Le drawer de réglages — l'ancien panneau « Theming & playground »,
   replié derrière une poignée (gabarit documentaire nu, 24 août : un
   outil qui ne sert qu'une fois n'occupe pas l'écran en permanence).
   Mêmes réglages, mêmes mécaniques globales (attributs sur <html>,
   mémorisés) ; seule la présence à l'écran change.
   Ne s'affiche pour l'instant que sur la page Rythme — Typographie et
   Couleur le recevront à leur passe, une page à la fois. */
/* Les pages du kit viennent de la liste unique (pages.ts, 7 septembre) :
   le drawer n'a plus sa propre liste à tenir à jour. */
const PAGES = ["/", ...OPEN.map((pg) => pg.path!)];

export function Drawer() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const handle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    panel.current?.focus();
    const keyboard = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); handle.current?.focus(); }
    };
    const outside = (e: PointerEvent) => {
      const c = e.target as Node;
      if (panel.current && !panel.current.contains(c) && !handle.current?.contains(c)) setOpen(false);
    };
    window.addEventListener("keydown", keyboard);
    window.addEventListener("pointerdown", outside);
    return () => {
      window.removeEventListener("keydown", keyboard);
      window.removeEventListener("pointerdown", outside);
    };
  }, [open]);

  if (!path || !PAGES.includes(path)) return null;
  return (
    <>
      <button ref={handle} type="button" className="drawer-handle"
        aria-expanded={open} aria-controls="drawer-settings"
        onClick={() => setOpen(!open)}>
        Réglages <span aria-hidden="true">{open ? "×" : "›"}</span>
      </button>
      {open && (
        <div id="drawer-settings" ref={panel} tabIndex={-1} role="dialog"
          aria-label="Réglages — theming du site" className="drawer">
          <div className="drawer-head">
            <h3>Theming — tout le site</h3>
            <button className="button" onClick={() => { setOpen(false); handle.current?.focus(); }}>Fermer</button>
          </div>
          <Primary />
          <Theme />
          <Density />
          <Adaptation />
          <p className="muted" style={{ fontSize: "0.75rem" }}>
            Chaque réglage porte le site entier, cette page comprise, et se
            souvient de votre choix.
          </p>
        </div>
      )}
    </>
  );
}
