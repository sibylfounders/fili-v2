"use client";
import Scenario from "./scenario";
import { Fragment, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Bands, Band, Demo, DemoSides, DemoSide, ListRules, PanelRegistry } from "../levels";
import type { LineList, LineCode } from "../levels";
import { useDensity } from "../density";
import { RailDoc, useDocSections, type Toc } from "../rail";
import { Preview } from "../preview";
import { chain, tokens, DENSITIES, CHARTER, BOUNDS, WIDTH_MIN, WIDTH_MAX } from "../../derivation.mjs";

/* ═══════════════════════════════════════════════════════════════════════
   PAGE RYTHME — recomposée au gabarit « documentaire nu » (24 août 2026),
   migrée sur la chaîne du registre (25 août 2026 : les huit décisions).
   Pièce de référence : kit-rythme-nu.html (verdict d'Auteur PARFAIT).
   · Le blanc structure tout (CG1) — les démos vivent dans des scènes,
     seules grandes surfaces de leur écran.
   · Rail nu (CG2) : navigation + sommaire, portés par l'alignement.
   · Un geste de couleur par écran (CG3) : le point du titre, puis la
     scène de la tranche Fili. Les commandes actives sont encre.
   · La tranche Fili emboîte ses fonds en cascade : container →
     card → row, chaque profondeur avec sa marge et son coin.
   · Titre-affiche déclaré (CG5) : alias --doc-* de tokens.css.
   Plan de preuves validé : 01 la tranche Fili en situation · 04 la
   densité en variation · 07 le vocabulaire. Objets vivants : Léa Fontan,
   Fili. Tout chiffre affiché est CALCULÉ par le moteur (derivation.mjs),
   jamais recopié. Les styles propres à la page vivent dans rythme.css.
   ═══════════════════════════════════════════════════════════════════════ */

/* Le registre, calculé — la même chaîne que tokens.css. */
type Token = { axis: string | null; base: number; bottom?: number; top?: number; freeze?: number; css: string };
type Foundation = ReturnType<typeof chain>;
const FOUNDATION: Foundation = chain();
/* Le moteur écrit ses tokens nom par nom : on le lit comme un registre. */
const J = tokens(FOUNDATION) as unknown as Record<string, Token>;
/* Les nombres s'écrivent à la française dans les légendes, un chiffre après la virgule. */
const px = (v: number) => String(Math.round(v * 10) / 10).replace(".", ",");
/* Les mêmes arrondis, sous les noms que la page d'essai leur donnait — le
   code versé le 2 septembre les emploie tels quels. */
const fr = px;
const fr2 = (v: number) => String(Math.round(v * 100) / 100).replace(".", ",");
/* L'accrochage Tailwind : la grille de 4, comme tokens.tailwind.mjs. */
const grid4 = (v: number) => Math.round(v / 4) * 4;

/* Un espace rendu visible : c'est un VRAI espace de la tranche (il porte le
   token), pas une illustration — l'interrupteur ne fait que le colorer.
   L'étiquette ne se pose QUE là où on la passe : une par token, dans
   l'espace qu'elle nomme — pas une par bloc (lisibilité, 24 août). */
function E({ j, h, see, name, genre, step }: { j: string; h?: boolean; see: boolean; name?: string; genre: "pad" | "gap"; step?: number }) {
  /* Le code couleur des espaces (décision d'Auteur, 24 août) :
     danger = les marges (padding), success = les espaces (gap/margin).
     La convention des inspecteurs, portée par nos tokens sémantiques. */
  return <span className={`space ${h ? "h" : ""} ${see ? "seen" : ""} ${genre}`}
    data-name={see && name ? name : undefined} data-step={step}
    style={h ? { width: `var(${j})` } : { height: `var(${j})` }} />;
}

/* Le monogramme de la charte — la tranche porte NOTRE marque : la
   maquette montre le système du kit, pas celui d'un autre (24 août). */
const D_FILI = "M356.879 197C377.293 197 391.501 204.877 394.412 217.448C395.121 220.046 395.493 223.172 395.493 226.924C395.493 239.317 385.756 248.688 372.672 248.688C364.199 248.688 357.063 244.568 353.216 238.18C353.14 238.054 353.066 237.927 352.993 237.799C351.177 234.635 350.156 230.938 350.156 226.924C350.156 216.714 356.765 208.556 366.239 205.999C363.899 203.331 360.302 201.836 355.368 201.836C339.045 201.836 329.977 216.043 321.514 257.453L317.584 277.101H338.67L391.566 277.101V391.962C391.566 411.912 393.682 417.655 407.889 424.305V424.909H340.181V424.305C354.387 417.655 356.503 411.912 356.503 391.962V310.35C356.503 298.163 355.002 290.617 349.615 284.96H316.073L281.917 424.909C270.128 472.97 248.668 493.222 213 494.733V494.128C232.345 485.363 242.018 452.113 253.202 404.355L280.406 284.96H260.456L261.06 282.542L282.521 275.892L286.451 261.987C299.146 218.461 321.514 197 356.879 197ZM430.349 381C417.664 381 408 390.472 408 403C408 415.528 417.664 425 430.349 425C443.336 425 453 415.528 453 403C453 390.472 443.336 381 430.349 381Z";

/* Les quatre scènes de cette page sont EXPORTÉES (2 septembre 2026) : la
   page d'essai du moteur les consomme telles quelles, sans les recopier.
   Une planche qui recopie une scène finit toujours par en dériver ; celle-ci
   montre les vrais blocs, ou elle ne montre rien.
   ── La tranche d'application — la scène de la démo Léa Fontan (CG4) ──
   L'emboîtement en cascade relevé sur une application en production : la tranche est le container
   (marge 1, coin 1) → la card (marge 2, coin 2) → les rows (marge 3,
   coin 3), profondeur par les fonds, ni ombre ni bordure. Dans la card,
   chaque distance est un bloc d'espace explicite : au survol, chacun se
   nomme — sa nature et sa profondeur. */
/* Deux réglages OPTIONNELS, ajoutés le 2 septembre 2026 pour le scénario du
   moteur — la page Rythme ne passe ni l'un ni l'autre et ne bouge pas d'un
   pixel :
   · menu     : le faux menu de gauche est un décor. Dans un récit où la
                fiche est le seul sujet, il mange la moitié de la scène.
   Corrigé au passage : les quatre bandes de la marge du container
   s'affichaient en permanence, sans regarder l'interrupteur des autres
   espaces. Sur Rythme la scène ne les révèle qu'au survol, donc ça ne se
   voyait pas ; ailleurs, une marge restait allumée toute seule. */
export function SliceFili({ see, menu = true }:
  { see: boolean; menu?: boolean }) {
  const marginBlock = "--pad-2-block";
  const marginLine = "--pad-2-inline";
  const betweenLines = "--gap-2-block";
  const insideThereLine = "--gap-3-inline";
  return (
    <div className="slice" role="img" aria-label="Tranche d'application : profil de Léa Fontan, chaque distance posée sur la chaîne du kit">
      {/* Le container n'a pas de bloc d'espace à lui : sa marge EST son
          rembourrage. On la trace donc par quatre bandes posées à même son
          bord, à l'épaisseur exacte du token. Ce sont de vraies cibles :
          ce cran se nomme et s'allume comme les trois autres (31 août). */}
      <span className="ry-margin1" aria-hidden="true">
        <span className={`space ${see ? "seen" : ""} pad top`} data-step={1} data-name={see ? "margin · container" : undefined} />
        <span className={`space ${see ? "seen" : ""} pad bottom`} data-step={1} />
        <span className={`space ${see ? "seen" : ""} pad left`} data-step={1} />
        <span className={`space ${see ? "seen" : ""} pad right`} data-step={1} />
      </span>
      {menu && <div className="tr-nav">
        <div className="tr-brand">
          <svg className="m" viewBox="211 195 244 301.7" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d={D_FILI} />
          </svg>Fili
        </div>
        <div className="tr-item">Cours</div>
        <div className="tr-item">Messages</div>
        <div className="tr-item on">Profil</div>
      </div>}
      {/* La marge de la card fait le TOUR de la card, d'un seul tenant :
          ses deux colonnes courent sur toute la hauteur, ses deux bandes
          ferment en haut et en bas. Avant, les marges latérales vivaient
          dans chaque row : les espaces entre rows les traversaient de
          bord à bord et coupaient l'anneau en morceaux (verdict d'Auteur,
          1er septembre). Un espace ENTRE deux rows appartient au dedans
          du composant — il ne mord jamais sur sa marge. */}
      <div className="tr-card">
        <E j={marginLine} h see={see} genre="pad" step={2} />
        <div className="tr-card-body">
          {/* L’étiquette NOMME, elle n’explique pas : une phrase dans une
              bande de douze pixels ne peut pas montrer un rapport entre deux
              longueurs (verdict d’Auteur, 31 août). Le rapport se voit à côté,
              sur la réglette : chaque espace porte son CRAN, et survoler l’un
              allume l’autre. */}
          <E j={marginBlock} see={see} name="marge · card" genre="pad" step={2} />
          <span className="tr-id">
            <span className="tr-avatar" aria-hidden="true">LF</span>
            <span className="ry-min0">
              <span className="tr-name">Léa Fontan</span>
              <span className="tr-role">UX Designer — chaque distance de cette card est un token de la chaîne.</span>
            </span>
          </span>
          <E j={betweenLines} see={see} name="espace · entre deux rows" genre="gap" step={3} />
          <span className="ry-flex">
            <button className="tr-btn first" type="button" tabIndex={-1}>Suivre</button>
            <E j={insideThereLine} h see={see} name="espace · dans la row" genre="gap" step={4} />
            <button className="tr-btn" type="button" tabIndex={-1}>Message</button>
          </span>
          <E j={betweenLines} see={see} genre="gap" step={3} />
          <span className="ry-flex ry-wide">
            <span className="tr-sub"><b>24</b><span>cours suivis</span></span>
            <E j={insideThereLine} h see={see} genre="gap" step={4} />
            <span className="tr-sub"><b>1&nbsp;280</b><span>abonnés</span></span>
            <E j={insideThereLine} h see={see} genre="gap" step={4} />
            <span className="tr-sub"><b>96&nbsp;%</b><span>assiduité</span></span>
          </span>
          <E j={marginBlock} see={see} genre="pad" step={2} />
        </div>
        <E j={marginLine} h see={see} genre="pad" step={2} />
      </div>
    </div>
  );
}

/* Les distances de la card sont des blocs d'espace explicites. Dans le cadre
   d'une démonstration ils sont visibles et cotés : la mesure est posée à
   l'endroit de l'espace, en nombre — le verdict, lui, est dans la tête du
   côté, la scène ne le répète pas (verdict d'Auteur, 9 septembre). */
function Space({ j, v, fault }: { j: string; v?: number; fault?: boolean }) {
  return <span className={`space ${v !== undefined ? "seen" : ""}`} data-name={v !== undefined ? `${px(v)} px` : undefined}
    data-intent={fault ? "statement" : undefined} style={{ height: `var(${j})` }} />;
}
/* Deux fautes, deux fiches : elles ne se cassent plus ensemble (gabarit
   des étages, 1er septembre). Le juste : au-dessus d'un titre, l'espace
   entre deux cards ; sous le titre, l'espace d'un titre à sa phrase ;
   d'un libellé à son champ, le même. */
function ProximityLabel({ broken }: { broken: boolean }) {
  const s = useFoundation();
  return (
    <div className="ry-prox-card" data-intent={broken ? "statement" : undefined}>
      <p className="muted">Un paragraphe qui précède.</p>
      <Space j="--gap-1-block" v={s.gap[0]} />
      <label className="mono ry-block">Adresse e-mail</label>
      <Space j={broken ? "--gap-1-block" : "--gap-3-block"} v={broken ? s.gap[0] : s.gap[2]} fault={broken} />
      <span className="field-box"><input readOnly value="prenom@exemple.fr" className="ry-field" /></span>
    </div>
  );
}
function ProximityHeading({ broken }: { broken: boolean }) {
  const s = useFoundation();
  return (
    <div className="ry-prox-card" data-intent={broken ? "statement" : undefined}>
      <p className="muted">Un paragraphe qui précède la section.</p>
      <Space j={broken ? "--gap-2-block" : "--gap-1-block"} v={broken ? s.gap[1] : s.gap[0]} fault={broken} />
      <h3 className="ry-h3">Vos coordonnées</h3>
      <Space j={broken ? "--gap-2-block" : "--gap-3-block"} v={broken ? s.gap[1] : s.gap[2]} fault={broken} />
      <p className="muted">La section qu&apos;il ouvre commence ici.</p>
    </div>
  );
}

type Src = { t: string; h: string };
const DECISIONS: Src = { t: "Décisions du 25 août 2026, séance sur pièce", h: "#" };
const RULES: { id: string; name: string; heading: string; statement: string; why: string; src: Src[]; div?: string }[] = [
  { id: "y1", name: "1", heading: "L'espace entre deux frères vaut leur marge",
    statement: "L'espace qui sépare deux surfaces sœurs est exactement leur marge intérieure — ni plus, ni moins. Le dedans et le dehors d'une surface ne se règlent pas séparément : c'est le même chiffre.",
    why: "Un contenu plus proche du bord du voisin que de son propre bord a l'air d'appartenir au voisin. L'espace dit qui est lié à qui — il ne doit pas mentir.",
    src: [DECISIONS, { t: "Atlassian — Spacing", h: "https://atlassian.design/foundations/spacing" }, { t: "NN/g — Principe de proximité", h: "https://www.nngroup.com/articles/gestalt-proximity/" }] },
  { id: "y2", name: "2", heading: "Le titre appartient à ce qu'il ouvre",
    statement: "L'espace au-dessus d'un titre dépasse l'espace au-dessous d'au moins un cran.",
    why: "Un titre équidistant flotte ; un titre plus proche du bloc précédent ment. Convention éditoriale constante, transposée en crans de la chaîne.",
    src: [{ t: "Butterick — Space above & below", h: "https://practicaltypography.com/space-above-and-below.html" }, { t: "Rutter — Vertical rhythm", h: "https://webtypography.net/2.2.2" }] },
  { id: "y3", name: "3", heading: "Toute distance descend d'une seule base",
    statement: "Toute distance posée par le système descend de la marge du container, divisée par racine de deux à chaque profondeur — container, card, row. La densité choisit cette base parmi trois ; rien d'autre n'en choisit une.",
    why: "La régularité vient du petit nombre de valeurs et du rapport constant entre elles, pas de leur précision — l'œil reconnaît une chaîne, pas une grille.",
    src: [DECISIONS, { t: "Carbon — Spacing", h: "https://carbondesignsystem.com/elements/spacing/overview/" }] },
  { id: "y4", name: "4", heading: "L'interligne suit la lisibilité, pas la grille",
    statement: "Aucun interligne n'est recalé sur la chaîne sans une décision explicite et datée.",
    why: "La grille stricte des livres suppose des corps fixes ; forcer l'interligne dessus dégrade la lecture. La lisibilité prime — l'exception se décide, elle ne se subit pas.",
    src: [{ t: "WCAG 1.4.8 — Visual Presentation", h: "https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html" }] },
  { id: "y5", name: "5", heading: "La densité change la base",
    statement: "Compact, confortable, aéré : trois bases, une seule chaîne. La densité remplace la base et toute la chaîne des marges et des espaces se recalcule ; les coins et les composants ne bougent pas. Jamais un multiplicateur, jamais une valeur propre, jamais un décalage.",
    why: "Un « ×0,8 » fabrique des valeurs hors chaîne, invisibles au changement de marque. Une autre base reste dans le système : chaque distance garde sa provenance.",
    src: [DECISIONS] },
  { id: "y6", name: "6", heading: "La densité ne change jamais la structure",
    statement: "L'ordre des emplacements et la présence des éléments restent identiques d'une densité à l'autre.",
    why: "Un mode compact qui masque ou réordonne, c'est deux produits dans un — et un apprentissage cassé.",
    src: [{ t: "Règle interne du système", h: "#" }] },
  { id: "y7", name: "7", heading: "Deux régimes, un seul seuil — et le rythme glisse",
    statement: "Un régime est une mise en page : il y en a deux, séparées par un seuil unique. Le rythme, lui, ne connaît pas de palier : il glisse du plus petit écran au plus grand, sur quatre axes — l'horizontal, le vertical, le texte, la cible.",
    why: "On n'ajoute pas des paliers par imitation : un troisième régime naîtra d'un besoin réel, documenté et daté. Et une valeur gelée pour une maquette n'est juste qu'à sa largeur.",
    div: "La plupart des grands systèmes ont 5 ou 6 paliers (Atlassian, Carbon, Material). Nous assumons l'inverse, par écrit.",
    src: [DECISIONS, { t: "Atlassian — Grid", h: "https://atlassian.design/foundations/grid-beta" }, { t: "Carbon — 2x Grid", h: "https://carbondesignsystem.com/elements/2x-grid/overview/" }] },
  { id: "y8", name: "8", heading: "Les crans sont responsives — c'est le token qui varie, jamais l'écran",
    statement: "Chaque token glisse entre deux bornes, sur son axe — mais la variation vit dans la définition du token, une fois. Aucun écran ne redéfinit un cran.",
    why: "Sur petit écran, les espaces doivent pouvoir se resserrer sans casser la logique. Et si chaque écran bricolait ses valeurs, le système n'existerait plus.",
    src: [{ t: "GOV.UK — Spacing", h: "https://design-system.service.gov.uk/styles/spacing/" }] },
  { id: "y9", name: "9", heading: "La géométrie d'espacement vit en rem",
    statement: "Les tokens d'espacement s'expriment en rem. Restent en pixels, par décision explicite : le plancher de la cible du doigt, les traits d'un pixel, la largeur d'écran minimale.",
    why: "Quand l'utilisateur agrandit le texte, les espaces qui l'entourent doivent suivre — sinon la page casse au premier réglage d'accessibilité.",
    src: [{ t: "WCAG 1.4.4 — Resize Text", h: "https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html" }] },
  { id: "y10", name: "10", heading: "La profondeur choisit — pas toi",
    statement: "La marge et le coin d'une surface descendent ensemble à chaque profondeur — les coins divisés par deux, les marges par racine de deux — et la marge ne descend jamais sous le coin. Container, card, row forment une chaîne, pas trois choix. Un composant prend le coin de la row.",
    why: "Trois niveaux réglés à la main dérivent ; une chaîne tient toute seule.",
    src: [DECISIONS] },
  { id: "y11", name: "11", heading: "Les titres sortent du même pas",
    statement: "Le corps reste stable et ne descend jamais sous son plancher ; chaque cran de titre vaut le précédent multiplié par le même intervalle — l'échelle des titres dérive des mêmes décisions que les espaces, elle n'est pas une échelle à part.",
    why: "Deux échelles indépendantes finissent par se contredire ; une dérivation ne le peut pas.",
    src: [DECISIONS] },
  { id: "y12", name: "12", heading: "Des rapports, jamais des soustractions",
    statement: "Les crans naissent d'un diviseur appliqué en chaîne, jamais d'une différence fixe.",
    why: "L'œil lit les rapports, pas les écarts : trois crans obtenus en retranchant sont presque jumeaux ; trois crans obtenus en divisant sont lisibles.",
    src: [{ t: "Le générateur du système (leçon 5)", h: "#" }] },
  { id: "y13", name: "13", heading: "Un seul registre, site compris",
    statement: "Les crans de page — la tête d'une section, la gouttière, le silence entre deux sections — sont la même chaîne continuée au-dessus du container. Le gabarit du site ne possède aucune valeur à lui : chaque distance qu'il consomme est un token dérivé.",
    why: "Un site qui vivrait sur une autre échelle que ses composants aurait deux rythmes ; on n'en veut qu'un.",
    src: [DECISIONS] },
  { id: "y14", name: "14", heading: "Deux questions choisissent le cran",
    statement: "Est-ce un espace, une marge ou un coin ? À quelle profondeur — container, card, row, ou au plus serré ? La réponse désigne le token — le cran se déduit, il ne se choisit pas à l'œil.",
    why: "Méthode : chaque valeur posée doit pouvoir citer ses deux réponses.",
    src: [DECISIONS] },
  { id: "y15", name: "15", heading: "Les six invariants d'audit",
    statement: "Aucun enfant plus rond que son parent · aucune marge sous son coin · deux axes verticaux d'alignement par card, jamais trois · sœurs alignées au pixel · zéro débord à la largeur minimale · l'espace entre deux frères vaut leur marge.",
    why: "Six phrases vérifiables sur toute vue — les futures assertions du Gardien quand il mordra sur ce kit.",
    src: [DECISIONS] },
  { id: "y16", name: "16", heading: "Les coins ne suivent pas l'écran",
    statement: "Un coin est réglé par la racine du produit, pas par la largeur de l'écran : il ne glisse pas. Glissent les marges, les espaces, le texte et la cible — chacun sur son axe.",
    why: "Un coin qui change avec l'écran change la marque ; une marge qui change avec l'écran ajuste la respiration. Ce ne sont pas les mêmes décisions.",
    src: [DECISIONS] },
  { id: "y17", name: "17", heading: "La cible au doigt a un plancher",
    statement: "Un bouton, un champ, un sélecteur ont une hauteur de cible dérivée du registre ; les commandes secondaires — têtes d'outils, drawer — prennent la cible réduite. Rien ne descend sous le plancher absolu.",
    why: "Une commande trop petite se rate ; une commande trop grande dans une tête d'outil vole la place du contenu.",
    src: [DECISIONS, { t: "WCAG 2.5.8 — Target Size (Minimum)", h: "https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html" }] },
];

/* La correspondance des deux échelles — calculée en direct depuis le
   moteur, jamais recopiée : décimales pour le CSS natif, grille de 4
   pour Tailwind. */
function Mapping() {
  const names = Object.keys(J).filter((n) => /^(pad|gap|edge|page)-/.test(n));
  return (
    <div className="ry-scrolls">
      <table className="table mono">
        <thead><tr><th>token</th><th>à la charte (px)</th><th>calculé (px, {WIDTH_MIN} → {WIDTH_MAX})</th><th>Tailwind (grille de 4)</th><th>CSS</th></tr></thead>
        <tbody>
          {names.map((n) => {
            const t = J[n];
            return (
              <tr key={n}>
                <td>--{n}</td>
                <td>{px(t.base)}</td>
                <td>{px(t.bottom ?? t.base)} → {px(t.top ?? t.base)}</td>
                <td>{grid4(t.bottom ?? t.base)} → {grid4(t.top ?? t.base)}</td>
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
function Rules({ ids }: { ids: string[] }) {
  return (
    <div className="ry-rules">
      {ids.map((id) => RULES.find((r) => r.id === id)!).map((r) => (
        <div key={r.id} className="ry-rule">
          <b><span className="badge">règle {r.name}</span> {r.heading}</b>
          <span>{r.statement}</span>
          {r.div && <div className="divergence ry-small">{r.div}</div>}
          <span className="ry-small">Sources : {r.src.map((sc, i) => (
            <span key={sc.t}>{i > 0 && " · "}{sc.h === "#" ? sc.t : <a href={sc.h}>{sc.t}</a>}</span>
          ))}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Le registre à la densité du site (1er septembre) ──
   La densité change la BASE de la chaîne (16 · 24 · 32, décision 4) : les
   barres suivaient déjà, puisqu'elles consomment les tokens — mais les
   chiffres, eux, étaient figés sur la chaîne par défaut. Une légende qui
   annonce 24 pendant que le site est en compact décrit un site qu'on n'a
   pas sous les yeux. Les coins, eux, ne bougent pas avec la densité. */
function useFoundation(): Foundation {
  const { density } = useDensity();
  return useMemo(() => chain({ base: DENSITIES[density] }) as Foundation, [density]);
}

/* ── La réglette de la chaîne — quatre crans, dessinés À LEUR VRAIE
   LONGUEUR. Une phrase ne montre pas un rapport entre deux longueurs
   (verdict d’Auteur, 31 août) ; un escalier, si : d’un cran au suivant on
   divise par racine de deux, et ça se voit. Les valeurs sont lues dans le
   registre, jamais écrites. « Container » — le mot du trio arrêté le 1er septembre
   déjà employé dans les légendes d'Arrondis, et il se comprend sans avoir
   lu le vocabulaire. Survoler un espace de la scène allume son
   cran ; survoler un cran allume ses espaces. ── */
const STEPS: { step: number; token: string; read: (s: Foundation) => number; role: string }[] = [
  { step: 1, token: "--pad-1-block", read: (s) => s.pad[0], role: "la marge du container" },
  { step: 2, token: "--pad-2-block", read: (s) => s.pad[1], role: "la marge de la card" },
  { step: 3, token: "--gap-2-block", read: (s) => s.gap[1], role: "entre deux rows" },
  { step: 4, token: "--gap-3-inline", read: (s) => s.gap[2], role: "dans la row" },
];
export function Ruler() {
  const foundation = useFoundation();
  return (
    <ol className="ry-ruler" aria-label="La chaîne des distances de cette tranche, chaque cran à sa vraie longueur">
      {STEPS.map((c, i) => (
        <li key={c.step} className="ry-step" data-step={c.step}>
          <span className="ry-step-bar" style={{ width: `var(${c.token})` }} aria-hidden="true" />
          <b className="mono">{px(c.read(foundation))}</b>
          <span className="ry-step-role">{c.role}</span>
          {i < STEPS.length - 1 && <span className="ry-step-increment mono" aria-hidden="true">÷ √2</span>}
        </li>
      ))}
    </ol>
  );
}

/* ── Les scènes de l'étage « en bandes » — chacune porte UNE règle et sa
   casse. Toutes consomment le registre ; les valeurs cassées sont dites
   sur leur ligne, dans rythme.css. ── */

/* y1 · L'espace entre deux sœurs vaut leur marge — le même chiffre, et on
   le LIT : la marge de chaque card et l'écart qui les sépare sont rendus
   visibles, avec le code couleur de la page (rouge = marge, vert = espace)
   et leur cote. Au repos, deux fois le même nombre. */
/* Une seule étiquette par rôle : la première card nomme sa marge, l'écart
   se nomme lui-même. Trois étiquettes sur cette largeur se chevaucheraient. */
function CardSister({ name, role, named }: { name: string; role: string; named?: boolean }) {
  return (
    <div className="ry-fr-card">
      <E j="--pad-2-inline" h see name={named ? "la marge" : undefined} genre="pad" step={2} />
      <span className="ry-fr-says"><b>{name}</b><span className="muted ry-small">{role}</span></span>
      <E j="--pad-2-inline" h see genre="pad" step={2} />
    </div>
  );
}
function Siblings({ broken }: { broken: boolean }) {
  const s = useFoundation();
  const gap = broken ? s.gap[2] : s.gap[0];
  return (
    <div className="ry-fr">
      {/* Les bandes restent visibles : cette scène EST la comparaison de deux
          longueurs — les cacher jusqu'au survol reviendrait à ne rien montrer. */}
      <div className="ry-fr-container">
        {/* deux cards à demi-largeur : un prénom et un rôle courts, pour que rien ne passe à la ligne ni ne se coupe (retour d'Auteur, 9 septembre) */}
        <CardSister name="Léa" role="UX" named />
        <span className="space h seen gap" data-name={`l’écart ${px(gap)}`}
          data-step={2} data-intent={broken ? "statement" : undefined}
          style={{ width: `var(${broken ? "--gap-3-inline" : "--gap-1-inline"})` }} />
        <CardSister name="Marc" role="Dev" />
      </div>
    </div>
  );
}

/* y12 · Des rapports, jamais des soustractions — quatre crans dessinés à
   leur vraie longueur. Au repos ils descendent par racine de deux ; cassés,
   on retire le même nombre de pixels à chaque pas. */
const CHAIN = [FOUNDATION.pad[0], FOUNDATION.pad[1], FOUNDATION.pad[2], FOUNDATION.gap[2]];
const INDENT = 4; /* hors chaîne : le nombre de pixels retiré à chaque pas — c'est le geste qu'on éprouve, pas une distance du kit */
function Ratios({ broken }: { broken: boolean }) {
  const steps = broken ? CHAIN.map((_, i) => CHAIN[0] - i * INDENT) : CHAIN;
  return (
    <div className="ry-ratio" data-intent={broken ? "statement" : undefined}>
      <ol className="ry-ratio-steps">
        {steps.map((v, i) => (
          <li className="ry-ratio-step" key={i}>
            <span className="ry-ratio-bar" style={{ width: `${v}px` }} aria-hidden="true" />
            <b className="mono">{px(v)}</b>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* y9 · La géométrie d'espacement vit en rem. Ici la commande n'est pas une
   faute : c'est le GESTE de l'utilisateur — il agrandit le texte. Deux
   cards jumelles, l'une dont les marges sont des tokens, l'autre dont les
   marges sont gelées en pixels. Au repos elles se ressemblent ; agrandi,
   l'une respire et l'autre étouffe. */
const MARGIN_LASTS = 16; /* hors chaîne : la marge fautive de la démonstration — une valeur qu'on ne pose jamais */
function InRem({ hard, large, reset }: { hard: boolean; large: boolean; reset?: boolean }) {
  return (
    <div className={`ry-rem ${large ? "large" : ""} ${reset ? "reset" : ""}`}>
      <div className={`ry-rem-card ${hard ? "hard" : ""}`} data-intent={hard ? "statement" : undefined}>
        <span className="ry-rem-label mono">{hard ? `marge : ${MARGIN_LASTS} px` : "marge : var(--pad-2-block)"}</span>
        <b>Vos coordonnées</b>
        <span className="muted">Nom, adresse, téléphone.</span>
      </div>
    </div>
  );
}

/* y17 · La cible au doigt a un plancher. La jauge en pointillé est la
   hauteur due ; la commande doit la remplir. Cassée, on voit le vide entre
   la commande et sa jauge, et la légende dit les deux chiffres. */
const TARGET_BROKEN = 36; /* hors chaîne : la hauteur fautive de la démonstration — une valeur qu'on ne pose jamais */
const targetDue = () => { const due = J["control-height"]; return px(due.top ?? due.base); };
function Target({ broken }: { broken: boolean }) {
  return (
    <div className="ry-target" data-intent={broken ? "statement" : undefined}>
      <div className="ry-target-rank">
        {["Enregistrer", "Annuler", "Aide"].map((n) => (
          <span className="ry-target-gauge" key={n}>
            <button className="ry-target-btn" type="button" tabIndex={-1}>{n}</button>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── La profondeur — une vraie tranche de réglages, emboîtée sur trois
   niveaux, et à côté les TROIS ARCS dessinés à leur vraie taille : d'un
   niveau au suivant, le coin se plie en deux. C'est ce que la scène rend
   sensible — la chaîne, pas trois choix. La valeur cassée n'est pas écrite
   en dur : c'est le coin de la card, doublé. ── */
function Arc({ r, name, margin, wrong }: { r: number; name: string; margin: number; wrong?: boolean }) {
  const c = 52, m = 6; /* hors chaîne : la boîte du croquis et sa marge — un dessin, pas une distance du kit */
  return (
    <li className={`ry-pf-side ${wrong ? "wrong" : ""}`}>
      <svg viewBox={`0 0 ${c} ${c}`} aria-hidden="true">
        <path d={`M ${m} ${c - m} L ${m} ${m + r} A ${r} ${r} 0 0 1 ${m + r} ${m} L ${c - m} ${m}`}
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className="ry-pf-side-says">
        <b>{name}</b>
        <span className="mono">marge {px(margin)} · coin {px(r)}</span>
      </span>
    </li>
  );
}
/* La scène accepte un SOCLE : par défaut celui de la charte — la page
   Rythme ne change pas d'un pixel — et, quand on lui en passe un autre, elle
   pose sa géométrie en variables sur la scène elle-même. C'est ce qui permet
   à la page d'essai du moteur de faire tourner l'intervalle sur ce bloc sans
   le recopier, et sans qu'aucune valeur ne descende sur le document
   (2 septembre 2026). */
export function Depths({ broken, foundation }: { broken: boolean; foundation?: Foundation }) {
  const s = foundation ?? FOUNDATION;
  const r = s.r, p = s.pad;
  const rLine = broken ? r[1] * 2 : r[2];
  const vars = foundation ? ({
    "--pf-p1": `${s.pad[0]}px`, "--pf-p2": `${s.pad[1]}px`, "--pf-p3": `${s.pad[2]}px`,
    "--pf-g1": `${s.gap[0]}px`, "--pf-g2": `${s.gap[1]}px`, "--pf-g3": `${s.gap[2]}px`,
  } as CSSProperties) : undefined;
  return (
    <div className="ry-pf-scene" style={vars}>
      <div className="ry-pf">
        <div className="ry-pf-head">
          <b>Réglages</b>
          <span className="mono">Fili</span>
        </div>
        <div className="ry-pf-card">
          {([["Notifications", "Toutes"], ["Langue", "Français"], ["Thème", "Clair"]] as const).map(([n, v]) => (
            <div className="ry-pf-line" key={n} data-intent={broken ? "statement" : undefined}>
              <span>{n}</span><span className="mono muted">{v}</span>
            </div>
          ))}
          <button className="ry-pf-btn" type="button" tabIndex={-1}>Enregistrer</button>
        </div>
      </div>
      {/* Les cotes reposent directement sur la terre sombre : elles se déclarent
          en thème sombre pour prendre ses encres et son rouge (7 septembre). */}
      <ol className="ry-pf-sides" data-theme="dark" aria-label="Les trois coins, dessinés à leur vraie taille">
        <Arc r={r[0]} name="le container" margin={p[0]} />
        <Arc r={r[1]} name="la card" margin={p[1]} />
        <Arc r={rLine} name="la row" margin={p[2]} wrong={broken} />
      </ol>
    </div>
  );
}

/* ── La situation : une tranche d'application, et DEUX variables — la
   densité, et la largeur d'écran. La densité ne retouche aucune valeur :
   elle recalcule la base. La largeur, elle, fait glisser chaque cran entre
   ses deux bornes. La poignée de l'aperçu montre le second mouvement ; le
   damier est la part d'écran que la largeur simulée ne couvre pas.
   Toute la géométrie est LUE dans le moteur, pour cette base et cette
   largeur — aucune valeur n'est recopiée. ── */
type Key = "airy" | "comfortable" | "compact";
const DEMO: { key: Key; name: string; end: string }[] = [
  { key: "airy", name: "Aéré", end: "un cran au-dessus, partout" },
  { key: "comfortable", name: "Confortable", end: "trois profondeurs, un seul rapport" },
  { key: "compact", name: "Compact", end: "un cran en dessous ; coins et cibles n'ont pas bougé" },
];
const REGISTRIES = Object.fromEntries(DEMO.map((d) =>
  [d.key, tokens(chain({ base: DENSITIES[d.key] })) as unknown as Record<string, Token>],
)) as Record<Key, Record<string, Token>>;
/* Un token, à une largeur donnée : la même interpolation que le clamp
   généré dans tokens.css — bornée en bas et en haut. */
function aThereWidth(t: Token, W: number) {
  if (t.bottom === undefined || t.top === undefined) return t.base;
  const k = Math.min(1, Math.max(0, (W - WIDTH_MIN) / (WIDTH_MAX - WIDTH_MIN)));
  return t.bottom + (t.top - t.bottom) * k;
}
/* Les variables de la scène, définies ICI par la page (chaque nom porte le
   token qu'il rejoue à la largeur simulée) — la feuille les consomme. */
const STEPS_SD: Record<string, string> = {
  "--sd-p1": "pad-1-block", "--sd-p1i": "pad-1-inline",
  "--sd-p2": "pad-2-block", "--sd-p2i": "pad-2-inline",
  "--sd-p3": "pad-3-block", "--sd-p3i": "pad-3-inline",
  "--sd-g1": "gap-1-block", "--sd-g2": "gap-2-block", "--sd-g3": "gap-3-block",
  "--sd-g2i": "gap-2-inline", "--sd-g3i": "gap-3-inline",
};
function saysDensity(key: Key, W: number) {
  const r = REGISTRIES[key], d = DEMO.find((x) => x.key === key)!;
  const v = (n: string) => px(aThereWidth(r[n], W));
  return `${d.name.toLowerCase()}, à ${W} px — container ${v("pad-1-block")} · card ${v("pad-2-block")} · row ${v("pad-3-block")} px · ${d.end}`;
}
/* La mesure du cadre : hors chaîne, et dite. C'est la largeur d'écran que
   la démonstration simule au départ — le damier reprend le reste. */
const FRAME = 720;
export function SituationDensity() {
  const [d, setD] = useState<Key>("comfortable");
  const [wide, setWide] = useState(0);
  const vars = (W: number) => Object.fromEntries(
    Object.entries(STEPS_SD).map(([css, token]) => [css, `${aThereWidth(REGISTRIES[d][token], W)}px`]),
  ) as CSSProperties;
  return (
    <Preview
      ceiling={FRAME}
      onWidth={setWide}
      tools={<>
        <span className="mono muted">La densité :</span>
        {DEMO.map((x) => (
          <button key={x.key} className={`button ${d === x.key ? "on" : ""}`}
            aria-pressed={d === x.key} onClick={() => setD(x.key)}>{x.name}</button>
        ))}
      </>}
      children={(W) => (
        <div className="ry-sd" style={vars(W)} data-density={d}
          role="img" aria-label="Tranche d&apos;application : la fiche de Léa Fontan, dont chaque espace est un cran de la chaîne">
          <div className="ry-sd-head">
            <span className="ry-sd-name">Fili</span>
            <span className="ry-sd-meta mono">PROFIL</span>
          </div>
          <div className="ry-sd-card">
            <div className="ry-sd-id">
              <span className="ry-sd-circle" aria-hidden="true" />
              <span className="ry-sd-who">
                <b>Léa Fontan</b>
                <span>UX Designer — chaque distance de cette card est un token.</span>
              </span>
            </div>
            <div className="ry-sd-lines">
              {([["Cours suivis", "24"], ["Abonnés", "1 280"], ["Assiduité", "96 %"]] as const).map(([l, v]) => (
                <div className="ry-sd-line" key={l}><span>{l}</span><b>{v}</b></div>
              ))}
            </div>
          </div>
        </div>
      )}
      foot={<span className="gd-caption">{saysDensity(d, wide)}</span>}
    />
  );
}

/* ── Étage « en liste » — ce qu'aucune image ne prouve. Chaque ligne dit
   où elle se vérifie : dans le code (le Gardien la mordra), sur l'écran
   allumé (elle se constate au rendu), nulle part (décision d'Auteur). ── */
const LIST: LineList[] = [
  { name: "La chaîne se dérive, elle ne s'écrit pas",
    says: "Toute distance descend d'une base unique divisée par racine de deux à chaque profondeur, et la variation vit dans la définition du token — jamais dans une largeur d'écran. Aucune valeur d'espacement n'est écrite à la main.",
    or: "dans le code" },
  { name: "Le silence est un cran de la même chaîne",
    says: "La tête d'une section, la gouttière, le silence entre deux sections sont la chaîne continuée au-dessus du container. Le gabarit du site ne possède aucune valeur à lui.",
    or: "dans le code" },
  { name: "La densité change la base, jamais la structure",
    says: "Compact, confortable, aéré remplacent la base et recalculent toute la chaîne. L'ordre des emplacements, la présence des éléments et le nombre de colonnes restent identiques.",
    or: "sur l'écran allumé", tone: "render" },
  { name: "Zéro débord à la largeur minimale",
    says: "Aucun débordement horizontal au plus petit écran déclaré ; deux axes verticaux d'alignement par card, jamais trois ; sœurs alignées au pixel.",
    or: "sur l'écran allumé", tone: "render" },
  { name: "Une marge, un espace, un coin — à sa profondeur, sur son axe",
    says: "Deux distances de même valeur peuvent faire deux métiers. Le kit n'a que trois mots — la marge qui encadre, l'espace qui sépare, le coin qui arrondit — et deux questions pour les poser : à quelle profondeur, sur quel axe. La règle parle du métier, jamais du pixel.",
    or: "dans le code" },
  { name: "Quatre décisions, et rien d'autre, entrent dans le moteur",
    says: "La base, l'intervalle, la racine des coins, l'intervalle des titres : tout le reste en sort. Les crans naissent d'un diviseur appliqué en chaîne, jamais d'une différence fixe — l'œil lit les rapports, pas les écarts.",
    or: "dans le code" },
  { name: "Quatre axes glissent, les coins non",
    says: "L'horizontal, le vertical, le texte et la cible glissent chacun entre deux bornes de l'écran étroit au large. Les coins sont réglés par la racine du produit : ils ne glissent pas.",
    or: "sur l'écran allumé", tone: "render" },
  { name: "Les titres montent du même pas que les espaces",
    says: "Le corps ne descend jamais sous son plancher ; chaque cran de titre vaut le précédent multiplié par le même intervalle. Une seule dérivation, pas deux échelles qui finiraient par se contredire.",
    or: "dans le code" },
  { name: "L'interligne suit la lisibilité, pas la grille",
    says: "Aucun interligne n'est recalé sur la chaîne sans une décision explicite et datée : la grille stricte des livres suppose des corps fixes, la lecture prime.",
    or: "nulle part — décision d'Auteur", tone: "author" },
];

/* ── Étage « dans le code » — les valeurs sont LUES dans le registre
   calculé, jamais recopiées : si la chaîne bouge, ce tableau bouge. ── */
const CODE: LineCode[] = [
  { rule: "La marge d'un container",
    written: <><span className="cs-kw">padding</span>: <span className="cs-var">var(--pad-1-block) var(--pad-1-inline)</span></>,
    product: px(FOUNDATION.pad[0]) + " px", note: "la base du produit — elle glisse avec l'écran, sur son axe" },
  { rule: "La marge d'une card",
    written: <><span className="cs-kw">padding</span>: <span className="cs-var">var(--pad-2-block) var(--pad-2-inline)</span></>,
    product: px(FOUNDATION.pad[1]) + " px", note: "la base divisée par racine de deux" },
  { rule: "Entre deux cards",
    written: <><span className="cs-kw">gap</span>: <span className="cs-var">var(--gap-1-block)</span></>,
    product: px(FOUNDATION.gap[0]) + " px", note: "l'espace entre deux frères vaut leur marge — c'est le même chiffre" },
  { rule: "Entre deux rows d'une card",
    written: <><span className="cs-kw">gap</span>: <span className="cs-var">var(--gap-2-block)</span></>,
    product: px(FOUNDATION.gap[1]) + " px", note: "un cran plus bas — la marge de la row" },
  { rule: "Dans la row",
    written: <><span className="cs-kw">gap</span>: <span className="cs-var">var(--gap-3-inline)</span></>,
    product: px(FOUNDATION.gap[2]) + " px", note: "une icône et son texte, deux boutons côte à côte" },
  { rule: "Au plus serré", fallback: true,
    written: <><span className="cs-kw">gap</span>: <span className="cs-var">var(--gap-4-block)</span></>,
    product: px(FOUNDATION.gap[3]) + " px", note: "un chiffre et son libellé, le dedans d'un badge" },
  { rule: "Le silence entre deux sections", fallback: true,
    written: <><span className="cs-kw">padding-top</span>: <span className="cs-var">var(--doc-silence)</span></>,
    product: "un cran de page", note: "la même chaîne, continuée au-dessus du container" },
  { rule: "La densité", fallback: true,
    written: <><span className="cs-kw">data-density</span>=<span className="cs-var">&quot;compact&quot;</span></>,
    product: "toute la chaîne se recalcule", note: "une autre base, pas un multiplicateur" },
  { rule: "La cible au doigt", fallback: true,
    written: <><span className="cs-kw">min-height</span>: <span className="cs-var">var(--control-height)</span></>,
    product: "la cible pleine", note: "dérivée du registre, jamais sous le plancher de la norme" },
  { rule: "Le cran d'un titre", fallback: true,
    written: <><span className="cs-kw">font-size</span>: <span className="cs-var">var(--font-size-h2)</span></>,
    product: "le cran précédent × l'intervalle", note: "la même dérivation que les espaces" },
];

/* ── Le sommaire de la page — le rail vit dans rail.tsx (partagé) ── */
/* ── LES COMMANDES ET LA HIÉRARCHIE (versées de la page d'essai le
      2 septembre 2026) ─────────────────────────────────────────────
   La page d'essai a fait son travail : ce qu'elle a mis au point vit
   maintenant ici, avec la page qu'il sert. Elle, en retour, l'importe —
   elle ne garde pas de copie. ── */
/* Les molettes des sections. Chaque nombre du moteur se règle à UN endroit
   du site — sauf la base, qui se tourne à deux : sur une card (section 02)
   et sur une page (section 03). C'est le même nombre à deux échelles
   d'observation, pas deux commandes. L'intervalle, lui, ne se tourne que
   dans le scénario : sur une page entière il se lit comme un défaut, parce
   qu'il fait bouger les niveaux en sens inverse. */
export function Wheel({ id, label, min, max, increment, value, onValue, says }: {
  id: string; label: string; min: number; max: number; increment: number;
  value: number; onValue: (v: number) => void; says: string;
}) {
  return (
    <span className="mo-wheel">
      <label htmlFor={id}>{label}</label>
      <input type="range" id={id} min={min} max={max} step={increment} value={value}
        onChange={(e) => onValue(+e.target.value)} />
      <output htmlFor={id} className="mono">{says}</output>
    </span>
  );
}

/* ── LA HIÉRARCHIE (2 septembre 2026) ─────────────────────────────────
   La scène de la section 05. Elle remplace un couple titre + texte, qui ne
   montrait qu'un seul cran : à ce compte-là, le curseur « ne fait que
   grossir le texte » (verdict d'Auteur). Or ce nombre ne règle pas une
   taille, il règle un CONTRASTE — l'écart entre tous les niveaux à la fois.
   Il faut donc une hiérarchie entière pour le voir.
   Le corps ne bouge pas : c'est son plancher, et c'est le point fixe autour
   duquel tout se règle. Les crans en dessous de lui (la légende, l'étiquette)
   ne sont pas montrés ici — ils descendent quand les titres montent, ce qui
   est vrai mais brouillerait la démonstration ; la page Typographie est
   leur endroit.
   Le verdict est LU sur les nombres rendus, jamais décrété. ── */
export function Hierarchy({ foundation, ratio }: { foundation: Foundation; ratio: number }) {
  const t = foundation.text;
  const r = fr2(ratio);
  const lines = [
    { name: "la taille du titre de page", v: t.h1, calc: `16 × ${r}³`, txt: "Le rythme d'une page" },
    { name: "la taille du titre de section", v: t.h2, calc: `16 × ${r}²`, txt: "Ce qui sépare deux niveaux" },
    { name: "la taille du sous-titre", v: t.h3, calc: `16 × ${r}`, txt: "Et ce qui les rapproche" },
    { name: "la taille du corps", v: t.body, calc: "son plancher", fixed: true,
      txt: "Le corps ne bouge pas : seize pixels, quoi qu'il arrive. C'est le point fixe autour duquel toute la hiérarchie se règle." },
  ];
  const contrast = t.h3 / t.body;
  const shout = t.h1 / t.body;
  const verdict = contrast < 1.16
    ? { word: "Trop serré", says: "le sous-titre ne se distingue plus de son texte : plus rien ne se hiérarchise.", tone: "ko" }
    : shout > 3
      ? { word: "Trop large", says: "le titre crie, et le corps a l'air d'une note de bas de page.", tone: "ko" }
      : { word: "Ça tient", says: "chaque niveau se détache du suivant sans écraser le corps.", tone: "ok" };
  return (
    <div className="hier">
      <div className="hier-sheet">
        {lines.map((l) => (
          /* La cote est collée À SA LIGNE, avec le calcul qui la produit :
             en colonne à part, elle ne se rattachait à rien et ne voulait
             rien dire (verdict d'Auteur, 2 septembre). */
          <div key={l.name} className={`hier-line ${l.fixed ? "fixed" : ""}`}>
            <span className="hier-side">
              <b className="mono">{fr(l.v)} px</b>
              <em className="mono">{l.calc}</em>
              <i>{l.name}</i>
            </span>
            {/* La taille d'un texte EST une hauteur : on la mesure sur lui,
                comme le kit mesure un espace — deux repères et un trait
                (verdict d'Auteur, 2 septembre). Un nombre dans une colonne
                à côté ne se rattachait à rien. */}
            <span className="hier-measure" aria-hidden="true"
              style={{ height: `${Math.round(l.v * 10) / 10}px` }} />
            <p className={l.fixed ? "hier-body" : "hier-heading"}
              style={{ fontSize: `${Math.round(l.v * 10) / 10}px` }}>{l.txt}</p>
          </div>
        ))}
      </div>
      <p className={`hier-verdict ${verdict.tone}`}>
        <b>{verdict.word}</b> <span>{verdict.says}</span>
      </p>
    </div>
  );
}

const TOC: Toc = [
  ["engine", "01", "Le moteur"],
  ["scale", "02", "La descente"],
  ["density", "03", "La densité"],
  ["headings", "04", "L'intervalle des titres"],
  ["registry", "05", "Le registre"],
  ["code", "06", "Le code"],
];
export default function View() {
  const [brokenDepth, setBrokenDepth] = useState(false);
  /* y9 · le texte est agrandi D'ENTRÉE : au repos chaque côté montre ce que son
     verdict dit. L'action REJOUE le geste : les deux cards reviennent au corps ×1
     d'un coup (sans transition), le temps de voir qu'elles se ressemblent, puis
     le texte grandit au cran du dépliant. */
  const site = useFoundation(); /* les légendes disent le registre à la densité du site */
  const [largeText, setLargeText] = useState(true);
  const [resetText, setResetText] = useState(false);
  const replayLarge = () => {
    setResetText(true); setLargeText(false);
    window.setTimeout(() => { setResetText(false); requestAnimationFrame(() => requestAnimationFrame(() => setLargeText(true))); }, 600); /* hors chaîne : la pause du rejeu, le temps d'une lecture */
  };
  /* L'intervalle des titres : le quatrième nombre du moteur. Versé de la
     page d'essai le 2 septembre. */
  const [headings, setHeadings] = useState<number>(CHARTER.intervalHeadings);
  const foundationHeadings = chain({ intervalHeadings: headings }) as Foundation;
  const activeId = useDocSections("engine");

  return (
    <div className="gdoc-background ry">
      <div className="gdoc">
        <RailDoc page="rythme" heading="Fondation · Rythme" toc={TOC} activeId={activeId} foot="Une chaîne · quatre axes" />

        <main className="gdoc-content" id="content">

          <section className="gdoc-hero">
            <p className="kicker">Le rythme (espacement)</p>
            <h1>Rien ici n&apos;a été espacé à l&apos;œil<span className="point" aria-hidden="true" /></h1>
            <p className="lede">
              Deux cards côte à côte : si le texte de l&apos;une se retrouve plus près du bord de
              l&apos;autre que du sien, l&apos;œil le rattache à la mauvaise card — sans savoir
              dire pourquoi la page gêne. C&apos;est tout le travail de l&apos;espace : dire qui va avec
              qui.
            </p>
          </section>

          {/* ── 01 · LE MOTEUR ────────────────────────────────────────────
              Versé de la page d'essai le 2 septembre 2026. Douze slides, une
              seule fiche montée une fois, un compteur de décisions pour
              enjeu. Il ouvre la page parce qu'il répond à la question que
              tout le reste suppose réglée : combien de décisions faut-il
              pour composer une card, et pourquoi quatre suffisent. ── */}
          <section className="gdoc-sec set" id="engine">
            <div className="gdoc-sec-head">
              <p className="kicker">01 · Le moteur</p>
              <h2>Comment le moteur décide à notre place</h2>
            </div>
            <div className="gdoc-body">
              <Scenario />
            </div>
          </section>

          {/* ── 02 · LA DESCENTE — la chaîne et la profondeur, fondues le
              8 septembre 2026 : c'est le même phénomène. La marge et le coin
              descendent ensemble du container à la card puis à la row ; la
              tranche le montre sur une application réelle, le schéma des
              trois étages le montre nu, et se casse. ── */}
          <section className="gdoc-sec set" id="scale">
            <div className="gdoc-sec-head">
              <p className="kicker">02 · La descente</p>
              <h2>Du bord de l&apos;écran au moindre bouton, la marge et le coin descendent ensemble</h2>
              <p className="muted">
                Une équipe qui décide ses marges écran par écran finit par se contredire — pas par
                négligence : personne ne se souvient de ce qui a été tranché trois mois plus tôt. Ici,
                chaque espace descend de la même chaîne, du container à la card puis à la row, et glisse
                avec la largeur de l&apos;écran. Le coin suit la marge à chaque étage — la marge divisée
                par racine de deux, le coin par deux — parce qu&apos;une fenêtre, une card et une row sont
                trois occasions de se contredire quand on les règle chacune dans son coin.
              </p>
            </div>
            <div className="gdoc-body">
              <figure className="gd-figure ry-proof-slice">
                {/* Plus de bouton : les espaces se révèlent au survol de la
                    tranche (ou au clavier), et s'effacent en la quittant. */}
                <div className="bench primary hovered-spaces">
                  <SliceFili see />
                </div>
                {/* La réglette est une LÉGENDE : elle se lit sous la scène,
                    à l'horizontale, dans l'encre de la page — pas une
                    colonne posée dans le banc (verdict d'Auteur, 31 août). */}
                <Ruler />
                <figcaption className="gd-caption">
                  Plus on entre profond dans la card, plus les marges et les coins se resserrent — sans que personne ait eu à le décider niveau par niveau. Et entre deux voisines, l&apos;espace vaut exactement leur marge.
                </figcaption>
              </figure>
              <div className="rank">
                <button className={`button broken ${brokenDepth ? "on" : ""}`} onClick={() => setBrokenDepth(!brokenDepth)}>
                  {brokenDepth ? "Réparer" : "Casser : l'enfant plus rond"}
                </button>
              </div>
              <figure className="gd-figure" id="depth">
                {/* La terre sombre, comme la gazette de Typo : un panneau se lit
                      comme un objet posé quand ce qui l'entoure n'est pas, lui aussi,
                      du papier. Variante déjà déclarée du banc. Le panneau garde
                      son papier clair ; ce qui repose directement sur la terre — la
                      colonne des cotes — se déclare en thème sombre (verdict
                      d'Auteur, 7 septembre) : ses encres et le rouge de la faute
                      viennent du système, pas d'un token propre à la terre de code. */}
                <div className="bench dark">
                  <Depths broken={brokenDepth} />
                </div>
                <figcaption className="gd-caption">{brokenDepth
                  ? "la row est devenue plus ronde que la card qui la contient — l'emboîtement ne se lit plus"
                  : "la marge se divise par racine de deux, le coin par deux — et les trois étages tiennent"}</figcaption>
              </figure>
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <p>Quatre décisions entrent dans <b>le moteur</b> — la base, l&apos;intervalle, la racine des coins, l&apos;intervalle des titres — et toute la géométrie en sort, sur quatre axes : l&apos;horizontal, le vertical, le texte et la cible. Aucune valeur n&apos;est écrite à la main. La tranche, elle, emboîte ses fonds en cascade : le container, la card, la row, avec des marges et des coins qui se resserrent à chaque étage — l&apos;emboîtement est relevé sur une application en production.</p>
                <Rules ids={["y8", "y9", "y3", "y7", "y17", "y4", "y10", "y16", "y15"]} />
              </div></details>
            </div>
          </section>

          <section className="gdoc-sec set" id="density">
            <div className="gdoc-sec-head">
              <p className="kicker">03 · La densité</p>
              <h2>Serrée, la page respire autrement — elle n&apos;invente rien</h2>
              <p className="muted">
                On ne regarde pas de la même façon un tableau de bord qu&apos;on scrute toute la journée et
                une fiche qu&apos;on ouvre trois secondes. D&apos;où deux réglages, et deux seulement. La
                <b>densité</b> repose la base, et toute la chaîne suit d&apos;un cran. La <b>largeur
                d&apos;écran</b> fait glisser chaque cran entre ses bornes, sans palier. Ne bougent jamais : les coins, les cibles et la hiérarchie.
              </p>
            </div>
            <div className="gdoc-body">
              <SituationDensity />
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <p>Un « mode compact à 80 % » a l&apos;air commode, et fabrique des valeurs que personne ne retrouvera le jour où la marque change. Reposer la base, au contraire, garde tout le monde dans le système : chaque distance sait encore d&apos;où elle vient. Et la densité règle le contenu, jamais le châssis — le rail, la gouttière et les marges de page ne bougent pas.</p>
                <Rules ids={["y5", "y6"]} />
              </div></details>
            </div>
          </section>

          {/* ── 05 · L'INTERVALLE DES TITRES ─────────────────────────────
              Le quatrième nombre du moteur, versé de la page d'essai. Il ne
              règle pas une taille mais un CONTRASTE — l'écart entre tous les
              niveaux à la fois — et il faut une hiérarchie entière pour le
              voir : un couple titre + texte ne montre qu'un cran, et le
              curseur y « ne fait que grossir le texte ». ── */}
          <section className="gdoc-sec set" id="headings">
            <div className="gdoc-sec-head">
              <p className="kicker">04 · L&apos;intervalle des titres</p>
              <h2>Ce nombre ne règle pas une taille, il règle un contraste</h2>
              <p className="muted">
                C&apos;est la décision qu&apos;on oublie de compter, et pourtant elle est dans le moteur comme
                les trois autres. Elle ne grossit pas un titre : elle écarte tous les niveaux d&apos;un seul
                geste. Le corps, lui, ne bouge pas d&apos;un pixel — c&apos;est le point fixe autour duquel tout
                se règle. Aux deux bouts du nombre, la hiérarchie a deux façons de casser : trop plate, plus rien ne se distingue ; trop ouverte, le titre écrase son texte.
              </p>
            </div>
            <div className="gdoc-body">
              <div className="rank">
                <Wheel id="ry-tit" label="Le titre plus ou moins haut"
                  min={BOUNDS.intervalHeadings[0]} max={BOUNDS.intervalHeadings[1]} increment={0.01}
                  value={headings} onValue={setHeadings} says={fr2(headings)} />
              </div>
              <div className="bench veil">
                <Hierarchy foundation={foundationHeadings} ratio={headings} />
              </div>
              <span className="gd-caption">
                {`quatre tailles de texte, un seul nombre — chaque cran vaut le précédent × ${fr2(headings)}, et le corps ne bouge pas`}
              </span>
            </div>
          </section>

          {/* ═══ LE RÉPERTOIRE — une seule section, au rythme (8 sept. 2026) :
              dans l'ordre commun aux six pages (verdict d'Auteur, 8 sept.) : ce qui
              se casse (#bands), les règles en liste (#list), les valeurs et le code
              (#code, avec la correspondance token par token). ═══ */}
          <section className="gdoc-sec set" id="registry">
            <div className="gdoc-sec-head">
              <p className="kicker">05 · Le registre</p>
              <h2>Un seul registre, site compris</h2>
              <p className="muted">
                Six règles de proximité qui se cassent sous les yeux ; celles qui ne se
                photographient pas ; et les valeurs que la chaîne produit, token par token. Les lignes
                marquées « décision d&apos;Auteur » sont des réglages du kit, pas des lois de la perception.
              </p>
            </div>
            <div className="gdoc-body">
              <div className="doc-piece" id="bands">
                <div className="doc-piece-head">
                  <h3>Six règles de proximité, et leur faute</h3>
                  <p className="muted">Chaque faute se commet pour de vrai sur sa scène, puis se
                  répare. C&apos;est en voyant la version fausse qu&apos;on comprend à quoi sert la juste.</p>
                </div>
              <Bands>
                <Band level={4} name="L&apos;espace entre deux sœurs vaut leur marge" side="le même chiffre" bare
                  says="Le dedans et le dehors d&apos;une surface se règlent ensemble, pas chacun de son côté. Un texte plus proche du bord de sa voisine que du sien a l&apos;air d&apos;appartenir à la voisine — et l&apos;œil s&apos;y laisse prendre à chaque fois."
                  rules={<Rules ids={["y1", "y15"]} />}>
                  <Demo situation="Deux cards voisines dans le même container">
                    <DemoSides>
                      <DemoSide ok={false} verdict="L'écart dépasse la marge : chaque texte penche vers sa voisine"><Siblings broken /></DemoSide>
                      <DemoSide ok verdict="L'écart vaut la marge, au même pixel"><Siblings broken={false} /></DemoSide>
                    </DemoSides>
                  </Demo>
                </Band>
                <Band level={4} name="Le libellé qui flotte" side="autant d&apos;un côté que de l&apos;autre" bare
                  says="Un libellé posé aussi loin de son champ que du paragraphe du dessus n&apos;appartient plus à personne. On croit lire l&apos;étiquette du champ suivant — c&apos;est la faute la plus courante des formulaires."
                  rules={<Rules ids={["y1"]} />}>
                  <Demo situation="Un libellé, entre un paragraphe et son champ">
                    <DemoSides>
                      <DemoSide ok={false} verdict="Aussi loin de son champ que du paragraphe : il n'appartient à personne"><ProximityLabel broken /></DemoSide>
                      <DemoSide ok verdict="Plus près de son champ que de ce qui précède"><ProximityLabel broken={false} /></DemoSide>
                    </DemoSides>
                  </Demo>
                </Band>
                <Band level={4} name="Le titre qui change de camp" side="au-dessus &gt; au-dessous" bare
                  says="L&apos;espace au-dessus d&apos;un titre dépasse celui du dessous d&apos;au moins un cran. À égalité, le titre ferme le paragraphe précédent au lieu d&apos;ouvrir sa section — et le lecteur cherche un instant où commence la suite."
                  rules={<Rules ids={["y2"]} />}>
                  <Demo situation="Un titre de section, entre deux paragraphes">
                    <DemoSides>
                      <DemoSide ok={false} verdict="Le même écart des deux côtés : le titre ferme le paragraphe d'avant"><ProximityHeading broken /></DemoSide>
                      <DemoSide ok verdict="Un cran de plus au-dessus : le titre ouvre sa section"><ProximityHeading broken={false} /></DemoSide>
                    </DemoSides>
                  </Demo>
                </Band>
                <Band level={4} name="Des rapports, jamais des soustractions" side="÷ √2 à chaque pas" bare
                  says="Le même nombre de pixels retiré à chaque cran donne des longueurs presque jumelles, que personne ne distingue. Une division à chaque cran, et les mêmes longueurs se lisent d&apos;un coup d&apos;œil. L&apos;œil compare, il ne compte pas."
                  rules={<Rules ids={["y12", "y3"]} />}>
                  <Demo situation="Quatre crans d'espacement, du plus grand au plus petit">
                    <DemoSides>
                      <DemoSide ok={false} verdict={`${INDENT} px de moins à chaque pas : quatre longueurs presque jumelles`}><Ratios broken /></DemoSide>
                      <DemoSide ok verdict="÷ √2 à chaque pas : quatre longueurs qu'on distingue d'un coup d'œil"><Ratios broken={false} /></DemoSide>
                    </DemoSides>
                  </Demo>
                </Band>
                <Band level={4} name="La géométrie vit en rem" side="la même card, deux marges" bare
                  says="Un lecteur agrandit le texte : les espaces autour doivent grandir avec lui. Une marge figée en pixels, elle, reste où elle est — et la page se referme sur son contenu au premier réglage d&apos;accessibilité."
                  rules={<Rules ids={["y9", "y8"]} />}>
                  <Demo situation="Un lecteur agrandit le texte de moitié"
                    action={{ label: "Agrandir le texte", onClick: replayLarge }}
                    caption={`la marge en tokens : ${px(site.pad[1])} px au repos, ${px(site.pad[1] * 1.5)} px texte agrandi · la marge en pixels : ${MARGIN_LASTS} px dans les deux cas`}>
                    <DemoSides>
                      <DemoSide ok={false} verdict="La marge gelée en pixels reste où elle est : le contenu touche le bord"><InRem hard large={largeText} reset={resetText} /></DemoSide>
                      <DemoSide ok verdict="La marge en rem grandit avec le texte"><InRem hard={false} large={largeText} reset={resetText} /></DemoSide>
                    </DemoSides>
                  </Demo>
                </Band>
                <Band level={4} name="La cible au doigt a un plancher" side="rien ne descend dessous" bare
                  says="Un bouton, un champ, un sélecteur ont une hauteur de cible dérivée du registre. Une commande trop petite se rate au doigt, et aucune décision de mise en page ne passe avant ça."
                  rules={<Rules ids={["y17"]} />}>
                  <Demo situation="Trois commandes, touchées au doigt"
                    caption={`la jauge en pointillé : ${targetDue()} px, la hauteur due · la commande : ${TARGET_BROKEN} px à gauche, ${targetDue()} px à droite`}>
                    <DemoSides>
                      <DemoSide ok={false} verdict="La commande ne remplit pas sa jauge : elle se rate au doigt"><Target broken /></DemoSide>
                      <DemoSide ok verdict="La commande remplit exactement la hauteur due"><Target broken={false} /></DemoSide>
                    </DemoSides>
                  </Demo>
                </Band>
              </Bands>
              </div>

              <div className="doc-piece" id="list">
                <div className="doc-piece-head">
                  <h3>Les autres règles</h3>
                  <p className="muted">Elles se vérifient dans le code, sur l&apos;écran allumé, ou
                  nulle part — et alors elles s&apos;assument comme un choix, daté.</p>
                </div>
                <ListRules lines={LIST} />
                <details className="prov"><summary>Règles &amp; sources</summary><div>
                  <Rules ids={["y3", "y13", "y8", "y9", "y7", "y4"]} />
                </div></details>
              </div>
            </div>
          </section>

          {/* ═══ LE CODE — une section à part, après le registre (verdict d'Auteur,
              9 septembre : « le code doit être une section à part, sur toutes
              les pages ») : ce qu'on écrit, ce que ça produit, lu au moteur. ═══ */}
          <section className="gdoc-sec set" id="code">
            <div className="gdoc-sec-head">
              <p className="kicker">06 · Le code</p>
              <h2>Les tokens, et leur correspondance</h2>
              <p className="muted">Chaque valeur est lue dans le registre du moment, jamais recopiée.
                  Deux échelles, assumées : le CSS natif garde les décimales calculées ; Tailwind
                  s&apos;accroche à sa grille de 4, arrondie, sans décimale. On ne mélange pas les deux.</p>
            </div>
            <div className="gdoc-body">
              <PanelRegistry lines={CODE} />
              <details className="prov"><summary>La correspondance, token par token</summary><div>
                <Mapping />
              </div></details>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
