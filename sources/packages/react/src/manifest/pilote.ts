/**
 * Manifeste — TRANCHE PILOTE (Button, CompactButton, Input, Card).
 * Les axes sont vérifiés à la compilation contre les unions réelles des composants
 * (inline `import type` : aucune dépendance runtime, le JSON se génère sans bundler).
 */
import { axe, propsDe, anatomie, type Entree } from "./schema";
import type { VariantProps } from "class-variance-authority";

type ButtonVariants = VariantProps<typeof import("../components/button/button").buttonVariants>;
type ButtonVariant = NonNullable<ButtonVariants["variant"]>;
type ButtonTone = NonNullable<ButtonVariants["tone"]>;
type ButtonSize = NonNullable<ButtonVariants["size"]>;

type CompactVariants = VariantProps<typeof import("../components/compact-button/compact-button").compactButtonVariants>;
type CompactSize = NonNullable<CompactVariants["size"]>;

type InputStatus = import("../components/input/input").InputStatus;
type InputVariants = VariantProps<typeof import("../components/input/input").inputRootVariants>;
type InputSize = NonNullable<InputVariants["size"]>;

type CardMode = import("../lib/interaction").InteractionMode;
type CardVariants = VariantProps<typeof import("../components/card/card").cardRootVariants>;
type CardDensity = NonNullable<CardVariants["density"]>;

type ButtonP = import("../components/button/button").ButtonProps;
type CompactButtonP = import("../components/compact-button/compact-button").CompactButtonProps;
type InputP = import("../components/input/input").InputRootProps &
  import("../components/input/input").InputFieldProps &
  import("../components/input/input").InputFieldBlockProps;
type CardP = import("../components/card/card").CardRootProps;
type ButtonC = typeof import("../components/button/button").Button;
type CompactButtonC = typeof import("../components/compact-button/compact-button").CompactButton;
type InputC = typeof import("../components/input/input").Input;
type CardC = typeof import("../components/card/card").Card;

const VARIANT_BOUTON = {
  filled: "fond plein + texte on-* — l'action qui doit se voir",
  stroke: "contour délimitant + texte tone — action secondaire affirmée",
  lighter: "lavis (fond doux) — action présente sans crier",
  ghost: "sans fond, remplissage léger au survol — action discrète",
} as const;

const TONE_CONTROLE = {
  primary: "l'action principale (marque)",
  neutral: "l'action ordinaire (haute-contraste, s'inverse en sombre)",
  destructive: "l'action irréversible — consomme la famille chromatique danger",
} as const;

export const button: Entree = {
  name: "Button",
  package: "@fili/react",
  import: 'import { Button } from "@fili/react";',
  status: "stable",
  category: "contrôle",
  purpose: "Déclencher une action. Jamais une navigation (→ Link) ni un avertissement (→ Alert).",
  doctrine: { ux: "components/BUTTON-UX.md", ui: "components/BUTTON-UI.md" },
  rules: "RULES-button.md",
  anatomy: anatomie<ButtonC>("Button", ["Root", "Icon"]),
  axes: {
    variant: axe<ButtonVariant>({
      kind: "variant",
      description: "La facture (le remplissage) — orthogonale au tone.",
      values: VARIANT_BOUTON,
      default: "filled",
    }),
    tone: axe<ButtonTone>({
      kind: "tone",
      description:
        "L'intention de l'action. PAS de warning : l'avertissement est un message (Alert), jamais une action (arbitrage 2026-07-29).",
      values: TONE_CONTROLE,
      default: "primary",
    }),
    size: axe<ButtonSize>({
      kind: "size",
      description: "La densité du contrôle.",
      values: { sm: "min-h 32px", md: "min-h 40px", lg: "min-h 48px" },
      default: "md",
    }),
  },
  props: propsDe<ButtonP>()({
    style: {
      type: "ButtonVariant",
      description: "Ancien nom de variant.",
      deprecated: "Utiliser `variant` (mêmes valeurs ; variant l'emporte). Retrait en prochaine majeure.",
    },
    iconOnly: { type: "boolean", default: "false", description: "Bouton carré (largeur = hauteur) — exige un aria-label." },
    asChild: { type: "boolean", default: "false", description: "Rend l'enfant à la place du <button> (Radix Slot)." },
    loading: { type: "boolean", default: "false", description: "Squelette de chargement aux mêmes dimensions (aria-busy, désactivé)." },
  }),
  tokens: [
    "--button-radius → --control-radius",
    "--control-focus-* (géométrie unique .ds-focus-ring ; couleur = cran subtil accordé au tone, défaut primary éclairci)",
    "--control-raised-shadow / --control-hover-shadow / --control-pressed-shadow (relief posé)",
    "familles primary / neutral·surface-inverse / danger selon le tone",
  ],
  states: ["default", "hover", "focus-visible", "active/pressed (relief s'enfonce)", "disabled", "loading"],
  accessibility: [
    "type=button par défaut (jamais submit implicite)",
    "focus ring v2 : cran subtil accordé au tone (primary/neutral/danger), géométrie BORDER unique",
    "disabled garde le curseur not-allowed (cause à exposer en usage)",
    "iconOnly exige aria-label",
  ],
  allowedComposition: ["Button.Icon + libellé", "asChild pour porter un <a> stylé bouton (navigation assumée)"],
  antiPatterns: [
    "Recréer un bouton avec <div onClick> ou <button> natif stylé à la main",
    "tone destructive pour une action banale (l'intention doit être réelle)",
    "variant filled × plusieurs boutons de même rang (une seule action principale par vue)",
  ],
  canonicalExamples: [
    {
      title: "Action principale + secondaire",
      code: `<div className="flex gap-sm">
  <Button variant="filled" tone="primary">Enregistrer</Button>
  <Button variant="stroke" tone="neutral">Annuler</Button>
</div>`,
    },
    {
      title: "Destructive avec icône",
      code: `<Button variant="lighter" tone="destructive" size="sm">
  <Button.Icon><svg viewBox="0 0 20 20" /></Button.Icon>
  Supprimer
</Button>`,
    },
  ],
};

export const compactButton: Entree = {
  name: "CompactButton",
  package: "@fili/react",
  import: 'import { CompactButton } from "@fili/react";',
  status: "stable",
  category: "contrôle",
  purpose: "Bouton icon-only pour les espaces contraints (fermer, développer, action en ligne).",
  doctrine: { ux: "components/BUTTON-UX.md", ui: "components/BUTTON-UI.md" },
  rules: "RULES-button.md",
  anatomy: anatomie<CompactButtonC>("CompactButton", ["Root", "Icon"]),
  axes: {
    variant: axe<ButtonVariant>({
      kind: "variant",
      description: "Même facture que Button.",
      values: VARIANT_BOUTON,
      default: "lighter",
    }),
    tone: axe<ButtonTone>({
      kind: "tone",
      description: "Même intention que Button — défaut neutral (usage utilitaire).",
      values: TONE_CONTROLE,
      default: "neutral",
    }),
    size: axe<CompactSize>({
      kind: "size",
      description: "Carré compact — étendre la cible tactile à 44px en usage.",
      values: { sm: "20px", md: "24px" },
      default: "md",
    }),
  },
  props: propsDe<CompactButtonP>()({
    style: { type: "ButtonVariant", description: "Ancien nom de variant.", deprecated: "Utiliser `variant`." },
    fullRadius: { type: "boolean", default: "false", description: "Cercle (true) vs arrondi --button-radius (false)." },
    "aria-label": { type: "string", required: true, description: "OBLIGATOIRE — icône seule, sans exception WCAG." },
    loading: { type: "boolean", default: "false", description: "Squelette de chargement." },
  }),
  tokens: ["--button-radius", "--control-focus-*", "mêmes familles de tone que Button"],
  states: ["default", "hover", "focus-visible", "disabled", "loading"],
  accessibility: ["aria-label requis par le type", "focus ring v2 accordé au tone"],
  antiPatterns: ["S'en servir pour une action principale libellée (→ Button)"],
  canonicalExamples: [
    {
      title: "Fermer",
      code: `<CompactButton aria-label="Fermer">
  <CompactButton.Icon><svg viewBox="0 0 20 20" /></CompactButton.Icon>
</CompactButton>`,
    },
  ],
};

export const input: Entree = {
  name: "Input",
  package: "@fili/react",
  import: 'import { Input } from "@fili/react";',
  status: "stable",
  category: "champ",
  purpose:
    "La zone réceptive du formulaire (relief creusé). Le BLOC CHAMP — Field > (Label · Root > Wrapper > (Icon · Input · InlineAffix) + Affix · Helper|Error) — porte le câblage exigé par la doctrine : for/id, aria-describedby, indicateur de requis. Root employé seul reste le cadre bordé, inchangé.",
  doctrine: { ux: "components/INPUT-UX.md", ui: "components/INPUT-UI.md", pattern: "patterns/FORM" },
  rules: "RULES-input.md",
  anatomy: anatomie<InputC>("Input", [
    "Field", "Label", "Helper", "Error",
    "Root", "Wrapper", "Icon", "Input", "InlineAffix", "Affix",
    "Password", "Search", "Number", "Textarea",
  ]),
  axes: {
    status: axe<InputStatus>({
      kind: "status",
      description:
        "Statut de validation — SUBI par les données, jamais décoratif. En error, aria-invalid est posé automatiquement. (Renommé depuis `tone`, 2026-07-29.)",
      values: {
        default: "bordure border-strong (délimitante 3:1)",
        error: "bordure danger",
        success: "bordure success",
        warning: "bordure warning",
      },
      default: "default",
    }),
    size: axe<InputSize>({
      kind: "size",
      description: "Hauteur du champ (32/40/48px). Le 3e axe est field_type = le type HTML natif.",
      values: { sm: "32px, rayon sm", md: "40px", lg: "48px" },
      default: "md",
    }),
  },
  props: propsDe<InputP>()({
    required: { type: "boolean", default: "false", description: "Input.Field : pose l'indicateur visible sur le libellé (INPUT-R30) + aria-required. La CONVENTION requis/optionnel appartient au formulaire entier (FORM-R10)." },
    verdict: { type: "ValidationVerdict", description: "Input.Field : le VERDICT de validation — statut visuel, aria-invalid, aria-busy et texte du message en descendent. Source de vérité ; `status` devient un mode de présentation." },
    confirmValid: { type: "boolean", default: "false", description: "Input.Field : projeter un verdict `valid` en statut success. Faux par défaut — confirmer un succès est un choix de produit (INPUT-R16/R20)." },
    controlId: { type: "string", description: "Input.Field : identifiant STABLE du contrôle, requis pour qu'un résumé d'erreurs puisse l'ancrer (FORM-R23)." },
    clearable: { type: "boolean", default: "false", description: "Croix d'effacement standard (Input.Input)." },
    loading: { type: "boolean", default: "false", description: "Squelette de chargement (Root)." },
    asChild: { type: "boolean", default: "false", description: "Slot Radix sur Root." },
  }),
  tokens: [
    "--input-radius → --control-radius (md/lg ; sm garde radius-sm)",
    "--input-border → --field-border ; --field-inset-shadow (relief creusé)",
    "--input-focus-color → --control-focus-color (anneau unique BORDER)",
    "bordures de statut : danger / success / warning",
  ],
  states: ["default", "focus-visible (ring accent + bordure d'état ensemble)", "error", "success", "warning", "disabled", "loading"],
  accessibility: [
    "aria-invalid automatique en error",
    "Input.Field : liaison for/id du libellé (INPUT-UI T1 — jamais la seule proximité visuelle) et aria-describedby vers le message, posé seulement s'il existe",
    "Input.Error remplace Input.Helper (INPUT-R26) et se signale par une icône + « Erreur » pour l'AT, jamais par la seule couleur (INPUT-R31)",
    "dans un Field, Wrapper et Textarea cessent d'être des <label> : un seul étiquetage, celui du libellé visible",
    "le ring s'ajoute à la bordure d'état (les deux restent lisibles — BORDER-R07)",
    "Password : aria-pressed sur le toggle œil ; Number : réservé aux quantités (OTP/code postal = text + inputmode)",
  ],
  validation: {
    role: "field",
    nativeConstraints: ["required", "type (email/url/number/tel)", "min", "max", "step", "minLength", "maxLength", "pattern"],
    externalConstraints: ["schéma applicatif", "règle métier", "verdict serveur (source: server)"],
    ariaInvalidTarget: "l'élément natif (input/textarea), jamais le cadre — posé quand le statut résolu vaut error",
    messageBinding: "aria-describedby → Input.Error / Input.Helper, posé SEULEMENT si un message est monté",
    focusTarget: "l'élément natif, par son id (Input.Field controlId)",
    summaryRole: "une entrée par champ, message issu de la même ValidationIssue",
    requiredBehavior: "Input.Field required = indicateur visible (INPUT-R30) + aria-required ; la contrainte native `required` reste passée au champ par l'appelant",
    pendingBehavior: "verdict `validating` → aria-busy sur le champ, statut visuel neutre",
    correctionBehavior: "Validation.refresh périme le verdict dès que la valeur change (FORM-R51) — le message disparaît sans intervention",
    examples: {
      valid: '<Input.Field verdict={Validation.valid("nom@domaine.fr")}>…</Input.Field>',
      invalid: '<Input.Field verdict={Validation.fromValidity("email", el.validity, el.value, MESSAGES)}>…</Input.Field>',
    },
  },
  adaptiveBehavior: "Largeur fluide (w-full) — la largeur vient du gabarit de formulaire (container-narrow).",
  allowedComposition: ["FORM : Input + Select + Button + Alert", "Affix pour unités/domaines ; Icon pour la nature du champ"],
  antiPatterns: [
    "<input> natif stylé à la main hors mécanique interne",
    "libellé écrit à la main à côté du champ (INPUT-R38 : label toujours visible ET lié — c'est le rôle d'Input.Field + Input.Label)",
    "placeholder tenant lieu de libellé (INPUT-R38)",
    "status utilisé comme décor (un champ n'est pas « orange » : il est en warning)",
    "Input.Number pour un code (OTP, postal) — c'est un text + inputmode",
  ],
  canonicalExamples: [
    {
      title: "Champ complet — le message DESCEND du verdict (la chaîne câblée)",
      imports: ['import { Validation } from "@fili/react/validation";'],
      code: `<Input.Field
  controlId="courriel"
  required
  verdict={Validation.invalid({
    code: "typeMismatch",
    field: "courriel",
    source: "native",
    severity: "error",
    message: "Saisissez une adresse au format nom@domaine.fr",
  })}
>
  <Input.Label>Adresse e-mail</Input.Label>
  <Input.Root>
    <Input.Wrapper>
      <Input.Input type="email" placeholder="vous@exemple.fr" autoComplete="email" required />
    </Input.Wrapper>
  </Input.Root>
  <Input.Helper>Nous ne la partagerons jamais.</Input.Helper>
  <Input.Error />
</Input.Field>`,
    },
    {
      title: "Fixture de PRÉSENTATION — un état isolé, sans verdict (documentation seulement)",
      code: `<Input.Field status="error" required>
  <Input.Label>Adresse e-mail</Input.Label>
  <Input.Root>
    <Input.Wrapper>
      <Input.Input type="email" placeholder="vous@exemple.fr" autoComplete="email" />
    </Input.Wrapper>
  </Input.Root>
  <Input.Helper>Nous ne la partagerons jamais.</Input.Helper>
  <Input.Error>Le format attendu est nom@domaine.fr</Input.Error>
</Input.Field>`,
    },
    {
      title: "Cadre seul, sans bloc champ (usage autonome inchangé)",
      code: `<Input.Root status="error">
  <Input.Wrapper>
    <Input.Input type="email" placeholder="vous@exemple.fr" aria-label="Adresse e-mail" />
  </Input.Wrapper>
</Input.Root>`,
    },
    {
      title: "Recherche effaçable",
      code: `<Input.Root>
  <Input.Wrapper>
    <Input.Search placeholder="Rechercher…" aria-label="Rechercher" />
  </Input.Wrapper>
</Input.Root>`,
    },
  ],
};

export const card: Entree = {
  name: "Card",
  package: "@fili/react",
  import: 'import { Card } from "@fili/react";',
  status: "stable",
  category: "surface",
  purpose:
    "La surface de contenu autonome, adaptée à SON conteneur (container query, jamais le viewport). Identité fixe (outlined, relief au survol si interactive) — pas de tone.",
  doctrine: { ux: "components/CARD-UX.md", ui: "components/CARD-UI.md", pattern: "patterns/COLLECTION" },
  rules: "RULES-card.md",
  dette:
    "Le manifeste décrit les props du ROOT ; celles des sous-composants compound ne sont pas encore dans le schéma. `Card.TitleLink` en est le cas visible : son `asChild` porte le routage sous basePath (2026-07-30) sans apparaître dans `props`. Trou de couverture RELEVÉ, pas comblé, à la Stabilisation 0.2 — en attendant, la capacité est tenue par un exemple canonique compilé et par un test de consommation. Étendre le schéma aux sous-composants est une tranche à part.",
  anatomy: anatomie<CardC>("Card", [
    "Root", "Media", "Icon", "Header", "Body", "Title",
    "TitleLink", "TitleCommand", "Description", "Actions", "Check", "Chevron", "Skeleton",
  ]),
  axes: {
    mode: axe<CardMode>({
      kind: "mode",
      description:
        "Nature de l'interaction — langage transversal INTERACTION (R26-R28) : réservé aux surfaces-conteneurs, jamais aux contrôles.",
      values: {
        static: "aucune interaction propre",
        clickable: "toute la surface navigue (lien étendu via Card.TitleLink)",
        selectable: "la surface se sélectionne (selected)",
        expandable: "la surface se déplie (Card.Chevron)",
      },
      default: "static",
    }),
    density: axe<CardDensity>({
      kind: "density",
      description: "Densité de la composition interne.",
      values: { comfortable: "espacements pleins", compact: "espacements resserrés" },
      default: "comfortable",
    }),
  },
  props: propsDe<CardP>()({
    selected: { type: "boolean", description: "État sélectionné (mode selectable)." },
    onSelectedChange: { type: "(selected: boolean) => void", description: "Mode selectable : bascule portée par la CARTE (clic hors cibles internes, Espace/Entrée) — la collection ne refait pas cette mécanique." },
    value: { type: "string", description: "Valeur de la carte dans un CardGroup à régime de sélection (CARD-R26) — exigée dans ce cas, inutile ailleurs." },
    adaptiveMedia: { type: "boolean", default: "true", description: "Media passe à côté du contenu dès ~24rem de largeur RÉELLE." },
    loading: { type: "boolean", default: "false", description: "Rend Card.Skeleton aux mêmes proportions." },
  }),
  tokens: [
    "--card-radius → --surface-radius (cran lg des surfaces conteneur)",
    ".ds-interactive / .ds-interactive-target (langage INTERACTION : relief hover, lien étendu)",
    "border / background / surface",
  ],
  states: ["static", "hover (relief si interactive)", "selected", "loading"],
  accessibility: [
    "lien étendu accessible : la cible reste le Card.TitleLink (un vrai <a>), pas un onClick de div",
    "titre = vrai heading (Card.Title as h2…h6)",
    "mode selectable autonome : role=button + aria-pressed ; sous le régime d'un CardGroup : role=radio ou checkbox + aria-checked (la branche « input réel » de CARD-R25 reste ouverte, cf. essai carded)",
  ],
  adaptiveBehavior:
    "Container query sur sa propre largeur (état compact empilé = CSS de base ; regular côte-à-côte ≥ 24rem).",
  allowedComposition: [
    "CardGroup pour toute COLLECTION de cartes : les Card sont les ENFANTS DIRECTS du pattern, qui leur transmet mode et densité par contexte (une Card `mode=\"static\"` explicite reste sans cible dans une collection interactive)",
  ],
  antiPatterns: [
    "Recréer une carte avec div + border + shadow à la main",
    "onClick sur la surface entière sans lien réel (le lien étendu passe par TitleLink)",
    "mode sur un contrôle (INTERACTION-R27 : surfaces-conteneurs seulement)",
  ],
  canonicalExamples: [
    {
      // La capacité qui manquait au 2026-07-30 : sous un basePath, seul le routeur écrit
      // l'adresse finale. Un lien natif écrit à la main pointerait hors du site.
      title: "Carte cliquable SOUS ROUTEUR — Card.TitleLink asChild",
      imports: ['import NextLink from "next/link";'],
      code: `<Card.Root mode="clickable">
  <Card.Body>
    <Card.Header>
      <Card.Title as="h3">
        <Card.TitleLink asChild>
          <NextLink href="/md/card/">Card</NextLink>
        </Card.TitleLink>
      </Card.Title>
    </Card.Header>
    <Card.Description>Le routeur préfixe le basePath du déploiement.</Card.Description>
  </Card.Body>
</Card.Root>`,
    },
    {
      title: "Carte cliquable",
      code: `<Card.Root mode="clickable">
  <Card.Body>
    <Card.Header>
      <Card.Title><Card.TitleLink href="/article">Titre de l'article</Card.TitleLink></Card.Title>
    </Card.Header>
    <Card.Description>Résumé en une ou deux phrases.</Card.Description>
  </Card.Body>
</Card.Root>`,
    },
  ],
};
