"use client";
// Composant interactif : hooks, contexte ou primitive Radix au niveau module.
// Sans cette directive, une page serveur qui importe le baril @fili/react casse
// (createContext évalué dans le graphe RSC).
import * as React from "react";
import { Skeleton } from "../skeleton/skeleton";
import "./theme-toggle.css";

const TRACK = { sm: [36, 20], md: [46, 24], lg: [56, 28] } as const;

export interface ThemeToggleProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "checked" | "onChange" | "size"> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  /** Taille alignée sur Button : sm / md (défaut) / lg. */
  size?: "sm" | "md" | "lg";
  /** Libellé visible dans le <label> (nom accessible implicite). Sans lui : aria-label requis. */
  label?: React.ReactNode;
  /** Rend la piste en squelette de chargement, aux dimensions de sa taille. */
  loading?: boolean;
}

/**
 * ThemeToggle — interrupteur clair/sombre (soleil ↔ lune). Le pouce glisse et se
 * comprime au survol/press (langage fluide, port 1:1 de l'atelier). Contrôlé :
 * `checked` (= sombre) + `onCheckedChange`. Tailles sm/md/lg alignées sur Button.
 * Nom accessible : `label` visible (association implicite du <label>) ou `aria-label`.
 */
export const ThemeToggle = React.forwardRef<HTMLInputElement, ThemeToggleProps>(
  ({ checked, onCheckedChange, size = "md", label, loading = false, className, ...props }, ref) => {
    if (loading) {
      const [w, h] = TRACK[size];
      return (
        <span className="inline-flex items-center">
          <Skeleton variant="circle" width={w} height={h} />
          {label != null ? <span className="ds-theme-toggle__label ds-skeleton rounded-sm">{label}</span> : null}
        </span>
      );
    }
    return (
      <label
        className={[
          "ds-theme-toggle",
          size !== "md" ? `ds-theme-toggle--${size}` : null,
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {/* Le conteneur positionné des icônes/knob : ils s'ancrent sur LA PISTE, jamais sur le
            label entier — sinon la lune (right) atterrit sur le texte (bug corrigé 2026-07-29). */}
        <span className="ds-theme-toggle__control">
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            onChange={(e) => onCheckedChange(e.currentTarget.checked)}
            {...props}
          />
          <svg className="tr tr-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.9 4.9 1.4 1.4" /><path d="m17.7 17.7 1.4 1.4" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.3 17.7-1.4 1.4" /><path d="m19.1 4.9-1.4 1.4" />
          </svg>
          <svg className="tr tr-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
          <span className="knob" aria-hidden="true" />
        </span>
        {label != null ? <span className="ds-theme-toggle__label">{label}</span> : null}
      </label>
    );
  }
);
ThemeToggle.displayName = "ThemeToggle";
