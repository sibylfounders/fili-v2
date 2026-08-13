---
component: tabs
layer: ux
type: component
version: 1.0.0 # 1.0.0 : première rédaction — besoin réel : les volets d'une fiche de doctrine (essentiel / cas / spécifications) et les bascules courtes d'un atelier. Motif clavier : ARIA APG « Tabs ». Frontière tranchée avec Accordion (exclusif vs multi-ouvert) et Navigation (changer de vue vs changer de page). Cf. packages/react/src/components/tabs/tabs.tsx.
last_updated: 2026-07-26
companion: TABS-UI.md
confidence: mixed # le motif tablist/tab/tabpanel est établi (ARIA APG) ; le critère de choix auto/manuel et le seuil de débordement sont un raisonnement interne convergent avec les systèmes cités.
---

# Tabs — Couche UX (composant)

> Des onglets **découpent un même objet en vues exclusives** : un seul volet visible à la fois, et
> tous les volets décrivent la **même chose** sous des angles différents (les propriétés d'un même
> produit, les états d'une même fiche). Ce n'est **pas** un Accordion (qui peut tout ouvrir à la
> fois) et ce n'est **pas** une navigation (qui change de page). Réutilisable — la fiche de doctrine
> n'est qu'un usage parmi d'autres.

## Nature et périmètre — quand des onglets sont légitimes

RÈGLE [TABS-R01] : les onglets s'appliquent à un **seul objet** dont les volets sont des **vues alternatives**,
STATUT : propriété universelle
SOURCE : S1, S9, S10, S13
ÉNONCÉ : Un jeu d'onglets s'applique à un seul objet dont les volets sont des vues alternatives du même sujet, et non à des sujets distincts regroupés par commodité de mise en page.
jamais des sujets distincts. Le test : peut-on dire « voici le même [produit/fiche/dossier], vu sous
l'angle A, B, C » ? Si les volets parlent de choses différentes, ce ne sont pas des vues — c'est un
découpage arbitraire qui emprunte la forme visuelle des onglets sans en avoir la sémantique.

RÈGLE [TABS-R02] : les onglets **mentent** dans quatre cas fréquents — ne pas les utiliser quand :
STATUT : propriété universelle
SOURCE : S7, S9, S11, S17
ÉNONCÉ : Les onglets sont écartés lorsque deux volets doivent être comparés simultanément, lorsque leur contenu doit rester trouvable par la recherche dans la page, lorsqu'il n'existe qu'un seul volet, ou lorsque les volets sont en réalité les étapes ordonnées d'un parcours.
MESURE : aucun jeu d'onglets ne comporte un seul onglet
- le contenu de deux volets doit être **comparé côte à côte** (un onglet masque ce qu'on veut voir
  en même temps que l'autre — l'utilisateur bascule, oublie, rebascule) ;
- le contenu doit être **cherché au clavier** (Cmd+F/Ctrl+F) — un moteur de recherche de page ne
  voit pas le contenu des volets non montés, et même monté-masqué (`hidden`) il reste invisible ;
- il n'y a **qu'un seul volet** — un onglet unique n'est pas un choix, c'est un habillage inutile ;
  supprimer la tablist et afficher le contenu directement ;
- les « volets » sont en réalité des **étapes** d'un parcours (une suite, pas un choix libre) — c'est
  alors un stepper, pas des onglets : l'ordre est imposé, pas la liberté de bascule.

> **Pourquoi** : un onglet promet à l'utilisateur « ce que tu ne vois pas est ailleurs, à un clic »
> — une promesse fausse quand le contenu masqué doit être comparé, cherché, ou n'existe pas
> vraiment comme vue alternative. La forme visuelle (bandeau + volet) ne suffit pas à justifier le
> choix : c'est la relation entre les volets qui décide.

> **Erreur fréquente** : découper un formulaire long en « onglets » pour réduire la longueur perçue
> de la page. Les champs d'un même formulaire ne sont pas des vues exclusives d'un objet — ils sont
> tous nécessaires à la même soumission. Un onglet masque un champ requis dont l'erreur de
> validation devient invisible. Préférer un découpage en sections visibles à la suite (accordion ou
> simple empilement) pour un formulaire long.

## Frontière avec Accordion

RÈGLE [TABS-R03] : Tabs et Accordion partagent la disclosure ; ils divergent sur l'**exclusivité**. Tabs = **un
STATUT : propriété universelle
SOURCE : S1, S10, S12
ÉNONCÉ : Des onglets n'affichent qu'un seul volet à la fois ; l'exclusivité est le critère qui les sépare d'un accordéon, dont plusieurs sections peuvent être ouvertes simultanément et lues à la suite.
MESURE : un seul volet d'un même jeu d'onglets est affiché à un instant donné
seul volet monté à l'écran**, choix exclusif. Accordion = **plusieurs sections peuvent être ouvertes
à la fois**, lisibles à la suite les unes des autres. Si le contenu gagne à être parcouru en
continu (scroll unique, lecture linéaire), c'est un Accordion. Si le contenu doit être **isolé** —
un seul angle affiché, les autres explicitement de côté — c'est Tabs.

RÈGLE [TABS-R04] : un signe de mauvais choix : l'utilisateur qui ouvre systématiquement tous les onglets un par
STATUT : propriété universelle
SOURCE : S7, S9, S11
ÉNONCÉ : Lorsque l'usage réel conduit les utilisateurs à ouvrir successivement tous les onglets pour tout lire, le contenu relève d'un composant multi-ouvert et non d'un jeu d'onglets.
un pour tout lire. Si le usage réel converge vers « tout voir », le composant approprié est
l'Accordion (multi-ouvert), pas Tabs.

> **Pourquoi** : l'exclusivité de Tabs a un coût — chaque bascule est une perte de contexte visuel
> (l'ancien volet disparaît). Ce coût ne se justifie que si les vues sont réellement concurrentes
> (regarder l'une OU l'autre), jamais quand elles sont complémentaires (regarder l'une ET l'autre).

## Frontière avec Navigation

RÈGLE [TABS-R05] : Tabs change de **vue**, pas de **page** — même URL (sauf deep-link explicite, voir plus
STATUT : parti pris d'identité
SOURCE : S9, S10, interne
ÉNONCÉ : Une bascule d'onglet change de vue à l'intérieur de la même page : elle ne modifie pas l'URL et n'ajoute pas d'entrée dans l'historique, de sorte que le bouton Retour du navigateur ne défait jamais un changement d'onglet.
MESURE : une bascule d'onglet n'ajoute aucune entrée à l'historique du navigateur
bas), pas d'entrée d'historique par bascule, le bouton **Retour** du navigateur ne doit pas défaire
un changement d'onglet. Une navigation (`nav`, pattern NAVIGATION-UX.md) change de **destination** —
autre URL, autre entrée d'historique, le Retour fonctionne.

RÈGLE [TABS-R06] : si un produit a besoin que chaque volet soit **partageable par URL**, **indexable** ou
STATUT : propriété universelle
SOURCE : S9, S10, S11
ÉNONCÉ : Un jeu de volets qui doit être partageable par URL, indexable ou atteignable par le bouton Retour relève de la navigation : ses déclencheurs deviennent des liens et la sémantique de tablist est abandonnée au profit d'une navigation étiquetée, l'apparence visuelle des onglets pouvant être conservée.
MESURE : aucun élément portant role=tab n'expose une destination href
**revenable au Retour**, ce n'est plus un choix de vue interne — c'est une navigation qui emprunte
l'apparence visuelle des onglets (le motif `pill`/`line` peut rester, la sémantique change : liens,
pas boutons ; `role="tablist"` disparaît au profit d'une nav étiquetée).

> **Erreur fréquente** : implémenter des onglets qui poussent une entrée d'historique à chaque
> bascule « pour permettre le deep-link ». Le résultat casse le Retour (l'utilisateur clique
> Retour pour quitter la page et se retrouve sur l'onglet précédent) et casse l'attente ARIA (une
> tablist n'est pas un ensemble de destinations). Séparer clairement : bascule de vue interne
> (Tabs, pas d'historique) contre navigation entre destinations (liens, historique normal).

## Nombre d'onglets et débordement

RÈGLE [TABS-R07] : le nombre d'onglets reste **restreint** — au-delà d'un jeu qui tient sur une seule ligne dans
STATUT : parti pris d'identité
SOURCE : S9, S12, S13
ÉNONCÉ : Le nombre d'onglets reste restreint à ce qui tient sur une seule ligne dans la largeur disponible, aucun seuil numérique absolu n'étant fixé.
la largeur disponible, le motif cesse d'être lisible en un coup d'œil (sa promesse : voir toutes les
vues possibles d'emblée). CONFIANCE : non formalisé — seuil numérique précis à remonter (dépend de la
largeur du conteneur, pas d'un compte absolu).

RÈGLE [TABS-R08] : **jamais d'onglets sur deux lignes.** Un jeu d'onglets qui retombe à la ligne perd
STATUT : propriété universelle
SOURCE : S9, S11, S12
ÉNONCÉ : Un jeu d'onglets ne se répartit jamais sur deux lignes : en cas de débordement, la liste d'onglets défile horizontalement ou le contenu est refondu.
MESURE : la liste d'onglets ne présente jamais plus d'une ligne, quelle que soit la largeur du conteneur
l'exclusivité visuelle (deux rangées suggèrent deux groupes) et casse la navigation clavier
(flèches gauche/droite qui sautent de ligne). Deux issues seulement quand le jeu déborde : le
**défilement horizontal** de la tablist (l'implémentation expose déjà `overflow-x-auto`), ou une
**refonte du contenu** — regrouper des volets connexes, ou remonter d'un cran vers une navigation
si les vues sont en réalité des destinations distinctes.

> **Pourquoi** : la tablist sert de carte de la totalité des vues disponibles. Une carte qui déborde
> sur deux lignes ne peut plus être lue d'un regard — elle échoue à son propre rôle.

## Libellé

RÈGLE [TABS-R09] : le libellé d'un onglet est **court**, **nominal** — un nom, jamais une phrase complète et
STATUT : propriété universelle
SOURCE : S7, S9, S10, S13
ÉNONCÉ : Le libellé d'un onglet est court et nominal — un ou deux mots — et n'est jamais une phrase complète ni un verbe d'action, un onglet ouvrant une vue et ne déclenchant pas une opération.
MESURE : aucun libellé d'onglet ne commence par un verbe à l'infinitif ou à l'impératif
jamais un **verbe d'action**. Un onglet ouvre une vue, il ne déclenche pas une opération : « Général »,
« Facturation », « Historique », pas « Voir la facturation » ni « Cliquez pour l'historique ».

> **Erreur fréquente** : un libellé d'onglet qui commence par un verbe (« Modifier le profil »,
> « Consulter les accès ») fait croire à une action — l'utilisateur s'attend à un effet immédiat
> (soumission, ouverture d'un superposé), pas à un simple changement de vue. Renvoi VOICE pour le
> choix des mots ; la contrainte de nature (nom, pas verbe) est propre à Tabs.

## Onglet courant — jamais la seule couleur

RÈGLE [TABS-R10] : l'onglet courant se signale par un **canal non chromatique** en plus de la couleur — poids
STATUT : propriété universelle
SOURCE : S4, S18
ÉNONCÉ : L'onglet courant se distingue par au moins un canal non chromatique en plus de la couleur — poids typographique et trait ou fond porteur — et jamais par la couleur seule.
MESURE : l'onglet courant se distingue des autres par au moins une propriété visuelle non chromatique
de texte renforcé et trait porteur (soulignement en variante `line`, contraste de fond en variante
`pill`), jamais la couleur seule (WCAG 1.4.1, renvoi ACCESSIBILITY-UX.md § canaux sensoriels). Le
même principe que l'état courant d'un lien de navigation (LINK-UI.md, NAVIGATION-UX.md).

RÈGLE [TABS-R11] : `aria-selected` porte l'état programmatique — le canal visuel n'est pas la seule source de
STATUT : propriété universelle
SOURCE : S1, S14
ÉNONCÉ : L'état sélectionné de l'onglet courant est exposé programmatiquement par aria-selected, redondant avec le signal visuel : ni l'un ni l'autre n'est seul porteur de l'information.
MESURE : exactement un onglet du jeu porte aria-selected=true, tous les autres aria-selected=false
vérité, mais l'un des deux doit toujours être **redondant** avec l'autre.

## Activation automatique vs manuelle

RÈGLE [TABS-R12] : deux modes d'activation coexistent (ARIA APG) — **automatique** (le volet suit le focus : se
STATUT : propriété universelle
SOURCE : S1, S3
ÉNONCÉ : Deux modes d'activation d'un onglet coexistent : l'activation automatique, où le volet suit le focus, et l'activation manuelle, où les flèches ne déplacent que le focus et où Entrée ou Espace active l'onglet focalisé.
déplacer avec les flèches affiche immédiatement le nouveau volet) et **manuelle** (les flèches ne
déplacent que le focus ; Entrée ou Espace valide l'activation).

RÈGLE [TABS-R13] : le critère de choix est le **coût de montage du volet**. Si les volets sont déjà en mémoire
STATUT : propriété universelle
SOURCE : S3, S19
ÉNONCÉ : L'activation automatique est le mode par défaut tant que le volet associé s'affiche sans latence perceptible, ce qui suppose son contenu déjà disponible ; dès que l'affichage d'un volet engage une requête, un calcul ou un rendu coûteux, l'activation manuelle s'impose.
ou bon marché à afficher (texte, contenu statique), l'activation **automatique** est le défaut — elle
réduit d'une frappe le trajet clavier et correspond à l'attente la plus commune. Si monter un volet
déclenche un coût réel (requête réseau, calcul, rendu lourd), l'activation **manuelle** évite de
déclencher ce coût à chaque frappe de flèche pendant que l'utilisateur parcourt la liste des onglets.

> **Pourquoi** : en activation automatique, un utilisateur qui balaie les onglets aux flèches pour
> les lire déclenche autant de changements de volet que d'onglets survolés. Si chaque changement a
> un coût (fetch, recalcul), ce balayage devient une rafale de requêtes inutiles — l'activation
> manuelle sépare le déplacement (gratuit) de l'activation (qui a un coût, donc explicite).

## Clavier (ARIA APG « Tabs »)

RÈGLE [TABS-R14] : la tablist porte `role="tablist"`, chaque onglet `role="tab"`, chaque volet
STATUT : propriété universelle
SOURCE : S1, S2
ÉNONCÉ : La liste porte role=tablist, chaque onglet role=tab et chaque volet role=tabpanel, et un seul onglet — le courant — reste dans l'ordre de tabulation avec tabindex 0, les autres en étant retirés avec tabindex -1, de sorte que la tabulation entre et sort de la liste en une étape.
MESURE : un seul élément role=tab d'un même jeu porte tabindex=0
`role="tabpanel"`. **Un seul onglet** est dans l'ordre de tabulation normal (`tabindex="0"` sur
l'onglet courant, `tabindex="-1"` sur les autres) — Tab entre et sort de la tablist en une seule
étape, jamais un Tab par onglet.

RÈGLE [TABS-R15] : à l'intérieur de la tablist, les **flèches gauche/droite** déplacent le focus d'onglet en
STATUT : propriété universelle
SOURCE : S1, S2, S19
ÉNONCÉ : À l'intérieur de la liste d'onglets, les flèches gauche et droite déplacent le focus d'onglet en onglet avec bouclage du dernier au premier, Origine porte le focus au premier onglet et Fin au dernier ; le mode d'activation détermine si ce déplacement change aussi le volet affiché.
onglet (avec retour au premier après le dernier) ; **Origine** (Home) va au premier onglet,
**Fin** (End) au dernier. Le comportement d'activation (auto/manuel) détermine si ce déplacement
change aussi le volet affiché.

RÈGLE [TABS-R16] : le **volet est focalisable** (`tabindex="0"` sur le conteneur du volet) même s'il ne
STATUT : propriété universelle
SOURCE : S1, S19
ÉNONCÉ : Le conteneur du volet est inclus dans l'ordre de tabulation avec tabindex 0 lorsqu'il ne commence pas par un élément focalisable, et le couple onglet/volet se relie dans les deux sens par aria-controls et aria-labelledby.
MESURE : chaque role=tab porte un aria-controls résolvant vers son tabpanel, et chaque tabpanel un aria-labelledby résolvant vers son tab
contient aucun élément interactif — sans quoi Tab depuis l'onglet saute directement au contenu
suivant de la page, et un lecteur d'écran ne peut pas atteindre le volet comme une région. Le
volet référence son onglet via `aria-labelledby`, l'onglet référence son volet via `aria-controls`.

## Volet démonté ou masqué

RÈGLE [TABS-R17] : par défaut, le volet **non courant est démonté** (retiré du DOM), pas seulement masqué —
STATUT : implémentation de référence
SOURCE : interne
ÉNONCÉ : Par défaut, le volet non courant est retiré du DOM plutôt que masqué, son maintien en mémoire devant être demandé explicitement.
MESURE : en l'absence de demande explicite de maintien, aucun volet non courant n'est présent dans le DOM
l'implémentation le fait tant que `keepMounted` n'est pas explicitement demandé. Démonter simplifie
le DOM et évite qu'un contenu invisible reste interactif ou indexé.

RÈGLE [TABS-R18] : si un volet contient une **saisie utilisateur** (formulaire, filtre, brouillon) que la
STATUT : parti pris d'identité
SOURCE : S17, interne
ÉNONCÉ : Un volet contenant une saisie utilisateur que la bascule ne doit pas perdre reste monté et seulement masqué, au lieu d'être démonté : le coût de le garder en mémoire est inférieur au coût d'une saisie effacée silencieusement.
bascule ne doit pas perdre, il doit rester **monté et seulement masqué** (`keepMounted`, `hidden`
plutôt que démontage) — sans quoi changer d'onglet efface silencieusement ce que l'utilisateur avait
commencé à saisir.

> **Erreur fréquente** : démonter par défaut un volet qui contient un formulaire en cours de
> remplissage. L'utilisateur bascule pour vérifier une information dans un autre onglet, revient, et
> découvre son formulaire vide. Le coût de garder le volet monté (mémoire, DOM) est presque toujours
> inférieur au coût d'une saisie perdue.

## Onglet par défaut et deep-link

RÈGLE [TABS-R19] : sans valeur initiale explicite, **le premier onglet monté prend la main** — un jeu
STATUT : propriété universelle
SOURCE : S1
ÉNONCÉ : Un jeu d'onglets n'a jamais d'état sans onglet sélectionné : en l'absence de valeur initiale explicite, le premier onglet monté devient courant, et il existe toujours un volet visible.
MESURE : à tout instant, exactement un onglet du jeu est sélectionné
d'onglets n'a jamais d'état « aucun onglet sélectionné » (contrairement à un Accordion, où tout peut
être fermé). Il existe toujours un volet visible.

RÈGLE [TABS-R20] : quand un onglet précis doit être atteint depuis l'extérieur de la page (lien externe,
STATUT : parti pris d'identité
SOURCE : S11, S13, interne
ÉNONCÉ : L'atteinte d'un onglet précis depuis l'extérieur de la page passe par un paramètre d'URL ou un fragment lu au montage pour initialiser la valeur, et non par une entrée d'historique poussée à chaque bascule.
rafraîchissement, partage), c'est un **deep-link** — un paramètre d'URL ou un fragment lu au montage
pour initialiser `value`/`defaultValue`, jamais une entrée d'historique poussée à chaque bascule
(cf. frontière Navigation ci-dessus). Le deep-link positionne l'état initial ; il ne transforme pas
Tabs en navigation à chaque interaction.

## Frontières

RÈGLE [TABS-R21] : le **survol/repos/courant** relève de `color` (rôles), le **poids et le trait** de
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Le composant onglets ne redéfinit ni les rôles de couleur, ni le poids typographique, ni l'anneau de focus, ni les durées de transition, ni le vocabulaire des libellés : il les emprunte aux fondations correspondantes et renvoie à l'accordéon, au superposé ou à la navigation les cas qui sortent de son périmètre.
`typography`/`border` ; l'**anneau de focus** de `border` (jamais réinventé par ce composant) ; les
**durées de transition** de `motion` ; le **mot** d'un libellé de `voice` ; le **superposé** qui
recouvre et piège n'est pas un onglet, c'est `overlay` ; le **regroupement multi-ouvert** est
`accordion` ; la **destination changeante avec historique** est `navigation`.

## Sources et niveau de confiance (couche UX)
| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| S1 | `tablist`/`tab`/`tabpanel`, `aria-selected`, `aria-controls`, tabindex mouvant, flèches, Origine/Fin | [ARIA APG — Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) | Établi |
| S2 | Un seul onglet dans l'ordre de tabulation, volet focalisable | [ARIA APG — Tabs, Keyboard Interaction](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/#keyboardinteractionfortabs) | Établi |
| S3 | Activation automatique par défaut, manuelle si coût de montage | [ARIA APG — Tabs, Note on tab activation](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/), convergence Material/Carbon | Établi par convergence |
| S4 | État courant par canal non chromatique, pas la seule couleur | WCAG 1.4.1 (renvoi ACCESSIBILITY-UX.md) | Établi |
| S5 | Tabs ≠ navigation : pas d'entrée d'historique par bascule de vue | Convergence des systèmes (Carbon « Tabs vs. navigation »), NN/g — Tabs Used Right | Établi par convergence |
| S6 | Onglets jamais sur deux lignes ; défilement horizontal ou refonte | Convergence des systèmes (Material, Polaris) | Établi par convergence |
| S7 | Contenu de volet non cherchable au Cmd+F comme limite structurelle | NN/g — Tabs, Used Right | Cas isolé (une source, raisonnement transposable) |
| S8 | Seuil numérique de débordement avant refonte | — | Non formalisé — arbitrage à remonter |
| S9 | Les onglets groupent des contenus différents mais apparentés et permettent de changer de vue sans quitter la page ; ils sont écartés quand l'utilisateur doit comparer des informations d'un groupe à l'autre, remplacés par un indicateur de progression quand il s'agit d'un processus linéaire pas à pas, et ne remplacent pas la navigation ; les libellés font un à deux mots ; en situation responsive les onglets horizontaux ne reviennent jamais à la ligne ni ne s'empilent, ils défilent horizontalement | [Carbon Design System — Tabs, usage](https://carbondesignsystem.com/components/tabs/usage/) | Établi — design system public vérifié ; couvre à lui seul quatre règles du fichier (R01, R02, R08, R09) et fonde la frontière avec la navigation |
| S10 | Les onglets représentent le même type de contenu (par exemple une même liste sous différents filtres), un seul est actif à la fois, ils n'obligent pas à faire des allers-retours pour accomplir une seule tâche et ne sont pas utilisés comme navigation principale ; les libellés sont courts et scannables, généralement d'un seul mot, et fonctionnent comme des noms | [Shopify Polaris — Tabs](https://polaris-react.shopify.com/components/navigation/tabs) | Établi — deuxième design system public vérifié ; note d'attention : Polaris classe lui-même Tabs dans la catégorie « navigation » de sa documentation tout en interdisant l'usage en navigation principale |
| S11 | Les onglets sont écartés quand l'utilisateur doit lire tout le contenu dans l'ordre (processus pas à pas) ou comparer des informations d'un onglet à l'autre ; il faut éviter les onglets qui débordent sur plus d'une ligne ; l'implémentation retenue est faite d'ancres pointant vers des fragments, l'URL étant mise à jour à chaque bascule, et n'emploie pas les rôles tablist/tab/tabpanel | [GOV.UK Design System — Tabs](https://design-system.service.gov.uk/components/tabs/) | Établi — troisième design system public vérifié. Source décisive sur la frontière onglet/navigation : GOV.UK fait exactement ce que prescrit R06 (des onglets adressables par URL deviennent des liens et abandonnent la sémantique de tablist), mais contredit R05 sur l'absence d'entrée d'historique |
| S12 | Les onglets servent quand une page a des sous-sections dont une seule doit être visible à la fois ; au-delà de quatre onglets, envisager un autre motif ; il faut éviter que les onglets débordent sur plusieurs rangées sur petit écran ; les libellés ne dépassent pas deux mots ; les flèches gauche/droite naviguent entre onglets et les rôles tablist/tab/tabpanel sont employés | [CMS Design System — Tabs](https://design.cms.gov/components/tabs/) | Établi — quatrième design system public vérifié ; seule source consultée à donner un seuil numérique explicite (quatre), ce qui confirme qu'aucun seuil ne fait consensus (Carbon : quatre ou moins pour une variante ; GitLab : deux à trois) |
| S13 | Les onglets montrent une section de contenu à la fois au sein d'un ensemble apparenté ; les libellés sont concis et décrivent le volet associé, les libellés longs étant tronqués avec info-bulle ; chaque onglet de premier niveau devrait avoir sa propre URL unique, et pour les onglets imbriqués il faut se demander si l'utilisateur voudrait mettre le contenu en signet | [GitLab Design System — Tabs](https://design.gitlab.com/components/tabs) | Établi — cinquième design system public vérifié. Contre-exemple direct à R05/R20 : GitLab prescrit une URL propre par onglet de premier niveau, là où le fichier interdit toute liaison à l'URL hors initialisation |
| S14 | Pour tout composant d'interface, le nom et le rôle sont programmatiquement déterminables, et les états, propriétés et valeurs modifiables par l'utilisateur sont programmatiquement définissables, la notification de leurs changements étant disponible aux technologies d'assistance ; pour un contrôle personnalisé, l'exposition de l'état passe par les attributs WAI-ARIA | [WCAG 2.2 — 4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html) | Établi, standard (niveau A) — donne l'ancrage normatif de aria-selected invoqué par R11, que le fichier n'attachait à aucune norme |
| S15 | Toute fonctionnalité du contenu est opérable au clavier sans exiger de timing particulier par frappe, sauf lorsque la fonction sous-jacente dépend du tracé du mouvement et pas seulement de ses extrémités | [WCAG 2.2 — 2.1.1 Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html) | Établi, standard (niveau A) — fonde l'exigence d'opérabilité clavier complète du motif, dont les règles R14 à R16 sont la mise en œuvre concrète |
| S16 | Toute interface opérable au clavier dispose d'un mode où l'indicateur de focus clavier est visible | [WCAG 2.2 — 2.4.7 Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html) | Établi, standard (niveau AA) |
| S17 | L'attribut hidden ne doit pas servir à masquer un contenu pour une seule présentation : un élément masqué l'est pour toutes, y compris les lecteurs d'écran ; la valeur until-found place l'élément dans un état masqué où son contenu reste accessible à la recherche dans la page et à la navigation par fragment, le navigateur émettant alors beforematch, retirant l'attribut hidden et faisant défiler jusqu'à l'élément | [MDN — attribut global hidden](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/hidden) | Normatif — donne son ancrage technique à la limite « contenu non cherchable au Cmd+F » de R02, et révèle que hidden="until-found" lève précisément cette limite : le fichier ne mentionne pas cette valeur |
| S18 | L'information visuelle nécessaire à identifier les composants d'interface et leurs états présente un contraste d'au moins 3:1, sauf composant inactif ou apparence déterminée par le navigateur ; le critère n'exige pas ce ratio entre deux états qui n'apparaissent pas côte à côte | [WCAG 2.2 — 1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) | Établi, standard (niveau AA) — réponse à la question posée : le trait de l'onglet courant, en tant qu'information visuelle identifiant l'état sélectionné, doit atteindre 3:1 contre son fond adjacent ; en revanche l'écart entre onglet courant et onglet au repos n'est pas soumis au ratio tant qu'ils ne sont pas contigus |
| S19 | Dans l'exemple de référence à activation automatique, le tabpanel porte tabindex="0" afin de faciliter le passage d'un onglet au début du contenu du volet actif ; les flèches bouclent du dernier au premier onglet ; Origine et Fin portent le focus au premier et au dernier onglet et les activent | [ARIA APG — Tabs with Automatic Activation (exemple)](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/examples/tabs-automatic/) | Établi (pratique de référence W3C) — nuance importante : dans le motif, Origine et Fin sont déclarées « Optional » et tabindex=0 sur le tabpanel est conditionné à l'absence d'élément focalisable en tête de volet ; l'exemple, lui, les applique inconditionnellement |

*Toute règle sans source explicite repose sur un raisonnement de mécanisme (cohérence interne, ergonomie).*
