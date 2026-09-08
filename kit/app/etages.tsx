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

export function Bandes({ children }: { children: ReactNode }) {
  return <div className="doc-bandes">{children}</div>;
}

/* Une variante DÉCLARÉE, pas une liberté : « nue » — la scène apporte
   déjà sa propre coque, le cadre s'efface pour ne pas poser une surface
   sur une surface (CG4). */
export function Bande({ nom, cote, dit, nue, casse, surCasse, libelleCasse, libelleRepare, regles, niveau = 3, children }: {
  nom: string; cote?: ReactNode; dit: ReactNode; nue?: boolean;
  /* Le niveau du titre de la bande suit sa place dans l'arbre : h3 sous une
     section, h4 quand la bande vit sous un sous-titre du répertoire — jamais
     un saut de niveau (T1). */
  niveau?: 3 | 4;
  casse?: boolean; surCasse?: (v: boolean) => void;
  /* Exception déclarée : une bande dont la commande n'est pas une faute mais
     un GESTE de l'utilisateur (agrandir le texte) nomme ses deux états. */
  libelleCasse?: string; libelleRepare?: string;
  regles?: ReactNode; children: ReactNode;
}) {
  return (
    <div className="doc-bande">
      <div className="doc-bande-dire">
        {niveau === 4
          ? <h4 className="doc-bande-nom">{nom}</h4>
          : <h3 className="doc-bande-nom">{nom}</h3>}
        {cote && <span className="doc-bande-cote mono">{cote}</span>}
        <p className="doc-bande-dit">{dit}</p>
        {surCasse && (
          <button type="button" className="doc-casser" aria-pressed={!!casse}
            onClick={() => surCasse(!casse)}>
            {casse ? (libelleRepare ?? "Réparer") : (libelleCasse ?? "Casser")}
          </button>
        )}
      </div>
      <div className={`doc-scene${nue ? " nue" : ""}`}>{children}</div>
      {/* Les sources se lisent SOUS leur règle, pas en tas à la fin de
          l'étage (verdict d'Auteur, 1er septembre). Le dépliant traverse
          les deux colonnes : une source a besoin de la mesure du texte. */}
      {regles && (
        <details className="prov doc-bande-prov">
          <summary>Règles &amp; sources</summary>
          <div>{regles}</div>
        </details>
      )}
    </div>
  );
}

/* ── Étage 3 · en liste ─────────────────────────────────────────────── */

/* « où elle se vérifie » a trois tons : dans le code (le Gardien la
   mordra), sur l'écran allumé (elle se constate au rendu), nulle part
   (c'est une décision d'Auteur, elle s'assume et se date). */
export type LigneListe = {
  nom: string; dit: ReactNode; ou: ReactNode;
  ton?: "code" | "rendu" | "auteur";
};

export function ListeRegles({ lignes }: { lignes: LigneListe[] }) {
  return (
    <table className="doc-liste">
      <thead>
        <tr>
          <th scope="col">La règle</th>
          <th scope="col">Ce qu&apos;elle dit</th>
          <th scope="col">Où elle se vérifie</th>
        </tr>
      </thead>
      <tbody>
        {lignes.map((l) => (
          <tr key={l.nom}>
            <td data-quoi="La règle"><span className="l-nom">{l.nom}</span></td>
            <td className="l-dit" data-quoi="Elle dit">{l.dit}</td>
            <td className={`l-ou ${l.ton ?? "code"}`} data-quoi="Vérifiée">{l.ou}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ── Étage 4 · dans le code ─────────────────────────────────────────── */

export type LigneCode = {
  regle: string; ecrit: ReactNode; produit: ReactNode;
  note?: string; repli?: boolean;
};

export function PanneauRegistre({ lignes }: { lignes: LigneCode[] }) {
  const [ouvert, setOuvert] = useState(false);
  const id = useId();
  /* Le repli est porté par le CSS (data-repli / data-ouvert) : sans
     JavaScript, le panneau reste lisible — replié, mais entier au clic
     du navigateur sur l'ancre. */
  return (
    <div className="doc-panneau">
      <table className="doc-code" id={id} data-ouvert={ouvert ? "oui" : "non"}>
        <thead>
          <tr>
            <th scope="col">Ce qu&apos;on écrit</th>
            <th scope="col">Ce que ça produit</th>
          </tr>
        </thead>
        <tbody>
          {lignes.map((l) => (
            <tr key={l.regle} data-repli={l.repli ? "oui" : undefined}>
              <td>
                <span className="regle">{l.regle}</span>
                {l.ecrit}
              </td>
              <td>
                <span className="cs-val">{l.produit}</span>
                {l.note && <span className="cs-com">{`/* ${l.note} */`}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="doc-panneau-pied">
        <button type="button" className="doc-deplier" aria-expanded={ouvert} aria-controls={id}
          onClick={() => setOuvert(!ouvert)}>
          {ouvert ? "Réduire" : `Tout voir — ${lignes.length} lignes`}
        </button>
      </div>
    </div>
  );
}
