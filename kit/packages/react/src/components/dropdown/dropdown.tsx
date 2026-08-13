"use client";
// Composant interactif : hooks, contexte ou primitive Radix au niveau module.
// Sans cette directive, une page serveur qui importe le baril @fili/react casse
// (createContext évalué dans le graphe RSC).
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../lib/cn";
import "../../lib/no-scrollbar.css";

/**
 * Dropdown — menu d'ACTIONS (intention « Agir », jamais un choix de valeur : ça, c'est
 * Select). DEUX formes, même contenu (Item / Label / Separator) :
 *  - ANCRÉE (Dropdown.Root + .Trigger + .Content) : motif ARIA APG « Menu Button » — le
 *    déclencheur porte aria-haspopup + aria-expanded, le menu est un popover NON-MODAL
 *    (fondation overlay : ancré, sans voile, light-dismiss, z-index.popover), le focus VIT
 *    dans les items, Échap ferme et rend le focus au déclencheur ;
 *  - EN LIGNE (Dropdown.Inline) : le même panneau, SANS déclencheur, posé dans le flux de la
 *    page (palette d'actions, panneau latéral) — à plat (pas d'élévation : le relief signale
 *    une couche, un panneau en flux n'en est pas une), navigation aux flèches identique.
 *
 * Inspiration assumée (fluidfunctionalism.com/docs/dropdown, relevé 2026-07-29), transposée
 * dans le langage fluide du système : le surlignage de survol/focus est UN SEUL fond animé
 * qui GLISSE d'un item à l'autre (translateY + height, motion.fast) — même famille de
 * mouvement que le pouce du ThemeToggle. `prefers-reduced-motion` : le fond saute, le signal
 * reste. Débordement : voiles dégradés + chevrons (convention Select/Tabs), barre masquée.
 */

type DropdownCtx = {
  open: boolean;
  setOpen: (open: boolean, focusTrigger?: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
  menuId: string;
  triggerId: string;
};
const Ctx = React.createContext<DropdownCtx | null>(null);
const useDropdown = (): DropdownCtx => {
  const c = React.useContext(Ctx);
  if (!c) throw new Error("Dropdown.Trigger/Content doivent vivre dans <Dropdown.Root>");
  return c;
};

/* ── mécanique partagée : voiles de débordement + surlignage glissant + flèches ─────────── */
const FOCUSABLE_ITEM = '[role^="menuitem"]:not([data-disabled])';

function useOverflowVeils(ref: React.RefObject<HTMLElement>) {
  const [overflow, setOverflow] = React.useState({ top: false, bottom: false });
  const update = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setOverflow({
      top: el.scrollTop > 2,
      bottom: el.scrollTop + el.clientHeight < el.scrollHeight - 2,
    });
  }, [ref]);
  return { overflow, update };
}

function Veils({ overflow }: { overflow: { top: boolean; bottom: boolean } }) {
  return (
    <>
      {overflow.top ? (
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-[2] flex h-7 items-start justify-center bg-gradient-to-b from-background to-transparent pt-0.5">
          <svg aria-hidden="true" viewBox="0 0 20 20" className="size-3.5 text-text-muted"><path d="M6 12l4-4 4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      ) : null}
      {overflow.bottom ? (
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] flex h-7 items-end justify-center bg-gradient-to-t from-background to-transparent pb-0.5">
          <svg aria-hidden="true" viewBox="0 0 20 20" className="size-3.5 text-text-muted"><path d="M6 8l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      ) : null}
    </>
  );
}

type Highlight = { top: number; height: number } | null;
const HighlightCtx = React.createContext<{ report: (el: HTMLElement) => void; clear: () => void } | null>(null);

function useFluidHighlight(menuRef: React.RefObject<HTMLElement>) {
  const [hl, setHl] = React.useState<Highlight>(null);
  const report = React.useCallback((el: HTMLElement) => {
    setHl({ top: el.offsetTop, height: el.offsetHeight });
  }, []);
  const clear = React.useCallback(() => {
    // le fond suit le focus s'il est encore dans le menu, sinon il s'éteint
    const focused = menuRef.current?.querySelector<HTMLElement>('[role^="menuitem"]:focus');
    if (focused) setHl({ top: focused.offsetTop, height: focused.offsetHeight });
    else setHl(null);
  }, [menuRef]);
  const value = React.useMemo(() => ({ report, clear }), [report, clear]);
  // IDENTITÉ STABLE obligatoire : reset est une dépendance de l'effet d'ouverture du Content —
  // une lambda recréée à chaque rendu relançait l'effet en boucle (cleanup → shown=false →
  // rAF → shown=true → rendu → …) et le menu restait invisible (bug corrigé 2026-07-29).
  const reset = React.useCallback(() => setHl(null), []);
  const node = (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-1 top-0 z-0 rounded-sm bg-surface-hover",
        "transition-[transform,height,opacity] duration-fast ease-out motion-reduce:transition-none",
        hl ? "opacity-100" : "opacity-0",
      )}
      style={{ transform: `translateY(${hl?.top ?? 0}px)`, height: hl?.height ?? 0 }}
    />
  );
  return { value, clear, node, reset };
}

/** Flèches / Origine / Fin dans un menu — renvoie true si la touche a été consommée. */
function navigateMenu(menuRef: React.RefObject<HTMLElement>, e: React.KeyboardEvent): boolean {
  const list = Array.from(menuRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_ITEM) ?? []);
  if (list.length === 0) return false;
  const i = list.indexOf(document.activeElement as HTMLElement);
  if (e.key === "ArrowDown") list[(i + 1) % list.length]?.focus();
  else if (e.key === "ArrowUp") list[(i - 1 + list.length) % list.length]?.focus();
  else if (e.key === "Home") list[0]?.focus();
  else if (e.key === "End") list[list.length - 1]?.focus();
  else return false;
  e.preventDefault();
  return true;
}

/* ── Root ─────────────────────────────────────────────────────────────────── */
export interface DropdownRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

function DropdownRoot({ open: controlled, defaultOpen = false, onOpenChange, className, children }: DropdownRootProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultOpen);
  const open = controlled ?? uncontrolled;
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const rid = React.useId();

  const setOpen = React.useCallback(
    (next: boolean, focusTrigger = false) => {
      if (controlled === undefined) setUncontrolled(next);
      onOpenChange?.(next);
      if (!next && focusTrigger) triggerRef.current?.focus();
    },
    [controlled, onOpenChange],
  );

  // light-dismiss : un clic hors de l'ancre ferme, sans voler le focus
  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open, setOpen]);

  const value = React.useMemo(
    () => ({ open, setOpen, triggerRef, menuId: `${rid}-menu`, triggerId: `${rid}-trigger` }),
    [open, setOpen, rid],
  );
  return (
    <Ctx.Provider value={value}>
      <div ref={rootRef} className={cn("relative inline-block", className)}>
        {children}
      </div>
    </Ctx.Provider>
  );
}
DropdownRoot.displayName = "Dropdown.Root";

/* ── Trigger ──────────────────────────────────────────────────────────────── */
export interface DropdownTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Rend l'élément enfant à la place du <button> (Radix Slot) — tout composant peut déclencher. */
  asChild?: boolean;
}

function DropdownTrigger({ asChild = false, onClick, onKeyDown, ...props }: DropdownTriggerProps) {
  const { open, setOpen, triggerRef, menuId, triggerId } = useDropdown();
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      ref={triggerRef}
      id={triggerId}
      type={asChild ? undefined : "button"}
      aria-haspopup="menu"
      aria-expanded={open}
      aria-controls={open ? menuId : undefined}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        if (!e.defaultPrevented) setOpen(!open);
      }}
      onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
        onKeyDown?.(e);
        if (e.defaultPrevented) return;
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          setOpen(true);
        }
      }}
      {...props}
    />
  );
}
DropdownTrigger.displayName = "Dropdown.Trigger";

/* ── Content : le menu ancré (popover) ────────────────────────────────────── */
export type DropdownSide = "top" | "bottom";
export type DropdownAlign = "start" | "center" | "end";

export interface DropdownContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** `auto` (défaut) : le côté se choisit selon l'espace disponible dans la fenêtre. */
  side?: DropdownSide | "auto";
  /** `auto` (défaut) : l'alignement se choisit pour que le menu tienne dans la fenêtre. */
  align?: DropdownAlign | "auto";
  /** Écart déclencheur ↔ menu, en px (défaut 4). */
  sideOffset?: number;
}

function DropdownContent({ side = "auto", align = "auto", sideOffset = 4, className, children, ...props }: DropdownContentProps) {
  const { open, setOpen, triggerRef, menuId, triggerId } = useDropdown();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [shown, setShown] = React.useState(false);
  const [placement, setPlacement] = React.useState<{ side: DropdownSide; align: DropdownAlign }>({
    side: side === "auto" ? "bottom" : side,
    align: align === "auto" ? "start" : align,
  });
  const { overflow, update: updateOverflow } = useOverflowVeils(menuRef);
  const highlight = useFluidHighlight(menuRef);
  const { reset: resetHighlight } = highlight;

  // à l'ouverture : 1. RÉSOUDRE le placement pendant que le menu est encore à opacité nulle
  // (mesure réelle du menu + de l'ancre face à la fenêtre — jamais d'estimation), 2. jouer la
  // transition d'entrée, 3. focus sur le premier item (le focus vit dans le menu)
  React.useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => {
      const menu = contentRef.current;
      const anchor = triggerRef.current;
      if (menu && anchor && (side === "auto" || align === "auto")) {
        const r = anchor.getBoundingClientRect();
        const mh = menu.offsetHeight + sideOffset;
        const mw = menu.offsetWidth;
        const spaceBelow = window.innerHeight - r.bottom;
        const resolvedSide: DropdownSide =
          side !== "auto" ? side : spaceBelow >= mh || spaceBelow >= r.top ? "bottom" : "top";
        const resolvedAlign: DropdownAlign =
          align !== "auto"
            ? align
            : r.left + mw <= window.innerWidth - 8
              ? "start"
              : r.right - mw >= 8
                ? "end"
                : "start";
        setPlacement({ side: resolvedSide, align: resolvedAlign });
      } else if (side !== "auto" || align !== "auto") {
        setPlacement({ side: side === "auto" ? "bottom" : side, align: align === "auto" ? "start" : align });
      }
      setShown(true);
      updateOverflow();
      menuRef.current?.querySelector<HTMLElement>(FOCUSABLE_ITEM)?.focus();
    });
    return () => {
      cancelAnimationFrame(raf);
      setShown(false);
      resetHighlight();
    };
  }, [open, side, align, sideOffset, triggerRef, updateOverflow, resetHighlight]);

  if (!open) return null;

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (navigateMenu(menuRef, e)) return;
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false, true);
    } else if (e.key === "Tab") {
      setOpen(false); // Tab sort du menu — il se referme sans piéger
    }
  };

  const { side: s, align: a } = placement;
  return (
    <div
      ref={contentRef}
      className={cn(
        "absolute z-popover w-max min-w-full max-w-menu overflow-hidden rounded-lg border border-border bg-background shadow-overlay",
        "transition-[opacity,transform] duration-fast ease-out motion-reduce:transition-none",
        s === "bottom" ? "top-full" : "bottom-full",
        a === "start" ? "left-0" : a === "end" ? "right-0" : "left-1/2 -translate-x-1/2",
        shown ? "opacity-100" : cn("opacity-0", s === "bottom" ? "translate-y-1" : "-translate-y-1"),
        className,
      )}
      style={{ [s === "bottom" ? "marginTop" : "marginBottom"]: sideOffset }}
      {...props}
    >
      <Veils overflow={overflow} />
      <div
        ref={menuRef}
        role="menu"
        id={menuId}
        aria-labelledby={triggerId}
        onKeyDown={onKeyDown}
        onScroll={updateOverflow}
        onMouseLeave={highlight.clear}
        className="ds-no-scrollbar relative max-h-72 w-full overflow-auto p-1 outline-none"
      >
        {highlight.node}
        <HighlightCtx.Provider value={highlight.value}>{children}</HighlightCtx.Provider>
      </div>
    </div>
  );
}
DropdownContent.displayName = "Dropdown.Content";

/* ── Inline : le même panneau, SANS déclencheur, posé dans le flux ────────── */
export interface DropdownInlineProps extends React.HTMLAttributes<HTMLDivElement> {}

function DropdownInline({ className, children, onKeyDown, ...props }: DropdownInlineProps) {
  const menuRef = React.useRef<HTMLDivElement>(null);
  const { overflow, update: updateOverflow } = useOverflowVeils(menuRef);
  const highlight = useFluidHighlight(menuRef);
  React.useEffect(() => {
    updateOverflow();
  }, [updateOverflow]);

  return (
    <div
      className={cn(
        // en flux : à plat — bordure délimitante, PAS d'élévation (le relief signale une
        // couche flottante ; ce panneau appartient à la page)
        "relative w-full min-w-40 max-w-menu overflow-hidden rounded-lg border border-border bg-background",
        className,
      )}
    >
      <Veils overflow={overflow} />
      <div
        ref={menuRef}
        role="menu"
        tabIndex={0}
        onFocus={(e) => {
          // le conteneur reçoit le Tab puis passe la main au premier item (roving interne)
          if (e.target === e.currentTarget)
            menuRef.current?.querySelector<HTMLElement>(FOCUSABLE_ITEM)?.focus();
        }}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          if (!e.defaultPrevented) navigateMenu(menuRef, e);
        }}
        onScroll={updateOverflow}
        onMouseLeave={highlight.clear}
        className="ds-no-scrollbar relative max-h-72 w-full overflow-auto p-1 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--control-focus-color)]"
        {...props}
      >
        {highlight.node}
        <HighlightCtx.Provider value={highlight.value}>{children}</HighlightCtx.Provider>
      </div>
    </div>
  );
}
DropdownInline.displayName = "Dropdown.Inline";

/* ── Item ─────────────────────────────────────────────────────────────────── */
const Check = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" className="ml-auto size-4 shrink-0 text-primary">
    <path d="M5 10l3.5 3.5L15 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export interface DropdownItemProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onSelect"> {
  /** Icône décorative à gauche (currentColor, 16px). */
  icon?: React.ReactNode;
  /** Action de l'item. */
  onSelect?: () => void;
  /** Radio-style : coche à droite + aria-checked (menuitemradio). Laisser undefined pour une action simple. */
  checked?: boolean;
  /** La sélection referme le menu ancré (défaut : true). Sans effet en Inline. */
  closeOnClick?: boolean;
}

function DropdownItem({ icon, checked, onSelect, closeOnClick = true, disabled, className, children, ...props }: DropdownItemProps) {
  // ctx nullable : un Item vit aussi dans Dropdown.Inline, hors de tout Root
  const ctx = React.useContext(Ctx);
  const hl = React.useContext(HighlightCtx);
  const ref = React.useRef<HTMLButtonElement>(null);
  return (
    <button
      ref={ref}
      type="button"
      role={checked !== undefined ? "menuitemradio" : "menuitem"}
      aria-checked={checked}
      data-disabled={disabled || undefined}
      disabled={disabled}
      tabIndex={-1}
      onMouseEnter={() => {
        if (disabled || !ref.current) return;
        ref.current.focus(); // le focus suit la souris : un seul item actif, le fond glisse
      }}
      onFocus={() => {
        if (ref.current) hl?.report(ref.current);
      }}
      onClick={() => {
        if (disabled) return;
        onSelect?.();
        if (closeOnClick) ctx?.setOpen(false, true);
      }}
      className={cn(
        // pas de bg de survol propre : LE fond glissant du menu s'en charge
        "relative z-[1] flex w-full items-center gap-sm rounded-sm px-sm py-1.5 text-left text-sm text-text-primary",
        "outline-none disabled:cursor-not-allowed disabled:text-text-disabled",
        className,
      )}
      {...props}
    >
      {icon ? <span aria-hidden="true" className="flex size-4 shrink-0 items-center justify-center text-text-secondary [&>svg]:size-4">{icon}</span> : null}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {checked ? <Check /> : null}
    </button>
  );
}
DropdownItem.displayName = "Dropdown.Item";

/* ── Label + Separator ────────────────────────────────────────────────────── */
function DropdownLabel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("relative z-[1] px-sm pb-1 pt-2 font-label text-[11px] font-semibold uppercase tracking-wider text-text-muted", className)}
      {...props}
    />
  );
}
DropdownLabel.displayName = "Dropdown.Label";

function DropdownSeparator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div role="separator" aria-orientation="horizontal" className={cn("relative z-[1] mx-1 my-1 h-px bg-border", className)} {...props} />;
}
DropdownSeparator.displayName = "Dropdown.Separator";

export const Dropdown = Object.assign(DropdownRoot, {
  Root: DropdownRoot,
  Trigger: DropdownTrigger,
  Content: DropdownContent,
  Inline: DropdownInline,
  Item: DropdownItem,
  Label: DropdownLabel,
  Separator: DropdownSeparator,
});
