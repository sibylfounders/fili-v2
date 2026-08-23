"use client";
// Composant interactif : hooks, contexte ou primitive Radix au niveau module.
// Sans cette directive, une page serveur qui importe le baril @fili/react casse
// (createContext évalué dans le graphe RSC).
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";
import "../../lib/interaction.css";

/**
 * Switch — bascule un état booléen à EFFET IMMÉDIAT (DS-MD RULES-switch). Distinct de la checkbox
 * (sélection validée à la soumission) : ici l'action prend effet tout de suite, sans « appliquer ».
 * role="switch" + aria-checked ; Espace/Entrée basculent (comportement natif du <button>).
 *
 * Contrôlé : `checked` + `onCheckedChange`. L'état se lit à la POSITION du pouce autant qu'à la
 * couleur (jamais la seule couleur). Nom accessible requis : `label` (libellé VISIBLE, cliquable,
 * relié par aria-labelledby) OU `aria-label`/`aria-labelledby` pour la version sans texte.
 *
 * Tailles alignées sur Button : sm / md / lg. `loading` rend la piste en squelette.
 *
 * L'état asynchrone (bascule qui appelle le serveur) est hors périmètre v1 (extension différée).
 */
const trackVariants = cva(
  [
    "relative inline-flex shrink-0 items-center rounded-pill align-middle",
    "transition-colors duration-base ease-in-out motion-reduce:transition-none",
    "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--control-focus-color)]",
    // La piste inerte prend le remplissage tokenisé (ds-inert), plus une opacité en dur.
    "ds-inert cursor-pointer",
  ].join(" "),
  {
    variants: { size: { sm: "h-5 w-9", md: "h-6 w-11", lg: "h-7 w-14" } },
    defaultVariants: { size: "md" },
  },
);

const THUMB = {
  sm: { size: "size-4", on: "translate-x-4" },
  md: { size: "size-5", on: "translate-x-5" },
  lg: { size: "size-6", on: "translate-x-7" },
} as const;

export interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "type">,
    VariantProps<typeof trackVariants> {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Libellé visible, cliquable, relié au switch (aria-labelledby). Sans lui : aria-label requis. */
  label?: React.ReactNode;
  /** Rend la piste en squelette de chargement, aux dimensions de sa taille. */
  loading?: boolean;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked, onCheckedChange, size = "md", label, loading = false, className, disabled, ...props }, ref) => {
    const labelId = React.useId();
    const thumb = THUMB[size ?? "md"];
    const btn = (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={label != null ? labelId : undefined}
        aria-busy={loading || undefined}
        disabled={disabled || loading}
        onClick={() => onCheckedChange?.(!checked)}
        className={cn(
          trackVariants({ size }),
          checked ? "bg-primary" : "bg-surface-hover",
          loading && "ds-skeleton",
          className,
        )}
        {...props}
      >
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none inline-block rounded-pill bg-background shadow-raised",
            "transition-transform duration-base ease-in-out motion-reduce:transition-none",
            thumb.size,
            checked ? thumb.on : "translate-x-0.5",
          )}
        />
      </button>
    );
    if (label == null) return btn;
    return (
      <label className="inline-flex cursor-pointer select-none items-center gap-sm">
        {btn}
        <span
          id={labelId}
          className={cn(
            "text-text-primary",
            size === "sm" ? "text-sm" : "text-base",
            loading && "ds-skeleton rounded-sm",
          )}
        >
          {label}
        </span>
      </label>
    );
  },
);
Switch.displayName = "Switch";

export { trackVariants as switchTrackVariants };
