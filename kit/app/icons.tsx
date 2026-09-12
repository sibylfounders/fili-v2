/* ── LES SIGNES DE LA BANDE (11 septembre 2026) — dessinés d'après Lucide
   (ISC), recopiés ici plutôt qu'installés : le kit dessine déjà ses signes à
   la main (le burger et la croix du rail), et un paquet d'icônes pour cinq
   tracés serait une dette pour rien. Même grille que Lucide (24, trait 2,
   bouts ronds) ; la taille vient du texte qui les porte (workbench.css). ── */

const I = (d: React.ReactNode) => (
  <svg className="wb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
);

export const SUN = I(<><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></>);
export const MOON = I(<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />);
export const ELLIPSIS = I(<><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>);
export const DEVICE: Record<string, React.ReactNode> = {
  mobile: I(<><rect width="14" height="20" x="5" y="2" rx="2" /><path d="M12 18h.01" /></>),
  tablet: I(<><rect width="16" height="20" x="4" y="2" rx="2" /><path d="M12 18h.01" /></>),
  desktop: I(<><rect width="20" height="14" x="2" y="3" rx="2" /><path d="M12 17v4" /><path d="M8 21h8" /></>),
};
