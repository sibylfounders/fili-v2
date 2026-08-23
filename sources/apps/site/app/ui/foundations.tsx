"use client";
import * as React from "react";

/* ══ Fondations — transcription fidèle d'atelier.html.
   « tokens live » : chaque échantillon est piloté par une var() RÉELLE du système
   (@fili/tokens). Aucune valeur en dur pour la couleur / le rayon / l'espacement /
   la typo / les icônes / le motion — tout suit la bascule de thème. ══ */

const ICONS: Record<string, string> = {
  ArrowRight: '<path d="M5 12h14" /><path d="m13 6 6 6-6 6" />',
  ArrowLeft: '<path d="M19 12H5" /><path d="m11 18-6-6 6-6" />',
  ArrowUp: '<path d="M12 19V5" /><path d="m5 12 7-7 7 7" />',
  ArrowDown: '<path d="M12 5v14" /><path d="m19 12-7 7-7-7" />',
  ChevronRight: '<path d="m9 18 6-6-6-6" />',
  ChevronLeft: '<path d="m15 18-6-6 6-6" />',
  ChevronDown: '<path d="m6 9 6 6 6-6" />',
  ChevronUp: '<path d="m18 15-6-6-6 6" />',
  ChevronsUpDown: '<path d="m7 15 5 5 5-5" /><path d="m7 9 5-5 5 5" />',
  Check: '<path d="M20 6 9 17l-5-5" />',
  X: '<path d="M18 6 6 18" /><path d="m6 6 12 12" />',
  Plus: '<path d="M5 12h14" /><path d="M12 5v14" />',
  Minus: '<path d="M5 12h14" />',
  Search: '<circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />',
  Trash: '<path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M10 11v6" /><path d="M14 11v6" />',
  Edit: '<path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />',
  Copy: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />',
  Download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5" /><path d="M12 15V3" />',
  Upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m17 8-5-5-5 5" /><path d="M12 3v12" />',
  Filter: '<path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />',
  Settings: '<circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />',
  RefreshCw: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" />',
  Info: '<circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />',
  AlertTriangle: '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><path d="M12 9v4" /><path d="M12 17h.01" />',
  AlertCircle: '<circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" />',
  CheckCircle: '<circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />',
  XCircle: '<circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" />',
  HelpCircle: '<circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" />',
  Loader: '<path d="M21 12a9 9 0 1 1-6.219-8.56" />',
  Mail: '<rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />',
  User: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />',
  Eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />',
  EyeOff: '<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.53 13.53 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><path d="m2 2 20 20" />',
  Calendar: '<rect width="18" height="18" x="3" y="4" rx="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" />',
  Clock: '<circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />',
  Bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />',
  Heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />',
  Star: '<path d="M11.5 2.5 14 8l6.1.5-4.6 4 1.4 6-5.4-3.2L6.1 18.5l1.4-6-4.6-4L9 8Z" />',
  ExternalLink: '<path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />',
  Link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />',
  Lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />',
  Menu: '<path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" />',
  MoreHorizontal: '<circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />',
  MoreVertical: '<circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" />',
  Home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" />',
};

const LibIcon: React.FC<{ p: string }> = ({ p }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-full" dangerouslySetInnerHTML={{ __html: p }} />
);

export const FOUNDATIONS: { key: string; title: string; desc: string }[] = [
  { key: "f-couleur", title: "Couleur", desc: "Trois étages : primitives → rôles sémantiques (par mode) → composants. Chaque rôle est une variable liée ; la bascule de thème suit." },
  { key: "f-typo", title: "Typographie", desc: "Échelle de titres fluide (clamp rem+vw, graisse 500), grille de corps label/paragraphe, familles Geist / Inter / JetBrains Mono. Valeurs liées aux tokens --text-*, --size-*, --weight-*." },
  { key: "f-icones", title: "Icônes", desc: "Trois crans fermés appariés au corps de texte (16 ↔ dense, 20 ↔ défaut, 24 ↔ aéré). Trait 1.5, currentColor : l'icône hérite de la couleur du texte. Tokens --icon-sm/md/lg." },
  { key: "f-grille", title: "Grille", desc: "Largeurs de conteneur structurelles — la max-width d'un conteneur de page (≠ point de bascule, ≠ mesure de lecture). Tokens --container-*." },
  { key: "f-ombres", title: "Ombres", desc: "Élévation : raised (survol des cartes cliquables), overlay (superposés), scene (ambiance des gabarits). Dépendante du thème — redéfinie en mode sombre. Tokens --elevation-*." },
  { key: "f-motion", title: "Motion", desc: "Durées bornées sous ~400ms + courbes ; la sortie prend le cran inférieur de son entrée (base → fast, slow → base). Tokens --duration-*, --ease-*." },
  { key: "f-rayon", title: "Rayon", desc: "Crans de rayon d'angle — de none au pill. Le cran lg est réservé aux conteneurs. Tokens --radius-*." },
  { key: "f-espacement", title: "Espacement", desc: "Échelle d'espacement (base 4px) — padding, gaps, marges. Tokens --space-*." },
];

const COL_FAM = [
  { k: "primary", l: "Primary", sub: "primary-subtle", onSub: "on-primary-subtle" },
  { k: "secondary", l: "Secondary" },
  { k: "danger", l: "Danger" },
  { k: "success", l: "Success" },
  { k: "warning", l: "Warning" },
  { k: "info", l: "Info" },
];

/* Échelles tonales (étage 1 — primitives). Fixes par définition (hors mode), mais servies en
   var() comme tout le reste : chaque pas existe en --famille-pas dans tokens.css. */
const RAMPS: [string, (number | string)[]][] = [
  ["neutral", [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]],
  ["indigo", [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]],
  ["teal", [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]],
  ["red", [50, 100, 150, 200, 300, 400, 500, 600, 700, 800, 900, 950]],
  ["green", [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]],
  ["amber", [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]],
  ["sky", [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]],
  ["fuchsia", [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]],
];

function Couleur() {
  const chip = (bg: string, color: string, border: string | undefined, label: string) => (
    <span className="chip" style={{ background: bg, color, border }}>{label}</span>
  );
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="fblock-l">Rôles sémantiques — solide / subtil / contour</p>
        {COL_FAM.map((f) => {
          const sub = f.sub || f.k + "-subtle";
          const onSub = f.onSub || f.k;
          return (
            <div className="chiprow" key={f.k}>
              <span className="rl">{f.k}</span>
              {chip(`var(--${f.k})`, `var(--on-${f.k})`, undefined, f.l)}
              {chip(`var(--${sub})`, `var(--${onSub})`, undefined, f.l)}
              {chip("transparent", `var(--${f.k})`, `1px solid var(--${f.k})`, f.l)}
            </div>
          );
        })}
        <div className="chiprow">
          <span className="rl">neutral</span>
          {chip("var(--neutral)", "var(--on-neutral)", undefined, "Neutral")}
          {chip("var(--surface)", "var(--text-primary)", undefined, "Neutral")}
          {chip("transparent", "var(--text-primary)", "1px solid var(--border-strong)", "Neutral")}
        </div>
        {/* Pas de rangée isolée ici : secondary vit dans COL_FAM (boucle des rôles) et
            accent est SORTI des tokens (DESIGN 1.34.0, arbitrage 2026-07-29 — focus v2). */}
      </div>

      <div>
        <p className="fblock-l">Surfaces neutres — background / surface / hover / inverse</p>
        <div className="chiprow">
          <span className="rl">surfaces</span>
          {chip("var(--background)", "var(--text-primary)", "1px solid var(--border)", "background")}
          {chip("var(--surface)", "var(--text-primary)", undefined, "surface")}
          {chip("var(--surface-hover)", "var(--text-primary)", undefined, "hover")}
          {chip("var(--surface-inverse)", "var(--text-inverse)", undefined, "inverse")}
        </div>
      </div>

      <div>
        <p className="fblock-l">Texte — hiérarchie</p>
        {/* du VRAI texte en corps 16 régulier — les puces en label 12 semibold écrasaient
            la différence primary/secondary (rapport utilisateur 2026-07-29) */}
        {([
          ["primary", "Le texte porteur — titres et contenu principal."],
          ["secondary", "La description, le texte d'appui qui accompagne."],
          ["muted", "La métadonnée, le placeholder, l'accessoire."],
          ["disabled", "L'indisponible — la limite reste perceptible."],
        ] as [string, string][]).map(([t, sample]) => (
          <div className="chiprow" key={t}>
            <span className="rl">{t}</span>
            <span className="text-base" style={{ color: `var(--text-${t})` }}>{sample}</span>
          </div>
        ))}
        <div className="chiprow">
          <span className="rl">inverse</span>
          <span className="chip" style={{ background: "var(--surface-inverse)", color: "var(--text-inverse)", fontWeight: 400 }}>Sur surface inverse</span>
        </div>
      </div>

      <div>
        <p className="fblock-l">Bordures — décorative / délimitante (3:1) / inverse</p>
        <div className="chiprow">
          <span className="rl">border</span>
          {chip("transparent", "var(--text-secondary)", "1.5px solid var(--border)", "border")}
          {chip("transparent", "var(--text-primary)", "1.5px solid var(--border-strong)", "strong")}
          {chip("var(--surface-inverse)", "var(--text-inverse)", "1.5px solid var(--border-inverse)", "inverse")}
        </div>
      </div>

      <div>
        <p className="fblock-l">Primitives — échelles tonales (étage 1, fixes hors mode)</p>
        {RAMPS.map(([fam, steps]) => (
          <div key={fam} className="mb-2 flex items-center gap-2.5">
            <span className="rl w-20 shrink-0 font-mono text-xs text-text-secondary">{fam}</span>
            <div className="flex min-w-0 flex-1 overflow-hidden rounded-md border border-border">
              {steps.map((s) => (
                <div key={s} className="group/step relative h-9 min-w-0 flex-1" style={{ background: `var(--${fam}-${s})` }} title={`--${fam}-${s}`}>
                  <span
                    className="absolute inset-x-0 bottom-0.5 text-center font-mono text-[8px] leading-none opacity-70"
                    style={{ color: Number(s) >= 500 || fam === "neutral" && Number(s) >= 500 ? "#fff" : "var(--neutral-950)" }}
                  >
                    {s}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
        <p className="m-0 mt-1 text-xs text-text-muted">
          Un composant ne consomme JAMAIS une primitive : il passe par un rôle (étage 2). Le cran
          calibré <span className="font-mono">red-150</span> vient de la doctrine (contraste 4.60:1),
          pas de l'échelle Tailwind.
        </p>
      </div>
    </div>
  );
}

function Typo() {
  const [specs, setSpecs] = React.useState<Record<string, string>>({});
  React.useEffect(() => {
    const next: Record<string, string> = {};
    for (const n of [1, 2, 3, 4, 5, 6]) {
      const probe = document.createElement("span");
      probe.style.cssText = `position:absolute;visibility:hidden;font-size:var(--text-h${n})`;
      document.body.appendChild(probe);
      next[`h${n}`] = Math.round(parseFloat(getComputedStyle(probe).fontSize)) + "px";
      probe.remove();
    }
    setSpecs(next);
  }, []);
  const fams: [string, string, string][] = [
    ["Sans — Geist", "--font-sans", "Titres, labels, corps"],
    ["Label — Inter", "--font-label", "Étiquettes d'UI (500/600)"],
    ["Mono — JetBrains", "--font-mono", "Code, tokens, chiffres tabulaires"],
  ];
  const sizes: [string, string][] = [["xl", "24"], ["lg", "18"], ["md", "16"], ["sm", "14"], ["xs", "12"]];
  const weights: [string, string][] = [["regular", "400"], ["medium", "500"], ["semibold", "600"]];
  return (
    <>
      <div>
        <p className="fblock-l">Titres — échelle fluide (clamp)</p>
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div className="ty-row" key={n}>
            <span className="ty-tag">h{n}</span>
            <span className="ty-spec">{specs[`h${n}`] || ""}</span>
            <span className="ty-sample" style={{ fontSize: `var(--text-h${n})`, fontWeight: "var(--weight-medium)" as any, lineHeight: 1.15 }}>Vif zéphyr</span>
          </div>
        ))}
      </div>
      <div>
        <p className="fblock-l">Corps — tailles</p>
        {sizes.map(([k, px]) => (
          <div className="ty-row" key={k}>
            <span className="ty-tag">{k}</span>
            <span className="ty-spec">{px}px</span>
            <span className="ty-sample" style={{ fontSize: `var(--size-${k})` }}>Le vif renard brun</span>
          </div>
        ))}
      </div>
      <div>
        <p className="fblock-l">Familles</p>
        {fams.map(([l, v, d]) => (
          <div className="fam-row" key={v}>
            <div><b style={{ fontFamily: `var(${v})` }}>{l}</b><span className="fam-d">{d}</span></div>
            <span className="fam-demo" style={{ fontFamily: `var(${v})` }}>AaGg 0123 — {"{}"}</span>
          </div>
        ))}
      </div>
      <div>
        <p className="fblock-l">Graisses</p>
        {weights.map(([k, n]) => (
          <div className="ty-row" key={k}>
            <span className="ty-tag">{k}</span>
            <span className="ty-spec">{n}</span>
            <span className="ty-sample" style={{ fontWeight: `var(--weight-${k})` as any }}>Aa — Le vif renard</span>
          </div>
        ))}
      </div>
    </>
  );
}

function Icones() {
  const szs: [string, string][] = [["sm", "16"], ["md", "20"], ["lg", "24"]];
  return (
    <>
      <div>
        <p className="fblock-l">Crans (appariés au corps)</p>
        <div className="iconSizes">
          {szs.map(([k, px]) => (
            <div className="isz" key={k}>
              <span className="ico" style={{ width: `var(--icon-${k})`, height: `var(--icon-${k})` }}><LibIcon p={ICONS.Bell} /></span>
              <span className="isz-l">{k}<em>{px}px</em></span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="fblock-l">Jeu d'icônes (currentColor)</p>
        <div className="iconSet">
          {Object.entries(ICONS).map(([n, p]) => (
            <div className="icell" key={n}>
              <span className="ico" style={{ width: "var(--icon-md)", height: "var(--icon-md)" }}><LibIcon p={p} /></span>
              <span className="icell-l">{n}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Grille() {
  const rows: [string, string, string][] = [
    ["narrow", "480", "formulaire, auth"],
    ["default", "1024", "contenu / app standard"],
    ["wide", "1440", "dashboard, collection dense"],
  ];
  return (
    <div>
      {rows.map(([k, px, d]) => (
        <div className="grow" key={k}>
          <div className="grow-h"><span className="ty-tag">{k}</span><span className="grow-d">{d}</span><span className="grow-px">{px}px</span></div>
          <div className="grail"><div className="gbar" style={{ width: `min(100%, calc(${px} / 1440 * 100%))` }} /></div>
        </div>
      ))}
    </div>
  );
}

function Ombres() {
  return (
    <div className="shadowGrid">
      {["none", "raised", "overlay", "scene"].map((k) => (
        <div className="scard" key={k}>
          <div className="schip" style={{ boxShadow: `var(--elevation-${k})` }} />
          <span className="scard-l">elevation-{k}</span>
        </div>
      ))}
    </div>
  );
}

function MotionCard({ label, sub, dur, ease }: { label: string; sub: string; dur: string; ease: string }) {
  const dotRef = React.useRef<HTMLSpanElement>(null);
  const play = () => {
    const d = dotRef.current; if (!d) return;
    d.classList.remove("go"); void d.offsetWidth; d.classList.add("go");
  };
  return (
    // Rejeu au SURVOL uniquement : un div cliquable serait un contrôle recréé (un contrôle
    // est un Button ou un Link) — l'animation est décorative, le survol suffit.
    <div className="mcard" onMouseEnter={play}>
      <div className="mtrack"><span ref={dotRef} className="mdot" style={{ transitionDuration: dur, transitionTimingFunction: ease }} /></div>
      <span className="mcard-l">{label}<em>{sub}</em></span>
    </div>
  );
}

function Motion() {
  const durs: [string, string][] = [["fast", "100"], ["base", "200"], ["slow", "300"]];
  const eases: [string, string][] = [["ease-out", "ce qui entre décélère"], ["ease-in", "ce qui sort accélère"], ["ease-in-out", "bouge sur place"]];
  return (
    <>
      <div>
        <p className="fblock-l">Durées</p>
        <div className="motionGrid">
          {durs.map(([k, ms]) => (
            <MotionCard key={k} label={k} sub={`${ms}ms`} dur={`var(--duration-${k})`} ease="var(--ease-out)" />
          ))}
        </div>
      </div>
      <div>
        <p className="fblock-l">Courbes</p>
        <div className="motionGrid">
          {eases.map(([k, d]) => (
            <MotionCard key={k} label={k} sub={d} dur="var(--duration-slow)" ease={`var(--${k})`} />
          ))}
        </div>
      </div>
    </>
  );
}

function Rayon() {
  const rows: [string, string][] = [["none", "0"], ["xs", "2"], ["sm", "4"], ["md", "8"], ["lg", "12"], ["2xl", "20"], ["pill", "∞"]];
  return (
    <div className="radiusGrid">
      {rows.map(([k, px]) => (
        <div className="rcard" key={k}>
          <div className="rchip" style={{ borderRadius: `var(--radius-${k})` }} />
          <span className="scard-l">{k}<em>{px === "∞" ? "pill" : px + "px"}</em></span>
        </div>
      ))}
    </div>
  );
}

function Espacement() {
  const rows: [string, string][] = [["0", "0"], ["xs", "4"], ["sm", "8"], ["md", "16"], ["lg", "24"], ["xl", "40"], ["2xl", "64"], ["section", "80"]];
  return (
    <div>
      {rows.map(([k, px]) => (
        <div className="sprow" key={k}>
          <span className="ty-tag">{k}</span>
          <span className="sbar" style={{ width: `var(--space-${k})` }} />
          <span className="ty-spec">{px}px</span>
        </div>
      ))}
    </div>
  );
}

const RENDER: Record<string, () => React.ReactNode> = {
  "f-couleur": Couleur,
  "f-typo": Typo,
  "f-icones": Icones,
  "f-grille": Grille,
  "f-ombres": Ombres,
  "f-motion": Motion,
  "f-rayon": Rayon,
  "f-espacement": Espacement,
};

export function Foundations({ which }: { which: string }) {
  const meta = FOUNDATIONS.find((f) => f.key === which) ?? FOUNDATIONS[0];
  const Body = RENDER[meta.key] ?? Couleur;
  return (
    <div className="mx-auto max-w-[900px] px-xl py-xl">
      <span className="font-label text-xs font-semibold uppercase tracking-wide text-text-secondary">Fondation</span>
      <h1 className="m-0 mb-2 mt-1 text-3xl font-medium text-text-primary">{meta.title}</h1>
      <p className="mb-lg max-w-[62ch] text-sm leading-relaxed text-text-secondary">{meta.desc}</p>
      <div className="foundations">
        <Body />
      </div>
    </div>
  );
}
