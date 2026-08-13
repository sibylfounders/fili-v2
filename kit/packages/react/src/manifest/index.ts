/**
 * Manifeste @fili/react — le catalogue machine-readable du kit.
 * Import côté site/atelier : `import { manifest } from "@fili/react/manifest";`
 * JSON pour les outils Node : `node packages/react/build/genere-manifeste.mjs`
 * → packages/react/manifest.json (commité, comme dist/).
 */
export * from "./schema";
import type { Entree } from "./schema";
import { button, compactButton, input, card } from "./pilote";
import { catalogue } from "./catalogue";

/** Toutes les entrées, triées par nom. Le pilote porte le niveau de détail cible. */
export const manifest: Entree[] = [button, compactButton, input, card, ...catalogue].sort((a, b) =>
  a.name.localeCompare(b.name, "fr"),
);

/** Accès par nom public. */
export const manifestByName: Record<string, Entree> = Object.fromEntries(
  manifest.map((e) => [e.name, e]),
);

export { button, compactButton, input, card, catalogue };
