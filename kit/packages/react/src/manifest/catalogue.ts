/**
 * Manifeste — CATALOGUE (composants hors tranche pilote), version CONTRACTUELLE.
 * Chaque entrée est GARANTIE par TypeScript :
 *   - axes : `axe<U>()` sur l'union réellement acceptée (valeur inventée/manquante = tsc rouge) ;
 *   - props : `propsDe<P>()` sur l'API publique réelle (prop inventée = tsc rouge) ;
 *   - anatomie : `anatomie<T>()` sur les clés réelles de l'objet compound.
 * Les unions viennent des types exportés ou de React.ComponentProps — aucune chaîne libre
 * ne décrit une API. Les exemples canoniques compilent (tools/verifie-exemples.mjs).
 */
import { axe, propsDe, anatomie, type Entree, type SousApi } from "./schema";
import type { VariantProps } from "class-variance-authority";
import type * as React from "react";

type AlertTone = NonNullable<VariantProps<typeof import("../components/alert/alert").alertRootVariants>["tone"]>;
type ToastTone = import("../components/toast/toast").ToastTone;
type ToastClosing = NonNullable<import("../components/toast/toast").ToastOptions["closing"]>;
type DrawerSide = import("../components/drawer/drawer").DrawerSide;
type DrawerSize = import("../components/drawer/drawer").DrawerSize;
type DrawerEffect = import("../components/drawer/drawer").DrawerEffect;
type ModalPlacement = import("../components/modal/modal").ModalPlacement;
type ModalEnterFrom = import("../components/modal/modal").ModalEnterFrom;
type ModalSize = NonNullable<import("../components/modal/modal").ModalProps["size"]>;
type AccordionType = NonNullable<import("../components/accordion/accordion").AccordionProps["type"]>;
type ContainerSize = NonNullable<VariantProps<typeof import("../components/container/container").containerVariants>["size"]>;
type DividerOrientation = NonNullable<import("../components/divider/divider").DividerProps["orientation"]>;
type SelectVariant = NonNullable<import("../components/select/select").SelectProps["variant"]>;
type SelectSize = NonNullable<import("../components/select/select").SelectProps["size"]>;
type TabsVariant = NonNullable<import("../components/tabs/tabs").TabsProps["variant"]>;
type TabsActivation = NonNullable<import("../components/tabs/tabs").TabsProps["activation"]>;
type LinkContext = NonNullable<import("../components/link/link").LinkProps["context"]>;
type SkeletonVariant = NonNullable<import("../components/skeleton/skeleton").SkeletonProps["variant"]>;
type SwitchSize = NonNullable<import("../components/switch/switch").SwitchProps["size"]>;
type ThemeToggleSize = NonNullable<import("../components/theme-toggle/theme-toggle").ThemeToggleProps["size"]>;
type ShellVariant = import("../components/app-layout/app-layout").ShellVariant;
type CardGroupMode = import("../components/card-group/card-group").CardGroupMode;
type CardGroupDensity = import("../components/card-group/card-group").CardGroupDensity;
type CardGroupSelection = import("../components/card-group/card-group").CardGroupSelection;
type CardGroupC = typeof import("../components/card-group/card-group").CardGroup;
type ChoiceSize = import("../lib/choice").ChoiceSize;
type ChoiceStatus = import("../lib/choice").ChoiceStatus;
type CheckboxC = SousApi<typeof import("../components/checkbox/checkbox").Checkbox>;
type CheckboxP = import("../components/checkbox/checkbox").CheckboxProps &
  import("../components/checkbox/checkbox").CheckboxGroupProps;
type RadioC = SousApi<typeof import("../components/radio/radio").Radio>;
type RadioP = import("../components/radio/radio").RadioProps &
  import("../components/radio/radio").RadioGroupProps;
type DeleteButtonSize = NonNullable<import("../components/delete-button/delete-button").DeleteButtonProps["size"]>;
type ChipVariant = NonNullable<VariantProps<typeof import("../components/chip/chip").chipVariants>["variant"]>;
type ChipP = import("../components/chip/chip").ChipProps;
type SubmitButtonSize = NonNullable<import("../components/submit-button/submit-button").SubmitButtonProps["size"]>;
type DropdownContentProps = React.ComponentProps<(typeof import("../components/dropdown/dropdown").Dropdown)["Content"]>;
type DropdownSide = NonNullable<DropdownContentProps["side"]>;
type DropdownAlign = NonNullable<DropdownContentProps["align"]>;

type AccordionP = import("../components/accordion/accordion").AccordionProps &
  import("../components/accordion/accordion").AccordionHeaderProps;
type AlertP = import("../components/alert/alert").AlertRootProps;
type AppLayoutP = import("../components/app-layout/app-layout").AppLayoutProps;
type CardGroupP = import("../components/card-group/card-group").CardGroupProps;
type ContainerP = import("../components/container/container").ContainerProps;
type DeleteButtonP = import("../components/delete-button/delete-button").DeleteButtonProps;
type DividerP = import("../components/divider/divider").DividerProps;
type DrawerP = import("../components/drawer/drawer").DrawerProps;
type LinkP = import("../components/link/link").LinkProps;
type ModalP = import("../components/modal/modal").ModalProps & { level?: unknown };
type NavLinkP = import("../components/nav/nav").NavLinkProps;
type SelectP = import("../components/select/select").SelectProps;
type SkeletonP = import("../components/skeleton/skeleton").SkeletonProps;
type SkipLinkP = import("../components/skip-link/skip-link").SkipLinkProps;
type SubmitButtonP = import("../components/submit-button/submit-button").SubmitButtonProps;
type SwitchP = import("../components/switch/switch").SwitchProps;
type TabsP = import("../components/tabs/tabs").TabsProps & { keepMounted?: unknown; label?: unknown };
type ThemeToggleP = import("../components/theme-toggle/theme-toggle").ThemeToggleProps;
type ToastP = import("../components/toast/toast").ToastOptions &
  import("../components/toast/toast").ToastProviderProps;
type TocP = import("../components/toc/toc").TableOfContentsProps;

type AccordionC = typeof import("../components/accordion/accordion").Accordion;
type DrawerC = typeof import("../components/drawer/drawer").Drawer;
type LinkC = typeof import("../components/link/link").Link;
type AlertC = typeof import("../components/alert/alert").Alert;
type BrandC = typeof import("../components/brand/brand").Brand;
type DropdownC = typeof import("../components/dropdown/dropdown").Dropdown;
type ModalC = typeof import("../components/modal/modal").Modal;
type NavC = typeof import("../components/nav/nav").Nav;
type TabsC = typeof import("../components/tabs/tabs").Tabs;
type ToastC = typeof import("../components/toast/toast").Toast;

export const catalogue: Entree[] = [
  {
    name: "Accordion",
    package: "@fili/react",
    import: 'import { Accordion } from "@fili/react";',
    status: "stable",
    category: "contenu",
    purpose: "Sections dépliables (multi-ouvert par défaut) — headings réels + aria-expanded.",
    doctrine: { ux: "components/ACCORDION-UX.md", ui: "components/ACCORDION-UI.md" },
    rules: "RULES-accordion.md",
    anatomy: anatomie<AccordionC>("Accordion", ["Root", "Item", "Header", "Panel"]),
    axes: {
      type: axe<AccordionType>({
        kind: "enum",
        description: "Politique d'ouverture des panneaux.",
        values: { single: "un seul panneau ouvert à la fois", multiple: "multi-ouvert (défaut de la doctrine)" },
        default: "multiple",
      }),
    },
    props: propsDe<AccordionP>()({
      defaultOpen: { type: "string[]", default: "[]", description: "Panneaux ouverts au montage." },
      level: { type: "2 | 3 | 4 | 5 | 6", default: "3", description: "Niveau de heading RÉEL du Header (hiérarchie du document)." },
    }),
    accessibility: ["Headers = vrais headings (level)", "aria-expanded/aria-controls posés", "chevron pivote sans changer de glyphe"],
    antiPatterns: ["Recréer un dépliable avec details/summary stylé à la main", "level décoratif (il suit la hiérarchie réelle de la page)"],
    canonicalExamples: [
      {
        title: "Deux sections, multi-ouvert",
        code: `<Accordion type="multiple" defaultOpen={["a"]}>
  <Accordion.Item value="a">
    <Accordion.Header level={3}>Livraison</Accordion.Header>
    <Accordion.Panel>Sous 48 h ouvrées.</Accordion.Panel>
  </Accordion.Item>
  <Accordion.Item value="b">
    <Accordion.Header level={3}>Retours</Accordion.Header>
    <Accordion.Panel>30 jours, sans justification.</Accordion.Panel>
  </Accordion.Item>
</Accordion>`,
      },
    ],
  },
  {
    name: "Alert",
    package: "@fili/react",
    import: 'import { Alert } from "@fili/react";',
    status: "stable",
    category: "message",
    purpose: "Message contextuel persistant dans le flux. L'icône est la silhouette normative du tone — jamais retirée.",
    doctrine: { ux: "components/ALERT-UX.md", ui: "components/ALERT-UI.md" },
    rules: "RULES-alert.md",
    anatomy: anatomie<AlertC>("Alert", ["Root", "Icon", "Content", "Title", "Description", "Actions", "Close"]),
    axes: {
      tone: axe<AlertTone>({
        kind: "tone",
        description: "Sémantique du message (registre messages du dictionnaire des tones). L'anneau de focus des contrôles internes suit le tone (focus v2).",
        values: { info: "information", success: "confirmation", warning: "avertissement", danger: "erreur / danger" },
        default: "info",
      }),
    },
    props: propsDe<AlertP>()({
      live: { type: "boolean", default: "false", description: "true → role=alert (danger/warning) ou role=status (info/success)." },
    }),
    tokens: ["familles info/success/warning/danger (-subtle en fond)", "relief posé sous [data-relief] (liseré + control-raised-shadow)"],
    accessibility: ["role=alert/status via live", "l'icône normative reste (le tone ne se lit jamais qu'à la couleur)"],
    antiPatterns: ["S'en servir comme bouton warning (l'avertissement est un message, pas une action)", "Toast pour une condition qui dure (l'Alert vit dans le flux)"],
    canonicalExamples: [
      {
        title: "Erreur bloquante de formulaire",
        code: `<Alert.Root tone="danger" live>
  <Alert.Icon />
  <Alert.Content>
    <Alert.Title>Le paiement a été refusé</Alert.Title>
    <Alert.Description>Vérifiez le numéro de carte puis réessayez.</Alert.Description>
  </Alert.Content>
</Alert.Root>`,
      },
    ],
  },
  {
    name: "AppLayout",
    package: "@fili/react",
    import: 'import { AppLayout } from "@fili/react";',
    status: "stable",
    category: "gabarit",
    purpose: "Façade du shell applicatif (sidebar repliable, topbar, aside) pilotée par la largeur du SHELL, jamais du viewport. Sa nav intégrée consomme la facture unique de Nav (navRowClass).",
    doctrine: null,
    dette: "Doctrine à écrire (vague 7 gabarits) — le composant est né de l'usage du site ; ses décisions (container queries, off-canvas, FAB aside) sont journalisées dans DECISIONS.md mais pas encore en paire UX/UI.",
    rules: null,
    axes: {
      variant: axe<ShellVariant>({
        kind: "variant",
        description: "Gabarit d'application ou de documentation.",
        values: { default: "app (rail nav + aside outils)", docs: "documentation (rail fixe, contenu borné)" },
        default: "default",
      }),
    },
    props: propsDe<AppLayoutP>()({
      collapsible: { type: "boolean", default: "true", description: "Rail de navigation repliable." },
      nav: { type: "AppNavGroup[] | AppNavItem[]", description: "Navigation structurée (rendue par la facture unique de Nav)." },
      topbar: { type: "{ breadcrumb, search, actions }", description: "Barre supérieure composable." },
      aside: { type: "ReactNode", description: "Rail d'outils (fin) — off-canvas sous breakpoint desktop." },
      asideLabel: { type: "string", default: '"Panneau"', description: "Nom accessible du rail d'outils — sert aussi de libellé au FAB qui l'invoque hors-champ." },
      sidebar: { type: "ReactNode", description: "Échappatoire : remplace brand+nav par un contenu sur-mesure." },
    }),
    accessibility: ["nav intégrée = landmark étiqueté", "off-canvas refermé après navigation (combobox/switch exclus du piège)"],
    adaptiveBehavior: "Container queries sur la largeur du shell : rail replié, off-canvas, aside invocable — jamais un breakpoint viewport.",
    antiPatterns: ["Recréer un shell avec des grid/flex ad hoc", "breakpoints viewport (tablet:) dans le contenu d'un shell"],
    canonicalExamples: [
      {
        title: "Application minimale",
        code: `<AppLayout
  brand={<span>Fili</span>}
  nav={[{ label: "Accueil", href: "/", active: true }, { label: "Rapports", href: "/rapports" }]}
  topbar={{ search: true }}
>
  <p>Contenu.</p>
</AppLayout>`,
      },
    ],
  },
  {
    name: "AppShell",
    package: "@fili/react",
    import: 'import { AppShell } from "@fili/react";',
    status: "interne",
    category: "gabarit",
    purpose: "Primitive bas-niveau à 3 régions sous AppLayout. Ne pas consommer directement : préférer AppLayout (statut interne — zéro consommateur ; retrait du baril = décision de majeure).",
    doctrine: null,
    rules: null,
  },
  {
    name: "Brand",
    package: "@fili/react",
    import: 'import { Brand } from "@fili/react";',
    status: "stable",
    category: "identité",
    purpose: "Verrou logo + nom pour la tête de rail. Le sélecteur de site est un Select distinct, jamais fusionné.",
    doctrine: null,
    dette: "Couvert par le pattern NAVIGATION en creux (tête de rail) — fiche propre à écrire à la vague 8, ou absorption documentée dans NAVIGATION-UX.",
    rules: null,
    anatomy: anatomie<BrandC>("Brand", ["Root", "Logo", "Text"]),
    props: propsDe<React.ComponentProps<BrandC["Root"]>>()({
      asChild: { type: "boolean", default: "false", description: "Rend l'enfant (lien d'accueil) à la place du div." },
    }),
    accessibility: ["Quand la marque est un lien d'accueil : asChild + <a aria-label> du consommateur"],
    antiPatterns: ["Fusionner marque et sélecteur d'espace dans un seul contrôle"],
    canonicalExamples: [
      {
        title: "Tête de rail",
        code: `<Brand.Root>
  <Brand.Text>Fili</Brand.Text>
</Brand.Root>`,
      },
    ],
  },
  {
    name: "CardGroup",
    package: "@fili/react",
    import: 'import { CardGroup } from "@fili/react";',
    status: "stable",
    category: "collection",
    purpose:
      "Le PATTERN Collection — il assemble et orchestre de vraies Card (enfants directs), il ne redessine JAMAIS leur contenu : grille intrinsèque, régime joint/séparé, filets et coins, highlight de proximité, balisage liste + cellule, contexte collectif de mode et de densité.",
    doctrine: { pattern: "patterns/COLLECTION-UX.md + COLLECTION-UI.md" },
    rules: "RULES-collection.md",
    anatomy: anatomie<CardGroupC>("CardGroup", ["Root"]),
    axes: {
      mode: axe<CardGroupMode>({
        kind: "mode",
        description: "Mode d'interaction UNIQUE pour toute la collection (langage INTERACTION).",
        values: { static: "lecture", clickable: "chaque carte navigue", selectable: "chaque carte se sélectionne" },
        default: "static",
      }),
      density: axe<CardGroupDensity>({
        kind: "density",
        description: "Densité de la collection.",
        // Deux crans, ceux de CARD : COLLECTION-R01 dit que la densité « appartient déjà à
        // CARD ». Le cran `spacious` que la collection s'était donné a été retiré le 2026-07-30
        // avec le rétablissement des frontières d'autorité.
        values: { comfortable: "défaut", compact: "resserrée" },
        default: "comfortable",
      }),
      selection: axe<CardGroupSelection>({
        kind: "enum",
        description:
          "Régime de sélection d'un groupe selectable (CARD-R26) — porté par le GROUPE, jamais carte par carte : « une seule à la fois » est indécidable localement. Absent = chaque carte reste autonome.",
        values: {
          single: "choix exclusif — radiogroup, un seul arrêt de tabulation, les flèches circulent et retiennent",
          multiple: "choix cumulable — group, chaque carte est une case et un arrêt de tabulation",
        },
        default: null,
      }),
    },
    props: propsDe<CardGroupP>()({
      cols: { type: '1 | 2 | 3 | 4 | "auto"', default: '"auto"', description: "auto = grille intrinsèque — JAMAIS un nombre par appareil." },
      separated: { type: "boolean", default: "false", description: "Cartes séparées (gouttières) vs jointives." },
      outlined: { type: "boolean", default: "true", description: "Bordure de la collection." },
      solo: { type: "boolean", default: "false", description: "Carte unique (désactive la proximité)." },
      loading: { type: "boolean", default: "false", description: "Collection en chargement — porte aria-busy ; les squelettes sont aria-hidden." },
      label: { type: "string", description: "Étiquette du groupe — la QUESTION quand un régime de sélection est déclaré (exigée alors)." },
      value: { type: "string | null | string[]", description: "Sous régime : la valeur retenue (single) ou les valeurs retenues (multiple). Le type réel est contraint par `selection` (union discriminée)." },
      onValueChange: { type: "(v: string | null) => void | (v: string[]) => void", description: "Sous régime : le groupe applique le régime et rend la nouvelle sélection." },
    }),
    accessibility: [
      "role=list / role=listitem posés par la collection (la cellule lui appartient)",
      "sous régime, le groupe devient une QUESTION : role=radiogroup (single) ou role=group (multiple), les cellules cessent d'être des listitem, et chaque Card prend le rôle nommé par CARD-R25 (radio / checkbox + aria-checked)",
      "single : un seul arrêt de tabulation (l'option retenue, à défaut la première), flèches circulantes, la sélection suit le focus (APG Radio Group)",
      "aria-busy au chargement vit sur la collection, les squelettes des cartes sont aria-hidden",
      "mode selectable : état et bascule portés par chaque Card (aria-pressed, Espace/Entrée)",
      "une Card `mode=\"static\"` explicite est une carte SANS CIBLE : aucune affordance, le highlight l'ignore",
    ],
    adaptiveBehavior: "Grille intrinsèque repeat(auto-fill, minmax(min(100%, item-min), 1fr)) — jamais de grid-cols par breakpoint.",
    antiPatterns: [
      "Grille de cartes à la main (tablet:grid-cols-*)",
      "des modes différents carte par carte (le mode appartient à la collection ; une carte sans cible surclasse en static)",
      "un groupe qui mélange sélection simple et multiple (CARD-R26) — l'union discriminée de `selection` le rend intypable",
      "la collection qui rend l'intérieur de ses items — l'ex-API CardGroup.Card, une seconde anatomie de carte, a été SUPPRIMÉE le 2026-07-30 : les enfants sont de vraies Card",
    ],
    canonicalExamples: [
      {
        title: "Collection cliquable — de vraies Card comme enfants",
        code: `<CardGroup mode="clickable" separated label="Guides">
  <Card.Root>
    <Card.Body>
      <Card.Header>
        <Card.Title><Card.TitleLink href="/guides/commencer">Commencer</Card.TitleLink></Card.Title>
      </Card.Header>
      <Card.Description>Installer et brancher le kit.</Card.Description>
    </Card.Body>
  </Card.Root>
  <Card.Root>
    <Card.Body>
      <Card.Header>
        <Card.Title><Card.TitleLink href="/guides/theming">Theming</Card.TitleLink></Card.Title>
      </Card.Header>
      <Card.Description>Rayons, relief, sombre.</Card.Description>
    </Card.Body>
  </Card.Root>
</CardGroup>`,
      },
      {
        title: "Choix exclusif — le régime appartient au groupe (CARD-R26)",
        code: `<CardGroup mode="selectable" selection="single" separated label="Formule" value="annuel" onValueChange={() => {}}>
  <Card.Root value="mensuel">
    <Card.Body>
      <Card.Header><Card.Title>Mensuel</Card.Title></Card.Header>
      <Card.Description>Sans engagement.</Card.Description>
    </Card.Body>
  </Card.Root>
  <Card.Root value="annuel">
    <Card.Body>
      <Card.Header><Card.Title>Annuel</Card.Title></Card.Header>
      <Card.Description>Deux mois offerts.</Card.Description>
    </Card.Body>
  </Card.Root>
</CardGroup>`,
      },
    ],
  },
  {
    name: "Checkbox",
    package: "@fili/react",
    import: 'import { Checkbox } from "@fili/react";',
    status: "stable",
    category: "champ",
    purpose:
      "Une sélection VALIDÉE À LA SOUMISSION, cumulable — l'autre moitié de la ligne de partage posée par SWITCH-UX. Le switch agit tout de suite ; la case attend l'envoi.",
    doctrine: { ux: "components/CHOICE-UX.md", ui: "components/CHOICE-UI.md" },
    rules: "RULES-choice.md",
    anatomy: anatomie<CheckboxC>("Checkbox", ["Group"]),
    axes: {
      size: axe<ChoiceSize>({
        kind: "size",
        description: "Cran de la marque et du libellé — apparié à l'échelle `icon` (CHOICE-UI).",
        values: { sm: "compact (marque icon.sm)", md: "défaut (marque icon.md)" },
        default: "md",
      }),
      status: axe<ChoiceStatus>({
        kind: "status",
        description: "Statut SUBI par la validation, jamais décoratif. Hérité du groupe quand il existe.",
        values: { default: "au repos", error: "invalidé par la validation (bordure danger + anneau accordé)" },
        default: "default",
      }),
    },
    props: propsDe<CheckboxP>()({
      label: { type: "ReactNode", description: "Libellé EMBARQUÉ et cliquable, à droite de la marque (CHOICE-R08)." },
      helper: { type: "ReactNode", description: "Aide de l'option : une phrase courte, sans lien (CHOICE-R10)." },
      indeterminate: { type: "boolean", default: "false", description: "Parent partiellement coché — se CALCULE, ne se sélectionne pas (CHOICE-R11)." },
      onCheckedChange: { type: "(checked: boolean) => void", description: "Bascule de la case (effet différé à la soumission)." },
      value: { type: "string", description: "Dans un Checkbox.Group : la valeur portée par cette option." },
      exclusive: { type: "boolean", default: "false", description: "« Aucune de ces réponses » : la cocher décoche les autres (CHOICE-R18)." },
      onValueChange: { type: "(valeurs: string[]) => void", description: "Checkbox.Group : l'ensemble des valeurs cochées." },
      error: { type: "ReactNode", description: "Checkbox.Group : message d'erreur DU GROUPE, jamais de la première case (CHOICE-R17). Mode de PRÉSENTATION — dans un formulaire réel, c'est `verdict` qui porte le message." },
      verdict: { type: "ValidationVerdict", description: "Le VERDICT — du groupe (requis, cardinalité min/max, combinaison interdite) ou d'une case ISOLÉE (consentement obligatoire). Il l'emporte sur `status` et sur `error`." },
    }),
    tokens: ["icon-sm / icon-md (taille de marque)", "radius-sm (case)", "border-strong au repos (3:1)", "primary / on-primary (coché)", "danger (erreur)", "--control-focus-* (anneau unique)"],
    states: ["checked", "indeterminate (propriété DOM, jamais soumise)", "disabled", "error", "focus-visible"],
    accessibility: [
      "input[type=checkbox] NATIF conservé et focalisable — rôle, état et clavier non réimplémentés (CHOICE-R15)",
      "libellé embarqué dans le <label> : la marque ET le texte sont cliquables (CHOICE-R08/R16)",
      "Checkbox.Group en fieldset/legend — la question est le nom accessible du groupe (CHOICE-R06)",
      "état jamais porté par la seule couleur : le glyphe change (CHOICE-R12)",
      "message de verdict associé au fieldset (groupe) ou à la case (aria-describedby), avec sa qualification textuelle",
    ],
    validation: {
      role: "group",
      nativeConstraints: ["aucune — la cardinalité d'un ensemble n'a pas d'équivalent natif"],
      externalConstraints: ["required", "min / max de sélections (Validation.fromSelection)", "combinaison interdite (règle métier)", "verdict serveur"],
      ariaInvalidTarget: "chaque input[type=checkbox] du groupe (le statut descend par contexte) ; le message, lui, appartient au groupe",
      messageBinding: "aria-describedby du <fieldset> → le message unique du groupe (CHOICE-R17 : jamais rattaché à la première option)",
      focusTarget: "la première option du groupe — un fieldset n'est pas focalisable",
      summaryRole: "UNE entrée pour le groupe entier, dont le texte reprend la question",
      requiredBehavior: "aucune prop `required` : la contrainte se déclare au contrat (Validation.fromSelection) et revient en verdict",
      pendingBehavior: "verdict `validating` — le groupe reste neutre, aucune option n'est marquée",
      correctionBehavior: "la signature du verdict est la sélection sérialisée : toute (dé)sélection le périme",
      examples: {
        valid: 'Validation.fromSelection("sujets", ["design"], { min: 1 }, MESSAGES) → valid',
        invalid: 'Validation.fromSelection("sujets", [], { min: 1 }, MESSAGES) → invalid { code: "valueMissing" }',
      },
    },
    antiPatterns: [
      "S'en servir pour un réglage à effet immédiat (c'est Switch — CHOICE-R01)",
      "Poser une case unique là où la question n'admet qu'une réponse (ce sont des Radio, même à deux options — CHOICE-R03)",
      "Pré-cocher un consentement (CHOICE-R13)",
      "Rendre `indeterminate` cliquable comme troisième état (il se calcule — CHOICE-R11)",
    ],
    canonicalExamples: [
      { title: "Consentement explicite", code: `<Checkbox label="J'accepte les conditions d'utilisation" onCheckedChange={() => {}} />` },
      {
        title: "Cardinalité du groupe — le message DESCEND du verdict",
        imports: ['import { Validation } from "@fili/react/validation";'],
        code: `<Checkbox.Group
  label="Centres d'intérêt"
  value={[]}
  onValueChange={() => {}}
  verdict={Validation.fromSelection("sujets", [], { min: 1 }, {
    valueMissing: "Choisissez au moins un centre d'intérêt.",
    fallback: "Cette sélection ne convient pas.",
  })}
>
  <Checkbox value="design" label="Design" />
  <Checkbox value="code" label="Développement" />
</Checkbox.Group>`,
      },
      {
        title: "Options cumulables sous leur question",
        code: `<Checkbox.Group label="Centres d'intérêt" value={["design"]} onValueChange={() => {}}>
  <Checkbox value="design" label="Design" />
  <Checkbox value="code" label="Développement" helper="Front et back" />
  <Checkbox value="aucun" label="Aucun de ces sujets" exclusive />
</Checkbox.Group>`,
      },
    ],
  },
  {
    name: "Chip",
    package: "@fili/react",
    import: 'import { Chip } from "@fili/react";',
    status: "stable",
    category: "navigation",
    purpose:
      "Le RENVOI COMPACT en nuée : pointe vers une entité du système (règle, cas, constat) depuis un contexte dense. Destination ou déplacement de vue — jamais une mutation. Premier composant entré par la tranche verticale du MISSING-COMPONENT-PROTOCOL (2026-07-29).",
    doctrine: { ux: "components/CHIP-UX.md", ui: "components/CHIP-UI.md" },
    rules: "RULES-chip.md",
    axes: {
      variant: axe<ChipVariant>({
        kind: "variant",
        description: "Facture contenue, calme — pas de relief (un renvoi, pas un objet pressé).",
        values: { outline: "fond de page + filet border (défaut)", subtle: "fond surface, sans filet — sur zone déjà bordée" },
        default: "outline",
      }),
    },
    props: propsDe<ChipP>()({
      mono: { type: "boolean", default: "false", description: "Identifiant technique en chasse fixe (CHIP-R05)." },
      asChild: { type: "boolean", default: "false", description: "Porte un <a> si la chip NAVIGUE ; sans asChild, <button type=button> (déplacement de vue)." },
    }),
    tokens: ["radius-md", "border / surface / surface-hover / primary (survol)", ".ds-focus-ring (--control-focus-color)"],
    accessibility: ["sémantique native suivant la cible (a href / button — CHIP-R06)", "nom accessible = texte visible, flèche comprise", "cible effective ≥ touch.target-min dans la nuée"],
    antiPatterns: [
      "Porter une mutation (créer/supprimer → Button)",
      "Servir de filtre à facettes (autre besoin, hors périmètre — CHIP-R03)",
      "Recomposer la facture en local (c'est exactement la dérive qui a fait naître ce composant)",
    ],
    canonicalExamples: [
      {
        title: "Nuée de renvois vers des règles",
        code: `<div className="flex flex-wrap gap-sm">
  <Chip mono onClick={() => {}}>BUTTON-R12 →</Chip>
  <Chip mono onClick={() => {}}>BUTTON-R30 →</Chip>
  <Chip variant="subtle" onClick={() => {}}>Situations qui l'éprouvent →</Chip>
</div>`,
      },
    ],
  },
  {
    name: "Container",
    package: "@fili/react",
    import: 'import { Container } from "@fili/react";',
    status: "stable",
    category: "gabarit",
    purpose: "Cadre de page (max-width + centrage). Le cran suit le CONTEXTE : narrow = formulaire, default = contenu, wide = dashboard.",
    doctrine: { pattern: "foundations/GRID" },
    rules: null,
    axes: {
      size: axe<ContainerSize>({
        kind: "size",
        description: "Largeurs de CONTENU (langue narrow/default/wide/full — jamais sm/md/lg, réservés aux contrôles).",
        values: { narrow: "480px — formulaire, auth", default: "1024px — page standard", wide: "1440px — dashboard dense", full: "pleine largeur" },
        default: "default",
      }),
    },
    props: propsDe<ContainerP>()({
      asChild: { type: "boolean", default: "false", description: "Slot Radix." },
    }),
    accessibility: ["Neutre (div de cadrage) — la sémantique vient du contenu"],
    antiPatterns: ["max-w-* arbitraire par page (le cran est un choix de contexte, pas d'esthétique)"],
    canonicalExamples: [
      { title: "Page de formulaire", code: `<Container size="narrow">
  <h1>Créer un compte</h1>
</Container>` },
    ],
  },
  {
    name: "DeleteButton",
    package: "@fili/react",
    import: 'import { DeleteButton } from "@fili/react";',
    status: "expressif",
    category: "contrôle",
    purpose: "Bouton destructif E-motion (éclatement, état terminal). Réservé aux moments mérités — budget de rareté.",
    doctrine: { ux: "components/BUTTON-UX.md §E-motion" },
    rules: null,
    axes: {
      size: axe<DeleteButtonSize>({
        kind: "size",
        description: "Taille du contrôle expressif.",
        values: { sm: "compact", md: "standard", lg: "défaut (moment mérité)" },
        default: "lg",
      }),
    },
    props: propsDe<DeleteButtonP>()({
      onDelete: { type: "() => Promise<unknown> | unknown", description: "Action de suppression (l'animation attend la résolution)." },
      doneLabel: { type: "ReactNode", default: '"Supprimé"', description: "Libellé de l'état terminal." },
      liveMessage: { type: "string", default: '"Élément supprimé."', description: "Annonce aria-live." },
    }),
    accessibility: ["aria-live porte le résultat", "reduced-motion = crossfade instantané", "focus ring danger (focus v2)"],
    antiPatterns: ["L'employer pour une suppression banale et fréquente (→ Button destructive)"],
    canonicalExamples: [
      { title: "Suppression méritée", code: `<DeleteButton onDelete={() => Promise.resolve()}>Supprimer le compte</DeleteButton>` },
    ],
  },
  {
    name: "Divider",
    package: "@fili/react",
    import: 'import { Divider } from "@fili/react";',
    status: "stable",
    category: "structure",
    purpose: "Séparation décorative (ou sémantique avec decorative=false). Toujours border — jamais border-strong.",
    doctrine: { pattern: "foundations/BORDER" },
    rules: null,
    axes: {
      orientation: axe<DividerOrientation>({
        kind: "enum",
        description: "Sens du filet.",
        values: { horizontal: "pleine largeur", vertical: "pleine hauteur du conteneur" },
        default: "horizontal",
      }),
    },
    props: propsDe<DividerP>()({
      decorative: { type: "boolean", default: "true", description: "false → role=separator + aria-orientation." },
    }),
    accessibility: ["décoratif par défaut (ignoré des lecteurs) ; sémantique sur demande"],
    antiPatterns: ["border-t ad hoc là où le composant existe", "s'en servir comme délimitation forte (c'est border, pas border-strong)"],
    canonicalExamples: [{ title: "Séparation de sections", code: `<Divider />` }],
  },
  {
    name: "Drawer",
    package: "@fili/react",
    import: 'import { Drawer } from "@fili/react";',
    status: "stable",
    category: "superposé",
    purpose: "Panneau ancré à un bord (fondation OVERLAY : scrim, focus trap, scroll-lock, Échap). Un « sheet » EST un Drawer top/bottom — pas de composant Sheet séparé.",
    doctrine: { pattern: "foundations/OVERLAY" },
    dette: "Paire DRAWER-UX/UI propre à écrire (vague 6) — les arbitrages (side/effect/depth/size à double lecture) sont journalisés dans DECISIONS.md.",
    rules: null,
    anatomy: anatomie<DrawerC>("Drawer", ["Root", "Frame"]),
    axes: {
      side: axe<DrawerSide>({
        kind: "enum",
        description: "Bord d'ancrage (directions logiques start/end, jamais left/right).",
        values: { start: "rail début", end: "rail fin", top: "feuille haute centrée", bottom: "feuille basse centrée" },
        default: "start",
      }),
      size: axe<DrawerSize>({
        kind: "enum",
        description: "Double lecture : largeur du panneau (start/end : 280/480/640/≈85%) ou de la feuille centrée (top/bottom : 480/640/1024/pleine). Défaut contextuel : narrow en latéral, full en vertical.",
        values: { narrow: "280 / 480px", default: "480 / 640px", wide: "640 / 1024px", full: "≈85% / pleine largeur" },
        default: null,
      }),
      effect: axe<DrawerEffect>({
        kind: "enum",
        description: "push impossible en vertical (repli overlay silencieux) ; push et depth exigent <Drawer.Frame>.",
        values: { overlay: "par-dessus + scrim", push: "pousse le contenu du Frame" },
        default: "overlay",
      }),
    },
    props: propsDe<DrawerP>()({
      open: { type: "boolean", required: true, description: "Contrôlé." },
      onClose: { type: "() => void", required: true, description: "Échap / scrim / bouton." },
      depth: { type: "boolean", default: "false", description: "Depth Transition (le fond recule dans le Frame) — combinable avec overlay ET push." },
    }),
    accessibility: ["focus trap + retour du focus", "Échap ferme", "panneau tabindex=-1 (exception BORDER-U07 documentée)"],
    antiPatterns: ["Créer un composant Sheet (c'est un Drawer top/bottom)", "push sans Drawer.Frame (repli silencieux)"],
    canonicalExamples: [
      {
        title: "Rail latéral",
        code: `<Drawer open={false} onClose={() => {}} side="start" size="narrow">
  <p>Navigation secondaire.</p>
</Drawer>`,
      },
    ],
  },
  {
    name: "Dropdown",
    package: "@fili/react",
    import: 'import { Dropdown } from "@fili/react";',
    status: "stable",
    category: "superposé",
    purpose: "Menu d'ACTIONS (jamais de valeur — ça, c'est Select). Placement auto par défaut ; Dropdown.Inline = même contenu, à plat, sans déclencheur.",
    doctrine: { pattern: "foundations/OVERLAY" },
    dette: "Paire DROPDOWN-UX/UI propre à écrire (vague 6) — le fond de survol glissant (divergence de focus documentée) et la frontière avec Select sont journalisés.",
    rules: null,
    anatomy: anatomie<DropdownC>("Dropdown", ["Root", "Trigger", "Content", "Item", "Label", "Separator", "Inline"]),
    axes: {
      side: axe<DropdownSide>({
        kind: "enum",
        description: "Placement vertical — auto = mesuré face à la fenêtre à l'ouverture ; explicite = forçage.",
        values: { top: "au-dessus", bottom: "en dessous", auto: "mesuré (défaut)" },
        default: "auto",
      }),
      align: axe<DropdownAlign>({
        kind: "enum",
        description: "Alignement horizontal sur le déclencheur.",
        values: { start: "début", center: "centre", end: "fin", auto: "mesuré (défaut)" },
        default: "auto",
      }),
    },
    accessibility: ["ARIA menu-button", "items = menuitem (menuitemradio si checked)", "signal de survol = fond glissant ≥ 3:1 (divergence de ring documentée)"],
    antiPatterns: ["Y mettre une sélection de valeur (→ Select)", "un Item sans onSelect ni fermeture explicite"],
    canonicalExamples: [
      {
        title: "Menu d'actions",
        code: `<Dropdown.Root>
  <Dropdown.Trigger asChild>
    <CompactButton aria-label="Actions"><CompactButton.Icon><svg viewBox="0 0 20 20" /></CompactButton.Icon></CompactButton>
  </Dropdown.Trigger>
  <Dropdown.Content>
    <Dropdown.Item onSelect={() => {}}>Dupliquer</Dropdown.Item>
    <Dropdown.Separator />
    <Dropdown.Item onSelect={() => {}}>Archiver</Dropdown.Item>
  </Dropdown.Content>
</Dropdown.Root>`,
      },
    ],
  },
  {
    name: "Link",
    package: "@fili/react",
    import: 'import { Link } from "@fili/react";',
    status: "stable",
    category: "contrôle",
    purpose: "LA navigation. context règle la présentation sans changer la nature ; current (navigation) = aria-current + signal non chromatique.",
    doctrine: { ux: "components/LINK-UX.md", ui: "components/LINK-UI.md" },
    rules: "RULES-link.md",
    anatomy: anatomie<LinkC>("Link", ["Root", "Icon"]),
    axes: {
      context: axe<LinkContext>({
        kind: "context",
        description: "Environnement d'usage.",
        values: { inline: "dans une phrase (souligné)", standalone: "isolé (défaut)", navigation: "dans une nav (supporte current)" },
        default: "standalone",
      }),
    },
    props: propsDe<LinkP>()({
      current: { type: "boolean", description: "context=navigation seulement — aria-current=page + poids/trait (jamais la couleur seule)." },
      asChild: { type: "boolean", default: "false", description: "next/link et routeurs client." },
    }),
    accessibility: ["un lien NAVIGUE (jamais de mutation)", "current non chromatique", "focus ring v2 (défaut primary subtil)"],
    antiPatterns: ["Un <button> qui navigue, un Link qui mute", "souligner un lien standalone (le soulignement appartient à inline)"],
    canonicalExamples: [
      { title: "Lien dans une phrase", code: `<p>Voir la <Link href="/doctrine" context="inline">doctrine complète</Link> pour le raisonnement.</p>` },
    ],
  },
  {
    name: "Modal",
    package: "@fili/react",
    import: 'import { Modal } from "@fili/react";',
    status: "stable",
    category: "superposé",
    purpose: "Superposé modal centré (fondation OVERLAY). Confirmation = narrow ; wide (1024) = illustration ou tableau court.",
    doctrine: { ux: "components/MODAL-UX.md", ui: "components/MODAL-UI.md" },
    rules: "RULES-modal.md",
    anatomy: anatomie<ModalC>("Modal", ["Root", "Header", "Body", "Footer", "Close"]),
    axes: {
      size: axe<ModalSize>({
        kind: "size",
        description: "Largeurs de contenu (narrow/default/wide).",
        values: { narrow: "container-narrow (480) — confirmation, saisie courte", default: "overlay (640) — détail/lecture", wide: "container-default (1024) — illustration, tableau court" },
        default: "narrow",
      }),
      placement: axe<ModalPlacement>({
        kind: "enum",
        description: "Position verticale de la surface.",
        values: { center: "centrée (défaut)", top: "haut (retrait 6vh)", bottom: "bas" },
        default: "center",
      }),
      enterFrom: axe<ModalEnterFrom>({
        kind: "enum",
        description: "Direction d'apparition.",
        values: { bottom: "monte (défaut)", top: "descend", center: "fond en place" },
        default: "bottom",
      }),
    },
    props: propsDe<ModalP>()({
      open: { type: "boolean", required: true, description: "Contrôlé." },
      onClose: { type: "() => void", required: true, description: "Fermeture (Échap, scrim si dismissOnScrim, Close)." },
      dismissOnScrim: { type: "boolean", default: "true", description: "Clic sur le voile ferme." },
      level: { type: "2 | 3 | 4", default: "2", description: "Niveau de heading du Header (nom accessible auto)." },
    }),
    accessibility: ["focus trap + aria-labelledby dérivé du Header", "panneau tabindex=-1 (exception BORDER-U07)", "Échap ferme"],
    antiPatterns: ["Une modale > 640 pour du texte (au-delà, c'est une page)", "empiler des modales"],
    canonicalExamples: [
      {
        title: "Confirmation destructive",
        code: `<Modal.Root open={false} onClose={() => {}} size="narrow">
  <Modal.Header>Supprimer le projet ?</Modal.Header>
  <Modal.Body>Cette action est définitive.</Modal.Body>
  <Modal.Footer>
    <Button variant="stroke" tone="neutral">Annuler</Button>
    <Button variant="filled" tone="destructive">Supprimer</Button>
  </Modal.Footer>
</Modal.Root>`,
      },
    ],
  },
  {
    name: "Nav",
    package: "@fili/react",
    import: 'import { Nav } from "@fili/react";',
    status: "stable",
    category: "navigation",
    purpose: "Landmark de navigation (Root label requis) — porte LA facture unique de rangée (navRowClass), consommée aussi par la nav intégrée d'AppLayout. Regroupement repliable = Accordion ; tête simple = Nav.GroupLabel.",
    doctrine: { pattern: "patterns/NAVIGATION" },
    rules: null,
    anatomy: anatomie<NavC>("Nav", ["Root", "List", "Link", "GroupLabel"]),
    props: propsDe<NavLinkP>()({
      current: { type: "boolean", description: "Page courante — aria-current=page + lavis primary-subtle + poids (un seul à la fois)." },
      asChild: { type: "boolean", default: "false", description: "Rend l'enfant à la place du <a> (next/link, bouton de sélection) — l'enfant compose icône + libellé tronqué." },
      icon: { type: "ReactNode", description: "Slot 16px avant le libellé (hors asChild)." },
    }),
    accessibility: ["landmark <nav> étiqueté (label requis)", "aria-current=page sur la rangée courante"],
    antiPatterns: ["Recopier les classes de la rangée à la main (navRowClass est la seule définition)"],
    canonicalExamples: [
      {
        title: "Navigation latérale",
        code: `<Nav.Root label="Documentation">
  <Nav.GroupLabel>Fondations</Nav.GroupLabel>
  <Nav.List>
    <Nav.Link href="/couleur" current>Couleur</Nav.Link>
    <Nav.Link href="/relief">Relief</Nav.Link>
  </Nav.List>
</Nav.Root>`,
      },
    ],
  },
  {
    name: "Radio",
    package: "@fili/react",
    import: 'import { Radio } from "@fili/react";',
    status: "stable",
    category: "champ",
    purpose:
      "Un choix EXCLUSIF dans un ensemble borné, validé à la soumission. L'exclusivité appartient au GROUPE : un radio hors Radio.Group est un défaut de conception, pas une variante.",
    doctrine: { ux: "components/CHOICE-UX.md", ui: "components/CHOICE-UI.md" },
    rules: "RULES-choice.md",
    anatomy: anatomie<RadioC>("Radio", ["Group"]),
    axes: {
      size: axe<ChoiceSize>({
        kind: "size",
        description: "Cran de la marque et du libellé — apparié à l'échelle `icon` (CHOICE-UI).",
        values: { sm: "compact (marque icon.sm)", md: "défaut (marque icon.md)" },
        default: "md",
      }),
      status: axe<ChoiceStatus>({
        kind: "status",
        description: "Statut SUBI par la validation, jamais décoratif. Hérité du groupe quand il existe.",
        values: { default: "au repos", error: "invalidé par la validation (bordure danger + anneau accordé)" },
        default: "default",
      }),
    },
    props: propsDe<RadioP>()({
      value: { type: "string", required: true, description: "La valeur portée par cette option — c'est ce que le groupe transmet." },
      label: { type: "ReactNode", description: "Libellé embarqué et cliquable ; il se comprend hors contexte (CHOICE-R09)." },
      helper: { type: "ReactNode", description: "Aide de l'option : une phrase courte, sans lien (CHOICE-R10)." },
      onValueChange: { type: "(valeur: string) => void", description: "Radio.Group : la valeur retenue." },
      name: { type: "string", description: "Radio.Group : nom commun des options, généré si absent — c'est lui qui rend le groupe exclusif." },
      error: { type: "ReactNode", description: "Radio.Group : message d'erreur DU GROUPE, jamais de la première option (CHOICE-R17). Mode de PRÉSENTATION — dans un formulaire réel, c'est `verdict` qui porte le message." },
      verdict: { type: "ValidationVerdict", description: "Radio.Group : le VERDICT du groupe — aucune option choisie alors qu'une réponse est obligatoire, valeur devenue indisponible, verdict métier. Il l'emporte sur `status` et sur `error`." },
    }),
    tokens: ["icon-sm / icon-md (taille de marque)", "radius-pill (disque)", "border-strong au repos (3:1)", "primary / on-primary (coché)", "danger (erreur)", "--control-focus-* (anneau unique)"],
    states: ["checked", "disabled", "error", "focus-visible"],
    accessibility: [
      "input[type=radio] NATIFS partageant un `name` : arrêt de tabulation unique, flèches et sélection qui suit le focus, gratuitement (CHOICE-R14)",
      "Radio.Group en fieldset/legend — la question est le nom accessible du groupe (CHOICE-R06)",
      "libellé embarqué dans le <label> : la marque ET le texte sont cliquables (CHOICE-R08/R16)",
      "la forme (disque) porte la cardinalité, pas la seule couleur (CHOICE-R12)",
      "message de verdict associé au fieldset, avec sa qualification textuelle — jamais rattaché à une option",
    ],
    validation: {
      role: "group",
      nativeConstraints: ["required (natif) — non consommé par la chaîne : le verdict d'un groupe se calcule sur la valeur retenue"],
      externalConstraints: ["required (Validation.fromSelection)", "valeur devenue indisponible", "règle métier", "verdict serveur"],
      ariaInvalidTarget: "chaque input[type=radio] du groupe (statut hérité) ; le message appartient au groupe",
      messageBinding: "aria-describedby du <fieldset> → le message unique du groupe (CHOICE-R17)",
      focusTarget: "l'option cochée si elle existe, sinon la première du groupe",
      summaryRole: "UNE entrée pour le groupe, dont le texte reprend la question posée",
      requiredBehavior: "aucune prop `required` : la contrainte se déclare au contrat et revient en verdict",
      pendingBehavior: "verdict `validating` — le groupe reste neutre",
      correctionBehavior: "la signature est la valeur retenue : choisir une option périme le verdict",
      examples: {
        valid: 'Validation.fromSelection("formule", ["annuel"], { required: true }, MESSAGES) → valid',
        invalid: 'Validation.fromSelection("formule", [], { required: true }, MESSAGES) → invalid { code: "valueMissing" }',
      },
    },
    antiPatterns: [
      "Poser un radio hors de son groupe (l'exclusivité appartient au groupe — CHOICE-R05)",
      "Réimplémenter le clavier en role=radiogroup + tabindex mobile (plus de code, moins de justesse)",
      "Dépasser le seuil de SELECT-UX — au-delà, la question change de composant (CHOICE-R04)",
      "Pré-sélectionner une option sans que ce soit une décision assumée (CHOICE-R13)",
    ],
    canonicalExamples: [
      {
        title: "Choix d'une formule",
        code: `<Radio.Group label="Formule" value="annuel" onValueChange={() => {}}>
  <Radio value="mensuel" label="Mensuel" />
  <Radio value="annuel" label="Annuel" helper="Deux mois offerts" />
</Radio.Group>`,
      },
      {
        title: "Réponse obligatoire — le message DESCEND du verdict",
        imports: ['import { Validation } from "@fili/react/validation";'],
        code: `<Radio.Group
  label="Formule"
  value={undefined}
  onValueChange={() => {}}
  verdict={Validation.fromSelection("formule", [], { required: true }, {
    valueMissing: "Choisissez une formule pour continuer.",
    fallback: "Cette réponse ne convient pas.",
  })}
>
  <Radio value="mensuel" label="Mensuel" />
  <Radio value="annuel" label="Annuel" />
</Radio.Group>`,
      },
    ],
  },
  {
    name: "Select",
    package: "@fili/react",
    import: 'import { Select } from "@fili/react";',
    status: "stable",
    category: "champ",
    purpose: "Choisir UNE valeur (combobox APG select-only). native=true rend un <select> stylé (menu de l'OS). Un menu d'actions, c'est Dropdown.",
    doctrine: { ux: "components/SELECT-UX.md", ui: "components/SELECT-UI.md" },
    rules: "RULES-select.md",
    axes: {
      variant: axe<SelectVariant>({
        kind: "variant",
        description: "Facture du déclencheur.",
        values: { default: "champ bordé (relief creusé sous [data-relief])", ghost: "sans cadre — barres d'outils" },
        default: "default",
      }),
      size: axe<SelectSize>({
        kind: "size",
        description: "Taille du contrôle.",
        values: { sm: "32px", md: "40px", lg: "48px" },
        default: "md",
      }),
    },
    props: propsDe<SelectP>()({
      options: { type: "SelectOption[]", required: true, description: "Les choix (value/label)." },
      value: { type: "string | null", required: true, description: "Contrôlé." },
      onValueChange: { type: "(v: string) => void", required: true, description: "Changement." },
      placeholder: { type: "string", default: '"Sélectionner…"', description: "Libellé sans valeur." },
      native: { type: "boolean", default: "false", description: "<select> natif stylé." },
      loading: { type: "boolean", default: "false", description: "Squelette de chargement." },
      verdict: { type: "ValidationVerdict", description: "Le VERDICT — SEULE voie vers l'état d'erreur (bordure + message, SELECT-R07). Aucun axe `status` décoratif : un select n'est pas « rouge », il est en erreur parce qu'un verdict le dit. Hérité du bloc champ quand il y vit." },
    }),
    accessibility: [
      "APG select-only combobox (aria-activedescendant)",
      "voiles de débordement + barre native masquée dans la listbox",
      "dans un Input.Field : id/for du libellé visible (un <button> est étiquetable), aria-describedby vers le message, aria-required — le MÊME bloc champ que l'input, pas un second",
      "hors bloc champ : le select porte lui-même le message du verdict et son aria-describedby",
    ],
    validation: {
      role: "field",
      nativeConstraints: ["required — posé sur le <select> seulement en mode `native`, où le placeholder porte une valeur vide (SELECT S4)"],
      externalConstraints: ["required", "option devenue indisponible", "règle métier", "verdict serveur"],
      ariaInvalidTarget: "le déclencheur (button[role=combobox]) ou le <select> natif",
      messageBinding: "aria-describedby du déclencheur → le message du bloc champ, ou le message autonome rendu par le select",
      focusTarget: "le déclencheur, par son id (hérité du bloc champ)",
      summaryRole: "une entrée par select, message issu de la même ValidationIssue",
      requiredBehavior: "porté par le bloc champ (indicateur + aria-required) ; le placeholder n'est JAMAIS une valeur valide",
      pendingBehavior: "verdict `validating` → aria-busy hérité du bloc champ",
      correctionBehavior: "signature = la valeur retenue ; choisir une option périme le verdict",
      examples: {
        valid: '<Select verdict={Validation.valid("fr")} … />',
        invalid: '<Select verdict={Validation.invalid({ code: "valueMissing", field: "langue", source: "schema", severity: "error", message: "…" })} … />',
      },
    },
    antiPatterns: [
      "<select> natif hors prop native",
      "y mettre des actions (→ Dropdown)",
      "colorer le déclencheur en rouge sans verdict — l'état d'erreur n'a qu'une entrée, `verdict`",
    ],
    canonicalExamples: [
      { title: "Choix contrôlé", code: `<Select options={[{ value: "fr", label: "Français" }, { value: "en", label: "English" }]} value={null} onValueChange={() => {}} aria-label="Langue" />` },
      {
        title: "Select obligatoire dans le bloc champ — libellé lié, verdict, message",
        imports: ['import { Validation } from "@fili/react/validation";'],
        code: `<Input.Field
  controlId="langue"
  required
  verdict={Validation.invalid({
    code: "valueMissing",
    field: "langue",
    source: "schema",
    severity: "error",
    message: "Choisissez une langue d'interface.",
  })}
>
  <Input.Label>Langue de l'interface</Input.Label>
  <Select options={[{ value: "fr", label: "Français" }, { value: "en", label: "English" }]} value={null} onValueChange={() => {}} />
  <Input.Error />
</Input.Field>`,
      },
    ],
  },
  {
    name: "Skeleton",
    package: "@fili/react",
    import: 'import { Skeleton } from "@fili/react";',
    status: "stable",
    category: "affichage",
    purpose: "Squelette de chargement. Autonome, ou via la prop `loading` des composants (à préférer : mêmes dimensions garanties).",
    doctrine: null,
    dette: "Doctrine à écrire (né du lot 2026-07-29) — l'état d'attente est traité en creux par PERFORMANCE (attentes perçues) ; fiche SKELETON ou absorption à trancher.",
    rules: null,
    axes: {
      variant: axe<SkeletonVariant>({
        kind: "variant",
        description: "Forme du fantôme.",
        values: { block: "rectangle", text: "lignes de texte (dernière raccourcie)", circle: "cercle (avatar)" },
        default: "block",
      }),
    },
    props: propsDe<SkeletonP>()({
      width: { type: "number | string", description: "Largeur (px ou CSS)." },
      height: { type: "number | string", description: "Hauteur." },
      lines: { type: "number", description: "variant=text — nombre de lignes." },
    }),
    accessibility: ["toujours aria-hidden (l'attente s'annonce via aria-busy du composant porteur)"],
    antiPatterns: ["Recomposer un squelette à la main quand le composant expose loading", "animer autre chose que l'opacité (reduced-motion)"],
    canonicalExamples: [
      { title: "Paragraphe fantôme", code: `<Skeleton variant="text" lines={3} />` },
    ],
  },
  {
    name: "SkipLink",
    package: "@fili/react",
    import: 'import { SkipLink } from "@fili/react";',
    status: "stable",
    category: "navigation",
    purpose: "« Aller au contenu » (WCAG 2.4.1) — déplace RÉELLEMENT le focus sur la cible (tabIndex -1 posé au besoin).",
    doctrine: { pattern: "patterns/NAVIGATION" },
    rules: null,
    props: propsDe<SkipLinkP>()({
      href: { type: "string", default: '"#main"', description: "Cible du saut." },
    }),
    accessibility: ["premier élément tabbable de la page", "visible au focus", "focus déplacé programmatiquement"],
    antiPatterns: ["Une ancre nue sans déplacement de focus (le lecteur d'écran reste où il était)"],
    canonicalExamples: [{ title: "En tête de page", code: `<SkipLink href="#main" />` }],
  },
  {
    name: "SubmitButton",
    package: "@fili/react",
    import: 'import { SubmitButton } from "@fili/react";',
    status: "expressif",
    category: "contrôle",
    purpose: "Bouton d'envoi E-motion (avion en papier, GSAP). Un événement, un porteur — moments mérités seulement.",
    doctrine: { ux: "components/BUTTON-UX.md + patterns/FORM (S21)" },
    rules: null,
    axes: {
      size: axe<SubmitButtonSize>({
        kind: "size",
        description: "Taille du contrôle expressif.",
        values: { sm: "compact", md: "standard", lg: "défaut (moment mérité)" },
        default: "lg",
      }),
    },
    props: propsDe<SubmitButtonP>()({
      onSubmit: { type: "() => Promise<unknown> | unknown", description: "Envoi (l'animation attend la résolution ; l'échec revient à idle)." },
      successLabel: { type: "ReactNode", default: '"Envoyé"', description: "Libellé terminal." },
      liveMessage: { type: "string", default: '"Message envoyé."', description: "Annonce aria-live." },
    }),
    accessibility: ["aria-live porte le résultat", "reduced-motion = repli spinner", "focus ring primary subtil"],
    antiPatterns: ["Le poser sur chaque formulaire (budget de rareté — un moment mérité par parcours)"],
    canonicalExamples: [
      { title: "Envoi d'un message", code: `<SubmitButton onSubmit={() => Promise.resolve()}>Envoyer</SubmitButton>` },
    ],
  },
  {
    name: "Switch",
    package: "@fili/react",
    import: 'import { Switch } from "@fili/react";',
    status: "stable",
    category: "champ",
    purpose: "Interrupteur à effet IMMÉDIAT (≠ checkbox). L'état se lit à la position du pouce autant qu'à la couleur.",
    doctrine: { ux: "components/SWITCH-UX.md", ui: "components/SWITCH-UI.md" },
    rules: "RULES-switch.md",
    axes: {
      size: axe<SwitchSize>({
        kind: "size",
        description: "Taille du contrôle.",
        values: { sm: "compact", md: "défaut", lg: "large" },
        default: "md",
      }),
    },
    props: propsDe<SwitchP>()({
      checked: { type: "boolean", required: true, description: "Contrôlé." },
      onCheckedChange: { type: "(c: boolean) => void", description: "Bascule (effet immédiat)." },
      label: { type: "ReactNode", description: "Libellé attaché (sinon aria-label requis)." },
      loading: { type: "boolean", default: "false", description: "Squelette." },
    }),
    accessibility: ["role=switch + aria-checked", "libellé attaché ou aria-label", "état non porté par la seule couleur"],
    validation: {
      role: "none",
      justification:
        "Le switch est un réglage à EFFET IMMÉDIAT (CHOICE-R01) : il n'y a pas de soumission à bloquer, donc pas de verdict à porter. Lui greffer un « doit être activé » recréerait une case à cocher sous un autre nom — pour un consentement ou une acceptation obligatoire, c'est Checkbox. La question ne se rouvre que si un cas RÉEL et documenté apparaît ; le rouvrir demanderait une paire UX/UI, pas une prop.",
    },
    antiPatterns: [
      "S'en servir dans un formulaire soumis plus tard (l'effet doit être immédiat)",
      "Lui ajouter un « obligatoire de l'activer » — c'est une Checkbox (validationRole: none, justifié au manifeste)",
    ],
    canonicalExamples: [
      { title: "Réglage immédiat", code: `<Switch checked onCheckedChange={() => {}} label="Notifications" />` },
    ],
  },
  {
    name: "Tabs",
    package: "@fili/react",
    import: 'import { Tabs } from "@fili/react";',
    status: "stable",
    category: "navigation",
    purpose: "Vues alternatives d'un même sujet (APG Tabs). Le signal de l'onglet courant est non chromatique (poids + trait).",
    doctrine: { ux: "components/TABS-UX.md", ui: "components/TABS-UI.md" },
    rules: "RULES-tabs.md",
    anatomy: anatomie<TabsC>("Tabs", ["Root", "List", "Tab", "Panel"]),
    axes: {
      variant: axe<TabsVariant>({
        kind: "variant",
        description: "Facture des onglets.",
        values: { line: "trait souligné (défaut)", pill: "pastilles contenues" },
        default: "line",
      }),
      activation: axe<TabsActivation>({
        kind: "enum",
        description: "Activation au déplacement du focus ou sur Entrée/Espace.",
        values: { auto: "au focus (défaut)", manual: "sur activation explicite" },
        default: "auto",
      }),
    },
    props: propsDe<TabsP>()({
      value: { type: "string", description: "Contrôlé (sinon defaultValue)." },
      defaultValue: { type: "string", description: "Onglet initial." },
      onValueChange: { type: "(v: string) => void", description: "Changement." },
      label: { type: "string", required: true, description: "Étiquette de la List (tablist)." },
      keepMounted: { type: "boolean", default: "false", description: "Panel monté même inactif." },
    }),
    accessibility: ["APG Tabs (flèches, Home/End)", "courant non chromatique", "voiles de débordement horizontaux"],
    antiPatterns: ["Des tabs pour une navigation de pages (→ Nav)", "un contenu par onglet sans rapport (les tabs = un même sujet)"],
    canonicalExamples: [
      {
        title: "Deux vues",
        code: `<Tabs.Root defaultValue="apercu">
  <Tabs.List label="Vues du composant">
    <Tabs.Tab value="apercu">Aperçu</Tabs.Tab>
    <Tabs.Tab value="code">Code</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="apercu">Le rendu.</Tabs.Panel>
  <Tabs.Panel value="code">L'extrait.</Tabs.Panel>
</Tabs.Root>`,
      },
    ],
  },
  {
    name: "ThemeToggle",
    package: "@fili/react",
    import: 'import { ThemeToggle } from "@fili/react";',
    status: "stable",
    category: "contrôle",
    purpose: "Interrupteur clair/sombre (soleil ↔ lune) — un Switch spécialisé de thème.",
    doctrine: null,
    dette: "Doctrine à écrire (vague 8) — spécialisation de SWITCH ; à trancher : fiche propre ou section de SWITCH-UX.",
    rules: null,
    axes: {
      size: axe<ThemeToggleSize>({
        kind: "size",
        description: "Taille de la piste.",
        values: { sm: "36px", md: "44px (défaut)", lg: "56px" },
        default: "md",
      }),
    },
    props: propsDe<ThemeToggleP>()({
      checked: { type: "boolean", required: true, description: "true = sombre." },
      onCheckedChange: { type: "(c: boolean) => void", required: true, description: "Bascule de thème." },
      label: { type: "ReactNode", description: "Libellé (sinon aria-label requis)." },
    }),
    accessibility: ["checkbox native sous-jacente (clavier gratuit)", "icônes ancrées sur la piste, jamais le label"],
    validation: {
      role: "none",
      justification:
        "Il rend bien une checkbox native, mais ce n'est pas une donnée soumise : c'est une PRÉFÉRENCE d'affichage à effet immédiat, comme un Switch. Aucune soumission ne l'attend, aucune contrainte ne peut le rendre fautif. La déclaration est ici parce que la garde structurelle du manifeste l'exige de tout composant qui rend un élément de formulaire — c'est exactement son rôle : forcer la décision, pas la deviner.",
    },
    antiPatterns: ["Le rendre décoratif (il doit réellement piloter data-theme)"],
    canonicalExamples: [
      { title: "Bascule de thème", code: `<ThemeToggle checked={false} onCheckedChange={() => {}} aria-label="Thème sombre" />` },
    ],
  },
  {
    name: "Toast",
    package: "@fili/react",
    import: 'import { Toast, useToast } from "@fili/react";',
    status: "stable",
    category: "message",
    purpose: "Notification éphémère, API impérative : useToast().toast({ title }) sous <Toast.Provider>. FIFO max 3, durée calculée, pause au survol/focus.",
    doctrine: { ux: "components/TOAST-UX.md", ui: "components/TOAST-UI.md" },
    rules: "RULES-toast.md",
    anatomy: anatomie<ToastC>("Toast", ["Provider"]),
    axes: {
      tone: axe<ToastTone>({
        kind: "tone",
        description: "Sémantique du message — neutral (inverse haute-contraste) par défaut. L'anneau des contrôles internes suit le tone (focus v2).",
        values: { info: "information", success: "confirmation (seul tone à illustration E-motion, seul en pile)", warning: "avertissement", danger: "erreur", neutral: "neutre inverse (défaut)" },
        default: "neutral",
      }),
      closing: axe<ToastClosing>({
        kind: "enum",
        description: "Mode de fermeture.",
        values: { auto: "timer + croix (défaut)", close: "croix seule", timer: "timer seul (barre visible)" },
        default: "auto",
      }),
    },
    props: propsDe<ToastP>()({
      title: { type: "ReactNode", required: true, description: "Obligatoire — le message." },
      description: { type: "ReactNode", description: "Complément." },
      action: { type: "{ label, onClick }", description: "UNE action tolérée (undo)." },
      placement: { type: "ToastPlacement", default: '"bottom"', description: "Sur le Provider (bottom | bottom-start/end | top | top-start/end)." },
    }),
    accessibility: ["pause au survol ET au focus", "jamais seul porteur d'une condition qui dure (→ Alert)"],
    antiPatterns: ["Toast d'erreur bloquante (→ Alert dans le flux)", "plus d'une action par toast"],
    canonicalExamples: [
      {
        title: "Provider en racine d'app",
        code: `<Toast.Provider placement="bottom-end">
  <p>App.</p>
</Toast.Provider>`,
      },
    ],
  },
  {
    name: "TableOfContents",
    package: "@fili/react",
    import: 'import { TableOfContents } from "@fili/react";',
    status: "stable",
    category: "navigation",
    purpose: "Sommaire scrollspy de page (IntersectionObserver, aria-current=location).",
    doctrine: { pattern: "patterns/NAVIGATION" },
    rules: null,
    props: propsDe<TocP>()({
      items: { type: "TocItem[]", required: true, description: "Ancres de la page ({ id, label, level })." },
      label: { type: "string", default: '"Sur cette page"', description: "Étiquette du landmark." },
    }),
    accessibility: ["landmark étiqueté", "aria-current=location sur l'ancre visible"],
    antiPatterns: ["Un sommaire à la main en <ul> + scroll listeners"],
    canonicalExamples: [
      { title: "Sommaire de page", code: `<TableOfContents items={[{ id: "usage", label: "Usage" }, { id: "api", label: "API" }]} />` },
    ],
  },
];
