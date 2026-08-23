import { socleDoc, socleIndex } from "@/lib/md";
import { Markdown } from "../../components/markdown";
import { LienRetour } from "../../components/lien-retour";
import { DocTabs } from "../doc-tabs";

/**
 * Socle — DESIGN, DECISIONS et MÉTHODE en une seule page à volets : trois fichiers d'un
 * même objet (le noyau du système), pas trois destinations. Rangé sous Méthode.
 */
export default function SoclePage() {
  const volets = socleIndex()
    .map((d) => ({ entree: d, doc: socleDoc(d.slug) }))
    .filter((v) => v.doc)
    .map(({ entree, doc }) => ({
      value: entree.slug,
      label: entree.titre,
      content: (
        <div>
          <p className="m-0 mb-lg max-w-[70ch] text-text-secondary">{entree.sous}</p>
          {doc!.meta.version ? (
            <p className="m-0 mb-lg font-mono text-[11px] text-text-muted">v{doc!.meta.version}</p>
          ) : null}
          <Markdown>{doc!.body}</Markdown>
        </div>
      ),
    }));

  return (
    <main className="mx-auto max-w-container-default px-lg py-xl">
      <LienRetour href="/md/">← Doctrine</LienRetour>
      <div className="mt-md flex flex-wrap items-baseline gap-sm">
        <h1 className="m-0 text-h2 font-semibold text-text-primary">Socle</h1>
        <span className="font-label text-xs font-semibold uppercase tracking-wide text-text-secondary">Méthode</span>
      </div>
      <p className="mt-sm max-w-[70ch] text-text-secondary">
        Le noyau du système : les valeurs derrière les tokens, le journal des arbitrages, et le pipeline
        qui fabrique une règle. Trois fichiers d'un même objet — d'où les volets.
      </p>
      <div className="mt-lg">
        <DocTabs items={volets} label="Fichiers du socle" />
      </div>
    </main>
  );
}
