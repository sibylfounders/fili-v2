"use client";
import Link from "next/link";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { derived, contrast, PRIMARY_DEFAULTS } from "../derivation.mjs";
import { usePrimary } from "./primary";
import { SheetSite } from "./rail";
import { CATEGORIES, FAMILIES, OPEN, keyOf, pagesOf, firstOneOf, type Family } from "./pages";

/* ── LA PORTE (proposition HTML validée du 24 août, appliquée au kit).
   Deux terres d'emprunt, dites : la couverture de la charte (le
   dévoilement, le monogramme) ; le générateur Semantic Rhythm (on
   manipule une entrée, tout recalcule). Le moteur d'ici n'est pas une
   copie : c'est LE moteur du site — la puce choisie habille tout. ── */

const D_FILI = "M356.879 197C377.293 197 391.501 204.877 394.412 217.448C395.121 220.046 395.493 223.172 395.493 226.924C395.493 239.317 385.756 248.688 372.672 248.688C364.199 248.688 357.063 244.568 353.216 238.18C353.14 238.054 353.066 237.927 352.993 237.799C351.177 234.635 350.156 230.938 350.156 226.924C350.156 216.714 356.765 208.556 366.239 205.999C363.899 203.331 360.302 201.836 355.368 201.836C339.045 201.836 329.977 216.043 321.514 257.453L317.584 277.101H338.67L391.566 277.101V391.962C391.566 411.912 393.682 417.655 407.889 424.305V424.909H340.181V424.305C354.387 417.655 356.503 411.912 356.503 391.962V310.35C356.503 298.163 355.002 290.617 349.615 284.96H316.073L281.917 424.909C270.128 472.97 248.668 493.222 213 494.733V494.128C232.345 485.363 242.018 452.113 253.202 404.355L280.406 284.96H260.456L261.06 282.542L282.521 275.892L286.451 261.987C299.146 218.461 321.514 197 356.879 197ZM430.349 381C417.664 381 408 390.472 408 403C408 415.528 417.664 425 430.349 425C443.336 425 453 415.528 453 403C453 390.472 443.336 381 430.349 381Z";

function Monogram({ style }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox="211 195 244 301.7" fill="currentColor" aria-hidden="true" style={style}>
      <path fillRule="evenodd" d={D_FILI} />
    </svg>
  );
}

const TRIALS: { hex: string; name: string }[] = [
  { hex: "#1DB954", name: "Un vert franc" },
  { hex: "#E50914", name: "Un rouge vif" },
  { hex: "#BE38F3", name: "Un violet moyen — le cas limite" },
];

/* ── Les spécimens des fondations ouvertes — un par page, dessiné ICI, jamais
   une vignette : la typographie montre son échelle, le rythme ses crans, la
   couleur ses couples, l'arrondi sa profondeur, la composition le chemin de
   l'œil, le mouvement sa courbe. Une page sans spécimen le dit à sa place
   au lieu de faire semblant. Clé = le chemin de la page sans sa barre. ── */
const SPECIMENS: Record<string, React.ReactNode> = {
  typo: (
    <div className="acc-sp-typo" aria-hidden="true">
      <span style={{ fontSize: "var(--font-size-display)" }}>Aa</span>
      <span style={{ fontSize: "var(--font-size-h2)" }}>Aa</span>
      <span style={{ fontSize: "var(--font-size-h3)", color: "var(--text-secondary)" }}>Aa</span>
      <span style={{ fontSize: "var(--font-size-body)", color: "var(--text-secondary)" }}>Aa</span>
      <span style={{ fontSize: "var(--font-size-small)", color: "var(--text-secondary)" }}>Aa</span>
    </div>
  ),
  rhythm: (
    <div className="acc-sp-rhythm" aria-hidden="true">
      <i style={{ width: "18%" }} /><i style={{ width: "30%" }} /><i style={{ width: "46%" }} /><i style={{ width: "68%" }} /><i style={{ width: "100%" }} />
    </div>
  ),
  color: (
    <div className="acc-sp-color" aria-hidden="true">
      <i><b style={{ background: "var(--primary)" }} /><b style={{ background: "var(--primary-subtle)" }} /></i>
      <i><b style={{ background: "var(--danger)" }} /><b style={{ background: "var(--danger-subtle)" }} /></i>
      <i><b style={{ background: "var(--success)" }} /><b style={{ background: "var(--success-subtle)" }} /></i>
    </div>
  ),
  /* Trois boîtes emboîtées : chaque coin intérieur se DÉDUIT du coin de son
     parent moins la marge — personne ne le choisit. Les rayons sont ceux du
     kit (r-1 → r-2 → r-3), la profondeur se lit dans la cascade des coins. */
  rounded: (
    <div className="acc-sp-rounded" aria-hidden="true">
      <i><i><i /></i></i>
    </div>
  ),
  /* Le chemin de l'œil sur une page : un titre, deux lignes, un bloc — et le
     tracé en F qui les relie, dans l'ordre où l'œil les prend. */
  composition: (
    <div className="acc-sp-compo" aria-hidden="true">
      <span className="acc-sp-compo-block" style={{ width: "62%" }} />
      <span className="acc-sp-compo-block" style={{ width: "88%" }} />
      <span className="acc-sp-compo-block" style={{ width: "40%" }} />
      <svg className="acc-sp-compo-trace" viewBox="0 0 100 60" preserveAspectRatio="none">
        <path d="M4 8 H62 M4 8 V52 M4 30 H88 M4 52 H40" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="not-scaling-stroke" />
        <circle cx="4" cy="8" r="3" fill="currentColor" />
      </svg>
    </div>
  ),
  /* La courbe du kit — la sortie qui freine — et ses quatre durées posées
     dessus comme quatre repères : la matière du mouvement tient en un trait. */
  motion: (
    <div className="acc-sp-motion" aria-hidden="true">
      <svg viewBox="0 0 100 60" preserveAspectRatio="none">
        <path d="M2 58 C 20 2, 40 2, 98 2" fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" vectorEffect="not-scaling-stroke" />
        <circle cx="14" cy="34" r="2.5" fill="currentColor" />
        <circle cx="27" cy="16" r="2.5" fill="currentColor" />
        <circle cx="42" cy="7" r="2.5" fill="currentColor" />
        <circle cx="98" cy="2" r="2.5" fill="currentColor" />
      </svg>
    </div>
  ),
};

/* Une famille ouvre le menu sur SA catégorie quand aucune de ses pages n'est
   ouverte : un lien qui n'a pas de destination n'est pas un lien. Fondations
   mène à sa première page ouverte. Le jour où Méthode a une page, son nom y
   mène tout seul — la liste décide, pas cette page. */
function Access({ family, category, open }: {
  family: Family; category: string;
  open: (key: string, since: HTMLElement) => void;
}) {
  const firstOne = firstOneOf(family);
  if (firstOne) return <Link className="acc-access-link" href={firstOne.path!}>{family.name}</Link>;
  return (
    <button className="acc-access-link" type="button" aria-haspopup="dialog"
      title={`${family.name} — pas encore de page : ouvre le menu`}
      onClick={(e) => open(category, e.currentTarget)}>
      {family.name}
    </button>
  );
}

/* Le nombre de fondations ouvertes se dit en lettres — et se lit dans la liste. */
const WORDS = ["aucune", "une", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze"];

const fmt = (r: number) => (Math.round(r * 100) / 100).toFixed(2).replace(".", ",");

export default function Home() {
  const { primary, changer } = usePrimary();
  const pal = useMemo(() => derived(primary) as unknown as {
    light: Record<string, string>;
    meta: { input: string; flat: string; flatAdjusted: boolean };
  }, [primary]);
  /* Les mesures ne se rendent qu'au client : la primaire mémorisée n'est
     connue qu'après l'hydratation. */
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  /* La feuille du menu, ouverte depuis la couverture sur un onglet donné. */
  const [sheet, setSheet] = useState("");
  const anchor = useRef<HTMLElement>(null!);
  const openSheet = (key: string, since: HTMLElement) => { anchor.current = since; setSheet(key); };
  const closeSheet = () => setSheet("");
  const categories = CATEGORIES.filter((c) => c.families);

  const rFlat = contrast(pal.light["on-primary"], pal.light.primary) as number;
  const rPage = contrast(pal.light["text-primary"], pal.light.bg) as number;
  const rSoft = contrast(pal.light["on-primary-subtle"], pal.light["primary-subtle"]) as number;

  return (
    <div className="accueil">

      <header className="acc-cover acc-column">
        <div className="acc-cover-head acc-fade" style={{ ["--i" as string]: 0 }}>
          <Monogram style={{ height: "1.9rem", width: "auto", color: "var(--primary)" }} />
          <b>FILI</b>
        </div>
        <div className="acc-cover-body">
          <p className="kicker acc-rise" style={{ ["--i" as string]: 1 }}><span>Le kit — {WORDS[OPEN.length] ?? OPEN.length} fondations ouvertes, un moteur</span></p>
          <h1>
            <span className="acc-rise" style={{ ["--i" as string]: 2 }}><span>Ce kit ne se décrit pas.</span></span>
            <span className="acc-rise" style={{ ["--i" as string]: 3 }}><span>Il se prouve.</span></span>
          </h1>
          <span className="acc-point acc-pop" style={{ ["--i" as string]: 4 }} aria-hidden="true" />
          <p className="acc-lede acc-fade" style={{ ["--i" as string]: 5 }}><b>Chaque affirmation de ce site est
          mesurée sur la page que vous lisez.</b> La typographie, le rythme, la couleur — et un
          moteur : une décision d&apos;entrée, tout le système sort.</p>
          {/* L'accès direct au reste de la doc, sans scroller (verdict
              d'Auteur, 7 septembre) : deux catégories, six familles, dans
              l'ordre d'Auteur. UNE GRILLE, pas deux rangées : la colonne des
              repères et la colonne des familles s'alignent par construction.
              Les catégories parlent mono (des repères), les familles parlent
              sans (des destinations) — la règle du menu. Aucune mention
              répétée : une famille qui a une page est en encre pleine, une
              famille sans page est en encre seconde et ouvre le menu — la
              nature du signe dit le rôle, une seule légende le confirme
              (relu contre les lois de /composition : écarts tous égaux, un
              habit un rôle, la rupture partout, trois départs — 7 septembre). */}
          <nav className="acc-access acc-fade" style={{ ["--i" as string]: 6 }}
            aria-label="Les grandes parties du kit">
            {categories.map((c) => (
              <Fragment key={c.key}>
                <span className="acc-access-cat">{c.name}</span>
                <span className="acc-access-list">
                  {c.families!.map((f) => (
                    <Access key={f.name} family={f} category={c.key} open={openSheet} />
                  ))}
                </span>
              </Fragment>
            ))}
            <p className="acc-access-caption">Les familles en encre seconde n&apos;ont pas encore
            de page : elles ouvrent le menu.</p>
          </nav>
        </div>
        <p className="acc-cover-foot kicker acc-fade" style={{ ["--i" as string]: 7 }}>Design ops &amp; code governance · corpus vivant</p>
      </header>

      <main>

        <section className="acc-sec acc-column" id="engine">
          <div className="acc-sec-head">
            <p className="kicker">01 · Le moteur</p>
            <h2>Une décision entre. Tout sort.</h2>
            <p className="muted">Choisissez une couleur : tout le site — fonds, encres, gammes —
            se recalcule sous vos yeux, et les rapports de contraste se mesurent à l&apos;instant
            même. Si votre couleur ne peut pas porter son encre, l&apos;aplat glisse d&apos;un
            cran — et il le dit.</p>
          </div>
          <div className="acc-sec-body">
            <div className="acc-mo">
              <div className="acc-mo-rail" role="group" aria-label="Choisir une couleur de marque">
                <button className="acc-mo-chip" title="Fili — la charte"
                  aria-pressed={primary === PRIMARY_DEFAULTS}
                  onClick={() => changer(PRIMARY_DEFAULTS)}>
                  <Monogram style={{ width: "1.5rem", height: "1.5rem", color: "var(--primary)" }} />
                </button>
                {TRIALS.map((e) => (
                  <button key={e.hex} className="acc-mo-chip" title={e.name}
                    aria-pressed={primary === e.hex}
                    onClick={() => changer(e.hex)}>
                    <span className="acc-dot" style={{ background: e.hex }} />
                  </button>
                ))}
                <label className="acc-mo-chip" title="Votre couleur">
                  <span className="acc-dot" style={{ background: "conic-gradient(#F43F5E, #F59E0B, #22C55E, #06B6D4, #6366F1, #F43F5E)" }} />
                  <input type="color" value={primary} onChange={(e) => changer(e.target.value)}
                    aria-label="Choisir votre couleur de marque" />
                </label>
              </div>
              <div className="acc-mo-scene">
                <div className="acc-mo-duo">
                  <div className="acc-mo-card" style={{ background: "var(--primary)", color: "var(--on-primary)" }}>
                    <Monogram style={{ height: "clamp(3rem, 6vw, 4.2rem)", width: "auto" }} />
                    <b>L&apos;aplat porte son encre</b>
                  </div>
                  <div className="acc-mo-card" style={{ background: "var(--primary-subtle)", color: "var(--on-primary-subtle)" }}>
                    <Monogram style={{ height: "clamp(3rem, 6vw, 4.2rem)", width: "auto", color: "var(--primary)" }} />
                    <b>Le fond doux murmure</b>
                  </div>
                </div>
                {ready && (
                  <div className="acc-mo-measures" aria-live="polite">
                    <span className="badge"><span className="acc-bullet" style={{ background: pal.light["on-primary"] }} />encre sur aplat · {fmt(rFlat)}:1 — mesuré à l&apos;instant</span>
                    <span className="badge"><span className="acc-bullet" style={{ background: pal.light["text-primary"] }} />encre de page sur blanc · {fmt(rPage)}:1 — mesuré à l&apos;instant</span>
                    <span className="badge"><span className="acc-bullet" style={{ background: pal.light["on-primary-subtle"] }} />encre douce sur fond doux · {fmt(rSoft)}:1 — mesuré à l&apos;instant</span>
                    {pal.meta.flatAdjusted && (
                      <span className="badge acc-says">aplat glissé : {pal.meta.input} → {pal.meta.flat} — dit, jamais tu</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="acc-sec acc-column" id="fondations">
          <div className="acc-sec-head">
            <p className="kicker">02 · Les fondations ouvertes</p>
            <h2>Chacune parle sa langue</h2>
            <p className="muted">Pas de vignettes : des spécimens. La typographie montre son
            échelle, le rythme ses crans, la couleur ses couples — trois secondes chacune,
            puis la page complète. Une carte par page ouverte : la liste des pages décide,
            cette page suit.</p>
          </div>
          <div className="acc-sec-body">
            <div className="acc-backgrounds">
              {OPEN.map((pg) => {
                const key = keyOf(pg)!;
                return (
                  <Link key={key} className="acc-background" href={pg.path!}>
                    <p className="kicker">Fondation{pg.state ? ` · ${pg.state}` : ""}</p>
                    <h3>{pg.name}</h3>
                    <div className="acc-background-specimen">
                      {SPECIMENS[key] ?? <span className="acc-sp-missing">spécimen à dessiner</span>}
                    </div>
                    <p>{pg.says}</p>
                    <span className="acc-background-link">Lire la fondation →</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="acc-sec acc-column" id="card">
          <div className="acc-sec-head">
            <p className="kicker">03 · La carte du système</p>
            <h2>Où en est le kit</h2>
            <p className="muted">Un sujet n&apos;avance pas tant que le précédent n&apos;est pas
            verrouillé — la carte fait foi.</p>
          </div>
          <div className="acc-sec-body">
            <div className="acc-card">
              <table>
                <thead><tr><th>Famille</th><th>Pages ouvertes</th><th>À venir</th></tr></thead>
                <tbody>
                  {FAMILIES.map((f) => {
                    const pages = pagesOf(f);
                    const open = pages.filter((pg) => pg.path);
                    const wait = pages.length - open.length;
                    return (
                      <tr key={f.name}>
                        <td>{f.name}</td>
                        <td className="acc-card-pages">
                          {open.length
                            ? open.map((pg) => (
                                <Link key={pg.name} href={pg.path!}>
                                  <span className="acc-state">{pg.state ?? "⚪"}</span> {pg.name}
                                </Link>
                              ))
                            : <span className="muted">— aucune encore</span>}
                        </td>
                        <td>{wait ? `${wait} page${wait > 1 ? "s" : ""}` : "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="muted" style={{ fontSize: "var(--font-size-small)" }}>Ce tableau est lu dans la
            liste des pages du kit : il ne peut pas être en retard sur le menu. ⚪ idée ·
            🟡 en cours · 🟢 verrouillé — l&apos;état est écrit à chaque verdict, jamais deviné.</p>
            <details className="prov"><summary>Règles &amp; sources</summary><div>
              <p>La couverture et son dévoilement reprennent la charte Fili (planche couverture,
              monogramme, rise-masks). L&apos;objet vivant reprend le principe du générateur
              Semantic Rhythm : on manipule une entrée, tout recalcule — ici c&apos;est le vrai
              moteur du site (kit/derivation.mjs), pas une maquette. Le gabarit suit le relevé
              « documentaire nu » du 24 août — un principe porteur par page, rails nus, un seul
              geste de couleur.</p>
            </div></details>
          </div>
        </section>

      </main>

      <SheetSite page="accueil" open={sheet !== ""} close={closeSheet}
        anchor={anchor} tab={sheet || undefined} />
    </div>
  );
}
