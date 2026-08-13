"use client";
// Composant interactif : hooks, contexte ou primitive Radix au niveau module.
// Sans cette directive, une page serveur qui importe le baril @fili/react casse
// (createContext évalué dans le graphe RSC).
import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * Accordion — disclosure réutilisable (DS-MD RULES-accordion). MULTI-OUVERT par défaut : plusieurs
 * sections ouvertes à la fois, chacune garde son état, rien n'est détruit à la fermeture. `type="single"`
 * referme les autres (option, pas la règle). Ce n'est PAS un superposé : le focus entre et sort librement.
 *
 * Compound : Accordion.Root / .Item / .Header (bouton, aria-expanded) / .Panel (région, aria-labelledby).
 * Clavier : Entrée/Espace sur l'en-tête (natif <button>). Le chevron pivote (état non chromatique).
 */
type AccordionType = "single" | "multiple";
interface AccCtx {
  open: Set<string>;
  toggle: (id: string) => void;
}
const Ctx = React.createContext<AccCtx | null>(null);
interface ItemCtx {
  value: string;
  headerId: string;
  panelId: string;
  isOpen: boolean;
}
const ItemCtxObj = React.createContext<ItemCtx | null>(null);

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: AccordionType;
  defaultOpen?: string[];
}
export function AccordionRoot({ type = "multiple", defaultOpen = [], className, children, ...props }: AccordionProps) {
  const [open, setOpen] = React.useState<Set<string>>(() => new Set(defaultOpen));
  const toggle = React.useCallback(
    (id: string) =>
      setOpen((prev) => {
        const n = new Set(prev);
        if (n.has(id)) n.delete(id);
        else {
          if (type === "single") n.clear();
          n.add(id);
        }
        return n;
      }),
    [type],
  );
  return (
    <div className={cn("flex flex-col", className)} {...props}>
      <Ctx.Provider value={{ open, toggle }}>{children}</Ctx.Provider>
    </div>
  );
}
AccordionRoot.displayName = "Accordion.Root";

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}
export function AccordionItem({ value, className, children, ...props }: AccordionItemProps) {
  const ctx = React.useContext(Ctx);
  const rid = React.useId();
  const isOpen = !!ctx?.open.has(value);
  return (
    <ItemCtxObj.Provider value={{ value, headerId: `${rid}-h`, panelId: `${rid}-p`, isOpen }}>
      <div className={cn(className)} {...props}>
        {children}
      </div>
    </ItemCtxObj.Provider>
  );
}
AccordionItem.displayName = "Accordion.Item";

export interface AccordionHeaderProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  level?: 2 | 3 | 4 | 5 | 6;
}
export function AccordionHeader({ level = 3, className, children, ...props }: AccordionHeaderProps) {
  const ctx = React.useContext(Ctx);
  const item = React.useContext(ItemCtxObj);
  const H = `h${level}` as keyof React.JSX.IntrinsicElements;
  if (!item) return null;
  return (
    <H style={{ margin: 0 }}>
      <button
        type="button"
        id={item.headerId}
        aria-expanded={item.isOpen}
        aria-controls={item.panelId}
        onClick={() => ctx?.toggle(item.value)}
        className={cn(
          "flex w-full items-center justify-between gap-sm rounded-md px-sm py-2 text-left text-sm font-medium text-text-primary",
          "hover:bg-surface-hover transition-colors duration-fast ease-out",
          "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--control-focus-color)]",
          className,
        )}
        {...props}
      >
        <span>{children}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className={cn(
            "size-4 shrink-0 text-text-muted transition-transform duration-base ease-in-out motion-reduce:transition-none",
            item.isOpen && "rotate-90",
          )}
        >
          <path d="M8 5l6 5-6 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </H>
  );
}
AccordionHeader.displayName = "Accordion.Header";

export function AccordionPanel({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const item = React.useContext(ItemCtxObj);
  if (!item) return null;
  return (
    <div
      id={item.panelId}
      role="region"
      aria-labelledby={item.headerId}
      hidden={!item.isOpen}
      className={cn("px-sm pb-sm pt-1", className)}
      {...props}
    >
      {children}
    </div>
  );
}
AccordionPanel.displayName = "Accordion.Panel";

export const Accordion = Object.assign(AccordionRoot, {
  Root: AccordionRoot,
  Item: AccordionItem,
  Header: AccordionHeader,
  Panel: AccordionPanel,
});
