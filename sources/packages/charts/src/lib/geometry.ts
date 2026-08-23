/* Geometrie des courbes — pur calcul SVG sur un repere plot (origine haut-gauche,
   y vers le bas). Transcrit et generalise depuis l'atelier (catmull-rom -> bezier). */

export interface Pt { x: number; y: number; }

export function extent(vals: number[], floorZero = false) {
  let mn = Math.min.apply(null, vals);
  let mx = Math.max.apply(null, vals);
  if (floorZero) mn = Math.min(0, mn);
  if (mn === mx) mx = mn + 1;
  return { mn, mx };
}

/** Points (x,y) en pixels pour une serie, repartis regulierement sur la largeur. */
export function points(vals: number[], W: number, H: number, pad = 0, dom?: { mn: number; mx: number }): Pt[] {
  const n = vals.length;
  const { mn, mx } = dom || extent(vals);
  const rng = mx - mn || 1;
  return vals.map((v, i) => ({
    x: n === 1 ? W / 2 : (i / (n - 1)) * W,
    y: H - pad - ((v - mn) / rng) * (H - 2 * pad),
  }));
}

/** Chemin lisse (catmull-rom -> bezier cubique) + variante aire fermee. */
export function smoothPath(pts: Pt[], W: number, H: number) {
  if (!pts.length) return { line: "", area: "" };
  const n = pts.length;
  let d = "M" + pts[0].x.toFixed(2) + " " + pts[0].y.toFixed(2);
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6;
    d += " C" + c1x.toFixed(2) + " " + c1y.toFixed(2) + " " + c2x.toFixed(2) + " " + c2y.toFixed(2) + " " + p2.x.toFixed(2) + " " + p2.y.toFixed(2);
  }
  return { line: d, area: d + " L" + W.toFixed(2) + " " + H.toFixed(2) + " L0 " + H.toFixed(2) + " Z" };
}

/** Ligne brisee (droite) entre points. */
export function polyPath(pts: Pt[]) {
  if (!pts.length) return "";
  return pts.reduce((d, p, i) => d + (i ? " L" : "M") + p.x.toFixed(2) + " " + p.y.toFixed(2), "");
}

/** Fractions horizontales pour la grille (par defaut 3 lignes intermediaires). */
export const gridFractions = (steps = 4) =>
  Array.from({ length: steps - 1 }, (_, i) => (i + 1) / steps);
