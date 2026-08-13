import { notFound } from "next/navigation";
import { graphe, slugsFlows } from "@/lib/flows";
import { VueFlow } from "./vues";

/**
 * Page SERVEUR : elle ne fait que lire la projection sur disque. Tout le rendu est délégué
 * à `vues.tsx` (client) — le baril `@fili/react` est `"use client"`, ses composants à
 * namespace ne se résolvent pas depuis le graphe RSC.
 */

export function generateStaticParams() {
  return slugsFlows().map((slug) => ({ slug }));
}

export default function PageFlow({ params }: { params: { slug: string } }) {
  const g = graphe(params.slug);
  if (!g) notFound();
  return <VueFlow graphe={g} />;
}
