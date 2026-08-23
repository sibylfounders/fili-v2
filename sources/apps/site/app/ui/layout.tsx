import { Shell } from "../components/shell";
export default function UiLayout({ children }: { children: React.ReactNode }) {
  return <Shell section="ui">{children}</Shell>;
}
