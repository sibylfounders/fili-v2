import type { Metadata } from "next";
import "./tokens.css";
import "./fonts.css";
import "./kit.css";
import "./app.css";
import { Workbench } from "./workbench";
import { Brand } from "./brand";
import { Adaptive } from "./adaptive";

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
          `try{var d=localStorage.getItem("kit-density");if(d==="compact"||d==="airy")document.documentElement.dataset.density=d;var a=localStorage.getItem("kit-stack");if(a==="shadcn"||a==="html")document.documentElement.dataset.stack=a;var b=localStorage.getItem("kit-bench");if(b==="oui")document.documentElement.dataset.bench="oui";var t=localStorage.getItem("kit-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t;var p=localStorage.getItem("kit-primary"),pc=localStorage.getItem("kit-primary-css");if(p&&pc){var s=document.createElement("style");s.id="kit-primaire";s.textContent=pc;document.head.appendChild(s);document.documentElement.dataset.primary=p}}catch(e){}` }} />
        <header className="chrome">
          {/* La marque mène à l'accueil (8 septembre 2026). */}
          <Brand />
          {/* La bande d'atelier : couleur, fond, surface — et « ⋯ » pour le
              drawer, qui ne rend rien sur les pages qui gardent leur
              panneau permanent. */}
          <Workbench />
        </header>
        {children}
        {/* La couche d'adaptation lit ce que la page a composé — zones,
            segments, posture — et le dit sur <html> ; le banc, quand il est
            allumé, le montre (adaptive.tsx). */}
        <Adaptive />
      </body>
    </html>
  );
}
