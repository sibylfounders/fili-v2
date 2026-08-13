"use client";
// Composant interactif : hooks, contexte ou primitive Radix au niveau module.
// Sans cette directive, une page serveur qui importe le baril @fili/react casse
// (createContext évalué dans le graphe RSC).
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../lib/cn";

/**
 * Brand — verrou logo + nom de produit (lockup) pour la tête du rail de navigation.
 * Compound : Brand.Root (conteneur, `asChild` pour en faire un lien vers l'accueil),
 * Brand.Logo (marque, SVG en currentColor, teinté `primary`), Brand.Text (nom du produit).
 *
 * Le SÉLECTEUR DE SITE (passer d'un site à l'autre) est un Select — composant distinct, lot D
 * (hors périmètre DS-MD à cette date). Le brancher À CÔTÉ de Brand dans la tête du rail, pas dedans.
 */
const BrandRoot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div";
  return <Comp ref={ref} className={cn("inline-flex items-center gap-sm min-w-0", className)} {...props} />;
});
BrandRoot.displayName = "Brand.Root";

const BrandLogo = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn("inline-flex shrink-0 text-primary [&>svg]:size-6", className)}
      {...props}
    />
  ),
);
BrandLogo.displayName = "Brand.Logo";

const BrandText = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cn("font-sans font-medium text-text-primary truncate", className)} {...props} />
  ),
);
BrandText.displayName = "Brand.Text";

export const Brand = Object.assign(BrandRoot, { Root: BrandRoot, Logo: BrandLogo, Text: BrandText });
export { BrandRoot, BrandLogo, BrandText };
