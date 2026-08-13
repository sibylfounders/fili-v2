"use client";
// Composant interactif : asChild (Radix Slot) au niveau module — même précaution RSC que Button.
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";
import "../../lib/focus.css";

/**
 * Chip — le RENVOI COMPACT (CHIP-UX/UI 1.0.0). Pointe vers une entité du système
 * (règle, cas, constat) depuis un contexte dense, en nuée. Promet une destination
 * ou un déplacement de vue — JAMAIS une mutation (ça, c'est Button).
 *
 * Premier composant entré par la tranche verticale du MISSING-COMPONENT-PROTOCOL
 * (fiche chip-renvoi, validée le 2026-07-29) : né de deux implémentations locales
 * des grilles Doctrine, révélées par fili-check.
 *
 * - `variant` : outline (fond de page + filet) / subtle (fond surface, sans filet).
 * - `mono` : identifiants techniques en chasse fixe (CHIP-R05).
 * - `asChild` : porte un <a> (navigation) ou un <button> (déplacement de vue) —
 *   la sémantique suit la cible (CHIP-R06) ; sans asChild, rend un <button type=button>.
 * - PAS de relief ([data-relief] l'ignore — CHIP-U02) : un renvoi, pas un objet pressé.
 */
const chipVariants = cva(
  [
    "inline-flex max-w-full items-center gap-1 rounded-md px-sm py-1 text-xs",
    "no-underline transition-colors duration-fast ease-out cursor-pointer select-none",
    "text-text-secondary outline-none ds-focus-ring",
  ].join(" "),
  {
    variants: {
      variant: {
        outline: "border border-border bg-background hover:border-primary hover:text-text-primary",
        subtle: "border border-transparent bg-surface hover:bg-surface-hover hover:text-text-primary",
      },
      mono: { true: "font-mono", false: "" },
    },
    defaultVariants: { variant: "outline", mono: false },
  },
);

export interface ChipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof chipVariants> {
  /** Rend l'enfant à la place du <button> — un <a> si la chip NAVIGUE (CHIP-R06). */
  asChild?: boolean;
}

const ChipRoot = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, variant, mono, asChild = false, type, ...props }, ref) => {
    const Comp: React.ElementType = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : (type ?? "button")}
        className={cn(chipVariants({ variant, mono }), className)}
        {...props}
      />
    );
  },
);
ChipRoot.displayName = "Chip";

export const Chip = ChipRoot;
export { chipVariants };
