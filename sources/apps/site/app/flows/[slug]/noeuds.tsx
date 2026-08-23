"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Card } from "@fili/react";

/**
 * Les nœuds sont des `Card` du kit — pas une anatomie parallèle (FILI-COMPONENT-CONTRACT
 * § loi atomique). Cette page ne possède que la mise en page ; le rendu interne appartient
 * à Card. React Flow ne garde que le canevas, les arêtes et les poignées.
 *
 * La couleur ne décore pas : elle dit l'état de couverture du moment, et rien d'autre.
 * Toutes les valeurs viennent des tokens (`success`, `warning`, `info`, `danger`).
 */

/* ── Le vocabulaire du verdict : un seul endroit, réutilisé par la légende ── */
export const VERDICTS = {
  couvert: {
    libelle: "Rien à faire",
    aide: "tous les cas rattachés sont tranchés",
    bordure: "border-success",
    fond: "bg-success-subtle",
    texte: "text-success",
    trait: "var(--success)",
  },
  partiel: {
    libelle: "À compléter",
    aide: "des cas partagés avec un propriétaire hors design system",
    bordure: "border-warning",
    fond: "bg-warning-subtle",
    texte: "text-warning",
    trait: "var(--warning)",
  },
  "en attente d'un arbitrage": {
    libelle: "En attente d’un arbitrage",
    aide: "décision produit, juridique ou serveur — le DS ne tranche pas",
    bordure: "border-info",
    fond: "bg-info-subtle",
    texte: "text-info",
    trait: "var(--info)",
  },
  "à traiter": {
    libelle: "À traiter",
    aide: "des cas identifiés que rien ne couvre",
    bordure: "border-danger",
    fond: "bg-danger-subtle",
    texte: "text-danger",
    trait: "var(--danger)",
  },
  "sans rattachement": {
    libelle: "Non raccordé",
    aide: "aucun § de la fiche ne porte l’intitulé de ce moment",
    bordure: "border-border-strong border-dashed",
    fond: "bg-surface",
    texte: "text-text-muted",
    trait: "var(--border-strong)",
  },
} as const;

export type Verdict = keyof typeof VERDICTS;

/**
 * LARGEURS DES NŒUDS — source UNIQUE, et c'est structurel, pas cosmétique.
 *
 * elk calcule le placement à partir des dimensions qu'on lui DONNE (`diagramme.tsx`,
 * § dimensions) pendant que le navigateur rend à la largeur qu'on POSE ici. Que les deux
 * nombres divergent et elk place des cartes qui n'ont pas la taille annoncée : les arêtes
 * ratent leurs poignées, la mise en page devient fausse, et **rien ne le signale**. Ces
 * deux valeurs vivaient en deux exemplaires, un par fichier ; c'est cette duplication que
 * le vérificateur de tokens a rendue visible le 2026-08-01, en cherchant tout autre chose.
 *
 * Elles ne sont pas tokenisables, et ce n'est pas un contournement : ce ne sont pas des
 * valeurs d'échelle mais l'ENTRÉE d'un algorithme de placement, qui les veut en nombres.
 * Les poser en `style` plutôt qu'en classe `w-[…]` n'est donc pas une dette : c'est ce qui
 * permet qu'il n'existe qu'un seul nombre.
 */
export const L_MOMENT = 268;
export const L_BRANCHE = 248;

const poignees = (
  <>
    <Handle
      type="target"
      position={Position.Left}
      className="!h-2.5 !w-2.5 !border-2 !border-border-strong !bg-background"
    />
    <Handle
      type="source"
      position={Position.Right}
      className="!h-2.5 !w-2.5 !border-2 !border-border-strong !bg-background"
    />
  </>
);

/* ── Un moment du parcours : l'unité que le product builder va toucher ───── */
export type DonneesMoment = {
  index: number;
  titre: string;
  texte: string;
  conditionnel: boolean;
  verdict: Verdict;
  interventions: number;
  cas: number;
  actif: boolean;
};

export function NoeudMoment({ data }: NodeProps) {
  const d = data as unknown as DonneesMoment;
  const v = VERDICTS[d.verdict] ?? VERDICTS["sans rattachement"];
  return (
    <div style={{ width: L_MOMENT }}>
      {poignees}
      <Card.Root
        mode="static"
        className={`${v.bordure} border-2 ${d.actif ? "ring-2 ring-primary ring-offset-2" : ""}`}
      >
        <Card.Body>
          <div className={`flex items-baseline justify-between gap-sm ${v.texte}`}>
            <span className="font-label text-xs font-semibold uppercase tracking-wider">
              Moment {d.index}
              {d.conditionnel ? " · conditionnel" : ""}
            </span>
          </div>
          <Card.Title className="mt-1 text-base">{d.titre}</Card.Title>
          <div className={`mt-sm rounded-md ${v.fond} px-sm py-1 ${v.texte}`}>
            <span className="text-sm font-semibold">{v.libelle}</span>
            {d.interventions ? (
              <span className="text-sm">
                {" "}
                · {d.interventions} intervention{d.interventions > 1 ? "s" : ""}
              </span>
            ) : null}
          </div>
          <Card.Description className="mt-sm">
            {d.cas ? `${d.cas} cas d’usage rattachés` : v.aide}
          </Card.Description>
        </Card.Body>
      </Card.Root>
    </div>
  );
}

/* ── Un OU : plusieurs chemins de même poids ─────────────────────────────── */
export type DonneesOu = { titre: string; branches: string[] };

export function NoeudOu({ data }: NodeProps) {
  const d = data as unknown as DonneesOu;
  return (
    <div style={{ width: L_BRANCHE }}>
      {poignees}
      <Card.Root mode="static" density="compact" className="border-2 border-primary">
        <Card.Body>
          <span className="font-label text-xs font-semibold uppercase tracking-wider text-primary">
            Ou — {d.branches.length} chemins
          </span>
          <Card.Title className="mt-1 text-sm">{d.titre}</Card.Title>
          <ul className="mb-0 mt-sm list-none space-y-1 p-0">
            {d.branches.map((b) => (
              <li key={b} className="text-sm text-text-secondary">
                · {b}
              </li>
            ))}
          </ul>
        </Card.Body>
      </Card.Root>
    </div>
  );
}

/* ── Un SI : une sortie du chemin nominal ────────────────────────────────── */
export type DonneesSi = {
  question: string;
  alors: string;
  origineNommee: boolean;
};

export function NoeudSi({ data }: NodeProps) {
  const d = data as unknown as DonneesSi;
  return (
    <div style={{ width: L_BRANCHE }}>
      {poignees}
      <Card.Root
        mode="static"
        density="compact"
        className="border-2 border-dashed border-border-strong"
      >
        <Card.Body>
          <span className="font-label text-xs font-semibold uppercase tracking-wider text-text-muted">
            Si
          </span>
          <Card.Title className="mt-1 text-sm">{d.question}</Card.Title>
          <Card.Description className="mt-sm">alors → {d.alors}</Card.Description>
          {d.origineNommee ? null : (
            <Card.Description className="mt-sm text-warning">
              la fiche ne dit pas depuis quel moment cette sortie part
            </Card.Description>
          )}
        </Card.Body>
      </Card.Root>
    </div>
  );
}

/* ── Une extension de la fiche, détachée tant que son ancrage n'est pas écrit ─ */
export type DonneesExtension = { titre: string; slug: string; cas: number; interventions: number };

export function NoeudExtension({ data }: NodeProps) {
  const d = data as unknown as DonneesExtension;
  return (
    <div style={{ width: L_BRANCHE }}>
      {poignees}
      <Card.Root mode="static" density="compact" className="border-dashed">
        <Card.Body>
          <span className="font-label text-xs font-semibold uppercase tracking-wider text-text-muted">
            Extension détachée
          </span>
          <Card.Title className="mt-1 text-sm">{d.titre}</Card.Title>
          <Card.Description className="font-mono text-xs">{d.slug}</Card.Description>
          <Card.Description className="mt-sm">
            {d.cas} cas rattachés
            {d.interventions ? ` · ${d.interventions} à traiter` : ""}
          </Card.Description>
        </Card.Body>
      </Card.Root>
    </div>
  );
}

export const typesDeNoeud = {
  moment: NoeudMoment,
  ou: NoeudOu,
  si: NoeudSi,
  extension: NoeudExtension,
};
