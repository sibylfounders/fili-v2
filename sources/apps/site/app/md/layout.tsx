import { Shell } from "../components/shell";
import { navTree } from "@/lib/md";
import { MdNav } from "./nav";

export default function MdLayout({ children }: { children: React.ReactNode }) {
  return (
    <Shell section="md">
      <MdNav groupes={navTree()} />
      {children}
    </Shell>
  );
}
