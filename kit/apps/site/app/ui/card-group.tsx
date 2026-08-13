"use client";
import * as React from "react";
import { Button, Card, CardGroup, CompactButton } from "@fili/react";
import { CARD_IMGS } from "./card-imgs";

/* ══ Démos « Card » et « CardGroup » de l'atelier.
   Ce fichier ne porte QUE des données de démonstration et la composition de l'API
   PUBLIQUE de @fili/react — aucune API visuelle locale, et AUCUN composant intermédiaire
   entre `CardGroup` et ses cartes : la frontière du pattern Collection (enfants directs
   `Card.Root`, validée à l'exécution par le kit) reste lisible dans l'arbre React.
   Le contenu réutilisable des démos est une simple FONCTION (`contenuDemo`) qui rend
   l'INTÉRIEUR d'une carte — jamais une seconde carte. Les extraits générés
   (codeCard / codeCardGroup) sont l'API publique, copiable telle quelle. ══ */

export interface CardState {
  media: "icône" | "image" | "aucun" | string;
  /** Pastille au-dessus du titre, ou à sa gauche (composition — voir contenuDemo). */
  icone: "au-dessus" | "à gauche" | string;
  /** API réelle `adaptiveMedia` de Card.Root : true = le média passe sur le flanc dès que
      la carte reçoit ~24rem (état « regular ») ; false = toujours EMPILÉ (média au-dessus). */
  adaptive: boolean;
  description: boolean;
  buttons: boolean;
  density: "comfortable" | "compact" | string;
  mode: "static" | "clickable" | "selectable" | "expandable" | string;
  skeleton: boolean;
}

export interface CardGroupState {
  density: "comfortable" | "compact" | string;
  cols: "1" | "2" | "3" | string;
  separated: boolean;
  mode: "static" | "clickable" | "selectable" | string;
  /** Régime de sélection du GROUPE (CARD-R26). « aucun » = chaque carte reste autonome. */
  selection: "aucun" | "single" | "multiple" | string;
  skeleton: boolean;
}

/* icônes COLORÉES du menu DS-MD (dérogation actée 2026-07-23, cf. Card.Icon) */
const NAV_ICONS: Record<string, string> = {
  couleur: '<circle cx="8.5" cy="9.5" r="5.5" fill="#EE7A66"/><circle cx="15.5" cy="9.5" r="5.5" fill="#31A06E"/><circle cx="12" cy="15.5" r="5.5" fill="#4F46E5"/>',
  motion: '<circle cx="15.5" cy="12" r="6.2" fill="#4F46E5"/><path d="M14 9.4 l4.2 2.6 -4.2 2.6 Z" fill="#FFFFFF"/><rect x="2" y="7.6" width="7" height="2.2" rx="1.1" fill="#F2C744"/><rect x="4.5" y="11.9" width="4.5" height="2.2" rx="1.1" fill="#0891B2"/><rect x="2" y="16.2" width="7" height="2.2" rx="1.1" fill="#bcb9f5"/>',
  ombres: '<rect x="6" y="4" width="15" height="10" rx="2.5" fill="#F2C744"/><rect x="3" y="10" width="15" height="10" rx="2.5" fill="#4F46E5"/><rect x="6.5" y="14" width="8" height="2" rx="1" fill="#FFFFFF"/>',
  adaptive: '<rect x="2" y="5" width="8" height="14" rx="2.5" fill="#bcb9f5" stroke="#4F46E5" stroke-width="1.5"/><rect x="13" y="5" width="9" height="14" rx="2.5" fill="#bcb9f5" stroke="#0891B2" stroke-width="1.5"/><rect x="4" y="8" width="4" height="2" rx="1" fill="#4F46E5"/><rect x="15" y="8" width="5" height="2" rx="1" fill="#0891B2"/><rect x="15" y="12" width="5" height="4" rx="1.5" fill="#F2C744"/>',
};

const DEMOS = [
  { t: "Motion fluide", d: "Entrées posées, sorties au cran inférieur — sans tokens dédiés.", ic: "motion" },
  { t: "Relief comme signal", d: "L'élévation n'apparaît qu'au survol d'une carte cliquable.", ic: "ombres" },
  { t: "Adaptive par conteneur", d: "La carte choisit sa disposition selon SA largeur reçue.", ic: "adaptive" },
  { t: "Thème vivant", d: "Clair/sombre et crans de rayon pilotés par les tokens.", ic: "couleur" },
];

/** Valeurs des cartes de démonstration sous régime de sélection. */
const VALEURS = ["motion", "relief", "adaptive", "theme"];

const MORE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>';

const H = (html: string) => ({ __html: html });

/**
 * L'INTÉRIEUR d'une carte de démonstration — une fonction, pas un composant : elle rend
 * les sous-composants de Card (Media/Icon/Title/…) à placer DANS un `Card.Root` que
 * l'appelant compose lui-même. Ainsi l'enfant direct de CardGroup reste `Card.Root`
 * dans l'arbre React, et aucune deuxième carte n'existe.
 */
function contenuDemo(
  demo: (typeof DEMOS)[number],
  index: number,
  opts: {
    media: string;
    /** Pastille AU-DESSUS du titre (défaut) ou EN TÊTE DE RANGÉE, à sa gauche. */
    icone?: "au-dessus" | "à gauche" | string;
    description: boolean;
    buttons: boolean;
    mode: string;
    expanded?: boolean;
    onToggle?: () => void;
  },
): React.ReactNode {
  const clickable = opts.mode === "clickable";
  const expandable = opts.mode === "expandable";
  // Disposition de la pastille : pure COMPOSITION (un wrapper de layout, autorisé aux
  // pages) — Card n'a pas d'axe pour ça et n'en a pas besoin. `flex-col` = pastille
  // au-dessus ; `items-center` = pastille à gauche du titre, sur la même ligne.
  const iconeAGauche = opts.icone === "à gauche";
  const titre = expandable ? (
    <Card.TitleCommand aria-expanded={!!opts.expanded} onClick={opts.onToggle}>
      {demo.t}
    </Card.TitleCommand>
  ) : clickable ? (
    <Card.TitleLink href="#">{demo.t}</Card.TitleLink>
  ) : (
    demo.t
  );
  return (
    <>
      {opts.media === "image" ? (
        <Card.Media>
          <img src={CARD_IMGS[index % CARD_IMGS.length]} alt="" loading="lazy" />
        </Card.Media>
      ) : null}
      <Card.Body>
        <Card.Header>
          <div className={iconeAGauche ? "flex min-w-0 items-center gap-sm" : "flex min-w-0 flex-col"}>
            {opts.media === "icône" ? (
              <Card.Icon className={iconeAGauche ? undefined : "mb-sm"}>
                <svg viewBox="0 0 24 24" aria-hidden="true" dangerouslySetInnerHTML={H(NAV_ICONS[demo.ic])} />
              </Card.Icon>
            ) : null}
            <Card.Title as="h4">{titre}</Card.Title>
          </div>
          {expandable ? <Card.Chevron expanded={opts.expanded} /> : null}
        </Card.Header>
        {opts.description && (!expandable || opts.expanded) ? (
          <Card.Description>{demo.d}</Card.Description>
        ) : null}
        {/* Le PIED de la colonne de contenu : dans Card.Body, retrait et gouttière hérités
            (plus de px-md pb-md à la main), collé en bas quand la carte a de la hauteur libre. */}
        {opts.buttons && opts.mode !== "clickable" ? (
          <Card.Actions>
            <Button.Root variant="stroke" tone="neutral" size="sm">Commencer</Button.Root>
            <CompactButton variant="ghost" tone="neutral" size="md" fullRadius aria-label="Plus d'actions">
              <span dangerouslySetInnerHTML={H(MORE)} />
            </CompactButton>
          </Card.Actions>
        ) : null}
      </Card.Body>
    </>
  );
}

/** Entrée « Card » — LA carte seule : un `Card.Root` rendu directement, hors collection.
    La carte prend la largeur de l'aperçu (plafonnée) : la poignée de redimensionnement
    fait VRAIMENT basculer l'état adaptatif (empilé ↔ media sur le flanc, seuil ~24rem) ;
    `adaptiveMedia={false}` fige l'empilé (media au-dessus) quelle que soit la largeur. */
export function CardDemo({ s }: { s: CardState }) {
  const [selected, setSelected] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const mode = s.mode as "static" | "clickable" | "selectable" | "expandable";
  return (
    <div className="w-full max-w-md">
      <Card.Root
        mode={mode}
        density={s.density as "comfortable" | "compact"}
        adaptiveMedia={s.adaptive}
        loading={s.skeleton}
        selected={mode === "selectable" ? selected : undefined}
        onSelectedChange={mode === "selectable" ? setSelected : undefined}
      >
        {contenuDemo(DEMOS[0], 0, {
          media: s.media,
          icone: s.icone,
          description: s.description,
          buttons: s.buttons,
          mode,
          expanded,
          onToggle: () => setExpanded((v) => !v),
        })}
      </Card.Root>
    </div>
  );
}

/** Entrée « CardGroup » — le vrai pattern Collection : des `Card.Root` en enfants DIRECTS. */
export function CardGroupDemo({ s }: { s: CardGroupState }) {
  const [choisies, setChoisies] = React.useState<Record<number, boolean>>({});
  const [une, setUne] = React.useState<string | null>(VALEURS[1]);
  const [plusieurs, setPlusieurs] = React.useState<string[]>([VALEURS[0]]);
  const selectable = s.mode === "selectable";
  const regime = selectable && s.selection !== "aucun" ? s.selection : null;
  const contenu = (demo: (typeof DEMOS)[number], i: number) =>
    contenuDemo(demo, i, { media: "icône", description: true, buttons: false, mode: s.mode });
  const commun = {
    cols: Number(s.cols) as 1 | 2 | 3,
    separated: s.separated,
    density: s.density as "comfortable" | "compact",
    mode: s.mode as "static" | "clickable" | "selectable",
    loading: s.skeleton,
  };

  // Trois appels distincts plutôt qu'un seul aux props conditionnelles : l'union discriminée
  // de `selection` est exactement ce qui rend un groupe mixte intypable (CARD-R26), et
  // l'atelier n'a aucune raison de la contourner par un cast.
  if (regime === "single")
    return (
      <CardGroup {...commun} selection="single" value={une} onValueChange={setUne} label="Formule">
        {DEMOS.map((demo, i) => (
          <Card.Root key={i} value={VALEURS[i]} loading={s.skeleton}>
            {contenu(demo, i)}
          </Card.Root>
        ))}
      </CardGroup>
    );
  if (regime === "multiple")
    return (
      <CardGroup {...commun} selection="multiple" value={plusieurs} onValueChange={setPlusieurs} label="Sujets suivis">
        {DEMOS.map((demo, i) => (
          <Card.Root key={i} value={VALEURS[i]} loading={s.skeleton}>
            {contenu(demo, i)}
          </Card.Root>
        ))}
      </CardGroup>
    );
  return (
    <CardGroup {...commun} label="Cartes de démonstration">
      {DEMOS.map((demo, i) => (
        <Card.Root
          key={i}
          loading={s.skeleton}
          selected={selectable ? !!choisies[i] : undefined}
          onSelectedChange={selectable ? (v) => setChoisies((p) => ({ ...p, [i]: v })) : undefined}
        >
          {contenu(demo, i)}
        </Card.Root>
      ))}
    </CardGroup>
  );
}

/* ── code affiché : l'API PUBLIQUE réelle, copiable telle quelle ── */

function codeUneCard(s: CardState, indent = ""): string {
  const attrs = [
    s.mode !== "static" ? ` mode="${s.mode}"` : "",
    s.density !== "comfortable" ? ` density="${s.density}"` : "",
    s.media === "image" && !s.adaptive ? " adaptiveMedia={false}" : "",
    s.mode === "selectable" ? " selected={choisie} onSelectedChange={setChoisie}" : "",
    s.skeleton ? " loading" : "",
  ].join("");
  const titre =
    s.mode === "clickable"
      ? `<Card.TitleLink href="/motion">Motion fluide</Card.TitleLink>`
      : s.mode === "expandable"
        ? `<Card.TitleCommand aria-expanded={ouverte} onClick={bascule}>Motion fluide</Card.TitleCommand>`
        : "Motion fluide";
  const lignes = [
    `<Card.Root${attrs}>`,
    ...(s.media === "image" ? [`  <Card.Media><img src="/motion.webp" alt="" /></Card.Media>`] : []),
    `  <Card.Body>`,
    `    <Card.Header>`,
    // Pastille + titre vivent dans un wrapper de LAYOUT (autorisé aux pages) : Card.Header
    // répartit ses enfants (justify-between), c'est donc lui qui doit recevoir un seul bloc.
    // Colonne = pastille au-dessus ; rangée = pastille à gauche du titre.
    ...(s.media === "icône"
      ? [
          `      <div className="flex min-w-0 ${s.icone === "à gauche" ? "items-center gap-sm" : "flex-col"}">`,
          `        <Card.Icon${s.icone === "à gauche" ? "" : ' className="mb-sm"'}><MotionIcon /></Card.Icon>`,
          `        <Card.Title>${titre}</Card.Title>`,
          `      </div>`,
        ]
      : [`      <Card.Title>${titre}</Card.Title>`]),
    ...(s.mode === "expandable" ? [`      <Card.Chevron expanded={ouverte} />`] : []),
    `    </Card.Header>`,
    ...(s.description ? [`    <Card.Description>Entrées posées, sorties au cran inférieur.</Card.Description>`] : []),
    // La zone d'actions est le PIED de la colonne de contenu : elle vit DANS Card.Body.
    ...(s.buttons && s.mode !== "clickable"
      ? [`    <Card.Actions>`, `      <Button.Root variant="stroke" tone="neutral" size="sm">Commencer</Button.Root>`, `    </Card.Actions>`]
      : []),
    `  </Card.Body>`,
    `</Card.Root>`,
  ];
  return lignes.map((l) => indent + l).join("\n");
}

export function codeCard(s: CardState): string {
  return codeUneCard(s);
}

export function codeCardGroup(s: CardGroupState): string {
  const regime = s.mode === "selectable" && s.selection !== "aucun" ? s.selection : null;
  const attrs = [
    s.mode !== "static" ? ` mode="${s.mode}"` : "",
    regime === "single" ? ` selection="single" value={formule} onValueChange={setFormule}` : "",
    regime === "multiple" ? ` selection="multiple" value={suivis} onValueChange={setSuivis}` : "",
    ` cols={${s.cols}}`,
    s.separated ? " separated" : "",
    s.density !== "comfortable" ? ` density="${s.density}"` : "",
    s.skeleton ? " loading" : "",
  ].join("");
  const carte = codeUneCard(
    { media: "icône", icone: "au-dessus", adaptive: true, description: true, buttons: false, density: "comfortable", mode: "static", skeleton: false },
    "  ",
  )
    // dans une collection, le mode vient du GROUPE (contexte) — la carte ne le répète pas
    .replace(' mode="static"', "")
    // Sous régime, la carte porte sa VALEUR : c'est elle que le groupe retient (CARD-R26).
    .replace("<Card.Root", regime ? `<Card.Root value="motion"` : "<Card.Root");
  const etiquette = regime === "single" ? "Formule" : regime === "multiple" ? "Sujets suivis" : "Cartes de démonstration";
  return `<CardGroup${attrs} label="${etiquette}">\n${carte}\n  {/* … autres Card.Root (enfants DIRECTS — le pattern refuse tout autre enfant) … */}\n</CardGroup>`;
}
