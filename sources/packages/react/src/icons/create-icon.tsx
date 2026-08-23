import * as React from "react";

/**
 * Icône — SVG 24×24, `currentColor`, tracé au trait (style Lucide : stroke 2,
 * bouts et jointures arrondis). Hérite la couleur du texte parent (donc le `tone`
 * d'un Button, le rôle `icon-*` d'un contexte, etc.).
 *
 * - `size` : pixel de rendu. Défaut 20 = token `icon.md` (apparié au corps 16px).
 *   Passer 16 (`icon.sm`) ou 24 (`icon.lg`) selon la densité — jamais une taille libre.
 * - `strokeWidth` : 2 par défaut (convention Lucide) ; l'épaisseur se met à l'échelle
 *   avec `size` puisque le viewBox reste 24.
 * - `aria-hidden` par défaut : l'icône est décorative. Pour une icône PORTEUSE de sens
 *   (bouton icône seule), c'est le conteneur qui porte le `aria-label` (cf. Button/CompactButton).
 */
export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, "ref"> {
  /** Taille de rendu en px. Défaut 20 (icon.md). Utiliser 16 (sm) / 24 (lg). */
  size?: number | string;
}

export function createIcon(name: string, paths: React.ReactNode) {
  const Comp = React.forwardRef<SVGSVGElement, IconProps>(
    ({ size = 20, strokeWidth = 2, ...props }, ref) => (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
        {...props}
      >
        {paths}
      </svg>
    ),
  );
  Comp.displayName = name;
  return Comp;
}
