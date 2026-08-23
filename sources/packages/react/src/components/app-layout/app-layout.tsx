"use client";
import * as React from "react";
import { cn } from "../../lib/cn";
import { InputRoot, InputWrapper, InputSearch } from "../input/input";
import "./app-layout.css";
import { navRowClass, navGroupLabelClass } from "../nav/nav";

/**
 * AppLayout — FAÇADE à options du shell applicatif (DS-MD « Shell applicatif »).
 * Tout se pilote par options : variant ("default" | "docs"), brand, nav, topbar,
 * aside, sidebar repliable. La primitive AppShell reste disponible (bas niveau).
 *
 * RESPONSIVE : piloté par la LARGEUR DU SHELL (container query), pas le viewport —
 *   ≥ 1280 : sidebar + aside ;  1024–1280 : sidebar seule ;  < 1024 : off-canvas (Drawer).
 * REPLI : toggle = rail d'icônes ↔ étendu quand le shell est large (variant "docs" : masqué) ;
 *   quand le shell est étroit, le toggle ouvre l'off-canvas (fondation overlay).
 * ASIDE < 1280 : le rail droit devient off-canvas, invocable par un FAB (bas droite,
 *   RULES-button « un seul par écran ») — même mécanique CSS mono-nœud que la sidebar
 *   (les portails du consommateur, ex. #section-tools, survivent : le nœud ne se démonte pas).
 */

export type ShellVariant = "default" | "docs";

export interface AppNavItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  active?: boolean;
  onSelect?: () => void;
  items?: AppNavItem[];
}
export interface AppNavGroup {
  label?: string;
  items: AppNavItem[];
}
export interface AppTopbar {
  breadcrumb?: React.ReactNode;
  search?: React.ReactNode | boolean;
  actions?: React.ReactNode;
}
export interface AppLayoutProps {
  variant?: ShellVariant;
  brand?: React.ReactNode;
  brandMark?: React.ReactNode; // logo seul, affiché quand la sidebar est repliée (rail)
  sidebar?: React.ReactNode;   // contenu de sidebar sur-mesure (remplace brand+nav) — échappatoire
  nav?: AppNavGroup[] | AppNavItem[];
  topbar?: AppTopbar;
  aside?: React.ReactNode;
  asideLabel?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  sidebarFooter?: React.ReactNode;
  boundedContent?: boolean;
  contentPadding?: boolean;   // padding interne du contenu (défaut true) — false si le contenu gère le sien
  className?: string;
  children: React.ReactNode;
}

const IconPanel = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18" />
  </svg>
);
/* FAB de l'aside (réglages) : curseurs — ouvert, il devient une croix (fermer). */
const IconSliders = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" />
  </svg>
);
const IconClose = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </svg>
);

function toGroups(nav?: AppNavGroup[] | AppNavItem[]): AppNavGroup[] {
  if (!nav || !Array.isArray(nav) || nav.length === 0) return [];
  return "items" in (nav[0] as AppNavGroup) ? (nav as AppNavGroup[]) : [{ items: nav as AppNavItem[] }];
}

/** Largeur du shell (px) via ResizeObserver — pilote la logique JS du toggle. */
function useWidth() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [w, setW] = React.useState(0);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((e) => setW(Math.round(e[0]?.contentRect.width ?? el.clientWidth)));
    ro.observe(el);
    setW(Math.round(el.clientWidth));
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

function NavRow({ item, collapsed, depth = 0, onNavigate }: { item: AppNavItem; collapsed: boolean; depth?: number; onNavigate?: () => void }) {
  const Cmp: any = item.href ? "a" : "button";
  const kids = item.items?.length ? item.items : null;
  return (
    <>
      <Cmp
        {...(item.href ? { href: item.href } : { type: "button" })}
        onClick={() => { item.onSelect?.(); onNavigate?.(); }}
        aria-current={item.active ? "page" : undefined}
        title={collapsed ? item.label : undefined}
        className={/* facture UNIQUE de la rangée de nav (nav/navRowClass) — plus de recopie locale */ navRowClass(
          item.active,
          cn(collapsed && "justify-center px-0", !collapsed && depth > 0 && "ml-3 border-l border-border pl-3 text-sm"),
        )}
      >
        {item.icon ? (
          <span className="flex h-4 w-4 shrink-0 items-center justify-center">{item.icon}</span>
        ) : collapsed ? (
          <span className="h-1.5 w-1.5 rounded-pill bg-current opacity-40" />
        ) : null}
        {!collapsed ? <span className="min-w-0 flex-1 truncate">{item.label}</span> : null}
        {!collapsed && item.badge ? (
          <span className="rounded-pill bg-success-subtle px-1.5 py-0.5 text-2xs font-semibold text-success">{item.badge}</span>
        ) : null}
      </Cmp>
      {kids && !collapsed ? kids.map((c, i) => <NavRow key={i} item={c} collapsed={false} depth={depth + 1} onNavigate={onNavigate} />) : null}
    </>
  );
}

function SidebarBody({ brand, brandMark, groups, collapsed, footer, onNavigate }: {
  brand?: React.ReactNode; brandMark?: React.ReactNode; groups: AppNavGroup[]; collapsed: boolean; footer?: React.ReactNode; onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col gap-lg overflow-y-auto p-md">
      {brand || brandMark ? (
        <div className={cn("flex h-10 items-center", collapsed ? "justify-center" : "px-sm")}>{collapsed ? (brandMark ?? brand) : brand}</div>
      ) : null}
      <nav aria-label="Navigation principale" className="flex flex-1 flex-col gap-lg">
        {groups.map((g, gi) => (
          <div key={gi} className="flex flex-col gap-0.5">
            {g.label && !collapsed ? (
              <p className={navGroupLabelClass}>{g.label}</p>
            ) : null}
            {g.items.map((it, ii) => <NavRow key={ii} item={it} collapsed={collapsed} onNavigate={onNavigate} />)}
          </div>
        ))}
      </nav>
      {footer && !collapsed ? <div className="mt-auto border-t border-border pt-md">{footer}</div> : null}
    </div>
  );
}

export function AppLayout({
  variant = "default",
  brand,
  brandMark,
  sidebar,
  nav,
  topbar,
  aside,
  asideLabel = "Panneau",
  collapsible = true,
  defaultCollapsed = false,
  sidebarFooter,
  boundedContent,
  contentPadding = true,
  className,
  children,
}: AppLayoutProps) {
  const groups = React.useMemo(() => toGroups(nav), [nav]);
  const [collapsed, setCollapsed] = React.useState(!!defaultCollapsed);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [asideOpen, setAsideOpen] = React.useState(false);
  const [rootRef, width] = useWidth();
  const isWide = width === 0 ? true : width >= 1024; // seuil sidebar (container)
  const isDesktop = width === 0 ? true : width >= 1280; // seuil aside (container)
  const docs = variant === "docs";
  const bounded = boundedContent ?? docs;

  const hasCustomSidebar = sidebar != null;
  // toggle : large → seulement default à nav structurée (rail) ; docs/sidebar custom = fixe.
  // étroit → hamburger off-canvas dans tous les cas.
  const canToggle = collapsible && (isWide ? (!docs && !hasCustomSidebar) : true);
  const railCollapsed = collapsed && isWide && !docs && !hasCustomSidebar;
  const onToggle = () => { if (!isWide) setMobileOpen(true); else setCollapsed((c) => !c); };
  React.useEffect(() => { if (isWide) setMobileOpen(false); }, [isWide]);
  React.useEffect(() => { if (isDesktop) setAsideOpen(false); }, [isDesktop]);
  React.useEffect(() => {
    if (!mobileOpen && !asideOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMobileOpen(false);
      setAsideOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen, asideOpen]);
  const sidebarNode = (rail: boolean) =>
    sidebar ?? <SidebarBody brand={brand} brandMark={brandMark} groups={groups} collapsed={rail} footer={sidebarFooter} />;

  // La barre de recherche est l'INPUT DU SYSTÈME (Input compound, type search) — jamais un
  // champ ad hoc : elle hérite bordure délimitante, tailles, focus ring et relief « creusé ».
  const searchNode =
    topbar?.search === true ? (
      <InputRoot size="sm" className="w-full">
        <InputWrapper>
          <InputSearch
            placeholder={`Rechercher${docs ? " la doc" : ""}…`}
            aria-label="Rechercher"
            className="text-sm"
          />
          <kbd className="shrink-0 rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-2xs text-text-secondary">⌘K</kbd>
        </InputWrapper>
      </InputRoot>
    ) : topbar?.search ? (
      topbar.search
    ) : null;

  return (
    <div ref={rootRef} className={cn("sw-shell flex min-h-full w-full bg-background text-text-primary", className)}>
      {/* Scrim off-canvas (shell étroit uniquement) */}
      {mobileOpen ? <div className="sw-shell-scrim absolute inset-0 z-30 bg-scrim" aria-hidden="true" onClick={() => setMobileOpen(false)} /> : null}
      {/* Sidebar UNIQUE : off-canvas (étroit) ↔ fixe en flux (large), piloté en CSS (container). */}
      <aside
        data-open={mobileOpen ? "true" : "false"}
        aria-label="Navigation"
        className={cn("sw-shell-sidebar shrink-0 border-r border-border bg-surface", railCollapsed ? "w-16" : "w-rail-nav")}
        onClick={(e) => {
          // L'off-canvas se referme après une NAVIGATION (lien ou bouton de nav) — jamais quand
          // on manipule un contrôle qui reste dans le tiroir : Select (combobox + listbox),
          // Switch, Dropdown (menu + items), ou tout déclencheur de popup. Bug corrigé
          // 2026-07-29 : le sélecteur de section refermait le tiroir au premier clic ; complété
          // le soir même : les items de menu (role="menuitem*" dans role="menu") n'étaient pas
          // couverts — un clic dans un Dropdown refermait encore le tiroir.
          const t = (e.target as HTMLElement).closest("a,button");
          if (!t) return;
          if (t.closest('[role="combobox"],[role="listbox"],[role="switch"],[role="menu"],[aria-haspopup]')) return;
          setMobileOpen(false);
        }}
      >
        {sidebarNode(railCollapsed)}
      </aside>

      {/* Colonne de droite : topbar + contenu (+ aside) */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-sm border-b border-border bg-background px-md">
          {canToggle ? (
            <button
              type="button"
              onClick={onToggle}
              aria-label="Basculer le menu"
              aria-expanded={isWide ? !collapsed : mobileOpen}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
            >
              {IconPanel}
            </button>
          ) : null}
          {topbar?.breadcrumb ? (
            <div className="flex min-w-0 items-center gap-2 overflow-hidden whitespace-nowrap text-sm text-text-secondary [&>*]:truncate">
              {topbar.breadcrumb}
            </div>
          ) : null}
          {searchNode ? (
            <div className="flex flex-1 justify-center px-sm"><div className="w-full max-w-md">{searchNode}</div></div>
          ) : (
            <div className="flex-1" />
          )}
          {topbar?.actions ? <div className="flex shrink-0 items-center gap-1">{topbar.actions}</div> : null}
        </header>

        <div className="flex min-h-0 min-w-0 flex-1">
          <main className="min-w-0 flex-1 overflow-y-auto">
            <div className={cn(contentPadding && "sw-shell-main-pad", bounded && "mx-auto w-full max-w-[880px]")}>{children}</div>
          </main>
          {aside ? (
            <aside
              data-open={asideOpen ? "true" : "false"}
              aria-label={asideLabel}
              className="sw-shell-aside w-rail-tools shrink-0 overflow-y-auto overscroll-contain border-l border-border bg-surface"
            >
              {aside}
            </aside>
          ) : null}
        </div>
      </div>

      {/* Scrim + FAB de l'aside (shell < desktop uniquement — masqués en CSS au-delà).
          Un seul FAB par écran (RULES-button) ; ouvert, il devient le bouton de fermeture. */}
      {aside && asideOpen ? (
        <div className="sw-shell-aside-scrim absolute inset-0 z-30 bg-scrim" aria-hidden="true" onClick={() => setAsideOpen(false)} />
      ) : null}
      {aside ? (
        <button
          type="button"
          onClick={() => setAsideOpen((o) => !o)}
          aria-label={asideOpen ? `Fermer : ${asideLabel}` : `Ouvrir : ${asideLabel}`}
          aria-expanded={asideOpen}
          className={cn(
            "sw-shell-fab flex h-[52px] w-[52px] items-center justify-center rounded-pill bg-primary text-on-primary shadow-overlay",
            "transition-colors duration-fast ease-out hover:bg-primary-hover",
            "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--control-focus-color)]",
          )}
        >
          {asideOpen ? IconClose : IconSliders}
        </button>
      ) : null}
    </div>
  );
}
