# Inventaire des cas d'usage — Gesture / gestes (langage)

> Inventaire des situations où un **geste** (au-delà du tap simple) pilote une fonction : glissement, glisser-déposer, appui long, multipoint. Sert de checklist au test de couverture de `GESTURE-UX.md`. Particularité : un geste est **rapide mais invisible** — il n'a ni libellé, ni bordure, ni état au repos. Le trou spécifique à chercher : le geste qui devient le *seul* moyen d'accomplir une action (piège d'accessibilité WCAG 2.5.1 / 2.5.7).

---

## 1. Par type de geste

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Tap / appui simple | Le geste de base | Couvert — ce n'est pas un « geste » au sens du langage : un point, pas un chemin ; relève de `touch` |
| Appui long | Menu contextuel, prévisualisation | Couvert — jamais le seul accès à une fonction ; il double toujours une action visible |
| Glissement path-based (swipe) | Balayer pour supprimer, changer d'onglet | Couvert — geste **à trajectoire** : exige une alternative à pointeur unique (WCAG 2.5.1) |
| Glisser-déposer (drag) | Réordonner, déplacer vers une cible | Couvert — exige une alternative **sans glissement** : boutons monter/descendre, menu « déplacer vers » (WCAG 2.5.7) |
| Multipoint (pinch, rotation) | Zoomer, pivoter | Couvert — geste à plusieurs doigts : alternative à pointeur unique (boutons +/−), sauf si essentiel |

## 2. Par alternative obligatoire

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Alternative à pointeur unique | Tout swipe / pinch | Couvert — règle cardinale : un tap/clic simple atteint la même fonction (WCAG 2.5.1, niveau A) |
| Alternative sans glissement | Tout drag | Couvert — l'action se fait aussi sans maintenir-déplacer (WCAG 2.5.7, niveau AA) |
| Geste essentiel | Signature, dessin, carte libre | Couvert — la seule exception : quand le tracé EST la donnée ; documenté et remonté, jamais présumé |
| Raccourci, pas substitut | Le geste accélère | Couvert — un geste est toujours un **raccourci** pour l'expert, jamais l'unique porte d'entrée |

## 3. Par découvrabilité

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Geste caché | Aucun indice à l'écran | Couvert — interdit comme seul accès : un geste sans indice n'est découvert par personne |
| Indice visible | Poignée, ombre, « peek » | Couvert — un geste utile s'annonce par un affordant visible (frontière avec `interaction`) |
| Standard de plateforme | Swipe-back iOS, pull-to-refresh | Couvert — on respecte le geste système attendu ; on n'en invente pas un concurrent |
| Apprentissage / première fois | Coach-mark au premier usage | Couvert — l'aide au geste est ponctuelle, non bloquante, jamais répétée à chaque venue |

## 4. Par annulation et erreur

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Seuil de déclenchement | Distance/durée avant d'agir | Couvert — un geste ne se déclenche qu'au-delà d'un seuil franc ; sous le seuil, rien ne se passe |
| Annulation d'un glissement | Relâcher avant la cible | Couvert — ramener puis relâcher hors zone annule ; l'effet n'est acté qu'à la validation (parenté WCAG 2.5.2) |
| Geste accidentel | Effleurement en défilant | Couvert — le défilement prime ; un geste d'action ne se confond pas avec le scroll |
| Retour pendant le geste | Suivi du doigt, aperçu | Couvert — le mouvement d'accompagnement suit `motion` (transform/opacity) et se coupe sous reduced-motion |

## 5. Par accessibilité

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Clavier | Toute fonction gestuelle | Couvert — la fonction est atteignable au clavier ; le geste n'est jamais le seul chemin (renvoi accessibilité) |
| Lecteur d'écran | Gestes propres à l'AT | Couvert — l'AT capte ses propres gestes ; l'action reste exposée par un contrôle nommé, pas par un swipe brut |
| Motricité réduite | Geste complexe coûteux | Couvert — l'alternative à pointeur unique EST l'accès pour qui ne peut pas tracer ni maintenir |
| Motion actuation | Secouer, incliner l'appareil | Couvert — une fonction déclenchée par le mouvement de l'appareil a un contrôle équivalent et se désactive (WCAG 2.5.4) |

---

## Bilan du test de couverture

Sur **21 cas recensés**, **2 étaient non couverts** à la première rédaction de `GESTURE-UX.md` : le **geste essentiel** (le tracé qui *est* la donnée — signature, dessin — seule exception légitime à l'alternative) et le **motion actuation** (secouer/incliner : un geste sans écran, souvent oublié parce qu'il ne touche pas la surface). Les deux comblés avant livraison.

**Reste non couvert** : le produit n'a aujourd'hui **aucune surface gestuelle réelle** — ce langage est en grande partie *anticipatoire*, écrit pour que le premier drag-and-drop ou swipe-to-dismiss arrive avec son contrat (alternative + découvrabilité + annulation) déjà posé, plutôt que d'être improvisé. La matière viendra le jour d'une vraie surface tactile applicative.

**Note de méthode** : gesture est le pendant *comportemental* de la fondation `touch` (qui, elle, porte les tokens de taille). Là où touch dit « assez grand pour être touché », gesture dit « jamais seulement atteignable par un tracé ». Les deux notions manquaient au système alors qu'elles sous-tendent toute interaction au doigt.
