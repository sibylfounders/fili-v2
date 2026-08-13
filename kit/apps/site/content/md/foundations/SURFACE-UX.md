---
component: surface
layer: ux
type: foundation
version: 1.0.1 # 1.0.1 : mention de marque Sibyl → Fili en prose (migration 2026-07-29), aucune règle modifiée. 1.0.0 : première rédaction (2026-07-27) — la notion existait dans les jetons et dans cinq sujets sans avoir de propriétaire.
last_updated: 2026-07-27
companion: SURFACE-UI.md
confidence: mixed # la définition du plan, le seuil 3:1 quand il identifie seul et le comportement en couleurs forcées sont sourcés sur norme ou convergence ; le cran unique, la séparation surface/relief et l'ordre espace-fond-trait sont des partis pris d'identité, minoritaires et déclarés comme tels
---

# Surface — Couche UX (fondation)

> Ce fichier contient le raisonnement : ce qu'est un plan, quand il mérite d'exister, ce qui le distingue et ce qui survit quand un canal tombe. Les **valeurs** (`background`, `surface`, `surface-hover`, `surface-inverse`) vivent dans `DESIGN.md` et dans les jetons ; la grammaire d'application vit dans `SURFACE-UI.md`.

> **Lecture des décisions** — chaque règle porte un identifiant stable (`SURFACE-Rnn`), un **statut de frontière** et ses **sources** (références `S1…S14` de la bibliographie en fin de fichier ; `interne` quand la décision est nôtre). Les quatre statuts : `propriété universelle` (vraie de tout produit — auditable chez un tiers, et **seulement** si adossée à une norme ou à une convergence d'au moins deux systèmes publics chargés et lus), `parti pris d'identité` (notre choix, pas une norme — jamais imposé en audit), `implémentation de référence` (vrai de ce code, pas du design), `note de méthode` (hors audit).

## Note de transposition (à lire en premier)

RÈGLE [SURFACE-R01] : la surface est une **fondation** — pas d'axes, pas d'assemblage : une contrainte transversale. Particularité de trajectoire : elle naît **par diagnostic d'absence**, et non d'un composant ni d'un guardrail. Le mot « surface » est employé 20 fois par `ELEVATION-UX`, 19 fois par `CARD-UX`, 27 fois par `MODAL-UX` et `MODAL-UI` réunis, 15 fois par `OVERLAY-UI` — et quatre jetons le portaient (`background`, `surface`, `surface-hover`, `surface-inverse`) sans qu'aucun sujet ne dise **ce que c'est**. Cette fondation ne prend rien à personne : elle ramasse ce que personne n'avait pris.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : La surface est une fondation transversale née d'un diagnostic d'absence : la notion était employée partout et définie nulle part.

## Ce qu'est une surface

RÈGLE [SURFACE-R02] : une **surface est un plan qui porte du contenu et se détache de ce qui l'entoure**. Trois conditions, toutes nécessaires : (1) une **étendue** — un plan, pas un trait ni un point ; (2) un **contenu porté** — elle existe pour ce qu'elle tient, jamais pour elle-même ; (3) une **distinction perceptible** d'avec son voisinage. Un aplat coloré sans contenu est un décor, pas une surface. Un contenu sans distinction d'avec la page n'est pas sur une surface — il est sur la page, et c'est très souvent la bonne réponse.
STATUT : propriété universelle
SOURCE : S1, S2, S3, S4, S10, S11, S12
ÉNONCÉ : Une surface est un plan étendu qui porte du contenu et se distingue de son voisinage ; un aplat sans contenu est un décor et non une surface.
MESURE : tout plan documenté comme surface nomme le contenu qu'il porte et le voisinage dont il se distingue
POURQUOI : sans cette définition, « surface » devient un synonyme mou de « fond », et l'on tokenise des couleurs de remplissage au lieu de nommer des plans. Six systèmes sur six vérifiés le 2026-07-27 nomment ce plan explicitement et lui donnent une échelle — c'est le concept le mieux établi de cette fondation, et c'est précisément celui qui nous manquait.

RÈGLE [SURFACE-R03] : ce système nomme **quatre rôles de plan**, et un seul cran de profondeur :
STATUT : parti pris d'identité
SOURCE : S1, S13
ÉNONCÉ : Le système expose quatre rôles de plan — fond de page, surface, surface visée, surface inversée — et un seul cran de profondeur entre le fond de page et la surface.
MESURE : aucun plan neutre hors des quatre rôles nommés ; aucune surface imbriquée dans une autre surface avec un remplissage différent
  1. **`background`** — le **fond de page**. Le plan de référence, celui dont tout le reste se détache. Ce n'est pas une surface : c'est ce contre quoi une surface se mesure.
  2. **`surface`** — **un** plan qui se détache du fond. Un seul cran, volontairement subtil.
  3. **`surface-hover`** — l'**état visé** d'un plan (et le remplissage qui *apparaît* sous les styles sans fond au repos).
  4. **`surface-inverse`** — le plan **inversé** : le rapport texte/fond s'y renverse localement, sans changer de thème.
CONTRE : **six systèmes sur six vérifiés exposent une échelle de plans empilables, aucun ne tient un cran unique.** Carbon empile quatre niveaux (`background`, `layer-01/02/03`) ; Material Web expose `surface` plus cinq conteneurs (`surface-container` et ses variantes *lowest/low/high/highest*) plus `surface-dim` et `surface-bright` ; Fluent 2 aligne six `colorNeutralBackground` ; Atlassian quatre surfaces d'élévation (*sunken*, défaut, *raised*, *overlay*) ; Polaris trois niveaux de proéminence ; Primer trois plans neutres (*default*, *muted*, *inset*). Notre cran unique est une position **isolée**, tenue parce qu'aucun de nos écrans n'imbrique aujourd'hui deux plans neutres — et non parce que le secteur nous suivrait.

> **Pourquoi** : la conséquence directe du cran unique est qu'**une surface dans une surface est indiscernable chez nous**. C'est un manque assumé, pas un oubli : le jour où un panneau contient une zone qui contient une carte, il faudra soit un second cran, soit un trait, soit une décision de ne pas imbriquer. L'inventaire le porte en tête de ses cas non couverts.

## Gagner une surface est un signal d'interaction

RÈGLE [SURFACE-R04] : **gagner une surface est un signal d'interaction, et ce n'est pas le relief.** Le fait déclencheur est vérifiable dans `card-group.css` : une carte **au repos** porte `var(--background)` — le fond de la page, donc aucun plan propre ; une carte **visée par le pointeur** porte `var(--surface)` ; et le **relief** (`var(--elevation-raised)`, sur une couche `.cg-lift` distincte) est un **troisième signal encore différent**, qui n'apparaît que sur les cartes cliquables ou sélectionnables. Les deux disent deux choses différentes : la surface dit « c'est cet élément-là que tu vises », le relief dit « et celui-là, on peut le presser ». **« Visé » n'est pas « soulevé, donc pressable ».**
STATUT : parti pris d'identité
SOURCE : S3, S13
ÉNONCÉ : Le remplissage d'un plan au survol signale la visée, et le relief signale la pressabilité : ce sont deux signaux distincts, jamais synonymes.
MESURE : un plan qui gagne un remplissage au survol sans être actionnable ne gagne aucune élévation
CONTRE : **Atlassian impose l'inverse** — sa documentation d'élévation prescrit explicitement d'apparier toujours `elevation.surface.raised` avec `elevation.shadow.raised`, et `elevation.surface.overlay` avec `elevation.shadow.overlay`, l'appairage rompu figurant parmi ses interdits. Chez eux, surface et ombre sont **un seul** signal indissociable. Notre dissociation est un choix ; sur le seul système vérifié qui se prononce sur la question, elle est contredite.

> **Vérifié dans le code, et la répartition est plus fine que la règle** : dans une collection, le survol pose **les deux** signaux (le rectangle `--surface` glisse vers la carte visée, et `.cg-lift` révèle l'ombre) ; sur une carte **solo**, `.cg-lift` est désactivé et seul le remplissage `--surface` apparaît. La distribution est donc complémentaire — le relief sert là où plusieurs objets se disputent l'attention. Ce constat appartient à l'implémentation de référence, pas à la doctrine.

RÈGLE [SURFACE-R05] : le **survol d'un plan est exempté du seuil de contraste, mais pas de la lisibilité**. Le *Understanding* de WCAG 1.4.11 est explicite : les traitements visuels supplémentaires apportés par l'auteur pour le survol ne sont pas « requis pour identifier » l'état de survol, ils sont supplémentaires et n'ont pas à atteindre 3:1. Nous testons quand même les couples texte/fond sur chaque plan de survol — même position que `COLOR-R11` : un survol illisible reste un survol raté, même conforme.
STATUT : parti pris d'identité
SOURCE : S5, S9
ÉNONCÉ : Le remplissage de survol d'un plan n'est pas soumis au seuil de 3:1, mais les couples texte/fond qu'il crée sont vérifiés au même seuil que le repos.
MESURE : contraste texte / remplissage de survol vérifié à 4,5:1 pour tout texte fonctionnel posé dessus

## Par quoi une surface se distingue

RÈGLE [SURFACE-R06] : une surface se distingue par **quatre canaux, et seulement quatre** — le **remplissage**, le **trait**, le **rayon**, l'**élévation**. Aucun n'est obligatoire ; **au moins un doit être un choix**, et le choix se déclare. Si aucun des quatre n'est nécessaire, ce n'est pas une surface : c'est du contenu correctement espacé, et c'est le cas nominal.
STATUT : parti pris d'identité
SOURCE : S1, interne
ÉNONCÉ : Une surface se distingue par son remplissage, son trait, son rayon ou son élévation ; l'absence des quatre signifie que le plan n'a pas lieu d'exister.
MESURE : tout plan documenté comme surface déclare lequel ou lesquels des quatre canaux le distingue
POURQUOI : la fondation ne possède aucun de ces quatre canaux — elle possède la question « lequel, et pourquoi ». Sans elle, chaque composant rejoue le choix en silence, et l'on obtient quatre cartes distinguées de quatre manières.

RÈGLE [SURFACE-R07] : **en mode de couleurs forcées, le remplissage cesse de distinguer et le trait reste.** Formulation exacte, parce que la formulation courante est fausse : les fonds ne « disparaissent » pas — `background-color` et `border-color` sont **forcés aux couleurs système** (leurs valeurs d'auteur sont ignorées au moment du rendu), `box-shadow` est forcé à `none`, et `background-image` est forcé à `none` pour toute valeur non fondée sur `url()` — donc les dégradés. Le résultat pratique est plus dur qu'une disparition : **deux plans adjacents reçoivent la même couleur système et fusionnent**. Une surface qui ne se distinguait que par son remplissage n'existe plus ; le trait, lui, est recoloré et survit.
STATUT : propriété universelle
SOURCE : S6, S7
ÉNONCÉ : En mode de couleurs forcées, les remplissages de deux plans adjacents sont ramenés à la même couleur système et cessent de les distinguer, les ombres sont supprimées, et seul le trait survit en étant recoloré.
MESURE : toute surface dont la frontière porte de l'information reste identifiable en couleurs forcées par un trait ou par son contenu
CONTRE : la nuance corrige un raccourci répandu — et le nôtre. Dire « les fonds disparaissent » laisserait croire qu'une surface deviendrait transparente sur son voisin ; c'est l'**uniformisation**, pas la suppression, qui la fait disparaître. La conséquence est la même, la mesure ne l'est pas : on ne vérifie pas qu'un fond a disparu, on vérifie que la frontière reste lisible sans lui.

> **Pourquoi c'est décisif ici** : c'est l'argument que BORDER-R12 tenait déjà pour le trait, vu depuis le plan. Une surface est le plus fragile des quatre canaux — le seul dont le mode dégradé annule complètement la fonction. Une carte distinguée par son seul remplissage est une carte qui n'existe pas pour l'utilisateur en contraste forcé.

RÈGLE [SURFACE-R08] : **une surface qui identifie seule un composant atteint 3:1 avec ce qui l'entoure — et l'ombre ne compte pas dans ce calcul.** WCAG 1.4.11 admet explicitement le cas du remplissage identifiant : un aplat qui ne contraste pas avec le composant mais contraste avec les couleurs adjacentes satisfait le critère. Le même *Understanding* précise en revanche qu'une ombre portée en relief, comme un trait sombre entre deux fonds contrastés, est **absorbée dans la couleur voisine la plus proche en luminosité** : le relief ne rattrape jamais un plan sous le seuil. Constat mesuré chez nous : `surface` (#F3F4F6) sur `background` (#FFFFFF) tient **1,10:1** — délibérément subtil, documenté comme tel dans `DESIGN.md`, et **très en dessous de 3:1**. Conséquence directe et non négociable : **notre `surface` n'identifie jamais seule un composant d'interface.** Elle groupe, elle situe, elle accuse réception d'une visée. Elle ne délimite pas.
STATUT : propriété universelle
SOURCE : S5, S13
ÉNONCÉ : Un plan qui constitue le seul signal d'identification d'un composant d'interface atteint 3:1 avec les couleurs adjacentes, et aucune ombre n'est comptée dans ce calcul.
MESURE : contraste plan / voisinage ≥ 3:1 dès que le plan est le seul signal d'identification ; aucune ombre incluse dans la mesure

> **Erreur fréquente** : promouvoir `surface` en délimitant parce qu'« on le voit bien sur la maquette ». On le voit bien à 1,10:1 sur un écran calibré, en pleine lumière, avec une bonne vue. Le seuil existe pour les trois autres cas. Le rôle délimitant appartient au trait (`border-strong`, BORDER-R02) ; c'est la seule bonne réponse.

## Quand un plan mérite d'en devenir une

RÈGLE [SURFACE-R09] : un plan mérite de devenir une surface quand **au moins une** de ces quatre conditions est vraie — et le test se fait dans cet ordre :
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Un plan devient une surface s'il porte un contenu nommable et autonome, si sa frontière doit être perçue, s'il change d'état, ou s'il vit sur une autre couche du flux.
MESURE : toute surface documentée cite laquelle des quatre conditions la justifie
  1. **Elle porte un contenu autonome qu'on peut nommer** — « une carte produit », « le panneau de filtres ». Si le nom du plan n'est pas prononçable, le plan n'existe pas.
  2. **Sa frontière doit être perçue** — l'utilisateur a besoin de savoir où le contenu commence et finit (une zone déposable, un panneau redimensionnable).
  3. **Elle change d'état** — visée, sélectionnée, désactivée. Un plan qui a des états a besoin d'un plan sur lequel les exprimer.
  4. **Elle vit sur une autre couche du flux** — modale, tiroir, popover. Là, la surface n'est plus optionnelle : elle est ce qui sépare la couche du reste (et son voile appartient à OVERLAY).

RÈGLE [SURFACE-R10] : **l'espace d'abord, le plan ensuite, le trait en dernier.** La hiérarchie est celle que SPACING-UX a posée et que BORDER-R02 reprend pour le trait ; la surface s'y insère au milieu et non en tête. Un plan est un moyen **coûteux** : il ajoute une couleur, une frontière, un rayon à accorder, un jeu de paires texte/fond à revérifier, et un canal de plus à tenir en couleurs forcées. Le repos de nos cartes ne porte **aucun** remplissage propre — `.cg-card::before` peint `var(--background)`, c'est-à-dire le fond de la page — et c'est le cas **nominal**, pas une négligence : l'espace suffisait.
STATUT : parti pris d'identité
SOURCE : S13, interne
ÉNONCÉ : L'espace est essayé avant le plan, et le plan avant le trait ; un plan qui ne fait rien que l'espace ne ferait pas n'est pas créé.
MESURE : aucun plan créé là où une modification d'espacement produit la même lecture

> **Erreur fréquente** : donner un fond gris à un bloc « pour qu'on le voie ». À 1,10:1, on ne le voit pas — on le devine ; et sur dix blocs devinés, l'écran devient un damier sans hiérarchie. Le remède est presque toujours de l'espace, parfois un titre, rarement un plan.

RÈGLE [SURFACE-R11] : **une surface ne porte aucune sémantique.** Les quatre rôles de plan appartiennent au registre des **neutres** (COLOR-R03) : ils structurent la page, ils ne portent ni identité ni état. Les fonds `*-subtle` sémantiques (`danger-subtle`, `success-subtle`…) ne sont **pas** des surfaces : ce sont des *tones*, propriété du registre sémantique, et un plan qui porte un sens d'alerte relève d'un autre composant — pas d'une variante de surface (position déjà tenue par CARD-UX pour la carte, généralisée ici au plan).
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Les rôles de plan appartiennent au registre neutre : un plan neutre ne porte jamais d'état sémantique, et un fond sémantique n'est pas un rôle de plan.
MESURE : aucun jeton sémantique employé comme rôle de plan neutre, et réciproquement

RÈGLE [SURFACE-R12] : la **surface inversée est un rôle, pas un thème**. `surface-inverse` renverse localement le rapport texte/fond sans faire basculer le thème : elle exige donc son **couple complet** (`text-inverse`, `border-inverse`) et ne se dérive **jamais** en réutilisant les jetons de texte prévus pour fond clair. Le rôle existe chez quatre des six systèmes vérifiés — Carbon (`background-inverse`, avec son survol), Fluent 2 (`colorNeutralBackgroundInverted`), Primer (`bgColor-emphasis`), Polaris (variante *inverse*) : c'est un rôle nommé du secteur, pas une commodité locale.
STATUT : propriété universelle
SOURCE : S1, S2, S10, S11, S12, S14
ÉNONCÉ : Le plan inversé est un rôle nommé qui se consomme avec son couple de texte et de trait, et jamais en réutilisant les jetons prévus pour fond clair.
MESURE : tout usage du plan inversé consomme les jetons de texte et de trait inversés associés
CONTRE : **le système se contredit lui-même sur ce rôle, et cette fondation ne tranche pas.** `DESIGN.md` documente `surface-contrast` (#1C1C1E), présenté comme un panneau sombre de **mise en avant**, explicitement « jamais la surface de repos », sans consommateur à ce jour. Les jetons construits exposent, eux, `surface-inverse` (#111827 en clair, #FFFFFF en sombre), décrit dans la source comme la « surface neutre inversée (bouton neutral plein) » et qualifié d'extension DS-UI. **Deux noms, deux valeurs, deux rôles voisins mais distincts** — mise en avant d'un côté, inversion d'un remplissage de contrôle de l'autre. La divergence est déjà connue et tracée (`ds-md.contract.mjs`, entrée `colors.surface-contrast`, arbitrage C2 ouvert dans `mapping-autorite.md`) ; la nommer ici est le travail de cette fondation, la résoudre ne l'est pas.

## La surface et le thème

RÈGLE [SURFACE-R13] : **la direction d'un plan n'est pas « plus sombre », c'est « plus loin du fond de page ».** En thème clair, la surface s'assombrit par rapport au fond ; en thème sombre, elle s'**éclaircit**. Vérifiable dans nos jetons : en clair `background` = neutral.0 et `surface` = neutral.100 ; en sombre `background` = neutral.950 et `surface` = neutral.800 — le sens du décalage s'inverse, l'écart reste. Un thème redéfinit les quatre rôles comme il redéfinit ses couleurs ; aucun remplissage n'est écrit en dur hors de la définition de thème.
STATUT : propriété universelle
SOURCE : S2, S13
ÉNONCÉ : Un plan s'écarte du fond de page dans la direction que le thème impose — plus sombre en thème clair, plus clair en thème sombre — et les valeurs de plan appartiennent au thème.
MESURE : aucune valeur de remplissage de plan écrite hors de la définition de thème ; l'écart entre fond de page et surface est conservé dans les deux thèmes
POURQUOI : c'est la même mécanique que ELEVATION-R09 pour le relief, et elle a la même raison — en thème sombre, l'ombre ne porte plus la profondeur, c'est le plan qui la porte. Carbon organise d'ailleurs tout son modèle de couches sur ce principe, avec des jeux de jetons identiques d'un thème à l'autre.

RÈGLE [SURFACE-R14] : **`prefers-contrast: more` n'est pas traité, et c'est déclaré.** La préférence existe, elle est largement disponible depuis mai 2022, elle a quatre valeurs (`no-preference`, `more`, `less`, `custom`) et sa valeur `custom` correspond aux utilisateurs en `forced-colors: active`. Nos plans sont **volontairement subtils** (1,10:1) : sous `more`, ils le restent — nous ne renforçons rien. Position ouverte, non une omission : le jour où elle sera traitée, la réponse ne sera pas « assombrir la surface » mais « ajouter le trait », parce que c'est le canal qui tient dans tous les modes dégradés.
STATUT : parti pris d'identité
SOURCE : S8
ÉNONCÉ : Le système ne renforce aujourd'hui aucun plan sous la préférence de contraste élevé ; cette absence est une position déclarée et non un oubli.
MESURE : aucune règle de plan conditionnée à prefers-contrast à ce jour

## Table d'autorité — ce que SURFACE ne dit pas

RÈGLE [SURFACE-R15] : la fondation SURFACE **ne redéfinit rien** de ce que les fondations voisines possèdent déjà. Elle dit **ce qu'est un plan et quand il existe** ; tout le reste appartient à quelqu'un d'autre. Cette table est le cœur du fichier : elle est faite pour être opposée à cette fondation le jour où elle voudra déborder.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : SURFACE possède l'existence et la justification d'un plan ; le relief, la valeur, le trait, le rayon, le voile et l'espace appartiennent chacun à une autre fondation, qu'elle ne redéfinit jamais.

| Question posée | Propriétaire | Ce que SURFACE en dit |
|---|---|---|
| Ce plan est-il **posé, creusé ou plat** ? | `ELEVATION` (grammaire des natures, R04) | Rien. Elle n'attribue aucune nature à aucun plan. |
| Quelle **ombre**, à quelle **couche du flux** ? | `ELEVATION` (échelle `none`/`raised`/`overlay`, R02) | Rien — sinon qu'un plan et un relief sont **deux signaux distincts** (R04), et que l'ombre ne compte pas dans un seuil de contraste (R08). |
| Quelle **valeur**, quel **jeton**, quel **seuil** ? | `COLOR` (registres, paires garanties, R03/R09) | Rien. Elle consomme les rôles neutres de COLOR ; elle n'en crée aucun et n'en recalibre aucun. |
| Ce plan a-t-il un **trait**, de quelle couleur, à quel seuil ? | `BORDER` (trois rôles du trait, R02) | Rien — sinon que le trait est le **dernier signal survivant** quand le remplissage est neutralisé (R07). |
| Quel **rayon** ? | `RADIUS` (le cran suit la taille et le type, R03) | Rien. |
| Y a-t-il un **voile**, à quel cran d'**empilement** ? | `OVERLAY` (scrim, échelle z-index, R03/R04) | Rien. Une surface de superposé est une surface ; son voile et sa couche ne sont pas d'ici. |
| Combien d'**espace** autour et dedans ? | `SPACING` (échelle, hiérarchie) | Rien — sinon que **l'espace passe avant le plan** (R10). |
| **Ce plan existe-t-il, et pourquoi ?** | **`SURFACE`** | **Tout.** C'est sa seule question, et personne d'autre ne la posait. |
| **Qu'est-ce qui change quand on le vise ?** | **`SURFACE`** | **Tout.** Le remplissage de survol d'un plan est son domaine propre (R04, R05). |

> **Pourquoi cette table plutôt qu'une prose de frontières** : cinq sujets employaient le mot « surface » comme s'il était défini. Une fondation qui arrive après eux doit prouver qu'elle ne vient pas leur reprendre du terrain — la table est cette preuve, et elle est vérifiable ligne à ligne.

## Risque

RÈGLE [SURFACE-R16] : table ci-dessous
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Les risques propres au plan sont recensés et hiérarchisés par sévérité dans une table d'autorité du fichier.

| Cas | Risque principal | Sévérité |
|---|---|---|
| Plan employé comme seul signal d'identification d'un composant | Composant invisible — 1,10:1 contre 3:1 requis (WCAG 1.4.11) | Critique |
| Surface distinguée par son seul remplissage | Fusion avec le plan voisin en couleurs forcées — la frontière n'existe plus | Élevée |
| Remplissage de survol lu comme une promesse de clic | Affordance mensongère : « visé » confondu avec « pressable » | Élevée |
| Texte fonctionnel posé sur un plan dont la paire n'est pas déclarée | Contraste non vérifié — le seuil se juge par paire, pas par jeton | Élevée |
| Deux plans neutres imbriqués | Indiscernables — le système n'a qu'un cran | Moyenne à élevée |
| Plan inversé consommé sans son couple texte/trait | Texte clair sur clair, ou trait absent | Moyenne à élevée |
| Inflation de plans (un fond gris par bloc) | Damier sans hiérarchie — l'espace devait suffire | Moyenne |
| Plan neutre chargé d'un sens sémantique | Registres mélangés (COLOR-R04) — le neutre se met à parler | Moyenne |
| Remplissage de plan écrit en dur | Le thème ne peut plus l'inverser — surface figée en sombre | Moyenne |

## Règle transversale

RÈGLE [SURFACE-R17] : **une surface dit où l'on est, jamais ce qu'on peut faire.** Le remplissage situe — voici un plan, voici son étendue, voici celui que tu vises. L'affordance vient d'ailleurs : du relief, du trait, du curseur, de la sémantique de l'élément. Le survol est la seule inflexion, et il ne dit encore que « je t'ai vu », jamais « presse-moi ».
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Un plan situe le contenu et ne promet aucune action ; la promesse d'action vient du relief, du trait, du curseur et de la sémantique.
MESURE : aucun plan non actionnable ne se distingue par un canal réservé aux éléments actionnables

> **Pourquoi** : c'est le pendant exact de ELEVATION-R19 (« le relief dit la nature, jamais l'importance ») et de « niveau ≠ taille » (TYPOGRAPHY-UX). Chaque canal a un sens propre, et aucun ne réquisitionne celui d'un autre. Le plan rejoint la liste des canaux protégés — et il rejoint aussi la liste des canaux **fragiles** : c'est le seul dont le mode dégradé annule intégralement la fonction.

## Sources et niveau de confiance

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| S1 | **Relevé de benchmark, 2026-07-27 — échelles de plans.** Question 1 : le système nomme-t-il explicitement un plan porteur de contenu ? Question 2 : expose-t-il une échelle de plusieurs niveaux ? Question 3 : y a-t-il un survol par niveau ? Question 4 : un plan inversé nommé ? Six systèmes chargés et lus sur source primaire. Résultat : **6/6 nomment le plan et exposent une échelle** ; **3/6 exposent un survol par niveau** ; **4/6 nomment un plan inversé** ; **0/6 tiennent un cran unique**. Détail et URL dans la section « Benchmark » ci-dessous. | Relevé interne sur documentations officielles chargées le 2026-07-27 | Établi — mesuré, non déduit. C'est le relevé qui fonde R02 (convergence) et qui contredit R03 (notre cran unique). |
| S2 | Modèle de couches : `background` puis `layer-01/02/03` — chaque changement de couleur d'interface est une couche et appelle un jeu de jetons distinct ; jeux identiques d'un thème à l'autre ; un survol par couche (`layer-hover-01/02/03`) ; plan inversé nommé (`background-inverse`, avec `background-inverse-hover`) | [Carbon — Color usage](https://carbondesignsystem.com/elements/color/usage/) ; [Carbon — Color tokens](https://carbondesignsystem.com/elements/color/tokens/) | Établi — pages chargées et lues. Le modèle le plus proche de ce que nous n'avons pas. |
| S3 | Quatre surfaces d'élévation (`elevation.surface.sunken`, `elevation.surface`, `.raised`, `.overlay`) ; **appairage obligatoire surface + ombre** — « always pair `elevation.surface.raised` with `elevation.shadow.raised` », l'appairage rompu figurant parmi les interdits | [Atlassian — Elevation](https://atlassian.design/foundations/elevation) | Établi — page chargée et lue. **Contredit frontalement R04** : c'est la source qui rend notre dissociation surface/relief minoritaire et déclarée. |
| S4 | Jetons de plan : `surface`, `surface-container` et ses quatre variantes (*lowest*, *low*, *high*, *highest*), `surface-dim`, `surface-bright`, `on-surface`, `on-surface-variant` | [Material Web — Theming color](https://github.com/material-components/material-web/blob/main/docs/theming/color.md) | Établi — source primaire (dépôt) chargée. **La page `m3.material.io/styles/color/roles` est rendue en JavaScript et illisible en texte : déclarée non vérifiable et non citée.** |
| S5 | Un remplissage peut identifier un composant : « a flat design where the status indicator fills the component and does not contrast with the component, but does contrast with the colors adjacent to the component » satisfait le critère au seuil 3:1 ; les traitements de **survol** ne sont pas « requis pour identifier » et sont exemptés ; une ombre portée en relief, comme un trait sombre entre deux fonds contrastés, est « subsumed into the color closest in brightness » et **ne compte pas** | [WCAG 2.1 — Understanding 1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html) | Établi, standard d'accessibilité — page chargée et lue. Fonde R08 et R05. |
| S6 | En mode de couleurs forcées, `background-color` et `border-color` sont traités comme dépourvus de valeurs d'auteur et reçoivent les couleurs système au moment du rendu ; `box-shadow` est forcé à `none` ; `background-image` est forcé à `none` pour les valeurs non fondées sur `url()`. L'exemple de la page remplace explicitement une ombre par une bordure en couleur système | [MDN — @media (forced-colors)](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors) | Établi, comportement plateforme — page chargée et lue. **Source décisive de la fondation** : c'est elle qui rend le remplissage fragile et le trait survivant. |
| S7 | Liste normative des propriétés dont la couleur est forcée : `accent-color`, `background-color`, `border-color`, `caret-color`, `color` ; `box-shadow` et `text-shadow` calculent à `none` ; `background-image` calcule à `none` sauf s'il contient une fonction `url()` | [W3C — CSS Color Adjust Level 1](https://www.w3.org/TR/css-color-adjust-1/) | Établi, spécification — page chargée et lue. Confirme mot pour mot la formulation de R07 et écarte le raccourci « les fonds disparaissent ». |
| S8 | `prefers-contrast` a quatre valeurs (`no-preference`, `more`, `less`, `custom`) ; `custom` correspond à la palette des utilisateurs en `forced-colors: active` ; largement disponible depuis mai 2022 | [MDN — prefers-contrast](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast) | Établi, comportement plateforme — page chargée et lue. Fonde R14 (position ouverte déclarée). |
| S9 | 4,5:1 pour le texte courant ; le fond de référence est « the specified color of content over which the text is to be rendered in normal usage », la conformité s'évaluant sur les paires de couleurs que l'auteur prévoit adjacentes en présentation typique | [WCAG 2.2 — Understanding 1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) | Établi, standard — page chargée et lue. C'est la raison pour laquelle un plan de survol crée une **nouvelle** paire à vérifier (R05, SURFACE-U04). |
| S10 | Trois niveaux de proéminence de plan (`bg-surface`, `-secondary`, `-tertiary`), chacun avec ses états (`-hover`, `-active`, `-selected`), plus des variantes spécialisées dont *inverse* et *emphasis* | [Polaris — Color tokens](https://polaris-react.shopify.com/tokens/color) | Établi — page chargée et lue |
| S11 | Six niveaux `colorNeutralBackground1…6`, les niveaux 1 à 5 déclinés en *Rest / Hover / Pressed / Selected* ; plan inversé nommé `colorNeutralBackgroundInverted` | [Fluent 2 — Color tokens](https://fluent2.microsoft.design/color-tokens) | Établi — page chargée et lue |
| S12 | Trois plans neutres (`bgColor-default`, `-muted`, `-inset`), plus `bgColor-emphasis` (plan à fort contraste) et `overlay-bgColor` ; **aucun jeton de survol universel de plan** — le survol est porté par des jetons de motif (`control-bgColor-hover`) | [Primer — Color primitives](https://primer.style/foundations/primitives/color) | Établi — page chargée et lue. Le seul système vérifié qui, comme nous, ne tokenise pas le survol au niveau du plan. |
| S13 | **Constat d'implémentation, 2026-07-27.** Carte au repos : `.cg-card::before { background: var(--background) }` — aucun plan propre. Carte visée : `.cg-hl { background: var(--surface) }`. Relief : `.cg-lift { box-shadow: var(--elevation-raised) }`, couche distincte, réservée aux cartes cliquables ou sélectionnables et **désactivée en mode solo**. Valeurs : `background` #FFFFFF, `surface` #F3F4F6 (1,10:1), `surface-hover` #E5E7EB, `surface-inverse` #111827 clair / #FFFFFF sombre ; en sombre `background` neutral.950 et `surface` neutral.800 | `packages/react/src/components/card-group/card-group.css` ; `packages/tokens/src/tokens.source.mjs` ; `packages/tokens/dist/tokens.css` ; `DESIGN.md` (recalibrage de `surface` à 1,10:1, « volontairement subtile ») | Établi — lu dans le code. C'est le **fait déclencheur** de la fondation : trois signaux distincts sur un même composant, aucun propriétaire pour les départager. |
| S14 | Divergence de rôle inversé : `colors.surface-contrast` #1C1C1E côté DS-MD (panneau sombre de mise en avant, « jamais la surface de repos », aucun consommateur documenté) contre `surface-inverse` neutral.900/neutral.0 côté DS-UI (« surface neutre inversée (bouton neutral plein) — extension DS-UI »), avec ses compagnons `text-inverse` et `border-inverse` | `packages/tokens/src/ds-md.contract.mjs` (entrée `acknowledged`, arbitrage C2 ouvert dans `mapping-autorite.md`) ; `DESIGN.md` § surfaces ; `DECISIONS.md` 2026-07-06 (import Auralis : « la valeur est importée mais pas le rôle ») | Établi — divergence déjà tracée, **nommée** ici et non résolue. Hors périmètre de cette fondation. |

## Benchmark — relevé du 2026-07-27

> Le panel est affiché pour que personne n'ait à nous croire sur parole : ce sont les sources qu'un
> contradicteur irait lire, et ce qu'elles disent réellement, y compris quand elles nous contredisent.
> **Six systèmes chargés et lus** ; toute page rendue en JavaScript et illisible en texte est déclarée
> non vérifiable plutôt que citée.

**Le plan est un concept nommé — 6 systèmes sur 6 exposent une échelle ; 0 sur 6 tient un cran unique**

| Système | Profondeur exposée | Constat | Source |
|---|---|---|---|
| Carbon | 4 | `background` + `layer-01/02/03` ; « each step in UI color is another layer » ; jeux de jetons identiques d'un thème à l'autre | carbondesignsystem.com/elements/color/usage/ |
| Material Web | 6+ | `surface` + `surface-container` *lowest/low/(base)/high/highest* + `surface-dim` + `surface-bright` | github.com/material-components/material-web — docs/theming/color.md |
| Fluent 2 | 6 | `colorNeutralBackground1…6` | fluent2.microsoft.design/color-tokens |
| Atlassian | 4 | `elevation.surface.sunken` / défaut / `.raised` / `.overlay` | atlassian.design/foundations/elevation |
| Polaris | 3 | `bg-surface` / `-secondary` / `-tertiary` + variantes spécialisées | polaris-react.shopify.com/tokens/color |
| Primer | 3 | `bgColor-default` / `-muted` / `-inset` (+ `-emphasis`, `overlay-bgColor`) | primer.style/foundations/primitives/color |
| **Fili** | **1** | `background` → `surface`, un seul cran, + son survol et son inversion | `packages/tokens/src/tokens.source.mjs` |
| Material 3 (site) | — | **non vérifiable** — `m3.material.io/styles/color/roles` est rendu en JavaScript et ne renvoie aucun contenu lisible en texte ; remplacé par le dépôt `material-web`, source primaire | — |

**Un survol par niveau de plan — 3 systèmes sur 6**

| Système | Constat | Source |
|---|---|---|
| Carbon | `layer-hover-01/02/03` + `background-hover` — un survol par couche | carbondesignsystem.com/elements/color/tokens/ |
| Fluent 2 | *Rest / Hover / Pressed / Selected* pour les niveaux 1 à 5 | fluent2.microsoft.design/color-tokens |
| Polaris | `bg-surface-hover`, `-secondary-hover`, `-tertiary-hover` | polaris-react.shopify.com/tokens/color |
| Primer | **non** — pas de survol universel de plan ; survol porté par des jetons de motif (`control-bgColor-hover`) | primer.style/foundations/primitives/color |
| Atlassian, Material Web | **non** relevé sur les pages chargées — le survol y passe par d'autres mécaniques (couches d'état) | — |

Notre `surface-hover` **unique** — un seul survol pour un seul plan — est donc cohérent avec notre cran unique : il n'est ni majoritaire ni minoritaire, il est la conséquence directe de R03.

**Un plan inversé nommé — 4 systèmes sur 6** : Carbon (`background-inverse` + son survol), Fluent 2 (`colorNeutralBackgroundInverted`), Primer (`bgColor-emphasis`), Polaris (variante *inverse*). Non relevé chez Atlassian et Material Web sur les pages chargées. **Notre position est majoritaire** — ce qui rend la divergence interne de nommage (S14) d'autant plus coûteuse : le rôle est standard, c'est notre appellation qui ne l'est pas.

**Surface et ombre : appairés ou dissociés — 1 système sur 6 se prononce, et il nous contredit.** Atlassian impose l'appairage (« always pair matching surface and shadow tokens »). Les cinq autres n'énoncent aucune obligation d'appairage sur les pages chargées — ce qui n'est pas un soutien à notre position, seulement un silence. **Aucune convergence : R04 est un parti pris, et le seul système qui tranche tranche contre nous.**

## À approfondir

- **Un second cran de plan** : le jour où un panneau contient une zone qui contient une carte, le cran unique casse. Trois issues possibles — un `surface-2`, un trait, ou l'interdiction d'imbriquer. À trancher avec le premier consommateur réel, pas avant.
- **Arbitrage C2 — `surface-contrast` contre `surface-inverse`** : deux noms, deux valeurs, deux rôles voisins. Ouvert dans `mapping-autorite.md` ; cette fondation le nomme, elle ne le résout pas.
- **`prefers-contrast: more`** : la réponse ne sera pas « assombrir le plan » mais « ajouter le trait ». À écrire quand un consommateur le demandera.
- **Plan sur média** (image, dégradé) : le voisinage devient imprévisible et le seuil de R08 incalculable. Même trou que BORDER-R11 pour l'anneau de focus sur fond arbitraire — les deux se rouvriront ensemble.
- **Plans translucides et flou d'arrière-plan** : aucun jeton, aucun consommateur, et un coût de peinture connu. Noté, pas provisionné.
