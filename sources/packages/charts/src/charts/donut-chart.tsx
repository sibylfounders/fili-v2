"use client";
import * as React from "react";
import { cn } from "../lib/cn";
import { fmtCompact } from "../lib/format";

export interface DonutDatum { label: string; value: number; color: string; }
export interface DonutChartProps {
  data: DonutDatum[];
  total?: React.ReactNode;      // contenu central par defaut (sinon somme compacte)
  totalLabel?: string;          // sous-titre central
  legendValue?: (d: DonutDatum, pct: number) => React.ReactNode;
  className?: string;
  ariaLabel?: string;
}

/** Anneau responsive & anime. Survol/tactile d'un segment ou d'une legende : mise en
    avant + le centre bascule sur la part active. */
export function DonutChart({ data, total, totalLabel = "total", legendValue, className, ariaLabel }: DonutChartProps) {
  const [active, setActive] = React.useState<number | null>(null);
  const sum = data.reduce((a, d) => a + d.value, 0) || 1;
  const pct = (v: number) => (v / sum) * 100;
  let cum = 0;
  const segs = data.map((d) => {
    const p = pct(d.value);
    const rot = (cum / 100) * 360 - 90;
    cum += p;
    return { rot, dash: `${p.toFixed(2)} ${(100 - p).toFixed(2)}` };
  });
  const centerMain = active != null ? `${pct(data[active].value).toFixed(0)} %` : total ?? fmtCompact(sum);
  const centerSub = active != null ? data[active].label : totalLabel;
  const set = (i: number | null) => () => setActive(i);
  return (
    <div className={cn("ch-frame ch-card-scope", className)} role="img" aria-label={ariaLabel}>
      <div className="ch-donut-wrap ch-anim">
        <div className="ch-donut" onPointerLeave={set(null)}>
          <svg viewBox="0 0 42 42">
            <circle cx="21" cy="21" r="15.915" fill="none" stroke="var(--surface-hover)" strokeWidth="5.5" />
            {segs.map((s, i) => (
              <circle
                key={i}
                className={cn("ch-seg", active === i && "ch-seg--active", active != null && active !== i && "ch-seg--dim")}
                cx="21" cy="21" r="15.915" fill="none" stroke={data[i].color} strokeWidth="5.5" strokeDasharray={s.dash}
                style={{ transform: `rotate(${s.rot}deg)`, transformOrigin: "center" }}
                onPointerEnter={set(i)} onPointerDown={set(i)}
              />
            ))}
          </svg>
          <div className="ch-donut-center"><b>{centerMain}</b><span>{centerSub}</span></div>
        </div>
        <ul className="ch-legend">
          {data.map((d, i) => (
            <li
              key={i}
              className={cn(active === i && "is-active", active != null && active !== i && "is-dim")}
              onPointerEnter={set(i)} onPointerLeave={set(null)} onPointerDown={set(i)}
            >
              <span className="ch-sw" style={{ background: d.color }} />
              {d.label}
              <b>{legendValue ? legendValue(d, pct(d.value)) : `${pct(d.value).toFixed(0)} %`}</b>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
