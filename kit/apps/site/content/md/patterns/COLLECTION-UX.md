---
component: collection
layer: ux
type: pattern # composition de plusieurs composants sur un écran, comme form
version: 1.0.2 # 1.0.2 : le consommateur de la clause « sans cible » devient Card mode=static explicite — l'API CardGroup.Card est supprimée (2026-07-30, une seule anatomie de carte) ; aucune règle modifiée. 1.0.1 : chemins repointés vers `content/md/` — fin de la migration vers le monorepo Sibyl DS (2026-07-27) ; aucune règle, aucun token, aucune source modifiés. 1.0.0 : première rédaction — le pattern lève la clause de naissance de la grille de colonnes (GRID-UX 1.1.0 : « la grille de colonnes naîtra avec le pattern collection/grille » — c'est fait). Inventaire et benchmark faits AVANT livraison. Arbitrages du 2026-07-21 (cf. DECISIONS.md) : grille intrinsèque via grid.item-min (256px), composé par le contenu (pas de 12 canonique), charger-plus > pagination > scroll-infini-jamais-seul, transfert du gap depuis CARD-UI.
last_updated: 2026-07-21
companion: COLLECTION-UI.md
confidence: mixed # la grille intrinsèque (colonnes émergentes de la largeur d'item) est établie techniquement et convergente avec le principe adaptatif ; le refus d'un 12-colonnes canonique est une décision interne assumée ; la position charger-plus/pagination/scroll infini s'appuie sur NN/g mais reste un arbitrage produit
---

# Collection — Couche UX (pattern de composition)

> Ce pattern orchestre **une grille d'items et ses outils** : la zone de collection, la mécanique des colonnes, la croissance (charger plus, pagination), le tri et les filtres, les états de chargement et de changement. Il fait naître la **grille de colonnes** que `GRID-UX.md` et `SPACING-UX.md` avaient différée jusqu'à son premier consommateur — c'est lui. Il ne réécrit rien de ce que `CARD` possède (modes, densité, ratio, troncature, empty states, squelettes) : la carte reste l'atome, la collection est la phrase. Source du besoin : `content/md/inventaires/inventaire-cas-usage-collection.md` + l'intention « Collection » du routeur, jusqu'ici sans pattern propriétaire.

## Note de transposition

RÈGLE [COLLECTION-R01] : `collection` est un **pattern** — une composition, pas un atome. Le modèle à axes ne s'y applique pas (comme `form`) : ses variables sont le **régime de grille** (items homogènes / composé) et la **densité**, qui appartient déjà à `CARD`. Aucun axe style/tone.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Un pattern de composition ne se décrit pas avec le modèle de variantes d'un composant atomique : ses variables sont ses régimes de composition et la densité de ses items, non des axes de style.

RÈGLE [COLLECTION-R02] : ce pattern **lève la clause de naissance** de la grille de colonnes. `GRID-UX.md` (§ Frontières) et `SPACING-UX.md` (§ note de transposition) l'avaient différée « jusqu'au pattern collection/grille » : la grille naît ici, et elle hérite des cadrages posés — les gouttières sont des tokens `spacing`, le cadre de page reste `grid.container-*`, une seule valeur nouvelle au besoin démontré (`grid.item-min`). La levée est actée dans `GRID-UX.md` 1.1.0 et journalisée (DECISIONS.md 2026-07-21).
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : La grille de colonnes appartient au pattern de collection, qui la fait naître ; les fondations de mise en page et d'espacement qui en avaient différé la définition gardent l'autorité sur le cadre de page et sur l'échelle des valeurs.

RÈGLE [COLLECTION-R03] : **transfert d'autorité** — le nombre de colonnes et la gouttière d'une collection appartiennent au pattern, pas à la carte. `CARD-UI.md` portait un `grid_gap` d'attente ; il renvoie désormais ici (même mécanisme que le transfert de la stratégie de validation d'INPUT vers FORM — journalisé, DECISIONS.md 2026-07-21).
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Le nombre de colonnes et la gouttière d'une collection sont détenus par le pattern de collection, non par le composant d'item qu'elle dispose.
MESURE : aucun token de gouttière de grille défini dans le composant d'item

## Frontières d'autorité (la table de référence)

| Question | Autorité |
|---|---|
| Contenu, modes, densité, ratio, troncature, empty states, squelette d'une carte | `CARD` |
| Nombre de colonnes, gouttières, régime de grille, croissance, outils de collection | `COLLECTION` (ce fichier) |
| Largeur du cadre de page, centrage, full-bleed | `GRID` |
| Valeurs d'espacement (gouttières incluses), proximité, régimes mobile/desktop | `SPACING` |
| Bascules dérivées du contenu, ordre DOM au reflux, divulgation par l'espace | `ADAPTIVE` |
| Hiérarchie des actions, zone tactile | `BUTTON` |
| Défauts annoncés, budget de décision de l'écran, coût jamais caché | `COGNITIVE-LOAD` |
| Formulation des compteurs, libellés de tri, états vides | `VOICE` |

## But

Une collection promet une chose : la **prédictibilité**. Les mêmes items, au même rythme, dans un ordre lisible — pour que l'utilisateur balaye au lieu de déchiffrer. Toute la mécanique ci-dessous (colonnes émergentes, gouttières constantes, croissance contrôlée, tri déclaré) sert cette promesse ; chaque écart la rompt.

## Les deux régimes

RÈGLE [COLLECTION-R04] : régime **items homogènes** — le cas de référence : résultats, catalogue, galerie. Tous les items ont le même poids, la même largeur ; la grille est **intrinsèque** (colonnes émergentes, voir ci-dessous).
STATUT : parti pris d'identité
SOURCE : S1
ÉNONCÉ : Une collection d'items homogènes présente des items de même poids et de même largeur, disposés sur une grille dont les colonnes émergent d'une largeur minimale d'item.

RÈGLE [COLLECTION-R05] : régime **composé** — le dashboard : des widgets de tailles différentes dont la hiérarchie vient de la **taille dans la grille** (règle `CARD`), sur une grille **explicite** à colonnes égales, spans en cellules entières, mêmes gouttières. Le nombre de colonnes du composé se choisit par le contenu du dashboard, pas par un 12 canonique copié — divergence assumée vs Carbon/Material, journalisée, à éprouver au premier dashboard réel.
STATUT : parti pris d'identité
SOURCE : S4
ÉNONCÉ : Une collection composée dispose des blocs de tailles différentes sur une grille explicite à colonnes égales, chaque bloc occupant un nombre entier de cellules, le nombre de colonnes se choisissant sur le contenu plutôt que sur un nombre canonique repris d'un autre système.
MESURE : toute portée de bloc s'exprime en nombre entier de colonnes

RÈGLE [COLLECTION-R06] : une collection ne mélange pas les régimes — un dashboard peut *contenir* une grille d'items homogènes (widget-liste), l'inverse n'existe pas.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Une même collection n'applique qu'un seul régime de grille ; une collection composée peut contenir une collection d'items homogènes, jamais l'inverse.

## La grille intrinsèque (régime de référence)

RÈGLE [COLLECTION-R07] : le nombre de colonnes **émerge** de deux facteurs : la largeur minimale d'un item (`grid.item-min`) et l'espace réellement disponible. Il n'est **jamais** fixé par appareil ni par breakpoint intermédiaire — c'est la déclinaison grille du principe adaptatif (les seuils viennent du contenu).
STATUT : parti pris d'identité
SOURCE : S1, S2, S4
ÉNONCÉ : Le nombre de colonnes d'une collection se déduit de la largeur minimale d'un item et de l'espace réellement disponible dans son conteneur, jamais d'une classe d'appareil ni d'un point de rupture intermédiaire.
MESURE : aucune requête média ne fixe un nombre de colonnes de collection

> **Pourquoi** : une grille « 4 colonnes desktop / 2 tablette / 1 mobile » fige des classes d'appareils que le produit ne mesure pas et casse dans une sidebar ou un split-screen (le viewport large ne garantit pas un conteneur large — `ADAPTIVE`). Une grille pilotée par la largeur d'item est juste partout, sans palier à maintenir. Technique CSS d'une ligne, établie (cf. `COLLECTION-UI.md`).

RÈGLE [COLLECTION-R08] : sous `breakpoint.mobile`, la grille passe en **colonne unique** pleine largeur — c'est la règle que `DESIGN.md` notait déjà sur le token (« grille de cartes → 1 colonne ») ; elle trouve ici son propriétaire.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Sous le point de rupture mobile, la collection s'affiche en colonne unique occupant toute la largeur disponible.
MESURE : une seule colonne d'items en dessous du point de rupture mobile

RÈGLE [COLLECTION-R09] : la **dernière rangée incomplète** reste alignée au flux de lecture — les items gardent leur largeur, rien ne s'étire pour « remplir » (la déformation casse l'uniformité que la collection promet).
STATUT : parti pris d'identité
SOURCE : S1
ÉNONCÉ : La dernière rangée incomplète conserve la largeur d'item des rangées pleines : aucun item ne s'étire pour combler l'espace restant.
MESURE : la largeur d'item de la dernière rangée est égale à celle des rangées précédentes

RÈGLE [COLLECTION-R10] : le **reflux ne réordonne jamais** — 3→2→1 colonnes préserve l'ordre de lecture et l'ordre DOM (`ADAPTIVE` fait autorité) ; la grille ne « remonte » pas un item mis en avant, la mise en avant est un choix d'ordre, pas de layout.
STATUT : propriété universelle
SOURCE : S8, S9, S2
ÉNONCÉ : Le passage d'un nombre de colonnes à un autre préserve l'ordre de lecture, l'ordre du document et l'ordre de focus ; la mise en avant d'un item se décide par son rang, jamais par une réorganisation visuelle qui contredit l'ordre programmatique.
MESURE : l'ordre visuel des items est identique à l'ordre du document à toutes les largeurs ; aucune propriété d'ordre CSS sur les items

RÈGLE [COLLECTION-R11] : une collection d'**un ou deux items** garde sa grille et ses largeurs — pas de mise en scène spéciale du petit nombre ; la stabilité prime quand la collection grandira.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Une collection réduite à un ou deux items conserve la grille et les largeurs de la collection pleine, sans mise en scène particulière du petit nombre.

## Gouttières et zone de collection

RÈGLE [COLLECTION-R12] : la gouttière (inter-colonnes et inter-rangées, une seule valeur) est un token `spacing`, appareillé à la densité de la collection : `comfortable` et `compact` ont chacun leur gouttière (mapping dans `COLLECTION-UI.md`). Jamais de token « grid.gutter » propre — cadrage `SPACING` respecté.
STATUT : parti pris d'identité
SOURCE : S5
ÉNONCÉ : Une collection n'utilise qu'une seule valeur de gouttière, identique entre colonnes et rangées, prise dans l'échelle d'espacement du système et appariée à la densité de la collection.
MESURE : gouttière horizontale égale à la gouttière verticale, résolue vers un token d'espacement

RÈGLE [COLLECTION-R13] : la **zone de collection** peut se distinguer de la page par le fond `surface` (le token a été calibré pour exactement cette distinction) — elle regroupe la grille ET ses outils (barre de tri/filtres, compteur) en une région perçue comme une (Gestalt, région commune — via le catalogue des lois).
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : La zone de collection peut se distinguer du fond de page par une surface propre, qui englobe la grille et ses outils comme une seule région perçue.

## Outils de la collection

RÈGLE [COLLECTION-R14] : les outils (tri, filtres, recherche, compteur) vivent **au-dessus de la grille**, position constante ; ils portent sur toute la collection — un contrôle qui ne porte que sur un item vit dans sa carte (`CARD`, zone d'actions).
STATUT : parti pris d'identité
SOURCE : S16
ÉNONCÉ : Les outils portant sur l'ensemble de la collection — tri, filtres, recherche, compteur — occupent une position constante au-dessus de la grille ; un contrôle qui ne porte que sur un item appartient à cet item.

RÈGLE [COLLECTION-R15] : le **tri par défaut est annoncé** — la collection arrive triée par un défaut sensé ET visible (« Récents d'abord »), jamais silencieux. C'est le cas « En attente » de l'inventaire charge-cognitive qui trouve ici son propriétaire (`COGNITIVE-LOAD` pose l'obligation de défaut, ce pattern la mécanise).
STATUT : parti pris d'identité
SOURCE : S18
ÉNONCÉ : Le tri appliqué par défaut est visible et nommé dans l'interface : une collection n'arrive jamais triée silencieusement.
MESURE : un libellé de tri est affiché à l'arrivée sur la collection

RÈGLE [COLLECTION-R16] : un **filtre actif d'office se déclare** — il ne cache jamais silencieusement une partie des résultats (déclinaison directe de la frontière dure « jamais un coût caché » : un sous-ensemble non déclaré est une information cachée).
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Un filtre actif dès l'arrivée sur la collection est déclaré visiblement : aucune restriction du jeu de résultats n'est appliquée sans que l'utilisateur puisse la constater.

RÈGLE [COLLECTION-R17] : les **filtres actifs restent visibles** et se retirent d'un geste ; le **compteur de résultats** se met à jour avec eux (formulation : `VOICE`).
STATUT : propriété universelle
SOURCE : S16, S17, S7
ÉNONCÉ : Les filtres actifs restent affichés, chacun retirable d'un seul geste, et le compteur de résultats reflète le jeu filtré à chaque changement.
MESURE : chaque filtre actif est affiché avec un moyen de retrait direct ; le nombre affiché par le compteur correspond au jeu de résultats filtré

RÈGLE [COLLECTION-R18] : ((périmètre)) la **mécanique des contrôles** de la barre d'outils attend ses composants — select, chips de filtre n'existent pas dans le système. Un build qui en a besoin **s'arrête et remonte** ; ce pattern pose les obligations, pas les contrôles.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Ce document pose les obligations de la barre d'outils sans définir les contrôles qui la composent : un besoin de contrôle absent du système suspend l'implémentation et est remonté.

## Croissance — charger plus, pagination, scroll infini

RÈGLE [COLLECTION-R19] : une collection longue grandit par **« Charger plus »** par défaut : l'utilisateur garde le contrôle, le pied de page reste atteignable, la position reste stable.
STATUT : parti pris d'identité
SOURCE : S3, S15
ÉNONCÉ : Par défaut, une collection longue s'étend sur demande explicite de l'utilisateur, sans déplacer sa position de lecture ni éloigner le pied de page.

RÈGLE [COLLECTION-R20] : la **pagination** remplace « Charger plus » quand la *position* a de la valeur — résultats à citer, retrouver, comparer (« page 3 ») ; elle est le seul mode qui rend un emplacement adressable.
STATUT : parti pris d'identité
SOURCE : S15, S3
ÉNONCÉ : La pagination remplace l'extension à la demande lorsque la position d'un résultat doit être adressable — citée, retrouvée ou comparée.

RÈGLE [COLLECTION-R21] : le **scroll infini n'est jamais seul** — s'il existe, il est doublé d'un chemin fini (charger-plus ou pagination) et n'emporte jamais un écran qui a un footer à atteindre. Position NN/g adoptée : le scroll infini convient au flux de découverte, pas à la recherche orientée but.
STATUT : parti pris d'identité
SOURCE : S3, S15
ÉNONCÉ : Le défilement infini n'est jamais le seul moyen de parcourir une collection : il est doublé d'un chemin fini, et il est exclu d'un écran dont le pied de page doit rester atteignable.

RÈGLE [COLLECTION-R22] : **revenir à la collection restaure l'état** — position, tri, filtres. Une collection qui oublie où l'utilisateur en était lui fait payer deux fois le même parcours (reconnaissance plutôt que rappel, `COGNITIVE-LOAD`).
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Le retour à une collection déjà consultée en restaure la position, le tri et les filtres.

RÈGLE [COLLECTION-R23] : si la **page suivante échoue**, l'acquis reste affiché — l'erreur est locale, réessayable, elle ne détruit jamais ce qui est déjà là (même logique que le succès partiel de `FORM`).
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : L'échec du chargement d'un incrément laisse en place les items déjà affichés et propose une reprise locale de la seule opération échouée.

## Chargement et changement

RÈGLE [COLLECTION-R24] : au chargement initial, des **squelettes** (`CARD` fait autorité sur leur anatomie) occupent un **nombre de cellules stable** — la grille ne saute pas quand le contenu arrive ; rien n'anime (`CARD`/`MOTION`).
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Au chargement initial, les marques d'attente occupent un nombre de cellules stable, de sorte que l'arrivée du contenu ne déplace pas la grille, et rien ne s'anime.
MESURE : aucun décalage de mise en page mesurable entre l'état d'attente et l'état chargé

RÈGLE [COLLECTION-R25] : trier ou filtrer **réorganise sans spectacle** — registre productif de `MOTION` (crans `base`, jamais de chorégraphie) ; sous `prefers-reduced-motion`, le résultat remplace l'ancien sans transition.
STATUT : propriété universelle
SOURCE : S11, S10
ÉNONCÉ : Un tri ou un filtrage réorganise la grille sobrement et sans changement de contexte — ni déplacement du focus, ni changement de vue imposé ; sous préférence de mouvement réduit, le nouveau résultat remplace l'ancien sans transition.
MESURE : sous préférence de mouvement réduit, aucune transition ni animation au changement de tri ou de filtre

RÈGLE [COLLECTION-R26] : un changement de résultats **s'annonce** aux technologies d'assistance (le compteur mis à jour dans une région live polie) — obligation posée ici, mécanique à éprouver à la première implémentation réelle (`ACCESSIBILITY` : annonce des changements dynamiques).
STATUT : propriété universelle
SOURCE : S7
ÉNONCÉ : Tout changement du jeu de résultats est annoncé aux technologies d'assistance par un message de statut déterminable programmatiquement, qui ne prend pas le focus.
MESURE : le compteur de résultats est exposé dans une région live polie et sa valeur change à chaque changement de résultats

RÈGLE [COLLECTION-R27] : les états **vide, sans résultat, erreur** appartiennent à `CARD` (empty states structurés) et `VOICE` (ton productif, jamais blâmer) — le pattern ne fait que garantir leur place : dans la zone de collection, à la place de la grille, jamais en toast éphémère.
STATUT : note de méthode
SOURCE : S12, S13, S14
ÉNONCÉ : Les états vide, sans résultat et en erreur sont rendus par le composant d'état vide et par le langage éditorial ; la collection garantit seulement qu'ils prennent la place de la grille et ne sont jamais éphémères.

## Orchestration des quatre Languages (au niveau pattern)

RÈGLE [COLLECTION-R28] : **Interaction** — une collection est une surface de consultation calme ; un seul mode d'interaction par collection (`CARD`), et la barre d'outils n'introduit pas de deuxième « primary » d'écran (budget de décision, `COGNITIVE-LOAD`).
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Le mode d'interaction des items relève du composant d'item et le budget d'actions de l'écran du principe de charge cognitive ; la barre d'outils d'une collection n'introduit pas d'action principale concurrente.

RÈGLE [COLLECTION-R29] : **Motion** — rien au chargement, sobriété au changement (ci-dessus) ; le mouvement confirme un tri demandé, il ne décore jamais une grille.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Le registre de mouvement d'une collection est celui du langage de motion : rien au chargement, sobriété au changement, aucune animation décorative.

RÈGLE [COLLECTION-R30] : **Voice** — compteurs, libellés de tri et états vides suivent la mécanique commune (nombres, casse) ; « sans résultat » décrit et propose, ne blâme pas.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : La formulation des compteurs, des libellés de tri et des états sans résultat relève du langage éditorial, qui décrit et propose sans blâmer.

RÈGLE [COLLECTION-R31] : **E-motion** — sans objet, comme pour la carte : tout ce qui se répète par item est disqualifié par le budget de rareté ; l'expression appartient au contenu injecté, jamais au conteneur.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : L'expression émotionnelle est sans objet au niveau du conteneur de collection : ce qui se répète à chaque item est exclu par le budget de rareté et appartient au contenu injecté.

## Risque

| Cas | Risque principal | Sévérité |
|---|---|---|
| Colonnes fixées par appareil (4/2/1) | Grille cassée en sidebar/split, paliers à maintenir sans besoin | Moyenne à élevée |
| Filtre par défaut silencieux | Résultats invisibles sans le savoir — information cachée, confiance rompue | Élevée |
| Scroll infini seul | Footer inatteignable, position perdue, contrôle retiré | Élevée |
| Étirement de la dernière rangée (auto-fit) | Items déformés, uniformité rompue | Faible à moyenne |
| Grille qui saute au chargement (squelettes instables) | Repères perdus, clics ratés (layout shift) | Moyenne |
| Barre d'outils improvisée sans composants | Contrôles incohérents, dette d'accessibilité | Moyenne à élevée |
| État de collection oublié au retour | Parcours payé deux fois, abandon | Moyenne |

RÈGLE [COLLECTION-R33] : **le mode appartient à la collection, la cible appartient à l'élément.** Une collection ne porte qu'un seul mode d'interaction (R28) — mais tous ses éléments n'ont pas forcément une destination : une règle sans détail supplémentaire, une ligne sans fiche, une option indisponible. Un élément qui n'ouvre rien se déclare **sans cible** et perd alors *toute* affordance : pas de curseur d'action, pas de **surface** au survol, pas de relief, pas de cible étendue. Il garde sa place, sa forme et son rang dans la collection.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Dans une collection, le mode d'interaction est une propriété du groupe et la présence d'une cible une propriété de l'élément ; un élément sans cible ne présente aucun signal d'interaction.
MESURE : aucun élément dépourvu de destination ou de commande ne porte de curseur d'action, ne gagne de surface au survol, ni ne reçoit de relief.
CONTRE : **aucun système public relevé ne l'écrit.** Les motifs ARIA de liste et de grille documentent la sélection et le tri, jamais la disponibilité d'un élément isolé ; le motif Listbox ne mentionne même pas d'option désactivée (vérifié le 2026-07-27). Notre position est donc isolée, et assumée comme telle.
POURQUOI : sans cette séparation, il ne reste que deux issues, toutes deux mauvaises. Garder l'affordance partout fait promettre au survol un contenu qui n'existe pas — un mensonge d'interface, et la contradiction directe de « le relief est un signal, jamais un décor » (CARD-UX). Retirer l'affordance partout oblige à réintroduire un bouton explicite sur chaque élément qui, lui, mène quelque part : l'interface s'alourdit d'un contrôle par ligne pour compenser une information que la carte pouvait porter seule.

> **Ce qui change au survol est le PLAN, pas l'ombre.** Dans une collection, l'élément visé
> quitte le fond de page et gagne une **surface** — un plan qui porte le contenu et se détache
> de ce qui l'entoure. Le relief, lui, n'intervient qu'ensuite et seulement s'il est mérité.
> La distinction n'est pas cosmétique : c'est elle qui permet de signaler « visé » sans
> promettre « soulevé, donc pressable ». Le vocabulaire a désormais un propriétaire :
> `SURFACE-UX` (fondation ouverte le 2026-07-27, née de ce constat).
>
> **Corollaire — l'action se déclare.** Retirer l'affordance ne suffit pas : sur les éléments
> qui, eux, ont une cible, l'action est **nommée** (« Comprendre la règle → »), et ce libellé
> n'apparaît jamais sur un élément sans cible. Deux conséquences : le survol cesse d'être le
> seul indice — donc l'information existe aussi au clavier, au lecteur d'écran et sur un
> écran tactile où le survol n'existe pas ; et l'absence de texte accentué devient elle-même
> le signal qu'il n'y a rien à ouvrir. Le libellé est un **texte**, pas un lien : imbriquer
> un élément interactif dans une cible étendue est interdit (LINK-R16).
>
> **Portée** : la règle est écrite au niveau de la collection parce qu'elle ne concerne pas la carte.
> Elle vaut identiquement pour une liste dont certaines entrées sont dépliables, pour un tableau
> dont certaines lignes mènent à une fiche et d'autres non, pour un menu dont une option est
> momentanément indisponible. Le consommateur de référence est la collection de cartes :
> une `Card` qui surclasse le mode du groupe en `static` (carte SANS CIBLE, 2026-07-30 —
> l'ex-prop `inactive` de l'API supprimée `CardGroup.Card`) ; les suivants devront exposer
> la même distinction sous le même geste.

## Règle transversale

RÈGLE [COLLECTION-R32] : **la grille est un contrat, pas une décoration.** Ce que la collection promet — même largeur, même rythme, même ordre, mêmes règles pour chaque item — est exactement ce que l'utilisateur utilise pour balayer vite. Chaque exception locale (une carte plus large « pour mettre en avant », un ratio différent « juste ici ») dépense la prédictibilité de toute la collection. La mise en avant se fait par l'ordre, la taille *dans* la grille (régime composé) ou le contenu — jamais en cassant le contrat.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : L'uniformité de largeur, de rythme, d'ordre et de règles est le contrat d'une collection : la mise en avant d'un item passe par son rang, par sa taille en cellules ou par son contenu, jamais par une exception locale à ce contrat.

## Sources et niveau de confiance

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| S1 | Grille intrinsèque : colonnes émergentes via une largeur minimale d'item (une ligne de CSS, sans media query) | [web.dev — One-line layouts (RAM : repeat, auto, minmax)](https://web.dev/articles/one-line-layouts) ; [MDN — repeat() / minmax()](https://developer.mozilla.org/en-US/docs/Web/CSS/repeat) | Établi — technique standard documentée |
| S2 | Les seuils viennent du contenu, pas de l'appareil ; le conteneur ne garantit rien du viewport | `ADAPTIVE-UX.md` (principe interne, socle) | Établi en interne — cohérence de système |
| S3 | Scroll infini : contrôle réduit, footer inatteignable, mauvais pour la recherche orientée but ; alternatives charger-plus/pagination | [NN/g — Infinite Scrolling: When to Use It, When to Avoid It](https://www.nngroup.com/articles/infinite-scrolling-tips/) | Établi (recommandation argumentée) ; la répartition exacte par contexte reste un arbitrage produit |
| S4 | Grilles fixes des systèmes majeurs (Carbon 16 col / Material window classes) — écartées ici | [Carbon — 2x Grid](https://carbondesignsystem.com/elements/2x-grid/overview/), [Material — Responsive layout grid](https://m2.material.io/design/layout/responsive-layout-grid.html) | Établi chez eux — divergence interne assumée : pas de consommateur multi-produits qui justifie un N canonique |
| S5 | Gouttières = tokens spacing, grille héritière de l'échelle | `SPACING-UX.md` (cadrage journalisé 2026-07-16) | Décision interne établie |
| S6 | Uniformité (ratio, densité, mode, titre) comme promesse de la collection | `CARD-UX.md` | Établi en interne — le pattern orchestre, ne réécrit pas |
| S7 | Un message de statut — information sur le résultat d'une action, l'attente ou l'existence d'erreurs — doit être déterminable programmatiquement par un rôle ou une propriété et présentable par les technologies d'assistance sans recevoir le focus ; « 18 results returned » et « No results returned » sont donnés en exemples, tandis que la liste de résultats elle-même n'est pas un message de statut | [WCAG 2.2 — 4.1.3 Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) | Établi, standard (AA) — **la norme la plus directement applicable au compteur de résultats d'une collection** ; elle fonde aussi le fait que la grille ne doit pas être une région live |
| S8 | Lorsque l'ordre de présentation du contenu affecte son sens, une séquence de lecture correcte doit pouvoir être déterminée programmatiquement ; le repositionnement par CSS qui change le sens du contenu est un échec documenté | [WCAG 2.2 — 1.3.2 Meaningful Sequence](https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html) | Établi, standard (A) — fonde l'interdiction de réordonner visuellement au reflux |
| S9 | Les composants focalisables reçoivent le focus dans un ordre qui préserve le sens et l'opérabilité, y compris lorsque du contenu est inséré dynamiquement — la recommandation étant d'insérer le contenu dynamique immédiatement après son élément déclencheur | [WCAG 2.2 — 2.4.3 Focus Order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html) | Établi, standard (A) — s'applique au reflux et à l'insertion d'un incrément ; **la norme ne prescrit pas de mécanique de focus propre à la pagination, et le fichier n'en contient aucune règle** |
| S10 | Changer le réglage d'un composant d'interface ne doit pas provoquer automatiquement un changement de contexte sans que l'utilisateur en ait été averti ; la norme précise qu'« un changement de contenu n'est pas toujours un changement de contexte », les changements de contexte visant l'agent utilisateur, la zone d'affichage, le focus et le contenu qui change le sens de la page | [WCAG 2.2 — 3.2.2 On Input](https://www.w3.org/WAI/WCAG22/Understanding/on-input.html) | Établi, standard (A) — **vérifié et nuancé** : réordonner ou filtrer une liste de résultats est un changement de contenu, pas un changement de contexte ; un contrôle de tri qui s'applique à la sélection reste conforme tant qu'il ne déplace ni le focus ni la vue (technique SCR19) |
| S11 | La préférence de mouvement réduit est une caractéristique média standard indiquant que l'utilisateur demande la suppression, la réduction ou le remplacement des animations non essentielles | [MDN — prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) | Établi — standard CSS, fonde le remplacement sans transition au tri et au filtrage |
| S12 | Les états vides se répartissent en trois cas (absence de données, résultat d'une action de l'utilisateur, erreur ou permission) ; leur anatomie est image optionnelle, titre, corps, action principale optionnelle ; « les états vides apparaissent toujours dans l'espace resté vide, dans le contexte des données manquantes » et « remplacent l'élément qui s'afficherait normalement » — pour un tableau, l'état vide remplace le tableau, en-têtes compris | [Carbon — Empty states](https://carbondesignsystem.com/patterns/empty-states-pattern/) | Établi chez eux — **convention de design system, pas une norme** ; converge avec S13 et S14 sur la structure et le rôle, diverge sur le périmètre (Carbon accepte l'état vide partiel, Polaris le réserve à la page entière) |
| S13 | L'état vide est utilisé « quand une liste, un tableau ou un graphique n'a aucun élément ni donnée à afficher » ; il combine titre orienté action, illustration, corps et une seule action principale, et son ton évite de faire sentir l'échec à l'utilisateur ; Polaris le réserve explicitement aux pages entières | [Shopify Polaris — Empty state](https://polaris-react.shopify.com/components/layout-and-structure/empty-state) | Établi chez eux — convention ; divergence de périmètre notée avec S12 |
| S14 | « Un état vide apparaît lorsqu'il n'y a aucune donnée à afficher et décrit ce que l'utilisateur peut faire ensuite » | [Atlassian Design System — Empty state](https://atlassian.design/components/empty-state) | Établi chez eux — troisième système public convergent sur la définition (expliquer + proposer la suite) ; page peu détaillée, la convergence porte sur le principe, pas sur l'anatomie |
| S15 | La pagination est recommandée quand tout afficher sur une page allonge trop le chargement et que la plupart des utilisateurs ne consultent que les premières pages ; elle est déconseillée dans les parcours linéaires, et le défilement infini est écarté parce qu'il crée des problèmes de navigation au clavier ; le composant impose un repère de navigation étiqueté, l'indication de la page courante et le numéro de page dans le titre du document | [GOV.UK Design System — Pagination](https://design-system.service.gov.uk/components/pagination/) | Établi chez eux — deuxième source publique convergente avec S3 contre le défilement infini seul ; **les exigences d'accessibilité de la pagination (repère, page courante, titre) n'ont aucun équivalent dans ce fichier** |
| S16 | Les catégories de filtres se placent verticalement à gauche ou horizontalement au-dessus du jeu de données ; lorsqu'ils sont repliés, un indicateur visible signale que des filtres sont appliqués et en donne le nombre ; chaque catégorie offre un moyen de tout effacer, et un moyen global efface tous les filtres de toutes les catégories | [Carbon — Filtering](https://carbondesignsystem.com/patterns/filtering/) | Établi chez eux — converge avec S17 sur la visibilité et le retrait des filtres actifs ; **diverge sur la position** (gauche ou au-dessus), ce qui laisse notre « toujours au-dessus » en parti pris ; Carbon ne dit rien de l'annonce des changements aux technologies d'assistance |
| S17 | Les filtres appliqués sont rendus sous forme de pastilles retirables individuellement, avec une réinitialisation globale, l'ensemble formant une barre de contrôle solidaire de la liste ou du tableau | [Shopify Polaris — Filters](https://polaris-react.shopify.com/components/selection-and-input/filters) | Établi chez eux — avec S16, deux systèmes publics convergents : filtres actifs visibles, retirables un à un, effaçables en bloc |
| S18 | Un tableau expose les rôles table, row, columnheader/rowheader et cell, et « si le tableau contient des colonnes ou des rangées triables, aria-sort est positionné à la valeur appropriée sur la cellule d'en-tête de la colonne ou de la rangée triée » ; l'attribut ne doit être posé que sur un seul en-tête à la fois et se déplace vers la colonne nouvellement triée | [ARIA APG — Table Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/table/) ; [MDN — aria-sort](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-sort) | Établi, norme — **mais sans consommateur dans ce fichier** : la collection ne documente aucun régime tabulaire, aucune règle d'en-têtes de colonnes ni d'état de tri programmatique ; la déclaration visible du tri par défaut est notre parti pris, sa contrepartie normative pour un rendu en tableau est ici |

CONFIANCE : la mécanique de grille intrinsèque est établie (technique standard + cohérence avec le principe adaptatif) ; le refus d'un nombre de colonnes canonique et la hiérarchie charger-plus > pagination > scroll-infini-doublé sont des **positions du système** (convergence NN/g pour la seconde), à éprouver au premier consommateur réel. Décision non tranchée par une règle (colonnes du régime composé, contrôle de barre d'outils manquant, virtualisation, kanban) : STOP — remonter.

## À approfondir

- **`grid.item-min` (256px)** : valeur arbitrée (64 × la grille de base, fourchette 240-320 observée) — à éprouver au premier consommateur réel, ajustable sur besoin.
- **Colonnes du régime composé** : « par le contenu » est la position ; le premier dashboard réel dira si un nombre canonique outillerait mieux les spans.
- **Barre d'outils** : les composants manquants (select, chips de filtre) naîtront de leur propre pipeline ; jusque-là, tout build qui en a besoin remonte.
- **Région live du compteur** : obligation posée, mécanique à éprouver à la première implémentation (avec les tests manuels du principe d'accessibilité).
- **Extension `collection-kanban`** : promise par CARD-UX (§ Kanban) — réordonnancement fin, affordance de saisie, live region de drag ; à faire naître sur besoin réel, comme les extensions form-*.
- **Virtualisation** : position à prendre avant tout consommateur de liste très longue — casse facilement balisage liste et recherche navigateur.
- **Retour à la collection** : l'obligation de restauration (position, tri, filtres) est posée ; la mécanique appartient au produit consommateur, à documenter au premier cas réel.
