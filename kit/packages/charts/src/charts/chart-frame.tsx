"use client";
import * as React from "react";
import { cn } from "../lib/cn";
import { useChartSize } from "../lib/use-chart-size";
import { useActiveIndex } from "../lib/use-active-index";
import "./charts.css";

export interface Pad { t: number; r: number; b: number; l: number; }
export const DEFAULT_PAD: Pad = { t: 10, r: 10, b: 6, l: 10 };

export interface FrameCtx {
  W: number;      // largeur svg totale (px)
  H: number;      // hauteur svg totale (px)
  plotW: number;  // largeur zone de trace
  plotH: number;  // hauteur zone de trace
  active: number | null;
}

export interface ChartFrameProps {
  height?: number;                                   // hauteur de la zone svg
  pad?: Partial<Pad>;
  count: number;                                     // nb de points (mapping pointeur)
  interactive?: boolean;                             // survol/tactile (defaut true)
  crosshair?: boolean;                               // trait vertical au point actif
  xAt?: (i: number, plotW: number) => number;        // x (dans le plot) d'un index
  tooltip?: (i: number) => React.ReactNode;          // contenu de l'infobulle
  xAxis?: React.ReactNode;                           // rangee de libelles sous le trace
  ariaLabel?: string;
  className?: string;
  children: (ctx: FrameCtx) => React.ReactNode;      // dessin svg (repere plot, origine 0,0)
}

/** Cadre commun a tous les graphes : mesure responsive, calque d'interaction
    (pointeur souris/tactile), point actif, crosshair et infobulle HTML positionnee. */
export function ChartFrame({
  height = 150,
  pad: padIn,
  count,
  interactive = true,
  crosshair = true,
  xAt,
  tooltip,
  xAxis,
  ariaLabel,
  className,
  children,
}: ChartFrameProps) {
  const [ref, width] = useChartSize<HTMLDivElement>();
  const { index, bind } = useActiveIndex(count);
  const active = interactive ? index : null;

  const pad: Pad = { ...DEFAULT_PAD, ...padIn };
  const W = width;
  const H = height;
  const plotW = Math.max(0, W - pad.l - pad.r);
  const plotH = Math.max(0, H - pad.t - pad.b);
  const cx = xAt && active != null ? xAt(active, plotW) : 0;

  return (
    <div ref={ref} className={cn("ch-frame", className)} role="img" aria-label={ariaLabel}>
      {W > 0 ? (
        <>
          <div className="ch-plot" style={{ height: H }}>
            <svg className="ch-svg" width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
              <g transform={`translate(${pad.l},${pad.t})`}>
                {crosshair && active != null ? (
                  <line className="ch-cross" x1={cx} y1={0} x2={cx} y2={plotH} />
                ) : null}
                {children({ W, H, plotW, plotH, active })}
              </g>
            </svg>
            {interactive ? (
              <div
                className="ch-overlay"
                style={{ left: pad.l, top: pad.t, width: plotW, height: plotH }}
                {...bind}
              />
            ) : null}
            {tooltip && active != null ? (
              <div className="ch-tip" style={{ left: pad.l + cx, top: pad.t }}>
                {tooltip(active)}
              </div>
            ) : null}
          </div>
          {xAxis ? <div className="ch-xaxis">{xAxis}</div> : null}
        </>
      ) : (
        <div style={{ height: H }} aria-hidden="true" />
      )}
    </div>
  );
}

/** Ligne d'infobulle reutilisable : pastille de couleur + libelle + valeur. */
export function TipRow({ color, label, value }: { color: string; label: string; value: React.ReactNode }) {
  return (
    <span className="ch-tip-row">
      <span className="ch-tip-sw" style={{ background: color }} />
      <span className="ch-tip-lbl">{label}</span>
      <b className="ch-tip-val">{value}</b>
    </span>
  );
}
