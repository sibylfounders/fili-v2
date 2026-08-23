"use client";
import NextLink from "next/link";
import { Card, CardGroup, Link } from "@fili/react";
import type { Entree, Sources } from "./page";

/**
 * Vue de la page Sources — CLIENT.
 *
 * Pourquoi ce découpage : `page.tsx` lit `sources.json` et le dossier des logos par `fs`,
 * donc reste un composant serveur. Or les composés du kit sont exportés par des modules
 * `"use client"` : accéder à une de leurs propriétés depuis le graphe serveur oblige le
 * bundler à fabriquer une référence imbriquée que le React Client Manifest de Next 14.2
 * n'enregistre pas. Le serveur ne passe donc que des données sérialisables, et toute la
 * composition vit ici.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * CARD ou CARDGROUP ? La règle, une fois pour toutes.
 *
 * Il n'existe qu'UNE anatomie de carte : `Card` (`Card.Root/Media/Icon/Header/Body/Title/
 * TitleLink/TitleCommand/Description/Actions`). `CardGroup` est le pattern COLLECTION :
 * il assemble et orchestre ces `Card` (colonnes, filets, coins, régime joint/séparé,
 * highlight de proximité, balisage de liste) et leur transmet son mode et sa densité par
 * contexte — il ne redessine JAMAIS leur contenu. L'ancienne API `CardGroup.Card` (une
 * seconde carte monolithique) a été supprimée le 2026-07-30.
 *
 * Ici c'est une collection : des `Card` dans le `CardGroup`, avec `Card.Icon` pour la
 * vignette, `Card.TitleLink` pour la destination, et le contenu libre pour les compteurs.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * Marque de la source — le logo s'il a été déposé dans `public/logos/`, sinon un monogramme.
 * Servi depuis notre domaine, jamais chargé chez son propriétaire : aucune requête tierce,
 * donc aucune adresse IP de visiteur transmise.
 *
 * Passée dans `Card.Icon` et non `Card.Media` : `media` est un visuel illustratif cadré en
 * haut de la carte, alors qu'il s'agit d'une pastille alignée sur le titre — exactement ce
 * que `Card.Icon` désigne.
 */
function Marque({ e, present }: { e: Entree; present: boolean }) {
  if (!present) {
    return <span className="font-label text-xs font-semibold text-text-muted">{e.monogramme}</span>;
  }
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={`/logos/${e.logo}`}
      alt=""
      width={24}
      height={24}
      loading="lazy"
      className="size-6 object-contain"
    />
  );
}

export function VueSources({ d, logos }: { d: Sources; logos: string[] }) {
  const presents = new Set(logos);
  const poses = d.entrees.filter((e) => presents.has(e.logo)).length;

  return (
    <main className="mx-auto max-w-[980px] px-lg py-xl">
      <p className="m-0">
        {/* Routage Next, facture et focus Fili : next/link composé via Link asChild. */}
        <Link asChild context="navigation" className="text-sm">
          <NextLink href="/md/">← Doctrine</NextLink>
        </Link>
      </p>

      <div className="mt-md flex flex-wrap items-baseline gap-sm">
        <h1 className="m-0 text-h1 font-medium text-text-primary">{d.titre}</h1>
        <span className="font-label text-xs font-semibold uppercase tracking-wide text-text-secondary">
          Méthode
        </span>
      </div>

      <p className="mt-md max-w-[70ch] text-base leading-relaxed text-text-secondary">{d.lead}</p>

      <p className="mt-sm font-label text-xs uppercase tracking-wide text-text-muted">
        {d.entrees.length} organisations · {d.total_citations} citations · {d.total_hotes} domaines
        distincts
      </p>

      {d.familles.map((f) => {
        const lot = d.entrees.filter((e) => e.famille === f);
        if (!lot.length) return null;
        return (
          <section key={f} className="mt-xl">
            <h2 className="m-0 mb-md text-h3 font-medium text-text-primary">{f}</h2>
            {/* Collection : le mode vit sur le groupe, jamais sur la carte (CARD-UX).
                `clickable` + `Card.TitleLink` → la cible étendue est un vrai lien.
                Pas de nouvel onglet : LINK-R09 réserve l'ouverture externe aux cas
                exceptionnels et exige qu'elle soit annoncée. */}
            <CardGroup cols="auto" mode="clickable" separated label={`Sources — ${f}`}>
              {lot.map((e) => (
                <Card.Root key={e.nom}>
                  <Card.Body>
                    <Card.Header>
                      <div className="flex min-w-0 flex-col">
                        <Card.Icon className="mb-sm">
                          <Marque e={e} present={presents.has(e.logo)} />
                        </Card.Icon>
                        <Card.Title as="h3">
                          <Card.TitleLink href={e.url}>{e.nom}</Card.TitleLink>
                        </Card.Title>
                      </div>
                    </Card.Header>
                    {e.description ? <Card.Description>{e.description}</Card.Description> : null}
                    <p className="m-0 mt-xs font-label text-xs text-text-muted">
                      {e.citations} citation{e.citations > 1 ? "s" : ""} · {e.sujets} sujet
                      {e.sujets > 1 ? "s" : ""}
                    </p>
                  </Card.Body>
                </Card.Root>
              ))}
            </CardGroup>
          </section>
        );
      })}

      <section className="mt-xl">
        <h2 className="m-0 mb-md text-h3 font-medium text-text-primary">Les logos</h2>
        {/* Carte isolée : `solo` — pas de grille, pas de highlight de proximité.
            Mode statique : rien à cliquer, donc aucune affordance de relief. */}
        <CardGroup solo mode="static" label="À propos des logos">
          <Card.Root>
            <Card.Body>
              <Card.Header>
                <Card.Title as="h3">
                  {poses} logo{poses > 1 ? "s" : ""} sur {d.entrees.length} en place
                </Card.Title>
              </Card.Header>
              <Card.Description>
                Les autres affichent un monogramme en attendant leur fichier.
              </Card.Description>
              <p className="m-0 mt-sm text-sm leading-relaxed text-text-secondary">
                Ils sont servis depuis notre propre domaine, jamais chargés chez leur
                propriétaire&nbsp;: aucune requête vers un tiers, donc aucune adresse IP de visiteur
                transmise. C&rsquo;est la contrainte que nos audits imposent aux autres, elle vaut
                d&rsquo;abord pour nous.
              </p>
              <p className="m-0 mt-sm text-sm leading-relaxed text-text-secondary">
                Ces marques appartiennent à leurs détenteurs et sont reproduites au seul titre de la
                citation de nos sources. Leur présence n&rsquo;indique ni partenariat, ni approbation,
                ni affiliation.
              </p>
            </Card.Body>
          </Card.Root>
        </CardGroup>
      </section>

      <p className="mt-lg font-label text-xs text-text-muted">
        Page générée par <code>tools/compile-sources.py</code> à partir des citations réelles des
        fichiers de doctrine. Les chiffres ne sont pas saisis à la main.
      </p>
    </main>
  );
}
