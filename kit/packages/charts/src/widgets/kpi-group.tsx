"use client";
import * as React from "react";
import { cn } from "../lib/cn";
import { Sparkline } from "../charts/sparkline";
import { useCountUp } from "../lib/use-count-up";
import "./widgets.css";

export interface KpiItem {
  label: string;
  value: string;                    // valeur affichee (statique)
  countTo?: number;                 // si defini : valeur animee (count-up) vers cette cible
  format?: (n: number) => string;   // formateur du count-up (defaut : entier)
  delta?: { value: string; tone?: "up" | "down" };
  spark: number[];
  color?: string;
}

export interface KpiGroupProps {
  title?: string;      // en-tete facon HeroUI "With KPIs"
  period?: string;     // sous-titre / periode (ex. "30 derniers jours")
  items: KpiItem[];
  className?: string;
}

/** Valeur d'un KPI : animee (count-up) si `countTo` est fourni, sinon statique. */
function KpiValue({ item }: { item: KpiItem }) {
  const fmt = item.format ?? ((n: number) => String(Math.round(n)));
  const ref = useCountUp(item.countTo ?? 0, fmt);
  return item.countTo != null ? (
    <div className="sw-kpi-value" ref={ref}>{fmt(0)}</div>
  ) : (
    <div className="sw-kpi-value">{item.value}</div>
  );
}

/** Bandeau de metriques (facon HeroUI "With KPIs") : en-tete optionnel, puis colonnes
    libelle / valeur (animable) / delta / sparkline. Grille 1 -> N colonnes (container query). */
export function KpiGroup({ title, period, items, className }: KpiGroupProps) {
  return (
    <div className={cn("sw-kpiwrap", className)}>
      {title || period ? (
        <div className="sw-kpihead">
          {title ? <h4 className="sw-kpihead-title">{title}</h4> : <span />}
          {period ? <span className="sw-kpihead-period">{period}</span> : null}
        </div>
      ) : null}
      <div className="sw-kpis">
        {items.map((it, i) => {
          const down = it.delta?.tone === "down";
          return (
            <article className="sw-kpi" key={i}>
              <span className="sw-kpi-label">{it.label}</span>
              <KpiValue item={it} />
              {it.delta ? (
                <span className={cn("sw-delta", down && "is-neg")}>{down ? "▼" : "▲"} {it.delta.value}</span>
              ) : null}
              <div className="sw-kpi-spark">
                <Sparkline data={it.spark} color={it.color ?? "var(--primary)"} fitParent />
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
