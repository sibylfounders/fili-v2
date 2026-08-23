import * as React from "react";
import {
  Button, Link, Chip, Container, Brand, Divider, Switch, Checkbox, Radio, Select, Accordion,
  Nav, TableOfContents, SkipLink, Drawer, Modal, Tabs, DeleteButton, SubmitButton, ThemeToggle,
  Input, Alert, Toast, Card, CompactButton, useToast, AppLayout, Skeleton, Dropdown,
  type SelectOption, type DrawerSide, type DrawerSize, type DrawerEffect, type ToastPlacement,
  type ModalPlacement, type ModalEnterFrom, type DropdownSide, type DropdownAlign,
} from "@fili/react";
import { manifestByName } from "@fili/react/manifest";
import { CardDemo, CardGroupDemo, codeCard, codeCardGroup } from "./card-group";
import { MESSAGES, extraitCode, texteDe, type FamilleMessages, type SourceMessage } from "./messages-validation";
import {
  StatCard, ChartCard, KpiGroup,
  AreaChart, BarChart, ComposedChart, DonutChart, LineChart,
  fmtEur, fmtInt, fmtCompact,
  type ComposedPoint, type DonutDatum, type KpiItem, type LineSeries,
} from "@fili/charts";

/* ── dérivation du MANIFESTE (@fili/react/manifest) ─────────────────────────────
   Les options publiques d'un composant ne sont plus retapées ici : elles viennent
   du manifeste, lui-même vérifié par tsc contre les unions réelles (axe<U>()).
   Si un composant gagne/perd une valeur, l'atelier suit sans édition manuelle. */
const axisOpts = (component: string, axis: string): string[] =>
  Object.keys(manifestByName[component]?.axes?.[axis]?.values ?? {});
const axisDefault = (component: string, axis: string): string =>
  manifestByName[component]?.axes?.[axis]?.default ?? axisOpts(component, axis)[0] ?? "";

/* ── données atelier « adacard » : dogfooding de @fili/charts ── */
const ADA_SPARK = [1420, 1560, 1490, 1720, 1640, 1580, 1810, 1750, 1930, 1880, 2050, 1990, 2180, 2310];
const ADA_MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const ADA_CA = [32, 40, 36, 52, 47, 61, 55, 68, 63, 79, 73, 88];
const ADA_WEEKS = ["S1", "S2", "S3", "S4", "S5", "S6", "S7"];
const ADA_BARS = [38, 52, 44, 65, 58, 77, 70];
const ADA_COMPOSED: ComposedPoint[] = [
  { bar: 38, line: 52 }, { bar: 52, line: 48 }, { bar: 44, line: 61 },
  { bar: 65, line: 57 }, { bar: 58, line: 71 }, { bar: 77, line: 66 }, { bar: 70, line: 83 },
];
const ADA_PIE: DonutDatum[] = [
  { label: "Vie", value: 34, color: "var(--ch-cat-1)" },
  { label: "Santé", value: 23, color: "var(--ch-cat-2)" },
  { label: "Retraite", value: 18, color: "var(--ch-cat-3)" },
  { label: "Habitation", value: 14, color: "var(--ch-cat-4)" },
  { label: "Auto", value: 11, color: "var(--ch-cat-5)" },
];
const ADA_DETAILS: [string, string][] = [
  ["Nouveaux clients", "312"],
  ["Panier moyen", "154 €"],
  ["Taux de retour", "2,1 %"],
];
const ADA_KPIS: KpiItem[] = [
  { label: "Revenu net", value: "48 210 €", countTo: 48210, format: fmtEur, delta: { value: "+6,4 %", tone: "up" }, spark: ADA_SPARK, color: "var(--primary)" },
  { label: "Commandes", value: "1 284", delta: { value: "+8,1 %", tone: "up" }, spark: [30, 44, 58, 50, 66, 72, 88, 84, 96], color: "var(--info)" },
  { label: "Conversion", value: "3,7 %", delta: { value: "-1,2 %", tone: "down" }, spark: [71, 66, 68, 60, 58, 62, 55, 53, 50], color: "var(--success)" },
];
const ADA_TRAFFIC_MONTHS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
const ADA_TRAFFIC: LineSeries[] = [
  { label: "Organique", data: [4200, 4600, 4100, 5200, 5000, 5800, 6100, 5900, 6600, 7000, 7400, 8100], color: "var(--ch-cat-1)" },
  { label: "Payant", data: [2600, 3100, 2900, 3300, 3000, 3600, 3400, 3900, 3700, 4200, 4000, 4600], color: "var(--ch-cat-4)" },
];
const kEur = (n: number) => fmtInt(n) + " k€";

/* ── Les textes de la démo Input suivent la NATURE de la donnée ──────────────────────────
   Un libellé, une aide et un message d'erreur ne sont pas des remplissages : ils disent ce
   qu'on attend et comment corriger (INPUT-R23). Montrer « Adresse e-mail / Le format attendu
   est nom@domaine.fr » au-dessus d'un champ de recherche apprenait exactement le contraire.
   Chaque erreur nomme donc la contrainte réelle du type — c'est aussi ce que produirait la
   chaîne de validation sur ce champ. */
const TEXTES_INPUT: Record<
  string,
  { label: string; helper: string; erreur: string; nom: string }
> = {
  text: {
    label: "Nom affiché",
    helper: "Il apparaîtra sur votre profil public.",
    erreur: "Saisissez un nom d'au moins deux caractères.",
    nom: "Nom affiché",
  },
  email: {
    label: "Adresse e-mail",
    helper: "Nous ne la partagerons jamais.",
    erreur: "Saisissez une adresse au format nom@domaine.fr",
    nom: "Adresse e-mail",
  },
  password: {
    label: "Mot de passe",
    helper: "Douze caractères minimum ; les espaces comptent.",
    erreur: "Ce mot de passe est trop court : il en faut douze au minimum.",
    nom: "Mot de passe",
  },
  search: {
    label: "Rechercher une règle",
    helper: "Un mot-clé, ou un identifiant comme INPUT-R38.",
    erreur: "Aucune règle ne correspond : essayez un mot plus court.",
    nom: "Rechercher une règle",
  },
  tel: {
    label: "Téléphone",
    helper: "Avec l'indicatif si le numéro est étranger : +33 6 12 34 56 78.",
    erreur: "Ce numéro est incomplet : il manque des chiffres.",
    nom: "Téléphone",
  },
  number: {
    label: "Quantité",
    helper: "Entre 0 et 99, par pas de 1.",
    erreur: "Saisissez une quantité comprise entre 0 et 99.",
    nom: "Quantité",
  },
  url: {
    label: "Site web",
    helper: "Le protocole est déjà posé — commencez au domaine.",
    erreur: "Saisissez une adresse de la forme exemple.fr/page.",
    nom: "Site web",
  },
  textarea: {
    label: "Message",
    helper: "Dites-nous ce qui vous amène, en quelques lignes.",
    erreur: "Le message est vide : écrivez au moins une phrase.",
    nom: "Message",
  },
};

/* icônes + skeleton + opérations async — partagés par les entrées composants */
const IC_MAIL = (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>);
const IC_CLOSE = (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>);
const IC_ARROW = (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>);
const Sk = ({ w, h, r = "var(--radius-sm)" }: { w: string | number; h: string | number; r?: string }) => (
  <Skeleton width={w} height={h} style={{ borderRadius: r }} />
);
const asyncOp = (mode: string) =>
  mode === "instant"
    ? () => Promise.resolve()
    : mode === "échec"
    ? () => new Promise((_, rej) => setTimeout(() => rej(new Error("échec")), 900))
    : () => new Promise((r) => setTimeout(r, 900));

type Base = { k: string; label?: string; sec?: string; disabled?: (s: Record<string, any>) => boolean };
export type Control =
  | (Base & { type: "seg"; opts: string[] })
  | (Base & { type: "bool" })
  | (Base & { type: "text" })
  | (Base & { type: "range"; min: number; max: number; step?: number; unit?: string });

type S = Record<string, any>;
type Set = (k: string, v: any) => void;

export interface Block {
  title: string;
  fill?: boolean;
  render: (s: S, set: Set) => React.ReactNode;
  code: (s: S, fw?: string) => string;
}
export interface Entry {
  key: string;
  name: string;
  controls?: Control[];
  initial?: S;
  render: (s: S, set: Set) => React.ReactNode;
  code: (s: S, fw?: string) => string;
  replay?: boolean;
  fill?: boolean;
  blocks?: Block[];
}
export interface Group { label: string; items: Entry[]; }

/* ---------- démos à état interne ---------- */
const DrawerDemo: React.FC<{ side: DrawerSide; size: DrawerSize; effect: DrawerEffect; depth: boolean }> = ({ side, size, effect, depth }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <Drawer.Frame className="h-full w-full">
      <div className="flex h-full flex-col gap-sm bg-background p-lg">
        <b className="text-text-primary">La page derrière</b>
        <p className="m-0 text-sm text-text-secondary">
          overlay : le tiroir glisse au-dessus · push : le contenu se décale (start/end) ·
          depth (combinable) : le contenu recule dans une frame sur fond noir (Depth Transition).
        </p>
        <div className="mt-auto">
          <Button.Root onClick={() => setOpen(true)}>Ouvrir le tiroir</Button.Root>
        </div>
      </div>
      <Drawer open={open} onClose={() => setOpen(false)} side={side} size={size} effect={effect} depth={depth} aria-label="Tiroir de démonstration">
        <div className="flex flex-col gap-sm p-lg">
          <b className="text-text-primary">Tiroir modal</b>
          <p className="m-0 text-sm text-text-secondary">Voile · focus piégé · Échap ferme · retour du focus.</p>
          <Button.Root variant="ghost" tone="neutral" onClick={() => setOpen(false)}>Fermer</Button.Root>
        </div>
      </Drawer>
    </Drawer.Frame>
  );
};

const ModalDemo: React.FC<{
  size: "narrow" | "default" | "wide";
  scrim: boolean;
  placement: ModalPlacement;
  enterFrom: ModalEnterFrom;
}> = ({ size, scrim, placement, enterFrom }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button.Root onClick={() => setOpen(true)}>Ouvrir la modale</Button.Root>
      <Modal open={open} onClose={() => setOpen(false)} size={size} dismissOnScrim={scrim} placement={placement} enterFrom={enterFrom}>
        <Modal.Header kicker="01 · Rôle de bordure">Bordure délimitante</Modal.Header>
        <Modal.Body>
          <p className="m-0"><b className="text-text-primary">Quand ?</b> Un composant interactif n'a que sa bordure au repos.</p>
          <p className="mt-sm"><b className="text-text-primary">Que faire ?</b> border-strong, 3:1 obligatoire (WCAG 1.4.11).</p>
        </Modal.Body>
        <Modal.Footer>
          <Button.Root variant="ghost" tone="neutral" onClick={() => setOpen(false)}>Fermer</Button.Root>
          <Button.Root onClick={() => setOpen(false)}>Compris</Button.Root>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const TabsDemo: React.FC<{ variant: "line" | "pill"; activation: "auto" | "manual" }> = ({ variant, activation }) => (
  <Tabs.Root defaultValue="essentiel" variant={variant} activation={activation} className="w-full gap-md">
    <Tabs.List label="Volets de la fiche">
      <Tabs.Tab value="essentiel">L'essentiel</Tabs.Tab>
      <Tabs.Tab value="cas">Cas d'usage</Tabs.Tab>
      <Tabs.Tab value="specs">Spécifications</Tabs.Tab>
      <Tabs.Tab value="evolution">Évolution</Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel value="essentiel"><p className="m-0 text-sm text-text-secondary">La décision de fond et les règles structurantes.</p></Tabs.Panel>
    <Tabs.Panel value="cas"><p className="m-0 text-sm text-text-secondary">Les situations concrètes qui éprouvent la couverture.</p></Tabs.Panel>
    <Tabs.Panel value="specs"><p className="m-0 text-sm text-text-secondary">États, tokens, spécimens.</p></Tabs.Panel>
    <Tabs.Panel value="evolution"><p className="m-0 text-sm text-text-secondary">Les arbitrages datés.</p></Tabs.Panel>
  </Tabs.Root>
);

const DropdownDemo: React.FC<{ side: DropdownSide | "auto"; align: DropdownAlign | "auto"; icons: boolean }> = ({ side, align, icons }) => {
  const [tri, setTri] = React.useState("recent");
  const [last, setLast] = React.useState<string | null>(null);
  const ic = (d: React.ReactNode) => (icons ? svg(d) : undefined);
  return (
    <div className={cn2("flex min-h-[320px] w-full flex-col items-center gap-sm", side === "top" ? "justify-end pb-lg" : "justify-start pt-md")}>
      {last ? <p className="m-0 text-xs text-text-muted">Action : {last}</p> : null}
      <Dropdown.Root>
        <Dropdown.Trigger asChild>
          <Button.Root>
            Options
            {/* drop-up : la flèche pointe vers le haut, dans le sens d'ouverture du menu */}
            <Button.Icon><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={side === "top" ? "m6 15 6-6 6 6" : "m6 9 6 6 6-6"} /></svg></Button.Icon>
          </Button.Root>
        </Dropdown.Trigger>
        <Dropdown.Content side={side} align={align} aria-label="Options">
          <Dropdown.Label>Compte</Dropdown.Label>
          <Dropdown.Item icon={ic(<><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>)} onSelect={() => setLast("Profil")}>Profil</Dropdown.Item>
          <Dropdown.Item icon={ic(<><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1" /></>)} onSelect={() => setLast("Réglages")}>Réglages</Dropdown.Item>
          <Dropdown.Item icon={ic(<><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" /><path d="M14 2v5h5" /></>)} disabled>Facturation</Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.Label>Tri</Dropdown.Label>
          {[["recent", "Plus récent"], ["ancien", "Plus ancien"], ["az", "A → Z"]].map(([v, l]) => (
            <Dropdown.Item key={v} checked={tri === v} closeOnClick={false} onSelect={() => setTri(v)}>{l}</Dropdown.Item>
          ))}
          <Dropdown.Separator />
          <Dropdown.Item className="text-danger" icon={ic(<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></>)} onSelect={() => setLast("Déconnexion")}>
            Se déconnecter
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
    </div>
  );
};
const cn2 = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

const DropdownInlineDemo: React.FC<{ icons: boolean }> = ({ icons }) => {
  const [tri, setTri] = React.useState("recent");
  const ic = (d: React.ReactNode) => (icons ? svg(d) : undefined);
  return (
    <Dropdown.Inline aria-label="Options" className="max-w-56">
      <Dropdown.Label>Compte</Dropdown.Label>
      <Dropdown.Item icon={ic(<><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>)}>Profil</Dropdown.Item>
      <Dropdown.Item icon={ic(<><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1" /></>)}>Réglages</Dropdown.Item>
      <Dropdown.Item icon={ic(<><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" /><path d="M14 2v5h5" /></>)} disabled>Facturation</Dropdown.Item>
      <Dropdown.Separator />
      <Dropdown.Label>Tri</Dropdown.Label>
      {[["recent", "Plus récent"], ["ancien", "Plus ancien"], ["az", "A → Z"]].map(([v, l]) => (
        <Dropdown.Item key={v} checked={tri === v} onSelect={() => setTri(v)}>{l}</Dropdown.Item>
      ))}
    </Dropdown.Inline>
  );
};

const SITE_OPTS: SelectOption[] = [
  { value: "md", label: "Design System MD" },
  { value: "ui", label: "Design System UI" },
  { value: "audit", label: "Design System Audit", disabled: true },
];

const ToastTrigger: React.FC<{ s: Record<string, any> }> = ({ s }) => {
  const { toast } = useToast();
  return (
    <Button.Root onClick={() => toast({ tone: s.tone, title: s.title || "Enregistré", description: s.description || undefined, closing: s.closing })}>
      Afficher un toast
    </Button.Root>
  );
};
const ToastDemo: React.FC<{ s: Record<string, any> }> = ({ s }) => (
  <Toast.Provider placement={(s.placement as ToastPlacement) ?? "bottom"}>
    <ToastTrigger s={s} />
  </Toast.Provider>
);

/* ---------- démo AppLayout (shell à options) ---------- */
const svg = (d: React.ReactNode) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);
const ICO = {
  home: svg(<><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></>),
  chart: svg(<><path d="M3 3v18h18" /><path d="m7 14 4-4 3 3 5-6" /></>),
  users: svg(<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /></>),
  file: svg(<><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" /><path d="M14 2v5h5" /></>),
  cog: svg(<><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1" /></>),
  bell: svg(<><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></>),
  search: svg(<><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>),
};
const shellMark = <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-bold text-on-primary">S</span>;
const shellBrand = (label: string) => (
  <span className="flex items-center gap-2 font-semibold text-text-primary">
    {shellMark}
    <span className="truncate">{label}</span>
  </span>
);
/* Actions d'icône de topbar : le kit, jamais un <button> restylé (CompactButton ghost). */
const shellIconBtn = (label: string, icon: React.ReactNode) => (
  <CompactButton variant="ghost" tone="neutral" size="md" aria-label={label}>
    {icon}
  </CompactButton>
);

const AppLayoutDemo: React.FC<{ variant: "default" | "docs" }> = ({ variant }) => {
  if (variant === "docs") {
    return (
      <AppLayout
        variant="docs"
        brand={shellBrand("Fili Docs")}
        brandMark={shellMark}
        nav={[
          { label: "Démarrer", items: [{ label: "Introduction", active: true }, { label: "Installation" }, { label: "Structure du projet" }] },
          { label: "Fondations", items: [{ label: "Couleur" }, { label: "Typographie" }, { label: "Espacement" }] },
          { label: "Composants", items: [{ label: "Button" }, { label: "Input" }, { label: "Select", items: [{ label: "Options" }, { label: "Tailles" }] }] },
        ]}
        topbar={{ search: true, actions: shellIconBtn("Dépôt", ICO.file) }}
        aside={
          <div className="p-lg">
            <p className="mb-2 font-label text-[11px] font-semibold uppercase tracking-wider text-text-muted">Sur cette page</p>
            <ul className="m-0 flex list-none flex-col gap-2 p-0 text-sm text-text-secondary">
              <li className="font-medium text-primary">Introduction</li><li>Fonctionnalités</li><li>Installation</li><li>Prochaines étapes</li>
            </ul>
          </div>
        }
      >
        <span className="font-label text-xs font-semibold uppercase tracking-wide text-text-muted">Démarrer</span>
        <h1 className="m-0 mt-1 text-3xl font-semibold text-text-primary">Introduction</h1>
        <p className="mt-3 text-text-secondary">Fili est une bibliothèque de composants React construite sur des tokens de design : accessible, thème clair/sombre, patterns compositionnels.</p>
        <h2 className="mb-2 mt-lg text-lg font-semibold text-text-primary">Fonctionnalités</h2>
        <ul className="flex list-disc flex-col gap-1 pl-5 text-text-secondary"><li>Accessibles par défaut</li><li>Tokens de design</li><li>Mode sombre</li><li>Server Components</li></ul>
      </AppLayout>
    );
  }
  return (
    <AppLayout
      variant="default"
      brand={shellBrand("Fili")}
      brandMark={shellMark}
      nav={[
        { label: "Tableau de bord", icon: ICO.home, active: true },
        { label: "Analyses", icon: ICO.chart },
        { label: "Clients", icon: ICO.users },
        { label: "Factures", icon: ICO.file },
        { label: "Réglages", icon: ICO.cog },
      ]}
      topbar={{
        breadcrumb: <><span className="flex h-4 w-4 items-center justify-center text-text-muted">{ICO.home}</span><span className="text-text-primary">Tableau de bord</span></>,
        actions: (
          <>
            {shellIconBtn("Rechercher", ICO.search)}
            {shellIconBtn("Notifications", ICO.bell)}
            <span className="ml-1 flex h-8 w-8 items-center justify-center rounded-pill bg-secondary text-xs font-semibold text-on-secondary">JG</span>
          </>
        ),
      }}
    >
      <h1 className="m-0 text-2xl font-semibold text-text-primary">Tableau de bord</h1>
      <p className="mt-1 text-text-secondary">La sidebar occupe toute la hauteur ; topbar et contenu vivent dans la colonne de droite. Le bouton en haut à gauche replie la sidebar en rail d'icônes (off-canvas sous desktop).</p>
      {/* Vraies Cards du système (jamais des placeholders ad hoc). Grille INTRINSÈQUE
          (ADAPTIVE-R06 : jamais un nombre de colonnes par appareil) : les colonnes émergent
          de la place réelle — 1 colonne dans un shell compact, 3 dès qu'il respire. */}
      <div className="grid mt-lg gap-md [grid-template-columns:repeat(auto-fit,minmax(min(100%,11rem),1fr))]">
        {[
          ["Revenu net", "48 210 €", "+6,4 % vs mois dernier"],
          ["Commandes", "1 284", "+8,1 % vs mois dernier"],
          ["Conversion", "3,7 %", "−1,2 % vs mois dernier"],
        ].map(([t, v, d]) => (
          <Card.Root key={t}>
            <Card.Body>
              <Card.Description>{t}</Card.Description>
              <p className="m-0 text-xl font-bold text-text-primary">{v}</p>
              <Card.Description className="text-xs text-text-muted">{d}</Card.Description>
            </Card.Body>
          </Card.Root>
        ))}
      </div>
      <div className="mt-md">
        <Card.Root mode="clickable">
          <Card.Body>
            <Card.Header>
              <Card.Title as="h2">Dernières factures</Card.Title>
            </Card.Header>
            <Card.Description>
              12 factures émises cette semaine — 3 en attente de règlement, 9 soldées.
            </Card.Description>
            <Card.Actions>
              <Button.Root variant="lighter" tone="neutral" size="sm">Tout voir</Button.Root>
            </Card.Actions>
          </Card.Body>
        </Card.Root>
      </div>
    </AppLayout>
  );
};

/* ── La table de référence des MESSAGES de validation ────────────────────────────────────
   Une chaîne de validation ne se comprend pas en regardant un formulaire au repos : ce qui
   se lit, c'est ce que le système DIT quand une valeur ne convient pas. Cette table met les
   messages côte à côte pour qu'on puisse juger d'un coup d'œil s'ils tiennent la règle
   INPUT-R23 — dire pourquoi ET comment corriger. */
const TEINTE_SOURCE: Record<SourceMessage, string> = {
  native: "Contrainte HTML native — le navigateur la calcule",
  schema: "Déclarée par le produit et calculée par le contrat (cardinalité, requis d'un groupe)",
  business: "Règle métier — le produit la possède, Fili la présente",
  server: "Le serveur fait foi : son verdict remplace celui du client",
};

function TableMessages({ famille, notes }: { famille: FamilleMessages; notes: boolean }) {
  return (
    <div className="flex w-full max-w-[860px] flex-col gap-xl">
      <p className="m-0 text-sm text-text-secondary">
        Le contrat <code className="text-text-primary">Validation</code> ne code aucun texte : il en{" "}
        <b className="text-text-primary">réclame</b>. Ce qui voyage entre le validateur, le message sous le champ et le
        résumé d’erreurs, c’est le <b className="text-text-primary">code</b> — stable, indépendant du navigateur et de la
        langue. Voici le wording de référence pour chacun. Les <code className="text-text-primary">{"{accolades}"}</code>{" "}
        sont interpolées depuis <code className="text-text-primary">issue.params</code>.
      </p>

      {MESSAGES[famille].map((table) => (
        <section key={table.titre} className="flex flex-col gap-sm">
          <div className="flex flex-col gap-xs">
            <h2 className="m-0 text-lg font-medium text-text-primary">{table.titre}</h2>
            <p className="m-0 text-sm text-text-secondary">{table.sous}</p>
          </div>
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border-strong">
                <th scope="col" className="py-2 pr-md align-bottom font-medium text-text-primary">Quand</th>
                <th scope="col" className="py-2 pr-md align-bottom font-medium text-text-primary">Code</th>
                <th scope="col" className="py-2 align-bottom font-medium text-text-primary">Message de référence</th>
              </tr>
            </thead>
            <tbody>
              {table.lignes.map((l) => (
                <tr key={l.code + l.contrainte} className="border-b border-border align-top">
                  <td className="py-sm pr-md text-text-secondary">{l.contrainte}</td>
                  <td className="py-sm pr-md whitespace-nowrap">
                    <code className="text-text-primary">{l.code}</code>
                    <span className="mt-1 block text-xs text-text-muted" title={TEINTE_SOURCE[l.source]}>
                      {l.source}
                    </span>
                  </td>
                  <td className="py-sm">
                    <span className="text-text-primary">{texteDe(l)}</span>
                    {notes && l.note ? (
                      <span className="mt-1 block text-xs text-text-secondary">{l.note}</span>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}

      <p className="m-0 text-sm text-text-secondary">
        Ce jeu est une <b className="text-text-primary">référence</b>, pas une obligation : un produit l’adapte à sa voix
        (<code className="text-text-primary">VOICE</code>) et à sa langue. Ce qui n’est pas négociable, ce sont les codes
        et la chaîne — le message affiché et celui du résumé sortent toujours du même objet.
      </p>
    </div>
  );
}

/* ---------- registre ---------- */
export const GROUPS: Group[] = [
  {
    label: "Layout",
    items: [
      {
        key: "container", name: "Container",
        controls: [{ k: "size", type: "seg", opts: axisOpts("Container", "size") }],
        initial: { size: "default" },
        render: (s) => (
          <Container size={s.size}>
            {/* Le remplissage de démo est une VRAIE Card — jamais un div bordé-arrondi local. */}
            <Card.Root>
              <Card.Body>
                <Card.Description>size = {s.size}</Card.Description>
              </Card.Body>
            </Card.Root>
          </Container>
        ),
        code: (s) => `<Container size="${s.size}">…</Container>`,
      },
      {
        key: "brand", name: "Brand",
        render: () => (
          <Brand.Root>
            <Brand.Logo><svg viewBox="0 0 24 24" fill="none"><path d="M5 6h14M5 12h14M5 18h9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg></Brand.Logo>
            <Brand.Text>Fili</Brand.Text>
          </Brand.Root>
        ),
        code: () => `<Brand.Root>\n  <Brand.Logo><Logo/></Brand.Logo>\n  <Brand.Text>Fili</Brand.Text>\n</Brand.Root>`,
      },
      {
        key: "divider", name: "Divider",
        render: () => (
          <div className="w-64"><p className="m-0 text-sm text-text-primary">Au-dessus</p><Divider /><p className="m-0 text-sm text-text-primary">En dessous</p></div>
        ),
        code: () => `<Divider />`,
      },
      {
        key: "applayout", name: "AppLayout",
        blocks: [
          {
            title: "Variante default — topbar + sidebar repliable (rail d'icônes / off-canvas)",
            fill: true,
            render: () => <AppLayoutDemo variant="default" />,
            code: () => `<AppLayout
  variant="default"
  brand={<Brand />}
  nav={[
    { label: "Tableau de bord", icon: <Home />, active: true },
    { label: "Analyses", icon: <Chart /> },
    { label: "Clients", icon: <Users /> },
  ]}
  topbar={{
    breadcrumb: <><Home /> Tableau de bord</>,
    actions: <><SearchBtn /><BellBtn /><Avatar /></>,
  }}
>
  {/* contenu principal */}
</AppLayout>`,
          },
          {
            title: "Variante docs — nav groupée + recherche centrée + « sur cette page »",
            fill: true,
            render: () => <AppLayoutDemo variant="docs" />,
            code: () => `<AppLayout
  variant="docs"
  brand={<Brand />}
  nav={[
    { label: "Démarrer", items: [
      { label: "Introduction", active: true },
      { label: "Installation" },
    ] },
    { label: "Composants", items: [
      { label: "Button" },
      { label: "Select", items: [{ label: "Options" }] },
    ] },
  ]}
  topbar={{ search: true, actions: <GitHubBtn /> }}
  aside={<OnThisPage />}
>
  {/* documentation */}
</AppLayout>`,
          },
        ],
        render: () => <AppLayoutDemo variant="default" />,
        code: () => `<AppLayout variant="default" brand={<Brand />} nav={items} topbar={{ breadcrumb, actions }}>{/* contenu */}</AppLayout>`,
      },
    ],
  },
  {
    label: "Navigation",
    items: [
      {
        key: "nav", name: "Nav",
        render: () => (
          <div className="w-72">
            <Nav.Root label="Navigation d'exemple">
              <Nav.List>
                <Nav.Link href="#">Couleur</Nav.Link>
                <Nav.Link href="#" current>Overlay</Nav.Link>
                <Nav.Link href="#">Grille</Nav.Link>
              </Nav.List>
            </Nav.Root>
          </div>
        ),
        code: () => `<Nav.Root label="…">\n  <Nav.List><Nav.Link current>…</Nav.Link></Nav.List>\n</Nav.Root>`,
      },
      {
        key: "accordion", name: "Accordion",
        render: () => (
          <div className="w-80">
            <Accordion type="multiple" defaultOpen={["f"]}>
              <Accordion.Item value="f"><Accordion.Header>Fondations</Accordion.Header><Accordion.Panel><p className="m-0 text-sm text-text-secondary">Couleur, espacement, typographie, grille.</p></Accordion.Panel></Accordion.Item>
              <Accordion.Item value="c"><Accordion.Header>Composants</Accordion.Header><Accordion.Panel><p className="m-0 text-sm text-text-secondary">Select, Switch, Accordion…</p></Accordion.Panel></Accordion.Item>
            </Accordion>
          </div>
        ),
        code: () => `<Accordion type="multiple">\n  <Accordion.Item value="f"><Accordion.Header>…</Accordion.Header><Accordion.Panel>…</Accordion.Panel></Accordion.Item>\n</Accordion>`,
      },
      {
        key: "tabs", name: "Tabs",
        controls: [
          { k: "variant", type: "seg", label: "Facture", opts: axisOpts("Tabs", "variant") },
          { k: "activation", type: "seg", label: "Activation", opts: axisOpts("Tabs", "activation") },
        ],
        initial: { variant: "line", activation: "auto" },
        render: (s) => <TabsDemo variant={s.variant} activation={s.activation} />,
        code: (s) => `<Tabs.Root defaultValue="essentiel"${s.variant === "pill" ? ' variant="pill"' : ""}${s.activation === "manual" ? ' activation="manual"' : ""}>\n  <Tabs.List label="…"><Tabs.Tab value="essentiel">L'essentiel</Tabs.Tab>…</Tabs.List>\n  <Tabs.Panel value="essentiel">…</Tabs.Panel>\n</Tabs.Root>`,
      },
      {
        key: "toc", name: "TableOfContents",
        render: () => (
          <TableOfContents items={[{ id: "s1", label: "Modal vs non-modal" }, { id: "s2", label: "Ordre d'empilement" }, { id: "s3", label: "Voile (scrim)" }]} />
        ),
        code: () => `<TableOfContents items={[{ id, label }, …]} />`,
      },
      {
        key: "skiplink", name: "SkipLink",
        render: () => (
          /* Le cadre de la démo est une VRAIE Card (surface de contenu), plus un div
             bordé-arrondi local ; les liens factices sont des Link du kit. */
          <Card.Root className="w-full max-w-md">
            <Card.Body>
              {/* Le lien est le PREMIER focalisable du cadre — masqué jusqu'au focus, il apparaît
                  en haut à gauche DU CADRE (focus:absolute surclasse le focus:fixed du composant). */}
              <SkipLink href="#skiplink-demo-main" className="focus:absolute focus:left-sm focus:top-sm" />
              <p className="m-0 text-sm text-text-secondary">
                1 · Clique ici puis appuie sur <b className="text-text-primary">Tab</b> : le lien
                « Aller au contenu » apparaît. 2 · <b className="text-text-primary">Entrée</b> :
                le focus saute la nav et atterrit sur le contenu, encadré ci-dessous.
              </p>
              <nav aria-label="Nav factice" className="mt-sm flex gap-md text-sm">
                <Link href="#" context="navigation" onClick={(e) => e.preventDefault()}>Produits</Link>
                <Link href="#" context="navigation" onClick={(e) => e.preventDefault()}>Tarifs</Link>
                <Link href="#" context="navigation" onClick={(e) => e.preventDefault()}>Contact</Link>
              </nav>
              <div
                id="skiplink-demo-main"
                tabIndex={-1}
                className="mt-sm rounded-md bg-surface p-md text-sm text-text-secondary outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[color:var(--control-focus-color)]"
              >
                Contenu principal — le focus arrive ici, en sautant la nav.
              </div>
            </Card.Body>
          </Card.Root>
        ),
        code: () => `<SkipLink href="#main">Aller au contenu</SkipLink>\n{/* … nav … */}\n<main id="main" tabIndex={-1}>…</main>`,
      },
    ],
  },
  {
    label: "Overlays",
    items: [
      {
        key: "drawer", name: "Drawer",
        fill: true, // comme AppLayout : le Frame remplit la case démo et l'aperçu plein écran
        controls: [
          { k: "side", type: "seg", label: "Côté", opts: axisOpts("Drawer", "side") },
          { k: "size", type: "seg", label: "Taille", opts: axisOpts("Drawer", "size") },
          { k: "effect", type: "seg", label: "Effet", opts: axisOpts("Drawer", "effect"), disabled: (s) => s.side === "top" || s.side === "bottom" },
          { k: "depth", type: "bool", label: "Depth" },
        ],
        initial: { side: "start", size: "narrow", effect: "overlay", depth: false },
        render: (s) => <DrawerDemo side={s.side} size={s.size} effect={s.effect} depth={s.depth} />,
        code: (s) => {
          const defSize = s.side === "top" || s.side === "bottom" ? "full" : "narrow";
          return `<Drawer.Frame>{/* page */}\n  <Drawer open={open} onClose={close} side="${s.side}"${s.size !== defSize ? ` size="${s.size}"` : ""}${s.effect !== "overlay" ? ` effect="${s.effect}"` : ""}${s.depth ? " depth" : ""} aria-label="…">…</Drawer>\n</Drawer.Frame>`;
        },
      },
      {
        key: "modal", name: "Modal",
        controls: [
          { k: "size", type: "seg", label: "Largeur", opts: axisOpts("Modal", "size") },
          { k: "placement", type: "seg", label: "Position", opts: axisOpts("Modal", "placement") },
          { k: "enterFrom", type: "seg", label: "Apparition", opts: axisOpts("Modal", "enterFrom") },
          { k: "scrim", type: "bool", label: "Clic sur le voile ferme" },
        ],
        initial: { size: "narrow", placement: "center", enterFrom: "bottom", scrim: true },
        render: (s) => <ModalDemo size={s.size} scrim={s.scrim} placement={s.placement} enterFrom={s.enterFrom} />,
        code: (s) =>
          `<Modal open={open} onClose={close} size="${s.size}"${s.placement !== "center" ? ` placement="${s.placement}"` : ""}${s.enterFrom !== "bottom" ? ` enterFrom="${s.enterFrom}"` : ""}${s.scrim ? "" : " dismissOnScrim={false}"}>\n  <Modal.Header kicker="…">Titre</Modal.Header>\n  <Modal.Body>…</Modal.Body>\n  <Modal.Footer>…</Modal.Footer>\n</Modal>`,
      },
      {
        key: "dropdown", name: "Dropdown",
        controls: [
          { k: "side", type: "seg", label: "Côté", opts: axisOpts("Dropdown", "side") },
          { k: "align", type: "seg", label: "Alignement", opts: axisOpts("Dropdown", "align") },
          { k: "icons", type: "bool", label: "Icônes" },
        ],
        initial: { side: "auto", align: "auto", icons: true },
        blocks: [
          {
            title: "Ancré — un déclencheur ouvre le menu (motif menu button)",
            render: (s) => <DropdownDemo side={s.side} align={s.align} icons={s.icons} />,
            code: (s) =>
              `<Dropdown.Root>\n  <Dropdown.Trigger asChild><Button.Root>Options</Button.Root></Dropdown.Trigger>\n  <Dropdown.Content${s.side !== "auto" ? ` side="${s.side}"` : ""}${s.align !== "auto" ? ` align="${s.align}"` : ""}>\n    <Dropdown.Label>Compte</Dropdown.Label>\n    <Dropdown.Item icon={<User />} onSelect={fn}>Profil</Dropdown.Item>\n    <Dropdown.Item disabled>Facturation</Dropdown.Item>\n    <Dropdown.Separator />\n    <Dropdown.Item checked closeOnClick={false} onSelect={fn}>Plus récent</Dropdown.Item>\n  </Dropdown.Content>\n</Dropdown.Root>`,
          },
          {
            title: "En ligne — sans déclencheur, le panneau vit dans la page",
            render: (s) => <DropdownInlineDemo icons={s.icons} />,
            code: () =>
              `<Dropdown.Inline aria-label="Options">\n  <Dropdown.Label>Compte</Dropdown.Label>\n  <Dropdown.Item icon={<User />} onSelect={fn}>Profil</Dropdown.Item>\n  <Dropdown.Separator />\n  <Dropdown.Item checked onSelect={fn}>Plus récent</Dropdown.Item>\n</Dropdown.Inline>`,
          },
        ],
        render: (s) => <DropdownDemo side={s.side} align={s.align} icons={s.icons} />,
        code: () => `<Dropdown.Root>…</Dropdown.Root>`,
      },
    ],
  },
  {
    label: "Formulaire",
    items: [
      {
        key: "select", name: "Select",
        controls: [
          { k: "size", type: "seg", opts: axisOpts("Select", "size") },
          { k: "variant", type: "seg", opts: axisOpts("Select", "variant") },
          { k: "native", type: "bool", label: "Liste native (navigateur)" },
          { sec: "Interaction", k: "skeleton", type: "bool", label: "Skeleton" },
        ],
        initial: { value: "md", size: "md", variant: "default", native: false, skeleton: false },
        render: (s, set) => (
          // hauteur réservée : la listbox ouverte doit tenir dans la fenêtre de démo
          <div className="flex min-h-[280px] w-64 items-start justify-center pt-md">
            <Select
              options={SITE_OPTS}
              value={s.value}
              onValueChange={(v) => set("value", v)}
              size={s.size}
              variant={s.variant}
              native={s.native}
              loading={s.skeleton}
              aria-label="Site"
            />
          </div>
        ),
        code: (s) => `<Select options={OPTS} value="${s.value}" onValueChange={setV}${s.size !== "md" ? ` size="${s.size}"` : ""}${s.variant === "ghost" ? ' variant="ghost"' : ""}${s.native ? " native" : ""} aria-label="Site" />`,
      },
      {
        key: "checkbox", name: "Checkbox",
        controls: [
          { k: "size", type: "seg", opts: axisOpts("Checkbox", "size") },
          { k: "groupe", type: "bool", label: "Dans son groupe" },
          { k: "helper", type: "bool", label: "Aide par option" },
          { k: "exclusive", type: "bool", label: "Option « aucune »", disabled: (s) => !s.groupe },
          { sec: "État", k: "indeterminate", type: "bool", label: "Indéterminé", disabled: (s) => s.groupe },
          { sec: "État", k: "error", type: "bool", label: "Erreur" },
          { sec: "État", k: "disabled", type: "bool", label: "Désactivé" },
        ],
        initial: { size: "md", groupe: true, helper: true, exclusive: true, indeterminate: false, error: false, disabled: false, valeurs: ["design"], seule: false },
        render: (s, set) =>
          s.groupe ? (
            // fili-check-allow: statut-sans-verdict — atelier : fixture de présentation, l'erreur est le SUJET du contrôle « Erreur »
            <Checkbox.Group
              label="Centres d'intérêt"
              size={s.size}
              disabled={s.disabled}
              value={s.valeurs}
              onValueChange={(v) => set("valeurs", v)}
              error={s.error ? "Choisissez au moins un sujet." : undefined}
              helper={s.error ? undefined : "Plusieurs réponses possibles."}
            >
              <Checkbox value="design" label="Design" helper={s.helper ? "Fondations, composants, doctrine." : undefined} />
              <Checkbox value="code" label="Développement" />
              {/* CHOICE-R18 : l'option exclusive se déclare sur l'OPTION, et se pose en dernier. */}
              {s.exclusive ? <Checkbox value="aucun" label="Aucun de ces sujets" exclusive /> : null}
            </Checkbox.Group>
          ) : (
            // fili-check-allow: statut-sans-verdict — atelier : fixture de présentation d'une case isolée
            <Checkbox
              label="J'accepte les conditions d'utilisation"
              helper={s.helper ? "Vous pourrez les relire à tout moment." : undefined}
              size={s.size}
              status={s.error ? "error" : "default"}
              indeterminate={s.indeterminate}
              checked={s.seule}
              onCheckedChange={(v) => set("seule", v)}
              disabled={s.disabled}
            />
          ),
        code: (s) =>
          s.groupe
            ? `<Checkbox.Group label="Centres d'intérêt" value={valeurs} onValueChange={setValeurs}${s.size !== "md" ? ` size="${s.size}"` : ""}${s.error ? ' error="Choisissez au moins un sujet."' : ""}${s.disabled ? " disabled" : ""}>\n  <Checkbox value="design" label="Design"${s.helper ? ' helper="Fondations, composants, doctrine."' : ""} />\n  <Checkbox value="code" label="Développement" />${s.exclusive ? `\n  <Checkbox value="aucun" label="Aucun de ces sujets" exclusive />` : ""}\n</Checkbox.Group>`
            : `<Checkbox label="J'accepte les conditions d'utilisation" checked={v} onCheckedChange={setV}${s.size !== "md" ? ` size="${s.size}"` : ""}${s.helper ? ' helper="Vous pourrez les relire à tout moment."' : ""}${s.indeterminate ? " indeterminate" : ""}${s.error ? ' status="error"' : ""}${s.disabled ? " disabled" : ""} />`,
      },
      {
        key: "radio", name: "Radio",
        controls: [
          { k: "size", type: "seg", opts: axisOpts("Radio", "size") },
          { k: "helper", type: "bool", label: "Aide par option" },
          { sec: "État", k: "error", type: "bool", label: "Erreur" },
          { sec: "État", k: "disabled", type: "bool", label: "Désactivé" },
        ],
        initial: { size: "md", helper: true, error: false, disabled: false, valeur: "annuel" },
        /* Aucun `Radio` nu ici : hors de son groupe il n'a pas d'exclusivité, donc pas de sens
           (CHOICE-R05). L'atelier montre l'usage juste, pas l'usage possible. */
        render: (s, set) => (
          // fili-check-allow: statut-sans-verdict — atelier : fixture de présentation, l'erreur est le SUJET du contrôle « Erreur »
          <Radio.Group
            label="Formule"
            size={s.size}
            disabled={s.disabled}
            value={s.valeur}
            onValueChange={(v) => set("valeur", v)}
            error={s.error ? "Choisissez une formule pour continuer." : undefined}
            helper={s.error ? undefined : "Vous pourrez changer à tout moment."}
          >
            <Radio value="mensuel" label="Mensuel" helper={s.helper ? "Sans engagement." : undefined} />
            <Radio value="annuel" label="Annuel" helper={s.helper ? "Deux mois offerts." : undefined} />
          </Radio.Group>
        ),
        code: (s) =>
          `<Radio.Group label="Formule" value={formule} onValueChange={setFormule}${s.size !== "md" ? ` size="${s.size}"` : ""}${s.error ? ' error="Choisissez une formule pour continuer."' : ""}${s.disabled ? " disabled" : ""}>\n  <Radio value="mensuel" label="Mensuel"${s.helper ? ' helper="Sans engagement."' : ""} />\n  <Radio value="annuel" label="Annuel"${s.helper ? ' helper="Deux mois offerts."' : ""} />\n</Radio.Group>`,
      },
      {
        key: "form-messages", name: "Messages de validation",
        controls: [
          { k: "famille", type: "seg", label: "Famille", opts: ["Saisie", "Choix", "Serveur"] },
          { k: "notes", type: "bool", label: "Afficher les nuances" },
        ],
        initial: { famille: "Saisie", notes: true },
        /* LA TABLE DE RÉFÉRENCE — l'autre moitié de la chaîne de validation.
           Le contrat (`Validation`) ne code AUCUN texte : il en réclame. Cette entrée dit
           lequel, pour chaque contrainte de chaque contrôle. Les données vivent dans
           `messages-validation.ts` ; ce fichier ne fait que les rendre. */
        render: (s) => <TableMessages famille={s.famille as FamilleMessages} notes={s.notes} />,
        code: (s) => extraitCode(s.famille as FamilleMessages),
      },
      {
        key: "switch", name: "Switch",
        controls: [
          { k: "size", type: "seg", opts: axisOpts("Switch", "size") },
          { k: "checked", type: "bool", label: "Activé" },
          { k: "text", type: "bool", label: "Texte" },
          { sec: "Interaction", k: "skeleton", type: "bool", label: "Skeleton" },
        ],
        initial: { size: "md", checked: true, text: true, skeleton: false },
        render: (s, set) => (
          <Switch
            checked={s.checked}
            onCheckedChange={(v) => set("checked", v)}
            size={s.size}
            label={s.text ? (s.checked ? "Activé" : "Désactivé") : undefined}
            aria-label={s.text ? undefined : "Exemple"}
            loading={s.skeleton}
          />
        ),
        code: (s) => `<Switch checked={${s.checked}} onCheckedChange={setOn}${s.size !== "md" ? ` size="${s.size}"` : ""}${s.text ? ' label="Activé"' : ' aria-label="…"'} />`,
      },
    ],
  },
  {
    label: "Actions",
    items: [
      {
        key: "button", name: "Button",
        controls: [
          { k: "variant", type: "seg", opts: axisOpts("Button", "variant") },
          { k: "tone", type: "seg", opts: axisOpts("Button", "tone") },
          { k: "size", type: "seg", opts: axisOpts("Button", "size") },
          { k: "icon", type: "seg", opts: ["none", "leading", "trailing", "both", "only"], label: "Icône" },
          { k: "label", type: "text", label: "Label" },
          { k: "disabled", type: "bool", label: "Disabled", sec: "Interaction" },
          { k: "skeleton", type: "bool", label: "Skeleton", sec: "Interaction" },
        ],
        initial: { variant: axisDefault("Button", "variant"), tone: axisDefault("Button", "tone"), size: axisDefault("Button", "size"), icon: "none", label: "Enregistrer", disabled: false, skeleton: false },
        render: (s) => {
          const ic = (
            <Button.Icon>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </Button.Icon>
          );
          const only = s.icon === "only";
          const lead = s.icon === "leading" || s.icon === "both" || only;
          const trail = s.icon === "trailing" || s.icon === "both";
          return (
            <Button.Root variant={s.variant} tone={s.tone} size={s.size} iconOnly={only} disabled={s.disabled} loading={s.skeleton} aria-label={only ? s.label || "Action" : undefined}>
              {lead ? ic : null}
              {!only ? s.label || "Bouton" : null}
              {trail ? ic : null}
            </Button.Root>
          );
        },
        code: (s, fw) => {
          const t = s.label || "Bouton";
          if (fw === "html") return `<button class="btn btn--${s.variant} btn--${s.tone} btn--${s.size}">${t}</button>`;
          if (fw === "angular") return `<button dsButton variant="${s.variant}" tone="${s.tone}" size="${s.size}">${t}</button>`;
          if (fw === "tailwind") return `<button class="inline-flex items-center gap-2 rounded-md px-md py-xs bg-primary text-on-primary">${t}</button>`;
          return `<Button.Root variant="${s.variant}" tone="${s.tone}" size="${s.size}">${t}</Button.Root>`;
        },
      },
      {
        key: "link", name: "Link",
        controls: [
          { k: "context", type: "seg", opts: axisOpts("Link", "context") },
          { k: "icon", type: "seg", label: "Icône", opts: ["none", "leading", "trailing"] },
          { k: "label", type: "text", label: "Label" },
          { k: "current", type: "bool", label: "Courant (navigation)" },
          { sec: "Interaction", k: "skeleton", type: "bool", label: "Skeleton" },
        ],
        initial: { context: "standalone", icon: "none", label: "En savoir plus", current: false, skeleton: false },
        render: (s) => {
          if (s.skeleton) return <Sk w={128} h={16} />;
          const lead = s.icon === "leading";
          const trail = s.icon === "trailing";
          const isz = s.context === "inline" ? "sm" : "md";
          const iconCls = s.context === "inline" ? "self-center" : undefined;
          const inner = (
            <Link href="#" context={s.context} current={s.current} className={s.context === "inline" ? "items-baseline" : undefined}>
              {lead ? <Link.Icon size={isz} className={iconCls}>{IC_ARROW}</Link.Icon> : null}
              {s.label || "Lien"}
              {trail ? <Link.Icon size={isz} className={iconCls}>{IC_ARROW}</Link.Icon> : null}
            </Link>
          );
          return s.context === "inline" ? <p className="m-0 text-sm text-text-primary">Un {inner} dans une phrase.</p> : inner;
        },
        code: (s) => `<Link href="#" context="${s.context}"${s.current ? " current" : ""}>${s.label || "Lien"}</Link>`,
      },
      {
        key: "chip", name: "Chip",
        controls: [
          { k: "variant", type: "seg", opts: axisOpts("Chip", "variant") },
          { k: "mono", type: "bool", label: "Mono (identifiant)" },
          { k: "label", type: "text", label: "Label" },
          { sec: "Interaction", k: "skeleton", type: "bool", label: "Skeleton" },
        ],
        initial: { variant: axisDefault("Chip", "variant"), mono: false, label: "Situations qui l'éprouvent", skeleton: false },
        render: (s) => {
          if (s.skeleton) return <Sk w={160} h={24} r="var(--radius-md)" />;
          // La chip vit en NUÉE (CHIP-R02) : la démo montre l'usage canonique, pas la pièce isolée.
          return (
            <div className="flex max-w-sm flex-wrap gap-2">
              <Chip variant={s.variant} mono={s.mono}>{s.label || "Renvoi"} →</Chip>
              <Chip variant={s.variant} mono>BUTTON-R12</Chip>
              <Chip variant={s.variant} mono>CARD-R03</Chip>
            </div>
          );
        },
        code: (s) => `<div className="flex flex-wrap gap-2">
  <Chip${s.variant !== "outline" ? ` variant="${s.variant}"` : ""}${s.mono ? " mono" : ""} onClick={ouvrirVolet}>${s.label || "Renvoi"} →</Chip>
  <Chip${s.variant !== "outline" ? ` variant="${s.variant}"` : ""} mono onClick={ouvrirVolet}>BUTTON-R12</Chip>
</div>`,
      },
    ],
  },
  {
    label: "Actions animées",
    items: [
      {
        key: "delete", name: "DeleteButton", replay: true,
        controls: [
          { k: "size", type: "seg", opts: axisOpts("DeleteButton", "size") },
          { k: "text", type: "text", label: "Label" },
          { k: "async", type: "seg", label: "Opération", opts: ["instant", "lent", "échec"] },
          { sec: "Interaction", k: "skeleton", type: "bool", label: "Skeleton" },
        ],
        initial: { size: "lg", text: "Supprimer", async: "lent", skeleton: false },
        render: (s) =>
          s.skeleton ? <Sk w={128} h={s.size === "sm" ? 32 : s.size === "md" ? 40 : 48} r="var(--radius-md)" /> : (
            <DeleteButton size={s.size} onDelete={asyncOp(s.async)}>{s.text || "Supprimer"}</DeleteButton>
          ),
        code: (s) => `<DeleteButton size="${s.size}" onDelete={fn}>${s.text || "Supprimer"}</DeleteButton>`,
      },
      {
        key: "submit", name: "SubmitButton", replay: true,
        controls: [
          { k: "size", type: "seg", opts: axisOpts("SubmitButton", "size") },
          { k: "text", type: "text", label: "Label" },
          { k: "async", type: "seg", label: "Opération", opts: ["instant", "lent", "échec"] },
          { sec: "Interaction", k: "skeleton", type: "bool", label: "Skeleton" },
        ],
        initial: { size: "lg", text: "Envoyer", async: "lent", skeleton: false },
        render: (s) =>
          s.skeleton ? <Sk w={128} h={s.size === "sm" ? 32 : s.size === "md" ? 40 : 48} r="var(--radius-md)" /> : (
            <SubmitButton size={s.size} onSubmit={asyncOp(s.async)}>{s.text || "Envoyer"}</SubmitButton>
          ),
        code: (s) => `<SubmitButton size="${s.size}" onSubmit={fn}>${s.text || "Envoyer"}</SubmitButton>`,
      },
    ],
  },
  {
    label: "Theming",
    items: [
      {
        key: "themetoggle", name: "ThemeToggle",
        // Pas d'option « Sombre » dans le Playground : le thème appartient au panneau Theming ;
        // la bascule de la démo se manipule directement dans l'aperçu.
        controls: [
          { k: "size", type: "seg", opts: axisOpts("ThemeToggle", "size") },
          { k: "text", type: "bool", label: "Texte" },
          { sec: "Interaction", k: "skeleton", type: "bool", label: "Skeleton" },
        ],
        initial: { size: "md", checked: false, text: true, skeleton: false },
        render: (s, set) => (
          <ThemeToggle
            checked={s.checked}
            onCheckedChange={(v) => set("checked", v)}
            size={s.size}
            label={s.text ? (s.checked ? "Sombre" : "Clair") : undefined}
            aria-label={s.text ? undefined : "Thème sombre"}
            loading={s.skeleton}
          />
        ),
        code: (s) => `<ThemeToggle checked={${s.checked}} onCheckedChange={setDark}${s.size !== "md" ? ` size="${s.size}"` : ""}${s.text ? ' label="Sombre"' : ' aria-label="Thème sombre"'} />`,
      },
    ],
  },
  {
    label: "Champs & actions",
    items: [
      {
        key: "input", name: "Input",
        controls: [
          { k: "type", type: "seg", label: "field_type", opts: ["text", "email", "password", "search", "tel", "number", "url", "textarea"] },
          { k: "size", type: "seg", opts: axisOpts("Input", "size") },
          { k: "status", type: "seg", label: "Statut", opts: axisOpts("Input", "status") },
          { k: "icon", type: "bool", label: "Icône (leading)", disabled: (s) => !["text", "email", "tel"].includes(s.type) },
          { k: "clearable", type: "bool", label: "Effaçable", disabled: (s) => !["text", "email", "tel", "url"].includes(s.type) },
          { k: "disabled", type: "bool", label: "Disabled" },
          // Le BLOC CHAMP (Input.Field) : libellé lié, aide, message d'erreur, indicateur de
          // requis. INPUT-R38 exige un libellé toujours visible — le kit l'outille depuis le
          // 2026-07-30 au lieu de le laisser à chaque page.
          { sec: "Bloc champ", k: "label", type: "bool", label: "Libellé (Input.Field)" },
          { sec: "Bloc champ", k: "required", type: "bool", label: "Requis", disabled: (s) => !s.label },
          { sec: "Bloc champ", k: "helper", type: "bool", label: "Texte d'aide", disabled: (s) => !s.label },
          { sec: "Interaction", k: "skeleton", type: "bool", label: "Skeleton" },
        ],
        initial: { type: "text", size: "md", status: "default", icon: false, clearable: true, disabled: false, label: true, required: false, helper: true, skeleton: false },
        render: (s) => {
          const icon = s.icon && ["text", "email", "tel"].includes(s.type) ? <Input.Icon>{IC_MAIL}</Input.Icon> : null;
          // Les textes suivent la NATURE de la donnée : un champ de recherche ne demande pas
          // « une adresse au format nom@domaine.fr ».
          const t = TEXTES_INPUT[s.type] ?? TEXTES_INPUT.text;
          // Avec un libellé visible, plus d'aria-label : il le COMPLÉTERAIT au mieux, le
          // contredirait au pire (INPUT-R33, « Label in Name »). Le libellé fait le nom.
          const nom = (n: string) => (s.label ? undefined : n);
          const field =
            s.type === "password" ? (
              <Input.Password placeholder="••••••••" disabled={s.disabled} aria-label={nom(t.nom)} />
            ) : s.type === "search" ? (
              <Input.Search placeholder="INPUT-R38, focus, bordure…" disabled={s.disabled} aria-label={nom(t.nom)} />
            ) : s.type === "number" ? (
              <Input.Number defaultValue={2} min={0} max={99} disabled={s.disabled} aria-label={nom(t.nom)} />
            ) : s.type === "url" ? (
              <>
                <Input.InlineAffix>https://</Input.InlineAffix>
                <Input.Input type="url" placeholder="fili.fr" clearable={s.clearable} disabled={s.disabled} aria-label={nom(t.nom)} />
              </>
            ) : (
              <Input.Input
                key={s.type} // le defaultValue suit le type (champ non contrôlé)
                type={s.type}
                defaultValue={s.type === "email" ? "aurelien@fili.fr" : s.type === "tel" ? "06 12 34 56 78" : "Texte saisi"}
                placeholder={s.type === "email" ? "nom@domaine.fr" : s.type === "tel" ? "06 12 34 56 78" : "Votre texte"}
                autoComplete={s.type === "email" ? "email" : s.type === "tel" ? "tel" : undefined}
                clearable={s.clearable}
                disabled={s.disabled}
                aria-label={nom(t.nom)}
              />
            );
          const dedans =
            s.type === "textarea" ? (
              <Input.Textarea placeholder="Votre message…" rows={3} disabled={s.disabled} aria-label={nom(t.nom)} />
            ) : (
              <Input.Wrapper>
                {icon}
                {field}
              </Input.Wrapper>
            );
          return (
            <div className="w-72">
              {s.label ? (
                // Field FOURNIT size et status par contexte ; Root les lit comme défauts —
                // même contrat que CardGroup → Card, il ne les répète donc pas.
                // fili-check-allow: statut-sans-verdict — atelier : fixture de présentation, l'état EST le sujet de la démonstration (le formulaire pilote, lui, dérive tout d'un verdict)
                <Input.Field size={s.size} status={s.status} required={s.required}>
                  <Input.Label>{t.label}</Input.Label>
                  <Input.Root loading={s.skeleton}>{dedans}</Input.Root>
                  {s.helper ? <Input.Helper>{t.helper}</Input.Helper> : null}
                  <Input.Error>{t.erreur}</Input.Error>
                </Input.Field>
              ) : (
                // fili-check-allow: statut-sans-verdict — atelier : fixture de présentation d'un cadre isolé
                <Input.Root size={s.size} status={s.status} loading={s.skeleton}>
                  {dedans}
                </Input.Root>
              )}
            </div>
          );
        },
        code: (s) => {
          const t = TEXTES_INPUT[s.type] ?? TEXTES_INPUT.text;
          // Dans un bloc champ, size et status vivent sur Field (contexte) : Root ne les répète pas.
          const champ = (inner: string) =>
            `<Input.Field size="${s.size}"${s.status !== "default" ? ` status="${s.status}"` : ""}${s.required ? " required" : ""}>\n` +
            `  <Input.Label>${t.label}</Input.Label>\n` +
            `  <Input.Root>${inner}</Input.Root>\n` +
            (s.helper ? `  <Input.Helper>${t.helper}</Input.Helper>\n` : "") +
            `  <Input.Error>${t.erreur}</Input.Error>\n` +
            `</Input.Field>`;
          const root = (inner: string) =>
            s.label
              ? champ(inner)
              : `<Input.Root size="${s.size}"${s.status !== "default" ? ` status="${s.status}"` : ""}>${inner}</Input.Root>`;
          if (s.type === "textarea") return root(`<Input.Textarea placeholder="\u2026" rows={3} />`);
          const wrap = (inner: string) => root(`<Input.Wrapper>${inner}</Input.Wrapper>`);
          if (s.type === "password") return wrap(`<Input.Password aria-label="${t.nom}" />`);
          if (s.type === "search") return wrap(`<Input.Search placeholder="INPUT-R38, focus\u2026" aria-label="${t.nom}" />`);
          if (s.type === "number") return wrap(`<Input.Number min={0} max={99} aria-label="${t.nom}" />`);
          if (s.type === "url") return wrap(`<Input.InlineAffix>https://</Input.InlineAffix><Input.Input type="url"${s.clearable ? " clearable" : ""} />`);
          return wrap(`${s.icon ? "<Input.Icon>\u2026</Input.Icon>" : ""}<Input.Input type="${s.type}"${s.type === "email" ? ' autoComplete="email"' : s.type === "tel" ? ' autoComplete="tel"' : ""}${s.clearable ? " clearable" : ""}${s.disabled ? " disabled" : ""} />`);
        },
      },
      {
        key: "compact", name: "CompactButton",
        controls: [
          { k: "variant", type: "seg", opts: axisOpts("CompactButton", "variant") },
          { k: "tone", type: "seg", opts: axisOpts("CompactButton", "tone") },
          { k: "size", type: "seg", opts: axisOpts("CompactButton", "size") },
          { k: "fullRadius", type: "bool", label: "Full radius" },
          { k: "disabled", type: "bool", label: "Disabled" },
          { sec: "Interaction", k: "skeleton", type: "bool", label: "Skeleton" },
        ],
        initial: { variant: axisDefault("CompactButton", "variant"), tone: axisDefault("CompactButton", "tone"), size: axisDefault("CompactButton", "size"), fullRadius: false, disabled: false, skeleton: false },
        render: (s) => (
          <CompactButton variant={s.variant} tone={s.tone} size={s.size} fullRadius={s.fullRadius} disabled={s.disabled} loading={s.skeleton} aria-label="Fermer">
            {IC_CLOSE}
          </CompactButton>
        ),
        code: (s) => `<CompactButton variant="${s.variant}" tone="${s.tone}" size="${s.size}"${s.fullRadius ? " fullRadius" : ""} aria-label="Fermer"><CloseIcon /></CompactButton>`,
      },
    ],
  },
  {
    label: "Contenu & feedback",
    items: [
      {
        // Card SEULE — l'entrée rend DIRECTEMENT `Card.Root` et ses sous-composants
        // (aucun helper local) ; l'extrait affiché est l'API publique, copiable telle
        // quelle. La collection vit dans l'entrée CardGroup ci-dessous — c'est un PATTERN
        // (Collection), pas une seconde famille de Card.
        key: "card", name: "Card",
        controls: [
          { k: "media", type: "seg", label: "Media", opts: ["icône", "image", "aucun"] },
          // Pastille au-dessus du titre ou à sa gauche : pure COMPOSITION (un wrapper de
          // layout), pas un axe de Card — l'extrait affiché montre le wrapper réel.
          { k: "icone", type: "seg", label: "Pastille", opts: ["au-dessus", "à gauche"], disabled: (s) => s.media !== "icône" },
          // API réelle adaptiveMedia : ON = le media passe sur le flanc dès ~24rem reçus
          // (état regular — la poignée de l'aperçu le démontre) ; OFF = toujours EMPILÉ,
          // media AU-DESSUS du texte, quelle que soit la largeur.
          { k: "adaptive", type: "bool", label: "Media adaptatif (flanc dès ~24rem)", disabled: (s) => s.media !== "image" },
          { k: "description", type: "bool", label: "Description" },
          { k: "buttons", type: "bool", label: "Boutons" },
          { k: "density", type: "seg", label: "Densité", opts: axisOpts("Card", "density") },
          { sec: "Interaction", k: "mode", type: "seg", label: "Mode", opts: axisOpts("Card", "mode") },
          { sec: "Interaction", k: "skeleton", type: "bool", label: "Skeleton" },
        ],
        initial: {
          media: "icône", icone: "au-dessus", adaptive: true, description: true, buttons: false,
          density: axisDefault("Card", "density"), mode: axisDefault("Card", "mode"), skeleton: false,
        },
        render: (s) => <CardDemo s={s as any} />,
        code: (s) => codeCard(s as any),
      },
      {
        // Le PATTERN COLLECTION : colonnes, jointure, régime, mode — ses enfants sont de
        // vraies `Card.Root` (l'API CardGroup.Card a été supprimée le 2026-07-30) ; le
        // contenu des cartes se règle sur la page Card, à qui il appartient.
        key: "card-group", name: "CardGroup",
        controls: [
          { k: "density", type: "seg", label: "Densité", opts: axisOpts("CardGroup", "density") },
          { k: "cols", type: "seg", label: "Colonnes", opts: ["1", "2", "3"] },
          { k: "separated", type: "bool", label: "Séparées" },
          { sec: "Interaction", k: "mode", type: "seg", label: "Mode", opts: axisOpts("CardGroup", "mode") },
          // Le régime appartient au GROUPE (CARD-R26) : « aucun » = chaque carte reste autonome.
          { sec: "Interaction", k: "selection", type: "seg", label: "Régime", opts: ["aucun", ...axisOpts("CardGroup", "selection")], disabled: (s) => s.mode !== "selectable" },
          { sec: "Interaction", k: "skeleton", type: "bool", label: "Skeleton" },
        ],
        initial: { density: axisDefault("CardGroup", "density"), cols: "2", separated: true, mode: "selectable", selection: "single", skeleton: false },
        render: (s) => <CardGroupDemo s={s as any} />,
        code: (s) => codeCardGroup(s as any),
      },
      {
        key: "skeleton", name: "Skeleton",
        controls: [
          { k: "variant", type: "seg", opts: axisOpts("Skeleton", "variant") },
          { k: "lines", type: "range", label: "Lignes (text)", min: 1, max: 6, disabled: (s) => s.variant !== "text" },
        ],
        initial: { variant: "block", lines: 3 },
        blocks: [
          {
            title: "Variantes — block / text / circle",
            render: (s) =>
              s.variant === "text" ? (
                <Skeleton variant="text" lines={s.lines} className="w-64" />
              ) : s.variant === "circle" ? (
                <Skeleton variant="circle" width={48} height={48} />
              ) : (
                <Skeleton width={224} height={96} />
              ),
            code: (s) =>
              s.variant === "text"
                ? `<Skeleton variant="text" lines={${s.lines}} />`
                : s.variant === "circle"
                  ? `<Skeleton variant="circle" width={48} height={48} />`
                  : `<Skeleton width={224} height={96} />`,
          },
          {
            title: "Composition — et la prop loading des composants",
            render: () => (
              <div className="flex w-full max-w-sm flex-col gap-md">
                <div className="flex items-center gap-md">
                  <Skeleton variant="circle" width={40} height={40} />
                  <div className="flex-1"><Skeleton variant="text" lines={2} /></div>
                </div>
                <Input.Root loading><Input.Wrapper><Input.Input aria-label="Champ" /></Input.Wrapper></Input.Root>
                <div className="flex items-center gap-sm">
                  <Button.Root loading>Enregistrer</Button.Root>
                  <Button.Root variant="stroke" tone="neutral" loading>Annuler</Button.Root>
                  <Switch checked loading aria-label="Option" />
                </div>
              </div>
            ),
            code: () => `{/* chaque composant expose loading — squelette à SES dimensions */}\n<Button.Root loading>Enregistrer</Button.Root>\n<Input.Root loading>…</Input.Root>\n<Select options={OPTS} loading … />\n<Switch checked loading aria-label="…" />\n<Card.Root loading />`,
          },
        ],
        render: () => <Skeleton width={224} height={96} />,
        code: () => `<Skeleton width={224} height={96} />`,
      },
      {
        key: "alert", name: "Alert",
        controls: [
          { k: "tone", type: "seg", opts: axisOpts("Alert", "tone") },
          { k: "title", type: "text", label: "Titre" },
          { k: "description", type: "text", label: "Description" },
          { k: "dismissible", type: "bool", label: "Dismissible" },
          { sec: "Interaction", k: "skeleton", type: "bool", label: "Skeleton" },
        ],
        initial: { tone: "info", title: "Notification", description: "Un message contextuel qui s'installe dans la page.", dismissible: false, skeleton: false },
        render: (s) =>
          s.skeleton ? (
            /* Squelette composé du kit (Skeleton) — plus de fausse carte bordée à la main :
               l'alerte au repos n'a pas d'autre contour que le sien, le squelette non plus. */
            <div className="flex w-full max-w-md items-start gap-md">
              <Sk w={20} h={20} r="9999px" />
              <div className="flex flex-1 flex-col gap-2 pt-0.5"><Sk w="45%" h={12} /><Sk w="85%" h={10} /></div>
            </div>
          ) : (
            <Alert.Root tone={s.tone} className="max-w-md">
              <Alert.Icon />
              <Alert.Content>
                <Alert.Title>{s.title || "Notification"}</Alert.Title>
                <Alert.Description>{s.description}</Alert.Description>
              </Alert.Content>
              {s.dismissible ? <Alert.Close /> : null}
            </Alert.Root>
          ),
        code: (s) => `<Alert.Root tone="${s.tone}">\n  <Alert.Icon />\n  <Alert.Content><Alert.Title>${s.title || "Notification"}</Alert.Title><Alert.Description>\u2026</Alert.Description></Alert.Content>${s.dismissible ? "\n  <Alert.Close />" : ""}\n</Alert.Root>`,
      },
      {
        key: "toast", name: "Toast",
        controls: [
          { k: "tone", type: "seg", opts: axisOpts("Toast", "tone") },
          { k: "placement", type: "seg", label: "Emplacement", opts: ["bottom", "bottom-start", "bottom-end", "top", "top-start", "top-end"] },
          { k: "title", type: "text", label: "Titre" },
          { k: "description", type: "text", label: "Description" },
          { k: "closing", type: "seg", label: "Fermeture", opts: ["auto", "close", "timer"] },
          { sec: "Interaction", k: "skeleton", type: "bool", label: "Skeleton" },
        ],
        initial: { tone: "neutral", placement: "bottom", title: "Enregistré", description: "Vos changements sont sauvegardés.", closing: "auto", skeleton: false },
        render: (s) =>
          s.skeleton ? (
            /* Même règle que l'Alert : squelette composé du kit, pas de carte recréée. */
            <div className="flex w-80 items-start gap-md">
              <Sk w={20} h={20} r="9999px" />
              <div className="flex flex-1 flex-col gap-2 pt-0.5"><Sk w="50%" h={12} /><Sk w="80%" h={10} /></div>
            </div>
          ) : (
            <ToastDemo s={s} />
          ),
        code: (s) => `${s.placement !== "bottom" ? `<Toast.Provider placement="${s.placement}">\u2026</Toast.Provider>\n` : ""}const { toast } = useToast();\ntoast({${s.tone !== "neutral" ? ` tone: "${s.tone}",` : ""} title: "${s.title || "\u2026"}", description: "\u2026"${s.closing !== "auto" ? `, closing: "${s.closing}"` : ""} });`,
      },
      {
        key: "adacard", name: "StatCard",
        blocks: [
          {
            title: "StatCard — KPI adaptative (compact / regular / expanded)",
            render: () => (
              <StatCard title="Revenu net" period="30 derniers jours" value={48210} format={fmtEur}
                delta={{ value: "+6,4 %", tone: "up" }} spark={ADA_SPARK} details={ADA_DETAILS} showState />
            ),
            code: () => `<StatCard
  title="Revenu net"
  period="30 derniers jours"
  value={48210}
  format={fmtEur}
  delta={{ value: "+6,4 %", tone: "up" }}
  spark={revenus}
  details={[
    ["Nouveaux clients", "312"],
    ["Panier moyen", "154 €"],
    ["Taux de retour", "2,1 %"],
  ]}
  showState
/>`,
          },
          {
            title: "KpiGroup — en-tête + KPI animés (façon HeroUI « With KPIs »)",
            render: () => (
              <KpiGroup title="Métriques clés" period="30 derniers jours" items={ADA_KPIS} />
            ),
            code: () => `<KpiGroup
  title="Métriques clés"
  period="30 derniers jours"
  items={[
    // 1re colonne : valeur animée (count-up) via countTo + format
    { label: "Revenu net", value: "48 210 €", countTo: 48210, format: fmtEur,
      delta: { value: "+6,4 %", tone: "up" }, spark: revenus, color: "var(--primary)" },
    { label: "Commandes", value: "1 284", delta: { value: "+8,1 %", tone: "up" }, spark: commandes, color: "var(--info)" },
    { label: "Conversion", value: "3,7 %", delta: { value: "-1,2 %", tone: "down" }, spark: conv, color: "var(--success)" },
  ]}
/>`,
          },
          {
            title: "AreaChart — aire responsive & animée",
            render: () => (
              <ChartCard title="Chiffre d'affaires" sub="12 derniers mois" delta={{ value: "+14,2 %", tone: "up" }}>
                <AreaChart data={ADA_CA} labels={ADA_MONTHS} label="CA" format={kEur} height={150} />
              </ChartCard>
            ),
            code: () => `<ChartCard title="Chiffre d'affaires" sub="12 derniers mois" delta={{ value: "+14,2 %", tone: "up" }}>
  <AreaChart data={ca} labels={mois} label="CA" format={(n) => fmtInt(n) + " k€"} height={150} />
</ChartCard>`,
          },
          {
            title: "BarChart — barres responsives",
            render: () => (
              <ChartCard title="Souscriptions" sub="7 dernières semaines" delta={{ value: "+9,3 %", tone: "up" }}>
                <BarChart data={ADA_BARS} labels={ADA_WEEKS} label="Souscriptions" height={150} />
              </ChartCard>
            ),
            code: () => `<ChartCard title="Souscriptions" sub="7 dernières semaines" delta={{ value: "+9,3 %", tone: "up" }}>
  <BarChart data={[38, 52, 44, 65, 58, 77, 70]} labels={semaines} label="Souscriptions" height={150} />
</ChartCard>`,
          },
          {
            title: "ComposedChart — barres + ligne",
            render: () => (
              <ChartCard title="Souscriptions vs objectif" sub="7 dernières semaines" delta={{ value: "+9,3 %", tone: "up" }}>
                <ComposedChart data={ADA_COMPOSED} labels={ADA_WEEKS} barLabel="Souscriptions" lineLabel="Objectif" height={150} />
              </ChartCard>
            ),
            code: () => `<ChartCard title="Souscriptions vs objectif" sub="7 dernières semaines" delta={{ value: "+9,3 %", tone: "up" }}>
  <ComposedChart data={data} labels={semaines} barLabel="Souscriptions" lineLabel="Objectif" height={150} />
</ChartCard>`,
          },
          {
            title: "LineChart — multi-séries (façon HeroUI « With Line Chart »)",
            render: () => (
              <ChartCard title="Trafic" sub="12 derniers mois" delta={{ value: "+18,6 %", tone: "up" }}>
                <LineChart series={ADA_TRAFFIC} labels={ADA_TRAFFIC_MONTHS} format={fmtCompact} height={160} />
              </ChartCard>
            ),
            code: () => `<ChartCard title="Trafic" sub="12 derniers mois" delta={{ value: "+18,6 %", tone: "up" }}>
  <LineChart
    series={[
      { label: "Organique", data: organique, color: "var(--ch-cat-1)" },
      { label: "Payant", data: payant, color: "var(--ch-cat-4)" },
    ]}
    labels={mois}
    format={fmtCompact}
    height={160}
  />
</ChartCard>`,
          },
          {
            title: "DonutChart — anneau responsive",
            render: () => (
              <ChartCard title="Répartition des contrats" sub="Par catégorie · 2024">
                <DonutChart data={ADA_PIE} total="12,4k" totalLabel="assurés" ariaLabel="Répartition des contrats par catégorie" />
              </ChartCard>
            ),
            code: () => `<ChartCard title="Répartition des contrats" sub="Par catégorie · 2024">
  <DonutChart
    data={[
      { label: "Vie", value: 34, color: "var(--ch-cat-1)" },
      { label: "Santé", value: 23, color: "var(--ch-cat-2)" },
      { label: "Retraite", value: 18, color: "var(--ch-cat-3)" },
      { label: "Habitation", value: 14, color: "var(--ch-cat-4)" },
      { label: "Auto", value: 11, color: "var(--ch-cat-5)" },
    ]}
    total="12,4k"
    totalLabel="assurés"
    ariaLabel="Répartition des contrats par catégorie"
  />
</ChartCard>`,
          },
        ],
        render: () => (
          <StatCard title="Revenu net" period="30 derniers jours" value={48210} format={fmtEur}
            delta={{ value: "+6,4 %", tone: "up" }} spark={ADA_SPARK} details={ADA_DETAILS} showState />
        ),
        code: () =>
          `<StatCard title="Revenu net" period="30 derniers jours" value={48210} format={fmtEur} delta={{ value: "+6,4 %", tone: "up" }} spark={revenus} details={details} showState />`,
      }
    ],
  },
];
