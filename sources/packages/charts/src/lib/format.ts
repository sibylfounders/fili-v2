/* Formateurs fr-FR — la locale utilise une espace fine insecable (U+202F) comme
   separateur de milliers ; on la normalise en espace simple, comme dans l'atelier. */
const norm = (s: string) => s.replace(/[\u202f\u00a0]/g, " ");

export const fr = (n: number, opts?: Intl.NumberFormatOptions) =>
  norm(n.toLocaleString("fr-FR", opts));

export const fmtInt = (n: number) => fr(Math.round(n));
export const fmtEur = (n: number) => fr(Math.round(n)) + " €";
export const fmtPct = (n: number, d = 1) =>
  fr(n, { minimumFractionDigits: 0, maximumFractionDigits: d }) + " %";
export const fmtCompact = (n: number) =>
  norm(n.toLocaleString("fr-FR", { notation: "compact", maximumFractionDigits: 1 }));
