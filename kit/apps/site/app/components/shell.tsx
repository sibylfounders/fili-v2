"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppLayout, Brand, Link as FiliLink, ThemeToggle, Divider, Select, Switch } from "@fili/react";
import { ThemingContext } from "../theming-context";
import { espacesEchelle, rayonsEchelle, BASES, RAYONS_RACINE, RATIOS } from "./echelle";

const SECTIONS = [
  { value: "md", label: "Doctrine" },
  { value: "ui", label: "Composants" },
  { value: "audit", label: "Audit" },
];
const SECTION_TITLE: Record<string, string> = { md: "Doctrine", ui: "Composants", audit: "Audit" };
const RADIUS_OPTS = [
  { value: "carre", label: "Carré" },
  { value: "defaut", label: "Défaut" },
  { value: "arrondi", label: "Arrondi" },
  { value: "pilule", label: "Pilule" },
];
const RADIUS_PRESETS: Record<string, Record<"sm" | "md" | "lg", string | null>> = {
  carre: { sm: "0px", md: "0px", lg: "0px" },
  defaut: { sm: null, md: null, lg: null },
  arrondi: { sm: "8px", md: "14px", lg: "20px" },
  // pill ne s'applique JAMAIS au cran conteneur (radius.lg — cartes, alertes, modales) :
  // un conteneur haut en 9999px devient un ovale (DESIGN.md 1.20.0 + décision pill du 17/07).
  // Les contrôles mono-ligne (sm/md) prennent la pilule ; les conteneurs plafonnent à 20px.
  pilule: { sm: "9999px", md: "9999px", lg: "20px" },
};
const FW_OPTS = [
  { value: "react", label: "React" },
  { value: "angular", label: "Angular" },
  { value: "tailwind", label: "Tailwind" },
  { value: "html", label: "HTML" },
];

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-md">
      <span className="text-sm text-text-secondary">{label}</span>
      {children}
    </div>
  );
}

export function Shell({
  section,
  children,
}: {
  section: "md" | "ui" | "audit";
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [dark, setDark] = React.useState(false);
  const [radius, setRadius] = React.useState("defaut");
  const [relief, setRelief] = React.useState(true);
  const [fw, setFw] = React.useState("react");
  // L'Échelle Semantic Rhythm — trois décisions d'Auteur, tout le reste en descend.
  const [echelle, setEchelle] = React.useState(false);
  const [base, setBase] = React.useState("24");
  const [ratio, setRatio] = React.useState("1.414");
  const [rayonRacine, setRayonRacine] = React.useState("24");

  React.useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);
  // Rayon : quand l'Échelle gouverne, l'octave (R0/2, R0/4, R0/8) remplace le
  // préréglage — même canal, mêmes variables, jamais les deux à la fois.
  React.useEffect(() => {
    const root = document.documentElement;
    if (echelle) {
      const oct = rayonsEchelle(Number(rayonRacine));
      (["sm", "md", "lg"] as const).forEach((sz) => root.style.setProperty(`--radius-${sz}`, oct[sz]));
      return;
    }
    const r = RADIUS_PRESETS[radius] ?? {};
    (["sm", "md", "lg"] as const).forEach((sz) => {
      const v = r[sz];
      if (v) root.style.setProperty(`--radius-${sz}`, v);
      else root.style.removeProperty(`--radius-${sz}`);
    });
  }, [radius, echelle, rayonRacine]);
  // Espacement : les six crans thémables descendent de base et ratio.
  // --space-section et --space-base ne bougent pas : l'Échelle ne les définit pas.
  React.useEffect(() => {
    const root = document.documentElement;
    const crans = ["xs", "sm", "md", "lg", "xl", "2xl"] as const;
    if (echelle) {
      const esp = espacesEchelle(Number(base), Number(ratio));
      crans.forEach((k) => root.style.setProperty(`--space-${k}`, esp[k]));
    } else {
      crans.forEach((k) => root.style.removeProperty(`--space-${k}`));
    }
  }, [echelle, base, ratio]);
  React.useEffect(() => {
    document.documentElement.toggleAttribute("data-relief", relief);
  }, [relief]);

  // Colonne de gauche : marque + sélecteur de section + nav de l'atelier (portail).
  const sidebar = (
    <div className="flex h-full flex-col gap-lg p-lg">
      {/* Marque-lien d'accueil : routage next/link, facture et FOCUS du kit (Link asChild),
          sémantique Brand asChild (catalogue) — plus de next/link stylé à la main. */}
      <Brand.Root asChild>
        <FiliLink asChild context="navigation">
          <Link href="/" aria-label="Accueil Fili">
            <Brand.Text>Fili</Brand.Text>
          </Link>
        </FiliLink>
      </Brand.Root>
      <Select options={SECTIONS} value={section} onValueChange={(v) => router.push(`/${v}`)} aria-label="Section" />
      <div id="section-nav" className="min-h-0 flex-1 overflow-y-auto" />
    </div>
  );

  // Colonne de droite : theming (au-dessus) puis playground de l'atelier (#section-tools).
  // Doctrine n'en a pas besoin — c'est de la lecture, pas de l'essai : la section md n'a pas d'aside.
  const aside = (
    <div className="flex flex-col gap-md p-lg">
      <div className="flex items-baseline justify-between">
        <span className="font-label text-sm font-semibold text-text-primary">Theming</span>
        <span className="font-mono text-[11px] text-text-muted">tokens live</span>
      </div>
      <Row label="Thème"><ThemeToggle checked={dark} onCheckedChange={setDark} aria-label="Thème sombre" /></Row>
      <Row label="Framework"><Select options={FW_OPTS} value={fw} onValueChange={setFw} aria-label="Framework" size="sm" variant="ghost" /></Row>
      {/* Quand l'Échelle gouverne, le préréglage de rayon se retire — il ne se cumule pas. */}
      <div className={echelle ? "pointer-events-none select-none opacity-40" : undefined} aria-disabled={echelle || undefined}>
        <Row label="Rayon"><Select options={RADIUS_OPTS} value={radius} onValueChange={setRadius} aria-label="Rayon" size="sm" variant="ghost" /></Row>
      </div>
      <Row label="Relief"><Switch checked={relief} onCheckedChange={setRelief} aria-label="Relief" size="sm" /></Row>
      <Divider />
      <div className="flex items-baseline justify-between">
        <span className="font-label text-sm font-semibold text-text-primary">Échelle</span>
        <span className="font-mono text-[11px] text-text-muted">semantic rhythm</span>
      </div>
      <Row label="Active"><Switch checked={echelle} onCheckedChange={setEchelle} aria-label="Échelle active" size="sm" /></Row>
      <div className={"flex flex-col gap-md" + (echelle ? "" : " pointer-events-none select-none opacity-40")} aria-disabled={!echelle || undefined}>
        <Row label="Base">
          <Select options={BASES.map((b) => ({ value: String(b), label: `${b} px` }))} value={base} onValueChange={setBase} aria-label="Base" size="sm" variant="ghost" />
        </Row>
        <Row label="Ratio">
          <Select options={RATIOS} value={ratio} onValueChange={setRatio} aria-label="Ratio" size="sm" variant="ghost" />
        </Row>
        <Row label="Rayon racine">
          <Select options={RAYONS_RACINE.map((r) => ({ value: String(r), label: `${r} px` }))} value={rayonRacine} onValueChange={setRayonRacine} aria-label="Rayon racine" size="sm" variant="ghost" />
        </Row>
      </div>
      <Divider />
      <Row label="Icônes"><span className="text-sm text-text-secondary">◈ Lucide</span></Row>
      <Row label="Primitives"><span className="text-sm text-text-secondary">Radix</span></Row>
      <Divider />
      <div id="section-tools" />
    </div>
  );

  return (
    <ThemingContext.Provider value={{ framework: fw }}>
      <AppLayout
        className="h-screen"
        variant={section === "audit" ? "default" : "docs"}
        boundedContent={false}
        contentPadding={false}
        sidebar={sidebar}
        topbar={
          section === "audit"
            ? { breadcrumb: <span className="font-medium text-text-primary">{SECTION_TITLE[section]}</span> }
            : section === "md"
              ? {
                  // Doctrine n'a pas d'aside : le seul réglage utile à la lecture remonte dans la topbar.
                  search: true,
                  actions: <ThemeToggle checked={dark} onCheckedChange={setDark} aria-label="Thème sombre" />,
                }
              : { search: true }
        }
        aside={section === "md" ? undefined : aside}
        asideLabel="Réglages"
      >
        {children}
      </AppLayout>
    </ThemingContext.Provider>
  );
}
