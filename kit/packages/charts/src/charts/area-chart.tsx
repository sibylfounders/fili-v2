"use client";
import * as React from "react";
import { ChartFrame, TipRow } from "./chart-frame";
import { points, smoothPath, extent, gridFractions } from "../lib/geometry";
import { fmtInt } from "../lib/format";

export interface AreaChartProps {
  data: number[];
  labels?: string[];
  height?: number;
  color?: string;
  label?: string;
  format?: (n: number) => string;
  floorZero?: boolean;
  className?: string;
  ariaLabel?: string;
}

/** Aire lissee + ligne, grille, axe X, survol/tactile (crosshair + point + infobulle). */
export function AreaChart({
  data, labels, height = 160, color = "var(--primary)",
  label = "Valeur", format = fmtInt, floorZero, className, ariaLabel,
}: AreaChartProps) {
  const uid = React.useId().replace(/:/g, "");
  const gid = `chArea-${uid}`, cid = `chAreaClip-${uid}`;
  const n = data.length;
  const dom = extent(data, floorZero);
  const xAt = (i: number, plotW: number) => (n <= 1 ? plotW / 2 : (i / (n - 1)) * plotW);
  return (
    <ChartFrame
      height={height} count={n} ariaLabel={ariaLabel} className={className} xAt={xAt}
      xAxis={labels ? labels.map((m, i) => <span key={i}>{m}</span>) : undefined}
      tooltip={(i) => (
        <>
          <span className="ch-tip-x">{labels?.[i] ?? `#${i + 1}`}</span>
          <TipRow color={color} label={label} value={format(data[i])} />
        </>
      )}
    >
      {({ plotW, plotH, active }) => {
        const pts = points(data, plotW, plotH, 2, dom);
        const { line, area } = smoothPath(pts, plotW, plotH);
        const ap = active != null ? pts[active] : null;
        return (
          <g className="ch-anim">
            {gridFractions(4).map((f, i) => (
              <line key={i} className="ch-grid" x1={0} y1={plotH * f} x2={plotW} y2={plotH * f} />
            ))}
            <defs>
              <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={color} stopOpacity="0.24" />
                <stop offset="1" stopColor={color} stopOpacity="0" />
              </linearGradient>
              <clipPath id={cid}>
                <rect className="ch-reveal" x="0" y="0" width={plotW} height={plotH} />
              </clipPath>
            </defs>
            <g clipPath={`url(#${cid})`}>
              <path d={area} fill={`url(#${gid})`} />
              <path className="ch-line" d={line} style={{ stroke: color }} />
            </g>
            {ap ? <circle className="ch-dot" cx={ap.x} cy={ap.y} r={4.5} style={{ stroke: color }} /> : null}
          </g>
        );
      }}
    </ChartFrame>
  );
}
