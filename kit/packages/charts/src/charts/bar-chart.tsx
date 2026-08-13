"use client";
import * as React from "react";
import { cn } from "../lib/cn";
import { ChartFrame, TipRow } from "./chart-frame";
import { extent, gridFractions } from "../lib/geometry";
import { fmtInt } from "../lib/format";

export interface BarChartProps {
  data: number[];
  labels?: string[];
  height?: number;
  color?: string;
  label?: string;
  format?: (n: number) => string;
  className?: string;
  ariaLabel?: string;
}

/** Barres verticales (base zero), grille, axe X ; survol/tactile met en avant la barre active. */
export function BarChart({
  data, labels, height = 160, color = "var(--primary-subtle)",
  label = "Valeur", format = fmtInt, className, ariaLabel,
}: BarChartProps) {
  const n = data.length;
  const mx = extent(data, true).mx;
  const xAt = (i: number, plotW: number) => { const slot = plotW / n; return i * slot + slot / 2; };
  return (
    <ChartFrame
      height={height} count={n} crosshair={false} ariaLabel={ariaLabel} className={className} xAt={xAt}
      xAxis={labels ? labels.map((m, i) => <span key={i}>{m}</span>) : undefined}
      tooltip={(i) => (
        <>
          <span className="ch-tip-x">{labels?.[i] ?? `#${i + 1}`}</span>
          <TipRow color={color} label={label} value={format(data[i])} />
        </>
      )}
    >
      {({ plotW, plotH, active }) => {
        const slot = plotW / n, bw = slot * 0.6;
        return (
          <g className="ch-anim">
            {gridFractions(4).map((f, i) => (
              <line key={i} className="ch-grid" x1={0} y1={plotH * f} x2={plotW} y2={plotH * f} />
            ))}
            {data.map((v, i) => {
              const h = (v / mx) * plotH, x = i * slot + (slot - bw) / 2;
              return (
                <rect
                  key={i}
                  className={cn("ch-bar", active != null && active !== i && "ch-bar--dim")}
                  x={x} y={plotH - h} width={bw} height={h} rx={2}
                  style={{ fill: color, animationDelay: `${(i * 0.05).toFixed(2)}s` }}
                />
              );
            })}
          </g>
        );
      }}
    </ChartFrame>
  );
}
