"use client";
import * as React from "react";
import type { InteractionMode } from "../../lib/interaction";

/**
 * Contexte de COLLECTION — la mécanique interne par laquelle le pattern CardGroup
 * transmet son mode, sa densité et son RÉGIME DE SÉLECTION aux `Card` qu'il héberge,
 * SANS dupliquer leur anatomie (rétablissement des frontières, 2026-07-30).
 *
 * Sens de l'autorité : la collection fournit des DÉFAUTS ; une Card qui déclare
 * explicitement son propre `mode` le conserve — c'est ainsi qu'une carte SANS CIBLE
 * (`mode="static"`) vit dans une collection interactive : elle garde sa place et sa
 * forme, perd toute affordance, et le highlight de proximité l'ignore.
 *
 * Pourquoi le RÉGIME de sélection vit ici et pas sur la carte (CARD-R26, tranche du
 * 2026-07-30) : « une seule à la fois » est une propriété COLLECTIVE — une carte seule
 * ne peut pas la faire respecter, et deux cartes qui la déclareraient chacune de leur
 * côté produiraient exactement le groupe mixte que la règle interdit. La collection
 * porte donc le régime et la valeur ; la CARTE garde ce qui lui appartient : le rendu
 * de son état, sa bascule et son clavier.
 *
 * Le fichier est une FEUILLE (aucun import de composant) : Card le consomme,
 * CardGroup le fournit — pas de cycle.
 */
export type CollectionDensity = "comfortable" | "compact";

/** Régime de sélection d'un groupe de cartes sélectionnables (CARD-R26). */
export type CardGroupSelection = "single" | "multiple";

export interface CollectionContextValue {
  mode: InteractionMode;
  density: CollectionDensity;
  /** null = aucun régime déclaré : chaque carte reste autonome (`selected`/`onSelectedChange`). */
  selection: CardGroupSelection | null;
  /** La carte porteuse de cette valeur est-elle retenue ? */
  estRetenue: (valeur: string) => boolean;
  /** Le groupe a-t-il DÉJÀ une option retenue ? Décide où entre la tabulation (APG). */
  aRetenue: boolean;
  /** Bascule demandée par une carte ; la collection applique le régime. */
  basculer: (valeur: string) => void;
  /**
   * Déplacement clavier dans un groupe `single` : la sélection SUIT le focus (APG Radio
   * Group). Implémenté par la collection parce qu'elle seule connaît l'ordre des items.
   */
  deplacer: (depuis: number, delta: number) => void;
}

/** null = hors collection : Card retombe sur ses propres défauts (static / comfortable). */
export const CollectionContext = React.createContext<CollectionContextValue | null>(null);

export function useCollectionContext(): CollectionContextValue | null {
  return React.useContext(CollectionContext);
}

/**
 * Rang de l'item — fourni par la CELLULE, qui appartient déjà à la collection. Il sert au
 * seul arrêt de tabulation d'un groupe `single` : la tabulation entre sur l'option retenue,
 * ou à défaut sur la première (APG Radio Group).
 */
export interface CollectionItemValue {
  index: number;
  total: number;
}
export const CollectionItemContext = React.createContext<CollectionItemValue | null>(null);
export function useCollectionItem(): CollectionItemValue | null {
  return React.useContext(CollectionItemContext);
}
