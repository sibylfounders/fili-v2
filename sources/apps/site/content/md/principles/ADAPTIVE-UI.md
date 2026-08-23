---
component: adaptive
layer: ui
type: principle
version: 1.1.0 # 1.1.0 : Adaptive devient un principe de premier niveau ; aucune convention Container Query modifiée. 1.0.0 : première rédaction — conventions Container Queries, frontière avec Media Queries et stratégie de repli
last_updated: 2026-07-20
companion: ADAPTIVE-UX.md
confidence: established
---

# Principe adaptatif — Couche UI (implémentation)

> Les Container Queries sont l'outil actuel de la règle portée par `ADAPTIVE-UX.md`. Ce principe
> n'ajoute aucun breakpoint global : les seuils sont dérivés du contenu de chaque composant.

## Règle de choix

| Cause de l'adaptation | Outil |
|---|---|
| largeur disponible d'un composant réutilisable | Size Container Query |
| structure globale de la page / fenêtre | Media Query ou layout fluide |
| préférence ou capacité (`prefers-reduced-motion`, `forced-colors`, `hover`) | Media Query |
| disposition qui peut se résoudre naturellement | Grid/Flex, `minmax()`, `wrap`, tailles intrinsèques |

RÈGLE [ADAPTIVE-U01] : ne pas remplacer un layout intrinsèque qui fonctionne par des seuils. La Container Query
STATUT : implémentation de référence
SOURCE : interne
ÉNONCÉ : Une requête de conteneur n'intervient que lorsque le composant doit réellement changer d'état ; un layout intrinsèque qui résout déjà la disposition — grille, retour à la ligne, tailles intrinsèques — n'est pas remplacé par des seuils.
intervient quand le composant doit réellement changer d'état, pas seulement laisser ses éléments
revenir à la ligne.

## Déclaration

Le parent qui définit l'espace disponible devient conteneur de requête :

```css
.card-region {
  container-type: inline-size;
  container-name: card-region;
}

@container card-region (min-width: 30rem) {
  .card {
    grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
  }
}
```

RÈGLE [ADAPTIVE-U02] : préférer `inline-size` à `size` quand seule la largeur logique pilote le composant. Cela évite
STATUT : implémentation de référence
SOURCE : T4
ÉNONCÉ : Le type de conteneur est inline-size lorsque seule la largeur logique pilote le composant ; size, qui applique la containment de taille sur les deux axes et fait s'effondrer l'élément sans taille de bloc contextuelle ou explicite, n'est employé que si une condition sur l'axe de bloc est réellement interrogée.
MESURE : container-type: size n'apparaît qu'accompagné d'une taille de bloc contextuelle ou explicite
d'isoler inutilement la dimension de bloc.

RÈGLE [ADAPTIVE-U03] : nommer le conteneur dès qu'un composant peut être imbriqué dans plusieurs conteneurs de
STATUT : implémentation de référence
SOURCE : T2, T5
ÉNONCÉ : Le conteneur de requête est nommé dès qu'un composant peut être imbriqué dans plusieurs conteneurs de requête, le nom exprimant le contrat et écartant la résolution implicite contre l'ancêtre qualifié le plus proche.
MESURE : toute règle @container visant un composant imbriquable porte un container-name
requête. Le nom exprime le contrat et évite une dépendance accidentelle au mauvais ancêtre.

RÈGLE [ADAPTIVE-U04] : utiliser les unités logiques et relatives (`rem`, `cqi`, pourcentages) ; le seuil exact se
STATUT : implémentation de référence
SOURCE : T5, interne
ÉNONCÉ : Les seuils s'expriment en unités logiques et relatives — rem, unités de conteneur, pourcentages — et sont déclarés dans le fichier du composant propriétaire, accompagnés de la raison qui les a fait émerger.
MESURE : aucun seuil de requête de conteneur exprimé en pixels absolus ; chaque seuil est commenté dans le fichier de son composant
place dans le fichier du composant propriétaire, accompagné de la raison qui l'a fait émerger.

## États

RÈGLE [ADAPTIVE-U05] : le CSS de base rend l'état compact viable. Les requêtes successives enrichissent vers
STATUT : parti pris d'identité
SOURCE : T3
ÉNONCÉ : Le CSS de base rend l'état compact viable et les requêtes successives enrichissent vers regular puis expanded, ces états n'étant déclarés que s'ils existent réellement.
`regular`, puis `expanded` uniquement si ces états existent réellement.

RÈGLE [ADAPTIVE-U06] : limiter le nombre de seuils au nombre de changements structurels observables. Un seuil sans
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Le nombre de seuils d'un composant est égal au nombre de changements structurels observables ; un seuil sans changement sémantique ou spatial net est supprimé.
MESURE : chaque seuil déclaré correspond à un changement de structure observable
changement sémantique ou spatial net est supprimé.

RÈGLE [ADAPTIVE-U07] : les noms d'état ne deviennent pas nécessairement des props React. Si l'état dépend uniquement
STATUT : implémentation de référence
SOURCE : interne
ÉNONCÉ : Un état qui ne dépend que de la place disponible est calculé par CSS et n'est pas exposé en propriété de composant : l'API n'oblige pas le consommateur à synchroniser JavaScript et disposition.
MESURE : aucune propriété de composant ne duplique un état déjà déterminé par une requête de conteneur
de la place, CSS le calcule ; l'API n'oblige pas le consommateur à synchroniser JavaScript et layout.

## Divulgation et accessibilité

RÈGLE [ADAPTIVE-U08] : `display: none` n'est appliqué qu'à du contenu secondaire dont l'absence a été autorisée dans
STATUT : propriété universelle
SOURCE : T8, T7
ÉNONCÉ : Le masquage complet ne s'applique qu'à du contenu secondaire dont l'absence a été autorisée par la couche UX ; une action essentielle reste atteignable dans tous les états, au besoin regroupée dans un menu accessible.
MESURE : aucune fonctionnalité indisponible dans l'état le plus étroit
la couche UX. Une action essentielle reste accessible, éventuellement regroupée dans un menu.

RÈGLE [ADAPTIVE-U09] : le DOM conserve un ordre de lecture logique dans tous les états. CSS Grid peut déplacer
STATUT : propriété universelle
SOURCE : T6
ÉNONCÉ : L'ordre du DOM porte un ordre de lecture correct dans tous les états : la mise en page peut déplacer visuellement des éléments sans réordonner le sens, et un déplacement qui change le sens impose de repenser la structure.
MESURE : l'ordre de lecture programmatiquement déterminé est identique dans tous les états du composant
visuellement sans réordonner le sens ; si le sens change, la structure doit être repensée.

RÈGLE [ADAPTIVE-U10] : une version icône seule garde son nom accessible. Le label peut être visuellement masqué avec
STATUT : propriété universelle
SOURCE : T7
ÉNONCÉ : Une variante en icône seule conserve son nom accessible : le libellé est masqué visuellement par la technique commune du système, jamais retiré du nom accessible.
MESURE : le nom accessible d'un contrôle est identique avec et sans libellé visible
la technique commune du système, pas supprimé du nom accessible.

## Media Queries qui restent légitimes

```css
@media (prefers-reduced-motion: reduce) {
  .adaptive-component {
    transition-duration: 0s;
  }
}

@media (forced-colors: active) {
  .adaptive-component {
    border-color: CanvasText;
  }
}
```

Ces requêtes décrivent une préférence ou un mode de rendu global. Elles ne concurrencent pas les
Container Queries de taille.

## Test d'implémentation

- fixer le viewport, redimensionner uniquement le conteneur ;
- tester chaque état avec les textes les plus longs ;
- vérifier juste sous, sur et juste au-dessus de chaque seuil ;
- vérifier le focus avant et après une bascule ;
- inspecter les conteneurs imbriqués et le `container-name` résolu ;
- vérifier que l'état compact reste utilisable si les règles `@container` sont absentes.

## Sources et niveau de confiance

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| T1 | `container-type: inline-size` établit un conteneur pour les requêtes sur l'axe inline | [MDN — CSS container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries) | Établi |
| T2 | Les conteneurs peuvent être nommés et ciblés par `@container` | [CSS Containment Module Level 3](https://www.w3.org/TR/css-contain-3/) | Normatif |
| T3 | Base compacte + enrichissement progressif | Décision interne de robustesse, cohérente avec progressive enhancement | Établi comme stratégie interne |
| T4 | container-type: inline-size applique la containment de style et de taille sur le seul axe inline ; container-type: size l'applique sur les deux axes et, faute de taille de bloc contextuelle ou explicite, l'élément s'effondre | [MDN — container-type](https://developer.mozilla.org/en-US/docs/Web/CSS/container-type) | Établi — Baseline largement disponible depuis février 2023. **Raison plus forte que celle du fichier**, qui invoque seulement « éviter d'isoler inutilement la dimension de bloc » là où le risque réel est l'effondrement de l'élément |
| T5 | Sans container-name, la requête se résout contre l'ancêtre le plus proche ayant un contexte de containment ; les unités cqi, cqb, cqw, cqh, cqmin et cqmax valent 1 % de la dimension correspondante du conteneur de requête et retombent sur les unités de petit viewport en l'absence de conteneur éligible | [MDN — CSS container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries) | Établi — fonde la règle de nommage et l'emploi de cqi comme unité de seuil |
| T6 | Un ordre de lecture correct doit être programmatiquement déterminable lorsque l'ordre affecte le sens ; positionner par CSS au point de changer le sens est un échec documenté | [WCAG 2.2 — 1.3.2 Meaningful Sequence](https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html) | Établi, standard (niveau A) |
| T7 | Le nom et le rôle de tout composant d'interface sont programmatiquement déterminables | [WCAG 2.2 — 4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html) | Établi, standard (niveau A) — fonde le maintien du nom accessible en variante icône seule |
| T8 | Aucune perte d'information ni de fonctionnalité et aucun défilement en deux dimensions à une largeur équivalente à 320 px CSS | [WCAG 2.2 — 1.4.10 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) | Établi, standard (AA) — borne l'usage de display: none dans l'état compact |
| T9 | prefers-reduced-motion et forced-colors sont des requêtes média de préférence utilisateur pleinement disponibles, forced-colors exposant les mots-clés de couleur système comme CanvasText | [MDN — prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) ; [MDN — forced-colors](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors) | Établi — Baseline largement disponible (janvier 2020 et septembre 2022) : les deux exemples de code du fichier reposent sur des mécanismes acquis |
| T10 | Les container style queries et les scroll-state queries sont en disponibilité limitée ; à la date de rédaction de MDN, style() ne fonctionne qu'avec des propriétés personnalisées, la forme acceptant des déclarations CSS ordinaires n'étant prise en charge par aucun navigateur | [MDN — @container](https://developer.mozilla.org/en-US/docs/Web/CSS/@container) ; [MDN — Container size and style queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_size_and_style_queries) | **Disponibilité limitée** — la piste « Container Style Queries » de la section À approfondir ne peut pas devenir une convention : elle est restreinte aux propriétés personnalisées |
