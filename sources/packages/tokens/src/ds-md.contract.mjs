// ─────────────────────────────────────────────────────────────────────────────
// CONTRAT DS-MD — valeurs d'AUTORITÉ importées de « Design System MD ».
//
// GÉNÉRÉ par build/sync-ds-md.mjs depuis apps/site/content/md/core/DESIGN.md.
// NE PAS ÉDITER À LA MAIN : relancer `npm run sync:ds-md` pour rafraîchir.
//
// La doctrine fait autorité sur les VALEURS ; tokens.source.mjs fait autorité sur les
// NOMS et l'organisation en trois étages. build/verify-ds-md.mjs asserte que chaque
// token DS-UI correspondant porte EXACTEMENT la valeur ci-dessous. Une divergence non
// déclarée est une dérive.
//
// Source : doctrine DS-MD — DESIGN.md v1.34.0
// ─────────────────────────────────────────────────────────────────────────────

export const dsMdVersion = "1.34.0";
export const syncedAt = "2026-07-29";

export const contract = {
  "colors": {
    "primary": "#4F46E5",
    "primary-hover": "#4338CA",
    "on-primary": "#FFFFFF",
    "primary-subtle": "#E0E7FF",
    "primary-subtle-hover": "#C7D2FE",
    "on-primary-subtle": "#3730A3",
    "secondary": "#0F766E",
    "secondary-hover": "#115E59",
    "secondary-subtle": "#CCFBF1",
    "secondary-subtle-hover": "#99F6E4",
    "on-secondary": "#FFFFFF",
    "danger": "#B91C1C",
    "danger-hover": "#991B1B",
    "danger-subtle": "#FEE2E2",
    "danger-subtle-hover": "#FBCFCF",
    "success": "#15803D",
    "success-subtle": "#DCFCE7",
    "info": "#0369A1",
    "info-subtle": "#E0F2FE",
    "warning": "#92400E",
    "warning-hover": "#78350F",
    "warning-subtle": "#FEF3C7",
    "warning-subtle-hover": "#FDE68A",
    "background": "#FFFFFF",
    "surface": "#F3F4F6",
    "surface-hover": "#E5E7EB",
    "surface-contrast": "#1C1C1E",
    "text-primary": "#111827",
    "text-secondary": "#4B5563",
    "text-muted": "#9CA3AF",
    "border": "#E5E7EB",
    "border-strong": "#6B7280",
    "neutral-strong": "#111827",
    "neutral-strong-hover": "#1F2937"
  },
  "spacing": {
    "base": "4px",
    "xs": "4px",
    "sm": "8px",
    "md": "16px",
    "lg": "24px",
    "xl": "40px",
    "section": "80px"
  },
  "radius": {
    "sm": "4px",
    "md": "8px",
    "lg": "12px",
    "pill": "9999px"
  },
  "elevation": {
    "none": "none",
    "raised": "0 1px 3px rgba(17, 24, 39, 0.10)",
    "overlay": "0 4px 12px rgba(17, 24, 39, 0.14)"
  },
  "typography": {
    "display": {
      "fontFamily": "Geist",
      "fontSize": "48px",
      "fontWeight": 500,
      "lineHeight": "1.1"
    }
  }
};
