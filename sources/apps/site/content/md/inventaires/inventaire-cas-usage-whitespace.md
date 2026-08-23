# Inventaire des cas d'usage — White-space (le vide comme signe)

> Cadrage AVANT toute rédaction de règles (leçon typographie : inventaire + benchmark d'abord).
> Question posée le 2026-07-21 : les IA composent trop souvent par mimétisme — elles copient des
> pixels d'espacement, pas des relations. Le composant invisible qui porte les lois de proximité
> et d'affordance est le white-space. Cet inventaire cartographie ce que le vide EXPRIME, qui le
> possède déjà dans le système, et ce qui reste sans propriétaire. Nature pressentie : **language**
> (le vide compose des fondations pour produire des signes) — débattue au Bilan, PAS tranchée ici.
> Aucune règle n'est rédigée dans ce fichier.

## 1. Par sens exprimé (ce que le vide dit)

| Cas | Signal attendu | Couverture |
|---|---|---|
| Grouper sans trait ni fond | des distances qui disent la relation : lié < frère < groupe | Couvert par SPACING (règle cardinale, monotonie, saut d'échelle) |
| Séparer deux régions | le saut d'échelle AVANT le trait ou le fond | Couvert par SPACING (« l'espace d'abord ») + BORDER |
| Appartenir à un conteneur | espacement interne ≤ externe | Couvert par SPACING |
| Mettre en valeur par l'isolement | l'élément important respire plus que ses voisins (Von Restorff) | Non couvert — la loi est cataloguée (LAWS), aucun propriétaire applicatif |
| Donner du poids à un contenu | plus d'air autour = plus d'importance perçue (hero, citation, chiffre-clé) | Non couvert |
| Signaler l'interactif par la respiration | une zone qui s'attrape ne colle pas à ses voisins ; le vide autour d'un contrôle fait partie du contrôle | Partiel — cible 44px (ACCESSIBILITY/BUTTON) et paddings par composant ; le raisonnement d'affordance par le vide n'est écrit nulle part (INTERACTION ne parle pas du vide) |
| Laisser respirer la lecture | mesure et interligne | Couvert par TYPOGRAPHY (measure.reading-max, interlignes) |

## 2. Par rythme vertical (la cadence de la page)

| Cas | Attendu | Couverture |
|---|---|---|
| Empiler des blocs dans une région | échelle de pile monotone : intra-bloc < entre frères < entre groupes < entre sections | Couvert par SPACING 1.2.0 (rythme vertical — un usage de l'échelle, pas une seconde échelle) |
| Espacer un titre | plus proche de ce qu'il ouvre que de ce qu'il ferme | Couvert par SPACING 1.2.0 |
| Accrocher les hauteurs à la grille de base | `scale.*` et espacements verticaux en multiples de `spacing.base` | Couvert par SPACING 1.2.0 (déjà conforme dans les faits, rendu obligatoire) |
| Accrocher les interlignes à la grille | interligne calculé tombant sur la grille de base | Couvert négativement — baseline SOUPLE assumée : aucun interligne n'est conforme aujourd'hui (body 25,6 px ; body-small 21 ; label 14,4 ; display 52,8) ; la posture stricte reste documentée en « À approfondir » de SPACING-UX |
| Rythme répété d'une collection | même écart répété = même relation, sans dérive locale | Couvert par SPACING (échelle fermée) — implicite avant 1.2.0, énoncé verticalement depuis |
| Fluid type vs baseline | les titres fluides ne tombent sur aucune grille fixe | Couvert négativement — exemption documentée (SPACING 1.2.0) |

## 3. Par anti-usage (là où le vide ment)

| Cas | Verdict attendu | Couverture |
|---|---|---|
| Espace égal entre éléments liés et non liés | Interdit — la proximité doit différencier | Couvert par SPACING (monotonie) |
| Combler le vide « parce qu'il reste de la place » | Interdit — le vide n'est pas un défaut à remplir (horror vacui) | Non couvert — le mythe n'est réfuté nulle part |
| Choisir un espacement à l'œil, écran par écran | Interdit — toute valeur vient de l'échelle | Couvert par SPACING (échelle fermée, STOP et remontée) |
| Aérer une action destructive pour l'adoucir | Interdit — l'espace ne contredit pas la sémantique | Non couvert — miroir spatial de « n'édulcorez pas un danger en warning » (ALERT/VOICE), jamais écrit pour le vide |
| Densifier pour « faire professionnel » | la densité est un décalage d'un cran, pas un régime libre | Couvert par SPACING (densité) |
| Un saut d'échelle qui sépare ce qui est lié | Interdit — un vide au mauvais endroit ment autant qu'une proximité fausse | Partiel — la monotonie l'implique, aucun cas ne le montre |

## 4. Par registre d'identité (la signature du système)

| Cas | Attendu | Couverture |
|---|---|---|
| La générosité globale comme parti pris | une position déclarée (aéré vs dense), pas une résultante subie | Non couvert — miroir du « productif seulement » de MOTION : un parti pris d'identité paramétrable, jamais déclaré pour l'espace |
| Régimes de densité par contexte (dashboard vs vitrine) | des régimes nommés au niveau page/gabarit | Partiel — densité par composant (comfortable/compact) ; rien au niveau gabarit |

## Sources de cadrage

| Affirmation | Source | Statut |
|---|---|---|
| La proximité est le premier signal de relation | [Laws of UX — Law of Proximity](https://lawsofux.com/law-of-proximity/), [Carbon — Spacing](https://carbondesignsystem.com/elements/spacing/overview/) | Établi — déjà appliqué par SPACING |
| L'isolement met en valeur | [Laws of UX — Von Restorff Effect](https://lawsofux.com/von-restorff-effect/) | Établi — catalogué (LAWS), non appliqué |
| Le vide n'est pas de l'espace perdu (compréhension, attention) | [NN/g — The Power of White Space](https://www.nngroup.com/articles/whitespace/) | Établi |
| Composer sur un rythme vertical commun | [Richard Rutter — Compose to a vertical rhythm](https://webtypography.net/2.2.2) | Établi dans la tradition typographique ; transposé ici en baseline souple (SPACING 1.2.0) |
| Le white-space comme matériau d'identité (luxe aéré vs utilitaire dense) | pratique constante du print et du web éditorial | À sourcer précisément si le registre d'identité est retenu |

## Bilan

21 cas cartographiés : 11 couverts (SPACING porte déjà l'essentiel de la proximité, et le rythme
vertical depuis 1.2.0), 2 couverts négativement (baseline souple, fluid type — positions assumées),
3 partiels, 5 non couverts. Ratio de trous 8/21 — conforme à la série des inventaires.

Les trous réels se concentrent sur quatre sens du vide : **l'isolement et le poids** (Von Restorff
appliqué), **l'affordance par la respiration**, **les anti-usages du vide menteur** (horror vacui,
aérer un danger), et **le registre d'identité** (la générosité déclarée). Tous sont transversaux :
ils parlent de composition entre sujets, pas d'un composant.

### Remontées — à trancher AVANT toute rédaction

1. **La nature.** Deux architectures possibles : (a) un **langage `whitespace` mince**, propriétaire
   du sens transversal du vide, qui renvoie aux propriétaires sans rien dupliquer (modèle
   accessibility : compose SPACING/TYPOGRAPHY/GRID/INTERACTION, aucun token propre) ; (b) **pas de
   nouveau sujet** : combler isolement + poids chez SPACING, l'affordance chez INTERACTION,
   l'identité dans DESIGN.md. Le test de la taxonomie (« exprime-t-il quelque chose ? ») penche
   pour (a) ; l'économie de sujets penche pour (b).
2. **La table d'autorité** si (a) : SPACING garde les valeurs, l'échelle et la mécanique
   (proximité, rythme) ; WHITESPACE dit ce que le vide SIGNIFIE et arbitre ses conflits de sens ;
   INTERACTION garde l'affordance des rôles — le vide la renforce, il ne la remplace jamais.
3. **Baseline stricte ou souple** : tranché provisoirement SOUPLE (SPACING 1.2.0, chiffres à
   l'appui) — à réviser ici si le langage naît et que le rythme devient sa colonne vertébrale.
4. **Aucun token nouveau** ne se justifie à ce stade (un token naît d'un besoin réel) ; le registre
   d'identité, s'il est retenu, se déclarerait en parti pris — comme le « productif seulement » de
   motion — pas en valeurs.
