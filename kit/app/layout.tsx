import type { Metadata } from "next";
import "./tokens.css";
import "./fontes.css";
import "./globals.css";
import { Tiroir } from "./tiroir";

export const metadata: Metadata = {
  title: "Kit",
  description:
    "Un design system qui montre ses raisons : chaque règle porte son pourquoi, sa preuve et ses limites.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        {/* Préchargées dès la première requête (hissées dans <head>) : la
            fonte arrive avant — ou presque avec — la première peinture, et
            les secours à métriques calées (fontes.css) absorbent le reste :
            plus de saut de mise en page au chargement. */}
        <link rel="preload" href="/fontes/geist-latin-wght-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fontes/jetbrains-mono-latin-wght-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <script dangerouslySetInnerHTML={{ __html:
          `try{var d=localStorage.getItem("kit-density");if(d==="compact"||d==="airy")document.documentElement.dataset.density=d;var a=localStorage.getItem("kit-adaptation");if(a==="shadcn"||a==="html")document.documentElement.dataset.adaptation=a;var t=localStorage.getItem("kit-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t;var p=localStorage.getItem("kit-primary"),pc=localStorage.getItem("kit-primary-css");if(p&&pc){var s=document.createElement("style");s.id="kit-primaire";s.textContent=pc;document.head.appendChild(s);document.documentElement.dataset.primary=p}}catch(e){}` }} />
        <header className="chrome">
          <b>Kit</b>
          <span className="sourd" style={{ fontSize: "0.8125rem" }}>
            un design system qui montre ses raisons
          </span>
          {/* Le tiroir de réglages du gabarit documentaire nu — ne rend
              rien sur les pages qui gardent leur panneau permanent. */}
          <Tiroir />
        </header>
        {children}
      </body>
    </html>
  );
}
