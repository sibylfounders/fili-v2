import { tousLesGraphes } from "@/lib/flows";
import { ListeFlows } from "./[slug]/vues";

/** Page SERVEUR : lecture seule. Le rendu est client (cf. `[slug]/vues.tsx`). */
export default function PageFlows() {
  return <ListeFlows graphes={tousLesGraphes()} />;
}
