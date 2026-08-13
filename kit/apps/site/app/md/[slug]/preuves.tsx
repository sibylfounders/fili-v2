"use client";
import { Card, CardGroup } from "@fili/react";

/**
 * Les preuves chiffrées de l'essentiel d'un sujet — CLIENT.
 *
 * Collection statique de petites surfaces de contenu : de vraies `Card` dans le pattern
 * COLLECTION (colonnes intrinsèques — plus jamais un `tablet:grid-cols-3` par appareil,
 * ADAPTIVE-R06). Elles étaient recréées à la main en `div` bordés-arrondis (constat
 * fili-check « carte-recreee », soldé le 2026-07-30). Pas de titre : une preuve est un
 * chiffre et son libellé, pas une section du document.
 */
export type Preuve = { valeur: string; libelle: string };

export function Preuves({ preuves, label }: { preuves: Preuve[]; label: string }) {
  return (
    <CardGroup cols="auto" mode="static" separated label={label}>
      {preuves.map((p, i) => (
        <Card.Root key={i}>
          <Card.Body>
            <p className="m-0 text-h3 font-semibold text-text-primary">{p.valeur}</p>
            <Card.Description>{p.libelle}</Card.Description>
          </Card.Body>
        </Card.Root>
      ))}
    </CardGroup>
  );
}
