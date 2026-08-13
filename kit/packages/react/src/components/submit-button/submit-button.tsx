"use client";
// Composant interactif : hooks, contexte ou primitive Radix au niveau module.
// Sans cette directive, une page serveur qui importe le baril @fili/react casse
// (createContext évalué dans le graphe RSC).
import * as React from "react";
import gsap from "gsap";
import { cn } from "../../lib/cn";
import "./submit-button.css";

/**
 * SubmitButton — premier citoyen de la couche **E-motion** (DS-MD `foundations/emotion`).
 *
 * Portage FIDÈLE du « Paper plane button (v2) » d'Aaron Iker — CodePen BajabVN (pens
 * publics CodePen, licence MIT) : géométrie, décalages `part-x` et timeline **GSAP**
 * repris à l'identique de l'original. La surface du bouton est pré-découpée en 4 facettes
 * (aile + quille × 2) pilotées par variables CSS ; au clic : pli 1 → redécoupe invisible →
 * pli 2 → envol facetté + traînées → « ✓ Envoyé » — état définitif, jamais de retour à « Envoyer ».
 *
 * Deltas DS-UI : couleurs papier depuis les tokens (l'avion est papier, pas indigo),
 * bouton indigo au repos qui révèle le papier au pliage, taille Lg (48px / radius-md),
 * succès en `secondary`, et le contrat E-motion (aria-live + reduced-motion).
 *
 * MOTEUR & POIDS :
 * - **GSAP** est le moteur de ce moment signature — exception d'animation assumée et
 *   documentée (cf. EMOTION-UI). ~23 Ko gzip mutualisés entre tous les moments chorégraphiés.
 * - CSS ~3,5 Ko. AUCUNE animation au repos (rien ne tourne avant le clic).
 * - Uniquement transform/opacity (compositeur) + clip-path/background/stroke-dashoffset
 *   (peinture sur une surface de 168×48 px). JAMAIS de propriété de layout → zéro reflow.
 *
 * COMPATIBILITÉ (façon caniuse — voir aussi la table du playground) :
 * - ✅ Complet : Chrome/Edge ≥ 111, Firefox ≥ 113, Safari ≥ 16.2.
 * - ✅ Complet avec fallback : Chrome/Edge 86-110, Firefox 85-112, Safari 15.4-16.1
 *   (couleur des traînées sans `color-mix`, via rgba de repli).
 * - 🟡 Dégradé léger : Chrome 55-85, Firefox 48-84, Safari 13.1-15.3 — anneau de focus
 *   via `:focus` (pas de `:focus-visible`).
 * - 🔴 Pas d'animation : navigateurs sans variables CSS — le bouton reste un bouton
 *   statique FONCTIONNEL (envoi + annonce ARIA), rien ne casse.
 *
 * Contrat E-motion (inviolable) :
 * - L'état vit dans l'`aria-live` — l'animation ne porte jamais l'information seule.
 * - `prefers-reduced-motion` : bascule instantanée « Envoyé ✓ », la surface reste.
 * - L'envoi réel (`onSubmit`) part au clic, indépendant de la célébration ; une erreur
 *   interrompt la fête (secousse + annonce), le fait prime toujours.
 */
type SubmitState = "idle" | "sending" | "sent" | "error";

export interface SubmitButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onSubmit" | "children"> {
  /** Action réelle. Peut être async — une erreur interrompt la célébration (état error). */
  onSubmit?: () => Promise<unknown> | unknown;
  /** Libellé au repos. Défaut « Envoyer ». */
  children?: React.ReactNode;
  /** Libellé de succès. Défaut « Envoyé ». */
  successLabel?: React.ReactNode;
  /** Message annoncé au lecteur d'écran au succès (l'info vit ICI, pas dans l'animation). */
  liveMessage?: string;
  /** Cran de taille, aligné sur le Button (32/40/48 px). L'avion est scalé en conséquence. Défaut « lg ». */
  size?: "sm" | "md" | "lg";
}

const prefersReduced = () =>
  typeof window !== "undefined" &&
  !!window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const SubmitButton = React.forwardRef<HTMLButtonElement, SubmitButtonProps>(
  (
    {
      className,
      onSubmit,
      children = "Envoyer",
      successLabel = "Envoyé",
      liveMessage = "Message envoyé.",
      size = "lg",
      onClick,
      ...props
    },
    ref,
  ) => {
    const [state, setState] = React.useState<SubmitState>("idle");
    const [loading, setLoading] = React.useState(false);
    const [done, setDone] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [instant, setInstant] = React.useState(false);
    const [live, setLive] = React.useState("");
    const rootRef = React.useRef<HTMLSpanElement>(null);
    const timers = React.useRef<number[]>([]);
    const busy = React.useRef(false);

    const clearAll = React.useCallback(() => {
      if (rootRef.current) gsap.killTweensOf(rootRef.current);
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current = [];
      rootRef.current?.removeAttribute("style");
    }, []);
    React.useEffect(() => clearAll, [clearAll]);

    const handleClick = (ev: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(ev);
      if (busy.current) return;
      busy.current = true;
      const el = rootRef.current!;
      const reduced = prefersReduced();
      if (reduced) setInstant(true);
      const ok = () => { setLoading(false); setDone(true); setState("sent"); setLive(liveMessage); }; // « Envoyé » TERMINAL
      const fail = () => { // ÉCHEC : secousse + « Échec », puis ré-armable (pas d'animation)
        setLoading(false); setError(true); setLive("L'envoi a échoué.");
        timers.current.push(window.setTimeout(() => {
          clearAll(); setError(false); setInstant(false); setState("idle"); busy.current = false; setLive("");
        }, 1600));
      };
      /* Joue l'acte GSAP (pliage + envol), puis « Envoyé » en fin de vol. Appelé UNIQUEMENT au vrai succès. */
      const playAct = () => {
        setState("sending");
        const getVar = (n: string) => getComputedStyle(el).getPropertyValue(n).trim();
        const paper = getVar("--pp-paper") || "#FFFFFF";
        const paperMid = getVar("--pp-paper-mid") || "#E5E7EB";
        const paperDark = getVar("--pp-paper-dark") || "#9CA3AF";
        gsap.to(el, {
          keyframes: [
            {
              "--pp-lw1x": 50, "--pp-lw1y": 100, "--pp-rw2x": 50, "--pp-rw2y": 100,
              duration: 0.2,
              onComplete() {
                gsap.set(el, {
                  "--pp-lw1y": 0, "--pp-lw2x": 40, "--pp-lw2y": 100, "--pp-lw3x": 0, "--pp-lw3y": 100, "--pp-lb3x": 40,
                  "--pp-rw1x": 50, "--pp-rw1y": 0, "--pp-rw2x": 60, "--pp-rw2y": 100, "--pp-rw3x": 100, "--pp-rw3y": 100, "--pp-rb3x": 60,
                });
              },
            },
            { "--pp-lw3x": 20, "--pp-lw3y": 90, "--pp-lw2y": 90, "--pp-lb3y": 90, "--pp-rw3x": 80, "--pp-rw3y": 90, "--pp-rb3y": 90, "--pp-rw2y": 90, duration: 0.2 },
            { "--pp-rotate": 50, "--pp-lw3y": 95, "--pp-lw3x": 27, "--pp-rb3x": 45, "--pp-rw2x": 45, "--pp-rw3x": 60, "--pp-rw3y": 83, duration: 0.25 },
            { "--pp-rotate": 60, "--pp-plane-x": -8, "--pp-plane-y": 40, "--pp-sh": 11, duration: 0.2 },
            { "--pp-rotate": 40, "--pp-plane-x": 45, "--pp-plane-y": -300, "--pp-plane-o": 0, "--pp-sh": 1, duration: 0.375, onComplete() { ok(); } },
          ],
        });
        gsap.to(el, {
          keyframes: [
            { "--pp-text-o": 0, "--pp-radius": 0, "--pp-lw-bg": paperMid, "--pp-rw-bg": paperMid, duration: 0.11 },
            { "--pp-lw-bg": paper, "--pp-rw-bg": paper, duration: 0.14 },
            { "--pp-lb-bg": paperMid, "--pp-rb-bg": paperDark, duration: 0.25, delay: 0.1 },
            { "--pp-trails-stroke": 171, duration: 0.22, delay: 0.22 },
          ],
        });
      };
      // L'envoi réel part MAINTENANT — le CHARGEMENT vient AVANT l'animation ; l'avion ne s'envole qu'au VRAI succès.
      const p = Promise.resolve().then(() => onSubmit?.());
      let settled = false;
      const spinT = window.setTimeout(() => { if (!settled) setLoading(true); }, 150); // spinner sur bouton indigo, anti-flash
      timers.current.push(spinT);
      p.then(() => {
        settled = true; window.clearTimeout(spinT); setLoading(false);
        if (reduced) { ok(); return; } // pas de vol animé
        playAct(); // succès confirmé → l'avion s'envole → « Envoyé »
      }).catch(() => { settled = true; window.clearTimeout(spinT); setLoading(false); fail(); });
    };

    return (
      <span
        ref={rootRef}
        className={cn(
          "dsui-pplane", `dsui-pplane--${size}`,
          loading && "dsui-pplane--loading", done && "dsui-pplane--done",
          error && "dsui-pplane--error", instant && "dsui-pplane--instant", className,
        )}
        data-state={state}
      >
        <span className="dsui-pplane__plane" aria-hidden="true">
          <span className="dsui-pplane__inner">
            <i className="dsui-pplane__part dsui-pplane__part--lw" />
            <i className="dsui-pplane__part dsui-pplane__part--lb" />
            <i className="dsui-pplane__part dsui-pplane__part--rw" />
            <i className="dsui-pplane__part dsui-pplane__part--rb" />
          </span>
        </span>
        <svg className="dsui-pplane__trails" viewBox="0 0 33 64" aria-hidden="true">
          <path d="M26,4 C28,13.3333333 29,22.6666667 29,32 C29,41.3333333 28,50.6666667 26,60" />
          <path d="M6,4 C8,13.3333333 9,22.6666667 9,32 C9,41.3333333 8,50.6666667 6,60" />
        </svg>
        <button ref={ref} type="button" className="dsui-pplane__btn" onClick={handleClick} {...props}>
          <span className="dsui-pplane__default">{children}</span>
          <span className="dsui-pplane__success" aria-hidden="true">
            <svg viewBox="0 0 16 16"><polyline points="3.75 9 7 12 13 5" /></svg>
            {successLabel}
          </span>
          <span className="dsui-pplane__spin" aria-hidden="true"><i /></span>
          <span className="dsui-pplane__err" aria-hidden="true">⚠ Échec</span>
        </button>
        <span className="dsui-pplane__live" aria-live="polite">{live}</span>
      </span>
    );
  },
);
SubmitButton.displayName = "SubmitButton";
