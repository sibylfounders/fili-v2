"use client";
// Composant interactif : hooks, contexte ou primitive Radix au niveau module.
// Sans cette directive, une page serveur qui importe le baril @fili/react casse
// (createContext évalué dans le graphe RSC).
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";
import "../button/relief.css";

/**
 * Alert — messages d'état DANS le flux de la page. Construit sur les RÈGLES de
 * Design System MD (autorité UX), habillé par les tokens @fili/tokens.
 *
 * Axes DS-MD : tone (info / success / warning / danger) × persistance
 * (permanent / dismissible — portée par la présence d'<Alert.Close>).
 *   - PAS d'emphasis : le contraste suit la gravité, il ne se choisit pas par
 *     instance. Rendu unique « low contrast » = fond subtil ({tone}-lighter).
 *     Réconciliation référence : la référence expose variant (filled/light/lighter/
 *     stroke) + size ; DS-MD faisant autorité, on abandonne ces deux axes.
 *   - PAS de neutral : porter une charge sémantique est la fonction de l'alert
 *     (valeur minimale = info). PAS de size : largeur = conteneur, hauteur = contenu.
 *   - `danger` = famille color.danger (= error côté tokens), nom adapté au composant.
 *
 * Toast (temporaire, chronométré, au-dessus du flux) et modale d'alerte (bloquante)
 * sont d'AUTRES composants, hors de ce fichier.
 *
 * Accessibilité : icône = canal redondant du tone (silhouette distincte par tone,
 * jamais retirée — WCAG 1.4.1). Réactif → role="alert" (danger/warning) /
 * role="status" (info/success) via la prop `live`. Modes clair/sombre gratuits.
 */

type AlertTone = "info" | "success" | "warning" | "danger";

const AlertContext = React.createContext<{ tone: AlertTone }>({ tone: "info" });

const rootVariants = cva(
  // Structure : icône alignée sur la 1re ligne (items-start), bloc lu comme une unité.
  "relative flex w-full gap-sm rounded-lg border p-md text-base", // cran CONTENEUR (radius.lg, DESIGN.md 1.20.0)
  {
    variants: {
      // Rendu unique par tone : fond {tone}-lighter, bordure/texte/icône {tone}-base (≥ 4.5:1).
      // L'anneau de focus des contrôles internes (Close, actions) suit le tone du message
      // (focus v2 : surcharge héritée de --control-focus-color).
      tone: {
        info: "border-info bg-info-subtle text-info [--control-focus-color:var(--control-focus-info)]",
        success: "border-success bg-success-subtle text-success [--control-focus-color:var(--control-focus-success)]",
        warning: "border-warning bg-warning-subtle text-warning [--control-focus-color:var(--control-focus-warning)]",
        danger: "border-danger bg-danger-subtle text-danger [--control-focus-color:var(--control-focus-danger)]",
      },
    },
    defaultVariants: { tone: "info" },
  },
);

/* ── Silhouettes normatives (DS-MD) : cercle / cercle-coche / triangle / octogone ─ */
function ToneGlyph({ tone }: { tone: AlertTone }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (tone) {
    case "success":
      return (
        <svg viewBox="0 0 20 20" {...common}>
          <circle cx="10" cy="10" r="7.25" />
          <path d="m6.75 10.25 2.1 2.1 4.4-4.6" />
        </svg>
      );
    case "warning":
      return (
        <svg viewBox="0 0 20 20" {...common}>
          <path d="M10 3.2 18 16.8H2L10 3.2Z" />
          <path d="M10 8.2v3.4" />
          <path d="M10 14.2h.01" />
        </svg>
      );
    case "danger":
      return (
        <svg viewBox="0 0 20 20" {...common}>
          <path d="M6.9 2.6h6.2l4.3 4.3v6.2l-4.3 4.3H6.9l-4.3-4.3V6.9L6.9 2.6Z" />
          <path d="M10 6.4v4" />
          <path d="M10 13.4h.01" />
        </svg>
      );
    case "info":
    default:
      return (
        <svg viewBox="0 0 20 20" {...common}>
          <circle cx="10" cy="10" r="7.25" />
          <path d="M10 9v4.2" />
          <path d="M10 6.6h.01" />
        </svg>
      );
  }
}

/* ── Root ─────────────────────────────────────────────────────────────────── */
export interface AlertRootProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof rootVariants> {
  /**
   * Alert injecté dynamiquement (réactif) : annoncé aux technologies d'assistance.
   * danger/warning → role="alert" ; info/success → role="status".
   * Laisser `false` (défaut) pour un alert proactif chargé avec la page (aucun rôle live).
   */
  live?: boolean;
}

const AlertRoot = React.forwardRef<HTMLDivElement, AlertRootProps>(
  ({ className, tone = "info", live = false, role, children, ...props }, ref) => {
    const resolvedTone = tone ?? "info";
    const liveRole = live
      ? resolvedTone === "danger" || resolvedTone === "warning"
        ? "alert"
        : "status"
      : undefined;
    return (
      <AlertContext.Provider value={{ tone: resolvedTone }}>
        <div
          ref={ref}
          role={role ?? liveRole}
          data-tone={resolvedTone}
          data-slot="alert"
          className={cn(rootVariants({ tone }), className)}
          {...props}
        >
          {children}
        </div>
      </AlertContext.Provider>
    );
  },
);
AlertRoot.displayName = "Alert.Root";

/* ── Icon : la silhouette du tone par défaut, ou un glyphe fourni via `as`/children ─ */
type AlertIconProps = {
  as?: React.ElementType;
  className?: string;
  children?: React.ReactNode;
};
function AlertIcon({ as, className, children }: AlertIconProps) {
  const { tone } = React.useContext(AlertContext);
  const Comp = as;
  return (
    // icon.md (size-5), alignée sur la 1re ligne du titre. Redondante au tone → aria-hidden.
    <span aria-hidden="true" className={cn("mt-px flex size-5 shrink-0 items-center justify-center [&>svg]:size-5", className)}>
      {Comp ? <Comp /> : children ?? <ToneGlyph tone={tone} />}
    </span>
  );
}

/* ── Contenu ──────────────────────────────────────────────────────────────── */
function AlertContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex min-w-0 flex-col", className)} {...props} />;
}

/** Titre = le message en une ligne (jamais un titre-catégorie). Pas un heading. */
function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("font-medium", className)} {...props} />;
}

/** Corps = le pourquoi / le comment-corriger (1-2 phrases max). title→body = spacing.xs. */
function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("mt-xs text-sm", className)} {...props} />;
}

/** Actions = une action mise en avant (+ une seconde tolérée). body→actions = spacing.sm. */
function AlertActions({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-sm flex items-center gap-md", className)} {...props} />;
}

/* ── Close : vrai <button>, cible 44px, libellé « Fermer », en fin de DOM ──── */
export interface AlertCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
const AlertClose = React.forwardRef<HTMLButtonElement, AlertCloseProps>(
  ({ className, "aria-label": ariaLabel = "Fermer", children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label={ariaLabel}
      // Cible tactile 44px (size-11) même si le glyphe est petit ; marges négatives = pas d'inflation.
      className={cn(
        "-my-2 -mr-2 ml-auto flex size-11 shrink-0 items-center justify-center rounded-sm text-text-secondary",
        "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--control-focus-color)]",
        className,
      )}
      {...props}
    >
      {children ?? (
        <svg viewBox="0 0 20 20" fill="none" className="size-5" aria-hidden="true">
          <path d="m5.5 5.5 9 9M14.5 5.5l-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}
    </button>
  ),
);
AlertClose.displayName = "Alert.Close";

/* API compound — ordre canonique : Icon → (Title → Description → Actions) → Close. */
export const Alert = {
  Root: AlertRoot,
  Icon: AlertIcon,
  Content: AlertContent,
  Title: AlertTitle,
  Description: AlertDescription,
  Actions: AlertActions,
  Close: AlertClose,
};

export {
  AlertRoot,
  AlertIcon,
  AlertContent,
  AlertTitle,
  AlertDescription,
  AlertActions,
  AlertClose,
  rootVariants as alertRootVariants,
};
