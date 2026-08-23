// Design System UI — SOURCE DES TOKENS : les NOMS et l'ORGANISATION.
// Écrit à la main. Tout le reste (CSS, thème Tailwind, variables Figma) en est GÉNÉRÉ.
//
// Partage d'autorité, pour qu'il n'y ait jamais deux « sources de vérité » :
//   • la doctrine (apps/site/content/md/core/DESIGN.md) tranche les VALEURS partagées ;
//   • ce fichier tranche les NOMS, les trois étages et tout ce que DS-MD ne nomme pas
//     (échelles primitives complètes, mode sombre, états dérivés).
// La garde build/verify-ds-md.mjs confronte les deux à chaque build : une valeur qui
// s'écarte de DESIGN.md sans arbitrage déclaré dans ds-md.map.mjs est une dérive.

// ─────────────────────────────────────────────────────────────────────────────
// ÉTAGE 1 — PRIMITIVES (échelles brutes, ne jamais consommer directement en composant)
// ─────────────────────────────────────────────────────────────────────────────
export const primitives = {
  neutral: {
    0: "#FFFFFF", 50: "#F9FAFB", 100: "#F3F4F6", 200: "#E5E7EB", 300: "#D1D5DB",
    400: "#9CA3AF", 500: "#6B7280", 600: "#4B5563", 700: "#374151", 800: "#1F2937",
    900: "#111827", 950: "#030712",
  },
  // primary = indigo (DS-MD primary #4F46E5 = indigo-600)
  indigo: {
    50: "#EEF2FF", 100: "#E0E7FF", 200: "#C7D2FE", 300: "#A5B4FC", 400: "#818CF8",
    500: "#6366F1", 600: "#4F46E5", 700: "#4338CA", 800: "#3730A3", 900: "#312E81",
    950: "#1E1B4B",
  },
  // error = red (DS-MD danger #B91C1C = red-700)
  red: {
    50: "#FEF2F2", 100: "#FEE2E2",
    // 150 : cran INTERMÉDIAIRE calibré par la doctrine, pas un pas d'échelle Tailwind.
    // DESIGN.md 1.21.0 : « un #FECACA red-200 naïf tombait à 4.47:1, sous le seuil ».
    // #FBCFCF tient 4.60:1 sous `danger` #B91C1C. Seul `danger-subtle-hover` le consomme.
    150: "#FBCFCF",
    200: "#FECACA", 300: "#FCA5A5", 400: "#F87171",
    500: "#EF4444", 600: "#DC2626", 700: "#B91C1C", 800: "#991B1B", 900: "#7F1D1D",
    950: "#450A0A",
  },
  // success = green (DS-MD success #15803D = green-700)
  green: {
    50: "#F0FDF4", 100: "#DCFCE7", 200: "#BBF7D0", 300: "#86EFAC", 400: "#4ADE80",
    500: "#22C55E", 600: "#16A34A", 700: "#15803D", 800: "#166534", 900: "#14532D",
    950: "#052E16",
  },
  // warning = amber (DS-MD warning #92400E = amber-800)
  amber: {
    50: "#FFFBEB", 100: "#FEF3C7", 200: "#FDE68A", 300: "#FCD34D", 400: "#FBBF24",
    500: "#F59E0B", 600: "#D97706", 700: "#B45309", 800: "#92400E", 900: "#78350F",
    950: "#451A03",
  },
  // info = sky (DS-MD 1.33.0 info #0369A1 = sky-700) — écarté d'indigo par la règle des 30°
  sky: {
    50: "#F0F9FF", 100: "#E0F2FE", 200: "#BAE6FD", 300: "#7DD3FC", 400: "#38BDF8",
    500: "#0EA5E9", 600: "#0284C7", 700: "#0369A1", 800: "#075985", 900: "#0C4A6E",
    950: "#082F49",
  },
  // secondary = teal (DS-MD 1.33.0 secondary #0F766E = teal-700) — 2e couleur de marque
  teal: {
    50: "#F0FDFA", 100: "#CCFBF1", 200: "#99F6E4", 300: "#5EEAD4", 400: "#2DD4BF",
    500: "#14B8A6", 600: "#0D9488", 700: "#0F766E", 800: "#115E59", 900: "#134E4A",
    950: "#042F2E",
  },
  static: { black: "#000000", white: "#FFFFFF" },
};

// Variantes alpha du neutre (state-layers, lavis) — sur neutral-950 froid
export const alpha = {
  "neutral-alpha-10": "rgba(3, 7, 18, 0.10)",
  "neutral-alpha-16": "rgba(3, 7, 18, 0.16)",
  "neutral-alpha-24": "rgba(3, 7, 18, 0.24)",
};

// ─────────────────────────────────────────────────────────────────────────────
// ÉTAGE 2 — RÔLES SÉMANTIQUES (nommés par usage, une valeur par mode)
//   ref "famille.pas" → résolu vers un hex primitif à la génération.
// ─────────────────────────────────────────────────────────────────────────────
// RÔLES À PLAT, nommés d'après l'AUTORITÉ DS-MD (tokens.yaml) — SOURCE UNIQUE DE VÉRITÉ.
// La valeur CLAIR est celle de l'autorité ; la valeur SOMBRE (que l'autorité ne définit pas)
// est fournie par le DS-UI sous le même nom (extension assumée). Convention de l'autorité :
//   {nom} (base) · {nom}-hover · on-{nom} · {nom}-subtle (+ -subtle-hover pour le lavis interactif).
export const semantic = {
  // ── Surfaces neutres (autorité : background / surface / surface-hover)
  "background":     { light: "neutral.0",   dark: "neutral.950" }, // surface de page
  "surface":        { light: "neutral.100", dark: "neutral.800" }, // zone surélevée / carte
  "surface-hover":  { light: "neutral.200", dark: "neutral.700" }, // survol de surface / remplissage ~10%
  "surface-inverse":{ light: "neutral.900", dark: "neutral.0"   }, // surface neutre inversée (bouton neutral plein) — extension DS-UI

  // ── Texte (autorité : text-primary / text-secondary / text-muted)
  "text-primary":   { light: "neutral.900", dark: "neutral.0"   },
  "text-secondary": { light: "neutral.600", dark: "neutral.400" },
  "text-muted":     { light: "neutral.400", dark: "neutral.500" },
  "text-disabled":  { light: "neutral.300", dark: "neutral.600" }, // extension DS-UI
  "text-inverse":   { light: "neutral.0",   dark: "neutral.900" }, // texte sur surface-inverse — extension DS-UI

  // ── INERTE (indisponible) : UN état, pas douze. L'opacité composite qui tenait lieu de
  // disabled faisait varier son intensité avec le style ET avec la surface posée dessous
  // (2,29:1 en filled sur page, 2,34:1 sur carte, 3,38:1 en ghost) : rien de mesurable par
  // une chaîne qui raisonne sur des PAIRES de tokens. Deux rôles nommés par l'INTENTION,
  // calés sur des crans existants (surface-hover / text-muted) — alias, comme neutral l'est
  // de surface-inverse : la rampe ne grandit pas, seule la nomenclature s'étend.
  // Le couple est VOLONTAIREMENT sous 4.5:1 (2,05:1 clair / 2,13:1 sombre) — l'inertie EST
  // le signal, et WCAG 1.4.3 exempte les contrôles indisponibles.
  "surface-disabled":    { light: "neutral.200", dark: "neutral.700" }, // extension DS-UI
  "on-surface-disabled": { light: "neutral.400", dark: "neutral.500" }, // extension DS-UI

  // ── Bordures (autorité : border / border-strong)
  "border":         { light: "neutral.200", dark: "neutral.800" }, // décorative / séparation
  "border-strong":  { light: "neutral.500", dark: "neutral.400" }, // délimitante 3:1 (WCAG 1.4.11)
  "border-inverse": { light: "neutral.0",   dark: "neutral.950" }, // couture sur surface-inverse — extension DS-UI

  // ── static (papier E-motion) : HORS autorité, fixe (light === dark), jamais inversé
  "static-base":    { light: "neutral.0",   dark: "neutral.0"   },
  "static-dark":    { light: "neutral.200", dark: "neutral.200" },
  "static-darker":  { light: "neutral.400", dark: "neutral.400" },

  // ── Marque primaire (autorité : primary / primary-hover / on-primary)
  "primary":        { light: "indigo.600", dark: "indigo.400" },
  "primary-hover":  { light: "indigo.700", dark: "indigo.300" },
  "on-primary":     { light: "neutral.0",  dark: "neutral.950" },
  // lavis primaire (autorité 1.33.0 : primary-subtle — l'ex-« secondary », renommé pour
  // suivre la convention {nom}-subtle et LIBÉRER le nom secondary pour une vraie 2e marque)
  "primary-subtle":        { light: "indigo.100", dark: "indigo.900" },
  "primary-subtle-hover":  { light: "indigo.200", dark: "indigo.800" },
  "on-primary-subtle":     { light: "indigo.800", dark: "indigo.200" },

  // ── SECONDARY = 2e couleur de marque (teal — autorité 1.33.0, arbitrage Aurélien 2026-07-29)
  "secondary":              { light: "teal.700", dark: "teal.400" },
  "secondary-hover":        { light: "teal.800", dark: "teal.300" },
  "secondary-subtle":       { light: "teal.100", dark: "teal.950" },
  "secondary-subtle-hover": { light: "teal.200", dark: "teal.900" },
  "on-secondary":           { light: "neutral.0", dark: "neutral.950" },

  // ── NEUTRAL = la famille du tone neutre des boutons (autorité : neutral-strong[-hover]).
  // Solide = l'inverse haute-contraste ; son subtil EST surface/surface-hover (pas de doublon) ;
  // son contour EST border-strong. Alias sémantiques de surface-inverse/text-inverse.
  "neutral":        { light: "neutral.900", dark: "neutral.0"   },
  "neutral-hover":  { light: "neutral.800", dark: "neutral.100" },
  "on-neutral":     { light: "neutral.0",   dark: "neutral.900" },

  // accent RETIRÉ (DESIGN.md 1.34.0, arbitrage 2026-07-29 soir) : créé en 1.33.0 pour le
  // focus ring, libéré par le focus v2 (crans control.focus-* accordés) — un token sans
  // propriétaire n'a pas de place. Le calibrage fuchsia (règle des 30°) reste journalisé.

  // ── Destructif (autorité : danger / danger-hover / danger-subtle) — ex-« error »
  "danger":              { light: "red.700", dark: "red.400" },
  "danger-hover":        { light: "red.800", dark: "red.300" },
  "danger-subtle":       { light: "red.100", dark: "red.950" },
  // Le CLAIR n'est PAS une extension : l'autorité le définit et l'a calibré (cf. red.150).
  // Le SOMBRE, lui, reste une extension DS-UI comme tout le mode sombre.
  "danger-subtle-hover": { light: "red.150", dark: "red.900" },
  "on-danger":           { light: "neutral.0", dark: "neutral.950" },

  // ── Succès (autorité : success / success-subtle)
  "success":              { light: "green.700", dark: "green.400" },
  "success-hover":        { light: "green.800", dark: "green.300" },
  "success-subtle":       { light: "green.100", dark: "green.950" },
  "success-subtle-hover": { light: "green.200", dark: "green.900" },
  "on-success":           { light: "neutral.0", dark: "neutral.950" },

  // ── Info (autorité : info / info-subtle)
  "info":              { light: "sky.700", dark: "sky.400" },
  "info-hover":        { light: "sky.800", dark: "sky.300" },
  "info-subtle":       { light: "sky.100", dark: "sky.950" },
  "info-subtle-hover": { light: "sky.200", dark: "sky.900" },
  "on-info":           { light: "neutral.0", dark: "neutral.950" },

  // ── Avertissement (autorité : warning / warning-subtle / warning-subtle-hover)
  "warning":              { light: "amber.800", dark: "amber.400" },
  "warning-hover":        { light: "amber.900", dark: "amber.300" },
  "warning-subtle":       { light: "amber.100", dark: "amber.950" },
  "warning-subtle-hover": { light: "amber.200", dark: "amber.900" },
  "on-warning":           { light: "neutral.0", dark: "neutral.950" },
};

// Familles d'états (pour la validation de contraste et le regroupement) — dérivé du plat ci-dessus.
export const stateFamilies = ["primary", "secondary", "danger", "success", "info", "warning"];
// Conservé pour compat d'import ; les rôles vivent désormais à plat dans `semantic`.
export const states = {};

// ─────────────────────────────────────────────────────────────────────────────
// FONDATIONS NON-COULEUR — héritées de DS-MD (déjà validées), reprises telles quelles
// ─────────────────────────────────────────────────────────────────────────────
export const typography = {
  fontFamily: {
    sans: "Geist, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, 'SF Mono', 'Cascadia Mono', Consolas, monospace",
    label: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  },
  // échelle fluide DS-MD (clamp rem+vw), titres graisse 500
  heading: {
    h1: "clamp(2rem, 1.67rem + 1.67vw, 3rem)",
    h2: "clamp(1.5rem, 1.33rem + 0.83vw, 2rem)",
    h3: "clamp(1.25rem, 1.17rem + 0.42vw, 1.5rem)",
    h4: "clamp(1.125rem, 1.08rem + 0.21vw, 1.25rem)",
    h5: "clamp(1rem, 0.96rem + 0.21vw, 1.125rem)",
    h6: "clamp(0.875rem, 0.83rem + 0.21vw, 1rem)",
  },
  // grille jumelle label(500)/paragraphe(400) sur corps partagés
  // 2xs (11px) : cran MICRO des interfaces denses — overlines, têtes de groupe de nav,
  // badges du shell (arbitrage 2026-07-29 soir ; extension DS-UI, comme none/xs du radius).
  size: { xl: "24px", lg: "18px", md: "16px", sm: "14px", xs: "12px", "2xs": "11px" },
  weight: { regular: 400, medium: 500, semibold: 600 },
  icon: { sm: "16px", md: "20px", lg: "24px" },
  display: { fontSize: "48px", fontWeight: 500, lineHeight: "1.1" },
};

export const spacing = {
  0: "0px", base: "4px", xs: "4px", sm: "8px", md: "16px", lg: "24px",
  xl: "40px", "2xl": "64px", section: "80px",
};

// `lg` vient du contrat DS-MD. none/xs/2xl restent des extensions propres à DS-UI.
export const radius = { none: "0px", xs: "2px", sm: "4px", md: "8px", lg: "12px", "2xl": "20px", pill: "9999px" };

export const elevation = {
  none: "none",
  raised: "0 1px 3px rgba(3, 7, 18, 0.10)",
  overlay: "0 4px 12px rgba(3, 7, 18, 0.14)",
  // rôle "scène" : ombre ambiante des gabarits (jamais une affordance)
  scene: "0 24px 64px -16px rgba(3, 7, 18, 0.13), 0 4px 16px rgba(3, 7, 18, 0.05)",
};

// MOTION — durées + courbes des micro-interactions (DS-MD motion, fondation 1.11.0).
// Tout le système reste sous ~400ms ; rotation continue du spinner = seule exception au bannissement du linéaire.
export const motion = {
  duration: {
    fast: "100ms",  // feedback : hover, press, changement de couleur/bordure (~seuil perçu-instantané, Nielsen)
    base: "200ms",  // continuité locale : chevron, apparition, dépliage
    slow: "300ms",  // grandes surfaces — provisionné (panneaux, superposés)
    // Cran EXPRESSIF (fondation E-motion, DS-MD DESIGN 1.22.0) — au-delà de la borne ~400ms
    // du registre productif. RÉSERVÉ aux moments MÉRITÉS, sous budget de rareté (cf. EMOTION-UX).
    expressive: "700ms",   // beat d'un moment expressif signature
    celebration: "1200ms", // plafond DUR d'une séquence chorégraphiée complète (l'avion en papier)
  },
  easing: {
    "ease-out":    "cubic-bezier(0, 0, 0.2, 1)",   // ce qui entre décélère
    "ease-in":     "cubic-bezier(0.4, 0, 1, 1)",   // ce qui sort accélère
    "ease-in-out": "cubic-bezier(0.4, 0, 0.2, 1)", // ce qui bouge sur place (chevron, dépliage)
    spring:        "cubic-bezier(0.34, 1.56, 0.64, 1)", // overshoot — le « caractère » d'E-motion ; hors registre productif
  },
};

// GRID — largeurs de conteneur structurelles (DS-MD grid, fondation 1.18.0).
// max-width d'un conteneur de page (≠ breakpoint = point de bascule, ≠ measure = mesure de lecture).
// La grille de colonnes reste différée jusqu'au pattern collection/grille.
export const grid = {
  "container-narrow":  "480px",  // formulaire, auth, création de compte — mono-colonne focalisée
  "container-default": "1024px", // page de contenu ou d'app standard
  "container-wide":    "1440px", // dashboard, collection dense, tableau large
  // Item minimal d'une grille intrinsèque (DS-MD grid 1.27.0, pattern collection) : les colonnes
  // émergent de repeat(auto-fill, minmax(min(100%, item-min), 1fr)) — jamais d'un nombre par appareil.
  "item-min":          "256px",
  // Rails du SHELL applicatif (DS-MD grid 1.29.0) — largeurs fixes ; le contenu prend le reste.
  "rail-nav":   "280px", // rail de navigation (début)
  "rail-tools": "320px", // rail d'outils (fin)
  // Superposé modal centré (DS-MD grid 1.3.0, 2026-07-26) — la surface d'une modale n'est ni un
  // conteneur de page ni un rail. UN seul cran : le besoin réel est la modale qui porte une
  // illustration ou un tableau court. La modale de confirmation, elle, reste sur container-narrow.
  "overlay": "640px",
};

// BREAKPOINT — points de bascule du SHELL (DS-MD breakpoint). Exposés en `screens` Tailwind :
// classes mobile:/tablet:/desktop: = min-width. Distinct de grid (largeurs) et measure (lecture).
export const breakpoint = {
  mobile:  "480px",  // bascule mobile/desktop de base
  tablet:  "1024px", // sous ce seuil : rail de nav en off-canvas
  desktop: "1280px", // sous ce seuil : rail d'outils replié (panneau invocable)
};

// BORDER — focus ring (DS-MD border, fondation 1.9.0) : implémenté en outline (pas de layout shift).
export const border = {
  "focus-width":  "2px", // largeur de l'anneau
  "focus-offset": "2px", // écart composant ↔ anneau (le ring s'ajoute, ne remplace pas la bordure d'état)
};

// ─────────────────────────────────────────────────────────────────────────────
// ÉTAGE 2 (suite) — RÔLES TRANSVERSAUX NON-COULEUR (chantier cohérence 2026-07-29).
// Un rôle n'entre ici que s'il a PLUSIEURS consommateurs ou une autorité claire.
// Les valeurs sont des références var(--…) : la cascade est MÉCANIQUE dans le CSS
// généré — changer un rôle maître se propage à tous ses consommateurs.
// Une valeur { light, dark } génère la variante sombre dans [data-theme="dark"].
// ─────────────────────────────────────────────────────────────────────────────
export const transversal = {
  // Un CONTRÔLE : l'objet qu'on presse (Button, CompactButton, déclencheur Select,
  // Switch, ThemeToggle, boutons expressifs).
  control: {
    // FOCUS v2 (arbitrage Aurélien 2026-07-29 après-midi, remplace l'essai accent du matin) :
    // UNE définition (largeur/écart/mécanique outline), mais la COULEUR est un anneau SUBTIL
    // (teinte éclaircie « à la Tailwind », 2px) ACCORDÉ à la bordure/état du composant.
    // Défaut = primary éclairci ; un composant surcharge --control-focus-color avec le cran
    // de sa famille (Input en erreur → focus-danger, Button destructive → focus-danger…).
    "focus-primary": "color-mix(in srgb, var(--primary), var(--static-white) 28%)",
    "focus-neutral": "color-mix(in srgb, var(--neutral), var(--static-white) 45%)",
    "focus-danger":  "color-mix(in srgb, var(--danger), var(--static-white) 20%)",
    "focus-success": "color-mix(in srgb, var(--success), var(--static-white) 20%)",
    "focus-warning": "color-mix(in srgb, var(--warning), var(--static-white) 20%)",
    "focus-info":    "color-mix(in srgb, var(--info), var(--static-white) 20%)",
    "focus-color":  "var(--control-focus-primary)",
    "focus-width":  "var(--focus-width)",
    "focus-offset": "var(--focus-offset)",
    radius: "var(--radius-md)",
    // Relief « posé » : repos → raised, survol → overlay, pressé → s'enfonce.
    "raised-shadow":  "var(--elevation-raised)",
    "hover-shadow":   "var(--elevation-overlay)",
    // Ombre pressée UNIQUE (référence : atelier Figma 128:136, portée par relief.css).
    // Avant le chantier, trois alphas coexistaient (0.05 / 0.15 / 0.2) pour le même geste.
    "pressed-shadow": {
      light: "inset 0 4px 4px rgba(12, 12, 13, 0.05)",
      dark:  "inset 0 4px 4px rgba(0, 0, 0, 0.45)",
    },
    // Ancres du relief : cibles des color-mix (assombrir vers le noir froid, éclaircir
    // vers le blanc). Étaient codées #030712 / #fff dans chaque .css expressif.
    "mix-dark":  "var(--neutral-950)",
    "mix-light": "var(--static-white)",
  },
  // Un CHAMP : la zone réceptive au relief creusé (Input, déclencheur Select en relief).
  field: {
    border: "var(--border)",
    "inset-shadow": {
      light: "inset 0 4px 4px -1px rgba(12, 12, 13, 0.05)",
      dark:  "inset 0 4px 4px -1px rgba(0, 0, 0, 0.4)",
    },
  },
  // Une SURFACE conteneur (Card, Alert — cran lg, décision Pilule 2026-07-29).
  surface: { radius: "var(--radius-lg)" },
  // Un SUPERPOSÉ (Modal, Drawer, menus Dropdown, listbox Select).
  overlay: {
    radius: "var(--radius-lg)",
    elevation: "var(--elevation-overlay)",
    // Largeur max d'un MENU ancré (listbox Select, menus Dropdown) — trois consommateurs
    // réels au moment de la création (arbitrage 2026-07-29 soir).
    "menu-max": "18rem",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// ÉTAGE 3 — ALIAS DE COMPOSANT : uniquement ce que le CONTRAT du composant exige.
// Chaque alias pointe vers un rôle transversal — jamais vers une primitive.
// Créés pour la tranche pilote Button/Input/Card ; étendre au fil de la propagation.
// ─────────────────────────────────────────────────────────────────────────────
export const componentTokens = {
  button: { radius: "var(--control-radius)" },
  input:  {
    radius: "var(--control-radius)",
    "focus-color": "var(--control-focus-color)",
    border: "var(--field-border)",
  },
  card:   { radius: "var(--surface-radius)" },
};

// Z-INDEX — ordre des couches superposées (DS-MD z-index, fondation overlay 1.30.0).
export const zIndex = {
  sticky:  "100",
  overlay: "1000", // scrim + surface d'un superposé modal (drawer, modale)
  popover: "1100", // superposé non-modal ancré (dropdown, menu, popover)
  toast:   "1200",
  tooltip: "1300",
};

// OVERLAY — voile d'un superposé modal (DS-MD overlay.scrim). rgba (alpha) → hors paires de contraste.
export const overlay = {
  scrim: "rgba(17, 24, 39, 0.5)",
};

export const meta = {
  name: "@fili/tokens",
  modes: ["light", "dark"],
  note: "DS-UI consomme DS-MD. Valeurs = DS-MD ; organisation 3 étages + modes.",
};
