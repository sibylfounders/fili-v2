"use client";
import * as React from "react";
import { ChartFrame, TipRow } from "./chart-frame";
import { points, smoothPath, polyPath, extent, gridFractions } from "../lib/geometry";
import { fmtInt } from "../lib/format";

const LINE_PALETTE = ["var(--ch-cat-1)", "var(--ch-cat-4)", "var(--ch-cat-3)", "var(--ch-cat-5)", "var(--ch-cat-2)"];

export interface LineSeries {
  label: string;
  data: number[];
  color?: string;
}
export interface LineChartProps {
  series: LineSeries[];
  labels?: string[];
  height?: number;
  format?: (n: number) => string;
  floorZero?: boolean;
  smooth?: boolean;   // lissage catmull-rom (defaut true)
  legend?: boolean;   // legende de series au-dessus (defaut true)
  className?: string;
  ariaLabel?: string;
}

/** Graphe multi-series (2+ lignes) sur un domaine partage : grille, axe X, legende,
    survol/tactile (crosshair + point par serie + infobulle listant toutes les series). */
export function LineChart({
  series, labels, height = 160, format = fmtInt, floorZero,
  smooth = true, legend = true, className, ariaLabel,
}: LineChartProps) {
  const uid = React.useId().replace(/:/g, "");
  const cid = `chLineClip-${uid}`;
  const n = series.reduce((m, s) => Math.max(m, s.data.length), 0);
  const colorOf = (s: LineSeries, i: number) => s.color ?? LINE_PALETTE[i % LINE_PALETTE.length];
  const all = series.flatMap((s) => s.data);
  const dom = extent(all.length ? all : [0, 1], floorZero);
  const xAt = (i: number, plotW: number) => (n <= 1 ? plotW / 2 : (i / (n - 1)) * plotW);
  return (
    <div className={className}>
      {legend ? (
        <div className="ch-legend-top">
          {series.map((s, i) => (
            <span key={i} className="ch-legend-top-item">
              <span className="ch-sw" style={{ background: colorOf(s, i) }} />
              {s.label}
            </span>
          ))}
        </div>
      ) : null}
      <ChartFrame
        height={height} count={n} ariaLabel={ariaLabel} xAt={xAt}
        xAxis={labels ? labels.map((m, i) => <span key={i}>{m}</span>) : undefined}
        tooltip={(i) => (
          <>
            <span className="ch-tip-x">{labels?.[i] ?? `#${i + 1}`}</span>
            {series.map((s, k) => (
              <TipRow key={k} color={colorOf(s, k)} label={s.label} value={s.data[i] != null ? format(s.data[i]) : "—"} />
            ))}
          </>
        )}
      >
        {({ plotW, plotH, active }) => (
          <g className="ch-anim">
            {gridFractions(4).map((f, i) => (
              <line key={i} className="ch-grid" x1={0} y1={plotH * f} x2={plotW} y2={plotH * f} />
            ))}
            <defs>
              <clipPath id={cid}>
                <rect className="ch-reveal" x="0" y="0" width={plotW} height={plotH} />
              </clipPath>
            </defs>
            <g clipPath={`url(#${cid})`}>
              {series.map((s, k) => {
                const pts = points(s.data, plotW, plotH, 2, dom);
                const d = smooth ? smoothPath(pts, plotW, plotH).line : polyPath(pts);
                return <path key={k} className="ch-line" d={d} style={{ stroke: colorOf(s, k) }} />;
              })}
            </g>
            {active != null
              ? series.map((s, k) => {
                  const ap = points(s.data, plotW, plotH, 2, dom)[active];
                  return ap ? <circle key={k} className="ch-dot" cx={ap.x} cy={ap.y} r={4} style={{ stroke: colorOf(s, k) }} /> : null;
                })
              : null}
          </g>
        )}
      </ChartFrame>
    </div>
  );
}
