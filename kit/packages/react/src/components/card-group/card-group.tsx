"use client";
import * as React from "react";
import { cn } from "../../lib/cn";
import {
  CollectionContext,
  CollectionItemContext,
  type CardGroupSelection,
} from "./collection-context";
// Identité RÉELLE de la seule anatomie de carte admise comme enfant. Pas de cycle :
// card.tsx n'importe de ce dossier que collection-context.ts (une feuille).
import { CardRoot, type CardRootProps } from "../card/card";
import "./card-group.css";

/**
 * CardGroup — le pattern COLLECTION (`COLLECTION-UX.md`, `type: pattern`), pas un composant.
 * « La carte reste l'atome, la collection est la phrase. »
 *
 * FRONTIÈRES D'AUTORITÉ — la table de COLLECTION-UX.md, achevée le 2026-07-30 :
 *  · à la COLLECTION : le balisage de liste ET la cellule de grille (`role="list"` /
 *    `role="listitem"`, `.cg-cell`), le nombre de colonnes, les gouttières, le régime
 *    (joint / séparé), les filets internes, les coins hérités, le highlight de proximité,
 *    l'annonce de chargement (`aria-busy`), le contexte collectif de mode et de densité, et
 *    — depuis le 2026-07-30 — le RÉGIME DE SÉLECTION (`selection`, CARD-R26) avec la valeur
 *    retenue : « une seule à la fois » est une propriété collective, indécidable carte par carte ;
 *  · à la CARTE : tout ce qui se trouve visuellement à l'intérieur de la cellule — contenu,
 *    anatomie (`Card.Media/Icon/Header/Body/Title/TitleLink/TitleCommand/Description/Actions`),
 *    rendu, états (sélection, squelette), interactions (bascule selectable, clavier).
 *
 * La collection NE REND AUCUNE anatomie de carte : ses enfants SONT de vraies `Card`.
 * L'API `CardGroup.Card` — une seconde implémentation monolithique de la carte, aux axes
 * divergents — a été SUPPRIMÉE le 2026-07-30 : il n'existe qu'une seule carte, `Card`.
 * Cette frontière est EXÉCUTABLE (fin de chantier 2026-07-30) : un enfant direct qui
 * n'est pas un `Card.Root` (identité RÉELLE du composant, pas un displayName) fait
 * échouer le rendu avec une erreur explicite — en développement comme au build. Aucun
 * filtrage silencieux, aucun composant intermédiaire toléré, même s'il rend une Card.
 *
 * Usage canonique :
 *
 *   <CardGroup mode="clickable" label="Guides">
 *     <Card.Root>
 *       <Card.Body>
 *         <Card.Header>
 *           <Card.Title><Card.TitleLink href="/guides">Commencer</Card.TitleLink></Card.Title>
 *         </Card.Header>
 *         <Card.Description>Installer et brancher le kit.</Card.Description>
 *       </Card.Body>
 *     </Card.Root>
 *   </CardGroup>
 *
 * MÉCANIQUE mode/densité : le groupe fournit ses valeurs par CONTEXTE React
 * (collection-context.ts) ; les `Card` descendantes les prennent comme défauts. Une carte
 * SANS CIBLE dans une collection interactive déclare `mode="static"` : elle garde sa place
 * et sa forme, perd toute affordance, et le highlight de proximité l'ignore.
 *
 * Deux variables restent disparues, faute de titre à les détenir :
 *  · la densité `spacious` — COLLECTION-R01 : la densité « appartient déjà à CARD » (2 crans) ;
 *  · l'orientation `inline` — la disposition interne d'une carte est décidée par SA largeur
 *    (container query de card.css, principe Adaptive), jamais par la collection.
 */

export type CardGroupMode = "static" | "clickable" | "selectable";
export type CardGroupDensity = "comfortable" | "compact";
export type { CardGroupSelection };

interface CardGroupBaseProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /**
   * Colonnes du groupe. `"auto"` (défaut) = colonnes INTRINSÈQUES : elles émergent de la largeur
   * reçue et de `grid.item-min`, jamais d'un nombre par appareil (COLLECTION-UI). Un nombre fixe
   * reste possible quand la collection a une cardinalité connue (galerie de démonstration).
   */
  cols?: 1 | 2 | 3 | 4 | "auto";
  /** Cartes détachées (gouttière + contour par carte) au lieu de jointes (filets internes). */
  separated?: boolean;
  /** Contour du groupe (ou de chaque carte si `separated`). Défaut : true. */
  outlined?: boolean;
  /** Densité des items — deux crans, ceux de CARD. Relayée aux cartes par le contexte. */
  density?: CardGroupDensity;
  /** Mode d'interaction — UN SEUL pour toute la collection (CARD-UX), relayé par le contexte. */
  mode?: CardGroupMode;
  /** Carte isolée : pas de grille, pas de highlight de proximité. */
  solo?: boolean;
  /** Highlight de proximité. Défaut : actif dès que le groupe est interactif et non-solo. */
  proximity?: boolean;
  /** Étiquette de la liste, annoncée au lecteur d'écran. */
  label?: string;
  /**
   * Collection en cours de chargement : `aria-busy` vit ICI et pas sur les squelettes, qui sont
   * `aria-hidden` (CARD-UI.md : « un lecteur d'écran n'a pas à parcourir des blocs vides »).
   */
  loading?: boolean;
  /**
   * Les items de la collection : des `Card.Root` en ENFANTS DIRECTS, jamais une autre
   * anatomie ni un composant intermédiaire (même s'il finit par rendre une Card — la
   * frontière doit être LISIBLE dans l'arbre). Le type contraint ce que TypeScript sait
   * contraindre ; la validation runtime (identité réelle de `Card.Root`) fait autorité
   * et ÉCHOUE explicitement en développement comme au build.
   */
  children?: CardGroupChild;
}

/**
 * RÉGIME DE SÉLECTION (CARD-R26) — porté par le GROUPE, jamais par la carte : « toutes
 * partagent le même mode, simple ou multiple ». Écrit en union discriminée, la règle
 * devient une contrainte de compilation : `single` n'accepte qu'une valeur, `multiple`
 * qu'un tableau, et sans `selection` déclaré aucune des deux n'est acceptée — un groupe
 * mixte ne se tape pas.
 *
 * Sans `selection`, rien ne change : chaque carte reste autonome (`selected` /
 * `onSelectedChange`), comme avant cette tranche.
 */
type CardGroupSansSelection = {
  selection?: undefined;
  value?: never;
  onValueChange?: never;
};
type CardGroupSelectionSimple = {
  selection: "single";
  /** La valeur retenue — `null` quand rien n'est choisi (une pré-sélection est une décision). */
  value?: string | null;
  onValueChange?: (valeur: string | null) => void;
};
type CardGroupSelectionMultiple = {
  selection: "multiple";
  value?: string[];
  onValueChange?: (valeurs: string[]) => void;
};

export type CardGroupProps = CardGroupBaseProps &
  (CardGroupSansSelection | CardGroupSelectionSimple | CardGroupSelectionMultiple);

/** Un enfant admissible : un élément `Card.Root` (identité réelle), ou une liste/condition de tels éléments. */
export type CardGroupChild =
  | React.ReactElement<CardRootProps, typeof CardRoot>
  | Iterable<CardGroupChild>
  | boolean
  | null
  | undefined;

export function CardGroupRoot({
  cols = "auto",
  separated = false,
  outlined = true,
  density = "comfortable",
  mode = "static",
  solo = false,
  proximity,
  label,
  loading = false,
  selection,
  value,
  onValueChange,
  className,
  children,
  ...props
}: CardGroupProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const interactif = mode === "clickable" || mode === "selectable";
  const prox = (proximity ?? interactif) && !solo;
  const fluide = cols === "auto" && !solo;
  const effCols = solo ? 1 : cols === "auto" ? undefined : cols;

  /**
   * ── Frontière EXÉCUTABLE : seuls des Card.Root directs entrent dans la collection ──
   * Rien n'est filtré ni accepté en silence : un enfant étranger (div, Button, Fragment,
   * texte, ou composant intermédiaire qui rendrait une Card) échoue immédiatement — en
   * développement comme au build (prerender). L'identité est celle du composant réel,
   * jamais un simple displayName.
   *
   * DÉRIVATION PURE. Les trois listes de ce composant (les items, leurs clés, leurs valeurs)
   * viennent des enfants et de rien d'autre, par `useMemo` et rien d'autre. Deux tentatives
   * ont été écartées : une dépendance SÉRIALISÉE (`join("|")` n'est pas injectif — `["a|b"]`
   * et `["a", "b"]` donnent la même chaîne, le contexte restait figé sur une sélection
   * périmée), puis une identité tenue dans une ref COMPARÉE PENDANT LE RENDU — qui faisait
   * passer les tests mais écrivait hors du flux de rendu : invisible au rendu concurrent, et
   * survivant à un rendu abandonné. Le prix de la justesse est ici une recomposition plus
   * fréquente quand le parent recrée ses enfants à chaque rendu ; il est assumé.
   */
  const items = React.useMemo(() => {
    const directs: React.ReactElement<CardRootProps>[] = [];
    for (const enfant of React.Children.toArray(children)) {
      if (React.isValidElement(enfant) && enfant.type === CardRoot) {
        directs.push(enfant as React.ReactElement<CardRootProps>);
        continue;
      }
      const recu = !React.isValidElement(enfant)
        ? `« ${String(enfant).slice(0, 40)} » (texte)`
        : typeof enfant.type === "string"
          ? `<${enfant.type}>`
          : enfant.type === React.Fragment
            ? "un Fragment"
            : `<${(enfant.type as { displayName?: string; name?: string }).displayName ?? (enfant.type as { name?: string }).name ?? "composant anonyme"}>`;
      throw new Error(
        `CardGroup n'accepte que des <Card.Root> en enfants DIRECTS — reçu : ${recu}. ` +
          "Le pattern Collection assemble de vraies Card (une seule anatomie) et la frontière doit rester " +
          "lisible dans l'arbre : pas d'enveloppe, pas de composant intermédiaire même s'il rend une Card. " +
          "Composer <Card.Root>…</Card.Root> directement ; si le besoin n'est pas couvert, suivre MISSING-COMPONENT-PROTOCOL.md.",
      );
    }
    return directs;
  }, [children]);

  // Les clés pilotent les effets de disposition : elles changent avec la LISTE, pas à chaque
  // rendu de la page — c'est `items` qui porte cette frontière.
  const cles = React.useMemo(() => items.map((c) => c.key), [items]);
  const valeurs = React.useMemo(() => items.map((c) => c.props.value), [items]);

  // ── Régime de sélection : trois conditions, trois erreurs explicites ─────────
  // Même politique que la frontière ci-dessus — on échoue plutôt que d'accepter à moitié.
  // Un régime silencieusement ignoré produirait exactement la règle écrite et non tenue
  // que cette tranche vient supprimer (CARD-R26).
  if (selection) {
    if (mode !== "selectable")
      throw new Error(
        `CardGroup : selection="${selection}" n'a de sens qu'avec mode="selectable" — reçu mode="${mode}". ` +
          "Le régime dit COMMENT on choisit ; c'est le mode qui rend les cartes choisissables.",
      );
    if (!label)
      throw new Error(
        "CardGroup : un groupe de cartes à choisir doit porter la QUESTION comme nom accessible (`label`). " +
          "La proximité visuelle d'un titre au-dessus ne rattache rien (CHOICE-R06, transposé à la collection).",
      );
    const sansValeur = valeurs.findIndex((v) => v === undefined);
    if (sansValeur !== -1)
      throw new Error(
        `CardGroup : la carte n° ${sansValeur + 1} n'a pas de \`value\`, alors que le groupe déclare ` +
          `selection="${selection}". Sans valeur, la collection ne peut ni dire laquelle est retenue ni ` +
          "faire respecter le régime — c'est la carte, et non le groupe, qui redeviendrait autonome.",
      );
  }

  // La sélection retenue ne dépend que du régime et de la valeur REÇUE — deux entrées
  // immuables, pilotées par le parent. Aucune sérialisation, aucune comparaison de contenu.
  const retenues = React.useMemo<string[]>(
    () =>
      selection
        ? selection === "single"
          ? value == null
            ? []
            : [value as string]
          : ((value as string[] | undefined) ?? [])
        : [],
    [selection, value],
  );

  const contexte = React.useMemo(
    () => ({
      mode,
      density,
      selection: selection ?? null,
      estRetenue: (v: string) => retenues.includes(v),
      aRetenue: retenues.length > 0,
      basculer: (v: string) => {
        if (!onValueChange) return;
        if (selection === "single") {
          // Un choix exclusif se DÉFAIT en en prenant un autre, pas en se dé-cochant :
          // même comportement qu'un groupe de radios (APG), qui ne se vide pas au clic.
          (onValueChange as (valeur: string | null) => void)(v);
          return;
        }
        const sansLui = retenues.filter((x) => x !== v);
        (onValueChange as (valeurs: string[]) => void)(
          retenues.includes(v) ? sansLui : [...sansLui, v],
        );
      },
      deplacer: (depuis: number, delta: number) => {
        const n = valeurs.length;
        if (!n || selection !== "single") return;
        const vers = (depuis + delta + n) % n;
        const cible = valeurs[vers];
        if (cible === undefined) return;
        // La sélection SUIT le focus (APG Radio Group) : on déplace ET on retient.
        (onValueChange as ((valeur: string | null) => void) | undefined)?.(cible);
        ref.current?.querySelectorAll<HTMLElement>(".cg-cell > .ds-card")[vers]?.focus();
      },
    }),
    // Dépendances = les listes DÉRIVÉES elles-mêmes, chacune produite par son propre `useMemo`
    // — jamais une sérialisation. Les autres sont primitives (`mode`, `density`, `selection`)
    // ou fournies par le parent (`onValueChange`) ; `ref` est stable par construction.
    [mode, density, selection, retenues, valeurs, onValueChange],
  );

  // Filets et coins : dépendent du nombre de colonnes RÉEL (container queries) → mesure au runtime.
  React.useLayoutEffect(() => {
    const grp = ref.current;
    if (!grp) return;
    const cells = Array.from(grp.querySelectorAll<HTMLElement>(".cg-cell"));
    if (!cells.length) return;
    const colonnes = () => getComputedStyle(grp).gridTemplateColumns.split(" ").length;
    const trim = () => {
      const n = colonnes();
      const len = cells.length;
      const debutDerniereLigne = (Math.ceil(len / n) - 1) * n;
      cells.forEach((c, i) => {
        c.classList.toggle("no-r", (i + 1) % n === 0);
        c.classList.toggle("no-b", i >= debutDerniereLigne);
        c.classList.toggle("c-tl", i === 0);
        c.classList.toggle("c-tr", i === Math.min(n, len) - 1);
        c.classList.toggle("c-bl", i === debutDerniereLigne);
        c.classList.toggle("c-br", i === len - 1 && (len % n === 0 || n === 1));
      });
    };
    trim();
    if (typeof ResizeObserver === "undefined") return; // jsdom / navigateurs anciens
    const ro = new ResizeObserver(trim);
    ro.observe(grp);
    return () => ro.disconnect();
  }, [cles, effCols, separated, density]);

  // Highlight de proximité : la cellule la plus proche du pointeur reçoit la surface.
  React.useLayoutEffect(() => {
    const grp = ref.current;
    if (!grp || !prox) return;
    const hl = grp.querySelector<HTMLElement>(".cg-hl");
    // Les cartes déclarées sans cible (`mode="static"` explicite sur la Card) n'attirent pas
    // le highlight : le survol ne promet que ce qui existe.
    const cells = Array.from(grp.querySelectorAll<HTMLElement>(".cg-cell:not(.cg-cell--inactive)"));
    if (!hl || !cells.length) return;
    let visible = false;
    const colonnes = () => getComputedStyle(grp).gridTemplateColumns.split(" ").length;
    const nettoie = () => cells.forEach((c) => c.classList.remove("hl-off-b", "hl-off-r"));
    const place = (it: HTMLElement, i: number) => {
      hl.classList.toggle("teleport", !visible);
      hl.style.transform = `translate(${it.offsetLeft}px,${it.offsetTop}px)`;
      hl.style.width = `${it.offsetWidth}px`;
      hl.style.height = `${it.offsetHeight}px`;
      if (!visible) {
        void hl.offsetWidth;
        hl.classList.add("on");
        visible = true;
      }
      const n = colonnes();
      nettoie();
      it.classList.add("hl-off-b", "hl-off-r");
      if (i % n > 0) cells[i - 1]?.classList.add("hl-off-r");
      if (i - n >= 0) cells[i - n]?.classList.add("hl-off-b");
    };
    const plusProche = (e: MouseEvent): [HTMLElement, number] | null => {
      let best: [HTMLElement, number] | null = null;
      let dist = Infinity;
      cells.forEach((it, i) => {
        const r = it.getBoundingClientRect();
        if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
          best = [it, i];
          dist = -1;
          return;
        }
        if (dist === -1) return;
        const d = Math.hypot(e.clientX - (r.left + r.right) / 2, e.clientY - (r.top + r.bottom) / 2);
        if (d < dist) {
          dist = d;
          best = [it, i];
        }
      });
      return best;
    };
    const onMove = (e: MouseEvent) => {
      const t = plusProche(e);
      if (t) place(t[0], t[1]);
    };
    const onLeave = () => {
      hl.classList.remove("on");
      visible = false;
      nettoie();
    };
    grp.addEventListener("mousemove", onMove);
    grp.addEventListener("mouseleave", onLeave);
    return () => {
      grp.removeEventListener("mousemove", onMove);
      grp.removeEventListener("mouseleave", onLeave);
    };
  }, [cles, prox, effCols, separated]);

  return (
    <CollectionContext.Provider value={contexte}>
      <div
        ref={ref}
        // Un groupe à choisir n'est plus une liste : c'est une QUESTION. `radiogroup` pour
        // le choix exclusif, `group` pour le cumulable — et les cellules cessent d'être des
        // `listitem`, qui n'ont rien à faire entre un radiogroup et ses radios.
        role={selection === "single" ? "radiogroup" : selection === "multiple" ? "group" : "list"}
        aria-label={label}
        aria-busy={loading || undefined}
        style={effCols ? ({ ["--grp-cols" as string]: effCols } as React.CSSProperties) : undefined}
        className={cn(
          "cardgrp",
          // Grille intrinsèque : minmax(min(100%, grid.item-min), 1fr) — la valeur vient du token,
          // la règle vit dans card-group.css (cf. le commentaire de `.cardgrp.fluide`).
          fluide && "fluide",
          separated || solo ? "sep" : "joined",
          outlined && "outlined",
          solo && "solo",
          density,
          className,
        )}
        {...props}
      >
        {prox ? <div className="cg-hl" aria-hidden="true" /> : null}
        {items.map((item, i) => {
          // La CELLULE appartient à la collection ; tout ce qui est dedans appartient à Card.
          // Une Card qui surclasse le mode du groupe en `static` est une carte SANS CIBLE :
          // la cellule se marque inactive et le highlight l'ignore. La lecture de `mode` est
          // sûre : l'identité Card.Root de l'enfant vient d'être vérifiée.
          const inactive = interactif && item.props.mode === "static";
          return (
            <div
              key={item.key ?? i}
              role={selection ? undefined : "listitem"}
              className={cn("cg-cell", inactive && "cg-cell--inactive")}
            >
              <span className="cg-hb" aria-hidden="true" />
              <span className="cg-hr" aria-hidden="true" />
              {/* Le rang vient de la CELLULE — elle appartient déjà à la collection ; la carte
                  n'a pas à savoir compter ses sœurs, seulement où elle se trouve. */}
              <CollectionItemContext.Provider value={{ index: i, total: items.length }}>
                {item}
              </CollectionItemContext.Provider>
            </div>
          );
        })}
      </div>
    </CollectionContext.Provider>
  );
}
CardGroupRoot.displayName = "CardGroup.Root";

export const CardGroup = Object.assign(CardGroupRoot, {
  Root: CardGroupRoot,
});
