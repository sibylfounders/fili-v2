import "./interaction.css";

/**
 * Mode d'interaction des surfaces-conteneurs — axe TRANSVERSAL du langage Interaction
 * (INTERACTION-R26…R28), promu depuis Card le 2026-07-29 (cf. DECISIONS.md) : toute surface
 * qui organise du contenu (carte, ligne de liste, tuile, carte de stat) déclare ce qu'elle
 * promet via ce mode. Le mode décrit un comportement, jamais un style.
 *
 * Garde-fou (R27) : le mode appartient aux surfaces-conteneurs, JAMAIS aux contrôles
 * (Button, Link, Input, Select…) — un contrôle EST son intention. Généraliser clickable
 * diluerait le signal du relief, qui n'est lisible que parce qu'il est rare.
 *
 * Usage : poser `data-mode` + la classe `ds-interactive` sur la racine positionnée de la
 * surface, `INTERACTION_MODE_CURSOR[mode]` pour le curseur, et `ds-interactive-target` sur
 * le lien étendu (surface clickable). Card = implémentation de référence.
 */
export type InteractionMode = "static" | "clickable" | "selectable" | "expandable";

/** Curseur par mode — seul clickable/selectable annoncent une manipulation au pointeur. */
export const INTERACTION_MODE_CURSOR: Record<InteractionMode, string> = {
  static: "",
  clickable: "cursor-pointer",
  selectable: "cursor-pointer",
  expandable: "",
};
