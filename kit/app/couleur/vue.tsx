"use client";
import * as React from "react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Bandes, Bande, ListeRegles, PanneauRegistre } from "../etages";
import type { LigneListe, LigneCode } from "../etages";
import { useTheme, useSchemeSysteme } from "../theme";
import { derive, gamme, gammeNeutres, gammeFamille, poserSurGamme, PRIMAIRE_DEFAUT } from "../../derivation.mjs";
import { usePrimaire } from "../primaire";
import { RailDoc, useDocSections, type Sommaire } from "../rail";
import { Bento } from "./bento";

/* ═══════════════════════════════════════════════════════════════════════
   PAGE COULEUR — recomposée au gabarit « documentaire nu » et à la
   formule de contenu (24 août 2026). Passée à la voix d'Auteur et au
   gabarit des étages le 2 septembre.

   · LES PREUVES (01 à 04) — sans gabarit, c'est la part de séduction et
     elle diffère d'une page à l'autre : LA PALETTE (la marque en réserve,
     les gammes 50–950 en dépliant), LE NUANCIER (vocabulaire — six rôles
     en languettes, chaque couple mesuré sur le rendu), EN SITUATION
     (objet vivant — le tableau de bord en grille bento, texte sur photo
     sous voile calculé, bento.tsx), LE MOTEUR (variation — la même
     famille dérivée sous trois marques, une seule décision d'entrée).
     Leur FORME est conservée ; seul leur texte est passé à la voix.
   · LES TROIS ÉTAGES (05 à 07) — au gabarit commun d'etages.tsx, comme
     Rythme et Typo : les règles qu'on peut casser (cinq bandes — le
     contraste par paire, chacun son registre, le survol est un jeton,
     l'action en sombre, teinter à luminance constante), celles qu'on ne
     peut pas montrer (la liste et sa colonne « où ça se vérifie »), et le
     registre des jetons.

   « Deux thèmes » a quitté l'étage des preuves : c'est une casse, elle
   descend en bande. La table des paires la suit dans son dépliant, et la
   table des rôles vit désormais sous le registre, dont elle est la forme
   longue. L'extrait prêt à coller et sa bascule HTML / React / Angular
   sont retirés : un extrait vieillit et se met à mentir dès que le
   composant bouge. Le normatif, c'est la règle et le jeton.

   Tout chiffre affiché est MESURÉ sur la page rendue, jamais recopié.
   Les styles propres à la page vivent dans couleur.css.
   ═══════════════════════════════════════════════════════════════════════ */

/* ── Le contraste, calculé comme la norme le définit ── */
function lineaire(c: number): number {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}
function luminance([r, g, b]: number[]): number {
  return 0.2126 * lineaire(r) + 0.7152 * lineaire(g) + 0.0722 * lineaire(b);
}
function contraste(a: number[], b: number[]): number {
  const l1 = luminance(a), l2 = luminance(b);
  const [h, l] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (h + 0.05) / (l + 0.05);
}
function parseCouleur(s: string): number[] | null {
  const m = s.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/);
  if (m) return [Number(m[1]), Number(m[2]), Number(m[3])];
  const h = s.match(/^#([0-9a-f]{6})$/i);
  if (h) return [0, 2, 4].map((i) => parseInt(h[1].slice(i, i + 2), 16));
  return null;
}
function hexVers(s: string): number[] {
  return [0, 2, 4].map((i) => parseInt(s.slice(1 + i, 3 + i), 16));
}
/* Mesurer APRÈS que le thème est posé : l'attribut data-theme se pose
   dans un effet parent, qui court après ceux des enfants — lire les
   styles au même instant, c'est lire le thème d'avant. On attend donc
   deux images avant chaque relevé. */
function useMesure(cle: string, lire: () => void) {
  useEffect(() => {
    const t = setTimeout(lire, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cle]);
}

function versHex(c: number[]): string {
  return "#" + c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase();
}
function versHsl([r, g, b]: number[]): string {
  const R = r / 255, G = g / 255, B = b / 255;
  const mx = Math.max(R, G, B), mn = Math.min(R, G, B);
  const l = (mx + mn) / 2, d = mx - mn;
  let h = 0, sa = 0;
  if (d) {
    sa = d / (1 - Math.abs(2 * l - 1));
    h = mx === R ? ((G - B) / d) % 6 : mx === G ? (B - R) / d + 2 : (R - G) / d + 4;
    h = Math.round(h * 60); if (h < 0) h += 360;
  }
  return `HSL ${h}, ${Math.round(sa * 100)}%, ${Math.round(l * 100)}%`;
}
function fmt(r: number): string {
  return r > 0 ? `${r.toFixed(2).replace(".", ",")}:1` : "—";
}
/* Résout un jeton dans le thème de l'élément hôte — une sonde éphémère,
   lue par le moteur de rendu lui-même. */
function resoudre(host: HTMLElement, variable: string): number[] | null {
  const sonde = document.createElement("span");
  host.appendChild(sonde);
  sonde.style.color = `var(${variable})`;
  const v = parseCouleur(getComputedStyle(sonde).color);
  host.removeChild(sonde);
  return v;
}

/* ── La table complète des paires déclarées (C7) — au répertoire ── */
const PAIRES: [string, string, string, number][] = [
  ["--text-primary", "--bg", "l'encre sur le blanc", 4.5],
  ["--text-primary", "--surface", "l'encre sur le gris posé", 4.5],
  ["--text-secondary", "--bg", "le texte second sur le blanc", 4.5],
  ["--text-secondary", "--surface", "le texte second sur le gris", 4.5],
  ["--text-tertiary", "--bg", "le petit texte indicatif sur le blanc — objets secondaires, jamais du texte lu", 3],
  ["--text-tertiary", "--surface", "le petit texte indicatif sur le gris", 3],
  ["--primary-text", "--bg", "le lien sur le blanc", 4.5],
  ["--primary-text", "--surface", "le lien sur le gris", 4.5],
  ["--primary-text-hover", "--bg", "le lien survolé", 4.5],
  ["--on-primary", "--primary", "le texte sur la marque pleine", 4.5],
  ["--primary-text", "--primary-subtle", "le badge sur son fond doux", 4.5],
  ["--on-primary-subtle", "--primary-subtle", "le texte sur fond doux", 4.5],
  ["--on-danger-subtle", "--danger-subtle", "l'encre danger sur son fond doux", 4.5],
  ["--on-danger", "--danger", "le texte sur danger plein", 4.5],
  ["--on-success-subtle", "--success-subtle", "l'encre success sur son fond doux", 4.5],
  ["--on-success", "--success", "le texte sur success plein", 4.5],
  ["--on-warning-subtle", "--warning-subtle", "l'encre warning sur son fond doux", 4.5],
  ["--on-warning", "--warning", "le texte sur warning plein", 4.5],
  ["--on-info-subtle", "--info-subtle", "l'encre info sur son fond doux", 4.5],
  ["--on-info", "--info", "le texte sur info plein", 4.5],
  ["--border-strong", "--bg", "la bordure délimitante (3:1)", 3],
  ["--focus-ring", "--bg", "le trait clavier du halo de focus, marque, sur le blanc (3:1)", 3],
  ["--focus-ring", "--surface", "le trait clavier du halo de focus, marque, sur le gris (3:1)", 3],
  ["--focus-ring-danger", "--bg", "le trait clavier du halo, rouge, sur le blanc (3:1)", 3],
  ["--focus-ring-danger", "--surface", "le trait clavier du halo, rouge, sur le gris (3:1)", 3],
  ["--focus-ring-neutral", "--bg", "le trait clavier du halo, neutre, sur le blanc (3:1)", 3],
  ["--focus-ring-neutral", "--surface", "le trait clavier du halo, neutre, sur le gris (3:1)", 3],
];

const REGLES: { id: string; nom: string; titre: string; enonce: string; pourquoi?: string; div?: string; src: { t: string; h: string }[] }[] = [
  { id: "p01", nom: "principe", titre: "Par rôle, jamais par valeur",
    enonce: "La couleur s'applique par rôle, jamais par valeur — et un rôle ne porte jamais deux sens. Chaque fois qu'une valeur est choisie « parce qu'elle est jolie ici », c'est le signe qu'un rôle manque ou qu'un registre fuit.",
    src: [{ t: "Material 3 — color roles", h: "https://developer.android.com/design/ui/mobile/guides/styles/color" }, { t: "GOV.UK — Colour", h: "https://design-system.service.gov.uk/styles/colour/" }] },
  { id: "c1", nom: "C1", titre: "La valeur vit dans un seul fichier",
    enonce: "Le rôle d'une couleur et sa valeur sont deux décisions distinctes : les composants référencent le rôle, la valeur vit dans une source unique et peut changer entièrement sans qu'aucune règle bouge.",
    pourquoi: "Un composant qui référence un rôle survit au rebranding ; un composant qui référence un bleu meurt avec lui. Et une valeur en dur ignore les thèmes : elle resterait claire quand la page bascule en sombre.",
    src: [{ t: "Polaris — color-no-hex (interdit outillé)", h: "https://polaris.shopify.com/tools/stylelint-polaris/rules/color-color-no-hex" }, { t: "Atlassian — color foundations", h: "https://atlassian.design/foundations/color" }] },
  { id: "c2", nom: "C2", titre: "Trois registres étanches",
    enonce: "La palette se répartit en trois registres — marque, sémantique, neutres — et chaque jeton appartient à exactement un.",
    pourquoi: "La marque porte l'identité, la sémantique porte un état, les neutres structurent la page. Trois responsabilités, trois familles, aucun jeton à cheval.",
    src: [{ t: "Atlassian — color foundations", h: "https://atlassian.design/foundations/color" }, { t: "Polaris — Colors", h: "https://polaris.shopify.com/design/colors" }] },
  { id: "c3", nom: "C3", titre: "Une couleur ne change jamais de registre",
    enonce: "Jamais la marque pour un état, jamais un état pour du décor — dans les deux sens.",
    pourquoi: "La charte le dit en une phrase : les mélanger, c'est confondre « c'est nous » et « il se passe quelque chose ».",
    src: [{ t: "Atlassian — « don't use an accent when the color has semantic meaning »", h: "https://atlassian.design/foundations/color" }] },
  { id: "c4", nom: "C4", titre: "Un jeton naît d'un besoin réel",
    enonce: "Le registre marque se limite aux rôles fonctionnels existants ; une teinte purement décorative ne reçoit pas de jeton — et un rôle sans consommateur ne reste pas.",
    div: "Deux rôles de marque, deux métiers : primary, l'action — tenue en réserve, 5 % de la page — et accent, la voix graphique, un choix d'auteur (illustrations, animations, marketing, graphiques), souverain et hors contrat fonctionnel : il peut approcher un ton sémantique, ils ne vivent jamais au même endroit. Le focus, lui, est un halo de la famille de l'objet — neutre, marque ou rouge — dont le trait clavier est sous contrat (focus-ring, focus-ring-danger, focus-ring-neutral) ; le trait du clic, pâle, est hors contrat, dit.",
    src: [{ t: "Règle interne du système (précédent journalisé)", h: "#" }] },
  { id: "c5", nom: "C5", titre: "Le couple complet dès la naissance",
    enonce: "Toute nouvelle valeur sémantique fournit son couple texte/fond subtil d'emblée ; les neutres vivent en échelle.",
    src: [{ t: "Règle interne du système (héritée du bouton)", h: "#" }] },
  { id: "c6", nom: "C6", titre: "Le canal redondant se déclare",
    enonce: "Chaque usage sémantique de la couleur déclare un canal non chromatique — icône, mot ou forme — qui ne se retire jamais pour alléger. C'est la moitié vérifiable du principe cardinal : jamais la couleur seule.",
    pourquoi: "Environ 8 % des hommes ont une déficience rouge-vert. Le contraste rend le texte lisible ; il ne distingue pas un rouge d'un vert pour qui ne voit pas la différence. Deux exigences indépendantes.",
    src: [{ t: "WCAG 1.4.1 — Use of Color", h: "https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html" }] },
  { id: "c7", nom: "C7", titre: "Le contraste se vérifie par paire",
    enonce: "Un jeton de texte n'est jamais conforme dans l'absolu — il l'est sur un fond donné. Chaque jeton de texte déclare ses fonds d'usage ; tout fond non déclaré est interdit.",
    pourquoi: "Le cas vécu : un vert conforme sur blanc, qu'il a fallu recalibrer pour tenir sur son propre fond doux — au ras du seuil, et c'est écrit.",
    src: [{ t: "WCAG 1.4.3 — Contrast (Minimum)", h: "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html" }, { t: "WCAG — définition du rapport de contraste", h: "https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio" }] },
  { id: "c8", nom: "C8", titre: "Le survol testé au même seuil",
    enonce: "La norme exempte le survol ; ce système le teste quand même — un survol illisible reste un survol raté.",
    div: "Sur-exigence assumée, dite comme telle : WCAG 1.4.11 exempte explicitement l'état de survol. La paire du survol vit dans la table, au même seuil que le repos.",
    src: [{ t: "WCAG 1.4.11 — Non-text Contrast (l'exemption)", h: "https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html" }] },
  { id: "c9", nom: "C9", titre: "Aucun jeton de texte sous le seuil",
    enonce: "Aucun jeton de texte du registre ne descend sous le seuil de lisibilité sur ses fonds déclarés, dans les deux thèmes.",
    div: "Arbitrage d'Auteur du 13 août, renversement dit : « métadonnées accessoires » n'est pas une exception de la norme. Le gris pâle de la charte (2,54:1 sur blanc) ne porte jamais un texte — ici il n'a même pas de jeton : la hiérarchie se joue par le corps et la graisse, pas par la pâleur.",
    src: [{ t: "WCAG 1.4.3 — les trois exceptions", h: "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html" }] },
  { id: "c10", nom: "C10", titre: "Les états sont des jetons, pas des calculs",
    enonce: "Les états interactifs sont portés par des jetons dédiés, jamais calculés à la volée dans une feuille de style — ni filtre, ni assombrissement calculé.",
    pourquoi: "Une couleur produite par un filtre n'existe dans aucun registre : aucune table de paires ne peut la vérifier, aucun instrument ne peut la voir.",
    src: [{ t: "Règle interne du système", h: "#" }] },
  { id: "c11", nom: "C11", titre: "Le désactivé attend son besoin",
    enonce: "L'état désactivé n'a pas de jetons tant qu'aucun composant ne documente un besoin légitime ; le jour venu, le couple complet fond/texte/bordure naît en une seule fois.",
    src: [{ t: "WCAG 1.4.3 — exemption des composants inactifs", h: "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html" }] },
  { id: "c12", nom: "C12", titre: "Un jeton, une valeur par thème",
    enonce: "Dans un système à thèmes, chaque jeton de couleur résout une valeur par thème déclaré — c'est la condition d'existence d'un second thème.",
    src: [{ t: "Carbon — Themes", h: "https://carbondesignsystem.com/elements/themes/overview/" }, { t: "Atlassian — color foundations", h: "https://atlassian.design/foundations/color" }] },
  { id: "c13", nom: "C13", titre: "Le sombre est couvert, et vérifié comme le clair",
    enonce: "Chaque rôle résout une valeur en clair et en sombre, le thème sombre s'active sur la préférence du système, et les seuils se vérifient thème par thème.",
    src: [{ t: "MDN — prefers-color-scheme", h: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme" }] },
  { id: "c14", nom: "C14", titre: "Les deux textes garantis, du même côté",
    enonce: "Deux textes garantis sur un même fond ne peuvent tous deux atteindre le seuil que s'ils tombent du même côté de l'échelle de luminance — d'où la contrainte démontrée : un thème sombre ne peut pas avoir une couleur d'action sombre.",
    pourquoi: "Ce n'est pas un goût, c'est un calcul : avec une action sombre, aucun texte représentable ne tient 4,5:1 à la fois sur elle et sur le fond quasi noir. L'action s'éclaircit en sombre, par construction.",
    src: [{ t: "WCAG — définition du rapport de contraste", h: "https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio" }] },
  { id: "c15", nom: "C15", titre: "Teinter un neutre ne coûte rien, à luminance constante",
    enonce: "Le rapport de contraste ne dépend que de la luminance relative ; teinter un neutre en conservant sa luminance ne change aucun rapport — l'opération est sûre par construction.",
    src: [{ t: "WCAG — relative luminance", h: "https://www.w3.org/TR/WCAG22/#dfn-relative-luminance" }, { t: "CSS Color 4 — oklch()", h: "https://www.w3.org/TR/css-color-4/" }] },
  { id: "m2", nom: "M2", titre: "Jamais de texte nu sur image",
    enonce: "Sur une image imprévisible, le texte reçoit un voile calculé ou sort du média ; le contraste se juge au pire pixel derrière lui, jamais à la moyenne.",
    pourquoi: "Une photo n'a pas de valeur : elle en a des milliers. Le seul rapport qui compte est celui du pixel le plus défavorable sous chaque lettre.",
    src: [{ t: "WCAG 1.4.3 — Contrast (Minimum), texte sur image", h: "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html" }] },
  { id: "m3", nom: "M3", titre: "Le voile est un calcul",
    enonce: "L'opacité du voile est calculée sur le pire pixel derrière chaque zone de texte, et revérifiée à chaque format — le cadrage déplace le pire pixel.",
    div: "Ici : la photo est redessinée telle que cadrée, les pixels derrière la bande sont lus, et l'opacité minimale qui fait tenir l'encre à 4,5:1 est cherchée par dichotomie, à chaque largeur et à chaque thème. La card dit le résultat.",
    src: [{ t: "Règle interne du système (mesure de rendu)", h: "#" }] },
  { id: "c16", nom: "C16", titre: "Les couleurs forcées ne se neutralisent jamais",
    enonce: "Quand le système d'exploitation force ses couleurs, la palette disparaît — on ne neutralise jamais ce mode, et l'interface s'appuie sur ce qui survit : la sémantique, les bordures, le texte.",
    src: [{ t: "MDN — @media (forced-colors)", h: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors" }, { t: "MDN — forced-color-adjust", h: "https://developer.mozilla.org/en-US/docs/Web/CSS/forced-color-adjust" }] },
  { id: "c17", nom: "C17", titre: "Le tertiaire est une intention, jamais un défaut",
    enonce: "L'encre tertiaire — le gris le plus clair qui tienne encore 3:1 sur le fond le plus dur — ne s'emploie que sur un objet secondaire : kicker, fiche, légende, méta, pied, index de menu. Jamais sur du texte lu, jamais sous le cran étiquette, jamais un seul rapport sous 3:1. En petit — au cran étiquette ou au petit cran —, il porte un cran de graisse de plus que le texte qu'il accompagne (600 au moins, 700 pour un kicker mono) : l'œil retrouve en épaisseur ce que l'encre a cédé en contraste. Chaque emploi est dit là où il est écrit : en CSS, la ligne qui pose le tertiaire porte « tertiaire : » et ce que c'est ; aucun style en ligne ne le pose.",
    pourquoi: "Un gris clair est une décision de hiérarchie, pas une valeur par défaut. Sans la mention, un tertiaire posé sur une phrase par commodité passerait pour un texte second qui a pâli — et le vérificateur ne pourrait pas le distinguer. La mention rend l'intention lisible par un humain et comptable par la machine. La graisse en plus est la contrepartie de l'encre claire : elle aide à lire sans assombrir, donc sans rapprocher le tertiaire du secondaire — le même principe que la norme, qui admet un contraste moindre dès que le texte est gras.",
    div: "Arbitrages d'Auteur des 25 et 26 août 2026 : « limite côté lisibilité, mais ce sont des objets secondaires », puis, sur pièce, « aider le lecteur avec une fonte légèrement plus grasse pour les éléments petits en tertiaire ». Le rapport de 3:1 est celui que WCAG réserve aux grands textes et aux objets d'interface ; ici il est étendu, par décision dite, aux petites étiquettes qui n'ont pas à être lues en premier.",
    src: [{ t: "WCAG 2.2 — 1.4.3 Contrast (Minimum)", h: "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html" }, { t: "WCAG 2.2 — 1.4.11 Non-text Contrast", h: "https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html" }] },
];

function Regles({ ids }: { ids: string[] }) {
  return (
    <div style={{ display: "grid", gap: "var(--gap-1-block)" }}>
      {ids.map((id) => REGLES.find((r) => r.id === id)!).map((r) => (
        <div key={r.id} style={{ display: "grid", gap: "var(--gap-3-block)", maxWidth: "var(--measure)" }}>
          <b style={{ color: "var(--text-primary)" }}><span className="badge">{r.nom}</span> {r.titre}</b>
          <span>{r.enonce}</span>
          {r.pourquoi && <span className="sourd">{r.pourquoi}</span>}
          {r.div && <div className="divergence" style={{ fontSize: "var(--font-size-small)" }}>{r.div}</div>}
          <span style={{ fontSize: "var(--font-size-small)" }}>Sources : {r.src.map((sc, i) => (
            <span key={sc.t}>{i > 0 && " · "}{sc.h === "#" ? sc.t : <a href={sc.h}>{sc.t}</a>}</span>
          ))}</span>
        </div>
      ))}
    </div>
  );
}

/* ── PREUVE 1 · SITUATION — la mosaïque de la charte, branchée sur les
   jetons vivants : chaque rôle occupe sa part réelle de l'écran. ── */
const TUILES: { nom: string; jeton: string; sur: string; col: string; row: string; registre: string; bord?: boolean }[] = [
  { nom: "primary", jeton: "--primary", sur: "--on-primary", col: "1 / 8", row: "1", registre: "marque" },
  { nom: "background", jeton: "--bg", sur: "--text-primary", col: "8 / 13", row: "1", registre: "neutre", bord: true },
  { nom: "primary-subtle", jeton: "--primary-subtle", sur: "--on-primary-subtle", col: "1 / 4", row: "2 / 4", registre: "marque" },
  { nom: "text-primary", jeton: "--text-primary", sur: "--bg", col: "4 / 13", row: "2", registre: "neutre" },
  { nom: "surface", jeton: "--surface", sur: "--text-primary", col: "4 / 9", row: "3", registre: "neutre", bord: true },
  { nom: "border-strong", jeton: "--border-strong", sur: "--bg", col: "9 / 13", row: "3", registre: "neutre" },
];
const PROPORTIONS: { nom: string; jeton: string; sur: string; part: number; bord?: boolean }[] = [
  { nom: "background", jeton: "--bg", sur: "--text-primary", part: 56, bord: true },
  { nom: "surface", jeton: "--surface", sur: "--text-primary", part: 18, bord: true },
  { nom: "text-primary", jeton: "--text-primary", sur: "--bg", part: 14 },
  { nom: "border-strong", jeton: "--border-strong", sur: "--bg", part: 7 },
  { nom: "primary", jeton: "--primary", sur: "--on-primary", part: 5 },
];

function Palette({ cle }: { cle: string }) {
  /* Le graphisme EXACT de la charte (verdict d'Auré, 24 août : « j'aimais
     beaucoup ce graphisme exactement ») : tuiles pleines sans écart, nom en
     haut à gauche, specs mono en bas à droite — mais branché sur les jetons
     vivants : les valeurs affichées sont lues sur la page rendue. */
  const ref = useRef<HTMLDivElement>(null);
  const [vue, setVue] = useState<"mosaique" | "proportions">("mosaique");
  const [rgbs, setRgbs] = useState<Record<string, number[]>>({});
  const [copie, setCopie] = useState<string | null>(null);
  useMesure(cle, () => {
    if (!ref.current) return;
    const v: Record<string, number[]> = {};
    TUILES.forEach((t) => { const c = resoudre(ref.current!, t.jeton); if (c) v[t.jeton] = c; });
    setRgbs(v);
  });
  const copier = (jeton: string) => {
    const c = rgbs[jeton];
    if (c) navigator.clipboard?.writeText(versHex(c)).catch(() => {});
    setCopie(jeton); setTimeout(() => setCopie(null), 1400);
  };
  const specs = (jeton: string) => {
    const c = rgbs[jeton];
    return c
      ? [`color.${jeton.slice(2) === "bg" ? "background" : jeton.slice(2)}`, versHex(c), versHsl(c), `RGB ${c.map(Math.round).join(", ")}`]
      : ["…"];
  };
  return (
    <div ref={ref} style={{ width: "100%", display: "grid", gap: "var(--gap-2-block)" }}>
      <div className="rang" style={{ gap: "var(--gap-3-inline)" }}>
        {([["mosaique", "Mosaïque"], ["proportions", "Proportions"]] as const).map(([v, nom]) => (
          /* commandes secondaires d'une tête d'outil : la cible compacte */
          <button key={v} className={`bouton ${vue === v ? "on" : ""}`} style={{ height: "var(--control-height-compact)", padding: "0 var(--pad-3-inline)", fontSize: "var(--font-size-small)" }} onClick={() => setVue(v)}>{nom}</button>
        ))}
      </div>
      {vue === "mosaique" ? (
        <div className="cm-mos">
          {TUILES.map((t) => (
            <button key={t.jeton} className="cm-tuile" onClick={() => copier(t.jeton)}
              title={`Copier ${rgbs[t.jeton] ? versHex(rgbs[t.jeton]) : ""}`}
              style={{ gridColumn: t.col, gridRow: t.row, background: `var(${t.jeton})`, color: `var(${t.sur})`,
                boxShadow: t.bord ? "inset 0 0 0 1px var(--border)" : undefined }}>
              <span className="cm-nom">{copie === t.jeton ? "Copié ✓" : t.nom}</span>
              <span className="cm-specs">{specs(t.jeton).map((l) => <span key={l}>{l}</span>)}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="cm-props">
          {PROPORTIONS.map((t) => (
            <button key={t.jeton} className={`cp-col ${t.part < 10 ? "etroite" : ""}`} onClick={() => copier(t.jeton)}
              title={`Copier ${rgbs[t.jeton] ? versHex(rgbs[t.jeton]) : ""}`}
              style={{ flexBasis: `${t.part}%`, background: `var(${t.jeton})`, color: `var(${t.sur})`,
                boxShadow: t.bord ? "inset 0 0 0 1px var(--border)" : undefined }}>
              <span className="cp-meta">
                <span className="cp-nom">{copie === t.jeton ? "Copié ✓" : t.nom}</span>
                <span className="cp-hex">{rgbs[t.jeton] ? versHex(rgbs[t.jeton]) : "…"}</span>
              </span>
              <span className="cp-pct">{t.part} %</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── La table des rôles, à plat sous la mosaïque (verdict d'Auré :
   jamais dans un dépliant). Les deux colonnes de thème sont lues sur
   des hôtes thématisés — la table ne recopie rien. ── */
const ROLES_TABLE: [string, string][] = [
  ["primary", "--primary"], ["on-primary", "--on-primary"],
  ["primary-subtle", "--primary-subtle"], ["background", "--bg"],
  ["surface", "--surface"], ["text-primary", "--text-primary"],
  ["text-secondary", "--text-secondary"], ["text-tertiary", "--text-tertiary"], ["border", "--border"],
  ["border-strong", "--border-strong"],
  ["danger / subtil", "--danger"], ["success / subtil", "--success"],
  ["warning / subtil", "--warning"], ["on-warning-subtle", "--on-warning-subtle"], ["info / subtil", "--info"],
];
const SUBTILS: Record<string, string> = {
  "danger / subtil": "--danger-subtle", "success / subtil": "--success-subtle",
  "warning / subtil": "--warning-subtle", "info / subtil": "--info-subtle",
};
function TableRoles({ cle }: { cle: string }) {
  const clairRef = useRef<HTMLDivElement>(null);
  const sombreRef = useRef<HTMLDivElement>(null);
  const [vals, setVals] = useState<Record<string, { clair: (string | null)[]; sombre: (string | null)[] }>>({});
  useMesure(cle, () => {
    const lire = (host: HTMLElement | null, variable: string) => {
      if (!host) return "…";
      const c = resoudre(host, variable);
      return c ? versHex(c) : "…";
    };
    const v: Record<string, { clair: (string | null)[]; sombre: (string | null)[] }> = {};
    ROLES_TABLE.forEach(([nom, variable]) => {
      const sub = SUBTILS[nom] ?? null;
      v[nom] = {
        clair: [lire(clairRef.current, variable), sub ? lire(clairRef.current, sub) : null],
        sombre: [lire(sombreRef.current, variable), sub ? lire(sombreRef.current, sub) : null],
      };
    });
    setVals(v);
  });
  const PASTILLE = "0.75rem"; // hors chaîne : silhouette de la pastille de couleur (un carré de texte)
  const Pastille = ({ hex }: { hex: string }) => (
    <span aria-hidden="true" style={{ display: "inline-block", width: PASTILLE, height: PASTILLE,
      borderRadius: "var(--r-4)", border: "1px solid var(--border)", background: hex.split(" ")[0],
      verticalAlign: "-1px", marginRight: "var(--gap-3-inline)" }} />
  );
  /* Chaque valeur porte son carre, le subtil comme le ton, et le meme
     separateur que le nom du role : la barre oblique. */
  const Valeurs = ({ v }: { v?: (string | null)[] }) => v ? (
    <>
      <Pastille hex={v[0] ?? "#fff"} />{v[0]}
      {v[1] ? <><span className="sourd" style={{ margin: "0 var(--gap-3-inline)" }}>/</span><Pastille hex={v[1]} />{v[1]}</> : null}
    </>
  ) : <>{"…"}</>;
  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <div ref={clairRef} data-theme="light" hidden />
      <div ref={sombreRef} data-theme="dark" hidden />
      <table className="tableau aere" style={{ width: "100%" }}>
        <thead><tr><th>rôle</th><th>clair</th><th>sombre</th></tr></thead>
        <tbody>
          {ROLES_TABLE.map(([nom]) => (
            <tr key={nom}>
              <td className="mono">{nom}</td>
              <td className="mono"><Valeurs v={vals[nom]?.clair} /></td>
              <td className="mono"><Valeurs v={vals[nom]?.sombre} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── PREUVE 2 · VARIATION — le moteur : trois marques, trois familles.
   Les valeurs affichées sortent de derive() en direct — générées par le
   moteur, jamais posées à la main : c'est lui, le sujet de la preuve. ── */
function TableauPaires({ cle }: { cle: string }) {
  const clairRef = useRef<HTMLDivElement>(null);
  const sombreRef = useRef<HTMLDivElement>(null);
  const [lignes, setLignes] = useState<{ clair: number; sombre: number }[]>([]);
  useMesure(cle, () => {
    const lire = (host: HTMLDivElement | null) =>
      PAIRES.map(([texte, fond]) => {
        if (!host) return 0;
        const a = resoudre(host, texte), b = resoudre(host, fond);
        return a && b ? contraste(a, b) : 0;
      });
    const clair = lire(clairRef.current), sombre = lire(sombreRef.current);
    setLignes(PAIRES.map((_, i) => ({ clair: clair[i], sombre: sombre[i] })));
  });
  const Cellule = ({ r, seuil }: { r: number; seuil: number }) => (
    <td><span className={`badge ${r > 0 && r < seuil ? "ko" : ""}`}>{fmt(r)}</span></td>
  );
  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <div ref={clairRef} data-theme="light" hidden />
      <div ref={sombreRef} data-theme="dark" hidden />
      <table className="tableau" style={{ width: "100%" }}>
        <thead><tr><th>Paire déclarée</th><th>Seuil</th><th>Thème clair</th><th>Thème sombre</th></tr></thead>
        <tbody>
          {PAIRES.map(([texte, fond, libelle, seuil], i) => (
            <tr key={libelle}>
              <td style={{ whiteSpace: "normal" }}>{libelle}<br />
                <span className="mono" style={{ color: "var(--text-secondary)", fontWeight: 400, fontSize: "var(--font-size-label)" }}>{texte} / {fond}</span></td>
              <td className="mono" style={{ color: "var(--text-secondary)" }}>{seuil === 3 ? "3:1" : "4,5:1"}</td>
              <Cellule r={lignes[i]?.clair ?? 0} seuil={seuil} />
              <Cellule r={lignes[i]?.sombre ?? 0} seuil={seuil} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── PREUVE · VOCABULAIRE — le nuancier : six rôles en languettes aux
   proportions identiques (verdicts d'Auré, 24 août). Chaque languette est
   un couple complet — le ton, son encre, son fond doux — et sa fiche lit
   les valeurs et le rapport sur la page rendue. ── */
type Languette = { art: string; mot: string; nom: string; ton: string; surTon: string; doux: string; surDoux: string; jeton: string; phraseTon: string; phraseDoux: string };
const LANGUETTES: Languette[] = [
  { art: "La", mot: "marque", nom: "La marque", ton: "--primary", surTon: "--on-primary", doux: "--primary-subtle", surDoux: "--on-primary-subtle", jeton: "primary",
    phraseTon: "Elle signe. Un seul grand geste par écran.", phraseDoux: "La marque murmurée." },
  { art: "Le", mot: "danger", nom: "Le danger", ton: "--danger", surTon: "--on-danger", doux: "--danger-subtle", surDoux: "--on-danger-subtle", jeton: "danger",
    phraseTon: "Il arrête. Jamais dépensé pour décorer.", phraseDoux: "La faute expliquée posément." },
  { art: "Le", mot: "succès", nom: "Le succès", ton: "--success", surTon: "--on-success", doux: "--success-subtle", surDoux: "--on-success-subtle", jeton: "success",
    phraseTon: "Il confirme, puis se retire.", phraseDoux: "La conformité tranquille." },
  { art: "Le", mot: "neutre", nom: "Le neutre", ton: "--text-primary", surTon: "--bg", doux: "--surface", surDoux: "--text-secondary", jeton: "neutral",
    phraseTon: "Il se tait. C'est lui qui fait la page.", phraseDoux: "Fonds, filets, encres." },
  { art: "L’", mot: "information", nom: "L’information", ton: "--info", surTon: "--on-info", doux: "--info-subtle", surDoux: "--on-info-subtle", jeton: "info",
    phraseTon: "Elle renseigne — avec son propre bleu, jamais celui d’une marque.", phraseDoux: "La note en passant." },
  { art: "L’", mot: "avertissement", nom: "L’avertissement", ton: "--warning", surTon: "--on-warning", doux: "--warning-subtle", surDoux: "--on-warning-subtle", jeton: "warning",
    phraseTon: "Il prévient sans crier.", phraseDoux: "Le doute encore réparable." },
];

/* Deux groupes, et la coupure est celle du JUGEMENT : trois familles ne
   jugent rien — la marque signe, le neutre fait la page, l’information
   passe une note — et trois rendent un verdict sur ce que la personne
   vient de faire. Les voir séparés évite la faute la plus commune :
   dépenser un verdict là où il n’y a rien à juger. */
const GROUPES: { titre: string; jetons: string[] }[] = [
  { titre: "Ce qui ne juge pas", jetons: ["primary", "neutral", "info"] },
  { titre: "Les trois verdicts", jetons: ["danger", "success", "warning"] },
];

/* Les six signes — tracés d’une seule main : même grille de 24, même
   trait, mêmes bouts ronds. Chacun dit ce que sa famille FAIT, pas ce
   qu’elle est : la plume signe, la barre arrête, la coche confirme, la
   trame se tait, le i renseigne, le triangle prévient. */
const SIGNES: Record<string, ReactNode> = {
  primary: <><path d="M4.6 19.4l1.6-4.6L15 6a2.1 2.1 0 013 3l-8.8 8.8z" /><path d="M13.4 7.6l3 3" /></>,
  danger: <><circle cx="12" cy="12" r="8.4" /><path d="M8 12h8" /></>,
  success: <><circle cx="12" cy="12" r="8.4" /><path d="M8.2 12.4l2.6 2.6 5-5.4" /></>,
  neutral: <><path d="M4.6 7h14.8" /><path d="M4.6 12h14.8" /><path d="M4.6 17h9.4" /></>,
  info: <><circle cx="12" cy="12" r="8.4" /><path d="M12 11.2v5.2" /><path d="M12 7.8v.01" /></>,
  warning: <><path d="M12 4.4l8.2 14.9H3.8z" /><path d="M12 10.2v4" /><path d="M12 16.9v.01" /></>,
};
function Nuancier({ cle }: { cle: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [fiches, setFiches] = useState<Record<string, string>>({});
  useMesure(cle, () => {
    if (!ref.current) return;
    const v: Record<string, string> = {};
    LANGUETTES.forEach((l) => {
      const ton = resoudre(ref.current!, l.ton), doux = resoudre(ref.current!, l.doux), sur = resoudre(ref.current!, l.surDoux);
      if (ton && doux && sur) v[l.jeton] = `${l.jeton} · ${versHex(ton)} · doux ${versHex(doux)} · ${fmt(contraste(sur, doux))}`;
    });
    setFiches(v);
  });
  /* Six lignes en deux groupes : le fond doux parle, le ton signe. Au
     survol — ou au clavier, la phrase du ton doit être atteignable
     autrement qu'à la souris — le ton prend la majorité de la ligne et dit
     sa phrase. Le rang court sur les six : l'ouverture est un seul geste,
     pas deux cascades qui partent en même temps. */
  const parJeton = new Map(LANGUETTES.map((l) => [l.jeton, l]));
  let rang = 0;
  return (
    <div ref={ref} className="gd-nuancier">
      {GROUPES.map((g) => (
        <section key={g.titre} className="gd-nfam">
          <p className="mono sourd gd-nfam-titre">{g.titre}</p>
          <div className="gd-nfam-lignes" role="list" aria-label={g.titre}>
            {g.jetons.map((j) => {
              const l = parJeton.get(j)!;
              const i = rang++;
              return (
                <div key={l.jeton} className="gd-lng" role="listitem" tabIndex={0}
                  style={{ ["--rang" as string]: i }}
                  aria-label={`${l.nom}. ${l.phraseDoux} ${l.phraseTon} ${fiches[l.jeton] ?? ""}`}>
                  <div className="gd-lng-doux" style={{ background: `var(${l.doux})`, color: `var(${l.surDoux})` }}>
                    <p className="gd-lng-titre" aria-hidden="true"><span>{l.art}</span><b>{l.mot}</b></p>
                    <span className="gd-lng-dit" aria-hidden="true">{l.phraseDoux}</span>
                    <div className="gd-lng-fiche" aria-hidden="true">{fiches[l.jeton] ?? "…"}</div>
                  </div>
                  <div className="gd-lng-ton" style={{ background: `var(${l.ton})`, color: `var(${l.surTon})` }}>
                    <svg className="gd-lng-signe" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      {SIGNES[l.jeton]}
                    </svg>
                    <span className="gd-lng-tondit" aria-hidden="true">{l.phraseTon}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

/* ── PREUVE · OBJET EN SITUATION — le tableau des départs (24 août).
   Un tableau de gare annonce des trains à des gens pressés — dont un
   voyageur sur douze ne distingue pas le rouge du vert. Le tableau vit
   en thème sombre par nature : ses jetons sont ceux du thème sombre du
   kit, résolus par data-theme. L'indication n'apparaît qu'à la casse. ── */
/* ── PREUVE · VARIATION — deux thèmes, une exigence (24 août). La même
   card, clair et sombre : chaque panneau EST son thème (data-theme), et
   les rapports sont mesurés dedans, sur la page rendue. La casse pâlit
   l'encre douce avec le gris que le registre refuse — et le verdict tombe. ── */
const PAIRES_DUO: [string, string, string][] = [
  ["l'encre sur la card", "--text-primary", "--surface"],
  ["l'encre douce", "--text-secondary", "--surface"],
  ["le texte sur la marque", "--on-primary", "--primary"],
];
/* ── La scène du contraste par paire ──
   UN seul panneau, dans le thème où le lecteur se trouve. Il y en avait
   deux, clair et sombre, empilés : le second n'apportait rien ici — la
   règle démontrée est « une couleur seule ne veut rien dire, ce qui se
   mesure c'est un texte SUR son fond », et elle se démontre entièrement
   sur un panneau. Les deux thèmes ont déjà leur bande à eux, et la table
   des paires les couvre tous les deux (verdict d'Auteur, 2 septembre —
   dit trois fois avant que je l'entende). */
function DuoThemes({ cle, palie }: { cle: string; palie: boolean }) {
  const hote = useRef<HTMLDivElement>(null);
  const [mes, setMes] = useState<number[]>([]);
  useMesure(`${cle}-${palie}`, () => {
    const host = hote.current;
    setMes(PAIRES_DUO.map(([, t, f]) => {
      if (!host) return 0;
      const a = resoudre(host, t), b = resoudre(host, f);
      return a && b ? contraste(a, b) : 0;
    }));
  });
  /* casse : le gris pâle que le registre refuse, posé de force (l'élément le déclare) */
  const paliStyle: React.CSSProperties = { ["--text-secondary" as string]: "#9CA3AF" };
  return (
    <div ref={hote} className="gd-pan" style={palie ? paliStyle : undefined}
      data-intent={palie ? "statement" : undefined}>
      <div className="gd-pan-carte">
        <span className="cl-pan-nom">Léa Fontan</span>
        <span className="cl-pan-role">UX Designer — chaque encre de cette card est mesurée sur le fond qui la porte.</span>
        {/* un bouton : le coin du composant, la marge de la row, la cible au doigt */}
        <span className="cl-pan-btn">Suivre</span>
      </div>
      <div className="cl-pan-mesures">
        {PAIRES_DUO.map(([nom], i) => {
          const r = mes[i] ?? 0;
          const ko = r > 0 && r < 4.5;
          return (
            <div key={nom} className="cl-pan-mesure">
              <span>{nom}</span>
              <span className={`badge ${ko ? "ko" : "bon"}`}>{fmt(r)}{ko ? " — sous le seuil, recalé d'office" : ""}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}


/* ── RÉPERTOIRE — les garde-fous, avec leurs casses quand elles existent ── */
function Alerte({ ton, couleurSeule, marque }: { ton: "danger" | "success"; couleurSeule: boolean; marque: boolean }) {
  const teinte = marque ? "--primary" : ton === "danger" ? "--danger" : "--success";
  const doux = marque ? "--primary-subtle" : ton === "danger" ? "--danger-subtle" : "--success-subtle";
  const texte = marque ? "--on-primary-subtle" : teinte;
  const icone = ton === "danger" ? "⚠" : "✓";
  const mot = ton === "danger" ? "Erreur" : "Succès";
  const msg = ton === "danger" ? "le dossier n'a pas pu être enregistré." : "le dossier est enregistré.";
  const FILET = "4px"; // hors chaîne : le filet d'accent de l'alerte, un trait épaissi
  /* une alerte est une card : le coin et la marge de la card */
  return (
    <div data-intent={marque ? "statement" : undefined} style={{ /* casse : la marque prêtée à un état */
      background: `var(${doux})`, color: couleurSeule ? "var(--text-primary)" : `var(${texte})`,
      border: `1px solid var(${teinte})`, borderInlineStart: `${FILET} solid var(${teinte})`,
      borderRadius: "var(--r-2)", padding: "var(--pad-2-block) var(--pad-2-inline)",
      fontSize: "var(--font-size-small)", width: "100%", textAlign: "left",
    }}>
      {couleurSeule
        ? <>Le dossier {ton === "danger" ? "n&apos;a pas pu être enregistré" : "est enregistré"}.</>
        : <><b>{icone} {mot}</b> — {msg}</>}
    </div>
  );
}

function MiniEcran({ cle }: { cle: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [r, setR] = useState(0);
  useMesure(cle, () => {
    if (!ref.current) return;
    const a = resoudre(ref.current, "--on-primary"), b = resoudre(ref.current, "--primary");
    if (a && b) setR(contraste(a, b));
  });
  return (
    /* le mini-écran est une card ; le bouton dedans prend le coin du composant et la cible au doigt */
    <div ref={ref} style={{
      background: "var(--bg)", color: "var(--text-primary)", border: "1px solid var(--border)",
      borderRadius: "var(--r-2)", padding: "var(--pad-2-block) var(--pad-2-inline)",
      display: "grid", gap: "var(--gap-3-block)", justifyItems: "start", textAlign: "left", minWidth: 0,
    }}>
      <span style={{
        background: "var(--primary)", color: "var(--on-primary)", borderRadius: "var(--r-ctl)",
        padding: "var(--pad-3-block) var(--pad-3-inline)", minHeight: "var(--control-height)", display: "inline-flex", alignItems: "center",
        fontWeight: 600, fontSize: "var(--font-size-small)",
      }}>Enregistrer</span>
      <span className={`badge ${r > 0 && r < 4.5 ? "ko" : ""}`}>
        {fmt(r)}{r > 0 && r < 4.5 ? " — illisible" : ""}
      </span>
    </div>
  );
}

/* Trois gris à la MÊME luminance — la teinte bouge, le rapport ne bouge
   pas. (Valeurs d'étude calées au calcul, pas des jetons.) */
const GRIS_TEINTES: [string, string][] = [["gris pur", "#6B7280"], ["gris chaud", "#78716A"], ["gris bleuté", "#67737F"]];
/* La casse : on teinte SANS tenir la luminance. Les trois gris restent des
   gris, ils se ressemblent encore — et pourtant leurs rapports n'ont plus
   rien à voir. C'est le geste que la règle interdit, commis pour de vrai.
   (Valeurs d'étude, hors registre ; les rapports affichés sont calculés
   sur ces valeurs, jamais recopiés.) */
const GRIS_DERIVES: [string, string][] = [["gris pur", "#6B7280"], ["gris chaud", "#A8A29E"], ["gris bleuté", "#475569"]];
function TeinteConstante({ casse }: { casse?: boolean }) {
  const arrondi = (hex: string) => (Math.round(contraste(hexVers(hex), hexVers("#FFFFFF")) * 10) / 10).toFixed(1).replace(".", ",");
  const gris = casse ? GRIS_DERIVES : GRIS_TEINTES;
  const rapports = gris.map(([, hex]) => arrondi(hex));
  const identiques = rapports.every((r) => r === rapports[0]);
  /* Le rapport de CHAQUE gris est posé sous sa tuile. Une phrase dans une
     pastille ne montrait pas le rapport entre trois nombres — elle le
     racontait, et débordait de sa colonne (verdict d'Auteur, 2 septembre).
     Trois nombres alignés sous trois tuiles qui se ressemblent : au repos
     ils sont identiques, cassés ils ne le sont plus, et ça se voit sans
     lire. Le verdict, lui, tient en cinq mots. */
  return (
    <div className="cl-teinte">
      <ol className="cl-teinte-gris">
        {gris.map(([nom, hex], i) => (
          <li key={nom} className="cl-teinte-gris-un">
            {/* étude : le « Aa » est blanc pur — la référence du rapport mesuré, pas un jeton */}
            <span className="cl-teinte-tuile" style={{ background: hex }}>Aa</span>
            <b className="mono cl-teinte-rapport">{rapports[i]}:1</b>
            <span className="mono cl-teinte-nom">{nom}</span>
          </li>
        ))}
      </ol>
      <span className={`badge ${identiques ? "bon" : "ko"}`}>
        {identiques ? "le même rapport pour les trois" : "trois rapports différents"}
      </span>
    </div>
  );
}

/* ── Les gammes 50–950 (décision d'Auteur, 25 août) : la couleur saisie
   se pose sur son cran — 50 très claire, 950 très sombre, 500 au milieu —
   et les autres crans se déduisent d'elle (kit/derivation.mjs). Le même
   graphisme pour les quatre gammes : la barre, les numéros dessous ; et,
   sous chaque numéro, le rôle qui se pose sur ce cran — en plein quand sa
   valeur EST le cran (au code près), précédé de ≈ quand il n'en est que
   le voisin de clarté. Un rôle ne consomme jamais un cran : la ligne dit
   où il vit, pas d'où il vient. Cliquer copie. ── */
type Poses = Record<string, { role: string; exact: boolean }[]>;
/* La famille du thème clair, lue comme un dictionnaire de rôles. */
const clair = (hex: string) => (derive(hex) as unknown as { light: Record<string, string> }).light;
function BarreGamme({ crans, poses }: { crans: [number, string][]; poses?: Poses }) {
  const [copie, setCopie] = useState<number | null>(null);
  const copier = (cran: number, hex: string) => {
    navigator.clipboard?.writeText(hex).catch(() => {});
    setCopie(cran); setTimeout(() => setCopie(null), 1200);
  };
  return (
    <div className="gm">
      <div className="gm-barre">
        {crans.map(([cran, hex]) => (
          <button key={cran} onClick={() => copier(cran, hex)} title={`Copier ${hex}`} aria-label={`${cran} — ${hex}`}
            style={{ background: hex }} />
        ))}
      </div>
      <div className="gm-crans">
        {crans.map(([cran]) => {
          const ici = poses?.[cran] ?? [];
          const exact = ici.some((r) => r.exact);
          return (
            <span key={cran} className={`mono gm-cran${exact ? " ici" : ""}`}>
              <span>{copie === cran ? "copié" : cran}</span>
              {ici.map((r) => (
                <span key={r.role} className={`gm-role${r.exact ? " exact" : ""}`}>{r.exact ? r.role : `≈ ${r.role}`}</span>
              ))}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* La marque : la saisie sur son cran, et les rôles de marque posés autour
   (thème clair). */
function Gamme({ primaire }: { primaire: string }) {
  const { crans, poses } = useMemo(() => {
    const crans = gamme(primaire) as [number, string][];
    const p = clair(primaire);
    const poses = poserSurGamme(crans, {
      primary: p.primary, hover: p["primary-hover"], subtle: p["primary-subtle"], text: p["primary-text"], "code-bg": p["code-bg"],
    }) as Poses;
    return { crans, poses };
  }, [primaire]);
  return <BarreGamme crans={crans} poses={poses} />;
}

/* Les neutres : les marches elles-mêmes, à peine teintées à la marque —
   elles ne bougent pas avec la saisie (C15). Les rôles neutres du thème
   clair se posent dessus. */
function GammeNeutres({ primaire }: { primaire: string }) {
  const { crans, poses } = useMemo(() => {
    const crans = gammeNeutres(primaire) as [number, string][];
    const p = clair(primaire);
    const poses = poserSurGamme(crans, {
      bg: p.bg, surface: p.surface, hover: p["surface-hover"], border: p["border-strong"], secondary: p["text-secondary"], text: p["text-primary"],
    }) as Poses;
    return { crans, poses };
  }, [primaire]);
  return <BarreGamme crans={crans} poses={poses} />;
}

/* Les quatre familles sémantiques : leurs souches ne suivent la marque
   que de la moitié de son déplacement, plafonnée à 30° (un rouge doit
   rester un rouge ; décision du 27 août 2026) — la
   famille est lue dans la palette dérivée, jamais dans une constante.
   Chaque famille a DEUX ancres : son ton et son fond doux ; le doux tient
   le cran 50, le ton se pose sur son cran (l'avertissement, jaune, monte
   au 200 — son encre brune, elle, vit vers le 700). */
const FAMILLES_SEMANTIQUES: [string, string][] = [
  ["Le danger", "danger"], ["Le succès", "success"], ["L'avertissement", "warning"], ["L'information", "info"],
];
function GammeFamille({ primaire, nom }: { primaire: string; nom: string }) {
  const { crans, poses } = useMemo(() => {
    const p = clair(primaire);
    const ton = p[nom], doux = p[`${nom}-subtle`], encre = p[`on-${nom}-subtle`];
    const crans = gammeFamille(ton, doux) as [number, string][];
    const roles: Record<string, string> = { [nom]: ton, subtle: doux };
    if (encre.toUpperCase() !== ton.toUpperCase()) roles["on-subtle"] = encre;
    return { crans, poses: poserSurGamme(crans, roles) as Poses };
  }, [primaire, nom]);
  return <BarreGamme crans={crans} poses={poses} />;
}



/* ── Les marques du playground : tracés Simple Icons (CC0) — les logos
   restent la propriété de leurs marques, montrés ici comme préréglages
   de démonstration du moteur (demande d'Auré, 24 août). ── */
const D_FILI = "M356.879 197C377.293 197 391.501 204.877 394.412 217.448C395.121 220.046 395.493 223.172 395.493 226.924C395.493 239.317 385.756 248.688 372.672 248.688C364.199 248.688 357.063 244.568 353.216 238.18C353.14 238.054 353.066 237.927 352.993 237.799C351.177 234.635 350.156 230.938 350.156 226.924C350.156 216.714 356.765 208.556 366.239 205.999C363.899 203.331 360.302 201.836 355.368 201.836C339.045 201.836 329.977 216.043 321.514 257.453L317.584 277.101H338.67L391.566 277.101V391.962C391.566 411.912 393.682 417.655 407.889 424.305V424.909H340.181V424.305C354.387 417.655 356.503 411.912 356.503 391.962V310.35C356.503 298.163 355.002 290.617 349.615 284.96H316.073L281.917 424.909C270.128 472.97 248.668 493.222 213 494.733V494.128C232.345 485.363 242.018 452.113 253.202 404.355L280.406 284.96H260.456L261.06 282.542L282.521 275.892L286.451 261.987C299.146 218.461 321.514 197 356.879 197ZM430.349 381C417.664 381 408 390.472 408 403C408 415.528 417.664 425 430.349 425C443.336 425 453 415.528 453 403C453 390.472 443.336 381 430.349 381Z";
const VB_FILI = "211 195 244 301.7";
const LOGOS: { id: string; nom: string; hex: string; d: string; vb?: string; fr?: "evenodd" }[] = [
  /* Fili n'a pas de couleur écrite ici : la sienne est celle du site,
     choisie dans la barre d'outils. Elle est posée au rendu. */
  { id: "fili", nom: "Fili", hex: "", d: D_FILI, vb: VB_FILI, fr: "evenodd" },
  { id: "spotify", nom: "Spotify", hex: "#1DB954", d: "M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" },
  { id: "netflix", nom: "Netflix", hex: "#E50914", d: "m5.398 0 8.348 23.602c2.346.059 4.856.398 4.856.398L10.113 0H5.398zm8.489 0v9.172l4.715 13.33V0h-4.715zM5.398 1.5V24c1.873-.225 2.81-.312 4.715-.398V14.83L5.398 1.5z" },
  { id: "stripe", nom: "Stripe", hex: "#635BFF", d: "M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" },
  { id: "orange", nom: "Orange", hex: "#FF7900", d: "M0 0h24v24H0V0Zm3.43 20.572h17.143v-3.429H3.43v3.429Z" },
  { id: "slack", nom: "Slack", hex: "#4A154B", d: "M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" },
  { id: "apple", nom: "Apple", hex: "#000000", d: "M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" },
];
/* taille : hors chaîne — la silhouette du logo, en px, jamais un jeton d'espace */
function Logo({ d, taille, vb, fr }: { d: string; taille: number; vb?: string; fr?: "evenodd" }) {
  return <svg viewBox={vb ?? "0 0 24 24"} width={taille} height={taille} fill="currentColor" aria-hidden="true"><path d={d} fillRule={fr} /></svg>;
}

const LOGO_CHIP = 22, LOGO_SCENE = 72; // hors chaîne : silhouettes des logos du playground

/* ── Étage « en liste » — ce qu'aucune image ne prouve. Chaque ligne dit
   où elle se vérifie : dans le code, sur l'écran allumé, ou nulle part. ── */
const LISTE: LigneListe[] = [
  { nom: "Deux gris, deux métiers",
    dit: "Le gris fort tient 3:1 et sert quand le trait est la SEULE chose qui dit « on peut cliquer ici ». Le gris clair sépare et range, rien de plus. Le test tient en une question : si cette bordure disparaît, sait-on encore où interagir ?",
    ou: "sur l'écran allumé", ton: "rendu" },
  { nom: "Ni gris pâle, ni voile",
    dit: "Le gris le plus clair de la charte ne porte jamais un texte — ici il n'a même pas de jeton. Même histoire avec l'opacité : un texte adouci au voile tombe sous le seuil. La hiérarchie se joue au corps et à la graisse, jamais à la pâleur.",
    ou: "dans le code" },
  { nom: "La valeur vit dans un seul fichier",
    dit: "Aucune couleur en dur dans une interface : toute valeur passe par un jeton, et tous les jetons vivent au même endroit. Une couleur écrite à la main est introuvable au changement de marque.",
    ou: "dans le code" },
  { nom: "Un jeton naît d'un besoin réel",
    dit: "Pas de rôle créé « au cas où ». Un jeton naît avec son premier consommateur, et un rôle qui perd le sien sort du registre.",
    ou: "nulle part — décision d'Auteur", ton: "auteur" },
  { nom: "Le couple complet dès la naissance",
    dit: "Un ton n'entre jamais seul : il arrive avec son encre et son fond doux. Une couleur sans son encre est une paire qu'aucune table ne peut vérifier.",
    ou: "dans le code" },
  { nom: "Un jeton, une valeur par thème",
    dit: "Le même nom porte une valeur en clair et une en sombre. On ne double jamais un jeton pour faire un thème, et aucun composant ne connaît le thème dans lequel il vit.",
    ou: "dans le code" },
  { nom: "Le désactivé attend son besoin",
    dit: "Aucun jeton d'état désactivé tant qu'aucun composant n'en réclame un. Un gris pâle inventé d'avance finit toujours par porter du texte.",
    ou: "nulle part — décision d'Auteur", ton: "auteur" },
  { nom: "Le canal redondant se déclare",
    dit: "La couleur ne porte jamais seule une information : elle est doublée par un mot, une forme ou une icône. Ce doublage se déclare, il ne se devine pas.",
    ou: "sur l'écran allumé", ton: "rendu" },
  { nom: "Les couleurs forcées ne se neutralisent jamais",
    dit: "Quand le système d'exploitation force ses couleurs, la palette disparaît — on ne neutralise jamais ce mode. L'interface s'appuie alors sur ce qui survit : la sémantique, les bordures, le texte.",
    ou: "dans le code" },
];

/* ── Étage « dans le code » — ce qu'on écrit, et ce que ça produit. Les
   valeurs résolues vivent dans les deux tables du dépliant : elles se
   lisent sur le rendu, elles ne se recopient pas ici. ── */
const CODE: LigneCode[] = [
  { regle: "L'action pleine",
    ecrit: <><span className="cs-kw">background</span>: <span className="cs-var">var(--primary)</span>; <span className="cs-kw">color</span>: <span className="cs-var">var(--on-primary)</span></>,
    produit: "la marque, telle qu'elle est saisie", note: "son encre est cherchée du côté qui tient — noir sur une marque claire, blanc sur une sombre" },
  { regle: "Le lien",
    ecrit: <><span className="cs-kw">color</span>: <span className="cs-var">var(--primary-text)</span></>,
    produit: "la marque, recalée si besoin", note: "on assombrit le lien pour qu'il tienne son seuil, jamais la marque" },
  { regle: "Le texte courant",
    ecrit: <><span className="cs-kw">color</span>: <span className="cs-var">var(--text-primary)</span></>,
    produit: "l'encre du thème courant", note: "aucun jeton de texte ne descend sous son seuil, dans aucun thème" },
  { regle: "L'erreur",
    ecrit: <><span className="cs-kw">color</span>: <span className="cs-var">var(--danger)</span>; <span className="cs-kw">background</span>: <span className="cs-var">var(--danger-subtle)</span></>,
    produit: "le couple de l'erreur", note: "un rouge reste un rouge : les états ne suivent la marque que d'un quart de son déplacement" },
  { regle: "Le survol de l'action", repli: true,
    ecrit: <><span className="cs-kw">background</span>: <span className="cs-var">var(--primary-hover)</span></>,
    produit: "un jeton, pas un calcul", note: "ni filtre ni assombrissement à la volée — un survol calculé n'est vérifiable nulle part" },
  { regle: "La bordure qui dit qu'on peut cliquer", repli: true,
    ecrit: <><span className="cs-kw">border</span>: 1px solid <span className="cs-var">var(--border-strong)</span></>,
    produit: "le gris qui tient 3:1", note: "celui-là seulement quand le trait est la seule chose qui désigne la cible" },
  { regle: "La bordure qui range", repli: true,
    ecrit: <><span className="cs-kw">border</span>: 1px solid <span className="cs-var">var(--border)</span></>,
    produit: "le gris qui sépare", note: "il n'a rien à désigner, il n'a donc pas de seuil à tenir" },
  { regle: "Le fond doux d'une famille", repli: true,
    ecrit: <><span className="cs-kw">background</span>: <span className="cs-var">var(--success-subtle)</span>; <span className="cs-kw">color</span>: <span className="cs-var">var(--on-success-subtle)</span></>,
    produit: "le couple doux", note: "un fond doux ne voyage jamais sans l'encre qui va dessus" },
  { regle: "L'anneau de focus", repli: true,
    ecrit: <><span className="cs-kw">outline-color</span>: <span className="cs-var">var(--focus-ring)</span></>,
    produit: "la famille de l'objet", note: "neutre par défaut, rouge sur un objet de danger — jamais une couleur nouvelle à l'écran" },
  { regle: "Le thème", repli: true,
    ecrit: <><span className="cs-kw">data-theme</span>=<span className="cs-var">&quot;dark&quot;</span></>,
    produit: "toute la famille se résout", note: "aucun composant ne sait dans quel thème il vit" },
  { regle: "La marque", repli: true,
    /* la valeur saisie est celle du moteur — la seule décision écrite à la main du système, lue à sa source */
    ecrit: <><span className="cs-kw">--primary</span>: <span className="cs-var">{PRIMAIRE_DEFAUT}</span></>,
    produit: "une décision, toute la famille sort", note: "fonds, gris, liens, thème sombre — et ce qui deviendrait illisible est recalé de lui-même" },
];

const SOMMAIRE: Sommaire = [
  ["palette", "01", "La palette"],
  ["nuancier", "02", "Le nuancier"],
  ["situation", "03", "En situation"],
  ["moteur", "04", "Une seule décision"],
  ["casser", "05", "Les règles qu'on peut casser"],
  ["invisibles", "06", "Les règles qu'on ne peut pas montrer"],
  ["code", "07", "Dans le code"],
];


export default function Vue() {
  const [palie, setPalie] = useState(false);
  /* La démo montre une marque, elle ne pilote plus le site : la barre
     d'outils reste le seul endroit où l'on choisit celle de Fili. On
     retient donc la marque regardée, pas une couleur recopiée. */
  const [marqueVue, setMarqueVue] = useState("fili");
  const [marque, setMarque] = useState(false);
  const [filtre, setFiltre] = useState(false);
  const [actionSombre, setActionSombre] = useState(false);
  const [teinteLibre, setTeinteLibre] = useState(false);
  const { primaire } = usePrimaire();
  const { theme } = useTheme();
  const sysSombre = useSchemeSysteme();
  const themeEffectif = theme === "system" ? (sysSombre ? "dark" : "light") : theme;
  /* casse : une action sombre forcée en thème sombre — C14 mord */
  const actionSombreStyle: React.CSSProperties = { ["--primary" as string]: "#312E81" };
  const actifId = useDocSections("palette");
  const cle = `${themeEffectif}-${primaire}`;
  /* Le rail : Fili prend la couleur du site, les autres la leur. Même
     éteint, l'onglet Fili la porte — c'est à quoi il sert. Son encre est
     celle que le moteur recale pour rester lisible sur un fond clair :
     la barre d'outils accepte n'importe quelle couleur, le contrat non. */
  const marques = useMemo(() => LOGOS.map((m) => (m.id === "fili" ? { ...m, hex: primaire } : m)), [primaire]);
  const encreSite = useMemo(() => clair(primaire)["primary-text"], [primaire]);
  const marqueEssai = marques.find((m) => m.id === marqueVue) ?? marques[0];
  const essai = marqueEssai.hex;
  const palEssai = useMemo(() => ({ light: clair(essai) }), [essai]);
  const dEssai = marqueEssai.d;
  const vbEssai = marqueEssai.vb;
  const frEssai = marqueEssai.fr;
  const nomEssai = marqueEssai.nom;
  const gammeEssai = useMemo(() => (gamme(essai) as [number, string][]).filter(([c]) => c === 100 || c === 300 || c === 500 || c === 700), [essai]);

  return (
    <div className="gdoc-fond">
      <div className="gdoc">
        <RailDoc page="couleur" titre="Fondation · Couleur" sommaire={SOMMAIRE} actifId={actifId} pied="COLOR-UX · dix-sept règles · deux thèmes" />

        <main className="gdoc-contenu" id="contenu">

          <section className="gdoc-heros">
            <p className="kicker">La couleur</p>
            <h1>Une seule couleur pour les gouverner toutes<span className="point" aria-hidden="true" /></h1>
            <p className="chapo">Ouvrez la palette d&apos;un produit un peu ancien : vous y trouverez trente
            bleus, et plus personne pour dire lequel sert à quoi. Ici il y en a <b>une</b>,
            saisie une fois — tout le reste en descend par le calcul : les gris, les fonds,
            les liens, le thème sombre. Et chaque rapport de contraste que vous lirez sur
            cette page est mesuré sur la page elle-même, jamais recopié d&apos;une table.</p>
          </section>

          <section className="gdoc-sec pose" id="palette">
            <div className="gdoc-sec-tete">
              <p className="kicker">01 · La palette</p>
              <h2>On reconnaît une marque au peu de place qu&apos;elle prend</h2>
              <p className="sourd">Une marque étalée sur tout l&apos;écran ne signe plus rien du tout —
              c&apos;est le paradoxe de la couleur d&apos;entreprise : plus on en met, moins on
              la voit. Sur cette page, le blanc, l&apos;encre et les gris font tout le travail.
              La marque garde ses cinq pour cent, et les couleurs d&apos;alerte ne viennent
              jamais y puiser.</p>
            </div>
            <div className="gdoc-corps">
              <figure className="gd-figure" style={{ justifyItems: "stretch" }}>
                <Palette cle={cle} />
              </figure>
              <details className="prov"><summary>Les gammes 50–950 — la marque, les neutres, et les quatre familles sémantiques</summary>
                <div className="gm-suite">
                  <span className="mono sourd gm-titre" style={{ fontSize: "var(--font-size-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase" }}>La marque — dérivée du primary</span>
                  <Gamme primaire={primaire} />
                  <span className="mono sourd gm-titre" style={{ fontSize: "var(--font-size-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase" }}>Les neutres — les mêmes clartés, teintées à la marque</span>
                  <GammeNeutres primaire={primaire} />
                  {FAMILLES_SEMANTIQUES.map(([titre, nom]) => (
                    <React.Fragment key={nom}>
                      <span className="mono sourd gm-titre" style={{ fontSize: "var(--font-size-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase" }}>{titre}</span>
                      <GammeFamille primaire={primaire} nom={nom} />
                    </React.Fragment>
                  ))}
                </div>
              </details>
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <Regles ids={["p01", "c1", "c4"]} />
              </div></details>
            </div>
          </section>

          <section className="gdoc-sec pose" id="nuancier">
            <div className="gdoc-sec-tete">
              <p className="kicker">02 · Le nuancier</p>
              <h2>Ce nuancier montre des métiers, pas des teintes</h2>
              <p className="sourd">Un nuancier de peintre montre des teintes. Celui-ci montre des
              métiers : à quoi sert cette couleur, et où elle n&apos;a rien à faire. Chaque
              languette naît en couple complet — le ton, son encre, son fond doux — ou ne naît
              pas. Sa fiche lit les valeurs et le rapport sur la page rendue, dans le thème où
              vous êtes.</p>
            </div>
            <div className="gdoc-corps">
              <figure className="gd-figure" style={{ justifyItems: "stretch" }}>
                <Nuancier cle={cle} />
              </figure>
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <Regles ids={["c2", "c5"]} />
              </div></details>
            </div>
          </section>

          <section className="gdoc-sec pose" id="situation">
            <div className="gdoc-sec-tete">
              <p className="kicker">03 · En situation</p>
              <h2>La marque tient parce qu&apos;elle est rare</h2>
              <p className="sourd">Un tableau de bord tient debout parce que la marque y est rare : une
              card, un bouton, une barre. Tout le reste est neutre, et les états gardent leur
              teinte à eux. Le texte posé sur la photo n&apos;est jamais nu — il repose sur un
              voile aux couleurs du fond, dont l&apos;opacité est calculée sur le pixel le plus
              défavorable et refaite à chaque largeur.</p>
            </div>
            <div className="gdoc-corps">
              <figure className="gd-figure" style={{ justifyItems: "stretch" }}>
                <div className="banc voile">
                  <Bento cle={cle} />
                </div>
                {/* Une légende tient en une ligne (règle du 2 septembre) : le détail
                    du voile est déjà dit dans le chapô, et les rôles se lisent au survol. */}
                <figcaption className="gd-legende">
                  la grille suit la marque et le thème, en direct — un seul geste de marque sur tout l&apos;écran
                </figcaption>
              </figure>
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <Regles ids={["m2", "m3", "c6", "c3"]} />
              </div></details>
            </div>
          </section>

          <section className="gdoc-sec pose" id="moteur">
            <div className="gdoc-sec-tete">
              <p className="kicker">04 · Le moteur</p>
              <h2>Une couleur entre, toute la famille sort</h2>
              <p className="sourd">Changer de marque ne devrait pas être un chantier de trois semaines.
              Une couleur entre, toute la famille sort — fonds, gris, liens, thème sombre — et
              ce qui deviendrait illisible se recale tout seul. Les couleurs d&apos;erreur et de
              succès, elles, bougent à peine : un rouge doit rester un rouge. <b>Prenez une
              marque</b> dans le rail, elle passe dans le moteur sans toucher au site.</p>
            </div>
            <div className="gdoc-corps">
              {/* Le playground (maquette d'Auré, 24 août) : le rail des
                  marques à gauche — vrais logos —, la scène logo + nom en
                  plein et en doux, et dessous les barres : la gamme dérivée
                  de la marque (elle suit la teinte, visiblement), les
                  sémantiques intouchés.
                  31 août : la démo REGARDE, elle ne pilote plus. La marque du
                  site se choisit dans la barre d'outils, et l'onglet Fili
                  porte cette couleur-là ; les autres marques ne changent que
                  cette scène. Le choix d'une couleur libre a donc disparu
                  d'ici : il n'existe qu'à un seul endroit. */}
              <div className="mk">
                <div className="mk-rail" role="group" aria-label="Regarder une marque">
                  {marques.map((m) => (
                    <button key={m.id} className="mk-chip" title={m.nom} aria-pressed={m.id === marqueVue}
                      style={m.id === marqueVue ? { background: m.hex, color: palEssai.light["on-primary"] }
                        : m.id === "fili" ? { color: encreSite } : undefined}
                      onClick={() => setMarqueVue(m.id)}>
                      <Logo d={m.d} vb={m.vb} fr={m.fr} taille={LOGO_CHIP} />
                    </button>
                  ))}
                </div>
                <div className="mk-scene">
                  <div className="mk-duo">
                    <div className="mk-grande" style={{ background: palEssai.light.primary, color: palEssai.light["on-primary"] }}>
                      <Logo d={dEssai} vb={vbEssai} fr={frEssai} taille={LOGO_SCENE} /><span className="mk-base">{nomEssai}</span>
                    </div>
                    <div className="mk-grande" style={{ background: palEssai.light["primary-subtle"], color: palEssai.light["primary-text"] }}>
                      <Logo d={dEssai} vb={vbEssai} fr={frEssai} taille={LOGO_SCENE} /><span className="mk-base">{nomEssai}</span>
                    </div>
                  </div>
                  <div className="mk-rang">
                    {gammeEssai.map(([cran, hex]) => (
                      <span key={cran} className="mk-barre" style={{ background: hex }} title={`${cran} · ${hex}`} />
                    ))}
                  </div>
                  <div className="mk-rang">
                    {/* Les couples semantiques de la palette DERIVEE : chaque
                        famille garde sa teinte de charte, mais elle est tiree
                        par le deplacement de la marque et recalee sur ses
                        fonds — lus dans palEssai, jamais dans la page. */}
                    {["danger", "success", "warning", "info"].map((v) => (
                      <span key={v} className="mk-paire">
                        <span className="mk-barre" style={{ background: palEssai.light[v] }} />
                        <span className="mk-barre" style={{ background: palEssai.light[`${v}-subtle`] }} />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <p>Le moteur (kit/derivation.mjs) est calibré sur la charte : à sa primaire, il
                la reproduit. La conformité n&apos;est pas vérifiée après coup, elle est obtenue —
                toute paire sous son seuil est recalée à luminosité seule, la règle de la charte
                (« assombries d&apos;un cran ou deux ; aucune n&apos;a changé de famille »)
                rendue mécanique.</p>
                <Regles ids={["c7", "c9", "c15"]} />
              </div></details>
            </div>
          </section>

          {/* ── Les trois étages du dessous, au gabarit commun (etages.tsx) ── */}
          <section className="gdoc-sec pose" id="casser">
            <div className="gdoc-sec-tete">
              <p className="kicker">05 · Les règles qu&apos;on peut casser</p>
              <h2>Voyez ce qui se passe quand la règle saute</h2>
              <p className="sourd">Cinq gestes ordinaires, et pas un seul ne déclenche
              d&apos;erreur nulle part — c&apos;est ce qui les rend coûteux. Le bouton
              « Casser » ne dessine pas la faute, il la commet pour de vrai sur la scène — puis
              la répare.</p>
            </div>
            <div className="gdoc-corps">
              <Bandes>
                <Bande nom="Le contraste se vérifie par paire" cote="4,5:1 pour le texte courant"
                  dit="Une couleur toute seule ne veut rien dire : ce qui se mesure, c&apos;est un texte SUR son fond. Pâlissez l&apos;encre douce et regardez le verdict tomber — les rapports ci-dessous ne sont pas recopiés d&apos;une table, ils sont calculés sur ce que votre écran affiche."
                  casse={palie} surCasse={setPalie}
                  libelleCasse="Casser : pâlir l&apos;encre douce" libelleRepare="Rendre l&apos;encre du registre"
                  nue regles={<>
                    <p><b>La table complète</b> — chaque paire, mesurée dans les deux thèmes :</p>
                    <TableauPaires cle={cle} />
                    <Regles ids={["c7", "c9", "c13"]} />
                  </>}>
                  <DuoThemes cle={cle} palie={palie} />
                </Bande>

                <Bande nom="Chacun son registre" cote="l&apos;erreur n&apos;est pas la marque"
                  dit="Trois registres, étanches : la marque signe, la sémantique alerte, le neutre porte. Une erreur qui prend la couleur de la marque détruit le vocabulaire des deux — plus rien, à l&apos;écran, ne dit ce qui est grave et ce qui est de la maison."
                  casse={marque} surCasse={setMarque}
                  regles={<Regles ids={["c3", "c2"]} />}>
                  <div className="cl-scene">
                    <Alerte ton="danger" couleurSeule={false} marque={marque} />
                    {marque && <span className="badge ko">l&apos;erreur porte la couleur de la marque — le vocabulaire chromatique est détruit</span>}
                  </div>
                </Bande>

                <Bande nom="Le survol est un jeton" cote="jamais un calcul"
                  dit="Un survol produit par un filtre n&apos;existe dans aucun registre : aucune table ne peut le vérifier, et personne ne saura dire quelle couleur il fabrique. Survolez le bouton dans les deux états."
                  casse={filtre} surCasse={setFiltre}
                  regles={<Regles ids={["c10", "c8"]} />}>
                  <div className="cl-scene">
                    <button type="button" className={`bouton demo-plein ${filtre ? "filtre" : "jeton"}`}>Créer le budget</button>
                    {filtre && <span className="badge ko">ce survol est calculé à la volée — aucune table ne peut le vérifier</span>}
                  </div>
                </Bande>

                <Bande nom="En sombre, l&apos;action s&apos;éclaircit" cote="deux valeurs, un seul nom"
                  dit="Le même jeton porte une valeur en clair et une en sombre. Forcez l&apos;action à garder sa valeur claire dans le thème sombre : elle s&apos;enfonce dans le fond, et le bouton cesse d&apos;être un bouton."
                  casse={actionSombre} surCasse={setActionSombre}
                  regles={<Regles ids={["c12", "c14", "c13"]} />}>
                  <div className="cl-paire">
                    <div data-theme="light" className="cl-versant">
                      <span className="mono cl-versant-nom">clair</span>
                      <MiniEcran cle={`light-${actionSombre}-${primaire}`} />
                    </div>
                    <div data-theme="dark" data-intent={actionSombre ? "statement" : undefined}
                      className="cl-versant" style={actionSombre ? actionSombreStyle : undefined}>
                      <span className="mono cl-versant-nom">sombre{actionSombre ? " — forcée" : ""}</span>
                      <MiniEcran cle={`dark-${actionSombre}-${primaire}`} />
                    </div>
                  </div>
                </Bande>

                <Bande nom="Teinter ne coûte rien" cote="à luminance constante"
                  dit="À luminance constante, la teinte bouge et le rapport ne bouge pas — c&apos;est ce qui permet des neutres teintés à la marque, sûrs par construction. Laissez filer la luminance en teintant : les trois gris se ressemblent toujours, et leurs rapports n&apos;ont plus rien à voir."
                  casse={teinteLibre} surCasse={setTeinteLibre}
                  libelleCasse="Casser : laisser filer la luminance"
                  regles={<Regles ids={["c15", "c17"]} />}>
                  <TeinteConstante casse={teinteLibre} />
                </Bande>
              </Bandes>
            </div>
          </section>

          <section className="gdoc-sec pose" id="invisibles">
            <div className="gdoc-sec-tete">
              <p className="kicker">06 · Les règles qu&apos;on ne peut pas montrer</p>
              <h2>Elles se vérifient ailleurs — et on vous dit où</h2>
              <p className="sourd">Certaines règles ne se photographient pas. Elles se
              vérifient dans le code, à l&apos;écran allumé, ou nulle part du tout.</p>
            </div>
            <div className="gdoc-corps">
              <ListeRegles lignes={LISTE} />
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <Regles ids={["c1", "c4", "c5", "c6", "c11", "c12", "c16", "c17"]} />
              </div></details>
            </div>
          </section>

          <section className="gdoc-sec pose" id="code">
            <div className="gdoc-sec-tete">
              <p className="kicker">07 · Dans le code</p>
              <h2>Le même système, dans votre stack</h2>
            </div>
            <div className="gdoc-corps">
              <PanneauRegistre lignes={CODE} />
              <details className="prov"><summary>La table des rôles — chaque valeur, lue sur le rendu</summary><div>
                <p>Le fonds complet : chaque rôle, sa valeur claire, sa valeur sombre. Rien
                n&apos;est recopié — les deux colonnes sont résolues sur la page que vous lisez,
                et suivent la marque du moment.</p>
                <TableRoles cle={cle} />
              </div></details>
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <p><b>Ce qui remplace l&apos;extrait.</b> La page proposait une alerte prête à
                coller, avec une bascule HTML / React / Angular. On l&apos;a retirée : un extrait
                vieillit, et le jour où le composant bouge il se met à mentir sans prévenir. Le
                jeton, lui, reste vrai. Ce qui fait foi ici, c&apos;est <b>la règle et le
                jeton</b> — pas le code. Un seul jeu de jetons produit les variables CSS natives
                et une sortie Tailwind jumelle ; les deux thèmes vivent dans le jeton, chaque
                consommateur en hérite sans rien coder.</p>
                <Regles ids={["c12", "c1"]} />
              </div></details>
            </div>
          </section>

          <footer className="gd-pied">
            <span>Cette page obéit aux règles qu&apos;elle raconte</span>
            <span>Chaque rapport de contraste est mesuré ici même</span>
          </footer>

        </main>
      </div>
    </div>
  );
}
