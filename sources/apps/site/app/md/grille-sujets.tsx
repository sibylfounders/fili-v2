"use client";
import NextLink from "next/link";
import { Card, CardGroup } from "@fili/react";

/**
 * Grille des sujets d'une nature — CLIENT.
 *
 * Une collection de destinations de même nature : `CardGroup` (pattern COLLECTION) en mode
 * `clickable`, dont les enfants sont de vraies `Card` — la seule anatomie de carte du kit
 * (l'API `CardGroup.Card` a été supprimée le 2026-07-30). La cible étendue est un vrai
 * lien (`Card.TitleLink`) ; la pastille d'emblème est `Card.Icon` — un affleurement
 * d'ITEM, donc autorité CARD, plus jamais la collection.
 * Elle était écrite à la main en `<Link>` bordés, ce qui privait la page des filets
 * internes, des coins hérités et du highlight de proximité — et faisait diverger la
 * doctrine de son propre site.
 *
 * ROUTAGE : `Card.TitleLink asChild` + `next/link` — le routeur préfixe le `basePath` du
 * déploiement. Sans lui, /md/<slug>/ pointait hors du site une fois publié (2026-07-30).
 *
 * Client parce que les composés du kit sont exportés par des modules `"use client"` : y
 * accéder depuis le graphe serveur produit une référence que le manifest de Next 14.2
 * n'enregistre pas. La page serveur ne passe donc que des données sérialisables.
 */
export type SujetTuile = {
  slug: string;
  titre: string;
  meta: string;
  embleme?: string;
};

export function GrilleSujets({ items, label }: { items: SujetTuile[]; label: string }) {
  return (
    <CardGroup cols="auto" mode="clickable" separated label={label}>
      {items.map((s) => (
        <Card.Root key={s.slug}>
          <Card.Body>
            <Card.Header>
              <div className="flex min-w-0 flex-col">
                {s.embleme ? (
                  <Card.Icon className="mb-sm" dangerouslySetInnerHTML={{ __html: s.embleme }} />
                ) : null}
                <Card.Title as="h3">
                  <Card.TitleLink asChild>
                    <NextLink href={`/md/${s.slug}/`}>{s.titre}</NextLink>
                  </Card.TitleLink>
                </Card.Title>
              </div>
            </Card.Header>
            <p className="m-0 mt-2xs font-mono text-[11px] text-text-muted">{s.meta}</p>
          </Card.Body>
        </Card.Root>
      ))}
    </CardGroup>
  );
}
