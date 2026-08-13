import { auditIntro, docsByCategory } from "@/lib/content";
import { Markdown } from "../components/markdown";
import { GrilleLiens } from "../components/grille-liens";

export default function AuditHome() {
  const { protocoles, regles } = docsByCategory();
  const vers = (d: { slug: string; title: string }) => ({ href: `/audit/${d.slug}/`, titre: d.title });
  return (
    <main className="mx-auto max-w-[820px] px-lg py-xl">
      <Markdown>{auditIntro()}</Markdown>
      {/* Titres de section RÉELS (h2) : la hiérarchie ne saute plus de h1 aux h3 des cartes. */}
      <h2 className="m-0 mt-xl font-label text-xs font-semibold uppercase tracking-wide text-text-secondary">Protocoles</h2>
      <div className="mt-md">
        <GrilleLiens label="Protocoles" items={protocoles.map(vers)} />
      </div>
      <h2 className="m-0 mt-xl font-label text-xs font-semibold uppercase tracking-wide text-text-secondary">Règles condensées ({regles.length})</h2>
      <div className="mt-md">
        <GrilleLiens label="Règles condensées" items={regles.map(vers)} />
      </div>
    </main>
  );
}
