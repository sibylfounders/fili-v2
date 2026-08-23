---
component: typography
layer: ux
type: foundation # une contrainte transversale, pas un composant ni un pattern
version: 2.0.0 # 2.0.0 : reprise au moule V2 après la séance de passage du 23 août 2026 (journal #105) — 31 lois vivantes deviennent 1 principe de tête, 11 règles de code (T1–T11, T11 nouvelle : la fonte déclarée est la fonte livrée), 2 mesures de rendu (M1–M2), 1 couverture Gardien et une référence ; onze règles gardées sur onze en séance ; les 4 CRITERE de la 1.4.0 sont conservés à l'identique. Historique antérieur : voir 1.4.0 dans l'historique git.
last_updated: 2026-08-23
companion: TYPOGRAPHY-UI.md
confidence: mixed # la hiérarchie et la mesure sont établies ; la typographie fluide contient un point activement débattu, marqué comme tel (M1)
---

# Typographie — Couche UX (fondation) · moule V2

> Ce fichier contient les règles et leur raisonnement. Les **valeurs** (familles de
> caractères, échelle des corps, mesure exacte, interlignages) vivent **au registre,
> arbitrées par l'Auteur** — jamais importées d'une source comme si la source les
> exigeait (verrou du périmètre arbitré, `claude/sources-typographie-arbitrees.md`).
> Séance de passage du 23 août 2026 : onze règles gardées sur onze.

## 1 · Le principe de tête

RÈGLE [TYPOGRAPHY-P01] : **le sens et la lisibilité sont deux décisions séparées, et indépendantes.**
STATUT : principe de tête (provenance : R04 + R34 du fonds 1.4.0 ; R03 en cadre)
SOURCE : S6, S7, S15
ÉNONCÉ : Le niveau d'un titre suit la structure du contenu (l'arbre que le lecteur d'écran navigue) ; sa taille suit le design. Un h2 peut légitimement être rendu plus petit qu'un h3 — et aucune des deux décisions ne se prend à la place de l'autre.
VERDICT : gardé — séance de passage du 23 août 2026.

## 2 · Les onze règles (vérifiables dans le code)

### RÈGLE [TYPOGRAPHY-T1] — Jamais de saut de niveau

STATUT : propriété universelle (provenance : R07)
SOURCE : S15, S6
ÉNONCÉ : Les niveaux de titre se suivent sans saut — un niveau n n'est jamais suivi directement d'un niveau n+2.
MESURE : aucun saut de niveau de titre (h2 → h4)
CRITERE : suite("h1,h2,h3,h4,h5,h6") sans_saut
TEST : piégée — un h4 sous un h2 → rouge ; mutation sur la détection.
DÉPENDANCE : aucune — lisible dans toute structure.
VERDICT : gardée — séance du 23 août 2026.

> **Pourquoi** : un saut casse l'arbre pour la navigation par titres — l'utilisateur de lecteur d'écran conclut à du contenu manquant — sans aucun bénéfice en échange.

### RÈGLE [TYPOGRAPHY-T2] — La taille glisse

STATUT : parti pris d'identité (provenance : R10 — le jumeau typographique de SPACING-Y8)
SOURCE : S2
ÉNONCÉ : Les tailles de texte varient continûment entre une borne minimale et une borne maximale selon la largeur du viewport — pas de paliers de media queries. La variation vit dans le jeton, jamais dans un écran particulier.
MESURE : toute taille responsive est déclarée par ses deux bornes au registre ; aucune surcharge de corps en requête média.
TEST : piégée — un font-size redéfini sous media query → rouge.
DÉPENDANCE : le fichier de jetons.
VERDICT : gardée — séance du 23 août 2026 (cohérente avec le verdict Y8 du rythme, même jour).

### RÈGLE [TYPOGRAPHY-T3] — Le zoom garde ses droits

STATUT : propriété universelle (provenance : R11 + R12, même exigence en deux temps)
SOURCE : S1, S2, S13, S16
ÉNONCÉ : Une taille de texte ne s'exprime jamais en unités viewport seules — l'utilisateur zoome, la fenêtre ne bouge pas, le texte ne grandit pas : échec d'accessibilité silencieux. Toute taille fluide combine rem et vw, avec une composante rem dans le minimum, le maximum et la partie fixe de la valeur préférée.
MESURE : aucune taille de police exprimée en unités viewport seules
CRITERE : aucune_valeur("font-size") unites_seules(vw|vh|vmin|vmax)
MESURE : chaque clamp() de taille contient une composante rem dans le minimum, le maximum et la partie fixe
CRITERE : chaque_valeur("font-size") clamp_avec_rem()
TEST : piégée — font-size: 4vw → rouge ; piégée — clamp(2rem, 4vw, 3rem) sans rem dans la partie préférée → rouge ; mutation sur les deux.
DÉPENDANCE : aucune.
VERDICT : gardée — séance du 23 août 2026.

> **Pourquoi** : le zoom du navigateur n'affecte pas les unités viewport. La composante rem répond au zoom, la composante vw porte la fluidité — il faut les deux, partout dans la formule.

### RÈGLE [TYPOGRAPHY-T4] — Un échelon ne s'étire jamais au-delà de 2,5×

STATUT : parti pris d'identité (provenance : R14)
SOURCE : S4, S13
ÉNONCÉ : Le rapport entre la taille maximale et la taille minimale d'un même échelon ne dépasse pas 2,5 — le garde-fou qui permet au texte d'atteindre ses 200 % de zoom sur les plages de viewport usuelles.
MESURE : ratio taille maximale / taille minimale ≤ 2,5 par échelon, calculé sur les bornes
TEST : piégée — un échelon 1rem → 3rem → rouge par calcul.
DÉPENDANCE : le fichier de jetons.
VERDICT : gardée — séance du 23 août 2026.

### RÈGLE [TYPOGRAPHY-T5] — Qui glisse se borne

STATUT : parti pris d'identité (provenance : R17 + la moitié code de R16)
SOURCE : S5, S9, S21
ÉNONCÉ : Tout bloc de texte courant porte une largeur maximale exprimée en ch — jamais en pixels. La fluidité de la taille sans le bornage de la mesure dégrade la lecture qu'elle devait servir : la taille monte en butée pendant que la ligne s'allonge.
MESURE : tout bloc de texte courant porte une max-width en ch, résolvant un jeton de mesure
TEST : piégée — un paragraphe fluide sans max-width → rouge ; piégée — une mesure en px → rouge.
DÉPENDANCE : le jeton de mesure — valeur au registre, arbitrage d'Auteur. La règle ne porte pas le nombre : les plages publiées divergent (45–75 Bringhurst, 40–60 Material) et le verrou du périmètre exige une valeur arbitrée, citée comme motif, jamais comme exigence de la source. La plage effective se contrôle au rendu (M2).
VERDICT : gardée — séance du 23 août 2026.

> **Nuance S21** : l'unité ch mesure la chasse du glyphe « 0 » — une max-width de 65ch laisse passer nettement plus de 65 caractères. Raison de plus pour contrôler la mesure effective au rendu (M2) plutôt que de croire la déclaration.

### RÈGLE [TYPOGRAPHY-T6] — Le texte courant respire à 1,5 minimum

STATUT : propriété universelle (provenance : R18 — le pont promis par le rythme, SPACING-Y4)
SOURCE : S9, S14, S17, S8
ÉNONCÉ : Le texte courant est composé avec un interlignage d'au moins 1,5 fois le corps ; les grands corps peuvent serrer — un titre n'a pas besoin de l'air d'un paragraphe.
MESURE : interlignage ≥ 1,5 sur les jetons de texte courant
TEST : piégée — un corps de lecture à 1,3 → rouge.
DÉPENDANCE : le fichier de jetons.
VERDICT : gardée — séance du 23 août 2026.

> **Question consignée, non tranchée** : la direction « plus le corps grandit, plus l'interligne serre » ne peut s'écrire que par régime déclaré — écrite globalement, elle bloquerait l'échelle actuelle elle-même. Affaire de registre, dite dans le périmètre arbitré.

### RÈGLE [TYPOGRAPHY-T7] — Le demi-gras porte les titres, jamais le texte long

STATUT : parti pris d'identité (provenance : R22)
SOURCE : S10
ÉNONCÉ : Les graisses semi-grasses portent les titres et jamais le texte long ; et aucune graisse plus fine que la standard sous le corps courant — la finesse en petit corps dégrade le contraste effectif du trait.
MESURE : aucune graisse inférieure à la graisse standard sous l'équivalent 16 px ; aucun bloc de texte long en graisse semi-grasse
TEST : piégée — un paragraphe entier en 600 → rouge ; piégée — un light à 13 px → rouge.
DÉPENDANCE : les jetons de texte (les rôles « texte long » déclarés au registre).
VERDICT : gardée — séance du 23 août 2026.

### RÈGLE [TYPOGRAPHY-T8] — Les capitales : brèves, espacées, jamais tapées

STATUT : parti pris d'identité (provenance : R25 + R26)
SOURCE : S8, S18
ÉNONCÉ : La casse haute est réservée aux étiquettes brèves, jamais au texte courant ; toujours accompagnée d'un interlettrage de 5 à 12 % du corps ; et toujours appliquée par la feuille de style — le contenu source reste en casse normale pour le copier-coller et la lecture assistée.
MESURE : text-transform: uppercase uniquement sur des rôles d'étiquette, avec letter-spacing entre 0,05em et 0,12em ; aucune chaîne de contenu saisie tout en capitales
TEST : piégée — un paragraphe en capitales tapées → rouge ; piégée — un uppercase sans interlettrage → rouge.
DÉPENDANCE : les rôles de texte au registre.
VERDICT : gardée — séance du 23 août 2026.

> **Nuance S18** : la source établit la charge cognitive (dyslexie), pas un effet lecteur d'écran — l'argument du fonds 1.4.0 est corrigé ici : la casse par la feuille de style protège d'abord le contenu source (copier-coller, indexation, traduction).

### RÈGLE [TYPOGRAPHY-T9] — Fer à gauche, jamais justifié, centré réservé

STATUT : parti pris d'identité (provenance : R27 + R28 + R29)
SOURCE : S8, S9
ÉNONCÉ : Le texte s'aligne sur le bord de début de ligne par défaut — le retour à la ligne régulier est le repère de lecture ; le texte d'interface n'est jamais justifié ; le centrage est réservé aux titres courts et aux moments éditoriaux, jamais à un paragraphe.
MESURE : text-align par défaut = start ; aucun bloc en text-align: justify ; aucun paragraphe en text-align: center
TEST : piégée — un paragraphe justifié → rouge ; piégée — un paragraphe centré → rouge.
DÉPENDANCE : aucune.
VERDICT : gardée — séance du 23 août 2026.

> **Tension de source consignée** : les études empiriques sur la justification sont déclarées non concluantes par le fonds lui-même — la règle ne tient pas sur elles. Elle tient sur WCAG 1.4.8 (qui exclut le justifié) et sur les rivières d'espace sans césure fiable. Dit, pas caché.

### RÈGLE [TYPOGRAPHY-T10] — Jamais sous l'équivalent 16 px

STATUT : parti pris d'identité (provenance : R30 + R31)
SOURCE : S8, S12, S16, S22
ÉNONCÉ : Le texte courant ne descend jamais sous l'équivalent de 16 px et s'exprime en rem ; les champs de saisie non plus — sous 16 px, Safari iOS zoome la page au focus : comportement de plateforme, pas décision esthétique.
MESURE : taille du texte courant ≥ 16 px d'équivalent, exprimée en rem ; font-size des champs de saisie ≥ 16 px d'équivalent
TEST : piégée — un corps à 0,875rem déclaré « texte courant » → rouge ; piégée — un input à 14 px → rouge.
DÉPENDANCE : les rôles de texte au registre.
VERDICT : gardée — séance du 23 août 2026.

### RÈGLE [TYPOGRAPHY-T11] — La fonte déclarée est la fonte livrée

STATUT : propriété universelle (NOUVELLE — périmètre arbitré §2.1 + leçon du témoin, journal #058)
SOURCE : interne (incident documenté : dix-sept témoins en police système, en silence) ; table de risques (polices non embarquées)
ÉNONCÉ : Toute famille de caractères déclarée est appariée à un fichier de fonte versé au dépôt dont le nom de famille correspond exactement à ce que les styles réclament, avec une pile de secours déclarée. Un nom qui ne correspond pas ne produit aucune erreur : il produit un produit entier en police système, en silence.
MESURE : chaque font-family employé résout une déclaration @font-face présente au dépôt, au nom strictement identique ; chaque pile déclare sa secours ; aucun nom de famille orphelin
TEST : piégée — déclarer « Geist » quand le fichier livre « Geist Variable » → rouge ; piégée — une famille sans pile de secours → rouge ; mutation sur la comparaison des noms.
DÉPENDANCE : les fichiers de fonte versés au dépôt. Sans eux, refus de statuer — la dette de rendu du périmètre arbitré est reclassée en dépendance d'assertion.
VERDICT : gardée (naissance) — séance du 23 août 2026. Arbitrage de registre du même jour : familles du kit = Geist (interface) + JetBrains Mono (code), versées au dépôt du kit.

## 3 · Les deux mesures de rendu (pour le futur instrument)

RÈGLE [TYPOGRAPHY-M1] — Le zoom réel
STATUT : mesure de rendu (provenance : R13)
SOURCE : S3, S13, S19
ÉNONCÉ : La conformité au redimensionnement du texte se vérifie par un test de zoom navigateur réel, et non par la seule forme de la formule ni par un redimensionnement de fenêtre.
MESURE : à 200 % de zoom navigateur, la taille rendue a doublé sans perte de contenu ni défilement à deux dimensions
CONFIANCE : la limite est démontrée mathématiquement (S3) mais émergente/débattue — d'où la mesure au rendu plutôt qu'une règle de code.
VERDICT : gardée — séance du 23 août 2026.

RÈGLE [TYPOGRAPHY-M2] — La mesure effective
STATUT : mesure de rendu (provenance : la moitié rendu de R16)
SOURCE : S5, S9, S21
ÉNONCÉ : La longueur de ligne effective du texte courant tombe dans la plage arbitrée au registre, mesurée en caractères sur la page rendue — parce qu'une max-width en ch ne garantit pas le compte de caractères qu'elle annonce (S21).
MESURE : longueur de ligne effective du texte courant dans la plage du registre, comptée sur la page rendue
VERDICT : gardée — séance du 23 août 2026.

## 4 · Déjà couvert par le Gardien — dit une fois, avec la nuance

RÈGLE [TYPOGRAPHY-G1] : **exactement un h1 par page** — c'est le titre du document, pas le plus gros texte de la page. Ni deux, ni zéro.
STATUT : propriété universelle (provenance : R06), couverte par l'assertion S5 du Gardien
SOURCE : S15, S6
ÉNONCÉ : Une page comporte exactement un titre de niveau 1, qui est le titre du document.
MESURE : exactement un élément h1 par page
CRITERE : compte("h1") == 1
VERDICT : gardée — séance du 23 août 2026.

> **Pourquoi la présence, et pas seulement l'unicité** : le référencement lit le h1 comme le sujet de la page — l'absence coûte autant que la duplication (arbitrage Aurélien, 2026-07-31, motif SEO). Et cette obligation ne dit rien du graphisme : par le principe de tête, le h1 peut légitimement être rendu plus petit qu'un h2.

## 5 · La référence (hors règles — principes et jugements)

- **Les deux fonctions** *(R03)* : le sens (structure h1-h6) et la lisibilité (conditions physiques de lecture) — le cadre de la famille, porté par le principe de tête.
- **Le niveau suit la structure, jamais le style** *(R05, R08, R09)* : trois jugements de contenu — un texte qui doit *avoir l'air* d'un titre sans en être un prend son style sur un élément non-titre (le hero marketing n'est pas le h1 du document).
- **L'interligne est une fonction, pas une constante** *(R19)* : il se détermine par le corps et l'usage.
- **La hiérarchie se construit par combinaison** *(R20, R21)* : corps, graisse, position — jamais la graisse seule ; une graisse légère peut dominer une grasse si son corps est nettement supérieur.
- **Le gras avec parcimonie** *(R23)* : réservé à l'information critique ; gras et italique jamais ensemble — si tout est important, rien ne l'est.
- **Sentence case** *(R24)* : décision prise une fois pour tout le produit — indécidable par machine (noms propres, langues), affaire de relecture.
- **Quatre échelons suffisent** *(R32)* : des h5/h6 récurrents signalent une structure à réorganiser, pas un besoin de styles.
- **Les résultats négatifs du périmètre arbitré**, qui ferment des questions : la *readability* n'est pas mesurable par machine sans mentir ; l'espace-mot n'est pas normé ; aucun corpus n'est agnostique du système d'écriture — hors écriture latine, on refuse de statuer, on ne « tolère » pas.
- **Notes de méthode du fonds** *(R01 jetée, R02, R15 fusionnée dans T5/M2)* : la typographie est une fondation transversale sans axes de variantes — conservé comme cadre, plus comme règles numérotées.

## 6 · La table de risques *(R33 — grille de relecture ; chaque risque renvoie à une règle ou une mesure)*

| Cas | Risque principal | Sévérité | Tenu par |
|---|---|---|---|
| Texte en vw seul (sans composante rem) | Zoom navigateur sans effet — échec WCAG 1.4.4 | Critique | T3 |
| Sauts de niveaux de titres (h2 → h4) | Arbre de navigation cassé, contenu perçu comme manquant | Élevée | T1 |
| Plusieurs h1, zéro h1, ou h1 décoratif de hero | Titre réel du document illisible (AT, SEO, sommaire) | Moyenne à élevée | G1 + référence R09 |
| Fluid type non testé au zoom (seulement au resize) | Échec 1.4.4 invisible en test standard | Élevée | M1 |
| Texte courant sans max-width sur grand écran | Mesure dégradée, fatigue | Moyenne | T5 + M2 |
| Polices non embarquées, nom de famille orphelin, pile absente | Produit entier en police système, en silence | Élevée | T11 |
| Texte justifié sans césure | Rivières d'espace, lecture hachée | Moyenne | T9 |
| Capitales sur du texte courant | Silhouette de mot perdue, lecture épelée | Moyenne | T8 |
| Graisse light en petit corps | Contraste effectif du trait dégradé | Élevée | T7 |
| Input avec texte < 16px | Zoom automatique iOS au focus | Moyenne | T10 |
| Hiérarchie par le gras seul, partout | Inflation de l'emphase — plus aucun signal ne porte | Moyenne | référence R20/R23 |

## 7 · Sources et niveau de confiance

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| S1 | Le zoom navigateur n'affecte pas les unités viewport → vw seul échoue Resize Text | WCAG 2.1 — 1.4.4, [Adrian Roselli — Responsive Type and Zoom](https://adrianroselli.com/2019/12/responsive-type-and-zoom.html) | Établi — comportement navigateur documenté |
| S2 | Correction : rem dans min, max et partie fixe du clamp() | [Smashing Magazine — Addressing Accessibility Concerns With Using Fluid Type (nov. 2023)](https://www.smashingmagazine.com/2023/11/addressing-accessibility-concerns-fluid-type/) | Établi comme mitigation |
| S3 | Même corrigé, échec possible à zoom extrême (500 %) sur certaines plages de viewport | [Smashing Magazine, nov. 2023](https://www.smashingmagazine.com/2023/11/addressing-accessibility-concerns-fluid-type/), relayant Roselli | **Émergent/débattu** — analyse mathématique publiée, pas de consensus normatif ; tester au zoom réel |
| S4 | Garde-fou : ratio max/min ≤ 2.5 par échelon | [Smashing Magazine, nov. 2023](https://www.smashingmagazine.com/2023/11/addressing-accessibility-concerns-fluid-type/) | Communément admis — pas un critère WCAG officiel |
| S5 | Mesure de lecture ~45-75 caractères par ligne (Butterick élargit à 45-90) | Typographie classique (Bringhurst, *The Elements of Typographic Style* ; [Butterick, *Practical Typography*](https://practicaltypography.com/summary-of-key-rules.html)) | Établi par convergence, bornes indicatives — la valeur du kit reste un arbitrage de registre |
| S6 | Un seul h1, pas de saut de niveau, hiérarchie = structure | WCAG 1.3.1 / techniques WAI (G141, H42), convergence des systèmes majeurs | Établi, standard d'accessibilité |
| S7 | Indépendance niveau sémantique / taille visuelle | [GOV.UK Design System — Typography](https://design-system.service.gov.uk/styles/typography/) : "the heading class you use does not always need to correspond to the heading level" ; convergent avec Carbon | Établi — citation directe |
| S8 | Interligne du corps 120-145 %, corps web 15-25px, caps brèves + 5-12 % d'interlettrage, gras/italique rares et jamais ensemble, justifié seulement avec césure | [Butterick — Summary of key rules](https://practicaltypography.com/summary-of-key-rules.html) | Établi — littérature de référence, bornes indicatives |
| S9 | Interligne ≥ 1.5 dans les paragraphes, pas de justifié, mesure ≤ 80 caractères | WCAG 2.1 — 1.4.8 Visual Presentation (niveau AAA) | Établi comme critère AAA — visé, pas exigé au niveau AA |
| S10 | Hiérarchie par combinaison corps/graisse/position ; semibold pour titres, pas pour texte long ; une light plus grande peut dominer une bold | [IBM Carbon — Typography](https://carbondesignsystem.com/elements/typography/overview/), [Shopify Polaris — Typography](https://polaris-react.shopify.com/design/typography) | Établi par convergence |
| S11 | Titres en sentence case ; gras réservé à l'information critique ; 4 échelons de titres stylés suffisent | [GOV.UK Design System — Typography](https://design-system.service.gov.uk/styles/typography/) | Établi chez GOV.UK, adopté ici |
| S12 | Zoom automatique iOS Safari sur input < 16px | Comportement de plateforme documenté (WebKit), observation production | Établi — vérifiable, non documenté officiellement par Apple |
| S13 | Le texte doit pouvoir être agrandi jusqu'à 200 % sans perte de contenu ni de fonctionnalité ; l'usage des unités viewport pour le texte est une défaillance documentée de ce critère | [WCAG 2.2 — 1.4.4 Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html) | Établi, standard (AA) |
| S14 | Aucune perte lorsque l'utilisateur impose un interlignage ≥ 1,5, un espacement de paragraphe ≥ 2×, un interlettrage ≥ 0,12 et une chasse de mot ≥ 0,16 | [WCAG 2.2 — 1.4.12 Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html) | Établi, standard (AA) — c'est ce critère, et non 1.4.8 (AAA), qui contraint réellement l'auteur |
| S15 | Une page comporte généralement un seul h1 ; ne jamais sauter de niveau ; ne pas utiliser les titres pour redimensionner du texte | [MDN — HTML heading elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements) | Établi — documentation de plateforme ; réserve « generally » sur le h1 unique |
| S16 | Les tailles en px ne sont pas accessibles dans certains navigateurs ; privilégier les valeurs relatives | [MDN — font-size](https://developer.mozilla.org/en-US/docs/Web/CSS/font-size) | Établi — documentation de plateforme |
| S17 | Valeur minimale de 1,5 pour line-height sur le texte courant ; une valeur sans unité suit le zoom | [MDN — line-height](https://developer.mozilla.org/en-US/docs/Web/CSS/line-height) | Établi — convergent avec WCAG 1.4.8 et 1.4.12 |
| S18 | De longues sections en capitales gênent les personnes ayant des troubles cognitifs comme la dyslexie. La source ne mentionne aucun effet lecteur d'écran | [MDN — text-transform](https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform) | Établi pour la charge cognitive — corrige l'argument « lecteur d'écran » du fonds |
| S19 | Le contenu se présente sans défilement à deux dimensions à 320 px CSS, soit 1280 px à 400 % de zoom | [WCAG 2.2 — 1.4.10 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) | Établi, standard (AA) — complète 1.4.4 pour M1 |
| S20 | Les titres et les étiquettes décrivent le sujet ou l'objectif | [WCAG 2.2 — 2.4.6 Headings and Labels](https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels.html) | Établi, standard (AA) |
| S21 | L'unité ch représente la chasse du glyphe « 0 », pas la largeur moyenne d'un caractère ; rem suit les préférences utilisateur | [MDN — CSS length units](https://developer.mozilla.org/en-US/docs/Web/CSS/length) | Établi — fonde M2 : une max-width de 65ch laisse passer plus de 65 caractères |
| S22 | Un champ ≥ 16 px reçoit le focus normalement sur Safari iOS ; à 15 px ou moins, le viewport zoome | [CSS-Tricks — 16px or Larger Text Prevents iOS Form Zoom](https://css-tricks.com/16px-or-larger-text-prevents-ios-form-zoom/) | Secondaire mais vérifiable — pas de documentation primaire Apple |

*Toute règle sans source explicite repose sur un raisonnement de mécanisme (navigation par titres, fatigue oculaire, comportement du zoom) plutôt que sur une étude chiffrée. Le périmètre des sources est arbitré par l'Auteur (`claude/sources-typographie-arbitrees.md`) : une source se cite comme motif, jamais comme exigence.*

## 8 · Limites dites et questions au registre

- Onze règles au corpus ne sont pas onze assertions : chacune peut mourir à la batterie le jour où un contrat s'ouvre.
- **Le rognage de la boîte de texte** (leading-trim, périmètre §2.6) n'est pas une règle ici : il met en cause une assertion verrouillée (S3 du Gardien — la valeur vérifiée n'est pas la valeur vue), dépend des métriques de fonte et d'une propriété CSS encore jeune. Question ouverte au registre, condition : les fontes versées d'abord — condition désormais remplie côté kit.
- La direction de monotonie des interlignages (T6) et la valeur de la mesure (T5/M2) sont des affaires de registre, arbitrées par l'Auteur.
- T7, T8 et T10 s'appuient sur les rôles de texte déclarés — la part « registre » de cette famille.
- **Tokens d'interlignage par échelon, token d'interlettrage des capitales, nombres tabulaires, liens dans le texte courant, RTL et scripts non latins, expansion de traduction** : reportés du fonds 1.4.0, inchangés, à traiter à leurs chantiers propres.
