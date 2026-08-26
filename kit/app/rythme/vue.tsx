"use client";
import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Apercu, PanneauCode } from "../apercu";
import { useAdaptation } from "../adaptation";
import { useDensite } from "../densite";
import { RailDoc, useDocSections, type Sommaire } from "../rail";
import { chaine, jetons, INTENTIONS, DENSITES, AXES, LARGEUR_MIN, LARGEUR_MAX, LARGEUR_GEL } from "../../derivation.mjs";

/* ═══════════════════════════════════════════════════════════════════════
   PAGE RYTHME — recomposée au gabarit « documentaire nu » (24 août 2026),
   migrée sur la chaîne du registre (25 août 2026 : les huit décisions).
   Pièce de référence : kit-rythme-nu.html (verdict d'Auteur PARFAIT).
   · Le blanc structure tout (CG1) — les démos vivent dans des scènes,
     seules grandes surfaces de leur écran.
   · Rail nu (CG2) : navigation + sommaire, portés par l'alignement.
   · Un geste de couleur par écran (CG3) : le point du titre, puis la
     scène de la tranche Coursue. Les commandes actives sont encre.
   · La tranche Coursue emboîte ses fonds en cascade (CG4) : coque →
     carte → ligne, chaque profondeur avec sa marge et son coin.
   · Titre-affiche déclaré (CG5) : alias --doc-* de tokens.css.
   Plan de preuves validé : 01 la tranche Coursue en situation · 04 la
   densité en variation · 07 le vocabulaire. Objets vivants : Léa Fontan,
   Coursue. Tout chiffre affiché est CALCULÉ par le moteur (derivation.mjs),
   jamais recopié. Les styles propres à la page vivent dans rythme.css.
   ═══════════════════════════════════════════════════════════════════════ */

/* Le registre, calculé — la même chaîne que tokens.css. */
type Jeton = { axe: string | null; base: number; bas?: number; haut?: number; gel?: number; css: string };
type Socle = ReturnType<typeof chaine>;
const SOCLE: Socle = chaine();
/* Le moteur écrit ses jetons nom par nom : on le lit comme un registre. */
const J = jetons(SOCLE) as unknown as Record<string, Jeton>;
/* Les nombres s'écrivent à la française dans les légendes, un chiffre après la virgule. */
const px = (v: number) => String(Math.round(v * 10) / 10).replace(".", ",");
/* L'accrochage Tailwind : la grille de 4, comme tokens.tailwind.mjs. */
const grille4 = (v: number) => Math.round(v / 4) * 4;

/* Un espace rendu visible : c'est un VRAI espace de la tranche (il porte le
   jeton), pas une illustration — l'interrupteur ne fait que le colorer.
   L'étiquette ne se pose QUE là où on la passe : une par jeton, dans
   l'espace qu'elle nomme — pas une par bloc (lisibilité, 24 août). */
function E({ j, h, voir, nom, genre }: { j: string; h?: boolean; voir: boolean; nom?: string; genre: "pad" | "gap" }) {
  /* Le code couleur des espaces (décision d'Auteur, 24 août) :
     danger = les marges (padding), success = les espaces (gap/margin).
     La convention des inspecteurs, portée par nos jetons sémantiques. */
  return <span className={`espace ${h ? "h" : ""} ${voir ? "vu" : ""} ${genre}`}
    data-nom={voir && nom ? nom : undefined}
    style={h ? { width: `var(${j})` } : { height: `var(${j})` }} />;
}

/* Le monogramme de la charte — la tranche porte NOTRE marque : la
   maquette montre le système du kit, pas celui d'un autre (24 août). */
const D_FILI = "M356.879 197C377.293 197 391.501 204.877 394.412 217.448C395.121 220.046 395.493 223.172 395.493 226.924C395.493 239.317 385.756 248.688 372.672 248.688C364.199 248.688 357.063 244.568 353.216 238.18C353.14 238.054 353.066 237.927 352.993 237.799C351.177 234.635 350.156 230.938 350.156 226.924C350.156 216.714 356.765 208.556 366.239 205.999C363.899 203.331 360.302 201.836 355.368 201.836C339.045 201.836 329.977 216.043 321.514 257.453L317.584 277.101H338.67L391.566 277.101V391.962C391.566 411.912 393.682 417.655 407.889 424.305V424.909H340.181V424.305C354.387 417.655 356.503 411.912 356.503 391.962V310.35C356.503 298.163 355.002 290.617 349.615 284.96H316.073L281.917 424.909C270.128 472.97 248.668 493.222 213 494.733V494.128C232.345 485.363 242.018 452.113 253.202 404.355L280.406 284.96H260.456L261.06 282.542L282.521 275.892L286.451 261.987C299.146 218.461 321.514 197 356.879 197ZM430.349 381C417.664 381 408 390.472 408 403C408 415.528 417.664 425 430.349 425C443.336 425 453 415.528 453 403C453 390.472 443.336 381 430.349 381Z";

/* ── La tranche d'application — la scène de la démo Léa Fontan (CG4) ──
   L'emboîtement en cascade relevé sur Coursue : la tranche est la coque
   (marge 1, coin 1) → la carte (marge 2, coin 2) → les lignes (marge 3,
   coin 3), profondeur par les fonds, ni ombre ni bordure. Dans la carte,
   chaque distance est un bloc d'espace explicite : au survol, chacun se
   nomme — sa nature et sa profondeur. */
function TrancheCoursue({ voir }: { voir: boolean }) {
  const margeBloc = "--pad-2-block";
  const margeLigne = "--pad-2-inline";
  const entreLignes = "--gap-2-block";
  const dansLaLigne = "--gap-3-inline";
  const Ligne = ({ children }: { children: ReactNode }) => (
    <span className="ry-etire">
      <E j={margeLigne} h voir={voir} genre="pad" /><span className="ry-plein">{children}</span><E j={margeLigne} h voir={voir} genre="pad" />
    </span>
  );
  return (
    <div className="tranche" role="img" aria-label="Tranche d'application : profil de Léa Fontan, chaque distance posée sur la chaîne du kit">
      <div className="tr-nav">
        <div className="tr-marque">
          <svg className="m" viewBox="211 195 244 301.7" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d={D_FILI} />
          </svg>Fili
        </div>
        <div className="tr-item">Cours</div>
        <div className="tr-item">Messages</div>
        <div className="tr-item on">Profil</div>
      </div>
      <div className="tr-carte">
        <E j={margeBloc} voir={voir} nom="marge · carte" genre="pad" />
        <Ligne>
          <span className="tr-id">
            <span className="tr-avatar" aria-hidden="true">LF</span>
            <span className="ry-min0">
              <span className="tr-nom">Léa Fontan</span>
              <span className="tr-role">UX Designer — chaque distance de cette carte est un jeton de la chaîne.</span>
            </span>
          </span>
        </Ligne>
        <E j={entreLignes} voir={voir} nom="espace · entre deux lignes" genre="gap" />
        <Ligne>
          <span className="ry-flex">
            <button className="tr-btn premier" type="button" tabIndex={-1}>Suivre</button>
            <E j={dansLaLigne} h voir={voir} nom="espace · dans la ligne" genre="gap" />
            <button className="tr-btn" type="button" tabIndex={-1}>Message</button>
          </span>
        </Ligne>
        <E j={entreLignes} voir={voir} genre="gap" />
        <Ligne>
          <span className="ry-flex ry-large">
            <span className="tr-sub"><b>24</b><span>cours suivis</span></span>
            <E j={dansLaLigne} h voir={voir} genre="gap" />
            <span className="tr-sub"><b>1&nbsp;280</b><span>abonnés</span></span>
            <E j={dansLaLigne} h voir={voir} genre="gap" />
            <span className="tr-sub"><b>96&nbsp;%</b><span>assiduité</span></span>
          </span>
        </Ligne>
        <E j={margeBloc} voir={voir} genre="pad" />
      </div>
    </div>
  );
}

/* Les distances de la carte sont des blocs d'espace explicites : quand une
   casse est active, l'écart menteur se matérialise en rouge, étiquette
   dedans (décision d'Auteur, 24 août — on voit l'erreur, on ne la devine
   plus). Au repos, les espaces sont invisibles : ils espacent, c'est tout. */
function Esp({ j, faute, nom }: { j: string; faute?: boolean; nom?: string }) {
  return <span className={`espace ${faute ? "ko" : ""}`} data-nom={faute ? nom : undefined}
    data-intent={faute ? "statement" : undefined} style={{ height: `var(${j})` }} />;
}
/* Le juste : au-dessus d'un titre, l'espace entre deux cartes ; sous le
   titre, l'espace d'un titre à sa phrase ; d'un libellé à son champ, le
   même. La casse du titre : le même espace des deux côtés. La casse du
   libellé : aussi loin de son champ que de ce qui précède. */
function Proximite({ casseY1, casseY2 }: { casseY1: boolean; casseY2: boolean }) {
  return (
    <div className="ry-prox">
      <div className="ry-prox-carte">
        <p className="sourd">Un paragraphe qui précède la section.</p>
        <Esp j={casseY2 ? "--gap-2-block" : "--gap-1-block"} faute={casseY2} nom="le même écart au-dessus…" />
        <h3 className="ry-h3">Vos coordonnées</h3>
        <Esp j={casseY2 ? "--gap-2-block" : "--gap-3-block"} faute={casseY2} nom="…qu'au-dessous : le titre flotte" />
        <Esp j="--gap-1-block" faute={casseY1} nom="aussi loin de ce qui précède…" />
        <label className="mono ry-bloc">Adresse e-mail</label>
        <Esp j={casseY1 ? "--gap-1-block" : "--gap-3-block"} faute={casseY1} nom="…que de son champ : le libellé flotte" />
        <input readOnly value="prenom@exemple.fr" className="ry-champ" />
      </div>
      {(casseY1 || casseY2) && (
        <div className="oeil">
          {casseY1 && <span>👁 Le libellé flotte à mi-chemin : l&apos;œil ne sait plus à quel champ il appartient. </span>}
          {casseY2 && <span>👁 Le titre est aussi proche du paragraphe qu&apos;il ferme que de la section qu&apos;il ouvre : il n&apos;introduit plus rien.</span>}
        </div>
      )}
    </div>
  );
}

/* Les extraits « à copier » enseignent le registre : la carte (marge 2,
   coin 2) et l'espace entre ses lignes (espace 2). Tailwind : les noms
   d'espacement sont ceux des variables (tokens.tailwind.mjs). */
const SNIPPETS: Record<string, Record<string, string>> = {
  React: {
    Tailwind: `// tailwind.config : theme.extend.spacing <- rhythm.spacing (les variables, fluide)
// ou rhythmLiteral (grille de 4, arrondie) — jamais les deux à la fois
export function Fiche({ enfants }) {
  return (
    <section className="py-pad-2-block px-pad-2-inline rounded-2">
      <div className="grid gap-gap-2-block">{enfants}</div>
    </section>
  );
}`,
    shadcn: `// shadcn/ui vit sur Tailwind — donc sur nos jetons, via theme.extend
import { Card, CardContent } from "@/components/ui/card";

export function Fiche({ enfants }) {
  return (
    <Card className="rounded-2">
      <CardContent className="py-pad-2-block px-pad-2-inline grid gap-gap-2-block">
        {enfants}
      </CardContent>
    </Card>
  );
}`,
    "HTML natif": `/* Le normatif : la règle et le jeton. Ce code n'est qu'un exemple. */
export function Fiche({ enfants }) {
  return (
    <section className="fiche">   {/* une carte : marge 2, coin 2 */}
      <div className="pile">{enfants}</div>
    </section>
  );
}

/* styles.css — tout sort des jetons, rien en dur */
.fiche { padding: var(--pad-2-block) var(--pad-2-inline);
         border-radius: var(--r-2); }
.pile  { display: grid; gap: var(--gap-2-block); }  /* entre deux lignes : l'espace de la carte */`,
  },
  Angular: {
    Tailwind: `@Component({
  selector: "kit-fiche",
  template: \`
    <section class="py-pad-2-block px-pad-2-inline rounded-2">
      <div class="grid gap-gap-2-block"><ng-content /></div>
    </section>\`,
})
export class Fiche {}`,
    shadcn: `// shadcn est né côté React ; côté Angular son esprit vit dans spartan/ui —
// mêmes classes Tailwind, donc mêmes jetons
@Component({
  selector: "kit-fiche",
  template: \`
    <hlm-card class="rounded-2">
      <div hlmCardContent class="py-pad-2-block px-pad-2-inline grid gap-gap-2-block">
        <ng-content />
      </div>
    </hlm-card>\`,
})
export class Fiche {}`,
    "HTML natif": `@Component({
  selector: "kit-fiche",
  template: \`
    <section class="fiche">
      <div class="pile"><ng-content /></div>
    </section>\`,
  styleUrl: "./fiche.css", // mêmes classes : var(--pad-2-block), var(--gap-2-block)…
})
export class Fiche {}`,
  },
  HTML: {
    Tailwind: `<section class="py-pad-2-block px-pad-2-inline rounded-2">
  <div class="grid gap-gap-2-block">
    <p>Les classes résolvent les jetons — le système reste le même.</p>
  </div>
</section>`,
    shadcn: `<!-- shadcn est une bibliothèque React : en HTML pur il n'en reste que
     l'essentiel — ses classes Tailwind, qui résolvent nos jetons -->
<section class="py-pad-2-block px-pad-2-inline rounded-2 border bg-card">
  <div class="grid gap-gap-2-block">…</div>
</section>`,
    "HTML natif": `<link rel="stylesheet" href="kit/tokens.css" />

<section class="fiche">
  <p>Chaque distance vient d'un jeton — une marge, un espace, un coin, à sa profondeur.</p>
</section>

<style>
  .fiche { padding: var(--pad-2-block) var(--pad-2-inline); border-radius: var(--r-2); }
  .fiche p { margin-block: var(--gap-2-block); }
</style>`,
  },
};

type Src = { t: string; h: string };
const DECISIONS: Src = { t: "Décisions du 25 août 2026, séance sur pièce", h: "#" };
const REGLES: { id: string; nom: string; titre: string; enonce: string; pourquoi: string; src: Src[]; div?: string }[] = [
  { id: "y1", nom: "1", titre: "L'espace entre deux frères vaut leur marge",
    enonce: "L'espace qui sépare deux surfaces sœurs est exactement leur marge intérieure — ni plus, ni moins. Le dedans et le dehors d'une surface ne se règlent pas séparément : c'est le même chiffre.",
    pourquoi: "Un contenu plus proche du bord du voisin que de son propre bord a l'air d'appartenir au voisin. L'espace dit qui est lié à qui — il ne doit pas mentir.",
    src: [DECISIONS, { t: "Atlassian — Spacing", h: "https://atlassian.design/foundations/spacing" }, { t: "NN/g — Principe de proximité", h: "https://www.nngroup.com/articles/gestalt-proximity/" }] },
  { id: "y2", nom: "2", titre: "Le titre appartient à ce qu'il ouvre",
    enonce: "L'espace au-dessus d'un titre dépasse l'espace au-dessous d'au moins un cran.",
    pourquoi: "Un titre équidistant flotte ; un titre plus proche du bloc précédent ment. Convention éditoriale constante, transposée en crans de la chaîne.",
    src: [{ t: "Butterick — Space above & below", h: "https://practicaltypography.com/space-above-and-below.html" }, { t: "Rutter — Vertical rhythm", h: "https://webtypography.net/2.2.2" }] },
  { id: "y3", nom: "3", titre: "Toute distance descend d'une seule base",
    enonce: "Toute distance posée par le système descend de la marge de la coque, divisée par racine de deux à chaque profondeur — coque, carte, ligne. La densité choisit cette base parmi trois ; rien d'autre n'en choisit une.",
    pourquoi: "La régularité vient du petit nombre de valeurs et du rapport constant entre elles, pas de leur précision — l'œil reconnaît une chaîne, pas une grille.",
    src: [DECISIONS, { t: "Carbon — Spacing", h: "https://carbondesignsystem.com/elements/spacing/overview/" }] },
  { id: "y4", nom: "4", titre: "L'interligne suit la lisibilité, pas la grille",
    enonce: "Aucun interligne n'est recalé sur la chaîne sans une décision explicite et datée.",
    pourquoi: "La grille stricte des livres suppose des corps fixes ; forcer l'interligne dessus dégrade la lecture. La lisibilité prime — l'exception se décide, elle ne se subit pas.",
    src: [{ t: "WCAG 1.4.8 — Visual Presentation", h: "https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html" }] },
  { id: "y5", nom: "5", titre: "La densité change la base",
    enonce: "Compact, confortable, aéré : trois bases, une seule chaîne. La densité remplace la base et toute la chaîne des marges et des espaces se recalcule ; les coins et les composants ne bougent pas. Jamais un multiplicateur, jamais une valeur propre, jamais un décalage.",
    pourquoi: "Un « ×0,8 » fabrique des valeurs hors chaîne, invisibles au changement de marque. Une autre base reste dans le système : chaque distance garde sa provenance.",
    src: [DECISIONS] },
  { id: "y6", nom: "6", titre: "La densité ne change jamais la structure",
    enonce: "L'ordre des emplacements et la présence des éléments restent identiques d'une densité à l'autre.",
    pourquoi: "Un mode compact qui masque ou réordonne, c'est deux produits dans un — et un apprentissage cassé.",
    src: [{ t: "Règle interne du système", h: "#" }] },
  { id: "y7", nom: "7", titre: "Deux régimes, un seul seuil — et le rythme glisse",
    enonce: "Un régime est une mise en page : il y en a deux, séparées par un seuil unique. Le rythme, lui, ne connaît pas de palier : il glisse du plus petit écran au plus grand, sur quatre axes — l'horizontal, le vertical, le texte, la cible.",
    pourquoi: "On n'ajoute pas des paliers par imitation : un troisième régime naîtra d'un besoin réel, documenté et daté. Et une valeur gelée pour une maquette n'est juste qu'à sa largeur.",
    div: "La plupart des grands systèmes ont 5 ou 6 paliers (Atlassian, Carbon, Material). Nous assumons l'inverse, par écrit.",
    src: [DECISIONS, { t: "Atlassian — Grid", h: "https://atlassian.design/foundations/grid-beta" }, { t: "Carbon — 2x Grid", h: "https://carbondesignsystem.com/elements/2x-grid/overview/" }] },
  { id: "y8", nom: "8", titre: "Les crans sont responsives — c'est le jeton qui varie, jamais l'écran",
    enonce: "Chaque jeton glisse entre deux bornes, sur son axe — mais la variation vit dans la définition du jeton, une fois. Aucun écran ne redéfinit un cran.",
    pourquoi: "Sur petit écran, les espaces doivent pouvoir se resserrer sans casser la logique. Et si chaque écran bricolait ses valeurs, le système n'existerait plus.",
    src: [{ t: "GOV.UK — Spacing", h: "https://design-system.service.gov.uk/styles/spacing/" }] },
  { id: "y9", nom: "9", titre: "La géométrie d'espacement vit en rem",
    enonce: "Les jetons d'espacement s'expriment en rem. Restent en pixels, par décision explicite : le plancher de la cible du doigt, les traits d'un pixel, la largeur d'écran minimale.",
    pourquoi: "Quand l'utilisateur agrandit le texte, les espaces qui l'entourent doivent suivre — sinon la page casse au premier réglage d'accessibilité.",
    src: [{ t: "WCAG 1.4.4 — Resize Text", h: "https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html" }] },
  { id: "y10", nom: "10", titre: "La profondeur choisit — pas toi",
    enonce: "La marge et le coin d'une surface descendent ensemble à chaque profondeur — les coins divisés par deux, les marges par racine de deux — et la marge ne descend jamais sous le coin. Coque, carte, ligne forment une chaîne, pas trois choix. Un composant prend le coin de la ligne.",
    pourquoi: "Trois niveaux réglés à la main dérivent ; une chaîne tient toute seule.",
    src: [DECISIONS] },
  { id: "y11", nom: "11", titre: "Les titres sortent du même pas",
    enonce: "Le corps reste stable et ne descend jamais sous son plancher ; chaque cran de titre vaut le précédent multiplié par le même intervalle — l'échelle des titres dérive des mêmes décisions que les espaces, elle n'est pas une échelle à part.",
    pourquoi: "Deux échelles indépendantes finissent par se contredire ; une dérivation ne le peut pas.",
    src: [DECISIONS] },
  { id: "y12", nom: "12", titre: "Des rapports, jamais des soustractions",
    enonce: "Les crans naissent d'un diviseur appliqué en chaîne, jamais d'une différence fixe.",
    pourquoi: "L'œil lit les rapports, pas les écarts : trois crans obtenus en retranchant sont presque jumeaux ; trois crans obtenus en divisant sont lisibles.",
    src: [{ t: "Le générateur du système (leçon 5)", h: "#" }] },
  { id: "y13", nom: "13", titre: "Un seul registre, site compris",
    enonce: "Les crans de page — la tête d'une section, la gouttière, le silence entre deux sections — sont la même chaîne continuée au-dessus de la coque. Le gabarit du site ne possède aucune valeur à lui : chaque distance qu'il consomme est un jeton dérivé.",
    pourquoi: "Un site qui vivrait sur une autre échelle que ses composants aurait deux rythmes ; on n'en veut qu'un.",
    src: [DECISIONS] },
  { id: "y14", nom: "14", titre: "Deux questions choisissent le cran",
    enonce: "Est-ce un espace, une marge ou un coin ? À quelle profondeur — coque, carte, ligne, ou au plus serré ? La réponse désigne le jeton — le cran se déduit, il ne se choisit pas à l'œil.",
    pourquoi: "Méthode : chaque valeur posée doit pouvoir citer ses deux réponses.",
    src: [DECISIONS] },
  { id: "y15", nom: "15", titre: "Les six invariants d'audit",
    enonce: "Aucun enfant plus rond que son parent · aucune marge sous son coin · deux axes verticaux d'alignement par carte, jamais trois · sœurs alignées au pixel · zéro débord à la largeur minimale · l'espace entre deux frères vaut leur marge.",
    pourquoi: "Six phrases vérifiables sur toute vue — les futures assertions du Gardien quand il mordra sur ce kit.",
    src: [DECISIONS] },
  { id: "y16", nom: "16", titre: "Les coins ne suivent pas l'écran",
    enonce: "Un coin est réglé par la racine du produit, pas par la largeur de l'écran : il ne glisse pas. Glissent les marges, les espaces, le texte et la cible — chacun sur son axe.",
    pourquoi: "Un coin qui change avec l'écran change la marque ; une marge qui change avec l'écran ajuste la respiration. Ce ne sont pas les mêmes décisions.",
    src: [DECISIONS] },
  { id: "y17", nom: "17", titre: "La cible au doigt a un plancher",
    enonce: "Un bouton, un champ, un sélecteur ont une hauteur de cible dérivée du registre ; les commandes secondaires — têtes d'outils, tiroir — prennent la cible réduite. Rien ne descend sous le plancher absolu.",
    pourquoi: "Une commande trop petite se rate ; une commande trop grande dans une tête d'outil vole la place du contenu.",
    src: [DECISIONS, { t: "WCAG 2.5.8 — Target Size (Minimum)", h: "https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html" }] },
];

/* La correspondance des deux échelles — calculée en direct depuis le
   moteur, jamais recopiée : décimales pour le CSS natif, grille de 4
   pour Tailwind. */
function Correspondance() {
  const noms = Object.keys(J).filter((n) => /^(pad|gap|edge|page)-/.test(n));
  return (
    <div className="ry-defile">
      <table className="tableau mono">
        <thead><tr><th>jeton</th><th>à la charte (px)</th><th>calculé (px, {LARGEUR_MIN} → {LARGEUR_MAX})</th><th>Tailwind (grille de 4)</th><th>CSS</th></tr></thead>
        <tbody>
          {noms.map((n) => {
            const t = J[n];
            return (
              <tr key={n}>
                <td>--{n}</td>
                <td>{px(t.base)}</td>
                <td>{px(t.bas ?? t.base)} → {px(t.haut ?? t.base)}</td>
                <td>{grille4(t.bas ?? t.base)} → {grille4(t.haut ?? t.base)}</td>
                <td>{t.css}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* Les règles vivent dans les dépliants « Règles & sources » de leur démonstration. */
function Regles({ ids }: { ids: string[] }) {
  return (
    <div className="ry-regles">
      {ids.map((id) => REGLES.find((r) => r.id === id)!).map((r) => (
        <div key={r.id} className="ry-regle">
          <b><span className="badge">règle {r.nom}</span> {r.titre}</b>
          <span>{r.enonce}</span>
          {r.div && <div className="divergence ry-petit">{r.div}</div>}
          <span className="ry-petit">Sources : {r.src.map((sc, i) => (
            <span key={sc.t}>{i > 0 && " · "}{sc.h === "#" ? sc.t : <a href={sc.h}>{sc.t}</a>}</span>
          ))}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Le laboratoire des décisions maîtresses — trois entrées, toute la
   géométrie sort, par le MÊME moteur que tokens.css. Il ne règle RIEN :
   la chaîne du kit reste celle du registre ; on regarde la mécanique, on
   ne la remplace pas. Les préréglages sont les intentions du moteur. ── */
function Laboratoire({ intention }: { intention: number }) {
  const { base, intervalle, racine } = INTENTIONS[intention];
  const s = chaine({ base, intervalle, racine });
  /* La géométrie de la carte, posée en variables (px, calculées) : la coque
     porte la base et la racine, la carte et les lignes en descendent. */
  const vars = {
    "--lab-p1": `${s.pad[0]}px`, "--lab-p2": `${s.pad[1]}px`, "--lab-p3": `${s.pad[2]}px`,
    "--lab-g1": `${s.gap[0]}px`, "--lab-g2": `${s.gap[1]}px`, "--lab-g3": `${s.gap[2]}px`, "--lab-g4": `${s.gap[3]}px`,
    "--lab-r1": `${s.r[0]}px`, "--lab-r2": `${s.r[1]}px`, "--lab-r3": `${s.r[2]}px`, "--lab-rctl": `${s.rCtl}px`,
  } as CSSProperties;
  const relevee = s.garanties.margeRelevee.some(Boolean);
  /* La carte Léa Fontan, née des trois décisions, sur le banc d'essai
     (demande d'Auteur, 24 août) : la même carte que la tranche, la
     géométrie en variable. */
  const carte = (
    <div className="ry-lab" style={vars}>
      <div className="ry-lab-carte">
        <span className="ry-lab-ligne ry-lab-id">
          <span className="tr-avatar" aria-hidden="true">LF</span>
          <span className="ry-min0">
            <span className="tr-nom">Léa Fontan</span>
            <span className="tr-role">UX Designer — chaque distance de cette carte sort des trois décisions.</span>
          </span>
        </span>
        <span className="ry-lab-ligne">
          <button className="tr-btn premier ry-lab-btn" type="button" tabIndex={-1}>Suivre</button>
          <button className="tr-btn ry-lab-btn" type="button" tabIndex={-1}>Message</button>
        </span>
        <span className="ry-lab-ligne">
          {([["24", "cours suivis"], ["1 280", "abonnés"], ["96 %", "assiduité"]] as const).map(([v, l]) => (
            <span key={l} className="tr-sub ry-lab-cellule"><b>{v}</b><span>{l}</span></span>
          ))}
        </span>
      </div>
    </div>
  );
  /* Les barres du verdict : leur largeur est proportionnelle à la valeur qu'elles portent. */
  const LARGEUR_BARRE = 6; // hors chaîne : 6 px de barre par px de marge, pour que les crans se comparent à l'œil
  return (
    <div className="ry-labo">
      <Apercu plafond={LARGEUR_GEL} enfants={() => carte} pied={
        <span className="gd-legende">
          coque : marge {px(s.pad[0])} · coin {px(s.r[0])} — carte : marge {px(s.pad[1])} · coin {px(s.r[1])} —
          ligne : marge {px(s.pad[2])} · coin {px(s.r[2])} — espace {px(s.gap[0])} entre cartes · {px(s.gap[1])} entre lignes ·
          {" "}{px(s.gap[2])} dans la ligne · {px(s.gap[3])} au plus serré — bouton {px(s.rCtl)}
          {relevee && " — une marge relevée au coin : elle ne descend jamais dessous"}
        </span>
      } />
      <div className="ry-verdicts">
        {/* Le verdict d'abord, et sa couleur (décision d'Auteur, 24 août) :
            rouge = la faute, vert = le juste — les barres portent le même code. */}
        <span className="badge ko ry-debut">Faux · soustraire fait des jumeaux</span>
        <div className="rang">
          {[base, base - 4, base - 8].map((v, i) => <span key={i} className="ry-barre ko" style={{ width: `${v * LARGEUR_BARRE}px` }}>{px(v)}</span>)}
        </div>
        <span className="badge bon ry-debut">Juste · diviser fait des crans</span>
        <div className="rang">
          {s.pad.map((v, i) => <span key={i} className="ry-barre bon" style={{ width: `${v * LARGEUR_BARRE}px` }}>{px(v)}</span>)}
        </div>
      </div>
    </div>
  );
}

/* ── La profondeur — la chaîne coque > carte > ligne, avec sa casse.
   La ligne porte deux lignes de texte : assez haute pour que ses coins se
   lisent. Le coin cassé vaut exactement DEUX FOIS celui de sa carte mère :
   l'œil compare les deux arcs voisins (valeur cassée volontaire, rythme.css). ── */
function Profondeur({ casse }: { casse: boolean }) {
  return (
    <div className="ry-prof-coque">
      <span className="mono sourd ry-petit">coque — marge 1 · coin 1</span>
      <div className="ry-prof-carte">
        <span className="mono sourd ry-petit">carte — marge ÷ √2 · coin ÷ 2</span>
        <div className="ry-prof-ligne" data-intent={casse ? "statement" : undefined}>
          <b className="ry-petit">ligne</b>
          <span className={`mono ry-petit ${casse ? "ry-faute" : "sourd"}`}>
            {casse ? "coin ×2 — PLUS RONDE que la carte qui la contient" : "encore une profondeur — le coin suit la chaîne, sans glisser avec l'écran"}
          </span>
        </div>
        {/* Discret et à distance : la vedette de la démo, c'est la chaîne
            des surfaces — pas le composant (retour d'Auteur, 24 août). */}
        <button className="bouton ry-debut ry-prof-btn">le bouton prend le coin de la ligne</button>
      </div>
      {casse && <div className="oeil">👁 Comparez les coins voisins : l&apos;enfant est plus rond que son parent. La chaîne est rompue, la profondeur ne se lit plus — c&apos;est le premier invariant d&apos;audit.</div>}
    </div>
  );
}

/* ── Le bon cran — deux questions, une réponse : la nature, la profondeur.
   La valeur affichée est lue dans le registre calculé. ── */
type Nature = "espace" | "marge" | "coin";
type Prof = "coque" | "carte" | "ligne" | "serre";
const NATURES: [Nature, string][] = [["espace", "Un espace"], ["marge", "Une marge"], ["coin", "Un coin"]];
const PROFONDEURS: [Prof, string][] = [["coque", "La coque"], ["carte", "La carte"], ["ligne", "La ligne"], ["serre", "Au plus serré"]];
const REPONSES: Record<Nature, Record<Prof, { jetons: string[]; role: string }>> = {
  espace: {
    coque: { jetons: ["gap-1-block", "gap-1-inline"], role: "entre deux cartes, dans la coque" },
    carte: { jetons: ["gap-2-block", "gap-2-inline"], role: "entre deux lignes, dans la carte" },
    ligne: { jetons: ["gap-3-block", "gap-3-inline"], role: "dans une ligne — une icône et son texte, deux boutons" },
    serre: { jetons: ["gap-4-block", "gap-4-inline"], role: "au plus serré — un chiffre et son libellé, l'intérieur d'un badge" },
  },
  marge: {
    coque: { jetons: ["pad-1-block", "pad-1-inline"], role: "la marge de la coque — panneau, scène, feuille" },
    carte: { jetons: ["pad-2-block", "pad-2-inline"], role: "la marge de la carte" },
    ligne: { jetons: ["pad-3-block", "pad-3-inline"], role: "la marge de la ligne — rangée, cellule, bouton, champ" },
    serre: { jetons: ["gap-4-block", "gap-3-inline"], role: "la marge d'un badge, d'une pastille" },
  },
  coin: {
    coque: { jetons: ["r-1"], role: "le coin de la coque — la racine" },
    carte: { jetons: ["r-2"], role: "le coin de la carte" },
    ligne: { jetons: ["r-3", "r-ctl"], role: "le coin de la ligne — et du bouton, du champ, du sélecteur" },
    serre: { jetons: ["r-4"], role: "le coin d'une marque, d'une vignette" },
  },
};
function valeur(nom: string) {
  const t = J[nom];
  return t.axe
    ? `${px(t.base)} px à la charte · de ${px(t.bas ?? t.base)} à ${px(t.haut ?? t.base)} selon l'écran`
    : `${px(t.base)} px — fixe, ne suit pas l'écran`;
}
function BonCran() {
  const [nature, setNature] = useState<Nature>("espace");
  const [prof, setProf] = useState<Prof>("carte");
  const rep = REPONSES[nature][prof];
  return (
    <div className="ry-cran">
      <div className="ry-question">
        <span className="mono sourd">1 · C&apos;est quoi ?</span>
        <div className="rang">
          {NATURES.map(([v, nom]) => (
            <button key={v} className={`bouton ${nature === v ? "on" : ""}`} onClick={() => setNature(v)}>{nom}</button>
          ))}
        </div>
      </div>
      <div className="ry-question">
        <span className="mono sourd">2 · À quelle profondeur ?</span>
        <div className="rang">
          {PROFONDEURS.map(([v, nom]) => (
            <button key={v} className={`bouton ${prof === v ? "on" : ""}`} onClick={() => setProf(v)}>{nom}</button>
          ))}
        </div>
      </div>
      {/* La réponse en affiche (demande d'Auteur, 24 août : « grossir
          énormément le résultat ») — le cran du titre-affiche du gabarit,
          l'encre, pas l'accent. */}
      <div className="ry-reponse">
        <b className="mono ry-affiche">{rep.jetons.map((n) => `--${n}`).join(" · ")}</b>
        <span className="sourd ry-h3">{rep.role}</span>
        <span className="gd-legende">
          {rep.jetons.map((n, i) => <span key={n}>{i > 0 && <br />}--{n} : {valeur(n)}</span>)}
        </span>
      </div>
    </div>
  );
}

/* ── La densité — trois fois la même carte, seule la BASE change.
   Chaque carte porte sa densité : la chaîne de ses jetons se recalcule
   toute seule (tokens.css). La carte du milieu ne porte rien : elle vit
   sur le réglage du site, celui du tiroir. ── */
function CarteDensite({ densite, etiquette }: { densite?: "airy" | "compact"; etiquette: string }) {
  return (
    <div className="ry-dcarte" data-density={densite}>
      <div className="ry-detiq">{etiquette}</div>
      <h3 className="ry-h3">Léa Fontan</h3>
      <div className="ry-lignes"><div className="ry-sk" /><div className="ry-sk c" /></div>
    </div>
  );
}
function Densites() {
  const { densite } = useDensite();
  const nomSite = densite === "airy" ? "aéré" : densite === "compact" ? "compact" : "confortable";
  return (
    <div className="ry-densites">
      <CarteDensite densite="airy" etiquette={`aéré · base ${DENSITES.airy}`} />
      <CarteDensite etiquette={`le réglage du site — ${nomSite} · base ${DENSITES[densite]}`} />
      <CarteDensite densite="compact" etiquette={`compact · base ${DENSITES.compact}`} />
    </div>
  );
}

/* ── Le vocabulaire — marge et espace, par profondeur et par axe. Les
   tuiles consomment les jetons qu'elles nomment ; les chiffres sont lus
   dans le registre calculé. ── */
function Vocabulaire() {
  const p = SOCLE.pad, g = SOCLE.gap, r = SOCLE.r;
  return (
    <div className="ry-voc">
      <div className="ry-voc-tuiles">
        <div className="ry-voc-tuile">
          <h3 className="ry-h3">La coque <span className="mono">profondeur 1</span></h3>
          <p>Le panneau, la scène, la feuille, la fenêtre : la surface qui contient tout. Elle porte
          la base et la racine des coins — tout le reste en descend.</p>
          <div className="ry-vocfig coque"><div className="ry-vocbox" /><div className="ry-vocbox" /></div>
          <span className="gd-legende">marge {px(p[0])} · coin {px(r[0])} · entre ses cartes {px(g[0])}</span>
        </div>
        <div className="ry-voc-tuile">
          <h3 className="ry-h3">La carte <span className="mono">profondeur 2</span></h3>
          <p>Le bloc posé dans la coque. Sa marge est la base divisée par racine de deux, son coin la
          racine divisée par deux — et l&apos;espace qui la sépare de sa sœur vaut sa marge.</p>
          <div className="ry-vocfig carte"><div className="ry-vocbox ligne" /><div className="ry-vocbox ligne" /></div>
          <span className="gd-legende">marge {px(p[1])} · coin {px(r[1])} · entre ses lignes {px(g[1])}</span>
        </div>
        <div className="ry-voc-tuile">
          <h3 className="ry-h3">La ligne <span className="mono">profondeur 3</span></h3>
          <p>La rangée, la cellule, le bouton, le champ. Encore un pas de chaîne. Le bouton prend son
          coin ; dedans vivent les espaces les plus serrés — un chiffre et son libellé, un badge.</p>
          <div className="ry-vocfig ligne"><div className="ry-vocbox item" /><span className="ry-vocbadge">badge</span><div className="ry-vocbox item" /></div>
          <span className="gd-legende">marge {px(p[2])} · coin {px(r[2])} · dans la ligne {px(g[2])} · au plus serré {px(g[3])}</span>
        </div>
      </div>
      <div className="ry-defile">
        <table className="tableau mono">
          <thead><tr><th>par axe</th><th>ce qui glisse</th><th>de l&apos;écran étroit au large</th></tr></thead>
          <tbody>
            <tr><td>horizontal (inline)</td><td>marges, espaces, bord, crans de page</td><td>× {px(AXES.inline.min)} → × {px(AXES.inline.max)}</td></tr>
            <tr><td>vertical (block)</td><td>marges, espaces, bord, crans de page</td><td>× {px(AXES.block.min)} → × {px(AXES.block.max)}</td></tr>
            <tr><td>texte (type)</td><td>les crans de texte, corps borné</td><td>× {px(AXES.type.min)} → × {px(AXES.type.max)}</td></tr>
            <tr><td>cible (control)</td><td>la hauteur des commandes</td><td>× {px(AXES.control.min)} → × {px(AXES.control.max)}</td></tr>
            <tr><td>les coins</td><td>rien — réglés par la racine, pas par l&apos;écran</td><td>fixes</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Le sommaire de la page — le rail vit dans rail.tsx (partagé) ── */
const SOMMAIRE: Sommaire = [
  ["echelle", "01", "La chaîne"],
  ["decisions", "02", "Les décisions maîtresses"],
  ["profondeur", "03", "La profondeur"],
  ["densite", "04", "La densité"],
  ["proximite", "05", "La proximité"],
  ["cran", "06", "Le bon cran"],
  ["vocabulaire", "07", "Le vocabulaire"],
  ["adaptation", "08", "L'adaptation"],
];
export default function Vue() {
  const [casseY1, setCasseY1] = useState(false);
  const [casseY2, setCasseY2] = useState(false);
  const [intention, setIntention] = useState(1);
  const [casseRond, setCasseRond] = useState(false);
  const [fw, setFw] = useState<"React" | "Angular" | "HTML">("HTML");
  const { styl } = useAdaptation();
  const actifId = useDocSections("echelle");

  return (
    <div className="gdoc-fond ry">
      <div className="gdoc">
        <RailDoc page="rythme" titre="Fondation · Rythme" sommaire={SOMMAIRE} actifId={actifId} pied="Une chaîne · quatre axes" />

        <main className="gdoc-contenu" id="contenu">

          <section className="gdoc-heros">
            <p className="kicker">Fondation · Le rythme (espacement)</p>
            <h1>Chaque distance de cette page a une raison<span className="point" aria-hidden="true" /></h1>
            <p className="chapo">
              Espacer, c&apos;est décider qui est lié à qui : quand une distance est
              arbitraire, la page ment. Ici, toute distance sort d&apos;une seule chaîne — une base,
              un intervalle, une racine — et <b>chaque règle porte son pourquoi, sa source
              vérifiable, et ses divergences assumées</b>. Sous chaque banc d&apos;essai,
              « Règles &amp; sources » se déplie.
            </p>
          </section>

          <section className="gdoc-sec pose" id="echelle">
            <div className="gdoc-sec-tete">
              <p className="kicker">01 · La chaîne</p>
              <h2>Chaque distance vient d&apos;une seule chaîne</h2>
              <p className="sourd">Des distances décidées au cas par cas finissent par se
              contredire. Ici, chaque espace de cette tranche d&apos;application est un jeton de
              la chaîne commune — la coque, puis la carte, puis la ligne — qui glisse avec la
              largeur de l&apos;écran. Survolez la tranche : chaque espace se nomme, sa nature et
              sa profondeur.</p>
            </div>
            <div className="gdoc-corps">
              <figure className="gd-figure">
                {/* Plus de bouton : les espaces se révèlent au survol de la
                    tranche (ou au clavier), et s'effacent en la quittant. */}
                <div className="banc primaire survole-espaces">
                  <TrancheCoursue voir />
                </div>
                {/* La légende parle aux humains : l'effet, pas la mécanique
                    (retour d'Auteur, 24 août — même leçon que les badges de
                    la page Couleur). */}
                <figcaption className="gd-legende">
                  Du bord de l&apos;écran au moindre bouton, chaque distance sort du même
                  réglage — rien n&apos;est espacé à l&apos;œil. Plus on entre profond,
                  plus les marges et les coins se resserrent, d&apos;eux-mêmes ; et entre
                  deux frères, l&apos;espace vaut leur marge.
                </figcaption>
              </figure>
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <p>Toutes les distances sortent d&apos;<b>un moteur</b> : trois décisions entrent
                (la base, l&apos;intervalle, la racine des coins), toute la géométrie sort, sur
                quatre axes — l&apos;horizontal, le vertical, le texte, la cible. Aucune valeur
                n&apos;est écrite à la main. La tranche emboîte ses fonds en cascade : la coque, la
                carte, la ligne — marges et coins descendent à chaque profondeur (CG4, relevé
                Coursue).</p>
                <Regles ids={["y8", "y9", "y3", "y7", "y17", "y4"]} />
              </div></details>
            </div>
          </section>

          <section className="gdoc-sec pose" id="decisions">
            <div className="gdoc-sec-tete">
              <p className="kicker">02 · Les décisions maîtresses</p>
              <h2>Trois décisions, toute la géométrie</h2>
              <p className="sourd">Régler chaque valeur à la main, c&apos;est la dérive assurée. Ici,
              trois décisions entrent — la base, l&apos;intervalle, la racine des coins — et toute la
              géométrie sort : les marges divisées par l&apos;intervalle, les coins par deux, l&apos;espace
              entre deux frères égal à leur marge. Ce laboratoire montre la mécanique ; la chaîne du
              kit, elle, reste celle du registre.</p>
            </div>
            <div className="gdoc-corps">
              <div className="rang">
                {INTENTIONS.map((it, i) => (
                  <button key={it.nom} className={`bouton ${intention === i ? "on" : ""}`}
                    onClick={() => setIntention(i)}>{it.nom}</button>
                ))}
              </div>
              <Laboratoire intention={intention} />
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <Regles ids={["y12", "y1", "y11"]} />
              </div></details>
            </div>
          </section>

          <section className="gdoc-sec pose" id="profondeur">
            <div className="gdoc-sec-tete">
              <p className="kicker">03 · La profondeur</p>
              <h2>Coque, carte, ligne — une chaîne, pas trois choix</h2>
              <p className="sourd">Trois niveaux réglés séparément finissent par se contredire. Ici la
              marge et le coin descendent ensemble à chaque profondeur — la marge divisée par racine
              de deux, le coin par deux — et l&apos;enfant n&apos;est jamais plus rond que son parent.
              Les coins, eux, ne bougent pas avec l&apos;écran : seules les marges glissent. Cassez la
              chaîne pour voir la profondeur se brouiller.</p>
            </div>
            <div className="gdoc-corps">
              <div className="rang">
                <button className={`bouton casse ${casseRond ? "on" : ""}`} onClick={() => setCasseRond(!casseRond)}>
                  {casseRond ? "Réparer" : "Casser : l'enfant plus rond"}
                </button>
              </div>
              <Profondeur casse={casseRond} />
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <Regles ids={["y10", "y16", "y15"]} />
              </div></details>
            </div>
          </section>

          <section className="gdoc-sec pose" id="densite">
            <div className="gdoc-sec-tete">
              <p className="kicker">04 · La densité</p>
              <h2>Un mode compact qui reste dans le système</h2>
              <p className="sourd">Un « mode compact à 80 % » fabriquerait des valeurs hors
              système, introuvables au changement de marque. Ici, la densité (tiroir « Réglages »,
              en haut à droite) change la base de la chaîne — pour tout le site, cette page
              comprise — et chaque marge, chaque espace se recalcule. Ce qui ne bouge jamais : les
              coins, les composants, l&apos;ordre et la présence de chaque élément.</p>
            </div>
            <div className="gdoc-corps">
              <figure className="gd-figure">
                <div className="banc sombre">
                  <Densites />
                </div>
                <figcaption className="gd-legende">même carte, même chaîne — seule la base change d&apos;une densité à l&apos;autre ; la carte du milieu suit le réglage du site</figcaption>
              </figure>
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <p>Un « mode compact à 80 % » fabriquerait des valeurs hors chaîne, introuvables au
                changement de marque. Une autre base, elle, reste dans le système : chaque distance
                garde sa provenance.</p>
                <Regles ids={["y5", "y6"]} />
              </div></details>
            </div>
          </section>

          <section className="gdoc-sec pose" id="proximite">
            <div className="gdoc-sec-tete">
              <p className="kicker">05 · La proximité</p>
              <h2>Quand une distance ment, la page ment</h2>
              <p className="sourd">Plus deux éléments sont proches, plus leur lien perçu est fort —
              quand une distance ment, la page raconte autre chose. Un libellé équidistant flotte
              entre deux champs ; un titre mal espacé change de camp. Les deux casses le
              démontrent.</p>
            </div>
            <div className="gdoc-corps">
              <div className="rang">
                <button className={`bouton casse ${casseY1 ? "on" : ""}`} onClick={() => setCasseY1(!casseY1)}>
                  {casseY1 ? "Réparer le libellé" : "Casser le libellé"}
                </button>
                <button className={`bouton casse ${casseY2 ? "on" : ""}`} onClick={() => setCasseY2(!casseY2)}>
                  {casseY2 ? "Réparer le titre" : "Casser le titre"}
                </button>
              </div>
              <Proximite casseY1={casseY1} casseY2={casseY2} />
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <p>La loi de proximité (Gestalt), formulée presque mot pour mot par les grands
                systèmes — et la faute la plus fréquente des interfaces : des distances qui
                racontent autre chose que le contenu.</p>
                <Regles ids={["y1", "y2"]} />
              </div></details>
            </div>
          </section>

          <section className="gdoc-sec pose" id="cran">
            <div className="gdoc-sec-tete">
              <p className="kicker">06 · Le bon cran</p>
              <h2>Le bon cran se déduit, il ne se choisit pas</h2>
              <p className="sourd">Choisir un cran à l&apos;œil, c&apos;est rouvrir la dérive à chaque
              écran. Deux questions suffisent — sa nature, sa profondeur — et chaque valeur posée
              doit pouvoir citer ses deux réponses.</p>
            </div>
            <div className="gdoc-corps">
              <BonCran />
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <Regles ids={["y14"]} />
              </div></details>
            </div>
          </section>

          <section className="gdoc-sec pose" id="vocabulaire">
            <div className="gdoc-sec-tete">
              <p className="kicker">07 · Le vocabulaire</p>
              <h2>Une marge, un espace, un coin — à sa profondeur, sur son axe</h2>
              <p className="sourd">Deux distances de même valeur peuvent faire deux métiers. Le kit
              n&apos;a que trois mots — la marge qui encadre, l&apos;espace qui sépare, le coin qui
              arrondit — et deux questions pour les poser : à quelle profondeur, sur quel axe. La
              règle parle du métier, jamais du pixel.</p>
            </div>
            <div className="gdoc-corps">
              <Vocabulaire />
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <p>Trois profondeurs — la coque, la carte, la ligne — et un cran de plus pour ce qui
                vit au plus serré. Sur chaque profondeur, une marge et un espace, chacun sur ses deux
                axes ; un coin, qui n&apos;a pas d&apos;axe. Les anciens rôles nommés (retrait, pile,
                ligne, grille) ne sont plus le vocabulaire du kit : ils disaient la forme de
                l&apos;espace, pas sa provenance.</p>
                <Regles ids={["y14", "y13"]} />
              </div></details>
            </div>
          </section>

          <section className="gdoc-sec pose" id="adaptation">
            <div className="gdoc-sec-tete">
              <p className="kicker">08 · L&apos;adaptation</p>
              <h2>Le même système, dans votre stack</h2>
              <p className="sourd">Un système normatif enfermé dans un framework n&apos;est
              qu&apos;une bibliothèque. Ici le normatif vit dans la règle et le jeton ; React,
              Angular ou HTML n&apos;en sont que des consommateurs — le même système, traduit.</p>
            </div>
            <div className="gdoc-corps">
              <PanneauCode langage={styl} outils={
                <>{(["HTML", "React", "Angular"] as const).map((f) => (
                  <button key={f} className={`bouton ${fw === f ? "on" : ""}`} onClick={() => setFw(f)}>{f}</button>
                ))}</>
              } code={SNIPPETS[fw][styl]} />
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <p>Le normatif, ici, c&apos;est <b>la règle et le jeton</b> — pas le code. Un seul
                calcul produit des variables CSS natives et une sortie Tailwind jumelle ; React,
                Angular ou HTML n&apos;en sont que des consommateurs.</p>
                <p><b>Deux échelles assumées</b> : le CSS natif garde les décimales calculées ;
                Tailwind s&apos;accroche à sa grille de 4, valeurs arrondies, jamais de décimales.
                On ne mélange pas les deux — la correspondance, jeton par jeton, lue dans le
                moteur :</p>
                <Correspondance />
              </div></details>
            </div>
          </section>

          <footer className="gd-pied">
            <span>Cette page est composée par les règles qu&apos;elle documente</span>
            <span>Un seul registre, site compris · aucune valeur hors chaîne</span>
          </footer>

        </main>
      </div>
    </div>
  );
}
