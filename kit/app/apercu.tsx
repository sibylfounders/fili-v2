"use client";
import * as React from "react";

/* L'aperçu redimensionnable — porté de l'atelier (sources/…/resizable-preview.tsx),
   adapté aux jetons du kit neuf : fond damier, paliers cliquables (l'alternative
   sans glisser), poignée au pointeur ET au clavier, pastille de largeur,
   double-clic pour réinitialiser. Les paliers sont des repères d'inspection,
   pas des états — rien ne prétend qu'un composant bascule à ces valeurs. */

const MIN = 260;
const PAS = 16;
const PAS_LARGE = 64;
const PALIERS: { label: string; w: number | null }[] = [
  { label: "320 px", w: 320 },
  { label: "768 px", w: 768 },
  { label: "1024 px", w: 1024 },
  { label: "Pleine largeur", w: null },
];

export function Apercu({ enfants }: { enfants: (largeur: number) => React.ReactNode }) {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const [w, setW] = React.useState<number | null>(null);
  const [max, setMax] = React.useState(0);
  const [drag, setDrag] = React.useState(false);

  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const lire = () => setMax(el.getBoundingClientRect().width);
    lire();
    const ro = new ResizeObserver(lire);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const borne = (v: number) => Math.max(MIN, Math.min(max || v, v));
  const courante = Math.round(w === null ? max : Math.min(w, max || w));

  const onDown = (e: React.PointerEvent) => {
    e.preventDefault();
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    setDrag(true);
    const move = (ev: PointerEvent) => setW(Math.max(MIN, Math.min(rect.width, ev.clientX - rect.left)));
    const up = () => { setDrag(false); window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const onKeyPoignee = (e: React.KeyboardEvent) => {
    const pas = e.shiftKey ? PAS_LARGE : PAS;
    const cur = w === null ? max : w;
    if (e.key === "ArrowLeft") { e.preventDefault(); setW(borne(cur - pas)); }
    else if (e.key === "ArrowRight") { e.preventDefault(); setW(borne(cur + pas)); }
    else if (e.key === "Home") { e.preventDefault(); setW(MIN); }
    else if (e.key === "End") { e.preventDefault(); setW(null); }
  };

  return (
    <div className="apercu">
      <div className="apercu-cmds" role="group" aria-label="Largeurs de test de l'aperçu">
        {PALIERS.filter((p) => p.w === null || max === 0 || p.w <= max).map((p) => {
          const actif = p.w === null ? w === null : w !== null && Math.round(w) === p.w;
          return (
            <button key={p.label} className={`bouton ${actif ? "on" : ""}`} aria-pressed={actif}
              onClick={() => setW(p.w === null ? null : borne(p.w))}
              title={p.w === null ? "Pleine largeur" : `Aperçu à ${p.w} px`}>
              {p.label}
            </button>
          );
        })}
      </div>
      <div ref={wrapRef} className="apercu-piste">
        <div className="apercu-cadre" style={{ width: w ? `${w}px` : "100%" }}>
          <div className="apercu-scene">{courante > 0 ? enfants(courante) : null}</div>
          {w ? <span className="puce-w mono">{Math.round(w)} px</span> : null}
        </div>
        <div role="separator" tabIndex={0} aria-orientation="vertical"
          aria-label="Largeur de l'aperçu" aria-valuemin={MIN}
          aria-valuemax={Math.round(max) || MIN} aria-valuenow={courante || MIN}
          onPointerDown={onDown} onKeyDown={onKeyPoignee} onDoubleClick={() => setW(null)}
          title="Glisser, ou flèches gauche/droite · double-clic : pleine largeur"
          className={`poignee ${drag ? "en-prise" : ""}`}
          style={{ left: w ? `${w}px` : "100%" }}>
          <span className="poignee-trait" />
        </div>
      </div>
    </div>
  );
}

export function PanneauCode({ langage, code }: { langage: string; code: string }) {
  const [copie, setCopie] = React.useState(false);
  return (
    <div className="panneau-code">
      <div className="panneau-code-tete">
        <span className="mono sourd">{langage}</span>
        <button className="bouton" onClick={() => {
          navigator.clipboard.writeText(code).then(() => {
            setCopie(true); setTimeout(() => setCopie(false), 1600);
          });
        }}>{copie ? "Copié ✓" : "Copier"}</button>
      </div>
      <pre className="code" style={{ borderRadius: 0 }}>{code}</pre>
    </div>
  );
}
