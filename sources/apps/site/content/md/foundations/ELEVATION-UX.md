---
component: elevation
layer: ux
type: foundation
version: 2.0.0 # 2.0.0 : le relief entre dans la fondation — grammaire d'objet posé / creusé / plat, registre d'identité « Relief » (parti pris paramétrable, débrayable) ; « le repos est à plat » devient la règle des SURFACES, les CONTRÔLES gagnent un relief de repos fonctionnel ; physique commune (lumière du haut, soulevé au survol, enfoncé à l'appui) éprouvée dans l'atelier DS-UI (2026-07-23). 1.1.0 : élévation déclarée dépendante du thème — stress-test 2026-07-17. 1.0.0 : première rédaction.
last_updated: 2026-07-23
companion: ELEVATION-UI.md
confidence: mixed # l'échelle courte et l'élévation-signal sont convergentes ; la grammaire de relief est un parti pris d'identité daté, adossé à des constats établis sur le flat (NN/g) et à la théorie des affordances (Norman)
---

# Élévation & Relief — Couche UX (fondation)

> Ce fichier contient le raisonnement : ce que la profondeur *signifie*, quand le relief est un signal et quand il est du bruit. Les valeurs (`elevation.none/raised/overlay`) vivent dans `DESIGN.md` ; la grammaire d'application vit dans `ELEVATION-UI.md`.

## Note de transposition (à lire en premier)

RÈGLE [ELEVATION-R01] : l'élévation est une **fondation** — pas d'axes, pas d'assemblage : une contrainte transversale. Particularité de trajectoire : ses tokens sont nés *avant* sa doctrine (créés en DESIGN.md 1.2.0 pour la card) ; la 2.0.0 élargit la doctrine de l'**ombre** au **relief** entier (ombre + arête + liseré), après que l'implémentation de référence (atelier DS-UI) en a éprouvé la grammaire.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : L'élévation est une fondation transversale : elle ne se décrit ni par axes ni par assemblage, et sa doctrine peut être écrite après ses tokens.

RÈGLE [ELEVATION-R02] : l'élévation porte une seule fonction — **dire à quelle couche du flux un élément appartient** :
STATUT : parti pris d'identité
SOURCE : S1, S12
ÉNONCÉ : L'élévation ne dit qu'une chose : à quelle couche du flux un élément appartient — à plat, soulevé mais dans le flux, ou au-dessus du flux.
MESURE : toute élévation résout vers l'un des trois niveaux nommés
  1. **À plat** (`none`) — dans le flux. L'état de repos de toute *surface*.
  2. **Soulevé** (`raised`) — encore dans le flux, mais prêt à répondre.
  3. **Au-dessus du flux** (`overlay`) — hors du document : toast, modale, popover, menu.

> **Pourquoi** : cette échelle à 3 niveaux recoupe exactement une frontière déjà tracée ailleurs — "dans le flux vs au-dessus du flux" (ALERT-UX, la frontière alert/toast). L'élévation est la traduction visuelle de cette frontière ; elle n'a donc pas plus de niveaux que le système n'a de couches.

## Le relief — ce que le flat avait perdu

RÈGLE [ELEVATION-R03] : le relief est la **matérialité retrouvée de la fonction** : un objet qui dépasse de la page appelle le doigt ; un creux appelle un contenu ; une surface plate se lit sans rien promettre. Le flat design a uniformisé ces trois natures en une seule — le système les redistingue.
STATUT : parti pris d'identité
SOURCE : S2, S3
ÉNONCÉ : Un élément interactif doit porter un signifiant perceptible de sa nature ; ce système choisit le relief comme signifiant.

> **Pourquoi** : la disparition des signifiants du flat est un coût d'utilisabilité **documenté**, pas une nostalgie : les éléments plats à signifiants faibles attirent moins l'attention et créent de l'incertitude sur ce qui est cliquable (NN/g). Le biseau des années 90 encodait physiquement l'affordance (Norman : ce qui se perçoit comme pressable est pressé) — il le disait avec 4 px de gris ; ce système le dit à 1 px près, sur tokens.

RÈGLE [ELEVATION-R04] : **grammaire à trois natures** — à la création de tout composant, chaque surface est classée :
STATUT : parti pris d'identité
SOURCE : S6
ÉNONCÉ : Toute surface est classée dans l'une de trois natures — posé, creusé, plat — et cette classe détermine son relief.
MESURE : chaque surface documentée est classée posé, creusé ou plat

| Nature | Ce que ça dit | Qui |
|---|---|---|
| **Posé** | « je suis un objet, on peut me presser » | contrôles actionnables (bouton et dérivés), couches flottantes (toast) |
| **Creusé** | « je suis un réceptacle, on me remplit » | champs de saisie |
| **Plat** | « je suis du contenu, je ne promets rien » | alert, texte, surfaces statiques, actions fantômes (ghost) |

RÈGLE [ELEVATION-R05] : **le relief suit la fonction, jamais la décoration.** Le test reste celui du langage d'interaction (INTERACTION-UX, matérialité fonctionnelle) : manipulable ? reçoit ? organise ? couche temporaire ? état changé ? — un effet qui ne répond à aucune question est décoratif, donc banni. La grammaire ne crée pas un droit à l'effet ; elle nomme les trois seules réponses admises.
STATUT : parti pris d'identité
SOURCE : S6
ÉNONCÉ : Un effet de relief qui ne répond à aucune question de matérialité fonctionnelle est décoratif et interdit.

RÈGLE [ELEVATION-R06] : **statut de frontière — parti pris d'identité, paramétrable.** Le registre Relief est débrayable (l'implémentation de référence l'expose comme un réglage de thème) : un consommateur peut le désactiver et retomber sur le registre plat intégral (doctrine 1.x, conservée ci-dessous). En audit d'une interface tierce, l'absence de relief n'est jamais une non-conformité ; l'affordance mensongère (relief sur du statique) en est une.
STATUT : note de méthode
SOURCE : S7
ÉNONCÉ : Le registre de relief est un parti pris paramétrable : son absence chez un tiers n'est jamais une non-conformité, alors que le relief posé sur du statique en est une.

## La physique du relief (registre actif)

RÈGLE [ELEVATION-R07] : **la lumière vient du haut, pour tout le monde.** Un objet posé porte une arête externe sombre, un liseré interne clair *en haut qui fond vers sa couleur en bas* (jamais un anneau uniforme — la lumière ne cercle pas), et l'ombre de repos `raised`. Un creux porte une ombre interne haute. Une seule source de lumière dans tout le produit ; deux objets éclairés de deux directions sont un bug de physique.
STATUT : propriété universelle
SOURCE : S11
ÉNONCÉ : L'ombrage suppose une source de lumière unique et venue du haut, la perception humaine interprétant toute ombre selon un a priori de lumière d'en haut.
MESURE : une seule direction de décalage d'ombre portée dans tout le produit

RÈGLE [ELEVATION-R08] : **matrice d'états des objets posés** — trois états, une seule métaphore :
STATUT : parti pris d'identité
SOURCE : S6, S12
ÉNONCÉ : Un objet posé a trois états dans une seule métaphore : posé au repos, soulevé au survol, enfoncé à l'appui.
MESURE : l'état d'appui porte une ombre interne et un fond plus sombre que l'état de repos
  - **défaut = posé** : arête + liseré + `raised` ;
  - **survol = soulevé** : l'objet monte vers la lumière — `overlay` + fond *éclairci* ;
  - **appui = enfoncé** : l'objet descend — ombre interne, fond *assombri*, liseré assombri, course d'un demi-pixel.

> **Pourquoi** : au registre plat, le survol assombrit (convention state-layer). Au registre relief, il éclaircit — parce que la métaphore prime : ce qui monte prend la lumière, ce qui s'enfonce la perd. Un registre qui mélange les deux directions ne raconte plus rien. L'appui qui s'enfonce ferme la boucle sensorielle du biseau : l'utilisateur *sent* le clic avant la réponse du système.

RÈGLE [ELEVATION-R09] : **en thème sombre, la physique tient, les valeurs changent.** La convention « les surfaces s'éclaircissent avec la hauteur » (1.1.0) s'applique au registre entier : le soulevé s'éclaircit aussi en sombre ; l'enfoncé se dérive *vers le noir* — jamais via le token de survol, qui s'éclaircit en sombre et inverserait la physique (un bouton qui *monte* quand on le presse). Le liseré s'exprime dans la gamme de l'objet, jamais en blanc pur.
STATUT : parti pris d'identité
SOURCE : S5, S16
ÉNONCÉ : En thème sombre les directions de la physique du relief sont conservées et seules les valeurs changent.
MESURE : le fond de l'état d'appui n'est jamais dérivé du token de survol

RÈGLE [ELEVATION-R10] : les surfaces restent gouvernées par la doctrine 1.x, **inchangée** : le repos d'une *surface* est à plat ; `raised` reste le retour de survol des surfaces **cliquables** uniquement (card clickable — et en registre relief, ce survol porte aussi l'arête et le liseré, qui apparaissent et disparaissent *avec* lui) ; une surface statique ne réagit jamais.
STATUT : parti pris d'identité
SOURCE : S4, S12
ÉNONCÉ : Le repos d'une surface est à plat : l'élévation soulevée n'est accordée qu'au survol des surfaces cliquables.
MESURE : aucune élévation soulevée au repos sur une surface non actionnable

> **Pourquoi** : c'est la ligne de partage qui empêche la grammaire de dégénérer en skeuomorphisme : les **objets** (petits, actionnables, en nombre borné par écran) ont droit au relief de repos ; les **surfaces** (grandes, porteuses de contenu) ne l'obtiennent qu'en le méritant par l'interaction. Généraliser le relief aux surfaces recréerait l'inflation que la 1.x combattait — si tout est posé, rien n'est pressable.

RÈGLE [ELEVATION-R11] : **mise en avant ≠ élévation**, inchangé : `surface-contrast` met en avant par le fond, sans ombre (non-cumul). Et **l'importance ne réquisitionne pas le relief** : un bouton primaire n'est pas plus posé qu'un bouton neutre — la hiérarchie passe par style × tone (BUTTON-UX), le relief dit la nature, pas le rang.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : La mise en avant passe par le fond et non par l'ombre : élévation et fond contrasté ne se cumulent pas.
MESURE : aucune surface ne porte simultanément un token d'élévation et un fond contrasté

## L'échelle courte, et pourquoi elle le reste

RÈGLE [ELEVATION-R12] : trois niveaux d'ombre, inchangés. Le relief n'ajoute **aucun niveau** : il compose les niveaux existants avec l'arête et le liseré (fondation border : le containment passe par la bordure). L'ombre interne d'enfoncement est un état, pas un palier — elle n'entre pas dans l'échelle.
STATUT : parti pris d'identité
SOURCE : S12, S15
ÉNONCÉ : L'échelle d'ombre compte exactement trois niveaux ; l'ombre interne d'enfoncement est un état, pas un palier.
MESURE : l'échelle expose exactement trois niveaux ; l'ombre interne n'y est pas comptée

RÈGLE [ELEVATION-R13] : les ombres restent **teintées** (base `text-primary`, jamais noir pur) et se distinguent par la *portée*, pas par l'opacité seule.
STATUT : parti pris d'identité
SOURCE : S12
ÉNONCÉ : Les ombres sont teintées sur la couleur de texte primaire, jamais en noir pur, et se distinguent par leur portée plutôt que par leur seule opacité.
MESURE : aucune valeur d'ombre en noir pur ; deux niveaux successifs diffèrent par leur flou ou leur décalage

## Le relief dans le temps

RÈGLE [ELEVATION-R14] : les transitions d'état du relief appartiennent à motion (MOTION-UX) : les couleurs transitionnent ; **les ombres se remplacent instantanément** (jamais de box-shadow interpolé — le soulevé/enfoncé est un changement d'état sec, pas un glissement). Sous `prefers-reduced-motion`, tout est instantané ; l'information (la nature de l'objet) reste — elle est statique par construction.
STATUT : implémentation de référence
SOURCE : S13, S14
ÉNONCÉ : Les ombres se remplacent instantanément et ne sont jamais interpolées ; seules les couleurs transitionnent.
MESURE : aucune propriété d'ombre déclarée dans une transition ou une animation

RÈGLE [ELEVATION-R15] : le **skeleton n'est jamais en relief** — il occupe l'espace du contenu, il ne promet aucune interaction (inchangé).
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Un squelette de chargement ne porte jamais de relief : il occupe l'espace du contenu sans promettre d'interaction.
MESURE : aucun token d'élévation appliqué à un squelette

## Ce que le relief ne garantit pas

RÈGLE [ELEVATION-R16] : le relief n'est **jamais le seul signal** (inchangé, étendu) : en `forced-colors`, ombres ET liserés disparaissent — restent la bordure, le focus ring, la sémantique. Le registre relief a l'avantage de reposer d'abord sur des *bordures* (arête = border réel), qui survivent au contraste forcé mieux que les ombres.
STATUT : propriété universelle
SOURCE : S8, S9, S10
ÉNONCÉ : Aucune information ne repose sur la seule ombre ni sur le seul liseré : en mode de couleurs forcées les ombres sont supprimées et les fonds dégradés annulés.
MESURE : en couleurs forcées, chaque élément reste identifiable par sa bordure, son anneau de focus ou son texte

RÈGLE [ELEVATION-R17] : l'élévation — et désormais le liseré — sont **dépendants du thème** (1.1.0, étendu) : un thème redéfinit `elevation.*` et les dérivations de liseré comme il redéfinit `background`.
STATUT : propriété universelle
SOURCE : S16, S12
ÉNONCÉ : Les valeurs d'élévation et de liseré appartiennent au thème : un thème les redéfinit comme il redéfinit ses couleurs de fond.
MESURE : aucune valeur d'ombre ou de liseré codée en dur hors de la définition de thème

RÈGLE [ELEVATION-R20] : le PLAN et le RELIEF sont deux signaux distincts. Ce que porte un plan — son existence, son remplissage, ce qu'il promet quand il apparaît — appartient à `SURFACE-UX` (2026-07-27). L'élévation ne possède que l'ombre et la grammaire des trois natures ; elle ne dit pas ce qu'est une surface.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : La définition d'une surface et le signal que constitue son apparition appartiennent à SURFACE-UX ; ce document ne possède que l'ombre et la grammaire posé / creusé / plat.

## Risque

RÈGLE [ELEVATION-R18] : table ci-dessous
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Les risques du relief sont recensés et hiérarchisés par sévérité dans une table d'autorité du fichier.

| Cas | Risque principal | Sévérité |
|---|---|---|
| Relief sur une surface statique | Affordance mensongère — clic dans le vide | Élevée |
| Relief généralisé (surfaces posées par défaut) | Le signal ne signale plus rien — retour du skeuomorphisme | Élevée |
| Relief comme seul signal | Information perdue en forced-colors | Élevée |
| Enfoncé dérivé du token de survol en sombre | Physique inversée — l'objet monte quand on le presse | Élevée |
| Liseré en anneau uniforme ou blanc pur en sombre | Lumière incohérente, halo criard | Moyenne |
| Deux directions de lumière dans un même écran | Métaphore brisée, lecture ralentie | Moyenne |
| Ombre + surface-contrast cumulés | Deux vocabulaires brouillés | Moyenne |
| Box-shadow interpolé sur les transitions de relief | Paint coûteux, jank | Moyenne |

## Règle transversale

RÈGLE [ELEVATION-R19] : **le relief dit la nature, jamais l'importance.** Posé = pressable, creusé = remplissable, plat = lisible — et rien d'autre. Un élément important n'est pas plus posé : il est mieux placé, mieux contrasté, mieux nommé.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Le relief dit la nature d'un élément et jamais son importance, qui passe par la place, le contraste et le nom.
MESURE : deux composants de même nature et de rangs différents portent la même élévation

> **Pourquoi** : c'est la même discipline que "Large ne veut pas dire important" (BUTTON-UX) et "niveau ≠ taille" (TYPOGRAPHY-UX) — chaque canal a son sens propre, l'importance n'en réquisitionne aucun. Le relief rejoint la liste des canaux protégés.

## Sources et niveau de confiance

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| S1 | Échelles courtes et sémantiques | [Atlassian — Elevation](https://atlassian.design/foundations/elevation), [Material 3](https://m3.material.io/styles/elevation/overview) | Établi par convergence |
| S2 | Les éléments plats à signifiants faibles créent incertitude et coût attentionnel | [NN/g — Flat UI Elements Attract Less Attention and Cause Uncertainty](https://www.nngroup.com/articles/flat-ui-less-attention-cause-uncertainty/) | Établi — recherche publiée |
| S3 | Affordances perçues : ce qui semble pressable est pressé | Don Norman, *The Design of Everyday Things* (affordances/signifiers) | Référence établie en design |
| S4 | Le survol comme élévation des surfaces cliquables | Convention Material/MUI + précédent interne (CARD-UI) | Établi par convergence |
| S5 | Dark mode : surfaces éclaircies avec la hauteur | [Material — Dark theme](https://m2.material.io/design/color/dark-theme.html) | Établi par convergence — étendue ici au registre relief entier |
| S6 | Grammaire posé / creusé / plat, physique lumière-du-haut, matrice défaut/soulevé/enfoncé | Décision d'identité interne (2026-07-23), maquettes Figma Sibyl 86:129 et 128:136, éprouvée dans l'atelier DS-UI (registre débrayable) | Parti pris d'identité — à éprouver par tests utilisateurs |
| S7 | Registre relief débrayable = parti pris paramétrable, pas contrainte | Cadre « contrainte ≠ parti pris » (DECISIONS 2026-07-17) | Décision de méthode interne |
| S8 | En mode de couleurs forcées, les ombres portées et les ombres de texte sont forcées à néant, les images de fond non-url également (donc les dégradés), tandis que les couleurs de bordure et d'anneau sont recolorées. Ombres et liserés dégradés disparaissent ; la bordure et l'anneau survivent | [MDN — @media (forced-colors)](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors) ; [W3C — CSS Color Adjust Level 1](https://www.w3.org/TR/css-color-adjust-1/) | Établi, comportement plateforme normalisé — **la source décisive du sujet, elle manquait entièrement** |
| S9 | Une ombre portée ne peut pas servir de signal d'identification : le Understanding de 1.4.11 précise qu'elle est absorbée dans la couleur voisine la plus proche en luminosité et ne compte pas pour le seuil de 3:1 | [WCAG — Understanding 1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html) | Établi, standard — argument normatif direct pour R16, jamais cité |
| S10 | La perception de la profondeur n'est pas uniforme entre utilisateurs, d'où la nécessité de combiner plusieurs techniques | [Polaris — Depth](https://polaris-react.shopify.com/design/depth) | Établi chez Polaris — converge avec S8 et S9 |
| S11 | La vision humaine interprète les ombrages ambigus selon un a priori de lumière venue d'en haut, robuste chez l'adulte et se renforçant avec l'âge | [Journal of Vision — Interactions between light-from-above and convexity priors](https://jov.arvojournals.org/article.aspx?articleid=2191755) | Établi — recherche en perception visuelle publiée et relue |
| S12 | Relevé du 2026-07-27, longueur des échelles d'élévation : Material 3 six niveaux, Fluent 2 six sur deux rampes, Polaris six plus variantes, Atlassian quatre plus un cas de débordement, Carbon aucune ombre (profondeur par couches de fond). **Aucun système vérifié ne tient une échelle à trois niveaux** | [Material Web — Elevation](https://github.com/material-components/material-web/blob/main/docs/components/elevation.md) ; [Fluent 2 — Elevation](https://fluent2.microsoft.design/elevation) ; [Polaris — Shadow tokens](https://polaris-react.shopify.com/tokens/shadow) ; [Atlassian — Elevation](https://atlassian.design/foundations/elevation) ; [Carbon — Color usage](https://carbondesignsystem.com/elements/color/usage/) | Établi — mesuré sur sources primaires. **Contredit la mention « échelles courtes, établi par convergence » de S1** |
| S13 | La préférence système de mouvement réduit demande de supprimer, réduire ou remplacer les animations non essentielles, sans perte d'information | [MDN — prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) | Établi, comportement plateforme |
| S14 | Tout ce qui implique un flou est plus coûteux à peindre qu'un aplat | [web.dev — Animations guide](https://web.dev/articles/animations-guide) | Établi — **réserve : le guide documente le coût mais n'interdit pas l'interpolation d'ombre ; le fichier sur-interprétait cette source** |
| S15 | Le mot-clé d'ombre interne rogne l'ombre sur la boîte de remplissage ; une ombre n'affecte pas les dimensions du modèle de boîte | [MDN — box-shadow](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow) | Établi — fonde le fait qu'une ombre interne est un état sans coût de mise en page |
| S16 | En thème sombre, l'élévation ne peut pas reposer sur l'ombre seule : plus l'élévation est haute, plus la surface s'éclaircit, et les tokens de surface et d'ombre doivent être appairés | [Atlassian — Elevation](https://atlassian.design/foundations/elevation) ; [Carbon — Color usage](https://carbondesignsystem.com/elements/color/usage/) | Établi par convergence — deux systèmes vérifiés, plus Material |
| S17 | **Vérification négative.** WCAG 1.4.1 n'exige que l'absence de recours à la couleur seule et son Understanding précise qu'il traite spécifiquement de la perception des couleurs : ce critère ne couvre pas les ombres et ne peut pas fonder la règle du « jamais seul signal » | [WCAG 2.2 — Understanding 1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) | Établi — consigné comme **source écartée**, pour éviter qu'elle soit invoquée à tort |

## À approfondir

- **Tokens de relief dans DESIGN.md** : l'implémentation de référence dérive arête et liserés par mélange des tokens de tone (aucune valeur nouvelle) ; l'ombre interne d'enfoncement est la seule valeur candidate à la tokenisation (`elevation.pressed` ?) — à trancher avec un second consommateur.
- **Tests utilisateurs** du registre : la promesse (reconnaissance plus rapide des rôles) est mesurable — protocole en maquette désaturée, avec et sans registre.
- **Expandable et drag & drop** : natures non couvertes par la grammaire (un objet saisi est-il « soulevé » ? Atlassian : raised = déplaçable) — aucun consommateur, noté.
- **Premier consommateur d'`overlay` modal** : échelle z-index et scrim, inchangé.
