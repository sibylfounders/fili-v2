"use client";
import * as React from "react";
import { Input, Select, Switch } from "@fili/react";
import type { Control } from "./registry";

/** Panneau de contrôles façon Figma : rangées label→contrôle, sections explicites
 *  (c.sec : Card / Groupe / Interaction) séparées par un filet, dropdowns ghost. */
export function Controls({
  controls,
  state,
  set,
}: {
  controls: Control[];
  state: Record<string, any>;
  set: (k: string, v: any) => void;
}) {
  const row = (c: Control) => {
    const label = c.label ?? c.k;
    if (c.type === "seg")
      return (
        <div key={c.k} className="flex items-center justify-between gap-md">
          <span className="text-sm text-text-secondary">{label}</span>
          <Select
            options={c.opts.map((o) => ({ value: o, label: o }))}
            value={state[c.k]}
            onValueChange={(v) => set(c.k, v)}
            aria-label={label}
            size="sm"
            variant="ghost"
          />
        </div>
      );
    if (c.type === "bool")
      return (
        <div key={c.k} className="flex items-center justify-between gap-md">
          <span className="text-sm text-text-secondary">{label}</span>
          <Switch checked={!!state[c.k]} onCheckedChange={(v) => set(c.k, v)} aria-label={label} size="sm" />
        </div>
      );
    if (c.type === "text")
      return (
        <label key={c.k} className="flex flex-col gap-1">
          <span className="text-sm text-text-secondary">{label}</span>
          {/* Champ du kit — plus d'<input> restylé dans le playground. */}
          <Input.Root size="sm">
            <Input.Wrapper>
              <Input.Input value={state[c.k] ?? ""} onChange={(e) => set(c.k, e.target.value)} />
            </Input.Wrapper>
          </Input.Root>
        </label>
      );
    if (c.type === "range")
      return (
        <label key={c.k} className="flex flex-col gap-1">
          <span className="text-sm text-text-secondary">
            {label} <b className="text-text-primary">{state[c.k]}{c.unit ?? ""}</b>
          </span>
          {/* FILI-MANQUE: slider — le kit n'a pas de Slider ; implémentation locale PROVISOIRE déclarée (fiche : content/md/inventaires/manques/slider.md), à remplacer après arbitrage. */}
          <input type="range" min={c.min} max={c.max} step={c.step ?? 1} value={state[c.k]} onChange={(e) => set(c.k, Number(e.target.value))} />
        </label>
      );
    return null;
  };

  const out: React.ReactNode[] = [];
  let prevSec: string | null = null;
  let prevType: string | null = null;
  controls.forEach((c) => {
    if (c.sec && c.sec !== prevSec) {
      if (prevSec !== null || prevType !== null) out.push(<div key={`d-${c.k}`} className="my-1 border-t border-border" />);
      out.push(
        <p key={`s-${c.k}`} className="font-label text-[11px] font-semibold uppercase tracking-wider text-text-muted">{c.sec}</p>
      );
      prevSec = c.sec;
    } else if (!c.sec && c.type === "bool" && prevType && prevType !== "bool") {
      out.push(<div key={`d-${c.k}`} className="my-1 border-t border-border" />);
    }
    prevType = c.type;
    const off = c.disabled?.(state);
    out.push(
      off ? (
        <div key={`off-${c.k}`} className="pointer-events-none select-none opacity-40" aria-disabled="true">{row(c)}</div>
      ) : (
        row(c)
      )
    );
  });

  return <div className="flex flex-col gap-md">{out}</div>;
}
