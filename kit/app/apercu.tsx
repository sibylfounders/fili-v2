"use client";
import * as React from "react";

/* Le banc d'essai — porté de l'atelier, recomposé le 23 août :
   une tête d'outils toujours visibles (plus rien ne se cache au survol),
   le cadre est une feuille de papier collée à gauche, le damier n'est
   plus que la marge — la part d'écran que la largeur simulée ne couvre
   pas. Poignée au pointeur ET au clavier, pastille de largeur, double-clic
   pour revenir à 1024 px. Les flèches déplacent la poignée, Origine va au
   plus étroit, Fin revient à la largeur de départ. */

const MIN = 320; /* jamais en dessous : la plus petite largeur d'écran du système */
const DEFAUT = 1024;
const PAS = 16;
const PAS_LARGE = 64;
/* Plus aucun raccourci de largeur (1er septembre). Ils ont d'abord perdu
   « 768 · gel Figma » — une notion d'atelier exposée au lecteur — puis les
   deux autres : la poignée fait déjà tout, et mieux. On ne saute plus à
   trois largeurs choisies d'avance, on balaie la plage entière et on voit
   la mise en page se réorganiser en continu, ce qui est le sujet. Le
   double-clic sur la poignée ramène à la largeur de départ. */

export function Apercu({ enfants, outils, pied, plafond, surLargeur, fond }: {
  enfants: (largeur: number) => React.ReactNode;
  outils?: React.ReactNode;
  pied?: React.ReactNode;
  /* Une variante DÉCLARÉE, pas une liberté : « uni » — le damier dit la part
     d'écran que la largeur simulée ne couvre pas, ce qui est précieux quand
     on juge une mise en page. Quand on juge une LONGUEUR DE LIGNE, il devient
     un bruit qui court juste derrière le texte à mesurer. Une scène de
     lecture prend donc un fond uni (verdict d'Auteur, 2 septembre). */
  fond?: "damier" | "uni";
  /* largeur maximale du cadre — le damier reprend le reste (24 août) */
  plafond?: number;
  /* La largeur simulée, dite à l'appelant : une légende posée SOUS le cadre
     doit pouvoir parler de ce que le cadre montre (1er septembre). */
  surLargeur?: (largeur: number) => void;
}) {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const [w, setW] = React.useState(plafond ? Math.min(DEFAUT, plafond) : DEFAUT);
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

  const dire = React.useRef(surLargeur);
  dire.current = surLargeur;

  const borne = (v: number) => Math.max(MIN, Math.min(plafond ?? Infinity, Math.min(max || v, v)));
  const courante = Math.round(Math.min(plafond ?? Infinity, max ? Math.min(w, max) : w));

  React.useEffect(() => { dire.current?.(courante); }, [courante]);

  const onDown = (e: React.PointerEvent) => {
    e.preventDefault();
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    setDrag(true);
    const move = (ev: PointerEvent) => setW(Math.max(MIN, Math.min(plafond ?? Infinity, Math.min(rect.width, ev.clientX - rect.left))));
    const up = () => { setDrag(false); window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const onKeyPoignee = (e: React.KeyboardEvent) => {
    const pas = e.shiftKey ? PAS_LARGE : PAS;
    if (e.key === "ArrowLeft") { e.preventDefault(); setW(borne(w - pas)); }
    else if (e.key === "ArrowRight") { e.preventDefault(); setW(borne(w + pas)); }
    else if (e.key === "Home") { e.preventDefault(); setW(MIN); }
    else if (e.key === "End") { e.preventDefault(); setW(borne(DEFAUT)); }
  };

  return (
    <div className={`apercu${fond === "uni" ? " uni" : ""}`}>
      {/* Une rangée de commandes = UNE boîte. Il y avait ici deux boîtes
          souples imbriquées pour un seul enfant, et une rangée vide quand
          l'aperçu n'a pas d'outils (verdict d'Auteur, 1er septembre). */}
      {outils && <div className="apercu-outils">{outils}</div>}
      <div ref={wrapRef} className="apercu-piste">
        <div className="apercu-cadre" style={{ width: `${courante}px` }}>
          <div className="apercu-scene">{courante > 0 ? enfants(courante) : null}</div>
          <span className="puce-w mono">{courante} px</span>
        </div>
        <div role="separator" tabIndex={0} aria-orientation="vertical"
          aria-label="Largeur de l'aperçu" aria-valuemin={MIN}
          aria-valuemax={Math.round(Math.min(plafond ?? Infinity, max)) || MIN} aria-valuenow={courante || MIN}
          onPointerDown={onDown} onKeyDown={onKeyPoignee} onDoubleClick={() => setW(borne(plafond ? Math.min(DEFAUT, plafond) : DEFAUT))}
          title="Glisser, ou flèches gauche/droite · double-clic : 1024 px"
          className={`poignee ${drag ? "en-prise" : ""}`}
          style={{ left: `${courante}px` }}>
          <span className="poignee-trait" />
        </div>
      </div>
      {pied}
    </div>
  );
}

/* Un surligneur minuscule, zéro dépendance : commentaires, chaînes,
   jetons var(--…), balises, mots-clés. Les encres viennent de la famille
   couleur (code-com / code-str / code-kw / code-tag). Approximatif et
   assumé : il aide à lire un spécimen, il ne compile rien. */
const RX_SYNTAXE = /(<!--[\s\S]*?-->|\/\*[\s\S]*?\*\/|\/\/[^\n]*)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')|(var\(--[a-z0-9-]+\)|--[a-z0-9-]+)|(<\/?[a-zA-Z][a-zA-Z0-9-]*|\/>)|(\b(?:import|export|from|function|return|const|let|class|extends|new|if|else|selector|template|styleUrl|standalone)\b)/g;
function surligner(code: string): React.ReactNode[] {
  const sortie: React.ReactNode[] = [];
  let i = 0, k = 0;
  let m: RegExpExecArray | null;
  RX_SYNTAXE.lastIndex = 0;
  while ((m = RX_SYNTAXE.exec(code))) {
    if (m.index > i) sortie.push(code.slice(i, m.index));
    const cls = m[1] ? "cs-com" : m[2] ? "cs-str" : m[3] ? "cs-var" : m[4] ? "cs-tag" : "cs-kw";
    sortie.push(<span key={k++} className={cls}>{m[0]}</span>);
    i = m.index + m[0].length;
  }
  if (i < code.length) sortie.push(code.slice(i));
  return sortie;
}

export function PanneauCode({ langage, code, outils }: { langage: string; code: string; outils?: React.ReactNode }) {
  const [copie, setCopie] = React.useState(false);
  return (
    <div className="panneau-code">
      <div className="panneau-code-tete">
        <div style={{ display: "flex", alignItems: "center", gap: "var(--gap-3-inline)" }}>
          {outils}
          <span className="mono sourd">{langage}</span>
        </div>
        <button className="bouton" onClick={() => {
          navigator.clipboard.writeText(code).then(() => {
            setCopie(true); setTimeout(() => setCopie(false), 1600);
          });
        }}>{copie ? "Copié ✓" : "Copier"}</button>
      </div>
      <pre className="code" style={{ borderRadius: 0 }}>{surligner(code)}</pre>
    </div>
  );
}
