"use client";
import * as React from "react";
import { Card, CardGroup } from "@fili/react";

/* TEST autonome (hors shell atelier) : le contenu « quand utiliser quoi » de la page
   Cas d'usage (Button), passé dans le groupe de cartes DU PACKAGE — séparées + cliquables,
   donc highlight de proximité réel : la teinte --surface glisse vers la carte visée.
   Depuis le 2026-07-30, les enfants de la collection sont de vraies `Card`
   (l'API `CardGroup.Card` a été supprimée) : ce test consomme exactement l'API publique. */

const CASES = [
  { t: "Action primaire", d: "L'écran attend une action principale claire." },
  { t: "Action secondaire", d: "Une alternative existe à côté de l'action principale." },
  { t: "Action destructive", d: "L'action supprime ou annule de façon irréversible." },
  { t: "Action tertiaire / lien-bouton", d: "L'action est mineure et peu engageante." },
  { t: "Toggle / bouton d'état", d: "Le bouton bascule un état on/off." },
  { t: "Bouton de confirmation", d: "Le bouton valide une action engagée ailleurs." },
  { t: "Bouton d'annulation / retour arrière", d: "L'utilisateur peut revenir sur une action récente." },
];

export default function CasUsageTest() {
  return (
    <div className="mx-auto max-w-[1100px] px-xl py-xl font-sans">
      <span className="font-label text-xs font-semibold uppercase tracking-wide text-text-secondary">Test — hors MD</span>
      <h1 className="m-0 mb-2 mt-1 text-3xl font-medium text-text-primary">Cas d'usage — rendu avec le groupe de cartes du DS</h1>
      <p className="mb-lg max-w-[64ch] text-sm leading-relaxed text-text-secondary">
        Le contenu « quand utiliser quoi » de la page Cas d'usage (Button), passé dans le groupe de cartes
        du package, en séparées + cliquables : le highlight de proximité glisse vers la carte visée.
      </p>
      <CardGroup cols={3} separated mode="clickable" label="Cas d'usage du bouton">
        {CASES.map((c, i) => (
          <Card.Root key={i}>
            <Card.Body>
              <Card.Header>
                <Card.Title as="h2">
                  <Card.TitleLink href="#">{c.t}</Card.TitleLink>
                </Card.Title>
              </Card.Header>
              <Card.Description>{c.d}</Card.Description>
            </Card.Body>
          </Card.Root>
        ))}
      </CardGroup>
    </div>
  );
}
