"use client";
import * as React from "react";

/** Compteur anime (easing cubic-out) vers une valeur cible ; respecte prefers-reduced-motion.
    Rend un ref a poser sur l'element texte. */
export function useCountUp(target: number, format: (v: number) => string, duration = 850) {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion:reduce)").matches) {
      el.textContent = format(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const step = (n: number) => {
      const k = Math.min(1, (n - t0) / duration), e = 1 - Math.pow(1 - k, 3);
      el.textContent = format(target * e);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, format, duration]);
  return ref;
}
