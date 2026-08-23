"use client";
// Composant interactif : hooks, contexte ou primitive Radix au niveau module.
// Sans cette directive, une page serveur qui importe le baril @fili/react casse
// (createContext évalué dans le graphe RSC).
import * as React from "react";
import { cn } from "../../lib/cn";
import "./delete-button.css";

/**
 * DeleteButton « poubelle » — deuxième citoyen de la couche **E-motion** (DS-MD `foundations/emotion`).
 *
 * Portage FIDÈLE du « Delete button » d'Aaron Iker — CodePen abOXPvN (pens publics CodePen,
 * licence MIT). **CSS pur** (keyframes trash-top / trash-bottom / text) — aucune dépendance
 * d'animation. Au clic : les lettres de « Supprimer » se FROISSENT en boule au centre du label
 * (comme un papier qu'on froisse) pendant que la poubelle grandit et s'ouvre, la boule plonge
 * dedans, la poubelle se referme → « ✓ Supprimé » s'installe et **reste** (la
 * suppression est un acte définitif, le bouton ne revient jamais à « Supprimer »).
 *
 * Deltas DS-UI : rouge **destructive** depuis les tokens `error` (base / dark / lighter / on),
 * état terminal « Supprimé » sur `danger-subtle`, contrat E-motion.
 *
 * Contrat E-motion (inviolable) :
 * - L'état vit dans l'`aria-live` — l'animation ne porte jamais l'information seule.
 * - `prefers-reduced-motion` : bascule instantanée « Supprimé » (crossfade d'opacité), pas de poubelle animée.
 * - La suppression réelle (`onDelete`) part au clic, indépendante de la célébration.
 *
 * ⚠️ Friction ∝ risque (règle DS) : une suppression irréversible mérite en amont une
 * confirmation (dialog / undo). Ce bouton est le *moment* de la suppression, pas le garde-fou.
 */
type DeleteState = "idle" | "deleting" | "done";

export interface DeleteButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "children"> {
  /** Action réelle de suppression. Peut être async ; part au clic, indépendante de l'animation. */
  onDelete?: () => Promise<unknown> | unknown;
  /** Libellé au repos. Défaut « Supprimer ». Une chaîne est découpée en lettres animées. */
  children?: React.ReactNode;
  /** Libellé terminal. Défaut « Supprimé ». */
  doneLabel?: React.ReactNode;
  /** Message annoncé au lecteur d'écran (l'info vit ICI, pas dans l'animation). */
  liveMessage?: string;
  /** Cran de taille, aligné sur le Button (32/40/48 px). Défaut « lg ». */
  size?: "sm" | "md" | "lg";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const prefersReduced = () =>
  typeof window !== "undefined" &&
  !!window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Découpe une chaîne en lettres avec le décalage (stagger) exact de l'original. */
function letters(label: string): React.ReactNode {
  return [...label].map((ch, idx) => {
    const i = idx + 1;
    const style = {
      ["--span-delay" as string]: `${(i / 20 + 0.35).toFixed(3)}s`,
      ["--span-o-d" as string]: `${(i / 40 + 0.3).toFixed(3)}s`,
    } as React.CSSProperties;
    return (
      <span key={idx} style={style}>
        {ch === " " ? " " : ch}
      </span>
    );
  });
}

export const DeleteButton = React.forwardRef<HTMLButtonElement, DeleteButtonProps>(
  (
    {
      className,
      onDelete,
      children = "Supprimer",
      doneLabel = "Supprimé",
      liveMessage = "Élément supprimé.",
      size = "lg",
      onClick,
      ...props
    },
    ref,
  ) => {
    const [state, setState] = React.useState<DeleteState>("idle");
    const [loading, setLoading] = React.useState(false);
    const [done, setDone] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [instant, setInstant] = React.useState(false);
    const [live, setLive] = React.useState("");
    const rootRef = React.useRef<HTMLSpanElement>(null);
    const btnRef = React.useRef<HTMLButtonElement | null>(null);
    const timers = React.useRef<number[]>([]);
    const busy = React.useRef(false);

    React.useEffect(
      () => () => { timers.current.forEach((t) => window.clearTimeout(t)); },
      [],
    );

    const handleClick = (ev: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(ev);
      if (busy.current) return;
      busy.current = true;
      const reduced = prefersReduced();
      if (reduced) setInstant(true);
      // Centre la poubelle sur la largeur RÉELLE du bouton (mesurée au repos, quel que soit le label
      // — et quel que soit le padding X, variable selon la taille depuis l'alignement sur le Button).
      const w = btnRef.current ? btnRef.current.offsetWidth : 0;
      const icEl = rootRef.current?.querySelector<HTMLElement>(".dsui-delbtn__icon");
      rootRef.current?.style.setProperty("--del-cx", `${w / 2 - ((icEl?.offsetLeft ?? 12) + 12)}px`);
      // FROISSAGE : cibles par lettre — convergence vers le centre du label + jitter déterministe par index.
      const textEl = rootRef.current?.querySelector<HTMLElement>(".dsui-delbtn__text");
      if (textEl) {
        const tcx = textEl.offsetLeft + textEl.offsetWidth / 2;
        textEl.querySelectorAll<HTMLElement>("span").forEach((sp, i) => {
          const dx = (tcx - (sp.offsetLeft + sp.offsetWidth / 2)) * 0.88;
          sp.style.setProperty("--crump-x", `${dx.toFixed(1)}px`);
          sp.style.setProperty("--crump-y", `${((i * 53) % 9) - 4}px`);
          sp.style.setProperty("--crump-r", `${((i * 137) % 2 ? -1 : 1) * (10 + ((i * 61) % 22))}deg`);
          sp.style.setProperty("--span-cd", `${(((i * 89) % 5) * 0.02).toFixed(2)}s`);
        });
      }
      const ok = () => { setLoading(false); setDone(true); setLive(liveMessage); }; // « Supprimé » TERMINAL
      const fail = () => { // ÉCHEC : secousse + « Échec », puis ré-armable (pas d'animation)
        setLoading(false); setError(true); setLive("La suppression a échoué.");
        timers.current.push(window.setTimeout(() => {
          setError(false); setInstant(false); setState("idle");
          rootRef.current?.style.removeProperty("--del-cx"); busy.current = false; setLive("");
        }, 1600));
      };
      // La suppression réelle part MAINTENANT — le CHARGEMENT vient AVANT l'animation ; l'acte ne se joue qu'au VRAI succès.
      const p = Promise.resolve().then(() => onDelete?.());
      let settled = false;
      const spinT = window.setTimeout(() => { if (!settled) setLoading(true); }, 150); // anti-flash sur opération rapide
      timers.current.push(spinT);
      p.then(() => {
        settled = true; window.clearTimeout(spinT); setLoading(false);
        if (reduced) { ok(); return; } // pas d'acte animé
        setState("deleting"); // succès confirmé → la poubelle attrape les lettres → « Supprimé »
        timers.current.push(window.setTimeout(ok, 1800));
      }).catch(() => { settled = true; window.clearTimeout(spinT); setLoading(false); fail(); });
    };

    return (
      <span
        ref={rootRef}
        className={cn(
          "dsui-delbtn", `dsui-delbtn--${size}`,
          loading && "dsui-delbtn--loading", done && "dsui-delbtn--done",
          error && "dsui-delbtn--error", instant && "dsui-delbtn--instant", className,
        )}
        data-state={state}
      >
        <button
          ref={(node) => { btnRef.current = node; if (typeof ref === "function") ref(node); else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node; }}
          type="button" className="dsui-delbtn__btn" onClick={handleClick} {...props}
        >
          {/* Poubelle redessinée dans l'idiome ◈ Icons (Lucide outline, trait 2, fill none) —
              l'icône remplie de l'original jurait avec la librairie. Même découpe
              top=couvercle (barre + anse) / bottom=corps (cuve + stries) : keyframes intactes. */}
          <span className="dsui-delbtn__icon" aria-hidden="true">
            <svg className="dsui-delbtn__top" viewBox="0 0 24 24">
              <path d="M3 6h18" />
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            <svg className="dsui-delbtn__bottom" viewBox="0 0 24 24">
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
            </svg>
          </span>
          <span className="dsui-delbtn__text">
            {typeof children === "string" ? letters(children) : children}
          </span>
          <span className="dsui-delbtn__done" aria-hidden="true">
            <svg viewBox="0 0 16 16"><polyline points="3.75 9 7 12 13 5" /></svg>
            {doneLabel}
          </span>
          <span className="dsui-delbtn__spin" aria-hidden="true"><i /></span>
          <span className="dsui-delbtn__err" aria-hidden="true">⚠ Échec</span>
        </button>
        <span className="dsui-delbtn__live" aria-live="polite">{live}</span>
      </span>
    );
  },
);
DeleteButton.displayName = "DeleteButton";
