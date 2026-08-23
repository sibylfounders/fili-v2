"use client";
import * as React from "react";
import { createPortal } from "react-dom";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";
import { verrouilleDefilement } from "../../lib/scroll-lock";

/**
 * Modal — superposé MODAL centré (dialog). Second consommateur de la fondation `overlay`
 * après le Drawer, et le composant que ACCESSIBILITY-UX désignait comme « futur composant modal ».
 *
 * Mécanique imposée par OVERLAY-UX/UI, aucune improvisation :
 *  · surface `z-index.overlay` + scrim `overlay.scrim` rendu AVANT elle (donc derrière) ;
 *  · clic sur le voile = fermeture (équivalent d'une annulation) ; Échap ferme aussi ;
 *  · le focus ENTRE à l'ouverture, est PIÉGÉ tant que c'est ouvert, et REVIENT au déclencheur ;
 *  · défilement du fond VERROUILLÉ ;
 *  · surface : `elevation.overlay` (jamais raised), `radius.md`, fond `background` ;
 *  · entrée/sortie sur une durée MOTION de grande surface (`slow`), `prefers-reduced-motion` respecté ;
 *  · le ring de focus interne reste celui de BORDER — la modale ne le redéfinit pas.
 *
 * Compound : Modal / .Header / .Body / .Footer / .Close. Le nom accessible vient du Header
 * (aria-labelledby posé automatiquement) ; sans Header, passer `aria-label`.
 *
 * Limite assumée (v1, identique au Drawer) : le fond n'est pas mis `inert` faute de référence à la
 * racine applicative — l'inertie est approchée par scrim + piège de focus + aria-modal.
 *
 * Largeur : trois crans GRID — `narrow` = `container-narrow` (480, la modale de confirmation,
 * même gabarit qu'un formulaire focalisé), `default` = `grid.overlay` (640, la modale qui porte
 * une illustration ou un tableau court) et `wide` = `container-default` (1024, la modale de
 * travail : comparateur, galerie, tableau — arbitrage 2026-07-29, assouplit la limite « au-delà
 * de 640 le contenu appelle une page » pour les cas où quitter le contexte coûterait plus cher).
 *
 * Position (`placement`) : `center` (défaut) | `top` | `bottom` — haut/bas gardent un retrait de
 * 6vh (jamais collé au bord de la fenêtre). Apparition (`enterFrom`) : `bottom` (défaut, monte
 * légèrement) | `top` (descend) | `center` (zoom depuis le centre, scale 95 → 100).
 */

const surfaceVariants = cva(
  [
    "relative z-overlay flex max-h-[calc(100%-var(--space-xl))] w-full flex-col outline-none",
    // cran CONTENEUR (radius.lg, DESIGN.md 1.20.0) — jamais le rayon des contrôles
    "rounded-lg border border-border bg-background shadow-overlay",
    "transition-[opacity,transform] duration-slow ease-out motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      size: {
        narrow: "max-w-container-narrow",
        default: "max-w-overlay",
        wide: "max-w-container-default",
      },
    },
    defaultVariants: { size: "narrow" },
  },
);

export type ModalPlacement = "center" | "top" | "bottom";
export type ModalEnterFrom = "bottom" | "top" | "center";

const FOCUSABLE =
  'a[href],area[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

type ModalCtx = { titleId: string; onClose: () => void; setTitled: (v: boolean) => void };
const Ctx = React.createContext<ModalCtx | null>(null);

export interface ModalProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof surfaceVariants> {
  open: boolean;
  onClose: () => void;
  /** Fermeture au clic sur le voile (défaut : true — OVERLAY-UX « clic sur le voile = annulation »). */
  dismissOnScrim?: boolean;
  /** Position verticale de la surface : center (défaut) | top | bottom — haut/bas avec retrait de 6vh. */
  placement?: ModalPlacement;
  /** Direction d'apparition : bottom (défaut, monte) | top (descend) | center (zoom). */
  enterFrom?: ModalEnterFrom;
}

export function ModalRoot({
  open,
  onClose,
  size = "narrow",
  dismissOnScrim = true,
  placement = "center",
  enterFrom = "bottom",
  className,
  children,
  ...props
}: ModalProps) {
  const surfaceRef = React.useRef<HTMLDivElement>(null);
  const restoreRef = React.useRef<HTMLElement | null>(null);
  const [shown, setShown] = React.useState(false);
  const [titled, setTitled] = React.useState(false);
  const rid = React.useId();
  const titleId = `${rid}-titre`;

  React.useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement | null;
    // Le fond ne défile pas : body ET région défilante du shell (cf. lib/scroll-lock).
    const deverrouille = verrouilleDefilement(restoreRef.current);
    const surface = surfaceRef.current;
    const first = surface?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? surface)?.focus({ preventScroll: true });
    const raf = requestAnimationFrame(() => setShown(true));
    return () => {
      cancelAnimationFrame(raf);
      deverrouille();
      setShown(false);
      restoreRef.current?.focus?.({ preventScroll: true });
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== "Tab") return;
    const surface = surfaceRef.current;
    if (!surface) return;
    const items = Array.from(surface.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (items.length === 0) {
      e.preventDefault();
      return;
    }
    const firstEl = items[0];
    const lastEl = items[items.length - 1];
    if (e.shiftKey && document.activeElement === firstEl) {
      e.preventDefault();
      lastEl.focus();
    } else if (!e.shiftKey && document.activeElement === lastEl) {
      e.preventDefault();
      firstEl.focus();
    }
  };

  return createPortal(
    <>
      {/* Voile — même couche que la surface, rendu AVANT (donc derrière) ; clic = fermeture */}
      <div
        aria-hidden="true"
        onClick={dismissOnScrim ? onClose : undefined}
        className={cn(
          "fixed inset-0 z-overlay bg-scrim transition-opacity duration-slow ease-out motion-reduce:transition-none",
          shown ? "opacity-100" : "opacity-0",
        )}
      />
      {/* Zone de centrage — ne capte pas le clic, le voile en dessous s'en charge */}
      <div
        className={cn(
          "pointer-events-none fixed inset-0 z-overlay flex justify-center p-lg",
          placement === "top" ? "items-start pt-[6vh]" : placement === "bottom" ? "items-end pb-[6vh]" : "items-center",
        )}
      >
        <div
          ref={surfaceRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titled ? titleId : undefined}
          tabIndex={-1}
          onKeyDown={onKeyDown}
          className={cn(
            surfaceVariants({ size }),
            "pointer-events-auto",
            shown
              ? "translate-y-0 scale-100 opacity-100"
              : enterFrom === "top"
                ? "-translate-y-sm opacity-0"
                : enterFrom === "center"
                  ? "scale-95 opacity-0"
                  : "translate-y-sm opacity-0",
            className,
          )}
          {...props}
        >
          <Ctx.Provider value={{ titleId, onClose, setTitled }}>{children}</Ctx.Provider>
        </div>
      </div>
    </>,
    document.body,
  );
}
ModalRoot.displayName = "Modal.Root";

const IconClose = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Sur-titre court (kicker) au-dessus du titre. */
  kicker?: React.ReactNode;
  /** Bouton de fermeture dans l'en-tête (défaut : true). */
  closable?: boolean;
  level?: 2 | 3 | 4;
}

export function ModalHeader({ kicker, closable = true, level = 2, className, children, ...props }: ModalHeaderProps) {
  const ctx = React.useContext(Ctx);
  const H = `h${level}` as keyof React.JSX.IntrinsicElements;
  React.useLayoutEffect(() => {
    ctx?.setTitled(true);
    return () => ctx?.setTitled(false);
  }, [ctx]);
  if (!ctx) return null;
  return (
    <div className={cn("flex items-start justify-between gap-md px-lg pb-sm pt-lg", className)} {...props}>
      <div className="min-w-0">
        {kicker ? (
          <p className="m-0 mb-1 font-label text-2xs font-semibold uppercase tracking-wider text-text-muted">{kicker}</p>
        ) : null}
        <H id={ctx.titleId} style={{ margin: 0 }} className="text-h5 font-semibold leading-tight text-text-primary">
          {children}
        </H>
      </div>
      {closable ? <ModalClose /> : null}
    </div>
  );
}
ModalHeader.displayName = "Modal.Header";

export function ModalBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("min-h-0 flex-1 overflow-y-auto px-lg py-sm text-sm text-text-secondary", className)} {...props} />;
}
ModalBody.displayName = "Modal.Body";

export function ModalFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-wrap items-center justify-end gap-sm border-t border-border px-lg py-md", className)} {...props} />
  );
}
ModalFooter.displayName = "Modal.Footer";

export function ModalClose({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const ctx = React.useContext(Ctx);
  return (
    <button
      type="button"
      onClick={() => ctx?.onClose()}
      aria-label={children ? undefined : "Fermer"}
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-text-secondary transition-colors duration-fast ease-out",
        "hover:bg-surface-hover hover:text-text-primary",
        "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--control-focus-color)]",
        className,
      )}
      {...props}
    >
      {children ?? IconClose}
    </button>
  );
}
ModalClose.displayName = "Modal.Close";

export const Modal = Object.assign(ModalRoot, {
  Root: ModalRoot,
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
  Close: ModalClose,
});

export { surfaceVariants as modalSurfaceVariants };
