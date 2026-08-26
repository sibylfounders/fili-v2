"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Primaire } from "./primaire";
import { Theme } from "./theme";
import { Densite } from "./densite";
import { Adaptation } from "./adaptation";

/* Le tiroir de réglages — l'ancien panneau « Theming & playground »,
   replié derrière une poignée (gabarit documentaire nu, 24 août : un
   outil qui ne sert qu'une fois n'occupe pas l'écran en permanence).
   Mêmes réglages, mêmes mécaniques globales (attributs sur <html>,
   mémorisés) ; seule la présence à l'écran change.
   Ne s'affiche pour l'instant que sur la page Rythme — Typographie et
   Couleur le recevront à leur passe, une page à la fois. */
const PAGES = ["/", "/rythme", "/typo", "/couleur", "/composition", "/arrondis"];

export function Tiroir() {
  const chemin = usePathname();
  const [ouvert, setOuvert] = useState(false);
  const panneau = useRef<HTMLDivElement>(null);
  const poignee = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!ouvert) return;
    panneau.current?.focus();
    const clavier = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOuvert(false); poignee.current?.focus(); }
    };
    const dehors = (e: PointerEvent) => {
      const c = e.target as Node;
      if (panneau.current && !panneau.current.contains(c) && !poignee.current?.contains(c)) setOuvert(false);
    };
    window.addEventListener("keydown", clavier);
    window.addEventListener("pointerdown", dehors);
    return () => {
      window.removeEventListener("keydown", clavier);
      window.removeEventListener("pointerdown", dehors);
    };
  }, [ouvert]);

  if (!chemin || !PAGES.includes(chemin)) return null;
  return (
    <>
      <button ref={poignee} type="button" className="tiroir-poignee"
        aria-expanded={ouvert} aria-controls="tiroir-reglages"
        onClick={() => setOuvert(!ouvert)}>
        Réglages <span aria-hidden="true">{ouvert ? "×" : "›"}</span>
      </button>
      {ouvert && (
        <div id="tiroir-reglages" ref={panneau} tabIndex={-1} role="dialog"
          aria-label="Réglages — theming du site" className="tiroir">
          <div className="tiroir-tete">
            <h3>Theming — tout le site</h3>
            <button className="bouton" onClick={() => { setOuvert(false); poignee.current?.focus(); }}>Fermer</button>
          </div>
          <Primaire />
          <Theme />
          <Densite />
          <Adaptation />
          <p className="sourd" style={{ fontSize: "0.75rem" }}>
            Chaque réglage porte le site entier, cette page comprise, et se
            souvient de votre choix.
          </p>
        </div>
      )}
    </>
  );
}
