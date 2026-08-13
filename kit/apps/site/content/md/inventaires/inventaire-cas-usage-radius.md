# Inventaire des cas d'usage — Radius (fondation)

> Inventaire des *usages du rayon* chez les consommateurs. Sert de checklist au test de couverture de RADIUS-UX.md. La plus petite fondation du système (3 tokens, règles courtes) — l'inventaire vérifie que la brièveté est une propriété du sujet, pas un trou de couverture.

---

## 1. Par rôle de rayon

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Rayon des petits composants | Bouton sm (radius.sm) — proportionné à la hauteur compacte | Couvert — le rayon suit la taille du composant, pas son importance |
| Rayon standard | Bouton md/lg, input, card, alert : radius.md partout | Couvert — un seul rayon de croisière, la cohérence prime |
| Rayon plein (pill) | Pastilles, badges, avatars ronds | Couvert — token provisionné, aucun consommateur documenté à ce jour (rendu visible, comme elevation.overlay) |
| Angle droit (0) | Élément volontairement carré | Couvert après test — l'absence de token "none" est une décision : rien dans ce système n'est carré par défaut, un besoin réel l'ajouterait |
| Rayon d'un conteneur vs son contenu | Media dans une carte : le coin du media épouse le coin de la carte | Couvert — règle d'imbrication posée (rayon interne ≤ externe, jamais l'inverse) |

## 2. Par contexte d'intégration

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Bouton | sm proportionné, md/lg identiques (pas d'effet pilule involontaire en lg) | Couvert (BUTTON-UI) — la règle générale en découle : le rayon ne grandit pas linéairement avec la taille |
| Input | Mêmes rayons que le bouton par taille — cohérence des contrôles de formulaire | Couvert (INPUT-UI) |
| Card / alert | radius.md, coins du media imbriqués | Couvert |
| Focus ring | Le ring épouse le rayon du composant + son offset | Couvert après test — cas d'imbrication *inversé* (le ring est à l'extérieur : son rayon = rayon du composant + offset) |
| Futur composant superposé (modale, popover) | Rayon des surfaces flottantes | Couvert par provision — radius.md attendu, à confirmer le jour venu |

## 3. Par état / comportement dans le temps

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Changement d'état | Le rayon ne change jamais entre repos/hover/focus/error | Couvert — le rayon est une propriété d'identité, pas d'état |
| Skeleton | Le squelette reprend le rayon du composant réel | Couvert (CARD-UI, dimensions identiques) |

## 4. Par plateforme / environnement

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Densités d'écran | Les rayons px se rendent uniformément | Couvert |
| Zoom | Même position que bordure/espacement : px assumé | Couvert |

## 5. Par enjeu / risque

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Rayons incohérents entre composants voisins | Un input radius.sm à côté d'un bouton radius.md dans le même formulaire | Couvert — la cohérence se joue par *taille* de composant, pas par composant ; sm avec sm, md avec md |
| Imbrication inversée | Coin interne plus rond que le coin externe — "l'oreille" | Couvert — règle d'imbrication |
| Pill sur du texte multiligne | Une pilule qui enveloppe deux lignes devient un stade | Couvert après test — pill réservé aux contenus mono-ligne intrinsèques (badge, avatar) |
| Dérive décorative | Chaque écran choisit son rayon | Couvert — échelle fermée, 3 valeurs |

---

## Bilan du test de couverture

Sur **17 cas recensés**, **4 étaient non couverts après la première rédaction** de RADIUS-UX.md.

**Comblés en 1.0.0 (avant livraison)** : angle droit (décision explicite plutôt qu'absence silencieuse), focus ring (imbrication inversée — rayon du ring = composant + offset), pill multiligne (réservé au mono-ligne).

**Reste non couvert** : rien de signalé — la fondation est courte parce que le sujet l'est, et l'inventaire le confirme : 17 cas, aucun contexte manquant identifié au-delà des provisions déjà visibles (pill sans consommateur, composants superposés à naître).

**Note de méthode** : le pill sans consommateur rejoint elevation.overlay dans la catégorie "tokens provisionnés, rendus visibles" — l'inventaire d'une fondation sert aussi à ça : dire *ce qui n'a pas encore servi*, pour que le jour venu on confirme la provision au lieu de la découvrir.
