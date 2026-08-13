/**
 * LA FAMILLE DU CHOIX — vocabulaire partagé.
 *
 * `Checkbox` et `Radio` partagent une géométrie (`lib/choice.css`) et deux axes. Ces axes
 * vivent ICI et non dans l'un des deux composants : faire importer `Radio` depuis `Checkbox`
 * inventerait une ascendance qui n'existe pas — ce sont deux frères, pas un dérivé.
 */

/** Cran de la marque et du libellé — apparié à l'échelle `icon` (CHOICE-UI). */
export type ChoiceSize = "sm" | "md";

/** Statut SUBI par la validation, jamais décoratif (CHOICE-UX R17). */
export type ChoiceStatus = "default" | "error";
