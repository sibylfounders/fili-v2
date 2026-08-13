"use client";
// Composant interactif : hooks, contexte ou primitive Radix au niveau module.
// Sans cette directive, une page serveur qui importe le baril @fili/react casse
// (createContext évalué dans le graphe RSC).
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";
import "../../lib/interaction.css";
import { warnStyleAlias, type ButtonVariant } from "../button/button";
import "../../lib/focus.css";
import "../button/relief.css";

/**
 * CompactButton — bouton ICON-ONLY pour les espaces contraints (fermer, développer,
 * supprimer en ligne…). Version compacte de <Button> : mêmes axes orthogonaux
 * `variant` (facture) × `tone` (intention) que Button, en carré et sans label.
 *
 * - `size` : sm (20px) / md (24px) — cible tactile à étendre à 44px en usage (hit area).
 * - `fullRadius` : cercle (true) vs arrondi (false).
 * - Icône OBLIGATOIRE + `aria-label` obligatoire (WCAG — icône seule sans exception).
 *
 * `style` = alias déprécié de `variant` (cf. Button / Fili Component Contract 1.0.0).
 * Focus ring : anneau unique BORDER via .ds-focus-ring (accent, tokens --control-focus-*).
 */
const compactButtonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center select-none",
    "outline-none ds-focus-ring",
    // Mêmes couches partagées que Button : transition + pression (ds-pressable), état
    // indisponible tokenisé (ds-inert). cursor-not-allowed vient de ds-inert ; PAS de
    // pointer-events-none, qui masquerait le curseur.
    "ds-pressable ds-inert",
  ].join(" "),
  {
    variants: {
      variant: { filled: "", stroke: "border", lighter: "", ghost: "" },
      // Anneau de focus accordé au tone en teinte subtile (focus v2) — géométrie ds-focus-ring.
      tone: {
        primary: "",
        neutral: "[--control-focus-color:var(--control-focus-neutral)]",
        destructive: "[--control-focus-color:var(--control-focus-danger)]",
      },
      size: { sm: "size-5 [&_svg]:size-4", md: "size-6 [&_svg]:size-5" },
      fullRadius: { true: "rounded-pill", false: "rounded-button" },
    },
    // Même mapping de tokens que Button (l'icône hérite de la couleur du texte).
    compoundVariants: [
      { variant: "filled", tone: "primary", class: "bg-primary text-on-primary hover:bg-primary-hover" },
      { variant: "filled", tone: "neutral", class: "bg-surface-inverse text-text-inverse hover:opacity-90" },
      { variant: "filled", tone: "destructive", class: "bg-danger text-on-danger hover:bg-danger-hover" },
      { variant: "stroke", tone: "primary", class: "border-primary text-primary hover:bg-primary-subtle hover:text-on-primary-subtle" },
      { variant: "stroke", tone: "neutral", class: "border-border-strong text-text-primary hover:bg-surface" },
      { variant: "stroke", tone: "destructive", class: "border-danger text-danger hover:bg-danger-subtle" },
      { variant: "lighter", tone: "primary", class: "bg-primary-subtle text-on-primary-subtle hover:bg-primary-subtle-hover" },
      { variant: "lighter", tone: "neutral", class: "bg-surface text-text-primary hover:bg-surface-hover" },
      { variant: "lighter", tone: "destructive", class: "bg-danger-subtle text-danger hover:bg-danger-subtle-hover hover:text-danger-hover" },
      { variant: "ghost", tone: "primary", class: "text-primary hover:bg-primary-subtle hover:text-on-primary-subtle" },
      { variant: "ghost", tone: "neutral", class: "text-text-secondary hover:bg-surface" },
      { variant: "ghost", tone: "destructive", class: "text-danger hover:bg-danger-subtle" },
    ],
    // Défauts lighter + neutral (arbitrage 2026-07-29) : l'usage majoritaire du CompactButton
    // est utilitaire (fermer, développer) — le filled primary criait plus fort que l'action.
    defaultVariants: { variant: "lighter", tone: "neutral", size: "md", fullRadius: false },
  },
);

export interface CompactButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "style">,
    VariantProps<typeof compactButtonVariants> {
  /**
   * @deprecated Ancien nom de `variant` (masque l'attribut DOM `style`).
   * `variant` l'emporte si les deux sont fournis. Retrait prévu en majeure.
   */
  style?: ButtonVariant | null;
  asChild?: boolean;
  /** Rend le bouton en squelette de chargement — mêmes dimensions, contenu masqué. */
  loading?: boolean;
  /** Obligatoire : le bouton n'a que l'icône (WCAG — icône seule sans exception). */
  "aria-label": string;
}

const CompactButtonRoot = React.forwardRef<HTMLButtonElement, CompactButtonProps>(
  ({ className, style, variant, tone, size, fullRadius, asChild = false, loading = false, type, disabled, ...props }, ref) => {
    if (style != null) warnStyleAlias("CompactButton");
    const fill = variant ?? style;
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : (type ?? "button")}
        // Entrée dans la grammaire du relief posé (relief.css cible [data-style]/[data-tone]) —
        // le CompactButton n'émettait pas ses attributs et restait plat sous [data-relief].
        data-style={loading ? undefined : (fill ?? "lighter")}
        data-tone={loading ? undefined : (tone ?? "neutral")}
        aria-busy={loading || undefined}
        disabled={disabled || loading}
        className={cn(compactButtonVariants({ variant: fill, tone, size, fullRadius }), loading && "ds-skeleton", className)}
        {...props}
      />
    );
  },
);
CompactButtonRoot.displayName = "CompactButton.Root";

/** Slot icône — currentColor, dimensionnée par la taille du bouton. */
const CompactButtonIcon = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} aria-hidden="true" className={cn("inline-flex", className)} {...props} />
  ),
);
CompactButtonIcon.displayName = "CompactButton.Icon";

export const CompactButton = Object.assign(CompactButtonRoot, {
  Root: CompactButtonRoot,
  Icon: CompactButtonIcon,
});
export { CompactButtonRoot, CompactButtonIcon, compactButtonVariants };
