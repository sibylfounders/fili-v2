"use client";
import { useEffect, useRef, useState } from "react";
import { Navigation } from "../nav";
import { Apercu, PanneauCode } from "../apercu";
import { Densite } from "../densite";
import { Adaptation, useAdaptation } from "../adaptation";
import { Theme, useTheme, useSchemeSysteme } from "../theme";

/* La page vivante de la famille couleur (COLOR-UX.md 2.0.0, C1–C16),
   refaite le 23 août au soir à la manière de la CHARTE DE CONCEPTION
   (docs/charte/filicharte_6.html) : la palette se montre en mosaïque et
   en proportions d'usage, les tons portent leur contraste sur eux-mêmes,
   les garde-fous se lisent en prose, et une section « En situation »
   éprouve la famille sur une vraie interface. Tous les rapports affichés
   sont MESURÉS sur la page rendue — jamais recopiés. */

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
function versHex(c: number[]): string {
  return "#" + c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase();
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

/* ── La table complète des paires déclarées (C7) — reléguée en dépliant :
   les pastilles la montrent, elle la prouve. ── */
const PAIRES: [string, string, string, number][] = [
  ["--text-primary", "--bg", "l'encre sur le blanc", 4.5],
  ["--text-primary", "--surface", "l'encre sur le gris posé", 4.5],
  ["--text-secondary", "--bg", "le texte second sur le blanc", 4.5],
  ["--text-secondary", "--surface", "le texte second sur le gris", 4.5],
  ["--primary", "--bg", "le lien sur le blanc", 4.5],
  ["--primary-hover", "--bg", "le lien survolé — C8", 4.5],
  ["--on-primary", "--primary", "le texte de l'action pleine", 4.5],
  ["--primary", "--primary-subtle", "le badge sur son fond doux", 4.5],
  ["--on-primary-subtle", "--primary-subtle", "le texte sur fond doux", 4.5],
  ["--danger", "--danger-subtle", "danger sur son fond doux", 4.5],
  ["--on-danger", "--danger", "le texte sur danger plein", 4.5],
  ["--success", "--success-subtle", "success sur son fond doux", 4.5],
  ["--on-success", "--success", "le texte sur success plein", 4.5],
  ["--warning", "--warning-subtle", "warning sur son fond doux", 4.5],
  ["--on-warning", "--warning", "le texte sur warning plein", 4.5],
  ["--info", "--info-subtle", "info sur son fond doux", 4.5],
  ["--on-info", "--info", "le texte sur info plein", 4.5],
  ["--border-strong", "--bg", "la bordure délimitante (3:1)", 3],
  ["--accent", "--bg", "l'anneau de focus sur le blanc (3:1)", 3],
  ["--accent", "--surface", "l'anneau de focus sur le gris (3:1)", 3],
];

const REGLES: { id: string; nom: string; titre: string; enonce: string; pourquoi?: string; div?: string; src: { t: string; h: string }[] }[] = [
  { id: "p01", nom: "principe", titre: "Par rôle, jamais par valeur",
    enonce: "La couleur s'applique par rôle, jamais par valeur — et un rôle ne porte jamais deux sens. Chaque fois qu'une valeur est choisie « parce qu'elle est jolie ici », c'est le signe qu'un rôle manque ou qu'un registre fuit.",
    src: [{ t: "Material 3 — color roles", h: "https://developer.android.com/design/ui/mobile/guides/styles/color" }, { t: "GOV.UK — Colour", h: "https://design-system.service.gov.uk/styles/colour/" }] },
  { id: "c1", nom: "C1", titre: "La valeur vit dans un seul fichier",
    enonce: "Le rôle d'une couleur et sa valeur sont deux décisions distinctes : les composants référencent le rôle, la valeur vit dans une source unique et peut changer entièrement sans qu'aucune règle bouge.",
    pourquoi: "Un composant qui référence un rôle survit au rebranding ; un composant qui référence un bleu meurt avec lui. Et une valeur en dur ignore les thèmes — vous venez de le voir.",
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
    div: "Deux rôles de marque, deux métiers : primary, l'action — tenue en réserve, 5 % de la page — et accent, l'anneau de focus, qui entoure et n'accueille jamais de texte. Pas de « seconde voix » décorative : le jour où une teinte portera un vrai rôle, elle entrera avec son couple.",
    src: [{ t: "Règle interne du système (précédent journalisé)", h: "#" }] },
  { id: "c5", nom: "C5", titre: "Le couple complet dès la naissance",
    enonce: "Toute nouvelle valeur sémantique fournit son couple texte/fond subtil d'emblée ; les neutres vivent en échelle.",
    div: "Warning et info sont nés ce soir, chacun avec son couple complet et son premier consommateur — la section En situation. Pas avant : c'est C4 appliqué à la sémantique.",
    src: [{ t: "Règle interne du système (héritée du bouton)", h: "#" }] },
  { id: "c6", nom: "C6", titre: "Le canal redondant se déclare",
    enonce: "Chaque usage sémantique de la couleur déclare un canal non chromatique — icône, mot ou forme — qui ne se retire jamais pour alléger. C'est la moitié vérifiable du principe cardinal : jamais la couleur seule.",
    pourquoi: "Environ 8 % des hommes ont une déficience rouge-vert. Le contraste rend le texte lisible ; il ne distingue pas un rouge d'un vert pour qui ne voit pas la différence. Deux exigences indépendantes.",
    src: [{ t: "WCAG 1.4.1 — Use of Color", h: "https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html" }] },
  { id: "c7", nom: "C7", titre: "Le contraste se vérifie par paire",
    enonce: "Un jeton de texte n'est jamais conforme dans l'absolu — il l'est sur un fond donné. Chaque jeton de texte déclare ses fonds d'usage ; tout fond non déclaré est interdit.",
    pourquoi: "Le cas vécu : un vert conforme sur blanc, qu'il a fallu recalibrer pour tenir sur son propre fond doux — 4,57:1 aujourd'hui, au ras du seuil, et c'est écrit.",
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
    div: "Dette assumée, écrite, avec sa condition de sortie — la norme exempte les composants inactifs du contraste minimum, et aucun consommateur du kit n'a documenté le besoin.",
    src: [{ t: "WCAG 1.4.3 — exemption des composants inactifs", h: "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html" }] },
  { id: "c12", nom: "C12", titre: "Un jeton, une valeur par thème",
    enonce: "Dans un système à thèmes, chaque jeton de couleur résout une valeur par thème déclaré — c'est la condition d'existence d'un second thème.",
    pourquoi: "« Impossible d'implémenter un mode sombre sans jetons partout » — la leçon convergente des systèmes à thèmes. Les rôles ne bougent pas ; c'est la table de valeurs qui double.",
    src: [{ t: "Carbon — Themes", h: "https://carbondesignsystem.com/elements/themes/overview/" }, { t: "Atlassian — color foundations", h: "https://atlassian.design/foundations/color" }] },
  { id: "c13", nom: "C13", titre: "Le sombre est couvert, et vérifié comme le clair",
    enonce: "Chaque rôle résout une valeur en clair et en sombre, le thème sombre s'active sur la préférence du système, et les seuils se vérifient thème par thème.",
    div: "La charte ne couvre pas encore le sombre : ses valeurs sombres viennent du registre du dépôt, dit comme tel. Les pastilles ci-dessus mesurent les deux thèmes en permanence.",
    src: [{ t: "MDN — prefers-color-scheme", h: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme" }] },
  { id: "c14", nom: "C14", titre: "Les deux textes garantis, du même côté",
    enonce: "Deux textes garantis sur un même fond ne peuvent tous deux atteindre le seuil que s'ils tombent du même côté de l'échelle de luminance — d'où la contrainte démontrée : un thème sombre ne peut pas avoir une couleur d'action sombre.",
    pourquoi: "Ce n'est pas un goût, c'est un calcul : avec une action sombre, aucun texte représentable ne tient 4,5:1 à la fois sur elle et sur le fond quasi noir. L'accent s'éclaircit en sombre, par construction.",
    src: [{ t: "WCAG — définition du rapport de contraste", h: "https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio" }] },
  { id: "c15", nom: "C15", titre: "Teinter un neutre ne coûte rien, à luminance constante",
    enonce: "Le rapport de contraste ne dépend que de la luminance relative ; teinter un neutre en conservant sa luminance ne change aucun rapport — l'opération est sûre par construction.",
    div: "Note d'exécution héritée du ménage : conversion dans l'espace perceptif (oklch), clarté figée, teinte posée, puis recalage fin de la luminance d'origine.",
    src: [{ t: "WCAG — relative luminance", h: "https://www.w3.org/TR/WCAG22/#dfn-relative-luminance" }, { t: "CSS Color 4 — oklch()", h: "https://www.w3.org/TR/css-color-4/" }] },
  { id: "c16", nom: "C16", titre: "Les couleurs forcées ne se neutralisent jamais",
    enonce: "Quand le système d'exploitation force ses couleurs, la palette disparaît — on ne neutralise jamais ce mode, et l'interface s'appuie sur ce qui survit : la sémantique, les bordures, le texte.",
    pourquoi: "C'est une raison de plus pour les canaux redondants : l'icône et le mot restent quand la couleur tombe.",
    src: [{ t: "MDN — @media (forced-colors)", h: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors" }, { t: "MDN — forced-color-adjust", h: "https://developer.mozilla.org/en-US/docs/Web/CSS/forced-color-adjust" }] },
];

function Regles({ ids }: { ids: string[] }) {
  return (
    <div style={{ display: "grid", gap: "var(--space-block-xl)" }}>
      {ids.map((id) => REGLES.find((r) => r.id === id)!).map((r) => (
        <div key={r.id} style={{ display: "grid", gap: "var(--space-block-sm)", maxWidth: "var(--measure)" }}>
          <b style={{ color: "var(--text-primary)" }}><span className="badge">{r.nom}</span> {r.titre}</b>
          <span>{r.enonce}</span>
          {r.pourquoi && <span className="sourd">{r.pourquoi}</span>}
          {r.div && <div className="divergence" style={{ fontSize: "0.8125rem" }}>{r.div}</div>}
          <span style={{ fontSize: "0.8125rem" }}>Sources : {r.src.map((sc, i) => (
            <span key={sc.t}>{i > 0 && " · "}{sc.h === "#" ? sc.t : <a href={sc.h}>{sc.t}</a>}</span>
          ))}</span>
        </div>
      ))}
    </div>
  );
}

/* ── 01 · La mosaïque de la charte : la palette composée comme une affiche,
   chaque tuile cliquable copie sa valeur — lue au rendu, elle suit le thème. ── */
const TUILES: { nom: string; jeton: string; sur: string; col: string; row: string; bord?: boolean }[] = [
  { nom: "primary", jeton: "--primary", sur: "--on-primary", col: "1 / 8", row: "1" },
  { nom: "background", jeton: "--bg", sur: "--text-primary", col: "8 / 13", row: "1", bord: true },
  { nom: "primary-subtle", jeton: "--primary-subtle", sur: "--on-primary-subtle", col: "1 / 4", row: "2 / 4" },
  { nom: "text-primary", jeton: "--text-primary", sur: "--bg", col: "4 / 13", row: "2" },
  { nom: "surface", jeton: "--surface", sur: "--text-primary", col: "4 / 9", row: "3", bord: true },
  { nom: "border-strong", jeton: "--border-strong", sur: "--bg", col: "9 / 13", row: "3" },
];
const PROPORTIONS: { nom: string; jeton: string; sur: string; part: number; bord?: boolean }[] = [
  { nom: "background", jeton: "--bg", sur: "--text-primary", part: 56, bord: true },
  { nom: "surface", jeton: "--surface", sur: "--text-primary", part: 18, bord: true },
  { nom: "text-primary", jeton: "--text-primary", sur: "--bg", part: 14 },
  { nom: "border-strong", jeton: "--border-strong", sur: "--bg", part: 7 },
  { nom: "primary", jeton: "--primary", sur: "--on-primary", part: 5 },
];

function Palette({ cle }: { cle: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vue, setVue] = useState<"mosaique" | "proportions">("mosaique");
  const [hexs, setHexs] = useState<Record<string, string>>({});
  const [copie, setCopie] = useState<string | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    const v: Record<string, string> = {};
    TUILES.forEach((t) => { const c = resoudre(ref.current!, t.jeton); if (c) v[t.jeton] = versHex(c); });
    setHexs(v);
  }, [cle]);
  const copier = (jeton: string) => {
    if (hexs[jeton]) navigator.clipboard?.writeText(hexs[jeton]).catch(() => {});
    setCopie(jeton); setTimeout(() => setCopie(null), 1400);
  };
  return (
    <div ref={ref} style={{ width: "100%", display: "grid", gap: "var(--space-block-unit)" }}>
      <div className="rang" style={{ gap: "var(--space-inline-sm)" }}>
        {([["mosaique", "Mosaïque"], ["proportions", "Proportions"]] as const).map(([v, nom]) => (
          <button key={v} className={`bouton ${vue === v ? "on" : ""}`} style={{ height: "1.75rem", padding: "0 var(--space-inline-sm)", fontSize: "0.6875rem" }} onClick={() => setVue(v)}>{nom}</button>
        ))}
        <span className="sourd" style={{ fontSize: "0.75rem" }}>— cliquer une couleur copie sa valeur</span>
      </div>
      {vue === "mosaique" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gridTemplateRows: "7rem 4.25rem 4.25rem", gap: "var(--space-inline-sm)", width: "100%" }}>
          {TUILES.map((t) => (
            <button key={t.jeton} onClick={() => copier(t.jeton)} title={`Copier ${hexs[t.jeton] ?? ""}`} style={{
              gridColumn: t.col, gridRow: t.row, background: `var(${t.jeton})`, color: `var(${t.sur})`,
              border: t.bord ? "1px solid var(--border)" : "0", borderRadius: "var(--radius)",
              display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "space-between",
              padding: "var(--space-block-md) var(--space-inline-unit)", cursor: "pointer", font: "inherit", textAlign: "left", minWidth: 0, overflow: "hidden",
            }}>
              <span style={{ fontWeight: 600, fontSize: "0.8125rem" }}>{copie === t.jeton ? "Copié ✓" : t.nom}</span>
              <span className="mono" style={{ fontWeight: 400, fontSize: "0.625rem", opacity: 0.85 }}>{t.jeton} · {hexs[t.jeton] ?? "…"}</span>
            </button>
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", width: "100%", height: "13rem", gap: "var(--space-inline-xs)" }}>
          {PROPORTIONS.map((t) => (
            <button key={t.jeton} onClick={() => copier(t.jeton)} title={`Copier ${hexs[t.jeton] ?? ""}`} style={{
              flexBasis: `${t.part}%`, flexGrow: 0, flexShrink: 0, minWidth: 0, background: `var(${t.jeton})`, color: `var(${t.sur})`,
              border: t.bord ? "1px solid var(--border)" : "0", borderRadius: "var(--radius)",
              display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-end",
              padding: "var(--space-block-md) var(--space-inline-sm)", cursor: "pointer", font: "inherit", textAlign: "left", overflow: "hidden",
            }}>
              <span style={{ fontWeight: 600, fontSize: "0.6875rem", whiteSpace: "nowrap" }}>{copie === t.jeton ? "Copié ✓" : t.nom}</span>
              <span className="mono" style={{ fontWeight: 400, fontSize: "0.625rem", opacity: 0.85 }}>{t.part} %</span>
            </button>
          ))}
        </div>
      )}
      <p className="sourd" style={{ fontSize: "0.8125rem", maxWidth: "var(--measure)" }}>
        La vue Proportions dit l&apos;essentiel : la marque est <b style={{ color: "var(--text-primary)" }}>tenue en
        réserve</b> — 5 % de la page. Tout le reste est encre, papier et les gris entre les deux.
      </p>
    </div>
  );
}

/* ── 02 · Les pastilles de tons : le contraste se lit SUR la pastille ── */
function Ton({ nom, texte, fond, seuil = 4.5, cle }: { nom: string; texte: string; fond: string; seuil?: number; cle: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [r, setR] = useState(0);
  const [hx, setHx] = useState<[string, string]>(["…", "…"]);
  useEffect(() => {
    if (!ref.current) return;
    const a = resoudre(ref.current, texte), b = resoudre(ref.current, fond);
    if (a && b) { setR(contraste(a, b)); setHx([versHex(a), versHex(b)]); }
  }, [texte, fond, cle]);
  const ko = r > 0 && r < seuil;
  return (
    <div ref={ref} style={{
      background: `var(${fond})`, color: `var(${texte})`, border: `1px solid var(${texte})`,
      borderRadius: "var(--radius)", padding: "var(--space-block-unit) var(--space-inline-unit)",
      display: "grid", gap: "var(--space-block-xs)", justifyItems: "start", textAlign: "left", minWidth: 0,
    }}>
      <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>{nom}</span>
      <span className="mono" style={{ fontWeight: 400, fontSize: "0.625rem" }}>{hx[0]} sur {hx[1]}</span>
      <span style={{ fontWeight: 700, fontSize: "1.0625rem", letterSpacing: "-0.01em" }}>
        {fmt(r)}{ko && " ✗"}
      </span>
      {ko && <span className="mono" style={{ fontSize: "0.625rem" }}>sous le seuil de {seuil === 3 ? "3:1" : "4,5:1"} — illisible</span>}
    </div>
  );
}

function TableauPaires({ grisPale }: { grisPale: boolean }) {
  const clairRef = useRef<HTMLDivElement>(null);
  const sombreRef = useRef<HTMLDivElement>(null);
  const [lignes, setLignes] = useState<{ clair: number; sombre: number }[]>([]);
  useEffect(() => {
    const lire = (host: HTMLDivElement | null) =>
      PAIRES.map(([texte, fond]) => {
        if (!host) return 0;
        const a = resoudre(host, texte), b = resoudre(host, fond);
        return a && b ? contraste(a, b) : 0;
      });
    const clair = lire(clairRef.current), sombre = lire(sombreRef.current);
    setLignes(PAIRES.map((_, i) => ({ clair: clair[i], sombre: sombre[i] })));
  }, [grisPale]);
  const paleClair: React.CSSProperties = { ["--text-secondary" as any]: "#9CA3AF" };
  const paleSombre: React.CSSProperties = { ["--text-secondary" as any]: "#6B7280" };
  const Cellule = ({ r, seuil }: { r: number; seuil: number }) => (
    <td><span className={`badge ${r > 0 && r < seuil ? "ko" : ""}`}>{fmt(r)}</span></td>
  );
  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <div ref={clairRef} data-theme="light" style={grisPale ? paleClair : undefined} hidden />
      <div ref={sombreRef} data-theme="dark" style={grisPale ? paleSombre : undefined} hidden />
      <table className="tableau" style={{ width: "100%" }}>
        <thead><tr><th>Paire déclarée</th><th>Seuil</th><th>Thème clair</th><th>Thème sombre</th></tr></thead>
        <tbody>
          {PAIRES.map(([texte, fond, libelle, seuil], i) => (
            <tr key={libelle}>
              <td style={{ whiteSpace: "normal" }}>{libelle}<br />
                <span className="mono" style={{ color: "var(--text-secondary)", fontWeight: 400, fontSize: "0.625rem" }}>{texte} / {fond}</span></td>
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

/* ── 03 · Les alertes : le couple, le canal — et la marque qui reste chez elle ── */
function Alerte({ ton, couleurSeule, marque }: { ton: "danger" | "success"; couleurSeule: boolean; marque: boolean }) {
  const teinte = marque ? "--primary" : ton === "danger" ? "--danger" : "--success";
  const doux = marque ? "--primary-subtle" : ton === "danger" ? "--danger-subtle" : "--success-subtle";
  const texte = marque ? "--on-primary-subtle" : teinte;
  const icone = ton === "danger" ? "⚠" : "✓";
  const mot = ton === "danger" ? "Erreur" : "Succès";
  const msg = ton === "danger" ? "le dossier n'a pas pu être enregistré." : "le dossier est enregistré.";
  return (
    <div style={{
      background: `var(${doux})`, color: couleurSeule ? "var(--text-primary)" : `var(${texte})`,
      border: `1px solid var(${teinte})`, borderInlineStart: `4px solid var(${teinte})`,
      borderRadius: "var(--radius)", padding: "var(--space-block-unit) var(--space-inline-unit)",
      fontSize: "0.875rem", maxWidth: "28rem", width: "100%", textAlign: "left",
    }}>
      {couleurSeule
        ? <>Le dossier {ton === "danger" ? "n&apos;a pas pu être enregistré" : "est enregistré"}.</>
        : <><b>{icone} {mot}</b> — {msg}</>}
    </div>
  );
}

/* ── 04 · En situation : les mêmes jetons, portés par un écran plausible ── */
function EnSituation({ filtre }: { filtre: boolean }) {
  return (
    <div style={{ width: "100%", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 16rem), 1fr))", gap: "var(--space-inline-unit)", textAlign: "left" }}>
      {/* La mesure : un chiffre, son delta sémantique, sa courbe */}
      <div className="carte" style={{ gap: "var(--space-block-md)" }}>
        <span className="mono sourd">Revenus · 30 derniers jours</span>
        <span style={{ fontSize: "var(--font-size-h1)", fontWeight: 600, letterSpacing: "-0.02em" }}>15 989 €</span>
        <span className="badge" style={{ color: "var(--success)", background: "var(--success-subtle)" }}>▲ 15,3 %</span>
        <svg viewBox="0 0 88 32" preserveAspectRatio="none" aria-hidden style={{ width: "100%", height: "2.5rem" }}>
          <polyline fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points="2,26 17,22 32,24 47,16 62,18 77,9 86,5" />
        </svg>
      </div>
      {/* Le journal : chaque étiquette est un couple ton/fond doux */}
      <div className="carte" style={{ gap: "var(--space-block-md)" }}>
        <span className="mono sourd">Journal</span>
        <div style={{ display: "grid" }}>
          {([["Ce que le contraste ne dit pas", "--info", "--info-subtle", "Couleur"],
             ["Le gris pâle n'est plus un texte", "--on-primary-subtle", "--primary-subtle", "Décision"],
             ["Écrire une erreur sans accuser", "--success", "--success-subtle", "Voix"]] as const).map(([titre, t, f, tag]) => (
            <div key={titre} className="demo-ligne" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-inline-sm)", padding: "var(--space-block-md) var(--space-inline-sm)", borderRadius: "var(--radius)", fontSize: "0.8125rem" }}>
              <span style={{ minWidth: 0 }}>{titre}</span>
              <span className="badge" style={{ color: `var(${t})`, background: `var(${f})`, flex: "none" }}>{tag}</span>
            </div>
          ))}
        </div>
        <span className="sourd" style={{ fontSize: "0.75rem" }}>Survolez une ligne : le survol est un jeton (surface-hover), pas un filtre.</span>
      </div>
      {/* Le formulaire : le champ, son anneau accent, l'action primary */}
      <div className="carte" style={{ gap: "var(--space-block-md)" }}>
        <span className="mono sourd">Nouveau budget</span>
        <div className="champ">
          <input placeholder="Nom du budget" aria-label="Nom du budget" />
        </div>
        <div><button className={`bouton demo-plein ${filtre ? "filtre" : "jeton"}`}>Créer le budget</button></div>
        <span className="sourd" style={{ fontSize: "0.75rem" }}>Cliquez dans le champ : l&apos;anneau cyan est l&apos;accent de la
        charte — il entoure, il ne porte jamais de texte. Le survol du bouton prend primary-hover.</span>
      </div>
      {/* L'avertissement : le premier consommateur du ton warning */}
      <div style={{
        gridColumn: "1 / -1", background: "var(--warning-subtle)", color: "var(--warning)",
        border: "1px solid var(--warning)", borderInlineStart: "4px solid var(--warning)",
        borderRadius: "var(--radius)", padding: "var(--space-block-unit) var(--space-inline-unit)", fontSize: "0.875rem",
      }}>
        <b>⚠ Attention</b> — le budget « Maison » approche de sa limite : 5 145 € sur 5 500 €.
      </div>
    </div>
  );
}

/* ── 05 · Le même écran dans les deux thèmes, et la contrainte C14 mesurée ── */
function MiniEcran({ cle }: { cle: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [r, setR] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const a = resoudre(ref.current, "--on-primary"), b = resoudre(ref.current, "--primary");
    if (a && b) setR(contraste(a, b));
  }, [cle]);
  return (
    <div ref={ref} style={{
      background: "var(--bg)", color: "var(--text-primary)", border: "1px solid var(--border)",
      borderRadius: "var(--radius-card)", padding: "var(--space-block-card) var(--space-inline-2xl)",
      display: "grid", gap: "var(--space-block-unit)", justifyItems: "start", textAlign: "left", minWidth: 0,
    }}>
      <b>Le même écran</b>
      <span style={{ color: "var(--text-secondary)", fontSize: "0.8125rem" }}>Chaque rôle a résolu la valeur de son thème — aucun composant n&apos;a changé.</span>
      <span style={{
        background: "var(--primary)", color: "var(--on-primary)", borderRadius: "var(--radius)",
        padding: "var(--space-block-md) var(--space-inline-xl)", fontWeight: 600, fontSize: "0.875rem",
      }}>Enregistrer</span>
      <span className={`badge ${r > 0 && r < 4.5 ? "ko" : ""}`}>
        texte de l&apos;action : {fmt(r)}{r > 0 && r < 4.5 ? " — illisible, C14 mord" : ""}
      </span>
    </div>
  );
}

const GRIS_TEINTES: [string, string][] = [["gris pur", "#6B7280"], ["gris chaud", "#766F68"], ["gris bleuté", "#67737F"]];
function TeinteConstante() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-inline-unit)", width: "100%" }}>
      {GRIS_TEINTES.map(([nom, hex]) => (
        <div key={hex} style={{ display: "grid", gap: "var(--space-block-xs)", justifyItems: "start" }}>
          <span style={{ width: "calc(5 * var(--space-block-unit))", height: "calc(2.6 * var(--space-block-unit))", borderRadius: "var(--radius)", background: hex }} />
          <span className="mono" style={{ fontSize: "0.625rem" }}>{nom} {hex}</span>
          <span className="badge">{fmt(contraste(hexVers(hex), hexVers("#FFFFFF")))} sur blanc</span>
        </div>
      ))}
    </div>
  );
}

const SNIPPETS: Record<string, Record<string, string>> = {
  React: {
    Tailwind: `// tailwind.config : theme.extend.colors <- color (tokens.tailwind.mjs)
// chaque classe résout var(--danger-…) — le thème se résout au rendu,
// jamais dans une classe (C12)
export function AlerteErreur({ enfants }) {
  return (
    <div role="alert" className="bg-danger-subtle text-danger rounded">
      <b>⚠ Erreur</b> — {enfants}
      {/* l'icône et le mot restent : jamais la couleur seule (C6) */}
    </div>
  );
}`,
    shadcn: `// shadcn/ui vit sur des variables : on câble les siennes sur les
// jetons du kit — une adaptation, jamais une seconde palette (C1)
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export function AlerteErreur({ enfants }) {
  return (
    <Alert variant="destructive">
      <AlertTitle>⚠ Erreur</AlertTitle>
      <AlertDescription>{enfants}</AlertDescription>
    </Alert>
  );
}

/* globals.css — le câblage :
   --destructive: var(--danger); --background: var(--bg); … */`,
    "HTML natif": `/* Le normatif : la règle et le jeton. Ce code n'est qu'un exemple. */
export function AlerteErreur({ enfants }) {
  return (
    <div role="alert" className="alerte alerte-erreur">
      <b>⚠ Erreur</b> — {enfants}
    </div>
  );
}

/* styles.css — les rôles, jamais les valeurs (C1) */
.alerte-erreur {
  background: var(--danger-subtle);
  color: var(--danger);          /* paire déclarée, mesurée (C7) */
  border: 1px solid var(--danger);
}
/* le thème sombre ne se code pas ici : chaque jeton résout sa
   valeur par thème dans tokens.css (C12, C13) */`,
  },
  Angular: {
    Tailwind: `@Component({
  selector: "kit-alerte-erreur",
  template: \`
    <div role="alert" class="bg-danger-subtle text-danger rounded">
      <b>⚠ Erreur</b> — <ng-content />
    </div>\`,
})
export class AlerteErreur {}`,
    shadcn: `// côté Angular, l'esprit shadcn vit dans spartan/ui — mêmes variables
@Component({
  selector: "kit-alerte-erreur",
  template: \`
    <div hlmAlert variant="destructive">
      <h4 hlmAlertTitle>⚠ Erreur</h4>
      <p hlmAlertDesc><ng-content /></p>
    </div>\`,
})
export class AlerteErreur {}`,
    "HTML natif": `@Component({
  selector: "kit-alerte-erreur",
  template: \`
    <div role="alert" class="alerte alerte-erreur">
      <b>⚠ Erreur</b> — <ng-content />
    </div>\`,
  styleUrl: "./alerte.css", // mêmes classes : var(--danger), var(--danger-subtle)
})
export class AlerteErreur {}`,
  },
  HTML: {
    Tailwind: `<div role="alert" class="bg-danger-subtle text-danger rounded">
  <b>⚠ Erreur</b> — les classes résolvent les jetons ; le thème
  se résout au rendu.
</div>`,
    shadcn: `<!-- shadcn est une bibliothèque React : en HTML pur il n'en reste
     que l'essentiel — ses classes, câblées sur nos jetons -->
<div role="alert" class="bg-danger-subtle text-danger border rounded">
  <b>⚠ Erreur</b> — le canal redondant reste (C6).
</div>`,
    "HTML natif": `<link rel="stylesheet" href="kit/tokens.css" /><!-- les deux thèmes vivent ici -->

<div role="alert" class="alerte alerte-erreur">
  <b>⚠ Erreur</b> — le rôle, jamais la valeur.
</div>`,
  },
};

export default function Vue() {
  const [demoTheme, setDemoTheme] = useState<"light" | "dark">("light");
  const [dur, setDur] = useState(false);
  const [couleurSeule, setCouleurSeule] = useState(false);
  const [gris, setGris] = useState(false);
  const [marque, setMarque] = useState(false);
  const [grisPale, setGrisPale] = useState(false);
  const [filtre, setFiltre] = useState(false);
  const [actionSombre, setActionSombre] = useState(false);
  const [fw, setFw] = useState<"React" | "Angular" | "HTML">("HTML");
  const { styl } = useAdaptation();
  const { theme } = useTheme();
  const sysSombre = useSchemeSysteme();
  const themeEffectif = theme === "system" ? (sysSombre ? "dark" : "light") : theme;
  const paleEffectif: React.CSSProperties = { ["--text-secondary" as any]: themeEffectif === "dark" ? "#6B7280" : "#9CA3AF" };
  const actionSombreStyle: React.CSSProperties = { ["--primary" as any]: "#312E81" };

  return (
    <div className="coquille">
      <Navigation actif="couleur" />

      <main className="contenu">
        <div className="tete-page">
          <p className="kicker">Fondation · La couleur</p>
          <h1>Une seule couleur de marque, tenue en réserve</h1>
          <p className="chapo">
            Tout le reste est encre, papier et les gris entre les deux — et les états
            sémantiques ne s&apos;y servent jamais. C&apos;est la ligne de la charte, tenue
            par <b>seize règles</b> : chaque duo texte/fond se mesure sous vos yeux, dans
            les deux thèmes. Le réglage <b>Thème</b>, à droite, agit sur tout le site.
          </p>
        </div>

        <section className="bloc-section">
          <p className="kicker">01 · La palette</p>
          <h2>Six rôles composent la page — la marque n&apos;en prend que 5 %</h2>
          <p className="sourd">La mosaïque montre les rôles ; la vue Proportions montre leur
          juste part dans un écran. Chaque tuile lit sa valeur sur la page rendue : passez
          l&apos;aperçu en sombre, tout suit. La casse montre l&apos;autre chemin — une
          carte peinte par valeurs codées en dur, invisible en clair… et qui reste claire
          quand le thème bascule.</p>
          <Apercu outils={
            <>
              {([["light", "clair"], ["dark", "sombre"]] as const).map(([t, nom]) => (
                <button key={t} className={`bouton ${demoTheme === t ? "on" : ""}`} onClick={() => setDemoTheme(t)}>
                  aperçu {nom}
                </button>
              ))}
              <button className={`bouton casse ${dur ? "on" : ""}`} onClick={() => setDur(!dur)}>
                {dur ? "Réparer" : "Casser : des valeurs en dur"}
              </button>
            </>
          } enfants={() => (
            <div data-theme={demoTheme} style={{
              width: "100%", background: "var(--bg)", color: "var(--text-primary)",
              borderRadius: "var(--radius)", padding: "var(--space-block-card) var(--space-inline-2xl)",
              display: "grid", gap: "var(--space-block-card)", textAlign: "left",
            }}>
              <Palette cle={demoTheme} />
              <div style={{ display: "grid", gap: "var(--space-block-sm)", justifyItems: "start" }}>
                <div style={dur
                  ? { background: "#E0E7FF", color: "#3730A3", border: "1px solid #4F46E5", borderRadius: "var(--radius)", padding: "var(--space-block-unit) var(--space-inline-unit)", fontSize: "0.875rem" }
                  : { background: "var(--primary-subtle)", color: "var(--on-primary-subtle)", border: "1px solid var(--primary)", borderRadius: "var(--radius)", padding: "var(--space-block-unit) var(--space-inline-unit)", fontSize: "0.875rem" }}>
                  {dur ? "Cette carte est peinte par valeur : #E0E7FF, #3730A3." : "Cette carte est peinte par rôle : primary-subtle, on-primary-subtle."}
                </div>
                {dur && (
                  <span className={`badge ${demoTheme === "dark" ? "ko" : ""}`}>
                    {demoTheme === "dark"
                      ? "restée claire — la valeur en dur ignore le thème (C1, C12)"
                      : "identique à l'œil — en clair, rien ne signale la faute : basculez l'aperçu en sombre"}
                  </span>
                )}
              </div>
            </div>
          )} pied={
            <details className="prov"><summary>Règles &amp; sources</summary><div>
              <Regles ids={["p01", "c1", "c2", "c4"]} />
            </div></details>
          } />
        </section>

        <section className="bloc-section">
          <p className="kicker">02 · Les tons et leurs contrastes</p>
          <h2>Chaque ton porte son contraste sur lui-même</h2>
          <p className="sourd">Chaque pastille est un vrai couple texte/fond de la famille,
          et le chiffre qu&apos;elle affiche est mesuré sur elle, dans le thème courant.
          Basculez le thème à droite : les valeurs changent, les seuils tiennent. La casse
          remet le gris pâle d&apos;avant l&apos;arbitrage — regardez la pastille « Texte
          second » passer au rouge et ce paragraphe pâlir.</p>
          <Apercu outils={
            <button className={`bouton casse ${grisPale ? "on" : ""}`} onClick={() => setGrisPale(!grisPale)}>
              {grisPale ? "Réparer : remonter le gris" : "Casser : le gris d'avant l'arbitrage"}
            </button>
          } enfants={() => (
            <div style={{ width: "100%", display: "grid", gap: "var(--space-block-unit)", textAlign: "left", ...(grisPale ? paleEffectif : {}) }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 11rem), 1fr))", gap: "var(--space-inline-sm)", width: "100%" }}>
                <Ton nom="Primary" texte="--on-primary-subtle" fond="--primary-subtle" cle={`${themeEffectif}-${grisPale}`} />
                <Ton nom="Danger" texte="--danger" fond="--danger-subtle" cle={`${themeEffectif}-${grisPale}`} />
                <Ton nom="Success" texte="--success" fond="--success-subtle" cle={`${themeEffectif}-${grisPale}`} />
                <Ton nom="Warning" texte="--warning" fond="--warning-subtle" cle={`${themeEffectif}-${grisPale}`} />
                <Ton nom="Info" texte="--info" fond="--info-subtle" cle={`${themeEffectif}-${grisPale}`} />
                <Ton nom="Encre" texte="--text-primary" fond="--bg" cle={`${themeEffectif}-${grisPale}`} />
                <Ton nom="Texte second" texte="--text-secondary" fond="--surface" cle={`${themeEffectif}-${grisPale}`} />
              </div>
              <p className="sourd" style={{ fontSize: "0.8125rem", maxWidth: "var(--measure)" }}>
                Le gris le plus clair de la charte (#9CA3AF) ne porte jamais un texte
                qu&apos;il faut lire — 2,54:1 sur blanc. Ici il n&apos;a même pas de jeton :
                la hiérarchie se joue au corps et à la graisse, pas au voile. Et le cyan
                n&apos;est pas dans cette rangée : ce n&apos;est pas un ton, c&apos;est
                l&apos;anneau de focus — son métier est d&apos;entourer, pas
                d&apos;accueillir.
              </p>
              <details className="prov"><summary>La table complète, mesurée dans les deux thèmes</summary><div>
                <TableauPaires grisPale={grisPale} />
              </div></details>
            </div>
          )} pied={
            <details className="prov"><summary>Règles &amp; sources</summary><div>
              <Regles ids={["c5", "c7", "c8", "c9"]} />
            </div></details>
          } />
        </section>

        <section className="bloc-section">
          <p className="kicker">03 · Jamais la couleur seule — et chacun chez soi</p>
          <h2>Un état arrive équipé, et la marque reste à sa place</h2>
          <p className="sourd">Chaque état parle avec trois voix : la couleur, l&apos;icône,
          le mot. Cassez le canal puis regardez sans la couleur — les deux messages
          deviennent le même message. L&apos;autre casse donne la couleur de marque aux
          états : « c&apos;est nous » et « il se passe quelque chose » ne font plus
          qu&apos;une seule voix.</p>
          <Apercu outils={
            <>
              <button className={`bouton casse ${couleurSeule ? "on" : ""}`} onClick={() => setCouleurSeule(!couleurSeule)}>
                {couleurSeule ? "Rendre l'icône et le mot" : "Casser : la couleur seule"}
              </button>
              <button className={`bouton ${gris ? "on" : ""}`} onClick={() => setGris(!gris)}>
                {gris ? "Revoir les couleurs" : "Voir sans la couleur"}
              </button>
              <button className={`bouton casse ${marque ? "on" : ""}`} onClick={() => setMarque(!marque)}>
                {marque ? "Réparer : chacun son registre" : "Casser : la marque pour l'état"}
              </button>
            </>
          } enfants={() => (
            <div style={{ width: "100%", display: "grid", gap: "var(--space-block-unit)", justifyItems: "start", filter: gris ? "grayscale(1)" : undefined }}>
              <Alerte ton="danger" couleurSeule={couleurSeule} marque={marque} />
              <Alerte ton="success" couleurSeule={couleurSeule} marque={marque} />
              {couleurSeule && gris && (
                <span className="badge ko" style={{ filter: "none" }}>
                  l&apos;erreur et le succès sont devenus indistinguables — c&apos;est la faute que C6 arrête
                </span>
              )}
              {marque && (
                <span className="badge ko">
                  l&apos;erreur porte la couleur de la marque — le vocabulaire chromatique est détruit (C3)
                </span>
              )}
            </div>
          )} pied={
            <details className="prov"><summary>Règles &amp; sources</summary><div>
              <Regles ids={["c3", "c6"]} />
            </div></details>
          } />
        </section>

        <section className="bloc-section">
          <p className="kicker">04 · En situation</p>
          <h2>Les mêmes valeurs, portées par un écran plausible</h2>
          <p className="sourd">Aucune couleur de cette maquette n&apos;est nouvelle : si une
          carte avait besoin d&apos;autre chose, c&apos;est la famille qui aurait un trou.
          Le delta est success, l&apos;étiquette est info, l&apos;avertissement est warning —
          né ce soir, avec cette carte pour premier consommateur. Le survol du bouton est
          un jeton ; la casse le remplace par un filtre, une couleur fantôme
          qu&apos;aucune table ne peut vérifier. Et le désactivé n&apos;a pas de jetons :
          dette écrite, pas un oubli.</p>
          <Apercu outils={
            <button className={`bouton casse ${filtre ? "on" : ""}`} onClick={() => setFiltre(!filtre)}>
              {filtre ? "Réparer : le survol par jeton" : "Casser : le survol par filtre"}
            </button>
          } enfants={() => <EnSituation filtre={filtre} />} pied={
            <details className="prov"><summary>Règles &amp; sources</summary><div>
              <Regles ids={["c10", "c11"]} />
            </div></details>
          } />
        </section>

        <section className="bloc-section">
          <p className="kicker">05 · Les deux thèmes</p>
          <h2>Deux tables de valeurs, les mêmes rôles, la même exigence</h2>
          <p className="sourd">Le même écran, résolu par les deux thèmes — aucun composant
          ne change, la table de valeurs double (C12), et le sombre se vérifie comme le
          clair (C13). La casse démontre C14 par le calcul : donnez au thème sombre une
          action sombre, et son texte devient illisible — ce n&apos;est pas un goût,
          c&apos;est la luminance. En bas, la méthode bénie du teintage : trois gris de
          même luminance, trois rapports identiques (C15).</p>
          <Apercu outils={
            <button className={`bouton casse ${actionSombre ? "on" : ""}`} onClick={() => setActionSombre(!actionSombre)}>
              {actionSombre ? "Réparer : éclaircir l'action" : "Casser : une action sombre en sombre"}
            </button>
          } enfants={() => (
            <div style={{ width: "100%", display: "grid", gap: "var(--space-block-unit)", textAlign: "left" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 16rem), 1fr))", gap: "var(--space-inline-unit)" }}>
                <div data-theme="light" style={{ display: "grid", gap: "var(--space-block-sm)" }}>
                  <span className="mono" style={{ color: "var(--text-secondary)" }}>thème clair</span>
                  <MiniEcran cle={`light-${actionSombre}`} />
                </div>
                <div data-theme="dark" style={{ display: "grid", gap: "var(--space-block-sm)", ...(actionSombre ? actionSombreStyle : {}) }}>
                  <span className="mono" style={{ color: "var(--text-secondary)" }}>thème sombre{actionSombre ? " — action forcée sombre" : ""}</span>
                  <MiniEcran cle={`dark-${actionSombre}`} />
                </div>
              </div>
              <div style={{ display: "grid", gap: "var(--space-block-sm)", justifyItems: "start" }}>
                <span className="mono sourd">Teinter un neutre, à luminance constante — l&apos;opération gratuite (C15)</span>
                <TeinteConstante />
                <span className="sourd" style={{ fontSize: "0.75rem" }}>Valeurs d&apos;étude
                pour la démonstration, pas des jetons : la teinte bouge, la luminance non —
                aucun rapport ne change. Enfin, quand le système force ses couleurs
                (contraste élevé), cette palette s&apos;efface sans résistance : rien ici ne
                la neutralise (C16).</span>
              </div>
            </div>
          )} pied={
            <details className="prov"><summary>Règles &amp; sources</summary><div>
              <Regles ids={["c12", "c13", "c14", "c15", "c16"]} />
            </div></details>
          } />
        </section>

        <section className="bloc-section">
          <p className="kicker">06 · L&apos;adaptation</p>
          <h2>Le même système, dans votre stack</h2>
          <p className="sourd">Le normatif vit dans la règle et le jeton ; React, Angular
          ou HTML n&apos;en sont que des consommateurs. Une alerte d&apos;erreur, trois
          traductions — et dans chacune, le thème se résout au rendu, jamais dans le
          code.</p>
          <PanneauCode langage={styl} outils={
            <>{(["HTML", "React", "Angular"] as const).map((f) => (
              <button key={f} className={`bouton ${fw === f ? "on" : ""}`} onClick={() => setFw(f)}>{f}</button>
            ))}</>
          } code={SNIPPETS[fw][styl]} />
          <details className="prov"><summary>Règles &amp; sources</summary><div>
            <p>Le normatif, c&apos;est <b>la règle et le jeton</b> — pas le code. Un seul
            jeu de jetons produit des variables CSS natives et une sortie Tailwind jumelle
            (<span className="mono">color</span> dans
            <span className="mono"> tokens.tailwind.mjs</span>) ; les deux thèmes vivent
            dans le jeton, chaque consommateur en hérite sans rien coder.</p>
          </div></details>
        </section>
      </main>

      <aside className="reglages">
        <h3>Theming &amp; playground</h3>
        <Theme />
        <Densite />
        <Adaptation />
        <div className="bloc">
          <span className="mono sourd">La famille</span>
          <p className="sourd" style={{ fontSize: "0.75rem" }}>Les valeurs viennent de la
          charte de conception Fili (les valeurs sombres, du registre du dépôt — dit en
          C13). Le theming est global : jamais page par page.</p>
        </div>
      </aside>
    </div>
  );
}
