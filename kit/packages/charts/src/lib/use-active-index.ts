"use client";
import * as React from "react";

/** Traduit la position du pointeur (souris OU tactile, via Pointer Events) en index
    de donnee le plus proche. L'overlay qui recoit ces handlers epouse la zone de trace. */
export function useActiveIndex(count: number) {
  const [index, setIndex] = React.useState<number | null>(null);
  const at = React.useCallback(
    (e: React.PointerEvent) => {
      if (count < 1) return;
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      if (rect.width <= 0) return;
      const t = count === 1 ? 0 : ((e.clientX - rect.left) / rect.width) * (count - 1);
      setIndex(Math.max(0, Math.min(count - 1, Math.round(t))));
    },
    [count]
  );
  const clear = React.useCallback(() => setIndex(null), []);
  return {
    index,
    bind: {
      onPointerMove: at,
      onPointerDown: at,
      onPointerLeave: clear,
      onPointerCancel: clear,
      onPointerUp: clear,
    } as const,
  };
}
