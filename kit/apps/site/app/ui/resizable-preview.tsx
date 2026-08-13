"use client";
import * as React from "react";
import { Button, CompactButton } from "@fili/react";
import { breakpoint } from "@fili/tokens";

/** Fond damier thème-aware (tuiles var(--surface) sur var(--background)). */
const CHECKER: React.CSSProperties = {
  backgroundColor: "var(--background)",
  backgroundImage:
    "linear-gradient(45deg, var(--surface) 25%, transparent 25%)," +
    "linear-gradient(-45deg, var(--surface) 25%, transparent 25%)," +
    "linear-gradient(45deg, transparent 75%, var(--surface) 75%)," +
    "linear-gradient(-45deg, transparent 75%, var(--surface) 75%)",
  backgroundSize: "20px 20px",
  backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0",
};

const IconExpand = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6" /><path d="M9 21H3v-6" /><path d="M21 3l-7 7" /><path d="M3 21l7-7" /></svg>
);
const IconClose = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
);

const MIN = 240;
const PAS = 16;
const PAS_LARGE = 64;

/**
 * Largeurs de test — l'**alternative sans glisser** exigée par `GESTURE-R04` et
 * `ACCESSIBILITY-R06`, et l'accès clavier exigé par `GESTURE-R13` / `ACCESSIBILITY-R04`.
 *
 * Ce sont des **repères d'inspection, pas des états** : `ADAPTIVE-R05` interdit de nommer
 * une bascule « mobile / tablette / desktop », et `ADAPTIVE-R06` interdit d'adosser le seuil
 * d'un composant à un point de rupture global. Les boutons portent donc la largeur brute, et
 * rien ici ne prétend qu'un composant change d'état à ces valeurs — les composants basculent
 * sur LEUR propre largeur reçue (requête de conteneur `atelier-preview`), à des seuils qui
 * leur appartiennent. Les valeurs viennent des `breakpoint` du shell parce qu'elles sont les
 * largeurs de fenêtre qu'on veut vérifier, pas parce qu'elles feraient autorité sur l'aperçu.
 */
const PALIERS: { label: string; w: number | null }[] = [
  { label: `${parseInt(breakpoint.mobile, 10)} px`, w: parseInt(breakpoint.mobile, 10) },
  { label: `${parseInt(breakpoint.tablet, 10)} px`, w: parseInt(breakpoint.tablet, 10) },
  { label: `${parseInt(breakpoint.desktop, 10)} px`, w: parseInt(breakpoint.desktop, 10) },
  { label: "Pleine largeur", w: null },
];

/* Les paliers sont des Button du kit (stroke neutre) — plus de <button> restylé ;
   l'état pressé garde son signal non chromatique via aria-pressed + bordure primary. */

/** Aperçu redimensionnable : poignée au pointeur ou au clavier (flèches, Origine/Fin),
 *  paliers cliquables pour la même fonction sans glisser, double-clic pour réinitialiser.
 *  `fill` = composant pleine surface (shell) : pas de centrage/padding, hauteur remplie.
 *  Bouton plein écran pour tester aux vraies largeurs. */
export function ResizablePreview({ children, fill = false }: { children: React.ReactNode; fill?: boolean }) {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const [w, setW] = React.useState<number | null>(null);
  const [max, setMax] = React.useState(0);
  const [drag, setDrag] = React.useState(false);
  const [full, setFull] = React.useState(false);

  // Largeur disponible : borne haute réelle de la poignée et des paliers (valeur annoncée à l'AT).
  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const lire = () => setMax(el.getBoundingClientRect().width);
    lire();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(lire);
    ro.observe(el);
    return () => ro.disconnect();
  }, [full]);

  React.useEffect(() => {
    if (!full) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFull(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [full]);

  const borne = React.useCallback(
    (v: number) => Math.max(MIN, Math.min(max || v, v)),
    [max],
  );
  const courante = Math.round(w === null ? max : Math.min(w, max || w));

  const onDown = (e: React.PointerEvent) => {
    e.preventDefault();
    const wrap = wrapRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    setDrag(true);
    const move = (ev: PointerEvent) => setW(Math.max(MIN, Math.min(rect.width, ev.clientX - rect.left)));
    const up = () => {
      setDrag(false);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  /** Modèle « window splitter » : flèches (±16, ±64 avec Maj), Origine = minimum, Fin = pleine largeur. */
  const onKeyPoignee = (e: React.KeyboardEvent) => {
    const pas = e.shiftKey ? PAS_LARGE : PAS;
    const cur = w === null ? max : w;
    if (e.key === "ArrowLeft") { e.preventDefault(); setW(borne(cur - pas)); }
    else if (e.key === "ArrowRight") { e.preventDefault(); setW(borne(cur + pas)); }
    else if (e.key === "Home") { e.preventDefault(); setW(MIN); }
    else if (e.key === "End") { e.preventDefault(); setW(null); }
  };

  /**
   * En place, on n'affiche que les paliers qui tiennent réellement dans l'atelier : proposer
   * « Desktop » dans une colonne de 350 px n'apprend rien. Les paliers larges reviennent en
   * plein écran, là où ils sont vérifiables.
   */
  const barre = (
    <div className="flex items-center gap-1" role="group" aria-label="Largeurs de test de l'aperçu">
      {PALIERS.filter((p) => full || p.w === null || max === 0 || p.w <= max).map((p) => {
        const horsAtelier = p.w !== null && max > 0 && p.w > max;
        const actif = p.w === null ? w === null : w !== null && Math.round(w) === p.w;
        return (
          <Button.Root
            key={p.label}
            variant="lighter"
            tone="primary"
            size="sm"
            disabled={horsAtelier}
            onClick={() => setW(p.w === null ? null : borne(p.w))}
            title={horsAtelier ? `Plus large que l'atelier — passer en plein écran` : p.w === null ? "Pleine largeur" : `Aperçu à ${p.w} px`}
            aria-pressed={actif}
            className={actif ? "border-primary font-semibold" : undefined}
          >
            {p.label}
          </Button.Root>
        );
      })}
    </div>
  );

  const frame = (
    <div ref={wrapRef} className={"relative w-full" + (full ? " min-h-0 flex-1" : "")}>
      <div
        style={{ width: w ? `${w}px` : "100%", ...CHECKER }}
        className={"relative max-w-full overflow-hidden rounded-xl border border-border" + (full ? " h-full" : "")}
      >
        <div className={innerCls(fill, full)}>{children}</div>
        {w ? (
          <span className="pointer-events-none absolute bottom-3 right-3 z-10 rounded-md border border-border bg-background px-2 py-1 font-mono text-xs text-text-secondary">
            {Math.round(w)}px
          </span>
        ) : null}
      </div>
      <div
        role="separator"
        tabIndex={0}
        aria-orientation="vertical"
        aria-label="Largeur de l'aperçu"
        aria-valuemin={MIN}
        aria-valuemax={Math.round(max) || MIN}
        aria-valuenow={courante || MIN}
        aria-valuetext={`${courante || MIN} pixels`}
        onPointerDown={onDown}
        onKeyDown={onKeyPoignee}
        onDoubleClick={() => setW(null)}
        title="Glisser ou flèches gauche/droite pour redimensionner · double-clic pour réinitialiser"
        style={{ left: w ? `${w}px` : "100%", transform: "translateX(-50%)" }}
        className="group absolute top-0 flex h-full w-6 cursor-ew-resize touch-none items-center justify-center rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--control-focus-color)]"
      >
        <span className={"w-1.5 rounded-full transition-all " + (drag ? "h-11 bg-primary" : "h-8 bg-border-strong group-hover:h-11 group-hover:bg-primary group-focus-visible:h-11 group-focus-visible:bg-primary")} />
      </div>
    </div>
  );

  if (full) {
    return (
      <div className="fixed inset-0 z-[80] flex flex-col gap-2 bg-background p-3">
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-xs text-text-secondary">
            Aperçu plein écran{w ? ` · ${Math.round(w)}px` : ""}
          </span>
          <div className="flex items-center gap-2">
            {barre}
            <Button.Root variant="lighter" tone="primary" size="sm" onClick={() => setFull(false)}>
              <Button.Icon>{IconClose}</Button.Icon>
              Fermer
            </Button.Root>
          </div>
        </div>
        {frame}
      </div>
    );
  }

  return (
    <div className="group/preview relative">
      {/* Les commandes s'effacent au repos mais restent atteignables au clavier : le survol
          n'est jamais l'unique chemin (ACCESSIBILITY-R06, WCAG 1.4.13). */}
      <div className="absolute right-2 top-2 z-40 flex items-center gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover/preview:opacity-100">
        {barre}
        {/* Le plein écran s'ouvre TOUJOURS en pleine largeur — la largeur de test en cours
            appartient à l'atelier, pas à l'aperçu plein écran (on y re-choisit un palier). */}
        <CompactButton
          variant="lighter"
          tone="primary"
          size="md"
          onClick={() => { setW(null); setFull(true); }}
          title="Plein écran"
          aria-label="Aperçu plein écran"
        >
          {IconExpand}
        </CompactButton>
      </div>
      {frame}
    </div>
  );
}

function innerCls(fill: boolean, full: boolean) {
  return fill
    ? "[container-name:atelier-preview] [container-type:inline-size] " + (full ? "h-full" : "h-[520px]")
    : "flex min-h-[220px] items-center justify-center p-xl [container-name:atelier-preview] [container-type:inline-size]";
}
