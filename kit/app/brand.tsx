"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

/* ── La marque de la bande du site : « Kit » et sa devise (verdict d'Auteur,
   8 septembre 2026) — cliquer dessus, c'est revenir à l'accueil. Un seul
   lien pour les deux mots, par le routeur (la page change sans recharger).
   Sur l'accueil même, ce n'est pas un lien : on ne propose pas d'aller là
   où l'on est déjà (la règle du menu, 2 septembre). ── */
export function Brand() {
  const here = usePathname() === "/";
  const inside = (
    <>
      <b>Kit</b>
      <span className="muted" style={{ fontSize: "var(--font-size-small)" }}>
        un design system qui montre ses raisons
      </span>
    </>
  );
  if (here) return <span className="chrome-brand" aria-current="page">{inside}</span>;
  return <Link className="chrome-brand" href="/" title="Revenir à l'accueil">{inside}</Link>;
}
