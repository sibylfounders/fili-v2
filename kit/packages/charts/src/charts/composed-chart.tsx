"use client";
import * as React from "react";
import { cn } from "../lib/cn";
import { ChartFrame, TipRow } from "./chart-frame";
import { polyPath, gridFractions, type Pt } from "../lib/geometry";
import { fmtInt } from "../lib/format";

export interface ComposedPoint { bar: number; line: number; }
export interface ComposedChartProps {
  data: ComposedPoint[];
  labels?: string[];
  height?: number;
  barColor?: string;
  lineColor?: string;
  barLabel?: string;
  lineLabel?: string;
  format?: (n: number) => string;
  className?: string;
  ariaLabel?: string;
}

/** Barres + ligne superposees (facon ComposedChart), survol/tactile montrant les deux series. */
export function ComposedChart({
  data, labels, height = 160,
  barColor = "var(--primary-subtle)", lineColor = "var(--primary)",
  barLabel = "Barres", lineLabel = "Ligne", format = fmtInt, className, ariaLabel,
}: ComposedChartProps) {
  const n = data.length;
  const mx = Math.max.apply(null, data.map((d) => Math.max(d.bar, d.line))) || 1;
  const xAt = (i: number, plotW: number) => { const slot = plotW / n; return i * slot + slot / 2; };
  return (
    <ChartFrame
      height={height} count={n} ariaLabel={ariaLabel} className={className} xAt={xAt}
      xAxis={labels ? labels.map((m, i) => <span key={i}>{m}</span>) : undefined}
      tooltip={(i) => (
        <>
          <span className="ch-tip-x">{labels?.[i] ?? `#${i + 1}`}</span>
          <TipRow color={barColor} label={barLabel} value={format(data[i].bar)} />
          <TipRow color={lineColor} label={lineLabel} value={format(data[i].line)} />
        </>
      )}
    >
      {({ plotW, plotH, active }) => {
        const slot = plotW / n, bw = slot * 0.46;
        const lpts: Pt[] = data.map((d, i) => ({ x: i * slot + slot / 2, y: plotH - (d.line / mx) * plotH }));
        const ap = active != null ? lpts[active] : null;
        return (
          <g className="ch-anim">
            {gridFractions(4).map((f, i) => (
              <line key={i} className="ch-grid" x1={0} y1={plotH * f} x2={plotW} y2={plotH * f} />
            ))}
            {data.map((d, i) => {
              const h = (d.bar / mx) * plotH, x = i * slot + (slot - bw) / 2;
              return (
                <rect
                  key={i}
                  className={cn("ch-bar", active != null && active !== i && "ch-bar--dim")}
                  x={x} y={plotH - h} width={bw} height={h} rx={1.5}
                  style={{ fill: barColor, animationDelay: `${(i * 0.06).toFixed(2)}s` }}
                />
              );
            })}
            <path className="ch-cline" d={polyPath(lpts)} style={{ stroke: lineColor }} />
            {ap ? <circle className="ch-dot" cx={ap.x} cy={ap.y} r={4.5} style={{ stroke: lineColor }} /> : null}
          </g>
        );
      }}
    </ChartFrame>
  );
}
