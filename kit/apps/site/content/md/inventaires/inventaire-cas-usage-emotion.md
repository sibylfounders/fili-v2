# Inventaire des cas d'usage — E‑motion / couche d'expression (fondation)

> Inventaire des *moments* où le système a le droit — ou le devoir de s'abstenir — de sortir du registre productif. Sert de checklist au test de couverture d'EMOTION-UX.md. Particularité : contrairement aux autres fondations, E‑motion se définit autant par son **catalogue de moments mérités** que par ses **anti‑usages** (là où elle est proscrite) — le budget de rareté est sa loi cardinale, et un moment mal placé se retourne contre le produit.

---

## 1. Par battement de parcours (le catalogue des moments mérités)

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Réussite d'un envoi / d'une soumission | « Envoyer » aboutit — l'avion en papier part | Couvert — premier citoyen (SubmitButton) ; l'utilisateur a confié quelque chose, l'accusé de réception mérite d'être ressenti, pas seulement lu |
| Première fois / onboarding franchi | Fin d'un setup, premier projet créé | Couvert — un seuil de parcours ; l'émotion marque le passage, une seule fois |
| Cap / accomplissement | Objectif atteint, dernière tâche cochée | Couvert — la récompense d'un effort, pas d'un clic ; jamais répété à chaque item |
| Sortie d'une erreur / récupération | Un blocage enfin résolu | Couvert — le soulagement mérite d'être reconnu ; la célébration reste sobre, l'information de résolution vit d'abord dans le statique |
| Vide et attente qui ont une personnalité | Empty state, chargement long assumé | Couvert — les creux du parcours ; une personnalité discrète, jamais un mouvement qui bloque ou distrait |

## 2. Par anti‑usage (là où E‑motion est proscrite)

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Action réflexe ou à haute fréquence | Hover, clic de navigation, envoi répété 40×/jour | Couvert négativement — jamais : mal placé, l'effet ralentit et agace ; un signal partout n'est plus un signal |
| Répétition à chaque frappe ou par item de liste | Le même moment rejoué en boucle | Couvert négativement — un moment ne se déclenche qu'une fois par séquence utile ; répété, il devient une attente puis une gêne |
| Micro‑interaction purement fonctionnelle | Un feedback de press, une bordure d'erreur | Couvert négativement — reste sur le registre productif (motion.fast, ease) ; le cran expressif est interdit hors moment mérité |
| Décor gratuit sans moment | Une animation d'ambiance « pour faire joli » | Couvert négativement — l'expression n'est jamais esthétique : sans poids émotionnel réel, pas de moment |

## 3. Par instrument accordé

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Mouvement (premier violon) | Chorégraphie et caractère (motion.expressive / motion.spring) | Couvert — l'instrument principal, la porte d'entrée du moment, jamais toute la pièce |
| Voix (registre chaleureux) | Le microcopy se réchauffe d'un cran (« C'est parti ✈️ ») | Couvert — E‑motion autorise le registre chaleureux sur ces instants ; elle ne redéfinit pas la voix (autorité : RULES-voice.md) |
| Couleur empruntée | Le vert de succès, le primary de marque | Couvert — puise dans les rôles existants ; jamais un hex inventé, la chaleur vient de l'usage |
| Illustration / forme | Un glyphe qui se dessine, une silhouette qui se plie | Couvert — au service du moment, dessinée en stroke‑dashoffset, jamais gratuite |
| Instruments désaccordés | Le mouvement finit avant que la voix change et que le vert prenne | Couvert négativement — un moment réussi accorde ses instruments ; désaccordés, ils font du bruit |

## 4. Par contrat de repli / accessibilité

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| prefers‑reduced‑motion | Troubles vestibulaires, préférence système | Couvert — le moment dégrade proprement vers sa version productive/instantanée (« Envoyé ✓ » direct), jamais vers rien : le fait reste, la fête part |
| E‑motion comme canal d'information | Tenter de porter un état par la seule animation | Couvert négativement — jamais : l'état vit dans l'ARIA et le statique ; couper l'animation ne coupe jamais l'information |
| Héritage du contrat d'accessibilité de motion | Flash > 3/s, propriétés animées, verrou d'action | Couvert — hérite intégralement de motion et n'en relâche aucune clause : pas de flash (WCAG 2.3.1), transform/opacity seuls, le mouvement ne verrouille jamais |

## 5. Par gouvernance / risque

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Ajouter un moment hors catalogue | Un nouveau battement qu'on veut célébrer | Couvert — décision de design tranchée (passe par DECISIONS.md), jamais un réflexe d'implémenteur |
| Set‑piece trop long | Une séquence qui dépasse motion.celebration | Couvert — plafond dur : au‑delà, le moment est perçu comme un blocage, pas comme une fête |
| Le moment verrouille l'action | L'utilisateur attend la fin de l'animation pour continuer | Couvert — l'envoi réel part indépendamment ; si la réponse arrive avant la fin, l'état réel prime et l'animation se résout au plus court |
| Effet local copié d'un écran à l'autre | Un CSS expressif recollé sans gouvernance | Couvert négativement — chaque moment signature est un composant catalogué, versionné, budget‑gated ; une exception documentée, jamais arbitraire |

---

## Bilan du test de couverture

Sur **21 cas recensés**, tous portent une décision — mais la lecture est particulière pour cette fondation. E‑motion est une couche **jeune** (1.0.0, confiance mixte) : le contrat de repli et l'héritage WCAG sont établis (hérités de `motion` et `accessibility`), tandis que la proportionnalité et le « budget de rareté » sont un parti pris d'identité interne, assumé et non chiffré.

**Particularité de méthode** : près de la moitié des cas sont **couverts *négativement*** — ce sont des interdits (où E‑motion ne se pose pas). C'est cohérent avec la loi cardinale : une couche d'expression se définit d'abord par la rigueur du silence autour d'elle. Le catalogue de moments mérités (section 1) est un **point de départ**, pas une carte figée ; il s'enrichira par l'usage réel.

**Un seul citoyen éprouvé** : le SubmitButton « avion en papier » (envoi async → pliage/vol → succès) sert de preuve et de gabarit. Tout futur moment suit son anatomie en trois actes et son contrat de repli. Les autres entrées du catalogue sont écrites mais **pas encore incarnées** dans un composant livré — à confirmer par l'implémentation.
