// FIXTURE NÉGATIVE — chaque motif ci-dessous DOIT être détecté par fili-check.
import { Button } from "@sibyl/react";
import * as React from "react";

export function Mauvais() {
  const go = () => {};
  return (
    <div>
      {/* contrôle natif sur une ligne */}
      <button onClick={go}>Enregistrer</button>
      {/* contrôle natif sur PLUSIEURS lignes (l'analyse ligne à ligne le ratait) */}
      <input
        type="email"
        placeholder="vous@exemple.fr"
      />
      <select>
        <option>Un</option>
      </select>
      <div onClick={go}>Cliquer ici</div>
      <span role="button" tabIndex={0}>pseudo-bouton</span>
      {/* palette Tailwind brute */}
      <p className="text-gray-500">gris cru</p>
      {/* carte recréée localement */}
      <div className="border rounded-lg shadow-md bg-white p-4">carte maison</div>
      {/* valeur d'axe inventée */}
      <Button variant="filled" tone="magic">Magique</Button>
      {/* valeurs d'échelle écrites à la main en style inline — aucune classe à lire :
          c'est par là que la page d'accueil du site échappait à toutes les gardes
          (audit de cohérence 2026-07-30) */}
      <p style={{ fontSize: "2.2rem", marginTop: 32 }}>titre maison</p>
      {/* carte recréée en STYLE INLINE : la bordure est pourtant tokenisée — une carte
          reste une carte, quelle que soit la façon dont elle est écrite */}
      <a href="/x" style={{ border: "1px solid var(--border)", borderRadius: 10, padding: "18px 20px" }}>
        carte maison en style inline
      </a>
      {/* carte recréée SANS ombre ni fond : bordure + rayon + espacement suffisent */}
      <div className="rounded-md border border-border px-md py-3">encart maison</div>
      {/* FILI-MANQUE: date-picker — aucune fiche .fili/manques/date-picker.md ici */}
    </div>
  );
}
