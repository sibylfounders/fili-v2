"use client";
import * as React from "react";
import { cn } from "../lib/cn";
import { ProgressCircle } from "./progress-circle";
import { fmtInt } from "../lib/format";
import "./widgets.css";

export interface UsageRow {
  label: string;
  used: number;
  total: number;
  unit?: string;
  color?: string;
}

export interface UsageSummaryProps {
  title?: string;
  rows: UsageRow[];
  className?: string;
}

/** Recap de consommation (facon HeroUI "Usage Summary") : une ligne par ressource,
    anneau de progression + used / total. Structure (pas de graphe), sur tokens. */
export function UsageSummary({ title, rows, className }: UsageSummaryProps) {
  return (
    <div className={cn("sw-usage", className)}>
      {title ? <div className="sw-usage-head"><h4>{title}</h4></div> : null}
      <ul className="sw-usage-list">
        {rows.map((r, i) => {
          const pct = r.total ? (r.used / r.total) * 100 : 0;
          return (
            <li key={i}>
              <ProgressCircle value={r.used} max={r.total} size={40} stroke={5} color={r.color}>
                <span className="sw-usage-pct">{Math.round(pct)}<i>%</i></span>
              </ProgressCircle>
              <div className="sw-usage-meta">
                <span className="sw-usage-label">{r.label}</span>
                <span className="sw-usage-val">{fmtInt(r.used)} / {fmtInt(r.total)}{r.unit ? " " + r.unit : ""}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
