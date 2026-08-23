# Inventaire des cas d'usage — Élévation (fondation)

> Inventaire des *usages de la profondeur* chez les consommateurs. Sert de checklist au test de couverture de ELEVATION-UX.md. L'échelle actuelle est volontairement courte (none/raised/overlay) — l'inventaire vérifie qu'elle suffit, pas qu'elle imite les 6 niveaux de Material.

---

## 1. Par rôle d'élévation

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Surface au repos | Cartes outlined, alerts, inputs — tout vit à plat | Couvert — le repos est à plat par décision (none), la bordure fait le containment |
| Affordance au survol | elevation.raised sur carte cliquable uniquement | Couvert — l'élévation est un *signal*, pas un style ; réservée pour ne pas s'user |
| Superposition au flux | Modale, popover, menu, tooltip (futurs) | Couvert — elevation.overlay provisionné, aucun consommateur à ce jour (assumé et journalisé) |
| Mise en avant sans superposition | Panneau surface-contrast (console/dashboard) | Couvert — la mise en avant passe par le contraste de surface, pas par l'ombre : deux mécanismes distincts, règle de non-cumul à poser |
| Hiérarchie permanente par l'ombre | "Tout ce qui est important est élevé" | Couvert — anti-pattern documenté : l'élévation de repos généralisée annule le signal d'affordance |

## 2. Par contexte d'intégration

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Carte en collection | raised au hover des cliquables, none au repos | Couvert (CARD-UI) |
| Bouton | Aucune élévation, à aucun état | Couvert — décision explicite : le bouton signale par le fond (state layer), pas par l'ombre |
| Alert | Aucune élévation — il est *dans* le flux, c'est sa frontière avec le toast | Couvert — la frontière "dans le flux vs au-dessus du flux" recoupe exactement none vs overlay |
| Futur toast/snackbar | Au-dessus du flux → overlay | Couvert par provision — à confirmer le jour venu |
| Empilement de superpositions | Modale + popover ouvert dans la modale | **Non couvert actuellement** — un seul niveau overlay ; l'empilement (z-index, ordre) n'est traité nulle part |

## 3. Par état / comportement dans le temps

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Transition d'élévation (repos → hover) | L'ombre apparaît/disparaît | Couvert par renvoi — la fondation motion fait autorité (durée, courbe, reduced-motion) ; l'élévation fournit les deux bornes |
| Élévation pendant un drag | Carte soulevée pendant un glisser-déposer | **Non couvert actuellement** — aucun consommateur drag & drop ; signalé |
| Skeleton / chargement | Le squelette n'est jamais élevé | Couvert — il occupe l'espace, il ne signale pas d'affordance |

## 4. Par plateforme / environnement

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Fond clair (référence) | Ombres teintées text-primary, pas noir pur | Couvert |
| Mode sombre | Les ombres portées deviennent invisibles sur fond sombre | **Non couvert actuellement** — même statut que le dark mode de la couleur ; la convention industrie (surfaces éclaircies plutôt qu'ombres) est notée pour le jour venu |
| Sur surface-contrast | Une ombre sur le panneau sombre est déjà le cas ci-dessus en miniature | Couvert — règle de non-cumul : surface-contrast ne porte pas d'ombre |
| Contraste élevé forcé | forced-colors supprime les box-shadow | Couvert après test — l'élévation ne doit jamais être le *seul* signal (le focus ring et la bordure survivent, pas l'ombre) |

## 5. Par enjeu / risque

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Élévation décorative généralisée | Le signal d'affordance ne signale plus rien | Couvert — risque n°1, déjà documenté par CARD-UI |
| Ombre sur carte statique | Affordance mensongère (l'utilisateur clique dans le vide) | Couvert (CARD-UX, erreur fréquente) |
| Multiplication des niveaux | 6 ombres dont 4 indiscernables | Couvert — échelle courte par décision, ajout uniquement sur besoin réel |
| Ombre comme séparateur | Ombre utilisée pour délimiter au lieu de la bordure | Couvert — la délimitation appartient à la bordure (fondation border), l'ombre à la profondeur |
| z-index anarchique | Guerres de z-index sans échelle | **Non couvert actuellement** — lié à l'empilement, naîtra avec le premier composant superposé |

---

## Bilan du test de couverture

Sur **21 cas recensés**, **5 étaient non couverts après la première rédaction** de ELEVATION-UX.md.

**Comblés en 1.0.0 (avant livraison)** : contraste élevé forcé (l'ombre disparaît sous forced-colors — règle : jamais le seul signal), mode sombre (position explicite : non couvert par décision, convention "surfaces éclaircies" notée pour le jour venu).

**Restent non couverts** : empilement de superpositions + échelle z-index (naîtront ensemble avec le premier composant superposé — modale/popover/toast ; c'est le même signal que elevation.overlay provisionné), élévation de drag & drop (aucun consommateur). Aucun critique en risque immédiat — tous liés à des composants qui n'existent pas encore.

**Note de méthode** : 3e confirmation — les trous d'une fondation sont des contextes pas encore nés. L'élévation est la fondation la plus "en avance sur ses consommateurs" du système : 2 de ses 3 tokens n'ont qu'un consommateur (raised) ou aucun (overlay). L'inventaire le rend visible au lieu de le laisser suggérer une fausse maturité.
