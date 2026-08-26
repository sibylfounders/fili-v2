import * as React from "react";
import { AURORE_HTML } from "./aurore-boreale";

/* ═══════════════════════════════════════════════════════════════════════
   L'AURORE — l'illustration du kit, en code (25 août 2026).
   Aucune couleur n'est écrite dedans : elle lit --primary, --accent et
   --bg là où vivent les jetons (la racine, tout data-theme) et recalcule
   ses crans aux clartés de la gamme 50–950 du moteur. Elle suit donc la
   primaire du panneau Theming et le thème, sans une ligne de plus.

   Le dessin est GÉNÉRÉ (kit/aurore/gen-aurore.mjs → aurore-boreale.ts) :
   des couches svg empilées — trois familles de lamelles, le cœur, les
   montagnes — chacune filtrée une fois au chargement ; l'animation ne
   touche qu'à l'opacité et au glissement de couches entières, et se
   coupe sous prefers-reduced-motion. Décorative : aria-hidden.

   Deux cadrages :
   · « plein » — le dessin entier, montagnes comprises, au format 1024×1300 ;
   · « ciel » — l'aurore seule, entière, sans les montagnes, posée en haut
     et jamais recadrée (meet) : pour une tuile d'un autre format, où un
     recadrage en cover ne montrerait qu'une tranche zoomée (retour
     d'Auteur, 25 août : « on ne voit plus que c'est une aurore »).

   Posée une seule fois par page (ses identifiants internes sont fixes).
   ═══════════════════════════════════════════════════════════════════════ */

const CIEL = { viewBox: "40 40 944 1150", ratio: "xMidYMin meet" };

export function Aurore({ className, cadrage = "plein" }: { className?: string; cadrage?: "plein" | "ciel" }) {
  const html = cadrage === "ciel"
    ? AURORE_HTML
        .replace(/(<svg class="aurore aur-couche[^>]*?)viewBox="[^"]+" preserveAspectRatio="[^"]+"/g, `$1viewBox="${CIEL.viewBox}" preserveAspectRatio="${CIEL.ratio}"`)
        .replace('class="aurore-cadre"', 'class="aurore-cadre aurore-ciel"')
    : AURORE_HTML;
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
