---
component: spacing
layer: ux
type: foundation
version: 2.1.0 # 2.0.0 : REPRISE AU MOULE V2 (séance de passage du 2026-08-23, verdict d'Auteur règle par règle — cf. claude/reprise-rythme-regles.md). Les 24 lois deviennent : un principe de tête, neuf règles Y1-Y9 (énoncé + mesure + test + dépendance + verdict), cinq couvertures Gardien dites avec leurs nuances, une mesure de rendu, sept pièces de référence. Deux lois renversées en le disant : R20 → Y8 (l'échelle devient responsive, arbitrage d'Auteur du 2026-08-23, alignée sur l'Échelle Semantic Rhythm et GOV.UK) et R21 → Y9 (l'espacement passe en rem, décision #069 du 2026-08-12). R01 jetée et R02 résumée (ménage #097). Les valeurs vivent au registre ; l'Échelle Semantic Rhythm fait foi (#050). 1.3.0 : CRITERE posé sur R05 (2026-07-31). 1.2.0 : le rythme vertical entre dans la fondation (2026-07-21). 1.1.0 : le cadre de page passe à grid (2026-07-16). 1.0.0 : première rédaction.
last_updated: 2026-08-23
companion: SPACING-UI.md
confidence: mixed # la loi de proximité et la grille de base sont établies par convergence ; l'échelle responsive et le rem sont des arbitrages d'Auteur datés, tensions de source consignées
---

# Espacement & rythme — Couche UX (fondation)

> Ce fichier contient les règles reprises au moule V2 le 2026-08-23 : chaque
> règle porte son énoncé, sa mesure décidable sans contexte, son test, sa
> dépendance et son verdict de séance. Les valeurs (l'échelle, la base, le
> seuil) vivent au registre — **l'Échelle Semantic Rhythm de l'Auteur y fait
> foi** (décision #050) ; la grammaire d'application vit dans `SPACING-UI.md`.

## Le principe de tête

RÈGLE [SPACING-P01] : **l'espace est un canal d'information, pas un reste.**
STATUT : principe de tête (provenance : SPACING-R24 + SPACING-R07, ménage #097)
SOURCE : S1, S11
ÉNONCÉ : Plus deux éléments sont proches, plus leur lien perçu est fort ; ce que les distances disent d'une page doit être aussi vrai que ce qu'en dit le texte.

> **Pourquoi** : l'utilisateur lit la page par ses distances avant de lire ses
> mots — une proximité qui ment est pire que pas de signal. C'est la
> déclinaison spatiale des affordances honnêtes.

## Les neuf règles

RÈGLE [SPACING-Y1] : l'intérieur ne dépasse jamais l'extérieur.
STATUT : propriété universelle (provenance : SPACING-R09)
SOURCE : S1, S3, S11
ÉNONCÉ : L'espacement interne d'un composant est toujours inférieur ou égal à son espacement externe.
MESURE : sur tout composant, le plus grand cran interne ≤ le plus petit cran externe, lu sur les jetons consommés, régime par régime
TEST : piégée — un libellé équidistant de son champ et du champ précédent → rouge ; conforme — libellé collé à son champ → vert ; mutation sur la comparaison
DÉPENDANCE : les jetons d'espacement
VERDICT : ✅ actée telle quelle — séance du 2026-08-23

RÈGLE [SPACING-Y2] : le titre appartient à ce qu'il ouvre.
STATUT : parti pris d'identité (provenance : SPACING-R13)
SOURCE : S10, S12
ÉNONCÉ : Un titre est plus proche de ce qu'il ouvre que de ce qu'il ferme : l'espace au-dessus dépasse l'espace au-dessous d'au moins un cran.
MESURE : pour tout titre, le cran au-dessus dépasse d'au moins un rang celui au-dessous, régime par régime
TEST : piégée — un titre équidistant → rouge (il flotte) ; piégée — un titre plus proche du bloc précédent → rouge (il ment)
DÉPENDANCE : les jetons d'espacement
VERDICT : ✅ actée telle quelle — séance du 2026-08-23. Porte la nuance que la couverture Gardien (S5, marque de tête) laissait dehors.

RÈGLE [SPACING-Y3] : les hauteurs s'accrochent à la grille.
STATUT : parti pris d'identité (provenance : SPACING-R14)
SOURCE : S2
ÉNONCÉ : Toute hauteur posée par le système s'exprime en multiples de la grille de base et s'y justifie.
MESURE : toute hauteur posée est un multiple entier du jeton de base
TEST : piégée — une hauteur de contrôle hors grille glissée dans les jetons → rouge
DÉPENDANCE : le fichier de jetons. Les hauteurs de l'Échelle Semantic Rhythm sont déjà prouvées conformes (crash-test du kit, 29 assertions).
VERDICT : ✅ actée telle quelle — séance du 2026-08-23

RÈGLE [SPACING-Y4] : l'interligne suit la lisibilité, pas la grille.
STATUT : parti pris d'identité (provenance : SPACING-R15)
SOURCE : S10, S16
ÉNONCÉ : Les interlignes restent gouvernés par la lisibilité — baseline souple : aucun interligne n'est recalé sur la grille sans arbitrage explicite et journalisé.
MESURE : aucun mécanisme de recalage d'interligne sur la grille dans les jetons ni les styles, hors arbitrage journalisé
TEST : piégée — un interligne contraint à tomber sur la grille sans décision journalisée → rouge
DÉPENDANCE : les jetons
VERDICT : ✅ actée telle quelle — séance du 2026-08-23. PONT : la valeur plancher de l'interligne (≥ 1,5) appartient à la famille typographie, qui la portera — une exigence, un seul endroit.

RÈGLE [SPACING-Y5] : la densité est un décalage d'un cran.
STATUT : parti pris d'identité (provenance : SPACING-R16, éprouvée par #076)
SOURCE : interne
ÉNONCÉ : La densité d'un composant est un décalage d'exactement un cran sur l'échelle commune — jamais une valeur propre, jamais un multiplicateur.
MESURE : padding compact = padding confortable décalé d'exactement un cran de l'échelle
TEST : piégée — un mode compact qui multiplie par 0,8 → rouge ; piégée — une valeur compacte propre hors échelle → rouge
DÉPENDANCE : les jetons d'espacement
VERDICT : ✅ actée telle quelle — séance du 2026-08-23. Le dépôt l'avait déjà éprouvée : le curseur de densité est local et décale d'un cran (#076).

RÈGLE [SPACING-Y6] : la densité ne change jamais la structure.
STATUT : parti pris d'identité (provenance : SPACING-R17)
SOURCE : interne
ÉNONCÉ : La densité modifie les espacements et rien d'autre : l'ordre des emplacements et la présence des éléments restent identiques d'une densité à l'autre.
MESURE : à densités différentes, ordre et présence des emplacements identiques, comparés sur les variantes déclarées
TEST : piégée — un mode compact qui masque une description → rouge
DÉPENDANCE : le registre des composants typés (les emplacements déclarés). Sans registre : refus de statuer.
VERDICT : ✅ actée avec sa dépendance dite — séance du 2026-08-23

RÈGLE [SPACING-Y7] : deux régimes, un seul seuil.
STATUT : parti pris d'identité (provenance : SPACING-R19)
SOURCE : S8
ÉNONCÉ : Le système ne définit que deux régimes de mise en page, mobile et desktop, séparés par un seuil de largeur unique.
MESURE : un seul seuil de largeur global dans les jetons
TEST : piégée — un second seuil glissé dans les jetons → rouge
DÉPENDANCE : le fichier de jetons
VERDICT : ✅ actée, parti pris assumé — séance du 2026-08-23. Un troisième régime naîtra d'un besoin réel journalisé, jamais du mimétisme. Rappel : un point de rupture se déclare en em, pas en px.

RÈGLE [SPACING-Y8] : les crans sont responsives — c'est le cran qui varie, jamais l'écran.
STATUT : parti pris d'identité (RENVERSE SPACING-R20 — arbitrage d'Auteur du 2026-08-23)
SOURCE : S9, l'Échelle Semantic Rhythm (#050)
ÉNONCÉ : Chaque cran de l'échelle peut résoudre une valeur différente selon le régime — deux valeurs de part et d'autre du seuil, ou une valeur fluide entre deux bornes — mais la variation vit dans la définition du jeton, une fois, au registre : jamais dans un écran.
MESURE : aucune surcharge locale d'un cran d'espacement en requête média hors la définition du jeton ; chaque cran déclare ses valeurs par régime ou ses deux bornes
TEST : piégée — un `--space-md` redéfini localement sous media query → rouge ; conforme — un cran fluide déclaré au registre → vert
DÉPENDANCE : le fichier de jetons
VERDICT : ✅ actée RENVERSÉE — séance du 2026-08-23. Le fonds (R20) figeait les crans au seuil ; l'Auteur a tranché l'inverse (motif : la densité ne suffit pas comme seule réponse, et l'Échelle Semantic Rhythm produit déjà des jetons responsives — la loi contredisait l'étalon). Position GOV.UK (S9) adoptée. Conséquence : Y1, Y2 et Y5 se lisent régime par régime.

RÈGLE [SPACING-Y9] : la géométrie d'espacement vit en rem.
STATUT : parti pris d'identité (RENVERSE SPACING-R21 — décision d'Auteur #069 du 2026-08-12)
SOURCE : S15
ÉNONCÉ : Les jetons d'espacement s'expriment en rem, base 16 ; restent en pixels, par décision explicite, la cible au doigt, les traits d'un pixel et la largeur d'écran minimale.
MESURE : tout jeton d'espacement résout une valeur en rem ; les trois exceptions px sont nommées au registre, aucune autre
TEST : piégée — un jeton d'espacement en px hors des trois exceptions → rouge
DÉPENDANCE : le fichier de jetons
VERDICT : ✅ actée — séance du 2026-08-23. Le fonds disait l'inverse et sa propre bibliographie (S15) l'avait fissuré ; #069 l'a tranché, vérifié sur quatre-vingt-dix mesures.

## Déjà couvert par le Gardien — dit une fois, avec les nuances

RÈGLE [SPACING-R04] : tout espacement est un multiple de la grille de base.
STATUT : couverte par le Gardien (échelle unique, S3-contrat)
SOURCE : S2
ÉNONCÉ : Tout espacement du système est un multiple entier d'une unité de base unique.

RÈGLE [SPACING-R05] : l'échelle est fermée.
STATUT : couverte par le Gardien (S2-T5)
SOURCE : S2, S4
ÉNONCÉ : L'échelle d'espacement est fermée : on choisit un cran existant sans inventer de valeur intermédiaire ; un besoin répété fait évoluer l'échelle, pas l'écran.
MESURE : aucune valeur d'espacement en dur hors des crans de l'échelle
CRITERE : chaque_valeur("padding,padding-*,margin,margin-*,gap,row-gap,column-gap") dans(space.*)

> **Nuance restante** : l'écart de nommage doctrine/jetons (`spacing.*` vs
> `--space-*`), relevé le 2026-07-31, reste à réconcilier au registre.

RÈGLE [SPACING-R08] : la hiérarchie de proximité est monotone (lié < frère < groupe).
STATUT : couverte par le Gardien (R3.7)
SOURCE : S1, S11
ÉNONCÉ : La hiérarchie de proximité est monotone : l'écart entre éléments liés est inférieur à l'écart entre frères, lui-même inférieur à l'écart entre groupes.

RÈGLE [SPACING-R10] : la séparation entre groupes passe par un saut d'échelle franc.
STATUT : couverte par le Gardien (R3.7) et éprouvée par #074 (le saut vaut deux crans ; une frontière est un groupe)
SOURCE : interne
ÉNONCÉ : La séparation entre deux groupes passe par un saut d'échelle franc et non par un cran adjacent.

> **Question ouverte, portée au contrat** : le facteur de la hiérarchie —
> R3.7 dit 3, l'Échelle Semantic Rhythm et #074 travaillent en crans et en
> diviseur 2. « Le diviseur du kit et le facteur de S3-R3.7 sont la même
> décision sous deux noms. » Elle se tranche avec les valeurs, au contrat.

RÈGLE [SPACING-R12] : l'empilement vertical suit la même échelle et la même monotonie.
STATUT : couverte par le Gardien (une seule échelle pour tout espace, S3-contrat)
SOURCE : S10
ÉNONCÉ : L'empilement vertical est un usage de l'échelle existante et non une seconde échelle.

## La mesure de rendu — pour le futur instrument, pas construit ici

RÈGLE [SPACING-M1] : l'espace réservé ne dépend pas de l'état.
STATUT : mesure de rendu (provenance : SPACING-R22)
SOURCE : S18, S19
ÉNONCÉ : L'espace occupé par un élément ne dépend pas de son état : la place du contenu attendu ou différé est réservée dès la mise en page initiale.
MESURE : les dimensions d'un squelette égalent celles du contenu réel ; aucun décalage non provoqué par une action de l'utilisateur (API Layout Instability)

## La référence (hors règles)

- **Les deux fonctions** *(R03)* : la relation est une décision de sens, le
  rythme une décision de système — le cadre de lecture de la famille.
- **L'échelle courte, qui grandit sur besoin journalisé** *(R06)* : parti
  pris d'identité ; l'évolution de l'échelle est un arbitrage d'Auteur.
- **L'espace d'abord, le fond ensuite, le trait en dernier** *(R11)* : écrit
  chez les **bordures** (principe de tête, rôle *séparer*) — une exigence,
  un seul endroit ; le rythme garde l'argument, pas la règle.
- **L'œil arbitre** *(R18)* : l'ajustement optique est légitime s'il reste
  local, n'est jamais promu en valeur d'échelle, et est commenté là où il
  vit.
- **La phrase gardée du ménage** *(R02 résumée, #097)* : la grille de
  colonnes n'a pas de fondation propre tant qu'aucun besoin réel ne
  l'exige ; ses gouttières restent des jetons d'espacement.
- **Les régimes de page** : repris avant ce paquet (#048), verrou d'épreuve
  en place.

## Risque — la grille de relecture *(provenance : SPACING-R23)*

| Cas | Risque principal | Couvert par |
|---|---|---|
| Proximité qui ment (libellé équidistant) | l'utilisateur relie au mauvais élément | Y1 |
| Valeur hors échelle | rythme cassé, rebranding impossible | R05 (Gardien) |
| Interne > externe | le contenu semble appartenir au voisin | Y1 |
| Sauts indiscernables (crans adjacents) | groupes non perçus, page plate | R10 (Gardien) |
| Cibles accolées en mobile | zone de sécurité violée — seuil normatif : celui du tactile (24, corrigé — la table disait 44) | famille tactile |
| Contenu qui saute (espace non réservé) | cible déplacée sous le doigt | M1 |
| Densité qui change la structure | deux produits dans un | Y6 |

## Sources et niveau de confiance

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| S1 | Loi de proximité appliquée à l'espacement | [Carbon — Spacing](https://carbondesignsystem.com/elements/spacing/overview/), [Polaris — Layout](https://polaris.shopify.com/design/layout) | Établi — Gestalt + convergence |
| S2 | Grille de base 4/8px, échelle courte non linéaire | [Atlassian — Spacing](https://atlassian.design/foundations/spacing), [Carbon](https://carbondesignsystem.com/elements/spacing/overview/), [Polaris — tokens](https://polaris-react.shopify.com/design/layout/layout-tokens), [8pt grid](https://spec.fm/specifics/8-pt-grid) | Établi par convergence |
| S3 | Interne ≤ externe | [Atlassian — Spacing](https://atlassian.design/foundations/spacing) | Établi |
| S4 | Écarts hors échelle à éviter | [Carbon — Spacing](https://carbondesignsystem.com/elements/spacing/overview/) | Établi |
| S5 | Ajustements optiques légitimes, locaux | [Atlassian](https://atlassian.design/foundations/spacing), [Polaris — Spacial organization](https://polaris-react.shopify.com/design/layout/spacial-organization) | Établi par convergence |
| S6 | Séparateurs dessinés en dernier recours | [Polaris — Spacial organization](https://polaris-react.shopify.com/design/layout/spacial-organization) | Établi |
| S7 | Grille de colonnes dérivée de l'échelle d'espacement | [Atlassian — Grid](https://atlassian.design/foundations/grid-beta), [Carbon — 2x Grid](https://carbondesignsystem.com/elements/2x-grid/overview/) | Établi |
| S8 | Breakpoints multiples chez les systèmes majeurs | [Atlassian](https://atlassian.design/foundations/grid-beta) (6), [Carbon](https://carbondesignsystem.com/elements/2x-grid/overview/) (5), [Material](https://developer.android.com/develop/ui/views/layout/use-window-size-classes) (5) | Établi ailleurs — seuil unique ici, divergence assumée |
| S9 | Échelle responsive (l'unité change au breakpoint) | [GOV.UK — Spacing](https://design-system.service.gov.uk/styles/spacing/) | Établi chez GOV.UK — **adopté ici le 2026-08-23** (Y8, renversement de R20) |
| S10 | Rythme vertical composé sur une unité commune | [Rutter — Compose to a vertical rhythm](https://webtypography.net/2.2.2), [NN/g — White Space](https://www.nngroup.com/articles/whitespace/) | Établi — baseline souple assumée ici |
| S11 | La proximité l'emporte sur les indices concurrents | [NN/g — Proximity Principle](https://www.nngroup.com/articles/gestalt-proximity/) | Établi |
| S12 | L'espace sous un titre plus petit que l'espace au-dessus | [Butterick — Space above & below](https://practicaltypography.com/space-above-and-below.html) | Convention typographique |
| S13 | Text Spacing : aucune perte aux espacements imposés | [WCAG 2.2 — 1.4.12](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html) | Établi, AA |
| S14 | Reflow à 320 px sans défilement bidimensionnel | [WCAG 2.2 — 1.4.10](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) | Établi, AA |
| S15 | Resize Text : les conteneurs s'agrandissent avec le texte | [WCAG 2.2 — 1.4.4](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html) | Établi, AA — a fondé le renversement de R21 (Y9) |
| S16 | Interligne ≥ 1,5 par mécanisme | [WCAG 2.2 — 1.4.8](https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html) | Établi, AAA conditionné |
| S17 | Target Size : cercle de 24 px sans intersection | [WCAG 2.2 — 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) | Établi, AA — le seuil réel de l'écart entre cibles |
| S18 | Réserver la place du contenu tardif | [web.dev — Optimize CLS](https://web.dev/articles/optimize-cls) | Établi |
| S19 | Décalages mesurables (API Layout Instability) | [MDN — LayoutShift](https://developer.mozilla.org/en-US/docs/Web/API/LayoutShift) | Établi — fonde M1 |

## À approfondir

- **Le facteur de la hiérarchie** (2 contre 3) : la décision la plus lourde
  de la famille, nommée, portée au contrat avec les valeurs.
- **L'écart de nommage** `spacing.*` / `--space-*` : affaire de registre.
- **Palier tablette** : au premier consommateur réel d'un 3e régime (Y7).
- **Expansion de traduction** (~30 %) : traitement transversal un jour.
- **Jetons négatifs** : aucun besoin interne à ce jour.

## Complément du 24 août 2026 — six règles rapatriées de l'étalon (2.1.0)

> Relecture de l'étalon Semantic Rhythm à la demande de l'Auteur : la première
> reprise avait capturé l'échelle et neuf règles, l'étalon portait aussi une
> doctrine. Séance rapide du 24 août : six règles gardées sur six.
> Pièce : `claude/reprise-rythme-complement.md`.

### RÈGLE [SPACING-Y10] — La profondeur choisit, pas toi
ÉNONCÉ : La marge intérieure et le rayon d'une surface décroissent ensemble à chaque niveau d'imbrication, par le même diviseur — page, carte, sous-carte forment une chaîne, pas trois choix. Seuls les composants (bouton, pilule, champ) gardent leur rayon propre.
MESURE : chaque niveau consomme les jetons de son niveau ; rayon(n+1) < rayon(n) et marge(n+1) < marge(n).
PROVENANCE : étalon, leçon 2. VERDICT : gardée — séance du 24 août 2026.

### RÈGLE [SPACING-Y11] — Les titres sortent du même pas
ÉNONCÉ : Le corps reste stable ; les titres montent par pas de la même échelle — h2 = un pas au-dessus du corps, h1 = deux pas. L'échelle des titres dérive des mêmes décisions que les espaces.
MESURE : les corps de titres résolvent les jetons dérivés du générateur (--rr-heading-1, --rr-heading-2), lus mécaniquement : h2 = corps × pas, h1 = corps × pas² (pas actuel du registre : 1,25). Bornés par TYPOGRAPHY-T4 (≤ 2,5×).
PROVENANCE : étalon (échelle des titres) ; jetons jamais repris jusqu'ici. VERDICT : gardée — séance du 24 août 2026.
NOTE DE RÉCONCILIATION : l'échelle de travail typographique du kit (titre-1, affiche) reste en place pour les pages éditoriales tant que le registre n'a pas arbitré la fusion — dit, pas caché.

### RÈGLE [SPACING-Y12] — Des rapports, jamais des soustractions
ÉNONCÉ : Les crans naissent d'un diviseur appliqué en chaîne, jamais d'une différence fixe — l'œil lit les rapports, pas les écarts : 24, 20, 16 font trois crans presque jumeaux.
MESURE : le rapport entre crans consécutifs est constant, au diviseur du registre près ; aucune suite arithmétique.
PROVENANCE : étalon, leçon 5. VERDICT : gardée — séance du 24 août 2026.

### RÈGLE [SPACING-Y13] — Le bord vaut deux écarts
ÉNONCÉ : La marge intérieure d'un groupe vaut deux fois l'écart entre ses enfants — « 12 entre, 24 autour ». Un seul curseur : le bord suit.
MESURE : inset du groupe = 2 × gap du groupe, sur l'échelle. Précise Y1 (qui dit seulement ≤).
PROVENANCE : étalon, leçon 4. VERDICT : gardée — séance du 24 août 2026.

### RÈGLE [SPACING-Y14] — Deux questions choisissent le cran (méthode)
ÉNONCÉ : Le bon cran ne se choisit pas à l'œil, il se déduit : est-ce un espace, une marge intérieure ou un coin ? puis : le lien est-il intime, entre frères ou entre groupes ? La réponse désigne le jeton.
MESURE : aucune (guide de décision) — chaque valeur posée doit pouvoir citer ses deux réponses.
PROVENANCE : étalon, leçon 7. VERDICT : gardée — séance du 24 août 2026.

### RÈGLE [SPACING-Y15] — Les six invariants d'audit
ÉNONCÉ : Six invariants tiennent le système sur toute vue : aucun enfant plus rond que son parent · aucune surface plus épaisse que son contenant · deux axes verticaux par carte, jamais trois · icônes et jauges alignées au pixel entre sœurs · zéro débord à la largeur minimale du registre · l'écart entre surfaces ≥ leur marge intérieure.
MESURE : les six, telles quelles — assertions prêtes pour le jour où le Gardien mord sur le kit (condition dite de COMPOSITION-UX).
PROVENANCE : étalon, leçon 8. VERDICT : gardée — séance du 24 août 2026.

### Au registre (complément)
Les trois décisions maîtresses (base · intervalle : tierce 5:4, quarte 4:3, √2, quinte 3:2, φ, octave · rayon racine) et les six préréglages métier de l'étalon (Outil expert 20·4:3·r8 · Produit SaaS 24·√2·r24 · Grand public 24·3:2·r32 · Ludique 28·φ·r44 · Éditorial-luxe 32·φ·r4 · Technique 16·5:4·r0). Renvois : le coin concentrique borné → ARRONDIS ; « le gris regroupe, le blanc porte » → SURFACES ; « un signal par intention » → COULEUR.
