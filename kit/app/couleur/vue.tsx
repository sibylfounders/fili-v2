"use client";
import { useEffect, useRef, useState } from "react";
import { Navigation } from "../nav";
import { Apercu, PanneauCode } from "../apercu";
import { Densite } from "../densite";
import { Adaptation, useAdaptation } from "../adaptation";
import { Theme, useTheme, useSchemeSysteme } from "../theme";

/* La page vivante de la famille couleur (COLOR-UX.md 2.0.0, C1–C16).
   Particularité assumée : cette page est LA SEULE du site rendue dans la
   vraie famille (--c-*), via le pont déclaré dans globals.css — le reste
   du site garde la palette provisoire jusqu'à l'accord d'Auteur. Tous les
   rapports de contraste affichés ici sont MESURÉS sur la page rendue
   (l'esprit de M1) : jamais recopiés depuis une table. */

/* ── Le contraste, calculé comme la norme le définit (S8) ── */
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

/* ── La table des paires déclarées (C7) — tout emploi hors d'elle est une faute ── */
const PAIRES: [string, string, string, number][] = [
  ["--c-encre", "--c-papier", "l'encre sur le papier", 4.5],
  ["--c-encre", "--c-fond", "l'encre sur le fond", 4.5],
  ["--c-sourd", "--c-papier", "le texte second sur le papier", 4.5],
  ["--c-sourd", "--c-fond", "le texte second sur le fond", 4.5],
  ["--c-accent", "--c-papier", "le lien sur le papier", 4.5],
  ["--c-accent-survol", "--c-papier", "le lien survolé — C8", 4.5],
  ["--c-sur-accent", "--c-accent", "le texte de l'action pleine", 4.5],
  ["--c-accent", "--c-accent-doux", "le badge sur son fond doux", 4.5],
  ["--c-sur-accent-doux", "--c-accent-doux", "le texte sur fond doux", 4.5],
  ["--c-erreur", "--c-erreur-doux", "l'erreur sur son fond doux", 4.5],
  ["--c-sur-erreur", "--c-erreur", "le texte sur l'erreur pleine", 4.5],
  ["--c-succes", "--c-succes-doux", "le succès sur son fond doux", 4.5],
  ["--c-sur-succes", "--c-succes", "le texte sur le succès plein", 4.5],
  ["--c-trait-net", "--c-papier", "la bordure délimitante (seuil 3:1)", 3],
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
    pourquoi: "Un utilisateur apprend le vocabulaire chromatique du produit en quelques écrans. Un bleu qui dit tantôt « action », tantôt « information », ne dit plus rien — le cas historique du fonds : l'information a reçu son propre bleu.",
    src: [{ t: "Atlassian — « don't use an accent when the color has semantic meaning »", h: "https://atlassian.design/foundations/color" }] },
  { id: "c4", nom: "C4", titre: "La marque tient en peu de rôles, tous consommés",
    enonce: "Le registre marque se limite aux rôles fonctionnels existants ; une teinte purement décorative ne reçoit pas de jeton — un jeton naît d'un besoin réel, et un rôle sans consommateur ne reste pas.",
    div: "Le kit n'a qu'un rôle de marque : l'accent, avec son couple. La « seconde voix » du registre historique n'a pas de consommateur ici — elle n'entre pas tant qu'elle n'en a pas. Précédent du fonds : un rôle est sorti le jour où sa mission lui a été reprise.",
    src: [{ t: "Règle interne du système (précédent journalisé)", h: "#" }] },
  { id: "c5", nom: "C5", titre: "Le couple complet dès la naissance",
    enonce: "Toute nouvelle valeur sémantique fournit son couple texte/fond subtil d'emblée ; les neutres vivent en échelle.",
    pourquoi: "Un ton d'alerte sans son fond doux finit posé sur n'importe quoi — et le contraste n'est plus garanti par personne.",
    src: [{ t: "Règle interne du système (héritée du bouton)", h: "#" }] },
  { id: "c6", nom: "C6", titre: "Le canal redondant se déclare",
    enonce: "Chaque usage sémantique de la couleur déclare un canal non chromatique — icône, mot ou forme — qui ne se retire jamais pour alléger. C'est la moitié vérifiable du principe cardinal : jamais la couleur seule.",
    pourquoi: "Environ 8 % des hommes ont une déficience rouge-vert. Le contraste rend le texte lisible ; il ne distingue pas un rouge d'un vert pour qui ne voit pas la différence. Deux exigences indépendantes.",
    src: [{ t: "WCAG 1.4.1 — Use of Color", h: "https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html" }] },
  { id: "c7", nom: "C7", titre: "Le contraste se vérifie par paire",
    enonce: "Un jeton de texte n'est jamais conforme dans l'absolu — il l'est sur un fond donné. Chaque jeton de texte déclare ses fonds d'usage ; tout fond non déclaré est interdit.",
    pourquoi: "Le cas vécu du fonds : un vert conforme sur blanc, qu'il a fallu recalibrer pour tenir sur son propre fond doux. La paire, pas le jeton.",
    src: [{ t: "WCAG 1.4.3 — Contrast (Minimum)", h: "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html" }, { t: "WCAG — définition du rapport de contraste", h: "https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio" }] },
  { id: "c8", nom: "C8", titre: "Le survol testé au même seuil",
    enonce: "La norme exempte le survol ; ce système le teste quand même — un survol illisible reste un survol raté.",
    div: "Sur-exigence assumée, dite comme telle : WCAG 1.4.11 exempte explicitement l'état de survol. La paire du survol figure dans la table ci-dessus, au même seuil que le repos.",
    src: [{ t: "WCAG 1.4.11 — Non-text Contrast (l'exemption)", h: "https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html" }] },
  { id: "c9", nom: "C9", titre: "Aucun jeton de texte sous le seuil",
    enonce: "Aucun jeton de texte du registre ne descend sous le seuil de lisibilité sur ses fonds déclarés, dans les deux thèmes.",
    div: "Arbitrage d'Auteur du 13 août 2026, renversement dit : la norme ne connaît que trois exceptions (grand texte, logotype, texte décoratif ou inactif) — « métadonnées accessoires » n'en est pas une. Le gris pâle de l'ancien registre est remonté ; la hiérarchie des métadonnées se joue par le corps et la graisse, plus par la pâleur.",
    src: [{ t: "WCAG 1.4.3 — les trois exceptions", h: "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html" }] },
  { id: "c10", nom: "C10", titre: "Les états sont des jetons, pas des calculs",
    enonce: "Les états interactifs sont portés par des jetons dédiés, jamais calculés à la volée dans une feuille de style — ni filtre, ni assombrissement calculé.",
    pourquoi: "Une couleur produite par un filtre n'existe dans aucun registre : aucune table de paires ne peut la vérifier, aucun instrument ne peut la voir. Elle est illisible pour le système entier.",
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
    div: "Le fonds consigne l'histoire : cette règle a menti une fois — la doctrine disait « non couvert » pendant que la distribution livrait le sombre. C'est la doctrine qui a bougé. Ici, la table des paires mesure les deux thèmes côte à côte, en permanence.",
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
    <div style={{ display: "grid", gap: "var(--rr-block-xl)" }}>
      {ids.map((id) => REGLES.find((r) => r.id === id)!).map((r) => (
        <div key={r.id} style={{ display: "grid", gap: "var(--rr-block-sm)", maxWidth: "var(--t-mesure)" }}>
          <b style={{ color: "var(--p-encre)" }}><span className="badge">{r.nom}</span> {r.titre}</b>
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

/* ── 01 · Le nuancier : les rôles, groupés par registre, valeurs lues au rendu ── */
const REGISTRES: [string, [string, string][]][] = [
  ["Marque", [["accent", "--c-accent"], ["accent-survol", "--c-accent-survol"], ["sur-accent", "--c-sur-accent"], ["accent-doux", "--c-accent-doux"], ["sur-accent-doux", "--c-sur-accent-doux"]]],
  ["Sémantique", [["erreur", "--c-erreur"], ["erreur-doux", "--c-erreur-doux"], ["sur-erreur", "--c-sur-erreur"], ["succès", "--c-succes"], ["succès-doux", "--c-succes-doux"], ["sur-succès", "--c-sur-succes"]]],
  ["Neutres", [["fond", "--c-fond"], ["papier", "--c-papier"], ["encre", "--c-encre"], ["sourd", "--c-sourd"], ["trait", "--c-trait"], ["trait-net", "--c-trait-net"]]],
];

function Nuancier({ cle }: { cle: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [valeurs, setValeurs] = useState<Record<string, string>>({});
  useEffect(() => {
    if (!ref.current) return;
    const v: Record<string, string> = {};
    REGISTRES.forEach(([, jetons]) => jetons.forEach(([, cssVar]) => {
      const c = resoudre(ref.current!, cssVar);
      if (c) v[cssVar] = versHex(c);
    }));
    setValeurs(v);
  }, [cle]);
  return (
    <div ref={ref} style={{ display: "grid", gap: "var(--rr-block-unit)", width: "100%" }}>
      {REGISTRES.map(([registre, jetons]) => (
        <div key={registre} style={{ display: "grid", gap: "var(--rr-block-md)" }}>
          <span className="mono" style={{ color: "var(--c-sourd)" }}>{registre}</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--rr-inline-unit)" }}>
            {jetons.map(([nom, cssVar]) => (
              <div key={cssVar} style={{ display: "grid", gap: "var(--rr-block-xs)", justifyItems: "start" }}>
                <span style={{ width: "calc(4 * var(--rr-block-unit))", height: "calc(2.6 * var(--rr-block-unit))", borderRadius: "var(--rr-radius)", background: `var(${cssVar})`, border: "1px solid var(--c-trait)" }} />
                <span className="mono" style={{ fontSize: "0.625rem" }}>{nom}</span>
                <span className="mono" style={{ fontSize: "0.625rem", color: "var(--c-sourd)", fontWeight: 400 }}>{valeurs[cssVar] ?? "…"}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── 02 · Les alertes : le couple, et le canal qui n'est pas une couleur ── */
function Alerte({ ton, couleurSeule }: { ton: "erreur" | "succes"; couleurSeule: boolean }) {
  const t = ton === "erreur"
    ? { doux: "var(--c-erreur-doux)", plein: "var(--c-erreur)", icone: "⚠", mot: "Erreur", msg: "le dossier n'a pas pu être enregistré." }
    : { doux: "var(--c-succes-doux)", plein: "var(--c-succes)", icone: "✓", mot: "Succès", msg: "le dossier est enregistré." };
  return (
    <div style={{
      background: t.doux, color: couleurSeule ? "var(--c-encre)" : t.plein,
      border: `1px solid ${t.plein}`, borderInlineStart: `4px solid ${t.plein}`,
      borderRadius: "var(--rr-radius)", padding: "var(--rr-block-unit) var(--rr-inline-unit)",
      fontSize: "0.875rem", maxWidth: "28rem", width: "100%", textAlign: "left",
    }}>
      {couleurSeule
        ? <>Le dossier {ton === "erreur" ? "n&apos;a pas pu être enregistré" : "est enregistré"}.</>
        : <><b>{t.icone} {t.mot}</b> — {t.msg}</>}
    </div>
  );
}

/* ── 03 · La table des paires, mesurée dans les DEUX thèmes à la fois ── */
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
  const paleClair: React.CSSProperties = { ["--c-sourd" as any]: "#9CA3AF" };
  const paleSombre: React.CSSProperties = { ["--c-sourd" as any]: "#6B7280" };
  const Cellule = ({ r, seuil }: { r: number; seuil: number }) => (
    <td><span className={`badge ${r > 0 && r < seuil ? "ko" : ""}`}>{fmt(r)}</span></td>
  );
  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      {/* deux sondes hors écran, une par thème — la table lit les deux d'un coup */}
      <div ref={clairRef} data-theme="clair" style={grisPale ? paleClair : undefined} hidden />
      <div ref={sombreRef} data-theme="sombre" style={grisPale ? paleSombre : undefined} hidden />
      <table className="tableau" style={{ width: "100%" }}>
        <thead><tr><th>Paire déclarée</th><th>Seuil</th><th>Thème clair</th><th>Thème sombre</th></tr></thead>
        <tbody>
          {PAIRES.map(([texte, fond, libelle, seuil], i) => (
            <tr key={libelle}>
              <td style={{ whiteSpace: "normal" }}>{libelle}<br />
                <span className="mono" style={{ color: "var(--c-sourd)", fontWeight: 400, fontSize: "0.625rem" }}>{texte} / {fond}</span></td>
              <td className="mono" style={{ color: "var(--c-sourd)" }}>{seuil === 3 ? "3:1" : "4,5:1"}</td>
              <Cellule r={lignes[i]?.clair ?? 0} seuil={seuil} />
              <Cellule r={lignes[i]?.sombre ?? 0} seuil={seuil} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── 05 · Le même écran dans les deux thèmes, et la contrainte C14 mesurée ── */
function MiniEcran({ cle }: { cle: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [r, setR] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const a = resoudre(ref.current, "--c-sur-accent"), b = resoudre(ref.current, "--c-accent");
    if (a && b) setR(contraste(a, b));
  }, [cle]);
  return (
    <div ref={ref} style={{
      background: "var(--c-fond)", color: "var(--c-encre)", border: "1px solid var(--c-trait)",
      borderRadius: "var(--rr-radius-card)", padding: "var(--rr-block-card) var(--rr-inline-2xl)",
      display: "grid", gap: "var(--rr-block-unit)", justifyItems: "start", textAlign: "left", minWidth: 0,
    }}>
      <b>Le même écran</b>
      <span style={{ color: "var(--c-sourd)", fontSize: "0.8125rem" }}>Chaque rôle a résolu la valeur de son thème — aucun composant n&apos;a changé.</span>
      <span style={{
        background: "var(--c-accent)", color: "var(--c-sur-accent)", borderRadius: "var(--rr-radius)",
        padding: "var(--rr-block-md) var(--rr-inline-xl)", fontWeight: 600, fontSize: "0.875rem",
      }}>Enregistrer</span>
      <span className={`badge ${r > 0 && r < 4.5 ? "ko" : ""}`}>
        texte de l&apos;action : {fmt(r)}{r > 0 && r < 4.5 ? " — illisible, C14 mord" : ""}
      </span>
    </div>
  );
}

/* ── 05 · C15 : trois gris de même luminance, rapports mesurés ── */
const GRIS_TEINTES: [string, string][] = [["gris pur", "#6B7280"], ["gris chaud", "#766F68"], ["gris bleuté", "#67737F"]];
function TeinteConstante() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--rr-inline-unit)", width: "100%" }}>
      {GRIS_TEINTES.map(([nom, hex]) => (
        <div key={hex} style={{ display: "grid", gap: "var(--rr-block-xs)", justifyItems: "start" }}>
          <span style={{ width: "calc(5 * var(--rr-block-unit))", height: "calc(2.6 * var(--rr-block-unit))", borderRadius: "var(--rr-radius)", background: hex }} />
          <span className="mono" style={{ fontSize: "0.625rem" }}>{nom} {hex}</span>
          <span className="badge">{fmt(contraste(hexVers(hex), hexVers("#FFFFFF")))} sur blanc</span>
        </div>
      ))}
    </div>
  );
}

const SNIPPETS: Record<string, Record<string, string>> = {
  React: {
    Tailwind: `// tailwind.config : theme.extend.colors <- couleur (tokens.tailwind.mjs)
// chaque classe résout var(--c-…) — le thème se résout au rendu, jamais
// dans une classe (C12)
export function AlerteErreur({ enfants }) {
  return (
    <div role="alert" className="bg-erreur-doux text-erreur rounded-rr">
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
   --destructive: var(--c-erreur); --background: var(--c-fond); … */`,
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
  background: var(--c-erreur-doux);
  color: var(--c-erreur);          /* paire déclarée, mesurée (C7) */
  border: 1px solid var(--c-erreur);
}
/* le thème sombre ne se code pas ici : chaque jeton résout sa
   valeur par thème dans tokens.css (C12, C13) */`,
  },
  Angular: {
    Tailwind: `@Component({
  selector: "kit-alerte-erreur",
  template: \`
    <div role="alert" class="bg-erreur-doux text-erreur rounded-rr">
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
  styleUrl: "./alerte.css", // mêmes classes : var(--c-erreur), var(--c-erreur-doux)
})
export class AlerteErreur {}`,
  },
  HTML: {
    Tailwind: `<div role="alert" class="bg-erreur-doux text-erreur rounded-rr">
  <b>⚠ Erreur</b> — les classes résolvent les jetons ; le thème
  se résout au rendu.
</div>`,
    shadcn: `<!-- shadcn est une bibliothèque React : en HTML pur il n'en reste
     que l'essentiel — ses classes, câblées sur nos jetons -->
<div role="alert" class="bg-erreur-doux text-erreur border rounded-rr">
  <b>⚠ Erreur</b> — le canal redondant reste (C6).
</div>`,
    "HTML natif": `<link rel="stylesheet" href="kit/tokens.css" /><!-- les deux thèmes vivent ici -->

<div role="alert" class="alerte alerte-erreur">
  <b>⚠ Erreur</b> — le rôle, jamais la valeur.
</div>`,
  },
};

export default function Vue() {
  const [demoTheme, setDemoTheme] = useState<"clair" | "sombre">("clair");
  const [dur, setDur] = useState(false);
  const [couleurSeule, setCouleurSeule] = useState(false);
  const [gris, setGris] = useState(false);
  const [grisPale, setGrisPale] = useState(false);
  const [filtre, setFiltre] = useState(false);
  const [actionSombre, setActionSombre] = useState(false);
  const [fw, setFw] = useState<"React" | "Angular" | "HTML">("HTML");
  const { styl } = useAdaptation();
  const { theme } = useTheme();
  const sysSombre = useSchemeSysteme();
  const themeEffectif = theme === "systeme" ? (sysSombre ? "sombre" : "clair") : theme;
  const paleEffectif: React.CSSProperties = { ["--c-sourd" as any]: themeEffectif === "sombre" ? "#6B7280" : "#9CA3AF" };
  const actionSombreStyle: React.CSSProperties = { ["--c-accent" as any]: "#312E81" };

  return (
    <div className="coquille pont-couleur">
      <Navigation actif="couleur" />

      <main className="contenu">
        <div className="tete-page">
          <p className="kicker">Fondation · La couleur</p>
          <h1>Chaque couleur de cette page connaît son rôle</h1>
          <p className="chapo">
            La couleur de ce système tient en <b>seize règles</b> — trois registres
            étanches, des paires de contraste qui se mesurent sous vos yeux, deux thèmes
            vérifiés au même seuil. Vous la lisez déjà : cette page est rendue dans la
            vraie famille du kit, et le réglage <b>Thème</b>, à droite, est branché
            dessus — clair, sombre, ou la préférence de votre système.
          </p>
        </div>

        <section className="bloc-section">
          <p className="kicker">01 · Les registres</p>
          <h2>Trois registres, aucun jeton à cheval</h2>
          <p className="sourd">La marque porte l&apos;identité, la sémantique porte un état,
          les neutres structurent la page — et une couleur ne change jamais de camp. Les
          valeurs affichées sont lues sur la page rendue : passez l&apos;aperçu en sombre,
          elles suivent. La casse montre l&apos;autre chemin : une carte aux valeurs codées
          en dur est invisible en clair… et reste claire quand le thème bascule.</p>
          <Apercu outils={
            <>
              {(["clair", "sombre"] as const).map((t) => (
                <button key={t} className={`bouton ${demoTheme === t ? "on" : ""}`} onClick={() => setDemoTheme(t)}>
                  aperçu {t}
                </button>
              ))}
              <button className={`bouton casse ${dur ? "on" : ""}`} onClick={() => setDur(!dur)}>
                {dur ? "Réparer" : "Casser : des valeurs en dur"}
              </button>
            </>
          } enfants={() => (
            <div data-theme={demoTheme} style={{
              width: "100%", background: "var(--c-fond)", color: "var(--c-encre)",
              borderRadius: "var(--rr-radius)", padding: "var(--rr-block-card) var(--rr-inline-2xl)",
              display: "grid", gap: "var(--rr-block-card)", textAlign: "left",
            }}>
              <Nuancier cle={demoTheme} />
              <div style={{ display: "grid", gap: "var(--rr-block-sm)", justifyItems: "start" }}>
                <div style={dur
                  ? { background: "#EFEDFC", color: "#5D51E8", border: "1px solid #5D51E8", borderRadius: "var(--rr-radius)", padding: "var(--rr-block-unit) var(--rr-inline-unit)", fontSize: "0.875rem" }
                  : { background: "var(--c-accent-doux)", color: "var(--c-sur-accent-doux)", border: "1px solid var(--c-accent)", borderRadius: "var(--rr-radius)", padding: "var(--rr-block-unit) var(--rr-inline-unit)", fontSize: "0.875rem" }}>
                  {dur ? "Cette carte est peinte par valeur : #EFEDFC, #5D51E8." : "Cette carte est peinte par rôle : accent-doux, sur-accent-doux."}
                </div>
                {dur && (
                  <span className={`badge ${demoTheme === "sombre" ? "ko" : ""}`}>
                    {demoTheme === "sombre"
                      ? "restée claire — la valeur en dur ignore le thème (C1, C12)"
                      : "identique à l'œil — en clair, rien ne signale la faute : basculez l'aperçu en sombre"}
                  </span>
                )}
              </div>
            </div>
          )} pied={
            <details className="prov"><summary>Règles &amp; sources</summary><div>
              <Regles ids={["p01", "c1", "c2", "c3", "c4"]} />
            </div></details>
          } />
        </section>

        <section className="bloc-section">
          <p className="kicker">02 · Le couple et le canal</p>
          <h2>Un état arrive équipé — et jamais la couleur seule</h2>
          <p className="sourd">Chaque ton sémantique naît avec son couple complet — le
          texte, le fond doux — et déclare un canal qui n&apos;est pas une couleur :
          l&apos;icône, le mot. Cassez le canal, puis regardez la page comme ceux qui ne
          voient pas la différence rouge-vert : les deux messages deviennent le même
          message.</p>
          <Apercu outils={
            <>
              <button className={`bouton casse ${couleurSeule ? "on" : ""}`} onClick={() => setCouleurSeule(!couleurSeule)}>
                {couleurSeule ? "Rendre l'icône et le mot" : "Casser : la couleur seule"}
              </button>
              <button className={`bouton ${gris ? "on" : ""}`} onClick={() => setGris(!gris)}>
                {gris ? "Revoir les couleurs" : "Voir sans la couleur"}
              </button>
            </>
          } enfants={() => (
            <div style={{ width: "100%", display: "grid", gap: "var(--rr-block-unit)", justifyItems: "start", filter: gris ? "grayscale(1)" : undefined }}>
              <Alerte ton="erreur" couleurSeule={couleurSeule} />
              <Alerte ton="succes" couleurSeule={couleurSeule} />
              {couleurSeule && gris && (
                <span className="badge ko" style={{ filter: "none" }}>
                  l&apos;erreur et le succès sont devenus indistinguables — c&apos;est la faute que C6 arrête
                </span>
              )}
            </div>
          )} pied={
            <details className="prov"><summary>Règles &amp; sources</summary><div>
              <Regles ids={["c5", "c6"]} />
            </div></details>
          } />
        </section>

        <section className="bloc-section">
          <p className="kicker">03 · Les paires</p>
          <h2>Un texte n&apos;est jamais conforme dans l&apos;absolu</h2>
          <p className="sourd">Chaque jeton de texte déclare ses fonds d&apos;usage, et
          chaque paire se mesure — ici même, sur la page rendue, dans les deux thèmes à la
          fois. Aucun jeton de texte ne descend sous le seuil : c&apos;est l&apos;arbitrage
          du gris pâle. La casse le remet tel qu&apos;il était avant l&apos;arbitrage —
          regardez les lignes du texte second passer au rouge, et ce paragraphe pâlir.</p>
          <Apercu outils={
            <button className={`bouton casse ${grisPale ? "on" : ""}`} onClick={() => setGrisPale(!grisPale)}>
              {grisPale ? "Réparer : remonter le gris" : "Casser : le gris d'avant l'arbitrage"}
            </button>
          } enfants={() => (
            <div style={{ width: "100%", display: "grid", gap: "var(--rr-block-unit)", textAlign: "left", ...(grisPale ? paleEffectif : {}) }}>
              <p style={{ color: "var(--c-sourd)", maxWidth: "var(--t-mesure)", fontSize: "0.875rem" }}>
                Ce paragraphe est du texte second — des métadonnées, diraient certains.
                L&apos;ancien registre le laissait descendre à 2,5:1 « parce que c&apos;est
                accessoire » ; la norme ne connaît pas cette exception, et l&apos;arbitrage
                a tranché : le gris remonte, la hiérarchie se joue par le corps et la
                graisse.
              </p>
              <TableauPaires grisPale={grisPale} />
            </div>
          )} pied={
            <details className="prov"><summary>Règles &amp; sources</summary><div>
              <Regles ids={["c7", "c8", "c9"]} />
            </div></details>
          } />
        </section>

        <section className="bloc-section">
          <p className="kicker">04 · Les états</p>
          <h2>Un survol est un jeton, pas un filtre</h2>
          <p className="sourd">Survolez les deux boutons. Le premier prend
          <span className="mono"> accent-survol</span> — un jeton du registre, présent dans
          la table des paires. Le second s&apos;assombrit par un filtre : la couleur
          produite n&apos;existe dans aucun registre, aucune table ne peut la vérifier,
          aucun instrument ne la verra jamais. Quant au désactivé : il n&apos;a pas de
          jetons — et c&apos;est une décision, pas un oubli.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 21rem), 1fr))", gap: "var(--rr-inline-unit)" }}>
            <div className="carte">
              <span className="mono sourd">Le survol par jeton</span>
              <div><button className="bouton demo-plein jeton">Enregistrer</button></div>
              <span className="sourd" style={{ fontSize: "0.8125rem" }}>Au survol :
              <span className="mono"> --c-accent-survol</span> — sa paire est déclarée et
              mesurée au même seuil que le repos (C8).</span>
            </div>
            <div className="carte">
              <div className="rang" style={{ justifyContent: "space-between" }}>
                <span className="mono sourd">Le survol par filtre</span>
                <button className={`bouton casse ${filtre ? "on" : ""}`} onClick={() => setFiltre(!filtre)}>{filtre ? "Réparer" : "Casser"}</button>
              </div>
              <div><button className={`bouton demo-plein ${filtre ? "filtre" : "jeton"}`}>Enregistrer</button></div>
              <span className={filtre ? "oeil" : "sourd"} style={{ fontSize: "0.8125rem" }}>
                {filtre
                  ? "brightness(0.72) au survol — la couleur produite n'est écrite nulle part : illisible pour la table des paires, invisible pour tout instrument (C10)."
                  : "Pour l'instant, ce bouton est sage : cassez-le pour voir le filtre."}
              </span>
            </div>
            <div className="carte">
              <span className="mono sourd">Le désactivé</span>
              <p style={{ fontSize: "0.875rem" }}>Pas de jetons de désactivé dans la
              famille : aucun composant du kit n&apos;a documenté le besoin. Le jour venu,
              le couple complet — fond, texte, bordure — naîtra en une seule fois, et la
              décision passera par le journal (C11). Une dette écrite vaut mieux
              qu&apos;un gris inventé.</p>
            </div>
          </div>
          <details className="prov"><summary>Règles &amp; sources</summary><div>
            <Regles ids={["c10", "c11"]} />
          </div></details>
        </section>

        <section className="bloc-section">
          <p className="kicker">05 · Les deux thèmes</p>
          <h2>Deux tables de valeurs, les mêmes rôles, la même exigence</h2>
          <p className="sourd">Le même écran, résolu par les deux thèmes — aucun composant
          ne change, la table de valeurs double (C12), et le sombre se vérifie comme le
          clair (C13). La casse démontre C14 par le calcul : donnez au thème sombre une
          action sombre, et son texte devient illisible — ce n&apos;est pas un goût,
          c&apos;est la luminance. Et en bas, la méthode bénie du teintage : trois gris de
          même luminance, trois rapports identiques (C15).</p>
          <Apercu outils={
            <button className={`bouton casse ${actionSombre ? "on" : ""}`} onClick={() => setActionSombre(!actionSombre)}>
              {actionSombre ? "Réparer : éclaircir l'action" : "Casser : une action sombre en sombre"}
            </button>
          } enfants={() => (
            <div style={{ width: "100%", display: "grid", gap: "var(--rr-block-unit)", textAlign: "left" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 16rem), 1fr))", gap: "var(--rr-inline-unit)" }}>
                <div data-theme="clair" style={{ display: "grid", gap: "var(--rr-block-sm)" }}>
                  <span className="mono" style={{ color: "var(--c-sourd)" }}>thème clair</span>
                  <MiniEcran cle={`clair-${actionSombre}`} />
                </div>
                <div data-theme="sombre" style={{ display: "grid", gap: "var(--rr-block-sm)", ...(actionSombre ? actionSombreStyle : {}) }}>
                  <span className="mono" style={{ color: "var(--c-sourd)" }}>thème sombre{actionSombre ? " — action forcée sombre" : ""}</span>
                  <MiniEcran cle={`sombre-${actionSombre}`} />
                </div>
              </div>
              <div style={{ display: "grid", gap: "var(--rr-block-sm)", justifyItems: "start" }}>
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
            (<span className="mono">couleur</span> dans
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
          <p className="sourd" style={{ fontSize: "0.75rem" }}>Cette page est rendue dans la
          vraie famille couleur (COLOR-UX 2.0.0) : le thème agit pleinement ici. Le reste
          du site garde la palette provisoire jusqu&apos;à validation — la bascule est
          prête.</p>
        </div>
      </aside>
    </div>
  );
}
