"use client";
// Composant interactif : hooks, contexte ou primitive Radix au niveau module.
// Sans cette directive, une page serveur qui importe le baril @fili/react casse
// (createContext évalué dans le graphe RSC).
import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * AppShell — squelette du shell applicatif à TROIS régions (DS-MD grid 1.2.0 « Shell applicatif ») :
 *   AppShell.Nav  (rail de navigation, début, `grid.rail-nav`)
 *   AppShell.Main (colonne de contenu, flexible — y placer un <Container> pour borner)
 *   AppShell.Tools(rail d'outils, fin, `grid.rail-tools`)
 *
 * ORDRE DE DÉGRADATION (piloté par les screens tablet=1024 / desktop=1280) :
 *   ≥ desktop        : les trois régions coexistent ;
 *   tablet..desktop  : le rail de NAV cède le premier (off-canvas via burger) ;
 *   < tablet         : le rail d'OUTILS cède à son tour (masqué ici).
 *
 * OFF-CANVAS : sous leur seuil, Nav et Tools sont retirés du flux (masqués). Pour les rendre
 * invocables, composez le MÊME contenu dans un <Drawer> (fondation overlay : scrim, focus piégé,
 * scroll-lock, Échap, retour du focus) — p. ex. un bouton hamburger sous tablet qui ouvre
 * <Drawer open={navOpen} onClose={close} side="start">…nav…</Drawer>. AppShell pose la grille
 * permanente ; le Drawer porte la version off-canvas. Cf. fondation DS-MD overlay (RULES-overlay).
 */
const AppShellRoot = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex min-h-screen w-full bg-background text-text-primary", className)} {...props} />
  ),
);
AppShellRoot.displayName = "AppShell.Root";

/** Rail de navigation — visible à partir de `tablet` ; en dessous, retiré du flux (off-canvas différé). */
const AppShellNav = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <nav
      ref={ref}
      className={cn(
        "hidden desktop:flex desktop:flex-col w-rail-nav shrink-0 border-r border-border bg-surface",
        "desktop:sticky desktop:top-0 desktop:h-screen desktop:overflow-y-auto",
        className,
      )}
      {...props}
    />
  ),
);
AppShellNav.displayName = "AppShell.Nav";

/** Colonne de contenu — élément flexible. Placer un <Container> à l'intérieur pour borner/centrer. */
const AppShellMain = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <main ref={ref} className={cn("flex-1 min-w-0 flex flex-col", className)} {...props} />
  ),
);
AppShellMain.displayName = "AppShell.Main";

/** Rail d'outils (secondaire) — visible seulement à partir de `desktop` ; cède avant la nav. */
const AppShellTools = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <aside
      ref={ref}
      className={cn(
        "hidden tablet:flex tablet:flex-col w-rail-tools shrink-0 border-l border-border bg-surface",
        "tablet:sticky tablet:top-0 tablet:h-screen tablet:overflow-y-auto",
        className,
      )}
      {...props}
    />
  ),
);
AppShellTools.displayName = "AppShell.Tools";

export const AppShell = Object.assign(AppShellRoot, {
  Root: AppShellRoot,
  Nav: AppShellNav,
  Main: AppShellMain,
  Tools: AppShellTools,
});
export { AppShellRoot, AppShellNav, AppShellMain, AppShellTools };
