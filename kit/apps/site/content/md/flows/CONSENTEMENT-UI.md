---
component: consentement
layer: ui
type: flow
version: 1.1.0 # 1.1.0 : suit CONSENTEMENT-UX dans flows/ (2026-07-27). 1.0.0 : 1.0.0 : première rédaction (2026-07-27), en même temps que CONSENTEMENT-UX.md. Aucun token neuf : le pattern consomme ALERT-UI, BUTTON-UI, COLOR-UI, SPACING-UI et GRID-UI. Cf. DECISIONS.md 2026-07-27.
last_updated: 2026-07-27
companion: CONSENTEMENT-UX.md
confidence: mixed
---

# Consentement — Couche UI (tokens)

> Mapping des contextes de `CONSENTEMENT-UX.md` sur les tokens. Aucune valeur brute : tout référence
> `DESIGN.md`. Ce pattern n'introduit **aucun token propre** — c'est volontaire, et c'est le sujet du
> premier point ci-dessous.

## Aucun token propre — et pourquoi

RÈGLE [CONSENTEMENT-UI-R01] : le bandeau ne possède aucun token. Il consomme le conteneur d'alerte (`ALERT-UI`), les boutons (`BUTTON-UI`), la couleur de surface (`COLOR-UI`) et le rythme vertical (`SPACING-UI`). Tout token qui naîtrait ici serait le signe d'une duplication.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, le bandeau de consentement n'introduit aucun token propre et réutilise intégralement ceux d'alerte, de bouton, de couleur et d'espacement.
POURQUOI : le bandeau est un message doublé de deux actions. Lui donner ses propres jetons de couleur ou d'espacement crée un troisième dialecte à maintenir, pour un objet qu'un site affiche une fois par visiteur et par semestre.

| Contexte | Token consommé | Propriétaire |
|---|---|---|
| Surface du bandeau | `couleur.surface.elevated` | COLOR-UI |
| Trait de séparation avec le contenu | `bordure.epaisseur.default` + `couleur.bordure.subtle` | BORDER-UI |
| Rythme interne (texte ↔ actions) | `espacement.stack.md` | SPACING-UI |
| Marge externe et largeur utile | `grid.container.default` | GRID-UI |
| Les deux boutons | `bouton.style.*` — **le même pour les deux** | BUTTON-UI |
| Message de confirmation après choix | conteneur `alert`, tone `info` | ALERT-UI |
| Rayon | `radius.md` | RADIUS-UI |

## La symétrie, en valeurs mesurables

RÈGLE [CONSENTEMENT-UI-R02] : les deux actions partagent le **même token de style de bouton**, sans exception. Ce n'est pas une préférence esthétique : c'est la traduction visuelle de `CONSENTEMENT-R08`.
STATUT : propriété universelle
SOURCE : S2, S3
ÉNONCÉ : Les boutons d'acceptation et de refus doivent référencer le même token de style de bouton.
MESURE : même valeur de `bouton.style`, dimensions rendues identiques à ±2 px, écart de contraste entre les deux ≤ 0,3:1.
CONTRE : la tentation est constante de donner le `fill` à l'acceptation « pour guider ». C'est exactement le nudge que la règle interdit.

RÈGLE [CONSENTEMENT-UI-R03] : le choix du style commun est libre — les deux en `ghost` (bandeau discret) ou les deux en `fill` (bandeau assumé). Notre défaut est `ghost` pour les deux : le bandeau est une information, pas une action attendue.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, les deux actions du bandeau sont rendues en style `ghost` par défaut.

## Ce que ce pattern n'a pas le droit d'utiliser

RÈGLE [CONSENTEMENT-UI-R04] : aucun token de superposition. Pas de `z-index.overlay`, pas de voile, pas d'ombre portée d'élévation haute. Le bandeau n'est pas un superposé : il se pose dans le flux.
STATUT : propriété universelle
SOURCE : S1, S5
ÉNONCÉ : Le bandeau ne consomme aucun token de superposition et n'est jamais fixé à l'écran.
MESURE : `position` calculée ≠ `fixed` et ≠ `sticky` ; aucun `z-index` supérieur à celui du contenu.
POURQUOI : traduction directe de `CONSENTEMENT-R12`. Un bandeau posé dans le flux ne peut pas masquer un élément focalisé — la règle d'accessibilité est satisfaite par construction plutôt que par vigilance.

## Contraste

RÈGLE [CONSENTEMENT-UI-R05] : le texte du bandeau respecte les seuils généraux — 4,5:1 pour le corps, 3:1 pour les traits et les bordures des deux boutons. Aucune tolérance liée au caractère temporaire du bandeau.
STATUT : propriété universelle
SOURCE : S5
ÉNONCÉ : Les seuils de contraste habituels s'appliquent sans dérogation au bandeau de consentement.
POURQUOI : le bandeau est le premier élément rencontré et il bloque la lecture tant qu'il n'a pas été traité. C'est le pire endroit possible pour un texte gris clair « puisqu'il va disparaître ».

## Mouvement

RÈGLE [CONSENTEMENT-UI-R06] : l'apparition du bandeau ne retarde jamais l'accès à ses actions. Une transition d'opacité courte est admise ; aucun glissement, aucun rebond, aucun délai avant l'activation des boutons.
STATUT : parti pris d'identité
SOURCE : interne
ÉNONCÉ : Chez nous, le bandeau apparaît par une transition d'opacité courte, sans déplacement, et ses actions sont immédiatement activables.
MESURE : sous `prefers-reduced-motion: reduce`, apparition instantanée. Dans tous les cas, aucun `transform` sur le bandeau.
POURQUOI : un bandeau qui glisse pendant 400 ms puis se stabilise fait manquer le premier clic. Le motif se retrouve tel quel dans `FORM-UI` sur l'écran de confirmation — même cause, même remède.

## Frontières

| Ce que ce fichier ne décide pas | Où c'est décidé |
|---|---|
| Le rendu du conteneur de message et de son tone | ALERT-UI |
| Les valeurs de `bouton.style`, tailles, états | BUTTON-UI |
| Les seuils de contraste eux-mêmes | COLOR-UI |
| L'échelle d'espacement | SPACING-UI |
| Le lien permanent de retour sur le choix, en pied de page | NAVIGATION-UI |
| S'il faut un bandeau | CONSENTEMENT-UX, règle R03 |

## Sources et niveau de confiance

> Les sources sont celles de `CONSENTEMENT-UX.md`, reprises ici pour que ce fichier soit lisible
> seul — les identifiants `S1` à `S5` désignent les mêmes références dans les deux couches.

| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| S1 | Interdiction du bandeau collant au nom du focus non masqué ; message de confirmation après le choix | [GOV.UK Design System — Cookie banner](https://design-system.service.gov.uk/components/cookie-banner/) | Établi — adopté ici pour R04 et R01 |
| S2 | Boutons d'acceptation et de refus présentés au même niveau et selon un format identique | [CNIL — Mettre son site en conformité](https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/comment-mettre-mon-site-web-en-conformite) | Établi, régulateur national — fonde R02 |
| S3 | Catégorie *Stirring* : influencer un choix par un nudge visuel | [CEPD — Lignes directrices 03/2022](https://www.edpb.europa.eu/documents/guideline/guidelines-032022-on-deceptive-design-patterns-in-social-media-platform_en) | Établi, régulateur européen — fonde R02 |
| S5 | Un élément qui reçoit le focus ne doit pas être masqué ; seuils de contraste texte et composants | [WCAG 2.2 — 2.4.11 Focus Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html) ; [WCAG 2.2 — 1.4.3 Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) | Établi, standard (AA) — fonde R04 et R05 |

**Non sourcé, assumé comme parti pris** : le style `ghost` par défaut pour les deux actions (R03) et
la transition d'opacité seule, sans déplacement (R06). Aucun précédent relevé ne se prononce ; ces
deux règles sont nôtres et se déclarent comme telles.
