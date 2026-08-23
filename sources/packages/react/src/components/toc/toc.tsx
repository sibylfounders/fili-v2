"use client";
// Composant interactif : hooks, contexte ou primitive Radix au niveau module.
// Sans cette directive, une page serveur qui importe le baril @fili/react casse
// (createContext évalué dans le graphe RSC).
import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * TableOfContents — « sur cette page » (DS-MD pattern navigation). Navigation INTRA-page : liste les
 * sections de la page courante ; l'entrée active SUIT LA LECTURE (scrollspy via IntersectionObserver),
 * marquée `aria-current="location"` + un repère NON CHROMATIQUE (trait latéral + poids). Complète la nav
 * principale, ne la remplace pas. Placée dans le rail d'outils, sous les outils.
 */
export interface TocItem {
  id: string;
  label: string;
}
export interface TableOfContentsProps extends React.HTMLAttributes<HTMLElement> {
  items: TocItem[];
  label?: string;
}
export function TableOfContents({ items, label = "Sur cette page", className, ...props }: TableOfContentsProps) {
  const [active, setActive] = React.useState<string | undefined>(items[0]?.id);
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-64px 0px -70% 0px" },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [items]);
  return (
    <nav aria-label={label} className={cn("flex flex-col gap-0.5", className)} {...props}>
      {items.map((it) => {
        const isActive = active === it.id;
        return (
          <a
            key={it.id}
            href={`#${it.id}`}
            aria-current={isActive ? "location" : undefined}
            className={cn(
              "border-l-2 px-sm py-1 text-sm no-underline transition-colors duration-fast ease-out",
              "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--control-focus-color)]",
              isActive
                ? "border-primary font-medium text-text-primary"
                : "border-transparent text-text-muted hover:text-text-primary",
            )}
          >
            {it.label}
          </a>
        );
      })}
    </nav>
  );
}
TableOfContents.displayName = "TableOfContents";
