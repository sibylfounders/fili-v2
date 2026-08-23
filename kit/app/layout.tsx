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
          `try{if(localStorage.getItem("kit-densite")==="compact")document.documentElement.dataset.densite="compact"}catch(e){}` }} />
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
