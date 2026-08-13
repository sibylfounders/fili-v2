---
component: border
layer: ux
type: foundation
version: 1.4.0 # 1.4.0 : R06 — la couleur unique `accent` (essai du 2026-07-29 matin) cède à l'anneau SUBTIL ACCORDÉ à la bordure/état (crans tokenisés control.focus-*, défaut primary éclairci, arbitrage Aurélien 2026-07-29 après-midi, cf. DECISIONS.md) ; géométrie et mécanisme restent uniques et tokenisés. 1.3.0 : 1.3.0 : benchmark élargi à neuf systèmes (relevé du 2026-07-27, sources S12/S13) — R07 DÉCLASSÉE de « loi » à « préférence » (le terrain est partagé et la majorité fait l'inverse) ; R04 et R05 documentées comme positions minoritaires assumées, chiffres à l'appui ; R16 rattachée à la convergence de R02 ; deux normes ajoutées (WCAG 2.4.13 Focus Appearance, technique C40). Aucune règle inventée, deux règles reclassées. 1.2.0 : PILOTE « décisions sourcées » — chaque RÈGLE porte un identifiant stable (BORDER-Rnn), son STATUT de frontière et sa ou ses SOURCEs par référence dans la bibliographie de fin de fichier. Deux sources ajoutées (WCAG 2.4.7 focus visible, forced-colors) : elles étaient supposées, pas citées. Aucune règle modifiée sur le fond. Cf. DECISIONS.md 2026-07-26. 1.1.0 : ajout du contrat « focus non masqué » (WCAG 2.4.11) — trou P1 de l'inventaire transversal accessibilité, posé ici car cette fondation porte le focus ring (2026-07-14, cf. DECISIONS.md). 1.0.0 : première rédaction — inventaire et benchmark faits avant livraison ; fondation née d'un guardrail (DESIGN.md 1.4.1, décision F02) plutôt que d'un composant — trajectoire inverse de l'élévation
last_updated: 2026-07-27
companion: BORDER-UI.md
confidence: mixed # le critère délimitant/décoratif et le 3:1 sont établis et éprouvés (2 recalibrages) ; le focus unifié 2px/2px est une décision interne sourcée
---

# Bordure — Couche UX (fondation)

> Ce fichier contient le raisonnement : les rôles du trait, le critère délimitant/décoratif, le focus ring. Les valeurs (couleurs `border`/`border-strong`, largeurs de focus) vivent dans `DESIGN.md` ; la grammaire d'application vit dans `BORDER-UI.md`.

> **Lecture des décisions** — chaque règle porte un identifiant stable (`BORDER-Rnn`), un **statut de frontière** et ses **sources** (références `S1…S9` de la bibliographie en fin de fichier ; `interne` quand la décision est nôtre). Les quatre statuts : `propriété universelle` (vraie de tout produit — auditable chez un tiers), `parti pris d'identité` (notre choix, pas une norme — jamais imposé en audit), `implémentation de référence` (vrai de ce code, pas du design), `note de méthode` (hors audit).

## Note de transposition (à lire en premier)

RÈGLE [BORDER-R01] : la bordure est une **fondation** — le modèle à axes ne s'applique pas. Particularité de trajectoire : son cœur existait déjà en **guardrail** (DESIGN.md 1.4.1, née de la décision F02) — cette fondation développe le raisonnement du guardrail et récupère ce qu'il ne couvrait pas (séparateurs, focus, forced-colors). Le guardrail court de DESIGN.md reste en place : c'est la version opérationnelle de ce fichier.
STATUT : note de méthode
SOURCE : interne

RÈGLE [BORDER-R02] : un trait a **trois rôles**, et le rôle décide de tout (couleur, seuil, droit au retrait) :
  1. **Délimiter** — le trait est le *seul signal* qu'un composant interactif est là (input au repos, bouton secondary). Couleur `border-strong`, **3:1 obligatoire** (WCAG 1.4.11).
  2. **Grouper** — le trait aide à lire un contour que le contenu suffit à identifier (carte outlined). Couleur `border`, exemptée du seuil.
  3. **Séparer** — le trait divise deux zones (séparateurs, lignes de table). Couleur `border`, et il vient **en dernier** : l'espace d'abord, le fond ensuite, le trait en dernier recours (hiérarchie posée par SPACING-UX ; Polaris ne garde les dividers que dans les tables).
STATUT : propriété universelle
SOURCE : S2, S1, S6
ÉNONCÉ : Un trait doit avoir un rôle explicite — délimiter un élément interactif, grouper du contenu ou séparer deux zones. Le rôle décide de sa couleur et du contraste exigé.
POURQUOI : sans distinction de rôle, un même gris est traité partout pareil — soit on impose 3:1 à des traits décoratifs et le produit se durcit, soit on l'exempte partout et les champs deviennent invisibles.

RÈGLE [BORDER-R03] : le critère du rôle 1 reste la question du guardrail : **"si cette bordure disparaît, l'utilisateur sait-il encore où interagir ?"** Si non → délimitante → `border-strong`. Le test de rendu applique ce critère identiquement à tous les composants.
STATUT : propriété universelle
SOURCE : S1
ÉNONCÉ : Si un élément n'est identifiable que par sa bordure, cette bordure doit atteindre un contraste de 3:1 avec son fond.
MESURE : contraste bordure / fond ≥ 3:1

> **Pourquoi** : deux recalibrages ont été payés pour cette règle (bouton secondary en 1.3.0, input en F02) — un champ identifié par sa seule bordure à 1.24:1 est un champ invisible. La subtilité au repos y perd, assumé : "un champ qu'on ne voit pas est un champ qu'on ne remplit pas."

## Une seule épaisseur — et pourquoi

RÈGLE [BORDER-R04] : **le trait de ce système a une épaisseur constante : le hairline 1px** — exception documentée (au même titre que le 44px tactile), pas un token d'échelle. Il n'existe pas d'échelle d'épaisseurs parce que **l'état change la couleur du trait, jamais son épaisseur**.
STATUT : parti pris d'identité
SOURCE : S12, interne
CONTRE : sept systèmes sur neuf relevés exposent une ÉCHELLE d'épaisseurs tokenisée (Atlassian, Material 3, Carbon, Polaris, Fluent 2, Spectrum, Ant Design). Aucun système vérifié ne tient l'épaisseur unique — nous sommes seuls sur cette position, et c'est un choix, pas un standard.
ÉNONCÉ : Nous utilisons une seule épaisseur de trait, 1px, partout.
MESURE : épaisseur du trait = 1px
POURQUOI : une échelle d'épaisseurs invite à distinguer les états par le trait — ce que la couleur fait déjà, sans coût de mise en page.

RÈGLE [BORDER-R05] : un trait qui s'épaissit à l'état (error, selected, focus) déplace le contenu (layout shift) ou exige une compensation fragile ; la couleur et le ring font le même travail sans bouger un pixel. **Position minoritaire, tenue en connaissance de cause** : le relevé du 2026-07-27 montre que six systèmes sur neuf épaississent le trait à l'état (Atlassian 2px, Material 3 focus 3px, Carbon 1→2px, Fluent 2 bottom 2px, Spectrum, Ant Design `lineWidthFocus` 3). Nous divergeons parce que notre sélection porte déjà un canal redondant non chromatique (coche, CARD-UI) et que notre focus est un ring *externe* : l'épaississement ne nous apporterait qu'un décalage de mise en page.
STATUT : parti pris d'identité
SOURCE : S12, S7
CONTRE : six systèmes sur neuf relevés font l'inverse et épaississent le trait à l'état. C'est la pratique majoritaire du secteur ; notre position est minoritaire et assumée.
ÉNONCÉ : Nous ne changeons jamais l'épaisseur d'un trait pour signaler un état : la couleur s'en charge, et le contenu ne bouge pas.
MESURE : épaisseur identique au repos et à l'état

> **Erreur fréquente** : bordure 1px → 2px au focus "pour bien la voir" — le composant saute d'un pixel, et le focus devient un état *du trait* alors qu'il est un état *de l'élément* (le ring survit même sans bordure — un lien, une carte).

## Le focus ring — l'ancienne déduction silencieuse

RÈGLE [BORDER-R06] : le focus ring est **unifié pour tout le système** dans sa GÉOMÉTRIE et son MÉCANISME : largeur et écart tokenisés (`border.focus-width`, `border.focus-offset`), outline extérieur, définis une seule fois. Sa COULEUR est un anneau **subtil accordé à la bordure/état du composant** (crans `control.focus-*` : défaut primary éclairci ; error→danger, destructive→danger, success/warning/info/neutral idem — arbitrage 2026-07-29, remplace la couleur unique `accent` de la 1.3.0). Trois composants déclaraient la couleur du ring et laissaient largeur/écart en déduction silencieuse — la déduction silencieuse reste interdite : chaque cran de couleur est un token.
STATUT : parti pris d'identité
SOURCE : S10, S3, S1
ÉNONCÉ : Notre anneau de focus partage partout la même géométrie et le même mécanisme, définis une seule fois ; sa couleur est un cran subtil tokenisé, accordé à la bordure ou à l'état du composant, avec le primary éclairci pour défaut.
POURQUOI : un ring déduit composant par composant dérive — trois largeurs, trois écarts, et plus aucun moyen de le vérifier mécaniquement.

RÈGLE [BORDER-R07] : le ring **s'ajoute, il ne remplace pas** : posé *à l'extérieur* du composant (offset), il coexiste avec la bordure d'état (un input en error focalisé montre les deux — ring accent dehors, bordure danger dedans, discernables simultanément).
STATUT : parti pris d'identité
SOURCE : S13, S3
CONTRE : le relevé du 2026-07-27 donne le terrain **partagé, et plutôt contre nous** — quatre systèmes remplacent la bordure d'état par l'anneau au focus (Carbon, Primer, GOV.UK, Fluent 2 partiellement), deux la conservent et superposent l'anneau (Spectrum, Salesforce). Aucune norme ne tranche : WCAG 2.4.7 est agnostique, 2.4.13 fixe des seuils sans imposer la technique. Classée « loi » jusqu'au 2026-07-27, déclassée en préférence après vérification.
ÉNONCÉ : Chez nous, l'anneau de focus s'ajoute à la bordure existante plutôt que de la remplacer — les deux restent lisibles ensemble.

RÈGLE [BORDER-R08] : **jamais supprimé sans remplacement équivalent** — règle déjà présente dans les trois composants, centralisée ici.
STATUT : propriété universelle
SOURCE : S8
ÉNONCÉ : L'indicateur de focus ne doit jamais être supprimé sans un remplacement au moins aussi visible.
MESURE : aucun outline supprimé sans équivalent ≥ 3:1
POURQUOI : `outline: none` posé pour « faire propre » rend la navigation clavier aveugle — c'est la première cause d'exclusion clavier constatée en audit.

RÈGLE [BORDER-R09] : un focus visible ne suffit pas s'il est **masqué** : la cible focalisée ne doit jamais être cachée, même partiellement, par un élément collant (en-tête sticky) ou superposé (WCAG 2.4.11 « Focus Not Obscured »). Le contrat est posé ici parce que le ring relève de cette fondation ; sa mise en œuvre revient au composant qui superpose (sticky, tiroir, modal), qui doit réserver la place ou décaler le défilement pour que l'anneau reste entièrement visible.
STATUT : propriété universelle
SOURCE : S5
ÉNONCÉ : L'élément qui a le focus ne doit jamais être masqué, même en partie, par un en-tête collant ou un élément superposé.

> **Pourquoi** : un ring parfaitement dessiné mais à moitié sous un header collant laisse l'utilisateur clavier sans repère — « visible » au sens du style, « masqué » au sens de l'usage. C'est la déclinaison spatiale de la non-suppression : ne pas retirer le focus, et ne pas le cacher non plus.

RÈGLE [BORDER-R10] : le focus apparaît **sans délai ni animation** — c'est une information de position pour la navigation clavier, pas un effet (frontière avec MOTION-UX, qui l'inscrit dans ses interdits).
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, l'anneau de focus apparaît instantanément, sans animation.

RÈGLE [BORDER-R11] : limite connue — un ring monochrome peut se fondre dans un fond de même famille ; GOV.UK résout par un focus bicolore (jaune + noir). Ici, les fonds d'usage (background, surface) garantissent le 3:1 de l'accent ; le jour où un composant focalisable vit sur un fond arbitraire (media, surface-contrast), la question bicolore se rouvre.
STATUT : parti pris d'identité
SOURCE : S11, S4
ÉNONCÉ : Notre anneau est d'une seule couleur : sur un fond imprévisible il peut se fondre, et nous ne traitons pas encore ce cas.

CONFIANCE : établi (3:1, non-suppression) ; le choix 2px/2px est une convention interne sourcée sur Atlassian, pas une norme.

## Ce qui survit quand tout tombe

RÈGLE [BORDER-R12] : la bordure est le signal qui **survit à forced-colors** — le mode contraste élevé supprime fonds et ombres mais *préserve et recolore* les traits. C'est l'argument de fond du rôle délimitant : dans l'environnement le plus dégradé, le trait est ce qui reste.
STATUT : propriété universelle
SOURCE : S9
ÉNONCÉ : Une information portée par un fond ou une ombre disparaît en mode contraste forcé ; le trait, lui, survit — c'est sur lui qu'il faut compter.

RÈGLE [BORDER-R13] : écrans haute densité — le hairline reste **1px CSS** ; pas de 0.5px physique (rendu inégal entre navigateurs et plateformes). Le trait en px ne suit pas le zoom texte — même position que l'espacement (SPACING-UX), le trait n'est pas du texte.
STATUT : implémentation de référence
SOURCE : interne
ÉNONCÉ : Le trait reste à 1px CSS, y compris sur écran haute densité.
MESURE : 1px CSS, jamais 0.5px

## La bordure dans le temps

RÈGLE [BORDER-R14] : écrit d'office (prédicteur "état transitoire") : les changements de couleur du trait (repos → error, repos → hover renforcé de la carte) transitionnent sur `motion.fast` ; l'apparition du **ring de focus est exclue de toute transition** (cf. ci-dessus). Une bordure qui apparaît/disparaît entièrement (encart dynamique) suit la règle de réservation d'espace de SPACING-UX — le trait fait partie de la boîte.
STATUT : implémentation de référence
SOURCE : interne
ÉNONCÉ : Les changements de couleur d'un trait s'animent ; l'apparition de l'anneau de focus, jamais.

## Risque

RÈGLE [BORDER-R15] : table ci-dessous
STATUT : note de méthode
SOURCE : interne

| Cas | Risque principal | Sévérité |
|---|---|---|
| Bordure délimitante sous 3:1 | Composant interactif invisible (WCAG 1.4.11) — deux précédents payés | Critique |
| Focus supprimé sans remplacement | Navigation clavier aveugle — exclusion | Critique |
| Cible focalisée cachée par un sticky/superposé | Focus invisible en usage clavier (WCAG 2.4.11) | Élevée |
| Épaisseur qui change à l'état | Layout shift, focus confondu avec un état du trait | Moyenne à élevée |
| Ring fondu dans le fond | Focus invisible sur fond non prévu | Moyenne à élevée |
| Sur-bordage (traits partout) | Bruit, hiérarchie spatiale illisible — l'espace devait suffire | Moyenne |
| Rôles confondus (décorative promue délimitante sans seuil) | Le guardrail fuit — retour au cas F02 | Moyenne |

## Règle transversale

RÈGLE [BORDER-R16] : **le rôle du trait décide de tout — un même pixel gris n'a ni la même couleur, ni le même seuil, ni le même droit au retrait selon qu'il délimite, groupe ou sépare.**
STATUT : propriété universelle
SOURCE : S2, interne
ÉNONCÉ : Un même gris n'a pas le même statut selon qu'il délimite, groupe ou sépare : c'est l'usage qui décide, pas la valeur.

> **Pourquoi** : c'est le principe des registres (COLOR-UX) appliqué au trait : la valeur ne dit rien, l'usage dit tout.

## Sources et niveau de confiance

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| S1 | 3:1 sur les composants d'interface identifiés par leur trait | [WCAG 2.1 — 1.4.11](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html) ; [Atlassian — Border](https://atlassian.design/foundations/border) (bordure accent sur fonds subtils pour atteindre 3:1) | Établi, standard d'accessibilité — éprouvé ici par F02 |
| S2 | Rôles du trait tokenisés (délimiter un interactif vs grouper/séparer) | [Carbon](https://carbondesignsystem.com/elements/color/tokens/) (`border-interactive` 3:1 vs `border-subtle-0X` décoratif) ; [Material 3](https://github.com/material-components/material-web) (`outline` vs `outline-variant`, ce dernier pour les séparateurs décoratifs) ; [Fluent 2](https://fluent2.microsoft.design/color-tokens/) (`colorNeutralStrokeAccessible` vs `colorNeutralStrokeSubtle`) ; [GOV.UK](https://design-system.service.gov.uk/styles/colour/) (`border` #cecece vs `input-border` #0b0c0c) ; [Polaris](https://polaris-react.shopify.com/components/layout-and-structure/divider), [Primer](https://primer.style/foundations/color/overview/), [Atlassian](https://atlassian.design/foundations/border) | **Établi par convergence — 7 systèmes sur 9 vérifiés** (relevé du 2026-07-27). C'est la règle la mieux établie de cette fondation. |
| S3 | Focus 2px avec écart, appairé largeur/couleur | [Atlassian — Border](https://atlassian.design/foundations/border) (border.width.focused 2px + color.border.focused) | Établi chez Atlassian ; adoption interne |
| S4 | Focus bicolore pour fonds variables | [GOV.UK — Focus states](https://design-system.service.gov.uk/get-started/focus-states/) | Établi chez GOV.UK — noté comme issue de secours, non adopté |
| S5 | Focus non masqué par les superposés (sticky, overlay) | [WCAG 2.2 — 2.4.11 Focus Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html) | Établi, standard (2.2) — le Modal est désormais le premier consommateur superposé |
| S6 | Séparateurs en dernier recours | [Polaris — Spacial organization](https://polaris-react.shopify.com/design/layout/spacial-organization) | Établi chez Polaris, adopté ici |
| S7 | Épaisseurs d'état à 2px (choix inverse du nôtre) | [Atlassian — Border](https://atlassian.design/foundations/border) | Établi chez Atlassian — cas particulier du relevé S12 |
| S10 | Seuils quantitatifs de l'anneau de focus : aire ≥ périmètre de 2px CSS, contraste ≥ 3:1 entre état focalisé et non focalisé ; technique libre (outline, box-shadow, bordure) | [WCAG 2.2 — 2.4.13 Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html) | Établi, standard (AAA) — ajoutée le 2026-07-27 : nos règles de focus s'appuyaient sur une convergence de systèmes alors qu'une norme quantitative existait |
| S11 | Anneau bicolore : deux couleurs contrastées entre elles ≥ 9:1 pour qu'au moins l'une tienne 3:1 sur tout fond uni — sans garantie sur image ou dégradé | [WCAG — Technique C40](https://www.w3.org/WAI/WCAG21/Techniques/css/C40) ; [GOV.UK — Focus states](https://design-system.service.gov.uk/get-started/focus-states/) | Établi, technique référencée — remplace le simple renvoi à GOV.UK |
| S12 | **Relevé de benchmark, 2026-07-27 — épaisseur du trait.** Question 1 : épaisseur unique ou échelle tokenisée ? Question 2 : l'état modifie-t-il l'épaisseur ? Neuf systèmes interrogés : Atlassian, Material 3, Carbon, Polaris, Fluent 2, Spectrum, Primer, Salesforce, Ant Design. Résultat : **7/9 exposent une échelle** (aucun ne tient l'épaisseur unique) ; **6/9 épaississent le trait à l'état**. Détail et URL dans la section « Benchmark » ci-dessous. | Relevé interne sur sources primaires (documentation officielle et dépôts de tokens) | Établi — mesuré, non déduit. Deux systèmes non vérifiables (Primer, Salesforce : documentation en JavaScript, aucune source primaire accessible) |
| S13 | **Relevé de benchmark, 2026-07-27 — anneau de focus et bordure d'état.** Quand un champ en erreur reçoit le focus, l'anneau s'ajoute-t-il à la bordure rouge ou la remplace-t-il ? Huit systèmes interrogés. Résultat : **4 remplacent** (Carbon, Primer, GOV.UK, Fluent 2 partiellement), **2 conservent et superposent** (Spectrum, Salesforce), 2 non vérifiables (Material 3, Polaris). Aucune convergence. | Relevé interne sur sources primaires (feuilles de style publiées) | Établi — mesuré. C'est ce relevé qui a fait déclasser R07 de « loi » à « préférence » |
| S8 | Un focus clavier doit rester visible — ne jamais supprimer l'indicateur sans équivalent | [WCAG 2.2 — 2.4.7 Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html) | Établi, standard (AA) — ajoutée en 1.2.0 : la règle R08 s'appuyait dessus sans la citer |
| S9 | Le mode contraste forcé conserve et recolore les bordures, mais supprime fonds et ombres | [MDN — forced-colors](https://developer.mozilla.org/docs/Web/CSS/@media/forced-colors) ; [Microsoft — Windows High Contrast](https://learn.microsoft.com/windows/apps/design/accessibility/high-contrast-themes) | Établi — ajoutée en 1.2.0 : la règle R12 était une affirmation non sourcée |

## Benchmark — relevé du 2026-07-27

> Le panel est affiché pour que personne n'ait à nous croire sur parole : ce sont les sources qu'un
> contradicteur irait lire, et ce qu'elles disent réellement, y compris quand elles nous contredisent.

**Épaisseur du trait — échelle tokenisée (7/9) contre épaisseur unique (0/9)**

| Système | Constat | Source |
|---|---|---|
| Atlassian | `border.width` 1px, `.selected` 2px, `.focused` 2px | atlassian.design/foundations/border |
| Material 3 | `focus-outline-width` 3px, distinct de la largeur par défaut | material-web, tokens du champ texte |
| Carbon | champ texte 1px, 2px au focus | v10.carbondesignsystem.com/components/text-input/style/ |
| Polaris | `--p-border-width-0` → `-100` (0 à 4px) | polaris-react.shopify.com/tokens/border |
| Fluent 2 | `strokeWidthThin/Thick/Thicker/Thickest` (1 à 4px) | github.com/microsoft/fluentui, tokens strokeWidths |
| Spectrum | `border-width-100`, `-200` | opensource.adobe.com/spectrum-design-data/tokens |
| Ant Design | `lineWidth` 1, `lineWidthBold` 2, `lineWidthFocus` 3 | ant.design/docs/react/customize-theme |
| Primer, Salesforce | non vérifiables (documentation en JavaScript, aucune source primaire accessible) | — |

**Anneau de focus sur un champ en erreur — remplace (4) contre s'ajoute (2)**

| Système | Constat | Source |
|---|---|---|
| Carbon | `[data-invalid]:focus-within` bascule l'anneau rouge vers l'anneau bleu — remplace | @carbon/styles, `_text-input.scss` |
| Primer | la bordure d'erreur est désactivée dès le focus (`:not(:focus)`) — remplace | @primer/css, `forms.css` |
| GOV.UK | la bordure d'erreur reprend sa couleur normale au focus — remplace | govuk-frontend, `_index.scss` de l'input |
| Fluent 2 | bordure d'erreur conditionnée à `:not(:focus-within)` — remplace (un composant vérifié) | react-input, `useInputStyles.styles.ts` |
| Spectrum | `border-color-invalid` persiste, `outline` dessiné en plus — s'ajoute | spectrum-css, `textfield/index.css` |
| Salesforce | bordure d'erreur conservée + ombre de focus superposée — s'ajoute | salesforce-ux/design-system, input `_index.scss` |
| Material 3, Polaris | non vérifiables | — |

**Anneau bicolore pour fond imprévisible** — prévu chez GOV.UK et décrit par la technique WCAG C40 ; monochrome chez Carbon, Polaris, Fluent 2, Primer, Atlassian. Notre position (monochrome) est majoritaire, et la sortie de secours est documentée.

## À approfondir

- **Trait dashed/dotted** (zone de dépôt de fichier) : naîtra avec le premier consommateur upload.
- **Focus sur fond arbitraire** (media, surface-contrast) : rouvrir la question bicolore GOV.UK.
- **Bordures en dark mode** : les valeurs changeront, les rôles et seuils non (même mécanique que COLOR-UX).
