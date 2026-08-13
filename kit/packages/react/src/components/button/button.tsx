"use client";
// Composant interactif : hooks, contexte ou primitive Radix au niveau module.
// Sans cette directive, une page serveur qui importe le baril @fili/react casse
// (createContext évalué dans le graphe RSC).
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";
import "./relief.css";
import "../../lib/focus.css";
import "../../lib/interaction.css";

/**
 * Button — construit sur les RÈGLES de Design System MD (autorité UX),
 * habillé par les tokens @fili/tokens.
 *
 * MODÈLE (Fili Component Contract 1.0.0) : deux axes vraiment indépendants + la taille —
 *   - `variant` = la FACTURE (le remplissage) : filled / stroke / lighter / ghost
 *   - `tone`    = l'INTENTION de l'action : primary / neutral / destructive
 *   - `size`    = la densité : sm / md / lg
 * PAS de tone `warning` : l'avertissement est un message (Alert/Badge), jamais une
 * action — un stroke warning se confondrait avec une alerte (arbitrage 2026-07-29,
 * doctrine BUTTON corrigée en conséquence). `destructive` est une intention UX qui
 * consomme la famille chromatique `danger` (dictionnaire des tones du Contract).
 *
 * `style` est l'ANCIEN nom de `variant` — accepté en alias déprécié (variant gagne
 * si les deux sont fournis), supprimé à la prochaine majeure. Tant qu'il vit,
 * l'attribut DOM `style` reste masqué : passer par `className` pour tout style ad hoc.
 *
 * Focus ring (v2) : géométrie unique de la fondation BORDER via .ds-focus-ring,
 * couleur SUBTILE accordée au tone — primary éclairci par défaut, neutral/destructive
 * surchargent --control-focus-color (arbitrage 2026-07-29 après-midi, cf. DECISIONS.md).
 * Rayon : `rounded-button` → --button-radius → --control-radius (cascade étage 3→2).
 */
const buttonVariants = cva(
  [
    "inline-flex max-w-full items-center justify-center text-center select-none border border-transparent",
    "font-medium leading-tight [overflow-wrap:anywhere]",
    "outline-none ds-focus-ring",
    // ds-pressable : la transition (couleur ET pression, motion.fast) + la course d'active,
    // hors du registre relief — l'active est une propriété universelle (INTERACTION-R13).
    // ds-inert : l'état indisponible en DEUX TOKENS encadrés, plus une opacité en dur dont
    // l'intensité variait avec le style et avec la surface dessous (BUTTON-U03).
    // DS-MD : disabled jamais silencieux — exposer la cause en usage (tooltip/inline).
    // cursor-not-allowed (porté par ds-inert) : PAS de pointer-events-none, qui masquerait le curseur.
    "ds-pressable ds-inert",
  ].join(" "),
  {
    variants: {
      variant: {
        filled: "",
        stroke: "border",
        lighter: "",
        ghost: "",
      },
      // Anneau de focus ACCORDÉ à la couleur de l'objet, en teinte subtile (focus v2,
      // arbitrage 2026-07-29 après-midi) — la géométrie reste celle de .ds-focus-ring.
      tone: {
        primary: "",
        neutral: "[--control-focus-color:var(--control-focus-neutral)]",
        destructive: "[--control-focus-color:var(--control-focus-danger)]",
      },
      size: {
        sm: "min-h-8 gap-1.5 rounded-button px-sm py-xs text-sm",
        md: "min-h-10 gap-2 rounded-button px-md py-xs text-base",
        lg: "min-h-12 gap-2 rounded-button px-lg py-sm text-base",
      },
      // icon-only : bouton carré (padding égal en x/y, largeur = hauteur de la taille)
      iconOnly: { true: "", false: "" },
    },
    compoundVariants: [
      // ── FILLED — fond plein + texte "on"
      { variant: "filled", tone: "primary", class: "bg-primary text-on-primary hover:bg-primary-hover" },
      { variant: "filled", tone: "neutral", class: "bg-surface-inverse text-text-inverse hover:opacity-90" },
      { variant: "filled", tone: "destructive", class: "bg-danger text-on-danger hover:bg-danger-hover" },
      // ── STROKE — contour délimitant (bordure = tone) + texte tone
      { variant: "stroke", tone: "primary", class: "border-primary text-primary hover:bg-primary-subtle hover:text-on-primary-subtle" },
      { variant: "stroke", tone: "neutral", class: "border-border-strong text-text-primary hover:bg-surface" },
      { variant: "stroke", tone: "destructive", class: "border-danger text-danger hover:bg-danger-subtle" },
      // ── LIGHTER — lavis (fond doux) + texte tone
      { variant: "lighter", tone: "primary", class: "bg-primary-subtle text-on-primary-subtle hover:bg-primary-subtle-hover" },
      { variant: "lighter", tone: "neutral", class: "bg-surface text-text-primary hover:bg-surface-hover" },
      { variant: "lighter", tone: "destructive", class: "bg-danger-subtle text-danger hover:bg-danger-subtle-hover hover:text-danger-hover" },
      // ── GHOST — sans fond, remplissage léger au survol
      { variant: "ghost", tone: "primary", class: "text-primary hover:bg-primary-subtle hover:text-on-primary-subtle" },
      { variant: "ghost", tone: "neutral", class: "text-text-secondary hover:bg-surface" },
      { variant: "ghost", tone: "destructive", class: "text-danger hover:bg-danger-subtle" },
      // icon-only carré par taille (min-h = largeur), padding horizontal supprimé
      { iconOnly: true, size: "sm", class: "w-8 px-0" },
      { iconOnly: true, size: "md", class: "w-10 px-0" },
      { iconOnly: true, size: "lg", class: "w-12 px-0" },
    ],
    defaultVariants: { variant: "filled", tone: "primary", size: "md", iconOnly: false },
  },
);

export type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>;

// Avertissement unique (dev) pour l'alias déprécié — partagé avec CompactButton.
let warnedStyleAlias = false;
export function warnStyleAlias(component: string) {
  if (process.env.NODE_ENV !== "production" && !warnedStyleAlias) {
    warnedStyleAlias = true;
    // eslint-disable-next-line no-console
    console.warn(
      `[fili] ${component} : la prop \`style\` est dépréciée — utiliser \`variant\` ` +
        `(mêmes valeurs ; \`variant\` l'emporte si les deux sont fournis). ` +
        `L'alias sera retiré à la prochaine version majeure de @fili/react.`,
    );
  }
}

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "style">,
    VariantProps<typeof buttonVariants> {
  /**
   * @deprecated Ancien nom de `variant` (masque l'attribut DOM `style`).
   * `variant` l'emporte si les deux sont fournis. Retrait prévu en majeure.
   */
  style?: ButtonVariant | null;
  /** Rend l'élément enfant à la place du <button> (Radix Slot). */
  asChild?: boolean;
  /** Rend le bouton en squelette de chargement — mêmes dimensions, contenu masqué, relief éteint. */
  loading?: boolean;
}

const ButtonRoot = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, style, variant, tone, size, iconOnly, asChild = false, loading = false, type, disabled, ...props }, ref) => {
    if (style != null) warnStyleAlias("Button");
    const fill = variant ?? style ?? "filled";
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : (type ?? "button")}
        data-style={loading ? undefined : fill}
        data-tone={loading ? undefined : (tone ?? "primary")}
        aria-busy={loading || undefined}
        disabled={disabled || loading}
        className={cn(buttonVariants({ variant: fill, tone, size, iconOnly }), loading && "ds-skeleton", className)}
        {...props}
      />
    );
  },
);
ButtonRoot.displayName = "Button.Root";

/** Slot icône — hérite la couleur (currentColor), taille alignée sur le corps. */
const ButtonIcon = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} aria-hidden="true" className={cn("inline-flex shrink-0 [&>svg]:size-5", className)} {...props} />
  ),
);
ButtonIcon.displayName = "Button.Icon";

/** API compound : <Button.Root><Button.Icon/>…</Button.Root> */
export const Button = Object.assign(ButtonRoot, { Root: ButtonRoot, Icon: ButtonIcon });
export { ButtonRoot, ButtonIcon, buttonVariants };
