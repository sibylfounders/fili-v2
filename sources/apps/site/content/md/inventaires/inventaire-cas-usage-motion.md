# Inventaire des cas d'usage — Motion / micro-interactions (fondation)

> Inventaire des *usages du mouvement* chez les consommateurs. Sert de checklist au test de couverture de MOTION-UX.md. Particularité : cette fondation est *entièrement* faite d'états transitoires — le prédicteur du README ne désigne plus un trou probable mais le sujet lui-même. Le trou spécifique à chercher devient : l'interruption (que se passe-t-il quand l'utilisateur agit *pendant* la transition ?).

---

## 1. Par micro-interaction chez les consommateurs actuels

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Hover du bouton (state layer) | Fond assombri ou remplissage apparaissant | Couvert — transition courte (motion.fast), le hover confirme, il ne spectacle pas |
| Hover de la carte cliquable | Élévation raised qui apparaît | Couvert — même durée que le bouton : un seul vocabulaire de feedback |
| Focus ring | Apparition de l'anneau | Couvert — **jamais animé** : le focus est une information de position, pas un effet ; il apparaît instantanément |
| Chevron expandable | Rotation 180° | Couvert — motion.base, transform seul (pas de layout) |
| Expansion de la carte | Le contenu se déplie | Couvert — motion.base ; reduced-motion : bascule sans transition |
| Apparition de l'alert réactif | Injection après une action | Couvert — apparition par opacité, jamais de slide qui pousse le contenu (le saut de lecture est le risque, cf. ALERT-UX) |
| Disparition de l'alert (dismiss/résolution) | Sortie de scène | Couvert — sortie plus courte que l'entrée ; la disparition n'est jamais *que* visuelle (annonce AT, cf. ALERT-UX) |
| Skeleton | Pulse d'attente | Couvert — animation lente et discrète, en boucle : le seul mouvement répétitif autorisé, désactivé sous reduced-motion (l'attente reste visible, statique) |
| Bouton loading | Label → indicateur | Couvert — le spinner tourne (rotation continue), reduced-motion : indicateur statique ou pulse d'opacité |
| Transition d'état de l'input (repos → error) | Bordure qui change de couleur | Couvert — motion.fast sur la couleur ; le message d'erreur, lui, apparaît sans délai |

## 2. Par fonction du mouvement

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Feedback (confirmer une action) | Hover, press, state layers | Couvert — la fonction n°1, durées courtes |
| Continuité (relier deux états) | Chevron, expansion, apparition/disparition | Couvert — le mouvement explique d'où vient le changement |
| Attente (signaler un traitement) | Skeleton, spinner | Couvert |
| Attention (attirer l'œil) | Pulse sur un élément à remarquer | Couvert — par la négative : aucun consommateur, et le registre du produit (documentation, sobriété) l'exclut par défaut ; toute exception se journalise |
| Décoratif (plaisir, marque) | Animations d'ambiance | Couvert — hors registre par décision, documenté |

## 3. Par état / cas limite

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Interruption (agir pendant la transition) | Re-hover pendant la sortie du hover, double clic sur le chevron | Couvert d'office — la transition est interruptible et repart de l'état courant (jamais de file d'attente d'animations) ; c'est le "état transitoire de l'état transitoire" |
| Animations simultanées | Plusieurs cartes qui réagissent en même temps | Couvert après test — pas de stagger décoratif ; ce qui réagit ensemble bouge ensemble |
| Contenu qui bouge sans action utilisateur | Insertion dynamique qui pousse la page | Couvert — règle héritée de ALERT-UX (réserver l'espace) ; le déplacement non sollicité est le mouvement le plus hostile |
| Transition au chargement de page | Tout anime à l'arrivée | Couvert après test — rien n'anime au chargement initial (l'alert proactif est du contenu comme un autre, la règle se généralise) |

## 4. Par plateforme / accessibilité

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| prefers-reduced-motion | Troubles vestibulaires, préférence système | Couvert — règle cardinale : les déplacements/rotations/échelles se désactivent, les changements d'opacité et de couleur peuvent rester ; l'information portée par le mouvement doit avoir un équivalent statique |
| WCAG 2.2.2 (Pause, Stop, Hide) | Mouvement > 5s contrôlable | Couvert — seul le skeleton boucle : indicateur de progression, exemption prévue par le critère, mais désactivé sous reduced-motion par choix |
| WCAG 2.3.3 (Animation from Interactions, AAA) | Toute animation d'interaction désactivable | Couvert — reduced-motion appliqué systématiquement y couvre l'esprit |
| Tactile | Pas de hover ; le press remplace | Couvert — le feedback de press existe partout où le hover existe |
| Performance (jank) | Animation qui saccade | Couvert — transform et opacity seuls ; jamais width/height/top/margin (layout) ni box-shadow brut au hover (composite : l'ombre pré-rendue passe par l'opacité d'un pseudo-élément, technique documentée dans MOTION-UI) |

## 5. Par enjeu / risque

| Cas d'usage | Description | Particularité de contexte |
|---|---|---|
| Mouvement qui bloque | L'utilisateur attend la fin d'une animation pour agir | Couvert — le mouvement ne verrouille jamais l'interaction ; durées plafonnées |
| Durées trop longues | Produit qui paraît lent | Couvert — échelle courte plafonnée, la plus longue durée du système reste sous le seuil de perception d'attente |
| Vocabulaire incohérent | Chaque composant sa durée, sa courbe | Couvert — c'est la raison d'être des tokens motion.* |
| Mouvement porteur d'information sans équivalent | La rotation du chevron est le seul indice d'état | Couvert — l'état est toujours exposé techniquement (aria-expanded), le mouvement est une confirmation, jamais la source |

---

## Bilan du test de couverture

Sur **28 cas recensés**, **3 étaient non couverts après la première rédaction** de MOTION-UX.md.

**Comblés en 1.0.0 (avant livraison)** : animations simultanées (pas de stagger décoratif), chargement de page (rien n'anime à l'arrivée), et le cas interruption écrit d'office — le prédicteur "état transitoire", appliqué à la fondation qui *est* l'état transitoire, désignait l'interruption comme le trou probable : confirmé à la relecture de la première passe, comblé avant livraison.

**Reste non couvert** : rien de signalé au-delà des composants à naître (toast : ses durées d'auto-dismiss appartiendront au toast, la fondation ne fournit que le vocabulaire d'entrée/sortie).

**Note de méthode** : ratio 3/28 — le plus bas de la série. Même lecture que l'iconographie : les fondations tardives capitalisent. La particularité ici : l'inventaire a servi *pendant* la rédaction (checklist des micro-interactions existantes, section 1) autant qu'après (test de couverture) — pour une fondation transversale aux comportements, l'inventaire est moins une carte des situations qu'une carte des consommateurs.
