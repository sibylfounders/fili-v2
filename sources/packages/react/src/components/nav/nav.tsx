"use client";
// Composant interactif : asChild (Radix Slot) au niveau module — même précaution RSC que Button.
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../lib/cn";

/**
 * Nav — navigation latérale (DS-MD pattern navigation). Landmark <nav> ÉTIQUETÉ + liste de destinations.
 * Compound : Nav (landmark) / Nav.List (ul) / Nav.Link (li>a) / Nav.GroupLabel (tête de groupe).
 *
 * FACTURE UNIQUE (harmonisation 2026-07-29) : la rangée de nav est définie ICI
 * (`navRowClass`) et consommée par la nav intégrée d'AppLayout ET par les navs de
 * sections des sites — plus aucune recopie locale des classes (verifie-consommation).
 *
 * L'état « page courante » est porté par Nav.Link (`current`) : `aria-current="page"` +
 * lavis `primary-subtle` + poids medium, un seul à la fois. Le regroupement REPLIABLE se
 * fait avec Accordion ; la simple tête de groupe est Nav.GroupLabel.
 * `asChild` rend l'élément enfant à la place du <a> (next/link, bouton de sélection…) —
 * l'enfant compose alors lui-même son contenu (icône + libellé tronqué).
 */

/** LA rangée de navigation — une seule définition pour tout le système. */
export const navRowClass = (current?: boolean, className?: string) =>
  cn(
    "group flex w-full items-center gap-2.5 rounded-md px-sm py-1.5 text-left text-sm no-underline transition-colors duration-fast ease-out",
    "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--control-focus-color)]",
    current
      ? "bg-primary-subtle font-medium text-on-primary-subtle"
      : "text-text-secondary hover:bg-surface-hover hover:text-text-primary",
    className,
  );

/** La typographie de tête de groupe seule (pour un conteneur qui gère déjà marges/padding). */
export const navGroupLabelTextClass =
  "font-label text-2xs font-semibold uppercase tracking-wider text-text-muted";
/** LA tête de groupe de navigation — consommée par AppLayout et les sites. */
export const navGroupLabelClass = "mb-1 px-sm " + navGroupLabelTextClass;

export interface NavProps extends React.HTMLAttributes<HTMLElement> {
  /** Étiquette du repère (obligatoire) — distincte si plusieurs nav coexistent. */
  label: string;
}
export function NavRoot({ label, className, children, ...props }: NavProps) {
  return (
    <nav aria-label={label} className={cn(className)} {...props}>
      {children}
    </nav>
  );
}
NavRoot.displayName = "Nav.Root";

export function NavList({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) {
  return <ul className={cn("m-0 flex list-none flex-col gap-0.5 p-0", className)} {...props} />;
}
NavList.displayName = "Nav.List";

export function NavGroupLabel({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn(navGroupLabelClass, className)} {...props} />;
}
NavGroupLabel.displayName = "Nav.GroupLabel";

export interface NavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  current?: boolean;
  /** Rend l'élément enfant à la place du <a> (next/link, bouton…) — Radix Slot. */
  asChild?: boolean;
  /** Icône/emblème optionnel (slot 16px), rendu avant le libellé (hors asChild). */
  icon?: React.ReactNode;
}
export const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ current, asChild = false, icon, className, children, ...props }, ref) => {
    const Comp: React.ElementType = asChild ? Slot : "a";
    return (
      <li className="list-none">
        <Comp
          ref={ref}
          aria-current={current ? "page" : undefined}
          className={navRowClass(current, className)}
          {...props}
        >
          {asChild ? (
            children
          ) : (
            <>
              {icon ? (
                <span aria-hidden="true" className="flex h-4 w-4 shrink-0 items-center justify-center [&_svg]:h-4 [&_svg]:w-4">
                  {icon}
                </span>
              ) : null}
              <span className="min-w-0 flex-1 truncate">{children}</span>
            </>
          )}
        </Comp>
      </li>
    );
  },
);
NavLink.displayName = "Nav.Link";

export const Nav = Object.assign(NavRoot, {
  Root: NavRoot,
  List: NavList,
  Link: NavLink,
  GroupLabel: NavGroupLabel,
});
