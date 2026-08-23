import type { Metadata } from "next";
import "./tokens.css";
import "./fontes.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kit",
  description:
    "Un design system qui montre ses raisons : chaque règle porte son pourquoi, sa preuve et ses limites.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html:
          `try{var d=localStorage.getItem("kit-densite");if(d==="compact"||d==="aere")document.documentElement.dataset.densite=d;var a=localStorage.getItem("kit-adaptation");if(a==="shadcn"||a==="html")document.documentElement.dataset.adaptation=a;var t=localStorage.getItem("kit-theme");if(t==="clair"||t==="sombre")document.documentElement.dataset.theme=t}catch(e){}` }} />
        <header className="chrome">
          <b>Kit</b>
          <span className="sourd" style={{ fontSize: "0.8125rem" }}>
            un design system qui montre ses raisons
          </span>
        </header>
        {children}
      </body>
    </html>
  );
}
