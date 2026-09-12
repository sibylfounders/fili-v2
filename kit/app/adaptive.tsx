"use client";
import { useEffect, useState } from "react";
import { LAYOUTS, POSTURE } from "../derivation.mjs";

/* ── LA COUCHE D'ADAPTATION (stratégie postures, 11 septembre 2026).
   Le CSS compose ; cette couche LIT ce que la page a composé et le dit sur
   <html> : data-layout (le gabarit déclaré), data-level (le niveau exigé),
   data-zones (combien de zones tiennent), data-segments (un ou deux),
   data-posture (Mobile · Livre · Laptop · Tablet, dérivée — voir
   POSTURE.derive). Rien ici ne décide de la mise en page : les sommes vivent
   au moteur, écrites dans tokens.css et globals.css, et le navigateur les
   applique avant le premier rendu. Le banc et l'épreuve lisent ces faits ;
   l'épreuve les remesure par elle-même — la couche ne se note pas.

   LE MODE BANC (<html data-bench>, réglage du drawer, mémorisé) : sur les
   vraies pages, chaque zone est surlignée avec son nom et sa largeur
   mesurée contre sa largeur de travail ; un panneau dit la surface, les
   segments, la posture, la place et la somme qui a décidé, puis le
   verdict — vert, ou rouge avec la règle qui manque. Le choix de
   l'appareil reste à DevTools ; on ne le refait pas. ── */

const REM = () => parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
const KEY = "kit-bench";
type Seg = { x: number; y: number; width: number; height: number };
type Zone = { name: string; el: HTMLElement; rect: DOMRect; widthRem: number; need?: number; comfort?: number; token?: string; ok: boolean; why: string };
export type Facts = {
  layout: keyof typeof LAYOUTS | null; level: string | null;
  width: number; height: number; segments: Seg[]; hinge: "vertical" | "horizontal" | null;
  posture: string; zones: Zone[]; sum: string; verdict: { ok: boolean; says: string };
};

/* Les segments du viewport : l'API quand elle existe, sinon les requêtes média de l'émulation. */
function segmentsOf(): Seg[] {
  const v = (window as unknown as { viewport?: { segments?: DOMRect[] } }).viewport;
  const s = v?.segments;
  if (s && s.length > 1) return s.map((r) => ({ x: r.x, y: r.y, width: r.width, height: r.height }));
  return [{ x: 0, y: 0, width: window.innerWidth, height: window.innerHeight }];
}
const visible = (el: HTMLElement) => {
  const cs = getComputedStyle(el);
  return cs.display !== "none" && cs.visibility !== "hidden" && el.getClientRects().length > 0;
};
/* la protection d'une zone sans nombre : aucun libellé coupé */
const cut = (el: HTMLElement) => Array.from(el.querySelectorAll<HTMLElement>(".rail-link, .rail-heading")).some((n) => n.scrollWidth > n.clientWidth + 1);
/* une zone est dans UN segment : son rectangle visible ne chevauche pas la frontière */
function straddles(rect: DOMRect, segs: Seg[]) {
  if (segs.length < 2) return false;
  const vis = { l: Math.max(rect.left, 0), r: Math.min(rect.right, window.innerWidth), t: Math.max(rect.top, 0), b: Math.min(rect.bottom, window.innerHeight) };
  if (vis.r <= vis.l || vis.b <= vis.t) return false;
  return !segs.some((s) => vis.l >= s.x - 1 && vis.r <= s.x + s.width + 1 && vis.t >= s.y - 1 && vis.b <= s.y + s.height + 1);
}

export function readFacts(): Facts {
  const rem = REM();
  const segments = segmentsOf();
  const hinge: "vertical" | "horizontal" | null = segments.length < 2 ? null : Math.abs(segments[0].y - segments[1].y) < 2 ? "vertical" : "horizontal";
  const key = (Object.keys(LAYOUTS) as (keyof typeof LAYOUTS)[]).find((k) => (LAYOUTS[k] as { zones?: object }).zones && document.querySelector((LAYOUTS[k] as { root: string }).root)) ?? null;
  const layout = key ? (LAYOUTS[key] as typeof LAYOUTS.doc) : null;
  /* le moteur est du JS : TypeScript lit « hinge = null » comme un type null — la charnière passe telle quelle */
  const posture = POSTURE.keyOf(POSTURE.derive({ widthRem: window.innerWidth / rem, segments: segments.length, hinge: hinge as unknown as null, twoZones: LAYOUTS.doc.twoZones })) ?? "tablet";
  const zones: Zone[] = [];
  if (layout) {
    for (const [name, z] of Object.entries(layout.zones) as [string, { rem?: number; comfort?: number; token?: string; selector: string }][]) {
      const el = document.querySelector<HTMLElement>(z.selector);
      if (!el || !visible(el)) continue;
      const rect = el.getBoundingClientRect();
      const widthRem = Math.round((rect.width / rem) * 10) / 10;
      let ok = true, why = "";
      if (z.rem !== undefined && widthRem + 0.05 < z.rem) { ok = false; why = `sous sa largeur de travail (${String(z.rem).replace(".", ",")} rem)`; }
      if (z.token && cut(el)) { ok = false; why = "un libellé se coupe"; }
      if (straddles(rect, segments)) { ok = false; why = "à cheval sur la frontière"; }
      zones.push({ name, el, rect, widthRem, need: z.rem, comfort: z.comfort, token: z.token, ok, why });
    }
  }
  const W = window.innerWidth / rem, S = LAYOUTS.doc.sums.rail;
  const sum = segments.length > 1
    ? `frontière ${hinge === "vertical" ? "verticale" : "horizontale"} : elle prime sur la somme`
    : `${String(Math.round(W * 10) / 10).replace(".", ",")} rem ${W >= S ? "≥" : "<"} ${String(S).replace(".", ",")} rem (marge + rail + gouttière + lecture 34 + marge) → ${W >= S ? "deux zones" : "une zone"}`;
  const bad = zones.find((z) => !z.ok);
  const verdict = !layout
    ? { ok: false, says: "aucune déclaration : cette page n'a pas de gabarit déclaré au moteur — refus de statuer" }
    : zones.length === 0
      ? { ok: false, says: "aucune zone ne tient : la page réclamerait un écran dédié — le modèle fuit" }
      : bad
        ? { ok: false, says: `${bad.name} ${bad.why} — une règle manque` }
        : { ok: true, says: "une seule mise en page, posée par les règles" };
  return { layout: key, level: layout?.level ?? null, width: window.innerWidth, height: window.innerHeight, segments, hinge, posture, zones, sum, verdict };
}

/* un attribut de <html> n'est réécrit que s'il change : le poser à l'identique invalide quand même les styles de toute la page — à chaque image d'un redimensionnement, c'est un coût pour rien */
const put = (d: DOMStringMap, k: string, v: string | undefined) => { if (v === undefined) { if (k in d) delete d[k]; } else if (d[k] !== v) d[k] = v; };
function tell(f: Facts, bench: boolean) {
  const d = document.documentElement.dataset;
  put(d, "layout", f.layout ?? undefined); put(d, "level", f.layout ? f.level ?? "" : undefined);
  put(d, "zones", String(f.zones.length));
  put(d, "segments", String(f.segments.length));
  put(d, "posture", f.posture);
  /* le banc pose son nom et sa mesure sur chaque zone ; hors banc, rien n'est écrit dans la page */
  for (const el of Array.from(document.querySelectorAll<HTMLElement>("[data-zone]"))) { delete el.dataset.zone; delete el.dataset.zoneSays; delete el.dataset.zoneOk; }
  if (!bench) return;
  for (const z of f.zones) {
    z.el.dataset.zone = z.name;
    z.el.dataset.zoneOk = z.ok ? "oui" : "non";
    const target = z.need !== undefined ? ` / ${String(z.need).replace(".", ",")}${z.comfort ? ` → ${z.comfort}` : ""} rem` : " / libellés entiers";
    z.el.dataset.zoneSays = `${z.name} · ${String(z.widthRem).replace(".", ",")} rem${target}${z.ok ? "" : ` · ${z.why}`}`;
  }
}

const readBench = () => document.documentElement.dataset.bench === "oui";

export function Adaptive() {
  const [facts, setFacts] = useState<Facts | null>(null);
  const [bench, setBench] = useState(false);
  useEffect(() => {
    let raf = 0;
    const run = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { const b = readBench(); const f = readFacts(); tell(f, b); setBench(b); if (b) setFacts(f); }); }; /* banc éteint : les faits vont sur <html>, pas dans React — rien à redessiner */
    run();
    window.addEventListener("resize", run);
    const onScroll = () => { if (readBench()) run(); }; /* les étiquettes du banc suivent les zones ; banc éteint, le défilement ne coûte rien */
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    const v = (window as unknown as { viewport?: EventTarget }).viewport;
    v?.addEventListener?.("resize", run);
    const mo = new MutationObserver(run);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-bench", "data-density"] });
    /* la page change de route sans recharger : le gabarit peut changer */
    const mainMo = new MutationObserver(run);
    mainMo.observe(document.body, { childList: true });
    return () => { window.removeEventListener("resize", run); window.removeEventListener("scroll", onScroll, { capture: true }); v?.removeEventListener?.("resize", run); mo.disconnect(); mainMo.disconnect(); cancelAnimationFrame(raf); };
  }, []);
  if (!bench || !facts) return null;
  const rem = (v: number) => String(Math.round(v * 10) / 10).replace(".", ",");
  const NAMES: Record<string, string> = { mobile: "Mobile", book: "Livre", laptop: "Laptop", tablet: "Tablet" };
  const seg = facts.segments.length > 1
    ? `2 segments de ${Math.round(facts.segments[0].width)} × ${Math.round(facts.segments[0].height)}`
    : `1 segment`;
  return (<>
    {/* les étiquettes des zones : posées sur leur rectangle, hors du flux — le banc ne change rien à la composition qu'il mesure */}
    {facts.zones.map((z) => (
      <span key={z.name} className="bench-tag" data-ok={z.ok ? "oui" : "non"} aria-hidden="true"
        style={{ left: Math.max(0, z.rect.left), top: Math.max(0, z.rect.top), maxWidth: Math.max(8 * 16, z.rect.width) }}>{z.el.dataset.zoneSays}</span>
    ))}
    <aside className="bench-hud" aria-label="Le banc des postures" data-ok={facts.verdict.ok ? "oui" : "non"}>
      <span className="bench-hud-head">Banc · {facts.layout ? `gabarit ${facts.layout} · ${facts.level}` : "sans déclaration"}</span>
      <span>Surface <b>{facts.width} × {facts.height}</b> · {seg}</span>
      <span>Posture <b>{NAMES[facts.posture] ?? facts.posture}</b>{facts.hinge ? ` · charnière ${facts.hinge === "vertical" ? "verticale" : "horizontale"}` : ""}</span>
      <span>{facts.zones.length} zone{facts.zones.length > 1 ? "s" : ""} · {facts.zones.map((z) => `${z.name} ${rem(z.widthRem)}`).join(" · ")}</span>
      <span className="bench-hud-why">{facts.sum}</span>
      <span className="bench-hud-verdict">{facts.verdict.ok ? "✓" : "✗"} {facts.verdict.says}</span>
    </aside>
  </>);
}

/* Le réglage du banc, dans le drawer : un mode du kit, comme le thème sombre. */
export function Bench() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    setOn(readBench());
    const mo = new MutationObserver(() => setOn(readBench()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-bench"] });
    return () => mo.disconnect();
  }, []);
  const changer = (v: boolean) => {
    if (v) document.documentElement.dataset.bench = "oui"; else delete document.documentElement.dataset.bench;
    try { localStorage.setItem(KEY, v ? "oui" : "non"); } catch {}
  };
  return (
    <div className="block">
      <span className="mono muted">Banc des postures — tout le site</span>
      <div className="rank" style={{ gap: "var(--gap-3-inline)" }}>
        <button data-choice-bench="non" className="button" aria-pressed={!on} onClick={() => changer(false)}>Caché</button>
        <button data-choice-bench="oui" className="button" aria-pressed={on} onClick={() => changer(true)}>Zones et verdict</button>
      </div>
    </div>
  );
}
