"use client";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";
import "../../lib/no-scrollbar.css";

/**
 * Tabs — un seul jeu de contenus, plusieurs volets, un seul visible. Ce n'est PAS un superposé
 * (rien ne recouvre) et ce n'est PAS un Accordion (qui peut tout ouvrir à la fois) : ici un seul
 * volet est monté à l'écran et le choix est exclusif.
 *
 * Modèle ARIA APG « Tabs » : tablist / tab / tabpanel, `aria-selected`, `aria-controls`,
 * tabindex mouvant (un seul onglet dans l'ordre de tabulation), flèches ← → pour circuler,
 * Origine/Fin pour les extrêmes. Activation `auto` par défaut (le volet suit le focus — sans coût,
 * les panneaux sont déjà là) ; `manual` si un volet devient coûteux à monter.
 *
 * Signal de l'onglet courant NON CHROMATIQUE (poids + trait porteur), comme Nav.Link — la couleur
 * seule ne dit jamais l'état (COLOR-UX « jamais la couleur seule »).
 *
 * Deux factures : `line` (trait sous l'onglet — les volets d'une fiche de doctrine) et
 * `pill` (segmenté en pastille — les bascules courtes d'un atelier). Tokens uniquement.
 */

type Activation = "auto" | "manual";
type TabsCtx = {
  value: string;
  setValue: (v: string) => void;
  baseId: string;
  variant: "line" | "pill";
  activation: Activation;
  register: (v: string) => void;
  values: React.MutableRefObject<string[]>;
};
const Ctx = React.createContext<TabsCtx | null>(null);
const useTabs = (): TabsCtx => {
  const c = React.useContext(Ctx);
  if (!c) throw new Error("Tabs.* doit vivre dans <Tabs.Root>");
  return c;
};

const tabVariants = cva(
  [
    "relative inline-flex shrink-0 items-center gap-2 whitespace-nowrap font-medium",
    "transition-colors duration-fast ease-out",
    "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--control-focus-color)]",
    "disabled:cursor-not-allowed disabled:text-text-disabled",
  ].join(" "),
  {
    variants: {
      variant: {
        line: "border-b-2 border-transparent px-sm pb-sm pt-1 text-sm",
        pill: "rounded-pill px-md py-1.5 text-xs",
      },
      current: { true: "", false: "text-text-secondary hover:text-text-primary" },
    },
    compoundVariants: [
      { variant: "line", current: true, class: "border-primary font-semibold text-text-primary" },
      { variant: "line", current: false, class: "hover:border-border-strong" },
      { variant: "pill", current: true, class: "bg-surface font-semibold text-text-primary shadow-raised" },
    ],
    defaultVariants: { variant: "line", current: false },
  },
);

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: "line" | "pill";
  activation?: Activation;
}

export function TabsRoot({
  value: controlled,
  defaultValue,
  onValueChange,
  variant = "line",
  activation = "auto",
  className,
  children,
  ...props
}: TabsProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue ?? "");
  const value = controlled ?? uncontrolled;
  const values = React.useRef<string[]>([]);
  const setValue = React.useCallback(
    (v: string) => {
      if (controlled === undefined) setUncontrolled(v);
      onValueChange?.(v);
    },
    [controlled, onValueChange],
  );
  const register = React.useCallback((v: string) => {
    if (!values.current.includes(v)) values.current.push(v);
  }, []);
  const baseId = React.useId();

  // Sans valeur initiale, le premier onglet monté prend la main.
  React.useEffect(() => {
    if (!value && values.current.length) setValue(values.current[0]);
  }, [value, setValue]);

  return (
    <Ctx.Provider value={{ value, setValue, baseId, variant, activation, register, values }}>
      <div className={cn("flex flex-col", className)} {...props}>
        {children}
      </div>
    </Ctx.Provider>
  );
}
TabsRoot.displayName = "Tabs.Root";

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Étiquette du jeu d'onglets — obligatoire (repère annoncé au lecteur d'écran). */
  label: string;
}

export function TabsList({ label, className, children, ...props }: TabsListProps) {
  const { variant, value, setValue, values, activation } = useTabs();
  const ref = React.useRef<HTMLDivElement>(null);
  // Signal de débordement horizontal : selon la largeur reçue, des onglets peuvent être hors
  // champ — voiles dégradés + chevrons gauche/droite (même mécanique que la listbox du Select,
  // rapport utilisateur 2026-07-29). Barre de scroll masquée : le voile est le signal.
  const [ov, setOv] = React.useState({ start: false, end: false });
  const updateOverflow = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setOv({
      start: el.scrollLeft > 2,
      end: el.scrollLeft + el.clientWidth < el.scrollWidth - 2,
    });
  }, []);
  React.useEffect(() => {
    updateOverflow();
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(updateOverflow);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateOverflow]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const dispo = values.current;
    if (dispo.length === 0) return;
    const i = dispo.indexOf(value);
    let cible: string | null = null;
    if (e.key === "ArrowRight") cible = dispo[(i + 1) % dispo.length];
    else if (e.key === "ArrowLeft") cible = dispo[(i - 1 + dispo.length) % dispo.length];
    else if (e.key === "Home") cible = dispo[0];
    else if (e.key === "End") cible = dispo[dispo.length - 1];
    if (!cible) return;
    e.preventDefault();
    // Activation auto : le volet suit le focus. Manuelle : on ne déplace que le focus.
    if (activation === "auto") setValue(cible);
    ref.current?.querySelector<HTMLElement>(`[data-valeur="${cible}"]`)?.focus();
  };

  const veilChevron = (d: "left" | "right") => (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-3.5 shrink-0 text-text-muted">
      <path d={d === "left" ? "M12 6l-4 4 4 4" : "M8 6l4 4-4 4"} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <div
      className={cn(
        "relative",
        // pill : le contenant s'ajuste à la largeur des pastilles, jamais full-width
        variant === "pill" && "w-fit max-w-full self-start rounded-pill border border-border bg-background",
      )}
    >
      <div
        ref={ref}
        role="tablist"
        aria-label={label}
        aria-orientation="horizontal"
        onKeyDown={onKeyDown}
        onScroll={updateOverflow}
        className={cn(
          "ds-no-scrollbar flex items-center overflow-x-auto",
          variant === "line" ? "gap-lg border-b border-border" : "gap-0.5 p-[3px]",
          className,
        )}
        {...props}
      >
        {children}
      </div>
      {/* voiles de débordement — pointer-events-none, purement informatifs */}
      {ov.start ? (
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 z-[1] flex w-8 items-center justify-start bg-gradient-to-r from-background to-transparent pl-0.5",
            variant === "pill" && "rounded-l-pill",
          )}
        >
          {veilChevron("left")}
        </div>
      ) : null}
      {ov.end ? (
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-y-0 right-0 z-[1] flex w-8 items-center justify-end bg-gradient-to-l from-background to-transparent pr-0.5",
            variant === "pill" && "rounded-r-pill",
          )}
        >
          {veilChevron("right")}
        </div>
      ) : null}
    </div>
  );
}
TabsList.displayName = "Tabs.List";

export interface TabProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  value: string;
}

export function TabsTab({ value: v, className, children, ...props }: TabProps) {
  const { value, setValue, baseId, variant, register } = useTabs();
  const current = value === v;
  React.useLayoutEffect(() => register(v), [register, v]);
  return (
    <button
      type="button"
      role="tab"
      id={`${baseId}-tab-${v}`}
      data-valeur={v}
      aria-selected={current}
      aria-controls={`${baseId}-volet-${v}`}
      tabIndex={current ? 0 : -1}
      onClick={() => setValue(v)}
      className={cn(tabVariants({ variant, current }), className)}
      {...props}
    >
      {children}
    </button>
  );
}
TabsTab.displayName = "Tabs.Tab";

export interface TabsPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  /** Garder le volet monté quand il n'est pas courant (défaut : false — il est démonté). */
  keepMounted?: boolean;
}

export function TabsPanel({ value: v, keepMounted = false, className, children, ...props }: TabsPanelProps) {
  const { value, baseId } = useTabs();
  const current = value === v;
  if (!current && !keepMounted) return null;
  return (
    <div
      role="tabpanel"
      id={`${baseId}-volet-${v}`}
      aria-labelledby={`${baseId}-tab-${v}`}
      hidden={!current}
      tabIndex={0}
      className={cn("outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--control-focus-color)]", className)}
      {...props}
    >
      {children}
    </div>
  );
}
TabsPanel.displayName = "Tabs.Panel";

export const Tabs = Object.assign(TabsRoot, {
  Root: TabsRoot,
  List: TabsList,
  Tab: TabsTab,
  Panel: TabsPanel,
});

export { tabVariants };
