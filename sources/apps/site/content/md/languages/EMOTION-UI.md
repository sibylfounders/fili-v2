---
component: emotion
layer: ui
type: language
version: 1.2.0 # 1.2.0 : E-motion devient un langage d'expression de premier niveau, distinct de la fondation motion qu'il gouverne. 1.1.0 : contrat « Compatibilité & poids » — chaque moment signature documente son support navigateurs façon caniuse (complet / dégradé / sans animation, avec repli statique fonctionnel garanti) et tient un budget de poids (zéro dépendance d'animation, aucune animation au repos, jamais de layout). Demande produit 2026-07-18. 1.0.0 : première rédaction — cran EXPRESSIF (motion.expressive/spring/celebration ajoutés dans DESIGN.md 1.22.0) et anatomie technique d'un moment signature. Hérite toutes les techniques et interdits de MOTION-UI (transform/opacity, interruptible, reduced-motion). Cf. DECISIONS.md 2026-07-18.
last_updated: 2026-07-20
companion: EMOTION-UX.md
tokens:
  # Le cran EXPRESSIF vit dans le groupe motion (motion = vocabulaire ; emotion = gouvernance de son usage).
  duree:
    expressive: motion.expressive # beat expressif de base — au-delà de la borne ~400ms du registre productif
    celebration: motion.celebration # plafond d'une séquence chorégraphiée complète (set-piece)
  courbe:
    spring: motion.spring # courbe à léger dépassement (overshoot) — le « caractère » d'E-motion
    entree: motion.ease-out # les actes fonctionnels du moment restent sur les courbes productives
    sortie: motion.ease-in
  # E-motion ne crée AUCUNE couleur : elle puise dans les rôles existants.
  couleurs_empruntees:
    marque: color.primary # l'objet expressif (l'avion) porte la couleur de marque
    succes: color.success # la résolution s'installe sur le vert de succès
    succes_fond: color.success-subtle
  confidence: mixed
---

# E‑motion — Couche UI (langage d'expression)

> Le cran technique et l'anatomie d'un moment signature. Le raisonnement (moments mérités, budget, contrat de repli) vit dans `EMOTION-UX.md`. Les valeurs sont résolues dans `DESIGN.md`. E‑motion **hérite toutes les techniques et tous les interdits** de `MOTION-UI.md` — elle ne fait qu'ouvrir un cran de durée et une courbe de plus.

## Le cran expressif (ce qu'E‑motion ajoute au vocabulaire)
- `motion.expressive` — le beat d'un moment mérité, volontairement au‑delà de la borne ~400ms du registre productif. À réserver aux moments du catalogue (EMOTION-UX), jamais à une micro‑interaction fonctionnelle.
- `motion.spring` — la courbe à léger **dépassement** (overshoot) : c'est elle qui donne le *caractère*. Interdite hors moment mérité (le registre productif reste sur `ease-out`/`ease-in`/`ease-in-out`).
- `motion.celebration` — le **plafond dur** d'une séquence chorégraphiée complète (l'avion en papier). Au‑delà, le moment est trop long : perçu comme un blocage, pas comme une fête.

## L'anatomie d'un moment signature (trois actes)
Tout moment E‑motion se compose en trois temps — c'est le gabarit que suit le SubmitButton et que suivra tout futur citoyen :

| Acte | Rôle | Durée | Courbe |
|---|---|---|---|
| **1. Anticipation** | Le point de départ « se ramasse » avant de partir (l'utilisateur sent que quelque chose va se passer) | `motion.fast` | `motion.ease-in` |
| **2. Acte** | Le geste expressif lui‑même : l'objet se plie, décolle, la traînée se dessine | `motion.expressive` | `motion.spring` |
| **3. Résolution** | Le système « s'installe » dans le nouvel état (le succès apparaît, la voix change, le vert prend) | `motion.expressive` | `motion.ease-out` |

La somme des trois actes ne dépasse jamais `motion.celebration`.

## Techniques (héritées de MOTION-UI, sans exception)
- **`transform` et `opacity` uniquement.** Le pliage, le vol, le rebond : tout passe par `translate`/`rotate`/`scale`/`opacity`. Jamais de `width`/`height`/`top`/`margin` animés (layout), jamais de `box-shadow` interpolée (paint).
- **Traînée / trajectoire** : une trajectoire courbe se fait en dessinant un tracé (`stroke-dashoffset` sur un `path` SVG) — pas en déplaçant un layout. Le glyphe de succès se **dessine** de la même façon (`stroke-dashoffset` de plein à zéro).
- **Particules / étincelles** (si présentes) : quelques éléments pré‑rendus animés en `transform`/`opacity`, jamais générés en masse, jamais bloquants — décoratifs par nature, coupés sous reduced‑motion.
- **Le moment ne verrouille jamais l'action** : l'envoi réel (la requête) part indépendamment de l'animation. Si la réponse serveur arrive avant la fin de la fête, l'état réel prime — l'animation se résout au plus court, elle ne retient pas l'utilisateur.
- Un set‑piece (séquence célébration) peut, lui, aller au bout sans être interrompu à mi‑course — mais il reste court (`motion.celebration`) et non bloquant.

## `prefers-reduced-motion` (repli obligatoire, par acte)
- **Acte 1 (anticipation)** : supprimé.
- **Acte 2 (acte)** : supprimé — pas de vol, pas de pliage, pas de traînée, pas de spring.
- **Acte 3 (résolution)** : conservé en **bascule instantanée ou crossfade d'opacité** — le nouvel état (succès + voix + vert) apparaît, sans déplacement.
- Résultat : sous reduced‑motion, « Envoyer » devient « Envoyé ✓ » immédiatement. Le *fait* est intact, la *fête* est retirée. Un bloc média global (hérité de MOTION-UI) porte cette bascule ; le composant ne redéclare rien.

## Reproductibilité
- Chaque valeur (durée, courbe, couleur) est liée à un token — jamais une valeur en dur, même pour un set‑piece.
- Un moment E‑motion est un composant/comportement **catalogué et versionné** (exception documentée), pas un effet CSS local copié d'un écran à l'autre.

## Compatibilité & poids (ajouté en 1.1.0 — contrat par moment signature)
- **Compatibilité documentée, façon caniuse** : chaque moment signature publie sa table de support navigateurs à trois niveaux — *complet* / *dégradé léger* (préciser ce qui manque : courbe, fondu, focus…) / *sans animation* — avec les versions planchers. Un niveau non documenté = un moment non livrable.
- **Repli statique garanti tout en bas de l'échelle** : sur un navigateur sans le socle requis (ex : variables CSS), le composant reste un contrôle **statique fonctionnel** — l'action part, l'état s'annonce (ARIA), rien ne casse visuellement. Le moment signature est un enrichissement progressif, jamais une dépendance.
- **Budget de poids** : zéro dépendance d'animation (pas de bibliothèque dédiée — un orchestrateur maison de quelques Ko suffit), quelques Ko au total, **aucune animation au repos** (rien ne tourne avant le déclenchement), et **jamais de propriété de layout** — `transform`/`opacity` composités, `clip-path`/`stroke-dashoffset`/couleur peints sur la seule surface du composant. Zéro reflow, coût nul hors du moment.
- Référence d'application : le SubmitButton (voir sa doc composant) — complet sur les navigateurs récents, traînées via couleur de repli sans `color-mix`, focus via `:focus` sans `:focus-visible`, statique fonctionnel sans variables CSS.

## Sources et niveau de confiance (couche UI)
| Réf. | Affirmation | Source | Confiance |
|---|---|---|---|
| T1 | transform/opacity uniquement ; interruptible ; reduced-motion par couches | MOTION-UI.md (héritage direct) | Établi — hérité |
| T2 | Courbe à overshoot pour le caractère expressif | Convention d'animation (« back »/spring easing), Material expressive, GSAP | Établi par convergence ; valeur exacte propre à ce système |
| T3 | Anatomie en trois actes (anticipation / acte / résolution) | Principes d'animation (anticipation, follow-through) ; cadre interne | Émergent — gabarit interne, à éprouver par l'usage |
