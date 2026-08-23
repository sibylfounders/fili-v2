"use client";
import * as React from "react";
import { cn } from "../lib/cn";
import type { StatDelta } from "./stat-card";
import "./widgets.css";

export interface ChartCardProps {
  title: string;
  sub?: string;
  delta?: StatDelta;
  children: React.ReactNode;   // un graphe @fili/charts
  className?: string;
}

/** Conteneur de widget (facon HeroUI "Widget") : en-tete titre + sous-titre + delta,
    puis le graphe. Portee container `sw-card` pour l'adaptativite du contenu. */
export function ChartCard({ title, sub, delta, children, className }: ChartCardProps) {
  const down = delta?.tone === "down";
  return (
    <div className={cn("sw-chartcard", className)}>
      <div className="sw-chartcard-head">
        <div>
          <h4 className="sw-card-title">{title}</h4>
          {sub ? <p className="sw-sub">{sub}</p> : null}
        </div>
        {delta ? <span className={cn("sw-delta", down && "is-neg")}>{down ? "▼" : "▲"} {delta.value}</span> : null}
      </div>
      {children}
    </div>
  );
}
