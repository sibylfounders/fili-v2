# Inventaire des cas d'usage — Surface (fondation)

> Inventaire des *usages du plan* chez les consommateurs. Sert de checklist au test de couverture de `SURFACE-UX.md`. Particularité : cette fondation naît d'un **diagnostic d'absence** — la notion était employée par cinq sujets (`ELEVATION-UX` 20 fois, `CARD-UX` 19 fois, `MODAL-UX`/`MODAL-UI` 27 fois à elles deux, `OVERLAY-UI` 15 fois) et portée par quatre jetons, sans qu'aucun ne dise ce qu'est un plan ni quand il existe. L'inventaire recense donc autant des usages **déjà en production sans doctrine** que des cas à venir.

---

## 1. Par rôle de plan

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Fond de page | `background` — le plan de référence dont tout se détache | Couvert — nommé rôle à part entière : ce n'est pas une surface, c'est ce contre quoi une surface se mesure |
| Plan de repos d'une carte | Ce que porte une carte quand rien ne la vise | Couvert après test — **elle ne porte aucun plan propre** (`.cg-card::before` peint `var(--background)`) ; le cas nominal est l'absence de plan, l'espace suffit |
| Plan de zone / de collection | Zone qui regroupe plusieurs éléments | Couvert — `surface`, un seul cran, 1,10:1 assumé subtil |
| Plan visé (survol) | Le plan qui apparaît sous l'élément pointé | Couvert — c'est le domaine propre de la fondation (R04, R05) |
| Plan inversé | Renversement local du rapport texte/fond | Couvert par la règle, **contredit par les jetons** — `surface-contrast` (DS-MD) contre `surface-inverse` (DS-UI) : cf. § 5 |
| Plan de superposé (modale, tiroir) | La surface d'une couche au-dessus du flux | Couvert par renvoi — la surface existe, mais elle se distingue par le **relief et le voile**, pas par son remplissage : elle porte `background` au-dessus d'un scrim (OVERLAY-UI) |
| Plan sémantique de zone | Une zone entière en `danger-subtle` ou `warning-subtle` | **Non couvert actuellement** — les fonds `*-subtle` sont des *tones* (registre sémantique), jamais des rôles de plan ; aucun consommateur ne peint une zone en sémantique, et la règle R11 l'interdit tant qu'aucun besoin réel ne se présente |

## 2. Par canal de distinction

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Distinction par remplissage | Le plan se voit parce qu'il est d'une autre couleur | Couvert — et déclaré **fragile** : c'est le seul des quatre canaux que le mode dégradé annule intégralement |
| Distinction par trait | Le plan se voit parce qu'il est cerné | Couvert par renvoi — le trait appartient à BORDER ; SURFACE dit seulement qu'il est le dernier signal survivant |
| Distinction par rayon | Le plan se voit parce que ses coins le détachent | Couvert par renvoi — RADIUS ; un rayon seul ne distingue rien sans un des trois autres canaux |
| Distinction par élévation | Le plan se voit parce qu'il porte une ombre | Couvert par renvoi — ELEVATION ; et l'ombre **ne compte pas** dans un seuil de contraste (WCAG 1.4.11) |
| Aucune distinction | Le contenu vit directement sur la page | Couvert — **c'est le cas nominal** (R10) : l'espace d'abord, le plan ensuite, le trait en dernier |
| Distinction par translucidité ou flou | Plan « verre » laissant transparaître le dessous | **Non couvert actuellement** — aucun jeton, aucun consommateur, coût de peinture connu. Noté, non provisionné |
| Distinction sur média (image, dégradé) | Un plan posé au-dessus d'une photo ou d'un dégradé | **Non couvert actuellement** — le voisinage devient imprévisible et le seuil de R08 incalculable. Même trou que BORDER-R11 (anneau de focus sur fond arbitraire) : les deux se rouvriront ensemble |

## 3. Par état et comportement dans le temps

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Repos → visé | Le plan apparaît ou change au survol | Couvert — signal de **visée**, distinct du relief (R04) ; c'est le fait déclencheur de la fondation |
| Visé **et** soulevé | Les deux signaux ensemble sur une carte cliquable | Couvert après test — la répartition réelle est complémentaire : les deux en collection, le remplissage seul en mode solo (`.cardgrp.solo .cg-lift{display:none}`) |
| Visé sans être actionnable | Une carte inactive dans une collection interactive | Couvert — `.cg-card--inactive` retire le relief et le curseur ; le plan de visée reste écarté côté script |
| Repos → sélectionné | Le plan change pour marquer une sélection | Couvert par renvoi — la sélection porte un canal non chromatique obligatoire (coche, CARD-UI) ; le plan seul ne suffit jamais |
| Repos → désactivé | Un plan désactivé | **Non couvert actuellement** — aucun rôle de plan désactivé n'existe ; `text-disabled` existe seul, sans plan associé |
| Transition du remplissage | Le plan change de couleur | Couvert — `motion.fast` sur la couleur de fond uniquement ; l'ombre ne s'interpole jamais (ELEVATION-R14) |
| Mouvement réduit | `prefers-reduced-motion: reduce` | Couvert — le déplacement du plan glissant tombe, l'opacité reste, l'état final n'est jamais supprimé |
| Plan collant au défilement | Un plan fixe au-dessus d'un plan qui défile | **Non couvert actuellement** — deux plans neutres identiques qui glissent l'un sur l'autre ne se distinguent pas ; conséquence directe du cran unique, apparaîtra avec le premier en-tête collant sur zone |

## 4. Par plateforme et environnement

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Thème clair | Cas de référence | Couvert — la surface s'assombrit par rapport au fond |
| Thème sombre | Le sens du décalage s'inverse | Couvert — `background` neutral.950 → `surface` neutral.800 : le plan **s'éclaircit**. La direction n'est pas « plus sombre », c'est « plus loin du fond de page » (R13) |
| Contraste élevé forcé | `forced-colors: active` | Couvert après test — et **reformulé** : les fonds ne disparaissent pas, ils sont **forcés aux couleurs système** et fusionnent ; l'ombre est supprimée ; le trait survit recoloré (R07) |
| Préférence de contraste élevé | `prefers-contrast: more` | **Non couvert actuellement** — nos plans restent à 1,10:1 sous cette préférence. Position déclarée, non oubli : la réponse sera « ajouter le trait », pas « assombrir le plan » |
| Zoom navigateur | Le plan grossit avec la boîte | Couvert — un plan n'a pas de dimension propre, il suit sa boîte ; rien de spécifique |
| Écran non calibré / faible luminosité | 1,10:1 en conditions dégradées | Couvert par la règle qui l'interdit comme signal d'identification (R08) — le seuil existe pour ces conditions-là |

## 5. Par enjeu et risque

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Plan promu délimitant | Un `surface` employé comme seul signal d'un composant | Couvert — **interdit mesuré** : 1,10:1 contre 3:1 requis (WCAG 1.4.11). Le rôle délimitant appartient au trait |
| Surface distinguée par son seul remplissage | Rien d'autre pour marquer sa frontière | Couvert — fusionne en couleurs forcées ; règle de déclaration d'un trait (SURFACE-U06) |
| Visée confondue avec pressabilité | Le remplissage de survol lu comme une promesse de clic | Couvert — R04 et R17 ; **et c'est le point où le secteur nous contredit** (Atlassian impose l'appairage surface + ombre) |
| Inflation de plans | Un fond gris par bloc, écran en damier | Couvert — hiérarchie espace → plan → trait (R10) |
| Deux plans neutres imbriqués | Une surface dans une surface | **Non couvert actuellement, et c'est le trou n°1** — le système n'a qu'un cran, les deux plans sont indiscernables. Six systèmes sur six vérifiés exposent une échelle ; nous sommes seuls sur le cran unique. Trois issues possibles (un second cran, un trait, l'interdiction d'imbriquer), à trancher avec le premier consommateur réel |
| Texte secondaire sur plan de survol | `text-secondary` sur `surface-hover` | **Non couvert actuellement** — la paire n'est pas déclarée dans `COLOR-UI` (`text-secondary` n'est garanti que sur `background` et `surface`). Aucun composant ne la franchit aujourd'hui, rien ne l'en empêche : interdite tant qu'elle n'est pas mesurée |
| Divergence du rôle inversé | `surface-contrast` #1C1C1E (DS-MD, mise en avant) contre `surface-inverse` #111827 (DS-UI, remplissage de contrôle) | **Non couvert actuellement** — deux noms, deux valeurs, deux rôles voisins. Divergence déjà tracée (`ds-md.contract.mjs`, arbitrage C2 dans `mapping-autorite.md`) ; cette fondation la **nomme**, elle ne la résout pas |
| Plan inversé consommé sans son couple | `surface-inverse` sans `text-inverse` | Couvert — couple obligatoire (SURFACE-U05), vérifié par `validate-contrast.mjs` |
| Remplissage écrit en dur | Un hex ou un `rgba()` à la place d'un rôle | Couvert — interdit (U07), le thème ne pourrait plus inverser la direction du plan |
| Plan neutre chargé de sens | Un gris qui se met à signifier « erreur » | Couvert — registres étanches (COLOR-R04), généralisé au plan (R11) |

---

## Bilan du test de couverture

Sur **34 cas recensés**, **9 sont non couverts** après la première rédaction de `SURFACE-UX.md`.

**Comblés en 1.0.0 (avant livraison)** : la définition même du plan (les cinq sujets consommateurs l'employaient sans elle) ; la séparation **visée / relief**, qui n'existait nulle part alors que le code pose déjà trois signaux distincts sur une même carte ; le seuil de 3:1 pour un plan identifiant, avec le constat mesuré que notre `surface` ne peut jamais le tenir ; la reformulation exacte du comportement en couleurs forcées (fusion aux couleurs système, non disparition) ; l'ordre espace → plan → trait, qui rend explicite que **l'absence de plan est le cas nominal** ; et la table d'autorité, qui borne la fondation face à ELEVATION, COLOR, BORDER, RADIUS, OVERLAY et SPACING.

**Restent non couverts, sans détour** :
1. **Plans imbriqués** (une surface dans une surface) — trou n°1, conséquence directe du cran unique, et notre divergence la plus nette avec le secteur.
2. **`text-secondary` sur `surface-hover`** — paire non déclarée dans `COLOR-UI`, donc interdite ; le comblement appartient à COLOR, pas ici.
3. **Divergence `surface-contrast` / `surface-inverse`** — deux noms, deux valeurs pour un rôle standard ailleurs ; arbitrage C2 ouvert.
4. **`prefers-contrast: more`** — aucun renforcement à ce jour, position déclarée.
5. **Plan sur média** (image, dégradé) — seuil incalculable ; se rouvrira avec BORDER-R11.
6. **Plans translucides / flou d'arrière-plan** — aucun jeton, aucun consommateur.
7. **Plan sémantique de zone** — interdit par R11 tant qu'aucun besoin réel ne se présente.
8. **Plan désactivé** — aucun rôle n'existe ; `text-disabled` vit sans plan associé.
9. **Plan collant au défilement** — deux plans neutres identiques qui glissent l'un sur l'autre.

**Deux critiques en puissance** : les cas 1 et 2. Le premier est structurel (il faudra créer, cerner ou interdire) ; le second est un trou de vérification qu'un seul composant distrait suffirait à franchir. Les sept autres attendent un consommateur qui n'existe pas.

**Note de méthode** : cette fondation renverse le constat habituel de nos inventaires (« les trous d'une fondation sont des contextes pas encore nés »). Ici, plusieurs trous concernent des usages **déjà en production** — un plan de survol peint depuis des semaines sans que rien ne dise ce qu'il signifie, un rôle inversé qui porte deux noms et deux valeurs selon le dépôt qu'on lit. C'est la signature d'une fondation née par diagnostic d'absence et non par besoin d'un composant : elle ne provisionne pas l'avenir, elle rattrape le présent.
