"use client";
import Scenario from "./scenario";
import { Fragment, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Bandes, Bande, ListeRegles, PanneauRegistre } from "../etages";
import type { LigneListe, LigneCode } from "../etages";
import { useDensite } from "../densite";
import { RailDoc, useDocSections, type Sommaire } from "../rail";
import { Apercu } from "../apercu";
import { chaine, jetons, DENSITES, CHARTE, BORNES, LARGEUR_MIN, LARGEUR_MAX } from "../../derivation.mjs";

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
type Jeton = { axe: string | null; base: number; bas?: number; haut?: number; gel?: number; css: string };
type Socle = ReturnType<typeof chaine>;
const SOCLE: Socle = chaine();
/* Le moteur écrit ses jetons nom par nom : on le lit comme un registre. */
const J = jetons(SOCLE) as unknown as Record<string, Jeton>;
/* Les nombres s'écrivent à la française dans les légendes, un chiffre après la virgule. */
const px = (v: number) => String(Math.round(v * 10) / 10).replace(".", ",");
/* Les mêmes arrondis, sous les noms que la page d'essai leur donnait — le
   code versé le 2 septembre les emploie tels quels. */
const fr = px;
const fr2 = (v: number) => String(Math.round(v * 100) / 100).replace(".", ",");
/* L'accrochage Tailwind : la grille de 4, comme tokens.tailwind.mjs. */
const grille4 = (v: number) => Math.round(v / 4) * 4;

/* Un espace rendu visible : c'est un VRAI espace de la tranche (il porte le
   jeton), pas une illustration — l'interrupteur ne fait que le colorer.
   L'étiquette ne se pose QUE là où on la passe : une par jeton, dans
   l'espace qu'elle nomme — pas une par bloc (lisibilité, 24 août). */
function E({ j, h, voir, nom, genre, cran }: { j: string; h?: boolean; voir: boolean; nom?: string; genre: "pad" | "gap"; cran?: number }) {
  /* Le code couleur des espaces (décision d'Auteur, 24 août) :
     danger = les marges (padding), success = les espaces (gap/margin).
     La convention des inspecteurs, portée par nos jetons sémantiques. */
  return <span className={`espace ${h ? "h" : ""} ${voir ? "vu" : ""} ${genre}`}
    data-nom={voir && nom ? nom : undefined} data-cran={cran}
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
export function TrancheFili({ voir, menu = true }:
  { voir: boolean; menu?: boolean }) {
  const margeBloc = "--pad-2-block";
  const margeLigne = "--pad-2-inline";
  const entreLignes = "--gap-2-block";
  const dansLaLigne = "--gap-3-inline";
  return (
    <div className="tranche" role="img" aria-label="Tranche d'application : profil de Léa Fontan, chaque distance posée sur la chaîne du kit">
      {/* Le container n'a pas de bloc d'espace à lui : sa marge EST son
          rembourrage. On la trace donc par quatre bandes posées à même son
          bord, à l'épaisseur exacte du jeton. Ce sont de vraies cibles :
          ce cran se nomme et s'allume comme les trois autres (31 août). */}
      <span className="ry-marge1" aria-hidden="true">
        <span className={`espace ${voir ? "vu" : ""} pad haut`} data-cran={1} data-nom={voir ? "marge · container" : undefined} />
        <span className={`espace ${voir ? "vu" : ""} pad bas`} data-cran={1} />
        <span className={`espace ${voir ? "vu" : ""} pad gauche`} data-cran={1} />
        <span className={`espace ${voir ? "vu" : ""} pad droite`} data-cran={1} />
      </span>
      {menu && <div className="tr-nav">
        <div className="tr-marque">
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
      <div className="tr-carte">
        <E j={margeLigne} h voir={voir} genre="pad" cran={2} />
        <div className="tr-carte-corps">
          {/* L’étiquette NOMME, elle n’explique pas : une phrase dans une
              bande de douze pixels ne peut pas montrer un rapport entre deux
              longueurs (verdict d’Auteur, 31 août). Le rapport se voit à côté,
              sur la réglette : chaque espace porte son CRAN, et survoler l’un
              allume l’autre. */}
          <E j={margeBloc} voir={voir} nom="marge · card" genre="pad" cran={2} />
          <span className="tr-id">
            <span className="tr-avatar" aria-hidden="true">LF</span>
            <span className="ry-min0">
              <span className="tr-nom">Léa Fontan</span>
              <span className="tr-role">UX Designer — chaque distance de cette card est un jeton de la chaîne.</span>
            </span>
          </span>
          <E j={entreLignes} voir={voir} nom="espace · entre deux rows" genre="gap" cran={3} />
          <span className="ry-flex">
            <button className="tr-btn premier" type="button" tabIndex={-1}>Suivre</button>
            <E j={dansLaLigne} h voir={voir} nom="espace · dans la row" genre="gap" cran={4} />
            <button className="tr-btn" type="button" tabIndex={-1}>Message</button>
          </span>
          <E j={entreLignes} voir={voir} genre="gap" cran={3} />
          <span className="ry-flex ry-large">
            <span className="tr-sub"><b>24</b><span>cours suivis</span></span>
            <E j={dansLaLigne} h voir={voir} genre="gap" cran={4} />
            <span className="tr-sub"><b>1&nbsp;280</b><span>abonnés</span></span>
            <E j={dansLaLigne} h voir={voir} genre="gap" cran={4} />
            <span className="tr-sub"><b>96&nbsp;%</b><span>assiduité</span></span>
          </span>
          <E j={margeBloc} voir={voir} genre="pad" cran={2} />
        </div>
        <E j={margeLigne} h voir={voir} genre="pad" cran={2} />
      </div>
    </div>
  );
}

/* Les distances de la card sont des blocs d'espace explicites : quand une
   casse est active, l'écart menteur se matérialise en rouge, étiquette
   dedans (décision d'Auteur, 24 août — on voit l'erreur, on ne la devine
   plus). Au repos, les espaces sont invisibles : ils espacent, c'est tout. */
function Esp({ j, faute, nom }: { j: string; faute?: boolean; nom?: string }) {
  return <span className={`espace ${faute ? "ko" : ""}`} data-nom={faute ? nom : undefined}
    data-intent={faute ? "statement" : undefined} style={{ height: `var(${j})` }} />;
}
/* Deux fautes, deux fiches : elles ne se cassent plus ensemble (gabarit
   des étages, 1er septembre). Le juste : au-dessus d'un titre, l'espace
   entre deux cards ; sous le titre, l'espace d'un titre à sa phrase ;
   d'un libellé à son champ, le même. */
function ProximiteLibelle({ casse }: { casse: boolean }) {
  return (
    <div className="ry-prox-carte">
      <p className="sourd">Un paragraphe qui précède.</p>
      <Esp j="--gap-1-block" faute={casse} nom="aussi loin de ce qui précède…" />
      <label className="mono ry-bloc">Adresse e-mail</label>
      <Esp j={casse ? "--gap-1-block" : "--gap-3-block"} faute={casse} nom="…que de son champ" />
      <span className="champ-boite"><input readOnly value="prenom@exemple.fr" className="ry-champ" /></span>
    </div>
  );
}
function ProximiteTitre({ casse }: { casse: boolean }) {
  return (
    <div className="ry-prox-carte">
      <p className="sourd">Un paragraphe qui précède la section.</p>
      <Esp j={casse ? "--gap-2-block" : "--gap-1-block"} faute={casse} nom="le même écart au-dessus…" />
      <h3 className="ry-h3">Vos coordonnées</h3>
      <Esp j={casse ? "--gap-2-block" : "--gap-3-block"} faute={casse} nom="…qu&apos;au-dessous" />
      <p className="sourd">La section qu&apos;il ouvre commence ici.</p>
    </div>
  );
}

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
    enonce: "Toute distance posée par le système descend de la marge du container, divisée par racine de deux à chaque profondeur — container, card, row. La densité choisit cette base parmi trois ; rien d'autre n'en choisit une.",
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
    enonce: "La marge et le coin d'une surface descendent ensemble à chaque profondeur — les coins divisés par deux, les marges par racine de deux — et la marge ne descend jamais sous le coin. Container, card, row forment une chaîne, pas trois choix. Un composant prend le coin de la row.",
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
    enonce: "Les crans de page — la tête d'une section, la gouttière, le silence entre deux sections — sont la même chaîne continuée au-dessus du container. Le gabarit du site ne possède aucune valeur à lui : chaque distance qu'il consomme est un jeton dérivé.",
    pourquoi: "Un site qui vivrait sur une autre échelle que ses composants aurait deux rythmes ; on n'en veut qu'un.",
    src: [DECISIONS] },
  { id: "y14", nom: "14", titre: "Deux questions choisissent le cran",
    enonce: "Est-ce un espace, une marge ou un coin ? À quelle profondeur — container, card, row, ou au plus serré ? La réponse désigne le jeton — le cran se déduit, il ne se choisit pas à l'œil.",
    pourquoi: "Méthode : chaque valeur posée doit pouvoir citer ses deux réponses.",
    src: [DECISIONS] },
  { id: "y15", nom: "15", titre: "Les six invariants d'audit",
    enonce: "Aucun enfant plus rond que son parent · aucune marge sous son coin · deux axes verticaux d'alignement par card, jamais trois · sœurs alignées au pixel · zéro débord à la largeur minimale · l'espace entre deux frères vaut leur marge.",
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

/* ── Le registre à la densité du site (1er septembre) ──
   La densité change la BASE de la chaîne (16 · 24 · 32, décision 4) : les
   barres suivaient déjà, puisqu'elles consomment les jetons — mais les
   chiffres, eux, étaient figés sur la chaîne par défaut. Une légende qui
   annonce 24 pendant que le site est en compact décrit un site qu'on n'a
   pas sous les yeux. Les coins, eux, ne bougent pas avec la densité. */
function useSocle(): Socle {
  const { densite } = useDensite();
  return useMemo(() => chaine({ base: DENSITES[densite] }) as Socle, [densite]);
}

/* ── La réglette de la chaîne — quatre crans, dessinés À LEUR VRAIE
   LONGUEUR. Une phrase ne montre pas un rapport entre deux longueurs
   (verdict d’Auteur, 31 août) ; un escalier, si : d’un cran au suivant on
   divise par racine de deux, et ça se voit. Les valeurs sont lues dans le
   registre, jamais écrites. « Container » — le mot du trio arrêté le 1er septembre
   déjà employé dans les légendes d'Arrondis, et il se comprend sans avoir
   lu le vocabulaire. Survoler un espace de la scène allume son
   cran ; survoler un cran allume ses espaces. ── */
const CRANS: { cran: number; jeton: string; lire: (s: Socle) => number; role: string }[] = [
  { cran: 1, jeton: "--pad-1-block", lire: (s) => s.pad[0], role: "la marge du container" },
  { cran: 2, jeton: "--pad-2-block", lire: (s) => s.pad[1], role: "la marge de la card" },
  { cran: 3, jeton: "--gap-2-block", lire: (s) => s.gap[1], role: "entre deux rows" },
  { cran: 4, jeton: "--gap-3-inline", lire: (s) => s.gap[2], role: "dans la row" },
];
export function Reglette() {
  const socle = useSocle();
  return (
    <ol className="ry-reglette" aria-label="La chaîne des distances de cette tranche, chaque cran à sa vraie longueur">
      {CRANS.map((c, i) => (
        <li key={c.cran} className="ry-cran" data-cran={c.cran}>
          <span className="ry-cran-barre" style={{ width: `var(${c.jeton})` }} aria-hidden="true" />
          <b className="mono">{px(c.lire(socle))}</b>
          <span className="ry-cran-role">{c.role}</span>
          {i < CRANS.length - 1 && <span className="ry-cran-pas mono" aria-hidden="true">÷ √2</span>}
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
function CarteSoeur({ nom, role, nomme }: { nom: string; role: string; nomme?: boolean }) {
  return (
    <div className="ry-fr-carte">
      <E j="--pad-2-inline" h voir nom={nomme ? "la marge" : undefined} genre="pad" cran={2} />
      <span className="ry-fr-dit"><b>{nom}</b><span className="sourd ry-petit">{role}</span></span>
      <E j="--pad-2-inline" h voir genre="pad" cran={2} />
    </div>
  );
}
function Freres({ casse }: { casse: boolean }) {
  const s = useSocle();
  const ecart = casse ? s.gap[2] : s.gap[0];
  return (
    <div className="ry-fr">
      {/* Les bandes restent visibles : cette scène EST la comparaison de deux
          longueurs — les cacher jusqu'au survol reviendrait à ne rien montrer. */}
      <div className="ry-fr-coque">
        <CarteSoeur nom="Léa Fontan" role="UX Designer" nomme />
        <span className={`espace h ${casse ? "ko" : "vu gap"}`} data-nom={casse ? "l’écart ment" : "l’écart"}
          data-cran={2} data-intent={casse ? "statement" : undefined}
          style={{ width: `var(${casse ? "--gap-3-inline" : "--gap-1-inline"})` }} />
        <CarteSoeur nom="Marc Aubin" role="Développeur" />
      </div>
      <span className="gd-legende">{casse
        ? `l’écart ${px(ecart)} · la marge ${px(s.pad[1])} — ils ne sont plus égaux : chaque texte est plus près de sa voisine que de son propre bord`
        : `l’écart ${px(ecart)} · la marge ${px(s.pad[1])} — le même chiffre, et c’est la règle`}</span>
    </div>
  );
}

/* y12 · Des rapports, jamais des soustractions — quatre crans dessinés à
   leur vraie longueur. Au repos ils descendent par racine de deux ; cassés,
   on retire le même nombre de pixels à chaque pas. */
const CHAINE = [SOCLE.pad[0], SOCLE.pad[1], SOCLE.pad[2], SOCLE.gap[2]];
const RETRAIT = 4; /* hors chaîne : le nombre de pixels retiré à chaque pas — c'est le geste qu'on éprouve, pas une distance du kit */
function Rapports({ casse }: { casse: boolean }) {
  const crans = casse ? CHAINE.map((_, i) => CHAINE[0] - i * RETRAIT) : CHAINE;
  return (
    <div className="ry-rap" data-intent={casse ? "statement" : undefined}>
      <ol className="ry-rap-crans">
        {crans.map((v, i) => (
          <li className="ry-rap-cran" key={i}>
            <span className="ry-rap-barre" style={{ width: `${v}px` }} aria-hidden="true" />
            <b className="mono">{px(v)}</b>
          </li>
        ))}
      </ol>
      <span className="gd-legende">{casse
        ? "on retire le même nombre de pixels à chaque pas : quatre longueurs presque jumelles — l’œil ne compte pas ce qu’on retire"
        : "on divise par racine de deux à chaque pas : quatre longueurs qu’on distingue sans effort"}</span>
    </div>
  );
}

/* y9 · La géométrie d'espacement vit en rem. Ici la commande n'est pas une
   faute : c'est le GESTE de l'utilisateur — il agrandit le texte. Deux
   cards jumelles, l'une dont les marges sont des jetons, l'autre dont les
   marges sont gelées en pixels. Au repos elles se ressemblent ; agrandi,
   l'une respire et l'autre étouffe. */
const MARGE_DURE = 16; /* hors chaîne : la marge fautive de la démonstration — une valeur qu'on ne pose jamais */
function EnRem({ grand }: { grand: boolean }) {
  const carte = (dur: boolean) => (
    <div className={`ry-rem-carte ${dur ? "dur" : ""}`} data-intent={dur && grand ? "statement" : undefined}>
      <span className="ry-rem-etiq mono">{dur ? `marge : ${MARGE_DURE} px` : "marge : var(--pad-2-block)"}</span>
      <b>Vos coordonnées</b>
      <span className="sourd">Nom, adresse, téléphone.</span>
    </div>
  );
  return (
    <div className={`ry-rem ${grand ? "grand" : ""}`}>
      <div className="ry-rem-paire">{carte(false)}{carte(true)}</div>
      <span className="gd-legende">{grand
        ? "texte agrandi de moitié : à gauche la marge a grandi avec lui, à droite elle est restée où elle était — le contenu touche le bord"
        : "au repos, les deux cards se ressemblent : c’est en agrandissant le texte que la différence apparaît"}</span>
    </div>
  );
}

/* y17 · La cible au doigt a un plancher. La jauge en pointillé est la
   hauteur due ; la commande doit la remplir. Cassée, on voit le vide entre
   la commande et sa jauge, et la légende dit les deux chiffres. */
const CIBLE_CASSEE = 36; /* hors chaîne : la hauteur fautive de la démonstration — une valeur qu'on ne pose jamais */
function Cible({ casse }: { casse: boolean }) {
  const due = J["control-height"];
  const hauteur = px(due.haut ?? due.base);
  return (
    <div className="ry-cible" data-intent={casse ? "statement" : undefined}>
      <div className="ry-cible-rang">
        {["Enregistrer", "Annuler", "Aide"].map((n) => (
          <span className="ry-cible-jauge" key={n}>
            <button className="ry-cible-btn" type="button" tabIndex={-1}>{n}</button>
          </span>
        ))}
      </div>
      <span className="gd-legende">{casse
        ? `la jauge ${hauteur} px · la commande ${CIBLE_CASSEE} px — la commande ne remplit plus sa hauteur, elle se rate au doigt`
        : `la jauge ${hauteur} px · la commande ${hauteur} px — la commande remplit exactement la hauteur due`}</span>
    </div>
  );
}

/* ── La profondeur — une vraie tranche de réglages, emboîtée sur trois
   niveaux, et à côté les TROIS ARCS dessinés à leur vraie taille : d'un
   niveau au suivant, le coin se plie en deux. C'est ce que la scène rend
   sensible — la chaîne, pas trois choix. La valeur cassée n'est pas écrite
   en dur : c'est le coin de la card, doublé. ── */
function Arc({ r, nom, marge, faux }: { r: number; nom: string; marge: number; faux?: boolean }) {
  const c = 52, m = 6; /* hors chaîne : la boîte du croquis et sa marge — un dessin, pas une distance du kit */
  return (
    <li className={`ry-pf-cote ${faux ? "faux" : ""}`}>
      <svg viewBox={`0 0 ${c} ${c}`} aria-hidden="true">
        <path d={`M ${m} ${c - m} L ${m} ${m + r} A ${r} ${r} 0 0 1 ${m + r} ${m} L ${c - m} ${m}`}
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className="ry-pf-cote-dit">
        <b>{nom}</b>
        <span className="mono">marge {px(marge)} · coin {px(r)}</span>
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
export function Profondeurs({ casse, socle }: { casse: boolean; socle?: Socle }) {
  const s = socle ?? SOCLE;
  const r = s.r, p = s.pad;
  const rLigne = casse ? r[1] * 2 : r[2];
  const vars = socle ? ({
    "--pf-p1": `${s.pad[0]}px`, "--pf-p2": `${s.pad[1]}px`, "--pf-p3": `${s.pad[2]}px`,
    "--pf-g1": `${s.gap[0]}px`, "--pf-g2": `${s.gap[1]}px`, "--pf-g3": `${s.gap[2]}px`,
  } as CSSProperties) : undefined;
  return (
    <div className="ry-pf-scene" style={vars}>
      <div className="ry-pf">
        <div className="ry-pf-tete">
          <b>Réglages</b>
          <span className="mono">Fili</span>
        </div>
        <div className="ry-pf-carte">
          {([["Notifications", "Toutes"], ["Langue", "Français"], ["Thème", "Clair"]] as const).map(([n, v]) => (
            <div className="ry-pf-ligne" key={n} data-intent={casse ? "statement" : undefined}>
              <span>{n}</span><span className="mono sourd">{v}</span>
            </div>
          ))}
          <button className="ry-pf-btn" type="button" tabIndex={-1}>Enregistrer</button>
        </div>
      </div>
      <ol className="ry-pf-cotes" aria-label="Les trois coins, dessinés à leur vraie taille">
        <Arc r={r[0]} nom="le container" marge={p[0]} />
        <Arc r={r[1]} nom="la card" marge={p[1]} />
        <Arc r={rLigne} nom="la row" marge={p[2]} faux={casse} />
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
type Cle = "airy" | "comfortable" | "compact";
const DEMO: { cle: Cle; nom: string; fin: string }[] = [
  { cle: "airy", nom: "Aéré", fin: "un cran au-dessus, partout" },
  { cle: "comfortable", nom: "Confortable", fin: "trois profondeurs, un seul rapport" },
  { cle: "compact", nom: "Compact", fin: "un cran en dessous ; coins et cibles n'ont pas bougé" },
];
const REGISTRES = Object.fromEntries(DEMO.map((d) =>
  [d.cle, jetons(chaine({ base: DENSITES[d.cle] })) as unknown as Record<string, Jeton>],
)) as Record<Cle, Record<string, Jeton>>;
/* Un jeton, à une largeur donnée : la même interpolation que le clamp
   généré dans tokens.css — bornée en bas et en haut. */
function aLaLargeur(t: Jeton, W: number) {
  if (t.bas === undefined || t.haut === undefined) return t.base;
  const k = Math.min(1, Math.max(0, (W - LARGEUR_MIN) / (LARGEUR_MAX - LARGEUR_MIN)));
  return t.bas + (t.haut - t.bas) * k;
}
/* Les variables de la scène, définies ICI par la page (chaque nom porte le
   jeton qu'il rejoue à la largeur simulée) — la feuille les consomme. */
const CRANS_SD: Record<string, string> = {
  "--sd-p1": "pad-1-block", "--sd-p1i": "pad-1-inline",
  "--sd-p2": "pad-2-block", "--sd-p2i": "pad-2-inline",
  "--sd-p3": "pad-3-block", "--sd-p3i": "pad-3-inline",
  "--sd-g1": "gap-1-block", "--sd-g2": "gap-2-block", "--sd-g3": "gap-3-block",
  "--sd-g2i": "gap-2-inline", "--sd-g3i": "gap-3-inline",
};
function ditDensite(cle: Cle, W: number) {
  const r = REGISTRES[cle], d = DEMO.find((x) => x.cle === cle)!;
  const v = (n: string) => px(aLaLargeur(r[n], W));
  return `${d.nom.toLowerCase()}, à ${W} px — container ${v("pad-1-block")} · card ${v("pad-2-block")} · row ${v("pad-3-block")} px · ${d.fin}`;
}
/* La mesure du cadre : hors chaîne, et dite. C'est la largeur d'écran que
   la démonstration simule au départ — le damier reprend le reste. */
const CADRE = 720;
export function SituationDensite() {
  const [d, setD] = useState<Cle>("comfortable");
  const [larg, setLarg] = useState(0);
  const vars = (W: number) => Object.fromEntries(
    Object.entries(CRANS_SD).map(([css, jeton]) => [css, `${aLaLargeur(REGISTRES[d][jeton], W)}px`]),
  ) as CSSProperties;
  return (
    <Apercu
      plafond={CADRE}
      surLargeur={setLarg}
      outils={<>
        <span className="mono sourd">La densité :</span>
        {DEMO.map((x) => (
          <button key={x.cle} className={`bouton ${d === x.cle ? "on" : ""}`}
            aria-pressed={d === x.cle} onClick={() => setD(x.cle)}>{x.nom}</button>
        ))}
      </>}
      enfants={(W) => (
        <div className="ry-sd" style={vars(W)} data-density={d} data-densite={d}
          role="img" aria-label="Tranche d&apos;application : la fiche de Léa Fontan, dont chaque espace est un cran de la chaîne">
          <div className="ry-sd-tete">
            <span className="ry-sd-nom">Fili</span>
            <span className="ry-sd-meta mono">PROFIL</span>
          </div>
          <div className="ry-sd-carte">
            <div className="ry-sd-id">
              <span className="ry-sd-rond" aria-hidden="true" />
              <span className="ry-sd-qui">
                <b>Léa Fontan</b>
                <span>UX Designer — chaque distance de cette card est un jeton.</span>
              </span>
            </div>
            <div className="ry-sd-lignes">
              {([["Cours suivis", "24"], ["Abonnés", "1 280"], ["Assiduité", "96 %"]] as const).map(([l, v]) => (
                <div className="ry-sd-ligne" key={l}><span>{l}</span><b>{v}</b></div>
              ))}
            </div>
          </div>
        </div>
      )}
      pied={<span className="gd-legende">{ditDensite(d, larg)}</span>}
    />
  );
}

/* ── Étage « en liste » — ce qu'aucune image ne prouve. Chaque ligne dit
   où elle se vérifie : dans le code (le Gardien la mordra), sur l'écran
   allumé (elle se constate au rendu), nulle part (décision d'Auteur). ── */
const LISTE: LigneListe[] = [
  { nom: "La chaîne se dérive, elle ne s'écrit pas",
    dit: "Toute distance descend d'une base unique divisée par racine de deux à chaque profondeur, et la variation vit dans la définition du jeton — jamais dans une largeur d'écran. Aucune valeur d'espacement n'est écrite à la main.",
    ou: "dans le code" },
  { nom: "Le silence est un cran de la même chaîne",
    dit: "La tête d'une section, la gouttière, le silence entre deux sections sont la chaîne continuée au-dessus du container. Le gabarit du site ne possède aucune valeur à lui.",
    ou: "dans le code" },
  { nom: "La densité change la base, jamais la structure",
    dit: "Compact, confortable, aéré remplacent la base et recalculent toute la chaîne. L'ordre des emplacements, la présence des éléments et le nombre de colonnes restent identiques.",
    ou: "sur l'écran allumé", ton: "rendu" },
  { nom: "Zéro débord à la largeur minimale",
    dit: "Aucun débordement horizontal au plus petit écran déclaré ; deux axes verticaux d'alignement par card, jamais trois ; sœurs alignées au pixel.",
    ou: "sur l'écran allumé", ton: "rendu" },
  { nom: "Une marge, un espace, un coin — à sa profondeur, sur son axe",
    dit: "Deux distances de même valeur peuvent faire deux métiers. Le kit n'a que trois mots — la marge qui encadre, l'espace qui sépare, le coin qui arrondit — et deux questions pour les poser : à quelle profondeur, sur quel axe. La règle parle du métier, jamais du pixel.",
    ou: "dans le code" },
  { nom: "Quatre décisions, et rien d'autre, entrent dans le moteur",
    dit: "La base, l'intervalle, la racine des coins, l'intervalle des titres : tout le reste en sort. Les crans naissent d'un diviseur appliqué en chaîne, jamais d'une différence fixe — l'œil lit les rapports, pas les écarts.",
    ou: "dans le code" },
  { nom: "Quatre axes glissent, les coins non",
    dit: "L'horizontal, le vertical, le texte et la cible glissent chacun entre deux bornes de l'écran étroit au large. Les coins sont réglés par la racine du produit : ils ne glissent pas.",
    ou: "sur l'écran allumé", ton: "rendu" },
  { nom: "Les titres montent du même pas que les espaces",
    dit: "Le corps ne descend jamais sous son plancher ; chaque cran de titre vaut le précédent multiplié par le même intervalle. Une seule dérivation, pas deux échelles qui finiraient par se contredire.",
    ou: "dans le code" },
  { nom: "L'interligne suit la lisibilité, pas la grille",
    dit: "Aucun interligne n'est recalé sur la chaîne sans une décision explicite et datée : la grille stricte des livres suppose des corps fixes, la lecture prime.",
    ou: "nulle part — décision d'Auteur", ton: "auteur" },
];

/* ── Étage « dans le code » — les valeurs sont LUES dans le registre
   calculé, jamais recopiées : si la chaîne bouge, ce tableau bouge. ── */
const CODE: LigneCode[] = [
  { regle: "La marge d'un container",
    ecrit: <><span className="cs-kw">padding</span>: <span className="cs-var">var(--pad-1-block) var(--pad-1-inline)</span></>,
    produit: px(SOCLE.pad[0]) + " px", note: "la base du produit — elle glisse avec l'écran, sur son axe" },
  { regle: "La marge d'une card",
    ecrit: <><span className="cs-kw">padding</span>: <span className="cs-var">var(--pad-2-block) var(--pad-2-inline)</span></>,
    produit: px(SOCLE.pad[1]) + " px", note: "la base divisée par racine de deux" },
  { regle: "Entre deux cards",
    ecrit: <><span className="cs-kw">gap</span>: <span className="cs-var">var(--gap-1-block)</span></>,
    produit: px(SOCLE.gap[0]) + " px", note: "l'espace entre deux frères vaut leur marge — c'est le même chiffre" },
  { regle: "Entre deux rows d'une card",
    ecrit: <><span className="cs-kw">gap</span>: <span className="cs-var">var(--gap-2-block)</span></>,
    produit: px(SOCLE.gap[1]) + " px", note: "un cran plus bas — la marge de la row" },
  { regle: "Dans la row",
    ecrit: <><span className="cs-kw">gap</span>: <span className="cs-var">var(--gap-3-inline)</span></>,
    produit: px(SOCLE.gap[2]) + " px", note: "une icône et son texte, deux boutons côte à côte" },
  { regle: "Au plus serré", repli: true,
    ecrit: <><span className="cs-kw">gap</span>: <span className="cs-var">var(--gap-4-block)</span></>,
    produit: px(SOCLE.gap[3]) + " px", note: "un chiffre et son libellé, le dedans d'un badge" },
  { regle: "Le silence entre deux sections", repli: true,
    ecrit: <><span className="cs-kw">padding-top</span>: <span className="cs-var">var(--doc-silence)</span></>,
    produit: "un cran de page", note: "la même chaîne, continuée au-dessus du container" },
  { regle: "La densité", repli: true,
    ecrit: <><span className="cs-kw">data-density</span>=<span className="cs-var">&quot;compact&quot;</span></>,
    produit: "toute la chaîne se recalcule", note: "une autre base, pas un multiplicateur" },
  { regle: "La cible au doigt", repli: true,
    ecrit: <><span className="cs-kw">min-height</span>: <span className="cs-var">var(--control-height)</span></>,
    produit: "la cible pleine", note: "dérivée du registre, jamais sous le plancher de la norme" },
  { regle: "Le cran d'un titre", repli: true,
    ecrit: <><span className="cs-kw">font-size</span>: <span className="cs-var">var(--font-size-h2)</span></>,
    produit: "le cran précédent × l'intervalle", note: "la même dérivation que les espaces" },
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
export function Molette({ id, label, min, max, pas, valeur, surValeur, dit }: {
  id: string; label: string; min: number; max: number; pas: number;
  valeur: number; surValeur: (v: number) => void; dit: string;
}) {
  return (
    <span className="mo-molette">
      <label htmlFor={id}>{label}</label>
      <input type="range" id={id} min={min} max={max} step={pas} value={valeur}
        onChange={(e) => surValeur(+e.target.value)} />
      <output htmlFor={id} className="mono">{dit}</output>
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
export function Hierarchie({ socle, ratio }: { socle: Socle; ratio: number }) {
  const t = socle.texte;
  const r = fr2(ratio);
  const lignes = [
    { nom: "la taille du titre de page", v: t.h1, calc: `16 × ${r}³`, txt: "Le rythme d'une page" },
    { nom: "la taille du titre de section", v: t.h2, calc: `16 × ${r}²`, txt: "Ce qui sépare deux niveaux" },
    { nom: "la taille du sous-titre", v: t.h3, calc: `16 × ${r}`, txt: "Et ce qui les rapproche" },
    { nom: "la taille du corps", v: t.body, calc: "son plancher", fixe: true,
      txt: "Le corps ne bouge pas : seize pixels, quoi qu'il arrive. C'est le point fixe autour duquel toute la hiérarchie se règle." },
  ];
  const contraste = t.h3 / t.body;
  const cri = t.h1 / t.body;
  const verdict = contraste < 1.16
    ? { mot: "Trop serré", dit: "le sous-titre ne se distingue plus de son texte : plus rien ne se hiérarchise.", ton: "ko" }
    : cri > 3
      ? { mot: "Trop large", dit: "le titre crie, et le corps a l'air d'une note de bas de page.", ton: "ko" }
      : { mot: "Ça tient", dit: "chaque niveau se détache du suivant sans écraser le corps.", ton: "ok" };
  return (
    <div className="hier">
      <div className="hier-feuille">
        {lignes.map((l) => (
          /* La cote est collée À SA LIGNE, avec le calcul qui la produit :
             en colonne à part, elle ne se rattachait à rien et ne voulait
             rien dire (verdict d'Auteur, 2 septembre). */
          <div key={l.nom} className={`hier-ligne ${l.fixe ? "fixe" : ""}`}>
            <span className="hier-cote">
              <b className="mono">{fr(l.v)} px</b>
              <em className="mono">{l.calc}</em>
              <i>{l.nom}</i>
            </span>
            {/* La taille d'un texte EST une hauteur : on la mesure sur lui,
                comme le kit mesure un espace — deux repères et un trait
                (verdict d'Auteur, 2 septembre). Un nombre dans une colonne
                à côté ne se rattachait à rien. */}
            <span className="hier-mesure" aria-hidden="true"
              style={{ height: `${Math.round(l.v * 10) / 10}px` }} />
            <p className={l.fixe ? "hier-corps" : "hier-titre"}
              style={{ fontSize: `${Math.round(l.v * 10) / 10}px` }}>{l.txt}</p>
          </div>
        ))}
      </div>
      <p className={`hier-verdict ${verdict.ton}`}>
        <b>{verdict.mot}</b> <span>{verdict.dit}</span>
      </p>
    </div>
  );
}

const SOMMAIRE: Sommaire = [
  ["moteur", "01", "Le moteur"],
  ["echelle", "02", "La chaîne"],
  ["densite", "03", "La densité"],
  ["profondeur", "04", "La profondeur"],
  ["titres", "05", "L'intervalle des titres"],
  ["bandes", "06", "Les règles qu'on peut casser"],
  ["liste", "07", "Les règles qu'on ne peut pas montrer"],
  ["code", "08", "Dans le code"],
];
export default function Vue() {
  const [casseProf, setCasseProf] = useState(false);
  const [casseLib, setCasseLib] = useState(false);
  const [casseTit, setCasseTit] = useState(false);
  const [casseFre, setCasseFre] = useState(false);
  const [casseRap, setCasseRap] = useState(false);
  const [grandTexte, setGrandTexte] = useState(false);
  const [casseCib, setCasseCib] = useState(false);
  /* L'intervalle des titres : le quatrième nombre du moteur. Versé de la
     page d'essai le 2 septembre. */
  const [titres, setTitres] = useState<number>(CHARTE.intervalleTitres);
  const socleTitres = chaine({ intervalleTitres: titres }) as Socle;
  const actifId = useDocSections("moteur");

  return (
    <div className="gdoc-fond ry">
      <div className="gdoc">
        <RailDoc page="rythme" titre="Fondation · Rythme" sommaire={SOMMAIRE} actifId={actifId} pied="Une chaîne · quatre axes" />

        <main className="gdoc-contenu" id="contenu">

          <section className="gdoc-heros">
            <p className="kicker">Le rythme (espacement)</p>
            <h1>Rien ici n&apos;a été espacé à l&apos;œil<span className="point" aria-hidden="true" /></h1>
            <p className="chapo">
              Posez deux cards côte à côte. Si le texte de l&apos;une se retrouve plus près du bord de
              l&apos;autre que du sien, votre œil le rattache à la mauvaise card — sans que vous sachiez
              dire pourquoi la page vous gêne. C&apos;est tout le travail de l&apos;espace : dire qui va avec
              qui.
            </p>
          </section>

          {/* ── 01 · LE MOTEUR ────────────────────────────────────────────
              Versé de la page d'essai le 2 septembre 2026. Douze slides, une
              seule fiche montée une fois, un compteur de décisions pour
              enjeu. Il ouvre la page parce qu'il répond à la question que
              tout le reste suppose réglée : combien de décisions faut-il
              pour composer une card, et pourquoi quatre suffisent. ── */}
          <section className="gdoc-sec pose" id="moteur">
            <div className="gdoc-sec-tete">
              <p className="kicker">01 · Le moteur</p>
              <h2>Comment le moteur décide à notre place</h2>
            </div>
            <div className="gdoc-corps">
              <Scenario />
            </div>
          </section>

          <section className="gdoc-sec pose" id="echelle">
            <div className="gdoc-sec-tete">
              <p className="kicker">02 · La chaîne</p>
              <h2>Tout descend d&apos;un seul réglage, du bord de l&apos;écran au moindre bouton</h2>
              <p className="sourd">
                Une équipe qui décide ses marges écran par écran finit par se contredire — pas par
                négligence : personne ne se souvient de ce qui a été tranché trois mois plus tôt. Ici,
                chaque espace descend de la même chaîne, du container à la card puis à la row, et glisse
                avec la largeur de l&apos;écran.
              </p>
            </div>
            <div className="gdoc-corps">
              <figure className="gd-figure ry-preuve-tranche">
                {/* Plus de bouton : les espaces se révèlent au survol de la
                    tranche (ou au clavier), et s'effacent en la quittant. */}
                <div className="banc primaire survole-espaces">
                  <TrancheFili voir />
                </div>
                {/* La réglette est une LÉGENDE : elle se lit sous la scène,
                    à l'horizontale, dans l'encre de la page — pas une
                    colonne posée dans le banc (verdict d'Auteur, 31 août). */}
                <Reglette />
                {/* La légende parle aux humains : l'effet, pas la mécanique
                    (retour d'Auteur, 24 août — même leçon que les badges de
                    la page Couleur). */}
                <figcaption className="gd-legende">
                  Plus vous entrez profond dans la card, plus les marges et les coins se resserrent — sans que personne ait eu à le décider niveau par niveau. Et entre deux voisines, l&apos;espace vaut exactement leur marge.
                </figcaption>
              </figure>
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <p>Quatre décisions entrent dans <b>le moteur</b> — la base, l&apos;intervalle, la racine des coins, l&apos;intervalle des titres — et toute la géométrie en sort, sur quatre axes : l&apos;horizontal, le vertical, le texte et la cible. Aucune valeur n&apos;est écrite à la main. La tranche, elle, emboîte ses fonds en cascade : le container, la card, la row, avec des marges et des coins qui se resserrent à chaque étage — l&apos;emboîtement est relevé sur une application en production.</p>
                <Regles ids={["y8", "y9", "y3", "y7", "y17", "y4"]} />
              </div></details>
            </div>
          </section>

          <section className="gdoc-sec pose" id="densite">
            <div className="gdoc-sec-tete">
              <p className="kicker">03 · La densité</p>
              <h2>Serrez la page : elle respire autrement, elle n&apos;invente rien</h2>
              <p className="sourd">
                On ne regarde pas de la même façon un tableau de bord qu&apos;on scrute toute la journée et
                une fiche qu&apos;on ouvre trois secondes. D&apos;où deux réglages, et deux seulement. La
                <b>densité</b> repose la base, et toute la chaîne suit d&apos;un cran. La <b>largeur
                d&apos;écran</b> fait glisser chaque cran entre ses bornes, sans palier. Ne bougent jamais : les coins, les cibles et la hiérarchie.
              </p>
            </div>
            <div className="gdoc-corps">
              <SituationDensite />
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <p>Un « mode compact à 80 % » a l&apos;air commode, et fabrique des valeurs que personne ne retrouvera le jour où la marque change. Reposer la base, au contraire, garde tout le monde dans le système : chaque distance sait encore d&apos;où elle vient. Et la densité règle le contenu, jamais le châssis — le rail, la gouttière et les marges de page ne bougent pas.</p>
                <Regles ids={["y5", "y6"]} />
              </div></details>
            </div>
          </section>

          <section className="gdoc-sec pose" id="profondeur">
            <div className="gdoc-sec-tete">
              <p className="kicker">04 · La profondeur</p>
              <h2>Regardez les coins : à chaque étage, ils se plient en deux</h2>
              <p className="sourd">
                Une fenêtre contient une card, qui contient une row : trois occasions de se contredire
                si on les règle chacune dans son coin. La marge et le coin descendent donc ensemble — la
                marge divisée par racine de deux, le coin par deux. Cassez la chaîne : l&apos;emboîtement cesse net de se lire.
              </p>
            </div>
            <div className="gdoc-corps">
              <div className="rang">
                <button className={`bouton casse ${casseProf ? "on" : ""}`} onClick={() => setCasseProf(!casseProf)}>
                  {casseProf ? "Réparer" : "Casser : l'enfant plus rond"}
                </button>
              </div>
              <figure className="gd-figure">
                {/* La terre sombre, comme la gazette de Typo : un panneau se lit
                      comme un objet posé quand ce qui l'entoure n'est pas, lui aussi,
                      du papier. Variante déjà déclarée du banc. */}
                <div className="banc sombre">
                  <Profondeurs casse={casseProf} />
                </div>
                <figcaption className="gd-legende">{casseProf
                  ? "la row est devenue plus ronde que la card qui la contient — l'emboîtement ne se lit plus"
                  : "la marge se divise par racine de deux, le coin par deux — et les trois étages tiennent"}</figcaption>
              </figure>
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <Regles ids={["y10", "y16", "y15"]} />
              </div></details>
            </div>
          </section>

          {/* ── Les trois étages du dessous, au gabarit commun (etages.tsx) ── */}
          {/* ── 05 · L'INTERVALLE DES TITRES ─────────────────────────────
              Le quatrième nombre du moteur, versé de la page d'essai. Il ne
              règle pas une taille mais un CONTRASTE — l'écart entre tous les
              niveaux à la fois — et il faut une hiérarchie entière pour le
              voir : un couple titre + texte ne montre qu'un cran, et le
              curseur y « ne fait que grossir le texte ». ── */}
          <section className="gdoc-sec pose" id="titres">
            <div className="gdoc-sec-tete">
              <p className="kicker">05 · L&apos;intervalle des titres</p>
              <h2>Ce nombre ne règle pas une taille, il règle un contraste</h2>
              <p className="sourd">
                C&apos;est la décision qu&apos;on oublie de compter, et pourtant elle est dans le moteur comme
                les trois autres. Elle ne grossit pas un titre : elle écarte tous les niveaux d&apos;un seul
                geste. Le corps, lui, ne bouge pas d&apos;un pixel — c&apos;est le point fixe autour duquel tout
                se règle. Tournez le nombre jusqu&apos;aux deux bouts : la hiérarchie a deux façons de casser.
              </p>
            </div>
            <div className="gdoc-corps">
              <div className="rang">
                <Molette id="ry-tit" label="Le titre plus ou moins haut"
                  min={BORNES.intervalleTitres[0]} max={BORNES.intervalleTitres[1]} pas={0.01}
                  valeur={titres} surValeur={setTitres} dit={fr2(titres)} />
              </div>
              <div className="banc voile">
                <Hierarchie socle={socleTitres} ratio={titres} />
              </div>
              <span className="gd-legende">
                {`quatre tailles de texte, un seul nombre — chaque cran vaut le précédent × ${fr2(titres)}, et le corps ne bouge pas`}
              </span>
            </div>
          </section>

          <section className="gdoc-sec pose" id="bandes">
            <div className="gdoc-sec-tete">
              <p className="kicker">06 · Les règles qu&apos;on peut casser</p>
              <h2>Voyez ce qui se passe quand la règle saute</h2>
              <p className="sourd"> Le
                bouton « Casser » ne dessine pas la faute, il la commet pour de vrai — puis la répare.
                C&apos;est en voyant la version fausse qu&apos;on comprend à quoi sert la juste.
              </p>
            </div>
            <div className="gdoc-corps">
              <Bandes>
                <Bande nom="L&apos;espace entre deux sœurs vaut leur marge" cote="le même chiffre"
                  dit="Le dedans et le dehors d&apos;une surface se règlent ensemble, pas chacun de son côté. Un texte plus proche du bord de sa voisine que du sien a l&apos;air d&apos;appartenir à la voisine — et l&apos;œil s&apos;y laisse prendre à chaque fois."
                  casse={casseFre} surCasse={setCasseFre}
                  regles={<Regles ids={["y1", "y15"]} />}>
                  <Freres casse={casseFre} />
                </Bande>
                <Bande nom="Le libellé qui flotte" cote="autant d&apos;un côté que de l&apos;autre"
                  dit="Un libellé posé aussi loin de son champ que du paragraphe du dessus n&apos;appartient plus à personne. On croit lire l&apos;étiquette du champ suivant — c&apos;est la faute la plus courante des formulaires."
                  casse={casseLib} surCasse={setCasseLib}
                  regles={<Regles ids={["y1"]} />}>
                  <ProximiteLibelle casse={casseLib} />
                </Bande>
                <Bande nom="Le titre qui change de camp" cote="au-dessus &gt; au-dessous"
                  dit="L&apos;espace au-dessus d&apos;un titre dépasse celui du dessous d&apos;au moins un cran. À égalité, le titre ferme le paragraphe précédent au lieu d&apos;ouvrir sa section — et le lecteur cherche un instant où commence la suite."
                  casse={casseTit} surCasse={setCasseTit}
                  regles={<Regles ids={["y2"]} />}>
                  <ProximiteTitre casse={casseTit} />
                </Bande>
                <Bande nom="Des rapports, jamais des soustractions" cote="÷ √2 à chaque pas"
                  dit="Retirez le même nombre de pixels à chaque cran : vous obtenez des longueurs presque jumelles, que personne ne distingue. Divisez à chaque cran, et les mêmes longueurs se lisent d&apos;un coup d&apos;œil. L&apos;œil compare, il ne compte pas."
                  casse={casseRap} surCasse={setCasseRap}
                  regles={<Regles ids={["y12", "y3"]} />}>
                  <Rapports casse={casseRap} />
                </Bande>
                <Bande nom="La géométrie vit en rem" cote="la même card, deux marges"
                  dit="Un lecteur agrandit le texte : les espaces autour doivent grandir avec lui. Une marge figée en pixels, elle, reste où elle est — et la page se referme sur son contenu au premier réglage d&apos;accessibilité."
                  casse={grandTexte} surCasse={setGrandTexte}
                  libelleCasse="Agrandir le texte" libelleRepare="Revenir"
                  regles={<Regles ids={["y9", "y8"]} />}>
                  <EnRem grand={grandTexte} />
                </Bande>
                <Bande nom="La cible au doigt a un plancher" cote="rien ne descend dessous"
                  dit="Un bouton, un champ, un sélecteur ont une hauteur de cible dérivée du registre. Une commande trop petite se rate au doigt, et aucune décision de mise en page ne passe avant ça."
                  casse={casseCib} surCasse={setCasseCib}
                  regles={<Regles ids={["y17"]} />}>
                  <Cible casse={casseCib} />
                </Bande>
              </Bandes>
            </div>
          </section>

          <section className="gdoc-sec pose" id="liste">
            <div className="gdoc-sec-tete">
              <p className="kicker">07 · Les règles qu&apos;on ne peut pas montrer</p>
              <h2>Elles se vérifient ailleurs — et on vous dit où</h2>
              <p className="sourd">
                Certaines règles ne se photographient pas. Elles se vérifient dans le code, à l&apos;écran
                allumé, ou nulle part.
              </p>
            </div>
            <div className="gdoc-corps">
              <ListeRegles lignes={LISTE} />
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <Regles ids={["y3", "y13", "y8", "y9", "y7", "y4"]} />
              </div></details>
            </div>
          </section>

          <section className="gdoc-sec pose" id="code">
            <div className="gdoc-sec-tete">
              <p className="kicker">08 · Dans le code</p>
              <h2>Le même système, dans votre stack</h2>
            </div>
            <div className="gdoc-corps">
              <PanneauRegistre lignes={CODE} />
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <p><b>Ce qui remplace l&apos;extrait.</b> La page proposait un extrait prêt à coller, avec une bascule HTML / React / Angular. On l&apos;a retiré : un extrait vieillit, et le jour où le composant bouge il se met à mentir sans prévenir. Le jeton, lui, reste vrai. Ce qui fait foi ici, c&apos;est <b>la règle et le jeton</b> — pas le code.</p>
                <p><b>Deux échelles, assumées.</b> Le CSS natif garde les décimales calculées ; Tailwind s&apos;accroche à sa grille de 4, arrondie, sans décimale. On ne mélange pas les deux — voici la correspondance, jeton par jeton, lue dans le moteur :</p>
                <Correspondance />
              </div></details>
            </div>
          </section>

          <footer className="gd-pied">
            <span>Cette page obéit aux règles qu&apos;elle raconte</span>
            <span>Un seul registre, site compris · aucune valeur hors chaîne</span>
          </footer>

        </main>
      </div>
    </div>
  );
}
