"use client";
import * as React from "react";

/** Mesure la largeur du conteneur via ResizeObserver, pour dessiner en pixels reels
    (viewBox 1:1, pas de distorsion, maths de pointeur triviales). */
export function useChartSize<T extends HTMLElement>() {
  const ref = React.useRef<T>(null);
  const [width, setWidth] = React.useState(0);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? el.clientWidth;
      setWidth(Math.round(w));
    });
    ro.observe(el);
    setWidth(Math.round(el.clientWidth));
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}
