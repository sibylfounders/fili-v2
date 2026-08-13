import "@fili/tokens/css";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fili",
  description: "Fili — design system : doctrine, composants, audit. Une stack, un shell.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" data-theme="light" data-relief="">
      <body>{children}</body>
    </html>
  );
}
