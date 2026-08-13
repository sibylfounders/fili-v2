"use client";
import * as React from "react";
import { cn } from "../lib/cn";
import { points, smoothPath } from "../lib/geometry";
import { useActiveIndex } from "../lib/use-active-index";

export interface SparklineProps {
  data: number[];
  height?: number;
  color?: string;
  fill?: boolean;
  fitParent?: boolean;
  interactive?: boolean;              // survol/tactile : point actif + valeur
  format?: (n: number) => string;     // format de la valeur au survol
  labels?: string[];                  // libelle optionnel affiche au survol
  className?: string;
}

/** Mini-courbe : decorative par defaut ; `interactive` ajoute point + valeur au survol.
    Positionnement en % (le viewBox est etire), donc pas de mesure de taille cote survol. */
export function Sparkline({
  data, height = 40, color = "var(--primary)", fill = true, fitParent = false,
  interactive = false, format = (n) => String(Math.round(n)), labels, className,
}: SparklineProps) {
  const uid = React.useId().replace(/:/g, "");
  const gid = `chSpark-${uid}`, cid = `chSparkClip-${uid}`;
  const W = 100, H = height;
  const pts = points(data, W, H, 3);
  const { line, area } = smoothPath(pts, W, H);
  const n = data.length;
  const { index, bind } = useActiveIndex(n);
  const active = interactive ? index : null;
  const lx = active != null ? (n <= 1 ? 50 : (active / (n - 1)) * 100) : 0;
  const ly = active != null ? (pts[active].y / H) * 100 : 0;
  const chipLeft = Math.min(86, Math.max(14, lx));
  return (
    <div
      className={cn("ch-spark", interactive && "ch-spark--live", className)}
      style={{ height: fitParent ? "100%" : height }}
      aria-hidden={interactive ? undefined : true}
    >
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: "block", width: "100%", height: "100%", overflow: "visible" }} aria-hidden="true">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={color} stopOpacity="0.22" />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </linearGradient>
          <clipPath id={cid}><rect className="ch-reveal" x="0" y="0" width={W} height={H} /></clipPath>
        </defs>
        <g className="ch-anim" clipPath={`url(#${cid})`}>
          {fill ? <path d={area} fill={`url(#${gid})`} /> : null}
          <path className="ch-line" d={line} style={{ stroke: color }} vectorEffect="non-scaling-stroke" />
        </g>
      </svg>
      {interactive ? <div className="ch-spark-hit" {...bind} /> : null}
      {active != null ? (
        <>
          <span className="ch-spark-dot" style={{ left: `${lx}%`, top: `${ly}%`, background: color }} />
          <span className="ch-spark-chip" style={{ left: `${chipLeft}%` }}>
            {labels?.[active] ? <i>{labels[active]}</i> : null}
            {format(data[active])}
          </span>
        </>
      ) : null}
    </div>
  );
}
