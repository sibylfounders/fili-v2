"use client";
import { useState } from "react";
import { Navigation } from "../nav";
import { Apercu, PanneauCode } from "../apercu";
import { Densite, useDensite } from "../densite";

/* Constantes des jetons — mêmes que tokens.css (valeurs lues sur le générateur
   de référence à 320 et 1440, interpolées). L'aperçu recalcule chaque cran
   pour SA largeur : redimensionner l'aperçu fait vivre l'échelle. */
const TOKENS: [string, number, number, number, number][] = [
  ["--rr-inline-xs", 0.3001, 0.2572, 0.2144, 0.4501],
  ["--rr-inline-sm", 0.39, 0.3343, 0.2786, 0.585],
  ["--rr-inline-unit", 0.6, 0.5143, 0.4286, 0.9],
  ["--rr-inline-lg", 0.8487, 0.7274, 0.6062, 1.273],
  ["--rr-inline-xl", 0.66, 0.5657, 0.4714, 0.99],
  ["--rr-inline-2xl", 1.2, 1.0286, 0.8571, 1.8],
  ["--rr-block-xs", 0.135, 0.1239, 0.0557, 0.1741],
  ["--rr-block-sm", 0.1688, 0.1549, 0.0697, 0.2176],
  ["--rr-block-md", 0.2363, 0.2168, 0.0975, 0.3046],
  ["--rr-block-control", 0.4725, 0.4335, 0.195, 0.609],
  ["--rr-block-card", 0.9547, 0.8759, 0.394, 1.2306],
  ["--rr-block-unit", 0.6752, 0.6195, 0.2787, 0.8703],
  ["--rr-block-lg", 0.9547, 0.8759, 0.394, 1.2306],
  ["--rr-block-xl", 0.8438, 0.7741, 0.3482, 1.0875],
  ["--rr-block-page", 1.35, 1.2386, 0.5571, 1.74],
  ["--rr-type", 0.96, 0.9286, 0.1571, 1.07],
  ["--rr-radius", 0.645, 0.5893, 0.2786, 0.84],
  ["--rr-radius-card", 0.7418, 0.6777, 0.3204, 0.966],
  ["--rr-radius-shell", 0.8708, 0.7955, 0.3761, 1.134],
  ["--rr-control", 2.75, 2.7029, 0.2357, 2.915],
];

/* L'échelle d'espacement par défaut de Tailwind, en px : pas de 2 px jusqu'à 14,
   puis pas de 4 jusqu'à 48, puis les grands crans. Quand l'adaptation est
   « Tailwind », chaque valeur s'accroche au cran Tailwind le plus proche —
   plus de décimales (note d'Auteur du 23 août). */
const ECHELLE_TW = [0, 1, 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 56, 64, 80, 96, 112, 128, 144, 160];
const versTw = (px: number) => ECHELLE_TW.reduce((a, b) => (Math.abs(b - px) < Math.abs(a - px) ? b : a));

/* La densité (règle Y5) : un cran d'écart sur l'échelle commune. Le site
   entier est décalé par tokens.css ; l'aperçu, qui recalcule ses jetons
   pour SA largeur, applique le même décalage ici. */
const L_INLINE = ["--rr-inline-xs", "--rr-inline-sm", "--rr-inline-unit", "--rr-inline-xl", "--rr-inline-lg", "--rr-inline-2xl"];
const L_BLOCK = ["--rr-block-xs", "--rr-block-sm", "--rr-block-md", "--rr-block-control", "--rr-block-unit", "--rr-block-xl", "--rr-block-card", "--rr-block-page"];
function cranSource(nom: string, dec: number): string {
  if (dec === 0) return nom;
  const base = nom === "--rr-block-lg" ? "--rr-block-card" : nom;
  const l = L_INLINE.includes(base) ? L_INLINE : L_BLOCK.includes(base) ? L_BLOCK : null;
  if (!l) return nom;
  return l[Math.min(l.length - 1, Math.max(0, l.indexOf(base) + dec))];
}
function calcPx(nom: string, largeurPx: number, dec: number): number {
  const t = TOKENS.find(([n]) => n === cranSource(nom, dec))!;
  return Math.min(t[4] * 16, Math.max(t[1] * 16, t[2] * 16 + (t[3] * largeurPx) / 100));
}
function jetons(largeurPx: number, tw = false, dec = 0): React.CSSProperties {
  const o: Record<string, string> = {};
  for (const [nom] of TOKENS) {
    const px = calcPx(nom, largeurPx, dec);
    o[nom] = tw ? `${versTw(px)}px` : `${px.toFixed(2)}px`;
  }
  return o as React.CSSProperties;
}
const lirePx = (largeur: number, nom: string, tw = false, dec = 0) => {
  const px = calcPx(nom, largeur, dec);
  return tw ? String(versTw(px)) : px.toFixed(1);
};

/* Un espace rendu visible : c'est un VRAI espace de la carte (il porte le jeton),
   pas une illustration — l'interrupteur ne fait que le colorer. */
function E({ j, h, voir, role }: { j: string; h?: boolean; voir: boolean; role?: string }) {
  const cran = j.replace("--rr-inline-", "").replace("--rr-block-", "");
  return <span className={`espace ${h ? "h" : ""} ${voir ? "vu" : ""}`}
    data-nom={voir ? `${role ?? (h ? "inline" : "stack")} · ${cran}` : undefined}
    style={h ? { width: `var(${j})` } : { height: `var(${j})` }} />;
}

/* La carte annotée — construite avec des blocs d'espace explicites. */
function CarteAnnotee({ voir }: { voir: boolean }) {
  /* Les noms restent les mêmes en compact : c'est le jeton qui descend d'un cran. */
  const padV = "--rr-block-card";
  const padH = "--rr-inline-2xl";
  const freres = "--rr-block-md";
  const Ligne = ({ children }: { children: React.ReactNode }) => (
    <span style={{ display: "flex", alignItems: "stretch" }}>
      <E j={padH} h voir={voir} role="inset" /><span style={{ flex: 1, minWidth: 0 }}>{children}</span><E j={padH} h voir={voir} role="inset" />
    </span>
  );
  return (
    <div className="carte-demo">
      <E j={padV} voir={voir} role="inset" />
      <Ligne><b>Léa Fontan</b></Ligne>
      <E j={freres} voir={voir} />
      <Ligne><span className="sourd" style={{ fontSize: "0.875em" }}>UX Designer — chaque distance de cette carte est un jeton de l&apos;échelle.</span></Ligne>
      <E j={freres} voir={voir} />
      <Ligne>
        <span style={{ display: "flex" }}>
          <button className="bouton">Message</button>
          <E j="--rr-inline-sm" h voir={voir} />
          <button className="bouton on">Suivre</button>
        </span>
      </Ligne>
      <E j={padV} voir={voir} role="inset" />
    </div>
  );
}

function Proximite({ casseY1, casseY2 }: { casseY1: boolean; casseY2: boolean }) {
  const labelMarge = casseY1
    ? { marginBottom: "var(--rr-block-card)", marginTop: "var(--rr-block-card)" }
    : { marginBottom: "var(--rr-block-md)", marginTop: "var(--rr-block-card)" };
  const titreMarges = casseY2
    ? { marginTop: "var(--rr-block-unit)", marginBottom: "var(--rr-block-unit)" }
    : { marginTop: "var(--rr-block-page)", marginBottom: "var(--rr-block-md)" };
  return (
    <div style={{ display: "grid", gap: "var(--rr-block-unit)", width: "100%", maxWidth: "26rem" }}>
      <div className="carte" style={{ gap: 0, background: "var(--p-papier)" }}>
        <p className="sourd" style={{ margin: 0 }}>Un paragraphe qui précède la section.</p>
        <h2 style={titreMarges}>Vos coordonnées</h2>
        <div>
          <label className="mono" style={{ display: "block", ...labelMarge }}>Adresse e-mail</label>
          <input readOnly value="prenom@exemple.fr" style={{ height: "var(--rr-control)", width: "100%", border: "1px solid var(--p-trait)", borderRadius: "var(--rr-radius)", padding: "0 var(--rr-inline-unit)", font: "inherit", background: "var(--p-fond)" }} />
        </div>
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

const SNIPPETS: Record<string, Record<string, string>> = {
  React: {
    "CSS natif": `/* Le normatif : la règle et le jeton. Ce code n'est qu'un exemple. */
export function Fiche({ enfants }) {
  return (
    <section className="fiche">   {/* inset : block-card / inline-2xl */}
      <div className="pile">{enfants}</div>
    </section>
  );
}

/* styles.css — tout sort des jetons, rien en dur */
.fiche { padding: var(--rr-block-card) var(--rr-inline-2xl);
         border-radius: var(--rr-radius-card); }
.pile  { display: grid; gap: var(--rr-block-md); }  /* stack, un cran sous l'inset — Y1 */`,
    Tailwind: `// tailwind.config : theme.extend.spacing ← rythme.spacing (variables, fluide)
// ou rythmeLitteral (grille 4-16, arrondie) — jamais les deux à la fois
export function Fiche({ enfants }) {
  return (
    <section className="p-block-card px-inline-2xl rounded-card">
      <div className="grid gap-block-md">{enfants}</div>
    </section>
  );
}`,
  },
  Angular: {
    "CSS natif": `@Component({
  selector: "kit-fiche",
  template: \`
    <section class="fiche">
      <div class="pile"><ng-content /></div>
    </section>\`,
  styleUrl: "./fiche.css", // mêmes classes : var(--rr-block-card), var(--rr-block-md)…
})
export class Fiche {}`,
    Tailwind: `@Component({
  selector: "kit-fiche",
  template: \`
    <section class="p-block-card px-inline-2xl rounded-card">
      <div class="grid gap-block-md"><ng-content /></div>
    </section>\`,
})
export class Fiche {}`,
  },
  HTML: {
    "CSS natif": `<link rel="stylesheet" href="kit/tokens.css" />

<section class="fiche">
  <p>Chaque distance vient d'un jeton — inset, stack, inline.</p>
</section>

<style>
  .fiche { padding: var(--rr-block-card) var(--rr-inline-2xl); }
  .fiche p { margin-block: var(--rr-block-md); }
</style>`,
    Tailwind: `<section class="p-block-card px-inline-2xl rounded-card">
  <div class="grid gap-block-md">
    <p>Les classes résolvent les jetons — le système reste le même.</p>
  </div>
</section>`,
  },
};

type Src = { t: string; h: string };
const REGLES: { id: string; nom: string; titre: string; enonce: string; pourquoi: string; src: Src[]; div?: string }[] = [
  { id: "y1", nom: "1", titre: "L'intérieur ne dépasse jamais l'extérieur",
    enonce: "L'espacement interne d'un composant est toujours inférieur ou égal à son espacement externe.",
    pourquoi: "Un contenu plus proche du bord du voisin que de son propre bord a l'air d'appartenir au voisin. L'espace dit qui est lié à qui — il ne doit pas mentir.",
    src: [{ t: "Atlassian — Spacing", h: "https://atlassian.design/foundations/spacing" }, { t: "NN/g — Principe de proximité", h: "https://www.nngroup.com/articles/gestalt-proximity/" }] },
  { id: "y2", nom: "2", titre: "Le titre appartient à ce qu'il ouvre",
    enonce: "L'espace au-dessus d'un titre dépasse l'espace au-dessous d'au moins un cran.",
    pourquoi: "Un titre équidistant flotte ; un titre plus proche du bloc précédent ment. Convention éditoriale constante, transposée en crans d'échelle.",
    src: [{ t: "Butterick — Space above & below", h: "https://practicaltypography.com/space-above-and-below.html" }, { t: "Rutter — Vertical rhythm", h: "https://webtypography.net/2.2.2" }] },
  { id: "y3", nom: "3", titre: "Les hauteurs s'accrochent à la grille",
    enonce: "Toute hauteur posée par le système s'exprime en multiples d'une unité de base unique.",
    pourquoi: "Des hauteurs alignées sur la même unité produisent un rythme perçu sans effort — la régularité vient du petit nombre de valeurs, pas de leur précision.",
    src: [{ t: "La grille 8pt", h: "https://spec.fm/specifics/8-pt-grid" }, { t: "Carbon — Spacing", h: "https://carbondesignsystem.com/elements/spacing/overview/" }] },
  { id: "y4", nom: "4", titre: "L'interligne suit la lisibilité, pas la grille",
    enonce: "Aucun interligne n'est recalé sur la grille sans une décision explicite et datée.",
    pourquoi: "La grille stricte des livres suppose des corps fixes ; forcer l'interligne dessus dégrade la lecture. La lisibilité prime — l'exception se décide, elle ne se subit pas.",
    src: [{ t: "WCAG 1.4.8 — Visual Presentation", h: "https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html" }] },
  { id: "y5", nom: "5", titre: "La densité est un décalage d'un cran",
    enonce: "Compact = confortable décalé d'exactement un cran sur l'échelle commune. Jamais une valeur propre, jamais un multiplicateur.",
    pourquoi: "Un « ×0,8 » fabrique des valeurs hors échelle, invisibles au changement de marque. Un cran d'écart reste dans le système.",
    src: [{ t: "Règle interne du système", h: "#" }] },
  { id: "y6", nom: "6", titre: "La densité ne change jamais la structure",
    enonce: "L'ordre des emplacements et la présence des éléments restent identiques d'une densité à l'autre.",
    pourquoi: "Un mode compact qui masque ou réordonne, c'est deux produits dans un — et un apprentissage cassé.",
    src: [{ t: "Règle interne du système", h: "#" }] },
  { id: "y7", nom: "7", titre: "Deux régimes, un seul seuil",
    enonce: "Mobile et desktop, séparés par un seuil de largeur unique.",
    pourquoi: "On n'ajoute pas des paliers par imitation : un troisième régime naîtra d'un besoin réel, documenté et daté.",
    div: "La plupart des grands systèmes ont 5 ou 6 paliers (Atlassian, Carbon, Material). Nous assumons l'inverse, par écrit.",
    src: [{ t: "Atlassian — Grid", h: "https://atlassian.design/foundations/grid-beta" }, { t: "Carbon — 2x Grid", h: "https://carbondesignsystem.com/elements/2x-grid/overview/" }] },
  { id: "y8", nom: "8", titre: "Les crans sont responsives — c'est le jeton qui varie, jamais l'écran",
    enonce: "Chaque cran peut résoudre une valeur différente selon le régime, ou glisser entre deux bornes — mais la variation vit dans la définition du jeton, une fois. Aucun écran ne redéfinit un cran.",
    pourquoi: "Sur petit écran, les espaces doivent pouvoir se resserrer sans casser la logique. Et si chaque écran bricolait ses valeurs, le système n'existerait plus.",
    src: [{ t: "GOV.UK — Spacing", h: "https://design-system.service.gov.uk/styles/spacing/" }] },
  { id: "y9", nom: "9", titre: "La géométrie d'espacement vit en rem",
    enonce: "Les jetons d'espacement s'expriment en rem (base 16). Restent en pixels, par décision explicite : la cible du doigt, les traits d'un pixel, la largeur d'écran minimale.",
    pourquoi: "Quand l'utilisateur agrandit le texte, les espaces qui l'entourent doivent suivre — sinon la page casse au premier réglage d'accessibilité.",
    src: [{ t: "WCAG 1.4.4 — Resize Text", h: "https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html" }] },
];

/* La correspondance des deux échelles — calculée en direct depuis TOKENS,
   jamais recopiée : décimales pour le CSS natif, grille 4-16 pour Tailwind. */
function Correspondance() {
  return (
    <div style={{ overflowX: "auto" }}>
      <table className="tableau mono">
        <thead><tr><th>cran</th><th>calculé (px, 320 → 1440)</th><th>Tailwind (accroché 4-16)</th></tr></thead>
        <tbody>
          {TOKENS.filter(([n]) => n.includes("inline-") || n.includes("block-")).map(([n, min, , , max]) => (
            <tr key={n}>
              <td>{n.replace("--rr-", "")}</td>
              <td>{(min * 16).toFixed(1)} → {(max * 16).toFixed(1)}</td>
              <td>{versTw(min * 16)} → {versTw(max * 16)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* Les règles vivent dans les dépliants « Règles & sources » de leur démonstration. */
function Regles({ ids }: { ids: string[] }) {
  return (
    <div style={{ display: "grid", gap: "var(--rr-block-xl)" }}>
      {ids.map((id) => REGLES.find((r) => r.id === id)!).map((r) => (
        <div key={r.id} style={{ display: "grid", gap: "var(--rr-block-sm)", maxWidth: "var(--t-mesure)" }}>
          <b style={{ color: "var(--p-encre)" }}><span className="badge">règle {r.nom}</span> {r.titre}</b>
          <span>{r.enonce}</span>
          {r.div && <div className="divergence" style={{ fontSize: "0.8125rem" }}>{r.div}</div>}
          <span style={{ fontSize: "0.8125rem" }}>Sources : {r.src.map((sc, i) => (
            <span key={sc.t}>{i > 0 && " · "}{sc.h === "#" ? sc.t : <a href={sc.h}>{sc.t}</a>}</span>
          ))}</span>
        </div>
      ))}
    </div>
  );
}

export default function Vue() {
  const [voir, setVoir] = useState(true);
  const { densite } = useDensite();
  const dec = densite === "compact" ? -1 : densite === "aere" ? 1 : 0;
  const [casseY1, setCasseY1] = useState(false);
  const [casseY2, setCasseY2] = useState(false);
  const [fw, setFw] = useState<"React" | "Angular" | "HTML">("HTML");
  const [styl, setStyl] = useState<"CSS natif" | "Tailwind">("CSS natif");
  const tw = styl === "Tailwind";

  return (
    <div className="coquille">
      <Navigation actif="rythme" />

      <main className="contenu">
        <div className="tete-page">
          <p className="kicker">Fondation · Le rythme (espacement)</p>
          <h1>Chaque distance de cette page a une raison</h1>
          <p className="chapo">
            Espacer, c&apos;est décider qui est lié à qui : quand une distance est
            arbitraire, la page ment. Ici, toute distance sort d&apos;une échelle unique, et
            <b> chaque règle porte son pourquoi, sa source vérifiable, et ses divergences
            assumées</b>. Sous chaque banc d&apos;essai, « Règles &amp; sources » se déplie.
          </p>
        </div>

        <section className="bloc-section">
          <p className="kicker">01 · L&apos;échelle</p>
          <h2>Chaque distance vient d&apos;une seule échelle</h2>
          <p className="sourd">Des distances décidées au cas par cas finissent par se
          contredire. Ici, chaque espace de cette carte est un jeton de l&apos;échelle commune,
          qui glisse entre deux bornes selon la largeur — « voir les espaces » les nomme par leur
          rôle — inset, stack, inline — et leur cran ; la poignée les fait vivre.</p>
          <Apercu outils={
            <button className={`bouton ${voir ? "on" : ""}`} onClick={() => setVoir(!voir)}>
              {voir ? "Masquer les espaces" : "Voir les espaces"}
            </button>
          } enfants={(l) => (
            <div style={{ ...jetons(l, tw, dec), width: "100%", display: "grid", justifyItems: "start", gap: "var(--rr-block-unit)" }}>
              <CarteAnnotee voir={voir} />
              <span className="mono sourd" style={{ fontSize: "0.6875rem" }}>
                à {Math.round(l)} px : padding {lirePx(l, "--rr-block-card", tw, dec)} px ·
                écart {lirePx(l, "--rr-block-md", tw, dec)} px{dec === -1 && " · compact : un cran plus bas"}{dec === 1 && " · aéré : un cran plus haut"}{tw && " · accroché à l'échelle Tailwind"}
              </span>
            </div>
          )} pied={
            <details className="prov"><summary>Règles &amp; sources</summary><div>
              <p>Toutes les distances sortent d&apos;<b>un générateur</b> : trois décisions entrent
              (unité de base, ratio, rayon), toute la géométrie sort, en deux axes (horizontal,
              vertical). Aucune valeur n&apos;est écrite à la main.</p>
              <Regles ids={["y8", "y9", "y3", "y7", "y4"]} />
            </div></details>
          } />
        </section>

        <section className="bloc-section">
          <p className="kicker">02 · La densité</p>
          <h2>Un mode compact qui reste dans le système</h2>
          <p className="sourd">Un « mode compact à 80 % » fabriquerait des valeurs hors
          système, introuvables au changement de marque. Ici, la densité (réglage à droite)
          décale chaque espace du site — cette page comprise — d&apos;exactement un cran sur
          l&apos;échelle commune. Ce qui ne bouge jamais : l&apos;ordre et la présence de
          chaque élément.</p>
          <details className="prov"><summary>Règles &amp; sources</summary><div>
            <p>Un « mode compact à 80 % » fabriquerait des valeurs hors échelle, introuvables au
            changement de marque. Un cran d&apos;écart, lui, reste dans le système.</p>
            <Regles ids={["y5", "y6"]} />
          </div></details>
        </section>

        <section className="bloc-section">
          <p className="kicker">03 · La proximité</p>
          <h2>Quand une distance ment, la page ment</h2>
          <p className="sourd">Plus deux éléments sont proches, plus leur lien perçu est fort —
          quand une distance ment, la page raconte autre chose. Un libellé équidistant flotte
          entre deux champs ; un titre mal espacé change de camp. Les deux casses le
          démontrent.</p>
          <Apercu outils={
            <>
              <button className={`bouton casse ${casseY1 ? "on" : ""}`} onClick={() => setCasseY1(!casseY1)}>
                {casseY1 ? "Réparer le libellé" : "Casser le libellé"}
              </button>
              <button className={`bouton casse ${casseY2 ? "on" : ""}`} onClick={() => setCasseY2(!casseY2)}>
                {casseY2 ? "Réparer le titre" : "Casser le titre"}
              </button>
            </>
          } enfants={(l) => (
            <div style={{ ...jetons(l, tw, dec), width: "100%", display: "grid", justifyItems: "start" }}><Proximite casseY1={casseY1} casseY2={casseY2} /></div>
          )} pied={
            <details className="prov"><summary>Règles &amp; sources</summary><div>
              <p>La loi de proximité (Gestalt), formulée presque mot pour mot par les grands
              systèmes — et la faute la plus fréquente des interfaces : des distances qui
              racontent autre chose que le contenu.</p>
              <Regles ids={["y1", "y2"]} />
            </div></details>
          } />
        </section>

        <section className="bloc-section">
          <p className="kicker">04 · L&apos;adaptation</p>
          <h2>Le même système, dans votre stack</h2>
          <p className="sourd">Un système normatif enfermé dans un framework n&apos;est
          qu&apos;une bibliothèque. Ici le normatif vit dans la règle et le jeton ; React,
          Angular ou HTML n&apos;en sont que des consommateurs — le même système, traduit.</p>
          <PanneauCode langage={styl} outils={
            <>{(["React", "Angular", "HTML"] as const).map((f) => (
              <button key={f} className={`bouton ${fw === f ? "on" : ""}`} onClick={() => setFw(f)}>{f}</button>
            ))}</>
          } code={SNIPPETS[fw][styl]} />
          <details className="prov"><summary>Règles &amp; sources</summary><div>
            <p>Le normatif, ici, c&apos;est <b>la règle et le jeton</b> — pas le code. Un seul
            calcul produit des variables CSS natives et une sortie Tailwind jumelle ; React,
            Angular ou HTML n&apos;en sont que des consommateurs.</p>
            <p><b>Deux échelles assumées</b> : le CSS natif garde les décimales calculées ;
            Tailwind s&apos;accroche à sa grille 4-16, valeurs arrondies, jamais de décimales.
            On ne mélange pas les deux — la correspondance, cran par cran :</p>
            <Correspondance />
          </div></details>
        </section>
      </main>

      <aside className="reglages">
        <h3>Theming &amp; playground</h3>
        <Densite />
        <div className="bloc">
          <span className="mono sourd">Adaptation</span>
          <div className="rang" style={{ gap: "var(--rr-inline-sm)" }}>
            {(["CSS natif", "Tailwind"] as const).map((s) => (
              <button key={s} className={`bouton ${styl === s ? "on" : ""}`} onClick={() => setStyl(s)}>{s}</button>
            ))}
          </div>
        </div>
        <p className="sourd" style={{ fontSize: "0.75rem" }}>La largeur se règle sur chaque banc
        (poignée, paliers, double-clic). Le thème arrivera avec sa fondation couleur.</p>
      </aside>
    </div>
  );
}
