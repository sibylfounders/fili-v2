"use client";
// Composant interactif : hooks, contexte ou primitive Radix au niveau module.
// Sans cette directive, une page serveur qui importe le baril @fili/react casse
// (createContext évalué dans le graphe RSC).
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

/**
 * Link — PROMET UNE DESTINATION (Button promet une action). Nouveau composant issu de
 * l'évolution DS-MD du 2026-07-20 (langage Interaction, DECISIONS.md « Interaction Language,
 * Adaptive Architecture et Link »), habillé par les tokens @fili/tokens existants — AUCUN
 * nouveau token (décision explicite de LINK-UI.md : couleur/focus/icône/motion suffisent).
 *
 * AXE : `context` = inline / standalone / navigation.
 *   - `inline` reste SOULIGNÉ AU REPOS — jamais une révélation tardive au hover (sinon le
 *     lien n'est identifiable qu'après coup, ce que le langage Interaction interdit).
 *   - `standalone` reste plus léger qu'un Button. Le jour où il lui faut un fond et une
 *     pression équivalente à un Button, c'est que Button aurait dû être choisi (LINK-UI.md).
 *   - `navigation` porte l'état courant de façon non chromatique (`current`) + `aria-current`.
 *
 * Focus : anneau v2 — cran subtil accordé (--control-focus-color, défaut primary éclairci),
 * géométrie unique de la fondation BORDER (cf. décision
 * D+ ouverte dans `foundations/mapping-autorite.md`).
 *
 * Sémantique : rend un vrai `<a>` (destination réelle, jamais un handler JS qui remplace
 * `href`) ; `asChild` permet un routeur externe (Next/Remix Link) via Radix Slot.
 */

const linkVariants = cva(
  [
    "inline-flex items-center gap-1.5 font-sans transition-colors duration-fast ease-out",
    "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--control-focus-color)]",
  ].join(" "),
  {
    variants: {
      // Souligné AU REPOS pour inline — jamais seulement au hover (cf. docstring).
      context: {
        inline: "text-primary underline underline-offset-2 hover:text-primary-hover",
        standalone: "text-primary hover:text-primary-hover hover:underline",
        navigation: "text-text-secondary hover:text-text-primary",
      },
    },
    defaultVariants: { context: "standalone" },
  },
);

type LinkCommonProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> &
  VariantProps<typeof linkVariants> & {
    /** Contexte `navigation` uniquement : destination courante — expose `aria-current` + un style non chromatique (jamais la seule couleur). */
    current?: boolean;
  };

/** Un Link natif exige une destination. `asChild` délègue éventuellement cette destination au routeur. */
export type LinkProps =
  | (LinkCommonProps & { asChild?: false; href: string })
  | (LinkCommonProps & { asChild: true; href?: string });

const LinkRoot = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, context = "standalone", asChild = false, current, "aria-current": ariaCurrentProp, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "a";
    const resolvedContext = context ?? "standalone";
    const ariaCurrent = ariaCurrentProp ?? (current ? "page" : undefined);
    return (
      <Comp
        ref={ref}
        aria-current={ariaCurrent}
        className={cn(
          linkVariants({ context: resolvedContext }),
          current && resolvedContext === "navigation" && "font-medium text-text-primary",
          className,
        )}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);
LinkRoot.displayName = "Link.Root";

/** Icône — currentColor. `sm` en contexte inline, `md` en standalone (LINK-UI.md). Placement (leading/trailing/only) = composition JSX, pas une prop. */
const LinkIconSlot = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { size?: "sm" | "md" }
>(({ className, size = "md", ...props }, ref) => (
  <span
    ref={ref}
    aria-hidden="true"
    className={cn("inline-flex shrink-0", size === "sm" ? "[&>svg]:size-4" : "[&>svg]:size-5", className)}
    {...props}
  />
));
LinkIconSlot.displayName = "Link.Icon";

export const Link = Object.assign(LinkRoot, { Root: LinkRoot, Icon: LinkIconSlot });
export { LinkRoot, LinkIconSlot as LinkIcon, linkVariants };
