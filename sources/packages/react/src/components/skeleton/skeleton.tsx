import * as React from "react";
import { cn } from "../../lib/cn";
import "./skeleton.css";

/**
 * Skeleton — placeholder de chargement (DS-MD : l'attente montre la STRUCTURE, jamais un
 * spinner plein écran). Deux usages :
 *  1. autonome : `<Skeleton variant="block|text|circle" width height />` pour composer un
 *     squelette sur mesure (cf. Card.Skeleton, le précédent canonique) ;
 *  2. intégré : la prop `loading` des composants (Button, Input, Select, Switch, Card…)
 *     rend le composant EN squelette à ses dimensions réelles — la classe `.ds-skeleton`
 *     éteint couleurs/relief et masque le contenu, la géométrie reste celle du composant.
 *
 * `aria-hidden` : le squelette n'est jamais annoncé — l'état de chargement se déclare sur
 * la région qui l'héberge (`aria-busy`), pas sur chaque brique.
 */
export interface SkeletonProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "block" | "text" | "circle";
  width?: number | string;
  height?: number | string;
  /** variant="text" : nombre de lignes (la dernière est raccourcie). */
  lines?: number;
}

export function Skeleton({
  variant = "block",
  width,
  height,
  lines,
  className,
  style,
  ...props
}: SkeletonProps) {
  if (variant === "text" && (lines ?? 1) > 1) {
    return (
      <span
        aria-hidden="true"
        className={cn("flex w-full flex-col gap-2", className)}
        style={{ width, ...style }}
        {...props}
      >
        {Array.from({ length: lines! }, (_, i) => (
          <span
            key={i}
            className="ds-skeleton block h-3 rounded-sm"
            style={{ width: i === lines! - 1 ? "60%" : "100%", height }}
          />
        ))}
      </span>
    );
  }
  return (
    <span
      aria-hidden="true"
      className={cn(
        "ds-skeleton inline-block",
        variant === "circle" ? "rounded-pill" : variant === "text" ? "h-3 rounded-sm" : "rounded-md",
        className,
      )}
      style={{ width, height, ...style }}
      {...props}
    />
  );
}
Skeleton.displayName = "Skeleton";
