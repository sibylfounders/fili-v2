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
export function Band({ name, side, says, bare, broken, onBroken, labelBroken, labelRepaired, rules, level = 3, children }: {
  name: string; side?: ReactNode; says: ReactNode; bare?: boolean;
  /* Le niveau du titre de la bande suit sa place dans l'arbre : h3 sous une
     section, h4 quand la bande vit sous un sous-titre du répertoire — jamais
     un saut de niveau (T1). */
  level?: 3 | 4;
  broken?: boolean; onBroken?: (v: boolean) => void;
  /* Exception déclarée : une bande dont la commande n'est pas une faute mais
     un GESTE de l'utilisateur (agrandir le texte) nomme ses deux états. */
  labelBroken?: string; labelRepaired?: string;
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
        {onBroken && (
          <button type="button" className="doc-wreck" aria-pressed={!!broken}
            onClick={() => onBroken(!broken)}>
            {broken ? (labelRepaired ?? "Réparer") : (labelBroken ?? "Casser")}
          </button>
        )}
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
