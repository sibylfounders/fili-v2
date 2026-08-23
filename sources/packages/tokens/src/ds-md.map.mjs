// ─────────────────────────────────────────────────────────────────────────────
// CORRESPONDANCE DS-MD → DS-UI, et ARBITRAGES de divergence assumés.
//
// Édité à la main : c'est la couche de JUGEMENT du contrat. On y déclare
//   1. comment un token d'autorité DS-MD se retrouve dans DS-UI (colorMap),
//   2. quelles différences sont des arbitrages OUVERTS, tracés et non bloquants
//      (acknowledged) — par opposition aux dérives, elles, bloquantes.
//
// Règle : retirer une entrée d'`acknowledged` rend la divergence bloquante.
//         Le token DS-UI doit alors matcher DS-MD, ou l'arbitrage doit être
//         acté (et la valeur DS-UI corrigée).
// ─────────────────────────────────────────────────────────────────────────────

// token DS-MD → référence DS-UI, résolue en MODE CLAIR :
//   { role: "primary" }      → rôle sémantique à plat (résolu via tokens.source.mjs)
//   { prim: "indigo.200"   } → primitive directe (pas de rôle sémantique dédié)
export const colorMap = {
  primary:                { role: "primary" },         // indigo.600
  "primary-hover":        { role: "primary-hover" },   // indigo.700
  "on-primary":           { role: "on-primary" },      // neutral.0
  // lavis primaire — renommé en 1.33.0 (ex-secondary) : la convention {nom}-subtle s'applique enfin
  "primary-subtle":        { role: "primary-subtle" },        // indigo.100
  "primary-subtle-hover":  { role: "primary-subtle-hover" },  // indigo.200
  "on-primary-subtle":     { role: "on-primary-subtle" },     // indigo.800
  // secondary = 2e couleur de marque (teal, 1.33.0)
  secondary:                { role: "secondary" },              // teal.700
  "secondary-hover":        { role: "secondary-hover" },        // teal.800
  "secondary-subtle":       { role: "secondary-subtle" },       // teal.100
  "secondary-subtle-hover": { role: "secondary-subtle-hover" }, // teal.200
  "on-secondary":           { role: "on-secondary" },           // neutral.0
  danger:                 { role: "danger" },          // red.700
  "danger-hover":         { role: "danger-hover" },    // red.800
  "danger-subtle":        { role: "danger-subtle" },   // red.100
  success:                { role: "success" },         // green.700
  "success-subtle":       { role: "success-subtle" },  // green.100
  info:                   { role: "info" },            // sky.700 (1.33.0)
  "info-subtle":          { role: "info-subtle" },     // sky.100 (1.33.0)
  warning:                { role: "warning" },         // amber.800
  "warning-hover":        { role: "warning-hover" },   // amber.900
  "warning-subtle":       { role: "warning-subtle" },  // amber.100
  "warning-subtle-hover": { prim: "amber.200" },
  "danger-subtle-hover":  { role: "danger-subtle-hover" }, // red.150 — cran calibré par la doctrine
  // neutral-strong / -hover : DS-MD 1.21.0+ nomme un remplissage neutre plein que DS-UI
  // porte encore comme primitive, sans rôle sémantique dédié. Les valeurs coïncident.
  // la famille NEUTRAL a désormais son rôle sémantique (1.33.0) — fini la primitive directe
  "neutral-strong":       { role: "neutral" },         // neutral.900 — #111827
  "neutral-strong-hover": { role: "neutral-hover" },   // neutral.800 — #1F2937
  background:             { role: "background" },      // neutral.0
  surface:                { role: "surface" },         // neutral.100
  "surface-hover":        { role: "surface-hover" },   // neutral.200
  "text-primary":         { role: "text-primary" },    // neutral.900
  "text-secondary":       { role: "text-secondary" },  // neutral.600
  "text-muted":           { role: "text-muted" },      // neutral.400
  border:                 { role: "border" },          // neutral.200
  "border-strong":        { role: "border-strong" },   // neutral.500
};

// fondations non-couleur : token DS-MD → clé de la fondation DS-UI (même nom)
export const foundationMap = {
  spacing:   ["base", "xs", "sm", "md", "lg", "xl", "section"],
  radius:    ["sm", "md", "lg", "pill"],
  elevation: ["none", "raised", "overlay"],
};

// DIVERGENCES ASSUMÉES — connues, tracées, NON bloquantes tant qu'ouvertes.
// Clé = "groupe.token". Valeur = la décision à prendre.
export const acknowledged = {
  "colors.surface-contrast":
    "Rôle DS-MD #1C1C1E encore absent de DS-UI — arbitrage C2 ouvert dans mapping-autorite.md.",
  // Système d'ombres FROID assumé : DS-UI rebase toutes ses ombres (raised, overlay,
  // scene, alpha) sur le neutre froid rgba(3,7,18) au lieu du rgba(17,24,39) de DS-MD.
  // Choix uniforme et délibéré, pas une dérive — retirer une ligne la rend bloquante.
  "elevation.raised":
    "Ombre froide rgba(3,7,18) vs DS-MD rgba(17,24,39) — extension système DS-UI assumée.",
  "elevation.overlay":
    "Ombre froide rgba(3,7,18) vs DS-MD rgba(17,24,39) — extension système DS-UI assumée.",
};
