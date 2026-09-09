"use client";
import * as React from "react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Bands, Band, ListRules, PanelRegistry } from "../levels";
import type { LineList, LineCode } from "../levels";
import { useTheme, useSchemeSystem } from "../theme";
import { derived, range, rangeNeutrals, rangeFamily, setOnRange, PRIMARY_DEFAULTS } from "../../derivation.mjs";
import { usePrimary } from "../primary";
import { RailDoc, useDocSections, type Toc } from "../rail";
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
     contraste par paire, chacun son registre, le survol est un token,
     l'action en sombre, teinter à luminance constante), celles qu'on ne
     peut pas montrer (la liste et sa colonne « où ça se vérifie »), et le
     registre des tokens.

   « Deux thèmes » a quitté l'étage des preuves : c'est une casse, elle
   descend en bande. La table des paires la suit dans son dépliant, et la
   table des rôles vit désormais sous le registre, dont elle est la forme
   longue. L'extrait prêt à coller et sa bascule HTML / React / Angular
   sont retirés : un extrait vieillit et se met à mentir dès que le
   composant bouge. Le normatif, c'est la règle et le token.

   Tout chiffre affiché est MESURÉ sur la page rendue, jamais recopié.
   Les styles propres à la page vivent dans couleur.css.
   ═══════════════════════════════════════════════════════════════════════ */

/* ── Le contraste, calculé comme la norme le définit ── */
function linear(c: number): number {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}
function luminance([r, g, b]: number[]): number {
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}
function contrast(a: number[], b: number[]): number {
  const l1 = luminance(a), l2 = luminance(b);
  const [h, l] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (h + 0.05) / (l + 0.05);
}
function parseColor(s: string): number[] | null {
  const m = s.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/);
  if (m) return [Number(m[1]), Number(m[2]), Number(m[3])];
  const h = s.match(/^#([0-9a-f]{6})$/i);
  if (h) return [0, 2, 4].map((i) => parseInt(h[1].slice(i, i + 2), 16));
  return null;
}
function hexTo(s: string): number[] {
  return [0, 2, 4].map((i) => parseInt(s.slice(1 + i, 3 + i), 16));
}
/* Mesurer APRÈS que le thème est posé : l'attribut data-theme se pose
   dans un effet parent, qui court après ceux des enfants — lire les
   styles au même instant, c'est lire le thème d'avant. On attend donc
   deux images avant chaque relevé. */
function useMeasure(key: string, read: () => void) {
  useEffect(() => {
    const t = setTimeout(read, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}

function toHex(c: number[]): string {
  return "#" + c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase();
}
function toHsl([r, g, b]: number[]): string {
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
/* Résout un token dans le thème de l'élément hôte — une sonde éphémère,
   lue par le moteur de rendu lui-même. */
function resolve(host: HTMLElement, variable: string): number[] | null {
  const probe = document.createElement("span");
  host.appendChild(probe);
  probe.style.color = `var(${variable})`;
  const v = parseColor(getComputedStyle(probe).color);
  host.removeChild(probe);
  return v;
}

/* ── La table complète des paires déclarées (C7) — au répertoire ── */
const PAIRS: [string, string, string, number][] = [
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

const RULES: { id: string; name: string; heading: string; statement: string; why?: string; div?: string; src: { t: string; h: string }[] }[] = [
  { id: "p01", name: "principe", heading: "Par rôle, jamais par valeur",
    statement: "La couleur s'applique par rôle, jamais par valeur — et un rôle ne porte jamais deux sens. Chaque fois qu'une valeur est choisie « parce qu'elle est jolie ici », c'est le signe qu'un rôle manque ou qu'un registre fuit.",
    src: [{ t: "Material 3 — color roles", h: "https://developer.android.com/design/ui/mobile/guides/styles/color" }, { t: "GOV.UK — Colour", h: "https://design-system.service.gov.uk/styles/colour/" }] },
  { id: "c1", name: "C1", heading: "La valeur vit dans un seul fichier",
    statement: "Le rôle d'une couleur et sa valeur sont deux décisions distinctes : les composants référencent le rôle, la valeur vit dans une source unique et peut changer entièrement sans qu'aucune règle bouge.",
    why: "Un composant qui référence un rôle survit au rebranding ; un composant qui référence un bleu meurt avec lui. Et une valeur en dur ignore les thèmes : elle resterait claire quand la page bascule en sombre.",
    src: [{ t: "Polaris — color-no-hex (interdit outillé)", h: "https://polaris.shopify.com/tools/stylelint-polaris/rules/color-color-no-hex" }, { t: "Atlassian — color foundations", h: "https://atlassian.design/foundations/color" }] },
  { id: "c2", name: "C2", heading: "Trois registres étanches",
    statement: "La palette se répartit en trois registres — marque, sémantique, neutres — et chaque token appartient à exactement un.",
    why: "La marque porte l'identité, la sémantique porte un état, les neutres structurent la page. Trois responsabilités, trois familles, aucun token à cheval.",
    src: [{ t: "Atlassian — color foundations", h: "https://atlassian.design/foundations/color" }, { t: "Polaris — Colors", h: "https://polaris.shopify.com/design/colors" }] },
  { id: "c3", name: "C3", heading: "Une couleur ne change jamais de registre",
    statement: "Jamais la marque pour un état, jamais un état pour du décor — dans les deux sens.",
    why: "La charte le dit en une phrase : les mélanger, c'est confondre « c'est nous » et « il se passe quelque chose ».",
    src: [{ t: "Atlassian — « don't use an accent when the color has semantic meaning »", h: "https://atlassian.design/foundations/color" }] },
  { id: "c4", name: "C4", heading: "Un token naît d'un besoin réel",
    statement: "Le registre marque se limite aux rôles fonctionnels existants ; une teinte purement décorative ne reçoit pas de token — et un rôle sans consommateur ne reste pas.",
    div: "Deux rôles de marque, deux métiers : primary, l'action — tenue en réserve, 5 % de la page — et accent, la voix graphique, un choix d'auteur (illustrations, animations, marketing, graphiques), souverain et hors contrat fonctionnel : il peut approcher un ton sémantique, ils ne vivent jamais au même endroit. Le focus, lui, est un halo de la famille de l'objet — neutre, marque ou rouge — dont le trait clavier est sous contrat (focus-ring, focus-ring-danger, focus-ring-neutral) ; le trait du clic, pâle, est hors contrat, dit.",
    src: [{ t: "Règle interne du système (précédent journalisé)", h: "#" }] },
  { id: "c5", name: "C5", heading: "Le couple complet dès la naissance",
    statement: "Toute nouvelle valeur sémantique fournit son couple texte/fond subtil d'emblée ; les neutres vivent en échelle.",
    src: [{ t: "Règle interne du système (héritée du bouton)", h: "#" }] },
  { id: "c6", name: "C6", heading: "Le canal redondant se déclare",
    statement: "Chaque usage sémantique de la couleur déclare un canal non chromatique — icône, mot ou forme — qui ne se retire jamais pour alléger. C'est la moitié vérifiable du principe cardinal : jamais la couleur seule.",
    why: "Environ 8 % des hommes ont une déficience rouge-vert. Le contraste rend le texte lisible ; il ne distingue pas un rouge d'un vert pour qui ne voit pas la différence. Deux exigences indépendantes.",
    src: [{ t: "WCAG 1.4.1 — Use of Color", h: "https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html" }] },
  { id: "c7", name: "C7", heading: "Le contraste se vérifie par paire",
    statement: "Un token de texte n'est jamais conforme dans l'absolu — il l'est sur un fond donné. Chaque token de texte déclare ses fonds d'usage ; tout fond non déclaré est interdit.",
    why: "Le cas vécu : un vert conforme sur blanc, qu'il a fallu recalibrer pour tenir sur son propre fond doux — au ras du seuil, et c'est écrit.",
    src: [{ t: "WCAG 1.4.3 — Contrast (Minimum)", h: "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html" }, { t: "WCAG — définition du rapport de contraste", h: "https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio" }] },
  { id: "c8", name: "C8", heading: "Le survol testé au même seuil",
    statement: "La norme exempte le survol ; ce système le teste quand même — un survol illisible reste un survol raté.",
    div: "Sur-exigence assumée, dite comme telle : WCAG 1.4.11 exempte explicitement l'état de survol. La paire du survol vit dans la table, au même seuil que le repos.",
    src: [{ t: "WCAG 1.4.11 — Non-text Contrast (l'exemption)", h: "https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html" }] },
  { id: "c9", name: "C9", heading: "Aucun token de texte sous le seuil",
    statement: "Aucun token de texte du registre ne descend sous le seuil de lisibilité sur ses fonds déclarés, dans les deux thèmes.",
    div: "Arbitrage d'Auteur du 13 août, renversement dit : « métadonnées accessoires » n'est pas une exception de la norme. Le gris pâle de la charte (2,54:1 sur blanc) ne porte jamais un texte — ici il n'a même pas de token : la hiérarchie se joue par le corps et la graisse, pas par la pâleur.",
    src: [{ t: "WCAG 1.4.3 — les trois exceptions", h: "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html" }] },
  { id: "c10", name: "C10", heading: "Les états sont des tokens, pas des calculs",
    statement: "Les états interactifs sont portés par des tokens dédiés, jamais calculés à la volée dans une feuille de style — ni filtre, ni assombrissement calculé.",
    why: "Une couleur produite par un filtre n'existe dans aucun registre : aucune table de paires ne peut la vérifier, aucun instrument ne peut la voir.",
    src: [{ t: "Règle interne du système", h: "#" }] },
  { id: "c11", name: "C11", heading: "Le désactivé attend son besoin",
    statement: "L'état désactivé n'a pas de tokens tant qu'aucun composant ne documente un besoin légitime ; le jour venu, le couple complet fond/texte/bordure naît en une seule fois.",
    src: [{ t: "WCAG 1.4.3 — exemption des composants inactifs", h: "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html" }] },
  { id: "c12", name: "C12", heading: "Un token, une valeur par thème",
    statement: "Dans un système à thèmes, chaque token de couleur résout une valeur par thème déclaré — c'est la condition d'existence d'un second thème.",
    src: [{ t: "Carbon — Themes", h: "https://carbondesignsystem.com/elements/themes/overview/" }, { t: "Atlassian — color foundations", h: "https://atlassian.design/foundations/color" }] },
  { id: "c13", name: "C13", heading: "Le sombre est couvert, et vérifié comme le clair",
    statement: "Chaque rôle résout une valeur en clair et en sombre, le thème sombre s'active sur la préférence du système, et les seuils se vérifient thème par thème.",
    src: [{ t: "MDN — prefers-color-scheme", h: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme" }] },
  { id: "c14", name: "C14", heading: "Les deux textes garantis, du même côté",
    statement: "Deux textes garantis sur un même fond ne peuvent tous deux atteindre le seuil que s'ils tombent du même côté de l'échelle de luminance — d'où la contrainte démontrée : un thème sombre ne peut pas avoir une couleur d'action sombre.",
    why: "Ce n'est pas un goût, c'est un calcul : avec une action sombre, aucun texte représentable ne tient 4,5:1 à la fois sur elle et sur le fond quasi noir. L'action s'éclaircit en sombre, par construction.",
    src: [{ t: "WCAG — définition du rapport de contraste", h: "https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio" }] },
  { id: "c15", name: "C15", heading: "Teinter un neutre ne coûte rien, à luminance constante",
    statement: "Le rapport de contraste ne dépend que de la luminance relative ; teinter un neutre en conservant sa luminance ne change aucun rapport — l'opération est sûre par construction.",
    src: [{ t: "WCAG — relative luminance", h: "https://www.w3.org/TR/WCAG22/#dfn-relative-luminance" }, { t: "CSS Color 4 — oklch()", h: "https://www.w3.org/TR/css-color-4/" }] },
  { id: "m2", name: "M2", heading: "Jamais de texte nu sur image",
    statement: "Sur une image imprévisible, le texte reçoit un voile calculé ou sort du média ; le contraste se juge au pire pixel derrière lui, jamais à la moyenne.",
    why: "Une photo n'a pas de valeur : elle en a des milliers. Le seul rapport qui compte est celui du pixel le plus défavorable sous chaque lettre.",
    src: [{ t: "WCAG 1.4.3 — Contrast (Minimum), texte sur image", h: "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html" }] },
  { id: "m3", name: "M3", heading: "Le voile est un calcul",
    statement: "L'opacité du voile est calculée sur le pire pixel derrière chaque zone de texte, et revérifiée à chaque format — le cadrage déplace le pire pixel.",
    div: "Ici : la photo est redessinée telle que cadrée, les pixels derrière la bande sont lus, et l'opacité minimale qui fait tenir l'encre à 4,5:1 est cherchée par dichotomie, à chaque largeur et à chaque thème. La card dit le résultat.",
    src: [{ t: "Règle interne du système (mesure de rendu)", h: "#" }] },
  { id: "c16", name: "C16", heading: "Les couleurs forcées ne se neutralisent jamais",
    statement: "Quand le système d'exploitation force ses couleurs, la palette disparaît — on ne neutralise jamais ce mode, et l'interface s'appuie sur ce qui survit : la sémantique, les bordures, le texte.",
    src: [{ t: "MDN — @media (forced-colors)", h: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors" }, { t: "MDN — forced-color-adjust", h: "https://developer.mozilla.org/en-US/docs/Web/CSS/forced-color-adjust" }] },
  { id: "c17", name: "C17", heading: "Le tertiaire est une intention, jamais un défaut",
    statement: "L'encre tertiaire — le gris le plus clair qui tienne encore 3:1 sur le fond le plus dur — ne s'emploie que sur un objet secondaire : kicker, fiche, légende, méta, pied, index de menu. Jamais sur du texte lu, jamais sous le cran étiquette, jamais un seul rapport sous 3:1. En petit — au cran étiquette ou au petit cran —, il porte un cran de graisse de plus que le texte qu'il accompagne (600 au moins, 700 pour un kicker mono) : l'œil retrouve en épaisseur ce que l'encre a cédé en contraste. Chaque emploi est dit là où il est écrit : en CSS, la ligne qui pose le tertiaire porte « tertiaire : » et ce que c'est ; aucun style en ligne ne le pose.",
    why: "Un gris clair est une décision de hiérarchie, pas une valeur par défaut. Sans la mention, un tertiaire posé sur une phrase par commodité passerait pour un texte second qui a pâli — et le vérificateur ne pourrait pas le distinguer. La mention rend l'intention lisible par un humain et comptable par la machine. La graisse en plus est la contrepartie de l'encre claire : elle aide à lire sans assombrir, donc sans rapprocher le tertiaire du secondaire — le même principe que la norme, qui admet un contraste moindre dès que le texte est gras.",
    div: "Arbitrages d'Auteur des 25 et 26 août 2026 : « limite côté lisibilité, mais ce sont des objets secondaires », puis, sur pièce, « aider le lecteur avec une fonte légèrement plus grasse pour les éléments petits en tertiaire ». Le rapport de 3:1 est celui que WCAG réserve aux grands textes et aux objets d'interface ; ici il est étendu, par décision dite, aux petites étiquettes qui n'ont pas à être lues en premier.",
    src: [{ t: "WCAG 2.2 — 1.4.3 Contrast (Minimum)", h: "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html" }, { t: "WCAG 2.2 — 1.4.11 Non-text Contrast", h: "https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html" }] },
];

function Rules({ ids }: { ids: string[] }) {
  return (
    <div style={{ display: "grid", gap: "var(--gap-1-block)" }}>
      {ids.map((id) => RULES.find((r) => r.id === id)!).map((r) => (
        <div key={r.id} style={{ display: "grid", gap: "var(--gap-3-block)", maxWidth: "var(--measure)" }}>
          <b style={{ color: "var(--text-primary)" }}><span className="badge">{r.name}</span> {r.heading}</b>
          <span>{r.statement}</span>
          {r.why && <span className="muted">{r.why}</span>}
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
   tokens vivants : chaque rôle occupe sa part réelle de l'écran. ── */
const TILES: { name: string; token: string; on: string; col: string; row: string; registry: string; edge?: boolean }[] = [
  { name: "primary", token: "--primary", on: "--on-primary", col: "1 / 8", row: "1", registry: "brand" },
  { name: "background", token: "--bg", on: "--text-primary", col: "8 / 13", row: "1", registry: "neutral", edge: true },
  { name: "primary-subtle", token: "--primary-subtle", on: "--on-primary-subtle", col: "1 / 4", row: "2 / 4", registry: "brand" },
  { name: "text-primary", token: "--text-primary", on: "--bg", col: "4 / 13", row: "2", registry: "neutral" },
  { name: "surface", token: "--surface", on: "--text-primary", col: "4 / 9", row: "3", registry: "neutral", edge: true },
  { name: "border-strong", token: "--border-strong", on: "--bg", col: "9 / 13", row: "3", registry: "neutral" },
];
const PROPORTIONS: { name: string; token: string; on: string; part: number; edge?: boolean }[] = [
  { name: "background", token: "--bg", on: "--text-primary", part: 56, edge: true },
  { name: "surface", token: "--surface", on: "--text-primary", part: 18, edge: true },
  { name: "text-primary", token: "--text-primary", on: "--bg", part: 14 },
  { name: "border-strong", token: "--border-strong", on: "--bg", part: 7 },
  { name: "primary", token: "--primary", on: "--on-primary", part: 5 },
];

function Palette({ key }: { key: string }) {
  /* Le graphisme EXACT de la charte (verdict d'Auré, 24 août : « j'aimais
     beaucoup ce graphisme exactement ») : tuiles pleines sans écart, nom en
     haut à gauche, specs mono en bas à droite — mais branché sur les tokens
     vivants : les valeurs affichées sont lues sur la page rendue. */
  const ref = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<"mosaique" | "proportions">("mosaique");
  const [rgbs, setRgbs] = useState<Record<string, number[]>>({});
  const [copy, setCopy] = useState<string | null>(null);
  useMeasure(key, () => {
    if (!ref.current) return;
    const v: Record<string, number[]> = {};
    TILES.forEach((t) => { const c = resolve(ref.current!, t.token); if (c) v[t.token] = c; });
    setRgbs(v);
  });
  const copyIt = (token: string) => {
    const c = rgbs[token];
    if (c) navigator.clipboard?.writeText(toHex(c)).catch(() => {});
    setCopy(token); setTimeout(() => setCopy(null), 1400);
  };
  const specs = (token: string) => {
    const c = rgbs[token];
    return c
      ? [`color.${token.slice(2) === "bg" ? "background" : token.slice(2)}`, toHex(c), toHsl(c), `RGB ${c.map(Math.round).join(", ")}`]
      : ["…"];
  };
  return (
    <div ref={ref} style={{ width: "100%", display: "grid", gap: "var(--gap-2-block)" }}>
      <div className="rank" style={{ gap: "var(--gap-3-inline)" }}>
        {([["mosaique", "Mosaïque"], ["proportions", "Proportions"]] as const).map(([v, name]) => (
          /* commandes secondaires d'une tête d'outil : la cible compacte */
          <button key={v} className={`button ${view === v ? "on" : ""}`} style={{ height: "var(--control-height-compact)", padding: "0 var(--pad-3-inline)", fontSize: "var(--font-size-small)" }} onClick={() => setView(v)}>{name}</button>
        ))}
      </div>
      {view === "mosaique" ? (
        <div className="cm-mos">
          {TILES.map((t) => (
            <button key={t.token} className="cm-tile" onClick={() => copyIt(t.token)}
              title={`Copier ${rgbs[t.token] ? toHex(rgbs[t.token]) : ""}`}
              style={{ gridColumn: t.col, gridRow: t.row, background: `var(${t.token})`, color: `var(${t.on})`,
                boxShadow: t.edge ? "inset 0 0 0 1px var(--border)" : undefined }}>
              <span className="cm-name">{copy === t.token ? "Copié ✓" : t.name}</span>
              <span className="cm-specs">{specs(t.token).map((l) => <span key={l}>{l}</span>)}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="cm-props">
          {PROPORTIONS.map((t) => (
            <button key={t.token} className={`cp-col ${t.part < 10 ? "narrow" : ""}`} onClick={() => copyIt(t.token)}
              title={`Copier ${rgbs[t.token] ? toHex(rgbs[t.token]) : ""}`}
              style={{ flexBasis: `${t.part}%`, background: `var(${t.token})`, color: `var(${t.on})`,
                boxShadow: t.edge ? "inset 0 0 0 1px var(--border)" : undefined }}>
              <span className="cp-meta">
                <span className="cp-name">{copy === t.token ? "Copié ✓" : t.name}</span>
                <span className="cp-hex">{rgbs[t.token] ? toHex(rgbs[t.token]) : "…"}</span>
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
const SUBTLE: Record<string, string> = {
  "danger / subtil": "--danger-subtle", "success / subtil": "--success-subtle",
  "warning / subtil": "--warning-subtle", "info / subtil": "--info-subtle",
};
function TableRoles({ key }: { key: string }) {
  const lightRef = useRef<HTMLDivElement>(null);
  const darkRef = useRef<HTMLDivElement>(null);
  const [vals, setVals] = useState<Record<string, { light: (string | null)[]; dark: (string | null)[] }>>({});
  useMeasure(key, () => {
    const read = (host: HTMLElement | null, variable: string) => {
      if (!host) return "…";
      const c = resolve(host, variable);
      return c ? toHex(c) : "…";
    };
    const v: Record<string, { light: (string | null)[]; dark: (string | null)[] }> = {};
    ROLES_TABLE.forEach(([name, variable]) => {
      const sub = SUBTLE[name] ?? null;
      v[name] = {
        light: [read(lightRef.current, variable), sub ? read(lightRef.current, sub) : null],
        dark: [read(darkRef.current, variable), sub ? read(darkRef.current, sub) : null],
      };
    });
    setVals(v);
  });
  const DOT = "0.75rem"; // hors chaîne : silhouette de la pastille de couleur (un carré de texte)
  const Dot = ({ hex }: { hex: string }) => (
    <span aria-hidden="true" style={{ display: "inline-block", width: DOT, height: DOT,
      borderRadius: "var(--r-4)", border: "1px solid var(--border)", background: hex.split(" ")[0],
      verticalAlign: "-1px", marginRight: "var(--gap-3-inline)" }} />
  );
  /* Chaque valeur porte son carre, le subtil comme le ton, et le meme
     separateur que le nom du role : la barre oblique. */
  const Values = ({ v }: { v?: (string | null)[] }) => v ? (
    <>
      <Dot hex={v[0] ?? "#fff"} />{v[0]}
      {v[1] ? <><span className="muted" style={{ margin: "0 var(--gap-3-inline)" }}>/</span><Dot hex={v[1]} />{v[1]}</> : null}
    </>
  ) : <>{"…"}</>;
  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <div ref={lightRef} data-theme="light" hidden />
      <div ref={darkRef} data-theme="dark" hidden />
      <table className="table airy" style={{ width: "100%" }}>
        <thead><tr><th>rôle</th><th>clair</th><th>sombre</th></tr></thead>
        <tbody>
          {ROLES_TABLE.map(([name]) => (
            <tr key={name}>
              <td className="mono">{name}</td>
              <td className="mono"><Values v={vals[name]?.light} /></td>
              <td className="mono"><Values v={vals[name]?.dark} /></td>
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
function TablePairs({ key }: { key: string }) {
  const lightRef = useRef<HTMLDivElement>(null);
  const darkRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<{ light: number; dark: number }[]>([]);
  useMeasure(key, () => {
    const read = (host: HTMLDivElement | null) =>
      PAIRS.map(([text, background]) => {
        if (!host) return 0;
        const a = resolve(host, text), b = resolve(host, background);
        return a && b ? contrast(a, b) : 0;
      });
    const light = read(lightRef.current), dark = read(darkRef.current);
    setLines(PAIRS.map((_, i) => ({ light: light[i], dark: dark[i] })));
  });
  const Cell = ({ r, threshold }: { r: number; threshold: number }) => (
    <td><span className={`badge ${r > 0 && r < threshold ? "ko" : ""}`}>{fmt(r)}</span></td>
  );
  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <div ref={lightRef} data-theme="light" hidden />
      <div ref={darkRef} data-theme="dark" hidden />
      <table className="table" style={{ width: "100%" }}>
        <thead><tr><th>Paire déclarée</th><th>Seuil</th><th>Thème clair</th><th>Thème sombre</th></tr></thead>
        <tbody>
          {PAIRS.map(([text, background, label, threshold], i) => (
            <tr key={label}>
              <td style={{ whiteSpace: "normal" }}>{label}<br />
                <span className="mono" style={{ color: "var(--text-secondary)", fontWeight: 400, fontSize: "var(--font-size-label)" }}>{text} / {background}</span></td>
              <td className="mono" style={{ color: "var(--text-secondary)" }}>{threshold === 3 ? "3:1" : "4,5:1"}</td>
              <Cell r={lines[i]?.light ?? 0} threshold={threshold} />
              <Cell r={lines[i]?.dark ?? 0} threshold={threshold} />
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
type Tab = { art: string; word: string; name: string; tone: string; onTone: string; soft: string; onSoft: string; token: string; sentenceTone: string; sentenceSoft: string };
const TABS: Tab[] = [
  { art: "La", word: "brand", name: "La marque", tone: "--primary", onTone: "--on-primary", soft: "--primary-subtle", onSoft: "--on-primary-subtle", token: "primary",
    sentenceTone: "Elle signe. Un seul grand geste par écran.", sentenceSoft: "La marque murmurée." },
  { art: "Le", word: "danger", name: "Le danger", tone: "--danger", onTone: "--on-danger", soft: "--danger-subtle", onSoft: "--on-danger-subtle", token: "danger",
    sentenceTone: "Il arrête. Jamais dépensé pour décorer.", sentenceSoft: "La faute expliquée posément." },
  { art: "Le", word: "succès", name: "Le succès", tone: "--success", onTone: "--on-success", soft: "--success-subtle", onSoft: "--on-success-subtle", token: "success",
    sentenceTone: "Il confirme, puis se retire.", sentenceSoft: "La conformité tranquille." },
  { art: "Le", word: "neutral", name: "Le neutre", tone: "--text-primary", onTone: "--bg", soft: "--surface", onSoft: "--text-secondary", token: "neutral",
    sentenceTone: "Il se tait. C'est lui qui fait la page.", sentenceSoft: "Fonds, filets, encres." },
  { art: "L’", word: "information", name: "L’information", tone: "--info", onTone: "--on-info", soft: "--info-subtle", onSoft: "--on-info-subtle", token: "info",
    sentenceTone: "Elle renseigne — avec son propre bleu, jamais celui d’une marque.", sentenceSoft: "La note en passant." },
  { art: "L’", word: "avertissement", name: "L’avertissement", tone: "--warning", onTone: "--on-warning", soft: "--warning-subtle", onSoft: "--on-warning-subtle", token: "warning",
    sentenceTone: "Il prévient sans crier.", sentenceSoft: "Le doute encore réparable." },
];

/* Deux groupes, et la coupure est celle du JUGEMENT : trois familles ne
   jugent rien — la marque signe, le neutre fait la page, l’information
   passe une note — et trois rendent un verdict sur ce que la personne
   vient de faire. Les voir séparés évite la faute la plus commune :
   dépenser un verdict là où il n’y a rien à juger. */
const GROUPS: { heading: string; tokens: string[] }[] = [
  { heading: "Ce qui ne juge pas", tokens: ["primary", "neutral", "info"] },
  { heading: "Les trois verdicts", tokens: ["danger", "success", "warning"] },
];

/* Les six signes — tracés d’une seule main : même grille de 24, même
   trait, mêmes bouts ronds. Chacun dit ce que sa famille FAIT, pas ce
   qu’elle est : la plume signe, la barre arrête, la coche confirme, la
   trame se tait, le i renseigne, le triangle prévient. */
const SIGNS: Record<string, ReactNode> = {
  primary: <><path d="M4.6 19.4l1.6-4.6L15 6a2.1 2.1 0 013 3l-8.8 8.8z" /><path d="M13.4 7.6l3 3" /></>,
  danger: <><circle cx="12" cy="12" r="8.4" /><path d="M8 12h8" /></>,
  success: <><circle cx="12" cy="12" r="8.4" /><path d="M8.2 12.4l2.6 2.6 5-5.4" /></>,
  neutral: <><path d="M4.6 7h14.8" /><path d="M4.6 12h14.8" /><path d="M4.6 17h9.4" /></>,
  info: <><circle cx="12" cy="12" r="8.4" /><path d="M12 11.2v5.2" /><path d="M12 7.8v.01" /></>,
  warning: <><path d="M12 4.4l8.2 14.9H3.8z" /><path d="M12 10.2v4" /><path d="M12 16.9v.01" /></>,
};
function Swatches({ key }: { key: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [records, setRecords] = useState<Record<string, string>>({});
  useMeasure(key, () => {
    if (!ref.current) return;
    const v: Record<string, string> = {};
    TABS.forEach((l) => {
      const tone = resolve(ref.current!, l.tone), soft = resolve(ref.current!, l.soft), on = resolve(ref.current!, l.onSoft);
      if (tone && soft && on) v[l.token] = `${l.token} · ${toHex(tone)} · doux ${toHex(soft)} · ${fmt(contrast(on, soft))}`;
    });
    setRecords(v);
  });
  /* Six lignes en deux groupes : le fond doux parle, le ton signe. Au
     survol — ou au clavier, la phrase du ton doit être atteignable
     autrement qu'à la souris — le ton prend la majorité de la ligne et dit
     sa phrase. Le rang court sur les six : l'ouverture est un seul geste,
     pas deux cascades qui partent en même temps. */
  const byToken = new Map(TABS.map((l) => [l.token, l]));
  let rank = 0;
  return (
    <div ref={ref} className="gd-swatches">
      {GROUPS.map((g) => (
        <section key={g.heading} className="gd-nfam">
          <p className="mono muted gd-nfam-heading">{g.heading}</p>
          <div className="gd-nfam-lines" role="list" aria-label={g.heading}>
            {g.tokens.map((j) => {
              const l = byToken.get(j)!;
              const i = rank++;
              return (
                <div key={l.token} className="gd-lng" role="listitem" tabIndex={0}
                  style={{ ["--rank" as string]: i }}
                  aria-label={`${l.name}. ${l.sentenceSoft} ${l.sentenceTone} ${records[l.token] ?? ""}`}>
                  <div className="gd-lng-soft" style={{ background: `var(${l.soft})`, color: `var(${l.onSoft})` }}>
                    <p className="gd-lng-heading" aria-hidden="true"><span>{l.art}</span><b>{l.word}</b></p>
                    <span className="gd-lng-says" aria-hidden="true">{l.sentenceSoft}</span>
                    <div className="gd-lng-record" aria-hidden="true">{records[l.token] ?? "…"}</div>
                  </div>
                  <div className="gd-lng-tone" style={{ background: `var(${l.tone})`, color: `var(${l.onTone})` }}>
                    <svg className="gd-lng-sign" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      {SIGNS[l.token]}
                    </svg>
                    <span className="gd-lng-tonesays" aria-hidden="true">{l.sentenceTone}</span>
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
   en thème sombre par nature : ses tokens sont ceux du thème sombre du
   kit, résolus par data-theme. L'indication n'apparaît qu'à la casse. ── */
/* ── PREUVE · VARIATION — deux thèmes, une exigence (24 août). La même
   card, clair et sombre : chaque panneau EST son thème (data-theme), et
   les rapports sont mesurés dedans, sur la page rendue. La casse pâlit
   l'encre douce avec le gris que le registre refuse — et le verdict tombe. ── */
const PAIRS_DUO: [string, string, string][] = [
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
function DuoThemes({ key, tier }: { key: string; tier: boolean }) {
  const holder = useRef<HTMLDivElement>(null);
  const [mes, setMes] = useState<number[]>([]);
  useMeasure(`${key}-${tier}`, () => {
    const host = holder.current;
    setMes(PAIRS_DUO.map(([, t, f]) => {
      if (!host) return 0;
      const a = resolve(host, t), b = resolve(host, f);
      return a && b ? contrast(a, b) : 0;
    }));
  });
  /* casse : le gris pâle que le registre refuse, posé de force (l'élément le déclare) */
  const tierStyle: React.CSSProperties = { ["--text-secondary" as string]: "#9CA3AF" };
  return (
    <div ref={holder} className="gd-pan" style={tier ? tierStyle : undefined}
      data-intent={tier ? "statement" : undefined}>
      <div className="gd-pan-card">
        <span className="cl-pan-name">Léa Fontan</span>
        <span className="cl-pan-role">UX Designer — chaque encre de cette card est mesurée sur le fond qui la porte.</span>
        {/* un bouton : le coin du composant, la marge de la row, la cible au doigt */}
        <span className="cl-pan-btn">Suivre</span>
      </div>
      <div className="cl-pan-measures">
        {PAIRS_DUO.map(([name], i) => {
          const r = mes[i] ?? 0;
          const ko = r > 0 && r < 4.5;
          return (
            <div key={name} className="cl-pan-measure">
              <span>{name}</span>
              <span className={`badge ${ko ? "ko" : "good"}`}>{fmt(r)}{ko ? " — sous le seuil, recalé d'office" : ""}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}


/* ── RÉPERTOIRE — les garde-fous, avec leurs casses quand elles existent ── */
function Alert({ tone, colorSingleOne, brand }: { tone: "danger" | "success"; colorSingleOne: boolean; brand: boolean }) {
  const hue = brand ? "--primary" : tone === "danger" ? "--danger" : "--success";
  const soft = brand ? "--primary-subtle" : tone === "danger" ? "--danger-subtle" : "--success-subtle";
  const text = brand ? "--on-primary-subtle" : hue;
  const icon = tone === "danger" ? "⚠" : "✓";
  const word = tone === "danger" ? "Erreur" : "Succès";
  const msg = tone === "danger" ? "le dossier n'a pas pu être enregistré." : "le dossier est enregistré.";
  const HAIRLINE = "4px"; // hors chaîne : le filet d'accent de l'alerte, un trait épaissi
  /* une alerte est une card : le coin et la marge de la card */
  return (
    <div data-intent={brand ? "statement" : undefined} style={{ /* casse : la marque prêtée à un état */
      background: `var(${soft})`, color: colorSingleOne ? "var(--text-primary)" : `var(${text})`,
      border: `1px solid var(${hue})`, borderInlineStart: `${HAIRLINE} solid var(${hue})`,
      borderRadius: "var(--r-2)", padding: "var(--pad-2-block) var(--pad-2-inline)",
      fontSize: "var(--font-size-small)", width: "100%", textAlign: "left",
    }}>
      {colorSingleOne
        ? <>Le dossier {tone === "danger" ? "n&apos;a pas pu être enregistré" : "est enregistré"}.</>
        : <><b>{icon} {word}</b> — {msg}</>}
    </div>
  );
}

function MiniScreen({ key }: { key: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [r, setR] = useState(0);
  useMeasure(key, () => {
    if (!ref.current) return;
    const a = resolve(ref.current, "--on-primary"), b = resolve(ref.current, "--primary");
    if (a && b) setR(contrast(a, b));
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
   pas. (Valeurs d'étude calées au calcul, pas des tokens.) */
const GRAY_HUES: [string, string][] = [["gris pur", "#6B7280"], ["gris chaud", "#78716A"], ["gris bleuté", "#67737F"]];
/* La casse : on teinte SANS tenir la luminance. Les trois gris restent des
   gris, ils se ressemblent encore — et pourtant leurs rapports n'ont plus
   rien à voir. C'est le geste que la règle interdit, commis pour de vrai.
   (Valeurs d'étude, hors registre ; les rapports affichés sont calculés
   sur ces valeurs, jamais recopiés.) */
const GRAY_DERIVED: [string, string][] = [["gris pur", "#6B7280"], ["gris chaud", "#A8A29E"], ["gris bleuté", "#475569"]];
function HueConstant({ broken }: { broken?: boolean }) {
  const rounded = (hex: string) => (Math.round(contrast(hexTo(hex), hexTo("#FFFFFF")) * 10) / 10).toFixed(1).replace(".", ",");
  const gray = broken ? GRAY_DERIVED : GRAY_HUES;
  const ratios = gray.map(([, hex]) => rounded(hex));
  const identical = ratios.every((r) => r === ratios[0]);
  /* Le rapport de CHAQUE gris est posé sous sa tuile. Une phrase dans une
     pastille ne montrait pas le rapport entre trois nombres — elle le
     racontait, et débordait de sa colonne (verdict d'Auteur, 2 septembre).
     Trois nombres alignés sous trois tuiles qui se ressemblent : au repos
     ils sont identiques, cassés ils ne le sont plus, et ça se voit sans
     lire. Le verdict, lui, tient en cinq mots. */
  return (
    <div className="cl-hue">
      <ol className="cl-hue-gray">
        {gray.map(([name, hex], i) => (
          <li key={name} className="cl-hue-gray-one">
            {/* étude : le « Aa » est blanc pur — la référence du rapport mesuré, pas un token */}
            <span className="cl-hue-tile" style={{ background: hex }}>Aa</span>
            <b className="mono cl-hue-ratio">{ratios[i]}:1</b>
            <span className="mono cl-hue-name">{name}</span>
          </li>
        ))}
      </ol>
      <span className={`badge ${identical ? "good" : "ko"}`}>
        {identical ? "le même rapport pour les trois" : "trois rapports différents"}
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
type SetAll = Record<string, { role: string; exact: boolean }[]>;
/* La famille du thème clair, lue comme un dictionnaire de rôles. */
const light = (hex: string) => (derived(hex) as unknown as { light: Record<string, string> }).light;
function BarRange({ steps, setAll }: { steps: [number, string][]; setAll?: SetAll }) {
  const [copy, setCopy] = useState<number | null>(null);
  const copyIt = (step: number, hex: string) => {
    navigator.clipboard?.writeText(hex).catch(() => {});
    setCopy(step); setTimeout(() => setCopy(null), 1200);
  };
  return (
    <div className="gm">
      <div className="gm-bar">
        {steps.map(([step, hex]) => (
          <button key={step} onClick={() => copyIt(step, hex)} title={`Copier ${hex}`} aria-label={`${step} — ${hex}`}
            style={{ background: hex }} />
        ))}
      </div>
      <div className="gm-steps">
        {steps.map(([step]) => {
          const here = setAll?.[step] ?? [];
          const exact = here.some((r) => r.exact);
          return (
            <span key={step} className={`mono gm-step${exact ? " here" : ""}`}>
              <span>{copy === step ? "copié" : step}</span>
              {here.map((r) => (
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
function Range({ primary }: { primary: string }) {
  const { steps, setAll } = useMemo(() => {
    const steps = range(primary) as [number, string][];
    const p = light(primary);
    const setAll = setOnRange(steps, {
      primary: p.primary, hover: p["primary-hover"], subtle: p["primary-subtle"], text: p["primary-text"], "code-bg": p["code-bg"],
    }) as SetAll;
    return { steps, setAll };
  }, [primary]);
  return <BarRange steps={steps} setAll={setAll} />;
}

/* Les neutres : les marches elles-mêmes, à peine teintées à la marque —
   elles ne bougent pas avec la saisie (C15). Les rôles neutres du thème
   clair se posent dessus. */
function RangeNeutrals({ primary }: { primary: string }) {
  const { steps, setAll } = useMemo(() => {
    const steps = rangeNeutrals(primary) as [number, string][];
    const p = light(primary);
    const setAll = setOnRange(steps, {
      bg: p.bg, surface: p.surface, hover: p["surface-hover"], border: p["border-strong"], secondary: p["text-secondary"], text: p["text-primary"],
    }) as SetAll;
    return { steps, setAll };
  }, [primary]);
  return <BarRange steps={steps} setAll={setAll} />;
}

/* Les quatre familles sémantiques : leurs souches ne suivent la marque
   que de la moitié de son déplacement, plafonnée à 30° (un rouge doit
   rester un rouge ; décision du 27 août 2026) — la
   famille est lue dans la palette dérivée, jamais dans une constante.
   Chaque famille a DEUX ancres : son ton et son fond doux ; le doux tient
   le cran 50, le ton se pose sur son cran (l'avertissement, jaune, monte
   au 200 — son encre brune, elle, vit vers le 700). */
const FAMILIES_SEMANTIC: [string, string][] = [
  ["Le danger", "danger"], ["Le succès", "success"], ["L'avertissement", "warning"], ["L'information", "info"],
];
function RangeFamily({ primary, name }: { primary: string; name: string }) {
  const { steps, setAll } = useMemo(() => {
    const p = light(primary);
    const tone = p[name], soft = p[`${name}-subtle`], ink = p[`on-${name}-subtle`];
    const steps = rangeFamily(tone, soft) as [number, string][];
    const roles: Record<string, string> = { [name]: tone, subtle: soft };
    if (ink.toUpperCase() !== tone.toUpperCase()) roles["on-subtle"] = ink;
    return { steps, setAll: setOnRange(steps, roles) as SetAll };
  }, [primary, name]);
  return <BarRange steps={steps} setAll={setAll} />;
}



/* ── Les marques du playground : tracés Simple Icons (CC0) — les logos
   restent la propriété de leurs marques, montrés ici comme préréglages
   de démonstration du moteur (demande d'Auré, 24 août). ── */
const D_FILI = "M356.879 197C377.293 197 391.501 204.877 394.412 217.448C395.121 220.046 395.493 223.172 395.493 226.924C395.493 239.317 385.756 248.688 372.672 248.688C364.199 248.688 357.063 244.568 353.216 238.18C353.14 238.054 353.066 237.927 352.993 237.799C351.177 234.635 350.156 230.938 350.156 226.924C350.156 216.714 356.765 208.556 366.239 205.999C363.899 203.331 360.302 201.836 355.368 201.836C339.045 201.836 329.977 216.043 321.514 257.453L317.584 277.101H338.67L391.566 277.101V391.962C391.566 411.912 393.682 417.655 407.889 424.305V424.909H340.181V424.305C354.387 417.655 356.503 411.912 356.503 391.962V310.35C356.503 298.163 355.002 290.617 349.615 284.96H316.073L281.917 424.909C270.128 472.97 248.668 493.222 213 494.733V494.128C232.345 485.363 242.018 452.113 253.202 404.355L280.406 284.96H260.456L261.06 282.542L282.521 275.892L286.451 261.987C299.146 218.461 321.514 197 356.879 197ZM430.349 381C417.664 381 408 390.472 408 403C408 415.528 417.664 425 430.349 425C443.336 425 453 415.528 453 403C453 390.472 443.336 381 430.349 381Z";
const VB_FILI = "211 195 244 301.7";
const LOGOS: { id: string; name: string; hex: string; d: string; vb?: string; fr?: "evenodd" }[] = [
  /* Fili n'a pas de couleur écrite ici : la sienne est celle du site,
     choisie dans la barre d'outils. Elle est posée au rendu. */
  { id: "fili", name: "Fili", hex: "", d: D_FILI, vb: VB_FILI, fr: "evenodd" },
  { id: "spotify", name: "Spotify", hex: "#1DB954", d: "M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" },
  { id: "netflix", name: "Netflix", hex: "#E50914", d: "m5.398 0 8.348 23.602c2.346.059 4.856.398 4.856.398L10.113 0H5.398zm8.489 0v9.172l4.715 13.33V0h-4.715zM5.398 1.5V24c1.873-.225 2.81-.312 4.715-.398V14.83L5.398 1.5z" },
  { id: "stripe", name: "Stripe", hex: "#635BFF", d: "M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" },
  { id: "orange", name: "Orange", hex: "#FF7900", d: "M0 0h24v24H0V0Zm3.43 20.572h17.143v-3.429H3.43v3.429Z" },
  { id: "slack", name: "Slack", hex: "#4A154B", d: "M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" },
  { id: "apple", name: "Apple", hex: "#000000", d: "M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" },
];
/* taille : hors chaîne — la silhouette du logo, en px, jamais un token d'espace */
function Logo({ d, size, vb, fr }: { d: string; size: number; vb?: string; fr?: "evenodd" }) {
  return <svg viewBox={vb ?? "0 0 24 24"} width={size} height={size} fill="currentColor" aria-hidden="true"><path d={d} fillRule={fr} /></svg>;
}

const LOGO_CHIP = 22, LOGO_SCENE = 72; // hors chaîne : silhouettes des logos du playground

/* ── Étage « en liste » — ce qu'aucune image ne prouve. Chaque ligne dit
   où elle se vérifie : dans le code, sur l'écran allumé, ou nulle part. ── */
const LIST: LineList[] = [
  { name: "Deux gris, deux métiers",
    says: "Le gris fort tient 3:1 et sert quand le trait est la SEULE chose qui dit « on peut cliquer ici ». Le gris clair sépare et range, rien de plus. Le test tient en une question : si cette bordure disparaît, sait-on encore où interagir ?",
    or: "sur l'écran allumé", tone: "render" },
  { name: "Ni gris pâle, ni voile",
    says: "Le gris le plus clair de la charte ne porte jamais un texte — ici il n'a même pas de token. Même histoire avec l'opacité : un texte adouci au voile tombe sous le seuil. La hiérarchie se joue au corps et à la graisse, jamais à la pâleur.",
    or: "dans le code" },
  { name: "La valeur vit dans un seul fichier",
    says: "Aucune couleur en dur dans une interface : toute valeur passe par un token, et tous les tokens vivent au même endroit. Une couleur écrite à la main est introuvable au changement de marque.",
    or: "dans le code" },
  { name: "Un token naît d'un besoin réel",
    says: "Pas de rôle créé « au cas où ». Un token naît avec son premier consommateur, et un rôle qui perd le sien sort du registre.",
    or: "nulle part — décision d'Auteur", tone: "author" },
  { name: "Le couple complet dès la naissance",
    says: "Un ton n'entre jamais seul : il arrive avec son encre et son fond doux. Une couleur sans son encre est une paire qu'aucune table ne peut vérifier.",
    or: "dans le code" },
  { name: "Un token, une valeur par thème",
    says: "Le même nom porte une valeur en clair et une en sombre. On ne double jamais un token pour faire un thème, et aucun composant ne connaît le thème dans lequel il vit.",
    or: "dans le code" },
  { name: "Le désactivé attend son besoin",
    says: "Aucun token d'état désactivé tant qu'aucun composant n'en réclame un. Un gris pâle inventé d'avance finit toujours par porter du texte.",
    or: "nulle part — décision d'Auteur", tone: "author" },
  { name: "Le canal redondant se déclare",
    says: "La couleur ne porte jamais seule une information : elle est doublée par un mot, une forme ou une icône. Ce doublage se déclare, il ne se devine pas.",
    or: "sur l'écran allumé", tone: "render" },
  { name: "Les couleurs forcées ne se neutralisent jamais",
    says: "Quand le système d'exploitation force ses couleurs, la palette disparaît — on ne neutralise jamais ce mode. L'interface s'appuie alors sur ce qui survit : la sémantique, les bordures, le texte.",
    or: "dans le code" },
];

/* ── Étage « dans le code » — ce qu'on écrit, et ce que ça produit. Les
   valeurs résolues vivent dans les deux tables du dépliant : elles se
   lisent sur le rendu, elles ne se recopient pas ici. ── */
const CODE: LineCode[] = [
  { rule: "L'action pleine",
    written: <><span className="cs-kw">background</span>: <span className="cs-var">var(--primary)</span>; <span className="cs-kw">color</span>: <span className="cs-var">var(--on-primary)</span></>,
    product: "la marque, telle qu'elle est saisie", note: "son encre est cherchée du côté qui tient — noir sur une marque claire, blanc sur une sombre" },
  { rule: "Le lien",
    written: <><span className="cs-kw">color</span>: <span className="cs-var">var(--primary-text)</span></>,
    product: "la marque, recalée si besoin", note: "on assombrit le lien pour qu'il tienne son seuil, jamais la marque" },
  { rule: "Le texte courant",
    written: <><span className="cs-kw">color</span>: <span className="cs-var">var(--text-primary)</span></>,
    product: "l'encre du thème courant", note: "aucun token de texte ne descend sous son seuil, dans aucun thème" },
  { rule: "L'erreur",
    written: <><span className="cs-kw">color</span>: <span className="cs-var">var(--danger)</span>; <span className="cs-kw">background</span>: <span className="cs-var">var(--danger-subtle)</span></>,
    product: "le couple de l'erreur", note: "un rouge reste un rouge : les états ne suivent la marque que d'un quart de son déplacement" },
  { rule: "Le survol de l'action", fallback: true,
    written: <><span className="cs-kw">background</span>: <span className="cs-var">var(--primary-hover)</span></>,
    product: "un token, pas un calcul", note: "ni filtre ni assombrissement à la volée — un survol calculé n'est vérifiable nulle part" },
  { rule: "La bordure qui dit qu'on peut cliquer", fallback: true,
    written: <><span className="cs-kw">border</span>: 1px solid <span className="cs-var">var(--border-strong)</span></>,
    product: "le gris qui tient 3:1", note: "celui-là seulement quand le trait est la seule chose qui désigne la cible" },
  { rule: "La bordure qui range", fallback: true,
    written: <><span className="cs-kw">border</span>: 1px solid <span className="cs-var">var(--border)</span></>,
    product: "le gris qui sépare", note: "il n'a rien à désigner, il n'a donc pas de seuil à tenir" },
  { rule: "Le fond doux d'une famille", fallback: true,
    written: <><span className="cs-kw">background</span>: <span className="cs-var">var(--success-subtle)</span>; <span className="cs-kw">color</span>: <span className="cs-var">var(--on-success-subtle)</span></>,
    product: "le couple doux", note: "un fond doux ne voyage jamais sans l'encre qui va dessus" },
  { rule: "L'anneau de focus", fallback: true,
    written: <><span className="cs-kw">outline-color</span>: <span className="cs-var">var(--focus-ring)</span></>,
    product: "la famille de l'objet", note: "neutre par défaut, rouge sur un objet de danger — jamais une couleur nouvelle à l'écran" },
  { rule: "Le thème", fallback: true,
    written: <><span className="cs-kw">data-theme</span>=<span className="cs-var">&quot;dark&quot;</span></>,
    product: "toute la famille se résout", note: "aucun composant ne sait dans quel thème il vit" },
  { rule: "La marque", fallback: true,
    /* la valeur saisie est celle du moteur — la seule décision écrite à la main du système, lue à sa source */
    written: <><span className="cs-kw">--primary</span>: <span className="cs-var">{PRIMARY_DEFAULTS}</span></>,
    product: "une décision, toute la famille sort", note: "fonds, gris, liens, thème sombre — et ce qui deviendrait illisible est recalé de lui-même" },
];

const TOC: Toc = [
  ["palette", "01", "La marque rare"],
  ["swatches", "02", "Le nuancier"],
  ["engine", "03", "Le moteur"],
  ["registry", "04", "Le registre"],
];


export default function View() {
  const [tier, setTier] = useState(false);
  /* La démo montre une marque, elle ne pilote plus le site : la barre
     d'outils reste le seul endroit où l'on choisit celle de Fili. On
     retient donc la marque regardée, pas une couleur recopiée. */
  const [brandView, setBrandView] = useState("fili");
  const [brand, setBrand] = useState(false);
  const [filter, setFilter] = useState(false);
  const [actionDark, setActionDark] = useState(false);
  const [hueFree, setHueFree] = useState(false);
  const { primary } = usePrimary();
  const { theme } = useTheme();
  const sysDark = useSchemeSystem();
  const themeEffectif = theme === "system" ? (sysDark ? "dark" : "light") : theme;
  /* casse : une action sombre forcée en thème sombre — C14 mord */
  const actionDarkStyle: React.CSSProperties = { ["--primary" as string]: "#312E81" };
  const activeId = useDocSections("palette");
  const key = `${themeEffectif}-${primary}`;
  /* Le rail : Fili prend la couleur du site, les autres la leur. Même
     éteint, l'onglet Fili la porte — c'est à quoi il sert. Son encre est
     celle que le moteur recale pour rester lisible sur un fond clair :
     la barre d'outils accepte n'importe quelle couleur, le contrat non. */
  const brands = useMemo(() => LOGOS.map((m) => (m.id === "fili" ? { ...m, hex: primary } : m)), [primary]);
  const inkSite = useMemo(() => light(primary)["primary-text"], [primary]);
  const brandTrial = brands.find((m) => m.id === brandView) ?? brands[0];
  const trial = brandTrial.hex;
  const palTrial = useMemo(() => ({ light: light(trial) }), [trial]);
  const dTrial = brandTrial.d;
  const vbTrial = brandTrial.vb;
  const frTrial = brandTrial.fr;
  const nameTrial = brandTrial.name;
  const rangeTrial = useMemo(() => (range(trial) as [number, string][]).filter(([c]) => c === 100 || c === 300 || c === 500 || c === 700), [trial]);

  return (
    <div className="gdoc-background">
      <div className="gdoc">
        <RailDoc page="couleur" heading="Fondation · Couleur" toc={TOC} activeId={activeId} foot="COLOR-UX · dix-sept règles · deux thèmes" />

        <main className="gdoc-content" id="content">

          <section className="gdoc-hero">
            <p className="kicker">La couleur</p>
            <h1>Une seule couleur pour les gouverner toutes<span className="point" aria-hidden="true" /></h1>
            <p className="lede">La palette d&apos;un produit un peu ancien compte trente
            bleus, et plus personne pour dire lequel sert à quoi. Ici il y en a <b>une</b>,
            saisie une fois — tout le reste en descend par le calcul : les gris, les fonds,
            les liens, le thème sombre. Et chaque rapport de contraste que vous lirez sur
            cette page est mesuré sur la page elle-même, jamais recopié d&apos;une table.</p>
          </section>

          {/* ── 01 · LA MARQUE RARE — la palette et la situation, fondues le
              8 septembre 2026 : c'était la même idée dite deux fois. Le tableau
              de bord porte la preuve (la marque sur une card, un bouton, une
              barre ; tout le reste neutre), la mosaïque de la charte et ses
              proportions disent la répartition. Les gammes 50–950 sont au
              répertoire. ── */}
          <section className="gdoc-sec set" id="palette">
            <div className="gdoc-sec-head">
              <p className="kicker">01 · La marque rare</p>
              <h2>On reconnaît une marque au peu de place qu&apos;elle prend</h2>
              <p className="muted">Plus on en met, moins on la voit — c&apos;est le paradoxe de la
              couleur d&apos;entreprise. Un tableau de bord tient debout parce que la marque y est
              rare : une card, un bouton, une barre ; tout le reste est neutre.</p>
            </div>
            <div className="gdoc-body">
              <figure className="gd-figure" id="situation" style={{ justifyItems: "stretch" }}>
                <div className="bench veil">
                  <Bento key={key} />
                </div>
                <figcaption className="gd-caption">
                  la grille suit la marque et le thème, en direct — un seul geste de marque sur tout l&apos;écran
                </figcaption>
              </figure>
              <figure className="gd-figure" style={{ justifyItems: "stretch" }}>
                <Palette key={key} />
                <figcaption className="gd-caption">
                  la charte en mosaïque, puis en proportions : le blanc, l&apos;encre et les gris font tout le travail, la marque garde ses cinq pour cent
                </figcaption>
              </figure>
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <p>Les états gardent leur teinte à eux, et les couleurs d&apos;alerte ne viennent
                jamais puiser dans la marque. Le texte posé sur la photo n&apos;est jamais nu : il
                repose sur un voile aux couleurs du fond, dont l&apos;opacité est calculée sur le
                pixel le plus défavorable et refaite à chaque largeur.</p>
                <Rules ids={["p01", "c1", "c4", "m2", "m3", "c6", "c3"]} />
              </div></details>
            </div>
          </section>

          <section className="gdoc-sec set" id="swatches">
            <div className="gdoc-sec-head">
              <p className="kicker">02 · Le nuancier</p>
              <h2>Ce nuancier montre des métiers, pas des teintes</h2>
              <p className="muted">Un nuancier de peintre montre des teintes. Celui-ci montre des
              métiers : à quoi sert cette couleur, et où elle n&apos;a rien à faire. Chaque
              languette naît en couple complet — le ton, son encre, son fond doux — ou ne naît
              pas. Sa fiche lit les valeurs et le rapport sur la page rendue, dans le thème
              du moment.</p>
            </div>
            <div className="gdoc-body">
              <figure className="gd-figure" style={{ justifyItems: "stretch" }}>
                <Swatches key={key} />
              </figure>
              <details className="prov"><summary>Règles &amp; sources</summary><div>
                <Rules ids={["c2", "c5"]} />
              </div></details>
            </div>
          </section>

          <section className="gdoc-sec set" id="engine">
            <div className="gdoc-sec-head">
              <p className="kicker">03 · Le moteur</p>
              <h2>Une couleur entre, toute la famille sort</h2>
              <p className="muted">Changer de marque ne devrait pas être un chantier de trois semaines.
              Une couleur entre, toute la famille sort — fonds, gris, liens, thème sombre — et
              ce qui deviendrait illisible se recale tout seul. Les couleurs d&apos;erreur et de
              succès, elles, bougent à peine : un rouge doit rester un rouge. Une marque
              choisie dans le rail passe dans le moteur sans toucher au site.</p>
            </div>
            <div className="gdoc-body">
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
                  {brands.map((m) => (
                    <button key={m.id} className="mk-chip" title={m.name} aria-pressed={m.id === brandView}
                      style={m.id === brandView ? { background: m.hex, color: palTrial.light["on-primary"] }
                        : m.id === "fili" ? { color: inkSite } : undefined}
                      onClick={() => setBrandView(m.id)}>
                      <Logo d={m.d} vb={m.vb} fr={m.fr} size={LOGO_CHIP} />
                    </button>
                  ))}
                </div>
                <div className="mk-scene">
                  <div className="mk-duo">
                    <div className="mk-large" style={{ background: palTrial.light.primary, color: palTrial.light["on-primary"] }}>
                      <Logo d={dTrial} vb={vbTrial} fr={frTrial} size={LOGO_SCENE} /><span className="mk-base">{nameTrial}</span>
                    </div>
                    <div className="mk-large" style={{ background: palTrial.light["primary-subtle"], color: palTrial.light["primary-text"] }}>
                      <Logo d={dTrial} vb={vbTrial} fr={frTrial} size={LOGO_SCENE} /><span className="mk-base">{nameTrial}</span>
                    </div>
                  </div>
                  <div className="mk-rank">
                    {rangeTrial.map(([step, hex]) => (
                      <span key={step} className="mk-bar" style={{ background: hex }} title={`${step} · ${hex}`} />
                    ))}
                  </div>
                  <div className="mk-rank">
                    {/* Les couples semantiques de la palette DERIVEE : chaque
                        famille garde sa teinte de charte, mais elle est tiree
                        par le deplacement de la marque et recalee sur ses
                        fonds — lus dans palEssai, jamais dans la page. */}
                    {["danger", "success", "warning", "info"].map((v) => (
                      <span key={v} className="mk-pair">
                        <span className="mk-bar" style={{ background: palTrial.light[v] }} />
                        <span className="mk-bar" style={{ background: palTrial.light[`${v}-subtle`] }} />
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
                <Rules ids={["c7", "c9", "c15"]} />
              </div></details>
            </div>
          </section>

          {/* ═══ LE RÉPERTOIRE — une seule section, à la couleur (8 sept. 2026) :
              dans l'ordre commun aux six pages (verdict d'Auteur, 8 sept.) : les cinq
              gestes qui cassent (#wreck), les règles qui se vérifient ailleurs
              (#invisibles), puis les valeurs — les six gammes (#gammes) et la table
              des rôles dans les deux thèmes (#code). ═══ */}
          <section className="gdoc-sec set" id="registry">
            <div className="gdoc-sec-head">
              <p className="kicker">04 · Le registre</p>
              <h2>Des rôles, jamais des valeurs — et chaque valeur, lue sur le rendu</h2>
              <p className="muted">Cinq gestes ordinaires qui cassent sans message d&apos;erreur ; les
              règles qui ne se photographient pas ; les six gammes d&apos;où les rôles se posent ; et
              chaque rôle, sa valeur claire, sa valeur sombre, résolues sur la page rendue et suivant
              la marque du moment. Les lignes marquées « décision d&apos;Auteur » sont des réglages du
              kit, pas des lois de la perception.</p>
            </div>
            <div className="gdoc-body">
              <div className="doc-piece" id="wreck">
                <div className="doc-piece-head">
                  <h3>Cinq gestes ordinaires, sans message d&apos;erreur</h3>
                  <p className="muted">Chacun se commet pour de vrai sur sa scène, puis se répare.
                  C&apos;est ce qui les rend coûteux : rien ne les signale.</p>
                </div>
              <Bands>
                <Band level={4} name="Le contraste se vérifie par paire" side="4,5:1 pour le texte courant"
                  says="Une couleur toute seule ne veut rien dire : ce qui se mesure, c&apos;est un texte SUR son fond. Une encre douce qui pâlit fait tomber le verdict — les rapports ne sont pas recopiés d&apos;une table, ils sont calculés sur ce que l&apos;écran affiche."
                  broken={tier} onBroken={setTier}
                  labelBroken="Casser : pâlir l&apos;encre douce" labelRepaired="Rendre l&apos;encre du registre"
                  bare rules={<>
                    <p><b>La table complète</b> — chaque paire, mesurée dans les deux thèmes :</p>
                    <TablePairs key={key} />
                    <Rules ids={["c7", "c9", "c13"]} />
                  </>}>
                  <DuoThemes key={key} tier={tier} />
                </Band>

                <Band level={4} name="Chacun son registre" side="l&apos;erreur n&apos;est pas la marque"
                  says="Trois registres, étanches : la marque signe, la sémantique alerte, le neutre porte. Une erreur qui prend la couleur de la marque détruit le vocabulaire des deux — plus rien, à l&apos;écran, ne dit ce qui est grave et ce qui est de la maison."
                  broken={brand} onBroken={setBrand}
                  rules={<Rules ids={["c3", "c2"]} />}>
                  <div className="cl-scene">
                    <Alert tone="danger" colorSingleOne={false} brand={brand} />
                    {brand && <span className="badge ko">l&apos;erreur porte la couleur de la marque — le vocabulaire chromatique est détruit</span>}
                  </div>
                </Band>

                <Band level={4} name="Le survol est un token" side="jamais un calcul"
                  says="Un survol produit par un filtre n&apos;existe dans aucun registre : aucune table ne peut le vérifier, et personne ne saura dire quelle couleur il fabrique. Le bouton répond au survol dans les deux états."
                  broken={filter} onBroken={setFilter}
                  rules={<Rules ids={["c10", "c8"]} />}>
                  <div className="cl-scene">
                    <button type="button" className={`button demo-full ${filter ? "filter" : "token"}`}>Créer le budget</button>
                    {filter && <span className="badge ko">ce survol est calculé à la volée — aucune table ne peut le vérifier</span>}
                  </div>
                </Band>

                <Band level={4} name="En sombre, l&apos;action s&apos;éclaircit" side="deux valeurs, un seul nom"
                  says="Le même token porte une valeur en clair et une en sombre. Une action forcée à garder sa valeur claire dans le thème sombre s&apos;enfonce dans le fond, et le bouton cesse d&apos;être un bouton."
                  broken={actionDark} onBroken={setActionDark}
                  rules={<Rules ids={["c12", "c14", "c13"]} />}>
                  <div className="cl-pair">
                    <div data-theme="light" className="cl-side">
                      <span className="mono cl-side-name">clair</span>
                      <MiniScreen key={`light-${actionDark}-${primary}`} />
                    </div>
                    <div data-theme="dark" data-intent={actionDark ? "statement" : undefined}
                      className="cl-side" style={actionDark ? actionDarkStyle : undefined}>
                      <span className="mono cl-side-name">sombre{actionDark ? " — forcée" : ""}</span>
                      <MiniScreen key={`dark-${actionDark}-${primary}`} />
                    </div>
                  </div>
                </Band>

                <Band level={4} name="Teinter ne coûte rien" side="à luminance constante"
                  says="À luminance constante, la teinte bouge et le rapport ne bouge pas — c&apos;est ce qui permet des neutres teintés à la marque, sûrs par construction. Quand la luminance file avec la teinte, les trois gris se ressemblent toujours, et leurs rapports n&apos;ont plus rien à voir."
                  broken={hueFree} onBroken={setHueFree}
                  labelBroken="Casser : laisser filer la luminance"
                  rules={<Rules ids={["c15", "c17"]} />}>
                  <HueConstant broken={hueFree} />
                </Band>
              </Bands>
              </div>

              <div className="doc-piece" id="invisibles">
                <div className="doc-piece-head">
                  <h3>Les autres règles</h3>
                  <p className="muted">Elles se vérifient dans le code, sur l&apos;écran allumé, ou
                  nulle part — et alors elles s&apos;assument comme un choix, daté.</p>
                </div>
                <ListRules lines={LIST} />
                <details className="prov"><summary>Règles &amp; sources</summary><div>
                  <Rules ids={["c1", "c4", "c5", "c6", "c11", "c12", "c16", "c17"]} />
                </div></details>
              </div>

              <div className="doc-piece" id="gammes">
                <div className="doc-piece-head">
                  <h3>Les six gammes, et où chaque rôle se pose</h3>
                  <p className="muted">La couleur saisie se pose sur le cran de sa clarté, telle
                  quelle ; les autres crans en descendent. Les neutres sont les marches fixes,
                  teintées à la marque. Aucun rôle ne consomme un cran : il s&apos;y pose.</p>
                </div>
              <details className="prov" open><summary>Les six gammes — la marque, les neutres, et les quatre familles sémantiques</summary>
                <div className="gm-next">
                  <span className="mono muted gm-heading" style={{ fontSize: "var(--font-size-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase" }}>La marque — dérivée du primary</span>
                  <Range primary={primary} />
                  <span className="mono muted gm-heading" style={{ fontSize: "var(--font-size-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase" }}>Les neutres — les mêmes clartés, teintées à la marque</span>
                  <RangeNeutrals primary={primary} />
                  {FAMILIES_SEMANTIC.map(([heading, name]) => (
                    <React.Fragment key={name}>
                      <span className="mono muted gm-heading" style={{ fontSize: "var(--font-size-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase" }}>{heading}</span>
                      <RangeFamily primary={primary} name={name} />
                    </React.Fragment>
                  ))}
                </div>
              </details>
              </div>

              <div className="doc-piece" id="code">
                <div className="doc-piece-head">
                  <h3>Les rôles, dans les deux thèmes</h3>
                  <p className="muted">Ce qui fait foi, c&apos;est la règle et le token — pas l&apos;extrait
                  de code, qui vieillit et finit par mentir. Un seul jeu de tokens produit les
                  variables CSS natives et une sortie Tailwind jumelle ; les deux thèmes vivent
                  dans le token, chaque consommateur en hérite sans rien coder.</p>
                </div>
                <PanelRegistry lines={CODE} />
                <details className="prov"><summary>La table des rôles — chaque valeur, lue sur le rendu</summary><div>
                  <TableRoles key={key} />
                </div></details>
                <details className="prov"><summary>Règles &amp; sources</summary><div>
                  <Rules ids={["c12", "c1"]} />
                </div></details>
              </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
