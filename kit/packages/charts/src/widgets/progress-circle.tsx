"use client";
import * as React from "react";
import { cn } from "../lib/cn";
import "./widgets.css";

export interface ProgressCircleProps {
  value: number;
  max?: number;
  size?: number;
  stroke?: number;
  color?: string;
  track?: string;
  children?: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}

/** Anneau de progression anime (sweep 0 -> valeur). r=15.915 => circonference ~100,
    donc les longueurs de tirets s'expriment en pourcentage (pathLength=100). */
export function ProgressCircle({
  value, max = 100, size = 44, stroke = 5,
  color = "var(--primary)", track = "var(--surface-hover)", children, className, ariaLabel,
}: ProgressCircleProps) {
  const pct = Math.max(0, Math.min(100, (value / (max || 1)) * 100));
  return (
    <div className={cn("sw-ring", className)} style={{ width: size, height: size }} role="img" aria-label={ariaLabel ?? `${Math.round(pct)} %`}>
      <svg viewBox="0 0 42 42">
        <circle cx="21" cy="21" r="15.915" fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          className="sw-ring-val"
          cx="21" cy="21" r="15.915" fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" pathLength={100}
          strokeDasharray={`${pct.toFixed(2)} 100`} strokeDashoffset={0}
        />
      </svg>
      {children ? <div className="sw-ring-center">{children}</div> : null}
    </div>
  );
}
