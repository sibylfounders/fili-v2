import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

/**
 * Divider — séparateur (DS-MD : l'ESPACE d'abord via SPACING, le trait en DERNIER recours via BORDER).
 * Trait fin `border` (jamais `border-strong`, réservé à ce qui délimite un composant interactif).
 * Décoratif par défaut (aria-hidden, role="none") ; sémantique via `decorative={false}` → role="separator".
 */
export const dividerVariants = cva("shrink-0 bg-border", {
  variants: {
    orientation: {
      horizontal: "h-px w-full",
      vertical: "w-px self-stretch",
    },
  },
  defaultVariants: { orientation: "horizontal" },
});

export interface DividerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dividerVariants> {
  /** true (défaut) = purement visuel ; false = séparateur sémantique annoncé aux lecteurs d'écran. */
  decorative?: boolean;
}

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
    <div
      ref={ref}
      role={decorative ? "none" : "separator"}
      aria-orientation={decorative ? undefined : orientation ?? "horizontal"}
      className={cn(dividerVariants({ orientation }), className)}
      {...props}
    />
  ),
);
Divider.displayName = "Divider";
