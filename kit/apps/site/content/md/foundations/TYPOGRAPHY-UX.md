---
component: typography
layer: ux
type: foundation # distinct de "component" (un atome avec variantes) et de "pattern" (une composition) — une contrainte transversale
version: 1.4.0 # 1.4.0 : `CRITERE` posés sur R11 et R12 — les deux mesures d'unités quittent le code pour le corpus (2026-07-31). 1.3.0 : `CRITERE` posé sur R07 — le saut de niveau quitte le code pour le corpus (2026-07-31). 1.2.0 : TYPOGRAPHY-R06 passe de « un seul h1 » à « exactement un h1 » — l'absence était conforme à la lettre de la règle alors que verifie-rendu la signalait déjà (arbitrage Aurélien 2026-07-31, motif SEO) ; premier CRITERE posé. 1.1.3 # 1.1.3 : chemins repointés vers `content/md/` — fin de la migration vers le monorepo Sibyl DS (2026-07-27) ; aucune règle, aucun token, aucune source modifiés. 1.1.2 : vocabulaire aligné sur le modèle style × tone du bouton (DECISIONS 2026-07-18), aucune règle modifiée. 1.1.1 : balisage RÈGLE/CONFIANCE, aucune règle modifiée. 1.1.0 : benchmark (GOV.UK, Carbon, Polaris + littérature typographique : Butterick, Bringhurst, WCAG 1.4.8) et test de couverture — 6 trous comblés (interlignage, graisse, casse, alignement, taille minimale, profondeur). 1.0.0 : première rédaction, sans benchmark ni inventaire — écart de méthode corrigé, cf. DECISIONS.md
last_updated: 2026-07-05
companion: TYPOGRAPHY-UI.md
confidence: mixed # la hiérarchie sémantique et la mesure sont établies ; la typographie fluide contient un point activement débattu, marqué comme tel
---

# Typographie — Couche UX (fondation)

> Ce fichier contient le raisonnement : hiérarchie, lisibilité, risques. Les valeurs (échelle h1-h6, piles de secours, mesure) vivent dans `TYPOGRAPHY-UI.md`, qui référence `DESIGN.md`.

## Note de transposition (à lire en premier)

RÈGLE [TYPOGRAPHY-R01] : la typographie n'est **ni un composant, ni un pattern — c'est une fondation**, et la structure du dossier le rend visible (`content/md/foundations/`, parallèle à `content/md/components/` et `content/md/patterns/`).
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : La typographie est documentée comme une fondation transversale, rangée avec les autres fondations et non avec les composants ni les patterns.

RÈGLE [TYPOGRAPHY-R02] : **le modèle à axes ne s'applique pas.** La typographie n'a ni instances ni assemblage : elle est une **contrainte transversale** que tous les composants consomment — le bouton compose son label avec, l'input son message d'erreur, l'alert son titre.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Une fondation ne se décrit pas par des axes de variantes mais par la contrainte qu'elle impose aux composants qui la consomment.

> **Pourquoi** : un bouton a des instances qui se déclinent (style × tone × size) ; un pattern coordonne des composants assemblés. Chercher les axes de la typographie reviendrait à chercher les variantes d'une grille : la question n'a pas d'objet.

RÈGLE [TYPOGRAPHY-R03] : elle porte deux fonctions distinctes qui ne doivent jamais être confondues — c'est la vraie structure de ce fichier :
STATUT : propriété universelle
SOURCE : S6, S15
ÉNONCÉ : La typographie porte deux décisions séparées — la structure sémantique du contenu et les conditions physiques de lisibilité — et aucune des deux ne se prend à la place de l'autre.
  1. **Le sens** — la hiérarchie sémantique (h1-h6) : à qui appartient cette information dans la structure du document. Une décision de *contenu*.
  2. **La lisibilité** — la taille, la mesure de lecture, l'échelle responsive : dans quelles conditions physiques ce texte se lit. Une décision de *design*.

RÈGLE [TYPOGRAPHY-R04] : la règle cardinale de cette fondation est que ces deux fonctions sont **indépendantes** — le reste du fichier en découle.
STATUT : propriété universelle
SOURCE : S6, S7, S15
ÉNONCÉ : Le niveau sémantique d'un texte et son traitement visuel se décident indépendamment l'un de l'autre.

**Méthode — position corrigée en 1.1.0** : la première version affirmait qu'une fondation n'a pas d'inventaire ("pas de situations, seulement des consommateurs"). Le test de couverture l'a démenti : les *usages* de la typographie s'inventorient très bien (par rôle de texte, par contexte, par état — cf. `content/md/inventaires/inventaire-cas-usage-typographie.md`), et l'inventaire a trouvé le même ordre de grandeur de trous que sur les composants. Benchmark et inventaire s'appliquent donc aux fondations comme au reste — correction documentée dans DECISIONS.md.

## Hiérarchie sémantique vs hiérarchie visuelle

RÈGLE [TYPOGRAPHY-R05] : les niveaux h1-h6 décrivent la **structure du contenu** — c'est l'arbre que le lecteur d'écran navigue, que les moteurs indexent, que la table des matières reflète. Ils ne décrivent jamais le style.
STATUT : propriété universelle
SOURCE : S6, S15, S20
ÉNONCÉ : Les niveaux de titre h1 à h6 décrivent la structure du contenu et ne sont jamais employés pour obtenir un effet de style.

RÈGLE [TYPOGRAPHY-R06] : **exactement un h1 par page** — c'est le titre du document, pas le plus gros texte de la page. Ni deux, ni **zéro** : une page sans h1 est un arbre sans racine pour la navigation par titres, et un document sans sujet pour l'indexation.
STATUT : propriété universelle
SOURCE : S15, S6
ÉNONCÉ : Une page comporte exactement un titre de niveau 1, qui est le titre du document.
MESURE : exactement un élément h1 par page
CRITERE : compte("h1") == 1

> **Pourquoi la présence, et pas seulement l'unicité** : le référencement lit le h1 comme le sujet de la page — l'absence coûte autant que la duplication. Et cette obligation ne dit **rien** du graphisme : par TYPOGRAPHY-R08, le h1 peut légitimement être rendu plus petit qu'un h2. Le niveau suit la structure, la taille suit le design. *(Arbitrage Aurélien, 2026-07-31.)*

RÈGLE [TYPOGRAPHY-R07] : **jamais de saut de niveau** — un h2 n'est jamais suivi directement d'un h4.
STATUT : propriété universelle
SOURCE : S15, S6
ÉNONCÉ : Les niveaux de titre se suivent sans saut : un niveau n n'est jamais suivi directement d'un niveau n+2.
MESURE : aucun saut de niveau de titre (h2 → h4)
CRITERE : suite("h1,h2,h3,h4,h5,h6") sans_saut

> **Pourquoi** : un saut casse l'arbre pour la navigation par titres (un utilisateur de lecteur d'écran conclut à du contenu manquant) sans aucun bénéfice en échange.

RÈGLE [TYPOGRAPHY-R08] : **le niveau et la taille sont deux décisions indépendantes.** Le niveau suit la structure du contenu ; la taille suit le design. Un h2 peut légitimement être stylé plus petit qu'un h3 si le contexte l'exige.
STATUT : propriété universelle
SOURCE : S7, S15
ÉNONCÉ : Le niveau d'un titre suit la structure du contenu et sa taille suit le design : un titre de niveau inférieur peut légitimement être rendu plus petit qu'un titre de niveau supérieur.

> **Pourquoi** : c'est la déclinaison typographique d'un principe déjà établi ailleurs dans le système : "Large ne veut pas dire important" (BUTTON-UX.md — la taille du bouton répond à la densité du contexte, pas à l'importance de l'action).

RÈGLE [TYPOGRAPHY-R09] : un texte qui doit *avoir l'air* d'un titre sans en être un (chiffre de dashboard, citation mise en avant) prend le style visuel voulu sur un élément non-heading — jamais un heading pour le style.
STATUT : propriété universelle
SOURCE : S15, S6
ÉNONCÉ : Un texte qui doit avoir l'apparence d'un titre sans en être un prend son style sur un élément non-titre.
MESURE : les éléments h1 à h6 ne portent que des titres de section

> **Erreur fréquente** : utiliser un h1 pour un hero visuel géant qui n'est pas le titre sémantique réel de la page — le texte d'accroche marketing prend le *style* display, mais le h1 appartient au vrai titre du document. Cas réellement rencontré dans ce projet (audit de portfolio-landing, laissé en écart assumé avant la suppression du dossier) : documenter la règle évite de refaire l'approximation.

## Typographie fluide (fluid type)

RÈGLE [TYPOGRAPHY-R10] : faire glisser la taille du texte entre une borne minimale et une borne maximale selon la largeur du viewport, au lieu de sauter par paliers de media queries.
STATUT : parti pris d'identité
SOURCE : S2
ÉNONCÉ : Les tailles de texte varient continûment entre une borne minimale et une borne maximale en fonction de la largeur du viewport, plutôt que par paliers.

RÈGLE [TYPOGRAPHY-R11] : **les unités viewport seules sont interdites** — un texte dimensionné uniquement en `vw` échoue WCAG 1.4.4 (*Resize Text*).
STATUT : propriété universelle
SOURCE : S1, S13
ÉNONCÉ : Une taille de texte ne s'exprime jamais en unités viewport seules, qui ne répondent pas au zoom du navigateur et font échouer le critère de redimensionnement du texte.
MESURE : aucune taille de police exprimée en unités viewport seules
CRITERE : aucune_valeur("font-size") unites_seules(vw|vh|vmin|vmax)

> **Pourquoi** : **le zoom du navigateur n'affecte pas les unités viewport** — l'utilisateur zoome, la fenêtre ne change pas de largeur, le texte ne grandit pas. C'est un échec d'accessibilité silencieux : invisible en test standard, bloquant pour l'utilisateur malvoyant qui dépend du zoom.

RÈGLE [TYPOGRAPHY-R12] : la correction standard — combiner `rem` et `vw` dans `clamp()`, avec du `rem` dans le minimum, le maximum **et la partie fixe de la valeur préférée** (`clamp(2rem, 1.67rem + 1.67vw, 3rem)` — jamais `clamp(2rem, 4vw, 3rem)`). La composante `rem` répond au zoom, la composante `vw` porte la fluidité.
STATUT : implémentation de référence
SOURCE : S2, S13, S16
ÉNONCÉ : Toute taille fluide combine rem et vw dans clamp(), avec une composante rem dans le minimum, dans le maximum et dans la partie fixe de la valeur préférée.
MESURE : chaque clamp() de taille contient une composante rem dans le minimum, le maximum et la partie fixe
CRITERE : chaque_valeur("font-size") clamp_avec_rem()

RÈGLE [TYPOGRAPHY-R13] : limite connue — même cette version corrigée peut ne pas atteindre les 200 % d'agrandissement exigés par WCAG 1.4.4 à des niveaux de zoom extrêmes (jusqu'à 500 %), sur certaines plages de viewport — démontré mathématiquement par l'analyse de novembre 2023 (cf. sources). Tester réellement au zoom plutôt que de faire confiance à la formule.
STATUT : implémentation de référence
SOURCE : S3, S13
ÉNONCÉ : La conformité au redimensionnement du texte se vérifie par un test de zoom navigateur réel, et non par la seule forme de la formule ni par un redimensionnement de fenêtre.
MESURE : à 200 % de zoom navigateur, la taille rendue a doublé sans perte de contenu ni défilement à deux dimensions

CONFIANCE : non formalisé (émergent/débattu) — analyse mathématique publiée, pas un consensus établi ; Roselli recommande de tester réellement au zoom.

RÈGLE [TYPOGRAPHY-R14] : garde-fou communément admis — ne jamais dépasser un **ratio de 2.5× entre la taille minimale et la taille maximale d'un même échelon**. L'échelle de ce système (TYPOGRAPHY-UI.md) reste très en dessous (ratio ≤ 1.5 partout).
STATUT : parti pris d'identité
SOURCE : S4, S13
ÉNONCÉ : Le rapport entre la taille maximale et la taille minimale d'un même échelon typographique ne dépasse pas 2,5.
MESURE : ratio taille maximale / taille minimale ≤ 2,5 par échelon

> **Pourquoi** : sous ce ratio, le texte atteint ses 200 % dans les navigateurs modernes sur les plages de viewport usuelles.
> **Erreur fréquente** : tester le fluid type en redimensionnant la fenêtre et conclure que "ça marche" — le redimensionnement et le zoom sont deux mécanismes différents, et c'est le zoom qui est protégé par WCAG. Le test qui compte : zoom navigateur à 200 %, le texte doit avoir doublé.

## Mesure de lecture

RÈGLE [TYPOGRAPHY-R15] : borner la longueur de ligne du texte courant — la lisibilité d'un paragraphe dépend plus de sa mesure que de sa taille.
STATUT : propriété universelle
SOURCE : S5, S9
ÉNONCÉ : La longueur de ligne du texte courant est bornée, la lisibilité d'un paragraphe dépendant davantage de sa mesure que de sa taille.

RÈGLE [TYPOGRAPHY-R16] : viser la fourchette classique d'environ **45 à 75 caractères par ligne** pour le texte courant. La mesure s'exprime en `ch` (elle suit la police et la taille effective), via le token `measure.reading-max` — jamais en pixels, qui ne suivraient ni le zoom ni la police.
STATUT : parti pris d'identité
SOURCE : S5, S9, S21
ÉNONCÉ : Le texte courant vise une longueur de ligne d'environ 45 à 75 caractères, bornée par une largeur maximale exprimée en unités ch et jamais en pixels.
MESURE : longueur de ligne du texte courant entre 45 et 75 caractères, bornée par une max-width en ch

RÈGLE [TYPOGRAPHY-R17] : le pendant de la fluidité — un texte fluide qui s'étire sans `max-width` casse sa mesure sur grand écran. Fluidité de la taille et bornage de la mesure vont ensemble : l'un sans l'autre dégrade la lecture qu'ils devaient améliorer.
STATUT : parti pris d'identité
SOURCE : S9
ÉNONCÉ : Une taille de texte fluide s'accompagne toujours d'une largeur maximale sur le bloc de texte, faute de quoi la mesure se dégrade sur grand écran.
MESURE : tout bloc de texte courant porte une max-width

> **Pourquoi** : la taille monte en butée de `clamp()` pendant que la ligne continue de s'allonger, et à 75+ caractères par ligne l'œil perd le retour à la ligne.
> **Erreur fréquente** : appliquer la mesure aux titres — un titre d'un ou deux mots n'a pas de problème de retour à la ligne ; la mesure protège le texte *courant*. (Un titre très long peut mériter sa propre borne, plus courte — décision locale, pas de token.)

## Interlignage (comblé après test de couverture)

RÈGLE [TYPOGRAPHY-R18] : inversement proportionnel au corps — le texte courant respire : 120 à 145 % du corps selon la fourchette classique (Butterick), et WCAG 1.4.8 (AAA) demande un interligne d'au moins 1.5 dans les paragraphes ; `typography.body` est à 1.6, conforme aux deux. Les grands corps serrent — un titre n'a pas besoin de l'air d'un paragraphe (`typography.display` à 1.1).
STATUT : propriété universelle
SOURCE : S9, S14, S17, S8
ÉNONCÉ : Le texte courant est composé avec un interlignage d'au moins 1,5 fois le corps, et les grands corps peuvent recevoir un interlignage plus serré.
MESURE : interlignage ≥ 1,5 pour le texte courant

RÈGLE [TYPOGRAPHY-R19] : l'interligne n'est pas une constante du système, c'est une fonction du corps et de l'usage.
STATUT : parti pris d'identité
SOURCE : S8
ÉNONCÉ : L'interlignage n'est pas une constante du système : il se détermine en fonction du corps et de l'usage du texte.

> **Pourquoi** : l'espace entre les lignes fait plus pour la lisibilité d'un paragraphe que le choix de la police.
> **Erreur fréquente** : laisser un titre multi-lignes hériter de l'interligne du corps de texte — les lignes du titre flottent, séparées par des trous ; l'inverse (interligne de titre sur un paragraphe) compacte le texte au point de gêner le suivi de ligne.

## Graisse et emphase (comblé après test de couverture)

RÈGLE [TYPOGRAPHY-R20] : la graisse est un canal de hiérarchie parmi d'autres — jamais le seul.
STATUT : propriété universelle
SOURCE : S6, S10
ÉNONCÉ : La graisse n'est jamais le seul canal par lequel une hiérarchie de texte est exprimée.

RÈGLE [TYPOGRAPHY-R21] : la hiérarchie se construit par **combinaison** de corps, graisse et position (Polaris) — une graisse légère peut dominer une grasse si son corps est nettement supérieur (Carbon). C'est le pendant visuel de "niveau ≠ taille".
STATUT : propriété universelle
SOURCE : S10
ÉNONCÉ : La hiérarchie typographique se construit par combinaison du corps, de la graisse et de la position, un corps nettement supérieur pouvant dominer une graisse plus forte.

RÈGLE [TYPOGRAPHY-R22] : le semibold porte les titres, **jamais le texte long** (Carbon) — et aucune graisse light sous le corps standard : la finesse en petit corps dégrade le contraste effectif du trait.
STATUT : parti pris d'identité
SOURCE : S10
ÉNONCÉ : Les graisses semi-grasses portent les titres et jamais le texte long, et aucune graisse plus fine que la graisse standard n'est employée sous le corps de texte courant.
MESURE : aucune graisse inférieure à la graisse standard sous l'équivalent 16 px

RÈGLE [TYPOGRAPHY-R23] : le gras s'utilise avec parcimonie — pour "l'information critique que l'utilisateur rate" (GOV.UK) ; gras et italique le moins possible, et jamais ensemble (Butterick).
STATUT : parti pris d'identité
SOURCE : S8, S11
ÉNONCÉ : Le gras est réservé à l'information critique que le lecteur risque de manquer ; le gras et l'italique restent rares et ne se cumulent pas.

> **Pourquoi** : un paragraphe semé de gras n'a plus d'emphase du tout.
> **Erreur fréquente** : compenser une hiérarchie confuse en engraissant — si tout est important, rien ne l'est ; c'est l'inflation du primary (BUTTON-UX.md), version texte.

## Casse (comblé après test de couverture)

RÈGLE [TYPOGRAPHY-R24] : titres en **sentence case** (GOV.UK) — décision prise une fois pour tout le produit, pas titre par titre.
STATUT : parti pris d'identité
SOURCE : S11
ÉNONCÉ : Les titres sont rédigés en sentence case, décision prise une fois pour l'ensemble du produit.
MESURE : titres en sentence case

RÈGLE [TYPOGRAPHY-R25] : **TOUT EN CAPITALES : réservé aux étiquettes brèves** (le rôle exact de `label-mono` dans ce système), jamais au texte courant — et toujours accompagné de 5 à 12 % d'interlettrage (Butterick). La valeur déjà utilisée en local (0.08em = 8 %) entre dans la fourchette — règle désormais sourcée, candidate à un token.
STATUT : parti pris d'identité
SOURCE : S8, S18
ÉNONCÉ : Les capitales sont réservées aux étiquettes brèves, jamais au texte courant, et s'accompagnent d'un interlettrage de 5 à 12 % du corps.
MESURE : text-transform: uppercase uniquement sur des étiquettes courtes, avec un interlettrage entre 0,05em et 0,12em

> **Pourquoi** : les capitales, dessinées pour ouvrir des phrases, se serrent sans interlettrage.

RÈGLE [TYPOGRAPHY-R26] : les capitales s'appliquent en CSS (`text-transform`), jamais tapées dans le contenu — le texte source reste en casse normale pour les lecteurs d'écran et le copier-coller.
STATUT : propriété universelle
SOURCE : S6, S18
ÉNONCÉ : La casse haute s'applique par la feuille de style et jamais en saisissant le contenu en capitales, afin que le texte source reste dans sa casse d'origine.
MESURE : aucune chaîne de contenu saisie tout en capitales ; la casse haute vient de text-transform

> **Erreur fréquente** : des capitales pour "faire titre" sur une phrase entière — la lecture par silhouette de mot disparaît, l'utilisateur épelle.

## Alignement et justification (comblé après test de couverture)

RÈGLE [TYPOGRAPHY-R27] : **fer à gauche par défaut** — le retour à la ligne régulier est le repère de lecture.
STATUT : parti pris d'identité
SOURCE : S8, S9
ÉNONCÉ : Le texte est aligné sur le bord de début de ligne par défaut, le retour à la ligne régulier servant de repère de lecture.
MESURE : text-align des blocs de texte = start par défaut

RÈGLE [TYPOGRAPHY-R28] : **jamais de texte justifié en interface**.
STATUT : propriété universelle
SOURCE : S9, S8
ÉNONCÉ : Le texte d'interface n'est jamais justifié.
MESURE : aucun bloc de texte en text-align: justify

> **Pourquoi** : la justification sans césure creuse des rivières d'espace ; Butterick ne l'admet qu'avec césure activée, et la césure web reste inégale selon les langues et navigateurs. WCAG 1.4.8 (AAA) exclut le justifié.

RÈGLE [TYPOGRAPHY-R29] : le centré est réservé aux titres courts et aux moments éditoriaux — jamais un paragraphe (le début de ligne devient introuvable).
STATUT : parti pris d'identité
SOURCE : S8
ÉNONCÉ : Le centrage est réservé aux titres courts et aux moments éditoriaux, jamais appliqué à un paragraphe.
MESURE : aucun paragraphe en text-align: center

## Taille minimale et zoom (comblé après test de couverture)

RÈGLE [TYPOGRAPHY-R30] : corps de texte web — 15 à 25 px d'équivalent (Butterick) ; `typography.body` (16px) est dans la fourchette, volontairement bas de fourchette pour un produit dense. **Jamais sous l'équivalent 16px pour le texte courant.**
STATUT : parti pris d'identité
SOURCE : S8, S16
ÉNONCÉ : Le texte courant n'est jamais composé sous l'équivalent de 16 px, et sa taille s'exprime en unités relatives au corps racine.
MESURE : taille du texte courant ≥ 16 px d'équivalent, exprimée en rem

RÈGLE [TYPOGRAPHY-R31] : cas particulier des champs de saisie — sous 16px, iOS Safari **zoome automatiquement** la page au focus du champ : la taille du texte d'un input n'est pas une décision esthétique, c'est un comportement de plateforme (frontière avec INPUT-UI.md, qui hérite du corps standard et n'est donc pas concerné).
STATUT : parti pris d'identité
SOURCE : S12, S22
ÉNONCÉ : Les champs de saisie ne descendent jamais sous l'équivalent de 16 px, faute de quoi Safari iOS zoome automatiquement la page à la prise de focus.
MESURE : font-size des champs de saisie ≥ 16 px d'équivalent

## Profondeur de hiérarchie (comblé après test de couverture)

RÈGLE [TYPOGRAPHY-R32] : six niveaux existent, quatre suffisent presque toujours — GOV.UK ne style que quatre échelons de titres. Des h5/h6 récurrents signalent une structure trop profonde à réorganiser, pas un besoin de styles supplémentaires. L'échelle complète h1-h6 de DESIGN.md existe pour les cas légitimes (documentation longue, spécifications), pas comme une invitation.
STATUT : parti pris d'identité
SOURCE : S11
ÉNONCÉ : Quatre échelons de titres stylés suffisent en usage courant, la récurrence de niveaux 5 et 6 signalant une structure de contenu à réorganiser.
MESURE : au plus quatre échelons de titres stylés distincts en usage courant

## Risque

RÈGLE [TYPOGRAPHY-R33] : table ci-dessous
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Les risques typographiques connus sont inventoriés et gradués par sévérité dans une table du document.

| Cas | Risque principal | Sévérité |
|---|---|---|
| Texte en vw seul (sans composante rem) | Zoom navigateur sans effet — échec WCAG 1.4.4, exclusion des utilisateurs malvoyants | Critique |
| Sauts de niveaux de titres (h2 → h4) | Arbre de navigation cassé pour lecteur d'écran, contenu perçu comme manquant | Élevée |
| Plusieurs h1, ou h1 décoratif de hero | Titre réel du document illisible pour l'outillage (AT, SEO, sommaire) | Moyenne à élevée |
| Fluid type non testé au zoom (seulement au resize) | Échec 1.4.4 invisible en test standard | Élevée |
| Texte courant sans max-width sur grand écran | Mesure > 75 caractères, lecture dégradée, fatigue | Moyenne |
| Polices non embarquées sans pile de secours | Rendu système imprévisible, métriques décalées (layout shift) | Moyenne |
| Texte justifié sans césure | Rivières d'espace, lecture hachée — exclu par WCAG 1.4.8 | Moyenne |
| Capitales sur du texte courant | Silhouette de mot perdue, lecture épelée, fatigue | Moyenne |
| Graisse light en petit corps | Contraste effectif du trait dégradé, illisible sur écran basse densité | Élevée |
| Input avec texte < 16px | Zoom automatique iOS au focus — saut de mise en page subi | Moyenne |
| Hiérarchie par le gras seul, partout | Inflation de l'emphase — plus aucun signal ne porte | Moyenne |

## Règle transversale

RÈGLE [TYPOGRAPHY-R34] : **la structure appartient au contenu, l'apparence appartient au design — et aucun des deux ne se déduit de l'autre.**
STATUT : propriété universelle
SOURCE : S6, S7, S15
ÉNONCÉ : La structure appartient au contenu et l'apparence appartient au design : aucune des deux ne se déduit de l'autre.

> **Pourquoi** : c'est la déclinaison typographique du principe fondateur du système : comme le style d'un bouton ne dit rien de sa taille, le niveau d'un titre ne dit rien de sa graisse ni de son corps. Chaque fois qu'une décision visuelle force une décision sémantique (ou l'inverse), c'est le signe qu'une des deux est prise au mauvais endroit.

## Sources et niveau de confiance

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| S1 | Le zoom navigateur n'affecte pas les unités viewport → vw seul échoue Resize Text | WCAG 2.1 — 1.4.4, [Adrian Roselli — Responsive Type and Zoom](https://adrianroselli.com/2019/12/responsive-type-and-zoom.html) | Établi — comportement navigateur documenté |
| S2 | Correction : rem dans min, max et partie fixe du clamp() | [Smashing Magazine — Addressing Accessibility Concerns With Using Fluid Type (nov. 2023)](https://www.smashingmagazine.com/2023/11/addressing-accessibility-concerns-fluid-type/) | Établi comme mitigation |
| S3 | Même corrigé, échec possible à zoom extrême (500 %) sur certaines plages de viewport | [Smashing Magazine, nov. 2023](https://www.smashingmagazine.com/2023/11/addressing-accessibility-concerns-fluid-type/), relayant Roselli | **Émergent/débattu** — analyse mathématique publiée, pas de consensus normatif ; tester au zoom réel |
| S4 | Garde-fou : ratio max/min ≤ 2.5 par échelon | [Smashing Magazine, nov. 2023](https://www.smashingmagazine.com/2023/11/addressing-accessibility-concerns-fluid-type/) | Communément admis, découle de l'analyse ci-dessus — pas un critère WCAG officiel |
| S5 | Mesure de lecture ~45-75 caractères par ligne (Butterick élargit à 45-90) | Typographie classique (Bringhurst, *The Elements of Typographic Style* ; [Butterick, *Practical Typography*](https://practicaltypography.com/summary-of-key-rules.html)) | Établi par convergence de la littérature typographique, bornes indicatives |
| S6 | Un seul h1, pas de saut de niveau, hiérarchie = structure | WCAG 1.3.1 / techniques WAI (G141, H42), convergence des systèmes majeurs | Établi, standard d'accessibilité |
| S7 | Indépendance niveau sémantique / taille visuelle | [GOV.UK Design System — Typography](https://design-system.service.gov.uk/styles/typography/) : "the heading class you use does not always need to correspond to the heading level" ; convergent avec Carbon | Établi — règle explicitement documentée, citation directe |
| S8 | Interligne du corps 120-145 %, corps web 15-25px, caps brèves + 5-12 % d'interlettrage, gras/italique rares et jamais ensemble, justifié seulement avec césure | [Butterick — Summary of key rules](https://practicaltypography.com/summary-of-key-rules.html) | Établi — littérature typographique de référence, bornes indicatives |
| S9 | Interligne ≥ 1.5 dans les paragraphes, pas de justifié, mesure ≤ 80 caractères | WCAG 2.1 — 1.4.8 Visual Presentation (niveau AAA) | Établi comme critère AAA — visé, pas exigé au niveau AA |
| S10 | Hiérarchie par combinaison corps/graisse/position ; semibold pour titres, pas pour texte long ; une light plus grande peut dominer une bold | [IBM Carbon — Typography](https://carbondesignsystem.com/elements/typography/overview/), [Shopify Polaris — Typography](https://polaris-react.shopify.com/design/typography) | Établi par convergence |
| S11 | Titres en sentence case ; gras réservé à l'information critique ; 4 échelons de titres stylés suffisent | [GOV.UK Design System — Typography](https://design-system.service.gov.uk/styles/typography/) | Établi chez GOV.UK (système à recherche utilisateur documentée), adopté ici |
| S12 | Zoom automatique iOS Safari sur input < 16px | Comportement de plateforme documenté (WebKit), observation production | Établi — comportement vérifiable, non documenté officiellement par Apple |
| S13 | Le texte doit pouvoir être agrandi jusqu'à 200 % sans perte de contenu ni de fonctionnalité ; l'usage des unités viewport pour dimensionner le texte est une défaillance documentée de ce critère | [WCAG 2.2 — 1.4.4 Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html) | Établi, standard (AA) — le fichier citait ce critère en prose sans l'inscrire dans sa bibliographie |
| S14 | Aucune perte de contenu ni de fonctionnalité lorsque l'utilisateur impose un interlignage d'au moins 1,5 fois le corps, un espacement de paragraphe d'au moins 2 fois le corps, un interlettrage d'au moins 0,12 et une chasse de mot d'au moins 0,16 | [WCAG 2.2 — 1.4.12 Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html) | Établi, standard (AA) — **c'est ce critère, et non 1.4.8 (AAA), qui contraint réellement l'auteur** ; il manquait au corpus |
| S15 | Une page comporte généralement un seul h1 ; ne jamais sauter de niveau de titre ; ne pas utiliser les éléments de titre pour redimensionner du texte — utiliser font-size | [MDN — HTML heading elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements) | Établi — documentation de plateforme ; noter la réserve « generally » sur le h1 unique |
| S16 | Définir les tailles de police en px n'est pas accessible, l'utilisateur ne pouvant plus changer la taille dans certains navigateurs ; privilégier les valeurs relatives à la taille par défaut de l'utilisateur | [MDN — font-size](https://developer.mozilla.org/en-US/docs/Web/CSS/font-size) | Établi — documentation de plateforme |
| S17 | Utiliser une valeur minimale de 1,5 pour line-height sur le texte courant ; une valeur sans unité garantit la mise à l'échelle proportionnelle au zoom | [MDN — line-height](https://developer.mozilla.org/en-US/docs/Web/CSS/line-height) | Établi — documentation de plateforme, convergente avec WCAG 1.4.8 et 1.4.12 |
| S18 | De longues sections en capitales peuvent être difficiles à lire pour les personnes ayant des troubles cognitifs comme la dyslexie. **La source ne mentionne aucun effet sur les lecteurs d'écran** | [MDN — text-transform](https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform) | Établi pour la charge cognitive — **contredit l'argument « lecteur d'écran » avancé par R26** |
| S19 | Le contenu doit se présenter sans défilement à deux dimensions à une largeur équivalente à 320 px CSS, soit un viewport de 1280 px à 400 % de zoom | [WCAG 2.2 — 1.4.10 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) | Établi, standard (AA) — complète 1.4.4 pour le test de zoom |
| S20 | Les titres et les étiquettes décrivent le sujet ou l'objectif | [WCAG 2.2 — 2.4.6 Headings and Labels](https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels.html) | Établi, standard (AA) |
| S21 | L'unité ch représente la chasse du glyphe « 0 », et non la largeur moyenne d'un caractère ; rem représente le font-size de l'élément racine, dont le défaut usuel est 16 px mais que les préférences utilisateur modifient | [MDN — CSS length units](https://developer.mozilla.org/en-US/docs/Web/CSS/length) | Établi — **nuance R16** : une max-width de 65ch laisse passer nettement plus de 65 caractères |
| S22 | Un champ dont le font-size atteint 16 px ou plus reçoit le focus normalement sur Safari iOS ; à 15 px ou moins, le viewport zoome sur le champ | [CSS-Tricks — 16px or Larger Text Prevents iOS Form Zoom](https://css-tricks.com/16px-or-larger-text-prevents-ios-form-zoom/) | Secondaire mais vérifiable — aucune documentation primaire Apple ou WebKit trouvée sur ce comportement |

*Toute règle sans source explicite ci-dessus repose sur un raisonnement de mécanisme (navigation par titres, fatigue oculaire, comportement du zoom) plutôt que sur une étude chiffrée.*

## À approfondir

- **Tokens d'interlignage par échelon** : la règle existe (cf. Interlignage), les valeurs h1-h6 ne sont pas encore tokenisées — seuls display/body/label-mono ont les leurs.
- **Token d'interlettrage des capitales** : la règle et la fourchette existent (5-12 %), 8 % est déjà utilisé en local — à promouvoir au 2e consommateur.
- **Nombres tabulaires** : Polaris exige les chiffres tabulaires pour aligner les montants — réglage OpenType (`font-variant-numeric`), pas encore de règle ici ; concerne les futures tables et le dashboard.
- **Liens dans le texte courant** : soulignement, couleur, état visité — à la frontière entre cette fondation et un futur composant "lien" (GOV.UK les traite dans la typographie).
- **RTL et scripts non latins** : la mesure en `ch` et l'échelle supposent le latin — à revisiter le jour venu.
- **Expansion de traduction** : l'allemand ou le finnois s'étirent ~30 % — les troncatures et les largeurs calées sur le français casseront ; jamais traité nulle part dans le système.
