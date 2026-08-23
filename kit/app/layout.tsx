import type { Metadata } from "next";
import "./tokens.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kit",
  description:
    "Le kit neuf de Fili — fondations d'abord, chaque élément montre ses lois.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <header className="chrome">
          <b>Kit</b>
          <span className="sourd mono">fondations d&apos;abord</span>
          <nav>
            <a href="/">Accueil</a>
            <a href="/rythme">Rythme</a>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
