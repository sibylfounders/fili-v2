import { Markdown } from "../../components/markdown";
import type { Decision, Fiche } from "@/lib/doctrine";
import { DecisionsGrille } from "./decisions-grille";

/**
 * Volet « Règles », séparé par ce qui compte en audit : ce qui s'appuie sur une source
 * extérieure, et ce qui est nôtre. Mélanger les deux, c'est exactement ce qui fait passer
 * un audit pour un avis.
 *
 * Même geste que les Situations depuis le 2026-07-27 : cartes cliquables en colonnes,
 * détail en superposé. La prose des règles est rendue ICI, côté serveur, et passée à la
 * grille — le markdown ne part pas dans le bundle client.
 */
function Groupe({ titre, sous, decisions }: { titre: string; sous: string; decisions: Decision[] }) {
  if (decisions.length === 0) return null;
  const regles = Object.fromEntries(
    decisions.map((d) => [
      d.id,
      <Markdown key={d.id} className="doc-prose text-sm [&>*:last-child]:mb-0">
        {d.solution}
      </Markdown>,
    ]),
  );
  return (
    <section className="mt-2xl first:mt-0">
      <h3 className="m-0 text-h5 font-semibold text-text-primary">
        {titre} <span className="font-mono text-sm font-normal text-text-muted">{decisions.length}</span>
      </h3>
      <p className="mb-md mt-1 max-w-[70ch] text-sm text-text-secondary">{sous}</p>
      <DecisionsGrille groupe={titre} decisions={decisions} regles={regles} />
    </section>
  );
}

export function VoletDecisions({ f }: { f: Fiche }) {
  const decisions = (f.decisions ?? []).filter((d) => d.couche !== "ui");
  const regles = decisions.filter((d) => d.statut !== "methode");
  const sourcees = regles.filter((d) => d.sources.length > 0);
  const maison = regles.filter((d) => d.sources.length === 0);
  const notes = decisions.filter((d) => d.statut === "methode");

  return (
    <div>
      <header className="mb-xl max-w-[70ch]">
        <h2 className="m-0 text-h3 font-semibold text-text-primary">Ce que ce sujet tranche</h2>
        <p className="mt-sm text-text-secondary">
          {regles.length} décisions : {sourcees.length} s&rsquo;appuient sur une source extérieure,{" "}
          {maison.length} {maison.length > 1 ? "sont les nôtres" : "est la nôtre"}. La distinction n&rsquo;est pas
          cosmétique — on n&rsquo;oppose à un produit tiers que ce qui ne nous appartient pas.
        </p>
      </header>

      <Groupe
        titre="Sourcées"
        sous="Appuyées sur une norme ou un système public. Vérifiables par n'importe qui, opposables en audit."
        decisions={sourcees}
      />
      <Groupe
        titre="Maison"
        sous="Nos décisions, sans source extérieure. On le dit plutôt que de les faire passer pour des standards — elles se discutent."
        decisions={maison}
      />
      <Groupe
        titre="Notes de méthode"
        sous="Ni règles ni arbitrages : des repères de lecture du fichier. Hors audit."
        decisions={notes}
      />
    </div>
  );
}
