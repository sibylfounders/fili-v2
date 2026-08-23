"use client";
import { useEffect, useRef, useState } from "react";
import { Navigation } from "../nav";

/* Les jetons du rythme — mêmes constantes que tokens.css (valeurs lues sur
   le générateur de référence à 320 et 1440, interpolées). La simulation de
   largeur recalcule chaque cran par la même formule. */
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

function jetonsSimules(largeurPx: number): Record<string, string> {
  const o: Record<string, string> = {};
  for (const [nom, min, c, k, max] of TOKENS) {
    const px = Math.min(max * 16, Math.max(min * 16, c * 16 + (k * largeurPx) / 100));
    o[nom] = `${px.toFixed(2)}px`;
  }
  return o;
}

function Cran({ nom }: { nom: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [px, setPx] = useState("…");
  useEffect(() => {
    const lire = () => {
      if (ref.current) setPx(`${ref.current.getBoundingClientRect().width.toFixed(1)} px`);
    };
    lire();
    const ro = new ResizeObserver(lire);
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return (
    <div className="rang" style={{ gap: "var(--rr-inline-unit)" }}>
      <span className="mono" style={{ width: "8.5rem", color: "var(--p-sourd)" }}>{nom.replace("--rr-", "")}</span>
      <div ref={ref} className="barre" style={{ width: `var(${nom})` }} />
      <span className="mono mesure">{px}</span>
    </div>
  );
}

function Densite({ compact }: { compact: boolean }) {
  const pad = compact ? "var(--rr-block-unit) var(--rr-inline-xl)" : "var(--rr-block-card) var(--rr-inline-2xl)";
  const gap = compact ? "var(--rr-block-sm)" : "var(--rr-block-md)";
  return (
    <div className="carte" style={{ padding: pad, gap, background: "var(--p-papier)" }}>
      <b>Léa Fontan</b>
      <span className="sourd">UX Designer — mêmes emplacements, même ordre, quelle que soit la densité.</span>
      <div className="rang">
        <button className="bouton">Message</button>
        <button className="bouton on">Suivre</button>
      </div>
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
    <div style={{ display: "grid", gap: "var(--rr-block-unit)" }}>
      <div className="rang">
        <button className={`bouton ${casseY1 ? "on" : ""}`} onClick={() => setCasseY1(!casseY1)}>
          {casseY1 ? "Réparer le libellé" : "Casser la règle 1 — libellé équidistant"}
        </button>
        <button className={`bouton ${casseY2 ? "on" : ""}`} onClick={() => setCasseY2(!casseY2)}>
          {casseY2 ? "Réparer le titre" : "Casser la règle 2 — titre qui flotte"}
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
      <p className="sourd" style={{ fontSize: "0.875em" }}>
        Cassé, l&apos;espace ment : le libellé semble appartenir au champ du dessus,
        le titre flotte entre deux blocs — et vous le voyez sans qu&apos;on vous l&apos;explique.
      </p>
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
    pourquoi: "La grille stricte des livres suppose des corps fixes ; forcer l'interligne dessus dégrade la lecture. Ici, la lisibilité prime, et l'exception se décide, elle ne se subit pas.",
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
    pourquoi: "Sur petit écran, les espaces doivent pouvoir se resserrer sans casser la logique. Et si chaque écran bricolait ses propres valeurs, le système n'existerait plus.",
    div: "Nous avions d'abord écrit l'inverse (des crans figés). Décision revue le 23 août 2026 : notre échelle de référence était déjà fluide, et la position de GOV.UK s'est révélée la bonne. Le changement est daté et motivé.",
    src: [{ t: "GOV.UK — Spacing", h: "https://design-system.service.gov.uk/styles/spacing/" }] },
  { id: "y9", nom: "9", titre: "La géométrie d'espacement vit en rem",
    enonce: "Les jetons d'espacement s'expriment en rem (base 16). Restent en pixels, par décision explicite : la cible du doigt, les traits d'un pixel, la largeur d'écran minimale.",
    pourquoi: "Quand l'utilisateur agrandit le texte, les espaces qui l'entourent doivent suivre — sinon la page casse au premier réglage d'accessibilité. Ce qui ne doit pas grandir est nommé, rien d'autre ne reste en pixels.",
    div: "Nous avions d'abord écrit l'inverse (espacement en pixels). Décision revue le 12 août 2026, vérifiée sur quatre-vingt-dix mesures.",
    src: [{ t: "WCAG 1.4.4 — Resize Text", h: "https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html" }] },
];

export default function Vue() {
  const [largeur, setLargeur] = useState<number | null>(null);
  const [compact, setCompact] = useState(false);
  const [fw, setFw] = useState<"React" | "Angular" | "HTML">("React");
  const [styl, setStyl] = useState<"CSS natif" | "Tailwind">("CSS natif");

  const simulation = largeur !== null ? (jetonsSimules(largeur) as React.CSSProperties) : undefined;
  const Scene = ({ children }: { children: React.ReactNode }) => (
    <div className="scene" style={largeur !== null ? { ...simulation, maxWidth: `${largeur}px` } : undefined}>
      {largeur !== null && <p className="mono sourd" style={{ margin: "0 0 var(--rr-block-unit)" }}>largeur simulée : {largeur} px</p>}
      {children}
    </div>
  );

  return (
    <div className="coquille">
      <Navigation actif="rythme" />

      <main className="contenu">
        <div>
          <p className="mono sourd">Fondation · Le rythme (espacement)</p>
          <h1>Chaque distance de cette page a une raison</h1>
          <p className="sourd" style={{ marginTop: "var(--rr-block-md)" }}>
            Cette page définit comment ce système espace les choses — et vous laisse
            voir chaque règle agir, la régler, et la casser. Ce qui la distingue des
            documentations habituelles : <b style={{ color: "var(--p-encre)" }}>chaque règle porte son pourquoi, sa source
            vérifiable, et l&apos;aveu daté de nos divergences</b> — y compris quand nous
            avons changé d&apos;avis. La colonne de droite de chaque section dit d&apos;où
            viennent les affirmations de gauche.
          </p>
        </div>

        <section className="section">
          <div className="doc">
            <h2>L&apos;échelle — des espacements qui respirent avec l&apos;écran</h2>
            <p className="sourd">Toutes les distances du système sortent d&apos;une seule échelle,
            en deux axes (horizontal, vertical). Chaque cran glisse entre deux bornes selon la
            largeur : utilisez le réglage « largeur simulée » à droite, ou redimensionnez la fenêtre.</p>
            <Scene>
              <div style={{ display: "grid", gap: "var(--rr-block-md)" }}>
                {["--rr-inline-xs", "--rr-inline-sm", "--rr-inline-unit", "--rr-inline-xl", "--rr-inline-lg", "--rr-inline-2xl", "--rr-block-unit", "--rr-block-card", "--rr-block-page"].map((c) => <Cran key={c} nom={c} />)}
              </div>
            </Scene>
          </div>
          <aside className="sources-col">
            <h4>D&apos;où viennent ces valeurs</h4>
            <p>D&apos;un <b>générateur</b> : trois décisions entrent (unité de base, ratio, rayon),
            toute la géométrie sort. Les valeurs de cette page ont été <b>lues mécaniquement</b> sur
            ce générateur à 320 et 1440 px — jamais recopiées à la main — puis interpolées. Écart
            d&apos;interpolation mesuré : moins d&apos;un pixel.</p>
            <div className="divergence">Échelle fluide : position adoptée de GOV.UK, contre notre
            premier choix — voir la règle 8 ci-dessous.</div>
            <p><a href="https://design-system.service.gov.uk/styles/spacing/">GOV.UK — Spacing</a> · <a href="https://spec.fm/specifics/8-pt-grid">la grille 8pt</a></p>
          </aside>
        </section>

        <section className="section">
          <div className="doc">
            <h2>La densité — un cran d&apos;écart, rien d&apos;autre</h2>
            <p className="sourd">Le réglage « densité » à droite décale les espacements d&apos;exactement
            un cran. Regardez ce qui ne change pas : l&apos;ordre et la présence de chaque élément.</p>
            <Scene><Densite compact={compact} /></Scene>
          </div>
          <aside className="sources-col">
            <h4>Pourquoi pas un pourcentage</h4>
            <p>Un « mode compact à 80 % » fabrique des valeurs hors échelle, introuvables au moment
            de changer la marque. Un cran d&apos;écart reste dans le système. <b>Décision interne,
            testée sur notre application témoin</b> avant d&apos;entrer ici.</p>
          </aside>
        </section>

        <section className="section">
          <div className="doc">
            <h2>La proximité — l&apos;espace est une information</h2>
            <p className="sourd">Plus deux éléments sont proches, plus leur lien perçu est fort.
            Cassez les deux règles ci-dessous et voyez la page mentir.</p>
            <Scene><Proximite /></Scene>
          </div>
          <aside className="sources-col">
            <h4>La preuve</h4>
            <p>C&apos;est la loi de proximité (Gestalt), formulée presque mot pour mot par les grands
            systèmes — et la faute la plus fréquente de nos audits : des pages déclarées parfaites
            portaient des dizaines de distances qui mentaient.</p>
            <p><a href="https://www.nngroup.com/articles/gestalt-proximity/">NN/g — Proximity Principle</a> · <a href="https://carbondesignsystem.com/elements/spacing/overview/">Carbon — Spacing</a> · <a href="https://polaris.shopify.com/design/layout">Polaris — Layout</a></p>
          </aside>
        </section>

        <section className="section">
          <div className="doc">
            <h2>Votre stack, pas la nôtre</h2>
            <p className="sourd">Les réglages « adaptation » à droite montrent le même cran consommé
            dans votre environnement — le choix est affiché ci-dessous.</p>
            <pre className="code">{SNIPPETS[fw][styl]}</pre>
          </div>
          <aside className="sources-col">
            <h4>Pourquoi c&apos;est possible</h4>
            <p>Le normatif, ici, c&apos;est <b>la règle et le jeton</b> — pas le code. Un seul calcul
            produit des variables CSS natives et une sortie Tailwind jumelle ; React, Angular ou HTML
            n&apos;en sont que des consommateurs. Changer de stack ne change rien au système.</p>
          </aside>
        </section>

        <div>
          <h2 style={{ marginBottom: "var(--rr-block-unit)" }}>Les neuf règles, avec leurs raisons</h2>
          <div style={{ display: "grid", gap: "var(--rr-block-card)" }}>
            {REGLES.map((r) => (
              <section key={r.id} id={r.id} className="section carte" style={{ background: "var(--p-papier)" }}>
                <div className="doc" style={{ gap: "var(--rr-block-md)" }}>
                  <b><span className="badge">règle {r.nom}</span> {r.titre}</b>
                  <span>{r.enonce}</span>
                  <span className="sourd">{r.pourquoi}</span>
                </div>
                <aside className="sources-col">
                  {r.div && <div className="divergence">{r.div}</div>}
                  <p>{r.src.map((s, i) => (
                    <span key={s.t}>{i > 0 && " · "}{s.h === "#" ? s.t : <a href={s.h}>{s.t}</a>}</span>
                  ))}</p>
                </aside>
              </section>
            ))}
          </div>
        </div>
      </main>

      <aside className="reglages">
        <h3>Theming &amp; playground</h3>
        <div className="bloc">
          <span className="mono sourd">Largeur simulée</span>
          <div className="rang" style={{ gap: "var(--rr-inline-sm)" }}>
            <button className={`bouton ${largeur === null ? "on" : ""}`} onClick={() => setLargeur(null)}>Fenêtre</button>
            <button className={`bouton ${largeur !== null ? "on" : ""}`} onClick={() => setLargeur(768)}>Simulée</button>
          </div>
          {largeur !== null && (
            <>
              <input type="range" min={320} max={1440} step={1} value={largeur} onChange={(e) => setLargeur(Number(e.target.value))} />
              <span className="mono mesure">{largeur} px</span>
            </>
          )}
        </div>
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
        <p className="sourd" style={{ fontSize: "0.75rem" }}>Ces réglages agissent sur toutes les
        démonstrations de la page. Le thème (couleurs) arrivera avec sa fondation.</p>
      </aside>
    </div>
  );
}
