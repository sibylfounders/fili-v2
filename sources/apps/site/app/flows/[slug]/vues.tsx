"use client";

/**
 * La page de flow, lue comme un QA de parcours.
 *
 * Destinataire : le product builder, AVANT qu'il touche une vue. La question à laquelle
 * cette page répond tient en une ligne — « quels moments du parcours réclament une
 * intervention, et de qui ? »
 *
 * Tout le rendu vit côté client : `@fili/react` est un baril `"use client"`, ses composants
 * à namespace ne se résolvent pas dans le manifeste quand une page serveur les rend.
 */

import { useMemo, useState } from "react";
import NextLink from "next/link";
import { Alert, Card, Link } from "@fili/react";
import type { Cas, Graphe, Moment } from "@/lib/flows";
import { Diagramme } from "./diagramme";
import { VERDICTS, type Verdict } from "./noeuds";

const Chapeau = ({ kicker, titre, lead }: { kicker: string; titre: string; lead?: string }) => (
  <header className="mb-lg max-w-[70ch]">
    <p className="m-0 font-label text-xs font-semibold uppercase tracking-wider text-text-muted">
      {kicker}
    </p>
    <h2 className="m-0 mt-1 text-h3 font-semibold text-text-primary">{titre}</h2>
    {lead ? <p className="mt-sm text-text-secondary">{lead}</p> : null}
  </header>
);

/* ── Le verdict d'ensemble, en une phrase ─────────────────────────────────── */
function Verdict({ g }: { g: Graphe }) {
  const aIntervenir = g.moments.filter((m) => m.verdict !== "couvert");
  const detachees = g.extensions.length + g.bifurcations.filter((b) => b).length;

  return (
    <Alert.Root tone={aIntervenir.length ? "warning" : "success"} className="mb-xl">
      <Alert.Icon />
      <Alert.Content>
        <Alert.Title>
          {aIntervenir.length
            ? `${aIntervenir.length} moment${aIntervenir.length > 1 ? "s" : ""} sur ${g.moments.length} réclament une intervention`
            : "Aucun moment ne réclame d’intervention"}
        </Alert.Title>
        <Alert.Description>
          {g.resume.couvert}/{g.couverture.length} cas d’usage tranchés · {detachees} branches que
          la fiche ne raccorde à aucun moment · {g.aArbitrer.length} arbitrages ouverts. Cliquer un
          moment du diagramme pour voir ce qu’il reste à faire dessus.
        </Alert.Description>
      </Alert.Content>
    </Alert.Root>
  );
}

/* ── Ce qu'il reste à faire sur un moment ─────────────────────────────────── */
function FicheMoment({ m, g }: { m: Moment; g: Graphe }) {
  const v = VERDICTS[(m.verdict ?? "sans rattachement") as Verdict];
  const couverts = g.couverture.filter(
    (c) => m.casRattaches.includes(c.cas) && c.statut === "Couvert",
  );

  return (
    <Card.Root mode="static" className={`${v.bordure} border-2`}>
      <Card.Body>
        <span className={`font-label text-xs font-semibold uppercase tracking-wider ${v.texte}`}>
          Moment {m.index} · {v.libelle}
        </span>
        <Card.Title className="mt-1 text-base">{m.titre}</Card.Title>
        <Card.Description className="mt-sm">{m.texte}</Card.Description>

        {m.interventions.length ? (
          <>
            <p className="mb-sm mt-lg font-label text-xs font-semibold uppercase tracking-wider text-text-muted">
              À traiter avant d’intervenir sur la vue
            </p>
            <ul className="m-0 list-none space-y-sm p-0">
              {m.interventions.map((i) => (
                <li key={i.cas} className="text-sm">
                  <span className="font-semibold text-text-primary">{i.cas}</span>
                  <br />
                  <span className="text-text-secondary">
                    {i.statut}
                    {i.proprietaire ? ` · ${i.proprietaire}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          </>
        ) : null}

        {m.verdict === "sans rattachement" ? (
          <Card.Description className="mt-lg text-warning">
            Aucun § de la fiche ne porte l’intitulé « {m.titre} » : l’inventaire ne peut pas
            raccrocher ses cas d’usage à ce moment. À trancher dans la doctrine, pas ici.
          </Card.Description>
        ) : null}

        {couverts.length ? (
          <Card.Description className="mt-lg">
            {couverts.length} cas déjà tranchés sur ce moment.
          </Card.Description>
        ) : null}
      </Card.Body>
    </Card.Root>
  );
}

/* ── Les cas transversaux : vrais pour tout le parcours ───────────────────── */
function Transversaux({ g }: { g: Graphe }) {
  if (!g.transversal?.length) return null;
  return (
    <section className="mb-xl">
      <Chapeau
        kicker="Transversal"
        titre={`${g.transversal.length} sections qui ne tiennent à aucun moment`}
        lead="Ces cas valent pour tout le parcours (accessibilité, états transitoires, abandon) : ils ne se posent pas sur une vue en particulier."
      />
      <div className="grid gap-md md:grid-cols-3">
        {g.transversal.map((t) => (
          <Card.Root key={t.section} mode="static" density="compact">
            <Card.Body>
              <Card.Title className="text-sm">§ {t.section}</Card.Title>
              <Card.Description className="mt-sm">
                {t.cas.length} cas d’usage
              </Card.Description>
            </Card.Body>
          </Card.Root>
        ))}
      </div>
    </section>
  );
}

/* ── Ce que le flow délègue : qui appeler quand ça coince ─────────────────── */
function Frontieres({ g }: { g: Graphe }) {
  if (!g.frontieres.length) return null;
  const [tout, setTout] = useState(false);
  const sien = g.frontieres.filter((f) => f.duFlow);
  const affichees = tout ? g.frontieres : sien;
  return (
    <section className="mb-xl">
      <Chapeau
        kicker="Qui décide quoi"
        titre={`${sien.length} domaines portés par le flow, ${g.frontieres.length - sien.length} délégués`}
        lead="Un flow n’invente aucune règle de composant ou de pattern — il les séquence. Cette table dit à qui s’adresser."
      />
      <div className="grid gap-md md:grid-cols-2">
        {affichees.map((f) => (
          <Card.Root key={f.domaine} mode="static" density="compact">
            <Card.Body>
              <Card.Title className="text-sm">{f.domaine}</Card.Title>
              <Card.Description className="font-label text-xs uppercase tracking-wider text-text-muted">
                {f.duFlow ? "porté par le flow" : `délégué · ${f.proprietaire}`}
              </Card.Description>
            </Card.Body>
          </Card.Root>
        ))}
      </div>
      {/* L'ÉLÉMENT reste un <button> — cette bascule agit sur la page, elle ne navigue nulle
          part, et c'est l'élément qui le dit aux technologies d'assistance. L'APPARENCE vient
          du kit : `Link context="inline"` porte exactement le soulignement au repos que ces
          classes recopiaient à la main (arbitrage Aurélien, 2026-08-01). */}
      <Link asChild context="inline">
        <button type="button" onClick={() => setTout((x) => !x)} className="mt-md text-sm">
          {tout ? "N’afficher que ce que porte le flow" : "Afficher aussi les domaines délégués"}
        </button>
      </Link>
    </section>
  );
}

/* ── La vue complète ──────────────────────────────────────────────────────── */
export function VueFlow({ graphe: g }: { graphe: Graphe }) {
  const [actif, setActif] = useState<string | null>(null);
  const moment = useMemo(() => g.moments.find((m) => m.id === actif) ?? null, [actif, g.moments]);
  const aIntervenir = g.moments.filter((m) => m.verdict !== "couvert");

  return (
    <main className="mx-auto max-w-container-wide px-lg py-xl">
      <header className="mb-xl max-w-[70ch]">
        <p className="m-0 font-label text-xs font-semibold uppercase tracking-wider text-text-muted">
          Flow · QA de parcours
        </p>
        <h1 className="m-0 mt-1 text-h2 font-semibold text-text-primary">{g.flow}</h1>
        <p className="mt-sm text-text-secondary">
          Le chemin des cas d’usage, à lire avant d’intervenir sur une vue. Projection de{" "}
          <code className="font-mono text-sm">{g.source.fiche}</code> (v{g.version}, empreinte{" "}
          <code className="font-mono text-sm">{g.source.empreinte}</code>) — rien n’est saisi ici,
          on régénère avec <code className="font-mono text-sm">npm run flows</code>.
        </p>
      </header>

      <Verdict g={g} />

      <section className="mb-xl">
        {/* Cette section n'avait AUCUN titre, et les cartes de nœuds du diagramme rendent
            des `Card.Title` — donc des h3 tombant juste après le h1 de la page. Le plan du
            document sautait un niveau (constat `titre-saute` de verifie:rendu). Nommer la
            section corrige les deux d'un coup : le saut, et une section anonyme que rien
            n'annonçait. (Arbitrage Aurélien, 2026-08-01.) */}
        <Chapeau
          kicker="Le parcours"
          titre="Le chemin, moment par moment"
          lead="Chaque carte est un moment ; sa couleur dit son état de couverture, et rien d’autre. Les branches que la fiche ne raccorde à aucun moment restent visiblement détachées, en bas — leur isolement EST le constat."
        />
        <Diagramme graphe={g} momentActif={actif} onMomentActif={setActif} />
      </section>

      <section className="mb-xl">
        <Chapeau
          kicker={moment ? "Le moment sélectionné" : "Les moments à traiter"}
          titre={moment ? moment.titre : `${aIntervenir.length} sur ${g.moments.length}`}
          lead={
            moment
              ? undefined
              : "Cliquer un moment dans le diagramme pour l’isoler. Sans sélection, voici tous ceux qui ne sont pas au vert."
          }
        />
        <div className="grid gap-md md:grid-cols-2">
          {(moment ? [moment] : aIntervenir).map((m) => (
            <FicheMoment key={m.id} m={m} g={g} />
          ))}
        </div>
      </section>

      {g.aArbitrer.length ? (
        <section className="mb-xl">
          <Chapeau
            kicker="À arbitrer"
            titre={`${g.aArbitrer.length} raccordements que la fiche n’écrit pas`}
            lead="La projection n’en comble aucun. Chacun est une décision de doctrine — c’est ce qui empêche aujourd’hui le diagramme d’être un vrai si/sinon/ou."
          />
          <div className="grid gap-md md:grid-cols-2">
            {g.aArbitrer.map((a) => (
              <Card.Root key={a} mode="static" density="compact">
                <Card.Body>
                  <Card.Description>{a}</Card.Description>
                </Card.Body>
              </Card.Root>
            ))}
          </div>
        </section>
      ) : null}

      <Transversaux g={g} />
      <Frontieres g={g} />

      {g.nonLu.length ? (
        <Alert.Root tone="info">
          <Alert.Icon />
          <Alert.Content>
            <Alert.Title>Ce que l’extracteur n’a pas su lire dans la fiche</Alert.Title>
            <ul className="mb-0 mt-sm">
              {g.nonLu.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </Alert.Content>
        </Alert.Root>
      ) : null}
    </main>
  );
}

/* ── L'index des flows ────────────────────────────────────────────────────── */
export function ListeFlows({ graphes }: { graphes: Graphe[] }) {
  return (
    <main className="mx-auto max-w-container-wide px-lg py-xl">
      <header className="mb-xl max-w-[70ch]">
        <p className="m-0 font-label text-xs font-semibold uppercase tracking-wider text-text-muted">
          Flows
        </p>
        <h1 className="m-0 mt-1 text-h2 font-semibold text-text-primary">
          Les parcours, et où il faut intervenir
        </h1>
        <p className="mt-sm text-text-secondary">
          Chaque vue est une projection de sa fiche <code className="font-mono text-sm">-UX.md</code>
          , pas un dessin.
        </p>
      </header>

      <div className="grid gap-md md:grid-cols-2">
        {graphes.map((g) => {
          const aIntervenir = g.moments.filter((m) => m.verdict !== "couvert").length;
          return (
            <Card.Root key={g.flow} mode="clickable">
              <Card.Body>
                {/* `as="h2"` : Card.Title rend un h3 par défaut, et ces cartes suivent
                    directement le h1 de la page. Le composant le prévoit — « élément de
                    titre réel, h2…h4 SELON LA STRUCTURE DE LA PAGE qui accueille la
                    collection » — la page ne le lui disait pas. La taille ne bouge pas :
                    niveau ≠ taille (TYPOGRAPHY-UX). */}
                <Card.Title as="h2" className="text-sm">
                  <Card.TitleLink asChild>
                    {/* next/link via asChild : le basePath (/fili en CI) est résolu par le
                        routeur — un <a href> nu produisait un lien mort sur Pages (constat
                        verifie:rendu « lien-hors-basepath », 2026-08-02). */}
                    <NextLink href={`/flows/${g.flow}/`}>{g.flow}</NextLink>
                  </Card.TitleLink>
                </Card.Title>
                <Card.Description className="font-label text-xs uppercase tracking-wider text-text-muted">
                  v{g.version} · {g.moments.length ? `${g.moments.length} moments` : "pas de squelette"}
                </Card.Description>
                <Card.Description className="mt-sm">
                  {g.moments.length
                    ? `${aIntervenir} moment${aIntervenir > 1 ? "s" : ""} à traiter`
                    : "aucun moment lisible dans la fiche"}{" "}
                  · {g.resume.couvert}/{g.couverture.length} cas tranchés
                  {g.aArbitrer.length ? ` · ${g.aArbitrer.length} à arbitrer` : ""}
                </Card.Description>
              </Card.Body>
            </Card.Root>
          );
        })}
      </div>
    </main>
  );
}

/* Les cas non couverts, gardés accessibles pour un futur filtre par statut. */
export type { Cas };
