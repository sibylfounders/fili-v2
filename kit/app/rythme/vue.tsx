"use client";
import { useState } from "react";
import { Navigation } from "../nav";
import { Apercu, PanneauCode } from "../apercu";

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

function jetons(largeurPx: number, tw = false): React.CSSProperties {
  const o: Record<string, string> = {};
  for (const [nom, min, c, k, max] of TOKENS) {
    const px = Math.min(max * 16, Math.max(min * 16, c * 16 + (k * largeurPx) / 100));
    o[nom] = tw ? `${versTw(px)}px` : `${px.toFixed(2)}px`;
  }
  return o as React.CSSProperties;
}
const lirePx = (largeur: number, nom: string, tw = false) => {
  const t = TOKENS.find(([n]) => n === nom)!;
  const px = Math.min(t[4] * 16, Math.max(t[1] * 16, t[2] * 16 + (t[3] * largeur) / 100));
  return tw ? String(versTw(px)) : px.toFixed(1);
};

/* Un espace rendu visible : c'est un VRAI espace de la carte (il porte le jeton),
   pas une illustration — l'interrupteur ne fait que le colorer. */
function E({ j, h, voir }: { j: string; h?: boolean; voir: boolean }) {
  return <span className={`espace ${h ? "h" : ""} ${voir ? "vu" : ""}`}
    data-nom={voir ? j.replace("--rr-", "") : undefined}
    style={h ? { width: `var(${j})` } : { height: `var(${j})` }} />;
}

/* La carte annotée — construite avec des blocs d'espace explicites. */
function CarteAnnotee({ voir, compact }: { voir: boolean; compact: boolean }) {
  const padV = compact ? "--rr-block-unit" : "--rr-block-card";
  const padH = compact ? "--rr-inline-xl" : "--rr-inline-2xl";
  const freres = compact ? "--rr-block-sm" : "--rr-block-md";
  const Ligne = ({ children }: { children: React.ReactNode }) => (
    <span style={{ display: "flex", alignItems: "stretch" }}>
      <E j={padH} h voir={voir} /><span style={{ flex: 1, minWidth: 0 }}>{children}</span><E j={padH} h voir={voir} />
    </span>
  );
  return (
    <div className="carte-demo">
      <E j={padV} voir={voir} />
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
      <E j={padV} voir={voir} />
    </div>
  );
}

function Proximite() {
  const [casseY1, setCasseY1] = useState(false);
  const [casseY2, setCasseY2] = useState(false);
  const labelMarge = casseY1
    ? { marginBottom: "var(--rr-block-card)", marginTop: "var(--rr-block-card)" }
    : { marginBottom: "var(--rr-block-md)", marginTop: "var(--rr-block-card)" };
  const titreMarges = casseY2
    ? { marginTop: "var(--rr-block-unit)", marginBottom: "var(--rr-block-unit)" }
    : { marginTop: "var(--rr-block-page)", marginBottom: "var(--rr-block-md)" };
  return (
    <div style={{ display: "grid", gap: "var(--rr-block-unit)", width: "100%", maxWidth: "26rem" }}>
      <div className="rang">
        <button className={`bouton ${casseY1 ? "on" : ""}`} onClick={() => setCasseY1(!casseY1)}>
          {casseY1 ? "Réparer le libellé" : "Casser le libellé"}
        </button>
        <button className={`bouton ${casseY2 ? "on" : ""}`} onClick={() => setCasseY2(!casseY2)}>
          {casseY2 ? "Réparer le titre" : "Casser le titre"}
        </button>
      </div>
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
    "CSS natif": `<div style={{ gap: 'var(--rr-inline-unit)' }}>\n  …\n</div>`,
    Tailwind: `// tailwind.config : theme.extend.spacing = rythme.spacing\n<div className="gap-inline-unit">\n  …\n</div>`,
  },
  Angular: {
    "CSS natif": `<div [style.gap]="'var(--rr-inline-unit)'">\n  …\n</div>`,
    Tailwind: `<!-- même config tailwind, mêmes variables -->\n<div class="gap-inline-unit">\n  …\n</div>`,
  },
  HTML: {
    "CSS natif": `<div style="gap: var(--rr-inline-unit)">\n  …\n</div>`,
    Tailwind: `<div class="gap-inline-unit">\n  …\n</div>`,
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
    pourquoi: "Un « ×0,8 » fabrique des valeurs hors échelle, invisibles au changement de marque. Un cran d'écart reste dans le système — décision testée sur notre application témoin.",
    src: [{ t: "Décision interne, testée (12 août 2026)", h: "#" }] },
  { id: "y6", nom: "6", titre: "La densité ne change jamais la structure",
    enonce: "L'ordre des emplacements et la présence des éléments restent identiques d'une densité à l'autre.",
    pourquoi: "Un mode compact qui masque ou réordonne, c'est deux produits dans un — et un apprentissage cassé.",
    src: [{ t: "Décision interne", h: "#" }] },
  { id: "y7", nom: "7", titre: "Deux régimes, un seul seuil",
    enonce: "Mobile et desktop, séparés par un seuil de largeur unique.",
    pourquoi: "On n'ajoute pas des paliers par imitation : un troisième régime naîtra d'un besoin réel, documenté et daté.",
    div: "La plupart des grands systèmes ont 5 ou 6 paliers (Atlassian, Carbon, Material). Nous assumons l'inverse, par écrit.",
    src: [{ t: "Atlassian — Grid", h: "https://atlassian.design/foundations/grid-beta" }, { t: "Carbon — 2x Grid", h: "https://carbondesignsystem.com/elements/2x-grid/overview/" }] },
  { id: "y8", nom: "8", titre: "Les crans sont responsives — c'est le jeton qui varie, jamais l'écran",
    enonce: "Chaque cran peut résoudre une valeur différente selon le régime, ou glisser entre deux bornes — mais la variation vit dans la définition du jeton, une fois. Aucun écran ne redéfinit un cran.",
    pourquoi: "Sur petit écran, les espaces doivent pouvoir se resserrer sans casser la logique. Et si chaque écran bricolait ses valeurs, le système n'existerait plus.",
    div: "Nous avions d'abord écrit l'inverse (des crans figés). Décision revue le 23 août 2026 : notre échelle de référence était déjà fluide, et la position de GOV.UK s'est révélée la bonne. Le changement est daté et motivé.",
    src: [{ t: "GOV.UK — Spacing", h: "https://design-system.service.gov.uk/styles/spacing/" }] },
  { id: "y9", nom: "9", titre: "La géométrie d'espacement vit en rem",
    enonce: "Les jetons d'espacement s'expriment en rem (base 16). Restent en pixels, par décision explicite : la cible du doigt, les traits d'un pixel, la largeur d'écran minimale.",
    pourquoi: "Quand l'utilisateur agrandit le texte, les espaces qui l'entourent doivent suivre — sinon la page casse au premier réglage d'accessibilité.",
    div: "Nous avions d'abord écrit l'inverse (espacement en pixels). Décision revue le 12 août 2026, vérifiée sur quatre-vingt-dix mesures.",
    src: [{ t: "WCAG 1.4.4 — Resize Text", h: "https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html" }] },
];

/* Les règles vivent dans les dépliants « d'où ça vient » de leur démonstration. */
function Regles({ ids }: { ids: string[] }) {
  return (
    <div style={{ display: "grid", gap: "var(--rr-block-unit)" }}>
      {ids.map((id) => REGLES.find((r) => r.id === id)!).map((r) => (
        <div key={r.id} style={{ display: "grid", gap: "var(--rr-block-xs)" }}>
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
  const [compact, setCompact] = useState(false);
  const [fw, setFw] = useState<"React" | "Angular" | "HTML">("React");
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
            Cette page définit comment ce système espace les choses — et vous laisse voir
            chaque règle agir, la régler, et la casser. <b>Chaque règle porte son pourquoi,
            sa source vérifiable, et l&apos;aveu daté de nos divergences</b> — y compris
            quand nous avons changé d&apos;avis. Sous chaque banc d&apos;essai,
            « d&apos;où ça vient » se déplie.
          </p>
        </div>

        <section className="bloc-section">
          <p className="kicker">01 · L&apos;échelle</p>
          <h2>L&apos;échelle vit — tirez la poignée</h2>
          <p className="sourd">Cette carte est construite avec les vrais espaces du système.
          Redimensionnez la feuille : chaque distance glisse entre ses deux bornes, et
          « voir les espaces » les colore, avec leur nom.</p>
          <Apercu outils={
            <button className={`bouton ${voir ? "on" : ""}`} onClick={() => setVoir(!voir)}>
              {voir ? "Masquer les espaces" : "Voir les espaces"}
            </button>
          } enfants={(l) => (
            <div style={{ ...jetons(l, tw), width: "100%", display: "grid", justifyItems: "start", gap: "var(--rr-block-unit)" }}>
              <CarteAnnotee voir={voir} compact={compact} />
              <span className="mono sourd" style={{ fontSize: "0.6875rem" }}>
                à {Math.round(l)} px : padding {lirePx(l, compact ? "--rr-block-unit" : "--rr-block-card", tw)} px ·
                écart {lirePx(l, compact ? "--rr-block-sm" : "--rr-block-md", tw)} px{tw && " · accroché à l'échelle Tailwind"}
              </span>
            </div>
          )} pied={
            <details className="prov"><summary>D&apos;où ça vient</summary><div>
              <p>Toutes les distances sortent d&apos;<b>un générateur</b> : trois décisions entrent
              (unité de base, ratio, rayon), toute la géométrie sort, en deux axes (horizontal,
              vertical). Les valeurs de cette page ont été <b>lues mécaniquement</b> sur ce
              générateur à 320 et 1440 px — jamais recopiées — puis interpolées (écart mesuré :
              moins d&apos;un pixel).</p>
              <Regles ids={["y8", "y9", "y3", "y7", "y4"]} />
            </div></details>
          } />
        </section>

        <section className="bloc-section">
          <p className="kicker">02 · La densité</p>
          <h2>La densité — un cran d&apos;écart, rien d&apos;autre</h2>
          <p className="sourd">Le réglage « densité » (à droite) décale chaque espace de la carte
          ci-dessus d&apos;exactement un cran. Activez « voir les espaces » et regardez-les changer —
          et remarquez ce qui ne change pas : l&apos;ordre et la présence de chaque élément.</p>
          <details className="prov"><summary>D&apos;où ça vient</summary><div>
            <p>Un « mode compact à 80 % » fabriquerait des valeurs hors échelle, introuvables au
            changement de marque. Un cran d&apos;écart reste dans le système — décision testée sur
            notre application témoin avant d&apos;entrer ici.</p>
            <Regles ids={["y5", "y6"]} />
          </div></details>
        </section>

        <section className="bloc-section">
          <p className="kicker">03 · La proximité</p>
          <h2>La proximité — l&apos;espace est une information</h2>
          <p className="sourd">Plus deux éléments sont proches, plus leur lien perçu est fort.
          Cassez les deux règles et voyez la page mentir — l&apos;œil vous le dira avant nous.</p>
          <Apercu enfants={(l) => (
            <div style={{ ...jetons(l, tw), width: "100%", display: "grid", justifyItems: "start" }}><Proximite /></div>
          )} pied={
            <details className="prov"><summary>D&apos;où ça vient</summary><div>
              <p>La loi de proximité (Gestalt), formulée presque mot pour mot par les grands
              systèmes — et la faute la plus fréquente de nos audits : des pages déclarées
              parfaites portaient des dizaines de distances qui mentaient.</p>
              <Regles ids={["y1", "y2"]} />
            </div></details>
          } />
        </section>

        <section className="bloc-section">
          <p className="kicker">04 · L&apos;adaptation</p>
          <h2>Votre stack, pas la nôtre</h2>
          <p className="sourd">Le réglage « adaptation » (à droite) traduit le même cran dans
          votre environnement — copiez, c&apos;est le même système.</p>
          <PanneauCode langage={`${fw} · ${styl}`} code={SNIPPETS[fw][styl]} />
          <details className="prov"><summary>D&apos;où ça vient</summary><div>
            <p>Le normatif, ici, c&apos;est <b>la règle et le jeton</b> — pas le code. Un seul
            calcul produit des variables CSS natives et une sortie Tailwind jumelle ; React,
            Angular ou HTML n&apos;en sont que des consommateurs.</p>
          </div></details>
        </section>
      </main>

      <aside className="reglages">
        <h3>Theming &amp; playground</h3>
        <div className="bloc">
          <span className="mono sourd">Densité</span>
          <div className="rang" style={{ gap: "var(--rr-inline-sm)" }}>
            <button className={`bouton ${!compact ? "on" : ""}`} onClick={() => setCompact(false)}>Confortable</button>
            <button className={`bouton ${compact ? "on" : ""}`} onClick={() => setCompact(true)}>Compact</button>
          </div>
        </div>
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
        <p className="sourd" style={{ fontSize: "0.75rem" }}>La largeur se règle sur chaque banc
        (poignée, paliers, double-clic). Le thème arrivera avec sa fondation couleur.</p>
      </aside>
    </div>
  );
}
