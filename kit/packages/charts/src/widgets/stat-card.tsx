"use client";
import * as React from "react";
import { cn } from "../lib/cn";
import { Sparkline } from "../charts/sparkline";
import { useCountUp } from "../lib/use-count-up";
import { fmtEur } from "../lib/format";
import "./widgets.css";

export interface StatDelta { value: string; tone?: "up" | "down"; }

export interface StatCardProps {
  title: string;
  period?: string;
  value: number;
  format?: (n: number) => string;
  delta?: StatDelta;
  spark?: number[];
  sparkColor?: string;
  details?: [string, string][];
  showState?: boolean;         // badge compact/regular/expanded (demo d'adaptativite)
  className?: string;
}

/** Carte KPI adaptative (compact / regular / expanded selon SA largeur), chiffre anime
    (count-up) et sparkline. Le seuil est decide par le conteneur de la carte. */
export function StatCard({
  title, period, value, format = fmtEur, delta, spark,
  sparkColor = "var(--primary)", details, showState = true, className,
}: StatCardProps) {
  const figRef = useCountUp(value, format);
  const down = delta?.tone === "down";
  return (
    <div className={cn("sw-cell", className)}>
      <article className="sw-card">
        {showState ? <span className="sw-state" aria-hidden="true" /> : null}
        <h4 className="sw-card-title">{title}</h4>
        {period ? <p className="sw-sub">{period}</p> : null}
        <div className="sw-figure" ref={figRef}>{format(0)}</div>
        {delta ? (
          <span className={cn("sw-delta", down && "is-neg")}>{down ? "▼" : "▲"} {delta.value}</span>
        ) : null}
        {spark ? (
          <div className="sw-spark"><Sparkline data={spark} color={sparkColor} fitParent interactive format={format} /></div>
        ) : null}
        {details ? (
          <div className="sw-detail">
            <ul>{details.map((d, i) => <li key={i}><span>{d[0]}</span><span>{d[1]}</span></li>)}</ul>
          </div>
        ) : null}
      </article>
    </div>
  );
}
