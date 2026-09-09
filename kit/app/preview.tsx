"use client";
import * as React from "react";
import { Demo } from "./levels";

/* Le banc d'essai — porté de l'atelier, recomposé le 23 août :
   une tête d'outils toujours visibles (plus rien ne se cache au survol),
   le cadre est une feuille de papier collée à gauche, le damier n'est
   plus que la marge — la part d'écran que la largeur simulée ne couvre
   pas. Poignée au pointeur ET au clavier, pastille de largeur, double-clic
   pour revenir à 1024 px. Les flèches déplacent la poignée, Origine va au
   plus étroit, Fin revient à la largeur de départ. */

const MIN = 320; /* jamais en dessous : la plus petite largeur d'écran du système */
const DEFAULTS = 1024;
const INCREMENT = 16;
const INCREMENT_WIDE = 64;
/* Plus aucun raccourci de largeur (1er septembre). Ils ont d'abord perdu
   « 768 · gel Figma » — une notion d'atelier exposée au lecteur — puis les
   deux autres : la poignée fait déjà tout, et mieux. On ne saute plus à
   trois largeurs choisies d'avance, on balaie la plage entière et on voit
   la mise en page se réorganiser en continu, ce qui est le sujet. Le
   double-clic sur la poignée ramène à la largeur de départ. */

export function Preview({ children, situation, tools, foot, ceiling, onWidth, background }: {
  children: (width: number) => React.ReactNode;
  /* Dans le cadre des démonstrations (9 septembre) : la situation en tête,
     les outils sous la tête (le choix), la légende sous le cadre. */
  situation?: React.ReactNode;
  tools?: React.ReactNode;
  foot?: React.ReactNode;
  /* Une variante DÉCLARÉE, pas une liberté : « uni » — le damier dit la part
     d'écran que la largeur simulée ne couvre pas, ce qui est précieux quand
     on juge une mise en page. Quand on juge une LONGUEUR DE LIGNE, il devient
     un bruit qui court juste derrière le texte à mesurer. Une scène de
     lecture prend donc un fond uni (verdict d'Auteur, 2 septembre). */
  background?: "damier" | "plain";
  /* largeur maximale du cadre — le damier reprend le reste (24 août) */
  ceiling?: number;
  /* La largeur simulée, dite à l'appelant : une légende posée SOUS le cadre
     doit pouvoir parler de ce que le cadre montre (1er septembre). */
  onWidth?: (width: number) => void;
}) {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const [w, setW] = React.useState(ceiling ? Math.min(DEFAULTS, ceiling) : DEFAULTS);
  const [max, setMax] = React.useState(0);
  const [drag, setDrag] = React.useState(false);

  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const read = () => setMax(el.getBoundingClientRect().width);
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const say = React.useRef(onWidth);
  say.current = onWidth;

  const bound = (v: number) => Math.max(MIN, Math.min(ceiling ?? Infinity, Math.min(max || v, v)));
  const current = Math.round(Math.min(ceiling ?? Infinity, max ? Math.min(w, max) : w));

  React.useEffect(() => { say.current?.(current); }, [current]);

  const onDown = (e: React.PointerEvent) => {
    e.preventDefault();
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    setDrag(true);
    const move = (ev: PointerEvent) => setW(Math.max(MIN, Math.min(ceiling ?? Infinity, Math.min(rect.width, ev.clientX - rect.left))));
    const up = () => { setDrag(false); window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const onKeyHandle = (e: React.KeyboardEvent) => {
    const increment = e.shiftKey ? INCREMENT_WIDE : INCREMENT;
    if (e.key === "ArrowLeft") { e.preventDefault(); setW(bound(w - increment)); }
    else if (e.key === "ArrowRight") { e.preventDefault(); setW(bound(w + increment)); }
    else if (e.key === "Home") { e.preventDefault(); setW(MIN); }
    else if (e.key === "End") { e.preventDefault(); setW(bound(DEFAULTS)); }
  };

  const track = (
      <div ref={wrapRef} className="preview-track">
        <div className="preview-frame" style={{ width: `${current}px` }}>
          <div className="preview-scene">{current > 0 ? children(current) : null}</div>
          <span className="bullet-w mono">{current} px</span>
        </div>
        <div role="separator" tabIndex={0} aria-orientation="vertical"
          aria-label="Largeur de l'aperçu" aria-valuemin={MIN}
          aria-valuemax={Math.round(Math.min(ceiling ?? Infinity, max)) || MIN} aria-valuenow={current || MIN}
          onPointerDown={onDown} onKeyDown={onKeyHandle} onDoubleClick={() => setW(bound(ceiling ? Math.min(DEFAULTS, ceiling) : DEFAULTS))}
          title="Glisser, ou flèches gauche/droite · double-clic : 1024 px"
          className={`handle ${drag ? "engaged" : ""}`}
          style={{ left: `${current}px` }}>
          <span className="handle-stroke" />
        </div>
      </div>
  );
  if (situation) {
    /* le cadre des démonstrations : le choix sous la tête, le banc en scène, la légende dessous */
    return (
      <div className={`preview${background === "plain" ? " plain" : ""}`}>
        <Demo situation={situation}
          bar={tools && <span className="demo-seg" role="group">{tools}</span>}
          caption={foot}>
          <div className="demo-stage preview-in-demo">{track}</div>
        </Demo>
      </div>
    );
  }
  return (
    <div className={`preview${background === "plain" ? " plain" : ""}`}>
      {/* Une rangée de commandes = UNE boîte. Il y avait ici deux boîtes
          souples imbriquées pour un seul enfant, et une rangée vide quand
          l'aperçu n'a pas d'outils (verdict d'Auteur, 1er septembre). */}
      {tools && <div className="preview-tools">{tools}</div>}
      {track}
      {foot}
    </div>
  );
}

/* Un surligneur minuscule, zéro dépendance : commentaires, chaînes,
   tokens var(--…), balises, mots-clés. Les encres viennent de la famille
   couleur (code-com / code-str / code-kw / code-tag). Approximatif et
   assumé : il aide à lire un spécimen, il ne compile rien. */
const RX_SYNTAX = /(<!--[\s\S]*?-->|\/\*[\s\S]*?\*\/|\/\/[^\n]*)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')|(var\(--[a-z0-9-]+\)|--[a-z0-9-]+)|(<\/?[a-zA-Z][a-zA-Z0-9-]*|\/>)|(\b(?:import|export|from|function|return|const|let|class|extends|new|if|else|selector|template|styleUrl|standalone)\b)/g;
function highlight(code: string): React.ReactNode[] {
  const output: React.ReactNode[] = [];
  let i = 0, k = 0;
  let m: RegExpExecArray | null;
  RX_SYNTAX.lastIndex = 0;
  while ((m = RX_SYNTAX.exec(code))) {
    if (m.index > i) output.push(code.slice(i, m.index));
    const cls = m[1] ? "cs-com" : m[2] ? "cs-str" : m[3] ? "cs-var" : m[4] ? "cs-tag" : "cs-kw";
    output.push(<span key={k++} className={cls}>{m[0]}</span>);
    i = m.index + m[0].length;
  }
  if (i < code.length) output.push(code.slice(i));
  return output;
}

export function PanelCode({ language, code, tools }: { language: string; code: string; tools?: React.ReactNode }) {
  const [copy, setCopy] = React.useState(false);
  return (
    <div className="panel-code">
      <div className="panel-code-head">
        <div style={{ display: "flex", alignItems: "center", gap: "var(--gap-3-inline)" }}>
          {tools}
          <span className="mono muted">{language}</span>
        </div>
        <button className="button" onClick={() => {
          navigator.clipboard.writeText(code).then(() => {
            setCopy(true); setTimeout(() => setCopy(false), 1600);
          });
        }}>{copy ? "Copié ✓" : "Copier"}</button>
      </div>
      <pre className="code" style={{ borderRadius: 0 }}>{highlight(code)}</pre>
    </div>
  );
}
