import { GrilleSujets } from "./grille-sujets";
import { GrilleLiens } from "../components/grille-liens";
import { methodeIndex, socleIndex, sujets, sujetsParNature } from "@/lib/md";
import { fiche, nbCas } from "@/lib/doctrine";

/** Un titre de section RÉEL (h2) : la hiérarchie du document ne saute plus de h1 aux h3
    des cartes — « niveau ≠ taille », la facture reste celle d'un label (TYPOGRAPHY-UX). */
function Titre({ children }: { children: React.ReactNode }) {
  return <h2 className="m-0 mt-2xl font-label text-xs font-semibold uppercase tracking-wide text-text-secondary">{children}</h2>;
}

export default function DoctrineHome() {
  const groupes = sujetsParNature();
  const nbSujets = groupes.reduce((n, g) => n + g.items.length, 0);
  const fiches = sujets().map((s) => fiche(s.slug));
  const totalCas = fiches.reduce((n, f) => n + (f ? nbCas(f) : 0), 0);

  // Méthode : mêmes destinations que la nav, rendues par la MÊME collection que les sujets.
  // Ce bloc était le dernier à fabriquer sa propre carte à la main (cf. grille-liens.tsx).
  const methode = [
    ...methodeIndex().map((d) => ({ href: `/md/methode/${d.slug}/`, titre: d.titre, sous: d.sous })),
    {
      href: "/md/socle/",
      titre: "Socle",
      sous: `Le noyau en trois volets — ${socleIndex().map((d) => d.titre).join(", ")}.`,
    },
    {
      href: "/md/methode/sources/",
      titre: "Sources",
      sous: "34 organisations citées par le corpus, 1337 citations mesurées.",
    },
  ];

  return (
    <main className="mx-auto max-w-container-default px-lg py-xl">
      <h1 className="m-0 text-h2 font-semibold text-text-primary">Doctrine</h1>
      <p className="mt-sm max-w-[64ch] text-text-secondary">
        Le raisonnement du design system : ce que chaque règle décide, pourquoi, et avec quel niveau de
        confiance. Chaque sujet se lit en quatre volets — l'essentiel, les cas d'usage, les spécifications,
        l'évolution. <strong className="font-medium text-text-primary">{nbSujets} sujets</strong>,{" "}
        <strong className="font-medium text-text-primary">{totalCas} cas d'usage</strong> cartographiés.
      </p>

      <Titre>Méthode</Titre>
      <div className="mt-md">
        <GrilleLiens label="Méthode" items={methode} />
      </div>

      {groupes.map((g) => (
        <section key={g.nature.dossier}>
          <Titre>
            {g.nature.pluriel} ({g.items.length})
          </Titre>
          <GrilleSujets
            label={g.nature.pluriel}
            items={g.items.map((s) => {
              const f = fiche(s.slug);
              return {
                slug: s.slug,
                titre: s.title,
                embleme: f?.embleme,
                meta:
                  (f && nbCas(f) ? `${nbCas(f)} cas` : "—") +
                  (s.meta.version ? ` · v${s.meta.version}` : ""),
              };
            })}
          />
        </section>
      ))}
    </main>
  );
}
