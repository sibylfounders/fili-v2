"use client";
// Composant interactif : hooks, contexte ou primitive Radix au niveau module.
// Sans cette directive, une page serveur qui importe le baril @fili/react casse
// (createContext évalué dans le graphe RSC).
import * as React from "react";
import { createPortal } from "react-dom";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";
import { verrouilleDefilement } from "../../lib/scroll-lock";
import "./drawer.css";

/**
 * Drawer — superposé MODAL ancré à un bord (off-canvas). Premier consommateur de la fondation
 * DS-MD `overlay` (RULES-overlay) : voile `scrim`, focus piégé, défilement du fond verrouillé,
 * Échap ferme, retour du focus au déclencheur. C'est le mécanisme qui rend invocables les rails
 * de l'AppShell sous `breakpoint.tablet` (nav) et `breakpoint.desktop` (outils).
 *
 * Contrôlé : `open` + `onClose`. `side` = start (gauche, défaut) | end (droite) | top | bottom.
 * Les ancrages haut/bas SONT les « sheets » : même fondation overlay (voile, piège de focus,
 * Échap), seul l'ancrage change — pas de composant Sheet séparé. Un nom accessible est requis
 * (`aria-label` ou `aria-labelledby`) — role="dialog" aria-modal.
 *
 * EFFET sur le fond — deux axes ORTHOGONAUX, nécessitent un `<Drawer.Frame>` autour de la page :
 *  - `effect` = `overlay` (défaut : le tiroir glisse au-dessus, le fond ne bouge pas) | `push`
 *    (le contenu se décale de la largeur du tiroir — start/end uniquement, un push vertical n'a
 *    pas de largeur de référence : top/bottom retombent sur overlay) ;
 *  - `depth` = booléen, COMBINABLE avec les deux effets : « Depth Transition » façon iOS — le
 *    contenu recule (scale) dans une frame arrondie sur fond noir pendant que le tiroir est actif.
 * Sans Frame, effect/depth retombent silencieusement sur overlay simple (aucune erreur).
 * Dans un Frame, le tiroir est PORTÉ DANS le Frame (positionnement absolu, contenu dans son
 * cadre) ; sans Frame il est porté vers document.body (fixe, plein viewport).
 *
 * TAILLE (`size`) : crans GRID, pas un de plus — la même prop pilote les deux orientations,
 * et les NOMS parlent la langue des largeurs de contenu (narrow/default/wide/full, comme
 * Modal et Container — jamais sm/md/lg, réservés aux contrôles).
 *  - start/end (largeur du panneau) : narrow = rail-nav (280, défaut) · default =
 *    container-narrow (480) · wide = overlay (640) · full = toute la largeur (plafond 85%).
 *    Au-delà de 640 le contenu appelle une page (même règle que Modal). Le push se décale de
 *    la largeur réelle.
 *  - top/bottom (largeur de la FEUILLE, centrée — un sheet desktop n'a aucune raison d'être
 *    full-width) : narrow = 480 · default = 640 · wide = container-default (1024) · full =
 *    pleine largeur (défaut) — mêmes noms et mêmes valeurs que Modal. Hauteur au contenu,
 *    plafond 85%.
 *
 * Limite assumée (v1) : le fond n'est pas mis `inert` (il faudrait une référence à la racine
 * applicative) ; l'inertie est approchée par le scrim + le piège de focus + aria-modal. À durcir
 * quand la racine sera exposée. Cf. OVERLAY-UX « focus et clavier ».
 */

export type DrawerSide = "start" | "end" | "top" | "bottom";
export type DrawerEffect = "overlay" | "push";
export type DrawerSize = "narrow" | "default" | "wide" | "full";

/* Crans GRID via var()/utilitaires ; le Frame reprend le même cran (data-size → --ds-drawer-w,
   drawer.css) pour que le push décale de la largeur réelle. */
const SIZE_HORIZONTAL: Record<DrawerSize, string> = {
  narrow: "w-rail-nav",
  default: "w-[var(--container-narrow,480px)]",
  wide: "w-[var(--overlay,640px)]",
  full: "w-full",
};
/* top/bottom : la feuille se centre (inset-x-0 + mx-auto) et plafonne sa largeur. */
const SIZE_VERTICAL: Record<DrawerSize, string> = {
  narrow: "mx-auto max-w-container-narrow border-x border-border",
  default: "mx-auto max-w-overlay border-x border-border",
  wide: "mx-auto max-w-container-default border-x border-border",
  full: "",
};

const panelVariants = cva(
  [
    "z-overlay bg-surface shadow-overlay",
    "overflow-y-auto outline-none flex flex-col",
    "transition-transform duration-slow ease-out motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      side: {
        start: "inset-y-0 left-0 max-w-[85%] border-r border-border",
        end: "inset-y-0 right-0 max-w-[85%] border-l border-border",
        top: "inset-x-0 top-0 max-h-[85%] w-full rounded-b-lg border-b border-border",
        bottom: "inset-x-0 bottom-0 max-h-[85%] w-full rounded-t-lg border-t border-border",
      },
    },
    defaultVariants: { side: "start" },
  },
);

const FOCUSABLE =
  'a[href],area[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/* ── Frame : le cadre qui héberge la page et subit push/depth ─────────────────────────────── */
type FrameState = { side: DrawerSide; effect: DrawerEffect; depth: boolean; size: DrawerSize };
type FrameCtxValue = {
  node: HTMLDivElement | null;
  set: (state: FrameState | null) => void;
};
const FrameCtx = React.createContext<FrameCtxValue | null>(null);

export interface DrawerFrameProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DrawerFrame({ className, children, ...props }: DrawerFrameProps) {
  const [node, setNode] = React.useState<HTMLDivElement | null>(null);
  const [state, setState] = React.useState<FrameState | null>(null);
  const value = React.useMemo(() => ({ node, set: setState }), [node]);
  return (
    <div
      ref={setNode}
      data-open={state ? "true" : "false"}
      data-side={state?.side}
      data-effect={state?.effect}
      data-depth={state?.depth ? "true" : undefined}
      data-size={state?.size}
      className={cn("ds-drawer-frame", className)}
      {...props}
    >
      <div className="ds-drawer-frame__content">
        <FrameCtx.Provider value={value}>{children}</FrameCtx.Provider>
      </div>
    </div>
  );
}
DrawerFrame.displayName = "Drawer.Frame";

/* ── Tiroir ───────────────────────────────────────────────────────────────────────────────── */
export interface DrawerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof panelVariants> {
  open: boolean;
  onClose: () => void;
  /** Effet sur le fond : overlay (défaut) | push — actif seulement dans un <Drawer.Frame>. */
  effect?: DrawerEffect;
  /** Depth Transition (iOS) : le contenu recule dans une frame arrondie sur fond noir — combinable avec overlay ET push. */
  depth?: boolean;
  /** Taille — start/end : largeur du panneau (narrow 280 défaut · default 480 · wide 640 · full) ;
   *  top/bottom : largeur de la feuille centrée (narrow 480 · default 640 · wide 1024 · full défaut). */
  size?: DrawerSize;
}

export function DrawerRoot({
  open,
  onClose,
  side = "start",
  effect = "overlay",
  depth = false,
  size,
  className,
  children,
  ...props
}: DrawerProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const restoreRef = React.useRef<HTMLElement | null>(null);
  const [shown, setShown] = React.useState(false);
  const frame = React.useContext(FrameCtx);
  const inFrame = !!frame?.node;
  // push vertical impossible (pas de largeur de référence) → overlay.
  const vertical = side === "top" || side === "bottom";
  const effectiveEffect: DrawerEffect = vertical && effect === "push" ? "overlay" : effect;
  // Défaut par orientation : rail narrow à l'horizontale, pleine largeur à la verticale.
  const resolvedSize: DrawerSize = size ?? (vertical ? "full" : "narrow");

  React.useEffect(() => {
    if (!open) return;
    // 1. mémoriser le déclencheur pour lui rendre le focus à la fermeture
    restoreRef.current = document.activeElement as HTMLElement | null;
    // 2. verrouiller le défilement du fond — hors Frame seulement (le Frame contient déjà
    //    son contenu ; verrouiller le body punirait la page qui héberge le cadre)
    const deverrouille = inFrame ? () => {} : verrouilleDefilement(restoreRef.current);
    // 3. faire entrer le focus dans le panneau
    const panel = panelRef.current;
    const first = panel?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? panel)?.focus({ preventScroll: true });
    // 4. jouer la transition d'entrée
    const raf = requestAnimationFrame(() => setShown(true));

    return () => {
      cancelAnimationFrame(raf);
      deverrouille();
      setShown(false);
      restoreRef.current?.focus?.({ preventScroll: true });
    };
  }, [open, inFrame]);

  // Signaler l'état au Frame (push/depth sur le contenu derrière).
  const setFrame = frame?.set;
  React.useEffect(() => {
    if (!setFrame) return;
    if (open) setFrame({ side: side ?? "start", effect: effectiveEffect, depth, size: resolvedSize });
    return () => setFrame(null);
  }, [open, side, effectiveEffect, depth, resolvedSize, setFrame]);

  if (!open || typeof document === "undefined") return null;

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== "Tab") return;
    // piège de focus : Tab boucle dans le panneau
    const panel = panelRef.current;
    if (!panel) return;
    const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
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

  const closedTransform =
    side === "end"
      ? "translate-x-full"
      : side === "bottom"
        ? "translate-y-full"
        : side === "top"
          ? "-translate-y-full"
          : "-translate-x-full";
  const openTransform = vertical ? "translate-y-0" : "translate-x-0";
  // Dans un Frame : positionnement absolu (contenu dans le cadre) ; sinon fixe (viewport).
  const positionClass = inFrame ? "absolute" : "fixed";

  return createPortal(
    <>
      {/* Scrim — même couche que la surface, rendu AVANT (donc derrière) ; clic = fermeture */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          positionClass,
          "inset-0 z-overlay bg-scrim transition-opacity duration-slow ease-out motion-reduce:transition-none",
          shown ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        onKeyDown={onKeyDown}
        className={cn(
          positionClass,
          panelVariants({ side }),
          vertical ? SIZE_VERTICAL[resolvedSize] : SIZE_HORIZONTAL[resolvedSize],
          shown ? openTransform : closedTransform,
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </>,
    frame?.node ?? document.body,
  );
}
DrawerRoot.displayName = "Drawer";

export const Drawer = Object.assign(DrawerRoot, {
  Root: DrawerRoot,
  Frame: DrawerFrame,
});

export { panelVariants as drawerPanelVariants };
