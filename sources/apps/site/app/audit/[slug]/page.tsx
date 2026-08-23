import { allSlugs, getDoc } from "@/lib/content";
import { Markdown } from "../../components/markdown";
import { LienRetour } from "../../components/lien-retour";

export function generateStaticParams() {
  return allSlugs().map((slug) => ({ slug }));
}

export default function AuditDoc({ params }: { params: { slug: string } }) {
  const doc = getDoc(params.slug);
  return (
    <main className="mx-auto max-w-[820px] px-lg py-xl">
      <LienRetour href="/audit/">← Audit</LienRetour>
      {doc ? <Markdown>{doc.body}</Markdown> : <p>Document introuvable.</p>}
    </main>
  );
}
