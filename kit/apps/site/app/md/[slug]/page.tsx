import { ReglesCles } from "./regles-cles";
import { notFound } from "next/navigation";
import { fiche, nbCas, slugsDoctrine, type Fiche } from "@/lib/doctrine";
import { sujet } from "@/lib/md";
import { Markdown } from "../../components/markdown";
import { LienRetour } from "../../components/lien-retour";
import { DocTabs } from "../doc-tabs";
import { CasGrille } from "./cas-grille";
import { Preuves } from "./preuves";
import { Repliable } from "./repliable";
import { VoletDecisions } from "./volet-decisions";
import { DecisionsGrille } from "./decisions-grille";

export function generateStaticParams() {
  return slugsDoctrine().map((slug) => ({ slug }));
}

/** Illustration générée (SVG) ou démo du site source — conservée telle quelle, c'est une image. */
const Html = ({ html, className }: { html: string; className?: string }) => (
  <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
);

const Chapeau = ({ kicker, titre, lead }: { kicker: string; titre: string; lead: string }) => (
  <header className="mb-xl max-w-[70ch]">
    {kicker ? <p className="m-0 font-label text-xs font-semibold uppercase tracking-wider text-text-muted">{kicker}</p> : null}
    {titre ? <h2 className="m-0 mt-1 text-h3 font-semibold text-text-primary">{titre}</h2> : null}
    {lead ? <p className="mt-sm text-text-secondary">{lead}</p> : null}
  </header>
);

/* ── 01 · L'essentiel ─────────────────────────────────────────────────── */
function Essentiel({ f, ux }: { f: Fiche; ux?: string }) {
  const e = f.essentiel;
  return (
    <div className="flex flex-col gap-xl">
      {/* Manifeste — bandeau de la question UX, animation reprise du site DS-MD */}
      <section className="doctrine-manifeste">
        <div className="dm-texte">
          {e.kicker ? <p className="dm-kicker">{e.kicker}</p> : null}
          <p className="dm-question">{e.question}</p>
          {e.detail ? <p className="dm-detail">{e.detail}</p> : null}
        </div>
        <div className="dm-anim" aria-hidden="true">
          <span className="dm-orbite dm-orbite-a" />
          <span className="dm-orbite dm-orbite-b" />
          <span className="dm-pilule dm-pilule-a" />
          <span className="dm-pilule dm-pilule-b" />
          <span className="dm-pilule dm-pilule-c" />
          {f.embleme ? <span className="dm-icone" dangerouslySetInnerHTML={{ __html: f.embleme }} /> : null}
        </div>
      </section>

      {e.regles.length ? (
        <section>
          <h2 className="m-0 text-h4 font-semibold text-text-primary">{e.titreRegles || "Règles fondamentales"}</h2>
          <ReglesCles regles={e.regles} label={e.titreRegles || "Règles fondamentales"} />
        </section>
      ) : null}

      {e.preuves.length ? (
        <section>
          <Preuves preuves={e.preuves} label="Preuves chiffrées" />
        </section>
      ) : null}

      {ux ? (
        <Repliable titre="Lire la couche UX — le raisonnement complet" note={`${f.nom.toUpperCase()}-UX.md`}>
          <Markdown>{ux}</Markdown>
        </Repliable>
      ) : null}

      {e.rules.source ? (
        <Repliable titre="Contribution à l'IA" note={e.rules.nom}>
          <pre className="m-0 max-h-[28rem] overflow-auto rounded-md border border-border bg-surface p-md font-mono text-xs leading-relaxed text-text-secondary">
            {e.rules.source}
          </pre>
        </Repliable>
      ) : null}
    </div>
  );
}

/* ── 02 · Cas d'usage ─────────────────────────────────────────────────── */
function VoletCas({ f, inventaires }: { f: Fiche; inventaires?: string[] }) {
  return (
    <div>
      <Chapeau kicker="" titre="Où ces règles se jouent" lead={f.casChapeau.lead} />
      {f.cas.length === 0 ? (
        <p className="text-text-secondary">Aucun cas cartographié pour ce sujet — l'inventaire reste à écrire.</p>
      ) : (
        <div className="flex flex-col gap-2xl">
          {f.cas.map((fam, i) => (
            <section key={i}>
              <div className="flex flex-wrap items-end justify-between gap-lg">
                <div>
                  <p className="m-0 font-label text-xs font-semibold uppercase tracking-wider text-text-muted">{fam.kicker}</p>
                  <h3 className="m-0 mt-1 text-h4 font-semibold text-text-primary">{fam.titre}</h3>
                </div>
                {fam.visuel ? (
                  <Html html={fam.visuel} className="w-[20rem] max-w-full overflow-hidden rounded-md border border-border [&_svg]:block [&_svg]:h-auto [&_svg]:w-full" />
                ) : null}
              </div>
              <div className="mt-md">
                <CasGrille famille={fam.titre} cas={fam.cas} />
              </div>
            </section>
          ))}
        </div>
      )}
      {inventaires?.length ? (
        <div className="mt-2xl">
          <Repliable titre="Inventaire source — la carte de couverture" note={`inventaire-cas-usage-${f.slug}.md`}>
            {inventaires.map((inv, i) => (
              <Markdown key={i}>{inv}</Markdown>
            ))}
          </Repliable>
        </div>
      ) : null}
    </div>
  );
}

/* ── 03 · Spécifications ──────────────────────────────────────────────── */
function VoletSpecs({ f, ui }: { f: Fiche; ui?: string }) {
  const techniques = (f.decisions ?? []).filter((d) => d.couche === "ui");
  /* Cinq sujets n'ont rien à mettre ici — accessibility, cognitive-load, performance, laws,
     creation-compte. Le volet s'ouvrait alors sur du vide, ce qui se lit comme un oubli alors
     que c'est une décision : un principe transversal ou un flow n'a pas de couche UI, il
     coordonne des sujets qui, eux, en ont une. On le dit plutôt que de laisser deviner. */
  const rien =
    !f.specs.titre && !f.specs.lead && !f.specs.css &&
    f.specs.specimens.length === 0 && f.specs.tokens.length === 0 && techniques.length === 0;
  if (rien) {
    const parNature = f.nature === "Principe" || f.nature === "Flow";
    return (
      <div className="max-w-[70ch]">
        <h2 className="m-0 text-h3 font-semibold text-text-primary">Pas de couche UI</h2>
        <p className="mt-sm text-text-secondary">
          Ce sujet ne porte ni token, ni spécimen, ni consigne d&rsquo;implémentation
          {parNature ? (
            <>
              {" "}— et c&rsquo;est sa nature, pas un oubli : il déclare <code className="font-mono text-[13px]">companion: none</code>,
              il coordonne des sujets qui, eux, portent l&rsquo;implémentation. Ses valeurs concrètes
              sont celles de ces sujets, à lire chez eux.
            </>
          ) : (
            <> pour l&rsquo;instant. Si ce sujet en attend une, c&rsquo;est un trou de couverture à signaler.</>
          )}
        </p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-xl">
      <Chapeau kicker="" titre={f.specs.titre} lead={f.specs.lead} />
      {techniques.length ? (
        <section>
          <h3 className="m-0 text-h5 font-semibold text-text-primary">
            Consignes d'implémentation{" "}
            <span className="font-mono text-sm font-normal text-text-muted">{techniques.length}</span>
          </h3>
          <p className="mb-md mt-1 max-w-[70ch] text-sm text-text-secondary">
            Ce que le code doit faire. Chacune est citable par son identifiant en revue.
          </p>
          {/* Même objet, même lecture que le volet Règles : cartes cliquables, détail en superposé. */}
          <DecisionsGrille
            groupe="Consignes d'implémentation"
            decisions={techniques}
            regles={Object.fromEntries(
              techniques.map((d) => [
                d.id,
                <Markdown key={d.id} className="doc-prose text-sm [&>*:last-child]:mb-0">{d.solution}</Markdown>,
              ]),
            )}
          />
        </section>
      ) : null}
      {f.specs.css ? <style dangerouslySetInnerHTML={{ __html: f.specs.css }} /> : null}
      {f.specs.specimens.map((s, i) => (
        <Html key={i} html={s} className="doctrine-demo" />
      ))}
      {f.specs.tokens.length ? (
        <Repliable titre="Tokens résolus" note="table générée">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                {["Token", "Référence", "Valeur résolue"].map((t) => (
                  <th key={t} className="border border-border bg-surface px-sm py-1.5 text-left font-semibold">{t}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {f.specs.tokens.map((t, i) => (
                <tr key={i}>
                  <td className="border border-border px-sm py-1.5 font-mono text-xs">{t.token}</td>
                  <td className="border border-border px-sm py-1.5 font-mono text-xs text-text-secondary">{t.ref}</td>
                  <td className="border border-border px-sm py-1.5 font-mono text-xs">
                    <span className="flex items-center gap-sm">
                      {t.couleur ? (
                        <span className="inline-block size-3 shrink-0 rounded-xs border border-border" style={{ background: t.couleur }} />
                      ) : null}
                      {t.valeur}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Repliable>
      ) : null}
      {ui ? (
        <Repliable titre="Référence d'implémentation — spécifications détaillées" note={`${f.nom.toUpperCase()}-UI.md`}>
          <Markdown>{ui}</Markdown>
        </Repliable>
      ) : null}
    </div>
  );
}

/* ── 04 · Évolution ───────────────────────────────────────────────────── */
function VoletEvolution({ f }: { f: Fiche }) {
  return (
    <div>
      <Chapeau kicker="" titre="Comment ce sujet a évolué" lead="Ancienne règle → nouvelle règle → pourquoi : les arbitrages qui ont façonné ce sujet, datés." />
      {f.evolution.length === 0 ? (
        <p className="text-text-secondary">Aucun arbitrage journalisé pour ce sujet à ce jour.</p>
      ) : (
        <ol className="m-0 flex list-none flex-col gap-lg p-0">
          {f.evolution.map((d, i) => (
            <li key={i} className="border-l-2 border-border pl-lg">
              <p className="m-0 font-mono text-xs text-text-muted">{d.date}</p>
              <h3 className="m-0 mt-1 text-h5 font-semibold text-text-primary">{d.titre}</h3>
              <Html html={d.html} className="doc-prose mt-sm text-sm" />
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

/* ── page ─────────────────────────────────────────────────────────────── */
export default function SujetPage({ params }: { params: { slug: string } }) {
  const f = fiche(params.slug);
  if (!f) notFound();
  const s = sujet(params.slug);

  const volets = [
    { value: "essentiel", label: "L'essentiel", content: <Essentiel f={f} ux={s?.ux?.body} /> },
    ...(f.decisions?.length
      ? [
          {
            value: "regles",
            // le compte ne porte que la couche UX : les consignes techniques vivent dans Spécifications
            label: `Règles (${f.decisions.filter((d) => d.couche !== "ui").length})`,
            content: <VoletDecisions f={f} />,
          },
        ]
      : []),
    { value: "cas", label: `Situations${nbCas(f) ? ` (${nbCas(f)})` : ""}`, content: <VoletCas f={f} inventaires={s?.inventaires.map((i) => i.body)} /> },
    { value: "specs", label: "Spécifications", content: <VoletSpecs f={f} ui={s?.ui?.body} /> },
    { value: "evolution", label: "Évolution", content: <VoletEvolution f={f} /> },
  ];

  return (
    <main className="mx-auto max-w-container-default px-lg py-xl">
      <LienRetour href="/md/">← Doctrine</LienRetour>
      <div className="mt-md flex items-center gap-md">
        {f.embleme ? <Html html={f.embleme} className="shrink-0 [&_svg]:h-10 [&_svg]:w-10" /> : null}
        <h1 className="m-0 text-h2 font-semibold text-text-primary">{f.nom}</h1>
        <span className="rounded-pill border border-border px-sm py-0.5 font-label text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
          {f.nature}
        </span>
      </div>
      <p className="mt-sm font-mono text-[11px] text-text-muted">{f.meta}</p>
      {f.decisions?.length ? (
        <p className="mt-1 text-sm text-text-secondary">
          {f.decisions.filter((d) => d.couche !== "ui" && d.statut !== "methode").length} règles ·{" "}
          {f.decisions.filter((d) => d.couche !== "ui" && d.sources.length > 0).length} sourcées ·{" "}
          {f.decisions.filter((d) => d.couche === "ui").length} consignes d'implémentation
        </p>
      ) : null}
      <div className="mt-lg">
        <DocTabs items={volets} />
      </div>
    </main>
  );
}
