---
component: modal
layer: ux
type: component
version: 1.0.0 # 1.0.0 : première rédaction — la doctrine rattrape le composant. Modal est entré au catalogue le 2026-07-26 (site de doctrine, détail d'un cas d'usage) en appliquant OVERLAY-UX/UI à la lettre ; l'inventaire overlay le déclarait « couvert (mécanique posée), composant différé », le différé s'arrête ici (cf. DECISIONS.md 2026-07-26, entrée « MODAL / TABS »). Périmètre arbitré : confirmation d'action, saisie courte, détail/lecture ; formulaire long et wizard multi-étapes renvoyés à une page dédiée.
last_updated: 2026-07-26
companion: MODAL-UI.md
confidence: mixed # la mécanique héritée d'OVERLAY-UX (scrim, piège de focus, Échap, retour au déclencheur, scroll-lock) est établie (ARIA APG Dialog Modal, WCAG) ; le seuil de légitimité et « une seule modale à la fois » sont établis par convergence (NN/g, Material, Carbon) ; les deux crans de largeur sont un arbitrage interne daté 2026-07-26.
---

# Modal — Couche UX (composant)

> La modale est le superposé qui **interrompt** : elle bloque le flux, réclame une décision ou une saisie
> courte, et rend la main une fois la question réglée. `OVERLAY-UX.md` a déjà tranché toute sa mécanique
> (modal vs non-modal, z-index, scrim, focus, scroll-lock) — cette fiche ne la rouvre pas, elle **spécialise**
> la branche « modale/dialog » de cette fondation : quand l'ouvrir, comment la peupler, comment la fermer.

## Nature et périmètre

RÈGLE [MODAL-R01] : une modale est un `dialog` **modal** et **centré** — la seconde forme de superposé modal après le
STATUT : note de méthode
SOURCE : S1, S14
ÉNONCÉ : Une modale est un dialogue modal centré : elle hérite intégralement de la mécanique de superposé modal que possède OVERLAY — voile, piège de focus, inertie du fond, verrouillage du défilement, fermeture par Échap, retour du focus au déclencheur — et ne s'en distingue que par son ancrage, centré plutôt qu'ancré à un bord.
MESURE : la fiche du composant ne redéfinit aucune règle de voile, de focus, d'inertie, de défilement ni de fermeture : chacune renvoie à OVERLAY
Drawer (`OVERLAY-UX.md`, ligne « Modal vs non-modal »), qui partage tout : scrim, piège de focus, Échap,
retour au déclencheur, verrouillage du défilement. Ce qui la distingue du Drawer est seulement l'**ancrage**
(centré vs bord) — jamais réinventé ici (cf. « Frontière avec Drawer » plus bas).

RÈGLE [MODAL-R02] : une modale porte toujours une **conclusion** — une action qui la ferme légitimement (valider, annuler,
STATUT : propriété universelle
SOURCE : S3, S4, S18
ÉNONCÉ : Une modale porte toujours une conclusion : au moins une action qui la ferme et clôt la question posée. Un contenu sans fin naturelle — navigation libre, exploration longue, information destinée à persister — relève d'une page, jamais d'une modale.
MESURE : toute modale expose au moins une action de conclusion ; aucune modale n'héberge de navigation interne ni de contenu destiné à rester disponible après sa fermeture
fermer une fois lu). Un contenu sans fin naturelle (navigation libre, exploration longue) n'est pas un cas de
modale ; c'est une page.

## Légitimité — quand une modale, et quand autre chose

RÈGLE [MODAL-R03] : une modale est légitime quand trois conditions tiennent à la fois : (1) l'interruption est **courte**
STATUT : parti pris d'identité
SOURCE : S3, S4, S18
ÉNONCÉ : Une modale n'est légitime que lorsque trois conditions tiennent ensemble : l'interruption est courte, une décision doit être prise avant de pouvoir continuer ailleurs, et le contexte d'origine doit être retrouvé intact ; dès que l'une manque, le besoin est routé vers une page, un drawer, une saisie en ligne, une notification ou un popover.
MESURE : chaque ouverture de modale documentée satisfait les trois conditions ; un besoin qui n'en satisfait que deux est routé vers l'alternative correspondante
(quelques secondes de lecture ou de saisie, pas une tâche) ; (2) une **décision** doit être prise avant de
pouvoir continuer ailleurs ; (3) le **contexte d'origine compte** — l'utilisateur doit revenir exactement où
il était, ce qu'une navigation vers une page dédiée casserait.

| Besoin réel | Solution | Pourquoi pas la modale |
|---|---|---|
| Contenu long, autonome, partageable par URL | **Page dédiée** | Une modale n'a pas d'URL propre, ne se marque pas, ne s'indexe pas |
| Contenu lié au contexte mais volumineux ou multi-étapes | **Drawer** | Le défilement long et l'aller-retour répété usent moins ancrés au bord que centrés |
| Édition d'un seul champ visible dans son contexte | **Saisie en ligne (inline)** | La modale masque justement le contexte qu'il faut voir pour éditer |
| Information qui n'exige aucune décision immédiate | **Toast / Alert** | Rien à interrompre — cf. « Frontière avec Toast et Alert » |
| Aide ponctuelle, ancrée à un élément précis | **Popover** | Non-modal, léger, n'a pas besoin de piéger le focus pour un détail court |

> **Pourquoi ce triple test** : chacune des trois conditions, prise seule, ouvre trop de portes — beaucoup de
> contenus sont courts sans réclamer de décision (un tooltip l'est aussi), beaucoup réclament une décision
> sans être courts (un formulaire d'inscription l'est aussi). C'est la conjonction qui définit la modale.
>
> **Erreur fréquente** : ouvrir une modale pour un formulaire de 12 champs parce que « ça évite de changer de
> page ». Le défilement interne d'une modale (cf. plus bas) n'est pas fait pour porter un formulaire long — il
> est fait pour de la lecture. Un formulaire long est une page ; au pire, un drawer.

## Le coût d'interruption — une seule modale, jamais de modale sur modale

RÈGLE [MODAL-R04] : **une seule modale ouverte à la fois**. Une modale ouverte depuis une modale est interdite — pas
STATUT : parti pris d'identité
SOURCE : S10, S14
ÉNONCÉ : Une seule modale est ouverte à la fois : une modale n'en déclenche jamais une seconde et deux surfaces modales ne se superposent jamais.
MESURE : au plus une surface portant aria-modal="true" est montée dans le document à un instant donné ; aucun gestionnaire interne à une modale n'ouvre une autre modale
d'empilement, pas de `z-index.overlay` sur `z-index.overlay`.

RÈGLE [MODAL-R05] : quand une action dans une modale a elle-même besoin d'une confirmation (ex. supprimer un élément
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Lorsqu'une action lancée depuis une modale réclame elle-même une confirmation, la modale ouverte remplace son propre contenu par l'étape de confirmation au lieu d'empiler une seconde surface ; fermer puis rouvrir n'est admis que si le contexte de retour n'a pas besoin d'être préservé.
MESURE : une confirmation demandée depuis une modale s'affiche dans la surface déjà montée ; aucune seconde surface modale n'est créée
depuis une modale d'édition), la modale existante **remplace son propre contenu** par l'étape de confirmation
— elle ne s'empile pas une seconde. Fermer d'abord puis rouvrir est acceptable seulement si le contexte du
retour n'a pas besoin d'être préservé.

> **Pourquoi** : deux modales ouvertes posent deux pièges de focus concurrents et deux voiles superposés —
> Échap et Tab n'ont plus de destinataire non ambigu (ni ARIA APG ni aucun système majeur ne documente de
> comportement correct pour ce cas, cf. table de sources). Le voile d'une seconde modale sur la première rend
> aussi la première illisible sans la fermer, ce qui contredit sa propre raison d'être.
>
> **Erreur fréquente** : une modale de confirmation « Voulez-vous vraiment quitter sans enregistrer ? »
> ouverte par-dessus une modale de formulaire. La bonne forme est un remplacement de contenu dans la même
> surface, pas une seconde surface.

## Les trois familles d'usage

RÈGLE [MODAL-R06] : trois familles couvrent l'usage légitime de la modale, et rien d'autre n'en justifie une quatrième
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Trois familles d'usage seulement sont admises pour la modale — confirmation d'action, saisie courte, détail ou lecture — chacune fixant son contenu, son cran de largeur et son nombre d'actions ; toute quatrième famille suppose de remonter l'arbitrage.
MESURE : toute modale du produit se rattache à l'une des trois familles déclarées
sans remonter l'arbitrage.

| Famille | Contenu | Largeur | Actions |
|---|---|---|---|
| **Confirmation d'action** | Une question fermée, sa conséquence en une ou deux phrases | `grid.container-narrow` (`size="narrow"`) | Deux boutons : l'action et son retrait — jamais plus |
| **Saisie courte** | Un à trois champs qui n'ont pas besoin de tout l'écran | `grid.container-narrow` (`size="narrow"`) | Valider / Annuler — le nom du bouton reflète la conclusion (renvoi BUTTON-UX) |
| **Détail / lecture** | Une fiche, un aperçu, un tableau court, une illustration | `grid.overlay` (`size="default"`) | Zéro à une action ; souvent un simple bouton de fermeture |

RÈGLE [MODAL-R07] : la largeur suit la famille, pas l'inverse — une confirmation reste sur `narrow` même si son texte
STATUT : parti pris d'identité
SOURCE : S8
ÉNONCÉ : Le cran de largeur d'une modale est déterminé par sa famille d'usage et jamais par la longueur de son contenu : un texte long se replie en lignes supplémentaires, il ne fait pas passer la modale au cran supérieur.
MESURE : la largeur maximale d'une modale se déduit de sa famille d'usage ; aucune modale ne déclare une largeur motivée par la quantité de contenu
d'explication est long (le contenu se replie en lignes, il ne pousse jamais le cran de largeur).

> **Pourquoi seulement deux crans** : `DECISIONS.md` (2026-07-26) l'a tranché lors de la création de
> `grid.overlay` — 480 couvre déjà la confirmation, 640 couvre l'illustration ou le tableau court, et au-delà
> le contenu appelle une page. CONFIANCE : les deux crans eux-mêmes (480/640) sont un arbitrage interne
> ajustable ; ce qui est établi, c'est qu'une modale plus large qu'une page de contenu n'a plus de sens.

## La destruction — confirmer une action irréversible

RÈGLE [MODAL-R08] : toute action destructive et irréversible se confirme dans une modale de la famille « confirmation »
STATUT : propriété universelle
SOURCE : S5, S6, S12
ÉNONCÉ : Toute action destructive et irréversible dont le coût dépasse ce qu'une annulation suffirait à réparer se confirme dans une modale de la famille confirmation, jamais par une simple alerte dans le flux ni par une boîte de dialogue native du navigateur.
MESURE : toute action irréversible au-delà du seuil de friction déclaré passe par une modale de confirmation ; aucun appel à window.confirm dans le code produit
(jamais une simple alerte inline, jamais un `window.confirm`) — dès lors que le critère de friction de
`BUTTON-UX.md` (§ Quel palier choisir) place l'action au-delà du « triviale à recréer, undo suffisant ».

RÈGLE [MODAL-R09] : le **titre et le corps nomment l'objet réel**, jamais un « Confirmer » générique — « Supprimer le
STATUT : propriété universelle
SOURCE : S5, S6, S10, S11
ÉNONCÉ : Le titre et le corps d'une confirmation destructive nomment l'objet réel visé et la conséquence de l'action, jamais une formule générique : la question doit se comprendre sans relire l'écran de fond.
MESURE : le titre d'une modale de confirmation destructive contient le verbe de l'action et le nom de l'objet visé ; aucune formulation de type « Êtes-vous sûr ? » ou « Confirmer »
projet *Rocket* ? », pas « Êtes-vous sûr ? ». Le corps précise la conséquence en une phrase quand elle n'est
pas évidente (« Cette action est définitive » ; « Les 12 membres perdront l'accès »).

RÈGLE [MODAL-R10] : le bouton destructif porte `filled` + `destructive` (renvoi `BUTTON-UX.md`) et se positionne selon la
STATUT : propriété universelle
SOURCE : S1, S5
ÉNONCÉ : Dans une modale de confirmation destructive, l'action irréversible n'est jamais celle qu'un appui réflexe sur Entrée déclenche : le focus initial va à l'action la moins destructive, ou aucune action n'est pré-activée ; l'emphase et la position du bouton destructif restent fixées par le langage de bouton.
MESURE : à l'ouverture d'une modale de confirmation destructive, l'élément focalisé n'est pas le bouton destructif
convention de paire modale du produit — jamais réinventée modale par modale (renvoi `BUTTON-UX.md` § Dans une
modale). Il **n'est jamais le bouton par défaut activable par un simple Entrée réflexe** (même renvoi) :
l'action sûre (Annuler/Retour) peut recevoir le focus initial, ou aucune action n'est pré-activée par Entrée.

RÈGLE [MODAL-R11] : pour une destruction à enjeu élevé (volume important, coûteuse à recréer), la modale porte la
STATUT : propriété universelle
SOURCE : S6, S12
ÉNONCÉ : Une destruction à enjeu élevé — volume important, ressources dépendantes, recréation coûteuse — exige une confirmation renforcée, dont la forme documentée est la saisie manuelle du nom de la ressource avant activation du bouton destructif ; la modale héberge ce mécanisme sans le redéfinir.
MESURE : pour une destruction à enjeu élevé, le bouton destructif reste inactif tant que la confirmation renforcée n'est pas satisfaite
confirmation différée que `BUTTON-UX.md` décrit (délai avant activation, ou saisie explicite type « tapez
SUPPRIMER ») — la modale ne fait qu'héberger ce mécanisme, elle ne le redéfinit pas.

> **Pourquoi nommer l'objet** : « Êtes-vous sûr ? » force une seconde lecture pour retrouver de quoi il est
> question ; la question qui se suffit à elle-même réduit l'erreur de clic sur le mauvais élément.
>
> **Erreur fréquente** : une modale de confirmation dont le bouton par défaut (focus initial + Entrée) est
> l'action destructive elle-même — un utilisateur clavier qui ferme vite d'un réflexe Entrée exécute alors
> l'irréversible.

## La fermeture — Échap, croix, clic-voile, et son désarmement

RÈGLE [MODAL-R12] : trois sorties toujours actives, héritées d'`OVERLAY-UX.md` sans exception : **Échap**, la **croix** du
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Les trois moyens de sortie d'une modale — la touche Échap, le bouton de fermeture et le clic sur le voile — appartiennent à OVERLAY, qui les possède pour tout superposé modal ; la modale les consomme sans en ajouter ni en retirer.
`Header` (`Modal.Close`), et le **clic sur le voile** (équivalent d'une annulation). Une modale de type
« détail/lecture » sans action de fond n'a besoin d'aucune autre sortie.

RÈGLE [MODAL-R13] : le clic-voile se **désarme** (`dismissOnScrim={false}`) quand une fermeture accidentelle perdrait une
STATUT : implémentation de référence
SOURCE : S9
ÉNONCÉ : Le clic sur le voile est le seul des trois moyens de fermeture qui se désarme, et seulement lorsqu'une fermeture accidentelle perdrait une saisie en cours ; Échap et le bouton de fermeture restent actifs dans tous les cas, et la confirmation de perte de données incombe au consommateur du composant, qui ne l'implémente pas nativement.
MESURE : la prop de fermeture au voile passe à faux dès qu'un champ de la modale est modifié ; Échap et le bouton de fermeture appellent la fermeture quelle que soit sa valeur
saisie en cours — un formulaire touché, un champ modifié. Échap et la croix restent actifs dans ce cas ; c'est
au consommateur du composant de router ces deux sorties vers une confirmation de perte de données s'il le
juge nécessaire (le composant Modal ne l'implémente pas nativement, cf. `MODAL-UI.md` § Limites).

> **Pourquoi désarmer seulement le voile** : le clic-voile est le geste le plus « accidentel » des trois — un
> clic hors-cible pendant qu'on lit l'écran. Échap et la croix sont des gestes intentionnels ; les priver de
> sortie recréerait le piège que WCAG 2.1.2 exclut (cf. `OVERLAY-UX.md`).
>
> **Erreur fréquente** : désarmer les trois sorties « pour protéger la saisie ». Une modale sans aucune issue
> visible ou clavier est un piège plein, pas une protection — la bonne réponse à une saisie en cours est de
> confirmer la perte, pas d'interdire la sortie.

## Le titre obligatoire et le nom accessible

RÈGLE [MODAL-R14] : toute modale a un **titre** — le `Modal.Header` le porte, et devient le **nom accessible** de la
STATUT : propriété universelle
SOURCE : S1, S13, S16
ÉNONCÉ : Toute modale expose un nom accessible : un titre visible référencé par aria-labelledby, ou à défaut un aria-label explicite porté par la surface ; l'absence des deux laisse le dialogue annoncé sans complément.
MESURE : toute surface role="dialog" porte soit un aria-labelledby résolvant vers un titre visible non vide, soit un aria-label non vide
surface (`aria-labelledby` posé automatiquement sur le `role="dialog"`). Une modale sans `Header` doit
recevoir un `aria-label` explicite ; l'absence des deux est une régression silencieuse (le lecteur d'écran
annonce « boîte de dialogue » sans complément).

RÈGLE [MODAL-R15] : le titre **nomme la tâche ou la question**, jamais l'objet générique du composant (« Confirmation »
STATUT : propriété universelle
SOURCE : S4, S10, S11
ÉNONCÉ : Le titre d'une modale nomme la tâche ou la question qu'elle pose, sous forme de phrase verbale brève, et jamais la catégorie du composant.
MESURE : aucun titre de modale n'est un nom de catégorie du type « Confirmation », « Information » ou « Modale »
plutôt que « Supprimer le projet Rocket ? » est la même erreur qu'un bouton « Confirmer » — cf. § Destruction).

## Le focus — entrée, piège, retour

RÈGLE [MODAL-R16] : la modale applique le contrat de focus d'`OVERLAY-UX.md` sans variation : à l'ouverture, le focus
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Le contrat de focus d'une modale — entrée du focus à l'ouverture, bouclage de Tab et Maj+Tab à l'intérieur, retour au déclencheur à la fermeture — appartient à OVERLAY, et l'anneau de focus des contrôles internes appartient au langage de bordure ; la modale n'en redéfinit aucun.
**entre** dans la surface (premier élément focalisable, sinon la surface elle-même) ; Tab/Maj+Tab **bouclent**
à l'intérieur ; à la fermeture, le focus **revient** au déclencheur (ou à l'élément le plus proche s'il a
disparu). Le ring de focus interne reste celui de `border.focus-width`/`border.focus-offset` — la modale ne
le redéfinit pas.

RÈGLE [MODAL-R17] : un `Header` avec `closable` (par défaut) place la **croix** en dernier élément focalisable naturel de
STATUT : implémentation de référence
SOURCE : S1, S10
ÉNONCÉ : Dans une modale de saisie, le focus d'entrée va au premier contrôle de saisie et non au bouton de fermeture ; le bouton de fermeture de l'en-tête n'est jamais placé avant le contenu principal dans l'ordre de tabulation.
MESURE : à l'ouverture d'une modale de saisie, l'élément focalisé est le premier contrôle de saisie du corps
l'en-tête ; elle ne doit jamais précéder le contenu principal dans l'ordre de tabulation d'une modale de
saisie (le premier champ reçoit le focus d'entrée, pas la croix).

## Le contenu long — défilement interne

RÈGLE [MODAL-R18] : au-delà de la hauteur disponible, seul le `Body` défile — jamais la page derrière (déjà verrouillée
STATUT : propriété universelle
SOURCE : S4, S17
ÉNONCÉ : Au-delà de la hauteur disponible, seule la région de contenu d'une modale défile : l'en-tête et le pied restent fixes et visibles, et la surface entière ne défile jamais.
MESURE : seule la région de contenu porte un débordement défilant ; l'en-tête et le pied restent visibles quelle que soit la hauteur du contenu
par `OVERLAY-UX.md`), jamais la surface entière (`Header` et `Footer` restent fixes, ancrés en haut et en
bas). Une modale de détail/lecture avec un contenu long est le cas d'usage qui exerce cette règle le plus.

RÈGLE [MODAL-R19] : un `Footer` d'actions reste **visible sans défiler** — jamais relégué en bas d'un contenu qui déborde,
STATUT : propriété universelle
SOURCE : S4, S15, S17
ÉNONCÉ : Le pied d'actions d'une modale reste atteignable sans défiler, et sa fixation ne recouvre jamais entièrement un contrôle qui vient de recevoir le focus dans la région défilante.
MESURE : les actions du pied sont visibles à l'ouverture quelle que soit la longueur du contenu ; aucun contrôle focalisé du corps n'est entièrement masqué par le pied
sous peine de rendre l'action principale introuvable dans une modale longue.

> **Pourquoi le défilement se limite au `Body`** : une modale qui laisse défiler toute sa surface perd son
> titre et ses actions hors champ, exactement le problème qu'une page évite avec un en-tête sticky. Border et
> footer fixes sont ce qui distingue une « boîte » d'une simple page réduite en fenêtre.

## Frontière avec Drawer

RÈGLE [MODAL-R20] : Modal et Drawer partagent **toute** la mécanique modale d'`OVERLAY-UX.md` (scrim, piège, Échap,
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Modale et drawer partagent toute la mécanique modale d'OVERLAY et ne divergent que sur l'ancrage — centré pour la modale, ancré à un bord pour le drawer ; le choix entre les deux se décide sur la nature du contenu, un défilement vertical long ou une navigation interne allant au drawer, une question fermée ou une fiche courte à la modale.
retour, scroll-lock, `z-index.overlay`) — ils divergent sur un seul axe, l'**ancrage** : la modale est
**centrée**, le drawer est **ancré à un bord**. Le choix entre les deux se fait sur la nature du contenu, pas
sur une préférence esthétique : un contenu qui se prête à un défilement vertical long ou à une navigation
interne (liste de réglages, panneau de filtres) va au drawer ; une question fermée ou une fiche courte va à
la modale.

## Frontière avec Toast et Alert

RÈGLE [MODAL-R21] : Toast et Alert **n'interrompent pas** — non-modaux (toast) ou dans le flux (alert), ils ne posent
STATUT : propriété universelle
SOURCE : S3, S4
ÉNONCÉ : Une information qui n'appelle aucune décision immédiate — succès, erreur non bloquante, changement de statut — se rend par une notification non modale ou une alerte dans le flux, jamais par une modale.
MESURE : aucune modale n'est ouverte pour un message dont la seule action possible est un accusé de réception
jamais de scrim, ne piègent jamais le focus, et l'utilisateur reste libre d'agir autour d'eux. La modale ne
concurrence jamais leur rôle : une information qui ne réclame **aucune décision immédiate** (succès, erreur
non bloquante, mise à jour de statut) est un toast ou une alerte inline, jamais une modale.

> **Erreur fréquente** : ouvrir une modale « Enregistré avec succès » avec un unique bouton OK. Rien à
> décider ici — c'est un toast.

## Frontières (ce que ce composant ne fait pas)

RÈGLE [MODAL-R22] : le **scrim**, le **z-index**, le **piège de focus**, le **scroll-lock** restent la propriété
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : La modale ne possède ni le voile, ni le cran d'empilement, ni le piège de focus, ni le verrouillage du défilement, qui restent à OVERLAY ; elle ne possède pas davantage l'ombre, l'anneau de focus, les durées et courbes, le wording, la structure d'un formulaire, ni l'emphase et l'ordre de ses boutons, qui restent aux langages qui les portent.
d'`OVERLAY-UX.md` — Modal les consomme, ne les redéfinit pas. L'**ombre** de la surface reste
`elevation.overlay` (ELEVATION), le **ring de focus** reste BORDER, les **durées/courbes** restent MOTION, le
**wording** des titres et boutons reste VOICE, la structure d'un formulaire porté par une modale de saisie
reste `FORM-UX.md`, l'emphase et l'ordre des boutons de son `Footer` restent `BUTTON-UX.md`.

## Sources et niveau de confiance

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| S1 | Toute la mécanique modale (scrim, piège de focus, Échap, retour au déclencheur, fond inerte, scroll-lock) | [ARIA APG — Dialog (Modal)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) ; renvoi `OVERLAY-UX.md` | Établi |
| S2 | Le piège modal est admis car Échap fournit la sortie clavier | [WCAG 2.1.2 — No Keyboard Trap](https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html) | Établi |
| S3 | Une seule modale à la fois, jamais de modale sur modale | Convergence — aucun motif d'empilement modal documenté par [ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/), [NN/g — Modal & Nonmodal Dialogs](https://www.nngroup.com/articles/modal-nonmodal-dialog/) | Établi par convergence |
| S4 | Trois conditions de légitimité (court, décision requise, contexte préservé) vs page/drawer/inline/toast | [NN/g — Modal & Nonmodal Dialogs](https://www.nngroup.com/articles/modal-nonmodal-dialog/), [Carbon — Modal usage](https://carbondesignsystem.com/components/modal/usage/) | Établi par convergence |
| S5 | Nommer l'objet dans le titre/le corps plutôt que « Confirmer » ; ne jamais mettre l'action destructive par défaut au clavier | [Nielsen — Confirmation Dialogs](https://www.nngroup.com/articles/confirmation-dialog/), renvoi `BUTTON-UX.md` | Établi par convergence |
| S6 | Palier de friction avant confirmation (undo / confirmation simple / confirmation différée) selon le coût de recréation | [Carbon — Delete/Remove pattern](https://carbondesignsystem.com/patterns/delete-and-remove-pattern/), renvoi `BUTTON-UX.md` | Établi |
| S7 | Défilement limité au `Body`, `Header`/`Footer` fixes | [Material — Dialogs](https://m3.material.io/components/dialogs/guidelines), [Polaris — Modal](https://polaris.shopify.com/components/overlays/modal) | Établi par convergence |
| S8 | Deux crans de largeur exacts (`container-narrow` 480 / `grid.overlay` 640) | Arbitrage interne, `DECISIONS.md` 2026-07-26 | Non formalisé — arbitrage à remonter si un troisième cran est demandé |
| S9 | Désarmement du clic-voile en cas de saisie non enregistrée, sans confirmation de sortie native | Cas isolé — raisonnement de mécanisme interne, pas de motif externe consulté | Cas isolé |
| S10 | « One modal should never trigger another modal » (section « When not to use ») ; « A modal dialog adds to a workflow's interaction cost; it takes the user out of their previous context » ; focus initial « to the first location that accepts user input », piégé jusqu'à la fermeture, puis rendu « to the element that invoked the modal » ; « The title should be brief and clearly describe the dialog's task or purpose » | [Carbon Design System — Dialog pattern](https://carbondesignsystem.com/patterns/dialog-pattern/) | Établi — design system public, vérifié. Seule interdiction explicite d'empilement modal trouvée dans un système public |
| S11 | « When a modal is triggered in contexts where multiple items may be visible simultaneously, explicitly identify the item being acted on in the messaging. For example, prefer "Are you sure you want to delete the Q4 Planning epic?" over a generic "Are you sure you want to delete the epic?" » | [GitLab Pajamas — Modal](https://design.gitlab.com/components/modal) | Établi — design system public, vérifié |
| S12 | Paliers de sévérité destructive ; pour la sévérité haute : « strongly consider implementing a modal to confirm the action », variante de bouton danger, et « Require input confirmation of the deleted object's name when the action removes additional resources within » | [GitLab Pajamas — Destructive actions](https://design.gitlab.com/usability/destructive-actions) | Établi — design system public, vérifié. Ne prescrit en revanche pas de retirer le focus initial du bouton destructif : ce point vient de S1 et S5 |
| S13 | « For all user interface components […] the name and role can be programmatically determined » — le nom accessible d'un dialogue est une obligation, pas une bonne pratique | [WCAG 2.2 — 4.1.2 Name, Role, Value (A)](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html) | Établi — critère normatif vérifié |
| S14 | La plateforme distingue nativement les deux formes : show() n'ajoute rien au top layer et ne bloque pas le document ; showModal() ajoute l'élément au top layer et met le document « blocked by the modal dialog », ce qui rend inerte la zone focalisée hors du dialogue, enregistre l'« previously focused element » pour la restitution, et active le light-dismiss et la requête de fermeture (Échap). La spécification ne contient aucune exigence de verrouillage du défilement, et n'interdit pas plusieurs dialogues simultanés dans le top layer | [WHATWG HTML — The dialog element](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element) | Établi, spécification normative — vérifié. Contredit l'idée que l'unicité de la modale serait une contrainte de plateforme : c'est un choix produit |
| S15 | « When a user interface component receives keyboard focus, the component is not entirely hidden due to author-created content » (niveau AA) ; les pieds et en-têtes collants sont nommés comme contenus typiques qui recouvrent l'élément focalisé ; « A properly constructed modal dialog will always pass this SC » vaut pour la modale elle-même, pas pour son propre pied fixe recouvrant un contrôle du corps | [WCAG 2.2 — 2.4.11 Focus Not Obscured (Minimum) (AA)](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html) | Établi — critère normatif vérifié |
| S16 | « Information, structure, and relationships conveyed through presentation can be programmatically determined or are available in text » — la relation entre le titre visible d'une modale et sa surface, et le niveau de titre, sont des relations structurelles à exposer | [WCAG 2.2 — 1.3.1 Info and Relationships (A)](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html) | Établi — critère normatif vérifié |
| S17 | Titre obligatoire servant d'aria-label ; « If the maximum height is reached, the body contents will scroll » avec en-tête et pied fixes ; quatre largeurs standard (296 / 320 / 480 / 640) | [GitHub Primer — Dialog](https://primer.style/product/components/dialog/) | Établi — design system public, vérifié |
| S18 | « Modals are overlays that require merchants to take an action before they can continue interacting with the rest of Shopify. They can be disruptive and should be used thoughtfully and sparingly » ; « Not have more than two buttons » ; « Don't use modals to display complex forms or large amounts of information » | [Shopify Polaris — Modal](https://polaris-react.shopify.com/components/deprecated/modal) | Établi par convergence, avec réserve — la page est explicitement marquée dépréciée et renvoie à l'API App Bridge Modal ; utilisée comme source d'appoint, jamais seule |

*Toute règle sans source explicite repose sur un raisonnement de mécanisme (cohérence avec `OVERLAY-UX.md` et les fondations voisines).*
