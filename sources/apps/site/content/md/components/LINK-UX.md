---
component: link
layer: ux
version: 1.1.0 # 1.1.0 : rattachement nommé à Voice (wording de lien) et Motion (feedback d'état), absence E-motion explicitée — 2026-07-21. 1.0.0 : première rédaction — dette explicite résorbée : navigation distincte de l'action, dans le langage d'interaction
last_updated: 2026-07-21
companion: LINK-UI.md
confidence: established
---

# Link — Couche UX

> Un lien promet une destination. Un bouton promet une action. Cette distinction est le point
> d'ancrage du composant et l'application directe de `INTERACTION-UX.md`.

## But

RÈGLE [LINK-R01] : utiliser un Link pour conduire vers une autre page, ressource, section ou URL.
STATUT : propriété universelle
SOURCE : S4, S10
ÉNONCÉ : Un déclencheur qui conduit l'utilisateur vers une autre page, ressource, section ou URL est un lien.
MESURE : toute navigation est portée par un élément de type lien, jamais par un bouton

RÈGLE [LINK-R02] : utiliser un Button quand l'activation modifie l'état courant, soumet, crée, supprime, ouvre
STATUT : propriété universelle
SOURCE : S4, S10
ÉNONCÉ : Un déclencheur dont l'activation modifie l'état courant, soumet, crée, supprime ou lance un traitement est un bouton, y compris dans une application monopage : c'est le résultat perçu qui décide, pas la technologie de routage.
MESURE : aucun lien ne déclenche une action sans changement de destination
une action ou déclenche un traitement. Le fait qu'une application soit une SPA ne change pas cette
frontière : c'est le résultat perçu qui décide.

RÈGLE [LINK-R03] : un lien qui ouvre une modale d'action est une mauvaise promesse ; un bouton qui conduit vers
STATUT : propriété universelle
SOURCE : S4, S10
ÉNONCÉ : Un lien qui ouvre une modale d'action et un bouton qui conduit vers une page sont l'un et l'autre des promesses fausses ; toute exception se justifie par le parcours, jamais par un besoin de style.
MESURE : aucun lien n'ouvre une modale d'action ; aucun bouton ne provoque un changement de page
une page est une mauvaise promesse. Les exceptions exigent une justification de parcours, pas un
besoin de style.

## Contextes

### Lien inline

RÈGLE [LINK-R04] : dans un paragraphe, le lien reste identifiable sans dépendre de la couleur seule. Le
STATUT : propriété universelle
SOURCE : S2
ÉNONCÉ : Un lien placé dans un bloc de texte reste identifiable sans dépendre de la couleur seule, le soulignement étant le signal par défaut.
MESURE : un lien dans un bloc de texte est distingué autrement que par la seule couleur, au repos
soulignement est le signal par défaut.

RÈGLE [LINK-R05] : le libellé garde du sens hors contexte immédiat. « En savoir plus » seul est évité quand
STATUT : propriété universelle
SOURCE : S1, S6
ÉNONCÉ : Le libellé d'un lien garde son sens hors de son contexte immédiat ; un libellé générique répété est proscrit dès que plusieurs occurrences mènent à des destinations différentes.
MESURE : deux liens de même libellé dans une même page ne mènent pas à des destinations différentes
plusieurs liens identiques mènent vers des destinations différentes.

### Lien autonome

RÈGLE [LINK-R06] : un lien placé seul peut associer texte et icône directionnelle. Il reste plus léger qu'un
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Un lien autonome peut associer texte et icône directionnelle ; il reste plus léger qu'un bouton adjacent et ne concurrence pas l'action dominante de l'écran.
bouton adjacent et ne concurrence pas l'action dominante.

### Navigation

RÈGLE [LINK-R07] : les liens de navigation identifient la destination courante avec un signal non chromatique
STATUT : propriété universelle
SOURCE : S2, S12
ÉNONCÉ : Dans un ensemble de navigation, la destination courante est signalée par un indice non chromatique et par l'état programmatique correspondant, et n'est pas présentée comme une action.
MESURE : la destination courante porte aria-current et un signal non chromatique
et l'état programmatique approprié. La destination courante n'est pas présentée comme une action.

### Téléchargement et destination externe

RÈGLE [LINK-R08] : un téléchargement annonce la nature du fichier et, quand elle est utile, sa taille.
STATUT : propriété universelle
SOURCE : S10, S11
ÉNONCÉ : Un lien de téléchargement annonce la nature du fichier et, quand elle est utile, sa taille, avant l'activation.
MESURE : tout lien de téléchargement mentionne le format du fichier dans son nom accessible

RÈGLE [LINK-R09] : l'ouverture d'un nouvel onglet reste exceptionnelle et est annoncée dans le libellé ou par
STATUT : propriété universelle
SOURCE : S7, S10
ÉNONCÉ : L'ouverture d'un nouvel onglet reste exceptionnelle et est annoncée dans le libellé ou par une indication accessible équivalente ; une icône seule ne suffit pas tant que sa signification n'est pas établie dans le produit.
MESURE : tout lien ouvrant un nouvel onglet porte une mention d'ouverture externe dans son nom accessible
une indication accessible cohérente. Une icône seule ne suffit pas si sa signification n'est pas
établie dans le produit.

## États

RÈGLE [LINK-R10] : default, hover, focus, active et visited restent distinguables quand ils s'appliquent.
STATUT : parti pris d'identité
SOURCE : S13
ÉNONCÉ : Les états default, hover, focus, active et visited d'un lien restent distinguables les uns des autres partout où ils s'appliquent.
MESURE : chaque état appliqué se distingue de l'état default par au moins une propriété visuelle

RÈGLE [LINK-R11] : `visited` sert surtout aux collections de contenu où se souvenir des pages consultées aide la
STATUT : parti pris d'identité
SOURCE : S14
ÉNONCÉ : L'état visited est réservé aux collections de contenu où se souvenir des pages consultées sert la tâche ; il peut être omis dans la navigation applicative persistante lorsqu'il brouillerait le repère de destination courante.
tâche. Il peut être omis dans la navigation applicative persistante si son changement brouillerait le
repère courant.

RÈGLE [LINK-R12] : un lien n'a normalement pas d'état disabled. Si la destination n'est pas disponible, le lien
STATUT : parti pris d'identité
SOURCE : S10
ÉNONCÉ : Un lien n'a pas d'état désactivé : une destination indisponible est retirée ou remplacée par une explication, jamais laissée sous la forme d'un lien inerte.
MESURE : aucun lien ne porte un état disabled ou aria-disabled
est retiré ou remplacé par une explication ; un faux lien inerte garde une promesse impossible.

## Icônes

RÈGLE [LINK-R13] : une icône leading décrit la ressource ; une icône trailing décrit la direction ou la nature
STATUT : parti pris d'identité
SOURCE : S9
ÉNONCÉ : Une icône de lien complète le libellé — en tête elle décrit la ressource, en fin elle décrit la direction ou la nature de la destination — et ne le remplace que si le lien conserve un nom accessible explicite.
de la destination. Elle ne remplace pas le libellé sauf convention universellement comprise et nom
accessible explicite.

RÈGLE [LINK-R14] : un lien icône seule conserve une cible tactile suffisante et un nom accessible. Sa forme ne
STATUT : propriété universelle
SOURCE : S8, S9
ÉNONCÉ : Un lien réduit à une icône porte un nom accessible et une cible pointeur suffisante, et sa forme ne le fait pas passer pour un bouton alors que son résultat est une navigation.
MESURE : tout lien icône seule a un nom accessible non vide et une cible ≥ 24×24 px CSS
doit pas le faire confondre avec un IconButton si le résultat est une navigation.

## Carte cliquable

RÈGLE [LINK-R15] : une Card cliquable vers un détail contient un vrai Link dont le texte accessible est le titre
STATUT : propriété universelle
SOURCE : S4, S9, S10
ÉNONCÉ : Une carte cliquable vers un détail contient un lien réel dont le texte accessible est le titre de la carte ; l'extension de la surface cliquable est une technique de ce lien, pas un gestionnaire de clic posé sur un conteneur inerte.
MESURE : aucune surface de carte navigable n'est portée par un élément non interactif muni d'un gestionnaire de clic
de la carte. La surface étendue reste une technique du Link, pas un `div onclick`.

RÈGLE [LINK-R16] : les actions internes à la Card restent hors du lien et conservent leur propre sémantique.
STATUT : propriété universelle
SOURCE : S10
ÉNONCÉ : Les actions internes à une carte restent hors du lien et conservent leur propre sémantique ; aucun élément interactif n'est descendant d'un lien.
MESURE : aucun élément interactif n'est descendant d'un élément de type lien

## Wording

RÈGLE [LINK-R17] : le texte décrit la destination ou la ressource : « Voir les factures », « Documentation de
STATUT : propriété universelle
SOURCE : S1, S6
ÉNONCÉ : Le texte d'un lien décrit la destination ou la ressource, et évite l'URL brute dès qu'un nom humain est disponible.
MESURE : aucun libellé de lien réduit à « cliquez ici », « ici » ou « en savoir plus » seul
l'API », « Conditions d'utilisation ». Il évite l'URL brute quand un nom humain est disponible.

RÈGLE [LINK-R18] : le contexte accessible permet de comprendre la fonction du lien. Plusieurs liens portant le
STATUT : propriété universelle
SOURCE : S1, S6
ÉNONCÉ : Le contexte accessible d'un lien permet d'en comprendre la fonction, et deux liens portant le même texte accessible conduisent à la même nature de destination.
MESURE : deux liens de même texte accessible dans une page mènent à la même nature de destination
même texte conduisent à la même nature de destination.

RÈGLE [LINK-R19] : ces règles de wording sont la déclinaison locale de `VOICE-UX.md`, cadre unificateur du
STATUT : note de méthode
SOURCE : S5
ÉNONCÉ : Les règles de wording du lien ne sont pas réécrites dans ce fichier : elles se rattachent nommément au cadre transversal du langage, qui fait autorité sur le vocabulaire et l'autosuffisance du texte de lien.
wording de lien — § « Le mot est le canal d'information fiable » (« le texte de lien se suffit hors
contexte », WCAG 2.4.4) et § « Cohérence — une voix, un vocabulaire » (un concept, un mot). Elles ne
sont pas réécrites ici, elles s'y rattachent.

## Risque

| Cas | Risque principal | Sévérité |
|---|---|---|
| Link utilisé pour une action | Sémantique, clavier et attente utilisateur incohérents | Élevée |
| Button utilisé pour naviguer | Comportements natifs du lien perdus | Élevée |
| Lien inline distingué par la couleur seule | Lien invisible pour une partie des utilisateurs | Élevée |
| « En savoir plus » répété | Destination incompréhensible hors contexte | Moyenne |
| Nouvel onglet non annoncé | Changement de contexte inattendu | Moyenne |
| Lien disabled | Promesse visible mais impossible | Moyenne |

## Règle transversale

RÈGLE [LINK-R20] : **un Link dit “aller”, un Button dit “faire”.** Le poids visuel ne change jamais cette
STATUT : propriété universelle
SOURCE : S4, S10
ÉNONCÉ : Un lien dit « aller », un bouton dit « faire » ; le poids visuel ne modifie jamais cette répartition.
grammaire.

RÈGLE [LINK-R21] : Link n'invoque aucun instrument E-motion : un clic de navigation est une action à haute
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Le lien n'invoque aucun instrument d'animation expressive : un clic de navigation est une interaction à haute fréquence, hors du catalogue des moments mérités, et son seul besoin temporel est le feedback d'état.
MESURE : aucune animation d'un lien n'excède la durée de feedback du système
fréquence, hors du catalogue des moments mérités (`EMOTION-UX.md` § budget de rareté). Son seul
besoin temporel est le feedback d'état (cf. Motion, `LINK-UI.md`).

## Sources et niveau de confiance

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| S1 | La fonction d'un lien est déterminable à partir de son texte ou de son contexte | [WCAG 2.2 — 2.4.4 Link Purpose](https://www.w3.org/TR/WCAG22/#link-purpose-in-context) | Établi |
| S2 | La couleur ne suffit pas à identifier un lien inline | [WCAG 2.2 — 1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color) | Établi |
| S3 | Un changement de contexte au focus ou à la saisie doit être prévisible | [WCAG 2.2 — 3.2.1 On Focus](https://www.w3.org/TR/WCAG22/#on-focus), [3.2.2 On Input](https://www.w3.org/TR/WCAG22/#on-input) | Établi |
| S4 | Séparation lien/navigation et bouton/action | Sémantique HTML + convergence des design systems majeurs | Établi |
| S5 | Texte de lien signifiant, cadre wording | `VOICE-UX.md` (§ Le mot est le canal fiable / § Cohérence) | Établi — langage transversal |
| S6 | La fonction d'un lien est déterminable à partir de son texte seul, hors contexte environnant | [WCAG 2.2 — 2.4.9 Link Purpose (Link Only)](https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-link-only.html) | Établi, standard (AAA) — complète S1 (2.4.4, niveau A, qui n'exige que le contexte) |
| S7 | Un changement de contexte — dont l'ouverture d'un nouvel onglet — n'est légitime que sur demande de l'utilisateur, et l'avertissement se fait dans le texte du lien ou par une description accessible équivalente | [WCAG 2.2 — 3.2.5 Change on Request](https://www.w3.org/WAI/WCAG22/Understanding/change-on-request.html) ; [WCAG — Technique G201](https://www.w3.org/WAI/WCAG21/Techniques/general/G201) | Établi, standard (AAA) — G201 se déclare elle-même consultative ; c'est 3.2.5 qui porte la norme. Ancrage mince, assumé |
| S8 | Seuils de cible pointeur : 24 × 24 px CSS minimum (AA, avec exception explicite pour les liens en ligne dans une phrase), 44 × 44 px CSS renforcé (AAA) | [WCAG 2.2 — 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) ; [WCAG 2.2 — 2.5.5 Target Size (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html) | Établi, standard (AA et AAA) — le 44 px cité par ce composant est le seuil AAA, pas le seuil de conformité courant |
| S9 | Tout composant d'interface, liens compris, expose un nom et un rôle programmatiquement déterminables | [WCAG 2.2 — 4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html) | Établi, standard (A) |
| S10 | Sémantique native du lien : une ancre sans href ne crée pas d'hyperlien ; l'attribut download déclare l'intention de téléchargement ; un lien ne peut pas contenir de contenu interactif | [HTML Living Standard — Links](https://html.spec.whatwg.org/multipage/links.html) ; [MDN — élément a](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a) ; [ARIA APG — Link Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/link/) | Normatif — remplace le renvoi non sourcé « Sémantique HTML » de S4 |
| S11 | Un lien vers un document annonce son format et sa taille dans le libellé, donc dans le nom accessible | [GOV.UK Publishing Components — Attachment link](https://components.publishing.service.gov.uk/component-guide/attachment_link) ; [ONS Design System — Document list](https://service-manual.ons.gov.uk/design-system/components/document-list) | Établi par convergence — 2 systèmes publics vérifiés |
| S12 | L'élément courant d'un ensemble (navigation, pagination, fil d'Ariane) se déclare par aria-current | [WAI-ARIA 1.2 — aria-current](https://www.w3.org/TR/wai-aria-1.2/#aria-current) | Normatif — la couche UX invoquait « l'état programmatique approprié » sans le nommer |
| S13 | L'indicateur de focus clavier reste visible | [WCAG 2.2 — 2.4.7 Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html) | Établi, standard (AA) — ne couvre que le volet focus, pas hover/active/visited |
| S14 | Pour des raisons de vie privée, :visited ne peut modifier que des propriétés de couleur ; aucun signal non chromatique n'est techniquement possible sur cet état | [MDN — :visited](https://developer.mozilla.org/en-US/docs/Web/CSS/:visited) | Normatif (contrainte des navigateurs) — explique pourquoi visited est le seul état exempté de « jamais la couleur seule » |
