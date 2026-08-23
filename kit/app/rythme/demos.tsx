"use client";
import { useEffect, useRef, useState } from "react";

/* ── L'échelle vivante — Y8 : redimensionne la fenêtre, les crans glissent ── */
function Cran({ nom }: { nom: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [px, setPx] = useState("…");
  useEffect(() => {
    const lire = () => {
      if (ref.current) setPx(`${ref.current.getBoundingClientRect().width.toFixed(1)} px`);
    };
    lire();
    const ro = new ResizeObserver(lire);
    if (ref.current) ro.observe(ref.current);
    window.addEventListener("resize", lire);
    return () => { ro.disconnect(); window.removeEventListener("resize", lire); };
  }, []);
  return (
    <div className="rang" style={{ gap: "var(--rr-inline-unit)" }}>
      <span className="mono" style={{ width: "9rem" }}>{nom.replace("--rr-", "")}</span>
      <div ref={ref} className="barre" style={{ width: `var(${nom})` }} />
      <span className="mono mesure">{px}</span>
    </div>
  );
}

export function EchelleVivante() {
  const crans = ["--rr-inline-xs", "--rr-inline-sm", "--rr-inline-unit",
    "--rr-inline-xl", "--rr-inline-lg", "--rr-inline-2xl",
    "--rr-block-unit", "--rr-block-card", "--rr-block-page"];
  return (
    <div style={{ display: "grid", gap: "var(--rr-block-md)" }}>
      {crans.map((c) => <Cran key={c} nom={c} />)}
      <p className="sourd" style={{ fontSize: "0.875em" }}>
        Change la largeur de ta fenêtre : chaque cran glisse entre ses deux bornes,
        lues sur ton Échelle à 320 et 1440. La variation vit dans le jeton — jamais dans un écran.
      </p>
    </div>
  );
}

/* ── La densité — Y5 : un cran de décalage · Y6 : la structure ne bouge pas ── */
export function Densite() {
  const [compact, setCompact] = useState(false);
  const pad = compact
    ? "var(--rr-block-unit) var(--rr-inline-xl)"
    : "var(--rr-block-card) var(--rr-inline-2xl)";
  const gap = compact ? "var(--rr-block-sm)" : "var(--rr-block-md)";
  return (
    <div style={{ display: "grid", gap: "var(--rr-block-unit)" }}>
      <div className="rang">
        <button className={`bouton ${!compact ? "on" : ""}`} onClick={() => setCompact(false)}>Confortable</button>
        <button className={`bouton ${compact ? "on" : ""}`} onClick={() => setCompact(true)}>Compact — un cran plus bas</button>
      </div>
      <div className="carte" style={{ padding: pad, gap }}>
        <b>Léa Fontan</b>
        <span className="sourd">UX Designer — les mêmes emplacements, dans le même ordre.</span>
        <div className="rang">
          <button className="bouton">Message</button>
          <button className="bouton on">Suivre</button>
        </div>
      </div>
      <p className="sourd" style={{ fontSize: "0.875em" }}>
        Le compact décale d&apos;exactement un cran (Y5) et ne masque ni ne réordonne
        rien (Y6) — jamais un multiplicateur, jamais une valeur propre.
      </p>
    </div>
  );
}

/* ── La proximité — Y1 et Y2 : casse-les d'un clic, vois la faute ── */
export function Proximite() {
  const [casseY1, setCasseY1] = useState(false);
  const [casseY2, setCasseY2] = useState(false);
  const labelMarge = casseY1
    ? { marginBottom: "var(--rr-block-card)", marginTop: "var(--rr-block-card)" }
    : { marginBottom: "var(--rr-block-md)", marginTop: "var(--rr-block-card)" };
  const titreMarges = casseY2
    ? { marginTop: "var(--rr-block-unit)", marginBottom: "var(--rr-block-unit)" }
    : { marginTop: "var(--rr-block-page)", marginBottom: "var(--rr-block-md)" };
  return (
    <div style={{ display: "grid", gap: "var(--rr-block-unit)" }}>
      <div className="rang">
        <button className={`bouton ${casseY1 ? "on" : ""}`} onClick={() => setCasseY1(!casseY1)}>
          {casseY1 ? "Réparer Y1" : "Casser Y1 — libellé équidistant"}
        </button>
        <button className={`bouton ${casseY2 ? "on" : ""}`} onClick={() => setCasseY2(!casseY2)}>
          {casseY2 ? "Réparer Y2" : "Casser Y2 — titre qui flotte"}
        </button>
        <a className={`badge ${casseY1 ? "ko" : ""}`} href="#y1">Y1</a>
        <a className={`badge ${casseY2 ? "ko" : ""}`} href="#y2">Y2</a>
      </div>
      <div className="carte" style={{ gap: 0 }}>
        <p className="sourd" style={{ margin: 0 }}>Un paragraphe qui précède la section.</p>
        <h2 style={titreMarges}>Vos coordonnées</h2>
        <div style={{ margin: 0 }}>
          <label className="mono" style={{ display: "block", ...labelMarge }}>Adresse e-mail</label>
          <input readOnly value="prenom@exemple.fr" style={{ height: "var(--rr-control)", width: "100%", border: "1px solid var(--p-trait)", borderRadius: "var(--rr-radius)", padding: "0 var(--rr-inline-unit)", font: "inherit", background: "var(--p-fond)" }} />
        </div>
      </div>
      <p className="sourd" style={{ fontSize: "0.875em" }}>
        Cassée, la proximité ment : le libellé semble appartenir au champ du dessus,
        le titre flotte entre deux blocs. L&apos;espace est un canal d&apos;information — pas un reste.
      </p>
    </div>
  );
}

/* ── L'adaptation — ce que demande le marché : un calcul, plusieurs cibles ── */
const SNIPPETS: Record<string, Record<string, string>> = {
  React: {
    "CSS natif": `<div style={{ gap: 'var(--rr-inline-unit)' }}>\n  …\n</div>`,
    Tailwind: `// tailwind.config : theme.extend.spacing = rythme.spacing\n<div className="gap-inline-unit">\n  …\n</div>`,
  },
  Angular: {
    "CSS natif": `<div [style.gap]="'var(--rr-inline-unit)'">\n  …\n</div>`,
    Tailwind: `<!-- même config tailwind, mêmes variables -->\n<div class="gap-inline-unit">\n  …\n</div>`,
  },
  HTML: {
    "CSS natif": `<div style="gap: var(--rr-inline-unit)">\n  …\n</div>`,
    Tailwind: `<div class="gap-inline-unit">\n  …\n</div>`,
  },
};

export function Adaptation() {
  const [fw, setFw] = useState<"React" | "Angular" | "HTML">("React");
  const [style, setStyle] = useState<"CSS natif" | "Tailwind">("CSS natif");
  return (
    <div style={{ display: "grid", gap: "var(--rr-block-unit)" }}>
      <div className="rang">
        {(["React", "Angular", "HTML"] as const).map((f) => (
          <button key={f} className={`bouton ${fw === f ? "on" : ""}`} onClick={() => setFw(f)}>{f}</button>
        ))}
        <span className="sourd">×</span>
        {(["CSS natif", "Tailwind"] as const).map((s) => (
          <button key={s} className={`bouton ${style === s ? "on" : ""}`} onClick={() => setStyle(s)}>{s}</button>
        ))}
      </div>
      <pre className="code">{SNIPPETS[fw][style]}</pre>
      <p className="sourd" style={{ fontSize: "0.875em" }}>
        Un seul calcul (les jetons), plusieurs cibles : variables CSS natives et
        sortie Tailwind jumelle (<span className="mono">tokens.tailwind.mjs</span>).
        Le normatif est la règle et le jeton — chaque stack n&apos;est qu&apos;un exemple.
      </p>
    </div>
  );
}
