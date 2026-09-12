"use client";
import { useId, useState } from "react";
import type { ReactNode } from "react";

/* ═══════════════════════════════════════════════════════════════════════
   LES PIÈCES DU RÉPERTOIRE — les formes communes aux pages du kit
   (verdict d'Auteur, 1er septembre 2026 ; depuis le 8 septembre, chaque page
   les assemble sous UN SEUL titre à elle — le répertoire — dans l'ordre que
   sa matière commande, et non plus en trois sections aux titres identiques).

   L'étage des PREUVES n'a pas de gabarit, et n'en aura pas : c'est la
   part de séduction et de plus-value, sa forme doit différer d'une page
   à l'autre. Ce fichier ne le touche jamais. Ce qui s'unifie, c'est ce
   qui vient SOUS les preuves :

   · étage « en bandes » — ce qui se voit : une règle par bande, la
     parole à gauche (titre, cote, phrase, la commande qui casse), la
     scène à droite, à la largeur qu'il lui faut.
   · étage « en liste » — ce qu'aucune image ne prouve : une ligne par
     règle, et la colonne qui dit où elle se vérifie.
   · étage « dans le code » — une terre sombre : à gauche ce qu'on écrit,
     à droite ce que ça produit, la valeur réelle en commentaire.

   Les classes portent le préfixe doc- : elles appartiennent au gabarit
   documentaire, pas à une page. Leurs styles vivent dans globals.css.
   ═══════════════════════════════════════════════════════════════════════ */

/* ── Étage 2 · en bandes ─────────────────────────────────────────────── */

export function Bands({ children }: { children: ReactNode }) {
  return <div className="doc-bands">{children}</div>;
}

/* Une variante DÉCLARÉE, pas une liberté : « nue » — la scène apporte
   déjà sa propre coque, le cadre s'efface pour ne pas poser une surface
   sur une surface (CG4). */
export function Band({ name, side, says, bare, rules, level = 3, children }: {
  name: string; side?: ReactNode; says: ReactNode; bare?: boolean;
  /* Le niveau du titre de la bande suit sa place dans l'arbre : h3 sous une
     section, h4 quand la bande vit sous un sous-titre du répertoire — jamais
     un saut de niveau (T1). */
  level?: 3 | 4;
  rules?: ReactNode; children: ReactNode;
}) {
  return (
    <div className="doc-band">
      <div className="doc-band-say">
        {level === 4
          ? <h4 className="doc-band-name">{name}</h4>
          : <h3 className="doc-band-name">{name}</h3>}
        {side && <span className="doc-band-side mono">{side}</span>}
        <p className="doc-band-says">{says}</p>
      </div>
      <div className={`doc-scene${bare ? " bare" : ""}`}>{children}</div>
      {/* Les sources se lisent SOUS leur règle, pas en tas à la fin de
          l'étage (verdict d'Auteur, 1er septembre). Le dépliant traverse
          les deux colonnes : une source a besoin de la mesure du texte. */}
      {rules && (
        <details className="prov doc-band-prov">
          <summary>Règles &amp; sources</summary>
          <div>{rules}</div>
        </details>
      )}
    </div>
  );
}

/* ── Le cadre d'une démonstration (verdict d'Auteur, 9 septembre) ──
   La tête dit la situation en une phrase et porte l'action — une seule, à
   droite, avec le verbe de la situation. Deux côtés quand les deux états
   vivent ensemble : au repos, chaque côté montre ce que son verdict dit, et
   l'action REJOUE depuis l'état commun. Une scène quand la casse remplace
   l'état : un verdict au-dessus, l'action bascule et se retourne (« Réparer »,
   secondaire, avec l'icône du retour). La colonne de parole de la bande garde
   le pourquoi ; le cadre dit ce qui se passe. */
export function Demo({ situation, action, bar, tools, caption, children }: {
  situation: ReactNode;
  /* `active` + `back` : l'action bascule (forme B). Sans eux, elle rejoue (forme A). */
  /* `disabled` : l'action existe dans ce cadre mais pas dans cet état — elle reste en place, la tête garde sa hauteur */
  action?: { label: string; onClick: () => void; back?: string; active?: boolean; disabled?: boolean };
  /* un choix à plusieurs positions (les fautes, ce qu'on montre) : SOUS la tête, à la place du verdict */
  bar?: ReactNode;
  /* un réglage partagé par les deux côtés (une molette) : SOUS le phénomène — le lecteur regarde d'abord la scène */
  tools?: ReactNode;
  caption?: ReactNode;
  children: ReactNode;
}) {
  const back = !!action?.back && !!action.active;
  return (
    <div className="demo-wrap">
      <div className="demo">
        <div className="demo-head">
          <b>{situation}</b>
          {action && (
            <button type="button" className={`button ${back ? "" : "on"} demo-go ${back ? "back" : ""}`}
              aria-pressed={action.back ? !!action.active : undefined} disabled={action.disabled} onClick={action.onClick}>
              <span className="demo-icons" aria-hidden="true">
                <svg className="demo-ic-play" viewBox="0 0 10 10"><path d="M2 1l7 4-7 4z" /></svg>
                {action.back && <svg className="demo-ic-back" viewBox="0 0 12 12"><path d="M4.5 2.5 2 5l2.5 2.5M2 5h5a3 3 0 0 1 0 6H5" /></svg>}
              </span>
              {/* les deux libellés partagent une case : la largeur ne bouge jamais */}
              <span className="demo-labels">
                <span className="demo-l-go">{action.label}</span>
                {action.back && <span className="demo-l-back">{action.back}</span>}
              </span>
            </button>
          )}
        </div>
        {/* le choix sous la tête, à la place d'une ligne de verdict (retour d'Auteur, 9 septembre) */}
        {bar && <div className="demo-bar">{bar}</div>}
        {children}
        {tools && <div className="demo-tools">{tools}</div>}
      </div>
      {caption && <p className="demo-caption mono muted">{caption}</p>}
    </div>
  );
}

/* Deux côtés : les verdicts partagent une rangée, les scènes la suivante —
   un verdict qui replie ne décale jamais sa scène ; les colonnes sont égales. */
export function DemoSides({ children }: { children: ReactNode }) {
  return <div className="demo-compare">{children}</div>;
}
export function DemoSide({ ok, verdict, children }: { ok: boolean; verdict: ReactNode; children: ReactNode }) {
  return (
    <div className={`demo-side ${ok ? "good" : "bad"}`} data-intent={ok ? undefined : "statement"}>
      <p className="demo-verdict"><span aria-hidden="true">{ok ? "✓" : "✗"}</span><span>{verdict}</span></p>
      <div className="demo-stage">{children}</div>
    </div>
  );
}
/* Une scène : le verdict au-dessus bascule avec l'action. */
export function DemoScene({ ok, verdict, children }: { ok: boolean | null; verdict?: ReactNode; children: ReactNode }) {
  const tone = ok === null ? "neutral" : ok ? "good" : "bad";
  return (
    <div className={`demo-single ${tone}`} data-intent={ok === false ? "statement" : undefined}>
      {/* sans verdict quand la scène se commente elle-même (les réglages sous la tête tiennent la place) */}
      {verdict != null && <p className="demo-verdict"><span aria-hidden="true">{ok === null ? "·" : ok ? "✓" : "✗"}</span><span>{verdict}</span></p>}
      <div className="demo-stage">{children}</div>
    </div>
  );
}

/* ── Étage 3 · en liste ─────────────────────────────────────────────── */

/* « où elle se vérifie » a trois tons : dans le code (le Gardien la
   mordra), sur l'écran allumé (elle se constate au rendu), nulle part
   (c'est une décision d'Auteur, elle s'assume et se date). */
export type LineList = {
  name: string; says: ReactNode; or: ReactNode;
  tone?: "code" | "render" | "author";
};

export function ListRules({ lines }: { lines: LineList[] }) {
  return (
    <table className="doc-list">
      <thead>
        <tr>
          <th scope="col">La règle</th>
          <th scope="col">Ce qu&apos;elle dit</th>
          <th scope="col">Où elle se vérifie</th>
        </tr>
      </thead>
      <tbody>
        {lines.map((l) => (
          <tr key={l.name}>
            <td data-what="La règle"><span className="l-name">{l.name}</span></td>
            <td className="l-says" data-what="Elle dit">{l.says}</td>
            <td className={`l-or ${l.tone ?? "code"}`} data-what="Vérifiée">{l.or}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ── Étage 4 · dans le code ─────────────────────────────────────────── */

export type LineCode = {
  rule: string; written: ReactNode; product: ReactNode;
  note?: string; fallback?: boolean;
};

export function PanelRegistry({ lines }: { lines: LineCode[] }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  /* Le repli est porté par le CSS (data-repli / data-ouvert) : sans
     JavaScript, le panneau reste lisible — replié, mais entier au clic
     du navigateur sur l'ancre. */
  return (
    <div className="doc-panel">
      <table className="doc-code" id={id} data-open={open ? "oui" : "not"}>
        <thead>
          <tr>
            <th scope="col">Ce qu&apos;on écrit</th>
            <th scope="col">Ce que ça produit</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((l) => (
            <tr key={l.rule} data-fallback={l.fallback ? "oui" : undefined}>
              <td>
                <span className="rule">{l.rule}</span>
                {l.written}
              </td>
              <td>
                <span className="cs-val">{l.product}</span>
                {l.note && <span className="cs-com">{`/* ${l.note} */`}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="doc-panel-foot">
        <button type="button" className="doc-unfold" aria-expanded={open} aria-controls={id}
          onClick={() => setOpen(!open)}>
          {open ? "Réduire" : `Tout voir — ${lines.length} lignes`}
        </button>
      </div>
    </div>
  );
}
