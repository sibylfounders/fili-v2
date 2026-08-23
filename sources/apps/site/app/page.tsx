import { GrilleLiens } from "./components/grille-liens";

/** Portail — trois destinations, une par section. Une collection, pas trois liens habillés.
 *  Les adresses portent leur barre finale : le site est construit en `trailingSlash`, et
 *  s'en passer coûtait une redirection à chaque entrée du site. */
const ENTREES = [
  { href: "/md/", titre: "Doctrine", sous: "Les règles UX/UI et les tokens — la source d'autorité." },
  { href: "/ui/", titre: "Composants", sous: "L'atelier @fili/react — les composants vivants." },
  { href: "/audit/", titre: "Audit", sous: "Protocoles d'audit et règles condensées." },
];

export default function Portal() {
  return (
    <main className="mx-auto max-w-[70ch] px-lg py-section">
      <h1 className="m-0 text-h2 font-semibold text-text-primary">Fili</h1>
      <p className="mt-sm text-text-secondary">
        Un design system, trois sections, un seul shell. Choisis une entrée.
      </p>
      <div className="mt-xl">
        <GrilleLiens label="Sections" items={ENTREES} cols={1} titleAs="h2" />
      </div>
    </main>
  );
}
