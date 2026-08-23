"use client";
// Composant interactif : hooks, contexte ou primitive Radix au niveau module.
// Sans cette directive, une page serveur qui importe le baril @fili/react casse
// (createContext évalué dans le graphe RSC).
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";
import { INTERACTION_MODE_CURSOR, type InteractionMode } from "../../lib/interaction";
import { LinkRoot } from "../link/link";
import { useCollectionContext, useCollectionItem } from "../card-group/collection-context";
import "../../lib/focus.css";
import "./card.css";

/**
 * Card — conteneur qui ORGANISE et donne accès à du contenu ; il ne déclenche jamais
 * d'action lui-même (Button) et ne navigue jamais sans un vrai lien (Link, Card.TitleLink).
 * Construit sur les RÈGLES de Design System MD — langage **Interaction** (relief = signal,
 * jamais décor) + principe **Adaptive** (le conteneur pilote le composant) — habillé par les
 * tokens @fili/tokens. Cf. `foundations/relief-adaptive.md` pour le contexte de ces deux
 * autorités (évolution DS-MD du 2026-07-20).
 *
 * AXES DS-MD, volontairement différents de Button/Input : `mode` (interaction_mode) ×
 * `density` — PAS de tone (le conteneur n'a pas de sémantique propre), PAS de style au sens
 * de Button : outlined/elevated est une décision d'identité visuelle fixée une fois pour tout
 * le produit (outlined au repos, elevated réservé au hover d'une carte clickable), pas un
 * choix par instance (cf. CARD-UX.md/CARD-UI.md, DECISIONS.md 2026-07-20).
 *
 * RELIEF = SIGNAL, JAMAIS DÉCOR (langage Interaction) : repos = `shadow-none` sur TOUS les
 * modes, sans exception. Le relief n'apparaît que sur `mode="clickable"`, uniquement au
 * hover/focus, via un pseudo-élément pré-rendu animé en OPACITÉ (card.css) — jamais un
 * box-shadow interpolé (coûteux, cf. note motion de CARD-UI.md). Card est l'exemple canonique
 * du langage : le SEUL composant qui « a besoin » de relief, et seulement là — le généraliser
 * à toutes les cartes ou à l'état de repos tuerait le signal d'affordance.
 *
 * ADAPTIVE = LE CONTENEUR, PAS LE VIEWPORT (principe Adaptive) : `Card.Root` est son propre
 * conteneur de requête (`container-type: inline-size`, card.css) ; sa disposition interne
 * (media en haut vs à côté du contenu) réagit à SA largeur réelle via `@container`, jamais à
 * un breakpoint de fenêtre. La grille de collection qui héberge la Card décide de son nombre
 * de colonnes (autorité page) ; la Card décide de sa disposition interne (autorité composant)
 * — deux autorités qui ne se mélangent jamais (ADAPTIVE-UX.md).
 */

// L'axe mode n'appartient plus à Card : c'est l'axe transversal du langage Interaction
// (lib/interaction — INTERACTION-R26…R28, arbitrage 2026-07-29). Card en est le premier
// consommateur ; l'alias reste exporté pour l'API existante.
type CardInteractionMode = InteractionMode;
type CardDensity = "comfortable" | "compact";

/**
 * Circulation clavier d'un choix EXCLUSIF de cartes (APG Radio Group). Les quatre flèches
 * sont actives parce qu'une collection est une grille : « suivant » est à droite quand il y
 * a plusieurs colonnes, en dessous quand il n'y en a qu'une — et l'utilisateur ne sait pas
 * laquelle il regarde. Aucune ne dépend de la direction du texte ici : l'ordre suivi est
 * celui du DOM, qui est celui de la lecture.
 */
const FLECHES: Record<string, number> = {
  ArrowRight: 1,
  ArrowDown: 1,
  ArrowLeft: -1,
  ArrowUp: -1,
};

const CardContext = React.createContext<{ mode: CardInteractionMode; density: CardDensity }>({
  mode: "static",
  density: "comfortable",
});

const rootVariants = cva(
  [
    // Le Root mesure l'espace disponible. La surface interne, descendante du conteneur,
    // porte le rendu et peut donc être modifiée par @container (card.css).
    "group/card relative w-full",
  ].join(" "),
  {
    variants: {
      // Le curseur annonce l'affordance ; le relief (::before, lib/interaction.css) ne
      // réagit qu'au hover/focus — jamais au repos. Voir « Relief = signal » dans la docstring.
      mode: INTERACTION_MODE_CURSOR,
      density: {
        comfortable: "",
        compact: "",
      },
    },
    defaultVariants: { mode: "static", density: "comfortable" },
  },
);

export interface CardRootProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof rootVariants> {
  /**
   * Carte selectable : état sélectionné. En mode `selectable`, la carte l'expose elle-même —
   * `role="button"` + `aria-pressed`, anneau de focus, et coche non chromatique en plus de la
   * bordure `color.primary` (CARD-UI.md : « selected_border PLUS un indicateur non chromatique,
   * et l'état exposé techniquement »). La collection qui l'héberge n'a pas à le refaire.
   */
  selected?: boolean;
  /**
   * Mode selectable : bascule de l'état. C'est la CARTE qui porte l'interaction (clic sur la
   * surface hors actions/cibles internes, Espace/Entrée au clavier) — autorité CARD, la
   * collection n'a pas à refaire cette mécanique (rétablissement des frontières 2026-07-30).
   */
  onSelectedChange?: (selected: boolean) => void;
  /**
   * Valeur de la carte dans un `CardGroup` qui déclare un régime de sélection
   * (`selection="single" | "multiple"`, CARD-R26). Obligatoire dans ce cas — sans elle, la
   * collection ne peut pas dire laquelle est retenue et le groupe échoue explicitement.
   * Inutile ailleurs : hors régime, la carte reste autonome (`selected`/`onSelectedChange`).
   */
  value?: string;
  /**
   * Autorise le passage en disposition horizontale (media à côté du contenu) quand le
   * conteneur a assez de largeur — état `regular` de l'Architecture adaptative. Désactiver
   * pour une carte qui doit rester empilée quelle que soit la largeur reçue. Défaut : true.
   */
  adaptiveMedia?: boolean;
  /** Rend la carte en squelette (Card.Skeleton) — mêmes dimensions de collection. */
  loading?: boolean;
}

const CardRoot = React.forwardRef<HTMLDivElement, CardRootProps>(
  (
    {
      className,
      mode,
      density,
      selected,
      onSelectedChange,
      value,
      adaptiveMedia = true,
      loading = false,
      onClick,
      onKeyDown,
      children,
      ...props
    },
    ref,
  ) => {
    // La collection (CardGroup) fournit des DÉFAUTS via son contexte ; une prop explicite
    // les surclasse — c'est ainsi qu'une carte sans cible reste `static` dans une
    // collection interactive. Hors collection : défauts propres de Card.
    const collection = useCollectionContext();
    const rang = useCollectionItem();
    if (loading) return <CardSkeleton className={className} />;
    const resolvedMode: CardInteractionMode = mode ?? collection?.mode ?? "static";
    const resolvedDensity: CardDensity = density ?? collection?.density ?? "comfortable";

    // ── Régime de sélection : la collection décide COMMENT on choisit (CARD-R26) ──────
    // La carte garde ce qui lui appartient — le rendu de son état, sa bascule, son clavier —
    // mais ne prétend plus être seule au monde : sous un régime, c'est le groupe qui dit ce
    // qui est retenu, parce que « une seule à la fois » ne peut pas se décider carte par carte.
    const regime = resolvedMode === "selectable" ? (collection?.selection ?? null) : null;
    const retenue = regime && value !== undefined ? collection!.estRetenue(value) : !!selected;
    const bascule = () => {
      if (regime && value !== undefined) collection!.basculer(value);
      else onSelectedChange?.(!retenue);
    };
    // Un seul arrêt de tabulation dans un choix exclusif : la tabulation entre sur l'option
    // retenue, ou à défaut sur la première (APG Radio Group). En cumulable, chaque carte est
    // un arrêt — c'est le clavier d'une case à cocher, et il est déjà juste.
    const tabIndex =
      regime === "single" ? (retenue || (!collection!.aRetenue && rang?.index === 0) ? 0 : -1) : 0;
    // `role="button"` + `aria-pressed` reste la forme AUTONOME (une carte qui s'enfonce).
    // Sous régime, la carte prend le rôle que CARD-R25 nomme explicitement : case ou bouton
    // radio. Les attributs restent surchargeables (`{...props}` passe après).
    const sel =
      resolvedMode === "selectable"
        ? regime === "single"
          ? { role: "radio" as const, tabIndex, "aria-checked": retenue }
          : regime === "multiple"
            ? { role: "checkbox" as const, tabIndex, "aria-checked": retenue }
            : { role: "button" as const, tabIndex: 0, "aria-pressed": retenue }
        : null;
    const handleClick =
      resolvedMode === "selectable"
        ? (e: React.MouseEvent<HTMLDivElement>) => {
            onClick?.(e);
            if (e.defaultPrevented) return;
            // Les cibles internes (actions, liens, boutons) restent des cibles distinctes :
            // les manipuler ne bascule pas la sélection.
            const t = e.target as HTMLElement;
            if (t !== e.currentTarget && t.closest("a,button,input,select,textarea,.ds-card-actions")) return;
            bascule();
          }
        : onClick;
    const handleKeyDown =
      resolvedMode === "selectable"
        ? (e: React.KeyboardEvent<HTMLDivElement>) => {
            onKeyDown?.(e);
            if (e.defaultPrevented) return;
            if (e.target !== e.currentTarget) return;
            // Choix exclusif : les flèches circulent ET retiennent (APG). Le déplacement est
            // demandé à la collection, seule à connaître l'ordre des items.
            if (regime === "single" && rang && FLECHES[e.key] !== undefined) {
              e.preventDefault();
              collection!.deplacer(rang.index, FLECHES[e.key]);
              return;
            }
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              // Un radio déjà retenu ne se dé-coche pas : rechoisir la même option ne fait rien.
              if (regime === "single" && retenue) return;
              bascule();
            }
          }
        : onKeyDown;
    return (
      <CardContext.Provider value={{ mode: resolvedMode, density: resolvedDensity }}>
        <div
          ref={ref}
          {...sel}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          data-mode={resolvedMode}
          data-density={resolvedDensity}
          data-selected={retenue || undefined}
          data-regular-capable={adaptiveMedia || undefined}
          className={cn(
            "ds-card", // conteneur de requête ; la surface adaptative est son enfant
            "ds-interactive", // couche partagée du mode (lib/interaction.css)
            resolvedMode === "selectable" && "ds-focus-ring", // anneau unique de BORDER (focus v2)
            rootVariants({ mode: resolvedMode, density: resolvedDensity }),
            className,
          )}
          {...props}
        >
          <div
            className={cn(
              "ds-card-surface relative z-[1] flex w-full flex-col overflow-hidden rounded-card border border-border bg-background shadow-none",
              retenue && "border-primary",
            )}
          >
            {children}
            {resolvedMode === "selectable" && retenue ? <CardCheck /> : null}
          </div>
        </div>
      </CardContext.Provider>
    );
  },
);
CardRoot.displayName = "Card.Root";

/**
 * Coche de sélection — l'indicateur NON CHROMATIQUE qui accompagne `selected_border`
 * (CARD-UI.md l.99). Décoratif pour l'AT : l'état est déjà annoncé par `aria-pressed`.
 */
function CardCheck() {
  return (
    <span aria-hidden="true" className="ds-card-check absolute right-sm top-sm z-[2] size-4 text-primary">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </span>
  );
}
CardCheck.displayName = "Card.Check";

/** Media : ratio fixe, object-fit cover ; fallback = surface + icône (même ratio, la grille ne voit pas la différence). */
export interface CardMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: "landscape" | "square";
}
function CardMedia({ className, ratio = "landscape", children, ...props }: CardMediaProps) {
  return (
    <div
      className={cn(
        "ds-card-media flex shrink-0 items-center justify-center overflow-hidden bg-surface text-text-muted",
        ratio === "landscape" ? "aspect-video" : "aspect-square",
        "[&_img]:size-full [&_img]:object-cover",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
CardMedia.displayName = "Card.Media";

/** Header : titre (+ chevron en mode expandable) — première ligne lue de la carte. */
function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("ds-card-header flex items-start justify-between gap-sm", className)} {...props} />;
}
CardHeader.displayName = "Card.Header";

/** Body : conteneur flex du contenu ; la surface parente orchestre la disposition adaptative. */
function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { density } = React.useContext(CardContext);
  return (
    <div
      className={cn(
        "ds-card-body flex min-w-0 flex-1 flex-col",
        density === "compact" ? "gap-xs p-sm" : "gap-sm p-md",
        className,
      )}
      {...props}
    />
  );
}
CardBody.displayName = "Card.Body";

/**
 * Titre — élément de titre réel (h2…h4 selon la structure de la page qui accueille la
 * collection). La TAILLE reste fixe (`text-h4`) : « niveau ≠ taille » (TYPOGRAPHY-UX.md).
 */
function CardTitle({
  className,
  as: Comp = "h3",
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & { as?: React.ElementType }) {
  return <Comp className={cn("ds-card-title text-h4 font-medium leading-tight text-text-primary", className)} {...props} />;
}
CardTitle.displayName = "Card.Title";

function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-text-secondary", className)} {...props} />;
}
CardDescription.displayName = "Card.Description";

/**
 * Zone d'actions — le PIED de la colonne de contenu. CARD-R07 énumère les slots de la carte
 * (« media / header / corps / zone d'actions ») : les actions font partie du CONTENU, elles
 * ne sont pas un troisième bloc de la surface. Elles vivent donc dans `Card.Body`, dont elles
 * héritent le retrait et la gouttière ; `margin-top: auto` (card.css) les colle au bas dès
 * que la carte a de la hauteur libre — ce qui aligne les boutons entre cartes voisines d'une
 * collection, et reste sans effet sur une carte isolée qui fait sa propre hauteur.
 *
 * Correctif du 2026-07-30 (soir) : posées en frère de `Card.Body`, elles entraient dans le
 * flux de l'état RANGÉE et devenaient une troisième colonne — le média poussait le texte, les
 * boutons s'alignaient sur le titre. L'appelant devait en plus leur rendre un retrait à la
 * main (`px-md pb-md`), signe que l'anatomie était mal posée.
 *
 * Elles restent des SIBLINGS du lien étendu, jamais ses descendants (CARD-R23, source T1) :
 * chaque action garde sa cible propre au clavier.
 */
function CardActions({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("ds-card-actions relative z-[1] flex items-center gap-sm", className)} {...props} />;
}
CardActions.displayName = "Card.Actions";

/**
 * Lien étendu — technique DS-MD (CARD-UI.md) : un vrai `<a>` dont un pseudo-élément
 * (`::after`, card.css) étend la cible à toute la carte. C'est LUI que le lecteur d'écran
 * annonce ; `Card.Actions` reste un sibling positionné au-dessus en z-index, jamais imbriqué
 * dans ce lien.
 */
type CardTitleLinkCommon = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;
/**
 * Comme `Link`, dont il est la spécialisation : un lien natif EXIGE une destination,
 * `asChild` la délègue au routeur de l'application (next/link, Remix Link…). Sans cette
 * porte, une carte de destination dans une application routée n'avait d'autre choix que
 * l'`<a href>` nu — donc, sous un `basePath`, un lien qui ne résout pas (constat GitHub
 * Pages du 2026-07-30). Ce n'est pas une capacité nouvelle : c'est la MÊME que `Link`,
 * qui manquait au seul endroit où la cible est étendue.
 */
export type CardTitleLinkProps =
  | (CardTitleLinkCommon & { asChild?: false; href: string })
  | (CardTitleLinkCommon & { asChild: true; href?: string });
const CardTitleLink = React.forwardRef<HTMLAnchorElement, CardTitleLinkProps>(
  ({ className, ...props }, ref) => (
    <LinkRoot
      ref={ref}
      context="standalone"
      className={cn("ds-card-title-link ds-interactive-target", className)}
      {...(props as React.ComponentPropsWithoutRef<typeof LinkRoot>)}
    />
  ),
);
CardTitleLink.displayName = "Card.TitleLink";

/**
 * Pastille d'icône (32×32, glyphe 22) — au-dessus ou à côté du titre. Rapatriée depuis la
 * collection (`.cg-chip` de card-group.css) le 2026-07-30 : un affleurement d'ITEM appartient
 * à CARD, pas au pattern qui la dispose. Décorative pour l'AT (`aria-hidden`).
 */
function CardIcon({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span aria-hidden="true" className={cn("ds-card-icon", className)} {...props} />;
}
CardIcon.displayName = "Card.Icon";

/**
 * Cible étendue-COMMANDE — le pendant de `Card.TitleLink` quand la carte clickable ouvre un
 * superposé au lieu de naviguer : un vrai `<button>`, jamais un `<a href="#">` — une commande
 * n'est pas une destination. Même technique de zone étendue (`ds-interactive-target`).
 * Rapatriée depuis la collection (`.cg-cmd`) le 2026-07-30 — autorité CARD.
 */
export interface CardTitleCommandProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
const CardTitleCommand = React.forwardRef<HTMLButtonElement, CardTitleCommandProps>(
  ({ className, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn("ds-card-title-command ds-interactive-target", className)}
      {...props}
    />
  ),
);
CardTitleCommand.displayName = "Card.TitleCommand";

/** Chevron du mode expandable — l'ORIENTATION porte l'état (aria-expanded en aval), jamais un changement de glyphe. */
export interface CardChevronProps extends React.HTMLAttributes<HTMLSpanElement> {
  expanded?: boolean;
}
function CardChevron({ className, expanded, ...props }: CardChevronProps) {
  return (
    <span
      aria-hidden="true"
      data-expanded={expanded || undefined}
      className={cn(
        "relative z-[1] flex size-5 shrink-0 items-center justify-center text-text-secondary transition-transform duration-base ease-in-out motion-reduce:transition-none",
        expanded && "rotate-180",
        className,
      )}
      {...props}
    />
  );
}
CardChevron.displayName = "Card.Chevron";

/** Skeleton — mêmes dimensions que la carte réelle ; `aria-hidden`, l'annonce de chargement vit sur la collection (`aria-busy`). */
function CardSkeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn("ds-card w-full animate-pulse motion-reduce:animate-none", className)}
      {...props}
    >
      <div className="ds-card-surface flex w-full flex-col overflow-hidden rounded-card border border-border bg-background">
        <div className="aspect-video bg-surface" />
        <div className="flex flex-col gap-sm p-md">
          <div className="h-4 w-2/3 rounded-sm bg-surface" />
          <div className="h-3 w-full rounded-sm bg-surface" />
        </div>
      </div>
    </div>
  );
}
CardSkeleton.displayName = "Card.Skeleton";

export const Card = {
  Root: CardRoot,
  Check: CardCheck,
  Media: CardMedia,
  Icon: CardIcon,
  Header: CardHeader,
  Body: CardBody,
  Title: CardTitle,
  Description: CardDescription,
  Actions: CardActions,
  TitleLink: CardTitleLink,
  TitleCommand: CardTitleCommand,
  Chevron: CardChevron,
  Skeleton: CardSkeleton,
};

export {
  CardRoot,
  CardCheck,
  CardMedia,
  CardIcon,
  CardHeader,
  CardBody,
  CardTitle,
  CardDescription,
  CardActions,
  CardTitleLink,
  CardTitleCommand,
  CardChevron,
  CardSkeleton,
  rootVariants as cardRootVariants,
};
