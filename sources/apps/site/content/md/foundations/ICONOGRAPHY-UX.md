---
component: iconography
layer: ux
type: foundation
version: 1.0.0 # première rédaction — inventaire et benchmark faits avant livraison ; crée les tokens icon.* dans DESIGN.md 1.10.0 (les tailles d'icônes étaient la déduction silencieuse de 4 composants)
last_updated: 2026-07-11
companion: ICONOGRAPHY-UI.md
confidence: mixed # la redondance texte/icône et l'accessibilité sont établies (NN/g, WCAG, convergence) ; le choix outline/1.5px est une décision d'identité ; GOV.UK est cité comme contre-position documentée
---

# Iconographie — Couche UX (fondation)

> Ce fichier contient le raisonnement : quand une icône a le droit d'exister, ce qu'elle porte, ce qu'elle ne remplace jamais. Les valeurs (tailles `icon.*`, trait) vivent dans `DESIGN.md` ; la grammaire d'application vit dans `ICONOGRAPHY-UI.md`.

## Note de transposition (à lire en premier)

RÈGLE [ICONOGRAPHY-R01] : l'iconographie est une **fondation** — pas d'axes, pas d'assemblage : tous les composants consomment des icônes (tones de l'alert, chevron de la card, actions du bouton, services de l'input).
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : L'iconographie est une fondation transversale : elle n'expose ni axes ni règles d'assemblage, et tous les composants en consomment les crans, le style et les contraintes.

RÈGLE [ICONOGRAPHY-R02] : **ce système ne fournit pas de bibliothèque d'icônes.** Le dessin précis des glyphes est une décision d'identité visuelle — précédent posé par `icon_shape` de l'alert : la *silhouette* est normative (cercle/triangle/octogone), le *dessin* est libre. Cette fondation régit tout ce qui ne dépend pas du dessin : rôles, tailles, style, redondance, accessibilité, stabilité du sens. La grille de construction interne (keylines, zone de sécurité) appartient à la bibliothèque choisie.
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : La fondation normalise les rôles, tailles, style, redondance, accessibilité et stabilité du sens des icônes, mais ne fournit pas de bibliothèque : le dessin des glyphes reste hors périmètre.

RÈGLE [ICONOGRAPHY-R03] : la fondation sépare deux fonctions :
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : La fondation traite séparément le sens de l'icône, décision de contenu, et sa forme, décision de design ; aucune des deux ne se déduit de l'autre.
  1. **Le sens** — ce que l'icône dit, et si elle a le droit de le dire seule. Une décision de *contenu*.
  2. **La forme** — taille, trait, alignement, couleur. Une décision de *design*.

> **Pourquoi** : c'est la structure de la typographie (sens vs lisibilité) transposée — et le même garde-fou : aucune des deux fonctions ne se déduit de l'autre.

## Une icône ne parle presque jamais seule

RÈGLE [ICONOGRAPHY-R04] : **le texte d'abord** : "utiliser des labels pour soutenir les icônes partout où c'est possible, et éviter les icônes là où elles ne sont pas nécessaires" (Atlassian — repris tel quel). Une icône est un *accélérateur de reconnaissance*, pas un remplacement du langage.
STATUT : propriété universelle
SOURCE : S1, S2, S3
ÉNONCÉ : Toute icône est accompagnée d'un libellé textuel partout où c'est possible, et aucune icône n'est ajoutée là où elle n'est pas nécessaire.

RÈGLE [ICONOGRAPHY-R05] : le droit de paraître seule est **une liste fermée, pas un jugement au cas par cas** : les métaphores quasi universelles (recherche/loupe, fermeture/croix, accueil/maison, impression — NN/g n'en reconnaît que trois ou quatre) plus les actions apprises *dans ce produit* et confirmées par l'usage. Tout le reste : label visible.
STATUT : parti pris d'identité
SOURCE : S1, S3
ÉNONCÉ : Le droit d'une icône à paraître sans libellé visible est défini par une liste fermée et déclarée, non par un jugement au cas par cas.
MESURE : toute icône sans libellé visible appartient à la liste fermée déclarée

RÈGLE [ICONOGRAPHY-R06] : icône seule → **aria-label obligatoire sans exception** (règle déjà posée par BUTTON-UI, généralisée) — et le tooltip au survol ne compte pas comme label : invisible au tactile, coûteux à découvrir (NN/g).
STATUT : propriété universelle
SOURCE : S12, S14, S16, S17, S1
ÉNONCÉ : Tout contrôle réduit à une icône porte un nom accessible non vide décrivant sa fonction ; une info-bulle au survol ne tient jamais lieu de nom accessible.
MESURE : tout contrôle sans texte visible expose un nom accessible non vide

RÈGLE [ICONOGRAPHY-R07] : la règle des 5 secondes (NN/g) comme test de conception : si trouver l'icône d'une action prend plus de 5 secondes, cette action n'a pas d'icône — elle a un mot.
STATUT : parti pris d'identité
SOURCE : S1
ÉNONCÉ : Une action dont l'icône ne se laisse ni concevoir ni trouver en moins de cinq secondes se désigne par un mot et non par un glyphe.

> **Contre-position documentée** : GOV.UK a *retiré* ses icônes (2013) faute de preuve d'utilité ("les utilisateurs cliquaient sur les icônes en pensant qu'elles feraient quelque chose") — rappel salutaire : l'icône par défaut n'est pas un embellissement neutre, c'est une promesse d'interaction.

## Un sens = une icône, une icône = un sens

RÈGLE [ICONOGRAPHY-R08] : le registre iconographique du produit est **stable** : une fois un glyphe associé à un sens, il ne sert plus à rien d'autre — et le même sens ne change pas de glyphe selon l'écran (précédent : une icône par tone, constante dans tout le produit, ALERT-UX).
STATUT : propriété universelle
SOURCE : S2, S3
ÉNONCÉ : Un glyphe ne désigne qu'un seul sens dans tout le produit, et un sens donné est toujours porté par le même glyphe.
MESURE : aucun glyphe associé à plus d'un sens et aucun sens porté par plus d'un glyphe

RÈGLE [ICONOGRAPHY-R09] : ne jamais détourner un symbole à sens établi ailleurs (l'étoile note, elle ne "favorise" pas si le produit note aussi ; la corbeille supprime, elle n'archive pas).
STATUT : parti pris d'identité
SOURCE : S1
ÉNONCÉ : Aucun symbole dont le sens est déjà établi ailleurs n'est réaffecté à un autre sens.

RÈGLE [ICONOGRAPHY-R10] : l'icône sémantique est un **canal redondant, pas décoratif** (WCAG 1.4.1) : les icônes de tone de l'alert ne se retirent pas pour alléger, et leurs silhouettes distinctes font le travail que la couleur ne garantit pas (deutéranopie — décision F03).
STATUT : propriété universelle
SOURCE : S13
ÉNONCÉ : Une icône porteuse de sens est un canal redondant d'une information déjà exprimée autrement : elle ne se retire pas pour alléger, et sa silhouette distingue le sens sans recours à la couleur.
MESURE : chaque état sémantique reste distinguable sans la couleur

## Style — un seul trait pour tout le produit

RÈGLE [ICONOGRAPHY-R11] : **outline par défaut**, trait constant (`icon.stroke`) sur toute la bibliothèque — le style du trait est le "fallback stack" de l'iconographie : une seule décision, prise une fois, visible partout. Le **filled est réservé aux états actifs/sélectionnés** si le besoin naît (convention Material Symbols et Polaris : fill = transition d'état, pas un second style décoratif).
STATUT : parti pris d'identité
SOURCE : S10
ÉNONCÉ : La bibliothèque adopte un style de contour unique à trait constant, et réserve la variante pleine à la signalisation d'un état actif.
MESURE : toutes les icônes partagent la même valeur de trait

RÈGLE [ICONOGRAPHY-R12] : contrainte de lisibilité : le trait doit tenir au plus petit cran (`icon.sm`) — une icône dont les détails se bouchent en petit est une icône trop détaillée, pas un cran trop petit.
STATUT : parti pris d'identité
SOURCE : S2
ÉNONCÉ : Une icône doit rester lisible au plus petit cran ; un glyphe dont les détails se bouchent est simplifié ou retiré, le cran n'est pas augmenté pour lui.

RÈGLE [ICONOGRAPHY-R13] : pas de 3D, pas de perspective, pas de détail intérieur superflu (Atlassian — difficile à décoder, notamment pour les troubles cognitifs).
STATUT : parti pris d'identité
SOURCE : S11
ÉNONCÉ : Les icônes s'en tiennent à des formes simples et frontales, sans perspective, sans volume et sans détail intérieur superflu.

## La forme — taille, alignement, couleur

RÈGLE [ICONOGRAPHY-R14] : les tailles sont **des crans fermés** (`icon.sm/md/lg`, créés par cette fondation — elles étaient la déduction silencieuse de quatre composants), appariés aux corps de texte et aux hauteurs de composants, jamais des valeurs libres. **Ne jamais redimensionner une icône hors crans** (Polaris : cela détruit la relation établie avec la typographie).
STATUT : propriété universelle
SOURCE : S8, S9
ÉNONCÉ : Les tailles d'icône proviennent d'un jeu fermé de crans appariés aux corps de texte ; une icône ne se redimensionne jamais hors de ces crans, elle change de cran.
MESURE : toute icône rendue utilise une valeur du jeu de crans ; aucune taille libre

RÈGLE [ICONOGRAPHY-R15] : à côté d'un texte, l'icône est **centrée verticalement** sur la ligne — pas alignée sur la baseline (Carbon, explicite). Sa couleur est **celle du texte qu'elle accompagne** — jamais de couleur propre hors tone sémantique.
STATUT : propriété universelle
SOURCE : S9, S5
ÉNONCÉ : À côté d'un texte, l'icône est centrée verticalement sur la ligne plutôt qu'alignée sur la ligne de base, et prend la couleur du texte qu'elle accompagne.
MESURE : aucune icône adjacente à du texte n'est alignée sur la ligne de base ; couleur héritée hors tone sémantique

RÈGLE [ICONOGRAPHY-R16] : l'icône informative respecte **3:1** (WCAG 1.4.11) comme tout signal visible ; l'icône décorative est exemptée — et cachée (`aria-hidden`).
STATUT : propriété universelle
SOURCE : S6, S12, S15
ÉNONCÉ : Une icône porteuse d'information respecte un contraste d'au moins 3:1 avec les couleurs adjacentes ; une icône décorative en est exemptée et est retirée de l'arbre d'accessibilité.
MESURE : contraste ≥ 3:1 pour toute icône informative ; toute icône décorative porte aria-hidden et n'est pas focalisable

RÈGLE [ICONOGRAPHY-R17] : **cible tactile ≠ taille d'icône** : le glyphe reste petit, la cible s'étend par le padding — 44px partout (standard du système), ce qui couvre largement le minimum WCAG 2.5.8 (24px, AA).
STATUT : propriété universelle
SOURCE : S7
ÉNONCÉ : La cible tactile d'une icône interactive s'obtient par extension du padding et jamais par agrandissement du glyphe.
MESURE : toute icône interactive a une cible ≥ 44 × 44 px, obtenue sans agrandir le glyphe

## L'icône dans le temps

RÈGLE [ICONOGRAPHY-R18] : écrit d'office (prédicteur "état transitoire") : le **spinner** est une icône animée — sa taille et sa place relèvent de cette fondation (il occupe le cran de l'icône qu'il remplace : le label du bouton loading devient indicateur sans changer la géométrie), sa rotation appartient à la fondation motion (linéaire, la seule rotation continue admise).
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Le spinner est traité comme une icône animée : il occupe le cran de l'icône qu'il remplace sans modifier la géométrie du composant.

RÈGLE [ICONOGRAPHY-R19] : une icône qui change avec l'état est **le même glyphe transformé** (chevron tourné, œil barré) plutôt que deux glyphes — et l'état est toujours exposé techniquement (aria-expanded, aria-pressed) : le dessin confirme, il n'est jamais la source.
STATUT : parti pris d'identité
SOURCE : S14, S18
ÉNONCÉ : Une icône qui varie avec l'état est le même glyphe transformé plutôt qu'un second glyphe, et l'état reste exposé programmatiquement.
MESURE : tout contrôle dont l'icône varie selon l'état expose cet état par un attribut ARIA

RÈGLE [ICONOGRAPHY-R20] : **SVG inline, pas d'icon font** : une icon font qui échoue au chargement laisse un caractère fantôme ou un carré, se fait lire par certains lecteurs d'écran, et casse à la traduction automatique. Le SVG inline hérite de la couleur du texte (`currentColor`) et n'a pas d'état de chargement — c'est le pendant iconographique des piles de secours typographiques.
STATUT : implémentation de référence
SOURCE : S5, S19
ÉNONCÉ : Les icônes sont rendues en SVG inline héritant de la couleur du texte, et non par une police d'icônes.
MESURE : aucune icône rendue via une police d'icônes ou un caractère de pseudo-élément

## Risque

RÈGLE [ICONOGRAPHY-R21] : table ci-dessous
STATUT : note de méthode
SOURCE : interne
ÉNONCÉ : Les défaillances iconographiques connues sont consignées dans une table de risque associant chaque cas à son risque principal et à sa sévérité.

| Cas | Risque principal | Sévérité |
|---|---|---|
| Icône seule sans aria-label | Action invisible au lecteur d'écran | Critique |
| Sens porté par l'icône sans redondance (tone sans forme distincte) | Exclusion daltonisme (1.4.1) — cas F03 payé | Élevée |
| Métaphore ambiguë sans label visible | Action non trouvée, erreurs d'usage (NN/g) | Élevée |
| Icône hover-only | Inaccessible au tactile (précédent BUTTON-UX/CARD-UX) | Élevée |
| Icon font | Échec de chargement illisible, AT perturbée | Moyenne à élevée |
| Registre instable (même sens, glyphes différents) | Apprentissage détruit | Moyenne |
| Cible réduite au glyphe | Zone tactile < 44px | Moyenne à élevée |
| Icône redimensionnée hors crans | Relation typo/icône cassée, trait bouché | Moyenne |
| Icônes décoratives multipliées | Bruit, promesses d'interaction mensongères (leçon GOV.UK) | Moyenne |

## Règle transversale

RÈGLE [ICONOGRAPHY-R22] : **l'icône accélère la reconnaissance d'un sens que le produit sait déjà dire autrement — elle n'est jamais le seul dépositaire du sens.**
STATUT : propriété universelle
SOURCE : S12, S13
ÉNONCÉ : Une icône n'est jamais le seul dépositaire d'un sens : toute information qu'elle porte reste disponible par le texte, le rôle ou la structure.
MESURE : aucune information ni action disponible uniquement par le dessin d'une icône

> **Pourquoi** : c'est 1.4.1 (jamais la couleur seule) élargi : jamais *le dessin* seul. Le texte, le rôle ARIA, la forme, la couleur — l'icône est un canal parmi d'autres, le plus rapide et le moins fiable.

## Sources et niveau de confiance

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| S1 | Label visible requis, tooltips insuffisants, ~3 icônes universelles, règle des 5s | [NN/g — Icon Usability](https://www.nngroup.com/articles/icon-usability/), [NN/g — Bad Icons](https://www.nngroup.com/articles/bad-icons/) | Établi — littérature de référence |
| S2 | "Labels partout où c'est possible, pas d'icône non nécessaire" | [Atlassian — Iconography](https://atlassian.design/foundations/iconography) | Établi, citation directe |
| S3 | Actions universelles tolérées seules (edit, delete, search) | [Polaris — Using icons](https://polaris-react.shopify.com/design/icons/using-icons) | Établi chez Polaris — croisé avec la liste plus stricte de NN/g |
| S4 | Retrait des icônes faute de preuve | [GDS blog 2013](https://gds.blog.gov.uk/2013/06/18/retiring-our-icons/), [Design notes 2016](https://designnotes.blog.gov.uk/2016/11/28/removing-the-external-link-icon-from-gov-uk/) | Établi chez GOV.UK — contre-position documentée |
| S5 | aria-hidden par défaut / label si porteuse de sens | [Carbon — Icons code](https://carbondesignsystem.com/elements/icons/code/), [Polaris — Icon](https://polaris-react.shopify.com/components/images-and-icons/icon) | Établi par convergence |
| S6 | 3:1 pour les graphiques porteurs de sens | [WCAG 1.4.11](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html), [technique G207](https://www.w3.org/WAI/WCAG21/Techniques/general/G207) ; Carbon monte à 4.5:1 | Établi (3:1) ; le 4.5:1 de Carbon noté, non adopté |
| S7 | Cible ≥ 24px (AA) / 44px (AAA, HIG) | [WCAG 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), [WCAG 2.5.5] ; Carbon 44px | Établi — le 44px interne couvre les deux |
| S8 | Tailles appariées aux corps de texte (16/20 ↔ 14/16px) | [Carbon — Icons usage](https://carbondesignsystem.com/elements/icons/usage/) | Établi chez Carbon — adopté (icon.md ↔ body 16px) |
| S9 | Centrage vertical, pas baseline ; jamais redimensionner | [Carbon — Icons usage](https://carbondesignsystem.com/elements/icons/usage/), [Polaris — Using icons](https://polaris-react.shopify.com/design/icons/using-icons) | Établi par convergence |
| S10 | Outline défaut / filled = état ; trait constant (1.5px Atlassian/Polaris, 2dp Material) | [Polaris — Creating icons](https://polaris-react.shopify.com/design/icons/creating-icons), [Material Symbols](https://developers.google.com/fonts/docs/material_symbols), [Atlassian](https://atlassian.design/foundations/iconography) | Établi (outline/filled) ; la valeur du trait est un choix d'identité |
| S11 | Pas de 3D/perspective | [Atlassian — Iconography](https://atlassian.design/foundations/iconography) | Établi chez Atlassian |
| S12 | Tout contenu non textuel a une alternative textuelle équivalente ; si c'est un contrôle, il porte un nom décrivant sa fonction ; s'il est décoratif, il est implémenté de façon à pouvoir être ignoré par les technologies d'assistance | [WCAG 2.2 — 1.1.1 Non-text Content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html) | Établi, standard (A) |
| S13 | La couleur n'est jamais le seul moyen visuel de transmettre une information — fondement de la redondance icône / forme / texte | [WCAG 2.2 — 1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) | Établi, standard (A) |
| S14 | Pour tout composant d'interface, le nom et le rôle sont déterminables programmatiquement, et les états modifiables sont exposés aux technologies d'assistance | [WCAG 2.2 — 4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html) | Établi, standard (A) |
| S15 | aria-hidden est le mécanisme prévu pour retirer de l'arbre d'accessibilité une icône décorative ou redondante, et ne doit jamais être posé sur un élément focalisable ni sur son ancêtre | [MDN — aria-hidden](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-hidden) | Établi — documentation de référence |
| S16 | Le contenu déclenché au survol ou au focus doit être écartable, survolable et persistant ; les info-bulles natives du navigateur sont hors périmètre — **une info-bulle n'est donc pas un substitut de nom accessible** | [WCAG 2.2 — 1.4.13 Content on Hover or Focus](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html) | Établi, standard (AA) |
| S17 | Le rôle image fait traiter un SVG inline comme une image unique plutôt que comme un arbre de nœuds lus un à un, et exige un nom accessible | [MDN — rôle img](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/img_role) | Établi — documentation de référence |
| S18 | aria-expanded expose l'état déployé ou replié d'un contrôle, indépendamment de toute indication visuelle telle qu'une rotation de chevron | [MDN — aria-expanded](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-expanded) | Établi — documentation de référence |
| S19 | Défauts documentés des polices d'icônes : caractère lu littéralement sans ARIA, disparition sous feuille de style utilisateur — **mais l'auteur conserve néanmoins ses polices d'icônes, faute de meilleur compromis** | [24 Accessibility — SVG, Icon Fonts, and Accessibility](https://www.24a11y.com/2017/svg-icon-fonts-accessibility-case-study/) | Cas d'étude documenté — soutient les risques, **ne soutient pas l'interdiction** : contre-position à noter |

## À approfondir

- **RTL** : icônes directionnelles en miroir (chevrons, flèches) — 3e signalement RTL du système, toujours sans consommateur.
- **Bibliothèque d'icônes** : le jour du choix (identité), vérifier : outline, trait tenant `icon.sm`, silhouettes des tones compatibles avec `icon_shape` de l'alert.
- **Filled comme état** : à activer au premier consommateur (navigation ? favori ?) — la convention est prête.
