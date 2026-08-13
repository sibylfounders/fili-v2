"use client";
// Composant interactif : hooks, contexte ou primitive Radix au niveau module.
// Sans cette directive, une page serveur qui importe le baril @fili/react casse
// (createContext évalué dans le graphe RSC).
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

/**
 * Container — cadre de page (DS-MD grid). Borne la largeur à l'un des trois crans ET centre
 * (`margin-inline: auto`), ou laisse le contenu en pleine largeur (`full`). La marge de page dérive
 * de SPACING : resserrée en régime mobile (`md`), plus large au-dessus de breakpoint.mobile (`lg`).
 *
 * Le cran suit le CONTEXTE, pas l'esthétique : un formulaire reste `narrow` même s'il « aurait la place ».
 * `full` n'est pas un oubli de max-width : c'est une intention (des blocs internes peuvent, eux, se re-borner).
 * `asChild` (Radix Slot) pour appliquer le cadre à un élément sémantique (main, section…).
 */
export const containerVariants = cva("w-full mx-auto px-md mobile:px-lg", {
  variants: {
    size: {
      narrow: "max-w-container-narrow",
      default: "max-w-container-default",
      wide: "max-w-container-wide",
      full: "max-w-none",
    },
  },
  defaultVariants: { size: "default" },
});

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  asChild?: boolean;
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return <Comp ref={ref} className={cn(containerVariants({ size }), className)} {...props} />;
  },
);
Container.displayName = "Container";
