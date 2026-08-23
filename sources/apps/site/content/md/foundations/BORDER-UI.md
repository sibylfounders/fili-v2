---
component: border
layer: ui
type: foundation
version: 1.4.0 # 1.4.0 : U02/ring_color — couleur du ring = control.focus-color (cran subtil accordé à la bordure/état, défaut primary éclairci ; focus v2 du 2026-07-29 après-midi, remplace l'essai accent du matin) ; géométrie inchangée. 1.3.0 : 1.3.0 : U02 corrigée — la technique de l'anneau était annoncée « établie par convergence », le relevé du 2026-07-27 montre qu'aucune technique ne fait consensus (source T4). 1.2.0 : PILOTE « décisions sourcées », couche technique — les règles d'implémentation deviennent adressables (BORDER-Unn), avec statut et source. Aucune spécification modifiée. Cf. DECISIONS.md 2026-07-26. 1.1.0 : exception « outline:none » sur une cible de focus programmatique (tabindex=-1, annonce d'un changement de vue) — bug d'anneau au chargement, 2026-07-16. Première version : 1.0.0.
last_updated: 2026-07-27
companion: BORDER-UX.md
tokens:
  roles:
    delimitante: color.border-strong # seul signal d'un composant interactif au repos — 3:1 obligatoire
    decorative: color.border # groupement et séparation — exemptée du seuil
  focus:
    ring_color: control.focus-color # défaut primary éclairci ; crans accordés control.focus-{danger,success,warning,info,neutral} (focus v2, 2026-07-29)
    ring_width: border.focus-width # créés par cette fondation (DESIGN.md 1.9.0) — largeur et écart étaient des déductions silencieuses
    ring_offset: border.focus-offset
  epaisseur:
    trait: 1px # hairline — exception documentée (cf. ALERT-UI, RAPPORT-VALIDATION) : épaisseur constante, pas une valeur d'échelle ; l'état change la couleur, jamais l'épaisseur
confidence: mixed
---

# Bordure — Couche UI (fondation)

> Grammaire d'application du trait et du focus ring. Le raisonnement (trois rôles, critère délimitant, épaisseur constante) vit dans BORDER-UX.md. Les valeurs sont résolues dans DESIGN.md.
> Les règles de cette couche portent des identifiants `BORDER-Unn` — ce sont des consignes d'implémentation, pas des arbitrages de design ; leurs sources sont techniques (`T1…T3`).

## Application par rôle

| Rôle | Couleur | Seuil | Exemples actuels |
|---|---|---|---|
| Délimitante | `color.border-strong` | 3:1 obligatoire, testé | bordure neutral de l'input, bouton secondary |
| Sémantique (état) | `color.{tone}` | 3:1 (c'est un état visible) | input error/success/warning, bordures des tones de l'alert |
| Groupement | `color.border` | exemptée | carte outlined |
| Séparation | `color.border` | exemptée — et en dernier recours (SPACING-UX) | aucune à ce jour (les composants séparent par l'espace) |

RÈGLE [BORDER-U01] : épaisseur **hairline 1px partout**. Un état ne modifie jamais l'épaisseur — il change la couleur du trait ou ajoute le ring.
STATUT : implémentation de référence
SOURCE : interne
ÉNONCÉ : Le code applique 1px à tous les traits ; un état change la couleur, jamais l'épaisseur.
MESURE : border-width = 1px

## Focus ring — spécification unifiée

RÈGLE [BORDER-U02] : `outline` de largeur `border.focus-width` en `control.focus-color` (cran subtil accordé à la bordure/état ; défaut primary éclairci), décalé de `border.focus-offset` **à l'extérieur** du composant (`outline-offset`) — jamais `border` : le ring ne participe pas à la boîte, donc pas de layout shift et coexistence avec la bordure d'état.
STATUT : implémentation de référence
SOURCE : T4, T1
CONTRE : aucune technique ne fait consensus (relevé du 2026-07-27) — `outline` + décalage chez Carbon et Spectrum, `box-shadow` chez Primer et Salesforce, hybride chez GOV.UK, `border` animée chez Fluent 2. Nous choisissons `outline` parce qu'il ne participe pas à la boîte ; ce n'est pas la pratique dominante, il n'y en a pas.
ÉNONCÉ : L'anneau de focus se pose en `outline` avec un décalage extérieur, jamais en `border`.
MESURE : outline + outline-offset, aucune border ajoutée au focus

RÈGLE [BORDER-U03] : le rayon perçu du ring suit le composant — rayon du composant + offset (imbrication inversée, cf. RADIUS-UI).
STATUT : implémentation de référence
SOURCE : interne
ÉNONCÉ : Le rayon de l'anneau suit celui du composant, augmenté du décalage.

RÈGLE [BORDER-U04] : apparition **instantanée** — le ring est exclu des transitions (MOTION-UI l'inscrit dans ses interdits techniques).
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : L'anneau apparaît sans transition.
MESURE : aucune transition sur outline

RÈGLE [BORDER-U05] : `:focus-visible` de préférence à `:focus` — le ring sert la navigation clavier ; le clic souris n'a pas besoin de le déclencher.
STATUT : propriété universelle
SOURCE : T2
ÉNONCÉ : Utiliser `:focus-visible` plutôt que `:focus`.
MESURE : sélecteur :focus-visible présent

RÈGLE [BORDER-U06] : jamais `outline: none` sans remplacement équivalent au seuil 3:1, sur tout contrôle atteignable au clavier (Tab).
STATUT : propriété universelle
SOURCE : T3
ÉNONCÉ : Ne jamais écrire `outline: none` sur un élément atteignable au clavier sans un remplacement équivalent.
MESURE : aucun outline:none sur un élément tabulable
POURQUOI : c'est la suppression la plus fréquente en revue de code — un `outline: none` posé « pour faire propre » rend la navigation clavier aveugle.

RÈGLE [BORDER-U07] : **exception — cible de focus programmatique.** Un élément rendu focusable uniquement pour annoncer un changement de vue (titre ou région en `tabindex="-1"`, focalisé par script) n'est jamais atteint au Tab : il ne porte donc pas d'anneau — `[tabindex="-1"]:focus { outline: none }`. L'anneau reste obligatoire partout où l'on arrive réellement au clavier, y compris un panneau d'onglet `tabindex="0"` vide.
STATUT : implémentation de référence
SOURCE : interne
ÉNONCÉ : Exception : un élément focalisable uniquement par script (`tabindex="-1"`) ne porte pas d'anneau.
POURQUOI : sans cette exception, un anneau parasite apparaît au chargement — et par intermittence, puisque `:focus-visible` dépend de la modalité d'arrivée (bug du 2026-07-16).

## Consommation par les composants

| Consommateur | Délimitante | Sémantique | Ring |
|---|---|---|---|
| Bouton (BUTTON-UI.md) | secondary : `border-strong` | tone `_fg` sur la bordure secondary | `focus_ring` = cran control.focus-* accordé au tone + largeur/écart d'ici |
| Input (INPUT-UI.md) | neutral : `border-strong` | error/success/warning | idem |
| Card (CARD-UI.md) | — (outlined = groupement, `border`) | selected : `primary` (+ coche) | idem |
| Alert (ALERT-UI.md) | — | bordure `{tone}` 1px | — (non focalisable en surface) |
| Modal / Drawer (OVERLAY-UI.md) | — | — | le ring interne reste celui d'ici, non redéfini |

Les consommateurs du ring référencent la même spécification — la largeur et l'écart ne sont plus une déduction par composant.

## Vérifiabilité

RÈGLE [BORDER-U08] : `test-rendu.js` vérifie le 3:1 des bordures délimitantes et sémantiques, critère appliqué identiquement à tous les composants (décision F02).
STATUT : implémentation de référence
SOURCE : interne
ÉNONCÉ : Le contraste des bordures est vérifié automatiquement à la génération.

RÈGLE [BORDER-U09] : la distinction délimitante / décorative n'est **pas** décidable par un script — elle dépend du rôle, pas de la valeur. C'est un critère de revue humaine ; la table « Application par rôle » ci-dessus en tient le registre.
STATUT : note de méthode
SOURCE : interne

RÈGLE [BORDER-U10] : le rendu effectif d'`outline-offset` et de `:focus-visible` se vérifie **au clavier, à la main** — l'outillage ne le simule pas.
STATUT : note de méthode
SOURCE : interne

## Sources et niveau de confiance (couche UI)

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| T1 | Ring en outline + offset, extérieur à la boîte | [Atlassian — Border](https://atlassian.design/foundations/border) (focused à 2 px) ; [Carbon](https://cdn.jsdelivr.net/npm/@carbon/styles/scss/utilities/_focus-outline.scss) (`outline` + `outline-offset`) ; [Spectrum](https://raw.githubusercontent.com/adobe/spectrum-css/main/components/textfield/index.css) (`outline` + `outline-offset`) | **Corrigé le 2026-07-27** : annoncé « établi par convergence », il ne l'est pas — 2 systèmes sur 6 vérifiés emploient cette technique. Voir T4. |
| T4 | **Relevé de benchmark, 2026-07-27 — technique de l'anneau de focus.** Six systèmes vérifiés : `outline` + décalage (Carbon, Spectrum), `box-shadow` (Primer, Salesforce), hybride outline + box-shadow (GOV.UK), `border` animée (Fluent 2). Deux non vérifiables (Material 3, Polaris). **Aucune convergence.** La norme est agnostique : [WCAG 2.4.7](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html) n'impose aucune propriété CSS, [2.4.13](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html) fixe des seuils (aire ≥ périmètre de 2px, contraste ≥ 3:1) sans dicter la technique. | Relevé interne sur feuilles de style publiées | Établi — mesuré. Notre technique est un choix d'implémentation, pas un standard. |
| T2 | `:focus-visible` pour la navigation clavier | [MDN — :focus-visible](https://developer.mozilla.org/docs/Web/CSS/:focus-visible) (spec CSS Selectors 4) | Établi |
| T3 | 3:1 sur délimitantes et états | [WCAG 1.4.11](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html) | Établi — testé par tools/test-rendu.js |
