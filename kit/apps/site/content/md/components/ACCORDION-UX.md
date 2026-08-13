---
component: accordion
layer: ux
type: component
version: 1.0.0 # 1.0.0 : première rédaction — besoin réel : regrouper les liens de la nav latérale du shell (2026-07-24) ; disclosure réutilisable au-delà de la nav (FAQ, réglages). Périmètre arbitré : multi-ouvert autorisé (single-open = option, pas la règle). Motif clavier : ARIA APG « accordion/disclosure ». Cf. DECISIONS.md 2026-07-24.
last_updated: 2026-07-24
companion: ACCORDION-UI.md
confidence: mixed # le motif disclosure (en-tête bouton + région, aria-expanded) est établi (ARIA APG) ; le défaut multi-ouvert est un arbitrage interne (convergent).
---

# Accordion — Couche UX (composant)

> Un **disclosure** : un en-tête révèle ou masque une région de contenu. Un **accordion** est un ensemble
> de disclosures empilés. Réutilisable — la nav latérale du shell n'est qu'un usage parmi d'autres.

## Nature et périmètre

RÈGLE [ACCORDION-R01] : chaque section a un **en-tête cliquable** (un `button`) qui **révèle/masque** sa région. Le contenu
STATUT : propriété universelle
SOURCE : S1
ÉNONCÉ : Chaque section d'un accordéon est révélée ou masquée par un en-tête qui est un bouton ; le contenu replié n'est pas détruit et sa réouverture restitue l'état précédent.
MESURE : l'en-tête de section est un élément bouton ; le contenu replié reste dans le document et retrouve son état à la réouverture
masqué n'est **pas détruit** — le rouvrir retrouve l'état ; rien n'est perdu à la fermeture.

RÈGLE [ACCORDION-R02] : **plusieurs sections peuvent être ouvertes à la fois** (multi-ouvert par défaut). Le **single-open**
STATUT : parti pris d'identité
SOURCE : S1, S2, S4
ÉNONCÉ : Plusieurs sections d'un accordéon peuvent être ouvertes simultanément ; la fermeture automatique des autres sections à l'ouverture d'une section est une option demandée explicitement, jamais le comportement par défaut.
MESURE : par défaut, ouvrir une section ne referme aucune autre section
(ouvrir une section referme les autres) est une **option**, pas la règle — l'imposer cache du contenu et
surprend dans une navigation.

## Clavier et rôle (ARIA APG)

RÈGLE [ACCORDION-R03] : l'en-tête est un `button` avec `aria-expanded` (true/false) et `aria-controls` vers sa région ; la
STATUT : propriété universelle
SOURCE : S1
ÉNONCÉ : L'en-tête d'une section est un bouton portant aria-expanded et aria-controls vers sa région, laquelle est nommée par cet en-tête ; lorsque les en-têtes structurent la page, le bouton est l'unique enfant d'un élément de titre de niveau cohérent, et Entrée comme Espace basculent l'état.
MESURE : chaque en-tête porte un bouton avec aria-expanded et aria-controls ; le bouton est l'unique enfant de l'élément de titre ; Entrée et Espace basculent la section
région porte `aria-labelledby` renvoyant à l'en-tête. **Entrée / Espace** basculent. Quand les en-têtes
structurent la page, chaque en-tête est **enveloppé dans un titre** (`h2`-`h6`) de niveau cohérent.

RÈGLE [ACCORDION-R04] : l'ouverture d'une section **ne vole pas le focus** et ne déplace pas la page sous le pointeur ; le
STATUT : propriété universelle
SOURCE : S1, S5, S7
ÉNONCÉ : L'ouverture ou la fermeture d'une section ne déplace ni le focus ni le contenu déjà sous le pointeur : le focus reste sur l'en-tête activé, la tabulation entre et sort librement, et aucun piège de focus n'est posé.
MESURE : après activation, le focus reste sur l'en-tête ; Tab et Maj+Tab traversent l'accordéon sans être retenus
focus reste sur l'en-tête activé. Aucun **piège de focus** — Tab entre et sort librement (ce n'est pas un modal).

## Signal d'état — jamais la seule couleur

RÈGLE [ACCORDION-R05] : l'état ouvert/fermé se lit à un **indicateur non chromatique** (chevron qui pivote, +/−), pas à la
STATUT : propriété universelle
SOURCE : S3, S8
ÉNONCÉ : L'état ouvert ou fermé d'une section se lit à un indicateur non chromatique — chevron orienté, signe plus ou moins — et jamais à la seule couleur.
MESURE : l'état ouvert se distingue de l'état fermé par au moins un signal non chromatique
seule couleur (renvoi ACCESSIBILITY, ICONOGRAPHY). Le chevron **tourne** pour marquer l'ouverture.

## Mouvement

RÈGLE [ACCORDION-R06] : le dépliage/repliage anime la **hauteur** en `motion.base` / `motion.ease-in-out` (mouvement sur
STATUT : propriété universelle
SOURCE : S6
ÉNONCÉ : Le dépliage et le repliage d'une section sont un mouvement sur place emprunté aux tokens de mouvement, et deviennent une bascule instantanée lorsque l'utilisateur a demandé moins de mouvement, sans jamais escamoter de contenu.
MESURE : sous prefers-reduced-motion: reduce, la bascule est instantanée ; aucune durée ni courbe en dur
place) et **respecte `prefers-reduced-motion`** — bascule instantanée si réduit, jamais de perte de contenu.

## Frontières

RÈGLE [ACCORDION-R07] : le **chevron** relève d'`iconography` ; les **durées/courbes** de `motion` ; un **lien** dans une
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : L'accordéon ne redéfinit pas ce qui appartient à ses voisins : le chevron relève de l'iconographie, les durées et courbes du mouvement, un lien de sa région du composant lien, l'anneau de focus de la bordure, le mot de l'en-tête du langage ; un révélateur modal, qui recouvre et piège le focus, n'est pas un accordéon mais un superposé.
région relève de `link` ; l'**anneau de focus** de `border` ; le **mot** d'un en-tête de `voice`. Un
disclosure **modal** (qui recouvre et piège) n'est pas un accordion : c'est un superposé (`overlay`).

## Sources et niveau de confiance (couche UX)
| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| S1 | En-tête `button` + `aria-expanded` + région `aria-labelledby` ; Entrée/Espace basculent | [ARIA APG — Accordion](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/), [Disclosure](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/) | Établi |
| S2 | Multi-ouvert par défaut, single-open optionnel | Convergence des systèmes (Carbon, GOV.UK details) | Convergent |
| S3 | État par indicateur non chromatique (chevron), pas la couleur | WCAG 1.4.1 (renvoi ACCESSIBILITY) | Établi |
| S4 | Un accordéon peut afficher plusieurs sections ouvertes à la fois, à la différence des onglets, et propose un « Show all sections » ; il ne doit pas servir à du contenu que tous les utilisateurs doivent voir, car il masque du contenu que tous ne remarquent pas | [GOV.UK Design System — Accordion](https://design-system.service.gov.uk/components/accordion/) | Établi par convergence — système public vérifié ; confirme le multi-ouvert comme comportement admis, pas comme prescription |
| S5 | Changer le réglage d'un composant ne provoque pas automatiquement de changement de contexte non annoncé ; un déplacement de focus ou un réagencement significatif de la page en sont | [WCAG 2.2 — 3.2.2 On Input](https://www.w3.org/WAI/WCAG22/Understanding/on-input.html) | Établi, standard (niveau A) — fonde l'interdit de vol de focus à l'ouverture d'une section |
| S6 | L'animation de mouvement déclenchée par une interaction peut être désactivée sauf si elle est essentielle ; la valeur reduce de prefers-reduced-motion demande de supprimer ou remplacer le mouvement non essentiel | [WCAG 2.2 — 2.3.3 Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) ; [MDN — prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) | Établi — 2.3.3 est de niveau AAA et admet plusieurs techniques suffisantes ; la média-requête n'est que l'une d'elles |
| S7 | Toute fonctionnalité est opérable au clavier sans exiger de rythme de frappe particulier | [WCAG 2.2 — 2.1.1 Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html) | Établi, standard (niveau A) |
| S8 | La couleur n'est jamais le seul moyen visuel de véhiculer une information, d'indiquer une action, d'appeler une réponse ou de distinguer un élément visuel | [WCAG 2.2 — 1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) | Établi, standard (niveau A) — donne son URL à S3, cité sans lien dans le fichier |

*Toute règle sans source explicite repose sur un raisonnement de mécanisme (cohérence interne, ergonomie).*
