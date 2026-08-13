"use client";
import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * SkipLink — « Aller au contenu » (DS-MD pattern navigation, WCAG 2.4.1). Premier élément focalisable de
 * la page, MASQUÉ visuellement jusqu'au focus, puis visible ; déplace le focus vers le <main> (cible `href`).
 * À placer tout en haut de l'AppShell, avant la nav.
 *
 * À l'activation, le FOCUS est déplacé PROGRAMMATIQUEMENT sur la cible (tabIndex -1 posé au besoin) —
 * le saut d'ancre seul ne suffit pas : sans focus déplacé, le Tab suivant repartait du haut de la page,
 * ce qui annulait le bénéfice du lien (correctif 2026-07-29).
 */
export interface SkipLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}
export function SkipLink({ href = "#main", className, children = "Aller au contenu", onClick, ...props }: SkipLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || !href.startsWith("#")) return;
    const target = document.getElementById(href.slice(1));
    if (!target) return;
    e.preventDefault();
    if (!target.hasAttribute("tabindex") && target.tabIndex < 0) target.tabIndex = -1;
    target.focus();
    // Même garde que Select : `scrollIntoView` suppose une mise en page (absent de jsdom).
    // Le DÉPLACEMENT DU FOCUS, lui, est le contrat du composant — il reste inconditionnel.
    target.scrollIntoView?.({ block: "start" });
  };
  return (
    <a
      href={href}
      onClick={handleClick}
      className={cn(
        "sr-only",
        "focus:not-sr-only focus:fixed focus:left-md focus:top-md focus:z-sticky",
        "focus:rounded-md focus:border focus:border-border-strong focus:bg-background focus:px-md focus:py-2",
        "focus:text-sm focus:font-medium focus:text-text-primary focus:shadow-overlay",
        "focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[color:var(--control-focus-color)]",
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}
SkipLink.displayName = "SkipLink";
