"use client";
// Composant interactif : hooks, contexte ou primitive Radix au niveau module.
// Sans cette directive, une page serveur qui importe le baril @fili/react casse
// (createContext évalué dans le graphe RSC).
import * as React from "react";
import { createPortal } from "react-dom";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/cn";
import "./toast.css";

/**
 * Toast — confirmation RÉACTIVE, chronométrée, superposée au contenu (jamais dans le flux —
 * cf. Alert pour le territoire « condition qui dure, dans le flux »). Construit sur
 * `content/md/components/TOAST-UX.md` + `TOAST-UI.md` (doctrine DS-MD, adopté 2026-07-20),
 * habillé par les tokens @fili/tokens. Partage la palette/silhouettes de `Alert` (tone × icône
 * normative), diverge sur : élévation (`elevation.overlay`, seul des deux à en porter une),
 * empilement (FIFO par ordre d'arrivée, PAS par gravité décroissante), position (pilotée par
 * Adaptive via Container Queries — jamais un ancrage fixe au viewport) et durée de vie
 * programmée dès l'apparition.
 *
 * AXE DS-MD : `tone` (info/success/warning/danger) uniquement — pas de `persistance` (le toast
 * est toujours temporaire, c'est ce qui le distingue de l'alert), pas de `style`, pas de `size`
 * (largeur = contenu + conteneur qui l'héberge). Cf. TOAST-UX.md § Note de transposition.
 *
 * API : `<Toast.Provider>` une fois à la racine de l'app (rend les enfants + la pile, portée
 * via `createPortal` vers `document.body` pour échapper à tout `overflow`/contexte d'empilement
 * ancestral — même logique que l'`elevation.overlay` que ce composant est seul, avec modale et
 * popover, à porter légitimement) ; `useToast()` dans les composants enfants pour pousser un
 * toast : `const { toast } = useToast(); toast({ tone, title, description, action })`. Pas de
 * compound component à instancier par toast individuel (pas de `<Toast.Root>`) : la nature
 * « file chronométrée, empilée, injectée par le système » (TOAST-UX.md § Frontière avec Alert)
 * ne se prête pas au pattern Alert/Card, qui documentent chacun un état porté par la page.
 *
 * Timing (TOAST-UI.md § Timing — statut « proposition de premier jet », non établi à l'usage) :
 * base 6000ms + 50ms par mot au-delà de 8 (titre + description) + 2000ms si une action est
 * présente, plafond 10000ms. Minuteur suspendu intégralement au survol et au focus clavier
 * (WCAG 2.2.1) — un seul `setTimeout` par toast, jamais un intervalle recalculé en continu.
 *
 * Empilement : FIFO, max 3 (`empilement.max`, TOAST-UI.md) — le 4ᵉ toast entrant fait sortir le
 * plus ancien immédiatement. Chaque toast a son propre minuteur indépendant.
 *
 * Instrument E-motion (illustration) : réservé au toast `success` SEUL à l'écran (budget de
 * rareté E-motion) — condition vérifiée UNE SEULE FOIS, à l'injection (`illustrated` capturé au
 * push, jamais recalculé) : un toast déjà en train de se dessiner termine son acte même si un
 * second toast arrive pendant l'animation ; aucun nouveau moment illustré ne démarre tant que la
 * pile n'est pas revenue à un seul élément. Glyphe DESSINÉ (`stroke-dashoffset`, gabarit
 * SubmitButton), jamais une illustration importée — l'arbitrage emoji/illustration externe
 * (options A/B/C exposées en conversation le 2026-07-20) reste non tranché, cf. DECISIONS.md.
 *
 * Accessibilité : toujours réactif → `role="alert"` (danger/warning) / `role="status"`
 * (info/success), miroir exact d'Alert. Icône = canal redondant (aria-hidden), jamais la couleur
 * seule (WCAG 1.4.1). Pas de croix de fermeture par défaut (TOAST-UI.md — la pause au
 * survol/focus couvre déjà « je n'ai pas eu le temps » ; une action, si présente, ferme le toast
 * après avoir tranché).
 */

export type ToastTone = "info" | "success" | "warning" | "danger" | "neutral";

export interface ToastAction {
  /** Verbe court, décrit ce que fait l'action (« Annuler »), jamais la gravité du toast. */
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  /** Défaut « neutral » (arbitrages 2026-07-29 — renommé depuis « reverse » : la langue des tones du Button) : la confirmation neutre, haut contraste, est le cas majoritaire. */
  tone?: ToastTone;
  title: React.ReactNode;
  /** 1 phrase max — le toast est trop éphémère pour un paragraphe. */
  description?: React.ReactNode;
  /** Une action tolérée, jamais deux (TOAST-UX.md § Actions — pattern undo). */
  action?: ToastAction;
  /** Fermeture visible : `auto` (défaut — le minuteur seul), `close` (bouton croix), `timer` (barre de décompte). */
  closing?: "auto" | "close" | "timer";
}

interface ToastItem extends ToastOptions {
  id: string;
  tone: ToastTone;
  /** Formule TOAST-UI.md § Timing — calculée une fois au push, jamais recalculée en vie. */
  duration: number;
  /** Condition d'activation de l'instrument E-motion, figée à l'injection (§ Instrument E-motion ci-dessus). */
  illustrated: boolean;
}

/* ── Durée : duree.base_ms + duree.extension_par_mot_ms × (mots au-delà de 8) + ────────────
   duree.bonus_action_ms si action, plafonné à duree.plafond_ms (TOAST-UI.md, non établi/premier jet). */
const DURATION_BASE_MS = 6000;
const DURATION_PER_WORD_MS = 50;
const DURATION_WORD_FLOOR = 8;
const DURATION_ACTION_BONUS_MS = 2000;
const DURATION_CEILING_MS = 10000;
const MAX_STACK = 3; // empilement.max

function wordCount(node: React.ReactNode): number {
  // Nœuds React complexes (JSX autre que texte) : pas d'extension calculée, repli sur la durée
  // de base — TOAST-UI.md ne couvre pas ce cas, cf. le fichier « premier jet ».
  if (typeof node === "string") return node.trim().split(/\s+/).filter(Boolean).length;
  if (typeof node === "number") return 1;
  return 0;
}

function computeDuration({ title, description, action }: ToastOptions): number {
  const words = wordCount(title) + wordCount(description);
  const extra = Math.max(0, words - DURATION_WORD_FLOOR) * DURATION_PER_WORD_MS;
  const bonus = action ? DURATION_ACTION_BONUS_MS : 0;
  return Math.min(DURATION_BASE_MS + extra + bonus, DURATION_CEILING_MS);
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  !!window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let idCounter = 0;
function nextId(): string {
  idCounter += 1;
  return `toast-${idCounter}-${Math.random().toString(36).slice(2, 8)}`;
}

/* ── Silhouettes normatives (DS-MD), identiques à Alert — dupliquées ici car non exportées ──
   du module alert.tsx : cercle / cercle-coche / triangle / octogone. Aucun token couleur
   nouveau (TOAST-UI.md § Ce qui est repris tel quel). */
function ToneGlyph({ tone, illustrated }: { tone: ToastTone; illustrated?: boolean }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (tone) {
    case "success":
      // Instrument E-motion : le même glyphe cercle-coche, mais dessiné (stroke-dashoffset,
      // toast.css) au lieu de statique — jamais une illustration importée (§ Instrument E-motion).
      return (
        <svg
          viewBox="0 0 20 20"
          {...common}
          className={illustrated ? "ds-toast-glyph ds-toast-glyph--illustrated" : undefined}
        >
          <circle cx="10" cy="10" r="7.25" />
          <path
            d="m6.75 10.25 2.1 2.1 4.4-4.6"
            pathLength={illustrated ? 1 : undefined}
            className={illustrated ? "ds-toast-glyph__check" : undefined}
          />
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

/* ── Carte : structure + tone, identiques dans l'esprit à rootVariants d'Alert, plus ────────
   `shadow-overlay` (elevation.overlay — seul écart matériel avec Alert, cf. TOAST-UI.md § Ce
   qui diverge d'Alert) et une largeur de lecture plafonnée (structure.max_width). */
const toastCardVariants = cva(
  "ds-toast-card relative flex w-full max-w-[24rem] gap-sm rounded-lg border p-md text-base shadow-overlay",
  {
    variants: {
      // Focus v2 : l'anneau des contrôles internes (action, croix) suit le tone du toast.
      tone: {
        info: "border-info bg-info-subtle text-info [--control-focus-color:var(--control-focus-info)]",
        success: "border-success bg-success-subtle text-success [--control-focus-color:var(--control-focus-success)]",
        warning: "border-warning bg-warning-subtle text-warning [--control-focus-color:var(--control-focus-warning)]",
        danger: "border-danger bg-danger-subtle text-danger [--control-focus-color:var(--control-focus-danger)]",
        neutral: "border-neutral bg-neutral text-on-neutral [--control-focus-color:var(--control-focus-neutral)]",
      },
    },
    defaultVariants: { tone: "info" },
  },
);

/* ── Carte individuelle : minuteur propre, pause au survol/focus, entrée/sortie ───────────── */
type TransitionPhase = "entering" | "visible" | "exiting";

function ToastCard({ item, onRemove }: { item: ToastItem; onRemove: (id: string) => void }) {
  const { id, tone, title, description, action, duration, illustrated } = item;
  const closing = item.closing ?? "auto";
  const [barRunning, setBarRunning] = React.useState(false);
  const [phase, setPhase] = React.useState<TransitionPhase>("entering");
  const reducedRef = React.useRef<boolean | null>(null);
  if (reducedRef.current === null) reducedRef.current = prefersReducedMotion(); // évalué une fois, à la 1ʳᵉ ligne de vie de la carte

  const timeoutRef = React.useRef<number | null>(null);
  const remainingRef = React.useRef(duration);
  const startedAtRef = React.useRef(0);
  const removedRef = React.useRef(false);

  const clearTimer = React.useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const requestExit = React.useCallback(() => {
    clearTimer();
    setPhase("exiting");
  }, [clearTimer]);

  const startTimer = React.useCallback(
    (ms: number) => {
      clearTimer();
      startedAtRef.current = Date.now();
      timeoutRef.current = window.setTimeout(requestExit, ms);
    },
    [clearTimer, requestExit],
  );

  // Un seul setTimeout par toast (TOAST-UI.md § Timing — implémentation), armé au montage.
  React.useEffect(() => {
    const raf = requestAnimationFrame(() => setPhase("visible"));
    startTimer(remainingRef.current);
    return () => {
      cancelAnimationFrame(raf);
      clearTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Barre de décompte (mode timer) : play-state calé sur la vie du toast (pause au survol).
  React.useEffect(() => {
    // La barre suit le minuteur (démarré au montage), pas la phase d'entrée : robuste même
    // si l'animation d'entrée (rAF) est différée. Seule la sortie l'arrête.
    setBarRunning(phase !== "exiting");
  }, [phase]);

  // Suspension intégrale au survol/focus (WCAG 2.2.1) — jamais un redémarrage à zéro : le
  // temps déjà écoulé est retranché de la durée restante, pas remis au plancher.
  const pause = React.useCallback(() => {
    setBarRunning(false);
    if (timeoutRef.current === null) return;
    clearTimer();
    const elapsed = Date.now() - startedAtRef.current;
    remainingRef.current = Math.max(0, remainingRef.current - elapsed);
  }, [clearTimer]);

  const resume = React.useCallback(() => {
    if (phase === "exiting") return;
    startTimer(remainingRef.current);
    setBarRunning(true);
  }, [phase, startTimer]);

  const handleBlurCapture = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) resume();
  };

  const finalizeRemoval = React.useCallback(() => {
    if (removedRef.current) return;
    removedRef.current = true;
    onRemove(id);
  }, [id, onRemove]);

  // Filet de sécurité : sous reduced-motion (ou navigateur récalcitrant), `transitionend` peut
  // ne jamais se déclencher pour une transition à durée nulle — on retire quand même la carte.
  React.useEffect(() => {
    if (phase !== "exiting") return;
    const t = window.setTimeout(finalizeRemoval, 260);
    return () => window.clearTimeout(t);
  }, [phase, finalizeRemoval]);

  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (phase === "exiting" && e.target === e.currentTarget) finalizeRemoval();
  };

  const handleActionClick = () => {
    action?.onClick();
    requestExit(); // l'action tranche : le toast a fait son office (TOAST-UX.md § Actions)
  };

  const role = tone === "danger" || tone === "warning" ? "alert" : "status";
  const reduced = reducedRef.current;

  // Entrée : translate + opacity, cran motion.base/ease-out. Sortie : cran inférieur,
  // motion.fast/ease-in (TOAST-UI.md § motion). Reduced-motion : crossfade d'opacité conservé,
  // jamais la translation supprimée SANS remplacement — donc on retire seulement le transform,
  // pas la transition d'opacité (TOAST-UX.md § États et comportement).
  const opacityClass = phase === "visible" ? "opacity-100" : "opacity-0";
  const translateClass = reduced
    ? ""
    : phase === "entering"
      ? "translate-y-2"
      : phase === "exiting"
        ? "translate-y-1"
        : "translate-y-0";
  const speedClass = phase === "exiting" ? "duration-fast ease-in" : "duration-base ease-out";

  return (
    <div
      role={role}
      data-tone={tone}
      data-phase={phase}
      className={cn(
        toastCardVariants({ tone }),
        "overflow-hidden transition-[opacity,transform]",
        opacityClass,
        translateClass,
        speedClass,
      )}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={handleBlurCapture}
      onTransitionEnd={handleTransitionEnd}
    >
      <span
        aria-hidden="true"
        className="mt-px flex size-5 shrink-0 items-center justify-center [&>svg]:size-5"
      >
        <ToneGlyph tone={tone} illustrated={illustrated} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="font-medium">{title}</p>
        {description ? <p className="mt-xs text-sm">{description}</p> : null}
        {action ? (
          <div className="mt-sm flex items-center">
            <button
              type="button"
              className={cn(
                "-ml-1 flex min-h-11 items-center rounded-sm px-1 text-sm font-medium underline-offset-2 hover:underline",
                "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--control-focus-color)]",
              )}
              onClick={handleActionClick}
            >
              {action.label}
            </button>
          </div>
        ) : null}
      </div>
      {closing === "close" ? (
        <button
          type="button"
          aria-label="Fermer"
          onClick={requestExit}
          className="-mr-1 -mt-1 flex size-6 shrink-0 items-center justify-center rounded-sm opacity-60 transition-opacity hover:opacity-100 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--control-focus-color)]"
        >
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="size-4">
            <path d="m5.5 5.5 9 9M14.5 5.5l-9 9" />
          </svg>
        </button>
      ) : null}
      {closing === "timer" ? (
        <>
          <style>{`@keyframes dsui-toast-timer{from{transform:scaleX(1)}to{transform:scaleX(0)}}`}</style>
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-x-0 bottom-0 h-1 origin-left bg-current",
              // reverse : le trait courant (texte inverse) se noie sur la surface sombre → plus opaque
              tone === "neutral" ? "opacity-60" : "opacity-30",
            )}
            style={{ animation: `dsui-toast-timer ${duration}ms linear forwards`, animationPlayState: barRunning ? "running" : "paused" }}
          />
        </>
      ) : null}
    </div>
  );
}

/* ── Viewport : conteneur de requête (Adaptive), porté via createPortal ─────────────────────
   pour échapper à tout overflow/contexte d'empilement ancestral — cf. docstring. */
export type ToastPlacement =
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "top"
  | "top-start"
  | "top-end";

function ToastViewport({
  items,
  onRemove,
  placement = "bottom",
}: {
  items: ToastItem[];
  onRemove: (id: string) => void;
  placement?: ToastPlacement;
}) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted || typeof document === "undefined") return null;
  return createPortal(
    <div className={cn("ds-toast-region", placement !== "bottom" && `ds-toast-region--${placement}`)}>
      {items.map((item) => (
        <ToastCard key={item.id} item={item} onRemove={onRemove} />
      ))}
    </div>,
    document.body,
  );
}

/* ── Provider + hook ──────────────────────────────────────────────────────────────────────── */
type Action = { type: "push"; item: ToastItem } | { type: "remove"; id: string };

function reducer(state: ToastItem[], action: Action): ToastItem[] {
  switch (action.type) {
    case "push": {
      const next = [...state, action.item];
      // Le plus ancien sort dès que la pile dépasse le plafond (FIFO — TOAST-UI.md § Empilement).
      return next.length > MAX_STACK ? next.slice(next.length - MAX_STACK) : next;
    }
    case "remove":
      return state.filter((t) => t.id !== action.id);
    default:
      return state;
  }
}

interface ToastContextValue {
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
}
const ToastContext = React.createContext<ToastContextValue | null>(null);

/** À appeler sous `<Toast.Provider>`. `toast()` retourne l'id, utilisable avec `dismiss()`. */
export function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast() doit être appelé à l'intérieur d'un <Toast.Provider>.");
  }
  return ctx;
}

export interface ToastProviderProps {
  children: React.ReactNode;
  /** Point d'ancrage de la pile — bas centré par défaut (arbitrage 2026-07-21) ; variantes start/end et top. */
  placement?: ToastPlacement;
}

function ToastProvider({ children, placement = "bottom" }: ToastProviderProps) {
  const [items, dispatch] = React.useReducer(reducer, [] as ToastItem[]);
  const itemsRef = React.useRef<ToastItem[]>(items);
  React.useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const dismiss = React.useCallback((id: string) => dispatch({ type: "remove", id }), []);

  const toast = React.useCallback((options: ToastOptions): string => {
    const id = nextId();
    const tone = options.tone ?? "neutral";
    const duration = computeDuration(options);
    dispatch({
      type: "push",
      item: {
        ...options,
        id,
        tone,
        duration,
        // Vérifiée UNE FOIS, à l'injection (§ Instrument E-motion) : ce toast sera-t-il seul
        // après ce push ? Ne dépend jamais de la taille de la pile par la suite.
        illustrated: tone === "success" && itemsRef.current.length === 0,
        closing: options.closing ?? "auto",
      },
    });
    return id;
  }, []);

  const value = React.useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport items={items} onRemove={dismiss} placement={placement} />
    </ToastContext.Provider>
  );
}
ToastProvider.displayName = "Toast.Provider";

export const Toast = {
  Provider: ToastProvider,
};

export { ToastProvider, toastCardVariants as toastRootVariants };
