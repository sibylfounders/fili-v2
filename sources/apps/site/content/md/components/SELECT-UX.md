---
component: select
layer: ux
type: component
version: 1.0.0 # 1.0.0 : première rédaction — INPUT-UX renvoyait déjà « un choix parmi des options prédéfinies et limitées » au select (l.71) ; besoin réel : sélecteur de site + réglages du rail d'outils du shell (2026-07-24). Liste en popover NON-MODAL (consomme la fondation overlay, lot C). Motif clavier : ARIA APG « select-only combobox ». Périmètre arbitré : mono-sélection ; multi/recherche différés. Cf. DECISIONS.md 2026-07-24.
last_updated: 2026-07-24
companion: SELECT-UI.md
confidence: mixed # le motif combobox/listbox et son clavier sont établis (ARIA APG) ; le seuil select vs radio est un repère convergent, pas une loi.
---

# Select — Couche UX (composant)

> Choisir **une** valeur parmi un ensemble **prédéfini et limité**. INPUT renvoie ici dès que le choix n'est
> pas une saisie libre. Un **déclencheur** (qui montre la valeur choisie) ouvre une **liste** (listbox) en
> **popover non-modal** — la fondation `overlay` en porte l'ancrage, le light-dismiss et l'empilement.

## Quand un select (et quand autre chose)

RÈGLE [SELECT-R01] : **select** pour un choix unique dans une liste **longue ou encombrante** à déplier à la demande.
STATUT : parti pris d'identité
SOURCE : S3, S10, S11, S12
ÉNONCÉ : Le select est réservé au choix unique dans une liste assez longue ou encombrante pour justifier d'être repliée ; en deçà du seuil retenu d'environ cinq options comparables d'un coup d'œil, le choix est présenté en radios visibles, une saisie libre relève du champ de texte et une bascule à effet immédiat du switch.
MESURE : aucun select ne porte un choix binaire ni une saisie libre
Pour **peu d'options** (repère ≈ 2-5) toutes utiles à comparer d'un coup, préférer des **radios** visibles ;
pour une saisie libre, c'est un **input** ; pour activer/désactiver une fonction tout de suite, un **switch**.

RÈGLE [SELECT-R02] : le déclencheur **montre la valeur courante** (ou un placeholder neutre si aucun choix), jamais une
STATUT : propriété universelle
SOURCE : S4, S5, S7
ÉNONCÉ : Le déclencheur d'un select affiche la valeur actuellement sélectionnée, ou à défaut un placeholder neutre qui n'est ni une option sélectionnable ni une valeur soumissible, et jamais une étiquette figée qui masquerait la sélection.
MESURE : le texte du déclencheur change à chaque changement de valeur ; l'option de placeholder porte une valeur vide et ne satisfait pas une contrainte de champ requis
étiquette figée qui masque ce qui est sélectionné. Le placeholder n'est pas une option sélectionnable.

## Comportement de la liste (popover non-modal)

RÈGLE [SELECT-R03] : la liste est un superposé **non-modal** (fondation overlay) : **ancrée au déclencheur**, **sans
STATUT : propriété universelle
SOURCE : S1, S2, S9
ÉNONCÉ : La liste d'un select est un superposé non modal : ancrée à son déclencheur, sans voile, sans piège de focus, refermée aussi bien par Échap que par un clic ou un focus à l'extérieur, et rendant le focus au déclencheur à la fermeture.
MESURE : Échap et un clic extérieur ferment la liste ; aucun piège de focus n'est posé ; le focus revient au déclencheur après fermeture
voile**, **sans piège de focus**, fermée en **light-dismiss** (Échap **ou** clic/focus en dehors) ; elle
applique `z-index.popover` et rend le focus au déclencheur à la fermeture.

RÈGLE [SELECT-R04] : à l'ouverture, l'option **sélectionnée** (ou la première) devient l'option **active** ; la liste ne
STATUT : propriété universelle
SOURCE : S1, S8
ÉNONCÉ : À l'ouverture de la liste, l'option sélectionnée — ou la première à défaut — devient l'option active sans que le focus du document quitte le déclencheur : l'option active est désignée par aria-activedescendant et rendue visible dans la liste.
MESURE : à l'ouverture, aria-activedescendant du déclencheur désigne l'option sélectionnée ou la première ; le focus du document reste sur le déclencheur
vole pas le focus au sens modal — le focus reste géré par `aria-activedescendant` sur le déclencheur.

## Clavier (motif « select-only combobox », ARIA APG)

RÈGLE [SELECT-R05] : déclencheur fermé — **↓ / ↑ / Entrée / Espace** ouvrent ; une **frappe de caractère** ouvre et
STATUT : propriété universelle
SOURCE : S1, S6, S8
ÉNONCÉ : Le select est intégralement opérable au clavier selon le motif combobox à sélection seule : fermé, les flèches, Entrée, Espace et toute frappe de caractère l'ouvrent, la frappe présélectionnant par correspondance ; ouvert, les flèches déplacent l'option active, Début et Fin vont aux extrêmes, Entrée et Espace sélectionnent et ferment, Échap ferme sans changer la valeur et Tab ferme en validant l'option active.
MESURE : chaque touche du motif combobox à sélection seule produit l'effet prescrit ; aucune fonction du select n'exige le pointeur
présélectionne par correspondance (type-ahead). Ouvert — **↑ ↓** déplacent l'option active, **Début / Fin**
vont aux extrêmes, **Entrée / Espace** sélectionnent et ferment, **Échap** ferme sans changer, **Tab**
ferme en validant l'option active.

## Rôle, nom, valeur

RÈGLE [SELECT-R06] : le déclencheur porte `role="combobox"`, `aria-expanded`, `aria-haspopup="listbox"` et son **nom
STATUT : propriété universelle
SOURCE : S1, S5, S7
ÉNONCÉ : Le déclencheur d'un select expose role=combobox, aria-expanded et une relation programmatique vers sa liste, et son nom accessible reprend le libellé visible ; la liste expose role=listbox, chaque option role=option avec son état de sélection, et la valeur choisie est restituée comme nom et valeur du combobox.
MESURE : le déclencheur porte role=combobox, aria-expanded et aria-controls vers la liste ; son nom accessible contient le libellé visible ; chaque option porte role=option et aria-selected
accessible reprend le libellé visible** ; la liste est un `listbox`, chaque option un `option` avec
`aria-selected`. La valeur choisie est annoncée par le nom/valeur du combobox (renvoi ACCESSIBILITY, INPUT).

## États

RÈGLE [SELECT-R07] : **désactivé** (non focalisable, contraste réduit assumé), **erreur** (bordure et message d'erreur
STATUT : propriété universelle
SOURCE : S1, S4, S8
ÉNONCÉ : Le select distingue visuellement trois choses différentes — l'option survolée, l'option active et l'option sélectionnée — et expose ses états : désactivé et alors non focalisable, vide et alors signalé par un placeholder neutre, en erreur et alors signalé sans que le select prenne en charge l'orchestration du message.
MESURE : survol, option active et option sélectionnée se distinguent chacun par au moins une propriété visuelle ; un select désactivé n'est pas atteignable au clavier
sont l'affaire de FORM/INPUT — le select expose l'état, l'orchestration appartient au formulaire), **vide**
(placeholder neutre). Le survol d'une option et l'option active sont **distincts** de l'option sélectionnée.

## Frontières

RÈGLE [SELECT-R08] : l'**ancrage, le light-dismiss, le z-index** de la liste relèvent d'`overlay` (non-modal) ; le
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Le select ne redéfinit pas ce qui appartient à ses voisins : l'ancrage, le light-dismiss et l'empilement de sa liste relèvent du superposé, le caractère requis et la validation du formulaire, le chevron de l'iconographie, la saisie libre du champ de texte, et le mot du libellé du langage.
**requis et la validation** relèvent de `form` ; le **chevron** relève d'`iconography` ; la **saisie libre**
relève d'`input` (un select n'est pas un champ de texte) ; le **mot** d'un libellé relève de `voice`.

## Sources et niveau de confiance (couche UX)
| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| S1 | Déclencheur combobox + listbox, clavier (↑↓ Début/Fin Entrée Échap, type-ahead) | [ARIA APG — Select-Only Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/) | Établi |
| S2 | Liste ancrée non-modale, light-dismiss | [Carbon — Dropdown / Popover](https://carbondesignsystem.com/components/dropdown/usage/) | Établi |
| S3 | Seuil select vs radios (peu d'options → radios visibles) | [NN/g — Listbox vs Radio](https://www.nngroup.com/articles/drop-down-menus/) | Convergent, pas une loi |
| S4 | Sémantique native du select : élément associé à un formulaire et soumis à la validation de contrainte — required impose une option de placeholder et fait échouer la validation tant qu'aucune option réelle n'est choisie ; disabled rend le contrôle non interactif et exclut sa valeur de la soumission ; la sélection d'une option désélectionne les autres en mono-sélection | [HTML Living Standard — the select element](https://html.spec.whatwg.org/multipage/form-elements.html#the-select-element) | Normatif — mesure ce qu'un menu personnalisé doit réimplémenter à la main (requis, validation, soumission), et fonde le défaut relevé en audit |
| S5 | Pour tout composant d'interface, y compris généré par script, le nom et le rôle sont programmatiquement déterminables, les états et valeurs modifiables par l'utilisateur sont programmatiquement définissables, et leurs changements sont notifiés aux technologies d'assistance | [WCAG 2.2 — 4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html) | Établi, standard (niveau A) — la note d'application précise qu'un contrôle personnalisé exige des mesures supplémentaires (ARIA) que le contrôle natif fournit d'office |
| S6 | Toute fonctionnalité est opérable au clavier sans exiger de rythme de frappe particulier ; le critère demande une parité fonctionnelle, pas une identité d'interaction | [WCAG 2.2 — 2.1.1 Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html) | Établi, standard (niveau A) |
| S7 | Des étiquettes ou des instructions sont fournies lorsque le contenu accepte une saisie de l'utilisateur ; « requires » y signifie « accepte », donc le critère couvre les champs facultatifs comme les champs obligatoires | [WCAG 2.2 — 3.3.2 Labels or Instructions](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html) | Établi, standard (niveau A) — nuance assumée : 3.3.2 n'impose pas par lui-même le marquage visible du caractère obligatoire, il l'encourage par technique suffisante |
| S8 | Motif listbox : rôles listbox et option, nom accessible obligatoire, aria-selected pour la sélection unique, aria-activedescendant comme alternative au focus DOM ; focus et sélection sont fonctionnellement distincts ; Début/Fin recommandés dès 5 options, saisie prédictive dès 7 | [ARIA APG — Listbox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/) | Établi — complète S1 sur la partie liste et fonde explicitement la distinction option active / option sélectionnée |
| S9 | Un popover de la plateforme est toujours non modal : il vit dans la couche supérieure, le reste de la page reste interactif, aucun focus n'est piégé, et l'état auto apporte le light-dismiss (Échap et clic extérieur) ; le modal relève de dialog, pas de popover | [MDN — Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API) | Normatif (plateforme) — remplace l'ancrage uniquement interne de la fondation overlay pour le caractère non modal et le light-dismiss |
| S10 | Le select sert à choisir dans une longue liste, mais avant d'y recourir il faut chercher à poser des questions qui réduisent le nombre d'options, et la recherche utilisateur montre des difficultés récurrentes (fermeture, saisie dans le contrôle, confusion focus/sélection, zoom sur mobile, défilement non perçu) ; select multiple est déconseillé | [GOV.UK Design System — Select](https://design-system.service.gov.uk/components/select/) | Établi par convergence — système public vérifié (1/3) |
| S11 | Le select n'est justifié que pour environ 7 à 15 options dans un espace contraint : en dessous de 7, radios ; au-delà de 15, combo box ; plusieurs experts en font « l'interface de dernier recours » ; l'auto-soumission au changement est à proscrire | [U.S. Web Design System — Select](https://designsystem.digital.gov/components/select/) | Établi par convergence — système public vérifié (2/3) ; le seuil chiffré (7) contredit le seuil interne (≈5) |
| S12 | Le select s'utilise pour une longue liste d'options ; il est déconseillé pour une liste courte (radios) ou pour une sélection multiple (cases à cocher), et il faut l'éviter quand on peut, la recherche montrant que certains utilisateurs le trouvent difficile | [Scottish Government Design System — Select](https://designsystem.gov.scot/components/select) | Établi par convergence — système public vérifié (3/3) ; aucun de ces trois systèmes ne traite la question natif contre personnalisé |
| S13 | Changer le réglage d'un composant ne provoque pas automatiquement de changement de contexte sans que l'utilisateur en ait été averti au préalable ; changer une valeur dans un menu déroulant est un changement de réglage, pas une activation | [WCAG 2.2 — 3.2.2 On Input](https://www.w3.org/WAI/WCAG22/Understanding/on-input.html) | Établi, standard (niveau A) — non mobilisé par une règle existante : le corpus ne dit rien de l'auto-soumission au changement de select (manque relevé) |

*Toute règle sans source explicite repose sur un raisonnement de mécanisme (cohérence interne, ergonomie).*
