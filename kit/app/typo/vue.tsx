"use client";
import { useEffect, useRef, useState } from "react";
import { Navigation } from "../nav";
import { Apercu, PanneauCode } from "../apercu";
import { Densite } from "../densite";

/* L'échelle de travail des corps — mêmes valeurs que tokens.css.
   L'aperçu recalcule chaque échelon pour SA largeur, et le « zoom lecteur »
   multiplie la part rem : c'est exactement ce que fait le zoom du navigateur,
   et c'est pour ça que le vw seul échoue (T3). */
const ECHELONS: [string, string, number, number, number, number][] = [
  ["--t-titre-1", "titre 1", 1.6, 1.4571, 0.7143, 2.1],
  ["--t-titre-2", "titre 2", 1.3, 1.2429, 0.2857, 1.5],
  ["--t-titre-3", "titre 3", 1.15, 1.1214, 0.1429, 1.25],
  ["--t-corps", "corps", 1.0, 0.9571, 0.2143, 1.15],
];

function corpsPx(nom: string, largeur: number, zoom: number, vwSeul: boolean): number {
  const t = ECHELONS.find(([n]) => n === nom)!;
  if (vwSeul) {
    /* la casse : tout en vw, plus aucune part rem — le zoom ne mord plus */
    return ((t[2] + t[5]) / 2) * 16 * (largeur / 1024);
  }
  const pref = t[3] * 16 * zoom + (t[4] * largeur) / 100;
  return Math.min(t[5] * 16 * zoom, Math.max(t[2] * 16 * zoom, pref));
}

const REGLES: { id: string; nom: string; titre: string; enonce: string; pourquoi?: string; div?: string; src: { t: string; h: string }[] }[] = [
  { id: "p01", nom: "principe", titre: "Le sens et la lisibilité sont deux décisions séparées",
    enonce: "Le niveau d'un titre suit la structure du contenu ; sa taille suit le design. Un h2 peut légitimement être rendu plus petit qu'un h3 — aucune des deux décisions ne se prend à la place de l'autre.",
    src: [{ t: "GOV.UK — Typography", h: "https://design-system.service.gov.uk/styles/typography/" }, { t: "MDN — Heading elements", h: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements" }] },
  { id: "t1", nom: "T1", titre: "Jamais de saut de niveau",
    enonce: "Les niveaux de titre se suivent sans saut — un h2 n'est jamais suivi directement d'un h4.",
    pourquoi: "Un saut casse l'arbre que le lecteur d'écran parcourt : l'utilisateur conclut à du contenu manquant. Aucun bénéfice en échange.",
    src: [{ t: "WCAG 1.3.1 — techniques WAI", h: "https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html" }] },
  { id: "g1", nom: "G1", titre: "Exactement un h1 par page",
    enonce: "Ni deux, ni zéro : le h1 est le titre du document, pas le plus gros texte de la page.",
    pourquoi: "Le référencement lit le h1 comme le sujet de la page — l'absence coûte autant que la duplication. Arbitrage daté (31 juillet 2026, motif SEO). Déjà tenu par notre garde-fou automatique.",
    src: [{ t: "MDN — Heading elements", h: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements" }] },
  { id: "t2", nom: "T2", titre: "La taille glisse",
    enonce: "Les tailles varient continûment entre deux bornes selon la largeur — pas de paliers de media queries. La variation vit dans le jeton, jamais dans un écran.",
    pourquoi: "C'est le jumeau typographique de la règle 8 du rythme, tranchée le même jour : si chaque écran redéfinissait ses corps, le système n'existerait plus.",
    src: [{ t: "Smashing — Fluid Type (2023)", h: "https://www.smashingmagazine.com/2023/11/addressing-accessibility-concerns-fluid-type/" }] },
  { id: "t3", nom: "T3", titre: "Le zoom garde ses droits",
    enonce: "Jamais de taille en unités d'écran seules (vw). Toute taille fluide porte une part rem dans ses trois parties : minimum, préférée, maximum.",
    pourquoi: "L'utilisateur zoome, la fenêtre ne bouge pas : un texte en vw seul ne grandit pas. Échec d'accessibilité silencieux — invisible en test standard, bloquant pour qui dépend du zoom.",
    src: [{ t: "WCAG 1.4.4 — Resize Text", h: "https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html" }, { t: "Roselli — Responsive Type and Zoom", h: "https://adrianroselli.com/2019/12/responsive-type-and-zoom.html" }] },
  { id: "t4", nom: "T4", titre: "Un échelon ne s'étire jamais au-delà de 2,5×",
    enonce: "Le rapport entre la taille maximale et la taille minimale d'un même échelon reste sous 2,5.",
    pourquoi: "Sous ce ratio, le texte atteint ses 200 % de zoom sur les largeurs usuelles. Et même conforme, on teste au zoom réel, pas à la formule (mesure M1).",
    src: [{ t: "Smashing — Fluid Type (2023)", h: "https://www.smashingmagazine.com/2023/11/addressing-accessibility-concerns-fluid-type/" }] },
  { id: "t5", nom: "T5", titre: "Qui glisse se borne",
    enonce: "Tout bloc de texte courant porte une largeur maximale exprimée en ch — jamais en pixels. La règle exige la borne ; la valeur exacte est un arbitrage de registre.",
    pourquoi: "Sans borne, la taille monte en butée pendant que la ligne s'allonge : la fluidité dégrade la lecture qu'elle devait servir. Les plages publiées divergent (45–75 Bringhurst, 40–60 Material) — on cite les sources comme motif, jamais comme exigence.",
    div: "Une max-width de 65ch laisse passer plus de 65 caractères : ch mesure la chasse du « 0 », pas la moyenne. D'où la mesure au rendu (M2) plutôt que la confiance en la déclaration.",
    src: [{ t: "Butterick — Practical Typography", h: "https://practicaltypography.com/summary-of-key-rules.html" }, { t: "MDN — CSS length units", h: "https://developer.mozilla.org/en-US/docs/Web/CSS/length" }] },
  { id: "t6", nom: "T6", titre: "Le texte courant respire à 1,5 minimum",
    enonce: "Interlignage d'au moins 1,5 fois le corps pour le texte de lecture ; les grands corps ont le droit de serrer.",
    pourquoi: "C'est le pont promis par la fondation rythme : l'espace entre les lignes fait plus pour la lisibilité que le choix de la police.",
    src: [{ t: "WCAG 1.4.8 — Visual Presentation", h: "https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html" }, { t: "MDN — line-height", h: "https://developer.mozilla.org/en-US/docs/Web/CSS/line-height" }] },
  { id: "t7", nom: "T7", titre: "Le demi-gras porte les titres, jamais le texte long",
    enonce: "Aucun bloc de texte long en demi-gras ; aucune graisse plus fine que la standard sous le corps courant.",
    pourquoi: "Un paragraphe entier appuyé n'a plus d'emphase du tout ; la finesse en petit corps dégrade le contraste réel du trait, même quand la couleur passe les seuils.",
    src: [{ t: "IBM Carbon — Typography", h: "https://carbondesignsystem.com/elements/typography/overview/" }] },
  { id: "t8", nom: "T8", titre: "Les capitales : brèves, espacées, jamais tapées",
    enonce: "Casse haute réservée aux étiquettes courtes, avec 5 à 12 % d'interlettrage, appliquée par la feuille de style — le contenu source reste en casse normale.",
    pourquoi: "Les capitales, dessinées pour ouvrir des phrases, se serrent sans interlettrage — et la silhouette de mot disparaît sur du texte courant.",
    src: [{ t: "Butterick — Practical Typography", h: "https://practicaltypography.com/summary-of-key-rules.html" }, { t: "MDN — text-transform", h: "https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform" }] },
  { id: "t9", nom: "T9", titre: "Fer à gauche, jamais justifié, centré réservé",
    enonce: "Début de ligne aligné par défaut ; aucun texte d'interface justifié ; le centrage est réservé aux titres courts, jamais à un paragraphe.",
    div: "Les études empiriques sur la justification sont non concluantes — notre fonds le reconnaît. La règle tient sur WCAG 1.4.8 et sur les rivières d'espace sans césure fiable. Dit, pas caché.",
    src: [{ t: "WCAG 1.4.8 — Visual Presentation", h: "https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html" }] },
  { id: "t10", nom: "T10", titre: "Jamais sous l'équivalent 16 px",
    enonce: "Le texte courant ne descend jamais sous 16 px d'équivalent, en rem — les champs de saisie non plus.",
    pourquoi: "Sous 16 px, Safari iOS zoome la page entière au focus d'un champ. Comportement de plateforme, pas décision esthétique.",
    src: [{ t: "CSS-Tricks — 16px form zoom", h: "https://css-tricks.com/16px-or-larger-text-prevents-ios-form-zoom/" }, { t: "MDN — font-size", h: "https://developer.mozilla.org/en-US/docs/Web/CSS/font-size" }] },
  { id: "t11", nom: "T11", titre: "La fonte déclarée est la fonte livrée",
    enonce: "Toute famille déclarée est appariée à un fichier versé au dépôt, au nom strictement identique, avec sa pile de secours. Aucun nom orphelin.",
    pourquoi: "Un nom qui ne correspond pas ne produit aucune erreur : il produit un produit entier en police système, en silence. C'est arrivé ici — dix-sept versions de notre application témoin durant, personne n'a rien vu.",
    div: "Règle née chez nous, de cet incident — pas importée d'une source. Les familles de ce kit sont arbitrées et livrées : Geist, JetBrains Mono.",
    src: [{ t: "Incident documenté au journal (#058)", h: "#" }] },
];

function Regles({ ids }: { ids: string[] }) {
  return (
    <div style={{ display: "grid", gap: "var(--rr-block-unit)" }}>
      {ids.map((id) => REGLES.find((r) => r.id === id)!).map((r) => (
        <div key={r.id} style={{ display: "grid", gap: "var(--rr-block-xs)" }}>
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

/* ── Le spécimen vivant : l'échelle recalculée pour la largeur de l'aperçu,
   et un « zoom lecteur » qui multiplie la part rem — comme le vrai zoom. ── */
function Specimen({ largeur, zoom, vwSeul }: { largeur: number; zoom: number; vwSeul: boolean }) {
  const px = (nom: string) => corpsPx(nom, largeur, zoom, vwSeul);
  return (
    <div style={{ width: "100%", display: "grid", gap: "var(--rr-block-md)", textAlign: "left" }}>
      <div style={{ fontSize: `${px("--t-titre-1")}px`, lineHeight: "var(--t-interligne-titre)", fontWeight: 600, letterSpacing: "-0.02em" }}>
        Portez ce vieux whisky
      </div>
      <div style={{ fontSize: `${px("--t-titre-2")}px`, lineHeight: "var(--t-interligne-titre)", fontWeight: 600 }}>
        au juge blond qui fume
      </div>
      <div style={{ fontSize: `${px("--t-corps")}px`, lineHeight: "var(--t-interligne-courant)", maxWidth: "var(--t-mesure)" }}>
        Le corps courant ne descend jamais sous l&apos;équivalent 16 px, et chaque
        échelon glisse entre ses deux bornes — celles-ci, vous les voyez bouger.
      </div>
    </div>
  );
}

/* ── La mesure, comptée sur la page rendue (l'esprit de M2) ── */
function Mesure({ largeur, sansBorne, serre }: { largeur: number; sansBorne: boolean; serre: boolean }) {
  const pRef = useRef<HTMLParagraphElement>(null);
  const zRef = useRef<HTMLSpanElement>(null);
  const [parLigne, setParLigne] = useState(0);
  useEffect(() => {
    const p = pRef.current, z = zRef.current;
    if (!p || !z) return;
    const raf = requestAnimationFrame(() => {
      const w = p.getBoundingClientRect().width;
      const ch = z.getBoundingClientRect().width / 20;
      if (ch > 0) setParLigne(Math.round(w / ch));
    });
    return () => cancelAnimationFrame(raf);
  }, [largeur, sansBorne, serre]);
  const horsPlage = parLigne > 80;
  return (
    <div style={{ width: "100%", display: "grid", gap: "var(--rr-block-unit)", justifyItems: "start", textAlign: "left" }}>
      <p ref={pRef} style={{ position: "relative", maxWidth: sansBorne ? "none" : "var(--t-mesure)", width: sansBorne ? "100%" : undefined, lineHeight: serre ? 1.25 : "var(--t-interligne-courant)", fontSize: "var(--t-corps)" }}>
        <span ref={zRef} aria-hidden style={{ position: "absolute", visibility: "hidden", whiteSpace: "pre" }}>00000000000000000000</span>
        La lisibilité d&apos;un paragraphe dépend plus de sa mesure que de sa taille :
        au-delà d&apos;une certaine longueur de ligne, l&apos;œil perd le retour à la ligne
        et relit la même phrase. Et sans son air entre les lignes, le même texte se
        compacte au point de gêner le suivi. Cassez la borne, cassez l&apos;interligne —
        et lisez ce paragraphe encore une fois.
      </p>
      <span className={`badge ${horsPlage || serre ? "ko" : ""}`}>
        ≈ {parLigne} caractères par ligne{horsPlage ? " — hors plage, l'œil décroche" : ""}{serre ? " · interligne 1,25 — sous le plancher de 1,5" : ""}
      </span>
    </div>
  );
}

/* ── L'arbre des titres : les niveaux comme barreaux d'échelle ── */
function Arbre({ saut }: { saut: boolean }) {
  const rangs: [string, number, boolean][] = saut
    ? [["h1 · Le dossier", 0, false], ["h2 · Première partie", 1, false], ["h4 · Un détail", 3, true], ["h2 · Deuxième partie", 1, false]]
    : [["h1 · Le dossier", 0, false], ["h2 · Première partie", 1, false], ["h3 · Sous-partie", 2, false], ["h2 · Deuxième partie", 1, false]];
  return (
    <div style={{ width: "100%", maxWidth: "28rem", display: "grid", gap: "var(--rr-block-sm)", textAlign: "left" }}>
      {saut && (
        <div className="mono" style={{ color: "var(--p-rouge)", marginLeft: "calc(2 * var(--rr-inline-2xl))" }}>
          h3 manquant — le lecteur d&apos;écran conclut à du contenu disparu
        </div>
      )}
      {rangs.map(([txt, prof, ko]) => (
        <div key={txt} className="mono" style={{
          marginLeft: `calc(${prof} * var(--rr-inline-2xl))`,
          padding: "var(--rr-block-md) var(--rr-inline-unit)",
          background: ko ? "var(--p-rouge-doux)" : "var(--p-accent-doux)",
          color: ko ? "var(--p-rouge)" : "var(--p-accent)",
          borderRadius: "var(--rr-radius)", fontSize: "0.75rem",
        }}>{txt}</div>
      ))}
    </div>
  );
}

const SNIPPETS: Record<"React" | "Angular" | "HTML", Record<"CSS natif" | "Tailwind", string>> = {
  React: {
    "CSS natif": `/* Le normatif : la règle et le jeton. Ce code n'est qu'un exemple. */
export function Article({ titre, enfants }) {
  return (
    <article className="texte-courant">
      <h2 className="titre-2">{titre}</h2>
      {enfants}
    </article>
  );
}

/* styles.css — tout sort des jetons, rien en dur */
.texte-courant {
  font: 400 var(--t-corps) / var(--t-interligne-courant) var(--t-interface);
  max-width: var(--t-mesure);           /* T5 : qui glisse se borne */
}
.titre-2 {
  font-size: var(--t-titre-2);          /* T2/T3 : clamp() avec du rem partout */
  line-height: var(--t-interligne-titre);
  font-weight: 600;                     /* T7 : le demi-gras porte les titres */
}`,
    Tailwind: `// tailwind.config : theme.extend ← typo (tokens.tailwind.mjs)
// chaque classe résout var(--t-…) — un thème littéral sortirait ARRONDI
export function Article({ titre, enfants }) {
  return (
    <article className="font-interface text-corps leading-courant max-w-mesure">
      <h2 className="text-titre-2 leading-titre font-semibold">{titre}</h2>
      {enfants}
    </article>
  );
}`,
  },
  Angular: {
    "CSS natif": `@Component({
  selector: "kit-article",
  template: \`
    <article class="texte-courant">
      <h2 class="titre-2">{{ titre }}</h2>
      <ng-content />
    </article>\`,
  styleUrl: "./article.css", // mêmes classes : var(--t-corps), var(--t-mesure)…
})
export class Article { @Input() titre = ""; }`,
    Tailwind: `@Component({
  selector: "kit-article",
  template: \`
    <article class="font-interface text-corps leading-courant max-w-mesure">
      <h2 class="text-titre-2 leading-titre font-semibold">{{ titre }}</h2>
      <ng-content />
    </article>\`,
})
export class Article { @Input() titre = ""; }`,
  },
  HTML: {
    "CSS natif": `<link rel="stylesheet" href="kit/tokens.css" />
<link rel="stylesheet" href="kit/fontes.css" /><!-- T11 : fontes livrées -->

<article class="texte-courant">
  <h2 class="titre-2">Le titre</h2>
  <p>Le corps courant — jamais sous 16 px, borné en ch, interligne 1,6.</p>
</article>`,
    Tailwind: `<article class="font-interface text-corps leading-courant max-w-mesure">
  <h2 class="text-titre-2 leading-titre font-semibold">Le titre</h2>
  <p>Les classes résolvent les jetons — le système reste le même.</p>
</article>`,
  },
};

export default function Vue() {
  const [zoom, setZoom] = useState(1);
  const [vwSeul, setVwSeul] = useState(false);
  const [sansBorne, setSansBorne] = useState(false);
  const [serre, setSerre] = useState(false);
  const [saut, setSaut] = useState(false);
  const [gras, setGras] = useState(false);
  const [tape, setTape] = useState(false);
  const [justif, setJustif] = useState(false);
  const [petit, setPetit] = useState(false);
  const [mauvaisNom, setMauvaisNom] = useState(false);
  const [fw, setFw] = useState<"React" | "Angular" | "HTML">("React");
  const [styl, setStyl] = useState<"CSS natif" | "Tailwind">("CSS natif");

  return (
    <div className="coquille">
      <Navigation actif="typo" />

      <main className="contenu">
        <div className="tete-page">
          <p className="kicker">Fondation · La typographie</p>
          <h1>Chaque lettre de cette page sait pourquoi</h1>
          <p className="chapo">
            La typographie de ce système tient en <b>onze règles, passées une par une en
            séance le 23 août 2026</b> — chacune née d&apos;un problème réel, avec son pourquoi,
            sa source, et l&apos;aveu de nos tensions. Chaque banc d&apos;essai les montre à
            l&apos;œuvre, réglables et cassables. Vous les lisez déjà dans les fontes
            qu&apos;elles imposent : Geist, et JetBrains Mono pour le code — livrées avec le
            kit, c&apos;est la règle T11.
          </p>
        </div>

        <section className="bloc-section">
          <p className="kicker">01 · L&apos;échelle et le zoom</p>
          <h2>L&apos;échelle glisse — et le zoom garde ses droits</h2>
          <p className="sourd">Une taille figée casse au premier écran étroit ; une taille en
          unités d&apos;écran ignore le zoom du lecteur — échec invisible en test, bloquant pour
          qui en dépend. Ici chaque échelon glisse entre deux bornes, et sa part rem laisse le
          zoom agir. La casse « vw seul » montre le piège : le zoom monte, rien ne bouge.</p>
          <Apercu outils={
            <>
              {[1, 1.5, 2].map((z) => (
                <button key={z} className={`bouton ${zoom === z ? "on" : ""}`} onClick={() => setZoom(z)}>
                  zoom ×{z === 1.5 ? "1,5" : z}
                </button>
              ))}
              <button className={`bouton ${vwSeul ? "on" : ""}`} onClick={() => setVwSeul(!vwSeul)}>
                {vwSeul ? "Réparer" : "Casser : vw seul"}
              </button>
            </>
          } enfants={(l) => (
            <div style={{ width: "100%", display: "grid", gap: "var(--rr-block-unit)" }}>
              <Specimen largeur={l} zoom={zoom} vwSeul={vwSeul} />
              <span className={`mono ${vwSeul && zoom > 1 ? "" : "sourd"}`} style={{ fontSize: "0.6875rem", color: vwSeul && zoom > 1 ? "var(--p-rouge)" : undefined }}>
                à {Math.round(l)} px, zoom ×{zoom === 1.5 ? "1,5" : zoom} : titre 1 = {corpsPx("--t-titre-1", l, zoom, vwSeul).toFixed(0)} px ·
                corps = {corpsPx("--t-corps", l, zoom, vwSeul).toFixed(0)} px
                {vwSeul && zoom > 1 && " — le zoom ne mord plus : échec WCAG 1.4.4"}
              </span>
            </div>
          )} pied={
            <details className="prov"><summary>D&apos;où ça vient</summary><div>
              <p>L&apos;échelle affichée est une échelle de travail conforme aux règles actées —
              ses valeurs exactes restent un arbitrage de registre, déclaré, pas subi. Le rapport
              max/min du plus grand échelon reste loin du plafond de 2,5.</p>
              <Regles ids={["t2", "t3", "t4"]} />
            </div></details>
          } />
        </section>

        <section className="bloc-section">
          <p className="kicker">02 · La mesure et l&apos;air</p>
          <h2>La mesure et l&apos;air — le paragraphe se défend</h2>
          <p className="sourd">Une ligne trop longue égare l&apos;œil au retour ; un interligne
          serré étouffe la lecture. La borne en ch et le plancher de 1,5 tiennent le
          paragraphe — et le compteur lit la ligne réelle sur la page rendue, jamais la
          déclaration.</p>
          <Apercu outils={
            <>
              <button className={`bouton ${sansBorne ? "on" : ""}`} onClick={() => setSansBorne(!sansBorne)}>
                {sansBorne ? "Réparer la borne" : "Casser la borne"}
              </button>
              <button className={`bouton ${serre ? "on" : ""}`} onClick={() => setSerre(!serre)}>
                {serre ? "Rendre l'air" : "Casser l'interligne"}
              </button>
            </>
          } enfants={(l) => <Mesure largeur={l} sansBorne={sansBorne} serre={serre} />} pied={
            <details className="prov"><summary>D&apos;où ça vient</summary><div>
              <Regles ids={["t5", "t6"]} />
            </div></details>
          } />
        </section>

        <section className="bloc-section">
          <p className="kicker">03 · La hiérarchie</p>
          <h2>Le sens et la taille, séparés — et jamais de barreau manquant</h2>
          <p className="sourd">Un niveau de titre sauté, et le lecteur d&apos;écran conclut à du
          contenu manquant : l&apos;arbre des titres est une échelle, chaque barreau compte. Le
          sens suit la structure, la taille suit le design. (Les titres ci-dessous sont
          dessinés, pas réels : cette page garde son unique h1 — règle G1.)</p>
          <Apercu outils={
            <button className={`bouton ${saut ? "on" : ""}`} onClick={() => setSaut(!saut)}>
              {saut ? "Réparer" : "Casser : sauter un niveau"}
            </button>
          } enfants={() => <Arbre saut={saut} />} pied={
            <details className="prov"><summary>D&apos;où ça vient</summary><div>
              <Regles ids={["p01", "t1", "g1"]} />
            </div></details>
          } />
        </section>

        <section className="bloc-section">
          <p className="kicker">04 · Les pièges</p>
          <h2>Quatre pièges connus — cassez-les un par un</h2>
          <p className="sourd">Quatre dérives ordinaires, et aucune ne produit d&apos;erreur
          nulle part — c&apos;est bien le problème. Chaque carte porte la règle qui
          l&apos;arrête, et le moyen de la voir échouer.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))", gap: "var(--rr-inline-unit)" }}>
            <div className="carte">
              <div className="rang" style={{ justifyContent: "space-between" }}>
                <span className="mono sourd">La graisse</span>
                <button className={`bouton ${gras ? "on" : ""}`} onClick={() => setGras(!gras)}>{gras ? "Réparer" : "Casser"}</button>
              </div>
              <p style={{ fontWeight: gras ? 600 : 400 }}>Un texte long en demi-gras n&apos;appuie
              plus rien : quand tout est important, rien ne l&apos;est. Le demi-gras appartient
              aux titres — ce paragraphe vient de vous le prouver.</p>
            </div>
            <div className="carte">
              <div className="rang" style={{ justifyContent: "space-between" }}>
                <span className="mono sourd">Les capitales</span>
                <button className={`bouton ${tape ? "on" : ""}`} onClick={() => setTape(!tape)}>{tape ? "Réparer" : "Casser"}</button>
              </div>
              <p style={tape ? { textTransform: "uppercase" } : undefined}>Les capitales sur du
              texte courant effacent la silhouette des mots — l&apos;œil épelle au lieu de lire.
              Ici elles restent aux étiquettes brèves, espacées, posées par le style.</p>
            </div>
            <div className="carte">
              <div className="rang" style={{ justifyContent: "space-between" }}>
                <span className="mono sourd">La justification</span>
                <button className={`bouton ${justif ? "on" : ""}`} onClick={() => setJustif(!justif)}>{justif ? "Réparer" : "Casser"}</button>
              </div>
              <p style={{ textAlign: justif ? "justify" : "start", maxWidth: "14rem" }}>Sur une
              colonne étroite et sans césure fiable, la justification creuse des rivières
              d&apos;espace entre les mots — regardez celles-ci se former dans ce paragraphe.</p>
            </div>
            <div className="carte">
              <div className="rang" style={{ justifyContent: "space-between" }}>
                <span className="mono sourd">Les 16 px du champ</span>
                <button className={`bouton ${petit ? "on" : ""}`} onClick={() => setPetit(!petit)}>{petit ? "Réparer" : "Casser"}</button>
              </div>
              <div className="champ">
                <input readOnly value="prenom@exemple.fr" style={{ fontSize: petit ? "0.875rem" : "1rem" }} />
                <span className={`badge ${petit ? "ko" : ""}`}>{petit ? "14 px — Safari iOS zoomera la page au focus" : "16 px — le focus reste calme"}</span>
              </div>
            </div>
          </div>
          <details className="prov"><summary>D&apos;où ça vient</summary><div>
            <Regles ids={["t7", "t8", "t9", "t10"]} />
          </div></details>
        </section>

        <section className="bloc-section">
          <p className="kicker">05 · La fonte livrée</p>
          <h2>La fonte déclarée est la fonte livrée</h2>
          <p className="sourd">Un nom de famille qui ne correspond à aucun fichier livré ne
          déclenche rien : le produit entier passe en police système, en silence. C&apos;est
          arrivé ici, dix-sept versions durant — d&apos;où la règle la plus chèrement payée du
          corpus.</p>
          <Apercu outils={
            <button className={`bouton ${mauvaisNom ? "on" : ""}`} onClick={() => setMauvaisNom(!mauvaisNom)}>
              {mauvaisNom ? "Réparer le nom" : "Casser : déclarer « Geist Text »"}
            </button>
          } enfants={() => (
            <div style={{ width: "100%", display: "grid", gap: "var(--rr-block-unit)", textAlign: "left", fontFamily: mauvaisNom ? '"Geist Text", ui-sans-serif, system-ui, sans-serif' : "var(--t-interface)" }}>
              <div style={{ fontSize: "var(--t-titre-2)", fontWeight: 600, lineHeight: "var(--t-interligne-titre)" }}>
                Portez ce vieux whisky au juge blond qui fume
              </div>
              <p style={{ maxWidth: "var(--t-mesure)" }}>Ce paragraphe est rendu dans la fonte que
              ses styles déclarent{mauvaisNom ? "… sauf que « Geist Text » n'existe dans aucun fichier livré : vous lisez la police système de secours, et rien ne vous l'a dit." : " — « Geist », livrée dans le dépôt, au nom exact, avec sa pile de secours."}</p>
              <span className={`badge ${mauvaisNom ? "ko" : ""}`}>{mauvaisNom ? "nom orphelin — produit entier en police système, en silence" : "Geist — déclarée, livrée, vérifiable"}</span>
            </div>
          )} pied={
            <details className="prov"><summary>D&apos;où ça vient</summary><div>
              <Regles ids={["t11"]} />
            </div></details>
          } />
        </section>

        <section className="bloc-section">
          <p className="kicker">06 · L&apos;adaptation</p>
          <h2>Votre stack, pas la nôtre</h2>
          <p className="sourd">Un système normatif enfermé dans un framework n&apos;est
          qu&apos;une bibliothèque. Ici le normatif vit dans la règle et le jeton ; React,
          Angular ou HTML n&apos;en sont que des consommateurs — le même système, traduit.</p>
          <PanneauCode langage={`${fw} · ${styl}`} code={SNIPPETS[fw][styl]} />
          <details className="prov"><summary>D&apos;où ça vient</summary><div>
            <p>Le normatif, c&apos;est <b>la règle et le jeton</b> — pas le code. Un seul jeu de
            jetons produit des variables CSS natives et une sortie Tailwind jumelle ; React,
            Angular ou HTML n&apos;en sont que des consommateurs.</p>
          </div></details>
        </section>
      </main>

      <aside className="reglages">
        <h3>Theming &amp; playground</h3>
        <Densite />
        <div className="bloc">
          <span className="mono sourd">Adaptation</span>
          <div className="rang" style={{ gap: "var(--rr-inline-sm)" }}>
            {(["React", "Angular", "HTML"] as const).map((f) => (
              <button key={f} className={`bouton ${fw === f ? "on" : ""}`} onClick={() => setFw(f)}>{f}</button>
            ))}
          </div>
          <div className="rang" style={{ gap: "var(--rr-inline-sm)" }}>
            {(["CSS natif", "Tailwind"] as const).map((s) => (
              <button key={s} className={`bouton ${styl === s ? "on" : ""}`} onClick={() => setStyl(s)}>{s}</button>
            ))}
          </div>
        </div>
        <div className="bloc">
          <span className="mono sourd">Familles livrées</span>
          <p className="sourd" style={{ fontSize: "0.75rem" }}>Geist (interface) ·
          JetBrains Mono (code) — arbitrées le 23 août, fichiers au dépôt (T11).</p>
        </div>
        <p className="sourd" style={{ fontSize: "0.75rem" }}>La largeur se règle sur chaque banc
        (poignée, paliers, double-clic). Le thème arrivera avec sa fondation couleur.</p>
      </aside>
    </div>
  );
}
